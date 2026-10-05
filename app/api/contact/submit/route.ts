import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabaseServer";
import { sendContactNotification } from "@/lib/emails";



export async function POST(req: NextRequest) {
  try {
    const supabase = serverSupabase();
    if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const body = await req.json();
    const { first_name, last_name, email, phone, message } = body;

    // Validate required fields
    if (!first_name || !email || !message) {
      return NextResponse.json(
        { error: "first_name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("contact_submissions").insert({
      first_name,
      last_name: last_name || "",
      email,
      phone: phone || "",
      message,
    });

    if (error) {
      console.error("contact_submissions insert error:", error);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    // Notify admin by email (non-blocking — submission is already saved either way)
    sendContactNotification({ firstName: first_name, lastName: last_name, email, phone, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact submit error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
