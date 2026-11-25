import {
  Transaction as MainTransaction,
  PaymentChannel,
  SupportTicket,
  StaffAttendanceRecord,
  Language
} from '../types';
import {
  Transaction as AyByayTransaction,
  SalaryPayment,
  InventoryItem,
  InventoryLog
} from '../portals/ayByay/types';
import {
  isIncomeTransaction,
  parseNumber,
  getTransactionMonth,
  getPrevMonthKey
} from '../portals/ayByay/data/categories';
import { ALL_MONTHS } from '../portals/billManager/constants';
import { BillServiceSummary, summarizeCachedSheet } from '../portals/ayByay/utils/billSyncHelper';
import { BillServiceType } from '../portals/billManager/types';
import { safeStorage } from './safeStorage';
import { formatCurrency, formatSignedCurrency, toBengaliNumber } from './formatters';

export const REPORT_MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const REPORT_MONTHS_SHORT_BN = [
  'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন',
  'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
];

export const REPORT_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const REPORT_MONTHS_SHORT_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export interface CategoryStat {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ChannelReportRow {
  id: string;
  name: string;
  labelBn: string;
  labelEn: string;
  periodIn: number;
  periodOut: number;
  periodNet: number;
  periodCount: number;
  liveBalance: number;
}

export interface BillServiceRow {
  serviceType: BillServiceType;
  labelBn: string;
  labelEn: string;
  paid: number;
  due: number;
  total: number;
  count: number;
  collectionRate: number;
  source: 'live' | 'cache' | 'aggregate' | 'none';
}

export interface MonthlyMatrixRow {
  monthIndex: number; // 0..11
  monthYM: string; // YYYY-MM
  monthBn: string;
  monthEn: string;
  shortBn: string;
  shortEn: string;
  companyIncome: number;
  companyExpense: number;
  companyNet: number;
  salaryExpense: number;
  otherExpense: number;
  channelIn: number;
  channelOut: number;
  channelNet: number;
  billPaidTotal: number;
  billDueTotal: number;
  ticketsTotal: number;
  ticketsResolved: number;
  attendancePresentRate: number;
  entryCount: number;
}

export interface UnifiedLedgerRow {
  id: string;
  serialNo: number;
  date: string;
  timeLabel?: string;
  createdTimestamp: number;
  sourceModule: 'ay-byay' | 'channel';
  moduleLabelBn: string;
  moduleLabelEn: string;
  type: 'income' | 'expense';
  category: string;
  method: string;
  description: string;
  amount: number;
}

export interface ComprehensivePeriodReport {
  mode: 'monthly' | 'yearly';
  year: number;
  monthIndex: number; // 0..11
  monthYM: string;
  periodTitleBn: string;
  periodTitleEn: string;

  // 1. Company Business Accounting (Ay-Byay)
  companyIncome: number;
  companyExpense: number;
  companyNet: number;
  companyIncomeCount: number;
  companyExpenseCount: number;
  salaryPaidTotal: number;
  salaryPaidCount: number;
  salaryPendingTotal: number;
  salaryPendingCount: number;
  otherOperatingExpense: number;
  incomeCategories: CategoryStat[];
  expenseCategories: CategoryStat[];

  // 2. Payment Channels (bKash, Nagad, Rocket, Bank, Cash)
  channelTotalIn: number;
  channelTotalOut: number;
  channelNetFlow: number;
  channelTxCount: number;
  channelTotalLiveBalance: number;
  channelRows: ChannelReportRow[];

  // 3. Bill Manager Pro
  billRows: BillServiceRow[];
  billGrandPaid: number;
  billGrandDue: number;
  billGrandTotal: number;
  billCollectionRate: number;

  // 4. Inventory & Stock Assets
  inventoryTotalItems: number;
  inventoryLowStockCount: number;
  inventoryTotalValue: number;
  inventoryInQty: number;
  inventoryOutQty: number;
  inventoryReturnQty: number;
  inventoryDamagedQty: number;
  inventoryRestockCost: number;

  // 5. Support & Customer Service
  ticketsTotal: number;
  ticketsResolved: number;
  ticketsInProgress: number;
  ticketsPending: number;
  ticketsResolutionRate: number;

  // 6. Staff Attendance Operational Health (aggregate only, zero personal dues)
  attendanceTotalLogs: number;
  attendancePresent: number;
  attendanceLate: number;
  attendanceHalfDay: number;
  attendanceLeave: number;
  attendanceAbsent: number;
  attendanceOperationalRate: number;

  // 7. Charts & Matrices
  dailySeries: { day: string; dayLabel: string; income: number; expense: number; channelIn: number; channelOut: number }[];
  yearlyMonthlyMatrix: MonthlyMatrixRow[];
  ledgerRows: UnifiedLedgerRow[];
}

export const isSalaryTransactionItem = (t: any): boolean => {
  if (!t) return false;
  return (
    (t.id && String(t.id).startsWith('tx-sal-')) ||
    t.category === 'বেতন (Salary)' ||
    t.category === 'কর্মচারীদের বেতন' ||
    (typeof t.description === 'string' &&
      (t.description.includes('স্টাফ বেতন') || t.description.includes('বেতন')))
  );
};

// Explicitly guard against accidentally including personal/staff-due/owner settlement entries
const isExcludedPersonalEntry = (item: any): boolean => {
  if (!item) return true;
  if (item.isDeleted) return true;
  const text = `${item.category || ''} ${item.description || ''} ${item.note || ''} ${item.person || ''}`.toLowerCase();
  if (
    item.source === 'staff-due' ||
    item.source === 'owner-due' ||
    text.includes('ব্যক্তিগত লেনদেন') ||
    text.includes('মালিকানা বণ্টন')
  ) {
    return true;
  }
  return false;
};

interface CachedMonthlyAggregates {
  net?: Record<string, { pay?: number; due?: number }>;
  dis?: Record<string, { pay?: number; due?: number }>;
}

const loadBillAggregatesCache = (): CachedMonthlyAggregates => {
  try {
    const raw = safeStorage.getItem('bill_monthly_aggregates');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return {};
};

const getBillSummaryForMonth = (
  serviceType: BillServiceType,
  monthYM: string,
  liveBillMap: Record<string, BillServiceSummary | null>,
  aggregates: CachedMonthlyAggregates
): BillServiceRow => {
  const targetYM = serviceType === 'বকেয়া বিল' ? getPrevMonthKey(monthYM) : monthYM;
  const cacheKey = `${serviceType}__${targetYM}`;
  const liveOrFetched = liveBillMap[cacheKey];

  const labels: Record<BillServiceType, { bn: string; en: string }> = {
    'নেট বিল': { bn: 'নেট বিল (ব্রডব্যান্ড)', en: 'Net Bill (Broadband)' },
    'ডিস বিল': { bn: 'ডিস বিল (ক্যাবল টিভি)', en: 'Dish Bill (Cable TV)' },
    'নেট সংযোগ': { bn: 'নতুন নেট সংযোগ', en: 'New Net Connections' },
    'বকেয়া বিল': { bn: 'বকেয়া বিল আদায় (পূর্ববর্তী মাস)', en: 'Due Bill Recovery (Prev. Month)' }
  };

  if (liveOrFetched) {
    const total = liveOrFetched.totalPay + liveOrFetched.totalDue;
    return {
      serviceType,
      labelBn: labels[serviceType].bn,
      labelEn: labels[serviceType].en,
      paid: liveOrFetched.totalPay,
      due: liveOrFetched.totalDue,
      total,
      count: liveOrFetched.count,
      collectionRate: total > 0 ? Math.round((liveOrFetched.totalPay / total) * 100) : 0,
      source: liveOrFetched.source
    };
  }

  // Fallback 1: cached individual sheet
  const cached = summarizeCachedSheet(serviceType, targetYM);
  if (cached) {
    const total = cached.totalPay + cached.totalDue;
    return {
      serviceType,
      labelBn: labels[serviceType].bn,
      labelEn: labels[serviceType].en,
      paid: cached.totalPay,
      due: cached.totalDue,
      total,
      count: cached.count,
      collectionRate: total > 0 ? Math.round((cached.totalPay / total) * 100) : 0,
      source: 'cache'
    };
  }

  // Fallback 2: bill_monthly_aggregates for নেট বিল / ডিস বিল
  const mParts = targetYM.split('-');
  const mIdx = parseInt(mParts[1] || '', 10) - 1;
  const bnMonth = ALL_MONTHS[mIdx];
  if (bnMonth) {
    const aggSection =
      serviceType === 'নেট বিল' ? aggregates.net : serviceType === 'ডিস বিল' ? aggregates.dis : undefined;
    const aggRow = aggSection?.[bnMonth];
    if (aggRow && ((Number(aggRow.pay) || 0) > 0 || (Number(aggRow.due) || 0) > 0)) {
      const paid = Math.round(Number(aggRow.pay) || 0);
      const due = Math.round(Number(aggRow.due) || 0);
      const total = paid + due;
      return {
        serviceType,
        labelBn: labels[serviceType].bn,
        labelEn: labels[serviceType].en,
        paid,
        due,
        total,
        count: 0,
        collectionRate: total > 0 ? Math.round((paid / total) * 100) : 0,
        source: 'aggregate'
      };
    }
  }

  return {
    serviceType,
    labelBn: labels[serviceType].bn,
    labelEn: labels[serviceType].en,
    paid: 0,
    due: 0,
    total: 0,
    count: 0,
    collectionRate: 0,
    source: 'none'
  };
};

export interface ReportEngineInput {
  mode: 'monthly' | 'yearly';
  year: number;
  monthIndex: number;
  ayByayTxns: AyByayTransaction[];
  ayByaySalaries: SalaryPayment[];
  inventoryItems: InventoryItem[];
  inventoryLogs: InventoryLog[];
  mainTransactions: MainTransaction[];
  channels: PaymentChannel[];
  supportTickets: SupportTicket[];
  attendanceRecords: StaffAttendanceRecord[];
  liveBillMap: Record<string, BillServiceSummary | null>;
}

const computeMonthCore = (
  monthYM: string,
  ayByayTxns: AyByayTransaction[],
  ayByaySalaries: SalaryPayment[],
  mainTransactions: MainTransaction[],
  supportTickets: SupportTicket[],
  attendanceRecords: StaffAttendanceRecord[],
  liveBillMap: Record<string, BillServiceSummary | null>,
  aggregates: CachedMonthlyAggregates
) => {
  let inc = 0;
  let nonSalExp = 0;
  let salExpInTx = 0;
  let incCount = 0;
  let expCount = 0;

  (ayByayTxns || []).forEach((t) => {
    if (isExcludedPersonalEntry(t)) return;
    const d = t.date || t.createdAt || '';
    if (getTransactionMonth(d) !== monthYM) return;
    const amt = parseNumber(t.amount);
    if (isIncomeTransaction(t)) {
      inc += amt;
      incCount++;
    } else {
      if (isSalaryTransactionItem(t)) {
        salExpInTx += amt;
      } else {
        nonSalExp += amt;
      }
      expCount++;
    }
  });

  const salRows = (ayByaySalaries || []).filter((s) => s && s.month === monthYM);
  const salPaidFromList = salRows
    .filter((s) => s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
  const salPendingFromList = salRows
    .filter((s) => s.paymentStatus === 'pending')
    .reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
  const salPaidCount = salRows.filter((s) => s.paymentStatus === 'paid').length;
  const salPendingCount = salRows.filter((s) => s.paymentStatus === 'pending').length;

  const effectiveSalary = Math.max(salExpInTx, salPaidFromList);
  const totalExp = nonSalExp + effectiveSalary;
  const net = inc - totalExp;

  let chIn = 0;
  let chOut = 0;
  let chCount = 0;
  (mainTransactions || []).forEach((t) => {
    if (isExcludedPersonalEntry(t) || t.source === 'ay-byay') return;
    if (getTransactionMonth(t.date || '') !== monthYM) return;
    const amt = parseNumber(t.amount);
    if (t.type === 'income') chIn += amt;
    else chOut += amt;
    chCount++;
  });

  const netBillRow = getBillSummaryForMonth('নেট বিল', monthYM, liveBillMap, aggregates);
  const disBillRow = getBillSummaryForMonth('ডিস বিল', monthYM, liveBillMap, aggregates);
  const connBillRow = getBillSummaryForMonth('নেট সংযোগ', monthYM, liveBillMap, aggregates);
  const dueBillRow = getBillSummaryForMonth('বকেয়া বিল', monthYM, liveBillMap, aggregates);

  const monthTickets = (supportTickets || []).filter(
    (tk) => tk && getTransactionMonth(tk.createdAt || '') === monthYM
  );
  const ticketsResolved = monthTickets.filter((tk) => tk.status === 'resolved').length;

  const monthAttendance = (attendanceRecords || []).filter(
    (att) => att && (att.month === monthYM || getTransactionMonth(att.date || '') === monthYM)
  );
  const attPositive = monthAttendance.filter(
    (a) => a.status === 'present' || a.status === 'late' || a.status === 'half_day'
  ).length;
  const attRate = monthAttendance.length > 0 ? Math.round((attPositive / monthAttendance.length) * 100) : 0;

  return {
    inc,
    totalExp,
    net,
    effectiveSalary,
    nonSalExp,
    incCount,
    expCount,
    salPaidCount,
    salPendingFromList,
    salPendingCount,
    chIn,
    chOut,
    chCount,
    netBillRow,
    disBillRow,
    connBillRow,
    dueBillRow,
    ticketsTotal: monthTickets.length,
    ticketsResolved,
    attRate
  };
};

export function buildComprehensiveReport(input: ReportEngineInput): ComprehensivePeriodReport {
  const {
    mode,
    year,
    monthIndex,
    ayByayTxns,
    ayByaySalaries,
    inventoryItems,
    inventoryLogs,
    mainTransactions,
    channels,
    supportTickets,
    attendanceRecords,
    liveBillMap
  } = input;

  const monthYM = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const aggregates = loadBillAggregatesCache();

  const periodTitleBn =
    mode === 'monthly'
      ? `${REPORT_MONTHS_BN[monthIndex]} ${toBengaliNumber(year)}`
      : `বার্ষিক রিপোর্ট ${toBengaliNumber(year)}`;
  const periodTitleEn =
    mode === 'monthly'
      ? `${REPORT_MONTHS_EN[monthIndex]} ${year}`
      : `Annual Report ${year}`;

  const matchesPeriod = (dateStr?: string): boolean => {
    const ym = getTransactionMonth(dateStr || '');
    if (!ym) return false;
    if (mode === 'monthly') return ym === monthYM;
    return ym.startsWith(`${year}-`);
  };

  // Build 12-month matrix for selected year (always computed so annual & quick jump stay instant)
  const yearlyMonthlyMatrix: MonthlyMatrixRow[] = [];
  for (let m = 0; m < 12; m++) {
    const mYM = `${year}-${String(m + 1).padStart(2, '0')}`;
    const core = computeMonthCore(
      mYM,
      ayByayTxns,
      ayByaySalaries,
      mainTransactions,
      supportTickets,
      attendanceRecords,
      liveBillMap,
      aggregates
    );
    const billPaidTotal =
      core.netBillRow.paid + core.disBillRow.paid + core.connBillRow.paid + core.dueBillRow.paid;
    const billDueTotal =
      core.netBillRow.due + core.disBillRow.due + core.connBillRow.due + core.dueBillRow.due;

    yearlyMonthlyMatrix.push({
      monthIndex: m,
      monthYM: mYM,
      monthBn: REPORT_MONTHS_BN[m],
      monthEn: REPORT_MONTHS_EN[m],
      shortBn: REPORT_MONTHS_SHORT_BN[m],
      shortEn: REPORT_MONTHS_SHORT_EN[m],
      companyIncome: core.inc,
      companyExpense: core.totalExp,
      companyNet: core.net,
      salaryExpense: core.effectiveSalary,
      otherExpense: core.nonSalExp,
      channelIn: core.chIn,
      channelOut: core.chOut,
      channelNet: core.chIn - core.chOut,
      billPaidTotal,
      billDueTotal,
      ticketsTotal: core.ticketsTotal,
      ticketsResolved: core.ticketsResolved,
      attendancePresentRate: core.attRate,
      entryCount: core.incCount + core.expCount + core.chCount
    });
  }

  // 1. Company Business Accounting (Ay-Byay) for active period (monthly or full year)
  let companyIncome = 0;
  let otherOperatingExpense = 0;
  let salExpInTxTotal = 0;
  let companyIncomeCount = 0;
  let companyExpenseCount = 0;

  const incCatMap = new Map<string, { amount: number; count: number }>();
  const expCatMap = new Map<string, { amount: number; count: number }>();
  const ledgerRows: UnifiedLedgerRow[] = [];

  (ayByayTxns || []).forEach((t) => {
    if (isExcludedPersonalEntry(t)) return;
    const d = t.date || t.createdAt || '';
    if (!matchesPeriod(d)) return;

    const amt = parseNumber(t.amount);
    const isInc = isIncomeTransaction(t);
    const cat = t.category || (isInc ? 'অন্যান্য আয়' : 'অন্যান্য খরচ');

    if (isInc) {
      companyIncome += amt;
      companyIncomeCount++;
      const cur = incCatMap.get(cat) || { amount: 0, count: 0 };
      incCatMap.set(cat, { amount: cur.amount + amt, count: cur.count + 1 });
    } else {
      if (isSalaryTransactionItem(t)) {
        salExpInTxTotal += amt;
      } else {
        otherOperatingExpense += amt;
      }
      companyExpenseCount++;
      const cur = expCatMap.get(cat) || { amount: 0, count: 0 };
      expCatMap.set(cat, { amount: cur.amount + amt, count: cur.count + 1 });
    }

    const parsedTs = Date.parse(t.createdAt || '') || Date.parse(d || '') || 0;
    let timeLabel = '';
    if (t.createdAt && !isNaN(Date.parse(t.createdAt))) {
      try {
        timeLabel = new Date(t.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch {}
    }

    ledgerRows.push({
      id: `ab-${t.id}`,
      serialNo: 0,
      date: (d || '').substring(0, 10),
      timeLabel,
      createdTimestamp: parsedTs,
      sourceModule: 'ay-byay',
      moduleLabelBn: 'আয়-ব্যয়',
      moduleLabelEn: 'Ay-Byay',
      type: isInc ? 'income' : 'expense',
      category: cat,
      method: t.paymentMethod || 'নগদ',
      description: t.description || t.note || cat,
      amount: amt
    });
  });

  // Salaries for active period (using month-by-month max so yearly avoids masking individual months)
  let salaryPaidTotal = 0;
  let salaryPaidCount = 0;
  let salaryPendingTotal = 0;
  let salaryPendingCount = 0;

  if (mode === 'monthly') {
    const core = computeMonthCore(
      monthYM,
      ayByayTxns,
      ayByaySalaries,
      mainTransactions,
      supportTickets,
      attendanceRecords,
      liveBillMap,
      aggregates
    );
    salaryPaidTotal = core.effectiveSalary;
    salaryPaidCount = core.salPaidCount;
    salaryPendingTotal = core.salPendingFromList;
    salaryPendingCount = core.salPendingCount;
  } else {
    salaryPaidTotal = yearlyMonthlyMatrix.reduce((s, r) => s + r.salaryExpense, 0);
    const yearSals = (ayByaySalaries || []).filter((s) => s && (s.month || '').startsWith(`${year}-`));
    salaryPaidCount = yearSals.filter((s) => s.paymentStatus === 'paid').length;
    salaryPendingTotal = yearSals
      .filter((s) => s.paymentStatus === 'pending')
      .reduce((s, r) => s + (Number(r.netSalary) || 0), 0);
    salaryPendingCount = yearSals.filter((s) => s.paymentStatus === 'pending').length;
  }

  // Ensure salary shows in expenseCategories if salaryPaidTotal > salExpInTxTotal
  if (salaryPaidTotal > salExpInTxTotal) {
    const diff = salaryPaidTotal - salExpInTxTotal;
    const salKey = 'স্টাফ বেতন (Payroll)';
    const cur = expCatMap.get(salKey) || { amount: 0, count: 0 };
    expCatMap.set(salKey, { amount: cur.amount + diff, count: cur.count + Math.max(1, salaryPaidCount) });
  }

  const companyExpense = otherOperatingExpense + salaryPaidTotal;
  const companyNet = companyIncome - companyExpense;

  const incomeCategories: CategoryStat[] = Array.from(incCatMap.entries())
    .map(([category, v]) => ({
      category,
      amount: v.amount,
      count: v.count,
      percentage: companyIncome > 0 ? Math.round((v.amount / companyIncome) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const expenseCategories: CategoryStat[] = Array.from(expCatMap.entries())
    .map(([category, v]) => ({
      category,
      amount: v.amount,
      count: v.count,
      percentage: companyExpense > 0 ? Math.round((v.amount / companyExpense) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // 2. Payment Channels (Main app ledger + live channel balances)
  const liveBalMap = new Map<string, number>();
  const periodChMap = new Map<string, { inAmt: number; outAmt: number; count: number }>();

  let channelTotalIn = 0;
  let channelTotalOut = 0;
  let channelTxCount = 0;

  (mainTransactions || []).forEach((t) => {
    if (isExcludedPersonalEntry(t) || t.source === 'ay-byay') return;
    const amt = parseNumber(t.amount);
    const method = t.method || 'নগদ';
    const prevLive = liveBalMap.get(method) || 0;
    liveBalMap.set(method, prevLive + (t.type === 'income' ? amt : -amt));

    if (matchesPeriod(t.date || '')) {
      const cur = periodChMap.get(method) || { inAmt: 0, outAmt: 0, count: 0 };
      if (t.type === 'income') {
        cur.inAmt += amt;
        channelTotalIn += amt;
      } else {
        cur.outAmt += amt;
        channelTotalOut += amt;
      }
      cur.count += 1;
      channelTxCount += 1;
      periodChMap.set(method, cur);

      ledgerRows.push({
        id: `ch-${t.id}`,
        serialNo: 0,
        date: (t.date || '').substring(0, 10),
        timeLabel: t.time || '',
        createdTimestamp: Number(t.created) || Date.parse(t.date || '') || 0,
        sourceModule: 'channel',
        moduleLabelBn: 'চ্যানেল',
        moduleLabelEn: 'Channel',
        type: t.type,
        category: t.category || method,
        method,
        description: t.note || t.person || t.category || method,
        amount: amt
      });
    }
  });

  const channelNamesSeen = new Set<string>();
  const channelRows: ChannelReportRow[] = [];

  (channels || []).forEach((ch) => {
    channelNamesSeen.add(ch.name);
    const p = periodChMap.get(ch.name) || { inAmt: 0, outAmt: 0, count: 0 };
    channelRows.push({
      id: ch.id,
      name: ch.name,
      labelBn: ch.labelBn || ch.name,
      labelEn: ch.labelEn || ch.name,
      periodIn: p.inAmt,
      periodOut: p.outAmt,
      periodNet: p.inAmt - p.outAmt,
      periodCount: p.count,
      liveBalance: liveBalMap.get(ch.name) || 0
    });
  });

  // Include any legacy methods found in transactions
  Array.from(new Set([...liveBalMap.keys(), ...periodChMap.keys()])).forEach((mName) => {
    if (channelNamesSeen.has(mName)) return;
    const p = periodChMap.get(mName) || { inAmt: 0, outAmt: 0, count: 0 };
    channelRows.push({
      id: mName,
      name: mName,
      labelBn: mName,
      labelEn: mName,
      periodIn: p.inAmt,
      periodOut: p.outAmt,
      periodNet: p.inAmt - p.outAmt,
      periodCount: p.count,
      liveBalance: liveBalMap.get(mName) || 0
    });
  });

  const channelNetFlow = channelTotalIn - channelTotalOut;
  const channelTotalLiveBalance = channelRows.reduce((s, r) => s + r.liveBalance, 0);

  // 3. Bill Manager Pro Summary
  const services: BillServiceType[] = ['নেট বিল', 'ডিস বিল', 'নেট সংযোগ', 'বকেয়া বিল'];
  let billRows: BillServiceRow[] = [];

  if (mode === 'monthly') {
    billRows = services.map((st) => getBillSummaryForMonth(st, monthYM, liveBillMap, aggregates));
  } else {
    billRows = services.map((st) => {
      let paid = 0;
      let due = 0;
      let count = 0;
      let hasLive = false;
      let hasCache = false;
      for (let m = 0; m < 12; m++) {
        const mYM = `${year}-${String(m + 1).padStart(2, '0')}`;
        const row = getBillSummaryForMonth(st, mYM, liveBillMap, aggregates);
        paid += row.paid;
        due += row.due;
        count += row.count;
        if (row.source === 'live') hasLive = true;
        else if (row.source === 'cache' || row.source === 'aggregate') hasCache = true;
      }
      const total = paid + due;
      const sample = getBillSummaryForMonth(st, `${year}-01`, liveBillMap, aggregates);
      return {
        serviceType: st,
        labelBn: sample.labelBn,
        labelEn: sample.labelEn,
        paid,
        due,
        total,
        count,
        collectionRate: total > 0 ? Math.round((paid / total) * 100) : 0,
        source: hasLive ? 'live' : hasCache ? 'cache' : 'none'
      };
    });
  }

  const billGrandPaid = billRows.reduce((s, r) => s + r.paid, 0);
  const billGrandDue = billRows.reduce((s, r) => s + r.due, 0);
  const billGrandTotal = billGrandPaid + billGrandDue;
  const billCollectionRate = billGrandTotal > 0 ? Math.round((billGrandPaid / billGrandTotal) * 100) : 0;

  // 4. Inventory & Assets
  const inventoryTotalItems = (inventoryItems || []).length;
  const inventoryLowStockCount = (inventoryItems || []).filter(
    (item) => item && (Number(item.currentStock) || 0) <= (Number(item.minStockAlert) || 0)
  ).length;
  const inventoryTotalValue = (inventoryItems || []).reduce(
    (s, item) => s + (Number(item.currentStock) || 0) * (Number(item.unitCost) || 0),
    0
  );

  let inventoryInQty = 0;
  let inventoryOutQty = 0;
  let inventoryReturnQty = 0;
  let inventoryDamagedQty = 0;
  let inventoryRestockCost = 0;

  (inventoryLogs || []).forEach((log) => {
    if (!log || !matchesPeriod(log.date || log.createdAt || '')) return;
    const qty = Number(log.quantity) || 0;
    if (log.type === 'in') {
      inventoryInQty += qty;
      inventoryRestockCost += Number(log.totalCost) || 0;
    } else if (log.type === 'out') {
      inventoryOutQty += qty;
    } else if (log.type === 'return') {
      inventoryReturnQty += qty;
    } else if (log.type === 'damaged') {
      inventoryDamagedQty += qty;
    }
  });

  // 5. Support Tickets
  const periodTickets = (supportTickets || []).filter((tk) => tk && matchesPeriod(tk.createdAt || ''));
  const ticketsTotal = periodTickets.length;
  const ticketsResolved = periodTickets.filter((tk) => tk.status === 'resolved').length;
  const ticketsInProgress = periodTickets.filter(
    (tk) => tk.status === 'in_progress' || tk.status === 'reviewing'
  ).length;
  const ticketsPending = periodTickets.filter((tk) => tk.status === 'pending').length;
  const ticketsResolutionRate = ticketsTotal > 0 ? Math.round((ticketsResolved / ticketsTotal) * 100) : 0;

  // 6. Staff Attendance Operational Summary (Aggregate Organization Health Only)
  const periodAttendance = (attendanceRecords || []).filter(
    (att) => att && matchesPeriod(att.date || (att.month ? `${att.month}-01` : ''))
  );
  const attendanceTotalLogs = periodAttendance.length;
  const attendancePresent = periodAttendance.filter((a) => a.status === 'present').length;
  const attendanceLate = periodAttendance.filter((a) => a.status === 'late').length;
  const attendanceHalfDay = periodAttendance.filter((a) => a.status === 'half_day').length;
  const attendanceLeave = periodAttendance.filter((a) => a.status === 'leave').length;
  const attendanceAbsent = periodAttendance.filter((a) => a.status === 'absent').length;
  const attendanceOperationalRate =
    attendanceTotalLogs > 0
      ? Math.round(((attendancePresent + attendanceLate + attendanceHalfDay) / attendanceTotalLogs) * 100)
      : 0;

  // 7. Daily Cashflow Series (for Monthly mode)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const dailyMap = new Map<string, { income: number; expense: number; channelIn: number; channelOut: number }>();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${monthYM}-${String(d).padStart(2, '0')}`;
    dailyMap.set(key, { income: 0, expense: 0, channelIn: 0, channelOut: 0 });
  }

  if (mode === 'monthly') {
    (ayByayTxns || []).forEach((t) => {
      if (isExcludedPersonalEntry(t)) return;
      const dateStr = (t.date || t.createdAt || '').substring(0, 10);
      const slot = dailyMap.get(dateStr);
      if (!slot) return;
      const amt = parseNumber(t.amount);
      if (isIncomeTransaction(t)) slot.income += amt;
      else slot.expense += amt;
    });

    (mainTransactions || []).forEach((t) => {
      if (isExcludedPersonalEntry(t) || t.source === 'ay-byay') return;
      const dateStr = (t.date || '').substring(0, 10);
      const slot = dailyMap.get(dateStr);
      if (!slot) return;
      const amt = parseNumber(t.amount);
      if (t.type === 'income') slot.channelIn += amt;
      else slot.channelOut += amt;
    });
  }

  const dailySeries = Array.from(dailyMap.entries()).map(([dateKey, vals]) => {
    const dayNum = parseInt(dateKey.split('-')[2] || '1', 10);
    return {
      day: String(dayNum).padStart(2, '0'),
      dayLabel: toBengaliNumber(dayNum),
      ...vals
    };
  });

  // Chronological ascending order: 1st added entry on top, subsequent entries below
  ledgerRows.sort((a, b) => {
    const dateCmp = (a.date || '').localeCompare(b.date || '');
    if (dateCmp !== 0) return dateCmp;
    const tsCmp = (a.createdTimestamp || 0) - (b.createdTimestamp || 0);
    if (tsCmp !== 0) return tsCmp;
    return a.id.localeCompare(b.id);
  });
  ledgerRows.forEach((row, idx) => {
    row.serialNo = idx + 1;
  });

  return {
    mode,
    year,
    monthIndex,
    monthYM,
    periodTitleBn,
    periodTitleEn,
    companyIncome,
    companyExpense,
    companyNet,
    companyIncomeCount,
    companyExpenseCount,
    salaryPaidTotal,
    salaryPaidCount,
    salaryPendingTotal,
    salaryPendingCount,
    otherOperatingExpense,
    incomeCategories,
    expenseCategories,
    channelTotalIn,
    channelTotalOut,
    channelNetFlow,
    channelTxCount,
    channelTotalLiveBalance,
    channelRows,
    billRows,
    billGrandPaid,
    billGrandDue,
    billGrandTotal,
    billCollectionRate,
    inventoryTotalItems,
    inventoryLowStockCount,
    inventoryTotalValue,
    inventoryInQty,
    inventoryOutQty,
    inventoryReturnQty,
    inventoryDamagedQty,
    inventoryRestockCost,
    ticketsTotal,
    ticketsResolved,
    ticketsInProgress,
    ticketsPending,
    ticketsResolutionRate,
    attendanceTotalLogs,
    attendancePresent,
    attendanceLate,
    attendanceHalfDay,
    attendanceLeave,
    attendanceAbsent,
    attendanceOperationalRate,
    dailySeries,
    yearlyMonthlyMatrix,
    ledgerRows
  };
}

const escapeHtml = (unsafe: string): string =>
  String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function buildAutomatedReportHtml(report: ComprehensivePeriodReport, lang: Language): string {
  const isBn = lang === 'bn';
  const fmt = (n: number) => (isBn ? toBengaliNumber(formatCurrency(n, 'bn')) : formatCurrency(n, 'en'));
  const fmtSigned = (n: number) =>
    isBn ? toBengaliNumber(formatSignedCurrency(n, 'bn')) : formatSignedCurrency(n, 'en');
  const numFmt = (n: number) => (isBn ? toBengaliNumber(n) : String(n));

  const netLabel =
    report.companyNet < 0
      ? isBn
        ? 'নিট লস / ঘাটতি'
        : 'Net Loss / Deficit'
      : report.companyNet === 0
      ? isBn
        ? 'ব্রেক-ইভেন (সমতা)'
        : 'Break-even'
      : isBn
      ? 'নিট মুনাফা'
      : 'Net Profit';

  const netColor = report.companyNet < 0 ? '#dc2626' : report.companyNet === 0 ? '#475569' : '#16a34a';

  const matrixSection =
    report.mode === 'yearly'
      ? `
      <div class="section">
        <h3>${isBn ? `১২ মাসের পূর্ণাঙ্গ তুলনামূলক হিসাব (${numFmt(report.year)})` : `12-Month Comparative Overview (${report.year})`}</h3>
        <table>
          <thead>
            <tr>
              <th>${isBn ? 'মাস' : 'Month'}</th>
              <th class="right">${isBn ? 'কোম্পানি আয়' : 'Company Income'}</th>
              <th class="right">${isBn ? 'কোম্পানি ব্যয়' : 'Company Expense'}</th>
              <th class="right">${isBn ? 'নিট লাভ/লস' : 'Net Profit/Loss'}</th>
              <th class="right">${isBn ? 'চ্যানেল জমা' : 'Channel In'}</th>
              <th class="right">${isBn ? 'চ্যানেল খরচ' : 'Channel Out'}</th>
              <th class="right">${isBn ? 'বিল প্রো আদায়' : 'Bill Pro Paid'}</th>
            </tr>
          </thead>
          <tbody>
            ${report.yearlyMonthlyMatrix
              .map(
                (r) => `
              <tr>
                <td><strong>${escapeHtml(isBn ? r.monthBn : r.monthEn)}</strong></td>
                <td class="right pos">${fmt(r.companyIncome)}</td>
                <td class="right neg">${fmt(r.companyExpense)}</td>
                <td class="right" style="font-weight:700;color:${r.companyNet < 0 ? '#dc2626' : '#16a34a'}">${fmtSigned(r.companyNet)}</td>
                <td class="right">${fmt(r.channelIn)}</td>
                <td class="right">${fmt(r.channelOut)}</td>
                <td class="right">${fmt(r.billPaidTotal)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
      : '';

  const categorySection = `
    <div class="two-col">
      <div class="section">
        <h3>${isBn ? 'খাতভিত্তিক কোম্পানি আয়' : 'Company Income by Category'}</h3>
        <table>
          <thead>
            <tr>
              <th>${isBn ? 'খাত' : 'Category'}</th>
              <th class="right">${isBn ? 'এন্ট্রি' : 'Count'}</th>
              <th class="right">${isBn ? 'পরিমাণ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.incomeCategories.length > 0
                ? report.incomeCategories
                    .map(
                      (c) => `
                  <tr>
                    <td>${escapeHtml(c.category)}</td>
                    <td class="right">${numFmt(c.count)}</td>
                    <td class="right pos">${fmt(c.amount)} (${numFmt(c.percentage)}%)</td>
                  </tr>`
                    )
                    .join('')
                : `<tr><td colspan="3" class="muted">${isBn ? 'কোনো আয় এন্ট্রি নেই' : 'No income entries'}</td></tr>`
            }
          </tbody>
        </table>
      </div>
      <div class="section">
        <h3>${isBn ? 'খাতভিত্তিক কোম্পানি ব্যয়' : 'Company Expense by Category'}</h3>
        <table>
          <thead>
            <tr>
              <th>${isBn ? 'খাত' : 'Category'}</th>
              <th class="right">${isBn ? 'এন্ট্রি' : 'Count'}</th>
              <th class="right">${isBn ? 'পরিমাণ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            ${
              report.expenseCategories.length > 0
                ? report.expenseCategories
                    .map(
                      (c) => `
                  <tr>
                    <td>${escapeHtml(c.category)}</td>
                    <td class="right">${numFmt(c.count)}</td>
                    <td class="right neg">${fmt(c.amount)} (${numFmt(c.percentage)}%)</td>
                  </tr>`
                    )
                    .join('')
                : `<tr><td colspan="3" class="muted">${isBn ? 'কোনো ব্যয় এন্ট্রি নেই' : 'No expense entries'}</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>`;

  const billSection = `
    <div class="section">
      <h3>${isBn ? 'বিল ম্যানেজমেন্ট প্রো সারাংশ' : 'Bill Manager Pro Summary'}</h3>
      <table>
        <thead>
          <tr>
            <th>${isBn ? 'সেবার নাম' : 'Service'}</th>
            <th class="right">${isBn ? 'পরিশোধিত' : 'Paid'}</th>
            <th class="right">${isBn ? 'বকেয়া' : 'Due'}</th>
            <th class="right">${isBn ? 'মোট বিল' : 'Total'}</th>
            <th class="right">${isBn ? 'আদায় হার' : 'Rate'}</th>
          </tr>
        </thead>
        <tbody>
          ${report.billRows
            .map(
              (b) => `
            <tr>
              <td><strong>${escapeHtml(isBn ? b.labelBn : b.labelEn)}</strong></td>
              <td class="right pos">${fmt(b.paid)}</td>
              <td class="right neg">${fmt(b.due)}</td>
              <td class="right">${fmt(b.total)}</td>
              <td class="right">${numFmt(b.collectionRate)}%</td>
            </tr>`
            )
            .join('')}
          <tr class="total-row">
            <td>${isBn ? 'সর্বমোট বিল প্রো' : 'Grand Total'}</td>
            <td class="right pos">${fmt(report.billGrandPaid)}</td>
            <td class="right neg">${fmt(report.billGrandDue)}</td>
            <td class="right">${fmt(report.billGrandTotal)}</td>
            <td class="right">${numFmt(report.billCollectionRate)}%</td>
          </tr>
        </tbody>
      </table>
    </div>`;

  const channelSection = `
    <div class="section">
      <h3>${isBn ? 'পেমেন্ট চ্যানেল স্টেটমেন্ট (ক্যাশ, বিকাশ, নগদ, রকেট, ব্যাংক)' : 'Payment Channels Cashflow'}</h3>
      <table>
        <thead>
          <tr>
            <th>${isBn ? 'চ্যানেল' : 'Channel'}</th>
            <th class="right">${isBn ? 'জমা (In)' : 'Inflow'}</th>
            <th class="right">${isBn ? 'খরচ (Out)' : 'Outflow'}</th>
            <th class="right">${isBn ? 'নিট প্রবাহ' : 'Net Flow'}</th>
            <th class="right">${isBn ? 'বর্তমান ব্যালেন্স' : 'Live Balance'}</th>
          </tr>
        </thead>
        <tbody>
          ${report.channelRows
            .map(
              (ch) => `
            <tr>
              <td><strong>${escapeHtml(isBn ? ch.labelBn : ch.labelEn)}</strong></td>
              <td class="right pos">${fmt(ch.periodIn)}</td>
              <td class="right neg">${fmt(ch.periodOut)}</td>
              <td class="right" style="color:${ch.periodNet < 0 ? '#dc2626' : '#0f172a'}">${fmtSigned(ch.periodNet)}</td>
              <td class="right"><strong>${fmtSigned(ch.liveBalance)}</strong></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`;

  const opsSection = `
    <div class="section">
      <h3>${isBn ? 'অপারেশন, বেতন, ইনভেন্টরি ও সাপোর্ট' : 'Operations, Payroll, Inventory & Support'}</h3>
      <div class="ops-grid">
        <div class="ops-box">
          <div class="ops-label">${isBn ? 'কোম্পানি বেতন পরিশোধ' : 'Company Payroll Paid'}</div>
          <div class="ops-val">${fmt(report.salaryPaidTotal)}</div>
          <div class="ops-sub">${isBn ? `পরিশোধিত: ${numFmt(report.salaryPaidCount)} · বকেয়া: ${fmt(report.salaryPendingTotal)}` : `Paid: ${report.salaryPaidCount} · Pending: ${fmt(report.salaryPendingTotal)}`}</div>
        </div>
        <div class="ops-box">
          <div class="ops-label">${isBn ? 'ইনভেন্টরি স্টক মূল্য' : 'Inventory Asset Value'}</div>
          <div class="ops-val">${fmt(report.inventoryTotalValue)}</div>
          <div class="ops-sub">${isBn ? `ইন: ${numFmt(report.inventoryInQty)} · আউট: ${numFmt(report.inventoryOutQty)} · লো স্টক: ${numFmt(report.inventoryLowStockCount)}` : `In: ${report.inventoryInQty} · Out: ${report.inventoryOutQty} · Low: ${report.inventoryLowStockCount}`}</div>
        </div>
        <div class="ops-box">
          <div class="ops-label">${isBn ? 'সাপোর্ট টিকেট সমাধান' : 'Support Ticket Resolution'}</div>
          <div class="ops-val">${numFmt(report.ticketsResolutionRate)}% (${numFmt(report.ticketsResolved)}/${numFmt(report.ticketsTotal)})</div>
          <div class="ops-sub">${isBn ? `চলমান: ${numFmt(report.ticketsInProgress)} · পেন্ডিং: ${numFmt(report.ticketsPending)}` : `Active: ${report.ticketsInProgress} · Pending: ${report.ticketsPending}`}</div>
        </div>
        <div class="ops-box">
          <div class="ops-label">${isBn ? 'অপারেশনাল হাজিরা হার' : 'Operational Attendance'}</div>
          <div class="ops-val">${numFmt(report.attendanceOperationalRate)}%</div>
          <div class="ops-sub">${isBn ? `উপস্থিত: ${numFmt(report.attendancePresent)} · দেরি: ${numFmt(report.attendanceLate)} · ছুটি: ${numFmt(report.attendanceLeave)}` : `Present: ${report.attendancePresent} · Late: ${report.attendanceLate} · Leave: ${report.attendanceLeave}`}</div>
        </div>
      </div>
    </div>`;

  const ledgerSlice = report.mode === 'monthly' ? report.ledgerRows.slice(0, 500) : [];
  const ledgerHtml =
    ledgerSlice.length > 0
      ? `
      <div class="section">
        <h3>${isBn ? `বিস্তারিত লেনদেন বিবরণী — ক্রমানুসারে (${numFmt(ledgerSlice.length)} টি)` : `Chronological Ledger (${ledgerSlice.length} entries)`}</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 36px;">#</th>
              <th>${isBn ? 'তারিখ' : 'Date'}</th>
              <th>${isBn ? 'মডিউল' : 'Module'}</th>
              <th>${isBn ? 'খাত / মাধ্যম' : 'Category / Method'}</th>
              <th>${isBn ? 'বিবরণ' : 'Description'}</th>
              <th class="right">${isBn ? 'পরিমাণ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            ${ledgerSlice
              .map(
                (r) => `
              <tr>
                <td>${numFmt(r.serialNo)}</td>
                <td>${escapeHtml(isBn ? toBengaliNumber(r.date) : r.date)}${r.timeLabel ? `<br><span style="color:#64748b;font-size:9px;">${escapeHtml(isBn ? toBengaliNumber(r.timeLabel) : r.timeLabel)}</span>` : ''}</td>
                <td>${escapeHtml(isBn ? r.moduleLabelBn : r.moduleLabelEn)}</td>
                <td>${escapeHtml(r.category)} (${escapeHtml(r.method)})</td>
                <td>${escapeHtml(r.description)}</td>
                <td class="right ${r.type === 'income' ? 'pos' : 'neg'}">${r.type === 'income' ? '+' : '-'}${fmt(r.amount)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
      : '';

  const generatedAt = new Date().toLocaleString(isBn ? 'bn-BD' : 'en-US');

  return `<!doctype html>
  <html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(isBn ? report.periodTitleBn : report.periodTitleEn)}</title>
    <style>
      @page { size: A4; margin: 12mm; }
      * { box-sizing: border-box; }
      body { font-family: 'Hind Siliguri', 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; margin: 0; font-size: 11px; line-height: 1.45; }
      .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
      .brand { font-size: 18px; font-weight: 800; color: #0f172a; }
      .sub { font-size: 11px; color: #475569; margin-top: 2px; }
      .period { text-align: right; }
      .period-title { font-size: 14px; font-weight: 800; color: #E52E2E; }
      .exclusion { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px; font-size: 10px; color: #475569; margin-bottom: 12px; }
      .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
      .kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; background: #fff; }
      .kpi-lbl { font-size: 10px; color: #64748b; font-weight: 700; }
      .kpi-val { font-size: 15px; font-weight: 800; margin-top: 2px; font-variant-numeric: tabular-nums; }
      .kpi-sub { font-size: 9.5px; color: #64748b; margin-top: 2px; }
      .section { margin-bottom: 14px; page-break-inside: avoid; }
      h3 { font-size: 12px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; }
      table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
      th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; font-variant-numeric: tabular-nums; }
      th { background: #f1f5f9; font-weight: 700; color: #1e293b; }
      .right { text-align: right; }
      .pos { color: #16a34a; font-weight: 700; }
      .neg { color: #dc2626; font-weight: 700; }
      .muted { color: #64748b; text-align: center; padding: 10px; }
      .total-row td { background: #f8fafc; font-weight: 800; }
      .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .ops-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
      .ops-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; }
      .ops-label { font-size: 9.5px; color: #64748b; font-weight: 700; }
      .ops-val { font-size: 13px; font-weight: 800; margin-top: 2px; color: #0f172a; }
      .ops-sub { font-size: 9px; color: #64748b; margin-top: 2px; }
      .footer { border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 16px; display: flex; justify-content: space-between; font-size: 9.5px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand">${isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protyasha Cable Network'}</div>
        <div class="sub">${isBn ? 'সম্পূর্ণ অ্যাপ অটোমেশন হিসাব ও অপারেশন রিপোর্ট' : 'Complete App Automated Financial & Operations Report'}</div>
      </div>
      <div class="period">
        <div class="period-title">${escapeHtml(isBn ? report.periodTitleBn : report.periodTitleEn)}</div>
        <div class="sub">${isBn ? 'প্রস্তুতের সময়:' : 'Generated:'} ${escapeHtml(generatedAt)}</div>
      </div>
    </div>

    <div class="exclusion">
      ${
        isBn
          ? 'হিসাবের সীমা: এই রিপোর্টে প্রতিষ্ঠানের আয়-ব্যয়, বিল ম্যানেজমেন্ট প্রো, পেমেন্ট চ্যানেল, বেতন খরচ, ইনভেন্টরি ও সাপোর্ট অপারেশন অন্তর্ভুক্ত। ব্যক্তিগত লেনদেন, স্টাফ পাওনা/কালেকশন এবং মালিকানা বণ্টন হিসাব অন্তর্ভুক্ত নয়।'
          : 'Scope Notice: Includes organizational Ay-Byay accounts, Bill Manager Pro, Payment Channels, Company Payroll, Inventory, and Support Operations. Personal transactions, staff dues/collections, and owner dividend splits are excluded.'
      }
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-lbl">${isBn ? 'কোম্পানি মোট আয়' : 'Company Income'}</div>
        <div class="kpi-val pos">${fmt(report.companyIncome)}</div>
        <div class="kpi-sub">${isBn ? `${numFmt(report.companyIncomeCount)} টি এন্ট্রি` : `${report.companyIncomeCount} entries`}</div>
      </div>
      <div class="kpi">
        <div class="kpi-lbl">${isBn ? 'কোম্পানি মোট ব্যয়' : 'Company Expense'}</div>
        <div class="kpi-val neg">${fmt(report.companyExpense)}</div>
        <div class="kpi-sub">${isBn ? `বেতন: ${fmt(report.salaryPaidTotal)}` : `Payroll: ${fmt(report.salaryPaidTotal)}`}</div>
      </div>
      <div class="kpi">
        <div class="kpi-lbl">${netLabel}</div>
        <div class="kpi-val" style="color:${netColor}">${fmtSigned(report.companyNet)}</div>
        <div class="kpi-sub">${isBn ? 'আয়-ব্যয় নিট ফলাফল' : 'Net Company Result'}</div>
      </div>
      <div class="kpi">
        <div class="kpi-lbl">${isBn ? 'চ্যানেল প্রবাহ (জমা - খরচ)' : 'Channel Net Flow'}</div>
        <div class="kpi-val" style="color:${report.channelNetFlow < 0 ? '#dc2626' : '#0f172a'}">${fmtSigned(report.channelNetFlow)}</div>
        <div class="kpi-sub">${isBn ? `মোট ব্যালেন্স: ${fmtSigned(report.channelTotalLiveBalance)}` : `Live Balance: ${fmtSigned(report.channelTotalLiveBalance)}`}</div>
      </div>
    </div>

    ${matrixSection}
    ${categorySection}
    ${billSection}
    ${channelSection}
    ${opsSection}
    ${ledgerHtml}

    <div class="footer">
      <span>${isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — অটোমেশন সফটওয়্যার সিস্টেম' : 'Protyasha Cable Network — Automated System'}</span>
      <span>${isBn ? 'স্বয়ংক্রিয়ভাবে তৈরি রিপোর্ট' : 'System Generated Statement'}</span>
    </div>
  </body>
  </html>`;
}

export async function exportAutomatedReportExcel(report: ComprehensivePeriodReport, lang: Language): Promise<void> {
  const XLSX = await import('xlsx');
  const isBn = lang === 'bn';
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  const summaryRows = [
    [isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — সম্পূর্ণ অটোমেটেড অ্যাপ রিপোর্ট' : 'Protyasha Cable Network — Automated App Report'],
    [isBn ? 'সময়কাল' : 'Period', isBn ? report.periodTitleBn : report.periodTitleEn],
    [
      isBn ? 'নোট' : 'Scope',
      isBn
        ? 'ব্যক্তিগত লেনদেন, স্টাফ পাওনা/কালেকশন এবং মালিকানা বণ্টন হিসাব বাদ দেওয়া হয়েছে'
        : 'Excludes personal transactions, staff dues/collections, and owner dividend splits'
    ],
    [],
    [isBn ? 'বিভাগ' : 'Metric', isBn ? 'পরিমাণ (৳)' : 'Amount (BDT)', isBn ? 'বিবরণ' : 'Details'],
    [isBn ? 'কোম্পানি মোট আয় (আয়-ব্যয়)' : 'Company Total Income', report.companyIncome, `${report.companyIncomeCount} entries`],
    [isBn ? 'কোম্পানি মোট ব্যয় (আয়-ব্যয়)' : 'Company Total Expense', report.companyExpense, `Payroll: ${report.salaryPaidTotal}, Operating: ${report.otherOperatingExpense}`],
    [
      report.companyNet < 0 ? (isBn ? 'নিট লস / ঘাটতি' : 'Net Loss / Deficit') : (isBn ? 'নিট মুনাফা' : 'Net Profit'),
      report.companyNet,
      ''
    ],
    [isBn ? 'চ্যানেল মোট জমা (Inflow)' : 'Channel Total Inflow', report.channelTotalIn, `${report.channelTxCount} channel entries`],
    [isBn ? 'চ্যানেল মোট খরচ (Outflow)' : 'Channel Total Outflow', report.channelTotalOut, ''],
    [isBn ? 'চ্যানেল নিট প্রবাহ' : 'Channel Net Flow', report.channelNetFlow, `Live Total Balance: ${report.channelTotalLiveBalance}`],
    [isBn ? 'বিল প্রো মোট আদায়' : 'Bill Manager Paid', report.billGrandPaid, `Collection Rate: ${report.billCollectionRate}%`],
    [isBn ? 'বিল প্রো মোট বকেয়া' : 'Bill Manager Due', report.billGrandDue, ''],
    [isBn ? 'ইনভেন্টরি মোট স্টক মূল্য' : 'Inventory Asset Value', report.inventoryTotalValue, `${report.inventoryTotalItems} items, ${report.inventoryLowStockCount} low stock`],
    [isBn ? 'সাপোর্ট টিকেট সমাধান' : 'Support Tickets Resolved', report.ticketsResolved, `Total: ${report.ticketsTotal}, Rate: ${report.ticketsResolutionRate}%`],
    [isBn ? 'স্টাফ উপস্থিতি হার (%)' : 'Operational Attendance Rate (%)', report.attendanceOperationalRate, `Total logs: ${report.attendanceTotalLogs}`]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Sheet 2: 12-Month Breakdown (always useful for selected year)
  const monthlyHeader = [
    isBn ? 'মাস' : 'Month',
    isBn ? 'কোম্পানি আয়' : 'Company Income',
    isBn ? 'কোম্পানি ব্যয়' : 'Company Expense',
    isBn ? 'নিট লাভ/লস' : 'Net Profit/Loss',
    isBn ? 'বেতন ব্যয়' : 'Payroll Expense',
    isBn ? 'চ্যানেল জমা' : 'Channel In',
    isBn ? 'চ্যানেল খরচ' : 'Channel Out',
    isBn ? 'বিল প্রো আদায়' : 'Bill Pro Paid',
    isBn ? 'বিল প্রো বকেয়া' : 'Bill Pro Due',
    isBn ? 'টিকেট সমাধান' : 'Tickets Resolved',
    isBn ? 'উপস্থিতি (%)' : 'Attendance (%)'
  ];
  const monthlyData = report.yearlyMonthlyMatrix.map((m) => [
    isBn ? m.monthBn : m.monthEn,
    m.companyIncome,
    m.companyExpense,
    m.companyNet,
    m.salaryExpense,
    m.channelIn,
    m.channelOut,
    m.billPaidTotal,
    m.billDueTotal,
    `${m.ticketsResolved}/${m.ticketsTotal}`,
    m.attendancePresentRate
  ]);
  const wsMonthly = XLSX.utils.aoa_to_sheet([monthlyHeader, ...monthlyData]);
  XLSX.utils.book_append_sheet(wb, wsMonthly, `Year_${report.year}`);

  // Sheet 3: Categories
  const catHeader = [isBn ? 'ধরন' : 'Type', isBn ? 'খাতের নাম' : 'Category', isBn ? 'এন্ট্রি' : 'Count', isBn ? 'পরিমাণ (৳)' : 'Amount', isBn ? 'শতাংশ (%)' : 'Share (%)'];
  const catRows = [
    ...report.incomeCategories.map((c) => [isBn ? 'আয়' : 'Income', c.category, c.count, c.amount, c.percentage]),
    ...report.expenseCategories.map((c) => [isBn ? 'ব্যয়' : 'Expense', c.category, c.count, c.amount, c.percentage])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([catHeader, ...catRows]), 'Categories');

  // Sheet 4: Bill Manager Pro
  const billHeader = [isBn ? 'সেবা' : 'Service', isBn ? 'পরিশোধিত' : 'Paid', isBn ? 'বকেয়া' : 'Due', isBn ? 'মোট' : 'Total', isBn ? 'আদায় (%)' : 'Rate (%)', isBn ? 'রেকর্ড' : 'Records'];
  const billData = report.billRows.map((b) => [isBn ? b.labelBn : b.labelEn, b.paid, b.due, b.total, b.collectionRate, b.count]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([billHeader, ...billData]), 'BillManager');

  // Sheet 5: Payment Channels
  const chHeader = [isBn ? 'চ্যানেল' : 'Channel', isBn ? 'জমা' : 'Inflow', isBn ? 'খরচ' : 'Outflow', isBn ? 'নিট' : 'Net', isBn ? 'বর্তমান ব্যালেন্স' : 'Live Balance', isBn ? 'এন্ট্রি' : 'Entries'];
  const chData = report.channelRows.map((c) => [isBn ? c.labelBn : c.labelEn, c.periodIn, c.periodOut, c.periodNet, c.liveBalance, c.periodCount]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([chHeader, ...chData]), 'Channels');

  // Sheet 6: Ledger Entries (Chronological: 1st added on top)
  if (report.ledgerRows.length > 0) {
    const ledHeader = [
      isBn ? 'ক্রমিক' : 'SL',
      isBn ? 'তারিখ' : 'Date',
      isBn ? 'সময়' : 'Time',
      isBn ? 'মডিউল' : 'Module',
      isBn ? 'ধরন' : 'Type',
      isBn ? 'খাত' : 'Category',
      isBn ? 'মাধ্যম' : 'Method',
      isBn ? 'বিবরণ' : 'Description',
      isBn ? 'পরিমাণ' : 'Amount'
    ];
    const ledData = report.ledgerRows.map((l) => [
      l.serialNo,
      l.date,
      l.timeLabel || '',
      isBn ? l.moduleLabelBn : l.moduleLabelEn,
      l.type === 'income' ? (isBn ? 'আয়' : 'Income') : (isBn ? 'ব্যয়' : 'Expense'),
      l.category,
      l.method,
      l.description,
      l.type === 'expense' ? -l.amount : l.amount
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([ledHeader, ...ledData]), 'Ledger');
  }

  const filename =
    report.mode === 'monthly'
      ? `Protyasha_Automated_Report_${report.monthYM}.xlsx`
      : `Protyasha_Annual_Report_${report.year}.xlsx`;
  XLSX.writeFile(wb, filename);
}
