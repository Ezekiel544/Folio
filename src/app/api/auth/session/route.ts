import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { assertRateLimit, errorResponse } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    assertRateLimit(request, 60, 60_000, "auth:session");
    return NextResponse.json({ wallet: verifySession(request.cookies.get("pharos_session")?.value) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    assertRateLimit(request, 30, 60_000, "auth:session:delete");
    const response = NextResponse.json({ ok: true });
    response.cookies.set("pharos_session", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}