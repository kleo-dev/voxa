"use client";
import { ScrollArea } from "../ui/scroll-area";
import { Server, Channel } from "@/types/types";
import { Card } from "../ui/card";
import { HashIcon, Volume2Icon } from "lucide-react";

export function ChannelIcon({ kind }: { kind: "text" | "voice" }) {
  switch (kind) {
    case "text":
      return <HashIcon className="h-4 w-4" />;
    case "voice":
      return <Volume2Icon className="h-4 w-4" />;
    default:
      return null;
  }
}

export function ChannelItem({ channel }: { channel: Channel }) {
  return (
    <Card className="p-2 flex items-center gap-2 cursor-pointer hover:bg-accent">
      <ChannelIcon kind={channel.kind} />
      <span className="text-sm font-medium">{channel.name}</span>
    </Card>
  );
}

export default function SidebarChannels({ server }: { server: Server }) {
  return (
    <div className="w-full flex flex-col bg-sidebar">
      <div className="p-3 border-b flex items-center gap-2">
        <h2>{server.name}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-2">
          {server.channels.map((channel: Channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
