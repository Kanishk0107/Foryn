import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{
              y: 24,
              opacity: 0,
              scale: 0.92,
              filter: 'blur(10px)'
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              y: -12,
              opacity: 0,
              scale: 0.94,
              filter: 'blur(8px)'
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
              mass: 0.75,
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 }
            }}
            className="pointer-events-auto relative overflow-hidden p-4 rounded-2xl border border-white/60 dark:border-white/20 bg-white/50 dark:bg-[#0F1428]/55 backdrop-blur-3xl backdrop-saturate-200 text-[#0F1428] dark:text-white shadow-[0_16px_36px_-8px_rgba(15,20,40,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-start gap-3.5 group select-none transition-colors"
          >
            {/* Specular Edge Lens Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/[0.02] pointer-events-none" />

            {/* Icon Badges */}
            {toast.type === 'success' && (
              <div className="w-7.5 h-7.5 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-7.5 h-7.5 rounded-xl flex items-center justify-center bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 shadow-sm">
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-7.5 h-7.5 rounded-xl flex items-center justify-center bg-[#D64062]/15 border border-[#D64062]/30 text-[#D64062] dark:text-[#ff7b99] shrink-0 mt-0.5 shadow-sm">
                <Info className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 pr-1 relative z-10">
              <h4 className="text-xs sm:text-[13px] font-bold tracking-tight text-[#0F1428] dark:text-white leading-snug">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] sm:text-[12px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-[#0F1428] dark:hover:text-white p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer relative z-10"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
