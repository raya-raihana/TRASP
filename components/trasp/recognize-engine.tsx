"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ExternalLink,
  AlertOctagon,
  ArrowRight,
  Layers,
  Link as LinkIcon,
  FileText,
  Shield,
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
  }, [initialPresetId, selectedPresetId]);

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

  const getRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return "text-rose-600 dark:text-rose-400 border-border bg-muted/30";
      case "MEDIUM":
        return "text-amber-600 dark:text-amber-400 border-border bg-muted/30";
      case "LOW":
        return "text-emerald-600 dark:text-emerald-400 border-border bg-muted/30";
    }
  };

  return (
    <div className="space-y-4">
      {/* Sleek Preset Pills (1 Clean Line) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted-foreground font-medium text-[11px] mr-1">Sampel Kasus:</span>
        {PRESET_CASES.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                isSelected
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              }`}
            >
              {preset.title.replace(/^Kasus \d+:\s*/, "")}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Input on Left, Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Input Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <Card className="border-border">
            <CardHeader className="py-3 px-4 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-500" />
                  Input Pesan &amp; Tautan
                </CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">Lokal (On-Device)</span>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <Tabs value={activeInputTab} onValueChange={(val) => setActiveInputTab(val as any)}>
                <TabsList className="grid grid-cols-3 w-full h-8 mb-2">
                  <TabsTrigger value="text" className="text-xs">
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Teks
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-xs">
                    <LinkIcon className="w-3.5 h-3.5 mr-1" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="canvas" className="text-xs">
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    Gambar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-2 mt-0">
                  <Textarea
                    rows={7}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tempel pesan mencurigakan di sini..."
                    className="text-xs font-mono resize-none leading-relaxed"
                  />
                </TabsContent>

                <TabsContent value="url" className="space-y-2 mt-0">
                  <Input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://contoh-tautan-curiga.com/..."
                    className="text-xs font-mono h-9"
                  />
                </TabsContent>

                <TabsContent value="canvas" className="mt-0">
                  <CanvasRedactor />
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleRunAnalysis}
                className="w-full text-xs h-9 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Periksa Indikator Forensik
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Forensic Results Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border overflow-hidden">
            <div className={`p-3.5 border-b flex items-center justify-between gap-3 ${getRiskColor(analysisResult.riskLevel)}`}>
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span className="font-bold text-sm">
                  {analysisResult.statusLabel}
                </span>
              </div>
              <div className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-background/80 border border-border">
                Skor: {analysisResult.riskScore}/100
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-2.5 rounded-md border border-border">
                {analysisResult.summary}
              </p>

              {/* Threat Vectors */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    Vektor Heuristik
                  </span>
                  <span>Intensitas</span>
                </div>

                <div className="space-y-2">
                  {analysisResult.vectors.map((vec) => (
                    <div key={vec.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{vec.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{vec.score}%</span>
                      </div>
                      <Progress
                        value={vec.score}
                        className="h-1.5"
                      />
                      {vec.detectedClues.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {vec.detectedClues.map((clue, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-1 py-0 font-mono text-muted-foreground border-border">
                              {clue}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* URL Deconstruction */}
              {analysisResult.urlAnalysis && analysisResult.urlAnalysis.isValid && (
                <div className="p-3 rounded-md border border-border bg-slate-950 text-slate-100 font-mono text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Deconstructor Domain</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <div><span className="text-muted-foreground">Domain Pemilik:</span> <span className="text-amber-300 font-semibold">{analysisResult.urlAnalysis.rootDomain}</span></div>
                    {analysisResult.urlAnalysis.subdomain && (
                      <div><span className="text-muted-foreground">Subdomain:</span> <span className={analysisResult.urlAnalysis.isSpoofedSubdomain ? "text-rose-400 font-bold" : ""}>{analysisResult.urlAnalysis.subdomain}</span></div>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-200/90 pt-1 border-t border-slate-800">
                    {analysisResult.urlAnalysis.explanation}
                  </p>
                </div>
              )}

              {/* Safe Action CTA */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/40 border border-border">
                <span className="text-xs text-muted-foreground">
                  Ingin melihat bagaimana pelaku memanipulasi target?
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (onSwitchToSandbox) {
                      onSwitchToSandbox(selectedPresetId, inputText);
                    }
                  }}
                  className="text-xs h-8 shrink-0 cursor-pointer"
                >
                  Uji di Sandbox
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
