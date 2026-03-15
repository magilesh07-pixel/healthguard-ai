import React from 'react';
import HealthForm from '../components/HealthForm';
import { Users, FileText, CheckCircle2 } from 'lucide-react';

function Intake({ onUpdateData }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="mb-8 border-b border-[var(--glass-border)] pb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Patient Intake Portal</h1>
          <p className="text-[var(--text-secondary)] mt-1">Collect structured clinical data to run predictive risk models.</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Information */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
               <FileText size={20} className="text-cyan-400" />
               Intake Instructions
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
               Please fill out all required clinical parameters. Our predictive engine utilizes these structured inputs combined with your EMR data to assess long-term disease trajectories.
            </p>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
               <li className="flex items-start gap-2">
                 <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                 <span>Ensure patient consent is signed.</span>
               </li>
               <li className="flex items-start gap-2">
                 <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                 <span>Vitals should be taken within the last 24h.</span>
               </li>
               <li className="flex items-start gap-2">
                 <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                 <span>Use standard SI units for all metrics.</span>
               </li>
            </ul>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-2">
           <HealthForm onUpdateData={onUpdateData} />
        </div>

      </div>
    </div>
  );
}

export default Intake;
