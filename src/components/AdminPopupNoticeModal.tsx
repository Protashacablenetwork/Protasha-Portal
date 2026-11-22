import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Megaphone,
  Plus,
  Power,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X
} from 'lucide-react';
import {
  Language,
  PopupNotice,
  PopupNoticeAcknowledgement,
  PopupNoticeAudience,
  PopupNoticePriority
} from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { useSubViewBack } from '../utils/useSubViewBack';

interface AdminPopupNoticeModalProps {
  isOpen: boolean;
  notices: PopupNotice[];
  acknowledgementsByNotice: Record<string, PopupNoticeAcknowledgement[]>;
  lang: Language;
  currentAdminName: string;
  onClose: () => void;
  onSaveNotice: (notice: PopupNotice, alsoSendToNotifCenter?: boolean) => Promise<void> | void;
  onToggleNoticeActive: (notice: PopupNotice) => Promise<void> | void;
  onDeleteNotice: (noticeId: string) => Promise<void> | void;
  onPreviewNotice: (notice: PopupNotice) => void;
  onSubViewChange?: (hasSubView: boolean) => void;
}

const DEFAULT_CONSENT_BN = 'আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।';
const DEFAULT_CONSENT_EN = 'I have read this notice carefully and acknowledge it.';

const PRESET_TEMPLATES_BN = [
  {
    label: 'মাসিক বিল নির্দেশনা',
    title: 'মাসিক বিল পরিশোধ সংক্রান্ত জরুরি বিজ্ঞপ্তি',
    message:
      'সম্মানিত গ্রাহক ও সদস্যবৃন্দ, নির্ধারিত সময়ের মধ্যে আপনার মাসিক ক্যাবল ও ইন্টারনেট বিল পরিশোধ করে নিরবচ্ছিন্ন সংযোগ নিশ্চিত করুন। কোনো সমস্যা হলে সাপোর্ট টিকেট ওপেন করুন।',
    priority: 'important' as PopupNoticePriority
  },
  {
    label: 'সার্ভিস মেইনটেন্যান্স',
    title: 'সিস্টেম ও লাইন রক্ষণাবেক্ষণ নোটিশ',
    message:
      'নেটওয়ার্কের গতি ও স্থায়িত্ব বৃদ্ধির জন্য আমাদের এলাকায় জরুরি রক্ষণাবেক্ষণ কাজ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।',
    priority: 'urgent' as PopupNoticePriority
  },
  {
    label: 'নতুন নীতিমালা ও সম্মতি',
    title: 'নতুন অ্যাপ ব্যবহার ও সেবা নীতিমালা',
    message:
      'অ্যাপ ব্যবহারের নিরাপত্তা ও সেবার মান বজায় রাখতে নতুন নির্দেশনা কার্যকর করা হয়েছে। অনুগ্রহ করে নিয়মাবলি মেনে সেবা গ্রহণ করুন।',
    priority: 'policy' as PopupNoticePriority
  }
];

