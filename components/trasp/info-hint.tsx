"use client";

import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Shield, Sparkles, CheckCircle2, X } from "lucide-react";

interface InfoHintProps {
  title: string;
  description: string;
  howItWorks?: string[];
  badge?: string;
  className?: string;
  align?: "start" | "center" | "end";
}

export function InfoHint({
  title,
  description,
  howItWorks,
  badge,
  className = "",
  align = "start",
}: InfoHintProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 250);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={`Penjelasan fitur: ${title}`}
          className={`inline-flex items-center justify-center w-4 h-4 rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-mono font-bold text-[10px] leading-none transition-all cursor-pointer shadow-none shrink-0 select-none ${className}`}
        >
          !
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={6}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-80 p-3.5 bg-popover text-popover-foreground border-border shadow-lg rounded-none z-50 text-xs space-y-2.5 animate-in fade-in-50 zoom-in-95"
      >
        <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2">
          <div className="space-y-0.5">
            <div className="font-serif font-bold text-sm text-foreground flex items-center gap-1.5">
              <span>{title}</span>
            </div>
            {badge && (
              <span className="inline-block text-[10px] font-mono font-medium px-1.5 py-0.2 bg-primary/10 text-primary border border-primary/20">
                {badge}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer rounded-none"
            aria-label="Tutup penjelasan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-foreground/90 font-sans">
          {description}
        </p>

        {howItWorks && howItWorks.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-muted-foreground block">
              Cara Kerja:
            </span>
            <ul className="space-y-1 text-[11px] text-foreground/80 font-sans">
              {howItWorks.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-mono text-primary font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
