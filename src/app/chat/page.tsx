"use client";

import { useRef, useState } from "react";
import AppSidebar from "@/components/Sidebar";
import { UserProfile } from "@/hooks/get-user";
import { StringMap } from "@/types/typeUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfilePicture from "@/components/ProfilePicture";
import { Message } from "@/types/types";
import { useMessages } from "@/hooks/use-messages";

export default function Chat() {
  const wsRef = useRef<WebSocket | null>(null);
  const [userList, setUserList] = useState<StringMap<UserProfile>>({});
  const messages = useMessages((s) => s.messages);
  const addMessage = useMessages((s) => s.addMessage);

  return (
    <AppSidebar
      wsRef={wsRef}
      userList={userList}
      setUserList={setUserList}
      addMessage={addMessage}
      messages={messages}
    >
      <Card className="bg-background w-full">
        <CardHeader>
          <CardTitle>Direct Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <DMItem name="Alice" status="online" avatar="" /> */}
        </CardContent>
      </Card>
    </AppSidebar>
  );
}

function DMItem({
  name,
  avatar,
  status,
}: {
  name: string;
  avatar: string;
  status: string;
}) {
  return (
    <Card className="p-2 flex flex-row items-center gap-2 cursor-pointer hover:bg-accent">
      <ProfilePicture name={name} url={avatar} />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
    </Card>
  );
}
