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
  source?: 'main' | 'ay-byay';
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
  isFastingAlert?: boolean;
  isWeatherAlert?: boolean;
  isGlobal?: boolean;
  sehriIftarData?: {
    districtBn: string;
    districtEn: string;
    divisionBn?: string;
    dateStrBn: string;
    hijriDateBn: string;
    sehriEndBn: string;
    fajrBn: string;
    sunriseBn: string;
    iftarBn: string;
    fastDurationBn: string;
    slotType: 'daily_schedule' | 'sehri_reminder' | 'iftar_reminder' | 'iftar_time';
    locationSource?: 'gps' | 'manual' | 'ip' | 'default';
  };
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
  phone?: string;     // মোবাইল নাম্বার
  address?: string;   // ঠিকানা
  avatarUrl?: string; // ছবি
  notes?: string;     // হিসাব মন্তব্য / বিবরণ
  isHalf?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SupportTicketCategory =
  | 'line_cut'
  | 'onu_router'
  | 'slow_net'
  | 'dish_signal'
  | 'billing'
  | 'new_line'
  | 'other';

export type SupportTicketPriority = 'urgent' | 'high' | 'normal';

export type SupportTicketStatus = 'pending' | 'reviewing' | 'in_progress' | 'resolved';

export interface SupportTicketActivity {
  id: string;
  action: 'created' | 'status_changed' | 'assigned' | 'resolved' | 'edited';
  titleBn: string;
  titleEn: string;
  actorName: string;
  actorRole?: string;
  note?: string;
  status?: SupportTicketStatus;
  timestamp: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderId?: string;
  senderName: string;
  senderRole?: 'admin' | 'sub-admin' | 'user' | 'visitor' | 'staff';
  text: string;
  type?: 'message' | 'system';
  createdAt: string;
}

export interface StaffSupportSession {
  staffId: string;
  name: string;
  phone: string;
  roleTitle: string;
  loggedInAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  customerCode?: string;
  area?: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  description?: string;
  resolutionNote?: string;
  createdBy?: string;
  createdById?: string;
  createdByPhone?: string;
  createdByRole?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  resolvedByRole?: string | null;
  messageCount?: number;
  lastMessageText?: string | null;
  lastMessageBy?: string | null;
  lastMessageAt?: string | null;
  isPublicTrackingEnabled?: boolean;
  activityHistory?: SupportTicketActivity[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'half_day';

export type LeaveType = 'casual' | 'sick' | 'emergency' | 'unpaid' | 'none';

export interface StaffAttendanceRecord {
  id: string; // `${staffId}_${date}`
  staffId: string;
  staffName: string;
  staffRole?: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  status: AttendanceStatus;
  checkInTime?: string;
  leaveType?: LeaveType;
  note?: string;
  recordedBy?: string;
  updatedAt: string;
}
