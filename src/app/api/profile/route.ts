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
  const { username, display_name, avatar_url } =
    (await req.json()) as ProfileSettings;

  if (!token)
    return NextResponse.json(
      { message: "Token cookie not found" },
      { status: StatusCodes.BAD_REQUEST }
    );

  if (!username || !display_name || !avatar_url)
    return NextResponse.json(
      { message: "Invalid body, requires username, display_name, avatar_url" },
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
  const query_id = url.searchParams.get("id");
  const token = req.cookies.get("token")?.value;

  if (!query_id && !token)
    return NextResponse.json(
      { message: "Query arg should be token or id" },
      { status: StatusCodes.BAD_REQUEST }
    );

  let user_id = query_id;
  if (!user_id && token) {
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    user_id = user?.id ?? null;
  }

  if (!user_id)
    return NextResponse.json(
      { message: "Invalid token" },
      { status: StatusCodes.NOT_FOUND }
    );

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", user_id)
    .maybeSingle();

  return NextResponse.json({ message: "ok", ...profile });
}
