import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../supa";
import { ProfileSettings } from "@/types/settings";

/**
 * POST /api/profile
 * body { username, display_name, avatar_url }
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const token = req.cookies.get("token")?.value;
  const { username, display_name, avatar_url, node_address } =
    (await req.json()) as ProfileSettings;

  if (!token)
    return NextResponse.json(
      { message: "Token cookie not found" },
      { status: StatusCodes.BAD_REQUEST }
    );

  if (
    !username ||
    !display_name ||
    avatar_url === undefined ||
    avatar_url === null ||
    node_address === undefined ||
    node_address === null
  )
    return NextResponse.json(
      {
        message:
          "Invalid body, requires username, display_name, avatar_url, node_address",
      },
      { status: StatusCodes.BAD_REQUEST }
    );

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user)
    return NextResponse.json(
      { message: "Invalid token" },
      { status: StatusCodes.NOT_FOUND }
    );

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name,
      avatar_url,
      node_address,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }

  return NextResponse.json({ message: "ok" });
}

/**
 * GET /api/profile?id=<id>
 * or cookie-based lookup
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const username = url.searchParams.get("username");
  const token = req.cookies.get("token")?.value;

  if (!token && !id && !username)
    return NextResponse.json(
      { message: "Query arg should be token or id or username" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const { data: profile, error } = id
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, node_address")
        .eq("id", id)
        .maybeSingle()
    : username
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, node_address")
        .eq("username", username)
        .maybeSingle()
    : await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, node_address")
        .eq("id", (await supabase.auth.getUser(token)).data.user?.id)
        .maybeSingle();

  if (error)
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );

  if (!profile)
    return NextResponse.json(
      { message: "Profile not found" },
      { status: StatusCodes.NOT_FOUND }
    );

  return NextResponse.json({ message: "ok", ...profile });
}
