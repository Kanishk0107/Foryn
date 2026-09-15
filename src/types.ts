export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  category: string;
  material: string;
  price: number;
  dimensions: string;
  description: string;
  badge?: string;
  colorOptions?: string[];
}

export interface RoomScene {
  id: string;
  name: string;
  tagline: string;
  image: string;
  renderTime: string;
  style: string;
  hotspots: Hotspot[];
  lightingTemp: number; // Kelvin e.g. 3000
}

export type RenderMode = 'photo' | 'blueprint' | 'wireframe';

export type AuthMode = 'login' | 'signup' | 'forgot_password';

export type UserRole = 
  | 'Sales Lead'
  | 'Designer Team'
  | 'Project Management'
  | 'Finance Team'
  | 'Interior Designer'
  | 'Architect'
  | '3D Artist'
  | 'Homeowner';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

export type NotificationType =
  | 'pm_approval'
  | 'lead_assigned'
  | 'disbursement'
  | 'status_update'
  | 'system_alert';

export interface NotificationItem {
  id: string;
  recipientUserId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type LeadSource = 
  | 'Meta / IG Ads'
  | 'Website Inquiry'
  | 'Builder Referral'
  | 'Walk-in Studio'
  | 'Architect Connect';

export type LeadStatus = 
  | 'New Enquiry'
  | 'Call Scheduled'
  | 'Call Done'
  | 'Call Back Required'
  | 'No Answer'
  | 'Fake Lead'
  | 'Duplicate lead'
  | 'No Requirement'
  | 'Promoted to Sales Team';

export interface CallLogItem {
  id: string;
  calledBy: string;
  timestamp: string;
  duration: string;
  status: 'Completed' | 'Missed' | 'In Progress';
  recordingUrl?: string;
  transcriptSummary?: string;
  notes: string;
}

export interface FollowUpItem {
  id: string;
  date: string;
  time?: string;
  note: string;
  assignedTo: string;
  completed: boolean;
  isUrgent?: boolean;
}

export interface ActivityLogItem {
  id: string;
  type: 'status_change' | 'call' | 'followup' | 'note' | 'lead_created' | 'assignment';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  metadata?: {
    oldStatus?: string;
    newStatus?: string;
    callDuration?: string;
    isRecorded?: boolean;
    recordingUrl?: string;
  };
}

export interface LeadItem {
  id: string; // e.g. LD-910
  pid: string; // Auto-generated unique 4-digit numeric Project ID e.g. 1001
  clientName: string;
  phone: string;
  email: string;
  source: LeadSource;
  estimatedBudget: number; // In Lakhs ₹
  budgetLabel?: string; // e.g. "₹15 Lakhs - ₹25 Lakhs"
  propertyType: string; // e.g. 3BHK Apartment, Villa, Office Suite
  location: string;
  status: LeadStatus;
  probability: number; // 0-100%
  notes: string;
  assignedSalesOwner: string;
  assignedDesignLead: string;
  createdAt: string; // e.g. 10-Aug-26 01:30 PM
  lastUpdateDate: string; // e.g. 10-Aug-26 08:00 AM
  description?: string; // Detailed Meta form response or questions
  latestRemark?: string; // e.g. [FL] Lead Created
  rating?: number; // 1 to 5
  enableClientAppLogin?: boolean;
  tags?: string[];
  taxId?: string;
  followUps?: FollowUpItem[];
  callLogs?: CallLogItem[];
  activityLogs?: ActivityLogItem[];
}

export interface MilestonePayment {
  id: string;
  title: string;
  amount: number; // In ₹ Lakhs or Rupees
  percentage: number;
  status: 'Pending' | 'PM Approved' | 'Released by Finance';
  dueDate: string;
  proofUrl?: string;
}

export interface VendorAssignment {
  id: string;
  projectId: string;
  projectName: string;
  category: 'Modular Cabinetry Factory' | 'Civil & Tiling' | 'Electrical & Lighting' | 'False Ceiling & Paint' | 'Decor & Soft Furnishing';
  vendorName: string;
  contactPhone: string;
  totalContractValue: number; // In Lakhs
  paidToDate: number;
  pendingApprovalAmount: number;
  milestones: MilestonePayment[];
  status: 'Contract Signed' | 'In Progress' | 'Payment Pending PM' | 'Approved by PM' | 'Cleared by Finance';
}

export interface FinanceTransaction {
  id: string;
  projectId: string;
  projectName: string;
  type: 'Client Receipt' | 'Vendor Payout' | 'GST Tax Ledger';
  partyName: string; // Client or Vendor
  category: string;
  amount: number; // Rupees
  gstAmount: number; // 18% GST
  netAmount: number;
  status: 'Pending PM Audit' | 'Ready for Release' | 'Completed & Paid';
  paymentRefNumber?: string;
  date: string;
  approvedByPM: boolean;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'Furniture' | 'Kitchen' | 'Lighting' | 'Materials' | 'Decor';
  price: number;
  dimensions: string;
  material: string;
  iconName: string;
  color: string;
  thumbnail: string;
}

export interface PlanElement {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  type: string;
  price: number;
  layerId?: string;
  elevationZ?: number; // mm
  heightZ?: number; // mm
  materialId?: string;
  modifiers?: ModifierStackItem[];
}

export interface CadLayer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  frozen: boolean;
  lineWeight: string;
  lineType: string;
  isCurrent: boolean;
  itemCount: number;
}

export interface BimWallType {
  id: string;
  name: string;
  thicknessMm: number;
  coreMaterial: string;
  finishMaterial: string;
  fireRating: string;
  costPerSqM: number;
}

export interface BimLevel {
  id: string;
  name: string;
  elevationMm: number;
  isCurrent: boolean;
}

export interface ShaderMaterial {
  id: string;
  name: string;
  category: string;
  albedoColor: string;
  roughness: number; // 0 to 1
  metallic: number; // 0 to 1
  bumpMap: string;
  ior: number; // Index of Refraction
  previewUrl?: string;
}

export interface IesLight {
  id: string;
  name: string;
  intensityLumens: number;
  kelvinTemp: number;
  beamAngle: number;
  enabled: boolean;
  x: number;
  y: number;
  z: number;
}

export interface ModifierStackItem {
  id: string;
  name: string;
  type: 'Extrude' | 'Bevel' | 'Array' | 'UVW Map' | 'Boolean' | 'Subdivision';
  enabled: boolean;
  params: {
    heightMm?: number;
    bevelRadiusMm?: number;
    countX?: number;
    countY?: number;
    spacingMm?: number;
    projection?: 'Box' | 'Planar' | 'Cylindrical';
  };
}

export interface CameraKeyframe {
  id: string;
  frame: number;
  title: string;
  fov: number;
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
}

export interface CloudSyncState {
  status: 'synced' | 'syncing' | 'offline';
  lastSaved: string;
  latencyMs: number;
  serverGpuStatus: 'Ready (RTX 4090 Cloud)' | 'Rendering Frame' | 'Idle';
  activeProjectUuid: string;
  databaseHost: string;
}

