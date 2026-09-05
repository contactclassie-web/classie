import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Constructed lazily — building this at module scope crashes the whole route
    // (every online payment attempt) the moment either env var is unset, instead
    // of just failing this one request.
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys not configured')
      return NextResponse.json({ error: 'Online payment is not configured' }, { status: 503 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise mein
      currency: 'INR',
      receipt: `classie_${Date.now()}`,
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (err: unknown) {
    console.error('Razorpay order error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
