"use client";

import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { useParams } from "next/navigation";
import useApp from "@/hooks/use-app";
import { useEffect, useRef } from "react";
import auth from "@/lib/auth";

export default function DMs() {
  const { id } = useParams<{ id: string }>();
  const app = useApp();
  const targetNode = useRef<WebSocket | null>(null);

  useEffect(() => {
    async function connectTargetNode() {
      const target = await app.getUserById(id);
      if (target) {
        auth(
          target.node_address,
          targetNode,
          () => {},
          app.addMessage,
          () => {}
        );
      }
    }

    connectTargetNode().then(() => {});
  }, [id]);

  return (
    <AppSidebar app={app}>
      <MessageBox
        app={app}
        channelName={app.profiles[id]?.display_name || id}
        messages={app.messages.filter(
          (m) =>
            (m.channel_id === id && m.from === app.profile?.id) ||
            (m.from === id && m.channel_id === app.profile?.id)
        )}
        sendMessage={(message) => {
          app.node.current?.send(
            JSON.stringify({
              type: "send_message",
              params: {
                channel_id: id,
                contents: message,
              },
            })
          );
        }}
      />
    </AppSidebar>
  );
}
