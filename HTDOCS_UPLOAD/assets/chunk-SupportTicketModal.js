import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, Ct as Headphones, Dt as Funnel, En as require_react, J as Plus, L as Send, M as ShieldCheck, Pt as Eye, Q as PenLine, R as Search, Sn as ArrowLeft, Y as Phone, Yt as Clock, Zt as CircleCheck, _ as TriangleAlert, _t as KeyRound, an as ChartPie, cn as ChartColumn, dt as Lock, en as ChevronRight, f as User, it as MessageCircle, jt as FileSpreadsheet, lt as LogOut, m as UserCheck, n as X, pt as Link2, r as Wrench, rn as Check, rt as MessageSquare, st as MapPin, tn as ChevronLeft, un as Calendar, x as Trash2, xt as History } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, l as onSnapshot, p as query, u as orderBy, y as doc } from "./chunk-vendor-firebase.js";
import { i as toBengaliNumber } from "./chunk-formatters.js";
import { $ as getTicketRoleLabel, A as formatRemainingCountdown, F as normalizePhoneNumber, G as CATEGORY_LABELS, J as TicketActivityTimeline, K as PublicTrackingShareCard, N as isSupportTicketOwner, O as canModifySupportTicket, Q as formatTicketDateTime, X as buildPublicTrackingUrl, Y as TicketProgressStepper, Z as copyTextSafely, at as handleFirestoreError, c as findMatchedStaffForUser, et as getTicketStatusLabel, g as isActualStaffAccount, it as db, j as hasSubAdminPermission, nt as OperationType, ot as safeDeleteDoc, q as TICKET_STAGES, st as safeSetDoc, tt as sounds } from "./app.js";
import { D as Tooltip, X as ResponsiveContainer, a as Bar, i as XAxis, r as YAxis, t as BarChart, u as CartesianGrid } from "./chunk-BarChart.js";
//#region src/components/TicketReportView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MONTHS_BN = [
	"জানুয়ারি",
	"ফেব্রুয়ারি",
	"মার্চ",
	"এপ্রিল",
	"মে",
	"জুন",
	"জুলাই",
	"আগস্ট",
	"সেপ্টেম্বর",
	"অক্টোবর",
	"নভেম্বর",
	"ডিসেম্বর"
];
var MONTHS_EN = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);
var escapeHtml = (value) => {
	return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var printHtmlViaIframe = (htmlContent) => {
	var _iframe$contentWindow;
	const iframe = document.createElement("iframe");
	iframe.style.position = "fixed";
	iframe.style.right = "0";
	iframe.style.bottom = "0";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "0";
	document.body.appendChild(iframe);
	const iframeDoc = (_iframe$contentWindow = iframe.contentWindow) === null || _iframe$contentWindow === void 0 ? void 0 : _iframe$contentWindow.document;
	if (!iframeDoc) {
		document.body.removeChild(iframe);
		return;
	}
	iframeDoc.open();
	iframeDoc.write(htmlContent);
	iframeDoc.close();
	setTimeout(() => {
		try {
			var _iframe$contentWindow2, _iframe$contentWindow3;
			(_iframe$contentWindow2 = iframe.contentWindow) === null || _iframe$contentWindow2 === void 0 || _iframe$contentWindow2.focus();
			(_iframe$contentWindow3 = iframe.contentWindow) === null || _iframe$contentWindow3 === void 0 || _iframe$contentWindow3.print();
		} finally {
			setTimeout(() => {
				if (document.body.contains(iframe)) document.body.removeChild(iframe);
			}, 1500);
		}
	}, 350);
};
var getTicketDateParts = (ticket) => {
	const raw = ticket.createdAt || ticket.updatedAt;
	if (!raw) return null;
	const d = new Date(raw);
	if (isNaN(d.getTime())) return null;
	return {
		year: d.getFullYear(),
		month: d.getMonth()
	};
};
var TicketReportView = ({ tickets, lang, actorName, isScopedToOwnOnly, onClose }) => {
	const isBn = lang === "bn";
	const now = /* @__PURE__ */ new Date();
	const [periodMode, setPeriodMode] = (0, import_react.useState)("monthly");
	const [selectedYear, setSelectedYear] = (0, import_react.useState)(now.getFullYear());
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(now.getMonth());
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const availableYears = (0, import_react.useMemo)(() => {
		const years = /* @__PURE__ */ new Set([
			now.getFullYear(),
			now.getFullYear() - 1,
			now.getFullYear() + 1
		]);
		tickets.forEach((t) => {
			const parts = getTicketDateParts(t);
			if (parts) years.add(parts.year);
		});
		return Array.from(years).sort((a, b) => b - a);
	}, [tickets]);
	const formatNum = (n) => isBn ? toBengaliNumber(n) : n.toLocaleString("en-US");
	const getCategoryName = (cat) => {
		const meta = CATEGORY_LABELS[cat];
		return meta ? isBn ? meta.bn : meta.en : cat;
	};
	const periodTickets = (0, import_react.useMemo)(() => {
		return tickets.filter((t) => {
			const parts = getTicketDateParts(t);
			if (!parts) return false;
			if (parts.year !== selectedYear) return false;
			if (periodMode === "monthly" && parts.month !== selectedMonth) return false;
			return true;
		});
	}, [
		tickets,
		periodMode,
		selectedYear,
		selectedMonth
	]);
	const filteredTickets = (0, import_react.useMemo)(() => {
		return periodTickets.filter((t) => {
			if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
			if (selectedStatus !== "all" && t.status !== selectedStatus) return false;
			return true;
		}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}, [
		periodTickets,
		selectedCategory,
		selectedStatus
	]);
	const summary = (0, import_react.useMemo)(() => {
		let pending = 0;
		let reviewing = 0;
		let inProgress = 0;
		let resolved = 0;
		filteredTickets.forEach((t) => {
			if (t.status === "pending") pending++;
			else if (t.status === "reviewing") reviewing++;
			else if (t.status === "in_progress") inProgress++;
			else if (t.status === "resolved") resolved++;
		});
		const total = filteredTickets.length;
		const active = pending + reviewing + inProgress;
		const rate = total > 0 ? Math.round(resolved / total * 100) : 0;
		return {
			total,
			pending,
			reviewing,
			inProgress,
			resolved,
			active,
			rate
		};
	}, [filteredTickets]);
	const categoryBreakdown = (0, import_react.useMemo)(() => {
		const source = selectedStatus === "all" ? periodTickets : periodTickets.filter((t) => t.status === selectedStatus);
		return CATEGORY_KEYS.map((catKey) => {
			const items = source.filter((t) => t.category === catKey);
			let pending = 0;
			let reviewing = 0;
			let inProgress = 0;
			let resolved = 0;
			items.forEach((t) => {
				if (t.status === "pending") pending++;
				else if (t.status === "reviewing") reviewing++;
				else if (t.status === "in_progress") inProgress++;
				else if (t.status === "resolved") resolved++;
			});
			const total = items.length;
			const active = pending + reviewing + inProgress;
			const rate = total > 0 ? Math.round(resolved / total * 100) : 0;
			const fullLabel = isBn ? CATEGORY_LABELS[catKey].bn : CATEGORY_LABELS[catKey].en;
			return {
				category: catKey,
				label: fullLabel,
				shortLabel: fullLabel.split("/")[0].trim(),
				total,
				pending,
				reviewing,
				inProgress,
				active,
				resolved,
				rate
			};
		});
	}, [
		periodTickets,
		selectedStatus,
		isBn
	]);
	const visibleCategoryRows = (0, import_react.useMemo)(() => {
		if (selectedCategory === "all") return categoryBreakdown;
		return categoryBreakdown.filter((row) => row.category === selectedCategory);
	}, [categoryBreakdown, selectedCategory]);
	const monthlyBreakdown = (0, import_react.useMemo)(() => {
		return Array.from({ length: 12 }, (_, mIdx) => {
			const items = filteredTickets.filter((t) => {
				const parts = getTicketDateParts(t);
				return (parts === null || parts === void 0 ? void 0 : parts.month) === mIdx;
			});
			let pending = 0;
			let reviewing = 0;
			let inProgress = 0;
			let resolved = 0;
			items.forEach((t) => {
				if (t.status === "pending") pending++;
				else if (t.status === "reviewing") reviewing++;
				else if (t.status === "in_progress") inProgress++;
				else if (t.status === "resolved") resolved++;
			});
			const total = items.length;
			const rate = total > 0 ? Math.round(resolved / total * 100) : 0;
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
	const periodTitleBn = periodMode === "monthly" ? `${MONTHS_BN[selectedMonth]} ${toBengaliNumber(selectedYear)}` : `বছর ${toBengaliNumber(selectedYear)}`;
	const periodTitleEn = periodMode === "monthly" ? `${MONTHS_EN[selectedMonth]} ${selectedYear}` : `Year ${selectedYear}`;
	const selectedCategoryTitleBn = selectedCategory === "all" ? "সকল ক্যাটাগরি" : CATEGORY_LABELS[selectedCategory].bn;
	const handlePrevPeriod = () => {
		sounds.playTap();
		if (periodMode === "monthly") {
			if (selectedMonth === 0) {
				setSelectedMonth(11);
				setSelectedYear((y) => y - 1);
			} else setSelectedMonth((m) => m - 1);
		} else setSelectedYear((y) => y - 1);
	};
	const handleNextPeriod = () => {
		sounds.playTap();
		if (periodMode === "monthly") {
			if (selectedMonth === 11) {
				setSelectedMonth(0);
				setSelectedYear((y) => y + 1);
			} else setSelectedMonth((m) => m + 1);
		} else setSelectedYear((y) => y + 1);
	};
	const handleDownloadExcel = () => {
		sounds.playSuccess();
		const categoryRowsHtml = visibleCategoryRows.map((c) => `
        <tr>
          <td>${escapeHtml(CATEGORY_LABELS[c.category].bn)}</td>
          <td style="font-weight:bold;text-align:center;">${c.total}</td>
          <td style="text-align:center;color:#e11d48;">${c.pending}</td>
          <td style="text-align:center;color:#0284c7;">${c.reviewing}</td>
          <td style="text-align:center;color:#d97706;">${c.inProgress}</td>
          <td style="text-align:center;color:#059669;font-weight:bold;">${c.resolved}</td>
          <td style="text-align:center;font-weight:bold;">${c.rate}%</td>
        </tr>`).join("");
		const yearlyMonthSectionHtml = periodMode === "yearly" ? `
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
        ${monthlyBreakdown.map((m) => `
          <tr>
            <td>${escapeHtml(m.monthBn)} ${toBengaliNumber(selectedYear)}</td>
            <td style="text-align:center;font-weight:bold;">${m.total}</td>
            <td style="text-align:center;">${m.pending}</td>
            <td style="text-align:center;">${m.reviewing}</td>
            <td style="text-align:center;">${m.inProgress}</td>
            <td style="text-align:center;color:#059669;font-weight:bold;">${m.resolved}</td>
            <td style="text-align:center;">${m.rate}%</td>
          </tr>`).join("")}
      </table>` : "";
		const detailRowsHtml = filteredTickets.map((t, idx) => {
			var _CATEGORY_LABELS$t$ca;
			return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td>#${escapeHtml(t.ticketNumber)}</td>
          <td>${escapeHtml(formatTicketDateTime(t.createdAt, true))}</td>
          <td>${escapeHtml(t.customerName)}${t.customerCode ? ` (${escapeHtml(t.customerCode)})` : ""}</td>
          <td>${escapeHtml(t.customerPhone || "-")}</td>
          <td>${escapeHtml(t.area || "-")}</td>
          <td>${escapeHtml(((_CATEGORY_LABELS$t$ca = CATEGORY_LABELS[t.category]) === null || _CATEGORY_LABELS$t$ca === void 0 ? void 0 : _CATEGORY_LABELS$t$ca.bn) || t.category)}</td>
          <td style="font-weight:bold;">${escapeHtml(getTicketStatusLabel(t.status, true))}</td>
          <td>${escapeHtml(t.createdBy || "-")}</td>
          <td>${escapeHtml(t.assignedStaffName || "-")}</td>
          <td>${escapeHtml(t.resolvedBy || "-")}</td>
          <td>${escapeHtml(t.resolvedAt ? formatTicketDateTime(t.resolvedAt, true) : "-")}</td>
          <td>${escapeHtml(t.resolutionNote || t.description || "-")}</td>
        </tr>`;
		}).join("");
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
          ${detailRowsHtml || "<tr><td colspan=\"13\" align=\"center\">কোনো অভিযোগ পাওয়া যায়নি</td></tr>"}
        </table>
      </body>
      </html>`;
		const blob = new Blob(["﻿" + html], { type: "application/vnd.ms-excel;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		const catSlug = selectedCategory === "all" ? "all_categories" : selectedCategory;
		a.download = `protyasha_complaint_report_${periodMode === "monthly" ? `${MONTHS_EN[selectedMonth]}_${selectedYear}` : `year_${selectedYear}`}_${catSlug}.xls`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handleDownloadPdf = () => {
		sounds.playSuccess();
		const categoryRowsHtml = visibleCategoryRows.map((c) => `
        <tr>
          <td style="text-align:left;font-weight:600;">${escapeHtml(CATEGORY_LABELS[c.category].bn)}</td>
          <td style="font-weight:800;">${toBengaliNumber(c.total)}</td>
          <td style="color:#e11d48;font-weight:700;">${toBengaliNumber(c.pending)}</td>
          <td style="color:#0284c7;font-weight:700;">${toBengaliNumber(c.reviewing)}</td>
          <td style="color:#d97706;font-weight:700;">${toBengaliNumber(c.inProgress)}</td>
          <td style="color:#059669;font-weight:800;">${toBengaliNumber(c.resolved)}</td>
          <td style="font-weight:700;">${toBengaliNumber(c.rate)}%</td>
        </tr>`).join("");
		const yearlyMonthHtml = periodMode === "yearly" ? `
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
            ${monthlyBreakdown.map((m) => `
              <tr>
                <td style="text-align:left;font-weight:600;">${escapeHtml(m.monthBn)}</td>
                <td style="font-weight:800;">${toBengaliNumber(m.total)}</td>
                <td>${toBengaliNumber(m.pending)}</td>
                <td>${toBengaliNumber(m.reviewing)}</td>
                <td>${toBengaliNumber(m.inProgress)}</td>
                <td style="color:#059669;font-weight:700;">${toBengaliNumber(m.resolved)}</td>
                <td>${toBengaliNumber(m.rate)}%</td>
              </tr>`).join("")}
          </tbody>
        </table>` : "";
		const detailRowsHtml = filteredTickets.map((t, idx) => {
			var _CATEGORY_LABELS$t$ca2;
			return `
        <tr>
          <td>${toBengaliNumber(idx + 1)}</td>
          <td style="font-family:monospace;font-weight:700;">#${escapeHtml(t.ticketNumber)}</td>
          <td style="text-align:left;">
            <strong>${escapeHtml(t.customerName)}</strong><br/>
            <span style="font-size:10px;color:#475569;">${escapeHtml(t.customerPhone || "")}${t.area ? ` • ${escapeHtml(t.area)}` : ""}</span>
          </td>
          <td>${escapeHtml(((_CATEGORY_LABELS$t$ca2 = CATEGORY_LABELS[t.category]) === null || _CATEGORY_LABELS$t$ca2 === void 0 ? void 0 : _CATEGORY_LABELS$t$ca2.bn) || t.category)}</td>
          <td style="font-weight:700;">${escapeHtml(getTicketStatusLabel(t.status, true))}</td>
          <td style="text-align:left;font-size:10px;">
            <div><strong>দাখিল:</strong> ${escapeHtml(t.createdBy || "-")}</div>
            <div style="color:#64748b;">${escapeHtml(formatTicketDateTime(t.createdAt, true))}</div>
          </td>
          <td style="text-align:left;font-size:10px;">
            <div><strong>সমাধান:</strong> ${escapeHtml(t.resolvedBy || t.assignedStaffName || "-")}</div>
            <div style="color:#64748b;">${escapeHtml(t.resolvedAt ? formatTicketDateTime(t.resolvedAt, true) : "-")}</div>
          </td>
        </tr>`;
		}).join("");
		printHtmlViaIframe(`<!DOCTYPE html>
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
      <div><strong>প্রস্তুতকারী:</strong> ${escapeHtml(actorName)} • ${escapeHtml(formatTicketDateTime((/* @__PURE__ */ new Date()).toISOString(), true))}</div>
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
      ${detailRowsHtml || `<tr><td colspan="7" style="padding:18px;color:#64748b;">এই সময়কাল ও ক্যাটাগরিতে কোনো অভিযোগ নেই</td></tr>`}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-box">প্রস্তুতকারী (${escapeHtml(actorName)})</div>
    <div class="sig-box">অনুমোদনকারী / অ্যাডমিন</div>
  </div>
</body>
</html>`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-60 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-5 h-15 flex items-center justify-between gap-2 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer",
						"aria-label": "Back to tickets",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4.5 h-4.5 stroke-[2.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate",
							children: isBn ? "ক্যাটাগরি অভিযোগ রিপোর্ট" : "Category Complaint Report"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate",
							children: isScopedToOwnOnly ? isBn ? "আপনার নিজস্ব অভিযোগের রিপোর্ট" : "Your own complaints report" : isBn ? "সকল অভিযোগের মাসিক ও বাৎসরিক রিপোর্ট" : "All complaints monthly & yearly report"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleDownloadPdf,
					className: "h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer",
					title: isBn ? "PDF ডাউনলোড" : "Download PDF",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PDF" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleDownloadExcel,
					className: "h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer",
					title: isBn ? "Excel ডাউনলোড" : "Download Excel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Excel" })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-20 w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setPeriodMode("monthly");
								},
								className: `h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${periodMode === "monthly" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মাস ভিত্তিক রিপোর্ট" : "Monthly Report" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setPeriodMode("yearly");
								},
								className: `h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${periodMode === "yearly" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-3.5 h-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বছর ভিত্তিক রিপোর্ট" : "Yearly Report" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handlePrevPeriod,
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										"aria-label": "Previous period",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4.5 h-4.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-3.5 h-9 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white min-w-[140px]",
										children: isBn ? periodTitleBn : periodTitleEn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleNextPeriod,
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										"aria-label": "Next period",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4.5 h-4.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [periodMode === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedMonth,
									onChange: (e) => setSelectedMonth(Number(e.target.value)),
									className: "h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none",
									children: MONTHS_BN.map((mBn, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: idx,
										children: isBn ? mBn : MONTHS_EN[idx]
									}, idx))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedYear,
									onChange: (e) => setSelectedYear(Number(e.target.value)),
									className: "h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none",
									children: availableYears.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: yr,
										children: isBn ? toBengaliNumber(yr) : yr
									}, yr))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedCategory,
									onChange: (e) => setSelectedCategory(e.target.value),
									className: "w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: isBn ? "ক্যাটাগরি: সকল ক্যাটাগরি" : "Category: All Categories"
									}), CATEGORY_KEYS.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: cat,
										children: getCategoryName(cat)
									}, cat))]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: selectedStatus,
								onChange: (e) => setSelectedStatus(e.target.value),
								className: "w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: isBn ? "স্ট্যাটাস: সব অবস্থা" : "Status: All Statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: isBn ? "১. দাখিলকৃত" : "1. Submitted"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "reviewing",
										children: isBn ? "২. পর্যালোচনা" : "2. Reviewing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "in_progress",
										children: isBn ? "৩. কাজ চলমান" : "3. In Progress"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "resolved",
										children: isBn ? "৪. সমাধানকৃত" : "4. Resolved"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDownloadPdf,
								className: "h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "PDF রিপোর্ট ডাউনলোড" : "Download PDF Report" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDownloadExcel,
								className: "h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "Excel ফাইল ডাউনলোড" : "Download Excel (.xls)" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
								children: isBn ? "মোট অভিযোগ" : "Total Complaints"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-1",
								children: formatNum(summary.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold text-emerald-700 dark:text-emerald-300",
								children: isBn ? "৪. সমাধানকৃত" : "4. Resolved"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1",
								children: formatNum(summary.resolved)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold text-rose-700 dark:text-rose-300",
								children: isBn ? "চলমান / বাকি" : "Open / Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums mt-1",
								children: formatNum(summary.active)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold text-sky-700 dark:text-sky-300",
								children: isBn ? "সমাধানের হার" : "Resolution Rate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-2xl font-black text-sky-600 dark:text-sky-400 tabular-nums mt-1",
								children: [formatNum(summary.rate), "%"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
							children: isBn ? "ক্যাটাগরি অনুযায়ী গ্রাফ" : "Category Breakdown Chart"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400",
							children: isBn ? periodTitleBn : periodTitleEn
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-[10px] font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-xs bg-emerald-500" }), isBn ? "সমাধানকৃত" : "Resolved"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-rose-600 dark:text-rose-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-xs bg-rose-500" }), isBn ? "চলমান/বাকি" : "Active"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: visibleCategoryRows,
								margin: {
									top: 8,
									right: 8,
									left: -18,
									bottom: 8
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "#e2e8f0",
										opacity: .5
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "shortLabel",
										tick: {
											fontSize: 10,
											fill: "#64748b"
										},
										interval: 0,
										angle: -15,
										textAnchor: "end",
										height: 44
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										tick: {
											fontSize: 10,
											fill: "#64748b"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: 12,
										border: "1px solid #e2e8f0",
										fontSize: 12,
										fontWeight: 700
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "resolved",
										name: isBn ? "সমাধানকৃত" : "Resolved",
										fill: "#10b981",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "active",
										name: isBn ? "চলমান/বাকি" : "Active",
										fill: "#f43f5e",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
							children: isBn ? "ক্যাটাগরি অনুযায়ী সারসংক্ষেপ" : "Category Summary Table"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
							children: isBn ? "ট্যাপ করে ফিল্টার করুন" : "Tap row to filter"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 font-extrabold",
										children: isBn ? "ক্যাটাগরি" : "Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold",
										children: isBn ? "মোট" : "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold text-rose-600",
										children: isBn ? "১. দাখিল" : "1. Filed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold text-sky-600",
										children: isBn ? "২. পর্যালোচনা" : "2. Review"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold text-amber-600",
										children: isBn ? "৩. চলমান" : "3. Work"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold text-emerald-600",
										children: isBn ? "৪. সমাধান" : "4. Done"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 text-right font-extrabold",
										children: isBn ? "হার" : "Rate"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800",
								children: [visibleCategoryRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => {
										sounds.playTap();
										setSelectedCategory(selectedCategory === row.category ? "all" : row.category);
									},
									className: `hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${selectedCategory === row.category ? "bg-indigo-50/70 dark:bg-indigo-950/30" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap",
											children: row.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center font-black tabular-nums text-slate-900 dark:text-white",
											children: formatNum(row.total)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center font-bold tabular-nums text-rose-600 dark:text-rose-400",
											children: formatNum(row.pending)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center font-bold tabular-nums text-sky-600 dark:text-sky-400",
											children: formatNum(row.reviewing)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center font-bold tabular-nums text-amber-600 dark:text-amber-400",
											children: formatNum(row.inProgress)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400",
											children: formatNum(row.resolved)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-3 text-right font-bold tabular-nums text-slate-700 dark:text-slate-300",
											children: [formatNum(row.rate), "%"]
										})
									]
								}, row.category)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-slate-50/90 dark:bg-slate-800/80 font-black border-t-2 border-slate-200 dark:border-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-slate-900 dark:text-white",
											children: isBn ? "সর্বমোট" : "Total"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center tabular-nums text-slate-900 dark:text-white",
											children: formatNum(summary.total)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center tabular-nums text-rose-600",
											children: formatNum(summary.pending)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center tabular-nums text-sky-600",
											children: formatNum(summary.reviewing)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center tabular-nums text-amber-600",
											children: formatNum(summary.inProgress)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-center tabular-nums text-emerald-600",
											children: formatNum(summary.resolved)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-3 text-right tabular-nums text-slate-900 dark:text-white",
											children: [formatNum(summary.rate), "%"]
										})
									]
								})]
							})]
						})
					})]
				}),
				periodMode === "yearly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
							children: isBn ? `মাসভিত্তিক সারসংক্ষেপ (${toBengaliNumber(selectedYear)})` : `Month-by-Month Breakdown (${selectedYear})`
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 font-extrabold",
										children: isBn ? "মাস" : "Month"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold",
										children: isBn ? "মোট" : "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold",
										children: isBn ? "সমাধানকৃত" : "Resolved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-2 text-center font-extrabold",
										children: isBn ? "বাকি" : "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3 text-right font-extrabold",
										children: isBn ? "সমাধান হার" : "Rate"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100 dark:divide-slate-800",
								children: monthlyBreakdown.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => {
										sounds.playTap();
										setSelectedMonth(m.monthIndex);
										setPeriodMode("monthly");
									},
									className: "hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-3 font-bold text-slate-900 dark:text-white",
											children: isBn ? m.monthBn : m.monthEn
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center font-extrabold tabular-nums text-slate-900 dark:text-white",
											children: formatNum(m.total)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center font-bold tabular-nums text-emerald-600 dark:text-emerald-400",
											children: formatNum(m.resolved)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 text-center font-bold tabular-nums text-rose-600 dark:text-rose-400",
											children: formatNum(m.total - m.resolved)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-3 text-right font-bold tabular-nums text-slate-600 dark:text-slate-300",
											children: [formatNum(m.rate), "%"]
										})
									]
								}, m.monthIndex))
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
							children: isBn ? `বিস্তারিত অভিযোগ তালিকা (${toBengaliNumber(filteredTickets.length)}টি)` : `Filtered Complaint Register (${filteredTickets.length})`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-indigo-600 dark:text-indigo-400",
							children: isBn ? selectedCategoryTitleBn : selectedCategory === "all" ? "All Categories" : getCategoryName(selectedCategory)
						})]
					}), filteredTickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-10 px-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400",
						children: isBn ? "এই সময়কাল ও ক্যাটাগরিতে কোনো অভিযোগ পাওয়া যায়নি।" : "No complaints found for this period and category."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-slate-100 dark:divide-slate-800",
						children: filteredTickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
												children: ["#", ticket.ticketNumber]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
												children: getCategoryName(ticket.category)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-extrabold px-2 py-0.5 rounded ${ticket.status === "resolved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : ticket.status === "in_progress" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : ticket.status === "reviewing" ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"}`,
												children: getTicketStatusLabel(ticket.status, isBn)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate",
										children: [
											ticket.customerName,
											ticket.customerPhone ? ` • ${ticket.customerPhone}` : "",
											ticket.area ? ` • ${ticket.area}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
												isBn ? "দাখিল:" : "Filed:",
												" ",
												ticket.createdBy || "-",
												" (",
												formatTicketDateTime(ticket.createdAt, isBn),
												")"
											]
										}), ticket.status === "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }),
												isBn ? "সমাধান:" : "Resolved:",
												" ",
												ticket.resolvedBy || ticket.assignedStaffName || "-",
												" (",
												formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn),
												")"
											]
										})]
									})
								]
							})
						}, ticket.id))
					})]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/SupportTicketModal.tsx
var CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS).map((id) => ({
	id,
	labelBn: CATEGORY_LABELS[id].bn,
	labelEn: CATEGORY_LABELS[id].en
}));
var PRIORITY_OPTIONS = [
	{
		id: "urgent",
		labelBn: "জরুরি",
		labelEn: "Urgent",
		badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
	},
	{
		id: "high",
		labelBn: "উচ্চ",
		labelEn: "High",
		badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
	},
	{
		id: "normal",
		labelBn: "সাধারণ",
		labelEn: "Normal",
		badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
	}
];
var QUICK_REPLIES_BN = [
	"অভিযোগ পর্যালোচনা করা হচ্ছে",
	"টেকনিশিয়ান রওনা হয়েছে",
	"লাইন চেক করা হচ্ছে",
	"সমস্যা সমাধান হয়েছে"
];
var QUICK_REPLIES_EN = [
	"Under review now",
	"Technician on the way",
	"Checking line now",
	"Issue resolved"
];
var SupportTicketModal = ({ isOpen, tickets, staffAccounts, lang, user, onClose, onSaveTicket, onDeleteTicket, onSubViewChange, onPreviewPublicLink }) => {
	var _staffAccounts$filter;
	const isBn = lang === "bn";
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [isFormOpen, setIsFormOpen] = (0, import_react.useState)(false);
	const [editingTicket, setEditingTicket] = (0, import_react.useState)(null);
	const [customerName, setCustomerName] = (0, import_react.useState)("");
	const [customerPhone, setCustomerPhone] = (0, import_react.useState)("");
	const [customerCode, setCustomerCode] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("line_cut");
	const [priority, setPriority] = (0, import_react.useState)("normal");
	const [assignedStaffId, setAssignedStaffId] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [resolutionNote, setResolutionNote] = (0, import_react.useState)("");
	const [formError, setFormError] = (0, import_react.useState)("");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [resolvingTicketId, setResolvingTicketId] = (0, import_react.useState)(null);
	const [quickResolveNote, setQuickResolveNote] = (0, import_react.useState)("");
	const [quickResolverName, setQuickResolverName] = (0, import_react.useState)("");
	const [copiedTicketId, setCopiedTicketId] = (0, import_react.useState)(null);
	const [activeDetailTicketId, setActiveDetailTicketId] = (0, import_react.useState)(null);
	const [detailTab, setDetailTab] = (0, import_react.useState)("chat");
	const [chatMessages, setChatMessages] = (0, import_react.useState)([]);
	const [chatInput, setChatInput] = (0, import_react.useState)("");
	const [isSendingChat, setIsSendingChat] = (0, import_react.useState)(false);
	const [chatLoading, setChatLoading] = (0, import_react.useState)(false);
	const [confirmDeleteMsgId, setConfirmDeleteMsgId] = (0, import_react.useState)(null);
	const chatBottomRef = (0, import_react.useRef)(null);
	const [staffSession, setStaffSession] = (0, import_react.useState)(() => {
		try {
			const saved = sessionStorage.getItem("protyasha_support_staff_session");
			if (saved) return JSON.parse(saved);
		} catch {}
		return null;
	});
	const [isStaffLoginOpen, setIsStaffLoginOpen] = (0, import_react.useState)(false);
	const [staffLoginIdentifier, setStaffLoginIdentifier] = (0, import_react.useState)("");
	const [staffLoginPin, setStaffLoginPin] = (0, import_react.useState)("");
	const [staffLoginError, setStaffLoginError] = (0, import_react.useState)("");
	const [isVerifyingStaff, setIsVerifyingStaff] = (0, import_react.useState)(false);
	const [staffAuthConfig, setStaffAuthConfig] = (0, import_react.useState)({
		globalPin: "1234",
		staffPins: {}
	});
	const [isStaffPinModalOpen, setIsStaffPinModalOpen] = (0, import_react.useState)(false);
	const [editGlobalStaffPin, setEditGlobalStaffPin] = (0, import_react.useState)("1234");
	const [editPerStaffPins, setEditPerStaffPins] = (0, import_react.useState)({});
	const [isSavingStaffPin, setIsSavingStaffPin] = (0, import_react.useState)(false);
	const [staffPinSavedNotice, setStaffPinSavedNotice] = (0, import_react.useState)("");
	const [isReportOpen, setIsReportOpen] = (0, import_react.useState)(false);
	const [nowTick, setNowTick] = (0, import_react.useState)(() => Date.now());
	const subViewHistoryDepthRef = (0, import_react.useRef)(0);
	const subViewStateRef = (0, import_react.useRef)({
		activeDetailTicketId,
		isFormOpen,
		isReportOpen,
		isStaffLoginOpen,
		isStaffPinModalOpen
	});
	subViewStateRef.current = {
		activeDetailTicketId,
		isFormOpen,
		isReportOpen,
		isStaffLoginOpen,
		isStaffPinModalOpen
	};
	const isVisitor = (user === null || user === void 0 ? void 0 : user.role) === "visitor";
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const isSubAdminUser = (user === null || user === void 0 ? void 0 : user.role) === "sub-admin";
	const isStaffRoleUser = (user === null || user === void 0 ? void 0 : user.role) === "staff";
	const hasSubAdminSupportPerm = isSubAdminUser && hasSubAdminPermission(user, "supportTickets");
	const matchedMainStaff = (0, import_react.useMemo)(() => hasSubAdminSupportPerm ? findMatchedStaffForUser(user, staffAccounts) : null, [
		hasSubAdminSupportPerm,
		user,
		staffAccounts
	]);
	const isMainPageStaff = hasSubAdminSupportPerm;
	const isManualTempStaffSession = Boolean(staffSession) && !isMainPageStaff && !isAdmin && !isStaffRoleUser;
	const isStaffActive = isMainPageStaff || isManualTempStaffSession;
	const canViewAllTickets = isAdmin || isStaffActive;
	const canChangeStatus = isAdmin || isStaffActive;
	const canDeleteAnyMessage = isAdmin || isStaffActive;
	const canMutateTickets = isAdmin || isStaffActive;
	const activeActorName = ((isManualTempStaffSession ? staffSession === null || staffSession === void 0 ? void 0 : staffSession.name : void 0) || (matchedMainStaff === null || matchedMainStaff === void 0 ? void 0 : matchedMainStaff.name) || (user === null || user === void 0 ? void 0 : user.name) || (staffSession === null || staffSession === void 0 ? void 0 : staffSession.name) || (isBn ? "অ্যাডমিন" : "Admin")).slice(0, 128);
	const activeActorRole = isAdmin ? "admin" : isSubAdminUser ? "sub-admin" : isStaffActive ? "staff" : (user === null || user === void 0 ? void 0 : user.role) || "user";
	const activeActorId = ((isManualTempStaffSession ? staffSession === null || staffSession === void 0 ? void 0 : staffSession.staffId : void 0) || (matchedMainStaff === null || matchedMainStaff === void 0 ? void 0 : matchedMainStaff.id) || (user === null || user === void 0 ? void 0 : user.id) || (staffSession === null || staffSession === void 0 ? void 0 : staffSession.staffId) || (user === null || user === void 0 ? void 0 : user.phone) || "").slice(0, 128);
	const activeActorPhone = ((isManualTempStaffSession ? staffSession === null || staffSession === void 0 ? void 0 : staffSession.phone : void 0) || (matchedMainStaff === null || matchedMainStaff === void 0 ? void 0 : matchedMainStaff.phone) || (user === null || user === void 0 ? void 0 : user.phone) || (staffSession === null || staffSession === void 0 ? void 0 : staffSession.phone) || "").slice(0, 32);
	(0, import_react.useEffect)(() => {
		if (isAdmin || !user) {
			if (staffSession) {
				setStaffSession(null);
				try {
					sessionStorage.removeItem("protyasha_support_staff_session");
				} catch {}
			}
		}
	}, [
		isAdmin,
		user,
		staffSession
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		let unsub = null;
		try {
			unsub = onSnapshot(doc(db, "settings", "staff_support_auth"), (snap) => {
				if (snap.exists()) {
					const data = snap.data();
					setStaffAuthConfig({
						globalPin: String(data.globalPin || "1234"),
						staffPins: data.staffPins && typeof data.staffPins === "object" ? data.staffPins : {}
					});
				}
			}, () => {});
		} catch {}
		return () => {
			if (unsub) unsub();
		};
	}, [isOpen]);
	const visibleTickets = (0, import_react.useMemo)(() => {
		if (canViewAllTickets) return tickets;
		if (!user || isVisitor) return [];
		return tickets.filter((t) => isSupportTicketOwner(t, user, staffSession));
	}, [
		tickets,
		canViewAllTickets,
		user,
		isVisitor,
		staffSession
	]);
	const hasActiveCountdownTicket = (0, import_react.useMemo)(() => {
		if (!isOpen || isAdmin) return false;
		const now = Date.now();
		return visibleTickets.some((t) => {
			if (!isSupportTicketOwner(t, user, staffSession)) return false;
			const createdMs = t.createdAt ? new Date(t.createdAt).getTime() : 0;
			return createdMs > 0 && now - createdMs <= 602e3;
		});
	}, [
		isOpen,
		isAdmin,
		visibleTickets,
		user,
		staffSession
	]);
	(0, import_react.useEffect)(() => {
		if (!hasActiveCountdownTicket) return;
		setNowTick(Date.now());
		const timer = window.setInterval(() => {
			setNowTick(Date.now());
		}, 1e3);
		return () => window.clearInterval(timer);
	}, [hasActiveCountdownTicket]);
	const activeDetailTicket = (0, import_react.useMemo)(() => activeDetailTicketId ? visibleTickets.find((t) => t.id === activeDetailTicketId) || null : null, [visibleTickets, activeDetailTicketId]);
	(0, import_react.useEffect)(() => {
		onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(isOpen && (Boolean(activeDetailTicketId) || isFormOpen || isReportOpen || isStaffLoginOpen || isStaffPinModalOpen));
		return () => {
			onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(false);
		};
	}, [
		isOpen,
		activeDetailTicketId,
		isFormOpen,
		isReportOpen,
		isStaffLoginOpen,
		isStaffPinModalOpen,
		onSubViewChange
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setActiveDetailTicketId(null);
			setIsFormOpen(false);
			setIsReportOpen(false);
			setIsStaffLoginOpen(false);
			setIsStaffPinModalOpen(false);
			subViewHistoryDepthRef.current = 0;
		}
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleSubViewPopState = () => {
			const { activeDetailTicketId: detailId, isFormOpen: formOpen, isReportOpen: reportOpen, isStaffLoginOpen: staffLoginOpen, isStaffPinModalOpen: pinModalOpen } = subViewStateRef.current;
			if (pinModalOpen) {
				setIsStaffPinModalOpen(false);
				subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			} else if (staffLoginOpen) {
				setIsStaffLoginOpen(false);
				subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			} else if (formOpen) {
				setIsFormOpen(false);
				subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			} else if (reportOpen) {
				setIsReportOpen(false);
				subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			} else if (detailId) {
				setActiveDetailTicketId(null);
				setChatInput("");
				setConfirmDeleteMsgId(null);
				subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			}
		};
		window.addEventListener("popstate", handleSubViewPopState);
		return () => window.removeEventListener("popstate", handleSubViewPopState);
	}, [isOpen]);
	const pushSubViewHistory = () => {
		window.history.pushState({
			supportSubView: true,
			time: Date.now()
		}, "");
		subViewHistoryDepthRef.current += 1;
	};
	const closeSubViewViaBack = (fallbackClose) => {
		var _window$history$state;
		sounds.playTap();
		if (subViewHistoryDepthRef.current > 0 && ((_window$history$state = window.history.state) === null || _window$history$state === void 0 ? void 0 : _window$history$state.supportSubView)) window.history.back();
		else {
			subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			fallbackClose();
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen || !activeDetailTicketId) {
			setChatMessages([]);
			setChatLoading(false);
			return;
		}
		setChatLoading(true);
		let unsubscribe = null;
		try {
			const q = query(collection(db, "support_tickets", activeDetailTicketId, "messages"), orderBy("createdAt", "asc"));
			unsubscribe = onSnapshot(q, (snapshot) => {
				const list = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && data.text) list.push({
						...data,
						id: String(data.id || docSnap.id)
					});
				});
				setChatMessages(list);
				setChatLoading(false);
			}, (err) => {
				setChatLoading(false);
				handleFirestoreError(err, OperationType.LIST, `support_tickets/${activeDetailTicketId}/messages`);
			});
		} catch (e) {
			console.warn("Ticket chat listener setup notice:", e);
			setChatLoading(false);
		}
		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, [isOpen, activeDetailTicketId]);
	(0, import_react.useEffect)(() => {
		if (activeDetailTicketId && detailTab === "chat" && chatMessages.length > 0) {
			var _chatBottomRef$curren;
			(_chatBottomRef$curren = chatBottomRef.current) === null || _chatBottomRef$curren === void 0 || _chatBottomRef$curren.scrollIntoView({ behavior: "smooth" });
		}
	}, [
		activeDetailTicketId,
		detailTab,
		chatMessages.length
	]);
	const stats = (0, import_react.useMemo)(() => {
		let pending = 0;
		let reviewing = 0;
		let inProgress = 0;
		let resolved = 0;
		visibleTickets.forEach((t) => {
			if (t.status === "pending") pending++;
			else if (t.status === "reviewing") reviewing++;
			else if (t.status === "in_progress") inProgress++;
			else if (t.status === "resolved") resolved++;
		});
		return {
			total: visibleTickets.length,
			pending,
			reviewing,
			inProgress,
			resolved,
			open: pending + reviewing + inProgress
		};
	}, [visibleTickets]);
	const filteredTickets = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		const priorityRank = {
			urgent: 0,
			high: 1,
			normal: 2
		};
		const statusRank = {
			pending: 0,
			reviewing: 1,
			in_progress: 2,
			resolved: 3
		};
		return visibleTickets.filter((t) => {
			if (statusFilter !== "all" && t.status !== statusFilter) return false;
			if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
			if (!q) return true;
			return (t.customerName || "").toLowerCase().includes(q) || (t.customerPhone || "").toLowerCase().includes(q) || (t.customerCode || "").toLowerCase().includes(q) || (t.area || "").toLowerCase().includes(q) || (t.ticketNumber || "").toLowerCase().includes(q) || (t.assignedStaffName || "").toLowerCase().includes(q) || (t.createdBy || "").toLowerCase().includes(q) || (t.resolvedBy || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
		}).sort((a, b) => {
			if (statusRank[a.status] !== statusRank[b.status]) return statusRank[a.status] - statusRank[b.status];
			if (a.status !== "resolved" && priorityRank[a.priority] !== priorityRank[b.priority]) return priorityRank[a.priority] - priorityRank[b.priority];
			return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
		});
	}, [
		visibleTickets,
		searchQuery,
		statusFilter,
		categoryFilter
	]);
	if (!isOpen) return null;
	const getCategoryLabel = (cat) => {
		const found = CATEGORY_LABELS[cat];
		return found ? isBn ? found.bn : found.en : cat;
	};
	const getPriorityMeta = (p) => {
		return PRIORITY_OPTIONS.find((item) => item.id === p) || PRIORITY_OPTIONS[2];
	};
	const formatChatTime = (iso) => {
		if (!iso) return "";
		try {
			return new Date(iso).toLocaleTimeString(isBn ? "bn-BD" : "en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true
			});
		} catch {
			return "";
		}
	};
	const appendActivity = (existing, entry) => {
		return [...Array.isArray(existing) ? existing : [], entry].slice(-100);
	};
	const buildWhatsAppLink = (ticket) => {
		const cleanPhone = (ticket.customerPhone || "").replace(/[^\d]/g, "");
		const normalizedPhone = cleanPhone.startsWith("88") ? cleanPhone : cleanPhone.startsWith("0") ? `88${cleanPhone}` : cleanPhone;
		const trackingUrl = buildPublicTrackingUrl(ticket.id);
		const message = [
			`প্রত্যাশা ক্যাবল নেটওয়ার্ক - সাপোর্ট আপডেট`,
			`টিকেট নং: #${ticket.ticketNumber}`,
			`গ্রাহক: ${ticket.customerName}${ticket.customerCode ? ` (${ticket.customerCode})` : ""}`,
			`সমস্যা: ${getCategoryLabel(ticket.category)}`,
			`অবস্থা: ${getTicketStatusLabel(ticket.status, true)}`,
			ticket.createdBy ? `অভিযোগ দাখিল: ${ticket.createdBy} (${formatTicketDateTime(ticket.createdAt, true)})` : "",
			ticket.assignedStaffName ? `টেকনিশিয়ান: ${ticket.assignedStaffName}` : "",
			ticket.status === "resolved" && ticket.resolvedBy ? `সমাধানকারী: ${ticket.resolvedBy} (${formatTicketDateTime(ticket.resolvedAt, true)})` : "",
			ticket.resolutionNote ? `নোট: ${ticket.resolutionNote}` : "",
			ticket.isPublicTrackingEnabled !== false ? `লাইভ ট্র্যাকিং লিংক: ${trackingUrl}` : ""
		].filter(Boolean).join("\n");
		return normalizedPhone ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
	};
	const postTicketMessage = async (ticket, text, msgType = "message") => {
		const trimmed = text.trim();
		if (!trimmed) return;
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const senderName = activeActorName.slice(0, 150);
		const senderRole = activeActorRole;
		const msgPayload = {
			id: msgId,
			ticketId: ticket.id,
			senderId: (activeActorId || "admin").slice(0, 128),
			senderName,
			senderRole,
			text: trimmed.slice(0, 2e3),
			type: msgType,
			createdAt: nowIso
		};
		if (activeDetailTicketId === ticket.id) setChatMessages((prev) => prev.some((m) => m.id === msgId) ? prev : [...prev, msgPayload]);
		await safeSetDoc(doc(db, "support_tickets", ticket.id, "messages", msgId), msgPayload).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `support_tickets/${ticket.id}/messages/${msgId}`);
			throw err;
		});
		const nextCount = activeDetailTicketId === ticket.id ? Math.max((ticket.messageCount || 0) + 1, chatMessages.length + 1) : (ticket.messageCount || 0) + 1;
		await safeSetDoc(doc(db, "support_tickets", ticket.id), {
			messageCount: nextCount,
			lastMessageText: trimmed.slice(0, 300),
			lastMessageBy: senderName,
			lastMessageAt: nowIso,
			updatedAt: nowIso
		}, { merge: true }).catch(() => {});
	};
	const handleSendChatMessage = async (e, presetText) => {
		if (e) e.preventDefault();
		if (!activeDetailTicket || !canMutateTickets || isSendingChat) return;
		const content = (presetText ?? chatInput).trim();
		if (!content) return;
		setIsSendingChat(true);
		try {
			if (presetText === void 0) setChatInput("");
			await postTicketMessage(activeDetailTicket, content, "message");
			sounds.playTap();
		} catch (err) {
			console.error("Failed to send ticket message:", err);
			if (presetText === void 0) setChatInput(content);
		} finally {
			setIsSendingChat(false);
		}
	};
	const handleDeleteChatMessage = async (msgId) => {
		if (!activeDetailTicket || !canDeleteAnyMessage) return;
		sounds.playTap();
		setChatMessages((prev) => prev.filter((m) => m.id !== msgId));
		setConfirmDeleteMsgId(null);
		await safeDeleteDoc(doc(db, "support_tickets", activeDetailTicket.id, "messages", msgId)).catch((err) => {
			handleFirestoreError(err, OperationType.DELETE, `support_tickets/${activeDetailTicket.id}/messages/${msgId}`);
		});
		const nextCount = Math.max(0, (activeDetailTicket.messageCount || chatMessages.length) - 1);
		await safeSetDoc(doc(db, "support_tickets", activeDetailTicket.id), {
			messageCount: nextCount,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}, { merge: true }).catch(() => {});
	};
	const openTicketDetail = (ticket, tab = "chat") => {
		sounds.playTap();
		pushSubViewHistory();
		setActiveDetailTicketId(ticket.id);
		setDetailTab(tab);
		setChatInput("");
		setConfirmDeleteMsgId(null);
	};
	const handleCopyTicketLinkQuick = async (ticket) => {
		sounds.playSuccess();
		if (await copyTextSafely(buildPublicTrackingUrl(ticket.id))) {
			setCopiedTicketId(ticket.id);
			setTimeout(() => {
				setCopiedTicketId((prev) => prev === ticket.id ? null : prev);
			}, 2e3);
		}
	};
	const openStaffLoginModal = () => {
		sounds.playTap();
		pushSubViewHistory();
		setStaffLoginIdentifier("");
		setStaffLoginPin("");
		setStaffLoginError("");
		setIsStaffLoginOpen(true);
	};
	const handleStaffLoginSubmit = async (e) => {
		e.preventDefault();
		const rawId = staffLoginIdentifier.trim();
		const cleanPin = staffLoginPin.trim();
		if (!rawId || cleanPin.length < 4) {
			setStaffLoginError(isBn ? "স্টাফের মোবাইল নাম্বার/কোড এবং কমপক্ষে ৪ ডিজিটের পিন দিন" : "Enter staff phone/code and at least 4-digit PIN");
			return;
		}
		setIsVerifyingStaff(true);
		setStaffLoginError("");
		try {
			const normalizedInputPhone = normalizePhoneNumber(rawId);
			const loweredInput = rawId.toLowerCase();
			const matchedStaff = staffAccounts.find((s) => {
				if (s.isActive === false) return false;
				const sPhone = normalizePhoneNumber(s.phone);
				const sCode = (s.userCode || "").trim().toLowerCase();
				return s.id === rawId || sPhone && normalizedInputPhone && sPhone === normalizedInputPhone || sCode && sCode === loweredInput;
			});
			if (matchedStaff) {
				if (cleanPin === (staffAuthConfig.staffPins[matchedStaff.id] || staffAuthConfig.globalPin || "1234")) {
					const session = {
						staffId: matchedStaff.id,
						name: matchedStaff.name,
						phone: matchedStaff.phone || "",
						roleTitle: matchedStaff.role || (isBn ? "স্টাফ" : "Staff"),
						loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					setStaffSession(session);
					try {
						sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(session));
					} catch {}
					sounds.playSuccess();
					closeSubViewViaBack(() => setIsStaffLoginOpen(false));
					return;
				}
			}
			try {
				const matchedSubAdmin = (await getDocs(collection(db, "users"))).docs.map((d) => ({
					id: d.id,
					...d.data()
				})).find((u) => (u.role === "sub-admin" || u.role === "staff") && u.status !== "suspended" && String(u.pin || "") === cleanPin && (u.phone && String(u.phone).trim() === rawId || normalizedInputPhone.length >= 6 && normalizePhoneNumber(u.phone) === normalizedInputPhone));
				if (matchedSubAdmin) {
					const session = {
						staffId: matchedSubAdmin.id,
						name: matchedSubAdmin.name || rawId,
						phone: matchedSubAdmin.phone || rawId,
						roleTitle: matchedSubAdmin.role === "staff" ? isBn ? "স্টাফ" : "Staff" : isBn ? "সাব-অ্যাডমিন / স্টাফ" : "Sub-Admin / Staff",
						loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					setStaffSession(session);
					try {
						sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(session));
					} catch {}
					sounds.playSuccess();
					closeSubViewViaBack(() => setIsStaffLoginOpen(false));
					return;
				}
			} catch {}
			setStaffLoginError(isBn ? "স্টাফ তথ্য বা পিন সঠিক নয়। অ্যাডমিনের কাছ থেকে সঠিক স্টাফ পিন জেনে নিন।" : "Invalid staff credentials or PIN. Please contact admin.");
		} finally {
			setIsVerifyingStaff(false);
		}
	};
	const handleStaffLogout = () => {
		sounds.playTap();
		setStaffSession(null);
		setActiveDetailTicketId(null);
		try {
			sessionStorage.removeItem("protyasha_support_staff_session");
		} catch {}
	};
	const openStaffPinModal = () => {
		if (!isAdmin) return;
		sounds.playTap();
		pushSubViewHistory();
		setEditGlobalStaffPin(staffAuthConfig.globalPin || "1234");
		setEditPerStaffPins({ ...staffAuthConfig.staffPins });
		setStaffPinSavedNotice("");
		setIsStaffPinModalOpen(true);
	};
	const handleSaveStaffPinSettings = async (e) => {
		e.preventDefault();
		if (!isAdmin) return;
		const cleanGlobal = editGlobalStaffPin.trim();
		if (cleanGlobal.length < 4) {
			setStaffPinSavedNotice(isBn ? "কমপক্ষে ৪ ডিজিটের পিন দিন" : "PIN must be at least 4 digits");
			return;
		}
		setIsSavingStaffPin(true);
		try {
			const cleanedStaffPins = {};
			Object.entries(editPerStaffPins).forEach(([sid, val]) => {
				const trimmed = String(val || "").trim();
				if (trimmed.length >= 4) cleanedStaffPins[sid] = trimmed;
			});
			await safeSetDoc(doc(db, "settings", "staff_support_auth"), {
				id: "staff_support_auth",
				globalPin: cleanGlobal,
				staffPins: cleanedStaffPins,
				updatedBy: (user === null || user === void 0 ? void 0 : user.name) || "Admin",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			setStaffAuthConfig({
				globalPin: cleanGlobal,
				staffPins: cleanedStaffPins
			});
			sounds.playSuccess();
			setStaffPinSavedNotice(isBn ? "স্টাফ পিন সফলভাবে সংরক্ষিত হয়েছে!" : "Staff PIN saved successfully!");
			setTimeout(() => {
				closeSubViewViaBack(() => setIsStaffPinModalOpen(false));
			}, 650);
		} catch (err) {
			console.error("Failed to save staff PIN:", err);
			setStaffPinSavedNotice(isBn ? "সেভ করতে সমস্যা হয়েছে" : "Failed to save PIN");
		} finally {
			setIsSavingStaffPin(false);
		}
	};
	const openReportView = () => {
		sounds.playTap();
		pushSubViewHistory();
		setIsReportOpen(true);
	};
	const openNewForm = () => {
		if (!canMutateTickets) {
			sounds.playTap();
			return;
		}
		sounds.playTap();
		pushSubViewHistory();
		setEditingTicket(null);
		setCustomerName(!canViewAllTickets && (user === null || user === void 0 ? void 0 : user.name) ? user.name : "");
		setCustomerPhone(!canViewAllTickets && (user === null || user === void 0 ? void 0 : user.phone) ? user.phone : "");
		setCustomerCode("");
		setArea("");
		setCategory("line_cut");
		setPriority("normal");
		setAssignedStaffId("");
		setDescription("");
		setResolutionNote("");
		setFormError("");
		setIsFormOpen(true);
	};
	const openEditForm = (ticket) => {
		if (!canModifySupportTicket(ticket, user, staffSession, Date.now()).allowed) {
			sounds.playTap();
			return;
		}
		sounds.playTap();
		pushSubViewHistory();
		setEditingTicket(ticket);
		setCustomerName(ticket.customerName || "");
		setCustomerPhone(ticket.customerPhone || "");
		setCustomerCode(ticket.customerCode || "");
		setArea(ticket.area || "");
		setCategory(ticket.category);
		setPriority(ticket.priority);
		setAssignedStaffId(ticket.assignedStaffId || "");
		setDescription(ticket.description || "");
		setResolutionNote(ticket.resolutionNote || "");
		setFormError("");
		setIsFormOpen(true);
	};
	const handleSubmitForm = async (e) => {
		e.preventDefault();
		if (!canMutateTickets) {
			setFormError(isBn ? "সাধারণ ইউজার অভিযোগ যোগ বা পরিবর্তন করতে পারবেন না। স্টাফ পিন দিয়ে লগইন করুন।" : "Regular users cannot add or edit tickets. Please sign in with Staff PIN.");
			return;
		}
		if (editingTicket) {
			if (!canModifySupportTicket(editingTicket, user, staffSession, Date.now()).allowed) {
				setFormError(isBn ? "অভিযোগ দাখিলের ১০ মিনিট অতিক্রান্ত হয়েছে। এখন শুধুমাত্র অ্যাডমিন এটি পরিবর্তন করতে পারবেন।" : "The 10-minute edit window has expired. Only Admin can modify this ticket now.");
				return;
			}
		}
		const trimmedName = customerName.trim();
		if (!trimmedName) {
			setFormError(isBn ? "গ্রাহকের নাম লিখুন" : "Please enter customer name");
			return;
		}
		setIsSaving(true);
		setFormError("");
		try {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const matchedStaff = canChangeStatus ? staffAccounts.find((s) => s.id === assignedStaffId) : void 0;
			const nextNum = 1001 + tickets.length + Math.floor(Math.random() * 9);
			const ticketId = editingTicket ? editingTicket.id : `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
			const ticketNumber = editingTicket ? editingTicket.ticketNumber : `PCN-${nextNum}`;
			const actorName = activeActorName;
			const actorRole = activeActorRole;
			const newActivity = editingTicket ? {
				id: `act_${Date.now()}`,
				action: "edited",
				titleBn: "অভিযোগের তথ্য হালনাগাদ করা হয়েছে",
				titleEn: "Complaint details updated",
				actorName,
				actorRole,
				status: editingTicket.status,
				timestamp: nowIso
			} : {
				id: `act_${Date.now()}`,
				action: "created",
				titleBn: "১. অভিযোগ দাখিলকৃত হয়েছে",
				titleEn: "1. Complaint submitted",
				actorName,
				actorRole,
				note: description.trim().slice(0, 300) || void 0,
				status: "pending",
				timestamp: nowIso
			};
			await onSaveTicket({
				id: ticketId,
				ticketNumber,
				customerName: trimmedName.slice(0, 150),
				customerPhone: customerPhone.trim().slice(0, 32),
				customerCode: customerCode.trim().slice(0, 64),
				area: area.trim().slice(0, 150),
				category,
				priority,
				status: editingTicket ? editingTicket.status : "pending",
				assignedStaffId: canChangeStatus ? matchedStaff ? matchedStaff.id : "" : (editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.assignedStaffId) || "",
				assignedStaffName: canChangeStatus ? matchedStaff ? matchedStaff.name : "" : (editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.assignedStaffName) || "",
				description: description.trim().slice(0, 2e3),
				resolutionNote: canChangeStatus ? resolutionNote.trim().slice(0, 2e3) : (editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.resolutionNote) || "",
				createdBy: ((editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdBy) || actorName).slice(0, 128),
				createdById: ((editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdById) || activeActorId || "").slice(0, 128),
				createdByPhone: ((editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdByPhone) || activeActorPhone || "").slice(0, 32),
				createdByRole: ((editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdByRole) || actorRole).slice(0, 32),
				createdAt: (editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdAt) || nowIso,
				updatedAt: nowIso,
				isPublicTrackingEnabled: editingTicket ? editingTicket.isPublicTrackingEnabled !== false : true,
				activityHistory: appendActivity(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.activityHistory, newActivity),
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.resolvedAt) ? { resolvedAt: editingTicket.resolvedAt } : {},
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.resolvedBy) ? { resolvedBy: editingTicket.resolvedBy } : {},
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.resolvedByRole) ? { resolvedByRole: editingTicket.resolvedByRole } : {},
				...typeof (editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.messageCount) === "number" ? { messageCount: editingTicket.messageCount } : {},
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.lastMessageText) ? { lastMessageText: editingTicket.lastMessageText } : {},
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.lastMessageBy) ? { lastMessageBy: editingTicket.lastMessageBy } : {},
				...(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.lastMessageAt) ? { lastMessageAt: editingTicket.lastMessageAt } : {}
			});
			sounds.playSuccess();
			closeSubViewViaBack(() => setIsFormOpen(false));
		} catch (err) {
			console.error("Failed to save support ticket:", err);
			setFormError(isBn ? "সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Failed to save ticket.");
		} finally {
			setIsSaving(false);
		}
	};
	const handleStatusChange = async (ticket, nextStatus, noteOverride, resolverNameOverride) => {
		if (isVisitor || !canChangeStatus) return;
		sounds.playTap();
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const actorName = activeActorName.slice(0, 150);
		const actorRole = activeActorRole.slice(0, 32);
		const resolvedByFinal = nextStatus === "resolved" ? ((resolverNameOverride === null || resolverNameOverride === void 0 ? void 0 : resolverNameOverride.trim()) || actorName || ticket.assignedStaffName || "অ্যাডমিন").slice(0, 150) : null;
		const statusTitles = {
			pending: {
				bn: "১. দাখিলকৃত অবস্থায় নেওয়া হয়েছে",
				en: "1. Moved to Submitted"
			},
			reviewing: {
				bn: "২. পর্যালোচনা শুরু হয়েছে",
				en: "2. Under Review"
			},
			in_progress: {
				bn: "৩. কাজ চলমান শুরু হয়েছে",
				en: "3. Work In Progress"
			},
			resolved: {
				bn: "৪. অভিযোগ সমাধানকৃত হয়েছে",
				en: "4. Complaint Resolved"
			}
		};
		const actEntry = {
			id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
			action: nextStatus === "resolved" ? "resolved" : "status_changed",
			titleBn: statusTitles[nextStatus].bn,
			titleEn: statusTitles[nextStatus].en,
			actorName: nextStatus === "resolved" && resolvedByFinal ? resolvedByFinal : actorName,
			actorRole,
			note: nextStatus === "resolved" ? (noteOverride !== void 0 ? noteOverride.trim() : ticket.resolutionNote || "") || void 0 : void 0,
			status: nextStatus,
			timestamp: nowIso
		};
		const updated = {
			...ticket,
			status: nextStatus,
			updatedAt: nowIso,
			resolutionNote: noteOverride !== void 0 ? noteOverride.trim().slice(0, 2e3) : ticket.resolutionNote || "",
			resolvedAt: nextStatus === "resolved" ? nowIso : null,
			resolvedBy: resolvedByFinal,
			resolvedByRole: nextStatus === "resolved" ? actorRole : null,
			activityHistory: appendActivity(ticket.activityHistory, actEntry)
		};
		await onSaveTicket(updated);
		if (nextStatus === "resolved") {
			sounds.playSuccess();
			const noteSuffix = updated.resolutionNote ? ` — "${updated.resolutionNote}"` : "";
			postTicketMessage(updated, isBn ? `৪. সমাধানকৃত করেছেন: ${resolvedByFinal}${noteSuffix}` : `4. Resolved by ${resolvedByFinal}${noteSuffix}`, "system").catch(() => {});
		} else if (nextStatus === "reviewing" && ticket.status !== "reviewing") postTicketMessage(updated, isBn ? `${actorName} অভিযোগটি "২. পর্যালোচনা" ধাপে নিয়েছেন।` : `${actorName} moved ticket to 2. Reviewing.`, "system").catch(() => {});
		else if (nextStatus === "in_progress" && ticket.status !== "in_progress") postTicketMessage(updated, isBn ? `${actorName} অভিযোগটি "৩. কাজ চলমান" ধাপে নিয়েছেন।` : `${actorName} moved ticket to 3. In Progress.`, "system").catch(() => {});
		else if (nextStatus === "pending" && ticket.status !== "pending") postTicketMessage(updated, isBn ? `${actorName} অভিযোগটি "১. দাখিলকৃত" ধাপে পুনরায় চালু করেছেন।` : `${actorName} reopened ticket to 1. Submitted.`, "system").catch(() => {});
		setResolvingTicketId(null);
		setQuickResolveNote("");
		setQuickResolverName("");
	};
	const handleTogglePublicTracking = async (ticket, enabled) => {
		if (isVisitor || !canChangeStatus) return;
		await onSaveTicket({
			...ticket,
			isPublicTrackingEnabled: enabled,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	};
	const handleQuickAssign = async (ticket, staffId) => {
		if (isVisitor || !canChangeStatus) return;
		sounds.playTap();
		const staff = staffAccounts.find((s) => s.id === staffId);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const actorName = activeActorName.slice(0, 150);
		const nextStatus = staff && (ticket.status === "pending" || ticket.status === "reviewing") ? "in_progress" : ticket.status;
		const actEntry = staff ? {
			id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
			action: "assigned",
			titleBn: `টেকনিশিয়ান অ্যাসাইন: ${staff.name}`,
			titleEn: `Assigned technician: ${staff.name}`,
			actorName,
			actorRole: activeActorRole,
			status: nextStatus,
			timestamp: nowIso
		} : null;
		const updated = {
			...ticket,
			assignedStaffId: staff ? staff.id : "",
			assignedStaffName: staff ? staff.name : "",
			status: nextStatus,
			updatedAt: nowIso,
			activityHistory: actEntry ? appendActivity(ticket.activityHistory, actEntry) : ticket.activityHistory
		};
		await onSaveTicket(updated);
		if (staff) postTicketMessage(updated, isBn ? `টেকনিশিয়ান অ্যাসাইন করা হয়েছে: ${staff.name}` : `Assigned technician: ${staff.name}`, "system").catch(() => {});
	};
	const getStatusBadgeMeta = (status) => {
		if (status === "resolved") return {
			cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }),
			label: isBn ? "৪. সমাধানকৃত" : "4. Resolved"
		};
		if (status === "in_progress") return {
			cls: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3.5 h-3.5" }),
			label: isBn ? "৩. কাজ চলমান" : "3. In Progress"
		};
		if (status === "reviewing") return {
			cls: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }),
			label: isBn ? "২. পর্যালোচনা" : "2. Reviewing"
		};
		return {
			cls: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" }),
			label: isBn ? "১. দাখিলকৃত" : "1. Submitted"
		};
	};
	if (isReportOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketReportView, {
		tickets: visibleTickets,
		lang,
		actorName: activeActorName,
		isScopedToOwnOnly: !canViewAllTickets,
		onClose: () => closeSubViewViaBack(() => setIsReportOpen(false))
	});
	if (activeDetailTicket) {
		const isResolved = activeDetailTicket.status === "resolved";
		const badge = getStatusBadgeMeta(activeDetailTicket.status);
		const quickReplies = isBn ? QUICK_REPLIES_BN : QUICK_REPLIES_EN;
		const isResolvingDetail = resolvingTicketId === activeDetailTicket.id;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-60 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 py-2.5 shadow-xs space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => closeSubViewViaBack(() => setActiveDetailTicketId(null)),
								className: "w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer",
								"aria-label": "Back to tickets",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
										children: ["#", activeDetailTicket.ticketNumber]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-extrabold text-slate-900 dark:text-white truncate",
										children: activeDetailTicket.customerName
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5",
									children: [getCategoryLabel(activeDetailTicket.category), activeDetailTicket.area ? ` • ${activeDetailTicket.area}` : ""]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [activeDetailTicket.customerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:${activeDetailTicket.customerPhone.replace(/[^\d+]/g, "")}`,
								className: "w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-center",
								title: isBn ? "কল করুন" : "Call",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${badge.cls}`,
								children: [badge.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge.label })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketProgressStepper, {
						status: activeDetailTicket.status,
						lang,
						compact: true,
						interactive: canChangeStatus,
						onSelectStatus: (nextSt) => {
							if (!canChangeStatus) return;
							if (nextSt === "resolved" && activeDetailTicket.status !== "resolved") {
								setDetailTab("tracking");
								setResolvingTicketId(activeDetailTicket.id);
								setQuickResolveNote(activeDetailTicket.resolutionNote || "");
								setQuickResolverName(activeActorName || activeDetailTicket.assignedStaffName || "");
							} else if (nextSt !== activeDetailTicket.status) handleStatusChange(activeDetailTicket, nextSt);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setDetailTab("chat");
							},
							className: `h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${detailTab === "chat" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `লাইভ মেসেজ (${toBengaliNumber(chatMessages.length || activeDetailTicket.messageCount || 0)})` : `Live Chat (${chatMessages.length || activeDetailTicket.messageCount || 0})` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setDetailTab("tracking");
							},
							className: `h-9 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${detailTab === "tracking" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5 text-sky-600 dark:text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হিস্টোরি ও পাবলিক লিংক" : "History & Public Link" })]
						})]
					})
				]
			}), detailTab === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-3 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isBn ? "দাখিলকারী:" : "Filed:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-semibold",
										children: activeDetailTicket.createdBy || (isBn ? "অ্যাডমিন" : "Admin")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 shrink-0 tabular-nums",
								children: formatTicketDateTime(activeDetailTicket.createdAt, isBn)
							})]
						}), isResolved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isBn ? "সমাধানকারী:" : "Resolved:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-semibold",
										children: activeDetailTicket.resolvedBy || activeDetailTicket.assignedStaffName || (isBn ? "অ্যাডমিন" : "Admin")
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] shrink-0 tabular-nums",
								children: formatTicketDateTime(activeDetailTicket.resolvedAt || activeDetailTicket.updatedAt, isBn)
							})]
						})]
					}),
					activeDetailTicket.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[10px] font-extrabold text-amber-800 dark:text-amber-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মূল অভিযোগের বিবরণ" : "Original Complaint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTicketDateTime(activeDetailTicket.createdAt, isBn) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "leading-relaxed font-medium",
							children: activeDetailTicket.description
						})]
					}),
					chatLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-10 text-center text-xs font-bold text-slate-500 dark:text-slate-400",
						children: isBn ? "মেসেজ লোড হচ্ছে..." : "Loading live messages..."
					}) : chatMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-12 px-4 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-extrabold text-slate-700 dark:text-slate-300",
								children: isBn ? "এখনো কোনো কথোপকথন শুরু হয়নি" : "No messages yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: isBn ? "নিচে মেসেজ লিখে অ্যাডমিন, স্টাফ ও গ্রাহকের সাথে রিয়েল-টাইম কথা বলুন।" : "Send a message below for real-time updates on this ticket."
							})
						]
					}) : chatMessages.map((msg) => {
						if (msg.type === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center my-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/90 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center max-w-[92%]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: msg.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-[10px] font-normal text-slate-500 dark:text-slate-400",
									children: formatTicketDateTime(msg.createdAt, isBn)
								})]
							})
						}, msg.id);
						const currentUserKey = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.phone) || "";
						const isMine = currentUserKey && msg.senderId === currentUserKey || !currentUserKey && (user === null || user === void 0 ? void 0 : user.name) && msg.senderName === user.name;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col ${isMine ? "items-end" : "items-start"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 px-1 mb-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-extrabold text-slate-600 dark:text-slate-400",
									children: msg.senderName
								}), msg.senderRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
									children: getTicketRoleLabel(msg.senderRole, isBn)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `group relative max-w-[82%] sm:max-w-[72%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${isMine ? "bg-[#E52E2E] text-white rounded-br-sm" : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-sm"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap break-words font-medium",
										children: msg.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `mt-1 flex items-center justify-end gap-2 text-[10px] ${isMine ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatChatTime(msg.createdAt) }), canDeleteAnyMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteMsgId(confirmDeleteMsgId === msg.id ? null : msg.id),
											className: "opacity-70 hover:opacity-100 cursor-pointer",
											title: isBn ? "মুছুন" : "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
										})]
									}),
									confirmDeleteMsgId === msg.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 pt-2 border-t border-white/20 dark:border-slate-700 flex items-center justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteMsgId(null),
											className: "px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold cursor-pointer",
											children: isBn ? "না" : "No"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDeleteChatMessage(msg.id),
											className: "px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold cursor-pointer",
											children: isBn ? "মুছুন" : "Delete"
										})]
									})
								]
							})]
						}, msg.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatBottomRef })
				]
			}), canMutateTickets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 pt-2 pb-3 safe-area-bottom",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-5xl mx-auto space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar",
						children: quickReplies.map((reply) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: isSendingChat,
							onClick: () => handleSendChatMessage(void 0, reply),
							className: "px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors",
							children: reply
						}, reply))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSendChatMessage,
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: chatInput,
							onChange: (e) => setChatInput(e.target.value),
							placeholder: isBn ? "রিয়েল-টাইম মেসেজ লিখুন..." : "Type a live message...",
							className: "flex-1 h-11 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isSendingChat || !chatInput.trim(),
							className: "w-11 h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-50 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer",
							"aria-label": "Send message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4.5 h-4.5" })
						})]
					})]
				})
			}) : !isVisitor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-0 z-20 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400",
				children: isBn ? "শুধুমাত্র দেখার অনুমতি (Read-Only) — মেসেজ বা পরিবর্তন করতে অনুমোদিত স্টাফ বা অ্যাডমিন লগইন প্রয়োজন।" : "Read-only access — Staff PIN or Admin login required to send messages."
			}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-20 w-full",
				children: [
					isResolvingDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-900 space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-extrabold text-emerald-900 dark:text-emerald-200",
								children: isBn ? "৪. সমাধানকৃত নিশ্চিত করুন" : "4. Confirm Resolution"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1",
								children: isBn ? "সমাধানকারীর নাম" : "Resolved By Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: quickResolverName,
								onChange: (e) => setQuickResolverName(e.target.value),
								placeholder: isBn ? "যিনি সমাধান করেছেন তার নাম" : "Resolver name",
								className: "w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1",
								children: isBn ? "সমাধান নোট (ঐচ্ছিক)" : "Resolution Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: quickResolveNote,
								onChange: (e) => setQuickResolveNote(e.target.value),
								placeholder: isBn ? "যেমন: ফাইবার জয়েন্ট ও অনু রিস্টার্ট করা হয়েছে" : "Resolution summary",
								className: "w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setResolvingTicketId(null),
									className: "h-9 px-3.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleStatusChange(activeDetailTicket, "resolved", quickResolveNote, quickResolverName),
									className: "h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সমাধানকৃত সেভ করুন" : "Save Resolved" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicTrackingShareCard, {
						ticket: activeDetailTicket,
						lang,
						canToggleVisibility: canChangeStatus,
						onToggleVisibility: (enabled) => handleTogglePublicTracking(activeDetailTicket, enabled),
						onPreviewPublicLink: onPreviewPublicLink ? () => onPreviewPublicLink(activeDetailTicket.id) : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketActivityTimeline, {
						ticket: activeDetailTicket,
						lang
					})
				]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								onClose();
							},
							className: "w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer",
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-4.5 h-4.5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate",
								children: isBn ? "কাস্টমার কমপ্লেইন ও ট্র্যাকার" : "Customer Support Tickets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate",
								children: isBn ? `${canViewAllTickets ? "সকল অভিযোগ" : "আমার অভিযোগ"} • মোট ${toBengaliNumber(stats.total)}টি` : `${canViewAllTickets ? "All Tickets" : "My Tickets"} • ${stats.total} Total`
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: openReportView,
							className: "h-9 px-2.5 sm:px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer",
							title: isBn ? "ক্যাটাগরি রিপোর্ট (PDF ও Excel)" : "Category Report (PDF & Excel)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden xs:inline sm:inline",
								children: isBn ? "রিপোর্ট" : "Report"
							})]
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: openStaffPinModal,
							className: "w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center active:scale-95 transition-all cursor-pointer",
							title: isBn ? "স্টাফ সাপোর্ট লগইন পিন সেটিংস" : "Staff Login PIN Settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4 h-4" })
						}),
						!canViewAllTickets && !isVisitor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: openStaffLoginModal,
							className: "h-9 px-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-[11px] font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer",
							title: isBn ? "স্টাফ লগইন" : "Staff Login",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ" : "Staff" })]
						}),
						canMutateTickets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: openNewForm,
							className: "h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-rose-600/20 active:scale-95 transition-all whitespace-nowrap cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 stroke-[2.6]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন" : "New" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full",
				children: [
					isStaffActive && !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4.5 h-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-extrabold text-indigo-950 dark:text-indigo-200 truncate",
									children: isBn ? `স্টাফ অ্যাক্সেস সক্রিয়: ${activeActorName}${(matchedMainStaff === null || matchedMainStaff === void 0 ? void 0 : matchedMainStaff.role) ? ` (${matchedMainStaff.role})` : (staffSession === null || staffSession === void 0 ? void 0 : staffSession.roleTitle) ? ` (${staffSession.roleTitle})` : ""}` : `Staff Access Active: ${activeActorName}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-medium text-indigo-700 dark:text-indigo-300",
									children: isBn ? "সকল অভিযোগ দৃশ্যমান ও স্ট্যাটাস পরিবর্তনযোগ্য • ১০ মিনিট পর এডিট/ডিলিট শুধু অ্যাডমিনের নিয়ন্ত্রণে" : "All complaints visible & status updatable • Edit/Delete locked to Admin after 10 min"
								})]
							})]
						}), isManualTempStaffSession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleStaffLogout,
							className: "h-8 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ লগআউট" : "Staff Logout" })]
						})]
					}) : !canViewAllTickets && !isVisitor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-900/60 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold text-sky-950 dark:text-sky-200 leading-relaxed",
								children: isBn ? "আপনি শুধুমাত্র দেখার অনুমতিতে (Read-Only) আছেন। সাধারণ ইউজাররা কোনো টিকেট যোগ বা পরিবর্তন করতে পারবেন না।" : "You are in Read-Only mode. Regular users cannot add or modify support tickets."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: openStaffLoginModal,
							className: "h-8 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ লগইন" : "Staff Login" })]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 sm:gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setStatusFilter(statusFilter === "pending" ? "all" : "pending");
								},
								className: `text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === "pending" ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/70 dark:border-rose-900/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[10px] font-bold truncate ${statusFilter === "pending" ? "text-white/90" : "text-rose-700 dark:text-rose-300"}`,
									children: isBn ? "১. দাখিলকৃত" : "1. Filed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg sm:text-xl font-black tabular-nums mt-0.5 ${statusFilter === "pending" ? "text-white" : "text-rose-600 dark:text-rose-400"}`,
									children: isBn ? toBengaliNumber(stats.pending) : stats.pending
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setStatusFilter(statusFilter === "reviewing" ? "all" : "reviewing");
								},
								className: `text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === "reviewing" ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/70 dark:border-sky-900/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[10px] font-bold truncate ${statusFilter === "reviewing" ? "text-white/90" : "text-sky-700 dark:text-sky-300"}`,
									children: isBn ? "২. পর্যালোচনা" : "2. Review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg sm:text-xl font-black tabular-nums mt-0.5 ${statusFilter === "reviewing" ? "text-white" : "text-sky-600 dark:text-sky-400"}`,
									children: isBn ? toBengaliNumber(stats.reviewing) : stats.reviewing
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setStatusFilter(statusFilter === "in_progress" ? "all" : "in_progress");
								},
								className: `text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === "in_progress" ? "bg-amber-500 text-white border-amber-500 shadow-xs" : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-900/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[10px] font-bold truncate ${statusFilter === "in_progress" ? "text-white/90" : "text-amber-800 dark:text-amber-300"}`,
									children: isBn ? "৩. কাজ চলমান" : "3. Working"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg sm:text-xl font-black tabular-nums mt-0.5 ${statusFilter === "in_progress" ? "text-white" : "text-amber-600 dark:text-amber-400"}`,
									children: isBn ? toBengaliNumber(stats.inProgress) : stats.inProgress
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setStatusFilter(statusFilter === "resolved" ? "all" : "resolved");
								},
								className: `text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${statusFilter === "resolved" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-900/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[10px] font-bold truncate ${statusFilter === "resolved" ? "text-white/90" : "text-emerald-700 dark:text-emerald-300"}`,
									children: isBn ? "৪. সমাধানকৃত" : "4. Resolved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-lg sm:text-xl font-black tabular-nums mt-0.5 ${statusFilter === "resolved" ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`,
									children: isBn ? toBengaliNumber(stats.resolved) : stats.resolved
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										placeholder: isBn ? "নাম, ফোন, এলাকা, দাখিলকারী বা সমাধানকারী..." : "Search name, phone, area, filer, resolver...",
										className: "w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
									}),
									searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSearchQuery(""),
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: categoryFilter,
									onChange: (e) => setCategoryFilter(e.target.value),
									className: "h-11 pl-8 pr-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: isBn ? "সব ধরন" : "All Types"
									}), CATEGORY_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: isBn ? c.labelBn : c.labelEn
									}, c.id))]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar",
							children: [
								{
									id: "all",
									bn: "সব অভিযোগ",
									en: "All",
									count: stats.total
								},
								{
									id: "pending",
									bn: "১. দাখিলকৃত",
									en: "1. Filed",
									count: stats.pending
								},
								{
									id: "reviewing",
									bn: "২. পর্যালোচনা",
									en: "2. Review",
									count: stats.reviewing
								},
								{
									id: "in_progress",
									bn: "৩. কাজ চলমান",
									en: "3. Working",
									count: stats.inProgress
								},
								{
									id: "resolved",
									bn: "৪. সমাধানকৃত",
									en: "4. Resolved",
									count: stats.resolved
								}
							].map((tab) => {
								const active = statusFilter === tab.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setStatusFilter(tab.id);
									},
									className: `h-9 px-3 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer border ${active ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"}`,
									children: [
										isBn ? tab.bn : tab.en,
										" (",
										isBn ? toBengaliNumber(tab.count) : tab.count,
										")"
									]
								}, tab.id);
							})
						})]
					}),
					filteredTickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-14 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-extrabold text-slate-800 dark:text-slate-200",
								children: isBn ? "কোনো কমপ্লেইন টিকেট পাওয়া যায়নি" : "No support tickets found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
								children: isBn ? "নতুন গ্রাহক কমপ্লেইন যোগ করতে উপরের \"নতুন টিকেট\" বাটনে ট্যাপ করুন।" : "Tap \"New Ticket\" above to log a customer complaint."
							}),
							canMutateTickets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: openNewForm,
								className: "mt-4 h-10 px-4 rounded-xl bg-[#E52E2E] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রথম টিকেট যোগ করুন" : "Create First Ticket" })]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start",
						children: filteredTickets.map((ticket) => {
							const priorityMeta = getPriorityMeta(ticket.priority);
							const isResolved = ticket.status === "resolved";
							const isWorking = ticket.status === "in_progress";
							const isReviewing = ticket.status === "reviewing";
							const isResolvingThis = resolvingTicketId === ticket.id;
							const isConfirmingDelete = confirmDeleteId === ticket.id;
							const msgCount = ticket.messageCount || 0;
							const badge = getStatusBadgeMeta(ticket.status);
							const modCheck = canModifySupportTicket(ticket, user, staffSession, nowTick);
							const leftBorderColor = isResolved ? "border-l-emerald-500" : isWorking ? "border-l-amber-500" : isReviewing ? "border-l-sky-500" : ticket.priority === "urgent" ? "border-l-rose-600" : "border-l-rose-400";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-l-4 ${leftBorderColor} p-3.5 sm:p-4 shadow-xs space-y-3`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center flex-wrap gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[11px] font-mono font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md",
														children: ["#", ticket.ticketNumber]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityMeta.badgeClass}`,
														children: isBn ? priorityMeta.labelBn : priorityMeta.labelEn
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60",
														children: getCategoryLabel(ticket.category)
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug",
												children: [ticket.customerName, ticket.customerCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ml-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400",
													children: [
														"(",
														ticket.customerCode,
														")"
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${badge.cls}`,
											children: [badge.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge.label })]
										})]
									}),
									!isAdmin && !isVisitor && (modCheck.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-2 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "এডিট ও ডিলিট সময় বাকি:" : "Edit & delete time left:" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-black px-2 py-0.5 rounded-md bg-amber-500 text-white tabular-nums",
											children: formatRemainingCountdown(modCheck.remainingMs, isBn)
										})]
									}) : modCheck.isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-2.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3 shrink-0 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "১০ মিনিট অতিক্রান্ত — এখন শুধু অ্যাডমিন এডিট/ডিলিট নিয়ন্ত্রণ করতে পারবেন" : "10-minute window expired — Only Admin can edit or delete now" })]
									}) : null),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-1 pb-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketProgressStepper, {
											status: ticket.status,
											lang,
											compact: true,
											interactive: canChangeStatus,
											onSelectStatus: (nextSt) => {
												if (!canChangeStatus) return;
												if (nextSt === "resolved" && ticket.status !== "resolved") {
													setResolvingTicketId(ticket.id);
													setQuickResolveNote(ticket.resolutionNote || "");
													setQuickResolverName(activeActorName || ticket.assignedStaffName || "");
												} else if (nextSt !== ticket.status) handleStatusChange(ticket, nextSt);
											}
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-2.5 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-x-3 gap-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-500 dark:text-slate-400 font-semibold",
														children: isBn ? "অভিযোগ দাখিল:" : "Filed by:"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-extrabold",
														children: ticket.createdBy || (isBn ? "অ্যাডমিন" : "Admin")
													}),
													ticket.createdByRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
														children: [
															"(",
															getTicketRoleLabel(ticket.createdByRole, isBn),
															")"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold tabular-nums",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 shrink-0" }), formatTicketDateTime(ticket.createdAt, isBn)]
											})]
										}), isResolved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-1.5 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-x-3 gap-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: isBn ? "সমাধানকারী:" : "Resolved by:"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-extrabold",
														children: ticket.resolvedBy || ticket.assignedStaffName || (isBn ? "অ্যাডমিন" : "Admin")
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-emerald-700/90 dark:text-emerald-400 font-semibold tabular-nums",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 shrink-0" }), formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn)]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 text-xs text-slate-600 dark:text-slate-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-x-4 gap-y-1",
												children: [ticket.customerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 font-semibold tabular-nums",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-slate-400" }), ticket.customerPhone]
												}), ticket.area && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }), ticket.area]
												})]
											}),
											ticket.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed",
												children: ticket.description
											}),
											ticket.resolutionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 px-3 py-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/50 flex items-start gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isBn ? "সমাধান নোট: " : "Resolution: " }), ticket.resolutionNote] })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => openTicketDetail(ticket, "chat"),
											className: "p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/35 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center gap-2 text-left transition-colors cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] sm:text-xs font-extrabold text-indigo-900 dark:text-indigo-200 truncate",
														children: isBn ? "লাইভ মেসেজ" : "Live Chat"
													}), msgCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-600 text-white tabular-nums",
														children: isBn ? toBengaliNumber(msgCount) : msgCount
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-indigo-700/85 dark:text-indigo-300/80 truncate",
													children: ticket.lastMessageText ? `${ticket.lastMessageBy || ""}: ${ticket.lastMessageText}` : isBn ? "রিয়েল-টাইম চ্যাট" : "Start chat"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => openTicketDetail(ticket, "tracking"),
											className: "p-2.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/35 hover:bg-sky-100/80 dark:hover:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 flex items-center gap-2 text-left transition-colors cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[11px] sm:text-xs font-extrabold text-sky-950 dark:text-sky-200 truncate",
													children: isBn ? "হিস্টোরি ও লিংক" : "History & Link"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-sky-700/90 dark:text-sky-300/80 truncate",
													children: ticket.isPublicTrackingEnabled !== false ? isBn ? "পাবলিক লিংক চালু" : "Public link active" : isBn ? "অ্যাক্টিভিটি হিস্টোরি" : "Activity log"
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }), canChangeStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: ticket.assignedStaffId || "",
												onChange: (e) => handleQuickAssign(ticket, e.target.value),
												className: "h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 max-w-[180px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: isBn ? "টেকনিশিয়ান অ্যাসাইন..." : "Assign technician..."
												}), staffAccounts.filter(isActualStaffAccount).map((staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: staff.id,
													children: [
														staff.name,
														" (",
														staff.role,
														")"
													]
												}, staff.id))]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-700 dark:text-slate-300 truncate",
												children: ticket.assignedStaffName || (isBn ? "অ্যাসাইন করা হয়নি" : "Unassigned")
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleCopyTicketLinkQuick(ticket),
													className: `h-8 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition-colors cursor-pointer ${copiedTicketId === ticket.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/60"}`,
													title: isBn ? "পাবলিক ট্র্যাকিং লিংক কপি" : "Copy public link",
													children: [copiedTicketId === ticket.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copiedTicketId === ticket.id ? isBn ? "কপি!" : "Copied" : isBn ? "লিংক" : "Link" })]
												}),
												ticket.customerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: `tel:${ticket.customerPhone.replace(/[^\d+]/g, "")}`,
													className: "h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors",
													title: isBn ? "কল করুন" : "Call",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কল" : "Call" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: buildWhatsAppLink(ticket),
													target: "_blank",
													rel: "noopener noreferrer",
													className: "h-8 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 text-[11px] font-bold inline-flex items-center gap-1 transition-colors",
													title: "WhatsApp",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WA" })]
												}),
												modCheck.allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => openEditForm(ticket),
													className: "w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer",
													title: isBn ? "এডিট" : "Edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
												}),
												modCheck.allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														sounds.playTap();
														setConfirmDeleteId(isConfirmingDelete ? null : ticket.id);
													},
													className: "w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer",
													title: isBn ? "মুছুন" : "Delete",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})
											]
										})]
									}),
									isConfirmingDelete && modCheck.allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-rose-700 dark:text-rose-300",
											children: isBn ? "টিকেটটি স্থায়ীভাবে মুছে ফেলবেন?" : "Delete this ticket permanently?"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmDeleteId(null),
												className: "h-8 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer",
												children: isBn ? "না" : "Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: async () => {
													if (!canModifySupportTicket(ticket, user, staffSession, Date.now()).allowed) {
														setConfirmDeleteId(null);
														return;
													}
													await onDeleteTicket(ticket.id);
													setConfirmDeleteId(null);
												},
												className: "h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer",
												children: isBn ? "হ্যাঁ, মুছুন" : "Delete"
											})]
										})]
									}),
									isResolvingThis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1",
													children: isBn ? "সমাধানকারীর নাম" : "Resolved By Name"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: quickResolverName,
													onChange: (e) => setQuickResolverName(e.target.value),
													placeholder: isBn ? "যিনি সমাধান করেছেন তার নাম" : "Resolver name",
													className: "w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
												}),
												ticket.assignedStaffName && ticket.assignedStaffName !== quickResolverName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQuickResolverName(ticket.assignedStaffName || ""),
													className: "mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer",
													children: isBn ? `টেকনিশিয়ান "${ticket.assignedStaffName}" সেট করুন` : `Set technician "${ticket.assignedStaffName}"`
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1",
												children: isBn ? "সমাধান নোট (ঐচ্ছিক)" : "Resolution Note (Optional)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: quickResolveNote,
												onChange: (e) => setQuickResolveNote(e.target.value),
												placeholder: isBn ? "যেমন: ফাইবার জয়েন্ট ও অনু রিস্টার্ট করা হয়েছে" : "e.g. Fiber spliced & ONU restarted",
												className: "w-full h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs text-slate-900 dark:text-white focus:outline-none"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setResolvingTicketId(null);
														setQuickResolveNote("");
														setQuickResolverName("");
													},
													className: "h-8 px-3 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer",
													children: isBn ? "বাতিল" : "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleStatusChange(ticket, "resolved", quickResolveNote, quickResolverName),
													className: "h-8 px-3.5 rounded-lg bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "৪. সমাধানকৃত নিশ্চিত" : "Confirm Resolved" })]
												})]
											})
										]
									}),
									canChangeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-1.5 pt-0.5",
										children: TICKET_STAGES.map((st) => {
											const isActive = ticket.status === st.id;
											const activeCls = st.id === "resolved" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : st.id === "in_progress" ? "bg-amber-500 text-white border-amber-500 shadow-xs" : st.id === "reviewing" ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-rose-600 text-white border-rose-600 shadow-xs";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													if (st.id === "resolved") {
														if (ticket.status === "resolved") return;
														sounds.playTap();
														setResolvingTicketId(ticket.id);
														setQuickResolveNote(ticket.resolutionNote || "");
														setQuickResolverName(activeActorName || ticket.assignedStaffName || "");
													} else handleStatusChange(ticket, st.id);
												},
												className: `h-9 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all whitespace-nowrap cursor-pointer ${isActive ? activeCls : "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
												children: isBn ? st.shortBn : st.shortEn
											}, st.id);
										})
									})
								]
							}, ticket.id);
						})
					})
				]
			}),
			isFormOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold text-slate-900 dark:text-white",
							children: editingTicket ? isBn ? `টিকেট এডিট (#${editingTicket.ticketNumber})` : `Edit Ticket (#${editingTicket.ticketNumber})` : isBn ? "নতুন কমপ্লেইন টিকেট" : "New Complaint Ticket"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400",
							children: isBn ? `অভিযোগ দাখিলকারী: ${(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdBy) || (user === null || user === void 0 ? void 0 : user.name) || "অ্যাডমিন"}` : `Filed by: ${(editingTicket === null || editingTicket === void 0 ? void 0 : editingTicket.createdBy) || (user === null || user === void 0 ? void 0 : user.name) || "Admin"}`
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsFormOpen(false)),
							className: "w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4.5 h-4.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmitForm,
						className: "p-5 overflow-y-auto space-y-3.5",
						children: [
							formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300",
								children: formError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "গ্রাহকের নাম *" : "Customer Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: customerName,
									onChange: (e) => setCustomerName(e.target.value),
									placeholder: isBn ? "যেমন: মোঃ রফিকুল ইসলাম" : "Customer full name",
									className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "মোবাইল নাম্বার" : "Mobile Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									value: customerPhone,
									onChange: (e) => setCustomerPhone(e.target.value),
									placeholder: "01XXXXXXXXX",
									className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "গ্রাহক কোড / আইডি" : "Customer ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: customerCode,
									onChange: (e) => setCustomerCode(e.target.value),
									placeholder: isBn ? "যেমন: pcn104" : "e.g. pcn104",
									className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "এলাকা / ঠিকানা" : "Area / Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: area,
									onChange: (e) => setArea(e.target.value),
									placeholder: isBn ? "যেমন: বাজার রোড" : "Area name",
									className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "সমস্যার ধরন" : "Issue Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: category,
									onChange: (e) => setCategory(e.target.value),
									className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30",
									children: CATEGORY_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: isBn ? c.labelBn : c.labelEn
									}, c.id))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "অগ্রাধিকার (Priority)" : "Priority"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-1.5",
									children: PRIORITY_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPriority(opt.id),
										className: `h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${priority === opt.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`,
										children: isBn ? opt.labelBn : opt.labelEn
									}, opt.id))
								})] })]
							}),
							canChangeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "দায়িত্বপ্রাপ্ত টেকনিশিয়ান / স্টাফ" : "Assign Technician / Staff"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: assignedStaffId,
								onChange: (e) => setAssignedStaffId(e.target.value),
								className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: isBn ? "এখন অ্যাসাইন নয় (পরে ঠিক করবো)" : "Unassigned"
								}), staffAccounts.filter(isActualStaffAccount).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.id,
									children: [
										s.name,
										" — ",
										s.role
									]
								}, s.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "সমস্যার বিস্তারিত বিবরণ" : "Issue Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: isBn ? "যেমন: সকাল থেকে লাল বাতি জ্বলছে, ফাইবার ক্যাবল ছিঁড়ে গেছে..." : "Describe the issue...",
								className: "w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
							})] }),
							editingTicket && canChangeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "সমাধান নোট" : "Resolution Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: resolutionNote,
								onChange: (e) => setResolutionNote(e.target.value),
								placeholder: isBn ? "কিভাবে সমাধান করা হয়েছে..." : "How was it resolved...",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
							})] }),
							!isAdmin && !editingTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অভিযোগ দাখিলের ১০ মিনিটের মধ্যে এডিট/ডিলিট করতে পারবেন — এরপর শুধু অ্যাডমিন নিয়ন্ত্রণ করবেন।" : "You can edit/delete within 10 minutes of submission — after that only Admin controls it." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => closeSubViewViaBack(() => setIsFormOpen(false)),
									className: "flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSaving,
									className: "flex-2 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer",
									children: isSaving ? isBn ? "সেভ হচ্ছে..." : "Saving..." : editingTicket ? isBn ? "আপডেট করুন" : "Update Ticket" : isBn ? "টিকেট সেভ করুন" : "Save Ticket"
								})]
							})
						]
					})]
				})
			}),
			isStaffLoginOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4.5 h-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white",
								children: isBn ? "নির্দিষ্ট স্টাফ লগইন" : "Dedicated Staff Login"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: isBn ? "সকল অভিযোগ দেখতে ও স্ট্যাটাস পরিবর্তন করতে লগইন করুন" : "Log in to view all complaints & update status"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsStaffLoginOpen(false)),
							className: "w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4.5 h-4.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleStaffLoginSubmit,
						className: "p-5 space-y-3.5",
						children: [
							staffLoginError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300",
								children: staffLoginError
							}),
							staffAccounts.filter(isActualStaffAccount).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "স্টাফ তালিকা থেকে নির্বাচন (ঐচ্ছিক)" : "Select Staff (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: ((_staffAccounts$filter = staffAccounts.filter(isActualStaffAccount).find((s) => s.phone === staffLoginIdentifier || s.id === staffLoginIdentifier || s.userCode && s.userCode === staffLoginIdentifier)) === null || _staffAccounts$filter === void 0 ? void 0 : _staffAccounts$filter.id) || "",
								onChange: (e) => {
									const picked = staffAccounts.find((s) => s.id === e.target.value);
									if (picked) setStaffLoginIdentifier(picked.phone || picked.userCode || picked.id);
								},
								className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: isBn ? "স্টাফ বেছে নিন..." : "Choose staff member..."
								}), staffAccounts.filter(isActualStaffAccount).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s.id,
									children: [
										s.name,
										" — ",
										s.role,
										" (",
										s.phone || s.userCode || s.id,
										")"
									]
								}, s.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "স্টাফ মোবাইল নাম্বার বা স্টাফ কোড *" : "Staff Mobile Number or Code *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: staffLoginIdentifier,
								onChange: (e) => setStaffLoginIdentifier(e.target.value),
								placeholder: isBn ? "যেমন: 017XXXXXXXX বা STF-01" : "e.g. 017XXXXXXXX",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "স্টাফ সাপোর্ট পিন *" : "Staff Support PIN *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								inputMode: "numeric",
								value: staffLoginPin,
								onChange: (e) => setStaffLoginPin(e.target.value),
								placeholder: isBn ? "আপনার ৪+ ডিজিটের পিন দিন" : "Enter 4+ digit PIN",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-1 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => closeSubViewViaBack(() => setIsStaffLoginOpen(false)),
									className: "flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isVerifyingStaff,
									className: "flex-2 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md active:scale-98 transition-all cursor-pointer",
									children: isVerifyingStaff ? isBn ? "যাচাই হচ্ছে..." : "Verifying..." : isBn ? "স্টাফ লগইন করুন" : "Login as Staff"
								})]
							})
						]
					})]
				})
			}),
			isAdmin && isStaffPinModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-70 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white",
							children: isBn ? "স্টাফ সাপোর্ট লগইন পিন সেটিংস" : "Staff Support Login PIN Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400",
							children: isBn ? "স্টাফদের অভিযোগ প্যানেলে লগইনের পিন নির্ধারণ করুন" : "Configure PINs for staff complaint panel login"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsStaffPinModalOpen(false)),
							className: "w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4.5 h-4.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveStaffPinSettings,
						className: "p-5 overflow-y-auto space-y-4",
						children: [
							staffPinSavedNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300",
								children: staffPinSavedNotice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "সাধারণ স্টাফ লগইন পিন (ডিফল্ট)" : "Default Staff Login PIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: editGlobalStaffPin,
								onChange: (e) => setEditGlobalStaffPin(e.target.value),
								placeholder: "1234",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
							})] }),
							staffAccounts.filter(isActualStaffAccount).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-extrabold text-slate-700 dark:text-slate-300",
									children: isBn ? "আলাদা স্টাফের ব্যক্তিগত পিন (ঐচ্ছিক)" : "Per-Staff Custom PIN (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 max-h-52 overflow-y-auto pr-1",
									children: staffAccounts.filter(isActualStaffAccount).map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-extrabold text-slate-900 dark:text-white truncate",
												children: st.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 truncate",
												children: st.phone || st.userCode || st.role
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: editPerStaffPins[st.id] || "",
											onChange: (e) => setEditPerStaffPins((prev) => ({
												...prev,
												[st.id]: e.target.value
											})),
											placeholder: editGlobalStaffPin || "1234",
											className: "w-24 h-9 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:outline-none"
										})]
									}, st.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => closeSubViewViaBack(() => setIsStaffPinModalOpen(false)),
									className: "flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSavingStaffPin,
									className: "flex-2 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md cursor-pointer",
									children: isSavingStaffPin ? isBn ? "সেভ হচ্ছে..." : "Saving..." : isBn ? "পিন সংরক্ষণ করুন" : "Save PIN Settings"
								})]
							})
						]
					})]
				})
			})
		]
	});
};
//#endregion
export { SupportTicketModal };
