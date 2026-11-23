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

export function hasSubAdminPermission(
  user: UserSession | null | undefined,
  key: SubAdminPermissionKey
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') return key === 'staffAttendance';
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

export function isTransactionOwner(trx: Transaction, user?: UserSession | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;

  const recBy = (trx.recordedBy || '').trim();
  const recGmail = (trx.recordedByGmail || '').trim().toLowerCase();

  if (user.id && recBy && recBy === user.id) return true;
  if (user.phone && recBy && recBy === user.phone.trim()) return true;
  if (user.gmail && recGmail && recGmail === user.gmail.trim().toLowerCase()) return true;

  return false;
}

export interface TransactionModificationCheck {
  allowed: boolean;
  isOwner: boolean;
  expired: boolean;
  remainingMs: number;
}

export function canModifyTransaction(
  trx: Transaction,
  user?: UserSession | null,
  now: number = Date.now()
): TransactionModificationCheck {
  if (!user) {
    return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  if (user.role === 'admin') {
    return { allowed: true, isOwner: true, expired: false, remainingMs: Number.POSITIVE_INFINITY };
  }

  if (user.role === 'sub-admin') {
    if (!hasSubAdminPermission(user, 'addTransactions')) {
      return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
    }
    const isOwner = isTransactionOwner(trx, user);
    if (!isOwner) {
      return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
    }

    const createdMs = typeof trx.created === 'number' && !isNaN(trx.created) ? trx.created : 0;
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

  return { allowed: false, isOwner: false, expired: false, remainingMs: 0 };
}

export function isSupportTicketOwner(
  ticket: SupportTicket,
  user?: UserSession | null,
  staffSession?: StaffSupportSession | null
): boolean {
  if (user?.role === 'admin') return true;

  const actorIds = [user?.id, staffSession?.staffId]
    .map((v) => (v || '').trim())
    .filter(Boolean);
  const actorPhones = [user?.phone, staffSession?.phone]
    .map((v) => normalizePhoneNumber(v))
    .filter((v) => v.length >= 6);
  const actorNames = [user?.name, staffSession?.name]
    .map((v) => (v || '').trim().toLowerCase())
    .filter(Boolean);

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
  const canActAsStaffSession = Boolean(staffSession) && user?.role !== 'staff';

  if (!canActAsSubAdmin && !canActAsStaffSession) {
    return { allowed: false, isAdmin: false, isOwner: false, expired: false, remainingMs: 0 };
  }

  const isOwner = isSupportTicketOwner(ticket, user, staffSession);
  const createdMs = ticket.createdAt ? new Date(ticket.createdAt).getTime() : 0;
  if (!createdMs || isNaN(createdMs)) {
    return { allowed: false, isAdmin: false, isOwner, expired: true, remainingMs: 0 };
  }

  const elapsed = Math.max(0, now - createdMs);
  const remainingMs = Math.max(0, SUPPORT_TICKET_EDIT_WINDOW_MS - elapsed);
  const withinWindow = elapsed <= SUPPORT_TICKET_EDIT_WINDOW_MS;

  // Non-admins (permitted sub-admins or staff session) can only edit/delete their own complaint within 10 minutes of creation.
  // Regular users, attendance-only staff, and visitors are strictly read-only.
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

