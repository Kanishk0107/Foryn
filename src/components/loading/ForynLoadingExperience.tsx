import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
  Building2,
  Box,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { SpatialWireframeCanvas, LoadingStage } from './SpatialWireframeCanvas';

export interface ForynLoadingExperienceProps {
  onComplete?: () => void;
  realProgress?: number; // 0 to 100 optional real progress
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  statusHeadline?: string;
  minDurationMs?: number;
  isSimulated?: boolean;
}

interface StageMetadata {
  stage: LoadingStage;
  label: string;
  targetProgress: number;
  subtext: string;
  cadMetric: string;
}

const STAGES: StageMetadata[] = [
  {
    stage: 'BOOT',
    label: 'Initializing Workspace Engine',
    targetProgress: 14,
    subtext: 'Verifying cryptographic security token and enterprise workspace cache...',
    cadMetric: 'SYS_BOOT • OK'
  },
  {
    stage: 'BRAND_REVEAL',
    label: 'Calibrating Spatial Coordinate Matrix',
    targetProgress: 28,
    subtext: 'Aligning 3D raytrace viewport and metric grid scale (1:50)...',
    cadMetric: 'GRID: 20x20mm • XYZ'
  },
  {
    stage: 'ENGINE_INITIALIZATION',
    label: 'Loading 3D Spatial Workspace',
    targetProgress: 48,
    subtext: 'Initializing parametric room geometries and lighting environment...',
    cadMetric: 'RAYTRACE: VULKAN 64-BIT'
  },
  {
    stage: 'DESIGN_TOOLS',
    label: 'Preparing Precision CAD & Design Tools',
    targetProgress: 68,
    subtext: 'Registering architectural wall snapping primitives and vector constraints...',
    cadMetric: 'CAD_SNAP • ACTIVE'
  },
  {
    stage: 'PROJECT_DATA',
    label: 'Connecting Project Schemas & BOQ Data',
    targetProgress: 86,
    subtext: 'Syncing project costing registers, material schedules, and GST ledger...',
    cadMetric: 'SYNC: 100% ENCRYPTED'
  },
  {
    stage: 'AI_READY',
    label: 'Activating Spatial AI Assistant',
    targetProgress: 98,
    subtext: 'Neural spatial layout optimization and auto-dimensioning engine online...',
    cadMetric: 'AI_AGENT: READY'
  },
  {
    stage: 'COMPLETE',
    label: 'Workspace Assembled & Ready',
    targetProgress: 100,
    subtext: 'Transitioning to Foryn OS Studio Canvas...',
    cadMetric: 'SYSTEM_STATUS: NOMINAL'
  }
];

