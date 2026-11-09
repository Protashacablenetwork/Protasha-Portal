/**
 * Safe LocalStorage wrapper that prevents SecurityError, DOMException, or quota errors
 * from crashing the app in XAMPP, private browsing, or restricted iframe environments.
 */

export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Could not read '${key}':`, e);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`[SafeStorage] Could not write '${key}':`, e);
      return false;
    }
  },

  removeItem(key: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[SafeStorage] Could not remove '${key}':`, e);
      return false;
    }
  }
};
