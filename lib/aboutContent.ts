// About Us page (new layout) — every text and photo is editable in
// Admin → About Us → New Page. Values live in site_settings under the keys
// below; an empty value falls back to the default here.

const C = "https://res.cloudinary.com/dbzt3soyi/image/upload/";

export type AboutFieldType = "text" | "textarea" | "image";

export interface AboutField {
  key: string;
  label: string;
  type: AboutFieldType;
  def: string;
  hint?: string;
}

export interface AboutGroup {
  id: string;
  label: string;
  note: string;
  fields: AboutField[];
}

const t = (key: string, label: string, def: string, hint?: string): AboutField => ({ key, label, type: "text", def, hint });
const ta = (key: string, label: string, def: string, hint?: string): AboutField => ({ key, label, type: "textarea", def, hint });
const img = (key: string, label: string, def: string, hint?: string): AboutField => ({ key, label, type: "image", def, hint });

export const ABOUT_GROUPS: AboutGroup[] = [
  {
    id: "hero",
    label: "1 · Hero",
    note: "Top of the page: heading, short intro, two shop buttons and a photo (photo comes first on phones).",
    fields: [
      t("au2_hero_eyebrow", "Small text above heading", "About CLASSIE"),
      t("au2_hero_title", "Heading (line 1)", "One heel."),
      t("au2_hero_title_em", "Heading (line 2, blue italic)", "Endless looks."),
      ta("au2_hero_text", "Intro text", "CLASSIE makes clip-on shoe charms and easy heels for Indian women. Clip a charm onto the shoes you already own and get a new look in seconds — for office, weddings, festivals and nights out."),
      img("au2_hero_img", "Photo", "", "Empty = the black heels photo from the old page."),
    ],
  },
  {
    id: "story",
    label: "2 · Our Story",
    note: "Photo on the left, short story on the right, then the founder's short quote. Founder name, role and photo are in the Founder tab.",
    fields: [
      t("au2_story_eyebrow", "Small text above heading", "Our Story"),
      t("au2_story_title", "Heading", "It started with a wardrobe full of clothes —"),
      t("au2_story_title_em", "Heading (blue italic part)", "and nothing to wear on our feet."),
      ta("au2_story_text", "Story text", "Heels were either beautiful and painful, or comfortable and plain. And buying a new pair for every outfit made no sense.\n\nSo we asked a simple question: what if one good heel could change its look with a small clip? That idea became CLASSIE.", "Leave an empty line between paragraphs."),
      img("au2_story_img", "Photo", "", "Empty = the white dress + flowers photo from the old page."),
      t("au2_founder_quote", "Founder's short quote", "Fashion shouldn't limit you. It should move with you."),
    ],
  },
  {
    id: "clip",
    label: "3 · Meet the Shoe Clip",
    note: "Navy band that explains what a shoe clip is, with four quick facts.",
    fields: [
      t("au2_clip_eyebrow", "Small text above heading", "Meet the shoe clip"),
      t("au2_clip_title", "Heading", "A small charm that"),
      t("au2_clip_title_em", "Heading (italic part)", "changes the whole shoe."),
      ta("au2_clip_text", "Text", "A CLASSIE shoe clip is a crystal, bow, pearl or jute charm with a gentle clip at the back. It holds onto the edge or strap of your shoe — no glue, no tools, no holes."),
      img("au2_clip_img", "Photo", C + "v1783885020/65bf792a-f6ad-489d-a704-ef339feab858_pplslm.png"),
      t("au2_clip_f1_title", "Fact 1", "Sold as a pair"),
      t("au2_clip_f1_sub", "Fact 1 · small text", "One for each shoe"),
      t("au2_clip_f2_title", "Fact 2", "Safe for your shoes"),
      t("au2_clip_f2_sub", "Fact 2 · small text", "Gentle grip, no damage"),
      t("au2_clip_f3_title", "Fact 3", "Works on most shoes"),
      t("au2_clip_f3_sub", "Fact 3 · small text", "Heels, flats, ballerinas, sandals"),
      t("au2_clip_f4_title", "Fact 4", "Not just for shoes"),
      t("au2_clip_f4_sub", "Fact 4 · small text", "Bags, hair, dupattas, belts"),
    ],
  },
  {
    id: "steps",
    label: "4 · How It Works",
    note: "Three steps. Add a photo or GIF for each step when you have them — until then the steps show as simple numbered cards.",
    fields: [
      t("au2_steps_eyebrow", "Small text above heading", "How it works"),
      t("au2_steps_title", "Heading", "On in"),
      t("au2_steps_title_em", "Heading (blue italic part)", "five seconds."),
      t("au2_steps_sub", "Line under heading", "And off just as fast — change your look every day."),
      t("au2_step1_title", "Step 1", "Open the clip"),
      t("au2_step1_text", "Step 1 · text", "Gently press the back to open it."),
      img("au2_step1_img", "Step 1 · photo or GIF", ""),
      t("au2_step2_title", "Step 2", "Slide it on"),
      t("au2_step2_text", "Step 2 · text", "Place it on the edge of the toe or on a strap."),
      img("au2_step2_img", "Step 2 · photo or GIF", ""),
      t("au2_step3_title", "Step 3", "Press shut — done"),
      t("au2_step3_text", "Step 3 · text", "Change it again tomorrow for a new look."),
      img("au2_step3_img", "Step 3 · photo or GIF", ""),
      t("au2_video_url", "Video link (optional)", "", "A YouTube or Instagram reel link. Empty = no video button."),
    ],
  },
  {
    id: "styles",
    label: "5 · Styles",
    note: "Four cards. Prices (\"From ₹…\") update automatically from your products. Empty photo = the first product photo of that type.",
    fields: [
      t("au2_styles_eyebrow", "Small text above heading", "Four styles, many moods"),
      t("au2_styles_title", "Heading", "Find the charm that fits"),
      t("au2_styles_title_em", "Heading (blue italic part)", "your day."),
      t("au2_style1_name", "Card 1 name (Rhinestone charms)", "Crystal"),
      t("au2_style1_text", "Card 1 text", "Sparkle for weddings, sangeet and parties."),
      img("au2_style1_img", "Card 1 photo", ""),
      t("au2_style2_name", "Card 2 name (Bow charms)", "Bow"),
      t("au2_style2_text", "Card 2 text", "Soft and sweet for brunch and dates."),
      img("au2_style2_img", "Card 2 photo", ""),
      t("au2_style3_name", "Card 3 name (Flower charms)", "Flower & Jute"),
      t("au2_style3_text", "Card 3 text", "Handmade flowers and pearls for festive and everyday."),
      img("au2_style3_img", "Card 3 photo", ""),
      t("au2_style4_name", "Card 4 name (Gift sets)", "Gift Sets"),
      t("au2_style4_text", "Card 4 text", "Duos and trios that cost less than buying each pair."),
      img("au2_style4_img", "Card 4 photo", ""),
    ],
  },
  {
    id: "heels",
    label: "6 · Our Heels",
    note: "Text on the left, photo on the right. Sizes and \"From ₹\" price come from your heel products automatically.",
    fields: [
      t("au2_heels_eyebrow", "Small text above heading", "Our Heels"),
      t("au2_heels_title", "Heading", "A comfortable heel,"),
      t("au2_heels_title_em", "Heading (blue italic part)", "made to wear clips."),
      ta("au2_heels_text", "Text", "Our heels are the simple, comfortable base — soft cushioning, a steady heel and a clean pointed toe. Wear them plain to work, then clip on crystals for the evening."),
      t("au2_heels_point", "Extra point", "Size exchange within 7 days"),
      img("au2_heels_img", "Photo", "", "Empty = the blush pink bridal heels photo from the old page."),
    ],
  },
  {
    id: "promises",
    label: "7 · Promises",
    note: "Four short promises in a row.",
    fields: [
      t("au2_p1_title", "Promise 1", "Premium look, fair price"),
      t("au2_p1_sub", "Promise 1 · small text", "Luxury-style finish without the luxury price."),
      t("au2_p2_title", "Promise 2", "Cash on delivery"),
      t("au2_p2_sub", "Promise 2 · small text", "Pay when it reaches your door."),
      t("au2_p3_title", "Promise 3", "7-day easy returns"),
      t("au2_p3_sub", "Promise 3 · small text", "Not right? Send it back or exchange it."),
      t("au2_p4_title", "Promise 4", "Real help on WhatsApp"),
      t("au2_p4_sub", "Promise 4 · small text", "Send a photo, we'll suggest a clip."),
    ],
  },
  {
    id: "end",
    label: "8 · Care & Last Button",
    note: "Care tips on the left, final shop buttons on the right.",
    fields: [
      t("au2_care_title", "Care heading", "Caring for your clips"),
      ta("au2_care_text", "Care tips", "Store them in a soft pouch or box so the stones don't scratch.\nWipe with a soft, dry cloth after wearing.\nKeep away from water and perfume.", "One tip per line. Leave empty to hide care tips."),
      t("au2_cta_title", "Last heading", "Ready for"),
      t("au2_cta_title_em", "Last heading (blue italic part)", "your first pair?"),
      t("au2_cta_text", "Last text", "Start with a pair of clips, or pick a gift set for someone you love."),
    ],
  },
];

export const ABOUT_DEFAULTS: Record<string, string> = Object.fromEntries(
  ABOUT_GROUPS.flatMap((g) => g.fields.map((f) => [f.key, f.def])),
);
