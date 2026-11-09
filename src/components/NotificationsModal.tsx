import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Megaphone, 
  Handshake, 
  CheckCheck, 
  Plus, 
  Send, 
  X, 
  Bell, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sun,
  CloudRain,
  CloudLightning,
  ShieldAlert
} from 'lucide-react';
import { Language, NotificationItem, UserSession } from '../types';
import { formatCurrency, translations, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';
import promoWeekend from '../assets/images/protyasha_weekend_add_money_banner_1792226649420.jpg';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  lang: Language;
  user: UserSession | null;
  onClose: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
  onMarkAllAsRead: () => void;
  onSendNotification: (notif: Omit<NotificationItem, 'id' | 'isRead'>) => void;
  onEditNotification?: (notif: NotificationItem) => void;
  initialEditingNotif?: NotificationItem | null;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  notifications,
  lang,
  user,
  onClose,
  onSelectNotification,
  onMarkAllAsRead,
  onSendNotification,
  onEditNotification,
  initialEditingNotif
}) => {
  if (!isOpen) return null;
  const t = translations[lang];
  const isBn = lang === 'bn';
  const isAdmin = user?.role === 'admin';
  // Filter Tab State: 'all' | 'unread' | 'read'
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const readCount = notifications.filter(n => n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'unread') return !n.isRead;
    if (filterTab === 'read') return n.isRead;
    return true;
  });

  // Admin New Notification Composer State
  const [isComposing, setIsComposing] = useState(false);
  const [editingNotif, setEditingNotif] = useState<NotificationItem | null>(null);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifType, setNotifType] = useState<NotificationItem['type']>('offer');
  const [notifAmount, setNotifAmount] = useState<string>('');
  const [notifImage, setNotifImage] = useState<string>('');
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (initialEditingNotif) {
      setEditingNotif(initialEditingNotif);
      setNotifTitle(isBn ? initialEditingNotif.titleBn : initialEditingNotif.titleEn);
      setNotifBody(isBn ? initialEditingNotif.bodyBn : initialEditingNotif.bodyEn);
      setNotifType(initialEditingNotif.type);
      setNotifAmount(initialEditingNotif.amount?.toString() || '');
      setNotifImage(initialEditingNotif.image || '');
      setIsComposing(true);
    }
  }, [initialEditingNotif, isBn]);

  // Handle Edit Trigger
  const startEdit = (notif: NotificationItem) => {
    setEditingNotif(notif);
    setNotifTitle(isBn ? notif.titleBn : notif.titleEn);
    setNotifBody(isBn ? notif.bodyBn : notif.bodyEn);
    setNotifType(notif.type);
    setNotifAmount(notif.amount?.toString() || '');
    setNotifImage(notif.image || '');
    setIsComposing(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) {
      setFormError(isBn ? 'শিরোনাম পূরণ করুন' : 'Please enter title');
      return;
    }
    if (!notifBody.trim()) {
      setFormError(isBn ? 'বার্তা বিবরণ লিখুন' : 'Please enter message details');
      return;
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'short' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const monthsBnMap: Record<string, string> = {
      'Jan': 'জানুয়ারি', 'Feb': 'ফেব্রুয়ারি', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল', 'May': 'মে', 'Jun': 'জুন',
      'Jul': 'জুলৈ', 'Aug': 'আগস্ট', 'Sep': 'সেপ্টেম্বর', 'Oct': 'অক্টোবর', 'Nov': 'নভেম্বর', 'Dec': 'ডিসেম্বর'
    };
    const monthBn = monthsBnMap[month] || month;

    const timeFormattedBn = `${toBengaliNumber(day)} ${monthBn}, ${toBengaliNumber(timeStr)}`;
    const timeFormattedEn = `${month} ${day}, ${timeStr}`;

    if (editingNotif && onEditNotification) {
        onEditNotification({
            ...editingNotif,
            titleBn: notifTitle.trim(),
            titleEn: notifTitle.trim(),
            bodyBn: notifBody.trim(),
            bodyEn: notifBody.trim(),
            type: notifType,
            amount: notifAmount ? parseFloat(notifAmount) : undefined,
            image: notifImage.trim() || undefined
        });
    } else {
        onSendNotification({
          titleBn: notifTitle.trim(),
          titleEn: notifTitle.trim(),
          bodyBn: notifBody.trim(),
          bodyEn: notifBody.trim(),
          timeBn: timeFormattedBn,
          timeEn: timeFormattedEn,
          type: notifType,
          amount: notifAmount ? parseFloat(notifAmount) : undefined,
          image: notifImage.trim() || undefined
        });
    }

    sounds.playSuccess();
    setNotifTitle('');
    setNotifBody('');
    setNotifAmount('');
    setFormError('');
    setIsComposing(false);
    setEditingNotif(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.notifications}
            </h2>
            {isAdmin && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60">
                এডমিন প্যানেল
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                sounds.playTap();
                onMarkAllAsRead();
              }}
              className="text-xs font-bold text-[#E52E2E] hover:underline flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200/80 active:scale-95 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#E52E2E]" />
              <span>{isBn ? 'সব অপঠিত পঠিত করুন' : 'Mark all read'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs: [সব বার্তা] | [অপঠিত (Unread)] | [পঠিত (Read)] */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setFilterTab('all');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#E52E2E] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>{isBn ? 'সব বার্তা' : 'All Messages'}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            filterTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {toBengaliNumber(notifications.length)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setFilterTab('unread');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === 'unread'
              ? 'bg-[#E52E2E] text-white shadow-xs'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40'
          }`}
        >
          <span>{isBn ? 'অপঠিত (নতুন)' : 'Unread'}</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-black animate-pulse">
              {toBengaliNumber(unreadCount)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setFilterTab('read');
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterTab === 'read'
              ? 'bg-[#E52E2E] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span>{isBn ? 'পঠিত' : 'Read'}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            filterTab === 'read' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {toBengaliNumber(readCount)}
          </span>
        </button>
      </div>

      {/* Notifications Scroll List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        
        {/* Admin Compose Notification CTA Button */}
        {isAdmin && !isComposing && (
          <button
            onClick={() => {
              sounds.playTap();
              setIsComposing(true);
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-rose-600/20 active:scale-98 transition-all hover:brightness-105"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">{isBn ? 'নতুন নোটিফিকেশন পাঠান' : 'Broadcast New Notification'}</p>
                <p className="text-[11px] font-normal text-rose-100">{isBn ? 'সকল গ্রাহক ও ভিজিটরদের কাছে বার্তা পৌঁছান' : 'Send announcements or offer alerts'}</p>
              </div>
            </div>
            <Send className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Admin Compose Form */}
        {isAdmin && isComposing && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#E52E2E] shadow-xl animate-in zoom-in-95 duration-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#E52E2E]">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'এডমিন নোটিফিকেশন তৈরি করুন' : 'Compose Notification'}
                </h3>
              </div>
              <button
                onClick={() => setIsComposing(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-[#E52E2E] text-xs font-semibold flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-3">
              {/* Notification Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'নোটিফিকেশন ক্যাটাগরি' : 'Category'}
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: 'offer', label: isBn ? 'অফার' : 'Offer' },
                    { id: 'cashback', label: isBn ? 'ক্যাশব্যাক' : 'Cashback' },
                    { id: 'info', label: isBn ? 'নোটিশ' : 'Notice' },
                    { id: 'weather', label: isBn ? 'আবহাওয়া' : 'Weather' },
                    { id: 'alert', label: isBn ? 'সতর্কতা' : 'Alert' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNotifType(cat.id as NotificationItem['type'])}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${
                        notifType === cat.id
                          ? 'bg-[#E52E2E] text-white border-[#E52E2E] shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'শিরোনাম' : 'Title'}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'যেমন: বিশেষ ক্যাবল টিভি ছাড় ও রিওয়ার্ড' : 'e.g. Special Cable TV Discount'}
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
                />
              </div>

              {/* Body Text */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'বিস্তারিত বার্তা' : 'Message Details'}
                </label>
                <textarea
                  rows={3}
                  placeholder={isBn ? 'গ্রাহকদের জন্য সম্পূর্ণ বার্তা লিখুন...' : 'Write complete notification body...'}
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] resize-none"
                />
              </div>

              {/* Optional Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'টাকার পরিমাণ (ঐচ্ছিক, বোনাস বা ক্যাশব্যাক)' : 'Amount (Optional)'}
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৫০"
                  value={notifAmount}
                  onChange={(e) => setNotifAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'পেইজ বা ক্যাটাগরি সিলেক্ট করুন' : 'Select Page/Category'}
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as NotificationItem['type'])}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
                >
                  <option value="offer">{isBn ? 'অফার পেইজ' : 'Offer Page'}</option>
                  <option value="cashback">{isBn ? 'ক্যাশব্যাক পেইজ' : 'Cashback Page'}</option>
                  <option value="trx">{isBn ? 'লেনদেন পেইজ' : 'Transactions Page'}</option>
                  <option value="info">{isBn ? 'তথ্য/নোটিশ পেইজ' : 'Info/Notice Page'}</option>
                </select>
              </div>

              {/* Optional Link Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {isBn ? 'অফার লিংক (ঐচ্ছিক)' : 'Offer Link (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={notifImage}
                  onChange={(e) => setNotifImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নোটিফিকেশন পাঠান' : 'Broadcast Now'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notification Items */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-2 stroke-1 opacity-50" />
            <p className="text-xs font-semibold">
              {filterTab === 'unread' 
                ? (isBn ? 'কোনো অপঠিত বার্তা নেই' : 'No unread notifications') 
                : filterTab === 'read'
                  ? (isBn ? 'কোনো পঠিত বার্তা নেই' : 'No read notifications')
                  : (isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications yet')}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isCashback = item.type === 'cashback';
            const isUnread = !item.isRead;

            return (
              <div
                key={item.id}
                onClick={() => {
                  sounds.playTap();
                  onSelectNotification(item);
                }}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                  isUnread
                    ? 'bg-gradient-to-r from-rose-50/90 via-[#FFF8F6] to-amber-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900/90 border-l-4 border-l-[#E52E2E] border-rose-300/80 dark:border-rose-900/70 shadow-md shadow-rose-500/5 hover:shadow-lg'
                    : 'bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-2xs opacity-80 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                {/* Top Badge Line: Type + Unread/Read Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'alert' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0 shadow-xs">
                        {isBn ? '🚨 সতর্কতা' : '🚨 Alert'}
                      </span>
                    )}
                    {item.type === 'weather' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-600 text-white shrink-0 shadow-xs">
                        {isBn ? '🌤️ আবহাওয়া' : '🌤️ Weather'}
                      </span>
                    )}
                    {item.type === 'offer' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0 shadow-xs">
                        {isBn ? '🎁 বিশেষ অফার' : '🎁 Offer'}
                      </span>
                    )}
                    {item.type === 'cashback' && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0 shadow-xs">
                        {isBn ? '💰 ক্যাশব্যাক' : '💰 Cashback'}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isBn ? item.timeBn : item.timeEn}
                    </span>
                  </div>

                  {/* UNREAD vs READ Badge */}
                  {isUnread ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E52E2E] text-white text-[10px] font-extrabold shadow-xs animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{isBn ? 'নতুন বার্তা' : 'NEW'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold border border-slate-200/80 dark:border-slate-700/80">
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      <span>{isBn ? 'পঠিত' : 'Read'}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  {/* Category Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${
                    item.type === 'alert'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/50'
                      : item.type === 'weather'
                        ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-900/50'
                        : isCashback || item.type === 'offer'
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
                  }`}>
                    {item.type === 'alert' ? (
                      <CloudLightning className="w-5 h-5 stroke-[2]" />
                    ) : item.type === 'weather' ? (
                      <Sun className="w-5 h-5 stroke-[2]" />
                    ) : isCashback || item.type === 'offer' ? (
                      <Megaphone className="w-5 h-5 stroke-[1.8]" />
                    ) : (
                      <Handshake className="w-5 h-5 stroke-[1.8]" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={`text-sm tracking-tight truncate ${
                        isUnread 
                          ? 'font-black text-slate-950 dark:text-white' 
                          : 'font-bold text-slate-700 dark:text-slate-300'
                      }`}>
                        {isBn ? item.titleBn : item.titleEn}
                      </h4>
                      {item.amount && (
                        <span className="text-xs font-black text-[#E52E2E] dark:text-rose-400 shrink-0">
                          {formatCurrency(item.amount, lang)}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed line-clamp-2 whitespace-pre-line ${
                      isUnread
                        ? 'font-semibold text-slate-800 dark:text-slate-100'
                        : 'font-normal text-slate-500 dark:text-slate-400'
                    }`}>
                      {isBn ? item.bodyBn : item.bodyEn}
                    </p>

                    <div className="flex items-center justify-end mt-2">
                      <span className="text-[11px] font-bold text-[#E52E2E] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>{isBn ? 'বিস্তারিত বার্তা পড়ুন' : 'Read Full Message'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
