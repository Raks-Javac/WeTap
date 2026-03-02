from django.db import models
from core.constants import KYC_PENDING, KYC_VERIFIED, KYC_REJECTED


class KYCProfile(models.Model):
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="kyc_profile")
    status = models.CharField(
        max_length=20,
        default=KYC_PENDING,
        choices=[(KYC_PENDING, KYC_PENDING), (KYC_VERIFIED, KYC_VERIFIED), (KYC_REJECTED, KYC_REJECTED)],
    )
    bvn = models.CharField(max_length=20, blank=True)
    nin = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    rejection_reason = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user"], name="idx_kyc_user")]
