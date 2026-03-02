from apps.audit.models import AuditLog


def create_audit_log(actor_user, action: str, resource_type: str, resource_id: str = "", metadata=None, ip_address: str = ""):
    AuditLog.objects.create(
        actor_user=actor_user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        metadata=metadata or {},
        ip_address=ip_address,
    )
