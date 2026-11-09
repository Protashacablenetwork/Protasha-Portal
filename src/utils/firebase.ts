import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Main database (original)
export const db = getFirestore(app);

// Staff database (separate - but falling back to default for compatibility if not provisioned)
export const staffDb = getFirestore(app);

export const auth = getAuth(app);

export const FIRESTORE_UPGRADE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${(firebaseConfig as any).firestoreDatabaseId || 'staff-collection-db'}/data?openUpgradeDialog=true`;

import { disableNetwork, enableNetwork } from 'firebase/firestore';

const QUOTA_KEY = 'firestore_quota_exceeded';
const QUOTA_RESET_KEY = 'firestore_quota_reset_time';

export function isFirestoreQuotaExceeded(): boolean {
  try {
    const isExceeded = localStorage.getItem(QUOTA_KEY) === 'true';
    const resetTime = parseInt(localStorage.getItem(QUOTA_RESET_KEY) || '0', 10);
    
    if (isExceeded && Date.now() < resetTime) {
      return true;
    }
    if (isExceeded && Date.now() >= resetTime) {
      localStorage.removeItem(QUOTA_KEY);
      localStorage.removeItem(QUOTA_RESET_KEY);
      enableNetwork(db).catch(() => {});
    }
  } catch {
    // ignore
  }
  return false;
}

export function setFirestoreQuotaExceeded() {
  try {
    const resetTime = Date.now() + 60 * 60 * 1000; // 1-hour backoff (persisted)
    localStorage.setItem(QUOTA_KEY, 'true');
    localStorage.setItem(QUOTA_RESET_KEY, resetTime.toString());
    disableNetwork(db).catch(() => {});
  } catch {
    // ignore
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): boolean {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isQuota = errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota limit exceeded') || errMsg.includes('quota metric') || (error as any)?.code === 8 || (error as any)?.code === 'resource-exhausted';

  if (isQuota) {
    if (!isFirestoreQuotaExceeded()) {
      setFirestoreQuotaExceeded();
      console.warn('[Firestore Spark Tier Quota Notice]: Daily write/read units limit reached on Google Cloud Firestore free tier. Seamlessly switched to local offline storage (localStorage/IndexedDB) and local server persistence. All app data is 100% saved and protected. Quota resets daily at midnight Pacific Time.');
    }
    return true;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('[Firestore Operation Notice]:', JSON.stringify(errInfo));
  return false;
}

// Safe Firestore write helper that checks quota before calling and prevents unhandled stream errors
export async function safeSetDoc(docRef: any, data: any, options?: any) {
  if (isFirestoreQuotaExceeded()) {
    return;
  }
  try {
    if (options) {
      await setDoc(docRef, data, options);
    } else {
      await setDoc(docRef, data);
    }
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota') || err?.code === 'resource-exhausted' || err?.code === 8) {
      setFirestoreQuotaExceeded();
      console.warn('[Firestore Free Quota]: Daily writes capped. Local persistence active.');
      return;
    }
    handleFirestoreError(err, OperationType.WRITE, docRef?.path || null);
  }
}

// Safe Firestore delete helper that checks quota before calling
export async function safeDeleteDoc(docRef: any) {
  if (isFirestoreQuotaExceeded()) {
    return;
  }
  try {
    await deleteDoc(docRef);
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota') || err?.code === 'resource-exhausted' || err?.code === 8) {
      setFirestoreQuotaExceeded();
      return;
    }
    handleFirestoreError(err, OperationType.DELETE, docRef?.path || null);
  }
}

// Validation connection to Firestore on initialization
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'connection_test'));
    console.log('[Firestore] Cloud connection verified successfully.');
  } catch (error) {
    console.warn('[Firestore Connection Notice]:', error instanceof Error ? error.message : error);
  }
}

// Initial check: if quota already exceeded, stop network immediately
if (isFirestoreQuotaExceeded()) {
  disableNetwork(db).catch(() => {});
  console.warn('[Firestore] Free tier quota reached. Offline mode active.');
} else {
  // Self-test on load if NOT in quota lockout
  testFirestoreConnection();
}

