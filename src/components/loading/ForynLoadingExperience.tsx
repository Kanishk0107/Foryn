import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export interface ForynLoadingExperienceProps {
  onComplete?: () => void;
  statusHeadline?: string;
  minDurationMs?: number;
}

export const ForynLoadingExperience: React.FC<ForynLoadingExperienceProps> = ({
  onComplete,
  statusHeadline = 'Initializing Workspace',
  minDurationMs = 1200
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / minDurationMs) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 200);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[99999] bg-[#FDFDFD] text-[#0F1428] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Centered Minimalist Brand Emblem */}
      <div className="flex flex-col items-center space-y-6 text-center max-w-sm">
        {/* Foryn Geometric Logo Monogram */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0F1428] flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-[#D64062]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h14M4 4v16M4 12h10" />
              <circle cx="18" cy="4" r="1.5" fill="currentColor" />
              <circle cx="14" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 text-2xl font-black text-[#0F1428] font-sans lowercase tracking-tight">
            <span>foryn</span>
            <span className="w-2 h-2 rounded-full bg-[#D64062]" />
          </div>
        </motion.div>

        {/* Minimal Progress Line & Status */}
        <div className="w-48 space-y-2.5 pt-2">
          {/* Razor-thin Minimal Progress Track */}
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[#0F1428] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Minimal Subtext */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold tracking-tight">
            <span>{statusHeadline}</span>
            <span className="text-[#D64062] font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
