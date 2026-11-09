import React, { useState, useEffect } from 'react';
import { Language, ServiceStatusConfig } from '../types';
import { X, Check, ShieldAlert, Sparkles, Power, Edit3, Trash2, Upload } from 'lucide-react';
import { sounds } from '../utils/audio';
import { compressImageFile, savePersistentImage, deletePersistentImage } from '../utils/imageStorage';

interface ServiceManagerModalProps {
  isOpen: boolean;
  serviceStatuses: Record<string, ServiceStatusConfig>;
  lang: Language;
  onClose: () => void;
  onSaveServiceStatuses: (updated: Record<string, ServiceStatusConfig>) => void;
}

const AVAILABLE_SERVICES = [
  { id: 'billManager', nameBn: 'বিল ম্যানেজমেন্ট প্রো', nameEn: 'Bill Management Pro', icon: '📄', defaultLogo: 'https://bill-manager.ai.studio/logo.jpg' },
  { id: 'ayByay', nameBn: 'আয়-ব্যয় হিসাব খাতা', nameEn: 'Income & Expense Manager', icon: '💰', defaultLogo: 'https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png' },
  { id: 'quickHisab', nameBn: 'কুইক হিসাব ও লভ্যাংশ বণ্টন', nameEn: 'Quick Hisab & Profit Share', icon: '🧮', defaultLogo: '' },
  { id: 'staffManager', nameBn: 'স্টাফ কালেকশন ও কোম্পানি পাওনা', nameEn: 'Staff Collection & Dues', icon: '👥' },
  { id: 'transactions', nameBn: 'সকল লেনদেন ও স্টেটমেন্ট', nameEn: 'Transactions Statement', icon: '📊' },
  { id: 'ledger', nameBn: 'অডিট ও রিপোর্ট খাতা', nameEn: 'Ledger & Reports', icon: '📁' },
];

