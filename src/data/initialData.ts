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

export const initialTransactions: Transaction[] = [
  {
    id: 'txn-init-1',
    trxId: 'TRX8829104',
    type: 'income',
    method: 'ক্যাশ',
    amount: 18500,
    person: 'ইসলামপুর বাজার গ্রাহকবৃন্দ',
    phone: '01777877207',
    date: '2026-11-01',
    time: '10:30 AM',
    note: 'মাসিক অপটিক্যাল ফাইবার বিল কালেকশন (ইসলামপুর বাজার জোন)',
    category: 'মাসিক ইন্টারনেট বিল',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793529000000
  },
  {
    id: 'txn-init-2',
    trxId: 'TRX8829105',
    type: 'income',
    method: 'বিকাশ',
    amount: 7500,
    person: 'নতুন গ্রাহক সংযোগ (৫ জন)',
    phone: '01884542812',
    date: '2026-11-02',
    time: '11:45 AM',
    note: 'নতুন ফাইবার অপটিক ড্রপ লাইন ও ইনস্টলেশন ফি',
    category: 'নতুন সংযোগ ফি',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793615400000
  },
  {
    id: 'txn-init-3',
    trxId: 'TRX8829106',
    type: 'income',
    method: 'নগদ',
    amount: 5400,
    person: 'রাউটার সেলস কাউন্টার',
    phone: '01712345678',
    date: '2026-11-03',
    time: '02:15 PM',
    note: 'ডুয়াল ব্যান্ড গিগাবিট ওয়াইফাই রাউটার বিক্রি (৩ টি)',
    category: 'যন্ত্রপাতি বিক্রি',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793701800000
  },
  {
    id: 'txn-init-4',
    trxId: 'TRX8829107',
    type: 'expense',
    method: 'ব্যাংক',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ',
    amount: 12000,
    person: 'আপস্ট্রিম ব্যান্ডউইথ প্রোভাইডার',
    phone: '01911002233',
    date: '2026-11-04',
    time: '03:00 PM',
    note: 'মেইন আপস্ট্রিম ডেডিকেটেড ফাইবার ব্যান্ডউইথ ফি পরিশোধ',
    category: 'ব্যান্ডউইথ খরচ',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793788200000
  },
  {
    id: 'txn-init-5',
    trxId: 'TRX8829108',
    type: 'expense',
    method: 'ক্যাশ',
    amount: 4500,
    person: 'অপটিক্যাল ফাইবার স্টোর',
    phone: '01722334455',
    date: '2026-11-05',
    time: '04:30 PM',
    note: 'ফাইবার কোর কেবল ড্রপ ওয়্যার ও স্প্লাইসিং স্লিভ ক্রয়',
    category: 'তার ও সরঞ্জাম ক্রয়',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793874600000
  },
  {
    id: 'txn-init-6',
    trxId: 'TRX8829109',
    type: 'income',
    method: 'বিকাশ',
    amount: 14200,
    person: 'রেলগেট ও কলেজ রোড গ্রাহকবৃন্দ',
    phone: '01777877207',
    date: '2026-11-06',
    time: '12:20 PM',
    note: 'ব্রডব্যান্ড ইন্টারনেট মাসিক বিল কালেকশন',
    category: 'মাসিক ইন্টারনেট বিল',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1793961000000
  },
  {
    id: 'txn-init-7',
    trxId: 'TRX8829110',
    type: 'expense',
    method: 'ক্যাশ',
    amount: 2200,
    person: 'সার্ভার রুম পাওয়ার মেইনটেন্যান্স',
    phone: '01733445566',
    date: '2026-11-07',
    time: '05:00 PM',
    note: 'সার্ভার রুম অনলাইন ইউপিএস ব্যাটারি ও কুলিং ফ্যান সার্ভিসিং',
    category: 'মেইনটেন্যান্স খরচ',
    recordedBy: 'প্রত্যাশা অ্যাডমিন',
    created: 1794047400000
  }
];

