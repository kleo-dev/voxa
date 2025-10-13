import { Message, Server } from "@/types/types";
import axios from "axios";
import { Dispatch, RefObject, SetStateAction } from "react";

async function getIP(domain: string) {
  const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
  const data = await res.json();
  return data.Answer ? data.Answer[0].data : null;
}

export async function makeAddress(ip: string, defaultPort = 7080) {
  // Apparently wss doesn't like ports (or maybe the tunnel I'm using)
  // return ip.includes(":") ? `${ip}` : `${ip}:${defaultPort}`;
  if (ip.match(/^\d\.\d\.\d\.\d/)) {
    return ip;
  }

  return await getIP(ip);
}

export default async function auth(
  address: string,
  wsRef: RefObject<WebSocket | null>,
  setServer: Dispatch<SetStateAction<Server | undefined>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  onNewMessage?: (m: Message) => void
) {
  const ip = makeAddress(address);
  console.log("Authenticating with server at:", ip);
  const server_auth = (
    (await axios.post("/api/auth", { server_ip: ip })).data as any
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
