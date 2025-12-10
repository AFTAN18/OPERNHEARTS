import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Filter, Calendar, MapPin, Users, ArrowUpRight, Plus } from 'lucide-react';
import { campaignService } from '../services/campaignService';
import { volunteerService } from '../services/volunteerService';
import { donationService } from '../services/donationService';
import { CreateCampaignModal } from '../components/CreateCampaignModal';
import type { Campaign, Beneficiary } from '../types/database';

const Campaigns = () => {
  const [filter, setFilter] = useState('All');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const categories = ['All', 'Health', 'Education', 'Environment', 'Emergency'];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data } = await campaignService.getCampaigns();
    if (data) {
      setCampaigns(data);
    }
    setLoading(false);
  };

  const filteredCampaigns = filter === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Our Campaigns</h1>
            <p className="text-slate-600 max-w-xl">Discover projects that align with your passions. 100% of your donation goes directly to the field.</p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar items-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-md ${
                    filter === cat 
                      ? 'bg-white text-black shadow-lg shadow-slate-200/50 scale-105 border-2 border-primary-600' 
                      : 'bg-white text-black hover:bg-primary-50 hover:border-primary-400 border-2 border-slate-300 hover:shadow-lg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowCreateForm(true)}
              className="ml-2 font-bold text-black bg-white hover:bg-slate-50 shadow-lg shadow-slate-200/50 border-2 border-primary-600 px-5 py-2.5"
              variant="primary"
            >
              <Plus size={18} className="mr-1.5" /> New Campaign
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-500">Loading campaigns...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">No campaigns found. Create one to get started!</p>
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
              <motion.div
                layout
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-0 overflow-hidden h-full flex flex-col group border-0 shadow-lg">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
                    {campaign.image_url ? (
                      <img 
                        src={campaign.image_url} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {campaign.title.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 uppercase tracking-wide">
                        {campaign.category}
                    </div>
                    {campaign.status && (
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {campaign.status}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                        <MapPin size={12} /> {campaign.location}
                        {campaign.event_date && (
                          <>
                            <span className="mx-1">•</span>
                            <Calendar size={12} />
                            <span>{new Date(campaign.event_date).toLocaleDateString()}</span>
                          </>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {campaign.title}
                    </h3>
                    {campaign.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{campaign.description}</p>
                    )}
                    
                    <div className="mt-auto pt-4">
                        {campaign.goal_amount && (
                          <>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-slate-700">${(campaign.raised_amount || 0).toLocaleString()} raised</span>
                                <span className="text-slate-500">of ${campaign.goal_amount.toLocaleString()}</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min((campaign.raised_amount || 0) / campaign.goal_amount * 100, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-primary-500 rounded-full"
                                />
                            </div>
                          </>
                        )}
                        <Button variant="outline" className="w-full group-hover:bg-primary-50 group-hover:border-primary-200 text-black font-semibold">
                            View Details <ArrowUpRight size={16} />
                        </Button>
                    </div>
                  </div>
                </Card>
                </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Create Campaign Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <CreateCampaignModal 
              onClose={() => setShowCreateForm(false)}
              onSuccess={() => {
                setShowCreateForm(false);
                loadCampaigns();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Campaigns;