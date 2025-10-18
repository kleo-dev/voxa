import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../supa";
import { StatusCodes } from "http-status-codes";

/**
 * GET /api/server/<id>
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from("servers")
    .select("id, name, created_at, owner, address, icon_url")
    .eq("id", id)
    .maybeSingle();

  if (!profile)
    return NextResponse.json(
      { message: "not found" },
      { status: StatusCodes.NOT_FOUND }
    );

  return NextResponse.json({ message: "ok", ...profile });
}
