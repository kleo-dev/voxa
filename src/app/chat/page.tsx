"use client";

import { useEffect, useRef, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import Message from "@/types/message";
import useUser, { User } from "@/hooks/get-user";
import { NumberMap } from "@/types/typeUtils";
import auth, { makeAddress } from "@/lib/auth";

// In this testing instance we are assuming that Alice's node is localhost
// To make this functional we need to add a settings feature to the api

export default function AppHome() {
  // Again we assume a static id, specifically Alice's user id
  // const { id } = useParams<{ id: string }>();
  const id = 667;
  const ip = "localhost";
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<NumberMap<User>>({});

  useEffect(() => {
    if (!ip || !user || loading) return;
    auth(makeAddress(ip, 7090), wsRef, () => {}, setMessages);
    setUserList((prev) => {
      prev[user.id] = user;
      return prev;
    });
  }, [ip, user, loading]);

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
