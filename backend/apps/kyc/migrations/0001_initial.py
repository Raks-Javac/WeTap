from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="KYCProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("status", models.CharField(choices=[("pending", "pending"), ("verified", "verified"), ("rejected", "rejected")], default="pending", max_length=20)),
                ("bvn", models.CharField(blank=True, max_length=20)),
                ("nin", models.CharField(blank=True, max_length=20)),
                ("address", models.TextField(blank=True)),
                ("rejection_reason", models.CharField(blank=True, max_length=255)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="kyc_profile", to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["user"], name="idx_kyc_user")]},
        )
    ]
