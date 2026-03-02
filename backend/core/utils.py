import secrets
from decimal import Decimal
from django.utils import timezone


def generate_reference(prefix: str) -> str:
    return f"{prefix}_{timezone.now().strftime('%Y%m%d%H%M%S')}_{secrets.token_hex(4)}"


def to_decimal(value) -> Decimal:
    return Decimal(str(value)).quantize(Decimal("0.01"))
