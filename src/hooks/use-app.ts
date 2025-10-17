import App from "@/types/app";
import { useRef, useState } from "react";
import { useMessages } from "./use-messages";
import { StringMap } from "@/types/typeUtils";
import useUser, { UserProfile } from "./get-user";
import { useClientSettings } from "./use-settings";
import { get, Response } from "@/lib/request";

export default function useApp(): App {
  const node = useRef<WebSocket | null>(null);
  const [profiles, setProfiles] = useState<StringMap<UserProfile | null>>({});
  const { messages, addMessage } = useMessages();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profile = useUser();
  const [clientSettings, setClientSettings] = useClientSettings();
  const [dms, setDms] = useState<UserProfile[]>([]);

  return {
    dms,
    setDms,
    node,
    clientSettings,
    setClientSettings,
    profile,
    profiles,
    setProfiles,
    messages,
    addMessage,
    sidebarOpen,
    setSidebarOpen,
    getUserById: async (id: string) => {
      if (profiles[id] !== undefined) return profiles[id];

      const onResponse = (res: Response<UserProfile>) => {
        setProfiles((prev) => {
          prev[id] = res.data as UserProfile;
          return prev;
        });
      };

      try {
        const user = await get(`/api/profile/?id=${id}`, onResponse);
        onResponse(user);
        return user.data;
      } catch {
        return null;
      }
    },
  };
}
