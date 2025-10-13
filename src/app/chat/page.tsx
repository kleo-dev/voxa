"use client";

import { useEffect, useRef, useState } from "react";
import AppSidebar from "@/components/Sidebar";
import useUser, { User } from "@/hooks/get-user";
import { StringMap } from "@/types/typeUtils";
import auth, { makeAddress } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ProfilePicture from "@/components/ProfilePicture";

export default function Chat() {
  const ip = "localhost";
  const wsRef = useRef<WebSocket | null>(null);
  const { user, loading } = useUser();
  const [userList, setUserList] = useState<StringMap<User>>({});

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
    <AppSidebar user={user}>
      <Card className="bg-background w-full">
        <CardHeader>
          <CardTitle>Direct Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <DMItem name="Alice" status="online" avatar="" />
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
