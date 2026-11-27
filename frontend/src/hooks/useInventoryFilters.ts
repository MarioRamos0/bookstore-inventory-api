"use client";

import { useCallback, useState } from "react";
import { ALL_CATEGORIES } from "@/constants/inventory";
import { ViewMode } from "@/types/inventory";

export function useInventoryFilters() {
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const toggleLowStock = useCallback(
    () => setLowStockOnly((current) => !current),
    []
  );

  return {
    category,
    setCategory,
    lowStockOnly,
    toggleLowStock,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    resetKey: `${category}|${lowStockOnly}|${searchQuery}`,
  };
}

export type InventoryFilters = ReturnType<typeof useInventoryFilters>;
