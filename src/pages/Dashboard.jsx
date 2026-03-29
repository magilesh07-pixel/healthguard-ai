import React, { useEffect, useState, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Activity, HeartPulse, Brain, ChevronRight, Download, Database, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RiskChart from '../components/RiskChart';
import * as jspdfInAllStyles from 'jspdf';
import html2canvas from 'html2canvas';

// Support both { jsPDF } and default imports for version 4 compatibility
const jsPDF = jspdfInAllStyles.jsPDF || jspdfInAllStyles.default || jspdfInAllStyles;

function Dashboard({ data, setReportLoading, privacyMode }) {
  const navigate = useNavigate();
  const [hoveredField, setHoveredField] = useState(null);
  const [aiDeepAnalysis, setAiDeepAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getBlurStyle = (fieldName) => {
    if (!privacyMode) return {};
    return {
      filter: hoveredField === fieldName ? 'blur(0px)' : 'blur(8px)',
      transition: 'filter 0.3s ease',
      cursor: 'pointer'
    };
  };

  // Extract vitals with defaults
  const healthScore = data?.aiResult?.riskScore || 82;
  const age = data?.vitals?.age || 45;
  const gender = data?.vitals?.sex || 'Male';
  const bmi = data?.bmi || 26.4;
  const smoking = data?.vitals?.smoking || 'Former Smoker';
  const sysBP = data?.vitals?.sysBP || 135;
  const diaBP = data?.vitals?.diaBP || 85;
  const symptoms = data?.vitals?.symptoms || 'General wellness checkup';

  // Strategic Risk Calculations (Fallback Logic)
  const cardioRisk = useMemo(() => {
    let risk = 5;
    if (sysBP > 140) risk += 15;
    else if (sysBP > 130) risk += 8;
    if (smoking.toLowerCase().includes('current')) risk += 12;
    if (age > 60) risk += 10;
    else if (age > 45) risk += 5;
    return Math.min(risk, 99);
  }, [sysBP, smoking, age]);

  const metabolicRisk = useMemo(() => {
    let risk = 8;
    if (data?.vitals?.sugar > 140) risk += 20;
    else if (data?.vitals?.sugar > 100) risk += 10;
    if (bmi > 30) risk += 15;
    else if (bmi > 25) risk += 7;
    return Math.min(risk, 99);
  }, [data, bmi]);

  const neuroRisk = useMemo(() => {
    let risk = 3;
    if (sysBP > 150) risk += 20;
    if (age > 65) risk += 10;
    if (smoking.toLowerCase().includes('heavy')) risk += 10;
    return Math.min(risk, 99);
  }, [sysBP, age, smoking]);

  const handleDeepAnalyze = async () => {
    if (!data?.vitals) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Perform a deep clinical risk analysis for:
      Vitals: ${sysBP}/${diaBP} BP, BMI ${bmi}, Sugar ${data.vitals.sugar}
      Profile: ${age}y, ${gender}, ${smoking}
      History/Concerns: ${symptoms}
      
      Respond in JSON:
      {
        "cardio": "int (0-100)",
        "metabolic": "int (0-100)",
        "neuro": "int (0-100)",
        "reasoning": "1 sentence"
      }`;

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

  // Stable reference for event handler to avoid race conditions
  useEffect(() => {
    const handleGenerateReport = async () => {
      const element = document.getElementById('dashboard-content');
      if (!element) {
        setReportLoading(false);
        return;
      }

      console.log("Generating Medical Report...");

      try {
        // Strategy 1: High-Fidelity Capture
        const canvas = await html2canvas(element, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            const styles = clonedDoc.querySelectorAll('style');
            styles.forEach(style => {
              let cssText = style.innerHTML;
              cssText = cssText.replace(/oklch\([^)]+\)/gi, 'rgb(100, 116, 139)');
              cssText = cssText.replace(/oklab\([^)]+\)/gi, 'rgb(100, 116, 139)');
              style.innerHTML = cssText;
            });
          }
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.width > 0 ? (canvas.height * imgWidth) / canvas.width : 297;
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
        pdf.save(`HealthGuard_Full_Report_${data?.vitals?.name || 'Patient'}.pdf`);
      } catch (err) {
        console.warn('High-Fidelity failed, using clinical fallback...', err);

        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const reportId = `HG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

          // Clinical Header (Navy blue theme for report)
          pdf.setFillColor(15, 23, 42);
          pdf.rect(0, 0, 210, 40, 'F');
          pdf.setTextColor(255); // White text on navy header
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(22);
          pdf.text("HealthGuard AI", 20, 20);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Report ID: ${String(reportId)}`, 150, 20);
          pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, 25);

          // Content - use fixed high-contrast colors (Dark on Light)
          pdf.setTextColor(30); // Darker text for white page
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text("CLINICAL INTEGRITY REPORT", 20, 55);
          pdf.setDrawColor(200); // Light gray line
          pdf.line(20, 58, 190, 58);

          // Demographics Box
          pdf.setFillColor(245, 248, 250);
          pdf.rect(20, 65, 170, 30, 'F');
          pdf.setFontSize(10);
          pdf.setTextColor(60);
          pdf.text("PATIENT IDENTIFICATION", 25, 72);
          pdf.setTextColor(20);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Name: ${data?.vitals?.name || 'Standard PT'}`, 25, 80);
          pdf.text(`Age/Sex: ${age}y / ${gender}`, 25, 86);
          pdf.text(`BMI: ${bmi}`, 110, 80);
          pdf.text(`Habits: ${smoking}`, 110, 86);

          // Vitals Section
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.text("I. Systemic Vitals", 20, 110);
          pdf.line(20, 112, 190, 112);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.text(`Blood Pressure: ${sysBP} / ${diaBP} mmHg`, 25, 120);
          pdf.text(`Health Index: ${healthScore} / 100`, 25, 126);

          // Risk Analytics Section
          pdf.setFont("helvetica", "bold");
          pdf.text("II. Predictive Risk Analytics", 20, 145);
          pdf.line(20, 147, 190, 147);

          const drawRiskBar = (label, value, y) => {
            const riskValue = Number(value) || 0;
            pdf.setFont("helvetica", "normal");
            pdf.text(label, 25, y);
            pdf.setFillColor(230, 230, 230);
            pdf.rect(100, y - 3.5, 70, 5, 'F');

            const color = riskValue > 75 ? [239, 68, 68] : riskValue > 50 ? [245, 158, 11] : [16, 185, 129];
            pdf.setFillColor(color[0], color[1], color[2]);
            pdf.rect(100, y - 3.5, (riskValue / 100) * 70, 5, 'F');
            pdf.setFont("helvetica", "bold");
            pdf.text(`${riskValue}%`, 175, y);
          };

          drawRiskBar("Cardiovascular Risk:", cardioRisk, 158);
          drawRiskBar("Metabolic Risk:", metabolicRisk, 166);
          drawRiskBar("Neurological Risk:", neuroRisk, 174);

          // --- SECTION: REASON FOR CONSULTATION ---
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.text("III. Primary Clinical Concerns", 20, 195);
          pdf.line(20, 197, 190, 197);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(40);

          const splitSymptoms = pdf.splitTextToSize(`Reason for Intake: ${symptoms}`, 165);
          pdf.text(splitSymptoms, 25, 205);

          if (data?.aiResult?.analysis) {
            pdf.setFont("helvetica", "bold");
            pdf.text("AI Diagnostic Summary:", 25, 225);
            pdf.setFont("helvetica", "normal");
            const splitAnalysis = pdf.splitTextToSize(data.aiResult.analysis, 165);
            pdf.text(splitAnalysis, 25, 230);
          }

          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text("This report is generated by HealthGuard AI for informational purposes only.", 105, 280, { align: 'center' });

          pdf.save(`HealthGuard_Clinical_Report_${data?.vitals?.name || 'Patient'}.pdf`);
        } catch (pdfErr) {
          console.error("Critical PDF Failure:", pdfErr);
          alert(`PDF Generation Failed: ${pdfErr.message}. This might be a browser restriction for automatic downloads.`);
        }
      } finally {
        setReportLoading(false);
      }
    };

    window.addEventListener('generate-medical-report', handleGenerateReport);
    return () => window.removeEventListener('generate-medical-report', handleGenerateReport);
  }, [data, setReportLoading]); // Reduced dep list to the essentials

  return (
    <motion.div
      id="dashboard-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12 p-4 max-w-7xl mx-auto"
    >
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Clinical Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {data ? `Real-time health intelligence for ${data.vitals.name}` : "Comprehensive preventive monitoring & risk stratification."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data && !aiDeepAnalysis && (
            <button
              onClick={handleDeepAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition-all active:scale-95 disabled:opacity-50"
            >
              <Brain size={14} className={isAnalyzing ? 'animate-pulse' : ''} />
              {isAnalyzing ? 'Analysing Systems...' : 'Run Deep AI Check'}
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/5 border border-blue-500/10 px-4 py-2 rounded-full">
            <Clock size={14} />
            LAST UPDATED: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'LIVE'}
          </div>
        </div>
      </header>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-l-2 border-l-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Health Integrity</h3>
            <HeartPulse size={16} className="text-emerald-500/50" />
          </div>
          <div className="flex items-baseline gap-2" style={getBlurStyle('healthScore')}>
            <span className="text-5xl font-bold text-[var(--text-high-contrast)]">{healthScore}</span>
            <span className="text-xs text-[var(--text-tertiary)]">/ 100</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-l-2 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Cardiovascular</h3>
            <Activity size={16} className="text-blue-500/50" />
          </div>
          <div className="flex items-baseline gap-2" style={getBlurStyle('cardioRisk')}>
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">
              {aiDeepAnalysis ? aiDeepAnalysis.cardio : cardioRisk}%
            </span>
            <span className={`text-[10px] font-bold ${(aiDeepAnalysis ? aiDeepAnalysis.cardio : cardioRisk) > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {(aiDeepAnalysis ? aiDeepAnalysis.cardio : cardioRisk) > 30 ? 'ELEVATED' : 'OPTIMAL'}
            </span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-l-2 border-l-indigo-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Metabolic</h3>
            <Database size={16} className="text-indigo-500/50" />
          </div>
          <div className="flex items-baseline gap-2" style={getBlurStyle('metabolicRisk')}>
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">
              {aiDeepAnalysis ? aiDeepAnalysis.metabolic : metabolicRisk}%
            </span>
            <span className={`text-[10px] font-bold ${(aiDeepAnalysis ? aiDeepAnalysis.metabolic : metabolicRisk) > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {(aiDeepAnalysis ? aiDeepAnalysis.metabolic : metabolicRisk) > 25 ? 'REVIEW' : 'NORMAL'}
            </span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-l-2 border-l-slate-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Neurological</h3>
            <Brain size={16} className="text-slate-500/50" />
          </div>
          <div className="flex items-baseline gap-2" style={getBlurStyle('neuroRisk')}>
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">
              {aiDeepAnalysis ? aiDeepAnalysis.neuro : neuroRisk}%
            </span>
            <span className="text-[10px] font-bold text-emerald-400">
              {(aiDeepAnalysis ? aiDeepAnalysis.neuro : neuroRisk) > 40 ? 'ELEVATED' : 'STABLE'}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Risk Trajectory</h2>
                <p className="text-xs text-[var(--text-secondary)]">Historical data comparison with current AI forecast.</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  AI PREDICTION
                </div>
              </div>
            </div>
            <RiskChart newDataPoint={healthScore} />
          </div>

          {/* Consultation Reason / AI Summary Card */}
          <div className="glass-panel p-8 bg-gradient-to-br from-transparent to-blue-500/5 border-t-2 border-t-blue-500/30">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">Primary Clinical Concern</h3>
                  <p className="text-lg font-medium text-[var(--text-primary)] leading-relaxed italic">
                    "{symptoms}"
                  </p>
                </div>
                {data?.aiResult?.analysis && (
                  <div className="pt-4 border-t border-[var(--glass-border)]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">AI Diagnostic Summary</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {data.aiResult.analysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Patient Bio</h2>
            <div className="space-y-4">
              {[
                { label: 'Name', value: data?.vitals?.name || 'Anonymous' },
                { label: 'Demographics', value: `${age}y / ${gender}` },
                { label: 'Clinical BMI', value: bmi },
                { label: 'Lifestyle', value: smoking },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-[var(--glass-border)] last:border-0" style={getBlurStyle(item.label)}>
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" />
              Vital Signs
            </h2>
            <div className="space-y-3">
              <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--glass-border)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">Blood Pressure</span>
                </div>
                <span className="font-bold text-[var(--text-primary)]">{sysBP}/{diaBP}</span>
              </div>
              <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--glass-border)] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Database size={16} />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">Blood Sugar</span>
                </div>
                <span className="font-bold text-[var(--text-primary)]">{data?.vitals?.sugar || '--'} mg/dL</span>
              </div>
            </div>

            <Link to="/intake" className="btn-primary w-full mt-8 justify-center rounded-xl py-4 shadow-lg shadow-blue-500/10">
              Update Clinical Data
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;