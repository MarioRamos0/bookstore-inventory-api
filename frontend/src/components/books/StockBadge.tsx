import { LOW_STOCK_THRESHOLD } from "@/constants/inventory";
import { Badge } from "@/components/ui/Badge";

interface StockBadgeProps {
  quantity: number;
  lowStockThreshold?: number;
}

export function StockBadge({
  quantity,
  lowStockThreshold = LOW_STOCK_THRESHOLD,
}: StockBadgeProps) {
  if (quantity <= 0) return <Badge tone="danger">Agotado</Badge>;
  if (quantity <= lowStockThreshold) {
    return <Badge tone="warning">Bajo · {quantity}</Badge>;
  }
  return <Badge tone="neutral">{quantity} uds.</Badge>;
}
