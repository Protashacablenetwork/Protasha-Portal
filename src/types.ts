export type TransactionType = 'income' | 'expense';

export type PaymentMethod = string; // Supports 'নগদ', 'বিকাশ', 'রকেট', 'ব্যাংক', 'ক্যাশ' and custom admin-added channels (e.g. 'উপায়', 'সেলফিন', etc.)

export interface PaymentChannel {
  id: string;
  name: string;
  labelBn: string;
  labelEn: string;
  icon: string;
  imageUrl?: string;
  color: string;
  bg: string;
  border: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  trxId: string;
  type: TransactionType;
  method: PaymentMethod;
  bankName?: string; // e.g. "ব্র্যাক ব্যাংক", "ইসলামী ব্যাংক", "ডাচ বাংলা ব্যাংক"
  amount: number;
  person: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:02 AM"
  note: string;
  category: string;
  isDeleted?: boolean;
  recordedBy?: string;
  recordedByGmail?: string;
  created: number;
}

export interface BannerAd {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn: string;
  badgeEn: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  priority: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actionBn: string;
  user: string;
  details: string;
  time: number;
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  messageBn?: string;
  messageEn?: string;
  date?: string;
  timeBn: string;
  timeEn: string;
  type: 'offer' | 'cashback' | 'trx' | 'info' | 'weather' | 'alert';
  amount?: number;
  image?: string;
  isRead?: boolean;
  readBy?: string[];
  districtBn?: string;
  districtEn?: string;
  isPrayerAlert?: boolean;
  isWeatherAlert?: boolean;
  isGlobal?: boolean;
}

export interface FooterItem {
  bn: string;
  en: string;
  url: string;
  icon: string;
}

export interface FooterConfig {
  store: FooterItem;
  offer: FooterItem;
  help: FooterItem;
}

export type Language = 'bn' | 'en';

export type UserRole = 'admin' | 'sub-admin' | 'user' | 'visitor';

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  gmail?: string;
  avatarUrl?: string;
  pin: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  status: 'active' | 'suspended';
  boundMethods?: ('phone' | 'gmail')[];
  recordedBy?: string;
}

export interface UserSession {
  id?: string;
  email?: string;
  role: UserRole;
  name: string;
  phone: string;
  gmail?: string;
  avatarUrl?: string;
  virtualCardNumber?: string;
  accountType?: 'islamic' | 'general';
  profitPreference?: boolean;
  boundMethods?: ('phone' | 'gmail')[];
}

export interface StaffTransaction {
  id: string;
  staffId: string;
  type: 'due' | 'collection'; // 'due' = কোম্পানি পাওনা যোগ, 'collection' = স্টাফ কালেকশন জমা
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  userName?: string; // ইউজার আইডি (e.g. pcn42)
  customerName?: string; // নাম (e.g. মোঃ কাজল আলী)
  customerAddress?: string; // ঠিকানা (e.g. চর শিমুল চূড়া)
  reference?: string; // রেফারেন্স (e.g. বিল রসিদ / রেফারেন্স)
  note?: string;
  recordedBy?: string;
  created: number;
}

export interface StaffAccount {
  id: string;
  name: string;
  phone: string;
  role: string; // e.g. "লাইন টেকনিশিয়ান", "কালেকশন অফিসার", "বিল সংগ্রাহক"
  userCode?: string; // ইউজার কোড
  address?: string; // ঠিকানা
  reference?: string; // রেফারেন্স
  avatarUrl?: string;
  totalDue: number;        // মোট কোম্পানি পাওনা
  totalCollected: number;  // মোট সংগৃহীত / জমা
  remainingDue: number;    // অবশিষ্ট পাওনা (totalDue - totalCollected)
  notes?: string;
  createdAt: string;
  baseSalary?: number;
  isActive?: boolean;
  recordedBy?: string;
  transactions: StaffTransaction[];
}

export interface ServiceStatusConfig {
  isActive: boolean;
  title?: string;
  customMessage?: string;
  logoUrl?: string;
}

export interface QuickHisabOwner {
  id: string | number;
  name: string;
  shareUnits: number; // 1.0, 0.5, or custom number of shares
  avatarUrl?: string;
  isHalf?: boolean;
}
