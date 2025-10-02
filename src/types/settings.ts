import { RegexSetting, SettingsSchema } from "@/app/settings/settings";

export interface ClientSettings {
  theme: "light" | "dark";
}

export interface AccountSettings {
  node_ip: string;
}

export const CLIENT_SCHEMA: SettingsSchema = {
  theme: ["light", "dark"],
};

export const ACCOUNT_SCHEMA: SettingsSchema = {
  node_ip: new RegexSetting(
    "node2.voxa.org",
    /^(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/
  ),
};
