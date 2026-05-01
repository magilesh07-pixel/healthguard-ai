import React, { useState } from 'react';
import { Save, User, Heart, BrainCircuit, AlertTriangle, Loader2, CheckCircle2, ShieldPlus, Stethoscope, Activity, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function HealthForm({ onUpdateData }) {
  const [formData, setFormData] = useState({
    name: '', age: '', sex: '', weight: '', height: '', sysBP: '', diaBP: '', sugar: '', familyHistory: '', smoking: '', symptoms: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMI = () => {
    if (!formData.weight || !formData.height) return null;
    return (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setResult(null);
    setError(null);

    const bmi = calculateBMI();
    const prompt = `You are an expert AI Medical Triage Assistant. Analyze the following patient data for ${formData.name || 'the patient'}. 
    Format your response strictly in JSON with the following keys:
    1. "riskScore" (a number between 1 and 100 representing overall health risk)
    2. "analysis" (a 3-sentence summary of the primary concerns based on the data)
    3. "possibleDiseases" (an array of up to 3 strings listing possible conditions based on symptoms)
    4. "preventionSteps" (an array of up to 3 strings listing recommended preventive measures or next steps).
    
    Patient Data:
    Name: ${formData.name || 'Anonymous'}
    Age: ${formData.age}, Sex: ${formData.sex}, BMI: ${bmi || 'Unknown'}
    Blood Pressure: ${formData.sysBP}/${formData.diaBP}
    Blood Sugar (Fasting): ${formData.sugar} mg/dL
    Family History: ${formData.familyHistory}
    Smoking History: ${formData.smoking}
    Reported Symptoms: ${formData.symptoms}`;

    try {
      const response = await fetch("/api/analyze", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
         let errorMsg = `API Error: ${response.status}`;
         try {
            const errorData = await response.json();
            if (errorData.error) errorMsg = errorData.error;
         } catch (e) {}
         throw new Error(errorMsg);
      }

      const data = await response.json();
      const responseJSON = data; 
      setResult(responseJSON);

      if (onUpdateData) {
        onUpdateData({
          vitals: formData,
          aiResult: responseJSON,
          bmi: bmi,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to analyze: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.form 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleAnalyze} 
        className="glass-panel p-6 sm:p-8 lg:p-10 w-full border-t-2 border-t-blue-600/20 shadow-premium"
      >
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6 lg:mb-8 border-b border-slate-200 pb-5 flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
             <Stethoscope size={20} />
          </div>
          Systemic Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-8 lg:mb-10">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-blue-500" /> Bio-Demographics
            </h3>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Full Name identifying tag</label>
              <input required name="name" type="text" placeholder="Patient Name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Chronological Age</label>
                <input required name="age" type="number" placeholder="Years" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Biological Sex</label>
                <select required name="sex" value={formData.sex} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm appearance-none cursor-pointer">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Mass Target (kg)</label>
                <input required name="weight" type="number" placeholder="kg" value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Stature (cm)</label>
                <input required name="height" type="number" placeholder="cm" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} className="text-rose-500" /> Core Vitals
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Systolic Output</label>
                <input required name="sysBP" type="number" placeholder="mmHg" value={formData.sysBP} onChange={handleChange} className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-rose-900 placeholder-rose-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Diastolic Output</label>
                <input required name="diaBP" type="number" placeholder="mmHg" value={formData.diaBP} onChange={handleChange} className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-rose-900 placeholder-rose-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Glycemic Index</label>
                <input required name="sugar" type="number" placeholder="mg/dL" value={formData.sugar} onChange={handleChange} className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-900 placeholder-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Pulmonary Node</label>
                <select required name="smoking" value={formData.smoking} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm appearance-none cursor-pointer">
                  <option value="">Smoking Status</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current_light">Current (Light)</option>
                  <option value="current_heavy">Current (Heavy)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-2 ml-1">Hereditary Vector</label>
              <input required name="familyHistory" type="text" placeholder="Known genetic markers..." value={formData.familyHistory} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm" />
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Diagnostic Context & Chief Complaint</label>
          <textarea 
            required
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Document patient symptomatic presentation and duration..."
            rows="3"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none shadow-sm"
          ></textarea>
        </div>

        <button 
          disabled={analyzing}
          type="submit" 
          className="w-full py-5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-colors active:scale-[0.98] group shadow-lg"
        >
          {analyzing ? (
            <>
              <Loader2 className="animate-spin text-white" size={20} />
              Interrogating Neural Matrix...
            </>
          ) : (
            <>
              <Sparkles size={20} className="text-blue-400 group-hover:text-white transition-colors" />
              Generate Clinical Trajectory
            </>
          )}
        </button>
      </motion.form>

      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-8 lg:p-10 space-y-8 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-[4px] border-slate-100 border-t-blue-600 animate-[spin_1s_cubic-bezier(0.5,0.1,0.5,0.9)_infinite]"></div>
                <BrainCircuit size={28} className="absolute inset-0 m-auto text-blue-600" />
            </div>
            <div className="text-center space-y-2">
               <h3 className="text-lg font-bold text-slate-900">Aggregating Modalities</h3>
               <p className="text-sm text-slate-500 font-medium">Cross-referencing telemetry with medical datasets...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-bold flex items-center gap-3 shadow-sm"
          >
            <AlertTriangle size={20} className="text-rose-500" />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-10 border-l-4 border-l-blue-600 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 border-b border-slate-200 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><ShieldPlus size={20} /></div>
                   <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Intelligence Report</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">Automated clinical risk stratification complete.</p>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6 bg-slate-900 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-xl w-full sm:w-auto justify-center sm:justify-start">
                <div className="text-center">
                  <span className="block text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Factor</span>
                  <span className={`text-4xl sm:text-5xl font-black leading-none ${result.riskScore > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{result.riskScore}</span>
                </div>
                <div className="h-10 sm:h-12 w-px bg-white/10"></div>
                <div className="text-center">
                   <span className="block text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Triaging Priority</span>
                   <span className={`px-3 py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none ${result.riskScore > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                     {result.riskScore > 50 ? 'URGENT' : 'OPTIMAL'}
                   </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" /> Executive Summary
                  </h3>
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative">
                    <div className="absolute top-4 left-4 text-slate-200">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold italic text-lg relative z-10 pl-10">
                      {result.analysis}
                    </p>
                  </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <AlertTriangle size={14} className="text-rose-500" /> Pathology Identification
                   </h3>
                   <div className="grid gap-3">
                     {result.possibleDiseases?.map((disease, idx) => (
                       <motion.div 
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        key={idx} 
                        className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                       >
                         <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                         </div>
                         <span className="font-bold text-slate-800 text-sm leading-snug">{disease}</span>
                       </motion.div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Heart size={14} className="text-emerald-500" /> Directed Interventions
                    </h3>
                    <div className="space-y-3">
                      {result.preventionSteps?.map((step, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (0.1 * idx) }}
                          key={idx} 
                          className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors"
                        >
                          <div className="bg-blue-50 p-2 rounded-xl mt-0.5 border border-blue-100">
                            <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" />
                          </div>
                          <span className="font-medium text-slate-700 text-sm leading-relaxed">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HealthForm;