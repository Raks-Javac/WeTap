from django.db import models


class BillPayment(models.Model):
    transaction = models.OneToOneField("transactions.Transaction", on_delete=models.CASCADE, related_name="bill_payment")
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    reference = models.CharField(max_length=64, unique=True)
    category = models.CharField(max_length=80)
    provider = models.CharField(max_length=120)
    item_code = models.CharField(max_length=80)
    customer_identifier = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["reference"], name="idx_bill_ref")]
