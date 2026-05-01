import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, HeartPulse, ChevronRight, Chrome, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from '../firebase';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isLogin) {
        // Sign In logic
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/intake');
      } else {
        // Sign Up logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Send email verification
        await sendEmailVerification(userCredential.user);
        setSuccess("A verification email has been sent to " + email + ". Please verify your email to proceed.");
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/intake');
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="glass-panel p-8 lg:p-10 bg-white/80 backdrop-blur-2xl border-t-4 border-t-blue-600 shadow-premium rounded-[2.5rem]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
              <HeartPulse size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {isLogin ? 'Access your clinical health dashboard.' : 'Join the global HealthGuard AI network.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute text-slate-400" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '60px' }}
                  className="w-full pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium outline-none"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute text-slate-400" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }} size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '60px' }}
                className="w-full pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute text-slate-400" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }} size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '60px' }}
                className="w-full pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium outline-none"
                required
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-tight">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Register Now'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50 shadow-sm active:scale-95 flex items-center justify-center gap-3"
          >
            <Chrome size={18} className="text-blue-500" />
            Google Account
          </button>

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-blue-600 underline underline-offset-4 decoration-blue-600/30">
                {isLogin ? 'Sign Up' : 'Log In'}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
           <ShieldCheck size={14} className="text-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption Enabled</span>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
