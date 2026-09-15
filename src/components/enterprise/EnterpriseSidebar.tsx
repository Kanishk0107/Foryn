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
          isHighlight: true
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
          isHighlight: false
        },
        {
          id: 'boq' as EnterpriseView,
          label: 'Master BOQ Studio',
          icon: FileSpreadsheet,
          badge: 'Core',
          isHighlight: false
        },
        {
          id: 'studio' as EnterpriseView,
          label: '2D/3D CAD Studio',
          icon: Compass,
          badge: 'WebGL',
          isHighlight: false
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
          isHighlight: false
        },
        {
          id: 'vendors' as EnterpriseView,
          label: 'Procurement & Sites',
          icon: HardHat,
          badge: pendingPmCount > 0 ? `${pendingPmCount} Req` : undefined,
          isHighlight: true
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
          isHighlight: false
        }
      ]
    }
  ];

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] bg-[#FDFDFD] dark:bg-[#0F1428] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 shrink-0 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 py-3.5 px-2.5 overflow-y-auto space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-widest text-[#0F1428]/60 dark:text-slate-400">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#0F1428] text-white dark:bg-slate-800 dark:text-[#D64062] shadow-sm font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-[#0F1428] dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#D64062]' : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#D64062] text-white shadow-xs'
                          : item.isHighlight
                          ? 'bg-[#D64062]/15 text-[#D64062] border border-[#D64062]/30'
                          : 'bg-slate-200 text-[#0F1428] dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
                      }`}
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
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#0F1428] dark:text-[#D64062] hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title="Pentagram Operator Quick Guide"
        >
          <Zap className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Quick SOP Tips</span>}
        </button>

        {/* Database & Latency Card (when expanded) */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-[#D64062]" />
                <span>Postgres Flexible</span>
              </span>
              <span className="text-[#D64062] font-bold">LIVE</span>
            </div>
            <div className="flex items-center justify-between text-[#0F1428] dark:text-slate-300 font-medium">
              <span>Tenant Security</span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <ShieldCheck className="w-3 h-3 text-[#0F1428]" />
                RLS Encrypted
              </span>
            </div>
          </div>
        )}

        {/* Collapse Sidebar Button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-[#0F1428] dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer"
          title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
