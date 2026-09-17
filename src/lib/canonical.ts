import { createHmac, timingSafeEqual } from "crypto";
import { env } from "./env.ts";

/**
 * Deterministic canonical JSON serialisation.
 *
 * Object keys are sorted recursively so that two structurally identical
 * receipts always serialise byte-for-byte identically, regardless of the
 * order they were constructed in. This makes HMAC signatures stable across
 * re-serialisation and across languages.
 */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    // Match JSON semantics: undefined has no representation. Object properties
    // holding undefined are dropped below; undefined array elements become null.
    return value === undefined ? "null" : JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
    .join(",")}}`;
}

/**
 * Signing secret. Never falls back to a default in production.
 */
export function getSigningKey(): string {
  return env(
    "PHAROS_RECEIPT_SECRET",
    process.env.NODE_ENV === "production"
      ? undefined
      : "local-development-key-change-before-production",
  );
}

/**
 * HMAC-SHA256 signature over the canonical serialisation.
 */
export function signObject(unsigned: unknown): string {
  return createHmac("sha256", getSigningKey())
    .update(stableStringify(unsigned))
    .digest("hex");
}

/**
 * Legacy canonicalisation used by receipts signed before deterministic
 * serialisation existed. Kept so historical receipts keep verifying.
 */
export function legacySignObject(unsigned: unknown): string {
  return createHmac("sha256", getSigningKey())
    .update(JSON.stringify(unsigned))
    .digest("hex");
}

export function signaturesEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}