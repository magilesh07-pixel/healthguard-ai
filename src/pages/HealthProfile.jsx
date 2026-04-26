import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Heart, ShieldCheck, Calendar, FileText, ChevronRight, MapPin, Phone, Mail, Shield, Stethoscope } from 'lucide-react';
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
      className="pb-20 max-w-7xl mx-auto px-6 pt-32"
    >
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Electronic Health Record</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Patient <span className="text-blue-600">Dossier</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">
             Centralized demographic and vitals repository for comprehensive clinical oversight.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Stethoscope size={16} className="text-blue-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Record Status</span>
                 <span className="text-sm font-bold text-emerald-600 mt-1">Verified Active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-panel p-8 space-y-8 bg-slate-900 text-white shadow-premium border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
               <User size={160} />
            </div>
            <div className="relative z-10 flex items-center gap-6">
               <div className="w-20 h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <User size={36} />
               </div>
               <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">{patient.name || "Magilesh MB"}</h2>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {data ? 'PT-LIVE-ACT' : 'PT-883921'}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                {[
                    { label: "Age / Gender", value: `${patient.age} / ${patient.sex}` },
                    { label: "BMI Index", value: `${bmi} (${bmi > 25 ? 'Overweight' : 'Normal'})` },
                    { label: "Blood Type", value: "A+ Positive" }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                        <span className="text-sm font-bold text-white">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" /> Contact Repository
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="text-slate-400"><Phone size={16}/></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">+1 (555) 000-1234</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="text-slate-400"><Mail size={16}/></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">magilesh8@gmail.com</span>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Clinical History & Vitals */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 border-t-4 border-rose-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                       <Heart size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Cardiac Profile</h4>
                        <div>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{patient.sysBP}/{patient.diaBP}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">mmHg (Hemodynamics)</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 border-t-4 border-indigo-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                       <Activity size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Metabolic Index</h4>
                        <div>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{patient.sugar}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">mg/dL (Glycemic Load)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                       <ShieldCheck size={18} />
                    </div>
                    Hereditary & Lifestyle Factors
                </h3>
                
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> Family History Node
                        </h5>
                        <p className="text-slate-900 font-medium text-lg leading-relaxed">
                            {patient.familyHistory}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smoking Status</span>
                            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {patient.smoking}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BMI Status</span>
                            <span className={`px-3 py-1.5 ${bmi > 25 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} border rounded-lg text-[10px] font-black uppercase tracking-widest`}>
                                {bmi > 30 ? 'Obese' : bmi > 25 ? 'Overweight' : 'Normal'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/scans" className="w-full glass-panel p-8 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                        <FileText size={20} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-900 mb-1">Clinical Document Vault</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access archived medical reports</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-blue-200 transition-all">
                   <ChevronRight size={18} className="text-blue-600 ml-0.5" />
                </div>
            </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HealthProfile;
