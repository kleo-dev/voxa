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
import { useIsMobile } from "@/hooks/is-mobile";
import { get } from "@/lib/request";

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
  const [newServer, setNewServer] = useState("");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();

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

  useEffect(() => {}, []);

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

  const handleAddServer = async () => {
    if (!newServer || Object.hasOwn(app.servers, newServer)) return;

    try {
      const server = (await get(`/api/server/${newServer}`)).data as Server;
      app.setServers((prev) => ({
        ...prev,
        [server.id]: server,
      }));
      Cookies.set("servers", Object.keys(app.servers).join(","));
      setNewServer("");
    } catch (e: any) {
      toast.error(e);
    }
  };

  return (
    <div className="flex h-svh md:h-screen">
      <div
        className={cn(
          "border-r transition-all duration-300 ease-in-out overflow-hidden flex",
          app.sidebarOpen && isMobile ? "w-5xl md:w-md" : "w-0 md:w-md"
        )}
      >
        <div className="w-16 flex flex-col items-center gap-4 py-4 border-r">
          <Button
            onClick={() => router.push(`/chat`)}
            className="bg-transparent text-accent-foreground hover:text-accent"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>

          {Object.values(app.servers).map(
            (srv) =>
              srv && (
                <Link href={`/server/${srv.id}`} key={srv.id} className="">
                  <ProfilePicture name={srv.name} url={srv.icon_url} />
                </Link>
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
                <DialogTitle>Join a server</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="id-1">Server ID</Label>
                  <Input
                    id="id-1"
                    name="id"
                    value={newServer}
                    onChange={(e) => setNewServer(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button" onClick={handleAddServer}>
                    Join server
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
        <div className="w-full flex flex-col bg-card/50">
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
      {app.sidebarOpen && isMobile ? (
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
