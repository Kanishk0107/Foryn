import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import {
  Compass,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Target,
  FolderGit2,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Layers,
  Box,
  LayoutDashboard
} from 'lucide-react';

interface StudioDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  onSendToast?: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
}

export const StudioDashboard: React.FC<StudioDashboardProps> = ({
  user,
  onLogout,
  onNavigate,
  onSendToast
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    if (onSendToast) {
      onSendToast(
        'success',
        'Subscribed for Early Access!',
        'We will notify you as soon as Pentagram OS 2D Planner & 3D CAD Studio launches.'
      );
    }
  };

  return (
    <div className="space-y-8 pb-12 select-none animate-in fade-in duration-200">
      {/* Top Header & Announcement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1428] dark:text-white tracking-tight">
              Pentagram Studio <span className="text-[#D64062]">| CAD Workspace</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D64062]/10 text-[#0F1428] dark:text-[#D64062] border border-slate-200 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Under Construction
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Next-generation 2D floorplan editor and 4K photorealistic 3D raytrace viewport engine in active development.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('executive')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1428] hover:bg-[#161D3A] text-[#FDFDFD] font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Workstation</span>
          </button>
        )}
      </div>

      {/* Main Hero Card: In Development CAD Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0F1428] text-white shadow-2xl min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-12">
        {/* Background Architectural Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(214, 64, 98, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(214, 64, 98, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px'
          }}
        />

        {/* Photorealistic Kitchen Render & Blueprint Background */}
        <div
          className="absolute inset-0 opacity-75 sm:opacity-90 pointer-events-none bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('/assets/foryn_cad_coming_soon_bg.jpg')`
          }}
        />

        {/* Soft Vignette Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1428]/95 via-[#0F1428]/50 to-[#0F1428]/80 pointer-events-none" />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D64062]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#161D3A]/40 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#0F1428]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Compass className="w-4 h-4 text-[#D64062]" />
            <span className="text-xs font-mono font-bold text-slate-300">pentagram.in / studio</span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 bg-[#0F1428]/80 px-3 py-1 rounded-full border border-white/10">
            PHASE 2 CAD RELEASE
          </span>
        </div>

        {/* Center Hero "COMING SOON" Badge */}
        <div className="relative z-10 my-auto text-center space-y-6 max-w-3xl mx-auto py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-6 sm:p-8 rounded-3xl bg-[#0F1428]/80 backdrop-blur-2xl border border-white/15 shadow-2xl"
          >
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#D64062] block mb-2">
              EXPERIENCE THE FUTURE OF ARCHITECTURAL WORKSPACES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              2D PLANNER & 3D STUDIO
            </h2>
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#D64062] text-white font-mono font-extrabold text-xs tracking-wider shadow-lg shadow-[#D64062]/30 animate-pulse">
              <Sparkles className="w-4 h-4" />
              COMING SOON
            </div>
          </motion.div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Pentagram OS CAD Studio will be a high-performance, integrated workspace for architects and interior designers, providing seamless transitioning between detailed 2D floor plans and photorealistic 3D rendering.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleNotifyMe}
              disabled={isSubscribed}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#D64062]/25 transition-all cursor-pointer disabled:opacity-75"
            >
              <Bell className="w-4 h-4" />
              <span>{isSubscribed ? 'Notified on Release!' : 'Get Early Access Notification'}</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('crm')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
              >
                <span>Explore Pre-Sales CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D64062]" />
            2D Vector Engine & WebGL 3D Shader Pipeline
          </span>
          <span>Build Target: Q4 2026</span>
        </div>
      </div>

      {/* Beyond Design: More Pentagram Features Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1428] dark:text-white tracking-tight">
              Beyond Design: Pentagram OS Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore operational modules live in your workspace while CAD Studio is in development
            </p>
          </div>
          <span className="text-xs font-mono text-[#D64062] font-bold">4 LIVE MODULES</span>
        </div>

        {/* 4 Feature Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: CRM & Lead Management */}
          <div
            onClick={() => onNavigate && onNavigate('crm')}
            className="p-6 rounded-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#D64062]/50 shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#D64062]/10 border border-[#D64062]/20 text-[#D64062] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1428] dark:text-white flex items-center justify-between">
                  <span>Comprehensive CRM & Lead Management</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D64062] group-hover:translate-x-1 transition-all" />
                </h3>
                <span className="text-[11px] font-mono text-[#D64062] font-bold">CRM Dashboard</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Track client pre-sales pipeline, capture leads via website forms, and auto-convert qualified inquiries directly into project sites.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Fully Operational</span>
              <span className="font-bold text-[#D64062]">Open CRM →</span>
            </div>
          </div>

          {/* Card 2: Vendor & Supplier Catalog */}
          <div
            onClick={() => onNavigate && onNavigate('vendors')}
            className="p-6 rounded-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#D64062]/50 shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#D64062]/10 border border-[#D64062]/20 text-[#D64062] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1428] dark:text-white flex items-center justify-between">
                  <span>Vendor & Supplier Catalog</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D64062] group-hover:translate-x-1 transition-all" />
                </h3>
                <span className="text-[11px] font-mono text-[#D64062] font-bold">Procurement & Hardware BOQ</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Access catalog suppliers for interior hardware (Hettich, Hafele), assign work orders, and approve vendor milestone payments.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Fully Operational</span>
              <span className="font-bold text-[#D64062]">Open Procurement →</span>
            </div>
          </div>

          {/* Card 3: Project Timeline & Task Management */}
          <div
            onClick={() => onNavigate && onNavigate('projects')}
            className="p-6 rounded-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#D64062]/50 shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#D64062]/10 border border-[#D64062]/20 text-[#D64062] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1428] dark:text-white flex items-center justify-between">
                  <span>Project Timeline & Task Management</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D64062] group-hover:translate-x-1 transition-all" />
                </h3>
                <span className="text-[11px] font-mono text-[#D64062] font-bold">31 Execution Stages Engine</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Track site progress across 31 standardized stages, upload site progress photos, and monitor release approvals.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Fully Operational</span>
              <span className="font-bold text-[#D64062]">Open Execution →</span>
            </div>
          </div>

          {/* Card 4: Executive Finance & Payout Ledger */}
          <div
            onClick={() => onNavigate && onNavigate('finance')}
            className="p-6 rounded-2xl bg-[#FDFDFD] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#D64062]/50 shadow-xs hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#D64062]/10 border border-[#D64062]/20 text-[#D64062] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1428] dark:text-white flex items-center justify-between">
                  <span>Executive Finance & Payout Ledger</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#D64062] group-hover:translate-x-1 transition-all" />
                </h3>
                <span className="text-[11px] font-mono text-[#D64062] font-bold">HDFC RTGS & 18% GST Compliance</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Release vendor payouts, audit 18% GST calculations, and receive automated RTGS disbursement confirmations.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Fully Operational</span>
              <span className="font-bold text-[#D64062]">Open Finance →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Credentials */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#D64062]" />
          SOC2 & Cloud Encryption Verified
        </span>
        <span>pentagram.in | © Pentagram Living Pvt Ltd</span>
      </div>
    </div>
  );
};
