import uuid
from decimal import Decimal
from django.db import models


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="wallet")
    currency = models.CharField(max_length=3, default="NGN")
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal("0.00"))
    virtual_account_number = models.CharField(max_length=30, blank=True)
    virtual_account_name = models.CharField(max_length=120, blank=True)
    virtual_bank_name = models.CharField(max_length=120, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
