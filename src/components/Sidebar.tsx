"use client";

import {
  HashIcon,
  MessageCircle,
  Plus,
  Search,
  Volume2Icon,
} from "lucide-react";
import { Server, Channel, Message } from "@/types/types";
import React, { useEffect, useMemo, useState } from "react";
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
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/hooks/get-user";
import ProfilePicture from "./ProfilePicture";
import auth from "@/lib/auth";
import { toast } from "sonner";
import SettingsDialog from "./settings/SettingsDialog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import App from "@/types/app";
import { ProfileSettings } from "@/types/settings";
import axios from "axios";

export default function AppSidebar({
  children,
  chatWith,
  onNewMessage,
  server,
  app,
}: Readonly<{
  onNewMessage?: (msg: Message) => void;
  chatWith?: string;
  children?: React.ReactNode;
  server?: Server | undefined;
  app: App;
}>) {
  const [servers, setServers] = useState<[string, string][]>([]);
  const [newServer, setNewServer] = useState({ name: "", ip: "" });
  const [query, setQuery] = useState("");
  const router = useRouter();

  const dms = useMemo(() => {
    return Array.from(
      new Set(
        app.messages
          ?.flatMap((item) => [item.from, item.channel_id])
          .filter((item) => item !== app.profile?.id) || []
      )
    );
  }, [app.messages, app.profile?.id]);

  useEffect(() => {
    const load = async () => {
      const users = await Promise.all(dms.map((id) => app.getUserById(id)));
      app.setDms(
        users.filter(
          (user) =>
            user !== null &&
            (user?.username.toLowerCase().includes(query.toLowerCase()) ||
              user?.id.toLowerCase().includes(query.toLowerCase()))
        ) as UserProfile[]
      );
    };
    load();
  }, [dms, query]);

  useEffect(() => {
    const stored = Cookies.get("servers");
    if (!stored) return;
    const parsed = stored
      .split(",")
      .map((x) => x.trim().split("@"))
      .filter(([ip, name]) => ip && name) as [string, string][];
    setServers(parsed);
  }, []);

  useEffect(() => {
    if (!app.profile?.node_address) return;
    auth(
      app.profile?.node_address,
      app.node,
      () => {},
      app.addMessage,
      (m) => {
        if (m.from !== chatWith && m.from !== app.profile?.id)
          toast(
            `New message from ${app.profiles[m.from]?.display_name || m.from}`,
            {
              description: m.contents.slice(0, 80),
              action: {
                label: "View",
                onClick: () => router.push(`/chat/${m.from}`),
              },
              position: "top-right",
            }
          );

        if (onNewMessage) onNewMessage(m);
      },
      app.messages ? app.messages[app.messages.length - 1]?.id : undefined
    );
    app.setProfiles((prev) => {
      if (app.profile) prev[app.profile.id] = app.profile;
      return prev;
    });
  }, [chatWith, app.profile]);

  const handleAddServer = () => {
    if (!newServer.ip) return;
    const updatedServers = [
      ...servers,
      [newServer.ip, newServer.name] as [string, string],
    ];

    setServers(updatedServers);
    Cookies.set("servers", updatedServers.map((x) => x.join("@")).join(","));
    setNewServer({ name: "", ip: "" });
  };

  return (
    <div className="flex h-svh md:h-screen">
      <div
        className={cn(
          "border-r transition-all duration-300 ease-in-out overflow-hidden flex",
          app.sidebarOpen ? "w-5xl md:w-md" : "w-0 md:w-md"
        )}
      >
        <div className="w-16 flex flex-col items-center gap-4 py-4 bg-muted border-r">
          <Button
            onClick={() => router.push(`/chat`)}
            className="bg-transparent text-accent-foreground hover:text-accent"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          {servers.map(
            ([ip, name]) =>
              ip && (
                <Button
                  onClick={() => router.push(`/server/${ip}`)}
                  key={ip}
                  className="bg-transparent text-accent-foreground hover:text-accent"
                >
                  <HashIcon className="h-6 w-6" />
                </Button>
              )
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>

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
                      setNewServer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
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
                      setNewServer((prev) => ({
                        ...prev,
                        ip: e.target.value,
                      }))
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
          </Dialog>

          <footer className="mt-auto">
            <SettingsDialog profile={app.profile as ProfileSettings} />
          </footer>
        </div>

        {/* Right column */}
        <div className="w-full flex flex-col bg-card">
          {server ? (
            <div className="p-3 border-b flex items-center gap-2">
              <h2>{server.name}</h2>
            </div>
          ) : (
            <div className="p-3 border-b flex items-center">
              <div className="relative w-full">
                <Input
                  placeholder="Find or start a conversation"
                  className="pr-8 h-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          <ScrollArea className="flex-1">
            <div className="p-2 flex flex-col gap-2">
              {server ? (
                <>
                  {server.channels.map((channel) => (
                    <ChannelProp key={channel.id} {...channel} />
                  ))}
                </>
              ) : (
                <>
                  {app.dms.map((user) => (
                    <DMItem
                      name={user.display_name}
                      id={user.id}
                      status="online"
                      avatar={user.avatar_url}
                      key={user.id}
                      app={app}
                    />
                  ))}
                  {app.dms.length === 0 && query.trim() !== "" ? (
                    <div className="px-3 py-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm"
                        onClick={async () => {
                          const response = await axios.get("/api/profile", {
                            params: { username: query },
                          });
                          const user = response.data as UserProfile;
                          router.push(`/chat/${user.id}`);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Start new DM with “{query}”
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </ScrollArea>

          <footer className="mt-auto pb-3 pl-3 pr-3">
            <DMItem
              name={app.profile?.display_name || "Loading.."}
              id={app.profile?.id || "me"}
              avatar={app.profile?.avatar_url || ""}
              status="online"
              app={app}
              settings
            />
          </footer>
        </div>
      </div>
      {app.sidebarOpen ? (
        <div
          className="w-full h-full overflow-x-hidden"
          onClick={() => app.setSidebarOpen(false)}
        >
          <div className="overflow-x-hidden min-w-screen flex-shrink-0">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function DMItem({
  name,
  id,
  avatar,
  status,
  settings,
  app,
}: {
  name: string;
  id: string;
  avatar: string;
  status: string;
  settings?: boolean;
  app: App;
}) {
  return (
    <Link
      href={settings ? "" : `/chat/${id}`}
      className="p-2 flex flex-row items-center gap-2 cursor-pointer hover:bg-accent rounded-md"
    >
      <ProfilePicture name={name} url={avatar} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      {settings && (
        <SettingsDialog
          className="ml-auto w-7 h-7 p-0 flex items-center justify-center"
          tab="profile"
          profile={app.profile as ProfileSettings}
        />
      )}
    </Link>
  );
}

function ChannelProp(channel: Channel) {
  return (
    <Card className="p-2 flex flex-row items-center gap-2 cursor-pointer hover:bg-accent">
      <ChannelIcon kind={channel.kind} />
      <span className="text-sm font-medium">{channel.name}</span>
    </Card>
  );
}

function ChannelIcon({ kind }: { kind: "text" | "voice" }) {
  switch (kind) {
    case "text":
      return <HashIcon className="h-4 w-4" />;
    case "voice":
      return <Volume2Icon className="h-4 w-4" />;
    default:
      return null;
  }
}
