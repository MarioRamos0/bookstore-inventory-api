import { LayoutGrid, List, Search } from "lucide-react";
import { ViewMode } from "@/types/inventory";
import { cn } from "@/utils/cn";

const VIEW_MODES: readonly { mode: ViewMode; label: string; Icon: typeof List }[] = [
  { mode: "table", label: "Vista de tabla", Icon: List },
  { mode: "kanban", label: "Vista de tarjetas", Icon: LayoutGrid },
];

interface InventoryToolbarProps {
  title: string;
  totalCount: number;
  lowStockOnly: boolean;
  searchQuery: string;
  viewMode: ViewMode;
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function InventoryToolbar({
  title,
  totalCount,
  lowStockOnly,
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
}: InventoryToolbarProps) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          {totalCount} {totalCount === 1 ? "resultado" : "resultados"}
          {lowStockOnly ? " · inventario bajo" : ""}
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            aria-label="Buscar por título, autor o ISBN"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título, autor o ISBN..."
            className="w-full rounded-full bg-white border border-slate-200/80 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs outline-none focus:border-brand focus:ring-2 focus:ring-slate-200 transition-all"
          />
        </div>

        <div
          role="group"
          aria-label="Modo de visualización"
          className="inline-flex items-center self-end sm:self-auto rounded-full bg-white p-1 shadow-2xs border border-slate-200/80"
        >
          {VIEW_MODES.map(({ mode, label, Icon }) => {
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={isActive}
                onClick={() => onViewModeChange(mode)}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-400 hover:text-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
