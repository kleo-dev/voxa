"use client";

import { useEffect, useRef, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import Message from "@/types/message";
import useUser, { User } from "@/hooks/get-user";
import { NumberMap } from "@/types/typeUtils";
import auth, { makeAddress } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Chat() {
  const ip = "localhost";
  const wsRef = useRef<WebSocket | null>(null);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<NumberMap<User>>({});

  useEffect(() => {
    if (!ip || !user || loading) return;
    auth(
      makeAddress(ip, 7090),
      wsRef,
      () => {},
      () => {},
      (m) => {
        toast(`New message from ${m.from}`, {
          description: m.contents.slice(0, 80),
        });
      }
    );
    setUserList((prev) => {
      prev[user.id] = user;
      return prev;
    });
  }, [ip, user, loading]);

  return (
    <AppSidebar user={{ id: 173, username: "leo", email: "" }}>
      <Card className="bg-background w-full">
        <CardHeader>
          <CardTitle>Direct Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DMItem name="Alice" status="online" />
        </CardContent>
      </Card>
    </AppSidebar>
  );
}

function DMItem({ name, status }: { name: string; status: string }) {
  return (
    <Card className="p-2 flex flex-row items-center gap-2 cursor-pointer hover:bg-accent">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/kleo-dev.png" alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
    </Card>
  );
}
