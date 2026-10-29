"use client";

import { IconInfoCircle } from "@tabler/icons-react";

export function EducationalDisclaimer() {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-muted/40 border border-border text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2 truncate">
        <IconInfoCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">
          <strong className="text-foreground">Simulasi Edukasi:</strong> Analisis bersifat indikator probabilistik (Kepatuhan Juknis No. 29). Pemrosesan aman 100% di browser.
        </span>
      </div>
      <span className="hidden sm:inline-flex shrink-0 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
        On-Device Security
      </span>
    </div>
  );
}
