import { Pencil, Trash2 } from "lucide-react";
import { Book } from "@/types/book";
import { IconButton } from "@/components/ui/IconButton";

export interface BookActionHandlers {
  onSelectBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
}

interface BookRowActionsProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookRowActions({ book, onEdit, onDelete }: BookRowActionsProps) {
  return (
    <div
      className="inline-flex items-center justify-end gap-1.5"
      onClick={(event) => event.stopPropagation()}
    >
      <IconButton label="Editar libro" onClick={() => onEdit(book)}>
        <Pencil className="h-4 w-4" />
      </IconButton>
      <IconButton label="Eliminar libro" tone="danger" onClick={() => onDelete(book)}>
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
