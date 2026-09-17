import { NextRequest, NextResponse } from "next/server";
import { getAddress, verifyMessage } from "ethers";
import { signSession } from "@/lib/auth";
import { HttpError, assertRateLimit, assertSameOrigin } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request, 20, 60_000, "auth:wallet");
    assertSameOrigin(request);
    const { address, message, signature } = (await request.json()) as {
      address?: string;
      message?: string;
      signature?: string;
    };
    const nonce = request.cookies.get("pharos_nonce")?.value;
    if (!address || !message || !signature || !nonce || message !== `Sign in to Folio\nNonce: ${nonce}`) {
      throw new HttpError("Invalid sign-in request.", 401);
    }
    const recovered = getAddress(verifyMessage(message, signature));
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      throw new HttpError("Wallet signature does not match address.", 401);
    }
    const response = NextResponse.json({ wallet: recovered });
    response.cookies.set("pharos_session", signSession(recovered), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    response.cookies.delete("pharos_nonce");
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Wallet sign-in failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}