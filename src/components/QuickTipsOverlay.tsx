import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Target,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  HardHat,
  Receipt,
  Layers,
  Command,
  BookOpen,
  CheckSquare
} from 'lucide-react';

interface QuickTipsOverlayProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface SopStep {
  title: string;
  badge: string;
  sopCode: string;
  checklist: string[];
  proTip: string;
}

const ALL_ROLES: UserRole[] = [
  'Sales Lead',
  'Designer Team',
  'Project Management',
  'Finance Team',
  'Architect',
  'Admin' as UserRole
];

const COMPREHENSIVE_SOP_TIPS: Record<string, SopStep[]> = {
  'Sales Lead': [
    {
      sopCode: 'SOP-CRM-01',
      title: '🎯 Inbound Qualification & PID Assignment',
      badge: 'Pre-Sales',
      checklist: [
        'Ingest inbound lead from Meta/IG Ads or walk-in inquiry.',
        'Verify auto-generated 4-digit numeric PID (e.g. #1001).',
        'Record property type, location, and estimated budget in Lakhs (₹).'
      ],
      proTip: 'Never reuse a PID. The system auto-enforces unique 4-digit numbering across CRM, BOQ, and Finance.'
    },
    {
      sopCode: 'SOP-CRM-02',
      title: '📞 Discovery Call & Call Log Auditing',
      badge: 'Client Engagement',
      checklist: [
        'Schedule discovery call with client within 2 hours of lead capture.',
        'Log call duration, transcript notes, and client preference tags.',
        'Mark follow-up reminders with urgency flags.'
      ],
      proTip: 'Leads with completed call logs convert 3.2x faster to site contract freeze.'
    },
    {
      sopCode: 'SOP-CRM-03',
      title: '🚀 Promoting Lead to Active Site',
      badge: 'Site Handoff',
      checklist: [
        'Review 3D moodboard presentation signoff from client.',
        'Click "Promote to Sales Team" to promote lead.',
        'Triggers automatic provisioning in 31-Stage Engine and Master BOQ Studio.'
      ],
      proTip: 'Promoting a lead automatically notifies the Design Lead & PM to initiate 2D floorplan survey.'
    }
  ],
  'Designer Team': [
    {
      sopCode: 'SOP-DES-01',
      title: '📐 2D Architectural Layout & CAD Layer Control',
      badge: 'Concept & 2D',
      checklist: [
        'Import DWG/DXF floorplan into CAD Studio Workstation.',
        'Group elements under standard AutoCAD layers (Walls, Joinery, Electrical, Plumbing).',
        'Verify scale 1:50 and IS:13920 structural code compliance.'
      ],
      proTip: 'Use frozen layers for structural load walls to prevent accidental repositioning during client iterations.'
    },
    {
      sopCode: 'SOP-DES-02',
      title: '📊 Master BOQ Line Item Costing & 18% GST',
      badge: 'BOQ Engine',
      checklist: [
        'Specify material unit rate and labor unit rate per line item.',
        'Set contractor markup margin % (default 25%).',
        'Verify automated 18% GST output and grand total calculations.'
      ],
      proTip: 'High-variance materials like Statuario marble automatically surface in the Executive Leakage Guard.'
    },
    {
      sopCode: 'SOP-DES-03',
      title: '✨ 3D Raytrace Render & Client GFC Freeze',
      badge: 'Design Freeze',
      checklist: [
        'Apply 3ds Max PBR shaders (Teak veneer, Italian marble, matte acrylic).',
        'Set photometric lighting Kelvin temperature (2000K-6500K).',
        'Export printable GFC client quotation PDF with digital signoff.'
      ],
      proTip: 'Freezing design at Stage 8 prevents costly scrap wastage during factory joinery production.'
    }
  ],
  'Architect': [
    {
      sopCode: 'SOP-ARC-01',
      title: '🏛️ BIM Structural Wall Specification',
      badge: 'BIM Engineering',
      checklist: [
        'Configure Revit BIM wall types (thickness mm, fire rating, cost/sqm).',
        'Set floor levels and elevation Z-height offsets.',
        'Audit structural core materials vs veneer finish layers.'
      ],
      proTip: 'Synchronize wall cutouts with MEP plumbing lines before issuing GFC drawings.'
    },
    {
      sopCode: 'SOP-ARC-02',
      title: 'IES Photometric Lighting & Acoustic Simulation',
      badge: 'Environmental Design',
      checklist: [
        'Place IES lights with lumen output and beam angle parameters.',
        'Simulate cove ceiling lighting rays and daylight sunbeam shafts.',
        'Perform reverberation acoustic check for penthouse living zones.'
      ],
      proTip: 'Daylight mode (5500K) exposes color rendering index (CRI 95+) accuracy for wood veneers.'
    }
  ],
  'Project Management': [
    {
      sopCode: 'SOP-PM-01',
      title: '🏗️ 31-Stage Gate Certification',
      badge: 'Stage-Gate Engine',
      checklist: [
        'Track site progress through 6 macro phases and 31 stage gates.',
        'Log physical completion % and upload site inspection photos.',
        'Click "Certify Gate" to unlock the next workflow stage.'
      ],
      proTip: 'Gate signoff automatically triggers downstream vendor work orders and material requisitions.'
    },
    {
      sopCode: 'SOP-PM-02',
      title: '🔨 Vendor Work Order & Milestone Approval',
      badge: 'Procurement PM',
      checklist: [
        'Assign contractors to site work categories (Modular, Civil, Electrical, Paint).',
        'Inspect completed site milestone against BOQ quality specs.',
        'Click "Approve Vendor Payment" to queue payout for Finance Team clearance.'
      ],
      proTip: 'Approving PM payment automatically emails transactional approval receipts to contractor finance.'
    }
  ],
  'Finance Team': [
    {
      sopCode: 'SOP-FIN-01',
      title: '💳 PM-Approved Payout Queue & 18% GST Ledger',
      badge: 'Commercial Accounts',
      checklist: [
        'Audit vendor milestone payout requests submitted by Site PM.',
        'Verify 18% GST tax ledger breakdown and net payable amount.',
        'Ensure HDFC RTGS/NEFT transaction ref number is generated.'
      ],
      proTip: 'Never release payout without PM site gate certification.'
    },
    {
      sopCode: 'SOP-FIN-02',
      title: '🏦 RTGS Bank Disbursement & Receipt Dispatch',
      badge: 'Banking & Audit',
      checklist: [
        'Click "Release Payout" to disburse funds to vendor bank account.',
        'System automatically emails RTGS payment receipt to vendor.',
        'Export Excel/CSV tax ledgers for quarterly GST filing.'
      ],
      proTip: 'Check the top bar Email Console to inspect real-time SendGrid/SMTP dispatch logs.'
    }
  ],
  'Admin': [
    {
      sopCode: 'SOP-ADM-01',
      title: '🛡️ Supabase Security & RLS Policy Governance',
      badge: 'Enterprise Security',
      checklist: [
        'Run `supabase_schema.sql` script in Supabase Cloud Dashboard.',
        'Verify Row Level Security (RLS) policies across all 7 PostgreSQL tables.',
        'Audit team member roles (`Sales Lead`, `Designer`, `PM`, `Finance`, `Architect`).'
      ],
      proTip: 'Use the Role Switcher in top navigation bar to test role-gated workspace views.'
    },
    {
      sopCode: 'SOP-ADM-02',
      title: '⚡ Workspace Environment & Self-Testing Reset',
      badge: 'Ops Management',
      checklist: [
        'Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.',
        'Use "Clear All Data (Self-Test)" in Role Menu for clean slate manual input.',
        'Run Command Palette (`Ctrl+K`) $\\to$ "Run Production Readiness Audit" for diagnostic check.'
      ],
      proTip: 'Restoring demo data takes 1 click via "Restore Demo Data" in top bar.'
    }
  ]
};

