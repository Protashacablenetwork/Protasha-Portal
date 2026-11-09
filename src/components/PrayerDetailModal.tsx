import React from 'react';
import { X, Sparkles, BookOpen, Clock, HeartHandshake, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PrayerCardDetail } from '../data/prayerCardDetails';
import { ALL_PRAYER_NIYATS } from '../data/prayerRulesData';
import { sounds } from '../utils/audio';

interface PrayerDetailModalProps {
  detail: PrayerCardDetail | null;
  onClose: () => void;
  onOpenFullNiyat: (searchKey: string) => void;
}

export const PrayerDetailModal: React.FC<PrayerDetailModalProps> = ({
  detail,
  onClose,
  onOpenFullNiyat
}) => {
  if (!detail) return null;

  const niyats = ALL_PRAYER_NIYATS.filter(n => detail.niyatIds.includes(n.id));

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#002820] border border-emerald-500/40 text-white w-full max-w-2xl rounded-[36px] overflow-hidden flex flex-col max-h-[90vh] shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#003d32] to-[#002b23] border-b border-emerald-800/40 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#001d18] border border-emerald-600/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {detail.icon}
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-amber-300 leading-tight">
                {detail.nameBn}
              </h3>
              <p className="text-[11.5px] sm:text-[13px] text-emerald-200/80 font-bold flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{detail.timeNoteBn}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer border border-white/10 shadow-sm shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-none">
          
          {/* Rakat Breakdown Summary Card */}
          <div className="p-5 rounded-[28px] bg-[#0b382f] border border-emerald-600/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <span className="text-[12px] uppercase font-black text-amber-400 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>কত রাকাত নামাজ (রাকাত বিবরণী)</span>
              </span>
              <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700/50 shadow-inner">
                {detail.totalRakatsBn}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {detail.rakatBreakdown.map((r, i) => {
                let badgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
                if (r.type === 'farz') badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
                else if (r.type === 'wajib') badgeStyle = 'bg-purple-950/80 text-purple-300 border-purple-700/50';
                else if (r.type === 'nafl') badgeStyle = 'bg-teal-950/80 text-teal-300 border-teal-700/50';

                return (
                  <div key={i} className="p-3.5 rounded-2xl bg-[#00241c] border border-emerald-800/30 flex items-center justify-between gap-2 shadow-inner">
                    <span className="text-xs font-black text-white">{r.label}</span>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${badgeStyle} shrink-0`}>
                      {r.rakats}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authentic Hadith & Virtue */}
          <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#0b2b24] to-[#06241e] border border-amber-500/30 space-y-3 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>সহীহ হাদিস ও ফযীলত</span>
            </div>
            
            <p className="text-sm sm:text-[15px] font-bold text-amber-100 leading-relaxed italic font-serif">
              "{detail.hadithBn.text}"
            </p>
            <p className="text-[11.5px] font-black text-amber-300/80 text-right">
              — {detail.hadithBn.reference}
            </p>

            <div className="pt-2 border-t border-emerald-800/40 text-xs text-emerald-200/90 font-semibold leading-relaxed">
              💡 <span className="font-bold text-amber-200">বিশেষ ফযীলত:</span> {detail.virtueBn}
            </div>
          </div>

          {/* Niyats Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <HeartHandshake className="w-4.5 h-4.5 text-emerald-400" />
              <span>এই ওয়াক্তের নিয়ত ও পড়ার নিয়মাবলী</span>
            </h4>

            {niyats.map(n => (
              <div key={n.id} className="p-5 rounded-[30px] bg-[#0b2b24] border border-emerald-800/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
                  <h5 className="text-sm sm:text-base font-black text-white">{n.prayerNameBn}</h5>
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {n.rakatCountBn}
                  </span>
                </div>

                {/* Arabic */}
                <div className="p-4 rounded-2xl bg-[#001d18] border border-emerald-900/40 text-right font-serif text-xl sm:text-2xl text-amber-100 leading-[2]">
                  {n.niyatAr}
                </div>

                {/* Pronunciation & Meaning */}
                <div className="space-y-2 text-xs sm:text-[13.5px]">
                  <div className="p-3.5 rounded-2xl bg-black/25 border border-emerald-900/30">
                    <span className="text-[10.5px] font-black text-amber-400 uppercase block mb-1">উচ্চারণ:</span>
                    <p className="text-slate-200 font-bold italic">{n.niyatTranslitBn}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
                    <span className="text-[10.5px] font-black text-emerald-400 uppercase block mb-1">অর্থ:</span>
                    <p className="text-emerald-100 font-black">"{n.meaningBn}"</p>
                  </div>

                  {n.instructionsBn && (
                    <div className="p-3.5 rounded-2xl bg-[#00382d]/60 border border-emerald-700/40">
                      <span className="text-[10.5px] font-black text-amber-300 uppercase block mb-1">পড়ার নিয়ম:</span>
                      <p className="text-emerald-100 font-semibold">{n.instructionsBn}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#00211a] border-t border-emerald-800/40 flex items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenFullNiyat(detail.nameBn.split(' ')[0]);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer border border-emerald-400/20"
          >
            <span>সকল নিয়ত দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer border border-white/10 shrink-0"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
