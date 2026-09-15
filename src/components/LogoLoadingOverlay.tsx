import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Compass, Layers } from 'lucide-react';

interface LogoLoadingOverlayProps {
  statusText?: string;
}

export const LogoLoadingOverlay: React.FC<LogoLoadingOverlayProps> = ({
  statusText = 'Launching Pentagram OS Workstation...'
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Authenticating Pentagram Credentials...',
    'Initializing 3D Raytrace & CAD Engine...',
    'Loading Architecture & Studio Workspace...',
    'Connecting to Pentagram Cloud Gateway...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#FDFDFD]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-[#0F1428] select-none overflow-hidden"
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F1428 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Rotating Ambient Aura */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#D64062]/20 via-[#0F1428]/10 to-[#161D3A]/20 blur-3xl pointer-events-none"
      />

      {/* Central Animated Logo Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Architectural F Logo Mark */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer Pulsing Glowing Ring */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="absolute -inset-4 rounded-3xl bg-[#D64062]/15 border border-[#D64062]/30 blur-xs"
          />

          {/* Animated Main Logo Box */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 relative flex items-center justify-center bg-[#0F1428] text-white rounded-2xl shadow-xl border-2 border-[#D64062] overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1428] via-[#161D3A] to-[#D64062]/20" />

            {/* Rotating SVG Grid Lines */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-full h-full text-[#D64062]/20"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path d="M0 20H40M20 0V40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="0.5" />
            </motion.svg>

            {/* Animated F Mark */}
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="relative z-10 w-10 h-10 text-[#D64062] drop-shadow-[0_2px_8px_rgba(214,64,98,0.4)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path d="M4 4h14M4 4v16M4 12h10" />
              <circle cx="18" cy="4" r="1.5" fill="currentColor" />
              <circle cx="14" cy="12" r="1.5" fill="currentColor" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Animated Brand Name "foryn" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-2"
        >
          <span className="text-3xl font-extrabold tracking-tight text-[#0F1428] font-sans lowercase">
            foryn
          </span>
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full bg-[#D64062] shadow-[0_0_10px_#D64062]"
          />
        </motion.div>

        {/* Subtitle & Domain Stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-8 text-xs font-mono font-semibold text-[#D64062] bg-[#D64062]/10 px-3 py-1 rounded-full border border-[#D64062]/20 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D64062] animate-spin" />
          <span>pentagram.in</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#0F1428] font-bold">Pentagram OS</span>
        </motion.div>

        {/* Dynamic Loading Bar */}
        <div className="w-72 sm:w-80 space-y-3">
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <motion.div
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-[#D64062] via-[#0F1428] to-[#D64062] rounded-full shadow-[0_0_12px_#D64062]"
            />
          </div>

          {/* Changing Step Status Message */}
          <div className="h-6 flex items-center justify-center">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-mono text-slate-600 font-semibold text-center flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-[#D64062] animate-spin" />
              <span>{steps[currentStep]}</span>
            </motion.p>
          </div>
        </div>

        {/* Security & System Stamps at bottom */}
        <div className="mt-12 flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0F1428]" />
            <span>Pentagram OS v1.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
