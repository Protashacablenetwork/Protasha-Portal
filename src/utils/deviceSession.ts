import {
  doc,
  getDocFromServer,
  onSnapshot,
  runTransaction,
  setDoc,
  collection,
  query,
  where
} from 'firebase/firestore';
import { enableNetwork } from 'firebase/firestore';
import { db } from './firebase';
import { safeStorage } from './safeStorage';
import { UserRole, UserSession } from '../types';

const DEVICE_ID_KEY = 'protyasha_device_id';
const SESSION_TOKEN_KEY = 'protyasha_session_token';
const VERIFIED_ACCOUNT_KEY = 'protyasha_verified_session_key';
const PENDING_VERIFY_KEY = 'protyasha_pending_session_verify';

export interface DeviceSessionRecord {
  accountKey: string;
  userId: string;
  phone: string;
  role: UserRole;
  name: string;
  deviceId: string;
  deviceLabel: string;
  sessionToken: string;
  isActive: boolean;
  forcedLogout?: boolean;
  loginAt: number;
  lastActiveAt: number;
  updatedAt: string;
}

const STALE_SESSION_MS = 3 * 60 * 1000; // 3 minutes without heartbeat = previous device is no longer active

export interface ClaimSessionResult {
  allowed: boolean;
  reason?: 'already_active_other_device' | 'offline_unverified' | 'error';
  activeDeviceLabel?: string;
  loginAt?: number;
  canForceTakeover?: boolean;
  messageBn?: string;
  messageEn?: string;
  sessionToken?: string;
  accountKey?: string;
}

/**
 * Persistent unique ID per browser/device installation.
 * Same browser shares this ID across tabs; any other phone/browser/incognito gets a different ID.
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server-device';
  let existing = safeStorage.getItem(DEVICE_ID_KEY);
  if (!existing) {
    try {
      existing = window.localStorage?.getItem(DEVICE_ID_KEY) || null;
    } catch {}
  }
  if (existing && /^[a-zA-Z0-9_\-]+$/.test(existing)) {
    return existing;
  }

  const created = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  safeStorage.setItem(DEVICE_ID_KEY, created);
  return created;
}

/**
 * Human-readable short device & browser label for lock conflict messages and admin view.
 */
export function getDeviceLabel(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent || '';

  let os = 'Device';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone/i.test(ua)) os = 'iPhone';
  else if (/iPad/i.test(ua)) os = 'iPad';
  else if (/Windows/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'Mac';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Browser';
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox';
  else if (/Safari/i.test(ua)) browser = 'Safari';

  return `${os} • ${browser}`;
}

export function getSessionAccountKey(params: {
  id?: string;
  phone?: string;
  role?: UserRole;
}): string {
  const rawPhone = (params.phone || '').trim().replace(/[^0-9a-zA-Z]/g, '');
  if (rawPhone) {
    return `phone_${rawPhone}`;
  }
  const rawId = (params.id || 'unknown').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  return `id_${rawId || 'unknown'}`;
}

export function getSessionDocId(accountKey: string): string {
  const safeKey = accountKey.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 96);
  return `active_session_${safeKey}`;
}

function generateSessionToken(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
}

function isOfflineNetworkError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err || '').toLowerCase();
  const code = (err as any)?.code;
  return (
    code === 'unavailable' ||
    msg.includes('offline') ||
    msg.includes('network') ||
    msg.includes('failed to get document') ||
    msg.includes('client is offline')
  );
}

/**
 * Atomically claims the single-device session lock for an account.
 * Rejects login if another device already holds an active session for the same account.
 */
