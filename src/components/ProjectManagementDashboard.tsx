import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VendorAssignment, UserProfile, MilestonePayment } from '../types';
import {
  HardHat,
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  UserCheck,
  Send,
  Plus,
  X,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Filter,
  CheckSquare
} from 'lucide-react';

interface ProjectManagementDashboardProps {
  user: UserProfile;
  vendors: VendorAssignment[];
  onAssignVendor: (vendor: Omit<VendorAssignment, 'id'>) => void;
  onApproveVendorPayment: (vendorId: string, milestoneId: string) => void;
  autoOpenVendorModal?: boolean;
}

export const ProjectManagementDashboard: React.FC<ProjectManagementDashboardProps> = ({
  user,
  vendors,
  onAssignVendor,
  onApproveVendorPayment,
  autoOpenVendorModal = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    if (autoOpenVendorModal) {
      setIsAssignModalOpen(true);
    }
  }, [autoOpenVendorModal]);
  const [activeVendorDetail, setActiveVendorDetail] = useState<VendorAssignment | null>(null);

  // New Vendor Form State
  const [projectName, setProjectName] = useState('Villa Penthouse 402');
  const [category, setCategory] = useState<VendorAssignment['category']>('Modular Cabinetry Factory');
  const [vendorName, setVendorName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [totalContractValue, setTotalContractValue] = useState<number>(8.5);

  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory === 'All') return true;
    return v.category === selectedCategory;
  });

  // Calculate PM Aggregates
  const totalContractValSum = vendors.reduce((sum, v) => sum + v.totalContractValue, 0);
  const pendingPMApprovals = vendors.reduce((sum, v) => sum + v.pendingApprovalAmount, 0);
  const totalPaidToVendors = vendors.reduce((sum, v) => sum + v.paidToDate, 0);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !contactPhone) return;

    onAssignVendor({
      projectId: `p-${Date.now()}`,
      projectName,
      category,
      vendorName,
      contactPhone,
      totalContractValue: Number(totalContractValue),
      paidToDate: 0,
      pendingApprovalAmount: Number((totalContractValue * 0.3).toFixed(2)), // 30% mobilization advance
      status: 'Payment Pending PM',
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: 'Mobilization & Raw Material Procurement (30%)',
          amount: Number((totalContractValue * 0.3).toFixed(2)),
          percentage: 30,
          status: 'PM Approved',
          dueDate: 'Immediate'
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Factory Fabrication / On-Site Work 50%',
          amount: Number((totalContractValue * 0.4).toFixed(2)),
          percentage: 40,
          status: 'Pending',
          dueDate: '20 Days'
        },
        {
          id: `m-${Date.now()}-3`,
          title: 'Final Handover & Snagging Clearance (30%)',
          amount: Number((totalContractValue * 0.3).toFixed(2)),
          percentage: 30,
          status: 'Pending',
          dueDate: '35 Days'
        }
      ]
    });

    setIsAssignModalOpen(false);
    setVendorName('');
    setContactPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <HardHat className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Project Management & Vendor Hub
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            BOQ Control & Vendor Payment Approvals
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Review site progress, assign specialized contractors (Modular Factory, Civil, Automation), and approve milestone payment releases before sending to the Finance Team.
          </p>
        </div>

        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 ring-2 ring-amber-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Vendor</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Contracted BOQ
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              ₹{totalContractValSum.toFixed(1)} Lakhs
            </span>
            <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
              {vendors.length} Contracted Vendors
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Awaiting PM Approval
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              ₹{pendingPMApprovals.toFixed(1)} Lakhs
            </span>
            <span className="text-[10px] font-semibold text-amber-600 mt-1 block">
              Requires site milestone audit
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Finance Released Payouts
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              ₹{totalPaidToVendors.toFixed(1)} Lakhs
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 mt-1 block">
              Disbursed via RTGS/NEFT
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Active Execution Sites KPI */}
        {(() => {
          const activeSitesCount = Array.from(new Set(vendors.map((v) => v.projectName))).filter(Boolean).length;
          return (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Execution Sites
                </span>
                <span className="text-2xl font-black text-blue-600 mt-1 block">
                  {activeSitesCount} {activeSitesCount === 1 ? 'Active Site' : 'Active Sites'}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                  {activeSitesCount > 0 ? 'Live Site Registry' : 'No active site records'}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <span className="text-xs text-slate-500 font-bold">Trade Filter:</span>
          {[
            'All',
            'Modular Cabinetry Factory',
            'Civil & Tiling',
            'Electrical & Lighting',
            'Decor & Soft Furnishing'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {vendor.category}
                </span>
                <span className="text-xs font-bold text-slate-500">Project: {vendor.projectName}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    vendor.status === 'Approved by PM'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {vendor.status}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{vendor.vendorName}</h3>
                <p className="text-xs text-slate-500 font-mono">Contact Phone: {vendor.contactPhone}</p>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  BOQ Milestones & Approvals:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {vendor.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block">{m.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ₹{m.amount} Lakhs ({m.percentage}%)
                        </span>
                      </div>

                      {m.status === 'Released by Finance' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Paid</span>
                        </span>
                      ) : m.status === 'PM Approved' ? (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold flex items-center gap-1">
                          <Send className="w-3 h-3 text-blue-600" />
                          <span>Sent to Finance</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onApproveVendorPayment(vendor.id, m.id)}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Approve Payment</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contract Financials Column */}
            <div className="w-full md:w-64 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Contract:</span>
                <span className="font-black text-amber-400 text-sm">₹{vendor.totalContractValue} Lakhs</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Paid to Date:</span>
                <span className="font-bold text-emerald-400">₹{vendor.paidToDate} Lakhs</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Pending PM Action:</span>
                <span className="font-extrabold text-amber-300">₹{vendor.pendingApprovalAmount} Lakhs</span>
              </div>

              <div className="pt-2">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${Math.round((vendor.paidToDate / (vendor.totalContractValue || 1)) * 100)}%`
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono text-center block mt-1">
                  {Math.round((vendor.paidToDate / (vendor.totalContractValue || 1)) * 100)}% Disbursed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Vendor Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base font-extrabold text-slate-900">Assign Vendor to Project BOQ</h2>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Project Site</label>
                  <select
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="Villa Penthouse 402">Villa Penthouse 402</option>
                    <option value="Modern Duplex Kitchen">Modern Duplex Kitchen</option>
                    <option value="Gaur City Wardrobes">Gaur City Wardrobes</option>
                    <option value="DLF Cyber Park Office Suite">DLF Cyber Park Office Suite</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Trade Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="Modular Cabinetry Factory">Modular Cabinetry Factory</option>
                      <option value="Civil & Tiling">Civil & Tiling</option>
                      <option value="Electrical & Lighting">Electrical & Lighting</option>
                      <option value="False Ceiling & Paint">False Ceiling & Paint</option>
                      <option value="Decor & Soft Furnishing">Decor & Soft Furnishing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Contract (₹ Lakhs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={totalContractValue}
                      onChange={(e) => setTotalContractValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. CenturyPly Modular Works Pvt Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Phone *</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98100 22334"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                  >
                    Assign Vendor & Generate Milestones
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
