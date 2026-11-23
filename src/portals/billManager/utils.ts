import { BillRecord, BillServiceType } from './types';

export function getBillManagerLogoUrl(): string {
  const assetBase = typeof window !== 'undefined' ? (window as any).__PCN_ASSET_BASE__ : '';
  return assetBase ? `${assetBase}bill-manager-logo.jpg` : './bill-manager-logo.jpg';
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  const value = String(text ?? '').trim();
  if (!value) return false;

  // Try modern Clipboard API when allowed in secure context
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Clipboard API is often blocked in embedded iframes / mobile WebViews -> fall through to execCommand
    }
  }

  // Universal fallback: off-screen textarea inside modal (or body) + execCommand('copy')
  if (typeof document !== 'undefined') {
    const previousFocus = document.activeElement as HTMLElement | null;
    const host =
      (document.querySelector('.bm-modal-content') as HTMLElement | null) ||
      document.body ||
      document.documentElement;
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.contentEditable = 'true';
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.fontSize = '16px';
    textarea.style.opacity = '0.01';

    try {
      host.appendChild(textarea);
      textarea.focus({ preventScroll: true });
      textarea.select();
      textarea.setSelectionRange(0, value.length);
      const ok = document.execCommand('copy');
      if (ok) return true;
    } catch {
      // ignore and return false
    } finally {
      try {
        if (textarea.parentNode) textarea.parentNode.removeChild(textarea);
      } catch {}
      try {
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus({ preventScroll: true });
        }
      } catch {}
    }
  }

  return false;
}

export function toCsvSheetUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  if (rawUrl.includes('docs.google.com/spreadsheets/') && rawUrl.includes('format=xlsx')) {
    return rawUrl.replace(/format=xlsx/gi, 'format=csv');
  }
  return rawUrl;
}

