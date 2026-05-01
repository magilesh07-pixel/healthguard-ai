import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Shield, CheckCircle2, AlertTriangle, History as HistoryIcon, Clock, Trash2, ChevronRight, Play, RotateCcw, Target, Zap } from 'lucide-react';

function EyeLab({ user, onSaveHistory, historyVersion }) {
  const [stage, setStage] = useState('welcome'); // welcome, test, result
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Test State
  const [currentLevel, setCurrentLevel] = useState(0);
  const [targetLetter, setTargetLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [testResult, setTestResult] = useState(null);

  const levels = [
    { size: '120px', label: '20/200', pool: 'EHKNP', blur: '0px' },
    { size: '80px', label: '20/100', pool: 'RTZPU', blur: '0px' },
    { size: '50px', label: '20/70', pool: 'VCONE', blur: '0px' },
    { size: '30px', label: '20/50', pool: 'SKRZV', blur: '0.5px' },
    { size: '20px', label: '20/40', pool: 'HNKDR', blur: '0.8px' },
    { size: '14px', label: '20/30', pool: 'PZCUO', blur: '1px' },
    { size: '10px', label: '20/25', pool: 'RTFDE', blur: '1.2px' },
    { size: '7px', label: '20/20', pool: 'EFPOT', blur: '1.5px' },
    { size: '5px', label: '20/15', pool: 'LZDPC', blur: '2px' }
  ];

  const generateChallenge = (levelIdx) => {
    const pool = levels[levelIdx].pool;
    const correct = pool[Math.floor(Math.random() * pool.length)];
    
    // Use visually similar distractors for higher difficulty
    const distractorsPool = 'EFHKNPRTUVZ'; 
    let distractors = [];
    while (distractors.length < 3) {
      const char = distractorsPool[Math.floor(Math.random() * distractorsPool.length)];
      if (char !== correct && !distractors.includes(char)) {
        distractors.push(char);
      }
    }
    
    setTargetLetter(correct);
    setOptions([correct, ...distractors].sort(() => Math.random() - 0.5));
  };

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history', {
        headers: { 'X-User-ID': user.uid }
      });
      const result = await res.json();
      setHistory(result.filter(item => item.type === 'eye_test'));
    } catch (e) {
      console.error("History fetch error:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    if (!window.confirm("Delete this vision record?")) return;
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-ID': user.uid }
      });
      if (res.ok) fetchHistory();
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const startTest = () => {
    setStage('test');
    setCurrentLevel(0);
    generateChallenge(0);
  };

  const handleChoice = (choice) => {
    if (choice === targetLetter) {
      if (currentLevel < levels.length - 1) {
        const next = currentLevel + 1;
        setCurrentLevel(next);
        generateChallenge(next);
      } else {
        finishTest(levels[currentLevel].label);
      }
    } else {
      const finalAcuity = currentLevel > 0 ? levels[currentLevel - 1].label : '20/200+';
      finishTest(finalAcuity);
    }
  };

  const finishTest = (acuity) => {
    const resultData = {
      acuity: acuity,
      score: Math.round(((currentLevel + 1) / levels.length) * 100),
      timestamp: new Date().toISOString()
    };
    setTestResult(resultData);
    setStage('result');
    if (onSaveHistory) {
      onSaveHistory('eye_test', resultData);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, historyVersion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 pt-24 lg:pt-32 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 lg:mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ocular Diagnostics v1.2</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">Eye <span className="text-indigo-600">Check-up</span> Lab</h1>
          <p className="text-slate-500 text-sm lg:text-base font-medium max-w-xl">
             Interactive visual acuity testing using randomized optometric recognition patterns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Lab Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {stage === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-10 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto shadow-inner relative group">
                   <Target size={40} className="group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 rounded-[2rem] border-2 border-indigo-200 animate-ping opacity-20"></div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Acuity Scan</h2>
                  <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                    Position yourself 2 feet from the screen. Identify the displayed letters by selecting the correct match below.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  {[
                    { icon: <Zap size={16}/>, title: "Interactive", desc: "Randomized patterns" },
                    { icon: <Shield size={16}/>, title: "Validated", desc: "Digital Snellen standards" },
                    { icon: <RotateCcw size={16}/>, title: "Adaptive", desc: "Precision measurement" }
                  ].map((feat, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                      <div className="text-indigo-600 mb-3 bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center">{feat.icon}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">{feat.title}</div>
                      <div className="text-[10px] text-slate-500 font-bold leading-tight">{feat.desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={startTest} className="btn-primary w-full py-6 rounded-2xl justify-center text-lg shadow-xl shadow-indigo-500/20 group">
                   Initialize Eye Scan 
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {stage === 'test' && (
              <motion.div
                key="test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-10 flex flex-col items-center justify-center min-h-[550px] relative overflow-hidden"
              >
                {/* Background Grid Decoration */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden text-[20rem] font-black flex items-center justify-center">
                   {targetLetter}
                </div>

                <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-indigo-500/20">
                         Level {currentLevel + 1}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         Distance Scale: {levels[currentLevel].label}
                      </div>
                   </div>
                   <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentLevel / levels.length) * 100}%` }}
                        className="h-full bg-indigo-500"
                      />
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-16 relative z-10">
                   <motion.div 
                    key={targetLetter}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    style={{ 
                      fontSize: levels[currentLevel].size,
                      filter: `blur(${levels[currentLevel].blur})`
                    }}
                    className="font-black text-slate-900 select-none tracking-widest bg-white w-40 h-40 flex items-center justify-center rounded-[3rem] shadow-premium border border-slate-100"
                   >
                     {targetLetter}
                   </motion.div>

                   <div className="space-y-8 w-full max-w-md">
                      <div className="text-center space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Input Response</p>
                        <p className="text-sm font-bold text-slate-600">Identify the optometric symbol above</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {options.map((opt, i) => (
                          <motion.button 
                            key={i}
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChoice(opt)} 
                            className="h-16 bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-xl font-black text-slate-900 rounded-2xl transition-all shadow-sm flex items-center justify-center"
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {stage === 'result' && testResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-10 border-l-4 border-l-indigo-600"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                  <div className="text-center md:text-left space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">Diagnostic Summary</h2>
                    <p className="text-slate-500 font-medium">Your visual acuity profile has been generated.</p>
                  </div>
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex items-center gap-8">
                     <div className="text-center">
                        <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Estimated Acuity</span>
                        <span className="text-5xl font-black">{testResult.acuity}</span>
                     </div>
                     <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
                     <div className="text-center">
                        <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Sharpness Score</span>
                        <span className="text-5xl font-black text-emerald-400">{testResult.score}%</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} className="text-indigo-600" /> Clinical Assessment
                      </h3>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-slate-700 font-bold leading-relaxed">
                          {testResult.acuity === '20/20' || testResult.acuity === '20/15' 
                            ? "Optimal vision detected. Your ability to distinguish detail at standard distance is excellent."
                            : "Standard vision deviation noted. If this is a new change, we recommend a professional optometric consultation."}
                        </p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Recommendations
                      </h3>
                      <div className="space-y-3">
                         {[
                           "Maintain 20-20-20 rule during screen use",
                           "Ensure optimal ambient lighting",
                           "Regular eye examinations every 12-24 months"
                         ].map((tip, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              <span className="text-xs font-bold text-slate-700">{tip}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <button onClick={() => setStage('welcome')} className="w-full mt-12 py-5 border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2">
                   <RotateCcw size={16} /> Perform New Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 bg-indigo-600 text-white relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Eye size={180} />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                     <Zap size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-100">Neural Calibration</h3>
               </div>
               <p className="text-indigo-50 font-bold text-lg leading-relaxed">
                  Our system uses sub-pixel letter rendering to simulate standard Snellen chart distances on digital displays.
               </p>
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-indigo-500" /> Testing Tips
             </h3>
             <ul className="space-y-4">
                {[
                  "Cover one eye with your hand",
                  "Keep back straight and head level",
                  "Do not squint during evaluation"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                     <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                     <span className="text-xs font-bold text-slate-600 leading-snug">{tip}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-20 lg:mt-32">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <HistoryIcon size={14} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnostic Archive</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">Ocular <span className="text-indigo-600">Records</span></h2>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="glass-panel p-16 text-center border-dashed border-2 border-slate-200">
             <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Eye size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-2">No Vision History</h3>
             <p className="text-slate-500 text-sm max-w-xs mx-auto">Complete your first eye check-up to start tracking your visual trends.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-6 border-slate-200 hover:border-indigo-300 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                      <Target size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Visual Acuity</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                        <Clock size={10} />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-2xl font-black text-slate-900">{item.data.acuity}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    {item.data.score}% Sharpness
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default EyeLab;
