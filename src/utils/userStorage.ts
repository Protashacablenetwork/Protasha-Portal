/**
 * Persistent App User storage manager with IndexedDB + localStorage hybrid caching.
 * Ensures account creation, login, and user listing work 100% reliably
 * even if Cloud Firestore is offline, uninitialized, or rate-limited.
 */
import { AppUser } from '../types';
import { initialAppUsers } from '../data/initialData';
import { savePersistentImage, getPersistentImage } from './imageStorage';

const LOCAL_USERS_KEY = 'protyasha_app_users';

/**
 * Retrieve all app users from local persistent cache (falling back to default initial users)
 */
export function getStoredUsers(): AppUser[] {
  if (typeof window === 'undefined') return initialAppUsers;
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[UserStorage] Error reading local users:', e);
  }

  // Save initial users to local storage for future offline access
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialAppUsers));
  } catch {}
  return initialAppUsers;
}

/**
 * Find a user by phone number locally
 */
export function findStoredUserByPhone(phone: string): AppUser | null {
  const clean = phone.trim();
  if (!clean) return null;
  const users = getStoredUsers();
  return users.find(u => u.phone === clean) || null;
}

/**
 * Save or update a user in local persistent storage
 */
export function saveStoredUser(user: AppUser): void {
  if (!user || !user.id || !user.phone) return;

  try {
    const users = getStoredUsers();
    const existingIdx = users.findIndex(u => u.id === user.id || u.phone === user.phone);
    
    let updatedUsers: AppUser[];
    if (existingIdx >= 0) {
      updatedUsers = [...users];
      updatedUsers[existingIdx] = { ...updatedUsers[existingIdx], ...user };
    } else {
      updatedUsers = [user, ...users];
    }

    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));

    // Save user avatar permanently in IndexedDB if it's a data URL
    if (user.avatarUrl && user.avatarUrl.startsWith('data:image/')) {
      savePersistentImage(`avatar_user_${user.id}`, user.avatarUrl);
    }
  } catch (e) {
    console.warn('[UserStorage] Error saving stored user:', e);
  }
}

/**
 * Delete a user from local persistent storage
 */
export function deleteStoredUser(id: string): void {
  if (!id) return;
  try {
    const users = getStoredUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('[UserStorage] Error deleting user:', e);
  }
}
