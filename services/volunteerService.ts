import { supabase } from '../lib/supabase';
import type { Volunteer, CampaignVolunteer } from '../types/database';

export const volunteerService = {
  // Register a new volunteer
  async registerVolunteer(volunteer: Omit<Volunteer, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .insert([volunteer])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error registering volunteer:', error);
      return { data: null, error };
    }
  },

  // Get all volunteers
  async getVolunteers() {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching volunteers:', error);
      return { data: null, error };
    }
  },

  // Get volunteer by ID
  async getVolunteerById(id: string) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching volunteer:', error);
      return { data: null, error };
    }
  },

  // Update volunteer
  async updateVolunteer(id: string, updates: Partial<Volunteer>) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating volunteer:', error);
      return { data: null, error };
    }
  },

  // Assign volunteer to campaign
  async assignToCampaign(campaignId: string, volunteerId: string, role?: string) {
    try {
      const { data, error } = await supabase
        .from('campaign_volunteers')
        .insert([{
          campaign_id: campaignId,
          volunteer_id: volunteerId,
          role,
          status: 'assigned'
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error assigning volunteer:', error);
      return { data: null, error };
    }
  },

  // Get volunteers for a campaign
  async getCampaignVolunteers(campaignId: string) {
    try {
      const { data, error } = await supabase
        .from('campaign_volunteers')
        .select(`
          *,
          volunteers (*)
        `)
        .eq('campaign_id', campaignId);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching campaign volunteers:', error);
      return { data: null, error };
    }
  },
};

