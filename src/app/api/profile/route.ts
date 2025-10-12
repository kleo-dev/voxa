import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../supa";

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
    .select("id, username, name, email")
    .eq("id", user_id)
    .maybeSingle();

  return NextResponse.json({ message: "ok", ...profile });
}
