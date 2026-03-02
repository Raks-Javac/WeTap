from celery import shared_task
from apps.transactions.models import Transaction
from apps.payments.processors import get_payment_processor


@shared_task
def reconcile_transaction(reference: str):
    tx = Transaction.objects.filter(reference=reference).first()
    if not tx:
        return {"status": "not_found"}
    data = get_payment_processor().query_transaction(reference)
    tx.processor_payload = {**tx.processor_payload, "reconcile": data}
    tx.save(update_fields=["processor_payload", "updated_at"])
    return data


@shared_task
def send_notification(user_id: str, message: str):
    return {"user_id": user_id, "message": message, "delivered": True}
