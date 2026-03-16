import React from 'react';
import { motion } from 'framer-motion';

const AnatomyMap = ({ highlight, className = "" }) => {
  // Region coordinates/paths (Simplified SVG mapping)
  const regions = {
    head: { cx: 50, cy: 15, rx: 8, ry: 10, label: "Brain/Head" },
    chest: { x: 35, y: 28, width: 30, height: 15, rx: 5, label: "Thoracic/Chest" },
    abdomen: { x: 38, y: 45, width: 24, height: 12, rx: 4, label: "Abdominal" },
    spine: { x: 48, y: 30, width: 4, height: 35, rx: 2, label: "Spine/Neural" },
    limbs: { path: "M 30 35 L 15 60 M 70 35 L 85 60 M 40 70 L 35 95 M 60 70 L 65 95", label: "Musculoskeletal" }
  };

  const isActive = (key) => highlight?.toLowerCase() === key;

  return (
    <div className={`relative ${className} bg-[var(--bg-secondary)] rounded-3xl p-6 border border-[var(--glass-border)] flex flex-col items-center justify-center overflow-hidden h-full min-h-[300px]`}>
      <h3 className="absolute top-4 left-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Diagnostic Mapping</h3>
      
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] opacity-80">
        {/* Human Silhouette Base */}
        <path 
          d="M 50 5 C 45 5 42 10 42 15 C 42 20 45 25 50 25 C 55 25 58 20 58 15 C 58 10 55 5 50 5 Z M 40 27 C 30 27 25 35 25 45 C 25 55 35 60 40 60 L 40 95 L 60 95 L 60 60 C 65 60 75 55 75 45 C 75 35 70 27 60 27 Z" 
          fill="currentColor" 
          className="text-[var(--text-secondary)] opacity-10"
        />

        {/* Highlightable Regions */}
        
        {/* Head */}
        <motion.ellipse 
          cx={regions.head.cx} cy={regions.head.cy} rx={regions.head.rx} ry={regions.head.ry}
          fill={isActive('head') ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}
          stroke={isActive('head') ? '#6366f1' : 'rgba(255,255,255,0.05)'}
          strokeWidth="0.5"
          animate={isActive('head') ? { scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Chest */}
        <motion.rect 
          x={regions.chest.x} y={regions.chest.y} width={regions.chest.width} height={regions.chest.height} rx={regions.chest.rx}
          fill={isActive('chest') ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}
          stroke={isActive('chest') ? '#6366f1' : 'rgba(255,255,255,0.05)'}
          strokeWidth="0.5"
          animate={isActive('chest') ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Abdomen */}
        <motion.rect 
          x={regions.abdomen.x} y={regions.abdomen.y} width={regions.abdomen.width} height={regions.abdomen.height} rx={regions.abdomen.rx}
          fill={isActive('abdomen') ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}
          stroke={isActive('abdomen') ? '#6366f1' : 'rgba(255,255,255,0.05)'}
          strokeWidth="0.5"
          animate={isActive('abdomen') ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Spine */}
        <motion.rect 
          x={regions.spine.x} y={regions.spine.y} width={regions.spine.width} height={regions.spine.height} rx={regions.spine.rx}
          fill={isActive('spine') ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}
          stroke={isActive('spine') ? '#6366f1' : 'rgba(255,255,255,0.05)'}
          strokeWidth="0.5"
          animate={isActive('spine') ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Limbs (Complex Path) */}
        <motion.path 
          d={regions.limbs.path}
          fill="none"
          stroke={isActive('limbs') ? '#6366f1' : 'rgba(255,255,255,0.05)'}
          strokeWidth="4"
          strokeLinecap="round"
          animate={isActive('limbs') ? { opacity: [0.4, 0.8, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {highlight && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            {regions[highlight.toLowerCase()]?.label || highlight} Active
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default AnatomyMap;
