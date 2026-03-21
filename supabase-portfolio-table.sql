-- Create the portfolio table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS portfolio (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  title TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to portfolio"
ON portfolio FOR SELECT
TO public
USING (true);

-- Create policies to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert portfolio items"
ON portfolio FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update portfolio items"
ON portfolio FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete portfolio items"
ON portfolio FOR DELETE
TO authenticated
USING (true);

-- Optional: If you want to allow anonymous users (using anon key) to manage portfolio
-- Uncomment the following policies and comment out the authenticated ones above

-- CREATE POLICY "Allow anon to insert portfolio items"
-- ON portfolio FOR INSERT
-- TO anon
-- WITH CHECK (true);

-- CREATE POLICY "Allow anon to update portfolio items"
-- ON portfolio FOR UPDATE
-- TO anon
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow anon to delete portfolio items"
-- ON portfolio FOR DELETE
-- TO anon
-- USING (true);
