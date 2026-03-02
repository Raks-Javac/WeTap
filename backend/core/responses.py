from typing import Any
from rest_framework.response import Response


def api_response(status: bool, message: str, data: Any, http_status: int = 200) -> Response:
    return Response({"status": status, "message": message, "data": data}, status=http_status)
