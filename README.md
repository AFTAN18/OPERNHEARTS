<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NGO Volunteer & Donation Management System

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A comprehensive cloud-based platform for managing NGO operations including volunteer registration, donation tracking, and campaign coordination. Built with React, TypeScript, and Supabase.

## Features

### 🎯 MODULE-1: Volunteer Registration & Activity Management
- Digital registration forms with multi-step workflow
- Volunteer profile management
- Skills and interests tracking
- Availability scheduling
- Campaign assignment

### 💰 MODULE-2: Donor & Donation Management
- Donor information capture
- Donation tracking (monetary, in-kind, services)
- Transaction recording with unique IDs
- Campaign-specific donations
- Automated reporting

### 📋 MODULE-3: Campaign Coordination & Beneficiary Allocation
- Campaign creation and management
- Volunteer assignment to campaigns
- Beneficiary tracking and allocation
- Resource distribution management
- Campaign progress monitoring

### 📊 Real-time Dashboard
- Comprehensive analytics and statistics
- Donation trends visualization
- Volunteer activity metrics
- Recent transactions overview
- Campaign performance tracking

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Storage, Authentication)
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql`
   - Copy your project URL and anon key

3. **Configure environment:**
   Create `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Project Structure

```
├── components/       # UI components
├── lib/             # Supabase configuration
├── pages/           # Page components
├── services/        # Business logic & API services
├── types/           # TypeScript definitions
└── supabase/        # Database schema
```

## Key Outcomes

✅ **Real-time Coordination** - Instant data updates across all modules  
✅ **Efficient Notifications** - Automated alerts for new entries  
✅ **Operational Visibility** - Comprehensive dashboards and analytics  
✅ **Scalability** - Handles multiple campaigns and large datasets  
✅ **Reduced Manual Work** - Automated data entry and reporting  

## License

This project is developed for NGO management and transparency.
