import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HeartPulse, Activity, BrainCircuit, Users, Settings, Moon, Sun, Menu, X, FileDown, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ 
  theme, 
  toggleTheme, 
  patientData, 
  reportLoading, 
  onReportStart,
  privacyMode,
  togglePrivacyMode
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: HeartPulse },
    { name: 'Patient Intake', path: '/intake', icon: Users },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Scan', path: '/scans', icon: BrainCircuit },
    { name: 'AI Doctor', path: '/ai-doctor', icon: MessageSquare },
  ];

  const handleDownloadReport = () => {
    if (!patientData) {
      alert("⚠️ DATA INCOMPLETE: Please share the patient intake profile first to generate a clinical-grade report.");
      return;
    }

    onReportStart();

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      // Give a moment for the dashboard to mount
      setTimeout(() => {
        const event = new CustomEvent('generate-medical-report');
        window.dispatchEvent(event);
      }, 800);
    } else {
      const event = new CustomEvent('generate-medical-report');
      window.dispatchEvent(event);
    }
  };

  return (
    <nav className="bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] sticky top-0 z-50 transition-colors duration-500">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)] group-hover:scale-110 transition-transform">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] leading-none">
              HealthGuard <span className="text-cyan-400">AI</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none">System Secure</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex bg-[var(--bg-secondary)] rounded-full p-1 border border-[var(--glass-border)] backdrop-blur-md transition-colors duration-500">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-[var(--text-secondary)]'}`} />
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="navTab"
                    className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-full z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          
          <button
            onClick={handleDownloadReport}
            disabled={reportLoading}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/20 transition-all font-bold text-xs uppercase tracking-widest active:scale-95 ${
              reportLoading ? 'bg-blue-600/20 text-blue-300 cursor-wait' : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400'
            }`}
            title="Download Clinical Report"
          >
            {reportLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span>Report</span>
              </>
            )}
          </button>

          {/* Settings / Theme Dropdown */}
          <div className="relative group/settings">
            <button
              className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)] transition-all border border-transparent hover:border-[var(--glass-border)]"
              title="Settings & Appearance"
            >
              <Settings size={20} className="group-hover/settings:rotate-90 transition-transform duration-500" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover/settings:opacity-100 group-hover/settings:visible transition-all duration-300 z-50">
              <div className="glass-panel p-2 shadow-2xl border border-[var(--glass-border)] bg-[var(--bg-surface)]">
                <div className="px-3 py-2 border-b border-[var(--glass-border)] mb-1">
                  <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Preferences</span>
                </div>
                
                {/* Theme Toggle within dropdown */}
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-[var(--text-primary)] transition-all group/item"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-400" />}
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <div className="w-8 h-4 bg-[var(--border-medium)] rounded-full relative transition-colors group-hover/item:bg-blue-500/30">
                     <motion.div 
                        animate={{ x: theme === 'dark' ? 16 : 0 }}
                        className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"
                     />
                  </div>
                </button>

                <button 
                  onClick={togglePrivacyMode}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-[var(--text-primary)] transition-all group/item"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className={privacyMode ? "text-emerald-400" : "text-gray-400"} />
                    <span>Privacy Mode</span>
                  </div>
                  <div className={`w-8 h-4 ${privacyMode ? 'bg-emerald-500/30' : 'bg-[var(--border-medium)]'} rounded-full relative transition-colors`}>
                     <motion.div 
                        animate={{ x: privacyMode ? 16 : 0 }}
                        className={`absolute top-1 left-1 w-2 h-2 ${privacyMode ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full`}
                     />
                  </div>
                </button>

                <div className="h-[1px] bg-[var(--glass-border)] my-1" />

                <Link 
                  to="/info/documentation"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-[var(--text-primary)] transition-all"
                >
                  <Settings size={18} />
                  <span>System Config</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Avatar - Desktop only */}
          <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 p-[1px]">
            <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
              M
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] transition-all"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-[var(--glass-border)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-500/10 text-[var(--text-primary)] border border-blue-500/20'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-[var(--text-secondary)]'}`} />
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Report Download */}
              <button
                onClick={() => {
                  if (!reportLoading) {
                    handleDownloadReport();
                    setMenuOpen(false);
                  }
                }}
                disabled={reportLoading}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all ${
                   reportLoading ? 'text-blue-300 bg-blue-500/10 border border-blue-500/20 opacity-50 cursor-wait' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20 active:scale-[0.98]'
                }`}
              >
                {reportLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Report...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={20} />
                    <span>Download Report</span>
                  </>
                )}
              </button>

              <div className="pt-3 mt-3 border-t border-[var(--glass-border)] space-y-4 px-4 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em]">Appearance</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleTheme}
                      className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-2 text-xs font-bold"
                    >
                      {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                      {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={togglePrivacyMode}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-bold ${privacyMode ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>Privacy Mode</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Disguise sensitive data</span>
                  </div>
                  <div className={`w-10 h-5 ${privacyMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-gray-500/10 border-gray-500/20'} rounded-full relative border transition-colors`}>
                     <motion.div 
                        animate={{ x: privacyMode ? 20 : 0 }}
                        className={`absolute top-1 left-1 w-3 h-3 ${privacyMode ? 'bg-emerald-500' : 'bg-gray-500'} rounded-full`}
                     />
                  </div>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <Link to="/info/documentation" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Settings size={16} />
                    System Configuration
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;