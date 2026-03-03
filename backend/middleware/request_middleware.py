import json
import re
import time
import uuid
from django.conf import settings
from django.http import JsonResponse
from core.rate_limit import is_limited

SUSPICIOUS_PATTERNS = [
    r"<script",
    r"javascript:",
    r"union\s+select",
    r"drop\s+table",
    r";--",
    r"\balert\s*\(",
]
COMPILED_SUSPICIOUS_PATTERNS = []
for pattern in SUSPICIOUS_PATTERNS:
    try:
        COMPILED_SUSPICIOUS_PATTERNS.append(re.compile(pattern, re.IGNORECASE))
    except re.error:
        # Keep middleware fail-safe if a bad regex is introduced.
        continue
JSON_METHODS = {"POST", "PUT", "PATCH"}


class RequestSecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request._request_started_at = time.monotonic()
        request.trace_id = self._resolve_trace_id(request.headers.get("X-Trace-Id"))
        request.environment_header = request.headers.get("X-Environment", "").lower()
        request.payload = None

        if settings.ENVIRONMENT == "prod" and request.environment_header and request.environment_header != "prod":
            request.environment_header = "prod"

        if request.path.startswith("/api/"):
            if request.method in JSON_METHODS:
                has_body = self._has_body(request)
                if has_body and not self._is_json_content_type(request.content_type):
                    return JsonResponse(_envelope(False, "Content-Type must be application/json", None), status=415)
                too_large = self._is_payload_too_large(request)
                if too_large:
                    return JsonResponse(_envelope(False, "Payload too large", None), status=413)

                if has_body:
                    parsed, err = self._parse_and_validate_json(request)
                    if err:
                        return JsonResponse(_envelope(False, err, None), status=400)
                    request.payload = parsed

            actor = self._actor_key(request)
            if is_limited("global", actor, settings.RATE_LIMIT_GLOBAL_PER_MIN, 60):
                return JsonResponse(_envelope(False, "Rate limit exceeded", None), status=429)

        response = self.get_response(request)
        response["X-Trace-Id"] = request.trace_id
        return response

    def _resolve_trace_id(self, header_trace_id: str | None) -> str:
        if not header_trace_id:
            return str(uuid.uuid4())
        try:
            return str(uuid.UUID(str(header_trace_id)))
        except ValueError:
            return str(uuid.uuid4())

    def _is_json_content_type(self, content_type: str) -> bool:
        return "application/json" in (content_type or "").lower()

    def _has_body(self, request) -> bool:
        length = request.META.get("CONTENT_LENGTH")
        if length is None:
            return bool(request.body)
        try:
            return int(length) > 0
        except (TypeError, ValueError):
            return bool(request.body)

    def _is_payload_too_large(self, request) -> bool:
        length = request.META.get("CONTENT_LENGTH")
        if not length:
            return False
        try:
            return int(length) > settings.MAX_JSON_BODY_BYTES
        except (TypeError, ValueError):
            return True

    def _parse_and_validate_json(self, request):
        if not request.body:
            return {}, None
        raw = request.body.decode(errors="ignore")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            return None, "Malformed JSON"

        if not isinstance(payload, (dict, list)):
            return None, "Invalid payload format"
        if self._contains_suspicious(payload):
            return None, "Suspicious payload blocked"
        return payload, None

    def _contains_suspicious(self, value) -> bool:
        if isinstance(value, str):
            for pattern in COMPILED_SUSPICIOUS_PATTERNS:
                if pattern.search(value):
                    return True
            return False
        if isinstance(value, dict):
            for k, v in value.items():
                if self._contains_suspicious(str(k)) or self._contains_suspicious(v):
                    return True
            return False
        if isinstance(value, list):
            return any(self._contains_suspicious(item) for item in value)
        return False

    def _actor_key(self, request) -> str:
        user = getattr(request, "user", None)
        user_id = getattr(user, "id", None) if user and getattr(user, "is_authenticated", False) else None
        ip = request.META.get("REMOTE_ADDR", "anon")
        return f"user:{user_id}" if user_id else f"ip:{ip}"


def _envelope(status: bool, message: str, data):
    return {"status": status, "message": message, "data": data}
