import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  title: string
  quantity: number
  price: number
  variant?: string
}

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  address: string
  city: string
  state: string
  pincode: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  paymentId?: string
}

// ── Customer confirmation email ───────────────────────────────────────────────
function customerEmailHtml(data: OrderEmailData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
        <strong>${item.title}</strong>${item.variant ? ` <span style="color:#888">(${item.variant})</span>` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Order Confirmed — CLASSIE™</title></head>
    <body style="margin:0;padding:0;background:#f9f9f9;font-family:'Helvetica Neue',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
            
            <!-- Header -->
            <tr>
              <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:6px;font-weight:300;">CLASSIE™</h1>
                <p style="color:#aaaaaa;margin:8px 0 0;font-size:12px;letter-spacing:2px;">YOUR ORDER IS CONFIRMED</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <p style="font-size:16px;color:#333;margin:0 0 8px;">Hi ${data.customerName},</p>
                <p style="font-size:14px;color:#666;margin:0 0 32px;">Thank you for your order! We're getting it ready for you.</p>

                <!-- Order ID -->
                <div style="background:#f9f9f9;border:1px solid #ebebeb;padding:16px 20px;margin-bottom:32px;border-radius:4px;">
                  <p style="margin:0;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Order ID</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#1a1a1a;font-family:monospace;">${data.orderId}</p>
                </div>

                <!-- Items -->
                <h3 style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;margin:0 0 16px;font-weight:600;">Items Ordered</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr style="border-bottom:2px solid #1a1a1a;">
                    <th style="text-align:left;padding:8px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Product</th>
                    <th style="text-align:center;padding:8px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Qty</th>
                    <th style="text-align:right;padding:8px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Price</th>
                  </tr>
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="padding:16px 0 4px;font-size:14px;font-weight:600;color:#1a1a1a;">Total</td>
                    <td style="padding:16px 0 4px;font-size:16px;font-weight:700;color:#1a1a1a;text-align:right;">₹${data.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </table>

                <!-- Payment -->
                <div style="background:#f9f9f9;border:1px solid #ebebeb;padding:16px 20px;margin-bottom:24px;border-radius:4px;">
                  <p style="margin:0;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Payment</p>
                  <p style="margin:4px 0 0;font-size:14px;color:#1a1a1a;text-transform:capitalize;">${data.paymentMethod === 'online' ? '✅ Paid Online' : '💵 Cash on Delivery'}</p>
                </div>

                <!-- Delivery Address -->
                <h3 style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#1a1a1a;margin:0 0 12px;font-weight:600;">Delivery Address</h3>
                <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 32px;">
                  ${data.address}<br>${data.city}, ${data.state} – ${data.pincode}
                </p>

                <p style="font-size:13px;color:#888;margin:0;">Questions? Reply to this email or contact us at <a href="mailto:hello@classie.co.in" style="color:#1a1a1a;">hello@classie.co.in</a></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f5f5f5;padding:24px 40px;text-align:center;border-top:1px solid #ebebeb;">
                <p style="font-size:11px;color:#aaa;margin:0;letter-spacing:1px;">© CLASSIE™ · classie.co.in</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

// ── Admin notification email ──────────────────────────────────────────────────
function adminEmailHtml(data: OrderEmailData): string {
  const itemsText = data.items.map(i => `${i.quantity}× ${i.title}${i.variant ? ` (${i.variant})` : ''} — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('<br>')

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;padding:32px;background:#f9f9f9;">
      <div style="background:white;max-width:560px;margin:0 auto;padding:32px;border:1px solid #eee;border-radius:8px;">
        <h2 style="color:#1a1a1a;margin:0 0 4px;">🛍️ New Order Received!</h2>
        <p style="color:#888;font-size:13px;margin:0 0 24px;">classie-eta.vercel.app</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Order ID</span>
            <strong style="font-family:monospace;">${data.orderId}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Customer</span>
            <strong>${data.customerName}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Phone</span>
            <strong>${data.customerPhone}</strong>
          </td></tr>
          ${data.customerEmail ? `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Email</span>
            <strong>${data.customerEmail}</strong>
          </td></tr>` : ''}
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Address</span>
            <strong>${data.address}, ${data.city}, ${data.state} – ${data.pincode}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Items</span>
            <span style="font-size:14px;">${itemsText}</span>
          </td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:12px;color:#888;display:block;">Total</span>
            <strong style="font-size:18px;">₹${data.totalAmount.toLocaleString('en-IN')}</strong>
          </td></tr>
          <tr><td style="padding:8px 0;">
            <span style="font-size:12px;color:#888;display:block;">Payment</span>
            <strong>${data.paymentMethod === 'online' ? `✅ Paid Online — ${data.paymentId || ''}` : '💵 COD'}</strong>
          </td></tr>
        </table>
      </div>
    </body>
    </html>
  `
}

// ── Send both emails ──────────────────────────────────────────────────────────
export async function sendOrderEmails(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@classie.co.in'
  const fromEmail = process.env.FROM_EMAIL || 'orders@classie.co.in'

  const promises = []

  // Admin notification — always send
  promises.push(
    resend.emails.send({
      from: `CLASSIE Orders <${fromEmail}>`,
      to: [adminEmail],
      subject: `🛍️ New Order — ${data.customerName} — ₹${data.totalAmount.toLocaleString('en-IN')}`,
      html: adminEmailHtml(data),
    })
  )

  // Customer confirmation — only if email provided
  if (data.customerEmail) {
    promises.push(
      resend.emails.send({
        from: `CLASSIE™ <${fromEmail}>`,
        to: [data.customerEmail],
        subject: `Your CLASSIE™ order is confirmed! #${data.orderId.slice(0, 8).toUpperCase()}`,
        html: customerEmailHtml(data),
      })
    )
  }

  try {
    await Promise.all(promises)
  } catch (err) {
    console.error('Email send error:', err)
    // Non-fatal — order already placed
  }
}
