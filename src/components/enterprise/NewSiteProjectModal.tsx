import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, Sparkles, FolderPlus, ShieldCheck } from 'lucide-react';

interface NewSiteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScaffoldProject: (projectTitle: string, clientName: string, budgetLakhs: number) => void;
}

export const NewSiteProjectModal: React.FC<NewSiteProjectModalProps> = ({
  isOpen,
  onClose,
  onScaffoldProject
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [propertyType, setPropertyType] = useState('4BHK Luxury Villa');
  const [budgetLakhs, setBudgetLakhs] = useState<number>(35);
  const [location, setLocation] = useState('DLF Phase 5, Gurgaon');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const fullTitle = `${projectTitle.trim()} - ${clientName.trim() || 'Client Site'}`;
    onScaffoldProject(fullTitle, clientName.trim() || 'Client Site', budgetLakhs);

    // Reset & Close
    setProjectTitle('');
    setClientName('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1428]/70 backdrop-blur-xs p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#FDFDFD] dark:bg-[#0F1428] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#0F1428] via-[#161D3A] to-[#0F1428] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#D64062]/20 text-[#D64062] border border-[#D64062]/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">Scaffold New Site Project</h3>
                <p className="text-[11px] text-slate-300">Initialize 31-stage lifecycle engine & PID registry</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-extrabold text-[#0F1428] dark:text-slate-200 uppercase tracking-wider text-[10px]">
                Site / Project Title *
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Villa Penthouse 402"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#0F1428] dark:text-slate-100 font-semibold focus:outline-none focus:border-[#D64062]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-[#0F1428] dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Siddharth Malhotra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#0F1428] dark:text-slate-100 font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#0F1428] dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#0F1428] dark:text-slate-100 font-bold focus:outline-none"
                >
                  <option value="4BHK Luxury Villa">4BHK Luxury Villa</option>
                  <option value="3BHK Penthouse Niche">3BHK Penthouse Niche</option>
                  <option value="Modular Kitchen & Living">Modular Kitchen & Living</option>
                  <option value="Commercial Interior Studio">Commercial Interior Studio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-[#0F1428] dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  Estimated Budget (₹ Lakhs)
                </label>
                <input
                  type="number"
                  value={budgetLakhs}
                  onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#0F1428] dark:text-slate-100 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#0F1428] dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  Location / Hub
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gurgaon / Bangalore"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#0F1428] dark:text-slate-100 font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Scaffold Site Project</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
