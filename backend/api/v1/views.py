from django.conf import settings
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from core.permissions import IsAdminRole
from core.responses import api_response
from core.pagination import StandardPagination
from apps.authn.services import OTPService
from apps.users.models import User
from apps.users.services import set_user_pin, verify_pin_hash
from apps.cards.models import Card
from apps.kyc.models import KYCProfile
from apps.audit.models import AuditLog
from apps.wallets.models import Wallet
from apps.nfc.services import initiate_nfc_session, assert_nfc_session
from apps.payments.processors import get_payment_processor
from apps.payments.services import fund_wallet, execute_nfc_payment
from apps.transactions.models import Transaction
from apps.transactions.services import transaction_list, transaction_by_reference
from apps.bills import services as bill_services
from apps.transfers import services as transfer_services
from apps.transfers.models import Transfer
from apps.bills.models import BillPayment
from apps.chat.services import send_message
from apps.chat.models import ChatThread
from apps.admin_panel.services import dashboard_stats, approve_kyc, reject_kyc, block_card
from api.v1.serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    OnboardingSerializer,
    CardProvisionSerializer,
    ChangePinSerializer,
    FundWalletSerializer,
    NFCInitiateSerializer,
    NFCExecuteSerializer,
    BillValidateSerializer,
    BillPaySerializer,
    ResolveAccountSerializer,
    ResolveWetapSerializer,
    TransferInitiateSerializer,
    KYCSubmitSerializer,
    ChatMessageSerializer,
    AdminLoginSerializer,
    KYCRejectSerializer,
)


def user_payload(user: User):
    kyc = KYCProfile.objects.filter(user=user).first()
    wallet = Wallet.objects.filter(user=user).first()
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "tap_mode": user.tap_mode,
        "is_new": user.is_new,
        "kyc_status": kyc.status if kyc else "pending",
        "wallet": {
            "balance": str(wallet.balance) if wallet else "0.00",
            "currency": wallet.currency if wallet else "NGN",
        },
    }


def tx_payload(tx: Transaction):
    return {
        "id": str(tx.id),
        "reference": tx.reference,
        "type": tx.type,
        "status": tx.status,
        "amount": str(tx.amount),
        "fee": str(tx.fee),
        "merchant": tx.merchant,
        "balance_before": str(tx.balance_before) if tx.balance_before is not None else None,
        "balance_after": str(tx.balance_after) if tx.balance_after is not None else None,
        "timestamp": tx.created_at,
        "processor_metadata": tx.processor_payload,
        "risk_score": tx.risk_score,
        "flagged": tx.flagged,
    }


class OTPRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = OTPService.request_otp(serializer.validated_data["email"], request.META.get("REMOTE_ADDR", ""))
        payload = {"email": data["email"], "ttl": data["ttl"]}
        if settings.ENVIRONMENT != "prod":
            payload["debug_otp"] = data["otp"]
        return api_response(True, "OTP requested", payload)


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, created = OTPService.verify_otp(serializer.validated_data["email"], serializer.validated_data["otp"])

        refresh = RefreshToken.for_user(user)
        return api_response(
            True,
            "OTP verified",
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_payload(user),
                "is_new": created or user.is_new,
            },
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get("refresh")
        if token:
            try:
                RefreshToken(token).blacklist()
            except Exception:
                pass
        return api_response(True, "Logged out", None)


class WrappedTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return api_response(True, "Token refreshed", response.data, http_status=response.status_code)


class CompleteOnboardingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OnboardingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.tap_mode = serializer.validated_data["tap_mode"]
        pin_hash = serializer.validated_data["pin_hash"]
        if not pin_hash.startswith(("$2a$", "$2b$", "$2y$")):
            return api_response(False, "pin_hash must be a bcrypt hash", None, http_status=400)
        request.user.pin_hash = pin_hash
        request.user.is_new = False
        request.user.save(update_fields=["tap_mode", "pin_hash", "is_new", "updated_at"])
        return api_response(True, "Onboarding complete", user_payload(request.user))


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_response(True, "User profile", user_payload(request.user))

    def patch(self, request):
        allowed = {"full_name", "phone"}
        for key, value in request.data.items():
            if key in allowed:
                setattr(request.user, key, value)
        request.user.save(update_fields=["full_name", "phone", "updated_at"])
        return api_response(True, "User updated", user_payload(request.user))


