import React, { useState, useRef } from 'react';
import { BrainCircuit, Upload, FileImage, ShieldAlert, CheckCircle2, AlertTriangle, Image as ImageIcon, Search, Microscope, Activity, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Scans() {
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
        "confidence": "A number between 50 and 99",
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

      // Initialize chat with the AI's first diagnostic
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
      const imageBase64 = await toBase64(selectedFile);

      // We send the full history to the multimodal model
      // The backend expects 'messages' for historical chat
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: [{ type: 'text', text: "Context: This is the medical image we are discussing." }, { type: 'image_url', image_url: { url: imageBase64 } }] },
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="mb-12 border-b border-[var(--border-medium)] pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
            <BrainCircuit size={36} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Predictive Vision Engine</h1>
            <p className="text-[var(--text-secondary)] text-lg">Sub-millimeter structural analysis for clinical-grade diagnostics.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* Upload Section */}
          <motion.div
            className="glass-panel p-10 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-medium)] transition-all min-h-[450px] bg-gradient-to-b from-transparent to-emerald-500/5"
          >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />


          {!previewUrl ? (
            <div 
              className="text-center group cursor-pointer w-full" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 mx-auto shadow-2xl group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500">
                <Upload size={40} className="text-blue-400 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Initialize Digital Scan</h1>
              <p className="text-[var(--text-secondary)] max-w-xs mx-auto mb-10 text-[15px] leading-relaxed">
                Upload DICOM, MRI, or CT imaging for institutional-grade structural analysis.
              </p>

              <div className="inline-flex px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all items-center gap-3 shadow-xl active:scale-95">
                <FileImage size={22} />
                Select Image Source
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center py-4">
              <div className="relative w-full max-w-md aspect-video mb-8 rounded-3xl overflow-hidden border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] bg-black/40 p-4">
                <img src={previewUrl} alt="Scan Preview" className="w-full h-full object-contain rounded-xl" />

                {/* Laser Scan Animation */}
                {analyzing && (
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20 pointer-events-none"
                  />
                )}

                <button 
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); setResult(null); setChatMessages([]); }} 
                  className="absolute text-[10px] top-6 right-6 px-6 py-2.5 rounded-xl bg-slate-800/80 text-white font-bold hover:bg-rose-600 transition-all border border-white/10 shadow-lg uppercase tracking-widest z-30"
                >
                  Clear Session
                </button>
              </div>

                  <button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing}
                className="btn-primary w-full justify-center text-lg !py-4 rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-blue-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Microscope size={22} className={analyzing ? 'animate-spin' : ''} />
                  {analyzing ? 'Synchronizing Neural Model...' : 'Execute Structural Analysis'}
                </div>
              </button>
            </div>
          )}
        </motion.div>
        </div>

        {/* Results Section */}
        <div className="glass-panel p-8 flex flex-col min-h-[450px]">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-3">
              <Search size={16} className="text-indigo-400" />
              Diagnostic Reasoning Engine
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!analyzing && !result && !error && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-10"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] flex items-center justify-center mb-6 opacity-40">
                  <BrainCircuit size={40} className="text-[var(--text-secondary)]" />
                </div>
                <p className="text-[var(--text-secondary)] font-medium max-w-xs leading-relaxed">System standby. Awaiting medical image source for autonomous evaluation.</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-400 text-[15px] flex items-start gap-4"
              >
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">Processing Failure</span>
                  {error}
                </div>
              </motion.div>
            )}

            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-[spin_1s_linear_infinite]"></div>
                  <BrainCircuit size={32} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-[var(--text-primary)] text-xl font-bold tracking-tight">Autonomous Structural Scan</p>
                  <div className="flex gap-1 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
                  </div>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--glass-border)] space-y-4">
                  <div className="h-2 w-full bg-[var(--glass-border)] rounded-full shimmer overflow-hidden"></div>
                  <div className="h-2 w-2/3 bg-[var(--glass-border)] rounded-full shimmer overflow-hidden"></div>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 border border-indigo-500/20 relative overflow-hidden backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>

                  <div className="flex flex-wrap gap-3 mb-6 relative z-10">
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${result.status === 'Normal' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                      {result.status === 'Normal' ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                      Classification: {result.status}
                    </div>
                    <div className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
                      Source: {result.type}
                    </div>
                  </div>

                  <p className="text-xl text-[var(--text-primary)] mb-8 relative z-10 leading-relaxed font-bold tracking-tight">"{result.findings}"</p>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest px-1">
                      <span>Diagnostic Confidence</span>
                      <span className="text-[var(--text-primary)]">{result.confidence}%</span>
                    </div>
                    <div className="h-3 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--glass-border)] p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] ${result.confidence > 85 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-rose-500 to-indigo-600'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1">Mandatory Protocols</h4>
                  <div className="grid gap-4">
                    {(result.protocols || []).map((protocol, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        key={idx}
                        className="flex items-center gap-4 text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--glass-border)] group hover:bg-[var(--glass-bg-hover)] transition-all"
                      >
                        <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-xl group-hover:scale-110 transition-transform">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="font-medium">{protocol}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Interactive Vision Chat */}
                <div className="mt-12 pt-8 border-t border-[var(--glass-border)]">
                  <h4 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] px-1 mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-indigo-400" />
                    Interactive Clinical Dialogue
                  </h4>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                    {chatMessages.slice(1).map((msg, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-tl-none'}`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isChatting && (
                      <div className="flex justify-start">
                        <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl rounded-tl-none border border-[var(--glass-border)] flex gap-1">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a medical clinical question about this scan..."
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 pr-16 text-[var(--text-primary)] transition-all"
                    />
                    <button
                      disabled={isChatting}
                      className="absolute right-3 top-3 bottom-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

export default Scans;
