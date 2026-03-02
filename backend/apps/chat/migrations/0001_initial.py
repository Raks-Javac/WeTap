import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="ChatThread",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(blank=True, max_length=120)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="chat_threads", to="users.user")),
            ],
        ),
        migrations.CreateModel(
            name="ChatMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(choices=[("user", "user"), ("assistant", "assistant")], max_length=20)),
                ("content", models.TextField()),
                ("action", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("thread", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="messages", to="chat.chatthread")),
            ],
        ),
    ]
