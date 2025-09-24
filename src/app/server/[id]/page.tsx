"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import MessageBox from "@/components/MessageBox";
import AppSidebar from "@/components/Sidebar";
import { getUser } from '@/test/user';
import { auth } from '@/test/auth';
import Message from "@/types/message";

export default function Server() {
  const { id } = useParams<{ id: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!id) return;

    getUser().then(session_token => {
      auth(session_token, id === 'localhost' ? '127.0.0.1' : id).then(server_auth => {
        // Open the WebSocket connection
        const ws = new WebSocket(`ws://${id}:7080`);
        wsRef.current = ws;
    
        ws.onopen = () => {
          console.log("Connected to WebSocket:", id);
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
          console.log("WebSocket closed:", id);
        };
    
        // Cleanup on unmount or id change
        return () => {
          ws.close();
        };
      });
    })
  }, [id]);

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
