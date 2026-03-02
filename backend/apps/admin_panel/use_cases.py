from rest_framework.exceptions import ValidationError
from apps.audit.services import create_audit_log
from .repositories import AdminRepository, KYCRepository, CardRepository


def dashboard_stats():
    return AdminRepository.dashboard_stats()


def approve_kyc(admin_user, target_user_id: str):
    profile = KYCRepository.by_user_id(target_user_id)
    if not profile:
        raise ValidationError("KYC not found")
    profile.status = "verified"
    profile.rejection_reason = ""
    profile.save(update_fields=["status", "rejection_reason", "updated_at"])
    create_audit_log(admin_user, "KYC_APPROVE", "kyc_profile", str(profile.user_id))


def reject_kyc(admin_user, target_user_id: str, reason: str):
    profile = KYCRepository.by_user_id(target_user_id)
    if not profile:
        raise ValidationError("KYC not found")
    profile.status = "rejected"
    profile.rejection_reason = reason
    profile.save(update_fields=["status", "rejection_reason", "updated_at"])
    create_audit_log(admin_user, "KYC_REJECT", "kyc_profile", str(profile.user_id), metadata={"reason": reason})


def block_card(admin_user, card_id: str):
    card = CardRepository.by_id(card_id)
    if not card:
        raise ValidationError("Card not found")
    card.status = card.STATUS_FROZEN
    card.save(update_fields=["status"])
    create_audit_log(admin_user, "CARD_BLOCK", "card", str(card_id))
