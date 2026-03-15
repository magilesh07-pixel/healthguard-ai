import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Activity, BrainCircuit, Users, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Activity },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Scan Analyzer', path: '/scans', icon: BrainCircuit },
    { name: 'Health Profile', path: '/intake', icon: Users },
  ];

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
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)] transition-all border border-transparent hover:border-[var(--glass-border)]"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="moon" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon size={20} />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Settings - Desktop only */}
          <Link
            to="/info/documentation"
            className="hidden md:flex p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg-hover)] hover:text-[var(--text-primary)] transition-all"
            title="Documentation"
          >
            <Settings size={20} />
          </Link>

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
              <div className="pt-3 mt-3 border-t border-[var(--glass-border)] flex items-center justify-between px-4">
                <span className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">M.B.Magilesh</span>
                <Link to="/info/documentation" onClick={() => setMenuOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                  <Settings size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;