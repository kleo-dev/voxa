import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "ok", version: "0.0.1" });
}
