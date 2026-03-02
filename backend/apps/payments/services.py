from .use_cases import enforce_kyc, fund_wallet as fund_wallet_uc, execute_nfc_payment as execute_nfc_payment_uc


# Backward-compatible export for existing imports.
def _enforce_kyc(user, amount):
    return enforce_kyc(user=user, amount=amount)


def fund_wallet(user, amount, idempotency_key: str = ""):
    return fund_wallet_uc(user=user, amount=amount, idempotency_key=idempotency_key)


def execute_nfc_payment(user, session, card_id: str, method: str, amount, idempotency_key: str, pin: str = ""):
    return execute_nfc_payment_uc(
        user=user,
        session=session,
        card_id=card_id,
        method=method,
        amount=amount,
        idempotency_key=idempotency_key,
        pin=pin,
    )
