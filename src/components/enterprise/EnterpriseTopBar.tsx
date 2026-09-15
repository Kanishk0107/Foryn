import React, { useState } from 'react';
import { Logo } from '../Logo';
import { UserAvatar } from '../UserAvatar';
import { UserProfile, UserRole } from '../../types';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building,
  Command,
  Mail,
  CheckCircle2,
  LogOut,
  FolderOpen,
  Layers
} from 'lucide-react';

interface EnterpriseTopBarProps {
  user: UserProfile;
  activeProjectName: string;
  onSelectProjectName: (name: string) => void;
  availableProjects: string[];
  onOpenEmailConsole: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewItemModal: (type: 'lead' | 'boq' | 'vendor' | 'project') => void;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onClearAllData?: () => void;
  onRestoreDemoData?: () => void;
}

export const EnterpriseTopBar: React.FC<EnterpriseTopBarProps> = ({
  user,
  activeProjectName,
  onSelectProjectName,
  availableProjects,
  onOpenEmailConsole,
  onOpenCommandPalette,
  onOpenNewItemModal,
  onRoleChange,
  onLogout,
  onClearAllData,
  onRestoreDemoData
}) => {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const [currentBranch, setCurrentBranch] = useState('Pentagram Living • Gurugram HQ');

  const branches = [
    'Pentagram Living • Gurugram HQ',
    'Pentagram Living • South Delhi Studio',
    'Pentagram Living • Jaipur Design Lab'
  ];

  const roles: { role: UserRole; title: string; dept: string }[] = [
    { role: 'Sales Lead', title: 'Sales Director', dept: 'Pre-Sales & CRM' },
    { role: 'Architect', title: 'Principal Architect', dept: 'Design & BIM' },
    { role: 'Designer Team', title: 'Interior Design Lead', dept: 'CAD & 3D Styling' },
    { role: 'Project Management', title: 'Head of Projects', dept: 'Execution & Sites' },
    { role: 'Finance Team', title: 'Finance Controller', dept: 'Commercial & Accounts' }
  ];

  const recentNotifications = [
    { id: 'n1', title: 'BOQ Margin Warning', desc: 'Italian Marble line item marked +14% over budget', time: '10m ago', type: 'warn' },
    { id: 'n2', title: 'RTGS Disbursed', desc: '₹4,13,000 released to Hettich Factory Craft Ltd.', time: '42m ago', type: 'success' },
    { id: 'n3', title: 'Client Signed GFC', desc: 'Monil Vijay signed 2D layout freeze agreement', time: '2h ago', type: 'info' }
  ];

  const unreadCount = recentNotifications.filter(n => !readIds.has(n.id)).length;

  const openNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    // Mark all as read when panel is opened
    if (!isNotificationsOpen) {
      setReadIds(new Set(recentNotifications.map(n => n.id)));
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 z-40 shadow-xs select-none">
      {/* Left: Brand, Workspace & Active Project Dropdown */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block" />

        {/* Office Branch Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen);
              setIsProjectMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Building className="w-3.5 h-3.5 text-[var(--foryn-accent)]" />
            <span className="truncate max-w-[180px]">{currentBranch}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 font-mono">
                Select Workspace Hub
              </div>
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => {
                    setCurrentBranch(branch);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                    currentBranch === branch ? 'text-[var(--foryn-accent)] font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{branch}</span>
                  {currentBranch === branch && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Active Site / Project Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProjectMenuOpen(!isProjectMenuOpen);
              setIsWorkspaceMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate max-w-[170px] sm:max-w-[220px]">{activeProjectName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isProjectMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 font-mono">
                Active Client Sites (PID Registry)
              </div>
              {availableProjects.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onSelectProjectName(p);
                    setIsProjectMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                    activeProjectName === p ? 'text-[var(--foryn-accent)] font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{p}</span>
                  {activeProjectName === p && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--foryn-accent)]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Global Spotlight Search — compact fixed pill */}
      <div className="hidden lg:flex flex-1 justify-center px-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 w-full max-w-xs h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-all text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="flex-1 text-left truncate">Search...</span>
          <kbd className="inline-flex items-center gap-0.5 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 shrink-0">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Pulse, New Action, Role, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Office Pulse Ticker */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cloud Sync 18ms</span>
        </div>

        {/* Quick + New Entry Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--foryn-accent)] hover:brightness-110 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isNewMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs font-semibold">
              <button
                onClick={() => {
                  onOpenNewItemModal('lead');
                  setIsNewMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Capture New Client Lead
              </button>
              <button
                onClick={() => {
                  onOpenNewItemModal('boq');
                  setIsNewMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Add BOQ Line Item
              </button>
              <button
                onClick={() => {
                  onOpenNewItemModal('vendor');
                  setIsNewMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Issue Vendor Work Order
              </button>
              <button
                onClick={() => {
                  onOpenNewItemModal('project');
                  setIsNewMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Scaffold New Site Project
              </button>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">Role:</span>
            <span>{user.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1 font-bold text-[10px] uppercase text-slate-400 font-mono">
                Switch Office Workstation Role
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    onRoleChange(r.role);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col ${
                    user.role === r.role ? 'bg-slate-50 dark:bg-slate-800/80 text-[var(--foryn-accent)]' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-bold">{r.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.dept}</span>
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 my-1 pt-1">
                {onClearAllData && (
                  <button
                    onClick={() => {
                      onClearAllData();
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-bold flex items-center gap-1.5"
                  >
                    <span>🗑️ Clear All Data (Self-Test)</span>
                  </button>
                )}
                {onRestoreDemoData && (
                  <button
                    onClick={() => {
                      onRestoreDemoData();
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold flex items-center gap-1.5"
                  >
                    <span>⚡ Restore Demo Data</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Hub Bell */}
        <div className="relative">
          <button
            onClick={openNotifications}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Enterprise Audit Notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Red dot — only shown when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center font-mono text-[9px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
              {/* Panel header */}
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-100">Notifications</span>
                <button
                  onClick={() => setReadIds(new Set(recentNotifications.map(n => n.id)))}
                  className="text-[10px] font-semibold text-[var(--foryn-accent)] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              {/* Notification items */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                {recentNotifications.map((n) => {
                  const isUnread = !readIds.has(n.id);
                  return (
                    <div
                      key={n.id}
                      onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                      className={`p-3 cursor-pointer transition-colors flex gap-2.5 ${
                        isUnread
                          ? 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Unread indicator */}
                      <div className="pt-1 shrink-0">
                        <span className={`block w-2 h-2 rounded-full transition-all ${
                          isUnread ? 'bg-rose-500' : 'bg-transparent'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={`truncate ${
                            isUnread
                              ? 'font-bold text-slate-900 dark:text-slate-100'
                              : 'font-medium text-slate-600 dark:text-slate-400'
                          }`}>{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Footer */}
              <div className="px-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-mono">
                  {unreadCount === 0 ? 'All caught up ✓' : `${unreadCount} unread`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transactional Email Logs Modal Button */}
        <button
          onClick={onOpenEmailConsole}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Transactional Email Logs"
        >
          <Mail className="w-4 h-4 text-emerald-500" />
        </button>




        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2">
          <UserAvatar name={user.name} role={user.role} size="sm" showStatus />
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
