import { Metadata } from "next";
import { Truck, Clock, MapPin, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <h1 className="font-serif text-5xl text-classie-black">Shipping Policy</h1>
        <p className="text-classie-gray text-sm mt-3">Last updated: June 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 prose prose-sm max-w-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 not-prose">
          {[
            { icon: Truck,        title: "Free Shipping",  body: "On all orders above ₹999" },
            { icon: Clock,        title: "Delivery Time",  body: "5–7 business days standard" },
            { icon: MapPin,       title: "Pan-India",      body: "All serviceable pincodes" },
            { icon: AlertCircle,  title: "Processing",     body: "1–2 business days before dispatch" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 bg-[#faf8f6] rounded-2xl p-5 border border-classie-border">
              <Icon className="w-5 h-5 text-[#3D4F5F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-classie-black text-sm">{title}</p>
                <p className="text-xs text-classie-gray mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <PolicySection title="Shipping Rates">
          <ul>
            <li><strong>Free shipping</strong> on all orders above ₹999</li>
            <li><strong>₹99 flat fee</strong> on orders below ₹999</li>
            <li>Cash on Delivery (COD) is available across India</li>
          </ul>
        </PolicySection>
        <PolicySection title="Delivery Timelines">
          <ul>
            <li><strong>Metro cities:</strong> 3–5 business days</li>
            <li><strong>Tier 2 cities:</strong> 5–7 business days</li>
            <li><strong>Remote areas:</strong> 7–10 business days</li>
          </ul>
          <p>Orders placed before 12 PM IST are processed the same day. Weekend orders are processed on Monday.</p>
        </PolicySection>
        <PolicySection title="Order Tracking">
          <p>Once dispatched, you'll receive tracking details via SMS/WhatsApp. Use our <a href="/track-order" className="text-[#3D4F5F] underline">Track Order</a> page for real-time updates.</p>
        </PolicySection>
        <PolicySection title="Incorrect Address">
          <p>Please ensure your delivery address and phone number are correct at checkout. Classie is not responsible for failed deliveries due to incorrect address details.</p>
        </PolicySection>
        <PolicySection title="Lost or Damaged Packages">
          <p>If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at <a href="mailto:hello@classie.co.in" className="text-[#3D4F5F] underline">hello@classie.co.in</a> or WhatsApp us.</p>
        </PolicySection>
      </div>
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-2xl text-classie-black mb-4">{title}</h2>
      <div className="text-classie-gray leading-relaxed space-y-3 text-sm">{children}</div>
    </div>
  );
}
