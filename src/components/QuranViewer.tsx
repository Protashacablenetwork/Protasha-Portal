import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, BookOpen, Volume2, VolumeX, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { ALL_114_SURAHS, SurahMeta, SurahDetail, fetchSurahDetail } from '../data/quranData';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface QuranViewerProps {
  onBack: () => void;
  onSurahActiveChange?: (isSurahActive: boolean) => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({ onBack, onSurahActiveChange }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'মক্কী' | 'মাদানী'>('all');
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const catalogScrollPosRef = useRef<number>(0);

  // Notify parent component when a Surah is opened or closed
  useEffect(() => {
    onSurahActiveChange?.(Boolean(selectedSurah));
  }, [selectedSurah, onSurahActiveChange]);

  // Stop audio on unmount or surah change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedSurah]);

  // Handle scroll position when toggling between catalog and surah reader
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    if (selectedSurah) {
      mainEl.scrollTop = 0;
    } else {
      const savedPos = catalogScrollPosRef.current;
      if (savedPos > 0) {
        const restore = () => {
          if (mainEl) mainEl.scrollTop = savedPos;
        };
        requestAnimationFrame(restore);
        const timer1 = setTimeout(restore, 40);
        const timer2 = setTimeout(restore, 120);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [selectedSurah]);

  const handlePlayAudio = (url?: string, ayahNum?: number) => {
    if (!url) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingAyah === ayahNum) {
      setPlayingAyah(null);
      return;
    }
    sounds.playTap();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => setPlayingAyah(null));
    audio.onended = () => setPlayingAyah(null);
  };

  // Handle single back button press when reading a Surah
  useEffect(() => {
    if (!selectedSurah) return;

    const handleSurahPopState = (e: PopStateEvent) => {
      e.stopImmediatePropagation();
      if (audioRef.current) audioRef.current.pause();
      setSelectedSurah(null);
    };

    window.addEventListener('popstate', handleSurahPopState, true);
    return () => window.removeEventListener('popstate', handleSurahPopState, true);
  }, [selectedSurah]);

  const handleOpenSurah = async (meta: SurahMeta) => {
    sounds.playTap();
    const mainEl = document.querySelector('main');
    if (mainEl) {
      catalogScrollPosRef.current = mainEl.scrollTop;
    }
    setIsLoadingSurah(true);
    try {
      const detail = await fetchSurahDetail(meta.number);
      setSelectedSurah(detail);
      window.history.pushState({ quranSurah: meta.number }, '');
    } finally {
      setIsLoadingSurah(false);
    }
  };

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_114_SURAHS.filter(s => {
      const matchType = filterType === 'all' || s.revelationType === filterType;
      const matchSearch = !q ||
        s.nameBn.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameAr.includes(q) ||
        s.meaningBn.toLowerCase().includes(q) ||
        s.number.toString() === q;
      return matchType && matchSearch;
    });
  }, [search, filterType]);

  // If a Surah is opened, show Surah Reader
  if (selectedSurah) {
    return (
      <div className="space-y-4 pb-20 animate-in fade-in duration-200">
        {/* Surah Header Card */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-900/90 via-teal-950 to-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-end gap-3 mb-3">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {selectedSurah.revelationType} • {toBengaliNumber(selectedSurah.versesCount)} আয়াত
            </span>
          </div>

          <div className="text-center my-3">
            <h1 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight font-serif drop-shadow-md">
              {selectedSurah.nameAr}
            </h1>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              সূরা {selectedSurah.nameBn} ({selectedSurah.nameEn})
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/90 font-medium mt-1">
              অর্থ: {selectedSurah.meaningBn} • সূরা নং {toBengaliNumber(selectedSurah.number)}
            </p>
          </div>

          {/* Bismillah */}
          {selectedSurah.bismillah && (
            <div className="mt-4 pt-4 border-t border-emerald-500/20 text-center">
              <p className="text-2xl sm:text-3xl font-serif text-amber-200/90 tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-medium">
                পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি
              </p>
            </div>
          )}
        </div>

        {/* Ayahs List */}
        <div className="space-y-3">
          {selectedSurah.ayahs.map((ayah) => {
            const isPlaying = playingAyah === ayah.numberInSurah;
            return (
              <div
                key={ayah.numberInSurah}
                className="rounded-2xl p-4 sm:p-5 bg-slate-900/90 border border-emerald-800/40 hover:border-emerald-500/40 transition-all shadow-md space-y-3"
              >
                {/* Ayah Header & Actions */}
                <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center justify-center text-xs font-black">
                    {toBengaliNumber(ayah.numberInSurah)}
                  </span>

                  {ayah.audioUrl && (
                    <button
                      onClick={() => handlePlayAudio(ayah.audioUrl, ayah.numberInSurah)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying 
                          ? 'bg-amber-500 text-slate-950 shadow-md' 
                          : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/40'
                      }`}
                      title={isPlaying ? 'তিলাওয়াত থামান' : 'অডিও তিলাওয়াত শুনুন'}
                    >
                      {isPlaying ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isPlaying ? 'থামান' : 'তিলাওয়াত'}</span>
                    </button>
                  )}
                </div>

                {/* Arabic Ayah Text */}
                <p 
                  className="text-right text-2xl sm:text-3xl leading-[2.2] text-amber-100 font-serif font-normal select-text tracking-wide"
                  dir="rtl"
                >
                  {ayah.textAr}
                </p>

                {/* Bengali Transliteration (if present) */}
                {ayah.textBnTranslit && (
                  <p className="text-xs sm:text-sm text-amber-300/80 font-medium italic">
                    উচ্চারণ: {ayah.textBnTranslit}
                  </p>
                )}

                {/* Bengali Translation */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal pt-1 border-t border-emerald-900/30">
                  {ayah.textBn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 114 Surahs Catalog View
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>আল-কোরআনুল কারীম (১১৪ সূরা)</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            আরবি তিলাওয়াত, সহজ বাংলা উচ্চারণ ও বিশ্বস্ত বাংলা অনুবাদ সহ
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="সূরার নাম দিয়ে অনুসন্ধান (যেমন: ফাতিহা, ইয়াসীন, মুলক, 112)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">ফিল্টার:</span>
          {(['all', 'মক্কী', 'মাদানী'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                sounds.playTap();
                setFilterType(type);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterType === type 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-emerald-900/50'
              }`}
            >
              {type === 'all' ? 'সকল ১১৪ সূরা' : `${type} সূরাসমূহ`}
            </button>
          ))}
          <span className="text-[11px] text-emerald-400/80 ml-auto shrink-0 font-bold">
            মোট: {toBengaliNumber(filteredSurahs.length)}টি সূরা
          </span>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoadingSurah && (
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
          <p className="text-xs font-bold text-emerald-200">সূরা লোড হচ্ছে...</p>
        </div>
      )}

      {/* 114 Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => handleOpenSurah(surah)}
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-900/60 hover:border-emerald-500/50 text-left transition-all active:scale-[0.98] shadow-md group flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {toBengaliNumber(surah.number)}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                  {surah.nameBn}
                </h3>
                <p className="text-[11px] text-emerald-300/80 truncate">
                  {surah.meaningBn}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {surah.revelationType} • {toBengaliNumber(surah.versesCount)} আয়াত
                </p>
              </div>
            </div>

            <span className="text-lg font-serif text-amber-200/90 shrink-0 font-normal">
              {surah.nameAr}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
