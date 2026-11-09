import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ArrowLeft, BookmarkCheck, Share2 } from 'lucide-react';
import { AUTHENTIC_HADITHS, HadithItem } from '../data/hadithData';
import { sounds } from '../utils/audio';

interface HadithViewerProps {
  onBack: () => void;
}

export const HadithViewer: React.FC<HadithViewerProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('সব');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topics = useMemo(() => {
    const list = Array.from(new Set(AUTHENTIC_HADITHS.map(h => h.topicBn)));
    return ['সব', ...list];
  }, []);

  const filteredHadiths = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AUTHENTIC_HADITHS.filter(h => {
      const matchTopic = selectedTopic === 'সব' || h.topicBn === selectedTopic;
      const matchSearch = !q ||
        h.textBn.toLowerCase().includes(q) ||
        h.topicBn.toLowerCase().includes(q) ||
        h.sourceBn.toLowerCase().includes(q) ||
        h.narratorBn.toLowerCase().includes(q) ||
        h.textAr.includes(q);
      return matchTopic && matchSearch;
    });
  }, [search, selectedTopic]);

  const handleCopyHadith = (hadith: HadithItem) => {
    sounds.playTap();
    const text = `【${hadith.topicBn}】\n${hadith.textAr}\n\nঅনুবাদ: ${hadith.textBn}\n\nবর্ণনাকারী: ${hadith.narratorBn}\nউৎস: ${hadith.sourceBn}${hadith.hadithNo ? ` (${hadith.hadithNo})` : ''}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(hadith.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/30 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>সহীহ হাদিস সম্ভার</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            সহীহ বুখারী ও মুসলিম শরীফের নির্বাচিত সহীহ হাদিস (আরবি ও বাংলা অর্থ সহ)
          </p>
        </div>
      </div>

      {/* Search & Topic Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="হাদিস অনুসন্ধান (বিষয়, অনুবাদ, বর্ণনাকারী)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => {
                sounds.playTap();
                setSelectedTopic(t);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedTopic === t
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-emerald-900/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith Cards */}
      <div className="space-y-3.5">
        {filteredHadiths.map(hadith => (
          <div
            key={hadith.id}
            className="rounded-3xl p-4 sm:p-6 bg-slate-900/90 border border-emerald-800/40 hover:border-emerald-500/40 transition-all shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-emerald-950 pb-2.5">
              <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>{hadith.topicBn}</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {hadith.sourceBn} {hadith.hadithNo && `• ${hadith.hadithNo}`}
                </span>

                <button
                  onClick={() => handleCopyHadith(hadith)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="হাদিস কপি করুন"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Arabic Hadith Text */}
            <p
              className="text-right text-xl sm:text-2xl leading-[2] text-amber-100 font-serif font-normal select-text tracking-wide pt-1"
              dir="rtl"
            >
              {hadith.textAr}
            </p>

            {/* Bengali Translation */}
            <div className="pt-2 border-t border-emerald-900/30">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                "{hadith.textBn}"
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-400/90 font-semibold mt-1.5">
                — {hadith.narratorBn}
              </p>
            </div>

            {copiedId === hadith.id && (
              <p className="text-[11px] text-emerald-300 font-bold text-right animate-pulse">
                ✓ ক্লিপবোর্ডে কপি হয়েছে!
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
