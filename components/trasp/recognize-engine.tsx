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
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

  const [analysisResult, setAnalysisResult] = useState<ForensicResult>(() =>
    analyzeForensics(defaultPreset.rawText, defaultPreset.rawUrl)
  );

  // Real-Time AI Study State
  const [aiStudy, setAiStudy] = useState<AIForensicStudy>({
    isLoading: false,
    source: "gemini-ai (gemini-3.6-flash)",
    summaryVerdict: "Penyusupan Trojan Perbankan (APK Sniffer)",
    dangerScore: 61,
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
          }
        }
      } catch (e) {
        console.error("Failed to load recognized storage", e);
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
  }, [chatHistory, isBotTyping]);

  // Initial welcome message from Chatbot based on forensic findings
  const resetChatWithVerdict = useCallback((verdict: string, score: number, level: string, textSample: string) => {
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const initialGreeting: ChatMessage = {
      id: "bot-init-" + Date.now(),
      sender: "bot",
      text: `Halo! Saya Ras.\n\nSaya telah memindai bukti ini:\n• Deteksi: ${verdict}\n• Tingkat Bahaya: ${level} (${score}/100)\n\nSilakan tanyakan apa saja seputar bukti pesan ini.`,
      time,
    };
    setChatHistory([initialGreeting]);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_recognize_chat", JSON.stringify([initialGreeting]));
      } catch {}
    }
  }, []);

  const runAIForensicStudy = useCallback(async (text: string, url: string) => {
    setAiStudy((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch("/api/trasp/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, url }),
      });
      if (res.ok) {
        const data = await res.json();
        const verdict = data.summaryVerdict || "Terindikasi Manipulasi Siber";
        const score = data.dangerScore ?? 60;
        const level = data.riskLevel || "HIGH";

        setAiStudy({
          isLoading: false,
          source: data.source || "gemini-ai (gemini-3.6-flash)",
          summaryVerdict: verdict,
          dangerScore: score,
          riskLevel: level,
          biasExploited: data.biasExploited || [],
          technicalThreats: data.technicalThreats || [],
          deepForensicReasoning: data.deepForensicReasoning,
          mitigationRecommendation: data.mitigationRecommendation,
        });

        resetChatWithVerdict(verdict, score, level, text);
      } else {
        setAiStudy((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setAiStudy((prev) => ({ ...prev, isLoading: false }));
    }
  }, [resetChatWithVerdict]);

  useEffect(() => {
    if (initialPresetId) {
      const p = PRESET_CASES.find((c) => c.id === initialPresetId);
      if (p) {
        setSelectedPresetId(p.id);
        setInputText(p.rawText);
        setInputUrl(p.rawUrl || "");
        setAnalysisResult(analyzeForensics(p.rawText, p.rawUrl));
        runAIForensicStudy(p.rawText, p.rawUrl || "");
      }
    }
  }, [initialPresetId, runAIForensicStudy]);

  const handleSelectPreset = (preset: PresetCase) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.rawText);
    setInputUrl(preset.rawUrl || "");
    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeForensics(preset.rawText, preset.rawUrl);
      setAnalysisResult(res);
      setIsScanning(false);
      runAIForensicStudy(preset.rawText, preset.rawUrl || "");
    }, 200);

    if (activeInputTab === "canvas") {
      setActiveInputTab("text");
    }
    onPresetChange?.(preset.id);
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

    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeForensics(textToAnalyze, urlToAnalyze);
      setAnalysisResult(res);
      setIsScanning(false);
      runAIForensicStudy(textToAnalyze, urlToAnalyze);
    }, 200);
  };

  const handleTabChange = (val: "text" | "url" | "canvas") => {
    setActiveInputTab(val);
    let t = inputText;
    let u = inputUrl;
    if (val === "canvas") {
      t = canvasText;
      u = canvasUrl;
    } else if (val === "url") {
      t = inputUrl || inputText;
      u = inputUrl;
    }
    setAnalysisResult(analyzeForensics(t, u));
    runAIForensicStudy(t, u);
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

    const activeEvidence = `Sampel Bukti: "${activeInputTab === "url" ? inputUrl : activeInputTab === "canvas" ? canvasText : inputText}"\nStatus Deteksi: ${aiStudy.summaryVerdict || analysisResult.statusLabel}\nSkor Bahaya: ${aiStudy.dangerScore ?? analysisResult.riskScore}/100 (${aiStudy.riskLevel || analysisResult.riskLevel})`;

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
          text: data.assistantResponse || "Analisis terhadap pesan telah selesai.",
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
        return "text-rose-600 dark:text-rose-400 border-border bg-rose-500/10";
      case "MEDIUM":
        return "text-amber-600 dark:text-amber-400 border-border bg-amber-500/10";
      case "LOW":
        return "text-emerald-600 dark:text-emerald-400 border-border bg-emerald-500/10";
    }
  };

  // Live highlighted text tokens for instant X-Ray feedback
  const highlightedTokens = useMemo(() => {
    const raw = activeInputTab === "url" ? inputUrl : inputText;
    if (!raw) return [];

    const allClues: { clue: string; category: string }[] = [];
    analysisResult.vectors.forEach((v) => {
      v.detectedClues.forEach((c) => {
        allClues.push({ clue: c.toLowerCase(), category: v.id });
      });
    });

    if (allClues.length === 0) {
      return [{ text: raw, isClue: false, category: "" }];
    }

    const sorted = [...allClues].sort((a, b) => b.clue.length - a.clue.length);
    const regexPattern = new RegExp(
      `(${sorted.map((s) => s.clue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    );

    const parts = raw.split(regexPattern);
    return parts.map((part) => {
      const match = sorted.find((s) => s.clue.toLowerCase() === part.toLowerCase());
      return {
        text: part,
        isClue: !!match,
        category: match ? match.category : "",
      };
    });
  }, [inputText, inputUrl, activeInputTab, analysisResult]);

  const quickPrompts = [
    "Kenapa bukti ini berbahaya?",
    "Bagaimana cara verifikasi resi asli?",
    "Apa langkah jika telanjur klik?",
    "Apa pasal hukum penipuan ini?",
  ];

  return (
    <div className="space-y-4">

      {/* Main Grid: Left (Inputs & Forensic Verdict) vs Right (Interactive AI Chatbot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: INPUT PENIPU & HASIL ANALISIS DETEKSI AWAL */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          {/* Input Card */}
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
                    rows={4}
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
                      if (activeInputTab === "canvas") {
                        setAnalysisResult(analyzeForensics(text, url));
                        runAIForensicStudy(text, url);
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleRunAnalysis}
                disabled={isScanning}
                className="w-full text-xs h-9 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {isScanning ? (
                  <>
                    <Zap className="w-3.5 h-3.5 mr-1.5 animate-spin text-amber-300" />
                    Memindai...
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
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE AI FORENSIC CHATBOT */}
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
              onClick={() => resetChatWithVerdict(aiStudy.summaryVerdict || "Analisis", aiStudy.dangerScore ?? 60, aiStudy.riskLevel || "HIGH", inputText)}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              title="Reset Chat"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* Chat Messages Body */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/50 text-xs"
          >
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-6 h-6 rounded bg-primary/10 shrink-0 flex items-center justify-center text-primary mt-0.5 border border-primary/20">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded p-2.5 space-y-1.5 leading-relaxed ${
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

                {m.sender === "user" && (
                  <div className="w-6 h-6 rounded bg-muted shrink-0 flex items-center justify-center text-foreground mt-0.5 border border-border">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isBotTyping && (
              <div className="flex gap-2 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded border border-border">
                <Zap className="w-3 h-3 text-primary animate-spin" />
                <span>Menganalisis pertanyaan Anda...</span>
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
                placeholder="Tanyakan ke Ras..."
                disabled={isBotTyping}
                className="text-xs h-9 bg-background border-border"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!chatInput.trim() || isBotTyping}
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
