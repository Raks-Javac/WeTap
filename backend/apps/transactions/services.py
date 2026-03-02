from apps.transactions.models import Transaction


def transaction_list(user, tx_type=None, status=None):
    qs = Transaction.objects.filter(user=user).order_by("-created_at")
    if tx_type:
        qs = qs.filter(type=tx_type)
    if status:
        qs = qs.filter(status=status)
    return qs


def transaction_by_reference(user, reference: str):
    return Transaction.objects.filter(user=user, reference=reference).first()
