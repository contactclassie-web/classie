import { NextResponse } from "next/server";

// Coupon use is now recorded by /api/orders when the order is saved (on the
// server, with the real amounts). Kept so an old open checkout tab doesn't error.
export async function POST() {
  return NextResponse.json({ ok: true });
}
