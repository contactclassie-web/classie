// Heels, Shoe Charms and Collections pages (new layouts). Every text and photo
// is editable in Admin → (Heels / Shoe Charms / Collections) → New Page.
// Values live in site_settings under the keys below; an empty value falls back
// to the default here. Photos left empty use the photo named in the hint.

export type PageFieldType = "text" | "textarea" | "image" | "select";

export interface PageField {
  key: string;
  label: string;
  type: PageFieldType;
  def: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export interface PageGroup {
  id: string;
  label: string;
  note: string;
  fields: PageField[];
}

const t = (key: string, label: string, def: string, hint?: string): PageField => ({ key, label, type: "text", def, hint });
const ta = (key: string, label: string, def: string, hint?: string): PageField => ({ key, label, type: "textarea", def, hint });
const img = (key: string, label: string, hint?: string, def = ""): PageField => ({ key, label, type: "image", def, hint });
const onOff = (key: string, label: string, def = "on"): PageField => ({
  key, label, type: "select", def,
  options: [{ value: "on", label: "Show" }, { value: "off", label: "Hide" }],
});

const C = "https://res.cloudinary.com/dbzt3soyi/image/upload/";

// ── Heels page ──────────────────────────────────────────────────────────
export const HEELS_GROUPS: PageGroup[] = [
  {
    id: "hero", label: "1 · Top banner",
    note: "Short banner: text on the left, photo on the right (photo on top on phones).",
    fields: [
      t("hp2_eyebrow", "Small text above title", "The CLASSIE Heel"),
      t("hp2_title", "Title", "Heels"),
      t("hp2_sub", "Line under title", "Comfortable heels, made to wear clips."),
      t("hp2_facts", "Facts line", "", "Separate with · — empty = automatic: sizes, lowest price, size exchange."),
      img("hp2_hero_img", "Photo", "Empty = the photo from Heels Page → banner."),
    ],
  },
  {
    id: "band", label: "2 · Shoe charms band",
    note: "Navy band shown after the first row of heels. Photos empty = the 'on a heel' photo of three shoe charms.",
    fields: [
      onOff("hp2_cs_show", "Show this band"),
      t("hp2_cs_eyebrow", "Small text", "One heel, many looks"),
      t("hp2_cs_title", "Heading", "Every heel here is made to"),
      t("hp2_cs_title_em", "Heading (italic part)", "wear a clip."),
      ta("hp2_cs_text", "Text", "Add a pair of shoe charms and wear the same heel to the office and to a wedding."),
      t("hp2_cs_button", "Button", "Shop shoe charms", "The lowest charm price is added automatically."),
      img("hp2_cs_img1", "Photo 1"), img("hp2_cs_img2", "Photo 2"), img("hp2_cs_img3", "Photo 3"),
    ],
  },
  {
    id: "occ", label: "3 · Shop by occasion",
    note: "Tiles come from Catalog → Collections (title, photo). Here you only change the heading.",
    fields: [
      onOff("hp2_occ_show", "Show this section"),
      t("hp2_occ_title", "Heading", "Shop by"),
      t("hp2_occ_title_em", "Heading (italic part)", "occasion"),
    ],
  },
  {
    id: "promises", label: "4 · Promises row",
    note: "Four short promises with line icons. Promise 1 gets a link to the size guide.",
    fields: [
      t("hp2_p1_title", "Promise 1", "", "Empty = 'Sizes 35 to 39' from your products."),
      t("hp2_p1_sub", "Promise 1 · small text", "See size guide"),
      t("hp2_p2_title", "Promise 2", "Size exchange"), t("hp2_p2_sub", "Promise 2 · small text", "within 7 days"),
      t("hp2_p3_title", "Promise 3", "Cash on delivery"), t("hp2_p3_sub", "Promise 3 · small text", "pay at your door"),
      t("hp2_p4_title", "Promise 4", "Free delivery"), t("hp2_p4_sub", "Promise 4 · small text", "", "Empty = 'on orders ₹999+' from your shipping rates."),
    ],
  },
  {
    id: "seo", label: "5 · Text for Google",
    note: "Short text at the bottom. The longer text stays inside 'Read more'.",
    fields: [
      t("hp2_seo_title", "Heading", "Buy women's heels online in India"),
      ta("hp2_seo_text", "Short text", "CLASSIE heels — block heels, slingbacks, sculpted heels and kitten heels — for weddings, office and everyday wear. Free delivery and COD across India."),
    ],
  },
];

// ── Shoe Charms page ────────────────────────────────────────────────────
export const CHARMS_GROUPS: PageGroup[] = [
  {
    id: "hero", label: "1 · Top banner",
    note: "Short banner: text on the left, photo on the right (photo on top on phones).",
    fields: [
      t("cp2_eyebrow", "Small text above title", "The CLASSIE clip-on"),
      t("cp2_title", "Title", "Shoe Charms"),
      t("cp2_sub", "Line under title", "Clip one onto any heel, flat or sandal. A new look in five seconds."),
      t("cp2_facts", "Facts line", "", "Separate with · — empty = 'Sold as a pair · From ₹(lowest) · No glue, no holes'."),
      img("cp2_hero_img", "Photo", "Empty = a crystal clip on a black heel.", C + "v1783885081/a4d19c1b-77e0-4de4-8b5b-aafcfbf12afd_p2uyto.png"),
    ],
  },
  {
    id: "types", label: "2 · Type buttons",
    note: "Buttons above the products. Which types exist comes from Shoe Charms Page → filter types; here you set the short names.",
    fields: [
      ta("cp2_type_names", "Short names", "Rhinestone Shoe Charms = Crystal\nFlower Shoe Charms = Flower & Jute\nBow Shoe Charms = Bow\nPearl Anklet = Anklet", "One per line: product tag = name on the button."),
    ],
  },
  {
    id: "how", label: "3 · How it works strip",
    note: "Thin strip above the products.",
    fields: [
      onOff("cp2_how_show", "Show this strip"),
      t("cp2_how_title", "Title", "How it works"),
      t("cp2_how_1", "Step 1", "Open the clip"),
      t("cp2_how_2", "Step 2", "Slide it onto the edge or strap"),
      t("cp2_how_3", "Step 3", "Press shut"),
      t("cp2_how_link", "Link text", "See it step by step", "Opens the 'How it works' part of the About page."),
    ],
  },
  {
    id: "cards", label: "4 · Product cards",
    note: "How each charm looks in the grid.",
    fields: [
      {
        key: "cp2_card_photo", label: "Main photo on each card", type: "select", def: "worn",
        options: [{ value: "worn", label: "Clip on a shoe (2nd photo), close-up on hover" }, { value: "main", label: "Main photo, 2nd photo on hover" }],
      },
      {
        key: "cp2_hide_pair", label: "'(Pair)' in names", type: "select", def: "hide",
        options: [{ value: "hide", label: "Hide on cards (the banner says 'Sold as a pair')" }, { value: "show", label: "Show" }],
      },
    ],
  },
  {
    id: "gift", label: "5 · Gift sets band",
    note: "Band shown after the first row of charms. Empty photo = the first gift set's photo.",
    fields: [
      onOff("cp2_gift_show", "Show this band"),
      t("cp2_gift_eyebrow", "Small text", "Buying for someone?"),
      t("cp2_gift_title", "Heading", "Gift sets — two or three pairs"),
      t("cp2_gift_title_em", "Heading (italic part)", "for less."),
      t("cp2_gift_text", "Text", "", "Empty = 'Bridal, festive and party sets from ₹(lowest set price).'"),
      t("cp2_gift_button", "Button", "Shop gift sets"),
      img("cp2_gift_img", "Photo"),
    ],
  },
  {
    id: "faq", label: "6 · Questions",
    note: "Three questions near the bottom, with a link to the FAQ page.",
    fields: [
      onOff("cp2_q_show", "Show this section"),
      t("cp2_q_title", "Heading", "New to shoe"),
      t("cp2_q_title_em", "Heading (italic part)", "charms?"),
      t("cp2_q1", "Question 1", "How do they attach?"),
      ta("cp2_a1", "Answer 1", "Open the clip, slide it onto the edge or strap of your shoe and press it shut. No glue, no tools."),
      t("cp2_q2", "Question 2", "Will they damage my shoes?"),
      ta("cp2_a2", "Answer 2", "No. The clip holds by gentle pressure — no glue, pins or holes."),
      t("cp2_q3", "Question 3", "Which shoes do they work on?"),
      ta("cp2_a3", "Answer 3", "Heels, flats, ballerinas and sandals with an edge or strap. They also work on bags, hair and dupattas."),
    ],
  },
  {
    id: "seo", label: "7 · Text for Google",
    note: "Short text at the bottom. The longer text stays inside 'Read more'.",
    fields: [
      t("cp2_seo_title", "Heading", "Buy shoe clips online in India"),
      ta("cp2_seo_text", "Short text", "Rhinestone, bow, pearl and jute shoe clips that change any heel, flat or sandal in seconds. Sold as a pair, with COD across India."),
    ],
  },
];

// ── Collections page ────────────────────────────────────────────────────
export const COLLECTIONS_GROUPS: PageGroup[] = [
  {
    id: "head", label: "1 · Heading",
    note: "Simple heading at the top of the page.",
    fields: [
      t("col2_eyebrow", "Small text", "Collections"),
      t("col2_title", "Title", "Shop by"),
      t("col2_title_em", "Title (italic part)", "collection"),
      ta("col2_text", "Text", "Edits for every plan on your calendar — and charms to change them again tomorrow."),
    ],
  },
  {
    id: "tiles", label: "2 · Small collection tiles",
    note: "The three big edit tiles come from Catalog → Collections. These are the three smaller tiles under them. Counts and prices are automatic.",
    fields: [
      t("col2_t1_name", "Tile 1 name (crystal charms)", "Crystal Charms"), img("col2_t1_img", "Tile 1 photo", "Empty = first crystal charm photo."),
      t("col2_t2_name", "Tile 2 name (flower charms)", "Flower & Jute"), img("col2_t2_img", "Tile 2 photo", "Empty = first flower charm photo."),
      t("col2_t3_name", "Tile 3 name (gift sets)", "Gift Sets"), img("col2_t3_img", "Tile 3 photo", "Empty = first gift set photo."),
    ],
  },
  {
    id: "looks", label: "3 · Shop the look",
    note: "Heel + charm pairs with an 'Add both' button. Use the product link names (the part after /products/ in the address). A look with a missing product is hidden.",
    fields: [
      onOff("col2_looks_show", "Show this section"),
      t("col2_looks_eyebrow", "Small text", "Shop the look"),
      t("col2_looks_title", "Heading", "One heel + one charm ="),
      t("col2_looks_title_em", "Heading (italic part)", "a whole new look."),
      t("col2_l1_name", "Look 1 name", "Wine + Gold Crown"), t("col2_l1_heel", "Look 1 heel", "modiva-bgn"), t("col2_l1_clip", "Look 1 charm", "radiance-crown-crystal-clip-pair"),
      t("col2_l2_name", "Look 2 name", "Blush + Pearl Bow"), t("col2_l2_heel", "Look 2 heel", "clessia"), t("col2_l2_clip", "Look 2 charm", "fauxbow-maroon"),
      t("col2_l3_name", "Look 3 name", "Black + Crystal Bloom"), t("col2_l3_heel", "Look 3 heel", "velora"), t("col2_l3_clip", "Look 3 charm", "marquise-bloom-crystal-clip-pair"),
    ],
  },
  {
    id: "all", label: "4 · All products",
    note: "Every product with Heels / Shoe Charms tabs.",
    fields: [
      t("col2_all_title", "Heading", "Everything"),
    ],
  },
];

export const SHOP_PAGE_DEFAULTS: Record<string, string> = Object.fromEntries(
  [...HEELS_GROUPS, ...CHARMS_GROUPS, ...COLLECTIONS_GROUPS].flatMap((g) => g.fields.map((f) => [f.key, f.def])),
);

/** Settings reader: empty / missing → default. */
export function contentReader(cfg: Record<string, string>) {
  return (key: string) => (cfg[key] !== undefined && String(cfg[key]).trim() !== "" ? cfg[key] : SHOP_PAGE_DEFAULTS[key] ?? "");
}

/** "Tag = Name" lines → map */
export function parseTypeNames(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  raw.split("\n").forEach((line) => {
    const i = line.indexOf("=");
    if (i > 0) out[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  });
  return out;
}
