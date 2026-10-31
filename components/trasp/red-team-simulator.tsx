"use client";

import { useState } from "react";
import { UserX, Zap, CheckCircle, RotateCcw, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InfoHint } from "./info-hint";

export function RedTeamSimulator() {
  const [targetResistance, setTargetResistance] = useState(100);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [history, setHistory] = useState<Array<{ tactic: string; result: string; resistanceChange: number }>>([]);
  const [isDone, setIsDone] = useState(false);

  const tactics = [
    {
      name: "Trik Kepanikan & Batas Waktu",
      description: "Kirim pesan ancaman pemblokiran rekening dalam 10 menit.",
      effect: -35,
      resultText: "Korban mulai panik dan tangannya gemetar mencari kode verifikasi."
    },
    {
      name: "Iming-iming Komisi 500 Ribu",
      description: "Kirim bukti transfer palsu untuk meyakinkan korban dapat uang gratis.",
      effect: -45,
      resultText: "Korban tergiur dengan angka ratusan ribu dan menanyakan nomor rekening transfer deposit."
    },
    {
      name: "Pencatutan Nama Pejabat / Polisi",
      description: "Pakai foto profil berseragam dinas dan kata-kata hukum formal.",
      effect: -25,
      resultText: "Korban merasa segan dan tidak berani mendebat perintah pelaku."
    }
  ];

  const handleApplyTactic = (tactic: (typeof tactics)[0]) => {
    const newResistance = Math.max(0, targetResistance + tactic.effect);
    setTargetResistance(newResistance);
    setHistory([
      ...history,
      { tactic: tactic.name, result: tactic.resultText, resistanceChange: tactic.effect }
    ]);

    if (newResistance <= 0 || currentTurn >= 2) {
      setIsDone(true);
    } else {
      setCurrentTurn(currentTurn + 1);
    }
  };

  const handleReset = () => {
    setTargetResistance(100);
    setCurrentTurn(0);
    setHistory([]);
    setIsDone(false);
  };

  return (
    <Card className="border-border shadow-none rounded-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-serif font-bold tracking-tight flex items-center gap-2">
              <UserX className="w-4 h-4 text-primary" />
              <span>Simulasi Red Team</span>
              <InfoHint
                title="Mode Simulasi Red Team"
                badge="Eksplorasi Pola Pikir Penipu"
                description="Fitur edukatif untuk membedah psikologi rekayasa sosial dari sudut pandang penyerang (Red Team), sehingga Anda memahami bagaimana manipulasi emosi meruntuhkan pertahanan logika target."
                howItWorks={[
                  "Pilih taktik serangan sosial (Urgensi Waktu, Intimidasi Otoritas, atau Eksploitasi Empati).",
                  "Lihat bagaimana tingkat skeptisisme target berkurang jika diserang pada titik lemah emosionalnya.",
                  "Pahami celah psikologis tersebut agar Anda sendiri kebal saat dihadapkan pada situasi nyata."
                ]}
              />
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Eksplorasi bagaimana manipulasi emosional digunakan untuk melemahkan kewaspadaan target.
            </CardDescription>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs h-8 rounded-none">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Uji Coba
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Victim Defense Meter */}
        <div className="bg-muted/30 border border-border p-4 rounded-none space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Tingkat Skeptisisme Target:</span>
            <span className="font-mono text-primary font-bold">
              {targetResistance}% {targetResistance === 0 ? "JEBOL" : "BERTAHAN"}
            </span>
          </div>
          <Progress
            value={targetResistance}
            className="h-2 rounded-none"
          />
          <p className="text-[11px] text-muted-foreground">
            {targetResistance > 50
              ? "Target masih waspada dan meragukan identitas Anda."
              : targetResistance > 0
              ? "Target mulai panik dan kehilangan akal sehat karena tekanan emosional."
              : "Pertahanan target runtuh total! Korban bersiap menuruti instruksi berbahaya."}
          </p>
        </div>

        {/* Tactic Selection Area */}
        {!isDone ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground">
              Langkah {currentTurn + 1} dari 3: Pilih Taktik Manipulasi untuk Menembus Korban:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tactics.map((tactic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTactic(tactic)}
                  className="p-3.5 rounded-none border border-border bg-card hover:bg-muted/50 hover:border-primary text-left transition-all cursor-pointer flex flex-col justify-between space-y-2"
                >
                  <div>
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5 font-serif">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      {tactic.name}
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {tactic.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Dampak Melemahkan: {tactic.effect}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-none bg-muted/30 border border-border space-y-2.5 text-center">
            <h4 className="text-sm font-serif font-bold text-foreground">
              Evaluasi Red Team Selesai
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Eksperimen membuktikan bahwa manipulasi siber berfokus pada kerentanan psikologis manusia (urgensi palsu, ketakutan, iming-iming instan), bukan kelemahan teknis perangkat.
            </p>
            <div className="pt-1">
              <span className="inline-block bg-background px-3 py-1 rounded-none border border-border text-[11px] font-medium text-foreground">
                Kesimpulan: Hindari mengambil keputusan saat berada dalam tekanan emosi atau kepanikan.
              </span>
            </div>
          </div>
        )}

        {/* History Log */}
        {history.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
              Riwayat Trik Manipulasi:
            </h5>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <div key={i} className="text-xs p-2 rounded-none bg-muted/40 flex items-center justify-between border border-border">
                  <span><strong>{h.tactic}:</strong> {h.result}</span>
                  <span className="font-mono text-accent font-bold shrink-0 ml-2">{h.resistanceChange}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
