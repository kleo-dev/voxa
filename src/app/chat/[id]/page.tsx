"use client";

import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { useParams } from "next/navigation";
import useApp from "@/hooks/use-app";
import { useEffect, useRef } from "react";
import auth from "@/lib/auth";
import useAsync from "@/hooks/use-async";

export default function DMs() {
  const { id } = useParams<{ id: string }>();
  const app = useApp();
  const targetNode = useRef<WebSocket | null>(null);
  const { value: target } = useAsync(() => app.getUserById(id));

  useEffect(() => {
    async function connectTargetNode() {
      if (!target) return;
      auth(
        target.node_address,
        targetNode,
        () => {},
        app.addMessage,
        () => {}
      );
    }

    connectTargetNode();
  }, [target]);

  return (
    <AppSidebar app={app}>
      <MessageBox
        app={app}
        channelName={target?.display_name || id}
        channelIcon={target?.avatar_url || "_"}
        messages={app.messages.filter(
          (m) =>
            (m.channel_id === id && m.from === app.profile?.id) ||
            (m.from === id && m.channel_id === app.profile?.id)
        )}
        sendMessage={(message) => {
          targetNode.current?.send(
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
