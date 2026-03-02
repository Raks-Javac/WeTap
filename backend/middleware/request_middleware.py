import json
import re
import uuid
from django.conf import settings
from django.http import JsonResponse
from core.rate_limit import is_limited

SUSPICIOUS_PATTERNS = [r"<script", r"union\\s+select", r"drop\\s+table", r"--", r";--"]


class RequestSecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.trace_id = str(uuid.uuid4())
        request.environment_header = request.headers.get("X-Environment", "").lower()

        if settings.ENVIRONMENT == "prod" and request.environment_header and request.environment_header != "prod":
            request.environment_header = "prod"

        if request.path.startswith("/api/"):
            if request.method in {"POST", "PUT", "PATCH"}:
                if "application/json" not in request.content_type:
                    return JsonResponse(_envelope(False, "Content-Type must be application/json", None), status=415)
                if request.META.get("CONTENT_LENGTH"):
                    if int(request.META["CONTENT_LENGTH"]) > settings.MAX_JSON_BODY_BYTES:
                        return JsonResponse(_envelope(False, "Payload too large", None), status=413)
                if request.body:
                    payload = request.body.decode(errors="ignore")
                    for pattern in SUSPICIOUS_PATTERNS:
                        if re.search(pattern, payload, re.IGNORECASE):
                            return JsonResponse(_envelope(False, "Suspicious payload blocked", None), status=400)
                    try:
                        json.loads(payload)
                    except json.JSONDecodeError:
                        return JsonResponse(_envelope(False, "Malformed JSON", None), status=400)

            actor = str(getattr(request.user, "id", None) or request.META.get("REMOTE_ADDR", "anon"))
            if is_limited("global", actor, settings.RATE_LIMIT_GLOBAL_PER_MIN, 60):
                return JsonResponse(_envelope(False, "Rate limit exceeded", None), status=429)

        response = self.get_response(request)
        response["X-Trace-Id"] = request.trace_id
        return response


def _envelope(status: bool, message: str, data):
    return {"status": status, "message": message, "data": data}
