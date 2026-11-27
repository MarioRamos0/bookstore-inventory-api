"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ALL_CATEGORIES,
  DEFAULT_CATEGORIES,
  LOW_STOCK_THRESHOLD,
} from "@/constants/inventory";
import { bookService } from "@/services/bookService";
import { Book } from "@/types/book";
import { isSameCategory, mergeCategories } from "@/utils/books";
import { notifyApiError } from "@/utils/toast";

interface CatalogSnapshot {
  key: string;
  books: Book[];
}

async function fetchBooks(category: string, lowStockOnly: boolean): Promise<Book[]> {
  const isAllCategories = category === ALL_CATEGORIES;

  if (lowStockOnly) {
    const { data } = await bookService.getLowStockBooks(LOW_STOCK_THRESHOLD);
    return isAllCategories
      ? data
      : data.filter((book) => isSameCategory(book.category, category));
  }

  if (!isAllCategories) {
    return (await bookService.searchByCategory(category)).data;
  }

  return (await bookService.getBooks()).data;
}

export function useBookCatalog(category: string, lowStockOnly: boolean) {
  const [reloadToken, setReloadToken] = useState(0);
  const [snapshot, setSnapshot] = useState<CatalogSnapshot>({ key: "", books: [] });
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);

  const requestKey = `${category}|${lowStockOnly}|${reloadToken}`;

  useEffect(() => {
    let isActive = true;

    fetchBooks(category, lowStockOnly)
      .then((books) => {
        if (!isActive) return;
        setSnapshot({ key: requestKey, books });
        setCategories((current) => mergeCategories(current, books));
      })
      .catch((error) => {
        if (!isActive) return;
        notifyApiError(error, "No se pudo cargar el inventario de libros.");
        setSnapshot((current) => ({ key: requestKey, books: current.books }));
      });

    return () => {
      isActive = false;
    };
  }, [category, lowStockOnly, requestKey]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    books: snapshot.books,
    categories,
    isLoading: snapshot.key !== requestKey,
    reload,
  };
}
