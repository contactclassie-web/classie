import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url === "your_supabase_url") return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name, customer_email, customer_phone,
      address, city, state, pincode,
      items, total_amount, payment_method,
    } = body;

    // Validation
    if (!customer_name || !customer_phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }
    if (!/^[0-9]{10}$/.test(customer_phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    const supabase = getSupabase();

    // If Supabase not configured, return a mock order ID for development
    if (!supabase) {
      const mockId = `DEV-${Date.now()}`;
      console.log("⚠️  Supabase not configured. Mock order:", { id: mockId, customer_name, total_amount });
      return NextResponse.json({ id: mockId, status: "pending" }, { status: 201 });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([{
        customer_name,
        customer_email: customer_email || null,
        customer_phone,
        address,
        city,
        state,
        pincode,
        items,
        total_amount,
        status: "pending",
        payment_method: payment_method || "cod",
      }])
      .select("id, status")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  if (id) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, customer_name, status, total_amount, created_at, items")
      .eq("id", id)
      .single();
    if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  // Admin: all orders
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json(data);
}
