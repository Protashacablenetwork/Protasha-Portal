import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { safeStorage } from './safeStorage';
import { getDriveAccessToken, getOrCreateBackupFolder } from './googleDrive';
import { collectMasterBackupData } from './backupCollector';

const ARCHIVE_TITLE = 'প্রত্যাশা ক্যাবল নেটওয়ার্ক - মাস্টার আর্কাইভ';
const ARCHIVE_STORAGE_KEY = 'protyasha_archive_ref';
const ARCHIVE_META_DOC_ID = 'cloud_archive_meta';
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

interface TabSpec {
  key: string;
  title: string;
  bannerText: string;
  headers: string[];
  colWidths: number[];
  numericCols: number[];
  tabColor: { red: number; green: number; blue: number };
}

const TAB_SPECS: TabSpec[] = [
  {
    key: 'dashboard',
    title: 'ড্যাশবোর্ড সারসংক্ষেপ',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — সম্পূর্ণ ডিজিটাল হিসাব ও ডেটাবেস সারসংক্ষেপ',
    headers: ['বিভাগ / সূচক', 'বিবরণ', 'পরিমাণ / সংখ্যা', 'মন্তব্য ও অবস্থা'],
    colWidths: [250, 260, 170, 280],
    numericCols: [2],
    tabColor: { red: 0.72, green: 0.11, blue: 0.11 }
  },
  {
    key: 'main_txns',
    title: 'মূল লেনদেন',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — মূল ড্যাশবোর্ড লেনদেন খতিয়ান',
    headers: ['ক্রমিক', 'তারিখ', 'সময়', 'ধরন', 'পরিমাণ (৳)', 'মাধ্যম', 'ব্যাংকের নাম', 'ব্যক্তি / গ্রাহক', 'মোবাইল', 'ক্যাটাগরি', 'বিবরণ / নোট', 'অবস্থা'],
    colWidths: [65, 110, 95, 85, 125, 110, 140, 170, 125, 140, 260, 105],
    numericCols: [0, 4],
    tabColor: { red: 0.02, green: 0.47, blue: 0.34 }
  },
  {
    key: 'ay_byay_txns',
    title: 'আয়-ব্যয় হিসাব',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — আয়-ব্যয় ও মাসিক হিসাব খতিয়ান',
    headers: ['ক্রমিক', 'তারিখ', 'সময়', 'ধরন', 'পরিমাণ (৳)', 'মাধ্যম', 'ব্যাংকের নাম', 'ব্যক্তি / গ্রাহক', 'মোবাইল', 'ক্যাটাগরি / উদ্দেশ্য', 'বিবরণ / নোট', 'এন্ট্রিকারী'],
    colWidths: [65, 110, 95, 85, 125, 110, 140, 170, 125, 160, 260, 160],
    numericCols: [0, 4],
    tabColor: { red: 0.06, green: 0.46, blue: 0.43 }
  },
  {
    key: 'staff',
    title: 'স্টাফ ও বকেয়া',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — স্টাফ তালিকা ও কোম্পানি বকেয়া হিসাব',
    headers: ['ক্রমিক', 'স্টাফের নাম', 'পদবি / ভূমিকা', 'মোবাইল', 'ইউজার কোড', 'মূল বেতন (৳)', 'মোট কোম্পানি পাওনা (৳)', 'মোট জমা (৳)', 'অবশিষ্ট বকেয়া (৳)', 'ঠিকানা', 'অবস্থা'],
    colWidths: [65, 180, 150, 125, 110, 120, 145, 125, 135, 220, 95],
    numericCols: [0, 5, 6, 7, 8],
    tabColor: { red: 0.26, green: 0.22, blue: 0.79 }
  },
  {
    key: 'staff_ledger',
    title: 'স্টাফ লেনদেন',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — স্টাফ কালেকশন ও কোম্পানি পাওনা লেনদেন লগ',
    headers: ['ক্রমিক', 'তারিখ', 'সময়', 'স্টাফের নাম', 'স্টাফ মোবাইল', 'লেনদেনের ধরন', 'পরিমাণ (৳)', 'গ্রাহক আইডি', 'গ্রাহকের নাম', 'ঠিকানা', 'রেফারেন্স ও নোট'],
    colWidths: [65, 110, 95, 160, 125, 130, 125, 115, 165, 190, 240],
    numericCols: [0, 6],
    tabColor: { red: 0.43, green: 0.16, blue: 0.85 }
  },
  {
    key: 'salaries',
    title: 'বেতন খাতা',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — মাসিক স্টাফ বেতন ও ভাউচার রেজিস্টার',
    headers: ['ক্রমিক', 'মাস', 'স্টাফের নাম', 'পদবি', 'মূল বেতন (৳)', 'বোনাস / ভাতা (৳)', 'কর্তন / অগ্রিম (৳)', 'নিট বেতন (৳)', 'অবস্থা', 'পরিশোধ তারিখ', 'মাধ্যম', 'ভাউচার ও নোট'],
    colWidths: [65, 95, 170, 145, 120, 120, 120, 125, 105, 115, 110, 220],
    numericCols: [0, 4, 5, 6, 7],
    tabColor: { red: 0.71, green: 0.33, blue: 0.04 }
  },
  {
    key: 'inventory',
    title: 'ইনভেন্টরি স্টক',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — মালামাল ও হার্ডওয়্যার স্টক রেজিস্টার',
    headers: ['ক্রমিক', 'পণ্যের নাম', 'ক্যাটাগরি', 'একক', 'বর্তমান স্টক', 'ন্যূনতম সতর্কতা', 'একক মূল্য (৳)', 'মোট স্টক মূল্য (৳)', 'সরবরাহকারী', 'অবস্থান ও নোট'],
    colWidths: [65, 190, 140, 85, 110, 115, 120, 135, 160, 230],
    numericCols: [0, 4, 5, 6, 7],
    tabColor: { red: 0.01, green: 0.41, blue: 0.63 }
  },
  {
    key: 'inventory_logs',
    title: 'ইনভেন্টরি লগ',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — মালামাল গ্রহণ ও বিতরণের বিস্তারিত লগ',
    headers: ['ক্রমিক', 'তারিখ', 'পণ্যের নাম', 'ধরন', 'পরিমাণ', 'প্রতি একক দর (৳)', 'মোট মূল্য (৳)', 'প্রাপক / উৎস', 'খরচে যুক্ত?', 'নোট'],
    colWidths: [65, 110, 185, 110, 95, 120, 125, 170, 105, 240],
    numericCols: [0, 4, 5, 6],
    tabColor: { red: 0.05, green: 0.45, blue: 0.56 }
  },
  {
    key: 'owners',
    title: 'মালিকানা হিসাব',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — দ্রুত হিসাব ও শেয়ার অংশীদার তালিকা',
    headers: ['ক্রমিক', 'অংশীদারের নাম', 'শেয়ার ইউনিট', 'হাফ শেয়ার?', 'মোবাইল', 'ঠিকানা', 'মন্তব্য / নোট', 'হালনাগাদ'],
    colWidths: [65, 185, 110, 105, 125, 200, 260, 160],
    numericCols: [0, 2],
    tabColor: { red: 0.75, green: 0.07, blue: 0.24 }
  },
  {
    key: 'users',
    title: 'ব্যবহারকারী',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — নিবন্ধিত ব্যবহারকারী ও অ্যাডমিন অ্যাকাউন্ট',
    headers: ['ক্রমিক', 'নাম', 'মোবাইল', 'জিমেইল', 'ভূমিকা (Role)', 'অবস্থা', 'বাইন্ডিং মাধ্যম', 'ভার্চুয়াল কার্ড নং', 'তৈরির তারিখ'],
    colWidths: [65, 175, 125, 200, 115, 95, 140, 165, 160],
    numericCols: [0],
    tabColor: { red: 0.20, green: 0.25, blue: 0.33 }
  },
  {
    key: 'config_ads',
    title: 'চ্যানেল ও ব্যানার',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — পেমেন্ট চ্যানেল, অফার ব্যানার ও অ্যাপ সেবা সেটিংস',
    headers: ['বিভাগ', 'আইডি', 'নাম / শিরোনাম', 'উপ-শিরোনাম / বিবরণ', 'অবস্থা / ব্যাজ', 'লিঙ্ক / আইকন', 'ক্রম'],
    colWidths: [130, 130, 200, 280, 140, 220, 80],
    numericCols: [6],
    tabColor: { red: 0.76, green: 0.25, blue: 0.05 }
  },
  {
    key: 'notices_audit',
    title: 'নোটিশ ও অডিট লগ',
    bannerText: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক — ব্রডকাস্ট নোটিশ ও অ্যাডমিন অডিট হিস্ট্রি',
    headers: ['বিভাগ', 'তারিখ ও সময়', 'শিরোনাম / অ্যাকশন', 'ধরন / ব্যবহারকারী', 'বিস্তারিত বিবরণ', 'আইডি'],
    colWidths: [120, 165, 210, 140, 340, 140],
    numericCols: [],
    tabColor: { red: 0.27, green: 0.25, blue: 0.24 }
  }
];

