import React from 'react';
import HealthForm from '../components/HealthForm';
import { Users, FileText, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

function Intake({ onUpdateData }) {
  return (
    <div className="pb-20 max-w-7xl mx-auto px-6 pt-32">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Data Acquisition Node</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Clinical <span className="text-blue-600">Intake</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">
             Structured telemetry collection for predictive risk modeling and automated triage.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left column: Information */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-10 rounded-[32px] bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-premium relative overflow-hidden group border border-white/5">
            <div className="absolute -top-12 -right-12 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
               <FileText size={200} />
            </div>
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                     <AlertCircle size={24} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-sky-300">Protocol Directives</h3>
               </div>
               
               <p className="text-slate-200 font-medium text-lg leading-relaxed">
                  Provide verified clinical parameters. Our predictive inference engine utilizes these inputs combined with multi-modal reasoning.
               </p>

               <div className="space-y-4 pt-8 border-t border-white/10">
                  {[
                    "Verify patient identification",
                    "Vitals acquired within 2h window",
                    "Strict SI unit adherence"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20 transition-colors group-hover/item:bg-emerald-500/30">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-100 tracking-wide">{text}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="xl:col-span-8">
           <HealthForm onUpdateData={onUpdateData} />
        </div>

      </div>
    </div>
  );
}

export default Intake;
