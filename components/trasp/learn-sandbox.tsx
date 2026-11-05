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
  Wifi,
  Battery,
  Signal,
  Brain,
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

  // ============================================
  // GAMIFIKASI METRIK INTERAKTIF, TOAST & DEBRIEF
  // ============================================
  const [panicLevel, setPanicLevel] = useState<number>(20);
  const [trustMeter, setTrustMeter] = useState<number>(25);
  const [floatingToast, setFloatingToast] = useState<{
    text: string;
    score: string;
    type: "good" | "neutral" | "bad";
  } | null>(null);
  const [isDebriefOpen, setIsDebriefOpen] = useState<boolean>(false);

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
      setPanicLevel(20);
      setTrustMeter(25);
      setIsDebriefOpen(false);
      setFloatingToast(null);

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

  // Web Audio API Synthesizer (Zero External File, 100% Offline & Resilient)
  const playGameSound = useCallback((type: "critical" | "neutral" | "trap" | "victory") => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "critical") {
        // High crisp double ding for sharp analysis
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "neutral") {
        // Soft neutral chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "trap") {
        // Low distorted buzz for falling into trap
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "victory") {
        // Four-tone success fanfare
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      }
    } catch {}
  }, []);

  const triggerScoreToast = (text: string, score: string, type: "good" | "neutral" | "bad") => {
    setFloatingToast({ text, score, type });
    setTimeout(() => {
      setFloatingToast((cur) => (cur?.text === text ? null : cur));
    }, 2400);
  };

  const handleBlockAndReport = () => {
    setIsVictimGameFinished(true);
    handleLevelFinished(selectedScenarioKey);
    playGameSound("victory");
    triggerScoreToast("Nomor Penipu Berhasil Diblokir!", "+100 XP", "good");
    setIsDebriefOpen(true);
  };

  const handleEndOffense = () => {
    setIsRedteamFinished(true);
    handleLevelFinished(selectedScenarioKey);
    playGameSound("neutral");
    setIsDebriefOpen(true);
  };

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
          {/* ========================================================= */}
          {/* 1. COMPACT GAMIFICATION HUD HEADER                        */}
          {/* ========================================================= */}
          <div
            className={`border transition-all duration-300 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs ${
              gameRole === "victim_game"
                ? "bg-[#FAF8F5] dark:bg-card border-neutral-300 dark:border-neutral-700"
                : "bg-[#FAF8F5] dark:bg-card border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/20"
            }`}
          >
            {/* Baris 1: Judul Utama di Kiri & Toggle Switch di Kanan */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border shadow-2xs shrink-0 ${
                    gameRole === "victim_game"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {gameRole === "victim_game" ? "🛡️" : "🕵️"}
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                    {gameRole === "victim_game" ? "Kampanye Investigasi Forensik" : "Simulasi Penetrasi Rekayasa Sosial"}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                      {gameRole === "victim_game" ? "Cyber Sentinel (Tier II)" : "Ghost Operator (Tier II)"}
                    </span>
                    <span className="text-neutral-400">&bull;</span>
                    <span className={gameRole === "victim_game" ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                      {gameRole === "victim_game" ? "Operasi Blue Team" : "Simulasi Red Team"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle Switch Defense / Red Team yang rapi */}
              <div
                className={`flex items-center gap-1 p-1 border rounded-lg bg-white dark:bg-neutral-800 shadow-2xs ${
                  gameRole === "victim_game" ? "border-neutral-300 dark:border-neutral-700" : "border-rose-300 dark:border-rose-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSwitchMode("victim_game")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded-md ${
                    gameRole === "victim_game"
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Defense</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode("redteam_game")}
                  className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded-md ${
                    gameRole === "redteam_game"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Red Team</span>
                </button>
              </div>
            </div>

            {/* Baris 2: Indikator ringkas dalam satu baris horizontal */}
            <div className="pt-2.5 border-t border-neutral-300/80 dark:border-neutral-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                {/* Status Nyawa / Integritas */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-2xs">
                  <span className="text-[10px] text-neutral-700 dark:text-neutral-300 font-bold">Integritas:</span>
                  <div className="flex items-center gap-0.5" title="3 Nyawa / Shield Integrity">
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs">🛡️</span>
                  </div>
                </div>

                {/* Streak Harian */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-md text-amber-800 dark:text-amber-300 font-bold shadow-2xs">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>4 Hari Streak</span>
                </div>
              </div>

              {/* XP & Progres Bar Level */}
              <div className="flex items-center gap-3 flex-1 sm:max-w-md">
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{currentProgress.xp} / 1,500 XP</span>
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      Level {currentProgress.completedLevels.length}/10 Selesai ({Math.min(100, Math.round((currentProgress.xp / 1500) * 100))}%)
                    </span>
                  </div>
                  <Progress value={Math.min(100, (currentProgress.xp / 1500) * 100)} className="h-2 bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. DYNAMIC ROADMAP SVG CANVAS WITH BEZIER CONNECTOR       */}
          {/* ========================================================= */}
          <div
            className={`relative w-full max-w-4xl mx-auto min-h-[1100px] h-[1120px] px-8 py-10 sm:px-12 border rounded-2xl select-none transition-colors duration-300 shadow-xs ${
              gameRole === "victim_game"
                ? "bg-[#FAF8F5] dark:bg-card border-neutral-300 dark:border-neutral-700"
                : "bg-[#FAF8F5] dark:bg-card border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/20"
            }`}
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-[0.04] text-neutral-900 dark:text-neutral-100" />

            {/* Glowing SVG Path Connector (Smooth Bezier) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -z-0"
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
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#b91c1c" />
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
                className="text-neutral-300 dark:text-neutral-700"
                strokeWidth="2.5"
                strokeDasharray="4 4"
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

            {/* Chapter Dividers / Milestone Track Labels */}
            <div className="absolute left-1/2 top-[1.2%] -translate-x-1/2 z-0 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-800/95 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 shadow-2xs tracking-wider uppercase">
                Sektor 1: Social Engineering (Lv 1-4)
              </span>
            </div>

            <div className="absolute left-1/2 top-[37%] -translate-x-1/2 z-0 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-800/95 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 shadow-2xs tracking-wider uppercase">
                Sektor 2: Network &amp; Phishing (Lv 5-8)
              </span>
            </div>

            <div className="absolute left-1/2 top-[75%] -translate-x-1/2 z-0 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-neutral-800/95 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 shadow-2xs tracking-wider uppercase">
                Sektor 3: Deepfake &amp; AI (Lv 9-10)
              </span>
            </div>

            {/* Render All Campaign Level Nodes */}
            {currentCampaignLevels.map((lvl) => {
              const isCompleted = currentProgress.completedLevels.includes(lvl.id);
              const isActive = (lvl.levelNumber === currentProgress.currentLevel || (currentModeKey === "defense" && lvl.id === "checkpoint-quiz-1")) && !isCompleted;
              const isLocked = !isCompleted && !isActive;

              return (
                <div
                  key={lvl.id}
                  style={{ left: `${lvl.xPct}%`, top: `${lvl.yPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 transition-all duration-300 opacity-100"
                >
                  {/* NODE TYPE 1: CHECKPOINT (DIAMOND GEOMETRY) */}
                  {lvl.type === "quiz" || lvl.type === "drill" ? (
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer rounded-xl rotate-45 shadow-xs ${
                        isCompleted
                          ? "bg-white dark:bg-neutral-900 border-2 border-emerald-500 shadow-md ring-4 ring-emerald-500/20"
                          : isActive
                          ? gameRole === "victim_game"
                            ? "bg-white dark:bg-neutral-900 border-2 border-cyan-500 shadow-lg ring-4 ring-cyan-500/25"
                            : "bg-white dark:bg-neutral-900 border-2 border-rose-500 shadow-lg ring-4 ring-rose-500/25"
                          : "bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"
                      }`}
                      title={`Checkpoint: ${lvl.title}`}
                    >
                      <span className="-rotate-45 text-xl sm:text-2xl">{lvl.icon}</span>

                      {/* Milestone Badge */}
                      <span
                        className={`absolute -top-3 -rotate-45 px-2 py-0.5 rounded-full text-white font-mono text-[9px] font-bold shadow-xs whitespace-nowrap ${
                          gameRole === "victim_game" ? "bg-cyan-600" : "bg-rose-600"
                        }`}
                      >
                        {lvl.type === "quiz" ? "QUIZ" : "DRILL"}
                      </span>
                    </button>
                  ) : lvl.type === "boss" ? (
                    /* NODE TYPE 2: BOSS LEVEL (HEXAGONAL / FLAME GEOMETRY) */
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 shadow-xs ${
                        isCompleted
                          ? "bg-white dark:bg-neutral-900 border-emerald-500 shadow-md ring-4 ring-emerald-500/20"
                          : isActive
                          ? "bg-white dark:bg-neutral-900 border-rose-500 shadow-xl ring-4 ring-rose-500/30 animate-pulse"
                          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"
                      }`}
                      title={`Boss Battle: ${lvl.title}`}
                    >
                      <span>{lvl.icon}</span>

                      {/* Boss Badge */}
                      <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold shadow-xs flex items-center gap-1 whitespace-nowrap">
                        <Skull className="w-2.5 h-2.5" /> BOSS
                      </span>

                      {/* Level Number */}
                      <span className="absolute -bottom-1 px-1.5 py-0.2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-[9px] font-mono font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs">
                        {String(lvl.levelNumber).padStart(2, "0")}
                      </span>
                    </button>
                  ) : (
                    /* NODE TYPE 3: STANDARD BATTLE NODE (CIRCULAR) */
                    <button
                      type="button"
                      onClick={() => handleStartLevel(lvl.id)}
                      className={`relative w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs ${
                        isCompleted
                          ? "bg-white dark:bg-neutral-900 border-emerald-500 shadow-md ring-4 ring-emerald-500/20"
                          : isActive
                          ? gameRole === "victim_game"
                            ? "bg-white dark:bg-neutral-900 border-amber-500 shadow-xl ring-4 ring-amber-500/30"
                            : "bg-white dark:bg-neutral-900 border-rose-500 shadow-xl ring-4 ring-rose-500/30"
                          : "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"
                      }`}
                      title={`Level ${lvl.levelNumber}: ${lvl.title}`}
                    >
                      <span>{lvl.icon}</span>

                      {/* Status / Play Now Pill */}
                      {isCompleted ? (
                        <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold shadow-xs flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {lvl.score || 95}
                        </span>
                      ) : isActive ? (
                        <>
                          <span
                            className={`absolute -inset-1 rounded-full animate-ping opacity-25 pointer-events-none ${
                              gameRole === "victim_game" ? "bg-amber-500" : "bg-rose-500"
                            }`}
                          />
                          <span
                            className={`absolute -top-2.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold shadow-xs flex items-center gap-1 whitespace-nowrap ${
                              gameRole === "victim_game" ? "bg-amber-500 text-neutral-950" : "bg-rose-600 text-white"
                            }`}
                          >
                            <Play className="w-2.5 h-2.5 fill-current" /> PLAY NOW
                          </span>
                        </>
                      ) : (
                        <span className="absolute -top-2.5 px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-mono text-[9px] font-bold flex items-center gap-0.5 shadow-2xs">
                          <Lock className="w-2.5 h-2.5" /> {lvl.reqXp || 300} XP
                        </span>
                      )}

                      {/* Level Number Footprint */}
                      <span className="absolute -bottom-1 px-1.5 py-0.2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-[9px] font-mono font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs">
                        {String(lvl.levelNumber).padStart(2, "0")}
                      </span>
                    </button>
                  )}

                  {/* Level Text Info Below Node */}
                  <div className="mt-2 text-center pointer-events-none max-w-[150px] px-1">
                    <div className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-100 truncate">
                      {lvl.title}
                    </div>
                    <div
                      className={`text-[10px] font-mono font-bold truncate mt-0.5 ${
                        isCompleted
                          ? "text-emerald-700 dark:text-emerald-400"
                          : isActive
                          ? gameRole === "victim_game"
                            ? "text-amber-700 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                          : "text-neutral-600 dark:text-neutral-400"
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
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-neutral-900 border-2 border-amber-500 hover:border-amber-400 shadow-lg shadow-amber-500/20 flex items-center justify-center text-3xl sm:text-4xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-amber-500/20"
                title="Buka Master Cyber Sentinel Vault"
              >
                <span>🎁</span>
                <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold shadow-xs">
                  VAULT
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Master Vault
                </div>
                <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
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

          {/* Main Battle Arena (Split View: Immersive Phone Simulator + Dynamic HUD) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ========================================================= */}
            {/* LEFT COLUMN: IMMERSIVE SMARTPHONE SIMULATOR SHELL         */}
            {/* ========================================================= */}
            <div className="lg:col-span-8 flex justify-center">
              <div
                className={`w-full max-w-[460px] rounded-[36px] sm:rounded-[40px] border-4 sm:border-[6px] ${
                  panicLevel >= 60
                    ? "border-rose-600 ring-4 ring-rose-500/40 animate-pulse"
                    : "border-zinc-800 dark:border-zinc-700"
                } bg-background shadow-2xl flex flex-col h-[640px] sm:h-[680px] overflow-hidden relative transition-all duration-300`}
              >
                {/* Floating Toast Score Notification */}
                {floatingToast && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg border ${
                        floatingToast.type === "good"
                          ? "bg-emerald-500 text-white border-emerald-400"
                          : floatingToast.type === "neutral"
                          ? "bg-blue-600 text-white border-blue-400"
                          : "bg-rose-600 text-white border-rose-400"
                      }`}
                    >
                      <span>{floatingToast.text}</span>
                      <span className="bg-black/25 px-1.5 py-0.5 rounded-full text-[10px]">
                        {floatingToast.score}
                      </span>
                    </div>
                  </div>
                )}

                {/* 1. Phone Top Status Bar */}
                <div className="px-5 pt-3 pb-1.5 bg-muted/90 flex items-center justify-between text-[11px] font-mono font-semibold text-foreground/80 shrink-0 select-none">
                  <span>09:41</span>
                  {/* Dynamic Island / Speaker Notch */}
                  <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                    <Signal className="w-3.5 h-3.5" />
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Chat App Header */}
                <div className="px-3.5 py-2.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold border shrink-0 relative ${
                        gameRole === "victim_game"
                          ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
                          : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                      }`}
                    >
                      {gameRole === "victim_game" ? activeLevel.icon : "🧑"}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </div>

                    <div className="overflow-hidden">
                      <h3 className="text-xs font-bold font-mono text-foreground flex items-center gap-1.5 truncate">
                        {gameRole === "victim_game" ? activeLevel.bossName : activeLevel.targetName}
                      </h3>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">
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
                </div>

                {/* 3. Chat Messages Body */}
                <div
                  ref={gameRole === "victim_game" ? victimChatRef : redteamChatRef}
                  className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/50 text-xs"
                >
                  {(gameRole === "victim_game" ? victimChatHistory : redteamChatHistory).map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-150`}
                    >
                      {m.sender === "bot" && (
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs mt-0.5 border ${
                            gameRole === "victim_game"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                          }`}
                        >
                          {gameRole === "victim_game" ? activeLevel.icon : "🧑"}
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl p-3 space-y-1 leading-relaxed ${
                          m.sender === "user"
                            ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                            : "bg-muted/75 border border-border text-foreground rounded-tl-xs"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {renderCleanMessage(m.text)}
                        </div>

                        <div className="text-[9px] text-muted-foreground/80 font-mono text-right flex items-center justify-end gap-1">
                          <span>{m.time}</span>
                          {m.sender === "user" && <Check className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </div>

                      {m.sender === "user" && (
                        <div className="w-7 h-7 rounded-full bg-muted shrink-0 flex items-center justify-center text-xs mt-0.5 border border-border">
                          {gameRole === "victim_game" ? "🛡️" : "🕵️"}
                        </div>
                      )}
                    </div>
                  ))}

                  {(gameRole === "victim_game" ? isScammerTyping : isTargetTyping) && (
                    <div className="flex gap-2 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded-xl border border-border">
                      <Zap className="w-3 h-3 text-primary animate-spin" />
                      <span>
                        {gameRole === "victim_game" ? "Boss AI sedang merespons..." : "Target sedang berpikir..."}
                      </span>
                    </div>
                  )}

                  {/* Inline Notification when Finished */}
                  {isCurrentGameFinished && (
                    <div className="p-3 bg-muted/60 border border-border text-center rounded-xl space-y-2 animate-in fade-in duration-200">
                      <div className="text-xs font-mono font-bold text-foreground flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Sesi Level Selesai!</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {gameRole === "victim_game"
                          ? playerHealth > 0
                            ? "Integritas terlindungi! Buka Debrief Screen untuk evaluasi teknis."
                            : "Integritas bobol! Anda terkena manipulasi lawan."
                          : targetSkepticism <= 0
                          ? "Simulasi Red Team berhasil menembus kewaspadaan target."
                          : "Target berhasil memblokir serangan manipulasi Anda."}
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => setIsDebriefOpen(true)}
                          className="text-xs h-7 bg-primary text-primary-foreground cursor-pointer font-mono font-bold"
                        >
                          Lihat Debrief Screen &rarr;
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Chat Input Bar */}
                <div className="p-2.5 bg-muted/80 border-t border-border shrink-0">
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
                          ? "Level telah selesai. Buka debrief untuk evaluasi."
                          : gameRole === "victim_game"
                          ? "Ketik balasan Anda ke penipu..."
                          : "Ketik kalimat manipulasi..."
                      }
                      disabled={isCurrentGameFinished || (gameRole === "victim_game" ? isScammerTyping : isTargetTyping)}
                      className="text-xs h-10 bg-background border-border rounded-xl disabled:opacity-60"
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
                      className="h-10 w-10 p-0 rounded-xl bg-primary text-primary-foreground shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: GAMIFIED STATUS PANEL (DYNAMIC METERS)      */}
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

                {/* Dynamic Status Meters */}
                {gameRole === "victim_game" ? (
                  <div className="space-y-3.5">
                    {/* Meter 1: Integritas Saldo & Data */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span>Integritas Saldo &amp; Data:</span>
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
                          {playerHealth}%
                        </span>
                      </div>
                      <Progress value={playerHealth} className="h-2.5" />
                    </div>

                    {/* Meter 2: Panic Level / Tekanan Psikologis */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Brain className="w-4 h-4 text-rose-500" />
                          <span>Tingkat Tekanan Psikologis:</span>
                        </span>
                        <span
                          className={`font-bold font-mono ${
                            panicLevel <= 30
                              ? "text-emerald-500"
                              : panicLevel <= 60
                              ? "text-amber-500"
                              : "text-rose-500"
                          }`}
                        >
                          {panicLevel}%
                        </span>
                      </div>
                      <Progress value={panicLevel} className="h-2.5" />
                    </div>

                    {/* Tombol Aksi Kritis: Blokir & Laporkan */}
                    {!isCurrentGameFinished ? (
                      <Button
                        size="sm"
                        onClick={handleBlockAndReport}
                        className="w-full text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold cursor-pointer gap-1.5 shadow-xs"
                      >
                        <Shield className="w-4 h-4" />
                        <span>🛡️ Blokir &amp; Laporkan Kasus</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsDebriefOpen(true)}
                        className="w-full text-xs h-9 bg-primary text-primary-foreground font-mono font-bold cursor-pointer gap-1.5"
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Buka Debrief Screen</span>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* Meter 1: Kepercayaan Target (Trust Meter) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Tingkat Kepercayaan Target:</span>
                        </span>
                        <span className="font-bold font-mono text-amber-500">{trustMeter}%</span>
                      </div>
                      <Progress value={trustMeter} className="h-2.5" />
                    </div>

                    {/* Meter 2: Kecurigaan Target (Suspicion Meter) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Flame className="w-4 h-4 text-rose-500" />
                          <span>Tingkat Curiga Target:</span>
                        </span>
                        <span className="font-bold font-mono text-rose-500">{targetSkepticism}%</span>
                      </div>
                      <Progress value={targetSkepticism} className="h-2.5" />
                    </div>

                    {/* Tombol Aksi Kritis: Akhiri Serangan & Debrief */}
                    {!isCurrentGameFinished ? (
                      <Button
                        size="sm"
                        onClick={handleEndOffense}
                        className="w-full text-xs h-9 bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold cursor-pointer gap-1.5 border border-border"
                      >
                        <span>⏹️ Akhiri Serangan &amp; Debrief</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsDebriefOpen(true)}
                        className="w-full text-xs h-9 bg-primary text-primary-foreground font-mono font-bold cursor-pointer gap-1.5"
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Buka Debrief Screen</span>
                      </Button>
                    )}
                  </div>
                )}

                {/* Post-Level Finished Action Box */}
                {isCurrentGameFinished && (
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

          {/* ========================================================= */}
          {/* INVESTIGATION DEBRIEF MODAL (SUMMARY & LAW DISSECTION)    */}
          {/* ========================================================= */}
          {isDebriefOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-card border border-border rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-foreground">
                        Debrief Forensik: Kasus #{activeLevel.levelNumber}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Evaluasi Taktik &amp; Kepatuhan Regulasi Siber
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDebriefOpen(false)}
                    aria-label="Tutup Debrief"
                    className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status banner */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono block">
                      {gameRole === "victim_game" ? "ANCAMAN DINETRALISIR DENGAN SUKSES" : "SIMULASI OPERASI RED TEAM SELESAI"}
                    </span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {gameRole === "victim_game"
                        ? "Anda berhasil menolak manipulasi psikologis dan mengamankan integritas data."
                        : "Evaluasi celah perilaku target berhasil dipetakan untuk materi edukasi."}
                    </p>
                  </div>
                </div>

                {/* Dissection Details */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-muted/40 border border-border rounded space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">Anatomi Modus:</span>
                    <p className="text-[11px] text-foreground leading-relaxed">
                      {activeLevel.synopsis}
                    </p>
                  </div>

                  <div className="p-2.5 bg-muted/40 border border-border rounded space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">Landasan Yuridis (UU ITE No. 1/2024):</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Pelanggaran modus ini dijerat <strong className="text-foreground">Pasal 30 ayat (3) jo. Pasal 46 ayat (3)</strong> peretasan sistem serta <strong className="text-foreground">Pasal 35 jo. Pasal 51 ayat (1)</strong> manipulasi data elektronik perbankan (ancaman 12 tahun penjara &amp; denda Rp12 Miliar).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 bg-muted/40 border border-border rounded text-center">
                      <span className="text-[10px] text-muted-foreground block">Skor XP Diperoleh</span>
                      <span className="font-bold text-amber-500 text-sm">+{activeLevel.xpNumber} XP</span>
                    </div>
                    <div className="p-2 bg-muted/40 border border-border rounded text-center">
                      <span className="text-[10px] text-muted-foreground block">Status Integritas</span>
                      <span className="font-bold text-emerald-500 text-sm">
                        {gameRole === "victim_game" ? `${playerHealth}% Aman` : `${trustMeter}% Terbuka`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDebriefOpen(false);
                      resetAllGames();
                    }}
                    className="text-xs h-9 flex-1 font-mono cursor-pointer"
                  >
                    Main Ulang Sesi Ini
                  </Button>

                  {(() => {
                    const nextLvl = currentCampaignLevels.find((l) => l.levelNumber === activeLevel.levelNumber + 1);
                    if (nextLvl) {
                      return (
                        <Button
                          size="sm"
                          onClick={() => {
                            setIsDebriefOpen(false);
                            handleStartLevel(nextLvl.id);
                          }}
                          className="text-xs h-9 flex-1 bg-primary text-primary-foreground font-mono font-bold cursor-pointer"
                        >
                          Lanjut ke Kasus Berikutnya &rarr;
                        </Button>
                      );
                    }
                    return (
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsDebriefOpen(false);
                          handleBackToCatalog();
                        }}
                        className="text-xs h-9 flex-1 bg-primary text-primary-foreground font-mono font-bold cursor-pointer"
                      >
                        Kembali ke Roadmap Kampanye
                      </Button>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
