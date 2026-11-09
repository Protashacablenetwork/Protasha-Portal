import { toBengaliNumber } from './formatters';

const HIJRI_MONTHS_BN = [
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

/**
 * Calculate accurate Hijri Date with optional lunar sight adjustment
 */
export function getHijriDate(date: Date = new Date(), dayAdjustment: number = 0): {
  dayBn: string;
  monthBn: string;
  yearBn: string;
  formattedBn: string;
} {
  const adjusted = new Date(date);
  if (dayAdjustment !== 0) {
    adjusted.setDate(adjusted.getDate() + dayAdjustment);
  }

  try {
    // Try browser/Node Intl Islamic calendar
    const formatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(adjusted);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10);
      if (part.type === 'year') year = parseInt(part.value, 10);
    }

    const monthIndex = Math.max(0, Math.min(11, month - 1));
    const monthBn = HIJRI_MONTHS_BN[monthIndex] || 'জুমাদাল উলা';
    const dayBn = toBengaliNumber(day);
    const yearBn = toBengaliNumber(year);

    return {
      dayBn,
      monthBn,
      yearBn,
      formattedBn: `${dayBn} ${monthBn}, ${yearBn} হিজরি`
    };
  } catch {
    // Kuwaiti Algorithm Fallback
    const jd = Math.floor(adjusted.getTime() / 86400000) + 2440587.5;
    let l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const month = Math.floor((24 * l) / 709);
    const day = l - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    const monthIndex = Math.max(0, Math.min(11, month - 1));
    const monthBn = HIJRI_MONTHS_BN[monthIndex] || 'জুমাদাল উলা';
    const dayBn = toBengaliNumber(day);
    const yearBn = toBengaliNumber(year);

    return {
      dayBn,
      monthBn,
      yearBn,
      formattedBn: `${dayBn} ${monthBn}, ${yearBn} হিজরি`
    };
  }
}
