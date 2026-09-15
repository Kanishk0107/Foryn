import React from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  title = 'Thank You for Choosing Pentagram OS!',
  message = 'Your site project data has been submitted and synced with 31-Stage execution engine.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1428]/70 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0F1428] dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#0F1428] dark:text-white flex items-center justify-center gap-1.5">
            {title}
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2 cursor-pointer"
        >
          <span>Return to Workstation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
