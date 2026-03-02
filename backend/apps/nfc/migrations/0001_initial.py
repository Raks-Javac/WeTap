import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="NFCSession",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("merchant_name", models.CharField(max_length=120)),
                ("merchant_id", models.CharField(max_length=64)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=14)),
                ("nfc_payload", models.TextField()),
                ("expires_at", models.DateTimeField()),
                ("consumed", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="nfc_sessions", to="users.user")),
            ],
        )
    ]
