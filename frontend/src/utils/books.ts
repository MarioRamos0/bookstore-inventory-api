import { Book } from "@/types/book";

export function filterBooksByQuery(books: Book[], query: string): Book[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return books;
  return books.filter((book) =>
    [book.title, book.author, book.isbn].some((value) =>
      value.toLowerCase().includes(normalized)
    )
  );
}

export function mergeCategories(
  current: readonly string[],
  books: Book[]
): string[] {
  return Array.from(
    new Set([...current, ...books.map((book) => book.category).filter(Boolean)])
  );
}

export function isSameCategory(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
