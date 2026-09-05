-- Adds device + location columns to analytics_events (run analytics_migration.sql first
-- if you haven't already). Run this once in the Supabase SQL editor.
-- Safe to re-run — every statement is guarded with IF NOT EXISTS.

ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS device text;   -- 'mobile' | 'desktop'
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS country text;  -- from Vercel's edge geo headers
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS city text;

CREATE INDEX IF NOT EXISTS analytics_events_device_idx ON analytics_events (device);
