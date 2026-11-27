import { Book, BookFormPayload, PriceCalculationResult } from "@/types/book";
import { apiRequest, ApiResponse } from "./apiClient";

type BookListPayload = Book[] | { results?: Book[] };

function unwrapList(payload: BookListPayload): Book[] {
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.results) ? payload.results : [];
}

async function listBooks(
  path: string,
  query?: Record<string, string>
): Promise<ApiResponse<Book[]>> {
  const response = await apiRequest<BookListPayload>(path, { query });
  return { ...response, data: unwrapList(response.data) };
}

export const bookService = {
  getBooks: () => listBooks("/books"),

  getBookById: (id: number) => apiRequest<Book>(`/books/${id}`),

  searchByCategory: (category: string) =>
    listBooks("/books/search", { category }),

  getLowStockBooks: (threshold: number) =>
    listBooks("/books/low-stock", { threshold: String(threshold) }),

  createBook: (payload: BookFormPayload) =>
    apiRequest<Book>("/books", { method: "POST", body: payload }),

  updateBook: (id: number, payload: BookFormPayload) =>
    apiRequest<Book>(`/books/${id}`, { method: "PUT", body: payload }),

  deleteBook: (id: number) =>
    apiRequest<void>(`/books/${id}`, { method: "DELETE" }),

  calculatePrice: (id: number, currency: string) =>
    apiRequest<PriceCalculationResult>(`/books/${id}/calculate-price`, {
      method: "POST",
      body: { currency },
    }),
};
