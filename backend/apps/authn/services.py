import random
from datetime import timedelta
from django.contrib.auth.hashers import make_password, check_password
from django.core.cache import cache
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.authn.models import OTPToken
from apps.users.models import User
from core.rate_limit import is_limited


class OTPService:
    TTL_SECONDS = 600

    @staticmethod
    def request_otp(email: str, ip_address: str):
        limit_key = f"{email}:{ip_address}"
        if is_limited("otp", limit_key, 5, 600):
            raise ValidationError("Too many OTP attempts")

        otp = f"{random.randint(0, 9999):04d}"
        cache_key = f"otp:{email}"
        cache.set(cache_key, make_password(otp), timeout=OTPService.TTL_SECONDS)

        OTPToken.objects.create(
            email=email,
            otp_hash=make_password(otp),
            expires_at=timezone.now() + timedelta(seconds=OTPService.TTL_SECONDS),
        )
        return {"email": email, "otp": otp, "ttl": OTPService.TTL_SECONDS}

    @staticmethod
    def verify_otp(email: str, otp: str):
        cache_key = f"otp:{email}"
        hashed = cache.get(cache_key)
        if not hashed:
            fallback = OTPToken.objects.filter(email=email, used=False).order_by("-created_at").first()
            if not fallback or fallback.expires_at < timezone.now() or not check_password(otp, fallback.otp_hash):
                raise ValidationError("Invalid or expired OTP")
            fallback.used = True
            fallback.save(update_fields=["used"])
        elif not check_password(otp, hashed):
            raise ValidationError("Invalid OTP")
        else:
            cache.delete(cache_key)

        user, created = User.objects.get_or_create(email=email)
        return user, created
