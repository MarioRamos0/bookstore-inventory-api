from decimal import Decimal
from rest_framework import serializers
from apps.books.domain.exceptions import BookValidationError
from apps.books.domain.validators import (
    validate_cost_usd,
    validate_isbn,
    validate_stock_quantity,
    validate_supplier_country,
)
from apps.books.models import Book


class BookSerializer(serializers.ModelSerializer):
    cost_usd = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    selling_price_local = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True,
        coerce_to_string=False,
    )

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "isbn",
            "cost_usd",
            "selling_price_local",
            "stock_quantity",
            "category",
            "supplier_country",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "isbn": {"validators": []},
        }

    def validate_isbn(self, value: str) -> str:
        """Valida el formato del ISBN mediante las reglas de dominio."""
        try:
            validate_isbn(value)
        except BookValidationError as exc:
            raise serializers.ValidationError(exc.message) from exc
        return value

    def validate_cost_usd(self, value: Decimal) -> Decimal:
        """Valida que el costo en USD sea mayor a cero usando las reglas de dominio."""
        try:
            return validate_cost_usd(value)
        except BookValidationError as exc:
            raise serializers.ValidationError(exc.message) from exc

    def validate_stock_quantity(self, value: int) -> int:
        """Valida que el stock no sea negativo mediante las reglas de dominio."""
        try:
            return validate_stock_quantity(value)
        except BookValidationError as exc:
            raise serializers.ValidationError(exc.message) from exc

    def validate_supplier_country(self, value: str) -> str:
        """Valida y normaliza el código ISO de país del proveedor."""
        try:
            return validate_supplier_country(value)
        except BookValidationError as exc:
            raise serializers.ValidationError(exc.message) from exc
