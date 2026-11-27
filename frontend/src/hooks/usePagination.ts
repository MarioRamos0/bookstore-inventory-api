"use client";

import { useCallback, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize: number, resetKey: string) {
  const [state, setState] = useState({ key: resetKey, page: 1 });

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const requestedPage = state.key === resetKey ? state.page : 1;
  const page = Math.min(requestedPage, totalPages);
  const startIndex = (page - 1) * pageSize;

  const pageItems = useMemo(
    () => items.slice(startIndex, startIndex + pageSize),
    [items, startIndex, pageSize]
  );

  const goToPage = useCallback(
    (target: number) => setState({ key: resetKey, page: target }),
    [resetKey]
  );

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    pageItems,
    goToPrevious: () => goToPage(Math.max(1, page - 1)),
    goToNext: () => goToPage(Math.min(totalPages, page + 1)),
  };
}

export type Pagination<T> = ReturnType<typeof usePagination<T>>;
