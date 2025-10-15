import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { supabase } from "../supa";
/**
 * GET /api/auth?token=<relayToken>?key=<serverKey>
 * Called by a (DM node / Server) to verify a temporary relay token.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const key = url.searchParams.get("key");

  if (!token || !key)
    return NextResponse.json(
      { message: "There should be a token and a key parameter" },
      { status: StatusCodes.BAD_REQUEST }
    );

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

  const { data: auth } = await supabase
    .from("server_auth")
    .delete()
    .eq("key", token)
    .select()
    .maybeSingle();

  if (!auth)
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: StatusCodes.NOT_FOUND }
    );

  if (auth.server_id !== server.id)
    return NextResponse.json(
      { message: "Invalid id" },
      { status: StatusCodes.UNAUTHORIZED }
    );

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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(authHeader.value);

  if (error || !user) {
    return NextResponse.json(
      { message: "Invalid Supabase token" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const { data: relayToken, error: errorRelay } = await supabase
    .from("server_auth")
    .insert({
      user_id: user.id,
      server_id,
    })
    .select()
    .maybeSingle();

  if (!relayToken || errorRelay)
    return NextResponse.json(
      { message: "Failed to create relay token" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );

  return NextResponse.json({ message: "ok", token: relayToken.key });
}
