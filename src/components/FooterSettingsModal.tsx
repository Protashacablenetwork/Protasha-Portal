import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Tag, 
  Image as ImageIcon, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Upload, 
  Loader2,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  Compass
} from 'lucide-react';
import { FooterConfig, Language, BannerAd } from '../types';
import { sounds } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';
import promoFestival from '../assets/images/protyasha_promo_festival_banner_1792226649161.jpg';
import promoWeekend from '../assets/images/protyasha_weekend_add_money_banner_1792226649420.jpg';

interface FooterSettingsModalProps {
  isOpen: boolean;
  config: FooterConfig;
  banners?: BannerAd[];
  lang: Language;
  onClose: () => void;
  onSave: (config: FooterConfig) => void;
  onSaveBanners?: (banners: BannerAd[]) => void;
}

// Preset Pages, Categories & Action Targets
const PAGE_AND_CATEGORY_PRESETS = [
  {
    groupBn: 'মূল পেজসমূহ (Pages)',
    groupEn: 'Main Site Pages',
    items: [
      { id: '#home', labelBn: '🏠 হোম পেজ (ড্যাশবোর্ড)', labelEn: '🏠 Home Dashboard', shortBn: 'হোম' },
      { id: '#transactions', labelBn: '📊 লেনদেন ও স্টেটমেন্ট তালিকা', labelEn: '📊 All Transactions', shortBn: 'লেনদেন' },
      { id: '#ledger', labelBn: '🧾 হিসাব খাতা ও রিপোর্ট', labelEn: '🧾 Accounts Ledger', shortBn: 'হিসাব খাতা' },
      { id: '#profile', labelBn: '👤 মেনু ও প্রোফাইল', labelEn: '👤 Menu & Profile', shortBn: 'প্রোফাইল' },
      { id: '#weather', labelBn: '🌦️ ৭ দিনের লাইভ আবহাওয়া', labelEn: '🌦️ 7-Day Weather', shortBn: 'আবহাওয়া' },
      { id: '#notifications', labelBn: '🔔 নোটিফিকেশন সেন্টার', labelEn: '🔔 Notifications', shortBn: 'নোটিফিকেশন' },
      { id: '#portal:bill-manager', labelBn: '⚡ বিল ম্যানেজমেন্ট প্রো', labelEn: '⚡ Bill Manager Pro', shortBn: 'বিল প্রো' },
      { id: '#portal:ay-byay', labelBn: '💰 আয়-ব্যয় স্মার্ট খাতা', labelEn: '💰 Income-Expense', shortBn: 'আয়-ব্যয়' }
    ]
  },
  {
    groupBn: 'লেনদেন ক্যাটাগরি (Categories)',
    groupEn: 'Transaction Categories',
    items: [
      { id: '#category:all', labelBn: '🌐 সকল ক্যাটাগরি ফিল্টার', labelEn: '🌐 All Categories', shortBn: 'সব ক্যাটাগরি' },
      { id: '#category:bKash', labelBn: '📱 বিকাশ লেনদেন (bKash)', labelEn: '📱 bKash Trx', shortBn: 'বিকাশ' },
      { id: '#category:Nagad', labelBn: '💵 নগদ লেনদেন (Nagad)', labelEn: '💵 Nagad Trx', shortBn: 'নগদ' },
      { id: '#category:Rocket', labelBn: '🚀 রকেট লেনদেন (Rocket)', labelEn: '🚀 Rocket Trx', shortBn: 'রকেট' },
      { id: '#category:Bank', labelBn: '🏦 ব্যাংক একাউন্ট (Bank)', labelEn: '🏦 Bank Trx', shortBn: 'ব্যাংক' },
      { id: '#category:Cash', labelBn: '💰 ক্যাশ ইন ও ক্যাশ আউট', labelEn: '💰 Cash In / Out', shortBn: 'ক্যাশ' },
      { id: '#category:bill', labelBn: '📡 ইন্টারনেট বিল কালেকশন', labelEn: '📡 Internet Bill', shortBn: 'ইন্টারনেট বিল' },
      { id: '#category:expense', labelBn: '🧾 অফিস খরচ ও ব্যয়', labelEn: '🧾 Office Expense', shortBn: 'খরচ' }
    ]
  },
  {
    groupBn: 'ফুটার পপআপ ও অ্যাকশন (Popups & Actions)',
    groupEn: 'Popups & Direct Actions',
    items: [
      { id: '#offer', labelBn: '🏷️ অফার উইন্ডো (Special Offers)', labelEn: '🏷️ Offers Window', shortBn: 'অফার' },
      { id: '#store', labelBn: '📍 প্রধান শাখা ও স্টোর তথ্য', labelEn: '📍 Head Office & Store', shortBn: 'স্টোর' },
      { id: '#help', labelBn: '❓ কাস্টমার সাপোর্ট ও হেল্পলাইন', labelEn: '❓ Customer Helpline', shortBn: 'সাহায্য' },
      { id: 'tel:01777877207', labelBn: '📞 সরাসরি ফোন কল (01777877207)', labelEn: '📞 Call 01777877207', shortBn: 'কল করুন' }
    ]
  }
];

