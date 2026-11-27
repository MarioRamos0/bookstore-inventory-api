"use client";

import { useCallback, useState } from "react";
import { Book } from "@/types/book";

type FormTarget = { mode: "create" } | { mode: "edit"; book: Book } | null;

export function useBookModals() {
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  const openCreate = useCallback(() => setFormTarget({ mode: "create" }), []);
  const openEdit = useCallback(
    (book: Book) => setFormTarget({ mode: "edit", book }),
    []
  );
  const closeForm = useCallback(() => setFormTarget(null), []);
  const openDelete = useCallback((book: Book) => setDeleteTarget(book), []);
  const closeDelete = useCallback(() => setDeleteTarget(null), []);

  return {
    isFormOpen: formTarget !== null,
    editingBook: formTarget?.mode === "edit" ? formTarget.book : null,
    openCreate,
    openEdit,
    closeForm,
    deleteTarget,
    openDelete,
    closeDelete,
  };
}
