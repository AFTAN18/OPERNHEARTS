import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Check, Upload, User, MapPin, Calendar, ChevronRight, ChevronLeft, Phone } from 'lucide-react';
import { cn } from '../utils/cn';
import { volunteerService } from '../services/volunteerService';
import { supabase } from '../lib/supabase';

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
                isActive ? "border-primary-600 bg-white text-black border-4" : 
                isCompleted ? "border-primary-600 bg-white text-black border-4" : "border-white bg-white text-black border-2"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: [] as string[],
    interests: [] as string[],
    skills: [] as string[]
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `volunteers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('volunteer-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('volunteer-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload photo if provided
      let photoUrl = null;
      if (file) {
        photoUrl = await uploadPhoto(file);
      }

      // Register volunteer
      const { data, error: submitError } = await volunteerService.registerVolunteer({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        availability: formData.availability,
        interests: formData.interests,
        skills: formData.skills,
        profile_photo_url: photoUrl || undefined,
        status: 'pending'
      });

      if (submitError) throw submitError;

      setIsSubmitted(true);
      setStep(4);
    } catch (err: any) {
      console.error('Error submitting volunteer form:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Personal Info", "Skills & Interests", "Verification"];

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      setError(null);
    }
    setStep(prev => Math.min(prev + 1, 3));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleAvailabilityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(value)
        ? prev.availability.filter(a => a !== value)
        : [...prev.availability, value]
    }));
  };

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
                        <label className="text-sm font-medium text-slate-700">First Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                              type="text" 
                              value={formData.firstName}
                              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                              placeholder="John" 
                              required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Last Name *</label>
                        <input 
                          type="text" 
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" 
                          placeholder="Doe" 
                          required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Email Address *</label>
                     <input 
                       type="email" 
                       value={formData.email}
                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                       className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" 
                       placeholder="john@example.com" 
                       required
                     />
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-700">Phone Number</label>
                     <div className="relative">
                         <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                         <input 
                           type="tel" 
                           value={formData.phone}
                           onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                           className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" 
                           placeholder="+1 (555) 123-4567" 
                         />
                     </div>
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
                            <label 
                              key={time} 
                              className={cn(
                                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors",
                                formData.availability.includes(time) && "border-primary-500 bg-primary-50"
                              )}
                            >
                                <input 
                                  type="checkbox" 
                                  checked={formData.availability.includes(time)}
                                  onChange={() => handleAvailabilityChange(time)}
                                  className="accent-primary-600 w-4 h-4" 
                                />
                                <span className="text-sm text-black font-semibold">{time}</span>
                            </label>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Areas of Interest</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Education & Teaching', 'Medical Aid', 'Logistics & Distribution', 'Fundraising', 'Event Planning', 'Communication'].map(interest => (
                            <label 
                              key={interest}
                              className={cn(
                                "flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors",
                                formData.interests.includes(interest) && "border-primary-500 bg-primary-50"
                              )}
                            >
                                <input 
                                  type="checkbox" 
                                  checked={formData.interests.includes(interest)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }));
                                    } else {
                                      setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
                                    }
                                  }}
                                  className="accent-primary-600 w-4 h-4" 
                                />
                                <span className="text-sm text-black font-semibold">{interest}</span>
                            </label>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Skills (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.skills.join(', ')}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none" 
                      placeholder="e.g., Teaching, First Aid, Public Speaking" 
                    />
                    <p className="text-xs text-slate-500">Separate multiple skills with commas</p>
                 </div>
              </motion.div>
            )}
            
            {step === 3 && !isSubmitted && (
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
                    <h3 className="text-xl font-bold mb-2">Review Your Information</h3>
                    <div className="text-left w-full space-y-3 mt-6 bg-slate-50 p-4 rounded-lg">
                        <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                        <div><strong>Email:</strong> {formData.email}</div>
                        {formData.phone && <div><strong>Phone:</strong> {formData.phone}</div>}
                        {formData.availability.length > 0 && <div><strong>Availability:</strong> {formData.availability.join(', ')}</div>}
                        {formData.interests.length > 0 && <div><strong>Interests:</strong> {formData.interests.join(', ')}</div>}
                    </div>
                    <p className="text-slate-500 mb-8 max-w-sm mt-6">Please review your information before submitting. We'll send a verification email to your inbox.</p>
                </motion.div>
            )}

            {isSubmitted && (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                    >
                        <Check size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Application Submitted!</h3>
                    <p className="text-slate-500 mb-6 max-w-sm">Thank you for your interest. We've received your application and will contact you shortly.</p>
                </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {!isSubmitted && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <Button 
                  variant="ghost" 
                  onClick={prevStep} 
                  disabled={step === 1 || isSubmitting}
                  className={`${step === 1 ? 'invisible' : ''} font-semibold text-black`}
              >
                  <ChevronLeft size={16} /> Back
              </Button>
              
              <Button 
                onClick={step === 3 ? handleSubmit : nextStep}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                className="font-bold text-black"
              >
                  {step === 3 ? 'Submit Application' : 'Next Step'} 
                  {step !== 3 && <ChevronRight size={16} />}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Volunteer;