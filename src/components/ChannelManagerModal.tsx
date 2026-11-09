import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Check, Wallet, Upload, Image as ImageIcon } from 'lucide-react';
import { Language, PaymentChannel } from '../types';
import { sounds } from '../utils/audio';
import { SmartChannelIcon, getChannelGradient } from './SmartChannelIcon';
import { compressImage } from '../utils/imageCompressor';

interface ChannelManagerModalProps {
  isOpen: boolean;
  channels: PaymentChannel[];
  lang: Language;
  onClose: () => void;
  onSaveChannels: (updated: PaymentChannel[]) => void;
}

export const ChannelManagerModal: React.FC<ChannelManagerModalProps> = ({
  isOpen,
  channels,
  lang,
  onClose,
  onSaveChannels
}) => {
  const [channelList, setChannelList] = useState<PaymentChannel[]>(channels);
  const [isAdding, setIsAdding] = useState(false);

  // New channel form
  const [name, setName] = useState('');
  const [labelBn, setLabelBn] = useState('');
  const [labelEn, setLabelEn] = useState('');
  const [colorTheme, setColorTheme] = useState('cyan');
  const [imageUrl, setImageUrl] = useState('');

  // Editing channel icon image
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setChannelList(channels);
    }
  }, [isOpen, channels]);

  if (!isOpen) return null;

  const colorOptions = [
    { name: 'cyan', text: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-200 dark:border-cyan-900/40' },
    { name: 'emerald', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-900/40' },
    { name: 'purple', text: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900/40' },
    { name: 'rose', text: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-900/40' },
    { name: 'amber', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900/40' },
    { name: 'blue', text: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900/40' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, channelId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image to small square icon (256x256)
        const compressed = await compressImage(file, 256, 256, 0.85);
        sounds.playSuccess();
        
        if (channelId) {
          // Update specific channel icon image
          const updated = channelList.map(c => c.id === channelId ? { ...c, imageUrl: compressed } : c);
          setChannelList(updated);
          onSaveChannels(updated);
        } else {
          // New channel form image
          setImageUrl(compressed);
        }
      } catch (err) {
        console.error('Image compression failed:', err);
      }
    }
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playSuccess();
    const selectedColor = colorOptions.find(c => c.name === colorTheme) || colorOptions[0];

    const newChannel: PaymentChannel = {
      id: `ch-${Date.now()}`,
      name: name.trim(),
      labelBn: labelBn.trim() || `${name.trim()} ওয়ালেট`,
      labelEn: labelEn.trim() || `${name.trim()} Account`,
      icon: 'smart',
      imageUrl: imageUrl || undefined,
      color: selectedColor.text,
      bg: selectedColor.bg,
      border: selectedColor.border,
      isDefault: false
    };

    const updated = [...channelList, newChannel];
    setChannelList(updated);
    onSaveChannels(updated);
    setIsAdding(false);
    setName('');
    setLabelBn('');
    setLabelEn('');
    setImageUrl('');
  };

  const handleDeleteChannel = (id: string) => {
    sounds.playTap();
    if (confirm(lang === 'bn' ? 'এই পেমেন্ট চ্যানেলটি মুছে ফেলতে চান?' : 'Delete this channel?')) {
      const updated = channelList.filter(c => c.id !== id);
      setChannelList(updated);
      onSaveChannels(updated);
    }
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
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#E52E2E]" />
            <span>{lang === 'bn' ? 'পেমেন্ট চ্যানেল ও আইকন ব্যবস্থাপনা' : 'Channel & Icon Manager'}</span>
          </h2>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              sounds.playTap();
              setIsAdding(true);
            }}
            className="h-9 px-3 rounded-xl bg-[#E52E2E] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন চ্যানেল' : 'Add Channel'}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        {/* Add Channel Form */}
        {isAdding ? (
          <form onSubmit={handleAddChannel} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'নতুন পেমেন্ট চ্যানেল ও ছবি আইকন যোগ করুন' : 'Add New Channel with Custom Image Icon'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                চ্যানেলের নাম (যেমন: বিকাশ, নগদ, রকেট, উপায়) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: বিকাশ"
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বাংলা লেবেল
                </label>
                <input
                  type="text"
                  value={labelBn}
                  onChange={(e) => setLabelBn(e.target.value)}
                  placeholder="যেমন: বিকাশ একাউন্ট"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  English Label
                </label>
                <input
                  type="text"
                  value={labelEn}
                  onChange={(e) => setLabelEn(e.target.value)}
                  placeholder="e.g. bKash Account"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Custom Icon Image Upload from Device */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'bn' ? 'আইকন ছবি আপলোড (ডিভাইস থেকে)' : 'Upload Icon Image from Device'}
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Icon Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <label className="flex-1 h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-slate-700">
                  <Upload className="w-4 h-4 text-[#E52E2E]" />
                  <span>{imageUrl ? (lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Image') : (lang === 'bn' ? 'ছবি সিলেক্ট করুন' : 'Choose Image')}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                </label>
              </div>
            </div>

            {/* Smart Icon Live Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'bn' ? 'আইকন প্রিভিউ' : 'Icon Preview'}
              </label>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${getChannelGradient(name || 'custom')} overflow-hidden`}>
                  <SmartChannelIcon method={name || 'custom'} imageUrl={imageUrl} className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900 dark:text-white">{name || 'নতুন চ্যানেল'}</p>
                  <p className="text-slate-500 text-[11px]">{labelBn || 'কাস্টম আইকন'}</p>
                </div>
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                কালার থিম
              </label>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => {
                      sounds.playTap();
                      setColorTheme(c.name);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${c.bg} ${
                      colorTheme === c.name ? 'border-[#E52E2E] scale-110' : 'border-transparent'
                    }`}
                  >
                    {colorTheme === c.name && <Check className="w-3.5 h-3.5 text-slate-800 dark:text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#E52E2E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'bn' ? 'চ্যানেল ও আইকন সেভ করুন' : 'Save Channel & Icon'}</span>
            </button>
          </form>
        ) : null}

        {/* Channels List with Custom Image Upload Options */}
        <div className="space-y-3">
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-[#E52E2E] shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {lang === 'bn' 
                ? 'আপনি বিকাশ, নগদ, রকেট বা যেকোনো চ্যানেলে ক্লিক করে আপনার ডিভাইস থেকে ছবি আপلود করে সরাসরি আইকন হিসেবে সেট করতে পারেন।'
                : 'Upload custom device images as icons for bKash, Nagad, Rocket or any channel below.'}
            </p>
          </div>

          {channelList.map((ch) => (
            <div
              key={ch.id}
              className={`p-3.5 rounded-2xl ${ch.bg} border ${ch.border} flex items-center justify-between shadow-2xs`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getChannelGradient(ch.name)} overflow-hidden shadow-sm shrink-0`}>
                  <SmartChannelIcon method={ch.name} imageUrl={ch.imageUrl} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ch.name}
                    </h4>
                    {ch.imageUrl ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {lang === 'bn' ? 'কাস্টম ছবি আইকন' : 'Custom Image'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {lang === 'bn' ? 'স্মার্ট আইকন' : 'Smart Icon'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? ch.labelBn : ch.labelEn}
                  </p>
                </div>
              </div>

              {/* Upload / Change Icon Image Button for Each Channel */}
              <div className="flex items-center gap-2">
                <label 
                  className="h-8 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                  title={lang === 'bn' ? 'আইকন ছবি পরিবর্তন করুন' : 'Change Icon Image'}
                >
                  <Upload className="w-3.5 h-3.5 text-[#E52E2E]" />
                  <span className="hidden sm:inline">{lang === 'bn' ? 'ছবি আইকন' : 'Icon'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, ch.id)} 
                    className="hidden" 
                  />
                </label>

                {!ch.isDefault && (
                  <button
                    onClick={() => handleDeleteChannel(ch.id)}
                    className="w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-900/80 text-[#E52E2E] flex items-center justify-center hover:bg-rose-100 shadow-2xs"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
