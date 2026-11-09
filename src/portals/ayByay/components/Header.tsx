import React from 'react';
import { AppConfig, AppNavTab } from '../types';
import { 
  Download,
  RefreshCw,
  LayoutDashboard,
  Users,
  PlusCircle,
  ReceiptText,
  Wallet,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
  BarChart,
  Boxes,
  LineChart,
  BarChart3,
  Network,
  ArrowLeft,
  Cloud
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  config: AppConfig;
  activeNav: AppNavTab;
  onNavChange: (nav: AppNavTab) => void;
  onOpenReportModal: () => void;
  onExportCsv: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenNewMonthModal: () => void;
  onExit?: () => void;
  onOpenDriveBackup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeNav,
  onNavChange,
  onOpenReportModal,
  onExportCsv,
  isDarkMode,
  onToggleDarkMode,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenNewMonthModal,
  onExit,
  onOpenDriveBackup
}) => {

  return (
    <header className="app-header mb-1 sm:mb-2 pt-0.5 pb-1 px-3 sm:px-5 transition-all duration-200 no-print bg-transparent text-slate-900 dark:text-white max-w-full overflow-x-auto scrollbar-none">
      {/* Top Branding & Utilities in a clean single line */}
      <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-slate-200/80 dark:border-slate-800 min-w-[320px]">
        {/* Title and Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onExit && (
            <button
              onClick={onExit}
              className="hidden md:flex w-10 h-10 rounded-xl items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-all mr-1"
              title="অ্যাপ ড্যাশবোর্ডে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
          <img 
            src="https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png" 
            alt="আয়-ব্যয় লোগো" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shadow-emerald-100 dark:shadow-none shrink-0" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                <span className="text-emerald-600 dark:text-emerald-400">আয়</span>
                <span className="text-slate-900 dark:text-white">-</span>
                <span className="text-rose-600 dark:text-rose-400">ব্যয়</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:!text-white font-medium tracking-wide">
              স্মার্ট ব্যবস্থাপনা
            </p>
          </div>
        </div>

        {/* Utilities: Google Sheets & PWA & Dark/Light Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Real-time Firestore Sync Status Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              config.syncStatus === 'connected' ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' :
              config.syncStatus === 'syncing' ? 'bg-amber-500 shadow-xs shadow-amber-500/50' :
              'bg-rose-500 shadow-xs shadow-rose-500/50'
            }`} />
            <span className="whitespace-nowrap">
              {config.syncStatus === 'connected' ? 'ক্লাউড সিঙ্ক সক্রিয়' :
               config.syncStatus === 'syncing' ? 'সিঙ্ক হচ্ছে...' :
               'অফলাইন মোড'}
            </span>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-[11px] sm:text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs transition active:scale-95 shrink-0 cursor-pointer"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="whitespace-nowrap">লাইট</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="whitespace-nowrap">ডার্ক</span>
              </>
            )}
          </button>

          {/* Export CSV Button (Strictly visible on PC/Desktop, hidden on mobile) */}
          <button
            id="btn-export-csv"
            onClick={onExportCsv}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition shadow-2xs active:scale-95 shrink-0 cursor-pointer"
            title="এক্সেল / CSV রিপোর্ট ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>এক্সেল এক্সপোর্ট (CSV)</span>
          </button>

          {/* Centralized Google Drive Backup Button (Hidden on Mobile, Visible on Desktop/PC) */}
          {onOpenDriveBackup && (
            <button
              onClick={onOpenDriveBackup}
              title="গুগল ড্রাইভ সেন্ট্রালাইজড ব্যাকআপ ও রিস্টোর"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 text-[11px] sm:text-xs font-bold border border-blue-200 dark:border-blue-800 transition shadow-2xs active:scale-95 shrink-0 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span><span className="hidden sm:inline">ড্রাইভ </span>ব্যাকআপ</span>
            </button>
          )}

          {/* Admin Login / Logout Button at end of Header */}
          {isAdminLoggedIn ? (
            <button
              id="btn-admin-logout"
              onClick={onAdminLogout}
              title="এডমিন লগআউট করুন"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="whitespace-nowrap"><span className="hidden sm:inline">এডমিন </span>লগআউট</span>
            </button>
          ) : (
            <button
              id="btn-admin-login"
              onClick={onOpenAdminLogin}
              title="এডমিন প্যানেলে লগইন করুন"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="whitespace-nowrap"><span className="hidden sm:inline">এডমিন </span>লগইন</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar (Desktop and Tablet ONLY) */}
      <nav className="hidden md:flex flex-wrap items-center gap-2 mt-3 pb-1">
        <button
          onClick={() => onNavChange('dashboard')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'dashboard' || activeNav === 'card_detail'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-indigo-400 dark:text-indigo-300" />
          <span>ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => onNavChange('inventory')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'inventory'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <Boxes className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>মালামাল স্টক (Inventory)</span>
        </button>

        <button
          onClick={() => onNavChange('analytics')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'analytics'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>চার্ট ও গ্রাফ (Analytics)</span>
        </button>

        <button
          onClick={() => onNavChange('staff')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'staff'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>স্টাফ ও বেতন</span>
        </button>

        {isAdminLoggedIn && (
          <button
            onClick={() => onNavChange('new_entry')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeNav === 'new_entry'
                ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>নতুন এন্ট্রি</span>
          </button>
        )}

        <button
          onClick={() => onNavChange('transactions')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'transactions'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <ReceiptText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          <span>লেনদেন খতিয়ান</span>
        </button>

        <button
          onClick={() => onNavChange('report')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeNav === 'report'
              ? 'bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          <BarChart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>মাসিক রিপোর্ট</span>
        </button>
      </nav>
    </header>
  );
};
