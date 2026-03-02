from django.conf import settings
from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        message = "Internal server error" if settings.ENVIRONMENT == "prod" else str(exc)
        return _wrapped(500, message, {"error": "server_error"})

    data = response.data
    if isinstance(data, dict):
        message = data.get("detail") or data.get("message") or "Request failed"
    else:
        message = "Request failed"
    if settings.ENVIRONMENT == "prod" and response.status_code >= 500:
        message = "Internal server error"

    return _wrapped(response.status_code, str(message), data)


def _wrapped(status_code: int, message: str, data):
    from rest_framework.response import Response

    return Response(
        {
            "status": 200 <= status_code < 300,
            "message": message,
            "data": data if isinstance(data, (dict, list)) else {"detail": data},
        },
        status=status_code,
    )
