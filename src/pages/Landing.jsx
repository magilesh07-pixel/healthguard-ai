import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useInView } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Activity, BrainCircuit, ChevronRight, Zap, Sun, Moon, Database, Lock, Globe, Server, HeartPulse, Microscope, Dna, Stethoscope, FileSearch, ChartBar } from 'lucide-react';

// Immersive Background Particles Component with Constellation lines
const BackgroundParticles = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -20
        }));
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <svg className="absolute inset-0 w-full h-full opacity-20">
                {particles.map((p1, i) =>
                    particles.slice(i + 1).map((p2) => {
                        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                        if (dist < 15) {
                            return (
                                <line
                                    key={`${p1.id}-${p2.id}`}
                                    x1={`${p1.x}%`} y1={`${p1.y}%`}
                                    x2={`${p2.x}%`} y2={`${p2.y}%`}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    className="text-blue-500/30"
                                />
                            );
                        }
                        return null;
                    })
                )}
            </svg>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute bg-blue-500/20 rounded-full"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: particle.delay,
                    }}
                />
            ))}
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_100%)]"></div>
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
            {/* Core Neural Pulse */}
            <motion.div
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[100px]"
            />

            <svg className="w-[800px] h-[800px] opacity-70" viewBox="0 0 200 200">
                {/* Outer Rotating Ring */}
                <motion.circle
                    cx="100" cy="100" r="90"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeDasharray="6 12"
                    fill="none"
                    className="text-blue-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />
                {/* Secondary Counter-Rotating Ring */}
                <motion.circle
                    cx="100" cy="100" r="75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="30 120"
                    fill="none"
                    className="text-indigo-400/60"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner Data Arc */}
                <motion.path
                    d="M 40 100 A 60 60 0 0 1 160 100"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-blue-500"
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        pathLength: [0, 1, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Central Core Nodes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.circle
                        key={i}
                        cx={100 + 55 * Math.cos((angle * Math.PI) / 180)}
                        cy={100 + 55 * Math.sin((angle * Math.PI) / 180)}
                        r="2"
                        className="fill-blue-300"
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
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
        <div ref={ref} className="text-center space-y-2">
            <h4 className="text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter">
                {count}{suffix}
            </h4>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">{label}</p>
        </div>
    );
};

