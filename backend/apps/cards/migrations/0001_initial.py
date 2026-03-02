import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Card",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("token_encrypted", models.TextField()),
                ("last4", models.CharField(max_length=4)),
                ("expiry_month", models.CharField(max_length=2)),
                ("expiry_year", models.CharField(max_length=4)),
                ("brand", models.CharField(default="VISA", max_length=20)),
                ("status", models.CharField(choices=[("active", "active"), ("frozen", "frozen"), ("deleted", "deleted")], default="active", max_length=20)),
                ("is_default", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="cards", to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["user"], name="idx_card_user")]},
        )
    ]
