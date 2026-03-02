import uuid
from django.db import models
from core.constants import TX_STATUS_CHOICES, TX_PENDING


class Transaction(models.Model):
    TYPE_FUND = "FUND"
    TYPE_NFC = "NFC"
    TYPE_BILL = "BILL"
    TYPE_TRANSFER = "TRANSFER"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="transactions")
    reference = models.CharField(max_length=64, unique=True)
    type = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=[(s, s) for s in TX_STATUS_CHOICES], default=TX_PENDING)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    fee = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="NGN")
    merchant = models.CharField(max_length=120, blank=True)
    description = models.CharField(max_length=255, blank=True)
    balance_before = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    balance_after = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    processor_status = models.CharField(max_length=50, blank=True)
    processor_code = models.CharField(max_length=50, blank=True)
    processor_payload = models.JSONField(default=dict, blank=True)
    risk_score = models.IntegerField(default=0)
    flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_at"], name="idx_tx_user_created"),
        ]


class IdempotencyRecord(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    key = models.CharField(max_length=128)
    action = models.CharField(max_length=60)
    completed = models.BooleanField(default=False)
    response_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "key", "action")
