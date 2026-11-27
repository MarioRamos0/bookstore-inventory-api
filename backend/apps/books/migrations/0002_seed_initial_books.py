from decimal import Decimal
from django.db import migrations


INITIAL_BOOKS = [
    {
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "isbn": "9780307474728",
        "cost_usd": Decimal("14.50"),
        "stock_quantity": 12,
        "category": "Ficción",
        "supplier_country": "CO",
    },
    {
        "title": "Breve historia del tiempo",
        "author": "Stephen Hawking",
        "isbn": "9780553380163",
        "cost_usd": Decimal("11.90"),
        "stock_quantity": 3,
        "category": "Ciencia",
        "supplier_country": "GB",
    },
    {
        "title": "Sapiens: De animales a dioses",
        "author": "Yuval Noah Harari",
        "isbn": "9780062316097",
        "cost_usd": Decimal("18.00"),
        "stock_quantity": 2,
        "category": "Historia",
        "supplier_country": "IL",
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9780132350884",
        "cost_usd": Decimal("32.00"),
        "stock_quantity": 8,
        "category": "Tecnología",
        "supplier_country": "US",
    },
    {
        "title": "El principito",
        "author": "Antoine de Saint-Exupéry",
        "isbn": "9780156012195",
        "cost_usd": Decimal("8.75"),
        "stock_quantity": 25,
        "category": "Infantil",
        "supplier_country": "FR",
    },
    {
        "title": "Hábitos atómicos",
        "author": "James Clear",
        "isbn": "9780735211292",
        "cost_usd": Decimal("16.20"),
        "stock_quantity": 4,
        "category": "Negocios",
        "supplier_country": "US",
    },
    {
        "title": "Cosmos",
        "author": "Carl Sagan",
        "isbn": "9780345539434",
        "cost_usd": Decimal("13.40"),
        "stock_quantity": 1,
        "category": "Ciencia",
        "supplier_country": "US",
    },
    {
        "title": "Don Quijote de la Mancha",
        "author": "Miguel de Cervantes",
        "isbn": "9780060934347",
        "cost_usd": Decimal("15.00"),
        "stock_quantity": 0,
        "category": "Ficción",
        "supplier_country": "ES",
    },
    {
        "title": "El arte de la guerra",
        "author": "Sun Tzu",
        "isbn": "9781599869773",
        "cost_usd": Decimal("9.50"),
        "stock_quantity": 18,
        "category": "Historia",
        "supplier_country": "CN",
    },
    {
        "title": "Designing Data-Intensive Applications",
        "author": "Martin Kleppmann",
        "isbn": "9781449373320",
        "cost_usd": Decimal("38.90"),
        "stock_quantity": 6,
        "category": "Tecnología",
        "supplier_country": "DE",
    },
]


def seed_initial_books(apps, schema_editor):
    """Inserta los 10 libros iniciales de categorías variadas si no existen por ISBN."""
    Book = apps.get_model("books", "Book")
    for item in INITIAL_BOOKS:
        if not Book.objects.filter(isbn=item["isbn"]).exists():
            Book.objects.create(**item)


def remove_initial_books(apps, schema_editor):
    """Elimina los 10 libros iniciales cargados por la migración."""
    Book = apps.get_model("books", "Book")
    isbns = [item["isbn"] for item in INITIAL_BOOKS]
    Book.objects.filter(isbn__in=isbns).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("books", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_initial_books, remove_initial_books),
    ]
