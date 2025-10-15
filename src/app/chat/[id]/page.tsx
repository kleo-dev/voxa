"use client";

import { useRef, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { Message } from "@/types/types";
import { UserProfile } from "@/hooks/get-user";
import { StringMap } from "@/types/typeUtils";
import { useParams } from "next/navigation";
import { useMessages } from "@/hooks/use-messages";

// In this testing instance we are assuming that the target's node is localhost
// To make this functional we need to add a settings feature to the api

export default function DMs() {
  const { id } = useParams<{ id: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const messages = useMessages((s) => s.messages);
  const setMessages = useMessages((s) => s.setMessages);
  const [userList, setUserList] = useState<StringMap<UserProfile>>({});
  const [user, setUser] = useState<UserProfile | undefined>();

  return (
    <AppSidebar
      setMessages={setMessages}
      wsRef={wsRef}
      userList={userList}
      setUserList={setUserList}
      chatWith={id}
      setUser={setUser}
      messages={messages}
    >
      <MessageBox
        channelName={userList[id]?.display_name || id}
        userList={userList}
        setUserList={setUserList}
        messages={messages
          .filter(
            (m) =>
              (m.channel_id === id && m.from === user?.id) ||
              (m.from === id && m.channel_id === user?.id)
          )
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
