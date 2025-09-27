import { NextRequest, NextResponse } from "next/server";
import { CLIENT_AUTH_TOKENS, SERVER_AUTH_TOKENS } from "./auth";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token)
    return NextResponse.json(
      { message: "There should be a token parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const auth = SERVER_AUTH_TOKENS[token];

  if (!auth)
    return NextResponse.json(
      { message: "Invalid token" },
      { status: StatusCodes.NOT_FOUND }
    );

  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // ::1 for testing
  if (auth.server_ip !== ip && ip !== "::1") {
    return NextResponse.json(
      { message: "Invalid address" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  delete SERVER_AUTH_TOKENS[token];

  return NextResponse.json({ message: "ok", ...auth });
}

export async function POST(req: NextRequest) {
  let { server_ip, session_token } = await req.json();

  const token = crypto.randomUUID();

  const user_id = CLIENT_AUTH_TOKENS[session_token];

  if (!user_id)
    return NextResponse.json(
      { message: "Invalid token" },
      { status: StatusCodes.NOT_FOUND }
    );

  SERVER_AUTH_TOKENS[token] = {
    user_id,
    server_ip: String(server_ip),
  };

  return NextResponse.json({ message: "ok", token });
}
