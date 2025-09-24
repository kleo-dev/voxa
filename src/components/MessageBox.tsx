"use client";

import Message from "@/types/message";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as emoji from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SmilePlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageContainer({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg p-4 hover:bg-accent">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-400" />
        <div className="flex flex-col flex-1">
          <span className="font-bold flex gap-1 items-center">
            {message.from}

            <p className="text-neutral-500 text-xs">
              {isToday(message.timestamp * 1000)
                ? format(message.timestamp * 1000, "p")
                : isYesterday(message.timestamp * 1000)
                ? "Yesterday, " + format(message.timestamp * 1000, "p")
                : format(message.timestamp * 1000, "PP, p")}
            </p>
          </span>

          <span className="text-foreground/85 flex flex-col">
            {message.contents.split("\n\n").map((line, index) => (
              <div key={index} className="h-max">
                {index > 0 && <br />}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold my-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold my-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-bold my-2" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4 className="text-lg font-bold my-2" {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5 className="text-base font-bold my-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside my-2"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-accent-foreground underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {line}
                </ReactMarkdown>
              </div>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MessageBox({ messages, sendMessage }: { messages: Message[], sendMessage: (m: string) => void }) {
  const [text, setText] = useState("");

  return (
    <div className="h-screen w-full flex flex-col py-5 pl-5 gap-5">
      <div className="w-full flex-1 overflow-y-scroll flex gap-2 flex-col-reverse pr-5">
        {messages.map((msg) => (
          <MessageContainer key={msg.id} message={msg} />
        ))}
      </div>
      <div className="w-full flex gap-3 pr-5">
        <Input
          className=""
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(text);
              setText('');
            }
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <SmilePlusIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="">
            <EmojiPicker
              onEmojiClick={(e) => setText(text + e.emoji)}
              theme={emoji.Theme.DARK}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
