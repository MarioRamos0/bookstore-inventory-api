from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.exceptions import APIException, NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler

from apps.books.domain.exceptions import (
    BookNotFoundError,
    BookValidationError,
    DuplicateISBNError,
)


class ServiceUnavailableError(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Servicio temporalmente no disponible."
    default_code = "service_unavailable"


def custom_exception_handler(exc: Exception, context: dict) -> Response:
    """Procesa las excepciones globalmente y retorna respuestas JSON estandarizadas."""
    if isinstance(exc, BookNotFoundError):
        return Response(
            {
                "error": "not_found",
                "message": exc.message,
                "status_code": status.HTTP_404_NOT_FOUND,
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exc, (BookValidationError, DuplicateISBNError)):
        payload = {
            "error": "validation_error",
            "message": exc.message,
            "status_code": status.HTTP_400_BAD_REQUEST,
        }
        if exc.field:
            payload["details"] = {exc.field: [exc.message]}
        return Response(payload, status=status.HTTP_400_BAD_REQUEST)

    response = exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, ValidationError):
            return Response(
                {
                    "error": "validation_error",
                    "message": "Error de validación en los datos enviados.",
                    "details": response.data,
                    "status_code": status.HTTP_400_BAD_REQUEST,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if isinstance(exc, (Http404, NotFound, ObjectDoesNotExist)):
            return Response(
                {
                    "error": "not_found",
                    "message": "El recurso solicitado no existe.",
                    "status_code": status.HTTP_404_NOT_FOUND,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE:
            return Response(
                {
                    "error": "service_unavailable",
                    "message": str(exc.detail) if hasattr(exc, "detail") else "Servicio no disponible.",
                    "status_code": status.HTTP_503_SERVICE_UNAVAILABLE,
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                "error": "api_error",
                "message": response.data.get("detail", "Error en la solicitud.")
                if isinstance(response.data, dict)
                else "Error en la solicitud.",
                "details": response.data,
                "status_code": response.status_code,
            },
            status=response.status_code,
        )

    return Response(
        {
            "error": "internal_server_error",
            "message": "Ocurrió un error interno en el servidor.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


def custom_404_view(request, exception=None) -> JsonResponse:
    """Retorna una respuesta JSON limpia cuando una ruta no existe (404)."""
    return JsonResponse(
        {
            "error": "not_found",
            "message": "La ruta solicitada no fue encontrada.",
            "status_code": 404,
        },
        status=404,
    )


def custom_500_view(request) -> JsonResponse:
    """Retorna una respuesta JSON limpia ante errores no controlados del servidor (500)."""
    return JsonResponse(
        {
            "error": "internal_server_error",
            "message": "Ocurrió un error interno en el servidor.",
            "status_code": 500,
        },
        status=500,
    )
