"use client";

import { useEffect, useRef, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Message } from "@/types/types";
import useUser, { User } from "@/hooks/get-user";
import { NumberMap } from "@/types/typeUtils";
import auth, { makeAddress } from "@/lib/auth";
import { useParams } from "next/navigation";

// In this testing instance we are assuming that the target's node is localhost
// To make this functional we need to add a settings feature to the api

export default function DMs() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<NumberMap<User>>({});

  useEffect(() => {
    if (!numericId || !user || loading) return;
    auth(makeAddress("localhost", 7090), wsRef, () => {}, setMessages);
    setUserList((prev) => {
      prev[user.id] = user;
      return prev;
    });
  }, [id, user, loading]);

  return (
    <AppSidebar user={user}>
      <MessageBox
        channelName="Alice"
        userList={userList}
        setUserList={setUserList}
        messages={messages
          .filter((m) => m.channel_id === numericId || m.from === numericId)
          .toReversed()}
        sendMessage={(message) => {
          wsRef.current?.send(
            JSON.stringify({
              type: "send_message",
              params: {
                channel_id: numericId,
                contents: message,
              },
            })
          );
        }}
      />
    </AppSidebar>
  );
}
