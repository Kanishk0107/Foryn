import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  onAction: () => void;
  buttonText?: string;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  onAction,
  buttonText = 'Launch Workstation'
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#FDFDFD]/95 dark:bg-[#0F1428]/95 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 select-none">
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-mono font-bold text-[#D64062] uppercase tracking-wider block truncate">
          Verdiore Interiors
        </span>
        <span className="text-xs font-bold text-[#0F1428] dark:text-[#FDFDFD] truncate block">
          3D CAD & BOQ Costing
        </span>
      </div>

      <button
        onClick={onAction}
        className="px-4 py-2.5 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
