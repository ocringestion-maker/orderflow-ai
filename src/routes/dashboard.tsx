import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Search, Filter, ArrowUpRight, RefreshCw, Inbox, ChevronRight,
  MessageSquare, Mic, Image as ImageIcon, TrendingUp, Clock,
} from "lucide-react";
import { api } from "@/services/api";
import type { Order, OrderStatus } from "@/types";
import { AppHeader } from "@/components/AppHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceRing, ConfidenceBar } from "@/components/Confidence";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const STATUS_FILTERS: Array<{ k: "ALL" | OrderStatus; label: string }> = [
  { k: "ALL", label: "All" },
  { k: "PENDING_REVIEW", label: "Pending" },
  { k: "APPROVED", label: "Approved" },
  { k: "REJECTED", label: "Rejected" },
];

// Deterministic faux retailer/source mapping (frontend-only enrichment)
const RETAILERS = ["Sharma Kirana", "Patel Stores", "Verma Wholesale", "Anand Foods", "Khan Traders", "Reddy Mart", "Singh Provisions", "Mehta General"];
const SOURCES: Array<"text" | "audio" | "image"> = ["text", "audio", "image"];
const retailerFor = (id: number) => RETAILERS[id % RETAILERS.length];
const sourceFor = (id: number) => SOURCES[id % SOURCES.length];

function Dashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: api.listOrders,
    refetchInterval: 15000,
  });

  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["k"]>("ALL");
  const [q, setQ] = useState("");

  const orders = data ?? [];
  const stats = useMemo(() => computeStats(orders), [orders]);
  const filtered = useMemo(() => {
    return orders
      .filter((o) => (filter === "ALL" ? true : o.order_status === filter))
      .filter((o) => {
        if (!q.trim()) return true;
        const needle = q.toLowerCase();
        return (
          String(o.id).includes(needle) ||
          retailerFor(o.retailer_id).toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, filter, q]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        {/* Top section */}
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                </span>
                Live operations console
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-[34px]">
                Order Intake
              </h1>
              <p className="mt-1.5 text-[14px] text-muted-foreground">
                {orders.length} orders received · {stats.pending} awaiting review
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by id or retailer…"
                  className="w-72 rounded-md border border-border bg-surface/60 py-2 pl-9 pr-3 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-surface"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">/</kbd>
              </div>
              <button
                onClick={() => refetch()}
                className="grid size-9 place-items-center rounded-md border border-border bg-surface/60 text-muted-foreground transition hover:border-border-strong hover:text-foreground"
              >
                <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* Asymmetric stats strip */}
          <div className="grid grid-cols-12 gap-3">
            <HeroStat
              label="Average confidence"
              value={`${stats.avgConfidence}%`}
              accent
              extra={<ConfidenceBar value={stats.avgConfidence} className="mt-3" />}
              icon={TrendingUp}
              className="col-span-12 md:col-span-4"
            />
            <MiniStat label="Total" value={orders.length} className="col-span-6 md:col-span-2" />
            <MiniStat label="Pending" value={stats.pending} tone="warning" className="col-span-6 md:col-span-2" />
            <MiniStat label="Approved" value={stats.approved} tone="success" className="col-span-6 md:col-span-2" />
            <MiniStat label="Rejected" value={stats.rejected} tone="destructive" className="col-span-6 md:col-span-2" />
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12px] font-medium transition",
                  filter === f.k
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                  {f.k === "ALL" ? orders.length : orders.filter((o) => o.order_status === f.k).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Filter className="size-3" />
            {filtered.length} results
          </div>
        </div>

        {/* Order list */}
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-1.5">
            {filtered.map((o, i) => (
              <OrderRow key={o.id} order={o} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function computeStats(orders: Order[]) {
  const total = orders.length;
  const pending = orders.filter((o) => o.order_status === "PENDING_REVIEW").length;
  const approved = orders.filter((o) => o.order_status === "APPROVED").length;
  const rejected = orders.filter((o) => o.order_status === "REJECTED").length;
  const avgConfidence = total ? Math.round(orders.reduce((s, o) => s + (o.overall_confidence ?? 0), 0) / total) : 0;
  return { total, pending, approved, rejected, avgConfidence };
}

function HeroStat({
  label, value, extra, icon: Icon, className,
}: { label: string; value: string | number; accent?: boolean; extra?: React.ReactNode; icon: React.ElementType; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-surface p-5", className)}>
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="relative">
        <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Icon className="size-3" />
          {label}
        </div>
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
        {extra}
      </div>
    </div>
  );
}

function MiniStat({
  label, value, tone, className,
}: { label: string; value: number; tone?: "success" | "warning" | "destructive"; className?: string }) {
  const toneCls =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-2xl font-semibold tabular-nums", toneCls)}>{value}</div>
    </div>
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const retailer = retailerFor(order.retailer_id);
  const source = sourceFor(order.source_message_id);
  const SourceIcon = source === "audio" ? Mic : source === "image" ? ImageIcon : MessageSquare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
    >
      <Link
        to="/orders/$id"
        params={{ id: String(order.id) }}
        className="group relative flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition hover:border-border-strong hover:bg-surface"
      >
        {/* Confidence ring */}
        <ConfidenceRing value={order.overall_confidence} size={42} strokeWidth={3.5} />

        {/* Order id + retailer */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">#{order.id.toString().padStart(4, "0")}</span>
            <span className="size-0.5 rounded-full bg-border-strong" />
            <span className="truncate text-[14px] font-medium tracking-tight">{retailer}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <Clock className="size-3" />
            {timeAgo(order.created_at)}
            <span>·</span>
            <span>retailer #{order.retailer_id}</span>
          </div>
        </div>

        {/* Source */}
        <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-surface/60 px-2.5 py-1 text-[11px] text-muted-foreground md:flex">
          <SourceIcon className="size-3 text-primary" />
          <span className="capitalize">{source}</span>
        </div>

        {/* Confidence visual */}
        <div className="hidden w-40 md:block">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">Confidence</span>
            <span className="font-mono text-[10px] tabular-nums text-foreground">{order.overall_confidence}%</span>
          </div>
          <ConfidenceBar value={order.overall_confidence} />
        </div>

        <StatusBadge status={order.order_status} />

        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </motion.div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[70px] animate-pulse rounded-xl border border-border bg-card" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/30 py-24">
      <div className="text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-border bg-card">
          <Inbox className="size-5 text-muted-foreground" />
        </div>
        <div className="text-[15px] font-medium">No orders match</div>
        <p className="mt-1 text-[13px] text-muted-foreground">Try clearing your filters or wait for new intake.</p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-destructive/30 bg-destructive/5 py-16">
      <div className="text-center">
        <div className="mb-2 text-[14px] font-medium text-destructive">Could not reach the intake API</div>
        <p className="mb-5 max-w-md text-[13px] text-muted-foreground">
          Make sure the backend at <span className="font-mono">http://localhost:3000</span> is running.
        </p>
        <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-[12px] hover:bg-surface">
          <RefreshCw className="size-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

// helper to avoid unused import lint
void ArrowUpRight;
