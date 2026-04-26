import React, { useEffect, useState, useMemo } from 'react';
import { Activity, HeartPulse, Brain, ChevronRight, Database, Clock, AlertTriangle, TrendingUp, Shield, Lock, FileText, Share2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RiskChart from '../components/RiskChart';
import * as jspdfInAllStyles from 'jspdf';
import html2canvas from 'html2canvas';

const jsPDF = jspdfInAllStyles.jsPDF || jspdfInAllStyles.default || jspdfInAllStyles;

function Dashboard({ data, setReportLoading, privacyMode }) {
  const navigate = useNavigate();
  const [hoveredField, setHoveredField] = useState(null);
  const [aiDeepAnalysis, setAiDeepAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getBlurStyle = (fieldName) => {
    if (!privacyMode) return {};
    return {
      filter: hoveredField === fieldName ? 'blur(0px)' : 'blur(10px)',
      transition: 'filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer'
    };
  };

  const healthScore = data?.aiResult?.riskScore || 82;
  const age = data?.vitals?.age || 45;
  const gender = data?.vitals?.sex || 'Male';
  const bmi = data?.bmi || 26.4;
  const smoking = data?.vitals?.smoking || 'Former Smoker';
  const sysBP = data?.vitals?.sysBP || 135;
  const diaBP = data?.vitals?.diaBP || 85;
  const symptoms = data?.vitals?.symptoms || 'General wellness checkup';

  const cardioRisk = useMemo(() => {
    let risk = 5;
    if (sysBP > 140) risk += 15;
    else if (sysBP > 130) risk += 8;
    if (smoking.toLowerCase().includes('current')) risk += 12;
    if (age > 60) risk += 10;
    return Math.min(risk, 99);
  }, [sysBP, smoking, age]);

  const metabolicRisk = useMemo(() => {
    let risk = 8;
    if (data?.vitals?.sugar > 140) risk += 20;
    if (bmi > 30) risk += 15;
    return Math.min(risk, 99);
  }, [data, bmi]);

  const neuroRisk = useMemo(() => {
    let risk = 3;
    if (sysBP > 150) risk += 20;
    if (age > 65) risk += 10;
    return Math.min(risk, 99);
  }, [sysBP, age]);

  const handleDeepAnalyze = async () => {
    if (!data?.vitals) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Deep clinical risk analysis (JSON): BP ${sysBP}/${diaBP}, BMI ${bmi}, Age ${age}, ${gender}, ${smoking}. Reasoning in 1 sentence.`;
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
      className="pb-20 max-w-7xl mx-auto px-6 pt-32"
      id="dashboard-content"
    >
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Clinical Oversight Node v2.5</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Health <span className="text-blue-600">Analytics</span> Hub</h1>
          <p className="text-slate-500 font-medium max-w-xl">
             Multimodal diagnostic monitoring for {data?.vitals?.name || 'Institutional Patient-ID #882'}.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Neural Deep-Scan button removed as per user request, replaced by auto-trigger */}
           <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Clock size={16} className="text-blue-600" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Sync Status</span>
                 <span className="text-sm font-bold text-slate-900 mt-1">Real-time Clinical Edge</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Core Vital Cards */}
        {[
          { label: 'Health Index', value: healthScore, suffix: '/100', icon: HeartPulse, color: 'text-emerald-600', border: 'border-l-emerald-500', field: 'healthScore' },
          { label: 'Cardiovascular', value: aiDeepAnalysis ? aiDeepAnalysis.cardio : cardioRisk, suffix: '%', icon: Activity, color: 'text-blue-600', border: 'border-l-blue-500', field: 'cardioRisk' },
          { label: 'Metabolic', value: aiDeepAnalysis ? aiDeepAnalysis.metabolic : metabolicRisk, suffix: '%', icon: Database, color: 'text-indigo-600', border: 'border-l-indigo-500', field: 'metabolicRisk' },
          { label: 'Neurological', value: aiDeepAnalysis ? aiDeepAnalysis.neuro : neuroRisk, suffix: '%', icon: Brain, color: 'text-slate-600', border: 'border-l-slate-900', field: 'neuroRisk' }
        ].map((card, i) => (
          <motion.div key={i} whileHover={{ y: -4 }} className={`glass-panel p-8 border-l-4 ${card.border}`}>
            <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{card.label}</span>
               <card.icon size={18} className="opacity-20" />
            </div>
            <div className="flex items-baseline gap-2" style={getBlurStyle(card.field)} onMouseEnter={() => setHoveredField(card.field)} onMouseLeave={() => setHoveredField(null)}>
               <span className={`text-4xl font-black tracking-tighter ${card.color}`}>{card.value}</span>
               <span className="text-xs font-bold text-slate-300">{card.suffix}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-10">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Predictive Trajectory</h3>
                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest leading-none">Diagnostic Projection Model</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black text-blue-600 border border-blue-100">
                <TrendingUp size={12} />
                AI FORECAST ACTIVE
              </div>
            </div>
            <RiskChart newDataPoint={healthScore} />
          </div>

          <div className="glass-panel p-10 bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse">
                  <Activity size={18} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Executive Summary</h3>
            </div>
            
            <div className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 group">
               <div className="absolute top-4 left-4 text-slate-200 opacity-50 group-hover:opacity-100 transition-opacity">
                  <FileText size={40} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-xl font-medium italic text-slate-800 leading-relaxed">
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
          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold mb-8 flex items-center justify-between">
               Verification Profile
               <Share2 size={16} className="text-slate-300" />
            </h3>
            <div className="space-y-1">
              {[
                { label: 'PT-Identification', value: data?.vitals?.name || 'PT-NODE-882' },
                { label: 'Demographics', value: `${age}y / ${gender}` },
                { label: 'BMI Analysis', value: `${bmi} kg/m²` },
                { label: 'Lifestyle Node', value: smoking }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0" style={getBlurStyle(item.label)} onMouseEnter={() => setHoveredField(item.label)} onMouseLeave={() => setHoveredField(null)}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <Activity size={18} />
                </div>
                <h3 className="text-lg font-bold">Systemic Vitals</h3>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;