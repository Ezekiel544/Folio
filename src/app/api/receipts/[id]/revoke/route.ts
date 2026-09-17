import { NextRequest, NextResponse } from "next/server";
import {
  assertApiKey,
  assertRateLimit,
  errorResponse,
  getSessionWallet,
} from "@/lib/server-auth";
import { revokeReceipt } from "@/lib/receipts";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    assertRateLimit(request, 30, 60_000, "receipts:revoke");
    const session = getSessionWallet(request);
    const byBusiness = assertApiKey(request);
    if (!session && !byBusiness) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: connect the owner wallet or provide an API key to revoke.",
        },
        { status: 401 },
      );
    }
    const body = (await request.json().catch(() => ({}))) as { reason?: string };
    const receipt = await revokeReceipt(params.id, {
      by: session && !byBusiness ? session : undefined,
      reason: body.reason,
    });
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }
    return NextResponse.json({ receipt });
  } catch (error) {
    return errorResponse(error);
  }
}