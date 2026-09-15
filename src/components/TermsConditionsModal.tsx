import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1428]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0F1428] dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <FileText className="w-6 h-6 text-[#D64062]" />
          <div>
            <h2 className="text-xl font-black text-[#0F1428] dark:text-white">Terms of Service</h2>
            <p className="text-xs text-slate-500 font-mono">Pentagram OS Platform Terms — v1.0 (2026)</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F1428] dark:text-white">1. Workstation License</h3>
            <p>
              By creating a Pentagram OS account, you are granted an enterprise workstation license to create, edit, cost, and execute 3D CAD interior projects.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F1428] dark:text-white">2. User Account Hierarchy</h3>
            <p>
              The first registered account on a studio workspace holds Main Admin privileges. All subsequent registrations are assigned Employee accounts mapped to their Primary Studio Role.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F1428] dark:text-white">3. BOQ Calculations & GST Compliance</h3>
            <p>
              Automated Bill of Quantities (BOQ) estimates incorporate 18% GST calculations. Final manufacturing costs are subject to site measurement approvals.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F1428] dark:text-white">4. Registered Business Address</h3>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <p className="font-bold">Pentagram Living Pvt. Ltd.</p>
              <p>DLF Cyber City, Phase III, Building 10, Tower B, 14th Floor</p>
              <p>Gurugram, Haryana 122002, India</p>
            </div>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0F1428] hover:bg-[#161D3A] text-white font-bold text-xs cursor-pointer transition-all"
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};
