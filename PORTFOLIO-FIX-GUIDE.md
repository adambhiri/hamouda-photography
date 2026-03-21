# Fix for Portfolio 404 Error

## Problem
You're getting a **404 error** when trying to add portfolio items because the `portfolio` table doesn't exist in your Supabase database.

## Solution

### Step 1: Create the Portfolio Table

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: **lhfzxxjbmspuccymozpi**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL from `supabase-portfolio-table.sql` (in this directory)
6. Click **Run** to execute the SQL

### Step 2: Verify the Storage Bucket

You also need to make sure the `portfolio` storage bucket exists:

1. In Supabase Dashboard, go to **Storage** in the left sidebar
2. Check if a bucket named `portfolio` exists
3. If it doesn't exist, create it:
   - Click **New Bucket**
   - Name: `portfolio`
   - **Public bucket**: ✅ Check this (so images are publicly accessible)
   - Click **Create bucket**

### Step 3: Set Storage Bucket Policies

After creating the bucket, you need to set the right policies:

1. Click on the `portfolio` bucket
2. Go to **Policies** tab
3. Add these policies:

**For Public Read Access:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio');
```

**For Insert (Upload):**
```sql
CREATE POLICY "Allow anon uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'portfolio');
```

**For Delete:**
```sql
CREATE POLICY "Allow anon deletes"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'portfolio');
```

### Step 4: Test the Fix

After completing the above steps:

1. Refresh your admin panel
2. Try adding a portfolio item
3. The 404 error should be gone!

## Alternative: Use Anon Policies (Recommended for Admin Panel)

Since you're using the `anon` key (not authenticated users), you might want to uncomment the "anon" policies in the SQL file instead of the "authenticated" ones. This will allow your admin panel to work without authentication.

## Need Help?

If you still get errors:
- Check the browser console for detailed error messages
- Verify the table was created: Go to **Table Editor** in Supabase and look for `portfolio`
- Check RLS policies: Go to **Authentication** > **Policies** and verify the policies are active
