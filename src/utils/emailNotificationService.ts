export type EmailTemplateType =
  | 'welcome'
  | 'project_status_update'
  | 'vendor_payment_approval'
  | 'payout_disbursed'
  | 'lead_assigned';

export interface SentEmail {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: EmailTemplateType;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed';
  htmlContent: string;
  metadata?: {
    projectId?: string;
    projectName?: string;
    amount?: number;
    paymentRef?: string;
    leadPid?: string;
    newStatus?: string;
  };
}

// Initial demo sent emails in memory store
const INITIAL_SENT_EMAILS: SentEmail[] = [
  {
    id: 'em-101',
    recipientEmail: 'vikas.woodwork@foryn-vendors.in',
    recipientName: 'Vikas Woodwork Studio',
    subject: '✅ Vendor Payment Approved by PM - ₹2,50,000 (DLF Camellias)',
    templateType: 'vendor_payment_approval',
    sentAt: '11-Aug-26 09:30 AM',
    status: 'Delivered',
    metadata: {
      projectId: 'PRJ-1001',
      projectName: 'DLF Camellias Penthouse',
      amount: 250000
    },
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 800;">FORYN DESIGN & BUILD</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Transactional Payout Notification</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0f172a; margin-top: 0;">Payment Milestone Approved by Site PM</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">Dear <strong>Vikas Woodwork Studio</strong>,</p>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">Your site inspection for project <strong>DLF Camellias Penthouse</strong> has been verified. Project Manager has approved your milestone payment request.</p>
          
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Approved Payout Details</div>
            <div style="font-size: 24px; font-weight: 900; color: #059669; margin: 8px 0;">₹2,50,000</div>
            <div style="font-size: 13px; color: #334155;">+18% GST: ₹45,000 | <strong>Net Payable: ₹2,95,000</strong></div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Status: Queued in Finance Disbursement Gateway</div>
          </div>

          <p style="color: #475569; font-size: 13px;">Funds will be released directly to your registered HDFC Bank account via RTGS/NEFT shortly.</p>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
          Automated Transactional Notification • Foryn Studio Finance Gateway • All Rights Reserved
        </div>
      </div>
    `
  },
  {
    id: 'em-102',
    recipientEmail: 'monil.v@gmail.com',
    recipientName: 'Monil Vijay',
    subject: '📌 Project Status Update: "Call Done" for Golf Course Villa',
    templateType: 'project_status_update',
    sentAt: '11-Aug-26 10:15 AM',
    status: 'Delivered',
    metadata: {
      leadPid: '1001',
      projectName: 'DLF Camellias Penthouse',
      newStatus: 'Call Done'
    },
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 800;">FORYN DESIGN & BUILD</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Pre-Sales & Design Pipeline Update</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0f172a; margin-top: 0;">Project Lead Status Updated</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">Hello <strong>Monil Vijay</strong>,</p>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">Your interior design project inquiry (Unique PID: <strong>1001</strong>) status has been updated in our system.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #166534; text-transform: uppercase; font-weight: bold;">New Stage</div>
            <div style="font-size: 20px; font-weight: 800; color: #15803d; margin: 4px 0;">Call Done</div>
            <div style="font-size: 13px; color: #334155; margin-top: 6px;">Assigned Sales Manager: Rishabh Bhardwaj | Design Lead: Anjali Sharma</div>
          </div>

          <p style="color: #475569; font-size: 13px;">Our Senior Design Lead is preparing your personalized 3D spatial concept and BOQ cost estimation.</p>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
          Automated Notification • Foryn Studio Client Relations
        </div>
      </div>
    `
  }
];

let emailLogsStore: SentEmail[] = [...INITIAL_SENT_EMAILS];

export function getSentEmailLogs(): SentEmail[] {
  return emailLogsStore;
}

