import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  cloudDelete,
  CloudOperationType,
  cloudSet,
  loadDeviceSession,
  loadFirebase,
  loadFirestore,
  reportCloudError,
  warmCloudCore
} from './utils/cloudBridge';
import { 
  Language, 
  Transaction, 
  UserSession, 
  FooterConfig, 
  AuditLog, 
  NotificationItem, 
  PaymentChannel, 
  BannerAd,
  StaffAccount,
  ServiceStatusConfig,
  QuickHisabOwner,
  SupportTicket,
  StaffAttendanceRecord,
  PopupNotice,
  PopupNoticeAcknowledgement,
  SubAdminPermissionKey,
  SubAdminPermissions
} from './types';
import { 
  initialNotifications, 
  initialFooterConfig,
  initialBanners,
  initialPaymentChannels,
  initialStaffAccounts,
  initialQuickHisabOwners,
  initialAppUsers
} from './data/initialData';
import { sounds } from './utils/audio';
import { savePersistentImage, getPersistentImage, getSyncPersistentImage, deletePersistentImage } from './utils/imageStorage';
import { ArrowLeft, ExternalLink, Trash2, Zap } from 'lucide-react';

// Core initial-screen components
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { PrimaryFeatureCards, OperationsHubCards } from './components/PrimaryFeatureCards';
import { PromoCarousel } from './components/PromoCarousel';
import { QuickChannels } from './components/QuickChannels';
import { BottomNav, TabId } from './components/BottomNav';
import { clearTrackFromCurrentUrl, extractTrackTicketIdFromLocation } from './components/TicketTrackingHelpers';
import { showConfirm, showToast } from './utils/uiFeedback';

const TransactionList = React.lazy(() =>
  import('./components/TransactionList').then((m) => ({ default: m.TransactionList }))
);

const LoginView = React.lazy(() =>
  import('./components/LoginView').then((m) => ({ default: m.LoginView }))
);

// Lazy confetti trigger so canvas-confetti is zero bytes on initial boot
const triggerConfetti = (opts: Record<string, any>) => {
  import('canvas-confetti')
    .then((mod) => {
      const fn = mod.default || (mod as any);
      if (typeof fn === 'function') fn(opts);
    })
    .catch(() => {});
};

