from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("apps.books.urls")),
    path("api/", include("apps.books.urls")),
]

handler404 = "config.exceptions.custom_404_view"
handler500 = "config.exceptions.custom_500_view"
