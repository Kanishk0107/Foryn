import React, { useState } from 'react';
import { Logo } from '../Logo';
import { UserAvatar } from '../UserAvatar';
import { UserProfile } from '../../types';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Command,
  Mail,
  CheckCircle2,
  LogOut,
  FolderOpen,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

interface EnterpriseTopBarProps {
  user: UserProfile;
  activeProjectName: string;
  onSelectProjectName: (name: string) => void;
  availableProjects: string[];
  onOpenEmailConsole: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewItemModal: (type: 'lead' | 'boq' | 'vendor' | 'project' | 'user') => void;
  onLogout: () => void;
  onClearAllData?: () => void;
  onRestoreDemoData?: () => void;
  /** Optional: live notifications array from parent (profile-scoped) */
  notifications?: {
    id: string;
    title: string;
    desc: string;
    time: string;
    type: 'warn' | 'success' | 'info';
  }[];
}

export const EnterpriseTopBar: React.FC<EnterpriseTopBarProps> = ({
  user,
  activeProjectName,
  onSelectProjectName,
  availableProjects,
  onOpenEmailConsole,
  onOpenCommandPalette,
  onOpenNewItemModal,
  onLogout,
  notifications = []
}) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const openNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    if (!isNotificationsOpen) {
      setReadIds(new Set(notifications.map(n => n.id)));
    }
  };

  const NotifIcon = ({ type }: { type: 'warn' | 'success' | 'info' }) => {
    if (type === 'warn') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    if (type === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    return <Info className="w-3.5 h-3.5 text-[#D64062]" />;
  };

  return (
    <header className="h-14 bg-[#FDFDFD] dark:bg-[#0F1428] border-b border-slate-200/80 dark:border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 z-40 shadow-xs select-none">
      {/* Left: Brand & Active Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block" />

        {/* Active Client Site Selector */}
        {availableProjects.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0F1428] dark:text-slate-100 hover:border-[#D64062]/40 transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#D64062]" />
              <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeProjectName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isProjectMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#FDFDFD] dark:bg-[#0F1428] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 font-bold text-[10px] uppercase text-slate-400 font-mono">
                  Active Client Sites
                </div>
                {availableProjects.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      onSelectProjectName(p);
                      setIsProjectMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      activeProjectName === p ? 'text-[#D64062] font-bold' : 'text-[#0F1428] dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{p}</span>
                    {activeProjectName === p && <CheckCircle2 className="w-3.5 h-3.5 text-[#D64062] shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle: Global Spotlight Search */}
      <div className="hidden lg:flex flex-1 justify-center px-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 w-full max-w-xs h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#D64062]/40 transition-all text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="flex-1 text-left truncate">Search Verdiore Studio...</span>
          <kbd className="inline-flex items-center gap-0.5 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 shrink-0">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">

        {/* Quick + New Action Button */}
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isNewMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#FDFDFD] dark:bg-[#0F1428] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs font-semibold">
              {[
                { type: 'lead' as const, label: '+ New Client Lead' },
                { type: 'boq' as const, label: 'Create BOQ Line Item' },
                { type: 'vendor' as const, label: 'Raise PO / Work Order' },
                { type: 'project' as const, label: '+ New Project Scaffold', border: true },
                { type: 'user' as const, label: '+ Provision User Sign-In', border: true },
              ].map((item, idx) => (
                <button
                  key={item.type}
                  onClick={() => {
                    onOpenNewItemModal(item.type);
                    setIsNewMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0F1428] dark:text-slate-200 flex items-center gap-2 cursor-pointer ${item.border ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#D64062] shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={openNotifications}
            className="p-2 rounded-xl text-slate-500 hover:text-[#0F1428] dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#D64062] ring-2 ring-white dark:ring-slate-900 flex items-center justify-center font-mono text-[9px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-[#FDFDFD] dark:bg-[#0F1428] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-[#0F1428] dark:text-slate-100">Notifications</span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-slate-400">
                  <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p className="text-[11px]">No notifications yet</p>
                  <p className="text-[10px] mt-0.5 opacity-60">Activity from your team will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                  {notifications.map((n) => {
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
                        <div className="pt-0.5 shrink-0">
                          <NotifIcon type={n.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`truncate ${isUnread ? 'font-bold text-[#0F1428] dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{n.desc}</p>
                        </div>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D64062] shrink-0 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="px-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-mono">
                  {unreadCount === 0 ? 'All caught up ✓' : `${unreadCount} unread`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Email Console */}
        <button
          onClick={onOpenEmailConsole}
          className="p-2 rounded-xl text-slate-500 hover:text-[#D64062] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Email Console"
        >
          <Mail className="w-4 h-4" />
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2">
          <UserAvatar name={user.name} role={user.role} size="sm" showStatus />
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-[#D64062] transition-colors p-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
