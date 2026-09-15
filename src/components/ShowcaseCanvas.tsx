import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoomScene, Hotspot, RenderMode } from '../types';
import {
  Layers,
  Sun,
  Moon,
  Eye,
  Sparkles,
  RotateCcw,
  Tag,
  Fan,
  Palette,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sliders,
  Flame,
  Globe
} from 'lucide-react';

interface ShowcaseCanvasProps {
  scenes: RoomScene[];
  currentScene: RoomScene;
  onSelectScene: (scene: RoomScene) => void;
  onSelectHotspotInStudio?: (hotspot: Hotspot) => void;
  hideBottomToolbar?: boolean;
}

export type LightingPreset = 'daylight' | 'golden' | 'night-cove' | 'night-mood';

export const ShowcaseCanvas: React.FC<ShowcaseCanvasProps> = ({
  scenes,
  currentScene,
  onSelectScene,
  onSelectHotspotInStudio,
  hideBottomToolbar = false
}) => {
  const [renderMode, setRenderMode] = useState<RenderMode>('photo');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('daylight');
  const [lightingTemp, setLightingTemp] = useState<number>(5500);
  const [fanSpeed, setFanSpeed] = useState<boolean>(false);
  const [activeTexture, setActiveTexture] = useState<'default' | 'marble' | 'wood' | 'terracotta'>('default');
  const [isRotating, setIsRotating] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const handleLightingChange = (preset: LightingPreset) => {
    setLightingPreset(preset);

    switch (preset) {
      case 'daylight':
        setLightingTemp(5500);
        break;
      case 'golden':
        setLightingTemp(3500);
        break;
      case 'night-cove':
        setLightingTemp(2800);
        break;
      case 'night-mood':
        setLightingTemp(2200);
        break;
    }
  };

  const isNight = lightingPreset === 'night-cove' || lightingPreset === 'night-mood';

  // Compute CSS filter overlay based on lighting temperature and AI preset
  const getLightingFilter = () => {
    if (renderMode !== 'photo') return '';

    const tempNorm = (lightingTemp - 2000) / (6500 - 2000); // 0 to 1

    switch (lightingPreset) {
      case 'daylight':
        return `brightness(102%) contrast(105%) sepia(5%) saturate(108%)`;
      case 'golden':
        return `brightness(96%) contrast(115%) sepia(35%) hue-rotate(-10deg) saturate(135%)`;
      case 'night-cove':
        return `brightness(68%) contrast(130%) sepia(40%) hue-rotate(-15deg) saturate(120%)`;
      case 'night-mood':
        return `brightness(55%) contrast(140%) sepia(55%) hue-rotate(-20deg) saturate(140%)`;
      default:
        return `sepia(${(1 - tempNorm) * 30}%) brightness(${90 + tempNorm * 10}%)`;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px] bg-slate-900 flex flex-col overflow-hidden select-none">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Overlay Header Controls */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex flex-col gap-2.5 pointer-events-none">
        {/* Scene Selector Pills - Minimalist Discover-Style Spring Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/85 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-xl pointer-events-auto overflow-x-auto max-w-full no-scrollbar">
          {scenes.map((scene) => {
            const isSelected = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => {
                  onSelectScene(scene);
                  setActiveHotspot(null);
                  setLightingTemp(scene.lightingTemp);
                }}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-[3rem] text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeSceneBubble"
                    className="absolute inset-0 z-0 bg-[#F62440] rounded-[3rem] shadow-md shadow-[#F62440]/30"
                    transition={{
                      type: 'spring',
                      bounce: 0.18,
                      duration: 0.45
                    }}
                  />
                )}
                <span className="relative z-10">{scene.name}</span>
              </button>
            );
          })}
        </div>

        {/* AI Lighting Modes - Minimalist Discover-Style Spring Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/85 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-xl pointer-events-auto overflow-x-auto max-w-fit no-scrollbar">
          {[
            { id: 'daylight', label: 'Daylight', icon: Sun },
            { id: 'golden', label: 'Golden', icon: Flame },
            { id: 'night-cove', label: 'Night Cove', icon: Moon },
            { id: 'night-mood', label: 'Night Mood', icon: Zap }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = lightingPreset === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleLightingChange(mode.id as LightingPreset)}
                className={`relative flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-[3rem] text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeLightingBubble"
                    className="absolute inset-0 z-0 bg-[#F62440] rounded-[3rem] shadow-md shadow-[#F62440]/30"
                    transition={{
                      type: 'spring',
                      bounce: 0.18,
                      duration: 0.45
                    }}
                  />
                )}
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10 ${isSelected ? 'text-white' : 'text-[#F62440]'}`} />
                <span className="relative z-10">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Image Canvas Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden group">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0.3, scale: 1.02 }}
          animate={{ opacity: 1, scale: isRotating ? [1, 1.03, 1] : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Main Photorealistic Render Image */}
          <img
            src={currentScene.image}
            alt={currentScene.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                if (currentScene.id === 'indian-kitchen-1') {
                  target.src = '/assets/images/foryn_indian_kitchen_1_1786438839476.jpg';
                } else if (currentScene.id === 'indian-wardrobe-1') {
                  target.src = '/assets/images/foryn_indian_wardrobe_1_1786438855628.jpg';
                } else if (currentScene.id === 'indian-living-1') {
                  target.src = '/assets/images/foryn_indian_living_1_1786438872133.jpg';
                } else {
                  target.src = '/assets/images/foryn_kitchen_render_1786438263781.jpg';
                }
              }
            }}
            style={{ filter: getLightingFilter() }}
            className={`w-full h-full object-cover transition-all duration-700 ${
              renderMode === 'blueprint'
                ? 'contrast-200 brightness-75 hue-rotate-180 invert'
                : renderMode === 'wireframe'
                ? 'grayscale contrast-200 brightness-90'
                : ''
            } ${
              activeTexture === 'marble'
                ? 'saturate-50 contrast-125'
                : activeTexture === 'wood'
                ? 'sepia-20'
                : activeTexture === 'terracotta'
                ? 'hue-rotate-15'
                : ''
            }`}
          />

          {/* Soft Top/Bottom Vignette to enhance top pills and bottom badge readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40 z-10" />

          {/* AI Daylight Sunbeam Shaft Overlay */}
          {lightingPreset === 'daylight' && renderMode === 'photo' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40">
              <div className="w-full h-full bg-gradient-to-tr from-transparent via-amber-100/20 to-amber-200/40" />
            </div>
          )}

          {/* AI Golden Hour Warm Rays Overlay */}
          {lightingPreset === 'golden' && renderMode === 'photo' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-60">
              <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-orange-500/25 to-rose-900/30" />
            </div>
          )}

          {/* AI Night Mode Warm Cove Light & Ceiling Spotlights Overlay */}
          {isNight && renderMode === 'photo' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Dark Room Ambient Occlusion Vignette */}
              <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply" />
              
              {/* Warm Ceiling Cove LED Light Strip Beam */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-400/40 via-amber-500/10 to-transparent mix-blend-screen" />

              {/* Night Mode Spotlights over hotspots */}
              {currentScene.hotspots.map((h) => (
                <div
                  key={`spot-${h.id}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-radial from-amber-400/30 via-amber-500/10 to-transparent pointer-events-none mix-blend-screen blur-xl"
                />
              ))}

              {/* Warm Mood Floor Glow */}
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-amber-900/30 via-amber-950/10 to-transparent mix-blend-screen" />
            </div>
          )}



          {/* Airflow / Fan Breeze Simulation FX */}
          {fanSpeed && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ x: [-200, 400], opacity: [0, 0.25, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="w-96 h-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent transform -skew-x-12"
              />
            </div>
          )}

          {/* Blueprint CAD Grid Overlay */}
          {renderMode === 'blueprint' && (
            <div className="absolute inset-0 bg-cyan-950/40 pointer-events-none flex flex-col justify-between p-6 border-4 border-cyan-500/30">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />
              <div className="relative z-10 flex justify-between text-cyan-400 font-mono text-[10px] uppercase tracking-widest bg-slate-950/80 p-2 rounded border border-cyan-800/50">
                <span>FORYN INDIAN STUDIO ENGINE // ARCHITECTURAL CAD</span>
                <span>SCALE 1:50 | IS:13920 COMPLIANT</span>
              </div>
              <div className="relative z-10 flex justify-between text-cyan-400 font-mono text-[10px]">
                <span>ELEVATION: +0.000m</span>
                <span>GST BILLABLE SPECIFICATION SHEET</span>
              </div>
            </div>
          )}

          {/* Watermark & Legal Domain Stamps */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-slate-300 font-mono flex items-center gap-2">
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="font-bold text-white">design.foryn.io</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">FORYN Technologies Pvt Ltd</span>
          </div>

          {/* Hotspots Pins */}
          {showHotspots && (
            <div className="absolute inset-0 pointer-events-auto">
              {currentScene.hotspots.map((hotspot) => {
                const isActive = activeHotspot?.id === hotspot.id;

                return (
                  <div
                    key={hotspot.id}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    {/* Hotspot Pulse Button */}
                    <button
                      onClick={() => {
                        setActiveHotspot(isActive ? null : hotspot);
                        setSelectedColor(hotspot.colorOptions ? hotspot.colorOptions[0] : null);
                      }}
                      className="group/pin relative flex items-center justify-center p-1 focus:outline-none"
                    >
                      <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping group-hover/pin:bg-amber-400/70" />
                      <span className="relative w-7 h-7 rounded-full bg-slate-900/90 text-amber-400 border-2 border-amber-400 flex items-center justify-center shadow-lg transition-transform group-hover/pin:scale-110">
                        <Tag className="w-3.5 h-3.5" />
                      </span>

                      {!isActive && (
                        <span className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900/95 text-white text-[11px] font-semibold rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-opacity border border-white/10">
                          {hotspot.title} • ₹{hotspot.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </button>

                    {/* Popover Inspector */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-80 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-40 backdrop-blur-xl"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                                {hotspot.category}
                              </span>
                              <h4 className="text-sm font-bold text-slate-100 mt-1">
                                {hotspot.title}
                              </h4>
                            </div>
                            <span className="text-base font-extrabold text-amber-400">
                              ₹{hotspot.price.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            {hotspot.description}
                          </p>

                          <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                            <div className="flex justify-between">
                              <span>Material Spec:</span>
                              <span className="text-slate-200 font-medium truncate max-w-[160px]">
                                {hotspot.material}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Dimensions:</span>
                              <span className="text-slate-200 font-medium">{hotspot.dimensions}</span>
                            </div>
                          </div>

                          {/* Swatches */}
                          {hotspot.colorOptions && (
                            <div className="mt-3 pt-2 border-t border-slate-800">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                                Finish Swatches
                              </span>
                              <div className="flex items-center gap-2">
                                {hotspot.colorOptions.map((c) => (
                                  <button
                                    key={c}
                                    onClick={() => setSelectedColor(c)}
                                    style={{ backgroundColor: c }}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                      selectedColor === c ? 'scale-110 border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (onSelectHotspotInStudio) {
                                  onSelectHotspotInStudio(hotspot);
                                }
                              }}
                              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>Open CAD Studio</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveHotspot(null)}
                              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800"
                            >
                              ✕
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Floating Interactive Toolbar Controls */}
      {!hideBottomToolbar && (
        <div className="p-3.5 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
          {/* Room Title & Indian Design Style */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>{currentScene.name}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                {currentScene.style}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">{currentScene.tagline}</p>
          </div>

          {/* Creative Toolbar Tools */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Lighting Kelvin Temperature Control */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-mono">Temp: {lightingTemp}K</span>
                <input
                  type="range"
                  min="2000"
                  max="6500"
                  step="100"
                  value={lightingTemp}
                  onChange={(e) => setLightingTemp(Number(e.target.value))}
                  className="w-20 sm:w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Airflow / Fan Breeze Simulation Button */}
            <button
              onClick={() => setFanSpeed(!fanSpeed)}
              title="Simulate Ceiling Fan Airflow"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                fanSpeed
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Fan className={`w-3.5 h-3.5 ${fanSpeed ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Airflow</span>
            </button>

            {/* Texture / Wall Finish Swapper */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <button
                onClick={() => setActiveTexture('default')}
                title="Default Finish"
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  activeTexture === 'default' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Std
              </button>
              <button
                onClick={() => setActiveTexture('wood')}
                title="Teak Veneer Finish"
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  activeTexture === 'wood' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Teak
              </button>
              <button
                onClick={() => setActiveTexture('marble')}
                title="Italian Marble Finish"
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  activeTexture === 'marble' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Marble
              </button>
            </div>

            {/* Hotspots Toggle & Camera Rotate Trigger */}
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                showHotspots
                  ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pins ({currentScene.hotspots.length})</span>
            </button>

            <button
              onClick={() => {
                setIsRotating(true);
                setTimeout(() => setIsRotating(false), 2000);
              }}
              title="3D Pan View"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
