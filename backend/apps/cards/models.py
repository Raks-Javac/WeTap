import uuid
from django.db import models


class Card(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_FROZEN = "frozen"
    STATUS_DELETED = "deleted"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="cards")
    token_encrypted = models.TextField()
    last4 = models.CharField(max_length=4)
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=4)
    brand = models.CharField(max_length=20, default="VISA")
    status = models.CharField(
        max_length=20,
        default=STATUS_ACTIVE,
        choices=[(STATUS_ACTIVE, STATUS_ACTIVE), (STATUS_FROZEN, STATUS_FROZEN), (STATUS_DELETED, STATUS_DELETED)],
    )
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user"], name="idx_card_user")]