async function fetchWithTimeout(url: string, timeoutMs = 7500): Promise<Response> {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    return await fetch(url, { signal: ctrl ? ctrl.signal : undefined });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function fetchWithCorsFallback(
  rawUrl: string,
  options?: { forceFresh?: boolean; timeoutMs?: number }
): Promise<ArrayBuffer | null> {
  if (!rawUrl) return null;
  const cacheBuster = `_t=${Date.now()}`;
  const separator = rawUrl.includes('?') ? '&' : '?';
  const urlWithBuster = `${rawUrl}${separator}${cacheBuster}`;
  const freshParam = options?.forceFresh ? '&fresh=1' : '';
  const timeoutMs = options?.timeoutMs ?? 8000;

  // Strategy 1: Local Express server proxy endpoint (fastest + keeps server micro-cache)
  try {
    const proxyUrl = `/api/fetch-sheet?url=${encodeURIComponent(rawUrl)}${freshParam}${options?.forceFresh ? `&${cacheBuster}` : ''}`;
    const res = await fetchWithTimeout(proxyUrl, timeoutMs);
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
    const res = await fetchWithTimeout(corsUrl, timeoutMs);
    if (res.ok) {
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('text/html')) return await res.arrayBuffer();
    }
  } catch (e) {
    console.warn('[BillManager] corsproxy.io failed', e);
  }

  // Strategy 3: allorigins
  try {
    const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithBuster)}`, timeoutMs);
    if (res.ok) {
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('text/html')) return await res.arrayBuffer();
    }
  } catch (e) {
    console.warn('[BillManager] allorigins failed', e);
  }

  // Strategy 4: Direct fetch fallback
  try {
    const res = await fetchWithTimeout(urlWithBuster, timeoutMs);
    if (res.ok) return await res.arrayBuffer();
  } catch (e) {
    console.error('[BillManager] Direct fetch blocked by CORS', e);
  }

  return null;
}

// Fast session memory cache for parsed Google Sheet records (30s TTL)
const sessionSheetCache = new Map<string, { records: BillRecord[]; fetchedAt: number }>();
const SESSION_CACHE_TTL_MS = 30 * 1000;

export function getCachedSheetRecords(rawUrl: string, netType: BillServiceType | string): BillRecord[] | null {
  const key = `${netType}::${rawUrl}`;
  const hit = sessionSheetCache.get(key);
  if (hit && Date.now() - hit.fetchedAt < SESSION_CACHE_TTL_MS) {
    return hit.records;
  }
  return null;
}

export function setCachedSheetRecords(rawUrl: string, netType: BillServiceType | string, records: BillRecord[]): void {
  const key = `${netType}::${rawUrl}`;
  sessionSheetCache.set(key, { records, fetchedAt: Date.now() });
}

export function parseCsvMatrix(csvText: string): string[][] {
  const cleaned = csvText.charCodeAt(0) === 0xfeff ? csvText.slice(1) : csvText;
  const rows: string[][] = [];
  let curRow: string[] = [];
  let curVal = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inQuotes) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') {
          curVal += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        curVal += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      curRow.push(curVal);
      curVal = '';
    } else if (ch === '\r') {
      if (cleaned[i + 1] === '\n') i++;
      curRow.push(curVal);
      rows.push(curRow);
      curRow = [];
      curVal = '';
    } else if (ch === '\n') {
      curRow.push(curVal);
      rows.push(curRow);
      curRow = [];
      curVal = '';
    } else {
      curVal += ch;
    }
  }
  if (curVal.length > 0 || curRow.length > 0) {
    curRow.push(curVal);
    rows.push(curRow);
  }
  return rows;
}

/**
 * Fetches & parses a Google Sheet quickly:
 * 1) Prefers lightweight CSV (~50% smaller download, ~2ms pure-JS parse, zero xlsx bundle cost)
 * 2) Falls back automatically to XLSX binary + lazy xlsx import if CSV fails or non-Google URL returns binary
 */
export async function fetchSheetRecordsFast(
  rawUrl: string,
  netType: BillServiceType | string,
  options?: { forceFresh?: boolean }
): Promise<BillRecord[] | null> {
  if (!rawUrl) return null;
  if (!options?.forceFresh) {
    const memHit = getCachedSheetRecords(rawUrl, netType);
    if (memHit) return memHit;
  }

  const csvUrl = toCsvSheetUrl(rawUrl);
  const isCsvPreferred = csvUrl !== rawUrl || rawUrl.includes('format=csv') || rawUrl.includes('tqx=out:csv');

  if (isCsvPreferred) {
    const csvBuffer = await fetchWithCorsFallback(csvUrl, { forceFresh: options?.forceFresh });
    if (csvBuffer && csvBuffer.byteLength > 0) {
      const bytes = new Uint8Array(csvBuffer.slice(0, 4));
      const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // PK zip signature -> actually xlsx
      if (isZip) {
        const recs = await parseWorkbookBufferAsync(csvBuffer, netType);
        setCachedSheetRecords(rawUrl, netType, recs);
        return recs;
      }
      const text = new TextDecoder('utf-8').decode(csvBuffer);
      const trimmedHead = text.trimStart().slice(0, 200).toLowerCase();
      if (text && !trimmedHead.startsWith('<!doctype') && !trimmedHead.startsWith('<html')) {
        const rows = parseCsvMatrix(text);
        const recs = parseRowsToRecords(rows, netType);
        if (recs.length > 0) {
          setCachedSheetRecords(rawUrl, netType, recs);
          return recs;
        }
      }
    }
  }

  // Fallback to original URL (e.g., binary .xlsx)
  const buffer = await fetchWithCorsFallback(rawUrl, { forceFresh: options?.forceFresh });
  if (!buffer) return null;
  const recs = await parseWorkbookBufferAsync(buffer, netType);
  setCachedSheetRecords(rawUrl, netType, recs);
  return recs;
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

export function parseRowsToRecords(rows: any[][], netType: BillServiceType | string): BillRecord[] {
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

export async function parseWorkbookBufferAsync(
  buffer: ArrayBuffer,
  netType: BillServiceType | string
): Promise<BillRecord[]> {
  const bytes = new Uint8Array(buffer.slice(0, 4));
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) {
    try {
      const text = new TextDecoder('utf-8').decode(buffer);
      if (text && (text.includes(',') || text.includes('ক্রমিক'))) {
        return parseRowsToRecords(parseCsvMatrix(text), netType);
      }
    } catch {}
  }
  const XLSX = await import('xlsx');
  const wb = XLSX.read(buffer, { type: 'array' });
  if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) return [];
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
  return parseRowsToRecords(rows, netType);
}

export async function exportRecordsToExcel(
  records: BillRecord[],
  currentNet: string,
  currentMonth: string
): Promise<void> {
  const XLSX = await import('xlsx');
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
