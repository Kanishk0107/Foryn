import React from 'react';
import { Compass, ArrowLeft, Building, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-screen w-full bg-[#FFFAF3] dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between items-center p-6 font-sans relative overflow-hidden select-none">
      {/* Background Soft Mesh Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#F62440]/10 rounded-full blur-[140px]" />
      </div>

      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10">
        <Logo size="md" />
        <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          ERROR 404
        </span>
      </header>

      <main className="max-w-md w-full text-center space-y-6 z-10 my-auto">
        <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 text-[#F62440] flex items-center justify-center mx-auto shadow-xl">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            The studio workstation path or CAD floorplan link you requested does not exist or has been relocated.
          </p>
        </div>

        <button
          onClick={onReturnHome}
          className="px-6 py-3 rounded-2xl bg-[#F62440] hover:bg-rose-600 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-950/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Foryn Workstation</span>
        </button>
      </main>

      <footer className="text-xs text-slate-500 font-mono z-10">
        © 2026 Foryn Living Pvt. Ltd. • DLF Cyber City, Gurugram, India
      </footer>
    </div>
  );
};
