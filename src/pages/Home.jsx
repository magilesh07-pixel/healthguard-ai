import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, HeartPulse, Brain, ChevronRight, Download, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskChart from '../components/RiskChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Home({ data, theme, setReportLoading, privacyMode }) {
  const [hoveredField, setHoveredField] = useState(null);

  const getBlurStyle = (fieldName) => {
    if (!privacyMode) return {};
    return {
      filter: hoveredField === fieldName ? 'blur(0px)' : 'blur(8px)',
      transition: 'filter 0.3s ease',
      cursor: privacyMode ? 'pointer' : 'default'
    };
  };
  // Use real data if available, otherwise use mock data
  const healthScore = data?.aiResult?.riskScore || 82;
  const age = data?.vitals?.age || 45;
  const gender = data?.vitals?.sex || 'Male';
  const bmi = data?.bmi || 26.4;
  const smoking = data?.vitals?.smoking || 'Former Smoker';
  const sysBP = data?.vitals?.sysBP || 135;
  const diaBP = data?.vitals?.diaBP || 85;

  const calculateCardioRisk = () => {
    let risk = 5;
    if (sysBP > 140) risk += 15;
    else if (sysBP > 130) risk += 8;
    if (smoking.toLowerCase().includes('current')) risk += 12;
    if (age > 60) risk += 10;
    else if (age > 45) risk += 5;
    return Math.min(risk, 99);
  };

  const calculateMetabolicRisk = () => {
    let risk = 8;
    if (data?.vitals?.sugar > 140) risk += 20;
    else if (data?.vitals?.sugar > 100) risk += 10;
    if (bmi > 30) risk += 15;
    else if (bmi > 25) risk += 7;
    return Math.min(risk, 99);
  };

  const calculateNeuroRisk = () => {
    let risk = 3;
    if (sysBP > 150) risk += 20;
    if (age > 65) risk += 10;
    if (smoking.toLowerCase().includes('heavy')) risk += 10;
    return Math.min(risk, 99);
  };

  const cardioRisk = data ? calculateCardioRisk() : 21;
  const metabolicRisk = data ? calculateMetabolicRisk() : 18;
  const neuroRisk = data ? calculateNeuroRisk() : 5;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  useEffect(() => {
    const handleGenerateReport = async () => {
      const element = document.getElementById('dashboard-content');
      if (!element) {
        console.error("Dashboard element not found");
        setReportLoading(false);
        return;
      }

      console.log("Generating Medical Report...");

      // Strategy 1: High-Fidelity Capture with Advanced Sanitization
      try {
        const canvas = await html2canvas(element, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          logging: false,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const dashboard = clonedDoc.getElementById('dashboard-content');
            if (dashboard) {
              dashboard.style.padding = '40px';
              dashboard.style.background = theme === 'dark' ? '#000000' : '#ffffff';
              
              // 1. Sanitize all parsed CSS rules to remove modern tokens that crash html2canvas
              const styles = clonedDoc.querySelectorAll('style');
              styles.forEach(style => {
                  let cssText = style.innerHTML;
                  // Replace oklch/oklab with a safe fallback color so html2canvas color parser doesn't panic
                  cssText = cssText.replace(/oklch\([^)]+\)/gi, theme === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)');
                  cssText = cssText.replace(/oklab\([^)]+\)/gi, theme === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)');
                  cssText = cssText.replace(/color\([^)]+\)/gi, 'rgb(100, 116, 139)');
                  style.innerHTML = cssText;
              });

              // 2. Force standard colors for problematic inline styles
              const all = dashboard.getElementsByTagName('*');
              for (let el of all) {
                const s = clonedDoc.defaultView.getComputedStyle(el);
                
                // Ensure text is visible
                if (s.color.includes('oklch') || s.color.includes('oklab')) {
                    el.style.color = theme === 'dark' ? '#e2e8f0' : '#1e293b';
                }
                
                // Remove complex backgrounds
                if (s.backgroundColor.includes('oklch') || s.backgroundColor.includes('oklab') || s.backgroundColor.includes('gradient')) {
                    el.style.backgroundColor = theme === 'dark' ? '#080808' : '#ffffff';
                }
                
                // Disable animations and transitions which can cause rendering glitches
                el.style.transition = 'none';
                el.style.animation = 'none';
                
                // Recharts SVGs sometimes cause tainted canvas or parsing errors
                if (el.tagName.toLowerCase() === 'svg') {
                  el.style.overflow = 'visible';
                }
              }
            }
          }
        });
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
        pdf.save(`HealthGuard_Report_${data?.vitals?.name || 'Patient'}.pdf`);
        console.log("High-Fidelity Report Saved.");
      } catch (err) {
        console.error('High-Fidelity Snapshot Error:', err);
        
        // Strategy 2: Guaranteed Fail-safe Clinical Summary (Raw jsPDF)
        console.log("Generating fail-safe structural PDF...");
        try {
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          const reportId = `HG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
          const now = new Date();
          const dateStr = now.toLocaleDateString();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // --- 1. Clinical Header ---
          pdf.setFillColor(theme === 'dark' ? 15 : 240, theme === 'dark' ? 23 : 244, theme === 'dark' ? 42 : 248);
          pdf.rect(0, 0, 210, 40, 'F');
          
          pdf.setTextColor(theme === 'dark' ? 240 : 20);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(24);
          pdf.text("HealthGuard AI", 20, 20);
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(theme === 'dark' ? 180 : 80);
          pdf.text("ADVANCED CLINICAL INTELLIGENCE PLATFORM", 20, 28);

          pdf.setFontSize(9);
          pdf.text(`Report ID: ${reportId}`, 150, 20);
          pdf.text(`Date: ${dateStr}`, 150, 25);
          pdf.text(`Time: ${timeStr} (UTC)`, 150, 30);
          
          // --- 1.5 Background Image Watermark ---
          // Draw this before the main text so it sits in the background
          try {
              // Base64 of the provided blue gradient heart logo
              const logoBase64 = "data:image/png;base64,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";

              pdf.saveGraphicsState();
              // We make the background logo significantly transparent so text stays legible
              pdf.setGState(new pdf.GState({opacity: 0.08})); 
              // Calculate logo dimensions ensuring it fits comfortably
              // The logo is square, let's make it 120x120 mm centered
              const logoSize = 120;
              const centerX = (210 - logoSize) / 2;
              const centerY = (297 - logoSize) / 2; // Approximate center of A4 page
              
              pdf.addImage(logoBase64, 'PNG', centerX, centerY, logoSize, logoSize);
              pdf.restoreGraphicsState();
          } catch (watermarkErr) {
              console.warn("Could not inject background watermark logo:", watermarkErr);
              // Proceeding without watermark if it somehow fails
          } finally {
              // ALWAYS reset opacity back to 1.0 so subsequent text isn't invisible!
              try {
                  pdf.setGState(new pdf.GState({opacity: 1.0}));
              } catch(e) {}
          }
          
          // --- 2. Document Title ---
          pdf.setTextColor(20);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.text("PREDICTIVE HEALTH ANALYSIS REPORT", 20, 55);
          
          pdf.setDrawColor(200);
          pdf.setLineWidth(0.5);
          pdf.line(20, 60, 190, 60);

          // --- 3. Patient Demographics Block ---
          pdf.setFillColor(250, 250, 250); // Light gray background box
          pdf.rect(20, 65, 170, 35, 'F');
          pdf.setDrawColor(230);
          pdf.rect(20, 65, 170, 35, 'S'); // Box border

          pdf.setTextColor(80);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("PATIENT DEMOGRAPHICS", 25, 72);
          
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(30);
          // Left Column
          pdf.text(`Patient Name:`, 25, 82);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${data?.vitals?.name || 'Standard PT'}`, 60, 82);
          
          pdf.setFont("helvetica", "normal");
          pdf.text(`Age / Sex:`, 25, 90);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${age} years / ${gender}`, 60, 90);

          // Right Column
          pdf.setFont("helvetica", "normal");
          pdf.text(`Lifestyle:`, 110, 82);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${smoking}`, 140, 82);
          
          pdf.setFont("helvetica", "normal");
          pdf.text(`BMI Status:`, 110, 90);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${bmi} (${bmi > 30 ? 'Obese' : bmi > 25 ? 'Overweight' : 'Normal'})`, 140, 90);

          // --- 4. Clinical Metrics ---
          pdf.setTextColor(20);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.text("I. Systemic Vitals & Telemetry", 20, 115);
          pdf.line(20, 118, 190, 118);

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
          pdf.setTextColor(40);
          pdf.text(`Resting Blood Pressure:`, 25, 128);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${sysBP} / ${diaBP} mmHg`, 80, 128);
          
          pdf.setFont("helvetica", "normal");
          pdf.text(`Health Integrity Score:`, 25, 136);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${healthScore} / 100`, 80, 136);

          // --- 5. Risk Stratification ---
          pdf.setTextColor(20);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.text("II. Predictive Risk Analytics", 20, 155);
          pdf.line(20, 158, 190, 158);

          // Risk Bars
          pdf.setFontSize(10);
          pdf.setTextColor(40);
          
          const drawRiskBar = (label, value, yPos) => {
             pdf.setFont("helvetica", "normal");
             pdf.text(label, 25, yPos);
             
             // Background bar
             pdf.setFillColor(240);
             pdf.rect(100, yPos - 4, 70, 6, 'F');
             
             // Active bar (color based on risk)
             let barColor = [16, 185, 129]; // Emerald (Low Risk)
             if (value > 50) barColor = [245, 158, 11]; // Amber (Medium Risk)
             if (value > 75) barColor = [239, 68, 68]; // Red (High Risk)
             
             pdf.setFillColor(...barColor);
             const activeWidth = (value / 100) * 70;
             pdf.rect(100, yPos - 4, activeWidth, 6, 'F');
             
             pdf.setFont("helvetica", "bold");
             pdf.text(`${value}%`, 175, yPos);
          }

          drawRiskBar("Cardiovascular System:", cardioRisk, 168);
          drawRiskBar("Metabolic Markers:", metabolicRisk, 178);
          drawRiskBar("Neurological Load:", neuroRisk, 188);

          // --- 6. Footer & Disclaimers ---
          pdf.setDrawColor(200);
          pdf.line(20, 260, 190, 260);
          
          pdf.setFontSize(8);
          pdf.setTextColor(120);
          pdf.setFont("helvetica", "normal");
          const disclaimer1 = "This document was generated automatically by the HealthGuard AI Predictive Engine.";
          const disclaimer2 = "It is intended for informational and preliminary screening purposes only and does NOT constitute a confirmed medical diagnosis.";
          const disclaimer3 = "Please consult with a licensed healthcare provider for clinical evaluation.";
          
          pdf.text(disclaimer1, 105, 265, { align: 'center' });
          pdf.text(disclaimer2, 105, 269, { align: 'center' });
          pdf.setFont("helvetica", "bold");
          pdf.text(disclaimer3, 105, 273, { align: 'center' });
          
          // Page number
          pdf.setFont("helvetica", "normal");
          pdf.text("Page 1 of 1", 105, 285, { align: 'center' });

          pdf.save(`HealthGuard_Clinical_Report_${data?.vitals?.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`);
          console.log("Fail-safe Report Saved.");
        } catch (finalErr) {
          console.error("Critical PDF Error:", finalErr);
          alert("❌ TECHNICAL ERROR: Report capture failed entirely. Please use 'Print to PDF' (Ctrl+P).");
        }
      } finally {
        setReportLoading(false);
      }
    };

    window.addEventListener('generate-medical-report', handleGenerateReport);
    return () => window.removeEventListener('generate-medical-report', handleGenerateReport);
  }, [data, theme, setReportLoading]);

  return (
    <motion.div 
      id="dashboard-content"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 pb-12 p-4"
    >
      <motion.header variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Risk Intelligence Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {data ? `Real-time analysis for ${data.vitals.name || 'Patient'}` : "Real-time preventive health monitoring and risk assessment."}
          </p>
        </div>
        {data && (
           <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-full">
             <ShieldAlert size={14} />
             LIVE DATA ACTIVE
           </div>
        )}
      </motion.header>
      
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 relative overflow-hidden group border-l-2 border-l-emerald-500"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Health Integrity Index</h3>
            <HeartPulse size={16} className="text-emerald-500/50" />
          </div>
          <div 
            className="flex items-baseline gap-2"
            onMouseEnter={() => setHoveredField('healthScore')}
            onMouseLeave={() => setHoveredField(null)}
            style={getBlurStyle('healthScore')}
          >
            <span className="text-5xl font-bold text-[var(--text-high-contrast)]">{healthScore}</span>
            <span className="text-sm font-medium text-[var(--text-tertiary)]">/ 100</span>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 relative overflow-hidden group border-l-2 border-l-slate-500"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Systemic Cardiovascular</h3>
            <Activity size={16} className="text-slate-500/50" />
          </div>
          <div 
            className="flex items-baseline gap-2"
            onMouseEnter={() => setHoveredField('cardioRisk')}
            onMouseLeave={() => setHoveredField(null)}
            style={getBlurStyle('cardioRisk')}
          >
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">{cardioRisk}%</span>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 relative overflow-hidden group border-l-2 border-l-slate-500"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Metabolic Markers</h3>
            <Database size={16} className="text-slate-500/50" />
          </div>
          <div 
            className="flex items-baseline gap-2"
            onMouseEnter={() => setHoveredField('metabolicRisk')}
            onMouseLeave={() => setHoveredField(null)}
            style={getBlurStyle('metabolicRisk')}
          >
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">{metabolicRisk}%</span>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 relative overflow-hidden group border-l-2 border-l-slate-500"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Neurological Load</h3>
            <Brain size={16} className="text-slate-500/50" />
          </div>
          <div 
            className="flex items-baseline gap-2"
            onMouseEnter={() => setHoveredField('neuroRisk')}
            onMouseLeave={() => setHoveredField(null)}
            style={getBlurStyle('neuroRisk')}
          >
            <span className="text-4xl font-bold text-[var(--text-high-contrast)]">{neuroRisk}%</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide">Disease Risk Analytics</h2>
           </div>
           
           <div className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] p-2">
              <RiskChart newDataPoint={data?.aiResult?.riskScore} theme={theme} />
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6">
           <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide mb-6">Patient Profile</h2>
           
           <div className="space-y-4">
             <div 
               className="flex justify-between pb-3 border-b border-[var(--glass-border)]"
               onMouseEnter={() => setHoveredField('patientName')}
               onMouseLeave={() => setHoveredField(null)}
               style={getBlurStyle('patientName')}
             >
               <span className="text-[var(--text-secondary)] text-sm">Patient Name</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">{data?.vitals?.name || 'PT-883921'}</span>
             </div>
             <div 
               className="flex justify-between pb-3 border-b border-[var(--glass-border)]"
               onMouseEnter={() => setHoveredField('patientAge')}
               onMouseLeave={() => setHoveredField(null)}
               style={getBlurStyle('patientAge')}
             >
               <span className="text-[var(--text-secondary)] text-sm">Age / Gender</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">{age} / {gender}</span>
             </div>
             <div 
               className="flex justify-between pb-3 border-b border-[var(--glass-border)]"
               onMouseEnter={() => setHoveredField('patientBmi')}
               onMouseLeave={() => setHoveredField(null)}
               style={getBlurStyle('patientBmi')}
             >
               <span className="text-[var(--text-secondary)] text-sm">BMI</span>
               <span className="text-[var(--text-primary)] font-medium text-sm">
                 {bmi} <span className={bmi > 25 ? 'text-amber-400' : 'text-emerald-400'}>
                   ({bmi > 30 ? 'Obese' : bmi > 25 ? 'Overweight' : 'Normal'})
                 </span>
               </span>
             </div>
             <div 
               className="flex justify-between pb-3 border-b border-[var(--glass-border)]"
               onMouseEnter={() => setHoveredField('patientHabits')}
               onMouseLeave={() => setHoveredField(null)}
               style={getBlurStyle('patientHabits')}
             >
               <span className="text-[var(--text-secondary)] text-sm">Habits</span>
               <span className="text-[var(--text-primary)] font-medium text-sm uppercase">{smoking}</span>
             </div>
           </div>

           <div className="mt-8">
             <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Latest Vitals</h3>
             
             <div className="space-y-3">
                <div 
                  className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--glass-border)] flex justify-between items-center"
                  onMouseEnter={() => setHoveredField('vitalsBp')}
                  onMouseLeave={() => setHoveredField(null)}
                  style={getBlurStyle('vitalsBp')}
                >
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-rose-500/20 text-rose-500 flex items-center justify-center">
                       <HeartPulse size={16} />
                     </div>
                     <span className="text-sm text-[var(--text-secondary)]">Blood Pressure</span>
                   </div>
                   <span className={`font-bold ${sysBP > 140 ? 'text-rose-400' : 'text-emerald-400'}`}>{sysBP}/{diaBP}</span>
                </div>

                <div 
                  className="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--glass-border)] flex justify-between items-center"
                  onMouseEnter={() => setHoveredField('vitalsClinicalStatus')}
                  onMouseLeave={() => setHoveredField(null)}
                  style={getBlurStyle('vitalsClinicalStatus')}
                >
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center">
                       <Activity size={16} />
                     </div>
                     <span className="text-sm text-[var(--text-secondary)]">Clinical Status</span>
                   </div>
                   <span className="font-bold text-amber-400 truncate max-w-[100px]">{data ? 'AI Analyzed' : 'Static'}</span>
                </div>
             </div>
           </div>

            <Link to="/intake" className="btn-primary w-full mt-8 justify-center !rounded-xl text-sm">
               Update Clinical Profile
               <ChevronRight size={14} />
            </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;