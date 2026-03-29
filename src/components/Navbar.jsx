import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HeartPulse, Activity, BrainCircuit, Users, Settings, Moon, Sun, Menu, X, FileDown, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({
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
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Patient Intake', path: '/intake', icon: Users },
    { name: 'Vision AI', path: '/scans', icon: BrainCircuit },
    { name: 'Clinical Chat', path: '/ai-doctor', icon: MessageSquare },
  ];

  const handleDownloadReport = () => {
    if (!patientData) {
      alert("⚠️ DATA INCOMPLETE: Please share the patient intake profile first to generate a clinical-grade report.");
      return;
    }

    onReportStart();

    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
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
                className={`relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/20 transition-all font-bold text-xs uppercase tracking-widest active:scale-95 ${reportLoading ? 'bg-blue-600/20 text-blue-500 cursor-wait' : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-700'
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
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
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all ${reportLoading ? 'text-blue-500 bg-blue-500/10 border border-blue-500/20 opacity-50 cursor-wait' : 'text-blue-700 bg-blue-500/10 border border-blue-500/20 active:scale-[0.98]'
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;