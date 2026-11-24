import React from 'react';
import {
  ArrowRight,
  Zap,
  Layers,
  Calculator,
  Headphones,
  UserCheck
} from 'lucide-react';
import { Language, SubAdminPermissionKey, UserSession } from '../types';
import { sounds } from '../utils/audio';
import { toBengaliNumber } from '../utils/formatters';
import { hasSubAdminPermission, isStaffSessionActive } from '../utils/permissions';

interface PrimaryFeatureCardsProps {
  lang: Language;
  user?: UserSession | null;
  serviceStatuses: Record<string, any>;
  onOpenBillManager: () => void;
  onOpenAyByay: () => void;
  onOpenQuickHisab: () => void;
}

export const PrimaryFeatureCards: React.FC<PrimaryFeatureCardsProps> = ({
  lang,
  user,
  serviceStatuses,
  onOpenBillManager,
  onOpenAyByay,
  onOpenQuickHisab
}) => {
  const isBn = lang === 'bn';

  const isStaff = isStaffSessionActive(user);

  const isRoleBlocked = (key: SubAdminPermissionKey) => {
    if (user?.role === 'sub-admin') return !hasSubAdminPermission(user, key);
    return false;
  };

  const isBillRestricted = !isStaff && isRoleBlocked('billManager');
  const isAyByayRestricted = !isStaff && isRoleBlocked('ayByay');
  const isQuickHisabRestricted = !isStaff && isRoleBlocked('quickHisab');

  const isBillLocked = !isStaff && (isBillRestricted || serviceStatuses.billManager?.isActive === false || String(serviceStatuses.billManager?.isActive) === 'false');
  const isAyByayLocked = !isStaff && (isAyByayRestricted || serviceStatuses.ayByay?.isActive === false || String(serviceStatuses.ayByay?.isActive) === 'false');
  const isQuickHisabLocked = !isStaff && (isQuickHisabRestricted || serviceStatuses.quickHisab?.isActive === false || String(serviceStatuses.quickHisab?.isActive) === 'false');

  return (
    <div className="px-4 pt-1 pb-3 select-none space-y-2.5 sm:space-y-3.5">
      {/* 2 Main Feature Cards side by side in 1 single row (grid-cols-2) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        
        {/* Card 1: বিল ম্যানেজমেন্ট প্রো */}
        <div
          onClick={() => {
            sounds.playTap();
            onOpenBillManager();
          }}
          role="button"
          tabIndex={0}
          className={`group relative overflow-hidden rounded-3xl p-3 sm:p-4 text-white shadow-md cursor-pointer border active:scale-[0.98] transition-all flex flex-col justify-between min-h-[105px] sm:min-h-[115px] ${
            isBillLocked
              ? 'bg-slate-500/80 grayscale border-slate-400/30'
              : 'bg-gradient-to-br from-[#FF4500] via-[#FF6A3D] to-[#FF8C00] shadow-orange-500/20 border-white/20 hover:shadow-lg hover:shadow-orange-500/30'
          }`}
        >
          {/* Subtle decorative background icon */}
          <div className="absolute right-2 -bottom-1 text-white/10 pointer-events-none group-hover:text-white/15 transition-colors">
            <Zap className="w-14 h-14 sm:w-18 sm:h-18 stroke-[1.2]" />
          </div>

          {/* Top row: Icon only */}
          <div className="flex items-center justify-between relative z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Zap className="w-4 h-4 stroke-[2.2]" />
            </div>
            {isBillRestricted ? (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/35 text-white">
                {isBn ? 'সীমিত' : 'Locked'}
              </span>
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="relative z-10 mt-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight drop-shadow-xs leading-snug">
              {isBn ? 'বিল ম্যানেজমেন্ট প্রো' : 'Bill Management Pro'}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-white/90 font-medium mt-0.5 truncate">
              {isBillRestricted
                ? isBn ? 'অনুমতি সীমাবদ্ধ' : 'Access restricted'
                : isBn ? 'স্মার্ট বিলিং ও কালেকশন' : 'Smart Billing System'}
            </p>
          </div>
        </div>

        {/* Card 2: আয়-ব্যয় হিসাব */}
        <div
          onClick={() => {
            sounds.playTap();
            onOpenAyByay();
          }}
          role="button"
          tabIndex={0}
          className={`group relative overflow-hidden rounded-3xl p-3 sm:p-4 text-white shadow-md cursor-pointer border active:scale-[0.98] transition-all flex flex-col justify-between min-h-[105px] sm:min-h-[115px] ${
            isAyByayLocked
              ? 'bg-slate-600/90 grayscale border-slate-500/40'
              : 'bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F766E] shadow-teal-950/30 border-teal-500/30 hover:shadow-lg hover:shadow-teal-900/40'
          }`}
        >
          {/* Subtle decorative background icon */}
          <div className="absolute right-2 -bottom-1 text-teal-400/10 pointer-events-none group-hover:text-teal-400/15 transition-colors">
            <Layers className="w-14 h-14 sm:w-18 sm:h-18 stroke-[1.2]" />
          </div>

          {/* Top row: Icon with official Logo */}
          <div className="flex items-center justify-between relative z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white shadow-xs p-0.5 flex items-center justify-center border border-teal-400/40 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src={serviceStatuses.ayByay?.logoUrl || "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png"} 
                alt="আয়-ব্যয় লোগো" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            {isAyByayRestricted ? (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/35 text-white">
                {isBn ? 'সীমিত' : 'Locked'}
              </span>
            ) : (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="relative z-10 mt-2">
            <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight drop-shadow-xs leading-snug">
              <span className="text-emerald-400">{isBn ? 'আয়' : 'Income'}</span>
              <span className="text-slate-400">-</span>
              <span className="text-rose-400">{isBn ? 'ব্যয়' : 'Expense'}</span>
              <span className="text-white ml-1">{isBn ? 'হিসাব' : 'Ledger'}</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
              {isAyByayRestricted
                ? isBn ? 'অনুমতি সীমাবদ্ধ' : 'Access restricted'
                : isBn ? 'স্মার্ট দৈনন্দিন খাতা' : 'Daily Accounts'}
            </p>
          </div>
        </div>

      </div>

      {/* Card 3: কুইক হিসাব (Full width below) */}
      <div
        onClick={() => {
          sounds.playTap();
          onOpenQuickHisab();
        }}
        role="button"
        tabIndex={0}
        className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer border active:scale-[0.99] transition-all flex items-center justify-between min-h-[90px] ${
          isQuickHisabLocked
            ? 'bg-slate-700/80 grayscale border-slate-600/30 shadow-none'
            : 'border-rose-500/20 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] hover:shadow-xl'
        }`}
      >
        <div className="absolute right-[-5%] top-[-20%] opacity-10 pointer-events-none">
          <Calculator className="w-24 h-24 stroke-[1]" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform ${
            isQuickHisabLocked
              ? 'bg-slate-600/40 text-slate-400 border-slate-500/30'
              : 'bg-rose-600/20 backdrop-blur-md text-rose-500 border-rose-500/30'
          }`}>
            <Calculator className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-xs leading-tight">
                {isBn ? 'কুইক হিসাব' : 'Quick Hisab'}
              </h3>
              {isQuickHisabLocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600">
                  {isQuickHisabRestricted
                    ? isBn ? 'অনুমতি সীমাবদ্ধ' : 'Restricted'
                    : isBn ? 'বন্ধ রয়েছে' : 'Offline'}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5">
              {isBn ? 'কোম্পানি আয়-ব্যয় ও ১২.৫ শেয়ার বণ্টন ড্যাশবোর্ড' : 'Company Income-Expense & 12.5 Shares Profit Dashboard'}
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:translate-x-1 transition-transform relative z-10">
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </div>
      </div>
    </div>
  );
};

interface OperationsHubCardsProps {
  lang: Language;
  user?: UserSession | null;
  serviceStatuses?: Record<string, any>;
  openTicketsCount?: number;
  todayPresentCount?: number;
  totalStaffCount?: number;
  onOpenSupportTickets?: () => void;
  onOpenStaffAttendance?: () => void;
}

export const OperationsHubCards: React.FC<OperationsHubCardsProps> = ({
  lang,
  user,
  serviceStatuses = {},
  openTicketsCount = 0,
  todayPresentCount = 0,
  totalStaffCount = 0,
  onOpenSupportTickets,
  onOpenStaffAttendance
}) => {
  if (!onOpenSupportTickets && !onOpenStaffAttendance) return null;

  const isBn = lang === 'bn';
  const isStaff = isStaffSessionActive(user);

  const isTicketsRestricted =
    !isStaff && user?.role === 'sub-admin' && !hasSubAdminPermission(user, 'supportTickets');
  const isAttendanceRestricted =
    !isStaff && user?.role === 'sub-admin' && !hasSubAdminPermission(user, 'staffAttendance');

  const isTicketsLocked =
    !isStaff && (
      isTicketsRestricted ||
      serviceStatuses.supportTickets?.isActive === false ||
      String(serviceStatuses.supportTickets?.isActive) === 'false'
    );
  const isAttendanceLocked =
    !isStaff && (
      isAttendanceRestricted ||
      serviceStatuses.staffAttendance?.isActive === false ||
      String(serviceStatuses.staffAttendance?.isActive) === 'false'
    );

  return (
    <div className="px-4 pt-1 pb-3 select-none">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {/* 1. Support Ticket Tracker */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onOpenSupportTickets?.();
          }}
          className={`group text-left p-3 rounded-2xl border shadow-xs active:scale-[0.98] transition-all flex flex-col justify-between min-h-[88px] cursor-pointer ${
            isTicketsLocked
              ? 'bg-slate-100/90 dark:bg-slate-900/60 border-slate-300/80 dark:border-slate-800 grayscale opacity-75'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 stroke-[2.2]" />
            </div>
            {isTicketsLocked ? (
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {isTicketsRestricted ? (isBn ? 'সীমিত' : 'Locked') : (isBn ? 'বন্ধ' : 'Off')}
              </span>
            ) : (
              openTicketsCount > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 tabular-nums">
                  {isBn ? toBengaliNumber(openTicketsCount) : openTicketsCount}
                </span>
              )
            )}
          </div>
          <div className="mt-2">
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {isBn ? 'সাপোর্ট টিকেট' : 'Support Tickets'}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {isTicketsLocked
                ? isTicketsRestricted
                  ? isBn
                    ? 'শুধুমাত্র অনুমোদিতদের জন্য'
                    : 'Permission required'
                  : isBn
                    ? 'সাময়িকভাবে বন্ধ'
                    : 'Temporarily off'
                : openTicketsCount > 0
                  ? isBn
                    ? `${toBengaliNumber(openTicketsCount)}টি খোলা`
                    : `${openTicketsCount} open`
                  : isBn
                    ? 'কমপ্লেইন ট্র্যাকার'
                    : 'Live tracker'}
            </p>
          </div>
        </button>

        {/* 2. Staff Attendance & Leaves */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onOpenStaffAttendance?.();
          }}
          className={`group text-left p-3 rounded-2xl border shadow-xs active:scale-[0.98] transition-all flex flex-col justify-between min-h-[88px] cursor-pointer ${
            isAttendanceLocked
              ? 'bg-slate-100/90 dark:bg-slate-900/60 border-slate-300/80 dark:border-slate-800 grayscale opacity-75'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            {isAttendanceLocked ? (
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {isAttendanceRestricted ? (isBn ? 'সীমিত' : 'Locked') : (isBn ? 'বন্ধ' : 'Off')}
              </span>
            ) : (
              totalStaffCount > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 tabular-nums">
                  {isBn
                    ? `${toBengaliNumber(todayPresentCount)}/${toBengaliNumber(totalStaffCount)}`
                    : `${todayPresentCount}/${totalStaffCount}`}
                </span>
              )
            )}
          </div>
          <div className="mt-2">
            <p className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {isBn ? 'স্টাফ হাজিরা' : 'Attendance'}
            </p>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {isAttendanceLocked
                ? isAttendanceRestricted
                  ? isBn
                    ? 'অনুমতি সীমাবদ্ধ'
                    : 'Permission required'
                  : isBn
                    ? 'সাময়িকভাবে বন্ধ'
                    : 'Temporarily off'
                : isBn
                  ? 'হাজিরা ও ছুটি'
                  : 'Daily & Leaves'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

