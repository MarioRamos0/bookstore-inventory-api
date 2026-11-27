import { BookOpen } from "lucide-react";
import { Card } from "./Card";
import { Spinner } from "./Spinner";

interface LoadingStateCardProps {
  message?: string;
}

export function LoadingStateCard({
  message = "Cargando inventario...",
}: LoadingStateCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center py-20 shadow-xs">
      <Spinner size="lg" className="text-brand" />
      <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>
    </Card>
  );
}

export function EmptyStateCard() {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-4 text-center shadow-xs">
      <BookOpen className="h-8 w-8 text-slate-300" />
      <h3 className="mt-3 text-sm font-bold text-slate-800">
        No se encontraron libros
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Prueba ajustando los filtros o agrega un nuevo libro al inventario.
      </p>
    </Card>
  );
}
