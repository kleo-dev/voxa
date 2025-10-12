import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { supabase } from "../supa";

const SERVER_AUTH_TOKENS = new Map<
  string,
  { user_id: string; server_ip: string }
>();

/**
 * GET /api/auth?token=<relayToken>
 * Called by a (DM node / Server) to verify a temporary relay token.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "There should be a token parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const auth = SERVER_AUTH_TOKENS.get(token);
  if (!auth) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  if (auth.server_ip !== ip && ip !== "::1") {
    return NextResponse.json(
      { message: "Invalid address" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  SERVER_AUTH_TOKENS.delete(token);

  return NextResponse.json({ message: "ok", ...auth });
}

/**
 * POST /api/auth
 * Called by the client to request a temporary relay token for a DM server.
 *
 * Body: { server_ip: string }
 * Header: Authorization: Bearer <supabase_jwt>
 */
export async function POST(req: NextRequest) {
  const { server_ip } = await req.json();
  const authHeader = req.cookies.get("token");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Missing Supabase Authorization header" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const supabaseToken = authHeader.value;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(supabaseToken);

  if (error || !user) {
    return NextResponse.json(
      { message: "Invalid Supabase token" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const relayToken = crypto.randomUUID();

  SERVER_AUTH_TOKENS.set(relayToken, {
    user_id: user.id,
    server_ip: String(server_ip),
  });

  return NextResponse.json({ message: "ok", token: relayToken });
}
