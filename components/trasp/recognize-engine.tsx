"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Search,
  ExternalLink,
  AlertOctagon,
  Layers,
  FileText,
  Shield,
  Zap,
  Eye,
  CheckCircle2,
  Bot,
  Brain,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PRESET_CASES,
  PresetCase,
  analyzeForensics,
  ForensicResult,
} from "@/lib/trasp/engine";
import { CanvasRedactor } from "./canvas-redactor";

interface RecognizeEngineProps {
  initialPresetId?: string;
  onPresetChange?: (presetId: string) => void;
  onSwitchToSandbox?: (caseId: string, customMessage?: string) => void;
  onSwitchToAct?: (scenarioId?: string) => void;
}

interface AIForensicStudy {
  isLoading: boolean;
  source?: string;
  summaryVerdict?: string;
  dangerScore?: number;
  riskLevel?: "HIGH" | "MEDIUM" | "LOW";
  biasExploited?: string[];
  technicalThreats?: string[];
  deepForensicReasoning?: string;
  mitigationRecommendation?: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  vectors?: string[];
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

export function RecognizeEngine({
  initialPresetId = "apk-kurir",
  onPresetChange,
  onSwitchToSandbox,
  onSwitchToAct,
}: RecognizeEngineProps) {
  const [activeInputTab, setActiveInputTab] = useState<"text" | "url" | "canvas">("text");

  const defaultPreset = PRESET_CASES.find((p) => p.id === initialPresetId) || PRESET_CASES[0];
  const [inputText, setInputText] = useState(defaultPreset.rawText);
  const [inputUrl, setInputUrl] = useState(defaultPreset.rawUrl || "");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);

  // Canvas Redactor State
  const [canvasText, setCanvasText] = useState(
    "Selamat siang kak, paket J&T tertahan karena alamat kurang jelas. Tolong buka dan cek foto resi di berkas LIHAT_FOTO_PAKET_JNT.apk ini ya kak. Wajib di-install sekarang sebelum paket dikembalikan ke gudang dalam 2 jam!"
  );
  const [canvasUrl, setCanvasUrl] = useState("http://194.233.164.88/unduh/LIHAT_FOTO_PAKET_JNT.apk");
  const [canvasRedactedCount, setCanvasRedactedCount] = useState(0);

  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(true);

  const [analysisResult, setAnalysisResult] = useState<ForensicResult>(() =>
    analyzeForensics(defaultPreset.rawText, defaultPreset.rawUrl)
  );

  // Real-Time AI Study State
  const [aiStudy, setAiStudy] = useState<AIForensicStudy>({
    isLoading: false,
    source: "gemini-ai (gemini-3.6-flash)",
    summaryVerdict: "Penyusupan Trojan Perbankan (APK Sniffer)",
    dangerScore: 95,
    riskLevel: "HIGH",
    biasExploited: ["Bias Urgensi Semu (Batas 2 Jam)", "Bias Otoritas Kurir Ekspedisi", "Kepanikan Paket Batal"],
    technicalThreats: ["Ekstensi APK Luar Toko Resmi", "IP Publik Mentah (Non-HTTPS)", "Penyadapan Izin Accessibility & SMS OTP"],
    deepForensicReasoning: "Pesan ini mengeksploitasi kepanikan batas waktu 2 jam agar korban tidak sempat verifikasi. Berkas .apk disamarkan sebagai foto resi untuk menyusupkan malware pencuri kode OTP m-Banking saat izin aksesibilitas diberikan.",
    mitigationRecommendation: "Jangan pernah instal berkas .apk. Jika telanjur klik, segera aktifkan Mode Pesawat (Air-Gap) dan cabut izin aksesibilitas gawai.",
  });