export const ServiceManagerModal: React.FC<ServiceManagerModalProps> = ({
  isOpen,
  serviceStatuses,
  lang,
  onClose,
  onSaveServiceStatuses
}) => {
  if (!isOpen) return null;
  const isBn = lang === 'bn';

  const [statuses, setStatuses] = useState<Record<string, ServiceStatusConfig>>(() => {
    const initial: Record<string, ServiceStatusConfig> = { ...serviceStatuses };
    AVAILABLE_SERVICES.forEach(svc => {
      if (!initial[svc.id]) {
        initial[svc.id] = { isActive: true, logoUrl: svc.defaultLogo };
      } else if (!initial[svc.id].logoUrl && svc.defaultLogo) {
        initial[svc.id].logoUrl = svc.defaultLogo;
      }
    });
    return initial;
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync statuses state with incoming prop while preserving logos
  useEffect(() => {
    setStatuses(prev => {
      const merged: Record<string, ServiceStatusConfig> = { ...serviceStatuses };
      AVAILABLE_SERVICES.forEach(svc => {
        if (!merged[svc.id]) {
          merged[svc.id] = { isActive: true, logoUrl: prev[svc.id]?.logoUrl || svc.defaultLogo };
        } else if (!merged[svc.id].logoUrl) {
          merged[svc.id] = { ...merged[svc.id], logoUrl: prev[svc.id]?.logoUrl || svc.defaultLogo };
        }
      });
      return merged;
    });
  }, [serviceStatuses]);

  const SUGGESTED_TITLES = [
    { bn: 'সার্ভার আপগ্রেড চলছে', en: 'Server Upgrade in Progress' },
    { bn: 'রক্ষণাবেক্ষণ কাজ চলছে', en: 'Maintenance Work Underway' },
    { bn: 'সেবা সাময়িকভাবে বন্ধ', en: 'Service Temporarily Offline' }
  ];

  const SUGGESTED_MESSAGES = [
    { bn: 'আমাদের এই সেবাটিকে আরও উন্নত ও গতিশীল করার লক্ষ্যে রক্ষণাবেক্ষণ কাজ চলছে। খুব শীঘ্রই আমরা নতুন ফিচার নিয়ে ফিরে আসছি।', en: 'System maintenance and upgrades are underway to deliver a better experience.' },
    { bn: 'সিস্টেমের নিরাপত্তার স্বার্থে বর্তমানে এই সেবাটি বন্ধ রাখা হয়েছে। শীঘ্রই চালু করা হবে।', en: 'This service is temporarily disabled for security maintenance. We will be back soon.' },
    { bn: 'সার্ভারে যান্ত্রিক ত্রুটির কারণে সেবাটি সাময়িকভাবে ব্যাহত হচ্ছে। দুঃখিত।', en: 'Service is temporarily interrupted due to a server error. We apologize for the inconvenience.' }
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleActive = (serviceId: string) => {
    sounds.playTap();
    const current = statuses[serviceId] || { isActive: true, customMessage: '', title: '', logoUrl: '' };
    const updated = {
      ...statuses,
      [serviceId]: { ...current, isActive: !current.isActive }
    };
    setStatuses(updated);
    onSaveServiceStatuses(updated);
    showToast(isBn ? 'সেবার স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'Service status updated');
  };

  const handleOpenEdit = (serviceId: string) => {
    sounds.playTap();
    const current = statuses[serviceId] || { isActive: true, customMessage: '', title: '', logoUrl: '' };
    const svc = AVAILABLE_SERVICES.find(s => s.id === serviceId);
    setEditingServiceId(serviceId);
    setCustomTitle(current.title || (isBn ? svc?.nameBn : svc?.nameEn) || '');
    setCustomMsg(current.customMessage || '');
    setCustomLogoUrl(current.logoUrl || '');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingLogo(true);
    try {
      // Compress to max 280px webp/jpeg (15-25KB) so it permanently fits Firestore & localStorage
      const compressedDataUrl = await compressImageFile(file, 280, 0.85);
      if (compressedDataUrl) {
        setCustomLogoUrl(compressedDataUrl);
        if (editingServiceId) {
          await savePersistentImage(`service_logo_${editingServiceId}`, compressedDataUrl);
        }
        showToast(isBn ? 'লগো প্রস্তুত ও যুক্ত করা হয়েছে' : 'Logo compressed and attached');
      }
    } catch (err) {
      console.warn('Error compressing logo:', err);
    } finally {
      setIsCompressingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    sounds.playTap();
    setCustomLogoUrl('');
    if (editingServiceId) {
      deletePersistentImage(`service_logo_${editingServiceId}`);
    }
    showToast(isBn ? 'লগো সরানো হয়েছে' : 'Logo removed');
  };

  const handleSaveCustomNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;
    sounds.playSuccess();

    const current = statuses[editingServiceId] || { isActive: true };
    const updated = {
      ...statuses,
      [editingServiceId]: {
        ...current,
        title: customTitle.trim(),
        customMessage: customMsg.trim(),
        logoUrl: customLogoUrl
      }
    };
    setStatuses(updated);
    onSaveServiceStatuses(updated);
    
    // Save to permanent IndexedDB
    if (customLogoUrl) {
      savePersistentImage(`service_logo_${editingServiceId}`, customLogoUrl);
    } else {
      deletePersistentImage(`service_logo_${editingServiceId}`);
    }

    setEditingServiceId(null);
    showToast(isBn ? 'সেবার নোটিশ ও লগো সফলভাবে সংরক্ষিত হয়েছে' : 'Service notice & logo saved successfully');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto overflow-x-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {isBn ? 'অ্যাপ সেবা ও নোটিশ কন্ট্রোল' : 'App Services & Notice Control'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {isBn ? 'সেবা চালু/বন্ধ রাখুন এবং কাস্টম নোটিশ বার্তা সেট করুন' : 'Enable/disable services and configure notices'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Editing Custom Notice Sub-modal */}
        {editingServiceId ? (
          <form onSubmit={handleSaveCustomNotice} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                {isBn ? 'কাস্টম নোটিশ ও শিরোনাম সম্পাদনা' : 'Edit Custom Notice & Title'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingServiceId(null)}
                className="text-xs text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
              >
                বাতিল
              </button>
            </div>

             <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                সেবা / ক্যাটাগরি শিরোনাম
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_TITLES.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomTitle(isBn ? t.bn : t.en)}
                    className="px-2.5 py-1 text-[10px] bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
                  >
                    {isBn ? t.bn : t.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                কাস্টম নোটিশ বার্তা (পপ আপে প্রদর্শিত হবে)
              </label>
              <textarea
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="যেমন: এই সেবাটি বর্তমানে আপডেট করা হচ্ছে..."
                className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_MESSAGES.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomMsg(isBn ? m.bn : m.en)}
                    className="px-2.5 py-1 text-[10px] bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
                  >
                    {isBn ? m.bn.substring(0, 15) + '...' : m.en.substring(0, 15) + '...'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                নোটিশ লগো বা ইমেজ আপলোড (স্বয়ংক্রিয় কম্প্রেসড ও স্থায়ী)
              </label>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 h-10 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span className="truncate">{isCompressingLogo ? 'কম্প্রেস হচ্ছে...' : (customLogoUrl ? 'নতুন লগো বাছাই করুন' : 'লগো বা ছবি নির্বাচন করুন')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isCompressingLogo}
                      className="hidden"
                    />
                  </label>

                  {customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="h-10 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="লগো বাদ দিন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>বাদ দিন</span>
                    </button>
                  )}
                </div>

                {/* Logo Preview Card */}
                {customLogoUrl ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <img 
                      src={customLogoUrl} 
                      alt="Service Logo" 
                      className="w-12 h-12 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">সংরক্ষিত কাস্টম লগো</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ পার্মানেন্ট ক্লাউড ও ডিভাইসে সংরক্ষিত থাকবে</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">কোনো লগো যুক্ত না থাকলে নোটিশ পেইজে ডিফল্ট গিয়ার অ্যানিমেশন দেখানো হবে।</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>নোটিশ সংরক্ষণ করুন</span>
            </button>
          </form>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {AVAILABLE_SERVICES.map(svc => {
              const status = statuses[svc.id] || { isActive: true, customMessage: '', title: '' };
              const isActive = status.isActive !== false;

              return (
                <div
                  key={svc.id}
                  className={`p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
                    isActive 
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700' 
                      : 'bg-slate-200/90 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 mt-0.5 sm:mt-0">
                      {status.logoUrl ? (
                        <img src={status.logoUrl} alt={svc.nameBn} className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-md" />
                      ) : (
                        <span className="text-xl">{svc.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {isBn ? svc.nameBn : svc.nameEn}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          isActive 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}>
                          {isActive ? (isBn ? 'সক্রিয় (চালু)' : 'Active') : (isBn ? 'নিষ্ক্রিয় (বন্ধ)' : 'Inactive')}
                        </span>
                      </div>
                      {status.customMessage && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 break-words leading-relaxed">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">নোটিশ: </span>
                          {status.customMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
                    <button
                      onClick={() => handleOpenEdit(svc.id)}
                      className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 cursor-pointer"
                      title="নোটিশ কাস্টমাইজ করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{isBn ? 'নোটিশ' : 'Notice'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(svc.id)}
                      className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isActive ? (isBn ? 'চালু আছে' : 'Active') : (isBn ? 'বন্ধ আছে' : 'Inactive')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {toast && (
          <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs font-bold text-center">
            {toast}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 active:scale-95"
          >
            সম্পন্ন করুন
          </button>
        </div>

      </div>
    </div>
  );
};
