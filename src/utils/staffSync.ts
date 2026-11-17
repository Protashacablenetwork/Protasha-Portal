import { collection, doc, getDocs } from 'firebase/firestore';
import { AppUser, StaffAccount, StaffSupportSession, UserSession } from '../types';
import { db, staffDb, safeSetDoc, safeDeleteDoc, handleFirestoreError, OperationType } from './firebase';
import { safeStorage } from './safeStorage';
import { normalizePhoneNumber } from './permissions';

const toSafeNumber = (val: unknown, fallback = 0): number => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

export function sanitizeStaffId(rawId?: string): string {
  const cleaned = String(rawId || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 128);
  return cleaned || `staff-${Date.now()}`;
}

/**
 * Guarantees every staff document written from any part of the app conforms strictly
 * to the Firestore `isValidStaff` security rule schema and avoids silent write failures.
 */
export function sanitizeStaffForFirestore(
  input: Partial<StaffAccount> & { designation?: string; updatedAt?: string }
): StaffAccount & { updatedAt: string; designation?: string } {
  const nowIso = new Date().toISOString();
  const id = sanitizeStaffId(input.id);
  const name = String(input.name || 'স্টাফ').trim().slice(0, 150) || 'স্টাফ';
  const phone = String(input.phone || '').trim().slice(0, 32);
  const role = String(input.role || input.designation || 'লাইন টেকনিশিয়ান').trim().slice(0, 150);
  const totalDue = toSafeNumber(input.totalDue, 0);
  const totalCollected = toSafeNumber(input.totalCollected, 0);
  const remainingDue =
    input.remainingDue !== undefined ? toSafeNumber(input.remainingDue, 0) : totalDue - totalCollected;
  const transactions = Array.isArray(input.transactions) ? input.transactions.slice(0, 500) : [];

  const sanitized: StaffAccount & { updatedAt: string; designation?: string } = {
    id,
    name,
    phone,
    role,
    userCode: String(input.userCode || '').trim().slice(0, 64),
    address: String(input.address || '').trim().slice(0, 300),
    reference: String(input.reference || '').trim().slice(0, 200),
    avatarUrl:
      typeof input.avatarUrl === 'string' && input.avatarUrl.length <= 900000
        ? input.avatarUrl
        : '',
    totalDue,
    totalCollected,
    remainingDue,
    notes: String(input.notes || '').trim().slice(0, 2000),
    createdAt: String(input.createdAt || nowIso).slice(0, 64),
    updatedAt: String(input.updatedAt || nowIso).slice(0, 64),
    baseSalary: toSafeNumber(input.baseSalary, 0),
    isActive: input.isActive !== false,
    recordedBy: input.recordedBy ? String(input.recordedBy).slice(0, 128) : '',
    transactions
  };

  if (input.designation && typeof input.designation === 'string') {
    sanitized.designation = input.designation.trim().slice(0, 150);
  }

  return sanitized;
}

export function readCachedStaffAccounts(): StaffAccount[] {
  try {
    const raw = safeStorage.getItem('protyasha_staff');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function broadcastStaffAccounts(list: StaffAccount[]) {
  try {
    safeStorage.setItem('protyasha_staff', JSON.stringify(list));
  } catch {}
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('staff-data-changed', { detail: list }));
    }
  } catch {}
}

/**
 * Deduplicates and merges a single staff account into the unified directory,
 * writes it to Firestore `staff/{id}`, and broadcasts immediately across the whole app.
 */
export async function upsertSingleStaffToCloud(
  staffInput: Partial<StaffAccount> & { designation?: string; updatedAt?: string },
  currentList?: StaffAccount[]
): Promise<{ staff: StaffAccount; updatedList: StaffAccount[] }> {
  const sanitized = sanitizeStaffForFirestore(staffInput);
  const nowIso = new Date().toISOString();

  await safeSetDoc(doc(staffDb, 'staff', sanitized.id), sanitized).catch((err) => {
    handleFirestoreError(err, OperationType.WRITE, `staff/${sanitized.id}`);
  });
  await safeSetDoc(doc(db, 'settings', 'staff_meta'), {
    initialized: true,
    updatedAt: nowIso
  }).catch(() => {});

  const baseList = Array.isArray(currentList) ? currentList : readCachedStaffAccounts();
  const existsIdx = baseList.findIndex((s) => String(s.id) === String(sanitized.id));
  const updatedList =
    existsIdx !== -1
      ? baseList.map((s, idx) => (idx === existsIdx ? sanitized : s))
      : [sanitized, ...baseList];

  broadcastStaffAccounts(updatedList);
  return { staff: sanitized, updatedList };
}

export async function deleteSingleStaffFromCloud(
  staffId: string,
  currentList?: StaffAccount[]
): Promise<StaffAccount[]> {
  const cleanId = String(staffId);
  const nowIso = new Date().toISOString();

  await safeDeleteDoc(doc(staffDb, 'staff', cleanId)).catch((err) => {
    handleFirestoreError(err, OperationType.DELETE, `staff/${cleanId}`);
  });
  await safeSetDoc(doc(db, 'settings', 'staff_meta'), {
    initialized: true,
    updatedAt: nowIso
  }).catch(() => {});

  const baseList = Array.isArray(currentList) ? currentList : readCachedStaffAccounts();
  const updatedList = baseList.filter((s) => String(s.id) !== cleanId);
  broadcastStaffAccounts(updatedList);
  return updatedList;
}

