"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import Message from "@/types/message";
import getUser from "@/hooks/get-user";
import Cookies from "js-cookie";
import axios from "axios";

export default function Server() {
  const { id: ip } = useParams<{ id: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const user = getUser();

  useEffect(() => {
    if (!ip || !user) return;

    async function auth() {
      const server_auth = ((await axios.post('http://localhost:3000/api/auth', {
          server_ip: ip === 'localhost' ? '127.0.0.1' : ip,
          session_token: Cookies.get('token'),
      })).data as any).token;

      // Open the WebSocket connection
      const ws = new WebSocket(`ws://${ip}:7080`);
      wsRef.current = ws;
  
      ws.onopen = () => {
        console.log("Connected to WebSocket:", ip);
        ws.send(JSON.stringify({
          version: '0.0.1',
          auth_token: server_auth,
          last_message: 0
        }))
      };
  
      ws.onmessage = (m) => {
        const data = JSON.parse(m.data);
        console.log("Message received:", data);

        switch (data.type) {
          case 'authenticated':
            setMessages(data.params.messages);
          
          case 'message_create':
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

    auth();
  }, [ip]);

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
      <MessageBox
        messages={messages.filter(m => m.channel_id === 'general').toReversed()}
        sendMessage={(message) => {
          wsRef.current?.send(JSON.stringify(
            {
              type: 'send_message',
              params: {
                channel_id: 'general',
                contents: message
              }
          }
          ));
        }}
      />
    </AppSidebar>
  );
}
