import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Upload, FileImage, ShieldAlert, CheckCircle2, AlertTriangle, Image as ImageIcon, Search, Microscope, Activity, MessageSquare, Shield, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Scans({ onSaveHistory }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanType, setScanType] = useState('MRI');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_scan_result');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        setChatMessages([{ role: 'assistant', content: parsed.findings }]);
      } catch (e) {
        console.error("Failed to load saved scan", e);
      }
    }
  }, []);

  useEffect(() => {
    if (result) {
      localStorage.setItem('last_scan_result', JSON.stringify(result));
    }
  }, [result]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setError(null);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setResult(null);
    setError(null);
    setChatMessages([]);
    try {
      const imageBase64 = await toBase64(selectedFile);

      const prompt = `You are an expert AI Radiologist. 
      TASK:
      1. Analyze the attached image.
      2. VERIFY: If the image is NOT a medical scan (MRI, CT, X-ray, Ultrasound, etc.), you MUST set "status" to "Invalid Image Source", "findings" to "Image provided is not a clinical medical scan. Please upload a valid radiological file.", and "protocols" to ["Upload valid DICOM/Radiology file", "Verify image source integrity", "Re-attempt with medical imaging data"].
      3. If it IS a medical scan, provide a professional clinical report.
      4. Include exactly 3 specific clinical "protocols" (next steps) tailored to the findings.
      5. Use radiological terminology.
      
      RESPOND STRICTLY IN JSON:
      {
        "type": "${scanType}",
        "findings": "A concise professional description of what you see in this scan.",
        "confidence": "A precise clinical certainty score between 50 and 99 (e.g., 87 instead of round numbers like 90)",
        "status": "One of: 'Normal', 'Requires Review', or 'Invalid Image Source'",
        "protocols": ["Protocol 1", "Protocol 2", "Protocol 3"]
      }`;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image: imageBase64
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const responseJSON = await response.json();
      setResult(responseJSON);

      if (onSaveHistory) {
        onSaveHistory('scan', responseJSON);
      }

      setChatMessages([
        { role: 'assistant', content: responseJSON.findings }
      ]);

    } catch (err) {
      console.error(err);
      setError(`Vision AI Analysis Failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMessage];

    setChatMessages(newMessages);
    setChatInput('');
    setIsChatting(true);

    try {
      let imageBase64 = null;
      if (selectedFile) {
        imageBase64 = await toBase64(selectedFile);
      } else if (result && result.findings) {
        console.warn("No file selected for chat context.");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: [
              { type: 'text', text: "Context: This is the medical image we are discussing." }, 
              ...(imageBase64 ? [{ type: 'image_url', image_url: { url: imageBase64 } }] : [])
            ] },
            ...newMessages
          ]
        }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const data = await response.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (err) {
      setError("Chat interaction failed. Please try again.");
    } finally {
      setIsChatting(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatusColor = (status) => {
     if (status === 'Normal') return 'emerald';
     if (status === 'Invalid Image Source') return 'rose';
     return 'amber';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-6 pt-32 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Radiology Neural Net v4.1</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Vision <span className="text-blue-600">Analytics</span> Lab</h1>
          <p className="text-slate-500 font-medium max-w-xl">
             Sub-millimeter structural analysis leveraging multi-modal deep learning for clinical-grade anomaly detection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Input Interface */}
        <div className="xl:col-span-5 flex flex-col space-y-6">
          <div className="glass-panel p-8 bg-slate-50 flex-1 flex flex-col relative overflow-hidden group border-slate-200">
             {/* Decorative Background */}
             <div className="absolute -top-32 -right-32 text-blue-500/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                 <ScanLine size={300} />
             </div>

             <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold text-slate-900">Image Source</h2>
                   <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                      DICOM / JPEG / PNG
                   </span>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                {!previewUrl ? (
                  <div 
                    className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer bg-white border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all p-10 min-h-[300px]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                      <Upload size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Drag & Drop Scan</h3>
                    <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
                      Securely upload medical imaging for immediate neural processing.
                    </p>
                    <div className="btn-primary w-full max-w-[200px] justify-center shadow-lg shadow-blue-500/20">
                      <FileImage size={18} />
                      Browse Files
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="relative w-full aspect-square md:aspect-video xl:aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner mb-6 group/img">
                      <img src={previewUrl} alt="Scan Preview" className="w-full h-full object-contain p-2" />
                      
                      {analyzing && (
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-20 pointer-events-none"
                        />
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end opacity-0 group-hover/img:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white">{selectedFile?.name}</span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); setResult(null); setChatMessages([]); localStorage.removeItem('last_scan_result'); }} 
                           className="text-xs font-bold bg-white/20 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg transition-colors backdrop-blur-md"
                         >
                           Clear
                         </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || analyzing}
                      className="btn-primary w-full justify-center text-lg py-5 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                      <Microscope size={20} className={analyzing ? 'animate-spin' : ''} />
                      {analyzing ? 'Processing Matrix...' : 'Execute Neural Scan'}
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Intelligence Output */}
        <div className="xl:col-span-7 flex flex-col space-y-6 min-h-[600px]">
          <div className="glass-panel p-8 md:p-10 flex-1 flex flex-col">
             
             <AnimatePresence mode="wait">
                {!analyzing && !result && !error && (
                  <motion.div
                    key="standby"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <BrainCircuit size={48} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Systems Online</h3>
                    <p className="text-slate-500 max-w-sm">Awaiting radiological input to commence autonomous diagnostic pipeline.</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-start gap-4"
                  >
                    <AlertTriangle size={24} className="shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <span className="font-bold text-lg block mb-1">Execution Failure</span>
                      <p className="text-rose-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                {analyzing && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center space-y-8"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-[6px] border-slate-100 border-t-blue-600 animate-[spin_1.5s_cubic-bezier(0.68,-0.55,0.265,1.55)_infinite]"></div>
                      <ScanLine size={48} className="absolute inset-0 m-auto text-blue-600" />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">Interrogating Node Data</p>
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Applying segmentation models...</p>
                    </div>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col text-left"
                  >
                    <div className="flex justify-between items-start mb-8">
                       <h2 className="text-2xl font-black text-slate-900">Diagnostic Yield</h2>
                       <div className="flex gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                           {result.type}
                         </span>
                         <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${getStatusColor(result.status) === 'emerald' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : getStatusColor(result.status) === 'rose' ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                           {getStatusColor(result.status) === 'emerald' ? <CheckCircle2 size={12}/> : <ShieldAlert size={12}/>}
                           {result.status}
                         </span>
                       </div>
                    </div>

                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-premium mb-8 relative overflow-hidden group">
                       <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                          <BrainCircuit size={180} />
                       </div>
                       <p className="text-xl leading-relaxed font-medium relative z-10">
                         "{result.findings}"
                       </p>
                       {result.status !== 'Invalid Image Source' && (
                         <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Confidence Interval</span>
                            <span className="text-2xl font-black">{result.confidence}%</span>
                         </div>
                       )}
                    </div>

                    <div className="space-y-4 mb-10">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1">Recommended Protocols</h4>
                      <div className="grid gap-3">
                        {(result.protocols || []).map((protocol, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                            <div className="mt-0.5 text-blue-600 bg-white shadow-sm p-1 rounded-md border border-slate-200">
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 leading-snug">{protocol}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Hub */}
                    <div className="mt-auto pt-8 border-t border-slate-200">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                           <MessageSquare size={16} />
                         </div>
                         <h4 className="text-sm font-bold text-slate-900">Clinical Consultation Desk</h4>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl h-[300px] flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-4">
                          {chatMessages.slice(1).map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {isChatting && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 shadow-sm items-center h-[52px]">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleChatSubmit} className="relative mt-auto">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Interrogate findings..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium pr-24 shadow-sm"
                          />
                          <button
                            disabled={isChatting}
                            className="absolute right-2 top-2 bottom-2 px-5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-xs tracking-wide"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Scans;
