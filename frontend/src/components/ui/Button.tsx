import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "./Spinner";

const VARIANTS = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-hover disabled:opacity-60",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50",
  danger: "bg-danger text-white shadow-sm hover:bg-red-700 disabled:opacity-60",
  dangerOutline:
    "border border-slate-200 bg-white text-danger shadow-2xs hover:bg-red-50 disabled:opacity-60",
  outline:
    "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40",
} as const;

const SIZES = {
  sm: "gap-1 px-3.5 py-1.5 text-xs font-medium",
  md: "gap-2 px-4 py-2 text-xs font-semibold",
  lg: "gap-2 px-5 py-2.5 text-xs font-semibold",
  xl: "gap-2 px-5 py-2.5 text-sm font-semibold",
} as const;

const SHAPES = {
  rounded: "rounded-xl",
  pill: "rounded-full",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  shape?: keyof typeof SHAPES;
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  shape = "rounded",
  icon,
  isLoading = false,
  fullWidth = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center transition-colors disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        SHAPES[shape],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {isLoading ? <Spinner /> : icon}
      {children}
    </button>
  );
}
