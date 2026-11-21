import { AreaFilter, BillLang, BillServiceType } from './types';

export const ALL_MONTHS: string[] = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export const NET_BILL_LINKS: Record<string, string> = {
  জানুয়ারি: '',
  ফেব্রুয়ারি: '',
  মার্চ: '',
  এপ্রিল: 'https://docs.google.com/spreadsheets/d/1JzUL1DOA_ubXONu9PhpCfo9oKeFj__o4oCGeeksV-pA/export?format=xlsx',
  মে: 'https://docs.google.com/spreadsheets/d/1nSM8fZUwHxUSZQc88u8Oaquch21226fYaC9n85NV3G0/export?format=xlsx',
  জুন: 'https://docs.google.com/spreadsheets/d/1cPxErMlxd24-YJPN6mBmA-3xPUjG_Ql3lMXEL8dFPzY/export?format=xlsx',
  জুলাই: 'https://docs.google.com/spreadsheets/d/1LWGmlA0yJwh6v1hQhpx4RrFeFBb_zW51D3GPehme-7s/export?format=xlsx',
  আগস্ট: 'https://docs.google.com/spreadsheets/d/1gZoIiCAYhUZW5nSQCUb6OoNDiNY-087JafIQGr0JaZA/export?format=xlsx',
  সেপ্টেম্বর: 'https://docs.google.com/spreadsheets/d/13OcS4yagT4bQNlrY-NuG592QVw9-JxIqntDFVO1zNt8/export?format=xlsx',
  অক্টোবর: 'https://docs.google.com/spreadsheets/d/1BeTi5KkxDB9wLM7rclo131xLnMadt4BNU1hO-AkcAHw/export?format=xlsx',
  নভেম্বর: 'https://docs.google.com/spreadsheets/d/1tU_5ybOZR5Qk2ypcmTH0ET6f3mUxOtwSANYIrFgm1Ns/export?format=xlsx',
  ডিসেম্বর: ''
};

export const DIS_BILL_LINKS: Record<string, string> = {
  জানুয়ারি: '',
  ফেব্রুয়ারি: '',
  মার্চ: '',
  এপ্রিল: 'https://docs.google.com/spreadsheets/d/1FjkMU78ge41qPdHa40byxscAo7zJHMj-uB6M1jKGtQM/export?format=xlsx',
  মে: 'https://docs.google.com/spreadsheets/d/1ai1RicItkQIl4_hpOhpP-olKc5FZLLrwLSKbYVFaS-M/export?format=xlsx',
  জুন: 'https://docs.google.com/spreadsheets/d/186olqasPT2CV0Feqs4OUOsdkbWSsA6is6E-faFNVqxI/export?format=xlsx',
  জুলাই: 'https://docs.google.com/spreadsheets/d/1Kzz2ac6SbeJgUyanm8YRVHKmMD3Cux-PfOSIsvurzAk/export?format=xlsx',
  আগস্ট: 'https://docs.google.com/spreadsheets/d/1h8v6TiQJeberx9R6VGTcQu7t6LiudOKrBS9WVqA2cZ0/export?format=xlsx',
  সেপ্টেম্বর: 'https://docs.google.com/spreadsheets/d/1XntdO25UdT-40zJcPSONY_pVYborJiQ4YCBYjMM_8uE/export?format=xlsx',
  অক্টোবর: 'https://docs.google.com/spreadsheets/d/1EFOy9pKsVnB7Nfkdn9bkUNtClE1mn3Cw16ycg1__f4I/export?format=xlsx',
  নভেম্বর: '',
  ডিসেম্বর: ''
};