function Landing({ theme, toggleTheme }) {
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

            {/* Theme Toggle for Landing */}
            <div className="fixed top-8 right-8 z-50">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent-blue)] backdrop-blur-xl shadow-lg hover:border-[var(--accent-blue)] transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>
            </div>

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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-5xl"
                >
                    <div className="px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md inline-flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-[0.2em] mb-12">
                        <Zap size={16} className="animate-pulse" />
                        AI-Powered Precision Medicine
                    </div>

                    <div className="relative mb-12">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 rounded-full scale-150"
                        />

                        <h1 className="text-8xl md:text-[10rem] font-black text-[var(--text-primary)] tracking-tight leading-[0.8] mb-4">
                            Healthcare <br />
                            <span className="relative inline-block">
                                <span className="neon-gradient-text animate-gradient-flow bg-[length:200%_auto]">Redefined</span>
                                <motion.span
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 neon-gradient-text blur-[30px] -z-10 select-none"
                                >
                                    Redefined
                                </motion.span>
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-16 leading-relaxed font-medium opacity-80">
                        AI-powered early disease risk detection by analyzing multi-modal health profiles and diagnostic scans.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <button
                            onClick={() => navigate('/intake')}
                            className="px-14 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] font-black text-2xl shadow-[0_25px_60px_-12px_rgba(37,99,235,0.5)] transition-all flex items-center gap-4 active:scale-[0.96] group"
                        >
                            Start Health Analysis
                            <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform duration-500" />
                        </button>

                        <button
                            onClick={() => navigate('/scans')}
                            className="px-14 py-7 bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-[var(--glass-border)] rounded-[2rem] font-bold flex items-center gap-3 transition-all backdrop-blur-xl text-xl"
                        >
                            Run AI Health Scan
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
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">Three steps to AI-driven health insights.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 hidden md:block"></div>

                    {[
                        { icon: Stethoscope, title: "1. Data Input", desc: "Share your health profile including vitals, demographics, and medical history." },
                        { icon: Microscope, title: "2. Scan Upload", desc: "Upload blood reports, X-rays, or MRIs for deep neural analysis." },
                        { icon: BrainCircuit, title: "3. AI Analysis", desc: "Receive immediate risk predictions and clinical-grade diagnostic indicators." }
                    ].map((step, i) => (
                        <div key={i} className="glass-panel p-10 text-center space-y-6 relative bg-[var(--bg-secondary)] z-10 transition-transform hover:-translate-y-2">
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto border border-blue-500/20">
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

            {/* Previews */}
            <Section className="pb-0 overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Clinical Dashboard</h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">A unified interface for patient monitoring and diagnostic review.</p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 group-hover:bg-blue-500/30 transition-all"></div>
                    <div className="glass-panel p-4 md:p-8 rounded-[3rem] overflow-hidden border-white/10 shadow-2xl">
                        <div className="bg-[var(--bg-primary)] rounded-[2rem] min-h-[500px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            {/* Simplified UI representation */}
                            <div className="w-full flex flex-col p-12 gap-8 opacity-40 select-none">
                                <div className="flex gap-4">
                                    <div className="flex-1 h-32 bg-white/5 rounded-2xl"></div>
                                    <div className="flex-1 h-32 bg-white/5 rounded-2xl"></div>
                                    <div className="flex-1 h-32 bg-white/5 rounded-2xl"></div>
                                </div>
                                <div className="w-full h-80 bg-white/5 rounded-3xl relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Activity size={100} className="text-blue-500/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent">
                                <h4 className="text-4xl font-black mb-6">Experience the Interface</h4>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-10 py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition-all shadow-xl"
                                >
                                    Open Dashboard Preview
                                </button>
                            </div>
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

            {/* Footer CTA */}
            <Section className="text-center pt-0 pb-32">
                <div className="glass-panel py-24 px-10 relative overflow-hidden group border-blue-500/20">
                    <motion.div
                        animate={{
                            rotate: 360,
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"
                    />

                    <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight">Ready to verify <br /> your health risks?</h2>
                    <button
                        onClick={() => navigate('/intake')}
                        className="px-16 py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-3xl shadow-2xl transition-all active:scale-[0.96] hover:scale-[1.05] relative z-10"
                    >
                        Start Health Analysis
                    </button>
                </div>
            </Section>

            {/* Main Footer */}
            <footer className="relative border-t border-[var(--glass-border)] py-20 px-8 bg-[var(--bg-secondary)] overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                                <HeartPulse size={24} />
                            </div>
                            <span className="text-2xl font-black">HealthGuard <span className="text-blue-500">AI</span></span>
                        </div>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Advancing precision medicine through clinical-grade neural networks and multi-modal data analysis.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-bold text-lg mb-6 pt-2">Capabilities</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/scans">Scan Analysis</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/dashboard">Risk Forecasting</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/intake">Health Indexing</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/dashboard">Clinical Reports</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-lg mb-6 pt-2">Resources</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/security">Security Model</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/documentation">Documentation</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/api">API Protocol</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/institutional">Institutional Access</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-lg mb-6 pt-2">Legal</h5>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/privacy">Privacy Policy</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/disclaimer">Clinical Disclaimer</Link></li>
                            <li className="hover:text-blue-500 transition-colors cursor-pointer"><Link to="/info/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--text-secondary)]">
                    <p>&copy; 2026 HealthGuard AI. Designed & Developed by M.B.Magilesh.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-blue-500 transition-colors cursor-pointer">HIPAA Compliant</span>
                        <span className="hover:text-blue-500 transition-colors cursor-pointer">GDPR Certified</span>
                        <span className="hover:text-blue-500 transition-colors cursor-pointer">FDA Class II Status</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}


export default Landing;
