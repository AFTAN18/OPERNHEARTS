import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CreditCard, DollarSign, Heart, Lock, Gift } from 'lucide-react';

const Donate = () => {
  const [amount, setAmount] = useState(50);
  const [isCustom, setIsCustom] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const presets = [10, 25, 50, 100, 250, 500];

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
                            className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                                amount === val && !isCustom 
                                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-inner' 
                                : 'border-slate-100 hover:border-primary-200 text-slate-600'
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
                <div className="absolute inset-0 backface-hidden z-20">
                    <Card className="bg-slate-900 text-white h-full shadow-2xl border-slate-800">
                        <div className="flex justify-between items-center mb-8">
                            <CreditCard className="text-primary-400" size={32} />
                            <span className="font-mono text-slate-400">CREDIT / DEBIT</span>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase">Card Number</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-primary-500 outline-none font-mono" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-primary-500 outline-none font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase">CVC</label>
                                    <input type="text" placeholder="123" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-primary-500 outline-none font-mono" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase">Cardholder Name</label>
                                <input type="text" placeholder="JOHN DOE" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-primary-500 outline-none font-mono" />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <Button variant="accent" className="w-full py-4 text-lg" onClick={() => setIsFlipped(true)}>
                                Donate ${amount} <Heart className="ml-2 fill-current" size={20} />
                            </Button>
                            <div className="flex justify-center items-center gap-2 mt-4 text-slate-500 text-xs">
                                <Lock size={12} /> Secure 256-bit SSL Encryption
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Back: Success / Receipt */}
                <div 
                    className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden" 
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="h-2 bg-green-500 w-full" />
                    <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ delay: 0.4 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600"
                        >
                            <Heart size={40} fill="currentColor" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Thank You!</h3>
                            <p className="text-slate-500">Your donation was successful.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl w-full">
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-bold text-slate-900">${amount}.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Transaction ID</span>
                                <span className="font-mono text-xs text-slate-900">#TRX-88293</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setIsFlipped(false)}>Donate Again</Button>
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