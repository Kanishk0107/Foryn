import React from 'react';
import { X, ShieldCheck, Lock, Building } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#F62440]" />
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Privacy Policy</h2>
            <p className="text-xs text-slate-500 font-mono">Effective Date: September 15, 2026</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Ownership & Security</h3>
            <p>
              Foryn Technologies Pvt. Ltd. ("Foryn", "we", "our") respects your privacy. All 3D CAD blueprints, BOQ estimates, and client data are stored using 256-bit AES encryption at rest and TLS 1.3 in transit via Supabase Cloud infrastructure.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Information Collection</h3>
            <p>
              We collect information provided directly during registration, including your full name, work email address, selected Primary Studio Role, and studio workstation usage metrics.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Third-Party Integrations</h3>
            <p>
              Google OAuth authentication is processed securely through Google Identity Services. We do not sell or share client interior blueprints or financial ledger records with external advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">4. Registered Contact Address</h3>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <p className="font-bold">Pentagram Living Pvt. Ltd. (Foryn Studio HQ)</p>
              <p>DLF Cyber City, Phase III, Building 10, Tower B, 14th Floor</p>
              <p>Gurugram, Haryana 122002, India</p>
              <p>Contact Email: privacy@foryn.in | Phone: +91 124 489 9000</p>
            </div>
          </section>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