export const QuickTipsOverlay: React.FC<QuickTipsOverlayProps> = ({
  role,
  isOpen,
  onClose
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentSopList = COMPREHENSIVE_SOP_TIPS[selectedRole] || COMPREHENSIVE_SOP_TIPS['Sales Lead'];
  const activeSop = currentSopList[Math.min(currentStep, currentSopList.length - 1)];

  const handleNext = () => {
    if (currentStep < currentSopList.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md font-sans select-none animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--foryn-accent)] text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono font-extrabold text-[var(--foryn-accent)] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Standard Operating Procedures (SOP)
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Foryn Platform SOP & Execution Guide
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Role Switcher Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ALL_ROLES.map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                onClick={() => {
                  setSelectedRole(r);
                  setCurrentStep(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--foryn-accent)] text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>{r}</span>
              </button>
            );
          })}
        </div>

        {/* SOP Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Step Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-900 text-[#0F1428] dark:text-slate-300 border border-slate-200 dark:border-slate-200">
                {activeSop.sopCode}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase tracking-wider">
                {activeSop.badge}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              SOP Step {currentStep + 1} of {currentSopList.length}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {activeSop.title}
            </h4>
          </div>

          {/* Standard Operating Checklist */}
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <CheckSquare className="w-3.5 h-3.5 text-[var(--foryn-accent)]" />
              <span>Standard Operating Procedure Checklist</span>
            </div>

            {activeSop.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#D64062] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Pro Tip Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-200 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#0F1428] dark:text-[#D64062] shrink-0 mt-0.5" />
            <div className="text-xs text-[#0F1428] dark:text-slate-200 leading-relaxed">
              <strong className="font-bold">Engineer Pro-Tip: </strong>
              {activeSop.proTip}
            </div>
          </div>

          {/* Platform Keyboard Shortcuts Cheatsheet Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">Ctrl+K</kbd>
                <span>Command Palette</span>
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">Esc</kbd>
                <span>Close Overlay</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous SOP</span>
          </button>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {currentSopList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-[var(--foryn-accent)]'
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-[var(--foryn-accent)] hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>{currentStep === currentSopList.length - 1 ? 'Complete Tour' : 'Next SOP Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
