import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Square, RotateCcw, ShieldCheck, HeartPulse, Brain, Info, History as HistoryIcon, Clock, ChevronRight, Activity, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LungTest({ user, onSaveHistory, patientData }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState('intake'); // intake, prepare, holding, result
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const [patientName, setPatientName] = useState(patientData?.vitals?.name || "");
  const [patientAge, setPatientAge] = useState(patientData?.vitals?.age || "");
  
  const timerRef = useRef(null);

  const actualAge = patientData?.vitals?.age || 25;

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history', {
        headers: { 'X-User-ID': user.uid }
      });
      const result = await res.json();
      // Filter for lung tests only
      setHistory(result.filter(item => item.type === 'lung_test'));
    } catch (e) {
      console.error("Lung history fetch error:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    if (!window.confirm("Delete this diagnostic record?")) return;
    
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-ID': user.uid }
      });
      if (res.ok) {
        fetchHistory(); // Refresh local list
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 0.1);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const startTest = () => {
    setSeconds(0);
    setStage('holding');
    setIsActive(true);
  };

  const stopTest = () => {
    setIsActive(false);
    calculateResults();
  };

  const calculateResults = async () => {
    const time = Math.round(seconds * 10) / 10;
    let rating = "";
    let wellness = 0;
    const baseAge = parseInt(patientAge) || 25;
    let lungAge = baseAge;

    if (time < 20) {
      rating = "Developing Capacity";
      wellness = 35;
      lungAge = baseAge + 12;
    } else if (time < 40) {
      rating = "Standard Wellness";
      wellness = 65;
      lungAge = baseAge;
    } else if (time < 70) {
      rating = "Clinical Grade";
      wellness = 85;
      lungAge = baseAge - 5;
    } else {
      rating = "Elite Performance";
      wellness = 98;
      lungAge = baseAge - 12;
    }

    const finalResult = {
      time,
      rating,
      wellness,
      lungAge: Math.max(18, lungAge),
      patientName,
      patientAge,
      timestamp: new Date().toISOString()
    };

    setResults(finalResult);
    setStage('result');
    
    // Save to global cloud history
    if (onSaveHistory) {
      await onSaveHistory('lung_test', finalResult);
      fetchHistory(); // Refresh local list
    }
  };

  const resetTest = () => {
    setSeconds(0);
    setStage('prepare');
    setResults(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
           <Wind size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">Pulmonary Diagnostic Lab</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Lung <span className="text-blue-600">Vitality</span> Test</h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Estimate your lung age and oxygen efficiency by measuring your maximum breath-hold duration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Info size={18} className="text-blue-500" />
               Guidelines
             </h3>
             <ul className="space-y-4">
               {[
                 "Sit upright and relax your chest.",
                 "Take 3 deep breaths slowly.",
                 "On the 4th breath, inhale fully.",
                 "Click Start and hold as long as possible.",
                 "Click Stop as soon as you exhale."
               ].map((text, i) => (
                 <li key={i} className="flex gap-3 text-sm font-medium text-slate-500">
                   <span className="w-5 h-5 flex-shrink-0 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">{i+1}</span>
                   {text}
                 </li>
               ))}
             </ul>
          </div>

          <div className="glass-panel p-6 bg-slate-900 text-white rounded-[2rem] shadow-lg">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={20} className="text-emerald-400" />
                <h4 className="font-bold text-sm">Safety First</h4>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
               This test is for wellness estimation only. Stop immediately if you feel dizzy or lightheaded. Do not perform near water or while driving.
             </p>
          </div>
        </div>

        {/* Center: The Breath-O-Meter */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 lg:p-12 bg-white border border-slate-100 rounded-[3rem] shadow-premium flex flex-col items-center">
            
            <AnimatePresence mode="wait">
              {stage === 'intake' && (
                <motion.div 
                  key="intake"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center space-y-8 w-full max-w-sm mx-auto"
                >
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                     <Brain size={32} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Patient Details</h2>
                    <p className="text-slate-400 text-sm font-medium">Please confirm the details for this session.</p>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="space-y-1 text-left">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                       <input 
                         type="text" 
                         value={patientName}
                         onChange={(e) => setPatientName(e.target.value)}
                         placeholder="Enter patient name"
                         className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900 outline-none"
                       />
                    </div>
                    <div className="space-y-1 text-left">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biological Age</label>
                       <input 
                         type="number" 
                         value={patientAge}
                         onChange={(e) => setPatientAge(e.target.value)}
                         className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900 outline-none"
                       />
                    </div>
                  </div>

                  <button 
                    onClick={() => setStage('prepare')}
                    className="btn-primary w-full py-5 rounded-2xl text-lg shadow-xl shadow-blue-500/20"
                    disabled={!patientName || !patientAge}
                  >
                    Confirm & Proceed
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {stage === 'prepare' && (
                <motion.div 
                  key="prepare"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center text-center space-y-8"
                >
                  <div className="w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center relative">
                     <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-dashed animate-[spin_20s_linear_infinite]" />
                     <Wind size={64} className="text-blue-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Ready to begin?</h2>
                    <p className="text-slate-400 text-sm font-medium">Take a deep breath and click the button below.</p>
                  </div>
                  <button 
                    onClick={startTest}
                    className="btn-primary px-12 py-5 rounded-2xl text-lg shadow-xl shadow-blue-500/20"
                  >
                    Start Test
                    <Play size={20} fill="currentColor" />
                  </button>
                </motion.div>
              )}

              {stage === 'holding' && (
                <motion.div 
                  key="holding"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center space-y-12 w-full"
                >
                  <div className="relative w-64 h-64 flex items-center justify-center">
                     {/* Circular Progress */}
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                          cx="128" cy="128" r="120" 
                          fill="none" stroke="currentColor" 
                          className="text-slate-50" strokeWidth="12"
                        />
                        <motion.circle 
                          cx="128" cy="128" r="120" 
                          fill="none" stroke="currentColor" 
                          className="text-blue-500" strokeWidth="12"
                          strokeDasharray="754"
                          animate={{ strokeDashoffset: 754 - (seconds * 10) }}
                          strokeLinecap="round"
                        />
                     </svg>
                     <div className="text-center">
                        <div className="text-6xl font-black text-slate-900 tracking-tighter">
                          {seconds.toFixed(1)}
                        </div>
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Seconds Held</div>
                     </div>
                  </div>

                  <div className="text-center space-y-4">
                     <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                        <Activity className="animate-bounce" size={14} />
                        Active Monitoring...
                     </div>
                     <p className="text-slate-400 text-sm font-medium">Click STOP the moment you exhale.</p>
                  </div>

                  <button 
                    onClick={stopTest}
                    className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-500/20 active:scale-95"
                  >
                    STOP NOW
                    <Square size={20} fill="currentColor" />
                  </button>
                </motion.div>
              )}

              {stage === 'result' && results && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-8"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/30 w-full">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-4">Diagnostic Score Card</h3>
                       <div className="grid grid-cols-2 gap-8 py-4">
                          <div className="text-center border-r border-white/10">
                             <div className="text-4xl font-black">{results.lungAge}</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Estimated Lung Age</div>
                          </div>
                          <div className="text-center">
                             <div className="text-4xl font-black">{results.wellness}%</div>
                             <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Wellness Index</div>
                          </div>
                       </div>
                       <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="text-xl font-black tracking-tight">{results.rating}</div>
                          <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Clinical Status</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full">
                       <div className="glass-panel p-4 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center gap-1">
                          <Clock className="text-blue-500" size={16} />
                          <div className="text-xs font-black text-slate-900">{results.time}s</div>
                          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-center">Duration</div>
                       </div>
                       <div className="glass-panel p-4 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center gap-1">
                          <HistoryIcon className="text-indigo-500" size={16} />
                          <div className="text-xs font-black text-slate-900">{results.patientAge}y</div>
                          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest text-center">Base Age</div>
                       </div>
                       <div className="glass-panel p-4 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center gap-1 text-center">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                             <Wind size={10} />
                          </div>
                          <div className="text-[9px] font-black text-slate-900 truncate w-full px-1">{results.patientName}</div>
                          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Patient</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 w-full pt-4">
                       <button 
                         onClick={resetTest}
                         className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold text-sm transition-all"
                       >
                         <RotateCcw size={18} />
                         Retry Test
                       </button>
                       <button 
                         onClick={() => navigate('/dashboard')}
                         className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                       >
                         View Insights
                         <ChevronRight size={18} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HistoryIcon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Diagnostics</h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Pulmonary Performance History</p>
              </div>
           </div>
           <button 
             onClick={fetchHistory}
             className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:opacity-70 transition-opacity"
           >
             Refresh Records
           </button>
        </div>

        {historyLoading ? (
           <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
           </div>
        ) : history.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="glass-panel p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm group hover:shadow-md transition-all"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wind size={20} />
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-sm font-bold text-slate-900 mt-0.5">{item.data.patientName || 'Breath-Hold Session'}</div>
                         </div>
                      </div>
                      <div className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {item.data.time}s
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-200 hover:text-red-500 transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Age</div>
                         <div className="text-lg font-black text-slate-900">{item.data.lungAge}y</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Wellness Index</div>
                         <div className="text-lg font-black text-blue-600">{item.data.wellness}%</div>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        ) : (
           <div className="py-20 flex flex-col items-center justify-center text-center glass-panel bg-slate-50/50 border border-dashed border-slate-200 rounded-[3rem]">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                 <Wind size={24} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-600">No diagnostic history found</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-[240px]">Complete your first breath-hold test to start tracking your performance.</p>
           </div>
        )}
      </div>
    </motion.div>
  );
}

export default LungTest;
