import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  FileText,
  Filter,
  PieChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  Language,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketStatus
} from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import {
  CATEGORY_LABELS,
  formatTicketDateTime,
  getTicketStatusLabel
} from './TicketTrackingHelpers';

interface TicketReportViewProps {
  tickets: SupportTicket[];
  lang: Language;
  actorName: string;
  isScopedToOwnOnly: boolean;
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

const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as SupportTicketCategory[];

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
  }, 350);
};

const getTicketDateParts = (ticket: SupportTicket): { year: number; month: number } | null => {
  const raw = ticket.createdAt || ticket.updatedAt;
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return { year: d.getFullYear(), month: d.getMonth() };
};

export const TicketReportView: React.FC<TicketReportViewProps> = ({
  tickets,
  lang,
  actorName,
  isScopedToOwnOnly,
  onClose
}) => {
  const isBn = lang === 'bn';
  const now = new Date();

  const [periodMode, setPeriodMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedCategory, setSelectedCategory] = useState<'all' | SupportTicketCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | SupportTicketStatus>('all');

  const availableYears = useMemo(() => {
    const years = new Set<number>([now.getFullYear(), now.getFullYear() - 1, now.getFullYear() + 1]);
    tickets.forEach((t) => {
      const parts = getTicketDateParts(t);
      if (parts) years.add(parts.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [tickets]);

  const formatNum = (n: number) => (isBn ? toBengaliNumber(n) : n.toLocaleString('en-US'));

  const getCategoryName = (cat: SupportTicketCategory) => {
    const meta = CATEGORY_LABELS[cat];
    return meta ? (isBn ? meta.bn : meta.en) : cat;
  };

  // Tickets filtered by selected Month or Year ONLY (used for full category comparison)
  const periodTickets = useMemo(() => {
    return tickets.filter((t) => {
      const parts = getTicketDateParts(t);
      if (!parts) return false;
      if (parts.year !== selectedYear) return false;
      if (periodMode === 'monthly' && parts.month !== selectedMonth) return false;
      return true;
    });
  }, [tickets, periodMode, selectedYear, selectedMonth]);

  // Tickets additionally filtered by Category & Status
  const filteredTickets = useMemo(() => {
    return periodTickets
      .filter((t) => {
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [periodTickets, selectedCategory, selectedStatus]);

  // Summary metrics for filteredTickets
  const summary = useMemo(() => {
    let pending = 0;
    let reviewing = 0;
    let inProgress = 0;
    let resolved = 0;
    filteredTickets.forEach((t) => {
      if (t.status === 'pending') pending++;
      else if (t.status === 'reviewing') reviewing++;
      else if (t.status === 'in_progress') inProgress++;
      else if (t.status === 'resolved') resolved++;
    });
    const total = filteredTickets.length;
    const active = pending + reviewing + inProgress;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, pending, reviewing, inProgress, resolved, active, rate };
  }, [filteredTickets]);

  // Category-wise breakdown across the selected period
  const categoryBreakdown = useMemo(() => {
    const source = selectedStatus === 'all'
      ? periodTickets
      : periodTickets.filter((t) => t.status === selectedStatus);

    return CATEGORY_KEYS.map((catKey) => {
      const items = source.filter((t) => t.category === catKey);
      let pending = 0;
      let reviewing = 0;
      let inProgress = 0;
      let resolved = 0;
      items.forEach((t) => {
        if (t.status === 'pending') pending++;
        else if (t.status === 'reviewing') reviewing++;
        else if (t.status === 'in_progress') inProgress++;
        else if (t.status === 'resolved') resolved++;
      });
      const total = items.length;
      const active = pending + reviewing + inProgress;
      const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      const fullLabel = isBn ? CATEGORY_LABELS[catKey].bn : CATEGORY_LABELS[catKey].en;
      const shortLabel = fullLabel.split('/')[0].trim();

      return {
        category: catKey,
        label: fullLabel,
        shortLabel,
        total,
        pending,
        reviewing,
        inProgress,
        active,
        resolved,
        rate
      };
    });
  }, [periodTickets, selectedStatus, isBn]);

  const visibleCategoryRows = useMemo(() => {
    if (selectedCategory === 'all') return categoryBreakdown;
    return categoryBreakdown.filter((row) => row.category === selectedCategory);
  }, [categoryBreakdown, selectedCategory]);

  // 12-Month Breakdown (for Yearly Mode)
  const monthlyBreakdown = useMemo(() => {
    return Array.from({ length: 12 }, (_, mIdx) => {
      const items = filteredTickets.filter((t) => {
        const parts = getTicketDateParts(t);
        return parts?.month === mIdx;
      });
      let pending = 0;
      let reviewing = 0;
      let inProgress = 0;
      let resolved = 0;
      items.forEach((t) => {
        if (t.status === 'pending') pending++;
        else if (t.status === 'reviewing') reviewing++;
        else if (t.status === 'in_progress') inProgress++;
        else if (t.status === 'resolved') resolved++;
      });
      const total = items.length;
      const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
      return {
        monthIndex: mIdx,
        monthBn: MONTHS_BN[mIdx],
        monthEn: MONTHS_EN[mIdx],
        total,
        pending,
        reviewing,
        inProgress,
        resolved,
        rate
      };
    });
  }, [filteredTickets]);

  const periodTitleBn =
    periodMode === 'monthly'
      ? `${MONTHS_BN[selectedMonth]} ${toBengaliNumber(selectedYear)}`
      : `বছর ${toBengaliNumber(selectedYear)}`;

  const periodTitleEn =
    periodMode === 'monthly'
      ? `${MONTHS_EN[selectedMonth]} ${selectedYear}`
      : `Year ${selectedYear}`;

  const selectedCategoryTitleBn =
    selectedCategory === 'all' ? 'সকল ক্যাটাগরি' : CATEGORY_LABELS[selectedCategory].bn;

  const handlePrevPeriod = () => {
    sounds.playTap();
    if (periodMode === 'monthly') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear((y) => y - 1);
      } else {
        setSelectedMonth((m) => m - 1);
      }
    } else {
      setSelectedYear((y) => y - 1);
    }
  };

  const handleNextPeriod = () => {
    sounds.playTap();
    if (periodMode === 'monthly') {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear((y) => y + 1);
      } else {
        setSelectedMonth((m) => m + 1);
      }
    } else {
      setSelectedYear((y) => y + 1);
    }
  };

  // =========================================================================
  // EXCEL (.xls) DOWNLOAD WITH CATEGORY, PERIOD & DETAILED TICKETS
  // =========================================================================
  const handleDownloadExcel = () => {
    sounds.playSuccess();

    const categoryRowsHtml = visibleCategoryRows
      .map(
        (c) => `
        <tr>
          <td>${escapeHtml(CATEGORY_LABELS[c.category].bn)}</td>
          <td style="font-weight:bold;text-align:center;">${c.total}</td>
          <td style="text-align:center;color:#e11d48;">${c.pending}</td>
          <td style="text-align:center;color:#0284c7;">${c.reviewing}</td>
          <td style="text-align:center;color:#d97706;">${c.inProgress}</td>
          <td style="text-align:center;color:#059669;font-weight:bold;">${c.resolved}</td>
          <td style="text-align:center;font-weight:bold;">${c.rate}%</td>
        </tr>`
      )
      .join('');

    const yearlyMonthSectionHtml =
      periodMode === 'yearly'
        ? `
      <br/>
      <table border="1" cellspacing="0" cellpadding="6">
        <tr>
          <th colspan="7" style="background:#f1f5f9;font-size:14px;font-weight:bold;text-align:left;">
            মাসভিত্তিক অভিযোগ সারসংক্ষেপ (${escapeHtml(periodTitleBn)})
          </th>
        </tr>
        <tr style="background:#e2e8f0;font-weight:bold;">
          <th>মাস</th>
          <th>মোট অভিযোগ</th>
          <th>১. দাখিলকৃত</th>
          <th>২. পর্যালোচনা</th>
          <th>৩. কাজ চলমান</th>
          <th>৪. সমাধানকৃত</th>
          <th>সমাধানের হার</th>
        </tr>
        ${monthlyBreakdown
          .map(
            (m) => `
          <tr>
            <td>${escapeHtml(m.monthBn)} ${toBengaliNumber(selectedYear)}</td>
            <td style="text-align:center;font-weight:bold;">${m.total}</td>
            <td style="text-align:center;">${m.pending}</td>
            <td style="text-align:center;">${m.reviewing}</td>
            <td style="text-align:center;">${m.inProgress}</td>
            <td style="text-align:center;color:#059669;font-weight:bold;">${m.resolved}</td>
            <td style="text-align:center;">${m.rate}%</td>
          </tr>`
          )
          .join('')}
      </table>`
        : '';

    const detailRowsHtml = filteredTickets
      .map(
        (t, idx) => `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>#${escapeHtml(t.ticketNumber)}</td>
          <td>${escapeHtml(formatTicketDateTime(t.createdAt, true))}</td>
          <td>${escapeHtml(t.customerName)}${t.customerCode ? ` (${escapeHtml(t.customerCode)})` : ''}</td>
          <td>${escapeHtml(t.customerPhone || '-')}</td>
          <td>${escapeHtml(t.area || '-')}</td>
          <td>${escapeHtml(CATEGORY_LABELS[t.category]?.bn || t.category)}</td>
          <td style="font-weight:bold;">${escapeHtml(getTicketStatusLabel(t.status, true))}</td>
          <td>${escapeHtml(t.createdBy || '-')}</td>
          <td>${escapeHtml(t.assignedStaffName || '-')}</td>
          <td>${escapeHtml(t.resolvedBy || '-')}</td>
          <td>${escapeHtml(t.resolvedAt ? formatTicketDateTime(t.resolvedAt, true) : '-')}</td>
          <td>${escapeHtml(t.resolutionNote || t.description || '-')}</td>
        </tr>`
      )
      .join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1" cellspacing="0" cellpadding="6">
          <tr>
            <th colspan="7" style="background:#1e293b;color:#ffffff;font-size:16px;font-weight:bold;">
              প্রত্যাশা ক্যাবল নেটওয়ার্ক — ক্যাটাগরি ভিত্তিক অভিযোগ রিপোর্ট
            </th>
          </tr>
          <tr>
            <td colspan="7" style="background:#f8fafc;font-weight:bold;">
              সময়কাল: ${escapeHtml(periodTitleBn)} | ক্যাটাগরি: ${escapeHtml(selectedCategoryTitleBn)} | প্রস্তুতকারী: ${escapeHtml(actorName)}
            </td>
          </tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>ক্যাটাগরি</th>
            <th>মোট অভিযোগ</th>
            <th>১. দাখিলকৃত</th>
            <th>২. পর্যালোচনা</th>
            <th>৩. কাজ চলমান</th>
            <th>৪. সমাধানকৃত</th>
            <th>সমাধানের হার</th>
          </tr>
          ${categoryRowsHtml}
          <tr style="background:#f1f5f9;font-weight:bold;">
            <td>সর্বমোট</td>
            <td style="text-align:center;">${summary.total}</td>
            <td style="text-align:center;color:#e11d48;">${summary.pending}</td>
            <td style="text-align:center;color:#0284c7;">${summary.reviewing}</td>
            <td style="text-align:center;color:#d97706;">${summary.inProgress}</td>
            <td style="text-align:center;color:#059669;">${summary.resolved}</td>
            <td style="text-align:center;">${summary.rate}%</td>
          </tr>
        </table>
        ${yearlyMonthSectionHtml}
        <br/>
        <table border="1" cellspacing="0" cellpadding="6">
          <tr>
            <th colspan="13" style="background:#f1f5f9;font-size:14px;font-weight:bold;text-align:left;">
              বিস্তারিত অভিযোগ তালিকা (মোট ${filteredTickets.length}টি)
            </th>
          </tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>ক্রমিক</th>
            <th>টিকেট নং</th>
            <th>দাখিলের সময়</th>
            <th>গ্রাহকের নাম</th>
            <th>মোবাইল</th>
            <th>এলাকা</th>
            <th>ক্যাটাগরি</th>
            <th>স্ট্যাটাস</th>
            <th>অভিযোগ দাখিলকারী</th>
            <th>টেকনিশিয়ান</th>
            <th>সমাধানকারী</th>
            <th>সমাধানের সময়</th>
            <th>বিবরণ / সমাধান নোট</th>
          </tr>
          ${detailRowsHtml || '<tr><td colspan="13" align="center">কোনো অভিযোগ পাওয়া যায়নি</td></tr>'}
        </table>
      </body>
      </html>`;

    const blob = new Blob(['\uFEFF' + html], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const catSlug = selectedCategory === 'all' ? 'all_categories' : selectedCategory;
    const periodSlug =
      periodMode === 'monthly'
        ? `${MONTHS_EN[selectedMonth]}_${selectedYear}`
        : `year_${selectedYear}`;
    a.download = `protyasha_complaint_report_${periodSlug}_${catSlug}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // =========================================================================
  // PDF DOWNLOAD (IFRAME-SAFE PRINT TO PDF)
  // =========================================================================
  const handleDownloadPdf = () => {
    sounds.playSuccess();

    const categoryRowsHtml = visibleCategoryRows
      .map(
        (c) => `
        <tr>
          <td style="text-align:left;font-weight:600;">${escapeHtml(CATEGORY_LABELS[c.category].bn)}</td>
          <td style="font-weight:800;">${toBengaliNumber(c.total)}</td>
          <td style="color:#e11d48;font-weight:700;">${toBengaliNumber(c.pending)}</td>
          <td style="color:#0284c7;font-weight:700;">${toBengaliNumber(c.reviewing)}</td>
          <td style="color:#d97706;font-weight:700;">${toBengaliNumber(c.inProgress)}</td>
          <td style="color:#059669;font-weight:800;">${toBengaliNumber(c.resolved)}</td>
          <td style="font-weight:700;">${toBengaliNumber(c.rate)}%</td>
        </tr>`
      )
      .join('');

    const yearlyMonthHtml =
      periodMode === 'yearly'
        ? `
        <div class="section-title">মাসভিত্তিক অভিযোগ সারসংক্ষেপ (${escapeHtml(periodTitleBn)})</div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">মাস</th>
              <th>মোট</th>
              <th>১. দাখিলকৃত</th>
              <th>২. পর্যালোচনা</th>
              <th>৩. কাজ চলমান</th>
              <th>৪. সমাধানকৃত</th>
              <th>সমাধান হার</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyBreakdown
              .map(
                (m) => `
              <tr>
                <td style="text-align:left;font-weight:600;">${escapeHtml(m.monthBn)}</td>
                <td style="font-weight:800;">${toBengaliNumber(m.total)}</td>
                <td>${toBengaliNumber(m.pending)}</td>
                <td>${toBengaliNumber(m.reviewing)}</td>
                <td>${toBengaliNumber(m.inProgress)}</td>
                <td style="color:#059669;font-weight:700;">${toBengaliNumber(m.resolved)}</td>
                <td>${toBengaliNumber(m.rate)}%</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>`
        : '';

    const detailRowsHtml = filteredTickets
      .map(
        (t, idx) => `
        <tr>
          <td>${toBengaliNumber(idx + 1)}</td>
          <td style="font-family:monospace;font-weight:700;">#${escapeHtml(t.ticketNumber)}</td>
          <td style="text-align:left;">
            <strong>${escapeHtml(t.customerName)}</strong><br/>
            <span style="font-size:10px;color:#475569;">${escapeHtml(t.customerPhone || '')}${t.area ? ` • ${escapeHtml(t.area)}` : ''}</span>
          </td>
          <td>${escapeHtml(CATEGORY_LABELS[t.category]?.bn || t.category)}</td>
          <td style="font-weight:700;">${escapeHtml(getTicketStatusLabel(t.status, true))}</td>
          <td style="text-align:left;font-size:10px;">
            <div><strong>দাখিল:</strong> ${escapeHtml(t.createdBy || '-')}</div>
            <div style="color:#64748b;">${escapeHtml(formatTicketDateTime(t.createdAt, true))}</div>
          </td>
          <td style="text-align:left;font-size:10px;">
            <div><strong>সমাধান:</strong> ${escapeHtml(t.resolvedBy || t.assignedStaffName || '-')}</div>
            <div style="color:#64748b;">${escapeHtml(t.resolvedAt ? formatTicketDateTime(t.resolvedAt, true) : '-')}</div>
          </td>
        </tr>`
      )
      .join('');

    const htmlDoc = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <title>প্রত্যাশা ক্যাবল নেটওয়ার্ক — অভিযোগ রিপোর্ট (${escapeHtml(periodTitleBn)})</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Bengali', 'Hind Siliguri', 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.45;
    }
    .header {
      border-bottom: 2.5px solid #e52e2e;
      padding-bottom: 10px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand { font-size: 20px; font-weight: 900; color: #e52e2e; margin: 0; }
    .subtitle { font-size: 12px; font-weight: 700; color: #334155; margin-top: 2px; }
    .meta { text-align: right; font-size: 11px; color: #475569; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    .kpi-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 8px 10px;
      background: #f8fafc;
    }
    .kpi-label { font-size: 10px; font-weight: 700; color: #475569; }
    .kpi-val { font-size: 18px; font-weight: 900; margin-top: 2px; }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin: 14px 0 6px;
      padding-left: 8px;
      border-left: 3.5px solid #e52e2e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 7px;
      text-align: center;
      vertical-align: middle;
    }
    th {
      background: #f1f5f9;
      font-weight: 800;
      color: #1e293b;
    }
    .total-row td {
      background: #f8fafc;
      font-weight: 900;
    }
    .signatures {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
    }
    .sig-box {
      width: 170px;
      text-align: center;
      border-top: 1px solid #475569;
      padding-top: 5px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
      <div class="subtitle">ক্যাটাগরি অনুযায়ী কাস্টমার অভিযোগ ও সমাধান রিপোর্ট</div>
    </div>
    <div class="meta">
      <div><strong>সময়কাল:</strong> ${escapeHtml(periodTitleBn)}</div>
      <div><strong>ক্যাটাগরি:</strong> ${escapeHtml(selectedCategoryTitleBn)}</div>
      <div><strong>প্রস্তুতকারী:</strong> ${escapeHtml(actorName)} • ${escapeHtml(formatTicketDateTime(new Date().toISOString(), true))}</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">মোট অভিযোগ</div>
      <div class="kpi-val" style="color:#0f172a;">${toBengaliNumber(summary.total)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">৪. সমাধানকৃত</div>
      <div class="kpi-val" style="color:#059669;">${toBengaliNumber(summary.resolved)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">চলমান / অপেক্ষমাণ</div>
      <div class="kpi-val" style="color:#e11d48;">${toBengaliNumber(summary.active)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">সমাধানের হার</div>
      <div class="kpi-val" style="color:#0284c7;">${toBengaliNumber(summary.rate)}%</div>
    </div>
  </div>

  <div class="section-title">ক্যাটাগরি ভিত্তিক বিশ্লেষণ (${escapeHtml(periodTitleBn)})</div>
  <table>
    <thead>
      <tr>
        <th style="text-align:left;">ক্যাটাগরি</th>
        <th>মোট</th>
        <th>১. দাখিলকৃত</th>
        <th>২. পর্যালোচনা</th>
        <th>৩. কাজ চলমান</th>
        <th>৪. সমাধানকৃত</th>
        <th>সমাধান হার</th>
      </tr>
    </thead>
    <tbody>
      ${categoryRowsHtml}
      <tr class="total-row">
        <td style="text-align:left;">সর্বমোট</td>
        <td>${toBengaliNumber(summary.total)}</td>
        <td style="color:#e11d48;">${toBengaliNumber(summary.pending)}</td>
        <td style="color:#0284c7;">${toBengaliNumber(summary.reviewing)}</td>
        <td style="color:#d97706;">${toBengaliNumber(summary.inProgress)}</td>
        <td style="color:#059669;">${toBengaliNumber(summary.resolved)}</td>
        <td>${toBengaliNumber(summary.rate)}%</td>
      </tr>
    </tbody>
  </table>

  ${yearlyMonthHtml}

  <div class="section-title">বিস্তারিত অভিযোগ তালিকা (${toBengaliNumber(filteredTickets.length)}টি)</div>
  <table>
    <thead>
      <tr>
        <th style="width:5%;">ক্রঃ</th>
        <th style="width:11%;">টিকেট নং</th>
        <th style="width:22%;text-align:left;">গ্রাহক ও এলাকা</th>
        <th style="width:15%;">ক্যাটাগরি</th>
        <th style="width:13%;">অবস্থা</th>
        <th style="width:17%;text-align:left;">দাখিলকারী ও সময়</th>
        <th style="width:17%;text-align:left;">সমাধানকারী ও সময়</th>
      </tr>
    </thead>
    <tbody>
      ${
        detailRowsHtml ||
        `<tr><td colspan="7" style="padding:18px;color:#64748b;">এই সময়কাল ও ক্যাটাগরিতে কোনো অভিযোগ নেই</td></tr>`
      }
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-box">প্রস্তুতকারী (${escapeHtml(actorName)})</div>
    <div class="sig-box">অনুমোদনকারী / অ্যাডমিন</div>
  </div>
</body>
</html>`;

    printHtmlViaIframe(htmlDoc);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-5 h-15 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Back to tickets"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {isBn ? 'ক্যাটাগরি অভিযোগ রিপোর্ট' : 'Category Complaint Report'}
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {isScopedToOwnOnly
                ? isBn
                  ? 'আপনার নিজস্ব অভিযোগের রিপোর্ট'
                  : 'Your own complaints report'
                : isBn
                  ? 'সকল অভিযোগের মাসিক ও বাৎসরিক রিপোর্ট'
                  : 'All complaints monthly & yearly report'}
            </p>
          </div>
        </div>

        {/* Download Actions in Header */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
            title={isBn ? 'PDF ডাউনলোড' : 'Download PDF'}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadExcel}
            className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
            title={isBn ? 'Excel ডাউনলোড' : 'Download Excel'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-20 w-full">
        {/* Controls Card: Monthly/Yearly Toggle + Period Picker + Category & Status Filter */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
          {/* Monthly vs Yearly Segmented Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setPeriodMode('monthly');
              }}
              className={`h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                periodMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{isBn ? 'মাস ভিত্তিক রিপোর্ট' : 'Monthly Report'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setPeriodMode('yearly');
              }}
              className={`h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                periodMode === 'yearly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isBn ? 'বছর ভিত্তিক রিপোর্ট' : 'Yearly Report'}</span>
            </button>
          </div>

          {/* Month & Year Picker Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevPeriod}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <div className="px-3.5 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white min-w-[140px]">
                {isBn ? periodTitleBn : periodTitleEn}
              </div>
              <button
                type="button"
                onClick={handleNextPeriod}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
                aria-label="Next period"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {periodMode === 'monthly' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {MONTHS_BN.map((mBn, idx) => (
                    <option key={idx} value={idx}>
                      {isBn ? mBn : MONTHS_EN[idx]}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {isBn ? toBengaliNumber(yr) : yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Status Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | SupportTicketCategory)}
                className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="all">{isBn ? 'ক্যাটাগরি: সকল ক্যাটাগরি' : 'Category: All Categories'}</option>
                {CATEGORY_KEYS.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | SupportTicketStatus)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">{isBn ? 'স্ট্যাটাস: সব অবস্থা' : 'Status: All Statuses'}</option>
              <option value="pending">{isBn ? '১. দাখিলকৃত' : '1. Submitted'}</option>
              <option value="reviewing">{isBn ? '২. পর্যালোচনা' : '2. Reviewing'}</option>
              <option value="in_progress">{isBn ? '৩. কাজ চলমান' : '3. In Progress'}</option>
              <option value="resolved">{isBn ? '৪. সমাধানকৃত' : '4. Resolved'}</option>
            </select>
          </div>

          {/* Dedicated Export Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isBn ? 'PDF রিপোর্ট ডাউনলোড' : 'Download PDF Report'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isBn ? 'Excel ফাইল ডাউনলোড' : 'Download Excel (.xls)'}</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isBn ? 'মোট অভিযোগ' : 'Total Complaints'}
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              {formatNum(summary.total)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              {isBn ? '৪. সমাধানকৃত' : '4. Resolved'}
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
              {formatNum(summary.resolved)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 shadow-xs">
            <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
              {isBn ? 'চলমান / বাকি' : 'Open / Active'}
            </p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums mt-1">
              {formatNum(summary.active)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 shadow-xs">
            <p className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
              {isBn ? 'সমাধানের হার' : 'Resolution Rate'}
            </p>
            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 tabular-nums mt-1">
              {formatNum(summary.rate)}%
            </p>
          </div>
        </div>

        {/* Category Comparison Bar Chart */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                {isBn ? 'ক্যাটাগরি অনুযায়ী গ্রাফ' : 'Category Breakdown Chart'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? periodTitleBn : periodTitleEn}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                {isBn ? 'সমাধানকৃত' : 'Resolved'}
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                {isBn ? 'চলমান/বাকি' : 'Active'}
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibleCategoryRows} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={44}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                />
                <Bar
                  dataKey="resolved"
                  name={isBn ? 'সমাধানকৃত' : 'Resolved'}
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="active"
                  name={isBn ? 'চলমান/বাকি' : 'Active'}
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-Wise Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'ক্যাটাগরি অনুযায়ী সারসংক্ষেপ' : 'Category Summary Table'}
            </h4>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isBn ? 'ট্যাপ করে ফিল্টার করুন' : 'Tap row to filter'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3 font-extrabold">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="py-2.5 px-2 text-center font-extrabold">{isBn ? 'মোট' : 'Total'}</th>
                  <th className="py-2.5 px-2 text-center font-extrabold text-rose-600">{isBn ? '১. দাখিল' : '1. Filed'}</th>
                  <th className="py-2.5 px-2 text-center font-extrabold text-sky-600">{isBn ? '২. পর্যালোচনা' : '2. Review'}</th>
                  <th className="py-2.5 px-2 text-center font-extrabold text-amber-600">{isBn ? '৩. চলমান' : '3. Work'}</th>
                  <th className="py-2.5 px-2 text-center font-extrabold text-emerald-600">{isBn ? '৪. সমাধান' : '4. Done'}</th>
                  <th className="py-2.5 px-3 text-right font-extrabold">{isBn ? 'হার' : 'Rate'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleCategoryRows.map((row) => (
                  <tr
                    key={row.category}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedCategory(selectedCategory === row.category ? 'all' : row.category);
                    }}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      selectedCategory === row.category ? 'bg-indigo-50/70 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="py-2.5 px-2 text-center font-black tabular-nums text-slate-900 dark:text-white">
                      {formatNum(row.total)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold tabular-nums text-rose-600 dark:text-rose-400">
                      {formatNum(row.pending)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold tabular-nums text-sky-600 dark:text-sky-400">
                      {formatNum(row.reviewing)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold tabular-nums text-amber-600 dark:text-amber-400">
                      {formatNum(row.inProgress)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {formatNum(row.resolved)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums text-slate-700 dark:text-slate-300">
                      {formatNum(row.rate)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/90 dark:bg-slate-800/80 font-black border-t-2 border-slate-200 dark:border-slate-700">
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white">{isBn ? 'সর্বমোট' : 'Total'}</td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-slate-900 dark:text-white">
                    {formatNum(summary.total)}
                  </td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-rose-600">{formatNum(summary.pending)}</td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-sky-600">{formatNum(summary.reviewing)}</td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-amber-600">{formatNum(summary.inProgress)}</td>
                  <td className="py-2.5 px-2 text-center tabular-nums text-emerald-600">{formatNum(summary.resolved)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-white">
                    {formatNum(summary.rate)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Yearly Month-by-Month Breakdown Table */}
        {periodMode === 'yearly' && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                {isBn
                  ? `মাসভিত্তিক সারসংক্ষেপ (${toBengaliNumber(selectedYear)})`
                  : `Month-by-Month Breakdown (${selectedYear})`}
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-2.5 px-3 font-extrabold">{isBn ? 'মাস' : 'Month'}</th>
                    <th className="py-2.5 px-2 text-center font-extrabold">{isBn ? 'মোট' : 'Total'}</th>
                    <th className="py-2.5 px-2 text-center font-extrabold">{isBn ? 'সমাধানকৃত' : 'Resolved'}</th>
                    <th className="py-2.5 px-2 text-center font-extrabold">{isBn ? 'বাকি' : 'Active'}</th>
                    <th className="py-2.5 px-3 text-right font-extrabold">{isBn ? 'সমাধান হার' : 'Rate'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {monthlyBreakdown.map((m) => (
                    <tr
                      key={m.monthIndex}
                      onClick={() => {
                        sounds.playTap();
                        setSelectedMonth(m.monthIndex);
                        setPeriodMode('monthly');
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    >
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                        {isBn ? m.monthBn : m.monthEn}
                      </td>
                      <td className="py-2 px-2 text-center font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {formatNum(m.total)}
                      </td>
                      <td className="py-2 px-2 text-center font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatNum(m.resolved)}
                      </td>
                      <td className="py-2 px-2 text-center font-bold tabular-nums text-rose-600 dark:text-rose-400">
                        {formatNum(m.total - m.resolved)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold tabular-nums text-slate-600 dark:text-slate-300">
                        {formatNum(m.rate)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Filtered Ticket Register */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              {isBn
                ? `বিস্তারিত অভিযোগ তালিকা (${toBengaliNumber(filteredTickets.length)}টি)`
                : `Filtered Complaint Register (${filteredTickets.length})`}
            </h4>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              {isBn ? selectedCategoryTitleBn : selectedCategory === 'all' ? 'All Categories' : getCategoryName(selectedCategory)}
            </span>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="py-10 px-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              {isBn
                ? 'এই সময়কাল ও ক্যাটাগরিতে কোনো অভিযোগ পাওয়া যায়নি।'
                : 'No complaints found for this period and category.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        #{ticket.ticketNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                        {getCategoryName(ticket.category)}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : ticket.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : ticket.status === 'reviewing'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {getTicketStatusLabel(ticket.status, isBn)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {ticket.customerName}
                      {ticket.customerPhone ? ` • ${ticket.customerPhone}` : ''}
                      {ticket.area ? ` • ${ticket.area}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {isBn ? 'দাখিল:' : 'Filed:'} {ticket.createdBy || '-'} ({formatTicketDateTime(ticket.createdAt, isBn)})
                      </span>
                      {ticket.status === 'resolved' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {isBn ? 'সমাধান:' : 'Resolved:'} {ticket.resolvedBy || ticket.assignedStaffName || '-'} ({formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
