/**
 * Environment helpers.
 *
 * Secrets must come from the environment. In production there is NO fallback:
 * missing required values make the process fail loudly instead of silently
 * shipping with a public default key.
 */
export function env(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value !== undefined && value.trim() !== "") return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

export function envBool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export function requireEnv(name: string): string {
  return env(name);
}