export async function claimDeviceSession(params: {
  id?: string;
  phone: string;
  role: UserRole;
  name: string;
  forceTakeover?: boolean;
}): Promise<ClaimSessionResult> {
  if (params.role === 'visitor') {
    return { allowed: true };
  }

  const myDeviceId = getDeviceId();
  const deviceLabel = getDeviceLabel();
  const accountKey = getSessionAccountKey(params);
  const docId = getSessionDocId(accountKey);
  const sessionRef = doc(db, 'settings', docId);
  const sessionToken = generateSessionToken();

  // If browser is online, make sure Firestore network isn't paused from a prior offline toggle
  if (typeof navigator === 'undefined' || navigator.onLine !== false) {
    try {
      await enableNetwork(db);
    } catch {}
  }

  try {
    const txResult = await runTransaction(db, async (tx) => {
      const snap = await tx.get(sessionRef);
      const nowMs = Date.now();
      const nowIso = new Date(nowMs).toISOString();

      if (snap.exists() && !params.forceTakeover) {
        const existing = snap.data() as Partial<DeviceSessionRecord>;
        const lastSeenMs = Number(existing.lastActiveAt || existing.loginAt || 0);
        const isStillAlive = lastSeenMs > 0 && (nowMs - lastSeenMs) <= STALE_SESSION_MS;

        if (
          existing.isActive === true &&
          existing.deviceId &&
          existing.deviceId !== myDeviceId &&
          isStillAlive
        ) {
          return {
            allowed: false,
            activeDeviceLabel: existing.deviceLabel || 'অন্য ডিভাইস',
            loginAt: existing.loginAt
          };
        }
      }

      const payload: DeviceSessionRecord = {
        accountKey,
        userId: params.id || accountKey,
        phone: params.phone,
        role: params.role,
        name: params.name || '',
        deviceId: myDeviceId,
        deviceLabel,
        sessionToken,
        isActive: true,
        forcedLogout: false,
        loginAt: nowMs,
        lastActiveAt: nowMs,
        updatedAt: nowIso
      };

      tx.set(sessionRef, payload);
      return { allowed: true };
    });

    if (!txResult.allowed) {
      const devName = txResult.activeDeviceLabel || 'অন্য ডিভাইস';
      const canForce = params.role === 'admin';
      return {
        allowed: false,
        reason: 'already_active_other_device',
        activeDeviceLabel: devName,
        loginAt: txResult.loginAt,
        canForceTakeover: canForce,
        messageBn: canForce
          ? `এই অ্যাডমিন আইডি অন্য একটি ডিভাইসে (${devName}) এই মুহূর্তে চালু আছে। নিচের বাটনে চাপ দিয়ে আগের ডিভাইস লগআউট করে এখানে লগইন করতে পারবেন।`
          : `এই লগইন আইডি ইতিমধ্যে অন্য একটি ডিভাইসে (${devName}) চালু আছে। একসাথে শুধুমাত্র ১টি ডিভাইসে লগইন করা যাবে। আগের ডিভাইস থেকে লগআউট করে আবার চেষ্টা করুন।`,
        messageEn: canForce
          ? `This admin account is currently active on another device (${devName}). Tap below to sign out that device and log in here.`
          : `This account is already logged in on another device (${devName}). Only 1 device is allowed at a time. Please log out from the previous device first.`
      };
    }

    safeStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
    safeStorage.setItem(VERIFIED_ACCOUNT_KEY, accountKey);
    safeStorage.removeItem(PENDING_VERIFY_KEY);

    return {
      allowed: true,
      sessionToken,
      accountKey
    };
  } catch (err) {
    console.warn('[DeviceSession] Transaction claim failed:', err);

    if (isOfflineNetworkError(err)) {
      const isOfflineModeOn = safeStorage.getItem('protyasha_offline_mode') === 'true';
      const lastVerifiedKey = safeStorage.getItem(VERIFIED_ACCOUNT_KEY);
      if (isOfflineModeOn && lastVerifiedKey === accountKey) {
        safeStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
        safeStorage.setItem(PENDING_VERIFY_KEY, 'true');
        return { allowed: true, sessionToken, accountKey };
      }

      return {
        allowed: false,
        reason: 'offline_unverified',
        messageBn: 'এক-ডিভাইস লগইন যাচাইয়ের জন্য ইন্টারনেট সংযোগ প্রয়োজন। দয়া করে ইন্টারনেট চালু করে চেষ্টা করুন।',
        messageEn: 'Internet connection is required to verify single-device login. Please connect and retry.'
      };
    }

    return {
      allowed: false,
      reason: 'error',
      messageBn: 'ডিভাইস সেশন যাচাই করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      messageEn: 'Could not verify device session. Please try again.'
    };
  }
}

