import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Sun, CloudRain, Cloud, CloudLightning } from 'lucide-react';
import { Language, UserSession } from '../types';
import { getGreeting, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
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
  const rawAvatar = user?.avatarUrl || adminAvatar || (typeof window !== 'undefined' ? (localStorage.getItem('protyasha_admin_avatar') || localStorage.getItem('protyasha_last_avatar') || '') : '');
  const displayAvatar = rawAvatar && !rawAvatar.startsWith('/uploads/') ? rawAvatar : (rawAvatar.startsWith('data:image/') ? rawAvatar : '');

  const [internalWeather, setInternalWeather] = useState<WeatherData | null>(null);

  const loadWeather = () => {
    fetchLiveWeather().then(data => {
      if (data) setInternalWeather(data);
    }).catch(() => {});
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const weatherData = propWeatherData || internalWeather;

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Scenic Watercolor Landscape Banner */}
      <div className="relative h-44 w-full bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <img
          src={scenicLandscape}
          alt="Scenic Bangladeshi Landscape"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-300"
        />

        {/* Time-of-day dynamic overlay effect */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${
          new Date().getHours() >= 18 || new Date().getHours() < 6 
            ? 'bg-indigo-900/40' // Night
            : new Date().getHours() >= 16 
              ? 'bg-orange-500/20' // Evening
              : 'bg-transparent' // Day
        }`} />

        {/* Soft overlay gradient to ensure high contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/70 via-transparent to-amber-100/90 dark:from-slate-900/80 dark:to-slate-950/90 pointer-events-none" />

        {/* Top App Bar inside Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-3 pb-2">
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
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 tracking-wide">
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
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {lang === 'bn' ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
              </h2>
            </div>
          </div>

          {/* Right Action Icons: Live Weather & Notification Bell */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Real-time Auto-Location Weather Button (Red-circled area) */}
            <button
              onClick={() => {
                sounds.playTap();
                onOpenWeather();
              }}
              className="h-10 px-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-white/70 dark:border-slate-700 flex items-center gap-1.5 text-slate-800 dark:text-slate-100 hover:bg-white hover:ring-2 hover:ring-rose-500/30 active:scale-95 transition-all cursor-pointer group"
              title={lang === 'bn' ? '৭ দিনের আবহাওয়া বার্তা দেখুন' : 'View 7-day weather forecast'}
            >
              {/* Dynamic Animated Mini Icon */}
              <span className="flex items-center justify-center">
                {weatherData?.conditionType === 'rain' ? (
                  <CloudRain className="w-4 h-4 text-sky-500 animate-bounce [animation-duration:2.5s]" />
                ) : weatherData?.conditionType === 'thunder' ? (
                  <CloudLightning className="w-4 h-4 text-amber-500 animate-pulse" />
                ) : weatherData?.conditionType === 'cloud' ? (
                  <Cloud className="w-4 h-4 text-slate-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
              </span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-black text-slate-900 dark:text-white">
                  {weatherData ? `${toBengaliNumber(weatherData.currentTemp)}°C` : '২৮°C'}
                </span>
                <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400 truncate max-w-[80px]">
                  {weatherData?.cityBn || 'ঢাকা'}
                </span>
              </div>
            </button>

            {/* Prayer Times & Sun Button (Icon Only) */}
            {onOpenPrayerTimes && (
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenPrayerTimes();
                }}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-white/70 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-white hover:ring-2 hover:ring-amber-500/30 active:scale-95 transition-all cursor-pointer shrink-0 text-base"
                title={lang === 'bn' ? 'নামাজের সময়সূচি ও সূর্যোদয়-সূর্যাস্ত' : 'Prayer Times & Sun Schedule'}
              >
                🕌
              </button>
            )}

            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-white/70 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-white hover:ring-2 hover:ring-rose-500/30 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Bell className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#E52E2E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-rose-600/40 ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {lang === 'bn' ? toBengaliNumber(unreadCount < 10 ? `0${unreadCount}` : unreadCount) : (unreadCount < 10 ? `0${unreadCount}` : unreadCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
