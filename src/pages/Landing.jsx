import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, BrainCircuit, ChevronRight, Stethoscope, Microscope, HeartPulse, FileText, CheckCircle2, Lock, ArrowRight, Upload, Users } from 'lucide-react';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-[var(--bg-deep)] flex flex-col font-sans overflow-x-hidden relative">
            {/* Ambient Background Mesh */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-emerald-50/60 to-blue-50/20 blur-[150px]" />
            </div>

            {/* 1. Hero Section */}
            <header className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left Typography */}
                    <div className="relative z-10 text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/50 text-slate-600 shadow-sm"
                        >
                            <Shield size={16} className="text-emerald-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Enterprise Clinical Intelligence</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 leading-[1.05]"
                        >
                            Next Generation <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">Diagnostics.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg lg:text-xl text-slate-500 max-w-lg leading-relaxed font-medium"
                        >
                            HealthGuard deploys elite neural networks to cross-reference patient intake with deep visual scan analysis, accelerating precise preventative healthcare protocols.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-5 pt-6"
                        >
                            <button
                                onClick={() => navigate('/intake')}
                                className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <Stethoscope size={20} className="text-blue-400" />
                                Initiate Protocol
                            </button>
                            <button
                                onClick={() => navigate('/scans')}
                                className="flex items-center justify-center gap-3 glass-panel px-8 py-4 rounded-2xl font-bold text-base text-slate-700 hover:text-blue-600 transition-all hover:bg-white active:scale-95"
                            >
                                <Activity size={20} />
                                Access Vision Lab
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Extrovert Visualizer - Watermark Logo Format */}
                    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
                        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />

                            {/* Large Watermark Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                                animate={{ opacity: 0.07, scale: 1, rotate: -15 }}
                                transition={{ duration: 2 }}
                                className="absolute z-0 select-none pointer-events-none"
                            >
                                <HeartPulse size={520} strokeWidth={0.5} className="text-blue-900" />
                            </motion.div>

                            {/* Central Premium Logo */}
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative z-10"
                            >
                                <div className="relative group">
                                    {/* Logo Glow */}
                                    <div className="absolute inset-0 bg-blue-600 rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

                                    {/* The Logo Card */}
                                    <div className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-[3.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center border border-white/20 shadow-[0_30px_60px_rgba(37,99,235,0.25)] overflow-hidden">
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite]" />
                                        <HeartPulse size={110} className="text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
                                    </div>

                                    {/* Floating Decorative Elements */}
                                    <motion.div
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-xl flex items-center gap-2"
                                    >
                                        <Shield size={14} className="text-blue-600" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">HealthGuard Certified</span>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 12, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute -bottom-4 -left-4 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-xl flex items-center gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">System Live</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Advanced Workflow / Pipeline */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20 border-b border-slate-200 pb-8">
                        <div>
                            <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-3 block">Operational Architecture</span>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">HealthGuard Lifecycle</h2>
                        </div>
                        <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
                            A seamless, zero-friction pipeline transforming raw patient data into verifiable clinical dossiers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 group">
                        {[
                            { step: "01", title: "Ingestion", icon: Users, desc: "Secure acquisition of patient vitals and demographic baselines." },
                            { step: "02", title: "Imaging", icon: Upload, desc: "Import high-fidelity radiology scans for visual pathology processing." },
                            { step: "03", title: "Synthesis", icon: BrainCircuit, desc: "Neural networks cross-reference inputs against massive medical datasets." },
                            { step: "04", title: "Reporting", icon: FileText, desc: "Instantaneous generation of institutional-grade health trajectories." }
                        ].map((phase, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-premium hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="absolute -top-3 -right-3 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-mono font-black text-slate-200 text-3xl rotate-12">{phase.step}</div>
                                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-blue-50 to-indigo-50/50 flex items-center justify-center text-blue-600 mb-8 border border-white shadow-sm transition-transform group-hover:scale-110">
                                    <phase.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{phase.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{phase.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Spline Analytics Engine Deep Dive */}
            <section className="py-32 bg-slate-900 rounded-[3rem] mx-4 lg:mx-12 my-12 relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.3)]">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="inline-flex py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-black uppercase tracking-widest">
                                The Multimodal Matrix
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                                Seeing what standard tests miss.
                            </h2>
                            <p className="text-slate-300 text-xl leading-relaxed">
                                Our diagnostic capability transcends basic charting. By fusing biometric risk factors with deep-segmentation visual AI, HealthGuard detects longitudinal anomalies with unparalleled precision.
                            </p>

                            <div className="space-y-6 pt-6">
                                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur px-8 py-6 rounded-2xl flex gap-6 hover:bg-white/10 transition-colors">
                                    <div className="text-blue-400 mt-1"><Activity size={28} /></div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-2">Predictive Diagnostics</h4>
                                        <p className="text-slate-400 leading-relaxed">Early-detection forecasting mapping your vitals against chronic disease trajectories.</p>
                                    </div>
                                </div>
                                <div className="glass-panel border-white/10 bg-white/5 backdrop-blur px-8 py-6 rounded-2xl flex gap-6 hover:bg-white/10 transition-colors">
                                    <div className="text-emerald-400 mt-1"><Microscope size={28} /></div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-2">Vision Pathology</h4>
                                        <p className="text-slate-400 leading-relaxed">Identifying micro-abnormalities in MRIs/Xrays before they emerge symptomatically.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Dark Visual */}
                        <div className="relative">
                            <div className="aspect-[4/3] bg-black/40 rounded-[2.5rem] border border-white/10 p-8 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
                                <HeartPulse size={80} className="text-blue-500 mb-8 z-10" />
                                <div className="flex gap-4 items-end h-24 w-full px-12 z-10">
                                    {[40, 65, 30, 85, 55, 90, 45, 75].map((height, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ height: 10 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: idx * 0.1 }}
                                            className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm"
                                        />
                                    ))}
                                </div>
                                <div className="mt-8 text-center z-10">
                                    <h5 className="text-white font-bold text-lg">Biometric Processing</h5>
                                    <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.2em] mt-1">Live Sync Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Trust & Security Layer */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Zero-Trust Patient Security Protocol</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            Medical data belongs entirely to the patient. HealthGuard implements hardware-level encryption and ephemeral processing states, ensuring no identifiable records exist unprotected.
                        </p>
                        <div className="flex gap-4">
                            <span className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">HIPAA Compliant</span>
                            <span className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">AES-256 Secured</span>
                        </div>
                    </div>

                    <div className="relative p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <Shield className="text-blue-500 mb-4" size={24} />
                            <h4 className="font-bold text-slate-900">E2E Privacy</h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">End-to-end data obfuscation before any AI ingestion.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
                            <CheckCircle2 className="text-emerald-500 mb-4" size={24} />
                            <h4 className="font-bold text-slate-900">SOC-2 Type II</h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Enterprise compliance and independent auditor verified.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Enterprise CTA */}
            <section className="py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-16 text-center shadow-premium relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl mix-blend-overlay pointer-events-none bg-white w-full h-full rounded-full" />
                        <div className="relative z-10 w-20 h-20 mx-auto bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white mb-8 border border-white/30">
                            <Shield size={36} />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Deploy elite diagnostics instantly.</h2>
                        <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto mb-12">
                            Elevate your medical foresight by initiating the HealthGuard dashboard. Your first clinical trajectory starts here.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <button onClick={() => navigate('/intake')} className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95">
                                Initialize Console <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Corporate Footer */}
            <footer className="bg-white border-t border-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                                <HeartPulse className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">HealthGuard <span className="text-blue-600">AI</span></span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-8 text-sm font-bold text-slate-500">
                            <a href="#" className="hover:text-blue-600 transition-colors">Security Protocol</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Validation</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Medical Legal</a>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            © 2026 HealthGuard AI Corporate. Verified Build.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;

