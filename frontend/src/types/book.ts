export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cost_usd: number;
  selling_price_local: number | null;
  stock_quantity: number;
  category: string;
  supplier_country: string;
  created_at: string;
  updated_at: string;
}

export type BookFormPayload = Pick<
  Book,
  | "title"
  | "author"
  | "isbn"
  | "cost_usd"
  | "stock_quantity"
  | "category"
  | "supplier_country"
>;

export interface PriceCalculationResult {
  book_id: number;
  cost_usd: number;
  exchange_rate: number;
  cost_local: number;
  margin_percentage: number;
  selling_price_local: number;
  currency: string;
  calculation_timestamp: string;
}
