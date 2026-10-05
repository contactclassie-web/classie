import crypto from "crypto";
import type { NextRequest } from "next/server";
import { serviceKey } from "@/lib/supabaseServer";

// Admin login is checked on the server. A successful login sets an httpOnly
// cookie holding a signed expiry time; every admin API checks it.

export const ADMIN_COOKIE = "classie_admin_session";
const SESSION_DAYS = 7;

// SHA-256 of the old password that used to sit in the browser code. It works
// only until ADMIN_PASSWORD is set in Vercel (and never once it is).
const LEGACY_PASSWORD_SHA256 = "d4f15b6ee696b70842de026d35eb9e547338a004d289594d378f6784c2e1e56f";

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest();

function expectedHash(): Buffer {
  return process.env.ADMIN_PASSWORD ? sha256(process.env.ADMIN_PASSWORD) : Buffer.from(LEGACY_PASSWORD_SHA256, "hex");
}

// True while the admin still opens with the old (public) password.
export function usingLegacyPassword(): boolean {
  return expectedHash().toString("hex") === LEGACY_PASSWORD_SHA256;
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET
    || crypto.createHash("sha256").update(`classie|${expectedHash().toString("hex")}|${serviceKey()}`).digest("hex");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(): { token: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const exp = String(Date.now() + maxAge * 1000);
  return { token: `${exp}.${sign(exp)}`, maxAge };
}

export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function isAdminRequest(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export function checkPassword(input: string): boolean {
  return crypto.timingSafeEqual(sha256(String(input)), expectedHash());
}
