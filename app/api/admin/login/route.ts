import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/adminAuth";

// Simple per-instance throttle against password guessing.
const fails = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const f = fails.get(ip);
  if (f && f.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!password || !checkPassword(password)) {
    const n = (f?.n ?? 0) + 1;
    fails.set(ip, { n, until: n >= 5 ? Date.now() + 10 * 60 * 1000 : 0 });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
  }
  fails.delete(ip);
  const { token, maxAge } = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  return res;
}
