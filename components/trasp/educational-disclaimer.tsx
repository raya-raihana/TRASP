"use client";

import { ShieldCheck, Info } from "lucide-react";

export function EducationalDisclaimer() {
  return (
    <div className="w-full bg-muted/40 border-b border-border py-2 px-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
      <span>
        <strong>Transparansi Forensik:</strong> TRASP menyajikan indikator kecurigaan edukatif berdasarkan pola linguistik & teknis, bukan vonis mutlak 100%. Verifikasi selalu ke institusi terkait (Kepatuhan Juknis MIT-WEEK 2026 UNMUL).
      </span>
    </div>
  );
}
