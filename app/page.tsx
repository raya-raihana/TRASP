"use client";

import { useState, useEffect } from "react";
import {
  IconSearch,
  IconTerminal2,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { RecognizeEngine } from "@/components/trasp/recognize-engine";
import { LearnSandbox } from "@/components/trasp/learn-sandbox";
import { ActContainment } from "@/components/trasp/act-containment";

const TOOL_TITLES: Record<string, string> = {
  recognize: "Recognize",
  learn: "Learn",
  act: "Act",
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

  const handleSwitchToAct = (scenarioId?: string) => {
    if (scenarioId) {
      setActiveScenarioId(scenarioId);
    }
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
      />
      <SidebarInset>
        <SiteHeader
          activeToolName={TOOL_TITLES[activeTool] || "TRASP"}
          onNavigateTool={(tool) => setActiveTool(tool)}
        />

        <div className="flex flex-1 flex-col p-4 md:p-6 space-y-5 max-w-6xl w-full mx-auto pb-20 md:pb-6">
          {/* Active Tool View */}
          <div className="space-y-5">
            {activeTool === "recognize" && (
              <RecognizeEngine
                initialPresetId={activeScenarioId}
                onPresetChange={setActiveScenarioId}
                onSwitchToSandbox={handleSwitchToSandbox}
                onSwitchToAct={handleSwitchToAct}
              />
            )}

            {activeTool === "learn" && (
              <LearnSandbox
                initialScenarioId={activeScenarioId}
                onSwitchToAct={handleSwitchToAct}
              />
            )}

            {activeTool === "act" && (
              <ActContainment initialScenarioId={activeScenarioId} />
            )}
          </div>
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (Native App Style, Thumb-friendly) */}
        <nav
          aria-label="Navigasi Utama Mobile"
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border md:hidden pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.4)]"
        >
          <div className="grid grid-cols-3 h-14 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTool("recognize");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer relative ${
                activeTool === "recognize"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <IconSearch className="h-5 w-5 mb-0.5" />
                {activeTool === "recognize" && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[11px] font-mono leading-none tracking-tight">Recognize</span>
              {activeTool === "recognize" && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("learn");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer relative ${
                activeTool === "learn"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <IconTerminal2 className="h-5 w-5 mb-0.5" />
                {activeTool === "learn" && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[11px] font-mono leading-none tracking-tight">Learn</span>
              {activeTool === "learn" && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool("act");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all active:scale-95 cursor-pointer relative ${
                activeTool === "act"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <IconAlertTriangle className="h-5 w-5 mb-0.5" />
                {activeTool === "act" && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[11px] font-mono leading-none tracking-tight">Act</span>
              {activeTool === "act" && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}
