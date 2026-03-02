from apps.users.models import User
from apps.transactions.models import Transaction
from apps.cards.models import Card
from apps.kyc.models import KYCProfile


class AdminRepository:
    @staticmethod
    def dashboard_stats():
        return {
            "users": User.objects.filter(is_admin=False).count(),
            "transactions": Transaction.objects.count(),
            "success_transactions": Transaction.objects.filter(status="SUCCESS").count(),
            "cards": Card.objects.count(),
        }


class KYCRepository:
    @staticmethod
    def by_user_id(user_id: str):
        return KYCProfile.objects.filter(user_id=user_id).first()


class CardRepository:
    @staticmethod
    def by_id(card_id: str):
        return Card.objects.filter(id=card_id).first()
