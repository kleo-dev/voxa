"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<
    undefined | { kind: "error" | "info"; message: string }
  >();

  const router = useRouter();

  const validateInput = ():
    | { kind: "error" | "info"; message: string }
    | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!emailRegex.test(email)) {
      return { kind: "error", message: "Invalid email format." };
    }
    if (!usernameRegex.test(username)) {
      return {
        kind: "error",
        message:
          "Username must be 3–20 characters and only letters, numbers, or underscores.",
      };
    }
    if (password.length < 6) {
      return {
        kind: "error",
        message: "Password must be at least 6 characters long.",
      };
    }
    if (password !== confirmPassword) {
      return { kind: "error", message: "Passwords do not match." };
    }
    if (!acceptTerms) {
      return {
        kind: "error",
        message: "You must accept the terms to sign up.",
      };
    }
    return;
  };

  const signup = async () => {
    setFeedback(undefined);
    const validationError = validateInput();
    if (validationError) {
      setFeedback(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user", { username, password, email });
      Cookies.set("token", (res.data as any).token);

      setFeedback({ kind: "info", message: "Account created! Redirecting..." });
      setTimeout(() => router.push("/home"), 1000);
    } catch (err: any) {
      setFeedback({
        kind: "error",
        message:
          err.response?.data?.message ||
          "Signup failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-md mx-auto p-7 rounded-2xl flex flex-col gap-4 bg-neutral-900 shadow-lg">
        <h1 className="mx-auto text-3xl font-bold">Create an Account</h1>
        <span>
          Email
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            type="email"
          />
        </span>
        <span>
          Username
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="john_doe"
          />
        </span>
        <span>
          Password
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </span>
        <span>
          Confirm Password
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") signup();
            }}
            type="password"
          />
        </span>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          I agree to the <Link className="underline" href="/terms">terms & conditions</Link>
        </label>

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

        <Button className="mt-4" onClick={signup} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
