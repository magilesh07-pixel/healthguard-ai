import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Book, Code, Building, Lock, FileText, Scale, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const infoContent = {
  security: {
    title: 'Security Model',
    icon: Shield,
    color: 'text-blue-500',
    description: 'Our zero-trust architecture ensures that patient data is encrypted and accessible only to authorized clinical personnel.'
  },
  documentation: {
    title: 'Documentation',
    icon: Book,
    color: 'text-indigo-400',
    description: 'Comprehensive guides for integrating HealthGuard AI into clinical workflows and EMR systems.'
  },
  api: {
    title: 'API Protocol',
    icon: Code,
    color: 'text-cyan-400',
    description: 'Technical specifications for secure FHIR-compliant data exchange and predictive model endpoints.'
  },
  institutional: {
    title: 'Institutional Access',
    icon: Building,
    color: 'text-emerald-400',
    description: 'Enterprise-grade deployment options for hospitals, research centers, and diagnostic labs.'
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Lock,
    color: 'text-rose-400',
    description: 'Detailed information on how we handle personal health information (PHI) in compliance with HIPAA and GDPR.'
  },
  disclaimer: {
    title: 'Clinical Disclaimer',
    icon: Scale,
    color: 'text-amber-400',
    description: 'HealthGuard AI is a decision-support tool and does not replace professional medical judgment or diagnosis.'
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    color: 'text-blue-400',
    description: 'Usage agreements and legal protocols for institutional and individual access to the HealthGuard platform.'
  }
};

function Info() {
  const location = useLocation();
  const type = location.pathname.split('/').pop() || 'documentation';
  const content = infoContent[type] || infoContent.documentation;
  const Icon = content.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 font-bold uppercase tracking-widest text-[10px]">
        <ChevronLeft size={16} />
        Exit to Portal
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Icon size={200} />
        </div>

        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 ${content.color}`}>
          <Icon size={32} />
        </div>

        <h1 className="text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight">{content.title}</h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          {content.description}
        </p>

        <div className="mt-16 pt-8 border-t border-[var(--glass-border)]">
          <p className="text-sm text-[var(--text-secondary)] italic mb-8">
            Note: This section is currently part of the v2.5 documentation phase. For urgent institutional inquiries, please contact our support team.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:magilesh8@gmail.com?subject=Document Request - HealthGuard AI"
              className="px-8 py-3 bg-[var(--accent-blue)] text-white rounded-xl font-bold hover:scale-105 transition-all text-center shadow-lg"
            >
              Request Full Document
            </a>
            <a 
              href="mailto:magilesh8@gmail.com"
              className="px-8 py-3 bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)] rounded-xl font-bold hover:bg-[var(--glass-bg-hover)] transition-all text-center"
            >
              Contact Compliance Office
            </a>
          </div>
        </div>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(infoContent).filter(([key]) => key !== type).slice(0, 4).map(([key, item]) => {
          const ItemIcon = item.icon;
          return (
            <Link key={key} to={`/info/${key}`} className="glass-panel p-6 hover:bg-white/5 group transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                   <ItemIcon size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">View Protocol</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Info;
