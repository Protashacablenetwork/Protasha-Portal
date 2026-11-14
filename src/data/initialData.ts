import { Transaction, NotificationItem, FooterConfig, BannerAd, PaymentChannel, StaffAccount, QuickHisabOwner, AppUser } from '../types';

export const initialPaymentChannels: PaymentChannel[] = [
  {
    id: 'ch-nagad',
    name: 'নগদ',
    labelBn: 'নগদ ওয়ালেট',
    labelEn: 'Nagad Wallet',
    icon: '💵',
    imageUrl: 'https://imagepaste.org/i/t4dassfe.png',
    color: 'text-[#E52E2E]',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-900/40',
    isDefault: true
  },
  {
    id: 'ch-bkash',
    name: 'বিকাশ',
    labelBn: 'বিকাশ একাউন্ট',
    labelEn: 'bKash Account',
    icon: '📱',
    imageUrl: 'https://imagepaste.org/i/nr5kcshj.png',
    color: 'text-[#D81B60]',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-900/40',
    isDefault: true
  },
  {
    id: 'ch-rocket',
    name: 'রকেট',
    labelBn: 'রকেট ডিবিবিএল',
    labelEn: 'Rocket DBBL',
    icon: '🚀',
    imageUrl: 'https://imagepaste.org/i/y9dgzfpq.png',
    color: 'text-[#8E24AA]',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/40',
    isDefault: true
  },
  {
    id: 'ch-bank',
    name: 'ব্যাংক',
    labelBn: 'ব্যাংক হিসাব (সব ব্যাংক)',
    labelEn: 'Bank Accounts (All Banks)',
    icon: '🏦',
    color: 'text-[#2563EB]',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/40',
    isDefault: true
  },
  {
    id: 'ch-cash',
    name: 'ক্যাশ',
    labelBn: 'হাতে নগদ ক্যাশ',
    labelEn: 'Cash on Hand',
    icon: '💰',
    imageUrl: 'https://imagepaste.org/i/ejqxwxby.png',
    color: 'text-[#2E7D32]',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/40',
    isDefault: true
  }
];

export const initialAppUsers: AppUser[] = [
  {
    id: 'admin-primary',
    name: 'প্রত্যাশা অ্যাডমিন',
    phone: '01777877207',
    pin: '12588',
    role: 'admin',
    status: 'active',
    createdAt: '2026-10-01T00:00:00.000Z'
  },
  {
    id: 'usr-1',
    name: 'মোঃ জামাল উদ্দিন',
    phone: '01884542812',
    pin: '1234',
    role: 'user',
    status: 'active',
    createdAt: '2026-10-15T00:00:00.000Z'
  },
  {
    id: 'usr-2',
    name: 'মোঃ রফিকুল ইসলাম',
    phone: '01712345678',
    pin: '1234',
    role: 'user',
    status: 'active',
    createdAt: '2026-10-20T00:00:00.000Z'
  }
];

export const initialTransactions: Transaction[] = [];

export const initialBanners: BannerAd[] = [
  {
    id: 'banner-demo-1',
    badgeBn: '',
    badgeEn: '',
    titleBn: '',
    titleEn: '',
    subtitleBn: '',
    subtitleEn: '',
    imageUrl: 'https://i.postimg.cc/mkZ5K2WX/76767.webp',
    linkUrl: '#',
    isActive: true,
    priority: 1
  },
  {
    id: 'banner-demo-2',
    badgeBn: '',
    badgeEn: '',
    titleBn: '',
    titleEn: '',
    subtitleBn: '',
    subtitleEn: '',
    imageUrl: 'https://i.postimg.cc/WzKwS2Nj/Picture-2026-11-12-12-02-17.webp',
    linkUrl: '#',
    isActive: true,
    priority: 2
  },
  {
    id: 'banner-demo-3',
    badgeBn: '',
    badgeEn: '',
    titleBn: '',
    titleEn: '',
    subtitleBn: '',
    subtitleEn: '',
    imageUrl: 'https://i.postimg.cc/63WcpjbX/Picture-2026-11-12-12-02-16.webp',
    linkUrl: '#',
    isActive: true,
    priority: 3
  }
];

export const initialNotifications: NotificationItem[] = [];

export const initialFooterConfig: FooterConfig = {
  store: {
    bn: 'স্টোর',
    en: 'Store',
    url: '#store',
    icon: '📍'
  },
  offer: {
    bn: 'অফার',
    en: 'Offer',
    url: '#offer',
    icon: '🏷️'
  },
  help: {
    bn: 'সাহায্য',
    en: 'Help',
    url: '#help',
    icon: '❓'
  }
};

