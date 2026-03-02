import logging

logger = logging.getLogger("wetap.request")

SENSITIVE_KEYS = {"pan", "cvv", "token", "pin", "pin_hash", "otp", "authorization"}


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        body_preview = ""
        if request.method in {"POST", "PUT", "PATCH"}:
            raw = request.body.decode(errors="ignore")[:1000]
            lowered = raw.lower()
            if not any(s in lowered for s in SENSITIVE_KEYS):
                body_preview = raw

        logger.info(
            "request method=%s path=%s trace_id=%s env=%s body_preview=%s",
            request.method,
            request.path,
            getattr(request, "trace_id", ""),
            getattr(request, "environment_header", ""),
            body_preview,
        )
        return self.get_response(request)
