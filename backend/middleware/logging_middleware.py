import logging
import json

logger = logging.getLogger("wetap.request")

SENSITIVE_KEYS = {"pan", "cvv", "token", "pin", "pin_hash", "otp", "authorization", "password", "refresh", "access"}
MASK = "***"


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        body_preview = None
        content_length = request.META.get("CONTENT_LENGTH", "0")
        if request.method in {"POST", "PUT", "PATCH"}:
            raw = request.body.decode(errors="ignore")[:1000]
            body_preview = self._safe_preview(raw)

        logger.info(
            "request method=%s path=%s trace_id=%s env=%s actor=%s size=%s body_preview=%s",
            request.method,
            request.path,
            getattr(request, "trace_id", ""),
            getattr(request, "environment_header", ""),
            self._actor(request),
            content_length,
            body_preview,
        )
        return self.get_response(request)

    def _safe_preview(self, raw: str):
        if not raw:
            return None
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            lowered = raw.lower()
            if any(token in lowered for token in SENSITIVE_KEYS):
                return MASK
            return raw
        return self._mask(payload)

    def _mask(self, value):
        if isinstance(value, dict):
            masked = {}
            for key, val in value.items():
                if str(key).lower() in SENSITIVE_KEYS:
                    masked[key] = MASK
                else:
                    masked[key] = self._mask(val)
            return masked
        if isinstance(value, list):
            return [self._mask(v) for v in value]
        return value

    def _actor(self, request):
        user = getattr(request, "user", None)
        if user and getattr(user, "is_authenticated", False):
            return str(getattr(user, "id", ""))
        return request.META.get("REMOTE_ADDR", "anon")
