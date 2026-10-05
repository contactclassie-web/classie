// Custom Designs page — edited from Admin → Custom Designs → Page, stored as
// JSON in site_settings under CUSTOM_PAGE_KEY. Requests from the form are saved
// in contact_submissions with REQUEST_TAG at the start of the message.

export const CUSTOM_PAGE_KEY = "custom_page_v1";
export const REQUEST_TAG = "[Custom design request]";

export interface CustomPageConfig {
  hero: {
    eyebrow: string; heading: string; headingItalic: string; text: string;
    sketchImage: string; productImage: string; buttonText: string; whatsappText: string;
  };
  make: { heading: string; headingItalic: string; items: { image: string; title: string; sub: string }[] };
  steps: { heading: string; headingItalic: string; items: { title: string; text: string }[] };
  perk: { on: boolean; eyebrow: string; heading: string; headingItalic: string; text: string; small: string };
  form: {
    heading: string; headingItalic: string; intro: string;
    makeOptions: string; metalOptions: string;
    consentText: string; buttonText: string; successText: string; replyNote: string;
  };
  faq: { heading: string; items: { q: string; a: string }[] };
  whatsappUrl: string;
  seoTitle: string;
  seoDescription: string;
}

const C = "https://res.cloudinary.com/dbzt3soyi/image/upload/";

export const DEFAULT_CUSTOM_PAGE: CustomPageConfig = {
  hero: {
    eyebrow: "Classie Custom · Rhinestone studio",
    heading: "Your design.",
    headingItalic: "Our rhinestones.",
    text: "We make rhinestone accessories in our own studio. Send us your idea: a sketch, a photo or a Pinterest pin. We'll show you a preview, then make it for you.",
    sketchImage: "",
    productImage: C + "v1784204557/c02279d6-b56e-436e-9599-795387501f3f_yrwurd.png",
    buttonText: "Share your design",
    whatsappText: "WhatsApp us",
  },
  make: {
    heading: "What we can",
    headingItalic: "make",
    items: [
      { image: C + "v1783885591/687541b9-dd0d-4372-be07-ddc8258ee2be_nmuthw.png", title: "Shoe clips", sub: "One pair or many" },
      { image: C + "v1786389887/2_kn9ywo.png", title: "Hair & bag clips", sub: "Same design, more uses" },
      { image: C + "v1784293137/4aa57f8c-8b90-4e21-a08e-85bc4f5694b6_hgbcxu.png", title: "Bridal & bridesmaid sets", sub: "Matching pairs for the group" },
      { image: "", title: "Your own idea", sub: "Tell us, we'll try" },
    ],
  },
  steps: {
    heading: "How it",
    headingItalic: "works",
    items: [
      { title: "Send your design", text: "Sketch, photo or link. Add colours and where you'll wear it." },
      { title: "Get a preview & price", text: "We send you a design preview and the price on WhatsApp before we start." },
      { title: "We make it", text: "Hand-set in our rhinestone studio." },
      { title: "At your door", text: "Delivered like any Classie order. COD available." },
    ],
  },
  perk: {
    on: true,
    eyebrow: "Designed by you",
    heading: "Your design could join",
    headingItalic: "our collection",
    text: "If the Classie team adds your design to the collection, your pair is free.",
    small: "Selected designs only · the Classie team decides · we ask your permission before we sell it",
  },
  form: {
    heading: "Share your",
    headingItalic: "design",
    intro: "Tell us what you have in mind. We'll reply on WhatsApp with a preview and the price.",
    makeOptions: "Shoe clips, Hair / bag clips, Bridal / bridesmaid set, Something else",
    metalOptions: "Silver tone, clear stones; Gold tone, clear stones; With coloured stones; Not sure yet",
    consentText: "Classie can consider my design for its collection. If it's selected, my pair is free.",
    buttonText: "Send my design",
    successText: "Thank you! We've got your design request and will reply on WhatsApp.",
    replyNote: "After sending, share your sketch or photo with us on WhatsApp.",
  },
  faq: {
    heading: "Questions",
    items: [
      { q: "How much does a custom pair cost?", a: "It depends on the design and the stones. We share the exact price with your preview, before we make anything." },
      { q: "How long does it take?", a: "We share the timeline with your preview, so you know before you say yes." },
      { q: "Will I see it before you make it?", a: "Yes. We send a design preview on WhatsApp first and start only after you approve it." },
      { q: "Is there a minimum order?", a: "No. One pair is fine. For bridesmaid sets, tell us the number of pairs." },
      { q: "What happens if my design is selected?", a: "Your pair is free and the design joins the Classie collection. We ask your permission first." },
    ],
  },
  whatsappUrl: "",
  seoTitle: "Custom Rhinestone Shoe Clips & Accessories",
  seoDescription: "Get custom rhinestone shoe clips, hair clips and bridal sets made by Classie's own studio. Send your sketch, get a preview and price on WhatsApp.",
};

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

// Saved values win where their type matches the default; missing keys keep defaults.
function merge<T>(def: T, saved: unknown): T {
  if (Array.isArray(def)) {
    if (!Array.isArray(saved)) return def;
    const tmpl = def[0];
    return saved.filter(isObj).map((x) => (tmpl !== undefined ? merge(tmpl, x) : x)) as T;
  }
  if (isObj(def)) {
    if (!isObj(saved)) return def;
    const out: Record<string, unknown> = {};
    for (const [k, dv] of Object.entries(def)) out[k] = merge(dv, saved[k]);
    return out as T;
  }
  return (typeof saved === typeof def ? saved : def) as T;
}

export function mergeCustomPage(saved: unknown): CustomPageConfig {
  return merge(DEFAULT_CUSTOM_PAGE, saved);
}

export const splitList = (s: string, sep: RegExp = /[,;]\s*/) => s.split(sep).map((x) => x.trim()).filter(Boolean);
