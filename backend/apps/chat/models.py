import uuid
from django.db import models


class ChatThread(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="chat_threads")
    title = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    ROLE_USER = "user"
    ROLE_ASSISTANT = "assistant"

    thread = models.ForeignKey("chat.ChatThread", on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=20, choices=[(ROLE_USER, ROLE_USER), (ROLE_ASSISTANT, ROLE_ASSISTANT)])
    content = models.TextField()
    action = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
