"use client";

import { useState } from "react";
import { IconVideo, IconPlayerPlay, IconExternalLink } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoDemoDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  videoId?: string;
}

export function VideoDemoDialog({
  trigger,
  open,
  onOpenChange,
  videoId = "4-OiCrQ8kHI",
}: VideoDemoDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  const watchUrl = `https://youtu.be/${videoId}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsPlaying(false);
    }
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl md:max-w-3xl p-4 bg-background border-border">
        <DialogHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <IconVideo className="h-4 w-4 text-primary" />
              <span>Video Demonstrasi Live — TRASP</span>
            </DialogTitle>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              title="Buka langsung di YouTube"
            >
              <span>Buka di YouTube</span>
              <IconExternalLink className="w-3 h-3" />
            </a>
          </div>
        </DialogHeader>

        <div className="pt-3 space-y-2">
          <div className="relative aspect-video w-full bg-slate-950 border border-border overflow-hidden">
            {isPlaying ? (
              <iframe
                src={embedUrl}
                title="Video Demonstrasi TRASP"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="group relative w-full h-full flex flex-col items-center justify-center cursor-pointer bg-slate-950 transition-colors hover:bg-slate-900"
              >
                {/* High-res YouTube thumbnail poster */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Thumbnail Video Demonstrasi TRASP"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                <button
                  type="button"
                  className="relative z-10 w-14 h-14 rounded-full bg-primary/90 border border-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all cursor-pointer"
                  aria-label="Putar Video"
                >
                  <IconPlayerPlay className="w-6 h-6 ml-0.5 fill-current" />
                </button>
                <span className="relative z-10 mt-3 text-xs font-mono font-medium text-white/90 bg-black/60 px-2 py-0.5 border border-white/20">
                  Klik untuk Memutar Demonstrasi (YouTube)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1">
            <span>Kompetisi Web Development MIT-WEEK 2026 UNMUL</span>
            <span>Tim Tiga Trio (MIT-010)</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
