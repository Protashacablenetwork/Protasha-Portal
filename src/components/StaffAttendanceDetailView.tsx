import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Wallet
} from 'lucide-react';
import {
  AttendanceStatus,
  Language,
  LeaveType,
  StaffAccount,
  StaffAttendanceRecord
} from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface StaffAttendanceDetailViewProps {
  staff: StaffAccount;
  attendanceRecords: StaffAttendanceRecord[];
  lang: Language;
  selectedMonthIdx: number;
  selectedYear: number;
  todayIso: string;
  isOwnProfile: boolean;
  canViewSalary: boolean;
  canDeleteDate: (dateStr: string) => boolean;
  onChangeMonth: (monthIdx: number, year: number) => void;
  onDeleteAttendance: (recordId: string) => Promise<void>;
  onClose: () => void;
}

const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS_SHORT_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

const STATUS_STYLE: Record<
  AttendanceStatus,
  {
    bn: string;
    en: string;
    shortBn: string;
    shortEn: string;
    badgeClass: string;
    cellClass: string;
    dotClass: string;
    pdfBg: string;
    pdfColor: string;
  }
> = {
  present: {
    bn: 'উপস্থিত',
    en: 'Present',
    shortBn: 'উ',
    shortEn: 'P',
    badgeClass:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cellClass:
      'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/90 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200',
    dotClass: 'bg-emerald-500',
    pdfBg: '#dcfce7',
    pdfColor: '#166534'
  },
  late: {
    bn: 'লেট',
    en: 'Late',
    shortBn: 'লে',
    shortEn: 'L',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cellClass:
      'bg-amber-50 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-800/70 text-amber-800 dark:text-amber-200',
    dotClass: 'bg-amber-500',
    pdfBg: '#fef3c7',
    pdfColor: '#92400e'
  },
  half_day: {
    bn: 'অর্ধ-দিন',
    en: 'Half Day',
    shortBn: 'অ',
    shortEn: 'H',
    badgeClass:
      'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    cellClass:
      'bg-sky-50 dark:bg-sky-950/40 border-sky-200/90 dark:border-sky-800/70 text-sky-800 dark:text-sky-200',
    dotClass: 'bg-sky-500',
    pdfBg: '#e0f2fe',
    pdfColor: '#075985'
  },
  leave: {
    bn: 'ছুটি',
    en: 'Leave',
    shortBn: 'ছু',
    shortEn: 'LV',
    badgeClass:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    cellClass:
      'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/90 dark:border-indigo-800/70 text-indigo-800 dark:text-indigo-200',
    dotClass: 'bg-indigo-500',
    pdfBg: '#e0e7ff',
    pdfColor: '#3730a3'
  },
  absent: {
    bn: 'অনুপস্থিত',
    en: 'Absent',
    shortBn: 'অনু',
    shortEn: 'A',
    badgeClass:
      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    cellClass:
      'bg-rose-50 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800/70 text-rose-800 dark:text-rose-200',
    dotClass: 'bg-rose-500',
    pdfBg: '#ffe4e6',
    pdfColor: '#9f1239'
  }
};

const LEAVE_LABELS: Record<Exclude<LeaveType, 'none'>, { bn: string; en: string }> = {
  casual: { bn: 'নৈমিত্তিক ছুটি', en: 'Casual Leave' },
  sick: { bn: 'অসুস্থতার ছুটি', en: 'Sick Leave' },
  emergency: { bn: 'জরুরি ছুটি', en: 'Emergency Leave' },
  unpaid: { bn: 'বিনা বেতনে ছুটি', en: 'Unpaid Leave' }
};

const escapeHtml = (value: string | number | null | undefined): string => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const printHtmlViaIframe = (htmlContent: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    return;
  }
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 400);
};

