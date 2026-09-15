import React, { useState } from "react";
import {
  SentEmail,
  getSentEmailLogs,
  sendTransactionalEmail,
  EmailTemplateType
} from "../utils/emailNotificationService";
import {
  Mail,
  X,
  CheckCircle2,
  Send,
  Search,
  RefreshCw,
  ChevronRight,
  Inbox,
  Zap,
  IndianRupee,
  UserPlus,
  FolderSync,
  Clock
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSendToast?: (title: string, desc: string) => void;
}

const TEMPLATE_META = {
  welcome: {
    label: "Welcome",
    textColor: "text-[#0F1428] dark:text-slate-400",
    bg: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-200",
    icon: <Mail className="w-3.5 h-3.5" />
  },
  project_status_update: {
    label: "Status Update",
    textColor: "text-[#0F1428] dark:text-slate-400",
    bg: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-200",
    icon: <FolderSync className="w-3.5 h-3.5" />
  },
  vendor_payment_approval: {
    label: "Payment Approval",
    textColor: "text-[#0F1428] dark:text-[#D64062]",
    bg: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-200",
    icon: <IndianRupee className="w-3.5 h-3.5" />
  },
  payout_disbursed: {
    label: "RTGS Disbursed",
    textColor: "text-[#0F1428] dark:text-[#D64062]",
    bg: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-200",
    icon: <Zap className="w-3.5 h-3.5" />
  },
  lead_assigned: {
    label: "Lead Assigned",
    textColor: "text-[#0F1428] dark:text-slate-400",
    bg: "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-200",
    icon: <UserPlus className="w-3.5 h-3.5" />
  }
} as const;

