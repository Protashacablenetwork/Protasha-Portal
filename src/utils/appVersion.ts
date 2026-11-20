import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { NotificationItem } from '../types';
import { safeStorage } from './safeStorage';

export const CURRENT_APP_VERSION = '2.6.2';
export const CURRENT_BUILD_NUMBER = 262;
export const LAST_ACK_VERSION_KEY = 'protyasha_last_ack_app_version';
export const LAST_CHECKED_AT_KEY = 'protyasha_last_update_checked_at';

export interface AppVersionInfo {
  version: string;
  buildNumber: number;
  releaseDate: string;
  titleBn: string;
  titleEn: string;
  featuresBn: string[];
  featuresEn: string[];
}

export const CURRENT_RELEASE_INFO: AppVersionInfo = {
  version: CURRENT_APP_VERSION,
  buildNumber: CURRENT_BUILD_NUMBER,
  releaseDate: '2026-11-20',
  titleBn: 'স্পিড, কোড-স্প্লিটিং ও আধুনিক প্রযুক্তি আপডেট',
  titleEn: 'Performance, Code-Splitting & Modern Tech Update',
  featuresBn: [
    'স্মার্ট কোড-স্প্লিটিং ও লেজি লোডিং — মোবাইল ও ধীর ইন্টারনেটে দ্রুত অ্যাপ চালু হবে',
    'নিজস্ব নোটিফিকেশন টোস্ট ও কনফার্মেশন ডায়ালগ (সব ব্রাউজার ও মোবাইল অ্যাপে নিরাপদ)',
    'স্বয়ংক্রিয় চাংক রিকভারি ও রিয়াল-টাইম লোকেশন ভিত্তিক সেহরি-ইফতার নোটিফিকেশন',
    'পাবলিক টিকেট ট্র্যাকার আলাদা লাইটওয়েট মডিউল ও উন্নত ক্যাশ ব্যবস্থাপনা'
  ],
  featuresEn: [
    'Smart code-splitting & lazy loading for faster mobile startup',
    'Non-blocking custom toast & confirmation dialogs safe in all WebViews',
    'Auto chunk recovery & live location-based Sehri-Iftar reminders',
    'Lightweight standalone public ticket tracker & smart cache revalidation'
  ]
};

export interface UpdateCheckResult {
  status: 'up_to_date' | 'update_available' | 'offline';
  currentVersion: string;
  latestVersion: string;
  currentBuildNumber: number;
  latestBuildNumber: number;
  hasNewFeatures: boolean;
  releaseInfo: AppVersionInfo;
  checkedAt: number;
  swUpdateReady?: boolean;
}

/**
 * Compares two semver strings (e.g. "2.5.1" vs "2.5.0").
 * Returns 1 if a > b, -1 if a < b, 0 if equal.
 */
export function compareSemver(a: string, b: string): number {
  const pa = String(a || '0.0.0').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b || '0.0.0').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

function normalizeVersionInfo(raw: any): AppVersionInfo | null {
  if (!raw || typeof raw !== 'object') return null;
  const version = typeof raw.version === 'string' && raw.version.trim() ? raw.version.trim() : '';
  if (!version) return null;
  return {
    version,
    buildNumber: Number(raw.buildNumber) || 0,
    releaseDate: typeof raw.releaseDate === 'string' ? raw.releaseDate : CURRENT_RELEASE_INFO.releaseDate,
    titleBn: typeof raw.titleBn === 'string' && raw.titleBn ? raw.titleBn : CURRENT_RELEASE_INFO.titleBn,
    titleEn: typeof raw.titleEn === 'string' && raw.titleEn ? raw.titleEn : CURRENT_RELEASE_INFO.titleEn,
    featuresBn: Array.isArray(raw.featuresBn) ? raw.featuresBn.filter((x: any) => typeof x === 'string') : [],
    featuresEn: Array.isArray(raw.featuresEn) ? raw.featuresEn.filter((x: any) => typeof x === 'string') : []
  };
}

async function fetchServerManifest(): Promise<AppVersionInfo | null> {
  const ts = Date.now();
  const assetBase = typeof window !== 'undefined' ? (window as any).__PCN_ASSET_BASE__ : '';
  const candidates = [
    ...(assetBase ? [`${assetBase}version.json?t=${ts}`] : []),
    `./version.json?t=${ts}`,
    `./public/version.json?t=${ts}`,
    `./HTDOCS_UPLOAD/version.json?t=${ts}`,
    `/version.json?t=${ts}`,
    `/api/app-version?t=${ts}`
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        }
      });
      if (!res.ok) continue;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) continue;
      const json = await res.json();
      const normalized = normalizeVersionInfo(json);
      if (normalized) return normalized;
    } catch {}
  }
  return null;
}

async function fetchCloudReleaseInfo(): Promise<AppVersionInfo | null> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return null;
  if (safeStorage.getItem('protyasha_offline_mode') === 'true') return null;

  try {
    const snap = await getDocFromServer(doc(db, 'settings', 'app_version'));
    if (snap.exists()) {
      return normalizeVersionInfo(snap.data());
    }
  } catch {}
  return null;
}

