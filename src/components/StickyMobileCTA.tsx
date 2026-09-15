import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  onAction: () => void;
  buttonText?: string;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  onAction,
  buttonText = 'Launch Workstation'
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-slate-900/95 border-t border-rose-200 dark:border-slate-800 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-mono font-bold text-[#F62440] uppercase tracking-wider block truncate">
          Foryn AI Studio
        </span>
        <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
          3D CAD & BOQ Costing
        </span>
      </div>

      <button
        onClick={onAction}
        className="px-4 py-2.5 rounded-xl bg-[#F62440] hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
