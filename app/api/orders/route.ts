import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { serverSupabase } from "@/lib/supabaseServer";
import { isAdminRequest } from "@/lib/adminAuth";
import { priceOrder } from "@/lib/orderPricing";
import { sendOrderEmails, sendReviewRequest } from "@/lib/emails";

const getSupabase = serverSupabase;

// Checks an online payment really happened for the amount we expect.
async function checkOnlinePayment(orderId: string, paymentId: string, signature: string, expectedPaise: number) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) return { ok: false, paid: 0 };
  const expectedSig = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  if (expectedSig.length !== String(signature).length
    || !crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(String(signature)))) {
    return { ok: false, paid: 0 };
  }
  try {
    const rzp = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, key_secret: secret });
    const order = await rzp.orders.fetch(orderId);
    const amount = Number(order.amount);
    return { ok: amount === expectedPaise, paid: amount / 100 };
  } catch (e) {
    console.error("Razorpay order fetch failed:", e);
    // Signature is valid, so the payment is real; amount couldn't be confirmed.
    return { ok: false, paid: 0 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name, customer_email, customer_phone,
      address, city, state, pincode,
      items, payment_method, coupon_code,
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
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
      console.log("⚠️  Supabase not configured. Mock order:", { id: mockId, customer_name });
      return NextResponse.json({ id: mockId, status: "pending" }, { status: 201 });
    }

    // Prices come from the database, not from the browser.
    const priced = await priceOrder(supabase, items, { couponCode: coupon_code, phone: customer_phone, email: customer_email });
    if (!priced.ok) return NextResponse.json({ error: priced.error }, { status: 400 });

    const isOnline = payment_method === "online";
    let paymentLabel = isOnline ? "online" : "cod";
    if (isOnline) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: "Payment details missing" }, { status: 400 });
      }
      // Same payment sent twice (double click / retry) → return the first order.
      const { data: existing } = await supabase.from("orders").select("id, status, total_amount").eq("payment_id", razorpay_payment_id).maybeSingle();
      if (existing) return NextResponse.json(existing, { status: 200 });

      const check = await checkOnlinePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, Math.round(priced.total * 100));
      if (!check.ok) {
        if (check.paid === 0 && !process.env.RAZORPAY_KEY_SECRET) {
          return NextResponse.json({ error: "Online payment is not configured" }, { status: 503 });
        }
        // Keep the order (the customer may have paid) but flag it for checking.
        paymentLabel = check.paid > 0 ? `online - CHECK: paid ₹${check.paid}` : "online - CHECK PAYMENT";
      }
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([{
        customer_name: String(customer_name).slice(0, 120),
        customer_email: customer_email ? String(customer_email).slice(0, 200) : null,
        customer_phone,
        address: String(address).slice(0, 500),
        city: String(city).slice(0, 100),
        state: String(state).slice(0, 100),
        pincode,
        items: priced.items,
        total_amount: priced.total,
        status: "pending",
        payment_method: paymentLabel,
        payment_id: isOnline ? razorpay_payment_id : null,
      }])
      .select("id, status, total_amount")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    // Record coupon use (server side, so it can't be faked or skipped).
    if (priced.coupon && priced.discount > 0) {
      const c = priced.coupon;
      await supabase.from("coupon_uses").insert({
        coupon_id: c.id,
        user_phone: customer_phone,
        user_email: customer_email || null,
        user_name: customer_name,
        order_id: data.id,
        order_total: priced.subtotal + priced.shipping,
        discount_applied: priced.discount,
        final_amount: priced.total,
        products_json: priced.items.map((i) => ({ name: i.title, qty: i.quantity, price: i.price, variant: i.variant || null })),
        items_count: priced.items.reduce((n, i) => n + i.quantity, 0),
      }).then(({ error: e }) => { if (e) console.error("coupon_uses insert error:", e); });
      await supabase.from("coupons").update({ uses_count: (c.uses_count || 0) + 1 }).eq("id", c.id);
    }

    // Send emails (non-blocking)
    sendOrderEmails({
      orderId: data.id,
      customerName: customer_name,
      customerEmail: customer_email || undefined,
      customerPhone: customer_phone,
      address,
      city,
      state,
      pincode,
      items: priced.items,
      totalAmount: priced.total,
      paymentMethod: paymentLabel,
      paymentId: isOnline ? razorpay_payment_id : undefined,
    })

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
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const body = await req.json();
  const { id, status } = body;
  if (!id || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: before } = await supabase.from("orders").select("status").eq("id", id).maybeSingle();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("id, status, customer_name, customer_email, items")
    .single();

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  // First time an order is marked delivered → ask the customer for a review.
  if (status === "delivered" && before?.status !== "delivered" && data.customer_email) {
    await sendReviewRequest({
      customerEmail: data.customer_email,
      customerName: data.customer_name,
      items: (Array.isArray(data.items) ? data.items : []) as { slug: string; title: string }[],
    });
  }
  return NextResponse.json({ id: data.id, status: data.status });
}
