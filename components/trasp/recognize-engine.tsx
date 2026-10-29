"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Layers,
  Zap,
  Link as LinkIcon,
  FileText,
  Shield,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

interface RecognizeEngineProps {
  initialPresetId?: string;
  onSwitchToSandbox?: (caseId: string, customMessage?: string) => void;
}

export function RecognizeEngine({ initialPresetId = "apk-kurir", onSwitchToSandbox }: RecognizeEngineProps) {
  const [activeInputTab, setActiveInputTab] = useState<"text" | "url" | "canvas">("text");
  
  const defaultPreset = PRESET_CASES.find((p) => p.id === initialPresetId) || PRESET_CASES[0];
  const [inputText, setInputText] = useState(defaultPreset.rawText);
  const [inputUrl, setInputUrl] = useState(defaultPreset.rawUrl || "");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [analysisResult, setAnalysisResult] = useState<ForensicResult>(() =>
    analyzeForensics(defaultPreset.rawText, defaultPreset.rawUrl)
  );

  useEffect(() => {
    if (initialPresetId && initialPresetId !== selectedPresetId) {
      const p = PRESET_CASES.find((c) => c.id === initialPresetId);
      if (p) {
        setSelectedPresetId(p.id);
        setInputText(p.rawText);
        setInputUrl(p.rawUrl || "");
        setAnalysisResult(analyzeForensics(p.rawText, p.rawUrl));
      }
    }
  }, [initialPresetId]);

  const handleSelectPreset = (preset: PresetCase) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.rawText);
    setInputUrl(preset.rawUrl || "");
    const res = analyzeForensics(preset.rawText, preset.rawUrl);
    setAnalysisResult(res);
  };

  const handleRunAnalysis = () => {
    const textToAnalyze = activeInputTab === "url" ? inputUrl : inputText;
    const res = analyzeForensics(textToAnalyze, inputUrl);
    setAnalysisResult(res);
  };

  const getRiskBadgeColor = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40";
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40";
      case "LOW":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
    }
  };

  return (
    <div className="space-y-8">
      {/* 4 Preset Demo Bar (Alur 60 Detik Juri) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Alur Cepat Juri: Pilih Skenario Sampel Penipuan Nyata
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">1-Klik Analisis Cepat</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CASES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 text-left rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/30"
                    : "border-border hover:border-muted-foreground/40 bg-card hover:bg-muted/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium border-border">
                      {preset.tag}
                    </Badge>
                    {isSelected && <span className="text-xs text-emerald-500 font-bold">● Aktif</span>}
                  </div>
                  <h4 className="text-xs font-bold text-foreground leading-snug mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {preset.scenarioDescription}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Workbench & Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-500" />
                  Forensic Input Terminal
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  Client-Side Engine
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Masukkan teks chat yang mencurigakan, link URL, atau gunakan sensor gambar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              <Tabs value={activeInputTab} onValueChange={(val) => setActiveInputTab(val as any)}>
                <TabsList className="grid grid-cols-3 w-full h-8 mb-3">
                  <TabsTrigger value="text" className="text-xs">
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    Teks Chat
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-xs">
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                    Tautan URL
                  </TabsTrigger>
                  <TabsTrigger value="canvas" className="text-xs">
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Sensor Gambar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-3 mt-0">
                  <Textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel (paste) isi pesan mencurigakan dari WhatsApp, Telegram, atau SMS di sini..."
                    className="text-xs font-mono resize-none leading-relaxed"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-3 mt-0">
                  <Input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://contoh-link-penipu.xyz/login"
                    className="text-xs font-mono h-10"
                  />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sistem akan membedah anatomi domain, mendeteksi penipuan subdomain (subdomain spoofing), dan memeriksa ekstensi TLD mencurigakan.
                  </p>
                </TabsContent>

                <TabsContent value="canvas" className="mt-0">
                  <CanvasRedactor />
                </TabsContent>
              </Tabs>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  onClick={handleRunAnalysis}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-xs"
                >
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  Jalankan Forensik Multi-Vektor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Context Card */}
          <div className="p-3.5 rounded-lg border border-dashed border-border bg-muted/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Normalizer Linguistik Aktif:
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Mendeteksi otomatis trik tipuan <em>leetspeak</em> (seperti angka &amp; spasi samaran: <code>d4p4tk4n</code>, <code>t.e.l.e.g.r.a.m</code>) sebelum evaluasi dilakukan.
            </p>
          </div>
        </div>

        {/* Right Column: Forensic Results Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Risk Score Card */}
          <Card className="border-border shadow-xs overflow-hidden">
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${getRiskBadgeColor(analysisResult.riskLevel)}`}>
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                    {analysisResult.statusLabel}
                  </h3>
                  <p className="text-xs opacity-90">
                    Berdasarkan Akumulasi Skor 5 Vektor Heuristik
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 bg-background/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-border">
                <span className="text-xl font-mono font-black text-foreground">
                  {analysisResult.riskScore}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">/100</span>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              <p className="text-xs text-foreground/90 leading-relaxed font-medium bg-muted/30 p-3 rounded-lg border border-border">
                {analysisResult.summary}
              </p>

              {/* 5 Threat Vectors Radar Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    Analisis 5 Vektor Manipulasi:
                  </span>
                  <span>Intensitas Ancaman</span>
                </div>

                <div className="space-y-2.5">
                  {analysisResult.vectors.map((vec) => (
                    <div key={vec.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {vec.name}
                        </span>
                        <span className="font-mono text-[11px] font-bold">
                          {vec.score}%
                        </span>
                      </div>
                      <Progress
                        value={vec.score}
                        className={`h-2 ${
                          vec.score >= 60
                            ? "[&>div]:bg-rose-500"
                            : vec.score >= 30
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-emerald-500"
                        }`}
                      />
                      {vec.detectedClues.length > 0 && (
                        <p className="text-[10px] text-muted-foreground italic">
                          Kata/pola terdeteksi: {vec.detectedClues.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Deconstruction Box (if present) */}
              {analysisResult.urlAnalysis && analysisResult.urlAnalysis.isValid && (
                <div className="p-3.5 rounded-lg border border-border bg-slate-950 text-slate-100 space-y-2 font-mono text-xs">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>URL Structural Deconstructor</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="space-y-1 pt-1 break-all text-[11px]">
                    <div><span className="text-muted-foreground">Protokol:</span> {analysisResult.urlAnalysis.protocol}</div>
                    {analysisResult.urlAnalysis.subdomain && (
                      <div>
                        <span className="text-muted-foreground">Subdomain:</span>{" "}
                        <span className={analysisResult.urlAnalysis.isSpoofedSubdomain ? "text-rose-400 font-bold bg-rose-950/60 px-1 rounded" : ""}>
                          {analysisResult.urlAnalysis.subdomain}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Domain Pemilik Asli:</span>{" "}
                      <span className="text-amber-300 font-bold underline">
                        {analysisResult.urlAnalysis.rootDomain}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-200/90 pt-1 border-t border-slate-800">
                    💡 {analysisResult.urlAnalysis.explanation}
                  </p>
                </div>
              )}

              {/* Safe Action CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-lg">
                <div className="text-xs">
                  <div className="font-bold text-foreground">
                    Penasaran bagaimana isi kepala penipu ini?
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    Uji ketahanan mental dan lihat strategi real-time di simulator.
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (onSwitchToSandbox) {
                      onSwitchToSandbox(selectedPresetId, inputText);
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shrink-0 shadow-xs cursor-pointer"
                >
                  Masuk ke Simulator Sandbox
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