/**
 * Releases the active device lock ONLY if the current device owns it.
 */
export async function releaseDeviceSession(user: UserSession | null): Promise<void> {
  if (!user || user.role === 'visitor') return;

  const myDeviceId = getDeviceId();
  const accountKey = getSessionAccountKey({
    id: user.id,
    phone: user.phone,
    role: user.role
  });
  const docId = getSessionDocId(accountKey);
  const sessionRef = doc(db, 'settings', docId);

  safeStorage.removeItem(SESSION_TOKEN_KEY);
  safeStorage.removeItem(VERIFIED_ACCOUNT_KEY);
  safeStorage.removeItem(PENDING_VERIFY_KEY);

  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists()) return;
      const existing = snap.data() as Partial<DeviceSessionRecord>;
      if (existing.deviceId === myDeviceId || !existing.deviceId) {
        tx.set(sessionRef, {
          accountKey,
          userId: user.id || accountKey,
          phone: user.phone || '',
          role: user.role,
          name: user.name || '',
          deviceId: '',
          deviceLabel: '',
          sessionToken: '',
          isActive: false,
          forcedLogout: false,
          loginAt: existing.loginAt || Date.now(),
          lastActiveAt: Date.now(),
          updatedAt: new Date().toISOString()
        });
      }
    });
  } catch (err) {
    console.warn('[DeviceSession] Release notice:', err);
  }
}

/**
 * Admin action: remotely unlocks/forces logout of a user's active device session.
 */
export async function adminForceReleaseSession(params: {
  id?: string;
  phone?: string;
  role?: UserRole;
  name?: string;
}): Promise<void> {
  const accountKey = getSessionAccountKey(params);
  const docId = getSessionDocId(accountKey);
  const sessionRef = doc(db, 'settings', docId);
  const nowMs = Date.now();

  await setDoc(sessionRef, {
    accountKey,
    userId: params.id || accountKey,
    phone: params.phone || '',
    role: params.role || 'user',
    name: params.name || '',
    deviceId: '',
    deviceLabel: '',
    sessionToken: '',
    isActive: false,
    forcedLogout: true,
    loginAt: nowMs,
    lastActiveAt: nowMs,
    updatedAt: new Date(nowMs).toISOString()
  });
}

/**
 * Updates heartbeat timestamp if this device owns the session.
 */
export async function sendSessionHeartbeat(user: UserSession | null): Promise<void> {
  if (!user || user.role === 'visitor') return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  if (safeStorage.getItem('protyasha_offline_mode') === 'true') return;

  const myDeviceId = getDeviceId();
  const accountKey = getSessionAccountKey({
    id: user.id,
    phone: user.phone,
    role: user.role
  });
  const docId = getSessionDocId(accountKey);
  const sessionRef = doc(db, 'settings', docId);

  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists()) return;
      const existing = snap.data() as Partial<DeviceSessionRecord>;
      if (existing.isActive === true && existing.deviceId === myDeviceId) {
        const nowMs = Date.now();
        tx.set(
          sessionRef,
          {
            lastActiveAt: nowMs,
            deviceLabel: getDeviceLabel(),
            updatedAt: new Date(nowMs).toISOString()
          },
          { merge: true }
        );
      }
    });
  } catch {}
}

/**
 * Verifies or claims active session on app boot / reconnect, and watches real-time
 * lock changes so a device is immediately signed out if unlocked or owned by another device.
 */
