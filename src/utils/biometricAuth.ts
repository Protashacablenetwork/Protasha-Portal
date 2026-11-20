import { safeStorage } from './safeStorage';

const BIOMETRIC_STORE_KEY = 'protyasha_biometric_creds_v1';

export interface StoredBiometricAccount {
  accountKey: string;
  accountId: string;
  name: string;
  role: string;
  credentialId: string; // base64url
  sealedPin: string;    // XOR-obfuscated with credentialId + device salt (verified live against Firestore on login)
  enrolledAt: number;
}

export interface BiometricCapability {
  available: boolean;
  reason?: 'insecure_http' | 'unsupported' | 'no_sensor';
}

export interface BiometricActionResult {
  success: boolean;
  cancelled?: boolean;
  accountId?: string;
  pin?: string;
  messageBn?: string;
  messageEn?: string;
}

function normalizeAccountKey(rawId: string): string {
  const clean = String(rawId || '').trim().toLowerCase();
  if (clean === 'admin' || clean === 'admin-master' || clean === 'admin-primary' || clean === '01777877207') {
    return '01777877207';
  }
  return clean.replace(/[^0-9a-z]/g, '');
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64url.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sealSecret(plain: string, keyMaterial: string): string {
  const secretBytes = new TextEncoder().encode(plain);
  const keyBytes = new TextEncoder().encode(keyMaterial || 'pcn_bio_key');
  const out = new Uint8Array(secretBytes.length);
  for (let i = 0; i < secretBytes.length; i++) {
    out[i] = secretBytes[i] ^ keyBytes[i % keyBytes.length] ^ ((i * 31 + 73) & 0xff);
  }
  return bytesToBase64Url(out);
}

function unsealSecret(sealed: string, keyMaterial: string): string {
  const sealedBytes = base64UrlToBytes(sealed);
  const keyBytes = new TextEncoder().encode(keyMaterial || 'pcn_bio_key');
  const out = new Uint8Array(sealedBytes.length);
  for (let i = 0; i < sealedBytes.length; i++) {
    out[i] = sealedBytes[i] ^ keyBytes[i % keyBytes.length] ^ ((i * 31 + 73) & 0xff);
  }
  return new TextDecoder().decode(out);
}

function readAllStored(): Record<string, StoredBiometricAccount> {
  try {
    const raw = safeStorage.getItem(BIOMETRIC_STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAllStored(map: Record<string, StoredBiometricAccount>) {
  try {
    safeStorage.setItem(BIOMETRIC_STORE_KEY, JSON.stringify(map));
  } catch {}
}

function randomBytes(length: number): Uint8Array {
  const arr = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
  }
  return arr;
}

/**
 * Safely checks whether WebAuthn platform biometric authentication (Fingerprint / Face ID)
 * is supported on the current device and origin without ever throwing.
 */
export async function checkBiometricCapability(): Promise<BiometricCapability> {
  try {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return { available: false, reason: 'unsupported' };
    }
    if (!window.isSecureContext) {
      return { available: false, reason: 'insecure_http' };
    }
    if (
      typeof window.PublicKeyCredential === 'undefined' ||
      !navigator.credentials ||
      typeof navigator.credentials.create !== 'function' ||
      typeof navigator.credentials.get !== 'function'
    ) {
      return { available: false, reason: 'unsupported' };
    }
    if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const hasPlatformSensor = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!hasPlatformSensor) {
        return { available: false, reason: 'no_sensor' };
      }
    }
    return { available: true };
  } catch {
    return { available: false, reason: 'unsupported' };
  }
}

/**
 * Finds an enrolled biometric credential matching the typed accountId (or the most recently enrolled account).
 */
export function getEnrolledBiometricAccount(preferredAccountId?: string): StoredBiometricAccount | null {
  const all = readAllStored();
  const keys = Object.keys(all);
  if (keys.length === 0) return null;

  if (preferredAccountId && preferredAccountId.trim()) {
    const norm = normalizeAccountKey(preferredAccountId);
    if (all[norm]) return all[norm];
  }

  // Fallback to most recently enrolled account on this device
  let latest: StoredBiometricAccount | null = null;
  for (const k of keys) {
    const item = all[k];
    if (!item || !item.credentialId || !item.sealedPin) continue;
    if (!latest || (item.enrolledAt || 0) > (latest.enrolledAt || 0)) {
      latest = item;
    }
  }
  return latest;
}

