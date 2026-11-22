import { QuickHisabOwner, StaffAccount, StaffTransaction, UserSession } from '../types';
import { toEnglishNumber } from './formatters';
import { normalizePhoneNumber } from './permissions';
import { broadcastStaffAccounts, upsertSingleStaffToCloud } from './staffSync';

export const isOwnerRoleAccount = (acc?: StaffAccount | null): boolean => {
  if (!acc || acc.isActive === false) return false;
  const roleText = `${acc.role || ''} ${(acc as any).designation || ''}`.toLowerCase();
  return (
    roleText.includes('মালিক') ||
    roleText.includes('অংশীদার') ||
    roleText.includes('owner') ||
    roleText.includes('partner')
  );
};

export const normalizePersonName = (raw?: string | null, stripParens = true): string => {
  if (!raw) return '';
  let text = String(raw).trim().toLowerCase();
  if (stripParens) {
    text = text.replace(/\([^)]*\)/g, ' ');
  }
  text = text
    .replace(/^(মোঃ|মো:|মো\.|md\.|md)\s*/gi, 'মো ')
    .replace(/[.:ঃ,\-_/|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
};

export const doesOwnerMatchAccount = (owner: QuickHisabOwner, acc: StaffAccount): boolean => {
  if (!owner || !acc) return false;
  const ownerPhone = normalizePhoneNumber(toEnglishNumber(owner.phone || ''));
  const accPhone = normalizePhoneNumber(toEnglishNumber(acc.phone || ''));
  if (ownerPhone.length >= 6 && accPhone.length >= 6 && ownerPhone === accPhone) {
    return true;
  }

  const ownerNameBase = normalizePersonName(owner.name, true);
  const accNameBase = normalizePersonName(acc.name, true);
  if (ownerNameBase.length >= 2 && accNameBase.length >= 2 && ownerNameBase === accNameBase) {
    return true;
  }

  const ownerNameFull = normalizePersonName(owner.name, false);
  const accNameFull = normalizePersonName(acc.name, false);
  if (ownerNameFull.length >= 2 && accNameFull.length >= 2 && ownerNameFull === accNameFull) {
    return true;
  }

  return false;
};

export interface OwnerDividendBreakdown {
  owner: QuickHisabOwner;
  shareUnits: number;
  sharePercentage: number;
  isHalf: boolean;
  grossShare: number;
  matchedAccounts: StaffAccount[];
  totalDue: number;
  totalCollected: number;
  accountRemainingDue: number;
  applicableCompanyDue: number;
  deductedAmount: number;
  netPayable: number;
  unpaidDueAfterDividend: number;
  transactions: StaffTransaction[];
}

export interface OwnersDividendLedgerResult {
  totalShareUnits: number;
  byOwnerId: Record<string, OwnerDividendBreakdown>;
  totalGrossDividend: number;
  totalCompanyDueAllOwners: number;
  totalDeductedFromDividend: number;
  totalNetPayableAfterDeduction: number;
  ownersWithDueCount: number;
}

export function computeOwnersDividendLedger(
  owners: QuickHisabOwner[],
  staffAccounts: StaffAccount[],
  netProfit: number
): OwnersDividendLedgerResult {
  const safeOwners = Array.isArray(owners) ? owners : [];
  const totalShareUnits =
    safeOwners.reduce((sum, o) => sum + (Number(o.shareUnits) || 0), 0) || 12.5;

  const ownerRoleAccounts = (staffAccounts || []).filter(isOwnerRoleAccount);

  // Track unallocated remaining due per matched StaffAccount ID so duplicate share cards
  // belonging to the same owner never double-count the same company due.
  const remainingDuePool = new Map<string, number>();
  ownerRoleAccounts.forEach((acc) => {
    const computedRemaining =
      acc.remainingDue !== undefined
        ? Number(acc.remainingDue) || 0
        : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
    remainingDuePool.set(String(acc.id), Math.max(0, computedRemaining));
  });

  const byOwnerId: Record<string, OwnerDividendBreakdown> = {};
  const countedAccountIds = new Set<string>();

  let totalGrossDividend = 0;
  let totalCompanyDueAllOwners = 0;
  let totalDeductedFromDividend = 0;
  let totalNetPayableAfterDeduction = 0;
  let ownersWithDueCount = 0;

  safeOwners.forEach((owner) => {
    const shareUnits = Number(owner.shareUnits) || 0;
    const isHalf = Boolean(owner.isHalf || shareUnits === 0.5);
    const sharePercentage = totalShareUnits > 0 ? (shareUnits / totalShareUnits) * 100 : 0;
    const grossShare = netProfit > 0 ? (netProfit * shareUnits) / totalShareUnits : 0;

    const matchedAccounts = ownerRoleAccounts.filter((acc) => doesOwnerMatchAccount(owner, acc));

    const totalDue = matchedAccounts.reduce((sum, acc) => sum + (Number(acc.totalDue) || 0), 0);
    const totalCollected = matchedAccounts.reduce(
      (sum, acc) => sum + (Number(acc.totalCollected) || 0),
      0
    );
    const accountRemainingDue = matchedAccounts.reduce((sum, acc) => {
      const rem =
        acc.remainingDue !== undefined
          ? Number(acc.remainingDue) || 0
          : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
      return sum + Math.max(0, rem);
    }, 0);

    let applicableCompanyDue = 0;
    matchedAccounts.forEach((acc) => {
      applicableCompanyDue += remainingDuePool.get(String(acc.id)) || 0;
    });

    const deductedAmount = Math.min(grossShare, Math.max(0, applicableCompanyDue));
    const netPayable = Math.max(0, grossShare - deductedAmount);
    const unpaidDueAfterDividend = Math.max(0, applicableCompanyDue - deductedAmount);

    // Deduct allocated amount from pool
    let leftToAllocate = deductedAmount;
    matchedAccounts.forEach((acc) => {
      const id = String(acc.id);
      if (!countedAccountIds.has(id)) {
        countedAccountIds.add(id);
        const rem = remainingDuePool.get(id) || 0;
        totalCompanyDueAllOwners += rem;
      }
      if (leftToAllocate <= 0) return;
      const available = remainingDuePool.get(id) || 0;
      const take = Math.min(available, leftToAllocate);
      remainingDuePool.set(id, available - take);
      leftToAllocate -= take;
    });

    if (applicableCompanyDue > 0) {
      ownersWithDueCount += 1;
    }

    const mergedTransactions = matchedAccounts
      .flatMap((acc) => acc.transactions || [])
      .sort((a, b) => {
        const tA = a.created || new Date(a.date).getTime() || 0;
        const tB = b.created || new Date(b.date).getTime() || 0;
        return tA - tB;
      });

    totalGrossDividend += grossShare;
    totalDeductedFromDividend += deductedAmount;
    totalNetPayableAfterDeduction += netPayable;

    byOwnerId[String(owner.id)] = {
      owner,
      shareUnits,
      sharePercentage,
      isHalf,
      grossShare,
      matchedAccounts,
      totalDue,
      totalCollected,
      accountRemainingDue,
      applicableCompanyDue,
      deductedAmount,
      netPayable,
      unpaidDueAfterDividend,
      transactions: mergedTransactions
    };
  });

  return {
    totalShareUnits,
    byOwnerId,
    totalGrossDividend,
    totalCompanyDueAllOwners,
    totalDeductedFromDividend,
    totalNetPayableAfterDeduction,
    ownersWithDueCount
  };
}

export async function recordOwnerDividendDeduction({
  staffAccounts,
  matchedAccounts,
  amountToDeduct,
  selectedMonth,
  monthLabel,
  ownerName,
  user,
  onSaveStaffAccounts
}: {
  staffAccounts: StaffAccount[];
  matchedAccounts: StaffAccount[];
  amountToDeduct: number;
  selectedMonth: string;
  monthLabel: string;
  ownerName: string;
  user: UserSession | null;
  onSaveStaffAccounts?: (updated: StaffAccount[]) => void;
}): Promise<{ updatedList: StaffAccount[]; settledAmount: number }> {
  let remainingToApply = Math.round(amountToDeduct * 100) / 100;
  if (remainingToApply <= 0 || matchedAccounts.length === 0) {
    return { updatedList: staffAccounts, settledAmount: 0 };
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const matchedIds = new Set(matchedAccounts.map((m) => String(m.id)));
  let workingList = [...staffAccounts];
  let settledAmount = 0;

  for (const acc of workingList) {
    if (!matchedIds.has(String(acc.id)) || remainingToApply <= 0) continue;
    const accRem =
      acc.remainingDue !== undefined
        ? Number(acc.remainingDue) || 0
        : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
    if (accRem <= 0) continue;

    const applyAmt = Math.min(accRem, remainingToApply);
    if (applyAmt <= 0) continue;

    const newTx: StaffTransaction = {
      id: `stx-div-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      staffId: acc.id,
      type: 'collection',
      amount: Math.round(applyAmt),
      date: todayStr,
      time: timeFormatted,
      userName: acc.userCode || '',
      customerName: ownerName,
      customerAddress: acc.address || '',
      reference: `লভ্যাংশ সমন্বয় (${selectedMonth})`,
      note: `লভ্যাংশ থেকে কর্তন (${monthLabel})`,
      recordedBy: user?.name || 'অ্যাডমিন',
      created: Date.now()
    };

    const nextTxs = [...(acc.transactions || []), newTx];
    const newTotalDue = nextTxs
      .filter((t) => t.type === 'due')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const newTotalCollected = nextTxs
      .filter((t) => t.type === 'collection')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const newRemaining = newTotalDue - newTotalCollected;

    const updatedAccount: StaffAccount = {
      ...acc,
      totalDue: newTotalDue,
      totalCollected: newTotalCollected,
      remainingDue: newRemaining,
      transactions: nextTxs
    };

    const result = await upsertSingleStaffToCloud(updatedAccount, workingList);
    workingList = result.updatedList;
    remainingToApply -= applyAmt;
    settledAmount += Math.round(applyAmt);
  }

  if (settledAmount > 0) {
    broadcastStaffAccounts(workingList);
    onSaveStaffAccounts?.(workingList);
  }

  return { updatedList: workingList, settledAmount };
}
