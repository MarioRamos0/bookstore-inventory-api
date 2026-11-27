from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.books.serializers import BookSerializer
from apps.books.services import book_service


class OptionalBookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


def paginate_or_serialize(request: Request, queryset) -> Response:
    """Aplica paginación si se envían parámetros de página o retorna la lista completa."""
    if "page" in request.query_params or "page_size" in request.query_params:
        paginator = OptionalBookPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = BookSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
    serializer = BookSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


class BookListCreateView(APIView):
    def get(self, request: Request) -> Response:
        """Lista todos los libros registrados con soporte para paginación opcional."""
        books = book_service.list_books()
        return paginate_or_serialize(request, books)

    def post(self, request: Request) -> Response:
        """Crea un nuevo libro validando los datos de entrada."""
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book = book_service.create_book(serializer.validated_data)
        return Response(BookSerializer(book).data, status=status.HTTP_201_CREATED)


class BookDetailView(APIView):
    def get(self, request: Request, book_id: int) -> Response:
        """Obtiene el detalle de un libro específico por su ID."""
        book = book_service.get_book_by_id(book_id)
        return Response(BookSerializer(book).data, status=status.HTTP_200_OK)

    def put(self, request: Request, book_id: int) -> Response:
        """Actualiza completamente un libro existente por su ID."""
        book_service.get_book_by_id(book_id)
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_book = book_service.update_book(book_id, serializer.validated_data)
        return Response(BookSerializer(updated_book).data, status=status.HTTP_200_OK)

    def patch(self, request: Request, book_id: int) -> Response:
        """Actualiza parcialmente los campos de un libro existente por su ID."""
        book_service.get_book_by_id(book_id)
        serializer = BookSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_book = book_service.update_book(book_id, serializer.validated_data)
        return Response(BookSerializer(updated_book).data, status=status.HTTP_200_OK)

    def delete(self, request: Request, book_id: int) -> Response:
        """Elimina un libro del inventario por su ID."""
        book_service.delete_book(book_id)
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookSearchView(APIView):
    def get(self, request: Request) -> Response:
        """Busca libros filtrando por el parámetro de consulta category."""
        category = request.query_params.get("category")
        books = book_service.search_books_by_category(category)
        return paginate_or_serialize(request, books)


class BookLowStockView(APIView):
    def get(self, request: Request) -> Response:
        """Lista los libros cuyo stock es menor o igual al umbral especificado."""
        threshold = request.query_params.get("threshold", 10)
        books = book_service.get_low_stock_books(threshold)
        return paginate_or_serialize(request, books)


class BookCalculatePriceView(APIView):
    def post(self, request: Request, book_id: int) -> Response:
        """Calcula y actualiza el precio de venta sugerido en la moneda local seleccionada."""
        currency = None
        if isinstance(request.data, dict):
            currency = request.data.get("currency")
        if not currency:
            currency = request.query_params.get("currency")

        result = book_service.calculate_and_update_book_price(
            book_id,
            target_currency=currency,
        )
        return Response(result, status=status.HTTP_200_OK)
