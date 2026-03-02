import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Transaction",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("reference", models.CharField(max_length=64, unique=True)),
                ("type", models.CharField(max_length=20)),
                ("status", models.CharField(choices=[("PENDING", "PENDING"), ("SUCCESS", "SUCCESS"), ("FAILED", "FAILED"), ("REVERSED", "REVERSED")], default="PENDING", max_length=20)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=14)),
                ("fee", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("currency", models.CharField(default="NGN", max_length=3)),
                ("merchant", models.CharField(blank=True, max_length=120)),
                ("description", models.CharField(blank=True, max_length=255)),
                ("balance_before", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("balance_after", models.DecimalField(blank=True, decimal_places=2, max_digits=14, null=True)),
                ("processor_status", models.CharField(blank=True, max_length=50)),
                ("processor_code", models.CharField(blank=True, max_length=50)),
                ("processor_payload", models.JSONField(blank=True, default=dict)),
                ("risk_score", models.IntegerField(default=0)),
                ("flagged", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="transactions", to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["user", "created_at"], name="idx_tx_user_created")]},
        ),
        migrations.CreateModel(
            name="IdempotencyRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=128)),
                ("action", models.CharField(max_length=60)),
                ("completed", models.BooleanField(default=False)),
                ("response_data", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, to="users.user")),
            ],
            options={"unique_together": {("user", "key", "action")}},
        ),
    ]
