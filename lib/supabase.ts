import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// On the server, Next.js would otherwise keep these reads in its Data Cache
// for a year; 60 s keeps pages fast and admin changes visible quickly.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (input, init) =>
      typeof window === "undefined" ? fetch(input, { ...init, next: { revalidate: 60 } }) : fetch(input, init),
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
