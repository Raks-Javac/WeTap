from decimal import Decimal
from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.wallets.models import Wallet


def debit_wallet_atomic(user, amount: Decimal, fee: Decimal = Decimal("0.00")):
    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(user=user)
        total = amount + fee
        if wallet.balance < total:
            raise ValidationError("Insufficient balance")
        before = wallet.balance
        wallet.balance = wallet.balance - total
        wallet.save(update_fields=["balance", "updated_at"])
        return before, wallet.balance


def credit_wallet_atomic(user, amount: Decimal):
    with transaction.atomic():
        wallet = Wallet.objects.select_for_update().get(user=user)
        before = wallet.balance
        wallet.balance = wallet.balance + amount
        wallet.save(update_fields=["balance", "updated_at"])
        return before, wallet.balance
