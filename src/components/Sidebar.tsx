import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";
import { ChevronDown, HashIcon, MicIcon, SpeakerIcon } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Server from "@/types/Server";

export default function AppSidebar({
  server,
  children,
}: Readonly<{
  server?: Server;
  children: React.ReactNode;
}>) {
  return (
    server ? <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Select Server
                    <ChevronDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Acme Corp.</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-2">
          {server.channels.map((channel) => (
            <SidebarMenuButton key={channel.id} className="gap-1.5">
              {channel.kind === 'voice' ? <MicIcon /> : <HashIcon />}
              {channel.name}
            </SidebarMenuButton>
          ))}
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider> :
    children
  );
}