export const FooterSettingsModal: React.FC<FooterSettingsModalProps> = ({
  isOpen,
  config,
  banners = [],
  lang,
  onClose,
  onSave,
  onSaveBanners
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';

  // Basic footer items
  const [storeBn, setStoreBn] = useState(config.store.bn);
  const [storeEn, setStoreEn] = useState(config.store.en);
  const [storeUrl, setStoreUrl] = useState(config.store.url || '#store');

  const [offerBn, setOfferBn] = useState(config.offer.bn);
  const [offerEn, setOfferEn] = useState(config.offer.en);
  const [offerUrl, setOfferUrl] = useState(config.offer.url || '#offer');

  const [helpBn, setHelpBn] = useState(config.help.bn);
  const [helpEn, setHelpEn] = useState(config.help.en);
  const [helpUrl, setHelpUrl] = useState(config.help.url || '#help');

  // Offers List Management (Banners/Offers)
  const [offerList, setOfferList] = useState<BannerAd[]>(banners);

  // New Offer Form State
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSubtitleBn, setNewSubtitleBn] = useState('');
  const [newSubtitleEn, setNewSubtitleEn] = useState('');
  const [newBadgeBn, setNewBadgeBn] = useState('৫০% ছাড়');
  const [newBadgeEn, setNewBadgeEn] = useState('50% OFF');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('#offer');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [offerFormError, setOfferFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset broadband internet images for convenience
  const quickPresets = [
    { label: 'ফাইবার অপটিক কেবল', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
    { label: 'গিগাবিট রাউটার অফার', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: 'আল্ট্রা হাই-স্পিড নেটওয়ার্ক', url: 'https://images.unsplash.com/photo-1520869562399-e772f142f422?auto=format&fit=crop&w=800&q=80' },
    { label: 'অনলাইন বিল পরিশোধ', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80' }
  ];

  // Helper to find label for a link
  const getLinkName = (url: string) => {
    for (const group of PAGE_AND_CATEGORY_PRESETS) {
      const found = group.items.find(i => i.id === url);
      if (found) return isBn ? found.labelBn : found.labelEn;
    }
    return '';
  };

  // Helper component to render Page & Category Link Selector
  const renderLinkSelector = (
    value: string, 
    onChange: (newVal: string) => void,
    fieldLabel: string
  ) => {
    const isPreset = PAGE_AND_CATEGORY_PRESETS.some(g => g.items.some(i => i.id === value));
    const matchedName = getLinkName(value);

    return (
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#E52E2E]" />
            <span>{fieldLabel}</span>
          </label>
          {matchedName && (
            <span className="text-[10px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md truncate max-w-[150px]">
              {matchedName}
            </span>
          )}
        </div>

        {/* 1. Direct Page & Category Dropdown Selector */}
        <div className="relative">
          <select
            value={isPreset ? value : 'custom'}
            onChange={(e) => {
              sounds.playTap();
              if (e.target.value !== 'custom') {
                onChange(e.target.value);
              }
            }}
            className="w-full h-10 pl-3 pr-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#E52E2E] cursor-pointer shadow-2xs"
          >
            <option value="" disabled>
              {isBn ? '-- সাইটের পেজ বা ক্যাটাগরি বেছে নিন --' : '-- Choose Page or Category --'}
            </option>
            {PAGE_AND_CATEGORY_PRESETS.map((group, idx) => (
              <optgroup key={idx} label={isBn ? group.groupBn : group.groupEn}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {isBn ? item.labelBn : item.labelEn}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="custom">
              {isBn ? '✏️ কাস্টম লিংক টাইপ করুন (Custom Link)' : '✏️ Type Custom URL'}
            </option>
          </select>
        </div>

        {/* 2. Fast Quick-Chips for instant mobile touch */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          <span className="text-[10px] text-slate-400 shrink-0 font-medium mr-0.5">
            {isBn ? 'কুইক সিলেক্ট:' : 'Quick:'}
          </span>
          {[
            { id: '#home', label: 'হোম' },
            { id: '#weather', label: 'আবহাওয়া' },
            { id: '#transactions', label: 'লেনদেন' },
            { id: '#ledger', label: 'হিসাব খাতা' },
            { id: '#profile', label: 'প্রোফাইল' },
            { id: '#category:bKash', label: 'বিকাশ' },
            { id: '#category:Nagad', label: 'নগদ' },
            { id: '#category:bill', label: 'বিল' },
            { id: '#offer', label: 'অফার' },
            { id: '#help', label: 'সাহায্য' }
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                onChange(chip.id);
              }}
              className={`px-2 py-0.8 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                value === chip.id
                  ? 'bg-[#E52E2E] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 3. Text Input for Exact URL / Value (As Circled in Screenshot 2) */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isBn ? 'যেমন: #offer, #weather, #category:bKash' : 'e.g. #offer, #weather'}
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>
    );
  };

  // Handle Offer Image Upload with Compression
  const handleOfferImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      sounds.playTap();
      const compressedDataUrl = await compressImage(file, 800, 400, 0.82);
      setNewImageUrl(compressedDataUrl);
      sounds.playSuccess();

      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedDataUrl, filename: file.name })
      }).catch(() => {});
    } catch (err) {
      console.error('Image upload failed:', err);
      setOfferFormError(isBn ? 'ছবি প্রসেস করা সম্ভব হয়নি' : 'Failed to process image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add New Offer to List
  const handleCreateOffer = () => {
    if (!newTitleBn.trim() && !newTitleEn.trim()) {
      setOfferFormError(isBn ? 'অফারের নাম বা শিরোনাম আবশ্যক' : 'Offer title is required');
      sounds.playTap();
      return;
    }

    sounds.playSuccess();
    const createdOffer: BannerAd = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      titleBn: newTitleBn.trim() || newTitleEn.trim(),
      titleEn: newTitleEn.trim() || newTitleBn.trim(),
      subtitleBn: newSubtitleBn.trim() || 'প্রত্যাশা ক্যাবল নেটওয়ার্কের সুপারফাস্ট ব্রডব্যান্ড অফার',
      subtitleEn: newSubtitleEn.trim() || 'Superfast broadband internet offer by Protyasha Cable Network',
      badgeBn: newBadgeBn.trim() || 'অফার',
      badgeEn: newBadgeEn.trim() || 'Offer',
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      linkUrl: newLinkUrl.trim() || '#offer',
      isActive: true,
      priority: offerList.length + 1
    };

    const updated = [createdOffer, ...offerList];
    setOfferList(updated);
    if (onSaveBanners) {
      onSaveBanners(updated);
    }

    // Reset form
    setNewTitleBn('');
    setNewTitleEn('');
    setNewSubtitleBn('');
    setNewSubtitleEn('');
    setNewBadgeBn('৫০% ছাড়');
    setNewBadgeEn('50% OFF');
    setNewImageUrl('');
    setNewLinkUrl('#offer');
    setIsAddingOffer(false);
    setOfferFormError('');
  };

  // Toggle Offer Active Status
  const handleToggleOfferActive = (id: string) => {
    sounds.playTap();
    const updated = offerList.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    setOfferList(updated);
    if (onSaveBanners) {
      onSaveBanners(updated);
    }
  };

  // Delete Offer
  const handleDeleteOffer = (id: string) => {
    sounds.playTap();
    if (confirm(isBn ? 'অফারটি মুছে ফেলতে চান?' : 'Delete this offer?')) {
      const updated = offerList.filter(b => b.id !== id);
      setOfferList(updated);
      if (onSaveBanners) {
        onSaveBanners(updated);
      }
    }
  };

  // Global Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();

    const updatedConfig: FooterConfig = {
      store: { ...config.store, bn: storeBn, en: storeEn, url: storeUrl },
      offer: { ...config.offer, bn: offerBn, en: offerEn, url: offerUrl },
      help: { ...config.help, bn: helpBn, en: helpEn, url: helpUrl }
    };

    onSave(updatedConfig);
    if (onSaveBanners) {
      onSaveBanners(offerList);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'লগইন ফুটার ও অফার কাস্টমাইজ' : 'Customize Login Footer & Offers'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
          {isBn 
            ? '💡 আপনি প্রতিটি বাটনে সাইটের যেকোনো পেজ (হোম, লেনদেন, আবহাওয়া, প্রোফাইল) অথবা ক্যাটাগরি (বিকাশ, নগদ, ক্যাশ, বিল) সরাসরি সিলেক্ট করে লিংক করতে পারবেন।'
            : 'Configure each button to directly target any page (Home, Weather, Trx, Profile) or category (bKash, Nagad, Bill).'}
        </div>

        {/* 1. Store */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>📍</span>
            <span>1. স্টোর / Store</span>
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              value={storeBn}
              onChange={(e) => setStoreBn(e.target.value)}
              placeholder="বাংলা নাম (যেমন: স্টোর)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={storeEn}
              onChange={(e) => setStoreEn(e.target.value)}
              placeholder="English Name (e.g. Store)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            {renderLinkSelector(storeUrl, setStoreUrl, isBn ? 'স্টোর অ্যাকশন লিংক / পেজ / ক্যাটাগরি' : 'Store Action Link / Target')}
          </div>
        </div>

        {/* 2. Offer with Comprehensive Admin Offer Manager (Circled in Screenshot 2) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-950/80 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-base">🏷️</span>
              <span className="text-rose-600 dark:text-rose-400 font-extrabold">2. অফার / Offer (এডমিন অফার কন্ট্রোল)</span>
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              {offerList.length} {isBn ? 'টি অফার' : 'Offers'}
            </span>
          </div>

          {/* Button Labels & Target with Page / Category Dropdown */}
          <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
              {isBn ? 'ফুটার বাটন সেটিংস (নাম ও পেজ / ক্যাটাগরি লিংক):' : 'Footer Button Settings:'}
            </span>
            <input
              type="text"
              value={offerBn}
              onChange={(e) => setOfferBn(e.target.value)}
              placeholder="বাংলা নাম (যেমন: অফার)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={offerEn}
              onChange={(e) => setOfferEn(e.target.value)}
              placeholder="English Name (e.g. Offer)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            
            {/* Page & Category Selector for #offer (Circled in red in Screenshot 2) */}
            {renderLinkSelector(offerUrl, setOfferUrl, isBn ? 'অফার অ্যাকশন লিংক ও সাইট পেজ / ক্যাটাগরি' : 'Offer Action Link / Target')}
          </div>

          {/* Dedicated Offer Creator Section */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'চলমান অফারসমূহ ও নতুন অফার যোগ:' : 'Active Offers & Add New:'}</span>
              </span>
              {!isAddingOffer && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsAddingOffer(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? '+ নতুন অফার যোগ করুন' : '+ Add New Offer'}</span>
                </button>
              )}
            </div>

            {/* Inline Add Offer Form */}
            {isAddingOffer && (
              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3 mb-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-rose-200/60 dark:border-rose-900/60">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#E52E2E]" />
                    <span>{isBn ? 'নতুন অফারের বিবরণ লিখুন' : 'New Offer Details'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setIsAddingOffer(false);
                      setOfferFormError('');
                    }}
                    className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {offerFormError && (
                  <div className="text-[11px] text-rose-700 dark:text-rose-300 font-bold bg-white dark:bg-slate-900 p-2 rounded-lg border border-rose-300">
                    {offerFormError}
                  </div>
                )}

                {/* Offer Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'অফারের নাম / শিরোনাম *' : 'Offer Title *'}
                  </label>
                  <input
                    type="text"
                    value={newTitleBn}
                    onChange={(e) => setNewTitleBn(e.target.value)}
                    placeholder="বাংলা শিরোনাম (যেমন: নতুন সংযোগে ফ্রি রাউটার!)"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    placeholder="English Title (e.g. Free Router on New Connection!)"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Offer Subtitle / Details */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'অফারের বিস্তারিত বিবরণ / প্যাকেজ' : 'Offer Details / Subtitle'}
                  </label>
                  <input
                    type="text"
                    value={newSubtitleBn}
                    onChange={(e) => setNewSubtitleBn(e.target.value)}
                    placeholder="বাংলা বিবরণ (যেমন: সুপারফাস্ট ফাইবার অপটিক ইন্টারনেট সংযোগ)"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newSubtitleEn}
                    onChange={(e) => setNewSubtitleEn(e.target.value)}
                    placeholder="English Details (e.g. Superfast fiber broadband connection)"
                    className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Offer Badge Tag */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'অফার রিবন / ব্যাজ (Badge)' : 'Offer Badge / Ribbon'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newBadgeBn}
                      onChange={(e) => setNewBadgeBn(e.target.value)}
                      placeholder="বাংলা ব্যাজ (৫০% ছাড়)"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={newBadgeEn}
                      onChange={(e) => setNewBadgeEn(e.target.value)}
                      placeholder="English Badge (50% OFF)"
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                {/* Offer Image Upload & Presets */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'অফারের ব্যানার ছবি আপলোড করুন' : 'Offer Banner Photo'}
                  </label>
                  
                  {newImageUrl ? (
                    <div className="relative w-full h-28 rounded-xl overflow-hidden border border-rose-300 shadow-2xs group">
                      <img src={newImageUrl} alt="Offer Preview" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => setNewImageUrl('')}
                          className="px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold hover:bg-black cursor-pointer"
                        >
                          {isBn ? 'ছবি মুছুন' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white dark:bg-slate-800 flex flex-col items-center justify-center cursor-pointer transition-colors"
                    >
                      {isUploadingImage ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isBn ? 'ছবি কমপ্রেস ও আপলোড হচ্ছে...' : 'Uploading photo...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          <Upload className="w-4 h-4 text-rose-500" />
                          <span>{isBn ? 'গ্যালারি বা ক্যামেরা থেকে ছবি আপলোড করুন' : 'Upload Banner Photo'}</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleOfferImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Preset quick buttons */}
                  {!newImageUrl && (
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                      <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                        {isBn ? 'বা রেডি ছবি:' : 'Or preset:'}
                      </span>
                      {quickPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playTap();
                            setNewImageUrl(preset.url);
                          }}
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 shrink-0 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Offer Action Link with Page & Category Selector */}
                {renderLinkSelector(newLinkUrl, setNewLinkUrl, isBn ? 'অফার অ্যাকশন লিংক / পেজ / ক্যাটাগরি' : 'Action Link Target')}

                {/* Confirm Add Offer Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setIsAddingOffer(false);
                      setOfferFormError('');
                    }}
                    className="flex-1 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateOffer}
                    className="flex-1 h-9 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isBn ? 'অফার যুক্ত করুন' : 'Add Offer'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Existing Offers */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
              {offerList.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  {isBn ? 'কোনো সক্রিয় অফার নেই। উপরে "+ নতুন অফার যোগ করুন" বাটনে ট্যাপ করুন।' : 'No offers added. Tap "+ Add New Offer" above.'}
                </div>
              ) : (
                offerList.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5 group"
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.titleBn} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-600 text-white truncate max-w-[90px]">
                          {isBn ? item.badgeBn : item.badgeEn}
                        </span>
                        {!item.isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-300 text-slate-700">
                            {isBn ? 'নিষ্ক্রিয়' : 'Inactive'}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-slate-400 truncate max-w-[100px]">
                          {item.linkUrl}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {isBn ? item.titleBn : item.titleEn}
                      </h5>
                      <p className="text-[10px] text-slate-500 truncate">
                        {isBn ? item.subtitleBn : item.subtitleEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleOfferActive(item.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          item.isActive 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                            : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                        }`}
                        title={item.isActive ? (isBn ? 'নিষ্ক্রিয় করুন' : 'Disable') : (isBn ? 'সক্রিয় করুন' : 'Enable')}
                      >
                        {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(item.id)}
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors cursor-pointer"
                        title={isBn ? 'মুছুন' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. Help */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>❓</span>
            <span>3. সাহায্য / Help</span>
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              value={helpBn}
              onChange={(e) => setHelpBn(e.target.value)}
              placeholder="বাংলা নাম (যেমন: সাহায্য)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              value={helpEn}
              onChange={(e) => setHelpEn(e.target.value)}
              placeholder="English Name (e.g. Help)"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            {renderLinkSelector(helpUrl, setHelpUrl, isBn ? 'সাহায্য অ্যাকশন লিংক / পেজ / ক্যাটাগরি' : 'Help Action Link / Target')}
          </div>
        </div>

        {/* Global Save Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-98 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isBn ? 'সেটিংস ও অফারসমূহ সংরক্ষণ করুন' : 'Save Settings & Offers'}</span>
        </button>
      </form>
    </div>
  );
};
