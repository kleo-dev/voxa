"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppLayout from "@/components/app/AppLayout";
import { Server as ServerType } from "@/types/types";
import auth from "@/lib/auth";
import { useServerMessages } from "@/hooks/use-messages";
import useApp from "@/hooks/use-app";
import { useEffectOnceWhenReady } from "@/hooks/use-once";

export default function Server() {
  const { ip } = useParams<{ ip: string }>();
  const searchParams = useSearchParams();
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
    [undefined, (v) => v]
  );

  useEffect(() => {
    const channelId = searchParams.get("ch");
    if (channelId) {
      app.setCurrentChannel(
        server?.channels.find((v) => v.id === channelId) ||
          server?.channels[0] ||
          null
      );
    } else {
      app.setCurrentChannel(server?.channels[0] || null);
    }
  }, [server]);

  return (
    <AppLayout app={app} server={server}>
      {app.currentChannel ? (
        <MessageBox
          app={app}
          channelName={app.currentChannel.name}
          messages={
            messages[ip]?.filter(
              (m) => m.channel_id === app.currentChannel?.id
            ) || []
          }
          sendMessage={(message) => {
            serverRef.current?.send(
              JSON.stringify({
                type: "send_message",
                params: {
                  channel_id: app.currentChannel?.id,
                  contents: message,
                },
              })
            );
          }}
        />
      ) : (
        <div className="h-svh w-full max-h-svh flex flex-col pb-5 pl-5 gap-5"></div>
      )}
    </AppLayout>
  );
}
