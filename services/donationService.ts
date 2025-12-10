import { supabase } from '../lib/supabase';
import type { Donation, Donor } from '../types/database';

export const donationService = {
  // Create or get donor
  async createDonor(donor: Omit<Donor, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Check if donor already exists
      const { data: existing } = await supabase
        .from('donors')
        .select('id')
        .eq('email', donor.email)
        .single();

      if (existing) {
        return { data: existing, error: null };
      }

      // Create new donor
      const { data, error } = await supabase
        .from('donors')
        .insert([donor])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating donor:', error);
      return { data: null, error };
    }
  },

  // Record a donation
  async recordDonation(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...donation,
          status: donation.status || 'completed',
          transaction_id: donation.transaction_id || `TRX-${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;

      // Update campaign raised amount if campaign_id is provided
      if (donation.campaign_id && donation.amount && donation.status === 'completed') {
        const { data: campaign } = await supabase
          .from('campaigns')
          .select('raised_amount')
          .eq('id', donation.campaign_id)
          .single();

        if (campaign) {
          const newAmount = (campaign.raised_amount || 0) + donation.amount;
          await supabase
            .from('campaigns')
            .update({ raised_amount: newAmount })
            .eq('id', donation.campaign_id);
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error recording donation:', error);
      return { data: null, error };
    }
  },

  // Get all donations
  async getDonations() {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donors (*),
          campaigns (title)
        `)
        .order('donation_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      return { data: null, error };
    }
  },

  // Get donations by campaign
  async getDonationsByCampaign(campaignId: string) {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donors (*)
        `)
        .eq('campaign_id', campaignId)
        .order('donation_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching campaign donations:', error);
      return { data: null, error };
    }
  },

  // Get donation statistics
  async getDonationStats() {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('amount, donation_date, status');

      if (error) throw error;

      const total = data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const thisMonth = data?.filter(d => {
        const donationDate = new Date(d.donation_date);
        const now = new Date();
        return donationDate.getMonth() === now.getMonth() &&
               donationDate.getFullYear() === now.getFullYear() &&
               d.status === 'completed';
      }).reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

      return { 
        data: { total, thisMonth, count: data?.length || 0 }, 
        error: null 
      };
    } catch (error: any) {
      console.error('Error fetching donation stats:', error);
      return { data: null, error };
    }
  },
};

