import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Sun, CloudRain, Cloud, CloudLightning } from 'lucide-react';
import { Language, UserSession } from '../types';
import { getGreeting, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { safeStorage } from '../utils/safeStorage';
import { fetchLiveWeather, WeatherData } from '../utils/weatherService';
import scenicLandscape from '../assets/images/scenic_river_bridge_landscape_1792226647109.jpg';

interface HeaderProps {
  lang: Language;
  user: UserSession | null;
  adminAvatar?: string;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenWeather: () => void;
  onOpenPrayerTimes?: () => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  weatherData?: WeatherData | null;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  user,
  adminAvatar,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenWeather,
  onOpenPrayerTimes,
  onOpenLogin,
  onLogout,
  weatherData: propWeatherData
}) => {
  const greeting = getGreeting(lang);
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user && (user.role === 'admin' || user.role === 'user');
  const rawAvatar = user?.avatarUrl || adminAvatar || (typeof window !== 'undefined' ? (safeStorage.getItem('protyasha_admin_avatar') || safeStorage.getItem('protyasha_last_avatar') || '') : '');
  const displayAvatar = rawAvatar && !rawAvatar.startsWith('/uploads/') ? rawAvatar : (rawAvatar.startsWith('data:image/') ? rawAvatar : '');

  const [internalWeather, setInternalWeather] = useState<WeatherData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const loadWeather = () => {
    fetchLiveWeather().then(data => {
      if (data) setInternalWeather(data);
    }).catch(() => {});
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const weatherData = propWeatherData || internalWeather;

  return (
    <div className="relative w-full select-none">
      {/* Sticky Top App Bar - Stays at top, changes from transparent to white */}
      <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-800' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          {/* Logo & Greeting */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
          >
            {/* User Avatar or Fallback logo */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-0.5 shadow-md shadow-rose-500/20 flex items-center justify-center overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                  <span className="text-[#E52E2E] font-bold text-lg leading-none">
                    {lang === 'bn' ? 'প্র' : 'P'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className={`text-[10px] sm:text-xs font-bold tracking-wide transition-colors duration-300 ${
                  isScrolled ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {greeting}
                </p>
                {isAdmin ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-600 text-white flex items-center gap-0.5 shadow-2xs">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>এডমিন</span>
                  </span>
                ) : user?.role === 'user' ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white flex items-center gap-0.5 shadow-2xs">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>সদস্য</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    ভিজিটর
                  </span>
                )}
              </div>
              <h2 className={`text-xs sm:text-sm font-black transition-colors duration-300 ${
                isScrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white drop-shadow-sm'
              }`}>
                {lang === 'bn' ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
              </h2>
            </div>
          </div>

          {/* Right Action Icons: Live Weather & Notification Bell */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Weather Button */}
            <button
              onClick={() => {
                sounds.playTap();
                onOpenWeather();
              }}
              className={`h-10 px-2.5 rounded-full backdrop-blur-md shadow-sm border flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer group ${
                isScrolled 
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100' 
                  : 'bg-white/40 border-white/40 text-slate-900 dark:text-white'
              }`}
            >
              <span className="flex items-center justify-center">
                {weatherData?.conditionType === 'rain' ? (
                  <CloudRain className="w-4 h-4 text-sky-600" />
                ) : weatherData?.conditionType === 'thunder' ? (
                  <CloudLightning className="w-4 h-4 text-amber-600" />
                ) : weatherData?.conditionType === 'cloud' ? (
                  <Cloud className="w-4 h-4 text-slate-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-600" />
                )}
              </span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-black">
                  {weatherData ? `${toBengaliNumber(weatherData.currentTemp)}°C` : '২৮°C'}
                </span>
                <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400 truncate max-w-[80px]">
                  {weatherData?.cityBn || 'জামালপুর'}
                </span>
              </div>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className={`relative w-10 h-10 rounded-full backdrop-blur-md shadow-sm border flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 ${
                isScrolled 
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100' 
                  : 'bg-white/40 border-white/40 text-slate-900 dark:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-[#E52E2E] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse ring-2 ring-white dark:ring-slate-900">
                  {lang === 'bn' ? toBengaliNumber(unreadCount) : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scenic Watercolor Landscape Banner - Pulled under the app bar and scrolls up */}
      <div className="relative -mt-[56px] h-48 w-full z-0 overflow-hidden">
        <img
          src={scenicLandscape}
          alt="Scenic Bangladeshi Landscape"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-90"
        />

        {/* Dynamic Overlays */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          new Date().getHours() >= 18 || new Date().getHours() < 6 ? 'bg-indigo-900/30' : 'bg-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-white dark:to-slate-900 pointer-events-none" />
      </div>
    </div>
  );
};
