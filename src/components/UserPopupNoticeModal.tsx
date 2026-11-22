import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Loader2,
  Megaphone,
  ShieldCheck,
  X
} from 'lucide-react';
import { Language, PopupNotice } from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface UserPopupNoticeModalProps {
  notice: PopupNotice | null;
  queueIndex?: number;
  queueTotal?: number;
  isPreviewMode?: boolean;
  isSubmitting?: boolean;
  lang: Language;
  onAcknowledge: (notice: PopupNotice) => Promise<void> | void;
  onClosePreview?: () => void;
}

export const UserPopupNoticeModal: React.FC<UserPopupNoticeModalProps> = ({
  notice,
  queueIndex = 1,
  queueTotal = 1,
  isPreviewMode = false,
  isSubmitting = false,
  lang,
  onAcknowledge,
  onClosePreview
}) => {
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);

  useEffect(() => {
    setHasCheckedConsent(false);
  }, [notice?.id, isPreviewMode]);

  if (!notice) return null;

  const isBn = lang === 'bn';
  const requiresConsent = notice.requiresConsent !== false;
  const canConfirm = !requiresConsent || hasCheckedConsent;

  const priorityMeta = (() => {
    switch (notice.priority) {
      case 'urgent':
        return {
          gradient: 'from-rose-600 via-red-600 to-rose-700',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          labelBn: 'জরুরি নোটিশ',
          labelEn: 'Urgent Notice',
          Icon: AlertTriangle
        };
      case 'important':
        return {
          gradient: 'from-amber-500 via-orange-500 to-orange-600',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          labelBn: 'গুরুত্বপূর্ণ বার্তা',
          labelEn: 'Important Notice',
          Icon: Megaphone
        };
      case 'policy':
        return {
          gradient: 'from-indigo-600 via-blue-600 to-indigo-700',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          labelBn: 'নীতিমালা ও শর্তাবলী',
          labelEn: 'Policy & Guidelines',
          Icon: ShieldCheck
        };
      default:
        return {
          gradient: 'from-teal-600 via-emerald-600 to-teal-700',
          badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
          labelBn: 'অ্যাডমিন নোটিশ',
          labelEn: 'Admin Notice',
          Icon: BellRing
        };
    }
  })();

  const HeaderIcon = priorityMeta.Icon;

  const formattedDate = (() => {
    try {
      return new Date(notice.createdAt).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  })();

  const consentText =
    notice.consentLabel?.trim() ||
    (isBn
      ? 'আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।'
      : 'I have read and acknowledge this notice.');

  return (
    <div
      className="fixed inset-0 z-[95] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-5 select-none animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-popup-notice-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Colored Header Banner */}
        <div className={`bg-gradient-to-r ${priorityMeta.gradient} px-5 py-4 text-white relative shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shrink-0">
                <HeaderIcon className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wide">
                    {isBn ? priorityMeta.labelBn : priorityMeta.labelEn}
                  </span>
                  {queueTotal > 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-black/25 text-white text-[10px] font-bold tabular-nums">
                      {isBn
                        ? `${toBengaliNumber(queueIndex)} / ${toBengaliNumber(queueTotal)}`
                        : `${queueIndex} / ${queueTotal}`}
                    </span>
                  )}
                  {isPreviewMode && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-900 text-[10px] font-black">
                      {isBn ? 'প্রিভিউ' : 'PREVIEW'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-white/90 mt-1 truncate">
                  {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protyasha Cable Network'}
                  {formattedDate ? ` • ${formattedDate}` : ''}
                </p>
              </div>
            </div>

            {isPreviewMode && onClosePreview && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onClosePreview();
                }}
                aria-label={isBn ? 'প্রিভিউ বন্ধ করুন' : 'Close preview'}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Notice Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <h3
              id="user-popup-notice-title"
              className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug"
            >
              {notice.title}
            </h3>

            {notice.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <img
                  src={notice.imageUrl}
                  alt={notice.title}
                  className="w-full max-h-48 object-cover"
                />
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line">
              {notice.message}
            </div>
          </div>

          {/* Consent / Acknowledgement Checkbox */}
          {requiresConsent && (
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 cursor-pointer active:scale-[0.99] transition-transform">
              <input
                type="checkbox"
                checked={hasCheckedConsent}
                onChange={(e) => {
                  sounds.playTap();
                  setHasCheckedConsent(e.target.checked);
                }}
                className="mt-0.5 w-4.5 h-4.5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                {consentText}
              </span>
            </label>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-2">
          {requiresConsent && !hasCheckedConsent && (
            <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 text-center">
              {isBn
                ? 'এগিয়ে যেতে অনুগ্রহ করে উপরের সম্মতি বক্সে টিক দিন'
                : 'Please check the consent box above to acknowledge'}
            </p>
          )}

          {isPreviewMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onClosePreview?.();
                }}
                className="flex-1 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold cursor-pointer"
              >
                {isBn ? 'প্রিভিউ বন্ধ করুন' : 'Close Preview'}
              </button>
              <button
                type="button"
                disabled={!canConfirm}
                onClick={() => {
                  sounds.playSuccess();
                  onClosePreview?.();
                }}
                className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? 'সম্মতি টেস্ট সফল' : 'Consent Test OK'}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canConfirm || isSubmitting}
              onClick={() => {
                if (!canConfirm || isSubmitting) return;
                onAcknowledge(notice);
              }}
              className="w-full h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>
                    {requiresConsent
                      ? isBn
                        ? 'সম্মতি দিন ও নিশ্চিত করুন'
                        : 'Agree & Acknowledge'
                      : isBn
                        ? 'পড়েছি ও বুঝেছি'
                        : 'Got It'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
