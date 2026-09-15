import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ShowcaseCanvas } from './components/ShowcaseCanvas';
import { AuthCard } from './components/AuthCard';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ProjectDashboard } from './components/ProjectDashboard';
import { StudioDashboard } from './components/StudioDashboard';
import { LeadCapturingDashboard } from './components/LeadCapturingDashboard';
import { ProjectManagementDashboard } from './components/ProjectManagementDashboard';
import { FinanceDashboard } from './components/FinanceDashboard';
import { TransactionalEmailConsoleModal } from './components/TransactionalEmailConsoleModal';
import { QuickTipsOverlay } from './components/QuickTipsOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ForynLoadingExperience } from './components/loading/ForynLoadingExperience';

import { CookieConsentBanner } from './components/CookieConsentBanner';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/TermsConditionsModal';
import { ThankYouModal } from './components/ThankYouModal';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import { NotFoundPage } from './components/NotFoundPage';
import { initAnalytics, trackPageView } from './utils/analytics';



// Enterprise Redesign Workstations & Layout
import { EnterpriseTopBar } from './components/enterprise/EnterpriseTopBar';
import { EnterpriseSidebar, EnterpriseView } from './components/enterprise/EnterpriseSidebar';
import { ExecutiveOverview } from './components/enterprise/ExecutiveOverview';
import { MasterBoqStudio } from './components/enterprise/MasterBoqStudio';
import { ProjectExecutionTracker } from './components/enterprise/ProjectExecutionTracker';
import { GlobalCommandPalette } from './components/enterprise/GlobalCommandPalette';
import { NewSiteProjectModal } from './components/enterprise/NewSiteProjectModal';

import { sendTransactionalEmail } from './utils/emailNotificationService';
import { getGreetingTextByTime } from './utils/soothingAudio';
import {
  fetchNotificationsFromSupabase,
  subscribeToRealtimeNotifications
} from './utils/notificationService';

import { Toast, ToastMessage } from './components/Toast';
import { Logo } from './components/Logo';
import { ROOM_SCENES } from './data/mockData';
import {
  INITIAL_LEADS,
  INITIAL_VENDOR_ASSIGNMENTS,
  INITIAL_FINANCE_TRANSACTIONS
} from './data/organizationWorkflowData';
import { generateUniquePID } from './utils/pidGenerator';
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUserProfile,
  recordUserLoginMetrics,
  updateUserUsageDuration
} from './utils/supabaseClient';
import {
  fetchLeadsFromSupabase,
  createLeadInSupabase,
  updateLeadStatusInSupabase,
  fetchVendorsFromSupabase,
  createVendorInSupabase,
  fetchTransactionsFromSupabase,
  createTransactionInSupabase
} from './utils/supabaseDataService';

