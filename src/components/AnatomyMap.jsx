import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Activity, Shield, Zap, Thermometer } from 'lucide-react';

const AnatomyMap = ({ risks }) => {
  const systems = [
    { name: 'Neurological', icon: Brain, risk: risks?.neuro || 0, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Cardiovascular', icon: Heart, risk: risks?.cardio || 0, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Metabolic', icon: Zap, risk: risks?.metabolic || 0, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Respiratory', icon: Activity, risk: 12, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Immune System', icon: Shield, risk: 8, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Homeostasis', icon: Thermometer, risk: 15, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  return (
    <div className="glass-panel p-6 bg-white border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Systemic Integrity Map</h3>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest leading-none">Real-time Bio-Symmetry Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {systems.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative p-5 rounded-2xl border border-slate-100 ${s.bg} group hover:shadow-md transition-all cursor-default`}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700">{s.name}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stress Load</span>
                <span className={`text-sm font-black ${s.risk > 40 ? 'text-rose-600' : 'text-slate-900'}`}>{s.risk}%</span>
              </div>
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${s.risk}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  className={`h-full rounded-full ${s.risk > 40 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnatomyMap;
