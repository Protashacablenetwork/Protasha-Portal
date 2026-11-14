import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { DistrictInfo } from '../utils/weatherService';
import {
  PrayerTimings,
  BENGALI_MONTHS,
  getPerpetualFastingCalendar,
  getActiveFastingCardData
} from '../utils/prayerTimeService';
import { findRamadanMonthInYear } from '../utils/hijriDate';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import {
  RAMADAN_NIYATS_AND_DUAS,
  RAMADAN_HADITHS,
  RAMADAN_MASALA_SECTIONS,
  OTHER_FASTING_TYPES
} from '../data/ramadanData';

export type RamadanSubTab = 'calendar' | 'niyat' | 'hadith' | 'details';

interface RamadanViewerProps {
  district: DistrictInfo;
  timings: PrayerTimings;
  currentTime: Date;
  activeTab: RamadanSubTab;
  onTabChange: (tab: RamadanSubTab) => void;
}

export const RamadanViewer: React.FC<RamadanViewerProps> = ({
  district,
  timings,
  currentTime,
  activeTab,
  onTabChange
}) => {
  const [calYear, setCalYear] = useState<number>(currentTime.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(currentTime.getMonth());
  const [duaCategory, setDuaCategory] = useState<string>('সব');
  const [detailMode, setDetailMode] = useState<'masala' | 'other'>('masala');
  const [openMasalaId, setOpenMasalaId] = useState<string>(RAMADAN_MASALA_SECTIONS[0].id);

  // Live District Dashboard Data (ticks every second with currentTime)
  const dashboard = useMemo(() => {
    return getActiveFastingCardData(timings, currentTime);
  }, [timings, currentTime]);

  // Perpetual Year-Round Monthly Fasting Calendar for Selected District
  const perpetualDays = useMemo(() => {
    return getPerpetualFastingCalendar(district, calYear, calMonth);
  }, [district, calYear, calMonth]);

  // Locate Ramadan Month inside currently viewed year for quick jump
  const ramadanMatch = useMemo(() => {
    return findRamadanMonthInYear(calYear);
  }, [calYear]);

  const handlePrevMonth = () => {
    sounds.playTap();
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    sounds.playTap();
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleJumpToRamadan = () => {
    sounds.playTap();
    setCalMonth(ramadanMatch.monthIndex);
  };

  const handleResetToToday = () => {
    sounds.playTap();
    setCalYear(currentTime.getFullYear());
    setCalMonth(currentTime.getMonth());
  };

  const filteredDuas = useMemo(() => {
    if (duaCategory === 'সব') return RAMADAN_NIYATS_AND_DUAS;
    return RAMADAN_NIYATS_AND_DUAS.filter(item => item.category === duaCategory);
  }, [duaCategory]);

  const navTabs: { id: RamadanSubTab; label: string }[] = [
    { id: 'calendar', label: 'চিরস্থায়ী ক্যালেন্ডার' },
    { id: 'niyat', label: 'নিয়ত ও দোয়া' },
    { id: 'hadith', label: 'হাদিস ও ফজিলত' },
    { id: 'details', label: 'রোজার বিস্তারিত' }
  ];

  const daysBnFull = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const todayFullDateBn = `${daysBnFull[currentTime.getDay()]}, ${toBengaliNumber(currentTime.getDate())} ${BENGALI_MONTHS[currentTime.getMonth()]} ${toBengaliNumber(currentTime.getFullYear())}`;

  return (
    <div className="space-y-5 pb-28 animate-in fade-in duration-300">
      {/* ============================================================
          TOP LIVE DISTRICT DASHBOARD (Selected District + Countdown)
          ============================================================ */}
      <section className="bg-gradient-to-br from-[#003d32] via-[#003128] to-[#001d18] rounded-[28px] sm:rounded-[36px] border border-emerald-500/35 shadow-2xl overflow-hidden text-white">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Hijri & Ramadan Status Header Row (Location is controlled via top header) */}
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300">
              <span>{dashboard.hijriFormattedBn}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-200/80">{todayFullDateBn}</span>
            </div>
            <p className="text-[12px] font-bold text-emerald-200/90">
              {dashboard.ramadanStatusBn}
            </p>
          </div>

          {/* Live Countdown & Phase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-emerald-800/40">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                <Moon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{dashboard.phaseTitleBn}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-100/80">
                {dashboard.phaseSubtitleBn}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tabular-nums tracking-tight leading-none">
                {dashboard.countdownTimeBn}
              </div>
              <p className="text-xs font-black text-emerald-300 mt-1.5 flex items-center sm:justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{dashboard.countdownLabelBn}</span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 bg-[#001f19] rounded-full overflow-hidden p-0.5 ring-1 ring-emerald-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, dashboard.progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Bottom Today Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-emerald-800/40 divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/40 bg-[#00221b]">
          <div className="p-3.5 text-center">
            <p className="text-[11px] font-bold text-emerald-200/70">সাহরীর শেষ সময়</p>
            <p className="text-base font-black text-amber-300 tabular-nums mt-0.5">{dashboard.sehriEndBn}</p>
          </div>
          <div className="p-3.5 text-center border-l border-emerald-800/40 sm:border-l-0">
            <p className="text-[11px] font-bold text-emerald-200/70">ফজর শুরু</p>
            <p className="text-base font-black text-white tabular-nums mt-0.5">{dashboard.fajrBn}</p>
          </div>
          <div className="p-3.5 text-center">
            <p className="text-[11px] font-bold text-emerald-200/70">আজকের ইফতার</p>
            <p className="text-base font-black text-amber-300 tabular-nums mt-0.5">{dashboard.iftarBn}</p>
          </div>
          <div className="p-3.5 text-center border-l border-emerald-800/40 sm:border-l-0">
            <p className="text-[11px] font-bold text-emerald-200/70">দিনের ব্যাপ্তি</p>
            <p className="text-sm font-black text-emerald-200 tabular-nums mt-1">{dashboard.fastDurationBn}</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION OPTION TABS (Calendar · Niyat · Hadith · Details)
          ============================================================ */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#002820] border border-emerald-800/40 rounded-2xl overflow-x-auto scrollbar-none">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                onTabChange(tab.id);
              }}
              className={`flex-1 min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TAB 1: PERPETUAL YEAR-ROUND MONTHLY CALENDAR
          ============================================================ */}
      {activeTab === 'calendar' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Month & Year Perpetual Control Card */}
          <div className="bg-[#0b2b24] rounded-[28px] p-4 sm:p-5 border border-emerald-800/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="আগের মাস"
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#00221b] hover:bg-[#003d32] border border-emerald-700/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-3 text-center min-w-[140px]">
                  <h3 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                    {BENGALI_MONTHS[calMonth]} {toBengaliNumber(calYear)}
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-200/70">
                    {district.nameBn} · চিরস্থায়ী সময়সূচী
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="পরের মাস"
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#00221b] hover:bg-[#003d32] border border-emerald-700/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Year Switcher */}
                <div className="flex items-center bg-[#00221b] rounded-xl border border-emerald-700/40 p-1">
                  <button
                    type="button"
                    onClick={() => { sounds.playTap(); setCalYear(y => y - 1); }}
                    className="min-h-[36px] px-2.5 text-xs font-black text-emerald-200 hover:text-white cursor-pointer"
                  >
                    −১ বছর
                  </button>
                  <span className="px-2 text-xs font-black text-amber-300 tabular-nums">
                    {toBengaliNumber(calYear)}
                  </span>
                  <button
                    type="button"
                    onClick={() => { sounds.playTap(); setCalYear(y => y + 1); }}
                    className="min-h-[36px] px-2.5 text-xs font-black text-emerald-200 hover:text-white cursor-pointer"
                  >
                    +১ বছর
                  </button>
                </div>

                {/* Quick Jump to Ramadan Month */}
                <button
                  type="button"
                  onClick={handleJumpToRamadan}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                    calMonth === ramadanMatch.monthIndex
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-[#00221b] text-amber-300 border-amber-400/40 hover:bg-[#003d32]'
                  }`}
                >
                  পবিত্র রমজান মাস ({toBengaliNumber(ramadanMatch.hijriYear)})
                </button>

                {(calYear !== currentTime.getFullYear() || calMonth !== currentTime.getMonth()) && (
                  <button
                    type="button"
                    onClick={handleResetToToday}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-black text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    চলতি মাস
                  </button>
                )}
              </div>
            </div>

            {/* 12-Month Quick Picker Strip (All 12 Months of Year) */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {BENGALI_MONTHS.map((mName, idx) => {
                const isSelectedMonth = calMonth === idx;
                const isRamadanMonth = idx === ramadanMatch.monthIndex;
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setCalMonth(idx);
                    }}
                    className={`min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors cursor-pointer border ${
                      isSelectedMonth
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : isRamadanMonth
                          ? 'bg-emerald-900/60 text-amber-300 border-emerald-500/40 hover:bg-emerald-800/70'
                          : 'bg-[#00221b] text-emerald-100/80 border-emerald-900/40 hover:bg-[#003329]'
                    }`}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-emerald-200/75 pt-1">
              <span>হলুদ চিহ্নিত সারি: পবিত্র রমজান মাস</span>
              <span aria-hidden="true">·</span>
              <span>তারকা চিহ্নিত দিন: আইয়ামে বীজ (১৩-১৫ হিজরি)</span>
            </div>
          </div>

          {/* Monthly Timetable */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-950 text-xs font-black border-b border-emerald-100">
                    <th className="py-4 px-3 text-left whitespace-nowrap">তারিখ ও হিজরি</th>
                    <th className="py-4 px-2 whitespace-nowrap">বার</th>
                    <th className="py-4 px-2 whitespace-nowrap">সাহরী শেষ</th>
                    <th className="py-4 px-2 whitespace-nowrap">ফজর</th>
                    <th className="py-4 px-2 whitespace-nowrap">ইফতার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 text-xs sm:text-sm font-bold tabular-nums">
                  {perpetualDays.map((day) => {
                    const rowHighlight = day.isToday
                      ? 'bg-emerald-100/90 text-emerald-950 font-black'
                      : day.isRamadan
                        ? 'bg-amber-50/75 hover:bg-amber-100/70'
                        : 'hover:bg-slate-50';

                    return (
                      <tr key={day.dayNumber} className={`transition-colors ${rowHighlight}`}>
                        <td className="py-3.5 px-3 text-left whitespace-nowrap">
                          <div className="font-black text-slate-900">
                            {day.dateStrBn}
                            {day.isToday ? ' (আজ)' : ''}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                            {day.hijriShortBn}
                            {day.isRamadan ? ' · রমজান' : day.isAyyamAlBidh ? ' · ★ আইয়ামে বীজ' : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-2 whitespace-nowrap text-slate-600">
                          {day.dayShortBn}
                          {day.isSunnahWeekDay ? '*' : ''}
                        </td>
                        <td className="py-3.5 px-2 whitespace-nowrap text-emerald-800 font-black">{day.sehriEnd}</td>
                        <td className="py-3.5 px-2 whitespace-nowrap text-slate-700">{day.fajr}</td>
                        <td className="py-3.5 px-2 whitespace-nowrap text-amber-700 font-black">{day.iftar}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 text-[11px] text-slate-600 text-center border-t border-slate-100 font-bold flex flex-wrap items-center justify-center gap-2">
              <Info className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {district.nameEn} ({district.nameBn}) জেলার ভৌগোলিক অবস্থান অনুযায়ী চিরস্থায়ী সাহরী-ইফতার ক্যালেন্ডার · *চিহ্নিত সোম/বৃহঃ সুন্নত রোজার দিন
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: ROZA NIYAT, IFTAR DUA, TARAWIH & QADR DUA
          ============================================================ */}
      {activeTab === 'niyat' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {['সব', 'নিয়ত', 'ইফতার', 'তারাবীহ ও কদর', 'অন্যান্য'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setDuaCategory(cat);
                }}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                  duaCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-[#002820] text-emerald-100/80 border-emerald-800/40 hover:bg-[#003d32]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDuas.map((item) => (
              <article
                key={item.id}
                className="rounded-[28px] p-5 sm:p-6 bg-[#0b2b24] border border-emerald-800/40 shadow-xl space-y-4"
              >
                <div className="border-b border-emerald-900/50 pb-3">
                  <div className="text-[11px] font-bold text-emerald-300/80 mb-1">
                    {item.category} · {item.subtitleBn}
                  </div>
                  <h3 className="text-lg font-black text-amber-300">{item.titleBn}</h3>
                </div>

                <div className="bg-[#00221b] p-4 sm:p-5 rounded-2xl border border-emerald-900/40">
                  <p
                    className="text-right text-2xl sm:text-3xl leading-[2.2] text-amber-50 font-serif select-text"
                    dir="rtl"
                  >
                    {item.arabic}
                  </p>
                </div>

                <div className="space-y-2.5 text-sm leading-relaxed">
                  <div>
                    <span className="text-xs font-black text-emerald-400">বাংলা উচ্চারণ: </span>
                    <span className="font-bold text-white select-text">{item.translitBn}</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-300">অর্থ: </span>
                    <span className="font-bold text-emerald-50/90 select-text">{item.meaningBn}</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-900/40 text-xs font-bold text-emerald-200/75">
                    {item.noteBn}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: SAHIH HADITHS ON FASTING & RAMADAN
          ============================================================ */}
      {activeTab === 'hadith' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="rounded-[24px] p-4 sm:p-5 bg-[#003329] border border-emerald-700/40 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-base font-black text-amber-300">রোজা ও রমজান বিষয়ক সহীহ হাদিস</h3>
              <p className="text-xs font-bold text-emerald-100/75 mt-0.5">
                সহীহ বুখারী ও সহীহ মুসলিম থেকে সংকলিত রোজার মর্যাদা ও ফজিলত
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {RAMADAN_HADITHS.map((h, idx) => (
              <article
                key={h.id}
                className="rounded-[28px] p-5 sm:p-6 bg-[#0b2b24] border border-emerald-800/40 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-emerald-900/50 pb-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-300/80 mb-1">
                      হাদিস {toBengaliNumber(idx + 1)} · {h.referenceBn}
                    </p>
                    <h4 className="text-base sm:text-lg font-black text-amber-300">{h.titleBn}</h4>
                  </div>
                </div>

                <div className="bg-[#00221b] p-4 rounded-2xl border border-emerald-900/40">
                  <p className="text-right text-xl sm:text-2xl leading-[2.1] text-amber-50 font-serif select-text" dir="rtl">
                    {h.arabic}
                  </p>
                </div>

                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  “{h.translationBn}”
                </p>

                <p className="text-xs font-bold text-emerald-200/80 pt-2 border-t border-emerald-900/40">
                  মূল শিক্ষা: {h.lessonBn}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: DETAILED FASTING MASALA & OTHER FASTING TYPES
          ============================================================ */}
      {activeTab === 'details' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Sub-Switch: Ramadan Masala vs Other Fasting Types */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#002820] border border-emerald-800/40 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setDetailMode('masala');
              }}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer ${
                detailMode === 'masala'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-100/80 hover:bg-white/10'
              }`}
            >
              রোজার বিস্তারিত মাসআলা
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setDetailMode('other');
              }}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-colors cursor-pointer ${
                detailMode === 'other'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-emerald-100/80 hover:bg-white/10'
              }`}
            >
              অন্যান্য রোজার বিবরণ
            </button>
          </div>

          {detailMode === 'masala' ? (
            <div className="space-y-3.5">
              {RAMADAN_MASALA_SECTIONS.map((sec) => {
                const isOpen = openMasalaId === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`rounded-[28px] border transition-colors overflow-hidden ${
                      isOpen
                        ? 'bg-[#0b2b24] border-emerald-500/40 shadow-2xl'
                        : 'bg-[#0b2b24]/70 border-emerald-800/40 hover:bg-[#0b2b24]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setOpenMasalaId(prev => (prev === sec.id ? '' : sec.id));
                      }}
                      className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-2xl bg-[#003d32] flex items-center justify-center text-xl border border-emerald-700/40 shrink-0">
                          {sec.icon}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-base font-black text-amber-300 leading-snug">{sec.titleBn}</h4>
                          <p className="text-xs font-bold text-emerald-200/70 mt-0.5">{sec.subtitleBn}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-300' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-emerald-900/50 space-y-3">
                        {sec.points.map((pt, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-[#001f19] border border-emerald-900/40 flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-sm font-black text-white">{pt.heading}</h5>
                              <p className="text-xs sm:text-sm font-bold text-emerald-100/75 mt-1 leading-relaxed">
                                {pt.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="rounded-[24px] p-4 bg-[#003329] border border-emerald-700/40 flex items-center gap-3">
                <Compass className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-base font-black text-amber-300">অন্যান্য নফল, সুন্নত, ওয়াজিব ও নিষিদ্ধ রোজা</h3>
                  <p className="text-xs font-bold text-emerald-100/75 mt-0.5">
                    রমজানের বাইরে সারা বছরের গুরুত্বপূর্ণ রোজাসমূহের বিবরণ ও ফজিলত
                  </p>
                </div>
              </div>

              {OTHER_FASTING_TYPES.map((topic) => (
                <article
                  key={topic.id}
                  className="rounded-[28px] p-5 bg-[#0b2b24] border border-emerald-800/40 shadow-xl space-y-3"
                >
                  <div className="border-b border-emerald-900/50 pb-2.5">
                    <div className="text-[11px] font-bold text-emerald-300/80 mb-1">
                      {topic.statusType} · {topic.referenceBn}
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-amber-300">{topic.titleBn}</h4>
                  </div>

                  <div className="text-xs font-bold text-emerald-200/90">
                    <span className="text-emerald-400 font-black">সময়: </span>
                    {topic.timingBn}
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    <span className="text-amber-300 font-black">ফজিলত ও বিধান: </span>
                    {topic.virtueBn}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-emerald-100/75 leading-relaxed bg-[#00221b] p-3.5 rounded-2xl border border-emerald-900/40">
                    {topic.detailsBn}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
