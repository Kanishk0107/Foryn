import React from 'react';
import {
  LayoutDashboard,
  Target,
  FolderGit2,
  FileSpreadsheet,
  Compass,
  HardHat,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
  HelpCircle,
  Zap,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export type EnterpriseView =
  | 'executive'
  | 'crm'
  | 'projects'
  | 'boq'
  | 'studio'
  | 'vendors'
  | 'finance';

interface EnterpriseSidebarProps {
  activeView: EnterpriseView;
  onSelectView: (view: EnterpriseView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  leadCount: number;
  pendingPmCount: number;
  pendingFinanceCount: number;
  onOpenQuickTips: () => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  leadCount,
  pendingPmCount,
  pendingFinanceCount,
  onOpenQuickTips
}) => {
  const navSections = [
    {
      heading: 'Enterprise Management',
      items: [
        {
          id: 'executive' as EnterpriseView,
          label: 'Executive Command',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        }
      ]
    },
    {
      heading: 'Commercial & Pre-Con',
      items: [
        {
          id: 'crm' as EnterpriseView,
          label: 'Pre-Sales & CRM',
          icon: Target,
          badge: `${leadCount}`,
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        },
        {
          id: 'boq' as EnterpriseView,
          label: 'Master BOQ Studio',
          icon: FileSpreadsheet,
          badge: 'Core',
          badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        },
        {
          id: 'studio' as EnterpriseView,
          label: '2D/3D CAD Studio',
          icon: Compass,
          badge: 'WebGL',
          badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
        }
      ]
    },
    {
      heading: 'Operations & Execution',
      items: [
        {
          id: 'projects' as EnterpriseView,
          label: 'Projects & 31 Stages',
          icon: FolderGit2,
          badge: 'Engine',
          badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
        },
        {
          id: 'vendors' as EnterpriseView,
          label: 'Procurement & Sites',
          icon: HardHat,
          badge: pendingPmCount > 0 ? `${pendingPmCount} Req` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
        }
      ]
    },
    {
      heading: 'Financial Governance',
      items: [
        {
          id: 'finance' as EnterpriseView,
          label: 'Finance & GST Ledger',
          icon: Receipt,
          badge: pendingFinanceCount > 0 ? `${pendingFinanceCount} RTGS` : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        }
      ]
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 shrink-0 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.heading}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-[var(--foryn-accent)] shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[var(--foryn-accent)]' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Utilities & Collapse Trigger */}
      <div className="p-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5">
        {/* Quick Tips modal button */}
        <button
          onClick={onOpenQuickTips}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title="Foryn Operator Quick Guide"
        >
          <Zap className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Quick SOP Tips</span>}
        </button>

        {/* Database & Latency Card (when expanded) */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-500" />
                <span>Postgres Flexible</span>
              </span>
              <span className="text-emerald-500 font-bold">LIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
              <span>Tenant Security</span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                RLS Encrypted
              </span>
            </div>
          </div>
        )}

        {/* Collapse Sidebar Button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
          title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
