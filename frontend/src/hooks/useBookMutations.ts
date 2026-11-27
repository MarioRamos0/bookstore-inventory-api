"use client";

import { useCallback } from "react";
import { bookService } from "@/services/bookService";
import { Book, BookFormPayload, PriceCalculationResult } from "@/types/book";
import { notifyApiError, notifyApiSuccess } from "@/utils/toast";

interface BookMutationCallbacks {
  onCatalogChanged: () => void;
  onBookChanged: (book: Book) => void;
  onBookDeleted: (bookId: number) => void;
}

async function withErrorToast<T>(
  operation: () => Promise<T>,
  fallbackMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    notifyApiError(error, fallbackMessage);
    throw error;
  }
}

export function useBookMutations({
  onCatalogChanged,
  onBookChanged,
  onBookDeleted,
}: BookMutationCallbacks) {
  const saveBook = useCallback(
    (payload: BookFormPayload, bookId?: number): Promise<Book> =>
      withErrorToast(async () => {
        const response = bookId
          ? await bookService.updateBook(bookId, payload)
          : await bookService.createBook(payload);
        notifyApiSuccess(
          bookId ? "Libro actualizado" : "Libro creado",
          response,
          `«${response.data.title}»`
        );
        onBookChanged(response.data);
        onCatalogChanged();
        return response.data;
      }, "No se pudo guardar el libro."),
    [onBookChanged, onCatalogChanged]
  );

  const deleteBook = useCallback(
    (book: Book): Promise<void> =>
      withErrorToast(async () => {
        const response = await bookService.deleteBook(book.id);
        notifyApiSuccess("Libro eliminado", response, `«${book.title}»`);
        onBookDeleted(book.id);
        onCatalogChanged();
      }, "No se pudo eliminar el libro."),
    [onBookDeleted, onCatalogChanged]
  );

  const calculatePrice = useCallback(
    (bookId: number, currency: string): Promise<PriceCalculationResult> =>
      withErrorToast(async () => {
        const response = await bookService.calculatePrice(bookId, currency);
        const result = response.data;
        notifyApiSuccess(
          "Precio calculado",
          response,
          `Precio sugerido: ${result.currency} ${result.selling_price_local.toFixed(2)} (Tasa: ${result.exchange_rate})`
        );
        const { data: refreshedBook } = await bookService.getBookById(bookId);
        onBookChanged(refreshedBook);
        onCatalogChanged();
        return result;
      }, "No se pudo calcular el precio sugerido."),
    [onBookChanged, onCatalogChanged]
  );

  return { saveBook, deleteBook, calculatePrice };
}
