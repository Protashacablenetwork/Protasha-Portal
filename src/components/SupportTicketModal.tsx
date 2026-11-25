import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Phone,
  MessageCircle,
  MessageSquare,
  Send,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  UserCheck,
  Edit3,
  Trash2,
  X,
  Filter,
  Headphones,
  Check,
  FileText,
  History,
  Link2,
  Eye,
  BarChart3,
  KeyRound,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, safeSetDoc, safeDeleteDoc, handleFirestoreError, OperationType } from '../utils/firebase';
import {
  Language,
  StaffAccount,
  StaffSupportSession,
  SupportTicket,
  SupportTicketActivity,
  SupportTicketCategory,
  SupportTicketMessage,
  SupportTicketPriority,
  SupportTicketStatus,
  UserSession
} from '../types';
import { isActualStaffAccount } from '../utils/ownerDueSync';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import {
  canModifyOwnedRecord,
  canModifySupportTicket,
  formatRemainingCountdown,
  hasSubAdminPermission,
  isSupportTicketOwner,
  normalizePhoneNumber,
  SUB_ADMIN_EDIT_WINDOW_MS,
  SUPPORT_TICKET_EDIT_WINDOW_MS
} from '../utils/permissions';
import {
  CATEGORY_LABELS,
  PublicTrackingShareCard,
  TICKET_STAGES,
  TicketActivityTimeline,
  TicketProgressStepper,
  buildPublicTrackingUrl,
  copyTextSafely,
  formatTicketDateTime,
  getTicketRoleLabel,
  getTicketStatusLabel
} from './TicketTrackingHelpers';
import { TicketReportView } from './TicketReportView';
import { findMatchedStaffForUser } from '../utils/staffSync';

interface SupportTicketModalProps {
  isOpen: boolean;
  tickets: SupportTicket[];
  staffAccounts: StaffAccount[];
  lang: Language;
  user: UserSession | null;
  onClose: () => void;
  onSaveTicket: (ticket: SupportTicket) => Promise<void>;
  onDeleteTicket: (id: string) => Promise<void>;
  onSubViewChange?: (isSubView: boolean) => void;
  onPreviewPublicLink?: (ticketId: string) => void;
  onLogAction?: (action: string, actionBn: string, details: string) => void;
}

const CATEGORY_OPTIONS: {
  id: SupportTicketCategory;
  labelBn: string;
  labelEn: string;
}[] = (Object.keys(CATEGORY_LABELS) as SupportTicketCategory[]).map((id) => ({
  id,
  labelBn: CATEGORY_LABELS[id].bn,
  labelEn: CATEGORY_LABELS[id].en
}));

