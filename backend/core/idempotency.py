from django.db import transaction
from apps.transactions.models import IdempotencyRecord
from core.exceptions import IdempotencyConflictException


def assert_idempotent(user_id: str, key: str, action: str) -> IdempotencyRecord:
    with transaction.atomic():
        record, created = IdempotencyRecord.objects.select_for_update().get_or_create(
            user_id=user_id,
            key=key,
            action=action,
        )
        if not created and record.completed:
            raise IdempotencyConflictException("Duplicate request")
        return record
