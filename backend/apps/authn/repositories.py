from apps.authn.models import OTPToken
from apps.users.models import User


class OTPRepository:
    @staticmethod
    def create_token(email: str, otp_hash: str, expires_at):
        return OTPToken.objects.create(email=email, otp_hash=otp_hash, expires_at=expires_at)

    @staticmethod
    def latest_unused_token(email: str):
        return OTPToken.objects.filter(email=email, used=False).order_by("-created_at").first()


class UserRepository:
    @staticmethod
    def get_or_create_by_email(email: str):
        return User.objects.get_or_create(email=email)
