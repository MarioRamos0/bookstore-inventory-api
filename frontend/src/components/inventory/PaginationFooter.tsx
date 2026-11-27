import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "@/hooks/usePagination";
import { Button } from "@/components/ui/Button";

interface PaginationFooterProps<T> {
  pagination: Pagination<T>;
}

export function PaginationFooter<T>({ pagination }: PaginationFooterProps<T>) {
  const {
    startIndex,
    pageSize,
    totalItems,
    page,
    totalPages,
    goToPrevious,
    goToNext,
  } = pagination;

  if (totalItems === 0) return null;

  return (
    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <span>
        {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} de{" "}
        {totalItems} libros
      </span>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          shape="pill"
          disabled={page <= 1}
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Anterior
        </Button>

        <span className="text-xs font-medium text-slate-600">
          Página {page} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          shape="pill"
          disabled={page >= totalPages}
          onClick={goToNext}
        >
          Siguiente
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