export const NET_CONN_LINKS: Record<string, string> = {
  মে: 'https://docs.google.com/spreadsheets/d/16bT82iDAlejCN86k2PXGzuDdojeLLKgICFVKybNIWJc/export?format=xlsx',
  জুন: 'https://docs.google.com/spreadsheets/d/1MzoMhmIY3PGwIzzJ3Dif7FyNs_sHDXCYAu9oS7SKMtk/export?format=xlsx',
  জুলাই: 'https://docs.google.com/spreadsheets/d/1eWAu9sMK8vrDlV3Ue35jYY6rfNVM0EOE43ecdZtY0yc/export?format=xlsx',
  আগস্ট: 'https://docs.google.com/spreadsheets/d/144Km2kNlKpSdyQh9O1Q7BaIDf7bwOTGubTazHWMGPL0/export?format=xlsx',
  সেপ্টেম্বর: 'https://docs.google.com/spreadsheets/d/1xL-oLgzRaGB-t4xd_AiVyGE42VkovVHYVr3gwa_sws0/export?format=xlsx',
  অক্টোবর: 'https://docs.google.com/spreadsheets/d/1j4KCcQpVO2jsMWPgEaxilQgxXELIv7FDlwUDoa-8UH4/export?format=xlsx',
  নভেম্বর: 'https://docs.google.com/spreadsheets/d/1qZk86u3nFnMv3LPs8XTRADCkVyxlUB7gbP_ik08TDdo/export?format=xlsx'
};

export const DUE_BILL_LINKS: Record<string, string> = {
  জুলাই: 'https://docs.google.com/spreadsheets/d/1AWUhQdWBluPN3kGhG0jsLo224Qc0hst7DvM0PYwFVak/export?format=xlsx',
  আগস্ট: 'https://docs.google.com/spreadsheets/d/14uKbaHXq_Apreon8sKQVTbqSmQmvIn69Sh7idTqA0yI/export?format=xlsx',
  সেপ্টেম্বর: 'https://docs.google.com/spreadsheets/d/1GJKWaWknUISnk0g_yXq9WoeJo86Pni6U6biZr7zWwaU/export?format=xlsx',
  অক্টোবর: 'https://docs.google.com/spreadsheets/d/1rGLnOjC51iftP-Y9nIk5E3iv_4K0rT1WTy5yCbd-Dj4/export?format=xlsx'
};

export function getActiveSheetLink(netType: BillServiceType | string, month: string): string {
  if (netType === 'নেট বিল') return NET_BILL_LINKS[month] || '';
  if (netType === 'ডিস বিল') return DIS_BILL_LINKS[month] || '';
  if (netType === 'নেট সংযোগ') return NET_CONN_LINKS[month] || '';
  if (netType === 'বকেয়া বিল') return DUE_BILL_LINKS[month] || '';
  return '';
}

export const AREAS: Record<Exclude<AreaFilter, 'all'>, string[]> = {
  area1: [
    'চর শিমুল চূড়া',
    'সরকার বাড়ী',
    'বলিদে পাড়া',
    'নবীন নগর',
    'বালুঘাট',
    'কেরানী বাড়ী',
    'আমেদ বাড়ী',
    'কৃষ্ণচূড়া',
    'আকন্দ পাড়া',
    'চাংপাড়া',
    'কান্দা পাড়া',
    'কান্দাপাড়া',
    'ব্যাংতলা',
    'বাকশাবাড়ী',
    'দহের পাড়',
    'ইজারা পাড়া',
    'দষ্টিপাড়া',
    'ভেলুয়া',
    'লক্ষ্মিডাংরী',
    'লক্ষীডাংরী',
    'চকবন্দী',
    'কক্সবাজার'
  ],
  area2: [
    'উত্তর পাড়া',
    'দক্ষিণ পাড়া',
    'টানা ব্রীজ বাজার',
    'দত্তপাড়া',
    'ফুলকার চর',
    'কড়ইতলা',
    'মোল্লা বাজার',
    'পেচার চর',
    'চন্দনপুর'
  ]
};

