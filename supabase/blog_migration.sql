-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  category text DEFAULT 'Style Guide',
  author text DEFAULT 'CLASSIE Team',
  published_at timestamptz DEFAULT now(),
  active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read of active posts
CREATE POLICY "Public can read active posts" ON blog_posts
  FOR SELECT USING (active = true);

-- Allow all operations for service role (admin)
CREATE POLICY "Service role full access" ON blog_posts
  FOR ALL USING (true);
