"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";
import { ChevronDown, HashIcon, MicIcon } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Server from "@/types/server";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AppSidebar({
  server,
  children,
}: Readonly<{
  server?: Server;
  children: React.ReactNode;
}>) {
  const [servers, setServers] = useState<[string, string][]>([]);
  const [newServer, setNewServer] = useState({ name: "", ip: "" });

  useEffect(() => {
    const s = Cookies.get("servers")?.split(",");
    if (s) setServers(s.map((x) => x.trim().split("@") as [string, string]));
  }, []);

  const handleAddServer = () => {
    if (!newServer.ip) return;
    const updatedServers = [
      ...servers,
      [newServer.ip, newServer.name] as [string, string],
    ];

    setServers(updatedServers);
    Cookies.set("servers", updatedServers.map((x) => x.join("@")).join(","), {
      expires: 7,
    });
    setNewServer({ name: "", ip: "" });
  };

  return server ? (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add server</DialogTitle>
          <DialogDescription>
            Add a new server to your server list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              name="name"
              value={newServer.name}
              onChange={(e) =>
                setNewServer((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Voxa Server"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="ip-1">Server Ip</Label>
            <Input
              id="ip-1"
              name="ip"
              value={newServer.ip}
              onChange={(e) =>
                setNewServer((prev) => ({ ...prev, ip: e.target.value }))
              }
              placeholder="192.168.1.5"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleAddServer}>
              Add server
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      <SidebarProvider defaultOpen>
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
                    {servers.map((s, i) => (
                      <DropdownMenuItem key={i} asChild>
                        <Link href={"/server/" + s[0]}>{s[1] || s[0]}</Link>
                      </DropdownMenuItem>
                    ))}

                    <DialogTrigger asChild>
                      <DropdownMenuItem>Add Server</DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="px-2">
            {server.channels.map((channel) => (
              <SidebarMenuButton key={channel.id} className="gap-1.5">
                {channel.kind === "voice" ? <MicIcon /> : <HashIcon />}
                {channel.name}
              </SidebarMenuButton>
            ))}
          </SidebarContent>
        </Sidebar>
        {children}
      </SidebarProvider>
    </Dialog>
  ) : (
    children
  );
}