class SubmitKYCView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = KYCSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile, _ = KYCProfile.objects.get_or_create(user=request.user)
        for key, value in serializer.validated_data.items():
            setattr(profile, key, value)
        profile.status = "pending"
        profile.save()
        return api_response(True, "KYC submitted", {"status": profile.status})


class ChangePinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePinSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        current = serializer.validated_data.get("current_pin")
        if request.user.pin_hash and current and not verify_pin_hash(request.user, current):
            return api_response(False, "Current pin is invalid", None, http_status=400)
        set_user_pin(request.user, serializer.validated_data["new_pin"])
        return api_response(True, "PIN changed", None)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = Wallet.objects.get(user=request.user)
        recent = Transaction.objects.filter(user=request.user).order_by("-created_at")[:5]
        return api_response(
            True,
            "Dashboard",
            {
                "user": user_payload(request.user),
                "wallet": {
                    "balance": str(wallet.balance),
                    "currency": wallet.currency,
                    "virtual_account": {
                        "number": wallet.virtual_account_number,
                        "name": wallet.virtual_account_name,
                        "bank": wallet.virtual_bank_name,
                    },
                },
                "recent_transactions": [tx_payload(tx) for tx in recent],
            },
        )


class CardProvisionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CardProvisionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if settings.ENVIRONMENT == "prod" and not serializer.validated_data.get("encrypted_card_data"):
            return api_response(False, "encrypted_card_data is required in prod", None, http_status=400)

        processor = get_payment_processor()
        payload = serializer.validated_data
        if "pan" in payload:
            payload["pan"] = payload["pan"].replace(" ", "")
        tokenized = processor.tokenize_card(payload)
        token = tokenized.get("token") or tokenized.get("payload", {}).get("token", "masked-token")
        from core.security import FieldCipher

        card = Card.objects.create(
            user=request.user,
            token_encrypted=FieldCipher.encrypt(token),
            last4=tokenized.get("last4", payload.get("pan", "0000")[-4:]),
            expiry_month=payload.get("expiry_month", "01"),
            expiry_year=payload.get("expiry_year", "2030"),
            brand=tokenized.get("brand", "VISA"),
        )
        return api_response(True, "Card provisioned", {"card_id": str(card.id), "last4": card.last4, "status": card.status})


class FundWalletView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FundWalletSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tx = fund_wallet(request.user, serializer.validated_data["amount"], request.headers.get("Idempotency-Key", ""))
        return api_response(True, "Wallet funded", tx_payload(tx))


class NFCInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NFCInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = initiate_nfc_session(request.user, serializer.validated_data["nfc_data"])
        return api_response(
            True,
            "NFC session initiated",
            {
                "session_id": str(session.id),
                "merchant": session.merchant_name,
                "amount": str(session.amount),
                "expiry": session.expires_at,
            },
        )


class NFCExecuteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NFCExecuteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = assert_nfc_session(request.user, str(serializer.validated_data["session_id"]))
        tx = execute_nfc_payment(
            request.user,
            session,
            str(serializer.validated_data["card_id"]),
            serializer.validated_data["method"],
            serializer.validated_data["amount"],
            request.headers.get("Idempotency-Key", ""),
            serializer.validated_data.get("pin_hash", ""),
        )
        return api_response(True, "NFC payment executed", tx_payload(tx))


class BillCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_response(True, "Bill categories", bill_services.categories())


class BillProviderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_response(True, "Bill providers", bill_services.providers(request.query_params.get("category", "")))


class BillValidateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BillValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return api_response(True, "Bill validation", bill_services.validate_bill(serializer.validated_data))


class BillPayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BillPaySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tx = bill_services.pay_bill(request.user, serializer.validated_data, request.headers.get("Idempotency-Key", ""))
        return api_response(True, "Bill payment completed", tx_payload(tx))


class BanksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_response(True, "Banks", transfer_services.list_banks())


class ResolveAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResolveAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = transfer_services.resolve_account(serializer.validated_data["bank_code"], serializer.validated_data["account_number"])
        return api_response(True, "Account resolved", data)


class ResolveWetapView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResolveWetapSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = transfer_services.resolve_wetap_id(serializer.validated_data["email"])
        return api_response(True, "WeTap user resolved", data)


class TransferInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransferInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tx = transfer_services.initiate_transfer(request.user, serializer.validated_data, request.headers.get("Idempotency-Key", ""))
        return api_response(True, "Transfer processed", tx_payload(tx))


class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = transaction_list(request.user, request.query_params.get("type"), request.query_params.get("status"))
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        data = [tx_payload(tx) for tx in page]
        return api_response(
            True,
            "Transactions",
            {"items": data, "count": paginator.page.paginator.count, "page": paginator.page.number},
        )


class TransactionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ref):
        tx = transaction_by_reference(request.user, ref)
        if not tx:
            return api_response(False, "Transaction not found", None, http_status=404)
        return api_response(True, "Transaction", tx_payload(tx))


class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        thread, assistant_text, action = send_message(request.user, serializer.validated_data["message"], serializer.validated_data.get("thread_id"))
        return api_response(
            True,
            "Chat response",
            {
                "thread_id": str(thread.id),
                "assistant_message": assistant_text,
                "action": action,
            },
        )


class ChatThreadsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        threads = ChatThread.objects.filter(user=request.user).order_by("-created_at")
        data = [{"id": str(t.id), "title": t.title, "created_at": t.created_at} for t in threads]
        return api_response(True, "Chat threads", data)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identity = serializer.validated_data.get("email") or serializer.validated_data.get("username")
        if not identity:
            return api_response(False, "email or username is required", None, http_status=400)
        user = get_object_or_404(User, email=identity, is_admin=True)
        if not user.check_password(serializer.validated_data["password"]):
            return api_response(False, "Invalid admin credentials", None, http_status=400)
        refresh = RefreshToken.for_user(user)
        return api_response(
            True,
            "Admin login successful",
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "admin": {"id": str(user.id), "email": user.email, "role": user.admin_role},
            },
        )


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        return api_response(True, "Admin stats", dashboard_stats())


class AdminTransactionsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = Transaction.objects.all().order_by("-created_at")
        status_filter = request.query_params.get("status")
        type_filter = request.query_params.get("type")
        if status_filter:
            qs = qs.filter(status=status_filter)
        if type_filter:
            qs = qs.filter(type=type_filter)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        return api_response(
            True,
            "Admin transactions",
            {"items": [tx_payload(t) for t in page], "count": paginator.page.paginator.count, "page": paginator.page.number},
        )


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = User.objects.filter(is_admin=False).order_by("-created_at")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        data = [user_payload(u) for u in page]
        return api_response(True, "Users", {"items": data, "count": paginator.page.paginator.count, "page": paginator.page.number})


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        return api_response(True, "User detail", user_payload(user))


class AdminKYCApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, user_id):
        approve_kyc(request.user, user_id)
        return api_response(True, "KYC approved", {"user_id": user_id})


class AdminKYCRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, user_id):
        serializer = KYCRejectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reject_kyc(request.user, user_id, serializer.validated_data["reason"])
        return api_response(True, "KYC rejected", {"user_id": user_id})


class AdminCardsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = Card.objects.all().order_by("-created_at")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        data = [
            {
                "id": str(c.id),
                "user_id": str(c.user_id),
                "last4": c.last4,
                "brand": c.brand,
                "status": c.status,
                "created_at": c.created_at,
            }
            for c in page
        ]
        return api_response(True, "Cards", {"items": data, "count": paginator.page.paginator.count, "page": paginator.page.number})


class AdminCardBlockView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def post(self, request, card_id):
        block_card(request.user, card_id)
        return api_response(True, "Card blocked", {"card_id": card_id})


class AdminAuditLogsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        qs = AuditLog.objects.all().order_by("-created_at")
        paginator = StandardPagination()
        page = paginator.paginate_queryset(qs, request)
        data = [
            {
                "id": item.id,
                "actor": str(item.actor_user_id) if item.actor_user_id else None,
                "action": item.action,
                "resource_type": item.resource_type,
                "resource_id": item.resource_id,
                "metadata": item.metadata,
                "created_at": item.created_at,
            }
            for item in page
        ]
        return api_response(
            True,
            "Audit logs",
            {"items": data, "count": paginator.page.paginator.count, "page": paginator.page.number},
        )
