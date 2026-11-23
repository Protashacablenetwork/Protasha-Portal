import React, { useEffect, useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  Globe,
  History,
  MessageCircle,
  Eye,
  EyeOff,
  User,
  UserCheck,
  Wrench,
  FilePlus2,
  ExternalLink,
  Settings2
} from 'lucide-react';
import { cloudSet, loadFirebase, loadFirestore } from '../utils/cloudBridge';
import {
  Language,
  SupportTicket,
  SupportTicketActivity,
  SupportTicketCategory,
  SupportTicketStatus
} from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { safeStorage } from '../utils/safeStorage';

export const TICKET_STAGES: {
  id: SupportTicketStatus;
  stepNum: number;
  numBn: string;
  labelBn: string;
  labelEn: string;
  shortBn: string;
  shortEn: string;
}[] = [
  {
    id: 'pending',
    stepNum: 1,
    numBn: '১',
    labelBn: '১. দাখিলকৃত',
    labelEn: '1. Submitted',
    shortBn: 'দাখিলকৃত',
    shortEn: 'Submitted'
  },
  {
    id: 'reviewing',
    stepNum: 2,
    numBn: '২',
    labelBn: '২. পর্যালোচনা',
    labelEn: '2. Reviewing',
    shortBn: 'পর্যালোচনা',
    shortEn: 'Reviewing'
  },
  {
    id: 'in_progress',
    stepNum: 3,
    numBn: '৩',
    labelBn: '৩. কাজ চলমান',
    labelEn: '3. In Progress',
    shortBn: 'কাজ চলমান',
    shortEn: 'In Progress'
  },
  {
    id: 'resolved',
    stepNum: 4,
    numBn: '৪',
    labelBn: '৪. সমাধানকৃত',
    labelEn: '4. Resolved',
    shortBn: 'সমাধানকৃত',
    shortEn: 'Resolved'
  }
];

export const CATEGORY_LABELS: Record<SupportTicketCategory, { bn: string; en: string }> = {
  line_cut: { bn: 'লাইন কাটা / ফাইবার', en: 'Line / Fiber Cut' },
  onu_router: { bn: 'অনু / রাউটার সমস্যা', en: 'ONU / Router Issue' },
  slow_net: { bn: 'নেট স্লো / বাফারিং', en: 'Slow Internet' },
  dish_signal: { bn: 'ডিস সিগন্যাল / চ্যানেল', en: 'Dish Signal Issue' },
  billing: { bn: 'বিল / পেমেন্ট সমস্যা', en: 'Billing Issue' },
  new_line: { bn: 'নতুন লাইন / শিফটিং', en: 'New Line / Shifting' },
  other: { bn: 'অন্যান্য সমস্যা', en: 'Other Issue' }
};

export const getTicketStageIndex = (status: SupportTicketStatus): number => {
  const idx = TICKET_STAGES.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
};

export const getTicketStatusLabel = (status: SupportTicketStatus, isBn: boolean): string => {
  const found = TICKET_STAGES.find((s) => s.id === status) || TICKET_STAGES[0];
  return isBn ? found.shortBn : found.shortEn;
};

const PUBLIC_TRACKING_BASE_URL_KEY = 'protyasha_public_tracking_base_url';
const SAFE_TICKET_ID_REGEX = /^[a-zA-Z0-9_.-]{1,128}$/;

export const sanitizePublicBaseUrl = (raw?: string | null): string => {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
};

export const getStoredPublicTrackingBaseUrl = (): string => {
  try {
    return sanitizePublicBaseUrl(safeStorage.getItem(PUBLIC_TRACKING_BASE_URL_KEY));
  } catch {
    return '';
  }
};

export const savePublicTrackingBaseUrl = async (rawUrl: string): Promise<string> => {
  const clean = sanitizePublicBaseUrl(rawUrl);
  try {
    if (clean) {
      safeStorage.setItem(PUBLIC_TRACKING_BASE_URL_KEY, clean);
    } else {
      safeStorage.removeItem(PUBLIC_TRACKING_BASE_URL_KEY);
    }
  } catch {}

  try {
    await cloudSet(['settings', 'public_tracking_config'], {
      id: 'public_tracking_config',
      customBaseUrl: clean,
      updatedAt: new Date().toISOString()
    });
  } catch {}

  return clean;
};

