import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HeartPulse, Activity, BrainCircuit, Users, FileDown, MessageSquare, Menu, X, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({
  patientData,
  reportLoading,
  onReportStart
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
    { name: 'Analytics', path: '/dashboard', icon: Activity },
    { name: 'Clinical Intake', path: '/intake', icon: Users },
    { name: 'Vision AI', path: '/scans', icon: BrainCircuit },
    { name: 'MD Consult', path: '/ai-doctor', icon: MessageSquare },
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
      scrolled ? 'py-3' : 'py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 border ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-2xl border-blue-100 shadow-premium' 
            : 'bg-indigo-50/80 backdrop-blur-xl border-indigo-100/50 shadow-lg'
        }`}>
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-slate-900 leading-none">
                HealthGuard <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 flex items-center gap-1">
                <Shield size={8} className="text-emerald-500" /> Secure Clinical Node
              </span>
            </div>
          </Link>

          {/* Institutional Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-200/40 p-1 rounded-xl border border-slate-200/50">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navGlow"
                      className="absolute inset-0 bg-white border border-slate-200/60 rounded-lg shadow-sm z-[-1]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Suite */}
          <div className="flex items-center gap-3">


            <button
              onClick={handleDownloadReport}
              disabled={reportLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
                reportLoading 
                  ? 'bg-blue-200 text-blue-500 cursor-wait' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700'
              }`}
            >
              {reportLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileDown size={16} />
              )}
              {reportLoading ? 'Processing' : 'Gen-Report'}
            </button>

            {/* Mobile Interface */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
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