export const I18N: Record<
  BillLang,
  {
    headerTitle: string;
    headerSubtitle: string;
    dashboard: string;
    allBills: string;
    paidBills: string;
    dueBills: string;
    totalBills: string;
    paidAmount: string;
    dueAmount: string;
    export: string;
    refresh: string;
    noticeBadge: string;
    chartTrend: string;
    chartTrendSub: string;
    chartPaidDue: string;
    chartPaidDueSub: string;
    chartMonthly: string;
    chartMonthlySub: string;
    recentTx: string;
    recentTxSub: string;
    records: string;
    searchPlaceholder: string;
    tabAll: string;
    tabPaid: string;
    tabDue: string;
    thSl: string;
    thId: string;
    thName: string;
    thPaid: string;
    thDue: string;
    thTotal: string;
    thMobile: string;
    thDate: string;
    thAddress: string;
    thStatus: string;
    modalHeader: string;
    btnPrint: string;
    btnClose: string;
    btnSms: string;
    langToggle: string;
    backHome: string;
  }
> = {
  bn: {
    headerTitle: 'বিল ম্যানেজার',
    headerSubtitle: 'স্মার্ট বিল ব্যবস্থাপনা সিস্টেম',
    dashboard: 'ড্যাশবোর্ড',
    allBills: 'সকল বিল',
    paidBills: 'পরিশোধিত',
    dueBills: 'বকেয়া',
    totalBills: 'সর্বমোট পরিমাণ',
    paidAmount: 'পরিশোধিত টাকা',
    dueAmount: 'বকেয়া টাকা',
    export: 'এক্সপোর্ট',
    refresh: 'রিফ্রেশ',
    noticeBadge: '📢 নোটিশ',
    chartTrend: '📈 গত ৭ দিনের কালেকশন ট্রেন্ড',
    chartTrendSub: 'দৈনিক বিল সংগ্রহ বিশ্লেষণ',
    chartPaidDue: '🥧 পরিশোধিত বনাম বকেয়া',
    chartPaidDueSub: 'আদায় অনুপাত',
    chartMonthly: '📊 মাসভিত্তিক আয় (নেট বিল + ডিস বিল)',
    chartMonthlySub: 'সকল মাসের সমন্বিত বিল সংগ্রহ বিশ্লেষণ',
    recentTx: '🔄 সাম্প্রতিক লেনদেন',
    recentTxSub: 'সর্বশেষ পরিশোধিত বিলের তালিকা',
    records: 'টি রেকর্ড',
    searchPlaceholder: 'গ্রাহকের নাম, মোবাইল, আইডি বা ঠিকানা দিয়ে খুঁজুন...',
    tabAll: 'সকল',
    tabPaid: 'পরিশোধিত',
    tabDue: 'বকেয়া',
    thSl: 'ক্রমিক',
    thId: 'আইডি',
    thName: 'গ্রাহকের নাম',
    thPaid: 'পরিশোধিত',
    thDue: 'বকেয়া',
    thTotal: 'সর্বমোট',
    thMobile: 'মোবাইল',
    thDate: 'তারিখ',
    thAddress: 'ঠিকানা',
    thStatus: 'স্ট্যাটাস',
    modalHeader: '📄 বিলের বিস্তারিত বিবরণ',
    btnPrint: '🖨️ রসিদ প্রিন্ট',
    btnClose: 'বন্ধ করুন',
    btnSms: '📱 বকেয়া তাগাদা এসএমএস পাঠান',
    langToggle: '🇧🇩 বাংলা',
    backHome: 'হোম'
  },
  en: {
    headerTitle: 'Bill Manager',
    headerSubtitle: 'Smart Billing Management System',
    dashboard: 'Dashboard',
    allBills: 'All Bills',
    paidBills: 'Paid Bills',
    dueBills: 'Due Bills',
    totalBills: 'Grand Total',
    paidAmount: 'Paid Amount',
    dueAmount: 'Due Amount',
    export: 'Export',
    refresh: 'Refresh',
    noticeBadge: '📢 Notice',
    chartTrend: '📈 Last 7 Days Trend',
    chartTrendSub: 'Daily collection analytics',
    chartPaidDue: '🥧 Paid vs Due',
    chartPaidDueSub: 'Collection Ratio',
    chartMonthly: '📊 Monthly Revenue (Net + Dish Bill)',
    chartMonthlySub: 'All-months aggregated billing collection',
    recentTx: '🔄 Recent Transactions',
    recentTxSub: 'Latest processed billing records',
    records: 'records',
    searchPlaceholder: 'Search by customer name, mobile, ID or address...',
    tabAll: 'All',
    tabPaid: 'Paid',
    tabDue: 'Due',
    thSl: 'SL',
    thId: 'ID',
    thName: 'Customer Name',
    thPaid: 'Paid',
    thDue: 'Due',
    thTotal: 'Total',
    thMobile: 'Mobile',
    thDate: 'Date',
    thAddress: 'Address',
    thStatus: 'Status',
    modalHeader: '📄 Customer Bill Details',
    btnPrint: '🖨️ Print Receipt',
    btnClose: 'Close',
    btnSms: '📱 Send Due Reminder SMS',
    langToggle: '🇬🇧 English',
    backHome: 'Home'
  }
};

