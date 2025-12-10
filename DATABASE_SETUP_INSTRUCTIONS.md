# Database Setup Instructions

## Your Supabase Project
**Project URL:** https://xingmixzvhlowozngdjh.supabase.co

## Step-by-Step Database Setup

### 1. Access SQL Editor
1. Go to: https://supabase.com/dashboard/project/xingmixzvhlowozngdjh/sql
2. Click **"New Query"** or use the SQL Editor

### 2. Run the Schema Script
1. Open the file `supabase/schema.sql` in this project
2. Copy the **ENTIRE** contents of the file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)

The script will create:
- ✅ All database tables
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps
- ✅ Row Level Security policies
- ✅ Helper functions

### 3. Verify Tables Were Created
Go to **Table Editor** in your Supabase dashboard. You should see:
- `volunteers`
- `donors`
- `donations`
- `campaigns`
- `campaign_volunteers`
- `beneficiaries`

### 4. Set Up Storage (Optional - for volunteer photos)

**Option A: Via Dashboard**
1. Go to **Storage** in Supabase dashboard
2. Click **"New bucket"**
3. Name: `volunteer-photos`
4. **Public bucket:** ✓ (checked)
5. Click **"Create bucket"**

**Option B: Via SQL**
Run this in SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('volunteer-photos', 'volunteer-photos', true);
```

### 5. Test Connection
After setting up:
1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Try registering a volunteer at `/volunteer`
4. Check the `volunteers` table in Supabase to verify data was saved

## Troubleshooting

### "Table already exists" errors
- This is normal if you run the script multiple times
- The `CREATE TABLE IF NOT EXISTS` statements prevent errors
- Your tables are safe

### Permission errors
- The schema includes permissive RLS policies
- If you see permission issues, check the policies in **Authentication > Policies**

### Storage upload fails
- Verify the bucket exists: `volunteer-photos`
- Check it's set to **Public**
- Verify RLS policies allow uploads

## Next Steps
Once the database is set up:
1. ✅ Environment file is already configured (`.env.local`)
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Test all features!

See `QUICK_START.md` for complete setup instructions.

