import App from "@/types/app";
import { useRef, useState } from "react";
import { useMessages } from "./use-messages";
import { StringMap } from "@/types/typeUtils";
import useUser, { UserProfile } from "./get-user";

export default function useApp(): App {
  const node = useRef<WebSocket | null>(null);
  const [profiles, setProfiles] = useState<StringMap<UserProfile>>({});
  const messages = useMessages((s) => s.messages);
  const addMessage = useMessages((s) => s.addMessage);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const profile = useUser();

  return {
    node,
    profile,
    profiles,
    setProfiles,
    messages,
    addMessage,
    sidebarOpen,
    setSidebarOpen,
  };
}
