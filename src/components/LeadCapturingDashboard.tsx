import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LeadItem,
  LeadSource,
  LeadStatus,
  UserProfile,
  CallLogItem,
  FollowUpItem,
  ActivityLogItem
} from '../types';
import { UserAvatar } from './UserAvatar';
import { generateUniquePID } from '../utils/pidGenerator';
import {
  Search,
  Plus,
  Filter,
  PhoneCall,
  PhoneOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Lock,
  Mic,
  MicOff,
  Radio,
  Volume2,
  UserCheck,
  SlidersHorizontal,
  ExternalLink,
  MoreVertical,
  Layers,
  Clock,
  FileText,
  Tag,
  ArrowUpRight,
  Send,
  User,
  Bell,
  AlertCircle,
  Check,
  CalendarClock,
  Kanban,
  Table,
  RefreshCw,
  History,
  MessageSquare,
  Activity
} from 'lucide-react';

const PRE_SALES_STATUSES: LeadStatus[] = [
  'New Enquiry',
  'Call Scheduled',
  'Call Done',
  'Call Back Required',
  'No Answer',
  'Fake Lead',
  'Duplicate lead',
  'No Requirement',
  'Promoted to Sales Team'
];

interface LeadCapturingDashboardProps {
  user: UserProfile;
  leads: LeadItem[];
  onAddLead: (lead: Omit<LeadItem, 'id' | 'createdAt'>) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onConvertLeadToProject: (lead: LeadItem) => void;
  onUpdateLead?: (updatedLead: LeadItem) => void;
  autoOpenLeadModal?: boolean;
}

// Helper function to ensure every lead has a rich activity timeline
function ensureLeadActivityLogs(lead: LeadItem): ActivityLogItem[] {
  if (lead.activityLogs && lead.activityLogs.length > 0) {
    return lead.activityLogs;
  }

  const logs: ActivityLogItem[] = [];

  // 1. Initial creation
  logs.push({
    id: `act-init-${lead.id}`,
    type: 'lead_created',
    title: 'Inbound Lead Captured',
    description: lead.description || lead.notes || `Lead registered via ${lead.source}.`,
    timestamp: lead.createdAt || '10-Aug-26 01:30 PM',
    performedBy: lead.assignedSalesOwner || 'System Auto-Capture'
  });

  // 2. Add existing calls if any
  if (lead.callLogs && lead.callLogs.length > 0) {
    lead.callLogs.forEach((c) => {
      logs.push({
        id: `act-call-${c.id}`,
        type: 'call',
        title: `Outbound Call Completed (${c.duration})`,
        description: c.notes || c.transcriptSummary || 'Encrypted call completed.',
        timestamp: c.timestamp,
        performedBy: c.calledBy,
        metadata: {
          callDuration: c.duration,
          isRecorded: true
        }
      });
    });
  }

  // 3. Add existing follow-ups
  if (lead.followUps && lead.followUps.length > 0) {
    lead.followUps.forEach((f) => {
      logs.push({
        id: `act-fol-${f.id}`,
        type: 'followup',
        title: `Follow-Up Scheduled: ${f.date} ${f.time || ''}`,
        description: f.note,
        timestamp: lead.createdAt,
        performedBy: f.assignedTo
      });
    });
  }

  return logs;
}

