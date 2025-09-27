import { StringMap } from "@/types/typeUtils";

type ServerAuth = {
  server_ip: string;
  user_id: number;
};

// { token: userid }
export const CLIENT_AUTH_TOKENS: StringMap<number> = {};

export const SERVER_AUTH_TOKENS: StringMap<ServerAuth> = {};
