"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Shield,
  RotateCcw,
  Send,
  Zap,
  Heart,
  Swords,
  Crosshair,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Flame,
  Award,
  ArrowLeft,
  ChevronRight,
  Gamepad2,
  Play,
  Lock,
  Unlock,
  HelpCircle,
  Timer,
  Skull,
  Radio,
  Layers,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  SANDBOX_SCENARIOS,
  matchCustomUserReply,
} from "@/lib/trasp/sandbox-data";

interface LearnSandboxProps {
  initialScenarioId?: string;
  onSwitchToAct?: (scenarioId?: string) => void;
}

interface GameChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  delta?: number;
}

export interface GameLevel {
  id: string;
  levelNumber: number;
  sectorId: 1 | 2 | 3;
  sectorName: string;
  title: string;
  category: string;
  type: "battle" | "quiz" | "drill" | "boss";
  bossName: string;
  targetName: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  diffColor: string;
  icon: string;
  xp: string;
  xpNumber: number;
  synopsis: string;
  objective: string;
  tags: string[];
  status?: "completed" | "active" | "locked";
  score?: number;
  reqXp?: number;
  xPct: number;
  yPct: number;
}

export interface ModeProgress {
  completedLevels: string[];
  currentLevel: number;
  xp: number;
}

export interface UserProgressState {
  defense: ModeProgress;
  offense: ModeProgress;
}

export const DEFAULT_PROGRESS: UserProgressState = {
  defense: {
    completedLevels: ["apk-kurir"],
    currentLevel: 2,
    xp: 100,
  },
  offense: {
    completedLevels: [],
    currentLevel: 1,
    xp: 0,
  },
};

export const DEFENSE_LEVELS: GameLevel[] = [
  // SEKTOR 1: SOCIAL ENGINEERING & INFILTRATION
  {
    id: "apk-kurir",
    levelNumber: 1,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Undangan & Resi Kurir .APK",
    category: "Android Malware / Banking Trojan",
    type: "battle",
    bossName: "Kurir J&T Palsu",
    targetName: "Warga Biasa",
    difficulty: "Easy",
    diffColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    icon: "📦",
    xp: "+100 XP",
    xpNumber: 100,
    synopsis: "Berkas LIHAT_FOTO_PAKET.apk disamarkan sebagai foto resi untuk menyusupkan trojan penyadap SMS OTP m-Banking.",
    objective: "Pertahankan HP di atas 50% dengan menolak instalasi file APK liar dan mintalah nomor resi resmi.",
    tags: ["Trojan Dropper", "Sadap OTP SMS", "Urgensi 2 Jam"],
    score: 95,
    xPct: 26,
    yPct: 5,
  },
  {
    id: "undangan-nikah",
    levelNumber: 2,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Undangan Pernikahan .APK",
    category: "Curiosity Trap / Sideloading",
    type: "battle",
    bossName: "Kerabat Palsu",
    targetName: "Penerima Undangan",
    difficulty: "Easy",
    diffColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    icon: "💌",
    xp: "+150 XP",
    xpNumber: 150,
    synopsis: "Eksploitasi rasa sungkan dan penasaran via berkas Surat_Undangan_Pernikahan.apk di WhatsApp.",
    objective: "Identifikasi kejanggalan ekstensi dan tolak unduhan di luar Google Play Store.",
    tags: ["Curiosity Bias", "Undangan Digital", "Malware Android"],
    xPct: 74,
    yPct: 14,
  },
  {
    id: "checkpoint-quiz-1",
    levelNumber: 3,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Mini-Quiz: Izin Aksesibilitas",
    category: "Forensic Knowledge Checkpoint",
    type: "quiz",
    bossName: "Evaluator BSSN",
    targetName: "Analis Forensik",
    difficulty: "Medium",
    diffColor: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
    icon: "📝",
    xp: "+100 XP",
    xpNumber: 100,
    synopsis: "Checkpoint taktis: uji pemahaman dalam mendeteksi penyalahgunaan Android Accessibility Service oleh malware perbankan.",
    objective: "Selesaikan 3 soal evaluasi teknis izin sistem dengan skor sempurna.",
    tags: ["Checkpoint Quiz", "Accessibility Tree", "Play Protect"],
    xPct: 34,
    yPct: 23,
  },
  {
    id: "tilang-etle",
    levelNumber: 4,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Boss Sektor 1: Tilang ETLE Polri",
    category: "Authority Coercion / Boss Battle",
    type: "boss",
    bossName: "Sindikat ETLE Palsu",
    targetName: "Pemilik Kendaraan",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "🚔",
    xp: "+300 XP",
    xpNumber: 300,
    synopsis: "Manipulasi ketakutan denda tilang kendaraan bermotor disertai ancaman pemblokiran STNK oleh pihak kepolisian.",
    objective: "Klarifikasi prosedur resmi tilang digital dan tolak membuka berkas APK Surat_Tilang.",
    tags: ["Boss Battle Sektor 1", "Intimidasi Otoritas", "ETLE Palsu"],
    reqXp: 300,
    xPct: 76,
    yPct: 32,
  },
  // SEKTOR 2: NETWORK & PHISHING
  {
    id: "loker-bumn",
    levelNumber: 5,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Task Scam & Ponzi Like Video",
    category: "Advance Fee / Task Fraud",
    type: "battle",
    bossName: "HR BUMN Palsu",
    targetName: "Pencari Kerja Freelance",
    difficulty: "Medium",
    diffColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    icon: "💼",
    xp: "+200 XP",
    xpNumber: 200,
    synopsis: "Iming-iming gaji freelance like video TikTok ratusan ribu berujung jebakan deposit modal bertingkat.",
    objective: "Patahkan janji manis komisi dan tolak menyetorkan uang deposit sepeser pun.",
    tags: ["Tugas Freelance", "Deposit Ponzi", "Grup Telegram"],
    reqXp: 450,
    xPct: 28,
    yPct: 42,
  },
  {
    id: "phishing-pajak",
    levelNumber: 6,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Phishing DJP Coretax & Denda",
    category: "Typosquatting & Credential Harvester",
    type: "battle",
    bossName: "Petugas Pajak Gadungan",
    targetName: "Wajib Pajak Pribadi",
    difficulty: "Medium",
    diffColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    icon: "🏛️",
    xp: "+250 XP",
    xpNumber: 250,
    synopsis: "Domain palsu mirip portal pajak resmi untuk memanen NIK, kata sandi DJP, dan nomor rekening wajib pajak.",
    objective: "Identifikasi anomali domain dan tolak memasukkan NIK atau nomor rekening pada portal tiruan.",
    tags: ["Domain Spoofing", "Pencurian Kredensial", "UU PDP"],
    reqXp: 650,
    xPct: 72,
    yPct: 51,
  },
  {
    id: "checkpoint-drill-2",
    levelNumber: 7,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Timed Incident Drill: 15-Menit Air-Gap",
    category: "Incident Response Simulation",
    type: "drill",
    bossName: "Security Incident Commander",
    targetName: "Korban Terinfeksi",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "⏱️",
    xp: "+150 XP",
    xpNumber: 150,
    synopsis: "Simulasi darurat cepat: korban tanpa sengaja mengklik berkas APK. Eksekusi 3 SOP penahanan insiden dalam 15 menit.",
    objective: "Centang 3 tindakan darurat isolasi perangkat dan kontak perbankan secara urut.",
    tags: ["Speed Drill", "Air-Gap Protocol", "OJK IASC"],
    reqXp: 800,
    xPct: 30,
    yPct: 60,
  },
  {
    id: "sms-perbankan",
    levelNumber: 8,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Boss Sektor 2: SMS Masking Tarif Bank",
    category: "Sender ID Spoofing / Banking Phishing",
    type: "boss",
    bossName: "Operator Spoofing Bank",
    targetName: "Nasabah Tabungan",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "🏦",
    xp: "+400 XP",
    xpNumber: 400,
    synopsis: "Pencegatan SMS dengan identitas pengirim resmi bank yang menyatakan kenaikan tarif transfer menjadi Rp150.000/bulan.",
    objective: "Patahkan manipulasi kenaikan tarif dan tolak mengklik tautan pembatalan fiktif.",
    tags: ["Boss Battle Sektor 2", "SMS Masking", "Begal OTP"],
    reqXp: 950,
    xPct: 75,
    yPct: 70,
  },
  // SEKTOR 3: ADVANCED DEEPFAKE & AI FRAUD
  {
    id: "quishing-qris",
    levelNumber: 9,
    sectorId: 3,
    sectorName: "Sektor 3: Advanced Deepfake",
    title: "Quishing QRIS & Begal Akun WA",
    category: "QR Tampering / Account Takeover",
    type: "battle",
    bossName: "Kasir Minimarket Palsu",
    targetName: "Pengguna WhatsApp",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "📱",
    xp: "+350 XP",
    xpNumber: 350,
    synopsis: "Manipulasi belas kasihan salah kirim voucher pulsa demi membegal 6 digit kode autentikasi WhatsApp.",
    objective: "Tolak menyerahkan 6 digit kode verifikasi dan pertahankan kendali akun Anda.",
    tags: ["Account Takeover", "Quishing QRIS", "Verifikasi 2FA"],
    reqXp: 1200,
    xPct: 28,
    yPct: 80,
  },
  {
    id: "deepfake-bos",
    levelNumber: 10,
    sectorId: 3,
    sectorName: "Sektor 3: Advanced Deepfake",
    title: "Final Boss: AI Voice Cloning Pimpinan",
    category: "Generative AI Audio Spoofing / CEO Fraud",
    type: "boss",
    bossName: "Sindikat AI Deepfake Vishing",
    targetName: "Staf Keuangan Kantor",
    difficulty: "Insane",
    diffColor: "text-red-500 border-red-500/50 bg-red-950/50",
    icon: "🎙️",
    xp: "+500 XP",
    xpNumber: 500,
    synopsis: "Panggilan telepon suara tiruan pimpinan perusahaan yang menginstruksikan transfer darurat Rp25 juta.",
    objective: "Tegakkan integritas SOP keuangan kantor dan tolak intimidasi pimpinan palsu berbasis AI.",
    tags: ["Final Boss Battle", "AI Voice Clone", "CEO Fraud"],
    reqXp: 1500,
    xPct: 72,
    yPct: 89,
  },
];

