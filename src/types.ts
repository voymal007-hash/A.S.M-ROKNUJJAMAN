export type LandUnit =
  | 'Acre'
  | 'Bigha'
  | 'Katha'
  | 'Cent'
  | 'Guntha'
  | 'Hectare'
  | 'Sq. Ft'
  | 'Marla'
  | 'Kanal'
  | 'Decimal';

export interface PaymentItem {
  id: string;
  amount: number;
  date: string;
  note?: string;
  method?: 'Cash' | 'Bank Transfer' | 'UPI/Online' | 'Cheque' | 'Other';
}

export interface LandRecord {
  id: string;
  name: string;
  phone?: string;
  plotNumber?: string;
  land: number;
  unit: LandUnit;
  rate: number;
  total: number;
  date: string;
  paid: number;
  due: number;
  payments: PaymentItem[];
  photoUrl?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type FilterStatus = 'all' | 'paid' | 'due' | 'partial';

export interface LedgerSummary {
  totalRecords: number;
  totalLand: number;
  totalRevenue: number; // sum of total
  totalPaid: number;    // sumeri all paid
  totalDue: number;     // total remaining dues
  fullyPaidCount: number;
  pendingDueCount: number;
  collectionRate: number; // percentage
}
