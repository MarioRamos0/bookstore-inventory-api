"use client";

import { ChangeEvent, useId, useMemo } from "react";
import { DEFAULT_CATEGORIES } from "@/constants/inventory";
import { useBookForm } from "@/hooks/useBookForm";
import { Book, BookFormPayload } from "@/types/book";
import { BookFormField } from "@/utils/bookForm";
import { Button } from "@/components/ui/Button";
import { FormField, SelectInput, TextInput } from "@/components/ui/FormField";
import { ModalShell } from "@/components/ui/ModalShell";

interface BookFormModalProps {
  initialBook?: Book | null;
  availableCategories?: readonly string[];
  onClose: () => void;
  onSubmit: (payload: BookFormPayload) => Promise<unknown>;
}

export function BookFormModal({
  initialBook,
  availableCategories = DEFAULT_CATEGORIES,
  onClose,
  onSubmit,
}: BookFormModalProps) {
  const formId = useId();
  const { form, errors, generalError, isSubmitting, isEditing, updateField, handleSubmit } =
    useBookForm({ initialBook, onSubmit, onSuccess: onClose });

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...DEFAULT_CATEGORIES,
          ...availableCategories,
          ...(form.category ? [form.category] : []),
        ])
      ),
    [availableCategories, form.category]
  );

  const fieldId = (field: BookFormField) => `${formId}-${field}`;

  const bind = (field: BookFormField, transform?: (value: string) => string) => ({
    id: fieldId(field),
    name: field,
    value: form[field],
    invalid: Boolean(errors[field]),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      updateField(field, transform ? transform(event.target.value) : event.target.value),
  });

  return (
    <ModalShell
      title={isEditing ? "Editar libro" : "Nuevo libro"}
      disableClose={isSubmitting}
      onClose={onClose}
    >
      <p className="mt-0.5 text-xs text-slate-500">Los campos se validan antes de guardar.</p>

      {generalError && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs font-medium text-red-700"
        >
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <FormField label="Título" htmlFor={fieldId("title")} error={errors.title}>
          <TextInput type="text" placeholder="Ej. Cien años de soledad" {...bind("title")} />
        </FormField>

        <FormField label="Autor" htmlFor={fieldId("author")} error={errors.author}>
          <TextInput type="text" placeholder="Ej. Gabriel García Márquez" {...bind("author")} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ISBN" htmlFor={fieldId("isbn")} error={errors.isbn}>
            <TextInput
              type="text"
              placeholder="978-0-13-235088-4"
              maxLength={17}
              className="font-mono"
              {...bind("isbn")}
            />
          </FormField>

          <FormField label="Categoría" htmlFor={fieldId("category")} error={errors.category}>
            <SelectInput {...bind("category")}>
              <option value="">Seleccionar</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectInput>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Costo (USD)" htmlFor={fieldId("cost_usd")} error={errors.cost_usd}>
            <TextInput type="number" step="0.01" min="0.01" placeholder="12.50" {...bind("cost_usd")} />
          </FormField>

          <FormField
            label="Inventario"
            htmlFor={fieldId("stock_quantity")}
            error={errors.stock_quantity}
          >
            <TextInput type="number" step="1" min="0" placeholder="0" {...bind("stock_quantity")} />
          </FormField>

          <FormField
            label="País proveedor (ISO)"
            htmlFor={fieldId("supplier_country")}
            error={errors.supplier_country}
          >
            <TextInput
              type="text"
              maxLength={2}
              placeholder="US"
              className="uppercase"
              {...bind("supplier_country", (value) => value.toUpperCase())}
            />
          </FormField>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Guardar cambios" : "Crear libro"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
