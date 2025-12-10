# Quick Start Guide

## Your Supabase Credentials (Already Configured)

Your Supabase project is ready to use:
- **URL:** `https://xingmixzvhlowozngdjh.supabase.co`
- **Anon Key:** (Configured in your environment)

## Step 1: Create Environment File

Create a file named `.env.local` in the project root with:

```env
VITE_SUPABASE_URL=https://xingmixzvhlowozngdjh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbmdtaXh6dmhsb3dvem5nZGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTg3MDcsImV4cCI6MjA4MDg3NDcwN30.GUe0lk4BYz0GyuVNkcEQ3EaItFzwOwTBlgp4VILeVTo
```

## Step 2: Set Up Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xingmixzvhlowozngdjh
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** to execute the script

This will create all necessary tables:
- `volunteers`
- `donors`
- `donations`
- `campaigns`
- `campaign_volunteers`
- `beneficiaries`

## Step 3: Set Up Storage (Optional)

For volunteer photo uploads:

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `volunteer-photos`
4. Make it **Public**
5. Click **Create bucket**

Or run this SQL in SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('volunteer-photos', 'volunteer-photos', true);
```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Step 6: Test the System

1. **Register a Volunteer:**
   - Navigate to `/volunteer`
   - Fill out the multi-step form
   - Submit and verify data appears in Supabase

2. **Make a Donation:**
   - Navigate to `/donate`
   - Fill out donation details
   - Complete the form
   - Check the dashboard for the donation

3. **Create a Campaign:**
   - Navigate to `/campaigns`
   - Click "New Campaign"
   - Fill out campaign details
   - View in the campaigns list

4. **View Dashboard:**
   - Navigate to `/dashboard`
   - See real-time statistics and analytics

## Troubleshooting

### Database Connection Issues
- Verify `.env.local` file exists and has correct values
- Check that you've run the SQL schema script
- Ensure your Supabase project is active

### Storage Upload Issues
- Verify the `volunteer-photos` bucket exists and is public
- Check file size limits in Supabase settings

### RLS (Row Level Security) Errors
- The schema includes permissive policies
- If you see permission errors, check RLS policies in Supabase dashboard

## Next Steps

- Customize the UI and branding
- Add authentication if needed
- Set up email notifications
- Configure payment gateways for donations
- Deploy to production

For detailed documentation, see `SETUP.md` and `IMPLEMENTATION_SUMMARY.md`

