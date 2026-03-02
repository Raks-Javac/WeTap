from apps.transactions.models import Transaction


class TransactionRepository:
    @staticmethod
    def list_for_user(user, tx_type=None, status=None):
        qs = Transaction.objects.filter(user=user).order_by("-created_at")
        if tx_type:
            qs = qs.filter(type=tx_type)
        if status:
            qs = qs.filter(status=status)
        return qs

    @staticmethod
    def by_reference(user, reference: str):
        return Transaction.objects.filter(user=user, reference=reference).first()