export const LeadCapturingDashboard: React.FC<LeadCapturingDashboardProps> = ({
  user,
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onConvertLeadToProject,
  onUpdateLead,
  autoOpenLeadModal = false
}) => {
  // Navigation views: 'grid' (Table/Kanban) vs 'detail' (Inspector View)
  const [activeView, setActiveView] = useState<'grid' | 'detail'>('grid');
  // Display Mode within Grid: 'table' vs 'kanban'
  const [displayMode, setDisplayMode] = useState<'table' | 'kanban'>('table');

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(leads[0] || null);

  // Detail Modal Sub-Tabs
  const [activeDetailTab, setActiveDetailTab] = useState<
    'details' | 'followups' | 'calllogs' | 'activity' | 'location'
  >('details');

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  useEffect(() => {
    if (autoOpenLeadModal) {
      setIsNewLeadModalOpen(true);
    }
  }, [autoOpenLeadModal]);

  // Follow Up Notifications State
  const [isFollowUpDrawerOpen, setIsFollowUpDrawerOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [followUpNotificationBanner, setFollowUpNotificationBanner] = useState<string | null>(null);


  // Floating Call Terminal Modal State
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [dialingLead, setDialingLead] = useState<LeadItem | null>(null);
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [postCallNotes, setPostCallNotes] = useState('');

  // Editable Lead Inspector Form state
  const [inspectorLead, setInspectorLead] = useState<LeadItem | null>(leads[0] || null);
  const [newFollowUpText, setNewFollowUpText] = useState('');
  const [newFollowUpDate, setNewFollowUpDate] = useState('Tomorrow');
  const [newFollowUpTime, setNewFollowUpTime] = useState('04:00 PM');
  const [newActivityNote, setNewActivityNote] = useState('');

  // New Lead Form State
  const [newClientName, setNewClientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('Meta / IG Ads');
  const [newBudget, setNewBudget] = useState<number>(20.0);
  const [newLocation, setNewLocation] = useState('Gurugram Sector 79');
  const [newPropertyType, setNewPropertyType] = useState('3BHK Luxury Apartment');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    if (selectedLead) {
      const enriched = {
        ...selectedLead,
        activityLogs: ensureLeadActivityLogs(selectedLead)
      };
      setInspectorLead(enriched);
    }
  }, [selectedLead]);

  // Sync leads if selected lead updates in parent
  useEffect(() => {
    if (inspectorLead) {
      const currentInList = leads.find((l) => l.id === inspectorLead.id);
      if (currentInList && currentInList.status !== inspectorLead.status) {
        setInspectorLead((prev) => (prev ? { ...prev, status: currentInList.status } : prev));
      }
    }
  }, [leads]);

  // Live Call timer
  useEffect(() => {
    let timer: any;
    if (isDialerOpen && callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDialerOpen, callState]);

  const handleStartCall = (lead: LeadItem) => {
    setDialingLead(lead);
    setIsDialerOpen(true);
    setCallState('dialing');
    setCallDuration(0);
    setIsMuted(false);
    setIsRecording(true);
    setPostCallNotes('');

    // Simulate gateway connection after 1.5s
    setTimeout(() => {
      setCallState('connected');
    }, 1500);
  };

  const handleEndCall = () => {
    setCallState('ended');
  };

  const handleSaveCallLog = () => {
    if (!dialingLead) return;

    const formattedDuration = `${Math.floor(callDuration / 60)}m ${(callDuration % 60)
      .toString()
      .padStart(2, '0')}s`;

    const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCallLog: CallLogItem = {
      id: `call-${Date.now()}`,
      calledBy: user.name,
      timestamp: nowFormatted,
      duration: formattedDuration,
      status: 'Completed',
      recordingUrl: `https://foryn-calls-vault.internal/rec_${dialingLead.id}_${Date.now()}.mp3`,
      transcriptSummary: postCallNotes || 'In-system encrypted call completed. Secured phone relay active.',
      notes: postCallNotes || 'Client discussed project scope, timeline and budget requirements.'
    };

    const newActivityLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'call',
      title: `Outbound Call Completed (${formattedDuration})`,
      description: postCallNotes
        ? `Call Notes: ${postCallNotes}`
        : 'Spoke with client regarding design layout and requirements.',
      timestamp: nowFormatted,
      performedBy: user.name,
      metadata: {
        callDuration: formattedDuration,
        isRecorded: isRecording
      }
    };

    const updatedLogs = [newCallLog, ...(dialingLead.callLogs || [])];
    const updatedActivities = [newActivityLog, ...ensureLeadActivityLogs(dialingLead)];

    const updatedLead: LeadItem = {
      ...dialingLead,
      callLogs: updatedLogs,
      activityLogs: updatedActivities,
      lastUpdateDate: 'Just now'
    };

    if (onUpdateLead) {
      onUpdateLead(updatedLead);
    }

    if (inspectorLead && inspectorLead.id === dialingLead.id) {
      setInspectorLead(updatedLead);
    }

    setIsDialerOpen(false);
    setDialingLead(null);
  };

  // Status Change Handler with Auto-Logged Activity
  const handleStatusChangeWithLog = (leadItem: LeadItem, newStatus: LeadStatus) => {
    if (leadItem.status === newStatus) return;

    const oldStatus = leadItem.status;
    onUpdateLeadStatus(leadItem.id, newStatus);

    const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const statusActivityLog: ActivityLogItem = {
      id: `act-st-${Date.now()}`,
      type: 'status_change',
      title: `Status Changed to "${newStatus}"`,
      description: `Pipeline stage updated from "${oldStatus}" to "${newStatus}".`,
      timestamp: nowFormatted,
      performedBy: user.name,
      metadata: { oldStatus, newStatus }
    };

    const updatedActivities = [statusActivityLog, ...ensureLeadActivityLogs(leadItem)];
    const updatedLead: LeadItem = {
      ...leadItem,
      status: newStatus,
      activityLogs: updatedActivities,
      lastUpdateDate: 'Just now'
    };

    if (onUpdateLead) {
      onUpdateLead(updatedLead);
    }

    if (inspectorLead && inspectorLead.id === leadItem.id) {
      setInspectorLead(updatedLead);
    }
  };

  // Drag and drop handlers for Kanban View
  const handleDragStart = (e: React.DragEvent, lead: LeadItem) => {
    e.dataTransfer.setData('leadId', lead.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    const leadToMove = leads.find((l) => l.id === leadId);
    if (leadToMove) {
      handleStatusChangeWithLog(leadToMove, targetStatus);
    }
  };

  // Add Manual Note to Lead Activity Timeline
  const handleAddActivityNote = () => {
    if (!newActivityNote.trim() || !inspectorLead) return;

    const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const manualLog: ActivityLogItem = {
      id: `act-note-${Date.now()}`,
      type: 'note',
      title: 'Manual Activity Note Logged',
      description: newActivityNote.trim(),
      timestamp: nowFormatted,
      performedBy: user.name
    };

    const updatedActivities = [manualLog, ...ensureLeadActivityLogs(inspectorLead)];
    const updatedLead: LeadItem = {
      ...inspectorLead,
      activityLogs: updatedActivities,
      lastUpdateDate: 'Just now'
    };

    setInspectorLead(updatedLead);
    if (onUpdateLead) {
      onUpdateLead(updatedLead);
    }

    setNewActivityNote('');
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newPhone) return;

    const assignedPid = generateUniquePID(leads);

    onAddLead({
      pid: assignedPid,
      clientName: newClientName,
      phone: newPhone,
      email: newEmail || `${newClientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      source: newSource,
      estimatedBudget: Number(newBudget),
      budgetLabel: `₹${newBudget} Lakhs`,
      propertyType: newPropertyType,
      location: newLocation,
      status: 'New Enquiry',
      probability: 50,
      notes: newDescription || 'Captured directly into Foryn Pre-Sales CRM.',
      assignedSalesOwner: user.name,
      assignedDesignLead: 'Anjali Sharma (Design Lead)',
      lastUpdateDate: 'Just now',
      description: newDescription || 'Direct sales inquiry captured.',
      latestRemark: '[FL] Lead Created',
      rating: 4,
      enableClientAppLogin: true,
      tags: ['NewLead', newSource.split(' ')[0]],
      callLogs: [],
      followUps: [],
      activityLogs: [
        {
          id: `act-new-${Date.now()}`,
          type: 'lead_created',
          title: 'New Lead Registered',
          description: newDescription || `Captured via ${newSource}`,
          timestamp: 'Just now',
          performedBy: user.name
        }
      ]
    });

    setIsNewLeadModalOpen(false);
    setNewClientName('');
    setNewPhone('');
    setNewEmail('');
    setNewDescription('');
  };

  // Pending followups across all leads
  const allPendingFollowUps = useMemo(
    () =>
      leads.flatMap((lead) =>
        (lead.followUps || [])
          .filter((f) => !f.completed)
          .map((f) => ({ ...f, lead }))
      ),
    [leads]
  );

  // Search & Filtered Leads
  const filteredLeads = useMemo(
    () =>
      leads.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.clientName.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.pid.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.source.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesSource = sourceFilter === 'All' || item.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
      }),
    [leads, searchQuery, statusFilter, sourceFilter]
  );

  const totalLeadsCount = leads.length;
  const totalBudgetSum = useMemo(
    () => leads.reduce((acc, l) => acc + (l.estimatedBudget || 0), 0),
    [leads]
  );

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Top Urgent Follow-Up Notification Banner */}
      {!isBannerDismissed && allPendingFollowUps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#D64062] text-slate-950 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 animate-bounce shrink-0 text-slate-950" />
            <span>
              Reminder: {allPendingFollowUps.length} Follow-up{allPendingFollowUps.length > 1 ? 's' : ''} scheduled! ({allPendingFollowUps.slice(0, 2).map((f) => f.lead.clientName).join(', ')})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFollowUpDrawerOpen(true)}
              className="px-2.5 py-1 bg-slate-950 text-white hover:bg-slate-900 font-extrabold text-[11px] rounded-lg shadow-2xs"
            >
              View Schedule ({allPendingFollowUps.length})
            </button>
            <button
              onClick={() => setIsBannerDismissed(true)}
              className="p-1 text-slate-950 hover:bg-slate-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ======================================================== */}
      {/* GRID VIEW (Table or Kanban Board)                        */}
      {/* ======================================================== */}
      {activeView === 'grid' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Header Summary Bar */}
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Leads Count:
                </span>
                <span className="text-xl font-black text-slate-900">{totalLeadsCount}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pipeline Value:
                </span>
                <span className="text-xl font-black text-[#0F1428]">
                  ₹{totalBudgetSum.toFixed(1)} Lakhs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Follow-up Notifications Bell button */}
              <button
                onClick={() => setIsFollowUpDrawerOpen(true)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#0F1428] transition-all shadow-2xs flex items-center gap-1.5 text-xs font-bold"
                title="Follow-Up Notifications"
              >
                <Bell className="w-4 h-4 text-[#0F1428]" />
                <span className="hidden sm:inline">Notifications</span>
                {allPendingFollowUps.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#D64062] text-white font-extrabold text-[10px] animate-pulse">
                    {allPendingFollowUps.length}
                  </span>
                )}
              </button>

              {/* View Switcher: Table View vs Kanban Board View */}
              <div className="flex items-center bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setDisplayMode('table')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    displayMode === 'table'
                      ? 'bg-white text-slate-900 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>

                <button
                  onClick={() => setDisplayMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    displayMode === 'kanban'
                      ? 'bg-[#D64062] text-white font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Kanban View</span>
                </button>
              </div>

              <button
                onClick={() => setIsNewLeadModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Lead</span>
              </button>
            </div>
          </div>

          {/* Filter Toolbar with Search by Unique PID, Name, Source */}
          <div className="p-3 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[240px] flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Unique PID (e.g. 1001), Name, Phone..."
                  className="w-full pl-8 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#D64062]/20 shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-extrabold focus:outline-none"
              >
                <option value="All">Status: All Options</option>
                {PRE_SALES_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold focus:outline-none"
              >
                <option value="All">Filter Source: All</option>
                <option value="Meta / IG Ads">Meta / IG Ads</option>
                <option value="Website Inquiry">Website Inquiry</option>
                <option value="Builder Referral">Builder Referral</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-[#0F1428] border border-slate-200 font-extrabold text-[11px]">
                Showing {filteredLeads.length} of {totalLeadsCount} Leads
              </span>
            </div>
          </div>

          {/* TABLE VIEW DISPLAY */}
          {displayMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3 w-8">
                      <input type="checkbox" className="rounded text-[#D64062]" />
                    </th>
                    <th className="p-3 w-12 text-center">S.No.</th>
                    <th className="p-3">Client Name & Unique PID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Phone & Direct Call</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Follow Up Alerts</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3">Assigned Sales & Design</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3 max-w-xs">Description</th>
                    <th className="p-3">Latest Remark</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-[#D64062]" />
                      </td>

                      {/* S.No. Serial Number */}
                      <td className="p-3 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                        {index + 1}
                      </td>

                      {/* Client Name & Unique PID */}
                      <td className="p-3 font-extrabold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#D64062]/10 text-[#D64062] flex items-center justify-center font-black text-xs shrink-0">
                            {item.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span
                              onClick={() => {
                                setSelectedLead(item);
                                setActiveView('detail');
                              }}
                              className="hover:underline hover:text-[#D64062] text-slate-900 font-black text-xs"
                            >
                              {item.clientName}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-extrabold w-fit mt-0.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-[#0F1428]" />
                              <span>{item.pid}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChangeWithLog(item, e.target.value as LeadStatus)
                          }
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold focus:outline-none ${
                            item.status === 'New Enquiry'
                              ? 'bg-slate-100 text-[#0F1428] border-slate-200'
                              : item.status === 'Call Scheduled'
                              ? 'bg-slate-100 text-[#0F1428] border-slate-200'
                              : item.status === 'Call Done'
                              ? 'bg-slate-100 text-[#0F1428] border-slate-200'
                              : item.status === 'Call Back Required'
                              ? 'bg-slate-100 text-[#0F1428] border-slate-200'
                              : item.status === 'Promoted to Sales Team'
                              ? 'bg-slate-100 text-[#0F1428] border-slate-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {PRE_SALES_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Phone with IN-SYSTEM FLOATING CALL TERMINAL BUTTON */}
                      <td className="p-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-700">{item.phone}</span>
                          <button
                            onClick={() => handleStartCall(item)}
                            className="p-1.5 rounded-lg bg-[#D64062] hover:bg-[#C03252] text-white font-bold transition-all shadow-2xs"
                            title="Launch Call Terminal"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                        {item.email}
                      </td>

                      {/* Follow Up Alerts */}
                      <td className="p-3 whitespace-nowrap">
                        {item.followUps && item.followUps.length > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-[#D64062]/10 text-[#D64062] border border-[#D64062]/20 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            <span>{item.followUps[0].date}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">No alerts</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap font-mono">
                        {item.createdAt}
                      </td>

                      {/* Assigned To */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5" title={`Sales: ${item.assignedSalesOwner} | Design: ${item.assignedDesignLead}`}>
                          <UserAvatar name={item.assignedSalesOwner} role="Sales Lead" size="xs" />
                          <UserAvatar name={item.assignedDesignLead} role="Interior Designer" size="xs" />
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.budgetLabel || `₹${item.estimatedBudget}L`}
                      </td>

                      {/* Description */}
                      <td
                        className="p-3 text-slate-500 max-w-xs truncate"
                        title={item.description || item.notes}
                      >
                        {item.description ? item.description.substring(0, 45) + '...' : item.notes}
                      </td>

                      {/* Latest Remark */}
                      <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                          {item.latestRemark || '[FL] Lead Created'}
                        </span>
                      </td>

                      {/* Actions: Convert to Active Site + Inspect */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onConvertLeadToProject(item)}
                            className="px-2.5 py-1 rounded-xl bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-[11px] transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            title="Convert deal to active site and open 31 stages"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>+ Convert to Active Site</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLead(item);
                              setActiveView('detail');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
                          >
                            Inspect File
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* KANBAN BOARD VIEW DISPLAY */}
          {displayMode === 'kanban' && (() => {
            const kanbanStatuses =
              statusFilter === 'All'
                ? PRE_SALES_STATUSES
                : PRE_SALES_STATUSES.filter((st) => st === statusFilter);

            return (
              <div className="p-4 bg-slate-100/70 w-full space-y-4">
                {/* Quick Status Filter Bar inside Kanban View */}
                <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200/80 text-xs">
                  <span className="font-extrabold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">
                    Kanban Filter:
                  </span>
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'All'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    All Statuses
                  </button>
                  {PRE_SALES_STATUSES.map((st) => {
                    const count = leads.filter((l) => l.status === st).length;
                    const isSelected = statusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#D64062] text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <span>{st}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                            isSelected ? 'bg-[#A82440] text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Grid or Focused Column Display */}
                <div
                  className={
                    kanbanStatuses.length === 1
                      ? 'w-full max-w-2xl mx-auto'
                      : 'grid grid-cols-1 md:grid-cols-3 gap-4 w-full'
                  }
                >
                  {kanbanStatuses.map((status) => {
                    const statusLeads = filteredLeads.filter((l) => l.status === status);
                    return (
                      <div
                        key={status}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status)}
                        className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col max-h-[460px]"
                      >
                        {/* Column Header */}
                        <div className="p-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-xs text-slate-800">{status}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px]">
                              {statusLeads.length}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Drag to move</span>
                        </div>

                        {/* Column Cards */}
                        <div className="p-2.5 space-y-3 overflow-y-auto flex-1 min-h-[150px]">
                          {statusLeads.length === 0 ? (
                            <div className="p-6 text-center text-slate-300 text-xs font-medium border-2 border-dashed border-slate-200 rounded-xl">
                              Drop leads here
                            </div>
                          ) : (
                            statusLeads.map((lead) => (
                              <motion.div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e as any, lead)}
                                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#D64062]/20 shadow-2xs hover:shadow-md transition-all space-y-2 cursor-grab active:cursor-grabbing group"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-black border border-slate-200">
                                      <ShieldCheck className="w-2.5 h-2.5 text-[#0F1428]" />
                                      <span>PID: {lead.pid}</span>
                                    </span>
                                    <h4
                                      onClick={() => {
                                        setSelectedLead(lead);
                                        setActiveView('detail');
                                      }}
                                      className="font-black text-sm text-slate-900 group-hover:text-[#D64062] cursor-pointer hover:underline block"
                                    >
                                      {lead.clientName}
                                    </h4>
                                  </div>

                                  <button
                                    onClick={() => handleStartCall(lead)}
                                    className="p-1.5 bg-[#D64062] hover:bg-[#C03252] text-white rounded-lg shadow-2xs shrink-0"
                                    title="Launch Call Terminal"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <p className="text-[11px] text-slate-500 line-clamp-2">
                                  {lead.notes || lead.description}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-slate-100 text-[10px]">
                                  <span className="font-extrabold text-[#0F1428] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    {lead.budgetLabel || `₹${lead.estimatedBudget}L`}
                                  </span>

                                  <span className="text-slate-500 font-mono">{lead.source}</span>
                                </div>

                                {/* Quick Move Selector */}
                                <div className="pt-1 flex items-center justify-between gap-1">
                                  <select
                                    value={lead.status}
                                    onChange={(e) =>
                                      handleStatusChangeWithLog(lead, e.target.value as LeadStatus)
                                    }
                                    className="w-full text-[10px] font-bold p-1 bg-slate-50 rounded border border-slate-200 text-slate-700 focus:outline-none"
                                  >
                                    {PRE_SALES_STATUSES.map((st) => (
                                      <option key={st} value={st}>
                                        Move to: {st}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Footer Pagination */}
          <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Items per page: 25</span>
            <div className="flex items-center gap-3">
              <span>
                1–{filteredLeads.length} of {totalLeadsCount}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-slate-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded hover:bg-slate-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEAD DETAILS / INSPECTOR VIEW                            */}
      {/* ======================================================== */}
      {activeView === 'detail' && inspectorLead && (
        <div className="space-y-4">
          {/* Top Bar header */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('grid')}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Leads List</span>
              </button>

              <div>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>{inspectorLead.clientName}</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-lg font-black text-[#0F1428]">
                    Unique PID: {inspectorLead.pid}
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  Created on: {inspectorLead.createdAt} • Last updated: {inspectorLead.lastUpdateDate}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartCall(inspectorLead)}
                className="px-3.5 py-2 bg-[#C03252] hover:bg-[#D64062] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Terminal</span>
              </button>

              <button
                onClick={() => onConvertLeadToProject(inspectorLead)}
                className="px-4 py-2 bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Convert to Active Site Project →</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('grid');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Details | Activity Log | Follow Ups | Call Logs | Location */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'details', label: 'Lead Home Overview' },
              { id: 'activity', label: `Activity Timeline (${ensureLeadActivityLogs(inspectorLead).length})` },
              { id: 'followups', label: `Follow Ups (${inspectorLead.followUps?.length || 0})` },
              { id: 'calllogs', label: `Call Logs (${inspectorLead.callLogs?.length || 0})` },
              { id: 'location', label: 'Location' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeDetailTab === tab.id
                    ? 'bg-[#D64062] text-white shadow-xs font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: DETAILS HOME OVERVIEW WITH INTEGRATED ACTIVITY TIMELINE */}
          {activeDetailTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {/* Left Column: Form Details & Client Meta */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-6">
                {/* Client Login & Rating Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700">Enable Client App Login:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspectorLead.enableClientAppLogin || false}
                        onChange={(e) =>
                          setInspectorLead({ ...inspectorLead, enableClientAppLogin: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D64062]"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Rating:</span>
                    <div className="flex items-center gap-1 text-[#D64062]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 cursor-pointer ${
                            star <= (inspectorLead.rating || 4)
                              ? 'fill-[#D64062] text-[#D64062]'
                              : 'text-slate-300'
                          }`}
                          onClick={() => setInspectorLead({ ...inspectorLead, rating: star })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-4 h-4 text-[#D64062]" />
                    <span>Contact Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={inspectorLead.clientName}
                        onChange={(e) =>
                          setInspectorLead({ ...inspectorLead, clientName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#D64062]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Client Phone *
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={inspectorLead.phone}
                          onChange={(e) =>
                            setInspectorLead({ ...inspectorLead, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D64062]/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleStartCall(inspectorLead)}
                          className="p-2 bg-[#D64062] hover:bg-[#C03252] text-white rounded-xl shadow-2xs"
                          title="Call directly"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Unique PID *
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={inspectorLead.pid}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Building2 className="w-4 h-4 text-[#D64062]" />
                    <span>Project Details & Pre-Sales CRM Pipeline</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Assigned Sales Owner
                      </label>
                      <select
                        value={inspectorLead.assignedSalesOwner}
                        onChange={(e) =>
                          setInspectorLead({ ...inspectorLead, assignedSalesOwner: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none"
                      >
                        <option value="Rishabh Bhardwaj (Sales Admin)">
                          Rishabh Bhardwaj (Sales Admin)
                        </option>
                        <option value="Rohan Verma (Senior Sales)">
                          Rohan Verma (Senior Sales)
                        </option>
                        <option value="Karan Malhotra (Sales)">Karan Malhotra (Sales)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Pipeline Status
                      </label>
                      <select
                        value={inspectorLead.status}
                        onChange={(e) =>
                          handleStatusChangeWithLog(inspectorLead, e.target.value as LeadStatus)
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none"
                      >
                        {PRE_SALES_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description Payload */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Meta Form Payload Response
                  </label>
                  <textarea
                    rows={4}
                    value={inspectorLead.description || inspectorLead.notes}
                    onChange={(e) =>
                      setInspectorLead({ ...inspectorLead, description: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono bg-slate-50"
                  />
                </div>
              </div>

              {/* Right Column: Real-Time Activity Log & Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#D64062]/10 text-[#D64062]">
                        <History className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">
                          Activity Log & History
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Unique PID: {inspectorLead.pid}
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#0F1428] font-black text-[10px] animate-pulse">
                      Live Sync
                    </span>
                  </div>

                  {/* Add Quick Activity Note Input */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <label className="block font-bold text-[11px] text-slate-700">
                      + Log Quick Interaction Note
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newActivityNote}
                        onChange={(e) => setNewActivityNote(e.target.value)}
                        placeholder="Log client call outcome or design note..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddActivityNote}
                        className="px-3 py-1.5 bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs rounded-lg shrink-0"
                      >
                        Log
                      </button>
                    </div>
                  </div>

                  {/* Timeline List */}
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {ensureLeadActivityLogs(inspectorLead).map((act) => (
                      <div
                        key={act.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 relative pl-8"
                      >
                        <div className="absolute left-2.5 top-3.5 w-4 h-4 rounded-full bg-white border-2 border-[#D64062]/20 flex items-center justify-center">
                          {act.type === 'call' && <PhoneCall className="w-2.5 h-2.5 text-[#D64062]" />}
                          {act.type === 'status_change' && (
                            <RefreshCw className="w-2.5 h-2.5 text-[#0F1428]" />
                          )}
                          {act.type === 'followup' && (
                            <CalendarClock className="w-2.5 h-2.5 text-[#0F1428]" />
                          )}
                          {act.type === 'note' && (
                            <MessageSquare className="w-2.5 h-2.5 text-[#0F1428]" />
                          )}
                          {act.type === 'lead_created' && (
                            <Sparkles className="w-2.5 h-2.5 text-[#0F1428]" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-900">{act.title}</span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {act.timestamp}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-700 font-medium whitespace-pre-line">
                          {act.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono border-t border-slate-100">
                          <span>By: {act.performedBy}</span>
                          {act.metadata?.isRecorded && (
                            <span className="text-[#D64062] font-bold flex items-center gap-1">
                              <Radio className="w-2.5 h-2.5 animate-pulse" /> Audio Rec
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: SEPARATE ACTIVITY TIMELINE VIEW */}
          {activeDetailTab === 'activity' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#D64062]" />
                    <span>Real-Time Activity Timeline (Unique PID: {inspectorLead.pid})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chronological audit log tracking calls, status updates, scheduled follow-ups, and notes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newActivityNote}
                    onChange={(e) => setNewActivityNote(e.target.value)}
                    placeholder="Enter real-time log note..."
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none"
                  />
                  <button
                    onClick={handleAddActivityNote}
                    className="px-4 py-2 bg-[#D64062] hover:bg-[#C03252] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    + Post Note
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {ensureLeadActivityLogs(inspectorLead).map((act) => (
                  <div
                    key={act.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-4"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#D64062] shrink-0 shadow-2xs">
                      {act.type === 'call' && <PhoneCall className="w-5 h-5 text-[#0F1428]" />}
                      {act.type === 'status_change' && (
                        <RefreshCw className="w-5 h-5 text-[#0F1428]" />
                      )}
                      {act.type === 'followup' && (
                        <CalendarClock className="w-5 h-5 text-[#0F1428]" />
                      )}
                      {act.type === 'note' && (
                        <MessageSquare className="w-5 h-5 text-[#0F1428]" />
                      )}
                      {act.type === 'lead_created' && (
                        <Sparkles className="w-5 h-5 text-[#D64062]" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-900 text-sm">{act.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {act.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium whitespace-pre-line">
                        {act.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                        <span>Performed by: {act.performedBy}</span>
                        <span>•</span>
                        <span className="text-[#0F1428] font-bold">PID: {inspectorLead.pid}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CALL LOGS */}
          {activeDetailTab === 'calllogs' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0F1428]" />
                    <span>In-System Encrypted Call Logs & Recordings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calls are routed through Foryn Cloud Relay. Client phone numbers remain masked.
                  </p>
                </div>

                <button
                  onClick={() => handleStartCall(inspectorLead)}
                  className="px-3.5 py-2 bg-[#C03252] hover:bg-[#D64062] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Start New System Call</span>
                </button>
              </div>

              {!inspectorLead.callLogs || inspectorLead.callLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <PhoneOff className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No calls logged yet for this lead.</p>
                  <p className="text-[11px] text-slate-400">
                    Click "Start New System Call" to initiate a secured call directly from your browser.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inspectorLead.callLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-slate-100 text-[#0F1428] font-mono font-bold text-[10px]">
                            {log.status}
                          </span>
                          <span className="font-extrabold text-slate-900">{log.calledBy}</span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            • {log.timestamp}
                          </span>
                        </div>

                        <span className="font-mono text-[#0F1428] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.duration}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium">{log.notes}</p>

                      {log.transcriptSummary && (
                        <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                          "Transcript Summary: {log.transcriptSummary}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-[#0F1428] font-mono font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Audio Recording Vaulted & Encrypted
                        </span>

                        <button className="text-[#D64062] font-bold hover:underline flex items-center gap-1">
                          <span>Play Call Audio</span>
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: FOLLOW UPS */}
          {activeDetailTab === 'followups' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-[#0F1428]" />
                <span>Scheduled Follow-Ups & Automatic Reminders</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newFollowUpText}
                  onChange={(e) => setNewFollowUpText(e.target.value)}
                  placeholder="Follow-up note (e.g. Confirm 3D presentation)..."
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none col-span-1 sm:col-span-1"
                />
                <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                  <input
                    type="text"
                    value={newFollowUpDate}
                    onChange={(e) => setNewFollowUpDate(e.target.value)}
                    placeholder="Date (e.g. 12-Aug-26 or Today)"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none flex-1"
                  />
                  <input
                    type="text"
                    value={newFollowUpTime}
                    onChange={(e) => setNewFollowUpTime(e.target.value)}
                    placeholder="Time (e.g. 05:00 PM)"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none w-28"
                  />
                  <button
                    onClick={() => {
                      if (!newFollowUpText) return;
                      const newF: FollowUpItem = {
                        id: `f-${Date.now()}`,
                        date: newFollowUpDate || 'Today',
                        time: newFollowUpTime || '05:00 PM',
                        note: newFollowUpText,
                        assignedTo: user.name,
                        completed: false,
                        isUrgent: true
                      };

                      const nowFormatted = new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      const newActivity: ActivityLogItem = {
                        id: `act-f-${Date.now()}`,
                        type: 'followup',
                        title: `Follow-Up Scheduled (${newFollowUpDate} ${newFollowUpTime})`,
                        description: newFollowUpText,
                        timestamp: nowFormatted,
                        performedBy: user.name
                      };

                      const updatedLead: LeadItem = {
                        ...inspectorLead,
                        followUps: [...(inspectorLead.followUps || []), newF],
                        activityLogs: [newActivity, ...ensureLeadActivityLogs(inspectorLead)]
                      };

                      setInspectorLead(updatedLead);
                      if (onUpdateLead) onUpdateLead(updatedLead);

                      setNewFollowUpText('');
                      setFollowUpNotificationBanner(
                        `New follow-up set for ${inspectorLead.clientName} at ${newFollowUpTime}`
                      );
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs"
                  >
                    + Schedule
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {(inspectorLead.followUps || []).map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={f.completed}
                        onChange={(e) => {
                          const updated = (inspectorLead.followUps || []).map((item) =>
                            item.id === f.id ? { ...item, completed: e.target.checked } : item
                          );
                          const updatedLead = { ...inspectorLead, followUps: updated };
                          setInspectorLead(updatedLead);
                          if (onUpdateLead) onUpdateLead(updatedLead);
                        }}
                        className="rounded text-[#D64062]"
                      />
                      <span
                        className={
                          f.completed ? 'line-through text-slate-400' : 'font-extrabold text-slate-900'
                        }
                      >
                        {f.note}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-[#0F1428] font-bold rounded">
                        {f.date} {f.time ? `• ${f.time}` : ''}
                      </span>
                      <button
                        onClick={() => handleStartCall(inspectorLead)}
                        className="px-2 py-0.5 bg-[#C03252] text-white rounded text-[10px] font-bold flex items-center gap-1"
                      >
                        <PhoneCall className="w-2.5 h-2.5" /> Call Terminal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: LOCATION MAP */}
          {activeDetailTab === 'location' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D64062]" />
                <span>Site Address & Geo-Coordinates ({inspectorLead.location})</span>
              </h3>
              <div className="h-64 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <MapPin className="w-8 h-8 text-[#D64062] animate-bounce" />
                <h4 className="font-extrabold text-slate-900">{inspectorLead.location}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  Site Measurement Team Dispatched • GPS Latitude: 28.4595, Longitude: 77.0266
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* FOLLOW-UP NOTIFICATIONS DRAWER MODAL                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isFollowUpDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-end p-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-white rounded-3xl max-w-lg w-full h-[85vh] p-6 shadow-2xl border border-slate-200 flex flex-col justify-between"
            >
              <div className="space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 text-[#0F1428]">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Follow-Up Reminders
                      </h2>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Live automated notification triggers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFollowUpDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {allPendingFollowUps.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#D64062] mx-auto" />
                    <p className="text-xs font-bold text-slate-700">All follow-ups are up to date!</p>
                    <p className="text-[11px] text-slate-400">
                      No pending client reminders due right now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allPendingFollowUps.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-50 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {item.lead.clientName}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                              PID: {item.lead.pid}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#D64062]/10 text-[#D64062] font-extrabold rounded-full animate-pulse">
                            Due: {item.date} {item.time || ''}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">{item.note}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Assigned: {item.assignedTo}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                handleStartCall(item.lead);
                                setIsFollowUpDrawerOpen(false);
                              }}
                              className="px-2.5 py-1 bg-[#C03252] hover:bg-[#D64062] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <PhoneCall className="w-3 h-3" /> Call Terminal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsFollowUpDrawerOpen(false)}
                  className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Close Notifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* FLOATING IN-SYSTEM CALL TERMINAL MODAL                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isDialerOpen && dialingLead && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-6 text-center relative overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#D64062]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D64062]/10 border border-slate-200 text-[#D64062] text-[11px] font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Encrypted Phone Relay Active</span>
                </div>

                <span className="font-mono text-[#D64062] text-xs font-bold px-2 py-0.5 rounded bg-[#D64062]/10 border border-slate-200">
                  PID: {dialingLead.pid}
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-200 text-[#D64062] mx-auto flex items-center justify-center text-xl font-black shadow-inner">
                  {dialingLead.clientName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-black text-white">{dialingLead.clientName}</h3>
                <p className="text-xs text-slate-400 font-mono">{dialingLead.phone}</p>
                <p className="text-[11px] text-[#D64062] font-mono font-bold">
                  {callState === 'dialing'
                    ? 'Connecting via Cloud Gateway...'
                    : callState === 'connected'
                    ? 'Call Connected & Active'
                    : 'Call Terminated'}
                </p>
              </div>

              {callState === 'connected' && (
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                  {/* Waveform animation */}
                  <div className="flex items-center justify-center gap-1.5 h-10">
                    {[30, 70, 40, 90, 60, 100, 50, 80, 40, 60, 85, 45].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [`${h}%`, `${100 - h}%`, `${h}%`] }}
                        transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2 }}
                        className="w-1 bg-[#D64062] rounded-full"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    {/* Record Call Toggle Button */}
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 font-bold transition-all text-[11px] ${
                        isRecording
                          ? 'bg-[#D64062]/10 border-[#D64062]/20 text-[#D64062] animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isRecording ? 'REC ON (256 kbps)' : 'REC OFF'}</span>
                    </button>

                    {/* Live Timer */}
                    <span className="text-[#D64062] font-bold text-sm">
                      {Math.floor(callDuration / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(callDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {callState === 'ended' && (
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-300">
                    Quick Call Remarks Logged to PID {dialingLead.pid}:
                  </label>
                  <textarea
                    rows={3}
                    value={postCallNotes}
                    onChange={(e) => setPostCallNotes(e.target.value)}
                    placeholder="Enter discussion takeaway or next steps..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-slate-200"
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-2">
                {callState === 'connected' && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-2xl border transition-all ${
                      isMuted
                        ? 'bg-[#D64062]/10 text-[#D64062] border-[#D64062]/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}

                {callState !== 'ended' ? (
                  <button
                    onClick={handleEndCall}
                    className="px-6 py-3 bg-[#C03252] hover:bg-[#D64062] text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveCallLog}
                    className="px-6 py-3 bg-[#D64062] hover:bg-[#D64062] text-slate-950 font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Save Log to Activity History</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* NEW LEAD MODAL                                           */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isNewLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">+ New Inbound Lead</h2>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Unique PID will be auto-generated
                  </p>
                </div>
                <button
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLeadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g. Monil Vijay"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 9784337747"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inflow Source</label>
                    <select
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value as LeadSource)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none"
                    >
                      <option value="Meta / IG Ads">Meta / IG Ads</option>
                      <option value="Website Inquiry">Website Inquiry</option>
                      <option value="Builder Referral">Builder Referral</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location / Zip</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Budget (₹ Lakhs)</label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inbound Notes / Form Response
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter Meta form answers..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewLeadModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#D64062] hover:bg-[#C03252] text-white font-bold rounded-xl shadow-md"
                  >
                    Save Lead
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
