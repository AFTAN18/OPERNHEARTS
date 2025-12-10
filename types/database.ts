// Database types for the NGO Management System

export interface Volunteer {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills?: string[];
  interests?: string[];
  availability?: string[];
  assigned_campaign_id?: string;
  profile_photo_url?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface Donor {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id?: string;
  donor_id?: string;
  donor_name?: string; // For anonymous donations
  donation_type: 'monetary' | 'in-kind' | 'service';
  amount?: number;
  item_description?: string;
  donation_date: string;
  campaign_id?: string;
  status?: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Campaign {
  id?: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  event_date?: string;
  goal_amount?: number;
  raised_amount?: number;
  status?: 'active' | 'completed' | 'upcoming' | 'cancelled';
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignVolunteer {
  id?: string;
  campaign_id: string;
  volunteer_id: string;
  role?: string;
  assigned_at?: string;
  status?: 'assigned' | 'confirmed' | 'completed';
}

export interface Beneficiary {
  id?: string;
  campaign_id: string;
  name: string;
  contact_info?: string;
  allocation_details?: string;
  allocated_resources?: string;
  allocation_date?: string;
  created_at?: string;
  updated_at?: string;
}

