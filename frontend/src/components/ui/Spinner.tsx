import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
} as const;

interface SpinnerProps {
  size?: keyof typeof SIZES;
  className?: string;
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  return <Loader2 aria-hidden className={cn("animate-spin", SIZES[size], className)} />;
}
