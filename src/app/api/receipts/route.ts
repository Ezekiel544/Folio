import { NextRequest, NextResponse } from "next/server";
import {
  assertApiKey,
  assertRateLimit,
  errorResponse,
  identityAllowed,
  clientIssueEnabled,
  getSessionWallet,
  assertSameOrigin,
} from "@/lib/server-auth";
import { assertIssuePayload, issueReceipt, listReceipts } from "@/lib/receipts";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    assertRateLimit(request, 120, 60_000, "receipts:list");
    const identity = request.nextUrl.searchParams.get("buyer") || undefined;
    if (identity) {
      // A connected wallet may list receipts tied to itself; businesses may
      // list any receipt via the API key.
      if (!identityAllowed(identity, request)) {
        return NextResponse.json(
          { error: "Unauthorized: connect your wallet or provide an API key." },
          { status: 401 },
        );
      }
      return NextResponse.json({ receipts: await listReceipts(identity) });
    }
    if (!assertApiKey(request)) {
      return NextResponse.json(
        { error: "Unauthorized: an API key is required to list all receipts." },
        { status: 401 },
      );
    }
    return NextResponse.json({ receipts: await listReceipts() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertRateLimit(request, 60, 60_000, "receipts:issue");
    const session = getSessionWallet(request);
    let authorized = assertApiKey(request);
    if (session && clientIssueEnabled()) {
      assertSameOrigin(request);
      authorized = true;
    }
    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: a business API key is required (client-side issuing is disabled).",
        },
        { status: 401 },
      );
    }
    const body: unknown = await request.json();
    assertIssuePayload(body);
    const receipt = await issueReceipt(body);
    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}