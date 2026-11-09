/**
 * Google Drive API Client & Backup Manager
 * Uses OAuth 2.0 with scope: https://www.googleapis.com/auth/drive.file
 */

import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from './firebase';

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

const provider = new GoogleAuthProvider();
provider.addScope(DRIVE_SCOPE);

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentGoogleUser: User | null = null;

// Initialize Google Drive Auth state listener
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentGoogleUser = user;
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Drive permissions
export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('গুগল ড্রাইভ অ্যাক্সেস টোকেন পাওয়া যায়নি');
    }

    cachedAccessToken = credential.accessToken;
    currentGoogleUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getConnectedGoogleUser = (): User | null => {
  return currentGoogleUser || auth.currentUser;
};

export const disconnectGoogleDrive = async () => {
  cachedAccessToken = null;
  currentGoogleUser = null;
  await auth.signOut();
};

export interface DriveBackupFile {
  id: string;
  name: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
}

/**
 * Finds or creates the "Admin_Backups" folder in Google Drive
 */
export async function getOrCreateBackupFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent("name = 'Admin_Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Admin_Backups',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক - ক্লাউড ডাটাবেস মাস্টার ব্যাকআপ ফোল্ডার'
    })
  });

  if (!createRes.ok) {
    throw new Error('গুগল ড্রাইভে Admin_Backups ফোল্ডার তৈরি করা সম্ভব হয়নি');
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Upload master backup JSON to Google Drive inside Admin_Backups
 */
export async function uploadBackupToGoogleDrive(
  backupData: any,
  fileName?: string
): Promise<DriveBackupFile> {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('গুগল ড্রাইভে লগইন করা নেই। অনুগ্রহ করে প্রথমে গুগল একাউন্ট কানেক্ট করুন।');
  }

  const folderId = await getOrCreateBackupFolder(token);

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-').slice(0, 5);
  const finalFileName = fileName || `Protyasha_Master_Backup_${dateStr}_${timeStr}.json`;

  const metadata = {
    name: finalFileName,
    parents: [folderId],
    description: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক মাস্টার ক্লাউড ব্যাকআপ (Firebase Firestore + Accounts)',
    mimeType: 'application/json'
  };

  const jsonContent = JSON.stringify(backupData, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    jsonContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size,createdTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.error('Drive upload failed:', errText);
    throw new Error(`গুগল ড্রাইভে ব্যাকআপ আপলোড ব্যর্থ হয়েছে (${uploadRes.status})`);
  }

  const result = await uploadRes.json();
  return result;
}

/**
 * List all backup files in Google Drive
 */
export async function listGoogleDriveBackups(): Promise<DriveBackupFile[]> {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('গুগল ড্রাইভ কানেক্টেড নয়');
  }

  // Find files in Admin_Backups or containing Backup
  const query = encodeURIComponent("trashed = false and (name contains 'Backup' or name contains 'backup' or mimeType = 'application/json')");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,size,createdTime,modifiedTime,webViewLink)&orderBy=createdTime desc&pageSize=30`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessTokenHeader(token)}` }
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('List backups failed:', err);
    throw new Error('ড্রাইভ থেকে ব্যাকআপ তালিকা আনা সম্ভব হয়নি');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Download a backup file from Google Drive
 */
export async function downloadGoogleDriveBackup(fileId: string): Promise<any> {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('গুগল ড্রাইভ কানেক্টেড নয়');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('গুগল ড্রাইভ থেকে ফাইল ডাউনলোড করা সম্ভব হয়নি');
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('ডাউনলোডকৃত ফাইলটি সঠিক JSON ফরম্যাটে নেই');
  }
}

/**
 * Delete a backup file from Google Drive (Mandatory user confirmation required in UI)
 */
export async function deleteGoogleDriveBackup(fileId: string): Promise<boolean> {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('গুগল ড্রাইভ কানেক্টেড নয়');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.ok;
}

function accessTokenHeader(token: string): string {
  return token.replace(/^Bearer\s+/i, '');
}
