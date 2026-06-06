import { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <h1 className="font-serif text-5xl text-classie-black">Privacy Policy</h1>
        <p className="text-classie-gray text-sm mt-3">Last updated: June 2025</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-sm text-classie-gray leading-relaxed space-y-8">
        {[
          ["Information We Collect", "We collect information you provide directly — such as your name, phone number, email address, and delivery address when you place an order. We also collect browsing data (pages visited, device type) to improve your experience."],
          ["How We Use Your Information", "Your information is used to process orders, arrange delivery, send order updates, and (with your consent) share news about new arrivals and offers. We never sell your data to third parties."],
          ["Data Storage", "Your order data is stored securely in Supabase (a GDPR-compliant database platform). We implement industry-standard security measures to protect your information."],
          ["Cookies", "We use cookies to remember your cart and preferences. You can disable cookies in your browser settings, though this may affect site functionality."],
          ["Third-Party Services", "We use trusted third-party services for delivery logistics and analytics. These partners have their own privacy policies and are bound by data processing agreements."],
          ["Your Rights", "You have the right to access, correct, or delete your personal data. To exercise these rights, email us at hello@classie.co.in."],
          ["Contact", "Privacy-related queries: hello@classie.co.in | WhatsApp: +91 99999 99999"],
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
