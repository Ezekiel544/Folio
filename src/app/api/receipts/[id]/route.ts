import { NextResponse } from "next/server";
import { getReceipt, normalizeReceipt } from "@/lib/receipts";
import { isOnchainConfigured, getOnchainProof } from "@/lib/onchain";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const receipt = await getReceipt(params.id);
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }
  // getOnchainProof hashes the receipt, so it must receive the exact stored
  // payload. Normalize only what we return to the client.
  const onchain = isOnchainConfigured()
    ? await getOnchainProof(params.id, receipt)
    : await Promise.resolve({ configured: false });
  return NextResponse.json({ receipt: normalizeReceipt(receipt), onchain });
}