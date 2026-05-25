import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function ImageViewer({ src, alt = "" }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface/60">
          <img src={src} alt={alt} className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md">
            <ZoomIn className="size-3" />
            Zoom
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl border-border bg-background p-0">
        <div className="relative">
          <img src={src} alt={alt} className="max-h-[85vh] w-full rounded-lg object-contain" />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/80 backdrop-blur-md hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
