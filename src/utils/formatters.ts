import { Language } from '../types';

export const BN_DIGITS: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const EN_DIGITS: { [key: string]: string } = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export function toBengaliNumber(val: number | string): string {
  const str = String(val ?? '');
  return str.replace(/[0-9]/g, d => BN_DIGITS[d] || d);
}

export function toEnglishNumber(val: string): string {
  return String(val ?? '').replace(/[০-৯]/g, d => EN_DIGITS[d] || d);
}

export function formatCurrency(amount: number, lang: Language): string {
  const formatted = Math.abs(amount).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return `৳ ${formatted}`;
}

export function formatTransactionDate(dateStr: string, timeStr: string, lang: Language): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parts[2];

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (lang === 'bn') {
    const d = toBengaliNumber(parseInt(day, 10));
    const m = monthsBn[monthIdx] || '';
    const t = toBengaliNumber(timeStr || '');
    return `${m} ${d}${t ? `, ${t}` : ''}`;
  }

  const d = parseInt(day, 10);
  const m = monthsEn[monthIdx] || '';
  return `${m} ${d}${timeStr ? `, ${timeStr}` : ''}`;
}

export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (lang === 'bn') {
    if (hour >= 5 && hour < 12) return 'শুভ সকাল';
    if (hour >= 12 && hour < 17) return 'শুভ অপরাহ্ন';
    if (hour >= 17 && hour < 20) return 'শুভ সন্ধ্যা';
    return 'শুভ রাত্রি';
  }
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 20) return 'Good Evening';
  return 'Good Night';
}

