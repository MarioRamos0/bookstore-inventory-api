"use client";

import { useId, useState } from "react";
import { Calculator } from "lucide-react";
import { AVAILABLE_CURRENCIES, DEFAULT_CURRENCY } from "@/constants/inventory";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Book, PriceCalculationResult } from "@/types/book";
import { formatNumber } from "@/utils/formatters";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField, SelectInput } from "@/components/ui/FormField";

interface PriceCalculatorCardProps {
  book: Book;
  onCalculatePrice: (
    bookId: number,
    currency: string
  ) => Promise<PriceCalculationResult>;
}

interface BreakdownRowProps {
  label: string;
  value: string;
}

function BreakdownRow({ label, value }: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export function PriceCalculatorCard({
  book,
  onCalculatePrice,
}: PriceCalculatorCardProps) {
  const currencySelectId = useId();
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [calculation, setCalculation] =
    useState<PriceCalculationResult | null>(null);
  const { run, isPending } = useAsyncAction(onCalculatePrice);

  async function handleCalculate() {
    const result = await run(book.id, selectedCurrency);
    if (result.ok) setCalculation(result.value);
  }

  const marginAmount = calculation
    ? Number(
        (calculation.selling_price_local - calculation.cost_local).toFixed(2)
      )
    : 0;

  return (
    <Card className="lg:col-span-5 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-bold text-slate-900">Precio de venta</h2>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Calcula el precio de venta sugerido en moneda local consultando la tasa
        de cambio actual y aplicando el margen de ganancia.
      </p>

      <div className="mt-4">
        <FormField label="Moneda local" htmlFor={currencySelectId}>
          <SelectInput
            id={currencySelectId}
            compact
            value={selectedCurrency}
            disabled={isPending}
            onChange={(event) => setSelectedCurrency(event.target.value)}
          >
            {AVAILABLE_CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.label}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <Button
        size="lg"
        shape="pill"
        fullWidth
        isLoading={isPending}
        onClick={handleCalculate}
        className="mt-4"
      >
        Calcular precio
      </Button>

      {calculation && (
        <div className="mt-5 rounded-xl bg-brand-soft p-4 space-y-2.5 border border-blue-100/80">
          <BreakdownRow
            label="Costo original"
            value={`USD ${formatNumber(calculation.cost_usd)}`}
          />
          <BreakdownRow
            label="Tasa aplicada"
            value={`× ${formatNumber(calculation.exchange_rate, 4)}`}
          />
          <BreakdownRow
            label="Costo en moneda local"
            value={`${calculation.currency} ${formatNumber(calculation.cost_local)}`}
          />
          <BreakdownRow
            label={`Margen (${formatNumber(calculation.margin_percentage, 1)} %)`}
            value={`+ ${calculation.currency} ${formatNumber(marginAmount)}`}
          />

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Precio final
            </span>
            <span className="text-lg font-extrabold text-brand">
              {calculation.currency}{" "}
              {formatNumber(calculation.selling_price_local)}
            </span>
          </div>
        </div>
      )}

      {!calculation && book.selling_price_local !== null && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">
            Último precio calculado
          </span>
          <span className="text-sm font-bold text-brand">
            {formatNumber(Number(book.selling_price_local))}
          </span>
        </div>
      )}
    </Card>
  );
}
