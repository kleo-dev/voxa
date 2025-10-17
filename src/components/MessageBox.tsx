"use client";

import { Message } from "@/types/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as emoji from "emoji-picker-react";
import EmojiPicker from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronLeftIcon, SendIcon, SmilePlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserProfile } from "@/hooks/get-user";
import ProfilePicture from "./ProfilePicture";
import App from "@/types/app";
import { Textarea } from "./ui/textarea";

function MessageContainer({ message, app }: { message: Message; app: App }) {
  const [profile, setProfile] = useState<UserProfile | null>();

  app.getUserById(message.from).then(setProfile);

  return (
    <div className="flex flex-col gap-3 rounded-lg p-4 hover:bg-accent">
      <div className="flex gap-2">
        {/* <div className="w-8 h-8 rounded-full bg-gray-400" /> */}
        <ProfilePicture
          url={profile?.avatar_url}
          name={profile?.display_name || message.from}
        />
        <div className="flex flex-col flex-1">
          <span className="font-bold flex gap-1 items-center">
            {profile?.display_name || message.from}

            <p className="text-neutral-500 text-xs">
              {isToday(message.timestamp * 1000)
                ? format(message.timestamp * 1000, "p")
                : isYesterday(message.timestamp * 1000)
                ? "Yesterday, " + format(message.timestamp * 1000, "p")
                : format(message.timestamp * 1000, "PP, p")}
            </p>
          </span>

          <div className="text-foreground/85 flex flex-col break-words whitespace-pre-wrap">
            {message.contents.split("\n\n").map((line, index) => (
              <div key={index} className="h-max break-words">
                {index > 0 && <br />}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-bold my-2 break-words"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-bold my-2 break-words"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-bold my-2 break-words"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-lg font-bold my-2 break-words"
                        {...props}
                      />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5
                        className="text-base font-bold my-2 break-words"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside my-2 break-words"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside my-2 break-words"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-accent-foreground underline underline-offset-2 break-all"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessageBox({
  app,
  sendMessage,
  channelName,
  messages,
}: {
  app: App;
  sendMessage: (m: string) => void;
  channelName?: string;
  messages: Message[];
}) {
  const [text, setText] = useState("");
  const inputRef = useRef<any>(null);

  return (
    <div className="h-svh w-full max-h-svh flex flex-col pb-5 pl-5 gap-5">
      {channelName && (
        <header className="h-12 py-4 flex items-center border-b text-sm font-semibold">
          <span
            onClick={() => app.setSidebarOpen(true)}
            className="cursor-pointer flex"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            {channelName}
          </span>
        </header>
      )}
      <div className="mt-auto flex flex-col-reverse overflow-y-scroll">
        {messages.toReversed().map((msg) => (
          <MessageContainer key={msg.id} message={msg} app={app} />
        ))}
      </div>
      <footer className="flex gap-3 pr-5 w-full h-max">
        {text.includes("\n") ? (
          <Textarea
            ref={inputRef}
            className="resize-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              if (!e.target.value.includes("\n") && text.includes("\n")) {
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.selectionStart = text.length + 1;
                    inputRef.current.selectionEnd = text.length + 1;
                    inputRef.current.focus();
                  }
                }, 10);
              }

              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage(text);
                  setText("");
                }
              }
            }}
          />
        ) : (
          <Input
            placeholder="Type a message..."
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  setText((p) => p + "\n");
                  setTimeout(() => {
                    if (inputRef.current) {
                      inputRef.current.selectionStart = text.length + 1;
                      inputRef.current.selectionEnd = text.length + 1;
                      inputRef.current.focus();
                    }
                  }, 10);
                } else {
                  sendMessage(text.trim());
                  setText("");
                }
              }
            }}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="hidden md:block">
              <SmilePlusIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="">
            <EmojiPicker
              onEmojiClick={(e) => setText(text + e.emoji)}
              theme={
                app.clientSettings.theme === "dark"
                  ? emoji.Theme.DARK
                  : emoji.Theme.LIGHT
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary">
          <SendIcon />
        </Button>
      </footer>
    </div>
  );
}
