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
  title = 'Thank You for Choosing Foryn!',
  message = 'Your site project data has been submitted and synced with 31-Stage execution engine.'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            {title}
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#F62440] hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
        >
          <span>Return to Workstation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
