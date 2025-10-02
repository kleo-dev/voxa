"use client";

import { defaultSettings, getClientSettings } from "@/lib/clientSettings";
import { AccountSettings, ClientSettings } from "@/types/settings";
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

export function useAccountSettings(): [
  AccountSettings,
  Dispatch<SetStateAction<AccountSettings>>
] {
  const [settings, setSettings] = useState<AccountSettings>({
    node_ip: "node0.voxa.org",
  });

  return [settings, setSettings];
}