/**
 * Automatically mirrors a `sub-admin` (staff) account created/updated in User Management
 * into the unified Firestore `staff` directory so it appears immediately across Staff Accounts,
 * Staff Attendance, Support Tickets, and Ay-Byay Payroll without duplicates.
 */
export async function syncSubAdminUserToStaffDirectory(appUser: AppUser): Promise<void> {
  if (!appUser || appUser.role !== 'sub-admin') return;

  let existingStaffList = readCachedStaffAccounts();
  try {
    const snap = await getDocs(collection(staffDb, 'staff'));
    const cloudRows: StaffAccount[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as StaffAccount;
      if (data && (data.id || docSnap.id) && data.name) {
        cloudRows.push({ ...data, id: String(data.id || docSnap.id) });
      }
    });
    if (cloudRows.length > 0) {
      existingStaffList = cloudRows;
    }
  } catch {}

  const userPhoneNorm = normalizePhoneNumber(appUser.phone);
  const existingMatch = existingStaffList.find((s) => {
    if (String(s.id) === String(appUser.id)) return true;
    const sPhoneNorm = normalizePhoneNumber(s.phone);
    return userPhoneNorm.length >= 6 && sPhoneNorm === userPhoneNorm;
  });

  if (existingMatch) {
    await upsertSingleStaffToCloud(
      {
        ...existingMatch,
        name: appUser.name || existingMatch.name,
        phone: appUser.phone || existingMatch.phone,
        avatarUrl: appUser.avatarUrl || existingMatch.avatarUrl || '',
        isActive: appUser.status !== 'suspended',
        updatedAt: new Date().toISOString()
      },
      existingStaffList
    );
  } else {
    await upsertSingleStaffToCloud(
      {
        id: sanitizeStaffId(appUser.id),
        name: appUser.name,
        phone: appUser.phone || '',
        role: 'সাব-এডমিন / স্টাফ',
        avatarUrl: appUser.avatarUrl || '',
        baseSalary: 0,
        totalDue: 0,
        totalCollected: 0,
        remainingDue: 0,
        isActive: appUser.status !== 'suspended',
        recordedBy: appUser.recordedBy || 'admin',
        createdAt: appUser.createdAt || new Date().toISOString(),
        transactions: []
      },
      existingStaffList
    );
  }
}

/**
 * Matches a main-page logged-in user session against the unified active Staff Directory
 * by ID, normalized phone, userCode, or exact name so staff never need a second PIN anywhere.
 */
export function findMatchedStaffForUser(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): StaffAccount | null {
  if (!user || user.role === 'visitor') return null;
  const activeStaff = (staffAccounts || []).filter((s) => s && s.isActive !== false);
  if (activeStaff.length === 0) return null;

  const uId = String(user.id || '').trim();
  const uPhoneNorm = normalizePhoneNumber(user.phone);
  const uRawPhone = String(user.phone || '').trim().toLowerCase();
  const uName = String(user.name || '').trim().toLowerCase();

  return (
    (uId ? activeStaff.find((s) => String(s.id) === uId) : undefined) ||
    (uPhoneNorm.length >= 6
      ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === uPhoneNorm)
      : undefined) ||
    (uRawPhone
      ? activeStaff.find(
          (s) =>
            String(s.userCode || '').trim().toLowerCase() === uRawPhone ||
            String(s.phone || '').trim().toLowerCase() === uRawPhone
        )
      : undefined) ||
    (uName ? activeStaff.find((s) => String(s.name || '').trim().toLowerCase() === uName) : undefined) ||
    null
  );
}

/**
 * True whenever the current main-page user is an Admin, Sub-Admin, or matched active Staff member.
 */
export function isStaffOrAdminUser(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): boolean {
  if (!user || user.role === 'visitor') return false;
  if (user.role === 'admin' || user.role === 'sub-admin') return true;
  return Boolean(findMatchedStaffForUser(user, staffAccounts));
}

/**
 * Keeps the legacy `protyasha_support_staff_session` storage key synchronized automatically
 * with the main-page login so no sub-page ever prompts a logged-in staff member for a PIN again.
 */
export function syncMainLoginStaffSession(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): void {
  try {
    if (!user || user.role === 'visitor' || user.role === 'admin') {
      sessionStorage.removeItem('protyasha_support_staff_session');
      return;
    }
    const matched = findMatchedStaffForUser(user, staffAccounts);
    if (matched) {
      const sessionObj: StaffSupportSession = {
        staffId: matched.id,
        name: matched.name,
        phone: matched.phone || user.phone || '',
        roleTitle: matched.role || 'স্টাফ',
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(sessionObj));
    } else if (user.role === 'sub-admin') {
      const sessionObj: StaffSupportSession = {
        staffId: user.id || user.phone || 'sub-admin',
        name: user.name || 'স্টাফ',
        phone: user.phone || '',
        roleTitle: 'সাব-এডমিন / স্টাফ',
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(sessionObj));
    }
  } catch {}
}

