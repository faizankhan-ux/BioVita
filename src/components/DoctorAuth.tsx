import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Lock, Shield, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DoctorAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/doctor');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="max-w-md w-full">
          <Link to="/portal" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Portals</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 rounded-[3rem] border-red-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500">
              <Stethoscope size={80} />
            </div>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 text-red-500 uppercase">
                {isLogin ? 'Professional Login' : 'Medical Onboarding'}
              </h2>
              <p className="text-white/40 text-sm">BioVita Professional Identity Verification.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                  <input 
                    type="text" 
                    placeholder="Medical ID / License Number" 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/30 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/40" />
                  <input 
                    type="password" 
                    placeholder="Security Credential" 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-red-500/30 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-red-500/20"
              >
                {isLogin ? 'Access Portal' : 'Register Credentials'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {isLogin ? "Institutional Access Request" : "Back to Security Login"}
              </button>
            </div>
          </motion.div>

          <div className="mt-8 glass p-6 rounded-2xl border-white/5 text-center">
             <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
               Access restricted to certified medical bodies. Unauthorized login attempts are logged and reported to national health authorities.
             </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorAuth;
