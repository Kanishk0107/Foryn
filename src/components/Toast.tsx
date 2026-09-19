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
              y: 30,
              x: 20,
              opacity: 0,
              scale: 0.9,
              filter: 'blur(12px)'
            }}
            animate={{
              y: 0,
              x: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              y: -16,
              opacity: 0,
              scale: 0.93,
              filter: 'blur(10px)'
            }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 24,
              mass: 0.65,
              opacity: { duration: 0.22 },
              filter: { duration: 0.25 }
            }}
            className="pointer-events-auto relative overflow-hidden p-4 rounded-2xl border border-white/40 dark:border-white/15 bg-white/80 dark:bg-[#0F1428]/85 backdrop-blur-3xl backdrop-saturate-200 text-[#0F1428] dark:text-white shadow-[0_20px_50px_-10px_rgba(15,20,40,0.18)] dark:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)] flex items-start gap-3.5 group select-none transition-all duration-300"
          >
            {/* Liquid Glass Ambient Highlights */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.03] dark:from-white/10 dark:to-transparent pointer-events-none" />

            {/* Glowing Liquid Glass Icon Badge */}
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#D64062]/10 border border-[#D64062]/30 text-[#D64062] dark:text-[#ff7b99] shrink-0 mt-0.5 shadow-[0_0_15px_rgba(214,64,98,0.25)]">
                <Info className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 pr-1 relative z-10">
              <h4 className="text-xs sm:text-[13px] font-extrabold tracking-tight text-[#0F1428] dark:text-white leading-snug">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] sm:text-[12px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed font-semibold">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Dismiss Action */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-[#0F1428] dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer relative z-10"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
