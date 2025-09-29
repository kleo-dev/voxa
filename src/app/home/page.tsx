"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import MessageBox from "@/components/MessageBox";

export default function HomePage() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", text: "Hey, how are you?" },
    { id: 2, user: "You", text: "Doing good, just working on the chat app!" },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: "You", text: input }]);
    setInput("");
  }

  return (
    <AppSidebar>
      <MessageBox
        channelName="Alice"
        messages={[]}
        userList={[]}
        setUserList={() => {}}
        sendMessage={() => {}}
      />
    </AppSidebar>
  );
}

function ServerButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-12 w-12"
      title={label}
    >
      {icon}
    </Button>
  );
}

function DMItem({ name, status }: { name: string; status: string }) {
  return (
    <Card className="p-2 flex items-center gap-2 cursor-pointer hover:bg-accent">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
    </Card>
  );
}
