import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  RefreshCw, 
  Clock, 
  Sunrise, 
  Sunset, 
  Check, 
  Navigation, 
  Search, 
  X, 
  BellRing,
  Compass,
  Sparkles,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HeartHandshake,
  Info,
  ChevronDown
} from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { 
  PrayerTimings, 
  fetchLivePrayerTimes, 
  calculateLocalPrayerTimes,
  getMonthlyPrayerCalendar,
  MonthlyPrayerDay,
  BENGALI_MONTHS,
  getActivePrayerCardData,
  ActivePrayerCardData
} from '../utils/prayerTimeService';
import { getHijriDate } from '../utils/hijriDate';
import { 
  ALL_BANGLADESH_DISTRICTS, 
  BANGLADESH_DIVISIONS,
  DistrictInfo, 
  setUserPreferredDistrict, 
  getUserPreferredDistrict,
  detectPreciseLocation
} from '../utils/weatherService';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { AUTHENTIC_HADITHS } from '../data/hadithData';
import { QuranViewer } from './QuranViewer';
import { HadithViewer } from './HadithViewer';
import { PrayerNiyatViewer } from './PrayerNiyatViewer';
import { PrayerRulesViewer } from './PrayerRulesViewer';

import { PrayerCardDetail, getPrayerCardDetailByLabel } from '../data/prayerCardDetails';
import { PrayerDetailPage } from './PrayerDetailPage';

interface PrayerTimesModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  isAdmin?: boolean;
  onSendNotification?: (notif: NotificationItem) => void;
  onLocationChanged?: () => void;
  onSubViewActiveChange?: (isSubView: boolean) => void;
}

type PrayerModalViewMode = 'daily' | 'monthly' | 'quran' | 'hadith' | 'niyat' | 'rules' | 'detail';

const PRAYER_5_KEYS: { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; labelBn: string }[] = [
  { key: 'fajr', labelBn: 'ফজর' },
  { key: 'dhuhr', labelBn: 'যুহর' },
  { key: 'asr', labelBn: 'আসর' },
  { key: 'maghrib', labelBn: 'মাগরিব' },
  { key: 'isha', labelBn: 'ইশা' }
];