const PRIORITY_OPTIONS: {
  id: SupportTicketPriority;
  labelBn: string;
  labelEn: string;
  badgeClass: string;
}[] = [
  {
    id: 'urgent',
    labelBn: 'জরুরি',
    labelEn: 'Urgent',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  {
    id: 'high',
    labelBn: 'উচ্চ',
    labelEn: 'High',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  {
    id: 'normal',
    labelBn: 'সাধারণ',
    labelEn: 'Normal',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  }
];

const QUICK_REPLIES_BN = [
  'অভিযোগ পর্যালোচনা করা হচ্ছে',
  'টেকনিশিয়ান রওনা হয়েছে',
  'লাইন চেক করা হচ্ছে',
  'সমস্যা সমাধান হয়েছে'
];

const QUICK_REPLIES_EN = [
  'Under review now',
  'Technician on the way',
  'Checking line now',
  'Issue resolved'
];

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  tickets,
  staffAccounts,
  lang,
  user,
  onClose,
  onSaveTicket,
  onDeleteTicket,
  onSubViewChange,
  onPreviewPublicLink
}) => {
  const isBn = lang === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportTicketStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | SupportTicketCategory>('all');

  // Add / Edit form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState<SupportTicketCategory>('line_cut');
  const [priority, setPriority] = useState<SupportTicketPriority>('normal');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [description, setDescription] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Inline delete confirm, quick copy, & resolve prompt state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [quickResolveNote, setQuickResolveNote] = useState('');
  const [quickResolverName, setQuickResolverName] = useState('');
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // Ticket Detail Drawer (Real-time Chat + Activity History + Public Link)
  const [activeDetailTicketId, setActiveDetailTicketId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'chat' | 'tracking'>('chat');
  const [chatMessages, setChatMessages] = useState<SupportTicketMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Dedicated Staff Support Login Session (allows staff to view all complaints & update status)
  const [staffSession, setStaffSession] = useState<StaffSupportSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('protyasha_support_staff_session');
      if (saved) return JSON.parse(saved) as StaffSupportSession;
    } catch {}
    return null;
  });
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [staffLoginIdentifier, setStaffLoginIdentifier] = useState('');
  const [staffLoginPin, setStaffLoginPin] = useState('');
  const [staffLoginError, setStaffLoginError] = useState('');
  const [isVerifyingStaff, setIsVerifyingStaff] = useState(false);

  // Admin Staff PIN Settings (stored in Firestore settings/staff_support_auth)
  const [staffAuthConfig, setStaffAuthConfig] = useState<{
    globalPin: string;
    staffPins: Record<string, string>;
  }>({ globalPin: '1234', staffPins: {} });
  const [isStaffPinModalOpen, setIsStaffPinModalOpen] = useState(false);
  const [editGlobalStaffPin, setEditGlobalStaffPin] = useState('1234');
  const [editPerStaffPins, setEditPerStaffPins] = useState<Record<string, string>>({});
  const [isSavingStaffPin, setIsSavingStaffPin] = useState(false);
  const [staffPinSavedNotice, setStaffPinSavedNotice] = useState('');

  // Category Monthly/Yearly Report View
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Live 1-second clock for the 10-minute edit/delete window countdown
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // Hardware/Browser Back Button Sub-View History Tracking
  const subViewHistoryDepthRef = useRef(0);
  const subViewStateRef = useRef({
    activeDetailTicketId,
    isFormOpen,
    isReportOpen,
    isStaffLoginOpen,
    isStaffPinModalOpen
  });
  subViewStateRef.current = {
    activeDetailTicketId,
    isFormOpen,
    isReportOpen,
    isStaffLoginOpen,
    isStaffPinModalOpen
  };

  const isVisitor = user?.role === 'visitor';
  const isAdmin = user?.role === 'admin';
  const isSubAdminUser = user?.role === 'sub-admin';
  const isStaffRoleUser = user?.role === 'staff';
  const hasSubAdminSupportPerm = isSubAdminUser && hasSubAdminPermission(user, 'supportTickets');
  const matchedMainStaff = useMemo(
    () => (hasSubAdminSupportPerm ? findMatchedStaffForUser(user, staffAccounts) : null),
    [hasSubAdminSupportPerm, user, staffAccounts]
  );
  const isMainPageStaff = hasSubAdminSupportPerm;
  const isManualTempStaffSession =
    Boolean(staffSession) && !isMainPageStaff && !isAdmin && !isStaffRoleUser && !isSubAdminUser;
  const isStaffActive = isMainPageStaff || isManualTempStaffSession;
  const canViewAllTickets = isAdmin || isSubAdminUser || isStaffRoleUser || isManualTempStaffSession;
  const canMutateTickets = isAdmin || hasSubAdminSupportPerm || isManualTempStaffSession;
  const canChangeStatusForTicket = (ticket: SupportTicket) => {
    if (isAdmin || isManualTempStaffSession) return true;
    if (!hasSubAdminSupportPerm) return false;
    return canModifySupportTicket(ticket, user, null, nowTick).allowed;
  };
  const canDeleteMessageForUser = (msg: SupportTicketMessage) => {
    if (isAdmin || isManualTempStaffSession) return true;
    if (!hasSubAdminSupportPerm) return false;
    return canModifyOwnedRecord(
      { createdAt: msg.createdAt, senderId: msg.senderId },
      user,
      'supportTickets',
      nowTick
    ).allowed;
  };

  const activeActorName = (
    (isManualTempStaffSession ? staffSession?.name : undefined) ||
    matchedMainStaff?.name ||
    user?.name ||
    staffSession?.name ||
    (isBn ? 'অ্যাডমিন' : 'Admin')
  ).slice(0, 128);
  const activeActorRole: 'admin' | 'sub-admin' | 'staff' | 'user' | 'visitor' = isAdmin
    ? 'admin'
    : isSubAdminUser
      ? 'sub-admin'
      : isStaffActive
        ? 'staff'
        : user?.role || 'user';
  const activeActorId = (
    (isManualTempStaffSession ? staffSession?.staffId : undefined) ||
    matchedMainStaff?.id ||
    user?.id ||
    staffSession?.staffId ||
    user?.phone ||
    ''
  ).slice(0, 128);
  const activeActorPhone = (
    (isManualTempStaffSession ? staffSession?.phone : undefined) ||
    matchedMainStaff?.phone ||
    user?.phone ||
    staffSession?.phone ||
    ''
  ).slice(0, 32);

  // Clear manual staff PIN session automatically if Admin, Sub-Admin, Staff role, or logged out
  useEffect(() => {
    if (isAdmin || isSubAdminUser || isStaffRoleUser || !user) {
      if (staffSession) {
        setStaffSession(null);
        try {
          sessionStorage.removeItem('protyasha_support_staff_session');
        } catch {}
      }
    }
  }, [isAdmin, isSubAdminUser, isStaffRoleUser, user, staffSession]);

  // Listen to Firestore settings/staff_support_auth for Staff Login PIN configuration
  useEffect(() => {
    if (!isOpen) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(
        doc(db, 'settings', 'staff_support_auth'),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as { globalPin?: string; staffPins?: Record<string, string> };
            setStaffAuthConfig({
              globalPin: String(data.globalPin || '1234'),
              staffPins: data.staffPins && typeof data.staffPins === 'object' ? data.staffPins : {}
            });
          }
        },
        () => {}
      );
    } catch {}
    return () => {
      if (unsub) unsub();
    };
  }, [isOpen]);

  // Scope visible tickets: Admin & logged-in Staff see ALL; regular app users see ONLY their own complaints
  const visibleTickets = useMemo(() => {
    if (canViewAllTickets) return tickets;
    if (!user || isVisitor) return [];
    return tickets.filter((t) => isSupportTicketOwner(t, user, staffSession));
  }, [tickets, canViewAllTickets, user, isVisitor, staffSession]);

  // Tick every second only when a non-admin has at least one owned ticket within the edit window (30m for Sub-Admin, 10m otherwise)
  const hasActiveCountdownTicket = useMemo(() => {
    if (!isOpen || isAdmin) return false;
    const now = Date.now();
    const activeWindowMs = isSubAdminUser ? SUB_ADMIN_EDIT_WINDOW_MS : SUPPORT_TICKET_EDIT_WINDOW_MS;
    return visibleTickets.some((t) => {
      if (!isSupportTicketOwner(t, user, staffSession)) return false;
      const createdMs = t.createdAt ? new Date(t.createdAt).getTime() : 0;
      return createdMs > 0 && now - createdMs <= activeWindowMs + 2000;
    });
  }, [isOpen, isAdmin, isSubAdminUser, visibleTickets, user, staffSession]);

  useEffect(() => {
    if (!hasActiveCountdownTicket) return;
    setNowTick(Date.now());
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hasActiveCountdownTicket]);

  const activeDetailTicket = useMemo(
    () => (activeDetailTicketId ? visibleTickets.find((t) => t.id === activeDetailTicketId) || null : null),
    [visibleTickets, activeDetailTicketId]
  );

  // Notify parent App.tsx whenever an internal sub-view is open
  useEffect(() => {
    const hasSubView =
      isOpen &&
      (Boolean(activeDetailTicketId) ||
        isFormOpen ||
        isReportOpen ||
        isStaffLoginOpen ||
        isStaffPinModalOpen);
    onSubViewChange?.(hasSubView);
    return () => {
      onSubViewChange?.(false);
    };
  }, [
    isOpen,
    activeDetailTicketId,
    isFormOpen,
    isReportOpen,
    isStaffLoginOpen,
    isStaffPinModalOpen,
    onSubViewChange
  ]);

  // Reset sub-views if modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveDetailTicketId(null);
      setIsFormOpen(false);
      setIsReportOpen(false);
      setIsStaffLoginOpen(false);
      setIsStaffPinModalOpen(false);
      subViewHistoryDepthRef.current = 0;
    }
  }, [isOpen]);

  // Device Hardware / Browser Back Button listener for Support Ticket sub-views
  useEffect(() => {
    if (!isOpen) return;

    const handleSubViewPopState = () => {
      const {
        activeDetailTicketId: detailId,
        isFormOpen: formOpen,
        isReportOpen: reportOpen,
        isStaffLoginOpen: staffLoginOpen,
        isStaffPinModalOpen: pinModalOpen
      } = subViewStateRef.current;

      if (pinModalOpen) {
        setIsStaffPinModalOpen(false);
        subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      } else if (staffLoginOpen) {
        setIsStaffLoginOpen(false);
        subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      } else if (formOpen) {
        setIsFormOpen(false);
        subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      } else if (reportOpen) {
        setIsReportOpen(false);
        subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      } else if (detailId) {
        setActiveDetailTicketId(null);
        setChatInput('');
        setConfirmDeleteMsgId(null);
        subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      }
    };

    window.addEventListener('popstate', handleSubViewPopState);
    return () => window.removeEventListener('popstate', handleSubViewPopState);
  }, [isOpen]);

  const pushSubViewHistory = () => {
    window.history.pushState({ supportSubView: true, time: Date.now() }, '');
    subViewHistoryDepthRef.current += 1;
  };

  const closeSubViewViaBack = (fallbackClose: () => void) => {
    sounds.playTap();
    if (subViewHistoryDepthRef.current > 0 && window.history.state?.supportSubView) {
      window.history.back();
    } else {
      subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      fallbackClose();
    }
  };

  // Real-time Firestore listener for the active ticket's messages subcollection
  useEffect(() => {
    if (!isOpen || !activeDetailTicketId) {
      setChatMessages([]);
      setChatLoading(false);
      return;
    }

    setChatLoading(true);
    let unsubscribe: (() => void) | null = null;
    try {
      const q = query(
        collection(db, 'support_tickets', activeDetailTicketId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: SupportTicketMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as SupportTicketMessage;
            if (data && data.text) {
              list.push({ ...data, id: String(data.id || docSnap.id) });
            }
          });
          setChatMessages(list);
          setChatLoading(false);
        },
        (err) => {
          setChatLoading(false);
          handleFirestoreError(err, OperationType.LIST, `support_tickets/${activeDetailTicketId}/messages`);
        }
      );
    } catch (e) {
      console.warn('Ticket chat listener setup notice:', e);
      setChatLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen, activeDetailTicketId]);

  useEffect(() => {
    if (activeDetailTicketId && detailTab === 'chat' && chatMessages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeDetailTicketId, detailTab, chatMessages.length]);

  const stats = useMemo(() => {
    let pending = 0;
    let reviewing = 0;
    let inProgress = 0;
    let resolved = 0;
    visibleTickets.forEach((t) => {
      if (t.status === 'pending') pending++;
      else if (t.status === 'reviewing') reviewing++;
      else if (t.status === 'in_progress') inProgress++;
      else if (t.status === 'resolved') resolved++;
    });
    return {
      total: visibleTickets.length,
      pending,
      reviewing,
      inProgress,
      resolved,
      open: pending + reviewing + inProgress
    };
  }, [visibleTickets]);

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const priorityRank: Record<SupportTicketPriority, number> = {
      urgent: 0,
      high: 1,
      normal: 2
    };
    const statusRank: Record<SupportTicketStatus, number> = {
      pending: 0,
      reviewing: 1,
      in_progress: 2,
      resolved: 3
    };

    return visibleTickets
      .filter((t) => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        if (!q) return true;
        return (
          (t.customerName || '').toLowerCase().includes(q) ||
          (t.customerPhone || '').toLowerCase().includes(q) ||
          (t.customerCode || '').toLowerCase().includes(q) ||
          (t.area || '').toLowerCase().includes(q) ||
          (t.ticketNumber || '').toLowerCase().includes(q) ||
          (t.assignedStaffName || '').toLowerCase().includes(q) ||
          (t.createdBy || '').toLowerCase().includes(q) ||
          (t.resolvedBy || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (statusRank[a.status] !== statusRank[b.status]) {
          return statusRank[a.status] - statusRank[b.status];
        }
        if (a.status !== 'resolved' && priorityRank[a.priority] !== priorityRank[b.priority]) {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      });
  }, [visibleTickets, searchQuery, statusFilter, categoryFilter]);

  if (!isOpen) return null;

  const getCategoryLabel = (cat: SupportTicketCategory) => {
    const found = CATEGORY_LABELS[cat];
    return found ? (isBn ? found.bn : found.en) : cat;
  };

  const getPriorityMeta = (p: SupportTicketPriority) => {
    return PRIORITY_OPTIONS.find((item) => item.id === p) || PRIORITY_OPTIONS[2];
  };

  const formatChatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  };

  const appendActivity = (
    existing: SupportTicketActivity[] | undefined,
    entry: SupportTicketActivity
  ): SupportTicketActivity[] => {
    const base = Array.isArray(existing) ? existing : [];
    return [...base, entry].slice(-100);
  };

  const buildWhatsAppLink = (ticket: SupportTicket) => {
    const cleanPhone = (ticket.customerPhone || '').replace(/[^\d]/g, '');
    const normalizedPhone = cleanPhone.startsWith('88')
      ? cleanPhone
      : cleanPhone.startsWith('0')
        ? `88${cleanPhone}`
        : cleanPhone;

    const trackingUrl = buildPublicTrackingUrl(ticket.id);
    const message = [
      `প্রত্যাশা ক্যাবল নেটওয়ার্ক - সাপোর্ট আপডেট`,
      `টিকেট নং: #${ticket.ticketNumber}`,
      `গ্রাহক: ${ticket.customerName}${ticket.customerCode ? ` (${ticket.customerCode})` : ''}`,
      `সমস্যা: ${getCategoryLabel(ticket.category)}`,
      `অবস্থা: ${getTicketStatusLabel(ticket.status, true)}`,
      ticket.createdBy ? `অভিযোগ দাখিল: ${ticket.createdBy} (${formatTicketDateTime(ticket.createdAt, true)})` : '',
      ticket.assignedStaffName ? `টেকনিশিয়ান: ${ticket.assignedStaffName}` : '',
      ticket.status === 'resolved' && ticket.resolvedBy
        ? `সমাধানকারী: ${ticket.resolvedBy} (${formatTicketDateTime(ticket.resolvedAt, true)})`
        : '',
      ticket.resolutionNote ? `নোট: ${ticket.resolutionNote}` : '',
      ticket.isPublicTrackingEnabled !== false ? `লাইভ ট্র্যাকিং লিংক: ${trackingUrl}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    return normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Post a message (user chat or system status log) into Firestore subcollection
  const postTicketMessage = async (
    ticket: SupportTicket,
    text: string,
    msgType: 'message' | 'system' = 'message'
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nowIso = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const senderName = activeActorName.slice(0, 150);
    const senderRole = activeActorRole;

    const msgPayload: SupportTicketMessage = {
      id: msgId,
      ticketId: ticket.id,
      senderId: (activeActorId || 'admin').slice(0, 128),
      senderName,
      senderRole,
      text: trimmed.slice(0, 2000),
      type: msgType,
      createdAt: nowIso
    };

    if (activeDetailTicketId === ticket.id) {
      setChatMessages((prev) => (prev.some((m) => m.id === msgId) ? prev : [...prev, msgPayload]));
    }

    await safeSetDoc(doc(db, 'support_tickets', ticket.id, 'messages', msgId), msgPayload).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, `support_tickets/${ticket.id}/messages/${msgId}`);
      throw err;
    });

    const nextCount =
      activeDetailTicketId === ticket.id
        ? Math.max((ticket.messageCount || 0) + 1, chatMessages.length + 1)
        : (ticket.messageCount || 0) + 1;

    await safeSetDoc(
      doc(db, 'support_tickets', ticket.id),
      {
        messageCount: nextCount,
        lastMessageText: trimmed.slice(0, 300),
        lastMessageBy: senderName,
        lastMessageAt: nowIso,
        updatedAt: nowIso
      },
      { merge: true }
    ).catch(() => {});
  };

  const handleSendChatMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    if (!activeDetailTicket || !canMutateTickets || isSendingChat) return;

    const content = (presetText ?? chatInput).trim();
    if (!content) return;

    setIsSendingChat(true);
    try {
      if (presetText === undefined) setChatInput('');
      await postTicketMessage(activeDetailTicket, content, 'message');
      sounds.playTap();
    } catch (err) {
      console.error('Failed to send ticket message:', err);
      if (presetText === undefined) setChatInput(content);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleDeleteChatMessage = async (msgId: string) => {
    const targetMsg = chatMessages.find((m) => m.id === msgId);
    if (!activeDetailTicket || !targetMsg || !canDeleteMessageForUser(targetMsg)) return;
    sounds.playTap();
    setChatMessages((prev) => prev.filter((m) => m.id !== msgId));
    setConfirmDeleteMsgId(null);

    await safeDeleteDoc(doc(db, 'support_tickets', activeDetailTicket.id, 'messages', msgId)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `support_tickets/${activeDetailTicket.id}/messages/${msgId}`);
    });

    const nextCount = Math.max(0, (activeDetailTicket.messageCount || chatMessages.length) - 1);
    await safeSetDoc(
      doc(db, 'support_tickets', activeDetailTicket.id),
      { messageCount: nextCount, updatedAt: new Date().toISOString() },
      { merge: true }
    ).catch(() => {});
  };

  const openTicketDetail = (ticket: SupportTicket, tab: 'chat' | 'tracking' = 'chat') => {
    sounds.playTap();
    pushSubViewHistory();
    setActiveDetailTicketId(ticket.id);
    setDetailTab(tab);
    setChatInput('');
    setConfirmDeleteMsgId(null);
  };

  const handleCopyTicketLinkQuick = async (ticket: SupportTicket) => {
    sounds.playSuccess();
    const ok = await copyTextSafely(buildPublicTrackingUrl(ticket.id));
    if (ok) {
      setCopiedTicketId(ticket.id);
      setTimeout(() => {
        setCopiedTicketId((prev) => (prev === ticket.id ? null : prev));
      }, 2000);
    }
  };

  const openStaffLoginModal = () => {
    sounds.playTap();
    pushSubViewHistory();
    setStaffLoginIdentifier('');
    setStaffLoginPin('');
    setStaffLoginError('');
    setIsStaffLoginOpen(true);
  };

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawId = staffLoginIdentifier.trim();
    const cleanPin = staffLoginPin.trim();
    if (!rawId || cleanPin.length < 4) {
      setStaffLoginError(
        isBn
          ? 'স্টাফের মোবাইল নাম্বার/কোড এবং কমপক্ষে ৪ ডিজিটের পিন দিন'
          : 'Enter staff phone/code and at least 4-digit PIN'
      );
      return;
    }

    setIsVerifyingStaff(true);
    setStaffLoginError('');
    try {
      const normalizedInputPhone = normalizePhoneNumber(rawId);
      const loweredInput = rawId.toLowerCase();

      // 1. Check active Staff Directory (staffAccounts)
      const matchedStaff = staffAccounts.find((s) => {
        if (s.isActive === false) return false;
        const sPhone = normalizePhoneNumber(s.phone);
        const sCode = (s.userCode || '').trim().toLowerCase();
        return (
          s.id === rawId ||
          (sPhone && normalizedInputPhone && sPhone === normalizedInputPhone) ||
          (sCode && sCode === loweredInput)
        );
      });

      if (matchedStaff) {
        const expectedPin = staffAuthConfig.staffPins[matchedStaff.id] || staffAuthConfig.globalPin || '1234';
        if (cleanPin === expectedPin) {
          const session: StaffSupportSession = {
            staffId: matchedStaff.id,
            name: matchedStaff.name,
            phone: matchedStaff.phone || '',
            roleTitle: matchedStaff.role || (isBn ? 'স্টাফ' : 'Staff'),
            loggedInAt: new Date().toISOString()
          };
          setStaffSession(session);
          try {
            sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(session));
          } catch {}
          sounds.playSuccess();
          closeSubViewViaBack(() => setIsStaffLoginOpen(false));
          return;
        }
      }

      // 2. Also verify against Firestore sub-admin/staff accounts in 'users' collection
      try {
        const snap = await getDocs(collection(db, 'users'));
        const matchedSubAdmin = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .find(
            (u) =>
              (u.role === 'sub-admin' || u.role === 'staff') &&
              u.status !== 'suspended' &&
              String(u.pin || '') === cleanPin &&
              ((u.phone && String(u.phone).trim() === rawId) ||
                (normalizedInputPhone.length >= 6 &&
                  normalizePhoneNumber(u.phone) === normalizedInputPhone))
          );

        if (matchedSubAdmin) {
          const session: StaffSupportSession = {
            staffId: matchedSubAdmin.id,
            name: matchedSubAdmin.name || rawId,
            phone: matchedSubAdmin.phone || rawId,
            roleTitle:
              matchedSubAdmin.role === 'staff'
                ? isBn ? 'স্টাফ' : 'Staff'
                : isBn ? 'সাব-অ্যাডমিন / স্টাফ' : 'Sub-Admin / Staff',
            loggedInAt: new Date().toISOString()
          };
          setStaffSession(session);
          try {
            sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(session));
          } catch {}
          sounds.playSuccess();
          closeSubViewViaBack(() => setIsStaffLoginOpen(false));
          return;
        }
      } catch {}

      setStaffLoginError(
        isBn
          ? 'স্টাফ তথ্য বা পিন সঠিক নয়। অ্যাডমিনের কাছ থেকে সঠিক স্টাফ পিন জেনে নিন।'
          : 'Invalid staff credentials or PIN. Please contact admin.'
      );
    } finally {
      setIsVerifyingStaff(false);
    }
  };

  const handleStaffLogout = () => {
    sounds.playTap();
    setStaffSession(null);
    setActiveDetailTicketId(null);
    try {
      sessionStorage.removeItem('protyasha_support_staff_session');
    } catch {}
  };

  const openStaffPinModal = () => {
    if (!isAdmin) return;
    sounds.playTap();
    pushSubViewHistory();
    setEditGlobalStaffPin(staffAuthConfig.globalPin || '1234');
    setEditPerStaffPins({ ...staffAuthConfig.staffPins });
    setStaffPinSavedNotice('');
    setIsStaffPinModalOpen(true);
  };

  const handleSaveStaffPinSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const cleanGlobal = editGlobalStaffPin.trim();
    if (cleanGlobal.length < 4) {
      setStaffPinSavedNotice(isBn ? 'কমপক্ষে ৪ ডিজিটের পিন দিন' : 'PIN must be at least 4 digits');
      return;
    }

    setIsSavingStaffPin(true);
    try {
      const cleanedStaffPins: Record<string, string> = {};
      Object.entries(editPerStaffPins).forEach(([sid, val]) => {
        const trimmed = String(val || '').trim();
        if (trimmed.length >= 4) cleanedStaffPins[sid] = trimmed;
      });
      await safeSetDoc(doc(db, 'settings', 'staff_support_auth'), {
        id: 'staff_support_auth',
        globalPin: cleanGlobal,
        staffPins: cleanedStaffPins,
        updatedBy: user?.name || 'Admin',
        updatedAt: new Date().toISOString()
      });
      setStaffAuthConfig({ globalPin: cleanGlobal, staffPins: cleanedStaffPins });
      sounds.playSuccess();
      setStaffPinSavedNotice(isBn ? 'স্টাফ পিন সফলভাবে সংরক্ষিত হয়েছে!' : 'Staff PIN saved successfully!');
      setTimeout(() => {
        closeSubViewViaBack(() => setIsStaffPinModalOpen(false));
      }, 650);
    } catch (err) {
      console.error('Failed to save staff PIN:', err);
      setStaffPinSavedNotice(isBn ? 'সেভ করতে সমস্যা হয়েছে' : 'Failed to save PIN');
    } finally {
      setIsSavingStaffPin(false);
    }
  };

  const openReportView = () => {
    sounds.playTap();
    pushSubViewHistory();
    setIsReportOpen(true);
  };

  const openNewForm = () => {
    if (!canMutateTickets) {
      sounds.playTap();
      return;
    }
    sounds.playTap();
    pushSubViewHistory();
    setEditingTicket(null);
    // Auto-fill regular user's own details for quick complaint filing
    setCustomerName(!canViewAllTickets && user?.name ? user.name : '');
    setCustomerPhone(!canViewAllTickets && user?.phone ? user.phone : '');
    setCustomerCode('');
    setArea('');
    setCategory('line_cut');
    setPriority('normal');
    setAssignedStaffId('');
    setDescription('');
    setResolutionNote('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (ticket: SupportTicket) => {
    const check = canModifySupportTicket(ticket, user, staffSession, Date.now());
    if (!check.allowed) {
      sounds.playTap();
      return;
    }
    sounds.playTap();
    pushSubViewHistory();
    setEditingTicket(ticket);
    setCustomerName(ticket.customerName || '');
    setCustomerPhone(ticket.customerPhone || '');
    setCustomerCode(ticket.customerCode || '');
    setArea(ticket.area || '');
    setCategory(ticket.category);
    setPriority(ticket.priority);
    setAssignedStaffId(ticket.assignedStaffId || '');
    setDescription(ticket.description || '');
    setResolutionNote(ticket.resolutionNote || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutateTickets) {
      setFormError(
        isBn
          ? 'সাধারণ ইউজার অভিযোগ যোগ বা পরিবর্তন করতে পারবেন না। স্টাফ পিন দিয়ে লগইন করুন।'
          : 'Regular users cannot add or edit tickets. Please sign in with Staff PIN.'
      );
      return;
    }
    if (editingTicket) {
      const check = canModifySupportTicket(editingTicket, user, staffSession, Date.now());
      if (!check.allowed) {
        setFormError(
          isBn
            ? isSubAdminUser
              ? 'নিজের অভিযোগ দাখিলের ৩০ মিনিট অতিক্রান্ত হয়েছে। এখন শুধুমাত্র অ্যাডমিন এটি পরিবর্তন করতে পারবেন।'
              : 'অভিযোগ দাখিলের ১০ মিনিট অতিক্রান্ত হয়েছে। এখন শুধুমাত্র অ্যাডমিন এটি পরিবর্তন করতে পারবেন।'
            : isSubAdminUser
              ? 'The 30-minute own-entry edit window has expired. Only Admin can modify this ticket now.'
              : 'The 10-minute edit window has expired. Only Admin can modify this ticket now.'
        );
        return;
      }
    }

    const trimmedName = customerName.trim();
    if (!trimmedName) {
      setFormError(isBn ? 'গ্রাহকের নাম লিখুন' : 'Please enter customer name');
      return;
    }

    const allowStatusAndAssign = editingTicket ? canChangeStatusForTicket(editingTicket) : canMutateTickets;
    setIsSaving(true);
    setFormError('');
    try {
      const nowIso = new Date().toISOString();
      const matchedStaff = allowStatusAndAssign
        ? staffAccounts.find((s) => s.id === assignedStaffId)
        : undefined;
      const nextNum = 1001 + tickets.length + Math.floor(Math.random() * 9);
      const ticketId = editingTicket
        ? editingTicket.id
        : `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const ticketNumber = editingTicket ? editingTicket.ticketNumber : `PCN-${nextNum}`;
      const actorName = activeActorName;
      const actorRole = activeActorRole;

      const newActivity: SupportTicketActivity = editingTicket
        ? {
            id: `act_${Date.now()}`,
            action: 'edited',
            titleBn: 'অভিযোগের তথ্য হালনাগাদ করা হয়েছে',
            titleEn: 'Complaint details updated',
            actorName,
            actorRole,
            status: editingTicket.status,
            timestamp: nowIso
          }
        : {
            id: `act_${Date.now()}`,
            action: 'created',
            titleBn: '১. অভিযোগ দাখিলকৃত হয়েছে',
            titleEn: '1. Complaint submitted',
            actorName,
            actorRole,
            note: description.trim().slice(0, 300) || undefined,
            status: 'pending',
            timestamp: nowIso
          };

      const payload: SupportTicket = {
        id: ticketId,
        ticketNumber,
        customerName: trimmedName.slice(0, 150),
        customerPhone: customerPhone.trim().slice(0, 32),
        customerCode: customerCode.trim().slice(0, 64),
        area: area.trim().slice(0, 150),
        category,
        priority,
        status: editingTicket ? editingTicket.status : 'pending',
        assignedStaffId: allowStatusAndAssign
          ? matchedStaff
            ? matchedStaff.id
            : ''
          : editingTicket?.assignedStaffId || '',
        assignedStaffName: allowStatusAndAssign
          ? matchedStaff
            ? matchedStaff.name
            : ''
          : editingTicket?.assignedStaffName || '',
        description: description.trim().slice(0, 2000),
        resolutionNote: allowStatusAndAssign
          ? resolutionNote.trim().slice(0, 2000)
          : editingTicket?.resolutionNote || '',
        createdBy: (editingTicket?.createdBy || actorName).slice(0, 128),
        createdById: (editingTicket?.createdById || activeActorId || '').slice(0, 128),
        createdByPhone: (editingTicket?.createdByPhone || activeActorPhone || '').slice(0, 32),
        createdByRole: (editingTicket?.createdByRole || actorRole).slice(0, 32),
        createdAt: editingTicket?.createdAt || nowIso,
        updatedAt: nowIso,
        isPublicTrackingEnabled: editingTicket ? editingTicket.isPublicTrackingEnabled !== false : true,
        activityHistory: appendActivity(editingTicket?.activityHistory, newActivity),
        ...(editingTicket?.resolvedAt ? { resolvedAt: editingTicket.resolvedAt } : {}),
        ...(editingTicket?.resolvedBy ? { resolvedBy: editingTicket.resolvedBy } : {}),
        ...(editingTicket?.resolvedByRole ? { resolvedByRole: editingTicket.resolvedByRole } : {}),
        ...(typeof editingTicket?.messageCount === 'number' ? { messageCount: editingTicket.messageCount } : {}),
        ...(editingTicket?.lastMessageText ? { lastMessageText: editingTicket.lastMessageText } : {}),
        ...(editingTicket?.lastMessageBy ? { lastMessageBy: editingTicket.lastMessageBy } : {}),
        ...(editingTicket?.lastMessageAt ? { lastMessageAt: editingTicket.lastMessageAt } : {})
      };

      await onSaveTicket(payload);
      sounds.playSuccess();
      closeSubViewViaBack(() => setIsFormOpen(false));
    } catch (err) {
      console.error('Failed to save support ticket:', err);
      setFormError(isBn ? 'সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to save ticket.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    ticket: SupportTicket,
    nextStatus: SupportTicketStatus,
    noteOverride?: string,
    resolverNameOverride?: string
  ) => {
    if (isVisitor || !canChangeStatusForTicket(ticket)) return;
    sounds.playTap();
    const nowIso = new Date().toISOString();
    const actorName = activeActorName.slice(0, 150);
    const actorRole = activeActorRole.slice(0, 32);

    const resolvedByFinal =
      nextStatus === 'resolved'
        ? (resolverNameOverride?.trim() || actorName || ticket.assignedStaffName || 'অ্যাডমিন').slice(0, 150)
        : null;

    const statusTitles: Record<SupportTicketStatus, { bn: string; en: string }> = {
      pending: { bn: '১. দাখিলকৃত অবস্থায় নেওয়া হয়েছে', en: '1. Moved to Submitted' },
      reviewing: { bn: '২. পর্যালোচনা শুরু হয়েছে', en: '2. Under Review' },
      in_progress: { bn: '৩. কাজ চলমান শুরু হয়েছে', en: '3. Work In Progress' },
      resolved: { bn: '৪. অভিযোগ সমাধানকৃত হয়েছে', en: '4. Complaint Resolved' }
    };

    const actEntry: SupportTicketActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      action: nextStatus === 'resolved' ? 'resolved' : 'status_changed',
      titleBn: statusTitles[nextStatus].bn,
      titleEn: statusTitles[nextStatus].en,
      actorName: nextStatus === 'resolved' && resolvedByFinal ? resolvedByFinal : actorName,
      actorRole,
      note:
        nextStatus === 'resolved'
          ? (noteOverride !== undefined ? noteOverride.trim() : ticket.resolutionNote || '') || undefined
          : undefined,
      status: nextStatus,
      timestamp: nowIso
    };

    const updated: SupportTicket = {
      ...ticket,
      status: nextStatus,
      updatedAt: nowIso,
      resolutionNote: noteOverride !== undefined ? noteOverride.trim().slice(0, 2000) : ticket.resolutionNote || '',
      resolvedAt: nextStatus === 'resolved' ? nowIso : null,
      resolvedBy: resolvedByFinal,
      resolvedByRole: nextStatus === 'resolved' ? actorRole : null,
      activityHistory: appendActivity(ticket.activityHistory, actEntry)
    };
    await onSaveTicket(updated);

    // Log a real-time system status update in the ticket's conversation thread
    if (nextStatus === 'resolved') {
      sounds.playSuccess();
      const noteSuffix = updated.resolutionNote ? ` — "${updated.resolutionNote}"` : '';
      postTicketMessage(
        updated,
        isBn
          ? `৪. সমাধানকৃত করেছেন: ${resolvedByFinal}${noteSuffix}`
          : `4. Resolved by ${resolvedByFinal}${noteSuffix}`,
        'system'
      ).catch(() => {});
    } else if (nextStatus === 'reviewing' && ticket.status !== 'reviewing') {
      postTicketMessage(
        updated,
        isBn ? `${actorName} অভিযোগটি "২. পর্যালোচনা" ধাপে নিয়েছেন।` : `${actorName} moved ticket to 2. Reviewing.`,
        'system'
      ).catch(() => {});
    } else if (nextStatus === 'in_progress' && ticket.status !== 'in_progress') {
      postTicketMessage(
        updated,
        isBn ? `${actorName} অভিযোগটি "৩. কাজ চলমান" ধাপে নিয়েছেন।` : `${actorName} moved ticket to 3. In Progress.`,
        'system'
      ).catch(() => {});
    } else if (nextStatus === 'pending' && ticket.status !== 'pending') {
      postTicketMessage(
        updated,
        isBn ? `${actorName} অভিযোগটি "১. দাখিলকৃত" ধাপে পুনরায় চালু করেছেন।` : `${actorName} reopened ticket to 1. Submitted.`,
        'system'
      ).catch(() => {});
    }

    setResolvingTicketId(null);
    setQuickResolveNote('');
    setQuickResolverName('');
  };

  const handleTogglePublicTracking = async (ticket: SupportTicket, enabled: boolean) => {
    if (isVisitor || !canChangeStatusForTicket(ticket)) return;
    const updated: SupportTicket = {
      ...ticket,
      isPublicTrackingEnabled: enabled,
      updatedAt: new Date().toISOString()
    };
    await onSaveTicket(updated);
  };

  const handleQuickAssign = async (ticket: SupportTicket, staffId: string) => {
    if (isVisitor || !canChangeStatusForTicket(ticket)) return;
    sounds.playTap();
    const staff = staffAccounts.find((s) => s.id === staffId);
    const nowIso = new Date().toISOString();
    const actorName = activeActorName.slice(0, 150);
    const nextStatus: SupportTicketStatus =
      staff && (ticket.status === 'pending' || ticket.status === 'reviewing')
        ? 'in_progress'
        : ticket.status;

    const actEntry: SupportTicketActivity | null = staff
      ? {
          id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          action: 'assigned',
          titleBn: `টেকনিশিয়ান অ্যাসাইন: ${staff.name}`,
          titleEn: `Assigned technician: ${staff.name}`,
          actorName,
          actorRole: activeActorRole,
          status: nextStatus,
          timestamp: nowIso
        }
      : null;

    const updated: SupportTicket = {
      ...ticket,
      assignedStaffId: staff ? staff.id : '',
      assignedStaffName: staff ? staff.name : '',
      status: nextStatus,
      updatedAt: nowIso,
      activityHistory: actEntry
        ? appendActivity(ticket.activityHistory, actEntry)
        : ticket.activityHistory
    };
    await onSaveTicket(updated);
    if (staff) {
      postTicketMessage(
        updated,
        isBn ? `টেকনিশিয়ান অ্যাসাইন করা হয়েছে: ${staff.name}` : `Assigned technician: ${staff.name}`,
        'system'
      ).catch(() => {});
    }
  };

  const getStatusBadgeMeta = (status: SupportTicketStatus) => {
    if (status === 'resolved') {
      return {
        cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: isBn ? '৪. সমাধানকৃত' : '4. Resolved'
      };
    }
    if (status === 'in_progress') {
      return {
        cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        icon: <Wrench className="w-3.5 h-3.5" />,
        label: isBn ? '৩. কাজ চলমান' : '3. In Progress'
      };
    }
    if (status === 'reviewing') {
      return {
        cls: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
        icon: <Eye className="w-3.5 h-3.5" />,
        label: isBn ? '২. পর্যালোচনা' : '2. Reviewing'
      };
    }
    return {
      cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      label: isBn ? '১. দাখিলকৃত' : '1. Submitted'
    };
  };

  // =========================================================================
  // FULL-SCREEN CATEGORY MONTHLY/YEARLY REPORT VIEW
  // =========================================================================
  if (isReportOpen) {
    return (
      <TicketReportView
        tickets={visibleTickets}
        lang={lang}
        actorName={activeActorName}
        isScopedToOwnOnly={!canViewAllTickets}
        onClose={() => closeSubViewViaBack(() => setIsReportOpen(false))}
      />
    );
  }

  // =========================================================================
  // FULL-SCREEN TICKET DETAIL VIEW:
  // 4-Step Progress + Live Chat Tab + Activity History & Public Tracking Link Tab
  // =========================================================================
  if (activeDetailTicket) {
    const isResolved = activeDetailTicket.status === 'resolved';
    const badge = getStatusBadgeMeta(activeDetailTicket.status);
    const quickReplies = isBn ? QUICK_REPLIES_BN : QUICK_REPLIES_EN;
    const isResolvingDetail = resolvingTicketId === activeDetailTicket.id;

    return (
      <div className="fixed inset-0 z-60 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setActiveDetailTicketId(null))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Back to tickets"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    #{activeDetailTicket.ticketNumber}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {activeDetailTicket.customerName}
                  </h3>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {getCategoryLabel(activeDetailTicket.category)}
                  {activeDetailTicket.area ? ` • ${activeDetailTicket.area}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {activeDetailTicket.customerPhone && (
                <a
                  href={`tel:${activeDetailTicket.customerPhone.replace(/[^\d+]/g, '')}`}
                  className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-center"
                  title={isBn ? 'কল করুন' : 'Call'}
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${badge.cls}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>
          </div>

          {/* 4-Step Progress Stepper inside Detail Header (Interactive for Admin, manual Staff PIN, or Sub-Admin on own ticket within 30m) */}
          <TicketProgressStepper
            status={activeDetailTicket.status}
            lang={lang}
            compact
            interactive={canChangeStatusForTicket(activeDetailTicket)}
            onSelectStatus={(nextSt) => {
              if (!canChangeStatusForTicket(activeDetailTicket)) return;
              if (nextSt === 'resolved' && activeDetailTicket.status !== 'resolved') {
                setDetailTab('tracking');
                setResolvingTicketId(activeDetailTicket.id);
                setQuickResolveNote(activeDetailTicket.resolutionNote || '');
                setQuickResolverName(activeActorName || activeDetailTicket.assignedStaffName || '');
              } else if (nextSt !== activeDetailTicket.status) {
                handleStatusChange(activeDetailTicket, nextSt);
              }
            }}
          />

          {/* 2-Tab Inner Switcher: Live Chat vs History & Public Link */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setDetailTab('chat');
              }}
              className={`h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                detailTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>
                {isBn
                  ? `লাইভ মেসেজ (${toBengaliNumber(chatMessages.length || activeDetailTicket.messageCount || 0)})`
                  : `Live Chat (${chatMessages.length || activeDetailTicket.messageCount || 0})`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setDetailTab('tracking');
              }}
              className={`h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                detailTab === 'tracking'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <History className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{isBn ? 'হিস্টোরি ও পাবলিক লিংক' : 'History & Public Link'}</span>
            </button>
          </div>
        </div>

        {/* DETAIL TAB 1: REAL-TIME MESSAGES */}
        {detailTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-3 w-full">
              {/* Compact Filed & Resolved Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 truncate">
                    <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <strong>{isBn ? 'দাখিলকারী:' : 'Filed:'}</strong>
                    <span className="truncate font-semibold">
                      {activeDetailTicket.createdBy || (isBn ? 'অ্যাডমিন' : 'Admin')}
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0 tabular-nums">
                    {formatTicketDateTime(activeDetailTicket.createdAt, isBn)}
                  </span>
                </div>

                {isResolved && (
                  <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 truncate">
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <strong>{isBn ? 'সমাধানকারী:' : 'Resolved:'}</strong>
                      <span className="truncate font-semibold">
                        {activeDetailTicket.resolvedBy || activeDetailTicket.assignedStaffName || (isBn ? 'অ্যাডমিন' : 'Admin')}
                      </span>
                    </span>
                    <span className="text-[10px] shrink-0 tabular-nums">
                      {formatTicketDateTime(activeDetailTicket.resolvedAt || activeDetailTicket.updatedAt, isBn)}
                    </span>
                  </div>
                )}
              </div>

              {activeDetailTicket.description && (
                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-800 dark:text-amber-300">
                    <span>{isBn ? 'মূল অভিযোগের বিবরণ' : 'Original Complaint'}</span>
                    <span>{formatTicketDateTime(activeDetailTicket.createdAt, isBn)}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{activeDetailTicket.description}</p>
                </div>
              )}

              {chatLoading ? (
                <div className="py-10 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'মেসেজ লোড হচ্ছে...' : 'Loading live messages...'}
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    {isBn ? 'এখনো কোনো কথোপকথন শুরু হয়নি' : 'No messages yet'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'নিচে মেসেজ লিখে অ্যাডমিন, স্টাফ ও গ্রাহকের সাথে রিয়েল-টাইম কথা বলুন।'
                      : 'Send a message below for real-time updates on this ticket.'}
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  if (msg.type === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center my-1.5">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/90 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center max-w-[92%]">
                          <span>{msg.text}</span>
                          <span className="ml-2 text-[10px] font-normal text-slate-500 dark:text-slate-400">
                            {formatTicketDateTime(msg.createdAt, isBn)}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  const currentUserKey = user?.id || user?.phone || '';
                  const isMine =
                    (currentUserKey && msg.senderId === currentUserKey) ||
                    (!currentUserKey && user?.name && msg.senderName === user.name);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 px-1 mb-0.5">
                        <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400">
                          {msg.senderName}
                        </span>
                        {msg.senderRole && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {getTicketRoleLabel(msg.senderRole, isBn)}
                          </span>
                        )}
                      </div>

                      <div
                        className={`group relative max-w-[82%] sm:max-w-[72%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isMine
                            ? 'bg-[#E52E2E] text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words font-medium">{msg.text}</p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-2 text-[10px] ${
                            isMine ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          <span>{formatChatTime(msg.createdAt)}</span>
                          {canDeleteMessageForUser(msg) && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDeleteMsgId(confirmDeleteMsgId === msg.id ? null : msg.id)
                              }
                              className="opacity-70 hover:opacity-100 cursor-pointer"
                              title={isBn ? 'মুছুন' : 'Delete'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {confirmDeleteMsgId === msg.id && canDeleteMessageForUser(msg) && (
                          <div className="mt-2 pt-2 border-t border-white/20 dark:border-slate-700 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMsgId(null)}
                              className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold cursor-pointer"
                            >
                              {isBn ? 'না' : 'No'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteChatMessage(msg.id)}
                              className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold cursor-pointer"
                            >
                              {isBn ? 'মুছুন' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {canMutateTickets ? (
              <div className="sticky bottom-0 z-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 pt-2 pb-3 safe-area-bottom">
                <div className="w-full max-w-5xl mx-auto space-y-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        disabled={isSendingChat}
                        onClick={() => handleSendChatMessage(undefined, reply)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isBn ? 'রিয়েল-টাইম মেসেজ লিখুন...' : 'Type a live message...'}
                      className="flex-1 h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                    <button
                      type="submit"
                      disabled={isSendingChat || !chatInput.trim()}
                      className="w-11 h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-50 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
                      aria-label="Send message"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : !isVisitor ? (
              <div className="sticky bottom-0 z-20 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                {isBn
                  ? 'শুধুমাত্র দেখার অনুমতি (Read-Only) — মেসেজ বা পরিবর্তন করতে অনুমোদিত স্টাফ বা অ্যাডমিন লগইন প্রয়োজন।'
                  : 'Read-only access — Staff PIN or Admin login required to send messages.'}
              </div>
            ) : null}
          </>
        ) : (
          /* DETAIL TAB 2: PUBLIC TRACKING LINK + RESOLVE PROMPT + ACTIVITY HISTORY */
          <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-20 w-full">
            {/* Inline Resolve Form when user taps Step 4 inside Detail view */}
            {isResolvingDetail && (
              <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-900 space-y-2.5">
                <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                  {isBn ? '৪. সমাধানকৃত নিশ্চিত করুন' : '4. Confirm Resolution'}
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    {isBn ? 'সমাধানকারীর নাম' : 'Resolved By Name'}
                  </label>
                  <input
                    type="text"
                    value={quickResolverName}
                    onChange={(e) => setQuickResolverName(e.target.value)}
                    placeholder={isBn ? 'যিনি সমাধান করেছেন তার নাম' : 'Resolver name'}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    {isBn ? 'সমাধান নোট (ঐচ্ছিক)' : 'Resolution Note'}
                  </label>
                  <input
                    type="text"
                    value={quickResolveNote}
                    onChange={(e) => setQuickResolveNote(e.target.value)}
                    placeholder={isBn ? 'যেমন: ফাইবার জয়েন্ট ও অনু রিস্টার্ট করা হয়েছে' : 'Resolution summary'}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResolvingTicketId(null)}
                    className="h-9 px-3.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(activeDetailTicket, 'resolved', quickResolveNote, quickResolverName)
                    }
                    className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isBn ? 'সমাধানকৃত সেভ করুন' : 'Save Resolved'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Online Tracking & Public Link Card */}
            <PublicTrackingShareCard
              ticket={activeDetailTicket}
              lang={lang}
              canToggleVisibility={canChangeStatusForTicket(activeDetailTicket)}
              onToggleVisibility={(enabled) => handleTogglePublicTracking(activeDetailTicket, enabled)}
              onPreviewPublicLink={
                onPreviewPublicLink
                  ? () => onPreviewPublicLink(activeDetailTicket.id)
                  : undefined
              }
            />

            {/* Activity History Timeline */}
            <TicketActivityTimeline ticket={activeDetailTicket} lang={lang} />
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN SUPPORT TICKETS LIST VIEW
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Sticky Glass Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center shrink-0">
            <Headphones className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {isBn ? 'কাস্টমার কমপ্লেইন ও ট্র্যাকার' : 'Customer Support Tickets'}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {isBn
                ? `${canViewAllTickets ? 'সকল অভিযোগ' : 'আমার অভিযোগ'} • মোট ${toBengaliNumber(stats.total)}টি`
                : `${canViewAllTickets ? 'All Tickets' : 'My Tickets'} • ${stats.total} Total`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Category Monthly/Yearly Report Button */}
          <button
            type="button"
            onClick={openReportView}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title={isBn ? 'ক্যাটাগরি রিপোর্ট (PDF ও Excel)' : 'Category Report (PDF & Excel)'}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{isBn ? 'রিপোর্ট' : 'Report'}</span>
          </button>

          {/* Admin Staff PIN Manager Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={openStaffPinModal}
              className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title={isBn ? 'স্টাফ সাপোর্ট লগইন পিন সেটিংস' : 'Staff Login PIN Settings'}
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}

          {/* Dedicated Staff Login Button (only for regular users without view-all access) */}
          {!canViewAllTickets && !isVisitor && !isStaffRoleUser && !isSubAdminUser && (
            <button
              type="button"
              onClick={openStaffLoginModal}
              className="h-9 px-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-[11px] font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title={isBn ? 'স্টাফ লগইন' : 'Staff Login'}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'স্টাফ' : 'Staff'}</span>
            </button>
          )}

          {canMutateTickets && (
            <button
              type="button"
              onClick={openNewForm}
              className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-rose-600/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.6]" />
              <span>{isBn ? 'নতুন' : 'New'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full">
        {/* Role Access & Staff Mode Status Strip */}
        {isSubAdminUser && !isAdmin ? (
          <div className="p-3 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 truncate">
                {hasSubAdminSupportPerm
                  ? isBn
                    ? `সাব-অ্যাডমিন সাপোর্ট অ্যাক্সেস: ${activeActorName}`
                    : `Sub-Admin Support Access: ${activeActorName}`
                  : isBn
                    ? `সাব-অ্যাডমিন (শুধু দেখার অনুমতি): ${activeActorName}`
                    : `Sub-Admin (View-Only): ${activeActorName}`}
              </p>
              <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                {hasSubAdminSupportPerm
                  ? isBn
                    ? 'সকল অভিযোগ দেখতে পারবেন; নতুন টিকেট যোগ ও ৩০ মিনিট নিজের টিকেট এডিট/ডিলিট করতে পারবেন (অন্যের ডেটা পরিবর্তন নয়)'
                    : 'View all tickets, create new tickets, and edit/delete your own entries within 30 minutes'
                  : isBn
                    ? 'সকল অভিযোগ দেখতে পারবেন; নতুন টিকেট এন্ট্রির অনুমতি অ্যাডমিন থেকে চালু করা নেই'
                    : 'All tickets visible; ticket creation permission is disabled by Admin'}
              </p>
            </div>
          </div>
        ) : isStaffActive && !isAdmin ? (
          <div className="p-3 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 truncate">
                  {isBn
                    ? `স্টাফ অ্যাক্সেস সক্রিয়: ${activeActorName}${matchedMainStaff?.role ? ` (${matchedMainStaff.role})` : staffSession?.roleTitle ? ` (${staffSession.roleTitle})` : ''}`
                    : `Staff Access Active: ${activeActorName}`}
                </p>
                <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                  {isBn
                    ? 'সকল অভিযোগ দৃশ্যমান ও স্ট্যাটাস পরিবর্তনযোগ্য • ১০ মিনিট পর এডিট/ডিলিট শুধু অ্যাডমিনের নিয়ন্ত্রণে'
                    : 'All complaints visible & status updatable • Edit/Delete locked to Admin after 10 min'}
                </p>
              </div>
            </div>
            {isManualTempStaffSession && (
              <button
                type="button"
                onClick={handleStaffLogout}
                className="h-8 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'স্টাফ লগআউট' : 'Staff Logout'}</span>
              </button>
            )}
          </div>
        ) : !canViewAllTickets && !isVisitor ? (
          <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-sky-950 dark:text-sky-200 leading-relaxed">
                {isBn
                  ? 'আপনি শুধুমাত্র দেখার অনুমতিতে (Read-Only) আছেন। সাধারণ ইউজাররা কোনো টিকেট যোগ বা পরিবর্তন করতে পারবেন না।'
                  : 'You are in Read-Only mode. Regular users cannot add or modify support tickets.'}
              </p>
            </div>
            {!isStaffRoleUser && !isSubAdminUser && (
              <button
                type="button"
                onClick={openStaffLoginModal}
                className="h-8 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isBn ? 'স্টাফ লগইন' : 'Staff Login'}</span>
              </button>
            )}
          </div>
        ) : null}
        {/* 4-Stage KPI Strip: ১. দাখিলকৃত | ২. পর্যালোচনা | ৩. কাজ চলমান | ৪. সমাধানকৃত */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending');
            }}
            className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-900/50'
            }`}
          >
            <p
              className={`text-[10px] font-bold truncate ${
                statusFilter === 'pending' ? 'text-white/90' : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {isBn ? '১. দাখিলকৃত' : '1. Filed'}
            </p>
            <p
              className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${
                statusFilter === 'pending' ? 'text-white' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isBn ? toBengaliNumber(stats.pending) : stats.pending}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setStatusFilter(statusFilter === 'reviewing' ? 'all' : 'reviewing');
            }}
            className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'reviewing'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/70 dark:border-sky-900/50'
            }`}
          >
            <p
              className={`text-[10px] font-bold truncate ${
                statusFilter === 'reviewing' ? 'text-white/90' : 'text-sky-700 dark:text-sky-300'
              }`}
            >
              {isBn ? '২. পর্যালোচনা' : '2. Review'}
            </p>
            <p
              className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${
                statusFilter === 'reviewing' ? 'text-white' : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {isBn ? toBengaliNumber(stats.reviewing) : stats.reviewing}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress');
            }}
            className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-900/50'
            }`}
          >
            <p
              className={`text-[10px] font-bold truncate ${
                statusFilter === 'in_progress' ? 'text-white/90' : 'text-amber-800 dark:text-amber-300'
              }`}
            >
              {isBn ? '৩. কাজ চলমান' : '3. Working'}
            </p>
            <p
              className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${
                statusFilter === 'in_progress' ? 'text-white' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isBn ? toBengaliNumber(stats.inProgress) : stats.inProgress}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved');
            }}
            className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'resolved'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-900/50'
            }`}
          >
            <p
              className={`text-[10px] font-bold truncate ${
                statusFilter === 'resolved' ? 'text-white/90' : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {isBn ? '৪. সমাধানকৃত' : '4. Resolved'}
            </p>
            <p
              className={`text-lg sm:text-xl font-black tabular-nums mt-0.5 ${
                statusFilter === 'resolved' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isBn ? toBengaliNumber(stats.resolved) : stats.resolved}
            </p>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম, ফোন, এলাকা, দাখিলকারী বা সমাধানকারী...' : 'Search name, phone, area, filer, resolver...'}
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | SupportTicketCategory)}
                className="h-11 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              >
                <option value="all">{isBn ? 'সব ধরন' : 'All Types'}</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isBn ? c.labelBn : c.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5-Filter Horizontal Scrollable Pill Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {(
              [
                { id: 'all', bn: 'সব অভিযোগ', en: 'All', count: stats.total },
                { id: 'pending', bn: '১. দাখিলকৃত', en: '1. Filed', count: stats.pending },
                { id: 'reviewing', bn: '২. পর্যালোচনা', en: '2. Review', count: stats.reviewing },
                { id: 'in_progress', bn: '৩. কাজ চলমান', en: '3. Working', count: stats.inProgress },
                { id: 'resolved', bn: '৪. সমাধানকৃত', en: '4. Resolved', count: stats.resolved }
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setStatusFilter(tab.id);
                  }}
                  className={`h-9 px-3 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isBn ? tab.bn : tab.en} ({isBn ? toBengaliNumber(tab.count) : tab.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <div className="py-14 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
              {isBn ? 'কোনো কমপ্লেইন টিকেট পাওয়া যায়নি' : 'No support tickets found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isBn
                ? 'নতুন গ্রাহক কমপ্লেইন যোগ করতে উপরের "নতুন টিকেট" বাটনে ট্যাপ করুন।'
                : 'Tap "New Ticket" above to log a customer complaint.'}
            </p>
            {canMutateTickets && (
              <button
                type="button"
                onClick={openNewForm}
                className="mt-4 h-10 px-4 rounded-xl bg-[#E52E2E] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'প্রথম টিকেট যোগ করুন' : 'Create First Ticket'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
            {filteredTickets.map((ticket) => {
              const priorityMeta = getPriorityMeta(ticket.priority);
              const isResolved = ticket.status === 'resolved';
              const isWorking = ticket.status === 'in_progress';
              const isReviewing = ticket.status === 'reviewing';
              const isResolvingThis = resolvingTicketId === ticket.id;
              const isConfirmingDelete = confirmDeleteId === ticket.id;
              const msgCount = ticket.messageCount || 0;
              const badge = getStatusBadgeMeta(ticket.status);
              const modCheck = canModifySupportTicket(ticket, user, staffSession, nowTick);

              const leftBorderColor = isResolved
                ? 'border-l-emerald-500'
                : isWorking
                  ? 'border-l-amber-500'
                  : isReviewing
                    ? 'border-l-sky-500'
                    : ticket.priority === 'urgent'
                      ? 'border-l-rose-600'
                      : 'border-l-rose-400';

              return (
                <div
                  key={ticket.id}
                  className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-l-4 ${leftBorderColor} p-3.5 sm:p-4 shadow-xs space-y-3`}
                >
                  {/* Top Meta Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-[11px] font-mono font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          #{ticket.ticketNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityMeta.badgeClass}`}
                        >
                          {isBn ? priorityMeta.labelBn : priorityMeta.labelEn}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {ticket.customerName}
                        {ticket.customerCode && (
                          <span className="ml-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                            ({ticket.customerCode})
                          </span>
                        )}
                      </h3>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${badge.cls}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Edit/Delete Window Status Banner for Non-Admin Users & Sub-Admin */}
                  {!isAdmin && !isVisitor && (
                    modCheck.allowed ? (
                      <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isBn ? 'এডিট ও ডিলিট সময় বাকি:' : 'Edit & delete time left:'}
                          </span>
                        </span>
                        <span className="font-mono font-black px-2 py-0.5 rounded-md bg-amber-500 text-white tabular-nums">
                          {formatRemainingCountdown(modCheck.remainingMs, isBn)}
                        </span>
                      </div>
                    ) : modCheck.isOwner ? (
                      <div className="px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        <Lock className="w-3 h-3 shrink-0 text-slate-500" />
                        <span>
                          {isBn
                            ? isSubAdminUser
                              ? '৩০ মিনিট অতিক্রান্ত — এখন শুধু অ্যাডমিন এডিট/ডিলিট নিয়ন্ত্রণ করতে পারবেন'
                              : '১০ মিনিট অতিক্রান্ত — এখন শুধু অ্যাডমিন এডিট/ডিলিট নিয়ন্ত্রণ করতে পারবেন'
                            : isSubAdminUser
                              ? '30-minute window expired — Only Admin can edit or delete now'
                              : '10-minute window expired — Only Admin can edit or delete now'}
                        </span>
                      </div>
                    ) : null
                  )}

                  {/* 4-Step Visual Progress Tracker on Every Card */}
                  <div className="pt-1 pb-0.5">
                    <TicketProgressStepper
                      status={ticket.status}
                      lang={lang}
                      compact
                      interactive={canChangeStatusForTicket(ticket)}
                      onSelectStatus={(nextSt) => {
                        if (!canChangeStatusForTicket(ticket)) return;
                        if (nextSt === 'resolved' && ticket.status !== 'resolved') {
                          setResolvingTicketId(ticket.id);
                          setQuickResolveNote(ticket.resolutionNote || '');
                          setQuickResolverName(activeActorName || ticket.assignedStaffName || '');
                        } else if (nextSt !== ticket.status) {
                          handleStatusChange(ticket, nextSt);
                        }
                      }}
                    />
                  </div>

                  {/* Audit Attribution Box: Who Filed & Time + Who Resolved & Time */}
                  <div className="space-y-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-2.5 text-[11px]">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                        <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">
                          {isBn ? 'অভিযোগ দাখিল:' : 'Filed by:'}
                        </span>
                        <strong className="font-extrabold">
                          {ticket.createdBy || (isBn ? 'অ্যাডমিন' : 'Admin')}
                        </strong>
                        {ticket.createdByRole && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            ({getTicketRoleLabel(ticket.createdByRole, isBn)})
                          </span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
                        <Clock className="w-3 h-3 shrink-0" />
                        {formatTicketDateTime(ticket.createdAt, isBn)}
                      </span>
                    </div>

                    {isResolved && (
                      <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold">
                            {isBn ? 'সমাধানকারী:' : 'Resolved by:'}
                          </span>
                          <strong className="font-extrabold">
                            {ticket.resolvedBy || ticket.assignedStaffName || (isBn ? 'অ্যাডমিন' : 'Admin')}
                          </strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700/90 dark:text-emerald-400 font-semibold tabular-nums">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          {formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info & Issue Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {ticket.customerPhone && (
                        <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {ticket.customerPhone}
                        </span>
                      )}
                      {ticket.area && (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {ticket.area}
                        </span>
                      )}
                    </div>

                    {ticket.description && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                        {ticket.description}
                      </p>
                    )}

                    {ticket.resolutionNote && (
                      <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 px-3 py-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50 flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>
                          <strong>{isBn ? 'সমাধান নোট: ' : 'Resolution: '}</strong>
                          {ticket.resolutionNote}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2 Primary Engagement Buttons: Live Chat + Activity History & Public Tracking Link */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openTicketDetail(ticket, 'chat')}
                      className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/35 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center gap-2 text-left transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] sm:text-xs font-extrabold text-indigo-900 dark:text-indigo-200 truncate">
                            {isBn ? 'লাইভ মেসেজ' : 'Live Chat'}
                          </span>
                          {msgCount > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-600 text-white tabular-nums">
                              {isBn ? toBengaliNumber(msgCount) : msgCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-indigo-700/85 dark:text-indigo-300/80 truncate">
                          {ticket.lastMessageText
                            ? `${ticket.lastMessageBy || ''}: ${ticket.lastMessageText}`
                            : isBn
                              ? 'রিয়েল-টাইম চ্যাট'
                              : 'Start chat'}
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => openTicketDetail(ticket, 'tracking')}
                      className="p-2.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/35 hover:bg-sky-100/80 dark:hover:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 flex items-center gap-2 text-left transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                        <History className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[11px] sm:text-xs font-extrabold text-sky-950 dark:text-sky-200 truncate">
                          {isBn ? 'হিস্টোরি ও লিংক' : 'History & Link'}
                        </span>
                        <p className="text-[10px] text-sky-700/90 dark:text-sky-300/80 truncate">
                          {ticket.isPublicTrackingEnabled !== false
                            ? isBn
                              ? 'পাবলিক লিংক চালু'
                              : 'Public link active'
                            : isBn
                              ? 'অ্যাক্টিভিটি হিস্টোরি'
                              : 'Activity log'}
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Technician Assignment & Quick Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {canChangeStatusForTicket(ticket) ? (
                        <select
                          value={ticket.assignedStaffId || ''}
                          onChange={(e) => handleQuickAssign(ticket, e.target.value)}
                          className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 max-w-[180px]"
                        >
                          <option value="">
                            {isBn ? 'টেকনিশিয়ান অ্যাসাইন...' : 'Assign technician...'}
                          </option>
                          {staffAccounts.filter(isActualStaffAccount).map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} ({staff.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                          {ticket.assignedStaffName || (isBn ? 'অ্যাসাইন করা হয়নি' : 'Unassigned')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyTicketLinkQuick(ticket)}
                        className={`h-8 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition-colors cursor-pointer ${
                          copiedTicketId === ticket.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/60'
                        }`}
                        title={isBn ? 'পাবলিক ট্র্যাকিং লিংক কপি' : 'Copy public link'}
                      >
                        {copiedTicketId === ticket.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Link2 className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedTicketId === ticket.id ? (isBn ? 'কপি!' : 'Copied') : isBn ? 'লিংক' : 'Link'}</span>
                      </button>

                      {ticket.customerPhone && (
                        <a
                          href={`tel:${ticket.customerPhone.replace(/[^\d+]/g, '')}`}
                          className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                          title={isBn ? 'কল করুন' : 'Call'}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{isBn ? 'কল' : 'Call'}</span>
                        </a>
                      )}
                      <a
                        href={buildWhatsAppLink(ticket)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WA</span>
                      </a>
                      {modCheck.allowed && (
                        <button
                          type="button"
                          onClick={() => openEditForm(ticket)}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                          title={isBn ? 'এডিট' : 'Edit'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {modCheck.allowed && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playTap();
                            setConfirmDeleteId(isConfirmingDelete ? null : ticket.id);
                          }}
                          className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                          title={isBn ? 'মুছুন' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Delete Confirmation */}
                  {isConfirmingDelete && modCheck.allowed && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                        {isBn ? 'টিকেটটি স্থায়ীভাবে মুছে ফেলবেন?' : 'Delete this ticket permanently?'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="h-8 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          {isBn ? 'না' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const freshCheck = canModifySupportTicket(ticket, user, staffSession, Date.now());
                            if (!freshCheck.allowed) {
                              setConfirmDeleteId(null);
                              return;
                            }
                            await onDeleteTicket(ticket.id);
                            setConfirmDeleteId(null);
                          }}
                          className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {isBn ? 'হ্যাঁ, মুছুন' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Quick Resolve Prompt */}
                  {isResolvingThis && (
                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                          {isBn ? 'সমাধানকারীর নাম' : 'Resolved By Name'}
                        </label>
                        <input
                          type="text"
                          value={quickResolverName}
                          onChange={(e) => setQuickResolverName(e.target.value)}
                          placeholder={isBn ? 'যিনি সমাধান করেছেন তার নাম' : 'Resolver name'}
                          className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                        {ticket.assignedStaffName && ticket.assignedStaffName !== quickResolverName && (
                          <button
                            type="button"
                            onClick={() => setQuickResolverName(ticket.assignedStaffName || '')}
                            className="mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
                          >
                            {isBn
                              ? `টেকনিশিয়ান "${ticket.assignedStaffName}" সেট করুন`
                              : `Set technician "${ticket.assignedStaffName}"`}
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                          {isBn ? 'সমাধান নোট (ঐচ্ছিক)' : 'Resolution Note (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={quickResolveNote}
                          onChange={(e) => setQuickResolveNote(e.target.value)}
                          placeholder={isBn ? 'যেমন: ফাইবার জয়েন্ট ও অনু রিস্টার্ট করা হয়েছে' : 'e.g. Fiber spliced & ONU restarted'}
                          className="w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setResolvingTicketId(null);
                            setQuickResolveNote('');
                            setQuickResolverName('');
                          }}
                          className="h-8 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          {isBn ? 'বাতিল' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(ticket, 'resolved', quickResolveNote, quickResolverName)
                          }
                          className="h-8 px-3.5 rounded-lg bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isBn ? '৪. সমাধানকৃত নিশ্চিত' : 'Confirm Resolved'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4-Stage One-Tap Status Buttons */}
                  {canChangeStatusForTicket(ticket) && (
                    <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                      {TICKET_STAGES.map((st) => {
                        const isActive = ticket.status === st.id;
                        const activeCls =
                          st.id === 'resolved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : st.id === 'in_progress'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : st.id === 'reviewing'
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                : 'bg-rose-600 text-white border-rose-600 shadow-xs';

                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              if (st.id === 'resolved') {
                                if (ticket.status === 'resolved') return;
                                sounds.playTap();
                                setResolvingTicketId(ticket.id);
                                setQuickResolveNote(ticket.resolutionNote || '');
                                setQuickResolverName(activeActorName || ticket.assignedStaffName || '');
                              } else {
                                handleStatusChange(ticket, st.id);
                              }
                            }}
                            className={`h-9 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                              isActive
                                ? activeCls
                                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isBn ? st.shortBn : st.shortEn}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Support Ticket Form Sheet */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingTicket
                    ? isBn
                      ? `টিকেট এডিট (#${editingTicket.ticketNumber})`
                      : `Edit Ticket (#${editingTicket.ticketNumber})`
                    : isBn
                      ? 'নতুন কমপ্লেইন টিকেট'
                      : 'New Complaint Ticket'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? `অভিযোগ দাখিলকারী: ${editingTicket?.createdBy || user?.name || 'অ্যাডমিন'}`
                    : `Filed by: ${editingTicket?.createdBy || user?.name || 'Admin'}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsFormOpen(false))}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 overflow-y-auto space-y-3.5">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'গ্রাহকের নাম *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isBn ? 'যেমন: মোঃ রফিকুল ইসলাম' : 'Customer full name'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'মোবাইল নাম্বার' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'গ্রাহক কোড / আইডি' : 'Customer ID'}
                  </label>
                  <input
                    type="text"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value)}
                    placeholder={isBn ? 'যেমন: pcn104' : 'e.g. pcn104'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'এলাকা / ঠিকানা' : 'Area / Address'}
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={isBn ? 'যেমন: বাজার রোড' : 'Area name'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'সমস্যার ধরন' : 'Issue Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isBn ? c.labelBn : c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'অগ্রাধিকার (Priority)' : 'Priority'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPriority(opt.id)}
                        className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === opt.id
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isBn ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(editingTicket ? canChangeStatusForTicket(editingTicket) : canMutateTickets) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'দায়িত্বপ্রাপ্ত টেকনিশিয়ান / স্টাফ' : 'Assign Technician / Staff'}
                  </label>
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  >
                    <option value="">{isBn ? 'এখন অ্যাসাইন নয় (পরে ঠিক করবো)' : 'Unassigned'}</option>
                    {staffAccounts.filter(isActualStaffAccount).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'সমস্যার বিস্তারিত বিবরণ' : 'Issue Description'}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isBn ? 'যেমন: সকাল থেকে লাল বাতি জ্বলছে, ফাইবার ক্যাবল ছিঁড়ে গেছে...' : 'Describe the issue...'}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
                />
              </div>

              {editingTicket && canChangeStatusForTicket(editingTicket) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'সমাধান নোট' : 'Resolution Note'}
                  </label>
                  <input
                    type="text"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder={isBn ? 'কিভাবে সমাধান করা হয়েছে...' : 'How was it resolved...'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              )}

              {!isAdmin && !editingTicket && (
                <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isBn
                      ? isSubAdminUser
                        ? 'অভিযোগ দাখিলের ৩০ মিনিটের মধ্যে আপনার নিজের টিকেট এডিট ও স্থায়ীভাবে মুছতে পারবেন — এরপর শুধু অ্যাডমিন নিয়ন্ত্রণ করবেন।'
                        : 'অভিযোগ দাখিলের ১০ মিনিটের মধ্যে এডিট/ডিলিট করতে পারবেন — এরপর শুধু অ্যাডমিন নিয়ন্ত্রণ করবেন।'
                      : isSubAdminUser
                        ? 'You can edit/delete your own submission within 30 minutes — after that only Admin controls it.'
                        : 'You can edit/delete within 10 minutes of submission — after that only Admin controls it.'}
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => closeSubViewViaBack(() => setIsFormOpen(false))}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-2 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
                >
                  {isSaving
                    ? isBn
                      ? 'সেভ হচ্ছে...'
                      : 'Saving...'
                    : editingTicket
                      ? isBn
                        ? 'আপডেট করুন'
                        : 'Update Ticket'
                      : isBn
                        ? 'টিকেট সেভ করুন'
                        : 'Save Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Staff Support Login Modal */}
      {isStaffLoginOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'নির্দিষ্ট স্টাফ লগইন' : 'Dedicated Staff Login'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'সকল অভিযোগ দেখতে ও স্ট্যাটাস পরিবর্তন করতে লগইন করুন'
                      : 'Log in to view all complaints & update status'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsStaffLoginOpen(false))}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleStaffLoginSubmit} className="p-5 space-y-3.5">
              {staffLoginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                  {staffLoginError}
                </div>
              )}

              {staffAccounts.filter(isActualStaffAccount).length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'স্টাফ তালিকা থেকে নির্বাচন (ঐচ্ছিক)' : 'Select Staff (Optional)'}
                  </label>
                  <select
                    value={
                      staffAccounts.filter(isActualStaffAccount).find(
                        (s) =>
                          s.phone === staffLoginIdentifier ||
                          s.id === staffLoginIdentifier ||
                          (s.userCode && s.userCode === staffLoginIdentifier)
                      )?.id || ''
                    }
                    onChange={(e) => {
                      const picked = staffAccounts.find((s) => s.id === e.target.value);
                      if (picked) {
                        setStaffLoginIdentifier(picked.phone || picked.userCode || picked.id);
                      }
                    }}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">{isBn ? 'স্টাফ বেছে নিন...' : 'Choose staff member...'}</option>
                    {staffAccounts
                      .filter(isActualStaffAccount)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.role} ({s.phone || s.userCode || s.id})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'স্টাফ মোবাইল নাম্বার বা স্টাফ কোড *' : 'Staff Mobile Number or Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={staffLoginIdentifier}
                  onChange={(e) => setStaffLoginIdentifier(e.target.value)}
                  placeholder={isBn ? 'যেমন: 017XXXXXXXX বা STF-01' : 'e.g. 017XXXXXXXX'}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'স্টাফ সাপোর্ট পিন *' : 'Staff Support PIN *'}
                </label>
                <input
                  type="password"
                  required
                  inputMode="numeric"
                  value={staffLoginPin}
                  onChange={(e) => setStaffLoginPin(e.target.value)}
                  placeholder={isBn ? 'আপনার ৪+ ডিজিটের পিন দিন' : 'Enter 4+ digit PIN'}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeSubViewViaBack(() => setIsStaffLoginOpen(false))}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingStaff}
                  className="flex-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  {isVerifyingStaff
                    ? isBn
                      ? 'যাচাই হচ্ছে...'
                      : 'Verifying...'
                    : isBn
                      ? 'স্টাফ লগইন করুন'
                      : 'Login as Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Staff Support PIN Manager Modal */}
      {isAdmin && isStaffPinModalOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  {isBn ? 'স্টাফ সাপোর্ট লগইন পিন সেটিংস' : 'Staff Support Login PIN Settings'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? 'স্টাফদের অভিযোগ প্যানেলে লগইনের পিন নির্ধারণ করুন'
                    : 'Configure PINs for staff complaint panel login'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsStaffPinModalOpen(false))}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffPinSettings} className="p-5 overflow-y-auto space-y-4">
              {staffPinSavedNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {staffPinSavedNotice}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'সাধারণ স্টাফ লগইন পিন (ডিফল্ট)' : 'Default Staff Login PIN'}
                </label>
                <input
                  type="text"
                  required
                  value={editGlobalStaffPin}
                  onChange={(e) => setEditGlobalStaffPin(e.target.value)}
                  placeholder="1234"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              {staffAccounts.filter(isActualStaffAccount).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    {isBn ? 'আলাদা স্টাফের ব্যক্তিগত পিন (ঐচ্ছিক)' : 'Per-Staff Custom PIN (Optional)'}
                  </p>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {staffAccounts.filter(isActualStaffAccount).map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {st.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {st.phone || st.userCode || st.role}
                          </p>
                        </div>
                        <input
                          type="text"
                          value={editPerStaffPins[st.id] || ''}
                          onChange={(e) =>
                            setEditPerStaffPins((prev) => ({ ...prev, [st.id]: e.target.value }))
                          }
                          placeholder={editGlobalStaffPin || '1234'}
                          className="w-24 h-9 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => closeSubViewViaBack(() => setIsStaffPinModalOpen(false))}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingStaffPin}
                  className="flex-2 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md cursor-pointer"
                >
                  {isSavingStaffPin
                    ? isBn
                      ? 'সেভ হচ্ছে...'
                      : 'Saving...'
                    : isBn
                      ? 'পিন সংরক্ষণ করুন'
                      : 'Save PIN Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
