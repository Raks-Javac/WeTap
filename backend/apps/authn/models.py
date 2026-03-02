from django.db import models


class OTPToken(models.Model):
    email = models.EmailField()
    otp_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
