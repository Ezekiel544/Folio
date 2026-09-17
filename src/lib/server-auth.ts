import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./auth.ts";
import { env, envBool } from "./env.ts";
import { identitiesMatch } from "./receipts.ts";
import { rateLimit } from "./rate-limit.ts";

export class HttpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function devApiKeyFallback(): string | undefined {
  return process.env.NODE_ENV === "production"
    ? undefined
    : "folio_local_development_key";
}

/**
 * Business API key check. Empty/missing keys never match.
 */
export function assertApiKey(request: NextRequest): boolean {
  const key = request.headers.get("x-api-key");
  if (!key) return false;
  const expected = env("PHAROS_API_KEY", devApiKeyFallback());
  return key === expected;
}

export function getSessionWallet(request: NextRequest): string | null {
  try {
    return verifySession(request.cookies.get("pharos_session")?.value);
  } catch {
    return null;
  }
}

/**
 * Cross-site request forgery guard for browser-initiated state changes.
 * Requests carrying an Origin/Referer must come from the same host.
 * Pure server-to-server calls (API key, non-browser clients) omit the header
 * and are unaffected.
 */
export function assertSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  let host: string | null =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  host = host?.split(":")[0] ?? null;
  if (!host) return;
  let originHost: string;
  try {
    originHost = new URL(origin).hostname;
  } catch {
    throw new HttpError("Invalid Origin header.", 403);
  }
  if (originHost !== host) {
    throw new HttpError("Cross-origin request blocked.", 403);
  }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "local";
}

export function assertRateLimit(
  request: NextRequest,
  limit = 60,
  windowMs = 60_000,
  label = "api",
): void {
  const ip = getClientIp(request);
  const { ok, resetAt } = rateLimit(`${label}:${ip}`, limit, windowMs);
  if (!ok) {
    throw new HttpError("Too many requests. Try again shortly.", 429);
  }
  void resetAt;
}

/**
 * A logged-in dashboard user may issue receipts on behalf of the installed
 * business only when PHAROS_ALLOW_CLIENT_ISSUE=true (dev/demo convenience).
 * Production should always be key-first via the SDK / server.
 */
export function clientIssueEnabled(): boolean {
  return process.env.NODE_ENV !== "production"
    ? envBool("PHAROS_ALLOW_CLIENT_ISSUE", true)
    : envBool("PHAROS_ALLOW_CLIENT_ISSUE", false);
}

export function identityAllowed(identity: string, request: NextRequest): boolean {
  const wallet = getSessionWallet(request);
  if (wallet && identitiesMatch(wallet, identity)) return true;
  return assertApiKey(request);
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: message }, { status: 400 });
}