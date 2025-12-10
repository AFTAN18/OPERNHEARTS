# NGO Volunteer & Donation Management System - Setup Guide

## Overview

This is a cloud-based NGO management system built with React, TypeScript, and Supabase. It manages volunteers, donations, and campaigns through a centralized platform.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and anon/public key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholders with your actual Supabase credentials.

### 4. Set Up Database Schema

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the SQL script from `supabase/schema.sql`
   - This creates all necessary tables, indexes, and functions
   - It also sets up Row Level Security policies

### 5. Set Up Storage (Optional)

If you want to allow volunteer photo uploads:

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `volunteer-photos`
3. Set it to public

Alternatively, you can run this SQL in the SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('volunteer-photos', 'volunteer-photos', true);
```

### 6. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── Layout.tsx      # Main layout with navbar and footer
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client setup
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Volunteer.tsx   # Volunteer registration (MODULE-1)
│   ├── Donate.tsx      # Donation form (MODULE-2)
│   ├── Campaigns.tsx   # Campaign management (MODULE-3)
│   └── Dashboard.tsx   # Admin dashboard with analytics
├── services/           # Business logic and API calls
│   ├── volunteerService.ts
│   ├── donationService.ts
│   └── campaignService.ts
├── types/              # TypeScript type definitions
│   └── database.ts     # Database entity types
└── supabase/           # Database schema
    └── schema.sql      # SQL schema file
```

## Features

### MODULE-1: Volunteer Registration
- Multi-step registration form
- Profile photo upload (optional)
- Skills and interests selection
- Availability tracking
- Campaign assignment capability

### MODULE-2: Donor & Donation Management
- Donor information capture
- Donation recording (monetary, in-kind, service)
- Campaign association
- Transaction tracking
- Donation statistics

### MODULE-3: Campaign Coordination
- Campaign creation and management
- Volunteer assignment to campaigns
- Beneficiary allocation tracking
- Campaign status tracking
- Progress monitoring

### Dashboard
- Real-time statistics
- Donation trends (last 6 months)
- Volunteer activity metrics
- Recent transactions table
- Campaign overview

## Database Tables

- `volunteers` - Volunteer information and profiles
- `donors` - Donor details
- `donations` - Donation transactions
- `campaigns` - Campaign details
- `campaign_volunteers` - Volunteer-campaign assignments
- `beneficiaries` - Beneficiary allocation records

## API Services

All database operations are handled through service files:

- `volunteerService.ts` - Volunteer CRUD operations
- `donationService.ts` - Donation and donor management
- `campaignService.ts` - Campaign and beneficiary management

## Development

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### Supabase Connection Issues
- Verify your environment variables are set correctly
- Check that your Supabase project is active
- Ensure RLS policies allow your operations

### Storage Upload Issues
- Verify the `volunteer-photos` bucket exists
- Check bucket permissions (should be public)
- Review file size limits in Supabase settings

### Database Errors
- Ensure schema.sql has been run successfully
- Check for any foreign key constraint violations
- Verify table names match exactly (case-sensitive)

## Security Notes

- Row Level Security (RLS) is enabled by default
- Current policies allow all operations - adjust based on your authentication needs
- For production, implement proper authentication and authorization
- Store sensitive keys in environment variables only

## Support

For issues or questions, please refer to:
- Supabase Documentation: https://supabase.com/docs
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev

