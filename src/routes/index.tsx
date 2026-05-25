import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight, MessageSquare, Mic, Image as ImageIcon, Sparkles,
  Brain, Workflow, ShieldCheck, Zap, BarChart3, CheckCircle2,
} from "lucide-react";
import { ConfidenceRing, ConfidenceBar } from "@/components/Confidence";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Mesh + grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] drift" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid size-7 place-items-center rounded-md bg-gradient-primary shadow-glow">
            <Sparkles className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">OrderMind</span>
          <span className="rounded-md border border-border/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">AI</span>
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          <a href="#workflow" className="hover:text-foreground">Workflow</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#preview" className="hover:text-foreground">Console</a>
        </nav>
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-[13px] font-medium transition hover:border-primary/50 hover:bg-surface"
        >
          Open Dashboard
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-32 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            Live • Processing 2,847 orders this hour
          </div>

          <h1 className="max-w-4xl text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[68px]">
            Turn WhatsApp messages into{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-[oklch(0.70_0.14_160)] bg-clip-text text-transparent">
              structured orders
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-[17px] leading-relaxed text-muted-foreground">
            AI-powered extraction for text, image, and audio purchase orders. An operations
            console built for review, validation, and human-in-the-loop oversight.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02]"
            >
              Open Dashboard
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#workflow"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/40 px-4 py-2.5 text-[13px] font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        {/* Floating preview composition */}
        <div className="relative mt-20 grid grid-cols-12 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-12 md:col-span-7"
          >
            <ConsolePreview />
          </motion.div>

          <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="float-slow"
            >
              <MessagePreview />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <ExtractionPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow visualization */}
      <section id="workflow" className="relative z-10 border-t border-border/60 bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-primary">01 — Pipeline</div>
              <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                One inbox. Three media types. Zero manual entry.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Every message — text, voice note, or shelf photo — flows through the same
              extraction pipeline and lands in your review queue.
            </p>
          </div>

          <WorkflowVisualization />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-primary">02 — Capabilities</div>
          <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Built for operators who can't afford bad data.
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-border-strong ${f.span}`}
            >
              <div className="mb-5 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                <f.icon className="size-4" />
              </div>
              <h3 className="mb-2 text-[17px] font-semibold tracking-tight">{f.title}</h3>
              <p className="max-w-md text-[14px] leading-relaxed text-muted-foreground">{f.desc}</p>
              {f.accent}
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 border-t border-border/60 bg-surface/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-primary">03 — Flow</div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">From message to ledger in four steps.</h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-card p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
                  <s.icon className="size-4 text-primary" />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold tracking-tight">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview band */}
      <section id="preview" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-card p-1 shadow-elevated">
          <div className="rounded-[22px] border border-border/60 bg-background p-10 md:p-14">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-primary">04 — The console</div>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                  A workspace, not a dashboard.
                </h2>
              </div>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Open Dashboard
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ConsolePreview large />
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 text-[12px] text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary" />
            <span>OrderMind AI — built for operations teams.</span>
          </div>
          <span className="font-mono">© {new Date().getFullYear()} OrderMind Labs</span>
        </div>
      </footer>
    </div>
  );
}

/* -------- preview composables -------- */

function ConsolePreview({ large = false }: { large?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card shadow-elevated ${large ? "" : ""}`}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full bg-destructive/70" />
          <span className="size-2 rounded-full bg-warning/70" />
          <span className="size-2 rounded-full bg-success/70" />
          <span className="ml-3">ordermind.app / orders</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded border border-border px-1.5 py-0.5 font-mono">⌘K</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-px bg-border/60">
        <div className="col-span-3 space-y-1 bg-card p-3">
          {["Inbox", "Pending", "Approved", "Rejected", "Retailers"].map((l, i) => (
            <div
              key={l}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12px] ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
            >
              <span>{l}</span>
              {i === 1 && <span className="font-mono text-[10px] text-primary">12</span>}
            </div>
          ))}
        </div>
        <div className="col-span-9 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] text-muted-foreground">Pending review · 12</div>
            <div className="flex gap-1.5">
              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">avg 91%</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {MOCK_ROWS.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-md border border-border/60 bg-surface/40 px-3 py-2.5">
                <ConfidenceRing value={r.c} size={32} strokeWidth={3} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[12px] font-medium">{r.retailer}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">#{r.id}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{r.items} items · {r.type}</div>
                </div>
                <StatusBadge status={r.c >= 85 ? "APPROVED" : "PENDING_REVIEW"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessagePreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-elevated">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-full bg-success/20 text-success">
            <MessageSquare className="size-3.5" />
          </div>
          <div className="text-[12px] font-medium">Sharma Kirana</div>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">2m ago</span>
      </div>
      <div className="rounded-lg rounded-tl-sm bg-secondary/80 p-3 text-[12px] leading-relaxed">
        bhai 26 packets A Mari Milk, 12 kg sugar, 5 atta 5kg bag bhej dena kal subah
      </div>
    </div>
  );
}

function ExtractionPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-elevated">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <Brain className="size-3.5 text-primary" />
        Extracted · confidence 94%
      </div>
      <div className="space-y-2">
        {[
          { n: "A Mari Milk", q: "26", u: "packets", c: 96 },
          { n: "Sugar", q: "12", u: "kg", c: 92 },
          { n: "Atta", q: "5", u: "bag · 5kg", c: 88 },
        ].map((i) => (
          <div key={i.n} className="flex items-center gap-3 rounded-md border border-border/60 bg-surface/40 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium">{i.n}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{i.q} {i.u}</div>
            </div>
            <div className="w-20"><ConfidenceBar value={i.c} /></div>
            <span className="w-9 text-right font-mono text-[10px] text-muted-foreground">{i.c}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowVisualization() {
  const nodes = [
    { icon: MessageSquare, label: "Text" },
    { icon: Mic, label: "Audio" },
    { icon: ImageIcon, label: "Image" },
  ];
  return (
    <div className="grid grid-cols-12 items-center gap-6">
      <div className="col-span-12 flex flex-col gap-3 md:col-span-3">
        {nodes.map((n) => (
          <div key={n.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="grid size-9 place-items-center rounded-lg bg-surface text-primary">
              <n.icon className="size-4" />
            </div>
            <div>
              <div className="text-[13px] font-medium">{n.label} message</div>
              <div className="font-mono text-[10px] text-muted-foreground">WhatsApp</div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-span-12 hidden items-center justify-center md:col-span-1 md:flex">
        <svg viewBox="0 0 80 200" className="h-40 w-full">
          <path d="M5 40 Q 40 100 75 100" stroke="oklch(0.72 0.18 245 / 0.4)" strokeWidth="1.5" fill="none" />
          <path d="M5 100 L 75 100" stroke="oklch(0.72 0.18 245 / 0.4)" strokeWidth="1.5" fill="none" />
          <path d="M5 160 Q 40 100 75 100" stroke="oklch(0.72 0.18 245 / 0.4)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="col-span-12 md:col-span-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-surface p-6 shadow-glow">
          <div className="absolute inset-0 shimmer opacity-50" />
          <div className="relative flex flex-col items-center text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Brain className="size-6 text-primary-foreground" />
            </div>
            <div className="mt-4 text-[15px] font-semibold tracking-tight">Extraction Engine</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              OCR · STT · LLM · Confidence
            </div>
            <div className="mt-5 w-full">
              <ConfidenceBar value={94} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 hidden items-center justify-center md:col-span-1 md:flex">
        <svg viewBox="0 0 80 40" className="h-10 w-full">
          <path d="M5 20 L 70 20" stroke="oklch(0.70 0.14 160 / 0.5)" strokeWidth="1.5" fill="none" />
          <polygon points="70,15 78,20 70,25" fill="oklch(0.70 0.14 160 / 0.7)" />
        </svg>
      </div>

      <div className="col-span-12 md:col-span-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-medium">Review Queue</div>
            <StatusBadge status="PENDING_REVIEW" />
          </div>
          <div className="space-y-1.5">
            {["A Mari Milk · 26", "Sugar · 12kg", "Atta · 5×5kg"].map((t, i) => (
              <div key={t} className="flex items-center justify-between rounded-md bg-surface/50 px-2.5 py-1.5 text-[12px]">
                <span className="text-foreground">{t}</span>
                <CheckCircle2 className={`size-3.5 ${i < 2 ? "text-success" : "text-warning"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Multimodal extraction",
    desc: "Text, voice notes, and shelf photos all converge into a single structured schema with traceable confidence.",
    icon: Workflow,
    span: "col-span-12 md:col-span-7",
    accent: (
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[MessageSquare, Mic, ImageIcon].map((Icon, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-surface/40 py-3">
            <Icon className="mx-auto size-4 text-primary" />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Confidence scoring",
    desc: "Every field carries an AI confidence value, so reviewers see exactly where to focus.",
    icon: BarChart3,
    span: "col-span-12 md:col-span-5",
    accent: (
      <div className="mt-6 flex items-center gap-4">
        <ConfidenceRing value={94} size={56} strokeWidth={4} />
        <div className="flex-1 space-y-2">
          <ConfidenceBar value={94} />
          <ConfidenceBar value={71} />
          <ConfidenceBar value={42} />
        </div>
      </div>
    ),
  },
  {
    title: "Human-in-the-loop",
    desc: "Approve, reject, or correct in one keystroke. Feedback flows back into the model.",
    icon: ShieldCheck,
    span: "col-span-12 md:col-span-4",
    accent: null,
  },
  {
    title: "Real-time pipeline",
    desc: "Sub-second routing from WhatsApp inbox to your operations queue, with full audit trails.",
    icon: Zap,
    span: "col-span-12 md:col-span-4",
    accent: null,
  },
  {
    title: "Source preservation",
    desc: "Original message, transcript, OCR text, and raw AI response — always one click away.",
    icon: Brain,
    span: "col-span-12 md:col-span-4",
    accent: null,
  },
] as const;

const STEPS = [
  { title: "Inbound", desc: "WhatsApp message hits the webhook and is classified by media type.", icon: MessageSquare },
  { title: "Transform", desc: "Audio is transcribed, images are OCR'd, text is normalized.", icon: Workflow },
  { title: "Extract", desc: "LLM parses items, quantities, units — each with a confidence score.", icon: Brain },
  { title: "Review", desc: "Operators approve, correct, or reject in the review console.", icon: ShieldCheck },
] as const;

const MOCK_ROWS = [
  { id: 412, retailer: "Sharma Kirana", items: 8, type: "audio", c: 94 },
  { id: 411, retailer: "Patel Stores", items: 3, type: "text", c: 82 },
  { id: 410, retailer: "Verma Wholesale", items: 12, type: "image", c: 67 },
  { id: 409, retailer: "Anand Foods", items: 5, type: "text", c: 91 },
];
