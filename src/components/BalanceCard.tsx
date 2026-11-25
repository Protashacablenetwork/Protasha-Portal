import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, formatSignedCurrency, toBengaliNumber, translations } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { safeStorage } from '../utils/safeStorage';
import { loadFirebase, loadFirestore } from '../utils/cloudBridge';
import {
  isIncomeTransaction,
  parseNumber,
  getTransactionMonth
} from '../portals/ayByay/data/categories';
import type { Transaction as AyByayTransaction, SalaryPayment } from '../portals/ayByay/types';

interface BalanceCardProps {
  balance?: number;
  lang: Language;
}

const isSalaryTx = (t: any): boolean =>
  (t?.id && String(t.id).startsWith('tx-sal-')) ||
  t?.category === 'বেতন (Salary)' ||
  (typeof t?.description === 'string' &&
    (t.description.includes('স্টাফ বেতন') || t.description.includes('বেতন')));

export const BalanceCard: React.FC<BalanceCardProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = translations[lang];
  const isBn = lang === 'bn';

  const now = new Date();
  const currentMonthYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [ayByayTxns, setAyByayTxns] = useState<AyByayTransaction[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_txns');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [ayByaySalaries, setAyByaySalaries] = useState<SalaryPayment[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_salaries');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [autoBillMap, setAutoBillMap] = useState<Record<string, AyByayTransaction>>({});

  const syncLiveBillAutoIncome = useCallback(async () => {
    try {
      const [{ fetchNetConnectionSummary, fetchPrevMonthDueBillSummary }] = await Promise.all([
        import('../portals/ayByay/utils/billSyncHelper')
      ]);
      const [netConnSummary, prevDueSummary] = await Promise.all([
        fetchNetConnectionSummary(currentMonthYM, false),
        fetchPrevMonthDueBillSummary(currentMonthYM, false)
      ]);

      let dismissedMap: Record<string, number> = {};
      try {
        const raw = safeStorage.getItem('ay_byay_dismissed_auto_tx');
        if (raw) dismissedMap = JSON.parse(raw) || {};
      } catch {}

      const buildAuto = (
        txId: string,
        summary: { totalPay: number; totalDue: number; count: number; bnMonth: string } | null,
        category: string,
        title: string
      ): AyByayTransaction | null => {
        if (!summary || summary.totalPay <= 0) return null;
        if (dismissedMap[txId] !== undefined && dismissedMap[txId] === summary.totalPay) {
          return null;
        }
        const today = new Date().toISOString().split('T')[0];
        return {
          id: txId,
          type: 'income',
          description: `${title} (${summary.bnMonth} - ${summary.count} জন গ্রাহক)`,
          category,
          amount: summary.totalPay,
          date: today,
          paymentMethod: 'নগদ (Cash)',
          source: 'ay-byay',
          createdAt: new Date().toISOString()
        };
      };

      const netTx = buildAuto(
        `tx-bill-net-conn-${currentMonthYM}`,
        netConnSummary,
        'নেট সংযোগ',
        'নতুন নেট সংযোগ বিল আদায়'
      );
      const dueTx = buildAuto(
        `tx-bill-due-prev-${currentMonthYM}`,
        prevDueSummary,
        'বকেয়া বিল',
        'আগের মাসের বকেয়া বিল আদায়'
      );

      setAutoBillMap(() => {
        const next: Record<string, AyByayTransaction> = {};
        if (netTx) next[netTx.id] = netTx;
        if (dueTx) next[dueTx.id] = dueTx;
        return next;
      });
    } catch {}
  }, [currentMonthYM]);

  // Listen to local Ay-Byay / Bill Manager updates & deferred real-time staffDb listeners
  useEffect(() => {
    let active = true;
    let unsubTxns: (() => void) | null = null;
    let unsubSalaries: (() => void) | null = null;

    const handleAyByayEvent = () => {
      try {
        const rawTx = safeStorage.getItem('isp_cache_txns');
        if (rawTx) {
          const parsed = JSON.parse(rawTx);
          if (Array.isArray(parsed)) setAyByayTxns(parsed);
        }
        const rawSal = safeStorage.getItem('isp_cache_salaries');
        if (rawSal) {
          const parsedSal = JSON.parse(rawSal);
          if (Array.isArray(parsedSal)) setAyByaySalaries(parsedSal);
        }
      } catch {}
    };

    const handleBillEvent = () => {
      void syncLiveBillAutoIncome();
    };

    window.addEventListener('aybyay-data-changed', handleAyByayEvent);
    window.addEventListener('bill-manager-data-updated', handleBillEvent);

    const timer = setTimeout(() => {
      void syncLiveBillAutoIncome();

      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ staffDb }, { collection, onSnapshot }]) => {
          if (!active) return;

          try {
            unsubTxns = onSnapshot(
              collection(staffDb, 'ay_byay_transactions'),
              (snap) => {
                if (!active) return;
                const list: AyByayTransaction[] = [];
                snap.forEach((docSnap) => {
                  const data = docSnap.data() as any;
                  if (
                    data &&
                    (data.id || docSnap.id) &&
                    !data.isDeleted &&
                    (!data.source || data.source === 'ay-byay')
                  ) {
                    list.push({ ...data, id: data.id || docSnap.id });
                  }
                });
                setAyByayTxns(list);
                try {
                  safeStorage.setItem('isp_cache_txns', JSON.stringify(list));
                } catch {}
              },
              () => {}
            );
          } catch {}

          try {
            unsubSalaries = onSnapshot(
              collection(staffDb, 'ay_byay_salaries'),
              (snap) => {
                if (!active) return;
                const list: SalaryPayment[] = [];
                snap.forEach((docSnap) => {
                  const data = docSnap.data() as SalaryPayment;
                  if (data && data.id && data.staffId) {
                    list.push(data);
                  }
                });
                setAyByaySalaries(list);
                try {
                  safeStorage.setItem('isp_cache_salaries', JSON.stringify(list));
                } catch {}
              },
              () => {}
            );
          } catch {}
        })
        .catch(() => {});
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener('aybyay-data-changed', handleAyByayEvent);
      window.removeEventListener('bill-manager-data-updated', handleBillEvent);
      if (unsubTxns) {
        try {
          unsubTxns();
        } catch {}
      }
      if (unsubSalaries) {
        try {
          unsubSalaries();
        } catch {}
      }
    };
  }, [syncLiveBillAutoIncome]);

  // Compute Company Ay - Byay remaining balance for the current running month
  const companySummary = useMemo(() => {
    const mergedMap = new Map<string, AyByayTransaction>();
    (ayByayTxns || []).forEach((item) => {
      if (item && item.id && !(item as any).isDeleted && (!item.source || item.source === 'ay-byay')) {
        mergedMap.set(item.id, item);
      }
    });

    Object.values(autoBillMap).forEach((autoTx) => {
      const existing = mergedMap.get(autoTx.id);
      if (!existing || Math.round(parseNumber(existing.amount)) !== Math.round(parseNumber(autoTx.amount))) {
        mergedMap.set(autoTx.id, {
          ...autoTx,
          date:
            existing?.date && getTransactionMonth(existing.date) === currentMonthYM
              ? existing.date
              : autoTx.date
        });
      }
    });

    let inc = 0;
    let nonSalExp = 0;
    let salExpInTx = 0;
    let hasTxn = false;

    mergedMap.forEach((item) => {
      const d = item.date || item.createdAt || '';
      if (!d || getTransactionMonth(d) !== currentMonthYM) return;
      hasTxn = true;
      const amt = parseNumber(item.amount);
      if (isIncomeTransaction(item)) {
        inc += amt;
      } else if (isSalaryTx(item)) {
        salExpInTx += amt;
      } else {
        nonSalExp += amt;
      }
    });

    const salFromList = (ayByaySalaries || [])
      .filter((s) => s && s.month === currentMonthYM && s.paymentStatus === 'paid')
      .reduce((acc, s) => acc + (Number(s.netSalary) || 0), 0);

    const effectiveSalary = Math.max(salExpInTx, salFromList);
    const totalExpense = nonSalExp + effectiveSalary;

    if (!hasTxn && salFromList <= 0) {
      try {
        const cachedRaw = safeStorage.getItem('protyasha_cached_summary');
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (parsed && typeof parsed.totalIncome === 'number' && typeof parsed.totalExpense === 'number') {
            return {
              income: parsed.totalIncome,
              expense: parsed.totalExpense,
              net: parsed.totalIncome - parsed.totalExpense
            };
          }
        }
      } catch {}
    }

    return {
      income: inc,
      expense: totalExpense,
      net: inc - totalExpense
    };
  }, [ayByayTxns, ayByaySalaries, autoBillMap, currentMonthYM]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleToggle = () => {
    sounds.playBalanceChime();
    const nextState = !isVisible;
    setIsVisible(nextState);

    if (nextState) {
      void syncLiveBillAutoIncome();
      import('canvas-confetti')
        .then((mod) => {
          const runConfetti = mod.default || (mod as any);
          if (typeof runConfetti === 'function') {
            runConfetti({
              particleCount: 28,
              spread: 45,
              origin: { y: 0.28 },
              colors:
                companySummary.net < 0
                  ? ['#E52E2E', '#DC2626', '#FB7185']
                  : ['#059669', '#10B981', '#34D399', '#F59E0B'],
              disableForReducedMotion: true
            });
          }
        })
        .catch(() => {});
    }
  };

  const isLoss = companySummary.net < 0;
  const isProfit = companySummary.net > 0;

  const fmtInline = (n: number) =>
    isBn ? toBengaliNumber(formatCurrency(n, 'bn')) : formatCurrency(n, 'en');
  const fmtSigned = (n: number) =>
    isBn ? toBengaliNumber(formatSignedCurrency(n, 'bn')) : formatSignedCurrency(n, 'en');

  const cardBorderClass = !isVisible
    ? 'border-slate-200/80 dark:border-slate-800 hover:border-rose-200'
    : isLoss
    ? 'border-rose-300 dark:border-rose-800/80'
    : isProfit
    ? 'border-emerald-300 dark:border-emerald-800/80'
    : 'border-slate-200 dark:border-slate-700';

  const iconBgClass = !isVisible
    ? 'from-[#D32F2F] to-[#E52E2E] shadow-rose-500/30'
    : isLoss
    ? 'from-rose-600 to-red-600 shadow-rose-500/35'
    : isProfit
    ? 'from-emerald-600 to-teal-600 shadow-emerald-500/35'
    : 'from-slate-600 to-slate-700 shadow-slate-500/20';

  const amountColorClass = isLoss
    ? 'text-rose-600 dark:text-rose-400'
    : isProfit
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-slate-800 dark:text-slate-100';

  return (
    <div className="relative px-4 -mt-5 z-20">
      <div
        onClick={handleToggle}
        className={`relative overflow-hidden w-full bg-white dark:bg-slate-900 rounded-3xl p-3.5 shadow-md shadow-rose-900/5 dark:shadow-none border flex items-center justify-between gap-2 cursor-pointer select-none active:scale-[0.985] transition-all duration-200 ${cardBorderClass}`}
      >
        {/* Left Side: ৳ Icon badge */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-tr shadow-sm flex items-center justify-center text-white text-xl font-bold shrink-0 transition-colors ${iconBgClass}`}
          >
            ৳
          </div>

          <div className="flex flex-col justify-center min-w-0">
            {isVisible ? (
              <div className="animate-in fade-in zoom-in-95 duration-200 min-w-0">
                <span
                  className={`text-[11px] font-bold block -mb-0.5 truncate ${
                    isLoss
                      ? 'text-rose-600 dark:text-rose-400'
                      : isProfit
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isLoss
                    ? isBn
                      ? 'কোম্পানি আয় - ব্যয় (নিট লস)'
                      : 'Company Net Loss'
                    : isProfit
                    ? isBn
                      ? 'কোম্পানি আয় - ব্যয় (অবশিষ্ট লাভ)'
                      : 'Company Net Profit'
                    : isBn
                    ? 'কোম্পানি আয় - ব্যয় (অবশিষ্ট)'
                    : 'Company Net Balance'}
                </span>
                <h3 className={`text-xl font-extrabold tracking-tight tabular-nums ${amountColorClass}`}>
                  {fmtSigned(companySummary.net)}
                </h3>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate tabular-nums">
                  {isBn
                    ? `আয় ${fmtInline(companySummary.income)} · ব্যয় ${fmtInline(companySummary.expense)}`
                    : `In ${fmtInline(companySummary.income)} · Out ${fmtInline(companySummary.expense)}`}
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200 min-w-0">
                <h4 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {t.tap_to_check_balance}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  {isBn ? 'ট্যাপ করে কোম্পানির আয় - ব্যয় ব্যালেন্স দেখুন' : 'Tap to reveal company net balance'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Toggle indicator */}
        <div className="pr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
          {isVisible ? (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                isLoss
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                  : isProfit
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{isBn ? 'লুকান' : 'Hide'}</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Eye className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