  // Chatbot State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Helper to add forensic scan message to Ras chatbot
  const appendScanVerdictToChat = useCallback(
    (verdict: string, score: number, level: string, reasoning: string, mitigation: string) => {
      const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const scanMessage: ChatMessage = {
        id: "bot-scan-" + Date.now(),
        sender: "bot",
        text: `Saya telah memindai bukti yang Anda masukkan:\n\n• **Deteksi:** ${verdict}\n• **Tingkat Bahaya:** ${level} (${score}/100)\n• **Uraian Forensik:** ${reasoning}\n• **Rekomendasi:** ${mitigation}\n\nSilakan tanyakan pada saya jika butuh penjelasan atau langkah mitigasi lanjutan.`,
        time,
      };

      setChatHistory((prev) => {
        const next = [...prev, scanMessage];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("trasp_recognize_chat", JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    []
  );

  const fallbackToLocal = useCallback(
    (text: string, url: string) => {
      const local = analyzeForensics(text, url);
      const verdict = local.statusLabel;
      const score = local.riskScore;
      const level = local.riskLevel;
      const reasoning = local.summary;
      const mitigation = local.safeRecommendations?.[0] || "Jangan kirim data sensitif atau transfer dana.";

      setAiStudy({
        isLoading: false,
        source: "Mesin Forensik Heuristik Lokal",
        summaryVerdict: verdict,
        dangerScore: score,
        riskLevel: level,
        biasExploited: local.detectedRedFlags.length > 0 ? local.detectedRedFlags : ["Pola Manipulasi Linguistik"],
        technicalThreats: local.vectors.filter((v) => v.score > 0).map((v) => v.name),
        deepForensicReasoning: reasoning,
        mitigationRecommendation: mitigation,
      });

      appendScanVerdictToChat(verdict, score, level, reasoning, mitigation);
    },
    [appendScanVerdictToChat]
  );

  const runAIForensicStudy = useCallback(
    async (text: string, url: string) => {
      setIsScanning(true);
      setAiStudy((prev) => ({ ...prev, isLoading: true }));

      try {
        const res = await fetch("/api/trasp/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, url }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            const verdict = data.summaryVerdict || "Terindikasi Manipulasi Siber";
            const score = typeof data.dangerScore === "number" ? data.dangerScore : 65;
            const level = data.riskLevel || "HIGH";
            const reasoning = data.deepForensicReasoning || "Pesan ini mengandung indikator manipulasi rekayasa sosial.";
            const mitigation = data.mitigationRecommendation || "Jangan transfer uang atau serahkan data rahasia.";

            setAiStudy({
              isLoading: false,
              source: data.source || "gemini-ai",
              summaryVerdict: verdict,
              dangerScore: score,
              riskLevel: level,
              biasExploited: data.biasExploited || [],
              technicalThreats: data.technicalThreats || [],
              deepForensicReasoning: reasoning,
              mitigationRecommendation: mitigation,
            });

            appendScanVerdictToChat(verdict, score, level, reasoning, mitigation);
            return;
          }
        }
        fallbackToLocal(text, url);
      } catch (err) {
        console.error("AI Forensic study error, using fallback:", err);
        fallbackToLocal(text, url);
      } finally {
        setIsScanning(false);
      }
    },
    [appendScanVerdictToChat, fallbackToLocal]
  );

  // Restore persistent state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedText = localStorage.getItem("trasp_recognize_text");
        const savedUrl = localStorage.getItem("trasp_recognize_url");
        const savedChat = localStorage.getItem("trasp_recognize_chat");
        if (savedText) {
          setInputText(savedText);
          setAnalysisResult(analyzeForensics(savedText, savedUrl || ""));
        }
        if (savedUrl) setInputUrl(savedUrl);
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatHistory(parsed);
          } else {
            handleResetChat();
          }
        } else {
          handleResetChat();
        }
      } catch (e) {
        console.error("Failed to load recognized storage", e);
        handleResetChat();
      }
    }
  }, []);

  // Save input changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_recognize_text", inputText);
        localStorage.setItem("trasp_recognize_url", inputUrl);
      } catch (e) {}
    }
  }, [inputText, inputUrl]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isBotTyping, isScanning]);

  const handleResetChat = () => {
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const initialGreeting: ChatMessage = {
      id: "bot-init-" + Date.now(),
      sender: "bot",
      text: `Halo! Saya Ras. Masukkan bukti pesan atau tautan mencurigakan di sebelah kiri, lalu klik "Pindai & Analisis" untuk memulai verifikasi forensik digital.`,
      time,
    };
    setChatHistory([initialGreeting]);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_recognize_chat", JSON.stringify([initialGreeting]));
      } catch {}
    }
  };

  const handleRunAnalysis = () => {
    let textToAnalyze = inputText;
    let urlToAnalyze = inputUrl;

    if (activeInputTab === "url") {
      textToAnalyze = inputUrl || inputText;
      urlToAnalyze = inputUrl;
    } else if (activeInputTab === "canvas") {
      textToAnalyze = canvasText;
      urlToAnalyze = canvasUrl;
    }

    setHasScanned(true);
    setIsScanning(true);

    // 1. Instant local evaluation (<1ms) for zero-latency UI update
    const localRes = analyzeForensics(textToAnalyze, urlToAnalyze);
    setAnalysisResult(localRes);

    setAiStudy({
      isLoading: true,
      source: "Mesin Forensik Cepat",
      summaryVerdict: localRes.statusLabel,
      dangerScore: localRes.riskScore,
      riskLevel: localRes.riskLevel,
      biasExploited: localRes.detectedRedFlags.length > 0 ? localRes.detectedRedFlags : ["Pola Manipulasi Linguistik"],
      technicalThreats: localRes.vectors.filter((v) => v.score > 0).map((v) => v.name),
      deepForensicReasoning: localRes.summary,
      mitigationRecommendation: localRes.safeRecommendations?.[0] || "Jangan transfer uang atau berikan data pribadi.",
    });

    // 2. Trigger AI deep analysis (Gemini / Mistral / Local)
    runAIForensicStudy(textToAnalyze, urlToAnalyze);
  };

  const handleTabChange = (val: "text" | "url" | "canvas") => {
    setActiveInputTab(val);
  };

  const handleSendChatMessage = async (presetPrompt?: string) => {
    const text = (presetPrompt || chatInput).trim();
    if (!text || isBotTyping) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      time: userTime,
    };

    const nextHistory = [...chatHistory, userMsg];
    setChatHistory(nextHistory);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_recognize_chat", JSON.stringify(nextHistory));
      } catch {}
    }

    setChatInput("");
    setIsBotTyping(true);

    const activeEvidence = `Sampel Bukti: "${activeInputTab === "url" ? inputUrl : activeInputTab === "canvas" ? canvasText : inputText}"\nStatus Deteksi: ${aiStudy.summaryVerdict || analysisResult.statusLabel}\nSkor Bahaya: ${aiStudy.dangerScore ?? analysisResult.riskScore}/100 (${aiStudy.riskLevel || analysisResult.riskLevel})\nUraian: ${aiStudy.deepForensicReasoning || analysisResult.summary}\nMitigasi: ${aiStudy.mitigationRecommendation || analysisResult.safeRecommendations?.[0]}`;

    try {
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "assistant",
          contextEvidence: activeEvidence,
          chatHistory: nextHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: data.assistantResponse || "Analisis terhadap pesan telah diverifikasi.",
          time: botTime,
        };
        const updatedWithBot = [...nextHistory, botMsg];
        setChatHistory(updatedWithBot);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("trasp_recognize_chat", JSON.stringify(updatedWithBot));
          } catch {}
        }
      } else {
        throw new Error("Chatbot API offline");
      }
    } catch {
      const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const fallbackMsg: ChatMessage = {
        id: "bot-err-" + Date.now(),
        sender: "bot",
        text: "Berdasarkan rujukan forensik siber: bukti ini mengandung indikator manipulasi rekayasa sosial. Jangan pernah mengirim uang, kode OTP, atau memasang aplikasi di luar toko resmi.",
        time: botTime,
      };
      const updatedWithFallback = [...nextHistory, fallbackMsg];
      setChatHistory(updatedWithFallback);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("trasp_recognize_chat", JSON.stringify(updatedWithFallback));
        } catch {}
      }
    } finally {
      setIsBotTyping(false);
    }
  };

  const getRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return "text-rose-500 border-rose-500/40 bg-rose-500/10";
      case "MEDIUM":
        return "text-amber-500 border-amber-500/40 bg-amber-500/10";
      case "LOW":
        return "text-emerald-500 border-emerald-500/40 bg-emerald-500/10";
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Grid: Left (Input & Hasil Analisis Forensik) vs Right (Interactive AI Chatbot Ras) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: INPUT PENIPU & HASIL ANALISIS FORENSIK        */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          {/* 1. Input Card */}
          <Card className="border-border">
            <CardHeader className="p-3.5 pb-2 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Input Bukti
                </CardTitle>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase font-mono bg-background">
                  Scanner
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-3.5 space-y-3">
              <Tabs
                value={activeInputTab}
                onValueChange={(val) => handleTabChange(val as "text" | "url" | "canvas")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-muted border border-border mb-3">
                  <TabsTrigger value="text" className="text-xs font-mono h-7">
                    Teks
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-xs font-mono h-7">
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="canvas" className="text-xs font-mono h-7">
                    Sensor Privasi
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-2 mt-0">
                  <Textarea
                    rows={5}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel pesan penipuan di sini..."
                    className="text-xs font-mono resize-none leading-relaxed border-border focus:border-primary"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-2 mt-0">
                  <Input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://tautan-mencurigakan.com/..."
                    className="text-xs font-mono h-9 border-border focus:border-primary"
                  />
                </TabsContent>

                <TabsContent value="canvas" className="mt-0">
                  <CanvasRedactor
                    onRedactedChange={(count) => setCanvasRedactedCount(count)}
                    onSampleLoaded={(text, url) => {
                      setCanvasText(text);
                      setCanvasUrl(url);
                    }}
                  />
                </TabsContent>
              </Tabs>

              {/* Tombol Pindai & Analisis */}
              <Button
                onClick={handleRunAnalysis}
                disabled={isScanning}
                className="w-full text-xs h-9 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {isScanning ? (
                  <>
                    <Zap className="w-3.5 h-3.5 mr-1.5 animate-spin text-amber-300" />
                    Memindai &amp; Menganalisis...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5 mr-1.5" />
                    Pindai &amp; Analisis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 2. Hasil Analisis Forensik Card (Muncul saat dipindai) */}
          {hasScanned && (
            <Card className="border-border animate-in fade-in duration-200">
              <CardHeader className="p-3.5 pb-2 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Hasil Analisis Forensik
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${getRiskColor(aiStudy.riskLevel || analysisResult.riskLevel)}`}
                  >
                    {aiStudy.riskLevel || analysisResult.riskLevel} • {aiStudy.dangerScore ?? analysisResult.riskScore}/100
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-3.5 space-y-3 text-xs">
                {/* Vonis Deteksi */}
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    Vonis Deteksi:
                  </span>
                  <h4 className="font-serif font-bold text-sm text-foreground mt-0.5">
                    {aiStudy.summaryVerdict || analysisResult.statusLabel}
                  </h4>
                </div>

                {/* Uraian Forensik Kritis */}
                <div className="p-2.5 bg-muted/40 border border-border rounded space-y-1">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Uraian Forensik Bukti:
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {aiStudy.deepForensicReasoning || analysisResult.summary}
                  </p>
                </div>

                {/* Celah / Taktik Terdeteksi */}
                {aiStudy.biasExploited && aiStudy.biasExploited.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
                      Celah / Taktik Terdeteksi:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {aiStudy.biasExploited.map((bias, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-muted border border-border rounded text-muted-foreground"
                        >
                          {bias}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rekomendasi Tindakan Cepat */}
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded space-y-1">
                  <span className="text-[10px] font-mono text-rose-500 font-bold uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-rose-500" />
                    Rekomendasi Tindakan Cepat:
                  </span>
                  <p className="text-foreground text-[11px] leading-relaxed">
                    {aiStudy.mitigationRecommendation || analysisResult.safeRecommendations?.[0]}
                  </p>
                </div>

                {/* Tombol ke Act */}
                {onSwitchToAct && (
                  <Button
                    onClick={() => onSwitchToAct(selectedPresetId)}
                    className="w-full text-xs h-8 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 font-mono font-medium cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Buka SOP Mitigasi &amp; Laporan (Act)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE AI FORENSIC CHATBOT (Ras)        */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col h-[600px] lg:h-auto min-h-[580px] bg-card border border-border">
          {/* Chatbot Header */}
          <div className="px-3.5 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-mono tracking-wide text-foreground flex items-center gap-1.5">
                  Ras
                  <Badge variant="outline" className="text-[9px] py-0 px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono">
                    Live Gemini
                  </Badge>
                </h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer font-mono"
              title="Reset Chat Ras"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Chat Messages Body */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/50 text-xs">
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center text-primary mt-0.5">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded p-2.5 space-y-1 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted/70 border border-border text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {renderCleanMessage(m.text)}
                  </div>

                  <div className="text-[9px] text-muted-foreground/80 font-mono text-right">
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {(isBotTyping || isScanning) && (
              <div className="flex gap-2 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded border border-border">
                <Zap className="w-3 h-3 text-primary animate-spin" />
                <span>{isScanning ? "Ras sedang memindai dan menganalisis bukti..." : "Ras sedang merangkai jawaban..."}</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-muted/60 border-t border-border shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex gap-1.5 items-center"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanyakan analisis atau mitigasi ke Ras..."
                disabled={isBotTyping || isScanning}
                className="text-xs h-9 bg-background border-border"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!chatInput.trim() || isBotTyping || isScanning}
                className="h-9 px-3 bg-primary text-primary-foreground font-medium cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
