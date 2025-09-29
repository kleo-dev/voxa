"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, Plus, Search } from "lucide-react";
import { useState } from "react";
import AppSidebar from "@/components/Sidebar";

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
      <div className="flex h-screen w-full bg-background">
        {/* Server Sidebar */}
        {/* <aside className="w-16 border-r flex flex-col items-center gap-4 py-4 bg-muted">
        <ServerButton
          label="Home"
          icon={<MessageCircle className="h-6 w-6" />}
        />
        <ServerButton label="Add" icon={<Plus className="h-6 w-6" />} />
      </aside>

      <aside className="w-64 border-r flex flex-col bg-card">
        <div className="p-3 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Find or start a conversation" className="h-8" />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-2">
            <DMItem name="Alice" status="online" />
            <DMItem name="Bob" status="offline" />
            <DMItem name="Charlie" status="away" />
          </div>
        </ScrollArea>
      </aside> */}

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          <header className="h-12 px-4 flex items-center border-b text-sm font-semibold">
            Alice
          </header>

          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2 items-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{msg.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{msg.user}</p>
                    <p className="text-sm text-foreground/90">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <footer className="p-3 border-t flex gap-2">
            <Input
              placeholder="Message Alice"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </footer>
        </main>
      </div>
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
