"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Lock } from "lucide-react";

export function EducationalDisclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-amber-500/10 border-y sm:border sm:rounded-lg border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-3 mb-6 transition-all duration-200 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/20 rounded-md shrink-0 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm font-medium">
            <span className="font-bold underline decoration-amber-500">Transparansi & Disclaimer Edukasi (Kepatuhan Juknis No. 29):</span>{" "}
            TRASP adalah instrumen simulasi dan evaluasi indikator dini. Hasil analisis bersifat probabilistik dan tidak memberikan jaminan legalitas mutlak 100%.
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold hover:text-amber-600 dark:hover:text-amber-300 text-amber-700 dark:text-amber-300 transition-colors shrink-0 ml-auto sm:ml-0"
        >
          {isExpanded ? "Tutup Rincian" : "Pelajari Batasan"}
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 text-xs leading-relaxed space-y-2">
          <p>
            1. <strong>Tanpa Vonis Mutlak:</strong> Sistem ini tidak pernah mengklaim suatu interaksi "Pasti Aman" atau "Pasti Penipuan". Kami menggunakan skala probabilitas indikatif: <em>Indikator Kecurigaan Tinggi</em>, <em>Waspada</em>, dan <em>Indikator Rendah</em>.
          </p>
          <p className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              2. <strong>Zero Server Data Leak (Privasi Mutlak):</strong> Seluruh teks, tautan, dan gambar yang Anda unggah diproses langsung di peramban (browser) Anda tanpa disimpan ke basis data server.
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              3. <strong>Verifikasi Silang Wajib:</strong> Untuk transaksi keuangan dan pelaporan resmi, selalu lakukan konfirmasi langsung ke kontak resmi bank Anda atau saluran OJK (157).
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
