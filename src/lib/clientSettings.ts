import { ClientSettings } from "@/types/config";
import Cookies from "js-cookie";

const defaultSettings: ClientSettings = {
  theme: "dark",
};

export function getClientSettings(): ClientSettings {
  const s_cookie = Cookies.get("settings");
  let parsed: Partial<ClientSettings> = {};

  if (s_cookie) {
    try {
      parsed = JSON.parse(s_cookie);
    } catch {
      parsed = {};
    }
  }

  return {
    ...defaultSettings,
    ...parsed,
  };
}

export function setClientSettings(value?: ClientSettings) {
  Cookies.set("settings", JSON.stringify(value || defaultSettings));
}
