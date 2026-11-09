import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  RefreshCw, 
  Sun, 
  CloudRain, 
  Cloud, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Sunrise, 
  Sunset, 
  Umbrella,
  ShieldAlert,
  Sparkles,
  Search,
  Check,
  Navigation,
  BellRing,
  X,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { 
  WeatherData, 
  DailyForecast, 
  fetchLiveWeather, 
  ALL_BANGLADESH_DISTRICTS, 
  BANGLADESH_DIVISIONS,
  setUserPreferredDistrict,
  clearUserPreferredDistrict,
  getUserPreferredDistrict,
  DistrictInfo
} from '../utils/weatherService';
import { buildWeatherNotification, getCurrentSlot } from '../utils/weatherNotificationService';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface WeatherModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  isAdmin?: boolean;
  onSendWeatherNotification?: (notif: NotificationItem) => void;
  onLocationChanged?: () => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({ 
  isOpen, 
  lang, 
  onClose,
  isAdmin = false,
  onSendWeatherNotification,
  onLocationChanged
}) => {
  const isBn = lang === 'bn';
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLocating, setIsAutoLocating] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  
  // District Switcher Modal State
  const [isDistrictPickerOpen, setIsDistrictPickerOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('সব');
  const [notificationSentToast, setNotificationSentToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Live real-time clock ticking every second
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadWeather = async (force = false, ignorePreferred = false) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeather(force, ignorePreferred);
      setWeather(data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const weatherContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWeather(false, false);
      if (weatherContainerRef.current) {
        weatherContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Filter 64 districts by search and division with exact matching
  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    return ALL_BANGLADESH_DISTRICTS.filter(d => {
      const matchDivision = selectedDivision === 'সব' || d.divisionBn === selectedDivision;
      const matchSearch = !q || 
        d.nameBn.toLowerCase().includes(q) || 
        d.nameEn.toLowerCase().includes(q) || 
        d.divisionBn.toLowerCase().includes(q);
      return matchDivision && matchSearch;
    });
  }, [districtSearch, selectedDivision]);

  const handleSelectDistrict = (district: DistrictInfo) => {
    sounds.playTap();
    setUserPreferredDistrict(district.nameBn);
    setIsDistrictPickerOpen(false);
    loadWeather(true, false);
    if (onLocationChanged) onLocationChanged();
  };

  const handleAutoDetect = async () => {
    sounds.playTap();
    setIsAutoLocating(true);
    setIsDistrictPickerOpen(false);
    setIsLoading(true);
    setToastMsg(isBn ? 'ডিভাইসের লাইভ GPS সনাক্ত করা হচ্ছে...' : 'Detecting live GPS...');
    try {
      const data = await fetchLiveWeather(true, true);
      setWeather(data);
      setUserPreferredDistrict(data.cityBn);
      setToastMsg(isBn ? `সফলভাবে ডিভাইস GPS সনাক্ত হয়েছে: ${data.cityBn} (${data.divisionBn})` : `Location detected: ${data.cityEn}`);
      setTimeout(() => setToastMsg(''), 4000);
      if (onLocationChanged) onLocationChanged();
    } catch {
      setToastMsg(isBn ? 'GPS সনাক্ত করতে সমস্যা হয়েছে' : 'GPS detection failed');
      setTimeout(() => setToastMsg(''), 3000);
    } finally {
      setIsLoading(false);
      setIsAutoLocating(false);
    }
  };

  const handleBroadcastWeatherBulletin = () => {
    if (!weather || !onSendWeatherNotification) return;
    sounds.playSuccess();
    const nowHour = new Date().getHours();
    const slot = getCurrentSlot(nowHour);
    const isStormAlert = weather.conditionType === 'thunder' || 
      (weather.conditionType === 'rain' && weather.rainProbability >= 50) || 
      weather.windSpeed >= 25;
    const notif = buildWeatherNotification(weather, slot, isStormAlert, true);
    onSendWeatherNotification(notif);
    setNotificationSentToast(true);
    setTimeout(() => setNotificationSentToast(false), 3500);
  };

  // Handle hardware device/browser back button & Escape key inside WeatherModal
  useEffect(() => {
    if (!isOpen) return;

    const handleModalPopState = (e: PopStateEvent) => {
      if (isDistrictPickerOpen) {
        e.stopImmediatePropagation();
        setIsDistrictPickerOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDistrictPickerOpen) {
          setIsDistrictPickerOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('popstate', handleModalPopState, true);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleModalPopState, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDistrictPickerOpen, onClose]);

  if (!isOpen) return null;

  const currentCondition = weather?.conditionType || 'sun';
  const activeDay: DailyForecast | undefined = weather?.daily[selectedDayIndex] || weather?.daily[0];
  const preferred = getUserPreferredDistrict();

  // Real-time Bengali date & 12-hour clock string
  const daysBnFull = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const dayNameBn = daysBnFull[currentTime.getDay()];
  const dateBn = toBengaliNumber(currentTime.getDate());
  const monthNameBn = monthsBn[currentTime.getMonth()];
  const yearBn = toBengaliNumber(currentTime.getFullYear());
  
  const h = currentTime.getHours();
  const m = currentTime.getMinutes();
  const s = currentTime.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const time12Str = `${toBengaliNumber(h12 < 10 ? '0' + h12 : h12)}:${toBengaliNumber(m < 10 ? '0' + m : m)}:${toBengaliNumber(s < 10 ? '0' + s : s)} ${ampm}`;

  return (
    <div ref={weatherContainerRef} className="fixed inset-0 z-50 bg-slate-900 text-white select-none flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
      {/* Dynamic Animated Atmospheric Background */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-700 ${
        currentCondition === 'rain'
          ? 'bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950'
          : currentCondition === 'thunder'
            ? 'bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900'
            : currentCondition === 'cloud'
              ? 'bg-gradient-to-b from-slate-800 via-sky-900 to-slate-900'
              : 'bg-gradient-to-b from-amber-600/90 via-orange-600 to-sky-900'
      }`}>
        {/* Animated Sunbeam */}
        {currentCondition === 'sun' && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amber-400 blur-3xl animate-pulse" />
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-yellow-300/40 blur-2xl animate-spin [animation-duration:35s]" />
          </div>
        )}

        {/* Drifting Clouds */}
        {currentCondition === 'cloud' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-12 left-[-20%] w-72 h-24 bg-white/20 rounded-full blur-xl animate-[cloudDrift_25s_linear_infinite]" />
            <div className="absolute top-36 left-[-30%] w-96 h-28 bg-white/15 rounded-full blur-2xl animate-[cloudDrift_40s_linear_infinite]" />
          </div>
        )}

        {/* CSS Raindrops & Lightning */}
        {(currentCondition === 'rain' || currentCondition === 'thunder') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="rain-container">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="raindrop"
                  style={{
                    left: `${(i * 3.1).toFixed(1)}%`,
                    animationDelay: `${(i * 0.11).toFixed(2)}s`,
                    animationDuration: `${0.8 + (i % 5) * 0.1}s`
                  }}
                />
              ))}
            </div>
            {currentCondition === 'thunder' && (
              <div className="absolute inset-0 bg-white/10 animate-[lightning_5s_infinite] pointer-events-none" />
            )}
          </div>
        )}
      </div>



      {/* Top Header Bar with Widescreen Desktop Container */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/30">
        <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all items-center justify-center text-white backdrop-blur-md border border-white/20 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-sm">
                  {weather?.cityBn || 'ঢাকা'}
                </h2>
                {weather?.divisionBn && (
                  <span className="text-xs text-white/70 font-semibold">
                    ({weather.divisionBn} বিভাগ)
                  </span>
                )}
              </div>

              {/* Real-Time Date & Ticking 12-Hour Clock */}
              <div className="flex items-center gap-1.5 text-[11px] text-amber-200 font-bold mt-0.5">
                <Clock className="w-3 h-3 text-amber-300 animate-pulse shrink-0" />
                <span>{dayNameBn}, {dateBn} {monthNameBn} {yearBn} • {time12Str}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto GPS Location Refresh Button */}
            <button
              onClick={handleAutoDetect}
              disabled={isAutoLocating || isLoading}
              className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              title={isBn ? 'রিয়েল-টাইম লোকেশন অটো সনাক্ত করুন' : 'Auto Detect Location'}
            >
              <Navigation className={`w-3.5 h-3.5 ${isAutoLocating ? 'animate-spin text-amber-300' : ''}`} />
              <span className="hidden sm:inline">{isBn ? 'অটো লোকেশন' : 'Auto GPS'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => {
                sounds.playTap();
                loadWeather(true, false);
              }}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center text-white backdrop-blur-md border border-white/20 cursor-pointer"
              title={isBn ? 'রিফ্রেশ করুন' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-300' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Broadcast Success Toast */}
      {notificationSentToast && (
        <div className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-md p-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold">{isBn ? 'আবহাওয়া বার্তা অ্যাপ নোটিফিকেশনে পাঠানো হয়েছে!' : 'Weather bulletin sent to notifications!'}</p>
            <p className="text-emerald-100 text-[11px]">{isBn ? 'সকল ব্যবহারকারী ও নোটিফিকেশন সেন্টারে প্রদর্শিত হচ্ছে।' : 'Visible to all users in the notifications center.'}</p>
          </div>
        </div>
      )}

      {/* Location Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-md p-3.5 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Check className="w-5 h-5" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Content Container - Full Screen PC Responsive 2-Column Grid */}
      <div className="relative z-10 flex-1 px-4 py-6 max-w-5xl xl:max-w-6xl mx-auto w-full space-y-6 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Today's Hero Card & Metrics & Advisories (LG 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Hero Today Weather Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/15">
                      {isBn ? 'আজকের আবহাওয়া' : "Today's Weather"}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setIsDistrictPickerOpen(true);
                      }}
                      className="text-[11px] font-bold text-rose-300 hover:text-white flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-full border border-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{weather?.cityBn || 'জেলা পরিবর্তন'}</span>
                    </button>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-lg">
                      {toBengaliNumber(weather?.currentTemp ?? 29)}
                    </span>
                    <span className="text-3xl sm:text-4xl font-bold text-rose-300">°C</span>
                  </div>

                  {/* Condition Title */}
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 drop-shadow-md">
                    {weather?.conditionBn || 'পরিষ্কার আকাশ'}
                  </p>
                  <p className="text-xs text-white/80 mt-1 font-medium leading-relaxed">
                    {isBn
                      ? `অনুভূত তাপমাত্রা ${toBengaliNumber(weather?.apparentTemp ?? 31)}°C • সর্বোচ্চ ${toBengaliNumber(weather?.daily[0]?.tempMax ?? 33)}° / সর্বনিম্ন ${toBengaliNumber(weather?.daily[0]?.tempMin ?? 23)}°`
                      : `Feels like ${weather?.apparentTemp ?? 31}°C • High ${weather?.daily[0]?.tempMax ?? 33}° / Low ${weather?.daily[0]?.tempMin ?? 23}°`}
                  </p>
                </div>

                {/* Weather Condition Icon */}
                <div className="relative flex items-center justify-center p-3 shrink-0">
                  {currentCondition === 'sun' ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
                      <Sun className="w-20 h-20 text-amber-300 animate-[spinSlow_20s_linear_infinite] drop-shadow-lg" />
                    </div>
                  ) : currentCondition === 'rain' ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full bg-sky-400/30 blur-xl" />
                      <CloudRain className="w-20 h-20 text-sky-200 animate-bounce [animation-duration:3s] drop-shadow-lg" />
                    </div>
                  ) : currentCondition === 'thunder' ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full bg-purple-400/30 blur-xl animate-pulse" />
                      <CloudLightning className="w-20 h-20 text-yellow-300 animate-pulse drop-shadow-lg" />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full bg-white/20 blur-xl" />
                      <Cloud className="w-20 h-20 text-sky-100 animate-pulse drop-shadow-lg" />
                    </div>
                  )}
                </div>
              </div>

              {/* Key Metrics Grid (4 items) */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/15">
                <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 font-semibold">{isBn ? 'বাতাসে আর্দ্রতা' : 'Humidity'}</p>
                    <p className="text-xs font-extrabold text-white">{toBengaliNumber(weather?.humidity ?? 68)}%</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 font-semibold">{isBn ? 'বাতাসের গতি' : 'Wind Speed'}</p>
                    <p className="text-xs font-extrabold text-white">{toBengaliNumber(weather?.windSpeed ?? 11)} কিমি/ঘণ্টা</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <Umbrella className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 font-semibold">{isBn ? 'বৃষ্টির সম্ভাবনা' : 'Rain Chance'}</p>
                    <p className="text-xs font-extrabold text-white">{toBengaliNumber(weather?.rainProbability ?? 15)}%</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Sunrise className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/70 font-semibold">{isBn ? 'সূর্যোদয় / সূর্যাস্ত' : 'Sun Times'}</p>
                    <p className="text-[10px] font-extrabold text-white">{weather?.daily[0]?.sunrise || '০৫:৫৬ AM'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Officers Weather & Technical Operational Advisory Banner */}
            {(() => {
              const cond = currentCondition;
              const wind = weather?.windSpeed ?? 0;
              const rainP = weather?.rainProbability ?? 0;
              const temp = weather?.currentTemp ?? 28;
              const isDay = weather?.isDay ?? true;

              const isSevereStorm = cond === 'thunder' || wind >= 25 || rainP >= 70;
              const isRainy = cond === 'rain' || rainP >= 40;
              const isExtremeHeat = temp >= 34;
              const isNight = !isDay;

              let bannerBg = 'bg-gradient-to-r from-[#0d3b2e] via-[#0f4d3d] to-[#0a2e24] border-emerald-500/40 shadow-xl shadow-emerald-950/40';
              let badgeBg = 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40';
              let badgeText = '✅ কাজের জন্য ১০০% অনুকূল';
              let titleText = '🌿 মাঠ কর্মকর্তা ও টেকনিক্যাল টিম আবহাওয়া নির্দেশিকা';
              let summaryText = `আজ ${weather?.cityBn || 'আপনার জেলায়'} আবহাওয়া সম্পূর্ণ অনুকূলে রয়েছে। মাঠ কর্মকর্তা ও টেকনিক্যাল লাইন টিম নিরাপদে অপটিক্যাল ফাইবার নেটওয়ার্ক রক্ষণাবেক্ষণ, নতুন ইন্টারনেট সংযোগ প্রদান এবং ওভারহেড পোল ওয়ার্ক সম্পন্ন করতে পারবেন।`;
              let tips: string[] = [
                'আজ ফাইবার ড্রপ ক্যাবল টানানো, ক্লিভিং, ফিউশন স্লাইসিং ও স্প্লিটার মেরামতের কাজ নির্বিঘ্নে সম্পন্ন করা যাবে।',
                'টেকনিক্যাল টিমকে পোল ওয়ার্কের সময় স্ট্যান্ডার্ড সেফটি বেল্ট, হেলমেট ও ইনসুলেটেড গ্লাভস ব্যবহারের অনুরোধ রইলো।',
                'ফাইবার অপটিক ব্যাকবোন ব্যান্ডউইথ ও সিগন্যাল কোয়ালিটি সম্পূর্ণ স্বাভাবিক ও নিখুঁত রয়েছে।'
              ];
              let icon = <Wifi className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />;

              if (isSevereStorm) {
                bannerBg = 'bg-gradient-to-r from-rose-950/90 via-amber-950/80 to-red-950/90 border-rose-500/50 shadow-2xl shadow-rose-950/60 animate-pulse';
                badgeBg = 'bg-rose-500/30 text-rose-200 border-rose-400/50';
                badgeText = '⚠️ পোল কাজ স্থগিত রাখুন';
                titleText = '⚡ কালবৈশাখী, তীব্র বাতাস ও বজ্রপাত সতর্কবার্তা';
                summaryText = 'মাঠ পর্যায় ও ওভারহেড ফাইবারে নিয়োজিত সকল মাঠ কর্মকর্তা ও লাইন টেকনিশিয়ানদের সতর্ক করা হচ্ছে। কালবৈশাখী, অতিরিক্ত বাতাসের বেগ ও বজ্রপাতের আশঙ্কায় উঁচুতে পোল বা ধাতব টাওয়ারের কাজ সাময়িকভাবে স্থগিত রাখুন।';
                tips = [
                  'উঁচুতে (পোল বা টাওয়ারে) ফাইবার স্প্লাইসিং ও ড্রপ ক্যাবল টানানোর ঝুঁকি এড়িয়ে নিরাপদ ছায়ায় অবস্থান নিন।',
                  'বজ্রপাতের সময় ফাইবার ফিউশন স্প্লাইসার ও ওটিডিআর মেজারিং কিট শুষ্ক ব্যাগে পাওয়ার অফ করে রাখুন।',
                  'জরুরি গ্রাহক সংযোগ ও বিদ্যুৎ সুরক্ষায় ইনসুলেটেড গ্লাভস ও পাওয়ার ব্রেকার নিরাপত্তা নিশ্চিত করুন।'
                ];
                icon = <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5 animate-bounce" />;
              } else if (isRainy) {
                bannerBg = 'bg-gradient-to-r from-sky-950/90 via-blue-950/80 to-slate-950/90 border-sky-500/40 shadow-xl shadow-sky-950/40';
                badgeBg = 'bg-sky-500/25 text-sky-200 border-sky-400/40';
                badgeText = '🌧️ রেইনকোট ও সেফটি গিয়ার পরিধান করুন';
                titleText = '🌧️ বৃষ্টি ও আর্দ্র আবহাওয়া নির্দেশিকা (ফিল্ড অফিসার)';
                summaryText = 'মাঝারি বা ভারী বৃষ্টির সম্ভাবনায় মাঠ কর্মকর্তা ও ফিল্ড ইঞ্জিনিয়ারদের ওয়াটারপ্রুফ রেইনকোট, ইনসুলেটেড গামবুট ও প্রোটেক্টিভ টুলস কিট সাথে রাখার নির্দেশ দেওয়া হচ্ছে।';
                tips = [
                  'ফাইবার জয়েন্ট ক্লোজার ও ফিউশন স্প্লাইসিং ট্রের ভেতরে পানি ও আর্দ্রতা প্রবেশ থেকে রক্ষা করুন।',
                  'পিচ্ছিল পোল বা গাছে ওঠার পূর্বে গ্রিপিং নিরাপত্তা ও সেফটি লক গ্রিপ শতভাগ নিশ্চিত করুন।',
                  'গ্রাহক প্রান্তে রাউটার ও অনইউ (ONU) পাওয়ার এডাপ্টার যেন সিক্ত না হয় সেদিকে খেয়াল রাখুন।'
                ];
                icon = <CloudRain className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />;
              } else if (isExtremeHeat) {
                bannerBg = 'bg-gradient-to-r from-amber-950/90 via-orange-950/80 to-amber-900/90 border-amber-500/40 shadow-xl';
                badgeBg = 'bg-amber-500/25 text-amber-200 border-amber-400/40';
                badgeText = '☀️ তাপদাহ ও পর্যাপ্ত বিশ্রাম';
                titleText = '☀️ তীব্র তাপদাহ ও রোদ সেফটি নির্দেশিকা';
                summaryText = 'মাঠ পর্যায়ে কড়া রোদে কাজ করার সময় টেকনিক্যাল অফিসার ও লাইনম্যানদের পর্যাপ্ত খাবার পানি পান করা ও ছায়ায় সংক্ষিপ্ত বিরতি নিয়ে কাজ করার পরামর্শ দেওয়া হচ্ছে।';
                tips = [
                  'ওটিডিআর (OTDR), অপটিক্যাল পাওয়ার মিটার ও লেজার স্প্লাইসার অতিরিক্ত উত্তাপ থেকে ছায়ায় রাখুন।',
                  'মাঠ কর্মকর্তারা তীব্র দুপুরে কাজের মাঝে ছায়াযুক্ত স্থানে পর্যাপ্ত হাইড্রেশন ও স্যালাইন গ্রহণ করুন।'
                ];
                icon = <Sun className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />;
              } else if (isNight) {
                bannerBg = 'bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border-indigo-500/40 shadow-xl';
                badgeBg = 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40';
                badgeText = '🌙 হেডল্যাম্প ও রিফ্লেক্টিভ জ্যাকেট ব্যবহার করুন';
                titleText = '🌙 রাতের ফিল্ড কাজ ও অন-কল নাইট শিফটিং গাইড';
                summaryText = 'রাতের বেলায় ফাইবার নেটওয়ার্ক মেরামত বা জরুরি লিঙ্ক ডাউন হলে অন-কল নাইট শিফটে রিফ্লেক্টিভ সেফটি জ্যাকেট ও শক্তিশালী হেডল্যাম্প ব্যবহার করে কাজ পরিচালনা করুন।';
                tips = [
                  'সড়কের পাশে কাজ করার সময় ট্রাফিক সংকেত আলো ও উজ্জ্বল রিফ্লেক্টিভ মার্কিং ফিতা ব্যবহার করুন।',
                  'নাইট শিফটের টেকনিক্যাল অফিসাররা সেন্ট্রাল কন্ট্রোল রুম ও হেল্পলাইনের সাথে সার্বক্ষণিক সমন্বয়ে থাকুন।'
                ];
                icon = <Clock className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />;
              }

              return (
                <div className={`p-5 rounded-[28px] backdrop-blur-xl border space-y-3 transition-all ${bannerBg}`}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      {icon}
                      <h4 className="font-black text-white text-[15px] sm:text-base tracking-tight drop-shadow-md">
                        {titleText}
                      </h4>
                    </div>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm ${badgeBg}`}>
                      {badgeText}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-white/95 font-medium leading-relaxed">
                    {summaryText}
                  </p>

                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🛠️ মাঠ কর্মকর্তাদের সেফটি ও ফিল্ড ওয়ার্ক নির্দেশিকা:</span>
                    </p>
                    <ul className="space-y-1.5 pl-1">
                      {tips.map((tip, idx) => (
                        <li key={idx} className="text-[11.5px] text-emerald-100/95 font-semibold flex items-start gap-2">
                          <span className="text-amber-400 shrink-0 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* Action: Weather Notification Broadcast - STRICTLY ADMIN CONTROLLED */}
            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{isBn ? 'স্বয়ংক্রিয় আবহাওয়া বুলেটিন' : 'Automated Weather Alerts'}</p>
                    {isAdmin ? (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                        {isBn ? 'অ্যাডমিন নিয়ন্ত্রণ' : 'Admin Control'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {isBn ? 'অটো বার্তা সক্রিয়' : 'Auto Alert Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/70 font-normal mt-0.5">
                    {isAdmin
                      ? (isBn ? 'দিনে ৭-৯ বার ও দুর্যোগে বার্তা পাঠায়। আপনি এখনই ম্যানুয়াল ব্রডকাস্ট করতে পারেন।' : 'Auto updates sent 7-9 times daily & during severe weather. Admin can broadcast manually.')
                      : (isBn ? 'প্রতিদিন লোকেশন অনুসারে সিস্টেম স্বয়ংক্রিয়ভাবে আবহাওয়া বার্তা পাঠায়।' : 'The system automatically broadcasts updates daily.')}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={handleBroadcastWeatherBulletin}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <BellRing className="w-4 h-4" />
                  <span>{isBn ? 'আবহাওয়া বার্তা পাঠান' : 'Broadcast Now'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: 7-Day Forecast & Expanded Details (LG 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 7-Day Forecast Section Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-300" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isBn ? `৭ দিনের আবহাওয়া পূর্বাভাস (${weather?.cityBn})` : '7-Day Forecast'}
                </h3>
              </div>
              <span className="text-xs text-white/65 font-semibold">
                {isBn ? 'ক্লিক করে প্রতিদিনের তথ্য দেখুন' : 'Click day for details'}
              </span>
            </div>

            {/* 7-Day Cards List */}
            <div className="space-y-2.5">
              {weather?.daily.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <div
                    key={day.date}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedDayIndex(idx);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white/20 border-white/40 shadow-xl scale-[1.01]'
                        : 'bg-black/30 hover:bg-black/40 border-white/10'
                    }`}
                  >
                    {/* Day & Condition */}
                    <div className="flex items-center gap-3.5 min-w-[140px]">
                      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        {day.conditionType === 'sun' ? (
                          <Sun className="w-5 h-5 text-amber-300" />
                        ) : day.conditionType === 'rain' ? (
                          <CloudRain className="w-5 h-5 text-sky-300" />
                        ) : day.conditionType === 'thunder' ? (
                          <CloudLightning className="w-5 h-5 text-yellow-300" />
                        ) : (
                          <Cloud className="w-5 h-5 text-slate-200" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">
                          {isBn ? day.dayNameBn : day.dayNameEn}
                        </p>
                        <p className="text-xs text-white/70 mt-0.5">
                          {day.conditionBn}
                        </p>
                      </div>
                    </div>

                    {/* Rain Probability Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-xs font-bold text-sky-200">
                      <Droplets className="w-3.5 h-3.5 text-sky-300" />
                      <span>{toBengaliNumber(day.precipitationProb)}%</span>
                    </div>

                    {/* Temperature Range */}
                    <div className="text-right">
                      <span className="font-black text-white text-base">
                        {toBengaliNumber(day.tempMax)}°
                      </span>
                      <span className="text-white/50 ml-1.5 text-xs font-semibold">
                        / {toBengaliNumber(day.tempMin)}°C
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Expanded Detail Card */}
            {activeDay && (
              <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-md border border-white/15 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs sm:text-sm">
                  <span className="font-bold text-rose-300">
                    {isBn ? `${activeDay.dayNameBn} বিস্তারিত পূর্বাভাস (${activeDay.conditionBn})` : `${activeDay.dayNameEn} Details`}
                  </span>
                  <span className="text-white/60 font-mono text-xs">
                    {activeDay.date}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center pt-1 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-white/60 block font-medium">{isBn ? 'সর্বোচ্চ তাপমাত্রা' : 'Max Temp'}</span>
                    <span className="font-black text-amber-300 text-base mt-0.5 block">{toBengaliNumber(activeDay.tempMax)}°C</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-white/60 block font-medium">{isBn ? 'বৃষ্টির পরিমাণ' : 'Rain Sum'}</span>
                    <span className="font-black text-sky-300 text-base mt-0.5 block">{toBengaliNumber(activeDay.precipitationSum)} মিমি</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-white/60 block font-medium">{isBn ? 'সূর্যাস্তের সময়' : 'Sunset'}</span>
                    <span className="font-black text-rose-200 text-base mt-0.5 block">{activeDay.sunset}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* 64 Districts Picker Modal */}
      {isDistrictPickerOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-sm font-bold text-white">{isBn ? 'বাংলাদেশের জেলা নির্বাচন করুন' : 'Select District'}</h3>
                  <p className="text-[11px] text-slate-400">{isBn ? '৬৪ জেলার রিয়েল-টাইম আবহাওয়া ও পূর্বাভাস' : '64 Districts of Bangladesh'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDistrictPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-detect button */}
            <div className="p-3 bg-slate-800/50 border-b border-slate-800 flex gap-2">
              <button
                onClick={handleAutoDetect}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>{isBn ? 'আমার বর্তমান স্থান অটো সনাক্ত করুন (GPS/IP)' : 'Auto Detect My Location'}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={isBn ? 'জেলার নাম দিয়ে খুঁজুন (যেমন: বগুড়া, রাজশাহী, ঢাকা)...' : 'Search district...'}
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Division Filter Pills */}
            <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {BANGLADESH_DIVISIONS.map(div => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap font-bold text-[11px] transition-all cursor-pointer ${
                    selectedDivision === div
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>

            {/* Districts Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredDistricts.map(d => {
                const isCurrent = weather?.cityBn === d.nameBn;
                return (
                  <button
                    key={d.nameEn}
                    onClick={() => handleSelectDistrict(d)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-95 cursor-pointer ${
                      isCurrent
                        ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{d.nameBn}</p>
                      <p className="text-[10px] text-slate-400">{d.nameEn} • {d.divisionBn}</p>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