export const PrayerTimesModal: React.FC<PrayerTimesModalProps> = ({
  isOpen,
  lang,
  onClose,
  isAdmin = false,
  onSendNotification,
  onLocationChanged,
  onSubViewActiveChange
}) => {
  const isBn = lang === 'bn';
  const initialDistrict = getUserPreferredDistrict() || ALL_BANGLADESH_DISTRICTS[0];
  const [district, setDistrict] = useState<DistrictInfo>(initialDistrict);
  const [timings, setTimings] = useState<PrayerTimings>(() => calculateLocalPrayerTimes(initialDistrict));
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLocating, setIsAutoLocating] = useState(false);

  // View Mode: 'daily', 'monthly', 'quran', 'hadith', 'niyat', 'rules'
  const [viewMode, setViewMode] = useState<PrayerModalViewMode>('daily');
  const [selectedNiyatSearch, setSelectedNiyatSearch] = useState('');
  const [selectedPrayerDetail, setSelectedPrayerDetail] = useState<PrayerCardDetail | null>(null);

  // Month & Year state for Monthly Calendar
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth()); // 0-indexed

  // District picker modal (matching Screenshot 2)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('সব');
  const [toastMsg, setToastMsg] = useState('');

  // Main container scroll ref to preserve and restore scroll position on main view
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const dailyScrollPosRef = useRef<number>(0);

  // Live ticking real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Restore scroll position when returning to 'daily', or scroll to top for sub-views
  useEffect(() => {
    if (!mainScrollRef.current) return;
    if (viewMode === 'daily') {
      const targetPos = dailyScrollPosRef.current;
      const restore = () => {
        if (mainScrollRef.current) {
          mainScrollRef.current.scrollTop = targetPos;
        }
      };
      requestAnimationFrame(restore);
      const timer = setTimeout(restore, 40);
      return () => clearTimeout(timer);
    } else {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
    }
  }, [viewMode]);

  useEffect(() => {
    if (isOpen) {
      dailyScrollPosRef.current = 0;
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (viewMode === 'daily') {
      dailyScrollPosRef.current = e.currentTarget.scrollTop;
    }
  };

  // Fetch or calculate prayer timings for a specific district
  const refreshTimings = async (targetDistrict: DistrictInfo = district) => {
    setIsLoading(true);
    try {
      setTimings(calculateLocalPrayerTimes(targetDistrict));
      const res = await fetchLivePrayerTimes(targetDistrict);
      if (res) setTimings(res);
    } catch {
      setTimings(calculateLocalPrayerTimes(targetDistrict));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const saved = getUserPreferredDistrict();
      const target = saved || district;
      setDistrict(target);
      refreshTimings(target);
    }
  }, [isOpen]);

  // Compute Active Prayer Card Data matching user reference picture
  const activeCard: ActivePrayerCardData = useMemo(() => {
    return getActivePrayerCardData(timings, currentTime);
  }, [timings, currentTime]);

  // Compute Hijri Date matching user reference picture
  const hijri = useMemo(() => {
    return getHijriDate(currentTime);
  }, [currentTime]);

  // Compute Monthly Calendar
  const monthlyDays = useMemo(() => {
    return getMonthlyPrayerCalendar(district, calendarYear, calendarMonth);
  }, [district, calendarYear, calendarMonth]);

  const handleSelectDistrict = async (d: DistrictInfo) => {
    sounds.playTap();
    setUserPreferredDistrict(d.nameBn);
    setDistrict(d);
    setIsPickerOpen(false);
    await refreshTimings(d);
    setToastMsg(isBn ? `${d.nameEn} (${d.nameBn}) জেলা নির্ধারিত হয়েছে` : `Selected: ${d.nameEn}`);
    setTimeout(() => setToastMsg(''), 3000);
    if (onLocationChanged) onLocationChanged();
  };

  const handleAutoDetect = async () => {
    sounds.playTap();
    setIsAutoLocating(true);
    setIsLoading(true);
    setIsPickerOpen(false);
    setToastMsg(isBn ? 'ডিভাইসের লাইভ GPS সনাক্ত করা হচ্ছে...' : 'Detecting live GPS...');
    try {
      const { district: detected, isGPS } = await detectPreciseLocation(true);
      setDistrict(detected);
      setUserPreferredDistrict(detected.nameBn);
      await refreshTimings(detected);
      
      if (isGPS) {
        setToastMsg(isBn ? `সফলভাবে ডিভাইস GPS সনাক্ত হয়েছে: ${detected.nameEn} (${detected.nameBn})` : `Live GPS detected: ${detected.nameEn}`);
      } else {
        setToastMsg(isBn ? `বর্তমান জেলা: ${detected.nameEn} (${detected.nameBn})` : `Current district: ${detected.nameEn}`);
      }
      setTimeout(() => setToastMsg(''), 4000);
      if (onLocationChanged) onLocationChanged();
    } catch {
      setToastMsg(isBn ? 'GPS সনাক্ত করতে সমস্যা হয়েছে, জেলা নির্বাচন করুন' : 'GPS detection failed, please select district');
      setTimeout(() => setToastMsg(''), 3500);
    } finally {
      setIsLoading(false);
      setIsAutoLocating(false);
    }
  };

  // Open District Picker Modal (matching Screenshot 2)
  const handleOpenPicker = () => {
    sounds.playTap();
    setIsPickerOpen(true);
    window.history.pushState({ prayerDistrictPicker: true }, '');
  };

  // Switch views with browser history push
  const handleSwitchView = (mode: PrayerModalViewMode, search = '') => {
    sounds.playTap();
    if (mainScrollRef.current && viewMode === 'daily') {
      dailyScrollPosRef.current = mainScrollRef.current.scrollTop;
    }
    if (search) setSelectedNiyatSearch(search);
    else setSelectedNiyatSearch('');
    setViewMode(mode);
    window.history.pushState({ prayerView: mode, search }, '');
  };

  const handleScheduleCardClick = (label: string) => {
    sounds.playTap();
    if (mainScrollRef.current && viewMode === 'daily') {
      dailyScrollPosRef.current = mainScrollRef.current.scrollTop;
    }
    const detail = getPrayerCardDetailByLabel(label);
    if (detail) {
      setSelectedPrayerDetail(detail);
      handleSwitchView('detail');
    } else {
      let searchKey = 'ফজর';
      if (label.includes('তাহাজ্জুদ')) searchKey = 'তাহাজ্জুদ';
      else if (label.includes('ফজর')) searchKey = 'ফজর';
      else if (label.includes('সূর্যোদয়') || label.includes('ইশরাক')) searchKey = 'ইশরাক';
      else if (label.includes('চাশত')) searchKey = 'চাশত';
      else if (label.includes('যুহর') || label.includes('যোহর')) searchKey = 'যোহর';
      else if (label.includes('আসর')) searchKey = 'আসর';
      else if (label.includes('মাগরিব')) searchKey = 'মাগরিব';
      else if (label.includes('ইশা')) searchKey = 'ইশা';

      handleSwitchView('niyat', searchKey);
    }
  };

  // Track sub-view active state (for smooth single back support)
  const isSubViewActive = viewMode !== 'daily' || isPickerOpen || selectedPrayerDetail !== null;
  useEffect(() => {
    onSubViewActiveChange?.(isSubViewActive);
  }, [isSubViewActive, onSubViewActiveChange]);

  useEffect(() => {
    return () => {
      onSubViewActiveChange?.(false);
    };
  }, [onSubViewActiveChange]);

  // Handle hardware device/browser back button & Escape key
  const isPickerOpenRef = useRef(isPickerOpen);
  const viewModeRef = useRef(viewMode);
  const selectedPrayerDetailRef = useRef(selectedPrayerDetail);
  const isQuranSurahOpenRef = useRef(false);
  isPickerOpenRef.current = isPickerOpen;
  viewModeRef.current = viewMode;
  selectedPrayerDetailRef.current = selectedPrayerDetail;

  useEffect(() => {
    if (!isOpen) return;

    const handleModalPopState = (e: PopStateEvent) => {
      if (isPickerOpenRef.current) {
        e.stopImmediatePropagation();
        setIsPickerOpen(false);
        return;
      }
      if (isQuranSurahOpenRef.current) {
        // Let QuranViewer popstate listener handle returning from Surah reader to 114 Surahs list!
        return;
      }
      if (selectedPrayerDetailRef.current || viewModeRef.current !== 'daily') {
        e.stopImmediatePropagation();
        setSelectedPrayerDetail(null);
        setViewMode('daily');
        setSelectedNiyatSearch('');
        return;
      }
      // If at daily root, let App.tsx popstate close the modal
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPickerOpen) {
          setIsPickerOpen(false);
        } else if (selectedPrayerDetail || viewMode !== 'daily') {
          setSelectedPrayerDetail(null);
          setViewMode('daily');
          setSelectedNiyatSearch('');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('popstate', handleModalPopState, false);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleModalPopState, false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filtered districts matching Screenshot 2 format: English (বাংলা)
  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    return ALL_BANGLADESH_DISTRICTS.filter(d => {
      const matchDiv = selectedDivision === 'সব' || d.divisionBn === selectedDivision;
      const matchSearch = !q || 
        d.nameBn.toLowerCase().includes(q) || 
        d.nameEn.toLowerCase().includes(q) || 
        d.divisionBn.toLowerCase().includes(q);
      return matchDiv && matchSearch;
    });
  }, [districtSearch, selectedDivision]);

  if (!isOpen) return null;

  // Real-time Bengali date
  const daysBnFull = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const dayNameBn = daysBnFull[currentTime.getDay()];
  const dateBn = toBengaliNumber(currentTime.getDate());
  const monthNameBn = BENGALI_MONTHS[currentTime.getMonth()];
  const yearBn = toBengaliNumber(currentTime.getFullYear());

  // Month navigation helpers
  const handlePrevMonth = () => {
    sounds.playTap();
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    sounds.playTap();
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  // In-app Back Arrow click handler
  const handleAppBackClick = () => {
    sounds.playTap();
    if (isPickerOpen) {
      setIsPickerOpen(false);
    } else if (viewMode !== 'daily' || selectedPrayerDetail) {
      setSelectedPrayerDetail(null);
      setViewMode('daily');
      setSelectedNiyatSearch('');
    } else {
      onClose();
    }
  };

  const getPageTitle = () => {
    switch (viewMode) {
      case 'monthly': return 'নামাজ ক্যালেন্ডার';
      case 'quran': return 'কোরআনুল কারীম (১১৪ সূরা)';
      case 'hadith': return 'সহীহ হাদিস সম্ভার';
      case 'niyat': return 'সকল নামাজের নিয়ত';
      case 'rules': return 'নামাজের নিয়ম কানুন';
      case 'detail': return selectedPrayerDetail ? `${selectedPrayerDetail.nameBn} (বিবরণ ও নিয়ত)` : 'নামাজের বিবরণ';
      default: return isBn ? 'নামাজের সময়সূচী' : 'Prayer Times';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001d18] text-white select-none flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Background Motifs */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -ml-32 -mb-32" />
      </div>

      {/* ========================================================
          TOP APP BAR (Fixed Top Header)
          ======================================================== */}
      <header className="relative z-40 shrink-0 bg-[#002b23] border-b border-emerald-800/40 shadow-2xl backdrop-blur-xl bg-opacity-95">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="min-w-0">
              <h2 className="text-[17px] font-black text-white truncate leading-tight tracking-tight">
                {getPageTitle()}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-400/90 tracking-wide mt-0.5">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span className="truncate">{district.nameEn} ({district.nameBn})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleSwitchView('monthly')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                viewMode === 'monthly' 
                  ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-900/40 scale-105' 
                  : 'bg-white/5 border-white/5 text-amber-400 hover:bg-white/10'
              }`}
              title="ক্যালেন্ডার"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleOpenPicker}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-amber-400 flex items-center justify-center border border-white/5 shadow-inner"
              title="লোকেশন"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                refreshTimings(district);
              }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 shadow-inner"
              title="রিফ্রেশ"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={mainScrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto relative z-10 scrollbar-none pb-safe">
        <div className="max-w-4xl mx-auto px-1 sm:px-4 py-3 sm:py-6">
        
        {viewMode === 'monthly' ? (
          <div className="space-y-5 pb-28 animate-in slide-in-from-right-4 duration-300">
            {/* Monthly Header (Premium Styling) */}
            <div className="rounded-[36px] p-8 bg-gradient-to-br from-[#003d32] via-[#004d3f] to-[#002b23] border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl shadow-emerald-950/60">
               <div className="absolute -left-8 top-0 opacity-10 text-8xl select-none pointer-events-none">۞</div>
               <div className="absolute -right-8 bottom-0 opacity-10 text-8xl select-none pointer-events-none">۞</div>
               
               <div className="flex items-center justify-center gap-6 mb-4">
                 <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90 border border-white/10 shadow-lg">
                    <ChevronLeft className="w-6 h-6" />
                 </button>
                 <h1 className="text-2xl font-black text-amber-200 tracking-tight drop-shadow-lg font-serif">
                    {BENGALI_MONTHS[calendarMonth]} {toBengaliNumber(calendarYear)}
                 </h1>
                 <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90 border border-white/10 shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/30 border border-white/10 backdrop-blur-md shadow-inner">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-black text-white/95">{district.nameEn} ({district.nameBn})</span>
               </div>
               
               <p className="text-[10px] text-emerald-100/50 mt-5 font-black uppercase tracking-[0.2em]">
                  ইসলামিক ফাউন্ডেশন বাংলাদেশ
               </p>
            </div>

            {/* Monthly Table (Perfect Screenshot 1 Match) */}
            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 ring-1 ring-black/5">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-[#f0f9ff] text-slate-900 text-[12px] font-black uppercase tracking-widest border-b border-sky-100">
                      <th className="py-6 px-4 text-left font-black">তারিখ</th>
                      <th className="py-6 px-2">ফজর</th>
                      <th className="py-6 px-2">জোহর</th>
                      <th className="py-6 px-2">আসর</th>
                      <th className="py-6 px-2">মাগরিব</th>
                      <th className="py-6 px-2">এশা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-800 text-[14px] font-black">
                    {monthlyDays.map((day) => (
                      <tr 
                        key={day.dayNumber} 
                        className={`transition-all duration-200 ${day.isToday ? 'bg-emerald-50 text-emerald-950 font-black shadow-inner' : 'hover:bg-slate-50'}`}
                      >
                        <td className="py-5 px-4 text-left whitespace-nowrap">
                           <div className="flex items-center gap-2.5">
                              <span>{day.dateStrBn}</span>
                              {day.isToday && (
                                 <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-[9px] text-white font-black animate-pulse">আজ</span>
                              )}
                           </div>
                        </td>
                        <td className="py-5 px-2">{day.fajr}</td>
                        <td className="py-5 px-2">{day.dhuhr}</td>
                        <td className="py-5 px-2">{day.asr}</td>
                        <td className="py-5 px-2">{day.maghrib}</td>
                        <td className="py-5 px-2">{day.isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 bg-slate-50 text-[11px] text-slate-500 text-center border-t border-slate-100 font-black flex items-center justify-center gap-2.5">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>ইসলামিক ফাউন্ডেশন অব বাংলাদেশের ক্যালেন্ডার অনুসারে</span>
              </div>
            </div>
          </div>
        ) : viewMode === 'quran' ? (
          <div className="px-2 sm:px-4 py-4">
            <QuranViewer 
              onBack={() => { setViewMode('daily'); setSelectedNiyatSearch(''); }} 
              onSurahActiveChange={(isSurahActive) => {
                isQuranSurahOpenRef.current = isSurahActive;
              }}
            />
          </div>
        ) : viewMode === 'hadith' ? (
          <div className="px-2 sm:px-4 py-4"><HadithViewer onBack={() => { setViewMode('daily'); setSelectedNiyatSearch(''); }} /></div>
        ) : viewMode === 'niyat' ? (
          <div className="px-2 sm:px-4 py-4"><PrayerNiyatViewer onBack={() => { setViewMode('daily'); setSelectedNiyatSearch(''); }} defaultSearch={selectedNiyatSearch} /></div>
        ) : viewMode === 'rules' ? (
          <div className="px-2 sm:px-4 py-4"><PrayerRulesViewer onBack={() => { setViewMode('daily'); setSelectedNiyatSearch(''); }} /></div>
        ) : viewMode === 'detail' ? (
          <div className="px-2 sm:px-4 py-4">
            <PrayerDetailPage 
              detail={selectedPrayerDetail} 
              onBack={() => { setViewMode('daily'); setSelectedPrayerDetail(null); }} 
              onOpenFullNiyat={(searchKey) => handleSwitchView('niyat', searchKey)} 
            />
          </div>
        ) : (
          <div className="px-1.5 sm:px-2 space-y-5 pb-32 animate-in fade-in duration-400">
            
            {/* PRAYER CARD (Dark Theme Adjusted & High Contrast) */}
            <div className="bg-gradient-to-br from-[#003d32] via-[#00352b] to-[#00221b] rounded-[28px] sm:rounded-[44px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-600/40 relative group text-white">
              <div className="p-4 sm:p-8 pb-4">
                {/* Header Row: Hijri & Gregorian Date in 1 Line */}
                <div className="flex items-center justify-between mb-5 sm:mb-7">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-[#002820] border border-emerald-600/40 flex items-center justify-center text-xl sm:text-2xl shadow-md shrink-0">🕋</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <h2 className="text-[15px] sm:text-[20px] font-black text-amber-300 tracking-tight leading-none whitespace-nowrap">
                          {hijri.formattedBn}
                        </h2>
                        <span className="text-emerald-400 font-bold hidden sm:inline">•</span>
                        <p className="text-[11.5px] sm:text-[14px] text-emerald-100/80 font-black tracking-tight whitespace-nowrap">
                          ({dayNameBn}, {dateBn} {monthNameBn}, {yearBn})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content: Current Waqt Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                   <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                      <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[32px] bg-[#002820] flex items-center justify-center text-3xl sm:text-6xl shadow-inner border border-emerald-600/40 shrink-0">
                         {activeCard.activeKey === 'fajr' ? '🕌' : activeCard.activeKey === 'sunrise' ? '🌅' : activeCard.activeKey === 'dhuhr' ? '🕌' : activeCard.activeKey === 'asr' ? '🕌' : activeCard.activeKey === 'maghrib' ? '🌇' : activeCard.activeKey === 'forbidden' ? '⚠️' : '🕌'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                           <span className="text-[11px] sm:text-[12px] font-black text-emerald-300 uppercase tracking-[0.15em] leading-none">এখন চলছে</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                           <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-sm leading-none">{activeCard.activeNameBn}</h1>
                           <span className="text-[12px] sm:text-[15px] text-amber-200/90 font-black">{activeCard.rangeBn}</span>
                           <span className="text-emerald-400 font-bold">•</span>
                           <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200/80">
                              <span className="text-amber-400">পরবর্তী:</span>
                              <span className="text-white font-black">{activeCard.nextNameBn}</span>
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-800/40">
                      <div className="text-2xl sm:text-5xl font-black text-amber-300 font-mono tracking-tighter drop-shadow-sm leading-none">{activeCard.countdownTimeBn}</div>
                      <p className="text-[11px] sm:text-[12px] font-black text-emerald-300 mt-1.5 sm:mt-2 flex items-center sm:justify-end gap-1.5 tracking-tight">
                        <span>{activeCard.countdownLabelBn}</span>
                      </p>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 sm:mt-6 mb-2 sm:mb-3">
                  <div className="h-2.5 sm:h-3 bg-[#002820] rounded-full overflow-hidden p-0.5 shadow-inner ring-1 ring-emerald-500/20">
                    <div 
                       className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                       style={{ width: `${Math.max(4, activeCard.progressPercent)}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Multi-Column Prayer Strip (Dark Theme High Contrast) */}
              <div className="grid grid-cols-5 border-t border-emerald-800/40 divide-x divide-emerald-800/40 bg-[#00241c]">
                {PRAYER_5_KEYS.map(p => {
                  const isActive = activeCard.activeKey === p.key;
                  return (
                    <div key={p.key} className={`py-3 px-0.5 text-center transition-all relative ${isActive ? 'bg-[#00382d] shadow-[inset_0_-2px_10px_rgba(52,211,153,0.2)]' : 'hover:bg-[#002f26]'}`}>
                      <p className={`text-[11px] sm:text-[12px] font-black mb-0.5 tracking-tight ${isActive ? 'text-amber-300' : 'text-emerald-100/60'}`}>{p.labelBn}</p>
                      <p className={`text-[13px] sm:text-[15px] font-black ${isActive ? 'text-white' : 'text-emerald-200/90'}`}>{activeCard.times5[p.key]}</p>
                      {isActive && (
                         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-8 sm:w-10 bg-amber-400 rounded-t-full shadow-[0_-2px_10px_rgba(251,191,36,0.5)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FULL MONTH CALENDAR BUTTON (Slimmer & Thinner) */}
            <button
              onClick={() => handleSwitchView('monthly')}
              className="w-full py-3 px-4 sm:px-6 rounded-[22px] bg-[#003d32] hover:bg-[#004d3f] border border-emerald-500/30 flex items-center justify-center gap-2.5 text-white font-black shadow-xl shadow-emerald-950/40 transition-all active:scale-[0.98] group overflow-hidden"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors shrink-0">
                 <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="tracking-tight text-[12.5px] sm:text-[15px] whitespace-nowrap">
                {BENGALI_MONTHS[calendarMonth]} মাসের নামাজ ক্যালেন্ডার দেখুন →
              </span>
            </button>

            {/* DAILY SCHEDULE (8 CARDS - PREMIUM GRID - Clicking any opens its Niyat & Details) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[12px] sm:text-[13px] font-black text-amber-400 flex items-center gap-2 uppercase tracking-[0.12em]">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>আজকের সালাত সূচি (নিয়ত দেখতে ক্লিক করুন)</span>
                </h3>
                <span className="text-[10.5px] font-black text-emerald-400 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-800/40 shadow-sm shrink-0">
                   {district.nameBn}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { icon: '🌙', label: 'তাহাজ্জুদ ও সাহরী', sub: 'সাহরীর শেষ সময়', time: timings.tahajjud, color: 'border-purple-800/30' },
                  { icon: '🌌', label: 'ফজর (Fajr)', sub: 'ওয়াক্ত শুরু', time: timings.fajr, color: 'border-emerald-800/30' },
                  { icon: '🌅', label: 'সূর্যোদয় (Sunrise)', sub: `ইশরাক: ${timings.ishraq}`, time: timings.sunrise, color: 'border-amber-800/30' },
                  { icon: '☀️', label: 'চাশত (দুহা)', sub: 'পূর্বাহ্ণ সালাত', time: timings.chasht, color: 'border-amber-800/30' },
                  { icon: '🕌', label: 'যুহর (Dhuhr)', sub: 'দুপুরের সালাত', time: timings.dhuhr, color: 'border-emerald-800/30' },
                  { icon: '🌤️', label: 'আসর (Asr)', sub: 'বিকেলের সালাত', time: timings.asr, color: 'border-emerald-800/30' },
                  { icon: '🌇', label: 'মাগরিব (Maghrib)', sub: `সূর্যাস্ত: ${timings.sunset}`, time: timings.maghrib, color: 'border-orange-800/30' },
                  { icon: '🌙', label: 'ইশা (Isha)', sub: 'রাতের সালাত', time: timings.isha, color: 'border-indigo-800/30' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleScheduleCardClick(item.label)}
                    className={`p-4 bg-gradient-to-br from-[#0b382f] to-[#06241e] rounded-[28px] border ${item.color} flex flex-col justify-between h-30 hover:from-[#0f453a] hover:to-[#0a332b] transition-all shadow-xl ring-1 ring-emerald-500/20 cursor-pointer active:scale-95 group/card`}
                  >
                    <div className="w-9 h-9 bg-[#002820] rounded-2xl flex items-center justify-center text-xl shadow-inner border border-emerald-600/40 group-hover/card:scale-110 transition-transform">{item.icon}</div>
                    <div>
                       <p className="text-[12px] font-black text-white leading-tight mb-0.5">{item.label}</p>
                       <p className="text-[10px] text-emerald-300 font-bold mb-1.5">{item.sub}</p>
                       <p className="text-[16px] font-black text-amber-300 drop-shadow-md leading-none">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ISLAMIC FEATURE HUB */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[12px] sm:text-[13px] font-black text-amber-400 flex items-center gap-2 uppercase tracking-[0.12em]">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>ইসলামিক জ্ঞান ও আমল সম্ভার</span>
                </h3>
                <span className="text-[10.5px] font-black text-emerald-400/80 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-800/40 shadow-sm shrink-0">
                  কোরআন, হাদিস ও নিয়ম কানুন
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
               <button onClick={() => handleSwitchView('quran')} className="bg-[#0b2b24] p-5 rounded-[32px] border border-emerald-800/40 text-left hover:bg-[#0f3d33] transition-all active:scale-95 group shadow-xl ring-1 ring-white/5">
                  <div className="w-12 h-12 bg-[#003d32] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg border border-emerald-800/50">📖</div>
                  <h4 className="text-[14.5px] font-black text-amber-300 tracking-tight leading-none">কোরআন শরিফ</h4>
                  <p className="text-[11.5px] text-emerald-100/60 font-bold mt-2 leading-tight opacity-80">বাংলা ও আরবি অনুবাদ</p>
               </button>
               <button onClick={() => handleSwitchView('hadith')} className="bg-[#0b2b24] p-5 rounded-[32px] border border-emerald-800/40 text-left hover:bg-[#0f3d33] transition-all active:scale-95 group shadow-xl ring-1 ring-white/5">
                  <div className="w-12 h-12 bg-[#003d32] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg border border-emerald-800/50">📜</div>
                  <h4 className="text-[14.5px] font-black text-emerald-300 tracking-tight leading-none">সহীহ হাদিস</h4>
                  <p className="text-[11.5px] text-emerald-100/60 font-bold mt-2 leading-tight opacity-80">বুখারী ও মুসলিম</p>
               </button>
               <button onClick={() => handleSwitchView('niyat')} className="bg-[#0b2b24] p-5 rounded-[32px] border border-emerald-800/40 text-left hover:bg-[#0f3d33] transition-all active:scale-95 group shadow-xl ring-1 ring-white/5">
                  <div className="w-12 h-12 bg-[#003d32] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg border border-emerald-800/50">🤲</div>
                  <h4 className="text-[14.5px] font-black text-cyan-300 tracking-tight leading-none">নামাজের নিয়ত</h4>
                  <p className="text-[11.5px] text-emerald-100/60 font-bold mt-2 leading-tight opacity-80">সকল ওয়াক্ত ও নফল</p>
               </button>
               <button onClick={() => handleSwitchView('rules')} className="bg-[#0b2b24] p-5 rounded-[32px] border border-emerald-800/40 text-left hover:bg-[#0f3d33] transition-all active:scale-95 group shadow-xl ring-1 ring-white/5">
                  <div className="w-12 h-12 bg-[#003d32] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg border border-emerald-800/50">🧭</div>
                  <h4 className="text-[14.5px] font-black text-amber-400 tracking-tight leading-none">নিয়ম কানুন</h4>
                  <p className="text-[11.5px] text-emerald-100/60 font-bold mt-2 leading-tight opacity-80">অযু, ফরজ ও ওয়াজিব</p>
               </button>
            </div>
          </div>

            {/* FEATURED CONTENT (Request 6 - Bottom of the page) */}
            <div className="space-y-6 pt-4">
               <div className="bg-gradient-to-br from-[#003d32] to-[#001d18] rounded-[44px] p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                     <BookOpen className="w-24 h-24 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                     <Sparkles className="w-5 h-5 text-amber-400" />
                     <h3 className="text-[14px] font-black text-amber-200 uppercase tracking-widest">আজকের বিশেষ আয়াত</h3>
                  </div>
                  <p className="text-[19px] font-bold text-emerald-50 leading-relaxed mb-6 font-serif">
                     "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।"
                  </p>
                  <div className="flex items-center justify-between">
                     <span className="text-[12px] font-black text-emerald-400/80 tracking-tight">— সূরা আলাম নাশরাহ, আয়াত: ৬</span>
                     <button onClick={() => handleSwitchView('quran')} className="text-[12px] font-black text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors">
                        পুরো কোরআন পড়ুন <ArrowLeft className="w-3 h-3 rotate-180" />
                     </button>
                  </div>
               </div>

               <div className="bg-[#0b2b24] rounded-[44px] p-8 border border-emerald-800/40 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                     <HeartHandshake className="w-5 h-5 text-emerald-400" />
                     <h3 className="text-[14px] font-black text-emerald-300 uppercase tracking-widest">আজকের নির্বাচিত হাদিস</h3>
                  </div>
                  <p className="text-[16px] font-bold text-slate-100 leading-relaxed mb-6">
                     "তোমাদের মধ্যে সেই ব্যক্তিই উত্তম, যে তার পরিবারের নিকট উত্তম।"
                  </p>
                  <div className="flex items-center justify-between">
                     <span className="text-[12px] font-black text-emerald-100/40 tracking-tight">— সহীহ ইবনে মাজাহ</span>
                     <button onClick={() => handleSwitchView('hadith')} className="text-[12px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                        আরও হাদিস দেখুন <ArrowLeft className="w-3 h-3 rotate-180" />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
           <Check className="w-5 h-5" />
           <p className="text-xs font-bold">{toastMsg}</p>
        </div>
      )}

      {/* District Picker Modal (Premium Luxury Islamic Design) */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-300">
           <div className="bg-gradient-to-br from-[#002b23] via-[#00221c] to-[#001712] text-white w-full max-w-lg rounded-[36px] sm:rounded-[44px] overflow-hidden flex flex-col max-h-[90vh] shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-emerald-500/30 relative">
              
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

              {/* Modal Top Header */}
              <div className="p-5 sm:p-6 border-b border-emerald-800/40 bg-[#002820]/95 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
                 <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#001913] border border-emerald-600/40 flex items-center justify-center text-xl shadow-inner text-amber-400">
                       📍
                    </div>
                    <div>
                       <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">জেলা নির্বাচন করুন</h3>
                       <p className="text-xs text-amber-400/90 font-bold mt-0.5">
                          ৬৪টি জেলার ভৌগোলিক সময়সূচী
                       </p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsPickerOpen(false)} 
                   className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90 border border-white/15 shadow-md cursor-pointer"
                 >
                    <X className="w-5 h-5 stroke-[2.5]" />
                 </button>
              </div>

              {/* Controls Section: Live GPS + Search Box + Division Chips */}
              <div className="p-4 sm:p-5 bg-[#00221c]/90 border-b border-emerald-900/40 space-y-3.5">
                 {/* Live GPS Auto-Detect Button */}
                 <button
                   onClick={handleAutoDetect}
                   disabled={isAutoLocating}
                   className="w-full py-3.5 px-4 rounded-[22px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all active:scale-[0.98] cursor-pointer"
                 >
                    <Navigation className={`w-4.5 h-4.5 text-amber-300 ${isAutoLocating ? 'animate-spin' : ''}`} />
                    <span>{isAutoLocating ? 'লাইভ GPS দ্বারা জেলা সনাক্ত হচ্ছে...' : '📍 লাইভ GPS অবস্থান সনাক্ত করুন'}</span>
                 </button>

                 {/* Search Input Box */}
                 <div className="relative group">
                    <Search className="absolute left-4 top-[14px] w-5 h-5 text-emerald-400 group-focus-within:text-amber-300 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="জেলা বা বিভাগের নাম লিখুন..." 
                      value={districtSearch}
                      onChange={e => setDistrictSearch(e.target.value)}
                      className="w-full pl-11 pr-10 py-3 bg-[#001712] border border-emerald-700/50 rounded-[20px] text-sm text-white font-bold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-emerald-100/40"
                      autoFocus
                    />
                    {districtSearch && (
                      <button
                        onClick={() => setDistrictSearch('')}
                        className="absolute right-3.5 top-[14px] text-emerald-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                 </div>

                 {/* Division Filter Chips */}
                 <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-black">
                    {BANGLADESH_DIVISIONS.map((divName) => {
                      const isActive = selectedDivision === divName;
                      return (
                        <button
                          key={divName}
                          onClick={() => {
                            sounds.playTap();
                            setSelectedDivision(divName);
                          }}
                          className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all border cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md shadow-amber-400/20 scale-105'
                              : 'bg-[#001d18] text-emerald-200/80 border-emerald-800/40 hover:bg-white/10'
                          }`}
                        >
                          {divName === 'সব' ? 'সকল বিভাগ' : `${divName} বিভাগ`}
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* District Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-none space-y-2.5">
                 {filteredDistricts.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                       <div className="w-16 h-16 bg-[#001712] rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-800/40">🔍</div>
                       <p className="text-sm text-emerald-200/60 font-black">কোনো জেলা খুঁজে পাওয়া যায়নি</p>
                    </div>
                 ) : (
                    filteredDistricts.map((d, idx) => {
                       const isSelected = district.nameEn === d.nameEn;
                       return (
                          <button 
                             key={d.nameEn}
                             onClick={() => handleSelectDistrict(d)}
                             className={`w-full p-4 rounded-[24px] text-left flex items-center justify-between transition-all duration-200 group active:scale-[0.98] border cursor-pointer ${
                               isSelected 
                                 ? 'bg-gradient-to-r from-[#004d3f] to-[#00382d] border-amber-400/80 text-white shadow-xl shadow-emerald-950/60 ring-1 ring-amber-400/40' 
                                 : 'bg-[#00241c] hover:bg-[#003328] border-emerald-800/40 text-emerald-100'
                             }`}
                             style={{ animationDelay: `${idx * 10}ms` }}
                          >
                             <div className="flex items-center gap-3.5 min-w-0">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border ${
                                  isSelected ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold' : 'bg-[#001913] text-amber-400 border-emerald-700/40'
                                }`}>
                                   📍
                                </div>
                                <div className="min-w-0">
                                   <div className="flex items-center gap-2">
                                      <span className={`text-base font-black truncate ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'}`}>
                                         {d.nameEn} ({d.nameBn})
                                      </span>
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-bold text-emerald-200/70 mt-0.5">
                                      <span className="px-2 py-0.5 rounded-md bg-[#001913] border border-emerald-800/40 text-[10.5px]">
                                         {d.divisionBn} বিভাগ
                                      </span>
                                      {isSelected && (
                                         <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider">• নির্ধারিত জেলা</span>
                                      )}
                                   </div>
                                </div>
                             </div>

                             {isSelected ? (
                                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
                                   <Check className="w-5 h-5 stroke-[3]" />
                                </div>
                             ) : (
                                <div className="w-8 h-8 rounded-full bg-[#001913] text-emerald-400 group-hover:bg-emerald-800/40 flex items-center justify-center transition-all border border-emerald-800/40 shrink-0">
                                   <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                                </div>
                             )}
                          </button>
                       );
                    })
                 )}
              </div>

              {/* Modal Bottom Status Bar */}
              <div className="p-3.5 bg-[#001a14] text-center border-t border-emerald-800/40 text-xs font-black text-amber-300/90 flex items-center justify-center gap-2 shrink-0">
                 <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                 <span>৬৪টি জেলার নির্ভুল সময়সূচী • {filteredDistricts.length}টি জেলা প্রদর্শিত</span>
              </div>
           </div>
        </div>
      )}


    </div>
  );
};
