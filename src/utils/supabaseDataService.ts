import { supabase, isSupabaseConfigured } from './supabaseClient';
import { LeadItem, VendorAssignment, FinanceTransaction, LeadStatus } from '../types';
import { BoqItem } from '../data/boqData';

// --- LEADS ---
export async function fetchLeadsFromSupabase(): Promise<LeadItem[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads from Supabase:', error);
    return null;
  }

  return data.map((d: any) => ({
    id: d.id,
    pid: d.pid,
    clientName: d.client_name,
    phone: d.phone,
    email: d.email,
    source: d.source,
    estimatedBudget: Number(d.estimated_budget),
    budgetLabel: d.budget_label,
    propertyType: d.property_type,
    location: d.location,
    status: d.status as LeadStatus,
    probability: d.probability,
    notes: d.notes,
    assignedSalesOwner: d.assigned_sales_owner,
    assignedDesignLead: d.assigned_design_lead,
    createdAt: d.created_at,
    lastUpdateDate: d.last_update_date
  }));
}

export async function createLeadInSupabase(lead: Omit<LeadItem, 'id' | 'createdAt'>): Promise<LeadItem | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  const payload = {
    pid: lead.pid,
    client_name: lead.clientName,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    estimated_budget: lead.estimatedBudget,
    budget_label: lead.budgetLabel,
    property_type: lead.propertyType,
    location: lead.location,
    status: lead.status || 'New Enquiry',
    probability: lead.probability || 20,
    notes: lead.notes,
    assigned_sales_owner: lead.assignedSalesOwner,
    assigned_design_lead: lead.assignedDesignLead
  };

  const { data, error } = await supabase.from('leads').insert([payload]).select().single();

  if (error) {
    console.error('Error creating lead in Supabase:', error);
    return null;
  }

  return {
    id: data.id,
    pid: data.pid,
    clientName: data.client_name,
    phone: data.phone,
    email: data.email,
    source: data.source,
    estimatedBudget: Number(data.estimated_budget),
    budgetLabel: data.budget_label,
    propertyType: data.property_type,
    location: data.location,
    status: data.status,
    probability: data.probability,
    notes: data.notes,
    assignedSalesOwner: data.assigned_sales_owner,
    assignedDesignLead: data.assigned_design_lead,
    createdAt: data.created_at,
    lastUpdateDate: data.last_update_date
  };
}

export async function updateLeadStatusInSupabase(leadId: string, newStatus: LeadStatus): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus, last_update_date: new Date().toISOString() })
    .eq('id', leadId);

  return !error;
}

// --- VENDORS ---
export async function fetchVendorsFromSupabase(): Promise<VendorAssignment[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('vendor_assignments')
    .select('*, milestone_payments(*)');

  if (error) {
    console.error('Error fetching vendors:', error);
    return null;
  }

  return data.map((v: any) => ({
    id: v.id,
    projectId: v.project_id || v.id,
    projectName: v.project_name,
    category: v.category,
    vendorName: v.vendor_name,
    contactPhone: v.contact_phone,
    totalContractValue: Number(v.total_contract_value),
    paidToDate: Number(v.paid_to_date),
    pendingApprovalAmount: Number(v.pending_approval_amount),
    status: v.status,
    milestones: (v.milestone_payments || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      amount: Number(m.amount),
      percentage: Number(m.percentage),
      status: m.status,
      dueDate: m.due_date
    }))
  }));
}

export async function createVendorInSupabase(vendor: Omit<VendorAssignment, 'id'>): Promise<VendorAssignment | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  const payload = {
    project_name: vendor.projectName,
    category: vendor.category,
    vendor_name: vendor.vendorName,
    contact_phone: vendor.contactPhone,
    total_contract_value: vendor.totalContractValue,
    paid_to_date: vendor.paidToDate,
    pending_approval_amount: vendor.pendingApprovalAmount,
    status: vendor.status
  };

  const { data, error } = await supabase.from('vendor_assignments').insert([payload]).select().single();
  if (error) return null;

  return {
    id: data.id,
    projectId: data.project_id || data.id,
    projectName: data.project_name,
    category: data.category,
    vendorName: data.vendor_name,
    contactPhone: data.contact_phone,
    totalContractValue: Number(data.total_contract_value),
    paidToDate: Number(data.paid_to_date),
    pendingApprovalAmount: Number(data.pending_approval_amount),
    status: data.status,
    milestones: vendor.milestones || []
  };
}

// --- FINANCE TRANSACTIONS ---
export async function fetchTransactionsFromSupabase(): Promise<FinanceTransaction[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('finance_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return null;

  return data.map((t: any) => ({
    id: t.id,
    projectId: t.project_id || t.id,
    projectName: t.project_name,
    type: t.type,
    partyName: t.party_name,
    category: t.category,
    amount: Number(t.amount),
    gstAmount: Number(t.gst_amount),
    netAmount: Number(t.net_amount),
    status: t.status,
    paymentRefNumber: t.payment_ref_number,
    date: t.date,
    approvedByPM: t.approved_by_pm
  }));
}

export async function createTransactionInSupabase(tx: Omit<FinanceTransaction, 'id'>): Promise<FinanceTransaction | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  const payload = {
    project_name: tx.projectName,
    type: tx.type,
    party_name: tx.partyName,
    category: tx.category,
    amount: tx.amount,
    gst_amount: tx.gstAmount,
    net_amount: tx.netAmount,
    status: tx.status,
    payment_ref_number: tx.paymentRefNumber,
    date: tx.date,
    approved_by_pm: tx.approvedByPM
  };

  const { data, error } = await supabase.from('finance_transactions').insert([payload]).select().single();
  if (error) return null;

  return {
    id: data.id,
    projectId: data.project_id || data.id,
    projectName: data.project_name,
    type: data.type,
    partyName: data.party_name,
    category: data.category,
    amount: Number(data.amount),
    gstAmount: Number(data.gst_amount),
    netAmount: Number(data.net_amount),
    status: data.status,
    paymentRefNumber: data.payment_ref_number,
    date: data.date,
    approvedByPM: data.approved_by_pm
  };
}

export async function updateTransactionApprovalInSupabase(
  txId: string,
  approved: boolean
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return true;

  const { error } = await supabase
    .from('finance_transactions')
    .update({
      approved_by_pm: approved,
      status: approved ? 'Ready for Release' : 'Pending PM Audit'
    })
    .eq('id', txId);

  if (error) {
    console.error('Error updating transaction approval:', error);
    return false;
  }
  return true;
}
