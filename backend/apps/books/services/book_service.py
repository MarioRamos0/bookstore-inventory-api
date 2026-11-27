from datetime import datetime, timezone
from django.db import IntegrityError, transaction
from django.db.models import QuerySet

from apps.books.domain.exceptions import (
    BookNotFoundError,
    BookValidationError,
    DuplicateISBNError,
)
from apps.books.domain.pricing import calculate_pricing_breakdown
from apps.books.domain.validators import (
    normalize_isbn,
    validate_cost_usd,
    validate_isbn,
    validate_stock_quantity,
    validate_supplier_country,
)
from apps.books.integrations.exchange_rate import ExchangeRateClient
from apps.books.models import Book


def _find_duplicate_isbn(normalized_isbn: str, exclude_id: int | None = None) -> bool:
    """Verifica si ya existe un libro en la base de datos con el mismo ISBN normalizado."""
    queryset = Book.objects.all()
    if exclude_id is not None:
        queryset = queryset.exclude(id=exclude_id)
    for existing_isbn in queryset.values_list("isbn", flat=True):
        if normalize_isbn(existing_isbn) == normalized_isbn:
            return True
    return False


def list_books() -> QuerySet[Book]:
    """Retorna el listado completo de libros ordenados por fecha de creación."""
    return Book.objects.all()


def get_book_by_id(book_id: int) -> Book:
    """Obtiene un libro por su identificador único o lanza BookNotFoundError si no existe."""
    try:
        return Book.objects.get(id=book_id)
    except Book.DoesNotExist as exc:
        raise BookNotFoundError(f"Libro con id {book_id} no encontrado.") from exc


@transaction.atomic
def create_book(data: dict) -> Book:
    """Valida las reglas de negocio y crea un nuevo registro de libro en la base de datos."""
    normalized_isbn = validate_isbn(data.get("isbn", ""))
    cost_usd = validate_cost_usd(data.get("cost_usd"))
    stock_quantity = validate_stock_quantity(data.get("stock_quantity", 0))
    supplier_country = validate_supplier_country(data.get("supplier_country", ""))

    if _find_duplicate_isbn(normalized_isbn):
        raise DuplicateISBNError(
            "Ya existe un libro registrado con este ISBN.",
            field="isbn",
        )

    try:
        return Book.objects.create(
            title=data["title"].strip(),
            author=data["author"].strip(),
            isbn=data["isbn"].strip(),
            cost_usd=cost_usd,
            selling_price_local=data.get("selling_price_local"),
            stock_quantity=stock_quantity,
            category=data["category"].strip(),
            supplier_country=supplier_country,
        )
    except IntegrityError as exc:
        raise DuplicateISBNError(
            "Ya existe un libro registrado con este ISBN.",
            field="isbn",
        ) from exc


@transaction.atomic
def update_book(book_id: int, data: dict) -> Book:
    """Valida y actualiza los campos proporcionados de un libro existente."""
    book = get_book_by_id(book_id)

    if "isbn" in data:
        normalized_isbn = validate_isbn(data["isbn"])
        if _find_duplicate_isbn(normalized_isbn, exclude_id=book.id):
            raise DuplicateISBNError(
                "Ya existe un libro registrado con este ISBN.",
                field="isbn",
            )
        book.isbn = data["isbn"].strip()

    if "cost_usd" in data:
        book.cost_usd = validate_cost_usd(data["cost_usd"])

    if "stock_quantity" in data:
        book.stock_quantity = validate_stock_quantity(data["stock_quantity"])

    if "supplier_country" in data:
        book.supplier_country = validate_supplier_country(data["supplier_country"])

    if "title" in data:
        book.title = data["title"].strip()

    if "author" in data:
        book.author = data["author"].strip()

    if "category" in data:
        book.category = data["category"].strip()

    if "selling_price_local" in data:
        book.selling_price_local = data["selling_price_local"]

    try:
        book.save()
    except IntegrityError as exc:
        raise DuplicateISBNError(
            "Ya existe un libro registrado con este ISBN.",
            field="isbn",
        ) from exc

    return book


@transaction.atomic
def delete_book(book_id: int) -> None:
    """Elimina un libro existente identificado por su ID."""
    book = get_book_by_id(book_id)
    book.delete()


def search_books_by_category(category: str | None) -> QuerySet[Book]:
    """Filtra y retorna los libros que coinciden con la categoría especificada."""
    if not category or not category.strip():
        raise BookValidationError(
            "El parámetro 'category' es obligatorio.",
            field="category",
        )
    return Book.objects.filter(category__iexact=category.strip())


def get_low_stock_books(threshold_param: str | int | None = 10) -> QuerySet[Book]:
    """Retorna los libros cuyo stock es menor o igual al umbral indicado."""
    if threshold_param is None or threshold_param == "":
        threshold = 10
    else:
        try:
            threshold = int(threshold_param)
        except (ValueError, TypeError) as exc:
            raise BookValidationError(
                "El parámetro 'threshold' debe ser un número entero válido.",
                field="threshold",
            ) from exc

    if threshold < 0:
        raise BookValidationError(
            "El parámetro 'threshold' no puede ser negativo.",
            field="threshold",
        )

    return Book.objects.filter(stock_quantity__lte=threshold)


@transaction.atomic
def calculate_and_update_book_price(
    book_id: int,
    target_currency: str | None = None,
    exchange_client: ExchangeRateClient | None = None,
) -> dict:
    """Calcula el precio de venta sugerido usando la tasa de cambio hacia la moneda indicada y actualiza el libro."""
    book = get_book_by_id(book_id)
    client = exchange_client or ExchangeRateClient(target_currency=target_currency)
    exchange_rate, currency = client.get_exchange_rate()

    breakdown = calculate_pricing_breakdown(book.cost_usd, exchange_rate)
    book.selling_price_local = breakdown["selling_price_local"]
    book.save(update_fields=["selling_price_local", "updated_at"])

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    return {
        "book_id": book.id,
        "cost_usd": float(breakdown["cost_usd"]),
        "exchange_rate": float(breakdown["exchange_rate"]),
        "cost_local": float(breakdown["cost_local"]),
        "margin_percentage": breakdown["margin_percentage"],
        "selling_price_local": float(breakdown["selling_price_local"]),
        "currency": currency,
        "calculation_timestamp": timestamp,
    }