export const OFFENSE_LEVELS: GameLevel[] = [
  // SEKTOR 1: ADVERSARY INFILTRATION & DELIVERY
  {
    id: "rt-kurir-apk",
    levelNumber: 1,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Dropper Pretexting Resi .APK",
    category: "Adversary Payload Delivery",
    type: "battle",
    bossName: "Lead Red Team Specialist",
    targetName: "Penerima Paket Ekspedisi",
    difficulty: "Easy",
    diffColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    icon: "📦",
    xp: "+100 XP",
    xpNumber: 100,
    synopsis: "Rancang skenario kurir paket tertahan untuk menguji tingkat kewaspadaan target mengunduh installer APK.",
    objective: "Turunkan skeptisisme target hingga di bawah 30% dengan alasan paket darurat tanpa membuat target curiga.",
    tags: ["Pretexting", "Social Engineering", "Dropper Simulation"],
    score: 90,
    xPct: 26,
    yPct: 5,
  },
  {
    id: "rt-undangan-nikah",
    levelNumber: 2,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Pretexting Undangan Resepsi",
    category: "Social Engineering Engagement",
    type: "battle",
    bossName: "Red Team Infiltrator",
    targetName: "Kontak Personal Target",
    difficulty: "Easy",
    diffColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    icon: "💌",
    xp: "+150 XP",
    xpNumber: 150,
    synopsis: "Bangun komunikasi emosional kekeluargaan yang santun untuk menguji respon penerima terhadap lampiran digital.",
    objective: "Bangkitkan rasa penasaran target agar bersedia membuka berkas undangan tanpa mempertanyakan ekstensi.",
    tags: ["Emotional Hook", "Curiosity Lure", "Engagement"],
    xPct: 74,
    yPct: 14,
  },
  {
    id: "rt-checkpoint-quiz-1",
    levelNumber: 3,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Red Team Drill: Evasion AV & Play Protect",
    category: "Adversary Knowledge Checkpoint",
    type: "quiz",
    bossName: "Instruktur Red Team",
    targetName: "Red Team Operator",
    difficulty: "Medium",
    diffColor: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
    icon: "📝",
    xp: "+100 XP",
    xpNumber: 100,
    synopsis: "Uji pemahaman taktik evasi: bagaimana malware modern membypass deteksi signature antivirus & Google Play Protect.",
    objective: "Selesaikan 3 pertanyaan evaluasi teknik penetrasi siber dengan skor maksimal.",
    tags: ["AV Evasion", "Obfuscation", "Signature Bypass"],
    xPct: 34,
    yPct: 23,
  },
  {
    id: "rt-tilang-etle",
    levelNumber: 4,
    sectorId: 1,
    sectorName: "Sektor 1: Social Engineering",
    title: "Boss Sektor 1: Authority Coercion (ETLE)",
    category: "Authority Impersonation / Boss Battle",
    type: "boss",
    bossName: "Senior Red Team Adversary",
    targetName: "Pelanggar Lalu Lintas",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "🚔",
    xp: "+300 XP",
    xpNumber: 300,
    synopsis: "Simulasikan persona penegak hukum untuk menguji ketahanan mental target terhadap ancaman pembekuan izin berkendara.",
    objective: "Eksploitasi bias kepatuhan target melalui format pemberitahuan tilang resmi berbatas waktu.",
    tags: ["Boss Battle Sektor 1", "Authority Bias", "Stress Induction"],
    reqXp: 300,
    xPct: 76,
    yPct: 32,
  },
  // SEKTOR 2: CREDENTIAL HARVESTER & LATERAL MOVEMENT
  {
    id: "rt-task-scam",
    levelNumber: 5,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Task Scam Baiting & Funneling",
    category: "Financial Incentive Engineering",
    type: "battle",
    bossName: "Social Engineer Specialist",
    targetName: "Pencari Kerja Freelance",
    difficulty: "Medium",
    diffColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    icon: "💼",
    xp: "+200 XP",
    xpNumber: 200,
    synopsis: "Susun alur umpan komisi mikro bertahap untuk memandu target masuk ke grup komunikasi privat.",
    objective: "Uji batas rasionalitas target terhadap imbal hasil instan yang tidak wajar.",
    tags: ["Funneling", "Advance Fee Lure", "Greed Factor"],
    reqXp: 450,
    xPct: 28,
    yPct: 42,
  },
  {
    id: "rt-phishing-pajak",
    levelNumber: 6,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Typosquatting Portal Pajak",
    category: "Credential Harvesting Simulation",
    type: "battle",
    bossName: "Phishing Assessment Lead",
    targetName: "Wajib Pajak Korporat",
    difficulty: "Medium",
    diffColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    icon: "🏛️",
    xp: "+250 XP",
    xpNumber: 250,
    synopsis: "Gunakan narasi sinkronisasi data Coretax DJP mendesak untuk menguji kewaspadaan target memverifikasi sertifikat SSL dan URL.",
    objective: "Pandu target mengisi formulir pengujian kredensial tanpa menimbulkan alarm kecurigaan.",
    tags: ["Typosquatting", "Reverse Proxy", "Credential Harvest"],
    reqXp: 650,
    xPct: 72,
    yPct: 51,
  },
  {
    id: "rt-checkpoint-drill-2",
    levelNumber: 7,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Timed Drill: Credential Intercept",
    category: "Adversary Speed Drill",
    type: "drill",
    bossName: "Red Team Coordinator",
    targetName: "Operator Simulasi",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "⏱️",
    xp: "+150 XP",
    xpNumber: 150,
    synopsis: "Simulasi kecepatan intercept token autentikasi sebelum target menyadari anomali sesi.",
    objective: "Selesaikan 3 langkah operasional penangkapan data simulasi secara aman dan terkontrol.",
    tags: ["Speed Drill", "Token Capture", "Controlled Harvest"],
    reqXp: 800,
    xPct: 30,
    yPct: 60,
  },
  {
    id: "rt-sms-perbankan",
    levelNumber: 8,
    sectorId: 2,
    sectorName: "Sektor 2: Network & Phishing",
    title: "Boss Sektor 2: SMS Sender ID Spoofing",
    category: "Telephony Manipulation / Boss Battle",
    type: "boss",
    bossName: "Master Telephony Adversary",
    targetName: "Nasabah Prioritas Bank",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "🏦",
    xp: "+400 XP",
    xpNumber: 400,
    synopsis: "Gunakan masking nama bank resmi untuk menguji sejauh mana nasabah memercayai kanal SMS dibanding aplikasi perbankan.",
    objective: "Tuntun target mengklik tautan pembatalan simulasi dengan memicu kecemasan biaya administrasi.",
    tags: ["Boss Battle Sektor 2", "Sender ID Spoof", "Banking Pretext"],
    reqXp: 950,
    xPct: 75,
    yPct: 70,
  },
  // SEKTOR 3: AUTONOMOUS AI & DEEPFAKE SYNTHESIS
  {
    id: "rt-quishing-qris",
    levelNumber: 9,
    sectorId: 3,
    sectorName: "Sektor 3: Advanced Deepfake",
    title: "QR Tag Tampering & Social 2FA",
    category: "Physical-to-Digital Social Breach",
    type: "battle",
    bossName: "Adversary Social Engineer",
    targetName: "Pengelola Toko Retail",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "📱",
    xp: "+350 XP",
    xpNumber: 350,
    synopsis: "Rancang pretexting kesalahan transaksi voucher pulsa untuk memancing korban memberikan 6 digit kode autentikasi WhatsApp.",
    objective: "Dapatkan konfirmasi autentikasi sekunder target melalui manipulasi rasa simpati dan kekeliruan kasir.",
    tags: ["2FA Hijack", "Quishing Vector", "Sympathy Exploitation"],
    reqXp: 1200,
    xPct: 28,
    yPct: 80,
  },
  {
    id: "rt-deepfake-bos",
    levelNumber: 10,
    sectorId: 3,
    sectorName: "Sektor 3: Advanced Deepfake",
    title: "Final Boss: AI Voice Cloning Synthesis",
    category: "Generative AI Audio Spoofing / Boss Battle",
    type: "boss",
    bossName: "Apex AI Threat Actor",
    targetName: "Manajer Keuangan Senior",
    difficulty: "Insane",
    diffColor: "text-red-500 border-red-500/50 bg-red-950/50",
    icon: "🎙️",
    xp: "+500 XP",
    xpNumber: 500,
    synopsis: "Gunakan model sintesis audio kecerdasan buatan untuk menirukan timbre suara pimpinan dalam instruksi transfer darurat.",
    objective: "Bypass verifikasi human-in-the-loop target dengan intonasi otoritatif dan batas waktu tender kritis.",
    tags: ["Final Boss Battle", "Vishing Deepfake", "Executive Impersonation"],
    reqXp: 1500,
    xPct: 72,
    yPct: 89,
  },
];


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

