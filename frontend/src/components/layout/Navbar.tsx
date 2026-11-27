import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onHomeClick: () => void;
  onNewBookClick: () => void;
}

export function Navbar({ onHomeClick, onNewBookClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-3.5 text-left cursor-pointer"
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand shadow-xs">
            <Image
              src="/nextep.jpeg"
              alt="Logo Gestión de mi librería"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="block text-lg font-bold leading-tight text-slate-900">
              Gestión de mi librería
            </span>
            <span className="block text-sm text-slate-500">
              Gestión de inventario
            </span>
          </div>
        </button>

        <Button
          size="xl"
          shape="pill"
          icon={<Plus className="h-4 w-4" />}
          onClick={onNewBookClick}
        >
          Nuevo libro
        </Button>
      </div>
    </header>
  );
}
