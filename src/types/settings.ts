import { SettingsSchema } from "@/app/settings/settings";

export interface ClientSettings {
  theme: "light" | "dark";
}

export interface AccountSettings {}

export const CLIENT_SCHEMA: SettingsSchema = {
  theme: ["light", "dark"],
};

export const ACCOUNT_SCHEMA: SettingsSchema = {
  node_ip: "string",
};
