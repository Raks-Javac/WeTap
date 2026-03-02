from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from apps.users.models import User
from apps.transactions.models import Transaction
from apps.cards.models import Card
from apps.audit.services import create_audit_log
from apps.kyc.models import KYCProfile


def admin_login(email: str, password: str):
    user = authenticate(email=email, password=password)
    if not user or not user.is_admin:
        raise ValidationError("Invalid admin credentials")
    return user


def dashboard_stats():
    return {
        "users": User.objects.filter(is_admin=False).count(),
        "transactions": Transaction.objects.count(),
        "success_transactions": Transaction.objects.filter(status="SUCCESS").count(),
        "cards": Card.objects.count(),
    }


def approve_kyc(admin_user, target_user_id: str):
    profile = KYCProfile.objects.filter(user_id=target_user_id).first()
    if not profile:
        raise ValidationError("KYC not found")
    profile.status = "verified"
    profile.rejection_reason = ""
    profile.save(update_fields=["status", "rejection_reason", "updated_at"])
    create_audit_log(admin_user, "KYC_APPROVE", "kyc_profile", str(profile.user_id))


def reject_kyc(admin_user, target_user_id: str, reason: str):
    profile = KYCProfile.objects.filter(user_id=target_user_id).first()
    if not profile:
        raise ValidationError("KYC not found")
    profile.status = "rejected"
    profile.rejection_reason = reason
    profile.save(update_fields=["status", "rejection_reason", "updated_at"])
    create_audit_log(admin_user, "KYC_REJECT", "kyc_profile", str(profile.user_id), metadata={"reason": reason})


def block_card(admin_user, card_id: str):
    card = Card.objects.filter(id=card_id).first()
    if not card:
        raise ValidationError("Card not found")
    card.status = Card.STATUS_FROZEN
    card.save(update_fields=["status"])
    create_audit_log(admin_user, "CARD_BLOCK", "card", str(card_id))
