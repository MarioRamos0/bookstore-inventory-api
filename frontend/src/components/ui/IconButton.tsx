import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

const TONES = {
  neutral: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "text-danger hover:bg-red-50",
} as const;

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: keyof typeof TONES;
  children: ReactNode;
}

export function IconButton({
  label,
  tone = "neutral",
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn("rounded-lg p-1.5 transition-colors", TONES[tone], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
