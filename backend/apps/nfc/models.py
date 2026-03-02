import uuid
from django.db import models


class NFCSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="nfc_sessions")
    merchant_name = models.CharField(max_length=120)
    merchant_id = models.CharField(max_length=64)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    nfc_payload = models.TextField()
    expires_at = models.DateTimeField()
    consumed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
