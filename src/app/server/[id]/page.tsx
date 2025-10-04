"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import Message from "@/types/message";
import useUser, { User } from "@/hooks/get-user";
import { NumberMap } from "@/types/typeUtils";
import ServerType from "@/types/server";
import auth from "@/lib/auth";

export default function Server() {
  const { id: ip } = useParams<{ id: string }>();
  const [server, setServer] = useState<undefined | ServerType>();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<NumberMap<User>>({});

  useEffect(() => {
    if (!ip || !user || loading) return;
    auth(ip, wsRef, setServer, setMessages);
    setUserList((prev) => {
      prev[user.id] = user;
      return prev;
    });
  }, [ip, user, loading]);

  return (
    <AppSidebar
      user={user}
      server={
        {
          channels: [{ id: "general", name: "General", kind: "text" }],
          ...server,
        } as ServerType
      }
    >
      <MessageBox
        channelName="General"
        userList={userList}
        setUserList={setUserList}
        messages={messages
          .filter((m) => m.channel_id === "general")
          .toReversed()}
        sendMessage={(message) => {
          wsRef.current?.send(
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