export const initialBanners: BannerAd[] = [
  {
    id: 'banner-broadband-1',
    titleBn: 'সুপারফাস্ট ফাইবার অপটিক ইন্টারনেট সংযোগ',
    titleEn: 'Superfast Optical Fiber Broadband Internet',
    subtitleBn: 'বাফারিংহীন ইউটিউব, ফেসবুক ও ৪K আল্ট্রা এইচডি ভিডিও স্ট্রিমিং',
    subtitleEn: 'Bufferless YouTube, Facebook and 4K Ultra HD video streaming',
    badgeBn: '৫০ Mbps প্যাকেজ',
    badgeEn: '50 Mbps Package',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
    linkUrl: '#offer',
    isActive: true,
    priority: 1
  },
  {
    id: 'banner-broadband-2',
    titleBn: 'নতুন সংযোগে ফ্রি ডুয়াল-ব্যান্ড গিগাবিট রাউটার!',
    titleEn: 'Free Dual-Band Gigabit Router on New Connection!',
    subtitleBn: 'বিনা খরচে অপটিক্যাল ফাইবার ওয়্যারিং ও ইনস্টলেশন সুবিধা',
    subtitleEn: 'Free optical fiber line setup and home installation',
    badgeBn: 'ফ্রি রাউটার অফার',
    badgeEn: 'Free Router Offer',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    linkUrl: '#offer',
    isActive: true,
    priority: 2
  },
  {
    id: 'banner-broadband-3',
    titleBn: 'ফ্রিল্যান্সিং ও অনলাইন গেমিংয়ে জিরো ল্যাগ পিং',
    titleEn: 'Dedicated Low-Latency Bandwidth for Gamers & Freelancers',
    subtitleBn: 'ডেডিকেটেড রিয়েল আইপি ও নিরবচ্ছিন্ন আল্ট্রা ফাস্ট আপলোড স্পিড',
    subtitleEn: 'Dedicated real IP with ultra-fast upload speed and zero latency',
    badgeBn: 'গেমিং ও ফ্রিল্যান্সিং',
    badgeEn: 'Gaming & Work',
    imageUrl: 'https://images.unsplash.com/photo-1520869562399-e772f142f422?auto=format&fit=crop&w=1000&q=80',
    linkUrl: '#portal:bill-manager',
    isActive: true,
    priority: 3
  },
  {
    id: 'banner-broadband-4',
    titleBn: 'আনলিমিটেড হোম ও কর্পোরেট ব্রডব্যান্ড ওয়াইফাই',
    titleEn: 'Unlimited Home & Office Broadband Wi-Fi',
    subtitleBn: 'কোনো ফেয়ার ইউসেজ লিমিট (FUP) নেই, ১০০% আনলিমিটেড ব্যবহার',
    subtitleEn: 'No FUP or data caps, 100% truly unlimited high-speed browsing',
    badgeBn: '১০০% আনলিমিটেড',
    badgeEn: '100% Unlimited',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1000&q=80',
    linkUrl: '#store',
    isActive: true,
    priority: 4
  },
  {
    id: 'banner-broadband-5',
    titleBn: '২৪/৭ সার্বক্ষণিক টেকনিক্যাল সাপোর্ট ও দ্রুত সেবা',
    titleEn: '24/7 Dedicated Technical Support & Instant Fiber Service',
    subtitleBn: 'ইসলামপুর ও জামালপুর অঞ্চলে যে কোনো সমস্যায় তাৎক্ষণিক সমাধান',
    subtitleEn: 'Instant problem resolution in Islampur & Jamalpur coverage areas',
    badgeBn: '২৪/৭ হেল্পলাইন',
    badgeEn: '24/7 Support',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    linkUrl: 'tel:01777877207',
    isActive: true,
    priority: 5
  },
  {
    id: 'banner-broadband-6',
    titleBn: 'বিকাশ ও নগদে মাসিক ইন্টারনেট বিল পরিশোধে ক্যাশব্যাক',
    titleEn: 'Instant Cashback on Monthly Bill Pay via bKash & Nagad',
    subtitleBn: 'ঘরে বসেই কয়েক সেকেন্ডে নিরাপদ ও দ্রুত ক্যাবল বিল জমা দিন',
    subtitleEn: 'Pay your monthly broadband cable bill instantly from home',
    badgeBn: 'ক্যাশব্যাক অফার',
    badgeEn: 'Cashback Offer',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
    linkUrl: '#category:bill',
    isActive: true,
    priority: 6
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
