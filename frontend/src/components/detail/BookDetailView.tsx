import { ArrowLeft } from "lucide-react";
import { Book, PriceCalculationResult } from "@/types/book";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { BookMetadataCard } from "./BookMetadataCard";
import { PriceCalculatorCard } from "./PriceCalculatorCard";

interface BookDetailViewProps {
  book: Book;
  isLoadingBook?: boolean;
  onBack: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onCalculatePrice: (
    bookId: number,
    currency: string
  ) => Promise<PriceCalculationResult>;
}

export function BookDetailView({
  book,
  isLoadingBook = false,
  onBack,
  onEdit,
  onDelete,
  onCalculatePrice,
}: BookDetailViewProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver al inventario
      </button>

      {isLoadingBook ? (
        <Card className="flex items-center justify-center p-16 shadow-sm">
          <Spinner size="md" className="text-brand" />
          <span className="ml-3 text-sm text-slate-600">
            Cargando detalle del libro...
          </span>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <BookMetadataCard book={book} onEdit={onEdit} onDelete={onDelete} />
          <PriceCalculatorCard
            key={book.id}
            book={book}
            onCalculatePrice={onCalculatePrice}
          />
        </div>
      )}
    </div>
  );
}
