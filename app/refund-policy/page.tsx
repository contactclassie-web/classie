import { Metadata } from "next";
export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <h1 className="font-serif text-5xl text-classie-black">Refund Policy</h1>
        <p className="text-classie-gray text-sm mt-3">Last updated: June 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-sm text-classie-gray leading-relaxed space-y-8">
        {[
          ["Eligibility", "Refunds are issued for returned products that are unused, in original packaging, and returned within 7 days of delivery. Products that have been worn, damaged, or returned without original packaging are not eligible for a refund."],
          ["Refund Timelines", "Once we receive and inspect the return (2–3 business days after pickup), refunds are processed within 5–7 business days. You'll be notified by email/SMS once the refund is initiated."],
          ["Refund Method", "For Cash on Delivery orders, refunds are issued to a bank account provided by you. For prepaid orders (when applicable), refunds are returned to the original payment source."],
          ["Partial Refunds", "In some cases, only partial refunds may be granted — for example, if the item shows signs of use or is missing original tags/packaging."],
          ["Non-Refundable Situations", "Shipping charges are non-refundable. Items purchased during final sale events are not eligible for refunds."],
          ["Damaged or Wrong Items", "If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We'll replace or refund at no extra cost."],
          ["Contact", "Email: hello@classie.co.in | WhatsApp: +91 99999 99999"],
        ].map(([title, body]) => (
          <div key={title as string}>
            <h2 className="font-serif text-2xl text-classie-black mb-3">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
