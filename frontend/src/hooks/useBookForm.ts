"use client";

import { FormEvent, useCallback, useState } from "react";
import { ApiClientError } from "@/services/apiClient";
import { Book, BookFormPayload } from "@/types/book";
import {
  BookFormErrors,
  BookFormField,
  BookFormState,
  toFormState,
  toPayload,
  validateBookForm,
} from "@/utils/bookForm";

interface UseBookFormOptions {
  initialBook?: Book | null;
  onSubmit: (payload: BookFormPayload) => Promise<unknown>;
  onSuccess: () => void;
}

function resolveSubmitError(error: unknown): {
  fieldErrors: BookFormErrors;
  generalError: string | null;
} {
  if (error instanceof ApiClientError) {
    const fieldErrors = error.firstErrorPerField();
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;
    return {
      fieldErrors,
      generalError: hasFieldErrors ? null : error.backendMessage,
    };
  }
  return {
    fieldErrors: {},
    generalError:
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado al guardar el libro.",
  };
}

export function useBookForm({ initialBook, onSubmit, onSuccess }: UseBookFormOptions) {
  const [form, setForm] = useState<BookFormState>(() => toFormState(initialBook));
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: BookFormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] ? { ...current, [field]: "" } : current
    );
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError(null);

    const validationErrors = validateBookForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(toPayload(form));
      onSuccess();
    } catch (error) {
      const resolved = resolveSubmitError(error);
      setErrors((current) => ({ ...current, ...resolved.fieldErrors }));
      setGeneralError(resolved.generalError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    errors,
    generalError,
    isSubmitting,
    isEditing: Boolean(initialBook),
    updateField,
    handleSubmit,
  };
}
