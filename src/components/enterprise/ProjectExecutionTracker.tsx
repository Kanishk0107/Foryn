import React, { useState } from 'react';
import {
  WorkflowStage,
  INITIAL_WORKFLOW_STAGES,
  WORKFLOW_PHASES
} from '../../data/stageData';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  UserCheck,
  ArrowRight,
  Filter,
  CheckSquare,
  Lock,
  FileText,
  X,
  Building,
  Zap
} from 'lucide-react';

interface ProjectExecutionTrackerProps {
  activeProjectName: string;
  onSendToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const ProjectExecutionTracker: React.FC<ProjectExecutionTrackerProps> = ({
  activeProjectName,
  onSendToast
}) => {
  const [stages, setStages] = useState<WorkflowStage[]>(INITIAL_WORKFLOW_STAGES);
  const [activePhaseNumber, setActivePhaseNumber] = useState<number>(2); // Default to Phase 2 (Concept & 3D Design Freeze)
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);
  const [signoffNotes, setSignoffNotes] = useState('');

  const currentPhaseStages = stages.filter((s) => s.phaseNumber === activePhaseNumber);

  // Overall Statistics
  const totalCompleted = stages.filter((s) => s.status === 'Completed').length;
  const totalInProgress = stages.filter((s) => s.status === 'In Progress').length;
  const percentComplete = Math.round((totalCompleted / stages.length) * 100);

  const handleApproveGate = (stageId: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, status: 'Completed' } : s))
    );

    const stg = stages.find((s) => s.id === stageId);
    onSendToast?.(
      'success',
      `Gate Approved: ${stg?.stageCode}`,
      `Certified ${stg?.title}. Dispatched next stage trigger.`
    );
    setSelectedStage(null);
    setSignoffNotes('');
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
              31-Stage Operating Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {activeProjectName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Project Stage-Gate Execution Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Governed by FORYN's operating atom: <strong className="text-slate-700 dark:text-slate-200">Trigger → Human Action → FORYN Automation → Decision Gate → Output</strong>.
          </p>
        </div>

        {/* Overall Progress Meter */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Lifecycle Completion</div>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
              {totalCompleted} of {stages.length} Stages ({percentComplete}%)
            </div>
          </div>
          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--foryn-accent)] rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {WORKFLOW_PHASES.map((phase) => {
          const isCurrent = activePhaseNumber === phase.phaseNumber;
          const phaseStages = stages.filter((s) => s.phaseNumber === phase.phaseNumber);
          const phaseCompleted = phaseStages.filter((s) => s.status === 'Completed').length;

          return (
            <button
              key={phase.phaseNumber}
              onClick={() => setActivePhaseNumber(phase.phaseNumber)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-700 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>Phase {phase.phaseNumber}</span>
                <span>{phase.range}</span>
              </div>
              <div className="text-xs font-black truncate mt-1">{phase.name}</div>
              <div className="text-[10px] font-mono opacity-80 mt-1">
                {phaseCompleted}/{phaseStages.length} Verified
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Phase Stages List */}
      <div className="space-y-3">
        {currentPhaseStages.map((stage) => {
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';

          return (
            <div
              key={stage.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 ${
                isCompleted
                  ? 'border-emerald-200/80 dark:border-emerald-900/40'
                  : isInProgress
                  ? 'border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-300/50'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                    {stage.stageCode}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{stage.title}</h3>
                  {stage.criticalPath && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                      Critical Path
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500">
                    Lead: <strong className="text-slate-700 dark:text-slate-300">{stage.assignedRole}</strong> ({stage.leadTimeDays}d)
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {stage.status}
                  </span>

                  {!isCompleted && (
                    <button
                      onClick={() => setSelectedStage(stage)}
                      className="px-3 py-1 rounded-lg bg-[#D64062] hover:bg-[#C03252] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      Audit Gate →
                    </button>
                  )}
                </div>
              </div>

              {/* FORYN Stage Atom Structure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {/* 1. Trigger */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Trigger</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                    {stage.trigger}
                  </p>
                </div>

                {/* 2. Human Action */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Human Action</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                    {stage.humanAction}
                  </p>
                </div>

                {/* 3. FORYN Automation */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-indigo-500 font-bold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>FORYN Automation</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                    {stage.automation}
                  </p>
                </div>

                {/* 4. Decision Gate */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Decision Gate</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-medium">
                    {stage.decisionGate}
                  </p>
                </div>
              </div>

              {/* Output Banner */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-400">Stage Output:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{stage.output}</span>
                </div>
                {isCompleted && (
                  <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Gate Certified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Gate Signoff Modal */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Stage Gate Verification
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedStage.stageCode} — {selectedStage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Mandatory Decision Gate Criteria:</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  {selectedStage.decisionGate}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                  Required Output Artifact
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {selectedStage.output}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                  Officer Inspection Notes & Checklist Signoff
                </label>
                <textarea
                  rows={3}
                  value={signoffNotes}
                  onChange={(e) => setSignoffNotes(e.target.value)}
                  placeholder="e.g. Dimensions verified with laser; client signed freeze agreement in studio..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStage(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveGate(selectedStage.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify & Approve Gate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
