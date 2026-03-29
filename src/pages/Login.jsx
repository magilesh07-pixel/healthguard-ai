import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, HeartPulse, Globe, ExternalLink } from 'lucide-react';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Authenication failed');
      
      if (isLogin) {
        onLogin(result.user);
      } else {
        setIsLogin(true);
        setError('Verification successful! You can now access the clinical portal.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex overflow-hidden lg:-m-6">
      {/* Left: Artistic/Info Side */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--glass-border)]">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">HealthGuard AI</span>
        </div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black leading-tight text-[var(--text-primary)] mb-6"
          >
            The Future of <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Predictive Medicine
            </span>
          </motion.h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
            Harness the power of meta-llama/llama-4-scout-17b for real-time clinical diagnostics and personalized health monitoring.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-[var(--glass-border)] pt-8">
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">99.2%</div>
            <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] mt-1">Accuracy Rate</div>
          </div>
          <div className="w-[1px] h-8 bg-[var(--glass-border)]" />
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">256-bit</div>
            <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] mt-1">AES Encryption</div>
          </div>
        </div>

        <div className="absolute inset-0 z-0">
          <img 
            src="/clinical_login_hero.png" 
            className="w-full h-full object-cover opacity-40 mix-blend-lighten scale-110" 
            alt="Clinical Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        </div>
      </div>

      {/* Right: Login Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--bg-secondary)]/30">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                 <ShieldCheck size={24} />
               </div>
               <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">HealthGuard AI</span>
             </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              {isLogin ? 'Clinical Access' : 'Register Institution'}
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              {isLogin ? "Welcome back. Access patient dashboards." : "Join the global network of health data security."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Registrant Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--bg-primary)] border-2 border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all font-medium"
                    placeholder="Dr. John Grayson"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Clinical Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border-2 border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="name@institution.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Private Password</label>
                {isLogin && <button type="button" className="text-xs text-blue-500 hover:underline font-bold">Forgot Access?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[var(--bg-primary)] border-2 border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-[var(--text-secondary)] cursor-pointer select-none">Remember this device for 30 days</label>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                    error.includes('successful') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${error.includes('successful') ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Validating Clinical Keys...' : (isLogin ? 'Grant Access' : 'Initialize Account')}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-6 border-t border-[var(--glass-border)] flex flex-col gap-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
            >
              {isLogin ? "New user? Apply for institutional credentials" : "Already registered? Protocol sign-in"}
            </button>
            
            <div className="flex items-center justify-center gap-6 mt-2 opacity-50 grayscale hover:grayscale-0 transition-all">
              <span className="text-[10px] uppercase tracking-tighter text-[var(--text-tertiary)] flex items-center gap-1"><Globe size={10} /> HIPAA Compliance</span>
              <span className="text-[10px] uppercase tracking-tighter text-[var(--text-tertiary)] flex items-center gap-1"><ShieldCheck size={10} /> SOC2 Type II</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Link */}
        <div className="mt-auto pt-8 flex items-center gap-6 text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-1">Help Center <ExternalLink size={12}/></a>
        </div>
      </div>
    </div>
  );
}

export default Login;
