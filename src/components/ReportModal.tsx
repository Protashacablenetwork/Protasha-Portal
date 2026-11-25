import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Calculator,
  Calendar,
  UserCheck,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { collection, onSnapshot } from 'firebase/firestore';
import { Language, Transaction, PaymentChannel, UserSession } from '../types';
import { Transaction as AyByayTransaction } from '../portals/ayByay/types';
import {
  isIncomeTransaction,
  parseNumber,
  getTransactionMonth
} from '../portals/ayByay/data/categories';
import {
  fetchNetConnectionSummary,
  fetchPrevMonthDueBillSummary,
  BillServiceSummary
} from '../portals/ayByay/utils/billSyncHelper';
import { staffDb } from '../utils/firebase';
import { safeStorage } from '../utils/safeStorage';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { DailyIncomeExpenseChart } from './DailyIncomeExpenseChart';
import { isTransactionOwner, isSubAdmin as checkIsSubAdmin } from '../utils/permissions';

interface ReportModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  channels?: PaymentChannel[];
  lang: Language;
  user?: UserSession | null;
  onClose: () => void;
  isTabMode?: boolean;
  currentMonthIndex: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];
const MONTHS_SHORT_BN = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন',
  'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const printHtmlViaIframe = (htmlContent: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 350);
};

