import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex flex-col items-start select-none group cursor-pointer">
      <div className="flex items-center gap-2.5">
        {/* Premium Architectural F Monogram Badge */}
        <motion.div
          whileHover={{ scale: 1.04, rotate: 1 }}
          whileTap={{ scale: 0.96 }}
          className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-slate-950 text-white shadow-md border border-slate-800/80 overflow-hidden shrink-0`}
        >
          {/* Obsidian Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/80" />

          {/* Architectural Axis Crosshairs */}
          <svg
            className="absolute inset-0 w-full h-full text-rose-500/15 group-hover:text-rose-500/30 transition-colors"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M0 20H40M20 0V40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* Stylized Luxury Geometric F Emblem */}
          <svg
            className="relative z-10 w-3/5 h-3/5 text-rose-500 group-hover:scale-105 transition-transform drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h15M4 4v16M4 12h11" />
            <circle cx="19" cy="4" r="1.5" fill="currentColor" />
            <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Brand Typography */}
        <div className="flex items-center gap-1.5">
          <span
            className={`${textSizes[size]} font-black tracking-tight text-slate-900 dark:text-white font-sans lowercase flex items-center`}
          >
            foryn
          </span>
          {/* Vibrant Glowing Brand Pulse Node */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        </div>
      </div>

      {showSubtitle && (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 pl-0.5">
          Enterprise Interior & Architecture Studio
        </span>
      )}
    </div>
  );
};
