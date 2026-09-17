import { NextRequest, NextResponse } from "next/server";
import { assertRateLimit, errorResponse } from "@/lib/server-auth";
import { verifyReceipt } from "@/lib/receipts";

export const runtime = "nodejs";

/** Public verification. This is the point of the receipt: anyone can check it. */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    assertRateLimit(request, 120, 60_000, "receipts:verify");
    const result = await verifyReceipt(params.id);
    return NextResponse.json(result, { status: result.valid ? 200 : 404 });
  } catch (error) {
    return errorResponse(error);
  }
}