export const ForynLoadingExperience: React.FC<ForynLoadingExperienceProps> = ({
  onComplete,
  realProgress,
  isError = false,
  errorMessage = 'Unable to establish secure handshake with Foryn Cloud Gateway.',
  onRetry,
  statusHeadline = 'Turning Ideas Into Beautiful Spaces',
  minDurationMs = 2400,
  isSimulated = true
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  // Stage progress timer orchestration
  useEffect(() => {
    if (isError) return;

    if (realProgress !== undefined && !isSimulated) {
      setProgress(realProgress);
      if (realProgress >= 100 && !isCompleted) {
        setCurrentStageIndex(STAGES.length - 1);
        setIsCompleted(true);
        const timer = setTimeout(() => {
          onComplete?.();
        }, 500);
        return () => clearTimeout(timer);
      }
      // Calculate active stage from real progress
      const matchedStage = STAGES.findIndex((s) => realProgress <= s.targetProgress);
      if (matchedStage !== -1) {
        setCurrentStageIndex(matchedStage);
      }
      return;
    }

    // Step-by-step sequential deterministic progression
    const stepDuration = minDurationMs / STAGES.length;
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          const next = prev + 1;
          setProgress(STAGES[next].targetProgress);
          return next;
        } else {
          clearInterval(interval);
          setIsCompleted(true);
          setTimeout(() => {
            onComplete?.();
          }, 450);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isError, realProgress, minDurationMs, isSimulated, isCompleted, onComplete]);

  const activeStage = STAGES[currentStageIndex];

  return (
    <motion.div
      layoutId="foryn-workspace-viewport"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: reducedMotion ? 1 : 1.04,
        filter: reducedMotion ? 'none' : 'blur(4px)',
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-[100] bg-[#FDFDFD] text-[#0F1428] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Precision CAD Background Grid & Corner Registration Ticks */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F1428 1px, transparent 1px),
            linear-gradient(to bottom, #0F1428 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Subtle Center Architectural Aura (#D64062 & #0F1428 glow) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.28, 0.15]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#D64062]/10 via-[#0F1428]/5 to-transparent blur-3xl pointer-events-none"
      />

      {/* TOP BAR / HEADER: Editorial Metadata & Geometric Brand Stamp */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2">
        {/* FORYN Logo & Studio Wordmark (Morph Anchor) */}
        <motion.div
          layoutId="foryn-brand-monogram"
          className="flex items-center gap-3.5 group cursor-default"
        >
          {/* Geometric Emblem Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#0F1428] flex items-center justify-center border border-[#0F1428] shadow-md relative overflow-hidden">
            {/* Fine Blueprint Subgrid */}
            <svg className="absolute inset-0 w-full h-full text-white/10" viewBox="0 0 40 40">
              <path d="M0 20H40M20 0V40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
            {/* Sharp Architectural F Monogram */}
            <svg
              className="w-5 h-5 text-[#D64062] relative z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h14M4 4v16M4 12h10" />
              <circle cx="18" cy="4" r="1.5" fill="currentColor" />
              <circle cx="14" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#0F1428] font-sans lowercase">
                foryn
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D64062]" />
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider">
                STUDIO OS
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-medium tracking-tight">
              Spatial Architecture & CAD Engine
            </span>
          </div>
        </motion.div>

        {/* Live System Handshake Status Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-[#0F1428] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D64062] animate-pulse" />
            <span>{activeStage.cadMetric}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F1428] text-white text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D64062]" />
            <span>256-BIT VAULT</span>
          </div>
        </div>
      </header>

      {/* CENTRAL EDITORIAL LOADING COMPOSITION */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-6">
        <AnimatePresence mode="wait">
          {isError ? (
            /* Error Recovery Card */
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#FDFDFD] border-2 border-[#D64062] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D64062]/10 border border-[#D64062]/20 flex items-center justify-center text-[#D64062]">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-black text-[#0F1428]">
                  Initialization Interrupted
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Connection</span>
                  </button>
                )}
                <button
                  onClick={() => onComplete?.()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F1428] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Work Offline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Standard High-Precision Morphing Stage */
            <motion.div
              key="active-loading-stage"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center space-y-6 sm:space-y-8 w-full max-w-xl"
            >
              {/* Morphing Spatial 3D / 2D Floorplan CAD Wireframe Box */}
              <div className="relative">
                <SpatialWireframeCanvas
                  stage={activeStage.stage}
                  progress={progress}
                  reducedMotion={reducedMotion}
                />
              </div>

              {/* Editorial Statement & Stage Hierarchy */}
              <div className="space-y-2 max-w-lg px-4">
                {/* Editorial Subtitle / Tagline */}
                <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#D64062] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64062]" />
                  <span>{statusHeadline}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64062]" />
                </div>

                {/* Main Dynamic Stage Headline */}
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={activeStage.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F1428]"
                  >
                    {activeStage.label}
                  </motion.h1>
                </AnimatePresence>

                {/* Explanatory Technical Subtext */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeStage.subtext}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-slate-500 font-sans max-w-md mx-auto leading-relaxed"
                  >
                    {activeStage.subtext}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Precision Architectural Progress Indicator */}
              <div className="w-full max-w-sm px-4 space-y-3">
                {/* Numeric Metric & Stage Progress Header */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0F1428] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#D64062]" />
                    <span>STAGE {currentStageIndex + 1} / {STAGES.length}</span>
                  </span>
                  <span className="font-black text-[#D64062]">
                    {progress}%
                  </span>
                </div>

                {/* Progress Track & Animated Morph Bar */}
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#0F1428] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Leading Laser Highlight Pin */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-2 bg-[#D64062] rounded-full shadow-[0_0_8px_#D64062]"
                    initial={{ left: '0%' }}
                    animate={{ left: `calc(${progress}% - 8px)` }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Stage Steps Breadcrumb Pills */}
                <div className="flex items-center justify-center gap-1 pt-1">
                  {STAGES.map((s, idx) => (
                    <div
                      key={s.stage}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentStageIndex
                          ? 'w-6 bg-[#D64062]'
                          : idx < currentStageIndex
                          ? 'w-2 bg-[#0F1428]'
                          : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER: Technical Credentials & Architectural Software Meta */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#0F1428]">FORYN ARCHITECTURAL CAD OS</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline">BUILD v2.4.0 (x64 RELEASE)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#D64062]" />
            <span>WebGL 2.0 / GPU Accelerated</span>
          </div>
          <span>•</span>
          <span>© Foryn Living Pvt Ltd</span>
        </div>
      </footer>
    </motion.div>
  );
};
