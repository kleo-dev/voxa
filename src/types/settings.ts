import { RegexSetting, SettingsSchema } from "@/app/settings/settings";

export interface ClientSettings {
  theme: "light" | "dark";
}

export interface ProfileSettings {
  username: string;
  display_name: string;
  avatar_url: string;
  node_address: string;
}

export const CLIENT_SCHEMA: SettingsSchema = {
  theme: ["light", "dark"],
};

export const PROFILE_SCHEMA: SettingsSchema = {
  username: "string",
  display_name: "string",
  avatar_url: "string",
  node_address: new RegexSetting(
    "node2.voxa.org",
    /^(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/
  ),
};
