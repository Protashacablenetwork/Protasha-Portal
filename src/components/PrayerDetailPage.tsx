import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Clock, HeartHandshake, Info, ArrowRight } from 'lucide-react';
import { PrayerCardDetail } from '../data/prayerCardDetails';
import { ALL_PRAYER_NIYATS } from '../data/prayerRulesData';
import { sounds } from '../utils/audio';

interface PrayerDetailPageProps {
  detail: PrayerCardDetail | null;
  onBack: () => void;
  onOpenFullNiyat: (searchKey: string) => void;
}

export const PrayerDetailPage: React.FC<PrayerDetailPageProps> = ({
  detail,
  onBack,
  onOpenFullNiyat
}) => {
  if (!detail) return null;

  const niyats = ALL_PRAYER_NIYATS.filter(n => detail.niyatIds.includes(n.id));

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* Page Header Banner */}
      <div className="rounded-[36px] p-6 sm:p-8 bg-gradient-to-br from-[#003d32] via-[#003328] to-[#001d18] border border-emerald-500/40 shadow-2xl relative overflow-hidden group text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <div className="text-8xl">{detail.icon}</div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#00241c] border border-emerald-600/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
              {detail.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight drop-shadow-md">
                {detail.nameBn}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-bold flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{detail.timeNoteBn}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rakat Breakdown Summary Card */}
      <div className="p-6 sm:p-7 rounded-[36px] bg-[#0b2b24] border border-emerald-800/40 space-y-4 shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center justify-between border-b border-emerald-950/60 pb-4">
          <span className="text-xs sm:text-sm uppercase font-black text-amber-400 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
            <span>কত রাকাত নামাজ (রাকাত বিবরণী)</span>
          </span>
          <span className="text-xs sm:text-sm font-black px-4 py-1.5 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700/50 shadow-inner">
            {detail.totalRakatsBn}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {detail.rakatBreakdown.map((r, i) => {
            let badgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
            if (r.type === 'farz') badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
            else if (r.type === 'wajib') badgeStyle = 'bg-purple-950/80 text-purple-300 border-purple-700/50';
            else if (r.type === 'nafl') badgeStyle = 'bg-teal-950/80 text-teal-300 border-teal-700/50';

            return (
              <div key={i} className="p-4 rounded-[22px] bg-[#00241c] border border-emerald-800/40 flex items-center justify-between gap-3 shadow-inner">
                <span className="text-sm font-black text-white">{r.label}</span>
                <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${badgeStyle} shrink-0`}>
                  {r.rakats}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authentic Hadith & Virtue */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-gradient-to-br from-[#0b2b24] to-[#06241e] border border-amber-500/30 space-y-4 shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>সহীহ হাদিস ও ফযীলত</span>
        </div>
        
        <p className="text-base sm:text-lg font-bold text-amber-100 leading-relaxed italic font-serif">
          "{detail.hadithBn.text}"
        </p>
        <p className="text-xs sm:text-sm font-black text-amber-300/90 text-right">
          — {detail.hadithBn.reference}
        </p>

        <div className="pt-3 border-t border-emerald-800/40 text-xs sm:text-sm text-emerald-200/90 font-semibold leading-relaxed">
          💡 <span className="font-bold text-amber-200">বিশেষ ফযীলত:</span> {detail.virtueBn}
        </div>
      </div>

      {/* Niyats Section */}
      <div className="space-y-5">
        <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wider flex items-center gap-2.5">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <span>এই ওয়াক্তের নিয়ত ও পড়ার বিস্তারিত নিয়মাবলী</span>
        </h3>

        {niyats.map(n => (
          <div key={n.id} className="p-6 sm:p-8 rounded-[36px] bg-[#0b2b24] border border-emerald-800/40 space-y-5 shadow-2xl ring-1 ring-white/5">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3.5">
              <h4 className="text-base sm:text-xl font-black text-white">{n.prayerNameBn}</h4>
              <span className="text-xs font-black px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                {n.rakatCountBn}
              </span>
            </div>

            {/* Arabic */}
            <div className="p-5 sm:p-7 rounded-[28px] bg-[#001d18] border border-emerald-900/40 text-right font-serif text-2xl sm:text-3xl text-amber-100 leading-[2.2] shadow-inner">
              {n.niyatAr}
            </div>

            {/* Pronunciation & Meaning */}
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-[24px] bg-black/30 border border-emerald-900/30">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block mb-1">বাংলা উচ্চারণ:</span>
                <p className="text-xs sm:text-[14.5px] text-slate-200 font-bold italic leading-relaxed">{n.niyatTranslitBn}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-[24px] bg-emerald-950/40 border border-emerald-800/40">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block mb-1">বাংলা অর্থ:</span>
                <p className="text-xs sm:text-[14.5px] text-emerald-50 font-black leading-relaxed">"{n.meaningBn}"</p>
              </div>

              {n.instructionsBn && (
                <div className="p-4 sm:p-5 rounded-[24px] bg-[#00382d]/70 border border-emerald-700/40">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>পড়ার নিয়ম ও বিস্তারিত নির্দেশনা:</span>
                  </span>
                  <p className="text-xs sm:text-[14px] text-emerald-100 font-semibold leading-relaxed">{n.instructionsBn}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation Button */}
      <div className="pt-4 flex items-center justify-end">
        <button
          onClick={() => {
            sounds.playTap();
            onOpenFullNiyat(detail.nameBn.split(' ')[0]);
          }}
          className="w-full py-4 px-6 rounded-[24px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer border border-emerald-400/20"
        >
          <span>সকল নিয়তের ভিউয়ার</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