async function checkServiceWorkerUpdate(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      await reg.update().catch(() => {});
      if (reg.waiting || reg.installing) {
        return true;
      }
    }
  } catch {}
  return false;
}

/**
 * Checks whether the client is running the latest version and inspects new features
 * from both the server manifest (/api/app-version, /version.json) and Cloud Firestore.
 */
export async function checkForAppUpdates(): Promise<UpdateCheckResult> {
  const checkedAt = Date.now();
  const isOffline =
    (typeof navigator !== 'undefined' && navigator.onLine === false) ||
    safeStorage.getItem('protyasha_offline_mode') === 'true';

  if (isOffline) {
    return {
      status: 'offline',
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: CURRENT_APP_VERSION,
      currentBuildNumber: CURRENT_BUILD_NUMBER,
      latestBuildNumber: CURRENT_BUILD_NUMBER,
      hasNewFeatures: false,
      releaseInfo: CURRENT_RELEASE_INFO,
      checkedAt
    };
  }

  const [serverInfo, cloudInfo, swUpdateReady] = await Promise.all([
    fetchServerManifest(),
    fetchCloudReleaseInfo(),
    checkServiceWorkerUpdate()
  ]);

  let bestInfo: AppVersionInfo = CURRENT_RELEASE_INFO;

  for (const candidate of [serverInfo, cloudInfo]) {
    if (!candidate) continue;
    const cmp = compareSemver(candidate.version, bestInfo.version);
    if (cmp > 0 || (cmp === 0 && candidate.buildNumber > bestInfo.buildNumber)) {
      bestInfo = {
        ...bestInfo,
        ...candidate,
        featuresBn: candidate.featuresBn.length > 0 ? candidate.featuresBn : bestInfo.featuresBn,
        featuresEn: candidate.featuresEn.length > 0 ? candidate.featuresEn : bestInfo.featuresEn
      };
    } else if (cmp === 0 && candidate.featuresBn.length > bestInfo.featuresBn.length) {
      bestInfo = {
        ...bestInfo,
        featuresBn: candidate.featuresBn,
        featuresEn: candidate.featuresEn.length > 0 ? candidate.featuresEn : bestInfo.featuresEn
      };
    }
  }

  const semverNewer = compareSemver(bestInfo.version, CURRENT_APP_VERSION) > 0;
  const buildNewer =
    compareSemver(bestInfo.version, CURRENT_APP_VERSION) === 0 &&
    bestInfo.buildNumber > CURRENT_BUILD_NUMBER;

  const isUpdateAvailable = semverNewer || buildNewer || swUpdateReady;
  const lastAck = safeStorage.getItem(LAST_ACK_VERSION_KEY);
  const hasUnseenFeatures =
    isUpdateAvailable ||
    (bestInfo.featuresBn.length > 0 && lastAck !== `${bestInfo.version}_${bestInfo.buildNumber}`);

  safeStorage.setItem(LAST_CHECKED_AT_KEY, String(checkedAt));

  return {
    status: isUpdateAvailable ? 'update_available' : 'up_to_date',
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: bestInfo.version,
    currentBuildNumber: CURRENT_BUILD_NUMBER,
    latestBuildNumber: bestInfo.buildNumber,
    hasNewFeatures: hasUnseenFeatures,
    releaseInfo: bestInfo,
    checkedAt,
    swUpdateReady
  };
}

export function markVersionFeaturesAcknowledged(info: AppVersionInfo) {
  safeStorage.setItem(LAST_ACK_VERSION_KEY, `${info.version}_${info.buildNumber}`);
}

export function buildUpdateNotificationItem(result: UpdateCheckResult): NotificationItem {
  const { releaseInfo, status, latestVersion } = result;
  const now = new Date();
  const timeBn = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  const timeEn = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const featuresListBn = (releaseInfo.featuresBn.length > 0
    ? releaseInfo.featuresBn
    : CURRENT_RELEASE_INFO.featuresBn
  )
    .map((f, idx) => `${idx + 1}. ${f}`)
    .join('\n');

  const featuresListEn = (releaseInfo.featuresEn.length > 0
    ? releaseInfo.featuresEn
    : CURRENT_RELEASE_INFO.featuresEn
  )
    .map((f, idx) => `${idx + 1}. ${f}`)
    .join('\n');

  const isNew = status === 'update_available';

  return {
    id: `notif_app_update_v${latestVersion}_b${result.latestBuildNumber}`,
    titleBn: isNew
      ? `নতুন অ্যাপ আপডেট পাওয়া গেছে (v${latestVersion})`
      : `নতুন ফিচার যুক্ত হয়েছে (v${latestVersion})`,
    titleEn: isNew
      ? `New App Update Available (v${latestVersion})`
      : `New Features Added (v${latestVersion})`,
    bodyBn: `${releaseInfo.titleBn}\n${featuresListBn}`,
    bodyEn: `${releaseInfo.titleEn}\n${featuresListEn}`,
    date: now.toISOString().split('T')[0],
    timeBn,
    timeEn,
    type: 'info',
    isGlobal: true
  };
}

export async function applyAppUpdateAndReload(): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        await reg.unregister().catch(() => {});
      }
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map(k => window.caches.delete(k).catch(() => {})));
    }
  } catch {}

  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
