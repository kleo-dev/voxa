"use client";

import { ProfileSettings } from "@/types/settings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/lib/request";

export interface UserProfile extends ProfileSettings {
  id: string;
}

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setUser((await get("/api/profile")).data);
      } catch {
        router.push("/login");
      }
    }

    fetchUser();
  }, [router]);

  return user;
}
