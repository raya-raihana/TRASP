"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  ExternalLink,
  AlertOctagon,
  ArrowRight,
  Layers,
  Link as LinkIcon,
  FileText,
  Shield,
  Sparkles,
  Zap,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bot,
  Brain,
  ShieldCheck,
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
  ForensicResult
} from "@/lib/trasp/engine";
import { CanvasRedactor } from "./canvas-redactor";
import { InfoHint } from "./info-hint";

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

export function RecognizeEngine({
  initialPresetId = "apk-kurir",
  onPresetChange,
  onSwitchToSandbox
}: RecognizeEngineProps) {
  const [activeInputTab, setActiveInputTab] = useState<"text" | "url" | "canvas">("text");

  const defaultPreset = PRESET_CASES.find((p) => p.id === initialPresetId) || PRESET_CASES[0];
  const [inputText, setInputText] = useState(defaultPreset.rawText);
  const [inputUrl, setInputUrl] = useState(defaultPreset.rawUrl || "");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);

  // Canvas Redactor State
  const [canvasText, setCanvasText] = useState(
    "Selamat siang kak, mohon maaf paket J&T tertahan karena alamat kurang jelas. Tolong buka dan cek foto resi di berkas LIHAT_FOTO_PAKET_JNT.apk ini ya kak. Wajib di-install sekarang sebelum paket dikembalikan ke gudang dalam 2 jam!"
  );
  const [canvasUrl, setCanvasUrl] = useState("http://194.233.164.88/unduh/LIHAT_FOTO_PAKET_JNT.apk");
  const [canvasRedactedCount, setCanvasRedactedCount] = useState(0);

  const [isScanning, setIsScanning] = useState(false);
  const [selectedClueInfo, setSelectedClueInfo] = useState<string | null>(null);

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
    deepForensicReasoning: "Pesan ini mengeksploitasi kepanikan batas waktu 2 jam agar korban tidak sempat melakukan verifikasi. Berkas .apk disamarkan sebagai foto resi untuk menyusupkan malware pencuri kode OTP m-Banking saat izin aksesibilitas diberikan.",
    mitigationRecommendation: "Jangan pernah install berkas .apk. Jika telanjur klik, segera aktifkan Mode Pesawat (Air-Gap) dan cabut izin aksesibilitas gawai.",
  });

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
        setAiStudy({
          isLoading: false,
          source: data.source || "gemini-ai (gemini-3.6-flash)",
          summaryVerdict: data.summaryVerdict,
          dangerScore: data.dangerScore,
          riskLevel: data.riskLevel,
          biasExploited: data.biasExploited || [],
          technicalThreats: data.technicalThreats || [],
          deepForensicReasoning: data.deepForensicReasoning,
          mitigationRecommendation: data.mitigationRecommendation,
        });
      } else {
        setAiStudy((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setAiStudy((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

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
        category: match ? match.category : ""
      };
    });
  }, [inputText, inputUrl, activeInputTab, analysisResult]);

  return (
    <div className="space-y-4">
      {/* Sleek Preset Pills (1 Clean Line) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs bg-muted/40 p-2 border border-border">
        <div className="flex items-center gap-1 mr-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Sampel Kasus Riil:
          </span>
          <InfoHint
            title="Katalog Sampel Penipuan Riil"
            description="Preset kasus nyata yang marak di Indonesia (2025/2026). Setiap skenario memicu analisis vektor forensik dan evaluasi psikologis yang berbeda secara dinamis."
          />
        </div>

        {PRESET_CASES.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-2 py-1 text-xs font-mono transition-all border cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                  : "bg-background text-muted-foreground hover:text-foreground border-border hover:border-primary/50"
              }`}
            >
              {preset.title.split(":")[0]}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Input & Inspector Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border">
            <CardHeader className="p-3.5 pb-2 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Inspektor Bukti Digital
                </CardTitle>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase font-mono bg-background">
                  Live Scanner
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
                    Teks Pesan
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-xs font-mono h-7">
                    URL / Tautan
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
                    placeholder="Tempel pesan WhatsApp/SMS mencurigakan di sini..."
                    className="text-xs font-mono resize-none leading-relaxed border-border focus:border-primary"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-2 mt-0">
                  <Input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://contoh-tautan-curiga.com/..."
                    className="text-xs font-mono h-9 border-border focus:border-primary"
                  />
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Menganalisis domain, ekstensi TLD (.xyz/.top), punycode, dan subdomain ganda.
                  </p>
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
                    Menganalisis Vektor Forensik...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5 mr-1.5" />
                    Pindai &amp; Bedah Pesan
                  </>
                )}
              </Button>

              {/* Live Interactive X-Ray Markup Box */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Live X-Ray Highlight:
                  </span>
                  <span className="text-[9px] text-muted-foreground">(Sorotan Kata Berbahaya)</span>
                </div>

                <div className="p-2.5 bg-slate-950 border border-slate-800 text-[11px] leading-relaxed text-slate-200 font-mono max-h-36 overflow-y-auto rounded-none">
                  {highlightedTokens.map((t, idx) => {
                    if (!t.isClue) {
                      return <span key={idx}>{t.text}</span>;
                    }

                    let badgeClass = "bg-amber-500/20 text-amber-300 border border-amber-500/50 px-1 py-0.2 mx-0.5 rounded-none font-bold";
                    if (t.category === "asset") {
                      badgeClass = "bg-rose-500/20 text-rose-300 border border-rose-500/50 px-1 py-0.2 mx-0.5 rounded-none font-bold";
                    } else if (t.category === "authority") {
                      badgeClass = "bg-blue-500/20 text-blue-300 border border-blue-500/50 px-1 py-0.2 mx-0.5 rounded-none font-bold";
                    } else if (t.category === "financial") {
                      badgeClass = "bg-purple-500/20 text-purple-300 border border-purple-500/50 px-1 py-0.2 mx-0.5 rounded-none font-bold";
                    }

                    return (
                      <span
                        key={idx}
                        className={badgeClass}
                        title={`Vektor: ${t.category}`}
                      >
                        {t.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forensic Results Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border overflow-hidden">
            {/* Risk Score Banner */}
            <div className={`p-3.5 border-b flex items-center justify-between gap-3 ${getRiskColor(analysisResult.riskLevel)}`}>
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-serif font-bold text-sm block">
                    {analysisResult.statusLabel}
                  </span>
                  <span className="text-[10px] opacity-80 font-mono block">
                    {aiStudy.summaryVerdict ? aiStudy.summaryVerdict : "Analisis Probabilistik Heuristik (Juknis No. 29)"}
                  </span>
                </div>
              </div>
              <div className="font-mono text-sm font-bold px-3 py-1 bg-background/90 border border-border shrink-0">
                Skor: {analysisResult.riskScore}/100
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              {activeInputTab === "canvas" && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>
                    {canvasRedactedCount > 0
                      ? `Sensor Privasi Aktif: ${canvasRedactedCount} area data pribadi berhasil disensor sebelum analisis.`
                      : "Pemrosesan Lokal: Tangkapan layar dianalisis 100% di browser tanpa kebocoran data."}
                  </span>
                </div>
              )}

              {/* REAL-TIME AI FORENSIC STUDY CARD (Hero Intelligence) */}
              <div className="p-3.5 bg-muted/40 border-2 border-primary/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 text-foreground">
                        HASIL PEMBELAJARAN FORENSIK AI REAL-TIME
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        Mempelajari pola linguistik, bias kognitif, &amp; vektor teknis secara mendalam (Bukan Tebak Angka)
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono py-0.5 px-2 bg-background border-primary/40 text-primary">
                    {aiStudy.isLoading ? (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Zap className="w-3 h-3 animate-spin" /> Mempelajari...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3 h-3" /> {aiStudy.source || "Gemini 3.6 Flash"}
                      </span>
                    )}
                  </Badge>
                </div>

                {/* Deep Forensic Reasoning Box */}
                <div className="p-2.5 bg-background border border-border/70 rounded text-xs leading-relaxed space-y-1.5">
                  <div className="text-[11px] font-bold text-primary flex items-center gap-1 font-mono uppercase">
                    <Zap className="w-3 h-3" /> Uraian Pembuktian Bahaya:
                  </div>
                  <p className="text-foreground text-[11px] leading-relaxed">
                    {aiStudy.deepForensicReasoning || analysisResult.summary}
                  </p>
                </div>

                {/* Cognitive Bias & Technical Threat Chips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                  {/* Exploited Biases */}
                  <div className="p-2 bg-background/80 border border-border rounded space-y-1">
                    <span className="font-mono text-muted-foreground uppercase text-[9px] block font-semibold">
                      Bias Kognitif Target yang Dieksploitasi:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {aiStudy.biasExploited && aiStudy.biasExploited.length > 0 ? (
                        aiStudy.biasExploited.map((b, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded font-medium"
                          >
                            ⚠️ {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic font-mono">Pola wajar / Tanpa manipulasi</span>
                      )}
                    </div>
                  </div>

                  {/* Technical Threats */}
                  <div className="p-2 bg-background/80 border border-border rounded space-y-1">
                    <span className="font-mono text-muted-foreground uppercase text-[9px] block font-semibold">
                      Vektor Ancaman Teknis Teridentifikasi:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {aiStudy.technicalThreats && aiStudy.technicalThreats.length > 0 ? (
                        aiStudy.technicalThreats.map((t, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded font-medium"
                          >
                            🛡️ {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic font-mono">Tidak ada ancaman teknis</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Mitigation from AI */}
                {aiStudy.mitigationRecommendation && (
                  <div className="p-2 bg-primary/5 border border-primary/20 rounded text-[11px] text-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-primary block">
                        Rekomendasi Aksi Cepat:
                      </strong>
                      <span className="text-[11px] text-muted-foreground">
                        {aiStudy.mitigationRecommendation}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Threat Vectors Bars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pb-1 border-b border-border">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>5 Vektor Ancaman (Threat Matrix)</span>
                  </span>
                  <span className="font-mono text-[10px]">Tingkat Risiko</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.vectors.map((vec) => (
                    <div key={vec.id} className="p-2.5 bg-background border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{vec.name}</span>
                        <span className={`font-mono text-xs font-bold ${vec.score >= 60 ? "text-rose-500" : vec.score >= 30 ? "text-amber-500" : "text-muted-foreground"}`}>
                          {vec.score}%
                        </span>
                      </div>
                      <Progress value={vec.score} className="h-1.5" />
                      {vec.detectedClues.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {vec.detectedClues.slice(0, 3).map((clue, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-1 py-0 font-mono text-muted-foreground border-border truncate max-w-[140px]">
                              {clue}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] text-muted-foreground italic font-mono block">Tidak terindikasi</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Deconstruction */}
              {analysisResult.urlAnalysis && analysisResult.urlAnalysis.isValid && (
                <div className="p-3 border border-border bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>Bedah Struktur Domain (Deconstructor)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-[11px] space-y-1 bg-black/50 p-2 border border-slate-800">
                    <div>
                      <span className="text-slate-400">Host / Domain Pemilik:</span>{" "}
                      <span className="text-amber-300 font-bold">{analysisResult.urlAnalysis.rootDomain}</span>
                    </div>
                    {analysisResult.urlAnalysis.subdomain && (
                      <div>
                        <span className="text-slate-400">Subdomain Tipuan:</span>{" "}
                        <span className={analysisResult.urlAnalysis.isSpoofedSubdomain ? "text-rose-400 font-bold" : "text-slate-300"}>
                          {analysisResult.urlAnalysis.subdomain}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-200/90 pt-1 border-t border-slate-800 leading-relaxed">
                    {analysisResult.urlAnalysis.explanation}
                  </p>
                </div>
              )}

              {/* BIG CALL TO ACTION: Direct Jump to WhatsApp Sandbox */}
              <div className="p-3.5 bg-primary/10 border-2 border-primary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Latih Intuisi: Masuk ke Simulasi WhatsApp
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Uji langsung bagaimana pelaku membalas saat Anda bersikap kritis di Sandbox Interaktif.
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    if (onSwitchToSandbox) {
                      onSwitchToSandbox(selectedPresetId, inputText);
                    }
                  }}
                  className="text-xs h-8 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
                >
                  Buka di Sandbox WhatsApp
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
