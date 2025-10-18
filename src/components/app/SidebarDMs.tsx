"use client";

import { Input } from "../ui/input";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import DMItem from "./DMItem";
import App from "@/types/app";
import { UserProfile } from "@/hooks/get-user";
import { useEffect } from "react";

export default function SidebarDMs({
  app,
  query,
  setQuery,
}: {
  app: App;
  query: string;
  setQuery: (v: string) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const users = await Promise.all(
        app.messages
          .flatMap((m) => [m.from, m.channel_id])
          .filter((id) => id !== app.profile?.id)
          .map((id) => app.getUserById(id))
      );
      app.setDms(
        users.filter(
          (user) =>
            user &&
            (user.username.toLowerCase().includes(query.toLowerCase()) ||
              user.id.toLowerCase().includes(query.toLowerCase()))
        ) as UserProfile[]
      );
    };
    load();
  }, [query]);

  return (
    <div className="w-full flex flex-col bg-card/50">
      <div className="p-3 border-b flex items-center">
        <div className="relative w-full">
          <Input
            placeholder="Find or start a conversation"
            className="pr-8 h-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-2">
          {app.dms.map((user) => (
            <DMItem
              key={user.id}
              name={user.display_name}
              id={user.id}
              avatar={user.avatar_url}
              status="online"
              app={app}
            />
          ))}

          {app.dms.length === 0 && query.trim() !== "" && (
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={async () => {
                  const res = await axios.get("/api/profile", {
                    params: { username: query },
                  });
                  const user = res.data as UserProfile;
                  router.push(`/chat/${user.id}`);
                }}
              >
                <Plus className="h-4 w-4" />
                Start new DM with “{query}”
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="mt-auto pb-3 px-3">
        <DMItem
          name={app.profile?.display_name || "Loading.."}
          id={app.profile?.id || "me"}
          avatar={app.profile?.avatar_url || ""}
          status="online"
          app={app}
          settings
        />
      </footer>
    </div>
  );
}
