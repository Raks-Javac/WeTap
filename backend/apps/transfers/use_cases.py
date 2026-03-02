from rest_framework.exceptions import ValidationError
from core.constants import NGN_TRANSFER_FEE, TX_PENDING, TX_SUCCESS, TX_FAILED
from core.idempotency import assert_idempotent
from core.utils import generate_reference, to_decimal
from apps.transactions.models import Transaction
from apps.wallets.services import debit_wallet_atomic, credit_wallet_atomic
from apps.payments.services import _enforce_kyc
from apps.payments.processors import get_payment_processor
from .repositories import TransferRepository, UserLookupRepository

BANKS = [
    {"code": "044", "name": "Access Bank"},
    {"code": "058", "name": "GTBank"},
    {"code": "011", "name": "First Bank"},
]


def list_banks():
    return BANKS


def resolve_account(bank_code: str, account_number: str):
    if not bank_code or not account_number:
        raise ValidationError("bank_code and account_number are required")
    return {"account_name": "Resolved Account", "account_number": account_number, "bank_code": bank_code}


def resolve_wetap_id(email: str):
    user = UserLookupRepository.by_email(email)
    if not user:
        raise ValidationError("WeTap user not found")
    return {"user_id": str(user.id), "email": user.email, "name": user.full_name}


def initiate_transfer(user, payload: dict, idempotency_key: str):
    if not idempotency_key:
        raise ValidationError("Idempotency-Key header is required")
    idempotent = assert_idempotent(user.id, idempotency_key, "transfer_initiate")

    amount = to_decimal(payload.get("amount", 0))
    _enforce_kyc(user, amount)

    reference = generate_reference("trf")
    tx = Transaction.objects.create(
        user=user,
        reference=reference,
        type=Transaction.TYPE_TRANSFER,
        status=TX_PENDING,
        amount=amount,
        fee=NGN_TRANSFER_FEE,
    )

    target_user = None
    wetap_email = payload.get("wetap_email")
    if wetap_email:
        target_user = UserLookupRepository.by_email(wetap_email)

    processor_result = get_payment_processor().initiate_transfer({"reference": reference, **payload})

    if processor_result.get("status") == "SUCCESS":
        before, after = debit_wallet_atomic(user, amount, NGN_TRANSFER_FEE)
        tx.status = TX_SUCCESS
        tx.balance_before = before
        tx.balance_after = after
        if target_user:
            credit_wallet_atomic(target_user, amount)
    else:
        tx.status = TX_FAILED

    tx.processor_status = processor_result.get("status", "UNKNOWN")
    tx.processor_payload = processor_result
    tx.save()

    TransferRepository.create(
        transaction=tx,
        user=user,
        reference=reference,
        bank_code=payload.get("bank_code", ""),
        account_number=payload.get("account_number", ""),
        account_name=payload.get("account_name", ""),
        wetap_user=target_user,
        fee=NGN_TRANSFER_FEE,
    )

    idempotent.completed = True
    idempotent.response_data = {"reference": tx.reference, "status": tx.status}
    idempotent.save(update_fields=["completed", "response_data"])
    return tx
