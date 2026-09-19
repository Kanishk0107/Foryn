import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import { EnterpriseMobileDock } from './components/enterprise/EnterpriseMobileDock';
import { ExecutiveOverview } from './components/enterprise/ExecutiveOverview';
import { MasterBoqStudio } from './components/enterprise/MasterBoqStudio';
import { ProjectExecutionTracker } from './components/enterprise/ProjectExecutionTracker';
import { GlobalCommandPalette } from './components/enterprise/GlobalCommandPalette';
import { NewSiteProjectModal } from './components/enterprise/NewSiteProjectModal';
import { CreateUserAccountModal } from './components/enterprise/CreateUserAccountModal';

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
  Calculator,
  ArrowRight,
  ShieldCheck,
  Building,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentScene, setCurrentScene] = useState<RoomScene>(ROOM_SCENES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Authenticated session required for workspace
  const [activeEnterpriseView, setActiveEnterpriseView] = useState<EnterpriseView>('executive');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Background Architectural Slideshow & Video Tour State
  const [activeBgIndex, setActiveBgIndex] = useState<number>(0);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(true);

  // Auto-rotate background scenes smoothly like a cinematic tour every 6.5s
  useEffect(() => {
    if (isLoggedIn || !isPlayingTour) return;
    const interval = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % ROOM_SCENES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isLoggedIn, isPlayingTour]);

  // Application Boot & Morph Splash Experience State (only triggered on login transition)
  const [isAppBooting, setIsAppBooting] = useState<boolean>(false);

  // Available Projects in Office Registry
  const [availableProjects, setAvailableProjects] = useState<string[]>([
    'B3/21 DLF Alameda Villa (PID 1005)',
    'Villa Penthouse 402 (PID 1001)'
  ]);
  const [activeProjectName, setActiveProjectName] = useState<string>('B3/21 DLF Alameda Villa (PID 1005)');

  const [user, setUser] = useState<UserProfile>({
    name: 'Rishabh Bhardwaj',
    email: 'rishabh@verdiore.in',
    role: 'Sales Lead',
    company: 'Verdiore Interiors and Furnishing Pvt. Ltd.'
  });

  // Modal Overlay States
  const [isEmailConsoleOpen, setIsEmailConsoleOpen] = useState<boolean>(false);
  const [isQuickTipsOpen, setIsQuickTipsOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [isScaffoldProjectModalOpen, setIsScaffoldProjectModalOpen] = useState<boolean>(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);
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

  // Live Notification State for TopBar Bell
  const [liveNotifications, setLiveNotifications] = useState<{ id: string; title: string; desc: string; time: string; type: 'warn' | 'success' | 'info' }[]>([]);

  // Supabase Realtime Notifications Listener
  useEffect(() => {
    fetchNotificationsFromSupabase().then((items) => {
      setLiveNotifications(items.map(n => ({
        id: n.id,
        title: n.title,
        desc: n.message,
        time: typeof n.createdAt === 'string' ? n.createdAt : new Date(n.createdAt).toLocaleTimeString(),
        type: (n.type === 'pm_approval' ? 'success' : n.type === 'lead_assigned' ? 'info' : 'info') as 'warn' | 'success' | 'info'
      })));
    });

    const unsubscribe = subscribeToRealtimeNotifications((notif) => {
      addToast('info', notif.title, notif.message);
      setLiveNotifications(prev => [{
        id: notif.id,
        title: notif.title,
        desc: notif.message,
        time: 'Just now',
        type: 'info' as const
      }, ...prev]);
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

  const triggerSplashIfFirstLogin = () => {
    const hasSeenSplash = sessionStorage.getItem('foryn_splash_shown');
    if (!hasSeenSplash) {
      sessionStorage.setItem('foryn_splash_shown', 'true');
      setIsAppBooting(true);
    }
  };

  const handleLoginSuccess = (userEmail: string, role?: string) => {
    setUser({
      name: userEmail.split('@')[0],
      email: userEmail,
      role: (role as UserRole) || 'Sales Lead'
    });
    setIsLoggedIn(true);
    triggerSplashIfFirstLogin();
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
      email: 'admin@verdiore.in',
      role: 'Admin',
      company: 'Verdiore Interiors and Furnishing Pvt. Ltd.'
    });
    setIsLoggedIn(true);
    triggerSplashIfFirstLogin();
    setActiveEnterpriseView('executive');
    addToast(
      'success',
      'Verdiore Enterprise Workstation Active',
      'Logged in with Master Admin access. All workstations & User Provisioning unlocked.'
    );
  };

  const handleLogout = async () => {
    setIsAppBooting(false);
    sessionStorage.removeItem('foryn_splash_shown');
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

  const handleOpenNewItemModal = (type: 'lead' | 'boq' | 'vendor' | 'project' | 'user') => {
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
    } else if (type === 'user') {
      setIsCreateUserModalOpen(true);
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
          notifications={liveNotifications}
        />

        {/* Enterprise Workspace Layout: Sidebar + Active Workstation View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible 7-Discipline Navigation Sidebar (Desktop) */}
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

          {/* Ergonomic Glass Bottom Navigation Dock (Mobile < 768px) */}
          <EnterpriseMobileDock
            activeView={activeEnterpriseView}
            onSelectView={(view) => setActiveEnterpriseView(view)}
            leadCount={leads.length}
            pendingPmCount={pendingPmCount}
            pendingFinanceCount={pendingFinanceCount}
          />

          {/* Main Workstation View Area — padded for all views except studio */}
          {activeEnterpriseView === 'studio' ? (
            <div className="flex-1 overflow-hidden pb-12 md:pb-0">
              <StudioDashboard
                user={user}
                onLogout={() => setActiveEnterpriseView('executive')}
                onNavigate={(view) => setActiveEnterpriseView(view as any)}
                onSendToast={(type, title, desc) => addToast(type, title, desc)}
              />
            </div>
          ) : (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
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
              </ErrorBoundary>
            </div>
          </main>
          )}
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

        {/* Provision User Account Modal (Admin Only) */}
        <CreateUserAccountModal
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
          onUserCreated={(newUser) => {
            addToast(
              'success',
              'Sign-In Account Provisioned',
              `Created ${newUser.email} (${newUser.role}). Credentials ready to share.`
            );
          }}
        />

      </div>
    );
  }

  // -------------------------------------------------------------
  // Default Login / Showcase Gateway (when logged out)
  // -------------------------------------------------------------
  const activeScene = ROOM_SCENES[activeBgIndex] || ROOM_SCENES[0];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-black text-white flex flex-col justify-between font-sans selection:bg-[#D64062] selection:text-white relative overflow-hidden select-none">
      {/* Cinematic Full-Bleed Architectural Video / Movie Slideshow */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={activeScene.id}
            src={activeScene.image}
            alt={activeScene.name}
            initial={{ scale: 1.0, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.18 }}
            transition={{
              scale: { duration: 7.5, ease: 'easeOut' },
              opacity: { duration: 1.0, ease: 'easeInOut' }
            }}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />
        </AnimatePresence>

        {/* Cinematic Film Scrim - Light & Luminous so the renders are completely clear and visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Top Portal Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-4 pt-3 sm:pt-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Logo size="sm" inverted={true} />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-slate-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Verdiore Studio OS • v2.4</span>
            <span className="sm:hidden">Studio OS</span>
          </div>
        </div>
      </header>

      {/* Center Monolithic Smoked Glass Auth Portal - Compact & 100% In-View */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 sm:px-4 flex items-center justify-center z-10 my-auto py-1">
        <div className="w-full max-w-sm sm:max-w-md">
          <AuthCard
            onLoginSuccess={handleLoginSuccess}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            onLaunchGuestDemo={handleLaunchGuestDemo}
          />
        </div>
      </main>

      {/* Cinematic Video Tour HUD & Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between z-20 shrink-0 text-[10px] sm:text-xs text-slate-300 gap-2 border-t border-white/10 bg-black/50 backdrop-blur-md">
        {/* Left: Video Playback Controls, Progress Bars & Scene Title */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Movie Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveBgIndex((prev) => (prev - 1 + ROOM_SCENES.length) % ROOM_SCENES.length)}
              className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Previous Scene"
              aria-label="Previous Scene"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlayingTour(!isPlayingTour)}
              className="p-1 sm:p-1.5 rounded-lg bg-[#D64062] hover:bg-[#C03252] text-white transition-colors cursor-pointer"
              title={isPlayingTour ? 'Pause Tour' : 'Play Tour'}
              aria-label={isPlayingTour ? 'Pause Tour' : 'Play Tour'}
            >
              {isPlayingTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setActiveBgIndex((prev) => (prev + 1) % ROOM_SCENES.length)}
              className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Next Scene"
              aria-label="Next Scene"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Story Progress Indicators (like video clips) */}
          <div className="flex items-center gap-1.5 flex-1 sm:w-36">
            {ROOM_SCENES.map((scene, idx) => (
              <div
                key={scene.id}
                onClick={() => setActiveBgIndex(idx)}
                className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer relative"
                title={scene.name}
              >
                {idx < activeBgIndex ? (
                  <div className="h-full w-full bg-[#D64062]" />
                ) : idx === activeBgIndex ? (
                  <motion.div
                    key={`progress-${idx}-${isPlayingTour}`}
                    initial={{ width: '0%' }}
                    animate={{ width: isPlayingTour ? '100%' : '50%' }}
                    transition={{ duration: 6.5, ease: 'linear' }}
                    className="h-full bg-[#D64062]"
                  />
                ) : null}
              </div>
            ))}
          </div>

          {/* Scene Title */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-slate-200">
            <span className="text-[#D64062] font-bold">0{activeBgIndex + 1}/0{ROOM_SCENES.length}</span>
            <span className="text-white/30">•</span>
            <span className="truncate max-w-[130px] sm:max-w-xs font-sans font-medium">{activeScene.name}</span>
          </div>
        </div>

        {/* Right: Copyright and Legal */}
        <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-slate-400">
          <span className="hidden md:inline">© 2026 Verdiore Interiors</span>
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </button>
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
