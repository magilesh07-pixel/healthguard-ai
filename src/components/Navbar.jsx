import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HeartPulse, Activity, BrainCircuit, Users, FileDown, MessageSquare, Menu, X, Shield, Lock, User, LogOut, Wind, Microscope, Stethoscope, Eye } from 'lucide-react';
import { auth, signOut } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({
  patientData,
  reportLoading,
  onReportStart,
  user
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Clinical Intake', path: '/intake', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Vision Lab', path: '/scans', icon: Microscope },
    { name: 'Lung Lab', path: '/lungs', icon: Wind },
    { name: 'Eye Lab', path: '/eyes', icon: Eye },
    { name: 'Ask Doctor', path: '/ai-doctor', icon: Stethoscope },
  ];

  const handleDownloadReport = () => {
    if (!patientData) {
      alert("⚠️ Clinical Data Missing: Please complete patient intake to generate a certified report.");
      return;
    }

    onReportStart();
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('generate-medical-report'));
      }, 800);
    } else {
      window.dispatchEvent(new CustomEvent('generate-medical-report'));
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'pt-2' : 'pt-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
        {/* PRIMARY TOP BAR: Branding & Actions */}
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 border ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-2xl border-blue-100 shadow-premium' 
            : 'bg-white/80 backdrop-blur-xl border-blue-100/50 shadow-lg'
        }`}>
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
              <HeartPulse className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tighter text-slate-900 leading-none">
                HealthGuard <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 flex items-center gap-1">
                <Shield size={8} className="text-emerald-500" /> Secure Node
              </span>
            </div>
          </Link>

          {/* Top Action Suite */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{user.displayName || user.email.split('@')[0]}</span>
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Verified User</span>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 border border-rose-100"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 border border-slate-200"
              >
                <User size={14} />
                Login
              </button>
            )}

            <button
              onClick={handleDownloadReport}
              disabled={reportLoading}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 ${
                reportLoading 
                  ? 'bg-blue-200 text-blue-500 cursor-wait' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
              }`}
            >
              {reportLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileDown size={14} className="sm:w-4 sm:h-4" />
              )}
              {reportLoading ? '...' : 'Report'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* SECONDARY FEATURE BAR: Tool Navigation */}
        <div className="hidden lg:flex justify-center">
          <div className={`flex items-center gap-1 p-1.5 rounded-2xl border transition-all duration-500 ${
            scrolled 
              ? 'bg-white/90 backdrop-blur-2xl border-blue-100 shadow-lg scale-95' 
              : 'bg-white/60 backdrop-blur-xl border-blue-100/30 shadow-md'
          }`}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-700' 
                      : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navGlowActive"
                      className="absolute inset-0 bg-white border border-blue-100/50 rounded-xl shadow-sm z-[-1]"
                    />
                  )}
                </Link>
              );
            })}
        </div>
      </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="md:hidden mt-3 p-4 bg-indigo-900 border border-indigo-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-tight transition-all ${
                        isActive ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
                      }`}
                    >
                      <link.icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;