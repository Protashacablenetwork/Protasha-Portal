import { Transaction, UserSession } from '../types';

export const SUB_ADMIN_EDIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export function isMainAdmin(user?: UserSession | null): boolean {
  return user?.role === 'admin';
}

export function isSubAdmin(user?: UserSession | null): boolean {
  return user?.role === 'sub-admin';
}

export function canAddTransactions(user?: UserSession | null): boolean {
  return user?.role === 'admin' || user?.role === 'sub-admin';
}

export function isLoggedInSession(user?: UserSession | null): boolean {
  return !!user && (user.role === 'admin' || user.role === 'sub-admin' || user.role === 'user');
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
