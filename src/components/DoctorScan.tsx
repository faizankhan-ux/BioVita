import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Focus, Loader2, Camera, CheckCircle2, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useMedicalIdentity, MedicalIdentity } from '../contexts/MedicalIdentityContext';

const DoctorScan = () => {
  const navigate = useNavigate();
  const { findMatch } = useMedicalIdentity();
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const [result, setResult] = useState<MedicalIdentity | null>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStep('scanning');
    
    // Simulation: 3 seconds to "match"
    setTimeout(() => {
      const match = findMatch();
      setResult(match);
      setScanStep('matched');
      setIsScanning(false);
    }, 3000);
  };

  const handleViewResult = () => {
    if (result) {
      // Small delay for effect
      setTimeout(() => {
        navigate('/doctor/result', { state: { patient: result } });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <Link to="/doctor" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
              </Link>
              <h1 className="text-4xl font-bold">Biometric Identification</h1>
              <p className="text-white/40 mt-1">Position camera to frame patient's face clearly.</p>
            </div>
            <div className="hidden md:flex items-center gap-3 glass px-4 py-2 rounded-full border-green-500/20">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Scanner Online</span>
            </div>
          </div>

          <div className="relative aspect-video glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl flex items-center justify-center bg-white/[0.02]">
            {/* Camera View Overlay */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
               <img 
                 src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=2070" 
                 alt="Camera View Mock" 
                 className="w-full h-full object-cover grayscale opacity-20"
               />
            </div>

            <AnimatePresence mode="wait">
              {scanStep === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                    <Scan className="w-24 h-24 text-white/10" />
                  </div>
                  <button 
                    onClick={handleStartScan}
                    className="px-12 py-5 rounded-3xl bg-red-600 text-white font-bold text-xl shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                  >
                    <Camera className="w-6 h-6" />
                    Initialize Scan
                  </button>
                </motion.div>
              )}

              {scanStep === 'scanning' && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 flex flex-col items-center gap-8 w-full"
                >
                  <div className="relative w-64 h-64">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-2xl" />
                    
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_#ef4444] z-20"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Focus className="w-16 h-16 text-red-500/30 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                       <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                       <span className="text-xl font-bold tracking-tighter uppercase">Analyzing Facial Markers...</span>
                    </div>
                    <span className="text-xs text-white/30 uppercase tracking-[0.3em]">Querying Sec-Bio Database</span>
                  </div>
                </motion.div>
              )}

              {scanStep === 'matched' && (
                <motion.div 
                  key="matched"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative z-10 flex flex-col items-center gap-8"
                >
                  <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">Identity Confirmed</h2>
                    <p className="text-white/60 mb-8 max-w-sm">Patient match found in BioVita Universal Medical Registry.</p>
                  </div>

                  <button 
                    onClick={handleViewResult}
                    className="px-10 py-4 border-2 border-green-500 text-green-500 rounded-full font-bold hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    View Emergency Profile
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Guidance */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass p-8 rounded-[2.5rem] border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                   <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                   <h4 className="font-bold mb-1">Authorization Active</h4>
                   <p className="text-xs text-white/40 leading-relaxed">Your medical credentials are currently active. All scan results are decryption-verified.</p>
                </div>
             </div>
             <div className="glass p-8 rounded-[2.5rem] border-white/5 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                   <Scan className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                   <h4 className="font-bold mb-1">Scanning Advice</h4>
                   <p className="text-xs text-white/40 leading-relaxed">Ensure direct lighting and clear visibility of the patient's face for maximum accuracy.</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0% }
          100% { top: 100% }
        }
      `}} />
    </div>
  );
};

export default DoctorScan;
