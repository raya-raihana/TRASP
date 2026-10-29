"use client";

import { useState, useEffect } from "react";
import {
  IconSearch,
  IconTerminal2,
  IconAlertTriangle,
  IconUserX,
  IconShieldCheck,
  IconBrandGithub,
} from "@tabler/icons-react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { EducationalDisclaimer } from "@/components/trasp/educational-disclaimer";
import { RecognizeEngine } from "@/components/trasp/recognize-engine";
import { LearnSandbox } from "@/components/trasp/learn-sandbox";
import { ActContainment } from "@/components/trasp/act-containment";
import { RedTeamSimulator } from "@/components/trasp/red-team-simulator";

const TOOL_TITLES: Record<string, string> = {
  recognize: "1. Recognize (Forensic Inspector)",
  learn: "2. Learn (Hero Split-Screen Sandbox)",
  act: "3. Act (15-Minute Containment)",
  redteam: "4. Red Team (Scammer Simulation)",
};

export default function Home() {
  const [activeTool, setActiveTool] = useState<string>("recognize");
  const [activeScenarioId, setActiveScenarioId] = useState<string>("apk-kurir");

  // Read URL query params on mount without triggering suspense requirement
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

  const handleSelectPreset = (presetId: string) => {
    setActiveScenarioId(presetId);
    setActiveTool("recognize");
  };

  const handleSwitchToSandbox = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setActiveTool("learn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSwitchToAct = () => {
    setActiveTool("act");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onSelectPreset={handleSelectPreset}
      />
      <SidebarInset>
        <SiteHeader activeToolName={TOOL_TITLES[activeTool] || "TRASP Workbench"} />

        <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Workbench Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-mono">
                  TRASP Cyber-Forensic Workbench
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-mono"
                >
                  v1.2.0-STABLE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Trust &amp; Scam Protection Platform &mdash; MIT-WEEK 2026 Universitas Mulawarman
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/40 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Zero Server Data Leak
              </span>
            </div>
          </div>

          {/* Mandatory Rule 29 Educational Disclaimer */}
          <EducationalDisclaimer />

          {/* Top Quick-Switch Tabs (Responsive on Mobile and Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-muted/40 p-1.5 rounded-lg border border-border">
            <button
              onClick={() => setActiveTool("recognize")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTool === "recognize"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <IconSearch className="h-4 w-4 text-emerald-500" />
              <span>1. Recognize</span>
            </button>

            <button
              onClick={() => setActiveTool("learn")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTool === "learn"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <IconTerminal2 className="h-4 w-4 text-amber-500" />
              <span>2. Learn (Hero)</span>
            </button>

            <button
              onClick={() => setActiveTool("act")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTool === "act"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <IconAlertTriangle className="h-4 w-4 text-rose-500" />
              <span>3. Act (15-Min)</span>
            </button>

            <button
              onClick={() => setActiveTool("redteam")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTool === "redteam"
                  ? "bg-card text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <IconUserX className="h-4 w-4 text-purple-500" />
              <span>4. Red Team</span>
            </button>
          </div>

          {/* Active Tool Panels */}
          <div className="space-y-6">
            {activeTool === "recognize" && (
              <RecognizeEngine
                initialPresetId={activeScenarioId}
                onSwitchToSandbox={handleSwitchToSandbox}
              />
            )}

            {activeTool === "learn" && (
              <LearnSandbox
                initialScenarioId={activeScenarioId}
                onSwitchToAct={handleSwitchToAct}
              />
            )}

            {activeTool === "act" && (
              <ActContainment />
            )}

            {activeTool === "redteam" && (
              <RedTeamSimulator />
            )}
          </div>

          {/* Technical Workbench Footer */}
          <footer className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-bold text-foreground">TRASP</span>
              <span>&mdash; MIT-WEEK 2026 UNMUL</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Next.js 16 &middot; Tailwind CSS &middot; Neon DB</span>
              <a
                href="https://github.com/raya-raihana/TRASP"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline flex items-center gap-1"
              >
                <IconBrandGithub className="h-3.5 w-3.5" />
                Repo
              </a>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
