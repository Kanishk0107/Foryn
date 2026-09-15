-- ================================================================
-- FORYN PLATFORM — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Complete Zero-to-End Architecture, Triggers & RLS Policies
-- Paste directly into Supabase SQL Editor (https://supabase.com)
-- ================================================================

-- 1. Create Custom User Role & Notification Types
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'Admin',
    'Sales Lead',
    'Designer Team',
    'Project Management',
    'Finance Team',
    'Interior Designer',
    'Architect',
    '3D Artist',
    'Homeowner'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM (
    'pm_approval',
    'lead_assigned',
    'disbursement',
    'status_update',
    'system_alert'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. User Profiles Table (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'Sales Lead',
  company TEXT DEFAULT 'Foryn Living Pvt. Ltd.',
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  login_count INT DEFAULT 1,
  total_usage_seconds INT DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Automatic Profile Creation Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, name, email, role, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'Sales Lead'),
    is_first_user
  )
  ON CONFLICT (id) DO UPDATE SET
    last_login_at = NOW(),
    login_count = public.profiles.login_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Pre-Sales CRM Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pid VARCHAR(20) UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  estimated_budget NUMERIC(12,2) DEFAULT 0,
  budget_label TEXT,
  property_type TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New Enquiry',
  probability INT DEFAULT 20,
  notes TEXT,
  assigned_sales_owner TEXT,
  assigned_design_lead TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_update_date TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Lead Call Logs Table
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  called_by TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT DEFAULT 'Completed',
  recording_url TEXT,
  transcript_summary TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Lead Follow-ups Table
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT,
  note TEXT NOT NULL,
  assigned_to TEXT,
  completed BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Projects Registry Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pid VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  property_type TEXT,
  location TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Master BOQ Items Table
CREATE TABLE IF NOT EXISTS public.boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  specification TEXT,
  unit VARCHAR(20) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  material_unit_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_unit_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  markup_margin_percent NUMERIC(5,2) NOT NULL DEFAULT 25,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Vendor Work Orders Table
CREATE TABLE IF NOT EXISTS public.vendor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  category TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  total_contract_value NUMERIC(12,2) DEFAULT 0,
  paid_to_date NUMERIC(12,2) DEFAULT 0,
  pending_approval_amount NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'Contract Signed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Vendor Milestone Payments Table
CREATE TABLE IF NOT EXISTS public.milestone_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_assignment_id UUID REFERENCES public.vendor_assignments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  status TEXT DEFAULT 'Pending',
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Finance Transactions & Tax Ledger Table
CREATE TABLE IF NOT EXISTS public.finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  type TEXT NOT NULL,
  party_name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  gst_amount NUMERIC(12,2) NOT NULL,
  net_amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'Pending PM Audit',
  payment_ref_number TEXT,
  date TEXT DEFAULT 'Today',
  approved_by_pm BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Real-Time In-App Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'system_alert',
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Transactional Email Notification Audit Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL,
  status TEXT DEFAULT 'Delivered',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  html_content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================================================
-- PERFORMANCE INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_leads_pid ON public.leads(pid);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_projects_pid ON public.projects(pid);
CREATE INDEX IF NOT EXISTS idx_boq_project_id ON public.boq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_vendors_project_id ON public.vendor_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_finance_project_id ON public.finance_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(recipient_user_id, read);

-- ================================================================
-- POSTGRES NOTIFICATION TRIGGERS
-- ================================================================

-- Trigger: Notify Finance Team when PM Approves Payment Transaction
CREATE OR REPLACE FUNCTION public.notify_on_pm_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.approved_by_pm = TRUE AND (OLD.approved_by_pm IS NULL OR OLD.approved_by_pm = FALSE) THEN
    INSERT INTO public.notifications (recipient_user_id, title, message, type, metadata)
    SELECT id, 
           '💰 PM Milestone Payment Approved',
           'PM approved payout of ₹' || TRIM(TO_CHAR(NEW.net_amount, '99,99,99,990.00')) || ' for ' || NEW.party_name || ' (' || NEW.project_name || ')',
           'pm_approval'::public.notification_type,
           json_build_object('transaction_id', NEW.id, 'project_id', NEW.project_id)
    FROM public.profiles
    WHERE role IN ('Finance Team', 'Admin');

    INSERT INTO public.email_logs (recipient_email, recipient_name, subject, template_type, metadata)
    VALUES (
      'finance-gateway@foryn-studio.in',
      'Finance Operations Team',
      '✅ PM Approved Payout: ' || NEW.party_name,
      'vendor_payment_approval',
      json_build_object('amount', NEW.net_amount, 'partyName', NEW.party_name)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_pm_approval ON public.finance_transactions;
CREATE TRIGGER trg_notify_pm_approval
  AFTER UPDATE ON public.finance_transactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_pm_approval();

-- Trigger: Notify Sales Manager when New Lead Assigned
CREATE OR REPLACE FUNCTION public.notify_on_lead_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assigned_sales_owner IS NOT NULL AND (OLD.assigned_sales_owner IS NULL OR OLD.assigned_sales_owner <> NEW.assigned_sales_owner) THEN
    INSERT INTO public.notifications (recipient_user_id, title, message, type, metadata)
    SELECT id, 
           '📌 New Inbound Lead Assigned',
           'Lead ' || NEW.client_name || ' (PID: ' || NEW.pid || ') assigned to ' || NEW.assigned_sales_owner,
           'lead_assigned'::public.notification_type,
           json_build_object('lead_id', NEW.id, 'pid', NEW.pid)
    FROM public.profiles
    WHERE role IN ('Sales Lead', 'Admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_lead_assigned ON public.leads;
CREATE TRIGGER trg_notify_lead_assigned
  AFTER INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_lead_assigned();

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users
CREATE POLICY "Allow authenticated read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read call_logs" ON public.call_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read follow_ups" ON public.follow_ups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read boq" ON public.boq_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read vendors" ON public.vendor_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read milestones" ON public.milestone_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read finance" ON public.finance_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow user read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = recipient_user_id OR recipient_user_id IS NULL);
CREATE POLICY "Allow authenticated read email_logs" ON public.email_logs FOR SELECT TO authenticated USING (true);

-- Role-based Write policies
CREATE POLICY "Sales and Admin manage leads" ON public.leads FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Sales Lead', 'Admin'))
);

CREATE POLICY "PM and Admin manage vendors" ON public.vendor_assignments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Project Management', 'Admin'))
);

CREATE POLICY "Finance and Admin manage transactions" ON public.finance_transactions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Finance Team', 'Admin'))
);

CREATE POLICY "Designer and Admin manage BOQ" ON public.boq_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Designer Team', 'Interior Designer', 'Architect', '3D Artist', 'Admin'))
);

CREATE POLICY "User manage own notifications" ON public.notifications FOR ALL TO authenticated USING (
  auth.uid() = recipient_user_id OR recipient_user_id IS NULL
);

-- Enable Realtime for Notifications Table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
