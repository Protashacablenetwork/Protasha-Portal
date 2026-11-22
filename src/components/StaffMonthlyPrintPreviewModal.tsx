import React, { useMemo } from 'react';
import { Printer, Download, X, Calendar, FileCheck2 } from 'lucide-react';
import { AttendanceStatus, Language, LeaveType, StaffAccount, StaffAttendanceRecord } from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface StaffMonthlyPrintPreviewModalProps {
  isOpen: boolean;
  staff: StaffAccount | null;
  attendanceRecords: StaffAttendanceRecord[];
  selectedMonthIdx: number;
  selectedYear: number;
  canViewSalary: boolean;
  lang: Language;
  onClose: () => void;
}

const MONTHS_BN = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const WEEKDAYS_FULL_BN = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

const WEEKDAYS_FULL_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const STATUS_META: Record<
  AttendanceStatus,
  { bn: string; en: string; badgeClass: string; pdfBg: string; pdfColor: string }
> = {
  present: {
    bn: 'উপস্থিত',
    en: 'Present',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pdfBg: '#dcfce7',
    pdfColor: '#166534'
  },
  late: {
    bn: 'লেট',
    en: 'Late',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    pdfBg: '#fef3c7',
    pdfColor: '#92400e'
  },
  half_day: {
    bn: 'অর্ধ-দিন',
    en: 'Half Day',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    pdfBg: '#e0f2fe',
    pdfColor: '#0369a1'
  },
  leave: {
    bn: 'ছুটি',
    en: 'Leave',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pdfBg: '#e0e7ff',
    pdfColor: '#3730a3'
  },
  absent: {
    bn: 'অনুপস্থিত',
    en: 'Absent',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    pdfBg: '#ffe4e6',
    pdfColor: '#be123c'
  }
};

const LEAVE_LABELS: Record<Exclude<LeaveType, 'none'>, { bn: string; en: string }> = {
  casual: { bn: 'নৈমিত্তিক ছুটি', en: 'Casual Leave' },
  sick: { bn: 'অসুস্থতা ছুটি', en: 'Sick Leave' },
  emergency: { bn: 'জরুরি ছুটি', en: 'Emergency Leave' },
  unpaid: { bn: 'বিনা বেতন ছুটি', en: 'Unpaid Leave' }
};

