from apps.bills.models import BillPayment


class BillPaymentRepository:
    @staticmethod
    def create(**kwargs):
        return BillPayment.objects.create(**kwargs)
