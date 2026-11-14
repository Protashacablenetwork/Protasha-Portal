import { toBengaliNumber } from './formatters';

export const HIJRI_MONTHS_BN = [
  'মুহাররম',
  'সফর',
  'রবিউল আউয়াল',
  'রবিউস সানি',
  'জুমাদাল উলা',
  'জুমাদাল উখরা',
  'রজব',
  'শাবান',
  'রমাদান',
  'শাওয়াল',
  'জিলকদ',
  'জিলহজ'
];

export interface HijriDateInfo {
  day: number;
  month: number; // 1-12 (9 = Ramadan)
  year: number;
  dayBn: string;
  monthBn: string;
  yearBn: string;
  formattedBn: string;
  shortBn: string;
  isRamadan: boolean;
}

/**
 * Calculate accurate Hijri Date with optional lunar sight adjustment
 */
export function getHijriDate(date: Date = new Date(), dayAdjustment: number = 0): HijriDateInfo {
  const adjusted = new Date(date);
  if (dayAdjustment !== 0) {
    adjusted.setDate(adjusted.getDate() + dayAdjustment);
  }

  let day = 1;
  let month = 1;
  let year = 1448;

  try {
    const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(adjusted);

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10) || 1;
      if (part.type === 'month') month = parseInt(part.value, 10) || 1;
      if (part.type === 'year') year = parseInt(part.value, 10) || 1448;
    }
  } catch {
    // Kuwaiti Algorithm Fallback
    const jd = Math.floor(adjusted.getTime() / 86400000) + 2440587.5;
    let l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    month = Math.floor((24 * l) / 709);
    day = l - Math.floor((709 * month) / 24);
    year = 30 * n + j - 30;
  }

  const clampedMonth = Math.max(1, Math.min(12, month));
  const monthBn = HIJRI_MONTHS_BN[clampedMonth - 1] || 'মুহাররম';
  const dayBn = toBengaliNumber(day);
  const yearBn = toBengaliNumber(year);

  return {
    day,
    month: clampedMonth,
    year,
    dayBn,
    monthBn,
    yearBn,
    formattedBn: `${dayBn} ${monthBn}, ${yearBn} হিজরি`,
    shortBn: `${dayBn} ${monthBn}`,
    isRamadan: clampedMonth === 9
  };
}

/**
 * Find the primary Gregorian month (0-indexed) in a given year where Ramadan falls
 */
export function findRamadanMonthInYear(year: number): {
  monthIndex: number;
  hijriYear: number;
  daysMatched: number;
} {
  let bestMonth = 1;
  let bestCount = 0;
  let bestHijriYear = 1448;

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    let count = 0;
    let hy = 1448;
    for (let d = 1; d <= daysInMonth; d++) {
      const h = getHijriDate(new Date(year, m, d, 12, 0, 0));
      if (h.isRamadan) {
        count++;
        hy = h.year;
      }
    }
    if (count > bestCount) {
      bestCount = count;
      bestMonth = m;
      bestHijriYear = hy;
    }
  }

  return {
    monthIndex: bestMonth,
    hijriYear: bestHijriYear,
    daysMatched: bestCount
  };
}

/**
 * Calculate days remaining until the next 1st of Ramadan from a reference date
 */
export function getDaysUntilNextRamadan(fromDate: Date = new Date()): number {
  const currentHijri = getHijriDate(fromDate);
  if (currentHijri.isRamadan) return 0;

  const probe = new Date(fromDate);
  probe.setHours(12, 0, 0, 0);
  for (let i = 1; i <= 370; i++) {
    probe.setDate(probe.getDate() + 1);
    const h = getHijriDate(probe);
    if (h.isRamadan) {
      return i;
    }
  }
  return 0;
}
