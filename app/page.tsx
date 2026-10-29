"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Terminal,
  Clock,
  UserX,
  ExternalLink,
  ShieldCheck,
  Github,
  Zap,
  Sparkles,
  Award
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EducationalDisclaimer } from "@/components/trasp/educational-disclaimer";
import { RecognizeEngine } from "@/components/trasp/recognize-engine";
import { LearnSandbox } from "@/components/trasp/learn-sandbox";
import { ActContainment } from "@/components/trasp/act-containment";
import { RedTeamSimulator } from "@/components/trasp/red-team-simulator";

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<string>("recognize");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("apk-kurir");

  const handleSwitchToSandbox = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setActiveMainTab("learn");
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleSwitchToAct = () => {
    setActiveMainTab("act");
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-500">
      {/* Top Cyber Navigation Bar */}
      <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight font-mono text-foreground">
                  TRASP
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono">
                  v1.1.0
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Trust &amp; Scam Protection Workbench
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/40 text-[11px] font-mono text-muted-foreground">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>MIT-WEEK 2026 UNMUL</span>
            </div>

            <a
              href="https://github.com/raya-raihana/TRASP"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-1 space-y-6">
        {/* Hero Header */}
        <div className="space-y-2 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Guardians of the Digital Space: Navigating Digital Deception
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Cyber-Forensic &amp; Deception Triage Workbench
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Platform proteksi terintegrasi untuk mengenali modus tipuan digital, melatih ketahanan psikologis menghadapi pelaku, dan mengambil tindakan darurat terpadu.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-1 text-[11px] font-mono text-muted-foreground shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Privacy Shield: On-Device (0 Server Leak)</span>
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold">
              Deterministic Multi-Vector Engine
            </div>
          </div>
        </div>

        {/* Mandatory Educational Disclaimer (Juknis Rule 29) */}
        <EducationalDisclaimer />

        {/* Main 4-Engine Navigation Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1.5 bg-muted/60 border border-border rounded-xl gap-1">
            <TabsTrigger
              value="recognize"
              className="py-2.5 text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span>1. Recognize (Kenali)</span>
            </TabsTrigger>

            <TabsTrigger
              value="learn"
              className="py-2.5 text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Learn (Hero Sandbox)</span>
            </TabsTrigger>

            <TabsTrigger
              value="act"
              className="py-2.5 text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>3. Act (Mitigasi 15M)</span>
            </TabsTrigger>

            <TabsTrigger
              value="redteam"
              className="py-2.5 text-xs font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5 text-purple-500" />
              <span>4. Red Team (Mode Penipu)</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Recognize Engine */}
          <TabsContent value="recognize" className="space-y-6 mt-0">
            <RecognizeEngine onSwitchToSandbox={handleSwitchToSandbox} />
          </TabsContent>

          {/* Tab 2: Learn (Hero Split-Screen Sandbox) */}
          <TabsContent value="learn" className="space-y-6 mt-0">
            <LearnSandbox
              initialScenarioId={activeScenarioId}
              onSwitchToAct={handleSwitchToAct}
            />
          </TabsContent>

          {/* Tab 3: Act (Emergency Containment & Report) */}
          <TabsContent value="act" className="space-y-6 mt-0">
            <ActContainment />
          </TabsContent>

          {/* Tab 4: Red Team Role Reversal */}
          <TabsContent value="redteam" className="space-y-6 mt-0">
            <RedTeamSimulator />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 text-center text-xs text-muted-foreground space-y-2 mt-12">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-foreground font-mono">TRASP</span>
            <span>— Dikembangkan untuk Lomba Web Development MIT-WEEK 2026 UNMUL</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js 16 &middot; Tailwind v4 &middot; Drizzle ORM &middot; Neon DB</span>
            <a
              href="https://github.com/raya-raihana/TRASP/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-foreground font-mono"
            >
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
