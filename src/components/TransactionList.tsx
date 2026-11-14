import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  FilterX,
  Edit3,
  Trash2,
  Clock,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Language, Transaction, PaymentMethod, UserSession } from '../types';
import { 
  formatCurrency, 
  formatTransactionDate, 
  toBengaliNumber, 
  translations 
} from '../utils/formatters';
import { sounds } from '../utils/audio';
import { canModifyTransaction, isSubAdmin as checkIsSubAdmin } from '../utils/permissions';

interface TransactionListProps {
  transactions: Transaction[];
  lang: Language;
  user?: UserSession | null;
  onSelectTransaction: (trx: Transaction) => void;
  onEdit?: (trx: Transaction) => void;
  onDelete?: (trx: Transaction) => void;
  selectedMethodFilter?: PaymentMethod | null;
  onClearMethodFilter?: () => void;
  currentMonthIndex: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  lang,
  user,
  onSelectTransaction,
  onEdit,
  onDelete,
  selectedMethodFilter,
  onClearMethodFilter,
  currentMonthIndex,
  currentYear,
  onPrevMonth,
  onNextMonth
}) => {
  const t = translations[lang];
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isSubAdmin = checkIsSubAdmin(user);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!isSubAdmin) return;
    setNowMs(Date.now());
    const timer = setInterval(() => setNowMs(Date.now()), 15000);
    return () => clearInterval(timer);
  }, [isSubAdmin]);

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    sounds.playTap();
    onPrevMonth();
  };

  const handleNextMonth = () => {
    sounds.playTap();
    onNextMonth();
  };

  // Filter transactions
  const filteredList = transactions.filter((trx) => {
    if (trx.isDeleted) return false;

    // Filter by type
    if (filterType !== 'all' && trx.type !== filterType) return false;

    // Filter by selected method if active
    if (selectedMethodFilter && trx.method !== selectedMethodFilter) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchPerson = trx.person?.toLowerCase().includes(q);
      const matchPhone = trx.phone?.includes(q);
      const matchTrxId = trx.trxId?.toLowerCase().includes(q);
      const matchNote = trx.note?.toLowerCase().includes(q);
      const matchCategory = trx.category?.toLowerCase().includes(q);
      const matchMethod = trx.method?.toLowerCase().includes(q);
      if (!matchPerson && !matchPhone && !matchTrxId && !matchNote && !matchCategory && !matchMethod) {
        return false;
      }
    }

    // Filter by current month / year if not doing custom search
    const parts = (trx.date || '').split('-');
    if (parts.length >= 2) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      if (!searchQuery.trim() && (y !== currentYear || m !== currentMonthIndex)) {
        return false;
      }
    }

    return true;
  });

  // Sort transactions in ascending order (earlier entries 1st at top, newly added entries at bottom)
  const displayList = [...filteredList].sort((a, b) => {
    if (a.created && b.created) return a.created - b.created;
    return 0;
  });

  return (
    <div className="px-4 py-2 select-none">
      {isSubAdmin && (
        <div className="mb-2.5 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'bn'
                ? 'সাব-এডমিন: এখানে কেবল আপনার নিজ এন্ট্রিকৃত লেনদেন দেখানো হচ্ছে'
                : 'Sub-Admin: Showing only transactions added by you'}
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
            {lang === 'bn' ? '৩০ মিঃ এডিট/ডিলিট' : '30m Edit'}
          </span>
        </div>
      )}

      {/* Month Selector matching Capture.JPG */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <span className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
          {lang === 'bn'
            ? `${monthsBn[currentMonthIndex]} ${toBengaliNumber(currentYear)}`
            : `${monthsEn[currentMonthIndex]} ${currentYear}`}
        </span>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Filter Tabs matching Capture.JPG (All, In, Out) */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl mb-3">
        <button
          onClick={() => {
            sounds.playTap();
            setFilterType('all');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
            filterType === 'all'
              ? 'bg-[#E52E2E] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'সব (All)' : 'All'}
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setFilterType('income');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
            filterType === 'income'
              ? 'bg-[#E52E2E] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'ইন (In)' : 'In'}
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setFilterType('expense');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
            filterType === 'expense'
              ? 'bg-[#E52E2E] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          {lang === 'bn' ? 'আউট (Out)' : 'Out'}
        </button>
      </div>

      {/* Active Method Filter Chip if filtering by Channel */}
      {selectedMethodFilter && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs">
          <div className="flex items-center gap-1.5 text-[#E52E2E] dark:text-rose-400 font-bold">
            <span>{lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}</span>
            <span className="underline">{selectedMethodFilter}</span>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClearMethodFilter?.();
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#E52E2E]"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</span>
          </button>
        </div>
      )}



      {/* Search Input Bar matching Capture.JPG */}
      <div className="relative mb-3.5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'bn' ? 'নাম, মোবাইল বা ট্রানজেকশন আইডি খুঁজুন...' : 'Search name, mobile or Trx ID...'}
          className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Transactions Feed */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {displayList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm font-medium">{t.no_data}</p>
            <p className="text-xs mt-1">
              {lang === 'bn' 
                ? 'অন্য কোনো মাস নির্বাচন করুন অথবা ফিল্টার রিসেট করুন'
                : 'Select another month or reset filters'}
            </p>
          </div>
        ) : (
          displayList.map((trx) => {
            const isIncome = trx.type === 'income';
            const modCheck = canModifyTransaction(trx, user, nowMs);
            const minsLeft = modCheck.allowed && Number.isFinite(modCheck.remainingMs)
              ? Math.max(1, Math.ceil(modCheck.remainingMs / 60000))
              : 0;

            return (
              <div
                key={trx.id}
                onClick={() => {
                  sounds.playTap();
                  onSelectTransaction(trx);
                }}
                className="py-3.5 px-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl transition-all active:scale-[0.99] group"
              >
                {/* Left Side: Direction Arrow + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Arrow Icon in circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isIncome 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  {/* Title & Memo */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug truncate">
                        {trx.category || (isIncome ? (lang === 'bn' ? 'বিল কালেকশন' : 'Received Money') : (lang === 'bn' ? 'অফিস খরচ' : 'Expense'))}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                        {trx.method}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {trx.person || `#${trx.trxId}`}
                      </p>
                      {isSubAdmin && modCheck.allowed && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded-md border border-amber-200/70 dark:border-amber-900/50 shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{lang === 'bn' ? `${toBengaliNumber(minsLeft)} মিঃ` : `${minsLeft}m`}</span>
                        </span>
                      )}
                      {isSubAdmin && modCheck.expired && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{lang === 'bn' ? 'লক' : 'Locked'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Amount, Date, and Admin/Sub-Admin Edit/Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm font-extrabold tabular-nums leading-snug ${
                        isIncome 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-[#E52E2E] dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(trx.amount, lang)}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatTransactionDate(trx.date, trx.time, lang)}
                    </p>
                  </div>

                  {/* Admin or within-30m Sub-Admin Quick Action Buttons */}
                  {modCheck.allowed && onEdit && onDelete && (
                    <div className="flex items-center gap-1 pl-1 border-l border-slate-100 dark:border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          onEdit(trx);
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                        title="এডিট"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          onDelete(trx);
                        }}
                        className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-[#E52E2E] flex items-center justify-center transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