/**
 * Extracts a ticket tracking ID from ANY supported URL format across all hosts,
 * subfolders, CDNs, localhost, and file://:
 *  - ?track=<id> (even with extra params like &i=1 or &fbclid=...)
 *  - #track=<id> or #?track=<id>
 *  - #/track/<id>
 *  - /track/<id>
 */
export const extractTrackTicketIdFromLocation = (loc?: Location): string | null => {
  try {
    const target = loc || (typeof window !== 'undefined' ? window.location : null);
    if (!target) return null;

    // 1. Query parameter: ?track=<id>
    const searchParams = new URLSearchParams(target.search || '');
    const fromQuery = searchParams.get('track')?.trim();
    if (fromQuery && SAFE_TICKET_ID_REGEX.test(fromQuery)) {
      return fromQuery;
    }

    // 2. Hash formats: #track=<id>, #?track=<id>, #/track/<id>
    const rawHash = (target.hash || '').replace(/^#/, '').trim();
    if (rawHash) {
      if (rawHash.startsWith('/track/')) {
        const candidate = decodeURIComponent(rawHash.slice('/track/'.length).split(/[?#&/]/)[0] || '').trim();
        if (candidate && SAFE_TICKET_ID_REGEX.test(candidate)) return candidate;
      }
      const normalizedHashQuery = rawHash.startsWith('?') ? rawHash.slice(1) : rawHash;
      const hashParams = new URLSearchParams(normalizedHashQuery);
      const fromHash = hashParams.get('track')?.trim();
      if (fromHash && SAFE_TICKET_ID_REGEX.test(fromHash)) {
        return fromHash;
      }
    }

    // 3. Clean path format: /track/<id> or /subfolder/track/<id>
    const pathMatch = (target.pathname || '').match(/\/track\/([a-zA-Z0-9_-]{1,128})(?:\/)?$/);
    if (pathMatch && pathMatch[1] && SAFE_TICKET_ID_REGEX.test(pathMatch[1])) {
      return pathMatch[1];
    }

    return null;
  } catch {
    return null;
  }
};

export const clearTrackFromCurrentUrl = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('track');
    if (url.hash && /track[=/]/i.test(url.hash)) {
      url.hash = '';
    }
    if (/\/track\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/track\/[a-zA-Z0-9_-]+\/?$/, '/');
    }
    const nextUrl =
      url.protocol === 'file:'
        ? url.href
        : `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({ appRoot: true }, '', nextUrl);
  } catch {}
};

/**
 * Dynamically builds a universal tracking link that works automatically on ANY host
 * (cPanel, Hostinger, Vercel, Netlify, GitHub Pages, Firebase Hosting, Cloud Run,
 * subfolder hosting, localhost, LAN IP, or file://), or uses an optional custom domain.
 */
export const buildPublicTrackingUrl = (ticketId: string, customBaseUrlOverride?: string): string => {
  const safeId = encodeURIComponent(ticketId);
  const customBase = sanitizePublicBaseUrl(
    customBaseUrlOverride !== undefined ? customBaseUrlOverride : getStoredPublicTrackingBaseUrl()
  );

  if (customBase) {
    return `${customBase}/?track=${safeId}`;
  }

  if (typeof window === 'undefined') return `?track=${safeId}`;

  try {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    // Normalize if currently viewing a /track/<id> path
    if (/\/track\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/track\/[a-zA-Z0-9_-]+\/?$/, '/');
    }
    // For local file:// opening, hash routing works without a server
    if (url.protocol === 'file:') {
      url.hash = `track=${safeId}`;
      return url.toString();
    }
    url.searchParams.set('track', ticketId);
    return url.toString();
  } catch {
    return `?track=${safeId}`;
  }
};

export const formatTicketDateTime = (iso?: string | null, isBn = true): string => {
  if (!iso) return isBn ? 'সময় উল্লেখ নেই' : 'N/A';
  try {
    const d = new Date(iso);
    const datePart = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timePart = d.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${datePart}, ${timePart}`;
  } catch {
    return iso.slice(0, 16);
  }
};

export const getTicketRoleLabel = (role?: string | null, isBn = true): string => {
  if (!role) return '';
  if (role === 'admin') return isBn ? 'অ্যাডমিন' : 'Admin';
  if (role === 'sub-admin') return isBn ? 'সাব-এডমিন' : 'Sub-Admin';
  if (role === 'staff') return isBn ? 'স্টাফ' : 'Staff';
  if (role === 'user') return isBn ? 'ইউজার' : 'User';
  if (role === 'visitor') return isBn ? 'গ্রাহক' : 'Customer';
  return role;
};

export const copyTextSafely = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
};