let cachedArchiveId: string | null = null;
let isSyncing = false;
let needsAnotherPass = false;
let hasPendingOfflineOrAuthSync = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let listenerInitialized = false;
let userGetterRef: (() => any) | null = null;

function sanitizeCell(val: unknown): string | number {
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : 0;
  }
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.startsWith('data:image/')) return '[ছবি সংযুক্ত]';
  if (str.length > 45000) return `${str.slice(0, 45000)}...`;
  return str;
}

function toNumber(val: unknown): number {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
}

function formatBdTime(input?: string | number | null): string {
  try {
    const dt = input ? new Date(input) : new Date();
    if (Number.isNaN(dt.getTime())) return String(input || '');
    return dt.toLocaleString('en-GB', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return String(input || '');
  }
}

function buildFormattingRequests(tabSpec: TabSpec, sheetId: number): any[] {
  const colCount = tabSpec.headers.length;
  const maxRows = 2500;
  const requests: any[] = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          tabColor: tabSpec.tabColor,
          gridProperties: {
            rowCount: maxRows,
            columnCount: Math.max(colCount + 2, 12),
            frozenRowCount: 2
          }
        },
        fields: 'tabColor,gridProperties.rowCount,gridProperties.columnCount,gridProperties.frozenRowCount'
      }
    },
    {
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: colCount
        },
        mergeType: 'MERGE_ALL'
      }
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: colCount
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: tabSpec.tabColor,
            horizontalAlignment: 'LEFT',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              fontSize: 12,
              bold: true
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)'
      }
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 2,
          startColumnIndex: 0,
          endColumnIndex: colCount
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.12, green: 0.16, blue: 0.23 },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
            textFormat: {
              foregroundColor: { red: 1, green: 1, blue: 1 },
              fontSize: 10,
              bold: true
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)'
      }
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 2,
          endRowIndex: maxRows,
          startColumnIndex: 0,
          endColumnIndex: colCount
        },
        cell: {
          userEnteredFormat: {
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
            textFormat: {
              fontSize: 10
            }
          }
        },
        fields: 'userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 0,
          endIndex: 1
        },
        properties: { pixelSize: 40 },
        fields: 'pixelSize'
      }
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: 1,
          endIndex: 2
        },
        properties: { pixelSize: 34 },
        fields: 'pixelSize'
      }
    },
    {
      addBanding: {
        bandedRange: {
          range: {
            sheetId,
            startRowIndex: 2,
            endRowIndex: maxRows,
            startColumnIndex: 0,
            endColumnIndex: colCount
          },
          rowProperties: {
            firstBandColor: { red: 1, green: 1, blue: 1 },
            secondBandColor: { red: 0.97, green: 0.98, blue: 0.99 }
          }
        }
      }
    },
    {
      updateBorders: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: 500,
          startColumnIndex: 0,
          endColumnIndex: colCount
        },
        top: { style: 'SOLID', width: 1, color: { red: 0.89, green: 0.91, blue: 0.94 } },
        bottom: { style: 'SOLID', width: 1, color: { red: 0.89, green: 0.91, blue: 0.94 } },
        left: { style: 'SOLID', width: 1, color: { red: 0.89, green: 0.91, blue: 0.94 } },
        right: { style: 'SOLID', width: 1, color: { red: 0.89, green: 0.91, blue: 0.94 } },
        innerHorizontal: { style: 'SOLID', width: 1, color: { red: 0.91, green: 0.93, blue: 0.96 } },
        innerVertical: { style: 'SOLID', width: 1, color: { red: 0.91, green: 0.93, blue: 0.96 } }
      }
    }
  ];

  tabSpec.colWidths.forEach((width, idx) => {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: idx,
          endIndex: idx + 1
        },
        properties: { pixelSize: width },
        fields: 'pixelSize'
      }
    });
  });

  tabSpec.numericCols.forEach((colIdx) => {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 2,
          endRowIndex: maxRows,
          startColumnIndex: colIdx,
          endColumnIndex: colIdx + 1
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: 'RIGHT',
            numberFormat: {
              type: 'NUMBER',
              pattern: colIdx === 0 ? '#,##0' : '#,##0.##'
            }
          }
        },
        fields: 'userEnteredFormat(horizontalAlignment,numberFormat)'
      }
    });
  });

  return requests;
}

