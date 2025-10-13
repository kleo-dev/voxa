"use client";

import { useEffect, useRef, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Message } from "@/types/types";
import useUser, { User } from "@/hooks/get-user";
import { NumberMap, StringMap } from "@/types/typeUtils";
import auth, { makeAddress } from "@/lib/auth";
import { useParams } from "next/navigation";

// In this testing instance we are assuming that the target's node is localhost
// To make this functional we need to add a settings feature to the api

export default function DMs() {
  const { id } = useParams<{ id: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<StringMap<User>>({});

  useEffect(() => {
    async function fetchInitialData() {
      if (!user || loading) return;
      await auth(makeAddress("localhost", 7090), wsRef, () => {}, setMessages);
      setUserList((prev) => {
        prev[user.id] = user;
        return prev;
      });
    }
    fetchInitialData();
  }, [id, user, loading]);

  return (
    <AppSidebar user={user}>
      <MessageBox
        channelName="Alice"
        userList={userList}
        setUserList={setUserList}
        messages={messages
          .filter((m) => m.channel_id === id || m.from === id)
          .toReversed()}
        sendMessage={(message) => {
          wsRef.current?.send(
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
