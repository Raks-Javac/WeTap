from django.db import models


class Transfer(models.Model):
    transaction = models.OneToOneField("transactions.Transaction", on_delete=models.CASCADE, related_name="transfer")
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    reference = models.CharField(max_length=64, unique=True)
    bank_code = models.CharField(max_length=10, blank=True)
    account_number = models.CharField(max_length=20, blank=True)
    account_name = models.CharField(max_length=120, blank=True)
    wetap_user = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="incoming_transfers")
    fee = models.DecimalField(max_digits=14, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["reference"], name="idx_transfer_ref")]
