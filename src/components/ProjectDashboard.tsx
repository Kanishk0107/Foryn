import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { ProjectAnalytics } from './ProjectAnalytics';
import { MOCK_PROJECTS, MOCK_DESIGNS, ProjectCardData, DesignCardData } from '../data/mockData';
import defaultThumbnail from '../assets/images/foryn_indian_kitchen_1_1786438839476.jpg';
import { UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';
import {
  FolderPlus,
  Plus,
  Search,
  Clock,
  Layers,
  HelpCircle,
  Maximize2,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Youtube,
  BookOpen,
  Trash2,
  Folder,
  LayoutGrid,
  FileText,
  User,
  Building,
  CheckCircle2,
  Sliders,
  MoreVertical,
  BarChart3
} from 'lucide-react';

interface ProjectDashboardProps {
  user: UserProfile;
  onOpenStudio: (designName?: string) => void;
  onLogout: () => void;
  hideHeader?: boolean;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  user,
  onOpenStudio,
  onLogout,
  hideHeader = false
}) => {
  const [activeTab, setActiveTab] = useState<'production' | 'analytics' | 'recent' | 'all' | 'deleted'>('production');
  const [projects, setProjects] = useState<ProjectCardData[]>(MOCK_PROJECTS);
  const [designs, setDesigns] = useState<DesignCardData[]>(MOCK_DESIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newClientName, setNewClientName] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    const newProj: ProjectCardData = {
      id: `proj-${Date.now()}`,
      title: newProjectName,
      client: newClientName || 'New Client',
      timeAgo: 'Just now',
      designCount: 1,
      thumbnail: projects[0]?.thumbnail || defaultThumbnail,
      status: 'In Production'
    };

    const newDes: DesignCardData = {
      id: `des-${Date.now()}`,
      title: 'Design1 (Modular Floorplan)',
      projectName: newProjectName,
      timeAgo: 'Just now',
      thumbnail: projects[0]?.thumbnail || defaultThumbnail,
      type: '3D Render'
    };

    setProjects([newProj, ...projects]);
    setDesigns([newDes, ...designs]);
    setIsCreatingProject(false);
    setNewProjectName('');
    setNewClientName('');
    onOpenStudio(newDes.title);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDesigns = designs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${hideHeader ? 'h-[calc(100vh-3.5rem)]' : 'min-h-screen'} bg-[#f4f5f7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans select-none rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800`}>
      {/* Top Header Navbar - Only when not inside enterprise shell */}
      {!hideHeader && (
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-xs z-30">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
          </div>

          {/* Right Nav Utilities */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button className="flex items-center gap-1 hover:text-[#0F1428] transition-colors">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#0F1428] transition-colors">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>MES</span>
            </button>

            {/* User Profile Avatar */}
            <UserAvatar name={user.name} role={user.role} size="md" showStatus />

            <button title="Help Documentation" className="text-slate-400 hover:text-slate-700">
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              title="Toggle Fullscreen"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="text-slate-400 hover:text-slate-700"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-slate-400 hover:text-[#D64062] transition-colors pl-2 border-l border-slate-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Body Grid: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 p-4">
          <div>
            {/* User & Organization Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-[#0F1428] font-bold flex items-center justify-center border border-slate-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">
                  PENTAGRAM ARCHITECTS
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsCreatingProject(true)}
              className="w-full py-2.5 px-4 bg-[#0F1428] hover:bg-[#0F1428] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            {/* Nav Menu Items */}
            <nav className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-[#D64062] text-slate-950 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-[#0F1428]" />
                  <span>Project Analytics</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-slate-200 text-[#0F1428]">
                  D3
                </span>
              </button>

              <button
                onClick={() => setActiveTab('recent')}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-slate-50 text-[#0F1428]'
                    : 'text-slate-600 hover:bg-slate-100/80'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recently Accessed</span>
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-50 text-[#0F1428]'
                    : 'text-slate-600 hover:bg-slate-100/80'
                }`}
              >
                <Folder className="w-4 h-4 text-slate-400" />
                <span>All Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('deleted')}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'deleted'
                    ? 'bg-slate-50 text-[#0F1428]'
                    : 'text-slate-600 hover:bg-slate-100/80'
                }`}
              >
                <Trash2 className="w-4 h-4 text-slate-400" />
                <span>Deleted Items</span>
              </button>

              {/* Highlighted Production Designs Tab */}
              <div className="pt-3">
                <button
                  onClick={() => setActiveTab('production')}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    activeTab === 'production'
                      ? 'bg-[#0F1428] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Production Designs</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#D64062] animate-pulse" />
                </button>
                <a
                  href="#know-more"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Foryn Production Designs module connects directly to CNC manufacturing factories for automated cutting lists.');
                  }}
                  className="text-[11px] text-[#0F1428] hover:underline pl-9 mt-1 block font-normal"
                >
                  Know more
                </a>
              </div>
            </nav>
          </div>

          {/* Bottom Help & Documentation Section */}
          <div className="pt-6 border-t border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Resources to help you
            </span>
            <div className="space-y-1.5 text-xs text-slate-600">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-red-600 transition-colors py-1"
              >
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <span>Tutorials in youtube</span>
              </a>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Opening Foryn CAD Documentation Guide.');
                }}
                className="flex items-center gap-2 hover:text-[#0F1428] transition-colors py-1"
              >
                <BookOpen className="w-4 h-4 text-[#0F1428] shrink-0" />
                <span>Help Documentation</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Top Search & Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, client names or designs..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 pl-10 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-200 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2.5 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-[#D64062] text-slate-950 font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#0F1428]" />
                <span>Project Analytics</span>
              </button>

              <button
                onClick={() => onOpenStudio()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D64062]" />
                <span>Launch Studio Canvas</span>
              </button>
            </div>
          </div>

          {/* D3 Project Analytics Component */}
          {(activeTab === 'analytics' || activeTab === 'production') && (
            <section className="mb-2">
              <ProjectAnalytics user={user} />
            </section>
          )}

          {/* Section 1: Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#0F1428]" />
                <span>Recent Projects</span>
              </h2>

              <button
                onClick={() => setIsCreatingProject(true)}
                className="text-xs font-bold text-[#0F1428] hover:text-[#0F1428] flex items-center gap-1"
              >
                <span>+ Create new project</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onOpenStudio(project.title)}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col justify-between"
                >
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
                  </div>

                  <div className="p-3.5 bg-slate-700 text-white flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[140px]">{project.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">Client: {project.client}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block">{project.timeAgo}</span>
                      <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{project.designCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Recent Designs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F1428]" />
                <span>Recent Designs</span>
              </h2>
            </div>

            {/* Designs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  onClick={() => onOpenStudio(design.title)}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col"
                >
                  <div className="h-36 bg-slate-100 relative overflow-hidden">
                    <img
                      src={design.thumbnail}
                      alt={design.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-mono backdrop-blur-xs">
                      {design.type}
                    </span>
                  </div>

                  <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0F1428] transition-colors truncate">
                        {design.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        In: {design.projectName}
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      {design.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* New Project Modal Dialog */}
      <AnimatePresence>
        {isCreatingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Interior Project</h3>
              <p className="text-xs text-slate-500 mb-6">
                Start a 2D/3D project workspace for your client on Foryn.
              </p>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Project76 or Villa Penthouse"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Mr. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-200"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F1428] hover:bg-[#0F1428] text-white font-semibold text-xs rounded-xl shadow-sm"
                  >
                    Create & Open CAD Studio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
