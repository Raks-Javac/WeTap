from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial"), ("transactions", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="BillPayment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("reference", models.CharField(max_length=64, unique=True)),
                ("category", models.CharField(max_length=80)),
                ("provider", models.CharField(max_length=120)),
                ("item_code", models.CharField(max_length=80)),
                ("customer_identifier", models.CharField(max_length=120)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("transaction", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="bill_payment", to="transactions.transaction")),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["reference"], name="idx_bill_ref")]},
        )
    ]
