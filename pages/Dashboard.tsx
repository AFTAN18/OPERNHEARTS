import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, DollarSign, TrendingUp, Activity, Bell, Settings } from 'lucide-react';
import { volunteerService } from '../services/volunteerService';
import { donationService } from '../services/donationService';
import { campaignService } from '../services/campaignService';
import { format } from 'date-fns';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <Card className="flex items-start justify-between p-6">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <span className="text-xs font-medium text-slate-500 mt-1 block">
        {change}
      </span>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolunteers: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
    donationsThisMonth: 0
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Load volunteers
      const { data: volunteers } = await volunteerService.getVolunteers();
      
      // Load donation stats
      const { data: donationStats } = await donationService.getDonationStats();
      
      // Load campaign stats
      const { data: campaignStats } = await campaignService.getCampaignStats();
      
      // Load recent donations
      const { data: donations } = await donationService.getDonations();
      
      // Update stats
      setStats({
        totalDonations: donationStats?.total || 0,
        totalVolunteers: volunteers?.length || 0,
        activeCampaigns: campaignStats?.active || 0,
        totalCampaigns: campaignStats?.total || 0,
        donationsThisMonth: donationStats?.thisMonth || 0
      });

      // Set recent donations
      setRecentDonations(donations?.slice(0, 10) || []);

      // Generate chart data from donations (last 6 months)
      const now = new Date();
      const monthData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthDonations = donations?.filter((d: any) => {
          const donationDate = new Date(d.donation_date);
          return donationDate.getMonth() === date.getMonth() &&
                 donationDate.getFullYear() === date.getFullYear() &&
                 d.status === 'completed';
        }) || [];
        
        monthData.push({
          name: format(date, 'MMM'),
          donations: monthDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
          volunteers: Math.floor(Math.random() * 100) + 200 // This could be calculated from volunteer signups
        });
      }
      setChartData(monthData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, Admin.</p>
          </div>
          <div className="flex gap-4">
             <button className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm relative">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
             </button>
             <button className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 shadow-sm">
                <Settings size={20} className="text-slate-600" />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Donations" 
              value={formatCurrency(stats.totalDonations)} 
              change={`${stats.donationsThisMonth > 0 ? '+' : ''}${formatCurrency(stats.donationsThisMonth)} this month`}
              icon={DollarSign} 
              color="bg-green-500" 
            />
            <StatCard 
              title="Active Volunteers" 
              value={stats.totalVolunteers.toLocaleString()} 
              change="All time"
              icon={Users} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Active Campaigns" 
              value={stats.activeCampaigns.toString()} 
              change={`${stats.totalCampaigns} total`}
              icon={TrendingUp} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Total Campaigns" 
              value={stats.totalCampaigns.toString()} 
              change="All campaigns"
              icon={Activity} 
              color="bg-orange-500" 
            />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Donation Overview (Last 6 Months)</h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Area type="monotone" dataKey="donations" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No donation data available
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Volunteer Activity</h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="volunteers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No volunteer data available
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity Table */}
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Recent Donations</h3>
                <button 
                  onClick={loadDashboardData}
                  className="text-sm text-primary-600 hover:text-primary-700 font-bold px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  Refresh
                </button>
            </div>
            <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    <p className="mt-4 text-slate-500">Loading donations...</p>
                  </div>
                ) : recentDonations.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No donations yet. Start receiving donations to see them here!
                  </div>
                ) : (
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                          <tr>
                              <th className="px-6 py-4">Donor</th>
                              <th className="px-6 py-4">Amount</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Campaign</th>
                              <th className="px-6 py-4">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                          {recentDonations.map((donation: any) => (
                              <tr key={donation.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-slate-900">
                                      {donation.donor_name || donation.donors?.name || 'Anonymous'}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600 font-semibold">
                                      {formatCurrency(donation.amount || 0)}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600">
                                      {donation.donation_date ? format(new Date(donation.donation_date), 'MMM dd, yyyy') : '-'}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600">
                                      {donation.campaigns?.title || donation.campaign_id || 'General'}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        donation.status === 'completed' 
                                          ? 'bg-green-100 text-green-800'
                                          : donation.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                          {donation.status || 'completed'}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;