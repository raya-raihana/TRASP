"use client";

import { useState } from "react";
import {
  Smartphone,
  Terminal,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  SANDBOX_SCENARIOS,
  SandboxScenario,
  DialogueChoice
} from "@/lib/trasp/sandbox-data";

interface LearnSandboxProps {
  initialScenarioId?: string;
  onSwitchToAct?: () => void;
}

export function LearnSandbox({ initialScenarioId = "apk-kurir", onSwitchToAct }: LearnSandboxProps) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(
    SANDBOX_SCENARIOS[initialScenarioId] ? initialScenarioId : "apk-kurir"
  );
  const scenario = SANDBOX_SCENARIOS[selectedScenarioKey] || SANDBOX_SCENARIOS["apk-kurir"];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "scammer" | "user"; text: string; time: string }>>([
    {
      sender: "scammer",
      text: scenario.steps[0].scammerMessage,
      time: scenario.steps[0].timestamp
    }
  ]);
  const [vulnerability, setVulnerability] = useState(scenario.initialVulnerability);
  const [telemetry, setTelemetry] = useState(scenario.steps[0].scammerTelemetry);
  const [isFinished, setIsFinished] = useState(false);
  const [lastChoiceType, setLastChoiceType] = useState<"VULNERABLE" | "NEUTRAL" | "CRITICAL" | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "telemetry">("chat");

  const resetSimulation = (scenarioKey: string) => {
    const sc = SANDBOX_SCENARIOS[scenarioKey] || SANDBOX_SCENARIOS["apk-kurir"];
    setSelectedScenarioKey(scenarioKey);
    setCurrentStepIndex(0);
    setChatHistory([
      {
        sender: "scammer",
        text: sc.steps[0].scammerMessage,
        time: sc.steps[0].timestamp
      }
    ]);
    setVulnerability(sc.initialVulnerability);
    setTelemetry(sc.steps[0].scammerTelemetry);
    setIsFinished(false);
    setLastChoiceType(null);
  };

  const handleUserChoice = (choice: DialogueChoice) => {
    // 1. Add user reply to chat history
    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const newHistory = [
      ...chatHistory,
      { sender: "user" as const, text: choice.text, time: userTime },
      { sender: "scammer" as const, text: choice.scammerResponse, time: userTime }
    ];
    setChatHistory(newHistory);

    // 2. Update vulnerability meter
    const newVuln = Math.min(100, Math.max(5, vulnerability + choice.vulnerabilityDelta));
    setVulnerability(newVuln);
    setTelemetry(choice.nextTelemetry);
    setLastChoiceType(choice.type);

    // 3. Check next step or finish
    const nextStep = currentStepIndex + 1;
    if (nextStep < scenario.steps.length && choice.nextTelemetry.scammerMood !== "BUSTED") {
      setCurrentStepIndex(nextStep);
    } else {
      setIsFinished(true);
    }
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case "CONFIDENT":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/40">🔴 Percaya Diri (Menekan)</Badge>;
      case "PUSHING":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">🟡 Agresif Mengejar Batas Waktu</Badge>;
      case "DEFLECTING":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">🟣 Mengalihkan Pertanyaan</Badge>;
      case "PANICKED":
        return <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/40">🔵 Mulai Gugup &amp; Gertak Sambal</Badge>;
      case "BUSTED":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">🟢 Tertangkap Basah (Kalah)</Badge>;
      default:
        return <Badge variant="outline">{mood}</Badge>;
    }
  };

  const currentStep = scenario.steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Sleek Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-muted/40 border border-border px-3.5 py-2 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Skenario:</span>
          <select
            value={selectedScenarioKey}
            onChange={(e) => resetSimulation(e.target.value)}
            className="text-xs bg-background border border-border rounded px-2.5 py-1 font-medium text-foreground cursor-pointer"
          >
            <option value="apk-kurir">Undangan / Resi .APK</option>
            <option value="loker-bumn">Loker BUMN (Task Fraud)</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => resetSimulation(selectedScenarioKey)}
          className="text-xs h-7 px-2.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Chat
        </Button>
      </div>

      {/* Mobile-Friendly Switcher (only on mobile < lg) */}
      <div className="flex lg:hidden bg-muted/70 p-1 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "chat"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          📱 Chat HP Simulasi
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("telemetry")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "telemetry"
              ? "bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          ⚡ X-Ray Otak Penipu
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>
      </div>

      {/* Split-Screen Main Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Screen: Victim WhatsApp Chat Phone (6 Cols) */}
        <div className={`lg:col-span-6 flex flex-col h-[520px] sm:h-[580px] bg-slate-900 border border-border rounded-lg overflow-hidden shadow-xs ${
          mobileTab === "chat" ? "flex" : "hidden lg:flex"
        }`}>
          {/* Mock Phone Header */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-lg">
                {scenario.scammerAvatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  {scenario.scammerName}
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Online {scenario.scammerNumber}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-600 bg-slate-900/40">
              Simulasi WhatsApp
            </Badge>
          </div>

          {/* Chat Messages Scrollable Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs shadow-xs ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Response Options Footer */}
          <div className="p-3 bg-slate-800/95 border-t border-slate-700 shrink-0 space-y-2">
            {!isFinished && currentStep && (
              <>
                <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Pilih Balasan Anda untuk Menguji Penipu:
                </div>
                <div className="space-y-1.5">
                  {currentStep.userChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserChoice(choice)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-bold mr-1.5 text-emerald-400">[{i + 1}]</span>
                      {choice.text}
                    </button>
                  ))}
                </div>

                {lastChoiceType && (
                  <button
                    type="button"
                    onClick={() => setMobileTab("telemetry")}
                    className="lg:hidden w-full text-center py-1.5 px-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-colors mt-2"
                  >
                    ⚡ Intip Reaksi Isi Kepala Penipu di X-Ray 👉
                  </button>
                )}
              </>
            )}

            {isFinished && (
              <div className="text-center py-2 space-y-2">
                <p className="text-xs text-emerald-400 font-bold">
                  Sesi Simulasi Selesai! Lihat Evaluasi Otak Penipu di Panel Kanan 👉
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetSimulation(selectedScenarioKey)}
                  className="text-xs h-7 text-slate-200 border-slate-600"
                >
                  Mulai Ulang Skenario Ini
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Screen: Live Scammer Telemetry Terminal (6 Cols) */}
        <div className={`lg:col-span-6 flex flex-col h-[520px] sm:h-[580px] bg-slate-950 border border-emerald-900/50 rounded-lg p-4 sm:p-5 shadow-xs font-mono text-xs text-slate-200 overflow-y-auto space-y-4 sm:space-y-5 ${
          mobileTab === "telemetry" ? "flex" : "hidden lg:flex"
        }`}>
          {/* Telemetry Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Terminal className="w-3.5 h-3.5" />
              <span>TELEMETRI PSIKOLOGIS PELAKU</span>
            </div>
            {getMoodBadge(telemetry.scammerMood)}
          </div>

          {/* Victim Vulnerability Gauge */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-md border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Kerentanan Target:</span>
              <span
                className={`font-mono ${
                  vulnerability >= 70
                    ? "text-rose-400"
                    : vulnerability >= 40
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {vulnerability}% ({vulnerability >= 70 ? "BAHAYA" : vulnerability >= 40 ? "WASPADALAH" : "KEBAL"})
              </span>
            </div>
            <Progress
              value={vulnerability}
              className={`h-2 ${
                vulnerability >= 70
                  ? "[&>div]:bg-rose-500"
                  : vulnerability >= 40
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-emerald-500"
              }`}
            />
          </div>

          {/* Active Psychological Vector */}
          <div className="space-y-1 bg-slate-900/80 p-3 rounded-md border border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Taktik Manipulasi Aktif:
            </div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {telemetry.activeTactic}
            </div>
          </div>

          {/* Live Scammer Inner Monologue */}
          <div className="space-y-1.5 bg-rose-950/20 border border-rose-900/50 p-3 rounded-md text-rose-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Monolog Batin Pelaku:
            </div>
            <p className="text-xs leading-relaxed italic bg-black/40 p-2.5 rounded border border-rose-900/30">
              "{telemetry.internalThought}"
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className="lg:hidden w-full text-center py-2 px-3 bg-slate-900 text-slate-200 border border-slate-700 hover:border-emerald-500/40 rounded-lg text-xs font-bold transition-colors"
          >
            👈 Balas Chat Lagi di WhatsApp Simulasi
          </button>

          {/* Post-Mortem Card (when scenario is finished) */}
          {isFinished && (
            <div className="p-4 rounded-lg bg-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                {scenario.postMortem.title}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability <= 40
                  ? scenario.postMortem.criticalConclusion
                  : scenario.postMortem.vulnerableConclusion}
              </p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 font-semibold">
                💡 Pelajaran Kunci: {scenario.postMortem.coreLesson}
              </div>

              {onSwitchToAct && (
                <Button
                  onClick={onSwitchToAct}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 cursor-pointer mt-2"
                >
                  Pelajari Protokol Darurat &amp; Laporan (Act)
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
