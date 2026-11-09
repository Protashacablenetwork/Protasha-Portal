import React, { useState } from 'react';
import { Compass, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { PRAYER_RULES_GUIDE } from '../data/prayerRulesData';
import { sounds } from '../utils/audio';

interface PrayerRulesViewerProps {
  onBack: () => void;
}

export const PrayerRulesViewer: React.FC<PrayerRulesViewerProps> = ({ onBack }) => {
  const [openSectionId, setOpenSectionId] = useState<string>(PRAYER_RULES_GUIDE[0].id);

  const toggleSection = (id: string) => {
    sounds.playTap();
    setOpenSectionId(prev => prev === id ? '' : id);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-gradient-to-br from-[#003d32] via-[#003328] to-[#001d18] border border-emerald-500/30 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <Compass className="w-20 h-20 text-emerald-400" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>নামাজের নিয়ম কানুন</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 font-bold max-w-md leading-relaxed">
            অযু থেকে শুরু করে নামাজের ফরজ, ওয়াজিব ও সঠিক নিয়ম কানুন সম্ভার।
          </p>
        </div>
      </div>

      {/* Guide Accordions */}
      <div className="space-y-4">
        {PRAYER_RULES_GUIDE.map(section => {
          const isOpen = openSectionId === section.id;
          return (
            <div
              key={section.id}
              className={`rounded-[40px] transition-all duration-500 relative overflow-hidden ring-1 ring-white/5 ${
                isOpen ? 'bg-[#0b2b24] shadow-2xl border border-emerald-500/30' : 'bg-[#0b2b24]/60 border border-emerald-800/40 hover:bg-[#0b2b24]/80 shadow-xl'
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 sm:p-8 flex items-center justify-between gap-4 text-left transition-all cursor-pointer relative z-10"
              >
                <div className="flex items-center gap-5">
                  <span className="w-14 h-14 rounded-3xl bg-[#003d32] text-3xl flex items-center justify-center border border-emerald-800/50 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    {section.icon}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-sm">
                      {section.titleBn}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-200/50 font-bold mt-1 uppercase tracking-wider">
                      {section.subtitleBn}
                    </p>
                  </div>
                </div>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-180 shadow-lg' : 'bg-white/5 text-emerald-500 hover:bg-white/10'}`}>
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
                </div>
              </button>

              {isOpen && (
                <div className="p-6 sm:p-8 pt-0 border-t border-emerald-950/50 bg-black/10 space-y-4 animate-in slide-in-from-top-4 duration-300 relative z-10">
                  <div className="flex items-center gap-2.5 mb-4 text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] opacity-60">
                     <Info className="w-4 h-4" />
                     <span>বিস্তারিত মাসআলা ও নিয়ম</span>
                  </div>
                  {section.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-[32px] bg-[#001d18]/60 border border-emerald-900/40 flex items-start gap-4 hover:bg-[#001d18]/80 transition-colors shadow-inner"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-950/80 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-800/50 shadow-sm mt-0.5">
                         <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-sm text-emerald-100/60 mt-2 leading-relaxed font-bold">
                          {step.description}
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
    </div>
  );
};
