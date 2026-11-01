"use client";

import { useState, useRef, useEffect } from "react";
import {
  Shield,
  Clock,
  PhoneCall,
  FileText,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Bot,
  Send,
  X,
  MessageSquare,
  AlertTriangle,
  Scale,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Building2,
  Briefcase,
  QrCode,
  Mic,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  COMPENDIUM_CASES,
  ScamCaseItem,
} from "@/lib/trasp/compendium-data";
import {
  OFFICIAL_HOTLINES,
  generateIncidentReport,
} from "@/lib/trasp/containment-data";

interface ActContainmentProps {
  initialScenarioId?: string;
}

interface FloatingChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

function renderCleanMessage(text: string) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    const cleanSeg = seg.replace(/\*/g, "");
    return <span key={i}>{cleanSeg}</span>;
  });
}

const CASE_META: Record<string, { icon: any; tags: string[] }> = {
  "apk-sniffer": {
    icon: Smartphone,
    tags: ["Izin Aksesibilitas", "Sadap OTP SMS", "Trojan Dropper"],
  },
  "authority-impersonation": {
    icon: Building2,
    tags: ["Domain Palsu .xyz", "Catut DJP / BSSN", "Phishing Kredensial"],
  },
  "task-scam": {
    icon: Briefcase,
    tags: ["Deposit Bertingkat", "Grup Telegram", "Tugas Like Video"],
  },
  "sms-phishing": {
    icon: MessageSquare,
    tags: ["SMS Masking", "Kenaikan Tarif Bank", "Pencurian Akun"],
  },
  "quishing-otp": {
    icon: QrCode,
    tags: ["QRIS Palsu", "Dynamic Swap", "Begal Sesi OTP"],
  },
  "deepfake-vishing": {
    icon: Mic,
    tags: ["Voice Cloning AI", "Video Deepfake", "Impersonasi Pimpinan"],
  },
};

