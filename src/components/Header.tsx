import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, Sun, CloudRain, Cloud, CloudLightning } from 'lucide-react';
import { Language, UserSession } from '../types';
import { getGreeting, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { safeStorage } from '../utils/safeStorage';
import { fetchLiveWeather, WeatherData, ALL_BANGLADESH_DISTRICTS } from '../utils/weatherService';
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
  weatherData: propWeatherData
}) => {
  const greeting = getGreeting(lang);
  const isAdmin = user?.role === 'admin';
  const isSubAdmin = user?.role === 'sub-admin';
  const rawAvatar =
    user?.avatarUrl ||
    adminAvatar ||
    (typeof window !== 'undefined'
      ? safeStorage.getItem('protyasha_admin_avatar') ||
        safeStorage.getItem('protyasha_last_avatar') ||
        safeStorage.getItem('protyasha_img_avatar_admin') ||
        (user?.id ? safeStorage.getItem(`protyasha_img_avatar_user_${user.id}`) : '') ||
        ''
      : '');
  const displayAvatar = rawAvatar ? String(rawAvatar).trim() : '';

  const [internalWeather, setInternalWeather] = useState<WeatherData | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [displayAvatar]);

  const loadWeather = () => {
    fetchLiveWeather()
      .then((data) => {
        if (data) setInternalWeather(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 10 * 60 * 1000);

    let rafId = 0;
    const updateScroll = () => {
      rafId = 0;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const next = Math.min(1, Math.max(0, y / 56));
      setScrollProgress((prev) => (Math.abs(prev - next) >= 0.04 || next === 0 || next === 1 ? next : prev));
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const weatherData = propWeatherData || internalWeather;
  const isScrolled = scrollProgress > 0.08;
  const blurPx = isScrolled ? Number((scrollProgress * 20).toFixed(1)) : 0;
  const saturatePct = isScrolled ? Math.round(115 + scrollProgress * 65) : 100;
  const bannerBlurPx = isScrolled ? Number((scrollProgress * 4).toFixed(1)) : 0;
  const roleLabel = isAdmin
    ? lang === 'bn'
      ? 'এডমিন'
      : 'Admin'
    : isSubAdmin
      ? lang === 'bn'
        ? 'সাব-এডমিন'
        : 'Sub-Admin'
      : user?.role === 'user'
        ? lang === 'bn'
          ? 'সদস্য'
          : 'Member'
        : lang === 'bn'
          ? 'ভিজিটর'
          : 'Visitor';

  return (
    <div className="relative w-full select-none">
      {/* Fixed Sticky Top App Bar: Clear/transparent at top, Light Glassmorphism + Blur only on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          style={
            blurPx > 0
              ? {
                  backdropFilter: `blur(${blurPx}px) saturate(${saturatePct}%)`,
                  WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturatePct}%)`
                }
              : undefined
          }
          className={`pointer-events-auto w-full transition-all duration-300 ease-out border-b ${
            isScrolled
              ? 'bg-white/78 dark:bg-slate-900/80 border-slate-200/75 dark:border-slate-700/70 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.14)] py-2'
              : 'bg-transparent border-transparent shadow-none py-2.5'
          }`}
        >
          {/* Specular top glass highlight (visible only on scroll) */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/20 transition-opacity duration-300 ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
            {/* Brand & User Profile Trigger */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 min-w-0 min-h-[44px] text-left cursor-pointer group active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 rounded-2xl pr-1"
            >
              {/* Avatar Ring */}
              <div
                className={`relative w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-0.5 flex items-center justify-center overflow-hidden transition-shadow duration-300 ${
                  isScrolled ? 'shadow-sm shadow-rose-500/20' : 'shadow-md shadow-black/25'
                }`}
              >
                {displayAvatar && !avatarFailed ? (
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full bg-white"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-[#E52E2E] font-bold text-lg leading-none">
                      {lang === 'bn' ? 'প্র' : 'P'}
                    </span>
                  </div>
                )}
              </div>

              {/* Greeting + Role & Single-Line Title */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] leading-tight">
                  <span
                    className={`font-semibold truncate transition-colors duration-300 ${
                      isScrolled
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                    }`}
                  >
                    {greeting}
                  </span>
                  <span
                    aria-hidden="true"
                    className={isScrolled ? 'text-slate-400 dark:text-slate-500' : 'text-white/75'}
                  >
                    ·
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold whitespace-nowrap shrink-0 transition-colors duration-300 ${
                      isScrolled
                        ? isAdmin
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : isSubAdmin
                            ? 'text-amber-700 dark:text-amber-400'
                            : user?.role === 'user'
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-slate-600 dark:text-slate-400'
                        : isAdmin
                          ? 'text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                          : isSubAdmin
                            ? 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                            : user?.role === 'user'
                              ? 'text-sky-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                              : 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                    }`}
                  >
                    {(isAdmin || isSubAdmin || user?.role === 'user') && (
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                    )}
                    <span>{roleLabel}</span>
                  </span>
                </div>
                <h2
                  className={`text-[13px] sm:text-base font-extrabold tracking-tight truncate leading-snug transition-colors duration-300 ${
                    isScrolled
                      ? 'text-slate-900 dark:text-white'
                      : 'text-white drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.9)]'
                  }`}
                >
                  {lang === 'bn' ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
                </h2>
              </div>
            </button>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {onOpenPrayerTimes && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onOpenPrayerTimes();
                  }}
                  aria-label={lang === 'bn' ? 'নামাজের সময়সূচী ও ক্যালেন্ডার' : 'Prayer Times & Calendar'}
                  title={lang === 'bn' ? 'নামাজের সময়সূচী ও ক্যালেন্ডার' : 'Prayer Times & Calendar'}
                  className={`min-w-[40px] h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                    isScrolled
                      ? 'bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 shadow-xs'
                      : 'bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md'
                  }`}
                >
                  <span className="text-base leading-none select-none">🕌</span>
                </button>
              )}

              {/* Live Weather Control */}
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onOpenWeather();
                }}
                aria-label={lang === 'bn' ? 'আবহাওয়ার তথ্য' : 'Weather Info'}
                className={`h-10 px-2.5 rounded-full border flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${
                  isScrolled
                    ? 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                    : 'bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md'
                }`}
              >
                <span className="flex items-center justify-center shrink-0">
                  {weatherData?.conditionType === 'rain' ? (
                    <CloudRain className={`w-4 h-4 ${isScrolled ? 'text-sky-600 dark:text-sky-400' : 'text-sky-300'}`} />
                  ) : weatherData?.conditionType === 'thunder' ? (
                    <CloudLightning className={`w-4 h-4 ${isScrolled ? 'text-amber-600 dark:text-amber-400' : 'text-amber-300'}`} />
                  ) : weatherData?.conditionType === 'cloud' ? (
                    <Cloud className={`w-4 h-4 ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-100'}`} />
                  ) : (
                    <Sun className={`w-4 h-4 ${isScrolled ? 'text-amber-500 dark:text-amber-400' : 'text-amber-300'}`} />
                  )}
                </span>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-black tabular-nums whitespace-nowrap">
                    {weatherData ? `${toBengaliNumber(weatherData.currentTemp)}°C` : '২৮°C'}
                  </span>
                  <span
                    className={`text-[9px] font-bold truncate max-w-[72px] whitespace-nowrap transition-colors ${
                      isScrolled ? 'text-rose-600 dark:text-rose-400' : 'text-white/95'
                    }`}
                  >
                    {weatherData?.cityBn || ALL_BANGLADESH_DISTRICTS.find((d) => d.nameBn === 'জামালপুর')?.nameBn || 'জামালপুর'}
                  </span>
                </div>
              </button>

              {/* Notification Bell Button */}
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label={lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
                className={`relative min-w-[40px] h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${
                  isScrolled
                    ? 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                    : 'bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-[#E52E2E] text-white text-[9px] font-black tabular-nums rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900">
                    {lang === 'bn' ? toBengaliNumber(unreadCount) : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Scenic Watercolor Landscape Banner Area (clear when unscrolled, smooth blur on scroll) */}
      <div className="relative w-full overflow-hidden">
        <div className="h-56 sm:h-64 w-full">
          <img
            src={scenicLandscape}
            alt="Scenic Bangladeshi Landscape"
            referrerPolicy="no-referrer"
            style={
              bannerBlurPx > 0
                ? {
                    filter: `blur(${bannerBlurPx}px)`,
                    transform: `scale(${1 + scrollProgress * 0.03})`
                  }
                : undefined
            }
            className="w-full h-full object-cover object-center transition-[filter,transform] duration-200 ease-out motion-reduce:transition-none"
          />

          {/* Dynamic Night Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              new Date().getHours() >= 18 || new Date().getHours() < 6
                ? 'bg-indigo-900/25 opacity-100'
                : 'bg-transparent opacity-0'
            }`}
          />

          {/* Bottom Gradient Fade to merge cleanly into Balance Card */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/55 to-transparent dark:from-slate-900 dark:via-slate-900/55 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
