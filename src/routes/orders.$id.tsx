import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Brain, Check, X, Sparkles, MessageSquare, Mic,
  Image as ImageIcon, Clock, Phone, Hash, Copy, ChevronDown,
} from "lucide-react";
import { api, normalizeMediaPath } from "@/services/api";
import type { IncomingMessage, OrderItem } from "@/types";
import { AppHeader } from "@/components/AppHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceRing, ConfidenceBar, ConfidenceChip } from "@/components/Confidence";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ImageViewer } from "@/components/ImageViewer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetails,
});

function OrderDetails() {
  const { id } = useParams({ from: "/orders/$id" });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id),
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to orders
        </Link>

        {isLoading ? (
          <DetailsSkeleton />
        ) : isError || !data ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
            <div className="text-[14px] font-medium text-destructive">Could not load order #{id}</div>
            <button onClick={() => refetch()} className="mt-4 rounded-md border border-border bg-card px-3 py-1.5 text-[12px]">
              Retry
            </button>
          </div>
        ) : (
          <OrderContent data={data} />
        )}
      </main>
    </div>
  );
}

function OrderContent({ data }: { data: { order: any; items: OrderItem[]; message?: IncomingMessage; retailer?: any } }) {
  const { order, items, message, retailer } = data;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 border-b border-border pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <Hash className="size-3" /> Order
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-[34px]">
                #{order.id.toString().padStart(4, "0")}
              </h1>
              <StatusBadge status={order.order_status} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {new Date(order.created_at).toLocaleString()}
              </span>
              <span>·</span>
              <span>Retailer #{order.retailer_id}</span>
              {retailer?.phone_number && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
                    <Phone className="size-3" /> {retailer.phone_number}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] font-medium text-destructive transition hover:bg-destructive/20">
              <X className="size-3.5" /> Reject
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-3 py-2 text-[12px] font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02]">
              <Check className="size-3.5" /> Approve order
            </button>
          </div>
        </div>
      </div>

      {/* Split workspace */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT — items + source */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <section>
            <SectionHeader
              eyebrow="Extracted"
              title="Product items"
              meta={`${items.length} items · avg ${avg(items.map((i) => i.ai_confidence))}%`}
            />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {items.map((it, idx) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <ProductItemCard item={it} />
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              eyebrow="Source"
              title="Original message"
              meta={message?.message_type ? `Type · ${message.message_type}` : undefined}
            />
            <SourceMessage message={message} />
          </section>
        </div>

        {/* RIGHT — AI insights (sticky) */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-20 space-y-4">
            <ConfidencePanel value={order.overall_confidence} itemCount={items.length} />
            <AIInsightsPanel message={message} order={order} />
          </div>
        </aside>
      </div>
    </>
  );
}

/* ---------- pieces ---------- */

function SectionHeader({ eyebrow, title, meta }: { eyebrow: string; title: string; meta?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-primary">{eyebrow}</div>
        <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
      </div>
      {meta && <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{meta}</div>}
    </div>
  );
}

function ProductItemCard({ item }: { item: OrderItem }) {
  const c = Number(item.ai_confidence ?? 0);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:border-border-strong">
      <div
        className="absolute inset-y-0 left-0 w-0.5"
        style={{
          background: c >= 85 ? "var(--success)" : c >= 60 ? "var(--warning)" : "var(--destructive)",
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">#{item.id}</span>
            <ConfidenceChip value={c} />
          </div>
          <div className="truncate text-[15px] font-medium tracking-tight">{item.product_name}</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[18px] font-semibold tabular-nums">
              {parseFloat(item.extracted_quantity)}
            </span>
            <span className="text-[12px] text-muted-foreground">{item.extracted_unit}</span>
          </div>
        </div>
        <ConfidenceRing value={c} size={40} strokeWidth={3} />
      </div>
      <div className="mt-3">
        <ConfidenceBar value={c} />
      </div>
    </div>
  );
}

function SourceMessage({ message }: { message?: IncomingMessage }) {
  if (!message) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center text-[13px] text-muted-foreground">
        No source message attached.
      </div>
    );
  }

  if (message.message_type === "audio") {
    const url = normalizeMediaPath(message.media_path);
    return (
      <div className="space-y-3">
        {url && <AudioPlayer src={url} />}
        {message.transcribed_text && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Transcript</div>
            <p className="text-[14px] leading-relaxed">{message.transcribed_text}</p>
          </div>
        )}
      </div>
    );
  }

  if (message.message_type === "image") {
    const url = normalizeMediaPath(message.media_path);
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {url && <ImageViewer src={url} alt="source order" />}
        {message.transcribed_text && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">OCR text</div>
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{message.transcribed_text}</p>
          </div>
        )}
      </div>
    );
  }

  // text
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid size-7 place-items-center rounded-full bg-success/20 text-success">
          <MessageSquare className="size-3.5" />
        </div>
        <div className="text-[12px] font-medium text-muted-foreground">WhatsApp · text</div>
      </div>
      <div className="rounded-lg rounded-tl-sm bg-secondary/60 p-4 text-[14px] leading-relaxed">
        {message.raw_message || "—"}
      </div>
    </div>
  );
}

