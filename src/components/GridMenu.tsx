import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Calculator
} from 'lucide-react';
import { Language, PaymentChannel } from '../types';
import { sounds } from '../utils/audio';
import { SmartChannelIcon, getChannelGradient } from './SmartChannelIcon';

interface GridMenuProps {
  lang: Language;
  channels: PaymentChannel[];
  onOpenIncome: () => void;
  onOpenExpense: () => void;
  onOpenChannels: () => void;
  onOpenLedger: () => void;
  onSelectChannel: (methodName: string) => void;
  onOpenNetBill: () => void;
  user: any;
}

export const GridMenu: React.FC<GridMenuProps> = ({
  lang,
  channels,
  onOpenIncome,
  onOpenExpense,
  onOpenChannels,
  onOpenLedger,
  onSelectChannel,
  onOpenNetBill,
  user
}) => {
  const isBn = lang === 'bn';

  // 8 Grid items arranged according to user specification:
  // Item 2: বিকাশ (bKash) with Modern Smart Icon
  // Item 3: নগদ (Nagad) with Modern Smart Icon
  // Item 8: রকেট (Rocket) with Modern Smart Icon
  const menuItems = [
    // 1st Item
    {
      id: 'income',
      title: isBn ? 'জমা এন্ট্রি' : 'Income Entry',
      iconType: 'lucide' as const,
      lucideIcon: ArrowDownLeft,
      color: 'text-[#E52E2E]',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/40',
      action: onOpenIncome
    },
    // 2nd Item: বিকাশ (bKash) - Smart modern icon
    {
      id: 'bkash',
      title: isBn ? 'বিকাশ হিসাব' : 'bKash',
      iconType: 'channel' as const,
      channelName: 'বিকাশ',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-950/40',
      border: 'border-pink-200/80 dark:border-pink-900/50',
      action: () => onSelectChannel('বিকাশ')
    },
    // 3rd Item: নগদ (Nagad) - Smart modern icon
    {
      id: 'nagad',
      title: isBn ? 'নগদ হিসাব' : 'Nagad',
      iconType: 'channel' as const,
      channelName: 'নগদ',
      color: 'text-[#E52E2E]',
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      border: 'border-orange-200/80 dark:border-orange-900/50',
      action: () => onSelectChannel('নগদ')
    },
    // 4th Item: ব্যাংক (Bank)
    {
      id: 'bank',
      title: isBn ? 'ব্যাংক লেনদেন' : 'Bank',
      iconType: 'channel' as const,
      channelName: 'ব্যাংক',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200/80 dark:border-blue-900/50',
      action: () => onSelectChannel('ব্যাংক')
    },
    // 5th Item: খরচ এন্ট্রি
    {
      id: 'expense',
      title: isBn ? 'খরচ এন্ট্রি' : 'Expense Entry',
      iconType: 'lucide' as const,
      lucideIcon: ArrowUpRight,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/40',
      action: onOpenExpense
    },
    // 6th Item: চ্যানেল যোগ
    {
      id: 'channels',
      title: isBn ? 'চ্যানেল যোগ' : 'Add Channels',
      iconType: 'lucide' as const,
      lucideIcon: Wallet,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/40',
      action: onOpenChannels
    },
    // 7th Item: হিসাব খাতা
    {
      id: 'ledger',
      title: isBn ? 'হিসাব খাতা' : 'Ledger Book',
      iconType: 'lucide' as const,
      lucideIcon: Calculator,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      action: onOpenLedger
    },
    // 8th Item: রকেট (Rocket DBBL) - Smart modern icon
    {
      id: 'rocket',
      title: isBn ? 'রকেট হিসাব' : 'Rocket DBBL',
      iconType: 'channel' as const,
      channelName: 'রকেট',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200/80 dark:border-purple-900/50',
      action: () => onSelectChannel('রকেট')
    },
    // 9th Item: নেট বিল (Net Bill)
    {
      id: 'netbill',
      title: isBn ? 'নেট বিল' : 'Net Bill',
      iconType: 'lucide' as const,
      lucideIcon: Calculator,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      action: onOpenNetBill
    }
  ];

  return (
    <div className="px-4 py-3 select-none">
      <div className="grid grid-cols-4 gap-2.5">
          {menuItems.map((item) => {
            if (['income', 'expense', 'channels'].includes(item.id) && user?.role !== 'admin') return null;
            
            const matchedChannel = item.channelName 
              ? channels.find(c => c.name === item.channelName) 
              : undefined;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playTap();
                  item.action();
                }}
                className="group flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900 active:scale-95 transition-all duration-150 min-h-[88px]"
              >
                {item.iconType === 'channel' ? (
                  <div
                    className={`w-11 h-11 rounded-2xl ${getChannelGradient(item.channelName)} flex items-center justify-center mb-1 group-hover:scale-105 transition-transform overflow-hidden`}
                  >
                    <SmartChannelIcon method={item.channelName} imageUrl={matchedChannel?.imageUrl} className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div
                    className={`w-11 h-11 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center mb-1 group-hover:scale-105 transition-transform`}
                  >
                    {item.lucideIcon && (
                      <item.lucideIcon className={`w-5 h-5 ${item.color} stroke-[1.9]`} />
                    )}
                  </div>
                )}
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight line-clamp-2">
                  {item.title}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
};
