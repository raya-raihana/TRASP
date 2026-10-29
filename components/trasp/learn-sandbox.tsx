"use client";

import { useState, useRef, useEffect } from "react";
import {
  Smartphone,
  Terminal,
  Activity,
  RotateCcw,
  CheckCircle,
  Send,
  ArrowRight,
  ShieldAlert,
  Volume2,
  VolumeX,
  FileCode,
  FileText,
  CheckCheck,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  SANDBOX_SCENARIOS,
  SandboxScenario,
  DialogueChoice,
  matchCustomUserReply
} from "@/lib/trasp/sandbox-data";

interface LearnSandboxProps {
  initialScenarioId?: string;
  onSwitchToAct?: () => void;
}

export function LearnSandbox({
  initialScenarioId = "apk-kurir",
  onSwitchToAct
}: LearnSandboxProps) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(
    SANDBOX_SCENARIOS[initialScenarioId] ? initialScenarioId : "apk-kurir"
  );
  const scenario =
    SANDBOX_SCENARIOS[selectedScenarioKey] || SANDBOX_SCENARIOS["apk-kurir"];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<
    Array<{
      sender: "scammer" | "user";
      text: string;
      time: string;
      attachment?: {
        type: "apk" | "link" | "receipt" | "document";
        name: string;
        size?: string;
        meta?: string;
      };
    }>
  >([
    {
      sender: "scammer",
      text: scenario.steps[0].scammerMessage,
      time: scenario.steps[0].timestamp,
      attachment: scenario.steps[0].attachment
    }
  ]);

  const [vulnerability, setVulnerability] = useState(scenario.initialVulnerability);
  const [telemetry, setTelemetry] = useState(scenario.steps[0].scammerTelemetry);
  const [isFinished, setIsFinished] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "telemetry">("chat");

  // Interactive Live Chat with Gemini AI Engine
  const [customInput, setCustomInput] = useState("");
  const [isScammerTyping, setIsScammerTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasNewTelemetry, setHasNewTelemetry] = useState(false);
  const [selectedAttachmentModal, setSelectedAttachmentModal] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<string>("gemini-ai");

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isScammerTyping]);

  // Sync when initialScenarioId prop changes
  useEffect(() => {
    if (initialScenarioId && SANDBOX_SCENARIOS[initialScenarioId]) {
      resetSimulation(initialScenarioId);
    }
  }, [initialScenarioId]);

  // Web audio pop feedback
  const playChime = (isScammer = false) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(isScammer ? 440 : 640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isScammer ? 660 : 840, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  const resetSimulation = (scenarioKey: string) => {
    const sc = SANDBOX_SCENARIOS[scenarioKey] || SANDBOX_SCENARIOS["apk-kurir"];
    setSelectedScenarioKey(scenarioKey);
    setCurrentStepIndex(0);
    setChatHistory([
      {
        sender: "scammer",
        text: sc.steps[0].scammerMessage,
        time: sc.steps[0].timestamp,
        attachment: sc.steps[0].attachment
      }
    ]);
    setVulnerability(sc.initialVulnerability);
    setTelemetry(sc.steps[0].scammerTelemetry);
    setIsFinished(false);
    setCustomInput("");
    setIsScammerTyping(false);
    setHasNewTelemetry(false);
    setSelectedAttachmentModal(null);
  };

  const handleSendMessage = async (userText: string, staticChoice?: DialogueChoice) => {
    if (isScammerTyping || isFinished || !userText.trim()) return;

    const userTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // 1. Add user reply immediately to UI
    const updatedHistory = [
      ...chatHistory,
      { sender: "user" as const, text: userText, time: userTime }
    ];
    setChatHistory(updatedHistory);
    playChime(false);
    setCustomInput("");
    setIsScammerTyping(true);

    let responseData: {
      scammerResponse: string;
      activeTactic: string;
      scammerMood: "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED";
      internalThought: string;
      vulnerabilityDelta: number;
      source: string;
    };

    try {
      // Call Gemini 3.8 Flash API route
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedScenarioKey,
          userMessage: userText,
          chatHistory: updatedHistory,
          currentVulnerability: vulnerability
        })
      });

      if (res.ok) {
        const data = await res.json();
        responseData = {
          scammerResponse: data.scammerResponse,
          activeTactic: data.activeTactic,
          scammerMood: data.scammerMood,
          internalThought: data.internalThought,
          vulnerabilityDelta: data.vulnerabilityDelta,
          source: data.source || "gemini-ai"
        };
      } else {
        throw new Error("API offline");
      }
    } catch {
      // Deterministic Offline Fallback (Kepatuhan Juknis: Zero Crash)
      if (staticChoice) {
        responseData = {
          scammerResponse: staticChoice.scammerResponse,
          activeTactic: staticChoice.nextTelemetry.activeTactic,
          scammerMood: staticChoice.nextTelemetry.scammerMood,
          internalThought: staticChoice.nextTelemetry.internalThought,
          vulnerabilityDelta: staticChoice.vulnerabilityDelta,
          source: "fallback-preset"
        };
      } else {
        const fb = matchCustomUserReply(userText, selectedScenarioKey, currentStepIndex);
        responseData = {
          scammerResponse: fb.scammerResponse,
          activeTactic: fb.nextTelemetry.activeTactic,
          scammerMood: fb.nextTelemetry.scammerMood,
          internalThought: fb.nextTelemetry.internalThought,
          vulnerabilityDelta: fb.vulnerabilityDelta,
          source: "fallback-heuristic"
        };
      }
    }

    setLastSource(responseData.source);

    // Realistic typing delay (800ms)
    setTimeout(() => {
      setIsScammerTyping(false);
      const scammerTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });

      setChatHistory((prev) => [
        ...prev,
        { sender: "scammer", text: responseData.scammerResponse, time: scammerTime }
      ]);
      playChime(true);

      const newVuln = Math.min(
        100,
        Math.max(5, vulnerability + responseData.vulnerabilityDelta)
      );
      setVulnerability(newVuln);
      setTelemetry({
        activeTactic: responseData.activeTactic,
        scammerMood: responseData.scammerMood,
        internalThought: responseData.internalThought
      });
      setHasNewTelemetry(true);

      if (responseData.scammerMood === "BUSTED" || currentStepIndex >= 4) {
        setIsFinished(true);
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }, 850);
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case "CONFIDENT":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10"
          >
            ● Percaya Diri (Agresif)
          </Badge>
        );
      case "PUSHING":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-rose-500/40 text-rose-500 bg-rose-500/10"
          >
            ▲ Menekan Batas Waktu
          </Badge>
        );
      case "DEFLECTING":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-yellow-500/40 text-yellow-500 bg-yellow-500/10"
          >
            ◆ Defensif / Mengalihkan
          </Badge>
        );
      case "PANICKED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-purple-500/40 text-purple-400 bg-purple-500/10"
          >
            ⚡ Panik Terdesak
          </Badge>
        );
      case "BUSTED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-bold"
          >
            ✓ Terbongkar (Busted)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-mono border-border">
            {mood}
          </Badge>
        );
    }
  };

  const currentStep = scenario.steps[currentStepIndex % scenario.steps.length];

  return (
    <div className="space-y-4">
      {/* Sleek Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-muted/40 border border-border px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Skenario Aktif:</span>
          <select
            value={selectedScenarioKey}
            onChange={(e) => resetSimulation(e.target.value)}
            className="text-xs bg-background border border-border px-2.5 py-1 font-medium text-foreground cursor-pointer focus:outline-none"
          >
            <option value="apk-kurir">1. Resi Kurir &amp; Undangan .APK (Trojan)</option>
            <option value="loker-bumn">2. Loker Freelance BUMN (Task Fraud)</option>
            <option value="phishing-pajak">3. Tagihan Pajak DJP (Phishing)</option>
            <option value="m-banking-palsu">4. Salah Transfer &amp; Struk Editan</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hidden sm:flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            Gemini 3.8 AI Active
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
            title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 mr-1" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? "Audio On" : "Mute"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => resetSimulation(selectedScenarioKey)}
            className="text-xs h-7 px-2.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Mulai Ulang
          </Button>
        </div>
      </div>

      {/* Mobile-Friendly Switcher */}
      <div className="flex lg:hidden bg-muted/50 p-1 border border-border">
        <button
          type="button"
          onClick={() => {
            setMobileTab("chat");
            setHasNewTelemetry(false);
          }}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === "chat"
              ? "bg-background text-foreground font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Chat Simulasi
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileTab("telemetry");
            setHasNewTelemetry(false);
          }}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 relative ${
            mobileTab === "telemetry"
              ? "bg-background text-foreground font-semibold border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-primary" />
          Telemetri Pelaku (X-Ray)
          {hasNewTelemetry && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-3 animate-ping" />
          )}
        </button>
      </div>

      {/* Split-Screen Main Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Screen: Mock Phone / Chat Simulator (6 Cols) */}
        <div
          className={`lg:col-span-6 flex flex-col h-[560px] sm:h-[620px] bg-slate-950 border border-border overflow-hidden shadow-none ${
            mobileTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Mock Phone Header */}
          <div className="bg-slate-900 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                {scenario.scammerAvatar}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  {scenario.scammerName}
                </h4>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  {isScammerTyping ? (
                    <span className="italic text-emerald-300 animate-pulse">
                      sedang mengetik...
                    </span>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Online ({scenario.scammerNumber})
                    </>
                  )}
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-[10px] text-slate-300 border-slate-700 bg-slate-800/80"
            >
              Simulasi WhatsApp
            </Badge>
          </div>

          {/* Chat Messages Body */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
          >
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 text-xs border ${
                    msg.sender === "user"
                      ? "bg-emerald-800 text-slate-50 border-emerald-700 rounded-tl-lg rounded-tr-none rounded-br-lg rounded-bl-lg"
                      : "bg-slate-900 text-slate-100 border-slate-800 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Simulated Dangerous Attachment Card */}
                  {msg.attachment && (
                    <div
                      onClick={() =>
                        setSelectedAttachmentModal(
                          msg.attachment ? msg.attachment.meta || msg.attachment.name : null
                        )
                      }
                      className="mt-2.5 p-2 bg-slate-950/80 border border-rose-500/40 hover:border-rose-400 transition-colors cursor-pointer flex items-center justify-between gap-2 text-[11px]"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {msg.attachment.type === "apk" ? (
                          <FileCode className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <div className="font-mono font-bold text-slate-200 truncate">
                            {msg.attachment.name}
                          </div>
                          <div className="text-[9px] text-rose-400 font-mono">
                            {msg.attachment.size ? `${msg.attachment.size} • ` : ""}
                            [Peringatan: Berbahaya]
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] text-primary underline shrink-0">
                        Detail
                      </span>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                      msg.sender === "user" ? "text-emerald-200" : "text-slate-500"
                    }`}
                  >
                    <span>{msg.time}</span>
                    {msg.sender === "user" && (
                      <CheckCheck className="w-3 h-3 text-emerald-300 inline" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isScammerTyping && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 w-fit rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="text-[10px] text-slate-400 font-mono ml-1">
                  penipu sedang merancang balasan...
                </span>
              </div>
            )}
          </div>

          {/* Quick Reply & Typing Input Footer */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 shrink-0 space-y-2.5">
            {!isFinished && currentStep && (
              <>
                {/* Smart Suggestion Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-primary" />
                      Saran Pilihan Cepat:
                    </span>
                    <span className="text-[9px] text-slate-500">
                      (Bisa klik saran atau ketik bebas)
                    </span>
                  </div>

                  <div className="space-y-1">
                    {currentStep.userChoices.map((choice, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={isScammerTyping}
                        onClick={() => handleSendMessage(choice.text, choice)}
                        className={`w-full text-left p-2 border text-xs transition-colors cursor-pointer flex items-start gap-2 ${
                          choice.type === "CRITICAL"
                            ? "bg-slate-950/70 border-slate-800 hover:border-emerald-500/80 text-slate-200 hover:bg-slate-800/80"
                            : choice.type === "VULNERABLE"
                            ? "bg-slate-950/70 border-slate-800 hover:border-rose-500/80 text-slate-300 hover:bg-slate-800/80"
                            : "bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-300 hover:bg-slate-800/80"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span
                          className={`font-mono font-bold text-[10px] mt-0.5 px-1 py-0.2 border ${
                            choice.type === "CRITICAL"
                              ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
                              : choice.type === "VULNERABLE"
                              ? "text-rose-400 border-rose-500/30 bg-rose-950/20"
                              : "text-slate-400 border-slate-700 bg-slate-900"
                          }`}
                        >
                          {choice.type === "CRITICAL"
                            ? "KRITIS"
                            : choice.type === "VULNERABLE"
                            ? "RENTAN"
                            : "NETRAL"}
                        </span>
                        <span className="leading-snug flex-1 text-[11px]">
                          {choice.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free-form Custom Typing Input with Gemini AI */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(customInput);
                  }}
                  className="flex items-center gap-1.5 pt-1 border-t border-slate-800"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={customInput}
                    disabled={isScammerTyping}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Ketik balasan bebas Anda ke penipu di sini (didukung AI)..."
                    className="flex-1 bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!customInput.trim() || isScammerTyping}
                    className="h-8 px-3 text-xs bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Kirim
                  </Button>
                </form>
              </>
            )}

            {isFinished && (
              <div className="text-center py-2 space-y-2 bg-slate-950 p-3 border border-slate-800">
                <p className="text-xs text-slate-300 font-medium">
                  Skenario berakhir. Buka panel kanan untuk melihat evaluasi psikologis &amp; rekomendasi mitigasi.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resetSimulation(selectedScenarioKey)}
                  className="text-xs h-7 text-slate-200 border-slate-700 cursor-pointer"
                >
                  Ulangi Skenario Ini
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Screen: Live Scammer Telemetry Terminal (6 Cols) */}
        <div
          className={`lg:col-span-6 flex flex-col h-[560px] sm:h-[620px] bg-slate-950 border border-primary/40 p-4 sm:p-5 font-mono text-xs text-slate-200 overflow-y-auto space-y-4 ${
            mobileTab === "telemetry" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Telemetry Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wide">
              <Terminal className="w-4 h-4" />
              <span>LIVE SCAMMER TELEMETRY X-RAY</span>
            </div>
            {getMoodBadge(telemetry.scammerMood)}
          </div>

          {/* Victim Vulnerability Gauge */}
          <div className="space-y-1.5 bg-slate-900/90 p-3.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Kerentanan Target Saat Ini:</span>
              <span
                className={`font-mono font-bold text-xs ${
                  vulnerability >= 70
                    ? "text-rose-400"
                    : vulnerability >= 40
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {vulnerability}% —{" "}
                {vulnerability >= 70
                  ? "BAHAYA TINGGI (Terjerat)"
                  : vulnerability >= 40
                  ? "WASPADALAH (Ragu-ragu)"
                  : "KEBAL (Paham Modus)"}
              </span>
            </div>
            <Progress value={vulnerability} className="h-2 rounded-none" />
            <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
              <span>0% Terlindungi</span>
              <span>50% Titik Kritis</span>
              <span>100% Saldo Dikuras</span>
            </div>
          </div>

          {/* Active Psychological Tactic */}
          <div className="space-y-1 bg-slate-900/90 p-3.5 border border-slate-800">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Taktik Manipulasi Aktif:</span>
              <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-700">
                Putaran {currentStepIndex + 1}
              </Badge>
            </div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5 text-primary">
              <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
              {telemetry.activeTactic}
            </div>
          </div>

          {/* Live Scammer Inner Monologue */}
          <div className="space-y-1.5 bg-muted/20 border border-border p-3.5 text-slate-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Monolog Batin Pelaku (Isi Kepala Sindikat):
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {lastSource === "gemini-ai" ? "Gemini AI" : "Heuristic"}
              </span>
            </div>
            <p className="text-xs leading-relaxed italic bg-black/60 p-3 border border-border text-slate-300">
              &quot;{telemetry.internalThought}&quot;
            </p>
          </div>

          {/* Forensic Advice Countermeasure */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-700/40 text-[11px] space-y-1 text-emerald-200">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panduan Tangkal Forensik:
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              {vulnerability >= 60
                ? "Pelaku mendeteksi keraguan Anda. Jangan lakukan tindakan apa pun (jangan klik, jangan transfer). Verifikasi ke kanal resmi sekarang."
                : "Pertahankan ketegasan. Tuntut identitas legal, nomor resi terdaftar, atau kontak hotline resmi untuk mematahkan gertakan pelaku."}
            </p>
          </div>

          {/* Post-Mortem Card (when scenario is finished) */}
          {isFinished && (
            <div className="p-4 bg-slate-900 border border-primary/50 space-y-3 mt-auto">
              <div className="flex items-center gap-2 text-foreground font-serif font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {scenario.postMortem.title}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {vulnerability <= 40
                  ? scenario.postMortem.criticalConclusion
                  : scenario.postMortem.vulnerableConclusion}
              </p>

              <div className="p-2.5 bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-primary">Pelajaran Kunci:</span>
                <p>{scenario.postMortem.coreLesson}</p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Ceklis Tindakan Preventif:
                </span>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                  {scenario.postMortem.recommendedActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              {onSwitchToAct && (
                <Button
                  size="sm"
                  onClick={onSwitchToAct}
                  className="w-full text-xs h-8 cursor-pointer mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Buka Protokol Mitigasi 15 Menit (Act)
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          )}

          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={() => setMobileTab("chat")}
            className="lg:hidden w-full text-center py-2 px-3 bg-muted text-foreground border border-border text-xs font-medium transition-colors mt-auto"
          >
            ← Kembali ke Chat WhatsApp
          </button>
        </div>
      </div>

      {/* Attachment Warning Modal */}
      {selectedAttachmentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500 max-w-md w-full p-5 space-y-4 text-slate-200">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Peringatan Forensik: Berkas Berbahaya
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Berkas ini merupakan representasi simulasi dari payload malware/phishing yang dikirim oleh penipu.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 text-[11px] text-rose-300 font-mono">
              Status Berkas: {selectedAttachmentModal}
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAttachmentModal(null)}
                className="text-xs h-7 border-slate-700 text-slate-200"
              >
                Tutup Peringatan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
