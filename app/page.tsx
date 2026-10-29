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
import { EducationalDisclaimer } from "@/components/trasp/educational-disclaimer";
import { RecognizeEngine } from "@/components/trasp/recognize-engine";
import { LearnSandbox } from "@/components/trasp/learn-sandbox";
import { ActContainment } from "@/components/trasp/act-containment";
import { RedTeamSimulator } from "@/components/trasp/red-team-simulator";

const TOOL_TITLES: Record<string, string> = {
  recognize: "Forensic Inspector",
  learn: "Sandbox Simulasi",
  act: "Mitigasi Darurat",
  redteam: "Mode Red Team",
};

export default function Home() {
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
          "--sidebar-width": "calc(var(--spacing) * 64)",
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
        <SiteHeader activeToolName={TOOL_TITLES[activeTool] || "TRASP"} />

        <div className="flex flex-1 flex-col p-4 md:p-6 space-y-5 max-w-6xl w-full mx-auto">
          {/* Subtle Compliance Disclaimer */}
          <EducationalDisclaimer />

          {/* Compact Mobile-Only Tool Switcher (Hidden on Desktop because Sidebar is visible) */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-md bg-muted/40 border border-border md:hidden text-xs">
            <button
              onClick={() => setActiveTool("recognize")}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded font-medium transition-colors ${
                activeTool === "recognize"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconSearch className="h-4 w-4 mb-0.5" />
              <span>Kenali</span>
            </button>

            <button
              onClick={() => setActiveTool("learn")}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded font-medium transition-colors ${
                activeTool === "learn"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconTerminal2 className="h-4 w-4 mb-0.5" />
              <span>Simulasi</span>
            </button>

            <button
              onClick={() => setActiveTool("act")}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded font-medium transition-colors ${
                activeTool === "act"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconAlertTriangle className="h-4 w-4 mb-0.5" />
              <span>Mitigasi</span>
            </button>

            <button
              onClick={() => setActiveTool("redteam")}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded font-medium transition-colors ${
                activeTool === "redteam"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconUserX className="h-4 w-4 mb-0.5" />
              <span>Red Team</span>
            </button>
          </div>

          {/* Active Tool View */}
          <div className="space-y-5">
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

          {/* Minimal Clean Footer */}
          <footer className="mt-auto pt-6 pb-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">TRASP &middot; MIT-WEEK 2026 UNMUL</span>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/raya-raihana/TRASP"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1 font-mono"
              >
                <IconBrandGithub className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