export function hasEnrolledBiometricAccount(preferredAccountId?: string): boolean {
  return Boolean(getEnrolledBiometricAccount(preferredAccountId));
}

export function removeBiometricAccount(accountId?: string): void {
  const all = readAllStored();
  if (!accountId) {
    writeAllStored({});
    return;
  }
  const norm = normalizeAccountKey(accountId);
  if (all[norm]) {
    delete all[norm];
    writeAllStored(all);
  }
}

function classifyBiometricError(err: unknown): { cancelled: boolean; messageBn: string; messageEn: string } {
  const name = (err as any)?.name || '';
  const msg = String((err as any)?.message || err || '').toLowerCase();

  if (
    name === 'NotAllowedError' ||
    name === 'AbortError' ||
    msg.includes('cancel') ||
    msg.includes('abort') ||
    msg.includes('not allowed') ||
    msg.includes('timed out')
  ) {
    return {
      cancelled: true,
      messageBn: 'ফিঙ্গারপ্রিন্ট বাতিল হয়েছে। কোনো সমস্যা নেই — পিন নম্বর দিয়ে সহজেই লগইন করুন।',
      messageEn: 'Fingerprint cancelled. No worries — you can sign in with your PIN.'
    };
  }

  if (name === 'SecurityError' || msg.includes('publickey') || msg.includes('iframe') || msg.includes('origin')) {
    return {
      cancelled: false,
      messageBn: 'এই ব্রাউজার বা ওয়েবভিউতে ফিঙ্গারপ্রিন্ট অনুমোদিত নয়। পিন নম্বর দিয়ে লগইন করুন।',
      messageEn: 'Fingerprint is not permitted in this browser context. Please sign in with PIN.'
    };
  }

  return {
    cancelled: false,
    messageBn: 'ফিঙ্গারপ্রিন্ট যাচাই সম্পন্ন হয়নি। পিন নম্বর দিয়ে লগইন করুন।',
    messageEn: 'Fingerprint verification did not succeed. Please sign in with your PIN.'
  };
}

/**
 * Enrolls device Fingerprint / Biometric (WebAuthn platform authenticator) for a verified account.
 */
export async function enrollFingerprintAccount(params: {
  accountId: string;
  pin: string;
  name: string;
  role: string;
}): Promise<BiometricActionResult> {
  const cap = await checkBiometricCapability();
  if (!cap.available) {
    if (cap.reason === 'insecure_http') {
      return {
        success: false,
        messageBn: 'ফিঙ্গারপ্রিন্ট চালু করতে HTTPS লিংক প্রয়োজন। আপাতত পিন নম্বর দিয়ে লগইন করুন।',
        messageEn: 'HTTPS is required for fingerprint login. Please use your PIN.'
      };
    }
    return {
      success: false,
      messageBn: 'এই ডিভাইস বা ব্রাউজারে ফিঙ্গারপ্রিন্ট সাপোর্ট নেই। পিন নম্বর দিয়ে লগইন করুন।',
      messageEn: 'Fingerprint is not supported on this device or browser. Please use your PIN.'
    };
  }

  try {
    const accountKey = normalizeAccountKey(params.accountId);
    const challenge = randomBytes(32);
    const userIdBytes = new TextEncoder().encode(accountKey || 'user');
    const hostname = window.location.hostname;

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge as BufferSource,
      rp: {
        name: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক',
        ...(hostname && hostname !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) ? { id: hostname } : {})
      },
      user: {
        id: userIdBytes as BufferSource,
        name: params.accountId,
        displayName: params.name || params.accountId
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },   // ES256
        { alg: -257, type: 'public-key' }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred'
      },
      timeout: 45000,
      attestation: 'none'
    };

    const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
    if (!credential || !credential.rawId) {
      return {
        success: false,
        cancelled: true,
        messageBn: 'ফিঙ্গারপ্রিন্ট সেটআপ বাতিল হয়েছে। পিন নম্বর দিয়েই চালিয়ে যেতে পারবেন।',
        messageEn: 'Fingerprint setup was cancelled. You can continue using your PIN.'
      };
    }

    const credentialId = bytesToBase64Url(new Uint8Array(credential.rawId));
    const sealedPin = sealSecret(params.pin, `${credentialId}:${accountKey}`);

    const all = readAllStored();
    all[accountKey] = {
      accountKey,
      accountId: params.accountId,
      name: params.name || params.accountId,
      role: params.role || 'user',
      credentialId,
      sealedPin,
      enrolledAt: Date.now()
    };
    writeAllStored(all);

    return {
      success: true,
      accountId: params.accountId,
      messageBn: 'ফিঙ্গারপ্রিন্ট লগইন সফলভাবে চালু হয়েছে!',
      messageEn: 'Fingerprint login enabled successfully!'
    };
  } catch (err) {
    const info = classifyBiometricError(err);
    return {
      success: false,
      cancelled: info.cancelled,
      messageBn: info.messageBn,
      messageEn: info.messageEn
    };
  }
}

