"use client";

import { ShieldCheck } from "lucide-react";

export function EducationalDisclaimer() {
  return (
    <div className="w-full bg-muted/40 border border-border px-3.5 py-2 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 select-none">
      <div className="flex items-center gap-2 min-w-0">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="text-[11px] leading-tight text-foreground/90 font-sans">
          <strong className="font-semibold text-foreground">Disclaimer Edukasi:</strong> Analisis bersifat indikator probabilistik edukatif (Kepatuhan Juknis MIT-WEEK No. 29). Pemrosesan aman 100% on-device di browser tanpa retensi data peladen.
        </span>
      </div>
      <span className="self-start sm:self-center text-[10px] font-mono px-1.5 py-0.5 bg-background border border-border text-muted-foreground shrink-0 uppercase tracking-wider">
        On-Device &middot; UU PDP No. 27/2022
      </span>
    </div>
  );
}
