import { Pencil, Trash2 } from "lucide-react";
import { Book } from "@/types/book";
import { formatNumber } from "@/utils/formatters";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BookMetadataCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export function BookMetadataCard({
  book,
  onEdit,
  onDelete,
}: BookMetadataCardProps) {
  const attributes = [
    {
      label: "ISBN",
      value: book.isbn,
      className: "font-semibold font-mono",
    },
    {
      label: "Costo",
      value: `USD ${formatNumber(Number(book.cost_usd))}`,
      className: "font-bold",
    },
    {
      label: "Inventario",
      value: `${book.stock_quantity} uds.`,
      className: "font-bold",
    },
    {
      label: "País proveedor",
      value: book.supplier_country,
      className: "font-bold",
    },
  ];

  return (
    <Card className="lg:col-span-7 p-7 shadow-sm">
      <Badge tone="brand" size="md">
        {book.category}
      </Badge>

      <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {book.title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{book.author}</p>

      <div className="my-6 h-px bg-slate-200/80" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {attributes.map((attr) => (
          <div key={attr.label}>
            <span className="block text-[11px] font-medium text-slate-400">
              {attr.label}
            </span>
            <span
              className={`mt-1 block text-xs sm:text-sm text-slate-900 ${attr.className}`}
            >
              {attr.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="secondary"
          icon={<Pencil className="h-3.5 w-3.5" />}
          onClick={() => onEdit(book)}
        >
          Editar
        </Button>
        <Button
          variant="dangerOutline"
          icon={<Trash2 className="h-3.5 w-3.5" />}
          onClick={() => onDelete(book)}
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
}
