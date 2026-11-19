import React, { useEffect, useState, useRef } from 'react';
import {
  Headphones,
  Phone,
  MapPin,
  User,
  UserCheck,
  Clock,
  CheckCircle2,
  Wrench,
  MessageSquare,
  Send,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
  FileText,
  RefreshCw,
  Printer
} from 'lucide-react';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db, safeSetDoc, handleFirestoreError, OperationType } from '../utils/firebase';
import { Language, SupportTicket, SupportTicketMessage } from '../types';
import { safeStorage } from '../utils/safeStorage';
import {
  CATEGORY_LABELS,
  TicketActivityTimeline,
  TicketProgressStepper,
  buildPublicTrackingUrl,
  copyTextSafely,
  formatTicketDateTime,
  getTicketRoleLabel,
  getTicketStatusLabel
} from './TicketTrackingHelpers';
import { sounds } from '../utils/audio';

interface PublicTicketTrackerProps {
  ticketId: string;
  lang: Language;
  onExitToApp: () => void;
}

export const PublicTicketTracker: React.FC<PublicTicketTrackerProps> = ({
  ticketId,
  lang,
  onExitToApp
}) => {
  const isBn = lang === 'bn';
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [resolvedDocId, setResolvedDocId] = useState<string>(ticketId);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);

  // Real-time messages for this public ticket
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [chatText, setChatText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Apply saved theme if opened directly in standalone mode
  useEffect(() => {
    try {
      const savedTheme = safeStorage.getItem('protyasha_theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.body.classList.add('app-ready');
    } catch {}
  }, []);

  // Subscribe live to the SupportTicket document (supports both document ID and ticketNumber, plus localhost cache fallback)
  useEffect(() => {
    if (!ticketId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubTicket: (() => void) | null = null;
    let unsubMessages: (() => void) | null = null;

    setLoading(true);
    setNotFound(false);
    setNetworkError(false);

    // 1. Instant same-origin / localhost cache fallback while Firestore live stream connects
    let localFallback: SupportTicket | null = null;
    try {
      const cachedRaw = safeStorage.getItem('protyasha_support_tickets');
      if (cachedRaw) {
        const cachedList = JSON.parse(cachedRaw) as SupportTicket[];
        if (Array.isArray(cachedList)) {
          const found = cachedList.find(
            (t) =>
              String(t.id) === String(ticketId) ||
              String(t.ticketNumber || '').toLowerCase() === String(ticketId).toLowerCase()
          );
          if (found) {
            localFallback = found;
            setTicket(found);
            setResolvedDocId(String(found.id));
            setSenderName((prev) => prev || found.customerName || '');
            setLoading(false);
          }
        }
      }
    } catch {}

    const subscribeToDocId = (docId: string) => {
      if (cancelled) return;
      setResolvedDocId(docId);

      unsubTicket = onSnapshot(
        doc(db, 'support_tickets', docId),
        async (snap) => {
          if (cancelled) return;
          if (!snap.exists()) {
            // If looked up by ticketNumber (e.g., ?track=PCN-1001), resolve actual document ID once
            if (docId === ticketId) {
              try {
                const byNumberSnap = await getDocs(
                  query(collection(db, 'support_tickets'), where('ticketNumber', '==', ticketId))
                );
                if (!cancelled && !byNumberSnap.empty) {
                  const matchedDoc = byNumberSnap.docs[0];
                  if (unsubTicket) unsubTicket();
                  if (unsubMessages) unsubMessages();
                  subscribeToDocId(matchedDoc.id);
                  return;
                }
              } catch {}
            }
            if (!localFallback) {
              setTicket(null);
              setNotFound(true);
            }
            setLoading(false);
            return;
          }

          const data = snap.data() as SupportTicket;
          const resolvedTicket = { ...data, id: String(data.id || snap.id) };
          setTicket(resolvedTicket);
          setSenderName((prev) => prev || resolvedTicket.customerName || '');
          setNotFound(false);
          setNetworkError(false);
          setLoading(false);
        },
        async (err) => {
          if (cancelled) return;
          // Retry once via getDoc in case real-time WebChannel was blocked by a proxy
          try {
            const directSnap = await getDoc(doc(db, 'support_tickets', docId));
            if (!cancelled && directSnap.exists()) {
              const data = directSnap.data() as SupportTicket;
              const resolvedTicket = { ...data, id: String(data.id || directSnap.id) };
              setTicket(resolvedTicket);
              setSenderName((prev) => prev || resolvedTicket.customerName || '');
              setNotFound(false);
              setNetworkError(false);
              setLoading(false);
              return;
            }
          } catch {}

          setLoading(false);
          if (!localFallback) {
            setNetworkError(true);
          }
          handleFirestoreError(err, OperationType.GET, `support_tickets/${docId}`);
        }
      );

      const msgQuery = query(
        collection(db, 'support_tickets', docId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      unsubMessages = onSnapshot(
        msgQuery,
        (snap) => {
          if (cancelled) return;
          const list: SupportTicketMessage[] = [];
          snap.forEach((d) => {
            const m = d.data() as SupportTicketMessage;
            if (m && m.text) list.push({ ...m, id: String(m.id || d.id) });
          });
          setMessages(list);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, `support_tickets/${docId}/messages`);
        }
      );
    };

    const initTracker = async () => {
      let targetDocId = ticketId;

      try {
        // 1. Check if document exists directly by ID
        const directSnap = await getDoc(doc(db, 'support_tickets', ticketId));
        if (!cancelled && directSnap.exists()) {
          targetDocId = ticketId;
        } else {
          // 2. Query by ticketNumber field
          const qNum = query(collection(db, 'support_tickets'), where('ticketNumber', '==', ticketId));
          const qNumSnap = await getDocs(qNum);
          if (!cancelled && !qNumSnap.empty) {
            targetDocId = qNumSnap.docs[0].id;
          } else {
            // 3. Query by id field equality
            const qId = query(collection(db, 'support_tickets'), where('id', '==', ticketId));
            const qIdSnap = await getDocs(qId);
            if (!cancelled && !qIdSnap.empty) {
              targetDocId = qIdSnap.docs[0].id;
            }
          }
        }
      } catch {}

      if (cancelled) return;
      subscribeToDocId(localFallback?.id || targetDocId);
    };

    initTracker();

    return () => {
      cancelled = true;
      if (unsubTicket) unsubTicket();
      if (unsubMessages) unsubMessages();
    };
  }, [ticketId, retryCounter]);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleCopyUrl = async () => {
    sounds.playSuccess();
    const ok = await copyTextSafely(buildPublicTrackingUrl(resolvedDocId || ticketId));
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendPublicMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || ticket.isPublicTrackingEnabled === false || isSending) return;
    const text = chatText.trim();
    if (!text) return;

    const displayName = (senderName.trim() || ticket.customerName || (isBn ? 'গ্রাহক' : 'Customer')).slice(0, 150);
    const nowIso = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const payload: SupportTicketMessage = {
      id: msgId,
      ticketId: ticket.id,
      senderId: 'public_customer',
      senderName: displayName,
      senderRole: 'visitor',
      text: text.slice(0, 2000),
      type: 'message',
      createdAt: nowIso
    };

    setIsSending(true);
    setChatText('');
    setMessages((prev) => (prev.some((m) => m.id === msgId) ? prev : [...prev, payload]));

    try {
      await safeSetDoc(doc(db, 'support_tickets', ticket.id, 'messages', msgId), payload);
      await safeSetDoc(
        doc(db, 'support_tickets', ticket.id),
        {
          messageCount: Math.max((ticket.messageCount || 0) + 1, messages.length + 1),
          lastMessageText: text.slice(0, 300),
          lastMessageBy: displayName,
          lastMessageAt: nowIso,
          updatedAt: nowIso
        },
        { merge: true }
      ).catch(() => {});
      sounds.playTap();
    } catch (err) {
      console.error('Public ticket chat send error:', err);
      setChatText(text);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col select-none">
      {/* Top Public Brand Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#E52E2E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
              {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
            </h1>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">
              {isBn ? 'অনলাইন লাইভ অভিযোগ ট্র্যাকিং' : 'Live Online Complaint Tracking'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playSuccess();
              window.print();
            }}
            className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? (isBn ? 'কপি হয়েছে' : 'Copied') : isBn ? 'লিংক কপি' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onExitToApp();
            }}
            className="h-9 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isBn ? 'মূল অ্যাপ' : 'Main App'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 space-y-4 pb-16">
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-10 h-10 rounded-full border-3 border-rose-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isBn ? 'লাইভ অভিযোগের তথ্য লোড হচ্ছে...' : 'Loading live ticket updates...'}
            </p>
          </div>
        ) : networkError && !ticket ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'সার্ভারের সাথে সংযোগে সাময়িক সমস্যা' : 'Temporary Connection Issue'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।'
                : 'Please check your internet connection and try again.'}
            </p>
            <button
              type="button"
              onClick={() => setRetryCounter((c) => c + 1)}
              className="h-10 px-5 rounded-xl bg-[#E52E2E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry'}</span>
            </button>
          </div>
        ) : notFound || !ticket ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'অভিযোগ টিকেটটি পাওয়া যায়নি' : 'Support Ticket Not Found'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'লিংকটি ভুল হতে পারে অথবা টিকেটটি মুছে ফেলা হয়েছে। সঠিক ট্র্যাকিং লিংকের জন্য অফিসে যোগাযোগ করুন।'
                : 'The tracking link may be invalid or this ticket was removed.'}
            </p>
          </div>
        ) : ticket.isPublicTrackingEnabled === false ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'পাবলিক ট্র্যাকিং সাময়িকভাবে বন্ধ রয়েছে' : 'Public Tracking Paused'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'কর্তৃপক্ষ এই অভিযোগের পাবলিক লিংকটি বর্তমানে বন্ধ রেখেছেন।'
                : 'Public visibility is currently disabled for this ticket.'}
            </p>
          </div>
        ) : (
          <div id="printable-ticket-report" className="space-y-4">
            {/* Ticket Summary Hero Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      #{ticket.ticketNumber}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                      {CATEGORY_LABELS[ticket.category]
                        ? isBn
                          ? CATEGORY_LABELS[ticket.category].bn
                          : CATEGORY_LABELS[ticket.category].en
                        : ticket.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                    {ticket.customerName}
                    {ticket.customerCode && (
                      <span className="ml-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        ({ticket.customerCode})
                      </span>
                    )}
                  </h2>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 ${
                    ticket.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : ticket.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                        : ticket.status === 'reviewing'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                  }`}
                >
                  {getTicketStatusLabel(ticket.status, isBn)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {ticket.area && (
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.area}
                  </span>
                )}
                {ticket.assignedStaffName && (
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-300">
                    <Wrench className="w-3.5 h-3.5" />
                    {isBn ? 'টেকনিশিয়ান:' : 'Technician:'} {ticket.assignedStaffName}
                  </span>
                )}
                {ticket.customerPhone && (
                  <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {ticket.customerPhone}
                  </span>
                )}
              </div>

              {ticket.description && (
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 leading-relaxed">
                  {ticket.description}
                </p>
              )}

              {/* Filed by & Resolved by */}
              <div className="space-y-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-slate-500 dark:text-slate-400">
                      {isBn ? 'অভিযোগ দাখিল:' : 'Filed by:'}
                    </span>
                    <strong className="font-extrabold">
                      {ticket.createdBy || (isBn ? 'অ্যাডমিন' : 'Admin')}
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 tabular-nums text-[11px]">
                    <Clock className="w-3 h-3" />
                    {formatTicketDateTime(ticket.createdAt, isBn)}
                  </span>
                </div>

                {ticket.status === 'resolved' && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-emerald-700 dark:text-emerald-300">
                    <span className="inline-flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সমাধানকারী:' : 'Resolved by:'}</span>
                      <strong className="font-extrabold">
                        {ticket.resolvedBy || ticket.assignedStaffName || (isBn ? 'অ্যাডমিন' : 'Admin')}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn)}
                    </span>
                  </div>
                )}
              </div>

              {ticket.resolutionNote && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    <strong>{isBn ? 'সমাধান নোট: ' : 'Resolution Note: '}</strong>
                    {ticket.resolutionNote}
                  </span>
                </div>
              )}
            </div>

            {/* 4-Step Live Status Stepper */}
            <TicketProgressStepper status={ticket.status} lang={lang} />

            {/* Activity History Timeline */}
            <TicketActivityTimeline ticket={ticket} lang={lang} />

            {/* Live Public Conversation Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'লাইভ মেসেজ ও আপডেট' : 'Live Conversation'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'এখান থেকেই সাপোর্ট টিমের সাথে রিয়েল-টাইম কথা বলুন'
                      : 'Chat with our support team in real time'}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 py-8">
                    {isBn ? 'এখনো কোনো মেসেজ নেই। নিচে লিখে বার্তা পাঠান।' : 'No messages yet.'}
                  </p>
                ) : (
                  messages.map((msg) => {
                    if (msg.type === 'system') {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center">
                            {msg.text} • {formatTicketDateTime(msg.createdAt, isBn)}
                          </div>
                        </div>
                      );
                    }
                    const isCustomerSide = msg.senderId === 'public_customer' || msg.senderRole === 'visitor';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCustomerSide ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 px-1 mb-0.5 text-[10px]">
                          <span className="font-extrabold text-slate-600 dark:text-slate-400">
                            {msg.senderName}
                          </span>
                          {msg.senderRole && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                              {getTicketRoleLabel(msg.senderRole, isBn)}
                            </span>
                          )}
                        </div>
                        <div
                          className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${
                            isCustomerSide
                              ? 'bg-[#E52E2E] text-white rounded-br-sm'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words font-medium">{msg.text}</p>
                          <p
                            className={`text-[10px] mt-1 text-right ${
                              isCustomerSide ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            {formatTicketDateTime(msg.createdAt, isBn)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={handleSendPublicMessage}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={isBn ? 'আপনার নাম' : 'Your name'}
                  className="w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder={isBn ? 'মেসেজ লিখুন...' : 'Write a message...'}
                    className="flex-1 h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !chatText.trim()}
                    className="w-11 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
