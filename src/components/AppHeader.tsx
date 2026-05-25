import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LayoutGrid, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/dashboard", label: "Orders", icon: LayoutGrid },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative grid size-7 place-items-center rounded-md bg-gradient-primary shadow-glow">
            <Sparkles className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">OrderMind</span>
          <span className="rounded-md border border-border/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            AI
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] md:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            <span className="text-muted-foreground">AI Pipeline</span>
            <span className="font-medium text-foreground">Operational</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            <Activity className="size-3 text-primary" />
            <span>v1.2.4</span>
          </div>
        </div>
      </div>
    </header>
  );
}
