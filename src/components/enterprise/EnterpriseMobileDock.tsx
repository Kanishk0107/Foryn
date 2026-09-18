import React from 'react';
import {
  LayoutDashboard,
  Target,
  FolderGit2,
  FileSpreadsheet,
  Compass,
  HardHat,
  Receipt
} from 'lucide-react';
import { EnterpriseView } from './EnterpriseSidebar';

interface EnterpriseMobileDockProps {
  activeView: EnterpriseView;
  onSelectView: (view: EnterpriseView) => void;
  leadCount: number;
  pendingPmCount: number;
  pendingFinanceCount: number;
}

export const EnterpriseMobileDock: React.FC<EnterpriseMobileDockProps> = ({
  activeView,
  onSelectView,
  leadCount,
  pendingPmCount,
  pendingFinanceCount
}) => {
  const tabs = [
    {
      id: 'executive' as EnterpriseView,
      label: 'Exec',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'studio' as EnterpriseView,
      label: '2D/3D CAD',
      icon: Compass,
      badge: undefined
    },
    {
      id: 'projects' as EnterpriseView,
      label: '31 Stages',
      icon: FolderGit2,
      badge: undefined
    },
    {
      id: 'crm' as EnterpriseView,
      label: 'CRM',
      icon: Target,
      badge: leadCount > 0 ? leadCount : undefined
    },
    {
      id: 'boq' as EnterpriseView,
      label: 'BOQ',
      icon: FileSpreadsheet,
      badge: undefined
    },
    {
      id: 'vendors' as EnterpriseView,
      label: 'Vendors',
      icon: HardHat,
      badge: pendingPmCount > 0 ? pendingPmCount : undefined
    },
    {
      id: 'finance' as EnterpriseView,
      label: 'Finance',
      icon: Receipt,
      badge: pendingFinanceCount > 0 ? pendingFinanceCount : undefined
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F1428]/95 dark:bg-[#0F1428]/95 backdrop-blur-xl border-t border-slate-800/80 z-40 px-2 py-1.5 pb-safe select-none shadow-2xl">
      <div className="flex items-center justify-around gap-1 overflow-x-auto scrollbar-none py-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-1.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[#D64062] font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 min-w-[12px] h-[12px] rounded-full bg-[#D64062] text-white text-[8px] font-mono font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D64062] absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
