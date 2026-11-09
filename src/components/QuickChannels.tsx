import React from 'react';
import { 
  ArrowRight, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calculator, 
  Sliders, 
  WalletCards,
  Users,
  FileText
} from 'lucide-react';
import { Language, Transaction, PaymentChannel, UserSession, StaffAccount } from '../types';
import { formatCurrency } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { SmartChannelIcon, getChannelGradient } from './SmartChannelIcon';

interface QuickChannelsProps {
  transactions: Transaction[];
  channels: PaymentChannel[];
  staffAccounts?: StaffAccount[];
  lang: Language;
  user: UserSession | null;
  onSelectMethod: (method: string) => void;
  onOpenChannelManager: () => void;
  onOpenIncome: (method?: string) => void;
  onOpenExpense: (method?: string) => void;
  onOpenLedger: () => void;
  onOpenStaffManager?: () => void;
  serviceStatuses: Record<string, any>;
  currentMonthIndex: number;
  currentYear: number;
}

export const QuickChannels: React.FC<QuickChannelsProps> = ({
  transactions,
  channels,
  staffAccounts = [],
  lang,
  user,
  onSelectMethod,
  onOpenChannelManager,
  onOpenIncome,
  onOpenExpense,
  onOpenLedger,
  onOpenStaffManager,
  serviceStatuses,
  currentMonthIndex,
  currentYear
}) => {
  const isBn = lang === 'bn';

  const isTrxLocked = serviceStatuses.transactions?.isActive === false || String(serviceStatuses.transactions?.isActive) === 'false';
  const isStaffLocked = serviceStatuses.staffManager?.isActive === false || String(serviceStatuses.staffManager?.isActive) === 'false';
  const isLedgerLocked = serviceStatuses.ledger?.isActive === false || String(serviceStatuses.ledger?.isActive) === 'false';

  const filteredTransactions = transactions.filter(t => {
    if (!t || t.isDeleted === true || (t as any).isDeleted === 'true') return false;
    if (!t.date) return false;
    const parts = t.date.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      return month === currentMonthIndex && year === currentYear;
    }
    const d = new Date(t.date);
    return !isNaN(d.getTime()) && d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear;
  });

  const balances: Record<string, number> = {};
  channels.forEach(ch => {
    balances[ch.name] = 0;
  });

  filteredTransactions.forEach(trx => {
    const m = trx.method;
    const amt = Number(trx.amount) || 0;
    if (balances[m] !== undefined) {
      if (trx.type === 'income') {
        balances[m] += amt;
      } else {
        balances[m] -= amt;
      }
    }
  });

  const bankChannel = channels.find(c => c.name === 'ব্যাংক');
  const bankBalance = balances['ব্যাংক'] || 0;
  const nonBankChannels = channels.filter(c => c.name !== 'ব্যাংক');
  
  return (
    <div className="px-4 py-3 select-none">
      {/* Title & Channel Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <WalletCards className="w-4 h-4 text-[#E52E2E]" />
          <span>{isBn ? 'পেমেন্ট চ্যানেল ও ব্যালেন্স হিসাব' : 'Payment Channels & Balance'}</span>
        </h3>
        
        {user?.role === 'admin' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Direct Income / Money Addition Button - PROMINENT FOR ADMIN */}
            <button
              onClick={() => {
                sounds.playTap();
                onOpenIncome();
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isBn ? 'টাকা জমা' : '+ Deposit'}</span>
            </button>

            {/* Direct Expense Button */}
            <button
              onClick={() => {
                sounds.playTap();
                onOpenExpense();
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isBn ? 'টাকা খরচ' : '- Expense'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onOpenChannelManager();
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/60 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isBn ? 'ম্যানেজ' : 'Manage'}</span>
            </button>
          </div>
        )}
      </div>

      <>
        {/* Featured Bank Account Card with Smart Modern Icon */}
        {bankChannel && (
          <div
            onClick={() => {
              sounds.playTap();
              onSelectMethod('ব্যাংক');
            }}
            className={`mb-3 p-3.5 rounded-3xl border shadow-xs cursor-pointer hover:shadow-md active:scale-[0.985] transition-all flex items-center justify-between group ${
              isTrxLocked
                ? 'bg-slate-200 dark:bg-slate-800 grayscale border-slate-300 dark:border-slate-700 opacity-70'
                : 'bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border-blue-200/80 dark:border-blue-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Smart Bank Gradient Tile */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getChannelGradient('ব্যাংক')} group-hover:scale-105 transition-transform`}>
                <SmartChannelIcon method="ব্যাংক" className="w-6 h-6 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'ব্যাংক লেনদেন (সকল ব্যাংক)' : 'Bank Accounts'}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 uppercase tracking-wider">
                    {isBn ? 'ব্যাংক' : 'Bank'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isBn ? 'ব্র্যাক, ইসলামী ব্যাংক, ডাচ-বাংলা ইত্যাদি' : 'BRAC, IBBL, DBBL & other banks'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h4 className="text-base font-extrabold text-blue-700 dark:text-blue-400 tabular-nums">
                {formatCurrency(bankBalance, lang)}
              </h4>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-end gap-0.5 mt-0.5 group-hover:text-blue-600 transition-colors">
                {isBn ? 'স্টেটমেন্ট' : 'Details'}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        )}

        {/* Grid Channels: বিকাশ হিসাব, নগদ হিসাব, রকেট হিসাব, ক্যাশ হিসাব ইত্যাদি */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {nonBankChannels.map((ch) => {
            const bal = balances[ch.name] || 0;
            const iconGradient = getChannelGradient(ch.name);

            return (
              <div
                key={ch.id || ch.name}
                onClick={() => {
                  sounds.playTap();
                  onSelectMethod(ch.name);
                }}
                className={`p-3.5 rounded-3xl border shadow-2xs cursor-pointer hover:shadow-md active:scale-98 transition-all flex flex-col justify-between group ${
                  isTrxLocked
                    ? 'bg-slate-200 dark:bg-slate-800 grayscale border-slate-300 dark:border-slate-700 opacity-70'
                    : `${ch.bg} border-${ch.border.split(' ')[0].replace('border-', '')}`
                } ${!isTrxLocked && ch.border}`}
              >
                {/* Header row: Smart Modern Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconGradient} group-hover:scale-105 transition-transform overflow-hidden`}>
                    <SmartChannelIcon method={ch.name} imageUrl={ch.imageUrl} className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Subtitle & Balance */}
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {isBn ? ch.labelBn : ch.labelEn}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <h4 className={`text-base font-extrabold ${ch.color} tabular-nums leading-tight`}>
                      {formatCurrency(bal, lang)}
                    </h4>
                    <div className="flex items-center gap-1">
                      {user?.role === 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playTap();
                            onOpenIncome(ch.name);
                          }}
                          className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-all"
                          title={isBn ? 'টাকা জমা' : 'Add Money'}
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      )}
                      <div className="w-6 h-6 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100 shadow-2xs transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>

      {/* NEW FEATURE CATEGORY: স্টাফ কালেকশন / কোম্পানি পাওনা (মোবাইল ব্যাংকিং এর নিচে) */}
      <div className="mt-3.5">
        <div
          onClick={() => {
            sounds.playTap();
            if (onOpenStaffManager) onOpenStaffManager();
          }}
          className={`p-4 rounded-3xl text-white border shadow-md cursor-pointer hover:shadow-lg active:scale-[0.985] transition-all flex items-center justify-between group ${
            isStaffLocked
              ? 'bg-slate-700 grayscale border-slate-600 opacity-80'
              : 'bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">
                  {isBn ? 'স্টাফ কালেকশন ও কোম্পানি পাওনা' : 'Staff Collection & Company Dues'}
                </h4>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-wider">
                  {isBn ? 'ব্যক্তি হিসাব' : 'Staff Ledger'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {isBn ? 'ফিল্ড কালেকশন জমা, ব্যক্তি হিসাব খাতা ও পিডিএফ রিপোর্ট' : 'Field Collections, Staff Ledgers & PDF Reports'}
              </p>
            </div>
          </div>

          <div className="text-right pl-2">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <span>{isBn ? 'হিসাব খাতা' : 'Manage'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
