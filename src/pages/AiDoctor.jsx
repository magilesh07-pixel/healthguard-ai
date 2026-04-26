import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Stethoscope, AlertTriangle, Zap, Heart, Brain, Activity, ChevronRight, WifiOff } from 'lucide-react';

const GREETING = "Hello! I'm Dr. M.B.Magilesh, your HealthGuard AI medical consultant. While I can provide general health information and guidance, please remember I'm an AI and my advice should not replace a licensed physician's diagnosis.\n\nHow can I help you today? 🩺";

const quickQuestions = [
  { text: "What does my risk score mean?", icon: Activity },
  { text: "How can I lower my blood pressure?", icon: Heart },
  { text: "What is my BMI telling me?", icon: Zap },
  { text: "How can I improve my heart health?", icon: Brain },
];

// Renders markdown-like text with bold support
function MessageContent({ text }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 leading-relaxed">
      {lines.map((line, i) => {
        const formatted = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-bold text-[var(--text-primary)]">{part}</strong> : part
        );
        return <p key={i} className="text-sm">{formatted}</p>;
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Stethoscope size={14} className="text-white" />
      </div>
      <div className="glass-panel px-4 py-3 rounded-2xl rounded-bl-sm border border-[var(--glass-border)]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AiDoctor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETING, id: 0 }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || isTyping) return;

    setInput('');
    setError(null);
    const userEntry = { role: 'user', content: userMsg, id: Date.now() };
    const updatedMessages = [...messages, userEntry];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Build the messages array to send (exclude greeting from API call)
    const apiMessages = updatedMessages
      .filter(m => !(m.role === 'assistant' && m.id === 0)) // Skip initial greeting
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.content || "I'm sorry, I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply, id: Date.now() + 1 }]);
    } catch (err) {
      console.error('AI Doctor API error:', err);
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-[calc(100vh-24px)] max-w-4xl mx-auto gap-4 pt-28 pb-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between flex-shrink-0 pt-2">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Stethoscope size={20} className="text-white" />
            </span>
            AI Doctor
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1 ml-[52px]">Clinical AI Consultation — Dr. M.B.Magilesh</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ONLINE
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex-shrink-0">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-700/90">
          <strong>Medical Disclaimer:</strong> Dr. M.B.Magilesh provides informational guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-[var(--glass-border)] min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-[var(--glass-border)]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Stethoscope size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-br-sm'
                      : 'bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-secondary)] rounded-bl-sm'
                  }`}
                >
                  <MessageContent text={msg.content} />
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--text-secondary)] border border-[var(--glass-border)]">
                    M
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Questions (show only when 1 message) */}
        {messages.length === 1 && !isTyping && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {quickQuestions.map(({ text, icon: Icon }, i) => (
              <button
                key={i}
                onClick={() => handleSend(text)}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 hover:bg-blue-500/20 hover:text-blue-800 transition-all font-medium"
              >
                <Icon size={12} />
                {text}
                <ChevronRight size={12} />
              </button>
            ))}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mx-4 mb-2 flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <WifiOff size={14} className="text-rose-600 flex-shrink-0" />
            <p className="text-xs text-rose-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-rose-600 hover:text-rose-800 text-xs">✕</button>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-[var(--glass-border)] mx-4" />

        {/* Input Area */}
        <div className="p-4 flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. M.B.Magilesh a health question..."
            rows={1}
            className="flex-1 resize-none bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all scrollbar-none"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AiDoctor;
