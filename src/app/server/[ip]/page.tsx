"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Message, Server as ServerType } from "@/types/types";
import { UserProfile } from "@/hooks/get-user";
import { StringMap } from "@/types/typeUtils";
import auth from "@/lib/auth";
import { useMessages } from "@/hooks/use-messages";
import useApp from "@/hooks/use-app";

export default function Server() {
  const { ip } = useParams<{ ip: string }>();
  const serverRef = useRef<WebSocket | null>(null);
  const [server, setServer] = useState<undefined | ServerType>();
  const app = useApp();

  useEffect(() => {
    if (!ip) return;
    auth(ip, serverRef, setServer, app.addMessage);
  }, [ip]);

  return (
    <AppSidebar app={app} server={server}>
      <MessageBox
        toggleSidebar={() => app.setSidebarOpen(true)}
        channelName="General"
        userList={app.profiles}
        setUserList={app.setProfiles}
        messages={app.messages
          .filter((m) => m.channel_id === "general")
          .toReversed()}
        sendMessage={(message) => {
          serverRef.current?.send(
            JSON.stringify({
              type: "send_message",
              params: {
                channel_id: "general",
                contents: message,
              },
            })
          );
        }}
      />
    </AppSidebar>
  );
}
