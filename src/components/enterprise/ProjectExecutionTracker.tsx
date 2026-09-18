import React, { useState } from 'react';
import {
  WorkflowStage,
  INITIAL_WORKFLOW_STAGES,
  WORKFLOW_PHASES
} from '../../data/stageData';
import {
  CheckCircle2,
  Circle,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectExecutionTrackerProps {
  activeProjectName: string;
  onSendToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

type StageStatus = 'Completed' | 'In Progress' | 'Pending';

const STATUS_ICON = {
  Completed: <CheckCircle2 className="w-4 h-4 text-[#D64062]" />,
  'In Progress': <RefreshCw className="w-4 h-4 text-[#0F1428] animate-spin-slow" />,
  Pending: <Circle className="w-4 h-4 text-slate-300" />
};

const STATUS_PILL: Record<StageStatus, string> = {
  Completed:    'bg-[#D64062]/10 text-[#D64062]',
  'In Progress':'bg-[#0F1428]/10 text-[#0F1428]',
  Pending:      'bg-slate-100 text-slate-400'
};

export const ProjectExecutionTracker: React.FC<ProjectExecutionTrackerProps> = ({
  activeProjectName,
  onSendToast
}) => {
  const [projectCompletedStagesMap, setProjectCompletedStagesMap] = useState<Record<string, string[]>>({
    'B3/21 DLF Alameda Villa (PID 1005)': ['stg-01', 'stg-02', 'stg-03', 'stg-04', 'stg-05', 'stg-06', 'stg-07'],
    'Villa Penthouse 402 (PID 1001)': ['stg-01', 'stg-02', 'stg-03', 'stg-04', 'stg-05']
  });

  const [activePhaseNumber, setActivePhaseNumber] = useState<number>(1);
  const [selectedStage, setSelectedStage] = useState<WorkflowStage & { status: StageStatus } | null>(null);
  const [signoffNotes, setSignoffNotes] = useState('');

  const completedStageIds = projectCompletedStagesMap[activeProjectName] || [];

  const getStageStatus = (stageId: string, index: number): StageStatus => {
    if (completedStageIds.includes(stageId)) return 'Completed';
    if (index === 0 || completedStageIds.includes(INITIAL_WORKFLOW_STAGES[index - 1]?.id)) return 'In Progress';
    return 'Pending';
  };

  const stages = INITIAL_WORKFLOW_STAGES.map((s, idx) => ({
    ...s,
    status: getStageStatus(s.id, idx) as StageStatus
  }));

  const currentPhaseStages = stages.filter((s) => s.phaseNumber === activePhaseNumber);
  const totalCompleted = completedStageIds.length;
  const percentComplete = Math.round((totalCompleted / INITIAL_WORKFLOW_STAGES.length) * 100);

  const handleApproveGate = (stageId: string) => {
    setProjectCompletedStagesMap((prev) => {
      const existing = prev[activeProjectName] || [];
      if (!existing.includes(stageId)) {
        return { ...prev, [activeProjectName]: [...existing, stageId] };
      }
      return prev;
    });
    const stg = INITIAL_WORKFLOW_STAGES.find((s) => s.id === stageId);
    onSendToast?.('success', `Gate Certified: ${stg?.stageCode}`, `${stg?.title} approved for ${activeProjectName}.`);
    setSelectedStage(null);
    setSignoffNotes('');
  };

  return (
    <div className="h-full flex flex-col gap-4 select-none animate-in fade-in duration-200 overflow-hidden">

      {/* ── Header Row ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D64062] mb-0.5">
            31-Stage Execution
          </p>
          <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
            {activeProjectName}
          </h1>
        </div>

        {/* Arc Progress */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-[#D64062] leading-none">{percentComplete}%</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Complete</span>
          </div>
          {/* Ring */}
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="#D64062"
              strokeWidth="3"
              strokeDasharray={`${percentComplete * 0.942} 94.2`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="text-[10px] font-mono text-slate-400">
            <span className="font-bold text-slate-600">{totalCompleted}</span>/{INITIAL_WORKFLOW_STAGES.length}
          </div>
        </div>
      </div>

      {/* ── Phase Tabs ──────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {WORKFLOW_PHASES.map((phase) => {
          const isActive = activePhaseNumber === phase.phaseNumber;
          const phaseStages = stages.filter(s => s.phaseNumber === phase.phaseNumber);
          const done = phaseStages.filter(s => s.status === 'Completed').length;
          const total = phaseStages.length;
          const allDone = done === total;

          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setActivePhaseNumber(phase.phaseNumber)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0F1428] text-white border-[#0F1428] shadow-sm'
                  : allDone
                  ? 'bg-[#D64062]/8 text-[#D64062] border-[#D64062]/20 hover:border-[#D64062]/40'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {allDone && <CheckCircle2 className="w-3 h-3 text-[#D64062] shrink-0" />}
              <span>Phase {phase.phaseNumber}</span>
              <span className={`text-[10px] font-mono opacity-70`}>{done}/{total}</span>
            </button>
          );
        })}
      </div>

      {/* ── Stage Pipeline ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhaseNumber}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {/* Phase title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                {WORKFLOW_PHASES.find(p => p.phaseNumber === activePhaseNumber)?.name}
              </span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-[10px] font-mono text-slate-400">
                {WORKFLOW_PHASES.find(p => p.phaseNumber === activePhaseNumber)?.range}
              </span>
            </div>

            {currentPhaseStages.map((stage, idx) => {
              const isCompleted = stage.status === 'Completed';
              const isInProgress = stage.status === 'In Progress';

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 opacity-70'
                      : isInProgress
                      ? 'bg-white dark:bg-slate-900 border-[#D64062]/30 ring-1 ring-[#D64062]/15 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {STATUS_ICON[stage.status]}
                  </div>

                  {/* Stage Code */}
                  <span className={`text-[10px] font-mono font-black shrink-0 ${
                    isCompleted ? 'text-slate-400' : 'text-[#0F1428] dark:text-slate-200'
                  }`}>
                    {stage.stageCode}
                  </span>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${
                      isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {stage.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {stage.assignedRole} · {stage.leadTimeDays}d
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {stage.criticalPath && !isCompleted && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D64062]/10 text-[#D64062]">
                        CP
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_PILL[stage.status]}`}>
                      {stage.status}
                    </span>
                  </div>

                  {/* Approve Gate button — only on in-progress */}
                  {isInProgress && (
                    <button
                      onClick={() => setSelectedStage(stage)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D64062] hover:bg-[#C03252] text-white text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span className="hidden sm:inline">Certify</span>
                    </button>
                  )}

                  {/* Pending — faint arrow */}
                  {stage.status === 'Pending' && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Gate Certification Modal ─────────────────────────── */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D64062] tracking-wider">
                      {selectedStage.stageCode}
                    </span>
                    {selectedStage.criticalPath && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D64062]/10 text-[#D64062]">CP</span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {selectedStage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Gate Criteria */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D64062]" />
                    Decision Gate
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedStage.decisionGate}
                  </p>
                </div>

                {/* Required Output */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-slate-500">
                    <Zap className="w-3.5 h-3.5 text-[#0F1428] dark:text-slate-400" />
                    Required Output
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {selectedStage.output}
                  </p>
                </div>

                {/* Signoff Notes */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                    Officer Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={signoffNotes}
                    onChange={(e) => setSignoffNotes(e.target.value)}
                    placeholder="e.g. Laser dimensions verified, client signed freeze..."
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#D64062]/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-5 pb-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedStage(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveGate(selectedStage.id)}
                  className="px-5 py-2 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Certify & Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
