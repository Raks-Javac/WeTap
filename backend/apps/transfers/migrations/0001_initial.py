from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial"), ("transactions", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Transfer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("reference", models.CharField(max_length=64, unique=True)),
                ("bank_code", models.CharField(blank=True, max_length=10)),
                ("account_number", models.CharField(blank=True, max_length=20)),
                ("account_name", models.CharField(blank=True, max_length=120)),
                ("fee", models.DecimalField(decimal_places=2, max_digits=14)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("transaction", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="transfer", to="transactions.transaction")),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, to="users.user")),
                ("wetap_user", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name="incoming_transfers", to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["reference"], name="idx_transfer_ref")]},
        )
    ]
