import { Dispatch, RefObject, SetStateAction } from "react";
import { StringMap } from "./typeUtils";
import { UserProfile } from "@/hooks/get-user";
import { Message } from "./types";
import { ClientSettings } from "./settings";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export default interface App {
  node: RefObject<WebSocket | null>;
  profile: UserProfile | null;

  clientSettings: ClientSettings;
  setClientSettings: SetState<ClientSettings>;

  profiles: StringMap<UserProfile | null>;
  setProfiles: SetState<StringMap<UserProfile | null>>;

  messages: Message[];
  addMessage: (v: Message) => void;

  sidebarOpen: boolean;
  setSidebarOpen: SetState<boolean>;

  getUserById: (userId: string) => Promise<UserProfile | null>;
}
