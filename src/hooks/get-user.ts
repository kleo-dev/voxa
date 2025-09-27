"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = (
          await axios.get("/api/user", {
            params: { token },
          })
        ).data as User;

        setUser(res);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  return { user, loading };
}
