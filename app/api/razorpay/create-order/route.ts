import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { serverSupabase } from '@/lib/supabaseServer'
import { priceOrder } from '@/lib/orderPricing'

// Creates the Razorpay order for the amount worked out on the server from the
// cart items (never an amount sent by the browser).
export async function POST(request: NextRequest) {
  try {
    const { items, coupon_code, phone, email } = await request.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Please refresh the page and try again.' }, { status: 400 })
    }

    // Constructed lazily — building this at module scope crashes the whole route
    // (every online payment attempt) the moment either env var is unset, instead
    // of just failing this one request.
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys not configured')
      return NextResponse.json({ error: 'Online payment is not configured' }, { status: 503 })
    }

    const sb = serverSupabase()
    if (!sb) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const priced = await priceOrder(sb, items, { couponCode: coupon_code, phone, email })
    if (!priced.ok) return NextResponse.json({ error: priced.error }, { status: 400 })
    if (priced.total <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(priced.total * 100), // paise mein
      currency: 'INR',
      receipt: `classie_${Date.now()}`,
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      total: priced.total,
    })
  } catch (err: unknown) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
