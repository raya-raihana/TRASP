"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Scale,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  FileText,
  Sparkles,
  Layers,
  Lock,
  Zap,
  Globe,
  Share2,
  Copy,
  Check
} from "lucide-react";
import {
  IconDeviceMobile,
  IconShieldCheck,
  IconBrandGithub,
  IconAlertTriangle,
  IconReport,
  IconTerminal2
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  COMPENDIUM_CASES,
  EMERGENCY_PROTOCOLS,
  JURIDICAL_ANALYSIS,
  OFFICIAL_AUTHORITY_LINKS,
  ScamCaseItem
} from "@/lib/trasp/compendium-data";

export default function CompendiumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"katalog" | "protokol" | "yuridis" | "referensi">("katalog");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "ALL", label: "Semua Modus" },
    { id: "Penipuan Aplikasi Ponsel", label: "Aplikasi Palsu (.APK)" },
    { id: "Penipuan Halaman Website", label: "Situs Tiruan" },
    { id: "Penipuan Tawaran Kerja", label: "Lowongan Kerja Palsu" },
    { id: "Penipuan Pesan Singkat (SMS)", label: "SMS Catut Bank" },
    { id: "Pencurian Akun Percakapan", label: "Begal WhatsApp & Barcode" },
    { id: "Penipuan Rekayasa Suara AI", label: "Kloning Suara AI" }
  ];

  const filteredCases = COMPENDIUM_CASES.filter((c) => {
    const matchesCategory = selectedCategory === "ALL" || c.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.modusOperandi.toLowerCase().includes(q) ||
      c.realCasesIndonesia.toLowerCase().includes(q) ||
      c.psychologicalBiases.some((b) => b.biasName.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali</span>
          </Link>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm tracking-tight text-foreground">
              TRASP Kompendium
            </span>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-mono border-primary/40 text-primary">
              Riset Otoritas & Jurnal Ilmiah
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="hidden md:inline-flex text-[10px] border-border text-muted-foreground font-mono items-center gap-1"
          >
            <IconShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Terverifikasi Regulasi RI
          </Badge>
          <a
            href="https://github.com/raya-raihana/TRASP"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <IconBrandGithub className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Hero Section */}
        <div className="border border-border bg-muted/20 p-5 md:p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge className="bg-primary text-primary-foreground font-mono text-[11px] rounded-none">
              DOKUMEN RISET
            </Badge>
          </div>

          <h1 className="text-xl md:text-3xl font-serif font-black tracking-tight text-foreground">
            Kompendium Forensik Digital
          </h1>

        </div>

        {/* Statistical Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 border border-border bg-card">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Total Laporan
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-primary mt-1">405.000+</div>
          </div>

          <div className="p-3.5 border border-border bg-card">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Kerugian Finansial
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-rose-500 mt-1">Rp700 Miliar</div>
          </div>

          <div className="p-3.5 border border-border bg-card">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Rekening Diblokir
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-emerald-500 mt-1">33.857 Akun</div>
          </div>

          <div className="p-3.5 border border-border bg-card">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Golden Time
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-amber-500 mt-1">15–30 Menit</div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="border-b border-border flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("katalog")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "katalog"
                  ? "border-primary text-foreground bg-muted/30"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Katalog Kasus</span>
            </button>

            <button
              onClick={() => setActiveTab("protokol")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "protokol"
                  ? "border-primary text-foreground bg-muted/30"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Protokol Darurat</span>
            </button>

            <button
              onClick={() => setActiveTab("yuridis")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "yuridis"
                  ? "border-primary text-foreground bg-muted/30"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-500" />
              <span>Tinjauan Yuridis</span>
            </button>

            <button
              onClick={() => setActiveTab("referensi")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "referensi"
                  ? "border-primary text-foreground bg-muted/30"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Daftar Pustaka</span>
            </button>
          </div>
        </div>

        {/* TAB 1: KATALOG 6 KASUS RIIL */}
        {activeTab === "katalog" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kasus, modus, atau kata kunci (contoh: Coretax, APK, Deepfake, OJK, SMS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9 rounded-none border-border"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-none text-[11px] font-medium border whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-foreground text-background border-foreground font-bold"
                        : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Case Cards */}
            <div className="space-y-4">
              {filteredCases.length === 0 ? (
                <div className="p-8 border border-border text-center space-y-2">
                  <p className="text-sm font-semibold text-foreground">Tidak ditemukan kasus yang cocok</p>
                  <p className="text-xs text-muted-foreground">Silakan ubah kata kunci pencarian atau kategori filter Anda.</p>
                </div>
              ) : (
                filteredCases.map((item) => (
                  <Card key={item.id} className="border-border shadow-none rounded-none overflow-hidden">
                    <CardHeader className="bg-muted/20 border-b border-border pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-mono border-border ${
                                item.riskLevel === "CRITICAL"
                                  ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                                  : "border-amber-500/40 text-amber-500 bg-amber-500/10"
                              }`}
                            >
                              TINGKAT BAHAYA: {item.riskLevel} ({item.dangerScore}/100)
                            </Badge>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              Kategori: {item.category}
                            </span>
                          </div>
                          <CardTitle className="text-base font-serif font-bold text-foreground">
                            {item.title}
                          </CardTitle>
                        </div>

                        {item.workbenchPresetId && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 border-border hover:bg-primary hover:text-primary-foreground shrink-0 cursor-pointer"
                          >
                            <Link href={`/?tool=recognize&preset=${item.workbenchPresetId}`}>
                              <Sparkles className="w-3 h-3 mr-1" />
                              Workbench
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 md:p-5 space-y-4 text-xs">
                      {/* Modus Operandi & Karakteristik */}
                      <div className="space-y-2">
                        <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Modus Operandi & Karakteristik Taktik Penipu:</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-5">
                          {item.modusOperandi}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-5">
                          {item.characteristics.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Eksploitasi Bias Psikologis */}
                      <div className="p-3 bg-muted/30 border border-border space-y-2">
                        <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          <span>Celah Bias Psikologis yang Dieksploitasi:</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                          {item.psychologicalBiases.map((b, idx) => (
                            <div key={idx} className="space-y-0.5">
                              <span className="font-semibold text-foreground text-[11px]">
                                • {b.biasName}:
                              </span>
                              <p className="text-[11px] text-muted-foreground leading-normal">
                                {b.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bukti Kasus Riil & Sumber Otoritas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border">
                        <div className="space-y-1">
                          <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            Bukti Kasus Riil di Indonesia:
                          </span>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {item.realCasesIndonesia}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-foreground text-[11px] flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5 text-slate-400" />
                            Pasal Pidana & Dasar Hukum:
                          </span>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            {item.legalClauses}
                          </p>
                        </div>
                      </div>

                      {/* Langkah Darurat Singkat */}
                      <div className="p-3 bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                        <div className="text-[11px] font-bold text-rose-500 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                            Tindakan Tangkal Cepat:
                          </span>
                          <button
                            onClick={() =>
                              handleCopyText(
                                item.emergencyActionSteps.join("\n"),
                                item.id
                              )
                            }
                            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                        <ul className="list-decimal list-inside space-y-0.5 text-[11px] text-muted-foreground">
                          {item.emergencyActionSteps.map((st, sIdx) => (
                            <li key={sIdx}>{st}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROTOKOL DARURAT RESMI (GOLDEN TIME) */}
        {activeTab === "protokol" && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-500 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Konsep Golden Time (15–30 Menit)
              </h3>
            </div>

            {/* Sub-protokol Teknis APK */}
            <Card className="border-border shadow-none rounded-none">
              <CardHeader className="bg-muted/20 border-b border-border py-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <IconDeviceMobile className="w-4 h-4 text-primary" />
                  {EMERGENCY_PROTOCOLS.technical.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {EMERGENCY_PROTOCOLS.technical.steps.map((st) => (
                  <div key={st.step} className="flex items-center gap-3 p-2.5 border border-border bg-card">
                    <span className="flex items-center justify-center h-5 w-5 rounded-none bg-primary text-primary-foreground font-mono font-bold text-xs shrink-0">
                      {st.step}
                    </span>
                    <div className="font-bold text-xs text-foreground">{st.title}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sub-protokol Finansial */}
            <Card className="border-border shadow-none rounded-none">
              <CardHeader className="bg-muted/20 border-b border-border py-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  {EMERGENCY_PROTOCOLS.financial.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {EMERGENCY_PROTOCOLS.financial.steps.map((st) => (
                  <div key={st.step} className="flex items-center gap-3 p-2.5 border border-border bg-card">
                    <span className="flex items-center justify-center h-5 w-5 rounded-none bg-rose-600 text-white font-mono font-bold text-xs shrink-0">
                      {st.step}
                    </span>
                    <div className="font-bold text-xs text-foreground">{st.title}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prosedur Pelaporan Kepolisian */}
            <Card className="border-border shadow-none rounded-none">
              <CardHeader className="bg-muted/20 border-b border-border py-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-500" />
                  {EMERGENCY_PROTOCOLS.policeReport.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {EMERGENCY_PROTOCOLS.policeReport.steps.map((st) => (
                  <div key={st.step} className="flex items-center gap-3 p-2.5 border border-border bg-card">
                    <span className="flex items-center justify-center h-5 w-5 rounded-none bg-blue-600 text-white font-mono font-bold text-xs shrink-0">
                      {st.step}
                    </span>
                    <div className="font-bold text-xs text-foreground">{st.title}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: TINJAUAN YURIDIS & KENDALA FORENSIK */}
        {activeTab === "yuridis" && (
          <div className="space-y-6">
            <div className="p-4 bg-muted/30 border border-border space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 font-serif">
                <Scale className="w-4 h-4 text-primary" />
                Matriks Regulasi & Payung Hukum Penipuan Siber Indonesia (2024–2026)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Penanganan kejahatan siber di Indonesia menggunakan asas <em>Lex Specialis Derogat Legi Generali</em>, di mana tindak pidana transaksi elektronik diadili menggunakan UU ITE Terbaru No. 1/2024 dan UU TPPU, didukung regulasi penundaan transaksi POJK No. 22/2023.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-blue-500/40 text-blue-500">
                  LEX GENERALI (PIDANA UMUM)
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.lexGenerali.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.lexGenerali.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-500">
                  LEX SPECIALIS (UU ITE UTAMA)
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.lexSpecialis.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.lexSpecialis.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-rose-500/40 text-rose-500">
                  AKSES ILEGAL / MALWARE
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.illegalAccess.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.illegalAccess.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-purple-500/40 text-purple-500">
                  INTERSEPSI DATA / SADAP OTP
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.dataInterception.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.dataInterception.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-500">
                  PEMALSUAN DOKUMEN / PHISHING
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.dataForgery.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.dataForgery.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/40 text-cyan-500">
                  REKENING PENAMPUNG / MULE
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.moneyLaundering.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.moneyLaundering.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-500">
                  REGULASI PERBANKAN & IASC
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.bankingRegulation.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.bankingRegulation.desc}
                </p>
              </div>

              <div className="p-4 border border-border bg-card space-y-2">
                <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/40 text-indigo-500">
                  PELINDUNGAN DATA PRIBADI
                </Badge>
                <h4 className="text-sm font-bold text-foreground font-serif">
                  {JURIDICAL_ANALYSIS.privacyLaw.article}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {JURIDICAL_ANALYSIS.privacyLaw.desc}
                </p>
              </div>
            </div>

            {/* 4 Kendala Pembuktian */}
            <Card className="border-border shadow-none rounded-none">
              <CardHeader className="bg-muted/20 border-b border-border py-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  4 Kendala Utama Pembuktian Forensik Digital di Indonesia
                </CardTitle>
                <CardDescription className="text-xs">
                  Tantangan teknis dan yuridis yang dihadapi penyelidik siber serta alasan mengapa TRASP dirancang untuk deteksi dini.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {JURIDICAL_ANALYSIS.forensicChallenges.map((ch, idx) => (
                  <div key={idx} className="p-3.5 border border-border bg-card text-xs space-y-1.5">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span className="flex items-center justify-center h-5 w-5 rounded-none bg-primary text-primary-foreground font-mono font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{ch.title}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed pl-6.5">
                      {ch.desc}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: DAFTAR PUSTAKA & KANAL RESMI */}
        {activeTab === "referensi" && (
          <div className="space-y-4">
            <div className="p-3 border border-border bg-muted/20">
              <h3 className="text-sm font-bold text-foreground font-serif">
                Daftar Referensi &amp; Portal
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OFFICIAL_AUTHORITY_LINKS.map((link, idx) => (
                <div key={idx} className="p-4 border border-border bg-card space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-foreground flex items-center justify-between">
                      <span>{link.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="font-mono text-[11px] text-primary">{link.portal}</div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                    >
                      <span>Portal Resmi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
