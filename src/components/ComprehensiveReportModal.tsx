import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Receipt,
  CreditCard,
  Package,
  Headphones,
  UserCheck,
  Search,
  Calendar,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BarChart3,
  Layers,
  ListOrdered,
  ArrowUpDown,
  LayoutDashboard
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  Language,
  Transaction as MainTransaction,
  PaymentChannel,
  SupportTicket,
  StaffAttendanceRecord,
  UserSession
} from '../types';
import {
  Transaction as AyByayTransaction,
  SalaryPayment,
  InventoryItem,
  InventoryLog
} from '../portals/ayByay/types';
import { staffDb } from '../utils/firebase';
import { safeStorage } from '../utils/safeStorage';
import { sounds } from '../utils/audio';
import { formatCurrency, formatSignedCurrency, toBengaliNumber } from '../utils/formatters';
import { fetchBillServiceSummary, BillServiceSummary } from '../portals/ayByay/utils/billSyncHelper';
import { BillServiceType } from '../portals/billManager/types';
import { getPrevMonthKey } from '../portals/ayByay/data/categories';
import {
  REPORT_MONTHS_BN,
  REPORT_MONTHS_EN,
  REPORT_MONTHS_SHORT_BN,
  REPORT_MONTHS_SHORT_EN,
  buildComprehensiveReport,
  buildAutomatedReportHtml,
  exportAutomatedReportExcel
} from '../utils/appReportEngine';

interface ComprehensiveReportModalProps {
  isOpen: boolean;
  lang: Language;
  user: UserSession | null;
  mainTransactions: MainTransaction[];
  channels: PaymentChannel[];
  supportTickets: SupportTicket[];
  attendanceRecords: StaffAttendanceRecord[];
  onClose: () => void;
}

type SectionKey =
  | 'overview'
  | 'analytics'
  | 'matrix'
  | 'categories'
  | 'bills_channels'
  | 'operations'
  | 'ledger';

