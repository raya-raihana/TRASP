"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconFolder,
  IconSearch,
  IconTerminal2,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";
import { TeamInfoDialog } from "@/components/trasp/team-info-dialog";
import { VideoDemoDialog } from "@/components/trasp/video-demo-dialog";
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
} from "@/components/ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTool?: string;
  onSelectTool?: (tool: string) => void;
}

export function AppSidebar({
  activeTool = "recognize",
  onSelectTool,
  ...props
}: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleToolSelect = (id: string) => {
    if (onSelectTool) {
      onSelectTool(id);
    } else {
      router.push(`/?tool=${id}`);
    }
    if (isMobile) setOpenMobile(false);
  };

  const tools = [
    {
      id: "recognize",
      title: "Recognize",
      icon: IconSearch,
    },
    {
      id: "learn",
      title: "Learn",
      icon: IconTerminal2,
    },
    {
      id: "act",
      title: "Act",
      icon: IconAlertTriangle,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1.5 flex items-center">
              <span className="text-base font-serif font-black tracking-wider text-sidebar-foreground">
                TRASP
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Core Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation (Bawah) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TeamInfoDialog
                  trigger={
                    <SidebarMenuButton className="cursor-pointer text-xs">
                      <IconUsers className="h-4 w-4" />
                      <span>Informasi Tim</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <VideoDemoDialog
                  trigger={
                    <SidebarMenuButton className="cursor-pointer text-xs">
                      <IconVideo className="h-4 w-4 text-primary" />
                      <span>Video Live</span>
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
                    <span>GitHub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 flex flex-row items-center justify-between">
        <span className="text-xs font-mono font-semibold text-muted-foreground">
          Tiga Trio
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
