# Claude Prompt — Classie Heels Collection Page

---

## Context

I am building a Next.js e-commerce website for **Classie** — a premium Indian heels & accessories brand. I am attaching screenshots of my OLD website's heels page as design reference. I want you to build a **better, modern version** of this page for my new Next.js + Supabase project.

**Tech stack:**
- Next.js 14 (App Router)
- Supabase (products table already exists)
- Tailwind CSS
- TypeScript
- Brand color: `#3B5373` (navy blue)
- Live site: classie-eta.vercel.app

---

## Supabase Products Table Schema

```sql
products (
  id uuid,
  name text,
  price numeric,
  compare_price numeric,       -- original price (for sale display)
  image_url text,
  images text[],               -- array of image URLs
  category text,               -- "heels", "accessories", etc.
  heel_type text,              -- "Block Heel", "Slim Heel", "Kitten Heel", "Sculpted Heel"
  occasion text,               -- "Party", "Everyday", "Festive", "Work", "Date"
  in_stock boolean,
  featured_tab text,           -- "new", "sale", "bestseller"
  slug text,                   -- URL slug
  description text
)
```

Supabase URL: `process.env.NEXT_PUBLIC_SUPABASE_URL`
Supabase Key: `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Page to Build

**File:** `app/collections/heels/page.tsx`

This is a **client-side page** (`"use client"`) — fetch products using `useEffect` + Supabase client.

---

## Design Requirements (from reference screenshots + improvements)

### 1. Overall Layout
- White background
- Max-width 1440px, centered
- Keep existing Navbar and AnnouncementBar from layout (already in `app/layout.tsx`)

### 2. Hero Banner (full-width)
- Full-width banner, height ~480px
- Background: dark navy gradient `#3B5373 → #2a3d55`
- Centered text overlay:
  - Eyebrow: "THE COLLECTION" — uppercase, letter-spacing 4px, 13px, color `#c9a96e` (gold)
  - Headline: "Heels" — large serif font (Cormorant Garamond or similar), 80px, white
  - Subheadline: "Step into your story with Classie." — italic serif, 22px, white 80% opacity
- If a hero image exists in public folder, use it as background with dark overlay

### 3. Shop by Occasion Strip
- Below hero, white bg, padding 50px 0
- Section heading: "SHOP BY OCCASION" — uppercase serif, centered, 28px, `#3B5373`
- 5 circular thumbnails in a row (use occasion images from `/public/occasions/` if exist, else use colored placeholders with navy bg)
- Occasions: **The Date Edit, The Everyday Edit, The Festive Edit, The Party Edit, The Work Edit**
- Circles: 180px diameter, object-cover
- Label below each: serif 15px, `#3B5373`, centered
- Clicking an occasion filters the product grid below

### 4. Filter + Product Grid Section
Layout: **Left sidebar (260px) + Right product grid (flex-1)**

#### Filter Sidebar:
- Heading "Filters" — bold serif 22px, `#3B5373`
- Thin divider `#e5e5e5`
- 3 filter groups (each with expand/collapse toggle):

  **a) Availability**
  - Checkboxes: "In stock", "Out of stock"
  
  **b) Price Range**
  - Two inputs: Min price (₹0) and Max price (₹1999)
  - Helper text: "Price range: ₹0 – ₹1,999" in gold `#c9a96e`
  
  **c) Heel Type**
  - Checkboxes: "Block Heel", "Slim Heel", "Kitten Heel", "Sculpted Heel"

- "Clear All Filters" link at bottom — gold color, 13px

#### Toolbar (above grid):
- Left: "{count} items" — gray 13px
- Right: Sort dropdown — "Featured | Price: Low to High | Price: High to Low | Newest"
- Grid toggle: 2-col / 4-col icons

#### Product Grid:
- **Default: 4 columns** (2 on mobile, 3 on tablet)
- Gap: 16px horizontal, 28px vertical

#### Product Card:
- **Image**: aspect ratio 3:4 portrait, object-cover, no border radius
- **SALE badge**: top-left corner, `#3B5373` bg, white text "SALE", 11px bold uppercase, rounded 4px — show only if `compare_price > price`
- **NEW badge**: top-left (if no sale), gold `#c9a96e` bg, white text "NEW", same style
- **Heart icon**: top-right corner, appears on hover — outline heart → filled on click (wishlist)
- **Product name**: below image, 10px gap, serif 15px, `#222`
- **Price row**: Sale price bold dark `#222` | Original price strikethrough gray `#999` — format: ₹1,699
- **Quick Add button**: appears on image hover — full-width below image, `#3B5373` bg, white text "Quick Add", 13px uppercase, 40px height — adds to cart (for now just show a toast "Added!")
- **Hover effect on image**: slight scale(1.04) transform, transition 0.3s

### 5. Empty State
If no products found after filtering:
- Centered message: "No heels found for this filter." — serif italic 20px gray
- "Clear filters" button in `#3B5373`

### 6. Load More / Pagination
- Show 12 products initially
- "Load More" button below grid — outlined button, `#3B5373` border+text, hover fills
- OR infinite scroll (your preference)

---

## Filtering Logic

All filtering happens **client-side** (no DB re-fetch on filter change):
1. Fetch ALL heels on mount: `.from("products").select("*").eq("category", "heels")`
2. Store in `allProducts` state
3. Apply filters from sidebar + occasion click as computed `filteredProducts`
4. Occasion click = filter by `occasion` field
5. Heel type checkbox = filter by `heel_type` field
6. Availability = filter by `in_stock`
7. Price = filter by `price BETWEEN min AND max`

---

## Mobile Responsive
- Mobile: hide sidebar, show "Filters" button that opens a bottom drawer/sheet
- Grid: 2 cols on mobile
- Hero text smaller on mobile (40px heading)
- Occasion circles: horizontal scroll on mobile (overflow-x: auto, no wrap)

---

## Files to create/edit:
1. `app/collections/heels/page.tsx` — main page (client component)
2. `components/ProductCard.tsx` — reusable product card (if not exists)
3. `components/FilterSidebar.tsx` — filter sidebar component
4. `components/OccasionStrip.tsx` — if not already exists

---

## Do NOT:
- Do NOT add breadcrumbs
- Do NOT add star ratings
- Do NOT add color swatches
- Do NOT change the existing Navbar or Footer
- Do NOT use any external UI libraries (only Tailwind)
- Do NOT use server components — keep everything client-side with useEffect

---

## Reference
I am attaching screenshots of my OLD website's heels collection page. Match the overall structure and feel, but make it cleaner and more modern with the new brand color `#3B5373`.
