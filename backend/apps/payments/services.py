from decimal import Decimal
from django.db import transaction
from rest_framework.exceptions import ValidationError
from core.constants import KYC_VERIFIED, KYC_LIMIT_AMOUNT, TX_PENDING, TX_SUCCESS, TX_FAILED
from core.exceptions import KYCRequiredException
from core.idempotency import assert_idempotent
from core.utils import generate_reference, to_decimal
from apps.cards.models import Card
from apps.transactions.models import Transaction
from apps.wallets.services import credit_wallet_atomic, debit_wallet_atomic
from apps.payments.processors import get_payment_processor
from apps.kyc.models import KYCProfile


def _enforce_kyc(user, amount: Decimal):
    profile = KYCProfile.objects.filter(user=user).first()
    if not profile:
        return
    if profile.status != KYC_VERIFIED and amount > KYC_LIMIT_AMOUNT:
        raise KYCRequiredException("KYC_REQUIRED")


def fund_wallet(user, amount, idempotency_key: str = ""):
    amount = to_decimal(amount)
    if amount <= 0:
        raise ValidationError("Amount must be positive")

    reference = generate_reference("fund")
    tx = Transaction.objects.create(user=user, reference=reference, type=Transaction.TYPE_FUND, status=TX_PENDING, amount=amount)
    processor = get_payment_processor()
    result = processor.charge_card({"reference": reference, "amount": float(amount)})

    if result.get("status") == "SUCCESS":
        before, after = credit_wallet_atomic(user, amount)
        tx.status = TX_SUCCESS
        tx.balance_before = before
        tx.balance_after = after
    else:
        tx.status = TX_FAILED

    tx.processor_status = result.get("status", "UNKNOWN")
    tx.processor_code = result.get("code", "")
    tx.processor_payload = result
    tx.save()
    return tx


def execute_nfc_payment(user, session, card_id: str, method: str, amount, idempotency_key: str, pin: str = ""):
    if not idempotency_key:
        raise ValidationError("Idempotency-Key header is required")
    idempotent = assert_idempotent(user.id, idempotency_key, "nfc_execute")

    amount = to_decimal(amount)
    _enforce_kyc(user, amount)

    card = Card.objects.filter(id=card_id, user=user).first()
    if not card or card.status != Card.STATUS_ACTIVE:
        raise ValidationError("Card unavailable")
    if method not in {"one_tap", "two_tap"}:
        raise ValidationError("Invalid method")
    if method == "two_tap" and (not pin or len(pin) != 4):
        raise ValidationError("PIN required for two_tap")

    reference = generate_reference("nfc")
    tx = Transaction.objects.create(
        user=user,
        reference=reference,
        type=Transaction.TYPE_NFC,
        status=TX_PENDING,
        amount=amount,
        merchant=session.merchant_name,
    )

    processor = get_payment_processor()
    result = processor.charge_card({"reference": reference, "amount": float(amount), "card_token": card.token_encrypted})

    with transaction.atomic():
        if result.get("status") == "SUCCESS":
            before, after = debit_wallet_atomic(user, amount)
            tx.status = TX_SUCCESS
            tx.balance_before = before
            tx.balance_after = after
            session.consumed = True
            session.save(update_fields=["consumed"])
        else:
            tx.status = TX_FAILED

        tx.processor_status = result.get("status", "UNKNOWN")
        tx.processor_code = result.get("code", "")
        tx.processor_payload = result
        tx.save()

        idempotent.completed = True
        idempotent.response_data = {"reference": tx.reference, "status": tx.status}
        idempotent.save(update_fields=["completed", "response_data"])

    return tx
