import { supabase } from '../lib/supabase';
import type { Campaign, Beneficiary } from '../types/database';

export const campaignService = {
  // Create a new campaign
  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaign,
          raised_amount: 0,
          status: campaign.status || 'upcoming'
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      return { data: null, error };
    }
  },

  // Get all campaigns
  async getCampaigns() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      return { data: null, error };
    }
  },

  // Get campaign by ID
  async getCampaignById(id: string) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      return { data: null, error };
    }
  },

  // Update campaign
  async updateCampaign(id: string, updates: Partial<Campaign>) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      return { data: null, error };
    }
  },

  // Add beneficiary to campaign
  async addBeneficiary(beneficiary: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .insert([beneficiary])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding beneficiary:', error);
      return { data: null, error };
    }
  },

  // Get beneficiaries for a campaign
  async getCampaignBeneficiaries(campaignId: string) {
    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('allocation_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching beneficiaries:', error);
      return { data: null, error };
    }
  },

  // Get campaign statistics
  async getCampaignStats() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('status, raised_amount, goal_amount');

      if (error) throw error;

      const active = data?.filter(c => c.status === 'active').length || 0;
      const totalRaised = data?.reduce((sum, c) => sum + (c.raised_amount || 0), 0) || 0;
      const totalGoal = data?.reduce((sum, c) => sum + (c.goal_amount || 0), 0) || 0;

      return { 
        data: { 
          active, 
          total: data?.length || 0,
          totalRaised,
          totalGoal
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error('Error fetching campaign stats:', error);
      return { data: null, error };
    }
  },
};

