import { ALL_MONTHS, getActiveSheetLink } from '../../billManager/constants';
import type { BillServiceType } from '../../billManager/types';
import { fetchSheetRecordsFast } from '../../billManager/utils';
import { safeStorage } from '../../../utils/safeStorage';
import { getPrevMonthKey } from '../data/categories';

export interface BillServiceSummary {
  serviceType: BillServiceType;
  monthYM: string;
  bnMonth: string;
  count: number;
  totalPay: number;
  totalDue: number;
  grandTotal: number;
  source: 'cache' | 'live';
}

export function ymToBnMonth(ym: string): string {
  const parts = String(ym || '').split('-');
  const monthNum = parseInt(parts[1] || '', 10);
  if (monthNum >= 1 && monthNum <= 12) {
    return ALL_MONTHS[monthNum - 1];
  }
  return '';
}

export function summarizeCachedSheet(
  serviceType: BillServiceType,
  monthYM: string
): BillServiceSummary | null {
  const bnMonth = ymToBnMonth(monthYM);
  if (!bnMonth) return null;
  try {
    const raw = safeStorage.getItem(`bill_v4_${serviceType}_${bnMonth}`);
    if (!raw) return null;
    const recs = JSON.parse(raw) as Array<{ pay?: number; due?: number }>;
    if (!Array.isArray(recs) || recs.length === 0) return null;
    const totalPay = Math.round(recs.reduce((s, r) => s + (Number(r.pay) || 0), 0));
    const totalDue = Math.round(recs.reduce((s, r) => s + (Number(r.due) || 0), 0));
    return {
      serviceType,
      monthYM,
      bnMonth,
      count: recs.length,
      totalPay,
      totalDue,
      grandTotal: totalPay + totalDue,
      source: 'cache'
    };
  } catch {
    return null;
  }
}

export async function fetchBillServiceSummary(
  serviceType: BillServiceType,
  monthYM: string,
  forceFresh = false
): Promise<BillServiceSummary | null> {
  const bnMonth = ymToBnMonth(monthYM);
  if (!bnMonth) return null;

  const sheetUrl = getActiveSheetLink(serviceType, bnMonth);
  if (!sheetUrl) {
    return summarizeCachedSheet(serviceType, monthYM);
  }

  try {
    const recs = await fetchSheetRecordsFast(sheetUrl, serviceType, { forceFresh });
    if (recs && recs.length > 0) {
      safeStorage.setItem(`bill_v4_${serviceType}_${bnMonth}`, JSON.stringify(recs));
      const totalPay = Math.round(recs.reduce((s, r) => s + (Number(r.pay) || 0), 0));
      const totalDue = Math.round(recs.reduce((s, r) => s + (Number(r.due) || 0), 0));
      return {
        serviceType,
        monthYM,
        bnMonth,
        count: recs.length,
        totalPay,
        totalDue,
        grandTotal: totalPay + totalDue,
        source: 'live'
      };
    }
  } catch {
    // Fallback to cache below
  }

  return summarizeCachedSheet(serviceType, monthYM);
}

/**
 * Loads current selected month's "নেট সংযোগ" summary from Bill Manager Pro.
 */
export async function fetchNetConnectionSummary(
  monthYM: string,
  forceFresh = false
): Promise<BillServiceSummary | null> {
  return fetchBillServiceSummary('নেট সংযোগ', monthYM, forceFresh);
}

/**
 * Loads previous month's "বকেয়া বিল" summary for the given selected month.
 * e.g., when selectedMonth is "2026-11" (নভেম্বর), it loads "অক্টোবর" (2026-10) বকেয়া বিল sheet.
 */
export async function fetchPrevMonthDueBillSummary(
  currentMonthYM: string,
  forceFresh = false
): Promise<BillServiceSummary | null> {
  const prevYM = getPrevMonthKey(currentMonthYM);
  return fetchBillServiceSummary('বকেয়া বিল', prevYM, forceFresh);
}
