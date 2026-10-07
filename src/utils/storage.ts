import { LandRecord } from '../types';

const STORAGE_KEY = 'land_ledger_records_v1';
const SETTINGS_KEY = 'land_ledger_settings_v1';

export interface AppSettings {
  currency: string;
  defaultUnit: string;
  businessName: string;
  phone: string;
  language: 'bn' | 'en';
  logoUrl?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  currency: '₹',
  defaultUnit: 'Bigha',
  businessName: 'Kisan Land & Agro Registry',
  phone: '',
  language: 'bn',
  logoUrl: '',
};

export const INITIAL_RECORDS: LandRecord[] = [
  {
    id: 'rec-1',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    plotNumber: 'Survey #42/A',
    land: 4.5,
    unit: 'Bigha',
    rate: 65000,
    total: 292500,
    date: '2026-09-15',
    paid: 200000,
    due: 92500,
    notes: 'South boundary canal road. 1st installment received via RTGS.',
    payments: [
      {
        id: 'pay-1',
        amount: 200000,
        date: '2026-09-15',
        method: 'Bank Transfer',
        note: 'Advance booking payment',
      },
    ],
    createdAt: Date.now() - 25 * 86400000,
    updatedAt: Date.now() - 25 * 86400000,
  },
  {
    id: 'rec-2',
    name: 'Suresh Choudhary',
    phone: '+91 94250 11223',
    plotNumber: 'Plot 108 East',
    land: 3.0,
    unit: 'Bigha',
    rate: 70000,
    total: 210000,
    date: '2026-09-28',
    paid: 210000,
    due: 0,
    notes: 'All dues cleared. Mutation documents handed over.',
    payments: [
      {
        id: 'pay-2a',
        amount: 100000,
        date: '2026-09-20',
        method: 'Cash',
        note: 'Token payment',
      },
      {
        id: 'pay-2b',
        amount: 110000,
        date: '2026-09-28',
        method: 'UPI/Online',
        note: 'Final settlement',
      },
    ],
    createdAt: Date.now() - 15 * 86400000,
    updatedAt: Date.now() - 9 * 86400000,
  },
  {
    id: 'rec-3',
    name: 'Mohammad Farooq',
    phone: '+91 98210 99887',
    plotNumber: 'Khasra 215',
    land: 6.2,
    unit: 'Acre',
    rate: 120000,
    total: 744000,
    date: '2026-10-02',
    paid: 500000,
    due: 244000,
    notes: 'Remaining balance due upon registration on 25th Oct.',
    payments: [
      {
        id: 'pay-3',
        amount: 500000,
        date: '2026-10-02',
        method: 'Cheque',
        note: 'Cheque #402919 cleared',
      },
    ],
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'rec-4',
    name: 'Gita Devi',
    phone: '+91 97110 33445',
    plotNumber: 'Survey #89',
    land: 2.0,
    unit: 'Katha',
    rate: 45000,
    total: 90000,
    date: '2026-10-05',
    paid: 90000,
    due: 0,
    notes: 'Full payment received in cash.',
    payments: [
      {
        id: 'pay-4',
        amount: 90000,
        date: '2026-10-05',
        method: 'Cash',
        note: 'Full payment',
      },
    ],
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'rec-5',
    name: 'Vikram Singh',
    phone: '+91 99880 77665',
    plotNumber: 'Near Village Well',
    land: 5.0,
    unit: 'Bigha',
    rate: 55000,
    total: 275000,
    date: '2026-10-06',
    paid: 75000,
    due: 200000,
    notes: 'Token advance given. Rest due by next month.',
    payments: [
      {
        id: 'pay-5',
        amount: 75000,
        date: '2026-10-06',
        method: 'Cash',
        note: 'Token advance',
      },
    ],
    createdAt: Date.now() - 1 * 86400000,
    updatedAt: Date.now() - 1 * 86400000,
  },
];

export function loadRecords(): LandRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveRecords(INITIAL_RECORDS);
      return INITIAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_RECORDS;
  } catch (e) {
    console.error('Failed to load records from storage', e);
    return INITIAL_RECORDS;
  }
}

export function saveRecords(records: LandRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to storage', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}
