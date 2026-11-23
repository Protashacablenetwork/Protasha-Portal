import React, { useState, useMemo } from 'react';
import { AppConfig, SalaryPayment, Staff } from '../types';
import {
  formatCurrency,
  formatEnglishCurrency,
  getMonthBengaliName,
  getNextMonthKey
} from '../data/categories';
import { generateSalaryReceiptPdf } from '../utils/salaryPdfGenerator';
import { showToast } from '../../../utils/uiFeedback';
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  AlertTriangle,
  Edit2,
  Trash2,
  DollarSign,
  Loader2,
  ChevronRight
} from 'lucide-react';

interface StaffSalaryDetailPageProps {
  staff: Staff;
  salaries: SalaryPayment[];
  selectedMonth: string;
  companyDue: number;
  config: AppConfig;
  isAdminLoggedIn: boolean;
  onBack: () => void;
  onPaySalary: (staff: Staff, targetMonth?: string) => void;
  onEditStaff: (staff: Staff) => void;
  onDeleteStaff: (staff: Staff) => void;
}

export const StaffSalaryDetailPage: React.FC<StaffSalaryDetailPageProps> = ({
  staff,
  salaries,
  selectedMonth,
  companyDue,
  config,
  isAdminLoggedIn,
  onBack,
  onPaySalary,
  onEditStaff,
  onDeleteStaff
}) => {
  const staffSalaries = useMemo(() => {
    return (salaries || [])
      .filter(s => s && s.staffId === staff.id)
      .sort((a, b) => (b.month || '').localeCompare(a.month || ''));
  }, [salaries, staff.id]);

  const [focusedMonth, setFocusedMonth] = useState<string>(selectedMonth);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const focusedRecord: SalaryPayment = useMemo(() => {
    const existing = staffSalaries.find(s => s.month === focusedMonth);
    if (existing) return existing;

    const previewDeduct = companyDue > 0 ? Math.min(staff.baseSalary, companyDue) : 0;
    return {
      id: `preview-${staff.id}-${focusedMonth}`,
      staffId: staff.id,
      staffName: staff.name,
      staffDesignation: staff.designation,
      month: focusedMonth,
      baseSalary: staff.baseSalary,
      bonusOrAllowance: 0,
      deductionOrAdvance: previewDeduct,
      netSalary: Math.max(0, staff.baseSalary - previewDeduct),
      paymentStatus: 'pending',
      paymentDate: '',
      paymentMethod: 'নগদ (Cash)',
      voucherNumber: `PRE-${focusedMonth.replace('-', '')}`,
      note: companyDue > 0 ? `কোম্পানি পাওনা কর্তন প্রাক্কলন: ৳${companyDue}` : '',
      createdAt: new Date().toISOString()
    };
  }, [staffSalaries, focusedMonth, staff, companyDue]);

  // Check if next month already has an auto carry-forward pending record from focusedMonth
  const nextMonthKey = getNextMonthKey(focusedRecord.month);
  const nextMonthRecord = staffSalaries.find(s => s.month === nextMonthKey);
  const nextMonthCarryForward = useMemo(() => {
    if (
      nextMonthRecord &&
      nextMonthRecord.deductionOrAdvance > 0 &&
      (nextMonthRecord.note || '').includes(getMonthBengaliName(focusedRecord.month))
    ) {
      return nextMonthRecord.deductionOrAdvance;
    }
    return 0;
  }, [nextMonthRecord, focusedRecord.month]);

  const grossSalary =
    (Number(focusedRecord.baseSalary) || 0) + (Number(focusedRecord.bonusOrAllowance) || 0);
  const isPaid = focusedRecord.paymentStatus === 'paid';
  const sym = config.currencySymbol || '৳';

  const handleDownloadPdf = async (targetSal: SalaryPayment = focusedRecord) => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const nKey = getNextMonthKey(targetSal.month);
      const nRec = staffSalaries.find(s => s.month === nKey);
      const nCarry =
        nRec &&
        nRec.deductionOrAdvance > 0 &&
        (nRec.note || '').includes(getMonthBengaliName(targetSal.month))
          ? nRec.deductionOrAdvance
          : 0;

      await generateSalaryReceiptPdf({
        staff,
        salary: targetSal,
        config,
        companyDueRemaining: companyDue,
        nextMonthCarryForward: nCarry
      });
      showToast('✅ বেতন রশিদ PDF সফলভাবে ডাউনলোড হয়েছে', 'success');
    } catch (err) {
      console.error('PDF generation failed:', err);
      showToast('❌ PDF তৈরি করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-right-3 duration-200 pb-10">
      {/* Top Sticky Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {staff.name} — বেতন রশিদ ও বিস্তারিত
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {staff.designation} • {getMonthBengaliName(focusedRecord.month)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="month"
            value={focusedMonth}
            onChange={(e) => setFocusedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
          />

          <button
            type="button"
            onClick={() => handleDownloadPdf(focusedRecord)}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>PDF ডাউনলোড</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Staff Summary Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-md no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl font-black text-white shrink-0">
              {staff.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black">{staff.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    staff.status === 'active'
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-slate-600 text-slate-200'
                  }`}
                >
                  {staff.status === 'active' ? 'সক্রিয় কর্মী' : 'নিষ্ক্রিয়'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1.5">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-300" />
                  {staff.designation}
                </span>
                <a
                  href={`tel:${staff.phone}`}
                  className="inline-flex items-center gap-1 text-emerald-300 hover:underline font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {staff.phone}
                </a>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  যোগদান: {staff.joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:text-right">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-slate-300 block">মূল মাসিক বেতন</span>
              <span className="text-base sm:text-lg font-black text-white">
                {formatCurrency(staff.baseSalary, sym)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
              <span className="text-[10px] text-slate-300 block">কোম্পানি পাওনা (বর্তমান)</span>
              <span
                className={`text-base sm:text-lg font-black ${
                  companyDue > 0 ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {formatCurrency(companyDue, sym)}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Quick Controls */}
        {isAdminLoggedIn && (
          <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEditStaff(staff)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>তথ্য এডিট</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteStaff(staff)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>কর্মী মুছুন</span>
              </button>
            </div>

            {!isPaid && (
              <button
                type="button"
                onClick={() => onPaySalary(staff, focusedMonth)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>{getMonthBengaliName(focusedMonth)} এর বেতন প্রদান করুন</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Official Salary Receipt Paper (Printable + Mirror of PDF Receipt) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none">
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>বেতন রশিদ (Salary Voucher) — {getMonthBengaliName(focusedRecord.month)}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>পরিশোধিত</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>বকেয়া / প্রাক্কলিত</span>
              </>
            )}
          </span>
        </div>

        <div className="p-5 sm:p-8 text-slate-800 dark:text-slate-100 print:text-slate-900">
          {/* Voucher Header */}
          <div className="text-center pb-5 border-b-2 border-slate-800 dark:border-slate-700 print:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-slate-900">
              {config.companyName || 'প্রত্যাশা ক্যাবল নেটওয়ার্ক'}
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 print:text-slate-700 mt-1">
              মাসিক বেতন রশিদ ও পারিশ্রমিক ভাউচার
            </p>
            <div className="inline-block mt-2.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 print:bg-slate-100 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
              বেতন মাস: {getMonthBengaliName(focusedRecord.month)}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 py-4 text-xs border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">কর্মীর নাম</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{staff.name}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">পদবি</span>
              <span className="font-semibold">{staff.designation}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">মোবাইল</span>
              <span className="font-semibold tabular-nums">{staff.phone || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">ভাউচার নম্বর</span>
              <span className="font-mono font-bold">{focusedRecord.voucherNumber || 'VCH-N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">পরিশোধের তারিখ</span>
              <span className="font-semibold">{isPaid ? (focusedRecord.paymentDate || '—') : 'পরিশোধ অপেক্ষমান'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">পরিশোধের মাধ্যম</span>
              <span className="font-semibold">{focusedRecord.paymentMethod || 'নগদ (Cash)'}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="py-5">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              বেতন ও কর্তনের বিস্তারিত বিবরণী
            </h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                      মূল বেতন (Basic Salary)
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(focusedRecord.baseSalary, sym)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium text-emerald-700 dark:text-emerald-400">
                      (+) বোনাস / ওভারটাইম ভাতা
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                      +{formatCurrency(focusedRecord.bonusOrAllowance || 0, sym)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/30">
                    <td className="px-4 py-3 font-bold text-indigo-900 dark:text-indigo-200">
                      কোম্পানি ব্যয়ে মোট বেতন খরচ (পূর্ণ বেতন)
                    </td>
                    <td className="px-4 py-3 text-right font-black text-indigo-900 dark:text-indigo-200">
                      {formatCurrency(grossSalary, sym)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-rose-50/40 dark:bg-rose-950/20">
                    <td className="px-4 py-3 font-medium text-rose-700 dark:text-rose-400">
                      (-) অগ্রিম / কোম্পানি পাওনা কর্তন
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-700 dark:text-rose-400">
                      -{formatCurrency(focusedRecord.deductionOrAdvance || 0, sym)}
                    </td>
                  </tr>
                  <tr className="bg-slate-900 text-white font-extrabold text-sm">
                    <td className="px-4 py-3.5">সর্বমোট প্রদেয় নিট বেতন (Net Cash Payable)</td>
                    <td className="px-4 py-3.5 text-right text-emerald-300">
                      {formatCurrency(focusedRecord.netSalary, sym)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-right italic">
              কথায় (নিট প্রদেয়): {formatEnglishCurrency(focusedRecord.netSalary, sym)} টাকা মাত্র
            </p>
          </div>

          {/* Carry-forward or Due notice */}
          {(nextMonthCarryForward > 0 || companyDue > 0) && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">কোম্পানি পাওনা ও পরবর্তী মাস সমন্বয় তথ্য</p>
                {nextMonthCarryForward > 0 ? (
                  <p className="mt-0.5 text-[11px]">
                    এই মাসের পূর্ণ বেতন ({formatCurrency(grossSalary, sym)}) থেকে কর্তনের পরও{' '}
                    <strong>{formatCurrency(nextMonthCarryForward, sym)}</strong> অবশিষ্ট পাওনা থাকায় তা স্বয়ংক্রিয়ভাবে{' '}
                    <strong>{getMonthBengaliName(nextMonthKey)}</strong> মাসে স্থানান্তরিত হয়েছে।
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px]">
                    স্টাফের নিকট কোম্পানির বর্তমান অবশিষ্ট পাওনা:{' '}
                    <strong>{formatCurrency(companyDue, sym)}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {focusedRecord.note && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mb-6">
              <span className="font-bold">মন্তব্য: </span>
              {focusedRecord.note}
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-600 dark:text-slate-400">
            <div>
              <div className="border-t border-slate-400 w-32 mx-auto pt-1" />
              <span>কর্মচারীর স্বাক্ষর</span>
            </div>
            <div>
              <div className="border-t border-slate-400 w-32 mx-auto pt-1" />
              <span>কর্তৃপক্ষের স্বাক্ষর ও সিল</span>
            </div>
          </div>
        </div>
      </div>

      {/* Salary History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs no-print">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-600" />
            <span>সকল মাসের বেতন ইতিহাস ({staffSalaries.length} টি রেকর্ড)</span>
          </h3>
        </div>

        {staffSalaries.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            এই কর্মীর কোনো মাসের বেতন রেকর্ড এখনো তৈরি হয়নি। উপরের "PDF ডাউনলোড" বাটনে চাপ দিলে চলতি মাসের রশিদ ডাউনলোড হবে।
          </div>
        ) : (
          <div className="space-y-2.5">
            {staffSalaries.map((sal) => {
              const salGross = (Number(sal.baseSalary) || 0) + (Number(sal.bonusOrAllowance) || 0);
              const isSelected = sal.month === focusedMonth;
              return (
                <div
                  key={sal.id}
                  onClick={() => setFocusedMonth(sal.month)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-700 ring-1 ring-indigo-400/40'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {getMonthBengaliName(sal.month)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sal.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {sal.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      পূর্ণ বেতন: {formatCurrency(salGross, sym)} • কর্তন: {formatCurrency(sal.deductionOrAdvance || 0, sym)} • নিট: {formatCurrency(sal.netSalary, sym)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDownloadPdf(sal);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                      title="PDF ডাউনলোড"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
