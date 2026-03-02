from django.db import models


class AuditLog(models.Model):
    actor_user = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=120)
    resource_type = models.CharField(max_length=80)
    resource_id = models.CharField(max_length=80, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    ip_address = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["created_at"], name="idx_audit_created")]
