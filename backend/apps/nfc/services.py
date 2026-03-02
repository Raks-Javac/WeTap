from datetime import timedelta
from django.core.cache import cache
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.nfc.models import NFCSession


def initiate_nfc_session(user, nfc_data: str):
    amount = 1500.00
    session = NFCSession.objects.create(
        user=user,
        merchant_name="Demo Merchant",
        merchant_id="MERCH_DEMO_001",
        amount=amount,
        nfc_payload=nfc_data,
        expires_at=timezone.now() + timedelta(minutes=3),
    )
    cache.set(f"nfc:{session.id}", {"user_id": str(user.id), "amount": float(amount)}, timeout=180)
    return session


def assert_nfc_session(user, session_id: str):
    session = NFCSession.objects.filter(id=session_id, user=user, consumed=False).first()
    if not session:
        raise ValidationError("Invalid session")
    if session.expires_at < timezone.now():
        raise ValidationError("Session expired")
    return session
