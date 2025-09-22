import { NextRequest, NextResponse } from "next/server";
import {
	StatusCodes,
} from 'http-status-codes';
import { narrow } from "@/types/typeUtils";
import { CLIENT_AUTH_TOKENS, SERVER_AUTH_TOKENS } from "./auth";

type Intents = 'server' | 'client';

const narrowIntents = (intents?: string | null) => narrow(intents, 'client', 'server') as Intents;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const intents = narrowIntents(url.searchParams.get('intents')); 

  if (!token)
    return NextResponse.json({ message: "token parameter required" });

  switch (intents) {
    case "server":
      {
        const auth = SERVER_AUTH_TOKENS[token];
        
        if (!auth)
          return NextResponse.json({ message: "Invalid token" });

        const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || '127.0.0.1').replace('::1', '127.0.0.1');

        if (auth.server_ip !== ip) {
          return NextResponse.json({ message: "Invalid address" });
        }
        
        delete SERVER_AUTH_TOKENS[token];

        return NextResponse.json({ message: "ok", ...auth });
      }
    case "client":
      {
        const auth = CLIENT_AUTH_TOKENS[token];
        if (!auth)
          return NextResponse.json({ message: "Invalid token" }, { status: StatusCodes.NOT_FOUND });
        return NextResponse.json({ message: "ok", auth });
      }
  }
}

export async function POST(req: NextRequest) {
  let { intents, server_ip } = await req.json();

  intents = String(intents).split('/');

  const token = crypto.randomUUID();

  const user_id = 12;

  switch (narrowIntents(intents[0])) {
    case 'server':
      SERVER_AUTH_TOKENS[token] = {
        user_id, // placeholder
        server_ip: String(server_ip),
      };
      return NextResponse.json({ message: "ok", token });
    case 'client':
      CLIENT_AUTH_TOKENS[token] = user_id;
      return NextResponse.json({ message: "ok", token });
    default:
      return NextResponse.json({ message: 'Invalid intentions' }, { status: StatusCodes.BAD_REQUEST });
  }
}