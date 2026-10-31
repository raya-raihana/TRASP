"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconTerminal2,
  IconAlertTriangle,
  IconUserX,
  IconShieldCheck,
  IconDeviceDesktop,
  IconBrandGithub,
  IconDeviceMobile,
  IconFileText,
  IconReport,
} from "@tabler/icons-react";
import { RecognizeEngine } from "@/components/trasp/recognize-engine";
import { LearnSandbox } from "@/components/trasp/learn-sandbox";
import { ActContainment } from "@/components/trasp/act-containment";
import { RedTeamSimulator } from "@/components/trasp/red-team-simulator";
import { EducationalDisclaimer } from "@/components/trasp/educational-disclaimer";
import { TeamInfoDialog } from "@/components/trasp/team-info-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

const TOOL_TITLES: Record<string, string> = {
  recognize: "Forensic Inspector",
  learn: "Sandbox Simulasi",
  act: "Mitigasi Darurat",
  redteam: "Mode Red Team",
};

export default function MobilePage() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<string>("recognize");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("apk-kurir");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get("tool");
      const presetParam = params.get("preset");
      if (toolParam && TOOL_TITLES[toolParam]) {
        setActiveTool(toolParam);
      }
      if (presetParam) {
        setActiveScenarioId(presetParam);
      }
    }
  }, []);

  const setToolAndUrl = (tool: string, preset?: string) => {
    setActiveTool(tool);
    const chosenPreset = preset || activeScenarioId;
    if (preset) {
      setActiveScenarioId(preset);
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tool", tool);
      if (chosenPreset) {
        url.searchParams.set("preset", chosenPreset);
      }
      window.history.replaceState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const presets = [
    { id: "apk-kurir", label: "Undangan .APK", icon: IconDeviceMobile },
    { id: "loker-bumn", label: "Loker BUMN", icon: IconFileText },
    { id: "phishing-pajak", label: "Phishing Pajak", icon: IconAlertTriangle },
    { id: "m-banking-palsu", label: "M-Banking Palsu", icon: IconReport },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 selection:bg-primary selection:text-primary-foreground">
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground border border-border">
            <IconShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-serif font-bold tracking-tight">TRASP</span>
              <span className="text-[10px] font-mono text-muted-foreground">/ Mobile</span>
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">
              MIT-WEEK 2026 (MIT-010)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TeamInfoDialog
            trigger={
              <button
                type="button"
                className="px-2 py-1 text-[11px] font-mono border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors"
                title="Informasi Tim"
              >
                Tim
              </button>
            }
          />
          <Link
            href="/?desktop=true"
            className="p-1.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
            title="Buka Mode Desktop"
          >
            <IconDeviceDesktop className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Preset Case Quick Strip */}
      <div className="bg-muted/30 border-b border-border px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-muted-foreground shrink-0 uppercase tracking-wider">
          Kasus:
        </span>
        {presets.map((preset) => {
          const isSelected = activeScenarioId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setToolAndUrl("recognize", preset.id)}
              className={`shrink-0 px-2 py-1 text-[11px] font-medium transition-colors border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <main className="flex-1 p-3 space-y-4 max-w-2xl w-full mx-auto">
        <EducationalDisclaimer />

        {/* Dynamic Tool Content */}
        <div className="space-y-4">
          {activeTool === "recognize" && (
            <RecognizeEngine
              initialPresetId={activeScenarioId}
              onPresetChange={setActiveScenarioId}
              onSwitchToSandbox={(scenarioId) => setToolAndUrl("learn", scenarioId)}
            />
          )}

          {activeTool === "learn" && (
            <LearnSandbox
              initialScenarioId={activeScenarioId}
              onSwitchToAct={(scenarioId) => setToolAndUrl("act", scenarioId)}
            />
          )}

          {activeTool === "act" && <ActContainment initialScenarioId={activeScenarioId} />}

          {activeTool === "redteam" && <RedTeamSimulator />}
        </div>

        {/* Minimal Mobile Footer */}
        <footer className="pt-6 pb-4 border-t border-border flex flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <div className="font-mono text-[11px]">
            <span>TRASP &middot; Tim Tiga Trio (MIT-010)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <Link href="/?desktop=true" className="underline hover:text-foreground">
              Mode Desktop
            </Link>
            <span>&middot;</span>
            <a
              href="https://github.com/raya-raihana/TRASP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <IconBrandGithub className="h-3 w-3" />
              GitHub
            </a>
          </div>
        </footer>
      </main>

      {/* Fixed Sharp Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-none">
        <div className="grid grid-cols-4 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setToolAndUrl("recognize")}
            className={`flex flex-col items-center justify-center py-2.5 transition-colors border-r border-border cursor-pointer ${
              activeTool === "recognize"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconSearch className="h-4 w-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Kenali</span>
          </button>

          <button
            type="button"
            onClick={() => setToolAndUrl("learn")}
            className={`flex flex-col items-center justify-center py-2.5 transition-colors border-r border-border cursor-pointer ${
              activeTool === "learn"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconTerminal2 className="h-4 w-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Simulasi</span>
          </button>

          <button
            type="button"
            onClick={() => setToolAndUrl("act")}
            className={`flex flex-col items-center justify-center py-2.5 transition-colors border-r border-border cursor-pointer ${
              activeTool === "act"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconAlertTriangle className="h-4 w-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Mitigasi</span>
          </button>

          <button
            type="button"
            onClick={() => setToolAndUrl("redteam")}
            className={`flex flex-col items-center justify-center py-2.5 transition-colors cursor-pointer ${
              activeTool === "redteam"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <IconUserX className="h-4 w-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Red Team</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
