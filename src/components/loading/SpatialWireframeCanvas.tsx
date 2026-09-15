import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type LoadingStage =
  | 'BOOT'
  | 'BRAND_REVEAL'
  | 'ENGINE_INITIALIZATION'
  | 'DESIGN_TOOLS'
  | 'PROJECT_DATA'
  | 'AI_READY'
  | 'COMPLETE';

interface SpatialWireframeCanvasProps {
  stage: LoadingStage;
  progress: number;
  reducedMotion?: boolean;
}

export const SpatialWireframeCanvas: React.FC<SpatialWireframeCanvasProps> = ({
  stage,
  progress,
  reducedMotion = false
}) => {
  // Stage numeric weights for continuous coordinate interpolation
  const stageIndex = {
    BOOT: 0,
    BRAND_REVEAL: 1,
    ENGINE_INITIALIZATION: 2,
    DESIGN_TOOLS: 3,
    PROJECT_DATA: 4,
    AI_READY: 5,
    COMPLETE: 6
  }[stage];

  // Motion transitions
  const springTransition = reducedMotion
    ? { duration: 0.2 }
    : { type: 'spring' as const, stiffness: 180, damping: 24 };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/3] flex items-center justify-center select-none overflow-visible">
      {/* Background Architectural Grid Sub-canvas */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-[#0F1428]"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Fine Grid */}
          <pattern id="cad-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.04" />
            <circle cx="20" cy="20" r="0.6" fill="currentColor" fillOpacity="0.12" />
          </pattern>
          <linearGradient id="laser-accent-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D64062" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D64062" stopOpacity="1" />
            <stop offset="100%" stopColor="#D64062" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Base Grid Layer */}
        <rect width="100%" height="100%" fill="url(#cad-grid-pattern)" />

        {/* Viewport Boundary Frame with Corner Crop Marks */}
        <rect
          x="20"
          y="15"
          width="360"
          height="270"
          rx="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.08"
          strokeDasharray="4 4"
        />

        {/* Top-Left Corner Crop Mark */}
        <path d="M14 25 H26 M20 19 V31" stroke="#0F1428" strokeWidth="1" strokeOpacity="0.35" />
        {/* Top-Right Corner Crop Mark */}
        <path d="M374 25 H386 M380 19 V31" stroke="#0F1428" strokeWidth="1" strokeOpacity="0.35" />
        {/* Bottom-Left Corner Crop Mark */}
        <path d="M14 275 H26 M20 269 V281" stroke="#0F1428" strokeWidth="1" strokeOpacity="0.35" />
        {/* Bottom-Right Corner Crop Mark */}
        <path d="M374 275 H386 M380 269 V281" stroke="#0F1428" strokeWidth="1" strokeOpacity="0.35" />
      </svg>

      {/* Interactive Morphing SVG Elements */}
      <svg
        className="w-full h-full relative z-10"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stage 0-2: Isometric Spatial Cube Wireframe */}
        {stageIndex <= 2 && (
          <motion.g
            key="isometric-cube"
            initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
            animate={{
              opacity: 1,
              scale: stageIndex === 2 ? 1.05 : 1,
              y: stageIndex === 2 ? -4 : 0
            }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            transition={springTransition}
          >
            {/* Isometric Room Top Face */}
            <motion.path
              d="M 200 70 L 290 120 L 200 170 L 110 120 Z"
              fill="#0F1428"
              fillOpacity={0.03}
              stroke="#0F1428"
              strokeWidth="1.6"
              strokeOpacity="0.75"
              strokeLinejoin="round"
            />
            {/* Isometric Room Left Face */}
            <motion.path
              d="M 110 120 L 200 170 L 200 240 L 110 190 Z"
              fill="#0F1428"
              fillOpacity={0.05}
              stroke="#0F1428"
              strokeWidth="1.6"
              strokeOpacity="0.75"
              strokeLinejoin="round"
            />
            {/* Isometric Room Right Face */}
            <motion.path
              d="M 200 170 L 290 120 L 290 190 L 200 240 Z"
              fill="#0F1428"
              fillOpacity={0.02}
              stroke="#0F1428"
              strokeWidth="1.6"
              strokeOpacity="0.75"
              strokeLinejoin="round"
            />

            {/* Isometric Internal Grid Lines (Floor Tiles) */}
            <path
              d="M 155 95 L 245 145 M 155 145 L 245 95 M 155 145 L 155 215 M 245 145 L 245 215"
              stroke="#0F1428"
              strokeWidth="0.8"
              strokeOpacity="0.25"
              strokeDasharray="2 2"
            />

            {/* Glowing Center Origin Node */}
            <motion.circle
              cx="200"
              cy="170"
              r="4"
              fill="#D64062"
              animate={{ scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <circle cx="200" cy="170" r="8" stroke="#D64062" strokeWidth="0.75" strokeOpacity="0.4" />

            {/* Dynamic 3D Coordinate Tag */}
            <g transform="translate(200, 50)">
              <rect x="-42" y="-12" width="84" height="18" rx="4" fill="#0F1428" fillOpacity="0.9" />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="#FDFDFD"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.05em"
              >
                XYZ: 0.0 • 1:50
              </text>
            </g>
          </motion.g>
        )}

        {/* Stage 3-6: 2D Architectural Floor Plan & Room Vector Morph */}
        {stageIndex >= 3 && (
          <motion.g
            key="floorplan-layout"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={springTransition}
          >
            {/* Outer Architectural Wall Boundary (Double Line for Wall Thickness) */}
            <motion.rect
              x="70"
              y="55"
              width="260"
              height="180"
              rx="4"
              fill="#0F1428"
              fillOpacity={0.02}
              stroke="#0F1428"
              strokeWidth="3.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
            <rect
              x="76"
              y="61"
              width="248"
              height="168"
              rx="2"
              fill="none"
              stroke="#0F1428"
              strokeWidth="0.8"
              strokeOpacity="0.25"
            />

            {/* Internal Wall Partition (Living Room / Master Suite Division) */}
            <motion.line
              x1="210"
              y1="61"
              x2="210"
              y2="160"
              stroke="#0F1428"
              strokeWidth="3"
              strokeLinecap="square"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />

            {/* Door Swing Arc in Pentagram Crimson (#D64062) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Door Leaf Line */}
              <line x1="210" y1="160" x2="185" y2="185" stroke="#D64062" strokeWidth="1.5" />
              {/* Door Opening Arc */}
              <path
                d="M 210 160 A 35 35 0 0 1 185 185"
                fill="none"
                stroke="#D64062"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
              <circle cx="210" cy="160" r="2.5" fill="#D64062" />
            </motion.g>

            {/* Window Openings (Double Glazing Indicator Lines on Outer Walls) */}
            <line x1="110" y1="55" x2="170" y2="55" stroke="#FDFDFD" strokeWidth="5" />
            <line x1="110" y1="55" x2="170" y2="55" stroke="#D64062" strokeWidth="1.5" />
            <line x1="110" y1="53" x2="170" y2="53" stroke="#0F1428" strokeWidth="0.75" />
            <line x1="110" y1="57" x2="170" y2="57" stroke="#0F1428" strokeWidth="0.75" />

            {/* Furniture Silhouettes (Appearing in Stage 4 & 5: Project Data & AI Ready) */}
            {stageIndex >= 4 && (
              <motion.g
                key="furniture-layout"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Sectional Sofa Silhouette in Living Area */}
                <rect x="90" y="80" width="75" height="35" rx="4" fill="#0F1428" fillOpacity="0.08" stroke="#0F1428" strokeWidth="1" />
                <rect x="90" y="80" width="30" height="70" rx="4" fill="#0F1428" fillOpacity="0.08" stroke="#0F1428" strokeWidth="1" />
                {/* Coffee Table */}
                <rect x="130" y="125" width="40" height="22" rx="3" fill="none" stroke="#0F1428" strokeWidth="1" strokeDasharray="3 1.5" />

                {/* Master Bed & Side Tables in Suite Area */}
                <rect x="235" y="80" width="60" height="70" rx="3" fill="#0F1428" fillOpacity="0.07" stroke="#0F1428" strokeWidth="1" />
                {/* Pillows */}
                <rect x="240" y="85" width="22" height="14" rx="2" fill="none" stroke="#0F1428" strokeWidth="0.8" strokeOpacity="0.4" />
                <rect x="268" y="85" width="22" height="14" rx="2" fill="none" stroke="#0F1428" strokeWidth="0.8" strokeOpacity="0.4" />
                {/* Side tables */}
                <rect x="222" y="80" width="10" height="15" rx="1.5" fill="none" stroke="#0F1428" strokeWidth="0.8" />
                <rect x="298" y="80" width="10" height="15" rx="1.5" fill="none" stroke="#0F1428" strokeWidth="0.8" />

                {/* Spatial AI Snapping Nodes (Stage 5 AI Ready) */}
                {stageIndex >= 5 && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <circle cx="150" cy="136" r="3" fill="#D64062" />
                    <circle cx="265" cy="115" r="3" fill="#D64062" />
                    <motion.line
                      x1="150"
                      y1="136"
                      x2="265"
                      y2="115"
                      stroke="#D64062"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      animate={{ strokeDashoffset: [0, -8] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.g>
                )}
              </motion.g>
            )}

            {/* Dimension Extension Lines & CAD Callouts */}
            <g className="text-slate-500 font-mono text-[8px] select-none">
              {/* Horizontal Dimension on Top */}
              <line x1="70" y1="42" x2="330" y2="42" stroke="#0F1428" strokeWidth="0.75" strokeOpacity="0.4" />
              <line x1="70" y1="38" x2="70" y2="46" stroke="#0F1428" strokeWidth="1" />
              <line x1="330" y1="38" x2="330" y2="46" stroke="#0F1428" strokeWidth="1" />
              <rect x="175" y="35" width="50" height="14" rx="3" fill="#FDFDFD" />
              <text x="200" y="45" textAnchor="middle" fill="#0F1428" fontWeight="bold" fontSize="8">
                24&apos; - 6&quot;
              </text>

              {/* Vertical Dimension on Left */}
              <line x1="52" y1="55" x2="52" y2="235" stroke="#0F1428" strokeWidth="0.75" strokeOpacity="0.4" />
              <line x1="48" y1="55" x2="56" y2="55" stroke="#0F1428" strokeWidth="1" />
              <line x1="48" y1="235" x2="56" y2="235" stroke="#0F1428" strokeWidth="1" />
              <rect x="36" y="138" width="32" height="14" rx="3" fill="#FDFDFD" />
              <text x="52" y="148" textAnchor="middle" fill="#0F1428" fontWeight="bold" fontSize="8">
                18&apos; - 0&quot;
              </text>

              {/* Scale & Room Stamp at Bottom */}
              <g transform="translate(70, 252)">
                <text x="0" y="0" fill="#0F1428" fontWeight="bold" fontSize="8" letterSpacing="0.08em">
                  LEVEL 01 • MASTER SUITE & LOUNGE
                </text>
                <text x="260" y="0" textAnchor="end" fill="#D64062" fontWeight="bold" fontSize="8">
                  SCALE: 1:50
                </text>
              </g>
            </g>
          </motion.g>
        )}

        {/* Dynamic Laser Scanning Line across the active workspace */}
        <motion.line
          x1="30"
          y1="50"
          x2="370"
          y2="50"
          stroke="url(#laser-accent-grad)"
          strokeWidth="1.5"
          animate={{ y: [0, 200, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};
