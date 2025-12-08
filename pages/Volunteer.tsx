import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Check, Upload, User, MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const StepIndicator = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0">
        <motion.div 
            className="h-full bg-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      {steps.map((step, i) => {
        const isCompleted = currentStep > i + 1;
        const isActive = currentStep === i + 1;
        return (
          <div key={i} className="relative z-10 flex flex-col items-center">
            <motion.div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 font-bold",
                isActive ? "border-primary-100 bg-primary-600 text-white" : 
                isCompleted ? "border-primary-600 bg-primary-600 text-white" : "border-white bg-slate-200 text-slate-500"
              )}
              initial={false}
              animate={{ scale: isActive ? 1.2 : 1 }}
            >
              {isCompleted ? <Check size={16} /> : i + 1}
            </motion.div>
            <span className={cn("absolute -bottom-6 text-xs font-medium whitespace-nowrap", isActive ? "text-primary-700" : "text-slate-400")}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Volunteer = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const steps = ["Personal Info", "Skills & Interests", "Verification"];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center justify-center">
      <div className="container max-w-2xl px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join Our Mission</h1>
          <p className="text-slate-500">Become a part of the change you want to see.</p>
        </div>

        <StepIndicator currentStep={step} steps={steps} />

        <Card className="mt-8 overflow-hidden min-h-[400px]">
          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Last Name</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Doe" />
                    </div>
                </div>
                
                <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Email Address</label>
                     <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Profile Photo</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                        {preview ? (
                             <motion.div layoutId="preview" className="relative w-24 h-24 rounded-full overflow-hidden shadow-md">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                             </motion.div>
                        ) : (
                            <>
                                <Upload className="text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500">Click to upload photo</span>
                            </>
                        )}
                    </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                 <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-700">Availability</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['Weekdays', 'Weekends', 'Mornings', 'Evenings'].map(time => (
                            <label key={time} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="checkbox" className="accent-primary-600 w-4 h-4" />
                                <span className="text-sm text-slate-700">{time}</span>
                            </label>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Areas of Interest</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none">
                        <option>Education & Teaching</option>
                        <option>Medical Aid</option>
                        <option>Logistics & Distribution</option>
                        <option>Fundraising</option>
                    </select>
                 </div>
              </motion.div>
            )}
            
            {step === 3 && (
                <motion.div
                    key="step3"
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex flex-col items-center justify-center py-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <Check size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Almost There!</h3>
                    <p className="text-slate-500 mb-8 max-w-sm">Please review your information before submitting. We'll send a verification email to your inbox.</p>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1}
                className={step === 1 ? 'invisible' : ''}
            >
                <ChevronLeft size={16} /> Back
            </Button>
            
            <Button onClick={step === 3 ? () => alert('Submitted!') : nextStep}>
                {step === 3 ? 'Submit Application' : 'Next Step'} <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Volunteer;