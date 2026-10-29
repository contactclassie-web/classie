import { NextResponse } from "next/server";

// Pincode → city (district) and state, for auto-filling the checkout address.
// Uses India Post's free public lookup; answers are cached for a day.
export async function GET(_req: Request, { params }: { params: { pin: string } }) {
  const pin = String(params.pin || "");
  if (!/^[1-9][0-9]{5}$/.test(pin)) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: ctrl.signal, next: { revalidate: 86400 } });
    clearTimeout(t);
    const data = (await res.json()) as { Status?: string; PostOffice?: { District?: string; State?: string }[] | null }[];
    const po = data?.[0]?.Status === "Success" ? data[0].PostOffice?.[0] : null;
    if (!po?.State) return NextResponse.json({ ok: false });
    return NextResponse.json({ ok: true, city: po.District || "", state: po.State }, { headers: { "Cache-Control": "public, max-age=86400" } });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
