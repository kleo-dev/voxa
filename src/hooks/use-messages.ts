import { Message } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageStore {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
}

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
