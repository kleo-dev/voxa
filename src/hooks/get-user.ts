"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = (await axios.get("/api/profile")).data as User;

        setUser(res);
      } catch {
        router.push("/login");
      }
    }

    fetchUser();
  }, [router]);

  return user;
}