/**
 * Ensures older tickets without activityHistory still display an accurate Activity History timeline.
 */
export const resolveTicketActivities = (ticket: SupportTicket): SupportTicketActivity[] => {
  if (Array.isArray(ticket.activityHistory) && ticket.activityHistory.length > 0) {
    return [...ticket.activityHistory].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  const fallback: SupportTicketActivity[] = [
    {
      id: `act_created_${ticket.id}`,
      action: 'created',
      titleBn: '১. অভিযোগ দাখিল করা হয়েছে',
      titleEn: '1. Complaint submitted',
      actorName: ticket.createdBy || 'অ্যাডমিন',
      actorRole: ticket.createdByRole || 'admin',
      note: ticket.description || undefined,
      status: 'pending',
      timestamp: ticket.createdAt
    }
  ];

  if (ticket.assignedStaffName) {
    fallback.push({
      id: `act_assigned_${ticket.id}`,
      action: 'assigned',
      titleBn: `টেকনিশিয়ান অ্যাসাইন: ${ticket.assignedStaffName}`,
      titleEn: `Assigned technician: ${ticket.assignedStaffName}`,
      actorName: ticket.createdBy || 'অ্যাডমিন',
      status: ticket.status === 'pending' ? 'in_progress' : ticket.status,
      timestamp: ticket.updatedAt || ticket.createdAt
    });
  }

  if (ticket.status === 'resolved') {
    fallback.push({
      id: `act_resolved_${ticket.id}`,
      action: 'resolved',
      titleBn: '৪. অভিযোগটি সমাধানকৃত হয়েছে',
      titleEn: '4. Complaint resolved',
      actorName: ticket.resolvedBy || ticket.assignedStaffName || 'অ্যাডমিন',
      actorRole: ticket.resolvedByRole || 'admin',
      note: ticket.resolutionNote || undefined,
      status: 'resolved',
      timestamp: ticket.resolvedAt || ticket.updatedAt || ticket.createdAt
    });
  }

  return fallback.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// =========================================================================
// 4-STEP HORIZONTAL PROGRESS STEPPER
// ১. দাখিলকৃত → ২. পর্যালোচনা → ৩. কাজ চলমান → ৪. সমাধানকৃত
// =========================================================================
interface TicketProgressStepperProps {
  status: SupportTicketStatus;
  lang: Language;
  interactive?: boolean;
  onSelectStatus?: (nextStatus: SupportTicketStatus) => void;
  compact?: boolean;
}

export const TicketProgressStepper: React.FC<TicketProgressStepperProps> = ({
  status,
  lang,
  interactive = false,
  onSelectStatus,
  compact = false
}) => {
  const isBn = lang === 'bn';
  const currentIdx = getTicketStageIndex(status);
  const progressPct = (currentIdx / (TICKET_STAGES.length - 1)) * 100;

  return (
    <div className={compact ? 'py-1' : 'p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs'}>
      <div className="relative">
        {/* Background Rail */}
        <div
          className="absolute top-4 left-[12.5%] right-[12.5%] h-1 rounded-full bg-slate-200 dark:bg-slate-800"
          aria-hidden="true"
        />
        {/* Active Progress Rail */}
        <div
          className={`absolute top-4 left-[12.5%] h-1 rounded-full transition-all duration-300 ${
            status === 'resolved' ? 'bg-emerald-500' : 'bg-[#E52E2E]'
          }`}
          style={{ width: `${progressPct * 0.75}%` }}
          aria-hidden="true"
        />

        {/* 4 Steps */}
        <div className="grid grid-cols-4 gap-1 relative z-10">
          {TICKET_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIdx || (idx === 3 && currentIdx === 3);
            const isCurrent = idx === currentIdx;
            const isResolvedCurrent = isCurrent && stage.id === 'resolved';

            const circleClass = isResolvedCurrent
              ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-500/20'
              : isCompleted
                ? status === 'resolved'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#E52E2E] text-white border-[#E52E2E]'
                : isCurrent
                  ? 'bg-[#E52E2E] text-white border-[#E52E2E] ring-4 ring-rose-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700';

            const labelClass = isCurrent
              ? isResolvedCurrent
                ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'text-slate-900 dark:text-white font-extrabold'
              : isCompleted
                ? 'text-slate-800 dark:text-slate-200 font-bold'
                : 'text-slate-400 dark:text-slate-500 font-semibold';

            const Wrapper: any = interactive ? 'button' : 'div';

            return (
              <Wrapper
                key={stage.id}
                {...(interactive
                  ? {
                      type: 'button',
                      onClick: () => {
                        sounds.playTap();
                        onSelectStatus?.(stage.id);
                      }
                    }
                  : {})}
                className={`flex flex-col items-center text-center group ${
                  interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${circleClass}`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.8]" />
                  ) : (
                    <span>{isBn ? stage.numBn : stage.stepNum}</span>
                  )}
                </div>
                <span className={`mt-1.5 text-[10px] sm:text-[11px] leading-tight ${labelClass}`}>
                  {isBn ? stage.labelBn : stage.labelEn}
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// ACTIVITY HISTORY TIMELINE (অ্যাক্টিভিটি হিস্টোরি)
// =========================================================================
interface TicketActivityTimelineProps {
  ticket: SupportTicket;
  lang: Language;
}

export const TicketActivityTimeline: React.FC<TicketActivityTimelineProps> = ({ ticket, lang }) => {
  const isBn = lang === 'bn';
  const activities = resolveTicketActivities(ticket);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'অ্যাক্টিভিটি হিস্টোরি' : 'Activity History'}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {isBn
                ? `মোট ${toBengaliNumber(activities.length)}টি আপডেট রেকর্ড`
                : `${activities.length} recorded updates`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.map((item, idx) => {
          const isResolvedItem = item.action === 'resolved' || item.status === 'resolved';
          const isCreatedItem = item.action === 'created';
          const isAssignedItem = item.action === 'assigned';

          const dotClass = isResolvedItem
            ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-900'
            : isCreatedItem
              ? 'bg-rose-500 border-rose-200 dark:border-rose-900'
              : isAssignedItem
                ? 'bg-indigo-500 border-indigo-200 dark:border-indigo-900'
                : 'bg-amber-500 border-amber-200 dark:border-amber-900';

          return (
            <div key={item.id || idx} className="relative">
              <span
                className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 ${dotClass}`}
              />
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-2.5 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug flex items-center gap-1.5">
                    {isResolvedItem ? (
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : isAssignedItem ? (
                      <Wrench className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : isCreatedItem ? (
                      <FilePlus2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span>{isBn ? item.titleBn : item.titleEn}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <User className="w-3 h-3 text-slate-400" />
                    {item.actorName}
                    {item.actorRole ? ` (${getTicketRoleLabel(item.actorRole, isBn)})` : ''}
                  </span>
                  <span className="tabular-nums font-medium">
                    {formatTicketDateTime(item.timestamp, isBn)}
                  </span>
                </div>

                {item.note && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// ONLINE TRACKING & PUBLIC SHARE LINK CARD
// অনলাইন ট্র্যাকিং ও পাবলিক লিংক — সবার জন্য দৃশ্যমান
// =========================================================================
interface PublicTrackingShareCardProps {
  ticket: SupportTicket;
  lang: Language;
  canToggleVisibility?: boolean;
  onToggleVisibility?: (enabled: boolean) => void;
  onPreviewPublicLink?: () => void;
}

export const PublicTrackingShareCard: React.FC<PublicTrackingShareCardProps> = ({
  ticket,
  lang,
  canToggleVisibility = false,
  onToggleVisibility,
  onPreviewPublicLink
}) => {
  const isBn = lang === 'bn';
  const [copied, setCopied] = useState(false);
  const [customBaseUrl, setCustomBaseUrl] = useState<string>(() => getStoredPublicTrackingBaseUrl());
  const [showDomainConfig, setShowDomainConfig] = useState(false);
  const [domainInput, setDomainInput] = useState<string>(() => getStoredPublicTrackingBaseUrl());
  const [savingDomain, setSavingDomain] = useState(false);

  // Sync optional custom domain config live from Firestore across all devices/hosts
  useEffect(() => {
    let active = true;
    let unsub: (() => void) | null = null;
    Promise.all([loadFirebase(), loadFirestore()])
      .then(([{ db }, { doc, onSnapshot }]) => {
        if (!active) return;
        unsub = onSnapshot(
          doc(db, 'settings', 'public_tracking_config'),
          (snap) => {
            if (snap.exists()) {
              const remoteBase = sanitizePublicBaseUrl((snap.data() as any)?.customBaseUrl);
              setCustomBaseUrl(remoteBase);
              setDomainInput(remoteBase);
              try {
                if (remoteBase) safeStorage.setItem(PUBLIC_TRACKING_BASE_URL_KEY, remoteBase);
                else safeStorage.removeItem(PUBLIC_TRACKING_BASE_URL_KEY);
              } catch {}
            }
          },
          () => {}
        );
      })
      .catch(() => {});
    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, []);

  const isPublic = ticket.isPublicTrackingEnabled !== false;
  const trackingUrl = buildPublicTrackingUrl(ticket.id, customBaseUrl);
  const currentHostLabel =
    typeof window !== 'undefined'
      ? customBaseUrl
        ? customBaseUrl.replace(/^https?:\/\//i, '')
        : window.location.host || 'localhost'
      : 'auto';

  const handleCopy = async () => {
    sounds.playSuccess();
    const ok = await copyTextSafely(trackingUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSaveCustomDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDomain(true);
    try {
      const saved = await savePublicTrackingBaseUrl(domainInput);
      setCustomBaseUrl(saved);
      setDomainInput(saved);
      sounds.playSuccess();
      setShowDomainConfig(false);
    } finally {
      setSavingDomain(false);
    }
  };

  const whatsappShareText = isBn
    ? `প্রত্যাশা ক্যাবল নেটওয়ার্ক — অভিযোগ লাইভ ট্র্যাকিং\nটিকেট নং: #${ticket.ticketNumber}\nগ্রাহক: ${ticket.customerName}\nবর্তমান অবস্থা: ${getTicketStatusLabel(ticket.status, true)}\nলাইভ আপডেট দেখতে লিংকটিতে ক্লিক করুন:\n${trackingUrl}`
    : `Protasha Cable Network — Live Support Tracking\nTicket: #${ticket.ticketNumber}\nCustomer: ${ticket.customerName}\nStatus: ${getTicketStatusLabel(ticket.status, false)}\nTrack live updates here:\n${trackingUrl}`;

  const cleanPhone = (ticket.customerPhone || '').replace(/[^\d]/g, '');
  const normalizedPhone = cleanPhone.startsWith('88')
    ? cleanPhone
    : cleanPhone.startsWith('0')
      ? `88${cleanPhone}`
      : cleanPhone;

  const whatsappHref = normalizedPhone
    ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(whatsappShareText)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/90 via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-sky-200/80 dark:border-indigo-900/60 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Globe className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-1.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                {isBn ? 'অনলাইন ট্র্যাকিং ও পাবলিক লিংক' : 'Online Tracking & Public Link'}
              </h4>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                  isPublic
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}
              >
                {isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>
                  {isPublic
                    ? isBn
                      ? 'সবার জন্য দৃশ্যমান'
                      : 'Publicly Visible'
                    : isBn
                      ? 'পাবলিক লিংক বন্ধ'
                      : 'Link Paused'}
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {isBn
                ? 'যেকোনো ব্রাউজার, হোস্টিং সাইট বা লোকালহোস্ট থেকে এই অভিযোগের লাইভ আপডেট দেখতে লিংকটি কপি করে শেয়ার করুন।'
                : 'Copy and share this link to view live updates from any browser, hosting domain, or localhost.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canToggleVisibility && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setShowDomainConfig((v) => !v);
              }}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              title={isBn ? 'কাস্টম হোস্টিং ডোমেইন সেট করুন (ঐচ্ছিক)' : 'Optional custom domain'}
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          )}
          {canToggleVisibility && onToggleVisibility && (
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onToggleVisibility(!isPublic);
              }}
              className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {isPublic ? (isBn ? 'বন্ধ করুন' : 'Disable') : isBn ? 'চালু করুন' : 'Enable'}
            </button>
          )}
        </div>
      </div>

      {/* Active Hosting Mode Pill */}
      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-sky-100 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
        <span className="truncate">
          {customBaseUrl
            ? isBn
              ? `কাস্টম ডোমেইন: ${currentHostLabel}`
              : `Custom Domain: ${currentHostLabel}`
            : isBn
              ? `অটো হোস্ট (সব সাইট ও লোকালহোস্ট): ${currentHostLabel}`
              : `Auto Host (All Sites & Localhost): ${currentHostLabel}`}
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
          {isBn ? '● লাইভ ক্লাউড সিঙ্ক' : '● Live Cloud Sync'}
        </span>
      </div>

      {/* Optional Custom Domain Config (for sharing a live site URL while on localhost) */}
      {canToggleVisibility && showDomainConfig && (
        <form
          onSubmit={handleSaveCustomDomain}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-2"
        >
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
            {isBn
              ? 'কাস্টম পাবলিক ডোমেইন (ঐচ্ছিক — খালি রাখলে বর্তমান হোস্ট/লোকালহোস্ট অটো ব্যবহার হবে)'
              : 'Optional Custom Base URL (leave empty to auto-use current host/localhost)'}
          </p>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="https://yourdomain.com"
              className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={savingDomain}
              className="h-9 px-3 rounded-lg bg-indigo-600 text-white text-xs font-extrabold cursor-pointer shrink-0"
            >
              {isBn ? 'সেভ' : 'Save'}
            </button>
            {customBaseUrl && (
              <button
                type="button"
                onClick={async () => {
                  setDomainInput('');
                  const cleared = await savePublicTrackingBaseUrl('');
                  setCustomBaseUrl(cleared);
                  setShowDomainConfig(false);
                }}
                className="h-9 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer shrink-0"
              >
                {isBn ? 'অটো' : 'Auto'}
              </button>
            )}
          </div>
        </form>
      )}

      {/* Copyable URL Display */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          readOnly
          value={trackingUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 bg-transparent text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none truncate px-1"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`h-8 px-3 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : isBn ? 'লিংক কপি' : 'Copy'}</span>
        </button>
      </div>

      {/* Share & Preview Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{isBn ? 'WhatsApp-এ শেয়ার' : 'Share on WhatsApp'}</span>
        </a>

        {onPreviewPublicLink ? (
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onPreviewPublicLink();
            }}
            className="h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{isBn ? 'পাবলিক পেজ দেখুন' : 'Open Public View'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{copied ? (isBn ? 'কপি সম্পন্ন' : 'Copied') : isBn ? 'লিংক কপি করুন' : 'Copy Link'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
