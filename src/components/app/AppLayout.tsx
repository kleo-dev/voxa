"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import auth from "@/lib/auth";
import { useIsMobile } from "@/hooks/is-mobile";
import App from "@/types/app";
import { Server, Message } from "@/types/types";

import SidebarServers from "./SidebarServers";
import SidebarDMs from "./SidebarDMs";
import SidebarChannels from "./SidebarChannels";

export default function AppLayout({
  children,
  chatWith,
  onNewMessage,
  server,
  app,
}: {
  onNewMessage?: (msg: Message) => void;
  chatWith?: string;
  children?: React.ReactNode;
  server?: Server;
  app: App;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!app.profile?.node_address) return;

    auth(
      app.profile.node_address,
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
      app.messages?.[app.messages.length - 1]?.id
    );

    app.setProfiles((prev) => {
      if (app.profile) prev[app.profile.id] = app.profile;
      return prev;
    });
  }, [chatWith, app.profile]);

  return (
    <div className="flex h-svh md:h-screen">
      <div
        className={cn(
          "border-r transition-all duration-300 ease-in-out overflow-hidden flex",
          app.sidebarOpen && isMobile ? "w-5xl md:w-md" : "w-0 md:w-md"
        )}
      >
        {/* Left column — servers */}
        <SidebarServers app={app} />

        {/* Right column — DMs or server channels */}
        {server ? (
          <SidebarChannels server={server} />
        ) : (
          <SidebarDMs app={app} />
        )}
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
