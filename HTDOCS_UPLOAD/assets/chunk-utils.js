import { I as __vitePreload } from "./app.js";
//#region src/portals/billManager/constants.ts
var ALL_MONTHS = [
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
var NET_BILL_LINKS = {
	জানুয়ারি: "",
	ফেব্রুয়ারি: "",
	মার্চ: "",
	এপ্রিল: "https://docs.google.com/spreadsheets/d/1JzUL1DOA_ubXONu9PhpCfo9oKeFj__o4oCGeeksV-pA/export?format=xlsx",
	মে: "https://docs.google.com/spreadsheets/d/1nSM8fZUwHxUSZQc88u8Oaquch21226fYaC9n85NV3G0/export?format=xlsx",
	জুন: "https://docs.google.com/spreadsheets/d/1cPxErMlxd24-YJPN6mBmA-3xPUjG_Ql3lMXEL8dFPzY/export?format=xlsx",
	জুলাই: "https://docs.google.com/spreadsheets/d/1LWGmlA0yJwh6v1hQhpx4RrFeFBb_zW51D3GPehme-7s/export?format=xlsx",
	আগস্ট: "https://docs.google.com/spreadsheets/d/1gZoIiCAYhUZW5nSQCUb6OoNDiNY-087JafIQGr0JaZA/export?format=xlsx",
	সেপ্টেম্বর: "https://docs.google.com/spreadsheets/d/13OcS4yagT4bQNlrY-NuG592QVw9-JxIqntDFVO1zNt8/export?format=xlsx",
	অক্টোবর: "https://docs.google.com/spreadsheets/d/1BeTi5KkxDB9wLM7rclo131xLnMadt4BNU1hO-AkcAHw/export?format=xlsx",
	নভেম্বর: "https://docs.google.com/spreadsheets/d/1tU_5ybOZR5Qk2ypcmTH0ET6f3mUxOtwSANYIrFgm1Ns/export?format=xlsx",
	ডিসেম্বর: ""
};
var DIS_BILL_LINKS = {
	জানুয়ারি: "",
	ফেব্রুয়ারি: "",
	মার্চ: "",
	এপ্রিল: "https://docs.google.com/spreadsheets/d/1FjkMU78ge41qPdHa40byxscAo7zJHMj-uB6M1jKGtQM/export?format=xlsx",
	মে: "https://docs.google.com/spreadsheets/d/1ai1RicItkQIl4_hpOhpP-olKc5FZLLrwLSKbYVFaS-M/export?format=xlsx",
	জুন: "https://docs.google.com/spreadsheets/d/186olqasPT2CV0Feqs4OUOsdkbWSsA6is6E-faFNVqxI/export?format=xlsx",
	জুলাই: "https://docs.google.com/spreadsheets/d/1Kzz2ac6SbeJgUyanm8YRVHKmMD3Cux-PfOSIsvurzAk/export?format=xlsx",
	আগস্ট: "https://docs.google.com/spreadsheets/d/1h8v6TiQJeberx9R6VGTcQu7t6LiudOKrBS9WVqA2cZ0/export?format=xlsx",
	সেপ্টেম্বর: "https://docs.google.com/spreadsheets/d/1XntdO25UdT-40zJcPSONY_pVYborJiQ4YCBYjMM_8uE/export?format=xlsx",
	অক্টোবর: "https://docs.google.com/spreadsheets/d/1EFOy9pKsVnB7Nfkdn9bkUNtClE1mn3Cw16ycg1__f4I/export?format=xlsx",
	নভেম্বর: "",
	ডিসেম্বর: ""
};
var NET_CONN_LINKS = {
	মে: "https://docs.google.com/spreadsheets/d/16bT82iDAlejCN86k2PXGzuDdojeLLKgICFVKybNIWJc/export?format=xlsx",
	জুন: "https://docs.google.com/spreadsheets/d/1MzoMhmIY3PGwIzzJ3Dif7FyNs_sHDXCYAu9oS7SKMtk/export?format=xlsx",
	জুলাই: "https://docs.google.com/spreadsheets/d/1eWAu9sMK8vrDlV3Ue35jYY6rfNVM0EOE43ecdZtY0yc/export?format=xlsx",
	আগস্ট: "https://docs.google.com/spreadsheets/d/144Km2kNlKpSdyQh9O1Q7BaIDf7bwOTGubTazHWMGPL0/export?format=xlsx",
	সেপ্টেম্বর: "https://docs.google.com/spreadsheets/d/1xL-oLgzRaGB-t4xd_AiVyGE42VkovVHYVr3gwa_sws0/export?format=xlsx",
	অক্টোবর: "https://docs.google.com/spreadsheets/d/1j4KCcQpVO2jsMWPgEaxilQgxXELIv7FDlwUDoa-8UH4/export?format=xlsx",
	নভেম্বর: "https://docs.google.com/spreadsheets/d/1qZk86u3nFnMv3LPs8XTRADCkVyxlUB7gbP_ik08TDdo/export?format=xlsx"
};
var DUE_BILL_LINKS = {
	জুলাই: "https://docs.google.com/spreadsheets/d/1AWUhQdWBluPN3kGhG0jsLo224Qc0hst7DvM0PYwFVak/export?format=xlsx",
	আগস্ট: "https://docs.google.com/spreadsheets/d/14uKbaHXq_Apreon8sKQVTbqSmQmvIn69Sh7idTqA0yI/export?format=xlsx",
	সেপ্টেম্বর: "https://docs.google.com/spreadsheets/d/1GJKWaWknUISnk0g_yXq9WoeJo86Pni6U6biZr7zWwaU/export?format=xlsx",
	অক্টোবর: "https://docs.google.com/spreadsheets/d/1rGLnOjC51iftP-Y9nIk5E3iv_4K0rT1WTy5yCbd-Dj4/export?format=xlsx"
};
function getActiveSheetLink(netType, month) {
	if (netType === "নেট বিল") return NET_BILL_LINKS[month] || "";
	if (netType === "ডিস বিল") return DIS_BILL_LINKS[month] || "";
	if (netType === "নেট সংযোগ") return NET_CONN_LINKS[month] || "";
	if (netType === "বকেয়া বিল") return DUE_BILL_LINKS[month] || "";
	return "";
}
var AREAS = {
	area1: [
		"চর শিমুল চূড়া",
		"সরকার বাড়ী",
		"বলিদে পাড়া",
		"নবীন নগর",
		"বালুঘাট",
		"কেরানী বাড়ী",
		"আমেদ বাড়ী",
		"কৃষ্ণচূড়া",
		"আকন্দ পাড়া",
		"চাংপাড়া",
		"কান্দা পাড়া",
		"কান্দাপাড়া",
		"ব্যাংতলা",
		"বাকশাবাড়ী",
		"দহের পাড়",
		"ইজারা পাড়া",
		"দষ্টিপাড়া",
		"ভেলুয়া",
		"লক্ষ্মিডাংরী",
		"লক্ষীডাংরী",
		"চকবন্দী",
		"কক্সবাজার"
	],
	area2: [
		"উত্তর পাড়া",
		"দক্ষিণ পাড়া",
		"টানা ব্রীজ বাজার",
		"দত্তপাড়া",
		"ফুলকার চর",
		"কড়ইতলা",
		"মোল্লা বাজার",
		"পেচার চর",
		"চন্দনপুর"
	]
};
var I18N = {
	bn: {
		headerTitle: "বিল ম্যানেজার",
		headerSubtitle: "স্মার্ট বিল ব্যবস্থাপনা সিস্টেম",
		dashboard: "ড্যাশবোর্ড",
		allBills: "সকল বিল",
		paidBills: "পরিশোধিত",
		dueBills: "বকেয়া",
		totalBills: "সর্বমোট পরিমাণ",
		paidAmount: "পরিশোধিত টাকা",
		dueAmount: "বকেয়া টাকা",
		export: "এক্সপোর্ট",
		refresh: "রিফ্রেশ",
		noticeBadge: "📢 নোটিশ",
		chartTrend: "📈 গত ৭ দিনের কালেকশন ট্রেন্ড",
		chartTrendSub: "দৈনিক বিল সংগ্রহ বিশ্লেষণ",
		chartPaidDue: "🥧 পরিশোধিত বনাম বকেয়া",
		chartPaidDueSub: "আদায় অনুপাত",
		chartMonthly: "📊 মাসভিত্তিক আয় (নেট বিল + ডিস বিল)",
		chartMonthlySub: "সকল মাসের সমন্বিত বিল সংগ্রহ বিশ্লেষণ",
		recentTx: "🔄 সাম্প্রতিক লেনদেন",
		recentTxSub: "সর্বশেষ পরিশোধিত বিলের তালিকা",
		records: "টি রেকর্ড",
		searchPlaceholder: "গ্রাহকের নাম, মোবাইল, আইডি বা ঠিকানা দিয়ে খুঁজুন...",
		tabAll: "সকল",
		tabPaid: "পরিশোধিত",
		tabDue: "বকেয়া",
		thSl: "ক্রমিক",
		thId: "আইডি",
		thName: "গ্রাহকের নাম",
		thPaid: "পরিশোধিত",
		thDue: "বকেয়া",
		thTotal: "সর্বমোট",
		thMobile: "মোবাইল",
		thDate: "তারিখ",
		thAddress: "ঠিকানা",
		thStatus: "স্ট্যাটাস",
		modalHeader: "📄 বিলের বিস্তারিত বিবরণ",
		btnPrint: "🖨️ রসিদ প্রিন্ট",
		btnClose: "বন্ধ করুন",
		btnSms: "📱 বকেয়া তাগাদা এসএমএস পাঠান",
		langToggle: "🇧🇩 বাংলা",
		backHome: "হোম"
	},
	en: {
		headerTitle: "Bill Manager",
		headerSubtitle: "Smart Billing Management System",
		dashboard: "Dashboard",
		allBills: "All Bills",
		paidBills: "Paid Bills",
		dueBills: "Due Bills",
		totalBills: "Grand Total",
		paidAmount: "Paid Amount",
		dueAmount: "Due Amount",
		export: "Export",
		refresh: "Refresh",
		noticeBadge: "📢 Notice",
		chartTrend: "📈 Last 7 Days Trend",
		chartTrendSub: "Daily collection analytics",
		chartPaidDue: "🥧 Paid vs Due",
		chartPaidDueSub: "Collection Ratio",
		chartMonthly: "📊 Monthly Revenue (Net + Dish Bill)",
		chartMonthlySub: "All-months aggregated billing collection",
		recentTx: "🔄 Recent Transactions",
		recentTxSub: "Latest processed billing records",
		records: "records",
		searchPlaceholder: "Search by customer name, mobile, ID or address...",
		tabAll: "All",
		tabPaid: "Paid",
		tabDue: "Due",
		thSl: "SL",
		thId: "ID",
		thName: "Customer Name",
		thPaid: "Paid",
		thDue: "Due",
		thTotal: "Total",
		thMobile: "Mobile",
		thDate: "Date",
		thAddress: "Address",
		thStatus: "Status",
		modalHeader: "📄 Customer Bill Details",
		btnPrint: "🖨️ Print Receipt",
		btnClose: "Close",
		btnSms: "📱 Send Due Reminder SMS",
		langToggle: "🇬🇧 English",
		backHome: "Home"
	}
};
var PROMO_SLIDES = [
	{
		id: "slide-1",
		slideClass: "bkash-slide-1",
		action: "due",
		tag: "বিল কালেকশন",
		liveBadge: "⚡ জরুরি",
		title: "বকেয়া বিল দ্রুত আদায় করুন!",
		ticketText: "বকেয়া গ্রাহকদের তালিকা",
		ticketIcon: "➔",
		condition: "*বকেয়া মুক্ত রাখুন",
		iconType: "bolt"
	},
	{
		id: "slide-2",
		slideClass: "bkash-slide-2",
		action: "due",
		tag: "বকেয়া রিমাইন্ডার",
		liveBadge: "🔄 ক্লিয়ার",
		title: "গত মাসের বকেয়া আদায় করুন!",
		ticketText: "আগের মাসের বকেয়া ক্লিয়ার",
		ticketIcon: "📋",
		condition: "*হিসাব স্বচ্ছ রাখুন",
		iconType: "refresh"
	},
	{
		id: "slide-3",
		slideClass: "bkash-slide-3",
		action: "all",
		tag: "চলতি মাসের বিল",
		liveBadge: "📅 লাইভ",
		title: "বর্তমান মাসের বিলের লাইভ হিসাব!",
		ticketText: "চলতি মাসের কালেকশন",
		ticketIcon: "💹",
		condition: "*রিয়েল-টাইম আপডেট",
		iconType: "calendar"
	},
	{
		id: "slide-4",
		slideClass: "bkash-slide-4",
		action: "due",
		tag: "স্মার্ট এসএমএস",
		liveBadge: "📱 অটো",
		title: "গ্রাহকদের তাগাদা এসএমএস দিন!",
		ticketText: "ডিজিটাল রসিদ ও রিমাইন্ডার",
		ticketIcon: "✉️",
		condition: "*দ্রুত আদায় নিশ্চিত",
		iconType: "sms"
	},
	{
		id: "slide-5",
		slideClass: "bkash-slide-5",
		action: "trend",
		tag: "অ্যানালিটিক্স",
		liveBadge: "🚀 গ্রোথ",
		title: "সময়মতো আদায় ও লাইন সচল রাখুন!",
		ticketText: "কালেকশন ট্রেন্ড অ্যানালাইসিস",
		ticketIcon: "📈",
		condition: "*উন্নত ইন্টারনেট সেবা",
		iconType: "rocket"
	}
];
//#endregion
//#region src/portals/billManager/utils.ts
function getBillManagerLogoUrl() {
	const assetBase = typeof window !== "undefined" ? window.__PCN_ASSET_BASE__ : "";
	return assetBase ? `${assetBase}bill-manager-logo.jpg` : "./bill-manager-logo.jpg";
}
async function copyTextToClipboard(text) {
	const value = String(text ?? "").trim();
	if (!value) return false;
	if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {}
	if (typeof document !== "undefined") {
		const previousFocus = document.activeElement;
		const host = document.querySelector(".bm-modal-content") || document.body || document.documentElement;
		const textarea = document.createElement("textarea");
		textarea.value = value;
		textarea.setAttribute("readonly", "");
		textarea.contentEditable = "true";
		textarea.style.position = "fixed";
		textarea.style.top = "0";
		textarea.style.left = "-9999px";
		textarea.style.width = "2em";
		textarea.style.height = "2em";
		textarea.style.padding = "0";
		textarea.style.border = "none";
		textarea.style.outline = "none";
		textarea.style.boxShadow = "none";
		textarea.style.background = "transparent";
		textarea.style.fontSize = "16px";
		textarea.style.opacity = "0.01";
		try {
			host.appendChild(textarea);
			textarea.focus({ preventScroll: true });
			textarea.select();
			textarea.setSelectionRange(0, value.length);
			if (document.execCommand("copy")) return true;
		} catch {} finally {
			try {
				if (textarea.parentNode) textarea.parentNode.removeChild(textarea);
			} catch {}
			try {
				if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus({ preventScroll: true });
			} catch {}
		}
	}
	return false;
}
function toCsvSheetUrl(rawUrl) {
	if (!rawUrl) return rawUrl;
	if (rawUrl.includes("docs.google.com/spreadsheets/") && rawUrl.includes("format=xlsx")) return rawUrl.replace(/format=xlsx/gi, "format=csv");
	return rawUrl;
}
async function fetchWithTimeout(url, timeoutMs = 7500) {
	const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
	const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
	try {
		return await fetch(url, { signal: ctrl ? ctrl.signal : void 0 });
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function fetchWithCorsFallback(rawUrl, options) {
	if (!rawUrl) return null;
	const cacheBuster = `_t=${Date.now()}`;
	const urlWithBuster = `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}${cacheBuster}`;
	const freshParam = (options === null || options === void 0 ? void 0 : options.forceFresh) ? "&fresh=1" : "";
	const timeoutMs = (options === null || options === void 0 ? void 0 : options.timeoutMs) ?? 8e3;
	try {
		const res = await fetchWithTimeout(`/api/fetch-sheet?url=${encodeURIComponent(rawUrl)}${freshParam}${(options === null || options === void 0 ? void 0 : options.forceFresh) ? `&${cacheBuster}` : ""}`, timeoutMs);
		if (res.ok) {
			if (!(res.headers.get("content-type") || "").toLowerCase().includes("text/html")) return await res.arrayBuffer();
		}
	} catch (e) {
		console.warn("[BillManager] Local proxy failed, trying public CORS proxies...", e);
	}
	try {
		const res = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(urlWithBuster)}`, timeoutMs);
		if (res.ok) {
			if (!(res.headers.get("content-type") || "").toLowerCase().includes("text/html")) return await res.arrayBuffer();
		}
	} catch (e) {
		console.warn("[BillManager] corsproxy.io failed", e);
	}
	try {
		const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(urlWithBuster)}`, timeoutMs);
		if (res.ok) {
			if (!(res.headers.get("content-type") || "").toLowerCase().includes("text/html")) return await res.arrayBuffer();
		}
	} catch (e) {
		console.warn("[BillManager] allorigins failed", e);
	}
	try {
		const res = await fetchWithTimeout(urlWithBuster, timeoutMs);
		if (res.ok) return await res.arrayBuffer();
	} catch (e) {
		console.error("[BillManager] Direct fetch blocked by CORS", e);
	}
	return null;
}
var sessionSheetCache = /* @__PURE__ */ new Map();
var SESSION_CACHE_TTL_MS = 3e4;
function getCachedSheetRecords(rawUrl, netType) {
	const key = `${netType}::${rawUrl}`;
	const hit = sessionSheetCache.get(key);
	if (hit && Date.now() - hit.fetchedAt < SESSION_CACHE_TTL_MS) return hit.records;
	return null;
}
function setCachedSheetRecords(rawUrl, netType, records) {
	const key = `${netType}::${rawUrl}`;
	sessionSheetCache.set(key, {
		records,
		fetchedAt: Date.now()
	});
}
function parseCsvMatrix(csvText) {
	const cleaned = csvText.charCodeAt(0) === 65279 ? csvText.slice(1) : csvText;
	const rows = [];
	let curRow = [];
	let curVal = "";
	let inQuotes = false;
	for (let i = 0; i < cleaned.length; i++) {
		const ch = cleaned[i];
		if (inQuotes) {
			if (ch === "\"") {
				if (cleaned[i + 1] === "\"") {
					curVal += "\"";
					i++;
				} else inQuotes = false;
			} else curVal += ch;
		} else if (ch === "\"") inQuotes = true;
		else if (ch === ",") {
			curRow.push(curVal);
			curVal = "";
		} else if (ch === "\r") {
			if (cleaned[i + 1] === "\n") i++;
			curRow.push(curVal);
			rows.push(curRow);
			curRow = [];
			curVal = "";
		} else if (ch === "\n") {
			curRow.push(curVal);
			rows.push(curRow);
			curRow = [];
			curVal = "";
		} else curVal += ch;
	}
	if (curVal.length > 0 || curRow.length > 0) {
		curRow.push(curVal);
		rows.push(curRow);
	}
	return rows;
}
/**
* Fetches & parses a Google Sheet quickly:
* 1) Prefers lightweight CSV (~50% smaller download, ~2ms pure-JS parse, zero xlsx bundle cost)
* 2) Falls back automatically to XLSX binary + lazy xlsx import if CSV fails or non-Google URL returns binary
*/
async function fetchSheetRecordsFast(rawUrl, netType, options) {
	if (!rawUrl) return null;
	if (!(options === null || options === void 0 ? void 0 : options.forceFresh)) {
		const memHit = getCachedSheetRecords(rawUrl, netType);
		if (memHit) return memHit;
	}
	const csvUrl = toCsvSheetUrl(rawUrl);
	if (csvUrl !== rawUrl || rawUrl.includes("format=csv") || rawUrl.includes("tqx=out:csv")) {
		const csvBuffer = await fetchWithCorsFallback(csvUrl, { forceFresh: options === null || options === void 0 ? void 0 : options.forceFresh });
		if (csvBuffer && csvBuffer.byteLength > 0) {
			const bytes = new Uint8Array(csvBuffer.slice(0, 4));
			if (bytes[0] === 80 && bytes[1] === 75) {
				const recs = await parseWorkbookBufferAsync(csvBuffer, netType);
				setCachedSheetRecords(rawUrl, netType, recs);
				return recs;
			}
			const text = new TextDecoder("utf-8").decode(csvBuffer);
			const trimmedHead = text.trimStart().slice(0, 200).toLowerCase();
			if (text && !trimmedHead.startsWith("<!doctype") && !trimmedHead.startsWith("<html")) {
				const recs = parseRowsToRecords(parseCsvMatrix(text), netType);
				if (recs.length > 0) {
					setCachedSheetRecords(rawUrl, netType, recs);
					return recs;
				}
			}
		}
	}
	const buffer = await fetchWithCorsFallback(rawUrl, { forceFresh: options === null || options === void 0 ? void 0 : options.forceFresh });
	if (!buffer) return null;
	const recs = await parseWorkbookBufferAsync(buffer, netType);
	setCachedSheetRecords(rawUrl, netType, recs);
	return recs;
}
function toEnglishDigits(str) {
	if (str === null || str === void 0) return "";
	const bnDigits = [
		"০",
		"১",
		"২",
		"৩",
		"৪",
		"৫",
		"৬",
		"৭",
		"৮",
		"৯"
	];
	let res = String(str);
	for (let i = 0; i < 10; i++) res = res.split(bnDigits[i]).join(String(i));
	return res;
}
function parseAmount(val) {
	if (val === void 0 || val === null) return 0;
	if (typeof val === "number") return Number.isNaN(val) ? 0 : val;
	const cleaned = toEnglishDigits(val).replace(/[^0-9.-]/g, "");
	const num = parseFloat(cleaned);
	return Number.isNaN(num) ? 0 : num;
}
function formatPhone(s) {
	if (!s || s === "---" || s === "-") return "---";
	let clean = toEnglishDigits(s).replace(/\D/g, "");
	if (clean.startsWith("880") && clean.length === 13) clean = "0" + clean.slice(3);
	else if (clean.length === 11 && clean.startsWith("01")) return clean;
	else if (clean.length === 10 && !clean.startsWith("0")) clean = "0" + clean;
	return clean.length >= 10 ? clean : String(s);
}
function parseExcelDate(val) {
	if (!val || val === "-" || val === "---") return "-";
	if (typeof val === "number" && val > 1) {
		const d = /* @__PURE__ */ new Date((val - 25569) * 864e5);
		if (!Number.isNaN(d.getTime())) return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
	}
	if (typeof val === "string") {
		const eng = toEnglishDigits(val.trim());
		const isoMatch = eng.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
		if (isoMatch) return `${isoMatch[3].padStart(2, "0")}/${isoMatch[2].padStart(2, "0")}/${isoMatch[1]}`;
		const dmyMatch = eng.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
		if (dmyMatch) {
			const yr = dmyMatch[3].length === 2 ? `20${dmyMatch[3]}` : dmyMatch[3];
			return `${dmyMatch[1].padStart(2, "0")}/${dmyMatch[2].padStart(2, "0")}/${yr}`;
		}
		return eng;
	}
	return "-";
}
function parseDateForSort(dateStr) {
	if (!dateStr || dateStr === "-" || dateStr === "---") return null;
	const parts = toEnglishDigits(dateStr.trim()).split(/[\/\-\.]/);
	if (parts.length === 3) {
		if (parts[0].length === 4) return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
		const yr = parts[2].length === 2 ? 2e3 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
		return new Date(yr, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
	}
	return null;
}
function isLikelyPhoneNumber(val) {
	if (!val) return false;
	const str = toEnglishDigits(val).trim().replace(/[\s\-\(\)\.]/g, "");
	return str.startsWith("01") && str.length >= 10 && str.length <= 13 || str.startsWith("8801") && str.length >= 13 || str.startsWith("+8801");
}
function isLikelyDateString(val) {
	if (!val) return false;
	if (typeof val === "number" && val > 3e4 && val < 6e4) return true;
	const str = toEnglishDigits(val).trim();
	return /^(\d{1,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,4})/.test(str);
}
function normalizeBengali(str) {
	if (!str) return "";
	return String(str).replace(/[\s\u0981-\u0983\u09BC\u09BE-\u09CD\u09D7\u09E2\u09E3]/g, "").replace(/[অআ]/g, "অ").replace(/[ইঈএ]/g, "ই").replace(/[উঊও]/g, "উ").replace(/[শষস]/g, "স").replace(/[ণন]/g, "ন").replace(/[ড়ঢ়র]/g, "র").replace(/[যজ]/g, "জ").replace(/[তৎ]/g, "ত").replace(/[বভ]/g, "ব").toLowerCase().trim();
}
function parseRowsToRecords(rows, netType) {
	if (!rows || rows.length < 2) return [];
	let headerRowIdx = -1;
	let colId = -1;
	let colName = -1;
	let colPay = -1;
	let colDue = -1;
	let colTotal = -1;
	let colDate = -1;
	let colMob = -1;
	let colAddr = -1;
	let colStatus = -1;
	for (let r = 0; r < Math.min(10, rows.length); r++) {
		const row = rows[r];
		if (!row || !Array.isArray(row)) continue;
		const rowStr = row.map((c) => String(c || "").trim()).join(" ");
		if (rowStr.includes("ক্রমিক") && (rowStr.includes("নাম") || rowStr.includes("ইউজার") || rowStr.includes("আইডি"))) {
			headerRowIdx = r;
			row.forEach((cell, cIdx) => {
				const txt = String(cell || "").trim();
				const lower = txt.toLowerCase();
				if (txt.includes("ইউজার") || txt.includes("আইডি") || lower.includes("user") || lower === "id") colId = cIdx;
				else if (txt.includes("গ্রাহকের নাম") || txt.includes("নাম") && !txt.includes("বিলের") && !txt.includes("মাসের") && !txt.includes("নাম্বার") && !txt.includes("লিখুন")) colName = cIdx;
				else if (txt.includes("পে-বিল") || txt.includes("পে বিল") || txt.includes("পরিশোধ") || txt.includes("আদায়") || lower === "pay") colPay = cIdx;
				else if (txt.includes("বকেয়া বিল") || txt.includes("বকেয়া") || lower === "due") colDue = cIdx;
				else if (txt.includes("সর্বমোট") || txt.includes("সর্বমোট") || txt.includes("মোট ব্যালেন্স") || lower === "total") colTotal = cIdx;
				else if (txt.includes("তারিখ") || lower.includes("date")) colDate = cIdx;
				else if (txt.includes("মোবাইল") || txt.includes("মোবাইল") || txt.includes("ফোন") || lower.includes("phone") || lower.includes("mob")) colMob = cIdx;
				else if (txt.includes("ঠিকানা") || txt.includes("এরিয়া") || txt.includes("এলাকা") || lower.includes("address")) colAddr = cIdx;
				else if (txt.includes("স্ট্যাটাস") || txt.includes("মন্তব্য") || lower.includes("status")) colStatus = cIdx;
			});
			break;
		}
	}
	const isDis = netType === "ডিস বিল";
	if (colName === -1) {
		colId = isDis ? -1 : 1;
		colName = isDis ? 1 : 2;
		colPay = isDis ? 2 : 3;
		colDue = isDis ? 3 : 4;
		colTotal = isDis ? 4 : 5;
		colDate = isDis ? 5 : 6;
		colMob = isDis ? 6 : 7;
		colAddr = isDis ? 7 : 8;
		colStatus = netType === "নেট সংযোগ" || netType === "বকেয়া বিল" ? 9 : -1;
	}
	const startRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 5;
	const records = [];
	const seen = /* @__PURE__ */ new Set();
	for (let i = startRow; i < rows.length; i++) {
		const row = rows[i];
		if (!row || row.length < 2) continue;
		const firstCell = row[0] ? String(row[0]).trim() : "";
		if (firstCell.includes("মোট") || firstCell === "0" || firstCell === "০") continue;
		const uid = colId !== -1 && row[colId] !== void 0 ? String(row[colId]).trim() : "";
		const name = colName !== -1 && row[colName] !== void 0 ? String(row[colName]).trim() : "";
		if (!name && !uid) continue;
		if (name === "0" || name === "০") continue;
		if (name.includes("মোট") || name.toLowerCase().includes("total")) continue;
		if (name.includes("গ্রাহকের নাম") || name.includes("ইউজার")) continue;
		const unique = `${uid}_${name}_${i}`;
		if (seen.has(unique)) continue;
		seen.add(unique);
		const pay = colPay !== -1 ? parseAmount(row[colPay]) : 0;
		const due = colDue !== -1 ? parseAmount(row[colDue]) : 0;
		const sheetTotal = colTotal !== -1 ? parseAmount(row[colTotal]) : 0;
		const total = sheetTotal > 0 ? sheetTotal : pay + due;
		let rawDate = colDate !== -1 ? row[colDate] : "";
		let rawMob = colMob !== -1 ? row[colMob] : "";
		const rawAddr = colAddr !== -1 && row[colAddr] !== void 0 ? String(row[colAddr]).trim() : "---";
		const rawStatus = colStatus !== -1 && row[colStatus] !== void 0 ? String(row[colStatus]).trim() : "";
		if (isLikelyPhoneNumber(rawDate) && !isLikelyPhoneNumber(rawMob)) {
			const temp = rawDate;
			rawDate = rawMob;
			rawMob = temp;
		} else if (isLikelyDateString(rawMob) && !isLikelyDateString(rawDate)) {
			const temp = rawDate;
			rawDate = rawMob;
			rawMob = temp;
		}
		let finalStatus = rawStatus;
		if (!finalStatus) {
			if (due === 0 && pay > 0) finalStatus = "পরিশোধিত";
			else if (due > 0 && pay > 0) finalStatus = "আংশিক";
			else if (due > 0 && pay === 0) finalStatus = "বকেয়া";
			else finalStatus = "পরিশোধিত";
		}
		records.push({
			id: colId !== -1 && uid ? uid : isDis ? null : "-----",
			name: name || "নাম নেই",
			pay,
			due,
			total,
			date: parseExcelDate(rawDate),
			mob: formatPhone(rawMob),
			address: rawAddr || "---",
			status: finalStatus
		});
	}
	return records;
}
async function parseWorkbookBufferAsync(buffer, netType) {
	const bytes = new Uint8Array(buffer.slice(0, 4));
	if (!(bytes[0] === 80 && bytes[1] === 75)) try {
		const text = new TextDecoder("utf-8").decode(buffer);
		if (text && (text.includes(",") || text.includes("ক্রমিক"))) return parseRowsToRecords(parseCsvMatrix(text), netType);
	} catch {}
	const XLSX = await __vitePreload(() => import("./chunk-xlsx.js"), [], import.meta.url);
	const wb = XLSX.read(buffer, { type: "array" });
	if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) return [];
	const sheet = wb.Sheets[wb.SheetNames[0]];
	return parseRowsToRecords(XLSX.utils.sheet_to_json(sheet, {
		header: 1,
		defval: ""
	}), netType);
}
async function exportRecordsToExcel(records, currentNet, currentMonth) {
	const XLSX = await __vitePreload(() => import("./chunk-xlsx.js"), [], import.meta.url);
	const isDisBill = currentNet === "ডিস বিল";
	const data = records.map((r, i) => {
		const rowObj = { SL: i + 1 };
		if (!isDisBill) rowObj.ID = r.id || "---";
		rowObj.Name = r.name;
		rowObj.Paid = r.pay;
		rowObj.Due = r.due;
		rowObj.Total = r.total;
		rowObj.Mobile = r.mob;
		rowObj.Date = r.date;
		rowObj.Address = r.address;
		return rowObj;
	});
	const ws = XLSX.utils.json_to_sheet(data);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Bills");
	XLSX.writeFile(wb, `Bill_${currentNet}_${currentMonth}.xlsx`);
}
//#endregion
export { getCachedSheetRecords as a, ALL_MONTHS as c, PROMO_SLIDES as d, getActiveSheetLink as f, getBillManagerLogoUrl as i, AREAS as l, exportRecordsToExcel as n, normalizeBengali as o, fetchSheetRecordsFast as r, parseDateForSort as s, copyTextToClipboard as t, I18N as u };