export const AdminPopupNoticeModal: React.FC<AdminPopupNoticeModalProps> = ({
  isOpen,
  notices,
  acknowledgementsByNotice,
  lang,
  currentAdminName,
  onClose,
  onSaveNotice,
  onToggleNoticeActive,
  onDeleteNotice,
  onPreviewNotice,
  onSubViewChange
}) => {
  const isBn = lang === 'bn';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<PopupNotice | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<PopupNoticePriority>('important');
  const [audience, setAudience] = useState<PopupNoticeAudience>('all');
  const [consentLabel, setConsentLabel] = useState(isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN);
  const [requiresConsent, setRequiresConsent] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [alsoBroadcastNotif, setAlsoBroadcastNotif] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [expandedAckNoticeId, setExpandedAckNoticeId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const subViewDepth = isFormOpen ? 1 : 0;

  useSubViewBack(
    isOpen,
    subViewDepth,
    () => {
      setIsFormOpen(false);
      setEditingNotice(null);
    },
    onSubViewChange,
    'adminPopupNotice'
  );

  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [notices]);

  if (!isOpen) return null;

  const showToast = (txt: string) => {
    setToast(txt);
    setTimeout(() => setToast(null), 2800);
  };

  const resetForm = () => {
    setEditingNotice(null);
    setTitle('');
    setMessage('');
    setPriority('important');
    setAudience('all');
    setConsentLabel(isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN);
    setRequiresConsent(true);
    setIsActive(true);
    setAlsoBroadcastNotif(true);
    setFormError('');
  };

  const openCreateForm = () => {
    sounds.playTap();
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (notice: PopupNotice) => {
    sounds.playTap();
    setEditingNotice(notice);
    setTitle(notice.title);
    setMessage(notice.message);
    setPriority(notice.priority);
    setAudience(notice.audience);
    setConsentLabel(notice.consentLabel || (isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN));
    setRequiresConsent(notice.requiresConsent !== false);
    setIsActive(notice.isActive);
    setAlsoBroadcastNotif(false);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanMsg = message.trim();
    if (!cleanTitle) {
      setFormError(isBn ? 'অনুগ্রহ করে নোটিশের শিরোনাম লিখুন' : 'Please enter notice title');
      return;
    }
    if (!cleanMsg) {
      setFormError(isBn ? 'অনুগ্রহ করে নোটিশের বিস্তারিত বার্তা লিখুন' : 'Please enter notice message');
      return;
    }

    setIsSaving(true);
    setFormError('');
    try {
      const nowIso = new Date().toISOString();
      const payload: PopupNotice = {
        id: editingNotice?.id || `pnotice_${Date.now()}`,
        title: cleanTitle.slice(0, 200),
        message: cleanMsg.slice(0, 3000),
        priority,
        audience,
        consentLabel: (consentLabel.trim() || (isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN)).slice(0, 300),
        requiresConsent,
        isActive,
        createdBy: editingNotice?.createdBy || currentAdminName || 'Admin',
        createdAt: editingNotice?.createdAt || nowIso,
        updatedAt: nowIso
      };

      await onSaveNotice(payload, !editingNotice && alsoBroadcastNotif);
      sounds.playSuccess();
      setIsFormOpen(false);
      setEditingNotice(null);
      showToast(
        editingNotice
          ? isBn
            ? 'পপ-আপ নোটিশ আপডেট করা হয়েছে!'
            : 'Popup notice updated!'
          : isBn
            ? 'পপ-আপ নোটিশ প্রকাশিত হয়েছে! ইউজাররা অ্যাপে দেখতে পাবেন।'
            : 'Popup notice published!'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityBadge = (p: PopupNoticePriority) => {
    switch (p) {
      case 'urgent':
        return {
          bn: 'জরুরি',
          en: 'Urgent',
          cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
        };
      case 'important':
        return {
          bn: 'গুরুত্বপূর্ণ',
          en: 'Important',
          cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
        };
      case 'policy':
        return {
          bn: 'নীতিমালা',
          en: 'Policy',
          cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
        };
      default:
        return {
          bn: 'সাধারণ',
          en: 'Info',
          cls: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
        };
    }
  };

  const getAudienceLabel = (aud: PopupNoticeAudience) => {
    if (aud === 'users') return isBn ? 'লগইনকৃত ইউজার ও স্টাফ' : 'Registered Users & Staff';
    if (aud === 'staff') return isBn ? 'শুধুমাত্র স্টাফ / সাব-এডমিন' : 'Staff / Sub-Admin Only';
    return isBn ? 'সকল ইউজার (ভিজিটরসহ)' : 'All Users (incl. Visitors)';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              if (isFormOpen) {
                setIsFormOpen(false);
                setEditingNotice(null);
              } else {
                onClose();
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#E52E2E] flex items-center justify-center shrink-0">
            <BellRing className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {isFormOpen
                ? editingNotice
                  ? isBn
                    ? 'পপ-আপ নোটিশ সম্পাদনা'
                    : 'Edit Popup Notice'
                  : isBn
                    ? 'নতুন পপ-আপ নোটিশ তৈরি'
                    : 'Create Popup Notice'
                : isBn
                  ? 'পপ-আপ নোটিশ ও ইউজার সম্মতি'
                  : 'Popup Notices & User Consent'}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isBn
                ? 'অ্যাপ ওপেন করলেই ইউজারদের পপ-আপ বক্সে দেখানো ও সম্মতি নেওয়া'
                : 'Show consent popup boxes to users inside the app'}
            </p>
          </div>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={openCreateForm}
            className="h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন নোটিশ' : 'New Notice'}</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 space-y-4 pb-24 max-w-3xl mx-auto w-full">
        {toast && (
          <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                {formError}
              </div>
            )}

            {/* Quick Presets */}
            {!editingNotice && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  {isBn ? 'দ্রুত টেমপ্লেট বাছাই করুন:' : 'Quick Templates:'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEMPLATES_BN.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setTitle(tpl.title);
                        setMessage(tpl.message);
                        setPriority(tpl.priority);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      + {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isBn ? 'নোটিশের ধরন' : 'Notice Priority'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'info', bn: 'সাধারণ নোটিশ', en: 'General' },
                    { id: 'important', bn: 'গুরুত্বপূর্ণ', en: 'Important' },
                    { id: 'urgent', bn: 'জরুরি সতর্কতা', en: 'Urgent' },
                    { id: 'policy', bn: 'নীতিমালা / সম্মতি', en: 'Policy' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setPriority(item.id);
                    }}
                    className={`h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      priority === item.id
                        ? 'bg-[#E52E2E] text-white border-[#E52E2E] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isBn ? 'কাদের অ্যাপে দেখাবে?' : 'Target Audience'}
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as PopupNoticeAudience)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
              >
                <option value="all">
                  {isBn ? 'সকল ইউজার (রেজিস্টার্ড ইউজার, স্টাফ ও ভিজিটর)' : 'All Users (incl. Visitors)'}
                </option>
                <option value="users">
                  {isBn ? 'শুধুমাত্র লগইনকৃত ইউজার ও স্টাফ' : 'Logged-in Users & Staff Only'}
                </option>
                <option value="staff">
                  {isBn ? 'শুধুমাত্র স্টাফ ও সাব-এডমিন' : 'Staff & Sub-Admins Only'}
                </option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'নোটিশের শিরোনাম' : 'Notice Title'}
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isBn ? 'যেমন: জরুরি নেটওয়ার্ক আপগ্রেড নোটিশ' : 'Enter notice title...'}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'বিস্তারিত নোটিশ বার্তা' : 'Detailed Notice Message'}
              </label>
              <textarea
                rows={4}
                required
                maxLength={3000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isBn
                    ? 'ইউজারদের পপ-আপ বক্সে যে সম্পূর্ণ নোটিশটি দেখাবে তা এখানে লিখুন...'
                    : 'Write complete notice message to display in popup box...'
                }
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white resize-y"
              />
            </div>

            {/* Consent Toggle & Text */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {isBn
                      ? 'ইউজারের সম্মতি (Checkbox Acknowledgement) বাধ্যতামূলক করুন'
                      : 'Require User Consent Checkbox'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'চালু থাকলে ইউজার টিক দিয়ে সম্মতি না দেওয়া পর্যন্ত পপ-আপ কনফার্ম হবে না'
                      : 'Users must tick the consent checkbox before confirming'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requiresConsent}
                  onChange={(e) => setRequiresConsent(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-emerald-600 cursor-pointer"
                />
              </label>

              {requiresConsent && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {isBn ? 'সম্মতি চেকবক্সের লেখা' : 'Consent Checkbox Label'}
                  </label>
                  <input
                    type="text"
                    maxLength={300}
                    value={consentLabel}
                    onChange={(e) => setConsentLabel(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <label className="flex items-center justify-between gap-3 cursor-pointer pt-1 border-t border-slate-200/80 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isBn ? 'প্রকাশ করার সাথে সাথেই সক্রিয় (Active) রাখুন' : 'Keep notice active immediately'}
                </span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-emerald-600 cursor-pointer"
                />
              </label>

              {!editingNotice && (
                <label className="flex items-center justify-between gap-3 cursor-pointer pt-1 border-t border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isBn
                      ? 'নোটিফিকেশন বেল সেন্টারেও একসাথে পাঠান'
                      : 'Also send copy to Notification Bell center'}
                  </span>
                  <input
                    type="checkbox"
                    checked={alsoBroadcastNotif}
                    onChange={(e) => setAlsoBroadcastNotif(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-rose-600 cursor-pointer"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingNotice(null);
                }}
                className="flex-1 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-2 h-11 px-5 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSaving
                    ? isBn
                      ? 'সংরক্ষণ হচ্ছে...'
                      : 'Saving...'
                    : editingNotice
                      ? isBn
                        ? 'নোটিশ আপডেট করুন'
                        : 'Update Notice'
                      : isBn
                        ? 'পপ-আপ নোটিশ প্রকাশ করুন'
                        : 'Publish Popup Notice'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Overview Banner CTA */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 shrink-0" />
                  <span>{isBn ? 'ইন-অ্যাপ পপ-আপ নোটিশ ও সম্মতি সিস্টেম' : 'In-App Notice & Consent System'}</span>
                </p>
                <p className="text-[11px] text-rose-100 leading-snug">
                  {isBn
                    ? 'এখান থেকে দেওয়া প্রতিটি সক্রিয় নোটিশ ইউজারদের অ্যাপের ভেতরে পপ-আপ হিসেবে দেখাবে ও সম্মতি রেকর্ড করবে।'
                    : 'Active notices appear as an interactive consent popup inside users’ apps.'}
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateForm}
                className="h-9 px-3 rounded-xl bg-white text-rose-700 text-xs font-black shrink-0 shadow-sm active:scale-95 cursor-pointer"
              >
                {isBn ? '+ নতুন দিন' : '+ Create'}
              </button>
            </div>

            {/* Notices List */}
            {sortedNotices.length === 0 ? (
              <div className="py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <BellRing className="w-10 h-10 mx-auto text-slate-400 stroke-1" />
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                  {isBn ? 'এখনো কোনো পপ-আপ নোটিশ তৈরি করা হয়নি' : 'No popup notices created yet'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn
                    ? 'উপরের "নতুন নোটিশ" বাটনে চাপ দিয়ে ইউজারদের জন্য পপ-আপ নোটিশ পাঠান।'
                    : 'Tap "New Notice" above to send a consent popup to your users.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotices.map((notice) => {
                  const acks = acknowledgementsByNotice[notice.id] || [];
                  const pMeta = getPriorityBadge(notice.priority);
                  const isAckExpanded = expandedAckNoticeId === notice.id;
                  const isConfirmDelete = confirmDeleteId === notice.id;

                  return (
                    <div
                      key={notice.id}
                      className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 ${
                        notice.isActive
                          ? 'border-emerald-300/80 dark:border-emerald-800/70'
                          : 'border-slate-200 dark:border-slate-800 opacity-85'
                      }`}
                    >
                      {/* Top Meta Row */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              notice.isActive
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {notice.isActive ? (isBn ? 'সক্রিয়' : 'Active') : isBn ? 'বন্ধ' : 'Paused'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${pMeta.cls}`}>
                            {isBn ? pMeta.bn : pMeta.en}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                            {getAudienceLabel(notice.audience)}
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(notice.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Title & Body */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{notice.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-3">
                          {notice.message}
                        </p>
                      </div>

                      {/* Acknowledgement Summary Pill + Actions */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playTap();
                            setExpandedAckNoticeId(isAckExpanded ? null : notice.id);
                          }}
                          className="h-8 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            {isBn
                              ? `সম্মতি দিয়েছে: ${toBengaliNumber(acks.length)} জন`
                              : `Acknowledged: ${acks.length}`}
                          </span>
                          {isAckExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              onPreviewNotice(notice);
                            }}
                            className="h-8 px-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-900/60 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isBn ? 'প্রিভিউ' : 'Preview'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              onToggleNoticeActive(notice);
                            }}
                            className={`h-8 px-2.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                              notice.isActive
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{notice.isActive ? (isBn ? 'বন্ধ করুন' : 'Pause') : isBn ? 'চালু করুন' : 'Activate'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(notice)}
                            className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                            title={isBn ? 'এডিট' : 'Edit'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setConfirmDeleteId(isConfirmDelete ? null : notice.id);
                            }}
                            className="h-8 w-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                            title={isBn ? 'মুছুন' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Two-Step Delete Confirm */}
                      {isConfirmDelete && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                            {isBn ? 'এই পপ-আপ নোটিশটি স্থায়ীভাবে মুছবেন?' : 'Delete this popup notice?'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              {isBn ? 'না' : 'No'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteNotice(notice.id);
                                setConfirmDeleteId(null);
                                showToast(isBn ? 'নোটিশ মুছে ফেলা হয়েছে' : 'Notice deleted');
                              }}
                              className="h-7 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                            >
                              {isBn ? 'হ্যাঁ, মুছুন' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expanded Acknowledgement User List */}
                      {isAckExpanded && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-200">
                            <span className="inline-flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              {isBn ? 'সম্মতি প্রদানকারী ইউজার তালিকা' : 'Acknowledged Users Log'}
                            </span>
                            <span className="tabular-nums">
                              {isBn ? `${toBengaliNumber(acks.length)} জন` : `${acks.length} total`}
                            </span>
                          </div>

                          {acks.length === 0 ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400 py-2 text-center">
                              {isBn ? 'এখনো কোনো ইউজার সম্মতি দেয়নি।' : 'No acknowledgements recorded yet.'}
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                              {acks.map((ack) => (
                                <div
                                  key={ack.id}
                                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2 text-xs"
                                >
                                  <div className="min-w-0">
                                    <p className="font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span className="truncate">{ack.userName}</span>
                                      {ack.userRole && (
                                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                                          {ack.userRole}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {ack.userPhone || ack.userKey}
                                      {ack.deviceLabel ? ` • ${ack.deviceLabel}` : ''}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 text-right">
                                    {new Date(ack.acknowledgedAt).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
