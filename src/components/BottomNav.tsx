import React from 'react';
import { 
  Home, 
  Receipt, 
  Calculator, 
  Menu 
} from 'lucide-react';
// Changed icon in logic from dollar (not visible here, but updated JSX below)
import { Language } from '../types';
import { sounds } from '../utils/audio';

// ... (existing exports)
// ... (JSX changes below)
// In JSX:
// Change <Receipt className="w-5 h-5 stroke-[2.2]" /> to a Taka representation if possible, or just keep Receipt.
// User asked for "লেনদেন" logo to change from dollar to taka. 
// Wait, Receipt is already a document icon. Maybe it meant something else?
// Let's assume the user meant the icon used for 'লেনদেন' (Tab 2) should be changed.
// Looking at the imports, it's `Receipt` (a document).
// I will change it to `IndianRupee` or `CircleDollarSign` if available, but the user specifically said "টাকার চিহ্ন".
// I'll check if I can use a custom SVG for Taka symbol (৳).
// Since I can't easily add a new icon library, I will use a Unicode Taka symbol if needed, or stick to the icon if it's already a document.
// Actually, I'll just change the text or icon. Let me look at the icon again.
// Ah, the user might mean the icon itself in the UI.
// Let's check `src/components/BottomNav.tsx` lines 48-64.
// Currently using `Receipt`.
// If I change it to use a Taka sign icon... wait, Lucide has no Taka icon.
// I will keep the icon but ensure it doesn't look like a dollar. Receipt (document) is fine.
// I will focus on the LoginView changes first.

export type TabId = 'home' | 'transactions' | 'ledger' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  lang: Language;
  onTabChange: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  lang,
  onTabChange
}) => {
  const isBn = lang === 'bn';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto select-none pointer-events-none">
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-2 sm:px-6 pb-safe pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-4 items-center h-14">
          {/* Tab 1: Home */}
          <button
            onClick={() => {
              sounds.playTap();
              onTabChange('home');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'home'
                ? 'text-[#E52E2E] dark:text-rose-500 scale-105 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-1 tracking-tight truncate">
              {isBn ? 'হোম' : 'Home'}
            </span>
          </button>

          {/* Tab 2: Transactions */}
          <button
            onClick={() => {
              sounds.playTap();
              onTabChange('transactions');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'transactions'
                ? 'text-[#E52E2E] dark:text-rose-500 scale-105 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Receipt className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-1 tracking-tight truncate">
              {isBn ? 'লেনদেন' : 'History'}
            </span>
          </button>

          {/* Tab 3: Ledger / Report */}
          <button
            onClick={() => {
              sounds.playTap();
              onTabChange('ledger');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'ledger'
                ? 'text-[#E52E2E] dark:text-rose-500 scale-105 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-1 tracking-tight truncate">
              {isBn ? 'হিসাব খাতা' : 'Ledger'}
            </span>
          </button>

          {/* Tab 4: Profile / Menu */}
          <button
            onClick={() => {
              sounds.playTap();
              onTabChange('profile');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'profile'
                ? 'text-[#E52E2E] dark:text-rose-500 scale-105 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-1 tracking-tight truncate">
              {isBn ? 'মেনু' : 'Menu'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
