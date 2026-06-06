import { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <h1 className="font-serif text-5xl text-classie-black">Terms of Service</h1>
        <p className="text-classie-gray text-sm mt-3">Last updated: June 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-sm text-classie-gray leading-relaxed space-y-8">
        {[
          ["Acceptance of Terms", "By accessing or purchasing from classie.co.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website."],
          ["Products & Pricing", "All prices are in Indian Rupees (₹) and inclusive of applicable taxes. We reserve the right to change prices without prior notice. Product images may vary slightly from actual products."],
          ["Orders & Payment", "Orders are confirmed only after successful placement. We currently offer Cash on Delivery (COD). Online payment options will be available in future."],
          ["Cancellations", "Orders may be cancelled before they are shipped. Once shipped, the order cannot be cancelled. Contact us immediately at hello@classie.co.in if you need to cancel."],
          ["Intellectual Property", "All content on this website — including logos, product images, text, and design — is the property of Classie and protected by copyright law. Unauthorized use is prohibited."],
          ["Limitation of Liability", "Classie is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website beyond the purchase price of the product in question."],
          ["Governing Law", "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra."],
          ["Contact", "Terms queries: hello@classie.co.in | WhatsApp: +91 99999 99999"],
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
