import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, HeartPulse, Brain, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskChart from '../components/RiskChart';

function Home({ data, theme }) {
  // Use real data if available, otherwise use mock data
  const healthScore = data?.aiResult?.riskScore || 82;
  const age = data?.vitals?.age || 45;
  const gender = data?.vitals?.sex || 'Male';
  const bmi = data?.bmi || 26.4;
  const smoking = data?.vitals?.smoking || 'Former Smoker';
  const sysBP = data?.vitals?.sysBP || 135;
  const diaBP = data?.vitals?.diaBP || 85;

  const calculateCardioRisk = () => {
    let risk = 5;
    if (sysBP > 140) risk += 15;
    else if (sysBP > 130) risk += 8;
    if (smoking.toLowerCase().includes('current')) risk += 12;
    if (age > 60) risk += 10;
    else if (age > 45) risk += 5;
    return Math.min(risk, 99);
  };

  const calculateMetabolicRisk = () => {
    let risk = 8;
    if (data?.vitals?.sugar > 140) risk += 20;
    else if (data?.vitals?.sugar > 100) risk += 10;
    if (bmi > 30) risk += 15;
    else if (bmi > 25) risk += 7;
    return Math.min(risk, 99);
  };

  const calculateNeuroRisk = () => {
    let risk = 3;
    if (sysBP > 150) risk += 20;
    if (age > 65) risk += 10;
    if (smoking.toLowerCase().includes('heavy')) risk += 10;
    return Math.min(risk, 99);
  };

  const cardioRisk = data ? calculateCardioRisk() : 21;
  const metabolicRisk = data ? calculateMetabolicRisk() : 18;
  const neuroRisk = data ? calculateNeuroRisk() : 5;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-12"
    >
      <motion.header variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Risk Intelligence Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {data ? `Real-time analysis for Patient ${data.vitals.age}${data.vitals.sex[0].toUpperCase()}` : "Real-time preventive health monitoring and risk assessment."}
          </p>
        </div>
        {data && (
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-full">
             <ShieldAlert size={14} />
             LIVE DATA ACTIVE
           </div>
        )}
      </motion.header>
      
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(99, 102, 241, 0.2)' }}
          className="glass-panel p-5 relative overflow-hidden group cursor-default"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <HeartPulse size={64} className="text-emerald-500" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Overall Health Score</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold neon-gradient-text">{healthScore}</span>
            <span className="text-sm font-medium text-emerald-400">/ 100</span>
          </div>
          <div className={`mt-4 flex items-center text-[10px] font-bold uppercase tracking-tighter w-fit px-2 py-1 rounded ${healthScore > 50 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
            <Activity size={10} className="mr-1" />
            {healthScore > 50 ? 'Action required' : 'Stable condition'}
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(244, 63, 94, 0.2)' }}
          className="glass-panel p-5 border-l-4 border-l-rose-500 relative overflow-hidden group cursor-default"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert size={64} className="text-rose-500" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Cardiovascular Risk</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[var(--text-primary)]">{cardioRisk}<span className="text-2xl text-[var(--text-secondary)]">%</span></span>
          </div>
          <div className={`mt-4 flex items-center text-[10px] font-bold uppercase tracking-tighter w-fit px-2 py-1 rounded text-xs ${cardioRisk > 20 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
            {cardioRisk > 20 ? 'Elevated' : 'Low Risk'}
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(245, 158, 11, 0.2)' }}
          className="glass-panel p-5 border-l-4 border-l-amber-500 relative overflow-hidden group cursor-default"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={64} className="text-amber-500" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Metabolic Risk</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[var(--text-primary)]">{metabolicRisk}<span className="text-2xl text-[var(--text-secondary)]">%</span></span>
          </div>
          <div className={`mt-4 flex items-center text-[10px] font-bold uppercase tracking-tighter w-fit px-2 py-1 rounded ${metabolicRisk > 20 ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
            {metabolicRisk > 20 ? 'High' : 'Moderate'}
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)' }}
          className="glass-panel p-5 border-l-4 border-l-blue-500 relative overflow-hidden group cursor-default"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Brain size={64} className="text-blue-500" />
          </div>
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Neurological Risk</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[var(--text-primary)]">{neuroRisk}<span className="text-2xl text-[var(--text-secondary)]">%</span></span>
          </div>
          <div className={`mt-4 flex items-center text-[10px] font-bold uppercase tracking-tighter w-fit px-2 py-1 rounded ${neuroRisk > 10 ? 'text-amber-400 bg-amber-500/10' : 'text-blue-400 bg-blue-500/10'}`}>
            {neuroRisk > 10 ? 'Monitor' : 'Low Risk'}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide">Disease Risk Analytics</h2>
           </div>
           
           <div className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-2">
              <RiskChart newDataPoint={data?.aiResult?.riskScore} theme={theme} />
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6">
           <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide mb-6">Patient Profile</h2>
           
           <div className="space-y-4">
             <div className="flex justify-between pb-3 border-b border-[var(--glass-border)]">
               <span className="text-[var(--text-secondary)] text-sm">Patient ID</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">{data ? 'PT-LIVE-ACT' : 'PT-883921'}</span>
             </div>
             <div className="flex justify-between pb-3 border-b border-[var(--glass-border)]">
               <span className="text-[var(--text-secondary)] text-sm">Age / Gender</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">{age} / {gender}</span>
             </div>
             <div className="flex justify-between pb-3 border-b border-[var(--glass-border)]">
               <span className="text-[var(--text-secondary)] text-sm">BMI</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">
                 {bmi} <span className={bmi > 25 ? 'text-amber-400' : 'text-emerald-400'}>
                   ({bmi > 30 ? 'Obese' : bmi > 25 ? 'Overweight' : 'Normal'})
                 </span>
               </span>
             </div>
             <div className="flex justify-between pb-3 border-b border-[var(--glass-border)]">
               <span className="text-[var(--text-secondary)] text-sm">Habits</span>
               <span className="text-[var(--text-primary)] font-medium text-sm uppercase">{smoking}</span>
             </div>
           </div>

           <div className="mt-8">
             <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Latest Vitals</h3>
             
             <div className="space-y-3">
                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--glass-border)] flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-rose-500/20 text-rose-500 flex items-center justify-center">
                       <HeartPulse size={16} />
                     </div>
                     <span className="text-sm text-[var(--text-secondary)]">Blood Pressure</span>
                   </div>
                   <span className={`font-bold ${sysBP > 140 ? 'text-rose-400' : 'text-emerald-400'}`}>{sysBP}/{diaBP}</span>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--glass-border)] flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
                       <Activity size={16} />
                     </div>
                     <span className="text-sm text-[var(--text-secondary)]">Clinical Status</span>
                   </div>
                   <span className="font-bold text-amber-400 truncate max-w-[100px]">{data ? 'AI Analyzed' : 'Static'}</span>
                </div>
             </div>
           </div>

           <Link to="/intake" className="w-full mt-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all flex justify-center items-center gap-2 group">
              Update Health Profile
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;