/**
 * Verifies the user via native Fingerprint / Face ID prompt and returns stored credentials
 * so LoginView can run live Firestore verification and single-device session lock.
 */
export async function authenticateWithFingerprint(preferredAccountId?: string): Promise<BiometricActionResult> {
  const cap = await checkBiometricCapability();
  if (!cap.available) {
    if (cap.reason === 'insecure_http') {
      return {
        success: false,
        messageBn: 'ফিঙ্গারপ্রিন্ট লগইনের জন্য নিরাপদ HTTPS লিংক প্রয়োজন। অনুগ্রহ করে পিন নম্বর দিয়ে লগইন করুন।',
        messageEn: 'Secure HTTPS connection is required for fingerprint login. Please sign in with your PIN.'
      };
    }
    return {
      success: false,
      messageBn: 'এই ডিভাইস বা ব্রাউজারে ফিঙ্গারপ্রিন্ট পাওয়া যায়নি। পিন নম্বর দিয়ে লগইন করুন।',
      messageEn: 'Fingerprint sensor is unavailable in this browser. Please sign in with your PIN.'
    };
  }

  const stored = getEnrolledBiometricAccount(preferredAccountId);
  if (!stored) {
    return {
      success: false,
      messageBn: 'ফিঙ্গারপ্রিন্ট এখনো চালু করা হয়নি। প্রথমে একবার পিন নম্বর দিয়ে লগইন করে ফিঙ্গারপ্রিন্ট চালু করুন।',
      messageEn: 'Fingerprint is not set up yet. Sign in with your PIN once to enable fingerprint login.'
    };
  }

  try {
    const challenge = randomBytes(32);
    const credIdBytes = base64UrlToBytes(stored.credentialId);
    const hostname = window.location.hostname;

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: challenge as BufferSource,
      ...(hostname && hostname !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) ? { rpId: hostname } : {}),
      allowCredentials: [
        {
          id: credIdBytes as BufferSource,
          type: 'public-key',
          transports: ['internal']
        }
      ],
      userVerification: 'required',
      timeout: 45000
    };

    const assertion = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
    if (!assertion || !assertion.rawId) {
      return {
        success: false,
        cancelled: true,
        messageBn: 'ফিঙ্গারপ্রিন্ট বাতিল হয়েছে। পিন নম্বর দিয়ে লগইন করুন।',
        messageEn: 'Fingerprint cancelled. Please sign in with your PIN.'
      };
    }

    const pin = unsealSecret(stored.sealedPin, `${stored.credentialId}:${stored.accountKey}`);
    if (!pin || pin.length < 4) {
      removeBiometricAccount(stored.accountId);
      return {
        success: false,
        messageBn: 'ফিঙ্গারপ্রিন্ট ডেটা পুরনো হয়ে গেছে। একবার পিন নম্বর দিয়ে লগইন করুন।',
        messageEn: 'Saved fingerprint data expired. Please sign in with your PIN once.'
      };
    }

    return {
      success: true,
      accountId: stored.accountId,
      pin
    };
  } catch (err) {
    const info = classifyBiometricError(err);
    return {
      success: false,
      cancelled: info.cancelled,
      messageBn: info.messageBn,
      messageEn: info.messageEn
    };
  }
}
