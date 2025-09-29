"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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
      setTimeout(() => router.push("/home"), 800);
    } catch (err: any) {
      setFeedback({
        kind: "error",
        message:
          err.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-md mx-auto p-7 rounded-2xl flex flex-col gap-4 bg-neutral-900">
        <h1 className="mx-auto text-3xl">Login</h1>
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

        {/* Feedback message */}
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

        <Label>
          Don&apos;t have an account? <Link href={"/signup"}>Sign Up</Link>
        </Label>

        <Button className="mt-2" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}
