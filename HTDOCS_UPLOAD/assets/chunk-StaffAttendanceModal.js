import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, En as require_react, Ft as EyeOff, J as Plus, K as Printer, M as ShieldCheck, Nt as FileCheck2, Pt as Eye, Sn as ArrowLeft, V as RotateCcw, Y as Phone, Yt as Clock, _t as KeyRound, d as Users, dn as CalendarOff, dt as Lock, en as ChevronRight, in as CheckCheck, jt as FileSpreadsheet, lt as LogOut, m as UserCheck, n as X, rt as MessageSquare, s as Wallet, tn as ChevronLeft, un as Calendar, x as Trash2, zt as Download } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, l as onSnapshot, y as doc } from "./chunk-vendor-firebase.js";
import { i as toBengaliNumber } from "./chunk-formatters.js";
import { F as normalizePhoneNumber, c as findMatchedStaffForUser, f as syncStaffPinEverywhere, g as isActualStaffAccount, it as db, st as safeSetDoc, tt as sounds } from "./app.js";
//#region src/components/StaffAttendanceDetailView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MONTHS_BN$2 = [
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
var MONTHS_EN$2 = [
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
var WEEKDAYS_SHORT_BN = [
	"রবি",
	"সোম",
	"মঙ্গল",
	"বুধ",
	"বৃহঃ",
	"শুক্র",
	"শনি"
];
var WEEKDAYS_SHORT_EN = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var WEEKDAYS_FULL_BN$1 = [
	"রবিবার",
	"সোমবার",
	"মঙ্গলবার",
	"বুধবার",
	"বৃহস্পতিবার",
	"শুক্রবার",
	"শনিবার"
];
var WEEKDAYS_FULL_EN$1 = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var STATUS_STYLE = {
	present: {
		bn: "উপস্থিত",
		en: "Present",
		shortBn: "উ",
		shortEn: "P",
		badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
		cellClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/90 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200",
		dotClass: "bg-emerald-500",
		pdfBg: "#dcfce7",
		pdfColor: "#166534"
	},
	late: {
		bn: "লেট",
		en: "Late",
		shortBn: "লে",
		shortEn: "L",
		badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
		cellClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/90 dark:border-amber-800/70 text-amber-800 dark:text-amber-200",
		dotClass: "bg-amber-500",
		pdfBg: "#fef3c7",
		pdfColor: "#92400e"
	},
	half_day: {
		bn: "অর্ধ-দিন",
		en: "Half Day",
		shortBn: "অ",
		shortEn: "H",
		badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800",
		cellClass: "bg-sky-50 dark:bg-sky-950/40 border-sky-200/90 dark:border-sky-800/70 text-sky-800 dark:text-sky-200",
		dotClass: "bg-sky-500",
		pdfBg: "#e0f2fe",
		pdfColor: "#075985"
	},
	leave: {
		bn: "ছুটি",
		en: "Leave",
		shortBn: "ছু",
		shortEn: "LV",
		badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
		cellClass: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/90 dark:border-indigo-800/70 text-indigo-800 dark:text-indigo-200",
		dotClass: "bg-indigo-500",
		pdfBg: "#e0e7ff",
		pdfColor: "#3730a3"
	},
	absent: {
		bn: "অনুপস্থিত",
		en: "Absent",
		shortBn: "অনু",
		shortEn: "A",
		badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
		cellClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800/70 text-rose-800 dark:text-rose-200",
		dotClass: "bg-rose-500",
		pdfBg: "#ffe4e6",
		pdfColor: "#9f1239"
	}
};
var LEAVE_LABELS$1 = {
	casual: {
		bn: "নৈমিত্তিক ছুটি",
		en: "Casual Leave"
	},
	sick: {
		bn: "অসুস্থতার ছুটি",
		en: "Sick Leave"
	},
	emergency: {
		bn: "জরুরি ছুটি",
		en: "Emergency Leave"
	},
	unpaid: {
		bn: "বিনা বেতনে ছুটি",
		en: "Unpaid Leave"
	}
};
var escapeHtml$1 = (value) => {
	return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var printHtmlViaIframe$1 = (htmlContent) => {
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
	}, 400);
};
var StaffAttendanceDetailView = ({ staff, attendanceRecords, lang, selectedMonthIdx, selectedYear, todayIso, isOwnProfile, canViewSalary, canDeleteDate, onChangeMonth, onDeleteAttendance, onOpenPrintPreview, onClose }) => {
	var _selectedDayInfo$reco, _selectedDayInfo$reco2, _selectedDayInfo$reco3, _selectedDayInfo$reco4;
	const isBn = lang === "bn";
	const now = /* @__PURE__ */ new Date();
	const currentMonthIdx = now.getMonth();
	const currentYear = now.getFullYear();
	const [selectedDayIso, setSelectedDayIso] = (0, import_react.useState)(null);
	const [logFilter, setLogFilter] = (0, import_react.useState)("marked");
	const [confirmDeleteRecordId, setConfirmDeleteRecordId] = (0, import_react.useState)(null);
	const [isDeletingId, setIsDeletingId] = (0, import_react.useState)(null);
	const formatNum = (n) => isBn ? toBengaliNumber(n) : String(n);
	const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, "0")}`;
	const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
	const firstWeekday = new Date(selectedYear, selectedMonthIdx, 1).getDay();
	const availableYears = (0, import_react.useMemo)(() => {
		const yrs = /* @__PURE__ */ new Set([
			currentYear - 1,
			currentYear,
			currentYear + 1
		]);
		attendanceRecords.forEach((r) => {
			if (r.staffId === staff.id && r.date) {
				const y = Number(r.date.slice(0, 4));
				if (y >= 2020 && y <= 2099) yrs.add(y);
			}
		});
		return Array.from(yrs).sort((a, b) => b - a);
	}, [
		attendanceRecords,
		staff.id,
		currentYear
	]);
	const monthRecordMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		attendanceRecords.forEach((rec) => {
			if (rec.staffId === staff.id && rec.month === selectedMonthKey) map.set(rec.date, rec);
		});
		return map;
	}, [
		attendanceRecords,
		staff.id,
		selectedMonthKey
	]);
	const allMonthDays = (0, import_react.useMemo)(() => {
		const rows = [];
		for (let day = 1; day <= daysInMonth; day++) {
			const dateIso = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
	}, [
		daysInMonth,
		selectedYear,
		selectedMonthIdx,
		monthRecordMap,
		todayIso
	]);
	const stats = (0, import_react.useMemo)(() => {
		let present = 0;
		let late = 0;
		let halfDay = 0;
		let paidLeave = 0;
		let unpaidLeave = 0;
		let absent = 0;
		monthRecordMap.forEach((r) => {
			if (r.status === "present") present++;
			else if (r.status === "late") late++;
			else if (r.status === "half_day") halfDay++;
			else if (r.status === "absent") absent++;
			else if (r.status === "leave") {
				if (r.leaveType === "unpaid") unpaidLeave++;
				else paidLeave++;
			}
		});
		const totalLeave = paidLeave + unpaidLeave;
		const markedDays = present + late + halfDay + totalLeave + absent;
		const unmarkedDays = Math.max(0, daysInMonth - markedDays);
		const effectivePresent = present + late + halfDay * .5;
		const attendanceRate = markedDays > 0 ? Math.round(effectivePresent / markedDays * 100) : 0;
		const baseSalary = Number(staff.baseSalary) || 0;
		const dailyRate = baseSalary > 0 ? baseSalary / daysInMonth : 0;
		const deductibleDays = absent + unpaidLeave + halfDay * .5;
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
	}, [
		monthRecordMap,
		daysInMonth,
		staff.baseSalary
	]);
	const filteredDayRows = (0, import_react.useMemo)(() => {
		return allMonthDays.filter((item) => {
			if (logFilter === "all") return true;
			if (!item.record) return false;
			if (logFilter === "marked") return true;
			if (logFilter === "present") return item.record.status === "present" || item.record.status === "late" || item.record.status === "half_day";
			if (logFilter === "leave") return item.record.status === "leave";
			if (logFilter === "absent") return item.record.status === "absent";
			return true;
		});
	}, [allMonthDays, logFilter]);
	const getLeaveLabel = (lt) => {
		if (!lt || lt === "none") return "";
		const item = LEAVE_LABELS$1[lt];
		return item ? isBn ? item.bn : item.en : "";
	};
	const handlePrevMonth = () => {
		sounds.playTap();
		setSelectedDayIso(null);
		if (selectedMonthIdx === 0) onChangeMonth(11, selectedYear - 1);
		else onChangeMonth(selectedMonthIdx - 1, selectedYear);
	};
	const handleNextMonth = () => {
		sounds.playTap();
		setSelectedDayIso(null);
		if (selectedMonthIdx === 11) onChangeMonth(0, selectedYear + 1);
		else onChangeMonth(selectedMonthIdx + 1, selectedYear);
	};
	const handleDeleteRecord = async (recordId) => {
		setIsDeletingId(recordId);
		try {
			await onDeleteAttendance(recordId);
			sounds.playSuccess();
			setConfirmDeleteRecordId(null);
		} finally {
			setIsDeletingId(null);
		}
	};
	const handleDownloadIndividualPdf = () => {
		sounds.playSuccess();
		const monthTitleBn = `${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
		const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString("bn-BD", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
		const tableRowsHtml = allMonthDays.map((item) => {
			var _LEAVE_LABELS$rec$lea;
			const rec = item.record;
			const stMeta = rec ? STATUS_STYLE[rec.status] : null;
			const leaveText = (rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && rec.leaveType && rec.leaveType !== "none" ? ((_LEAVE_LABELS$rec$lea = LEAVE_LABELS$1[rec.leaveType]) === null || _LEAVE_LABELS$rec$lea === void 0 ? void 0 : _LEAVE_LABELS$rec$lea.bn) || "ছুটি" : "-";
			const dateDisplay = `${toBengaliNumber(item.day)} ${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
			const statusCellHtml = stMeta ? `<span class="badge" style="background:${stMeta.pdfBg};color:${stMeta.pdfColor};">${escapeHtml$1(stMeta.bn)}</span>` : `<span style="color:#94a3b8;font-size:11px;">অচিহ্নিত</span>`;
			return `
          <tr>
            <td style="text-align:center;font-weight:700;">${toBengaliNumber(item.day)}</td>
            <td style="text-align:left;">${escapeHtml$1(dateDisplay)}</td>
            <td style="text-align:center;">${escapeHtml$1(WEEKDAYS_FULL_BN$1[item.weekdayIdx])}</td>
            <td style="text-align:center;">${statusCellHtml}</td>
            <td style="text-align:center;">${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.checkInTime) || "-")}</td>
            <td style="text-align:center;">${escapeHtml$1(leaveText)}</td>
            <td style="text-align:left;">${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.note) || "-")}</td>
            <td style="text-align:center;font-size:11px;color:#475569;">${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.recordedBy) || "-")}</td>
          </tr>`;
		}).join("");
		const salarySectionHtml = canViewSalary && stats.baseSalary > 0 ? `
        <div class="salary-box">
          <div><span>মূল মাসিক বেতন:</span> <strong>৳${toBengaliNumber(stats.baseSalary)}</strong></div>
          <div><span>অনুপস্থিতি/ছুটি কর্তন:</span> <strong style="color:#dc2626;">-৳${toBengaliNumber(stats.deduction)}</strong></div>
          <div><span>সম্ভাব্য প্রদেয় বেতন:</span> <strong style="color:#059669;font-size:15px;">৳${toBengaliNumber(stats.estimatedPayable)}</strong></div>
        </div>` : "";
		printHtmlViaIframe$1(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>মাসিক স্টাফ হাজিরা রিপোর্ট - ${escapeHtml$1(staff.name)} - ${escapeHtml$1(monthTitleBn)}</title>
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
          <p>ব্যক্তিগত মাসিক স্টাফ হাজিরা ও ছুটি রিপোর্ট — ${escapeHtml$1(monthTitleBn)}</p>
        </div>

        <div class="meta-card">
          <div class="meta-col">
            <div><span class="meta-label">স্টাফের নাম:</span> <span class="meta-val">${escapeHtml$1(staff.name)}</span></div>
            <div><span class="meta-label">পদবী:</span> <span class="meta-val">${escapeHtml$1(staff.role || "স্টাফ")}</span></div>
            <div><span class="meta-label">মোবাইল:</span> <span class="meta-val">${escapeHtml$1(staff.phone || "-")}</span></div>
          </div>
          <div class="meta-col" style="text-align:right;">
            <div><span class="meta-label">রিপোর্ট মাস:</span> <span class="meta-val">${escapeHtml$1(monthTitleBn)}</span></div>
            ${staff.userCode ? `<div><span class="meta-label">স্টাফ কোড:</span> <span class="meta-val">${escapeHtml$1(staff.userCode)}</span></div>` : ""}
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
          <div>তৈরির সময়: ${escapeHtml$1(generatedAt)}</div>
          <div class="sig-line">স্টাফের স্বাক্ষর</div>
          <div class="sig-line">কর্তৃপক্ষের স্বাক্ষর</div>
        </div>
      </body>
      </html>`);
	};
	const handleDownloadIndividualExcel = () => {
		sounds.playSuccess();
		const monthTitleBn = `${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
		const rowsHtml = allMonthDays.map((item) => {
			var _LEAVE_LABELS$rec$lea2;
			const rec = item.record;
			const stBn = rec ? STATUS_STYLE[rec.status].bn : "অচিহ্নিত";
			const leaveText = (rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && rec.leaveType && rec.leaveType !== "none" ? ((_LEAVE_LABELS$rec$lea2 = LEAVE_LABELS$1[rec.leaveType]) === null || _LEAVE_LABELS$rec$lea2 === void 0 ? void 0 : _LEAVE_LABELS$rec$lea2.bn) || "ছুটি" : "-";
			return `
          <tr>
            <td>${escapeHtml$1(item.dateIso)}</td>
            <td>${escapeHtml$1(WEEKDAYS_FULL_BN$1[item.weekdayIdx])}</td>
            <td>${escapeHtml$1(stBn)}</td>
            <td>${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.checkInTime) || "-")}</td>
            <td>${escapeHtml$1(leaveText)}</td>
            <td>${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.note) || "-")}</td>
            <td>${escapeHtml$1((rec === null || rec === void 0 ? void 0 : rec.recordedBy) || "-")}</td>
          </tr>`;
		}).join("");
		const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <tr><th colspan="7" style="font-size:16px;font-weight:bold;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — ব্যক্তিগত স্টাফ হাজিরা রিপোর্ট (${escapeHtml$1(monthTitleBn)})</th></tr>
          <tr><td colspan="7"><b>স্টাফ:</b> ${escapeHtml$1(staff.name)} (${escapeHtml$1(staff.role || "স্টাফ")}) | <b>মোবাইল:</b> ${escapeHtml$1(staff.phone || "-")} | <b>উপস্থিতি হার:</b> ${stats.attendanceRate}%</td></tr>
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
		const blob = new Blob(["﻿" + excelHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `attendance_${(staff.name || "staff").replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, "_")}_${MONTHS_EN$2[selectedMonthIdx]}_${selectedYear}.xls`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const selectedDayInfo = (0, import_react.useMemo)(() => {
		if (!selectedDayIso) return null;
		return allMonthDays.find((d) => d.dateIso === selectedDayIso) || null;
	}, [allMonthDays, selectedDayIso]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3.5 sm:px-5 h-16 flex items-center justify-between gap-2 shadow-xs",
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}),
					staff.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: staff.avatarUrl,
						alt: staff.name,
						className: "w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-sm shrink-0",
						children: (staff.name || "S").slice(0, 1).toUpperCase()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate",
								children: staff.name
							}), isOwnProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold shrink-0",
								children: isBn ? "আপনি" : "You"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: staff.role || (isBn ? "স্টাফ" : "Staff") }), staff.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-0.5",
								children: [
									"• ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-2.5 h-2.5" }),
									" ",
									staff.phone
								]
							})]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					if (onOpenPrintPreview) onOpenPrintPreview();
					else handleDownloadIndividualPdf();
				},
				className: "h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all shrink-0 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "PDF / প্রিন্ট" : "PDF / Print" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrevMonth,
								className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer active:scale-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4.5 h-4.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-1 justify-center flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: selectedMonthIdx,
										onChange: (e) => {
											sounds.playTap();
											setSelectedDayIso(null);
											onChangeMonth(Number(e.target.value), selectedYear);
										},
										className: "h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white cursor-pointer",
										children: MONTHS_BN$2.map((mBn, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: idx,
											children: isBn ? mBn : MONTHS_EN$2[idx]
										}, idx))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: selectedYear,
										onChange: (e) => {
											sounds.playTap();
											setSelectedDayIso(null);
											onChangeMonth(selectedMonthIdx, Number(e.target.value));
										},
										className: "h-9 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white cursor-pointer",
										children: availableYears.map((yr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: yr,
											children: formatNum(yr)
										}, yr))
									}),
									(selectedMonthIdx !== currentMonthIdx || selectedYear !== currentYear) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedDayIso(null);
											onChangeMonth(currentMonthIdx, currentYear);
										},
										className: "px-2.5 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold cursor-pointer",
										children: isBn ? "এই মাস" : "This Month"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleNextMonth,
								className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 cursor-pointer active:scale-95",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4.5 h-4.5" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (onOpenPrintPreview) onOpenPrintPreview();
								else handleDownloadIndividualPdf();
							},
							className: "h-10 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 active:scale-[0.99] transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `মাসিক হাজিরা শীট PDF / প্রিন্ট (${MONTHS_BN$2[selectedMonthIdx]})` : `Monthly Attendance PDF / Print (${MONTHS_EN$2[selectedMonthIdx]})` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDownloadIndividualExcel,
							className: "h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মাসিক Excel (.xls) ডাউনলোড" : "Download Monthly Excel" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
									children: isBn ? `${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)} — সারসংক্ষেপ` : `${MONTHS_EN$2[selectedMonthIdx]} ${selectedYear} — Summary`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400",
									children: isBn ? `চিহ্নিত দিন: ${toBengaliNumber(stats.markedDays)} / ${toBengaliNumber(daysInMonth)} দিন` : `Marked: ${stats.markedDays} / ${daysInMonth} days`
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-lg font-black text-teal-600 dark:text-teal-400 tabular-nums",
									children: [formatNum(stats.attendanceRate), "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-400",
									children: isBn ? "উপস্থিতির হার" : "Rate"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300",
								style: { width: `${Math.min(100, Math.max(0, stats.attendanceRate))}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-5 gap-1.5 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-300",
										children: isBn ? "উপস্থিত" : "Present"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-black text-emerald-700 dark:text-emerald-300 tabular-nums",
										children: formatNum(stats.present)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold text-amber-800 dark:text-amber-300",
										children: isBn ? "লেট" : "Late"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-black text-amber-700 dark:text-amber-300 tabular-nums",
										children: formatNum(stats.late)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold text-sky-700 dark:text-sky-300",
										children: isBn ? "অর্ধ-দিন" : "Half"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-black text-sky-700 dark:text-sky-300 tabular-nums",
										children: formatNum(stats.halfDay)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold text-indigo-700 dark:text-indigo-300",
										children: isBn ? "ছুটি" : "Leave"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-black text-indigo-700 dark:text-indigo-300 tabular-nums",
										children: formatNum(stats.totalLeave)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-bold text-rose-700 dark:text-rose-300",
										children: isBn ? "অনুপস্থিত" : "Absent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base font-black text-rose-700 dark:text-rose-300 tabular-nums",
										children: formatNum(stats.absent)
									})]
								})
							]
						}),
						canViewSalary && stats.baseSalary > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-slate-600 dark:text-slate-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-3.5 h-3.5 text-teal-600 dark:text-teal-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										isBn ? "মূল বেতন:" : "Base:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-slate-900 dark:text-white tabular-nums",
											children: ["৳", formatNum(stats.baseSalary)]
										})
									] }),
									stats.deduction > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-rose-600 dark:text-rose-400 font-bold tabular-nums",
										children: [
											"(",
											isBn ? "কর্তন" : "Ded",
											": -৳",
											formatNum(stats.deduction),
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums",
								children: [
									isBn ? "সম্ভাব্য প্রদেয়: " : "Est. Payable: ",
									"৳",
									formatNum(stats.estimatedPayable)
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
								children: isBn ? "মাসিক হাজিরা ক্যালেন্ডার" : "Monthly Attendance Calendar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-slate-500 dark:text-slate-400",
								children: isBn ? "বিস্তারিত দেখতে যেকোনো দিনে ট্যাপ করুন" : "Tap any day for details"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-1 text-center",
							children: (isBn ? WEEKDAYS_SHORT_BN : WEEKDAYS_SHORT_EN).map((wd, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `text-[10px] font-extrabold py-1 ${idx === 5 ? "text-rose-500 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"}`,
								children: wd
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-7 gap-1.5",
							children: [Array.from({ length: firstWeekday }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 rounded-xl" }, `empty-${idx}`)), allMonthDays.map((item) => {
								const rec = item.record;
								const stMeta = rec ? STATUS_STYLE[rec.status] : null;
								const isSelected = selectedDayIso === item.dateIso;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setSelectedDayIso(isSelected ? null : item.dateIso);
									},
									className: `h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${stMeta ? stMeta.cellClass : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400"} ${item.isToday ? "ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-slate-900" : ""} ${isSelected ? "scale-105 shadow-sm ring-2 ring-slate-900 dark:ring-white" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold tabular-nums leading-none",
										children: formatNum(item.day)
									}), stMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-extrabold leading-none",
										children: isBn ? stMeta.shortBn : stMeta.shortEn
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" })]
								}, item.dateIso);
							})]
						}),
						selectedDayInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-slate-900 dark:text-white",
										children: isBn ? `${toBengaliNumber(selectedDayInfo.day)} ${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)} (${WEEKDAYS_FULL_BN$1[selectedDayInfo.weekdayIdx]})` : `${selectedDayInfo.day} ${MONTHS_EN$2[selectedMonthIdx]} ${selectedYear} (${WEEKDAYS_FULL_EN$1[selectedDayInfo.weekdayIdx]})`
									}), ((_selectedDayInfo$reco = selectedDayInfo.record) === null || _selectedDayInfo$reco === void 0 ? void 0 : _selectedDayInfo$reco.checkInTime) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 mt-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
											isBn ? "সময়:" : "Time:",
											" ",
											selectedDayInfo.record.checkInTime
										]
									})] }), selectedDayInfo.record ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${STATUS_STYLE[selectedDayInfo.record.status].badgeClass}`,
										children: isBn ? STATUS_STYLE[selectedDayInfo.record.status].bn : STATUS_STYLE[selectedDayInfo.record.status].en
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
										children: isBn ? "হাজিরা দেওয়া হয়নি" : "Not Marked"
									})]
								}),
								((_selectedDayInfo$reco2 = selectedDayInfo.record) === null || _selectedDayInfo$reco2 === void 0 ? void 0 : _selectedDayInfo$reco2.status) === "leave" && selectedDayInfo.record.leaveType && selectedDayInfo.record.leaveType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-bold text-indigo-700 dark:text-indigo-300",
									children: [isBn ? "ছুটির ধরন: " : "Leave Type: ", getLeaveLabel(selectedDayInfo.record.leaveType)]
								}),
								((_selectedDayInfo$reco3 = selectedDayInfo.record) === null || _selectedDayInfo$reco3 === void 0 ? void 0 : _selectedDayInfo$reco3.note) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700",
									children: selectedDayInfo.record.note
								}),
								((_selectedDayInfo$reco4 = selectedDayInfo.record) === null || _selectedDayInfo$reco4 === void 0 ? void 0 : _selectedDayInfo$reco4.recordedBy) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }),
										isBn ? "রেকর্ডকারী:" : "Recorded by:",
										" ",
										selectedDayInfo.record.recordedBy
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap px-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200",
							children: isBn ? `দৈনিক বিস্তারিত তালিকা (${toBengaliNumber(filteredDayRows.length)} দিন)` : `Day-by-Day Details (${filteredDayRows.length} days)`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 flex-wrap",
							children: [
								{
									id: "marked",
									bn: "চিহ্নিত",
									en: "Marked"
								},
								{
									id: "all",
									bn: "সব দিন",
									en: "All Days"
								},
								{
									id: "present",
									bn: "উপস্থিত",
									en: "Present"
								},
								{
									id: "leave",
									bn: "ছুটি",
									en: "Leave"
								},
								{
									id: "absent",
									bn: "অনুপস্থিত",
									en: "Absent"
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setLogFilter(f.id);
								},
								className: `px-2.5 h-7 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${logFilter === f.id ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"}`,
								children: isBn ? f.bn : f.en
							}, f.id))
						})]
					}), filteredDayRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-semibold text-slate-500 dark:text-slate-400",
						children: isBn ? "এই ফিল্টারে কোনো হাজিরা রেকর্ড পাওয়া যায়নি।" : "No attendance records found for this filter."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: filteredDayRows.map((item) => {
							const rec = item.record;
							const stMeta = rec ? STATUS_STYLE[rec.status] : null;
							const canDeleteThis = Boolean(rec && canDeleteDate(item.dateIso));
							const isConfirming = Boolean(rec && confirmDeleteRecordId === rec.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-2 ${item.isToday ? "border-teal-300 dark:border-teal-700" : "border-slate-200/90 dark:border-slate-800"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `w-9 h-9 rounded-xl border flex flex-col items-center justify-center shrink-0 ${stMeta ? stMeta.cellClass : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-black tabular-nums leading-none",
													children: formatNum(item.day)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-bold leading-none mt-0.5",
													children: isBn ? WEEKDAYS_SHORT_BN[item.weekdayIdx] : WEEKDAYS_SHORT_EN[item.weekdayIdx]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
														children: isBn ? `${toBengaliNumber(item.day)} ${MONTHS_BN$2[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}` : `${item.day} ${MONTHS_EN$2[selectedMonthIdx]} ${selectedYear}`
													}), item.isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[9px] font-extrabold",
														children: isBn ? "আজ" : "Today"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? WEEKDAYS_FULL_BN$1[item.weekdayIdx] : WEEKDAYS_FULL_EN$1[item.weekdayIdx] }),
														(rec === null || rec === void 0 ? void 0 : rec.checkInTime) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), rec.checkInTime]
														}),
														(rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && rec.leaveType && rec.leaveType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-indigo-600 dark:text-indigo-400 font-bold",
															children: ["• ", getLeaveLabel(rec.leaveType)]
														})
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 shrink-0",
											children: [stMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${stMeta.badgeClass}`,
												children: isBn ? stMeta.bn : stMeta.en
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
												children: isBn ? "অচিহ্নিত" : "Unmarked"
											}), canDeleteThis && rec && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setConfirmDeleteRecordId(isConfirming ? null : rec.id);
												},
												title: isBn ? "হাজিরা মুছুন" : "Undo / Delete Attendance",
												className: "w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/60 flex items-center justify-center cursor-pointer active:scale-95",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
											})]
										})]
									}),
									(rec === null || rec === void 0 ? void 0 : rec.note) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl",
										children: rec.note
									}),
									isConfirming && rec && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-rose-700 dark:text-rose-300",
											children: isBn ? "এই দিনের হাজিরা মুছে ফেলবেন?" : "Clear attendance for this day?"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmDeleteRecordId(null),
												className: "h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer",
												children: isBn ? "না" : "No"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: isDeletingId === rec.id,
												onClick: () => handleDeleteRecord(rec.id),
												className: "h-7 px-2.5 rounded-lg bg-rose-600 disabled:opacity-60 text-white text-xs font-bold cursor-pointer",
												children: isDeletingId === rec.id ? isBn ? "মুছছে..." : "Clearing..." : isBn ? "হ্যাঁ, মুছুন" : "Yes, Clear"
											})]
										})]
									})
								]
							}, item.dateIso);
						})
					})]
				})
			]
		})]
	});
};
//#endregion
//#region src/components/StaffMonthlyPrintPreviewModal.tsx
var MONTHS_BN$1 = [
	"জানুয়ারি",
	"ফেব্রুয়ারি",
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
var MONTHS_EN$1 = [
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
var WEEKDAYS_FULL_BN = [
	"রবিবার",
	"সোমবার",
	"মঙ্গলবার",
	"বুধবার",
	"বৃহস্পতিবার",
	"শুক্রবার",
	"শনিবার"
];
var WEEKDAYS_FULL_EN = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var STATUS_META$1 = {
	present: {
		bn: "উপস্থিত",
		en: "Present",
		badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
		pdfBg: "#dcfce7",
		pdfColor: "#166534"
	},
	late: {
		bn: "লেট",
		en: "Late",
		badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
		pdfBg: "#fef3c7",
		pdfColor: "#92400e"
	},
	half_day: {
		bn: "অর্ধ-দিন",
		en: "Half Day",
		badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
		pdfBg: "#e0f2fe",
		pdfColor: "#0369a1"
	},
	leave: {
		bn: "ছুটি",
		en: "Leave",
		badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
		pdfBg: "#e0e7ff",
		pdfColor: "#3730a3"
	},
	absent: {
		bn: "অনুপস্থিত",
		en: "Absent",
		badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
		pdfBg: "#ffe4e6",
		pdfColor: "#be123c"
	}
};
var LEAVE_LABELS = {
	casual: {
		bn: "নৈমিত্তিক ছুটি",
		en: "Casual Leave"
	},
	sick: {
		bn: "অসুস্থতা ছুটি",
		en: "Sick Leave"
	},
	emergency: {
		bn: "জরুরি ছুটি",
		en: "Emergency Leave"
	},
	unpaid: {
		bn: "বিনা বেতন ছুটি",
		en: "Unpaid Leave"
	}
};
var escapeHtml = (value) => {
	return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var StaffMonthlyPrintPreviewModal = ({ isOpen, staff, attendanceRecords, selectedMonthIdx, selectedYear, canViewSalary, lang, onClose }) => {
	const isBn = lang === "bn";
	const formatNum = (n) => isBn ? toBengaliNumber(n) : String(n);
	const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, "0")}`;
	const daysInMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
	const { allMonthDays, stats } = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		if (staff) attendanceRecords.forEach((rec) => {
			if (rec.staffId === staff.id && rec.month === selectedMonthKey) map.set(rec.date, rec);
		});
		const days = [];
		for (let day = 1; day <= daysInMonth; day++) {
			const dateIso = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
			if (r.status === "present") present++;
			else if (r.status === "late") late++;
			else if (r.status === "half_day") halfDay++;
			else if (r.status === "absent") absent++;
			else if (r.status === "leave") {
				if (r.leaveType === "unpaid") unpaidLeave++;
				else paidLeave++;
			}
		});
		const totalLeave = paidLeave + unpaidLeave;
		const markedDays = present + late + halfDay + totalLeave + absent;
		const effectivePresent = present + late + halfDay * .5;
		const attendanceRate = markedDays > 0 ? Math.round(effectivePresent / markedDays * 100) : 0;
		const baseSalary = Number(staff === null || staff === void 0 ? void 0 : staff.baseSalary) || 0;
		const dailyRate = baseSalary > 0 ? baseSalary / daysInMonth : 0;
		const deductibleDays = absent + unpaidLeave + halfDay * .5;
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
	}, [
		staff,
		attendanceRecords,
		selectedMonthKey,
		daysInMonth,
		selectedYear,
		selectedMonthIdx
	]);
	if (!isOpen || !staff) return null;
	const monthTitleBn = `${MONTHS_BN$1[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
	const monthTitleEn = `${MONTHS_EN$1[selectedMonthIdx]} ${selectedYear}`;
	const generatedTimeText = (/* @__PURE__ */ new Date()).toLocaleString(isBn ? "bn-BD" : "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
	const handleTriggerPrint = () => {
		sounds.playSuccess();
		setTimeout(() => {
			try {
				window.print();
			} catch (e) {
				console.warn("Print invocation failed:", e);
			}
		}, 100);
	};
	const handleDownloadHtmlSheet = () => {
		sounds.playSuccess();
		const tableRowsHtml = allMonthDays.map((item) => {
			var _LEAVE_LABELS$rec$lea;
			const rec = item.record;
			const stMeta = rec ? STATUS_META$1[rec.status] : null;
			const leaveText = (rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && rec.leaveType && rec.leaveType !== "none" ? ((_LEAVE_LABELS$rec$lea = LEAVE_LABELS[rec.leaveType]) === null || _LEAVE_LABELS$rec$lea === void 0 ? void 0 : _LEAVE_LABELS$rec$lea.bn) || "ছুটি" : "-";
			const dateDisplay = `${toBengaliNumber(item.day)} ${MONTHS_BN$1[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
			const statusCellHtml = stMeta ? `<span class="badge" style="background:${stMeta.pdfBg};color:${stMeta.pdfColor};">${escapeHtml(stMeta.bn)}</span>` : `<span style="color:#94a3b8;font-size:11px;">অচিহ্নিত</span>`;
			const isFriday = item.weekdayIdx === 5;
			return `
          <tr${isFriday ? " style=\"background:#fff1f2;\"" : ""}>
            <td style="text-align:center;font-weight:700;">${toBengaliNumber(item.day)}</td>
            <td style="text-align:left;">${escapeHtml(dateDisplay)}</td>
            <td style="text-align:center;${isFriday ? "color:#be123c;font-weight:700;" : ""}">${escapeHtml(WEEKDAYS_FULL_BN[item.weekdayIdx])}</td>
            <td style="text-align:center;">${statusCellHtml}</td>
            <td style="text-align:center;">${escapeHtml((rec === null || rec === void 0 ? void 0 : rec.checkInTime) || "-")}</td>
            <td style="text-align:center;">${escapeHtml(leaveText)}</td>
            <td style="text-align:left;">${escapeHtml((rec === null || rec === void 0 ? void 0 : rec.note) || "-")}</td>
            <td style="text-align:center;font-size:11px;color:#475569;">${escapeHtml((rec === null || rec === void 0 ? void 0 : rec.recordedBy) || "-")}</td>
          </tr>`;
		}).join("");
		const salarySectionHtml = canViewSalary && stats.baseSalary > 0 ? `
        <div class="salary-box">
          <div><span>মূল মাসিক বেতন:</span> <strong>৳${toBengaliNumber(stats.baseSalary)}</strong></div>
          <div><span>অনুপস্থিতি/ছুটি কর্তন:</span> <strong style="color:#dc2626;">-৳${toBengaliNumber(stats.deduction)}</strong></div>
          <div><span>সম্ভাব্য প্রদেয় বেতন:</span> <strong style="color:#059669;font-size:15px;">৳${toBengaliNumber(stats.estimatedPayable)}</strong></div>
        </div>` : "";
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
        <div><span class="meta-label">পদবী:</span> <span class="meta-val">${escapeHtml(staff.role || "স্টাফ")}</span></div>
        <div><span class="meta-label">মোবাইল:</span> <span class="meta-val">${escapeHtml(staff.phone || "-")}</span></div>
      </div>
      <div class="meta-col" style="text-align:right;">
        <div><span class="meta-label">হাজিরার মাস:</span> <span class="meta-val">${escapeHtml(monthTitleBn)}</span></div>
        ${staff.userCode ? `<div><span class="meta-label">স্টাফ কোড:</span> <span class="meta-val">${escapeHtml(staff.userCode)}</span></div>` : ""}
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
		const blob = new Blob(["﻿" + htmlContent], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const safeName = (staff.name || "staff").replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, "_");
		link.href = url;
		link.download = `attendance_sheet_${safeName}_${MONTHS_EN$1[selectedMonthIdx]}_${selectedYear}.html`;
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, 250);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[85] bg-slate-900/80 backdrop-blur-xs flex flex-col overflow-hidden print:static print:inset-auto print:bg-white print:overflow-visible print:h-auto select-none animate-in fade-in duration-150",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-sm shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "w-4.5 h-4.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate",
						children: isBn ? `${staff.name} — মাসিক হাজিরা শীট (প্রিন্ট প্রিভিউ)` : `${staff.name} — Monthly Attendance Sheet`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [isBn ? monthTitleBn : monthTitleEn, " • A4 Hardcopy Ready"] })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleTriggerPrint,
						className: "h-9 px-3 sm:px-4 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রিন্ট / PDF সেভ" : "Print / Save PDF" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleDownloadHtmlSheet,
						title: isBn ? "অফলাইন প্রিন্টের জন্য ফাইল ডাউনলোড" : "Download printable sheet",
						className: "h-9 px-2.5 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: isBn ? "ডাউনলোড (.html)" : "Download"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							onClose();
						},
						"aria-label": isBn ? "বন্ধ করুন" : "Close",
						className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer active:scale-95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4.5 h-4.5" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto p-3 sm:p-6 print:overflow-visible print:p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "printable-attendance-sheet",
				className: "max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-7 space-y-4 print:max-w-none print:shadow-none print:border-none print:rounded-none print:p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-teal-700 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-black text-slate-900 tracking-tight",
								children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protyasha Cable Network"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm font-bold text-teal-800 mt-0.5",
								children: isBn ? `ব্যক্তিগত মাসিক স্টাফ হাজিরা ও ছুটি শীট — ${monthTitleBn}` : `Individual Staff Monthly Attendance Sheet — ${monthTitleEn}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500",
								children: isBn ? "অফিসিয়াল হার্ডকপি রেকর্ড | হেল্পলাইন: ০১৭৭৭-৮৭৭২০৭" : "Official Hardcopy Record | Helpline: 01777-877207"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block px-3 py-1 rounded-md bg-teal-700 text-white text-[11px] font-extrabold",
								children: isBn ? monthTitleBn : monthTitleEn
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-600 font-semibold mt-1",
								children: [
									isBn ? "তৈরির সময়:" : "Generated:",
									" ",
									generatedTimeText
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "স্টাফের নাম:" : "Staff Name:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-900",
										children: staff.name
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "পদবী:" : "Designation:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-900",
										children: staff.role || (isBn ? "স্টাফ" : "Staff")
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "মোবাইল:" : "Phone:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-900 tabular-nums",
										children: staff.phone || "-"
									})
								] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 sm:text-right",
							children: [
								staff.userCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "স্টাফ কোড:" : "Staff Code:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-slate-900",
										children: staff.userCode
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "মোট কর্মদিবস:" : "Days in Month:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-slate-900 tabular-nums",
										children: [
											formatNum(daysInMonth),
											" ",
											isBn ? "দিন" : "days"
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 font-semibold",
										children: isBn ? "উপস্থিতির হার:" : "Attendance Rate:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-teal-700 font-black tabular-nums",
										children: [formatNum(stats.attendanceRate), "%"]
									})
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 sm:grid-cols-6 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-emerald-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "উপস্থিত" : "Present"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-emerald-700 tabular-nums",
									children: formatNum(stats.present)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-amber-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "লেট" : "Late"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-amber-700 tabular-nums",
									children: formatNum(stats.late)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-sky-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "অর্ধ-দিন" : "Half Day"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-sky-700 tabular-nums",
									children: formatNum(stats.halfDay)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-indigo-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "মোট ছুটি" : "Leave"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-indigo-700 tabular-nums",
									children: formatNum(stats.totalLeave)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-rose-50/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "অনুপস্থিত" : "Absent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-rose-700 tabular-nums",
									children: formatNum(stats.absent)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg border border-slate-300 bg-slate-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold text-slate-600",
									children: isBn ? "চিহ্নিত দিন" : "Marked"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base font-black text-slate-900 tabular-nums",
									children: [
										formatNum(stats.markedDays),
										"/",
										formatNum(daysInMonth)
									]
								})]
							})
						]
					}),
					canViewSalary && stats.baseSalary > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 font-semibold",
									children: isBn ? "মূল মাসিক বেতন:" : "Base Salary:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-slate-900 tabular-nums",
									children: ["৳", formatNum(stats.baseSalary)]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 font-semibold",
									children: isBn ? "অনুপস্থিতি/ছুটি কর্তন:" : "Deduction:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-rose-600 tabular-nums",
									children: ["-৳", formatNum(stats.deduction)]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 font-semibold",
									children: isBn ? "সম্ভাব্য প্রদেয়:" : "Est. Payable:"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-emerald-700 text-sm font-black tabular-nums",
									children: ["৳", formatNum(stats.estimatedPayable)]
								})
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full border-collapse text-[11px] sm:text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-100 text-slate-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-1.5 text-center w-9",
										children: isBn ? "দিন" : "Day"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-left",
										children: isBn ? "তারিখ" : "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-center",
										children: isBn ? "বার" : "Weekday"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-center",
										children: isBn ? "স্ট্যাটাস" : "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-center",
										children: isBn ? "সময়" : "Time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-center",
										children: isBn ? "ছুটির ধরন" : "Leave Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-left",
										children: isBn ? "নোট / মন্তব্য" : "Note"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "border border-slate-300 py-1.5 px-2 text-center",
										children: isBn ? "রেকর্ডকারী" : "Recorded By"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: allMonthDays.map((item) => {
								var _LEAVE_LABELS$rec$lea2, _LEAVE_LABELS$rec$lea3;
								const rec = item.record;
								const stMeta = rec ? STATUS_META$1[rec.status] : null;
								const leaveText = (rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && rec.leaveType && rec.leaveType !== "none" ? isBn ? ((_LEAVE_LABELS$rec$lea2 = LEAVE_LABELS[rec.leaveType]) === null || _LEAVE_LABELS$rec$lea2 === void 0 ? void 0 : _LEAVE_LABELS$rec$lea2.bn) || "ছুটি" : ((_LEAVE_LABELS$rec$lea3 = LEAVE_LABELS[rec.leaveType]) === null || _LEAVE_LABELS$rec$lea3 === void 0 ? void 0 : _LEAVE_LABELS$rec$lea3.en) || "Leave" : "-";
								const isFriday = item.weekdayIdx === 5;
								const dateDisplay = isBn ? `${toBengaliNumber(item.day)} ${MONTHS_BN$1[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}` : `${item.day} ${MONTHS_EN$1[selectedMonthIdx]} ${selectedYear}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: isFriday ? "bg-rose-50/60" : item.day % 2 === 0 ? "bg-slate-50/70" : "bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-1.5 text-center font-bold tabular-nums",
											children: formatNum(item.day)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-left whitespace-nowrap",
											children: dateDisplay
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: `border border-slate-300 py-1 px-2 text-center whitespace-nowrap ${isFriday ? "text-rose-700 font-bold" : ""}`,
											children: isBn ? WEEKDAYS_FULL_BN[item.weekdayIdx] : WEEKDAYS_FULL_EN[item.weekdayIdx]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-center whitespace-nowrap",
											children: stMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${stMeta.badgeClass}`,
												children: isBn ? stMeta.bn : stMeta.en
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400",
												children: isBn ? "অচিহ্নিত" : "Unmarked"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-center whitespace-nowrap tabular-nums",
											children: (rec === null || rec === void 0 ? void 0 : rec.checkInTime) || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-center whitespace-nowrap",
											children: leaveText
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-left",
											children: (rec === null || rec === void 0 ? void 0 : rec.note) || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "border border-slate-300 py-1 px-2 text-center text-[10px] text-slate-600",
											children: (rec === null || rec === void 0 ? void 0 : rec.recordedBy) || "-"
										})
									]
								}, item.dateIso);
							}) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-8 flex flex-wrap items-end justify-between gap-6 text-xs text-slate-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									isBn ? "রিপোর্ট প্রিন্টের তারিখ:" : "Printed On:",
									" ",
									generatedTimeText
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-slate-600 w-40 text-center pt-1.5 font-bold text-slate-900",
								children: isBn ? "স্টাফের স্বাক্ষর" : "Staff Signature"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-slate-600 w-44 text-center pt-1.5 font-bold text-slate-900",
								children: isBn ? "কর্তৃপক্ষের স্বাক্ষর ও সিল" : "Authority Signature & Seal"
							})
						]
					})
				]
			})
		})]
	});
};
//#endregion
//#region src/components/StaffAttendanceModal.tsx
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
var STATUS_META = [
	{
		id: "present",
		bn: "উপস্থিত",
		en: "Present",
		activeClass: "bg-emerald-600 text-white border-emerald-600"
	},
	{
		id: "late",
		bn: "লেট",
		en: "Late",
		activeClass: "bg-amber-500 text-white border-amber-500"
	},
	{
		id: "half_day",
		bn: "অর্ধ-দিন",
		en: "Half",
		activeClass: "bg-sky-600 text-white border-sky-600"
	},
	{
		id: "leave",
		bn: "ছুটি",
		en: "Leave",
		activeClass: "bg-indigo-600 text-white border-indigo-600"
	},
	{
		id: "absent",
		bn: "অনুপস্থিত",
		en: "Absent",
		activeClass: "bg-rose-600 text-white border-rose-600"
	}
];
var LEAVE_TYPES = [
	{
		id: "casual",
		bn: "নৈমিত্তিক ছুটি",
		en: "Casual Leave"
	},
	{
		id: "sick",
		bn: "অসুস্থতার ছুটি",
		en: "Sick Leave"
	},
	{
		id: "emergency",
		bn: "জরুরি ছুটি",
		en: "Emergency Leave"
	},
	{
		id: "unpaid",
		bn: "বিনা বেতনে ছুটি",
		en: "Unpaid Leave"
	}
];
var getLocalTodayIso = () => {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
var getCurrentTimeLabel = () => {
	return (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
};
var sanitizeRecordId = (staffId, date) => {
	return `${(staffId || "staff").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "staff"}_${(date || "").replace(/[^0-9-]/g, "").slice(0, 16)}`;
};
var shiftDateByDays = (dateStr, delta) => {
	const [y, m, d] = dateStr.split("-").map(Number);
	const dt = new Date(y, (m || 1) - 1, (d || 1) + delta);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
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
	const doc = (_iframe$contentWindow = iframe.contentWindow) === null || _iframe$contentWindow === void 0 ? void 0 : _iframe$contentWindow.document;
	if (!doc) {
		document.body.removeChild(iframe);
		return;
	}
	doc.open();
	doc.write(htmlContent);
	doc.close();
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
var StaffAttendanceModal = ({ isOpen, staffAccounts, attendanceRecords, lang, user, onClose, onSaveAttendance, onSaveBulkAttendance, onDeleteAttendance, onSubViewChange }) => {
	const isBn = lang === "bn";
	const todayIso = getLocalTodayIso();
	const [activeTab, setActiveTab] = (0, import_react.useState)("daily");
	const [selectedDetailStaffId, setSelectedDetailStaffId] = (0, import_react.useState)(null);
	const [printPreviewStaffId, setPrintPreviewStaffId] = (0, import_react.useState)(null);
	const [confirmDeleteDailyStaffId, setConfirmDeleteDailyStaffId] = (0, import_react.useState)(null);
	const [isDeletingDailyId, setIsDeletingDailyId] = (0, import_react.useState)(null);
	const [dailyFeedback, setDailyFeedback] = (0, import_react.useState)(null);
	const [staffSession, setStaffSession] = (0, import_react.useState)(() => {
		try {
			const saved = sessionStorage.getItem("protyasha_support_staff_session");
			if (saved) return JSON.parse(saved);
		} catch {}
		return null;
	});
	const [staffAuthConfig, setStaffAuthConfig] = (0, import_react.useState)({
		globalPin: "1234",
		staffPins: {}
	});
	const [isStaffLoginOpen, setIsStaffLoginOpen] = (0, import_react.useState)(false);
	const [staffLoginIdentifier, setStaffLoginIdentifier] = (0, import_react.useState)("");
	const [staffLoginPin, setStaffLoginPin] = (0, import_react.useState)("");
	const [staffLoginError, setStaffLoginError] = (0, import_react.useState)("");
	const [isVerifyingStaff, setIsVerifyingStaff] = (0, import_react.useState)(false);
	const [isPinControlOpen, setIsPinControlOpen] = (0, import_react.useState)(false);
	const [draftGlobalPin, setDraftGlobalPin] = (0, import_react.useState)("1234");
	const [draftStaffPins, setDraftStaffPins] = (0, import_react.useState)({});
	const [pinSearchQuery, setPinSearchQuery] = (0, import_react.useState)("");
	const [showPinControlChars, setShowPinControlChars] = (0, import_react.useState)(false);
	const [isSavingPins, setIsSavingPins] = (0, import_react.useState)(false);
	const [pinControlFeedback, setPinControlFeedback] = (0, import_react.useState)(null);
	const [isChangeOwnPinOpen, setIsChangeOwnPinOpen] = (0, import_react.useState)(false);
	const [ownCurrentPin, setOwnCurrentPin] = (0, import_react.useState)("");
	const [ownNewPin, setOwnNewPin] = (0, import_react.useState)("");
	const [ownConfirmPin, setOwnConfirmPin] = (0, import_react.useState)("");
	const [showOwnPinChars, setShowOwnPinChars] = (0, import_react.useState)(false);
	const [isSavingOwnPin, setIsSavingOwnPin] = (0, import_react.useState)(false);
	const [ownPinFeedback, setOwnPinFeedback] = (0, import_react.useState)(null);
	const subViewHistoryDepthRef = (0, import_react.useRef)(0);
	const subViewRef = (0, import_react.useRef)({
		activeTab,
		selectedDetailStaffId,
		printPreviewStaffId,
		isStaffLoginOpen,
		isPinControlOpen,
		isChangeOwnPinOpen
	});
	subViewRef.current = {
		activeTab,
		selectedDetailStaffId,
		printPreviewStaffId,
		isStaffLoginOpen,
		isPinControlOpen,
		isChangeOwnPinOpen
	};
	const pushSubViewHistory = () => {
		subViewHistoryDepthRef.current += 1;
		window.history.pushState({
			attendanceSubView: true,
			time: Date.now()
		}, "");
	};
	const closeSubViewViaBack = (fallbackClose) => {
		var _window$history$state;
		if (subViewHistoryDepthRef.current > 0 && ((_window$history$state = window.history.state) === null || _window$history$state === void 0 ? void 0 : _window$history$state.attendanceSubView)) window.history.back();
		else {
			subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			fallbackClose();
		}
	};
	(0, import_react.useEffect)(() => {
		onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(isOpen && (activeTab !== "daily" || Boolean(selectedDetailStaffId) || Boolean(printPreviewStaffId) || isStaffLoginOpen || isPinControlOpen || isChangeOwnPinOpen));
		return () => {
			onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(false);
		};
	}, [
		isOpen,
		activeTab,
		selectedDetailStaffId,
		printPreviewStaffId,
		isStaffLoginOpen,
		isPinControlOpen,
		isChangeOwnPinOpen,
		onSubViewChange
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			setActiveTab("daily");
			setSelectedDetailStaffId(null);
			setPrintPreviewStaffId(null);
			setIsStaffLoginOpen(false);
			setIsPinControlOpen(false);
			setIsChangeOwnPinOpen(false);
			setConfirmDeleteDailyStaffId(null);
			setDailyFeedback(null);
			subViewHistoryDepthRef.current = 0;
			return;
		}
		try {
			const saved = sessionStorage.getItem("protyasha_support_staff_session");
			setStaffSession(saved ? JSON.parse(saved) : null);
		} catch {}
		const handleSubViewPop = () => {
			const s = subViewRef.current;
			subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
			if (s.isChangeOwnPinOpen) setIsChangeOwnPinOpen(false);
			else if (s.isPinControlOpen) setIsPinControlOpen(false);
			else if (s.printPreviewStaffId) setPrintPreviewStaffId(null);
			else if (s.isStaffLoginOpen) setIsStaffLoginOpen(false);
			else if (s.selectedDetailStaffId) setSelectedDetailStaffId(null);
			else if (s.activeTab !== "daily") setActiveTab("daily");
		};
		window.addEventListener("popstate", handleSubViewPop);
		return () => window.removeEventListener("popstate", handleSubViewPop);
	}, [isOpen]);
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
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(todayIso);
	const [selectedMonthIdx, setSelectedMonthIdx] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth());
	const [selectedYear, setSelectedYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [editingNoteStaffId, setEditingNoteStaffId] = (0, import_react.useState)(null);
	const [draftNote, setDraftNote] = (0, import_react.useState)("");
	const [isBulkSaving, setIsBulkSaving] = (0, import_react.useState)(false);
	const [leaveStaffId, setLeaveStaffId] = (0, import_react.useState)("");
	const [leaveFromDate, setLeaveFromDate] = (0, import_react.useState)(todayIso);
	const [leaveToDate, setLeaveToDate] = (0, import_react.useState)(todayIso);
	const [leaveType, setLeaveType] = (0, import_react.useState)("casual");
	const [leaveNote, setLeaveNote] = (0, import_react.useState)("");
	const [leaveFeedback, setLeaveFeedback] = (0, import_react.useState)("");
	const [isSavingLeave, setIsSavingLeave] = (0, import_react.useState)(false);
	const [confirmDeleteLeaveId, setConfirmDeleteLeaveId] = (0, import_react.useState)(null);
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const isVisitor = (user === null || user === void 0 ? void 0 : user.role) === "visitor";
	const canBulkMark = isAdmin;
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
	const activeStaff = (0, import_react.useMemo)(() => staffAccounts.filter(isActualStaffAccount), [staffAccounts]);
	const matchedMainStaff = (0, import_react.useMemo)(() => isAdmin ? null : findMatchedStaffForUser(user, activeStaff), [
		isAdmin,
		user,
		activeStaff
	]);
	const matchedOwnStaff = (0, import_react.useMemo)(() => {
		if (isAdmin) return null;
		if (matchedMainStaff) return matchedMainStaff;
		if (staffSession) {
			const sessionPhone = normalizePhoneNumber(staffSession.phone);
			const sessionName = (staffSession.name || "").trim().toLowerCase();
			const bySession = activeStaff.find((s) => s.id === staffSession.staffId) || (sessionPhone.length >= 6 ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === sessionPhone) : void 0) || (sessionName ? activeStaff.find((s) => (s.name || "").trim().toLowerCase() === sessionName) : void 0);
			if (bySession) return bySession;
		}
		if (user && (user.role === "staff" || user.role === "sub-admin")) {
			const uPhone = normalizePhoneNumber(user.phone);
			const uName = (user.name || "").trim().toLowerCase();
			const uRawPhone = (user.phone || "").trim().toLowerCase();
			const byUser = (user.id ? activeStaff.find((s) => s.id === user.id) : void 0) || (uPhone.length >= 6 ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === uPhone) : void 0) || (uRawPhone ? activeStaff.find((s) => (s.userCode || "").trim().toLowerCase() === uRawPhone) : void 0) || (uName ? activeStaff.find((s) => (s.name || "").trim().toLowerCase() === uName) : void 0);
			if (byUser) return byUser;
		}
		return null;
	}, [
		isAdmin,
		matchedMainStaff,
		staffSession,
		user,
		activeStaff
	]);
	(0, import_react.useEffect)(() => {
		if (!isAdmin && matchedOwnStaff) setLeaveStaffId(matchedOwnStaff.id);
		else if (!isAdmin && !matchedOwnStaff) setLeaveStaffId("");
	}, [isAdmin, matchedOwnStaff]);
	(0, import_react.useEffect)(() => {
		if (!dailyFeedback) return;
		const t = setTimeout(() => setDailyFeedback(null), 3500);
		return () => clearTimeout(t);
	}, [dailyFeedback]);
	const orderedDailyStaff = (0, import_react.useMemo)(() => {
		if (isAdmin || !matchedOwnStaff) return activeStaff;
		return [matchedOwnStaff, ...activeStaff.filter((s) => s.id !== matchedOwnStaff.id)];
	}, [
		activeStaff,
		isAdmin,
		matchedOwnStaff
	]);
	const selectedDetailStaff = (0, import_react.useMemo)(() => selectedDetailStaffId ? staffAccounts.find((s) => s.id === selectedDetailStaffId) || null : null, [staffAccounts, selectedDetailStaffId]);
	const printPreviewStaff = (0, import_react.useMemo)(() => printPreviewStaffId ? staffAccounts.find((s) => s.id === printPreviewStaffId) || null : null, [staffAccounts, printPreviewStaffId]);
	const canModifyStaffOnDate = (staffId, dateStr) => {
		if (isAdmin) return true;
		if (!matchedOwnStaff) return false;
		return matchedOwnStaff.id === staffId && dateStr === todayIso;
	};
	const isOwnStaffId = (staffId) => {
		return !isAdmin && Boolean(matchedOwnStaff && matchedOwnStaff.id === staffId);
	};
	const activeRecorderName = ((staffSession === null || staffSession === void 0 ? void 0 : staffSession.name) || (matchedOwnStaff === null || matchedOwnStaff === void 0 ? void 0 : matchedOwnStaff.name) || (user === null || user === void 0 ? void 0 : user.name) || (isBn ? "অ্যাডমিন" : "Admin")).slice(0, 128);
	const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, "0")}`;
	const daysInSelectedMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();
	const dailyMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		attendanceRecords.forEach((rec) => {
			if (rec.date === selectedDate) map.set(rec.staffId, rec);
		});
		return map;
	}, [attendanceRecords, selectedDate]);
	const dailySummary = (0, import_react.useMemo)(() => {
		let present = 0;
		let late = 0;
		let halfDay = 0;
		let leave = 0;
		let absent = 0;
		activeStaff.forEach((s) => {
			const rec = dailyMap.get(s.id);
			if (!rec) return;
			if (rec.status === "present") present++;
			else if (rec.status === "late") late++;
			else if (rec.status === "half_day") halfDay++;
			else if (rec.status === "leave") leave++;
			else if (rec.status === "absent") absent++;
		});
		return {
			total: activeStaff.length,
			present,
			late,
			halfDay,
			leave,
			absent,
			unmarked: Math.max(0, activeStaff.length - (present + late + halfDay + leave + absent))
		};
	}, [activeStaff, dailyMap]);
	const monthlyStats = (0, import_react.useMemo)(() => {
		const monthRecords = attendanceRecords.filter((r) => r.month === selectedMonthKey);
		return activeStaff.map((staff) => {
			const recs = monthRecords.filter((r) => r.staffId === staff.id);
			let present = 0;
			let late = 0;
			let halfDay = 0;
			let paidLeave = 0;
			let unpaidLeave = 0;
			let absent = 0;
			recs.forEach((r) => {
				if (r.status === "present") present++;
				else if (r.status === "late") late++;
				else if (r.status === "half_day") halfDay++;
				else if (r.status === "absent") absent++;
				else if (r.status === "leave") {
					if (r.leaveType === "unpaid") unpaidLeave++;
					else paidLeave++;
				}
			});
			const totalLeave = paidLeave + unpaidLeave;
			const markedDays = present + late + halfDay + totalLeave + absent;
			const effectivePresent = present + late + halfDay * .5;
			const attendanceRate = markedDays > 0 ? Math.round(effectivePresent / markedDays * 100) : 0;
			const baseSalary = Number(staff.baseSalary) || 0;
			const dailyRate = baseSalary > 0 ? baseSalary / daysInSelectedMonth : 0;
			const deductibleDays = absent + unpaidLeave + halfDay * .5;
			const deduction = Math.round(dailyRate * deductibleDays);
			const estimatedPayable = Math.max(0, baseSalary - deduction);
			return {
				staff,
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
			};
		});
	}, [
		activeStaff,
		attendanceRecords,
		selectedMonthKey,
		daysInSelectedMonth
	]);
	const monthlyTotals = (0, import_react.useMemo)(() => {
		return {
			totalPresent: monthlyStats.reduce((sum, s) => sum + s.present + s.late, 0),
			totalLeaves: monthlyStats.reduce((sum, s) => sum + s.totalLeave, 0),
			totalAbsent: monthlyStats.reduce((sum, s) => sum + s.absent, 0),
			totalPayable: monthlyStats.reduce((sum, s) => sum + s.estimatedPayable, 0),
			avgRate: monthlyStats.length > 0 ? Math.round(monthlyStats.reduce((sum, s) => sum + s.attendanceRate, 0) / monthlyStats.length) : 0
		};
	}, [monthlyStats]);
	const monthlyLeaveRecords = (0, import_react.useMemo)(() => {
		return attendanceRecords.filter((r) => r.status === "leave" && r.month === selectedMonthKey).sort((a, b) => b.date.localeCompare(a.date));
	}, [attendanceRecords, selectedMonthKey]);
	if (!isOpen) return null;
	const formatNum = (n) => isBn ? toBengaliNumber(n) : String(n);
	const getLeaveTypeLabel = (lt) => {
		const found = LEAVE_TYPES.find((item) => item.id === lt);
		return found ? isBn ? found.bn : found.en : isBn ? "নৈমিত্তিক ছুটি" : "Casual Leave";
	};
	const openStaffDetail = (staffId) => {
		sounds.playTap();
		pushSubViewHistory();
		setSelectedDetailStaffId(staffId);
	};
	const openStaffPrintPreview = (staffId) => {
		sounds.playTap();
		pushSubViewHistory();
		setPrintPreviewStaffId(staffId);
	};
	const openStaffLoginModal = () => {
		sounds.playTap();
		setStaffLoginError("");
		setStaffLoginPin("");
		if (!staffLoginIdentifier && (user === null || user === void 0 ? void 0 : user.phone)) setStaffLoginIdentifier(user.phone);
		pushSubViewHistory();
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
			const matchedStaff = activeStaff.find((s) => {
				const sPhone = normalizePhoneNumber(s.phone);
				const sCode = (s.userCode || "").trim().toLowerCase();
				const sName = (s.name || "").trim().toLowerCase();
				return s.id === rawId || sPhone && normalizedInputPhone && sPhone === normalizedInputPhone || sCode && sCode === loweredInput || sName && sName === loweredInput;
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
					setDailyFeedback({
						type: "success",
						text: isBn ? `${matchedStaff.name} হিসেবে স্টাফ লগইন সফল হয়েছে। এখন নিজের হাজিরা দিতে পারবেন।` : `Logged in as ${matchedStaff.name}. You can now mark your attendance.`
					});
					closeSubViewViaBack(() => setIsStaffLoginOpen(false));
					return;
				}
			}
			try {
				const matchedStaffUser = (await getDocs(collection(db, "users"))).docs.map((d) => ({
					id: d.id,
					...d.data()
				})).find((u) => (u.role === "staff" || u.role === "sub-admin") && u.status !== "suspended" && String(u.pin || "") === cleanPin && (u.phone && String(u.phone).trim() === rawId || normalizedInputPhone.length >= 6 && normalizePhoneNumber(u.phone) === normalizedInputPhone));
				if (matchedStaffUser) {
					const linkedStaff = activeStaff.find((s) => String(s.id) === String(matchedStaffUser.id)) || activeStaff.find((s) => normalizePhoneNumber(s.phone) === normalizePhoneNumber(matchedStaffUser.phone)) || activeStaff.find((s) => (s.name || "").trim().toLowerCase() === String(matchedStaffUser.name || "").trim().toLowerCase());
					if (linkedStaff) {
						const session = {
							staffId: linkedStaff.id,
							name: linkedStaff.name,
							phone: linkedStaff.phone || matchedStaffUser.phone || rawId,
							roleTitle: linkedStaff.role || (isBn ? "স্টাফ" : "Staff"),
							loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
						};
						setStaffSession(session);
						try {
							sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(session));
						} catch {}
						sounds.playSuccess();
						setDailyFeedback({
							type: "success",
							text: isBn ? `${linkedStaff.name} হিসেবে স্টাফ লগইন সফল হয়েছে।` : `Logged in as ${linkedStaff.name}.`
						});
						closeSubViewViaBack(() => setIsStaffLoginOpen(false));
						return;
					}
				}
			} catch {}
			setStaffLoginError(isBn ? "স্টাফ তথ্য বা পিন সঠিক নয়। অ্যাডমিনের কাছ থেকে সঠিক স্টাফ পিন জেনে নিন।" : "Invalid staff credentials or PIN. Please contact admin.");
		} finally {
			setIsVerifyingStaff(false);
		}
	};
	const openPinControlModal = () => {
		if (!isAdmin) return;
		sounds.playTap();
		setDraftGlobalPin(staffAuthConfig.globalPin || "1234");
		setDraftStaffPins({ ...staffAuthConfig.staffPins || {} });
		setPinSearchQuery("");
		setPinControlFeedback(null);
		pushSubViewHistory();
		setIsPinControlOpen(true);
	};
	const handleSaveAdminPinControl = async (e) => {
		e.preventDefault();
		if (!isAdmin) return;
		const cleanGlobal = draftGlobalPin.trim();
		if (!/^\d{4,8}$/.test(cleanGlobal)) {
			setPinControlFeedback({
				type: "error",
				text: isBn ? "ডিফল্ট গ্লোবাল পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।" : "Default global PIN must be 4–8 digits."
			});
			return;
		}
		const cleanedStaffPins = {};
		for (const [sid, rawVal] of Object.entries(draftStaffPins)) {
			const val = String(rawVal || "").trim();
			if (!val) continue;
			if (!/^\d{4,8}$/.test(val)) {
				const st = activeStaff.find((s) => s.id === sid);
				setPinControlFeedback({
					type: "error",
					text: isBn ? `${(st === null || st === void 0 ? void 0 : st.name) || "স্টাফ"}-এর পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।` : `PIN for ${(st === null || st === void 0 ? void 0 : st.name) || "staff"} must be 4–8 digits.`
				});
				return;
			}
			cleanedStaffPins[sid] = val;
		}
		setIsSavingPins(true);
		setPinControlFeedback(null);
		try {
			await safeSetDoc(doc(db, "settings", "staff_support_auth"), {
				globalPin: cleanGlobal,
				staffPins: cleanedStaffPins,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			const syncJobs = activeStaff.filter((s) => Boolean(cleanedStaffPins[s.id])).map((s) => syncStaffPinEverywhere({
				staffId: s.id,
				phone: s.phone,
				newPin: cleanedStaffPins[s.id]
			}).catch(() => {}));
			if (syncJobs.length > 0) await Promise.all(syncJobs);
			sounds.playSuccess();
			setPinControlFeedback({
				type: "success",
				text: isBn ? "সকল স্টাফের আলাদা পিন ও ডিফল্ট পিন সফলভাবে সংরক্ষিত ও মেইন লগইনের সাথে সিঙ্ক হয়েছে।" : "Staff PINs saved and synced with Main Login."
			});
		} catch {
			setPinControlFeedback({
				type: "error",
				text: isBn ? "পিন সংরক্ষণ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।" : "Failed to save PIN settings."
			});
		} finally {
			setIsSavingPins(false);
		}
	};
	const openChangeOwnPinModal = () => {
		if (!matchedOwnStaff || isAdmin) return;
		sounds.playTap();
		setOwnCurrentPin("");
		setOwnNewPin("");
		setOwnConfirmPin("");
		setOwnPinFeedback(null);
		pushSubViewHistory();
		setIsChangeOwnPinOpen(true);
	};
	const handleChangeOwnPinSubmit = async (e) => {
		e.preventDefault();
		if (!matchedOwnStaff) return;
		const current = ownCurrentPin.trim();
		const nextPin = ownNewPin.trim();
		const confirm = ownConfirmPin.trim();
		if (!current || !nextPin || !confirm) {
			setOwnPinFeedback({
				type: "error",
				text: isBn ? "বর্তমান ও নতুন পিনের সব ঘর পূরণ করুন।" : "Please fill all PIN fields."
			});
			return;
		}
		if (!/^\d{4,8}$/.test(nextPin)) {
			setOwnPinFeedback({
				type: "error",
				text: isBn ? "নতুন পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।" : "New PIN must be 4–8 digits."
			});
			return;
		}
		if (nextPin !== confirm) {
			setOwnPinFeedback({
				type: "error",
				text: isBn ? "নতুন পিন ও নিশ্চিতকরণ পিন মিলছে না।" : "New PIN and confirmation do not match."
			});
			return;
		}
		setIsSavingOwnPin(true);
		setOwnPinFeedback(null);
		try {
			let currentMatched = current === String(staffAuthConfig.staffPins[matchedOwnStaff.id] || staffAuthConfig.globalPin || "1234").trim();
			if (!currentMatched) try {
				const usersSnap = await getDocs(collection(db, "users"));
				const ownPhoneNorm = normalizePhoneNumber(matchedOwnStaff.phone);
				currentMatched = usersSnap.docs.some((d) => {
					const u = d.data();
					if (!u || u.role !== "staff") return false;
					const idOk = String(u.id || d.id) === String(matchedOwnStaff.id);
					const phoneOk = ownPhoneNorm.length >= 6 && normalizePhoneNumber(u.phone) === ownPhoneNorm;
					return (idOk || phoneOk) && String(u.pin || "").trim() === current;
				});
			} catch {}
			if (!currentMatched) {
				setOwnPinFeedback({
					type: "error",
					text: isBn ? "বর্তমান পিনটি সঠিক নয়।" : "Current PIN is incorrect."
				});
				setIsSavingOwnPin(false);
				return;
			}
			await syncStaffPinEverywhere({
				staffId: matchedOwnStaff.id,
				phone: matchedOwnStaff.phone,
				newPin: nextPin
			});
			sounds.playSuccess();
			setDailyFeedback({
				type: "success",
				text: isBn ? "আপনার স্টাফ পিন সফলভাবে পরিবর্তন হয়েছে। এখন নতুন পিন দিয়ে মেইন ও হাজিরা লগইন করতে পারবেন।" : "Your PIN has been updated for both Staff Attendance and Main Login."
			});
			closeSubViewViaBack(() => setIsChangeOwnPinOpen(false));
		} catch {
			setOwnPinFeedback({
				type: "error",
				text: isBn ? "পিন পরিবর্তন করা যায়নি। পুনরায় চেষ্টা করুন।" : "Failed to change PIN."
			});
		} finally {
			setIsSavingOwnPin(false);
		}
	};
	const handleStaffLogout = () => {
		sounds.playTap();
		setStaffSession(null);
		setConfirmDeleteDailyStaffId(null);
		try {
			sessionStorage.removeItem("protyasha_support_staff_session");
		} catch {}
	};
	const handleMarkStatus = async (staff, status, leaveTypeOverride, noteOverride) => {
		if (!canModifyStaffOnDate(staff.id, selectedDate)) {
			sounds.playTap();
			setDailyFeedback({
				type: "error",
				text: !matchedOwnStaff && !isAdmin ? isBn ? "নিজের হাজিরা দিতে প্রথমে স্টাফ লগইন করুন।" : "Please sign in as staff first to mark your attendance." : selectedDate !== todayIso && !isAdmin ? isBn ? "স্টাফ শুধুমাত্র আজকের হাজিরা দিতে বা পরিবর্তন করতে পারবেন।" : "Staff can only mark or change today’s attendance." : isBn ? "আপনি শুধুমাত্র নিজের হাজিরা দিতে পারবেন, অন্য স্টাফেরটা কাজ করবে না।" : "You can only mark your own attendance."
			});
			return;
		}
		const existing = dailyMap.get(staff.id);
		if (existing && existing.status === status && leaveTypeOverride === void 0 && noteOverride === void 0) {
			sounds.playTap();
			setConfirmDeleteDailyStaffId(confirmDeleteDailyStaffId === staff.id ? null : staff.id);
			return;
		}
		sounds.playTap();
		setConfirmDeleteDailyStaffId(null);
		const monthStr = selectedDate.slice(0, 7);
		await onSaveAttendance({
			id: sanitizeRecordId(staff.id, selectedDate),
			staffId: staff.id,
			staffName: staff.name.slice(0, 150),
			staffRole: (staff.role || "").slice(0, 150),
			date: selectedDate,
			month: monthStr,
			status,
			checkInTime: status === "present" || status === "late" || status === "half_day" ? (existing === null || existing === void 0 ? void 0 : existing.checkInTime) || getCurrentTimeLabel() : "",
			leaveType: status === "leave" ? leaveTypeOverride || ((existing === null || existing === void 0 ? void 0 : existing.leaveType) && existing.leaveType !== "none" ? existing.leaveType : "casual") : "none",
			note: noteOverride !== void 0 ? noteOverride.trim().slice(0, 1e3) : (existing === null || existing === void 0 ? void 0 : existing.note) || "",
			recordedBy: activeRecorderName,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	};
	const handleConfirmDeleteDailyAttendance = async (staff, record) => {
		if (!canModifyStaffOnDate(staff.id, record.date)) return;
		setIsDeletingDailyId(record.id);
		try {
			await onDeleteAttendance(record.id);
			sounds.playSuccess();
			setConfirmDeleteDailyStaffId(null);
			setEditingNoteStaffId((prev) => prev === staff.id ? null : prev);
			setDailyFeedback({
				type: "info",
				text: isBn ? `${staff.name}-এর ${record.date === todayIso ? "আজকের" : record.date} হাজিরা মুছে ফেলা হয়েছে।` : `Cleared attendance for ${staff.name}.`
			});
		} finally {
			setIsDeletingDailyId(null);
		}
	};
	const handleMarkAllPresent = async () => {
		if (!canBulkMark || activeStaff.length === 0) return;
		setIsBulkSaving(true);
		try {
			const nowTime = getCurrentTimeLabel();
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const monthStr = selectedDate.slice(0, 7);
			const recordsToWrite = activeStaff.filter((s) => !dailyMap.has(s.id)).map((staff) => ({
				id: sanitizeRecordId(staff.id, selectedDate),
				staffId: staff.id,
				staffName: staff.name.slice(0, 150),
				staffRole: (staff.role || "").slice(0, 150),
				date: selectedDate,
				month: monthStr,
				status: "present",
				checkInTime: nowTime,
				leaveType: "none",
				note: "",
				recordedBy: activeRecorderName,
				updatedAt: nowIso
			}));
			if (recordsToWrite.length > 0) {
				await onSaveBulkAttendance(recordsToWrite);
				sounds.playSuccess();
			}
		} finally {
			setIsBulkSaving(false);
		}
	};
	const handleApplyLeave = async (e) => {
		e.preventDefault();
		const targetStaffId = isAdmin ? leaveStaffId : (matchedOwnStaff === null || matchedOwnStaff === void 0 ? void 0 : matchedOwnStaff.id) || "";
		if (!targetStaffId) {
			setLeaveFeedback(isBn ? isAdmin ? "অনুগ্রহ করে স্টাফ নির্বাচন করুন" : "নিজের ছুটির আবেদন করতে প্রথমে স্টাফ লগইন করুন" : isAdmin ? "Please select a staff member" : "Please log in as staff first to apply for leave");
			return;
		}
		const staff = activeStaff.find((s) => s.id === targetStaffId);
		if (!staff) {
			setLeaveFeedback(isBn ? "অনুগ্রহ করে স্টাফ নির্বাচন করুন" : "Please select a staff member");
			return;
		}
		if (!leaveFromDate || !leaveToDate || leaveFromDate > leaveToDate) {
			setLeaveFeedback(isBn ? "সঠিক তারিখ নির্বাচন করুন" : "Please select valid date range");
			return;
		}
		const dates = [];
		let cursor = leaveFromDate;
		while (cursor <= leaveToDate && dates.length < 31) {
			dates.push(cursor);
			cursor = shiftDateByDays(cursor, 1);
		}
		setIsSavingLeave(true);
		setLeaveFeedback("");
		try {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			await onSaveBulkAttendance(dates.map((d) => ({
				id: sanitizeRecordId(staff.id, d),
				staffId: staff.id,
				staffName: staff.name.slice(0, 150),
				staffRole: (staff.role || "").slice(0, 150),
				date: d,
				month: d.slice(0, 7),
				status: "leave",
				checkInTime: "",
				leaveType,
				note: leaveNote.trim().slice(0, 1e3),
				recordedBy: activeRecorderName,
				updatedAt: nowIso
			})));
			sounds.playSuccess();
			setLeaveNote("");
			setLeaveFeedback(isBn ? `${staff.name}-এর ${toBengaliNumber(dates.length)} দিনের ছুটি সেভ হয়েছে!` : `Saved ${dates.length} leave day(s) for ${staff.name}!`);
			const [ly, lm] = leaveFromDate.split("-").map(Number);
			if (ly && lm) {
				setSelectedYear(ly);
				setSelectedMonthIdx(lm - 1);
			}
		} finally {
			setIsSavingLeave(false);
		}
	};
	const handlePrevMonth = () => {
		sounds.playTap();
		if (selectedMonthIdx === 0) {
			setSelectedMonthIdx(11);
			setSelectedYear((y) => y - 1);
		} else setSelectedMonthIdx((m) => m - 1);
	};
	const handleNextMonth = () => {
		sounds.playTap();
		if (selectedMonthIdx === 11) {
			setSelectedMonthIdx(0);
			setSelectedYear((y) => y + 1);
		} else setSelectedMonthIdx((m) => m + 1);
	};
	const handleExportMonthlyExcel = () => {
		sounds.playSuccess();
		const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <tr><th colspan="12" style="font-size:16px;font-weight:bold;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — স্টাফ হাজিরা ও ছুটি শীট (${`${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`})</th></tr>
          <tr style="background:#f1f5f9;font-weight:bold;">
            <th>স্টাফ নাম</th>
            <th>পদবী</th>
            <th>উপস্থিত</th>
            <th>লেট</th>
            <th>অর্ধ-দিন</th>
            <th>বেতনসহ ছুটি</th>
            <th>বিনা বেতন ছুটি</th>
            <th>অনুপস্থিত</th>
            <th>উপস্থিতি %</th>
            <th>মূল বেতন (৳)</th>
            <th>কর্তন (৳)</th>
            <th>সম্ভাব্য প্রদেয় (৳)</th>
          </tr>
          ${monthlyStats.map((s) => `
      <tr>
        <td>${s.staff.name}</td>
        <td>${s.staff.role || "-"}</td>
        <td>${s.present}</td>
        <td>${s.late}</td>
        <td>${s.halfDay}</td>
        <td>${s.paidLeave}</td>
        <td>${s.unpaidLeave}</td>
        <td>${s.absent}</td>
        <td>${s.attendanceRate}%</td>
        <td>${s.baseSalary}</td>
        <td>${s.deduction}</td>
        <td>${s.estimatedPayable}</td>
      </tr>`).join("")}
        </table>
      </body>
      </html>`;
		const blob = new Blob(["﻿" + excelHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `protyasha_attendance_${MONTHS_EN[selectedMonthIdx]}_${selectedYear}.xls`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handlePrintMonthlyPdf = () => {
		sounds.playSuccess();
		const monthTitle = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
		printHtmlViaIframe(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>স্টাফ হাজিরা ও বেতন রিপোর্ট - ${monthTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700;800&display=swap');
          body { font-family: 'Hind Siliguri', Arial, sans-serif; padding: 20px; color: #0f172a; }
          h1 { margin: 0; text-align: center; font-size: 24px; font-weight: 800; }
          .sub { text-align: center; color: #475569; font-size: 13px; margin: 4px 0 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
          th, td { border: 1px solid #94a3b8; padding: 7px 8px; text-align: center; }
          th { background: #f1f5f9; font-weight: 700; }
          .foot { margin-top: 48px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #475569; }
          .sig { border-top: 1px solid #475569; width: 160px; text-align: center; padding-top: 4px; }
        </style>
      </head>
      <body>
        <h1>প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
        <div class="sub">মাসিক স্টাফ হাজিরা, ছুটি ও বেতন সমন্বয় শীট — ${monthTitle}</div>
        <table>
          <thead>
            <tr>
              <th>স্টাফ</th>
              <th>উপস্থিত</th>
              <th>লেট</th>
              <th>অর্ধ-দিন</th>
              <th>ছুটি</th>
              <th>অনুপস্থিত</th>
              <th>হার</th>
              <th>মূল বেতন</th>
              <th>কর্তন</th>
              <th>সম্ভাব্য প্রদেয়</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyStats.map((s) => `
      <tr>
        <td style="text-align:left;font-weight:700;">${s.staff.name}<div style="font-size:11px;color:#64748b;font-weight:500;">${s.staff.role || ""}</div></td>
        <td>${toBengaliNumber(s.present)}</td>
        <td>${toBengaliNumber(s.late)}</td>
        <td>${toBengaliNumber(s.halfDay)}</td>
        <td>${toBengaliNumber(s.totalLeave)}</td>
        <td style="color:#dc2626;font-weight:700;">${toBengaliNumber(s.absent)}</td>
        <td style="font-weight:700;">${toBengaliNumber(s.attendanceRate)}%</td>
        <td style="text-align:right;">৳${toBengaliNumber(s.baseSalary)}</td>
        <td style="text-align:right;color:#dc2626;">৳${toBengaliNumber(s.deduction)}</td>
        <td style="text-align:right;font-weight:800;color:#059669;">৳${toBengaliNumber(s.estimatedPayable)}</td>
      </tr>`).join("") || "<tr><td colspan=\"10\">কোনো স্টাফ পাওয়া যায়নি</td></tr>"}
          </tbody>
        </table>
        <div class="foot">
          <div>কম্পিউটার জেনারেটেড হাজিরা রিপোর্ট</div>
          <div class="sig">কর্তৃপক্ষের স্বাক্ষর</div>
        </div>
      </body>
      </html>`);
	};
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4.5 h-4.5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate",
								children: isBn ? "স্টাফ হাজিরা ও ছুটি ম্যানেজমেন্ট" : "Staff Attendance & Leaves"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate",
								children: isBn ? `মোট ${toBengaliNumber(activeStaff.length)} জন স্টাফ • রিয়েল টাইম সিঙ্ক` : `${activeStaff.length} Active Staff • Live Sync`
							})]
						})
					]
				}), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: openPinControlModal,
					className: "h-9 px-2.5 sm:px-3 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অ্যাডমিন পিন কন্ট্রোল" : "Admin PIN Control" })]
				}) : !isVisitor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [matchedOwnStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openChangeOwnPinModal,
						className: "h-9 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer",
						title: isBn ? "নিজের স্টাফ পিন পরিবর্তন করুন" : "Change own staff PIN",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: isBn ? "পিন পরিবর্তন" : "Change PIN"
						})]
					}), matchedMainStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-9 px-2.5 sm:px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-[110px] truncate",
							children: matchedMainStaff.name
						})]
					}) : staffSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleStaffLogout,
						title: isBn ? "স্টাফ সেশন লগআউট" : "Sign out staff session",
						className: "h-9 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer active:scale-95",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-[85px] truncate",
								children: staffSession.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3 h-3 text-rose-500 shrink-0" })
						]
					}) : !matchedOwnStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: openStaffLoginModal,
						className: "h-9 px-2.5 sm:px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ লগইন" : "Staff Login" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-9 px-2.5 sm:px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-[110px] truncate",
							children: matchedOwnStaff.name
						})]
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800",
						children: [
							{
								id: "daily",
								bn: "দৈনিক হাজিরা",
								en: "Daily"
							},
							{
								id: "monthly",
								bn: "মাসিক ও বেতন",
								en: "Monthly"
							},
							{
								id: "leaves",
								bn: "ছুটি ম্যানেজমেন্ট",
								en: "Leaves"
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								if (tab.id !== "daily" && activeTab === "daily") pushSubViewHistory();
								setActiveTab(tab.id);
							},
							className: `h-10 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
							children: isBn ? tab.bn : tab.en
						}, tab.id))
					}),
					activeTab === "daily" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedDate((d) => shiftDateByDays(d, -1));
										},
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4.5 h-4.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: selectedDate,
												onChange: (e) => e.target.value && setSelectedDate(e.target.value),
												className: "bg-transparent text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
											}),
											selectedDate !== todayIso && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setSelectedDate(todayIso);
												},
												className: "px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold cursor-pointer",
												children: isBn ? "আজ" : "Today"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedDate((d) => shiftDateByDays(d, 1));
										},
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4.5 h-4.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-4 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-300",
											children: isBn ? "উপস্থিত" : "Present"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums",
											children: formatNum(dailySummary.present + dailySummary.halfDay)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-amber-800 dark:text-amber-300",
											children: isBn ? "লেট" : "Late"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums",
											children: formatNum(dailySummary.late)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-indigo-700 dark:text-indigo-300",
											children: isBn ? "ছুটি" : "Leave"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums",
											children: formatNum(dailySummary.leave)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-rose-700 dark:text-rose-300",
											children: isBn ? "অনুপস্থিত" : "Absent"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums",
											children: formatNum(dailySummary.absent)
										})]
									})
								]
							}),
							!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-2xl border flex items-center justify-between gap-2.5 flex-wrap ${matchedOwnStaff ? "bg-teal-50/80 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/60" : "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 min-w-0 flex-1",
									children: [matchedOwnStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs font-extrabold ${matchedOwnStaff ? "text-teal-800 dark:text-teal-200" : "text-amber-900 dark:text-amber-200"}`,
											children: matchedOwnStaff ? isBn ? `নিজস্ব হাজিরা সক্রিয়: ${matchedOwnStaff.name}` : `Self Attendance Active: ${matchedOwnStaff.name}` : isBn ? "হাজিরা দিতে স্টাফ লগইন প্রয়োজন" : "Staff Login Required to Mark Attendance"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-[11px] font-medium mt-0.5 ${matchedOwnStaff ? "text-teal-700/90 dark:text-teal-300/90" : "text-amber-800/90 dark:text-amber-300/90"}`,
											children: matchedOwnStaff ? selectedDate === todayIso ? isBn ? "আপনি শুধু নিজের আজকের হাজিরা দিতে ও ভুলে চাপ পড়লে মুছতে পারবেন। অন্য স্টাফেরটা লক করা আছে।" : "You can mark or undo your own attendance for today. Other staff cards are locked." : isBn ? "স্টাফ শুধুমাত্র আজকের হাজিরা দিতে বা মুছতে পারবেন। আগের তারিখ শুধু দেখার জন্য।" : "Staff can only mark or undo today’s attendance. Past dates are view-only." : isBn ? "আপনার স্টাফ নাম্বার/কোড ও পিন দিয়ে লগইন করলে শুধু আপনার হাজিরা কার্ড আনলক হবে।" : "Log in with your staff phone/code and PIN to unlock your own attendance card."
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 shrink-0 flex-wrap",
									children: [
										matchedOwnStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: openChangeOwnPinModal,
											className: "h-8 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পিন পরিবর্তন" : "Change PIN" })]
										}),
										!matchedOwnStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: openStaffLoginModal,
											className: "h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ লগইন" : "Staff Login" })]
										}),
										matchedOwnStaff && selectedDate !== todayIso && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												setSelectedDate(todayIso);
											},
											className: "h-8 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-extrabold shrink-0 cursor-pointer",
											children: isBn ? "আজকের তারিখে যান" : "Go to Today"
										})
									]
								})]
							}),
							dailyFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-150 ${dailyFeedback.type === "error" ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300" : dailyFeedback.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dailyFeedback.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDailyFeedback(null),
									className: "p-0.5 rounded hover:bg-black/5 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})]
							}),
							canBulkMark && activeStaff.length > 0 && dailySummary.unmarked > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: isBulkSaving,
								onClick: handleMarkAllPresent,
								className: "w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBulkSaving ? isBn ? "সেভ হচ্ছে..." : "Saving..." : isBn ? `বাকি ${toBengaliNumber(dailySummary.unmarked)} জনকে এক ক্লিকে উপস্থিত দিন` : `Mark ${dailySummary.unmarked} Unmarked Staff Present` })]
							}),
							activeStaff.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-10 h-10 text-slate-400 mx-auto mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-slate-700 dark:text-slate-300",
										children: isBn ? "কোনো স্টাফ অ্যাকাউন্ট পাওয়া যায়নি" : "No staff accounts found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
										children: isBn ? "প্রথমে \"স্টাফ হিসাব\" থেকে স্টাফ যোগ করুন।" : "Add staff members first in Staff Management."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 lg:grid-cols-2 gap-3 items-start",
								children: orderedDailyStaff.map((staff) => {
									const rec = dailyMap.get(staff.id);
									const isEditingNote = editingNoteStaffId === staff.id;
									const canEditThisStaff = canModifyStaffOnDate(staff.id, selectedDate);
									const isOwnCard = isOwnStaffId(staff.id);
									const isLockedOtherStaff = !isAdmin && !isOwnCard;
									const isConfirmingDelete = confirmDeleteDailyStaffId === staff.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-3.5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 transition-all ${isOwnCard ? "border-teal-400/90 dark:border-teal-600/80 ring-1 ring-teal-500/20" : "border-slate-200/90 dark:border-slate-800"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => openStaffDetail(staff.id),
													className: "flex items-center gap-2.5 min-w-0 flex-1 text-left group cursor-pointer rounded-xl -m-1 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors",
													children: [staff.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: staff.avatarUrl,
														alt: staff.name,
														className: "w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-sm shrink-0",
														children: (staff.name || "S").slice(0, 1).toUpperCase()
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 flex-wrap",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
																	className: "text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors",
																	children: staff.name
																}),
																isOwnCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold shrink-0",
																	children: isBn ? "আপনার কার্ড" : "Your Card"
																}),
																isLockedOtherStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold inline-flex items-center gap-0.5 shrink-0",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-2.5 h-2.5" }), isBn ? "লক" : "Locked"]
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
															children: [staff.role || (isBn ? "স্টাফ" : "Staff"), (rec === null || rec === void 0 ? void 0 : rec.checkInTime) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "ml-2 inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), rec.checkInTime]
															})]
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 shrink-0",
													children: [canEditThisStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															sounds.playTap();
															if (isEditingNote) setEditingNoteStaffId(null);
															else {
																setEditingNoteStaffId(staff.id);
																setDraftNote((rec === null || rec === void 0 ? void 0 : rec.note) || "");
															}
														},
														className: `h-8 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${(rec === null || rec === void 0 ? void 0 : rec.note) ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "hidden sm:inline",
															children: isBn ? "নোট" : "Note"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => openStaffDetail(staff.id),
														title: isBn ? "বিস্তারিত ও মাসিক PDF রিপোর্ট" : "Details & Monthly PDF",
														className: "h-8 px-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer active:scale-95 transition-all",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বিস্তারিত" : "Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-5 gap-1.5",
												children: STATUS_META.map((st) => {
													const isActive = (rec === null || rec === void 0 ? void 0 : rec.status) === st.id;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: !canEditThisStaff,
														onClick: () => handleMarkStatus(staff, st.id),
														className: `h-9 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all whitespace-nowrap ${isActive ? `${st.activeClass} shadow-xs` : "bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"} ${canEditThisStaff ? "cursor-pointer hover:brightness-95 active:scale-95" : "opacity-45 cursor-not-allowed"}`,
														children: isBn ? st.bn : st.en
													}, st.id);
												})
											}),
											rec && canEditThisStaff && !isConfirmingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2 pt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400",
													children: isBn ? "ভুলে চাপ পড়েছে? আজকের হাজিরা মুছতে পারবেন" : "Tapped by mistake? You can undo this attendance"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														sounds.playTap();
														setConfirmDeleteDailyStaffId(staff.id);
													},
													className: "h-7 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/70 text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হাজিরা মুছুন" : "Undo / Clear" })]
												})]
											}),
											rec && canEditThisStaff && isConfirmingDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2 animate-in fade-in duration-150",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-rose-700 dark:text-rose-300",
													children: isBn ? `${selectedDate === todayIso ? "আজকের" : selectedDate} হাজিরা মুছে ফেলবেন?` : "Clear this attendance entry?"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setConfirmDeleteDailyStaffId(null),
														className: "h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer",
														children: isBn ? "না" : "No"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: isDeletingDailyId === rec.id,
														onClick: () => handleConfirmDeleteDailyAttendance(staff, rec),
														className: "h-7 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-extrabold cursor-pointer",
														children: isDeletingDailyId === rec.id ? isBn ? "মুছছে..." : "Clearing..." : isBn ? "হ্যাঁ, মুছুন" : "Yes, Clear"
													})]
												})]
											}),
											(rec === null || rec === void 0 ? void 0 : rec.status) === "leave" && canEditThisStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 flex-wrap pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mr-1",
													children: isBn ? "ছুটির ধরন:" : "Leave Type:"
												}), LEAVE_TYPES.map((lt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleMarkStatus(staff, "leave", lt.id),
													className: `px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${(rec.leaveType || "casual") === lt.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"}`,
													children: isBn ? lt.bn : lt.en
												}, lt.id))]
											}),
											(rec === null || rec === void 0 ? void 0 : rec.note) && !isEditingNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl",
												children: rec.note
											}),
											isEditingNote && canEditThisStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: draftNote,
													onChange: (e) => setDraftNote(e.target.value),
													placeholder: isBn ? "হাজিরা বা ছুটির মন্তব্য লিখুন..." : "Add attendance note...",
													className: "flex-1 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: async () => {
														await handleMarkStatus(staff, (rec === null || rec === void 0 ? void 0 : rec.status) || "present", rec === null || rec === void 0 ? void 0 : rec.leaveType, draftNote);
														setEditingNoteStaffId(null);
													},
													className: "h-9 px-3.5 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer",
													children: isBn ? "সেভ" : "Save"
												})]
											})
										]
									}, staff.id);
								})
							})
						]
					}),
					activeTab === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handlePrevMonth,
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4.5 h-4.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-teal-600 dark:text-teal-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-extrabold text-slate-900 dark:text-white",
											children: isBn ? `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}` : `${MONTHS_EN[selectedMonthIdx]} ${selectedYear}`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleNextMonth,
										className: "w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4.5 h-4.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handlePrintMonthlyPdf,
									className: "h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 active:scale-98 transition-all cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হাজিরা PDF প্রিন্ট" : "Print PDF Sheet" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleExportMonthlyExcel,
									className: "h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "Excel (.xls) ডাউনলোড" : "Download Excel" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "গড় উপস্থিতি" : "Avg Rate"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-lg font-black text-teal-600 dark:text-teal-400 tabular-nums mt-0.5",
											children: [formatNum(monthlyTotals.avgRate), "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "মোট উপস্থিত দিন" : "Present Days"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5",
											children: formatNum(monthlyTotals.totalPresent)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "মোট ছুটি / অনুপস্থিত" : "Leave / Absent"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums mt-0.5",
											children: [
												formatNum(monthlyTotals.totalLeaves),
												" / ",
												formatNum(monthlyTotals.totalAbsent)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "সম্ভাব্য মোট বেতন" : "Est. Payroll"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5",
											children: ["৳", formatNum(monthlyTotals.totalPayable)]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1",
									children: isBn ? "প্রতিটি স্টাফের মাসিক বিস্তারিত দেখতে কার্ডে ট্যাপ করুন অথবা সরাসরি PDF / প্রিন্ট বাটনে চাপ দিন" : "Tap any staff card for full monthly detail or press PDF / Print directly"
								}), monthlyStats.map((item) => {
									const showSalaryForItem = isAdmin || isOwnStaffId(item.staff.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										role: "button",
										tabIndex: 0,
										onClick: () => openStaffDetail(item.staff.id),
										onKeyDown: (e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												openStaffDetail(item.staff.id);
											}
										},
										className: "w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs space-y-3 transition-all active:scale-[0.99] cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [item.staff.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: item.staff.avatarUrl,
														alt: item.staff.name,
														className: "w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-xs shrink-0",
														children: (item.staff.name || "S").slice(0, 1).toUpperCase()
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "text-sm font-extrabold text-slate-900 dark:text-white truncate",
															children: item.staff.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
															children: item.staff.role
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-black tabular-nums",
														children: [formatNum(item.attendanceRate), "%"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-400" })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-5 gap-1.5 text-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-300",
															children: isBn ? "উপস্থিত" : "Pres"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-black text-emerald-700 dark:text-emerald-300 tabular-nums",
															children: formatNum(item.present)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold text-amber-800 dark:text-amber-300",
															children: isBn ? "লেট" : "Late"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-black text-amber-700 dark:text-amber-300 tabular-nums",
															children: formatNum(item.late)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 rounded-xl bg-sky-50/70 dark:bg-sky-950/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold text-sky-700 dark:text-sky-300",
															children: isBn ? "অর্ধ-দিন" : "Half"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-black text-sky-700 dark:text-sky-300 tabular-nums",
															children: formatNum(item.halfDay)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold text-indigo-700 dark:text-indigo-300",
															children: isBn ? "ছুটি" : "Leave"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-black text-indigo-700 dark:text-indigo-300 tabular-nums",
															children: formatNum(item.totalLeave)
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] font-bold text-rose-700 dark:text-rose-300",
															children: isBn ? "অনুপস্থিত" : "Abs"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm font-black text-rose-700 dark:text-rose-300 tabular-nums",
															children: formatNum(item.absent)
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs gap-2 flex-wrap",
												children: [showSalaryForItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-slate-600 dark:text-slate-400",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-3.5 h-3.5 text-slate-400" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
															isBn ? "প্রদেয়:" : "Payable:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
																className: "text-emerald-600 dark:text-emerald-400 tabular-nums",
																children: ["৳", formatNum(item.estimatedPayable)]
															})
														] }),
														item.deduction > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-rose-600 dark:text-rose-400 font-bold tabular-nums",
															children: [
																"(-৳",
																formatNum(item.deduction),
																")"
															]
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400",
													children: isBn ? `মোট চিহ্নিত: ${toBengaliNumber(item.markedDays)} দিন` : `Marked: ${item.markedDays} days`
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 shrink-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 px-2.5 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বিস্তারিত" : "Details" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: (e) => {
															e.stopPropagation();
															openStaffPrintPreview(item.staff.id);
														},
														className: "px-2.5 h-8 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "PDF / প্রিন্ট" : "PDF / Print" })]
													})]
												})]
											})
										]
									}, item.staff.id);
								})]
							})
						]
					}),
					activeTab === "leaves" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [isAdmin || matchedOwnStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleApplyLeave,
							className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-extrabold text-slate-900 dark:text-white",
										children: isBn ? "নতুন ছুটি এন্ট্রি করুন" : "Record Staff Leave"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: isAdmin ? isBn ? "একদিন বা একাধিক দিনের ছুটি একসাথে যোগ করুন" : "Add single or multi-day leave" : isBn ? "শুধুমাত্র নিজের ছুটি যোগ করতে পারবেন" : "You can only submit leave for yourself"
									})] })]
								}),
								leaveFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300",
									children: leaveFeedback
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "স্টাফ নির্বাচন *" : "Select Staff *"
									}), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										required: true,
										value: leaveStaffId,
										onChange: (e) => setLeaveStaffId(e.target.value),
										className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: isBn ? "স্টাফ বাছাই করুন..." : "Choose staff..."
										}), activeStaff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.id,
											children: [
												s.name,
												" (",
												s.role,
												")"
											]
										}, s.id))]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-11 px-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-sm font-extrabold text-teal-800 dark:text-teal-200 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: matchedOwnStaff === null || matchedOwnStaff === void 0 ? void 0 : matchedOwnStaff.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] px-1.5 py-0.5 rounded bg-teal-600 text-white shrink-0",
											children: isBn ? "নিজস্ব" : "Self"
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "ছুটির ধরন" : "Leave Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: leaveType,
										onChange: (e) => setLeaveType(e.target.value),
										className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white",
										children: LEAVE_TYPES.map((lt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: lt.id,
											children: isBn ? lt.bn : lt.en
										}, lt.id))
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "শুরুর তারিখ" : "From Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										required: true,
										value: leaveFromDate,
										onChange: (e) => {
											setLeaveFromDate(e.target.value);
											if (e.target.value > leaveToDate) setLeaveToDate(e.target.value);
										},
										className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "শেষ তারিখ" : "To Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										required: true,
										min: leaveFromDate,
										value: leaveToDate,
										onChange: (e) => setLeaveToDate(e.target.value),
										className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "ছুটির কারণ / মন্তব্য" : "Reason / Note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: leaveNote,
									onChange: (e) => setLeaveNote(e.target.value),
									placeholder: isBn ? "যেমন: পারিবারিক জরুরি কাজ / জ্বর" : "e.g. Family emergency / fever",
									className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: isSavingLeave,
									className: "w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSavingLeave ? isBn ? "সেভ হচ্ছে..." : "Saving..." : isBn ? "ছুটি অনুমোদন ও সেভ করুন" : "Approve & Save Leave" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-amber-800 dark:text-amber-200",
								children: isBn ? "নিজের ছুটি এন্ট্রি করতে স্টাফ লগইন করুন।" : "Sign in as staff to submit your own leave."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: openStaffLoginModal,
								className: "h-9 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ লগইন" : "Staff Login" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-extrabold text-slate-700 dark:text-slate-300",
									children: isBn ? `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}-এর ছুটির তালিকা (${toBengaliNumber(monthlyLeaveRecords.length)})` : `Leaves in ${MONTHS_EN[selectedMonthIdx]} ${selectedYear} (${monthlyLeaveRecords.length})`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handlePrevMonth,
										className: "w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleNextMonth,
										className: "w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })
									})]
								})]
							}), monthlyLeaveRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-medium text-slate-500 dark:text-slate-400",
								children: isBn ? "এই মাসে কোনো ছুটির রেকর্ড নেই।" : "No leave records for this month."
							}) : monthlyLeaveRecords.map((rec) => {
								const isConfirming = confirmDeleteLeaveId === rec.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: "text-sm font-extrabold text-slate-900 dark:text-white truncate",
													children: rec.staffName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 mt-0.5 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400",
														children: rec.date
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[10px] font-bold px-2 py-0.5 rounded-md ${rec.leaveType === "unpaid" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"}`,
														children: getLeaveTypeLabel(rec.leaveType)
													})]
												})]
											}), (isAdmin || canModifyStaffOnDate(rec.staffId, rec.date)) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setConfirmDeleteLeaveId(isConfirming ? null : rec.id);
												},
												className: "w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})]
										}),
										rec.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl",
											children: rec.note
										}),
										isConfirming && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-rose-700 dark:text-rose-300",
												children: isBn ? "ছুটির এন্ট্রি মুছবেন?" : "Delete this leave entry?"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setConfirmDeleteLeaveId(null),
													className: "h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer",
													children: isBn ? "না" : "No"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: async () => {
														await onDeleteAttendance(rec.id);
														setConfirmDeleteLeaveId(null);
													},
													className: "h-7 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer",
													children: isBn ? "হ্যাঁ" : "Yes"
												})]
											})]
										})
									]
								}, rec.id);
							})]
						})]
					})
				]
			}),
			selectedDetailStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffAttendanceDetailView, {
				staff: selectedDetailStaff,
				attendanceRecords,
				lang,
				selectedMonthIdx,
				selectedYear,
				todayIso,
				isOwnProfile: isOwnStaffId(selectedDetailStaff.id),
				canViewSalary: isAdmin || isOwnStaffId(selectedDetailStaff.id),
				canDeleteDate: (dateStr) => canModifyStaffOnDate(selectedDetailStaff.id, dateStr),
				onChangeMonth: (mIdx, yr) => {
					setSelectedMonthIdx(mIdx);
					setSelectedYear(yr);
				},
				onDeleteAttendance,
				onOpenPrintPreview: () => openStaffPrintPreview(selectedDetailStaff.id),
				onClose: () => closeSubViewViaBack(() => setSelectedDetailStaffId(null))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffMonthlyPrintPreviewModal, {
				isOpen: Boolean(printPreviewStaff),
				staff: printPreviewStaff,
				attendanceRecords,
				selectedMonthIdx,
				selectedYear,
				canViewSalary: Boolean(printPreviewStaff && (isAdmin || isOwnStaffId(printPreviewStaff.id))),
				lang,
				onClose: () => closeSubViewViaBack(() => setPrintPreviewStaffId(null))
			}),
			isStaffLoginOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4.5 h-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white",
								children: isBn ? "স্টাফ হাজিরা লগইন" : "Staff Attendance Login"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: isBn ? "নিজের হাজিরা দেওয়ার জন্য যাচাই করুন" : "Verify to unlock your own attendance"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsStaffLoginOpen(false)),
							className: "w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleStaffLoginSubmit,
						className: "p-5 space-y-3.5",
						children: [
							staffLoginError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300",
								children: staffLoginError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "স্টাফ মোবাইল নাম্বার / কোড / নাম" : "Staff Phone / Code / Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: staffLoginIdentifier,
								onChange: (e) => setStaffLoginIdentifier(e.target.value),
								placeholder: isBn ? "যেমন: 017XXXXXXXX" : "e.g. 017XXXXXXXX",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "স্টাফ পিন (PIN)" : "Staff PIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								inputMode: "numeric",
								required: true,
								value: staffLoginPin,
								onChange: (e) => setStaffLoginPin(e.target.value),
								placeholder: "••••",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isVerifyingStaff,
								className: "w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm shadow-teal-600/20 active:scale-[0.99] transition-all cursor-pointer",
								children: isVerifyingStaff ? isBn ? "যাচাই হচ্ছে..." : "Verifying..." : isBn ? "স্টাফ লগইন করুন" : "Sign In as Staff"
							})
						]
					})]
				})
			}),
			isAdmin && isPinControlOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[72] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4.5 h-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-extrabold text-slate-900 dark:text-white truncate",
									children: isBn ? "অ্যাডমিন স্টাফ পিন কন্ট্রোল" : "Admin Staff PIN Control"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
									children: isBn ? "প্রতিটি স্টাফের আলাদা হাজিরা ও মেইন লগইন পিন সেট করুন" : "Set per-staff attendance & main login PINs"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsPinControlOpen(false)),
							className: "w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveAdminPinControl,
						className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",
						children: [
							pinControlFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-xl border text-xs font-bold ${pinControlFeedback.type === "error" ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300" : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"}`,
								children: pinControlFeedback.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-extrabold text-slate-800 dark:text-slate-200",
											children: isBn ? "ডিফল্ট গ্লোবাল স্টাফ পিন (৪-৮ সংখ্যা)" : "Default Global Staff PIN (4–8 digits)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setShowPinControlChars((v) => !v),
											className: "text-[11px] font-bold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1 cursor-pointer",
											children: [showPinControlChars ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showPinControlChars ? isBn ? "লুকান" : "Hide" : isBn ? "দেখুন" : "Show" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showPinControlChars ? "text" : "password",
										inputMode: "numeric",
										maxLength: 8,
										value: draftGlobalPin,
										onChange: (e) => setDraftGlobalPin(e.target.value.replace(/[^0-9]/g, "")),
										placeholder: "1234",
										className: "w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-500 dark:text-slate-400",
										children: isBn ? "যে স্টাফের আলাদা পিন ফাঁকা রাখা হবে, তার জন্য এই ডিফল্ট পিন কাজ করবে।" : "Used as fallback for any staff without a custom per-staff PIN."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-extrabold text-slate-800 dark:text-slate-200",
											children: isBn ? `আলাদা আলাদা স্টাফ পিন (${toBengaliNumber(activeStaff.length)} জন)` : `Individual Staff PINs (${activeStaff.length})`
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pinSearchQuery,
										onChange: (e) => setPinSearchQuery(e.target.value),
										placeholder: isBn ? "স্টাফের নাম বা মোবাইল দিয়ে খুঁজুন..." : "Search staff name or phone...",
										className: "w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 max-h-60 overflow-y-auto pr-1",
										children: activeStaff.filter((s) => {
											const q = pinSearchQuery.trim().toLowerCase();
											if (!q) return true;
											return (s.name || "").toLowerCase().includes(q) || (s.phone || "").toLowerCase().includes(q) || (s.userCode || "").toLowerCase().includes(q);
										}).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-extrabold text-slate-900 dark:text-white truncate",
													children: s.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate",
													children: s.phone || s.userCode || s.role
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showPinControlChars ? "text" : "password",
												inputMode: "numeric",
												maxLength: 8,
												value: draftStaffPins[s.id] ?? "",
												onChange: (e) => {
													const val = e.target.value.replace(/[^0-9]/g, "");
													setDraftStaffPins((prev) => ({
														...prev,
														[s.id]: val
													}));
												},
												placeholder: isBn ? `ডিফল্ট (${draftGlobalPin || "1234"})` : `Default (${draftGlobalPin || "1234"})`,
												className: "w-32 h-9 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold tracking-widest text-center text-slate-900 dark:text-white"
											})]
										}, s.id))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => closeSubViewViaBack(() => setIsPinControlOpen(false)),
									className: "flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer",
									children: isBn ? "বন্ধ করুন" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSavingPins,
									className: "flex-1 h-11 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm cursor-pointer",
									children: isSavingPins ? isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." : isBn ? "পিন সেটিংস সেভ করুন" : "Save PIN Settings"
								})]
							})
						]
					})]
				})
			}),
			!isAdmin && matchedOwnStaff && isChangeOwnPinOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[72] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4.5 h-4.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white",
								children: isBn ? "নিজের স্টাফ পিন পরিবর্তন" : "Change Own Staff PIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]",
								children: matchedOwnStaff.name
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => closeSubViewViaBack(() => setIsChangeOwnPinOpen(false)),
							className: "w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleChangeOwnPinSubmit,
						className: "p-5 space-y-3",
						children: [
							ownPinFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2.5 rounded-xl border text-xs font-bold ${ownPinFeedback.type === "error" ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300" : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"}`,
								children: ownPinFeedback.text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400",
									children: isBn ? "পিন ৪-৮ সংখ্যার হতে হবে (মেইন ও হাজিরা লগইন একই থাকবে)" : "4–8 digits (synced with Main Login)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowOwnPinChars((v) => !v),
									className: "text-[11px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer",
									children: showOwnPinChars ? isBn ? "লুকান" : "Hide" : isBn ? "দেখুন" : "Show"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "বর্তমান পিন *" : "Current PIN *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showOwnPinChars ? "text" : "password",
								inputMode: "numeric",
								maxLength: 8,
								required: true,
								value: ownCurrentPin,
								onChange: (e) => setOwnCurrentPin(e.target.value.replace(/[^0-9]/g, "")),
								placeholder: "••••",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "নতুন পিন (৪-৮ সংখ্যা) *" : "New PIN (4–8 digits) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showOwnPinChars ? "text" : "password",
								inputMode: "numeric",
								maxLength: 8,
								required: true,
								value: ownNewPin,
								onChange: (e) => setOwnNewPin(e.target.value.replace(/[^0-9]/g, "")),
								placeholder: "••••",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: isBn ? "নতুন পিন পুনরায় লিখুন *" : "Confirm New PIN *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showOwnPinChars ? "text" : "password",
								inputMode: "numeric",
								maxLength: 8,
								required: true,
								value: ownConfirmPin,
								onChange: (e) => setOwnConfirmPin(e.target.value.replace(/[^0-9]/g, "")),
								placeholder: "••••",
								className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSavingOwnPin,
								className: "w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm cursor-pointer",
								children: isSavingOwnPin ? isBn ? "পরিবর্তন হচ্ছে..." : "Updating..." : isBn ? "নতুন পিন সংরক্ষণ করুন" : "Save New PIN"
							})
						]
					})]
				})
			})
		]
	});
};
//#endregion
export { StaffAttendanceModal };
