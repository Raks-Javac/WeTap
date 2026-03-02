import json
import logging
from django.conf import settings
from django.http import JsonResponse, HttpResponse

logger = logging.getLogger("wetap.response")


class ResponseEnvelopeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Exception as exc:
            logger.exception("Unhandled exception trace_id=%s path=%s", getattr(request, "trace_id", ""), request.path)
            message = "Internal server error" if settings.ENVIRONMENT == "prod" else str(exc)
            response = JsonResponse({"status": False, "message": message, "data": None}, status=500)

        if request.path.startswith("/api/"):
            response = self._wrap_if_needed(response)
            response["X-Trace-Id"] = getattr(request, "trace_id", "")
        return response

    def _wrap_if_needed(self, response):
        if isinstance(response, JsonResponse):
            payload = json.loads(response.content.decode() or "{}")
            if self._already_wrapped(payload):
                return response
            wrapped = self._make_envelope(response.status_code, payload)
            return JsonResponse(wrapped, status=response.status_code)

        if isinstance(response, HttpResponse) and "application/json" in response.get("Content-Type", ""):
            try:
                payload = json.loads(response.content.decode() or "{}")
            except json.JSONDecodeError:
                payload = {"detail": response.content.decode(errors="ignore")}
            if self._already_wrapped(payload):
                return response
            wrapped = self._make_envelope(response.status_code, payload)
            return JsonResponse(wrapped, status=response.status_code)

        return response

    def _make_envelope(self, status_code: int, payload):
        default_message = "Success" if status_code < 400 else "Request failed"
        message = default_message
        data = payload
        if isinstance(payload, dict):
            message = str(payload.get("message") or payload.get("detail") or default_message)
        if settings.ENVIRONMENT == "prod" and status_code >= 500:
            message = "Internal server error"
            data = None
        return {"status": 200 <= status_code < 300, "message": message, "data": data}

    def _already_wrapped(self, payload: dict) -> bool:
        return isinstance(payload, dict) and {"status", "message", "data"}.issubset(payload.keys())
