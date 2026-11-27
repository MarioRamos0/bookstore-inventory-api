import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl bg-white border border-slate-200/80", className)}
      {...rest}
    />
  );
}
