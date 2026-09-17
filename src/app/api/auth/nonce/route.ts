import { NextRequest, NextResponse } from "next/server";
import { newNonce } from "@/lib/auth";
import { assertRateLimit, errorResponse } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    assertRateLimit(request, 30, 60_000, "auth:nonce");
    const nonce = newNonce();
    const response = NextResponse.json({ nonce });
    response.cookies.set("pharos_nonce", nonce, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 300,
      path: "/",
    });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}