async function persistArchiveId(spreadsheetId: string): Promise<void> {
  cachedArchiveId = spreadsheetId;
  try {
    safeStorage.setItem(ARCHIVE_STORAGE_KEY, spreadsheetId);
  } catch {}
  try {
    await setDoc(doc(db, 'settings', ARCHIVE_META_DOC_ID), {
      id: ARCHIVE_META_DOC_ID,
      archiveId: spreadsheetId,
      updatedAt: new Date().toISOString()
    });
  } catch {}
}

async function verifySpreadsheetAccess(
  accessToken: string,
  spreadsheetId: string
): Promise<Map<string, number> | null> {
  try {
    const res = await fetch(
      `${SHEETS_API_BASE}/${spreadsheetId}?fields=spreadsheetId,sheets.properties(sheetId,title)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const sheetMap = new Map<string, number>();
    (data.sheets || []).forEach((s: any) => {
      if (s?.properties?.title && typeof s.properties.sheetId === 'number') {
        sheetMap.set(s.properties.title, s.properties.sheetId);
      }
    });
    return sheetMap;
  } catch {
    return null;
  }
}

async function findExistingArchiveInDrive(accessToken: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(
      `name = '${ARCHIVE_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&orderBy=modifiedTime desc&pageSize=5`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data.files) && data.files.length > 0) {
      return data.files[0].id || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function ensureMasterArchive(accessToken: string): Promise<string | null> {
  const candidateIds: string[] = [];
  if (cachedArchiveId) candidateIds.push(cachedArchiveId);

  const storedId = safeStorage.getItem(ARCHIVE_STORAGE_KEY);
  if (storedId && !candidateIds.includes(storedId)) candidateIds.push(storedId);

  try {
    const metaSnap = await getDoc(doc(db, 'settings', ARCHIVE_META_DOC_ID));
    const cloudId = metaSnap.exists() ? metaSnap.data()?.archiveId : null;
    if (cloudId && typeof cloudId === 'string' && !candidateIds.includes(cloudId)) {
      candidateIds.push(cloudId);
    }
  } catch {}

  let activeId: string | null = null;
  let existingTabs = new Map<string, number>();

  for (const id of candidateIds) {
    const verified = await verifySpreadsheetAccess(accessToken, id);
    if (verified) {
      activeId = id;
      existingTabs = verified;
      break;
    }
  }

  if (!activeId) {
    const driveFoundId = await findExistingArchiveInDrive(accessToken);
    if (driveFoundId) {
      const verified = await verifySpreadsheetAccess(accessToken, driveFoundId);
      if (verified) {
        activeId = driveFoundId;
        existingTabs = verified;
        await persistArchiveId(activeId);
      }
    }
  }

  if (!activeId) {
    // Create a brand new, multi-page organized archive in Google Workspace
    const createPayload = {
      properties: {
        title: ARCHIVE_TITLE,
        locale: 'bn_BD',
        timeZone: 'Asia/Dhaka'
      },
      sheets: TAB_SPECS.map((spec, index) => ({
        properties: {
          sheetId: 1000 + index,
          title: spec.title,
          tabColor: spec.tabColor,
          gridProperties: {
            rowCount: 2500,
            columnCount: Math.max(spec.headers.length + 2, 12),
            frozenRowCount: 2
          }
        }
      }))
    };

    const createRes = await fetch(SHEETS_API_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createPayload)
    });

    if (!createRes.ok) return null;
    const created = await createRes.json();
    activeId = created.spreadsheetId;
    if (!activeId) return null;

    const createdTabMap = new Map<string, number>();
    (created.sheets || []).forEach((s: any) => {
      if (s?.properties?.title && typeof s.properties.sheetId === 'number') {
        createdTabMap.set(s.properties.title, s.properties.sheetId);
      }
    });

    const formatRequests: any[] = [];
    TAB_SPECS.forEach((spec) => {
      const sid = createdTabMap.get(spec.title);
      if (sid !== undefined) {
        formatRequests.push(...buildFormattingRequests(spec, sid));
      }
    });

    if (formatRequests.length > 0) {
      await fetch(`${SHEETS_API_BASE}/${activeId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests: formatRequests })
      }).catch(() => {});
    }

    // Place cleanly inside Admin_Backups folder in Google Drive
    try {
      const folderId = await getOrCreateBackupFolder(accessToken);
      if (folderId) {
        await fetch(
          `https://www.googleapis.com/drive/v3/files/${activeId}?addParents=${encodeURIComponent(folderId)}&fields=id`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
      }
    } catch {}

    await persistArchiveId(activeId);
    return activeId;
  }

  // Ensure any missing tabs on an existing spreadsheet are added and formatted cleanly
  const missingSpecs = TAB_SPECS.filter(spec => !existingTabs.has(spec.title));
  if (missingSpecs.length > 0) {
    const addRequests = missingSpecs.map((spec, idx) => ({
      addSheet: {
        properties: {
          sheetId: Math.floor(Date.now() % 1000000) + idx + 50,
          title: spec.title,
          tabColor: spec.tabColor,
          gridProperties: {
            rowCount: 2500,
            columnCount: Math.max(spec.headers.length + 2, 12),
            frozenRowCount: 2
          }
        }
      }
    }));

    const addRes = await fetch(`${SHEETS_API_BASE}/${activeId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests: addRequests })
    });

    if (addRes.ok) {
      const addData = await addRes.json();
      const formatMissingReqs: any[] = [];
      (addData.replies || []).forEach((reply: any) => {
        const addedProps = reply?.addSheet?.properties;
        if (addedProps?.title && typeof addedProps.sheetId === 'number') {
          const matchedSpec = missingSpecs.find(s => s.title === addedProps.title);
          if (matchedSpec) {
            formatMissingReqs.push(...buildFormattingRequests(matchedSpec, addedProps.sheetId));
          }
        }
      });

      if (formatMissingReqs.length > 0) {
        await fetch(`${SHEETS_API_BASE}/${activeId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests: formatMissingReqs })
        }).catch(() => {});
      }
    }
  }

  await persistArchiveId(activeId);
  return activeId;
}

