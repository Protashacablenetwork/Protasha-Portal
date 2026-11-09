import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  Share2, 
  Trash2, 
  Edit3, 
  Receipt, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { Language, Transaction, UserSession } from '../types';
import { 
  formatCurrency, 
  formatTransactionDate, 
  toBengaliNumber, 
  translations 
} from '../utils/formatters';
import { sounds } from '../utils/audio';

interface TransactionDetailPageProps {
  transaction: Transaction;
  lang: Language;
  user: UserSession | null;
  onBack: () => void;
  onEdit: (trx: Transaction) => void;
  onDelete: (trx: Transaction) => void;
  onViewReceipt: (trx: Transaction) => void;
  onOpenLogin: () => void;
}

export const TransactionDetailPage: React.FC<TransactionDetailPageProps> = ({
  transaction,
  lang,
  user,
  onBack,
  onEdit,
  onDelete,
  onViewReceipt,
  onOpenLogin
}) => {
  const [copiedId, setCopiedId] = React.useState(false);
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const t = translations[lang];
  const isIncome = transaction.type === 'income';
  const isAdmin = user?.role === 'admin';

  const handleCopyTrxId = () => {
    sounds.playTap();
    navigator.clipboard?.writeText(transaction.trxId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPhone = () => {
    if (!transaction.phone) return;
    sounds.playTap();
    navigator.clipboard?.writeText(transaction.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCall = () => {
    sounds.playTap();
    if (transaction.phone) {
      window.location.href = `tel:${transaction.phone}`;
    } else {
      alert(lang === 'bn' ? 'ফোন নম্বর সংযুক্ত নেই' : 'No phone number linked');
    }
  };

  const handleSms = () => {
    sounds.playTap();
    const message = encodeURIComponent(
      `প্রত্যাশা ক্যাবল নেটওয়ার্ক: আপনার ট্রানজেকশন #${transaction.trxId}, পরিমাণ ${formatCurrency(transaction.amount, lang)} সংরক্ষিত রয়েছে। ধন্যবাদ!`
    );
    if (transaction.phone) {
      window.location.href = `sms:${transaction.phone}?body=${message}`;
    } else {
      navigator.clipboard?.writeText(decodeURIComponent(message));
      alert(lang === 'bn' ? 'এসএমএস টেক্সট ক্লিপবোর্ডে কপি হয়েছে' : 'SMS text copied');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in fade-in duration-200">
      {/* Top App Bar with Back Button */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <button
          onClick={() => {
            sounds.playTap();
            onBack();
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-sm font-bold text-slate-900 dark:text-white">
          {lang === 'bn' ? 'লেনদেন বিবরণ ও রশিদ' : 'Transaction Details'}
        </h1>

        <button
          onClick={() => {
            sounds.playTap();
            onViewReceipt(transaction);
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#E52E2E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all"
          title={lang === 'bn' ? 'ডিজিটাল রশিদ' : 'Receipt'}
        >
          <Receipt className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Main Page Content */}
      <div className="flex-1 px-4 py-4 space-y-4 pb-28 max-w-md mx-auto w-full">
        {/* Hero Card */}
        <div
          className={`p-5 rounded-3xl border shadow-md relative overflow-hidden ${
            isIncome
              ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-900/60'
              : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-200 dark:border-rose-900/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isIncome
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E52E2E] text-white'
                }`}
              >
                {isIncome ? (
                  <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${
                    isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#E52E2E] dark:text-rose-400'
                  }`}
                >
                  {isIncome ? (lang === 'bn' ? 'জমা এন্ট্রি' : 'Income Entry') : (lang === 'bn' ? 'খরচ এন্ট্রি' : 'Expense Entry')}
                </span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {transaction.category || (isIncome ? 'বিল কালেকশন' : 'অফিস খরচ')}
                </h3>
              </div>
            </div>

            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'সফল' : 'Success'}</span>
            </span>
          </div>

          {/* Amount Display */}
          <div className="text-center my-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              {lang === 'bn' ? 'মোট লেনদেনের পরিমাণ' : 'Total Amount'}
            </span>
            <h2
              className={`text-3xl font-extrabold tracking-tight tabular-nums ${
                isIncome
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-[#E52E2E] dark:text-rose-500'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, lang)}
            </h2>
          </div>

          {/* Payment Method Badge */}
          <div className="flex justify-center mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <span>মাধ্যম:</span>
              <span className="text-[#E52E2E] dark:text-rose-400 font-extrabold">
                {transaction.method}
                {transaction.bankName ? ` (${transaction.bankName})` : ''}
              </span>
            </span>
          </div>
        </div>

        {/* 4-Box Key Metrics Grid (Matching Screenshot 6) */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {/* Top Row: Account & Amount */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
            <div className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {t.account_no}
              </span>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums truncate">
                  {transaction.phone || (lang === 'bn' ? 'ক্যাবল সংযোগ' : 'Cable Account')}
                </p>
                {transaction.phone && (
                  <button
                    onClick={handleCopyPhone}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="কপি করুন"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {t.amount}
              </span>
              <p
                className={`text-sm font-extrabold tabular-nums ${
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-[#E52E2E] dark:text-rose-400'
                }`}
              >
                {formatCurrency(transaction.amount, lang)}
              </p>
            </div>
          </div>

          {/* Bottom Row: Trx ID & Date/Time */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
            <div className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {t.trx_id}
              </span>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate font-mono">
                  {transaction.trxId}
                </p>
                <button
                  onClick={handleCopyTrxId}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                  title="কপি করুন"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {t.date_time}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {formatTransactionDate(transaction.date, transaction.time, lang)}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information Rows */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800">
            {lang === 'bn' ? 'বিস্তারিত তথ্য' : 'Information'}
          </h4>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'গ্রাহক / প্রেরক / প্রাপক:' : 'Person / Customer:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {transaction.person || '—'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'লেনদেনের মাধ্যম:' : 'Payment Channel:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {transaction.method}
            </span>
          </div>

          {transaction.bankName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {lang === 'bn' ? 'ব্যাংকের নাম:' : 'Bank Name:'}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {transaction.bankName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'ক্যাটাগরি:' : 'Category:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {transaction.category}
            </span>
          </div>

          {transaction.note && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {lang === 'bn' ? 'রেফারেন্স / নোট:' : 'Remarks / Note:'}
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {transaction.note}
              </p>
            </div>
          )}
        </div>

        {/* Communication Buttons (Call & SMS) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCall}
            className="h-12 rounded-2xl border-2 border-slate-900 dark:border-slate-200 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 stroke-[2]" />
            <span>{t.call_btn} (ফোন করুন)</span>
          </button>

          <button
            onClick={handleSms}
            className="h-12 rounded-2xl border-2 border-slate-900 dark:border-slate-200 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
            <span>{t.sms_btn} (এসএমএস)</span>
          </button>
        </div>

        {/* View & Print Digital Receipt */}
        <button
          onClick={() => {
            sounds.playTap();
            onViewReceipt(transaction);
          }}
          className="w-full h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#E52E2E] text-[#E52E2E] dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-98 transition-all shadow-xs"
        >
          <Receipt className="w-4 h-4 stroke-[2]" />
          <span>{lang === 'bn' ? '🧾 ডিজিটাল ক্যাশমেমো / থার্মাল রশিদ প্রিন্ট' : 'View POS Receipt Slip'}</span>
        </button>

        {/* Admin Controls Section */}
        {isAdmin ? (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-950 shadow-md space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E52E2E]">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অ্যাডমিন ক্ষমতা (এডিট ও ডিলিট)' : 'Admin Controls'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  sounds.playTap();
                  onEdit(transaction);
                }}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                <span>{lang === 'bn' ? '✏️ এন্ট্রি এডিট করুন' : 'Edit Entry'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onDelete(transaction);
                }}
                className="h-12 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'bn' ? '🗑️ ডিলিট করুন' : 'Delete Entry'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{lang === 'bn' ? 'এন্ট্রি এডিট বা ডিলিট করতে অ্যাডমিন লগইন প্রয়োজন' : 'Admin login required to edit/delete'}</span>
            </div>
            <button
              onClick={() => {
                sounds.playTap();
                onOpenLogin();
              }}
              className="px-3 py-1 rounded-xl bg-[#E52E2E] text-white font-bold text-[11px] shrink-0 hover:bg-rose-700 shadow-2xs"
            >
              {lang === 'bn' ? 'লগইন' : 'Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
