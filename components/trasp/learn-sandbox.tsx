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
      const match = matchCustomUserReply(text, selectedScenarioKey, 0);
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "scammer",
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
        if (newVuln >= 85 || newVuln <= 15 || updatedHistory.length >= 7) {
          setIsVictimGameFinished(true);
        }
      } else {
        throw new Error("Chat bot API offline");
      }
    } catch {
      const match = matchCustomUserReply(text, selectedScenarioKey, 0);
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
      if (newVuln >= 85 || newVuln <= 15 || updatedHistory.length >= 7) {
        setIsVictimGameFinished(true);
      }
    } finally {
      setIsScammerTyping(false);
    }
  };

  // User as Red Team sends phishing attack to Target Bot
  const handleSendRedteamChat = async (replyText?: string) => {
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
        if (newSkep <= 20 || updatedHistory.length >= 7) {
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
      if (newSkep <= 20 || updatedHistory.length >= 7) {
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

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* VIEW 1: KATALOG LEVEL & TANTANGAN GAME                    */}
      {/* ========================================================= */}
      {gameView === "catalog" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Katalog Misi */}
          <div className="border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  ARENA SIMULASI GAME SIBER
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  TryHackMe &amp; BISA AI Style
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-foreground mt-1">
                Katalog Misi &amp; Arena Simulasi Kejahatan Siber
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl mt-0.5 leading-relaxed">
                Pilih peran dan skenario level tantangan di bawah ini untuk menguji ketahanan mental dan kejelian forensik Anda melawan simulasi kecerdasan buatan.
              </p>
            </div>

            {/* Role Selector Header */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 border border-border shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setGameRole("victim_game")}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameRole === "victim_game"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Role: Korban</span>
              </button>

              <button
                type="button"
                onClick={() => setGameRole("redteam_game")}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  gameRole === "redteam_game"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Role: Red Team</span>
              </button>
            </div>
          </div>

          {/* Grid 4 Kartu Level Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GAME_LEVELS.map((lvl) => (
              <div
                key={lvl.id}
                onClick={() => handleStartLevel(lvl.id)}
                className="group relative border border-border bg-card hover:border-primary/60 transition-all p-4 rounded flex flex-col justify-between cursor-pointer hover:shadow-xs space-y-3.5"
              >
                <div className="space-y-2.5">
                  {/* Top Row: Level & XP */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded border border-border/50">
                        LEVEL 0{lvl.levelNumber}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold rounded ${lvl.diffColor}`}>
                        {lvl.difficulty}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {lvl.xp}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-12 h-12 rounded bg-muted/60 border border-border flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {lvl.icon}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                        {lvl.title}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {lvl.category}
                      </span>
                    </div>
                  </div>

                  {/* Target / Boss Info */}
                  <div className="text-xs font-mono p-2 bg-muted/40 border border-border/60 rounded flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">
                      {gameRole === "victim_game" ? "Lawan:" : "Target:"}
                    </span>
                    <span className="font-bold text-foreground text-[11px]">
                      {gameRole === "victim_game" ? `${lvl.bossName} (Boss AI)` : `${lvl.targetName} (Target AI)`}
                    </span>
                  </div>

                  {/* Synopsis */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lvl.synopsis}
                  </p>

                  {/* Objective */}
                  <div className="text-[11px] text-foreground/90 font-medium bg-background p-2 rounded border border-border/50 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Misi:</strong> {lvl.objective}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lvl.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 border-t border-border/60">
                  <div className="w-full py-2 px-3 rounded text-xs font-mono font-bold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20 transition-all flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Mainkan Level Ini
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              </div>

              {/* Quick Tactical Hints Strip */}
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

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-muted/60 border-t border-border shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
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
                      gameRole === "victim_game"
                        ? "Ketik balasan Anda ke penipu..."
                        : "Ketik kalimat serangan manipulasi Anda..."
                    }
                    disabled={gameRole === "victim_game" ? isScammerTyping : isTargetTyping}
                    className="text-xs h-9 bg-background border-border"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      gameRole === "victim_game"
                        ? !victimInput.trim() || isScammerTyping
                        : !redteamInput.trim() || isTargetTyping
                    }
                    className="h-9 px-3 bg-primary text-primary-foreground font-medium cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: GAME BATTLE HUD & LEVEL STATS (Playful)    */}
            {/* ========================================================= */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              {/* Level Room Summary Card */}
              <div className="bg-card border border-border p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                    <Swords className="w-4 h-4 text-primary" />
                    <span>Level {activeLevel.levelNumber}: {activeLevel.title}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-mono ${activeLevel.diffColor}`}>
                    {activeLevel.difficulty}
                  </Badge>
                </div>

                {/* Health / Progress Meter */}
                {gameRole === "victim_game" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>HP Pertahanan Anda:</span>
                      </span>
                      <span
                        className={`font-bold ${
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
                    <Progress value={playerHealth} className="h-2.5" />
                    <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-1">
                      <span>Status Karakter:</span>
                      <span className="font-semibold text-foreground">
                        {playerHealth >= 80
                          ? "🛡️ Kebal Manipulasi"
                          : playerHealth >= 40
                          ? "⚠️ Mulai Ragu"
                          : "💥 Kena Trap!"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Kewaspadaan Target:</span>
                      </span>
                      <span
                        className={`font-bold ${
                          targetSkepticism >= 70
                            ? "text-emerald-500"
                            : targetSkepticism >= 40
                            ? "text-amber-500"
                            : "text-rose-500"
                        }`}
                      >
                        {targetSkepticism}%
                      </span>
                    </div>
                    <Progress value={targetSkepticism} className="h-2.5" />
                    <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-1">
                      <span>Reaksi Target:</span>
                      <span className="font-semibold text-foreground">
                        {targetSkepticism >= 75
                          ? "🧐 Sangat Curiga"
                          : targetSkepticism >= 35
                          ? "🤔 Mulai Panik"
                          : "😵 Percaya Total!"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Misi Stage */}
                <div className="p-3 bg-muted/40 border border-border space-y-1 text-xs">
                  <span className="font-mono text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Tujuan Misi:
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {gameRole === "victim_game"
                      ? `Pertahankan HP Anda di atas 50% dari gempuran ${activeLevel.bossName}. Jangan klik berkas atau transfer uang!`
                      : `Gunakan trik rekayasa sosial untuk menurunkan kewaspadaan ${activeLevel.targetName} hingga di bawah 20%!` }
                  </p>
                </div>

                {/* LIVE SCAMMER TELEMETRY X-RAY / TARGET INTEL */}
                <div className="p-3 bg-card border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {gameRole === "victim_game" ? "LIVE SCAMMER TELEMETRY X-RAY" : "TARGET INTEL MONITOR"}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {scammerTelemetry.source || "gemini-ai"}
                    </Badge>
                  </div>
                  
                  {gameRole === "victim_game" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Taktik Aktif:</span>
                        <span className="font-semibold text-rose-500 dark:text-rose-400">
                          {scammerTelemetry.activeTactic || "Manipulasi Taktis Siber"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Mood Penipu:</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                          {scammerTelemetry.scammerMood || "PUSHING"}
                        </Badge>
                      </div>
                      <div className="pt-1 border-t border-border/40">
                        <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">
                          Monolog Batin Pelaku:
                        </span>
                        <p className="text-[11px] italic text-foreground/90 bg-muted/40 p-2 border-l-2 border-primary">
                          &quot;{scammerTelemetry.internalThought || "Target merespons di luar skenario. Harus ditekan lagi agar buru-buru menuruti perintah."}&quot;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Status Kewaspadaan:</span>
                        <span className="font-semibold text-amber-500">
                          {targetSkepticism >= 70 ? "Sangat Waspada" : targetSkepticism >= 35 ? "Mulai Goyah" : "Termakan Umpan"}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-border/40">
                        <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">
                          Monolog Batin Korban:
                        </span>
                        <p className="text-[11px] italic text-foreground/90 bg-muted/40 p-2 border-l-2 border-amber-500">
                          &quot;{victimThought || "Saya agak curiga, nomor ini tidak dikenal dan mendesak tindakan mendadak."}&quot;
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Completion Box */}
                {(gameRole === "victim_game" ? isVictimGameFinished : isRedteamFinished) && (
                  <div className="p-3 bg-primary/10 border border-primary/30 text-center space-y-2">
                    <div className="text-xs font-bold text-primary flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Level Selesai!</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetAllGames()}
                        className="text-xs h-7 cursor-pointer"
                      >
                        Main Lagi
                      </Button>
                      {onSwitchToAct && (
                        <Button
                          size="sm"
                          onClick={() => onSwitchToAct(selectedScenarioKey)}
                          className="text-xs h-7 bg-primary text-primary-foreground cursor-pointer"
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
