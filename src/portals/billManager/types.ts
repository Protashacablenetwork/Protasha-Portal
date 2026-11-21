export type BillServiceType = 'নেট বিল' | 'ডিস বিল' | 'নেট সংযোগ' | 'বকেয়া বিল';

export type BillView = 'dashboard' | 'all' | 'paid' | 'due';

export type TableFilter = 'all' | 'paid' | 'due';

export type AreaFilter = 'all' | 'area1' | 'area2';

export type ColorTheme = 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'teal';

export type BillLang = 'bn' | 'en';

export interface BillRecord {
  id: string | null;
  name: string;
  pay: number;
  due: number;
  total: number;
  date: string;
  mob: string;
  address: string;
  status: string;
}

export interface MonthlyAggregates {
  net: Record<string, number>;
  dis: Record<string, number>;
}

export interface DuplicateEntry {
  type: 'MOBILE' | 'NAME_ID';
  record: BillRecord;
  original: BillRecord;
}

export interface ToastState {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