function ConfidencePanel({ value, itemCount }: { value: number; itemCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-surface p-5 shadow-glow">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3 text-primary" /> AI confidence
        </div>
        <div className="flex items-center gap-4">
          <ConfidenceRing value={value} size={84} strokeWidth={6} />
          <div className="flex-1">
            <div className="text-3xl font-semibold tabular-nums">{value}<span className="text-lg text-muted-foreground">%</span></div>
            <div className="mt-1 text-[12px] text-muted-foreground">overall extraction</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Items</div>
            <div className="text-[18px] font-semibold tabular-nums">{itemCount}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Quality</div>
            <div className="text-[18px] font-semibold">{value >= 85 ? "High" : value >= 60 ? "Medium" : "Low"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIInsightsPanel({ message, order }: { message?: IncomingMessage; order: any }) {
  const [showRaw, setShowRaw] = useState(false);

  const SourceIcon =
    message?.message_type === "audio" ? Mic :
    message?.message_type === "image" ? ImageIcon : MessageSquare;

  const rawObj = (() => {
    if (!message?.raw_ai_response) return null;
    try { return JSON.parse(message.raw_ai_response); } catch { return message.raw_ai_response; }
  })();

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-primary" />
          <span className="text-[13px] font-medium">AI insights</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">technical</span>
      </div>

      <div className="space-y-4 p-5">
        <InsightRow label="Pipeline">
          <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2 py-1 text-[11px]">
            <SourceIcon className="size-3 text-primary" />
            <span className="capitalize">{message?.message_type ?? "unknown"} → LLM extract</span>
          </div>
        </InsightRow>

        <InsightRow label="Message confidence">
          {typeof message?.ai_confidence === "number" ? (
            <ConfidenceChip value={message.ai_confidence} />
          ) : (
            <span className="text-[12px] text-muted-foreground">n/a</span>
          )}
        </InsightRow>

        <InsightRow label="Source msg id">
          <span className="font-mono text-[11px] text-muted-foreground">#{order.source_message_id}</span>
        </InsightRow>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Reasoning</div>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Items extracted with{" "}
            <span className="text-foreground">{order.overall_confidence}%</span> overall confidence.
            Quantity tokens normalized against retailer's historical SKU patterns.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background/60">
          <button
            onClick={() => setShowRaw((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-2.5"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Raw AI response</span>
            <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", showRaw && "rotate-180")} />
          </button>
          {showRaw && (
            <div className="border-t border-border">
              <div className="flex items-center justify-end gap-2 px-3 py-1.5">
                <button
                  onClick={() => {
                    const text = typeof rawObj === "string" ? rawObj : JSON.stringify(rawObj, null, 2);
                    navigator.clipboard.writeText(text ?? "");
                  }}
                  className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:text-foreground"
                >
                  <Copy className="size-2.5" /> copy
                </button>
              </div>
              <pre className="max-h-72 overflow-auto px-3 pb-3 font-mono text-[10.5px] leading-relaxed text-muted-foreground">
{rawObj ? (typeof rawObj === "string" ? rawObj : JSON.stringify(rawObj, null, 2)) : "// no raw payload"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-xl border border-border bg-card" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-3 lg:col-span-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((s, n) => s + Number(n || 0), 0) / nums.length);
}
