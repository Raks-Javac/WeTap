from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings


class FieldCipher:
    @staticmethod
    def _fernet() -> Fernet:
        return Fernet(settings.FIELD_ENCRYPTION_KEY.encode())

    @classmethod
    def encrypt(cls, value: str) -> str:
        return cls._fernet().encrypt(value.encode()).decode()

    @classmethod
    def decrypt(cls, value: str) -> str:
        try:
            return cls._fernet().decrypt(value.encode()).decode()
        except InvalidToken:
            return ""
