from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="AuditLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action", models.CharField(max_length=120)),
                ("resource_type", models.CharField(max_length=80)),
                ("resource_id", models.CharField(blank=True, max_length=80)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("ip_address", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("actor_user", models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, to="users.user")),
            ],
            options={"indexes": [models.Index(fields=["created_at"], name="idx_audit_created")]},
        )
    ]