// On-demand lazy chunks for heavy views, modals, and sub-portals (fast mobile boot)
const TransactionDetailPage = React.lazy(() =>
  import('./components/TransactionDetailPage').then((m) => ({ default: m.TransactionDetailPage }))
);
const ReceiptModal = React.lazy(() =>
  import('./components/ReceiptModal').then((m) => ({ default: m.ReceiptModal }))
);
const EntryModal = React.lazy(() =>
  import('./components/EntryModal').then((m) => ({ default: m.EntryModal }))
);
const NotificationsModal = React.lazy(() =>
  import('./components/NotificationsModal').then((m) => ({ default: m.NotificationsModal }))
);
const NotificationDetailModal = React.lazy(() =>
  import('./components/NotificationDetailModal').then((m) => ({ default: m.NotificationDetailModal }))
);
const ServiceNoticeModal = React.lazy(() =>
  import('./components/ServiceNoticeModal').then((m) => ({ default: m.ServiceNoticeModal }))
);
const ProfileView = React.lazy(() =>
  import('./components/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const RecycleBinModal = React.lazy(() =>
  import('./components/RecycleBinModal').then((m) => ({ default: m.RecycleBinModal }))
);
const AuditLogModal = React.lazy(() =>
  import('./components/AuditLogModal').then((m) => ({ default: m.AuditLogModal }))
);
const FooterSettingsModal = React.lazy(() =>
  import('./components/FooterSettingsModal').then((m) => ({ default: m.FooterSettingsModal }))
);
const ChangePinModal = React.lazy(() =>
  import('./components/ChangePinModal').then((m) => ({ default: m.ChangePinModal }))
);
const ReportModal = React.lazy(() =>
  import('./components/ReportModal').then((m) => ({ default: m.ReportModal }))
);
const BannerManagerModal = React.lazy(() =>
  import('./components/BannerManagerModal').then((m) => ({ default: m.BannerManagerModal }))
);
const ChannelManagerModal = React.lazy(() =>
  import('./components/ChannelManagerModal').then((m) => ({ default: m.ChannelManagerModal }))
);
const UserManagementModal = React.lazy(() =>
  import('./components/UserManagementModal').then((m) => ({ default: m.UserManagementModal }))
);
const WeatherModal = React.lazy(() =>
  import('./components/WeatherModal').then((m) => ({ default: m.WeatherModal }))
);
const PrayerTimesModal = React.lazy(() =>
  import('./components/PrayerTimesModal').then((m) => ({ default: m.PrayerTimesModal }))
);
const StaffManagerModal = React.lazy(() =>
  import('./components/StaffManagerModal').then((m) => ({ default: m.StaffManagerModal }))
);
const ServiceManagerModal = React.lazy(() =>
  import('./components/ServiceManagerModal').then((m) => ({ default: m.ServiceManagerModal }))
);
const QuickHisabModal = React.lazy(() =>
  import('./components/QuickHisabModal').then((m) => ({ default: m.QuickHisabModal }))
);
const DriveBackupModal = React.lazy(() =>
  import('./components/DriveBackupModal').then((m) => ({ default: m.DriveBackupModal }))
);
const SupportTicketModal = React.lazy(() =>
  import('./components/SupportTicketModal').then((m) => ({ default: m.SupportTicketModal }))
);
const PublicTicketTracker = React.lazy(() =>
  import('./components/PublicTicketTracker').then((m) => ({ default: m.PublicTicketTracker }))
);
const StaffAttendanceModal = React.lazy(() =>
  import('./components/StaffAttendanceModal').then((m) => ({ default: m.StaffAttendanceModal }))
);
const AdminPopupNoticeModal = React.lazy(() =>
  import('./components/AdminPopupNoticeModal').then((m) => ({ default: m.AdminPopupNoticeModal }))
);
const UserPopupNoticeModal = React.lazy(() =>
  import('./components/UserPopupNoticeModal').then((m) => ({ default: m.UserPopupNoticeModal }))
);
const AyByayPortal = React.lazy(() =>
  import('./portals/ayByay/App').then((m) => ({ default: m.AyByayPortal }))
);
const BillManagerPortal = React.lazy(() =>
  import('./portals/billManager/BillManagerPortal').then((m) => ({ default: m.BillManagerPortal }))
);
import type { WeatherData, DistrictInfo } from './utils/weatherService';
import type { PrayerTimings } from './utils/prayerTimeService';
import { safeStorage } from './utils/safeStorage';
import {
  canAddTransactions,
  canModifyTransaction,
  hasSubAdminPermission,
  isTransactionOwner,
  isLoggedInSession,
  isSupportTicketOwner,
  isStaffSessionActive,
  normalizePhoneNumber
} from './utils/permissions';
import { saveStoredUser } from './utils/userStorage';
import {
  sanitizeStaffForFirestore,
  broadcastStaffAccounts,
  findMatchedStaffForUser,
  isStaffOrAdminUser,
  syncMainLoginStaffSession,
  syncStaffPinEverywhere
} from './utils/staffSync';
import { isActualStaffAccount } from './utils/ownerDueSync';
import type { UpdateCheckResult } from './utils/appVersion';

const DEFAULT_BOOT_DISTRICT: DistrictInfo = {
  nameBn: 'জামালপুর',
  nameEn: 'Jamalpur',
  divisionBn: 'ময়মনসিংহ',
  lat: 24.9375,
  lon: 89.9377
};

// Per-device automated location/system alerts stay strictly local so multi-district users never overwrite each other in Firestore
const isLocalAutoNotification = (n: NotificationItem): boolean => {
  if (!n) return false;
  if (n.isGlobal) return false;
  const id = String(n.id || '');
  return Boolean(
    n.isFastingAlert ||
    n.isPrayerAlert ||
    n.isWeatherAlert ||
    id.startsWith('fasting_') ||
    id.startsWith('prayer_') ||
    id.startsWith('weather-') ||
    id.startsWith('app-update-') ||
    id.startsWith('app-features-')
  );
};

const mergeCloudAndLocalNotifications = (
  cloudList: NotificationItem[],
  existingList: NotificationItem[]
): NotificationItem[] => {
  const localOnly = existingList.filter(isLocalAutoNotification);
  const cloudBroadcasts = cloudList.filter(n => n && !isLocalAutoNotification(n));
  const seen = new Set<string>();
  const merged: NotificationItem[] = [];
  for (const item of [...localOnly, ...cloudBroadcasts]) {
    if (!item || !item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
};

const getStablePopupAckUserKey = (u: UserSession | null): string => {
  if (u && u.role !== 'visitor') {
    const raw = String(u.id || u.phone || u.role || 'member');
    const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
    if (cleaned) return cleaned;
  }
  try {
    const existing = safeStorage.getItem('protyasha_device_ack_id');
    if (existing && /^[a-zA-Z0-9_-]+$/.test(existing)) return existing;
    const generated = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    safeStorage.setItem('protyasha_device_ack_id', generated);
    return generated;
  } catch {
    return 'guest_device';
  }
};

export default function App() {
  // Language
  const [lang, setLang] = useState<Language>(() => {
    return (safeStorage.getItem('protyasha_lang') as Language) || 'bn';
  });

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (safeStorage.getItem('protyasha_theme') as 'light' | 'dark') || 'light';
  });

  // Active Tab (4 tabs: home, transactions, ledger, profile)
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Global month/year filter state
  // Global month/year filter state
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // User Session: Persistent from safeStorage
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = safeStorage.getItem('protyasha_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (isLoggedInSession(parsed)) {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const userRef = useRef<UserSession | null>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    document.body.classList.add('app-ready');
    const rafId = typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame(() => setTimeout(warmCloudCore, 0))
      : window.setTimeout(warmCloudCore, 0);
    return () => {
      if (typeof rafId === 'number' && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubDriveAuth: (() => void) | null = null;
    let unsubArchive: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([import('./utils/googleDrive'), import('./utils/cloudArchiveSync')])
        .then(([{ initDriveAuth }, { initSilentCloudArchiveListener, scheduleSilentCloudArchiveSync }]) => {
          if (!active) return;
          unsubDriveAuth = initDriveAuth(() => {
            scheduleSilentCloudArchiveSync(500);
          });
          unsubArchive = initSilentCloudArchiveListener(() => userRef.current);
        })
        .catch(() => {});
    }, 1200);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubDriveAuth) unsubDriveAuth();
      if (unsubArchive) unsubArchive();
    };
  }, [Boolean(user)]);

  // Show Login/Register page: If user is not logged in, show Login page by default!
  const [isLoginOpen, setIsLoginOpen] = useState(() => {
    const savedUser = safeStorage.getItem('protyasha_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (isLoggedInSession(u)) return false;
      } catch {}
    }
    return true; // Keep user on login page by default when not logged in
  });

  // Notice shown on Login screen if forced out by single-device lock or admin action
  const [sessionNotice, setSessionNotice] = useState<string>('');

  // Public Online Tracking URL (?track=<ticketId>, #track=<ticketId>, #/track/<ticketId>, /track/<ticketId>)
  const [publicTrackTicketId, setPublicTrackTicketId] = useState<string | null>(() =>
    extractTrackTicketIdFromLocation()
  );
  const isPublicPreviewOverlayRef = useRef(false);

  // Guard: If user is logged out (user === null), enforce login view always
  useEffect(() => {
    if (!user && !isLoginOpen) {
      setIsLoginOpen(true);
    }
  }, [user, isLoginOpen]);

  // App Service & Notice Statuses State
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, ServiceStatusConfig>>(() => {
    const saved = safeStorage.getItem('protyasha_service_statuses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.ayByay?.logoUrl) {
          parsed.ayByay = { ...parsed.ayByay, logoUrl: 'https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png' };
        }
        if (!parsed.billManager?.logoUrl) {
          parsed.billManager = { ...parsed.billManager, logoUrl: 'https://bill-manager.ai.studio/logo.jpg' };
        }
        return parsed;
      } catch {}
    }
    return {
      visitorMode: { isActive: true },
      billManager: { isActive: true, logoUrl: 'https://bill-manager.ai.studio/logo.jpg' },
      ayByay: { isActive: true, logoUrl: 'https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png' },
      quickHisab: { isActive: true },
      staffManager: { isActive: true },
      supportTickets: { isActive: true },
      staffAttendance: { isActive: true },
      transactions: { isActive: true },
      ledger: { isActive: true }
    };
  });

  const isVisitorModeEnabled =
    serviceStatuses.visitorMode?.isActive !== false &&
    String(serviceStatuses.visitorMode?.isActive) !== 'false';

  // If Admin disables Visitor Mode in real-time while a guest is browsing in visitor mode, return them to Login screen
  useEffect(() => {
    if (user?.role === 'visitor' && !isVisitorModeEnabled) {
      safeStorage.removeItem('protyasha_user');
      sessionStorage.removeItem('protyasha_session_active');
      setUser(null);
      setActivePortal(null);
      setActiveTab('home');
      setIsProfileOpen(false);
      setSelectedTransaction(null);
      setIsLoginOpen(true);
      setSessionNotice(
        lang === 'bn'
          ? 'অ্যাডমিন সরাসরি ভিজিটর মোড বন্ধ করেছেন। অনুগ্রহ করে নতুন একাউন্ট খুলুন অথবা লগইন করুন।'
          : 'Admin has turned off Direct Visitor Mode. Please create an account or sign in.'
      );
    }
  }, [user?.role, isVisitorModeEnabled, lang]);

  const [isServiceManagerOpen, setIsServiceManagerOpen] = useState(false);
  const [activeServiceNotice, setActiveServiceNotice] = useState<{ name: string; title?: string; message?: string; logoUrl?: string } | null>(null);
  const [serverTotals, setServerTotals] = useState<{ income: number; expense: number; balance: number; totalCount: number } | null>(null);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);

  // User Management Modal State
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  // Centralized Google Drive Backup Modal State
  const [isDriveBackupOpen, setIsDriveBackupOpen] = useState(false);

  // Dynamic Payment Channels State (Default 5 channels + Admin custom channels)
  const [channels, setChannels] = useState<PaymentChannel[]>(() => {
    const saved = safeStorage.getItem('protyasha_channels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return cleanChannelLogos(parsed);
      } catch {
        return initialPaymentChannels;
      }
    }
    return initialPaymentChannels;
  });

  // Staff Collection & Company Dues State
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    const saved = safeStorage.getItem('protyasha_staff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
        return initialStaffAccounts;
      } catch {
        return initialStaffAccounts;
      }
    }
    return initialStaffAccounts;
  });

  // Quick Hisab Owners State (Admin controllable, synced across devices)
  const [quickHisabOwners, setQuickHisabOwners] = useState<QuickHisabOwner[]>(() => {
    const saved = safeStorage.getItem('protyasha_quick_hisab_owners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return initialQuickHisabOwners;
  });

  // Transactions State (Loaded strictly from Database, never fall back to mock demo data)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = safeStorage.getItem('protyasha_transactions') || safeStorage.getItem('isp_cache_txns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => t && t.id && !String(t.id).startsWith('txn-init-') && t.source !== 'ay-byay');
        }
      }
    } catch {}
    return [];
  });

  // Helper to sanitize banners (removed: cleaning logic was causing unintended data loss)
  const sanitizeBanners = (list: BannerAd[]): BannerAd[] => {
    return Array.isArray(list) ? list : [];
  };

  // Dynamic Homepage Banners (Cloud-first with fallback to initialBanners, sorted sequentially)
  const [banners, setBanners] = useState<BannerAd[]>(() => {
    try {
      const saved = safeStorage.getItem('protyasha_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter(b => b && b.id)
            .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
        }
      }
    } catch {}
    return [...initialBanners].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  });

  // Customer Support Tickets (Real-time synced with Firestore 'support_tickets')
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = safeStorage.getItem('protyasha_support_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((t: any) => t && t.id);
      }
    } catch {}
    return [];
  });

  // Staff Attendance & Leave Records (Real-time synced with Firestore 'staff_attendance')
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>(() => {
    try {
      const saved = safeStorage.getItem('protyasha_staff_attendance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((r: any) => r && r.id);
      }
    } catch {}
    return [];
  });

  // In-App Admin Popup Notices & User Consent Acknowledgements
  const [popupNotices, setPopupNotices] = useState<PopupNotice[]>(() => {
    try {
      const saved = safeStorage.getItem('protyasha_popup_notices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter((n: any) => n && n.id && n.title);
      }
    } catch {}
    return [];
  });
  const popupAckUserKey = useMemo(() => getStablePopupAckUserKey(user), [user]);
  const [acknowledgedPopupIds, setAcknowledgedPopupIds] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem(`protyasha_popup_acks_${getStablePopupAckUserKey(user)}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [popupAcksByNotice, setPopupAcksByNotice] = useState<Record<string, PopupNoticeAcknowledgement[]>>({});
  const [isPopupNoticeManagerOpen, setIsPopupNoticeManagerOpen] = useState(false);
  const [previewPopupNotice, setPreviewPopupNotice] = useState<PopupNotice | null>(null);
  const [isSubmittingPopupAck, setIsSubmittingPopupAck] = useState(false);

  // Helper to filter out legacy dummy/demo notifications and sanitize duplicate weather advice prefixes
  const cleanDemoNotifications = (list: NotificationItem[]): NotificationItem[] => {
    if (!Array.isArray(list)) return [];
    const sanitizeBodyBn = (text?: string) =>
      typeof text === 'string'
        ? text.replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, '$1')
        : text;
    return list
      .filter(n => {
        const id = n.id || '';
        const titleBn = n.titleBn || '';
        const titleEn = n.titleEn || '';
        if (id === 'notif-1' || id === 'notif-2' || id === 'notif-3' || id.startsWith('demo-')) return false;
        if (titleBn.includes('স্বাগতম') || titleEn.toLowerCase().includes('welcome')) return false;
        if (titleBn.includes('ক্যাশব্যাক ৫০') || titleBn.includes('ডেমো')) return false;
        return true;
      })
      .map(n => ({
        ...n,
        bodyBn: sanitizeBodyBn(n.bodyBn) || '',
        ...(n.messageBn !== undefined ? { messageBn: sanitizeBodyBn(n.messageBn) } : {})
      }));
  };

  const cleanChannelLogos = (list: PaymentChannel[]): PaymentChannel[] => {
    if (!Array.isArray(list)) return initialPaymentChannels;
    
    return list.map(ch => {
      // Always preserve custom data-URI uploads
      if (ch.imageUrl?.startsWith('data:image/')) return ch;

      const norm = (ch.name || '').trim();
      const lower = norm.toLowerCase();

      // Auto-apply official logos based on name
      if (norm === 'বিকাশ' || lower.includes('bkash')) return { ...ch, imageUrl: 'https://imagepaste.org/i/nr5kcshj.png' };
      if (norm === 'রকেট' || lower.includes('rocket')) return { ...ch, imageUrl: 'https://imagepaste.org/i/y9dgzfpq.png' };
      if (norm === 'নগদ' || lower.includes('nagad')) return { ...ch, imageUrl: 'https://imagepaste.org/i/t4dassfe.png' };
      if (norm === 'ক্যাশ' || lower.includes('cash')) return { ...ch, imageUrl: 'https://imagepaste.org/i/ejqxwxby.png' };

      return ch;
    });
  };

  // Notifications State (Cloud-first)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Per-User Notification Read Tracking
  const userKey = user ? (user.id || user.phone || user.role) : 'visitor';

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const key = `protyasha_read_notifs_${user ? (user.id || user.phone || user.role) : 'visitor'}`;
      const saved = safeStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const key = `protyasha_read_notifs_${userKey}`;
    try {
      const saved = safeStorage.getItem(key);
      setReadNotifIds(saved ? JSON.parse(saved) : []);
    } catch {
      setReadNotifIds([]);
    }

    if (user?.id) {
      const uid = user.id;
      let active = true;
      let unsub: (() => void) | null = null;
      const timer = setTimeout(() => {
        Promise.all([loadFirebase(), loadFirestore()])
          .then(([{ db, handleFirestoreError, OperationType }, { doc, onSnapshot }]) => {
            if (!active) return;
            unsub = onSnapshot(doc(db, 'users', uid), (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                if (data?.status === 'suspended' && uid !== 'admin-master') {
                  setSessionNotice(
                    lang === 'bn'
                      ? 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।'
                      : 'Your account has been suspended. Please contact admin.'
                  );
                  safeStorage.removeItem('protyasha_user');
                  sessionStorage.removeItem('protyasha_session_active');
                  setUser(null);
                  setIsLoginOpen(true);
                  return;
                }
                if (Array.isArray(data.readNotifications)) {
                  setReadNotifIds(prev => {
                    const combined = Array.from(new Set([...prev, ...data.readNotifications]));
                    try {
                      safeStorage.setItem(key, JSON.stringify(combined));
                    } catch {}
                    return combined;
                  });
                }

                const remoteAvatar =
                  typeof data.avatarUrl === 'string' && data.avatarUrl && !data.avatarUrl.startsWith('/uploads/')
                    ? data.avatarUrl
                    : '';

                if (remoteAvatar) {
                  savePersistentImage(`avatar_user_${uid}`, remoteAvatar);
                  if (user.role === 'admin') {
                    setAdminAvatar(prev => prev || remoteAvatar);
                  }
                }

                setUser(prev => {
                  if (!prev || prev.id !== uid) return prev;
                  const nextName = data.name || prev.name;
                  const nextPhone = data.phone || prev.phone;
                  const nextAvatar = remoteAvatar || prev.avatarUrl;
                  const nextGmail = data.gmail !== undefined ? (data.gmail || undefined) : prev.gmail;
                  const nextBound = Array.isArray(data.boundMethods) ? data.boundMethods : prev.boundMethods;
                  const nextRole = data.role || prev.role;
                  const nextPermissions =
                    nextRole === 'sub-admin'
                      ? data.permissions && typeof data.permissions === 'object'
                        ? (data.permissions as SubAdminPermissions)
                        : prev.permissions
                      : undefined;

                  if (
                    nextName === prev.name &&
                    nextPhone === prev.phone &&
                    nextAvatar === prev.avatarUrl &&
                    nextGmail === prev.gmail &&
                    nextRole === prev.role &&
                    JSON.stringify(nextPermissions || null) === JSON.stringify(prev.permissions || null) &&
                    JSON.stringify(nextBound || []) === JSON.stringify(prev.boundMethods || [])
                  ) {
                    return prev;
                  }

                  const nextSession: UserSession = {
                    ...prev,
                    name: nextName,
                    phone: nextPhone,
                    avatarUrl: nextAvatar,
                    gmail: nextGmail,
                    boundMethods: nextBound,
                    role: nextRole,
                    permissions: nextPermissions
                  };
                  try {
                    safeStorage.setItem('protyasha_user', JSON.stringify(nextSession));
                  } catch {}
                  return nextSession;
                });
              }
            }, (err) => {
              handleFirestoreError(err, OperationType.GET, `users/${uid}`);
            });
          })
          .catch(() => {});
      }, 60);
      return () => {
        active = false;
        clearTimeout(timer);
        if (unsub) unsub();
      };
    }
  }, [user?.id, userKey, lang]);

  // Real-time Single-Device Session Guard (Enforces 1 device per login ID across admin, sub-admin & user)
  useEffect(() => {
    if (!user || user.role === 'visitor') return;

    let active = true;
    let stopGuard: (() => void) | null = null;
    const timer = setTimeout(() => {
      loadDeviceSession()
        .then(({ startDeviceSessionGuard }) => {
          if (!active) return;
          stopGuard = startDeviceSessionGuard(user, (reason, otherDeviceLabel) => {
            const notice =
              reason === 'other_device'
                ? (lang === 'bn'
                    ? `এই অ্যাকাউন্টটি ইতিমধ্যে অন্য একটি ডিভাইসে (${otherDeviceLabel || 'অন্য ডিভাইস'}) সক্রিয় থাকায় আপনার সেশন স্বয়ংক্রিয়ভাবে লগআউট হয়েছে। প্রতিটি আইডি একসাথে শুধুমাত্র ১টি ডিভাইসে ব্যবহার করা যাবে।`
                    : `This account is active on another device (${otherDeviceLabel || 'other device'}), so this session was signed out. Only 1 device is allowed per account.`)
                : (lang === 'bn'
                    ? 'অ্যাডমিন বা অন্য সেশন থেকে আপনার ডিভাইস লগআউট করা হয়েছে। পুনরায় লগইন করুন।'
                    : 'Your device session was logged out remotely. Please sign in again.');

            setSessionNotice(notice);
            safeStorage.removeItem('protyasha_user');
            sessionStorage.removeItem('protyasha_session_active');
            setUser(null);
            setActiveTab('home');
            setIsProfileOpen(false);
            setSelectedTransaction(null);
            setActivePortal(null);
            setIsNotificationsOpen(false);
            setIsAuditLogOpen(false);
            setIsUserManagementOpen(false);
            setIsBannerManagerOpen(false);
            setIsChannelManagerOpen(false);
            setIsRecycleBinOpen(false);
            setIsChangePinOpen(false);
            setIsFooterSettingsOpen(false);
            setIsEntryModalOpen(false);
            setReceiptTransaction(null);
            setSelectedNotificationDetail(null);
            setIsPopupNoticeManagerOpen(false);
            setPreviewPopupNotice(null);
            setIsLoginOpen(true);
            if (!stateRef.current.publicTrackTicketId) {
              window.history.pushState({ screen: 'login' }, '', window.location.pathname);
            }
          });
        })
        .catch(() => {});
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
      if (stopGuard) stopGuard();
    };
  }, [user?.id, user?.phone, user?.role, lang]);

  // Real-time synchronization with Cloud Firestore for Staff Accounts (deferred after login for fast boot)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubscribe: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, staffDb, handleFirestoreError, OperationType }, { collection, doc, onSnapshot, getDoc }]) => {
          if (!active) return;
          unsubscribe = onSnapshot(collection(staffDb, 'staff'), async (snapshot) => {
            if (snapshot.empty) {
              try {
                const metaSnap = await getDoc(doc(db, 'settings', 'staff_meta'));
                if (metaSnap.exists() && metaSnap.data()?.initialized) {
                  setStaffAccounts([]);
                  broadcastStaffAccounts([]);
                }
              } catch {}
              return;
            }
            const cloudStaff: StaffAccount[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data() as StaffAccount;
              if (data && (data.id || docSnap.id) && data.name) {
                cloudStaff.push({
                  ...data,
                  id: String(data.id || docSnap.id),
                  phone: data.phone || '',
                  role: data.role || 'লাইন টেকনিশিয়ান',
                  isActive: data.isActive !== false,
                  transactions: Array.isArray(data.transactions) ? data.transactions : []
                });
              }
            });
            setStaffAccounts(cloudStaff);
            broadcastStaffAccounts(cloudStaff);
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'staff');
          });
        })
        .catch((e) => {
          console.warn('Staff Firestore listener setup notice:', e);
        });
    }, 700);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, [Boolean(user)]);

  // Real-time synchronization for Banners (Ads) from dedicated 'banners' collection (deferred after first paint)
  useEffect(() => {
    let active = true;
    let unsubColl: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, doc, onSnapshot, getDoc }]) => {
          if (!active) return;
          unsubColl = onSnapshot(collection(db, 'banners'), async (snapshot) => {
            if (snapshot.empty) {
              try {
                const metaSnap = await getDoc(doc(db, 'settings', 'banners_meta'));
                if (metaSnap.exists() && metaSnap.data()?.initialized) {
                  setBanners([]);
                  safeStorage.setItem('protyasha_banners', JSON.stringify([]));
                }
              } catch {}
              return;
            }
            const cloudBanners: BannerAd[] = [];
            snapshot.forEach(docSnap => {
              const b = docSnap.data() as BannerAd;
              if (b && (b.id || docSnap.id) && b.imageUrl) {
                cloudBanners.push({
                  ...b,
                  id: String(b.id || docSnap.id),
                  isActive: b.isActive !== false
                });
              }
            });
            cloudBanners.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
            setBanners(cloudBanners);
            try {
              safeStorage.setItem('protyasha_banners', JSON.stringify(cloudBanners));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'banners');
          });
        })
        .catch((e) => {
          console.warn('Banners Firestore listener setup notice:', e);
        });
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubColl) unsubColl();
    };
  }, []);

  // Real-time synchronization for Payment Channels from dedicated 'channels' collection
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubColl: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, doc, onSnapshot, getDoc }]) => {
          if (!active) return;
          unsubColl = onSnapshot(collection(db, 'channels'), async (snapshot) => {
            if (snapshot.empty) {
              try {
                const metaSnap = await getDoc(doc(db, 'settings', 'channels_meta'));
                if (metaSnap.exists() && metaSnap.data()?.initialized) {
                  setChannels([]);
                  safeStorage.setItem('protyasha_channels', JSON.stringify([]));
                }
              } catch {}
              return;
            }
            const cloudChannels: (PaymentChannel & { order?: number })[] = [];
            snapshot.forEach(docSnap => {
              const ch = docSnap.data() as PaymentChannel & { order?: number };
              if (ch && (ch.id || docSnap.id) && ch.name) {
                cloudChannels.push({ ...ch, id: String(ch.id || docSnap.id) });
              }
            });
            cloudChannels.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
            const cleaned = cleanChannelLogos(cloudChannels);
            setChannels(cleaned);
            try {
              safeStorage.setItem('protyasha_channels', JSON.stringify(cleaned));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'channels');
          });
        })
        .catch((e) => {
          console.warn('Channels Firestore listener setup notice:', e);
        });
    }, 220);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubColl) unsubColl();
    };
  }, [Boolean(user)]);

  // Real-time synchronization for Quick Hisab Owners (deferred after login)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubColl: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, doc, onSnapshot, getDoc }]) => {
          if (!active) return;
          unsubColl = onSnapshot(collection(db, 'quick_hisab_owners'), async (snapshot) => {
            if (snapshot.empty) {
              try {
                const metaSnap = await getDoc(doc(db, 'settings', 'owners_meta'));
                if (metaSnap.exists() && metaSnap.data()?.initialized) {
                  setQuickHisabOwners([]);
                  safeStorage.setItem('protyasha_quick_hisab_owners', JSON.stringify([]));
                }
              } catch {}
              return;
            }
            const cloudOwners: QuickHisabOwner[] = [];
            snapshot.forEach(dSnap => {
              const o = dSnap.data() as QuickHisabOwner;
              if (o && o.name) {
                cloudOwners.push({ ...o, id: String(o.id || dSnap.id) });
              }
            });
            setQuickHisabOwners(cloudOwners);
            try {
              safeStorage.setItem('protyasha_quick_hisab_owners', JSON.stringify(cloudOwners));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'quick_hisab_owners');
          });
        })
        .catch((e) => {
          console.warn('Quick Hisab Owners listener setup notice:', e);
        });
    }, 900);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubColl) unsubColl();
    };
  }, [Boolean(user)]);

  // Real-time synchronization for Customer Support Tickets (deferred after login)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubTickets: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, onSnapshot }]) => {
          if (!active) return;
          unsubTickets = onSnapshot(collection(db, 'support_tickets'), (snapshot) => {
            const list: SupportTicket[] = [];
            snapshot.forEach((dSnap) => {
              const item = dSnap.data() as SupportTicket;
              if (item && (item.id || dSnap.id) && item.customerName) {
                list.push({ ...item, id: String(item.id || dSnap.id) });
              }
            });
            setSupportTickets(list);
            try {
              safeStorage.setItem('protyasha_support_tickets', JSON.stringify(list));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'support_tickets');
          });
        })
        .catch((e) => {
          console.warn('Support tickets Firestore listener notice:', e);
        });
    }, 1050);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubTickets) unsubTickets();
    };
  }, [Boolean(user)]);

  // Real-time synchronization for Staff Attendance & Leave (deferred after login)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubAttendance: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, onSnapshot }]) => {
          if (!active) return;
          unsubAttendance = onSnapshot(collection(db, 'staff_attendance'), (snapshot) => {
            const list: StaffAttendanceRecord[] = [];
            snapshot.forEach((dSnap) => {
              const item = dSnap.data() as StaffAttendanceRecord;
              if (item && (item.id || dSnap.id) && item.staffId && item.date) {
                list.push({ ...item, id: String(item.id || dSnap.id) });
              }
            });
            setAttendanceRecords(list);
            try {
              safeStorage.setItem('protyasha_staff_attendance', JSON.stringify(list));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'staff_attendance');
          });
        })
        .catch((e) => {
          console.warn('Staff attendance Firestore listener notice:', e);
        });
    }, 1150);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubAttendance) unsubAttendance();
    };
  }, [Boolean(user)]);

  // Real-time synchronization for In-App Admin Popup Notices ('popup_notices', deferred after login)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubPopupNotices: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, onSnapshot }]) => {
          if (!active) return;
          unsubPopupNotices = onSnapshot(
            collection(db, 'popup_notices'),
            (snapshot) => {
              const list: PopupNotice[] = [];
              snapshot.forEach((dSnap) => {
                const item = dSnap.data() as PopupNotice;
                if (item && (item.id || dSnap.id) && item.title && item.message) {
                  list.push({ ...item, id: String(item.id || dSnap.id) });
                }
              });
              list.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
              setPopupNotices(list);
              try {
                safeStorage.setItem('protyasha_popup_notices', JSON.stringify(list));
              } catch {}
            },
            (err) => {
              handleFirestoreError(err, OperationType.LIST, 'popup_notices');
            }
          );
        })
        .catch((e) => {
          console.warn('Popup notices Firestore listener notice:', e);
        });
    }, 1250);
    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubPopupNotices) unsubPopupNotices();
    };
  }, [Boolean(user)]);

  // Reload per-user local popup acknowledgements & verify unacknowledged ones against Firestore cross-device
  useEffect(() => {
    const storageKey = `protyasha_popup_acks_${popupAckUserKey}`;
    let localIds: string[] = [];
    try {
      const saved = safeStorage.getItem(storageKey);
      localIds = saved ? JSON.parse(saved) : [];
      setAcknowledgedPopupIds(localIds);
    } catch {
      setAcknowledgedPopupIds([]);
    }

    if (!user || popupNotices.length === 0) return;
    const activeIds = popupNotices
      .filter((n) => n.isActive && !localIds.includes(n.id))
      .map((n) => n.id);
    if (activeIds.length === 0) return;

    let cancelled = false;
    Promise.all([loadFirebase(), loadFirestore()])
      .then(([{ db }, { doc, getDoc }]) => {
        if (cancelled) return;
        return Promise.all(
          activeIds.map(async (noticeId) => {
            try {
              const ackSnap = await getDoc(doc(db, 'popup_notices', noticeId, 'acknowledgements', popupAckUserKey));
              return ackSnap.exists() ? noticeId : null;
            } catch {
              return null;
            }
          })
        );
      })
      .then((confirmedIds) => {
        if (cancelled || !confirmedIds) return;
        const validIds = confirmedIds.filter((id): id is string => Boolean(id));
        if (validIds.length > 0) {
          setAcknowledgedPopupIds((prev) => {
            const merged = Array.from(new Set([...prev, ...validIds]));
            if (merged.length !== prev.length) {
              try {
                safeStorage.setItem(storageKey, JSON.stringify(merged));
              } catch {}
            }
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [Boolean(user), popupAckUserKey, popupNotices]);

  // Admin: Live listener on acknowledgements for all popup notices when Admin Popup Manager is open
  useEffect(() => {
    if (user?.role !== 'admin' || !isPopupNoticeManagerOpen || popupNotices.length === 0) return;
    let active = true;
    const unsubs: (() => void)[] = [];
    Promise.all([loadFirebase(), loadFirestore()])
      .then(([{ db }, { collection, onSnapshot }]) => {
        if (!active) return;
        popupNotices.forEach((notice) => {
          try {
            const unsub = onSnapshot(
              collection(db, 'popup_notices', notice.id, 'acknowledgements'),
              (snap) => {
                const list: PopupNoticeAcknowledgement[] = [];
                snap.forEach((d) => {
                  const ack = d.data() as PopupNoticeAcknowledgement;
                  if (ack && ack.userName) {
                    list.push({ ...ack, id: String(ack.id || d.id) });
                  }
                });
                list.sort((a, b) => String(b.acknowledgedAt || '').localeCompare(String(a.acknowledgedAt || '')));
                setPopupAcksByNotice((prev) => ({ ...prev, [notice.id]: list }));
              },
              () => {}
            );
            unsubs.push(unsub);
          } catch {}
        });
      })
      .catch(() => {});
    return () => {
      active = false;
      unsubs.forEach((u) => u());
    };
  }, [user?.role, isPopupNoticeManagerOpen, popupNotices]);

  const isNotifReadForUser = useCallback((notif: NotificationItem) => {
    if (readNotifIds.includes(notif.id)) return true;
    if (userKey && Array.isArray(notif.readBy) && notif.readBy.includes(userKey)) return true;
    return false;
  }, [readNotifIds, userKey]);

  // Notification Detailed View (Opens when notification is clicked)
  const [selectedNotificationDetail, setSelectedNotificationDetail] = useState<NotificationItem | null>(null);

  // Footer Config
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    const saved = safeStorage.getItem('protyasha_footer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFooterConfig;
      }
    }
    return initialFooterConfig;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = safeStorage.getItem('protyasha_audit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'log-1',
        action: 'System Initialized',
        actionBn: 'সিস্টেম চালু হয়েছে',
        user: 'System',
        details: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক হিসাব খাতা প্রস্তুত',
        time: Date.now() - 3600000
      }
    ];
  });

  const [adminAvatar, setAdminAvatar] = useState<string>(() => {
    const syncImg = getSyncPersistentImage('avatar_admin', 'protyasha_admin_avatar');
    // If it's a broken /uploads/ URL, discard it
    if (syncImg && !syncImg.startsWith('/uploads/')) return syncImg;
    const legacy = safeStorage.getItem('protyasha_admin_avatar') || '';
    return legacy && !legacy.startsWith('/uploads/') ? legacy : '';
  });

  // Asynchronously retrieve avatar & service logos from IndexedDB after boot only when missing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!adminAvatar) {
        getPersistentImage('avatar_admin').then((savedImg) => {
          if (savedImg && savedImg.startsWith('data:image/')) {
            setAdminAvatar(prev => prev || savedImg);
          }
        });
      }

      const serviceIds = ['billManager', 'ayByay', 'staffManager', 'transactions', 'ledger'];
      Promise.all(
        serviceIds.map(async (id) => {
          const img = await getPersistentImage(`service_logo_${id}`);
          return img && img.startsWith('data:image/') ? ([id, img] as const) : null;
        })
      ).then((entries) => {
        const updates: Record<string, string> = {};
        for (const entry of entries) {
          if (entry) updates[entry[0]] = entry[1];
        }
        if (Object.keys(updates).length > 0) {
          setServiceStatuses(prev => {
            let changed = false;
            const next = { ...prev };
            Object.keys(updates).forEach(id => {
              if (next[id] && !next[id].logoUrl) {
                next[id] = { ...next[id], logoUrl: updates[id] };
                changed = true;
              }
            });
            return changed ? next : prev;
          });
        }
      });
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (adminAvatar && !adminAvatar.startsWith('/uploads/')) {
      if (adminAvatar.startsWith('data:image/')) {
        savePersistentImage('avatar_admin', adminAvatar);
      }
      try {
        safeStorage.setItem('protyasha_admin_avatar', adminAvatar);
      } catch (e) {
        console.warn('LocalStorage limit reached for admin avatar:', e);
      }
    }
  }, [adminAvatar]);

  // Automated Daily Google Drive Backup Background Checker
  useEffect(() => {
    const checkScheduledBackup = async () => {
      try {
        const isEnabled = safeStorage.getItem('protyasha_scheduled_backup_enabled') === 'true';
        if (!isEnabled) return;

        const scheduledTime = safeStorage.getItem('protyasha_scheduled_backup_time') || '23:00';
        const now = new Date();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${currentHours}:${currentMinutes}`;

        const todayStr = now.toISOString().split('T')[0];
        const lastBackupDate = safeStorage.getItem('protyasha_last_auto_backup_date');

        if (currentTimeStr >= scheduledTime && lastBackupDate !== todayStr) {
          const [{ getDriveAccessToken, uploadBackupToGoogleDrive }, { collectMasterBackupData }, { syncMasterDataToCloudArchive }] =
            await Promise.all([
              import('./utils/googleDrive'),
              import('./utils/backupCollector'),
              import('./utils/cloudArchiveSync')
            ]);
          const token = getDriveAccessToken();
          if (token) {
            const masterData = await collectMasterBackupData(user);
            await uploadBackupToGoogleDrive(masterData);
            syncMasterDataToCloudArchive(masterData).catch(() => {});
            safeStorage.setItem('protyasha_last_auto_backup_date', todayStr);
            console.log('[AutoBackup] Daily scheduled Google Drive backup completed successfully at', currentTimeStr);
          }
        }
      } catch (e) {
        console.warn('[AutoBackup] Scheduled backup check notice:', e);
      }
    };

    const interval = setInterval(checkScheduledBackup, 60000);
    return () => clearInterval(interval);
  }, [user]);
  useEffect(() => {
    document.body.classList.add('app-ready');
    // Skip redundant 5x Firestore seed reads once this device has confirmed initialization
    if (safeStorage.getItem('protyasha_db_seeded_v1') === '1') return;

    const timer = setTimeout(() => {
      const bootstrapNewDatabase = async () => {
        const nowIso = new Date().toISOString();
        try {
          const [{ db, staffDb, safeSetDoc }, { collection, doc, getDoc, getDocs }] = await Promise.all([
            loadFirebase(),
            loadFirestore()
          ]);
          const ensureCollectionSeeded = async <T extends { id: string | number }>(
            metaDocId: string,
            colName: string,
            targetDb: typeof db,
            items: T[],
            normalize: (item: T, idx: number) => Record<string, any>
          ) => {
            try {
              const metaRef = doc(db, 'settings', metaDocId);
              const metaSnap = await getDoc(metaRef);
              if (metaSnap.exists() && metaSnap.data()?.initialized) return true;

              const existingSnap = await getDocs(collection(targetDb, colName));
              if (existingSnap.empty && items.length > 0) {
                await Promise.all(
                  items.map((item, idx) =>
                    safeSetDoc(doc(targetDb, colName, String(item.id)), normalize(item, idx)).catch(() => {})
                  )
                );
              }
              await safeSetDoc(metaRef, { initialized: true, updatedAt: nowIso }).catch(() => {});
              return true;
            } catch (e) {
              console.warn(`Seed check notice for ${colName}:`, e);
              return false;
            }
          };

          const results = await Promise.all([
            ensureCollectionSeeded('banners_meta', 'banners', db, initialBanners, (b, idx) => ({
              ...b,
              id: String(b.id),
              isActive: b.isActive !== false,
              priority: b.priority ?? idx + 1,
              updatedAt: nowIso
            })),
            ensureCollectionSeeded('channels_meta', 'channels', db, initialPaymentChannels, (ch, idx) => ({
              ...ch,
              id: String(ch.id),
              order: idx + 1,
              updatedAt: nowIso
            })),
            ensureCollectionSeeded('staff_meta', 'staff', staffDb, initialStaffAccounts, (stf) => ({
              ...stf,
              id: String(stf.id),
              phone: stf.phone || ''
            })),
            ensureCollectionSeeded('owners_meta', 'quick_hisab_owners', db, initialQuickHisabOwners, (owner) => ({
              ...owner,
              id: String(owner.id)
            })),
            ensureCollectionSeeded('users_meta', 'users', db, initialAppUsers, (u) => ({
              ...u,
              id: String(u.id),
              role: u.role || 'user',
              status: u.status || 'active'
            }))
          ]);
          if (results.every(Boolean)) {
            safeStorage.setItem('protyasha_db_seeded_v1', '1');
          }
        } catch (err) {
          console.warn('Initial database bootstrap error:', err);
        }
      };

      void bootstrapNewDatabase();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const [{ db, staffDb }, { collection, doc, getDoc, getDocs }] = await Promise.all([
        loadFirebase(),
        loadFirestore()
      ]);
      const [
        txSnap,
        staffSnap,
        channelSnap,
        bannerSnap,
        ownerSnap,
        notifSnap,
        serviceSnap,
        footerSnap,
        adminSnap,
        auditSnap,
        ticketsSnap,
        attendanceSnap
      ] = await Promise.all([
        getDocs(collection(db, 'transactions')),
        getDocs(collection(staffDb, 'staff')),
        getDocs(collection(db, 'channels')),
        getDocs(collection(db, 'banners')),
        getDocs(collection(db, 'quick_hisab_owners')),
        getDoc(doc(db, 'settings', 'broadcast_notifications')),
        getDoc(doc(db, 'settings', 'service_control')),
        getDoc(doc(db, 'settings', 'footer_config')),
        getDoc(doc(db, 'settings', 'admin_profile')),
        getDoc(doc(db, 'settings', 'audit_logs')),
        getDocs(collection(db, 'support_tickets')),
        getDocs(collection(db, 'staff_attendance'))
      ]);

      const mainTxs: Transaction[] = [];
      txSnap.forEach(d => {
        const data = d.data() as Transaction;
        if (data && (data.id || d.id) && !String(data.id || d.id).startsWith('txn-init-') && data.source !== 'ay-byay') {
          mainTxs.push({ ...data, id: data.id || d.id });
        }
      });
      setTransactions(mainTxs);

      if (!staffSnap.empty) {
        const rows: StaffAccount[] = [];
        staffSnap.forEach(d => {
          const item = d.data() as StaffAccount;
          if (item && item.name) rows.push({ ...item, id: item.id || d.id });
        });
        setStaffAccounts(rows);
      }

      if (!channelSnap.empty) {
        const rows: (PaymentChannel & { order?: number })[] = [];
        channelSnap.forEach(d => {
          const item = d.data() as PaymentChannel & { order?: number };
          if (item && item.name) rows.push({ ...item, id: String(item.id || d.id) });
        });
        rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setChannels(cleanChannelLogos(rows));
      }

      if (!bannerSnap.empty) {
        const rows: BannerAd[] = [];
        bannerSnap.forEach(d => {
          const item = d.data() as BannerAd;
          if (item && item.imageUrl) rows.push({ ...item, id: String(item.id || d.id), isActive: item.isActive !== false });
        });
        rows.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
        setBanners(rows);
      }

      if (!ownerSnap.empty) {
        const rows: QuickHisabOwner[] = [];
        ownerSnap.forEach(d => {
          const item = d.data() as QuickHisabOwner;
          if (item && item.name) rows.push({ ...item, id: String(item.id || d.id) });
        });
        setQuickHisabOwners(rows);
      }

      const ticketRows: SupportTicket[] = [];
      ticketsSnap.forEach(d => {
        const item = d.data() as SupportTicket;
        if (item && item.customerName) ticketRows.push({ ...item, id: String(item.id || d.id) });
      });
      setSupportTickets(ticketRows);

      const attendanceRows: StaffAttendanceRecord[] = [];
      attendanceSnap.forEach(d => {
        const item = d.data() as StaffAttendanceRecord;
        if (item && item.staffId && item.date) attendanceRows.push({ ...item, id: String(item.id || d.id) });
      });
      setAttendanceRecords(attendanceRows);

      if (notifSnap.exists() && Array.isArray(notifSnap.data()?.list)) {
        const cleanedCloud = cleanDemoNotifications(notifSnap.data().list);
        setNotifications(prev => mergeCloudAndLocalNotifications(cleanedCloud, prev));
      }
      if (serviceSnap.exists() && serviceSnap.data()?.statuses) {
        setServiceStatuses(prev => ({ ...prev, ...serviceSnap.data().statuses }));
      }
      if (footerSnap.exists() && footerSnap.data()?.config) {
        setFooterConfig(footerSnap.data().config);
      }
      if (adminSnap.exists()) {
        const ap = adminSnap.data();
        const serverAvatar =
          typeof ap.avatarUrl === 'string' && ap.avatarUrl && !ap.avatarUrl.startsWith('/uploads/')
            ? ap.avatarUrl
            : '';
        if (serverAvatar) {
          setAdminAvatar(serverAvatar);
        }
        if (ap.name || serverAvatar) {
          setUser(prev => {
            if (!prev || prev.role !== 'admin') return prev;
            return {
              ...prev,
              name: ap.name || prev.name,
              phone: ap.phone || prev.phone,
              avatarUrl: serverAvatar || prev.avatarUrl
            };
          });
        }
      }
      if (auditSnap.exists() && Array.isArray(auditSnap.data()?.logs)) {
        setAuditLogs(auditSnap.data().logs);
      }
    } catch {}
  }, []);

  const handleUpdateAdminProfile = async (name: string, avatarUrl: string) => {
    const cleanAvatar = avatarUrl && !avatarUrl.startsWith('/uploads/') ? avatarUrl : '';
    const nowIso = new Date().toISOString();
    setAdminAvatar(cleanAvatar);
    if (cleanAvatar) {
      if (cleanAvatar.startsWith('data:image/')) {
        savePersistentImage('avatar_admin', cleanAvatar);
      }
      safeStorage.setItem('protyasha_admin_avatar', cleanAvatar);
      safeStorage.setItem('protyasha_last_avatar', cleanAvatar);
    }
    if (user?.role === 'admin') {
      const updatedUser = { ...user, name, avatarUrl: cleanAvatar };
      setUser(updatedUser);
      safeStorage.setItem('protyasha_user', JSON.stringify(updatedUser));
    }
    const adminProfilePayload = {
      name,
      phone: user?.phone || '01777877207',
      avatarUrl: cleanAvatar,
      updatedAt: nowIso
    };
    await cloudSet(['settings', 'admin_profile'], adminProfilePayload, { merge: true }).catch(() => {});
    if (user?.id) {
      await cloudSet(
        ['users', user.id],
        {
          id: user.id,
          name,
          phone: user.phone || '01777877207',
          ...(cleanAvatar ? { avatarUrl: cleanAvatar } : {}),
          role: 'admin',
          status: 'active',
          updatedAt: nowIso
        },
        { merge: true }
      ).catch(() => {});
    }
  };

  const handleUpdateUserProfile = async (updatedData: {
    name: string;
    phone: string;
    pin?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'অনুগ্রহ করে প্রথমে লগইন করুন' };

    try {
      const nowIso = new Date().toISOString();
      const targetId = user.id || (user.role === 'admin' ? 'admin-master' : 'usr_' + Date.now());
      const resolvedAvatar =
        updatedData.avatarUrl !== undefined
          ? updatedData.avatarUrl
          : (user.avatarUrl || (user.role === 'admin' ? adminAvatar : '') || '');
      const cleanAvatar = resolvedAvatar && !resolvedAvatar.startsWith('/uploads/') ? resolvedAvatar : '';

      const userData = {
        id: targetId,
        name: updatedData.name,
        phone: updatedData.phone,
        ...(updatedData.pin ? { pin: updatedData.pin } : {}),
        ...(cleanAvatar ? { avatarUrl: cleanAvatar } : {}),
        ...(user.role === 'sub-admin' && user.permissions ? { permissions: user.permissions } : {}),
        role: user.role,
        status: 'active' as const,
        updatedAt: nowIso
      };

      await cloudSet(['users', targetId], userData, { merge: true });

      if (user.role === 'staff' && updatedData.pin) {
        const matchedStaff = findMatchedStaffForUser(user, staffAccounts);
        await syncStaffPinEverywhere({
          staffId: matchedStaff?.id || targetId,
          phone: updatedData.phone || user.phone || '',
          newPin: updatedData.pin
        }).catch(() => {});
      }

      // Critical: For Admin accounts, also persist to settings/admin_profile so all devices & logins sync in real time
      if (user.role === 'admin') {
        await cloudSet(
          ['settings', 'admin_profile'],
          {
            name: updatedData.name,
            phone: updatedData.phone || '01777877207',
            avatarUrl: cleanAvatar,
            updatedAt: nowIso
          },
          { merge: true }
        );
      }

      saveStoredUser(userData as any);

      // If phone number changed, transfer single-device lock to the new phone number
      if (updatedData.phone && updatedData.phone !== user.phone) {
        const { releaseDeviceSession, claimDeviceSession } = await loadDeviceSession();
        await releaseDeviceSession(user).catch(() => {});
        await claimDeviceSession({
          id: targetId,
          phone: updatedData.phone,
          role: user.role,
          name: updatedData.name
        }).catch(() => {});
      }

      // Update Active Session User State
      const updatedSession: UserSession = {
        ...user,
        id: targetId,
        name: updatedData.name,
        phone: updatedData.phone,
        avatarUrl: cleanAvatar || user.avatarUrl,
        ...(user.role === 'sub-admin' && user.permissions ? { permissions: user.permissions } : {})
      };
      setUser(updatedSession);
      safeStorage.setItem('protyasha_user', JSON.stringify(updatedSession));
      safeStorage.setItem('protyasha_last_phone', updatedData.phone);

      if (cleanAvatar) {
        safeStorage.setItem('protyasha_last_avatar', cleanAvatar);
        if (user.role === 'admin') {
          setAdminAvatar(cleanAvatar);
          if (cleanAvatar.startsWith('data:image/')) {
            savePersistentImage('avatar_admin', cleanAvatar);
          }
          safeStorage.setItem('protyasha_admin_avatar', cleanAvatar);
        } else {
          if (cleanAvatar.startsWith('data:image/')) {
            savePersistentImage(`avatar_user_${targetId}`, cleanAvatar);
          }
        }
      }

      logAction('Updated Profile', 'প্রোফাইল ও পাসওয়ার্ড পরিবর্তন', `${updatedData.name} (${updatedData.phone})`);
      return { success: true };
    } catch (err: any) {
      console.error('Profile update error:', err);
      return { success: false, message: err.message || 'সার্ভারে সংরক্ষণ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' };
    }
  };

  const handleBindMethods = async (data: { phone?: string; gmail?: string; pin?: string }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'লগইন প্রয়োজন' };
    try {
      const targetId = user.id || (user.role === 'admin' ? 'admin-primary' : 'usr_' + Date.now());
      const boundMethods = Array.from(new Set([...(user.boundMethods || []), ...(data.phone ? ['phone' as const] : []), ...(data.gmail ? ['gmail' as const] : [])]));
      
      const updates: any = {
        id: targetId,
        name: user.name || '',
        role: user.role || 'user',
        status: 'active',
        ...data,
        boundMethods,
        updatedAt: new Date().toISOString()
      };

      await cloudSet(['users', targetId], updates, { merge: true });

      const updatedSession: UserSession = { ...user, ...updates };
      setUser(updatedSession);
      safeStorage.setItem('protyasha_user', JSON.stringify(updatedSession));
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // Modals & Navigation: selectedTransaction opens full page!
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [initialEntryMethod, setInitialEntryMethod] = useState<string>('নগদ');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingNotification, setEditingNotification] = useState<NotificationItem | null>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isFooterSettingsOpen, setIsFooterSettingsOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [isBannerManagerOpen, setIsBannerManagerOpen] = useState(false);
  const [isChannelManagerOpen, setIsChannelManagerOpen] = useState(false);
  const [isStaffManagerOpen, setIsStaffManagerOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [prayerInitialView, setPrayerInitialView] = useState<'daily' | 'ramadan'>('daily');
  const [isQuickHisabOpen, setIsQuickHisabOpen] = useState(false);
  const [isSupportTicketsOpen, setIsSupportTicketsOpen] = useState(false);
  const [isStaffAttendanceOpen, setIsStaffAttendanceOpen] = useState(false);
  const [isLaunchingAyByay, setIsLaunchingAyByay] = useState(false);
  const [isLaunchingBillManager, setIsLaunchingBillManager] = useState(false);

  // Active External / Sub-Portal (Bill Management Pro & Income-Expense Accounts)
  const [activePortal, setActivePortal] = useState<'bill-manager' | 'ay-byay' | null>(null);

  // Active Real User District State (Defaults stably to preferred or Jamalpur HQ)
  const [currentDistrict, setCurrentDistrict] = useState<DistrictInfo>(() => {
    try {
      const savedName = safeStorage.getItem('protyasha_weather_district_bn');
      if (savedName && savedName !== DEFAULT_BOOT_DISTRICT.nameBn) {
        return { ...DEFAULT_BOOT_DISTRICT, nameBn: savedName };
      }
    } catch {}
    return DEFAULT_BOOT_DISTRICT;
  });

  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Method Filter
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string | null>(null);

  // Delete Transaction Confirmation State
  const [deleteTrx, setDeleteTrx] = useState<Transaction | null>(null);

  // Cache of live fetched prayer timings per district-day so 30s fasting checks stay instant & accurate
  const liveTimingsCacheRef = useRef<{ key: string; timings: PrayerTimings } | null>(null);

  // In-app toast for Sehri/Iftar reminder or permission notices
  const [appToast, setAppToast] = useState<{ title: string; body?: string; tone?: 'emerald' | 'amber' } | null>(null);

  const showAppToast = useCallback((title: string, body?: string, tone: 'emerald' | 'amber' = 'emerald', durationMs: number = 6000) => {
    setAppToast({ title, body, tone });
    setTimeout(() => {
      setAppToast(prev => (prev?.title === title ? null : prev));
    }, durationMs);
  }, []);

  // Push a device-local notification (e.g., Sehri & Iftar timetable for user's own district) without polluting global cloud broadcasts
  const handlePushLocalNotification = useCallback((notif: NotificationItem) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== notif.id);
      const next = [notif, ...filtered].slice(0, 80);
      try {
        safeStorage.setItem('protyasha_notifications', JSON.stringify(next));
      } catch {}
      return next;
    });
    sounds.playSuccess();
    const firstLine = (notif.bodyBn || '').split('\n')[0] || notif.titleBn;
    showAppToast(notif.titleBn, firstLine, 'emerald', 8000);
  }, [showAppToast]);

  // Automated Real-Time Weather, Prayer Times & Location-Based Sehri/Iftar Notification Monitoring
  useEffect(() => {
    if (!user) return;
    let isSubscribed = true;

    const runAutomatedMonitoring = async () => {
      try {
        const [{ fetchLiveWeather, detectPreciseLocation, getUserPreferredDistrict }, { checkAndGenerateWeatherNotifications }, prayerMod] =
          await Promise.all([
            import('./utils/weatherService'),
            import('./utils/weatherNotificationService'),
            import('./utils/prayerTimeService')
          ]);
        if (!isSubscribed) return;

        const preferred = getUserPreferredDistrict();
        let activeDistrict = preferred || currentDistrict;

        // Auto-detect user's real district via silent GPS or Bangladesh IP fallback if no manual district is pinned
        if (!preferred) {
          const { district } = await detectPreciseLocation(false);
          if (district && isSubscribed) {
            if (district.nameEn !== currentDistrict.nameEn) {
              setCurrentDistrict(district);
            }
            activeDistrict = district;
          }
        }

        const todayKey = `${activeDistrict.nameEn}_${new Date().toISOString().slice(0, 10)}`;
        let liveTimings: PrayerTimings | undefined =
          liveTimingsCacheRef.current?.key === todayKey ? liveTimingsCacheRef.current.timings : undefined;

        const [w, fetchedTimings] = await Promise.all([
          fetchLiveWeather().catch(() => null),
          liveTimings ? Promise.resolve(liveTimings) : prayerMod.fetchLivePrayerTimes(activeDistrict).catch(() => null)
        ]);

        if (fetchedTimings) {
          liveTimings = fetchedTimings;
          liveTimingsCacheRef.current = { key: todayKey, timings: fetchedTimings };
        }

        if (!isSubscribed) return;
        if (w) setWeatherData(w);

        let toastToTrigger: NotificationItem | null = null;
        setNotifications(prevNotifications => {
          let working = prevNotifications;
          let newlyAdded: NotificationItem | null = null;

          // 1. Weather Notifications (user's own district)
          if (w) {
            const weatherRes = checkAndGenerateWeatherNotifications(w, working);
            working = weatherRes.updatedNotifications;
            if (weatherRes.newlyAdded) newlyAdded = weatherRes.newlyAdded;
          }

          // 2. Prayer Times & Sunrise/Sunset Notifications (user's own district)
          const prayerRes = prayerMod.checkAndGeneratePrayerNotifications(activeDistrict, working);
          working = prayerRes.updatedNotifications;
          if (prayerRes.newlyAdded) newlyAdded = prayerRes.newlyAdded;

          // 3. Daily & Pre-Time Sehri/Iftar Schedule Notifications (strictly for user's own district)
          const fastingEnabled = prayerMod.isFastingReminderEnabled();
          const fastingRes = prayerMod.checkAndGenerateFastingReminders(activeDistrict, working, fastingEnabled, liveTimings);
          working = fastingRes.updatedNotifications;
          if (fastingRes.newlyAdded) {
            newlyAdded = fastingRes.newlyAdded;
            toastToTrigger = fastingRes.newlyAdded;
          }

          if (newlyAdded) {
            const trimmed = working.slice(0, 80);
            try {
              safeStorage.setItem('protyasha_notifications', JSON.stringify(trimmed));
            } catch (e) {
              console.warn('LocalStorage limit reached for notifications:', e);
            }
            if (newlyAdded.type === 'alert') {
              sounds.playSuccess();
            }
            return trimmed;
          }
          return prevNotifications;
        });

        if (toastToTrigger) {
          const item = toastToTrigger as NotificationItem;
          const summaryLine = item.sehriIftarData
            ? `সেহরি শেষ: ${item.sehriIftarData.sehriEndBn} · ইফতার: ${item.sehriIftarData.iftarBn}`
            : (item.bodyBn || '').split('\n')[0];
          showAppToast(item.titleBn, summaryLine, 'emerald', 8000);
        }
      } catch (err) {
        console.warn('Automated monitoring background error:', err);
      }
    };

    // Defer initial monitoring so app launch & first paint are instant
    const initialTimer = setTimeout(runAutomatedMonitoring, 2600);
    // Check periodically in background
    const interval = setInterval(runAutomatedMonitoring, 5 * 60 * 1000);
    return () => {
      isSubscribed = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [Boolean(user), currentDistrict.nameEn, showAppToast]);

  // Dedicated 30-second Sehri & Iftar Real-Time Reminder Scheduler (30m, 10m, Iftar time & Daily timetable)
  useEffect(() => {
    if (!user) return;
    const checkFastingReminder = async () => {
      const [{ getUserPreferredDistrict }, prayerMod] = await Promise.all([
        import('./utils/weatherService'),
        import('./utils/prayerTimeService')
      ]);
      const enabled = prayerMod.isFastingReminderEnabled();
      if (!enabled) return;

      const activeDistrict = getUserPreferredDistrict() || currentDistrict;
      const todayKey = `${activeDistrict.nameEn}_${new Date().toISOString().slice(0, 10)}`;
      let liveTimings: PrayerTimings | undefined =
        liveTimingsCacheRef.current?.key === todayKey ? liveTimingsCacheRef.current.timings : undefined;

      if (!liveTimings) {
        try {
          const fetched = await prayerMod.fetchLivePrayerTimes(activeDistrict);
          if (fetched) {
            liveTimings = fetched;
            liveTimingsCacheRef.current = { key: todayKey, timings: fetched };
          }
        } catch {}
      }

      setNotifications(prev => {
        const { updatedNotifications, newlyAdded } = prayerMod.checkAndGenerateFastingReminders(
          activeDistrict,
          prev,
          enabled,
          liveTimings
        );
        if (newlyAdded) {
          const trimmed = updatedNotifications.slice(0, 80);
          try {
            safeStorage.setItem('protyasha_notifications', JSON.stringify(trimmed));
          } catch {}
          sounds.playSuccess();
          const summaryLine = newlyAdded.sehriIftarData
            ? `সেহরি শেষ: ${newlyAdded.sehriIftarData.sehriEndBn} · ইফতার: ${newlyAdded.sehriIftarData.iftarBn}`
            : newlyAdded.bodyBn.split('\n')[0];
          showAppToast(newlyAdded.titleBn, summaryLine, 'emerald', 10000);
          return trimmed;
        }
        return prev;
      });
    };

    const initialCheck = setTimeout(() => { void checkFastingReminder(); }, 3200);
    const interval = setInterval(() => { void checkFastingReminder(); }, 30 * 1000);
    const handleSettingChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail?.enabled) {
        void checkFastingReminder();
      }
    };
    window.addEventListener('fasting-reminder-setting-changed', handleSettingChange);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      window.removeEventListener('fasting-reminder-setting-changed', handleSettingChange);
    };
  }, [Boolean(user), currentDistrict, showAppToast]);

  // Handle manual or automatic app update check & trigger notification only once per genuine new update
  const handleUpdateCheckResult = useCallback(
    async (res: UpdateCheckResult, isBackgroundCheck: boolean = false) => {
      if (res.status === 'update_available') {
        const {
          buildUpdateNotificationItem,
          hasUpdateBeenNotified,
          markUpdateNotified
        } = await import('./utils/appVersion');

        if (isBackgroundCheck && hasUpdateBeenNotified(res)) {
          return;
        }

        const updateNotif = buildUpdateNotificationItem(res);
        setNotifications(prev => {
          if (prev.some(n => n.id === updateNotif.id)) return prev;
          const next = [updateNotif, ...prev];
          try {
            safeStorage.setItem('protyasha_notifications', JSON.stringify(next));
          } catch {}
          return next;
        });

        const firstFeature = lang === 'bn'
          ? (res.releaseInfo.featuresBn[0] || res.releaseInfo.titleBn)
          : (res.releaseInfo.featuresEn[0] || res.releaseInfo.titleEn);

        showAppToast(
          lang === 'bn'
            ? `নতুন অ্যাপ আপডেট পাওয়া গেছে (v${res.latestVersion})`
            : `New App Update Available (v${res.latestVersion})`,
          firstFeature,
          'amber',
          8000
        );

        markUpdateNotified(res);

        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          try {
            new Notification(updateNotif.titleBn, {
              body: firstFeature
            });
          } catch {}
        }
      } else if (!isBackgroundCheck && res.status === 'up_to_date') {
        showAppToast(
          lang === 'bn'
            ? `আপনার অ্যাপটি সর্বশেষ ভার্সনে (v${res.currentVersion}) রয়েছে`
            : `App is on the latest version (v${res.currentVersion})`,
          lang === 'bn' ? 'সকল নতুন ফিচার সক্রিয় রয়েছে।' : 'All latest features are active.',
          'emerald',
          4500
        );
      }
    },
    [lang, showAppToast]
  );

  // One-time startup check + Real-time Cloud Firestore listener for genuine new app updates (deferred)
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const { checkForAppUpdates } = await import('./utils/appVersion');
        const res = await checkForAppUpdates();
        if (active && res.status === 'update_available') {
          void handleUpdateCheckResult(res, true);
        }
      } catch {}
    }, 3500);

    let unsubscribeVersion: (() => void) | null = null;
    const versionTimer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db }, { doc, onSnapshot }]) => {
          if (!active) return;
          unsubscribeVersion = onSnapshot(doc(db, 'settings', 'app_version'), async (snap) => {
            if (!snap.exists()) return;
            try {
              const { buildCloudUpdateResult } = await import('./utils/appVersion');
              const res = buildCloudUpdateResult(snap.data());
              if (res) {
                void handleUpdateCheckResult(res, true);
              }
            } catch {}
          });
        })
        .catch(() => {});
    }, 1500);

    return () => {
      active = false;
      clearTimeout(timer);
      clearTimeout(versionTimer);
      if (unsubscribeVersion) unsubscribeVersion();
    };
  }, [handleUpdateCheckResult]);

  // Listen for iframe portal messages (e.g., in-app back button inside portal)
  useEffect(() => {
    const handlePortalMessage = (event: MessageEvent) => {
      if (event.data?.action === 'close_portal') {
        setActivePortal(null);
      }
    };
    window.addEventListener('message', handlePortalMessage);
    return () => window.removeEventListener('message', handlePortalMessage);
  }, []);

  // Real-time synchronization for staffAccounts from Ay-Byay payroll deductions
  useEffect(() => {
    const handleStaffChanged = (event: any) => {
      if (event.detail && Array.isArray(event.detail)) {
        setStaffAccounts(event.detail);
        try {
          safeStorage.setItem('protyasha_staff', JSON.stringify(event.detail));
        } catch {}
      }
    };
    window.addEventListener('staff-data-changed', handleStaffChanged);
    return () => window.removeEventListener('staff-data-changed', handleStaffChanged);
  }, []);

  // Real-time Enforcement: Kick users out of services if they are deactivated by admin
  useEffect(() => {
    // Helper to check if a service is explicitly deactivated
    const isDeactivated = (svcId: string) => {
      if (
        user?.role === 'staff' ||
        user?.role === 'admin' ||
        isStaffSessionActive(user)
      ) {
        return false;
      }
      const s = serviceStatuses[svcId];
      if (!s) return false;
      const locked = s.isActive === false || String(s.isActive) === 'false';
      return locked;
    };

    // Force check all entry points
    if (activePortal === 'bill-manager' && isDeactivated('billManager')) {
      setActivePortal(null);
      setActiveServiceNotice({
        name: 'বিল ম্যানেজমেন্ট প্রো',
        title: serviceStatuses.billManager?.title,
        message: serviceStatuses.billManager?.customMessage,
        logoUrl: serviceStatuses.billManager?.logoUrl
      });
    }
    if (activePortal === 'ay-byay' && isDeactivated('ayByay')) {
      setActivePortal(null);
      setActiveServiceNotice({
        name: 'আয়-ব্যয় হিসাব',
        title: serviceStatuses.ayByay?.title,
        message: serviceStatuses.ayByay?.customMessage,
        logoUrl: serviceStatuses.ayByay?.logoUrl
      });
    }
    if (activeTab === 'transactions' && isDeactivated('transactions')) {
      setActiveTab('home');
      setActiveServiceNotice({
        name: 'সকল লেনদেন ও স্টেটমেন্ট',
        title: serviceStatuses.transactions?.title,
        message: serviceStatuses.transactions?.customMessage,
        logoUrl: serviceStatuses.transactions?.logoUrl
      });
    }
    if (activeTab === 'ledger' && isDeactivated('ledger')) {
      setActiveTab('home');
      setActiveServiceNotice({
        name: 'অডিট ও রিপোর্ট খাতা',
        title: serviceStatuses.ledger?.title,
        message: serviceStatuses.ledger?.customMessage,
        logoUrl: serviceStatuses.ledger?.logoUrl
      });
    }
    if (isStaffManagerOpen && isDeactivated('staffManager')) {
      setIsStaffManagerOpen(false);
      setActiveServiceNotice({
        name: 'স্টাফ কালেকশন ও কোম্পানি পাওনা',
        title: serviceStatuses.staffManager?.title,
        message: serviceStatuses.staffManager?.customMessage,
        logoUrl: serviceStatuses.staffManager?.logoUrl
      });
    }
    if (isQuickHisabOpen && isDeactivated('quickHisab')) {
      setIsQuickHisabOpen(false);
      setActiveServiceNotice({
        name: 'কুইক হিসাব ও লভ্যাংশ বণ্টন',
        title: serviceStatuses.quickHisab?.title,
        message: serviceStatuses.quickHisab?.customMessage,
        logoUrl: serviceStatuses.quickHisab?.logoUrl
      });
    }
    if (isSupportTicketsOpen && isDeactivated('supportTickets')) {
      setIsSupportTicketsOpen(false);
      setActiveServiceNotice({
        name: 'সাপোর্ট টিকেট ও কমপ্লেইন',
        title: serviceStatuses.supportTickets?.title,
        message: serviceStatuses.supportTickets?.customMessage,
        logoUrl: serviceStatuses.supportTickets?.logoUrl
      });
    }
    if (isStaffAttendanceOpen && isDeactivated('staffAttendance')) {
      setIsStaffAttendanceOpen(false);
      setActiveServiceNotice({
        name: 'স্টাফ হাজিরা ও ছুটি',
        title: serviceStatuses.staffAttendance?.title,
        message: serviceStatuses.staffAttendance?.customMessage,
        logoUrl: serviceStatuses.staffAttendance?.logoUrl
      });
    }
  }, [user, serviceStatuses, activePortal, activeTab, isStaffManagerOpen, isQuickHisabOpen, isSupportTicketsOpen, isStaffAttendanceOpen]);

  // Real-time RBAC Enforcement: Immediately close restricted views if role or Sub-Admin permissions change
  useEffect(() => {
    if (!user) return;

    if (!canAddTransactions(user) && isEntryModalOpen) {
      setIsEntryModalOpen(false);
      setEditingTransaction(null);
    }

    if (user.role === 'staff') {
      if (isRecycleBinOpen) setIsRecycleBinOpen(false);
      if (isUserManagementOpen) setIsUserManagementOpen(false);
      if (isBannerManagerOpen) setIsBannerManagerOpen(false);
      if (isChannelManagerOpen) setIsChannelManagerOpen(false);
      if (isFooterSettingsOpen) setIsFooterSettingsOpen(false);
      if (isServiceManagerOpen) setIsServiceManagerOpen(false);
      if (isPopupNoticeManagerOpen) setIsPopupNoticeManagerOpen(false);
      if (isDriveBackupOpen) setIsDriveBackupOpen(false);
    } else if (user.role === 'sub-admin') {
      if (activeTab === 'transactions' && !hasSubAdminPermission(user, 'transactions')) setActiveTab('home');
      if (activeTab === 'ledger' && !hasSubAdminPermission(user, 'ledger')) setActiveTab('home');
      if (activePortal === 'ay-byay' && !hasSubAdminPermission(user, 'ayByay')) setActivePortal(null);
      if (activePortal === 'bill-manager' && !hasSubAdminPermission(user, 'billManager')) setActivePortal(null);
      if (isQuickHisabOpen && !hasSubAdminPermission(user, 'quickHisab')) setIsQuickHisabOpen(false);
      if (isStaffManagerOpen && !hasSubAdminPermission(user, 'staffManager')) setIsStaffManagerOpen(false);
      if (isSupportTicketsOpen && !hasSubAdminPermission(user, 'supportTickets')) setIsSupportTicketsOpen(false);
      if (isStaffAttendanceOpen && !hasSubAdminPermission(user, 'staffAttendance')) setIsStaffAttendanceOpen(false);
    }
  }, [
    user,
    activePortal,
    activeTab,
    isStaffManagerOpen,
    isQuickHisabOpen,
    isSupportTicketsOpen,
    isEntryModalOpen,
    isStaffAttendanceOpen,
    isUserManagementOpen,
    isRecycleBinOpen,
    isServiceManagerOpen,
    isPopupNoticeManagerOpen,
    isBannerManagerOpen,
    isChannelManagerOpen,
    isFooterSettingsOpen,
    isDriveBackupOpen,
    isChangePinOpen
  ]);

  // -------------------------------------------------------------
  // AUTO-SYNC MAIN-PAGE STAFF SESSION (ZERO EXTRA PIN ANYWHERE)
  // -------------------------------------------------------------
  useEffect(() => {
    syncMainLoginStaffSession(user, staffAccounts);
  }, [user, staffAccounts]);

  // -------------------------------------------------------------
  // UNIVERSAL DEVICE HARDWARE / BROWSER BACK BUTTON SUPPORT
  // -------------------------------------------------------------
  const isNavigatingBackRef = useRef(false);
  const isPrayerSubViewActiveRef = useRef(false);
  const isSupportSubViewActiveRef = useRef(false);
  const isAttendanceSubViewActiveRef = useRef(false);
  const isStaffManagerSubViewActiveRef = useRef(false);
  const isUserMgmtSubViewActiveRef = useRef(false);
  const isQuickHisabSubViewActiveRef = useRef(false);
  const isProfileSubViewActiveRef = useRef(false);
  const isWeatherSubViewActiveRef = useRef(false);
  const isDriveBackupSubViewActiveRef = useRef(false);
  const isBannerSubViewActiveRef = useRef(false);
  const isLoginSubViewActiveRef = useRef(false);
  const isPopupManagerSubViewActiveRef = useRef(false);

  const pushHistoryStep = useCallback(() => {
    if (!isNavigatingBackRef.current) {
      try {
        window.history.pushState({ appOverlay: true, time: Date.now() }, '');
      } catch {}
    }
  }, []);

  const closeOverlayViaBack = useCallback((fallbackClose: () => void) => {
    if (!isNavigatingBackRef.current) {
      try {
        if (
          window.history.state?.appOverlay ||
          window.history.state?.appSubView ||
          window.history.state?.ayByayPortal ||
          window.history.state?.billManagerPortal
        ) {
          window.history.back();
          return;
        }
      } catch {}
    }
    fallbackClose();
  }, []);

  // Initialize browser history on mount
  useEffect(() => {
    try {
      window.history.replaceState({ appRoot: true }, '');
    } catch {}
  }, []);

  // Use a stateRef to always read live states in popstate without stale closure or missing dependencies
  const stateRef = useRef({
    publicTrackTicketId,
    deleteTrx,
    user,
    activePortal,
    isUserManagementOpen,
    selectedNotificationDetail,
    receiptTransaction,
    isEntryModalOpen,
    isBannerManagerOpen,
    isChannelManagerOpen,
    isStaffManagerOpen,
    isRecycleBinOpen,
    isAuditLogOpen,
    isChangePinOpen,
    isFooterSettingsOpen,
    isWeatherOpen,
    isPrayerTimesOpen,
    isNotificationsOpen,
    isProfileOpen,
    selectedTransaction,
    isLoginOpen,
    activeTab,
    activeServiceNotice,
    isQuickHisabOpen,
    isServiceManagerOpen,
    isDriveBackupOpen,
    isSupportTicketsOpen,
    isStaffAttendanceOpen,
    isPopupNoticeManagerOpen,
    previewPopupNotice
  });

  stateRef.current = {
    publicTrackTicketId,
    deleteTrx,
    user,
    activePortal,
    isUserManagementOpen,
    selectedNotificationDetail,
    receiptTransaction,
    isEntryModalOpen,
    isBannerManagerOpen,
    isChannelManagerOpen,
    isStaffManagerOpen,
    isRecycleBinOpen,
    isAuditLogOpen,
    isChangePinOpen,
    isFooterSettingsOpen,
    isWeatherOpen,
    isPrayerTimesOpen,
    isNotificationsOpen,
    isProfileOpen,
    selectedTransaction,
    isLoginOpen,
    activeTab,
    activeServiceNotice,
    isQuickHisabOpen,
    isServiceManagerOpen,
    isDriveBackupOpen,
    isSupportTicketsOpen,
    isStaffAttendanceOpen,
    isPopupNoticeManagerOpen,
    previewPopupNotice
  };

  // Popstate Listener: Handlers respond to device hardware/browser back button in strict LIFO order
  useEffect(() => {
    const releaseBackLock = () => {
      setTimeout(() => {
        isNavigatingBackRef.current = false;
      }, 50);
    };

    const handlePopState = () => {
      isNavigatingBackRef.current = true;
      const s = stateRef.current;

      const hState = window.history.state || {};

      // Close top-most layer first (respecting any active inner sub-view inside modals/portals)
      if (s.publicTrackTicketId) {
        isPublicPreviewOverlayRef.current = false;
        setPublicTrackTicketId(null);
      } else if (s.previewPopupNotice) {
        setPreviewPopupNotice(null);
      } else if (s.deleteTrx) {
        setDeleteTrx(null);
      } else if (s.activeServiceNotice) {
        setActiveServiceNotice(null);
      } else if (s.activePortal) {
        // If we are in AyByay or BillManager native portal and history is still inside portal stack, let portal unwind first
        if (s.activePortal === 'ay-byay' && hState && hState.ayByayPortal) {
          releaseBackLock();
          return;
        }
        if (s.activePortal === 'bill-manager' && hState && hState.billManagerPortal) {
          releaseBackLock();
          return;
        }
        setActivePortal(null);
      } else if (s.isUserManagementOpen) {
        if (isUserMgmtSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsUserManagementOpen(false);
      } else if (s.isDriveBackupOpen) {
        if (isDriveBackupSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsDriveBackupOpen(false);
      } else if (s.selectedNotificationDetail) {
        setSelectedNotificationDetail(null);
      } else if (s.receiptTransaction) {
        setReceiptTransaction(null);
      } else if (s.isEntryModalOpen) {
        setIsEntryModalOpen(false);
        setEditingTransaction(null);
      } else if (s.isBannerManagerOpen) {
        if (isBannerSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsBannerManagerOpen(false);
      } else if (s.isChannelManagerOpen) {
        setIsChannelManagerOpen(false);
      } else if (s.isStaffManagerOpen) {
        if (isStaffManagerSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsStaffManagerOpen(false);
      } else if (s.isServiceManagerOpen) {
        setIsServiceManagerOpen(false);
      } else if (s.isPopupNoticeManagerOpen) {
        if (isPopupManagerSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsPopupNoticeManagerOpen(false);
      } else if (s.isRecycleBinOpen) {
        setIsRecycleBinOpen(false);
      } else if (s.isAuditLogOpen) {
        setIsAuditLogOpen(false);
      } else if (s.isChangePinOpen) {
        setIsChangePinOpen(false);
      } else if (s.isFooterSettingsOpen) {
        setIsFooterSettingsOpen(false);
      } else if (s.isWeatherOpen) {
        if (isWeatherSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsWeatherOpen(false);
      } else if (s.isQuickHisabOpen) {
        if (isQuickHisabSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsQuickHisabOpen(false);
      } else if (s.isSupportTicketsOpen) {
        if (isSupportSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsSupportTicketsOpen(false);
      } else if (s.isStaffAttendanceOpen) {
        if (isAttendanceSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsStaffAttendanceOpen(false);
      } else if (s.isPrayerTimesOpen) {
        if (isPrayerSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsPrayerTimesOpen(false);
      } else if (s.isNotificationsOpen) {
        setIsNotificationsOpen(false);
        setEditingNotification(null);
      } else if (s.isProfileOpen) {
        if (isProfileSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setIsProfileOpen(false);
      } else if (s.selectedTransaction) {
        setSelectedTransaction(null);
      } else if (s.isLoginOpen) {
        if (isLoginSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        // If user is logged out (!user), DO NOT close login view into visitor mode!
        if (isLoggedInSession(s.user)) {
          setIsLoginOpen(false);
        } else {
          // Keep user locked on the login page
          try {
            window.history.pushState({ screen: 'login' }, '', window.location.pathname);
          } catch {}
        }
      } else if (s.activeTab !== 'home') {
        if (s.activeTab === 'profile' && isProfileSubViewActiveRef.current) {
          releaseBackLock();
          return;
        }
        setActiveTab('home');
      }

      releaseBackLock();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Universal Scroll-to-Top: Whenever navigating between tabs, opening a transaction card, portals, or full-page modals
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab, selectedTransaction, activePortal, isPrayerTimesOpen, isWeatherOpen, isNotificationsOpen, isProfileOpen, publicTrackTicketId]);

  // Apply Theme & Lang to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeStorage.setItem('protyasha_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-lang', lang);
    safeStorage.setItem('protyasha_lang', lang);
  }, [lang]);

  // Real-time Cloud Synchronization with Google Cloud Firestore (active once logged in, non-blocking boot)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubscribeTransactions: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { collection, onSnapshot }]) => {
          if (!active) return;
          const q = collection(db, 'transactions');
          unsubscribeTransactions = onSnapshot(q, (snapshot) => {
            const cloudTxs: Transaction[] = [];
            snapshot.forEach(docSnap => {
              const data = docSnap.data() as Transaction;
              const docId = data?.id || docSnap.id;
              if (data && docId && !String(docId).startsWith('txn-init-')) {
                cloudTxs.push({ ...data, id: String(docId) });
              }
            });

            // Separate main dashboard transactions (preserve isDeleted: true for RecycleBin sync)
            const mainTxs = cloudTxs.filter(t => t.source !== 'ay-byay');
            const activeMainTxs = mainTxs.filter(t => !t.isDeleted && (t as any).isDeleted !== 'true');
            setTransactions(mainTxs);

            // Compute totals from active non-deleted collection for Dashboard Balance Card
            const income = activeMainTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
            const expense = activeMainTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

            setServerTotals({
              income,
              expense,
              balance: income - expense,
              totalCount: activeMainTxs.length
            });
            setHasMoreTransactions(activeMainTxs.length > 50);

            // Sync to safeStorage
            try {
              safeStorage.setItem('protyasha_transactions', JSON.stringify(mainTxs));
            } catch {}
          }, (err) => {
            handleFirestoreError(err, OperationType.LIST, 'transactions');
          });
        })
        .catch((e) => {
          console.warn('Transaction collection listener error:', e);
        });
    }, 30);

    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [Boolean(user), userKey]);

  // Real-time listeners for settings documents (deferred non-blockingly after initial paint)
  useEffect(() => {
    let active = true;
    let unsubServices: (() => void) | null = null;
    let unsubFooter: (() => void) | null = null;
    let unsubAdminProfile: (() => void) | null = null;

    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { doc, onSnapshot }]) => {
          if (!active) return;
          try {
            unsubServices = onSnapshot(
              doc(db, 'settings', 'service_control'),
              (snapshot) => {
                if (!snapshot.exists()) return;
                const data = snapshot.data();
                if (data && typeof data.statuses === 'object' && Object.keys(data.statuses).length > 0) {
                  setServiceStatuses(prev => {
                    const merged: Record<string, ServiceStatusConfig> = { ...prev };
                    Object.keys(data.statuses).forEach(key => {
                      const incoming = data.statuses[key];
                      const fallbackLogo = key === 'ayByay' ? 'https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png' : key === 'billManager' ? 'https://bill-manager.ai.studio/logo.jpg' : '';
                      merged[key] = {
                        ...merged[key],
                        ...incoming,
                        logoUrl: incoming?.logoUrl || merged[key]?.logoUrl || fallbackLogo
                      };
                    });
                    try {
                      safeStorage.setItem('protyasha_service_statuses', JSON.stringify(merged));
                    } catch {}
                    return merged;
                  });
                }
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, 'settings/service_control');
              }
            );
          } catch {}

          try {
            unsubFooter = onSnapshot(
              doc(db, 'settings', 'footer_config'),
              (snapshot) => {
                if (!snapshot.exists()) return;
                const data = snapshot.data();
                if (data && data.config && Object.keys(data.config).length > 0) {
                  setFooterConfig(data.config);
                  try {
                    safeStorage.setItem('protyasha_footer', JSON.stringify(data.config));
                  } catch {}
                }
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, 'settings/footer_config');
              }
            );
          } catch {}

          try {
            unsubAdminProfile = onSnapshot(
              doc(db, 'settings', 'admin_profile'),
              (snapshot) => {
                if (!snapshot.exists()) return;
                const ap = snapshot.data();
                const serverAvatar =
                  typeof ap.avatarUrl === 'string' && ap.avatarUrl && !ap.avatarUrl.startsWith('/uploads/')
                    ? ap.avatarUrl
                    : '';
                if (serverAvatar) {
                  setAdminAvatar(serverAvatar);
                  safeStorage.setItem('protyasha_admin_avatar', serverAvatar);
                  if (serverAvatar.startsWith('data:image/')) {
                    savePersistentImage('avatar_admin', serverAvatar);
                  }
                }
                setUser(prev => {
                  if (!prev || prev.role !== 'admin') return prev;
                  const nextName = ap.name || prev.name;
                  const nextPhone = ap.phone || prev.phone;
                  const nextAvatar = serverAvatar || prev.avatarUrl;
                  if (nextName === prev.name && nextPhone === prev.phone && nextAvatar === prev.avatarUrl) {
                    return prev;
                  }
                  return {
                    ...prev,
                    name: nextName,
                    phone: nextPhone,
                    avatarUrl: nextAvatar
                  };
                });
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, 'settings/admin_profile');
              }
            );
          } catch {}
        })
        .catch(() => {});
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubServices) unsubServices();
      if (unsubFooter) unsubFooter();
      if (unsubAdminProfile) unsubAdminProfile();
    };
  }, []);

  // Notifications & Audit Logs listeners (only needed once logged in / browsing)
  useEffect(() => {
    if (!user) return;
    let active = true;
    let unsubNotifs: (() => void) | null = null;
    let unsubAudit: (() => void) | null = null;
    const timer = setTimeout(() => {
      Promise.all([loadFirebase(), loadFirestore()])
        .then(([{ db, handleFirestoreError, OperationType }, { doc, onSnapshot }]) => {
          if (!active) return;
          try {
            unsubNotifs = onSnapshot(
              doc(db, 'settings', 'broadcast_notifications'),
              (snapshot) => {
                if (!snapshot.exists()) return;
                const data = snapshot.data();
                if (Array.isArray(data.list)) {
                  const sorted = [...(data.list as NotificationItem[])].sort((a, b) => {
                    const timeA = typeof a.id === 'string' && a.id.includes('-') ? parseInt(a.id.split('-').pop() || '0', 10) : 0;
                    const timeB = typeof b.id === 'string' && b.id.includes('-') ? parseInt(b.id.split('-').pop() || '0', 10) : 0;
                    return timeB - timeA;
                  });
                  const cleaned = cleanDemoNotifications(sorted);
                  setNotifications(prev => {
                    const merged = mergeCloudAndLocalNotifications(cleaned, prev);
                    try {
                      safeStorage.setItem('protyasha_notifications', JSON.stringify(merged));
                    } catch {}
                    return merged;
                  });
                }
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, 'settings/broadcast_notifications');
              }
            );
          } catch (e) {
            console.warn('Broadcast notification listener error:', e);
          }

          try {
            unsubAudit = onSnapshot(
              doc(db, 'settings', 'audit_logs'),
              (snapshot) => {
                if (!snapshot.exists()) return;
                const data = snapshot.data();
                if (data && Array.isArray(data.logs)) {
                  setAuditLogs(data.logs);
                  try {
                    safeStorage.setItem('protyasha_audit', JSON.stringify(data.logs));
                  } catch {}
                }
              },
              (err) => {
                handleFirestoreError(err, OperationType.GET, 'settings/audit_logs');
              }
            );
          } catch {}
        })
        .catch(() => {});
    }, 600);

    return () => {
      active = false;
      clearTimeout(timer);
      if (unsubNotifs) unsubNotifs();
      if (unsubAudit) unsubAudit();
    };
  }, [Boolean(user)]);

  // Sync state to local storage with safety check (skip redundant initial hydration write)
  const isStorageSyncMountedRef = useRef(false);
  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.warn('LocalStorage limit reached for transactions:', e);
    }
  }, [transactions]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_staff', JSON.stringify(staffAccounts));
    } catch (e) {
      console.warn('LocalStorage limit reached for staffAccounts:', e);
    }
  }, [staffAccounts]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_channels', JSON.stringify(channels));
    } catch (e) {
      console.warn('LocalStorage limit reached for channels:', e);
    }
  }, [channels]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_banners', JSON.stringify(banners));
    } catch (e) {
      console.warn('LocalStorage limit reached for banners:', e);
    }
  }, [banners]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage limit reached for notifications:', e);
    }
  }, [notifications]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_footer', JSON.stringify(footerConfig));
    } catch (e) {
      console.warn('LocalStorage limit reached for footer:', e);
    }
  }, [footerConfig]);

  useEffect(() => {
    if (!isStorageSyncMountedRef.current) return;
    try {
      safeStorage.setItem('protyasha_audit', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('LocalStorage limit reached for audit logs:', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    isStorageSyncMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (user) {
      try {
        safeStorage.setItem('protyasha_user', JSON.stringify(user));
      } catch (e) {
        console.warn('LocalStorage limit reached for user session:', e);
      }
    } else {
      safeStorage.removeItem('protyasha_user');
    }
  }, [user]);

  // Accurate balance calculation: always strictly reflects active non-deleted transactions
  const totalBalance = useMemo(() => {
    return transactions
      .filter(t => !t.isDeleted && (t as any).isDeleted !== 'true')
      .reduce((acc, curr) => {
        const amt = Number(curr.amount) || 0;
        const isIncome = curr.type === 'income' || (curr as any).categoryType === 'income';
        return isIncome ? acc + amt : acc - amt;
      }, 0);
  }, [transactions]);

  // Sub-admin transaction list sees only their own entries; Admin/others keep full list view
  const transactionsForList = useMemo(() => {
    if (user?.role === 'sub-admin') {
      return transactions.filter(t => isTransactionOwner(t, user));
    }
    return transactions;
  }, [transactions, user]);

  const userDistrictSlug = (currentDistrict?.nameEn || 'dhaka').toLowerCase().replace(/[^a-z0-9]/g, '');
  const userDistrictUnderscoreSlug = (currentDistrict?.nameEn || 'dhaka').toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Map notifications with active user's read status & strictly isolate automated Sehri/Iftar, prayer & weather alerts by user's real location
  const userNotifications = notifications
    .filter(n => {
      // Isolate location-based Sehri/Iftar, prayer & weather alerts by user's real/selected district
      if (
        n.isFastingAlert ||
        n.isPrayerAlert ||
        n.isWeatherAlert ||
        n.id.startsWith('fasting_') ||
        n.id.startsWith('prayer_') ||
        n.id.startsWith('weather-') ||
        n.type === 'weather'
      ) {
        // Global alerts (sent by admin) should be visible to all users regardless of location
        if (n.isGlobal) return true;

        const targetEn = n.districtEn || n.sehriIftarData?.districtEn;
        if (targetEn) {
          const notifDistrictSlug = targetEn.toLowerCase().replace(/[^a-z0-9]/g, '');
          return notifDistrictSlug === userDistrictSlug;
        }
        const targetBn = n.districtBn || n.sehriIftarData?.districtBn;
        if (targetBn) {
          return targetBn === currentDistrict?.nameBn;
        }
        const cleanId = n.id.toLowerCase();
        return (
          cleanId.includes(`_${userDistrictSlug}_`) ||
          cleanId.includes(`_${userDistrictUnderscoreSlug}_`) ||
          cleanId.includes(`-${userDistrictSlug}-`)
        );
      }
      return true;
    })
    .map(n => ({
      ...n,
      isRead: isNotifReadForUser(n)
    }));

  const unreadNotificationsCount = userNotifications.filter(n => !n.isRead).length;

  const existingCustomers = Array.from(
    new Set(transactions.filter(t => !t.isDeleted).map(t => t.person).filter(Boolean))
  );

  // Helper to add audit log and persist to dedicated Firestore doc
  const logAction = (action: string, actionBn: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      actionBn,
      user: user?.name || 'Admin',
      details,
      time: Date.now()
    };
    const updatedLogs = [newLog, ...auditLogs].slice(0, 100);
    setAuditLogs(updatedLogs);
    cloudSet(['settings', 'audit_logs'], {
      logs: updatedLogs,
      updatedAt: new Date().toISOString()
    }).catch(() => {});
  };

  const handleSaveServiceStatuses = (updated: Record<string, ServiceStatusConfig>) => {
    setServiceStatuses(updated);
    try {
      safeStorage.setItem('protyasha_service_statuses', JSON.stringify(updated));
    } catch {}

    Object.keys(updated).forEach(svcId => {
      if (updated[svcId]?.logoUrl) {
        savePersistentImage(`service_logo_${svcId}`, updated[svcId].logoUrl!);
      }
    });

    cloudSet(['settings', 'service_control'], {
      id: 'service_control',
      statuses: updated,
      updatedAt: new Date().toISOString()
    }).catch(err => console.error('Service control sync error:', err));
  };

  const checkServiceAccess = (serviceId: string, displayName: string): boolean => {
    if (
      user?.role === 'staff' ||
      user?.role === 'admin' ||
      isStaffSessionActive(user)
    ) {
      return true;
    }

    // Sub-Admin granular permissions configured by Main Admin
    if (user?.role === 'sub-admin') {
      const subAdminMap: Record<string, SubAdminPermissionKey | undefined> = {
        transactions: 'transactions',
        ledger: 'ledger',
        billManager: 'billManager',
        ayByay: 'ayByay',
        quickHisab: 'quickHisab',
        staffManager: 'staffManager',
        staffAttendance: 'staffAttendance',
        supportTickets: 'supportTickets'
      };
      const permKey = subAdminMap[serviceId];
      if (permKey && !hasSubAdminPermission(user, permKey)) {
        sounds.playTap();
        showAppToast(
          lang === 'bn' ? 'অনুমতি সীমাবদ্ধ' : 'Access Restricted',
          lang === 'bn'
            ? `মেইন এডমিন আপনার সাব-এডমিন অ্যাকাউন্টে "${displayName}" সেবার অনুমতি চালু করেননি।`
            : `Main Admin has not enabled "${displayName}" permission for this Sub-Admin account.`,
          'amber',
          5000
        );
        return false;
      }
    }

    const status = serviceStatuses[serviceId];
    if (status && (status.isActive === false || String(status.isActive) === 'false')) {
      setActiveServiceNotice({
        name: displayName,
        title: status.title,
        message: status.customMessage,
        logoUrl: status.logoUrl
      });
      pushHistoryStep();
      return false;
    }
    return true;
  };

  // Launch Ay-Byay with smooth animated branded logo presentation
  const handleLaunchAyByay = () => {
    if (!checkServiceAccess('ayByay', 'আয়-ব্যয় হিসাব')) return;
    sounds.playTap();
    setIsLaunchingAyByay(true);
    setTimeout(() => {
      setActivePortal('ay-byay');
      pushHistoryStep();
      setIsLaunchingAyByay(false);
    }, 950);
  };

  // Launch Bill Manager with smooth animated branded presentation
  const handleLaunchBillManager = () => {
    if (!checkServiceAccess('billManager', 'বিল ম্যানেজমেন্ট প্রো')) return;
    sounds.playTap();
    setIsLaunchingBillManager(true);
    setTimeout(() => {
      try {
        window.history.pushState(
          { appOverlay: true, billManagerPortal: true, appStep: 'bm-root', view: 'dashboard', time: Date.now() },
          ''
        );
      } catch {}
      setActivePortal('bill-manager');
      setIsLaunchingBillManager(false);
    }, 950);
  };

  const saveNotificationsToCloud = (list: NotificationItem[]) => {
    // Only persist global/admin broadcasts to Firestore; per-district auto notifications stay strictly on each user's device
    const cloudBroadcasts = list.filter(n => n && !isLocalAutoNotification(n)).slice(0, 50);
    cloudSet(['settings', 'broadcast_notifications'], {
      list: cloudBroadcasts,
      updatedAt: new Date().toISOString()
    }).catch(() => {});
  };

  // Notification Broadcast by Admin
  const handleSendNotification = (data: Omit<NotificationItem, 'id' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}`,
      isRead: false,
      readBy: []
    };
    const updatedNotifications = [newNotif, ...notifications];
    setNotifications(updatedNotifications);
    logAction('Sent Notification', 'নোটিফিকেশন পাঠানো হয়েছে', `${newNotif.titleBn}`);
    sounds.playSuccess();
    saveNotificationsToCloud(updatedNotifications);

    triggerConfetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.3 }
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    const key = `protyasha_read_notifs_${userKey}`;
    const newRead = Array.from(new Set([...readNotifIds, id]));
    setReadNotifIds(newRead);
    try {
      safeStorage.setItem(key, JSON.stringify(newRead));
    } catch {}

    if (user?.id) {
      cloudSet(
        ['users', user.id],
        {
          id: user.id,
          role: user.role || 'user',
          status: 'active',
          readNotifications: newRead.slice(-450)
        },
        { merge: true }
      ).catch(() => {});
    }

    const updatedNotifications = notifications.map(n => {
      if (n.id === id) {
        const existingReadBy = Array.isArray(n.readBy) ? n.readBy : [];
        if (!existingReadBy.includes(userKey)) {
          return { ...n, readBy: [...existingReadBy, userKey] };
        }
      }
      return n;
    });
    setNotifications(updatedNotifications);
    saveNotificationsToCloud(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const key = `protyasha_read_notifs_${userKey}`;
    const newRead = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(newRead);
    try {
      safeStorage.setItem(key, JSON.stringify(newRead));
    } catch {}

    if (user?.id) {
      cloudSet(
        ['users', user.id],
        {
          id: user.id,
          role: user.role || 'user',
          status: 'active',
          readNotifications: newRead.slice(-450)
        },
        { merge: true }
      ).catch(() => {});
    }

    const updatedNotifications = notifications.map(n => {
      const existingReadBy = Array.isArray(n.readBy) ? n.readBy : [];
      if (!existingReadBy.includes(userKey)) {
        return { ...n, readBy: [...existingReadBy, userKey] };
      }
      return n;
    });
    setNotifications(updatedNotifications);
    saveNotificationsToCloud(updatedNotifications);
  };

  const handleDeleteNotification = (id: string) => {
    sounds.playTap();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    logAction('Deleted Notification', 'নোটিফিকেশন মুছে ফেলা হয়েছে', `ID: ${id}`);
    saveNotificationsToCloud(updatedNotifications);
  };

  const handleSaveEntry = (entryData: Omit<Transaction, 'id' | 'trxId' | 'created'> & { id?: string }) => {
    if (entryData.id) {
      const existing = transactions.find(t => t.id === entryData.id);
      if (existing) {
        const perm = canModifyTransaction(existing, user);
        if (!perm.allowed) {
          sounds.playTap();
          showAppToast(
            lang === 'bn' ? 'এডিট করার সময়সীমা বা অনুমতি নেই' : 'Edit Permission Denied',
            perm.expired
              ? (lang === 'bn' ? 'সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত এডিট করতে পারবেন।' : 'Sub-admin can only edit within 30 minutes.')
              : (lang === 'bn' ? 'আপনি অন্য কারো এন্ট্রি এডিট করতে পারবেন না।' : 'You can only edit your own entries.'),
            'amber'
          );
          return;
        }
      }
    } else if (!canAddTransactions(user)) {
      sounds.playTap();
      if (isLoggedInSession(user)) {
        showAppToast(
          lang === 'bn' ? 'রিড-অনলি মোড / অনুমতি নেই' : 'Read-Only / Permission Denied',
          lang === 'bn'
            ? 'আপনার অ্যাকাউন্ট দিয়ে নতুন ডেটা যোগ বা পরিবর্তন করা যাবে না।'
            : 'Your account does not have permission to add or modify records.',
          'amber',
          5000
        );
      } else {
        openLoginView();
      }
      return;
    }

    sounds.playSuccess();
    triggerConfetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 }
    });

    let updatedTransactions: Transaction[];
    let savedTrx: Transaction;
    if (entryData.id) {
      const existing = transactions.find(t => t.id === entryData.id);
      const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      const prefix = entryData.method === 'ব্যাংক' ? '765B' : '765M';
      savedTrx = {
        ...(existing || {}),
        ...entryData,
        id: entryData.id,
        trxId: existing?.trxId || `${prefix}${randomHex}`,
        recordedBy: existing?.recordedBy || user?.id || user?.phone || 'admin-master',
        recordedByGmail: existing?.recordedByGmail || user?.gmail || undefined,
        source: 'main',
        isDeleted: existing?.isDeleted ?? false,
        created: existing?.created || Date.now()
      };
      updatedTransactions = existing
        ? transactions.map(t => (t.id === entryData.id ? savedTrx : t))
        : [...transactions, savedTrx];
      if (selectedTransaction?.id === entryData.id) {
        setSelectedTransaction(savedTrx);
      }
      logAction('Updated Transaction', 'এন্ট্রি হালনাগাদ', `${entryData.person} (${entryData.method}) - ${entryData.amount} টাকা`);
    } else {
      const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      const prefix = entryData.method === 'ব্যাংক' ? '765B' : '765M';
      savedTrx = {
        ...entryData,
        id: `trx-${Date.now()}`,
        trxId: `${prefix}${randomHex}`,
        recordedBy: user?.id || user?.phone || 'admin-master',
        recordedByGmail: user?.gmail || undefined,
        source: 'main',
        isDeleted: false,
        created: Date.now()
      };
      updatedTransactions = [...transactions, savedTrx];
      logAction('Created Transaction', 'নতুন লেনদেন এন্ট্রি', `${savedTrx.type === 'income' ? 'জমা' : 'খরচ'} [${savedTrx.method}]: ${savedTrx.person} - ${savedTrx.amount} টাকা`);
    }

    setTransactions(updatedTransactions);

    // Direct Cloud Firestore Sync (cloudSet strips undefined fields cleanly)
    cloudSet(['transactions', savedTrx.id], savedTrx).catch((e) => {
      console.warn('Firestore transaction save error:', e);
    });

    // Close form modal immediately
    setIsEntryModalOpen(false);
    setEditingTransaction(null);

    // Automatically navigate to 'transactions' statement view and filter by the selected method
    if (entryData.method) {
      setSelectedMethodFilter(entryData.method);
      setActiveTab('transactions');
    }
  };

  const handleDeleteTransaction = (trx: Transaction) => {
    const perm = canModifyTransaction(trx, user);
    if (!perm.allowed) {
      sounds.playTap();
      showAppToast(
        lang === 'bn' ? 'ডিলিট করার সময়সীমা বা অনুমতি নেই' : 'Delete Permission Denied',
        perm.expired
          ? (lang === 'bn' ? 'সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত ডিলিট করতে পারবেন।' : 'Sub-admin can only delete within 30 minutes.')
          : (lang === 'bn' ? 'আপনি কেবল আপনার নিজের এন্ট্রি ডিলিট করতে পারবেন।' : 'You can only delete your own entries.'),
        'amber'
      );
      return;
    }
    sounds.playTap();
    setDeleteTrx(trx);
    pushHistoryStep();
  };

  const confirmDelete = () => {
    if (!deleteTrx) return;
    if (!canModifyTransaction(deleteTrx, user).allowed) {
      setDeleteTrx(null);
      return;
    }
    const softDeletedTrx: Transaction = { ...deleteTrx, isDeleted: true };
    const updatedTransactions = transactions.map(t => (t.id === deleteTrx.id ? softDeletedTrx : t));
    setTransactions(updatedTransactions);
    try {
      safeStorage.setItem('protyasha_transactions', JSON.stringify(updatedTransactions));
    } catch {}
    if (selectedTransaction?.id === deleteTrx.id) {
      setSelectedTransaction(null);
    }
    logAction('Deleted Transaction', 'লেনদেন রিসাইকেল বিনে পাঠানো হয়েছে', `${deleteTrx.person} - #${deleteTrx.trxId}`);

    // Write complete validated document with isDeleted: true to Cloud Firestore
    cloudSet(['transactions', deleteTrx.id], softDeletedTrx).catch(() => {});
    setDeleteTrx(null);
  };

  const handleStartEdit = (trx: Transaction) => {
    const perm = canModifyTransaction(trx, user);
    if (!perm.allowed) {
      sounds.playTap();
      showAppToast(
        lang === 'bn' ? 'এডিট করার সময়সীমা বা অনুমতি নেই' : 'Edit Permission Denied',
        perm.expired
          ? (lang === 'bn' ? 'সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত এডিট করতে পারবেন।' : 'Sub-admin can only edit within 30 minutes.')
          : (lang === 'bn' ? 'আপনি কেবল আপনার নিজের এন্ট্রি এডিট করতে পারবেন।' : 'You can only edit your own entries.'),
        'amber'
      );
      return;
    }
    sounds.playTap();
    setEditingTransaction(trx);
    setEntryType(trx.type);
    setIsEntryModalOpen(true);
    pushHistoryStep();
  };

  const handleRestore = (id: string) => {
    sounds.playSuccess();
    const targetTrx = transactions.find(t => t.id === id);
    const updatedTransactions = transactions.map(t => (t.id === id ? { ...t, isDeleted: false } : t));
    setTransactions(updatedTransactions);
    if (targetTrx) {
      cloudSet(['transactions', id], { ...targetTrx, isDeleted: false }).catch(() => {});
    }
    logAction('Restored Transaction', 'লেনদেন পুনরুদ্ধার', `ID: ${id}`);
  };

  const handlePermanentDelete = async (id: string) => {
    sounds.playTap();
    const ok = await showConfirm(
      lang === 'bn' ? 'এই লেনদেনটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'Delete permanently?',
      {
        title: lang === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Permanent Delete',
        confirmLabel: lang === 'bn' ? 'মুছে ফেলুন' : 'Delete',
        cancelLabel: lang === 'bn' ? 'বাতিল' : 'Cancel',
        destructive: true
      }
    );
    if (ok) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      try {
        safeStorage.setItem('protyasha_transactions', JSON.stringify(updatedTransactions));
      } catch {}
      cloudDelete(['transactions', id]).catch(() => {});
      if (selectedTransaction?.id === id) {
        setSelectedTransaction(null);
      }
      logAction('Permanent Delete', 'স্থায়ীভাবে মুছে ফেলা', `ID: ${id}`);
    }
  };

  const handleEmptyTrash = () => {
    sounds.playTap();
    const deletedItems = transactions.filter(t => t.isDeleted);
    const updatedTransactions = transactions.filter(t => !t.isDeleted);
    setTransactions(updatedTransactions);
    try {
      safeStorage.setItem('protyasha_transactions', JSON.stringify(updatedTransactions));
    } catch {}
    deletedItems.forEach(t => {
      cloudDelete(['transactions', t.id]).catch(() => {});
    });
    logAction('Emptied Trash', 'রিসাইকেল বিন সম্পূর্ণ খালি', 'All trash cleared');
  };

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setSessionNotice('');
    setUser(loggedInUser);
    safeStorage.setItem('protyasha_user', JSON.stringify(loggedInUser));
    if (loggedInUser.role !== 'visitor') {
      sessionStorage.setItem('protyasha_session_active', 'true');
    } else {
      sessionStorage.setItem('protyasha_session_active', 'false');
    }
    if (loggedInUser.avatarUrl) {
      safeStorage.setItem('protyasha_last_avatar', loggedInUser.avatarUrl);
    } else {
      safeStorage.removeItem('protyasha_last_avatar');
    }
    setIsLoginOpen(false);
    setIsProfileOpen(false);
    setActiveTab('home');
    logAction(
      'User Login',
      loggedInUser.role === 'admin'
        ? 'এডমিন লগইন'
        : loggedInUser.role === 'sub-admin'
        ? 'সাব-এডমিন লগইন'
        : loggedInUser.role === 'staff'
        ? 'স্টাফ লগইন (পুরো অ্যাপ ও হাজিরা)'
        : loggedInUser.role === 'user'
        ? 'ইউজার লগইন'
        : 'ভিজিটর মোড',
      `${loggedInUser.name} (${loggedInUser.phone || 'N/A'})`
    );
  };

  const handleLogout = async () => {
    sounds.playTap();
    const currentSessionUser = userRef.current;
    if (currentSessionUser?.avatarUrl && currentSessionUser.role !== 'visitor') {
      safeStorage.setItem('protyasha_last_avatar', currentSessionUser.avatarUrl);
    }
    if (currentSessionUser && currentSessionUser.role !== 'visitor') {
      await Promise.race([
        loadDeviceSession().then(({ releaseDeviceSession }) => releaseDeviceSession(currentSessionUser)),
        new Promise<void>((resolve) => setTimeout(resolve, 1500))
      ]).catch(() => {});
    }
    setSessionNotice('');
    safeStorage.removeItem('protyasha_user');
    sessionStorage.removeItem('protyasha_session_active');
    try {
      sessionStorage.removeItem('protyasha_support_staff_session');
    } catch {}
    setUser(null);
    setActiveTab('home');
    setIsProfileOpen(false);
    setSelectedTransaction(null);
    setActivePortal(null);
    setIsNotificationsOpen(false);
    setIsAuditLogOpen(false);
    setIsUserManagementOpen(false);
    setIsBannerManagerOpen(false);
    setIsChannelManagerOpen(false);
    setIsRecycleBinOpen(false);
    setIsChangePinOpen(false);
    setIsFooterSettingsOpen(false);
    setIsEntryModalOpen(false);
    setReceiptTransaction(null);
    setSelectedNotificationDetail(null);
    setIsPopupNoticeManagerOpen(false);
    setPreviewPopupNotice(null);
    setIsLoginOpen(true);
    // Push fresh history state so back button cannot navigate back to visitor mode
    window.history.pushState({ screen: 'login' }, '', window.location.pathname);
    logAction('Logout', 'লগআউট', 'সেশন সমাপ্ত ও সরাসরি লগইন পেইজে স্থানান্তর');
  };

  const openLoginView = () => {
    sounds.playTap();
    setIsLoginOpen(true);
    setIsProfileOpen(false);
    pushHistoryStep();
  };

  const handleAyByayAdminLogin = () => {
    setActivePortal(null);
    openLoginView();
  };

  const handleAyByayAdminLogout = () => {
    handleLogout();
  };

  const handleSaveQuickHisabOwners = (updatedOwners: QuickHisabOwner[]) => {
    const normalizedOwners = updatedOwners.map(o => ({ ...o, id: String(o.id) }));
    const nextIds = new Set(normalizedOwners.map(o => String(o.id)));
    const removedIds = quickHisabOwners
      .map(o => String(o.id))
      .filter(id => !nextIds.has(id));
    const nowIso = new Date().toISOString();

    setQuickHisabOwners(normalizedOwners);
    try {
      safeStorage.setItem('protyasha_quick_hisab_owners', JSON.stringify(normalizedOwners));
    } catch {}

    normalizedOwners.forEach(o => {
      cloudSet(['quick_hisab_owners', String(o.id)], o).catch(() => {});
    });
    removedIds.forEach(id => {
      cloudDelete(['quick_hisab_owners', id]).catch(() => {});
    });
    cloudSet(['settings', 'owners_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

    logAction('Updated Owners', 'মালিকানা তালিকা হালনাগাদ', `মোট অংশীদার: ${normalizedOwners.length}`);
  };

  const handleSaveBanners = (updated: BannerAd[]) => {
    const nowIso = new Date().toISOString();
    const cleanBanners = updated
      .filter(b => b && b.id && b.imageUrl)
      .map((b, idx) => ({
        ...b,
        id: String(b.id),
        isActive: b.isActive !== false,
        priority: idx + 1,
        updatedAt: nowIso
      }));
    const nextIds = new Set(cleanBanners.map(b => b.id));
    const removedIds = banners
      .map(b => String(b.id))
      .filter(id => !nextIds.has(id));

    setBanners(cleanBanners);
    try {
      safeStorage.setItem('protyasha_banners', JSON.stringify(cleanBanners));
    } catch (e) {
      console.error('safeStorage.setItem error:', e);
    }

    cleanBanners.forEach(b => {
      cloudSet(['banners', b.id], b).catch((e) => console.error('Firestore banner update error:', b.id, e));
    });
    removedIds.forEach(id => {
      cloudDelete(['banners', id]).catch(() => {});
    });
    cloudSet(['settings', 'banners_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

    logAction('Updated Banners', 'বিজ্ঞাপন ব্যানার পরিবর্তন', `মোট বিজ্ঞাপন: ${cleanBanners.length}`);
  };

  const handleDeleteBanner = (bannerId: string) => {
    const targetId = String(bannerId);
    const updated = banners.filter(b => String(b.id) !== targetId);
    const nowIso = new Date().toISOString();
    setBanners(updated);
    try {
      safeStorage.setItem('protyasha_banners', JSON.stringify(updated));
    } catch {}

    cloudDelete(['banners', targetId]).catch(() => {});
    cloudSet(['settings', 'banners_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

    logAction('Deleted Banner', 'বিজ্ঞাপন ব্যানার মুছে ফেলা হয়েছে', `ব্যানার আইডি: ${bannerId}`);
  };

  const handleSaveStaffAccounts = (updated: StaffAccount[]) => {
    const cleanUpdated: StaffAccount[] = JSON.parse(JSON.stringify(updated)).map((s: StaffAccount) =>
      sanitizeStaffForFirestore(s)
    );
    const nextIds = new Set(cleanUpdated.map(s => String(s.id)));
    const removedIds = staffAccounts
      .map(s => String(s.id))
      .filter(id => !nextIds.has(id));
    const nowIso = new Date().toISOString();

    setStaffAccounts(cleanUpdated);
    broadcastStaffAccounts(cleanUpdated);

    cleanUpdated.forEach(staff => {
      cloudSet(['staff', String(staff.id)], staff, undefined, true).catch((err) => {
        void reportCloudError(err, CloudOperationType.WRITE, `staff/${staff.id}`);
      });
    });
    removedIds.forEach(id => {
      cloudDelete(['staff', id], true).catch((err) => {
        void reportCloudError(err, CloudOperationType.DELETE, `staff/${id}`);
      });
    });
    cloudSet(['settings', 'staff_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

    logAction('Updated Staff Accounts', 'স্টাফ হিসাব হালনাগাদ', `মোট স্টাফ: ${cleanUpdated.length}`);
  };

  const handleDeleteStaffAccount = (staffId: string) => {
    const remaining = staffAccounts.filter(s => String(s.id) !== String(staffId));
    const nowIso = new Date().toISOString();
    setStaffAccounts(remaining);
    broadcastStaffAccounts(remaining);

    cloudDelete(['staff', String(staffId)], true).catch((err) => {
      void reportCloudError(err, CloudOperationType.DELETE, `staff/${staffId}`);
    });
    cloudSet(['settings', 'staff_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

    logAction('Deleted Staff Account', 'স্টাফ অ্যাকাউন্ট মোছা হয়েছে', `স্টাফ আইডি: ${staffId}`);
  };

  // Support Ticket Handlers (Firestore 'support_tickets')
  const handleSaveSupportTicket = async (ticket: SupportTicket) => {
    setSupportTickets((prev) => {
      const exists = prev.some((t) => t.id === ticket.id);
      const next = exists ? prev.map((t) => (t.id === ticket.id ? ticket : t)) : [ticket, ...prev];
      try {
        safeStorage.setItem('protyasha_support_tickets', JSON.stringify(next));
      } catch {}
      return next;
    });

    await cloudSet(['support_tickets', String(ticket.id)], ticket).catch((err) => {
      void reportCloudError(err, CloudOperationType.WRITE, `support_tickets/${ticket.id}`);
      throw err;
    });

    logAction(
      'Support Ticket Updated',
      'সাপোর্ট টিকেট হালনাগাদ',
      `#${ticket.ticketNumber} • ${ticket.customerName} (${ticket.status})`
    );
  };

  const handleDeleteSupportTicket = async (ticketId: string) => {
    setSupportTickets((prev) => {
      const next = prev.filter((t) => t.id !== ticketId);
      try {
        safeStorage.setItem('protyasha_support_tickets', JSON.stringify(next));
      } catch {}
      return next;
    });

    await cloudDelete(['support_tickets', String(ticketId)]).catch((err) => {
      void reportCloudError(err, CloudOperationType.DELETE, `support_tickets/${ticketId}`);
    });

    logAction('Deleted Support Ticket', 'সাপোর্ট টিকেট মোছা হয়েছে', `টিকেট আইডি: ${ticketId}`);
  };

  // Staff Attendance & Leave Handlers (Firestore 'staff_attendance')
  const handleSaveAttendance = async (record: StaffAttendanceRecord) => {
    setAttendanceRecords((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      const next = exists ? prev.map((r) => (r.id === record.id ? record : r)) : [record, ...prev];
      try {
        safeStorage.setItem('protyasha_staff_attendance', JSON.stringify(next));
      } catch {}
      return next;
    });

    await cloudSet(['staff_attendance', String(record.id)], record).catch((err) => {
      void reportCloudError(err, CloudOperationType.WRITE, `staff_attendance/${record.id}`);
      throw err;
    });

    logAction(
      'Staff Attendance Marked',
      'স্টাফ হাজিরা আপডেট',
      `${record.staffName} • ${record.date} (${record.status})`
    );
  };

  const handleSaveBulkAttendance = async (records: StaffAttendanceRecord[]) => {
    if (!records.length) return;
    setAttendanceRecords((prev) => {
      const map = new Map(prev.map((r) => [r.id, r]));
      records.forEach((r) => map.set(r.id, r));
      const next = Array.from(map.values());
      try {
        safeStorage.setItem('protyasha_staff_attendance', JSON.stringify(next));
      } catch {}
      return next;
    });

    await Promise.all(
      records.map((rec) =>
        cloudSet(['staff_attendance', String(rec.id)], rec).catch((err) => {
          void reportCloudError(err, CloudOperationType.WRITE, `staff_attendance/${rec.id}`);
        })
      )
    );

    logAction(
      'Bulk Attendance Updated',
      'স্টাফ হাজিরা/ছুটি সংরক্ষণ',
      `${records.length}টি এন্ট্রি আপডেট করা হয়েছে`
    );
  };

  const handleDeleteAttendance = async (recordId: string) => {
    setAttendanceRecords((prev) => {
      const next = prev.filter((r) => r.id !== recordId);
      try {
        safeStorage.setItem('protyasha_staff_attendance', JSON.stringify(next));
      } catch {}
      return next;
    });

    await cloudDelete(['staff_attendance', String(recordId)]).catch((err) => {
      void reportCloudError(err, CloudOperationType.DELETE, `staff_attendance/${recordId}`);
    });

    logAction('Deleted Attendance Record', 'হাজিরা/ছুটি রেকর্ড মোছা হয়েছে', `আইডি: ${recordId}`);
  };

  // In-App Popup Notice & User Consent Handlers
  const pendingUserPopupNotices = useMemo(() => {
    if (!user || isLoginOpen || user.role === 'admin') return [];
    const uPhone = normalizePhoneNumber(user.phone);
    const uName = (user.name || '').trim().toLowerCase();
    const isMatchedStaffUser =
      user.role === 'sub-admin' ||
      user.role === 'staff' ||
      staffAccounts.some((s) => {
        if (s.isActive === false) return false;
        if (user.id && s.id === user.id) return true;
        if (uPhone.length >= 6 && normalizePhoneNumber(s.phone) === uPhone) return true;
        if (uName && (s.name || '').trim().toLowerCase() === uName) return true;
        return false;
      });

    return popupNotices.filter((n) => {
      if (!n.isActive) return false;
      if (acknowledgedPopupIds.includes(n.id)) return false;
      if (n.audience === 'all') return true;
      if (n.audience === 'users') return user.role === 'user' || user.role === 'sub-admin';
      if (n.audience === 'staff') return isMatchedStaffUser;
      return false;
    });
  }, [user, isLoginOpen, popupNotices, acknowledgedPopupIds, staffAccounts]);

  const handleSavePopupNotice = async (notice: PopupNotice, alsoSendToNotifCenter?: boolean) => {
    const cleanId =
      String(notice.id || `popup_${Date.now()}`)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 128) || `popup_${Date.now()}`;
    const cleanNotice: PopupNotice = {
      ...notice,
      id: cleanId,
      title: String(notice.title || '').trim().slice(0, 200),
      message: String(notice.message || '').trim().slice(0, 3000),
      consentLabel: String(notice.consentLabel || 'আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।').trim().slice(0, 300),
      requiresConsent: notice.requiresConsent !== false,
      isActive: notice.isActive !== false,
      createdBy: String(notice.createdBy || user?.name || 'Admin').slice(0, 128),
      createdAt: notice.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPopupNotices((prev) => {
      const exists = prev.some((n) => n.id === cleanNotice.id);
      const next = exists
        ? prev.map((n) => (n.id === cleanNotice.id ? cleanNotice : n))
        : [cleanNotice, ...prev];
      try {
        safeStorage.setItem('protyasha_popup_notices', JSON.stringify(next));
      } catch {}
      return next;
    });

    await cloudSet(['popup_notices', cleanId], cleanNotice).catch((err) => {
      void reportCloudError(err, CloudOperationType.WRITE, `popup_notices/${cleanId}`);
      throw err;
    });

    if (alsoSendToNotifCenter) {
      const now = new Date();
      const monthsBnMap: Record<string, string> = {
        Jan: 'জানুয়ারি', Feb: 'ফেব্রুয়ারি', Mar: 'মার্চ', Apr: 'এপ্রিল', May: 'মে', Jun: 'জুন',
        Jul: 'জুলাই', Aug: 'আগস্ট', Sep: 'সেপ্টেম্বর', Oct: 'অক্টোবর', Nov: 'নভেম্বর', Dec: 'ডিসেম্বর'
      };
      const monthEn = now.toLocaleString('en-US', { month: 'short' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      handleSendNotification({
        titleBn: cleanNotice.title,
        titleEn: cleanNotice.title,
        bodyBn: cleanNotice.message,
        bodyEn: cleanNotice.message,
        timeBn: `${now.getDate()} ${monthsBnMap[monthEn] || monthEn}, ${timeStr}`,
        timeEn: `${monthEn} ${now.getDate()}, ${timeStr}`,
        type: cleanNotice.priority === 'urgent' ? 'alert' : 'info',
        image: cleanNotice.imageUrl
      });
    }

    logAction('Popup Notice Published', 'পপ-আপ নোটিশ প্রকাশ', cleanNotice.title);
  };

  const handleTogglePopupNoticeActive = async (notice: PopupNotice) => {
    const updated: PopupNotice = {
      ...notice,
      isActive: !notice.isActive,
      updatedAt: new Date().toISOString()
    };
    setPopupNotices((prev) => {
      const next = prev.map((n) => (n.id === updated.id ? updated : n));
      try {
        safeStorage.setItem('protyasha_popup_notices', JSON.stringify(next));
      } catch {}
      return next;
    });
    await cloudSet(['popup_notices', updated.id], updated).catch((err) => {
      void reportCloudError(err, CloudOperationType.WRITE, `popup_notices/${updated.id}`);
    });
    logAction(
      'Popup Notice Toggled',
      updated.isActive ? 'পপ-আপ নোটিশ সক্রিয়' : 'পপ-আপ নোটিশ বিরতি',
      updated.title
    );
  };

  const handleDeletePopupNotice = async (noticeId: string) => {
    setPopupNotices((prev) => {
      const next = prev.filter((n) => n.id !== noticeId);
      try {
        safeStorage.setItem('protyasha_popup_notices', JSON.stringify(next));
      } catch {}
      return next;
    });
    await cloudDelete(['popup_notices', noticeId]).catch((err) => {
      void reportCloudError(err, CloudOperationType.DELETE, `popup_notices/${noticeId}`);
    });
    logAction('Deleted Popup Notice', 'পপ-আপ নোটিশ মুছে ফেলা হয়েছে', `ID: ${noticeId}`);
  };

  const handleAcknowledgePopupNotice = async (notice: PopupNotice) => {
    if (previewPopupNotice) {
      setPreviewPopupNotice(null);
      return;
    }
    setIsSubmittingPopupAck(true);
    try {
      const ackId = popupAckUserKey;
      const nowIso = new Date().toISOString();
      const { getDeviceLabel } = await loadDeviceSession();
      const ackPayload: PopupNoticeAcknowledgement = {
        id: ackId,
        noticeId: notice.id,
        userKey: ackId,
        userName: String(user?.name || (lang === 'bn' ? 'অতিথি / ভিজিটর' : 'Visitor')).slice(0, 150),
        userPhone: String(user?.phone || '').slice(0, 32),
        userRole: String(user?.role || 'visitor').slice(0, 32),
        consentText: String(notice.consentLabel || 'সম্মতি দেওয়া হয়েছে').slice(0, 300),
        deviceLabel: String(getDeviceLabel() || '').slice(0, 150),
        acknowledgedAt: nowIso
      };

      const storageKey = `protyasha_popup_acks_${ackId}`;
      setAcknowledgedPopupIds((prev) => {
        const next = Array.from(new Set([...prev, notice.id]));
        try {
          safeStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });

      await cloudSet(
        ['popup_notices', notice.id, 'acknowledgements', ackId],
        ackPayload
      ).catch((err) => {
        void reportCloudError(err, CloudOperationType.WRITE, `popup_notices/${notice.id}/acknowledgements/${ackId}`);
      });

      sounds.playSuccess();
      showAppToast(
        lang === 'bn' ? 'সম্মতি নিশ্চিত হয়েছে' : 'Consent Confirmed',
        notice.title,
        'emerald',
        3500
      );
    } finally {
      setIsSubmittingPopupAck(false);
    }
  };

  const handlePublishQuickPopupFromNotifModal = async (data: {
    title: string;
    message: string;
    priority: 'info' | 'important' | 'urgent' | 'policy';
  }) => {
    const nowIso = new Date().toISOString();
    const newNotice: PopupNotice = {
      id: `popup_${Date.now()}`,
      title: data.title,
      message: data.message,
      priority: data.priority,
      audience: 'all',
      consentLabel: 'আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।',
      requiresConsent: true,
      isActive: true,
      createdBy: user?.name || 'Admin',
      createdAt: nowIso,
      updatedAt: nowIso
    };
    await handleSavePopupNotice(newNotice, false);
  };

  const handleDeleteStaffTransaction = (staffId: string, txId: string) => {
    setStaffAccounts(prev => {
      const updated = prev.map(staff => {
        if (staff.id === staffId) {
          const txs = staff.transactions || [];
          const updatedTxs = txs.filter(t => {
            const tid = String(t.id || '').trim();
            const targetId = String(txId || '').trim();
            if (tid && targetId && tid === targetId) return false;
            if (!tid && String(t.created) === targetId) return false;
            return true;
          });
          const newTotalDue = updatedTxs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
          const newTotalCollected = updatedTxs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
          const newRemaining = newTotalDue - newTotalCollected;
          const updatedStaff = {
            ...staff,
            phone: staff.phone || '',
            totalDue: newTotalDue,
            totalCollected: newTotalCollected,
            remainingDue: newRemaining,
            transactions: updatedTxs
          };
          cloudSet(['staff', String(staffId)], updatedStaff, undefined, true).catch(() => {});
          return updatedStaff;
        }
        return staff;
      });
      try {
        safeStorage.setItem('protyasha_staff', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleExitPublicTracker = () => {
    if (isPublicPreviewOverlayRef.current && window.history.state?.appOverlay) {
      window.history.back();
      return;
    }
    isPublicPreviewOverlayRef.current = false;
    clearTrackFromCurrentUrl();
    setPublicTrackTicketId(null);
  };

  if (publicTrackTicketId) {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-10 h-10 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">ট্র্যাকিং তথ্য লোড হচ্ছে...</p>
          </div>
        }
      >
        <PublicTicketTracker
          ticketId={publicTrackTicketId}
          lang={lang}
          onExitToApp={handleExitPublicTracker}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col w-full selection:bg-rose-500 selection:text-white">
      {/* Full Screen Responsive App Container for Mobile Native App & Desktop PC Full-Screen */}
      <div className="relative w-full bg-white dark:bg-slate-900 min-h-screen flex flex-col transition-all">
        
        {/* If Login View is explicitly requested */}
        {isLoginOpen ? (
          <React.Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="w-9 h-9 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
              </div>
            }
          >
            <LoginView
              lang={lang}
              footerConfig={footerConfig}
              banners={banners}
              adminAvatar={adminAvatar}
              sessionNotice={sessionNotice}
              isVisitorModeEnabled={isVisitorModeEnabled}
              visitorDisabledTitle={serviceStatuses.visitorMode?.title}
              visitorDisabledMessage={serviceStatuses.visitorMode?.customMessage}
              onClearSessionNotice={() => setSessionNotice('')}
              onLanguageChange={setLang}
              onLoginSuccess={handleLoginSuccess}
              onSubViewChange={(isSubView) => {
                isLoginSubViewActiveRef.current = isSubView;
              }}
              onClose={() => {
                // Only allow closing login modal if user already has an active session
                if (isLoggedInSession(user)) {
                  sessionStorage.setItem('protyasha_session_active', 'true');
                  closeOverlayViaBack(() => setIsLoginOpen(false));
                }
              }}
            />
          </React.Suspense>
        ) : selectedTransaction ? (
          /* CARD TAP OPENS NEW PAGE (NOT POPUP) */
          <React.Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="w-9 h-9 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
              </div>
            }
          >
            <TransactionDetailPage
              transaction={selectedTransaction}
              lang={lang}
              user={user}
              onBack={() => closeOverlayViaBack(() => setSelectedTransaction(null))}
              onEdit={handleStartEdit}
              onDelete={handleDeleteTransaction}
              onViewReceipt={(trx) => {
                setReceiptTransaction(trx);
                pushHistoryStep();
              }}
              onOpenLogin={openLoginView}
            />
          </React.Suspense>
        ) : (
          <>
            {/* View Switcher by Tab */}
            {activeTab === 'home' && (
              <div className="flex-1 pb-24">
                {/* Header with scenic landscape and Notification Bell */}
                <Header
                  lang={lang}
                  user={user}
                  adminAvatar={adminAvatar}
                  unreadCount={unreadNotificationsCount}
                  weatherData={weatherData}
                  onOpenWeather={() => {
                    sounds.playTap();
                    setIsWeatherOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenPrayerTimes={() => {
                    sounds.playTap();
                    setIsPrayerTimesOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenNotifications={() => {
                    sounds.playTap();
                    setIsNotificationsOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenProfile={() => {
                    sounds.playTap();
                    setActiveTab('profile');
                    pushHistoryStep();
                  }}
                />

                {/* Tap to Check Balance Card */}
                <BalanceCard balance={totalBalance} lang={lang} />

                {/* 2 Primary Feature Cards:
                    1. বিল ম্যানেজমেন্ট প্রো (opens Bill Management Pro portal)
                    2. আয়-ব্যয় হিসাব (opens Income-Expense Smart Management portal) */}
                <PrimaryFeatureCards
                  lang={lang}
                  user={user}
                  serviceStatuses={serviceStatuses}
                  onOpenBillManager={handleLaunchBillManager}
                  onOpenAyByay={handleLaunchAyByay}
                  onOpenQuickHisab={() => {
                    if (!checkServiceAccess('quickHisab', 'কুইক হিসাব ও লভ্যাংশ বণ্টন')) return;
                    sounds.playTap();
                    setIsQuickHisabOpen(true);
                    pushHistoryStep();
                  }}
                />

                {/* Main Page Promotional Ads Carousel (Admin Controllable 5-7 ads) */}
                <PromoCarousel
                  banners={banners}
                  lang={lang}
                  user={user}
                  onExploreOffer={(banner) => {
                    if (!banner) return;
                    sounds.playTap();
                    const link = (banner.linkUrl || '').trim();
                    if (link === '#weather' || link === 'action:weather') {
                      setIsWeatherOpen(true);
                    } else if (link === '#notifications' || link === 'action:notifications') {
                      setIsNotificationsOpen(true);
                    } else if (link === '#home' || link === 'tab:home') {
                      setActiveTab('home');
                      setActivePortal(null);
                    } else if (link === '#transactions' || link === 'tab:transactions') {
                      if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                      setActiveTab('transactions');
                      setActivePortal(null);
                    } else if (link === '#ledger' || link === 'tab:ledger') {
                      if (!checkServiceAccess('ledger', 'অডিট ও রিপোর্ট খাতা')) return;
                      setActiveTab('ledger');
                      setActivePortal(null);
                    } else if (link === '#profile' || link === 'tab:profile') {
                      setActiveTab('profile');
                      setActivePortal(null);
                    } else if (link.startsWith('#portal:') || link.startsWith('portal:')) {
                      const portal = link.replace(/^#?portal:/, '') as any;
                      if (portal === 'bill-manager') {
                        handleLaunchBillManager();
                        return;
                      }
                      if (portal === 'ay-byay') {
                        handleLaunchAyByay();
                        return;
                      }
                      if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                      setActivePortal(portal);
                    } else if (link.startsWith('#category:') || link.startsWith('category:')) {
                      if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                      const cat = link.replace(/^#?category:/, '');
                      setSelectedMethodFilter(cat === 'all' ? '' : cat);
                      setActiveTab('transactions');
                      setActivePortal(null);
                    } else if (link === '#offer' || link === '#store' || link === '#help' || link.startsWith('action:')) {
                      if (user?.role === 'admin') {
                        setIsFooterSettingsOpen(true);
                      } else {
                        setIsNotificationsOpen(true);
                      }
                    } else if (link.startsWith('tel:')) {
                      window.location.href = link;
                    } else if (link.startsWith('http')) {
                      window.open(link, '_blank');
                    } else {
                      if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                      setActiveTab('transactions');
                    }
                    pushHistoryStep();
                  }}
                  onOpenBannerManager={() => {
                    if (user?.role === 'admin') {
                      setIsBannerManagerOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onSaveBanners={handleSaveBanners}
                />

                {user?.role === 'staff' && (
                  <div className="px-4 mt-4">
                    <div className="rounded-2xl border border-teal-200 dark:border-teal-800/70 bg-gradient-to-r from-teal-50 via-emerald-50 to-white dark:from-teal-950/60 dark:via-emerald-950/30 dark:to-slate-900 p-3.5 shadow-sm flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-teal-800 dark:text-teal-200">
                          {lang === 'bn' ? 'স্টাফ অ্যাকাউন্ট (সাধারণ দর্শন ও হাজিরা)' : 'Staff Mode (View App & Attendance)'}
                        </p>
                        <p className="text-[11px] text-teal-700/90 dark:text-teal-300/90 leading-snug mt-0.5">
                          {lang === 'bn'
                            ? 'আপনি সাধারণ সদস্যদের মতো পুরো অ্যাপ দেখতে পারবেন এবং স্টাফ হাজিরা অপশনে নিজের হাজিরা দিতে পারবেন (৫ মিনিট পর হাজিরা লক হবে)।'
                            : 'You can browse the full app (view-only) and mark your own attendance (locks after 5 minutes).'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!checkServiceAccess('staffAttendance', 'স্টাফ হাজিরা ও ছুটি')) return;
                          sounds.playTap();
                          setIsStaffAttendanceOpen(true);
                          pushHistoryStep();
                        }}
                        className="shrink-0 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                      >
                        {lang === 'bn' ? 'হাজিরা দিন' : 'Attendance'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Operations Hub Strip: সাপোর্ট টিকেট ও স্টাফ হাজিরা (মেইন পেইজ বিজ্ঞাপনের নিচে) */}
                <OperationsHubCards
                  lang={lang}
                  user={user}
                  serviceStatuses={serviceStatuses}
                  openTicketsCount={
                    supportTickets.filter((t) => {
                      if (t.status === 'resolved') return false;
                      if (
                        user?.role === 'admin' ||
                        (user?.role === 'sub-admin' && hasSubAdminPermission(user, 'supportTickets'))
                      ) {
                        return true;
                      }
                      return isSupportTicketOwner(t, user);
                    }).length
                  }
                  todayPresentCount={(() => {
                    const d = new Date();
                    const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    return attendanceRecords.filter(
                      (r) =>
                        r.date === todayKey &&
                        (r.status === 'present' || r.status === 'late' || r.status === 'half_day')
                    ).length;
                  })()}
                  totalStaffCount={staffAccounts.filter(isActualStaffAccount).length}
                  onOpenSupportTickets={() => {
                    if (!checkServiceAccess('supportTickets', 'সাপোর্ট টিকেট ও কমপ্লেইন')) return;
                    sounds.playTap();
                    setIsSupportTicketsOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenStaffAttendance={() => {
                    if (!checkServiceAccess('staffAttendance', 'স্টাফ হাজিরা ও ছুটি')) return;
                    sounds.playTap();
                    setIsStaffAttendanceOpen(true);
                    pushHistoryStep();
                  }}
                />

                {/* Payment Channels & Control Panel (বিকাশ, নগদ, ব্যাংক, রকেট, ক্যাশ + স্টাফ কালেকশন / কোম্পানি পাওনা) */}
                <QuickChannels
                  transactions={transactions}
                  channels={channels}
                  staffAccounts={staffAccounts}
                  lang={lang}
                  user={user}
                  serviceStatuses={serviceStatuses}
                  currentMonthIndex={currentMonthIndex}
                  currentYear={currentYear}
                  onSelectMethod={(m) => {
                    if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                    setSelectedMethodFilter(m);
                    setActiveTab('transactions');
                    pushHistoryStep();
                  }}
                  onOpenChannelManager={() => {
                    if (user?.role === 'admin') {
                      setIsChannelManagerOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenIncome={(selectedMethod) => {
                    if (canAddTransactions(user)) {
                      if (!checkServiceAccess('ayByay', 'আয়-ব্যয় হিসাব')) return;
                      setEntryType('income');
                      setEditingTransaction(null);
                      setInitialEntryMethod(selectedMethod || 'নগদ');
                      setIsEntryModalOpen(true);
                      pushHistoryStep();
                    } else if (isLoggedInSession(user)) {
                      sounds.playTap();
                      showAppToast(
                        lang === 'bn' ? 'রিড-অনলি মোড / অনুমতি নেই' : 'Read-Only / Permission Denied',
                        lang === 'bn'
                          ? 'আপনার অ্যাকাউন্ট দিয়ে নতুন জমা বা লেনদেন যোগ করা যাবে না।'
                          : 'Your account cannot add or modify transactions.',
                        'amber',
                        5000
                      );
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenExpense={(selectedMethod) => {
                    if (canAddTransactions(user)) {
                      if (!checkServiceAccess('ayByay', 'আয়-ব্যয় হিসাব')) return;
                      setEntryType('expense');
                      setEditingTransaction(null);
                      setInitialEntryMethod(selectedMethod || 'নগদ');
                      setIsEntryModalOpen(true);
                      pushHistoryStep();
                    } else if (isLoggedInSession(user)) {
                      sounds.playTap();
                      showAppToast(
                        lang === 'bn' ? 'রিড-অনলি মোড / অনুমতি নেই' : 'Read-Only / Permission Denied',
                        lang === 'bn'
                          ? 'আপনার অ্যাকাউন্ট দিয়ে নতুন খরচ বা লেনদেন যোগ করা যাবে না।'
                          : 'Your account cannot add or modify transactions.',
                        'amber',
                        5000
                      );
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenLedger={() => {
                    if (!checkServiceAccess('ledger', 'অডিট ও রিপোর্ট খাতা')) return;
                    setActiveTab('ledger');
                    pushHistoryStep();
                  }}
                  onOpenStaffManager={() => {
                    if (!checkServiceAccess('staffManager', 'স্টাফ কালেকশন ও কোম্পানি পাওনা')) return;
                    setIsStaffManagerOpen(true);
                    pushHistoryStep();
                  }}
                />
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="flex-1 pb-24">
                {/* Header for Transactions Screen */}
                <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-2xs">
                  <h1 className="text-base font-bold text-slate-900 dark:text-white mx-auto">
                    {user?.role === 'sub-admin'
                      ? (lang === 'bn' ? 'আমার লেনদেন তালিকা ও স্টেটমেন্ট' : 'My Transactions & Statements')
                      : (lang === 'bn' ? 'সকল লেনদেন ও চ্যানেল স্টেটমেন্ট' : 'All Transactions & Statements')}
                  </h1>
                </div>

                <React.Suspense
                  fallback={
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-full border-3 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
                      <span className="text-xs font-bold">{lang === 'bn' ? 'লেনদেন তালিকা লোড হচ্ছে...' : 'Loading transactions...'}</span>
                    </div>
                  }
                >
                  <TransactionList
                    transactions={transactionsForList}
                    lang={lang}
                    user={user}
                    onSelectTransaction={(trx) => {
                      setSelectedTransaction(trx);
                      pushHistoryStep();
                    }}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteTransaction}
                    selectedMethodFilter={selectedMethodFilter}
                    onClearMethodFilter={() => setSelectedMethodFilter(null)}
                    currentMonthIndex={currentMonthIndex}
                    currentYear={currentYear}
                    onPrevMonth={() => {
                      if (currentMonthIndex === 0) {
                        setCurrentMonthIndex(11);
                        setCurrentYear((y) => y - 1);
                      } else {
                        setCurrentMonthIndex((m) => m - 1);
                      }
                    }}
                    onNextMonth={() => {
                      if (currentMonthIndex === 11) {
                        setCurrentMonthIndex(0);
                        setCurrentYear((y) => y + 1);
                      } else {
                        setCurrentMonthIndex((m) => m + 1);
                      }
                    }}
                  />
                </React.Suspense>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="flex-1 w-full pb-20">
                <React.Suspense
                  fallback={
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-full border-3 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
                      <span className="text-xs font-bold">{lang === 'bn' ? 'হিসাব খাতা লোড হচ্ছে...' : 'Loading ledger...'}</span>
                    </div>
                  }
                >
                  <ReportModal
                    isOpen={true}
                    transactions={transactions}
                    channels={channels}
                    lang={lang}
                    user={user}
                    isTabMode={true}
                    currentMonthIndex={currentMonthIndex}
                    currentYear={currentYear}
                    onPrevMonth={() => {
                      if (currentMonthIndex === 0) {
                        setCurrentMonthIndex(11);
                        setCurrentYear((y) => y - 1);
                      } else {
                        setCurrentMonthIndex((m) => m - 1);
                      }
                    }}
                    onNextMonth={() => {
                      if (currentMonthIndex === 11) {
                        setCurrentMonthIndex(0);
                        setCurrentYear((y) => y + 1);
                      } else {
                        setCurrentMonthIndex((m) => m + 1);
                      }
                    }}
                    onClose={() => setActiveTab('home')}
                  />
                </React.Suspense>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="flex-1 w-full pb-20">
                <React.Suspense
                  fallback={
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-full border-3 border-rose-500/25 border-t-[#E52E2E] animate-spin" />
                      <span className="text-xs font-bold">{lang === 'bn' ? 'মেনু লোড হচ্ছে...' : 'Loading menu...'}</span>
                    </div>
                  }
                >
                <ProfileView
                  user={user}
                  lang={lang}
                  theme={theme}
                  adminAvatar={adminAvatar}
                  isTabMode={true}
                  onToggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
                  onLanguageChange={setLang}
                  onUpdateAdminProfile={handleUpdateAdminProfile}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  onBindMethods={handleBindMethods}
                  onOpenFooterSettings={() => {
                    if (user?.role === 'admin') {
                      setIsFooterSettingsOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenLogin={openLoginView}
                  onOpenChangePin={() => {
                    if (user?.role === 'admin') {
                      setIsChangePinOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenRecycleBin={() => {
                    if (user?.role === 'admin') {
                      setIsRecycleBinOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenAuditLog={() => {
                    setIsAuditLogOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenServiceManager={() => {
                    setIsServiceManagerOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenPopupNoticeManager={() => {
                    if (user?.role === 'admin') {
                      setIsPopupNoticeManagerOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenBannerManager={() => {
                    if (user?.role === 'admin') {
                      setIsBannerManagerOpen(true);
                      pushHistoryStep();
                    } else {
                      showToast(lang === 'bn' ? 'বিজ্ঞাপন নিয়ন্ত্রণ শুধুমাত্র অ্যাডমিনের জন্য' : 'Admin only access', 'warning');
                      openLoginView();
                    }
                  }}
                  onOpenNotifications={() => {
                    setIsNotificationsOpen(true);
                    pushHistoryStep();
                  }}
                  onOpenUserManagement={() => {
                    if (user?.role === 'admin') {
                      setIsUserManagementOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onOpenDriveBackup={() => {
                    if (user?.role === 'admin') {
                      setIsDriveBackupOpen(true);
                      pushHistoryStep();
                    } else {
                      openLoginView();
                    }
                  }}
                  onUpdateChecked={(res) => handleUpdateCheckResult(res, false)}
                  onSubViewChange={(isSubView) => {
                    isProfileSubViewActiveRef.current = isSubView;
                  }}
                  onLogout={handleLogout}
                  onClose={() => closeOverlayViaBack(() => setActiveTab('home'))}
                />
                </React.Suspense>
              </div>
            )}

            {/* Clean Bottom Navigation: 5 tabs */}
            <BottomNav
              activeTab={activeTab}
              lang={lang}
              onTabChange={(tab) => {
                if (tab === 'transactions') {
                  if (!checkServiceAccess('transactions', 'সকল লেনদেন ও স্টেটমেন্ট')) return;
                  setSelectedMethodFilter(null);
                } else if (tab === 'ledger') {
                  if (!checkServiceAccess('ledger', 'অডিট ও রিপোর্ট খাতা')) return;
                }
                setActiveTab(tab);
                pushHistoryStep();
              }}
            />
          </>
        )}

        {/* ================= MODALS & EDITORS ================= */}

        <React.Suspense fallback={null}>
        {/* Admin User Management Modal */}
        {user?.role === 'admin' && isUserManagementOpen && (
          <UserManagementModal
            isOpen={isUserManagementOpen}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsUserManagementOpen(false))}
            onSubViewChange={(isSubView) => {
              isUserMgmtSubViewActiveRef.current = isSubView;
            }}
            onUserUpdated={(updatedUser) => {
              if (updatedUser.role === 'admin') {
                if (updatedUser.avatarUrl) {
                  setAdminAvatar(updatedUser.avatarUrl);
                }
                cloudSet(
                  ['settings', 'admin_profile'],
                  {
                    name: updatedUser.name,
                    phone: updatedUser.phone,
                    ...(updatedUser.avatarUrl ? { avatarUrl: updatedUser.avatarUrl } : {}),
                    updatedAt: new Date().toISOString()
                  },
                  { merge: true }
                ).catch(() => {});
              }
              if (user && (user.id === updatedUser.id || user.phone === updatedUser.phone || (updatedUser.role === 'admin' && user.role === 'admin'))) {
                setUser(prev => {
                  if (!prev) return null;
                  const nextSession: UserSession = {
                    ...prev,
                    name: updatedUser.name,
                    phone: updatedUser.phone,
                    avatarUrl: updatedUser.avatarUrl || prev.avatarUrl,
                    role: updatedUser.role,
                    permissions: updatedUser.role === 'sub-admin' ? updatedUser.permissions : undefined
                  };
                  try {
                    safeStorage.setItem('protyasha_user', JSON.stringify(nextSession));
                  } catch {}
                  return nextSession;
                });
              }
            }}
          />
        )}

        {/* Centralized Master Google Drive Backup & Restore Modal */}
        {isDriveBackupOpen && (
          <DriveBackupModal
            isOpen={isDriveBackupOpen}
            onClose={() => closeOverlayViaBack(() => setIsDriveBackupOpen(false))}
            onSubViewChange={(isSubView) => {
              isDriveBackupSubViewActiveRef.current = isSubView;
            }}
            lang={lang}
            currentUser={user}
            adminAvatar={adminAvatar}
            onLogAction={logAction}
            onDataRestored={refreshAllData}
          />
        )}

        {/* Admin Banner & Ads Manager Modal */}
        {user?.role === 'admin' && isBannerManagerOpen && (
          <BannerManagerModal
            isOpen={isBannerManagerOpen}
            banners={banners}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsBannerManagerOpen(false))}
            onSubViewChange={(isSubView) => {
              isBannerSubViewActiveRef.current = isSubView;
            }}
            onSaveBanners={handleSaveBanners}
            onDeleteBanner={handleDeleteBanner}
          />
        )}

        {/* Admin Channel Manager Modal */}
        {user?.role === 'admin' && isChannelManagerOpen && (
          <ChannelManagerModal
            isOpen={isChannelManagerOpen}
            channels={channels}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsChannelManagerOpen(false))}
            onSaveChannels={(updated) => {
              const nowIso = new Date().toISOString();
              const normalized = updated.map((ch, idx) => ({
                ...ch,
                id: String(ch.id),
                order: idx + 1,
                updatedAt: nowIso
              }));
              const nextIds = new Set(normalized.map(ch => ch.id));
              const removedIds = channels
                .map(ch => String(ch.id))
                .filter(id => !nextIds.has(id));

              setChannels(normalized);
              try {
                safeStorage.setItem('protyasha_channels', JSON.stringify(normalized));
              } catch (e) {
                console.warn('LocalStorage limit reached for channels:', e);
              }

              normalized.forEach(ch => {
                cloudSet(['channels', ch.id], ch).catch((err) => {
                  void reportCloudError(err, CloudOperationType.WRITE, `channels/${ch.id}`);
                });
              });
              removedIds.forEach(id => {
                cloudDelete(['channels', id]).catch(() => {});
              });
              cloudSet(['settings', 'channels_meta'], { initialized: true, updatedAt: nowIso }).catch(() => {});

              logAction('Updated Channels', 'পেমেন্ট চ্যানেল হালনাগাদ', `মোট চ্যানেল সংখ্যা: ${normalized.length}`);
            }}
          />
        )}

        {/* Service Notice Modal */}
        {activeServiceNotice && (
          <ServiceNoticeModal
            isOpen={!!activeServiceNotice}
            serviceName={activeServiceNotice.name}
            customTitle={activeServiceNotice.title}
            customMessage={activeServiceNotice.message}
            logoUrl={activeServiceNotice.logoUrl}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setActiveServiceNotice(null))}
          />
        )}

        {/* Service Manager Modal */}
        {user?.role === 'admin' && isServiceManagerOpen && (
          <ServiceManagerModal
            isOpen={isServiceManagerOpen}
            serviceStatuses={serviceStatuses}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsServiceManagerOpen(false))}
            onSaveServiceStatuses={(updated) => {
              handleSaveServiceStatuses(updated);
              logAction('Updated Services', 'সেবা স্ট্যাটাস পরিবর্তন', 'সেবা সক্রিয়/নিষ্ক্রিয় ও নোটিশ আপডেট');
            }}
          />
        )}

        {/* Staff Collection & Company Dues Modal */}
        {isStaffManagerOpen && (
          <StaffManagerModal
            isOpen={isStaffManagerOpen}
            staffAccounts={staffAccounts}
            quickHisabOwners={quickHisabOwners}
            lang={lang}
            user={user}
            onClose={() => closeOverlayViaBack(() => setIsStaffManagerOpen(false))}
            onSubViewChange={(isSubView) => {
              isStaffManagerSubViewActiveRef.current = isSubView;
            }}
            onSaveStaffAccounts={handleSaveStaffAccounts}
            onDeleteStaffAccount={handleDeleteStaffAccount}
            onDeleteStaffTransaction={handleDeleteStaffTransaction}
            onLogAction={logAction}
          />
        )}

        {/* Real-Time Customer Support Ticket & Complaint Tracker Modal */}
        {isSupportTicketsOpen && (
          <SupportTicketModal
            isOpen={isSupportTicketsOpen}
            tickets={supportTickets}
            staffAccounts={staffAccounts}
            lang={lang}
            user={user}
            onClose={() => closeOverlayViaBack(() => setIsSupportTicketsOpen(false))}
            onSubViewChange={(isSubView) => {
              isSupportSubViewActiveRef.current = isSubView;
            }}
            onSaveTicket={handleSaveSupportTicket}
            onDeleteTicket={handleDeleteSupportTicket}
            onLogAction={logAction}
            onPreviewPublicLink={(ticketId) => {
              isPublicPreviewOverlayRef.current = true;
              setPublicTrackTicketId(ticketId);
              pushHistoryStep();
            }}
          />
        )}

        {/* Staff Attendance & Leave Management Modal */}
        {isStaffAttendanceOpen && (
          <StaffAttendanceModal
            isOpen={isStaffAttendanceOpen}
            staffAccounts={staffAccounts}
            attendanceRecords={attendanceRecords}
            lang={lang}
            user={user}
            onClose={() => closeOverlayViaBack(() => setIsStaffAttendanceOpen(false))}
            onSubViewChange={(isSubView) => {
              isAttendanceSubViewActiveRef.current = isSubView;
            }}
            onSaveAttendance={handleSaveAttendance}
            onSaveBulkAttendance={handleSaveBulkAttendance}
            onDeleteAttendance={handleDeleteAttendance}
            onLogAction={logAction}
          />
        )}

        {/* Printable Thermal Receipt Modal (lazy-mounted on demand) */}
        {receiptTransaction && (
          <ReceiptModal
            transaction={receiptTransaction}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setReceiptTransaction(null))}
          />
        )}

        {/* Income / Expense Entry & Edit Modal (lazy-mounted on demand) */}
        {isEntryModalOpen && (
          <EntryModal
            isOpen={isEntryModalOpen}
            type={entryType}
            initialMethod={initialEntryMethod}
            editingTransaction={editingTransaction}
            existingCustomers={existingCustomers}
            channels={channels}
            lang={lang}
            onClose={() =>
              closeOverlayViaBack(() => {
                setIsEntryModalOpen(false);
                setEditingTransaction(null);
              })
            }
            onSave={handleSaveEntry}
          />
        )}

        {/* Notifications Modal (Red Bell Click / Broadcast - lazy-mounted on demand) */}
        {isNotificationsOpen && (
          <NotificationsModal
            isOpen={isNotificationsOpen}
            notifications={userNotifications}
            lang={lang}
            user={user}
            onClose={() =>
              closeOverlayViaBack(() => {
                setIsNotificationsOpen(false);
                setEditingNotification(null);
              })
            }
            onSelectNotification={(notif) => {
              handleMarkNotificationAsRead(notif.id);
              setSelectedNotificationDetail(notif);
              pushHistoryStep();
            }}
            onMarkAllAsRead={handleMarkAllAsRead}
            onSendNotification={handleSendNotification}
            onEditNotification={(notif) => {
              const updatedNotifications = notifications.map(n => n.id === notif.id ? notif : n);
              setNotifications(updatedNotifications);
              saveNotificationsToCloud(updatedNotifications);
              setEditingNotification(null);
            }}
            onPublishPopupNotice={user?.role === 'admin' ? handlePublishQuickPopupFromNotifModal : undefined}
            initialEditingNotif={editingNotification}
          />
        )}

        {/* Notification Detail View Modal (lazy-mounted on demand) */}
        {selectedNotificationDetail && (
          <NotificationDetailModal
            notification={selectedNotificationDetail}
            lang={lang}
            user={user}
            onClose={() => closeOverlayViaBack(() => setSelectedNotificationDetail(null))}
            onDelete={handleDeleteNotification}
            onMarkAsRead={handleMarkNotificationAsRead}
            onOpenWeather={() => {
              sounds.playTap();
              setIsWeatherOpen(true);
              pushHistoryStep();
            }}
            onOpenPrayerTimes={() => {
              sounds.playTap();
              setPrayerInitialView('daily');
              setIsPrayerTimesOpen(true);
              pushHistoryStep();
            }}
            onOpenRamadanSchedule={() => {
              sounds.playTap();
              setPrayerInitialView('ramadan');
              setIsPrayerTimesOpen(true);
              pushHistoryStep();
            }}
            onEdit={(notif) => {
              setSelectedNotificationDetail(null);
              setEditingNotification(notif);
              setIsNotificationsOpen(true);
              pushHistoryStep();
            }}
          />
        )}

        {/* Profile Full View Modal */}
        {isProfileOpen && (
          <ProfileView
            user={user}
            lang={lang}
            theme={theme}
            adminAvatar={adminAvatar}
            onToggleTheme={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
            onLanguageChange={setLang}
            onUpdateAdminProfile={handleUpdateAdminProfile}
            onUpdateUserProfile={handleUpdateUserProfile}
            onBindMethods={handleBindMethods}
            onOpenLogin={openLoginView}
            onOpenChangePin={() => {
              if (user?.role === 'admin') {
                setIsChangePinOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onOpenRecycleBin={() => {
              if (user?.role === 'admin') {
                setIsRecycleBinOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onOpenAuditLog={() => {
              setIsAuditLogOpen(true);
              pushHistoryStep();
            }}
            onOpenBannerManager={() => {
              if (user?.role === 'admin') {
                setIsBannerManagerOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onOpenFooterSettings={() => {
              if (user?.role === 'admin') {
                setIsFooterSettingsOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onOpenNotifications={() => {
              setIsNotificationsOpen(true);
              pushHistoryStep();
            }}
            onOpenUserManagement={() => {
              if (user?.role === 'admin') {
                setIsUserManagementOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onOpenServiceManager={() => {
              setIsServiceManagerOpen(true);
              pushHistoryStep();
            }}
            onOpenPopupNoticeManager={() => {
              if (user?.role === 'admin') {
                setIsPopupNoticeManagerOpen(true);
                pushHistoryStep();
              } else {
                openLoginView();
              }
            }}
            onUpdateChecked={(res) => handleUpdateCheckResult(res, false)}
            onSubViewChange={(isSubView) => {
              isProfileSubViewActiveRef.current = isSubView;
            }}
            onLogout={handleLogout}
            onClose={() => closeOverlayViaBack(() => setIsProfileOpen(false))}
          />
        )}

        {/* Recycle Bin Modal */}
        {isRecycleBinOpen && (
          <RecycleBinModal
            isOpen={isRecycleBinOpen}
            transactions={transactions}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsRecycleBinOpen(false))}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            onEmptyTrash={handleEmptyTrash}
          />
        )}

        {/* Audit Log Modal */}
        {isAuditLogOpen && (
          <AuditLogModal
            isOpen={isAuditLogOpen}
            logs={auditLogs}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsAuditLogOpen(false))}
          />
        )}

        {/* Footer Settings Modal */}
        {isFooterSettingsOpen && (
          <FooterSettingsModal
            isOpen={isFooterSettingsOpen}
            config={footerConfig}
            banners={banners}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsFooterSettingsOpen(false))}
            onSave={(newCfg) => {
              setFooterConfig(newCfg);
              safeStorage.setItem('protyasha_footer', JSON.stringify(newCfg));
              cloudSet(['settings', 'footer_config'], {
                config: newCfg,
                updatedAt: new Date().toISOString()
              }).catch(() => {});
            }}
            onSaveBanners={(newBanners) => {
              handleSaveBanners(newBanners);
            }}
          />
        )}

        {/* Change PIN Modal */}
        {isChangePinOpen && (
          <ChangePinModal
            isOpen={isChangePinOpen}
            lang={lang}
            onClose={() => closeOverlayViaBack(() => setIsChangePinOpen(false))}
            onPinChanged={(newPin) => {
              safeStorage.setItem('protyasha_admin_pin', newPin);
              cloudSet(['settings', 'admin_security'], {
                pin: newPin,
                updatedAt: new Date().toISOString()
              }).catch(() => {});
              logAction('Changed PIN', 'পিন পরিবর্তন', 'Security PIN successfully updated');
            }}
          />
        )}

        {/* 7-Day Weather Forecast Modal with auto-location and animated conditions */}
        {isWeatherOpen && (
          <WeatherModal
            isOpen={isWeatherOpen}
            lang={lang}
            isAdmin={user?.role === 'admin'}
            onClose={() => closeOverlayViaBack(() => setIsWeatherOpen(false))}
            onSubViewChange={(isSubView) => {
              isWeatherSubViewActiveRef.current = isSubView;
            }}
            onSendWeatherNotification={(notif) => {
              handleSendNotification(notif);
            }}
            onLocationChanged={() => {
              import('./utils/weatherService').then(({ getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation }) => {
                const preferred = getUserPreferredDistrict();
                if (preferred) {
                  setCurrentDistrict(preferred);
                  fetchLiveWeather(true).then(w => {
                    if (w) setWeatherData(w);
                  });
                } else {
                  detectPreciseLocation().then(({ district }) => {
                    if (district) setCurrentDistrict(district);
                    fetchLiveWeather(true).then(w => {
                      if (w) setWeatherData(w);
                    });
                  });
                }
              }).catch(() => {});
            }}
          />
        )}

        {/* Location-based Prayer Times, Sehri/Iftar & Sunrise/Sunset Modal */}
        {isPrayerTimesOpen && (
          <PrayerTimesModal
            isOpen={isPrayerTimesOpen}
            lang={lang}
            isAdmin={user?.role === 'admin'}
            initialViewMode={prayerInitialView}
            onClose={() =>
              closeOverlayViaBack(() => {
                setIsPrayerTimesOpen(false);
                setPrayerInitialView('daily');
              })
            }
            onSendNotification={(notif) => {
              handleSendNotification(notif);
            }}
            onPushLocalNotification={handlePushLocalNotification}
            onLocationChanged={() => {
              import('./utils/weatherService').then(({ getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation }) => {
                const preferred = getUserPreferredDistrict();
                if (preferred) {
                  setCurrentDistrict(preferred);
                  fetchLiveWeather(true).then(w => {
                    if (w) setWeatherData(w);
                  });
                } else {
                  detectPreciseLocation().then(({ district }) => {
                    if (district) setCurrentDistrict(district);
                    fetchLiveWeather(true).then(w => {
                      if (w) setWeatherData(w);
                    });
                  });
                }
              }).catch(() => {});
            }}
            onSubViewActiveChange={(isSubView) => {
              isPrayerSubViewActiveRef.current = isSubView;
            }}
          />
        )}

        {/* Quick Hisab Dashboard Modal */}
        {isQuickHisabOpen && (
          <QuickHisabModal
            isOpen={isQuickHisabOpen}
            lang={lang}
            user={user}
            staffAccounts={staffAccounts}
            onSaveStaffAccounts={handleSaveStaffAccounts}
            quickHisabOwners={quickHisabOwners}
            onSaveOwners={handleSaveQuickHisabOwners}
            onClose={() => closeOverlayViaBack(() => setIsQuickHisabOpen(false))}
            onSubViewChange={(isSubView) => {
              isQuickHisabSubViewActiveRef.current = isSubView;
            }}
          />
        )}

        {/* Admin In-App Popup Notice & User Consent Manager Modal */}
        {user?.role === 'admin' && isPopupNoticeManagerOpen && (
          <AdminPopupNoticeModal
            isOpen={isPopupNoticeManagerOpen}
            notices={popupNotices}
            acknowledgementsByNotice={popupAcksByNotice}
            lang={lang}
            currentAdminName={user?.name || 'Admin'}
            onClose={() => closeOverlayViaBack(() => setIsPopupNoticeManagerOpen(false))}
            onSaveNotice={handleSavePopupNotice}
            onToggleNoticeActive={handleTogglePopupNoticeActive}
            onDeleteNotice={handleDeletePopupNotice}
            onPreviewNotice={(notice) => {
              setPreviewPopupNotice(notice);
              pushHistoryStep();
            }}
            onSubViewChange={(hasSubView) => {
              isPopupManagerSubViewActiveRef.current = hasSubView;
            }}
          />
        )}

        {/* User In-App Consent Notice Popup Box (Or Admin Preview) */}
        {!isLoginOpen && (previewPopupNotice || pendingUserPopupNotices.length > 0) && (
          <UserPopupNoticeModal
            notice={previewPopupNotice || pendingUserPopupNotices[0]}
            queueIndex={1}
            queueTotal={previewPopupNotice ? 1 : pendingUserPopupNotices.length}
            isPreviewMode={Boolean(previewPopupNotice)}
            isSubmitting={isSubmittingPopupAck}
            lang={lang}
            onAcknowledge={handleAcknowledgePopupNotice}
            onClosePreview={() => closeOverlayViaBack(() => setPreviewPopupNotice(null))}
          />
        )}
        </React.Suspense>

        {/* Ay-Byay Launching Animation Overlay with Branded Logo */}
        {isLaunchingAyByay && (
          <div className="fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 select-none">
            <div className="relative flex flex-col items-center text-center max-w-xs animate-in zoom-in-90 duration-300">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-3xl bg-gradient-to-tr from-emerald-500/40 via-teal-500/30 to-indigo-500/40 blur-2xl animate-pulse" />
                <div className="absolute w-28 h-28 rounded-3xl border-2 border-emerald-400/50 animate-ping opacity-60" />
                <div className="relative w-24 h-24 rounded-3xl bg-white shadow-2xl p-2.5 border-2 border-emerald-400 flex items-center justify-center overflow-hidden transform animate-bounce">
                  <img 
                    src={serviceStatuses.ayByay?.logoUrl || "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png"} 
                    alt="আয়-ব্যয় লোগো" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mb-1 drop-shadow-md">
                <span className="text-emerald-400">আয়</span>
                <span className="text-slate-300">-</span>
                <span className="text-rose-400">ব্যয়</span>
                <span className="text-white ml-2 text-lg font-bold">হিসাব খাতা</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium mb-4">
                স্মার্ট ব্যবস্থাপনা ও দৈনন্দিন খতিয়ান
              </p>
              <div className="w-48 h-2 rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60 shadow-inner">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full animate-pulse w-full" />
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-2.5 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
              </p>
            </div>
          </div>
        )}

        {/* Bill Manager Launching Animation Overlay with Branded Logo */}
        {isLaunchingBillManager && (
          <div className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 select-none">
            <div className="relative flex flex-col items-center text-center max-w-xs animate-in zoom-in-90 duration-300">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-3xl bg-gradient-to-tr from-orange-500/40 via-amber-500/30 to-rose-500/40 blur-2xl animate-pulse" />
                <div className="absolute w-28 h-28 rounded-3xl border-2 border-orange-400/50 animate-ping opacity-60" />
                <div className="relative w-24 h-24 rounded-3xl bg-white shadow-2xl p-2.5 border-2 border-orange-400 flex items-center justify-center overflow-hidden transform animate-bounce">
                  <img 
                    src={
                      serviceStatuses.billManager?.logoUrl &&
                      !serviceStatuses.billManager.logoUrl.includes('bill-manager.ai.studio')
                        ? serviceStatuses.billManager.logoUrl
                        : ((window as any).__PCN_ASSET_BASE__
                            ? `${(window as any).__PCN_ASSET_BASE__}bill-manager-logo.jpg`
                            : './bill-manager-logo.jpg')
                    } 
                    alt="বিল ম্যানেজার প্রো লগো" 
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mb-1 drop-shadow-md flex items-center gap-2 justify-center">
                <span className="text-orange-400">বিল ম্যানেজমেন্ট</span>
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">প্রো</span>
              </h3>
              <p className="text-xs text-slate-300 font-medium mb-4">
                স্মার্ট বিলিং ও কাস্টমার ড্যাশবোর্ড
              </p>
              <div className="w-48 h-2 rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60 shadow-inner">
                <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 rounded-full animate-pulse w-full" />
              </div>
              <p className="text-[11px] text-orange-400 font-semibold mt-2.5 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>ড্যাশবোর্ড লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
              </p>
            </div>
          </div>
        )}

        {/* Full-screen in-app portal viewer for Bill Management Pro / Income-Expense accounts */}
        {activePortal && (
          <div className="fixed inset-0 z-[60] bg-[#f0f4fa] dark:bg-slate-950 overflow-y-auto select-none animate-in fade-in duration-150">
            <React.Suspense
              fallback={
                <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-slate-600 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-full border-4 border-rose-500/30 border-t-rose-600 animate-spin" />
                  <p className="text-sm font-bold">পোর্টাল লোড হচ্ছে...</p>
                </div>
              }
            >
              {activePortal === 'ay-byay' ? (
                <AyByayPortal
                  onExit={() => closeOverlayViaBack(() => setActivePortal(null))}
                  staffAccounts={staffAccounts}
                  onSaveStaffAccounts={handleSaveStaffAccounts}
                  quickHisabOwners={quickHisabOwners}
                  onOpenDriveBackup={() => {
                    setIsDriveBackupOpen(true);
                    pushHistoryStep();
                  }}
                  currentUser={user}
                  onAdminLogin={handleAyByayAdminLogin}
                  onAdminLogout={handleAyByayAdminLogout}
                />
              ) : (
                <BillManagerPortal onExit={() => closeOverlayViaBack(() => setActivePortal(null))} />
              )}
            </React.Suspense>
          </div>
        )}
        {/* Custom Delete Confirmation Modal */}
        {deleteTrx && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'bn' ? 'মুছে ফেলতে চান?' : 'Confirm Delete?'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {lang === 'bn' ? 'এই লেনদেনটি রিসাইকেল বিনে স্থানান্তর করা হবে।' : 'This transaction will be moved to the recycle bin.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => closeOverlayViaBack(() => setDeleteTrx(null))}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold"
                >
                  {lang === 'bn' ? 'ঠিক আছে' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Non-blocking Floating Alert Toast (Fasting 10-Min Reminders / Permission Feedback) */}
        {appToast && (
          <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-[160] w-[92%] max-w-md rounded-2xl p-3.5 shadow-2xl border flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 ${
            appToast.tone === 'amber'
              ? 'bg-amber-950/95 border-amber-500/60 text-amber-50'
              : 'bg-emerald-950/95 border-emerald-500/60 text-emerald-50'
          }`}>
            <div className="min-w-0 space-y-0.5">
              <p className="text-xs font-black leading-snug">{appToast.title}</p>
              {appToast.body && (
                <p className="text-[11px] opacity-90 leading-snug line-clamp-2">{appToast.body}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAppToast(null)}
              className="text-xs font-bold px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
