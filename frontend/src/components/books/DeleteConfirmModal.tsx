"use client";

import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/Button";
import { ModalShell } from "@/components/ui/ModalShell";

interface DeleteConfirmModalProps {
  book: Book;
  onClose: () => void;
  onConfirm: (book: Book) => Promise<void>;
}

export function DeleteConfirmModal({ book, onClose, onConfirm }: DeleteConfirmModalProps) {
  const { run, isPending } = useAsyncAction(onConfirm);

  async function handleConfirm() {
    const result = await run(book);
    if (result.ok) onClose();
  }

  return (
    <ModalShell
      title="¿Eliminar este libro?"
      titleClassName="text-base font-bold text-slate-900"
      width="md"
      disableClose={isPending}
      onClose={onClose}
    >
      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Se eliminará «{book.title}» del inventario. Esta acción no se puede deshacer.
      </p>

      <div className="mt-6 flex items-center justify-end gap-2.5">
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} isLoading={isPending}>
          Eliminar
        </Button>
      </div>
    </ModalShell>
  );
}
