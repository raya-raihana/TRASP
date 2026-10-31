"use client";

import { useState } from "react";
import {
  AlertCircle,
  PhoneCall,
  Copy,
  Check,
  Shield,
  FileText,
  Clock,
  ExternalLink,
  Share2,
  CheckCircle2,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTAINMENT_PLAYBOOKS,
  OFFICIAL_HOTLINES,
  generateIncidentReport
} from "@/lib/trasp/containment-data";
import { useEffect } from "react";
import { InfoHint } from "./info-hint";

const SCENARIO_PRESETS: Record<
  string,
  {
    playbook: string;
    label: string;
    report: {
      victimName: string;
      incidentType: string;
      platform: string;
      scammerContact: string;
      scammerBankDetails: string;
      lossAmount: string;
      chronology: string;
    };
  }
> = {
  "apk-kurir": {
    playbook: "apk-installed",
    label: "Kasus 1: Undangan & Resi Kurir .APK",
    report: {
      victimName: "",
      incidentType: "Penyusupan Malware Berkas .APK (Banking Trojan)",
      platform: "WhatsApp",
      scammerContact: "+62 812-9988-7711 (Kurir J&T Budi Santoso)",
      scammerBankDetails: "BCA 8820-192-331 a.n Rudi",
      lossAmount: "Rp0 (Berhasil diisolasi sebelum saldo terkuras)",
      chronology:
        "Pelaku mengirimkan berkas LIHAT_FOTO_PAKET.apk melalui chat WhatsApp dengan mengaku sebagai kurir ekspedisi untuk mencuri SMS OTP dan izin aksesibilitas."
    }
  },
  "loker-bumn": {
    playbook: "money-transferred",
    label: "Kasus 2: Loker Freelance BUMN (Task Fraud)",
    report: {
      victimName: "",
      incidentType: "Penipuan Lowongan Kerja Deposit (Task Fraud)",
      platform: "Telegram / WhatsApp",
      scammerContact: "+62 857-4433-2211 (HRD Rekrutmen BUMN)",
      scammerBankDetails: "BCA 5410-982-219 a.n Bendahara Task VIP",
      lossAmount: "Rp200.000 (Deposit Awal)",
      chronology:
        "Pelaku menawarkan pekerjaan sampingan like & subscribe YouTube dengan iming-iming komisi harian, lalu mewajibkan transfer deposit awal ke rekening penampung."
    }
  },
  "phishing-pajak": {
    playbook: "otp-compromised",
    label: "Kasus 3: Tagihan Denda Pajak DJP",
    report: {
      victimName: "",
      incidentType: "Phishing Kredensial & Pencatutan Nama Instansi Pemerintah (DJP)",
      platform: "SMS / WhatsApp",
      scammerContact: "+62 821-7788-9900 (Ditjen Pajak RI)",
      scammerBankDetails: "Tautan Palsu: https://djp-pajak.klikbca.pembayaran-denda.top",
      lossAmount: "Kredensial perbankan terancam tereksfiltrasi",
      chronology:
        "Pelaku mengirim ancaman denda pajak progresif dan pemblokiran rekening 1x24 jam, mengarahkan korban mengisi kode OTP pada portal tiruan."
    }
  },
  "m-banking-palsu": {
    playbook: "money-transferred",
    label: "Kasus 4: Bukti Transfer M-Banking Editan",
    report: {
      victimName: "",
      incidentType: "Rekayasa Sosial Kelebihan Transfer (Struk Palsu)",
      platform: "WhatsApp",
      scammerContact: "+62 813-1122-3344 (Pembeli Online Shop)",
      scammerBankDetails: "BCA 8901-234-567 a.n Siti Nurhaliza",
      lossAmount: "Rp1.350.000 (Permintaan pengembalian selisih)",
      chronology:
        "Pelaku mengaku salah transfer nominal uang dengan melampirkan struk m-Banking palsu dan menuntut korban mentransfer balik uang selisih."
    }
  }
};

interface ActContainmentProps {
  initialScenarioId?: string;
}

