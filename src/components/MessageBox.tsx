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
import { SmilePlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NumberMap, StringMap } from "@/types/typeUtils";
import { User } from "@/hooks/get-user";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ProfilePicture from "./ProfilePicture";

function MessageContainer({
  message,
  userList,
  setUserList,
}: {
  message: Message;
  userList: NumberMap<User>;
  setUserList: React.Dispatch<React.SetStateAction<NumberMap<User>>>;
}) {
  useEffect(() => {
    axios
      .get("/api/profile/", { params: { id: message.from } })
      .then((res) =>
        setUserList((prev) => ({ ...prev, [message.from]: res.data as User }))
      )
      .catch(console.error);
  }, [message.from, setUserList]);

  return (
    <div className="flex flex-col gap-3 rounded-lg p-4 hover:bg-accent">
      <div className="flex gap-2">
        {/* <div className="w-8 h-8 rounded-full bg-gray-400" /> */}
        <ProfilePicture
          name={String(
            userList[message.from]
              ? userList[message.from].username
              : message.from
          )}
        />
        <div className="flex flex-col flex-1">
          <span className="font-bold flex gap-1 items-center">
            {userList[message.from]
              ? userList[message.from].username
              : message.from}

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
  messages,
  userList,
  setUserList,
  sendMessage,
  channelName,
}: {
  messages: Message[];
  userList: NumberMap<User>;
  setUserList: React.Dispatch<React.SetStateAction<NumberMap<User>>>;
  sendMessage: (m: string) => void;
  channelName?: string;
}) {
  const [text, setText] = useState("");

  return (
    <div className="h-screen w-full flex flex-col pb-5 pl-5 gap-5">
      {channelName && (
        <header className="h-12 py-4 flex items-center border-b text-sm font-semibold">
          {channelName}
        </header>
      )}
      <div className="w-full flex-1 overflow-y-scroll flex gap-2 flex-col-reverse pr-5">
        {messages.map((msg) => (
          <MessageContainer
            key={msg.id}
            message={msg}
            userList={userList}
            setUserList={setUserList}
          />
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
              setText("");
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
