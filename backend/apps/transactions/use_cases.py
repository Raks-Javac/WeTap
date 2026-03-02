from .repositories import TransactionRepository


def transaction_list(user, tx_type=None, status=None):
    return TransactionRepository.list_for_user(user=user, tx_type=tx_type, status=status)


def transaction_by_reference(user, reference: str):
    return TransactionRepository.by_reference(user=user, reference=reference)
