import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { supabase } from "../supa";

const SERVER_AUTH_TOKENS = new Map<
  string,
  { user_id: string; server_id: string }
>();

/**
 * GET /api/auth?token=<relayToken>?key=<serverKey>
 * Called by a (DM node / Server) to verify a temporary relay token.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const key = url.searchParams.get("key");

  if (!token || !key) {
    return NextResponse.json(
      { message: "There should be a token and a key parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  const { data: server } = await supabase
    .from("servers")
    .select("id, created_at, owner, address")
    .eq("key", key)
    .maybeSingle();
  if (!server)
    return NextResponse.json(
      { message: "Key unauthorized" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  const auth = SERVER_AUTH_TOKENS.get(token);
  if (!auth) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: StatusCodes.NOT_FOUND }
    );
  }

  if (auth.server_id !== server.id)
    return NextResponse.json(
      { message: "Invalid id" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  SERVER_AUTH_TOKENS.delete(token);

  return NextResponse.json({ message: "ok", ...auth });
}

/**
 * POST /api/auth
 * Called by the client to request a temporary relay token for a DM server.
 *
 * Body: { server_id: string }
 * Header: Authorization: Bearer <supabase_jwt>
 */
export async function POST(req: NextRequest) {
  const { server_id } = await req.json();
  const authHeader = req.cookies.get("token");

  if (!server_id)
    return NextResponse.json(
      { message: "Missing server_id in the json body" },
      { status: StatusCodes.BAD_REQUEST }
    );

  if (!authHeader)
    return NextResponse.json(
      { message: "Missing Supabase Authorization header" },
      { status: StatusCodes.BAD_REQUEST }
    );

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
    server_id,
  });

  return NextResponse.json({ message: "ok", token: relayToken });
}