const escapeHtml = (value: string | number | null | undefined): string => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const StaffMonthlyPrintPreviewModal: React.FC<StaffMonthlyPrintPreviewModalProps> = ({
  isOpen,
  staff,
  attendanceRecords,
  selectedMonthIdx,
  selectedYear,
  canViewSalary,
  lang,
  onClose
}) => {
  const isBn = lang === 'bn';
  const formatNum = (n: number) => (isBn ? toBengaliNumber(n) : String(n));

  const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();

  const { allMonthDays, stats } = useMemo(() => {
    const map = new Map<string, StaffAttendanceRecord>();
    if (staff) {
      attendanceRecords.forEach((rec) => {
        if (rec.staffId === staff.id && rec.month === selectedMonthKey) {
          map.set(rec.date, rec);
        }
      });
    }

    const days: {
      day: number;
      dateIso: string;
      weekdayIdx: number;
      record?: StaffAttendanceRecord;
    }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateIso = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const weekdayIdx = new Date(selectedYear, selectedMonthIdx, day).getDay();
      days.push({
        day,
        dateIso,
        weekdayIdx,
        record: map.get(dateIso)
      });
    }

    let present = 0;
    let late = 0;
    let halfDay = 0;
    let paidLeave = 0;
    let unpaidLeave = 0;
    let absent = 0;

    map.forEach((r) => {
      if (r.status === 'present') present++;
      else if (r.status === 'late') late++;
      else if (r.status === 'half_day') halfDay++;
      else if (r.status === 'absent') absent++;
      else if (r.status === 'leave') {
        if (r.leaveType === 'unpaid') unpaidLeave++;
        else paidLeave++;
      }
    });

    const totalLeave = paidLeave + unpaidLeave;
    const markedDays = present + late + halfDay + totalLeave + absent;
    const effectivePresent = present + late + halfDay * 0.5;
    const attendanceRate = markedDays > 0 ? Math.round((effectivePresent / markedDays) * 100) : 0;

    const baseSalary = Number(staff?.baseSalary) || 0;
    const dailyRate = baseSalary > 0 ? baseSalary / daysInMonth : 0;
    const deductibleDays = absent + unpaidLeave + halfDay * 0.5;
    const deduction = Math.round(dailyRate * deductibleDays);
    const estimatedPayable = Math.max(0, baseSalary - deduction);

    return {
      allMonthDays: days,
      stats: {
        present,
        late,
        halfDay,
        paidLeave,
        unpaidLeave,
        totalLeave,
        absent,
        markedDays,
        attendanceRate,
        baseSalary,
        deduction,
        estimatedPayable
      }
    };
  }, [staff, attendanceRecords, selectedMonthKey, daysInMonth, selectedYear, selectedMonthIdx]);

  if (!isOpen || !staff) return null;

  const monthTitleBn = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
  const monthTitleEn = `${MONTHS_EN[selectedMonthIdx]} ${selectedYear}`;
  const generatedTimeText = new Date().toLocaleString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleTriggerPrint = () => {
    sounds.playSuccess();
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn('Print invocation failed:', e);
      }
    }, 100);
  };

  const handleDownloadHtmlSheet = () => {
    sounds.playSuccess();
    const tableRowsHtml = allMonthDays
      .map((item) => {
        const rec = item.record;
        const stMeta = rec ? STATUS_META[rec.status] : null;
        const leaveText =
          rec?.status === 'leave' && rec.leaveType && rec.leaveType !== 'none'
            ? LEAVE_LABELS[rec.leaveType]?.bn || 'ছুটি'
            : '-';
        const dateDisplay = `${toBengaliNumber(item.day)} ${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
        const statusCellHtml = stMeta
          ? `<span class="badge" style="background:${stMeta.pdfBg};color:${stMeta.pdfColor};">${escapeHtml(stMeta.bn)}</span>`
          : `<span style="color:#94a3b8;font-size:11px;">অচিহ্নিত</span>`;
        const isFriday = item.weekdayIdx === 5;

        return `
          <tr${isFriday ? ' style="background:#fff1f2;"' : ''}>
            <td style="text-align:center;font-weight:700;">${toBengaliNumber(item.day)}</td>
            <td style="text-align:left;">${escapeHtml(dateDisplay)}</td>
            <td style="text-align:center;${isFriday ? 'color:#be123c;font-weight:700;' : ''}">${escapeHtml(WEEKDAYS_FULL_BN[item.weekdayIdx])}</td>
            <td style="text-align:center;">${statusCellHtml}</td>
            <td style="text-align:center;">${escapeHtml(rec?.checkInTime || '-')}</td>
            <td style="text-align:center;">${escapeHtml(leaveText)}</td>
            <td style="text-align:left;">${escapeHtml(rec?.note || '-')}</td>
            <td style="text-align:center;font-size:11px;color:#475569;">${escapeHtml(rec?.recordedBy || '-')}</td>
          </tr>`;
      })
      .join('');

    const salarySectionHtml =
      canViewSalary && stats.baseSalary > 0
        ? `
        <div class="salary-box">
          <div><span>মূল মাসিক বেতন:</span> <strong>৳${toBengaliNumber(stats.baseSalary)}</strong></div>
          <div><span>অনুপস্থিতি/ছুটি কর্তন:</span> <strong style="color:#dc2626;">-৳${toBengaliNumber(stats.deduction)}</strong></div>
          <div><span>সম্ভাব্য প্রদেয় বেতন:</span> <strong style="color:#059669;font-size:15px;">৳${toBengaliNumber(stats.estimatedPayable)}</strong></div>
        </div>`
        : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <title>মাসিক স্টাফ হাজিরা শীট - ${escapeHtml(staff.name)} - ${escapeHtml(monthTitleBn)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Hind Siliguri', Arial, sans-serif; margin: 0; padding: 16px; color: #0f172a; background: #fff; }
    .wrapper { max-width: 820px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #0f766e; padding-bottom: 10px; margin-bottom: 12px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #0f172a; }
    .header p { margin: 3px 0 0; font-size: 13px; color: #475569; font-weight: 600; }
    .meta-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; font-size: 12.5px; }
    .meta-col div { margin-bottom: 3px; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-val { color: #0f172a; font-weight: 700; }
    .kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 12px; }
    .kpi { border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 6px; text-align: center; background: #fff; }
    .kpi-label { font-size: 10.5px; color: #475569; font-weight: 600; }
    .kpi-val { font-size: 16px; font-weight: 700; margin-top: 2px; }
    .salary-box { display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 8px 14px; margin-bottom: 12px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    th, td { border: 1px solid #cbd5e1; padding: 4.5px 6px; }
    th { background: #f1f5f9; font-weight: 700; color: #1e293b; text-align: center; }
    tr:nth-child(even) td { background: #f8fafc; }
    .badge { display: inline-block; padding: 1.5px 8px; border-radius: 999px; font-weight: 700; font-size: 10.5px; }
    .footer { margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11.5px; color: #475569; }
    .sig-line { border-top: 1px solid #475569; width: 165px; text-align: center; padding-top: 5px; font-weight: 700; color: #0f172a; }
    .print-bar { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 12px; }
    .print-btn { padding: 8px 16px; background: #E52E2E; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: inherit; }
    @media print { .print-bar { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="print-bar">
      <button class="print-btn" onclick="window.print()">প্রিন্ট / PDF সেভ করুন</button>
    </div>
    <div class="header">
      <h1>প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
      <p>ব্যক্তিগত মাসিক স্টাফ হাজিরা ও ছুটি শীট (হার্ডকপি) — ${escapeHtml(monthTitleBn)}</p>
    </div>
    <div class="meta-card">
      <div class="meta-col">
        <div><span class="meta-label">স্টাফের নাম:</span> <span class="meta-val">${escapeHtml(staff.name)}</span></div>
        <div><span class="meta-label">পদবী:</span> <span class="meta-val">${escapeHtml(staff.role || 'স্টাফ')}</span></div>
        <div><span class="meta-label">মোবাইল:</span> <span class="meta-val">${escapeHtml(staff.phone || '-')}</span></div>
      </div>
      <div class="meta-col" style="text-align:right;">
        <div><span class="meta-label">হাজিরার মাস:</span> <span class="meta-val">${escapeHtml(monthTitleBn)}</span></div>
        ${staff.userCode ? `<div><span class="meta-label">স্টাফ কোড:</span> <span class="meta-val">${escapeHtml(staff.userCode)}</span></div>` : ''}
        <div><span class="meta-label">উপস্থিতির হার:</span> <span class="meta-val" style="color:#0f766e;">${toBengaliNumber(stats.attendanceRate)}%</span></div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">উপস্থিত</div><div class="kpi-val" style="color:#059669;">${toBengaliNumber(stats.present)}</div></div>
      <div class="kpi"><div class="kpi-label">লেট</div><div class="kpi-val" style="color:#d97706;">${toBengaliNumber(stats.late)}</div></div>
      <div class="kpi"><div class="kpi-label">অর্ধ-দিন</div><div class="kpi-val" style="color:#0284c7;">${toBengaliNumber(stats.halfDay)}</div></div>
      <div class="kpi"><div class="kpi-label">ছুটি</div><div class="kpi-val" style="color:#4f46e5;">${toBengaliNumber(stats.totalLeave)}</div></div>
      <div class="kpi"><div class="kpi-label">অনুপস্থিত</div><div class="kpi-val" style="color:#e11d48;">${toBengaliNumber(stats.absent)}</div></div>
      <div class="kpi"><div class="kpi-label">চিহ্নিত দিন</div><div class="kpi-val" style="color:#0f172a;">${toBengaliNumber(stats.markedDays)}/${toBengaliNumber(daysInMonth)}</div></div>
    </div>
    ${salarySectionHtml}
    <table>
      <thead>
        <tr>
          <th style="width:36px;">দিন</th>
          <th style="width:115px;">তারিখ</th>
          <th style="width:82px;">বার</th>
          <th style="width:78px;">স্ট্যাটাস</th>
          <th style="width:72px;">সময়</th>
          <th style="width:94px;">ছুটির ধরন</th>
          <th>নোট / মন্তব্য</th>
          <th style="width:86px;">রেকর্ডকারী</th>
        </tr>
      </thead>
      <tbody>${tableRowsHtml}</tbody>
    </table>
    <div class="footer">
      <div>তৈরির সময়: ${escapeHtml(generatedTimeText)}</div>
      <div class="sig-line">স্টাফের স্বাক্ষর</div>
      <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর ও সিল</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob(['\uFEFF' + htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (staff.name || 'staff').replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, '_');
    link.href = url;
    link.download = `attendance_sheet_${safeName}_${MONTHS_EN[selectedMonthIdx]}_${selectedYear}.html`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[85] bg-slate-900/80 backdrop-blur-xs flex flex-col overflow-hidden print:static print:inset-auto print:bg-white print:overflow-visible print:h-auto select-none animate-in fade-in duration-150">
      {/* Top Action Bar (Hidden during actual paper/PDF printing) */}
      <div className="print:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              {isBn
                ? `${staff.name} — মাসিক হাজিরা শীট (প্রিন্ট প্রিভিউ)`
                : `${staff.name} — Monthly Attendance Sheet`}
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{isBn ? monthTitleBn : monthTitleEn} • A4 Hardcopy Ready</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTriggerPrint}
            className="h-9 px-3 sm:px-4 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রিন্ট / PDF সেভ' : 'Print / Save PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadHtmlSheet}
            title={isBn ? 'অফলাইন প্রিন্টের জন্য ফাইল ডাউনলোড' : 'Download printable sheet'}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBn ? 'ডাউনলোড (.html)' : 'Download'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer active:scale-95"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Preview Container (Expands cleanly for multi-row print) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 print:overflow-visible print:p-0">
        <div
          id="printable-attendance-sheet"
          className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-7 space-y-4 print:max-w-none print:shadow-none print:border-none print:rounded-none print:p-0"
        >
          {/* Company Formal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-teal-700 pb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protyasha Cable Network'}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-teal-800 mt-0.5">
                {isBn
                  ? `ব্যক্তিগত মাসিক স্টাফ হাজিরা ও ছুটি শীট — ${monthTitleBn}`
                  : `Individual Staff Monthly Attendance Sheet — ${monthTitleEn}`}
              </p>
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? 'অফিসিয়াল হার্ডকপি রেকর্ড | হেল্পলাইন: ০১৭৭৭-৮৭৭২০৭'
                  : 'Official Hardcopy Record | Helpline: 01777-877207'}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-teal-700 text-white text-[11px] font-extrabold">
                {isBn ? monthTitleBn : monthTitleEn}
              </span>
              <p className="text-[11px] text-slate-600 font-semibold mt-1">
                {isBn ? 'তৈরির সময়:' : 'Generated:'} {generatedTimeText}
              </p>
            </div>
          </div>

          {/* Staff Metadata Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs">
            <div className="space-y-1">
              <p>
                <span className="text-slate-500 font-semibold">{isBn ? 'স্টাফের নাম:' : 'Staff Name:'}</span>{' '}
                <strong className="text-slate-900">{staff.name}</strong>
              </p>
              <p>
                <span className="text-slate-500 font-semibold">{isBn ? 'পদবী:' : 'Designation:'}</span>{' '}
                <strong className="text-slate-900">{staff.role || (isBn ? 'স্টাফ' : 'Staff')}</strong>
              </p>
              <p>
                <span className="text-slate-500 font-semibold">{isBn ? 'মোবাইল:' : 'Phone:'}</span>{' '}
                <strong className="text-slate-900 tabular-nums">{staff.phone || '-'}</strong>
              </p>
            </div>
            <div className="space-y-1 sm:text-right">
              {staff.userCode && (
                <p>
                  <span className="text-slate-500 font-semibold">{isBn ? 'স্টাফ কোড:' : 'Staff Code:'}</span>{' '}
                  <strong className="text-slate-900">{staff.userCode}</strong>
                </p>
              )}
              <p>
                <span className="text-slate-500 font-semibold">{isBn ? 'মোট কর্মদিবস:' : 'Days in Month:'}</span>{' '}
                <strong className="text-slate-900 tabular-nums">{formatNum(daysInMonth)} {isBn ? 'দিন' : 'days'}</strong>
              </p>
              <p>
                <span className="text-slate-500 font-semibold">{isBn ? 'উপস্থিতির হার:' : 'Attendance Rate:'}</span>{' '}
                <strong className="text-teal-700 font-black tabular-nums">{formatNum(stats.attendanceRate)}%</strong>
              </p>
            </div>
          </div>

          {/* 6-Box KPI Summary */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="p-2 rounded-lg border border-slate-300 bg-emerald-50/50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'উপস্থিত' : 'Present'}</p>
              <p className="text-base font-black text-emerald-700 tabular-nums">{formatNum(stats.present)}</p>
            </div>
            <div className="p-2 rounded-lg border border-slate-300 bg-amber-50/50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'লেট' : 'Late'}</p>
              <p className="text-base font-black text-amber-700 tabular-nums">{formatNum(stats.late)}</p>
            </div>
            <div className="p-2 rounded-lg border border-slate-300 bg-sky-50/50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'অর্ধ-দিন' : 'Half Day'}</p>
              <p className="text-base font-black text-sky-700 tabular-nums">{formatNum(stats.halfDay)}</p>
            </div>
            <div className="p-2 rounded-lg border border-slate-300 bg-indigo-50/50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'মোট ছুটি' : 'Leave'}</p>
              <p className="text-base font-black text-indigo-700 tabular-nums">{formatNum(stats.totalLeave)}</p>
            </div>
            <div className="p-2 rounded-lg border border-slate-300 bg-rose-50/50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'অনুপস্থিত' : 'Absent'}</p>
              <p className="text-base font-black text-rose-700 tabular-nums">{formatNum(stats.absent)}</p>
            </div>
            <div className="p-2 rounded-lg border border-slate-300 bg-slate-50">
              <p className="text-[10px] font-bold text-slate-600">{isBn ? 'চিহ্নিত দিন' : 'Marked'}</p>
              <p className="text-base font-black text-slate-900 tabular-nums">
                {formatNum(stats.markedDays)}/{formatNum(daysInMonth)}
              </p>
            </div>
          </div>

          {/* Salary Summary Strip */}
          {canViewSalary && stats.baseSalary > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs">
              <div>
                <span className="text-slate-600 font-semibold">{isBn ? 'মূল মাসিক বেতন:' : 'Base Salary:'}</span>{' '}
                <strong className="text-slate-900 tabular-nums">৳{formatNum(stats.baseSalary)}</strong>
              </div>
              <div>
                <span className="text-slate-600 font-semibold">{isBn ? 'অনুপস্থিতি/ছুটি কর্তন:' : 'Deduction:'}</span>{' '}
                <strong className="text-rose-600 tabular-nums">-৳{formatNum(stats.deduction)}</strong>
              </div>
              <div>
                <span className="text-slate-600 font-semibold">{isBn ? 'সম্ভাব্য প্রদেয়:' : 'Est. Payable:'}</span>{' '}
                <strong className="text-emerald-700 text-sm font-black tabular-nums">
                  ৳{formatNum(stats.estimatedPayable)}
                </strong>
              </div>
            </div>
          )}

          {/* Complete 1-to-30/31 Day Register Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 py-1.5 px-1.5 text-center w-9">{isBn ? 'দিন' : 'Day'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-left">{isBn ? 'তারিখ' : 'Date'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center">{isBn ? 'বার' : 'Weekday'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center">{isBn ? 'সময়' : 'Time'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center">{isBn ? 'ছুটির ধরন' : 'Leave Type'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-left">{isBn ? 'নোট / মন্তব্য' : 'Note'}</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center">{isBn ? 'রেকর্ডকারী' : 'Recorded By'}</th>
                </tr>
              </thead>
              <tbody>
                {allMonthDays.map((item) => {
                  const rec = item.record;
                  const stMeta = rec ? STATUS_META[rec.status] : null;
                  const leaveText =
                    rec?.status === 'leave' && rec.leaveType && rec.leaveType !== 'none'
                      ? isBn
                        ? LEAVE_LABELS[rec.leaveType]?.bn || 'ছুটি'
                        : LEAVE_LABELS[rec.leaveType]?.en || 'Leave'
                      : '-';
                  const isFriday = item.weekdayIdx === 5;
                  const dateDisplay = isBn
                    ? `${toBengaliNumber(item.day)} ${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`
                    : `${item.day} ${MONTHS_EN[selectedMonthIdx]} ${selectedYear}`;

                  return (
                    <tr
                      key={item.dateIso}
                      className={
                        isFriday
                          ? 'bg-rose-50/60'
                          : item.day % 2 === 0
                            ? 'bg-slate-50/70'
                            : 'bg-white'
                      }
                    >
                      <td className="border border-slate-300 py-1 px-1.5 text-center font-bold tabular-nums">
                        {formatNum(item.day)}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-left whitespace-nowrap">
                        {dateDisplay}
                      </td>
                      <td
                        className={`border border-slate-300 py-1 px-2 text-center whitespace-nowrap ${
                          isFriday ? 'text-rose-700 font-bold' : ''
                        }`}
                      >
                        {isBn ? WEEKDAYS_FULL_BN[item.weekdayIdx] : WEEKDAYS_FULL_EN[item.weekdayIdx]}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-center whitespace-nowrap">
                        {stMeta ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${stMeta.badgeClass}`}
                          >
                            {isBn ? stMeta.bn : stMeta.en}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            {isBn ? 'অচিহ্নিত' : 'Unmarked'}
                          </span>
                        )}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-center whitespace-nowrap tabular-nums">
                        {rec?.checkInTime || '-'}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-center whitespace-nowrap">
                        {leaveText}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-left">
                        {rec?.note || '-'}
                      </td>
                      <td className="border border-slate-300 py-1 px-2 text-center text-[10px] text-slate-600">
                        {rec?.recordedBy || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signature Footer for Hardcopy Filing */}
          <div className="pt-8 flex flex-wrap items-end justify-between gap-6 text-xs text-slate-600">
            <div>
              <p className="font-semibold">
                {isBn ? 'রিপোর্ট প্রিন্টের তারিখ:' : 'Printed On:'} {generatedTimeText}
              </p>
            </div>
            <div className="border-t border-slate-600 w-40 text-center pt-1.5 font-bold text-slate-900">
              {isBn ? 'স্টাফের স্বাক্ষর' : 'Staff Signature'}
            </div>
            <div className="border-t border-slate-600 w-44 text-center pt-1.5 font-bold text-slate-900">
              {isBn ? 'কর্তৃপক্ষের স্বাক্ষর ও সিল' : 'Authority Signature & Seal'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
