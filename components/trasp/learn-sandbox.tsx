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

interface GameLevel {
  id: string;
  levelNumber: number;
  title: string;
  category: string;
  bossName: string;
  targetName: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  diffColor: string;
  icon: string;
  xp: string;
  synopsis: string;
  objective: string;
  tags: string[];
}

const GAME_LEVELS: GameLevel[] = [
  {
    id: "apk-kurir",
    levelNumber: 1,
    title: "Undangan & Resi Kurir .APK",
    category: "Android Malware / Banking Trojan",
    bossName: "Kurir J&T Palsu",
    targetName: "Warga Biasa",
    difficulty: "Easy",
    diffColor: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
    icon: "📦",
    xp: "+100 XP",
    synopsis: "Pelaku mengirimkan file LIHAT_FOTO_PAKET.apk lewat WhatsApp dan menekan korban harus menginstalnya dalam 2 jam.",
    objective: "Pertahankan HP Anda di atas 50% dengan menolak instalasi file APK liar dan mintalah nomor resi resmi.",
    tags: ["Trojan Dropper", "Sadap OTP", "Manipulasi Urgensi"],
  },
  {
    id: "loker-bumn",
    levelNumber: 2,
    title: "Task Scam & Loker BUMN",
    category: "Social Engineering / Deposit Ponzi",
    bossName: "HRD Gadungan",
    targetName: "Pencari Kerja",
    difficulty: "Medium",
    diffColor: "text-amber-400 border-amber-500/40 bg-amber-950/40",
    icon: "💼",
    xp: "+200 XP",
    synopsis: "Tawaran kerja paruh waktu komisi like & subscribe YouTube yang berujung instruksi deposit uang bertingkat di Telegram.",
    objective: "Kritisi skema komisi tidak masuk akal dan tolak mentransfer deposit uang talangan.",
    tags: ["Tugas Telegram", "Deposit Bertingkat", "Sunk Cost Trap"],
  },
  {
    id: "phishing-pajak",
    levelNumber: 3,
    title: "Phishing Pajak & Coretax",
    category: "Credential Harvesting / Impersonation",
    bossName: "Oknum DJP Palsu",
    targetName: "Wajib Pajak",
    difficulty: "Hard",
    diffColor: "text-rose-400 border-rose-500/40 bg-rose-950/40",
    icon: "🏛️",
    xp: "+300 XP",
    synopsis: "Pencatutan identitas Ditjen Pajak / BSSN yang mengancam sanksi dan denda jika tidak memverifikasi NIK di website tiruan.",
    objective: "Verifikasi keaslian domain URL dan tolak menyerahkan password akun atau identitas pribadi.",
    tags: ["Domain Palsu .xyz", "Ancaman Denda", "Pencurian Akun"],
  },
  {
    id: "m-banking-palsu",
    levelNumber: 4,
    title: "M-Banking Palsu & Kenaikan Tarif",
    category: "Banking Phishing / OTP Hijacking",
    bossName: "Sindikat Bank",
    targetName: "Nasabah Bank",
    difficulty: "Insane",
    diffColor: "text-purple-400 border-purple-500/40 bg-purple-950/40",
    icon: "🏦",
    xp: "+500 XP",
    synopsis: "Notifikasi darurat biaya transfer naik jadi Rp150.000/bulan dengan link formulir pembatalan untuk membegal OTP & PIN ATM.",
    objective: "Tepis intimidasi customer service palsu dan jangan pernah membocorkan PIN atau kode OTP SMS.",
    tags: ["Kenaikan Tarif", "Begal OTP SMS", "Social Engineering"],
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

  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>(
    SANDBOX_SCENARIOS[initialScenarioId] ? initialScenarioId : "apk-kurir"
  );
  const scenario =
    SANDBOX_SCENARIOS[selectedScenarioKey] || SANDBOX_SCENARIOS["apk-kurir"];

  const activeLevel =
    GAME_LEVELS.find((l) => l.id === selectedScenarioKey) || GAME_LEVELS[0];

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

        const savedScenario = localStorage.getItem("trasp_learn_scenario");
        if (savedScenario && SANDBOX_SCENARIOS[savedScenario]) {
          setSelectedScenarioKey(savedScenario);
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
          {/* Compact Quest Bar */}
          <div className="border border-border bg-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif font-bold text-foreground">
                  Cyber Quest Roadmap
                </h2>
                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
                  <span className="text-amber-500 font-bold">Level 1/4 Selesai</span>
                  <span>•</span>
                  <span>Total: 850 XP</span>
                </div>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 border border-border shrink-0 self-start sm:self-center rounded">
              <button
                type="button"
                onClick={() => setGameRole("victim_game")}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                  gameRole === "victim_game"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Mode: Korban (Defense)</span>
              </button>

              <button
                type="button"
                onClick={() => setGameRole("redteam_game")}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer rounded-xs ${
                  gameRole === "redteam_game"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Mode: Red Team (Offense)</span>
              </button>
            </div>
          </div>

          {/* Gamified Visual Path Canvas */}
          <div className="relative w-full max-w-xl mx-auto h-[580px] sm:h-[640px] p-4 bg-muted/10 border border-border rounded overflow-hidden select-none">
            {/* Cyber Grid Dot Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

            {/* Glowing SVG Path Connector */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none -z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Base dashed line */}
              <path
                d="M 28 10 Q 50 20, 72 30 Q 50 40, 28 50 Q 50 60, 72 70 Q 60 80, 50 90"
                fill="none"
                stroke="currentColor"
                className="text-border"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
              {/* Active neon progress line */}
              <path
                d="M 28 10 Q 50 20, 72 30"
                fill="none"
                stroke="url(#questGlowGradient)"
                strokeWidth="3.5"
              />
              <defs>
                <linearGradient id="questGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Node 1: Trojan APK */}
            <div className="absolute left-[28%] top-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => handleStartLevel("apk-kurir")}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-500/20"
                title="Mainkan Level 1: Trojan APK"
              >
                <span>📦</span>
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> 95
                </span>
                <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-emerald-500/40 rounded text-[9px] font-mono font-bold text-foreground">
                  01
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground">
                  Trojan APK
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-semibold">
                  +100 XP • Selesai
                </div>
              </div>
            </div>

            {/* Node 2: Task Scam (Current Active) */}
            <div className="absolute left-[72%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => handleStartLevel("loker-bumn")}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-amber-500 shadow-xl shadow-amber-500/30 flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-amber-500/30 animate-pulse"
                title="Mainkan Level 2: Task Scam"
              >
                <span>💼</span>
                <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-mono text-[10px] font-bold shadow-xs flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" /> Main
                </span>
                <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-amber-500/40 rounded text-[9px] font-mono font-bold text-foreground">
                  02
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground">
                  Task Scam
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-semibold">
                  +200 XP • Misi Aktif
                </div>
              </div>
            </div>

            {/* Node 3: Phishing Pajak */}
            <div className="absolute left-[28%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => handleStartLevel("phishing-pajak")}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-border hover:border-rose-500/80 shadow-md flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-muted"
                title="Mainkan Level 3: Phishing Pajak"
              >
                <span>🏛️</span>
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-mono text-[10px] font-bold">
                  Level 03
                </span>
                <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-border rounded text-[9px] font-mono font-bold text-muted-foreground">
                  03
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground">
                  Phishing Pajak
                </div>
                <div className="text-[10px] font-mono text-muted-foreground font-semibold">
                  +300 XP
                </div>
              </div>
            </div>

            {/* Node 4: Begal OTP Bank */}
            <div className="absolute left-[72%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => handleStartLevel("m-banking-palsu")}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-border hover:border-purple-500/80 shadow-md flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-muted"
                title="Mainkan Level 4: Begal OTP Bank"
              >
                <span>🏦</span>
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-mono text-[10px] font-bold">
                  Boss Level
                </span>
                <span className="absolute -bottom-1 px-1.5 py-0.2 bg-background border border-border rounded text-[9px] font-mono font-bold text-muted-foreground">
                  04
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground">
                  Begal OTP Bank
                </div>
                <div className="text-[10px] font-mono text-muted-foreground font-semibold">
                  +500 XP
                </div>
              </div>
            </div>

            {/* Node 5: Mystery Chest (Hadiah Guardian) */}
            <div className="absolute left-[50%] top-[90%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
              <button
                type="button"
                onClick={() => setIsChestOpen(true)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-2 border-amber-500/60 hover:border-amber-400 shadow-xl shadow-amber-500/20 flex items-center justify-center text-2xl sm:text-3xl transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-amber-500/20"
                title="Buka Peti Hadiah Guardian"
              >
                <span>🎁</span>
                <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-[10px] font-bold">
                  Reward
                </span>
              </button>
              <div className="mt-2 text-center pointer-events-none">
                <div className="text-xs sm:text-sm font-bold font-mono text-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Mystery Chest
                </div>
                <div className="text-[10px] font-mono text-amber-400 font-semibold">
                  Lencana Guardian
                </div>
              </div>
            </div>
          </div>

          {/* Mystery Chest Modal */}
          {isChestOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border max-w-sm w-full p-5 text-center space-y-3 rounded shadow-xl animate-in zoom-in-95 duration-150">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-foreground">
                    Peti Rahasia Forensik
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lencana Cyber Guardian 2026 terbuka untuk investigasi siber.
                  </p>
                </div>
                <div className="p-2.5 bg-muted/40 border border-border rounded text-xs font-mono text-foreground space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total XP:</span>
                    <span className="font-bold text-amber-500">+1,100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-bold text-emerald-500">Tier III (Elite)</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsChestOpen(false)}
                  className="w-full text-xs h-8 bg-primary text-primary-foreground font-mono font-medium"
                >
                  Tutup &amp; Lanjutkan Latihan
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: ARENA PERMAINAN INTERAKTIF                        */}
      {/* ========================================================= */}
      {gameView === "arena" && (
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
