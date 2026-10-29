"use client";

import { useState } from "react";
import { UserX, Zap, CheckCircle, RotateCcw, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
    <Card className="border-border shadow-xs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserX className="w-4 h-4 text-purple-500" />
              Simulasi Red Team (Pola Pikir Pelaku)
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Eksplorasi bagaimana manipulasi emosional digunakan untuk melemahkan kewaspadaan target.
            </CardDescription>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs h-8">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Uji Coba
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Victim Defense Meter */}
        <div className="bg-muted/30 border border-border p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Tingkat Skeptisisme Target:</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">
              {targetResistance}% {targetResistance === 0 ? "JEBOL" : "BERTAHAN"}
            </span>
          </div>
          <Progress
            value={targetResistance}
            className={`h-2.5 ${
              targetResistance <= 30
                ? "[&>div]:bg-rose-500"
                : targetResistance <= 70
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-emerald-500"
            }`}
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
                  className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/40 hover:border-purple-500/50 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2"
                >
                  <div>
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-500" />
                      {tactic.name}
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                      {tactic.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-500">
                    Dampak Melemahkan: {tactic.effect}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">
              Uji Coba Selesai: Mengapa Eksperimen Ini Sangat Berharga?
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Anda baru saja melihat sendiri bahwa <strong>penipuan siber bukan meretas komputer, melainkan meretas emosi manusia</strong>. Hanya dengan memicu rasa takut atau iming-iming uang, orang yang cerdas sekalipun bisa kehilangan kewaspadaan.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-background px-3 py-1 rounded-full border border-border text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                🛡️ Sekarang Anda Tahu Trik Mereka: Jangan Pernah Mengambil Keputusan Saat Sedang Ditekan Emosi!
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
                <div key={i} className="text-xs p-2 rounded-lg bg-muted/40 flex items-center justify-between">
                  <span><strong>{h.tactic}:</strong> {h.result}</span>
                  <span className="font-mono text-rose-500 font-bold shrink-0 ml-2">{h.resistanceChange}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
