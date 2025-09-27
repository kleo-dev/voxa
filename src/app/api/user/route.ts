import { NextRequest, NextResponse } from "next/server";
import pool, { initDb } from "../db";
import { StatusCodes } from "http-status-codes";
import { CLIENT_AUTH_TOKENS } from "../auth/auth";

export async function POST(req: NextRequest) {
  let { name, username, email, password } = await req.json();

  const user_ = await pool.query(
    "SELECT id, username, email FROM users WHERE username = $1;",
    [username]
  );

  if (user_.rows.length > 0) {
    return NextResponse.json(
      { message: "Username already used" },
      { status: StatusCodes.CONFLICT }
    );
  }

  const user_email = await pool.query(
    "SELECT id, username, email FROM users WHERE email = $1;",
    [email]
  );

  if (user_email.rows.length > 0) {
    return NextResponse.json(
      { message: "Email already used" },
      { status: StatusCodes.CONFLICT }
    );
  }

  // TODO: Hash the password
  const result = await pool.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id;",
    [username, email, password]
  );
  const token = crypto.randomUUID();

  CLIENT_AUTH_TOKENS[token] = parseInt(result.rows[0].id);

  return NextResponse.json({
    message: "ok",
    token,
    user_id: result.rows[0].id,
  });
}

export async function PUT(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password)
    return NextResponse.json(
      { message: "Body must have username and password" },
      { status: StatusCodes.BAD_REQUEST }
    );

  const user = await pool.query(
    "SELECT id, username, email FROM users WHERE password_hash = $2 AND username = $1 OR email = $1;",
    [username, password]
  );

  if (user.rowCount === 0)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: StatusCodes.UNAUTHORIZED }
    );

  const token = crypto.randomUUID();

  CLIENT_AUTH_TOKENS[token] = parseInt(user.rows[0].id);

  return NextResponse.json({ message: "ok", token });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  let query_id = url.searchParams.get("id");
  const token = req.cookies.get("token")?.value;

  if (!query_id && !token)
    return NextResponse.json(
      { message: "Query arg should be token or id" },
      { status: StatusCodes.BAD_REQUEST }
    );
  else {
    const id = query_id ? query_id : token ? CLIENT_AUTH_TOKENS[token] : null;

    if (!id)
      return NextResponse.json(
        { message: "Invalid token" },
        { status: StatusCodes.NOT_FOUND }
      );

    const user = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1;",
      [id]
    );

    return NextResponse.json({ message: "ok", ...user.rows[0] });
  }
}

export async function DELETE(req: NextRequest) {
  let { username } = await req.json();

  await pool.query("DELETE FROM users WHERE username = $1;", [username]);

  return NextResponse.json({ message: "ok" });
}

initDb();