export const StaffAttendanceDetailView: React.FC<StaffAttendanceDetailViewProps> = ({
  staff,
  attendanceRecords,
  lang,
  selectedMonthIdx,
  selectedYear,
  todayIso,
  isOwnProfile,
  canViewSalary,
  canDeleteDate,
  onChangeMonth,
  onDeleteAttendance,
  onClose
}) => {
  const isBn = lang === 'bn';
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();

  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'marked' | 'present' | 'leave' | 'absent'>('marked');
  const [confirmDeleteRecordId, setConfirmDeleteRecordId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const formatNum = (n: number) => (isBn ? toBengaliNumber(n) : String(n));

  const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
  const firstWeekday = new Date(selectedYear, selectedMonthIdx, 1).getDay();

  // Build available years from current year +/- 2 and any recorded years
  const availableYears = useMemo(() => {
    const yrs = new Set<number>([currentYear - 1, currentYear, currentYear + 1]);
    attendanceRecords.forEach((r) => {
      if (r.staffId === staff.id && r.date) {
        const y = Number(r.date.slice(0, 4));
        if (y >= 2020 && y <= 2099) yrs.add(y);
      }
    });
    return Array.from(yrs).sort((a, b) => b - a);
  }, [attendanceRecords, staff.id, currentYear]);

  // All records for this staff in selected month indexed by date
  const monthRecordMap = useMemo(() => {
    const map = new Map<string, StaffAttendanceRecord>();
    attendanceRecords.forEach((rec) => {
      if (rec.staffId === staff.id && rec.month === selectedMonthKey) {
        map.set(rec.date, rec);
      }
    });
    return map;
  }, [attendanceRecords, staff.id, selectedMonthKey]);

  // Full day-by-day rows for the month
  const allMonthDays = useMemo(() => {
    const rows: {
      day: number;
      dateIso: string;
      weekdayIdx: number;
      record?: StaffAttendanceRecord;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateIso = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const weekdayIdx = new Date(selectedYear, selectedMonthIdx, day).getDay();
      rows.push({
        day,
        dateIso,
        weekdayIdx,
        record: monthRecordMap.get(dateIso),
        isToday: dateIso === todayIso,
        isFuture: dateIso > todayIso
      });
    }
    return rows;
  }, [daysInMonth, selectedYear, selectedMonthIdx, monthRecordMap, todayIso]);

  // Monthly stats for this staff
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let halfDay = 0;
    let paidLeave = 0;
    let unpaidLeave = 0;
    let absent = 0;

    monthRecordMap.forEach((r) => {
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
    const unmarkedDays = Math.max(0, daysInMonth - markedDays);
    const effectivePresent = present + late + halfDay * 0.5;
    const attendanceRate = markedDays > 0 ? Math.round((effectivePresent / markedDays) * 100) : 0;

    const baseSalary = Number(staff.baseSalary) || 0;
    const dailyRate = baseSalary > 0 ? baseSalary / daysInMonth : 0;
    const deductibleDays = absent + unpaidLeave + halfDay * 0.5;
    const deduction = Math.round(dailyRate * deductibleDays);
    const estimatedPayable = Math.max(0, baseSalary - deduction);

    return {
      present,
      late,
      halfDay,
      paidLeave,
      unpaidLeave,
      totalLeave,
      absent,
      markedDays,
      unmarkedDays,
      attendanceRate,
      baseSalary,
      deduction,
      estimatedPayable
    };
  }, [monthRecordMap, daysInMonth, staff.baseSalary]);

  // Filtered daily rows for log list
  const filteredDayRows = useMemo(() => {
    return allMonthDays.filter((item) => {
      if (logFilter === 'all') return true;
      if (!item.record) return false;
      if (logFilter === 'marked') return true;
      if (logFilter === 'present') {
        return (
          item.record.status === 'present' ||
          item.record.status === 'late' ||
          item.record.status === 'half_day'
        );
      }
      if (logFilter === 'leave') return item.record.status === 'leave';
      if (logFilter === 'absent') return item.record.status === 'absent';
      return true;
    });
  }, [allMonthDays, logFilter]);

  const getLeaveLabel = (lt?: LeaveType) => {
    if (!lt || lt === 'none') return '';
    const item = LEAVE_LABELS[lt];
    return item ? (isBn ? item.bn : item.en) : '';
  };

  const handlePrevMonth = () => {
    sounds.playTap();
    setSelectedDayIso(null);
    if (selectedMonthIdx === 0) {
      onChangeMonth(11, selectedYear - 1);
    } else {
      onChangeMonth(selectedMonthIdx - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    sounds.playTap();
    setSelectedDayIso(null);
    if (selectedMonthIdx === 11) {
      onChangeMonth(0, selectedYear + 1);
    } else {
      onChangeMonth(selectedMonthIdx + 1, selectedYear);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    setIsDeletingId(recordId);
    try {
      await onDeleteAttendance(recordId);
      sounds.playSuccess();
      setConfirmDeleteRecordId(null);
    } finally {
      setIsDeletingId(null);
    }
  };

  // =========================================================================
  // INDIVIDUAL STAFF MONTHLY REPORT PDF DOWNLOAD (PRINT-READY A4 BENGALI PDF)
  // =========================================================================
  const handleDownloadIndividualPdf = () => {
    sounds.playSuccess();
    const monthTitleBn = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
    const generatedAt = new Date().toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const tableRowsHtml = allMonthDays
      .map((item) => {
        const rec = item.record;
        const stMeta = rec ? STATUS_STYLE[rec.status] : null;
        const leaveText =
          rec?.status === 'leave' && rec.leaveType && rec.leaveType !== 'none'
            ? LEAVE_LABELS[rec.leaveType]?.bn || 'ছুটি'
            : '-';
        const dateDisplay = `${toBengaliNumber(item.day)} ${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
        const statusCellHtml = stMeta
          ? `<span class="badge" style="background:${stMeta.pdfBg};color:${stMeta.pdfColor};">${escapeHtml(stMeta.bn)}</span>`
          : `<span style="color:#94a3b8;font-size:11px;">অচিহ্নিত</span>`;

        return `
          <tr>
            <td style="text-align:center;font-weight:700;">${toBengaliNumber(item.day)}</td>
            <td style="text-align:left;">${escapeHtml(dateDisplay)}</td>
            <td style="text-align:center;">${escapeHtml(WEEKDAYS_FULL_BN[item.weekdayIdx])}</td>
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

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>মাসিক স্টাফ হাজিরা রিপোর্ট - ${escapeHtml(staff.name)} - ${escapeHtml(monthTitleBn)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: 'Hind Siliguri', Arial, sans-serif; margin: 0; padding: 14px; color: #0f172a; background: #fff; }
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
          .footer { margin-top: 28px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11.5px; color: #475569; }
          .sig-line { border-top: 1px solid #475569; width: 150px; text-align: center; padding-top: 4px; font-weight: 700; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
          <p>ব্যক্তিগত মাসিক স্টাফ হাজিরা ও ছুটি রিপোর্ট — ${escapeHtml(monthTitleBn)}</p>
        </div>

        <div class="meta-card">
          <div class="meta-col">
            <div><span class="meta-label">স্টাফের নাম:</span> <span class="meta-val">${escapeHtml(staff.name)}</span></div>
            <div><span class="meta-label">পদবী:</span> <span class="meta-val">${escapeHtml(staff.role || 'স্টাফ')}</span></div>
            <div><span class="meta-label">মোবাইল:</span> <span class="meta-val">${escapeHtml(staff.phone || '-')}</span></div>
          </div>
          <div class="meta-col" style="text-align:right;">
            <div><span class="meta-label">রিপোর্ট মাস:</span> <span class="meta-val">${escapeHtml(monthTitleBn)}</span></div>
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
              <th style="width:34px;">দিন</th>
              <th style="width:112px;">তারিখ</th>
              <th style="width:78px;">বার</th>
              <th style="width:74px;">স্ট্যাটাস</th>
              <th style="width:72px;">সময়</th>
              <th style="width:94px;">ছুটির ধরন</th>
              <th>নোট / মন্তব্য</th>
              <th style="width:82px;">রেকর্ডকারী</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>তৈরির সময়: ${escapeHtml(generatedAt)}</div>
          <div class="sig-line">স্টাফের স্বাক্ষর</div>
          <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
        </div>
      </body>
      </html>`;

    printHtmlViaIframe(html);
  };

  // Individual Staff Monthly Excel (.xls) Export
  const handleDownloadIndividualExcel = () => {
    sounds.playSuccess();
    const monthTitleBn = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
    const rowsHtml = allMonthDays
      .map((item) => {
        const rec = item.record;
        const stBn = rec ? STATUS_STYLE[rec.status].bn : 'অচিহ্নিত';
        const leaveText =
          rec?.status === 'leave' && rec.leaveType && rec.leaveType !== 'none'
            ? LEAVE_LABELS[rec.leaveType]?.bn || 'ছুটি'
            : '-';
        return `
          <tr>
            <td>${escapeHtml(item.dateIso)}</td>
            <td>${escapeHtml(WEEKDAYS_FULL_BN[item.weekdayIdx])}</td>
            <td>${escapeHtml(stBn)}</td>
            <td>${escapeHtml(rec?.checkInTime || '-')}</td>
            <td>${escapeHtml(leaveText)}</td>
            <td>${escapeHtml(rec?.note || '-')}</td>
            <td>${escapeHtml(rec?.recordedBy || '-')}</td>
          </tr>`;
      })
      .join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <tr><th colspan="7" style="font-size:16px;font-weight:bold;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — ব্যক্তিগত স্টাফ হাজিরা রিপোর্ট (${escapeHtml(monthTitleBn)})</th></tr>
          <tr><td colspan="7"><b>স্টাফ:</b> ${escapeHtml(staff.name)} (${escapeHtml(staff.role || 'স্টাফ')}) | <b>মোবাইল:</b> ${escapeHtml(staff.phone || '-')} | <b>উপস্থিতি হার:</b> ${stats.attendanceRate}%</td></tr>
          <tr><td colspan="7">উপস্থিত: ${stats.present} | লেট: ${stats.late} | অর্ধ-দিন: ${stats.halfDay} | ছুটি: ${stats.totalLeave} | অনুপস্থিত: ${stats.absent}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold;">
            <th>তারিখ</th>
            <th>বার</th>
            <th>স্ট্যাটাস</th>
            <th>সময়</th>
            <th>ছুটির ধরন</th>
            <th>নোট</th>
            <th>রেকর্ডকারী</th>
          </tr>
          ${rowsHtml}
        </table>
      </body>
      </html>`;

    const blob = new Blob(['\uFEFF' + excelHtml], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (staff.name || 'staff').replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, '_');
    a.download = `attendance_${safeName}_${MONTHS_EN[selectedMonthIdx]}_${selectedYear}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedDayInfo = useMemo(() => {
    if (!selectedDayIso) return null;
    return allMonthDays.find((d) => d.dateIso === selectedDayIso) || null;
  }, [allMonthDays, selectedDayIso]);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Sticky Glass Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3.5 sm:px-5 h-16 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {staff.avatarUrl ? (
            <img
              src={staff.avatarUrl}
              alt={staff.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-sm shrink-0">
              {(staff.name || 'S').slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {staff.name}
              </h2>
              {isOwnProfile && (
                <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold shrink-0">
                  {isBn ? 'আপনি' : 'You'}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
              <span>{staff.role || (isBn ? 'স্টাফ' : 'Staff')}</span>
              {staff.phone && (
                <span className="inline-flex items-center gap-0.5">
                  • <Phone className="w-2.5 h-2.5" /> {staff.phone}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick PDF Download Button */}
        <button
          type="button"
          onClick={handleDownloadIndividualPdf}
          className="h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isBn ? 'PDF' : 'PDF'}</span>
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full">
        {/* Month & Year Filter Bar */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">
              <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={selectedMonthIdx}
                onChange={(e) => {
                  sounds.playTap();
                  setSelectedDayIso(null);
                  onChangeMonth(Number(e.target.value), selectedYear);
                }}
                className="h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white cursor-pointer"
              >
                {MONTHS_BN.map((mBn, idx) => (
                  <option key={idx} value={idx}>
                    {isBn ? mBn : MONTHS_EN[idx]}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => {
                  sounds.playTap();
                  setSelectedDayIso(null);
                  onChangeMonth(selectedMonthIdx, Number(e.target.value));
                }}
                className="h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {formatNum(yr)}
                  </option>
                ))}
              </select>

              {(selectedMonthIdx !== currentMonthIdx || selectedYear !== currentYear) && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setSelectedDayIso(null);
                    onChangeMonth(currentMonthIdx, currentYear);
                  }}
                  className="px-2.5 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold cursor-pointer"
                >
                  {isBn ? 'এই মাস' : 'This Month'}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Monthly Report Download Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadIndividualPdf}
              className="h-10 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {isBn
                  ? `মাসিক রিপোর্ট PDF ডাউনলোড (${MONTHS_BN[selectedMonthIdx]})`
                  : `Download Monthly PDF (${MONTHS_EN[selectedMonthIdx]})`}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDownloadIndividualExcel}
              className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isBn ? 'মাসিক Excel (.xls) ডাউনলোড' : 'Download Monthly Excel'}</span>
            </button>
          </div>
        </div>

        {/* Monthly Performance Summary Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {isBn
                    ? `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)} — সারসংক্ষেপ`
                    : `${MONTHS_EN[selectedMonthIdx]} ${selectedYear} — Summary`}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? `চিহ্নিত দিন: ${toBengaliNumber(stats.markedDays)} / ${toBengaliNumber(daysInMonth)} দিন`
                    : `Marked: ${stats.markedDays} / ${daysInMonth} days`}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-black text-teal-600 dark:text-teal-400 tabular-nums">
                {formatNum(stats.attendanceRate)}%
              </span>
              <p className="text-[10px] font-bold text-slate-400">
                {isBn ? 'উপস্থিতির হার' : 'Rate'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, stats.attendanceRate))}%` }}
            />
          </div>

          {/* 5-Column Status Breakdown */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                {isBn ? 'উপস্থিত' : 'Present'}
              </p>
              <p className="text-base font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                {formatNum(stats.present)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                {isBn ? 'লেট' : 'Late'}
              </p>
              <p className="text-base font-black text-amber-700 dark:text-amber-300 tabular-nums">
                {formatNum(stats.late)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
              <p className="text-[10px] font-bold text-sky-700 dark:text-sky-300">
                {isBn ? 'অর্ধ-দিন' : 'Half'}
              </p>
              <p className="text-base font-black text-sky-700 dark:text-sky-300 tabular-nums">
                {formatNum(stats.halfDay)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40">
              <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                {isBn ? 'ছুটি' : 'Leave'}
              </p>
              <p className="text-base font-black text-indigo-700 dark:text-indigo-300 tabular-nums">
                {formatNum(stats.totalLeave)}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
              <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                {isBn ? 'অনুপস্থিত' : 'Absent'}
              </p>
              <p className="text-base font-black text-rose-700 dark:text-rose-300 tabular-nums">
                {formatNum(stats.absent)}
              </p>
            </div>
          </div>

          {/* Salary Preview (only for Admin or Staff Self) */}
          {canViewSalary && stats.baseSalary > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Wallet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {isBn ? 'মূল বেতন:' : 'Base:'}{' '}
                  <strong className="text-slate-900 dark:text-white tabular-nums">
                    ৳{formatNum(stats.baseSalary)}
                  </strong>
                </span>
                {stats.deduction > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                    ({isBn ? 'কর্তন' : 'Ded'}: -৳{formatNum(stats.deduction)})
                  </span>
                )}
              </div>
              <div className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {isBn ? 'সম্ভাব্য প্রদেয়: ' : 'Est. Payable: '}৳{formatNum(stats.estimatedPayable)}
              </div>
            </div>
          )}
        </div>

        {/* Visual Monthly Calendar Grid */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'মাসিক হাজিরা ক্যালেন্ডার' : 'Monthly Attendance Calendar'}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isBn ? 'বিস্তারিত দেখতে যেকোনো দিনে ট্যাপ করুন' : 'Tap any day for details'}
            </span>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {(isBn ? WEEKDAYS_SHORT_BN : WEEKDAYS_SHORT_EN).map((wd, idx) => (
              <div
                key={idx}
                className={`text-[10px] font-extrabold py-1 ${
                  idx === 5
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstWeekday }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-12 rounded-xl" />
            ))}
            {allMonthDays.map((item) => {
              const rec = item.record;
              const stMeta = rec ? STATUS_STYLE[rec.status] : null;
              const isSelected = selectedDayIso === item.dateIso;

              return (
                <button
                  key={item.dateIso}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setSelectedDayIso(isSelected ? null : item.dateIso);
                  }}
                  className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    stMeta
                      ? stMeta.cellClass
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  } ${
                    item.isToday ? 'ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-slate-900' : ''
                  } ${
                    isSelected ? 'scale-105 shadow-sm ring-2 ring-slate-900 dark:ring-white' : ''
                  }`}
                >
                  <span className="text-xs font-extrabold tabular-nums leading-none">
                    {formatNum(item.day)}
                  </span>
                  {stMeta ? (
                    <span className="text-[9px] font-extrabold leading-none">
                      {isBn ? stMeta.shortBn : stMeta.shortEn}
                    </span>
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Preview Card */}
          {selectedDayInfo && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {isBn
                      ? `${toBengaliNumber(selectedDayInfo.day)} ${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)} (${WEEKDAYS_FULL_BN[selectedDayInfo.weekdayIdx]})`
                      : `${selectedDayInfo.day} ${MONTHS_EN[selectedMonthIdx]} ${selectedYear} (${WEEKDAYS_FULL_EN[selectedDayInfo.weekdayIdx]})`}
                  </p>
                  {selectedDayInfo.record?.checkInTime && (
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {isBn ? 'সময়:' : 'Time:'} {selectedDayInfo.record.checkInTime}
                    </p>
                  )}
                </div>

                {selectedDayInfo.record ? (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${
                      STATUS_STYLE[selectedDayInfo.record.status].badgeClass
                    }`}
                  >
                    {isBn
                      ? STATUS_STYLE[selectedDayInfo.record.status].bn
                      : STATUS_STYLE[selectedDayInfo.record.status].en}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {isBn ? 'হাজিরা দেওয়া হয়নি' : 'Not Marked'}
                  </span>
                )}
              </div>

              {selectedDayInfo.record?.status === 'leave' && selectedDayInfo.record.leaveType && selectedDayInfo.record.leaveType !== 'none' && (
                <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                  {isBn ? 'ছুটির ধরন: ' : 'Leave Type: '}
                  {getLeaveLabel(selectedDayInfo.record.leaveType)}
                </p>
              )}

              {selectedDayInfo.record?.note && (
                <p className="text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700">
                  {selectedDayInfo.record.note}
                </p>
              )}

              {selectedDayInfo.record?.recordedBy && (
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isBn ? 'রেকর্ডকারী:' : 'Recorded by:'} {selectedDayInfo.record.recordedBy}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Day-by-Day Detailed Attendance List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
              {isBn
                ? `দৈনিক বিস্তারিত তালিকা (${toBengaliNumber(filteredDayRows.length)} দিন)`
                : `Day-by-Day Details (${filteredDayRows.length} days)`}
            </h3>

            {/* Filter Chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  { id: 'marked', bn: 'চিহ্নিত', en: 'Marked' },
                  { id: 'all', bn: 'সব দিন', en: 'All Days' },
                  { id: 'present', bn: 'উপস্থিত', en: 'Present' },
                  { id: 'leave', bn: 'ছুটি', en: 'Leave' },
                  { id: 'absent', bn: 'অনুপস্থিত', en: 'Absent' }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setLogFilter(f.id);
                  }}
                  className={`px-2.5 h-7 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                    logFilter === f.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isBn ? f.bn : f.en}
                </button>
              ))}
            </div>
          </div>

          {filteredDayRows.length === 0 ? (
            <div className="py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isBn
                ? 'এই ফিল্টারে কোনো হাজিরা রেকর্ড পাওয়া যায়নি।'
                : 'No attendance records found for this filter.'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDayRows.map((item) => {
                const rec = item.record;
                const stMeta = rec ? STATUS_STYLE[rec.status] : null;
                const canDeleteThis = Boolean(rec && canDeleteDate(item.dateIso));
                const isConfirming = Boolean(rec && confirmDeleteRecordId === rec.id);

                return (
                  <div
                    key={item.dateIso}
                    className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2 ${
                      item.isToday
                        ? 'border-teal-300 dark:border-teal-700'
                        : 'border-slate-200/90 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center shrink-0 ${
                            stMeta
                              ? stMeta.cellClass
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-xs font-black tabular-nums leading-none">
                            {formatNum(item.day)}
                          </span>
                          <span className="text-[9px] font-bold leading-none mt-0.5">
                            {isBn
                              ? WEEKDAYS_SHORT_BN[item.weekdayIdx]
                              : WEEKDAYS_SHORT_EN[item.weekdayIdx]}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {isBn
                                ? `${toBengaliNumber(item.day)} ${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`
                                : `${item.day} ${MONTHS_EN[selectedMonthIdx]} ${selectedYear}`}
                            </p>
                            {item.isToday && (
                              <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[9px] font-extrabold">
                                {isBn ? 'আজ' : 'Today'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                            <span>
                              {isBn
                                ? WEEKDAYS_FULL_BN[item.weekdayIdx]
                                : WEEKDAYS_FULL_EN[item.weekdayIdx]}
                            </span>
                            {rec?.checkInTime && (
                              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                <Clock className="w-3 h-3" />
                                {rec.checkInTime}
                              </span>
                            )}
                            {rec?.status === 'leave' && rec.leaveType && rec.leaveType !== 'none' && (
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                • {getLeaveLabel(rec.leaveType)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {stMeta ? (
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${stMeta.badgeClass}`}
                          >
                            {isBn ? stMeta.bn : stMeta.en}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {isBn ? 'অচিহ্নিত' : 'Unmarked'}
                          </span>
                        )}

                        {canDeleteThis && rec && (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setConfirmDeleteRecordId(isConfirming ? null : rec.id);
                            }}
                            title={isBn ? 'হাজিরা মুছুন' : 'Undo / Delete Attendance'}
                            className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60 flex items-center justify-center cursor-pointer active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {rec?.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl">
                        {rec.note}
                      </p>
                    )}

                    {isConfirming && rec && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                          {isBn
                            ? 'এই দিনের হাজিরা মুছে ফেলবেন?'
                            : 'Clear attendance for this day?'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteRecordId(null)}
                            className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            {isBn ? 'না' : 'No'}
                          </button>
                          <button
                            type="button"
                            disabled={isDeletingId === rec.id}
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="h-7 px-2.5 rounded-lg bg-rose-600 disabled:opacity-60 text-white text-xs font-bold cursor-pointer"
                          >
                            {isDeletingId === rec.id
                              ? isBn
                                ? 'মুছছে...'
                                : 'Clearing...'
                              : isBn
                                ? 'হ্যাঁ, মুছুন'
                                : 'Yes, Clear'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
