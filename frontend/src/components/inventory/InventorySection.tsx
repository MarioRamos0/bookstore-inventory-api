import { ALL_CATEGORIES } from "@/constants/inventory";
import { InventoryFilters } from "@/hooks/useInventoryFilters";
import { Pagination } from "@/hooks/usePagination";
import { Book } from "@/types/book";
import { BookCollection } from "@/components/books/BookCollection";
import { BookActionHandlers } from "@/components/books/BookRowActions";
import { CategorySidebar } from "./CategorySidebar";
import { InventoryToolbar } from "./InventoryToolbar";
import { PaginationFooter } from "./PaginationFooter";

interface InventorySectionProps extends BookActionHandlers {
  categories: readonly string[];
  filters: InventoryFilters;
  pagination: Pagination<Book>;
  isLoading: boolean;
}

export function InventorySection({
  categories,
  filters,
  pagination,
  isLoading,
  onSelectBook,
  onEditBook,
  onDeleteBook,
}: InventorySectionProps) {
  const title =
    filters.category === ALL_CATEGORIES ? "Todos los libros" : filters.category;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <CategorySidebar
          categories={categories}
          selectedCategory={filters.category}
          lowStockOnly={filters.lowStockOnly}
          onSelectCategory={filters.setCategory}
          onToggleLowStock={filters.toggleLowStock}
        />

        <section className="lg:col-span-9">
          <InventoryToolbar
            title={title}
            totalCount={pagination.totalItems}
            lowStockOnly={filters.lowStockOnly}
            searchQuery={filters.searchQuery}
            viewMode={filters.viewMode}
            onSearchChange={filters.setSearchQuery}
            onViewModeChange={filters.setViewMode}
          />

          <div className="mt-5">
            <BookCollection
              books={pagination.pageItems}
              isLoading={isLoading}
              viewMode={filters.viewMode}
              onSelectBook={onSelectBook}
              onEditBook={onEditBook}
              onDeleteBook={onDeleteBook}
            />
          </div>

          {!isLoading && <PaginationFooter pagination={pagination} />}
        </section>
      </div>
    </div>
  );
}
