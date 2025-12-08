import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Filter, Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';

const campaigns = [
  { id: 1, title: 'Clean Water Initiative', category: 'Health', location: 'Kenya', raised: 12500, goal: 20000, image: 'https://picsum.photos/400/300?random=1' },
  { id: 2, title: 'Education for All', category: 'Education', location: 'India', raised: 8200, goal: 15000, image: 'https://picsum.photos/400/300?random=2' },
  { id: 3, title: 'Disaster Relief Fund', category: 'Emergency', location: 'Global', raised: 45000, goal: 50000, image: 'https://picsum.photos/400/300?random=3' },
  { id: 4, title: 'Reforestation Project', category: 'Environment', location: 'Brazil', raised: 3200, goal: 10000, image: 'https://picsum.photos/400/300?random=4' },
  { id: 5, title: 'Youth Tech Training', category: 'Education', location: 'Detroit', raised: 15000, goal: 25000, image: 'https://picsum.photos/400/300?random=5' },
  { id: 6, title: 'Mobile Medical Clinic', category: 'Health', location: 'Syria', raised: 28000, goal: 40000, image: 'https://picsum.photos/400/300?random=6' },
];

const Campaigns = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Health', 'Education', 'Environment', 'Emergency'];

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
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCampaigns.map((campaign) => (
              <motion.div
                layout
                key={campaign.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-0 overflow-hidden h-full flex flex-col group border-0 shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 uppercase tracking-wide">
                        {campaign.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                        <MapPin size={12} /> {campaign.location}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {campaign.title}
                    </h3>
                    
                    <div className="mt-auto pt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-700">${campaign.raised.toLocaleString()} raised</span>
                            <span className="text-slate-500">of ${campaign.goal.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-primary-500 rounded-full"
                            />
                        </div>
                        <Button variant="outline" className="w-full group-hover:bg-primary-50 group-hover:border-primary-200">
                            View Details <ArrowUpRight size={16} />
                        </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Campaigns;