import { NextRequest, NextResponse } from "next/server";
import pool from "../db";
import { StatusCodes } from "http-status-codes";
import { CLIENT_AUTH_TOKENS } from "../auth/auth";

/*
Input:
    {
        "name": "<Bob Smith>",
        "password": "<bobsmith21>"
    }
Output:
    {
        "message": "ok",
        "token": "<crypto-uuid>",
    }
*/
export async function POST(req: NextRequest) {
  let { name, username, email, password } = await req.json();

  const user_ = await pool.query(
    "SELECT id, username, email FROM users WHERE username = $1;",
    [username]
  );

  if (user_.rows.length > 0) {
    return NextResponse.json({ message: "Username already used" }, { status: StatusCodes.CONFLICT });
  }

  const user_email = await pool.query(
    "SELECT id, username, email FROM users WHERE email = $1;",
    [email]
  );

  if (user_email.rows.length > 0) {
    return NextResponse.json({ message: "Email already used" }, { status: StatusCodes.CONFLICT });
  }

  // TODO: Hash the password
  const result = await pool.query("INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id;", [username, email, password]);
  const token = crypto.randomUUID();

  CLIENT_AUTH_TOKENS[token] = result.rows[0].id;

  return NextResponse.json({ message: "ok", token, user_id: result.rows[0].id });
}

export async function DELETE(req: NextRequest) {
  let { username } = await req.json();

  await pool.query(
    "DELETE FROM users WHERE username = $1;",
    [username]
  );

  return NextResponse.json({ message: "ok" });
}
