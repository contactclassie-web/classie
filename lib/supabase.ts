import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// cache: 'no-store' prevents Next.js server-side fetch caching for Supabase calls
// (safe for client components too — browser ignores this option)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});

export interface Order {
  id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  total_amount: number;
  status?: string;
  payment_method?: string;
  created_at?: string;
}

export interface CartItem {
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}
