import * as XLSX from 'xlsx';
import { BillRecord, BillServiceType } from './types';

export function getBillManagerLogoUrl(): string {
  const assetBase = typeof window !== 'undefined' ? (window as any).__PCN_ASSET_BASE__ : '';
  return assetBase ? `${assetBase}bill-manager-logo.jpg` : './bill-manager-logo.jpg';
}

export async function fetchWithCorsFallback(rawUrl: string): Promise<ArrayBuffer | null> {
  if (!rawUrl) return null;
  const cacheBuster = `_t=${Date.now()}`;
  const separator = rawUrl.includes('?') ? '&' : '?';
  const urlWithBuster = `${rawUrl}${separator}${cacheBuster}`;

  // Strategy 1: Local Express server proxy endpoint (works in full-stack Node/Vite mode)
  try {
    const proxyUrl = `/api/fetch-sheet?url=${encodeURIComponent(rawUrl)}&${cacheBuster}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('text/html')) {
        return await res.arrayBuffer();
      }
    }
  } catch (e) {
    console.warn('[BillManager] Local proxy failed, trying public CORS proxies...', e);
  }

  // Strategy 2: corsproxy.io (for static hosting e.g. InfinityFree)
  try {
    const corsUrl = `https://corsproxy.io/?${encodeURIComponent(urlWithBuster)}`;
    const res = await fetch(corsUrl);
    if (res.ok) return await res.arrayBuffer();
  } catch (e) {
    console.warn('[BillManager] corsproxy.io failed', e);
  }

  // Strategy 3: allorigins
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithBuster)}`);
    if (res.ok) return await res.arrayBuffer();
  } catch (e) {
    console.warn('[BillManager] allorigins failed', e);
  }

  // Strategy 4: Direct fetch fallback
  try {
    const res = await fetch(urlWithBuster);
    if (res.ok) return await res.arrayBuffer();
  } catch (e) {
    console.error('[BillManager] Direct fetch blocked by CORS', e);
  }

  return null;
}

export function toEnglishDigits(str: unknown): string {
  if (str === null || str === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let res = String(str);
  for (let i = 0; i < 10; i++) {
    res = res.split(bnDigits[i]).join(String(i));
  }
  return res;
}

export function parseAmount(val: unknown): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return Number.isNaN(val) ? 0 : val;
  const cleaned = toEnglishDigits(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

export function formatPhone(s: unknown): string {
  if (!s || s === '---' || s === '-') return '---';
  let clean = toEnglishDigits(s).replace(/\D/g, '');
  if (clean.startsWith('880') && clean.length === 13) clean = '0' + clean.slice(3);
  else if (clean.length === 11 && clean.startsWith('01')) return clean;
  else if (clean.length === 10 && !clean.startsWith('0')) clean = '0' + clean;
  return clean.length >= 10 ? clean : String(s);
}

export function parseExcelDate(val: unknown): string {
  if (!val || val === '-' || val === '---') return '-';
  if (typeof val === 'number' && val > 1) {
    const d = new Date((val - 25569) * 86400000);
    if (!Number.isNaN(d.getTime())) {
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }
  }
  if (typeof val === 'string') {
    const eng = toEnglishDigits(val.trim());
    const isoMatch = eng.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (isoMatch) return `${isoMatch[3].padStart(2, '0')}/${isoMatch[2].padStart(2, '0')}/${isoMatch[1]}`;
    const dmyMatch = eng.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
    if (dmyMatch) {
      const yr = dmyMatch[3].length === 2 ? `20${dmyMatch[3]}` : dmyMatch[3];
      return `${dmyMatch[1].padStart(2, '0')}/${dmyMatch[2].padStart(2, '0')}/${yr}`;
    }
    return eng;
  }
  return '-';
}

export function parseDateForSort(dateStr: string): Date | null {
  if (!dateStr || dateStr === '-' || dateStr === '---') return null;
  const clean = toEnglishDigits(dateStr.trim());
  const parts = clean.split(/[\/\-\.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    const yr = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
    return new Date(yr, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }
  return null;
}

export function isLikelyPhoneNumber(val: unknown): boolean {
  if (!val) return false;
  const str = toEnglishDigits(val).trim().replace(/[\s\-\(\)\.]/g, '');
  return (
    (str.startsWith('01') && str.length >= 10 && str.length <= 13) ||
    (str.startsWith('8801') && str.length >= 13) ||
    str.startsWith('+8801')
  );
}

export function isLikelyDateString(val: unknown): boolean {
  if (!val) return false;
  if (typeof val === 'number' && val > 30000 && val < 60000) return true;
  const str = toEnglishDigits(val).trim();
  return /^(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,4})/.test(str);
}

export function normalizeBengali(str: unknown): string {
  if (!str) return '';
  return String(str)
    .replace(/[\s\u0981-\u0983\u09BC\u09BE-\u09CD\u09D7\u09E2\u09E3]/g, '')
    .replace(/[অআ]/g, 'অ')
    .replace(/[ইঈএ]/g, 'ই')
    .replace(/[উঊও]/g, 'উ')
    .replace(/[শষস]/g, 'স')
    .replace(/[ণন]/g, 'ন')
    .replace(/[ড়ঢ়র]/g, 'র')
    .replace(/[যজ]/g, 'জ')
    .replace(/[তৎ]/g, 'ত')
    .replace(/[বভ]/g, 'ব')
    .toLowerCase()
    .trim();
}

export function parseWorkbookBuffer(buffer: ArrayBuffer, netType: BillServiceType | string): BillRecord[] {
  const wb = XLSX.read(buffer, { type: 'array' });
  return parseWorkbook(wb, netType);
}

export function parseWorkbook(wb: XLSX.WorkBook, netType: BillServiceType | string): BillRecord[] {
  if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) return [];
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
  if (!rows || rows.length < 2) return [];

  let headerRowIdx = -1;
  let colId = -1;
  let colName = -1;
  let colPay = -1;
  let colDue = -1;
  let colTotal = -1;
  let colDate = -1;
  let colMob = -1;
  let colAddr = -1;
  let colStatus = -1;

  for (let r = 0; r < Math.min(10, rows.length); r++) {
    const row = rows[r];
    if (!row || !Array.isArray(row)) continue;
    const rowStr = row.map((c) => String(c || '').trim()).join(' ');
    if (
      rowStr.includes('ক্রমিক') &&
      (rowStr.includes('নাম') || rowStr.includes('ইউজার') || rowStr.includes('আইডি'))
    ) {
      headerRowIdx = r;
      row.forEach((cell, cIdx) => {
        const txt = String(cell || '').trim();
        const lower = txt.toLowerCase();
        if (txt.includes('ইউজার') || txt.includes('আইডি') || lower.includes('user') || lower === 'id') {
          colId = cIdx;
        } else if (
          txt.includes('গ্রাহকের নাম') ||
          (txt.includes('নাম') &&
            !txt.includes('বিলের') &&
            !txt.includes('মাসের') &&
            !txt.includes('নাম্বার') &&
            !txt.includes('লিখুন'))
        ) {
          colName = cIdx;
        } else if (
          txt.includes('পে-বিল') ||
          txt.includes('পে বিল') ||
          txt.includes('পরিশোধ') ||
          txt.includes('আদায়') ||
          lower === 'pay'
        ) {
          colPay = cIdx;
        } else if (txt.includes('বকেয়া বিল') || txt.includes('বকেয়া') || lower === 'due') {
          colDue = cIdx;
        } else if (
          txt.includes('সর্বমোট') ||
          txt.includes('সর্বমোট') ||
          txt.includes('মোট ব্যালেন্স') ||
          lower === 'total'
        ) {
          colTotal = cIdx;
        } else if (txt.includes('তারিখ') || lower.includes('date')) {
          colDate = cIdx;
        } else if (
          txt.includes('মোবাইল') ||
          txt.includes('মোবাইল') ||
          txt.includes('ফোন') ||
          lower.includes('phone') ||
          lower.includes('mob')
        ) {
          colMob = cIdx;
        } else if (
          txt.includes('ঠিকানা') ||
          txt.includes('এরিয়া') ||
          txt.includes('এলাকা') ||
          lower.includes('address')
        ) {
          colAddr = cIdx;
        } else if (txt.includes('স্ট্যাটাস') || txt.includes('মন্তব্য') || lower.includes('status')) {
          colStatus = cIdx;
        }
      });
      break;
    }
  }

  const isDis = netType === 'ডিস বিল';
  if (colName === -1) {
    colId = isDis ? -1 : 1;
    colName = isDis ? 1 : 2;
    colPay = isDis ? 2 : 3;
    colDue = isDis ? 3 : 4;
    colTotal = isDis ? 4 : 5;
    colDate = isDis ? 5 : 6;
    colMob = isDis ? 6 : 7;
    colAddr = isDis ? 7 : 8;
    colStatus = netType === 'নেট সংযোগ' || netType === 'বকেয়া বিল' ? 9 : -1;
  }

  const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 5;
  const records: BillRecord[] = [];
  const seen = new Set<string>();

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const firstCell = row[0] ? String(row[0]).trim() : '';
    if (firstCell.includes('মোট') || firstCell === '0' || firstCell === '০') continue;

    const uid = colId !== -1 && row[colId] !== undefined ? String(row[colId]).trim() : '';
    const name = colName !== -1 && row[colName] !== undefined ? String(row[colName]).trim() : '';

    if (!name && !uid) continue;
    if (name === '0' || name === '০') continue;
    if (name.includes('মোট') || name.toLowerCase().includes('total')) continue;
    if (name.includes('গ্রাহকের নাম') || name.includes('ইউজার')) continue;

    const unique = `${uid}_${name}_${i}`;
    if (seen.has(unique)) continue;
    seen.add(unique);

    const pay = colPay !== -1 ? parseAmount(row[colPay]) : 0;
    const due = colDue !== -1 ? parseAmount(row[colDue]) : 0;
    const sheetTotal = colTotal !== -1 ? parseAmount(row[colTotal]) : 0;
    const total = sheetTotal > 0 ? sheetTotal : pay + due;

    let rawDate = colDate !== -1 ? row[colDate] : '';
    let rawMob = colMob !== -1 ? row[colMob] : '';
    const rawAddr = colAddr !== -1 && row[colAddr] !== undefined ? String(row[colAddr]).trim() : '---';
    const rawStatus = colStatus !== -1 && row[colStatus] !== undefined ? String(row[colStatus]).trim() : '';

    if (isLikelyPhoneNumber(rawDate) && !isLikelyPhoneNumber(rawMob)) {
      const temp = rawDate;
      rawDate = rawMob;
      rawMob = temp;
    } else if (isLikelyDateString(rawMob) && !isLikelyDateString(rawDate)) {
      const temp = rawDate;
      rawDate = rawMob;
      rawMob = temp;
    }

    let finalStatus = rawStatus;
    if (!finalStatus) {
      if (due === 0 && pay > 0) finalStatus = 'পরিশোধিত';
      else if (due > 0 && pay > 0) finalStatus = 'আংশিক';
      else if (due > 0 && pay === 0) finalStatus = 'বকেয়া';
      else finalStatus = 'পরিশোধিত';
    }

    records.push({
      id: colId !== -1 && uid ? uid : isDis ? null : '-----',
      name: name || 'নাম নেই',
      pay,
      due,
      total,
      date: parseExcelDate(rawDate),
      mob: formatPhone(rawMob),
      address: rawAddr || '---',
      status: finalStatus
    });
  }

  return records;
}

export function exportRecordsToExcel(
  records: BillRecord[],
  currentNet: string,
  currentMonth: string
): void {
  const isDisBill = currentNet === 'ডিস বিল';
  const data = records.map((r, i) => {
    const rowObj: Record<string, string | number> = { SL: i + 1 };
    if (!isDisBill) {
      rowObj.ID = r.id || '---';
    }
    rowObj.Name = r.name;
    rowObj.Paid = r.pay;
    rowObj.Due = r.due;
    rowObj.Total = r.total;
    rowObj.Mobile = r.mob;
    rowObj.Date = r.date;
    rowObj.Address = r.address;
    return rowObj;
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bills');
  XLSX.writeFile(wb, `Bill_${currentNet}_${currentMonth}.xlsx`);
}
