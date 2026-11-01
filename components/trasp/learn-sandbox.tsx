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
  ShieldCheck,
  Bot,
  User,
  Zap,
  HelpCircle,
  BookOpen,
  Copy,
  Check,
  Scale,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  SANDBOX_SCENARIOS,
  SandboxScenario,
  DialogueChoice,
  matchCustomUserReply
} from "@/lib/trasp/sandbox-data";
import { InfoHint } from "./info-hint";

interface LearnSandboxProps {
  initialScenarioId?: string;
  onSwitchToAct?: (scenarioId?: string) => void;
}

interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
  source?: string;
  vectors?: string[];
  recommendedAction?: string;
}

const DEFAULT_ASSISTANT_GREETING: AssistantMessage = {
  id: "greet-1",
  sender: "assistant",
  text: `Halo! Saya **TRASP AI Forensic Copilot**, asisten forensik siber yang terhubung langsung dengan **Google AI Studio (Gemini 3.6 Flash)**.

Kita bisa berdiskusi langsung layaknya rekan analis keamanan siber (*pair cyber analyst*):
- 🔍 **Bedah Pesan:** Tempel teks chat WhatsApp atau SMS yang mencurigakan.
- 🚨 **Mitigasi Darurat:** Panduan taktis *Golden Time (15-30 Menit)* jika telanjur klik/transfer.
- ⚖️ **Kajian Yuridis:** Analisis jerat hukum *UU ITE No. 1/2024* dan *Pasal 378 KUHP*.
- 🏛️ **Kanal Otoritas:** Prosedur aduan kilat ke *IASC OJK (iasc.ojk.go.id)* atau *Patroli Siber Polri*.

Ada sampel pesan atau studi kasus yang ingin kita telusuri bersama?`,
  time: "Baru saja",
  source: "gemini-ai (gemini-3.6-flash)",
  vectors: ["AI Forensik Studio", "Regulasi OJK & Polri", "UU ITE 2024"],
};

const SUGGESTED_ASSISTANT_PROMPTS = [
  "Bagaimana cara membedakan file APK kurir asli vs trojan perbankan?",
  "Jika saya telanjur transfer uang ke penipu, apa langkah 15 menit pertama?",
  "Apa bunyi pasal dan ancaman hukuman UU ITE No. 1/2024 untuk penipuan siber?",
  "Tolong analisis pesan ini: 'Selamat akun m-Banking Anda menang undian 50jt, klik link ini'",
];

