import { AlertTriangle } from "lucide-react";
import { ALL_CATEGORIES, LOW_STOCK_THRESHOLD } from "@/constants/inventory";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";

interface CategorySidebarProps {
  categories: readonly string[];
  selectedCategory: string;
  lowStockOnly: boolean;
  onSelectCategory: (category: string) => void;
  onToggleLowStock: () => void;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  lowStockOnly,
  onSelectCategory,
  onToggleLowStock,
}: CategorySidebarProps) {
  const navItems = [ALL_CATEGORIES, ...categories];

  return (
    <aside className="lg:col-span-3 space-y-6">
      <div>
        <h2 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Categorías
        </h2>
        <nav aria-label="Categorías de libros" className="mt-3 space-y-1.5">
          {navItems.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelectCategory(category)}
                className={cn(
                  "w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-brand text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                )}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </div>

      <Card className="p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-bold text-slate-800">
              Inventario bajo
            </span>
          </div>

          <Switch
            checked={lowStockOnly}
            label="Filtrar por inventario bajo"
            onToggle={onToggleLowStock}
          />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Muestra libros con {LOW_STOCK_THRESHOLD} unidades o menos.
        </p>
      </Card>
    </aside>
  );
}
