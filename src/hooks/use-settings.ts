"use client";

import { defaultSettings, getClientSettings } from "@/lib/clientSettings";
import { ProfileSettings, ClientSettings } from "@/types/settings";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useClientSettings(): [
  ClientSettings,
  Dispatch<SetStateAction<ClientSettings>>
] {
  const [settings, setSettings] = useState<ClientSettings>(defaultSettings);

  useEffect(() => {
    setSettings(getClientSettings());
  }, []);

  return [settings, setSettings];
}

export function useProfileSettings(): [
  ProfileSettings,
  Dispatch<SetStateAction<ProfileSettings>>
] {
  const [settings, setSettings] = useState<ProfileSettings>({
    node_address: "",
    username: "",
    display_name: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function fetchProfileSettings() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = (await res.json()) as ProfileSettings;
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile settings:", error);
      }
    }

    fetchProfileSettings();
  }, []);

  return [settings, setSettings];
}
