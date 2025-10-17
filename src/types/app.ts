import { Dispatch, RefObject, SetStateAction } from "react";
import { StringMap } from "./typeUtils";
import { UserProfile } from "@/hooks/get-user";
import { Message } from "./types";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export default interface App {
  node: RefObject<WebSocket | null>;
  profile: UserProfile | null;

  profiles: StringMap<UserProfile | null>;
  setProfiles: SetState<StringMap<UserProfile | null>>;

  messages: Message[];
  addMessage: (v: Message) => void;

  sidebarOpen: boolean;
  setSidebarOpen: SetState<boolean>;
}