export function LearnSandbox({
  initialScenarioId = "apk-kurir",
  onSwitchToAct,
}: LearnSandboxProps) {
  // Navigation View: "catalog" (Pilih level game) | "arena" (Halaman bermain simulasi)
  const [gameView, setGameView] = useState<"catalog" | "arena">("catalog");
  const [isChestOpen, setIsChestOpen] = useState(false);

  // Mode: "victim_game" (User = Korban, Lawan = Penipu AI) vs "redteam_game" (User = Penipu, Lawan = Target AI)
  const [gameRole, setGameRole] = useState<"victim_game" | "redteam_game">("victim_game");

  // Sector filter tab: "ALL" | 1 | 2 | 3
  const [selectedSector, setSelectedSector] = useState<"ALL" | 1 | 2 | 3>("ALL");

  // Checkpoint Mini-Games State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [drillChecks, setDrillChecks] = useState<Record<number, boolean>>({});
  const [isDrillDone, setIsDrillDone] = useState(false);

  // User Stats & Gamification per Mode
  const [progress, setProgress] = useState<UserProgressState>(DEFAULT_PROGRESS);

  const currentModeKey: "defense" | "offense" = gameRole === "victim_game" ? "defense" : "offense";
  const currentProgress = progress[currentModeKey];
  const currentCampaignLevels = currentModeKey === "defense" ? DEFENSE_LEVELS : OFFENSE_LEVELS;

  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(
    SANDBOX_SCENARIOS[initialScenarioId] ? initialScenarioId : "apk-kurir"
  );
  const baseScenarioKey = selectedScenarioKey.replace(/^rt-/, "");
  const scenario =
    SANDBOX_SCENARIOS[selectedScenarioKey] ||
    SANDBOX_SCENARIOS[baseScenarioKey] ||
    SANDBOX_SCENARIOS["apk-kurir"];

  const activeLevel =
    currentCampaignLevels.find((l) => l.id === selectedScenarioKey) || currentCampaignLevels[0];

  // ==========================================
  // STATE MODE 1: USER = KORBAN, LAWAN = PENIPU AI
  // ==========================================
  const [victimChatHistory, setVictimChatHistory] = useState<GameChatMessage[]>([
    {
      id: "v-init",
      sender: "bot",
      text: scenario.steps[0].scammerMessage,
      time: scenario.steps[0].timestamp || "14:20",
    },
  ]);
  const [vulnerability, setVulnerability] = useState(scenario.initialVulnerability || 50);
  const [victimInput, setVictimInput] = useState("");
  const [isScammerTyping, setIsScammerTyping] = useState(false);
  const [isVictimGameFinished, setIsVictimGameFinished] = useState(false);
  const [scammerTelemetry, setScammerTelemetry] = useState<{
    activeTactic: string;
    scammerMood: string;
    internalThought: string;
    source: string;
  }>({
    activeTactic: "Manipulasi Urgensi Semu",
    scammerMood: "PUSHING",
    internalThought: "Target harus dipaksa panik agar membuka berkas APK dalam 2 jam.",
    source: "gemini-ai",
  });

  // ============================================
  // STATE MODE 2: USER = PENIPU, LAWAN = TARGET AI
  // ============================================
  const [redteamChatHistory, setRedteamChatHistory] = useState<GameChatMessage[]>([
    {
      id: "rt-init",
      sender: "bot",
      text: "Halo, siapa ya? Ada keperluan apa kirim pesan ke nomor pribadi saya?",
      time: "14:20",
    },
  ]);
  const [targetSkepticism, setTargetSkepticism] = useState(100);
  const [redteamInput, setRedteamInput] = useState("");
  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [isRedteamFinished, setIsRedteamFinished] = useState(false);
  const [victimThought, setVictimThought] = useState<string>(
    "Pesan ini datang dari nomor tidak dikenal. Saya tidak boleh sembarangan percaya."
  );

  const victimChatRef = useRef<HTMLDivElement | null>(null);
  const redteamChatRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------------
  // RESTORE DARI LOCALSTORAGE PADA SAAT MOUNT
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedView = localStorage.getItem("trasp_learn_view") as "catalog" | "arena" | null;
        if (savedView === "catalog" || savedView === "arena") {
          setGameView(savedView);
        }

        const savedRole = localStorage.getItem("trasp_learn_role") as "victim_game" | "redteam_game" | null;
        if (savedRole) setGameRole(savedRole);

        const savedProgDefense = localStorage.getItem("cyberquest_progress_defense");
        const savedProgOffense = localStorage.getItem("cyberquest_progress_offense");
        let restoredDefense = DEFAULT_PROGRESS.defense;
        let restoredOffense = DEFAULT_PROGRESS.offense;

        if (savedProgDefense) {
          try { restoredDefense = JSON.parse(savedProgDefense); } catch {}
        }
        if (savedProgOffense) {
          try { restoredOffense = JSON.parse(savedProgOffense); } catch {}
        }

        setProgress({
          defense: restoredDefense,
          offense: restoredOffense,
        });

        const activeModeKey = (savedRole || "victim_game") === "victim_game" ? "defense" : "offense";
        const activeProg = activeModeKey === "defense" ? restoredDefense : restoredOffense;
        const activeCamp = activeModeKey === "defense" ? DEFENSE_LEVELS : OFFENSE_LEVELS;

        const savedScenario = localStorage.getItem("trasp_learn_scenario");
        if (savedScenario) {
          setSelectedScenarioKey(savedScenario);
        } else {
          const currentActive = activeCamp.find((l) => l.levelNumber === activeProg.currentLevel) || activeCamp[0];
          setSelectedScenarioKey(currentActive.id);
        }

        const savedVictimHistory = localStorage.getItem("trasp_learn_victim_history");
        if (savedVictimHistory) {
          const parsed = JSON.parse(savedVictimHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVictimChatHistory(parsed);
          }
        }

        const savedRedteamHistory = localStorage.getItem("trasp_learn_redteam_history");
        if (savedRedteamHistory) {
          const parsed = JSON.parse(savedRedteamHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRedteamChatHistory(parsed);
          }
        }

        const savedVuln = localStorage.getItem("trasp_learn_vulnerability");
        if (savedVuln) setVulnerability(Number(savedVuln));

        const savedSkep = localStorage.getItem("trasp_learn_skepticism");
        if (savedSkep) setTargetSkepticism(Number(savedSkep));

        const savedVictimInput = localStorage.getItem("trasp_learn_victim_input");
        if (savedVictimInput) setVictimInput(savedVictimInput);

        const savedRedteamInput = localStorage.getItem("trasp_learn_redteam_input");
        if (savedRedteamInput) setRedteamInput(savedRedteamInput);
      } catch (e) {
        console.error("Gagal membaca storage game:", e);
      }
    }
  }, []);

  // -------------------------------------------------------------
  // SIMPAN OTOMATIS KE LOCALSTORAGE
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_learn_view", gameView);
        localStorage.setItem("trasp_learn_role", gameRole);
        localStorage.setItem("trasp_learn_scenario", selectedScenarioKey);
        localStorage.setItem("trasp_learn_vulnerability", String(vulnerability));
        localStorage.setItem("trasp_learn_skepticism", String(targetSkepticism));
        localStorage.setItem("trasp_learn_victim_input", victimInput);
        localStorage.setItem("trasp_learn_redteam_input", redteamInput);
        localStorage.setItem("trasp_learn_victim_history", JSON.stringify(victimChatHistory));
        localStorage.setItem("trasp_learn_redteam_history", JSON.stringify(redteamChatHistory));
        localStorage.setItem("cyberquest_progress_defense", JSON.stringify(progress.defense));
        localStorage.setItem("cyberquest_progress_offense", JSON.stringify(progress.offense));
      } catch (e) {}
    }
  }, [
    gameView,
    gameRole,
    selectedScenarioKey,
    vulnerability,
    targetSkepticism,
    victimInput,
    redteamInput,
    victimChatHistory,
    redteamChatHistory,
    progress,
  ]);

  // Auto scroll
  useEffect(() => {
    if (victimChatRef.current) {
      victimChatRef.current.scrollTop = victimChatRef.current.scrollHeight;
    }
  }, [victimChatHistory, isScammerTyping]);

  useEffect(() => {
    if (redteamChatRef.current) {
      redteamChatRef.current.scrollTop = redteamChatRef.current.scrollHeight;
    }
  }, [redteamChatHistory, isTargetTyping]);

  const handleLevelFinished = (levelId: string) => {
    const modeKey: "defense" | "offense" = gameRole === "victim_game" ? "defense" : "offense";
    const campaignLevels = modeKey === "defense" ? DEFENSE_LEVELS : OFFENSE_LEVELS;
    const currentLvl = campaignLevels.find((l) => l.id === levelId) || campaignLevels[0];
    const nextLvl = campaignLevels.find((l) => l.levelNumber === currentLvl.levelNumber + 1);

    setProgress((prev) => {
      const currentMode = prev[modeKey];
      if (currentMode.completedLevels.includes(levelId)) return prev;

      const nextCompleted = [...currentMode.completedLevels, levelId];
      const nextXp = currentMode.xp + (currentLvl.xpNumber || 100);
      const nextCurrentLevel = nextLvl ? Math.max(currentMode.currentLevel, nextLvl.levelNumber) : currentMode.currentLevel;

      const updatedMode: ModeProgress = {
        completedLevels: nextCompleted,
        currentLevel: nextCurrentLevel,
        xp: nextXp,
      };

      const updatedAll: UserProgressState = {
        ...prev,
        [modeKey]: updatedMode,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            modeKey === "defense" ? "cyberquest_progress_defense" : "cyberquest_progress_offense",
            JSON.stringify(updatedMode)
          );
        } catch {}
      }
      return updatedAll;
    });
  };

  const handleSwitchMode = (newRole: "victim_game" | "redteam_game") => {
    setGameRole(newRole);
    const newModeKey: "defense" | "offense" = newRole === "victim_game" ? "defense" : "offense";
    const newCampaign = newRole === "victim_game" ? DEFENSE_LEVELS : OFFENSE_LEVELS;
    const modeProg = progress[newModeKey];
    const activeLvl = newCampaign.find((l) => l.levelNumber === modeProg.currentLevel) || newCampaign[0];
    setSelectedScenarioKey(activeLvl.id);
  };

  // Reset Sesi Game
  const resetAllGames = useCallback(
    (newScenarioKey?: string) => {
      const key = newScenarioKey || selectedScenarioKey;
      setSelectedScenarioKey(key);
      const sc = SANDBOX_SCENARIOS[key] || SANDBOX_SCENARIOS["apk-kurir"];

      const initialVictimMsg: GameChatMessage = {
        id: "v-init-" + Date.now(),
        sender: "bot",
        text: sc.steps[0].scammerMessage,
        time: sc.steps[0].timestamp || "14:20",
      };

      const initialRedteamMsg: GameChatMessage = {
        id: "rt-init-" + Date.now(),
        sender: "bot",
        text: "Halo, siapa ya? Ada keperluan apa kirim pesan ke nomor pribadi saya?",
        time: "14:20",
      };

      setVictimChatHistory([initialVictimMsg]);
      setVulnerability(sc.initialVulnerability || 50);
      setIsVictimGameFinished(false);
      setVictimInput("");

      setTargetSkepticism(100);
      setRedteamChatHistory([initialRedteamMsg]);
      setIsRedteamFinished(false);
      setRedteamInput("");

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("trasp_learn_scenario", key);
          localStorage.setItem("trasp_learn_victim_history", JSON.stringify([initialVictimMsg]));
          localStorage.setItem("trasp_learn_redteam_history", JSON.stringify([initialRedteamMsg]));
          localStorage.setItem("trasp_learn_vulnerability", String(sc.initialVulnerability || 50));
          localStorage.setItem("trasp_learn_skepticism", "100");
          localStorage.removeItem("trasp_learn_victim_input");
          localStorage.removeItem("trasp_learn_redteam_input");
        } catch {}
      }
    },
    [selectedScenarioKey]
  );

  const handleStartLevel = (levelId: string) => {
    if (levelId === "checkpoint-quiz-1") {
      setIsQuizOpen(true);
      return;
    }
    if (levelId === "checkpoint-drill-2") {
      setIsDrillOpen(true);
      return;
    }
    if (levelId === "mystery-vault") {
      setIsChestOpen(true);
      return;
    }

    if (levelId !== selectedScenarioKey) {
      resetAllGames(levelId);
    }
    setGameView("arena");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_learn_view", "arena");
        localStorage.setItem("trasp_learn_scenario", levelId);
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    setGameView("catalog");
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("trasp_learn_view", "catalog");
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // User as Korban sends reply to Penipu Bot
  const handleSendVictimChat = async (replyText?: string) => {
    if (isVictimGameFinished) return;
    const text = (replyText || victimInput).trim();
    if (!text || isScammerTyping) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: GameChatMessage = {
      id: "v-u-" + Date.now(),
      sender: "user",
      text,
      time: userTime,
    };
    const nextHistory = [...victimChatHistory, userMsg];
    setVictimChatHistory(nextHistory);
    setVictimInput("");
    setIsScammerTyping(true);

    try {
      const match = matchCustomUserReply(text, selectedScenarioKey, nextHistory.length, nextHistory);
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "scammer",
          scenarioId: selectedScenarioKey,
          currentVulnerability: vulnerability,
          contextEvidence: `Skenario: ${scenario.title}\nKategori: ${scenario.category}\nTarget Korban: Balas dengan gaya penipu licik, mendesak, dan manipulatif.`,
          chatHistory: nextHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const delta = typeof data.vulnerabilityDelta === "number" ? data.vulnerabilityDelta : match.vulnerabilityDelta;

        if (data.activeTactic || data.internalThought) {
          setScammerTelemetry({
            activeTactic: data.activeTactic || "Manipulasi Taktis Siber",
            scammerMood: data.scammerMood || "PUSHING",
            internalThought: data.internalThought || "Target memberikan respons yang patut diwaspadai.",
            source: data.source || "gemini-ai",
          });
        }

        const botMsg: GameChatMessage = {
          id: "v-b-" + Date.now(),
          sender: "bot",
          text: data.scammerResponse || data.assistantResponse || match.scammerResponse,
          time: botTime,
          delta,
        };
        const updatedHistory = [...nextHistory, botMsg];
        setVictimChatHistory(updatedHistory);
        const newVuln = Math.max(0, Math.min(100, vulnerability + delta));
        setVulnerability(newVuln);
        if (newVuln >= 100 || updatedHistory.length >= 30) {
          setIsVictimGameFinished(true);
        }
      } else {
        throw new Error("Chat bot API offline");
      }
    } catch {
      const match = matchCustomUserReply(text, selectedScenarioKey, nextHistory.length, nextHistory);
      const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const fallbackMsg: GameChatMessage = {
        id: "v-b-fb-" + Date.now(),
        sender: "bot",
        text: match.scammerResponse,
        time: botTime,
        delta: match.vulnerabilityDelta,
      };
      const updatedHistory = [...nextHistory, fallbackMsg];
      setVictimChatHistory(updatedHistory);
      const newVuln = Math.max(0, Math.min(100, vulnerability + match.vulnerabilityDelta));
      setVulnerability(newVuln);
      if (newVuln >= 100 || updatedHistory.length >= 30) {
        setIsVictimGameFinished(true);
      }
    } finally {
      setIsScammerTyping(false);
    }
  };

  // User as Red Team sends phishing attack to Target Bot
  const handleSendRedteamChat = async (replyText?: string) => {
    if (isRedteamFinished) return;
    const text = (replyText || redteamInput).trim();
    if (!text || isTargetTyping) return;

    const userTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: GameChatMessage = {
      id: "rt-u-" + Date.now(),
      sender: "user",
      text,
      time: userTime,
    };
    const nextHistory = [...redteamChatHistory, userMsg];
    setRedteamChatHistory(nextHistory);
    setRedteamInput("");
    setIsTargetTyping(true);

    try {
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "victim",
          contextEvidence: `Anda berperan sebagai ${activeLevel.targetName} yang menerima pesan mencurigakan: "${text}". Jika meyakinkan, kewaspadaan menurun; jika aneh, kewaspadaan tetap tinggi.`,
          chatHistory: nextHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        const delta = typeof data.skepticismDelta === "number" ? data.skepticismDelta : -15;

        if (data.victimThought) {
          setVictimThought(data.victimThought);
        }

        const botMsg: GameChatMessage = {
          id: "rt-b-" + Date.now(),
          sender: "bot",
          text: data.victimResponse || data.assistantResponse || "Hmm... Anda yakin dari pihak resmi? Saya minta bukti identitas dan nomor surat tugasnya.",
          time: botTime,
        };
        const updatedHistory = [...nextHistory, botMsg];
        setRedteamChatHistory(updatedHistory);
        const newSkep = Math.max(0, Math.min(100, targetSkepticism + delta));
        setTargetSkepticism(newSkep);
        if (newSkep <= 0 || updatedHistory.length >= 30) {
          setIsRedteamFinished(true);
        }
      } else {
        throw new Error("Target bot API offline");
      }
    } catch {
      const botTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const fallbackMsg: GameChatMessage = {
        id: "rt-b-fb-" + Date.now(),
        sender: "bot",
        text: "Maaf, saya tidak kenal Anda. Kenapa minta data sensitif saya lewat WhatsApp pribadi?",
        time: botTime,
      };
      const updatedHistory = [...nextHistory, fallbackMsg];
      setRedteamChatHistory(updatedHistory);
      const newSkep = Math.max(0, Math.min(100, targetSkepticism - 10));
      setTargetSkepticism(newSkep);
      if (newSkep <= 0 || updatedHistory.length >= 30) {
        setIsRedteamFinished(true);
      }
    } finally {
      setIsTargetTyping(false);
    }
  };

  const quickVictimHints = [
    "Kok fotonya format .APK? Kalau foto resi biasanya JPG/PNG.",
    "Saya tidak pesan barang apa pun, tolong sebutkan nomor resinya.",
    "Saya tidak pernah daftar program ini, mohon jangan hubungi saya lagi.",
    "Surat tilang resmi biasanya dikirim lewat pos atau website resmi ETLE Polri.",
  ];

  const quickRedteamHints = [
    "Selamat siang, paket penting Anda tertahan di kantor kami, mohon cek foto resi ini.",
    "Halo, selamat! Anda terpilih menjadi mitra reviewer e-commerce dengan komisi harian Rp500.000.",
    "Pemberitahuan resmi DJP: Ada ketidaksesuaian SPT pajak Anda, harap verifikasi NIK sekarang.",
    "Pemberitahuan bank: Tarif transfer antarbank akan naik menjadi Rp150.000/bulan, klik untuk batal.",
  ];

  // Game Health / Defense Calculation
  const playerHealth = Math.max(0, 100 - vulnerability);
  const isCurrentGameFinished = gameRole === "victim_game" ? isVictimGameFinished : isRedteamFinished;

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* VIEW 1: KATALOG LEVEL & TANTANGAN GAME                    */}
      {/* ========================================================= */}
      {/* VIEW 1: CYBER QUEST ROADMAP PATH (GAMIFIED PROGRESSION)    */}
      {/* ========================================================= */}
      {gameView === "catalog" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* ========================================================= */}
          {/* 1. MODERN GAMIFICATION HUD PANEL                          */}
          {/* ========================================================= */}
          <div
            className={`border transition-all duration-300 rounded-lg p-4 sm:p-5 space-y-4 ${
              gameRole === "victim_game"
                ? "bg-card border-border/80 shadow-xs"
                : "bg-zinc-950 border-rose-900/60 shadow-lg shadow-rose-950/20 text-foreground"
            }`}
          >
            {/* Top Bar: Profile, Rank, Shields, Streak & Role Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Profile & Rank Insignia */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner transition-transform hover:scale-105 shrink-0 ${
                    gameRole === "victim_game"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/40 text-rose-500"
                  }`}
                >
                  {gameRole === "victim_game" ? "🛡️" : "🕵️"}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {gameRole === "victim_game" ? "Operasi Blue Team" : "Simulasi Red Team"}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-bold px-2 py-0.2 ${
                        gameRole === "victim_game"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/30"
                          : "border-rose-500/40 text-rose-400 bg-rose-950/40"
                      }`}
                    >
                      {gameRole === "victim_game" ? "Cyber Sentinel (Tier II)" : "Ghost Operator (Tier II)"}
                    </Badge>
                  </div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-foreground leading-tight mt-0.5">
                    {gameRole === "victim_game" ? "Kampanye Investigasi Forensik" : "Simulasi Penetrasi Rekayasa Sosial"}
                  </h2>
                </div>
              </div>

              {/* Right: Gamification Badges & Dual Mode Switcher */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Shield Batteries (3 Lives) */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 border border-border/80 rounded-md">
                  <span className="text-[10px] font-mono text-muted-foreground mr-1">Integritas:</span>
                  <div className="flex items-center gap-1" title="3 Nyawa / Shield Integrity">
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs">🛡️</span>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-500 text-xs font-mono font-bold">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>4 Hari Streak</span>
                </div>

                {/* Role Switcher Pill */}
                <div
                  className={`flex items-center gap-1 p-1 border rounded-lg transition-colors ${
                    gameRole === "victim_game" ? "bg-muted/60 border-border" : "bg-zinc-900 border-rose-900/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("victim_game")}
                    className={`px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded ${
                      gameRole === "victim_game"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Defense</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchMode("redteam_game")}
                    className={`px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded ${
                      gameRole === "redteam_game"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-rose-400"
                    }`}
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Red Team</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Interactive XP Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Progres Kampanye: <strong>{currentProgress.xp}</strong> / 1,500 XP</span>
                </span>
                <span className="font-bold text-foreground">
                  Level {currentProgress.completedLevels.length}/10 Selesai ({Math.min(100, Math.round((currentProgress.xp / 1500) * 100))}%)
                </span>
              </div>
              <Progress value={Math.min(100, (currentProgress.xp / 1500) * 100)} className="h-2.5" />
            </div>

            {/* Sector Tabs Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedSector("ALL")}
                className={`px-3 py-1 rounded border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSector === "ALL"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua Sektor (10 Level)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSector(1)}
                className={`px-3 py-1 rounded border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSector === 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Sektor 1: Social Engineering (Lv 1-4)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSector(2)}
                className={`px-3 py-1 rounded border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSector === 2
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Sektor 2: Network &amp; Phishing (Lv 5-8)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSector(3)}
                className={`px-3 py-1 rounded border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSector === 3
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Sektor 3: Deepfake &amp; AI (Lv 9-10)
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. DYNAMIC ROADMAP SVG CANVAS WITH BEZIER CONNECTOR       */}
          {/* ========================================================= */}
          <div
            className={`relative w-full max-w-2xl mx-auto h-[1050px] p-4 border rounded-xl overflow-hidden select-none transition-colors duration-300 ${
              gameRole === "victim_game"
                ? "bg-gradient-to-b from-card via-background to-card/90 border-border/80"
                : "bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-rose-950/60"
            }`}
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

            {/* Glowing SVG Path Connector (Smooth Bezier) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="questGlowEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                <linearGradient id="questGlowCrimson" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Full Route Pathway (Base Dashed Track) */}
              <path
                d="M 26 5 C 74 7, 74 11, 74 14 C 34 17, 34 20, 34 23 C 76 26, 76 29, 76 32 C 28 35, 28 39, 28 42 C 72 45, 72 48, 72 51 C 30 54, 30 57, 30 60 C 75 63, 75 67, 75 70 C 28 73, 28 77, 28 80 C 72 83, 72 86, 72 89 C 50 91, 50 93, 50 96"
                fill="none"
                stroke="currentColor"
                className="text-border/60 dark:text-border/40"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />

              {/* Active / Completed Progress Glow Line */}
              <path
                d="M 26 5 C 74 7, 74 11, 74 14"
                fill="none"
                stroke={gameRole === "victim_game" ? "url(#questGlowEmerald)" : "url(#questGlowCrimson)"}
                strokeWidth="3.5"
                filter="url(#glowEffect)"
              />
            </svg>

            {/* Render All Campaign Level Nodes */}
            {currentCampaignLevels.map((lvl) => {
              const isFilteredOut = selectedSector !== "ALL" && lvl.sectorId !== selectedSector;
              const isCompleted = currentProgress.completedLevels.includes(lvl.id);
              const isActive = (lvl.levelNumber === currentProgress.currentLevel || (currentModeKey === "defense" && lvl.id === "checkpoint-quiz-1")) && !isCompleted;
              const isLocked = !isCompleted && !isActive;

              return (
                <div
                  key={lvl.id}
                  style={{ left: `${lvl.xPct}%`, top: `${lvl.yPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 transition-all duration-300 ${
                    isFilteredOut ? "opacity-25 pointer-events-none scale-90" : "opacity-100"
                  }`}
                >
                  {/* NODE TYPE 1: CHECKPOINT (DIAMOND GEOMETRY) */}
                  {lvl.type === "quiz" || lvl.type === "drill" ? (
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                        isCompleted
                          ? "bg-card border-2 border-emerald-500 shadow-md shadow-emerald-500/20"
                          : isActive
                          ? "bg-card border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20"
                          : "bg-muted/40 border border-border text-muted-foreground opacity-60"
                      } rounded-xl rotate-45`}
                      title={`Checkpoint: ${lvl.title}`}
                    >
                      <span className="-rotate-45 text-xl sm:text-2xl">{lvl.icon}</span>

                      {/* Milestone Badge */}
                      <span className="absolute -top-3 -rotate-45 px-2 py-0.5 rounded-full bg-cyan-600 text-white font-mono text-[9px] font-bold shadow-xs whitespace-nowrap">
                        {lvl.type === "quiz" ? "QUIZ" : "DRILL"}
                      </span>
                    </button>
                  ) : lvl.type === "boss" ? (
                    /* NODE TYPE 2: BOSS LEVEL (HEXAGONAL / FLAME GEOMETRY) */
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 ${
                        isCompleted
                          ? "bg-card border-emerald-500 shadow-lg shadow-emerald-500/20"
                          : isActive
                          ? "bg-card border-rose-500 shadow-xl shadow-rose-500/30 ring-4 ring-rose-500/30 animate-pulse"
                          : "bg-muted/30 border-rose-900/60 text-muted-foreground opacity-70"
                      }`}
                      title={`Boss Battle: ${lvl.title}`}
                    >
                      <span>{lvl.icon}</span>

                      {/* Boss Badge */}
                      <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold shadow-xs flex items-center gap-1 whitespace-nowrap">
                        <Skull className="w-2.5 h-2.5" /> BOSS
                      </span>

                      {/* Level Number */}
                      <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-border rounded text-[9px] font-mono font-bold text-foreground">
                        {String(lvl.levelNumber).padStart(2, "0")}
                      </span>
                    </button>
                  ) : (
                    /* NODE TYPE 3: STANDARD BATTLE NODE (CIRCULAR) */
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-card border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                        isCompleted
                          ? "border-emerald-500 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/20"
                          : isActive
                          ? gameRole === "victim_game"
                            ? "border-amber-500 shadow-xl shadow-amber-500/30 ring-4 ring-amber-500/30"
                            : "border-rose-500 shadow-xl shadow-rose-500/30 ring-4 ring-rose-500/30"
                          : "border-border text-muted-foreground opacity-60"
                      }`}
                      title={`Level ${lvl.levelNumber}: ${lvl.title}`}
                    >
                      <span>{lvl.icon}</span>

                      {/* Status / Play Now Pill */}
                      {isCompleted ? (
                        <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold shadow-xs flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {lvl.score || 95}
                        </span>
                      ) : isActive ? (
                        <>
                          <span className="absolute -inset-1 rounded-full animate-ping opacity-25 bg-amber-500 pointer-events-none" />
                          <span
                            className={`absolute -top-2.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold shadow-xs flex items-center gap-1 whitespace-nowrap ${
                              gameRole === "victim_game" ? "bg-amber-500 text-black" : "bg-rose-600 text-white"
                            }`}
                          >
                            <Play className="w-2.5 h-2.5 fill-current" /> PLAY NOW
                          </span>
                        </>
                      ) : (
                        <span className="absolute -top-2.5 px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-mono text-[9px] flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> {lvl.reqXp || 300} XP
                        </span>
                      )}

                      {/* Level Number Footprint */}
                      <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-border rounded text-[9px] font-mono font-bold text-foreground">
                        {String(lvl.levelNumber).padStart(2, "0")}
                      </span>
                    </button>
                  )}

                  {/* Level Text Info Below Node */}
                  <div className="mt-2 text-center pointer-events-none max-w-[120px]">
                    <div className="text-xs font-bold font-mono text-foreground truncate">
                      {lvl.title}
                    </div>
                    <div
                      className={`text-[10px] font-mono font-semibold truncate ${
                        isCompleted
                          ? "text-emerald-400"
                          : isActive
                          ? gameRole === "victim_game"
                            ? "text-amber-400"
                            : "text-rose-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {lvl.xp} {isCompleted ? "• Selesai" : isLocked ? "• Terkunci" : "• Misi Aktif"}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* NODE 11: FINAL REWARD VAULT (MYSTERY CHEST) */}
            <div className="absolute left-[50%] top-[96%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => setIsChestOpen(true)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-amber-500/70 hover:border-amber-400 shadow-xl shadow-amber-500/30 flex items-center justify-center text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-amber-500/20"
                title="Buka Master Cyber Sentinel Vault"
              >
                <span>🎁</span>
                <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-bold shadow-xs">
                  VAULT
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Master Vault
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-semibold">
                  Lencana Kehormatan 2026
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. MODAL CHECKPOINT 1: MINI-QUIZ FORENSIK                 */}
          {/* ========================================================= */}
          {isQuizOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border max-w-md w-full p-5 space-y-4 rounded-lg shadow-xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold">
                      QUIZ
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground">
                      {gameRole === "victim_game" ? "Mini-Quiz: Izin Aksesibilitas Android" : "Red Team Drill: Evasion AV & Play Protect"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsQuizOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Soal 1 */}
                  <div className="p-3 bg-muted/30 border border-border rounded space-y-2">
                    <span className="font-mono font-bold text-primary block">
                      1. Mengapa berkas foto berformat .APK sangat mencurigakan?
                    </span>
                    <div className="space-y-1 font-sans">
                      {[
                        "Karena .APK adalah format installer aplikasi, bukan format berkas gambar (JPG/PNG).",
                        "Karena berkas .APK hanya bisa dibuka di komputer server ekspedisi.",
                      ].map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setQuizAnswers({ ...quizAnswers, 1: i })}
                          className={`w-full text-left p-2 rounded border transition-colors cursor-pointer ${
                            quizAnswers[1] === i
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background border-border hover:bg-muted/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soal 2 */}
                  <div className="p-3 bg-muted/30 border border-border rounded space-y-2">
                    <span className="font-mono font-bold text-primary block">
                      2. Izin apa yang disalahgunakan malware untuk menyadap kode OTP perbankan?
                    </span>
                    <div className="space-y-1 font-sans">
                      {[
                        "Accessibility Services & Read SMS",
                        "Izin Akses Kamera dan Bluetooth",
                      ].map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setQuizAnswers({ ...quizAnswers, 2: i })}
                          className={`w-full text-left p-2 rounded border transition-colors cursor-pointer ${
                            quizAnswers[2] === i
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-background border-border hover:bg-muted/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsQuizOpen(false)}
                    className="text-xs h-8"
                  >
                    Tutup
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const quizId = gameRole === "victim_game" ? "checkpoint-quiz-1" : "rt-checkpoint-quiz-1";
                      handleLevelFinished(quizId);
                      setIsQuizOpen(false);
                    }}
                    disabled={quizAnswers[1] === undefined || quizAnswers[2] === undefined}
                    className="text-xs h-8 bg-cyan-600 hover:bg-cyan-700 text-white font-mono font-bold cursor-pointer"
                  >
                    Kirim &amp; Klaim +100 XP
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. MODAL CHECKPOINT 2: TIMED INCIDENT DRILL (AIR-GAP)     */}
          {/* ========================================================= */}
          {isDrillOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border max-w-md w-full p-5 space-y-4 rounded-lg shadow-xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono text-xs font-bold flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" /> DRILL
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-foreground">
                      {gameRole === "victim_game" ? "Timed Incident Drill: 15-Menit Air-Gap" : "Timed Drill: Pretexting & Credential Intercept"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsDrillOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Simulasikan protokol tanggap darurat golden time saat mendeteksi ponsel telah mengklik berkas APK liar.
                </p>

                <div className="space-y-2 text-xs">
                  {(gameRole === "victim_game"
                    ? [
                        "Aktifkan Mode Pesawat (Airplane Mode) seketika untuk memutus server C2.",
                        "Matikan seluruh koneksi Wi-Fi, Bluetooth, dan cabut kartu SIM fisik.",
                        "Masuk ke Pengaturan > Aksesibilitas > Cabut izin aplikasi mencurigakan.",
                        "Lakukan pergantian kredensial m-Banking dari perangkat lain yang aman.",
                      ]
                    : [
                        "Validasi form landing page pengujian dan pastikan payload tersanitasi aman.",
                        "Kirimkan simulasi broadcast SMS spoofing ke nomor perangkat uji internal.",
                        "Verifikasi penerimaan session token pada listener forensik terkontrol.",
                        "Dokumentasikan resistensi target ke dalam laporan red team audit.",
                      ]
                  ).map((stepText, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDrillChecks({ ...drillChecks, [idx]: !drillChecks[idx] })}
                      className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center gap-2.5 ${
                        drillChecks[idx]
                          ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                          : "bg-muted/30 border-border hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          drillChecks[idx]
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-border bg-background"
                        }`}
                      >
                        {drillChecks[idx] && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={drillChecks[idx] ? "line-through text-muted-foreground" : ""}>
                        {stepText}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDrillOpen(false)}
                    className="text-xs h-8"
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const drillId = gameRole === "victim_game" ? "checkpoint-drill-2" : "rt-checkpoint-drill-2";
                      handleLevelFinished(drillId);
                      setIsDrillOpen(false);
                    }}
                    disabled={Object.values(drillChecks).filter(Boolean).length < 4}
                    className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold cursor-pointer"
                  >
                    Eksekusi Selesai (+150 XP)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. MODAL REWARD: MASTER CYBER SENTINEL VAULT              */}
          {/* ========================================================= */}
          {isChestOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border max-w-sm w-full p-5 text-center space-y-3.5 rounded-lg shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-inner">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">
                    {gameRole === "victim_game" ? "Master Cyber Sentinel Vault" : "Master Ghost Operator Vault"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gameRole === "victim_game"
                      ? "Lencana Kehormatan Cyber Guardian 2026 UNMUL terbuka untuk Anda."
                      : "Lencana Kehormatan Apex Adversary 2026 UNMUL terbuka untuk Anda."}
                  </p>
                </div>
                <div className="p-3 bg-muted/40 border border-border rounded text-xs font-mono text-foreground space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kampanye XP:</span>
                    <span className="font-bold text-amber-500">+{currentProgress.xp} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peringkat Agen:</span>
                    <span className="font-bold text-emerald-500">{gameRole === "victim_game" ? "Tier III (Elite Sentinel)" : "Tier III (Apex Ghost Operator)"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status Sertifikasi:</span>
                    <span className="font-bold text-primary">Live Verified MIT-WEEK 2026</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsChestOpen(false)}
                  className="w-full text-xs h-8 bg-primary text-primary-foreground font-mono font-bold cursor-pointer"
                >
                  Klaim Lencana &amp; Lanjutkan Latihan
                </Button>
              </div>
            </div>
          )}
        </div>
      )}{gameView === "arena" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Top Navigation & Level Indicator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-muted/30 border border-border rounded">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCatalog}
                className="text-xs h-8 cursor-pointer font-mono font-medium gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Katalog
              </Button>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-foreground">
                  Level 0{activeLevel.levelNumber}: {activeLevel.title}
                </span>
                <Badge variant="outline" className={`text-[10px] font-mono ${activeLevel.diffColor}`}>
                  {activeLevel.difficulty}
                </Badge>
              </div>
            </div>

            {/* Right: Switch Role & Reset */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 border border-border rounded">
                <button
                  type="button"
                  onClick={() => setGameRole("victim_game")}
                  className={`px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    gameRole === "victim_game"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>Korban</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGameRole("redteam_game")}
                  className={`px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    gameRole === "redteam_game"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Red Team</span>
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetAllGames()}
                className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground cursor-pointer font-mono"
                title="Reset Sesi Level Ini"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Main Battle Arena (Split View: Chat Simulator + Battle HUD) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* ========================================================= */}
            {/* LEFT COLUMN: INTERACTIVE GAME CHAT ARENA                  */}
            {/* ========================================================= */}
            <div className="lg:col-span-8 flex flex-col h-[560px] bg-card border border-border">
              {/* Arena Chat Header */}
              <div className="px-3.5 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded flex items-center justify-center text-lg font-bold border ${
                      gameRole === "victim_game"
                        ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
                        : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                    }`}
                  >
                    {gameRole === "victim_game" ? activeLevel.icon : "🧑"}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold font-mono text-foreground flex items-center gap-1.5">
                      {gameRole === "victim_game" ? activeLevel.bossName : `Target: ${activeLevel.targetName}`}
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 px-1 font-mono ${
                          gameRole === "victim_game"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {gameRole === "victim_game" ? "Boss AI" : "Target AI"}
                      </Badge>
                    </h3>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {gameRole === "victim_game"
                        ? isScammerTyping
                          ? "sedang merangkai manipulasi..."
                          : "Online (WhatsApp)"
                        : isTargetTyping
                        ? "sedang membaca pesan..."
                        : "Online (WhatsApp)"}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {activeLevel.xp}
                </div>
              </div>

              {/* Chat Messages Body */}
              <div
                ref={gameRole === "victim_game" ? victimChatRef : redteamChatRef}
                className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/50 text-xs"
              >
                {(gameRole === "victim_game" ? victimChatHistory : redteamChatHistory).map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.sender === "bot" && (
                      <div
                        className={`w-7 h-7 rounded shrink-0 flex items-center justify-center text-sm mt-0.5 border ${
                          gameRole === "victim_game"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {gameRole === "victim_game" ? activeLevel.icon : "🧑"}
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

                      <div className="text-[9px] text-muted-foreground/80 font-mono text-right flex items-center justify-end gap-1">
                        <span>{m.time}</span>
                      </div>
                    </div>

                    {m.sender === "user" && (
                      <div className="w-7 h-7 rounded bg-muted shrink-0 flex items-center justify-center text-sm mt-0.5 border border-border">
                        {gameRole === "victim_game" ? "🛡️" : "🕵️"}
                      </div>
                    )}
                  </div>
                ))}

                {(gameRole === "victim_game" ? isScammerTyping : isTargetTyping) && (
                  <div className="flex gap-2 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded border border-border">
                    <Zap className="w-3 h-3 text-primary animate-spin" />
                    <span>
                      {gameRole === "victim_game" ? "Boss AI sedang merespons..." : "Target sedang berpikir..."}
                    </span>
                  </div>
                )}

                {/* Inline Banner Saat Level Selesai */}
                {isCurrentGameFinished && (
                  <div className="p-3 bg-muted/60 border border-border text-center rounded space-y-2 animate-in fade-in duration-200">
                    <div className="text-xs font-mono font-bold text-foreground flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Level Selesai!</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {gameRole === "victim_game"
                        ? playerHealth > 0
                          ? "Hebat! Anda berhasil bertahan dari rekayasa sosial penipu."
                          : "HP pertahanan habis! Anda terkena jebakan malware penipu."
                        : targetSkepticism <= 0
                        ? "Serangan berhasil! Target telah mempercayai manipulasi Anda."
                        : "Target berhasil memblokir serangan manipulasi Anda."}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetAllGames()}
                        className="text-xs h-7 cursor-pointer font-mono"
                      >
                        Main Lagi
                      </Button>
                      {onSwitchToAct && (
                        <Button
                          size="sm"
                          onClick={() => onSwitchToAct(selectedScenarioKey)}
                          className="text-xs h-7 bg-primary text-primary-foreground cursor-pointer font-mono"
                        >
                          Buka Mitigasi (Act) &rarr;
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Tactical Hints Strip (Hidden if finished) */}
              {!isCurrentGameFinished && (
                <div className="p-2 bg-muted/30 border-t border-border flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0">
                  <span className="text-muted-foreground font-mono uppercase text-[9px] flex items-center gap-1 shrink-0">
                    <Lightbulb className="w-3 h-3 text-amber-500" /> Ide Balasan:
                  </span>
                  {(gameRole === "victim_game" ? quickVictimHints : quickRedteamHints).map((hint, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (gameRole === "victim_game") {
                          handleSendVictimChat(hint);
                        } else {
                          handleSendRedteamChat(hint);
                        }
                      }}
                      disabled={gameRole === "victim_game" ? isScammerTyping : isTargetTyping}
                      className="whitespace-nowrap px-2 py-1 bg-background border border-border hover:border-primary rounded text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-muted/60 border-t border-border shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isCurrentGameFinished) return;
                    if (gameRole === "victim_game") {
                      handleSendVictimChat();
                    } else {
                      handleSendRedteamChat();
                    }
                  }}
                  className="flex gap-1.5 items-center"
                >
                  <Input
                    value={gameRole === "victim_game" ? victimInput : redteamInput}
                    onChange={(e) => {
                      if (gameRole === "victim_game") {
                        setVictimInput(e.target.value);
                      } else {
                        setRedteamInput(e.target.value);
                      }
                    }}
                    placeholder={
                      isCurrentGameFinished
                        ? "Level telah selesai. Klik 'Main Lagi' untuk mengulang sesi latihan."
                        : gameRole === "victim_game"
                        ? "Ketik balasan Anda ke penipu..."
                        : "Ketik kalimat serangan manipulasi Anda..."
                    }
                    disabled={isCurrentGameFinished || (gameRole === "victim_game" ? isScammerTyping : isTargetTyping)}
                    className="text-xs h-9 bg-background border-border disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      isCurrentGameFinished ||
                      (gameRole === "victim_game"
                        ? !victimInput.trim() || isScammerTyping
                        : !redteamInput.trim() || isTargetTyping)
                    }
                    className="h-9 px-3 bg-primary text-primary-foreground font-medium cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: CUKUP HP PERTAHANAN & LEVEL SAJA (MINIMAL)   */}
            {/* ========================================================= */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              <div className="bg-card border border-border p-4 space-y-4">
                {/* Level Title & Difficulty Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                    <Swords className="w-4 h-4 text-primary" />
                    <span>Level {activeLevel.levelNumber}: {activeLevel.title}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono ${activeLevel.diffColor}`}>
                    {activeLevel.difficulty}
                  </Badge>
                </div>

                {/* HP Pertahanan / Kewaspadaan Meter */}
                {gameRole === "victim_game" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span>HP Pertahanan Anda:</span>
                      </span>
                      <span
                        className={`font-bold font-mono ${
                          playerHealth >= 70
                            ? "text-emerald-500"
                            : playerHealth >= 40
                            ? "text-amber-500"
                            : "text-rose-500"
                        }`}
                      >
                        {playerHealth} / 100
                      </span>
                    </div>
                    <Progress value={playerHealth} className="h-3" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span>Kewaspadaan Target:</span>
                      </span>
                      <span className="font-bold font-mono text-emerald-500">
                        {targetSkepticism}%
                      </span>
                    </div>
                    <Progress value={targetSkepticism} className="h-3" />
                  </div>
                )}

                {/* Tombol Aksi: Selesaikan / Blokir atau Opsi Selesai */}
                {!isCurrentGameFinished ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (gameRole === "victim_game") {
                        setIsVictimGameFinished(true);
                      } else {
                        setIsRedteamFinished(true);
                      }
                      handleLevelFinished(selectedScenarioKey);
                    }}
                    className="w-full text-xs h-8 font-mono border-rose-500/40 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    {gameRole === "victim_game" ? "🛡️ Blokir & Selesaikan Level" : "⏹️ Akhiri Serangan"}
                  </Button>
                ) : (
                  <div className="p-3 bg-muted/60 border border-border text-center space-y-2 rounded">
                    <div className="text-xs font-mono font-bold text-foreground flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Level Selesai!</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetAllGames()}
                        className="text-xs h-8 flex-1 cursor-pointer font-mono"
                      >
                        Main Lagi
                      </Button>
                      {onSwitchToAct && (
                        <Button
                          size="sm"
                          onClick={() => onSwitchToAct(selectedScenarioKey)}
                          className="text-xs h-8 flex-1 bg-primary text-primary-foreground cursor-pointer font-mono"
                        >
                          Buka Mitigasi
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
