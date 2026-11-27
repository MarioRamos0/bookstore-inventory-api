import { CurrencyOption } from "@/types/inventory";

export const PAGE_SIZE = 6;
export const LOW_STOCK_THRESHOLD = 5;
export const ALL_CATEGORIES = "Todas";
export const DEFAULT_CURRENCY = "EUR";

export const DEFAULT_CATEGORIES: readonly string[] = [
  "Ficción",
  "Ciencia",
  "Historia",
  "Tecnología",
  "Infantil",
  "Negocios",
];

export const AVAILABLE_CURRENCIES: readonly CurrencyOption[] = [
  { code: "EUR", label: "EUR · Euro (€)" },
  { code: "VES", label: "VES · Bolívar (Bs)" },
  { code: "COP", label: "COP · Peso colombiano ($)" },
  { code: "MXN", label: "MXN · Peso mexicano ($)" },
  { code: "ARS", label: "ARS · Peso argentino ($)" },
  { code: "CLP", label: "CLP · Peso chileno ($)" },
  { code: "PEN", label: "PEN · Sol peruano (S/)" },
  { code: "BRL", label: "BRL · Real brasileño (R$)" },
  { code: "GBP", label: "GBP · Libra esterlina (£)" },
];
