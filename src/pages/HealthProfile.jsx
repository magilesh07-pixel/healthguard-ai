import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Heart, ShieldCheck, Calendar, FileText, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';


function HealthProfile({ data }) {
  const patient = data?.vitals || {
    age: 45,
    sex: 'Male',
    weight: 78,
    height: 175,
    sysBP: 135,
    diaBP: 85,
    sugar: 105,
    familyHistory: 'Hypertension, Type 2 Diabetes',
    smoking: 'Former Smoker'
  };

  const bmi = data?.bmi || (78 / Math.pow(175 / 100, 2)).toFixed(1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-[var(--glass-border)] pb-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl">
            <User size={48} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Patient Record</h1>
            <div className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-emerald-500/20">Active Profile</span>
              <span>ID: {data ? 'PT-LIVE-ACT' : 'PT-883921'}</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={14} className="text-blue-400" /> Bio-Demographics
            </h3>
            <div className="space-y-4">
                {[
                    { label: "Full Name", value: data ? "Magilesh MB" : "Magilesh MB" },
                    { label: "Age / Gender", value: `${patient.age} / ${patient.sex}` },
                    { label: "BMI Index", value: `${bmi} (${bmi > 25 ? 'Overweight' : 'Normal'})` },
                    { label: "Blood Type", value: "A+ Positive" }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-[var(--glass-border)] last:border-0">
                        <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                        <span className="text-sm font-bold text-[var(--text-primary)]">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" /> Contact Repository
            </h3>
            <div className="space-y-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--glass-border)]">
                        <Phone size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">+1 (555) 000-1234</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--glass-border)]">
                        <Mail size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Email</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">magilesh8@gmail.com</p>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Clinical History & Vitals */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/10">
                    <Heart className="text-rose-500 mb-6" size={32} />
                    <h4 className="text-2xl font-black mb-2">Cardiac Profile</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Latest blood pressure and heart rate metrics.</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[var(--text-primary)]">{patient.sysBP}/{patient.diaBP}</span>
                        <span className="text-sm font-bold text-[var(--text-secondary)] uppercase">mmHg</span>
                    </div>
                </div>

                <div className="glass-panel p-8 bg-gradient-to-br from-indigo-600/5 to-transparent border-indigo-500/10">
                    <Activity className="text-indigo-400 mb-6" size={32} />
                    <h4 className="text-2xl font-black mb-2">Metabolic Index</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Fasting glucose and insulin sensitivity data.</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[var(--text-primary)]">{patient.sugar}</span>
                        <span className="text-sm font-bold text-[var(--text-secondary)] uppercase">mg/dL</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8">
                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-400" /> Hereditary & Lifestyle Factors
                </h3>
                
                <div className="space-y-6">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--glass-border)]">
                        <h5 className="text-sm font-black mb-3 flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-400" /> Family History
                        </h5>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                            {patient.familyHistory}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--glass-border)]">
                            <h5 className="text-sm font-black mb-3">Smoking Status</h5>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-bold uppercase tracking-widest">
                                {patient.smoking}
                            </span>
                        </div>
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--glass-border)]">
                            <h5 className="text-sm font-black mb-3">BMI Classification</h5>
                            <span className={`px-3 py-1 ${bmi > 25 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'} border rounded-lg text-xs font-bold uppercase tracking-widest`}>
                                {bmi > 30 ? 'Obese' : bmi > 25 ? 'Overweight' : 'Normal'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/scans" className="w-full glass-panel p-6 border-dashed border-2 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FileText size={20} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-[var(--text-primary)]">Clinical Document Vault</p>
                        <p className="text-xs text-[var(--text-secondary)]">Access 12 archived medical reports and lab results.</p>
                    </div>
                </div>
                <ChevronRight size={24} className="text-[var(--text-secondary)] group-hover:translate-x-1 transition-all" />
            </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HealthProfile;
