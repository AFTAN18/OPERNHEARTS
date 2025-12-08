import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, DollarSign, TrendingUp, Activity, Bell, Settings } from 'lucide-react';

const data = [
  { name: 'Jan', donations: 4000, volunteers: 240 },
  { name: 'Feb', donations: 3000, volunteers: 139 },
  { name: 'Mar', donations: 2000, volunteers: 980 },
  { name: 'Apr', donations: 2780, volunteers: 390 },
  { name: 'May', donations: 1890, volunteers: 480 },
  { name: 'Jun', donations: 2390, volunteers: 380 },
  { name: 'Jul', donations: 3490, volunteers: 430 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <Card className="flex items-start justify-between p-6">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change} from last month
      </span>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </Card>
);

const Dashboard = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Donations" value="$124,500" change="+12%" icon={DollarSign} color="bg-green-500" />
          <StatCard title="Active Volunteers" value="1,240" change="+5%" icon={Users} color="bg-blue-500" />
          <StatCard title="Campaign Reach" value="45.2K" change="+18%" icon={TrendingUp} color="bg-purple-500" />
          <StatCard title="Active Projects" value="24" change="+2" icon={Activity} color="bg-orange-500" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Donation Overview</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
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
                  />
                  <Area type="monotone" dataKey="donations" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Volunteer Activity</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="volunteers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity Table (Mock) */}
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {[1,2,3,4,5].map(i => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">Anonymous Donor {i}</td>
                                <td className="px-6 py-4 text-slate-600">${(i * 50).toFixed(2)}</td>
                                <td className="px-6 py-4 text-slate-600">Clean Water Initiative</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;