import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

function fieldClassName(invalid: boolean, compact: boolean, className?: string) {
  return cn(
    "w-full rounded-xl border px-3.5 py-2 text-slate-900 outline-none transition-all",
    compact ? "text-xs font-semibold" : "text-sm",
    invalid
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-slate-200 focus:border-brand focus:ring-2 focus:ring-slate-200",
    className
  );
}

interface FieldControlProps {
  invalid?: boolean;
  compact?: boolean;
}

export function TextInput({
  invalid = false,
  compact = false,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & FieldControlProps) {
  return (
    <input
      aria-invalid={invalid}
      className={fieldClassName(invalid, compact, className)}
      {...rest}
    />
  );
}

export function SelectInput({
  invalid = false,
  compact = false,
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & FieldControlProps) {
  return (
    <select
      aria-invalid={invalid}
      className={fieldClassName(invalid, compact, cn("bg-white", className))}
      {...rest}
    />
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-slate-700 mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
