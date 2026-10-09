// Default text for the menu, FAQ and policy pages. Everything here can be
// changed in Admin → "Menu, FAQ & Legal"; the saved version replaces these.

export interface NavLink { label: string; href: string; wide?: boolean }
export interface NavLinks { left: NavLink[]; right: NavLink[] }
export const NAV_KEY = "nav_links_v1";
export const DEFAULT_NAV: NavLinks = {
  left: [{ label: "Gift Sets", href: "/gift-sets" }, { label: "Style Ideas", href: "/style-ideas", wide: true }],
  right: [{ label: "Custom Designs", href: "/custom-designs" }, { label: "Journal", href: "/blog" }, { label: "About Us", href: "/about", wide: true }],
};

export interface FaqItem { q: string; a: string }
export interface FaqSection { section: string; items: FaqItem[] }
export const FAQ_KEY = "faq_page_v1";
// {free} / {fee} are filled in from Admin → Shipping Rates.
export const DEFAULT_FAQ: FaqSection[] = [
  {
    section: "Shoe Clips & Charms",
    items: [
      { q: "How do I attach the shoe clips?", a: "Open the clip, slide it onto the edge or strap of your shoe and press it shut. It takes a few seconds — no glue, no tools." },
      { q: "Will the clips damage my shoes?", a: "No. The clip holds by gentle pressure, with no glue, pins or holes. On very soft or delicate fabric, clip onto the edge and remove it gently." },
      { q: "Which shoes do they work on?", a: "Most shoes with an edge or strap to clip onto — heels, flats, ballerinas and sandals. They also work on bags, hair, dupattas and belts." },
      { q: "What does 'Sold as a pair' mean?", a: "Shoe clips come as a set of two — one for each shoe. The price shown is for the full pair." },
      { q: "Can you make a clip in my own design?", a: "Yes. Send us a sketch, photo or Pinterest pin on the Custom Designs page and we'll share a preview and price on WhatsApp." },
    ],
  },
  {
    section: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Orders are packed in 1–2 business days. Delivery then takes 3–5 business days to metro cities, 5–7 to other cities and 7–10 to remote areas." },
      { q: "Do you offer free shipping?", a: "Yes! Orders of ₹{free} or more ship free. Below ₹{free}, a flat delivery fee of ₹{fee} applies." },
      { q: "Do you ship across India?", a: "Yes, we ship to all serviceable pincodes across India via reputed courier partners." },
      { q: "Can I track my order?", a: "Yes. Visit our Track Order page with your Order ID to see its status, or message us on WhatsApp." },
    ],
  },
  {
    section: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "Heels can be returned within 7 days of delivery if they are unused, unworn and in original packaging. Shoe charms and accessories are not returnable — if a pair arrives damaged, WhatsApp us within 48 hours of delivery." },
      { q: "How do I initiate a return?", a: "WhatsApp us at +91 94681 47781 or email contact.classie@gmail.com with your order ID and reason. We'll arrange a pickup." },
      { q: "When will I get my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned product." },
      { q: "Can I exchange heels for a different size?", a: "Yes! Heel size exchanges are free within 7 days of delivery, subject to availability. Shoe clips are one size, so there is nothing to exchange." },
    ],
  },
  {
    section: "Heels",
    items: [
      { q: "What sizes do you offer?", a: "Our heels are available in EU sizes 35–39. Use the size guide below to find your fit." },
      { q: "Are your materials vegan?", a: "Yes! All Classie products use premium vegan materials — no animal leather, ever." },
      { q: "How do I care for my heels?", a: "Wipe with a soft, dry cloth. Avoid water and direct sunlight. Store in the dust bag provided." },
    ],
  },
  {
    section: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "UPI, debit and credit cards, net banking and wallets (secure online payment by Razorpay), and Cash on Delivery." },
      { q: "Do you offer Cash on Delivery?", a: "Yes! COD is available across India. Please keep the exact amount ready at delivery." },
      { q: "Is COD available everywhere?", a: "COD is available on most pincodes. If COD isn't available for your area, we'll let you know." },
    ],
  },
];

