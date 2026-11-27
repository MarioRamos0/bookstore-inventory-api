from django.urls import re_path
from apps.books.views import (
    BookCalculatePriceView,
    BookDetailView,
    BookListCreateView,
    BookLowStockView,
    BookSearchView,
)

urlpatterns = [
    re_path(r"^books/?$", BookListCreateView.as_view(), name="book-list-create"),
    re_path(r"^books/search/?$", BookSearchView.as_view(), name="book-search"),
    re_path(r"^books/low-stock/?$", BookLowStockView.as_view(), name="book-low-stock"),
    re_path(
        r"^books/(?P<book_id>\d+)/calculate-price/?$",
        BookCalculatePriceView.as_view(),
        name="book-calculate-price",
    ),
    re_path(r"^books/(?P<book_id>\d+)/?$", BookDetailView.as_view(), name="book-detail"),
]