function buildArchiveTabsPayload(masterData: any): { range: string; values: (string | number)[][] }[] {
  const fs = masterData?.firestore || {};
  const settings = masterData?.settings || {};
  const nowStr = formatBdTime(new Date().toISOString());

  const mainTxns: any[] = Array.isArray(fs.transactions) ? [...fs.transactions] : [];
  const ayTxns: any[] = Array.isArray(fs.ay_byay_transactions) ? [...fs.ay_byay_transactions] : [];
  const staffList: any[] = Array.isArray(fs.staff) ? [...fs.staff] : [];
  const salariesList: any[] = Array.isArray(fs.ay_byay_salaries) ? [...fs.ay_byay_salaries] : [];
  const invItems: any[] = Array.isArray(fs.ay_byay_inventory) ? [...fs.ay_byay_inventory] : [];
  const invLogs: any[] = Array.isArray(fs.ay_byay_inventory_logs) ? [...fs.ay_byay_inventory_logs] : [];
  const ownersList: any[] = Array.isArray(fs.quick_hisab_owners) ? [...fs.quick_hisab_owners] : [];
  const usersList: any[] = Array.isArray(fs.users) ? [...fs.users] : [];
  const bannersList: any[] = Array.isArray(fs.banners) ? [...fs.banners] : [];
  const channelsList: any[] = Array.isArray(fs.channels) ? [...fs.channels] : [];

  // Sort collections newest-first cleanly
  mainTxns.sort((a, b) => (toNumber(b.created) || 0) - (toNumber(a.created) || 0) || String(b.date || '').localeCompare(String(a.date || '')));
  ayTxns.sort((a, b) => String(b.createdAt || b.date || '').localeCompare(String(a.createdAt || a.date || '')));
  salariesList.sort((a, b) => String(b.month || '').localeCompare(String(a.month || '')) || String(b.paymentDate || '').localeCompare(String(a.paymentDate || '')));
  invLogs.sort((a, b) => String(b.createdAt || b.date || '').localeCompare(String(a.createdAt || a.date || '')));

  // Compute summary metrics
  const activeMainTxns = mainTxns.filter(t => !t.isDeleted);
  const mainIncome = activeMainTxns.filter(t => t.type === 'income').reduce((s, t) => s + toNumber(t.amount), 0);
  const mainExpense = activeMainTxns.filter(t => t.type === 'expense').reduce((s, t) => s + toNumber(t.amount), 0);

  const activeAyTxns = ayTxns.filter(t => !t.isDeleted);
  const ayIncome = activeAyTxns.filter(t => t.type === 'income').reduce((s, t) => s + toNumber(t.amount), 0);
  const ayExpense = activeAyTxns.filter(t => t.type === 'expense').reduce((s, t) => s + toNumber(t.amount), 0);

  const totalStaffDue = staffList.reduce((s, st) => s + toNumber(st.remainingDue), 0);
  const totalPaidSalary = salariesList.filter(s => s.paymentStatus === 'paid').reduce((s, sal) => s + toNumber(sal.netSalary), 0);
  const totalInvValue = invItems.reduce((s, item) => s + toNumber(item.currentStock) * toNumber(item.unitCost), 0);
  const totalShareUnits = ownersList.reduce((s, o) => s + toNumber(o.shareUnits), 0);

  const staffTxnRows: any[] = [];
  staffList.forEach(st => {
    const txs = Array.isArray(st.transactions) ? st.transactions : [];
    txs.forEach((tx: any) => {
      staffTxnRows.push({
        ...tx,
        staffName: st.name || '',
        staffPhone: st.phone || ''
      });
    });
  });
  staffTxnRows.sort((a, b) => (toNumber(b.created) || 0) - (toNumber(a.created) || 0) || String(b.date || '').localeCompare(String(a.date || '')));

  // 1. Dashboard Summary Rows
  const dashboardRows: (string | number)[][] = [
    ['সর্বশেষ অটো-আপডেট', 'ক্লাউড আর্কাইভ হালনাগাদের সময়', nowStr, 'স্বয়ংক্রিয়ভাবে সিংক করা'],
    ['মূল পোর্টাল — মোট আয়', 'সচল সকল আয় লেনদেনের যোগফল', mainIncome, `মোট সচল লেনদেন: ${activeMainTxns.length} টি`],
    ['মূল পোর্টাল — মোট ব্যয়', 'সচল সকল ব্যয় লেনদেনের যোগফল', mainExpense, `রিসাইকেল বিনে: ${mainTxns.length - activeMainTxns.length} টি`],
    ['মূল পোর্টাল — নিট ব্যালেন্স', 'মোট আয় বিয়োগ মোট ব্যয়', mainIncome - mainExpense, 'বর্তমান স্থিতি (টাকা)'],
    ['আয়-ব্যয় হিসাব — মোট আয়', 'আয়-ব্যয় পোর্টালের সকল আয়', ayIncome, `মোট এন্ট্রি: ${activeAyTxns.length} টি`],
    ['আয়-ব্যয় হিসাব — মোট ব্যয়', 'আয়-ব্যয় পোর্টালের সকল ব্যয়', ayExpense, 'আয়-ব্যয় পোর্টাল'],
    ['আয়-ব্যয় হিসাব — নিট ব্যালেন্স', 'আয়-ব্যয় নিট ফলাফল', ayIncome - ayExpense, 'বর্তমান স্থিতি (টাকা)'],
    ['স্টাফ ও কোম্পানি বকেয়া', 'নিবন্ধিত মোট স্টাফ', staffList.length, `মোট অবশিষ্ট পাওনা: ${totalStaffDue.toLocaleString('en-US')} টাকা`],
    ['স্টাফ কালেকশন লগ', 'সকল স্টাফ পাওনা ও জমা লেনদেন', staffTxnRows.length, 'বিস্তারিত স্টাফ লেনদেন পেজে'],
    ['বেতন খাতা', 'পরিশোধিত মোট বেতন (টাকা)', totalPaidSalary, `মোট বেতন রেকর্ড: ${salariesList.length} টি`],
    ['ইনভেন্টরি ও স্টক', 'মোট মালামাল আইটেম সংখ্যা', invItems.length, `মোট স্টক মূল্য: ${totalInvValue.toLocaleString('en-US')} টাকা`],
    ['ইনভেন্টরি মুভমেন্ট লগ', 'স্টক ইন/আউট রেকর্ড সংখ্যা', invLogs.length, 'বিস্তারিত ইনভেন্টরি লগ পেজে'],
    ['মালিকানা / দ্রুত হিসাব', 'মোট অংশীদার সংখ্যা', ownersList.length, `মোট শেয়ার ইউনিট: ${totalShareUnits}`],
    ['ব্যবহারকারী অ্যাকাউন্ট', 'মোট নিবন্ধিত অ্যাকাউন্ট', usersList.length, `সক্রিয়: ${usersList.filter(u => u.status !== 'suspended').length} জন`]
  ];

  // 2. Main Transactions
  const mainTxnRows: (string | number)[][] = mainTxns.map((t, idx) => [
    idx + 1,
    sanitizeCell(t.date || ''),
    sanitizeCell(t.time || ''),
    t.type === 'income' ? 'আয়' : 'ব্যয়',
    toNumber(t.amount),
    sanitizeCell(t.method || t.paymentMethod || ''),
    sanitizeCell(t.bankName || ''),
    sanitizeCell(t.person || ''),
    sanitizeCell(t.phone || ''),
    sanitizeCell(t.category || ''),
    sanitizeCell(t.note || t.description || ''),
    t.isDeleted ? 'রিসাইকেল বিন' : 'সচল'
  ]);

  // 3. Ay-Byay Transactions
  const ayByayRows: (string | number)[][] = ayTxns.map((t, idx) => [
    idx + 1,
    sanitizeCell(t.date || ''),
    sanitizeCell(t.time || ''),
    t.type === 'income' ? 'আয়' : 'ব্যয়',
    toNumber(t.amount),
    sanitizeCell(t.paymentMethod || t.method || ''),
    sanitizeCell(t.bankName || ''),
    sanitizeCell(t.person || ''),
    sanitizeCell(t.phone || ''),
    sanitizeCell(t.category || t.purpose || ''),
    sanitizeCell(t.note || t.description || ''),
    sanitizeCell(t.recordedByGmail || t.recordedBy || 'Admin')
  ]);

  // 4. Staff Accounts
  const staffRows: (string | number)[][] = staffList.map((st, idx) => [
    idx + 1,
    sanitizeCell(st.name || ''),
    sanitizeCell(st.designation || st.role || ''),
    sanitizeCell(st.phone || ''),
    sanitizeCell(st.userCode || ''),
    toNumber(st.baseSalary),
    toNumber(st.totalDue),
    toNumber(st.totalCollected),
    toNumber(st.remainingDue),
    sanitizeCell(st.address || ''),
    st.isActive === false ? 'নিষ্ক্রিয়' : 'সক্রিয়'
  ]);

  // 5. Staff Ledger Transactions
  const staffLedgerRows: (string | number)[][] = staffTxnRows.map((tx, idx) => [
    idx + 1,
    sanitizeCell(tx.date || ''),
    sanitizeCell(tx.time || ''),
    sanitizeCell(tx.staffName || ''),
    sanitizeCell(tx.staffPhone || ''),
    tx.type === 'collection' ? 'কালেকশন জমা' : 'কোম্পানি পাওনা',
    toNumber(tx.amount),
    sanitizeCell(tx.userName || ''),
    sanitizeCell(tx.customerName || ''),
    sanitizeCell(tx.customerAddress || ''),
    sanitizeCell([tx.reference, tx.note].filter(Boolean).join(' — '))
  ]);

  // 6. Staff Salaries
  const salaryRows: (string | number)[][] = salariesList.map((sal, idx) => [
    idx + 1,
    sanitizeCell(sal.month || ''),
    sanitizeCell(sal.staffName || ''),
    sanitizeCell(sal.staffDesignation || ''),
    toNumber(sal.baseSalary),
    toNumber(sal.bonusOrAllowance),
    toNumber(sal.deductionOrAdvance),
    toNumber(sal.netSalary),
    sal.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া',
    sanitizeCell(sal.paymentDate || ''),
    sanitizeCell(sal.paymentMethod || ''),
    sanitizeCell([sal.voucherNumber ? `ভাউচার: ${sal.voucherNumber}` : '', sal.note].filter(Boolean).join(' | '))
  ]);

  // 7. Inventory Items
  const inventoryRows: (string | number)[][] = invItems.map((item, idx) => {
    const stock = toNumber(item.currentStock);
    const cost = toNumber(item.unitCost);
    return [
      idx + 1,
      sanitizeCell(item.name || ''),
      sanitizeCell(item.category || ''),
      sanitizeCell(item.unit || ''),
      stock,
      toNumber(item.minStockAlert),
      cost,
      stock * cost,
      sanitizeCell(item.supplier || ''),
      sanitizeCell([item.location, item.notes].filter(Boolean).join(' — '))
    ];
  });

  // 8. Inventory Logs
  const invLogRows: (string | number)[][] = invLogs.map((log, idx) => {
    const typeLabel =
      log.type === 'in'
        ? 'স্টক ইন'
        : log.type === 'out'
        ? 'স্টক আউট'
        : log.type === 'return'
        ? 'রিটার্ন'
        : 'নষ্ট / ক্ষতি';
    return [
      idx + 1,
      sanitizeCell(log.date || ''),
      sanitizeCell(log.itemName || log.itemId || ''),
      typeLabel,
      toNumber(log.quantity),
      toNumber(log.costPerUnit),
      toNumber(log.totalCost),
      sanitizeCell(log.recipientOrSource || ''),
      log.addToExpense || log.addedToExpense ? 'হ্যাঁ' : 'না',
      sanitizeCell(log.note || '')
    ];
  });

  // 9. Quick Hisab Owners
  const ownerRows: (string | number)[][] = ownersList.map((o, idx) => [
    idx + 1,
    sanitizeCell(o.name || ''),
    toNumber(o.shareUnits),
    o.isHalf ? 'হ্যাঁ (০.৫)' : 'পূর্ণ শেয়ার',
    sanitizeCell(o.phone || ''),
    sanitizeCell(o.address || ''),
    sanitizeCell(o.notes || ''),
    formatBdTime(o.updatedAt || o.createdAt || '')
  ]);

  // 10. Users
  const userRows: (string | number)[][] = usersList.map((u, idx) => {
    const roleLabel =
      u.role === 'admin'
        ? 'অ্যাডমিন'
        : u.role === 'sub-admin'
        ? 'সাব-অ্যাডমিন'
        : u.role === 'visitor'
        ? 'ভিজিটর'
        : 'সদস্য';
    const methods = Array.isArray(u.boundMethods) ? u.boundMethods.join(', ') : (u.gmail ? 'phone, gmail' : 'phone');
    return [
      idx + 1,
      sanitizeCell(u.name || ''),
      sanitizeCell(u.phone || ''),
      sanitizeCell(u.gmail || ''),
      roleLabel,
      u.status === 'suspended' ? 'স্থগিত' : 'সক্রিয়',
      sanitizeCell(methods),
      sanitizeCell(u.virtualCardNumber || ''),
      formatBdTime(u.createdAt || '')
    ];
  });

  // 11. Config, Channels & Banners
  const configRows: (string | number)[][] = [];
  channelsList.forEach((ch, idx) => {
    configRows.push([
      'পেমেন্ট চ্যানেল',
      sanitizeCell(ch.id || ''),
      sanitizeCell(`${ch.labelBn || ch.name || ''} (${ch.labelEn || ''})`),
      sanitizeCell(ch.name || ''),
      ch.isDefault ? 'ডিফল্ট' : 'কাস্টম',
      sanitizeCell(ch.imageUrl && !String(ch.imageUrl).startsWith('data:') ? ch.imageUrl : (ch.icon || '')),
      toNumber(ch.order ?? idx + 1)
    ]);
  });
  bannersList.forEach((b, idx) => {
    configRows.push([
      'অফার ব্যানার',
      sanitizeCell(b.id || ''),
      sanitizeCell(b.titleBn || b.titleEn || ''),
      sanitizeCell(b.subtitleBn || b.subtitleEn || ''),
      `${b.isActive ? 'সক্রিয়' : 'বন্ধ'}${b.badgeBn ? ` (${b.badgeBn})` : ''}`,
      sanitizeCell(b.linkUrl || ''),
      toNumber(b.priority ?? idx + 1)
    ]);
  });
  const serviceStatuses = settings.service_control?.statuses || {};
  Object.entries(serviceStatuses).forEach(([k, val]: [string, any], idx) => {
    configRows.push([
      'অ্যাপ সেবা',
      k,
      sanitizeCell(val?.title || k),
      sanitizeCell(val?.customMessage || 'স্বাভাবিক কার্যক্রম চলমান'),
      val?.isActive !== false ? 'চালু' : 'বন্ধ',
      '',
      idx + 1
    ]);
  });
  if (settings.footer_config?.config) {
    const fc = settings.footer_config.config;
    ['store', 'offer', 'help'].forEach((fk, idx) => {
      const item = fc[fk];
      if (item) {
        configRows.push([
          'ফুটার লিংক',
          fk,
          sanitizeCell(item.bn || item.en || ''),
          sanitizeCell(item.en || ''),
          'সক্রিয়',
          sanitizeCell(item.url || ''),
          idx + 1
        ]);
      }
    });
  }

  // 12. Notices & Audit Logs
  const noticeAuditRows: (string | number)[][] = [];
  const notifsList = Array.isArray(settings.broadcast_notifications?.list) ? settings.broadcast_notifications.list : [];
  notifsList.forEach((n: any) => {
    noticeAuditRows.push([
      'নোটিফিকেশন',
      sanitizeCell([n.date, n.timeBn || n.timeEn].filter(Boolean).join(' ')),
      sanitizeCell(n.titleBn || n.titleEn || ''),
      sanitizeCell(n.type || 'info'),
      sanitizeCell(n.bodyBn || n.messageBn || n.bodyEn || ''),
      sanitizeCell(n.id || '')
    ]);
  });
  const auditList = Array.isArray(settings.audit_logs?.list) ? settings.audit_logs.list : [];
  auditList.forEach((log: any) => {
    noticeAuditRows.push([
      'অডিট লগ',
      formatBdTime(log.time),
      sanitizeCell(log.actionBn || log.action || ''),
      sanitizeCell(log.user || 'Admin'),
      sanitizeCell(log.details || ''),
      sanitizeCell(log.id || '')
    ]);
  });

  const rowsByTabKey: Record<string, (string | number)[][]> = {
    dashboard: dashboardRows,
    main_txns: mainTxnRows,
    ay_byay_txns: ayByayRows,
    staff: staffRows,
    staff_ledger: staffLedgerRows,
    salaries: salaryRows,
    inventory: inventoryRows,
    inventory_logs: invLogRows,
    owners: ownerRows,
    users: userRows,
    config_ads: configRows,
    notices_audit: noticeAuditRows
  };

  return TAB_SPECS.map((spec) => {
    const rows = rowsByTabKey[spec.key] || [];
    const titleBannerRow: (string | number)[] = [
      `${spec.bannerText}   |   হালনাগাদ: ${nowStr}`
    ];
    const headerRow: (string | number)[] = spec.headers;
    const safeRows = rows.length > 0 ? rows : [['এই বিভাগে এখনো কোনো ডেটা নেই']];
    return {
      range: `'${spec.title}'!A1`,
      values: [titleBannerRow, headerRow, ...safeRows]
    };
  });
}

