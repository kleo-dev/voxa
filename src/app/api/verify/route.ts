import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../supa";
import { StatusCodes } from "http-status-codes";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const password = req.nextUrl.searchParams.get("password");

  if (!email || !password)
    return NextResponse.json(
      { message: "Missing email or password" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );

  if (!data)
    return NextResponse.json(
      { verified: false, message: "User not found" },
      { status: StatusCodes.NOT_FOUND }
    );

  const res = NextResponse.json({
    verified: !!data.user.email_confirmed_at,
    user_id: data.user.id,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  return res;
}
