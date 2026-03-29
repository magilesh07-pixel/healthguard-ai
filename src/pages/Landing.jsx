import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useInView } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Activity, BrainCircuit, ChevronRight, Zap, Sun, Moon, Database, Lock, Globe, Server, HeartPulse, Microscope, Dna, Stethoscope, FileSearch, ChartBar, MessageSquare, FileDown } from 'lucide-react';

// Immersive Background Particles Component with Constellation lines
const BackgroundParticles = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Fine Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            
            {/* Linear Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-light)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-light)_1px,transparent_1px)] bg-[size:120px_120px] opacity-30"></div>

            {/* Floating Clinical Nodes */}
            <div className="absolute inset-0 overflow-hidden">
                {[
                  { Icon: Activity, size: 24, top: '15%', left: '10%', delay: 0 },
                  { Icon: BrainCircuit, size: 32, top: '25%', left: '85%', delay: 2 },
                  { Icon: HeartPulse, size: 20, top: '70%', left: '15%', delay: 1.5 },
                  { Icon: Dna, size: 28, top: '80%', left: '75%', delay: 3 },
                  { Icon: Microscope, size: 22, top: '10%', left: '60%', delay: 4 },
                ].map(({ Icon, size, top, left, delay }, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                            opacity: [0.05, 0.15, 0.05],
                            y: [0, -40, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ 
                            duration: 10 + Math.random() * 5, 
                            repeat: Infinity, 
                            delay,
                            ease: "easeInOut"
                        }}
                        style={{ top, left, position: 'absolute' }}
                        className="text-[var(--accent-indigo)]"
                    >
                        <Icon size={size} strokeWidth={1} />
                    </motion.div>
                ))}
            </div>

            {/* Gradient Radial Fades */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--accent-indigo-glow)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,var(--accent-emerald-glow)_0%,transparent_50%)]"></div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-multiply"></div>

            {/* Scanning Blueprint Lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`h-${i}`}
                        className="absolute w-full h-[1px] bg-[var(--accent-indigo)] opacity-[0.05]"
                        initial={{ top: `${20 + i * 30}%`, left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ 
                            duration: 15 + i * 5, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: i * 2 
                        }}
                    />
                ))}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`v-${i}`}
                        className="absolute h-full w-[1px] bg-[var(--accent-emerald)] opacity-[0.05]"
                        initial={{ left: `${30 + i * 25}%`, top: '-100%' }}
                        animate={{ top: '100%' }}
                        transition={{ 
                            duration: 20 + i * 4, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: i * 3 
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const Section = ({ children, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`py-32 px-6 max-w-7xl mx-auto w-full relative z-10 ${className}`}
        >
            {children}
        </motion.section>
    );
};

const NeuralIris = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            {/* Core Neural Pulse - Multi-layered */}
            <motion.div
                animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-[var(--accent-indigo-glow)] rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 0.9, 1.2],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute w-[800px] h-[800px] bg-[var(--accent-emerald-glow)] rounded-full blur-[150px]"
            />

            <svg className="w-[1000px] h-[1000px] opacity-20 lg:opacity-30" viewBox="0 0 200 200">
                {/* Outer Rotating Ring */}
                <motion.circle
                    cx="100" cy="100" r="95"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="4 8"
                    fill="none"
                    className="text-[var(--accent-indigo)]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                    cx="100" cy="100" r="85"
                    stroke="currentColor"
                    strokeWidth="0.3"
                    strokeDasharray="1 10"
                    fill="none"
                    className="text-[var(--accent-emerald)]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                />
                {/* Secondary Counter-Rotating Ring */}
                <motion.circle
                    cx="100" cy="100" r="75"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="20 100"
                    fill="none"
                    className="text-[var(--accent-indigo)]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Data Arcs */}
                <motion.path
                    d="M 50 100 A 50 50 0 0 1 150 100"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    className="text-[var(--accent-indigo)]"
                    animate={{
                        opacity: [0, 0.5, 0],
                        pathLength: [0, 1, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Central Nodes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.circle
                        key={i}
                        cx={100 + 65 * Math.cos((angle * Math.PI) / 180)}
                        cy={100 + 65 * Math.sin((angle * Math.PI) / 180)}
                        r="1"
                        className="fill-[var(--accent-indigo)]"
                        animate={{
                            opacity: [0.1, 0.6, 0.1],
                            scale: [1, 2, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    />
                ))}
            </svg>
        </div>
    );
};

const MetricCounter = ({ value, label, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            const stepTime = Math.abs(Math.floor(duration / end));

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start >= end) clearInterval(timer);
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-left border-l border-[var(--border-medium)] pl-8 space-y-2">
            <h4 className="text-4xl md:text-6xl font-bold text-[var(--text-high-contrast)] tracking-tighter">
                {count}{suffix}
            </h4>
            <p className="text-[var(--text-tertiary)] font-medium uppercase tracking-[0.2em] text-[10px]">{label}</p>
        </div>
    );
};

