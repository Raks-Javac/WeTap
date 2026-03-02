from rest_framework.exceptions import APIException


class AppException(APIException):
    status_code = 400
    default_detail = "Request failed"
    default_code = "app_error"


class KYCRequiredException(AppException):
    status_code = 403
    default_detail = "KYC_REQUIRED"
    default_code = "kyc_required"


class IdempotencyConflictException(AppException):
    status_code = 409
    default_detail = "Duplicate idempotency key"
    default_code = "idempotency_conflict"
