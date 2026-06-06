import { Metadata } from "next";
export const metadata: Metadata = { title: "Returns & Exchanges" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-2xl text-classie-black mb-4">{title}</h2>
      <div className="text-classie-gray leading-relaxed space-y-3 text-sm">{children}</div>
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <h1 className="font-serif text-5xl text-classie-black">Returns & Exchanges</h1>
        <p className="text-classie-gray text-sm mt-3">Last updated: June 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 mb-10">
          <p className="font-semibold text-emerald-800 mb-1">✓ 7-Day Return Policy</p>
          <p className="text-sm text-emerald-700">We want you to love your Classie purchase. If you don't, we'll make it right within 7 days of delivery.</p>
        </div>
        <Section title="Eligible Returns">
          <p>Products are eligible for return if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Returned within 7 days of delivery</li>
            <li>Unused, unworn, and in original condition</li>
            <li>In original packaging with all tags attached</li>
            <li>Accompanied by the original invoice</li>
          </ul>
        </Section>
        <Section title="Non-Returnable Items">
          <ul className="list-disc pl-5 space-y-1">
            <li>Items worn or used</li>
            <li>Items without original packaging</li>
            <li>Products purchased during clearance/final sale</li>
          </ul>
        </Section>
        <Section title="How to Initiate a Return">
          <ol className="list-decimal pl-5 space-y-2">
            <li>WhatsApp us at <a href="https://wa.me/919999999999" className="text-[#3B5373] underline">+91 99999 99999</a> with your Order ID and reason</li>
            <li>We'll confirm eligibility and schedule a free pickup</li>
            <li>Pack the product securely in original packaging</li>
            <li>Hand over to the courier when they arrive</li>
          </ol>
        </Section>
        <Section title="Exchanges">
          <p>Size exchanges are free within 7 days of delivery, subject to stock availability. Contact us to check availability before initiating.</p>
        </Section>
        <Section title="Refunds">
          <p>Once we receive and inspect the returned product (2–3 business days), refunds are processed within 5–7 business days. For COD orders, refunds are issued via bank transfer.</p>
        </Section>
        <Section title="Contact Us">
          <p>
            Email: <a href="mailto:hello@classie.co.in" className="text-[#3B5373] underline">hello@classie.co.in</a><br />
            WhatsApp: <a href="https://wa.me/919999999999" className="text-[#3B5373] underline">+91 99999 99999</a>
          </p>
        </Section>
      </div>
    </>
  );
}
