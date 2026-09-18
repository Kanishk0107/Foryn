import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { ArrowLeft, Layers, Box, Sparkles } from 'lucide-react';

interface StudioDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  onSendToast?: (type: 'success' | 'info' | 'error', title: string, desc?: string) => void;
}

// ─── Cinematic Interior SVG Canvas ───────────────────────────────────────────
// Phase 1 (0-3.2s): 2D blueprint floor plan
// Phase 2 (3.2-5s): Geometry extruding (transition)
// Phase 3 (5-10s): Full isometric 3D interior, then loops
const InteriorCanvas: React.FC<{ phase: 'plan' | 'rising' | 'iso' }> = ({ phase }) => (
  <svg
    viewBox="0 0 900 580"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 w-full h-full"
    style={{ willChange: 'transform' }}
  >
    <defs>
      {/* Blueprint micro-grid */}
      <pattern id="g1" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0L0 0 0 24" fill="none" stroke="#D64062" strokeWidth="0.25" strokeOpacity="0.18" />
      </pattern>
      <pattern id="g2" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="url(#g1)" />
        <path d="M120 0L0 0 0 120" fill="none" stroke="#D64062" strokeWidth="0.6" strokeOpacity="0.28" />
      </pattern>
      {/* Crimson glow filter */}
      <filter id="cglow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Soft fill glow */}
      <filter id="sglow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      {/* Window light gradient */}
      <linearGradient id="winlight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D64062" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#D64062" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Grid background always visible */}
    <rect width="900" height="580" fill="url(#g2)" />

    {/* ── 2D FLOOR PLAN (plan phase) ─────────────────────────────── */}
    <motion.g
      animate={{
        opacity: phase === 'plan' ? 1 : phase === 'rising' ? 0.3 : 0,
        scale: phase === 'plan' ? 1 : 0.96,
      }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: '450px 290px' }}
    >
      {/* Outer boundary */}
      <rect x="160" y="90" width="580" height="380" fill="none" stroke="rgba(253,253,253,0.85)" strokeWidth="2.5" />

      {/* Room dividers */}
      <line x1="160" y1="280" x2="420" y2="280" stroke="rgba(253,253,253,0.5)" strokeWidth="1.5" strokeDasharray="10 5" />
      <line x1="420" y1="90" x2="420" y2="470" stroke="rgba(253,253,253,0.5)" strokeWidth="1.5" strokeDasharray="10 5" />
      <line x1="420" y1="300" x2="740" y2="300" stroke="rgba(253,253,253,0.35)" strokeWidth="1" strokeDasharray="8 5" />

      {/* Door arc — Living Room */}
      <path d="M 160 200 A 55 55 0 0 1 215 145" fill="none" stroke="#D64062" strokeWidth="1.5" />
      <line x1="160" y1="200" x2="215" y2="200" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Window — right wall */}
      <line x1="740" y1="175" x2="740" y2="245" stroke="#D64062" strokeWidth="4" />
      <line x1="735" y1="175" x2="745" y2="175" stroke="#D64062" strokeWidth="1.5" />
      <line x1="735" y1="245" x2="745" y2="245" stroke="#D64062" strokeWidth="1.5" />
      {/* Window light cone (2D) */}
      <polygon points="740,175 740,245 620,280 580,280" fill="#D64062" fillOpacity="0.06" />

      {/* Sofa (top view) */}
      <rect x="200" y="330" width="150" height="60" rx="8" fill="none" stroke="rgba(253,253,253,0.7)" strokeWidth="1.5" />
      <rect x="215" y="320" width="120" height="18" rx="4" fill="none" stroke="rgba(253,253,253,0.45)" strokeWidth="1" />

      {/* Coffee table */}
      <rect x="248" y="310" width="60" height="36" rx="5" fill="none" stroke="#D64062" strokeWidth="1" strokeOpacity="0.7" />

      {/* Bed */}
      <rect x="445" y="110" width="110" height="150" rx="8" fill="none" stroke="rgba(253,253,253,0.75)" strokeWidth="1.5" />
      <rect x="445" y="110" width="110" height="35" rx="6" fill="none" stroke="rgba(253,253,253,0.4)" strokeWidth="1" />

      {/* Wardrobe */}
      <rect x="580" y="110" width="60" height="80" fill="none" stroke="rgba(253,253,253,0.45)" strokeWidth="1" />
      <line x1="610" y1="110" x2="610" y2="190" stroke="rgba(253,253,253,0.25)" strokeWidth="0.8" />

      {/* Dining table */}
      <rect x="460" y="330" width="100" height="100" rx="6" fill="none" stroke="rgba(253,253,253,0.7)" strokeWidth="1.5" />
      {/* Chairs */}
      {[[460,330],[560,330],[460,430],[560,430]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="none" stroke="#D64062" strokeWidth="1" strokeOpacity="0.7" />
      ))}

      {/* Dimension lines */}
      <line x1="160" y1="72" x2="740" y2="72" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="160" y1="68" x2="160" y2="76" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="740" y1="68" x2="740" y2="76" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="450" y="65" textAnchor="middle" fill="#D64062" fontSize="10" fontFamily="monospace" opacity="0.8">6000mm</text>

      <line x1="142" y1="90" x2="142" y2="470" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="108" y="285" textAnchor="middle" fill="#D64062" fontSize="10" fontFamily="monospace" opacity="0.8" transform="rotate(-90,108,285)">3800mm</text>

      {/* Room labels */}
      <text x="290" y="235" textAnchor="middle" fill="rgba(253,253,253,0.5)" fontSize="11" fontFamily="monospace" letterSpacing="2">LIVING</text>
      <text x="555" y="215" textAnchor="middle" fill="rgba(253,253,253,0.45)" fontSize="11" fontFamily="monospace" letterSpacing="2">BEDROOM</text>
      <text x="555" y="380" textAnchor="middle" fill="rgba(253,253,253,0.4)" fontSize="11" fontFamily="monospace" letterSpacing="2">DINING</text>

      {/* Scale indicator */}
      <text x="450" y="498" textAnchor="middle" fill="rgba(253,253,253,0.3)" fontSize="9" fontFamily="monospace">SCALE 1:50 · NORTH</text>
    </motion.g>

    {/* ── ISOMETRIC 3D INTERIOR (iso + rising phase) ─────────────── */}
    <AnimatePresence>
      {(phase === 'rising' || phase === 'iso') && (
        <motion.g
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: phase === 'iso' ? 1 : 0.6, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Floor plane */}
          <polygon
            points="450,520 170,355 450,195 730,355"
            fill="#0D1224"
            stroke="rgba(253,253,253,0.45)"
            strokeWidth="1.2"
            fillOpacity="0.85"
          />
          {/* Floor grid lines */}
          {[0.25,0.5,0.75].map((t,i) => (
            <line
              key={i}
              x1={170 + t*(730-170)} y1={355 + t*(520-355)}
              x2={170 + t*(450-170)} y2={355 + t*(195-355)}
              stroke="rgba(214,64,98,0.12)" strokeWidth="0.8"
            />
          ))}

          {/* Left wall */}
          <polygon
            points="170,355 170,165 450,5 450,195"
            fill="#131728"
            stroke="rgba(253,253,253,0.5)"
            strokeWidth="1.2"
            fillOpacity="0.9"
          />

          {/* Right wall */}
          <polygon
            points="730,355 730,165 450,5 450,195"
            fill="#161D35"
            stroke="rgba(253,253,253,0.4)"
            strokeWidth="1.2"
            fillOpacity="0.9"
          />

          {/* Ceiling edge glow */}
          <line x1="170" y1="165" x2="730" y2="165" stroke="#D64062" strokeWidth="1.8" strokeOpacity="0.6" filter="url(#cglow)" />
          <line x1="170" y1="165" x2="450" y2="5" stroke="rgba(253,253,253,0.5)" strokeWidth="0.8" />
          <line x1="730" y1="165" x2="450" y2="5" stroke="rgba(253,253,253,0.5)" strokeWidth="0.8" />

          {/* Wall baseboard crimson strip */}
          <line x1="170" y1="348" x2="450" y2="188" stroke="#D64062" strokeWidth="1" strokeOpacity="0.35" />
          <line x1="730" y1="348" x2="450" y2="188" stroke="#D64062" strokeWidth="1" strokeOpacity="0.25" />

          {/* Window — right wall with light cone */}
          <polygon
            points="650,240 650,145 700,120 700,215"
            fill="#1A2040"
            stroke="#D64062"
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />
          {/* Window frame cross */}
          <line x1="650" y1="182" x2="700" y2="167" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Light beam */}
          <polygon
            points="700,120 700,215 490,400 390,400"
            fill="url(#winlight)"
            fillOpacity="0.55"
          />
          {/* Light spot on floor */}
          <ellipse cx="455" cy="415" rx="65" ry="25" fill="#D64062" fillOpacity="0.08" filter="url(#sglow)" />

          {/* 3D Sofa silhouette (left zone) */}
          <polygon points="230,445 230,390 350,327 350,378" fill="#1A2240" stroke="rgba(253,253,253,0.3)" strokeWidth="0.8" />
          <polygon points="350,378 350,327 390,347 390,396" fill="#141928" stroke="rgba(253,253,253,0.2)" strokeWidth="0.8" />
          {/* Sofa cushions */}
          <line x1="255" y1="385" x2="345" y2="347" stroke="rgba(253,253,253,0.15)" strokeWidth="0.8" />
          <line x1="295" y1="405" x2="385" y2="367" stroke="rgba(253,253,253,0.15)" strokeWidth="0.8" />

          {/* 3D Dining table (right zone) */}
          <polygon points="580,415 580,385 680,340 680,370" fill="#1C2240" stroke="rgba(253,253,253,0.2)" strokeWidth="0.8" />
          <polygon points="490,458 490,428 580,385 580,415" fill="#161D38" stroke="rgba(253,253,253,0.18)" strokeWidth="0.8" />
          {/* Table top */}
          <polygon points="490,428 580,385 680,340 590,297" fill="#1F2745" stroke="rgba(253,253,253,0.3)" strokeWidth="0.8" />

          {/* Ceiling pendant light */}
          <circle cx="450" cy="38" r="5" fill="#D64062" fillOpacity="0.9" filter="url(#cglow)" />
          <line x1="450" y1="5" x2="450" y2="38" stroke="#D64062" strokeWidth="0.8" strokeOpacity="0.6" />
          {/* Pendant light cone */}
          <polygon points="435,38 465,38 510,195 390,195" fill="#D64062" fillOpacity="0.03" />

          {/* Corner accent — floor/left wall junction */}
          <circle cx="170" cy="355" r="3" fill="#D64062" fillOpacity="0.7" />

          {/* Iso legend */}
          <text x="450" y="545" textAnchor="middle" fill="rgba(253,253,253,0.25)" fontSize="9" fontFamily="monospace" letterSpacing="1.5">ISOMETRIC VIEW · INTERIOR RENDER</text>
        </motion.g>
      )}
    </AnimatePresence>
  </svg>
);

