from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from .use_cases import dashboard_stats, approve_kyc, reject_kyc, block_card


def admin_login(email: str, password: str):
    user = authenticate(email=email, password=password)
    if not user or not user.is_admin:
        raise ValidationError("Invalid admin credentials")
    return user


__all__ = ["admin_login", "dashboard_stats", "approve_kyc", "reject_kyc", "block_card"]
