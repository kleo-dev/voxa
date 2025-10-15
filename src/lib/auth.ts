import { Message, Server } from "@/types/types";
import axios from "axios";
import { Dispatch, RefObject, SetStateAction } from "react";

export default async function auth(
  id: string,
  wsRef: RefObject<WebSocket | null>,
  setServer: Dispatch<SetStateAction<Server | undefined>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  onNewMessage?: (m: Message) => void
) {
  console.log("Authenticating with server id:", id);

  const ip = ((await axios.get(`/api/server/${id}`)).data as any)
    .address as string;

  console.log("Authenticating with server at:", ip);
  const server_auth = (
    (await axios.post("/api/auth", { server_id: id })).data as any
  ).token;

  // Open the WebSocket connection
  const ws = new WebSocket(`wss://${ip}`);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("Connected to WebSocket:", ip);
    ws.send(
      JSON.stringify({
        version: "0.0.1",
        auth_token: server_auth,
        last_message: 0,
      })
    );
  };

  ws.onmessage = (m) => {
    const data = JSON.parse(m.data);
    console.log("Message received:", data);

    if (data.version) {
      setServer({ channels: [], ...data });
      return;
    }

    switch (data.type) {
      case "authenticated":
        setMessages(data.params.messages);
        break;

      case "message_create":
        if (onNewMessage) onNewMessage(data.params as Message);
        setMessages((prev) => [...prev, data.params]);
        break;
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  ws.onclose = () => {
    console.log("WebSocket closed:", ip);
  };

  // Cleanup on unmount or id change
  return () => {
    ws.close();
  };
}
