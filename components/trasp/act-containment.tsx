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

          {/* Grid Katalog Kasus - Clean, Scannable & Neutral */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPENDIUM_CASES.map((item) => {
              const meta = CASE_META[item.id] || {
                icon: Shield,
                tags: [],
              };
              const IconComp = meta.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item.id)}
                  className="group relative border border-border/80 bg-card hover:border-foreground/40 transition-all duration-200 p-4 sm:p-5 rounded-lg flex flex-col justify-between cursor-pointer hover:shadow-xs space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Case Code (#01) & Neutral Badge */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <IconComp className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono font-medium">#{String(item.number).padStart(2, "0")}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/80 px-2 py-0.5 rounded border border-border/60 bg-muted/20">
                        {item.riskLevel === "CRITICAL" ? "Bahaya Tinggi" : "Bahaya Sedang"}
                      </span>
                    </div>

                    {/* Case Title (Max 1-2 lines, clean & bold) */}
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:underline transition-all line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Case Modus Description (1 clean sentence) */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.modusOperandi}
                    </p>
                  </div>

                  {/* Subtle Action Link */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="font-medium">Lihat Panduan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

          {/* Continuous Investigative Document Sheet (Editorial Max-w-3xl Centered Layout) */}
          <div className="bg-card border border-border p-5 sm:p-8 space-y-8 rounded-lg shadow-xs max-w-3xl mx-auto">

            {/* ========================================================= */}
            {/* 1. HEADER DOKUMEN & SUB-HEADER METADATA                   */}
            {/* ========================================================= */}
            <header className="space-y-3 pb-6 border-b border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    KASUS #{String(activeCase.number).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {activeCase.category}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground leading-tight">
                  {activeCase.title}
                </h1>
              </div>

              {/* Sub-header minimalis biasa di bawah judul utama */}
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 flex-wrap pt-1 leading-relaxed">
                <span>Status: <strong className="text-foreground">{activeCase.riskLevel === "CRITICAL" ? "Bahaya Tinggi" : "Bahaya Sedang"}</strong></span>
                <span>|</span>
                <span>Kategori: <strong className="text-foreground">{activeCase.category}</strong></span>
                <span>|</span>
                <span>Rujukan: <strong className="text-foreground">{activeCase.officialSourceCitation}</strong></span>
              </div>
            </header>

            {/* ========================================================= */}
            {/* 2. BABAK 1: APA KASUSNYA? (ANATOMI & BAHAYA UTAMA)        */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-muted-foreground">BABAK I.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Apa Kasusnya? (Modus Operandi &amp; Bahaya Utama)
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
                <p>
                  Kejahatan digital dengan modus <strong>{activeCase.title}</strong> merupakan taktik penipuan di mana pelaku mendekati korban melalui pesan sehari-hari yang tampak wajar. Pelaku biasanya menyamar sebagai kurir paket ekspedisi, teman yang mengirim undangan pernikahan, petugas tilang kepolisian, kantor pajak, atau pihak perusahaan yang menawarkan pekerjaan mudah.
                </p>

                <p>
                  {activeCase.modusOperandi} Pelaku sengaja menciptakan suasana panik atau mendesak—misalnya dengan batas waktu 1 hingga 2 jam—agar korban tidak sempat berpikir jernih atau bertanya kepada orang lain.
                </p>

                <p>
                  Secara sederhana, {activeCase.technicalMechanism} Korban yang tidak menaruh curiga sering kali baru menyadari bahaya ini setelah saldo tabungan mereka berkurang atau akun percakapan mereka tidak bisa lagi dibuka.
                </p>
              </div>

              {/* Catatan Studi Kasus Nyata di Indonesia */}
              <div className="p-4 bg-muted/30 border-l-2 border-l-foreground/30 rounded-r space-y-1 my-3">
                <div className="text-xs font-mono font-bold text-foreground uppercase">
                  Contoh Kasus Nyata di Indonesia
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeCase.realCasesIndonesia}
                </p>
              </div>

              {/* Tanda-Tanda Utama & Jebakan Pikiran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-muted/20 border border-border rounded space-y-2">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                    Ciri-Ciri Utama Pesan Penipuan
                  </span>
                  <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside leading-relaxed">
                    {activeCase.characteristics.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-muted/20 border border-border rounded space-y-2">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    Jebakan Pikiran yang Dimanfaatkan Pelaku
                  </span>
                  <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                    {activeCase.psychologicalBiases.map((b, i) => (
                      <div key={i}>
                        <strong className="text-foreground font-mono text-[11px]">• {b.biasName}:</strong> {b.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* 3. BABAK 2: APA YANG HARUS SEGERA DILAKUKAN?              */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-muted-foreground">BABAK II.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Apa yang Harus Segera Dilakukan? (Tindakan Darurat Praktis)
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
                <p>
                  Jika Anda atau orang terdekat telanjur mengklik tautan atau menginstal file yang mencurigakan, jangan panik. Lakukan langkah-langkah darurat penyelamatan berikut secara berurutan dalam waktu 15 hingga 30 menit pertama:
                </p>

                {/* Checklist Langkah Darurat Interaktif */}
                <div className="space-y-2.5 font-sans pt-1">
                  {activeCase.emergencyActionSteps.map((step, idx) => {
                    const isChecked = !!completedSteps[step];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(step)}
                        className={`p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? "bg-muted/50 border-border text-foreground"
                            : "bg-muted/20 border-border hover:border-foreground/30"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? "bg-foreground text-background border-foreground" : "border-border bg-background"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="text-xs leading-relaxed">
                          <strong className="text-foreground block font-mono text-[11px] mb-0.5">
                            {idx === 0
                              ? "Langkah 1: Matikan Internet Ponsel (Mode Pesawat)"
                              : idx === 1
                              ? "Langkah 2: Hubungi Bank untuk Blokir Rekening"
                              : idx === 2
                              ? "Langkah 3: Cabut Izin Khusus & Hapus Aplikasi"
                              : "Langkah 4: Ganti Sandi Akun & Buat Laporan Resmi"}
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

              {/* Call Center Darurat Bank */}
              <div className="p-4 bg-muted/30 border border-border rounded space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-muted-foreground" />
                    Nomor Telepon Darurat Bank Resmi (24 Jam)
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Langsung Telepon untuk Blokir Saldo
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
                      <span className="text-xs font-mono font-bold text-foreground/80 mt-1">{h.number}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Alur Laporan Resmi ke Pemerintah */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                  Alur Pelaporan Resmi ke Lembaga Negara:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://iasc.ojk.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-background border border-border hover:border-foreground/40 rounded-lg flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-foreground group-hover:underline">
                        Indonesia Anti-Scam Centre (IASC - OJK 157)
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Layanan resmi OJK bersama bank nasional untuk mempercepat pemblokiran rekening bank milik penipu.
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground font-bold mt-1 inline-block">
                        iasc.ojk.go.id / Telepon 157
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
                  </a>

                  <a
                    href="https://patrolisiber.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-background border border-border hover:border-foreground/40 rounded-lg flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-xs text-foreground group-hover:underline">
                        Patroli Siber Polri (Bareskrim Polri)
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Portal resmi Kepolisian RI untuk membuat Laporan Polisi elektronik atas tindak pidana siber.
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground font-bold mt-1 inline-block">
                        patrolisiber.id
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 ml-2" />
                  </a>
                </div>
              </div>

              {/* Generator Draf Laporan & Edukasi Warga */}
              <div className="pt-3 border-t border-border/60 grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold font-mono uppercase text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    Generator Draf Laporan Resmi Bank &amp; Polisi
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      className="h-8 text-xs font-medium"
                      value={reportData.incidentType}
                      onChange={(e) => setReportData({ ...reportData, incidentType: e.target.value })}
                      placeholder="Jenis Kejadian"
                    />
                    <Input
                      className="h-8 text-xs font-mono"
                      value={reportData.scammerContact}
                      onChange={(e) => setReportData({ ...reportData, scammerContact: e.target.value })}
                      placeholder="Nomor Telepon Penipu"
                    />
                  </div>
                  <Input
                    className="h-8 text-xs font-mono"
                    value={reportData.scammerBankDetails}
                    onChange={(e) => setReportData({ ...reportData, scammerBankDetails: e.target.value })}
                    placeholder="Nomor Rekening Bank Penipu"
                  />
                  <Textarea
                    rows={2}
                    className="text-xs font-mono resize-none leading-relaxed"
                    value={reportData.chronology}
                    onChange={(e) => setReportData({ ...reportData, chronology: e.target.value })}
                    placeholder="Ceritakan singkat kejadian yang dialami"
                  />
                  <Button
                    onClick={handleCopyReport}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-mono font-bold text-xs h-8 cursor-pointer"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                        Draf Laporan Tersalin!
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
                    Pesan Peringatan untuk Keluarga &amp; Teman
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
                        Salin Pesan Peringatan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* 4. BABAK 3: ATURAN HUKUM RESMI (DASAR HUKUM NEGARA)       */}
            {/* ========================================================= */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                <span className="text-xs font-mono font-bold text-muted-foreground">BABAK III.</span>
                <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Aturan Hukum Resmi &amp; Perlindungan Korban
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
                <p>
                  Perlu dipahami bahwa perbuatan penipuan dan pencurian data pribadi ini merupakan <strong>tindak pidana kejahatan siber yang melanggar hukum resmi negara Republik Indonesia</strong>. Pelaku tidak dapat berlindung di balik anonimitas internet karena jejak digital transaksi dan nomor ponsel dapat dilacak oleh penegak hukum.
                </p>

                {/* Callout Rujukan Pasal */}
                <div className="p-4 bg-muted/30 border border-border rounded space-y-2 font-sans">
                  <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-muted-foreground" />
                    Pasal-Pasal Hukum yang Dilanggar Pelaku
                  </span>
                  <div className="p-3 bg-background border border-border rounded text-xs leading-relaxed space-y-1.5">
                    <p className="font-semibold text-foreground">
                      {activeCase.legalClauses}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Rujukan Resmi: <em>{activeCase.officialSourceCitation}</em>
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground text-xs">
                    Poin Utama Berdasarkan Undang-Undang Informasi dan Transaksi Elektronik (UU ITE No. 1 Tahun 2024):
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>
                      <strong>Pencurian Akses Ponsel (Pasal 30 jo. Pasal 46):</strong> Membuka atau mengendalikan ponsel orang lain tanpa izin diancam pidana penjara paling lama 8 tahun dan denda hingga Rp800 juta.
                    </li>
                    <li>
                      <strong>Penyadapan Pesan Rahasia (Pasal 32 jo. Pasal 48):</strong> Mengambil kode SMS OTP atau data pribadi secara diam-diam diancam pidana penjara hingga 8 tahun dan denda hingga Rp2 miliar.
                    </li>
                    <li>
                      <strong>Pembuatan Website atau Surat Palsu (Pasal 35 jo. Pasal 51):</strong> Memalsukan identitas bank atau lembaga negara diancam pidana penjara hingga 12 tahun dan denda maksimal Rp12 miliar.
                    </li>
                    <li>
                      <strong>Penipuan Finansial (Pasal 378 KUHP):</strong> Mengelabui orang demi mendapatkan uang diancam hukuman penjara hingga 4 tahun.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-muted/20 border border-border rounded space-y-1.5 text-xs">
                  <strong className="text-foreground block font-mono text-[11px]">
                    Hak Perlindungan Hukum Bagi Korban:
                  </strong>
                  <p className="text-muted-foreground leading-relaxed">
                    Sebagai korban, Anda memiliki hak resmi untuk meminta bank segera membekukan rekening penampung milik penipu melalui laporan ke OJK (IASC 157). Anda juga berhak mendapatkan perlindungan data kependudukan (NIK) agar tidak disalahgunakan untuk transaksi pinjaman daring fiktif.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
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
