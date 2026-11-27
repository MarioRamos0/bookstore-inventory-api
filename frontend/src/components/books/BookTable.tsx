import { Book } from "@/types/book";
import { activateOnKeyboard } from "@/utils/a11y";
import { formatUsd } from "@/utils/formatters";
import { Card } from "@/components/ui/Card";
import { BookActionHandlers, BookRowActions } from "./BookRowActions";
import { StockBadge } from "./StockBadge";

const COLUMNS = [
  { label: "Título", className: "pl-6 pr-4" },
  { label: "ISBN", className: "px-4" },
  { label: "Categoría", className: "px-4" },
  { label: "País", className: "px-4" },
  { label: "Costo", className: "px-4 text-right" },
  { label: "Stock", className: "px-4" },
  { label: "", className: "pl-4 pr-6 text-right" },
];

interface BookTableProps extends BookActionHandlers {
  books: Book[];
}

export function BookTable({
  books,
  onSelectBook,
  onEditBook,
  onDeleteBook,
}: BookTableProps) {
  return (
    <Card className="overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-xs font-medium text-slate-400">
              {COLUMNS.map((column, index) => (
                <th key={index} scope="col" className={`py-3.5 font-medium ${column.className}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 text-sm">
            {books.map((book) => (
              <tr
                key={book.id}
                tabIndex={0}
                onClick={() => onSelectBook(book)}
                onKeyDown={activateOnKeyboard(() => onSelectBook(book))}
                className="group cursor-pointer hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none transition-colors"
              >
                <td className="py-3.5 pl-6 pr-4">
                  <div className="font-semibold text-slate-900 group-hover:text-brand transition-colors">
                    {book.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{book.author}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{book.isbn}</td>
                <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{book.category}</td>
                <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                  {book.supplier_country}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-slate-900">
                  {formatUsd(book.cost_usd)}
                </td>
                <td className="py-3.5 px-4">
                  <StockBadge quantity={book.stock_quantity} />
                </td>
                <td className="py-3.5 pl-4 pr-6 text-right">
                  <BookRowActions book={book} onEdit={onEditBook} onDelete={onDeleteBook} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