export function ActContainment({ initialScenarioId = "apk-kurir" }: ActContainmentProps) {
  const initialPreset = SCENARIO_PRESETS[initialScenarioId] || SCENARIO_PRESETS["apk-kurir"];
  const [activeScenarioKey, setActiveScenarioKey] = useState<string>(initialScenarioId);
  const [selectedPlaybookKey, setSelectedPlaybookKey] = useState<string>(initialPreset.playbook);
  const playbook = CONTAINMENT_PLAYBOOKS[selectedPlaybookKey] || CONTAINMENT_PLAYBOOKS["apk-installed"];

  // Checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Report Form state
  const [reportData, setReportData] = useState(initialPreset.report);

  useEffect(() => {
    if (initialScenarioId && SCENARIO_PRESETS[initialScenarioId]) {
      setActiveScenarioKey(initialScenarioId);
      const preset = SCENARIO_PRESETS[initialScenarioId];
      setSelectedPlaybookKey(preset.playbook);
      setReportData(preset.report);
      setCompletedSteps({});
    }
  }, [initialScenarioId]);

  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedVaccine, setCopiedVaccine] = useState(false);

  const toggleStep = (stepTitle: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepTitle]: !prev[stepTitle]
    }));
  };

  const handleCopyReport = () => {
    const formatted = generateIncidentReport(reportData);
    navigator.clipboard.writeText(formatted);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const vaccineText = `*PERINGATAN WASPADA PENIPUAN*\n\nBapak/Ibu/Teman-teman, waspada jika menerima pesan chat dari nomor tidak dikenal dengan modus:\n- Mengirim file berakhiran ".APK" (berdalih Foto Paket, Resi J&T, Surat Undangan, atau Tilang).\n- Menawarkan kerja paruh waktu mudah (like/subscribe YouTube) lalu meminta deposit saldo.\n\n*3 ATURAN UTAMA:*\n1. Jangan pernah membuka file .APK apa pun di WhatsApp.\n2. Bank dan kurir resmi TIDAK PERNAH meminta kode OTP, PIN, atau transfer deposit.\n3. Verifikasi selalu ke kontak resmi perbankan atau portal CekRekening.id.\n\n_Edukasi Keamanan Digital TRASP_`;

  const handleCopyVaccine = () => {
    navigator.clipboard.writeText(vaccineText);
    setCopiedVaccine(true);
    setTimeout(() => setCopiedVaccine(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Auto-Fill Context Banner (Single-Pipeline Integration) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 border border-border text-xs rounded-none">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">
            Alur Terintegrasi:
          </span>
          <span className="text-muted-foreground">
            Formulir &amp; SOP darurat disesuaikan otomatis dari kasus:{" "}
            <strong className="text-foreground">
              {SCENARIO_PRESETS[activeScenarioKey]?.label || "Kasus Kustom"}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Ganti Kasus:</span>
          <select
            value={activeScenarioKey}
            onChange={(e) => {
              const key = e.target.value;
              setActiveScenarioKey(key);
              const p = SCENARIO_PRESETS[key];
              if (p) {
                setSelectedPlaybookKey(p.playbook);
                setReportData(p.report);
                setCompletedSteps({});
              }
            }}
            className="text-xs bg-background border border-border px-2 py-0.5 font-medium text-foreground cursor-pointer rounded-none"
          >
            {Object.entries(SCENARIO_PRESETS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Playbook Header & Selector */}
      <div className="flex items-center justify-between gap-3 bg-muted/40 border border-border px-3.5 py-2 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Kondisi Darurat:</span>
          <InfoHint
            title="Protokol Mitigasi 15 Menit"
            badge="Golden Hours Triage"
            description="Panduan tindakan tanggap darurat berurutan untuk memutus akses peretas, mengamankan saldo bank, dan memulihkan akun."
            howItWorks={[
              "Pilih kondisi darurat Anda (Pasang APK, OTP Bocor, atau Transfer Saldo).",
              "Lakukan tindakan langkah demi langkah secara berurutan dan centang setiap poin yang sudah selesai.",
              "Gunakan draf laporan di panel kanan untuk melapor ke bank dan aparat kepolisian."
            ]}
          />
          <select
            value={selectedPlaybookKey}
            onChange={(e) => {
              setSelectedPlaybookKey(e.target.value);
              setCompletedSteps({});
            }}
            className="text-xs bg-background border border-border rounded px-2.5 py-1 font-medium text-foreground cursor-pointer"
          >
            <option value="apk-installed">Telanjur Pasang File .APK</option>
            <option value="otp-compromised">Telanjur Berikan OTP / PIN</option>
            <option value="money-transferred">Telanjur Transfer Saldo</option>
          </select>
        </div>

        <Badge variant="outline" className="text-rose-500 border-rose-500/30 text-[10px] font-mono">
          Mitigasi 15 Menit
        </Badge>
      </div>

      {/* Main Grid: Steps on Left, Official Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 15-Minute Sequential Checklist (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-serif font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-destructive" />
                  {playbook.title}
                </CardTitle>
                <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/30 text-[10px]">
                  Tingkat Bahaya: {playbook.severity}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {playbook.summary} Centang setiap langkah yang telah selesai Anda lakukan.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {playbook.steps.map((step, idx) => {
                const isChecked = !!completedSteps[step.title];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(step.title)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                        : "bg-card border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-border bg-background"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          {step.minute}
                        </span>
                        <h4 className={`text-xs font-bold leading-tight ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.action}
                      </p>
                      {step.commandOrTip && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Catatan: {step.commandOrTip}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Official Hotline Cards */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                Daftar Panggilan Cepat Call Center Resmi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OFFICIAL_HOTLINES.map((hotline, i) => (
                  <a
                    key={i}
                    href={`tel:${hotline.number}`}
                    className="p-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="text-[11px] font-bold text-foreground">
                      {hotline.name}
                    </div>
                    <div className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      {hotline.number}
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Official Report Form & Vaccine Studio (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Draf Laporan Resmi</span>
                  <InfoHint
                    title="Generator Draf Laporan Resmi"
                    badge="IASC OJK / POLRI"
                    description="Otomatis menyusun format laporan insiden siber yang rapi dan siap disalin untuk mempercepat proses pemblokiran rekening penipu oleh bank atau pelaporan ke kepolisian."
                    howItWorks={[
                      "Sesuaikan data nama korban, kontak penipu, dan rekening tujuan jika ada.",
                      "Klik 'Salin Draf Laporan Resmi'.",
                      "Tempelkan langsung saat menghubungi call center bank, portal aduan.komdigi.go.id, atau patrolisiber.id."
                    ]}
                  />
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  Siap Salin
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Buat draf kronologi kejadian terstruktur untuk mempermudah pemblokiran rekening penipu oleh bank atau OJK.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Kategori Insiden:</label>
                  <Input
                    className="h-8 text-xs font-medium"
                    value={reportData.incidentType}
                    onChange={(e) => setReportData({ ...reportData, incidentType: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Kontak Pelaku (No HP/Username):</label>
                  <Input
                    className="h-8 text-xs font-mono"
                    value={reportData.scammerContact}
                    onChange={(e) => setReportData({ ...reportData, scammerContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Rekening Tujuan Penipu (Jika ada):</label>
                <Input
                  className="h-8 text-xs font-mono"
                  value={reportData.scammerBankDetails}
                  onChange={(e) => setReportData({ ...reportData, scammerBankDetails: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Kronologi Singkat Kejadian:</label>
                <Textarea
                  rows={4}
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
                    Draf Laporan Berhasil Disalin ke Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Salin Draf Laporan Siap Kirim
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Vaksin Grup WA Card */}
          <div className="p-3.5 rounded-md border border-border bg-muted/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-xs font-semibold text-foreground">
                  Draf Peringatan Grup Chat
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px]">Anti Penipuan</Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Draf pesan edukasi ringkas untuk dibagikan ke kerabat atau grup keluarga:
            </p>

            <div className="p-2.5 bg-background border border-border rounded text-[11px] font-mono leading-relaxed whitespace-pre-line text-foreground/90 max-h-36 overflow-y-auto">
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
                  Tersalin ke Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Salin Teks Peringatan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
