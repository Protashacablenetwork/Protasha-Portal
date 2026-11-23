import type { SetOptions } from 'firebase/firestore';

export enum CloudOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

let firebaseModPromise: Promise<typeof import('./firebase')> | null = null;
let firestoreModPromise: Promise<typeof import('firebase/firestore')> | null = null;
let deviceSessionModPromise: Promise<typeof import('./deviceSession')> | null = null;

export const loadFirebase = () => (firebaseModPromise ??= import('./firebase'));
export const loadFirestore = () => (firestoreModPromise ??= import('firebase/firestore'));
export const loadDeviceSession = () => (deviceSessionModPromise ??= import('./deviceSession'));

/**
 * Triggers background preloading of Firebase + Firestore chunks right after first UI paint.
 */
export function warmCloudCore(): void {
  void loadFirebase();
  void loadFirestore();
}

export async function cloudSet(
  pathSegments: [string, ...string[]],
  data: any,
  options?: SetOptions,
  useStaffDb = false
): Promise<void> {
  const [{ db, staffDb, safeSetDoc }, { doc }] = await Promise.all([loadFirebase(), loadFirestore()]);
  const targetDb = useStaffDb ? staffDb : db;
  const [first, ...rest] = pathSegments;
  return safeSetDoc(doc(targetDb, first, ...rest), data, options);
}

export async function cloudDelete(
  pathSegments: [string, ...string[]],
  useStaffDb = false
): Promise<void> {
  const [{ db, staffDb, safeDeleteDoc }, { doc }] = await Promise.all([loadFirebase(), loadFirestore()]);
  const targetDb = useStaffDb ? staffDb : db;
  const [first, ...rest] = pathSegments;
  return safeDeleteDoc(doc(targetDb, first, ...rest));
}

export async function reportCloudError(
  err: unknown,
  operationType: CloudOperationType,
  path: string | null
): Promise<void> {
  try {
    const { handleFirestoreError } = await loadFirebase();
    handleFirestoreError(err, operationType as any, path);
  } catch {}
}
