-- Internal event tracking for the Admin "Live Tracker" dashboard.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,        -- 'page_view' | 'add_to_cart' | 'begin_checkout' | 'purchase' | 'error'
  path text,
  product_slug text,
  product_title text,
  value numeric,                    -- cart/order value for add_to_cart & purchase
  source text,                      -- referrer / utm_source, first-touch per browser session
  session_id text,                  -- random id stored in sessionStorage, groups events from one visit
  message text,                     -- error message, when event_type = 'error'
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_type_created_idx ON analytics_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON analytics_events (session_id);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Same access model as the rest of this project (admin uses the anon key from the
-- browser, not a service role key) — public insert so the site can log events, and
-- public read so the Admin > Live Tracker tab can query aggregates client-side.
CREATE POLICY "Public can insert events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read events" ON analytics_events
  FOR SELECT USING (true);

-- Keep the table from growing forever — delete events older than 90 days.
-- Optional: schedule this with pg_cron if enabled on your project, or run manually.
-- DELETE FROM analytics_events WHERE created_at < now() - interval '90 days';