export const translations = {
  bn: {
    app_name: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক',
    app_tagline: 'স্মার্ট ক্যাবল নেটওয়ার্ক ও হিসাব খাতা',
    account_number: 'অ্যাকাউন্ট নাম্বার / মোবাইল',
    pin_number: 'পিন নাম্বার',
    pin_placeholder: '••••••',
    forgot_pin: 'পিন নাম্বার ভুলে গিয়েছেন? পিন রিসেট করুন',
    login_btn: 'লগ ইন',
    visitor_prompt: 'হিসাব দেখতে চান?',
    visitor_action: 'ভিজিটর হিসেবে প্রবেশ করুন',
    tap_to_check_balance: 'ব্যালেন্স জানতে ট্যাপ করুন',
    tap_to_hide_balance: 'ট্যাপ করে ব্যালেন্স লুকান',
    all_transactions: 'সব লেনদেন',
    transactions: 'লেনদেন',
    services: 'সার্ভিস সমূহ',
    quick_channels: 'পেমেন্ট চ্যানেল ব্যালেন্স',
    in_btn: 'ইন',
    out_btn: 'আউট',
    all_btn: 'সব',
    income_entry: 'জমা এন্ট্রি',
    expense_entry: 'খরচ এন্ট্রি',
    add_customer: 'গ্রাহক যুক্ত',
    packages: 'ক্যাবল প্যাকেজ',
    bill_collection: 'বিল কালেকশন',
    channel_bill: 'চ্যানেল বিল পে',
    accounting_book: 'হিসাব খাতা',
    qr_payment: 'মার্চেন্ট পে',
    search_placeholder: 'নাম, মোবাইল বা লেনদেন আইডি খুঁজুন...',
    no_data: 'কোনো লেনদেন পাওয়া যায়নি',
    account_no: 'অ্যাকাউন্ট নং',
    amount: 'পরিমাণ',
    trx_id: 'ট্রানজেকশন আইডি',
    date_time: 'দিন ও সময়',
    call_btn: 'কল',
    sms_btn: 'এসএমএস',
    share_btn: 'শেয়ার করুন',
    receipt_btn: 'রশিদ দেখুন',
    edit_btn: 'এডিট',
    delete_btn: 'মুছুন',
    home: 'হোম',
    contacts: 'গ্রাহক তালিকা',
    my_account: 'আমার অ্যাকাউন্ট',
    settings: 'সেটিংস',
    dark_mode: 'ডার্ক মোড',
    virtual_card: 'ভার্চুয়াল কার্ড নম্বর',
    general: 'সাধারণ',
    language: 'ভাষা',
    account_type: 'অ্যাকাউন্টের ধরন',
    islamic: 'ইসলামিক',
    regular: 'সাধারণ',
    want_profit: 'মুনাফা পেতে চাই',
    yes: 'হ্যাঁ',
    no: 'না',
    change_pin: 'পিন পরিবর্তন',
    recycle_bin: 'রিসাইকেল বিন',
    audit_log: 'অডিট লগ',
    customize_footer: 'লগইন ফুটার কাস্টমাইজ',
    logout: 'লগআউট',
    new_income_title: 'নতুন জমা / বিল কালেকশন',
    new_expense_title: 'নতুন খরচ এন্ট্রি',
    save_btn: 'সংরক্ষণ করুন',
    cancel_btn: 'বাতিল',
    date: 'তারিখ',
    method: 'মাধ্যম',
    amount_tk: 'টাকার পরিমাণ (৳)',
    person_name: 'গ্রাহক / ব্যক্তির নাম',
    phone_label: 'মোবাইল নম্বর',
    note: 'বিবরণ / মন্তব্য',
    scan_qr: 'কিউআর স্ক্যান করুন',
    my_qr: 'আমার কিউআর কোড',
    scan_info: 'যেকোনো কিউআর কোড স্ক্যান করে দ্রুত বিল সংগ্রহ বা ট্রান্সফার করুন',
    notifications: 'নোটিফিকেশন'
  },
  en: {
    app_name: 'Protasha Cable Network',
    app_tagline: 'Smart Cable Network & Ledger',
    account_number: 'Account Number / Mobile',
    pin_number: 'PIN Number',
    pin_placeholder: '••••••',
    forgot_pin: 'Forgot PIN? Reset PIN',
    login_btn: 'Log In',
    visitor_prompt: 'Want to view records?',
    visitor_action: 'Enter as Visitor',
    tap_to_check_balance: 'Tap to check balance',
    tap_to_hide_balance: 'Tap to hide balance',
    all_transactions: 'All Transactions',
    transactions: 'Transactions',
    services: 'All Services',
    quick_channels: 'Channel Balances',
    in_btn: 'In',
    out_btn: 'Out',
    all_btn: 'All',
    income_entry: 'Income Entry',
    expense_entry: 'Expense Entry',
    add_customer: 'Add Customer',
    packages: 'Cable Packages',
    bill_collection: 'Bill Collection',
    channel_bill: 'Channel Bills',
    accounting_book: 'General Ledger',
    qr_payment: 'Merchant Pay',
    search_placeholder: 'Search name, mobile or Trx ID...',
    no_data: 'No transactions found',
    account_no: 'Account No',
    amount: 'Amount',
    trx_id: 'Transaction ID',
    date_time: 'Date & Time',
    call_btn: 'Call',
    sms_btn: 'SMS',
    share_btn: 'Share',
    receipt_btn: 'View Receipt',
    edit_btn: 'Edit',
    delete_btn: 'Delete',
    home: 'Home',
    contacts: 'Customers',
    my_account: 'My Account',
    settings: 'Settings',
    dark_mode: 'Dark Mode',
    virtual_card: 'Virtual Card Number',
    general: 'General',
    language: 'Language',
    account_type: 'Account Type',
    islamic: 'Islamic',
    regular: 'General',
    want_profit: 'Opt for Profit',
    yes: 'Yes',
    no: 'No',
    change_pin: 'Change PIN',
    recycle_bin: 'Recycle Bin',
    audit_log: 'Audit Log',
    customize_footer: 'Customize Login Footer',
    logout: 'Logout',
    new_income_title: 'New Income / Bill Collection',
    new_expense_title: 'New Expense Entry',
    save_btn: 'Save Record',
    cancel_btn: 'Cancel',
    date: 'Date',
    method: 'Method',
    amount_tk: 'Amount (৳)',
    person_name: 'Customer / Person Name',
    phone_label: 'Mobile Number',
    note: 'Description / Note',
    scan_qr: 'Scan QR Code',
    my_qr: 'My QR Code',
    scan_info: 'Scan customer QR or display your collection barcode',
    notifications: 'Notifications'
  }
};
