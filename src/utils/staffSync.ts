import { AppUser, StaffAccount, StaffSupportSession, UserSession } from '../types';
import { loadFirebase, loadFirestore, reportCloudError, CloudOperationType } from './cloudBridge';
import { safeStorage } from './safeStorage';
import { normalizePhoneNumber } from './permissions';
import { isActualStaffAccount } from './ownerDueSync';

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

  const [{ db, staffDb, safeSetDoc }, { doc }] = await Promise.all([loadFirebase(), loadFirestore()]);

  await safeSetDoc(doc(staffDb, 'staff', sanitized.id), sanitized).catch((err) => {
    void reportCloudError(err, CloudOperationType.WRITE, `staff/${sanitized.id}`);
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

  const [{ db, staffDb, safeDeleteDoc, safeSetDoc }, { doc }] = await Promise.all([loadFirebase(), loadFirestore()]);

  await safeDeleteDoc(doc(staffDb, 'staff', cleanId)).catch((err) => {
    void reportCloudError(err, CloudOperationType.DELETE, `staff/${cleanId}`);
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
 * Automatically mirrors a `sub-admin` or `staff` account created/updated in User Management
 * into the unified Firestore `staff` directory so it appears immediately across Staff Accounts,
 * Staff Attendance, Support Tickets, and Ay-Byay Payroll without duplicates.
 */
export async function syncStaffOrSubAdminUserToDirectory(appUser: AppUser): Promise<void> {
  if (!appUser || (appUser.role !== 'sub-admin' && appUser.role !== 'staff')) return;

  let existingStaffList = readCachedStaffAccounts();
  try {
    const [{ staffDb }, { collection, getDocs }] = await Promise.all([loadFirebase(), loadFirestore()]);
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
        role: appUser.role === 'staff' ? 'স্টাফ' : 'সাব-এডমিন / স্টাফ',
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

export const syncSubAdminUserToStaffDirectory = syncStaffOrSubAdminUserToDirectory;

/**
 * Matches a main-page logged-in `staff` or `sub-admin` session against the unified active Staff Directory.
 * Strictly ignores regular `user` and `visitor` accounts so regular users can never auto-match staff privileges.
 */
export function findMatchedStaffForUser(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): StaffAccount | null {
  if (!user || (user.role !== 'staff' && user.role !== 'sub-admin')) return null;
  const activeStaff = (staffAccounts || []).filter(isActualStaffAccount);
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
 * True whenever the current main-page user is an Admin, Sub-Admin, or Staff account.
 */
export function isStaffOrAdminUser(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): boolean {
  if (!user || user.role === 'visitor' || user.role === 'user') return false;
  if (user.role === 'admin' || user.role === 'sub-admin' || user.role === 'staff') return true;
  return Boolean(findMatchedStaffForUser(user, staffAccounts));
}

/**
 * Keeps `protyasha_support_staff_session` synchronized with `staff` / `sub-admin` main-page logins
 * and clears it for `admin`, `user`, and `visitor` accounts.
 */
export function syncMainLoginStaffSession(
  user: UserSession | null | undefined,
  staffAccounts: StaffAccount[]
): void {
  try {
    if (!user || user.role === 'visitor' || user.role === 'admin' || user.role === 'user') {
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
    } else if (user.role === 'sub-admin' || user.role === 'staff') {
      const sessionObj: StaffSupportSession = {
        staffId: user.id || user.phone || user.role,
        name: user.name || 'স্টাফ',
        phone: user.phone || '',
        roleTitle: user.role === 'staff' ? 'স্টাফ' : 'সাব-এডমিন / স্টাফ',
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(sessionObj));
    }
  } catch {}
}

/**
 * Synchronizes a staff member's PIN across both `settings/staff_support_auth.staffPins`
 * and matching `users` documents (`role === 'staff'`) so Staff Attendance PINs and
 * Main Login credentials stay 100% unified.
 */
export async function syncStaffPinEverywhere(params: {
  staffId?: string;
  phone?: string;
  newPin: string;
}): Promise<void> {
  const cleanPin = String(params.newPin || '').trim();
  if (!/^\d{4,8}$/.test(cleanPin)) {
    throw new Error('পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে');
  }

  const nowIso = new Date().toISOString();
  const targetId = String(params.staffId || '').trim();
  const targetPhoneNorm = normalizePhoneNumber(params.phone);

  const [{ db, safeSetDoc }, { collection, doc, getDoc, getDocs }] = await Promise.all([
    loadFirebase(),
    loadFirestore()
  ]);

  // 1. Update `settings/staff_support_auth`
  try {
    const authRef = doc(db, 'settings', 'staff_support_auth');
    const authSnap = await getDoc(authRef);
    const authData = authSnap.exists() ? (authSnap.data() as { globalPin?: string; staffPins?: Record<string, string> }) : {};
    const existingGlobalPin = String(authData.globalPin || '1234').trim() || '1234';
    const nextPins: Record<string, string> = { ...(authData.staffPins || {}) };

    if (targetId) {
      nextPins[targetId] = cleanPin;
    }

    await safeSetDoc(authRef, {
      globalPin: existingGlobalPin,
      staffPins: nextPins,
      updatedAt: nowIso
    });
  } catch (err) {
    void reportCloudError(err, CloudOperationType.WRITE, 'settings/staff_support_auth');
  }

  // 2. Sync matching `users` docs where `role === 'staff'`
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const updates: Promise<void>[] = [];
    usersSnap.forEach((docSnap) => {
      const u = docSnap.data() as AppUser;
      if (!u || u.role !== 'staff') return;
      const uId = String(u.id || docSnap.id).trim();
      const uPhoneNorm = normalizePhoneNumber(u.phone);
      const idMatch = Boolean(targetId && (uId === targetId || docSnap.id === targetId));
      const phoneMatch = Boolean(targetPhoneNorm.length >= 6 && uPhoneNorm === targetPhoneNorm);
      if (idMatch || phoneMatch) {
        const nextDoc: AppUser = {
          ...u,
          id: u.id || docSnap.id,
          pin: cleanPin,
          updatedAt: nowIso
        };
        updates.push(
          safeSetDoc(doc(db, 'users', docSnap.id), nextDoc).catch((err) => {
            void reportCloudError(err, CloudOperationType.WRITE, `users/${docSnap.id}`);
          })
        );
      }
    });
    if (updates.length > 0) {
      await Promise.all(updates);
    }
  } catch {}

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('staff-pin-updated', { detail: { staffId: targetId, phone: params.phone } }));
    }
  } catch {}
}


