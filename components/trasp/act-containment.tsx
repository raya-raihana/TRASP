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
    tags: ["APK Sniffer", "Sadap OTP SMS"],
  },
  "authority-impersonation": {
    icon: Building2,
    tags: ["Domain Palsu", "Phishing DJP"],
  },
  "task-scam": {
    icon: Briefcase,
    tags: ["Deposit Bertingkat", "Loker Palsu"],
  },
  "sms-blast-phishing": {
    icon: MessageSquare,
    tags: ["SMS Masking", "Phishing Bank"],
  },
  "sms-phishing": {
    icon: MessageSquare,
    tags: ["SMS Masking", "Phishing Bank"],
  },
  "account-takeover-quishing": {
    icon: QrCode,
    tags: ["QRIS Palsu", "Begal OTP"],
  },
  "quishing-otp": {
    icon: QrCode,
    tags: ["QRIS Palsu", "Begal OTP"],
  },
  "deepfake-vishing": {
    icon: Mic,
    tags: ["Voice Cloning", "Deepfake AI"],
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

  // Mode Tampilan: Dokumen Naratif Utuh (Single-Scroll View)

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

          {/* Grid Katalog Kasus (6 Cards) - Clean & Scannable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMPENDIUM_CASES.map((item) => {
              const meta = CASE_META[item.id] || {
                icon: Shield,
                tags: ["Forensik Siber", "UU ITE"],
              };
              const IconComp = meta.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item.id)}
                  className="group relative border border-border bg-card hover:border-primary/60 transition-all duration-200 p-5 rounded-lg flex flex-col justify-between cursor-pointer hover:shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Case Code (#01) & Severity Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                          #{String(item.number).padStart(2, "0")}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono px-2 py-0.5 ${
                          item.riskLevel === "CRITICAL"
                            ? "border-rose-500/30 text-rose-500 bg-rose-500/10"
                            : "border-amber-500/30 text-amber-500 bg-amber-500/10"
                        }`}
                      >
                        {item.riskLevel}
                      </Badge>
                    </div>

                    {/* Case Title (Max 1-2 lines, bold) */}
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Case Modus Description (Max 1 ringkas sentence / line-clamp-2) */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.modusOperandi}
                    </p>

                    {/* Tags: Max 1-2 tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {meta.tags.slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subtle Action Link */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="font-medium">Lihat Mitigasi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
        <article className="space-y-5 animate-in fade-in duration-200">
          {/* Top Navigation & Breadcrumb */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-muted/30 border border-border rounded">
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
              Laporan Investigasi Forensik #{String(activeCase.number).padStart(2, "0")} • {activeCase.shortName}
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

          {/* Continuous Investigative Document Sheet */}
          <div className="bg-card border border-border p-5 sm:p-8 space-y-8 rounded-lg shadow-xs">

            {/* ========================================================= */}
            {/* 1. HEADER DOKUMEN & METADATA                              */}
            {/* ========================================================= */}
            <header className="space-y-4 pb-6 border-b border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    LAPORAN INVESTIGASI FORENSIK #{String(activeCase.number).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {activeCase.category}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground leading-tight">
                  {activeCase.title}
                </h1>
              </div>

              {/* Baris Metadata Ringkas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 bg-muted/40 border border-border/60 rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Tingkat Risiko
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono px-2 py-0.5 font-bold ${
                        activeCase.riskLevel === "CRITICAL"
                          ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                          : "border-amber-500/40 text-amber-500 bg-amber-500/10"
                      }`}
                    >
                      {activeCase.riskLevel} ({activeCase.dangerScore}/100)
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-muted/40 border border-border/60 rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Vektor Serangan
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground line-clamp-1">
                    {activeCase.id === "apk-sniffer"
                      ? "Accessibility & SMS Dropper"
                      : activeCase.id === "authority-impersonation"
                      ? "Domain Spoofing & Phishing"
                      : activeCase.id === "task-scam"
                      ? "Multi-Tier Ponzi Deposit"
                      : activeCase.id === "sms-blast-phishing"
                      ? "SIM Card Box & SMS Masking"
                      : activeCase.id === "account-takeover-quishing"
                      ? "QR Tampering & Begal OTP"
                      : "Voice Cloning Generatif AI"}
                  </span>
                </div>

                <div className="p-3 bg-muted/40 border border-border/60 rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Respons Kritis
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ≤ 15 Menit Pertama
                  </span>
                </div>

                <div className="p-3 bg-muted/40 border border-border/60 rounded space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                    Rujukan Otoritatif
                  </span>
                  <span className="text-xs font-mono text-muted-foreground line-clamp-1" title={activeCase.officialSourceCitation}>
                    {activeCase.officialSourceCitation}
                  </span>
                </div>
              </div>
            </header>

            {/* ========================================================= */}
            {/* 2. BEDAH KASUS & ANATOMI MODUS OPERANDI (NARATIF)         */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-primary">BAGIAN I.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Bedah Kasus &amp; Anatomi Modus Operandi
                </h2>
              </div>

              {/* Narasi Esai Latar Belakang */}
              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-serif">
                <p>
                  Tindak kejahatan digital dengan modus <strong>{activeCase.shortName}</strong> merefleksikan pergeseran taktik sindikat siber dari serangan acak menuju penargetan presisi yang mengeksploitasi celah kognitif manusia (*human cognitive vulnerabilities*). Alih-alih meretas server perbankan dengan sistem pertahanan berlapis, penyerang memanfaatkan korban sebagai jembatan pembobol otorisasi melalui serangkaian manipulasi psikologis terstruktur.
                </p>

                <p>
                  {activeCase.modusOperandi} Serangan umumnya diawali melalui kanal perpesanan instan personal dengan membangun legitimasi palsu. Sindikat kerap menyamar sebagai representasi institusi formal atau entitas berwenang—mulai dari kurir pengantar paket logistik, panitia undangan pernikahan digital, notifikasi tilang elektronik ETLE Korlantas Polri, petugas Ditjen Pajak (Coretax), hingga pengelola tawaran kerja paruh waktu. Pelaku menyisipkan tenggat waktu semu yang sangat ketat (1 hingga 2 jam) guna menekan target agar segera mengambil tindakan tanpa sempat memverifikasi keabsahan pesan.
                </p>

                <p>
                  Secara teknis, {activeCase.technicalMechanism} Dalam skema berkas aplikasi, manipulasi ekstensi ganda diterapkan untuk mengaburkan muatan trojan di hadapan pengguna awam. Begitu izin sistem operasi yang diminta (seperti izin layanan aksesibilitas atau pembacaan SMS masuk) diberikan oleh korban, malware segera menjalankan fungsi mata-mata (*surveillance*): mencegat kode *One-Time Password* (OTP) m-Banking, menyadap notifikasi transaksi dua arah, dan mentransmisikan kredensial akun secara terenkripsi ke server *Command & Control* (C2) penipu.
                </p>
              </div>

              {/* Editorial Callout: Studi Kasus Riil di Indonesia */}
              <div className="p-4 bg-muted/30 border-l-3 border-l-primary rounded-r space-y-1.5 my-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Studi Kasus &amp; Bukti Empiris di Indonesia
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeCase.realCasesIndonesia} Kasus-kasus tersebut membuktikan bahwa kerentanan fatal kerap terjadi pada fase interaksi awal, di mana korban tidak menyadari bahwa berkas atau tautan yang diakses telah mengambil alih sesi otentikasi gawai.
                </p>
              </div>

              {/* Analisis Bias Psikologis & Anomali Serangan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-muted/20 border border-border/80 rounded space-y-2">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Celah Eksploitasi Psikologis Target
                  </span>
                  <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                    {activeCase.psychologicalBiases.map((b, i) => (
                      <div key={i}>
                        <strong className="text-foreground font-mono text-[11px]">• {b.biasName}:</strong> {b.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-muted/20 border border-border/80 rounded space-y-2">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    Indikator Teknis Anomali Serangan
                  </span>
                  <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside leading-relaxed">
                    {activeCase.characteristics.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* 3. PROSEDUR TANGGAP DARURAT & ESKALASI LAPORAN            */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-rose-500">BAGIAN II.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Prosedur Tanggap Darurat &amp; Eskalasi Laporan
                </h2>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-serif">
                <p>
                  Kecepatan eksekusi pada rentang waktu <strong>Golden Time (15 hingga 30 menit pertama)</strong> pasca-insiden merupakan penentu mutlak terselamatkannya saldo dan identitas perbankan korban. Sebelum penipu menyelesaikan proses *layering* dana ke rekening penampung (*mule accounts*), korban atau pendamping wajib menjalankan mitigasi teknis dan alur eskalasi pelaporan secara berkesinambungan.
                </p>

                {/* Panduan Runtut Langkah Mitigasi */}
                <div className="space-y-2.5 font-sans pt-1">
                  {activeCase.emergencyActionSteps.map((step, idx) => {
                    const isChecked = !!completedSteps[step];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(step)}
                        className={`p-3 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                            : "bg-muted/20 border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-border bg-background"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="text-xs leading-relaxed">
                          <strong className="text-foreground block font-mono text-[11px] mb-0.5">
                            {idx === 0
                              ? "Langkah 1: Isolasi Fisik & Pemutusan Koneksi (Air-Gap)"
                              : idx === 1
                              ? "Langkah 2: Pencabutan Hak Akses & Penonaktifan Layanan Ilegal"
                              : idx === 2
                              ? "Langkah 3: Eliminasi Malware & Pemulihan Sistem Operasi"
                              : "Langkah 4: Pergantian Kredensial & Remediasi Akun Keuangan"}
                          </strong>
                          <span className={isChecked ? "line-through text-muted-foreground" : "text-foreground/90"}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Callout Box Editorial: Kontak Darurat Call Center Perbankan */}
              <div className="p-4 bg-muted/40 border border-border rounded space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 uppercase">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                    Panggilan Darurat Pemblokiran Rekening Bank &amp; OJK (24 Jam)
                  </span>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                    Hubungi Dalam 15 Menit Pertama
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {OFFICIAL_HOTLINES.slice(0, 4).map((h, i) => (
                    <a
                      key={i}
                      href={`tel:${h.number}`}
                      className="p-2.5 border border-border bg-background hover:bg-muted/60 transition-colors rounded flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-foreground">{h.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{h.number}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Alur Eskalasi Resmi ke Lembaga Negara */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                  Alur Eskalasi Pelaporan ke Institusi Otoritas Resmi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://iasc.ojk.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-background border border-border hover:border-primary rounded-lg flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                        Indonesia Anti-Scam Centre (IASC - OJK 157)
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Pusat penanganan penipuan transaksi keuangan terintegrasi OJK dan perbankan nasional untuk percepatan pemblokiran rekening penampung.
                      </p>
                      <span className="text-[10px] font-mono text-primary font-bold mt-1 inline-block">
                        iasc.ojk.go.id / Hotline 157
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                  </a>

                  <a
                    href="https://patrolisiber.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-background border border-border hover:border-primary rounded-lg flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                        Patroli Siber Polri (Dittipidsiber Bareskrim)
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Penerbitan Surat Tanda Terima Laporan Polisi (STTLP) elektronik secara sah guna penyidikan pro-justitia dan pelacakan digital forensik.
                      </p>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
                        patrolisiber.id
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                  </a>
                </div>
              </div>

              {/* Generator Draf Laporan & Edukasi Warga */}
              <div className="pt-3 border-t border-border/60 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold font-mono uppercase text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    Generator Draf Laporan Resmi Bank &amp; Kepolisian
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      className="h-8 text-xs font-medium"
                      value={reportData.incidentType}
                      onChange={(e) => setReportData({ ...reportData, incidentType: e.target.value })}
                      placeholder="Jenis Insiden"
                    />
                    <Input
                      className="h-8 text-xs font-mono"
                      value={reportData.scammerContact}
                      onChange={(e) => setReportData({ ...reportData, scammerContact: e.target.value })}
                      placeholder="Kontak Penipu"
                    />
                  </div>
                  <Input
                    className="h-8 text-xs font-mono"
                    value={reportData.scammerBankDetails}
                    onChange={(e) => setReportData({ ...reportData, scammerBankDetails: e.target.value })}
                    placeholder="Rekening Penampung Pelaku"
                  />
                  <Textarea
                    rows={2}
                    className="text-xs font-mono resize-none leading-relaxed"
                    value={reportData.chronology}
                    onChange={(e) => setReportData({ ...reportData, chronology: e.target.value })}
                    placeholder="Kronologi Singkat Kejadian"
                  />
                  <Button
                    onClick={handleCopyReport}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs h-8 cursor-pointer"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Draf Laporan Tersalin ke Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Salin Draf Laporan Resmi
                      </>
                    )}
                  </Button>
                </div>

                <div className="lg:col-span-5 space-y-2.5">
                  <div className="text-xs font-bold font-mono uppercase text-foreground flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                    Draf Edukasi Peringatan Grup / Keluarga
                  </div>
                  <div className="p-2.5 bg-muted/40 border border-border rounded text-[11px] font-mono leading-relaxed whitespace-pre-line text-foreground/90 max-h-36 overflow-y-auto">
                    {vaccineText}
                  </div>
                  <Button
                    onClick={handleCopyVaccine}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8 cursor-pointer font-mono font-medium"
                  >
                    {copiedVaccine ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Salin Pesan Edukasi Grup
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* 4. TINJAUAN YURIDIS & LANDASAN HUKUM                      */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-amber-500">BAGIAN III.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Tinjauan Yuridis &amp; Landasan Hukum (Legal Framework)
                </h2>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-serif">
                <p>
                  Dalam kerangka hukum positif Indonesia, tindak pidana siber bermodus <strong>{activeCase.shortName}</strong> memenuhi unsur perbuatan melawan hukum yang diancam pidana secara kumulatif maupun alternatif (*concursus realis*). Pelaku tidak semata-mata dapat dijerat dengan pasal penipuan konvensional, melainkan tunduk pada regulasi khusus mengenai transaksi elektronik dan perlindungan data pribadi.
                </p>

                {/* Callout Rujukan Regulasi Formal */}
                <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-2.5 font-sans">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5 uppercase">
                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                    Konstruksi Pasal &amp; Ketentuan Hukum Terkait
                  </span>
                  <div className="p-3 bg-background border border-border rounded text-xs leading-relaxed space-y-2">
                    <p className="font-semibold text-foreground">
                      {activeCase.legalClauses}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Rujukan Dokumen Otoritatif: <em>{activeCase.officialSourceCitation}</em>
                    </p>
                  </div>
                </div>

                <p>
                  Berdasarkan instrumen <strong>UU ITE No. 1 Tahun 2024 (Perubahan Kedua atas UU No. 11/2008)</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 font-sans text-xs text-foreground/90 leading-relaxed">
                  <li>
                    <strong>Pasal 30 jo. Pasal 46 UU ITE:</strong> Mengatur perbuatan pengaksesan sistem elektronik dan gawai tanpa hak (*Illegal Access*), diancam pidana penjara paling lama 8 tahun dan/atau denda paling banyak Rp800 juta.
                  </li>
                  <li>
                    <strong>Pasal 32 jo. Pasal 48 UU ITE:</strong> Menjerat intersepsi data, penyadapan pesan SMS OTP, dan pemindahan dokumen elektronik tanpa izin, dengan sanksi penjara hingga 8 tahun dan denda hingga Rp2 miliar.
                  </li>
                  <li>
                    <strong>Pasal 35 jo. Pasal 51 ayat (1) UU ITE:</strong> Dikenakan pada pembuatan dokumen atau situs elektronik manipulatif (seperti domain tiruan Coretax atau situs phishing bank), diancam pidana penjara hingga 12 tahun dan denda maksimal Rp12 miliar.
                  </li>
                  <li>
                    <strong>Pasal 378 KUHP &amp; UU Perlindungan Data Pribadi (UU No. 27/2022):</strong> Melindungi hak subjek data dari pemanfaatan identitas secara melawan hukum serta mempidanakan penipuan bermotif keuntungan finansial melawan hukum.
                  </li>
                </ul>

                <p>
                  <strong>Hak Perlindungan Hukum Bagi Korban:</strong> Korban penipuan siber memiliki hak mutlak untuk mengajukan permohonan pemblokiran rekening penampung kepada bank terkait berdasarkan Peraturan OJK (POJK), memperoleh ganti rugi atau restitusi aset melalui mekanisme pengadilan tindak pidana siber, serta mendapatkan pemulihan nama baik apabila data identitas kependudukan (NIK) disalahgunakan oleh sindikat untuk pembukaan rekening nominee.
                </p>
              </div>
            </section>

          </div>
        </article>
      )}      {/* ========================================================= */}
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
