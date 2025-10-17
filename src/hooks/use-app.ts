import App from "@/types/app";
import { useRef, useState } from "react";
import { useMessages } from "./use-messages";
import { StringMap } from "@/types/typeUtils";
import useUser, { UserProfile } from "./get-user";
import { useClientSettings } from "./use-settings";

export default function useApp(): App {
  const node = useRef<WebSocket | null>(null);
  const [profiles, setProfiles] = useState<StringMap<UserProfile | null>>({});
  const { messages, addMessage } = useMessages();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profile = useUser();
  const [clientSettings, setClientSettings] = useClientSettings();

  return {
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
  };
}
