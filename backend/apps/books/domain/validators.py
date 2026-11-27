from decimal import Decimal
from apps.books.domain.exceptions import BookValidationError


def normalize_isbn(isbn: str) -> str:
    """Elimina guiones y espacios en blanco de un código ISBN."""
    if not isinstance(isbn, str):
        raise BookValidationError("El ISBN debe ser una cadena de texto.", field="isbn")
    return isbn.replace("-", "").replace(" ", "").strip()


def validate_isbn(isbn: str) -> str:
    """Valida que el ISBN normalizado tenga exactamente 10 o 13 dígitos numéricos."""
    clean_isbn = normalize_isbn(isbn)
    if len(clean_isbn) not in (10, 13) or not clean_isbn.isdigit():
        raise BookValidationError(
            "El ISBN debe contener exactamente 10 o 13 dígitos válidos.",
            field="isbn",
        )
    return clean_isbn


def validate_cost_usd(cost_usd: Decimal | float | int) -> Decimal:
    """Valida que el costo en dólares sea estrictamente mayor a cero."""
    decimal_cost = Decimal(str(cost_usd))
    if decimal_cost <= Decimal("0"):
        raise BookValidationError(
            "El costo en USD debe ser estrictamente mayor a 0.",
            field="cost_usd",
        )
    return decimal_cost


def validate_stock_quantity(stock_quantity: int) -> int:
    """Valida que la cantidad en inventario no sea un número negativo."""
    if stock_quantity is None or int(stock_quantity) < 0:
        raise BookValidationError(
            "La cantidad en stock no puede ser negativa.",
            field="stock_quantity",
        )
    return int(stock_quantity)


def validate_supplier_country(country: str) -> str:
    """Valida que el código de país del proveedor tenga exactamente 2 caracteres."""
    if not isinstance(country, str) or len(country.strip()) != 2 or not country.strip().isalpha():
        raise BookValidationError(
            "El país del proveedor debe ser un código ISO de 2 letras.",
            field="supplier_country",
        )
    return country.strip().upper()