export const TransactionalEmailConsoleModal: React.FC<Props> = ({ isOpen, onClose, onSendToast }) => {
  const [emails, setEmails] = useState<SentEmail[]>(getSentEmailLogs());
  const [selected, setSelected] = useState<SentEmail | null>(emails[0] || null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    recipientName: "Mr. Anuj Malhotra",
    recipientEmail: "client@foryn.io",
    subject: "Status Update: DLF Camellias Design Approval",
    template: "project_status_update" as EmailTemplateType,
    projectName: "DLF Camellias Penthouse",
    statusNote: "Design Milestone Approved"
  });

  const refresh = () => setEmails([...getSentEmailLogs()]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const sent = sendTransactionalEmail({
      recipientEmail: form.recipientEmail,
      recipientName: form.recipientName,
      subject: form.subject,
      templateType: form.template,
      data: { projectName: form.projectName, newStatus: form.statusNote, leadPid: "1004", amount: 350000 }
    });
    refresh();
    setSelected(sent);
    setDrawerOpen(false);
    onSendToast?.("Email Dispatched", `Delivered to ${form.recipientName}`);
  };

  const filtered = emails.filter(em => {
    const q = search.toLowerCase();
    const ms = !q || em.recipientName.toLowerCase().includes(q) || em.subject.toLowerCase().includes(q) || em.recipientEmail.toLowerCase().includes(q);
    const mt = typeFilter === "All" || em.templateType === typeFilter;
    return ms && mt;
  });

  if (!isOpen) return null;

  const delivered = emails.filter(e => e.status === "Delivered").length;
  const financeEmails = emails.filter(e => e.templateType === "vendor_payment_approval" || e.templateType === "payout_disbursed").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Mail className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-none">Email Console</h2>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[#0F1428] dark:text-[#D64062] border border-slate-200 dark:border-slate-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D64062] animate-pulse inline-block" />
                  Live Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Simulated SMTP relay for vendor, finance and client notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Send Test
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 overflow-x-auto">
          {[
            { label: "Total Sent", value: emails.length, cls: "text-slate-800 dark:text-slate-100" },
            { label: "Delivered", value: delivered, cls: "text-[#0F1428] dark:text-[#D64062]" },
            { label: "Finance Emails", value: financeEmails, cls: "text-[#0F1428] dark:text-[#D64062]" },
            { label: "Filtered", value: filtered.length, cls: "text-[#0F1428] dark:text-slate-400" }
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 shrink-0 py-1">
              <span className={`text-lg font-black leading-none ${s.cls}`}>{s.value}</span>
              <span className="text-[11px] text-slate-400 font-mono">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden min-h-0">

          {/* Left: List */}
          <div className="col-span-12 md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-950/40 min-h-0">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search recipient, subject..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {(["All", "project_status_update", "vendor_payment_approval", "payout_disbursed", "lead_assigned"] as const).map(t => {
                  const isA = typeFilter === t;
                  const label = t === "All" ? "All" : TEMPLATE_META[t].label;
                  return (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-colors ${isA ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent" : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Inbox className="w-8 h-8 opacity-30" />
                  <span className="text-xs">No emails match your filter</span>
                </div>
              ) : filtered.map(em => {
                const meta = TEMPLATE_META[em.templateType] ?? TEMPLATE_META.project_status_update;
                const isA = selected?.id === em.id;
                return (
                  <button
                    key={em.id}
                    onClick={() => setSelected(em)}
                    className={`w-full text-left p-3.5 transition-all flex gap-3 items-start ${isA ? "bg-slate-900 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
                  >
                    <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${meta.bg} ${meta.textColor}`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-xs font-bold truncate ${isA ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>{em.recipientName}</span>
                        <span className={`text-[10px] font-mono shrink-0 ${isA ? "text-slate-300" : "text-slate-400"}`}>{em.sentAt.split(" ")[1]} {em.sentAt.split(" ")[2]}</span>
                      </div>
                      <p className={`text-[11px] truncate mb-1 ${isA ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>{em.subject}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold ${isA ? "text-slate-300" : meta.textColor}`}>{meta.label}</span>
                        <span className={`text-[10px] flex items-center gap-0.5 ${isA ? "text-slate-300" : "text-[#0F1428] dark:text-[#D64062]"}`}>
                          <CheckCircle2 className="w-3 h-3" /> Delivered
                        </span>
                      </div>
                    </div>
                    {isA && <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3.5 py-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <p className="text-[10px] text-slate-400 font-mono">{filtered.length} of {emails.length} emails shown</p>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="col-span-12 md:col-span-8 flex flex-col bg-slate-100 dark:bg-slate-950 overflow-y-auto min-h-0">
            {selected ? (
              <>
                {/* Email Meta */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${TEMPLATE_META[selected.templateType]?.bg} ${TEMPLATE_META[selected.templateType]?.textColor}`}>
                      {TEMPLATE_META[selected.templateType]?.icon}
                      {TEMPLATE_META[selected.templateType]?.label}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 text-[#0F1428] dark:text-[#D64062] border border-slate-200 dark:border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SMTP Delivered
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                    {[
                      { label: "To", value: `${selected.recipientName} <${selected.recipientEmail}>` },
                      { label: "Sent At", value: selected.sentAt },
                      { label: "Subject", value: selected.subject },
                      { label: "Email ID", value: selected.id }
                    ].map(f => (
                      <div key={f.label} className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[10px] font-mono uppercase text-slate-400">{f.label}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fake browser toolbar */}
                <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 flex items-center justify-between shrink-0 border-b border-slate-300 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#D64062]" />
                    <span className="w-3 h-3 rounded-full bg-[#D64062]" />
                    <span className="w-3 h-3 rounded-full bg-[#D64062]" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">HTML Email Preview · Responsive Template</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400">{selected.sentAt}</span>
                  </div>
                </div>

                {/* HTML render */}
                <div className="flex-1 p-5 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-xl mx-auto">
                    <div dangerouslySetInnerHTML={{ __html: selected.htmlContent }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Mail className="w-10 h-10 opacity-20" />
                <p className="text-xs">Select an email to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Test Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end p-4 bg-slate-950/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Send Test Email</h3>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSend} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Template Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(TEMPLATE_META) as [EmailTemplateType, typeof TEMPLATE_META[EmailTemplateType]][]).map(([key, meta]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, template: key }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${form.template === key ? `${meta.bg} ${meta.textColor}` : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400"}`}
                    >
                      {meta.icon} {meta.label}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { k: "recipientName", l: "Recipient Name", t: "text", p: "Mr. Anuj Malhotra" },
                { k: "recipientEmail", l: "Recipient Email", t: "email", p: "client@foryn.io" },
                { k: "subject", l: "Email Subject", t: "text", p: "Project status update..." },
                { k: "projectName", l: "Project Name", t: "text", p: "DLF Camellias Penthouse" },
                { k: "statusNote", l: "Status / Milestone", t: "text", p: "Design Milestone Approved" }
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">{f.l}</label>
                  <input
                    type={f.t}
                    required={f.k !== "statusNote"}
                    placeholder={f.p}
                    value={(form as Record<string, string>)[f.k]}
                    onChange={e => setForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch Email
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
