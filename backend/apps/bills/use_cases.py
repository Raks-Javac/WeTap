from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from core.idempotency import assert_idempotent
from core.utils import generate_reference, to_decimal
from core.constants import TX_PENDING, TX_SUCCESS, TX_FAILED
from apps.payments.processors import get_payment_processor
from apps.transactions.models import Transaction
from apps.wallets.services import debit_wallet_atomic
from apps.payments.services import _enforce_kyc
from .repositories import BillPaymentRepository


def categories():
    key = "bill:categories"
    data = cache.get(key)
    if data:
        return data
    data = get_payment_processor().get_biller_categories()
    cache.set(key, data, timeout=300)
    return data


def providers(category: str):
    key = f"bill:providers:{category or 'all'}"
    data = cache.get(key)
    if data:
        return data
    data = get_payment_processor().get_billers(category=category)
    cache.set(key, data, timeout=300)
    return data


def validate_bill(payload: dict):
    if not payload.get("customer_identifier"):
        raise ValidationError("customer_identifier is required")
    return {"valid": True, "customer_name": "Demo Customer"}


def pay_bill(user, payload: dict, idempotency_key: str):
    if not idempotency_key:
        raise ValidationError("Idempotency-Key header is required")
    idempotent = assert_idempotent(user.id, idempotency_key, "bill_pay")

    amount = to_decimal(payload.get("amount", 0))
    _enforce_kyc(user, amount)

    reference = generate_reference("bill")
    tx = Transaction.objects.create(user=user, reference=reference, type=Transaction.TYPE_BILL, status=TX_PENDING, amount=amount)

    processor_result = get_payment_processor().pay_bills({"reference": reference, **payload})
    if processor_result.get("status") == "SUCCESS":
        before, after = debit_wallet_atomic(user, amount)
        tx.status = TX_SUCCESS
        tx.balance_before = before
        tx.balance_after = after
    else:
        tx.status = TX_FAILED

    tx.processor_status = processor_result.get("status", "UNKNOWN")
    tx.processor_payload = processor_result
    tx.save()

    BillPaymentRepository.create(
        transaction=tx,
        user=user,
        reference=reference,
        category=payload.get("category", ""),
        provider=payload.get("provider", ""),
        item_code=payload.get("item_code", ""),
        customer_identifier=payload.get("customer_identifier", ""),
    )

    idempotent.completed = True
    idempotent.response_data = {"reference": tx.reference, "status": tx.status}
    idempotent.save(update_fields=["completed", "response_data"])
    return tx
