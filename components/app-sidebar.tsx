"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconAlertTriangle,
  IconDeviceMobile,
  IconFileText,
  IconFolder,
  IconReport,
  IconSearch,
  IconShieldCheck,
  IconTerminal2,
  IconUserX,
  IconUsers,
} from "@tabler/icons-react"
import { TeamInfoDialog } from "@/components/trasp/team-info-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTool?: string
  activePreset?: string
  onSelectTool?: (tool: string) => void
  onSelectPreset?: (presetId: string) => void
}

export function AppSidebar({
  activeTool = "recognize",
  activePreset,
  onSelectTool,
  onSelectPreset,
  ...props
}: AppSidebarProps) {
  const router = useRouter()
  const { setOpenMobile, isMobile } = useSidebar()

  const handleToolSelect = (id: string) => {
    if (onSelectTool) {
      onSelectTool(id)
    } else {
      router.push(`/?tool=${id}`)
    }
    if (isMobile) setOpenMobile(false)
  }

  const handlePresetSelect = (id: string) => {
    if (onSelectTool && onSelectPreset) {
      onSelectTool("recognize")
      onSelectPreset(id)
    } else {
      router.push(`/?tool=recognize&preset=${id}`)
    }
    if (isMobile) setOpenMobile(false)
  }

  const tools = [
    {
      id: "recognize",
      title: "1. Recognize (Kenali)",
      icon: IconSearch,
    },
    {
      id: "learn",
      title: "2. Learn (Simulasi)",
      icon: IconTerminal2,
    },
    {
      id: "act",
      title: "3. Act (Mitigasi)",
      icon: IconAlertTriangle,
    },
    {
      id: "redteam",
      title: "4. Red Team",
      icon: IconUserX,
    },
  ]

  const presets = [
    {
      id: "apk-kurir",
      title: "Kasus 1: Undangan .APK",
      icon: IconDeviceMobile,
    },
    {
      id: "loker-bumn",
      title: "Kasus 2: Loker BUMN",
      icon: IconFileText,
    },
    {
      id: "phishing-pajak",
      title: "Kasus 3: Phishing Pajak",
      icon: IconAlertTriangle,
    },
    {
      id: "m-banking-palsu",
      title: "Kasus 4: M-Banking Editan",
      icon: IconReport,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground border border-border">
                <IconShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-serif font-bold tracking-tight text-sidebar-foreground">
                  TRASP Workbench
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  MIT-WEEK 2026 UNMUL
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Core Forensic Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Menu Proteksi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const isActive = activeTool === tool.id
                return (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      onClick={() => handleToolSelect(tool.id)}
                      isActive={isActive}
                      className="cursor-pointer"
                    >
                      <tool.icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{tool.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Preset Case Studies */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Studi Kasus
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {presets.map((preset) => (
                <SidebarMenuItem key={preset.id}>
                  <SidebarMenuButton
                    onClick={() => handlePresetSelect(preset.id)}
                    isActive={activeTool === "recognize" && activePreset === preset.id}
                    className="cursor-pointer text-xs"
                  >
                    <preset.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{preset.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-xs">
                  <Link href="/mobile">
                    <IconDeviceMobile className="h-4 w-4" />
                    <span>Mode Tampilan Mobile (/mobile)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <TeamInfoDialog
                  trigger={
                    <SidebarMenuButton className="cursor-pointer text-xs">
                      <IconUsers className="h-4 w-4" />
                      <span>Informasi Tim (MIT-010)</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-xs">
                  <a
                    href="https://github.com/raya-raihana/TRASP"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconFolder className="h-4 w-4" />
                    <span>GitHub Repositori</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Zero Server Leak</span>
        </div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
