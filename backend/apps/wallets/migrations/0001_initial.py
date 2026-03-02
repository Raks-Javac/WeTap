import uuid
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Wallet",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("currency", models.CharField(default="NGN", max_length=3)),
                ("balance", models.DecimalField(decimal_places=2, default=Decimal("0.00"), max_digits=14)),
                ("virtual_account_number", models.CharField(blank=True, max_length=30)),
                ("virtual_account_name", models.CharField(blank=True, max_length=120)),
                ("virtual_bank_name", models.CharField(blank=True, max_length=120)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="wallet", to="users.user")),
            ],
        ),
    ]
