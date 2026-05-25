import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STATUS_MAP: Record<OrderStatus, { label: string; classes: string; dot: string }> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    classes: "text-warning border-warning/30 bg-warning/10",
    dot: "bg-warning",
  },
  APPROVED: {
    label: "Approved",
    classes: "text-success border-success/30 bg-success/10",
    dot: "bg-success",
  },
  REJECTED: {
    label: "Rejected",
    classes: "text-destructive border-destructive/30 bg-destructive/10",
    dot: "bg-destructive",
  },
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const s = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-tight", s.classes, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot, status === "PENDING_REVIEW" && "pulse-dot")} />
      {s.label}
    </span>
  );
}