export async function syncMasterDataToCloudArchive(masterData: any): Promise<boolean> {
  try {
    if (safeStorage.getItem('protyasha_offline_mode') === 'true') {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }

    const accessToken = getDriveAccessToken();
    if (!accessToken) {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }

    if (isSyncing) {
      needsAnotherPass = true;
      return false;
    }

    isSyncing = true;
    hasPendingOfflineOrAuthSync = false;

    const spreadsheetId = await ensureMasterArchive(accessToken);
    if (!spreadsheetId) {
      isSyncing = false;
      return false;
    }

    // Clear previous values across all organized tabs while preserving formatting
    const clearRes = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values:batchClear`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ranges: TAB_SPECS.map(spec => `'${spec.title}'!A:Z`)
      })
    });

    if (!clearRes.ok) {
      isSyncing = false;
      return false;
    }

    const dataBatches = buildArchiveTabsPayload(masterData);

    const updateRes = await fetch(`${SHEETS_API_BASE}/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: dataBatches
      })
    });

    isSyncing = false;

    if (needsAnotherPass) {
      needsAnotherPass = false;
      scheduleSilentCloudArchiveSync();
    }

    return updateRes.ok;
  } catch {
    isSyncing = false;
    return false;
  }
}

export async function triggerSilentCloudArchiveSync(currentUser?: any): Promise<boolean> {
  try {
    const token = getDriveAccessToken();
    if (!token) {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }
    if (safeStorage.getItem('protyasha_offline_mode') === 'true') {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      hasPendingOfflineOrAuthSync = true;
      return false;
    }
    const effectiveUser = currentUser ?? (userGetterRef ? userGetterRef() : undefined);
    const masterData = await collectMasterBackupData(effectiveUser);
    return await syncMasterDataToCloudArchive(masterData);
  } catch {
    return false;
  }
}

