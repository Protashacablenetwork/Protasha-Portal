import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Trash2, 
  Clock, 
  Tag, 
  Moon,
  Sunset,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';
import { Language, NotificationItem, UserSession } from '../types';
import { formatCurrency } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { ALL_BANGLADESH_DISTRICTS, DEFAULT_HEADQUARTERS_DISTRICT } from '../utils/weatherService';
import { calculateLocalPrayerTimes, getActiveFastingCardData } from '../utils/prayerTimeService';

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
  onOpenRamadanSchedule?: () => void;
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
  onOpenPrayerTimes,
  onOpenRamadanSchedule
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const isFasting = Boolean(notification?.sehriIftarData || notification?.isFastingAlert);

  useEffect(() => {
    if (!notification || !isFasting) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [notification, isFasting]);

  const liveFastingSnapshot = useMemo(() => {
    if (!notification || !isFasting) return null;
    const targetEn = notification.sehriIftarData?.districtEn || notification.districtEn;
    const targetBn = notification.sehriIftarData?.districtBn || notification.districtBn;
    const matchedDistrict =
      ALL_BANGLADESH_DISTRICTS.find(
        d =>
          (targetEn && d.nameEn.toLowerCase() === targetEn.toLowerCase()) ||
          (targetBn && d.nameBn === targetBn)
      ) || DEFAULT_HEADQUARTERS_DISTRICT;
    const timings = calculateLocalPrayerTimes(matchedDistrict, now);
    const card = getActiveFastingCardData(timings, now);
    return { district: matchedDistrict, timings, card };
  }, [notification, isFasting, now]);

  if (!notification) return null;

  const isBn = lang === 'bn';
  const isAdmin = user?.role === 'admin';
  const sData = notification.sehriIftarData;

  const locationSourceLabel = (src?: string) => {
    if (src === 'gps') return isBn ? 'লাইভ GPS' : 'Live GPS';
    if (src === 'ip') return isBn ? 'অটো লোকেশন' : 'Auto Location';
    if (src === 'manual') return isBn ? 'নির্বাচিত জেলা' : 'Selected District';
    return isBn ? 'লোকেশন ভিত্তিক' : 'Location Based';
  };

  const getTypeLabel = (type: NotificationItem['type']) => {
    if (isFasting) {
      return isBn ? 'সেহরি ও ইফতার সময়সূচী' : 'Sehri & Iftar Schedule';
    }
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
    if (isFasting) {
      return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
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

  const showWeatherCta =
    (notification.type === 'weather' || (notification.type === 'alert' && !isFasting && !notification.isPrayerAlert)) &&
    Boolean(onOpenWeather);

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center select-none animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
          
          {/* Top Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
  
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isFasting
                ? (isBn ? 'সেহরি ও ইফতার সময়সূচী' : 'Sehri & Iftar Schedule')
                : (isBn ? 'নোটিফিকেশন বিস্তারিত' : 'Notification Details')}
            </h3>
  
            {/* Delete action for Admin */}
            {isAdmin && onDelete ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  setShowDeleteConfirm(true);
                }}
                className="w-11 h-11 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                title={isBn ? 'মুছে ফেলুন' : 'Delete'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-11" />
            )}
          </div>
  
          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            
            {/* Category & Time */}
            <div className="flex items-center justify-between gap-2">
              {isFasting ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Moon className="w-3.5 h-3.5 shrink-0" />
                  <span>{getTypeLabel(notification.type)}</span>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeColor(notification.type)}`}>
                  {getTypeLabel(notification.type)}
                </span>
              )}
  
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? notification.timeBn : notification.timeEn}</span>
              </span>
            </div>
  
            {/* Title */}
            <h2 className="text-xl font-black text-slate-950 dark:text-white leading-tight">
              {isBn ? notification.titleBn : notification.titleEn}
            </h2>

            {/* Dedicated Live Real-Time Location Sehri & Iftar Card */}
            {isFasting && liveFastingSnapshot && (
              <section className="rounded-3xl bg-gradient-to-br from-[#003d32] via-[#002f26] to-[#001a15] border border-emerald-500/35 text-white shadow-xl overflow-hidden">
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Location & Hijri Date Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-black text-amber-300">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {sData?.districtBn || liveFastingSnapshot.district.nameBn}
                        {(sData?.divisionBn || liveFastingSnapshot.district.divisionBn)
                          ? ` (${sData?.divisionBn || liveFastingSnapshot.district.divisionBn} বিভাগ)`
                          : ''}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-200/85">
                      {locationSourceLabel(sData?.locationSource)}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-emerald-200/80 flex flex-wrap items-center gap-1.5">
                    <span>{sData?.hijriDateBn || liveFastingSnapshot.card.hijriFormattedBn}</span>
                    <span aria-hidden="true">·</span>
                    <span>{sData?.dateStrBn || liveFastingSnapshot.timings.dateStr}</span>
                  </div>

                  {/* Live Ticking Countdown */}
                  <div className="rounded-2xl bg-[#001f19]/90 border border-emerald-600/30 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-emerald-300">{liveFastingSnapshot.card.phaseTitleBn}</p>
                        <p className="text-[11px] font-bold text-emerald-100/75 mt-0.5 truncate">
                          {liveFastingSnapshot.card.countdownLabelBn}
                        </p>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tabular-nums tracking-tight shrink-0">
                        {liveFastingSnapshot.card.countdownTimeBn}
                      </div>
                    </div>
                    <div className="h-2 bg-[#00130f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(4, liveFastingSnapshot.card.progressPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Dual Spotlight: Sehri End & Iftar */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#0b382f]/90 border border-emerald-500/30 p-3.5 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-200/85">
                        <Moon className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isBn ? 'সেহরির শেষ সময়' : 'Sehri End'}</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                        {sData?.sehriEndBn || liveFastingSnapshot.card.sehriEndBn}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#0b382f]/90 border border-amber-400/30 p-3.5 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-200/85">
                        <Sunset className="w-3.5 h-3.5 text-amber-300" />
                        <span>{isBn ? 'আজকের ইফতার' : 'Today Iftar'}</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                        {sData?.iftarBn || liveFastingSnapshot.card.iftarBn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom 3-Column Strip: Fajr, Sunrise, Duration */}
                <div className="grid grid-cols-3 divide-x divide-emerald-800/45 border-t border-emerald-800/45 bg-[#001e18] text-center">
                  <div className="py-3 px-2">
                    <p className="text-[10px] font-bold text-emerald-200/70">{isBn ? 'ফজর শুরু' : 'Fajr'}</p>
                    <p className="text-xs sm:text-sm font-black text-white tabular-nums mt-0.5">
                      {sData?.fajrBn || liveFastingSnapshot.card.fajrBn}
                    </p>
                  </div>
                  <div className="py-3 px-2">
                    <p className="text-[10px] font-bold text-emerald-200/70">{isBn ? 'সূর্যোদয়' : 'Sunrise'}</p>
                    <p className="text-xs sm:text-sm font-black text-white tabular-nums mt-0.5">
                      {sData?.sunriseBn || liveFastingSnapshot.timings.sunrise}
                    </p>
                  </div>
                  <div className="py-3 px-2">
                    <p className="text-[10px] font-bold text-emerald-200/70">{isBn ? 'রোজার ব্যাপ্তি' : 'Duration'}</p>
                    <p className="text-[11px] sm:text-xs font-black text-emerald-300 tabular-nums mt-1">
                      {sData?.fastDurationBn || liveFastingSnapshot.card.fastDurationBn}
                    </p>
                  </div>
                </div>
              </section>
            )}
  
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
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4">
              {notification.image && (
                <img
                  src={notification.image}
                  alt="Notification"
                  className="w-full h-auto rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-700"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <p className="text-[14.5px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {isBn
                  ? (notification.bodyBn || notification.messageBn || '').replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, '$1')
                  : (notification.bodyEn || notification.messageEn || '')}
              </p>

              {/* Fasting / Sehri-Iftar Direct CTAs */}
              {isFasting && (onOpenRamadanSchedule || onOpenPrayerTimes) && (
                <div className="pt-2 space-y-2.5">
                  {onOpenRamadanSchedule && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                        onOpenRamadanSchedule();
                      }}
                      className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{isBn ? 'সম্পূর্ণ সেহরি ও ইফতার ক্যালেন্ডার দেখুন' : 'View Full Sehri & Iftar Calendar'}</span>
                    </button>
                  )}
                  {onOpenPrayerTimes && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                        onOpenPrayerTimes();
                      }}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>{isBn ? 'নামাজের সময়সূচী ও জেলা পরিবর্তন করুন' : 'Prayer Times & Change District'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Weather forecast CTA button if weather/non-prayer alert */}
              {showWeatherCta && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onClose();
                      onOpenWeather!();
                    }}
                    className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>🌤️ {isBn ? 'সম্পূর্ণ ৭ দিনের আবহাওয়া ও অ্যানিমেশন দেখুন' : 'View Full 7-Day Weather & Animations'}</span>
                  </button>
                </div>
              )}

              {/* Prayer Times CTA button (for non-fasting prayer notifications) */}
              {!isFasting && (notification.isPrayerAlert || notification.titleBn.includes('🕌') || notification.titleBn.includes('সালাত') || notification.bodyBn.includes('নামাজ')) && onOpenPrayerTimes && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      onClose();
                      onOpenPrayerTimes();
                    }}
                    className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
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
              className="flex-1 h-12 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isBn ? 'পড়েছি / সম্পন্ন' : 'Mark as Read & Close'}</span>
            </button>
            {isAdmin && !isFasting && (
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onEdit) onEdit(notification);
                }}
                className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer"
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
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (onDelete) onDelete(notification.id);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold cursor-pointer"
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

