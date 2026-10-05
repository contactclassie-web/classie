import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendContactNotification } from "@/lib/emails";
import { REQUEST_TAG } from "@/lib/customDesigns";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// Custom design requests are stored with contact messages (no new table),
// tagged so Admin → Custom Designs → Requests can list them separately.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: real visitors never fill this hidden field.
    if (clip(body.website, 200)) return NextResponse.json({ success: true });

    const name = clip(body.name, 80);
    const phone = clip(body.phone, 20).replace(/[^\d+ ]/g, "");
    const email = clip(body.email, 120);
    const details = clip(body.details, 2000);
    const make = clip(body.make, 80);
    const metal = clip(body.metal, 80);
    const pairs = Math.min(500, Math.max(1, Math.round(Number(body.pairs) || 1)));
    const neededBy = clip(body.neededBy, 80);
    const link = clip(body.link, 500);
    const consent = body.consent === true;

    if (!name || !details) {
      return NextResponse.json({ error: "Please add your name and describe your design." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid WhatsApp number." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please check your email address." }, { status: 400 });
    }

    const message = [
      REQUEST_TAG,
      `What: ${make || "-"}`,
      `Metal & stones: ${metal || "-"}`,
      `Pairs: ${pairs}`,
      `Needed by: ${neededBy || "-"}`,
      `Design link: ${link || "-"}`,
      `Collection consent: ${consent ? "Yes" : "No"}`,
      "",
      details,
    ].join("\n");

    const { error } = await supabase.from("contact_submissions").insert({
      first_name: name,
      last_name: "",
      email,
      phone,
      message,
    });
    if (error) {
      console.error("custom design insert error:", error);
      return NextResponse.json({ error: "Couldn't send your request. Please try again or message us on WhatsApp." }, { status: 500 });
    }

    // Email the admin (non-blocking; the request is already saved).
    sendContactNotification({ firstName: name, lastName: "", email: email || "(no email)", phone, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("custom design submit error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