export function ActContainment({ initialScenarioId = "apk-kurir" }: ActContainmentProps) {
  // Map scenario id to compendium id
  const initialCompendiumId =
    initialScenarioId === "loker-bumn"
      ? "task-scam"
      : initialScenarioId === "phishing-pajak"
      ? "authority-impersonation"
      : initialScenarioId === "m-banking-palsu"
      ? "authority-impersonation"
      : "apk-sniffer";

  // Navigation View: "catalog" (tampilan awal katalog) | "detail" (halaman khusus mitigasi & info kasus)
  const [currentView, setCurrentView] = useState<"catalog" | "detail">("catalog");
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCompendiumId);
  const activeCase: ScamCaseItem =
    COMPENDIUM_CASES.find((c) => c.id === selectedCaseId) || COMPENDIUM_CASES[0];

  // Segment Tab dalam View Detail: "mitigasi" | "pencegahan" | "laporan" | "regulasi"
  const [activeSegment, setActiveSegment] = useState<"mitigasi" | "pencegahan" | "laporan" | "regulasi">("mitigasi");

  // Step Checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Report Form state
  const [reportData, setReportData] = useState({
    victimName: "",
    incidentType: activeCase.shortName,
    platform: "WhatsApp",
    scammerContact: "+62 812-9988-7711",
    scammerBankDetails: "BCA 8820-192-331",
    lossAmount: "Rp0",
    chronology: `Terjadi upaya penipuan dengan modus ${activeCase.title}. Pelaku mengirimkan pesan mencurigakan untuk memancing tindakan korban.`,
  });

  useEffect(() => {
    setReportData((prev) => ({
      ...prev,
      incidentType: activeCase.shortName,
      chronology: `Terjadi upaya penipuan dengan modus ${activeCase.title}. Pelaku mengirimkan pesan mencurigakan untuk memancing tindakan korban.`,
    }));
    setCompletedSteps({});
  }, [activeCase]);

  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedVaccine, setCopiedVaccine] = useState(false);

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<FloatingChatMessage[]>([
    {
      id: "f-init",
      sender: "bot",
      text: `Halo! Saya Ras. Silakan tanyakan apa saja seputar langkah darurat, cara blokir rekening kilat, nomor kontak bank, atau pasal hukum penipuan.`,
      time: "Baru saja",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Restore dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedView = localStorage.getItem("trasp_act_view") as "catalog" | "detail" | null;
        if (savedView === "catalog" || savedView === "detail") {
          setCurrentView(savedView);
        }
        const savedCase = localStorage.getItem("trasp_act_case");
        if (savedCase) setSelectedCaseId(savedCase);

        const savedChat = localStorage.getItem("trasp_act_chat");
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleOpenDetail = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView("detail");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_act_case", caseId);
        localStorage.setItem("trasp_act_view", "detail");
      } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    setCurrentView("catalog");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_act_view", "catalog");
      } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isBotTyping]);

  const toggleStep = (stepText: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepText]: !prev[stepText],
    }));
  };

  const handleCopyReport = () => {
    const formatted = generateIncidentReport(reportData);
    navigator.clipboard.writeText(formatted);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const vaccineText = `*WASPADA PENIPUAN SIBER*\n\nWaspadai modus ${activeCase.title}.\n\n*ATURAN PENCEGAHAN:*\n1. Jangan pernah membuka berkas .APK atau mengklik link asing di WhatsApp.\n2. Pihak bank/instansi resmi TIDAK PERNAH meminta kode OTP, PIN, atau transfer deposit talangan.\n3. Laporkan nomor rekening penipu ke iasc.ojk.go.id atau call center 157.\n\n_Edukasi Keamanan Digital TRASP_`;

  const handleCopyVaccine = () => {
    navigator.clipboard.writeText(vaccineText);
    setCopiedVaccine(true);
    setTimeout(() => setCopiedVaccine(false), 2000);
  };

  const handleSendFloatingChat = async (presetPrompt?: string) => {
    const text = (presetPrompt || chatInput).trim();
    if (!text || isBotTyping) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: FloatingChatMessage = { id: "u-" + Date.now(), sender: "user", text, time: userTime };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_act_chat", JSON.stringify(nextMessages));
      } catch {}
    }

    setChatInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "assistant",
          contextEvidence: `Kasus Aktif: ${activeCase.title}\nKategori: ${activeCase.category}\nLangkah Darurat: ${activeCase.emergencyActionSteps.join(", ")}\nDasar Hukum: ${activeCase.legalClauses}`,
          chatHistory: nextMessages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const botMsg: FloatingChatMessage = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: data.assistantResponse || "Panduan mitigasi telah diverifikasi.",
          time: botTime,
        };
        const updated = [...nextMessages, botMsg];
        setChatMessages(updated);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("trasp_act_chat", JSON.stringify(updated));
          } catch {}
        }
      } else {
        throw new Error("Chat error");
      }
    } catch {
      const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const fallbackMsg: FloatingChatMessage = {
        id: "b-err-" + Date.now(),
        sender: "bot",
        text: "Panduan Cepat: Segera aktifkan Mode Pesawat jika telanjur klik berkas, hubungi call center bank untuk memblokir saldo, dan laporkan rekening ke portal iasc.ojk.go.id.",
        time: botTime,
      };
      const updated = [...nextMessages, fallbackMsg];
      setChatMessages(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("trasp_act_chat", JSON.stringify(updated));
        } catch {}
      }
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* ========================================================= */}
      {/* VIEW 1: KATALOG MODUS & KASUS KEJAHATAN SIBER            */}
      {/* ========================================================= */}
      {currentView === "catalog" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Katalog */}
          <div className="border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  <FolderOpen className="w-3 h-3" />
                  KATALOG FORENSIK RESMI
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  6 Modus Kasus Nyata Indonesia
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-foreground mt-1">
                Katalog Kasus &amp; Modus Kejahatan Siber
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl mt-0.5 leading-relaxed">
                Pilih salah satu modus untuk membuka panduan mitigasi darurat 15 menit pertama, strategi pencegahan, generator laporan resmi (IASC OJK &amp; Polri), serta regulasi hukum terkait.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setIsChatOpen(true)}
              className="text-xs h-9 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground cursor-pointer shrink-0 font-medium"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              Tanya Ras
            </Button>
          </div>

          {/* Grid Katalog Kasus (6 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {COMPENDIUM_CASES.map((item) => {
              const meta = CASE_META[item.id] || {
                icon: Shield,
                tags: ["Forensik Siber", "Deteksi AI", "UU ITE"],
              };
              const IconComp = meta.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item.id)}
                  className="group relative border border-border bg-card hover:border-primary/60 transition-all p-4 rounded flex flex-col justify-between cursor-pointer hover:shadow-xs space-y-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Index & Danger Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        KASUS #{String(item.number).padStart(2, "0")}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          item.riskLevel === "CRITICAL"
                            ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                            : "border-amber-500/40 text-amber-500 bg-amber-500/10"
                        }`}
                      >
                        {item.riskLevel} • {item.dangerScore}/100
                      </Badge>
                    </div>

                    {/* Icon + Category */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground line-clamp-1">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Modus Operandi */}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.modusOperandi}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {meta.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Button Action */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="w-full py-1.5 px-3 rounded text-xs font-mono font-bold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20 transition-all flex items-center justify-between">
                      <span>Buka Mitigasi &amp; Informasi</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: DETAIL KHUSUS MITIGASI & INFORMASI KASUS           */}
      {/* ========================================================= */}
      {currentView === "detail" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Top Navigation & Breadcrumb */}
          <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 border border-border rounded">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToCatalog}
              className="text-xs h-8 cursor-pointer font-mono font-medium gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Katalog
            </Button>

            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              Detail Kasus #{String(activeCase.number).padStart(2, "0")} • {activeCase.shortName}
            </span>

            <Button
              size="sm"
              onClick={() => setIsChatOpen(true)}
              className="text-xs h-8 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground cursor-pointer font-medium"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              Tanya Ras
            </Button>
          </div>

          {/* Main Detail Container */}
          <Card className="border-border shadow-xs">
            {/* Header Banner */}
            <div className="p-3.5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono ${
                    activeCase.riskLevel === "CRITICAL"
                      ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                      : "border-amber-500/40 text-amber-500 bg-amber-500/10"
                  }`}
                >
                  BAHAYA: {activeCase.riskLevel} ({activeCase.dangerScore}/100)
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activeCase.category}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-foreground mt-1.5">
                {activeCase.title}
              </h3>
            </div>

            {/* 4 Clean Segmented Navigation Tabs */}
            <div className="border-b border-border bg-muted/40 grid grid-cols-2 sm:grid-cols-4 p-1 gap-1">
              <button
                onClick={() => setActiveSegment("mitigasi")}
                className={`py-1.5 px-2 text-xs font-medium font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSegment === "mitigasi"
                    ? "bg-background text-foreground font-bold border border-border shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>1. Mitigasi 15 Menit</span>
              </button>

              <button
                onClick={() => setActiveSegment("pencegahan")}
                className={`py-1.5 px-2 text-xs font-medium font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSegment === "pencegahan"
                    ? "bg-background text-foreground font-bold border border-border shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>2. Pencegahan</span>
              </button>

              <button
                onClick={() => setActiveSegment("laporan")}
                className={`py-1.5 px-2 text-xs font-medium font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSegment === "laporan"
                    ? "bg-background text-foreground font-bold border border-border shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>3. Penanganan &amp; Laporan</span>
              </button>

              <button
                onClick={() => setActiveSegment("regulasi")}
                className={`py-1.5 px-2 text-xs font-medium font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSegment === "regulasi"
                    ? "bg-background text-foreground font-bold border border-border shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>4. Regulasi &amp; Hukum</span>
              </button>
            </div>

            {/* Tab Contents */}
            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* ========================================= */}
              {/* SEGMENT 1: MITIGASI 15 MENIT (GOLDEN TIME)*/}
              {/* ========================================= */}
              {activeSegment === "mitigasi" && (
                <div className="space-y-4">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-rose-500 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-rose-500" />
                      Protokol Darurat Golden Time (15-30 Menit Pertama)
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {Object.values(completedSteps).filter(Boolean).length} dari {activeCase.emergencyActionSteps.length} Selesai
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeCase.emergencyActionSteps.map((stepText, idx) => {
                      const isChecked = !!completedSteps[stepText];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(stepText)}
                          className={`p-3 rounded border transition-all cursor-pointer flex items-center gap-3 ${
                            isChecked
                              ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                              : "bg-card border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <div className="shrink-0">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-border bg-background"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-primary text-[11px] px-1.5 py-0.2 bg-muted rounded">
                              Langkah {idx + 1}
                            </span>
                            <span className={`font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {stepText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Call Center Hotlines Bar */}
                  <div className="pt-2 border-t border-border space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground font-mono">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                      Panggilan Cepat Call Center Resmi:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {OFFICIAL_HOTLINES.slice(0, 4).map((h, i) => (
                        <a
                          key={i}
                          href={`tel:${h.number}`}
                          className="p-2 border border-border bg-background hover:bg-muted/40 transition-colors rounded flex flex-col justify-between"
                        >
                          <span className="text-[11px] font-bold text-foreground">{h.name}</span>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{h.number}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* SEGMENT 2: PENCEGAHAN (PREVENTIVE)       */}
              {/* ========================================= */}
              {activeSegment === "pencegahan" && (
                <div className="space-y-4 text-xs">
                  {/* Modus Operandi */}
                  <div className="p-3.5 bg-muted/30 border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-1.5 text-xs font-mono uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Modus Operandi &amp; Pola Serangan:
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-5">
                      {activeCase.modusOperandi}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-5 pt-1">
                      {activeCase.characteristics.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bias Psikologis */}
                  <div className="p-3.5 bg-muted/30 border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-1.5 text-xs font-mono uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Celah Bias Psikologis yang Diserang:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                      {activeCase.psychologicalBiases.map((b, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="font-semibold text-foreground text-[11px]">• {b.biasName}:</span>
                          <p className="text-[11px] text-muted-foreground">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* SEGMENT 3: PENANGANAN & LAPORAN RESMI    */}
              {/* ========================================= */}
              {activeSegment === "laporan" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Report Generator Form (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="text-xs font-bold font-mono uppercase text-foreground flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Formulir Draf Laporan Resmi (Siap Kirim ke Bank &amp; OJK)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Kategori Insiden:</label>
                        <Input
                          className="h-8 text-xs font-medium"
                          value={reportData.incidentType}
                          onChange={(e) => setReportData({ ...reportData, incidentType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">Kontak Pelaku:</label>
                        <Input
                          className="h-8 text-xs font-mono"
                          value={reportData.scammerContact}
                          onChange={(e) => setReportData({ ...reportData, scammerContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Rekening Penampung Penipu:</label>
                      <Input
                        className="h-8 text-xs font-mono"
                        value={reportData.scammerBankDetails}
                        onChange={(e) => setReportData({ ...reportData, scammerBankDetails: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted-foreground">Kronologi Singkat:</label>
                      <Textarea
                        rows={3}
                        className="text-xs font-mono resize-none leading-relaxed"
                        value={reportData.chronology}
                        onChange={(e) => setReportData({ ...reportData, chronology: e.target.value })}
                      />
                    </div>

                    <Button
                      onClick={handleCopyReport}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 cursor-pointer shadow-xs"
                    >
                      {copiedReport ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          Tersalin ke Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Salin Draf Laporan
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Vaccine Chat Broadcast (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="text-xs font-bold font-mono uppercase text-foreground flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                      Draf Peringatan Edukasi Grup
                    </div>

                    <div className="p-2.5 bg-background border border-border rounded text-[11px] font-mono leading-relaxed whitespace-pre-line text-foreground/90 max-h-48 overflow-y-auto">
                      {vaccineText}
                    </div>

                    <Button
                      onClick={handleCopyVaccine}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 cursor-pointer"
                    >
                      {copiedVaccine ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Salin Teks Edukasi
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================= */}
              {/* SEGMENT 4: REGULASI & JERAT HUKUM       */}
              {/* ========================================= */}
              {activeSegment === "regulasi" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-muted/30 border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-1.5 text-xs font-mono uppercase">
                      <Scale className="w-3.5 h-3.5 text-amber-500" />
                      Dasar Hukum &amp; Jerat Pidana:
                    </div>
                    <div className="p-2.5 bg-background border border-border rounded space-y-1">
                      <span className="font-semibold text-foreground text-xs block">
                        {activeCase.legalClauses}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Sumber Regulasi: {activeCase.officialSourceCitation}
                      </p>
                    </div>
                  </div>

                  {/* Official Portals */}
                  <div className="space-y-2">
                    <div className="font-mono text-[11px] font-bold text-foreground uppercase">
                      Kanal Pengaduan Resmi:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href="https://iasc.ojk.go.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-background border border-border hover:border-primary rounded flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-foreground">IASC OJK (Indonesia Anti-Scam Centre)</div>
                          <div className="text-[10px] text-muted-foreground font-mono">iasc.ojk.go.id / Kontak 157</div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                      </a>

                      <a
                        href="https://patrolisiber.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-background border border-border hover:border-primary rounded flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-xs text-foreground">Patroli Siber Polri</div>
                          <div className="text-[10px] text-muted-foreground font-mono">patrolisiber.id (STTLP Digital)</div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* FLOATING CHATBOT WIDGET (POJOK KANAN BAWAH)                */}
      {/* ========================================================= */}
      {!isChatOpen ? (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 bg-primary text-primary-foreground border border-border rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer font-medium text-xs font-mono"
        >
          <Bot className="w-4 h-4 animate-bounce" />
          <span>Tanya Ras</span>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[460px] bg-card border-2 border-border shadow-2xl flex flex-col overflow-hidden text-xs animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="font-bold font-mono text-xs">Ras</span>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-primary-foreground/20 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-background/50">
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex gap-1.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded p-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted border border-border text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {renderCleanMessage(m.text)}
                  </div>
                  <div className="text-[9px] text-muted-foreground/80 font-mono text-right mt-1">
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex items-center gap-1.5 text-muted-foreground italic text-[11px] p-2 bg-muted/30 border border-border rounded">
                <Zap className="w-3 h-3 text-primary animate-spin" />
                <span>Mencari rujukan mitigasi...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 bg-muted/80 border-t border-border shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendFloatingChat();
              }}
              className="flex items-center gap-1.5"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanyakan ke Ras..."
                disabled={isBotTyping}
                className="text-xs h-8 bg-background border-border"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!chatInput.trim() || isBotTyping}
                className="h-8 px-2.5 bg-primary text-primary-foreground cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
