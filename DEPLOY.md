# Classie Web — Deployment Guide

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres database for orders)
- Vercel (hosting)

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `classie-orders`, choose a region closest to India (Singapore/Mumbai)
3. Once created, go to **SQL Editor** and run:

```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  items jsonb not null,
  total_amount numeric not null,
  status text default 'pending',
  payment_method text default 'cod',
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table orders enable row level security;

-- Allow inserts from anyone (for checkout)
create policy "Allow order inserts" on orders
  for insert with check (true);

-- Allow reads (for tracking + admin)
create policy "Allow order reads" on orders
  for select using (true);

-- Allow updates (for admin status changes)
create policy "Allow order updates" on orders
  for update using (true);
```

4. Go to **Settings → API**:
   - Copy `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2 — Copy Logo

Copy your logo file:
```bash
cp /path/to/classie_logo.jpg classie-web/public/logo.jpg
```

---

## Step 3 — Deploy to Vercel

### Option A: Vercel CLI (recommended)
```bash
cd classie-web
npm install -g vercel
vercel
# Follow prompts: framework = Next.js, root = ./
```

### Option B: GitHub + Vercel UI
1. Push `classie-web/` to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Set root directory to `classie-web` if needed
4. Add environment variables (see Step 4)
5. Click Deploy

---

## Step 4 — Environment Variables (Vercel Dashboard)

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ADMIN_PASSWORD` | `classie@admin123` (change this!) |

---

## Step 5 — Custom Domain

1. In Vercel → Project → Settings → Domains
2. Add `classie.co.in` and `www.classie.co.in`
3. Update DNS at your registrar:
   - Add `A` record: `@` → `76.76.21.21`
   - Add `CNAME` record: `www` → `cname.vercel-dns.com`

---

## Local Development

```bash
cd classie-web
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
# Open http://localhost:3000
```

---

## Pages Summary

| Route | Description |
|---|---|
| `/` | Homepage (Hero slider + collections) |
| `/shop/heels` | All 12 heels |
| `/shop/clips` | All clip-ons (with Crystal/Bow tabs) |
| `/shop/bow` | Bloom Bow collection |
| `/shop/the-date-edit` | The Date Edit curated collection |
| `/shop/the-everyday-edit` | The Everyday Edit |
| `/shop/the-festive-edit` | The Festive Edit |
| `/products/[slug]` | Product detail (55/45 layout) |
| `/cart` | Cart page |
| `/checkout` | Checkout (COD) |
| `/order-success` | Order confirmation |
| `/admin` | Admin dashboard (password: classie@admin123) |
| `/hot-deals` | Products on sale |
| `/style-ideas` | Lookbook / style inspiration |
| `/contact` | Contact form + info |
| `/about` | Brand story |
| `/faq` | FAQ + size guide |
| `/shipping` | Shipping policy |
| `/returns` | Returns & exchanges |
| `/refund-policy` | Refund policy |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms of service |
| `/track-order` | Track order by ID |
| `/support` | Support centre |

---

## Admin Access

URL: `yoursite.com/admin`
Password: `classie@admin123`

**Change the admin password** by updating `ADMIN_PASSWORD` env var.
For production, replace the client-side password check with a proper server-side session.

---

## WhatsApp Number

Update the phone number in these files before going live:
- `components/WhatsAppButton.tsx` — `wa.me/91XXXXXXXXXX`
- `app/contact/page.tsx`
- `app/support/page.tsx`
- `app/returns/page.tsx`
- `app/refund-policy/page.tsx`
- `app/shipping/page.tsx`
- `app/faq/page.tsx`
- `app/track-order/page.tsx`

Search for `919999999999` and replace with your actual number.

---

## Post-Deploy Checklist

- [ ] Supabase table created and RLS policies applied
- [ ] Environment variables set in Vercel
- [ ] Logo file in `public/logo.jpg`
- [ ] Custom domain pointed
- [ ] WhatsApp number updated
- [ ] Place a test order — verify it appears in `/admin`
- [ ] Test order tracking at `/track-order`
- [ ] Check mobile responsiveness
