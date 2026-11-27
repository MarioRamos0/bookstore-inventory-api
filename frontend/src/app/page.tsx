"use client";

import { useMemo } from "react";
import { PAGE_SIZE } from "@/constants/inventory";
import { useBookCatalog } from "@/hooks/useBookCatalog";
import { useBookDetail } from "@/hooks/useBookDetail";
import { useBookModals } from "@/hooks/useBookModals";
import { useBookMutations } from "@/hooks/useBookMutations";
import { useInventoryFilters } from "@/hooks/useInventoryFilters";
import { usePagination } from "@/hooks/usePagination";
import { filterBooksByQuery } from "@/utils/books";
import { BookFormModal } from "@/components/books/BookFormModal";
import { DeleteConfirmModal } from "@/components/books/DeleteConfirmModal";
import { BookDetailView } from "@/components/detail/BookDetailView";
import { InventorySection } from "@/components/inventory/InventorySection";
import { Navbar } from "@/components/layout/Navbar";

export default function BookstorePage() {
  const filters = useInventoryFilters();
  const catalog = useBookCatalog(filters.category, filters.lowStockOnly);
  const detail = useBookDetail();
  const modals = useBookModals();

  const filteredBooks = useMemo(
    () => filterBooksByQuery(catalog.books, filters.searchQuery),
    [catalog.books, filters.searchQuery]
  );

  const pagination = usePagination(filteredBooks, PAGE_SIZE, filters.resetKey);

  const mutations = useBookMutations({
    onCatalogChanged: catalog.reload,
    onBookChanged: detail.sync,
    onBookDeleted: detail.removeIfOpen,
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar onHomeClick={detail.close} onNewBookClick={modals.openCreate} />

      <main className="flex-1">
        {detail.book ? (
          <BookDetailView
            book={detail.book}
            isLoadingBook={detail.isLoading}
            onBack={detail.close}
            onEdit={modals.openEdit}
            onDelete={modals.openDelete}
            onCalculatePrice={mutations.calculatePrice}
          />
        ) : (
          <InventorySection
            categories={catalog.categories}
            filters={filters}
            pagination={pagination}
            isLoading={catalog.isLoading}
            onSelectBook={detail.open}
            onEditBook={modals.openEdit}
            onDeleteBook={modals.openDelete}
          />
        )}
      </main>

      {modals.isFormOpen && (
        <BookFormModal
          key={modals.editingBook?.id ?? "new"}
          initialBook={modals.editingBook}
          availableCategories={catalog.categories}
          onClose={modals.closeForm}
          onSubmit={(payload) =>
            mutations.saveBook(payload, modals.editingBook?.id)
          }
        />
      )}

      {modals.deleteTarget && (
        <DeleteConfirmModal
          book={modals.deleteTarget}
          onClose={modals.closeDelete}
          onConfirm={mutations.deleteBook}
        />
      )}
    </div>
  );
}
