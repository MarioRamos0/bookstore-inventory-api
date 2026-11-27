import { Book } from "@/types/book";
import { ViewMode } from "@/types/inventory";
import { EmptyStateCard, LoadingStateCard } from "@/components/ui/StateCards";
import { BookKanbanGrid } from "./BookKanbanGrid";
import { BookActionHandlers } from "./BookRowActions";
import { BookTable } from "./BookTable";

const VIEWS: Record<ViewMode, typeof BookTable> = {
  table: BookTable,
  kanban: BookKanbanGrid,
};

interface BookCollectionProps extends BookActionHandlers {
  books: Book[];
  isLoading: boolean;
  viewMode: ViewMode;
}

export function BookCollection({
  books,
  isLoading,
  viewMode,
  ...handlers
}: BookCollectionProps) {
  if (isLoading) return <LoadingStateCard />;
  if (books.length === 0) return <EmptyStateCard />;

  const ActiveView = VIEWS[viewMode];
  return <ActiveView books={books} {...handlers} />;
}
