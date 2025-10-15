"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Message, Server as ServerType } from "@/types/types";
import { UserProfile } from "@/hooks/get-user";
import { StringMap } from "@/types/typeUtils";
import auth from "@/lib/auth";

export default function Server() {
  const { ip } = useParams<{ ip: string }>();
  const wsServerRef = useRef<WebSocket | null>(null);
  const wsNodeRef = useRef<WebSocket | null>(null);
  const [server, setServer] = useState<undefined | ServerType>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<StringMap<UserProfile>>({});

  useEffect(() => {
    if (!ip) return;
    auth(ip, wsServerRef, setServer, setMessages, (m) => {
      setMessages((prev) => [...prev, m]);
    });
  }, [ip]);

  return (
    <AppSidebar
      wsRef={wsNodeRef}
      setMessages={setMessages}
      userList={userList}
      setUserList={setUserList}
      server={server}
    >
      <MessageBox
        channelName="General"
        userList={userList}
        setUserList={setUserList}
        messages={messages
          .filter((m) => m.channel_id === "general")
          .toReversed()}
        sendMessage={(message) => {
          wsServerRef.current?.send(
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
