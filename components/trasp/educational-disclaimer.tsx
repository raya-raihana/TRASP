"use client";

import Link from "next/link";
import { IconInfoCircle, IconBook } from "@tabler/icons-react";

export function EducationalDisclaimer() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-none bg-muted/40 border border-border text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2 truncate">
        <IconInfoCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate">
          <strong className="text-foreground">Simulasi Edukasi:</strong> Analisis bersifat indikator probabilistik (Kepatuhan Juknis No. 29). Pemrosesan aman 100% di browser.
        </span>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/kompendium"
          className="text-primary hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
        >
          <IconBook className="w-3.5 h-3.5" />
          <span>Katalog Kasus & Regulasi</span>
        </Link>
        <span className="hidden md:inline-flex font-mono text-[10px] text-muted-foreground">
          • On-Device Security
        </span>
      </div>
    </div>
  );
}
