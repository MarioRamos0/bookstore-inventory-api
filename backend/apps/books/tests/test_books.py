from decimal import Decimal
from unittest.mock import MagicMock, patch
import pytest
import requests
from rest_framework import status
from rest_framework.test import APIClient

from apps.books.models import Book


@pytest.fixture
def api_client() -> APIClient:
    """Proporciona una instancia de APIClient para las pruebas de integración."""
    return APIClient()


@pytest.fixture
def valid_book_payload() -> dict:
    """Retorna un diccionario con datos válidos para crear un libro."""
    return {
        "title": "Clean Architecture",
        "author": "Robert C. Martin",
        "isbn": "978-0134494166",
        "cost_usd": 15.99,
        "stock_quantity": 8,
        "category": "Software Engineering",
        "supplier_country": "US",
    }


@pytest.mark.django_db
class TestBookCRUDAndBusinessRules:
    def test_create_book_success(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica la creación exitosa de un libro con estado 201."""
        initial_count = Book.objects.count()
        response = api_client.post("/books", valid_book_payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "Clean Architecture"
        assert response.json()["cost_usd"] == 15.99
        assert Book.objects.count() == initial_count + 1

    def test_reject_duplicate_normalized_isbn(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica que no se permita registrar dos libros con el mismo ISBN normalizado."""
        api_client.post("/books", valid_book_payload, format="json")
        duplicate_payload = {
            **valid_book_payload,
            "title": "Clean Architecture Duplicate",
            "isbn": "9780134494166",
        }
        response = api_client.post("/books", duplicate_payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["error"] == "validation_error"

    def test_reject_invalid_cost_usd(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica que se rechacen libros con costo menor o igual a cero."""
        invalid_payload = {**valid_book_payload, "cost_usd": 0}
        response = api_client.post("/books", invalid_payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "cost_usd" in response.data["details"]

    def test_reject_negative_stock_quantity(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica que se rechacen libros con cantidad de stock negativa."""
        invalid_payload = {**valid_book_payload, "stock_quantity": -5}
        response = api_client.post("/books", invalid_payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "stock_quantity" in response.data["details"]

    def test_reject_invalid_isbn_length(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica que se rechacen códigos ISBN que no tengan 10 o 13 dígitos."""
        invalid_payload = {**valid_book_payload, "isbn": "12345"}
        response = api_client.post("/books", invalid_payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "isbn" in response.data["details"]

    def test_list_and_optional_pagination(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica el listado completo y el listado paginado cuando se envía page."""
        initial_count = Book.objects.count()
        api_client.post("/books", valid_book_payload, format="json")
        second_payload = {**valid_book_payload, "isbn": "0132350882", "title": "Clean Code 2"}
        api_client.post("/books", second_payload, format="json")

        res_all = api_client.get("/books")
        assert res_all.status_code == status.HTTP_200_OK
        assert isinstance(res_all.data, list)
        assert len(res_all.data) == initial_count + 2

        res_paged = api_client.get("/books?page=1&page_size=1")
        assert res_paged.status_code == status.HTTP_200_OK
        assert res_paged.data["count"] == initial_count + 2
        assert len(res_paged.data["results"]) == 1

    def test_get_update_and_delete_book(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica la obtención, actualización (PUT y PATCH) y eliminación de un libro."""
        created = api_client.post("/books", valid_book_payload, format="json")
        book_id = created.data["id"]

        get_res = api_client.get(f"/books/{book_id}")
        assert get_res.status_code == status.HTTP_200_OK
        assert get_res.data["id"] == book_id

        put_payload = {**valid_book_payload, "title": "Clean Architecture 2nd Ed", "stock_quantity": 25}
        put_res = api_client.put(f"/books/{book_id}", put_payload, format="json")
        assert put_res.status_code == status.HTTP_200_OK
        assert put_res.data["title"] == "Clean Architecture 2nd Ed"
        assert put_res.data["stock_quantity"] == 25

        patch_res = api_client.patch(f"/books/{book_id}", {"stock_quantity": 3}, format="json")
        assert patch_res.status_code == status.HTTP_200_OK
        assert patch_res.data["stock_quantity"] == 3

        del_res = api_client.delete(f"/books/{book_id}")
        assert del_res.status_code == status.HTTP_204_NO_CONTENT

        not_found_res = api_client.get(f"/books/{book_id}")
        assert not_found_res.status_code == status.HTTP_404_NOT_FOUND

    def test_search_by_category_and_low_stock(self, api_client: APIClient, valid_book_payload: dict):
        """Verifica los endpoints de búsqueda por categoría y filtrado de bajo stock."""
        api_client.post("/books", valid_book_payload, format="json")

        missing_cat = api_client.get("/books/search")
        assert missing_cat.status_code == status.HTTP_400_BAD_REQUEST

        found_cat = api_client.get("/books/search?category=Software Engineering")
        assert found_cat.status_code == status.HTTP_200_OK
        assert len(found_cat.data) == 1

        low_stock_res = api_client.get("/books/low-stock?threshold=10")
        assert low_stock_res.status_code == status.HTTP_200_OK
        assert len(low_stock_res.data) >= 1


@pytest.mark.django_db
class TestBookPriceCalculation:
    @patch("apps.books.integrations.exchange_rate.requests.get")
    def test_calculate_price_with_external_api_success(
        self,
        mock_get: MagicMock,
        api_client: APIClient,
        valid_book_payload: dict,
    ):
        """Verifica el cálculo de precio sugerido cuando la API externa responde exitosamente."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"rates": {"EUR": 0.90}}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        created = api_client.post("/books", valid_book_payload, format="json")
        book_id = created.data["id"]

        res = api_client.post(f"/books/{book_id}/calculate-price")
        assert res.status_code == status.HTTP_200_OK
        assert res.data["book_id"] == book_id
        assert res.data["cost_usd"] == 15.99
        assert res.data["exchange_rate"] == 0.90
        assert res.data["cost_local"] == 14.39
        assert res.data["margin_percentage"] == 40
        assert res.data["selling_price_local"] == 20.15
        assert res.data["currency"] == "EUR"
        assert res.data["calculation_timestamp"].endswith("Z")

        book = Book.objects.get(id=book_id)
        assert book.selling_price_local == Decimal("20.15")

    @patch("apps.books.integrations.exchange_rate.requests.get")
    def test_calculate_price_fallback_on_api_failure(
        self,
        mock_get: MagicMock,
        api_client: APIClient,
        valid_book_payload: dict,
    ):
        """Verifica que se aplique la tasa por defecto (0.85) si la API externa falla."""
        mock_get.side_effect = requests.Timeout("Connection timed out")

        created = api_client.post("/books", valid_book_payload, format="json")
        book_id = created.data["id"]

        res = api_client.post(f"/books/{book_id}/calculate-price")
        assert res.status_code == status.HTTP_200_OK
        assert res.data["book_id"] == book_id
        assert res.data["cost_usd"] == 15.99
        assert res.data["exchange_rate"] == 0.85
        assert res.data["cost_local"] == 13.59
        assert res.data["margin_percentage"] == 40
        assert res.data["selling_price_local"] == 19.03
        assert res.data["currency"] == "EUR"

        book = Book.objects.get(id=book_id)
        assert book.selling_price_local == Decimal("19.03")
