import { useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AudioPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play();
    setPlaying(!playing);
  };

  const bars = Array.from({ length: 56 });

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <audio
        ref={ref}
        src={src}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 translate-x-px" fill="currentColor" />}
        </button>

        <div className="flex h-10 flex-1 items-center gap-[2px]">
          {bars.map((_, i) => {
            const pct = duration ? progress / duration : 0;
            const active = i / bars.length <= pct;
            const h = 20 + Math.abs(Math.sin(i * 0.7)) * 60;
            return (
              <span
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-colors",
                  active ? "bg-primary" : "bg-border-strong/70",
                )}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums text-muted-foreground">
          <Volume2 className="size-3.5" />
          <span>{fmt(progress)} / {fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