export interface PromoSlide {
  id: string;
  slideClass: string;
  action: 'due' | 'all' | 'trend';
  tag: string;
  liveBadge: string;
  title: string;
  ticketText: string;
  ticketIcon: string;
  condition: string;
  iconType: 'bolt' | 'refresh' | 'calendar' | 'sms' | 'rocket';
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'slide-1',
    slideClass: 'bkash-slide-1',
    action: 'due',
    tag: 'বিল কালেকশন',
    liveBadge: '⚡ জরুরি',
    title: 'বকেয়া বিল দ্রুত আদায় করুন!',
    ticketText: 'বকেয়া গ্রাহকদের তালিকা',
    ticketIcon: '➔',
    condition: '*বকেয়া মুক্ত রাখুন',
    iconType: 'bolt'
  },
  {
    id: 'slide-2',
    slideClass: 'bkash-slide-2',
    action: 'due',
    tag: 'বকেয়া রিমাইন্ডার',
    liveBadge: '🔄 ক্লিয়ার',
    title: 'গত মাসের বকেয়া আদায় করুন!',
    ticketText: 'আগের মাসের বকেয়া ক্লিয়ার',
    ticketIcon: '📋',
    condition: '*হিসাব স্বচ্ছ রাখুন',
    iconType: 'refresh'
  },
  {
    id: 'slide-3',
    slideClass: 'bkash-slide-3',
    action: 'all',
    tag: 'চলতি মাসের বিল',
    liveBadge: '📅 লাইভ',
    title: 'বর্তমান মাসের বিলের লাইভ হিসাব!',
    ticketText: 'চলতি মাসের কালেকশন',
    ticketIcon: '💹',
    condition: '*রিয়েল-টাইম আপডেট',
    iconType: 'calendar'
  },
  {
    id: 'slide-4',
    slideClass: 'bkash-slide-4',
    action: 'due',
    tag: 'স্মার্ট এসএমএস',
    liveBadge: '📱 অটো',
    title: 'গ্রাহকদের তাগাদা এসএমএস দিন!',
    ticketText: 'ডিজিটাল রসিদ ও রিমাইন্ডার',
    ticketIcon: '✉️',
    condition: '*দ্রুত আদায় নিশ্চিত',
    iconType: 'sms'
  },
  {
    id: 'slide-5',
    slideClass: 'bkash-slide-5',
    action: 'trend',
    tag: 'অ্যানালিটিক্স',
    liveBadge: '🚀 গ্রোথ',
    title: 'সময়মতো আদায় ও লাইন সচল রাখুন!',
    ticketText: 'কালেকশন ট্রেন্ড অ্যানালাইসিস',
    ticketIcon: '📈',
    condition: '*উন্নত ইন্টারনেট সেবা',
    iconType: 'rocket'
  }
];
