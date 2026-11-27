import { ReactNode } from "react";
import { cn } from "@/utils/cn";

const TONES = {
  brand: "bg-slate-100 text-brand",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
} as const;

const SIZES = {
  sm: "px-3 py-0.5",
  md: "px-3 py-1",
} as const;

interface BadgeProps {
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  children: ReactNode;
}

export function Badge({ tone = "neutral", size = "sm", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-xs font-semibold",
        TONES[tone],
        SIZES[size]
      )}
    >
      {children}
    </span>
  );
}
