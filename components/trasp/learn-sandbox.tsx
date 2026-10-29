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
        return <Badge variant="outline" className="text-[10px] font-mono border-border text-foreground">Percaya Diri</Badge>;
      case "PUSHING":
        return <Badge variant="outline" className="text-[10px] font-mono border-border text-foreground">Agresif</Badge>;
      case "DEFLECTING":
        return <Badge variant="outline" className="text-[10px] font-mono border-border text-foreground">Defensif</Badge>;
      case "PANICKED":
        return <Badge variant="outline" className="text-[10px] font-mono border-border text-foreground">Gugup</Badge>;
      case "BUSTED":
        return <Badge variant="outline" className="text-[10px] font-mono border-border text-emerald-600 dark:text-emerald-400">Tertangkap</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-mono border-border">{mood}</Badge>;
    }
  };

  const currentStep = scenario.steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Sleek Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-muted/40 border border-border px-3.5 py-2 rounded-none text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Skenario:</span>
          <select
            value={selectedScenarioKey}
            onChange={(e) => resetSimulation(e.target.value)}
            className="text-xs bg-background border border-border rounded-none px-2.5 py-1 font-medium text-foreground cursor-pointer"
          >
            <option value="apk-kurir">Undangan / Resi .APK</option>
            <option value="loker-bumn">Loker BUMN (Task Fraud)</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => resetSimulation(selectedScenarioKey)}
          className="text-xs h-7 px-2.5 cursor-pointer rounded-none"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Chat
        </Button>
      </div>

      {/* Mobile-Friendly Switcher (only on mobile < lg) */}
      <div className="flex lg:hidden bg-muted/50 p-1 rounded-none border border-border">
        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-none transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === "chat"
              ? "bg-background text-foreground shadow-none font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Chat Simulasi
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("telemetry")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-none transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === "telemetry"
              ? "bg-background text-foreground shadow-none font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Telemetri Pelaku
        </button>
      </div>

      {/* Split-Screen Main Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Screen: Victim WhatsApp Chat Phone (6 Cols) */}
        <div className={`lg:col-span-6 flex flex-col h-[520px] sm:h-[580px] bg-slate-900 border border-border rounded-none overflow-hidden shadow-none ${
          mobileTab === "chat" ? "flex" : "hidden lg:flex"
        }`}>
          {/* Mock Phone Header */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-lg">
                {scenario.scammerAvatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-serif">
                  {scenario.scammerName}
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Online {scenario.scammerNumber}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] text-slate-300 border-slate-600 bg-slate-900/40 rounded-none">
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
                  className={`max-w-[85%] rounded-none px-3.5 py-2.5 text-xs shadow-none border ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-slate-800 text-slate-100 border-slate-700"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "text-primary-foreground/70" : "text-slate-400"
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
                <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 font-serif">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  Pilih Balasan Anda untuk Menguji Penipu:
                </div>
                <div className="space-y-1.5">
                  {currentStep.userChoices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserChoice(choice)}
                      className="w-full text-left p-2.5 rounded-none border border-slate-700 bg-slate-900/80 hover:bg-slate-700 hover:border-primary text-slate-200 text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-bold mr-1.5 text-primary">[{i + 1}]</span>
                      {choice.text}
                    </button>
                  ))}
                </div>

                {lastChoiceType && (
                  <button
                    type="button"
                    onClick={() => setMobileTab("telemetry")}
                    className="lg:hidden w-full text-center py-1.5 px-3 bg-muted text-foreground border border-border rounded-none text-xs font-medium transition-colors mt-2"
                  >
                    Buka Panel Telemetri Pelaku
                  </button>
                )}
              </>
            )}

            {isFinished && (
              <div className="text-center py-2 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  Simulasi selesai. Lihat ringkasan evaluasi pada panel kanan.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetSimulation(selectedScenarioKey)}
                  className="text-xs h-7 text-slate-200 border-slate-600 rounded-none"
                >
                  Mulai Ulang Skenario Ini
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Screen: Live Scammer Telemetry Terminal (6 Cols) */}
        <div className={`lg:col-span-6 flex flex-col h-[520px] sm:h-[580px] bg-slate-950 border border-primary/30 rounded-none p-4 sm:p-5 shadow-none font-mono text-xs text-slate-200 overflow-y-auto space-y-4 sm:space-y-5 ${
          mobileTab === "telemetry" ? "flex" : "hidden lg:flex"
        }`}>
          {/* Telemetry Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-primary font-bold text-xs font-serif tracking-wide">
              <Terminal className="w-3.5 h-3.5" />
              <span>TELEMETRI PSIKOLOGIS PELAKU</span>
            </div>
            {getMoodBadge(telemetry.scammerMood)}
          </div>

          {/* Victim Vulnerability Gauge */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-none border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Kerentanan Target:</span>
              <span
                className={`font-mono font-bold ${
                  vulnerability >= 70
                    ? "text-accent"
                    : vulnerability >= 40
                    ? "text-primary"
                    : "text-emerald-400"
                }`}
              >
                {vulnerability}% ({vulnerability >= 70 ? "BAHAYA" : vulnerability >= 40 ? "WASPADALAH" : "KEBAL"})
              </span>
            </div>
            <Progress
              value={vulnerability}
              className="h-2 rounded-none"
            />
          </div>

          {/* Active Psychological Vector */}
          <div className="space-y-1 bg-slate-900/80 p-3 rounded-none border border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Taktik Manipulasi Aktif:
            </div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
              {telemetry.activeTactic}
            </div>
          </div>

          {/* Live Scammer Inner Monologue */}
          <div className="space-y-1.5 bg-muted/20 border border-border p-3 rounded-none text-slate-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Monolog Batin Pelaku:
            </div>
            <p className="text-xs leading-relaxed italic bg-black/40 p-2.5 rounded-none border border-border">
              "{telemetry.internalThought}"
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className="lg:hidden w-full text-center py-2 px-3 bg-muted text-foreground border border-border rounded-none text-xs font-medium transition-colors"
          >
            Kembali ke Chat
          </button>

          {/* Post-Mortem Card (when scenario is finished) */}
          {isFinished && (
            <div className="p-3.5 rounded-none bg-slate-900 border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-foreground font-serif font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-primary" />
                {scenario.postMortem.title}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability <= 40
                  ? scenario.postMortem.criticalConclusion
                  : scenario.postMortem.vulnerableConclusion}
              </p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <span className="font-semibold text-foreground">Pelajaran Kunci:</span> {scenario.postMortem.coreLesson}
              </div>

              {onSwitchToAct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSwitchToAct}
                  className="w-full text-xs h-8 cursor-pointer mt-1 rounded-none border-border"
                >
                  Buka Panduan Mitigasi (Act)
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
