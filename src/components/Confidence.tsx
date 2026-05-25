import { cn } from "@/lib/utils";

interface Props {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceRing({
  value,
  size = 44,
  strokeWidth = 3.5,
  className,
  showLabel = true,
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  const tone =
    v >= 85 ? "var(--success)" : v >= 60 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border-strong)"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tone}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      {showLabel && (
        <span className="absolute font-mono text-[10px] font-semibold tabular-nums">
          {Math.round(v)}
        </span>
      )}
    </div>
  );
}

export function ConfidenceBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-secondary/60", className)}>
      <div
        className="h-full rounded-full bg-gradient-confidence"
        style={{
          width: `${v}%`,
          transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

export function ConfidenceChip({ value }: { value: number }) {
  const v = Math.round(value);
  const tone =
    v >= 85
      ? "text-success border-success/30 bg-success/10"
      : v >= 60
        ? "text-warning border-warning/30 bg-warning/10"
        : "text-destructive border-destructive/30 bg-destructive/10";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums", tone)}>
      <span className="size-1 rounded-full bg-current" />
      {v}%
    </span>
  );
}
