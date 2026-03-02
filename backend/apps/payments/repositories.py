from apps.transactions.models import Transaction
from apps.kyc.models import KYCProfile
from apps.cards.models import Card


class KYCRepository:
    @staticmethod
    def by_user(user):
        return KYCProfile.objects.filter(user=user).first()


class CardRepository:
    @staticmethod
    def active_for_user(card_id, user):
        return Card.objects.filter(id=card_id, user=user, status=Card.STATUS_ACTIVE).first()


class TransactionRepository:
    @staticmethod
    def create(**kwargs):
        return Transaction.objects.create(**kwargs)
