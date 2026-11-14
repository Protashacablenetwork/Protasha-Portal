import { initializeApp } from 'firebase/app';
import { safeStorage } from './safeStorage';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  enableNetwork,
  doc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  DocumentReference,
  SetOptions
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId || 'staff-collection-db';

// Initialize Firestore against the newly provisioned database with long-polling auto-detection
// to prevent NS_BINDING_ABORTED / WebChannel drops across proxies and browsers.
export const db = initializeFirestore(
  app,
  { experimentalAutoDetectLongPolling: true },
  databaseId
);

// Unified reference to the active provisioned Firestore database
export const staffDb = db;

export const auth = getAuth(app);

export const FIRESTORE_UPGRADE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${databaseId}/data?openUpgradeDialog=true`;

const QUOTA_KEY = 'firestore_quota_exceeded';
const QUOTA_RESET_KEY = 'firestore_quota_reset_time';
let sessionQuotaExceeded = false;

// Clear any legacy localStorage quota lockouts on boot and ensure network is active
try {
  safeStorage.removeItem(QUOTA_KEY);
  safeStorage.removeItem(QUOTA_RESET_KEY);
  enableNetwork(db).catch(() => {});
} catch {}

export function isFirestoreQuotaExceeded(): boolean {
  return sessionQuotaExceeded;
}

export function setFirestoreQuotaExceeded() {
  sessionQuotaExceeded = true;
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

/**
 * Recursively remove undefined properties from objects/arrays because Firestore
 * rejects documents containing `undefined` anywhere in the payload.
 */
export function stripUndefined<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T;
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        cleaned[k] = stripUndefined(v);
      }
    }
    return cleaned as T;
  }
  return value;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): boolean {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isQuota =
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('Quota limit exceeded') ||
    errMsg.includes('quota metric') ||
    (error as any)?.code === 8 ||
    (error as any)?.code === 'resource-exhausted';

  if (isQuota) {
    if (!sessionQuotaExceeded) {
      setFirestoreQuotaExceeded();
      console.warn('[Firestore Quota Notice]: Daily free tier read/write quota reached.');
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
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return false;
}

function notifyCloudMutation(path: string | null) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('protyasha-cloud-mutation', { detail: { path } }));
    }
  } catch {}
}

// Safe Firestore write helper that strips undefined and reports structured errors
export async function safeSetDoc(
  docRef: DocumentReference<any>,
  data: any,
  options?: SetOptions
): Promise<void> {
  const cleanData = stripUndefined(data);
  try {
    if (options) {
      await setDoc(docRef, cleanData, options);
    } else {
      await setDoc(docRef, cleanData);
    }
    notifyCloudMutation(docRef?.path || null);
  } catch (err: any) {
    const wasQuota = handleFirestoreError(err, OperationType.WRITE, docRef?.path || null);
    if (!wasQuota) {
      throw err;
    }
  }
}

// Safe Firestore delete helper that reports structured errors
export async function safeDeleteDoc(docRef: DocumentReference<any>): Promise<void> {
  try {
    await deleteDoc(docRef);
    notifyCloudMutation(docRef?.path || null);
  } catch (err: any) {
    const wasQuota = handleFirestoreError(err, OperationType.DELETE, docRef?.path || null);
    if (!wasQuota) {
      throw err;
    }
  }
}

// Validate connection to the newly provisioned Firestore database on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    } else {
      console.warn('[Firestore Connection Notice]:', error instanceof Error ? error.message : error);
    }
    return false;
  }
}

testFirestoreConnection();
