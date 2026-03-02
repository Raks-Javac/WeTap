"""
Interswitch references:
https://docs.interswitchgroup.com/reference/how-to-use-the-reference
https://docs.interswitchgroup.com/docs/card360-test-card-data-encryption
https://docs.interswitchgroup.com/docs/road-to-go-live-with-interswitch-apis
https://docs.interswitchgroup.com/reference/tokenize-card-recurrents
https://docs.interswitchgroup.com/reference/card-payment-api
https://docs.interswitchgroup.com/reference/get-transactions
https://docs.interswitchgroup.com/reference/query-transaction-1
https://docs.interswitchgroup.com/reference/send-transaction
https://docs.interswitchgroup.com/reference/get-billers
https://docs.interswitchgroup.com/reference/get-billers-categories
https://docs.interswitchgroup.com/reference/get-billers-by-category-2
https://docs.interswitchgroup.com/reference/get-biller-payment-item
https://github.com/techquest/isw-react-sdk
"""
import hashlib
from abc import ABC, abstractmethod
from django.conf import settings


class BasePaymentProcessor(ABC):
    @abstractmethod
    def tokenize_card(self, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def charge_card(self, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def initiate_transfer(self, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def pay_bills(self, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def query_transaction(self, reference: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def get_billers(self, category: str = "") -> list:
        raise NotImplementedError

    @abstractmethod
    def get_biller_categories(self) -> list:
        raise NotImplementedError

    @abstractmethod
    def get_biller_items(self, provider: str) -> list:
        raise NotImplementedError


class MockPaymentProcessor(BasePaymentProcessor):
    def tokenize_card(self, payload: dict) -> dict:
        pan = payload.get("pan", "0000")
        token = hashlib.sha256(f"mock:{pan}".encode()).hexdigest()
        return {"status": "SUCCESS", "token": token, "last4": pan[-4:], "brand": "VISA"}

    def charge_card(self, payload: dict) -> dict:
        return {
            "status": "SUCCESS",
            "code": "00",
            "processor_reference": f"MCK-{payload.get('reference')}",
            "message": "Approved",
        }

    def initiate_transfer(self, payload: dict) -> dict:
        return {"status": "SUCCESS", "code": "00", "message": "Transfer queued"}

    def pay_bills(self, payload: dict) -> dict:
        return {"status": "SUCCESS", "code": "00", "message": "Bill paid"}

    def query_transaction(self, reference: str) -> dict:
        return {"status": "SUCCESS", "reference": reference, "code": "00"}

    def get_billers(self, category: str = "") -> list:
        providers = [
            {"code": "DSTV", "name": "DSTV"},
            {"code": "EKEDC", "name": "Eko Electric"},
            {"code": "MTN", "name": "MTN Airtime"},
        ]
        if category:
            return providers
        return providers

    def get_biller_categories(self) -> list:
        return [{"code": "tv", "name": "TV"}, {"code": "power", "name": "Power"}, {"code": "airtime", "name": "Airtime"}]

    def get_biller_items(self, provider: str) -> list:
        return [{"code": f"{provider}_1000", "amount": 1000}, {"code": f"{provider}_5000", "amount": 5000}]


class InterswitchProcessor(BasePaymentProcessor):
    def __init__(self):
        self.base_url = settings.INTERSWITCH_BASE_URL
        self.client_id = settings.INTERSWITCH_CLIENT_ID

    def _stub(self, name: str, payload=None):
        return {"status": "PENDING", "integration": "interswitch", "operation": name, "payload": payload or {}}

    def tokenize_card(self, payload: dict) -> dict:
        return self._stub("tokenize_card", payload)

    def charge_card(self, payload: dict) -> dict:
        return self._stub("charge_card", payload)

    def initiate_transfer(self, payload: dict) -> dict:
        return self._stub("initiate_transfer", payload)

    def pay_bills(self, payload: dict) -> dict:
        return self._stub("pay_bills", payload)

    def query_transaction(self, reference: str) -> dict:
        return self._stub("query_transaction", {"reference": reference})

    def get_billers(self, category: str = "") -> list:
        return [self._stub("get_billers", {"category": category})]

    def get_biller_categories(self) -> list:
        return [self._stub("get_biller_categories")]

    def get_biller_items(self, provider: str) -> list:
        return [self._stub("get_biller_items", {"provider": provider})]


def get_payment_processor():
    env = settings.ENVIRONMENT
    if env == "prod":
        if settings.USE_MOCK_PROCESSOR:
            raise RuntimeError("Mock processor is disabled in prod")
        return InterswitchProcessor()

    if env == "uat" and not settings.USE_MOCK_PROCESSOR and settings.INTERSWITCH_CLIENT_ID:
        return InterswitchProcessor()

    return MockPaymentProcessor()
