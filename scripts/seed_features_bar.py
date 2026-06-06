"""
Seed script for features_bar table in Supabase.

⚠️  Run the SQL below in Supabase SQL Editor FIRST, then run this script.

SQL to run in Supabase:
─────────────────────────────────────────────────────────────────
create table if not exists features_bar (
  id uuid default gen_random_uuid() primary key,
  icon text not null,
  title text not null,
  subtitle text,
  display_order int default 0,
  active boolean default true
);
─────────────────────────────────────────────────────────────────
"""

import os

try:
    from supabase import create_client
except ImportError:
    print("supabase-py not installed. Run: pip install supabase")
    print()
    print("=" * 60)
    print("SQL to run in Supabase Dashboard → SQL Editor:")
    print("=" * 60)
    print("""
create table if not exists features_bar (
  id uuid default gen_random_uuid() primary key,
  icon text not null,
  title text not null,
  subtitle text,
  display_order int default 0,
  active boolean default true
);

insert into features_bar (icon, title, subtitle, display_order, active) values
  ('🚚', 'Free Shipping',   'On orders above ₹999', 1, true),
  ('🔄', 'Easy Returns',    '7-day exchange policy', 2, true),
  ('🔒', 'Secure Checkout', '100% safe & trusted',   3, true),
  ('⭐', 'Premium Quality', 'Comfort-first design',  4, true);
""")
    exit(0)

SUPABASE_URL = "https://hrjvxwqvxvibtwyfoyca.supabase.co"
SUPABASE_KEY = "sb_publishable_fO8FW4iIh9pTTYdYGZ3m9Q_VXMtKI6z"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SEED_DATA = [
    {"icon": "🚚", "title": "Free Shipping",   "subtitle": "On orders above ₹999", "display_order": 1, "active": True},
    {"icon": "🔄", "title": "Easy Returns",    "subtitle": "7-day exchange policy", "display_order": 2, "active": True},
    {"icon": "🔒", "title": "Secure Checkout", "subtitle": "100% safe & trusted",   "display_order": 3, "active": True},
    {"icon": "⭐", "title": "Premium Quality", "subtitle": "Comfort-first design",  "display_order": 4, "active": True},
]

print("Attempting to insert seed data into features_bar…")
print("(Will fail if table doesn't exist yet — create it in Supabase SQL Editor first)")
print()

try:
    response = supabase.table("features_bar").insert(SEED_DATA).execute()
    print("✅ Seed data inserted successfully!")
    print(f"   Inserted {len(response.data)} rows")
except Exception as e:
    print(f"❌ Insert failed: {e}")
    print()
    print("Run this SQL in Supabase Dashboard → SQL Editor:")
    print()
    print("create table if not exists features_bar (")
    print("  id uuid default gen_random_uuid() primary key,")
    print("  icon text not null,")
    print("  title text not null,")
    print("  subtitle text,")
    print("  display_order int default 0,")
    print("  active boolean default true")
    print(");")
    print()
    print("insert into features_bar (icon, title, subtitle, display_order, active) values")
    print("  ('🚚', 'Free Shipping',   'On orders above ₹999', 1, true),")
    print("  ('🔄', 'Easy Returns',    '7-day exchange policy', 2, true),")
    print("  ('🔒', 'Secure Checkout', '100% safe & trusted',   3, true),")
    print("  ('⭐', 'Premium Quality', 'Comfort-first design',  4, true);")
