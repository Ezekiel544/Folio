import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { env } from "./env.ts";

function sessionSecret(): string {
  return env(
    "PHAROS_SESSION_SECRET",
    process.env.NODE_ENV === "production"
      ? undefined
      : "local-development-session-secret-change-before-production",
  );
}

export const newNonce = () => randomUUID();

export const signSession = (wallet: string) => {
  const secret = sessionSecret();
  const value = `${wallet.toLowerCase()}.${Date.now()}`;
  return `${value}.${createHmac("sha256", secret).update(value).digest("hex")}`;
};

export const verifySession = (token?: string): string | null => {
  if (!token) return null;
  const secret = sessionSecret();
  const [wallet, issuedAt, signature] = token.split(".");
  if (!wallet || !issuedAt || !signature) return null;
  if (Date.now() - Number(issuedAt) > 1000 * 60 * 60 * 24 * 7) return null;
  const expected = createHmac("sha256", secret)
    .update(`${wallet}.${issuedAt}`)
    .digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    )
      ? wallet
      : null;
  } catch {
    return null;
  }
};