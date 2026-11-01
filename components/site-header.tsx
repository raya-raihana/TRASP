"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconBrandGithub } from "@tabler/icons-react";

interface SiteHeaderProps {
  activeToolName?: string;
  onNavigateTool?: (tool: string) => void;
}

export function SiteHeader({ activeToolName = "Recognize" }: SiteHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium hidden sm:inline">TRASP</span>
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <span className="font-semibold text-foreground">{activeToolName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href="https://github.com/raya-raihana/TRASP"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <IconBrandGithub className="h-4 w-4" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
