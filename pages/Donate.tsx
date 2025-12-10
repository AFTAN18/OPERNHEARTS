import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreditCard, DollarSign, Heart, Lock, Gift } from 'lucide-react';
import { donationService } from '../services/donationService';
import { campaignService } from '../services/campaignService';
import type { Campaign } from '../types/database';

const Donate = () => {
  const [amount, setAmount] = useState(50);
  const [isCustom, setIsCustom] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  
  // Donor information
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Payment info (simulated)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardholderName: ''
  });

  const presets = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await campaignService.getCampaigns();
    if (data) {
      setCampaigns(data);
      if (data.length > 0) {
        setSelectedCampaign(data[0].id || '');
      }
    }
  };

  const handleDonate = async () => {
    if (!donorInfo.name || !donorInfo.email) {
      alert('Please fill in your name and email');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting donation process...');
      
      // Create or get donor
      const { data: donor, error: donorError } = await donationService.createDonor({
        name: donorInfo.name,
        email: donorInfo.email,
        phone: donorInfo.phone || undefined
      });

      if (donorError) {
        console.error('Donor error:', donorError);
        throw donorError;
      }

      console.log('Donor created/retrieved:', donor);

      // Generate transaction ID
      const txId = `TRX-${Date.now()}`;
      setTransactionId(txId);

      // Record donation
      const { data: donation, error } = await donationService.recordDonation({
        donor_id: donor?.id,
        donor_name: donorInfo.name,
        donation_type: 'monetary',
        amount: amount,
        donation_date: new Date().toISOString().split('T')[0],
        campaign_id: selectedCampaign || undefined,
        status: 'completed',
        transaction_id: txId
      });

      if (error) {
        console.error('Donation error:', error);
        throw error;
      }

      console.log('✅ Donation recorded successfully:', donation);

      // Show success state immediately
      setDonationSuccess(true);
      setTimeout(() => {
        setIsFlipped(true);
        setIsSubmitting(false);
      }, 300);
    } catch (error: any) {
      console.error('Error processing donation:', error);
      
      // Still show success if it's just a database issue (for demo purposes)
      // In production, you might want to handle this differently
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        alert('Database not set up yet. Please run the SQL schema in Supabase. Showing success message anyway for demo.');
      } else {
        alert(`Failed to process donation: ${error.message || 'Unknown error. Check console for details.'}`);
        setIsSubmitting(false);
        return;
      }
      
      // Show success even if DB fails (for demo)
      const txId = `TRX-${Date.now()}`;
      setTransactionId(txId);
      setDonationSuccess(true);
      setIsFlipped(true);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Selector */}
          <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Make a Difference Today</h1>
                <p className="text-slate-600 text-lg">Your contribution directly supports our mission to provide clean water and education to underserved communities.</p>
            </div>

            <Card className="p-8">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 block">Select Donation Amount</label>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {presets.map(val => (
                        <button
                            key={val}
                            onClick={() => { setAmount(val); setIsCustom(false); }}
                            className={`py-3 rounded-xl border-2 font-bold transition-all ${
                                amount === val && !isCustom 
                                ? 'border-primary-600 bg-primary-600 text-white shadow-inner' 
                                : 'border-slate-200 hover:border-primary-400 text-slate-900 bg-white'
                            }`}
                        >
                            ${val}
                        </button>
                    ))}
                </div>
                
                <div className="relative mb-8">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => { setAmount(Number(e.target.value)); setIsCustom(true); }}
                        onFocus={() => setIsCustom(true)}
                        className={`w-full pl-8 pr-4 py-4 text-2xl font-bold rounded-xl border-2 outline-none transition-colors ${isCustom ? 'border-primary-600 ring-4 ring-primary-50' : 'border-slate-200'}`}
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Select Campaign (Optional)</label>
                        <select 
                          value={selectedCampaign}
                          onChange={(e) => setSelectedCampaign(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="">General Donation</option>
                          {campaigns.map(campaign => (
                            <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                          ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-100">
                            <span>Donation Impact</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={amount}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-4 bg-accent-50 p-4 rounded-lg text-accent-800"
                            >
                                <Gift className="shrink-0" />
                                <p className="font-medium">
                                    ${amount} can provide <span className="font-bold">{Math.floor(amount / 5)}</span> meals for children in need.
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Your Name *</label>
                            <input 
                              type="text"
                              value={donorInfo.name}
                              onChange={(e) => setDonorInfo(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                              placeholder="John Doe"
                              required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
                            <input 
                              type="email"
                              value={donorInfo.email}
                              onChange={(e) => setDonorInfo(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                              placeholder="john@example.com"
                              required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Phone (Optional)</label>
                            <input 
                              type="tel"
                              value={donorInfo.phone}
                              onChange={(e) => setDonorInfo(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                              placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                </div>
            </Card>
          </div>

          {/* Right Column: Payment & Receipt */}
          <div className="perspective-1000 relative h-[600px] flex items-start justify-center">
             {/* Credit Card UI Flip Container */}
             <motion.div 
                className="w-full max-w-md relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
             >
                {/* Front: Payment Details */}
                <div className={`absolute inset-0 backface-hidden z-20 ${isFlipped && donationSuccess ? 'pointer-events-none' : ''}`}>
                    <Card className="bg-slate-900 text-white h-full shadow-2xl border-slate-800 flex flex-col p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                            <CreditCard className="text-primary-400" size={28} />
                            <span className="font-mono text-slate-300 text-sm font-semibold tracking-wider">CREDIT / DEBIT</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Card Number</label>
                                <input 
                                  type="text" 
                                  value={paymentInfo.cardNumber}
                                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                                  placeholder="0000 0000 0000 0000" 
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none font-mono text-base" 
                                  maxLength={19}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Expiry</label>
                                    <input 
                                      type="text" 
                                      value={paymentInfo.expiry}
                                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiry: e.target.value }))}
                                      placeholder="MM/YY" 
                                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none font-mono text-base" 
                                      maxLength={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">CVC</label>
                                    <input 
                                      type="text" 
                                      value={paymentInfo.cvc}
                                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvc: e.target.value }))}
                                      placeholder="123" 
                                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none font-mono text-base" 
                                      maxLength={4}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Cardholder Name</label>
                                <input 
                                  type="text" 
                                  value={paymentInfo.cardholderName}
                                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                                  placeholder="JOHN DOE" 
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none font-mono text-base uppercase" 
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <div className="flex flex-col items-center justify-center w-full">
                                <button 
                                  className="w-full py-5 px-6 text-xl font-bold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]" 
                                  onClick={handleDonate}
                                  disabled={isSubmitting || !donorInfo.name || !donorInfo.email}
                                  style={{ 
                                    backgroundColor: '#10b981',
                                    border: '2px solid #34d399',
                                    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3), 0 20px 40px -12px rgba(16, 185, 129, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.5), 0 25px 50px -12px rgba(16, 185, 129, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.15)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#10b981';
                                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3), 0 20px 40px -12px rgba(16, 185, 129, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.15)';
                                  }}
                                >
                                  {isSubmitting && (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  )}
                                  <span className="text-white tracking-wide">Donate ${amount}</span>
                                  <Heart className="fill-white ml-1" size={22} />
                                </button>
                                
                                <div className="flex items-center justify-center gap-2 mt-5">
                                    <Lock size={12} className="text-slate-400" />
                                    <span className="text-slate-400 text-xs tracking-wide">Secure 256-bit SSL Encryption</span>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Card>
                </div>

                {/* Back: Success / Receipt */}
                <div 
                    className={`absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden z-30 ${!donationSuccess ? 'opacity-0 pointer-events-none' : ''}`}
                    style={{ transform: 'rotateY(180deg)' }}
                >
                      <div className="h-2 bg-green-500 w-full" />
                      <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                          <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"
                          >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <Heart size={48} fill="currentColor" />
                              </motion.div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-3"
                          >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                  >
                                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                      </div>
                                  </motion.div>
                              </div>
                              <h3 className="text-4xl font-black text-green-600 mb-2">DONATION DONE!</h3>
                              <h4 className="text-2xl font-bold text-slate-900 mb-2">Thank You for Your Donation</h4>
                              <p className="text-slate-600 text-lg font-medium">Your generous contribution has been received successfully.</p>
                          </motion.div>
                          {/* Receipt Details */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-br from-green-50 to-emerald-50 p-7 rounded-2xl w-full border-3 border-green-300 shadow-xl"
                          >
                              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-green-200">
                                  <span className="text-slate-700 font-bold text-lg">Donation Amount</span>
                                  <span className="font-black text-4xl text-green-600">${amount}.00</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-slate-700 font-bold text-lg">Transaction ID</span>
                                  <span className="font-mono text-base text-slate-900 font-bold bg-white px-4 py-2 rounded-lg border-2 border-green-200">{transactionId}</span>
                              </div>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-2"
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setIsFlipped(false);
                                setDonationSuccess(false);
                                setTransactionId('');
                                setAmount(50);
                                setDonorInfo({ name: '', email: '', phone: '' });
                                setPaymentInfo({ cardNumber: '', expiry: '', cvc: '', cardholderName: '' });
                                setIsCustom(false);
                              }}
                              className="font-semibold text-slate-900"
                            >
                              Make Another Donation
                            </Button>
                          </motion.div>
                      </div>
                  </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;