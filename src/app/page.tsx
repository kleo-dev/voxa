"use client";

import AppSidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <AppSidebar
      server={{
        id: "bro",
        name: "Bro",
        channels: [
          { id: "1", name: "general", kind: "text" },
          { id: "2", name: "random", kind: "text" },
          { id: "3", name: "help", kind: "text" },
          { id: "4", name: "voice-chat", kind: "voice" },
        ],
      }}
    >
      ok
    </AppSidebar>
  );
}
