import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Megaphone, 
  Handshake, 
  Check, 
  Trash2, 
  Clock, 
  Tag, 
  Share2 
} from 'lucide-react';
import { Language, NotificationItem, UserSession } from '../types';
import { formatCurrency } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface NotificationDetailModalProps {
  notification: NotificationItem | null;
  lang: Language;
  user: UserSession | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onEdit?: (notif: NotificationItem) => void;
  onOpenWeather?: () => void;
  onOpenPrayerTimes?: () => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  lang,
  user,
  onClose,
  onDelete,
  onMarkAsRead,
  onEdit,
  onOpenWeather,
  onOpenPrayerTimes
}) => {
  if (!notification) return null;

  const isBn = lang === 'bn';
  const isAdmin = user?.role === 'admin';

  const getTypeLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return isBn ? 'জরুরি সতর্কবার্তা' : 'Severe Alert';
      case 'weather':
        return isBn ? 'আবহাওয়া বুলেটিন' : 'Weather Bulletin';
      case 'offer':
        return isBn ? 'বিশেষ অফার' : 'Special Offer';
      case 'cashback':
        return isBn ? 'ক্যাশব্যাক বোনাস' : 'Cashback Reward';
      case 'trx':
        return isBn ? 'লেনদেন বার্তা' : 'Transaction Alert';
      case 'info':
      default:
        return isBn ? 'সিস্টেম ঘোষণা' : 'System Notice';
    }
  };

  const getTypeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
      case 'weather':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300';
      case 'offer':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';
      case 'cashback':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
      case 'trx':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center select-none animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
          
          {/* Top Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
  
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'নোটিফিকেশন বিস্তারিত' : 'Notification Details'}
            </h3>
  
            {/* Delete action for Admin */}
            {isAdmin && onDelete ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  setShowDeleteConfirm(true);
                }}
                className="w-9 h-9 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center active:scale-95 transition-all"
                title={isBn ? 'মুছে ফেলুন' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-9" />
            )}
          </div>
  
          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            
            {/* Category Pill & Time */}
            <div className="flex items-center justify-between gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeColor(notification.type)}`}>
                {getTypeLabel(notification.type)}
              </span>
  
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? notification.timeBn : notification.timeEn}</span>
              </span>
            </div>
  
            {/* Title */}
            <h2 className="text-xl font-black text-slate-950 dark:text-white leading-tight">
              {isBn ? notification.titleBn : notification.titleEn}
            </h2>
  
            {/* Amount Badge (if present) */}
            {notification.amount && (
              <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/30 border border-rose-200/60 dark:border-rose-900/40 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                    <Tag className="w-4 h-4 text-[#E52E2E]" />
                  </div>
                  <span>{isBn ? 'সংযুক্ত পরিমাণ / বোনাস:' : 'Attached Amount:'}</span>
                </div>
                <span className="text-lg font-black text-[#E52E2E] dark:text-rose-400 tabular-nums tracking-tighter">
                  {formatCurrency(notification.amount, lang)}
                </span>
              </div>
            )}
  
            {/* Message Body */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
              {notification.image && (
                <img
                  src={notification.image}
                  alt="Notification"
                  className="w-full h-auto rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-700"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {isBn ? notification.bodyBn : notification.bodyEn}
              </p>

              {/* Weather forecast CTA button if weather/alert */}
              {(notification.type === 'weather' || notification.type === 'alert') && onOpenWeather && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onClose();
                      onOpenWeather();
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>🌤️ {isBn ? 'সম্পূর্ণ ৭ দিনের আবহাওয়া ও অ্যানিমেশন দেখুন' : 'View Full 7-Day Weather & Animations'}</span>
                  </button>
                </div>
              )}

              {/* Prayer Times CTA button */}
              {(notification.titleBn.includes('🕌') || notification.titleBn.includes('সালাত') || notification.bodyBn.includes('নামাজ')) && onOpenPrayerTimes && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onClose();
                      onOpenPrayerTimes();
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>🕌 {isBn ? 'সম্পূর্ণ জেলার নামাজের সময়সূচি ও সূর্যোদয় দেখুন' : 'View Full Prayer & Sun Schedule'}</span>
                  </button>
                </div>
              )}
            </div>
  
            {/* Sender info */}
            <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 font-semibold">
              <span>{isBn ? 'প্রেরক: প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'From: Protyasha Cable Network'}</span>
              <span className="font-mono text-[10px] opacity-70">#{notification.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>
  
          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playTap();
                if (onMarkAsRead) {
                  onMarkAsRead(notification.id);
                }
                onClose();
              }}
              className="flex-1 h-12 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isBn ? 'পড়েছি / সম্পন্ন' : 'Mark as Read & Close'}</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onEdit) onEdit(notification);
                }}
                className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center"
              >
                ✎
              </button>
            )}
          </div>
        </div>
      </div>
  
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {isBn ? 'মুছে ফেলতে চান?' : 'Confirm Delete?'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {isBn ? 'এই নোটিফিকেশনটি স্থায়ীভাবে মুছে ফেলা হবে।' : 'This notification will be permanently deleted.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onDelete) onDelete(notification.id);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold"
              >
                {isBn ? 'ঠিক আছে' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
