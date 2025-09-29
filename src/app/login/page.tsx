"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.put("/api/user", { username, password });
    Cookies.set("token", (res.data as any).token);
    redirect("/");
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-md mx-auto p-7 rounded-2xl flex flex-col gap-4 bg-neutral-900">
        <h1 className="mx-auto text-3xl">Login</h1>
        <span>
          Username
          <Input onChange={(e) => setUsername(e.target.value)} />
        </span>
        <span>
          Password
          <Input
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />
        </span>

        <Label>
          Don't have an account? <Link href={"/signup"}>Sign Up</Link>
        </Label>

        <Button className="mt-2" onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}
