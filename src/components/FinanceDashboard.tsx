import React, { useState } from 'react';
import { UserProfile, FinanceTransaction } from '../types';
import { IndianRupee, ArrowUpRight, CheckCircle, ShieldCheck, Download, Search, FileText } from 'lucide-react';

interface FinanceDashboardProps {
  user: UserProfile;
  transactions: FinanceTransaction[];
  onReleasePayout: (transactionId: string) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  user,
  transactions,
  onReleasePayout
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTxs = transactions.filter(
    (t) =>
      t.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDisbursed = transactions
    .filter((t) => t.status === 'Completed & Paid')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const pendingDisbursed = transactions
    .filter((t) => t.status === 'Ready for Release')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalGST = transactions.reduce((sum, t) => sum + t.gstAmount, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total RTGS Disbursed</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{(totalDisbursed / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Bank RTGS Verified
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Release Queue</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹{(pendingDisbursed / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {transactions.filter((t) => t.status === 'Ready for Release').length} Payouts Awaiting Action
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">18% GST Compliance Liability</div>
          <div className="text-2xl font-black text-[#F62440] mt-1">
            ₹{(totalGST / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Auto Input Tax Credit Reconciled
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Finance & 18% GST Ledger</h3>
            <p className="text-xs text-slate-500">Vendor milestone payouts & bank disbursements</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor or site..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-[#F62440]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Site Project</th>
                <th className="p-3.5">Party / Vendor</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Net Payout</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{t.id}</td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{t.projectName}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{t.partyName}</td>
                    <td className="p-3.5 text-slate-500">{t.category}</td>
                    <td className="p-3.5 text-right font-black text-slate-900 dark:text-white">
                      ₹{t.netAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          t.status === 'Completed & Paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {t.status === 'Ready for Release' ? (
                        <button
                          onClick={() => onReleasePayout(t.id)}
                          className="px-3 py-1 rounded-lg bg-[#F62440] hover:bg-rose-600 text-white font-bold text-[11px] shadow-xs transition-all"
                        >
                          Disburse RTGS
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Ref: {t.paymentRefNumber || 'Done'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
