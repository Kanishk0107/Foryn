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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{
              x: 160,
              opacity: 0,
              scale: 0.85,
              filter: 'blur(12px)'
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              x: 140,
              opacity: 0,
              scale: 0.82,
              filter: 'blur(16px)'
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
              mass: 0.8,
              opacity: { duration: 0.25 },
              filter: { duration: 0.3 }
            }}
            className="pointer-events-auto relative overflow-hidden p-4 rounded-[22px] border border-slate-700/60 bg-[#0B0F19]/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex items-start gap-3.5 group"
          >
            {/* Top ambient highlight glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Icon badge */}
            {toast.type === 'success' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-500 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(214,64,98,0.25)]">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
                <Info className="w-4 h-4 stroke-[2.2]" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 pr-1">
              <h4 className="text-xs sm:text-[13px] font-bold tracking-tight text-white leading-snug">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-[11px] sm:text-[12px] text-slate-300/90 mt-1 leading-relaxed font-normal">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close action */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1"
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

