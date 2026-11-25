import {
  StaffAttendanceRecord,
  StaffSupportSession,
  SubAdminPermissionKey,
  SupportTicket,
  Transaction,
  UserSession
} from '../types';
import { toBengaliNumber } from './formatters';

export const SUB_ADMIN_EDIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
export const SUPPORT_TICKET_EDIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const STAFF_ATTENDANCE_EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function isMainAdmin(user?: UserSession | null): boolean {
  return user?.role === 'admin';
}

export function isSubAdmin(user?: UserSession | null): boolean {
  return user?.role === 'sub-admin';
}

export function isStaffRole(user?: UserSession | null): boolean {
  return user?.role === 'staff';
}

export function isStaffSessionActive(user?: UserSession | null): boolean {
  if (!user) return false;
  if (user.role === 'staff') return true;
  try {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('protyasha_support_staff_session') !== null) return true;
      const rawUser = localStorage.getItem('protyasha_user') || sessionStorage.getItem('protyasha_user');
      if (rawUser && rawUser.includes('"role":"staff"')) return true;
    }
  } catch {}
  return false;
}

export function hasSubAdminPermission(
  user: UserSession | null | undefined,
  key: SubAdminPermissionKey
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') return true;
  if (user.role === 'sub-admin') {
    if (!user.permissions || Object.keys(user.permissions).length === 0) {
      return true; // Backward-compatible default for legacy sub-admin accounts without explicit permissions
    }
    return user.permissions[key] === true;
  }
  return false;
}

export function canAddTransactions(user?: UserSession | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'sub-admin') return hasSubAdminPermission(user, 'addTransactions');
  return false;
}

export function isLoggedInSession(user?: UserSession | null): boolean {
  return (
    !!user &&
    (user.role === 'admin' ||
      user.role === 'sub-admin' ||
      user.role === 'staff' ||
      user.role === 'user')
  );
}

export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const digits = String(phone).replace(/[^\d]/g, '');
  if (digits.startsWith('880') && digits.length >= 13) {
    return digits.slice(2);
  }
  return digits;
}

const STRONG_GENERIC_ACTORS = new Set([
  'admin',
  'admin-primary',
  'admin-master',
  'system',
  'system-bill-sync',
  'পে-রোল সিস্টেম',
  'অ্যাডমিন',
  'staff',
  'অজানা'
]);

export function getActorStamp(user?: UserSession | null): string {
  if (!user) return '';
  return (user.id || normalizePhoneNumber(user.phone) || user.phone || user.gmail || '').trim();
}

export interface OwnedRecordLike {
  recordedBy?: string | null;
  recordedByGmail?: string | null;
  createdById?: string | null;
  createdByPhone?: string | null;
  senderId?: string | null;
  created?: number | null;
  createdAt?: string | null;
}

export function isRecordOwner(record: OwnedRecordLike | null | undefined, user?: UserSession | null): boolean {
  if (!record || !user) return false;
  if (user.role === 'admin') return true;

  const userId = (user.id || '').trim();
  const userPhoneRaw = (user.phone || '').trim();
  const userPhoneNorm = normalizePhoneNumber(user.phone);
  const userGmail = (user.gmail || '').trim().toLowerCase();

  const recGmail = (record.recordedByGmail || '').trim().toLowerCase();
  if (userGmail && recGmail && recGmail === userGmail) return true;

  const candidateValues = [record.recordedBy, record.createdById, record.createdByPhone, record.senderId];
  for (const raw of candidateValues) {
    const val = (raw || '').trim();
    if (!val || STRONG_GENERIC_ACTORS.has(val.toLowerCase())) continue;
    if (userId && val === userId) return true;
    if (userPhoneRaw && val === userPhoneRaw) return true;
    const valPhoneNorm = normalizePhoneNumber(val);
    if (userPhoneNorm.length >= 10 && valPhoneNorm.length >= 10 && valPhoneNorm === userPhoneNorm) {
      return true;
    }
  }

  return false;
}

export function isTransactionOwner(trx: Transaction, user?: UserSession | null): boolean {
  return isRecordOwner(trx, user);
}

export interface TransactionModificationCheck {
  allowed: boolean;
  isOwner: boolean;
  expired: boolean;
  remainingMs: number;
}

