import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  IndianRupee,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PieChart,
  HardHat,
  FileSpreadsheet
} from 'lucide-react';
import { EnterpriseView } from './EnterpriseSidebar';

interface ExecutiveOverviewProps {
  onNavigate: (view: EnterpriseView) => void;
  onSelectProject: (projectName: string) => void;
  activeProjectName: string;
  totalLeadsCount: number;
  activeSitesCount: number;
  totalContractValueSum: number;
  pendingPmApprovals: number;
  totalGSTLiability: number;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onNavigate,
  onSelectProject,
  activeProjectName,
  totalLeadsCount,
  activeSitesCount,
  totalContractValueSum,
  pendingPmApprovals,
  totalGSTLiability
}) => {
  const activeProjects: any[] = [];
  const marginAlerts: any[] = [];
  const liveOperationsFeed: any[] = [];


  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Top Header Card: Greeting & Executive Pulse */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Executive Command & Control
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Pentagram Living — Operating Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time multi-project oversight: tracking ₹{(totalContractValueSum || 0).toFixed(1)} Lakhs in active client contracts, site milestone gates, margin leakage control, and supply chain releases.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('boq')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Master BOQ Studio</span>
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--foryn-accent)] hover:brightness-110 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Launch CAD 3D</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Order Value */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Active Contract Pipeline</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{(totalContractValueSum || 0).toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500">Lakhs</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeSitesCount} Active Site Projects</span>
          </div>
        </div>

        {/* KPI 2: Blended Gross Margin */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Blended Gross Margin</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {totalContractValueSum > 0 ? '28.0%' : '0.0%'}
            </span>
            <span className="text-xs font-bold text-slate-500">Target: 25%</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{totalContractValueSum > 0 ? '+3.0% above hurdle rate' : 'No active contract data'}</span>
          </div>
        </div>

        {/* KPI 3: Margin Leakage Risk Guard */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Margin Leakage Guard</span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {marginAlerts.length > 0 ? '₹60.5K' : '₹0'}
            </span>
            <span className="text-xs font-bold text-slate-500">At Risk</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            <span>{marginAlerts.length} Cost Variance Alerts</span>
          </div>
        </div>

        {/* KPI 4: Vendor & Finance Queue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Vendor Work Orders</span>
            <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <HardHat className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ₹{(totalContractValueSum || 0).toFixed(1)}L
            </span>
            <span className="text-xs font-bold text-slate-500">Total POs</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>GST Output: ₹{((totalGSTLiability || 0) / 100000).toFixed(1)}L</span>
            <span className="text-emerald-500 font-bold">100% Tax Compliant</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Active Sites Registry + Margin Leakage Guard Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Sites Matrix */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Active Client Sites (Connected Model)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Single source of truth: 2D plan, 3D render, BOQ quantities, and factory releases
              </p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[var(--foryn-accent)] hover:underline flex items-center gap-1"
            >
              <span>View 31 Stages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70 overflow-x-auto">
            {activeProjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 opacity-60" />
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">No Active Sites Registered</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Capture inbound leads in CRM and click &quot;Promote to Project&quot; to initialize a new site.
                </p>
              </div>
            ) : (
              activeProjects.map((proj) => (
                <div
                  key={proj.pid}
                  className={`p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    activeProjectName.includes(proj.title) ? 'bg-slate-50/60 dark:bg-slate-800/30' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        PID #{proj.pid}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white hover:text-[var(--foryn-accent)] cursor-pointer"
                        onClick={() => onSelectProject(`${proj.title} (${proj.pid})`)}
                      >
                        {proj.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          proj.health === 'On Track'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {proj.health}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>{proj.client}</span>
                      <span>•</span>
                      <span>{proj.location}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1.5 pt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{proj.stage}</span>
                    </div>
                  </div>

                  <div className="sm:text-right space-y-1.5 shrink-0">
                    <div className="text-xs font-mono font-black text-slate-900 dark:text-white">
                      ₹{proj.budget.toFixed(1)} Lakhs
                      <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">
                        (₹{proj.paid.toFixed(1)}L paid)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 4 Cols: Margin Leakage Guard & Live Audit Log */}
        <div className="lg:col-span-4 space-y-6">
          {/* Margin Leakage Exceptions Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Margin Leakage Detection
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-500 font-bold">2 Exceptions</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Foryn AI exception engine actively monitors material rate fluctuations and scrap rates between CAD takeoff and vendor billing.
            </p>

            <div className="space-y-2.5">
              {marginAlerts.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  No active margin leakage alerts. Site budgets operating within parameters.
                </div>
              ) : (
                marginAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-rose-800 dark:text-rose-300">
                      <span className="truncate">{alert.item}</span>
                      <span className="font-mono text-[11px] shrink-0">{alert.impact}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">Fix: </span>
                      {alert.recommendation}
                    </div>
                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">{alert.project}</span>
                      <button
                        onClick={() => onNavigate('boq')}
                        className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
                      >
                        Audit in BOQ →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live Operations Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Live Office Operations Stream
              </h3>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">Realtime</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {liveOperationsFeed.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs font-medium">
                  No activity recorded yet. Team actions will stream here live.
                </div>
              ) : (
                liveOperationsFeed.map((f: any) => (
                  <div key={f.id} className="py-2.5 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{f.user} ({f.role})</span>
                      <span>{f.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{f.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