export interface PolicyPage { title: string; updated: string; sections: { title: string; body: string }[] }
export const POLICY_KEYS = { privacy: "policy_privacy_v1", terms: "policy_terms_v1", refund: "policy_refund_v1" } as const;
export type PolicyId = keyof typeof POLICY_KEYS;
export const DEFAULT_POLICIES: Record<PolicyId, PolicyPage> = {
  privacy: {
    title: "Privacy Policy",
    updated: "June 2025",
    sections: [
      { title: "Information We Collect", body: "We collect information you provide directly — such as your name, phone number, email address, and delivery address when you place an order. We also collect browsing data (pages visited, device type) to improve your experience." },
      { title: "How We Use Your Information", body: "Your information is used to process orders, arrange delivery, send order updates, and (with your consent) share news about new arrivals and offers. We never sell your data to third parties." },
      { title: "Data Storage", body: "Your order data is stored securely in Supabase (a GDPR-compliant database platform). We implement industry-standard security measures to protect your information." },
      { title: "Cookies", body: "We use cookies to remember your cart and preferences. You can disable cookies in your browser settings, though this may affect site functionality." },
      { title: "Third-Party Services", body: "We use trusted third-party services for delivery logistics and analytics. These partners have their own privacy policies and are bound by data processing agreements." },
      { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data. To exercise these rights, email us at contact.classie@gmail.com." },
      { title: "Contact", body: "Privacy-related queries: contact.classie@gmail.com | WhatsApp: +91 9468147781" },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "June 2025",
    sections: [
      { title: "Acceptance of Terms", body: "By accessing or purchasing from classie.co.in, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website." },
      { title: "Products & Pricing", body: "All prices are in Indian Rupees (₹) and inclusive of applicable taxes. We reserve the right to change prices without prior notice. Product images may vary slightly from actual products." },
      { title: "Orders & Payment", body: "Orders are confirmed only after successful placement. You can pay online (UPI, cards, net banking and wallets, processed securely by Razorpay) or choose Cash on Delivery (COD). Prices are charged as shown at checkout." },
      { title: "Cancellations", body: "Orders may be cancelled before they are shipped. Once shipped, the order cannot be cancelled. Contact us immediately at contact.classie@gmail.com if you need to cancel." },
      { title: "Intellectual Property", body: "All content on this website — including logos, product images, text, and design — is the property of Classie and protected by copyright law. Unauthorized use is prohibited." },
      { title: "Limitation of Liability", body: "Classie is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website beyond the purchase price of the product in question." },
      { title: "Governing Law", body: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra." },
      { title: "Contact", body: "Terms queries: contact.classie@gmail.com | WhatsApp: +91 9468147781" },
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "June 2025",
    sections: [
      { title: "Eligibility", body: "Refunds are issued for returned products that are unused, in original packaging, and returned within 7 days of delivery. Products that have been worn, damaged, or returned without original packaging are not eligible for a refund." },
      { title: "Refund Timelines", body: "Once we receive and inspect the return (2–3 business days after pickup), refunds are processed within 5–7 business days. You'll be notified by email/SMS once the refund is initiated." },
      { title: "Refund Method", body: "For Cash on Delivery orders, refunds are issued to a bank account provided by you. For prepaid orders (when applicable), refunds are returned to the original payment source." },
      { title: "Partial Refunds", body: "In some cases, only partial refunds may be granted — for example, if the item shows signs of use or is missing original tags/packaging." },
      { title: "Non-Refundable Situations", body: "Shipping charges are non-refundable. Items purchased during final sale events, and shoe charms and accessories (unless they arrive damaged), are not eligible for refunds." },
      { title: "Damaged or Wrong Items", body: "If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We'll replace or refund at no extra cost." },
      { title: "Contact", body: "Email: contact.classie@gmail.com | WhatsApp: +91 94681 47781" },
    ],
  },
};