export function canModifyOwnedRecord(
  record: OwnedRecordLike | null | undefined,
  user?: UserSession | null,
  permKey?: SubAdminPermissionKey,
  now: number = Date.now()
): TransactionModificationCheck {
  if (!user || !record) {
    return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  if (user.role === 'admin') {
    return { allowed: true, isOwner: true, expired: false, remainingMs: Number.POSITIVE_INFINITY };
  }

  if (user.role !== 'sub-admin') {
    return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  if (permKey && !hasSubAdminPermission(user, permKey)) {
    return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  const isOwner = isRecordOwner(record, user);
  if (!isOwner) {
    return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  let createdMs = 0;
  if (typeof record.created === 'number' && !isNaN(record.created) && record.created > 0) {
    createdMs = record.created;
  } else if (record.createdAt) {
    const parsed = new Date(record.createdAt).getTime();
    if (!isNaN(parsed) && parsed > 0) {
      createdMs = parsed;
    }
  }

  if (createdMs <= 0) {
    return { allowed: false, isOwner: true, expired: true, remainingMs: 0 };
  }

  const elapsed = Math.max(0, now - createdMs);
  const remainingMs = Math.max(0, SUB_ADMIN_EDIT_WINDOW_MS - elapsed);
  const allowed = elapsed <= SUB_ADMIN_EDIT_WINDOW_MS;

  return {
    allowed,
    isOwner: true,
    expired: !allowed,
    remainingMs
  };
}

export function canModifyTransaction(
  trx: Transaction,
  user?: UserSession | null,
  now: number = Date.now()
): TransactionModificationCheck {
  return canModifyOwnedRecord(trx, user, 'addTransactions', now);
}

export function isSupportTicketOwner(
  ticket: SupportTicket,
  user?: UserSession | null,
  staffSession?: StaffSupportSession | null
): boolean {
  if (user?.role === 'admin') return true;

  const actorIds = [user?.id, staffSession?.staffId]
    .map((v) => (v || '').trim())
    .filter((v) => v && !STRONG_GENERIC_ACTORS.has(v.toLowerCase()));
  const actorPhones = [user?.phone, staffSession?.phone]
    .map((v) => normalizePhoneNumber(v))
    .filter((v) => v.length >= 6);
  const actorNames = [user?.name, staffSession?.name]
    .map((v) => (v || '').trim().toLowerCase())
    .filter((v) => v && !STRONG_GENERIC_ACTORS.has(v));

  if (ticket.createdById && actorIds.includes(ticket.createdById.trim())) {
    return true;
  }

  const ticketCreatorPhone = normalizePhoneNumber(ticket.createdByPhone);
  if (ticketCreatorPhone && actorPhones.includes(ticketCreatorPhone)) {
    return true;
  }

  // Fallback for legacy tickets created before createdById/createdByPhone existed
  if (!ticket.createdById && !ticket.createdByPhone) {
    const customerPhone = normalizePhoneNumber(ticket.customerPhone);
    if (customerPhone && actorPhones.includes(customerPhone)) {
      return true;
    }
    const creatorName = (ticket.createdBy || '').trim().toLowerCase();
    if (creatorName && actorNames.includes(creatorName)) {
      return true;
    }
  }

  return false;
}

export interface SupportTicketModificationCheck {
  allowed: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  expired: boolean;
  remainingMs: number;
}

export function canModifySupportTicket(
  ticket: SupportTicket,
  user?: UserSession | null,
  staffSession?: StaffSupportSession | null,
  now: number = Date.now()
): SupportTicketModificationCheck {
  if (user?.role === 'admin') {
    return {
      allowed: true,
      isAdmin: true,
      isOwner: true,
      expired: false,
      remainingMs: Number.POSITIVE_INFINITY
    };
  }

  const canActAsSubAdmin = user?.role === 'sub-admin' && hasSubAdminPermission(user, 'supportTickets');
  const canActAsStaffSession =
    Boolean(staffSession) && user?.role !== 'staff' && user?.role !== 'sub-admin';

  if (!canActAsSubAdmin && !canActAsStaffSession) {
    return { allowed: false, isAdmin: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  const isOwner = isSupportTicketOwner(ticket, user, canActAsSubAdmin ? null : staffSession);
  const createdMs = ticket.createdAt ? new Date(ticket.createdAt).getTime() : 0;
  if (!createdMs || isNaN(createdMs)) {
    return { allowed: false, isAdmin: false, isOwner, expired: true, remainingMs: 0 };
  }

  const editWindowMs = canActAsSubAdmin ? SUB_ADMIN_EDIT_WINDOW_MS : SUPPORT_TICKET_EDIT_WINDOW_MS;
  const elapsed = Math.max(0, now - createdMs);
  const remainingMs = Math.max(0, editWindowMs - elapsed);
  const withinWindow = elapsed <= editWindowMs;

  // Permitted sub-admins can edit/delete/permanently remove their own complaint within 30 minutes of creation.
  // Staff support session can edit/delete their own complaint within 10 minutes of creation.
  return {
    allowed: isOwner && withinWindow,
    isAdmin: false,
    isOwner,
    expired: !withinWindow,
    remainingMs
  };
}

export function formatRemainingCountdown(remainingMs: number, isBn: boolean): string {
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return isBn ? toBengaliNumber(formatted) : formatted;
}

export interface StaffAttendanceLockState {
  hasRecord: boolean;
  locked: boolean;
  remainingMs: number;
  submittedAtMs: number;
}

export function getStaffAttendanceLockState(
  record?: StaffAttendanceRecord | null,
  isAdmin: boolean = false,
  now: number = Date.now()
): StaffAttendanceLockState {
  if (!record) {
    return {
      hasRecord: false,
      locked: false,
      remainingMs: STAFF_ATTENDANCE_EDIT_WINDOW_MS,
      submittedAtMs: 0
    };
  }

  if (isAdmin) {
    return {
      hasRecord: true,
      locked: false,
      remainingMs: Number.POSITIVE_INFINITY,
      submittedAtMs: 0
    };
  }

  const rawTs = record.createdAt || record.updatedAt;
  const submittedAtMs = rawTs ? new Date(rawTs).getTime() : 0;
  if (!submittedAtMs || isNaN(submittedAtMs)) {
    return { hasRecord: true, locked: true, remainingMs: 0, submittedAtMs: 0 };
  }

  const elapsed = Math.max(0, now - submittedAtMs);
  const remainingMs = Math.max(0, STAFF_ATTENDANCE_EDIT_WINDOW_MS - elapsed);

  return {
    hasRecord: true,
    locked: elapsed > STAFF_ATTENDANCE_EDIT_WINDOW_MS,
    remainingMs,
    submittedAtMs
  };
}

