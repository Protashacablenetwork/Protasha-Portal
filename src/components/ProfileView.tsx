import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Lock, 
  Trash2, 
  History, 
  LogOut,
  Moon,
  Sun,
  Pencil,
  ChevronRight,
  Sparkles,
  Bell,
  ShieldCheck,
  Check,
  Camera,
  Users,
  Store,
  LogIn,
  Eye,
  EyeOff,
  Smartphone,
  User,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  KeyRound,
  Shield,
  Cloud,
  UploadCloud,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, UserSession } from '../types';
import { translations } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';

interface ProfileViewProps {
  user: UserSession | null;
  lang: Language;
  theme: 'light' | 'dark';
  adminAvatar?: string;
  onToggleTheme: () => void;
  onLanguageChange: (lang: Language) => void;
  onOpenChangePin: () => void;
  onOpenRecycleBin: () => void;
  onOpenAuditLog: () => void;
  onOpenBannerManager: () => void;
  onOpenNotifications: () => void;
  onOpenUserManagement?: () => void;
  onOpenServiceManager?: () => void;
  onOpenDriveBackup?: () => void;
  onLogout: () => void;
  onClose: () => void;
  onUpdateAdminProfile?: (name: string, avatarUrl: string) => void;
  onUpdateUserProfile?: (data: { name: string; phone: string; pin?: string; avatarUrl?: string }) => Promise<{ success: boolean; message?: string }>;
  onBindMethods?: (data: { phone?: string; gmail?: string; pin?: string }) => Promise<{ success: boolean; message?: string }>;
  onOpenLogin?: () => void;
  onOpenFooterSettings?: () => void;
  isTabMode?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  lang,
  theme,
  adminAvatar,
  onToggleTheme,
  onLanguageChange,
  onOpenChangePin,
  onOpenRecycleBin,
  onOpenAuditLog,
  onOpenBannerManager,
  onOpenNotifications,
  onOpenUserManagement,
  onOpenServiceManager,
  onOpenDriveBackup,
  onLogout,
  onClose,
  onUpdateAdminProfile,
  onUpdateUserProfile,
  onBindMethods,
  onOpenLogin,
  onOpenFooterSettings,
  isTabMode = false
}) => {
  const t = translations[lang];
  const isBn = lang === 'bn';
  const isAdmin = user?.role === 'admin';
  const isRegisteredUser = user?.role === 'user' || user?.role === 'sub-admin';
  const isLoggedIn = !!user && (isAdmin || isRegisteredUser);

  // Active display values
  const [userName, setUserName] = useState(
    user?.name || (isAdmin ? (isBn ? 'প্রত্যাশা অ্যাডমিন' : 'Protyasha Admin') : (isBn ? 'সম্মানিত সদস্য' : 'Valued Member'))
  );
  const [avatarUrl, setAvatarUrl] = useState(() => 
    user?.avatarUrl || adminAvatar || (typeof window !== 'undefined' ? localStorage.getItem('protyasha_admin_avatar') || '' : '')
  );

  // Edit Modal States with 3 Distinct Options: 'info', 'security' vs 'binding'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'info' | 'security' | 'binding'>('info');

  // Fields for Option 1: Info (Name, Photo, Phone)
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Fields for Option 2: Security (PIN / Password)
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Loading & Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // Persistent Toast State on Profile Page
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  useEffect(() => {
    if (user?.name) setUserName(user.name);
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    } else if (adminAvatar) {
      setAvatarUrl(adminAvatar);
    }
  }, [user?.name, user?.avatarUrl, adminAvatar]);

  // Open Edit Profile Modal with selected tab
  const handleOpenEditModal = (initialTab: 'info' | 'security' = 'info') => {
    sounds.playTap();
    setEditTab(initialTab);
    setEditName(user?.name || userName);
    setEditPhone(user?.phone || '');
    setEditAvatar(avatarUrl);
    setNewPin('');
    setConfirmPin('');
    setShowNewPin(false);
    setShowConfirmPin(false);
    setEditError('');
    setModalSuccessMsg('');
    setIsEditModalOpen(true);
  };

  // Image Upload with client compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      setEditAvatar(compressedDataUrl);
      sounds.playSuccess();
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setEditError(isBn ? 'ছবি প্রক্রিয়াকরণ করা সম্ভব হয়নি' : 'Failed to process image');
    }
  };

  // 1. Save Personal Info (Name, Photo, Phone)
  const handleSavePersonalInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editName.trim()) {
      sounds.playTap();
      setEditError(isBn ? 'দয়া করে আপনার পূর্ণ নাম লিখুন' : 'Please enter your full name');
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 10) {
      sounds.playTap();
      setEditError(isBn ? 'সঠিক মোবাইল নাম্বার দিন (কমপক্ষে ১১ ডিজিট)' : 'Enter valid phone number (at least 11 digits)');
      return;
    }

    setIsSaving(true);
    setEditError('');
    setModalSuccessMsg('');
    sounds.playTap();

    try {
      if (onUpdateUserProfile) {
        const result = await onUpdateUserProfile({
          name: editName.trim(),
          phone: editPhone.trim(),
          avatarUrl: editAvatar
        });

        if (result && !result.success) {
          setEditError(result.message || (isBn ? 'প্রোফাইল আপডেট ব্যর্থ হয়েছে' : 'Profile update failed'));
          setIsSaving(false);
          return;
        }
      } else if (isAdmin && onUpdateAdminProfile) {
        onUpdateAdminProfile(editName.trim(), editAvatar);
      }

      setUserName(editName.trim());
      setAvatarUrl(editAvatar);
      setIsSaving(false);

      // Play success celebration
      sounds.playSuccess();
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      } catch {
        // ignore
      }

      const successMsg = isBn 
        ? 'আপনার নাম, ছবি ও মোবাইল নাম্বার সফলভাবে সংরক্ষিত হয়েছে!'
        : 'Name, photo and mobile number updated successfully!';

      setModalSuccessMsg(successMsg);
      setSuccessToastMessage(successMsg);
      setShowSuccessToast(true);

      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1400);

      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err: any) {
      console.error('Error saving profile info:', err);
      setIsSaving(false);
      setEditError(err.message || (isBn ? 'সংরক্ষণ ব্যর্থ হয়েছে' : 'Failed to save changes'));
    }
  };

  // 2. Save Security PIN / Password
  const handleSaveSecurityPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPin.trim()) {
      sounds.playTap();
      setEditError(isBn ? 'দয়া করে নতুন পাসওয়ার্ড বা পিন লিখুন' : 'Please enter your new PIN');
      return;
    }
    if (newPin.trim().length < 4) {
      sounds.playTap();
      setEditError(isBn ? 'পাসওয়ার্ড বা পিন কমপক্ষে ৪ সংখ্যার হতে হবে' : 'PIN must be at least 4 digits');
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      sounds.playTap();
      setEditError(isBn ? 'নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!' : 'New PIN and confirm PIN do not match!');
      return;
    }

    setIsSaving(true);
    setEditError('');
    setModalSuccessMsg('');
    sounds.playTap();

    try {
      if (onUpdateUserProfile) {
        const result = await onUpdateUserProfile({
          name: userName,
          phone: user?.phone || editPhone.trim() || '01884542812',
          pin: newPin.trim(),
          avatarUrl: avatarUrl
        });

        if (result && !result.success) {
          setEditError(result.message || (isBn ? 'পিন পরিবর্তন ব্যর্থ হয়েছে' : 'PIN update failed'));
          setIsSaving(false);
          return;
        }
      }

      setIsSaving(false);
      sounds.playSuccess();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
      } catch {
        // ignore
      }

      const successMsg = isBn 
        ? 'আপনার নতুন পাসওয়ার্ড / পিন সফলভাবে পরিবর্তন ও সংরক্ষিত হয়েছে!'
        : 'Your login PIN has been updated successfully!';

      setModalSuccessMsg(successMsg);
      setSuccessToastMessage(successMsg);
      setShowSuccessToast(true);
      setNewPin('');
      setConfirmPin('');

      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1400);

      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err: any) {
      console.error('Error saving security pin:', err);
      setIsSaving(false);
      setEditError(err.message || (isBn ? 'পিন সংরক্ষণ ব্যর্থ হয়েছে' : 'Failed to update PIN'));
    }
  };

  const displayAvatar = avatarUrl && !avatarUrl.startsWith('/uploads/') ? avatarUrl : (avatarUrl.startsWith('data:image/') ? avatarUrl : '');

  return (
    <div className={isTabMode ? "w-full min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col select-none pb-24" : "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200 pb-24"}>
      {/* Top Header */}
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
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'মেনু ও প্রোফাইল' : 'Menu & Profile'}
          </h2>
        </div>

        {/* Dark Mode Quick Toggle */}
        <button
          onClick={() => {
            sounds.playTap();
            onToggleTheme();
          }}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all"
          title={isBn ? 'থিম পরিবর্তন' : 'Toggle Theme'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      {/* Success Notification Alert Toast */}
      {showSuccessToast && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold">{isBn ? 'প্রোফাইল আপডেট সফল!' : 'Profile Updated Successfully!'}</p>
              <p className="text-[11px] text-white/90 font-medium">{successToastMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        {/* User Card: Clean, High-Contrast with One Distinct Edit Button */}
        {isLoggedIn ? (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar with Camera Button to open Photo Edit */}
              <div className="relative group shrink-0">
                <div className={`w-16 h-16 rounded-full p-0.5 shadow-md overflow-hidden flex items-center justify-center ${
                  isAdmin 
                    ? 'bg-gradient-to-tr from-[#D32F2F] to-[#FF9800] shadow-rose-500/20' 
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20'
                }`}>
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-[#E52E2E]">
                      {userName.slice(0, 1) || (isAdmin ? (isBn ? 'প্র' : 'P') : 'U')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenEditModal('info')}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E52E2E] text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 active:scale-90 transition-transform cursor-pointer"
                  title={isBn ? 'ছবি পরিবর্তন' : 'Edit photo'}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                    {userName}
                  </h3>
                  <button
                    onClick={() => handleOpenEditModal('info')}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#E52E2E] dark:hover:text-rose-400 active:scale-95 transition-all shrink-0 cursor-pointer"
                    title={isBn ? 'প্রোফাইল পরিবর্তন' : 'Edit Profile'}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5 flex items-center gap-1 font-mono">
                  <Smartphone className="w-3 h-3 text-slate-400" />
                  <span>{user?.phone || '০১৭৭৭৮৭৭২০৭'}</span>
                </p>

                <div className="flex items-center gap-1.5 mt-1.5">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isBn ? 'ভেরিফায়েড অ্যাডমিন' : 'Verified Admin'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isBn ? 'নিবন্ধিত সম্মানিত সদস্য' : 'Registered Member'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Binding Status (New) */}
            <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                <span>{isBn ? 'একাউন্ট বাইন্ডিং' : 'Account Binding'}</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {/* Phone status */}
                <div className={`p-2 rounded-xl border flex flex-col gap-1 ${user?.phone ? 'bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10' : 'bg-rose-50/30 border-rose-100 dark:bg-rose-900/10'}`}>
                   <div className="flex items-center gap-1.5">
                     <Smartphone className={`w-3 h-3 ${user?.phone ? 'text-emerald-500' : 'text-rose-500'}`} />
                     <span className="text-[9px] font-bold text-slate-500">{isBn ? 'মোবাইল' : 'Phone'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black truncate">{user?.phone || '...'}</span>
                     {user?.phone ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-rose-500" />}
                   </div>
                </div>
                {/* Gmail status */}
                <div className={`p-2 rounded-xl border flex flex-col gap-1 ${user?.gmail ? 'bg-blue-50/30 border-blue-100 dark:bg-blue-900/10' : 'bg-amber-50/30 border-amber-100 dark:bg-amber-900/10'}`}>
                   <div className="flex items-center gap-1.5">
                     <Cloud className={`w-3 h-3 ${user?.gmail ? 'text-blue-500' : 'text-amber-500'}`} />
                     <span className="text-[9px] font-bold text-slate-500">{isBn ? 'জিমেইল' : 'Gmail'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black truncate max-w-[60px]">{user?.gmail || (isBn ? 'সংযুক্ত নেই' : 'None')}</span>
                     {user?.gmail ? <CheckCircle2 className="w-3 h-3 text-blue-500" /> : <button onClick={() => { setEditTab('binding'); setIsEditModalOpen(true); }} className="px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-bold">LINK</button>}
                   </div>
                </div>
              </div>
            </div>

            {/* SINGLE CLEAN EDIT BUTTON: Opens the 2-option modal (No duplicate rows!) */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                   setEditTab('info');
                   setIsEditModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-orange-500/20 text-[#E52E2E] dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/50 text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রোফাইল তথ্য ও পিন পরিবর্তন করুন' : 'Edit Profile Info & PIN'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Visitor Mode Card */
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-rose-400 shrink-0">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? 'সম্মানিত ভিজিটর' : 'Visitor Mode'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn ? 'সকল ফিচারের জন্য লগইন বা রেজিস্ট্রেশন করুন' : 'Login or register for full features'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                if (onOpenLogin) onOpenLogin();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#E52E2E] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগইন' : 'Login'}</span>
            </button>
          </div>
        )}

        {/* Clean Settings and Tools Menu (Redundant duplicate profile/pin rows completely removed!) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* Language Switcher Row */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t.language}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn ? 'ভাষা পরিবর্তন করুন (বাংলা/English)' : 'Switch app language'}
                </p>
              </div>
            </div>

            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  sounds.playTap();
                  onLanguageChange('bn');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-[#E52E2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  onLanguageChange('en');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#E52E2E] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                ENG
              </button>
            </div>
          </div>

          {/* Admin Control Tools (Strictly for Admin) */}
          {isAdmin && (
            <>
              {/* Centralized Google Drive Backup & Restore Row (Admin Only - Hidden on Mobile, Visible on Desktop/PC) */}
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onOpenDriveBackup) onOpenDriveBackup();
                }}
                className="hidden md:flex w-full p-4 items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Cloud className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <span>{isBn ? 'সেন্ট্রালাইজড ব্যাকআপ ও রিস্টোর' : 'Centralized Backup & Restore'}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {isBn ? 'গুগল ড্রাইভ' : 'Drive'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'ফায়ারবেস ডেটাবেসের মাস্টার কপি ড্রাইভে সেভ ও রিস্টোর' : 'Save & restore master database snapshot to Google Drive'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              {/* User Management Row (Admin Only) */}
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onOpenUserManagement) onOpenUserManagement();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <span>{isBn ? 'ব্যবহারকারী ও একাউন্ট নিয়ন্ত্রণ' : 'User & Account Management'}</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {isBn ? 'এডমিন' : 'Admin'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সকল নিবন্ধিত ইউজার দেখুন, এডিট ও নিয়ন্ত্রণ করুন' : 'View, edit and manage registered users'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Notifications Manager Row */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenNotifications();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'নোটিফিকেশন ও বার্তা নিয়ন্ত্রণ' : 'Notifications & Broadcast'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'নতুন বার্তা পাঠান ও পরিচালনা' : 'Send notifications to customers'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Banner Ads Manager Row */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenBannerManager();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'বিজ্ঞাপন ব্যানার কন্ট্রোল (ব্রডব্যান্ড ইন্টারনেট ব্যানার)' : 'Banner Ads Control'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'মেইন পেইজের অফার ব্যানার যোগ/পরিবর্তন' : 'Manage promo carousel banners'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Footer Settings & Store/Offer/Help Customization Row */}
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onOpenFooterSettings) onOpenFooterSettings();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'স্টোর, অফার ও সাহায্য তথ্য সম্পাদনা (ফুটার)' : 'Edit Store, Offer & Help Info'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সাইটের পেজ, ক্যাটাগরি ও অ্যাকশন লিংক পরিবর্তন করুন' : 'Customize login page store, offer & help info'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Recycle Bin Row */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenRecycleBin();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'রিসাইকেল বিন' : 'Recycle Bin'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'ডিলিট হওয়া এন্ট্রি পুনরুদ্ধার' : 'Restore deleted transactions'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Service & Notice Control Row (Admin Only) */}
              <button
                onClick={() => {
                  sounds.playTap();
                  if (onOpenServiceManager) onOpenServiceManager();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer border-b border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'অ্যাপ সেবা ও নোটিশ কন্ট্রোল' : 'App Services & Notice Control'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সেবা চালু/বন্ধ এবং কাস্টম নোটিশ পপ আপ সেট করুন' : 'Enable/disable services and custom notices'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Audit Log Row */}
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenAuditLog();
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'অডিট লগ' : 'Audit Log'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সকল এডমিন কার্যক্রমের হিস্ট্রি' : 'Track admin activity records'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </>
          )}
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playTap();
              onLogout();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isBn ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2-OPTION PROFILE EDIT MODAL:                                   */}
      {/* 1. নাম, ছবি ও নাম্বার পরিবর্তন                                    */}
      {/* 2. পাসওয়ার্ড / পিন পরিবর্তন                                       */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'প্রোফাইল সেটিংস ও সম্পাদনা' : 'Profile Settings & Edit'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn ? 'নিচের ২ টি অপশন থেকে নির্বাচন করুন' : 'Select one of the 2 options below'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* THREE CLEAR OPTIONS (TABS) */}
            <div className="px-5 pt-3 pb-2 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {/* Option A: Name, Photo, Phone */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setEditTab('info');
                    setEditError('');
                    setModalSuccessMsg('');
                  }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    editTab === 'info'
                      ? 'bg-[#E52E2E] text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{isBn ? '১. প্রোফাইল' : '1. Profile'}</span>
                </button>

                {/* Option B: PIN & Password */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setEditTab('security');
                    setEditError('');
                    setModalSuccessMsg('');
                  }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    editTab === 'security'
                      ? 'bg-[#E52E2E] text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="truncate">{isBn ? '২. পিন' : '2. PIN'}</span>
                </button>

                {/* Option C: Account Binding */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setEditTab('binding');
                    setEditError('');
                    setModalSuccessMsg('');
                  }}
                  className={`py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    editTab === 'binding'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="truncate">{isBn ? '৩. বাইন্ডিং' : '3. Binding'}</span>
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Error Alert Box */}
              {editError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in shake duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#E52E2E]" />
                  <span>{editError}</span>
                </div>
              )}

              {/* Success Alert Box */}
              {modalSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{modalSuccessMsg}</span>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 1: নাম, ছবি ও মোবাইল নাম্বার পরিবর্তন               */}
              {/* ==================================================== */}
              {editTab === 'info' && (
                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="flex flex-col items-center justify-center pb-1">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 shadow-lg overflow-hidden flex items-center justify-center">
                        {editAvatar ? (
                          <img src={editAvatar} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-[#E52E2E]">
                            {editName.slice(0, 1) || '👤'}
                          </div>
                        )}
                      </div>

                      <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                        <Camera className="w-6 h-6 mb-0.5" />
                        <span className="text-[10px] font-bold">{isBn ? 'ছবি পরিবর্তন' : 'Change'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>

                    <label className="mt-2 text-xs font-bold text-[#E52E2E] dark:text-rose-400 flex items-center gap-1.5 cursor-pointer hover:underline">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isBn ? 'নতুন ছবি আপলোড করুন' : 'Upload New Photo'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Full Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isBn ? 'পূর্ণ নাম (সদস্য বা এডমিন নাম)' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder={isBn ? 'যেমন: মো: রিয়াদ মিয়া' : 'e.g. John Doe'}
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Number Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isBn ? 'মোবাইল নাম্বার' : 'Mobile Number'}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        data-1password-type="off"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isBn ? 'লগইন করার জন্য আপনার এই মোবাইল নাম্বারটি ব্যবহার করা হবে' : 'This phone number is used for logging into your account'}
                    </p>
                  </div>

                  {/* Action Buttons for Tab 1 */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isBn ? 'তথ্য সংরক্ষণ করুন' : 'Save Personal Info'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ==================================================== */}
              {/* TAB 2: পাসওয়ার্ড / পিন পরিবর্তন                           */}
              {/* ==================================================== */}
              {editTab === 'security' && (
                <form onSubmit={handleSaveSecurityPin} className="space-y-4">
                  {/* Security Banner Notice */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        {isBn ? 'লগইন সিকিউরিটি ও পিন কোড' : 'Secure Login PIN'}
                      </p>
                      <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5 leading-relaxed">
                        {isBn 
                          ? 'একাউন্টের নিরাপত্তা নিশ্চিত করতে ৪ বা ততোধিক সংখ্যার নতুন পিন কোড লিখুন এবং নিশ্চিত করুন।' 
                          : 'Set a new secure 4+ digit PIN to protect your account.'}
                      </p>
                    </div>
                  </div>

                  {/* Registered Phone Badge */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {isBn ? 'যে একাউন্টের পিন পরিবর্তন হচ্ছে:' : 'Account ID:'}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                      {user?.phone || '০১৭৭৭৮৭৭২০৭'}
                    </span>
                  </div>

                  {/* New PIN Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isBn ? 'নতুন পাসওয়ার্ড বা পিন কোড *' : 'New PIN Code *'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        data-1password-type="off"
                        style={{ WebkitTextSecurity: showNewPin ? 'none' : 'disc' } as any}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder={isBn ? 'যেমন: 1234 বা 12588' : 'e.g. 1234'}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono tracking-widest"
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {isBn ? 'কমপক্ষে ৪ সংখ্যার গোপনীয় পিন দিন' : 'Minimum 4 digits required'}
                    </p>
                  </div>

                  {/* Confirm New PIN Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isBn ? 'নতুন পিন পুনরায় লিখুন (নিশ্চিতকরণ) *' : 'Confirm New PIN *'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-lpignore="true"
                        data-1password-type="off"
                        style={{ WebkitTextSecurity: showConfirmPin ? 'none' : 'disc' } as any}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder={isBn ? 'পুনরায় নতুন পিনটি লিখুন' : 'Re-type new PIN'}
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono tracking-widest"
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPin && confirmPin && newPin !== confirmPin && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1">
                        {isBn ? 'পিন দুটি মিলছে না!' : 'PINs do not match!'}
                      </p>
                    )}
                    {newPin && confirmPin && newPin === confirmPin && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{isBn ? 'পিন মিলেছে' : 'PIN matches'}</span>
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Tab 2 */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isBn ? 'নতুন পিন সংরক্ষণ করুন' : 'Save New PIN'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ==================================================== */}
              {/* TAB 3: Account Binding (New)                           */}
              {/* ==================================================== */}
              {editTab === 'binding' && (
                <div className="space-y-5">
                  {/* Binding Info Banner */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                        {isBn ? 'একাউন্ট বাইন্ডিং ও রিকভারি' : 'Account Binding & Recovery'}
                      </p>
                      <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-1 leading-relaxed">
                        {isBn 
                          ? 'আপনার একাউন্টের সাথে জিমেইল এবং মোবাইল নাম্বার বাইন্ড (সংযুক্ত) করে রাখুন। এতে মোবাইল হারালে বা অ্যাপ ডিলেট হলেও ডাটা রিকভারি সহজ হবে।' 
                          : 'Bind your Gmail and Mobile number to your account for easy data recovery across devices.'}
                      </p>
                    </div>
                  </div>

                  {/* Binding Status List */}
                  <div className="space-y-3">
                    {/* Phone Binding Row */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user?.phone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{isBn ? 'মোবাইল নাম্বার' : 'Mobile Phone'}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{user?.phone || (isBn ? 'সংযুক্ত নেই' : 'Not Linked')}</p>
                        </div>
                      </div>
                      {user?.phone ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{isBn ? 'সংযুক্ত' : 'Bound'}</span>
                        </div>
                      ) : (
                        <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold active:scale-95 transition-all">
                          {isBn ? 'সংযুক্ত করুন' : 'Bind Phone'}
                        </button>
                      )}
                    </div>

                    {/* Gmail Binding Row */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user?.gmail ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{isBn ? 'গুগল (জিমেইল)' : 'Google (Gmail)'}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[120px]">{user?.gmail || (isBn ? 'সংযুক্ত নেই' : 'Not Linked')}</p>
                        </div>
                      </div>
                      {user?.gmail ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{isBn ? 'সংযুক্ত' : 'Bound'}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={async () => {
                            try {
                              setIsSaving(true);
                              const { signInWithGoogleDrive } = await import('../utils/googleDrive');
                              const result = await signInWithGoogleDrive();
                              if (result.user.email && onBindMethods) {
                                await onBindMethods({ gmail: result.user.email });
                                setModalSuccessMsg(isBn ? 'জিমেইল সফলভাবে সংযুক্ত হয়েছে!' : 'Gmail linked successfully!');
                                sounds.playSuccess();
                              }
                            } catch (err: any) {
                              setEditError(err.message || (isBn ? 'জিমেইল সংযোগ ব্যর্থ হয়েছে' : 'Gmail linking failed'));
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                          <span>{isBn ? 'কানেক্ট জিমেইল' : 'Connect Gmail'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                    >
                      {isBn ? 'বন্ধ করুন' : 'Close Settings'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
