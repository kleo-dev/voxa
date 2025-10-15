import { Message } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageStore {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
}

type ServerMessageStore = {
  messages: Record<string, Message[]>; // server_id → messages
  setMessages: (serverId: string, msgs: Message[]) => void;
  addMessage: (serverId: string, msg: Message) => void;
  clearMessages: (serverId?: string) => void;
};

export const useMessages = create<MessageStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) =>
        set((state) =>
          state.messages.some((m) => m.id === msg.id)
            ? state
            : { messages: [...state.messages, msg] }
        ),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "chat-messages" }
  )
);

export const useServerMessages = create<ServerMessageStore>()(
  persist(
    (set) => ({
      messages: {},

      setMessages: (serverId, msgs) =>
        set((state) => ({
          messages: { ...state.messages, [serverId]: msgs },
        })),

      addMessage: (serverId, msg) =>
        set((state) => {
          const serverMsgs = state.messages[serverId] || [];

          // avoid duplicates
          if (serverMsgs.some((m) => m.id === msg.id)) return state;

          return {
            messages: {
              ...state.messages,
              [serverId]: [...serverMsgs, msg],
            },
          };
        }),

      clearMessages: (serverId) =>
        set((state) =>
          serverId
            ? {
                messages: {
                  ...state.messages,
                  [serverId]: [],
                },
              }
            : { messages: {} }
        ),
    }),
    { name: "server-messages" }
  )
);
