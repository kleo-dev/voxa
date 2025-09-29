"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    const res = await axios.post("/api/user", { username, password, email });
    Cookies.set("token", (res.data as any).token);
    redirect("/");
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-md mx-auto p-7 rounded-2xl flex flex-col gap-4 bg-neutral-900">
        <h1 className="mx-auto text-3xl">Sign Up</h1>
        <span>
          Email
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"john@example.com"}
            type="email"
          />
        </span>
        <span>
          Username
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder={"john"}
          />
        </span>
        <span>
          Password
          <Input
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") signup();
            }}
            type="password"
          />
        </span>

        <Button className="mt-4" onClick={signup}>
          Login
        </Button>
      </div>
    </div>
  );
}
