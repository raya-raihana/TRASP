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

        <div className="flex flex-1 flex-col p-4 md:p-6 space-y-5 max-w-6xl w-full mx-auto">
          {/* Compact Mobile-Only Tool Switcher (3 Tools Only) */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-none bg-muted/40 border border-border md:hidden text-xs">
            <button
              onClick={() => setActiveTool("recognize")}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-none font-medium transition-colors ${
                activeTool === "recognize"
                  ? "bg-background text-foreground shadow-none font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconSearch className="h-4 w-4 mb-0.5" />
              <span>Recognize</span>
            </button>

            <button
              onClick={() => setActiveTool("learn")}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-none font-medium transition-colors ${
                activeTool === "learn"
                  ? "bg-background text-foreground shadow-none font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconTerminal2 className="h-4 w-4 mb-0.5" />
              <span>Learn</span>
            </button>

            <button
              onClick={() => setActiveTool("act")}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-none font-medium transition-colors ${
                activeTool === "act"
                  ? "bg-background text-foreground shadow-none font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconAlertTriangle className="h-4 w-4 mb-0.5" />
              <span>Act</span>
            </button>
          </div>

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
      </SidebarInset>
    </SidebarProvider>
  );
}
