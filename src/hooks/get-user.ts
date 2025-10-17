"use client";

import { ProfileSettings } from "@/types/settings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/lib/request";
import { toast } from "sonner";

export interface UserProfile extends ProfileSettings {
  id: string;
}

export default function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        setUser((await get("/api/profile")).data);
      } catch (e: any) {
        router.push("/login");
        toast.error(`Error: ${e}`);
      }
    }

    fetchUser();
  }, [router]);

  return user;
}