export function sendTransactionalEmail(params: {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: EmailTemplateType;
  data: {
    pid?: string;
    clientName?: string;
    projectName?: string;
    leadPid?: string;
    newStatus?: string;
    amount?: number;
    paymentRef?: string;
    vendorName?: string;
    notes?: string;
  };
}): SentEmail {
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const emailId = `em-${Date.now()}`;

  let bodyHtml = '';

  if (params.templateType === 'vendor_payment_approval') {
    const gross = params.data.amount || 250000;
    const gst = Math.round(gross * 0.18);
    const net = gross + gst;
    bodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 800;">FORYN DESIGN & BUILD</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Transactional Vendor Payout Notification</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0f172a; margin-top: 0;">Milestone Approved by Project Manager</h3>
          <p style="color: #475569; font-size: 14px;">Dear <strong>${params.recipientName}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">Milestone payment for site <strong>${params.data.projectName || 'Project Site'}</strong> has been approved by the Project Management team.</p>

          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Approved Base Amount</div>
            <div style="font-size: 24px; font-weight: 900; color: #059669; margin: 8px 0;">₹${gross.toLocaleString('en-IN')}</div>
            <div style="font-size: 13px; color: #334155;">+18% GST: ₹${gst.toLocaleString('en-IN')} | <strong>Net Payable: ₹${net.toLocaleString('en-IN')}</strong></div>
          </div>
          <p style="color: #475569; font-size: 13px;">This transaction is now queued for RTGS disbursement with the Finance Team.</p>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
          Foryn Studio Finance Gateway • All Rights Reserved
        </div>
      </div>
    `;
  } else if (params.templateType === 'payout_disbursed') {
    bodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #059669; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">RTGS DISBURSEMENT CONFIRMED</h2>
          <p style="color: #a7f3d0; margin: 4px 0 0 0; font-size: 12px;">Foryn Studio Finance & Banking Gateway</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0f172a; margin-top: 0;">Funds Disbursed to Vendor Account</h3>
          <p style="color: #475569; font-size: 14px;">Dear <strong>${params.recipientName}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">Payment release for <strong>${params.data.projectName || 'Project Site'}</strong> has been successfully processed.</p>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #047857; text-transform: uppercase; font-weight: bold;">Disbursed Amount</div>
            <div style="font-size: 24px; font-weight: 900; color: #059669; margin: 8px 0;">₹${(params.data.amount || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 13px; color: #065f46; font-family: monospace;">Bank Reference Number: <strong>${params.data.paymentRef || 'HDFC-RTGS-9901823'}</strong></div>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
          Foryn Studio Finance Gateway • Verified
        </div>
      </div>
    `;
  } else {
    // Default project_status_update / lead_assigned
    bodyHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 20px; text-align: center;">
          <h2 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 800;">FORYN DESIGN & BUILD</h2>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Project Notification System</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0f172a; margin-top: 0;">${params.subject}</h3>
          <p style="color: #475569; font-size: 14px;">Hello <strong>${params.recipientName}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">Your project <strong>${params.data.projectName || 'Foryn Interior Site'}</strong> (PID: <strong>${params.data.leadPid || 'N/A'}</strong>) status has been updated to:</p>

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 18px; font-weight: 800; color: #b45309;">${params.data.newStatus || 'Updated'}</div>
            ${params.data.notes ? `<div style="font-size: 12px; color: #78350f; margin-top: 6px;">Notes: ${params.data.notes}</div>` : ''}
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
          Foryn Studio Notification Engine
        </div>
      </div>
    `;
  }

  const sentEmail: SentEmail = {
    id: emailId,
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject: params.subject,
    templateType: params.templateType,
    sentAt: formattedTime,
    status: 'Delivered',
    htmlContent: bodyHtml,
    metadata: {
      projectId: params.data.leadPid,
      projectName: params.data.projectName,
      amount: params.data.amount,
      paymentRef: params.data.paymentRef,
      leadPid: params.data.leadPid,
      newStatus: params.data.newStatus
    }
  };

  emailLogsStore = [sentEmail, ...emailLogsStore];
  return sentEmail;
}
