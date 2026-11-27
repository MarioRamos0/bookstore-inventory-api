import { Book, BookFormPayload } from "@/types/book";

export interface BookFormState {
  title: string;
  author: string;
  isbn: string;
  category: string;
  cost_usd: string;
  stock_quantity: string;
  supplier_country: string;
}

export type BookFormField = keyof BookFormState;
export type BookFormErrors = Record<string, string>;

const EMPTY_FORM: BookFormState = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  cost_usd: "",
  stock_quantity: "0",
  supplier_country: "US",
};

const ISBN_SEPARATORS = /[-\s]/g;
const DIGITS_ONLY = /^\d+$/;
const ISO_COUNTRY = /^[A-Z]{2}$/;

export function toFormState(book?: Book | null): BookFormState {
  if (!book) return EMPTY_FORM;
  return {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    cost_usd: Number(book.cost_usd).toFixed(2),
    stock_quantity: String(book.stock_quantity),
    supplier_country: book.supplier_country || EMPTY_FORM.supplier_country,
  };
}

export function toPayload(form: BookFormState): BookFormPayload {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    isbn: form.isbn.trim(),
    category: form.category.trim(),
    cost_usd: Number(Number(form.cost_usd).toFixed(2)),
    stock_quantity: Number(form.stock_quantity),
    supplier_country: form.supplier_country.trim().toUpperCase(),
  };
}

function validateIsbn(isbn: string): string | null {
  const clean = isbn.replace(ISBN_SEPARATORS, "");
  if (!clean) return "El ISBN es obligatorio.";
  if (!DIGITS_ONLY.test(clean) || (clean.length !== 10 && clean.length !== 13)) {
    return "El ISBN debe tener exactamente 10 o 13 dígitos numéricos.";
  }
  return null;
}

function validateCost(cost: string): string | null {
  const value = Number(cost);
  if (!cost.trim() || Number.isNaN(value) || value <= 0) {
    return "El costo en USD debe ser mayor a 0.";
  }
  return null;
}

function validateStock(stock: string): string | null {
  const value = Number(stock);
  if (!stock.trim() || !Number.isInteger(value) || value < 0) {
    return "El inventario debe ser un entero mayor o igual a 0.";
  }
  return null;
}

function validateCountry(country: string): string | null {
  return ISO_COUNTRY.test(country.trim().toUpperCase())
    ? null
    : "Debe ser un código ISO de 2 letras (ej. US, ES, MX).";
}

export function validateBookForm(form: BookFormState): BookFormErrors {
  const rules: Record<BookFormField, string | null> = {
    title: form.title.trim() ? null : "El título es obligatorio.",
    author: form.author.trim() ? null : "El autor es obligatorio.",
    isbn: validateIsbn(form.isbn),
    category: form.category.trim() ? null : "Selecciona una categoría.",
    cost_usd: validateCost(form.cost_usd),
    stock_quantity: validateStock(form.stock_quantity),
    supplier_country: validateCountry(form.supplier_country),
  };

  return Object.fromEntries(
    Object.entries(rules).filter(
      (entry): entry is [string, string] => entry[1] !== null
    )
  );
}
