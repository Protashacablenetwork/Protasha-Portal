import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, translations } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface BalanceCardProps {
  balance: number;
  lang: Language;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleToggle = () => {
    sounds.playBalanceChime();
    const nextState = !isVisible;
    setIsVisible(nextState);

    if (nextState) {
      // Gentle mini confetti burst from card position
      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.28 },
          colors: ['#E52E2E', '#FF9800', '#4CAF50', '#2196F3'],
          disableForReducedMotion: true
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="relative px-4 -mt-5 z-20">
      <div
        onClick={handleToggle}
        className="relative overflow-hidden w-full bg-white dark:bg-slate-900 rounded-3xl p-3.5 shadow-md shadow-rose-900/5 dark:shadow-none border border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none active:scale-[0.985] transition-all duration-200 hover:border-rose-200"
      >
        {/* Left Side: ৳ Icon badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#D32F2F] to-[#E52E2E] shadow-sm shadow-rose-500/30 flex items-center justify-center text-white text-xl font-bold">
            ৳
          </div>

          <div className="flex flex-col justify-center">
            {isVisible ? (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mb-0.5">
                  {lang === 'bn' ? 'মোট বর্তমান ব্যালেন্স' : 'Current Net Balance'}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[#E52E2E] dark:text-rose-400 tabular-nums">
                  {formatCurrency(balance, lang)}
                </h3>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <h4 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                  {t.tap_to_check_balance}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {lang === 'bn' ? 'ট্যাপ করে নগদ ও মোট হিসাব দেখুন' : 'Tap to reveal live ledger'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Toggle indicator */}
        <div className="pr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          {isVisible ? (
            <div className="flex items-center gap-1 text-[11px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
              <EyeOff className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লুকান' : 'Hide'}</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Eye className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