import {
  RoomScene,
  UserProfile,
  Hotspot,
  LeadItem,
  LeadStatus,
  VendorAssignment,
  FinanceTransaction,
  UserRole
} from './types';
import {
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function App() {
  const [currentScene, setCurrentScene] = useState<RoomScene>(ROOM_SCENES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Authenticated session required for workspace
  const [activeEnterpriseView, setActiveEnterpriseView] = useState<EnterpriseView>('executive');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Application Boot & Morph Splash Experience State
  const [isAppBooting, setIsAppBooting] = useState<boolean>(true);

  // Available Projects in Office Registry
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [activeProjectName, setActiveProjectName] = useState<string>('No Active Site Selected');

  const [user, setUser] = useState<UserProfile>({
    name: 'Rishabh Bhardwaj',
    email: 'rishabh@pentagram.in',
    role: 'Sales Lead',
    company: 'Pentagram Living Pvt. Ltd.'
  });

  // Modal Overlay States
  const [isEmailConsoleOpen, setIsEmailConsoleOpen] = useState<boolean>(false);
  const [isQuickTipsOpen, setIsQuickTipsOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [isScaffoldProjectModalOpen, setIsScaffoldProjectModalOpen] = useState<boolean>(false);
  const [autoOpenLeadModal, setAutoOpenLeadModal] = useState<boolean>(false);
  const [autoOpenBoqModal, setAutoOpenBoqModal] = useState<boolean>(false);
  const [autoOpenVendorModal, setAutoOpenVendorModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Production Quality Compliance Modals & 404 Routing
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);

  // Initialize Analytics & Dynamic Per-Page Meta Title / Description
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    let title = 'Foryn — Next-Gen Cloud Interior Design & Architecture Studio Platform';
    let desc = 'Unified workstation platform integrating real-time 3D CAD visualization, automated BOQ calculations, and end-to-end site project management.';

    if (isNotFoundPage) {
      title = '404 - Page Not Found | Foryn';
      desc = 'The requested studio workstation page does not exist.';
    } else if (isLoggedIn) {
      switch (activeEnterpriseView) {
        case 'executive':
          title = 'Executive Command Center | Foryn Enterprise';
          desc = 'Real-time MNC executive overview, active site metrics, and project velocity dashboard.';
          break;
        case 'boq':
          title = 'Master BOQ & Costing Studio | Foryn';
          desc = 'Automated Bill of Quantities costing engine with 18% GST liability calculation.';
          break;
        case 'crm':
          title = 'Lead CRM & Pre-Sales Pipeline | Foryn';
          desc = 'Pre-sales client pipeline management and project conversion engine.';
          break;
        case 'projects':
          title = '31-Stage Site Project Engine | Foryn';
          desc = 'End-to-end site execution tracking across 31 architectural stages.';
          break;
        case 'vendors':
          title = 'Procurement & Vendor Work Orders | Foryn';
          desc = 'Vendor milestone contracts and PM approval queue.';
          break;
        case 'finance':
          title = 'Finance & 18% GST Ledger | Foryn';
          desc = 'Vendor RTGS payout disbursements and tax credit ledger.';
          break;
        case 'studio':
          title = 'CAD 3D Workstation | Foryn Studio';
          desc = 'Real-time 2D floorplan editor and raytrace cloud render workstation.';
          break;
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    trackPageView(isNotFoundPage ? '/404' : isLoggedIn ? `/${activeEnterpriseView}` : '/login');
  }, [isLoggedIn, activeEnterpriseView, isNotFoundPage]);

  // Organization Workflow Persistent States
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [vendors, setVendors] = useState<VendorAssignment[]>(INITIAL_VENDOR_ASSIGNMENTS);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_FINANCE_TRANSACTIONS);

  // Clear all mock data helper so user can test filling data manually
  const handleClearAllData = () => {
    setLeads([]);
    setVendors([]);
    setTransactions([]);
    setAvailableProjects([]);
    setActiveProjectName('New Project (PID 1000)');
    addToast(
      'info',
      'Cleared All Demo Data',
      'All workspace records reset to zero. You can now test adding custom leads, projects, BOQ, and vendors manually.'
    );
  };

  const handleRestoreDemoData = () => {
    setLeads(INITIAL_LEADS);
    setVendors(INITIAL_VENDOR_ASSIGNMENTS);
    setTransactions(INITIAL_FINANCE_TRANSACTIONS);
    setAvailableProjects([
      'Villa Penthouse 402 (PID 1001)',
      'Modern Duplex Kitchen (PID 1002)',
      'Luxury 3BHK Residence (PID 1003)',
      'B3/21 DLF Alameda Villa (PID 1005)'
    ]);
    setActiveProjectName('Villa Penthouse 402 (PID 1001)');
    addToast('success', 'Restored Demo Data', 'Pre-populated initial showcase records reloaded.');
  };


  // Force Light Theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('foryn_theme', 'light');
  }, []);

  // Supabase Auth Listener & Profile Sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadProfile = async (userId: string, userEmail?: string) => {
      const profile = await getCurrentUserProfile();
      if (profile) {
        setUser({
          name: profile.name || userEmail?.split('@')[0] || 'User',
          email: profile.email || userEmail || '',
          role: profile.role || 'Sales Lead',
          company: profile.company || 'Pentagram Living Pvt. Ltd.'
        });
      } else if (userEmail) {
        setUser((prev) => ({
          ...prev,
          name: userEmail.split('@')[0],
          email: userEmail
        }));
      }
      setIsLoggedIn(true);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        await recordUserLoginMetrics(session.user.id);
        await loadProfile(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Periodic Usage Duration Tracker (Logs 60s active usage)
  useEffect(() => {
    if (!isLoggedIn || !isSupabaseConfigured || !supabase) return;

    const interval = setInterval(async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.id) {
        await updateUserUsageDuration(currentUser.id, 60);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Supabase Realtime Notifications Listener
  useEffect(() => {
    fetchNotificationsFromSupabase();

    const unsubscribe = subscribeToRealtimeNotifications((notif) => {
      addToast('info', notif.title, notif.message);
    });

    return () => unsubscribe();
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state with Supabase Cloud DB when configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function loadLiveSupabaseData() {
      const [supaLeads, supaVendors, supaTxs] = await Promise.all([
        fetchLeadsFromSupabase(),
        fetchVendorsFromSupabase(),
        fetchTransactionsFromSupabase()
      ]);

      if (supaLeads) setLeads(supaLeads);
      if (supaVendors) setVendors(supaVendors);
      if (supaTxs) setTransactions(supaTxs);
    }

    loadLiveSupabaseData();
  }, []);




  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title,
      description
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (userEmail: string, role?: string) => {
    setUser({
      name: userEmail.split('@')[0],
      email: userEmail,
      role: (role as UserRole) || 'Sales Lead'
    });
    setIsLoggedIn(true);
    setActiveEnterpriseView('executive');
    const timeGreeting = getGreetingTextByTime();
    addToast(
      'success',
      `Welcome to Foryn Office Workstation`,
      `Logged in as ${role || 'Sales Lead'}. ${timeGreeting}`
    );
  };

  const handleLaunchGuestDemo = () => {
    setUser({
      name: 'Rishabh Bhardwaj',
      email: 'rishabh@pentagram.in',
      role: 'Sales Lead',
      company: 'Pentagram Living Pvt. Ltd.'
    });
    setIsLoggedIn(true);
    setActiveEnterpriseView('executive');
    addToast(
      'info',
      'Foryn Enterprise Workstation Active',
      'All 7 office disciplines connected. Press Ctrl+K for quick navigation.'
    );
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    addToast('info', 'Logged out', 'Returned to Foryn login portal.');
  };

  const handleOpenStudio = (designName?: string) => {
    setActiveEnterpriseView('studio');
    addToast(
      'success',
      `Opened ${designName || 'CAD Studio Workstation'}`,
      '2D floorplan editor and raytrace cloud render ready.'
    );
  };

  const handleSelectHotspotInStudio = (hotspot: Hotspot) => {
    setUser({
      name: 'Rishabh Bhardwaj',
      email: 'rishabh@pentagram.in',
      role: 'Designer Team'
    });
    setIsLoggedIn(true);
    setActiveEnterpriseView('studio');
    addToast(
      'success',
      `Customizing ${hotspot.title}`,
      `Opened in Foryn CAD Studio (₹${hotspot.price.toLocaleString('en-IN')})`
    );
  };

  // --- Cross-Discipline Enterprise Workflow Handlers ---
  const handleAddLead = async (leadData: Omit<LeadItem, 'id' | 'createdAt'>) => {
    const assignedPid = leadData.pid || generateUniquePID(leads);
    const newLead: LeadItem = {
      ...leadData,
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      pid: assignedPid,
      createdAt: 'Just now'
    };
    setLeads([newLead, ...leads]);

    if (isSupabaseConfigured) {
      await createLeadInSupabase({ ...leadData, pid: assignedPid });
    }

    addToast('success', 'New Lead Captured', `Captured ${newLead.clientName} (PID #${assignedPid}) via ${newLead.source}`);
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    if (isSupabaseConfigured) {
      await updateLeadStatusInSupabase(leadId, newStatus);
    }

    addToast('info', 'Lead Pipeline Updated', `Lead status changed to ${newStatus}`);
  };

  const handleConvertLeadToProject = (lead: LeadItem) => {
    // 1. Mark Lead as Promoted in CRM
    handleUpdateLeadStatus(lead.id, 'Promoted to Sales Team');

    const newProjectTitle = `${lead.clientName}'s ${lead.propertyType} (${lead.pid})`;

    // 2. Add to active project registry if not existing
    if (!availableProjects.includes(newProjectTitle)) {
      setAvailableProjects([newProjectTitle, ...availableProjects]);
      setActiveProjectName(newProjectTitle);
    }

    // 3. Automatically create a PM vendor assignment record for this new site
    const newVendor: VendorAssignment = {
      id: `ven-${Date.now()}`,
      projectId: `proj-${Date.now()}`,
      projectName: newProjectTitle,
      category: 'Modular Cabinetry Factory',
      vendorName: 'Hettich Factory Craft Ltd.',
      contactPhone: lead.phone,
      totalContractValue: Number((lead.estimatedBudget * 0.4).toFixed(1)),
      paidToDate: 0,
      pendingApprovalAmount: Number((lead.estimatedBudget * 0.15).toFixed(1)),
      status: 'Payment Pending PM',
      milestones: [
        {
          id: `m-conv-1`,
          title: '3D CAD & Factory Release Advance',
          amount: Number((lead.estimatedBudget * 0.15).toFixed(1)),
          percentage: 35,
          status: 'PM Approved',
          dueDate: 'Immediate'
        }
      ]
    };

    setVendors([newVendor, ...vendors]);

    addToast(
      'success',
      'Converted Lead to Project Site!',
      `Created active project for ${lead.clientName} (PID #${lead.pid}). Synced to 31 Stages, BOQ & Procurement.`
    );
  };

  const handleAssignVendor = (vendorData: Omit<VendorAssignment, 'id'>) => {
    const newVendor: VendorAssignment = {
      ...vendorData,
      id: `ven-${Date.now()}`
    };
    setVendors([newVendor, ...vendors]);
    addToast('success', 'Vendor Assigned to BOQ', `Assigned ${vendorData.vendorName} to ${vendorData.projectName}`);
  };

  const handleApproveVendorPayment = (vendorId: string, milestoneId: string) => {
    // 1. Update PM vendor milestone status
    let approvedAmount = 0;
    let projName = '';
    let vendName = '';

    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          projName = v.projectName;
          vendName = v.vendorName;
          const updatedMilestones = v.milestones.map((m) => {
            if (m.id === milestoneId) {
              approvedAmount = m.amount;
              return { ...m, status: 'PM Approved' as const };
            }
            return m;
          });
          return {
            ...v,
            status: 'Approved by PM' as const,
            milestones: updatedMilestones
          };
        }
        return v;
      })
    );

    // 2. Automatically push approved payment to Finance Queue
    const newTx: FinanceTransaction = {
      id: `fin-${Date.now()}`,
      projectId: `p-app-${Date.now()}`,
      projectName: projName || 'Villa Site',
      type: 'Vendor Payout',
      partyName: vendName || 'Vendor Agency',
      category: 'Milestone Progress Payout',
      amount: Math.round((approvedAmount || 2.5) * 100000),
      gstAmount: Math.round((approvedAmount || 2.5) * 100000 * 0.18),
      netAmount: Math.round((approvedAmount || 2.5) * 100000 * 1.18),
      status: 'Ready for Release',
      date: 'Today',
      approvedByPM: true
    };

    setTransactions([newTx, ...transactions]);

    // Send transactional email notification to vendor
    sendTransactionalEmail({
      recipientEmail: 'vendor.finance@foryn-suppliers.in',
      recipientName: vendName || 'Vendor Agency',
      subject: `✅ Vendor Payment Approved by PM - ${projName}`,
      templateType: 'vendor_payment_approval',
      data: {
        projectName: projName,
        amount: Math.round((approvedAmount || 2.5) * 100000)
      }
    });

    addToast(
      'success',
      'PM Payment Approved & Email Sent!',
      `Pushed ₹${(newTx.netAmount / 100000).toFixed(2)} Lakhs payout request directly to Finance Team queue.`
    );
  };

  const handleReleasePayout = (transactionId: string) => {
    const refNum = `HDFC-RTGS-${Math.floor(10000000 + Math.random() * 90000000)}`;

    let txObj: FinanceTransaction | undefined;
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          txObj = { ...t, status: 'Completed & Paid' as const, paymentRefNumber: refNum };
          return txObj;
        }
        return t;
      })
    );

    // Send RTGS Disbursed transactional email
    if (txObj) {
      sendTransactionalEmail({
        recipientEmail: 'vendor.disbursement@foryn-suppliers.in',
        recipientName: txObj.partyName,
        subject: `🏦 RTGS Disbursed: ₹${(txObj.netAmount).toLocaleString('en-IN')} - ${txObj.projectName}`,
        templateType: 'payout_disbursed',
        data: {
          projectName: txObj.projectName,
          amount: txObj.netAmount,
          paymentRef: refNum
        }
      });
    }

    // Also update vendor paid amount in PM state
    setVendors((prev) =>
      prev.map((v) => ({
        ...v,
        paidToDate: Number((v.paidToDate + 2.5).toFixed(1)),
        pendingApprovalAmount: 0,
        status: 'Cleared by Finance' as const,
        milestones: v.milestones.map((m) => ({ ...m, status: 'Released by Finance' as const }))
      }))
    );

    addToast(
      'success',
      'RTGS Payout Disbursed & Email Sent!',
      `Bank Reference: ${refNum}. Transactional receipt emailed.`
    );
  };

  const handleOpenNewItemModal = (type: 'lead' | 'boq' | 'vendor' | 'project') => {
    if (type === 'lead') {
      setActiveEnterpriseView('crm');
      setAutoOpenLeadModal(true);
      setTimeout(() => setAutoOpenLeadModal(false), 500);
    } else if (type === 'boq') {
      setActiveEnterpriseView('boq');
      setAutoOpenBoqModal(true);
      setTimeout(() => setAutoOpenBoqModal(false), 500);
    } else if (type === 'vendor') {
      setActiveEnterpriseView('vendors');
      setAutoOpenVendorModal(true);
      setTimeout(() => setAutoOpenVendorModal(false), 500);
    } else if (type === 'project') {
      setIsScaffoldProjectModalOpen(true);
    }
  };

  const handleScaffoldProject = (projectTitle: string, clientName: string, budgetLakhs: number) => {
    const assignedPid = `PID ${1001 + availableProjects.length}`;
    const fullTitle = `${projectTitle} (${assignedPid})`;

    setAvailableProjects((prev) => [fullTitle, ...prev]);
    setActiveProjectName(fullTitle);
    setActiveEnterpriseView('projects');
    setIsScaffoldProjectModalOpen(false);

    addToast(
      'success',
      'Scaffolded New Site Project',
      `Initialized ${fullTitle} for ${clientName} (₹${budgetLakhs}L). 31-stage engine ready.`
    );
  };

  // Aggregates for Badges and KPI Counters
  const pendingPmCount = vendors.filter((v) => v.status === 'Payment Pending PM').length;
  const pendingFinanceCount = transactions.filter((t) => t.status === 'Ready for Release').length;
  const totalContractValSum = vendors.reduce((sum, v) => sum + v.totalContractValue, 0);
  const pendingPMApprovalsVal = vendors.reduce((sum, v) => sum + v.pendingApprovalAmount, 0);
  const totalGSTLiability = transactions.reduce((sum, t) => sum + t.gstAmount, 0);

  // -------------------------------------------------------------
  // VIEW RENDERER: Full Enterprise Workstation Shell
  // -------------------------------------------------------------
  if (isLoggedIn) {
    // If Studio is active, render the dedicated CAD workstation
    if (activeEnterpriseView === 'studio') {
      return (
        <div className="h-screen w-screen flex flex-col bg-slate-950 text-white overflow-hidden select-none">
          {/* Top Return to Office Bar */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-semibold z-40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Current Project:</span>
              <span className="font-bold text-[var(--foryn-accent)]">{activeProjectName}</span>
            </div>
            <button
              onClick={() => setActiveEnterpriseView('executive')}
              className="px-3 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Return to Command Center</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <StudioDashboard
              user={user}
              onLogout={() => setActiveEnterpriseView('executive')}
            />
          </div>

          <Toast toasts={toasts} onDismiss={handleDismissToast} />
        </div>
      );
    }

    return (
      <div className="h-screen w-screen bg-[#F8F9FC] dark:bg-[#0F1428] text-[#0F1428] dark:text-[#FDFDFD] flex flex-col font-sans select-none overflow-hidden">
        {/* Universal MNC Enterprise Top Bar */}
        <EnterpriseTopBar
          user={user}
          activeProjectName={activeProjectName}
          onSelectProjectName={(name) => {
            setActiveProjectName(name);
            addToast('info', 'Active Site Switched', `Now managing ${name}`);
          }}
          availableProjects={availableProjects}
          onOpenEmailConsole={() => setIsEmailConsoleOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewItemModal={handleOpenNewItemModal}
          onLogout={handleLogout}
          onClearAllData={handleClearAllData}
          onRestoreDemoData={handleRestoreDemoData}
          onTriggerSplash={() => setIsAppBooting(true)}
        />

        {/* Enterprise Workspace Layout: Sidebar + Active Workstation View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible 7-Discipline Navigation Sidebar */}
          <EnterpriseSidebar
            activeView={activeEnterpriseView}
            onSelectView={(view) => setActiveEnterpriseView(view)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            leadCount={leads.length}
            pendingPmCount={pendingPmCount}
            pendingFinanceCount={pendingFinanceCount}
            onOpenQuickTips={() => setIsQuickTipsOpen(true)}
          />

          {/* Main Workstation View Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto w-full">
              <ErrorBoundary fallbackTitle="Enterprise Workstation Exception Captured">
                {/* 1. Executive Command Center */}
                {activeEnterpriseView === 'executive' && (
                <ExecutiveOverview
                  onNavigate={(view) => setActiveEnterpriseView(view)}
                  onSelectProject={(proj) => {
                    setActiveProjectName(proj);
                    addToast('info', 'Selected Project', `Active site set to ${proj}`);
                  }}
                  activeProjectName={activeProjectName}
                  totalLeadsCount={leads.length}
                  activeSitesCount={availableProjects.length}
                  totalContractValueSum={totalContractValSum}
                  pendingPmApprovals={pendingPMApprovalsVal}
                  totalGSTLiability={totalGSTLiability}
                />
              )}

              {/* 2. Master BOQ & Costing Studio */}
              {activeEnterpriseView === 'boq' && (
                <MasterBoqStudio
                  activeProjectName={activeProjectName}
                  onSendToast={(type, title, desc) => addToast(type, title, desc)}
                  autoOpenBoqModal={autoOpenBoqModal}
                />
              )}

              {/* 3. Pre-Sales Pipeline & Lead CRM */}
              {activeEnterpriseView === 'crm' && (
                <LeadCapturingDashboard
                  user={user}
                  leads={leads}
                  onAddLead={handleAddLead}
                  onUpdateLeadStatus={handleUpdateLeadStatus}
                  onConvertLeadToProject={handleConvertLeadToProject}
                  onUpdateLead={(updatedLead) =>
                    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)))
                  }
                  autoOpenLeadModal={autoOpenLeadModal}
                />
              )}

              {/* 4. Projects & 31 Stages Lifecycle Engine */}
              {activeEnterpriseView === 'projects' && (
                <ProjectExecutionTracker
                  activeProjectName={activeProjectName}
                  onSendToast={(type, title, desc) => addToast(type, title, desc)}
                />
              )}

              {/* 5. Procurement & Vendor Work Orders */}
              {activeEnterpriseView === 'vendors' && (
                <ProjectManagementDashboard
                  user={user}
                  vendors={vendors}
                  onAssignVendor={handleAssignVendor}
                  onApproveVendorPayment={handleApproveVendorPayment}
                  autoOpenVendorModal={autoOpenVendorModal}
                />
              )}

              {/* 6. Finance & 18% GST Ledger */}
              {activeEnterpriseView === 'finance' && (
                <FinanceDashboard
                  user={user}
                  transactions={transactions}
                  onReleasePayout={handleReleasePayout}
                />
              )}

              {/* 7. CAD Workspace (In Development) */}
              {activeEnterpriseView === 'studio' && (
                <StudioDashboard user={user} onLogout={() => setActiveEnterpriseView('executive')} />
              )}
              </ErrorBoundary>
            </div>
          </main>
        </div>

        {/* Global Spotlight Command Palette (Ctrl+K) */}
        <GlobalCommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectView={(view) => setActiveEnterpriseView(view)}
          onSelectProject={(name) => {
            setActiveProjectName(name);
            addToast('info', 'Active Site Switched', `Managing ${name}`);
          }}
          projects={availableProjects}
          onOpenNewItemModal={handleOpenNewItemModal}
        />

        {/* Global Toast Notifications */}
        <Toast toasts={toasts} onDismiss={handleDismissToast} />

        {/* Transactional Email Service Console Modal */}
        <TransactionalEmailConsoleModal
          isOpen={isEmailConsoleOpen}
          onClose={() => setIsEmailConsoleOpen(false)}
          onSendToast={(title, desc) => addToast('info', title, desc)}
        />

        {/* Quick Tips Guided Overlay Modal */}
        <QuickTipsOverlay
          role={user.role}
          isOpen={isQuickTipsOpen}
          onClose={() => setIsQuickTipsOpen(false)}
        />

        {/* Scaffold New Site Project Modal */}
        <NewSiteProjectModal
          isOpen={isScaffoldProjectModalOpen}
          onClose={() => setIsScaffoldProjectModalOpen(false)}
          onScaffoldProject={handleScaffoldProject}
        />

        {/* Global Architectural Loading & Splash Morph Experience */}
        <AnimatePresence>
          {isAppBooting && (
            <ForynLoadingExperience
              onComplete={() => setIsAppBooting(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Default Login / Showcase Gateway (when logged out)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] text-[#0F1428] flex flex-col justify-between font-sans selection:bg-[#D64062] selection:text-white relative overflow-hidden">
      {/* Background Soft Mesh Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#D64062]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#0F1428]/5 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-[#D64062]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Light Portal Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#D64062] bg-[#D64062]/10 border border-[#D64062]/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D64062] animate-pulse" />
            Pentagram OS • Enterprise Platform
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="hidden md:inline">24/7 Enterprise Support</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#0F1428] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D64062] animate-pulse" />
            Cloud Auth Active
          </span>
        </div>
      </header>

      {/* Center Grid: Left Interactive Showcase Card + Right Login Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Column: Interactive 3D Showcase in a Framed Warm Glass Container */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D64062]/10 border border-[#D64062]/20 text-[#D64062] text-xs font-extrabold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" /> Pentagram Studio & CAD
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#0F1428] tracking-tight leading-tight">
              Design, Cost & Build <br className="hidden sm:inline" />
              <span className="text-[#D64062]">Luxury Spaces</span> Effortlessly.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
              Unified workstation platform integrating real-time 3D CAD visualization, automated BOQ calculations, and end-to-end site project management.
            </p>
          </div>

          {/* Styled Showcase Container Card */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-[#0F1428] shadow-2xl shadow-[#0F1428]/10 backdrop-blur-xl overflow-hidden h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] xl:h-[520px] flex flex-col transition-all group">
            <ShowcaseCanvas
              scenes={ROOM_SCENES}
              currentScene={currentScene}
              onSelectScene={(scene) => setCurrentScene(scene)}
              onSelectHotspotInStudio={handleSelectHotspotInStudio}
              hideBottomToolbar={true}
            />
          </div>

          {/* Trust Highlights Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D64062] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0F1428]">256-Bit Encrypted</div>
                <div className="text-[10px] text-slate-500 font-medium">Enterprise Security</div>
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <Building className="w-4 h-4 text-[#D64062] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0F1428]">31-Stage Engine</div>
                <div className="text-[10px] text-slate-500 font-medium">Full Site Tracking</div>
              </div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D64062] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0F1428]">BOQ Automation</div>
                <div className="text-[10px] text-slate-500 font-medium">Real-Time Costing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card Portal */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <AuthCard
            onLoginSuccess={handleLoginSuccess}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            onLaunchGuestDemo={handleLaunchGuestDemo}
          />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium z-10 border-t border-slate-200/60 pb-16 md:pb-4">
        <div>© 2026 Pentagram Living Pvt. Ltd. All rights reserved. • DLF Cyber City, Gurugram</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono text-[11px]">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="hover:text-[#D64062] hover:underline transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="hover:text-[#D64062] hover:underline transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <span>•</span>
          <span>ISO 27001 Certified</span>
        </div>
      </footer>

      {/* Forgot Password Dialog Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      {/* Production Compliance Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsConditionsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <ThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Mobile Sticky CTA Bar */}
      <StickyMobileCTA
        onAction={() => {
          const authElement = document.querySelector('form');
          if (authElement) {
            authElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        buttonText="Sign In / Register"
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Architectural Loading & Splash Morph Experience */}
      <AnimatePresence>
        {isAppBooting && (
          <ForynLoadingExperience
            onComplete={() => setIsAppBooting(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
