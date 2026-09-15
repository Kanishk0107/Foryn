export interface BoqItem {
  id: string;
  code: string;
  category: string;
  description: string;
  specification: string;
  unit: 'SqFt' | 'Rft' | 'Nos' | 'Lumpsum' | 'Sets';
  quantity: number;
  materialUnitRate: number; // in ₹
  laborUnitRate: number;    // in ₹
  markupMarginPercent: number; // e.g. 25%
  status: 'Draft' | 'Client Approved' | 'Procurement Released' | 'Site Installed';
}

export const INITIAL_BOQ_ITEMS: BoqItem[] = [];

export const BOQ_CATEGORIES = [
  'Modular Kitchen',
  'Wardrobes & Storage',
  'Civil & Tiling',
  'Electrical & Lighting',
  'False Ceiling & Paint',
  'Decor & Soft Furnishing'
];
