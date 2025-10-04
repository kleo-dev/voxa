import Message from "@/types/message";
import Server from "@/types/server";
import axios from "axios";
import { Dispatch, RefObject, SetStateAction } from "react";

export function makeAddress(ip: string, defaultPort = 7080) {
  return ip.includes(":") ? `${ip}` : `${ip}:${defaultPort}`;
}

export default async function auth(
  ip: string,
  wsRef: RefObject<WebSocket | null>,
  setServer: Dispatch<SetStateAction<Server | undefined>>,
  setMessages: Dispatch<SetStateAction<Message[]>>
) {
  const server_auth = (
    (await axios.post("/api/auth", { server_ip: ip })).data as any
  ).token;

  // Open the WebSocket connection
  const ws = new WebSocket(`ws://${ip}`);
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
      setServer(data);
      return;
    }

    switch (data.type) {
      case "authenticated":
        setMessages(data.params.messages);

      case "message_create":
        // setMessages([...messages, data.params]);
        setMessages((prev) => [...prev, data.params]);
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
