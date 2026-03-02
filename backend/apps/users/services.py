import bcrypt
from rest_framework.exceptions import ValidationError


def validate_pin(pin_hash: str):
    if not pin_hash:
        raise ValidationError("pin_hash is required")


def set_user_pin(user, plain_pin: str):
    if not plain_pin or len(plain_pin) != 4 or not plain_pin.isdigit():
        raise ValidationError("PIN must be exactly 4 digits")
    user.pin_hash = bcrypt.hashpw(plain_pin.encode(), bcrypt.gensalt()).decode()
    user.save(update_fields=["pin_hash", "updated_at"])


def verify_pin_hash(user, candidate: str) -> bool:
    if not user.pin_hash:
        return False
    return bcrypt.checkpw(candidate.encode(), user.pin_hash.encode())
