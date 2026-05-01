import React, { useEffect, useState, useMemo } from 'react';
import { Activity, HeartPulse, Brain, ChevronRight, Database, Clock, AlertTriangle, TrendingUp, Shield, Lock, FileText, Share2, Wind, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnatomyMap from '../components/AnatomyMap';
import * as jspdfInAllStyles from 'jspdf';
import html2canvas from 'html2canvas';

const jsPDF = jspdfInAllStyles.jsPDF || jspdfInAllStyles.default || jspdfInAllStyles;

function Dashboard({ data, setReportLoading, user, setPatientData, historyVersion }) {
  const navigate = useNavigate();
  const [hoveredField, setHoveredField] = useState(null);
  const [aiDeepAnalysis, setAiDeepAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, historyVersion]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history', {
        headers: { 'X-User-ID': user.uid }
      });
      const result = await res.json();
      // Dashboard only shows Clinical Intakes
      // Lungs, Scans, and Eyes have their own dedicated history sections in their labs
      setHistory(result.filter(item => item.type === 'intake'));
    } catch (e) {
      console.error("History fetch error:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteHistoryItem = async (e, id) => {
    e.stopPropagation(); // Don't trigger the card click
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { 'X-User-ID': user.uid }
      });
      if (res.ok) {
        fetchHistory(); // Refresh list
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };



  const healthScore = data?.aiResult?.riskScore || 0;
  const age = data?.vitals?.age || '--';
  const gender = data?.vitals?.sex || '--';
  const bmi = data?.bmi || '--';
  const smoking = data?.vitals?.smoking || '--';
  const sysBP = data?.vitals?.sysBP || 0;
  const diaBP = data?.vitals?.diaBP || 0;
  const symptoms = data?.vitals?.symptoms || 'No symptoms reported';

  const cardioRisk = useMemo(() => {
    if (!data?.vitals) return 0;
    let risk = 0;
    if (sysBP > 140) risk += 15;
    else if (sysBP > 130) risk += 8;
    if (smoking.toLowerCase().includes('current')) risk += 12;
    if (age > 60) risk += 10;
    return Math.min(risk, 99);
  }, [data, sysBP, smoking, age]);

  const metabolicRisk = useMemo(() => {
    if (!data?.vitals) return 0;
    let risk = 0;
    if (data?.vitals?.sugar > 140) risk += 20;
    if (bmi > 30) risk += 15;
    return Math.min(risk, 99);
  }, [data, bmi]);

  const neuroRisk = useMemo(() => {
    if (!data?.vitals) return 0;
    let risk = 0;
    if (sysBP > 150) risk += 20;
    if (age > 65) risk += 10;
    return Math.min(risk, 99);
  }, [data, sysBP, age]);

  const respiratoryRisk = 0;

  const immuneRisk = useMemo(() => {
    if (!data?.vitals) return 0;
    let risk = 5;
    if (smoking.toLowerCase().includes('current')) risk += 15;
    if (age > 50) risk += 10;
    if (data?.vitals?.sugar > 150) risk += 10;
    return Math.min(risk, 99);
  }, [data, smoking, age]);

  const homeostasisRisk = useMemo(() => {
    if (!data?.vitals) return 0;
    let risk = 8;
    const sugar = data?.vitals?.sugar || 100;
    if (sugar > 140 || sugar < 70) risk += 20;
    if (bmi > 28) risk += 12;
    if (sysBP > 145) risk += 10;
    return Math.min(risk, 99);
  }, [data, bmi, sysBP]);

  const handleDeepAnalyze = async () => {
    if (!data?.vitals) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Perform deep clinical risk analysis. 
      Input: BP ${sysBP}/${diaBP}, BMI ${bmi}, Age ${age}, Gender ${gender}, Smoking ${smoking}. 
      Return JSON with exactly these keys: 
      "cardio" (number 0-100), 
      "metabolic" (number 0-100), 
      "neuro" (number 0-100), 
      "reasoning" (string, 1 sentence summary).`;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const result = await res.json();
      setAiDeepAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset local AI analysis when new history data is loaded
  useEffect(() => {
    setAiDeepAnalysis(null);
  }, [data]);

  // Automate Neural Deep-Scan in the background
  useEffect(() => {
    if (data?.vitals && !aiDeepAnalysis && !isAnalyzing) {
      handleDeepAnalyze();
    }
  }, [data?.vitals, aiDeepAnalysis, isAnalyzing]);

  useEffect(() => {
    const handleGenerateReport = async () => {
      const element = document.getElementById('dashboard-content');
      if (!element) {
        setReportLoading(false);
        return;
      }
      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const styles = clonedDoc.querySelectorAll('style');
            styles.forEach(style => {
              style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/gi, 'rgb(100, 116, 139)').replace(/oklab\([^)]+\)/gi, 'rgb(100, 116, 139)');
            });
            // Hide interactive elements
            const interactive = clonedDoc.querySelectorAll('button, .btn-primary');
            interactive.forEach(el => el.style.display = 'none');
          }
        });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
        pdf.save(`HealthReport_${data?.vitals?.name || 'Patient'}.pdf`);
      } catch (err) {
        console.warn('PDF capture failed, using high-fidelity fallback');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const primaryBlue = [37, 99, 235];
        const slate900 = [15, 23, 42];
        const slate400 = [148, 163, 184];

        // Header Background
        pdf.setFillColor(...primaryBlue);
        pdf.rect(0, 0, 210, 45, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.setFont("helvetica", "bold");
        pdf.text("HEALTHGUARD AI", 20, 28);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("CLINICAL DIAGNOSTIC OVERVIEW • SYSTEM NODE v2.5", 20, 36);
        
        pdf.setFontSize(9);
        pdf.text(`REPORT ID: #HG-${Math.floor(100000 + Math.random() * 899999)}`, 155, 20);
        pdf.text(`ISSUED: ${new Date().toLocaleString()}`, 155, 26);

        // Patient Highlight Section
        pdf.setFillColor(248, 250, 252);
        pdf.rect(20, 55, 170, 35, 'F');
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(20, 55, 170, 35, 'D');

        pdf.setTextColor(...slate900);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("PATIENT BIOMETRICS", 25, 64);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(`IDENTIFIER: ${data?.vitals?.name || 'ANN-882'}`, 25, 73);
        pdf.text(`AGE/SEX: ${age}Y / ${gender}`, 25, 80);
        pdf.text(`BMI INDEX: ${bmi} kg/m²`, 85, 73);
        pdf.text(`LIFESTYLE: ${smoking}`, 85, 80);

        // Score Visualization
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("HEALTH INDEX ANALYSIS", 20, 110);
        
        // Progress Bar
        pdf.setFillColor(241, 245, 249);
        pdf.rect(20, 115, 170, 12, 'F');
        pdf.setFillColor(...primaryBlue);
        pdf.rect(20, 115, (healthScore/100) * 170, 12, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.text(`SCORE: ${healthScore}% PERFORMANCE`, 85, 124);

        // Vitals Grid
        pdf.setTextColor(...slate900);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("CLINICAL TELEMETRY", 20, 145);

        const metrics = [
          { label: "Hemodynamics", value: `${sysBP}/${diaBP} mmHg`, status: sysBP > 140 ? "ELEVATED" : "OPTIMAL" },
          { label: "Glycemic Load", value: `${data?.vitals?.sugar || '--'} mg/dL`, status: "STABLE" },
          { label: "Cardiovascular Risk", value: `${cardioRisk}%`, status: cardioRisk > 30 ? "CAUTION" : "NORMAL" },
          { label: "Metabolic Pathway", value: `${metabolicRisk}%`, status: "MONITOR" },
          { label: "Neurological Load", value: `${neuroRisk}%`, status: "STEREOTYPIC" }
        ];

        metrics.forEach((m, i) => {
          const y = 155 + (i * 12);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(m.label, 25, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(m.value, 100, y);
          pdf.setFontSize(8);
          pdf.setTextColor(...(m.status === "ELEVATED" || m.status === "CAUTION" ? [225, 29, 72] : slate400));
          pdf.text(m.status, 160, y);
          pdf.setTextColor(...slate900);
          
          pdf.setDrawColor(241, 245, 249);
          pdf.line(20, y + 2, 190, y + 2);
        });

        if (aiDeepAnalysis || symptoms) {
          // If we reach near the bottom, add a new page or just move down
          // For now, let's assume we have space, but let's be careful.
          const summaryY = 225;
          
          pdf.setTextColor(...primaryBlue);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("EXECUTIVE SUMMARY", 20, summaryY);
          
          // Grey box for reasoning
          const boxY = summaryY + 5;
          pdf.setFillColor(248, 250, 252);
          pdf.rect(20, boxY, 170, 45, 'F');
          pdf.setDrawColor(226, 232, 240);
          pdf.rect(20, boxY, 170, 45, 'D');

          // Quote marks (simulated)
          pdf.setTextColor(...slate400);
          pdf.setFontSize(30);
          pdf.text('"', 25, boxY + 15);

          pdf.setTextColor(...slate900);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          const reasoningText = aiDeepAnalysis?.reasoning || `Patient presenting with reported concern: "${symptoms}". Clinical index remains at ${healthScore}%. Further monitoring advised.`;
          const splitReasoning = pdf.splitTextToSize(reasoningText, 150);
          pdf.text(splitReasoning, 35, boxY + 15);
        }

        // Signature Area
        pdf.setDrawColor(...slate400);
        pdf.line(140, 278, 190, 278);
        pdf.setFontSize(8);
        pdf.setTextColor(...slate400);
        pdf.text("Authorized AI Clinician Node", 165, 283, { align: 'center' });

        // Footer
        pdf.setFillColor(...slate900);
        pdf.rect(0, 287, 210, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.text("CONFIDENTIAL MEDICAL DOCUMENT • NOT FOR EMERGENCY USE • © 2026 HEALTHGUARD LABS", 105, 293, { align: 'center' });

        pdf.save(`HealthReport_Premium_Fallback.pdf`);
      } finally {
        setReportLoading(false);
      }
    };
    window.addEventListener('generate-medical-report', handleGenerateReport);
    return () => window.removeEventListener('generate-medical-report', handleGenerateReport);
  }, [data, setReportLoading, aiDeepAnalysis, cardioRisk, metabolicRisk, neuroRisk, healthScore, bmi, age, gender, smoking, symptoms, diaBP, sysBP]);


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 max-w-7xl mx-auto px-6 pt-24 lg:pt-32"
      id="dashboard-content"
    >
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Clinical Oversight Node v2.5</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">Health <span className="text-blue-600">Analytics</span> Hub</h1>
          <p className="text-slate-500 text-sm lg:text-base font-medium max-w-xl">
             Clinical risk assessment for {data?.vitals?.name || 'Authorized Patient'}.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {isAnalyzing && (
             <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-600 border border-blue-100 animate-pulse">
                <Brain size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Neural Syncing...</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <AnatomyMap risks={{
            cardio: aiDeepAnalysis?.cardio || cardioRisk,
            metabolic: aiDeepAnalysis?.metabolic || metabolicRisk,
            neuro: aiDeepAnalysis?.neuro || neuroRisk,
            respiratory: respiratoryRisk,
            immune: immuneRisk,
            homeostasis: homeostasisRisk
          }} />
          <div className="glass-panel p-6 sm:p-10 bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
               <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse">
                  <Activity size={18} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Executive Summary</h3>
            </div>
            
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-100 group">
               <div className="absolute top-4 left-4 text-slate-200 opacity-50 group-hover:opacity-100 transition-opacity">
                  <FileText size={40} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-lg lg:text-xl font-medium italic text-slate-800 leading-relaxed pl-2 lg:pl-0">
                      "{symptoms}"
                    </p>
                  </div>
                  {aiDeepAnalysis && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-slate-200">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Neural Analysis Matrix</h5>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium">{aiDeepAnalysis.reasoning}</p>
                    </motion.div>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Tactical Intel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8">
            <h3 className="text-base lg:text-lg font-bold mb-6 sm:mb-8 flex items-center justify-between">
               Verification Profile
            </h3>
            <div className="space-y-1">
              {[
                { label: 'Patient-ID', value: data?.vitals?.name || 'Anonymous' },
                { label: 'Vital Stats', value: `${age}y / ${gender}` },
                { label: 'BMI Analysis', value: bmi === '--' ? '--' : `${bmi} kg/m²` },
                { label: 'Lifestyle Node', value: smoking }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>


          <div className="glass-panel p-6 sm:p-8">
             <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <Activity size={18} />
                </div>
                <h3 className="text-base lg:text-lg font-bold">Systemic Vitals</h3>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hemodynamics</span>
                   <span className="text-lg font-black text-slate-900">{sysBP}/{diaBP} <span className="text-[9px] font-bold opacity-30 ml-1">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Glycemic Load</span>
                   <span className="text-lg font-black text-slate-900">{data?.vitals?.sugar || '--'} <span className="text-[9px] font-bold opacity-30 ml-1">mg/dL</span></span>
                </div>
             </div>

             <Link to="/intake" className="btn-primary w-full mt-10 justify-center">
                Refine Clinical Profile
                <ChevronRight size={16} />
             </Link>
             
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Clock className="text-indigo-600" size={20} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Clinical History</h2>
               </div>
               <button 
                 onClick={fetchHistory}
                 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
               >
                 Refresh
               </button>
            </div>

            {historyLoading ? (
               <div className="py-12 flex flex-col items-center justify-center gap-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessing Medical Records...</p>
               </div>
            ) : history.length > 0 ? (
               <div className="grid gap-4">
                 {history.map((item) => (
                   <motion.div 
                      key={item.id}
                      whileHover={{ x: 4 }}
                      className="glass-panel p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all shadow-sm"
                      onClick={() => {
                         if (item.type === 'intake') {
                           setPatientData(item.data);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                         }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.type === 'intake' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                           {item.type === 'intake' ? <FileText size={20} /> : <Brain size={20} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {item.type === 'intake' ? 'Clinical Intake Session' : 'AI Diagnostic Scan'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {item.type === 'intake' ? `Risk: ${item.data.aiResult?.riskScore}%` : 'Analysis Complete'}
                             </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => deleteHistoryItem(e, item.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </motion.div>
                 ))}
               </div>
            ) : (
               <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 px-6">
                  <Database className="text-slate-300 mb-4" size={32} />
                  <h3 className="text-sm font-bold text-slate-600">No History Found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Complete your first intake to start your clinical journey.</p>
               </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;