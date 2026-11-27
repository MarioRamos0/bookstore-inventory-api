import { Book } from "@/types/book";
import { activateOnKeyboard } from "@/utils/a11y";
import { formatUsd } from "@/utils/formatters";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookActionHandlers, BookRowActions } from "./BookRowActions";
import { StockBadge } from "./StockBadge";

interface BookKanbanGridProps extends BookActionHandlers {
  books: Book[];
}

export function BookKanbanGrid({
  books,
  onSelectBook,
  onEditBook,
  onDeleteBook,
}: BookKanbanGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card
          key={book.id}
          role="button"
          tabIndex={0}
          aria-label={`Ver detalle de ${book.title}`}
          onClick={() => onSelectBook(book)}
          onKeyDown={activateOnKeyboard(() => onSelectBook(book))}
          className="group cursor-pointer p-5 shadow-xs hover:border-blue-300 hover:shadow-md focus-visible:border-blue-300 focus-visible:outline-none transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <Badge tone="brand">{book.category}</Badge>
              <StockBadge quantity={book.stock_quantity} />
            </div>

            <h3 className="mt-3.5 text-base font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">
              {book.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{book.author}</p>
          </div>

          <div className="mt-5 flex items-center justify-between pt-2">
            <span className="text-base font-extrabold text-slate-900">
              {formatUsd(book.cost_usd)}
            </span>
            <BookRowActions book={book} onEdit={onEditBook} onDelete={onDeleteBook} />
          </div>
        </Card>
      ))}
    </div>
  );
}
