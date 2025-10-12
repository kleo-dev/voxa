import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { supabase } from "../supa";

/**
 * POST /api/user
 * Register new user
 * Body: { name, username, email, password }
 */
export async function POST(req: NextRequest) {
  const { name, username, email, password } = await req.json();

  if (!email || !password || !username)
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const { data: existing } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existing)
    return NextResponse.json(
      { message: "Username already used" },
      { status: StatusCodes.CONFLICT }
    );

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, username },
    });

  if (authError)
    return NextResponse.json(
      { message: authError.message },
      { status: StatusCodes.BAD_REQUEST }
    );

  await supabase.from("profiles").insert({
    id: authData.user.id,
    name,
    username,
  });

  return NextResponse.json({
    message: "ok",
    user_id: authData.user.id,
  });
}

/**
 * GET /api/user
 * Login user
 * Params: { username, password }
 */
export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const [username, password] = [params.get("username"), params.get("password")];

  if (!username || !password)
    return NextResponse.json(
      { message: "Params username and password are required" },
      { status: StatusCodes.BAD_REQUEST }
    );

  let email = username;
  if (!username.includes("@")) {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", username)
      .maybeSingle();
    email = data?.email;
  }

  if (!email)
    return NextResponse.json(
      { message: "Invalid username" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  const { session } = data;
  const res = NextResponse.json({
    message: "ok",
    access_token: session?.access_token,
    refresh_token: session?.refresh_token,
    user_id: session?.user?.id,
  });

  // Optionally set cookie
  res.cookies.set("token", session?.access_token ?? "", { httpOnly: true });

  return res;
}

/**
 * DELETE /api/auth
 * Body: { username }
 */
export async function DELETE(req: NextRequest) {
  const { username } = await req.json();

  // Delete both profile + auth user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (profile) {
    await supabase.auth.admin.deleteUser(profile.id);
    await supabase.from("profiles").delete().eq("id", profile.id);
  }

  return NextResponse.json({ message: "ok" });
}