function Landing() {
    const navigate = useNavigate();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX / window.innerWidth - 0.5) * 60;
        const moveY = (clientY / window.innerHeight - 0.5) * 60;
        mouseX.set(moveX);
        mouseY.set(moveY);
    };

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    return (
        <div
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full bg-[var(--bg-primary)] scroll-smooth overflow-x-hidden"
        >
            <BackgroundParticles />


            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <NeuralIris />

                {/* Parallax Orbs */}
                <motion.div
                    style={{ x: springX, y: springY }}
                    className="absolute inset-0 pointer-events-none z-0"
                >
                    <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-[var(--orb-1)] rounded-full blur-[120px] opacity-40"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[var(--orb-2)] rounded-full blur-[120px] opacity-30"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-5xl"
                >
                    <div className="px-6 py-2 rounded-full border border-[var(--border-strong)] bg-white/5 backdrop-blur-md inline-flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-12">
                        <Activity size={14} className="animate-pulse" />
                        Next-Generation Clinical Framework
                    </div>
                    <br />
                    <div className="relative mb-8">
                        <h1 className="text-7xl md:text-[8rem] font-bold text-[var(--text-high-contrast)] tracking-tight leading-[0.9] mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                            HealthCare <br />
                            <span className="text-[var(--accent-indigo)] font-light italic">Redefined.</span>
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-16 leading-relaxed font-normal opacity-90">
                        Advanced predictive modeling for clinical diagnostic scans. Precision-engineered for institutional reliability and early disease detection.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => navigate('/intake')}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-lg px-12 py-5 rounded-2xl font-black flex items-center gap-3 shadow-2xl transition-all active:scale-95"
                        >
                            Patient Portal
                            <ChevronRight size={20} />
                        </button>

                        <button
                            onClick={() => navigate('/scans')}
                            className="px-12 py-5 bg-slate-800/40 hover:bg-slate-700/60 text-white border border-[var(--border-medium)] rounded-2xl font-black flex items-center gap-3 transition-all backdrop-blur-xl text-lg active:scale-95"
                        >
                            <BrainCircuit size={20} className="text-blue-400" />
                            Vision AI Lab
                        </button>
                    </div>
                </motion.div>
            </section>

            <Section className="border-t border-[var(--glass-border)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                    <MetricCounter value="125" suffix="k+" label="Clinical Cases Analyzed" />
                    <MetricCounter value="99" suffix=".2%" label="Early Detection Accuracy" />
                    <MetricCounter value="50" suffix="+" label="Supported Scan Types" />
                </div>
            </Section>

            {/* How it Works */}
            <Section id="how-it-works" className="bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">How HealthGuard Works</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Five steps to AI-driven health insights.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 hidden lg:block"></div>

                    {[
                        { icon: Stethoscope, title: "1. Data Input", desc: "Share your health profile including vitals, demographics, and medical history.", color: "blue" },
                        { icon: Microscope, title: "2. Scan Upload", desc: "Upload blood reports, X-rays, or MRIs for deep neural analysis.", color: "indigo" },
                        { icon: BrainCircuit, title: "3. AI Analysis", desc: "Receive immediate risk predictions and clinical-grade diagnostic indicators.", color: "violet" },
                        { icon: MessageSquare, title: "4. AI Doctor", desc: "Consult Dr. M.B.Magilesh — our AI physician — for personalized health guidance and answers.", color: "cyan" },
                        { icon: FileDown, title: "5. Clinical Report", desc: "Download a professionally formatted PDF report of your complete health analysis.", color: "emerald" },
                    ].map((step, i) => (
                        <div key={i} className={`glass-panel p-10 text-center space-y-6 relative bg-[var(--bg-secondary)] z-10 transition-transform hover:-translate-y-2`}>
                            <div className={`w-20 h-20 rounded-full bg-${step.color}-500/10 flex items-center justify-center text-${step.color}-400 mx-auto border border-${step.color}-500/20`}>
                                <step.icon size={40} />
                            </div>
                            <h3 className="text-2xl font-black">{step.title}</h3>
                            <p className="text-[var(--text-secondary)]">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Technology Stack */}
            <Section className="bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">The Intelligence Stack</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Our multi-layered neural architecture provides a unified view of patient health.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel p-10 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Microscope size={40} />
                        </div>
                        <h3 className="text-2xl font-black">Scan Analysis</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">Deep learning analysis of clinical imaging with sub-millimeter anomaly detection.</p>
                        <ul className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                            <li className="flex items-center gap-2 text-sm text-blue-400 font-bold"><FileSearch size={14} /> Automated Classification</li>
                            <li className="flex items-center gap-2 text-sm text-blue-400 font-bold"><Zap size={14} /> Real-time segmentation</li>
                        </ul>
                    </div>

                    <div className="glass-panel p-10 space-y-6 border-blue-500/30">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <HeartPulse size={40} />
                        </div>
                        <h3 className="text-2xl font-black">Health Profile Analysis</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">Longitudinal biomarker tracking to forecast systemic risks before clinical presentation.</p>
                        <ul className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                            <li className="flex items-center gap-2 text-sm text-indigo-400 font-bold"><ChartBar size={14} /> Risk trajectory modeling</li>
                            <li className="flex items-center gap-2 text-sm text-indigo-400 font-bold"><Zap size={14} /> Demographic Correlation</li>
                        </ul>
                    </div>

                    <div className="glass-panel p-10 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Dna size={40} />
                        </div>
                        <h3 className="text-2xl font-black">AI Risk Prediction</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">Advanced algorithms predicting cardiovascular, diabetic, and respiratory risk factors.</p>
                        <ul className="space-y-3 pt-4 border-t border-[var(--glass-border)]">
                            <li className="flex items-center gap-2 text-sm text-emerald-400 font-bold"><Shield size={14} /> Early Indicator Alerts</li>
                            <li className="flex items-center gap-2 text-sm text-emerald-400 font-bold"><Zap size={14} /> Clinical Validation</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Demo Video Section */}
            <Section className="pb-0 overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">See It In Action</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Watch a live demonstration of patient intake and AI-generated health analysis.</p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 group-hover:bg-blue-500/30 transition-all"></div>
                    <div className="glass-panel p-4 md:p-6 rounded-[3rem] overflow-hidden border-white/10 shadow-2xl">
                        <div className="rounded-[2rem] overflow-hidden bg-black relative">
                            {/* macOS-style window dots */}
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>

                            {/* 16:9 Aspect Ratio Wrapper */}
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <video
                                    className="absolute inset-0 w-full h-full rounded-[2rem] object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                >
                                    <source src="/demo.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 px-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Demo — Patient Intake + AI Risk Analysis
                            </div>
                            <button
                                onClick={() => navigate('/intake')}
                                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                            >
                                Try it yourself <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </Section>


            {/* Trust & Security */}
            <Section>
                <div className="flex flex-col md:flex-row gap-20 items-center">
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none">Clinical Grade <br /> <span className="text-blue-500">Security Built-in</span></h2>
                            <p className="text-xl text-[var(--text-secondary)]">We adhere to the most rigorous institutional standards to safeguard patient autonomy and data integrity.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                                <Lock className="text-blue-500" />
                                <div>
                                    <h5 className="font-bold">AES-256 Vault</h5>
                                    <p className="text-xs text-[var(--text-secondary)]">Military-grade encryption</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Globe className="text-blue-500" />
                                <div>
                                    <h5 className="font-bold">Global Compliance</h5>
                                    <p className="text-xs text-[var(--text-secondary)]">HIPAA, GDPR, SOC2</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Shield className="text-blue-500" />
                                <div>
                                    <h5 className="font-bold">Auditability</h5>
                                    <p className="text-xs text-[var(--text-secondary)]">Full chain of custody</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Server className="text-blue-500" />
                                <div>
                                    <h5 className="font-bold">Zero-Trust</h5>
                                    <p className="text-xs text-[var(--text-secondary)]">Edge-based processing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex items-center justify-center">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping"></div>
                            <div className="absolute inset-4 border-2 border-dashed border-blue-500/20 rounded-full animate-spin-slow"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield size={120} className="text-blue-500/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>


            {/* Main Footer */}
            <footer className="relative border-t border-[var(--border-medium)] py-20 px-8 bg-[var(--bg-surface)] overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                                <HeartPulse size={24} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">HealthGuard <span className="text-[var(--text-tertiary)] font-light">PRO</span></span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            Advancing precision medicine through institutional-grade neural architectures and multimodal diagnostic analysis.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-semibold text-sm uppercase tracking-widest mb-6 pt-2">Operational</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/scans">Vision AI</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/dashboard">Predictive Risk</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/intake">Clinical Intake</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/ai-doctor">AI Doctor</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/dashboard">Clinical Report</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold text-sm uppercase tracking-widest mb-6 pt-2">Resources</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/security">Security Protcol</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/documentation">Documentation</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/institutional">Institutional</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold text-sm uppercase tracking-widest mb-6 pt-2">Infrastrcuture</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/api">API Access</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/privacy">Data Privacy</Link></li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer"><Link to="/info/disclaimer">Clinical Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--border-medium)] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                    <p>&copy; 2026 HealthGuard AI. Technical Lead: Magilesh MB.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-emerald-400 transition-colors cursor-pointer">HIPAA READY</span>
                        <span className="hover:text-emerald-400 transition-colors cursor-pointer">GDPR COMPLIANT</span>
                        <span className="hover:text-emerald-400 transition-colors cursor-pointer">SOP-2 VALIDATED</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}


export default Landing;
