import React, { useState, useMemo } from 'react';
import { Sparkles, Search, ArrowLeft, HeartHandshake, BookOpen, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_PRAYER_NIYATS, PrayerNiyatItem } from '../data/prayerRulesData';
import { sounds } from '../utils/audio';

interface PrayerNiyatViewerProps {
  onBack: () => void;
  defaultSearch?: string;
}

export const PrayerNiyatViewer: React.FC<PrayerNiyatViewerProps> = ({ onBack, defaultSearch = '' }) => {
  const [search, setSearch] = useState(defaultSearch);
  const [category, setCategory] = useState<string>('সব');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['সব', 'ফরজ', 'সুন্নত', 'বিতর ও নফল', 'বিশেষ নামাজ'];

  const filteredNiyats = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_PRAYER_NIYATS.filter(item => {
      const matchCat = category === 'সব' || item.category === category;
      const matchSearch = !q ||
        item.prayerNameBn.toLowerCase().includes(q) ||
        item.meaningBn.toLowerCase().includes(q) ||
        item.niyatTranslitBn.toLowerCase().includes(q) ||
        item.instructionsBn.toLowerCase().includes(q) ||
        item.niyatAr.includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const toggleExpand = (id: string) => {
    sounds.playTap();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-gradient-to-br from-[#003d32] via-[#003328] to-[#001d18] border border-emerald-500/30 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <HeartHandshake className="w-20 h-20 text-emerald-400" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>সকল নামাজের নিয়ত ও নিয়মাবলী</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 font-bold max-w-md leading-relaxed">
            বিশুদ্ধ আরবি নিয়ত, বাংলা অর্থ, উচ্চারণ এবং প্রতি ওয়াক্তের কসর, ওয়াজিব, নফল ও সুন্নাত পড়ার বিস্তারিত নিয়মাবলী।
          </p>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="w-5 h-5 text-emerald-500/50 absolute left-4.5 top-3.5 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="নামাজের নাম দিয়ে খুঁজুন (যেমন: ফজর, জুমুআ, বিতর, তাহাজ্জুদ, ঈদুল ফিতর)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-[#002b23] border border-emerald-800/40 rounded-[28px] text-[14.5px] text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500 focus:bg-[#003d32] font-black transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => {
                sounds.playTap();
                setCategory(c);
              }}
              className={`px-4.5 py-2.5 rounded-2xl text-[12.5px] font-black whitespace-nowrap transition-all shadow-md ${
                category === c
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/30'
                  : 'bg-[#003129] text-emerald-200/70 border border-emerald-800/30 hover:bg-[#004237]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Niyat Cards */}
      <div className="space-y-5">
        {filteredNiyats.length === 0 ? (
          <div className="py-20 text-center space-y-4">
             <div className="text-6xl opacity-20 grayscale">🔍</div>
             <p className="text-emerald-100/30 font-black tracking-widest uppercase text-sm">কোনো নিয়ত খুঁজে পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredNiyats.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-[36px] p-5 sm:p-7 bg-[#0b2b24]/90 border border-emerald-800/40 hover:border-emerald-500/40 transition-all shadow-2xl space-y-5 relative overflow-hidden group ring-1 ring-white/5"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
                  <BookOpen className="w-32 h-32 text-white" />
                </div>

                <div className="flex items-center justify-between border-b border-emerald-950/50 pb-3.5 relative z-10">
                  <h3 className="text-base sm:text-xl font-black text-amber-300 drop-shadow-sm leading-tight">
                    {item.prayerNameBn}
                  </h3>
                  <span className="text-[11.5px] font-black px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 shadow-inner whitespace-nowrap shrink-0">
                    {item.rakatCountBn}
                  </span>
                </div>

                {/* Arabic Niyat */}
                <div className="relative z-10 bg-[#00241c] p-4 sm:p-6 rounded-[28px] border border-emerald-900/40 shadow-inner">
                  <p
                    className="text-right text-2xl sm:text-3xl leading-[2.2] text-amber-50 font-serif font-normal select-text tracking-wide drop-shadow-sm"
                    dir="rtl"
                  >
                    {item.niyatAr}
                  </p>
                </div>

                <div className="grid gap-3.5 relative z-10">
                  {/* Pronunciation */}
                  <div className="p-4 sm:p-5 rounded-[24px] bg-black/30 border border-emerald-900/30 shadow-inner">
                    <p className="text-[10.5px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      বাংলা উচ্চারণ
                    </p>
                    <p className="text-xs sm:text-[14.5px] text-slate-200 leading-relaxed font-bold italic">
                      {item.niyatTranslitBn}
                    </p>
                  </div>

                  {/* Bengali Meaning */}
                  <div className="p-4 sm:p-5 rounded-[24px] bg-emerald-950/40 border border-emerald-800/40 shadow-inner">
                    <p className="text-[10.5px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      বাংলা অর্থ
                    </p>
                    <p className="text-xs sm:text-[14.5px] text-emerald-50 leading-relaxed font-black">
                      "{item.meaningBn}"
                    </p>
                  </div>

                  {/* Detailed Instructions / Rules */}
                  {item.instructionsBn && (
                    <div className="p-4 sm:p-5 rounded-[24px] bg-[#00382d]/60 border border-emerald-700/40 shadow-inner">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full flex items-center justify-between text-left text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-400" />
                          <span>পড়ার নিয়ম ও বিস্তারিত নির্দেশনা</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <p className={`text-xs sm:text-[13.5px] text-emerald-100 leading-relaxed font-semibold transition-all ${
                        isExpanded ? '' : 'line-clamp-2'
                      }`}>
                        {item.instructionsBn}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
