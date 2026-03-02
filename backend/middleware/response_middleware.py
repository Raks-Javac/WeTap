import json
from django.http import JsonResponse, HttpResponse


class ResponseEnvelopeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.path.startswith("/api/"):
            response = self._wrap_if_needed(response)
            response["X-Trace-Id"] = getattr(request, "trace_id", "")
        return response

    def _wrap_if_needed(self, response):
        if isinstance(response, JsonResponse):
            payload = json.loads(response.content.decode() or "{}")
            if self._already_wrapped(payload):
                return response
            wrapped = {
                "status": 200 <= response.status_code < 300,
                "message": payload.get("message", "Success" if response.status_code < 400 else "Request failed"),
                "data": payload,
            }
            return JsonResponse(wrapped, status=response.status_code)

        if isinstance(response, HttpResponse) and "application/json" in response.get("Content-Type", ""):
            try:
                payload = json.loads(response.content.decode() or "{}")
            except json.JSONDecodeError:
                payload = {"detail": response.content.decode(errors="ignore")}
            if self._already_wrapped(payload):
                return response
            wrapped = {
                "status": 200 <= response.status_code < 300,
                "message": payload.get("message", "Success" if response.status_code < 400 else "Request failed"),
                "data": payload,
            }
            return JsonResponse(wrapped, status=response.status_code)

        return response

    def _already_wrapped(self, payload: dict) -> bool:
        return isinstance(payload, dict) and {"status", "message", "data"}.issubset(payload.keys())
