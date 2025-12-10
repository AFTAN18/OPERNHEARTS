-- NGO Volunteer & Donation Management System - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  skills TEXT[],
  interests TEXT[],
  availability TEXT[],
  assigned_campaign_id UUID,
  profile_photo_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors Table
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_date DATE,
  goal_amount DECIMAL(12, 2),
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('active', 'completed', 'upcoming', 'cancelled')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
  donor_name VARCHAR(255),
  donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('monetary', 'in-kind', 'service')),
  amount DECIMAL(12, 2),
  item_description TEXT,
  donation_date DATE NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Volunteers (Many-to-Many)
CREATE TABLE IF NOT EXISTS campaign_volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  role VARCHAR(100),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed')),
  UNIQUE(campaign_id, volunteer_id)
);

-- Beneficiaries Table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_info TEXT,
  allocation_details TEXT,
  allocated_resources TEXT,
  allocation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_volunteers_campaign ON campaign_volunteers(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_volunteers_volunteer ON campaign_volunteers(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_campaign ON beneficiaries(campaign_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beneficiaries_updated_at BEFORE UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment campaign raised amount
CREATE OR REPLACE FUNCTION increment_campaign_raised(campaign_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE campaigns
  SET raised_amount = COALESCE(raised_amount, 0) + amount
  WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) - Adjust policies as needed
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow all for now - adjust based on your auth requirements)
CREATE POLICY "Allow all operations on volunteers" ON volunteers
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on donors" ON donors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on campaigns" ON campaigns
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on donations" ON donations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on campaign_volunteers" ON campaign_volunteers
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on beneficiaries" ON beneficiaries
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for volunteer photos (if needed)
-- Note: Run this in Supabase Storage section or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('volunteer-photos', 'volunteer-photos', true);

