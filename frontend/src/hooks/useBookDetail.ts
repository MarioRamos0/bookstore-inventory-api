"use client";

import { useCallback, useRef, useState } from "react";
import { bookService } from "@/services/bookService";
import { Book } from "@/types/book";
import { notifyApiError } from "@/utils/toast";

export function useBookDetail() {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequestId = useRef(0);

  const open = useCallback(async (selected: Book) => {
    const requestId = ++latestRequestId.current;
    const isLatest = () => requestId === latestRequestId.current;

    setBook(selected);
    setIsLoading(true);
    try {
      const { data } = await bookService.getBookById(selected.id);
      if (isLatest()) setBook(data);
    } catch (error) {
      if (isLatest()) notifyApiError(error, "Error al obtener el detalle del libro.");
    } finally {
      if (isLatest()) setIsLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    latestRequestId.current += 1;
    setBook(null);
    setIsLoading(false);
  }, []);

  const sync = useCallback((updated: Book) => {
    setBook((current) => (current?.id === updated.id ? updated : current));
  }, []);

  const removeIfOpen = useCallback((bookId: number) => {
    setBook((current) => (current?.id === bookId ? null : current));
  }, []);

  return { book, isLoading, open, close, sync, removeIfOpen };
}
