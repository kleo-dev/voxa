"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<
    undefined | { kind: "error" | "info"; message: string }
  >();

  const router = useRouter();

  const login = async () => {
    setFeedback(undefined);
    try {
      const res = await axios.put("/api/user", { username, password });

      Cookies.set("token", (res.data as any).token);
      setFeedback({
        kind: "info",
        message: "Login successful! Redirecting...",
      });

      // small delay to show feedback before redirect
      setTimeout(() => router.push("/chat"), 800);
    } catch (err: any) {
      setFeedback({
        kind: "error",
        message:
          err.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-3xl mx-auto">Login</CardTitle>
      </CardHeader>
      <CardContent className="gap-3 flex flex-col">
        <span>
          Username or email
          <Input onChange={(e) => setUsername(e.target.value)} type="email" />
        </span>
        <span>
          Password
          <Input
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
            type="password"
          />
        </span>

        {feedback && (
          <div
            className={`text-sm rounded-md p-2 ${
              feedback.kind === "error"
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <Button className="mt-2" onClick={login}>
          Login
        </Button>
      </CardContent>
    </>
  );
}
