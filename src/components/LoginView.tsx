import React, { useState } from 'react';
import { 
  Lock, 
  Smartphone, 
  ShieldCheck, 
  X, 
  UserPlus, 
  LogIn, 
  Camera, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Users,
  Store,
  Tag,
  Headphones,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import { db, safeSetDoc, isFirestoreQuotaExceeded } from '../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Language, FooterConfig, UserSession, BannerAd } from '../types';
import { translations } from '../utils/formatters';
import { safeStorage } from '../utils/safeStorage';
import { sounds } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';
import { saveStoredUser, findStoredUserByPhone } from '../utils/userStorage';

interface LoginViewProps {
  lang: Language;
  footerConfig: FooterConfig;
  banners?: BannerAd[];
  adminAvatar?: string;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserSession) => void;
  onClose?: () => void;
  onOpenStoreModal?: () => void;
  onOpenOfferModal?: () => void;
  onOpenHelpModal?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  lang,
  footerConfig,
  banners = [],
  adminAvatar,
  onLanguageChange,
  onLoginSuccess,
  onClose,
  onOpenStoreModal,
  onOpenOfferModal,
  onOpenHelpModal
}) => {
  const isBn = lang === 'bn';
  const t = translations[lang];

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States (Remember last logged in phone number)
  const [accountNumber, setAccountNumber] = useState(() => {
    return safeStorage.getItem('protyasha_last_phone') || '';
  });
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Informational Pop-up Modal State for Store, Offer, and Help
  const [activeModal, setActiveModal] = useState<'store' | 'offer' | 'help' | null>(null);

  // Register Form States (নাম, মোবাইল নাম্বার, ছবি, পিন)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');
  const [showRegPin, setShowRegPin] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Photo Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      setRegAvatar(compressedDataUrl);
      sounds.playSuccess();

      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compressedDataUrl, filename: file.name })
      }).catch(() => {});
    } catch (err) {
      console.error('Error compressing avatar in registration:', err);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = accountNumber.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (!cleanId || cleanPin.length < 4) {
      setErrorMsg(isBn ? 'সঠিক মোবাইল নাম্বার ও কমপক্ষে ৪ ডিজিটের পিন দিন' : 'Enter valid phone and at least 4-digit PIN');
      return;
    }

    sounds.playTap();

    // Fast-path 1: Master Admin Instant Login (0ms instant entry)
    if ((cleanPin === '12588' && (cleanId.includes('admin') || cleanId.includes('01777877207') || cleanId.length === 0)) ||
        (cleanId === '01777877207' && cleanPin === '12588')) {
      // Non-blocking background check/sync
      getDoc(doc(db, 'settings', 'server_data')).then(snap => {
        if (snap.exists()) {
          const adminProf = snap.data().data?.adminProfile;
          if (adminProf) {
            onLoginSuccess({
              id: 'admin-master',
              email: 'admin@protyasha.com',
              role: 'admin',
              name: adminProf.name || (isBn ? 'প্রত্যাশা অ্যাডমিন' : 'Protyasha Admin'),
              phone: '01777877207',
              avatarUrl: adminProf.avatarUrl || adminAvatar || '',
              virtualCardNumber: '9856 0000 2932 9162',
              accountType: 'general',
              profitPreference: false
            });
          }
        }
      }).catch(() => {});
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let userData: any = null;
      let userId: string = '';

      // 1. Check local persistent store
      const localUser = findStoredUserByPhone(accountNumber.trim());
      if (localUser) {
        userData = localUser;
        userId = localUser.id;
      }

      // 2. Query Firestore if available
      if (!userData && !isFirestoreQuotaExceeded()) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('phone', '==', accountNumber.trim()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userData = userDoc.data();
            userId = userDoc.id;
            saveStoredUser({ ...userData, id: userId });
          }
        } catch (err) {
          console.warn('Firestore login check skipped, using local store:', err);
        }
      }

      setIsLoading(false);

      if (userData) {
        if (userData.pin === cleanPin) {
          if (userData.status === 'suspended') {
            setErrorMsg(isBn ? 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।' : 'Your account has been suspended. Contact admin.');
            return;
          }

          safeStorage.setItem('protyasha_last_phone', accountNumber.trim());
          safeStorage.setItem('protyasha_user_phone', accountNumber.trim());
          if (userData.avatarUrl) {
            safeStorage.setItem('protyasha_last_avatar', userData.avatarUrl);
          }
          sounds.playSuccess();
          onLoginSuccess({
            id: userId || ('usr_' + Date.now()),
            email: `${userData.phone}@protyasha.com`,
            role: userData.role || 'user',
            name: userData.name,
            phone: userData.phone,
            avatarUrl: userData.avatarUrl,
            virtualCardNumber: userData.virtualCardNumber || ('9856 ' + userData.phone.slice(-4).padStart(4, '0') + ' 2932 9162'),
            accountType: 'general',
            profitPreference: false
          });
        } else {
          sounds.playTap();
          setErrorMsg(isBn ? 'ভুল পিন নম্বর! পুনরায় চেষ্টা করুন।' : 'Invalid PIN! Please try again.');
        }
      } else {
        sounds.playTap();
        setErrorMsg(isBn ? 'এই মোবাইল নাম্বারে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' : 'No account found with this phone number.');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Login error:', err);
      setErrorMsg(isBn ? 'লগইন প্রক্রিয়ায় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।' : 'Login failed. Please retry.');
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length < 10) {
      setErrorMsg(isBn ? 'সঠিক ১১-সংখ্যার মোবাইল নাম্বার লিখুন' : 'Please enter valid phone number');
      return;
    }
    if (!regPin.trim() || regPin.trim().length < 4) {
      setErrorMsg(isBn ? 'কমপক্ষে ৪ সংখ্যার গোপনীয় পিন সেট করুন' : 'PIN must be at least 4 digits');
      return;
    }
    if (regPin !== regConfirmPin) {
      setErrorMsg(isBn ? 'উভয় পিন নম্বর মিলছে না! পুনরায় চেক করুন।' : 'PINs do not match!');
      return;
    }

    sounds.playTap();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const cleanPhone = regPhone.trim();

      // Check duplicate locally first
      const existingLocal = findStoredUserByPhone(cleanPhone);
      if (existingLocal) {
        setIsLoading(false);
        setErrorMsg(isBn ? 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' : 'An account already exists with this phone number');
        return;
      }

      // Check duplicate in Firestore if online
      if (!isFirestoreQuotaExceeded()) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('phone', '==', cleanPhone));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setIsLoading(false);
            setErrorMsg(isBn ? 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' : 'An account already exists with this phone number');
            return;
          }
        } catch (e) {
          console.warn('Firestore phone duplicate check skipped:', e);
        }
      }

      const newId = 'usr_' + Date.now();
      const newUser = {
        id: newId,
        name: regName.trim(),
        phone: cleanPhone,
        avatarUrl: regAvatar || '',
        pin: regPin.trim(),
        role: 'user' as const,
        createdAt: new Date().toISOString(),
        status: 'active' as const
      };

      // 1. Save to local persistent store immediately (100% reliable)
      saveStoredUser(newUser);

      // 2. Sync to Cloud Firestore in background
      safeSetDoc(doc(db, 'users', newId), newUser).catch(() => {});
      
      setIsLoading(false);
      sounds.playSuccess();
      setSuccessMsg(isBn ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
      safeStorage.setItem('protyasha_user_phone', cleanPhone);
      safeStorage.setItem('protyasha_last_phone', cleanPhone);
      if (regAvatar) {
        safeStorage.setItem('protyasha_last_avatar', regAvatar);
      }
      
      setTimeout(() => {
        onLoginSuccess({
          id: newUser.id,
          email: `${newUser.phone}@protyasha.com`,
          role: 'user',
          name: newUser.name,
          phone: newUser.phone,
          avatarUrl: newUser.avatarUrl,
          virtualCardNumber: '9856 ' + newUser.phone.slice(-4).padStart(4, '0') + ' 2932 9162',
          accountType: 'general',
          profitPreference: false
        });
      }, 300);
    } catch (err) {
      setIsLoading(false);
      console.error('Registration error:', err);
      setErrorMsg(isBn ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।' : 'Registration failed! Please retry.');
    }
  };

  // 1-Tap Visitor Mode Login
  const handleVisitorLogin = () => {
    sounds.playTap();
    sounds.playSuccess();
    onLoginSuccess({
      email: 'visitor@protashacablenetwork.com',
      role: 'visitor',
      name: isBn ? 'সম্মানিত ভিজিটর' : 'Guest Visitor',
      phone: '01777877207',
      virtualCardNumber: '9856 0000 2932 9162',
      accountType: 'general',
      profitPreference: false
    });
  };

  const displayAvatar = safeStorage.getItem('protyasha_last_avatar') || adminAvatar;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-0 md:p-6 select-none overflow-y-auto">
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl bg-gradient-to-br from-[#FCEAE5] via-[#FFF8F5] to-[#FDE6E0] dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[100dvh] md:min-h-[580px] border border-slate-200/60 dark:border-slate-800">
        
        {/* Left Hero Sidebar on PC/Desktop monitors */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#D32F2F] via-[#E52E2E] to-[#B71C1C] p-8 text-white flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <span className="text-xs font-extrabold tracking-wider uppercase text-amber-200">
                {isBn ? 'ডিজিটাল সেবার স্মার্ট মাধ্যম' : 'Smart Digital Portal'}
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-black leading-tight mb-3 tracking-tight">
              {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
            </h2>
            <p className="text-xs font-medium text-rose-100/90 leading-relaxed mb-6">
              {isBn 
                ? 'হাই-স্পিড অপটিক্যাল ফাইবার ব্রডব্যান্ড ইন্টারনেট ও ডিজিটাল ডিস নেটওয়ার্ক ব্যবস্থাপনা'
                : 'High-speed optical fiber internet & digital dish network ledger portal'}
            </p>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15">
                <Store className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                <span>{isBn ? '২৪/৭ অটোমেটেড ক্যাবল বিল বুকিং' : '24/7 Automated Cable Billing'}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15">
                <Tag className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                <span>{isBn ? 'স্মার্ট ও বাফারিংহীন ইন্টারনেট প্যাকেজ' : 'Smart Bufferless Internet Packs'}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 text-[11px] text-rose-200 font-semibold">
            {isBn ? '© ২০২৬ প্রত্যাশা ডিজিটাল পোর্টাল' : '© 2026 Protasha Digital Portal'}
          </div>
        </div>

        {/* Right Form Area */}
        <div className="flex-1 flex flex-col min-h-0">
      {/* Top Header - No Cross Button so user cannot bypass login without deliberate visitor tap */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#E52E2E]" />
            <span>{isBn ? 'প্রত্যাশা ডিজিটাল পোর্টাল' : 'Protasha Portal'}</span>
          </div>
        </div>

        {/* Language Pill Switcher */}
        <div className="flex p-0.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => {
              sounds.playTap();
              onLanguageChange('bn');
            }}
            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
              lang === 'bn' ? 'bg-[#E52E2E] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              onLanguageChange('en');
            }}
            className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-[#E52E2E] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            ENG
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-5 py-4 flex-1 flex flex-col">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-1 shadow-lg shadow-rose-500/30 flex items-center justify-center overflow-hidden">
            {displayAvatar ? (
              <img src={displayAvatar} alt="Logo" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                <span className="text-[#E52E2E] font-black text-2xl">
                  {isBn ? 'প্র' : 'P'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#E52E2E] leading-tight">
              {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
            </h1>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
              {isBn ? 'স্মার্ট নেটওয়ার্ক ও হিসাব খাতা' : 'Smart Network & Ledger'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: [লগ ইন] vs [নতুন একাউন্ট] */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 mb-4 border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => {
              sounds.playTap();
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন একাউন্ট খুলুন' : 'Create Account'}</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-center animate-shake">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            {/* Phone / ID */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'মোবাইল নাম্বার বা এডমিন আইডি' : 'Mobile Number or Admin ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1password-type="off"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={isBn ? '০১XXXXXXXXX অথবা admin' : '01XXXXXXXXX or admin'}
                  required
                  className="w-full h-12 pl-10 pr-4 text-sm font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
                />
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'গোপনীয় পিন নম্বর' : 'Security PIN'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1password-type="off"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPin(val);
                  }}
                  placeholder="•••••"
                  required
                  className="w-full h-12 pl-10 pr-11 text-center tracking-[0.3em] text-lg font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-[#D32F2F] to-[#E52E2E] text-white shadow-md shadow-rose-600/30 hover:opacity-95 active:scale-[0.98] mt-3"
            >
              {isLoading ? (isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...') : (isBn ? 'লগইন করুন' : 'Log In')}
            </button>
          </form>
        ) : (
          /* MODE 2: REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            {/* Photo Upload with Live Preview */}
            <div className="flex items-center gap-3 p-2 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-rose-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {regAvatar ? (
                  <img src={regAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
                <label className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center cursor-pointer transition-colors">
                  <Camera className="w-4 h-4 text-white drop-shadow-xs" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isBn ? 'প্রোফাইল ছবি' : 'Profile Photo'}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {regAvatar ? (isBn ? '✓ ছবি সিলেক্ট হয়েছে' : '✓ Photo selected') : (isBn ? 'ক্যামেরা বা গ্যালারি থেকে ছবি দিন' : 'Upload photo from device')}
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
              </label>
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={isBn ? 'যেমন: মো: সুমন হোসেন' : 'e.g. John Doe'}
                required
                className="w-full h-11 px-3 text-xs font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                {isBn ? 'মোবাইল নাম্বার' : 'Mobile Number'} *
              </label>
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
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
                className="w-full h-11 px-3 text-xs font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
              />
            </div>

            {/* PIN Inputs (2 in a row) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {isBn ? 'গোপন পিন' : 'Set PIN'} *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1password-type="off"
                    value={regPin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setRegPin(val);
                    }}
                    placeholder="••••"
                    required
                    className="w-full h-11 px-3 text-center tracking-widest text-sm font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
                  >
                    {showRegPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {isBn ? 'পিন নিশ্চিত করুন' : 'Confirm PIN'} *
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1password-type="off"
                  value={regConfirmPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setRegConfirmPin(val);
                  }}
                  placeholder="••••"
                  required
                  className="w-full h-11 px-3 text-center tracking-widest text-sm font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
                />
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 hover:opacity-95 active:scale-[0.98] mt-2"
            >
              {isLoading ? (isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating...') : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
            </button>
          </form>
        )}

        {/* ================= VISITOR MODE (লগইন ছাড়া দেখুন) ================= */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleVisitorLogin}
            className="w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#E52E2E]" />
            <span>{isBn ? 'সরাসরি ভিজিটর হিসেবে দেখুন (লগইন ছাড়া)' : 'Browse as Guest Visitor (No login needed)'}</span>
          </button>
        </div>
      </div>

      {/* Footer 3 Items */}
      <div className="px-5 py-3 flex items-center justify-around border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            const url = footerConfig.store.url || '#store';
            if (url.startsWith('tel:')) {
              window.location.href = url;
            } else if (url.startsWith('http')) {
              window.open(url, '_blank');
            } else if (url === '#store' || url === '#offer' || url === '#help') {
              setActiveModal(url.replace('#', '') as any);
            } else {
              handleVisitorLogin();
            }
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform">
            {footerConfig.store.icon || '📍'}
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {lang === 'bn' ? footerConfig.store.bn : footerConfig.store.en}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            const url = footerConfig.offer.url || '#offer';
            if (url.startsWith('tel:')) {
              window.location.href = url;
            } else if (url.startsWith('http')) {
              window.open(url, '_blank');
            } else if (url === '#offer' || url === '#store' || url === '#help') {
              setActiveModal(url.replace('#', '') as any);
            } else {
              handleVisitorLogin();
            }
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform">
            {footerConfig.offer.icon || '🏷️'}
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {lang === 'bn' ? footerConfig.offer.bn : footerConfig.offer.en}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            const url = footerConfig.help.url || '#help';
            if (url.startsWith('tel:')) {
              window.location.href = url;
            } else if (url.startsWith('http')) {
              window.open(url, '_blank');
            } else if (url === '#help' || url === '#store' || url === '#offer') {
              setActiveModal(url.replace('#', '') as any);
            } else {
              handleVisitorLogin();
            }
          }}
          className="flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform">
            {footerConfig.help.icon || '❓'}
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            {lang === 'bn' ? footerConfig.help.bn : footerConfig.help.en}
          </span>
        </button>
      </div>

      {/* Informational Pop-up Modal for Store, Offer, and Help */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  activeModal === 'store' ? 'bg-rose-50 dark:bg-rose-950/50 text-[#E52E2E]' :
                  activeModal === 'offer' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600' :
                  'bg-blue-50 dark:bg-blue-950/50 text-blue-600'
                }`}>
                  {activeModal === 'store' && <Store className="w-5 h-5" />}
                  {activeModal === 'offer' && <Tag className="w-5 h-5" />}
                  {activeModal === 'help' && <Headphones className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {activeModal === 'store' && (isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network')}
                    {activeModal === 'offer' && (isBn ? 'চলমান স্পেশাল অফার' : 'Special Offers')}
                    {activeModal === 'help' && (isBn ? 'কাস্টমার সাপোর্ট ও সাহায্য' : 'Customer Support & Help')}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeModal === 'store' && (isBn ? 'প্রধান শাখা ও কাস্টমার পয়েন্ট' : 'Head Office & Customer Point')}
                    {activeModal === 'offer' && (isBn ? 'বর্তমান ডিসকাউন্ট প্যাকেজ' : 'Active Discounts')}
                    {activeModal === 'help' && (isBn ? '২৪/৭ সার্বক্ষণিক হেল্পলাইন' : '24/7 Dedicated Support')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {activeModal === 'store' && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <MapPin className="w-4 h-4 text-[#E52E2E]" />
                      <span>{isBn ? 'প্রধান অফিসের ঠিকানা' : 'Head Office Address'}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 pl-5 font-medium leading-relaxed">
                      {isBn 
                        ? 'দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), হাজী আবেদ আলী মার্কেট, ইসলামপুর, জামালপুর' 
                        : 'Duttapara Ananda Bazar (Tana Bridge), Haji Abed Ali Market, Islampur, Jamalpur'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? 'খোলা থাকার সময়সূচি' : 'Operating Hours'}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-5">
                      {isBn ? 'প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টা (শুক্রবার ও ছুটির দিনসহ খোলা)।' : 'Everyday 9:00 AM - 9:00 PM (Open 7 days a week).'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? 'সরাসরি যোগাযোগ' : 'Direct Contact'}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-100 pl-5 font-bold text-sm tabular-nums">
                      01777877207
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'offer' && (
                <div className="space-y-2.5">
                  {banners && banners.filter(b => b.isActive).length > 0 ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {banners.filter(b => b.isActive).map((banner) => (
                        <div
                          key={banner.id}
                          className="rounded-2xl bg-white dark:bg-slate-800 border border-rose-200/80 dark:border-slate-700 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
                        >
                          {banner.imageUrl && (
                            <div className="w-full h-28 relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                              <img src={banner.imageUrl} alt={banner.titleBn || 'Banner'} className="w-full h-full object-cover" />
                              {(banner.badgeBn || banner.badgeEn) && (
                                <div className="absolute top-2 left-2">
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E52E2E] text-white shadow-xs">
                                    {isBn ? banner.badgeBn : (banner.badgeEn || banner.badgeBn)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-3">
                            {!banner.imageUrl && (banner.badgeBn || banner.badgeEn) && (
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E52E2E] text-white">
                                  {isBn ? banner.badgeBn : (banner.badgeEn || banner.badgeBn)}
                                </span>
                              </div>
                            )}
                            {(banner.titleBn || banner.titleEn) && (
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                {isBn ? banner.titleBn : banner.titleEn}
                              </h4>
                            )}
                            {(banner.subtitleBn || banner.subtitleEn) && (
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {isBn ? banner.subtitleBn : banner.subtitleEn}
                              </p>
                            )}
                            <a
                              href={banner.linkUrl?.startsWith('tel:') ? banner.linkUrl : 'tel:01777877207'}
                              className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-[#E52E2E] dark:text-rose-300 text-xs font-bold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{isBn ? 'অফারটি নিতে যোগাযোগ করুন (01777877207)' : 'Call to Claim (01777877207)'}</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center mb-2">
                        <Tag className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                        {isBn ? 'বর্তমানে কোনো নতুন স্পেশাল অফার নেই' : 'No Active Offers Right Now'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isBn ? 'নতুন ডিসকাউন্ট প্যাকেজ ও উৎসবের স্পেশাল অফার দ্রুতই এখানে আপডেট করা হবে।' : 'New promotional offers and discounts will be available soon.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'help' && (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Phone className="w-4 h-4 text-[#E52E2E]" />
                      <span>{isBn ? 'কাস্টমার কেয়ার হেল্পলাইন (২৪/৭)' : 'Customer Helpline (24/7)'}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-100 pl-5 font-bold text-sm tabular-nums">
                      01777877207
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Headphones className="w-4 h-4 text-emerald-600" />
                      <span>{isBn ? 'হোয়াটসঅ্যাপ ও টেকনিক্যাল সাপোর্ট' : 'WhatsApp & Technical Support'}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-5">
                      {isBn ? 'ইন্টারনেট বা ক্যাবল সংযোগের যে কোনো সমস্যায় আমাদের টেকনিক্যাল টিম ২৪ ঘণ্টা প্রস্তুত রয়েছে।' : 'Our technical support team is ready 24/7 for internet or cable issues.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <span className="text-base">✉️</span>
                      <span>{isBn ? 'অফিসিয়াল ইমেইল সাপোর্ট' : 'Official Email Support'}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 pl-5 font-semibold text-xs">
                      protashacablenetwork@gmail.com
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Close / Action Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveModal(null);
              }}
              className="w-full mt-4 py-3 rounded-2xl bg-[#E52E2E] hover:bg-[#D32F2F] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
            >
              {isBn ? 'ঠিক আছে' : 'OK'}
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
