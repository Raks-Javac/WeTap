from django.db import models


class PaymentWebhookEvent(models.Model):
    reference = models.CharField(max_length=64, db_index=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
