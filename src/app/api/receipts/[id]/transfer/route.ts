import { NextRequest, NextResponse } from "next/server";
import {
  assertApiKey,
  assertRateLimit,
  errorResponse,
  getSessionWallet,
} from "@/lib/server-auth";
import { transferReceipt } from "@/lib/receipts";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    assertRateLimit(request, 30, 60_000, "receipts:transfer");
    const session = getSessionWallet(request);
    const byBusiness = assertApiKey(request);
    if (!session && !byBusiness) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: connect the owner wallet or provide an API key to transfer.",
        },
        { status: 401 },
      );
    }
    const body = (await request.json()) as { to?: string; reference?: string };
    if (!body.to) {
      throw new Error("A destination identity is required.");
    }
    const receipt = await transferReceipt(params.id, body.to, {
      // A connected owner proves identity via the session; a business using
      // the API key acts with issuer privilege.
      by: session && !byBusiness ? session : undefined,
      reference: body.reference,
    });
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }
    return NextResponse.json({ receipt });
  } catch (error) {
    return errorResponse(error);
  }
}