"use client";

import { defaultSettings, getClientSettings } from "@/lib/clientSettings";
import { ClientSettings } from "@/types/settings";
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
