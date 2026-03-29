import React, { useState } from 'react';
import { Save, User, Heart, BrainCircuit, AlertTriangle, Loader2, CheckCircle2, ShieldPlus, Stethoscope, Activity } from 'lucide-react';
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
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || `API Error: ${response.status}`);
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
        className="glass-panel p-8 w-full border-t-2 border-t-blue-500/30"
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
          <Stethoscope className="text-blue-400" />
          Clinical Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Demographics
            </h3>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Full Name</label>
              <input required name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Age</label>
                <input required name="age" type="number" placeholder="25" value={formData.age} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Sex</label>
                <select required name="sex" value={formData.sex} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Select</option>
                  <option value="male" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Male</option>
                  <option value="female" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Female</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Weight (kg)</label>
                <input required name="weight" type="number" placeholder="70" value={formData.weight} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Height (cm)</label>
                <input required name="height" type="number" placeholder="175" value={formData.height} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} /> Clinical Vitals
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Systolic BP</label>
                <input required name="sysBP" type="number" placeholder="120" value={formData.sysBP} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-rose-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Diastolic BP</label>
                <input required name="diaBP" type="number" placeholder="80" value={formData.diaBP} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-rose-500/50 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Fasting Sugar (mg/dL)</label>
                <input required name="sugar" type="number" placeholder="95" value={formData.sugar} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Smoking History</label>
                <select required name="smoking" value={formData.smoking} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Select status...</option>
                  <option value="never" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Never Smoked</option>
                  <option value="former" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Former Smoker</option>
                  <option value="current_light" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Current (Light)</option>
                  <option value="current_heavy" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Current (Heavy)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Family Medical History</label>
              <input required name="familyHistory" type="text" placeholder="e.g. History of heart disease, diabetes..." value={formData.familyHistory} onChange={handleChange} className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3 ml-1">Active Symptoms & Concerns</label>
          <textarea 
            required
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe your current symptoms, duration, and intensity..."
            rows="3"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-blue-500/50 transition-all resize-none"
          ></textarea>
        </div>

        <button 
          disabled={analyzing}
          type="submit" 
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] group"
        >
          {analyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              AI Reasoning Engine Running...
            </>
          ) : (
            <>
              <BrainCircuit size={22} className="group-hover:rotate-12 transition-transform" />
              Run Predictive Analysis
            </>
          )}
        </button>
      </motion.form>

      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <Loader2 className="animate-spin text-blue-400" size={16} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">AI Clinical Logic Initiated...</h3>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-[var(--glass-border)] rounded-full shimmer overflow-hidden"></div>
              <div className="h-4 w-1/2 bg-[var(--glass-border)] rounded-full shimmer overflow-hidden"></div>
              <div className="h-28 w-full bg-[var(--glass-border)]/30 rounded-xl shimmer overflow-hidden"></div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3"
          >
            <AlertTriangle size={18} />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 border-l-4 border-l-emerald-500 relative"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[var(--glass-border)] pb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <ShieldPlus className="text-emerald-400" size={22} />
                   <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">AI Diagnostic Forecast</h2>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">Real-time analysis results for patient clinical inputs.</p>
              </div>
              
              <div className="flex items-center gap-5 bg-[var(--bg-secondary)] px-6 py-4 rounded-2xl border border-[var(--glass-border)] backdrop-blur-md">
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Risk score</span>
                  <span className="text-4xl font-bold neon-gradient-text leading-none">{result.riskScore}</span>
                </div>
                <div className="h-8 w-px bg-[var(--glass-border)]"></div>
                <div className="text-center">
                   <span className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Status</span>
                   <span className={`text-xs font-bold leading-none ${result.riskScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                     {result.riskScore > 50 ? 'URGENT' : 'STABLE'}
                   </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={12} className="text-blue-400" /> Professional Summary
                  </h3>
                  <p className="text-[var(--text-primary)] leading-relaxed bg-blue-500/5 p-5 rounded-2xl border border-blue-500/10 italic text-[15px]">
                    "{result.analysis}"
                  </p>
                </div>

                <div>
                   <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                     <AlertTriangle size={12} className="text-rose-400" /> Potential Manifestations
                   </h3>
                   <div className="grid gap-2.5">
                     {result.possibleDiseases?.map((disease, idx) => (
                       <motion.div 
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        key={idx} 
                        className="flex items-center gap-3 p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 text-rose-700 text-sm font-medium"
                       >
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                         {disease}
                       </motion.div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Heart size={12} className="text-emerald-400" /> Prescriptive Measures
                    </h3>
                    <div className="space-y-3">
                      {result.preventionSteps?.map((step, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (0.1 * idx) }}
                          key={idx} 
                          className="flex items-start gap-4 p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-[var(--text-primary)] text-sm leading-relaxed"
                        >
                          <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                          </div>
                          <span>{step}</span>
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