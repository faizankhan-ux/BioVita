import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Droplets, AlertCircle, Phone, Stethoscope, Camera, CheckCircle2, FileText, Upload, X, FileIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity } from '../contexts/MedicalIdentityContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const Register = () => {
  const navigate = useNavigate();
  const { registerIdentity } = useMedicalIdentity();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    pastSurgeries: '',
    recentIssues: '',
    emergencyContact: '',
    age: '',
    gender: '',
    doctorHospital: '',
    image: '',
    reports: [] as Array<{ name: string; type: string; content: string }>
  });

  const [isUploading, setIsUploading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerIdentity(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/patient');
    }, 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    const newReports: Array<{ name: string; type: string; content: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit.`);
        continue;
      }

      // Check types
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type (PDF, JPG, PNG only).`);
        continue;
      }

      const report = await new Promise<{ name: string; type: string; content: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            type: file.type,
            content: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
      
      newReports.push(report);
    }

    setFormData(prev => ({
      ...prev,
      reports: [...prev.reports, ...newReports]
    }));
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 800);
  };

  const removeReport = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reports: prev.reports.filter((_, i) => i !== index)
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 rounded-[3rem] text-center max-w-md w-full border-green-500/20"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Medical Identity Created</h2>
            <p className="text-white/60 mb-8">Your biometric data and medical history have been securely encrypted and stored.</p>
            <p className="text-xs text-white/40 animate-pulse">Entering Your Patient Dashboard...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
              ● Onboarding
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Create Your Medical ID</h1>
            <p className="text-white/60 text-lg">Secure your health information with biometric identification. Access it instantly in emergencies.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* 🔴 SECTION 1: CRITICAL */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-red-500/20 bg-red-500/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">1. Critical Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold tracking-widest text-white/40">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input 
                      id="name"
                      required
                      placeholder="Enter your full name"
                      className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-red-500/50"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blood" className="text-xs uppercase font-bold tracking-widest text-white/40">Blood Group</Label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/50" />
                    <select 
                      id="blood"
                      required
                      className="w-full pl-12 bg-white/5 border border-white/10 h-12 rounded-xl focus:border-red-500/50 appearance-none text-sm text-white"
                      value={formData.bloodGroup}
                      onChange={e => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    >
                      <option value="" disabled className="bg-black text-white/40">Select Group</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg} className="bg-black text-white">{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-xs uppercase font-bold tracking-widest text-white/40">Fatal Allergies</Label>
                  <div className="relative">
                    <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/50" />
                    <Input 
                      id="allergies"
                      placeholder="e.g. Penicillin, Peanuts"
                      className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-red-500/50"
                      value={formData.allergies}
                      onChange={e => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronic" className="text-xs uppercase font-bold tracking-widest text-white/40">Chronic Conditions</Label>
                <div className="relative">
                  <AlertCircle className="absolute left-4 top-3.5 w-4 h-4 text-white/20" />
                  <textarea 
                    id="chronic"
                    placeholder="e.g. Diabetes, Asthma, Epilepsy"
                    className="w-full pl-12 p-3.5 bg-white/5 border border-white/10 rounded-xl focus:border-red-500/50 min-h-[80px] text-sm resize-none"
                    value={formData.chronicConditions}
                    onChange={e => setFormData(prev => ({ ...prev, chronicConditions: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* 🟠 SECTION 2: IMPORTANT */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-orange-500/20 bg-orange-500/[0.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">2. Important History</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meds" className="text-xs uppercase font-bold tracking-widest text-white/40">Current Medications</Label>
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500/40" />
                    <Input 
                      id="meds"
                      placeholder="e.g. Metformin 500mg (Daily)"
                      className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-orange-500/50"
                      value={formData.medications}
                      onChange={e => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="surgeries" className="text-xs uppercase font-bold tracking-widest text-white/40">Past Surgeries</Label>
                    <Input 
                      id="surgeries"
                      placeholder="e.g. Heart Valve, Knee Replacement"
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-orange-500/50"
                      value={formData.pastSurgeries}
                      onChange={e => setFormData(prev => ({ ...prev, pastSurgeries: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recent" className="text-xs uppercase font-bold tracking-widest text-white/40">Recent Medical Issues</Label>
                    <Input 
                      id="recent"
                      placeholder="Within last 12 months"
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-orange-500/50"
                      value={formData.recentIssues}
                      onChange={e => setFormData(prev => ({ ...prev, recentIssues: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 🟡 SECTION 3: HELPFUL */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-yellow-500/20 bg-yellow-500/[0.01]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-500">3. Helpful Context</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-xs uppercase font-bold tracking-widest text-white/40">Emergency Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/40" />
                    <Input 
                      id="contact"
                      required
                      placeholder="+1 555-0199"
                      className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-yellow-500/50"
                      value={formData.emergencyContact}
                      onChange={e => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-xs uppercase font-bold tracking-widest text-white/40">Age</Label>
                    <Input 
                      id="age"
                      type="number"
                      placeholder="25"
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-yellow-500/50"
                      value={formData.age}
                      onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-xs uppercase font-bold tracking-widest text-white/40">Gender</Label>
                    <select 
                      id="gender"
                      className="w-full px-4 bg-white/5 border border-white/10 h-12 rounded-xl focus:border-yellow-500/50 appearance-none text-sm text-white"
                      value={formData.gender}
                      onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="" disabled className="bg-black text-white/40">Select</option>
                      {genders.map(g => (
                        <option key={g} value={g} className="bg-black text-white">{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hosp" className="text-xs uppercase font-bold tracking-widest text-white/40">Primary Doctor / Hospital (Optional)</Label>
                  <Input 
                    id="hosp"
                    placeholder="e.g. Dr. Smith, Saint Jude Hospital"
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-yellow-500/50"
                    value={formData.doctorHospital}
                    onChange={e => setFormData(prev => ({ ...prev, doctorHospital: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            {/* 📁 SECTION 4: PREVIOUS REPORTS */}
            <div className="glass p-8 rounded-[2.5rem] space-y-6 border-blue-500/20 bg-blue-500/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500">4. Previous Medical Reports</h3>
                </div>
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/5">Optional</span>
              </div>

              <div className="space-y-4">
                <label className="group relative border-2 border-dashed border-white/5 hover:border-blue-500/30 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02]">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">Processing Files...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-sm font-bold text-white/60 mb-1">Drop reports here or click to browse</p>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">PDF, JPG, PNG up to 5MB each</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleReportUpload}
                    className="hidden" 
                  />
                </label>

                {formData.reports.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {formData.reports.map((report, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-white/80 truncate">{report.name}</span>
                            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">
                              {report.type.split('/')[1].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeReport(idx)}
                          className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <p className="text-[10px] text-white/20 text-center leading-relaxed">
                  Attaching previous lab results or prescriptions helps doctors understand your full clinical history faster during emergencies.
                </p>
              </div>
            </div>

            {/* Biometric Enrollment Section */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5">
              <Label className="text-xs uppercase font-bold tracking-widest text-white/40 mb-6 block text-center">Identity Enrollment</Label>
              <div className="flex flex-col items-center">
                <label className="group relative w-32 h-32 rounded-full glass border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/50 transition-all overflow-hidden">
                  {formData.image ? (
                    <img src={formData.image} alt="Biometric" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-white/20 group-hover:text-red-500/50 mb-1" />
                      <span className="text-[10px] text-white/30 group-hover:text-white/50 px-2 text-center">Add Face Scan</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
                <p className="mt-4 text-center text-[10px] text-white/20 max-w-[280px]">Secure biometric identification is used to retrieve your medical profile during emergencies.</p>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-16 rounded-3xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Verify & Complete Setup
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
