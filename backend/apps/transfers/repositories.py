from apps.transfers.models import Transfer
from apps.users.models import User


class TransferRepository:
    @staticmethod
    def create(**kwargs):
        return Transfer.objects.create(**kwargs)


class UserLookupRepository:
    @staticmethod
    def by_email(email: str):
        return User.objects.filter(email=email).first()