const normalizeAyByayTx = (t: AyByayTransaction): Transaction => {
  const isInc = isIncomeTransaction(t);
  const createdMs = t.createdAt ? new Date(t.createdAt).getTime() || 0 : 0;
  let timeStr = '';
  if (createdMs > 0) {
    try {
      timeStr = new Date(createdMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      timeStr = '';
    }
  }
  return {
    id: String(t.id || ''),
    trxId: String(t.id || ''),
    type: isInc ? 'income' : 'expense',
    method: t.paymentMethod || 'নগদ (Cash)',
    amount: parseNumber(t.amount),
    person: t.description || t.category || '',
    phone: '',
    date: t.date || (t.createdAt ? t.createdAt.slice(0, 10) : ''),
    time: timeStr,
    note: t.note || '',
    category: t.category || (isInc ? 'অন্যান্য আয়' : 'অন্যান্য খরচ'),
    source: 'ay-byay',
    recordedBy: t.recordedBy,
    recordedByGmail: t.recordedByGmail,
    created: createdMs
  };
};

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  transactions,
  lang,
  user,
  onClose,
  isTabMode = false,
  currentMonthIndex,
  currentYear,
  onPrevMonth,
  onNextMonth
}) => {
  const isSubAdmin = checkIsSubAdmin(user);
  const [reportScope, setReportScope] = useState<'own' | 'all'>('all');
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [auditYear, setAuditYear] = useState<number>(currentYear);

  // Live Ay-Byay transactions (cache + Firestore staffDb/ay_byay_transactions)
  const [ayByayTxns, setAyByayTxns] = useState<AyByayTransaction[]>(() => {
    try {
      const saved = safeStorage.getItem('isp_cache_txns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [autoBillSyncMap, setAutoBillSyncMap] = useState<Record<string, AyByayTransaction>>({});

  useEffect(() => {
    setAuditYear(currentYear);
  }, [currentYear]);

  // Real-time Firestore listener + local event sync for Ay-Byay transactions
  useEffect(() => {
    if (!isOpen) return;

    const handleAyByayChanged = () => {
      try {
        const saved = safeStorage.getItem('isp_cache_txns');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setAyByayTxns(parsed);
        }
      } catch {}
    };
    window.addEventListener('aybyay-data-changed', handleAyByayChanged);

    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = onSnapshot(
        collection(staffDb, 'ay_byay_transactions'),
        (snapshot) => {
          const cloudTx: AyByayTransaction[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            if (data && (data.id || docSnap.id) && !data.isDeleted && (!data.source || data.source === 'ay-byay')) {
              cloudTx.push({ ...data, id: data.id || docSnap.id });
            }
          });
          setAyByayTxns(cloudTx);
          try {
            safeStorage.setItem('isp_cache_txns', JSON.stringify(cloudTx));
          } catch {}
        },
        () => {}
      );
    } catch {}

    return () => {
      window.removeEventListener('aybyay-data-changed', handleAyByayChanged);
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch {}
      }
    };
  }, [isOpen]);

  // Sync live Bill Manager Pro auto-income entries ('নেট সংযোগ' & 'বকেয়া বিল') for active month
  const activeMonthYM = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const getDismissedMap = (): Record<string, number> => {
      try {
        const raw = safeStorage.getItem('ay_byay_dismissed_auto_tx');
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    };

    const buildAutoTx = (
      txId: string,
      summary: BillServiceSummary | null,
      category: string,
      descriptionTitle: string
    ): AyByayTransaction | null => {
      if (!summary || summary.totalPay <= 0) return null;
      const dismissedMap = getDismissedMap();
      if (dismissedMap[txId] !== undefined && dismissedMap[txId] === summary.totalPay) {
        return null;
      }
      const nowYM = new Date().toISOString().slice(0, 7);
      const txDate = activeMonthYM === nowYM ? new Date().toISOString().split('T')[0] : `${activeMonthYM}-01`;
      return {
        id: txId,
        type: 'income',
        description: `${descriptionTitle} (${summary.bnMonth} - ${summary.count} জন গ্রাহক)`,
        category,
        amount: summary.totalPay,
        date: txDate,
        paymentMethod: 'নগদ (Cash)',
        note: `বিল ম্যানেজার প্রো থেকে রিয়েল-টাইম অটো আপডেট • মাস: ${summary.bnMonth} • মোট আদায়: ৳${summary.totalPay} • বকেয়া: ৳${summary.totalDue}`,
        source: 'ay-byay',
        recordedBy: 'system-bill-sync',
        createdAt: `${txDate}T00:00:00.000Z`
      };
    };

    const runSync = async () => {
      try {
        const [netConnSummary, prevDueSummary] = await Promise.all([
          fetchNetConnectionSummary(activeMonthYM, false),
          fetchPrevMonthDueBillSummary(activeMonthYM, false)
        ]);
        if (cancelled) return;
        const netTx = buildAutoTx(
          `tx-bill-net-conn-${activeMonthYM}`,
          netConnSummary,
          'নেট সংযোগ',
          'নতুন নেট সংযোগ বিল আদায়'
        );
        const dueTx = buildAutoTx(
          `tx-bill-due-prev-${activeMonthYM}`,
          prevDueSummary,
          'বকেয়া বিল',
          'আগের মাসের বকেয়া বিল আদায়'
        );
        setAutoBillSyncMap((prev) => {
          const next = { ...prev };
          if (netTx) next[netTx.id] = netTx;
          if (dueTx) next[dueTx.id] = dueTx;
          return next;
        });
      } catch {}
    };

    void runSync();
    return () => {
      cancelled = true;
    };
  }, [isOpen, activeMonthYM]);

  const isBn = lang === 'bn';

  // Normalize Ay-Byay transactions (falling back cleanly to ay-byay items from prop if needed)
  const ayByayReportTransactions = useMemo(() => {
    const mergedMap = new Map<string, AyByayTransaction>();
    (ayByayTxns || []).forEach((t) => {
      if (t && t.id && !(t as any).isDeleted) {
        mergedMap.set(t.id, t);
      }
    });
    Object.values(autoBillSyncMap).forEach((autoTx) => {
      const existing = mergedMap.get(autoTx.id);
      if (!existing || Math.round(parseNumber(existing.amount)) !== Math.round(parseNumber(autoTx.amount))) {
        mergedMap.set(autoTx.id, {
          ...autoTx,
          date: existing?.date && getTransactionMonth(existing.date) === getTransactionMonth(autoTx.date)
            ? existing.date
            : autoTx.date,
          paymentMethod: existing?.paymentMethod || autoTx.paymentMethod,
          createdAt: existing?.createdAt || autoTx.createdAt
        });
      }
    });

    if (mergedMap.size === 0 && Array.isArray(transactions)) {
      transactions.forEach((t) => {
        if (t && !t.isDeleted && t.source === 'ay-byay') {
          mergedMap.set(t.id, {
            id: t.id,
            type: t.type,
            description: t.person || t.category,
            category: t.category,
            amount: t.amount,
            date: t.date,
            paymentMethod: t.method,
            note: t.note,
            recordedBy: t.recordedBy,
            recordedByGmail: t.recordedByGmail,
            source: 'ay-byay',
            createdAt: t.created ? new Date(t.created).toISOString() : undefined
          });
        }
      });
    }

    return Array.from(mergedMap.values()).map(normalizeAyByayTx);
  }, [ayByayTxns, autoBillSyncMap, transactions]);

  // Scope transactions when sub-admin chooses between their own vs full Ay-Byay report
  const scopedTransactions = useMemo(() => {
    const nonDeleted = ayByayReportTransactions.filter((trx) => !trx.isDeleted);
    if (isSubAdmin && reportScope === 'own') {
      return nonDeleted.filter((trx) => isTransactionOwner(trx, user));
    }
    return nonDeleted;
  }, [ayByayReportTransactions, isSubAdmin, reportScope, user]);

  // Monthly active transactions (sorted chronologically: 1st added on top, 2nd below)
  const activeTransactions = useMemo(() => {
    const filtered = scopedTransactions.filter((trx) => {
      return getTransactionMonth(trx.date || '') === activeMonthYM;
    });
    return [...filtered].sort((a, b) => {
      const dA = new Date(a.date || 0).getTime() || 0;
      const dB = new Date(b.date || 0).getTime() || 0;
      if (dA !== dB) return dA - dB;
      const cA = Number(a.created) || 0;
      const cB = Number(b.created) || 0;
      if (cA !== cB) return cA - cB;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  }, [scopedTransactions, activeMonthYM]);

  // Monthly totals
  const { totalIncome, totalExpense, netBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    activeTransactions.forEach((trx) => {
      if (trx.type === 'income') inc += trx.amount;
      else exp += trx.amount;
    });
    return { totalIncome: inc, totalExpense: exp, netBalance: inc - exp };
  }, [activeTransactions]);

  // Yearly audit data
  const yearlyData = useMemo(() => {
    const yearPrefix = `${auditYear}-`;
    const yearTrx = scopedTransactions.filter((trx) => {
      const ym = getTransactionMonth(trx.date || '');
      return ym.startsWith(yearPrefix);
    });

    const monthlyBreakdown = Array.from({ length: 12 }, (_, idx) => ({
      monthIndex: idx,
      monthBn: MONTHS_BN[idx],
      monthEn: MONTHS_EN[idx],
      shortLabel: isBn ? MONTHS_SHORT_BN[idx] : MONTHS_SHORT_EN[idx],
      income: 0,
      expense: 0,
      net: 0,
      count: 0
    }));

    const incomeCats = new Map<string, number>();
    const expenseCats = new Map<string, number>();

    let yIncome = 0;
    let yExpense = 0;

    yearTrx.forEach((trx) => {
      const ym = getTransactionMonth(trx.date || '');
      const parts = ym.split('-');
      const mIdx = parts.length >= 2 ? parseInt(parts[1], 10) - 1 : 0;
      const bucket = monthlyBreakdown[mIdx >= 0 && mIdx < 12 ? mIdx : 0];
      const cat = trx.category || (trx.type === 'income' ? 'অন্যান্য আয়' : 'অন্যান্য খরচ');

      if (trx.type === 'income') {
        bucket.income += trx.amount;
        yIncome += trx.amount;
        incomeCats.set(cat, (incomeCats.get(cat) || 0) + trx.amount);
      } else {
        bucket.expense += trx.amount;
        yExpense += trx.amount;
        expenseCats.set(cat, (expenseCats.get(cat) || 0) + trx.amount);
      }
      bucket.count += 1;
    });

    monthlyBreakdown.forEach((m) => {
      m.net = m.income - m.expense;
    });

    const sortedIncomeCats = Array.from(incomeCats.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const sortedExpenseCats = Array.from(expenseCats.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const bestMonth = monthlyBreakdown.reduce(
      (best, cur) => (cur.income > best.income ? cur : best),
      monthlyBreakdown[0]
    );

    const yNet = yIncome - yExpense;
    const profitMargin = yIncome > 0 ? Math.round((yNet / yIncome) * 100) : 0;

    return {
      transactions: yearTrx,
      monthlyBreakdown,
      totalIncome: yIncome,
      totalExpense: yExpense,
      netBalance: yNet,
      profitMargin,
      bestMonth,
      topExpenseCategory: sortedExpenseCats[0] || null,
      incomeCategories: sortedIncomeCats,
      expenseCategories: sortedExpenseCats
    };
  }, [scopedTransactions, auditYear, isBn]);

  if (!isOpen) return null;

  const formatNum = (n: number) => (isBn ? toBengaliNumber(n) : n.toLocaleString('en-US'));

  const getShortDateStr = (dateStr: string) => {
    if (!dateStr) return '১০/২৬';
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      const month = parts[1];
      const day = parts[2];
      return isBn ? `${toBengaliNumber(month)}/${toBengaliNumber(day)}` : `${month}/${day}`;
    }
    return dateStr;
  };

  // CSV Export (supports both Monthly & Yearly)
  const handleExportCsv = () => {
    sounds.playTap();
    let csv = '';
    let fileName = '';

    if (reportPeriod === 'monthly') {
      csv = '\uFEFFDate,Time,Transaction_ID,Person,Phone,Type,Method,Category,Income_Amount,Expense_Amount,Status,Note\n';
      activeTransactions.forEach((t) => {
        const isInc = t.type === 'income';
        const incVal = isInc ? t.amount : '';
        const expVal = !isInc ? t.amount : '';
        const status = isInc ? 'আয়' : 'পরিশোধ';
        csv += `"${t.date}","${t.time}","${t.trxId}","${(t.person || '').replace(/"/g, '""')}","${t.phone || ''}","${t.type}","${(t.method || '').replace(/"/g, '""')}","${(t.category || '').replace(/"/g, '""')}","${incVal}","${expVal}","${status}","${(t.note || '').replace(/"/g, '""')}"\n`;
      });
      fileName = `protyasha_monthly_audit_${MONTHS_EN[currentMonthIndex]}_${currentYear}.csv`;
    } else {
      csv = '\uFEFFMonth,Transactions_Count,Total_Income,Total_Expense,Net_Profit_Loss\n';
      yearlyData.monthlyBreakdown.forEach((m) => {
        csv += `"${m.monthEn} ${auditYear}","${m.count}","${m.income}","${m.expense}","${m.net}"\n`;
      });
      csv += `"TOTAL ${auditYear}","${yearlyData.transactions.length}","${yearlyData.totalIncome}","${yearlyData.totalExpense}","${yearlyData.netBalance}"\n`;
      fileName = `protyasha_yearly_audit_${auditYear}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel (.xls) Audit Export (UTF-8 BOM formatted HTML table — opens cleanly in Excel & Google Sheets)
  const handleExportExcel = () => {
    sounds.playSuccess();
    let tableHtml = '';
    let fileName = '';

    if (reportPeriod === 'monthly') {
      const monthTitle = `${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}`;
      const rows = activeTransactions
        .map((trx) => {
          const isInc = trx.type === 'income';
          const desc = trx.person && trx.person !== trx.category ? trx.person : (trx.category || (isInc ? 'অন্যান্য আয়' : 'অন্যান্য খরচ'));
          const catOrRef = trx.category || '-';
          return `
            <tr>
              <td>${trx.date}</td>
              <td>${trx.trxId || '-'}</td>
              <td>${desc}</td>
              <td>${catOrRef}</td>
              <td>${trx.method || '-'}</td>
              <td style="color:#16a34a;font-weight:bold;">${isInc ? trx.amount : ''}</td>
              <td style="color:#dc2626;font-weight:bold;">${!isInc ? trx.amount : ''}</td>
              <td>${trx.note || ''}</td>
            </tr>`;
        })
        .join('');

      tableHtml = `
        <table border="1">
          <tr><th colspan="8" style="font-size:16px;font-weight:bold;background:#f8fafc;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — আয়-ব্যয় মাসিক অডিট রিপোর্ট (${monthTitle})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>তারিখ</th>
            <th>ট্রানজেকশন আইডি</th>
            <th>বিবরণ</th>
            <th>খাত</th>
            <th>মাধ্যম</th>
            <th>আয় (৳)</th>
            <th>ব্যয় (৳)</th>
            <th>নোট</th>
          </tr>
          ${rows}
          <tr style="background:#f1f5f9;font-weight:bold;">
            <td colspan="5" align="right">মোট :</td>
            <td style="color:#16a34a;">${totalIncome}</td>
            <td style="color:#dc2626;">${totalExpense}</td>
            <td>নিট ব্যালেন্স: ${netBalance} টাকা</td>
          </tr>
        </table>`;
      fileName = `protyasha_monthly_audit_${MONTHS_EN[currentMonthIndex]}_${currentYear}.xls`;
    } else {
      const monthRows = yearlyData.monthlyBreakdown
        .map(
          (m) => `
          <tr>
            <td>${m.monthBn} ${toBengaliNumber(auditYear)}</td>
            <td>${m.count}</td>
            <td style="color:#16a34a;font-weight:bold;">${m.income}</td>
            <td style="color:#dc2626;font-weight:bold;">${m.expense}</td>
            <td style="font-weight:bold;">${m.net}</td>
          </tr>`
        )
        .join('');

      const catRows = [
        ...yearlyData.incomeCategories.map(
          (c) => `<tr><td>আয়</td><td>${c.name}</td><td style="color:#16a34a;font-weight:bold;">${c.amount}</td></tr>`
        ),
        ...yearlyData.expenseCategories.map(
          (c) => `<tr><td>ব্যয়</td><td>${c.name}</td><td style="color:#dc2626;font-weight:bold;">${c.amount}</td></tr>`
        )
      ].join('');

      tableHtml = `
        <table border="1">
          <tr><th colspan="5" style="font-size:16px;font-weight:bold;background:#f8fafc;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — বাৎসরিক অডিট রিপোর্ট (${toBengaliNumber(auditYear)})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>মাস</th>
            <th>লেনদেন সংখ্যা</th>
            <th>মোট আয় (৳)</th>
            <th>মোট ব্যয় (৳)</th>
            <th>নিট লাভ/ক্ষতি (৳)</th>
          </tr>
          ${monthRows}
          <tr style="background:#f1f5f9;font-weight:bold;">
            <td>বাৎসরিক সর্বমোট</td>
            <td>${yearlyData.transactions.length}</td>
            <td style="color:#16a34a;">${yearlyData.totalIncome}</td>
            <td style="color:#dc2626;">${yearlyData.totalExpense}</td>
            <td>${yearlyData.netBalance}</td>
          </tr>
        </table>
        <br/>
        <table border="1">
          <tr><th colspan="3" style="font-size:14px;font-weight:bold;background:#f8fafc;">খাতভিত্তিক বাৎসরিক বিবরণী (${toBengaliNumber(auditYear)})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>ধরন</th>
            <th>খাতের নাম</th>
            <th>মোট পরিমাণ (৳)</th>
          </tr>
          ${catRows}
        </table>`;
      fileName = `protyasha_yearly_audit_${auditYear}.xls`;
    }

    const excelDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>${tableHtml}</body>
      </html>`;

    const blob = new Blob(['\uFEFF' + excelDoc], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Iframe-Safe PDF Export (supports both Monthly Ledger and Yearly Audit Report)
  const handleDownloadPdf = () => {
    sounds.playSuccess();

    const scopePillHtml = isSubAdmin
      ? `<div class="scope-pill">${
          reportScope === 'own'
            ? `সাব-এডমিন নিজস্ব রিপোর্ট (${user?.name || ''})`
            : 'সম্পূর্ণ প্রতিষ্ঠানের রিপোর্ট (সকল লেনদেন)'
        }</div>`
      : '';

    let bodyContent = '';
    let docTitle = '';

    if (reportPeriod === 'monthly') {
      const monthStr = `${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}`;
      const dateRangeStr = `০১-${toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate())}/${toBengaliNumber(currentMonthIndex + 1)}/${toBengaliNumber(currentYear)}`;
      docTitle = `প্রত্যাশা ক্যাবল নেটওয়ার্ক - মাসিক অডিট রিপোর্ট (${monthStr})`;

      let rowsHtml = '';
      activeTransactions.forEach((trx) => {
        const isInc = trx.type === 'income';
        const shortDate = getShortDateStr(trx.date);
        const desc = trx.person && trx.person !== trx.category ? trx.person : (trx.category || (isInc ? 'অন্যান্য আয়' : 'অন্যান্য খরচ'));
        const ref = trx.note || (trx.person && trx.person !== trx.category ? trx.category : trx.method) || '-';
        const incAmt = isInc ? toBengaliNumber(trx.amount) : '';
        const expAmt = !isInc ? toBengaliNumber(trx.amount) : '';
        const statusStr = isInc ? 'আয়' : 'পরিশোধ';

        rowsHtml += `
          <tr>
            <td>${shortDate}</td>
            <td class="text-left">${desc}</td>
            <td>${ref}</td>
            <td class="text-right font-bold" style="color: #16a34a;">${incAmt}</td>
            <td class="text-right font-bold" style="color: #dc2626;">${expAmt}</td>
            <td class="font-bold">${statusStr}</td>
          </tr>`;
      });

      bodyContent = `
        <div class="meta-bar">
          <div>মাস : ${monthStr}</div>
          <div class="meta-title">মাসিক লেনদেন অডিট রিপোর্ট</div>
          <div>তারিখ : ${dateRangeStr}</div>
        </div>
        <div class="divider-line"></div>
        <div class="section-heading">বিস্তারিত লেনদেন তালিকা</div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">তারিখ</th>
              <th style="width: 28%;">বিবরণ</th>
              <th style="width: 22%;">রেফারেন্স</th>
              <th style="width: 14%;">আয়</th>
              <th style="width: 14%;">ব্যয়</th>
              <th style="width: 10%;">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            ${
              rowsHtml ||
              `<tr><td colspan="6" style="padding: 20px; color: #64748b;">এই মাসে কোনো লেনদেন রেকর্ড নেই</td></tr>`
            }
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: 800;">মোট :</td>
              <td style="text-align: right; font-weight: 800; color: #16a34a;">${toBengaliNumber(totalIncome)}</td>
              <td style="text-align: right; font-weight: 800; color: #dc2626;">${toBengaliNumber(totalExpense)}</td>
              <td style="font-weight: 800;">টাকা</td>
            </tr>
          </tbody>
        </table>
        <div class="summary-card">
          <div class="summary-card-title">টোটাল মাসিক আয় - ব্যয়</div>
          <div class="summary-row">
            <span>টোটাল আয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(totalIncome)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-row">
            <span>টোটাল ব্যয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(totalExpense)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-net-row">
            <span>মোট =</span>
            <div><span style="font-size: 18px; font-weight: 800; margin-right: 6px;">${toBengaliNumber(netBalance)}</span><span>টাকা</span></div>
          </div>
        </div>`;
    } else {
      const yearBn = toBengaliNumber(auditYear);
      docTitle = `প্রত্যাশা ক্যাবল নেটওয়ার্ক - বাৎসরিক অডিট রিপোর্ট (${yearBn})`;

      const monthRowsHtml = yearlyData.monthlyBreakdown
        .map(
          (m) => `
          <tr>
            <td class="text-left font-bold">${m.monthBn} ${yearBn}</td>
            <td>${toBengaliNumber(m.count)}</td>
            <td class="text-right font-bold" style="color: #16a34a;">${toBengaliNumber(m.income)}</td>
            <td class="text-right font-bold" style="color: #dc2626;">${toBengaliNumber(m.expense)}</td>
            <td class="text-right font-bold" style="color: ${m.net >= 0 ? '#0f172a' : '#dc2626'};">${toBengaliNumber(m.net)}</td>
          </tr>`
        )
        .join('');

      const expCatRows = yearlyData.expenseCategories
        .slice(0, 10)
        .map(
          (c) => `
          <tr>
            <td class="text-left">${c.name}</td>
            <td class="text-right font-bold" style="color:#dc2626;">৳${toBengaliNumber(c.amount)}</td>
          </tr>`
        )
        .join('');

      bodyContent = `
        <div class="meta-bar">
          <div>অর্থবছর : ${yearBn}</div>
          <div class="meta-title">বাৎসরিক আর্থিক অডিট রিপোর্ট</div>
          <div>মোট এন্ট্রি : ${toBengaliNumber(yearlyData.transactions.length)} টি</div>
        </div>
        <div class="divider-line"></div>
        <div class="section-heading">১২ মাসের তুলনামূলক আয়-ব্যয় বিবরণী (${yearBn})</div>
        <table>
          <thead>
            <tr>
              <th style="width: 28%;">মাস</th>
              <th style="width: 14%;">লেনদেন</th>
              <th style="width: 20%;">মোট আয় (৳)</th>
              <th style="width: 20%;">মোট ব্যয় (৳)</th>
              <th style="width: 18%;">নিট লাভ/ক্ষতি (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${monthRowsHtml}
            <tr class="total-row">
              <td class="text-left" style="font-weight: 800;">বাৎসরিক সর্বমোট :</td>
              <td>${toBengaliNumber(yearlyData.transactions.length)}</td>
              <td class="text-right" style="color: #16a34a;">${toBengaliNumber(yearlyData.totalIncome)}</td>
              <td class="text-right" style="color: #dc2626;">${toBengaliNumber(yearlyData.totalExpense)}</td>
              <td class="text-right">${toBengaliNumber(yearlyData.netBalance)}</td>
            </tr>
          </tbody>
        </table>
        ${
          expCatRows
            ? `<div class="section-heading">খাতভিত্তিক প্রধান ব্যয় বিবরণী</div>
               <table>
                 <thead><tr><th>খাতের নাম</th><th style="width:30%;">মোট ব্যয়</th></tr></thead>
                 <tbody>${expCatRows}</tbody>
               </table>`
            : ''
        }
        <div class="summary-card">
          <div class="summary-card-title">বাৎসরিক সারসংক্ষেপ (${yearBn})</div>
          <div class="summary-row">
            <span>বাৎসরিক মোট আয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(yearlyData.totalIncome)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-row">
            <span>বাৎসরিক মোট ব্যয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(yearlyData.totalExpense)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-net-row">
            <span>নিট ব্যালেন্স (${toBengaliNumber(yearlyData.profitMargin)}%) =</span>
            <div><span style="font-size: 18px; font-weight: 800; margin-right: 6px;">${toBengaliNumber(yearlyData.netBalance)}</span><span>টাকা</span></div>
          </div>
        </div>`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>${docTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          body {
            font-family: 'Hind Siliguri', 'Kalpurush', Arial, sans-serif;
            margin: 0; padding: 24px; color: #0f172a; background: #ffffff;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
          .header-container { text-align: center; margin-bottom: 12px; }
          .header-title { font-size: 28px; font-weight: 800; margin: 0; color: #000000; }
          .header-subtitle { font-size: 14px; color: #475569; margin-top: 4px; font-weight: 600; }
          .scope-pill {
            display: inline-block; margin-top: 6px; padding: 3px 10px; border-radius: 999px;
            background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700;
          }
          .divider-line { border-bottom: 1.5px solid #cbd5e1; margin: 14px 0; }
          .meta-bar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; padding: 4px 0; }
          .meta-title { font-size: 18px; font-weight: 800; color: #0f172a; }
          .section-heading { font-size: 15px; font-weight: 700; margin: 16px 0 10px 0; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th, td { border: 1px solid #94a3b8; padding: 7px 10px; text-align: center; }
          th { background-color: #f1f5f9; font-weight: 700; color: #1e293b; font-size: 13.5px; }
          td.text-left { text-align: left; }
          td.text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .total-row { font-weight: 800; background-color: #f8fafc; font-size: 14px; }
          .summary-card {
            border: 1.5px solid #94a3b8; border-radius: 12px; padding: 16px 20px;
            width: 340px; margin-top: 10px; margin-bottom: 26px; background-color: #ffffff;
          }
          .summary-card-title { font-size: 16px; font-weight: 800; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1.5px solid #cbd5e1; }
          .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; }
          .summary-val-box { border: 1px solid #cbd5e1; padding: 3px 12px; border-radius: 4px; font-weight: 700; min-width: 90px; text-align: center; }
          .summary-net-row {
            display: flex; justify-content: space-between; align-items: center; font-size: 15px;
            font-weight: 800; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 10px;
          }
          .footer-signature-bar {
            margin-top: 48px; display: flex; justify-content: space-between; align-items: flex-end;
            font-size: 13px; font-weight: 700; color: #334155;
          }
          .signature-box { text-align: center; }
          .signature-line { border-top: 1.5px solid #475569; width: 180px; margin-bottom: 6px; }
          @media print { body { padding: 12px; } }
        </style>
      </head>
      <body>
        <div class="header-container">
          <h1 class="header-title">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
          <div class="header-subtitle">ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার</div>
          ${scopePillHtml}
        </div>
        <div class="divider-line"></div>
        ${bodyContent}
        <div class="footer-signature-bar">
          <div>কম্পিউটার জেনারেটেড অডিট রিপোর্ট</div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>কর্তৃপক্ষের স্বাক্ষর</div>
          </div>
        </div>
      </body>
      </html>`;

    printHtmlViaIframe(htmlContent);
  };

  return (
    <div
      className={
        isTabMode
          ? 'w-full min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col select-none pb-24'
          : 'fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200 pb-24'
      }
    >
      {/* Top Navbar */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          {!isTabMode && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center font-bold shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                {isBn ? 'মাসিক ও বাৎসরিক অডিট রিপোর্ট' : 'Monthly & Yearly Audit'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {isBn ? 'আয়-ব্যয় হিসাব খাতা · প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Ay-Byay Audit · Protasha Cable Network'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Bar Quick PDF Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExportExcel}
            className="h-8 px-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="h-8 px-3 rounded-full bg-[#E52E2E] hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            title={isBn ? 'পিডিএফ প্রিন্ট / ডাউনলোড' : 'Print / Save PDF'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'PDF' : 'PDF'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 space-y-4 pb-28 w-full">
        {/* Monthly vs Yearly Segmented Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setReportPeriod('monthly');
            }}
            className={`h-10 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              reportPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#E52E2E]" />
            <span>{isBn ? 'মাসিক রিপোর্ট' : 'Monthly Audit'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setReportPeriod('yearly');
            }}
            className={`h-10 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              reportPeriod === 'yearly'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isBn ? 'বাৎসরিক অডিট' : 'Yearly Audit'}</span>
          </button>
        </div>

        {/* Month or Year Selector */}
        {reportPeriod === 'monthly' ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={onPrevMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E52E2E]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {isBn
                  ? `${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}`
                  : `${MONTHS_EN[currentMonthIndex]} ${currentYear}`}
              </span>
            </div>

            <button
              type="button"
              onClick={onNextMonth}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setAuditYear((y) => y - 1);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
                {isBn ? `অর্থবছর ${toBengaliNumber(auditYear)}` : `Fiscal Year ${auditYear}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setAuditYear((y) => y + 1);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        )}

        {/* Sub-Admin Report Scope Selector */}
        {isSubAdmin && (
          <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
              <span>{isBn ? 'পিডিএফ ও রিপোর্ট ফিল্টার (সাব-এডমিন)' : 'Report & PDF Scope (Sub-Admin)'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                {reportScope === 'own'
                  ? isBn
                    ? 'আমার লেনদেন'
                    : 'My Entries'
                  : isBn
                    ? 'সম্পূর্ণ হিসাব'
                    : 'Full Report'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/50">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setReportScope('own');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  reportScope === 'own'
                    ? 'bg-[#E52E2E] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'শুধু আমার লেনদেন' : 'My Transactions'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setReportScope('all');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  reportScope === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isBn ? 'পুরো হিসাব (সকল)' : 'All Transactions'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Export Actions Row (PDF + Excel + CSV) */}
        <div className="grid grid-cols-12 gap-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="col-span-6 h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {reportPeriod === 'monthly'
                ? isBn
                  ? 'মাসিক PDF প্রিন্ট'
                  : 'Monthly PDF'
                : isBn
                  ? 'বাৎসরিক PDF প্রিন্ট'
                  : 'Yearly PDF'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="col-span-4 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="col-span-2 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 active:scale-98 transition-all cursor-pointer"
            title="CSV"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* MONTHLY MODE VIEW                                             */}
        {/* ============================================================ */}
        {reportPeriod === 'monthly' ? (
          <>
            <DailyIncomeExpenseChart
              transactions={scopedTransactions}
              lang={lang}
              currentMonthIndex={currentMonthIndex}
              currentYear={currentYear}
            />

            {/* Monthly Statement Card */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-900 dark:text-white overflow-x-auto">
              <div className="text-center mb-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  প্রত্যাশা ক্যাবল নেটওয়ার্ক
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার
                </p>
              </div>

              <div className="border-b-2 border-slate-200 dark:border-slate-800 my-3" />

              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 py-1 flex-wrap gap-2">
                <div>
                  <span>মাস : </span>
                  <span className="text-slate-900 dark:text-white">
                    {MONTHS_BN[currentMonthIndex]} {toBengaliNumber(currentYear)}
                  </span>
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white">
                  দৈনিক লেনদেন হিসাব
                </div>
                <div>
                  <span>তারিখ : </span>
                  <span>
                    ০১-{toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate())}/
                    {toBengaliNumber(currentMonthIndex + 1)}/{toBengaliNumber(currentYear)}
                  </span>
                </div>
              </div>

              <div className="border-b-2 border-slate-200 dark:border-slate-800 my-3" />

              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#E52E2E]" />
                <span>বিস্তারিত লেনদেন তালিকা</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-16">তারিখ</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 text-left min-w-[140px]">বিবরণ</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 min-w-[100px]">রেফারেন্স</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-20">আয়</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-20">ব্যয়</th>
                      <th className="p-2.5 w-16">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activeTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">
                          এই মাসে কোনো লেনদেন সম্পন্ন হয়নি
                        </td>
                      </tr>
                    ) : (
                      activeTransactions.map((trx) => {
                        const isInc = trx.type === 'income';
                        const shortDate = getShortDateStr(trx.date);
                        const desc = trx.person && trx.person !== trx.category ? trx.person : (trx.category || (isInc ? 'অন্যান্য আয়' : 'অন্যান্য খরচ'));
                        const ref = trx.note || (trx.person && trx.person !== trx.category ? trx.category : trx.method) || '-';
                        const incAmt = isInc ? toBengaliNumber(trx.amount) : '';
                        const expAmt = !isInc ? toBengaliNumber(trx.amount) : '';
                        const statusStr = isInc ? 'আয়' : 'পরিশোধ';

                        return (
                          <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400">
                              {shortDate}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-left font-bold text-slate-900 dark:text-slate-100">
                              {desc}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                              {ref}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                              {incAmt}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                              {expAmt}
                            </td>
                            <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">
                              {statusStr}
                            </td>
                          </tr>
                        );
                      })
                    )}

                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                      <td colSpan={3} className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700">
                        মোট :
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {toBengaliNumber(totalIncome)}
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 tabular-nums">
                        {toBengaliNumber(totalExpense)}
                      </td>
                      <td className="p-2.5 text-center">টাকা</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 max-w-xs bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 mb-3">
                  টোটাল মাসিক আয় - ব্যয়
                </h4>
                <div className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between">
                    <span>টোটাল আয় -</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {toBengaliNumber(totalIncome)}
                      </span>
                      <span>টাকা</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>টোটাল ব্যয় -</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-600 dark:text-rose-400 tabular-nums">
                        {toBengaliNumber(totalExpense)}
                      </span>
                      <span>টাকা</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-slate-900 dark:border-slate-100 pt-2.5 mt-2 flex items-center justify-between text-sm font-black">
                    <span>মোট =</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base text-slate-900 dark:text-white tabular-nums">
                        {toBengaliNumber(netBalance)}
                      </span>
                      <span>টাকা</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap gap-4">
                <div>কম্পিউটার জেনারেটেড রিপোর্ট</div>
                <div className="text-center">
                  <div className="w-36 border-t border-slate-600 dark:border-slate-400 mb-1 mx-auto" />
                  <div>কর্তৃপক্ষের স্বাক্ষর</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ============================================================ */
          /* YEARLY AUDIT VIEW (12-MONTH CHART + KPI + TABLE + CATEGORIES) */
          /* ============================================================ */
          <>
            {/* Yearly KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isBn ? 'বাৎসরিক আয়' : 'Yearly Income'}</span>
                </div>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1">
                  ৳{formatNum(yearlyData.totalIncome)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{isBn ? 'বাৎসরিক ব্যয়' : 'Yearly Expense'}</span>
                </div>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1">
                  ৳{formatNum(yearlyData.totalExpense)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {isBn ? 'নিট লাভ / ব্যালেন্স' : 'Net Balance'}
                </p>
                <p
                  className={`text-base sm:text-lg font-black tabular-nums mt-1 ${
                    yearlyData.netBalance >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  ৳{formatNum(yearlyData.netBalance)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'লাভের হার / সর্বোচ্চ মাস' : 'Margin / Top Month'}
                </p>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatNum(yearlyData.profitMargin)}%
                  {yearlyData.bestMonth && yearlyData.bestMonth.income > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      ({isBn ? yearlyData.bestMonth.monthBn : yearlyData.bestMonth.monthEn})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 12-Month Comparative BarChart */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn
                      ? `১২ মাসের তুলনামূলক আয়-ব্যয় (${toBengaliNumber(auditYear)})`
                      : `12-Month Income vs Expense (${auditYear})`}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn ? 'সবুজ = আয়, লাল = ব্যয়' : 'Green = Income, Red = Expense'}
                  </p>
                </div>
              </div>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yearlyData.monthlyBreakdown}
                    margin={{ top: 8, right: 6, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                    <XAxis
                      dataKey="shortLabel"
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    />
                    <Bar
                      dataKey="income"
                      name={isBn ? 'আয়' : 'Income'}
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      name={isBn ? 'ব্যয়' : 'Expense'}
                      fill="#e11d48"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yearly 12-Month Audit Statement Table */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  প্রত্যাশা ক্যাবল নেটওয়ার্ক — বাৎসরিক অডিট ({toBengaliNumber(auditYear)})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isBn
                    ? `মোট ${toBengaliNumber(yearlyData.transactions.length)}টি লেনদেনের পূর্ণাঙ্গ বিশ্লেষণ`
                    : `Full audit across ${yearlyData.transactions.length} transactions`}
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 text-left">মাস</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-16">এন্ট্রি</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 text-right">আয় (৳)</th>
                      <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 text-right">ব্যয় (৳)</th>
                      <th className="p-2.5 text-right">নিট (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {yearlyData.monthlyBreakdown.map((m) => (
                      <tr key={m.monthIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-left font-bold text-slate-900 dark:text-slate-100">
                          {isBn ? m.monthBn : m.monthEn}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 tabular-nums">
                          {formatNum(m.count)}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatNum(m.income)}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {formatNum(m.expense)}
                        </td>
                        <td
                          className={`p-2.5 text-right font-extrabold tabular-nums ${
                            m.net >= 0
                              ? 'text-slate-900 dark:text-white'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {formatNum(m.net)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100/80 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                      <td className="p-2.5 text-left border-r border-slate-300 dark:border-slate-700">সর্বমোট :</td>
                      <td className="p-2.5 border-r border-slate-300 dark:border-slate-700 tabular-nums">
                        {formatNum(yearlyData.transactions.length)}
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatNum(yearlyData.totalIncome)}
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 tabular-nums">
                        {formatNum(yearlyData.totalExpense)}
                      </td>
                      <td className="p-2.5 text-right tabular-nums">
                        {formatNum(yearlyData.netBalance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Category-wise Audit Breakdown */}
              {(yearlyData.incomeCategories.length > 0 || yearlyData.expenseCategories.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2">
                    <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5" />
                      <span>{isBn ? 'খাতভিত্তিক বাৎসরিক আয়' : 'Yearly Income by Category'}</span>
                    </h4>
                    <div className="space-y-1.5">
                      {yearlyData.incomeCategories.slice(0, 6).map((c) => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold truncate pr-2">
                            {c.name}
                          </span>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
                            ৳{formatNum(c.amount)}
                          </span>
                        </div>
                      ))}
                      {yearlyData.incomeCategories.length === 0 && (
                        <p className="text-xs text-slate-400">{isBn ? 'কোনো আয় নেই' : 'No income'}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2">
                    <h4 className="text-xs font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5" />
                      <span>{isBn ? 'খাতভিত্তিক বাৎসরিক ব্যয়' : 'Yearly Expense by Category'}</span>
                    </h4>
                    <div className="space-y-1.5">
                      {yearlyData.expenseCategories.slice(0, 6).map((c) => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-semibold truncate pr-2">
                            {c.name}
                          </span>
                          <span className="font-extrabold text-rose-700 dark:text-rose-400 tabular-nums shrink-0">
                            ৳{formatNum(c.amount)}
                          </span>
                        </div>
                      ))}
                      {yearlyData.expenseCategories.length === 0 && (
                        <p className="text-xs text-slate-400">{isBn ? 'কোনো ব্যয় নেই' : 'No expense'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
