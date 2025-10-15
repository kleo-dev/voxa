"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Server as ServerType } from "@/types/types";
import auth from "@/lib/auth";
import { useServerMessages } from "@/hooks/use-messages";
import useApp from "@/hooks/use-app";
import { useEffectOnceWhenReady } from "@/hooks/use-once";

export default function Server() {
  const { ip } = useParams<{ ip: string }>();
  const serverRef = useRef<WebSocket | null>(null);
  const [server, setServer] = useState<undefined | ServerType>();
  const app = useApp();
  const { messages, addMessage } = useServerMessages();

  useEffectOnceWhenReady(
    () => {
      if (!ip) return;
      const msgs = messages[ip];
      auth(
        ip,
        serverRef,
        setServer,
        (m) => addMessage(ip, m),
        () => {},
        msgs ? msgs[msgs.length - 1]?.id : undefined
      );
    },
    [ip, messages],
    [undefined, (v) => v[ip]]
  );

  return (
    <AppSidebar app={app} server={server}>
      <MessageBox
        app={app}
        channelName="General"
        messages={messages[ip]?.filter((m) => m.channel_id === "general") || []}
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
