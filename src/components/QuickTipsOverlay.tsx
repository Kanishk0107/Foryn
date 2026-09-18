import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronRight
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

const ROLE_SHORT: Record<string, string> = {
  'Sales Lead': 'CRM',
  'Designer Team': 'Design',
  'Project Management': 'PM',
  'Finance Team': 'Finance',
  'Architect': 'Arch',
  'Admin': 'Admin'
};

const COMPREHENSIVE_SOP_TIPS: Record<string, SopStep[]> = {
  'Sales Lead': [
    {
      sopCode: 'SOP-CRM-01',
      title: 'Inbound Qualification & PID Assignment',
      badge: 'Pre-Sales',
      checklist: [
        'Ingest inbound lead from Meta / IG Ads or walk-in inquiry.',
        'Verify auto-generated 4-digit numeric PID (e.g. #1001).',
        'Record property type, location, and estimated budget in Lakhs.'
      ],
      proTip: 'Never reuse a PID. The system enforces unique 4-digit numbering across CRM, BOQ, and Finance.'
    },
    {
      sopCode: 'SOP-CRM-02',
      title: 'Discovery Call & Call Log Auditing',
      badge: 'Client Engagement',
      checklist: [
        'Schedule discovery call within 2 hours of lead capture.',
        'Log call duration, transcript notes, and client preference tags.',
        'Mark follow-up reminders with urgency flags.'
      ],
      proTip: 'Leads with completed call logs convert 3.2x faster to site contract freeze.'
    },
    {
      sopCode: 'SOP-CRM-03',
      title: 'Promoting Lead to Active Site',
      badge: 'Site Handoff',
      checklist: [
        'Review 3D moodboard presentation signoff from client.',
        'Click Promote to Sales Team to initiate handoff.',
        'Triggers automatic provisioning in 31-Stage Engine and Master BOQ Studio.'
      ],
      proTip: 'Promoting a lead notifies the Design Lead and PM to initiate the 2D floorplan survey.'
    }
  ],
  'Designer Team': [
    {
      sopCode: 'SOP-DES-01',
      title: '2D Architectural Layout & CAD Layer Control',
      badge: 'Concept & 2D',
      checklist: [
        'Import DWG/DXF floorplan into CAD Studio Workstation.',
        'Group elements under standard layers: Walls, Joinery, Electrical, Plumbing.',
        'Verify scale 1:50 and IS:13920 structural code compliance.'
      ],
      proTip: 'Use frozen layers for structural load walls to prevent accidental repositioning during iterations.'
    },
    {
      sopCode: 'SOP-DES-02',
      title: 'Master BOQ Line Item Costing & 18% GST',
      badge: 'BOQ Engine',
      checklist: [
        'Specify material unit rate and labor unit rate per line item.',
        'Set contractor markup margin (default 25%).',
        'Verify automated 18% GST output and grand total calculations.'
      ],
      proTip: 'High-variance materials like Statuario marble automatically surface in the Executive Leakage Guard.'
    },
    {
      sopCode: 'SOP-DES-03',
      title: '3D Raytrace Render & GFC Client Freeze',
      badge: 'Design Freeze',
      checklist: [
        'Apply PBR shaders: Teak veneer, Italian marble, matte acrylic.',
        'Set photometric lighting Kelvin temperature (2000K – 6500K).',
        'Export printable GFC client quotation PDF with digital signoff.'
      ],
      proTip: 'Freezing design at Stage 8 prevents costly scrap wastage during factory joinery production.'
    }
  ],
  'Architect': [
    {
      sopCode: 'SOP-ARC-01',
      title: 'BIM Structural Wall Specification',
      badge: 'BIM Engineering',
      checklist: [
        'Configure Revit BIM wall types: thickness mm, fire rating, cost/sqm.',
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
        'Run reverberation acoustic check for penthouse living zones.'
      ],
      proTip: 'Daylight mode (5500K) exposes CRI 95+ accuracy for wood veneer color matching.'
    }
  ],
  'Project Management': [
    {
      sopCode: 'SOP-PM-01',
      title: '31-Stage Gate Certification',
      badge: 'Stage-Gate Engine',
      checklist: [
        'Track site progress across 6 macro phases and 31 stage gates.',
        'Log physical completion and upload site inspection photos.',
        'Click Certify Gate to unlock the next workflow stage.'
      ],
      proTip: 'Gate signoff automatically triggers downstream vendor work orders and material requisitions.'
    },
    {
      sopCode: 'SOP-PM-02',
      title: 'Vendor Work Order & Milestone Approval',
      badge: 'Procurement PM',
      checklist: [
        'Assign contractors to site work categories: Modular, Civil, Electrical, Paint.',
        'Inspect completed milestone against BOQ quality specs.',
        'Click Approve Vendor Payment to queue payout for Finance clearance.'
      ],
      proTip: 'Approving PM payment automatically dispatches transactional approval receipts to contractor finance.'
    }
  ],
  'Finance Team': [
    {
      sopCode: 'SOP-FIN-01',
      title: 'PM-Approved Payout Queue & GST Ledger',
      badge: 'Commercial Accounts',
      checklist: [
        'Audit vendor milestone payout requests submitted by Site PM.',
        'Verify 18% GST tax ledger breakdown and net payable amount.',
        'Confirm HDFC RTGS/NEFT transaction reference number is generated.'
      ],
      proTip: 'Never release payout without PM site gate certification on record.'
    },
    {
      sopCode: 'SOP-FIN-02',
      title: 'RTGS Bank Disbursement & Receipt Dispatch',
      badge: 'Banking & Audit',
      checklist: [
        'Click Release Payout to disburse funds to vendor bank account.',
        'System automatically dispatches RTGS payment receipt to vendor.',
        'Export Excel / CSV tax ledgers for quarterly GST filing.'
      ],
      proTip: 'Check the Email Console to inspect real-time SendGrid / SMTP dispatch logs.'
    }
  ],
  'Admin': [
    {
      sopCode: 'SOP-ADM-01',
      title: 'Supabase Security & RLS Policy Governance',
      badge: 'Enterprise Security',
      checklist: [
        'Run supabase_schema.sql in Supabase Cloud Dashboard.',
        'Verify Row Level Security policies across all 7 PostgreSQL tables.',
        'Audit team member roles: Sales Lead, Designer, PM, Finance, Architect.'
      ],
      proTip: 'Switch roles from the Profile menu to test role-gated workspace view isolation.'
    },
    {
      sopCode: 'SOP-ADM-02',
      title: 'Workspace Environment & Self-Testing Reset',
      badge: 'Ops Management',
      checklist: [
        'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
        'Use Clear All Data in Role Menu for a clean slate manual input test.',
        'Run Command Palette (Ctrl+K) to trigger Production Readiness Audit.'
      ],
      proTip: 'Restoring demo data takes one click via Restore Demo Data in the top bar.'
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
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1428]/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-[#FDFDFD] border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90dvh' }}
      >
        {/* ── Header ── */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F1428] flex items-center justify-center">
              <span className="text-[10px] font-black text-[#D64062] font-mono">SOP</span>
            </div>
            <div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                Platform Guide
              </p>
              <h3 className="text-sm font-black text-[#0F1428] leading-none mt-0.5">
                Foryn Execution SOP
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F1428] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Role Switcher ── */}
        <div className="px-5 py-2.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {ALL_ROLES.map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                onClick={() => {
                  setSelectedRole(r);
                  setCurrentStep(0);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0F1428] text-white border-[#0F1428]'
                    : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-[#0F1428] bg-white'
                }`}
              >
                {ROLE_SHORT[r] || r}
              </button>
            );
          })}
        </div>

        {/* ── SOP Content ── */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Step meta row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-slate-100 text-[#0F1428] border border-slate-200">
                {activeSop.sopCode}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D64062]/10 text-[#D64062]">
                {activeSop.badge}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {currentStep + 1} / {currentSopList.length}
            </span>
          </div>

          {/* Step title */}
          <AnimatePresence mode="wait">
            <motion.h4
              key={activeSop.title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-base font-black text-[#0F1428] leading-snug"
            >
              {activeSop.title}
            </motion.h4>
          </AnimatePresence>

          {/* Checklist */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSop.sopCode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-2"
            >
              {activeSop.checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D64062] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pro tip */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <ChevronRight className="w-3.5 h-3.5 text-[#D64062] shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-black text-[#0F1428]">Pro — </span>
              {activeSop.proTip}
            </p>
          </div>

          {/* Keyboard shortcut strip */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px]">Ctrl+K</kbd>
              <span>Command Palette</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px]">Esc</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>

        {/* ── Footer nav ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0F1428] disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {currentSopList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-5 h-1.5 bg-[#D64062]'
                    : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0F1428] hover:bg-[#161D3A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>{currentStep === currentSopList.length - 1 ? 'Done' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
