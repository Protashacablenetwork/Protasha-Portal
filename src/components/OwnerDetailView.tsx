import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Phone,
  MapPin,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet
} from 'lucide-react';
import { Language, StaffAccount, UserSession } from '../types';
import { formatCurrency, formatSignedCurrency, toBengaliNumber } from '../utils/formatters';
import { getMonthBengaliName } from '../portals/ayByay/data/categories';
import { OwnerDividendBreakdown, recordOwnerDividendDeduction } from '../utils/ownerDueSync';
import { sounds } from '../utils/audio';

interface OwnerDetailViewProps {
  breakdown: OwnerDividendBreakdown;
  ownerIndex: number;
  totalShareUnits: number;
  netProfit: number;
  selectedMonth: string;
  lang: Language;
  isAdmin: boolean;
  user: UserSession | null;
  staffAccounts: StaffAccount[];
  onSaveStaffAccounts?: (updated: StaffAccount[]) => void;
  onEditOwner: () => void;
  onBack: () => void;
}

export const OwnerDetailView: React.FC<OwnerDetailViewProps> = ({
  breakdown,
  ownerIndex,
  totalShareUnits,
  netProfit,
  selectedMonth,
  lang,
  isAdmin,
  user,
  staffAccounts,
  onSaveStaffAccounts,
  onEditOwner,
  onBack
}) => {
  const isBn = lang === 'bn';
  const {
    owner,
    shareUnits,
    sharePercentage,
    isHalf,
    grossShare,
    matchedAccounts,
    totalDue,
    totalCollected,
    applicableCompanyDue,
    deductedAmount,
    netPayable,
    unpaidDueAfterDividend,
    transactions
  } = breakdown;

  const [isConfirmingSettle, setIsConfirmingSettle] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [settleMessage, setSettleMessage] = useState<string | null>(null);

  const monthLabel = isBn ? getMonthBengaliName(selectedMonth) : selectedMonth;
  const hasDue = applicableCompanyDue > 0;
  const hasDeduction = deductedAmount > 0;

  const alreadySettledThisMonth = transactions.some(
    (t) =>
      t.type === 'collection' &&
      (t.reference?.includes(selectedMonth) ||
        (t.note?.includes('লভ্যাংশ থেকে কর্তন') && t.date?.startsWith(selectedMonth)))
  );

  const renderAmount = (amount: number) => formatCurrency(amount, lang);

  const handleConfirmSettle = async () => {
    if (!isAdmin || isSettling || deductedAmount <= 0) return;
    setIsSettling(true);
    try {
      const { settledAmount } = await recordOwnerDividendDeduction({
        staffAccounts,
        matchedAccounts,
        amountToDeduct: deductedAmount,
        selectedMonth,
        monthLabel,
        ownerName: owner.name,
        user,
        onSaveStaffAccounts
      });
      if (settledAmount > 0) {
        sounds.playSuccess();
        setSettleMessage(
          isBn
            ? `${renderAmount(settledAmount)} কোম্পানি পাওনা থেকে সফলভাবে কর্তন ও সমন্বয় করা হয়েছে।`
            : `${renderAmount(settledAmount)} deducted and settled against company due.`
        );
      }
      setIsConfirmingSettle(false);
    } catch (err) {
      console.error('Owner dividend deduction settlement failed:', err);
      setSettleMessage(
        isBn ? 'পাওনা সমন্বয় সংরক্ষণ করা যায়নি, আবার চেষ্টা করুন।' : 'Could not save deduction.'
      );
    } finally {
      setIsSettling(false);
    }
  };

  const handlePrint = () => {
    sounds.playTap();
    try {
      window.print();
    } catch {}
  };

  // Precompute chronological running balance for matched ledger transactions
  let runningBalance = 0;
  const ledgerRows = transactions.map((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'due') {
      runningBalance += amt;
    } else {
      runningBalance -= amt;
    }
    return { tx, balanceAfter: runningBalance };
  });

  return (
    <div className="fixed inset-0 z-[55] bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 h-14 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            aria-label={isBn ? 'ফিরে যান' : 'Go Back'}
            className="min-w-[44px] min-h-[44px] -ml-1 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight">
              {owner.name}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isBn ? 'মালিকের বিস্তারিত ও লভ্যাংশ বিবরণী' : 'Owner Details & Dividend Statement'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{isBn ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onEditOwner();
              }}
              className="min-h-[40px] px-3 py-2 rounded-xl bg-[#E52E2E]/10 hover:bg-[#E52E2E]/20 text-[#E52E2E] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'এডিট' : 'Edit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-12">
        <div
          id="printable-owner-statement"
          className="max-w-3xl mx-auto space-y-4"
        >
          {/* Profile & Share Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {owner.avatarUrl ? (
                <img
                  src={owner.avatarUrl}
                  alt={owner.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${
                    isHalf
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white'
                  }`}
                >
                  {isBn ? toBengaliNumber(ownerIndex + 1) : ownerIndex + 1}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {owner.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1 flex-wrap">
                  <span
                    className={`font-bold ${
                      isHalf
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-indigo-700 dark:text-indigo-400'
                    }`}
                  >
                    {isHalf
                      ? isBn
                        ? 'অর্ধেক মালিক (০.৫ অংশ)'
                        : 'Half Owner (0.5 Share)'
                      : isBn
                      ? `পূর্ণ মালিক (${toBengaliNumber(shareUnits)} অংশ)`
                      : `Full Owner (${shareUnits} Share)`}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="font-semibold tabular-nums">
                    {sharePercentage.toFixed(2)}% {isBn ? 'অংশীদারিত্ব' : 'Ownership'}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {monthLabel}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {owner.phone && (
                    <a
                      href={`tel:${owner.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#E52E2E] font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="tabular-nums">{owner.phone}</span>
                    </a>
                  )}
                  {owner.address && (
                    <div className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{owner.address}</span>
                    </div>
                  )}
                  {owner.notes && (
                    <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span>{owner.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settlement feedback toast */}
          {settleMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{settleMessage}</span>
            </div>
          )}

          {/* Net Dividend & Deduction Hero + Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Hero Payable Banner */}
            <div className="p-5 bg-gradient-to-br from-[#E52E2E] via-rose-600 to-rose-700 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-rose-100">
                    {hasDeduction
                      ? isBn
                        ? 'কোম্পানি পাওনা কর্তনের পর চূড়ান্ত প্রাপ্য লভ্যাংশ'
                        : 'Final Net Dividend After Due Deduction'
                      : isBn
                      ? 'মালিকের প্রাপ্য নিট লভ্যাংশ'
                      : 'Owner Net Payable Dividend'}
                  </p>
                  <p className="text-3xl font-black tabular-nums tracking-tight mt-1">
                    {renderAmount(netPayable)}
                  </p>
                  <p className="text-xs text-rose-100/90 mt-1.5">
                    {hasDeduction
                      ? isBn
                        ? `মোট শেয়ার ${renderAmount(grossShare)} থেকে ${renderAmount(deductedAmount)} কোম্পানি পাওনা কর্তন করা হয়েছে`
                        : `${renderAmount(deductedAmount)} company due deducted from ${renderAmount(grossShare)} gross dividend`
                      : hasDue
                      ? isBn
                        ? `বকেয়া কোম্পানি পাওনা ${renderAmount(applicableCompanyDue)} (এই মাসের লভ্যাংশ শূন্য হওয়ায় কর্তন হয়নি)`
                        : `Pending company due ${renderAmount(applicableCompanyDue)}`
                      : netProfit < 0
                      ? isBn
                        ? `${monthLabel} মাসে কোম্পানির নিট লস (${formatSignedCurrency(netProfit, lang)}) থাকায় লভ্যাংশ শূন্য`
                        : `Company recorded a net loss (${formatSignedCurrency(netProfit, lang)}) for ${monthLabel}`
                      : isBn
                      ? `${monthLabel} মাসের কোম্পানির মোট নিট লাভ থেকে প্রাপ্ত অংশ`
                      : `Calculated from company net profit for ${monthLabel}`}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
            </div>

            {(hasDue || hasDeduction) && (
              <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {isBn ? 'মোট লভ্যাংশ' : 'Gross Share'}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums mt-0.5">
                    {renderAmount(grossShare)}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {isBn ? 'পাওনা কর্তন' : 'Deduction'}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
                    -{renderAmount(deductedAmount)}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {isBn ? 'নিট প্রাপ্য' : 'Net Payable'}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                    {renderAmount(netPayable)}
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-Step Accounting Breakdown Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {netProfit < 0
                    ? (isBn
                        ? `কোম্পানির মোট নিট লস / ঘাটতি (${monthLabel})`
                        : `Company Net Loss (${monthLabel})`)
                    : (isBn
                        ? `কোম্পানির মোট নিট লাভ (${monthLabel})`
                        : `Company Total Net Profit (${monthLabel})`)}
                </span>
                <span className={`font-bold tabular-nums ${netProfit < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {formatSignedCurrency(netProfit, lang)}
                </span>
              </div>

              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {isBn
                    ? `মালিকের শেয়ার অংশ (${toBengaliNumber(shareUnits)} / ${toBengaliNumber(totalShareUnits)})`
                    : `Owner Share Ratio (${shareUnits} / ${totalShareUnits})`}
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {sharePercentage.toFixed(2)}%
                </span>
              </div>

              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {isBn ? 'মোট প্রাপ্য লভ্যাংশ (কর্তনের পূর্বে)' : 'Gross Share Dividend'}
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {renderAmount(grossShare)}
                </span>
              </div>

              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-rose-50/50 dark:bg-rose-950/20">
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">
                    {isBn ? 'মালিকের নিকট কোম্পানি পাওনা (বকেয়া)' : 'Outstanding Company Due'}
                  </p>
                  {matchedAccounts.length > 0 && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                      {isBn
                        ? `মোট পাওনা: ${renderAmount(totalDue)} · পূর্বে জমা/সমন্বয়: ${renderAmount(totalCollected)}`
                        : `Total Due: ${renderAmount(totalDue)} · Collected: ${renderAmount(totalCollected)}`}
                    </p>
                  )}
                </div>
                <span
                  className={`font-black tabular-nums ${
                    hasDue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {renderAmount(applicableCompanyDue)}
                </span>
              </div>

              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-amber-50/50 dark:bg-amber-950/20">
                <span className="text-amber-900 dark:text-amber-300 font-bold">
                  {isBn ? 'লভ্যাংশ থেকে পাওনা কর্তন' : 'Deducted From Dividend'}
                </span>
                <span className="font-black text-amber-700 dark:text-amber-400 tabular-nums">
                  {hasDeduction ? `- ${renderAmount(deductedAmount)}` : renderAmount(0)}
                </span>
              </div>

              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 bg-emerald-50/70 dark:bg-emerald-950/25">
                <span className="text-emerald-950 dark:text-emerald-200 font-black">
                  {isBn ? 'চূড়ান্ত প্রাপ্য নিট লভ্যাংশ' : 'Final Net Dividend Payable'}
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {renderAmount(netPayable)}
                </span>
              </div>

              {unpaidDueAfterDividend > 0 && (
                <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-rose-50 dark:bg-rose-950/35">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      {isBn
                        ? 'লভ্যাংশ কর্তনের পরও অবশিষ্ট কোম্পানি পাওনা'
                        : 'Remaining Company Due After Deduction'}
                    </span>
                  </div>
                  <span className="font-black text-rose-700 dark:text-rose-300 tabular-nums">
                    {renderAmount(unpaidDueAfterDividend)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Permanent Settlement Action */}
          {isAdmin && hasDeduction && matchedAccounts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isBn
                      ? 'লভ্যাংশ থেকে কোম্পানি পাওনা স্থায়ী সমন্বয় (এডমিন)'
                      : 'Permanent Dividend Deduction Settlement (Admin)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {alreadySettledThisMonth
                      ? isBn
                        ? `${monthLabel} মাসের লভ্যাংশ থেকে ইতিপূর্বে পাওনা সমন্বয় এন্ট্রি করা হয়েছে। আরও কোনো বকেয়া থাকলে পুনরায় সমন্বয় করতে পারেন।`
                        : `A deduction entry for ${monthLabel} has already been recorded. You can still settle remaining dues if needed.`
                      : isBn
                      ? `এখানে নিশ্চিত করলে মালিকের কোম্পানি পাওনা খাতায় ${renderAmount(deductedAmount)} "লভ্যাংশ থেকে কর্তন" হিসেবে জমা রেকর্ড হবে এবং মোট বকেয়া পাওনা কমে যাবে।`
                      : `Confirming records ${renderAmount(deductedAmount)} as settled in the owner's company due ledger.`}
                  </p>
                </div>
              </div>

              {!isConfirmingSettle ? (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsConfirmingSettle(true);
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isBn
                      ? `${renderAmount(deductedAmount)} পাওনা কর্তন খাতায় সংরক্ষণ করুন`
                      : `Record ${renderAmount(deductedAmount)} Deduction`}
                  </span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2.5">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {isBn
                      ? `আপনি কি নিশ্চিত যে ${owner.name}-এর ${monthLabel} মাসের লভ্যাংশ থেকে ${renderAmount(deductedAmount)} কেটে কোম্পানি পাওনা হিসেবে জমা রেকর্ড করবেন?`
                      : `Confirm recording ${renderAmount(deductedAmount)} deduction from ${owner.name}'s dividend?`}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingSettle(false)}
                      disabled={isSettling}
                      className="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSettle}
                      disabled={isSettling}
                      className="flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-[#E52E2E] text-white text-xs font-bold disabled:opacity-50"
                    >
                      {isSettling
                        ? isBn
                          ? 'সংরক্ষণ হচ্ছে...'
                          : 'Saving...'
                        : isBn
                        ? 'হ্যাঁ, নিশ্চিত করুন'
                        : 'Yes, Confirm'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Owner Company Due Ledger History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'কোম্পানি পাওনা ও সমন্বয়ের লেনদেন খাতা' : 'Company Due & Settlement Ledger'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {matchedAccounts.length > 0
                    ? isBn
                      ? `মোট ${toBengaliNumber(transactions.length)}টি লেনদেন রেকর্ড`
                      : `${transactions.length} ledger entries`
                    : isBn
                    ? 'স্টাফ কালেকশন ও কোম্পানি পাওনা খাতার সাথে যুক্ত'
                    : 'Synced with Company Due Ledger'}
                </p>
              </div>
              {matchedAccounts.length > 0 && (
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {isBn ? 'বকেয়া: ' : 'Due: '}
                  <span className={hasDue ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}>
                    {renderAmount(applicableCompanyDue)}
                  </span>
                </span>
              )}
            </div>

            {ledgerRows.length === 0 ? (
              <div className="p-6 text-center space-y-1.5">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isBn
                    ? 'এই মালিকের নামে কোনো কোম্পানি পাওনা বা লেনদেন রেকর্ড নেই'
                    : 'No company due records linked to this owner'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {isBn
                    ? '"স্টাফ কালেকশন ও কোম্পানি পাওনা" পেইজে পদবি "মালিক / অংশীদার" দিয়ে একই নাম বা মোবাইল নম্বরে পাওনা যোগ করলে এখানে স্বয়ংক্রিয়ভাবে হিসাব ও লভ্যাংশ কর্তন দেখাবে।'
                    : 'Dues added in Staff Collection & Company Due under the Owner/Partner role with matching name or phone appear here automatically.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {ledgerRows.map(({ tx, balanceAfter }) => {
                  const isDueTx = tx.type === 'due';
                  return (
                    <div
                      key={tx.id}
                      className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isDueTx
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          }`}
                        >
                          {isDueTx ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {tx.note ||
                              (isDueTx
                                ? isBn
                                  ? 'কোম্পানি পাওনা যোগ'
                                  : 'Company Due Added'
                                : isBn
                                ? 'পাওনা জমা / সমন্বয়'
                                : 'Collected / Settled')}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{tx.date}</span>
                            {tx.time ? ` · ${tx.time}` : ''}
                            {tx.reference ? ` · ${tx.reference}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p
                          className={`text-xs sm:text-sm font-black tabular-nums ${
                            isDueTx
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isDueTx ? '+' : '-'} {renderAmount(Number(tx.amount) || 0)}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {isBn ? 'জের: ' : 'Bal: '}
                          {renderAmount(balanceAfter)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
