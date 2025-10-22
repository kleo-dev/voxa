"use client";

import { ProfileSettings } from "@/types/settings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/lib/request";
import { toast } from "sonner";
import axios from "axios";

export interface UserProfile extends ProfileSettings {
  id: string;
}

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        setUser((await get("/api/profile", (r) => setUser(r.data))).data);
      } catch (e: any) {
        try {
          console.log("Failed to obtain current user, refreshing token..");
          const refresh = await axios.put("/api/auth/");
          const { access_token, refresh_token } = refresh.data as any;
          Cookies.set("token", access_token);
          Cookies.set("refresh_token", refresh_token);

          setUser((await get("/api/profile", (r) => setUser(r.data))).data);
        } catch (e: any) {
          router.push("/auth?t=login");
          toast.error(`Error: ${e}`);
        }
      }
    }

    fetchUser();
  }, []);

  return user;
}