export function startDeviceSessionGuard(
  user: UserSession,
  onInvalidated: (reason: 'other_device' | 'forced_logout', otherDeviceLabel?: string) => void
): () => void {
  if (!user || user.role === 'visitor') {
    return () => {};
  }

  const myDeviceId = getDeviceId();
  const accountKey = getSessionAccountKey({
    id: user.id,
    phone: user.phone,
    role: user.role
  });
  const docId = getSessionDocId(accountKey);
  const sessionRef = doc(db, 'settings', docId);
  let unsubscribed = false;
  let invalidated = false;

  const triggerInvalidate = (reason: 'other_device' | 'forced_logout', otherLabel?: string) => {
    if (unsubscribed || invalidated) return;
    invalidated = true;
    safeStorage.removeItem(SESSION_TOKEN_KEY);
    safeStorage.removeItem(VERIFIED_ACCOUNT_KEY);
    safeStorage.removeItem(PENDING_VERIFY_KEY);
    onInvalidated(reason, otherLabel);
  };

  // Initial server check (handles legacy sessions & offline-pending logins upon reconnect)
  const verifyOnServer = async () => {
    if (safeStorage.getItem('protyasha_offline_mode') === 'true') return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;

    try {
      const serverSnap = await getDocFromServer(sessionRef);
      if (unsubscribed || invalidated) return;

      if (!serverSnap.exists()) {
        // Legacy session before single-device lock existed -> claim for this device
        const claimed = await claimDeviceSession({
          id: user.id,
          phone: user.phone,
          role: user.role,
          name: user.name
        });
        if (!claimed.allowed && claimed.reason === 'already_active_other_device') {
          triggerInvalidate('other_device', claimed.activeDeviceLabel);
        }
        return;
      }

      const data = serverSnap.data() as Partial<DeviceSessionRecord>;
      if (data.isActive === true && data.deviceId && data.deviceId !== myDeviceId) {
        triggerInvalidate('other_device', data.deviceLabel);
        return;
      }

      if (data.isActive === false && data.forcedLogout === true) {
        triggerInvalidate('forced_logout');
        return;
      }

      if (data.isActive === false) {
        const wasPending = safeStorage.getItem(PENDING_VERIFY_KEY) === 'true';
        if (wasPending) {
          const claimed = await claimDeviceSession({
            id: user.id,
            phone: user.phone,
            role: user.role,
            name: user.name
          });
          if (!claimed.allowed && claimed.reason === 'already_active_other_device') {
            triggerInvalidate('other_device', claimed.activeDeviceLabel);
          }
        } else {
          // Session was released elsewhere/previously
          triggerInvalidate('forced_logout');
        }
      } else if (data.isActive === true && data.deviceId === myDeviceId) {
        safeStorage.setItem(VERIFIED_ACCOUNT_KEY, accountKey);
        safeStorage.removeItem(PENDING_VERIFY_KEY);
      }
    } catch {}
  };

  verifyOnServer();

  const unsubSnapshot = onSnapshot(
    sessionRef,
    (snap) => {
      if (unsubscribed || invalidated) return;
      if (!snap.exists()) return;
      // Ignore unconfirmed local optimistic cache if offline
      if (snap.metadata.fromCache && safeStorage.getItem('protyasha_offline_mode') === 'true') {
        return;
      }

      const data = snap.data() as Partial<DeviceSessionRecord>;
      if (data.isActive === true && data.deviceId && data.deviceId !== myDeviceId) {
        triggerInvalidate('other_device', data.deviceLabel);
      } else if (data.isActive === false && data.forcedLogout === true) {
        triggerInvalidate('forced_logout');
      }
    },
    (err) => {
      console.warn('[DeviceSession] Listener warning:', err);
    }
  );

  const handleOnline = () => {
    verifyOnServer();
  };
  const handleVisibility = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      sendSessionHeartbeat(user);
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility);
  }

  const heartbeatInterval = setInterval(() => {
    if (typeof document === 'undefined' || document.visibilityState === 'visible') {
      sendSessionHeartbeat(user);
    }
  }, 60000);

  return () => {
    unsubscribed = true;
    unsubSnapshot();
    clearInterval(heartbeatInterval);
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  };
}

/**
 * Subscribe to all currently active device sessions (used in Admin UserManagementModal).
 */
export function subscribeActiveDeviceSessions(
  onUpdate: (sessionsByKey: Record<string, DeviceSessionRecord>) => void
): () => void {
  const q = query(collection(db, 'settings'), where('isActive', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      const map: Record<string, DeviceSessionRecord> = {};
      snap.forEach((docSnap) => {
        if (!docSnap.id.startsWith('active_session_')) return;
        const data = docSnap.data() as DeviceSessionRecord;
        if (data && data.accountKey && data.isActive) {
          map[data.accountKey] = data;
        }
      });
      onUpdate(map);
    },
    (err) => {
      console.warn('[DeviceSession] Admin active sessions listener notice:', err);
    }
  );
}
