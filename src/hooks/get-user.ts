"use client";

import { ProfileSettings } from "@/types/settings";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        const res = (await axios.get("/api/profile")).data as UserProfile;

        setUser(res);
      } catch {
        router.push("/login");
      }
    }

    fetchUser();
  }, [router]);

  return user;
}
