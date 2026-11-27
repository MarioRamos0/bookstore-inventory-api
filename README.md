# Bookstore Inventory API

Monorepo para la gestión de inventario de librería y cálculo de precios sugeridos en moneda local.

- **Backend**: Python 3.12 · Django · Django REST Framework · PostgreSQL 16
- **Frontend**: Next.js (App Router) · TypeScript · Tailwind CSS
- **Infraestructura**: Docker & Docker Compose

---

## Inicialización y Ejecución con Docker

1. Clonar el repositorio y ubicarse en la raíz:
   ```bash
   git clone git@github.com:MarioRamos0/bookstore-inventory-api.git
   cd bookstore-inventory-api
   ```

2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Construir y levantar los servicios (`db`, `backend`, `frontend`):
   ```bash
   docker compose up --build
   ```

4. Ejecutar las migraciones para crear las tablas y cargar los data seeds (10 libros iniciales):
   ```bash
   docker compose exec backend python manage.py migrate
   ```

5. Accesos:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000 (o `http://localhost:8000/api`)

---

## Comandos Útiles

```bash
# Ejecutar tests del backend
docker compose exec backend pytest

# Aplicar migraciones manualmente
docker compose exec backend python manage.py migrate

# Detener servicios
docker compose down
```

---

## Endpoints REST

Colección completa disponible en `postman/postman_collection.json`.

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/books` | Lista todos los libros (paginación opcional: `?page=1&page_size=10`) |
| `POST` | `/books` | Crea un libro |
| `GET` | `/books/{id}` | Obtiene el detalle de un libro por ID |
| `PUT` / `PATCH` | `/books/{id}` | Actualiza completa o parcialmente un libro |
| `DELETE` | `/books/{id}` | Elimina un libro (`204 No Content`) |
| `GET` | `/books/search?category={cat}` | Filtra libros por categoría |
| `GET` | `/books/low-stock?threshold=10` | Lista libros con `stock_quantity <= threshold` |
| `POST` | `/books/{id}/calculate-price` | Calcula y actualiza el precio sugerido en moneda local (margen 40%) |

### Ejemplos de Uso (`curl`)

**1. Crear un libro (`POST /books`)**
```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "isbn": "978-0134494166",
    "cost_usd": 15.99,
    "stock_quantity": 8,
    "category": "Tecnología",
    "supplier_country": "US"
  }'
```

**2. Buscar por categoría (`GET /books/search`)**
```bash
curl "http://localhost:8000/books/search?category=Ciencia"
```

**3. Consultar inventario bajo (`GET /books/low-stock`)**
```bash
curl "http://localhost:8000/books/low-stock?threshold=5"
```

**4. Calcular precio de venta sugerido (`POST /books/{id}/calculate-price`)**
```bash
curl -X POST http://localhost:8000/books/1/calculate-price \
  -H "Content-Type: application/json" \
  -d '{"currency": "EUR"}'
```
Respuesta:
```json
{
  "book_id": 1,
  "cost_usd": 14.5,
  "exchange_rate": 0.85,
  "cost_local": 12.33,
  "margin_percentage": 40,
  "selling_price_local": 17.26,
  "currency": "EUR",
  "calculation_timestamp": "2026-11-27T15:00:00Z"
}
```

---

## Autor

**Mario Ramos**
