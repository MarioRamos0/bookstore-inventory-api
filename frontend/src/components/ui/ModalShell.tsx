"use client";

import { ReactNode, useEffect, useId } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const WIDTHS = {
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

interface ModalShellProps {
  title: ReactNode;
  titleClassName?: string;
  width?: keyof typeof WIDTHS;
  disableClose?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ModalShell({
  title,
  titleClassName = "text-lg font-bold text-slate-900",
  width = "lg",
  disableClose = false,
  onClose,
  children,
}: ModalShellProps) {
  const titleId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !disableClose) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [disableClose, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px] p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full rounded-2xl bg-white p-6 shadow-2xl border border-slate-100",
          WIDTHS[width]
        )}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={disableClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id={titleId} className={titleClassName}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