export function scheduleSilentCloudArchiveSync(delayMs = 2500): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    triggerSilentCloudArchiveSync().catch(() => {});
  }, delayMs);
}

export function initSilentCloudArchiveListener(getCurrentUser?: () => any): () => void {
  if (getCurrentUser) {
    userGetterRef = getCurrentUser;
  }
  if (listenerInitialized || typeof window === 'undefined') {
    return () => {};
  }
  listenerInitialized = true;

  const onMutation = (e: Event) => {
    const customEvent = e as CustomEvent<{ path?: string | null }>;
    const path = customEvent?.detail?.path || '';
    if (
      path.includes(ARCHIVE_META_DOC_ID) ||
      path.includes('connection_test') ||
      path.endsWith('_meta')
    ) {
      return;
    }
    scheduleSilentCloudArchiveSync(2500);
  };

  const onGoogleConnected = () => {
    scheduleSilentCloudArchiveSync(600);
  };

  const onOnline = () => {
    if (hasPendingOfflineOrAuthSync) {
      scheduleSilentCloudArchiveSync(1500);
    }
  };

  window.addEventListener('protyasha-cloud-mutation', onMutation);
  window.addEventListener('protyasha-google-connected', onGoogleConnected);
  window.addEventListener('online', onOnline);

  return () => {
    listenerInitialized = false;
    window.removeEventListener('protyasha-cloud-mutation', onMutation);
    window.removeEventListener('protyasha-google-connected', onGoogleConnected);
    window.removeEventListener('online', onOnline);
  };
}
