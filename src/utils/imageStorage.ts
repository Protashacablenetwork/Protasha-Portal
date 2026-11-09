/**
 * Robust, client-side permanent image persistence utility using IndexedDB + localStorage.
 * 
 * Why this is necessary:
 * Cloud Run containers have ephemeral filesystems; files written to /public/uploads/
 * are permanently destroyed when the container scales to 0 after 10-15 minutes of inactivity.
 * By storing clean compressed data URLs (25KB - 45KB) in IndexedDB and localStorage,
 * images survive container scale-downs, browser restarts, and device reboots forever.
 */

const DB_NAME = 'protyasha_storage_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_images';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Save an image permanently to IndexedDB and mirror to localStorage
 */
export async function savePersistentImage(key: string, dataUrl: string): Promise<void> {
  if (!key || !dataUrl) return;

  // 1. Save to localStorage immediately for instant synchronous access
  try {
    localStorage.setItem(`protyasha_img_${key}`, dataUrl);
  } catch (e) {
    console.warn(`[ImageStorage] localStorage quota reached for ${key}:`, e);
  }

  // 2. Save to IndexedDB for unlimited, permanent storage
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[ImageStorage] IndexedDB save error for ${key}:`, err);
  }
}

/**
 * Retrieve an image from localStorage or IndexedDB
 */
export async function getPersistentImage(key: string): Promise<string | null> {
  if (!key) return null;

  // 1. Fast check from localStorage
  try {
    const local = localStorage.getItem(`protyasha_img_${key}`);
    if (local && local.startsWith('data:image/')) {
      return local;
    }
  } catch {}

  // 2. Fallback to IndexedDB
  try {
    const db = await getDB();
    return new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const result = req.result as string | undefined;
        if (result && result.startsWith('data:image/')) {
          // Re-populate localStorage if possible
          try {
            localStorage.setItem(`protyasha_img_${key}`, result);
          } catch {}
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Get synchronous image from localStorage immediately
 */
export function getSyncPersistentImage(key: string, fallbackKey?: string): string {
  if (typeof window === 'undefined') return '';
  try {
    const direct = localStorage.getItem(`protyasha_img_${key}`);
    if (direct && direct.startsWith('data:image/')) return direct;

    if (fallbackKey) {
      const fallback = localStorage.getItem(fallbackKey);
      if (fallback && fallback.startsWith('data:image/')) return fallback;
    }
  } catch {}
  return '';
}

/**
 * Delete an image permanently from IndexedDB and localStorage
 */
export async function deletePersistentImage(key: string): Promise<void> {
  if (!key) return;
  try {
    localStorage.removeItem(`protyasha_img_${key}`);
  } catch {}

  try {
    const db = await getDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {}
}

/**
 * Cleanly compress an image file to a lightweight, crystal-clear Data URL (15-30KB)
 * to safely store in Firestore (<1MB), IndexedDB, and localStorage without quota errors.
 */
export function compressImageFile(file: File, maxDim = 300, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const webp = canvas.toDataURL('image/webp', quality);
            if (webp && webp.startsWith('data:image/webp') && webp.length > 50) {
              resolve(webp);
              return;
            }
          } catch {}
          resolve(canvas.toDataURL('image/jpeg', quality));
          return;
        }
        resolve(src);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
