# Prompt for Claude — 2 HTML Design Variations for Heels Collection Page

---

Create **2 complete standalone HTML files** for a heels collection page for **Classie** — a premium Indian women's heels & accessories brand.

Each file should be fully self-contained (HTML + CSS + dummy JS in one file). Use placeholder product images from `https://placehold.co/400x530/f5f0eb/3B5373?text=Heels` (adjust colors as needed).

---

## Brand Identity

- **Primary color:** `#3B5373` (deep navy blue)
- **Gold accent:** `#c9a96e`
- **Background:** `#ffffff`
- **Light bg:** `#f7f5f2` (warm off-white)
- **Text:** `#1a1a1a`
- **Font (heading):** Google Font — `Cormorant Garamond` (serif, elegant)
- **Font (body):** Google Font — `Inter` or `DM Sans` (clean sans-serif)
- Brand tagline: *"One Heel. Endless Looks."*

---

## Page Structure (same for both designs)

Both designs MUST include these sections in order:

1. **Announcement bar** — dark navy bg, white text, rotating messages
2. **Navbar** — logo "✦ CLASSIE", nav links (Heels, Clip-ons, Style Ideas, Hot Deals), cart + search icons
3. **Collection Hero** — full-width, heels-related visual
4. **Shop by Occasion strip** — 5 circles (Date Edit, Everyday Edit, Festive Edit, Party Edit, Work Edit)
5. **Filter sidebar + Product grid** — 4 columns, 8 dummy products
6. **Footer** — minimal, navy

---

## Dummy Products (use these for both designs)

```
1. Clessia Wine          ₹1,699  (was ₹1,899)  — SALE
2. Velora Ivory          ₹1,799  (was ₹1,999)  — SALE
3. Modiva Rose Gold      ₹1,599  (was ₹1,799)  — SALE
4. Tressa Teal           ₹1,499  (was ₹1,699)  — SALE
5. Gloss Belle Mocha     ₹1,799  (was ₹1,999)  — SALE
6. Crovia Chocolate      ₹1,699  (was ₹1,899)  — SALE
7. Solara Black          ₹1,899  (was ₹2,099)  — SALE
8. Luxe Nude Beige       ₹1,599  (was ₹1,799)  — SALE
```

---

## Design 1 — "Editorial Minimal"

**Vibe:** Clean, luxury fashion magazine feel. Lots of whitespace. Bold serif headings. Understated.

### Hero:
- Full-width, height 500px
- Background: dark navy `#3B5373` with a subtle diagonal texture or soft noise
- Centered text:
  - Small uppercase label: "NEW COLLECTION · SS25" in gold `#c9a96e`, 12px, letter-spacing 4px
  - Large serif heading: "Heels" — white, 96px, Cormorant Garamond, font-weight 300
  - Thin horizontal gold line (60px wide) centered below heading
  - Subtitle: "Step into your story." — white 60% opacity, italic, 18px
- No image, pure typography hero

### Occasion Strip:
- White background
- Heading: "SHOP BY OCCASION" — centered, `#3B5373`, uppercase, 13px, letter-spacing 6px
- 5 squares (not circles) — each 200×240px, dark navy bg with gold label overlay at bottom
- Hover: slight lift shadow effect

### Sidebar:
- Very minimal, no boxes
- Filter labels in `#3B5373` bold
- Checkboxes styled as custom navy squares
- "FILTERS" heading in gold uppercase letter-spacing

### Product Cards:
- No card border or shadow — completely flat
- Image 3:4 ratio, sharp corners
- SALE badge: tiny uppercase pill, `#3B5373` bg, white text, top-left
- Product name: Cormorant Garamond 16px, `#1a1a1a`
- Price: Inter 14px, sale price bold black, original strikethrough gray
- On hover: "ADD TO CART" text fades in as overlay on bottom 20% of image — semi-transparent `#3B5373` bg

### Color palette accents:
- Section dividers: 1px `#3B5373` line (not gray)
- "Load More" button: outlined `#3B5373`, on hover fills

---

## Design 2 — "Warm Boutique"

**Vibe:** Warm, inviting, like a boutique store. Cream backgrounds, warm tones, rounded cards.

### Hero:
- Full-width, height 480px
- Split layout — Left 55%: warm cream `#f7f5f2` bg with text | Right 45%: product image (placeholder)
- Left side:
  - Gold eyebrow text: "EXCLUSIVELY CLASSIE" — 11px uppercase gold, letter-spacing 4px
  - Large serif heading: "Heels &\nAccessories" — `#3B5373`, 64px, Cormorant Garamond, line-height 1.1
  - Body text: "Crafted for the woman who moves with grace and style." — Inter 15px, gray
  - CTA button: `#3B5373` bg, white text "Explore Collection", 14px, rounded 2px, padding 14px 32px
- Right side: placeholder image with slight tilt/rotation effect (-2deg rotate, overflow hidden)

### Occasion Strip:
- Background: soft cream `#f7f5f2`
- Heading: "BY OCCASION" — left-aligned, `#3B5373`, serif 32px
- 5 horizontal rounded cards (not circles) — 180×220px, warm gray bg
- Each card has: occasion name at bottom in navy serif, subtle hover scale

### Sidebar:
- Slight cream background `#faf8f5` with soft shadow
- Rounded filter groups with gentle `#e8e0d6` borders
- Checkboxes: custom rounded navy style
- Active filter = navy filled pill

### Product Cards:
- Subtle rounded corners (radius 6px)
- Very soft shadow on hover (box-shadow: 0 4px 20px rgba(59,83,115,0.12))
- SALE badge: rounded pill, gold `#c9a96e` bg, white text
- Product name: Cormorant Garamond 16px
- Price: Inter 14px
- Heart icon: always visible top-right (not just hover), outline style, fills on click
- Quick Add button: always visible below image — white bg, `#3B5373` text border, on hover = navy fill

### Color palette accents:
- Warm cream sections alternate with white
- Gold `#c9a96e` used for badges, dividers, accent lines
- Hover states use warm gold tint

---

## Technical Requirements (both files)

```html
<!-- Include in <head> -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- Fully responsive (mobile breakpoint at 768px)
- On mobile: 2-column grid, hide sidebar (show "Filters" button instead)
- Announcement bar auto-scrolls between 3 messages every 3 seconds
- Hover effects use CSS transitions (0.3s ease)
- All CSS inline in `<style>` tag
- No external JS libraries
- Dummy "Add to Cart" click shows a small toast notification

---

## Output

- File 1: `heels_design1_editorial.html`
- File 2: `heels_design2_boutique.html`

Make both files **complete and pixel-perfect** — ready to open in browser and review as design mockups. These will be used as reference to build the final Next.js page.