export function LearnSandbox({
  initialScenarioId = "apk-kurir",
  onSwitchToAct
}: LearnSandboxProps) {
  // Unified Mode: "simulator" (WhatsApp roleplay) vs "assistant" (Forensic AI consultation)
  const [subMode, setSubMode] = useState<"simulator" | "assistant">("simulator");

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

  // Simulator Interactive Chat with Gemini AI Engine
  const [customInput, setCustomInput] = useState("");
  const [isScammerTyping, setIsScammerTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasNewTelemetry, setHasNewTelemetry] = useState(false);
  const [selectedAttachmentModal, setSelectedAttachmentModal] = useState<string | null>(null);
  const [lastSource, setLastSource] = useState<string>("gemini-ai");

  // Assistant Chat State
  const [assistantHistory, setAssistantHistory] = useState<AssistantMessage[]>([DEFAULT_ASSISTANT_GREETING]);
  const [assistantInput, setAssistantInput] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Track user decisions throughout simulation turns for Post-Mortem Review
  const [userDecisions, setUserDecisions] = useState<
    Array<{
      turn: number;
      userText: string;
      type: "CRITICAL" | "VULNERABLE" | "NEUTRAL";
      delta: number;
      tactic: string;
    }>
  >([]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const assistantScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll simulator chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isScammerTyping]);

  // Auto-scroll assistant chat
  useEffect(() => {
    if (assistantScrollRef.current) {
      assistantScrollRef.current.scrollTop = assistantScrollRef.current.scrollHeight;
    }
  }, [assistantHistory, isAssistantTyping]);

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

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isScammer) {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // AudioContext policy
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
    setUserDecisions([]);
    setCustomInput("");
    setIsScammerTyping(false);
    setHasNewTelemetry(false);
  };

  // Send message to Scammer Simulator (Roleplay)
  const handleSendSimulatorChat = async (textToSend?: string, staticChoice?: DialogueChoice) => {
    const userText = textToSend || customInput.trim();
    if (!userText || isScammerTyping || isFinished) return;

    const userTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

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
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedScenarioKey,
          userMessage: userText,
          chatHistory: updatedHistory,
          currentVulnerability: vulnerability,
          currentStepIndex: currentStepIndex,
          mode: "scammer",
        })
      });

      if (res.ok) {
        const data = await res.json();
        responseData = {
          scammerResponse: data.scammerResponse || "...",
          activeTactic: data.activeTactic || data.nextTelemetry?.activeTactic || "Manipulasi Taktis Siber",
          scammerMood: data.scammerMood || data.nextTelemetry?.scammerMood || "DEFLECTING",
          internalThought: data.internalThought || data.nextTelemetry?.internalThought || "Target memberikan respons yang patut diwaspadai.",
          vulnerabilityDelta: typeof data.vulnerabilityDelta === "number" ? data.vulnerabilityDelta : 0,
          source: data.source || "gemini-ai"
        };
      } else {
        throw new Error("API offline");
      }
    } catch {
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

      const newVuln = Math.min(100, Math.max(0, vulnerability + responseData.vulnerabilityDelta));
      setVulnerability(newVuln);

      setTelemetry({
        activeTactic: responseData.activeTactic,
        scammerMood: responseData.scammerMood,
        internalThought: responseData.internalThought
      });
      setHasNewTelemetry(true);

      const decisionType =
        responseData.vulnerabilityDelta > 5
          ? "VULNERABLE"
          : responseData.vulnerabilityDelta < -5
          ? "CRITICAL"
          : "NEUTRAL";

      setUserDecisions((prev) => [
        ...prev,
        {
          turn: prev.length + 1,
          userText,
          type: decisionType,
          delta: responseData.vulnerabilityDelta,
          tactic: responseData.activeTactic
        }
      ]);

      const nextIdx = currentStepIndex + 1;
      if (nextIdx >= scenario.steps.length || newVuln >= 95 || newVuln <= 10) {
        setIsFinished(true);
      } else {
        setCurrentStepIndex(nextIdx);
      }
    }, 750);
  };

  // Send message to Forensic AI Assistant ("Layaknya Kita Ini")
  const handleSendAssistantChat = async (promptText?: string) => {
    const text = (promptText || assistantInput).trim();
    if (!text || isAssistantTyping) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: AssistantMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text,
      time: userTime,
    };

    setAssistantHistory((prev) => [...prev, userMsg]);
    setAssistantInput("");
    setIsAssistantTyping(true);

    try {
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "assistant",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setAssistantHistory((prev) => [
          ...prev,
          {
            id: "a-" + Date.now(),
            sender: "assistant",
            text: data.assistantResponse || "Analisis forensik telah selesai dilakukan.",
            time: assistantTime,
            source: data.source || "gemini-ai",
            vectors: data.detectedVectors || ["Analisis Forensik"],
            recommendedAction: data.recommendedAction,
          },
        ]);
      } else {
        throw new Error("Offline");
      }
    } catch {
      setAssistantHistory((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "assistant",
          text: "Sebagai panduan forensik darurat: jangan pernah mengklik berkas .apk asing atau tautan mencurigakan. Segera aktifkan Mode Pesawat (Air-Gap) jika telanjur terpasang.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          source: "offline-guard",
        },
      ]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  // Switch to Assistant and consult about current scammer message
  const handleConsultAboutCurrentScam = () => {
    const lastScammerMsg = [...chatHistory].reverse().find((m) => m.sender === "scammer");
    const consultText = lastScammerMsg
      ? `Tolong bedah pesan penipu dari skenario ${scenario.title} ini: "${lastScammerMsg.text}". Apa taktik manipulasinya dan bagaimana cara membalasnya dengan aman?`
      : `Tolong jelaskan bagaimana modus penipuan ${scenario.title} bekerja dan bagaimana cara melindungi diri.`;

    setSubMode("assistant");
    handleSendAssistantChat(consultText);
  };

  const handleCopyDraft = () => {
    const draft = `LAPORAN FORENSIK DIGITAL — TRASP WORKBENCH
Skenario Kasus: ${scenario.title} (${scenario.category})
Pelaku Teridentifikasi: ${scenario.scammerName} (${scenario.scammerNumber})
Tingkat Kerentanan Korban: ${vulnerability}%
Modus Operandi: Eksploitasi rekayasa sosial dan izin Android
Rujukan Hukum: Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE No. 1/2024
Portal Laporan: iasc.ojk.go.id / patrolisiber.id`;

    navigator.clipboard.writeText(draft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const currentChoices = scenario.steps[currentStepIndex]?.userChoices || [];

  return (
    <div className="space-y-4">
      {/* UNIFIED NAVIGATION BAR: SWITCH BETWEEN SIMULATOR & ASISTEN FORENSIK AI */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-muted/40 border-2 border-border p-2">
        {/* Segmented Control */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-background p-1 border border-border">
          <button
            type="button"
            onClick={() => setSubMode("simulator")}
            className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subMode === "simulator"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Simulasi Penipu (WhatsApp Roleplay)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode("assistant")}
            className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subMode === "assistant"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Konsultasi Asisten Forensik AI (Live)</span>
          </button>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          {subMode === "simulator" ? (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground hidden md:inline">Skenario:</span>
              <select
                value={selectedScenarioKey}
                onChange={(e) => resetSimulation(e.target.value)}
                className="text-xs bg-background border border-border px-2 py-1 font-medium text-foreground cursor-pointer focus:outline-none"
              >
                <option value="apk-kurir">1. Resi Kurir &amp; Undangan .APK</option>
                <option value="loker-bumn">2. Loker Freelance BUMN</option>
                <option value="phishing-pajak">3. Tagihan Pajak DJP</option>
                <option value="m-banking-palsu">4. Salah Transfer &amp; Struk Editan</option>
              </select>
            </div>
          ) : (
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
              Gemini 3.6 Flash Active
            </Badge>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
              title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </Button>

            {subMode === "simulator" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => resetSimulation(selectedScenarioKey)}
                className="text-xs h-7 px-2 cursor-pointer font-mono"
                title="Reset Simulasi"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssistantHistory([DEFAULT_ASSISTANT_GREETING])}
                className="text-xs h-7 px-2 cursor-pointer font-mono"
                title="Bersihkan Percakapan Asisten"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Bersihkan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: SIMULASI PENIPU (WHATSAPP ROLEPLAY & TELEMETRY X-RAY) */}
      {/* ============================================================= */}
      {subMode === "simulator" && (
        <div className="space-y-4 animate-in fade-in duration-200">
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

          {/* Split-Screen Arena */}
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

                <div className="flex items-center gap-2">
                  {/* Quick AI Consultant Bridge */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConsultAboutCurrentScam}
                    className="text-[11px] h-7 px-2 border-emerald-500/40 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 font-mono"
                    title="Minta Pendapat Asisten Forensik AI tentang pesan ini"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    Tanya Asisten AI
                  </Button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950/80"
              >
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                          : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80"
                      }`}
                    >
                      {/* Scammer Attachment Card */}
                      {msg.attachment && (
                        <div
                          onClick={() => setSelectedAttachmentModal(msg.attachment?.name || "")}
                          className="mb-2 p-2.5 bg-slate-900/90 border border-rose-500/40 rounded flex items-center gap-2.5 cursor-pointer hover:border-rose-400 transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                            {msg.attachment.type === "apk" ? (
                              <FileCode className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-mono font-bold text-slate-100 text-[11px] truncate">
                              {msg.attachment.name}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>{msg.attachment.size}</span>
                              <span className="text-rose-400 font-bold uppercase">
                                {msg.attachment.meta}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div
                        className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                          msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        <span>{msg.time}</span>
                        {msg.sender === "user" && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}

                {isScammerTyping && (
                  <div className="flex items-start">
                    <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-lg rounded-tl-none px-3 py-2 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[10px] text-slate-400 ml-1 italic font-mono">
                        Penipu sedang menyusun taktik...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input & Defense Options */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
                {!isFinished ? (
                  <>
                    {/* Preset Tactical Options */}
                    {currentChoices.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                          <span>PILIHAN RESPONS CEPAT:</span>
                          <span className="text-emerald-400 font-semibold">Taktik Balasan</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {currentChoices.map((choice: DialogueChoice, i: number) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendSimulatorChat(choice.text, choice)}
                              disabled={isScammerTyping}
                              className="text-left text-[11px] p-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <div className="font-semibold text-slate-100 flex items-center gap-1">
                                {choice.type === "CRITICAL" ? (
                                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                                ) : choice.type === "VULNERABLE" ? (
                                  <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                                ) : (
                                  <Activity className="w-3 h-3 text-amber-400 shrink-0" />
                                )}
                                <span>{choice.text}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Free Custom Chat Input */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendSimulatorChat();
                      }}
                      className="flex items-center gap-1.5 pt-1"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Ketik balasan bebas Anda ke penipu (direspons oleh AI)..."
                        disabled={isScammerTyping}
                        className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 text-slate-100 px-3 py-2 text-xs rounded outline-none placeholder:text-slate-500"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!customInput.trim() || isScammerTyping}
                        className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded text-center space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Simulasi Selesai!
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Anda berhasil menguji ketahanan psikologis menghadapi skenario ini.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetSimulation(selectedScenarioKey)}
                        className="text-xs h-7"
                      >
                        Uji Skenario Lain
                      </Button>
                      {onSwitchToAct && (
                        <Button
                          size="sm"
                          onClick={() => onSwitchToAct(selectedScenarioKey)}
                          className="text-xs h-7 bg-primary text-primary-foreground"
                        >
                          Lanjut ke Mitigasi Darurat
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Screen: Scammer Telemetry X-Ray (6 Cols) */}
            <div
              className={`lg:col-span-6 flex flex-col h-[560px] sm:h-[620px] bg-card border border-border p-4 overflow-y-auto space-y-4 ${
                mobileTab === "telemetry" ? "flex" : "hidden lg:flex"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">
                    LIVE SCAMMER TELEMETRY X-RAY
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {lastSource.includes("gemini") ? "Gemini AI Studio" : "Forensik Lokal"}
                </Badge>
              </div>

              {/* Scammer Mind Monologue */}
              <div className="p-3 bg-slate-950 border border-slate-800 text-xs rounded space-y-1">
                <span className="font-mono text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-rose-400" /> Monolog Batin Pelaku:
                </span>
                <p className="text-slate-200 italic font-mono text-[11px] leading-relaxed">
                  &ldquo;{telemetry.internalThought}&rdquo;
                </p>
              </div>

              {/* Tactic & Scammer Mood */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-muted/40 border border-border rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Taktik Psikologis Aktif:
                  </span>
                  <span className="font-semibold text-foreground text-xs block">
                    {telemetry.activeTactic}
                  </span>
                </div>

                <div className="p-2.5 bg-muted/40 border border-border rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Kondisi Mental Pelaku:
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono font-bold ${
                      telemetry.scammerMood === "PANICKED" || telemetry.scammerMood === "BUSTED"
                        ? "text-emerald-500 border-emerald-500/40 bg-emerald-500/10"
                        : telemetry.scammerMood === "CONFIDENT" || telemetry.scammerMood === "PUSHING"
                        ? "text-rose-500 border-rose-500/40 bg-rose-500/10"
                        : "text-amber-500 border-amber-500/40 bg-amber-500/10"
                    }`}
                  >
                    {telemetry.scammerMood}
                  </Badge>
                </div>
              </div>

              {/* Vulnerability Meter */}
              <div className="p-3 bg-muted/20 border border-border rounded space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground uppercase">Tingkat Kerentanan Korban:</span>
                  <span
                    className={`font-bold ${
                      vulnerability >= 70
                        ? "text-rose-600 dark:text-rose-400"
                        : vulnerability >= 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {vulnerability}%
                  </span>
                </div>
                <Progress value={vulnerability} className="h-2" />
                <p className="text-[10px] text-muted-foreground">
                  {vulnerability >= 70
                    ? "🔴 Bahaya Tinggi: Respons Anda menunjukkan tanda-tanda menuruti manipulasi penipu."
                    : vulnerability >= 40
                    ? "🟡 Waspada: Anda mulai tertekan namun masih memiliki keraguan yang sehat."
                    : "🟢 Aman: Anda kritis, menolak instruksi berbahaya, dan mengamankan data pribadi."}
                </p>
              </div>

              {/* Decisions History Log */}
              {userDecisions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">
                    Jejak Keputusan Kritis Anda:
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {userDecisions.map((d, i) => (
                      <div
                        key={i}
                        className="text-[11px] p-2 bg-muted/30 border border-border rounded flex items-center justify-between"
                      >
                        <span className="truncate max-w-[200px] text-foreground">
                          {d.userText}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            d.delta > 0 ? "text-rose-500" : "text-emerald-500"
                          }`}
                        >
                          {d.delta > 0 ? `+${d.delta}%` : `${d.delta}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: KONSULTASI ASISTEN FORENSIK AI ("LAYAKNYA KITA INI") */}
      {/* ============================================================= */}
      {subMode === "assistant" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch animate-in fade-in duration-200">
          {/* Left Screen: Live Interactive Assistant Terminal (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-[560px] sm:h-[620px] bg-card border border-border overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-muted/70 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wide text-foreground flex items-center gap-1.5">
                    TRASP AI FORENSIC COPILOT
                    <Badge variant="outline" className="text-[9px] py-0 px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono">
                      LIVE AI
                    </Badge>
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Didukung Google AI Studio (Gemini 3.6 Flash) &amp; Basis Regulasi Siber RI
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAssistantHistory([DEFAULT_ASSISTANT_GREETING])}
                className="text-xs h-7 text-muted-foreground hover:text-foreground"
                title="Reset Percakapan"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Bersihkan
              </Button>
            </div>

            {/* Messages Area */}
            <div
              ref={assistantScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-background/50"
            >
              {assistantHistory.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "assistant" && (
                    <div className="w-6 h-6 rounded bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-0.5 border border-primary/20">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 space-y-2 leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-muted/60 border border-border text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-line prose prose-xs dark:prose-invert">
                      {m.text}
                    </div>

                    {m.recommendedAction && (
                      <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-start gap-1.5">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{m.recommendedAction}</span>
                      </div>
                    )}

                    {m.vectors && m.vectors.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
                        {m.vectors.map((v, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 bg-background/80 rounded border border-border/60 text-muted-foreground font-mono"
                          >
                            #{v}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[9px] text-muted-foreground/80 font-mono pt-0.5">
                      <span>{m.source ? `via ${m.source}` : ""}</span>
                      <span>{m.time}</span>
                    </div>
                  </div>

                  {m.sender === "user" && (
                    <div className="w-6 h-6 rounded bg-muted flex-shrink-0 flex items-center justify-center text-foreground mt-0.5 border border-border">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isAssistantTyping && (
                <div className="flex gap-2.5 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded border border-border">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>Gemini 3.6 Flash sedang mempelajari pertanyaan Anda...</span>
                </div>
              )}
            </div>

            {/* Quick Suggested Prompts */}
            <div className="p-2 bg-muted/30 border-t border-border flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span className="text-muted-foreground font-mono uppercase text-[9px] flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500" /> Contoh Pertanyaan:
              </span>
              {SUGGESTED_ASSISTANT_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAssistantChat(prompt)}
                  disabled={isAssistantTyping}
                  className="whitespace-nowrap px-2 py-1 bg-background border border-border hover:border-primary rounded text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                >
                  {prompt.length > 32 ? prompt.slice(0, 32) + "..." : prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-2.5 bg-muted/60 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAssistantChat();
                }}
                className="flex gap-1.5 items-end"
              >
                <Textarea
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAssistantChat();
                    }
                  }}
                  placeholder="Ketik pertanyaan konsultasi atau tempel pesan penipuan di sini..."
                  className="text-xs resize-none min-h-[44px] max-h-[88px] bg-background border-border"
                  rows={1}
                  disabled={isAssistantTyping}
                />
                <Button
                  type="submit"
                  size="sm"
                  aria-label="Kirim Pesan"
                  disabled={!assistantInput.trim() || isAssistantTyping}
                  className="h-[44px] px-3 font-semibold uppercase text-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right Screen: Forensic Knowledge & Legal Desk (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-[560px] sm:h-[620px] bg-card border border-border p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">
                  PANEL INTELIJEN &amp; RUJUKAN FORENSIK
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-500 border-emerald-500/30">
                Terverifikasi Otoritas
              </Badge>
            </div>

            {/* Golden Time 15-Minute Protocol */}
            <div className="p-3 bg-muted/40 border border-border rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-rose-500 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Protokol Darurat (Golden Time):
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">15-30 Menit Pertama</span>
              </div>
              <ul className="text-[11px] space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-foreground">1.</span>
                  <span><strong>Air-Gap Seketika:</strong> Aktifkan Mode Pesawat &amp; cabut kartu SIM jika telanjur klik file .apk.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-foreground">2.</span>
                  <span><strong>Cabut Aksesibilitas:</strong> Buka Pengaturan HP &gt; Aksesibilitas &gt; Matikan izin aplikasi asing.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-foreground">3.</span>
                  <span><strong>Blokir Rekening:</strong> Hubungi call center bank resmi &amp; buat aduan di <strong>iasc.ojk.go.id</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Legal Basis: UU ITE & KUHP */}
            <div className="p-3 bg-muted/40 border border-border rounded space-y-1.5 text-xs">
              <div className="font-mono text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Dasar Hukum &amp; Jerat Pidana:
              </div>
              <div className="p-2 bg-background border border-border rounded space-y-1">
                <strong className="text-foreground text-[11px] block">
                  Pasal 28 (1) jo. Pasal 45A (1) UU ITE No. 1/2024
                </strong>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam transaksi elektronik. Ancaman pidana <strong>penjara maksimal 6 tahun</strong> dan/atau <strong>denda Rp1 Miliar</strong> (*Lex Specialis*).
                </p>
              </div>
            </div>

            {/* Official Portals Quick Links */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase block font-semibold">
                Kanal Aduan Resmi Terhubung:
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                <a
                  href="https://iasc.ojk.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background border border-border hover:border-primary rounded flex items-center justify-between text-[11px] transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    IASC OJK (Indonesia Anti-Scam Centre)
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>

                <a
                  href="https://patrolisiber.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-background border border-border hover:border-primary rounded flex items-center justify-between text-[11px] transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Patroli Siber Polri (STTLP Digital)
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              </div>
            </div>

            {/* Copy Report Draft Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyDraft}
                className="w-full text-xs h-8 border-border hover:border-primary font-mono cursor-pointer"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                    Draf Laporan Disalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Salin Format Draf Laporan Siap Kirim
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
