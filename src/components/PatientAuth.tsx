import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PatientAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: redirect to dashboard or register based on state
    if (isLogin) {
      navigate('/patient');
    } else {
      navigate('/patient/register');
    }
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
            className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <User size={80} />
            </div>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2">
                {isLogin ? 'PATIENT LOGIN' : 'CREATE ACCOUNT'}
              </h2>
              <p className="text-white/40 text-sm">Access your secure BioVita medical profile.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
              >
                {isLogin ? 'Sign In' : 'Get Started'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatientAuth;