const printReportViaIframe = (htmlContent: string) => {
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

export const ComprehensiveReportModal: React.FC<ComprehensiveReportModalProps> = ({
  isOpen,
  lang,
  mainTransactions,
  channels,
  supportTickets,
  attendanceRecords,
  onClose
}) => {
  const isBn = lang === 'bn';
  const now = new Date();

  const [mode, setMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(now.getMonth());
  const [isSyncingBills, setIsSyncingBills] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [chartMetric, setChartMetric] = useState<'company' | 'channel'>('company');

  // Ledger Search, Filter & Chronological Order State (default: 'asc' => 1st added on top, 2nd below)
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerModuleFilter, setLedgerModuleFilter] = useState<'all' | 'ay-byay' | 'channel'>('all');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [ledgerOrder, setLedgerOrder] = useState<'asc' | 'desc'>('asc');
  const [ledgerLimit, setLedgerLimit] = useState(40);

  // Section refs for smooth workspace navigation
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<SectionKey, HTMLElement | null>>({
    overview: null,
    analytics: null,
    matrix: null,
    categories: null,
    bills_channels: null,
    operations: null,
    ledger: null
  });

  const scrollToSection = (key: SectionKey) => {
    sounds.playTap();
    setActiveSection(key);
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Live Ay-Byay Data synced from cache + Firestore staffDb
  const [ayByayTxns, setAyByayTxns] = useState<AyByayTransaction[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_txns');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [ayByaySalaries, setAyByaySalaries] = useState<SalaryPayment[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_salaries');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_inventory');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const raw = safeStorage.getItem('isp_cache_inventory_logs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [liveBillMap, setLiveBillMap] = useState<Record<string, BillServiceSummary | null>>({});

  // Subscribe to staffDb collections cleanly while Report Page is open
  useEffect(() => {
    if (!isOpen) return;

    const unsubs: (() => void)[] = [];

    try {
      unsubs.push(
        onSnapshot(
          collection(staffDb, 'ay_byay_transactions'),
          (snap) => {
            const list: AyByayTransaction[] = [];
            snap.forEach((d) => {
              const data = d.data() as any;
              if (data && !data.isDeleted && (!data.source || data.source === 'ay-byay')) {
                list.push({ ...data, id: data.id || d.id });
              }
            });
            setAyByayTxns(list);
            try {
              safeStorage.setItem('isp_cache_txns', JSON.stringify(list));
            } catch {}
          },
          () => {}
        )
      );
    } catch {}

    try {
      unsubs.push(
        onSnapshot(
          collection(staffDb, 'ay_byay_salaries'),
          (snap) => {
            const list: SalaryPayment[] = [];
            snap.forEach((d) => {
              const data = d.data() as SalaryPayment;
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
        )
      );
    } catch {}

    try {
      unsubs.push(
        onSnapshot(
          collection(staffDb, 'ay_byay_inventory'),
          (snap) => {
            const list: InventoryItem[] = [];
            snap.forEach((d) => {
              const data = d.data() as InventoryItem;
              if (data && (data.id || d.id)) {
                list.push({ ...data, id: data.id || d.id });
              }
            });
            setInventoryItems(list);
            try {
              safeStorage.setItem('isp_cache_inventory', JSON.stringify(list));
            } catch {}
          },
          () => {}
        )
      );
    } catch {}

    try {
      unsubs.push(
        onSnapshot(
          collection(staffDb, 'ay_byay_inventory_logs'),
          (snap) => {
            const list: InventoryLog[] = [];
            snap.forEach((d) => {
              const data = d.data() as InventoryLog;
              if (data && (data.id || d.id)) {
                list.push({ ...data, id: data.id || d.id });
              }
            });
            setInventoryLogs(list);
            try {
              safeStorage.setItem('isp_cache_inventory_logs', JSON.stringify(list));
            } catch {}
          },
          () => {}
        )
      );
    } catch {}

    return () => {
      unsubs.forEach((u) => {
        try {
          u();
        } catch {}
      });
    };
  }, [isOpen]);

  // Fetch live Bill Manager Pro sheets for active month
  const syncMonthBillSheets = useCallback(async (monthYM: string, forceFresh = false) => {
    setIsSyncingBills(true);
    try {
      const services: BillServiceType[] = ['নেট বিল', 'ডিস বিল', 'নেট সংযোগ', 'বকেয়া বিল'];
      const results = await Promise.all(
        services.map(async (st) => {
          const targetYM = st === 'বকেয়া বিল' ? getPrevMonthKey(monthYM) : monthYM;
          const summary = await fetchBillServiceSummary(st, targetYM, forceFresh);
          return { key: `${st}__${targetYM}`, summary };
        })
      );
      setLiveBillMap((prev) => {
        const next = { ...prev };
        results.forEach(({ key, summary }) => {
          if (summary) next[key] = summary;
        });
        return next;
      });
    } catch {
      // Resilient fallback to cached sheet & aggregates
    } finally {
      setIsSyncingBills(false);
    }
  }, []);

  // Sync all 12 months when user requests manual refresh in Annual mode
  const syncAnnualBillSheets = useCallback(async (year: number, forceFresh = false) => {
    setIsSyncingBills(true);
    try {
      const services: BillServiceType[] = ['নেট বিল', 'ডিস বিল', 'নেট সংযোগ', 'বকেয়া বিল'];
      const batchUpdates: Record<string, BillServiceSummary | null> = {};
      for (let m = 0; m < 12; m++) {
        const mYM = `${year}-${String(m + 1).padStart(2, '0')}`;
        const res = await Promise.all(
          services.map(async (st) => {
            const targetYM = st === 'বকেয়া বিল' ? getPrevMonthKey(mYM) : mYM;
            const summary = await fetchBillServiceSummary(st, targetYM, forceFresh);
            return { key: `${st}__${targetYM}`, summary };
          })
        );
        res.forEach(({ key, summary }) => {
          if (summary) batchUpdates[key] = summary;
        });
      }
      setLiveBillMap((prev) => ({ ...prev, ...batchUpdates }));
    } catch {
      // keep cached fallback
    } finally {
      setIsSyncingBills(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const monthYM = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}`;
    syncMonthBillSheets(monthYM, false);
  }, [isOpen, selectedYear, selectedMonthIdx, syncMonthBillSheets]);

  // Dynamic available years detected from dataset
  const availableYears = useMemo(() => {
    const years = new Set<number>([now.getFullYear(), now.getFullYear() - 1, 2025, 2026]);
    ayByayTxns.forEach((t) => {
      const y = parseInt((t.date || t.createdAt || '').substring(0, 4), 10);
      if (y >= 2020 && y <= 2035) years.add(y);
    });
    mainTransactions.forEach((t) => {
      const y = parseInt((t.date || '').substring(0, 4), 10);
      if (y >= 2020 && y <= 2035) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [ayByayTxns, mainTransactions]);

  // Compute full automated report object
  const report = useMemo(() => {
    return buildComprehensiveReport({
      mode,
      year: selectedYear,
      monthIndex: selectedMonthIdx,
      ayByayTxns,
      ayByaySalaries,
      inventoryItems,
      inventoryLogs,
      mainTransactions,
      channels,
      supportTickets,
      attendanceRecords,
      liveBillMap
    });
  }, [
    mode,
    selectedYear,
    selectedMonthIdx,
    ayByayTxns,
    ayByaySalaries,
    inventoryItems,
    inventoryLogs,
    mainTransactions,
    channels,
    supportTickets,
    attendanceRecords,
    liveBillMap
  ]);

  // Chronological filtered ledger with running cumulative balance
  const { ledgerItemsWithRunning, ledgerFilteredIn, ledgerFilteredOut } = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    const matched = report.ledgerRows.filter((row) => {
      if (ledgerModuleFilter !== 'all' && row.sourceModule !== ledgerModuleFilter) return false;
      if (ledgerTypeFilter !== 'all' && row.type !== ledgerTypeFilter) return false;
      if (q) {
        const hay = `${row.category} ${row.method} ${row.description} ${row.date}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // Always compute running cumulative net along true chronological order (1st -> last)
    let running = 0;
    let totalIn = 0;
    let totalOut = 0;
    const withRunning = matched.map((row, idx) => {
      if (row.type === 'income') {
        running += row.amount;
        totalIn += row.amount;
      } else {
        running -= row.amount;
        totalOut += row.amount;
      }
      return {
        ...row,
        filteredIndex: idx + 1,
        runningBalance: running
      };
    });

    const ordered = ledgerOrder === 'asc' ? withRunning : [...withRunning].reverse();
    return {
      ledgerItemsWithRunning: ordered,
      ledgerFilteredIn: totalIn,
      ledgerFilteredOut: totalOut
    };
  }, [report.ledgerRows, ledgerSearch, ledgerModuleFilter, ledgerTypeFilter, ledgerOrder]);

  if (!isOpen) return null;

  const fmt = (n: number) => (isBn ? toBengaliNumber(formatCurrency(n, 'bn')) : formatCurrency(n, 'en'));
  const fmtSigned = (n: number) =>
    isBn ? toBengaliNumber(formatSignedCurrency(n, 'bn')) : formatSignedCurrency(n, 'en');
  const numFmt = (n: number | string) => (isBn ? toBengaliNumber(n) : String(n));

  const isNetLoss = report.companyNet < 0;
  const isBreakEven = report.companyNet === 0;
  const profitMarginPct =
    report.companyIncome > 0 ? Math.round((report.companyNet / report.companyIncome) * 100) : 0;
  const expenseRatioPct =
    report.companyIncome > 0 ? Math.round((report.companyExpense / report.companyIncome) * 100) : 0;
  const payrollSharePct =
    report.companyExpense > 0 ? Math.round((report.salaryPaidTotal / report.companyExpense) * 100) : 0;

  const handlePrevPeriod = () => {
    sounds.playTap();
    if (mode === 'monthly') {
      if (selectedMonthIdx === 0) {
        setSelectedYear((y) => y - 1);
        setSelectedMonthIdx(11);
      } else {
        setSelectedMonthIdx((m) => m - 1);
      }
    } else {
      setSelectedYear((y) => y - 1);
    }
  };

  const handleNextPeriod = () => {
    sounds.playTap();
    if (mode === 'monthly') {
      if (selectedMonthIdx === 11) {
        setSelectedYear((y) => y + 1);
        setSelectedMonthIdx(0);
      } else {
        setSelectedMonthIdx((m) => m + 1);
      }
    } else {
      setSelectedYear((y) => y + 1);
    }
  };

  const handlePrintPdf = () => {
    sounds.playSuccess();
    const html = buildAutomatedReportHtml(report, lang);
    printReportViaIframe(html);
  };

  const handleDownloadExcel = async () => {
    sounds.playSuccess();
    setIsExportingExcel(true);
    try {
      await exportAutomatedReportExcel(report, lang);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleRefresh = () => {
    sounds.playTap();
    if (mode === 'monthly') {
      syncMonthBillSheets(`${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}`, true);
    } else {
      syncAnnualBillSheets(selectedYear, true);
    }
  };

  const chartData =
    mode === 'monthly'
      ? report.dailySeries.map((d) => ({
          name: isBn ? d.dayLabel : d.day,
          income: chartMetric === 'company' ? d.income : d.channelIn,
          expense: chartMetric === 'company' ? d.expense : d.channelOut
        }))
      : report.yearlyMonthlyMatrix.map((m) => ({
          name: isBn ? m.shortBn : m.shortEn,
          income: chartMetric === 'company' ? m.companyIncome : m.channelIn,
          expense: chartMetric === 'company' ? m.companyExpense : m.channelOut
        }));

  const navItems: { key: SectionKey; labelBn: string; labelEn: string; icon: React.ReactNode; show?: boolean }[] = [
    { key: 'overview', labelBn: 'সংক্ষিপ্ত পরিসংখ্যান', labelEn: 'Executive KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'analytics', labelBn: 'আর্থিক প্রবাহ গ্রাফ', labelEn: 'Cashflow Chart', icon: <BarChart3 className="w-4 h-4" /> },
    {
      key: 'matrix',
      labelBn: '১২ মাসের ম্যাট্রিক্স',
      labelEn: '12-Month Matrix',
      icon: <Calendar className="w-4 h-4" />,
      show: mode === 'yearly'
    },
    { key: 'categories', labelBn: 'খাতভিত্তিক আয়-ব্যয়', labelEn: 'Categories', icon: <Layers className="w-4 h-4" /> },
    { key: 'bills_channels', labelBn: 'বিল ও চ্যানেল', labelEn: 'Bills & Channels', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'operations', labelBn: 'বেতন ও অপারেশন', labelEn: 'Operations', icon: <Package className="w-4 h-4" /> },
    { key: 'ledger', labelBn: 'বিস্তারিত লেনদেন খাতা', labelEn: 'Chronological Ledger', icon: <ListOrdered className="w-4 h-4" /> }
  ];

  const visibleNavItems = navItems.filter((n) => n.show !== false);

  return (
    <div className="fixed inset-0 z-[130] bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Sticky Enterprise Header Bar: 3 clean zones */}
      <header className="shrink-0 bg-white dark:bg-[#0F172A] border-b border-slate-200/90 dark:border-slate-800/90 px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label={isBn ? 'ফিরে যান' : 'Back'}
            className="min-w-[44px] min-h-[44px] w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap truncate">
              <span>{isBn ? 'রিপোর্ট সেন্টার' : 'Reports'}</span>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">
                {isBn ? report.periodTitleBn : report.periodTitleEn}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate whitespace-nowrap">
              {isBn ? 'অটোমেটেড অ্যাপ রিপোর্ট' : 'Automated App Report'}
            </h1>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <span>{isBn ? 'প্রতিষ্ঠানের পূর্ণাঙ্গ অটোমেশন হিসাব' : 'Organizational Automation Ledger'}</span>
          <span>·</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
            {isSyncingBills ? (isBn ? 'সিংক হচ্ছে...' : 'Syncing...') : isBn ? 'লাইভ সংযুক্ত' : 'Live Synced'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isSyncingBills}
            title={isBn ? 'লাইভ ডেটা রিফ্রেশ করুন' : 'Refresh live data'}
            className="min-h-[40px] px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingBills ? 'animate-spin text-rose-600' : ''}`} />
            <span className="hidden md:inline">{isBn ? 'সিংক' : 'Sync'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={isExportingExcel}
            className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="min-h-[40px] px-3.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? 'PDF / প্রিন্ট' : 'PDF / Print'}</span>
          </button>
        </div>
      </header>

      {/* Enterprise Workspace Split: Left Navigation Rail (Desktop) + Scrollable Main Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Rail (240px) */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-white dark:bg-[#0F172A] border-r border-slate-200/90 dark:border-slate-800/90 p-4 overflow-y-auto">
          <div className="space-y-5">
            {/* Period Health Summary Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>{mode === 'monthly' ? (isBn ? 'নির্বাচিত মাস' : 'Selected Month') : isBn ? 'অর্থবছর' : 'Fiscal Year'}</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                  {mode === 'monthly' ? report.monthYM : selectedYear}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? report.periodTitleBn : report.periodTitleEn}
              </div>
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isNetLoss ? (isBn ? 'নিট লস' : 'Net Loss') : isBn ? 'নিট মুনাফা' : 'Net Profit'}
                </span>
                <span
                  className={`text-sm font-extrabold font-mono tabular-nums ${
                    isNetLoss
                      ? 'text-rose-600 dark:text-rose-400'
                      : isBreakEven
                      ? 'text-slate-600 dark:text-slate-300'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {fmtSigned(report.companyNet)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                <span>{isBn ? 'বিল আদায় হার' : 'Bill Rate'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{numFmt(report.billCollectionRate)}%</span>
              </div>
            </div>

            {/* Quick Section Jump Links */}
            <div className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isBn ? 'রিপোর্ট সেকশনসমূহ' : 'Report Sections'}
              </div>
              {visibleNavItems.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => scrollToSection(item.key)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Compliance Footer */}
          <div className="mt-6 pt-3.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{isBn ? 'শুধু কোম্পানি হিসাব' : 'Company Scope Only'}</span>
            </div>
            <p>
              {isBn
                ? 'ব্যক্তিগত লেনদেন এবং স্টাফ বা মালিকের পাওনা হিসাব এই রিপোর্টে যুক্ত করা হয়নি।'
                : 'Personal transactions, staff dues & owner dividend shares are excluded.'}
            </p>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 pb-20">
            {/* Period Switcher & Month Selection Toolbar */}
            <section className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Mode Toggle: Monthly vs Annual */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 self-start">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setMode('monthly');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      mode === 'monthly'
                        ? 'bg-[#E52E2E] text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isBn ? 'মাসিক রিপোর্ট' : 'Monthly Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setMode('yearly');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      mode === 'yearly'
                        ? 'bg-[#E52E2E] text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isBn ? 'বাৎসরিক রিপোর্ট' : 'Annual Report'}
                  </button>
                </div>

                {/* Year & Month Picker */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevPeriod}
                    aria-label={isBn ? 'পূর্ববর্তী সময়' : 'Previous period'}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer tabular-nums"
                    >
                      {availableYears.map((y) => (
                        <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {isBn ? `${toBengaliNumber(y)} সাল` : `${y}`}
                        </option>
                      ))}
                    </select>
                    {mode === 'monthly' && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <select
                          value={selectedMonthIdx}
                          onChange={(e) => setSelectedMonthIdx(parseInt(e.target.value, 10))}
                          className="bg-transparent text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                        >
                          {REPORT_MONTHS_BN.map((mBn, idx) => (
                            <option key={idx} value={idx} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {isBn ? mBn : REPORT_MONTHS_EN[idx]}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextPeriod}
                    aria-label={isBn ? 'পরবর্তী সময়' : 'Next period'}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 12-Month Quick Selection Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {REPORT_MONTHS_SHORT_BN.map((shortBn, idx) => {
                  const isSelected = mode === 'monthly' && selectedMonthIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setSelectedMonthIdx(idx);
                        setMode('monthly');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isBn ? shortBn : REPORT_MONTHS_SHORT_EN[idx]}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Section Quick Jump Strip */}
              <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => scrollToSection(item.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
                      activeSection === item.key
                        ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.icon}
                    <span>{isBn ? item.labelBn : item.labelEn}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 1: 4-Column Executive KPI Strip */}
            <section
              ref={(el) => {
                sectionRefs.current.overview = el;
              }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 scroll-mt-4"
            >
              {/* KPI 1: Company Income */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-[3px] bg-emerald-600" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{isBn ? 'কোম্পানি মোট আয়' : 'Company Income'}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2.5 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
                    {fmt(report.companyIncome)}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{isBn ? `${numFmt(report.companyIncomeCount)} টি আয় এন্ট্রি` : `${report.companyIncomeCount} entries`}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {isBn ? report.periodTitleBn : report.periodTitleEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI 2: Company Expense */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-[3px] bg-rose-600" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{isBn ? 'কোম্পানি মোট ব্যয়' : 'Company Expense'}</span>
                    <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="mt-2.5 text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums tracking-tight">
                    {fmt(report.companyExpense)}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{isBn ? `বেতন: ${fmt(report.salaryPaidTotal)}` : `Payroll: ${fmt(report.salaryPaidTotal)}`}</span>
                    <span>{isBn ? `ব্যয় হার ${numFmt(expenseRatioPct)}%` : `${expenseRatioPct}% of inc.`}</span>
                  </div>
                </div>
              </div>

              {/* KPI 3: Net Profit / Net Loss (Signed) */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className={`h-[3px] ${isNetLoss ? 'bg-rose-600' : isBreakEven ? 'bg-slate-400' : 'bg-emerald-600'}`} />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>
                      {isNetLoss
                        ? isBn
                          ? 'নিট লস / ঘাটতি'
                          : 'Net Loss / Deficit'
                        : isBreakEven
                        ? isBn
                          ? 'নিট ব্যালেন্স'
                          : 'Break-even'
                        : isBn
                        ? 'নিট মুনাফা / লাভ'
                        : 'Net Profit'}
                    </span>
                    {isNetLoss ? (
                      <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    ) : isBreakEven ? (
                      <Minus className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div
                    className={`mt-2.5 text-2xl font-extrabold font-mono tabular-nums tracking-tight ${
                      isNetLoss
                        ? 'text-rose-600 dark:text-rose-400'
                        : isBreakEven
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {fmtSigned(report.companyNet)}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      {isNetLoss
                        ? isBn
                          ? 'আয়ের তুলনায় ঘাটতি'
                          : 'Operating deficit'
                        : isBn
                        ? 'নিট মার্জিন'
                        : 'Net margin'}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {profitMarginPct < 0 ? `-${numFmt(Math.abs(profitMarginPct))}%` : `${numFmt(profitMarginPct)}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI 4: Channel Cashflow */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className="h-[3px] bg-slate-800 dark:bg-slate-400" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{isBn ? 'চ্যানেল নিট প্রবাহ' : 'Channel Net Flow'}</span>
                    <Wallet className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div
                    className={`mt-2.5 text-2xl font-extrabold font-mono tabular-nums tracking-tight ${
                      report.channelNetFlow < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {fmtSigned(report.channelNetFlow)}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>{isBn ? `জমা ${fmt(report.channelTotalIn)}` : `In ${fmt(report.channelTotalIn)}`}</span>
                    <span>{isBn ? `খরচ ${fmt(report.channelTotalOut)}` : `Out ${fmt(report.channelTotalOut)}`}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Analytics Chart (2/3) + Financial Structure Panel (1/3) */}
            <section
              ref={(el) => {
                sectionRefs.current.analytics = el;
              }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch scroll-mt-4"
            >
              {/* Primary Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {mode === 'monthly'
                        ? isBn
                          ? `দৈনিক আর্থিক প্রবাহ (${report.periodTitleBn})`
                          : `Daily Financial Flow (${report.periodTitleEn})`
                        : isBn
                        ? `১২ মাসের তুলনামূলক প্রবাহ (${numFmt(selectedYear)})`
                        : `12-Month Comparative Flow (${selectedYear})`}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সবুজ: জমা / আয় · লাল: খরচ / ব্যয়' : 'Green: Inflow / Income · Red: Outflow / Expense'}
                    </p>
                  </div>

                  {/* Chart Dataset Switch */}
                  <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setChartMetric('company');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                        chartMetric === 'company'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isBn ? 'কোম্পানি আয়-ব্যয়' : 'Company P/L'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setChartMetric('channel');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                        chartMetric === 'channel'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isBn ? 'পেমেন্ট চ্যানেল' : 'Channels'}
                    </button>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        width={52}
                        tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                      />
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          fmt(Number(val) || 0),
                          name === 'income'
                            ? chartMetric === 'company'
                              ? isBn
                                ? 'কোম্পানি আয়'
                                : 'Company Income'
                              : isBn
                              ? 'চ্যানেল জমা'
                              : 'Channel In'
                            : chartMetric === 'company'
                            ? isBn
                              ? 'কোম্পানি ব্যয়'
                              : 'Company Expense'
                            : isBn
                            ? 'চ্যানেল খরচ'
                            : 'Channel Out'
                        ]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          backgroundColor: '#ffffff',
                          color: '#0f172a'
                        }}
                      />
                      <ReferenceLine y={0} stroke="#94a3b8" />
                      <Bar dataKey="income" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={24} />
                      <Bar dataKey="expense" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Structure & Ratio Breakdown */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'অটোমেশন সূচক ও অনুপাত' : 'Automation Ratios'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'ব্যয় কাঠামো, বিল আদায় ও অপারেশন দক্ষতা' : 'Cost split, billing efficiency & operations'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Ratio 1: Operating vs Payroll */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {isBn ? 'ব্যয়ের মধ্যে বেতন অংশ' : 'Payroll Share of Expense'}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {numFmt(payrollSharePct)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-slate-800 dark:bg-slate-300 rounded-full"
                        style={{ width: `${Math.min(100, payrollSharePct)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>{isBn ? `বেতন: ${fmt(report.salaryPaidTotal)}` : `Payroll: ${fmt(report.salaryPaidTotal)}`}</span>
                      <span>{isBn ? `পরিচালনা: ${fmt(report.otherOperatingExpense)}` : `Ops: ${fmt(report.otherOperatingExpense)}`}</span>
                    </div>
                  </div>

                  {/* Ratio 2: Bill Pro Collection */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {isBn ? 'বিল ম্যানেজমেন্ট প্রো আদায়' : 'Bill Pro Collection'}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {numFmt(report.billCollectionRate)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(100, report.billCollectionRate)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>{isBn ? `আদায়: ${fmt(report.billGrandPaid)}` : `Paid: ${fmt(report.billGrandPaid)}`}</span>
                      <span>{isBn ? `বকেয়া: ${fmt(report.billGrandDue)}` : `Due: ${fmt(report.billGrandDue)}`}</span>
                    </div>
                  </div>

                  {/* Ratio 3: Ticket Resolution */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {isBn ? 'সাপোর্ট টিকেট সমাধান' : 'Ticket Resolution'}
                      </span>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {numFmt(report.ticketsResolutionRate)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, report.ticketsResolutionRate)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>{isBn ? `সমাধান: ${numFmt(report.ticketsResolved)}` : `Resolved: ${report.ticketsResolved}`}</span>
                      <span>{isBn ? `মোট: ${numFmt(report.ticketsTotal)}` : `Total: ${report.ticketsTotal}`}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs tabular-nums">
                  <span className="text-slate-500 dark:text-slate-400">{isBn ? 'চ্যানেল লাইভ ব্যালেন্স' : 'Live Channel Balance'}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {fmtSigned(report.channelTotalLiveBalance)}
                  </span>
                </div>
              </div>
            </section>

            {/* Section 3: Annual 12-Month Matrix (Click any month to inspect) */}
            {mode === 'yearly' && (
              <section
                ref={(el) => {
                  sectionRefs.current.matrix = el;
                }}
                className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden scroll-mt-4"
              >
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? `${numFmt(selectedYear)} সালের ১২ মাসের পূর্ণাঙ্গ ম্যাট্রিক্স (মাস সিলেক্ট করতে ক্লিক করুন)`
                        : `${selectedYear} 12-Month Matrix (Click any month to view details)`}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn
                        ? 'প্রতিটি মাসের আয়-ব্যয়, চ্যানেল প্রবাহ, বিল প্রো আদায় ও অপারেশন সূচক'
                        : 'Monthly P/L, channel flow, Bill Pro collection & operational metrics'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-bold whitespace-nowrap">{isBn ? 'মাস' : 'Month'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'কোম্পানি আয়' : 'Income'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'কোম্পানি ব্যয়' : 'Expense'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'নিট লাভ / লস' : 'Net P/L'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'চ্যানেল জমা' : 'Channel In'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'চ্যানেল খরচ' : 'Channel Out'}</th>
                        <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'বিল প্রো আদায়' : 'Bill Pro Paid'}</th>
                        <th className="py-2.5 px-4 font-bold text-right whitespace-nowrap">{isBn ? 'টিকেট / হাজিরা' : 'Ops'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {report.yearlyMonthlyMatrix.map((row) => (
                        <tr
                          key={row.monthYM}
                          onClick={() => {
                            sounds.playTap();
                            setSelectedMonthIdx(row.monthIndex);
                            setMode('monthly');
                          }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {isBn ? row.monthBn : row.monthEn}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                            {fmt(row.companyIncome)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">
                            {fmt(row.companyExpense)}
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                              row.companyNet < 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : row.companyNet > 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {fmtSigned(row.companyNet)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
                            {fmt(row.channelIn)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
                            {fmt(row.channelOut)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
                            {fmt(row.billPaidTotal)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                            {numFmt(row.ticketsResolved)}/{numFmt(row.ticketsTotal)} · {numFmt(row.attendancePresentRate)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 font-extrabold">
                      <tr>
                        <td className="py-3 px-4 text-slate-900 dark:text-white">{isBn ? 'বাৎসরিক সর্বমোট' : 'Annual Total'}</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{fmt(report.companyIncome)}</td>
                        <td className="py-3 px-3 text-right font-mono text-rose-600 dark:text-rose-400 tabular-nums">{fmt(report.companyExpense)}</td>
                        <td
                          className={`py-3 px-3 text-right font-mono tabular-nums ${
                            isNetLoss ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {fmtSigned(report.companyNet)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white tabular-nums">{fmt(report.channelTotalIn)}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white tabular-nums">{fmt(report.channelTotalOut)}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white tabular-nums">{fmt(report.billGrandPaid)}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                          {numFmt(report.ticketsResolved)}/{numFmt(report.ticketsTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            )}

            {/* Section 4: Category Income & Expense */}
            <section
              ref={(el) => {
                sectionRefs.current.categories = el;
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch scroll-mt-4"
            >
              {/* Income Categories */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'খাতভিত্তিক কোম্পানি আয়' : 'Company Income Categories'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {fmt(report.companyIncome)}
                  </span>
                </div>

                {report.incomeCategories.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'এই সময়কালে কোনো আয় এন্ট্রি নেই' : 'No income entries in this period'}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-1">
                    {report.incomeCategories.map((cat) => (
                      <div key={cat.category} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {cat.category}
                          </div>
                          <div className="mt-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${Math.min(100, cat.percentage)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{fmt(cat.amount)}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {numFmt(cat.count)} টি · {numFmt(cat.percentage)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expense Categories */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'খাতভিত্তিক কোম্পানি ব্যয়' : 'Company Expense Categories'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    {fmt(report.companyExpense)}
                  </span>
                </div>

                {report.expenseCategories.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'এই সময়কালে কোনো ব্যয় এন্ট্রি নেই' : 'No expense entries in this period'}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-1">
                    {report.expenseCategories.map((cat) => (
                      <div key={cat.category} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {cat.category}
                          </div>
                          <div className="mt-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-600 rounded-full"
                              style={{ width: `${Math.min(100, cat.percentage)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{fmt(cat.amount)}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {numFmt(cat.count)} টি · {numFmt(cat.percentage)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Section 5: Bill Manager Pro & Payment Channels */}
            <section
              ref={(el) => {
                sectionRefs.current.bills_channels = el;
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch scroll-mt-4"
            >
              {/* Bill Manager Pro Summary Table */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'বিল ম্যানেজমেন্ট প্রো সারাংশ' : 'Bill Manager Pro Summary'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                    {isBn ? `আদায় হার: ${numFmt(report.billCollectionRate)}%` : `Rate: ${report.billCollectionRate}%`}
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-bold">{isBn ? 'সেবার নাম' : 'Service'}</th>
                        <th className="py-2.5 px-3 font-bold text-right">{isBn ? 'পরিশোধিত' : 'Paid'}</th>
                        <th className="py-2.5 px-3 font-bold text-right">{isBn ? 'বকেয়া' : 'Due'}</th>
                        <th className="py-2.5 px-4 font-bold text-right">{isBn ? 'হার' : 'Rate'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {report.billRows.map((b) => (
                        <tr key={b.serviceType} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                              {isBn ? b.labelBn : b.labelEn}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                              {b.count > 0
                                ? isBn
                                  ? `${numFmt(b.count)} টি গ্রাহক রেকর্ড`
                                  : `${b.count} customer records`
                                : b.source === 'aggregate'
                                ? isBn
                                  ? 'সমন্বিত সামারি ডেটা'
                                  : 'Aggregated summary'
                                : isBn
                                ? 'শীট ডেটা পাওয়া যায়নি'
                                : 'No sheet loaded'}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                            {fmt(b.paid)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">
                            {fmt(b.due)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                            {numFmt(b.collectionRate)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 font-extrabold">
                      <tr>
                        <td className="py-2.5 px-4 text-slate-900 dark:text-white">{isBn ? 'সর্বমোট বিল প্রো' : 'Grand Total'}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{fmt(report.billGrandPaid)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-rose-600 dark:text-rose-400 tabular-nums">{fmt(report.billGrandDue)}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-white tabular-nums">{numFmt(report.billCollectionRate)}%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Channels Statement */}
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'পেমেন্ট চ্যানেল স্টেটমেন্ট' : 'Payment Channels Statement'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                    {isBn ? `লাইভ: ${fmtSigned(report.channelTotalLiveBalance)}` : `Live: ${fmtSigned(report.channelTotalLiveBalance)}`}
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-bold">{isBn ? 'চ্যানেল' : 'Channel'}</th>
                        <th className="py-2.5 px-3 font-bold text-right">{isBn ? 'জমা' : 'Inflow'}</th>
                        <th className="py-2.5 px-3 font-bold text-right">{isBn ? 'খরচ' : 'Outflow'}</th>
                        <th className="py-2.5 px-4 font-bold text-right">{isBn ? 'লাইভ ব্যালেন্স' : 'Live Bal.'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {report.channelRows.map((ch) => (
                        <tr key={ch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                              {isBn ? ch.labelBn : ch.labelEn}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                              {isBn ? `${numFmt(ch.periodCount)} টি লেনদেন` : `${ch.periodCount} entries`}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                            {fmt(ch.periodIn)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">
                            {fmt(ch.periodOut)}
                          </td>
                          <td
                            className={`py-2.5 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                              ch.liveBalance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {fmtSigned(ch.liveBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 6: Operations, Payroll, Inventory & Support */}
            <section
              ref={(el) => {
                sectionRefs.current.operations = el;
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 scroll-mt-4"
            >
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span>{isBn ? 'কোম্পানি বেতন খরচ' : 'Company Payroll Cost'}</span>
                </div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {fmt(report.salaryPaidTotal)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {isBn
                    ? `পরিশোধিত: ${numFmt(report.salaryPaidCount)} · বকেয়া: ${fmt(report.salaryPendingTotal)}`
                    : `Paid: ${report.salaryPaidCount} · Pending: ${fmt(report.salaryPendingTotal)}`}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>{isBn ? 'ইনভেন্টরি ও স্টক মূল্য' : 'Inventory Stock Value'}</span>
                </div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {fmt(report.inventoryTotalValue)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {isBn
                    ? `আইটেম: ${numFmt(report.inventoryTotalItems)} · ইন: ${numFmt(report.inventoryInQty)} · আউট: ${numFmt(report.inventoryOutQty)} · লো: ${numFmt(report.inventoryLowStockCount)}`
                    : `Items: ${report.inventoryTotalItems} · In: ${report.inventoryInQty} · Out: ${report.inventoryOutQty}`}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Headphones className="w-4 h-4 text-slate-500" />
                  <span>{isBn ? 'সাপোর্ট ও অভিযোগ সমাধান' : 'Support Ticket Resolution'}</span>
                </div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {numFmt(report.ticketsResolutionRate)}% ({numFmt(report.ticketsResolved)}/{numFmt(report.ticketsTotal)})
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {isBn
                    ? `চলমান: ${numFmt(report.ticketsInProgress)} · পেন্ডিং: ${numFmt(report.ticketsPending)}`
                    : `In Progress: ${report.ticketsInProgress} · Pending: ${report.ticketsPending}`}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  <span>{isBn ? 'অপারেশনাল উপস্থিতি হার' : 'Operational Attendance'}</span>
                </div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {numFmt(report.attendanceOperationalRate)}%
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {isBn
                    ? `উপস্থিত: ${numFmt(report.attendancePresent)} · দেরি: ${numFmt(report.attendanceLate)} · ছুটি: ${numFmt(report.attendanceLeave)}`
                    : `Present: ${report.attendancePresent} · Late: ${report.attendanceLate} · Leave: ${report.attendanceLeave}`}
                </div>
              </div>
            </section>

            {/* Section 7: Chronological Unified Ledger (1st added on top -> 2nd below -> ...) */}
            <section
              ref={(el) => {
                sectionRefs.current.ledger = el;
              }}
              className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl overflow-hidden scroll-mt-4"
            >
              <div className="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-[#E52E2E]" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? `বিস্তারিত লেনদেন খাতা (${numFmt(ledgerItemsWithRunning.length)} টি এন্ট্রি)`
                        : `Detailed Chronological Ledger (${ledgerItemsWithRunning.length} entries)`}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {ledgerOrder === 'asc'
                      ? isBn
                        ? 'ক্রম: ১ম যোগ করা এন্ট্রি উপরে · ২য় এন্ট্রি নিচে (ক্রমানুসারে সাজানো)'
                        : 'Order: 1st added entry at top · subsequent entries below (Chronological)'
                      : isBn
                      ? 'ক্রম: সর্বশেষ যোগ করা এন্ট্রি উপরে'
                      : 'Order: Latest added entry at top'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      placeholder={isBn ? 'খাত বা বিবরণ খুঁজুন...' : 'Search ledger...'}
                      className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 w-44 sm:w-52"
                    />
                  </div>

                  <select
                    value={ledgerModuleFilter}
                    onChange={(e) => setLedgerModuleFilter(e.target.value as any)}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="all">{isBn ? 'সব মডিউল' : 'All Modules'}</option>
                    <option value="ay-byay">{isBn ? 'আয়-ব্যয়' : 'Ay-Byay'}</option>
                    <option value="channel">{isBn ? 'চ্যানেল' : 'Channels'}</option>
                  </select>

                  <select
                    value={ledgerTypeFilter}
                    onChange={(e) => setLedgerTypeFilter(e.target.value as any)}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="all">{isBn ? 'আয় ও ব্যয়' : 'All Types'}</option>
                    <option value="income">{isBn ? 'শুধু আয়' : 'Income Only'}</option>
                    <option value="expense">{isBn ? 'শুধু ব্যয়' : 'Expense Only'}</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setLedgerOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{ledgerOrder === 'asc' ? (isBn ? '১ম → শেষ' : '1st → Last') : isBn ? 'শেষ → ১ম' : 'Last → 1st'}</span>
                  </button>
                </div>
              </div>

              {ledgerItemsWithRunning.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'নির্বাচিত সময় ও ফিল্টারে কোনো লেনদেন পাওয়া যায়নি'
                      : 'No transactions match the selected period and filter'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3 font-bold w-12 text-center whitespace-nowrap">#</th>
                          <th className="py-2.5 px-3 font-bold whitespace-nowrap">{isBn ? 'তারিখ ও সময়' : 'Date & Time'}</th>
                          <th className="py-2.5 px-3 font-bold whitespace-nowrap">{isBn ? 'মডিউল' : 'Module'}</th>
                          <th className="py-2.5 px-3 font-bold whitespace-nowrap">{isBn ? 'খাত ও মাধ্যম' : 'Category & Method'}</th>
                          <th className="py-2.5 px-3 font-bold">{isBn ? 'বিবরণ' : 'Description'}</th>
                          <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                          <th className="py-2.5 px-4 font-bold text-right whitespace-nowrap">{isBn ? 'ক্রমবর্ধমান স্থিতি' : 'Running Net'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {ledgerItemsWithRunning.slice(0, ledgerLimit).map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                              {numFmt(row.filteredIndex)}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="font-mono font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                                {isBn ? toBengaliNumber(row.date) : row.date}
                              </div>
                              {row.timeLabel && (
                                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                                  {isBn ? toBengaliNumber(row.timeLabel) : row.timeLabel}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap font-semibold">
                              {isBn ? row.moduleLabelBn : row.moduleLabelEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="font-semibold text-slate-800 dark:text-slate-100">{row.category}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{row.method}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                              {row.description}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                                row.type === 'income'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {row.type === 'income' ? '+' : '-'}
                              {fmt(row.amount)}
                            </td>
                            <td
                              className={`py-2.5 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                                row.runningBalance < 0
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {fmtSigned(row.runningBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 font-bold">
                        <tr>
                          <td colSpan={5} className="py-2.5 px-4 text-slate-700 dark:text-slate-200">
                            {isBn
                              ? `ফিল্টারকৃত মোট (${numFmt(ledgerItemsWithRunning.length)} টি এন্ট্রি · জমা ${fmt(ledgerFilteredIn)} · খরচ ${fmt(ledgerFilteredOut)})`
                              : `Filtered Totals (${ledgerItemsWithRunning.length} entries · In ${fmt(ledgerFilteredIn)} · Out ${fmt(ledgerFilteredOut)})`}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                            {fmtSigned(ledgerFilteredIn - ledgerFilteredOut)}
                          </td>
                          <td
                            className={`py-2.5 px-4 text-right font-mono tabular-nums whitespace-nowrap ${
                              ledgerFilteredIn - ledgerFilteredOut < 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {fmtSigned(ledgerFilteredIn - ledgerFilteredOut)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {ledgerItemsWithRunning.length > ledgerLimit && (
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setLedgerLimit((l) => l + 60)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {isBn
                            ? `আরও দেখুন (${numFmt(ledgerItemsWithRunning.length - ledgerLimit)} টি বাকি)`
                            : `Show more (${ledgerItemsWithRunning.length - ledgerLimit} remaining)`}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