export const initialStaffAccounts: StaffAccount[] = [
  {
    id: 'staff-1',
    name: 'কাজী রাজু আহমেদ',
    phone: '01777877207',
    role: 'প্রধান কালেকশন অফিসার',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    totalDue: 15000,
    totalCollected: 12000,
    remainingDue: 3000,
    notes: 'ইসলামপুর ক্যাবল জোন-১ কালেকশন ও অপটিক্যাল সাপোর্ট',
    createdAt: new Date().toISOString(),
    transactions: [
      {
        id: 'stx-1',
        staffId: 'staff-1',
        type: 'due',
        amount: 15000,
        date: '2026-10-25',
        time: '10:00 AM',
        note: 'ইসলামপুর দক্ষিণ ফিল্ড মান্থলি কালেকশন সিট ইস্যু',
        recordedBy: 'অ্যাডমিন',
        created: Date.now() - 500000000
      },
      {
        id: 'stx-2',
        staffId: 'staff-1',
        type: 'collection',
        amount: 12000,
        date: '2026-10-29',
        time: '04:30 PM',
        note: 'ক্যাশ জমা ক্যাশিয়ার কাউন্টার',
        recordedBy: 'অ্যাডমিন',
        created: Date.now() - 200000000
      }
    ]
  },
  {
    id: 'staff-2',
    name: 'মোঃ রফিকুল ইসলাম',
    phone: '01884542812',
    role: 'লাইন টেকনিশিয়ান ও সার্ভিস',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    totalDue: 8500,
    totalCollected: 7000,
    remainingDue: 1500,
    notes: 'জামালপুর রোড ড্রপ কেবল ও অনু রি-ইনস্টলেশন',
    createdAt: new Date().toISOString(),
    transactions: [
      {
        id: 'stx-3',
        staffId: 'staff-2',
        type: 'due',
        amount: 8500,
        date: '2026-10-26',
        time: '11:15 AM',
        note: 'ফাইবার রাউটার সেলস কালেকশন দায়িত্ব',
        recordedBy: 'অ্যাডমিন',
        created: Date.now() - 400000000
      },
      {
        id: 'stx-4',
        staffId: 'staff-2',
        type: 'collection',
        amount: 7000,
        date: '2026-10-30',
        time: '02:00 PM',
        note: 'বিকাশ মারফত কোম্পানি ফান্ডে জমা',
        recordedBy: 'অ্যাডমিন',
        created: Date.now() - 100000000
      }
    ]
  }
];

export const initialQuickHisabOwners: QuickHisabOwner[] = [
  { id: 'owner-1', name: 'মালিক ১', shareUnits: 1.0, phone: '01711000001', address: 'দত্তপাড়া, ইসলামপুর, জামালপুর', notes: 'প্রতিষ্ঠাতা অংশীদার' },
  { id: 'owner-2', name: 'মালিক ২', shareUnits: 1.0, phone: '01711000002', address: 'আনন্দ বাজার, ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-3', name: 'মালিক ৩', shareUnits: 1.0, phone: '01711000003', address: 'টানা ব্রীজ, ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-4', name: 'মালিক ৪', shareUnits: 1.0, phone: '01711000004', address: 'হাজী আবেদ আলী মার্কেট', notes: 'অংশীদার' },
  { id: 'owner-5', name: 'মালিক ৫', shareUnits: 1.0, phone: '01711000005', address: 'ইসলামপুর বাজার', notes: 'অংশীদার' },
  { id: 'owner-6', name: 'মালিক ৬', shareUnits: 1.0, phone: '01711000006', address: 'চর শিমুল চূড়া', notes: 'অংশীদার' },
  { id: 'owner-7', name: 'মালিক ৭', shareUnits: 1.0, phone: '01711000007', address: 'ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-8', name: 'মালিক ৮', shareUnits: 1.0, phone: '01711000008', address: 'দত্তপাড়া', notes: 'অংশীদার' },
  { id: 'owner-9', name: 'মালিক ৯', shareUnits: 1.0, phone: '01711000009', address: 'ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-10', name: 'মালিক ১০', shareUnits: 1.0, phone: '01711000010', address: 'জামালপুর সদর', notes: 'অংশীদার' },
  { id: 'owner-11', name: 'মালিক ১১', shareUnits: 1.0, phone: '01711000011', address: 'ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-12', name: 'মালিক ১২', shareUnits: 1.0, phone: '01711000012', address: 'ইসলামপুর', notes: 'অংশীদার' },
  { id: 'owner-13', name: 'মালিক ১৩ (অর্ধেক অংশীদার)', shareUnits: 0.5, phone: '01711000013', address: 'দত্তপাড়া আনন্দ বাজার', notes: '০.৫ শেয়ার অংশীদার', isHalf: true }
];