export const StudioDashboard: React.FC<StudioDashboardProps> = ({
  user,
  onNavigate,
  onSendToast
}) => {
  const [phase, setPhase] = useState<'plan' | 'rising' | 'iso'>('plan');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const t1 = useRef<ReturnType<typeof setTimeout>>();
  const t2 = useRef<ReturnType<typeof setTimeout>>();
  const t3 = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const cycle = () => {
      setPhase('plan');
      t1.current = setTimeout(() => setPhase('rising'), 3200);
      t2.current = setTimeout(() => setPhase('iso'), 5000);
      t3.current = setTimeout(() => cycle(), 10500);
    };
    cycle();
    return () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
      clearTimeout(t3.current);
    };
  }, []);

  const handleNotifyMe = () => {
    setIsSubscribed(true);
    onSendToast?.('success', 'Subscribed', '2D Planner & 3D Studio early access confirmed.');
  };

  const phaseLabels: Record<string, string> = {
    plan: '2D Blueprint · Floor Plan',
    rising: 'Extruding · 3D Transition',
    iso: 'Isometric Studio · Interior Render'
  };

  return (
    <div
      className="relative w-full flex flex-col select-none overflow-hidden bg-[#090D1A]"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      {/* ── Canvas background ── */}
      <div className="absolute inset-0">
        {/* Deep radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(214,64,98,0.09) 0%, transparent 65%)'
          }}
        />
        <InteriorCanvas phase={phase} />
        {/* Vignette overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D1A]/70 via-transparent to-[#090D1A]/85 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#090D1A]/75 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#090D1A]/75 to-transparent pointer-events-none" />
      </div>

      {/* ── Top HUD bar ── */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-6">
        {/* Phase indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D64062] animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#D64062]"
              >
                {phaseLabels[phase]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Return button — clearly visible but not loud ── */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('executive')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/14 hover:border-white/35 text-white/70 hover:text-white text-xs font-semibold transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        )}
      </div>

      {/* ── Center hero ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 max-w-md mx-auto"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-[#D64062]/40" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#D64062]">
              Foryn Studio · Phase 2
            </span>
            <div className="h-px w-10 bg-[#D64062]/40" />
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
              2D Planner
            </h1>
            <h1
              className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
              style={{ color: '#D64062' }}
            >
              & 3D Studio
            </h1>
          </div>

          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <Layers className="w-3 h-3 text-[#D64062]" />
            <span className="text-[9px] font-mono font-bold text-slate-300 tracking-[0.15em]">
              IN DEVELOPMENT · Q4 2026
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
            Precision 2D floor plans and photorealistic 3D rendering — one seamless workspace.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
            <button
              onClick={handleNotifyMe}
              disabled={isSubscribed}
              className="px-5 py-2.5 rounded-xl bg-[#D64062] hover:bg-[#C03252] disabled:opacity-60 text-white font-bold text-xs transition-all shadow-lg shadow-[#D64062]/20 cursor-pointer disabled:cursor-default"
            >
              {isSubscribed ? 'Subscribed' : 'Get Early Access'}
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('executive')}
                className="px-5 py-2.5 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom HUD ── */}
      <div className="relative z-10 px-6 sm:px-10 pb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Box className="w-3 h-3 text-[#D64062]" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
              WebGL 2.0
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-slate-700" />
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">
              Neural Layout AI
            </span>
          </div>
        </div>

        {/* Phase dots */}
        <div className="flex items-center gap-1.5">
          {(['plan', 'rising', 'iso'] as const).map((p) => (
            <div
              key={p}
              className={`rounded-full transition-all duration-700 ${
                phase === p ? 'w-5 h-1.5 bg-[#D64062]' : 'w-1.5 h-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <span className="text-[9px] font-mono text-slate-700 hidden sm:inline">
          foryn.in / studio
        </span>
      </div>
    </div>
  );
};
