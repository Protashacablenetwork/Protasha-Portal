const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./chunk-weatherService.js","./chunk-rolldown-runtime.js","./chunk-safeStorage.js","./chunk-formatters.js","./chunk-LoginView.js","./chunk-vendor-icons.js","./chunk-vendor-react.js","./chunk-vendor-firebase.js","./chunk-useSubViewBack.js","./chunk-imageCompressor.js","./chunk-TransactionDetailPage.js","./chunk-ReceiptModal.js","./chunk-EntryModal.js","./chunk-NotificationsModal.js","./chunk-NotificationDetailModal.js","./chunk-prayerTimeService.js","./chunk-ServiceNoticeModal.js","./chunk-ProfileView.js","./chunk-confetti.module.js","./chunk-googleDrive.js","./chunk-types.js","./chunk-appVersion.js","./chunk-RecycleBinModal.js","./chunk-AuditLogModal.js","./chunk-FooterSettingsModal.js","./chunk-ChangePinModal.js","./chunk-ReportModal.js","./chunk-BarChart.js","./chunk-BannerManagerModal.js","./chunk-ChannelManagerModal.js","./chunk-UserManagementModal.js","./chunk-WeatherModal.js","./chunk-weatherNotificationService.js","./chunk-PrayerTimesModal.js","./chunk-StaffManagerModal.js","./chunk-ServiceManagerModal.js","./chunk-QuickHisabModal.js","./chunk-categories.js","./chunk-DriveBackupModal.js","./chunk-backupCollector.js","./chunk-cloudArchiveSync.js","./chunk-SupportTicketModal.js","./chunk-PublicTicketTracker.js","./chunk-StaffAttendanceModal.js","./chunk-AdminPopupNoticeModal.js","./chunk-UserPopupNoticeModal.js","./chunk-App.js","./chunk-utils.js","./chunk-BillManagerPortal.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { A as SlidersVertical, Ct as Headphones, En as require_react, Et as Globe, Ft as EyeOff, Gt as Cloud, I as Settings2, It as ExternalLink, J as Plus, Jt as CloudLightning, M as ShieldCheck, Mt as FilePlus2, O as Sparkles, Ot as FunnelX, Pt as Eye, Q as PenLine, R as Search, Sn as ArrowLeft, T as Sun, U as Receipt, Ut as Copy, Yt as Clock, _n as Bell, at as Menu, bn as ArrowUpRight, bt as House, c as WalletCards, d as Users, dt as Lock, en as ChevronRight, f as User, fn as Calculator, ht as Layers, it as MessageCircle, m as UserCheck, qt as CloudRain, r as Wrench, rn as Check, t as Zap, tn as ChevronLeft, x as Trash2, xn as ArrowRight, xt as History } from "./chunk-vendor-icons.js";
import { n as require_client, t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { E as initializeApp, S as initializeFirestore, T as getApps, _ as collection, a as deleteDoc, b as enableNetwork, c as getDocs, d as persistentLocalCache, f as persistentMultipleTabManager, g as where, h as setDoc, l as onSnapshot, m as runTransaction, n as getAuth, o as getDoc, p as query, s as getDocFromServer, w as getApp, x as getFirestore, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { a as toEnglishNumber, i as toBengaliNumber, n as formatTransactionDate, o as translations, r as getGreeting, t as formatCurrency } from "./chunk-formatters.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region firebase-applet-config.json
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_client = require_client();
var firebase_applet_config_default = {
	projectId: "gen-lang-client-0866907753",
	firestoreDatabaseId: "staff-collection-db",
	appId: "1:1003306673691:web:23db6ebdc319e6a6df3abe",
	apiKey: "AIzaSyAPqy-Vy7r3QKvN7qeBG4pcnQakNR-gfuk",
	authDomain: "gen-lang-client-0866907753.firebaseapp.com",
	storageBucket: "gen-lang-client-0866907753.firebasestorage.app",
	messagingSenderId: "1003306673691",
	measurementId: "",
	oAuthClientId: "1003306673691-28n3id5nk33r91a7msidc929qbhabtvb.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
//#endregion
//#region src/utils/firebase.ts
var app = getApps().length ? getApp() : initializeApp(firebase_applet_config_default);
var databaseId = firebase_applet_config_default.firestoreDatabaseId || "staff-collection-db";
var db = (() => {
	try {
		return initializeFirestore(app, {
			experimentalAutoDetectLongPolling: true,
			localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
		}, databaseId);
	} catch {
		try {
			return initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, databaseId);
		} catch {
			return getFirestore(app, databaseId);
		}
	}
})();
var staffDb = db;
var auth = getAuth(app);
`${firebase_applet_config_default.projectId}${databaseId}`;
var QUOTA_KEY = "firestore_quota_exceeded";
var QUOTA_RESET_KEY = "firestore_quota_reset_time";
var sessionQuotaExceeded = false;
try {
	safeStorage.removeItem(QUOTA_KEY);
	safeStorage.removeItem(QUOTA_RESET_KEY);
	enableNetwork(db).catch(() => {});
} catch {}
function setFirestoreQuotaExceeded() {
	sessionQuotaExceeded = true;
}
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
/**
* Recursively remove undefined properties from objects/arrays because Firestore
* rejects documents containing `undefined` anywhere in the payload.
*/
function stripUndefined(value) {
	if (value === null || value === void 0) return value;
	if (Array.isArray(value)) return value.filter((item) => item !== void 0).map((item) => stripUndefined(item));
	if (typeof value === "object" && !(value instanceof Date)) {
		const cleaned = {};
		for (const [k, v] of Object.entries(value)) if (v !== void 0) cleaned[k] = stripUndefined(v);
		return cleaned;
	}
	return value;
}
function handleFirestoreError(error, operationType, path) {
	var _auth$currentUser, _auth$currentUser2, _auth$currentUser3, _auth$currentUser4, _auth$currentUser5, _auth$currentUser6;
	const errMsg = error instanceof Error ? error.message : String(error);
	if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota limit exceeded") || errMsg.includes("quota metric") || (error === null || error === void 0 ? void 0 : error.code) === 8 || (error === null || error === void 0 ? void 0 : error.code) === "resource-exhausted") {
		if (!sessionQuotaExceeded) {
			setFirestoreQuotaExceeded();
			console.warn("[Firestore Quota Notice]: Daily free tier read/write quota reached.");
		}
		return true;
	}
	const errInfo = {
		error: errMsg,
		authInfo: {
			userId: (_auth$currentUser = auth.currentUser) === null || _auth$currentUser === void 0 ? void 0 : _auth$currentUser.uid,
			email: (_auth$currentUser2 = auth.currentUser) === null || _auth$currentUser2 === void 0 ? void 0 : _auth$currentUser2.email,
			emailVerified: (_auth$currentUser3 = auth.currentUser) === null || _auth$currentUser3 === void 0 ? void 0 : _auth$currentUser3.emailVerified,
			isAnonymous: (_auth$currentUser4 = auth.currentUser) === null || _auth$currentUser4 === void 0 ? void 0 : _auth$currentUser4.isAnonymous,
			tenantId: (_auth$currentUser5 = auth.currentUser) === null || _auth$currentUser5 === void 0 ? void 0 : _auth$currentUser5.tenantId,
			providerInfo: ((_auth$currentUser6 = auth.currentUser) === null || _auth$currentUser6 === void 0 || (_auth$currentUser6 = _auth$currentUser6.providerData) === null || _auth$currentUser6 === void 0 ? void 0 : _auth$currentUser6.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			}))) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	return false;
}
function notifyCloudMutation(path) {
	try {
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("protyasha-cloud-mutation", { detail: { path } }));
	} catch {}
}
async function safeSetDoc(docRef, data, options) {
	const cleanData = stripUndefined(data);
	try {
		if (options) await setDoc(docRef, cleanData, options);
		else await setDoc(docRef, cleanData);
		notifyCloudMutation((docRef === null || docRef === void 0 ? void 0 : docRef.path) || null);
	} catch (err) {
		if (!handleFirestoreError(err, "write", (docRef === null || docRef === void 0 ? void 0 : docRef.path) || null)) throw err;
	}
}
async function safeDeleteDoc(docRef) {
	try {
		await deleteDoc(docRef);
		notifyCloudMutation((docRef === null || docRef === void 0 ? void 0 : docRef.path) || null);
	} catch (err) {
		if (!handleFirestoreError(err, "delete", (docRef === null || docRef === void 0 ? void 0 : docRef.path) || null)) throw err;
	}
}
async function testFirestoreConnection() {
	try {
		await getDocFromServer(doc(db, "settings", "connection_test"));
		return true;
	} catch (error) {
		if (error instanceof Error && error.message.includes("the client is offline")) console.error("Please check your Firebase configuration.");
		else console.warn("[Firestore Connection Notice]:", error instanceof Error ? error.message : error);
		return false;
	}
}
if (!globalThis.__PCN_FB_CONN_CHECKED__) {
	globalThis.__PCN_FB_CONN_CHECKED__ = true;
	setTimeout(() => {
		testFirestoreConnection();
	}, 5e3);
}
//#endregion
//#region src/utils/audio.ts
var SoundEffects = class {
	constructor() {
		this.ctx = null;
	}
	getContext() {
		if (typeof window === "undefined") return null;
		if (!this.ctx) {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (AudioCtx) this.ctx = new AudioCtx();
		}
		if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
		return this.ctx;
	}
	playTap() {
		try {
			const ctx = this.getContext();
			if (!ctx) return;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(600, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + .05);
			gain.gain.setValueAtTime(.12, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .05);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + .06);
		} catch {}
	}
	playBalanceChime() {
		try {
			const ctx = this.getContext();
			if (!ctx) return;
			[
				523.25,
				659.25,
				783.99,
				1046.5
			].forEach((freq, idx) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "triangle";
				osc.frequency.value = freq;
				const startTime = ctx.currentTime + idx * .06;
				gain.gain.setValueAtTime(.001, startTime);
				gain.gain.linearRampToValueAtTime(.15, startTime + .02);
				gain.gain.exponentialRampToValueAtTime(.001, startTime + .35);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(startTime);
				osc.stop(startTime + .36);
			});
		} catch {}
	}
	playSuccess() {
		try {
			const ctx = this.getContext();
			if (!ctx) return;
			[
				587.33,
				739.99,
				880
			].forEach((freq) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.value = freq;
				gain.gain.setValueAtTime(.15, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .45);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .46);
			});
		} catch {}
	}
};
var sounds = new SoundEffects();
//#endregion
//#region src/components/TicketTrackingHelpers.tsx
var import_jsx_runtime = require_jsx_runtime();
var TICKET_STAGES = [
	{
		id: "pending",
		stepNum: 1,
		numBn: "১",
		labelBn: "১. দাখিলকৃত",
		labelEn: "1. Submitted",
		shortBn: "দাখিলকৃত",
		shortEn: "Submitted"
	},
	{
		id: "reviewing",
		stepNum: 2,
		numBn: "২",
		labelBn: "২. পর্যালোচনা",
		labelEn: "2. Reviewing",
		shortBn: "পর্যালোচনা",
		shortEn: "Reviewing"
	},
	{
		id: "in_progress",
		stepNum: 3,
		numBn: "৩",
		labelBn: "৩. কাজ চলমান",
		labelEn: "3. In Progress",
		shortBn: "কাজ চলমান",
		shortEn: "In Progress"
	},
	{
		id: "resolved",
		stepNum: 4,
		numBn: "৪",
		labelBn: "৪. সমাধানকৃত",
		labelEn: "4. Resolved",
		shortBn: "সমাধানকৃত",
		shortEn: "Resolved"
	}
];
var CATEGORY_LABELS = {
	line_cut: {
		bn: "লাইন কাটা / ফাইবার",
		en: "Line / Fiber Cut"
	},
	onu_router: {
		bn: "অনু / রাউটার সমস্যা",
		en: "ONU / Router Issue"
	},
	slow_net: {
		bn: "নেট স্লো / বাফারিং",
		en: "Slow Internet"
	},
	dish_signal: {
		bn: "ডিস সিগন্যাল / চ্যানেল",
		en: "Dish Signal Issue"
	},
	billing: {
		bn: "বিল / পেমেন্ট সমস্যা",
		en: "Billing Issue"
	},
	new_line: {
		bn: "নতুন লাইন / শিফটিং",
		en: "New Line / Shifting"
	},
	other: {
		bn: "অন্যান্য সমস্যা",
		en: "Other Issue"
	}
};
var getTicketStageIndex = (status) => {
	const idx = TICKET_STAGES.findIndex((s) => s.id === status);
	return idx >= 0 ? idx : 0;
};
var getTicketStatusLabel = (status, isBn) => {
	const found = TICKET_STAGES.find((s) => s.id === status) || TICKET_STAGES[0];
	return isBn ? found.shortBn : found.shortEn;
};
var PUBLIC_TRACKING_BASE_URL_KEY = "protyasha_public_tracking_base_url";
var SAFE_TICKET_ID_REGEX = /^[a-zA-Z0-9_.-]{1,128}$/;
var sanitizePublicBaseUrl = (raw) => {
	const trimmed = (raw || "").trim();
	if (!trimmed) return "";
	try {
		const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const parsed = new URL(withProtocol);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
		parsed.search = "";
		parsed.hash = "";
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return "";
	}
};
var getStoredPublicTrackingBaseUrl = () => {
	try {
		return sanitizePublicBaseUrl(safeStorage.getItem(PUBLIC_TRACKING_BASE_URL_KEY));
	} catch {
		return "";
	}
};
var savePublicTrackingBaseUrl = async (rawUrl) => {
	const clean = sanitizePublicBaseUrl(rawUrl);
	try {
		if (clean) safeStorage.setItem(PUBLIC_TRACKING_BASE_URL_KEY, clean);
		else safeStorage.removeItem(PUBLIC_TRACKING_BASE_URL_KEY);
	} catch {}
	try {
		await safeSetDoc(doc(db, "settings", "public_tracking_config"), {
			id: "public_tracking_config",
			customBaseUrl: clean,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch {}
	return clean;
};
/**
* Extracts a ticket tracking ID from ANY supported URL format across all hosts,
* subfolders, CDNs, localhost, and file://:
*  - ?track=<id> (even with extra params like &i=1 or &fbclid=...)
*  - #track=<id> or #?track=<id>
*  - #/track/<id>
*  - /track/<id>
*/
var extractTrackTicketIdFromLocation = (loc) => {
	try {
		var _searchParams$get;
		const target = loc || (typeof window !== "undefined" ? window.location : null);
		if (!target) return null;
		const fromQuery = (_searchParams$get = new URLSearchParams(target.search || "").get("track")) === null || _searchParams$get === void 0 ? void 0 : _searchParams$get.trim();
		if (fromQuery && SAFE_TICKET_ID_REGEX.test(fromQuery)) return fromQuery;
		const rawHash = (target.hash || "").replace(/^#/, "").trim();
		if (rawHash) {
			var _hashParams$get;
			if (rawHash.startsWith("/track/")) {
				const candidate = decodeURIComponent(rawHash.slice(7).split(/[?#&/]/)[0] || "").trim();
				if (candidate && SAFE_TICKET_ID_REGEX.test(candidate)) return candidate;
			}
			const normalizedHashQuery = rawHash.startsWith("?") ? rawHash.slice(1) : rawHash;
			const fromHash = (_hashParams$get = new URLSearchParams(normalizedHashQuery).get("track")) === null || _hashParams$get === void 0 ? void 0 : _hashParams$get.trim();
			if (fromHash && SAFE_TICKET_ID_REGEX.test(fromHash)) return fromHash;
		}
		const pathMatch = (target.pathname || "").match(/\/track\/([a-zA-Z0-9_-]{1,128})(?:\/)?$/);
		if (pathMatch && pathMatch[1] && SAFE_TICKET_ID_REGEX.test(pathMatch[1])) return pathMatch[1];
		return null;
	} catch {
		return null;
	}
};
var clearTrackFromCurrentUrl = () => {
	if (typeof window === "undefined") return;
	try {
		const url = new URL(window.location.href);
		url.searchParams.delete("track");
		if (url.hash && /track[=/]/i.test(url.hash)) url.hash = "";
		if (/\/track\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) url.pathname = url.pathname.replace(/\/track\/[a-zA-Z0-9_-]+\/?$/, "/");
		const nextUrl = url.protocol === "file:" ? url.href : `${url.pathname}${url.search}${url.hash}`;
		window.history.replaceState({ appRoot: true }, "", nextUrl);
	} catch {}
};
/**
* Dynamically builds a universal tracking link that works automatically on ANY host
* (cPanel, Hostinger, Vercel, Netlify, GitHub Pages, Firebase Hosting, Cloud Run,
* subfolder hosting, localhost, LAN IP, or file://), or uses an optional custom domain.
*/
var buildPublicTrackingUrl = (ticketId, customBaseUrlOverride) => {
	const safeId = encodeURIComponent(ticketId);
	const customBase = sanitizePublicBaseUrl(customBaseUrlOverride !== void 0 ? customBaseUrlOverride : getStoredPublicTrackingBaseUrl());
	if (customBase) return `${customBase}/?track=${safeId}`;
	if (typeof window === "undefined") return `?track=${safeId}`;
	try {
		const url = new URL(window.location.href);
		url.search = "";
		url.hash = "";
		if (/\/track\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) url.pathname = url.pathname.replace(/\/track\/[a-zA-Z0-9_-]+\/?$/, "/");
		if (url.protocol === "file:") {
			url.hash = `track=${safeId}`;
			return url.toString();
		}
		url.searchParams.set("track", ticketId);
		return url.toString();
	} catch {
		return `?track=${safeId}`;
	}
};
var formatTicketDateTime = (iso, isBn = true) => {
	if (!iso) return isBn ? "সময় উল্লেখ নেই" : "N/A";
	try {
		const d = new Date(iso);
		return `${d.toLocaleDateString(isBn ? "bn-BD" : "en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		})}, ${d.toLocaleTimeString(isBn ? "bn-BD" : "en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		})}`;
	} catch {
		return iso.slice(0, 16);
	}
};
var getTicketRoleLabel = (role, isBn = true) => {
	if (!role) return "";
	if (role === "admin") return isBn ? "অ্যাডমিন" : "Admin";
	if (role === "sub-admin") return isBn ? "সাব-এডমিন" : "Sub-Admin";
	if (role === "staff") return isBn ? "স্টাফ" : "Staff";
	if (role === "user") return isBn ? "ইউজার" : "User";
	if (role === "visitor") return isBn ? "গ্রাহক" : "Customer";
	return role;
};
var copyTextSafely = async (text) => {
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {}
	try {
		const el = document.createElement("textarea");
		el.value = text;
		el.style.position = "fixed";
		el.style.opacity = "0";
		document.body.appendChild(el);
		el.focus();
		el.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(el);
		return ok;
	} catch {
		return false;
	}
};
/**
* Ensures older tickets without activityHistory still display an accurate Activity History timeline.
*/
var resolveTicketActivities = (ticket) => {
	if (Array.isArray(ticket.activityHistory) && ticket.activityHistory.length > 0) return [...ticket.activityHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	const fallback = [{
		id: `act_created_${ticket.id}`,
		action: "created",
		titleBn: "১. অভিযোগ দাখিল করা হয়েছে",
		titleEn: "1. Complaint submitted",
		actorName: ticket.createdBy || "অ্যাডমিন",
		actorRole: ticket.createdByRole || "admin",
		note: ticket.description || void 0,
		status: "pending",
		timestamp: ticket.createdAt
	}];
	if (ticket.assignedStaffName) fallback.push({
		id: `act_assigned_${ticket.id}`,
		action: "assigned",
		titleBn: `টেকনিশিয়ান অ্যাসাইন: ${ticket.assignedStaffName}`,
		titleEn: `Assigned technician: ${ticket.assignedStaffName}`,
		actorName: ticket.createdBy || "অ্যাডমিন",
		status: ticket.status === "pending" ? "in_progress" : ticket.status,
		timestamp: ticket.updatedAt || ticket.createdAt
	});
	if (ticket.status === "resolved") fallback.push({
		id: `act_resolved_${ticket.id}`,
		action: "resolved",
		titleBn: "৪. অভিযোগটি সমাধানকৃত হয়েছে",
		titleEn: "4. Complaint resolved",
		actorName: ticket.resolvedBy || ticket.assignedStaffName || "অ্যাডমিন",
		actorRole: ticket.resolvedByRole || "admin",
		note: ticket.resolutionNote || void 0,
		status: "resolved",
		timestamp: ticket.resolvedAt || ticket.updatedAt || ticket.createdAt
	});
	return fallback.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
var TicketProgressStepper = ({ status, lang, interactive = false, onSelectStatus, compact = false }) => {
	const isBn = lang === "bn";
	const currentIdx = getTicketStageIndex(status);
	const progressPct = currentIdx / (TICKET_STAGES.length - 1) * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: compact ? "py-1" : "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-4 left-[12.5%] right-[12.5%] h-1 rounded-full bg-slate-200 dark:bg-slate-800",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute top-4 left-[12.5%] h-1 rounded-full transition-all duration-300 ${status === "resolved" ? "bg-emerald-500" : "bg-[#E52E2E]"}`,
					style: { width: `${progressPct * .75}%` },
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1 relative z-10",
					children: TICKET_STAGES.map((stage, idx) => {
						const isCompleted = idx < currentIdx || idx === 3 && currentIdx === 3;
						const isCurrent = idx === currentIdx;
						const isResolvedCurrent = isCurrent && stage.id === "resolved";
						const circleClass = isResolvedCurrent ? "bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-500/20" : isCompleted ? status === "resolved" ? "bg-emerald-600 text-white border-emerald-600" : "bg-[#E52E2E] text-white border-[#E52E2E]" : isCurrent ? "bg-[#E52E2E] text-white border-[#E52E2E] ring-4 ring-rose-500/20" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700";
						const labelClass = isCurrent ? isResolvedCurrent ? "text-emerald-700 dark:text-emerald-400 font-extrabold" : "text-slate-900 dark:text-white font-extrabold" : isCompleted ? "text-slate-800 dark:text-slate-200 font-bold" : "text-slate-400 dark:text-slate-500 font-semibold";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(interactive ? "button" : "div", {
							...interactive ? {
								type: "button",
								onClick: () => {
									sounds.playTap();
									onSelectStatus === null || onSelectStatus === void 0 || onSelectStatus(stage.id);
								}
							} : {},
							className: `flex flex-col items-center text-center group ${interactive ? "cursor-pointer active:scale-95 transition-transform" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${circleClass}`,
								children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.8]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? stage.numBn : stage.stepNum })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-1.5 text-[10px] sm:text-[11px] leading-tight ${labelClass}`,
								children: isBn ? stage.labelBn : stage.labelEn
							})]
						}, stage.id);
					})
				})
			]
		})
	});
};
var TicketActivityTimeline = ({ ticket, lang }) => {
	const isBn = lang === "bn";
	const activities = resolveTicketActivities(ticket);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
					children: isBn ? "অ্যাক্টিভিটি হিস্টোরি" : "Activity History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500 dark:text-slate-400 font-medium",
					children: isBn ? `মোট ${toBengaliNumber(activities.length)}টি আপডেট রেকর্ড` : `${activities.length} recorded updates`
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800",
			children: activities.map((item, idx) => {
				const isResolvedItem = item.action === "resolved" || item.status === "resolved";
				const isCreatedItem = item.action === "created";
				const isAssignedItem = item.action === "assigned";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 ${isResolvedItem ? "bg-emerald-500 border-emerald-200 dark:border-emerald-900" : isCreatedItem ? "bg-rose-500 border-rose-200 dark:border-rose-900" : isAssignedItem ? "bg-indigo-500 border-indigo-200 dark:border-indigo-900" : "bg-amber-500 border-amber-200 dark:border-amber-900"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-2.5 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-extrabold text-slate-900 dark:text-white leading-snug flex items-center gap-1.5",
									children: [isResolvedItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }) : isAssignedItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" }) : isCreatedItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlus2, { className: "w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? item.titleBn : item.titleEn })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3 h-3 text-slate-400" }),
										item.actorName,
										item.actorRole ? ` (${getTicketRoleLabel(item.actorRole, isBn)})` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums font-medium",
									children: formatTicketDateTime(item.timestamp, isBn)
								})]
							}),
							item.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed",
								children: item.note
							})
						]
					})]
				}, item.id || idx);
			})
		})]
	});
};
var PublicTrackingShareCard = ({ ticket, lang, canToggleVisibility = false, onToggleVisibility, onPreviewPublicLink }) => {
	const isBn = lang === "bn";
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [customBaseUrl, setCustomBaseUrl] = (0, import_react.useState)(() => getStoredPublicTrackingBaseUrl());
	const [showDomainConfig, setShowDomainConfig] = (0, import_react.useState)(false);
	const [domainInput, setDomainInput] = (0, import_react.useState)(() => getStoredPublicTrackingBaseUrl());
	const [savingDomain, setSavingDomain] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let unsub = null;
		try {
			unsub = onSnapshot(doc(db, "settings", "public_tracking_config"), (snap) => {
				if (snap.exists()) {
					var _snap$data;
					const remoteBase = sanitizePublicBaseUrl((_snap$data = snap.data()) === null || _snap$data === void 0 ? void 0 : _snap$data.customBaseUrl);
					setCustomBaseUrl(remoteBase);
					setDomainInput(remoteBase);
					try {
						if (remoteBase) safeStorage.setItem(PUBLIC_TRACKING_BASE_URL_KEY, remoteBase);
						else safeStorage.removeItem(PUBLIC_TRACKING_BASE_URL_KEY);
					} catch {}
				}
			}, () => {});
		} catch {}
		return () => {
			if (unsub) unsub();
		};
	}, []);
	const isPublic = ticket.isPublicTrackingEnabled !== false;
	const trackingUrl = buildPublicTrackingUrl(ticket.id, customBaseUrl);
	const currentHostLabel = typeof window !== "undefined" ? customBaseUrl ? customBaseUrl.replace(/^https?:\/\//i, "") : window.location.host || "localhost" : "auto";
	const handleCopy = async () => {
		sounds.playSuccess();
		if (await copyTextSafely(trackingUrl)) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2200);
		}
	};
	const handleSaveCustomDomain = async (e) => {
		e.preventDefault();
		setSavingDomain(true);
		try {
			const saved = await savePublicTrackingBaseUrl(domainInput);
			setCustomBaseUrl(saved);
			setDomainInput(saved);
			sounds.playSuccess();
			setShowDomainConfig(false);
		} finally {
			setSavingDomain(false);
		}
	};
	const whatsappShareText = isBn ? `প্রত্যাশা ক্যাবল নেটওয়ার্ক — অভিযোগ লাইভ ট্র্যাকিং\nটিকেট নং: #${ticket.ticketNumber}\nগ্রাহক: ${ticket.customerName}\nবর্তমান অবস্থা: ${getTicketStatusLabel(ticket.status, true)}\nলাইভ আপডেট দেখতে লিংকটিতে ক্লিক করুন:\n${trackingUrl}` : `Protasha Cable Network — Live Support Tracking\nTicket: #${ticket.ticketNumber}\nCustomer: ${ticket.customerName}\nStatus: ${getTicketStatusLabel(ticket.status, false)}\nTrack live updates here:\n${trackingUrl}`;
	const cleanPhone = (ticket.customerPhone || "").replace(/[^\d]/g, "");
	const normalizedPhone = cleanPhone.startsWith("88") ? cleanPhone : cleanPhone.startsWith("0") ? `88${cleanPhone}` : cleanPhone;
	const whatsappHref = normalizedPhone ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(whatsappShareText)}` : `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 rounded-2xl bg-gradient-to-br from-sky-50/90 via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-sky-200/80 dark:border-indigo-900/60 shadow-xs space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4.5 h-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
								children: isBn ? "অনলাইন ট্র্যাকিং ও পাবলিক লিংক" : "Online Tracking & Public Link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${isPublic ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800" : "bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`,
								children: [isPublic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isPublic ? isBn ? "সবার জন্য দৃশ্যমান" : "Publicly Visible" : isBn ? "পাবলিক লিংক বন্ধ" : "Link Paused" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed",
							children: isBn ? "যেকোনো ব্রাউজার, হোস্টিং সাইট বা লোকালহোস্ট থেকে এই অভিযোগের লাইভ আপডেট দেখতে লিংকটি কপি করে শেয়ার করুন।" : "Copy and share this link to view live updates from any browser, hosting domain, or localhost."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [canToggleVisibility && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setShowDomainConfig((v) => !v);
						},
						className: "w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer",
						title: isBn ? "কাস্টম হোস্টিং ডোমেইন সেট করুন (ঐচ্ছিক)" : "Optional custom domain",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-3.5 h-3.5" })
					}), canToggleVisibility && onToggleVisibility && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							onToggleVisibility(!isPublic);
						},
						className: "h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer",
						children: isPublic ? isBn ? "বন্ধ করুন" : "Disable" : isBn ? "চালু করুন" : "Enable"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-sky-100 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: customBaseUrl ? isBn ? `কাস্টম ডোমেইন: ${currentHostLabel}` : `Custom Domain: ${currentHostLabel}` : isBn ? `অটো হোস্ট (সব সাইট ও লোকালহোস্ট): ${currentHostLabel}` : `Auto Host (All Sites & Localhost): ${currentHostLabel}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-emerald-600 dark:text-emerald-400 shrink-0",
					children: isBn ? "● লাইভ ক্লাউড সিঙ্ক" : "● Live Cloud Sync"
				})]
			}),
			canToggleVisibility && showDomainConfig && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveCustomDomain,
				className: "p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-bold text-slate-700 dark:text-slate-200",
					children: isBn ? "কাস্টম পাবলিক ডোমেইন (ঐচ্ছিক — খালি রাখলে বর্তমান হোস্ট/লোকালহোস্ট অটো ব্যবহার হবে)" : "Optional Custom Base URL (leave empty to auto-use current host/localhost)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: domainInput,
							onChange: (e) => setDomainInput(e.target.value),
							placeholder: "https://yourdomain.com",
							className: "flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: savingDomain,
							className: "h-9 px-3 rounded-lg bg-indigo-600 text-white text-xs font-extrabold cursor-pointer shrink-0",
							children: isBn ? "সেভ" : "Save"
						}),
						customBaseUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: async () => {
								setDomainInput("");
								const cleared = await savePublicTrackingBaseUrl("");
								setCustomBaseUrl(cleared);
								setShowDomainConfig(false);
							},
							className: "h-9 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer shrink-0",
							children: isBn ? "অটো" : "Auto"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					readOnly: true,
					value: trackingUrl,
					onFocus: (e) => e.currentTarget.select(),
					className: "flex-1 bg-transparent text-[11px] font-mono text-slate-700 dark:text-slate-300 focus:outline-none truncate px-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleCopy,
					className: `h-8 px-3 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${copied ? "bg-emerald-600 text-white" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"}`,
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? isBn ? "কপি হয়েছে!" : "Copied!" : isBn ? "লিংক কপি" : "Copy" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: whatsappHref,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "WhatsApp-এ শেয়ার" : "Share on WhatsApp" })]
				}), onPreviewPublicLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						sounds.playTap();
						onPreviewPublicLink();
					},
					className: "h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5 text-sky-600 dark:text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পাবলিক পেজ দেখুন" : "Open Public View" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleCopy,
					className: "h-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5 text-sky-600 dark:text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? isBn ? "কপি সম্পন্ন" : "Copied" : isBn ? "লিংক কপি করুন" : "Copy Link" })]
				})]
			})
		]
	});
};
//#endregion
//#region src/utils/uiFeedback.ts
var feedbackBus = globalThis.__PCN_FEEDBACK_BUS__ || (globalThis.__PCN_FEEDBACK_BUS__ = {
	toastListeners: /* @__PURE__ */ new Set(),
	confirmListeners: /* @__PURE__ */ new Set()
});
var toastListeners = feedbackBus.toastListeners;
var confirmListeners = feedbackBus.confirmListeners;
function subscribeFeedbackToasts(listener) {
	toastListeners.add(listener);
	return () => {
		toastListeners.delete(listener);
	};
}
function subscribeFeedbackConfirms(listener) {
	confirmListeners.add(listener);
	return () => {
		confirmListeners.delete(listener);
	};
}
function inferTone(message) {
	const m = message.toLowerCase();
	if (message.includes("❌") || message.includes("ত্রুটি") || message.includes("ব্যর্থ") || message.includes("শুধুমাত্র") || message.includes("সঠিক") || m.includes("error") || m.includes("fail") || m.includes("only") || m.includes("valid")) return "error";
	if (message.includes("✅") || message.includes("সফল") || message.includes("কপি") || m.includes("success") || m.includes("copied")) return "success";
	if (message.includes("⚠️") || message.includes("নেই") || m.includes("warning")) return "warning";
	return "info";
}
function showToast(message, tone) {
	const clean = String(message || "").trim();
	if (!clean) return;
	const item = {
		id: `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
		message: clean,
		tone: tone || inferTone(clean)
	};
	toastListeners.forEach((fn) => {
		try {
			fn(item);
		} catch {}
	});
}
function showConfirm(messageOrOptions, options) {
	if (confirmListeners.size === 0) return Promise.resolve(false);
	const normalized = typeof messageOrOptions === "string" ? {
		message: messageOrOptions,
		...options
	} : messageOrOptions;
	return new Promise((resolve) => {
		const req = {
			id: `cfm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
			message: String(normalized.message || ""),
			title: normalized.title,
			confirmLabel: normalized.confirmLabel,
			cancelLabel: normalized.cancelLabel,
			destructive: normalized.destructive ?? normalized.danger ?? true,
			resolve
		};
		confirmListeners.forEach((fn) => {
			try {
				fn(req);
			} catch {}
		});
	});
}
//#endregion
//#region src/components/GlobalFeedbackHost.tsx
var GlobalFeedbackHost = () => {
	const [toasts, setToasts] = (0, import_react.useState)([]);
	const [confirmQueue, setConfirmQueue] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const unsubToast = subscribeFeedbackToasts((toast) => {
			setToasts((prev) => [...prev.slice(-2), toast]);
			window.setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== toast.id));
			}, 3600);
		});
		const unsubConfirm = subscribeFeedbackConfirms((req) => {
			setConfirmQueue((prev) => [...prev, req]);
		});
		return () => {
			unsubToast();
			unsubConfirm();
		};
	}, []);
	const activeConfirm = confirmQueue[0] || null;
	const handleResolveConfirm = (accepted) => {
		if (!activeConfirm) return;
		const current = activeConfirm;
		setConfirmQueue((prev) => prev.slice(1));
		current.resolve(accepted);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [toasts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed top-4 left-1/2 -translate-x-1/2 z-[260] w-[92%] max-w-sm space-y-2 pointer-events-none",
		"aria-live": "polite",
		children: toasts.map((toast) => {
			const toneStyles = toast.tone === "success" ? "bg-emerald-950/95 border-emerald-500/60 text-emerald-50" : toast.tone === "error" ? "bg-rose-950/95 border-rose-500/60 text-rose-50" : toast.tone === "warning" ? "bg-amber-950/95 border-amber-500/60 text-amber-50" : "bg-slate-900/95 border-slate-600/60 text-white";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${toneStyles}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "leading-snug",
					children: toast.message
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setToasts((prev) => prev.filter((t) => t.id !== toast.id)),
					className: "shrink-0 px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold cursor-pointer",
					"aria-label": "Close",
					children: "✕"
				})]
			}, toast.id);
		})
	}), activeConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[270] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-extrabold text-slate-900 dark:text-white mb-2",
					children: activeConfirm.title || "নিশ্চিতকরণ"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line",
					children: activeConfirm.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleResolveConfirm(false),
						className: "flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer",
						children: activeConfirm.cancelLabel || "বাতিল"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleResolveConfirm(true),
						className: `flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-sm transition-colors cursor-pointer ${activeConfirm.destructive ? "bg-[#E52E2E] hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`,
						children: activeConfirm.confirmLabel || "নিশ্চিত করুন"
					})]
				})
			]
		})
	})] });
};
//#endregion
//#region src/data/initialData.ts
var initialPaymentChannels = [
	{
		id: "ch-nagad",
		name: "নগদ",
		labelBn: "নগদ ওয়ালেট",
		labelEn: "Nagad Wallet",
		icon: "💵",
		imageUrl: "https://imagepaste.org/i/t4dassfe.png",
		color: "text-[#E52E2E]",
		bg: "bg-orange-50 dark:bg-orange-950/30",
		border: "border-orange-200 dark:border-orange-900/40",
		isDefault: true
	},
	{
		id: "ch-bkash",
		name: "বিকাশ",
		labelBn: "বিকাশ একাউন্ট",
		labelEn: "bKash Account",
		icon: "📱",
		imageUrl: "https://imagepaste.org/i/nr5kcshj.png",
		color: "text-[#D81B60]",
		bg: "bg-pink-50 dark:bg-pink-950/30",
		border: "border-pink-200 dark:border-pink-900/40",
		isDefault: true
	},
	{
		id: "ch-rocket",
		name: "রকেট",
		labelBn: "রকেট ডিবিবিএল",
		labelEn: "Rocket DBBL",
		icon: "🚀",
		imageUrl: "https://imagepaste.org/i/y9dgzfpq.png",
		color: "text-[#8E24AA]",
		bg: "bg-purple-50 dark:bg-purple-950/30",
		border: "border-purple-200 dark:border-purple-900/40",
		isDefault: true
	},
	{
		id: "ch-bank",
		name: "ব্যাংক",
		labelBn: "ব্যাংক হিসাব (সব ব্যাংক)",
		labelEn: "Bank Accounts (All Banks)",
		icon: "🏦",
		color: "text-[#2563EB]",
		bg: "bg-blue-50 dark:bg-blue-950/30",
		border: "border-blue-200 dark:border-blue-900/40",
		isDefault: true
	},
	{
		id: "ch-cash",
		name: "ক্যাশ",
		labelBn: "হাতে নগদ ক্যাশ",
		labelEn: "Cash on Hand",
		icon: "💰",
		imageUrl: "https://imagepaste.org/i/ejqxwxby.png",
		color: "text-[#2E7D32]",
		bg: "bg-emerald-50 dark:bg-emerald-950/30",
		border: "border-emerald-200 dark:border-emerald-900/40",
		isDefault: true
	}
];
var initialAppUsers = [
	{
		id: "admin-primary",
		name: "প্রত্যাশা অ্যাডমিন",
		phone: "01777877207",
		pin: "12588",
		role: "admin",
		status: "active",
		createdAt: "2026-10-01T00:00:00.000Z"
	},
	{
		id: "usr-1",
		name: "মোঃ জামাল উদ্দিন",
		phone: "01884542812",
		pin: "1234",
		role: "user",
		status: "active",
		createdAt: "2026-10-15T00:00:00.000Z"
	},
	{
		id: "usr-2",
		name: "মোঃ রফিকুল ইসলাম",
		phone: "01712345678",
		pin: "1234",
		role: "user",
		status: "active",
		createdAt: "2026-10-20T00:00:00.000Z"
	}
];
var initialTransactions = [];
var initialBanners = [
	{
		id: "banner-demo-1",
		badgeBn: "",
		badgeEn: "",
		titleBn: "",
		titleEn: "",
		subtitleBn: "",
		subtitleEn: "",
		imageUrl: "https://i.postimg.cc/mkZ5K2WX/76767.webp",
		linkUrl: "#",
		isActive: true,
		priority: 1
	},
	{
		id: "banner-demo-2",
		badgeBn: "",
		badgeEn: "",
		titleBn: "",
		titleEn: "",
		subtitleBn: "",
		subtitleEn: "",
		imageUrl: "https://i.postimg.cc/WzKwS2Nj/Picture-2026-11-12-12-02-17.webp",
		linkUrl: "#",
		isActive: true,
		priority: 2
	},
	{
		id: "banner-demo-3",
		badgeBn: "",
		badgeEn: "",
		titleBn: "",
		titleEn: "",
		subtitleBn: "",
		subtitleEn: "",
		imageUrl: "https://i.postimg.cc/63WcpjbX/Picture-2026-11-12-12-02-16.webp",
		linkUrl: "#",
		isActive: true,
		priority: 3
	}
];
var initialFooterConfig = {
	store: {
		bn: "স্টোর",
		en: "Store",
		url: "#store",
		icon: "📍"
	},
	offer: {
		bn: "অফার",
		en: "Offer",
		url: "#offer",
		icon: "🏷️"
	},
	help: {
		bn: "সাহায্য",
		en: "Help",
		url: "#help",
		icon: "❓"
	}
};
var initialStaffAccounts = [{
	id: "staff-1",
	name: "কাজী রাজু আহমেদ",
	phone: "01777877207",
	role: "প্রধান কালেকশন অফিসার",
	avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
	totalDue: 15e3,
	totalCollected: 12e3,
	remainingDue: 3e3,
	notes: "ইসলামপুর ক্যাবল জোন-১ কালেকশন ও অপটিক্যাল সাপোর্ট",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	transactions: [{
		id: "stx-1",
		staffId: "staff-1",
		type: "due",
		amount: 15e3,
		date: "2026-10-25",
		time: "10:00 AM",
		note: "ইসলামপুর দক্ষিণ ফিল্ড মান্থলি কালেকশন সিট ইস্যু",
		recordedBy: "অ্যাডমিন",
		created: Date.now() - 5e8
	}, {
		id: "stx-2",
		staffId: "staff-1",
		type: "collection",
		amount: 12e3,
		date: "2026-10-29",
		time: "04:30 PM",
		note: "ক্যাশ জমা ক্যাশিয়ার কাউন্টার",
		recordedBy: "অ্যাডমিন",
		created: Date.now() - 2e8
	}]
}, {
	id: "staff-2",
	name: "মোঃ রফিকুল ইসলাম",
	phone: "01884542812",
	role: "লাইন টেকনিশিয়ান ও সার্ভিস",
	avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
	totalDue: 8500,
	totalCollected: 7e3,
	remainingDue: 1500,
	notes: "জামালপুর রোড ড্রপ কেবল ও অনু রি-ইনস্টলেশন",
	createdAt: (/* @__PURE__ */ new Date()).toISOString(),
	transactions: [{
		id: "stx-3",
		staffId: "staff-2",
		type: "due",
		amount: 8500,
		date: "2026-10-26",
		time: "11:15 AM",
		note: "ফাইবার রাউটার সেলস কালেকশন দায়িত্ব",
		recordedBy: "অ্যাডমিন",
		created: Date.now() - 4e8
	}, {
		id: "stx-4",
		staffId: "staff-2",
		type: "collection",
		amount: 7e3,
		date: "2026-10-30",
		time: "02:00 PM",
		note: "বিকাশ মারফত কোম্পানি ফান্ডে জমা",
		recordedBy: "অ্যাডমিন",
		created: Date.now() - 1e8
	}]
}];
var initialQuickHisabOwners = [
	{
		id: "owner-1",
		name: "মালিক ১",
		shareUnits: 1,
		phone: "01711000001",
		address: "দত্তপাড়া, ইসলামপুর, জামালপুর",
		notes: "প্রতিষ্ঠাতা অংশীদার"
	},
	{
		id: "owner-2",
		name: "মালিক ২",
		shareUnits: 1,
		phone: "01711000002",
		address: "আনন্দ বাজার, ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-3",
		name: "মালিক ৩",
		shareUnits: 1,
		phone: "01711000003",
		address: "টানা ব্রীজ, ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-4",
		name: "মালিক ৪",
		shareUnits: 1,
		phone: "01711000004",
		address: "হাজী আবেদ আলী মার্কেট",
		notes: "অংশীদার"
	},
	{
		id: "owner-5",
		name: "মালিক ৫",
		shareUnits: 1,
		phone: "01711000005",
		address: "ইসলামপুর বাজার",
		notes: "অংশীদার"
	},
	{
		id: "owner-6",
		name: "মালিক ৬",
		shareUnits: 1,
		phone: "01711000006",
		address: "চর শিমুল চূড়া",
		notes: "অংশীদার"
	},
	{
		id: "owner-7",
		name: "মালিক ৭",
		shareUnits: 1,
		phone: "01711000007",
		address: "ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-8",
		name: "মালিক ৮",
		shareUnits: 1,
		phone: "01711000008",
		address: "দত্তপাড়া",
		notes: "অংশীদার"
	},
	{
		id: "owner-9",
		name: "মালিক ৯",
		shareUnits: 1,
		phone: "01711000009",
		address: "ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-10",
		name: "মালিক ১০",
		shareUnits: 1,
		phone: "01711000010",
		address: "জামালপুর সদর",
		notes: "অংশীদার"
	},
	{
		id: "owner-11",
		name: "মালিক ১১",
		shareUnits: 1,
		phone: "01711000011",
		address: "ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-12",
		name: "মালিক ১২",
		shareUnits: 1,
		phone: "01711000012",
		address: "ইসলামপুর",
		notes: "অংশীদার"
	},
	{
		id: "owner-13",
		name: "মালিক ১৩ (অর্ধেক অংশীদার)",
		shareUnits: .5,
		phone: "01711000013",
		address: "দত্তপাড়া আনন্দ বাজার",
		notes: "০.৫ শেয়ার অংশীদার",
		isHalf: true
	}
];
//#endregion
//#region src/utils/imageStorage.ts
/**
* Robust, client-side permanent image persistence utility using IndexedDB + safeStorage.
* 
* Why this is necessary:
* Cloud Run containers have ephemeral filesystems; files written to /public/uploads/
* are permanently destroyed when the container scales to 0 after 10-15 minutes of inactivity.
* By storing clean compressed data URLs (25KB - 45KB) in IndexedDB and safeStorage,
* images survive container scale-downs, browser restarts, and device reboots forever.
*/
var DB_NAME = "protyasha_storage_db";
var DB_VERSION = 1;
var STORE_NAME = "app_images";
var dbPromise = null;
function getDB() {
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		if (typeof window === "undefined" || !window.indexedDB) {
			reject(/* @__PURE__ */ new Error("IndexedDB not supported"));
			return;
		}
		const request = window.indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = () => {
			reject(request.error);
		};
	});
	return dbPromise;
}
/**
* Save an image permanently to IndexedDB and mirror to safeStorage
*/
async function savePersistentImage(key, dataUrl) {
	if (!key || !dataUrl) return;
	try {
		safeStorage.setItem(`protyasha_img_${key}`, dataUrl);
	} catch (e) {
		console.warn(`[ImageStorage] safeStorage quota reached for ${key}:`, e);
	}
	try {
		const db = await getDB();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(dataUrl, key);
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	} catch (err) {
		console.warn(`[ImageStorage] IndexedDB save error for ${key}:`, err);
	}
}
/**
* Retrieve an image from safeStorage or IndexedDB
*/
async function getPersistentImage(key) {
	if (!key) return null;
	try {
		const local = safeStorage.getItem(`protyasha_img_${key}`);
		if (local && local.startsWith("data:image/")) return local;
	} catch {}
	try {
		const db = await getDB();
		return new Promise((resolve) => {
			const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
			req.onsuccess = () => {
				const result = req.result;
				if (result && result.startsWith("data:image/")) {
					try {
						safeStorage.setItem(`protyasha_img_${key}`, result);
					} catch {}
					resolve(result);
				} else resolve(null);
			};
			req.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}
/**
* Get synchronous image from safeStorage immediately
*/
function getSyncPersistentImage(key, fallbackKey) {
	if (typeof window === "undefined") return "";
	try {
		const direct = safeStorage.getItem(`protyasha_img_${key}`);
		if (direct && direct.startsWith("data:image/")) return direct;
		if (fallbackKey) {
			const fallback = safeStorage.getItem(fallbackKey);
			if (fallback && fallback.startsWith("data:image/")) return fallback;
		}
	} catch {}
	return "";
}
/**
* Delete an image permanently from IndexedDB and safeStorage
*/
async function deletePersistentImage(key) {
	if (!key) return;
	try {
		safeStorage.removeItem(`protyasha_img_${key}`);
	} catch {}
	try {
		const db = await getDB();
		await new Promise((resolve) => {
			const req = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(key);
			req.onsuccess = () => resolve();
			req.onerror = () => resolve();
		});
	} catch {}
}
/**
* Cleanly compress an image file to a lightweight, crystal-clear Data URL (15-30KB)
* to safely store in Firestore (<1MB), IndexedDB, and safeStorage without quota errors.
*/
function compressImageFile(file, maxDim = 300, quality = .85) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			var _e$target;
			const src = (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.result;
			if (!src) {
				resolve("");
				return;
			}
			const img = new Image();
			img.onload = () => {
				let { width, height } = img;
				if (width > maxDim || height > maxDim) {
					if (width > height) {
						height = Math.round(height * maxDim / width);
						width = maxDim;
					} else {
						width = Math.round(width * maxDim / height);
						height = maxDim;
					}
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(img, 0, 0, width, height);
					try {
						const webp = canvas.toDataURL("image/webp", quality);
						if (webp && webp.startsWith("data:image/webp") && webp.length > 50) {
							resolve(webp);
							return;
						}
					} catch {}
					resolve(canvas.toDataURL("image/jpeg", quality));
					return;
				}
				resolve(src);
			};
			img.onerror = () => resolve(src);
			img.src = src;
		};
		reader.onerror = () => resolve("");
		reader.readAsDataURL(file);
	});
}
//#endregion
//#region src/assets/images/scenic_river_bridge_landscape_1792226647109.jpg
var scenic_river_bridge_landscape_1792226647109_default = new URL("scenic_river_bridge_landscape_1792226647109.jpg", import.meta.url).href;
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = (cspNonceMeta === null || cspNonceMeta === void 0 ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta === null || cspNonceMeta === void 0 ? void 0 : cspNonceMeta.getAttribute("nonce"));
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/components/Header.tsx
var Header = ({ lang, user, adminAvatar, unreadCount, onOpenNotifications, onOpenProfile, onOpenWeather, onOpenPrayerTimes, weatherData: propWeatherData }) => {
	const greeting = getGreeting(lang);
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const isSubAdmin = (user === null || user === void 0 ? void 0 : user.role) === "sub-admin";
	const isStaff = (user === null || user === void 0 ? void 0 : user.role) === "staff";
	const rawAvatar = (user === null || user === void 0 ? void 0 : user.avatarUrl) || adminAvatar || (typeof window !== "undefined" ? safeStorage.getItem("protyasha_admin_avatar") || safeStorage.getItem("protyasha_last_avatar") || safeStorage.getItem("protyasha_img_avatar_admin") || ((user === null || user === void 0 ? void 0 : user.id) ? safeStorage.getItem(`protyasha_img_avatar_user_${user.id}`) : "") || "" : "");
	const displayAvatar = rawAvatar ? String(rawAvatar).trim() : "";
	const [internalWeather, setInternalWeather] = (0, import_react.useState)(null);
	const [scrollProgress, setScrollProgress] = (0, import_react.useState)(0);
	const [avatarFailed, setAvatarFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setAvatarFailed(false);
	}, [displayAvatar]);
	const loadWeather = () => {
		__vitePreload(async () => {
			const { fetchLiveWeather } = await import("./chunk-weatherService.js").then((n) => n.l);
			return { fetchLiveWeather };
		}, __vite__mapDeps([0,1,2,3]), import.meta.url).then(({ fetchLiveWeather }) => fetchLiveWeather()).then((data) => {
			if (data) setInternalWeather(data);
		}).catch(() => {});
	};
	(0, import_react.useEffect)(() => {
		const initialWeatherTimer = propWeatherData ? void 0 : setTimeout(loadWeather, 4500);
		const interval = setInterval(loadWeather, 6e5);
		let rafId = 0;
		const updateScroll = () => {
			rafId = 0;
			const y = window.scrollY || document.documentElement.scrollTop || 0;
			const next = Math.min(1, Math.max(0, y / 56));
			setScrollProgress((prev) => Math.abs(prev - next) >= .04 || next === 0 || next === 1 ? next : prev);
		};
		const handleScroll = () => {
			if (!rafId) rafId = window.requestAnimationFrame(updateScroll);
		};
		updateScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			clearTimeout(initialWeatherTimer);
			clearInterval(interval);
			window.removeEventListener("scroll", handleScroll);
			if (rafId) window.cancelAnimationFrame(rafId);
		};
	}, []);
	const weatherData = propWeatherData || internalWeather;
	const isScrolled = scrollProgress > .08;
	const blurPx = isScrolled ? Number((scrollProgress * 20).toFixed(1)) : 0;
	const saturatePct = isScrolled ? Math.round(115 + scrollProgress * 65) : 100;
	const bannerBlurPx = isScrolled ? Number((scrollProgress * 4).toFixed(1)) : 0;
	const roleLabel = isAdmin ? lang === "bn" ? "এডমিন" : "Admin" : isSubAdmin ? lang === "bn" ? "সাব-এডমিন" : "Sub-Admin" : isStaff ? lang === "bn" ? "স্টাফ" : "Staff" : (user === null || user === void 0 ? void 0 : user.role) === "user" ? lang === "bn" ? "সদস্য" : "Member" : lang === "bn" ? "ভিজিটর" : "Visitor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "fixed top-0 left-0 right-0 z-50 pointer-events-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: blurPx > 0 ? {
					backdropFilter: `blur(${blurPx}px) saturate(${saturatePct}%)`,
					WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturatePct}%)`
				} : void 0,
				className: `pointer-events-auto w-full transition-all duration-300 ease-out border-b ${isScrolled ? "bg-white/78 dark:bg-slate-900/80 border-slate-200/75 dark:border-slate-700/70 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.14)] py-2" : "bg-transparent border-transparent shadow-none py-2.5"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/20 transition-opacity duration-300 ${isScrolled ? "opacity-100" : "opacity-0"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onOpenProfile,
						className: "flex items-center gap-2.5 min-w-0 min-h-[44px] text-left cursor-pointer group active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 rounded-2xl pr-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `relative w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-0.5 flex items-center justify-center overflow-hidden transition-shadow duration-300 ${isScrolled ? "shadow-sm shadow-rose-500/20" : "shadow-md shadow-black/25"}`,
							children: displayAvatar && !avatarFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: displayAvatar,
								alt: "Profile",
								referrerPolicy: "no-referrer",
								className: "w-full h-full object-cover rounded-full bg-white",
								onError: () => setAvatarFailed(true)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#E52E2E] font-bold text-lg leading-none",
									children: lang === "bn" ? "প্র" : "P"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-[11px] leading-tight",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-semibold truncate transition-colors duration-300 ${isScrolled ? "text-slate-700 dark:text-slate-300" : "text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"}`,
										children: greeting
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: isScrolled ? "text-slate-400 dark:text-slate-500" : "text-white/75",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-0.5 font-bold whitespace-nowrap shrink-0 transition-colors duration-300 ${isScrolled ? isAdmin ? "text-emerald-700 dark:text-emerald-400" : isSubAdmin ? "text-amber-700 dark:text-amber-400" : isStaff ? "text-teal-700 dark:text-teal-400" : (user === null || user === void 0 ? void 0 : user.role) === "user" ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-400" : isAdmin ? "text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : isSubAdmin ? "text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : isStaff ? "text-teal-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : (user === null || user === void 0 ? void 0 : user.role) === "user" ? "text-sky-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"}`,
										children: [(isAdmin || isSubAdmin || isStaff || (user === null || user === void 0 ? void 0 : user.role) === "user") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: roleLabel })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: `text-[13px] sm:text-base font-extrabold tracking-tight truncate leading-snug transition-colors duration-300 ${isScrolled ? "text-slate-900 dark:text-white" : "text-white drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.9)]"}`,
								children: lang === "bn" ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
						children: [
							onOpenPrayerTimes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									onOpenPrayerTimes();
								},
								"aria-label": lang === "bn" ? "নামাজের সময়সূচী ও ক্যালেন্ডার" : "Prayer Times & Calendar",
								title: lang === "bn" ? "নামাজের সময়সূচী ও ক্যালেন্ডার" : "Prayer Times & Calendar",
								className: `min-w-[40px] h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${isScrolled ? "bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 shadow-xs" : "bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base leading-none select-none",
									children: "🕌"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									onOpenWeather();
								},
								"aria-label": lang === "bn" ? "আবহাওয়ার তথ্য" : "Weather Info",
								className: `h-10 px-2.5 rounded-full border flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isScrolled ? "bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs" : "bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex items-center justify-center shrink-0",
									children: (weatherData === null || weatherData === void 0 ? void 0 : weatherData.conditionType) === "rain" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: `w-4 h-4 ${isScrolled ? "text-sky-600 dark:text-sky-400" : "text-sky-300"}` }) : (weatherData === null || weatherData === void 0 ? void 0 : weatherData.conditionType) === "thunder" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudLightning, { className: `w-4 h-4 ${isScrolled ? "text-amber-600 dark:text-amber-400" : "text-amber-300"}` }) : (weatherData === null || weatherData === void 0 ? void 0 : weatherData.conditionType) === "cloud" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: `w-4 h-4 ${isScrolled ? "text-slate-600 dark:text-slate-300" : "text-slate-100"}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: `w-4 h-4 ${isScrolled ? "text-amber-500 dark:text-amber-400" : "text-amber-300"}` })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col text-left leading-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-black tabular-nums whitespace-nowrap",
										children: weatherData ? `${toBengaliNumber(weatherData.currentTemp)}°C` : "২৮°C"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[9px] font-bold truncate max-w-[72px] whitespace-nowrap transition-colors ${isScrolled ? "text-rose-600 dark:text-rose-400" : "text-white/95"}`,
										children: (weatherData === null || weatherData === void 0 ? void 0 : weatherData.cityBn) || "জামালপুর"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onOpenNotifications,
								"aria-label": lang === "bn" ? "নোটিফিকেশন" : "Notifications",
								className: `relative min-w-[40px] h-10 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 ${isScrolled ? "bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs" : "bg-black/25 hover:bg-black/35 border-white/35 text-white shadow-md"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 bg-[#E52E2E] text-white text-[9px] font-black tabular-nums rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900",
									children: lang === "bn" ? toBengaliNumber(unreadCount) : unreadCount
								})]
							})
						]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative w-full overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-56 sm:h-64 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: scenic_river_bridge_landscape_1792226647109_default,
						alt: "Scenic Bangladeshi Landscape",
						decoding: "async",
						fetchPriority: "high",
						referrerPolicy: "no-referrer",
						style: bannerBlurPx > 0 ? {
							filter: `blur(${bannerBlurPx}px)`,
							transform: `scale(${1 + scrollProgress * .03})`
						} : void 0,
						className: "w-full h-full object-cover object-center transition-[filter,transform] duration-200 ease-out motion-reduce:transition-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 transition-opacity duration-1000 pointer-events-none ${(/* @__PURE__ */ new Date()).getHours() >= 18 || (/* @__PURE__ */ new Date()).getHours() < 6 ? "bg-indigo-900/25 opacity-100" : "bg-transparent opacity-0"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/55 to-transparent dark:from-slate-900 dark:via-slate-900/55 pointer-events-none" })
				]
			})
		})]
	});
};
//#endregion
//#region src/components/BalanceCard.tsx
var BalanceCard = ({ balance, lang }) => {
	const [isVisible, setIsVisible] = (0, import_react.useState)(false);
	const t = translations[lang];
	(0, import_react.useEffect)(() => {
		let timer;
		if (isVisible) timer = setTimeout(() => {
			setIsVisible(false);
		}, 7e3);
		return () => clearTimeout(timer);
	}, [isVisible]);
	const handleToggle = () => {
		sounds.playBalanceChime();
		const nextState = !isVisible;
		setIsVisible(nextState);
		if (nextState) __vitePreload(() => import("./chunk-confetti.module.js").then((mod) => {
			const runConfetti = mod.default || mod;
			if (typeof runConfetti === "function") runConfetti({
				particleCount: 28,
				spread: 45,
				origin: { y: .28 },
				colors: [
					"#E52E2E",
					"#FF9800",
					"#4CAF50",
					"#2196F3"
				],
				disableForReducedMotion: true
			});
		}), [], import.meta.url).catch(() => {});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative px-4 -mt-5 z-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: handleToggle,
			className: "relative overflow-hidden w-full bg-white dark:bg-slate-900 rounded-3xl p-3.5 shadow-md shadow-rose-900/5 dark:shadow-none border border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none active:scale-[0.985] transition-all duration-200 hover:border-rose-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-full bg-gradient-to-tr from-[#D32F2F] to-[#E52E2E] shadow-sm shadow-rose-500/30 flex items-center justify-center text-white text-xl font-bold",
					children: "৳"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col justify-center",
					children: isVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-in fade-in zoom-in-95 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mb-0.5",
							children: lang === "bn" ? "মোট বর্তমান ব্যালেন্স" : "Current Net Balance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold tracking-tight text-[#E52E2E] dark:text-rose-400 tabular-nums",
							children: formatCurrency(balance, lang)
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-in fade-in duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-[15px] font-semibold text-slate-800 dark:text-slate-200",
							children: t.tap_to_check_balance
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-400 dark:text-slate-500",
							children: lang === "bn" ? "ট্যাপ করে নগদ ও মোট হিসাব দেখুন" : "Tap to reveal live ledger"
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors",
				children: isVisible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-[11px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "লুকান" : "Hide" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
				})
			})]
		})
	});
};
//#endregion
//#region src/utils/permissions.ts
var SUB_ADMIN_EDIT_WINDOW_MS = 18e5;
var SUPPORT_TICKET_EDIT_WINDOW_MS = 6e5;
function isSubAdmin(user) {
	return (user === null || user === void 0 ? void 0 : user.role) === "sub-admin";
}
function hasSubAdminPermission(user, key) {
	if (!user) return false;
	if (user.role === "admin") return true;
	if (user.role === "staff") return key === "staffAttendance";
	if (user.role === "sub-admin") {
		if (!user.permissions || Object.keys(user.permissions).length === 0) return true;
		return user.permissions[key] === true;
	}
	return false;
}
function canAddTransactions(user) {
	if (!user) return false;
	if (user.role === "admin") return true;
	if (user.role === "sub-admin") return hasSubAdminPermission(user, "addTransactions");
	return false;
}
function isLoggedInSession(user) {
	return !!user && (user.role === "admin" || user.role === "sub-admin" || user.role === "staff" || user.role === "user");
}
function normalizePhoneNumber(phone) {
	if (!phone) return "";
	const digits = String(phone).replace(/[^\d]/g, "");
	if (digits.startsWith("880") && digits.length >= 13) return digits.slice(2);
	return digits;
}
function isTransactionOwner(trx, user) {
	if (!user) return false;
	if (user.role === "admin") return true;
	const recBy = (trx.recordedBy || "").trim();
	const recGmail = (trx.recordedByGmail || "").trim().toLowerCase();
	if (user.id && recBy && recBy === user.id) return true;
	if (user.phone && recBy && recBy === user.phone.trim()) return true;
	if (user.gmail && recGmail && recGmail === user.gmail.trim().toLowerCase()) return true;
	return false;
}
function canModifyTransaction(trx, user, now = Date.now()) {
	if (!user) return {
		allowed: false,
		isOwner: false,
		expired: false,
		remainingMs: 0
	};
	if (user.role === "admin") return {
		allowed: true,
		isOwner: true,
		expired: false,
		remainingMs: Number.POSITIVE_INFINITY
	};
	if (user.role === "sub-admin") {
		if (!hasSubAdminPermission(user, "addTransactions")) return {
			allowed: false,
			isOwner: false,
			expired: false,
			remainingMs: 0
		};
		if (!isTransactionOwner(trx, user)) return {
			allowed: false,
			isOwner: false,
			expired: false,
			remainingMs: 0
		};
		const createdMs = typeof trx.created === "number" && !isNaN(trx.created) ? trx.created : 0;
		if (createdMs <= 0) return {
			allowed: false,
			isOwner: true,
			expired: true,
			remainingMs: 0
		};
		const elapsed = Math.max(0, now - createdMs);
		const remainingMs = Math.max(0, SUB_ADMIN_EDIT_WINDOW_MS - elapsed);
		const allowed = elapsed <= SUB_ADMIN_EDIT_WINDOW_MS;
		return {
			allowed,
			isOwner: true,
			expired: !allowed,
			remainingMs
		};
	}
	return {
		allowed: false,
		isOwner: false,
		expired: false,
		remainingMs: 0
	};
}
function isSupportTicketOwner(ticket, user, staffSession) {
	if ((user === null || user === void 0 ? void 0 : user.role) === "admin") return true;
	const actorIds = [user === null || user === void 0 ? void 0 : user.id, staffSession === null || staffSession === void 0 ? void 0 : staffSession.staffId].map((v) => (v || "").trim()).filter(Boolean);
	const actorPhones = [user === null || user === void 0 ? void 0 : user.phone, staffSession === null || staffSession === void 0 ? void 0 : staffSession.phone].map((v) => normalizePhoneNumber(v)).filter((v) => v.length >= 6);
	const actorNames = [user === null || user === void 0 ? void 0 : user.name, staffSession === null || staffSession === void 0 ? void 0 : staffSession.name].map((v) => (v || "").trim().toLowerCase()).filter(Boolean);
	if (ticket.createdById && actorIds.includes(ticket.createdById.trim())) return true;
	const ticketCreatorPhone = normalizePhoneNumber(ticket.createdByPhone);
	if (ticketCreatorPhone && actorPhones.includes(ticketCreatorPhone)) return true;
	if (!ticket.createdById && !ticket.createdByPhone) {
		const customerPhone = normalizePhoneNumber(ticket.customerPhone);
		if (customerPhone && actorPhones.includes(customerPhone)) return true;
		const creatorName = (ticket.createdBy || "").trim().toLowerCase();
		if (creatorName && actorNames.includes(creatorName)) return true;
	}
	return false;
}
function canModifySupportTicket(ticket, user, staffSession, now = Date.now()) {
	if ((user === null || user === void 0 ? void 0 : user.role) === "admin") return {
		allowed: true,
		isAdmin: true,
		isOwner: true,
		expired: false,
		remainingMs: Number.POSITIVE_INFINITY
	};
	const canActAsSubAdmin = (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && hasSubAdminPermission(user, "supportTickets");
	const canActAsStaffSession = Boolean(staffSession) && (user === null || user === void 0 ? void 0 : user.role) !== "staff";
	if (!canActAsSubAdmin && !canActAsStaffSession) return {
		allowed: false,
		isAdmin: false,
		isOwner: false,
		expired: false,
		remainingMs: 0
	};
	const isOwner = isSupportTicketOwner(ticket, user, staffSession);
	const createdMs = ticket.createdAt ? new Date(ticket.createdAt).getTime() : 0;
	if (!createdMs || isNaN(createdMs)) return {
		allowed: false,
		isAdmin: false,
		isOwner,
		expired: true,
		remainingMs: 0
	};
	const elapsed = Math.max(0, now - createdMs);
	const remainingMs = Math.max(0, SUPPORT_TICKET_EDIT_WINDOW_MS - elapsed);
	const withinWindow = elapsed <= SUPPORT_TICKET_EDIT_WINDOW_MS;
	return {
		allowed: isOwner && withinWindow,
		isAdmin: false,
		isOwner,
		expired: !withinWindow,
		remainingMs
	};
}
function formatRemainingCountdown(remainingMs, isBn) {
	const totalSec = Math.max(0, Math.ceil(remainingMs / 1e3));
	const mins = Math.floor(totalSec / 60);
	const secs = totalSec % 60;
	const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	return isBn ? toBengaliNumber(formatted) : formatted;
}
//#endregion
//#region src/components/PrimaryFeatureCards.tsx
var PrimaryFeatureCards = ({ lang, user, serviceStatuses, onOpenBillManager, onOpenAyByay, onOpenQuickHisab }) => {
	var _serviceStatuses$bill, _serviceStatuses$bill2, _serviceStatuses$ayBy, _serviceStatuses$ayBy2, _serviceStatuses$quic, _serviceStatuses$quic2, _serviceStatuses$ayBy3;
	const isBn = lang === "bn";
	const isRoleBlocked = (key) => {
		if ((user === null || user === void 0 ? void 0 : user.role) === "staff") return key !== "staffAttendance";
		if ((user === null || user === void 0 ? void 0 : user.role) === "sub-admin") return !hasSubAdminPermission(user, key);
		return false;
	};
	const isBillRestricted = isRoleBlocked("billManager");
	const isAyByayRestricted = isRoleBlocked("ayByay");
	const isQuickHisabRestricted = isRoleBlocked("quickHisab");
	const isBillLocked = isBillRestricted || ((_serviceStatuses$bill = serviceStatuses.billManager) === null || _serviceStatuses$bill === void 0 ? void 0 : _serviceStatuses$bill.isActive) === false || String((_serviceStatuses$bill2 = serviceStatuses.billManager) === null || _serviceStatuses$bill2 === void 0 ? void 0 : _serviceStatuses$bill2.isActive) === "false";
	const isAyByayLocked = isAyByayRestricted || ((_serviceStatuses$ayBy = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy === void 0 ? void 0 : _serviceStatuses$ayBy.isActive) === false || String((_serviceStatuses$ayBy2 = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy2 === void 0 ? void 0 : _serviceStatuses$ayBy2.isActive) === "false";
	const isQuickHisabLocked = isQuickHisabRestricted || ((_serviceStatuses$quic = serviceStatuses.quickHisab) === null || _serviceStatuses$quic === void 0 ? void 0 : _serviceStatuses$quic.isActive) === false || String((_serviceStatuses$quic2 = serviceStatuses.quickHisab) === null || _serviceStatuses$quic2 === void 0 ? void 0 : _serviceStatuses$quic2.isActive) === "false";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 pt-1 pb-3 select-none space-y-2.5 sm:space-y-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2.5 sm:gap-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => {
					sounds.playTap();
					onOpenBillManager();
				},
				role: "button",
				tabIndex: 0,
				className: `group relative overflow-hidden rounded-3xl p-3 sm:p-4 text-white shadow-md cursor-pointer border active:scale-[0.98] transition-all flex flex-col justify-between min-h-[105px] sm:min-h-[115px] ${isBillLocked ? "bg-slate-500/80 grayscale border-slate-400/30" : "bg-gradient-to-br from-[#FF4500] via-[#FF6A3D] to-[#FF8C00] shadow-orange-500/20 border-white/20 hover:shadow-lg hover:shadow-orange-500/30"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-2 -bottom-1 text-white/10 pointer-events-none group-hover:text-white/15 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-14 h-14 sm:w-18 sm:h-18 stroke-[1.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between relative z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 stroke-[2.2]" })
						}), isBillRestricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/35 text-white",
							children: isBn ? "সীমিত" : "Locked"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 stroke-[2.5]" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs sm:text-sm md:text-base font-black tracking-tight drop-shadow-xs leading-snug",
							children: isBn ? "বিল ম্যানেজমেন্ট প্রো" : "Bill Management Pro"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] sm:text-[11px] text-white/90 font-medium mt-0.5 truncate",
							children: isBillRestricted ? isBn ? "অনুমতি সীমাবদ্ধ" : "Access restricted" : isBn ? "স্মার্ট বিলিং ও কালেকশন" : "Smart Billing System"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => {
					sounds.playTap();
					onOpenAyByay();
				},
				role: "button",
				tabIndex: 0,
				className: `group relative overflow-hidden rounded-3xl p-3 sm:p-4 text-white shadow-md cursor-pointer border active:scale-[0.98] transition-all flex flex-col justify-between min-h-[105px] sm:min-h-[115px] ${isAyByayLocked ? "bg-slate-600/90 grayscale border-slate-500/40" : "bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F766E] shadow-teal-950/30 border-teal-500/30 hover:shadow-lg hover:shadow-teal-900/40"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-2 -bottom-1 text-teal-400/10 pointer-events-none group-hover:text-teal-400/15 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-14 h-14 sm:w-18 sm:h-18 stroke-[1.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between relative z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white shadow-xs p-0.5 flex items-center justify-center border border-teal-400/40 overflow-hidden shrink-0 group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: ((_serviceStatuses$ayBy3 = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy3 === void 0 ? void 0 : _serviceStatuses$ayBy3.logoUrl) || "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png",
								alt: "আয়-ব্যয় লোগো",
								className: "w-full h-full object-contain rounded-lg"
							})
						}), isAyByayRestricted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/35 text-white",
							children: isBn ? "সীমিত" : "Locked"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 group-hover:translate-x-0.5 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 stroke-[2.5]" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs sm:text-sm md:text-base font-black tracking-tight drop-shadow-xs leading-snug",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-400",
									children: isBn ? "আয়" : "Income"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-400",
									children: isBn ? "ব্যয়" : "Expense"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white ml-1",
									children: isBn ? "হিসাব" : "Ledger"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate",
							children: isAyByayRestricted ? isBn ? "অনুমতি সীমাবদ্ধ" : "Access restricted" : isBn ? "স্মার্ট দৈনন্দিন খাতা" : "Daily Accounts"
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => {
				sounds.playTap();
				onOpenQuickHisab();
			},
			role: "button",
			tabIndex: 0,
			className: `group relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer border active:scale-[0.99] transition-all flex items-center justify-between min-h-[90px] ${isQuickHisabLocked ? "bg-slate-700/80 grayscale border-slate-600/30 shadow-none" : "border-rose-500/20 bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] hover:shadow-xl"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-[-5%] top-[-20%] opacity-10 pointer-events-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-24 h-24 stroke-[1]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 relative z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform ${isQuickHisabLocked ? "bg-slate-600/40 text-slate-400 border-slate-500/30" : "bg-rose-600/20 backdrop-blur-md text-rose-500 border-rose-500/30"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-7 h-7 stroke-[2.5]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-black tracking-tight drop-shadow-xs leading-tight",
							children: isBn ? "কুইক হিসাব" : "Quick Hisab"
						}), isQuickHisabLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600",
							children: isQuickHisabRestricted ? isBn ? "অনুমতি সীমাবদ্ধ" : "Restricted" : isBn ? "বন্ধ রয়েছে" : "Offline"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5",
						children: isBn ? "কোম্পানি আয়-ব্যয় ও ১২.৫ শেয়ার বণ্টন ড্যাশবোর্ড" : "Company Income-Expense & 12.5 Shares Profit Dashboard"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:translate-x-1 transition-transform relative z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 stroke-[3]" })
				})
			]
		})]
	});
};
var OperationsHubCards = ({ lang, user, serviceStatuses = {}, openTicketsCount = 0, todayPresentCount = 0, totalStaffCount = 0, onOpenSupportTickets, onOpenStaffAttendance }) => {
	var _serviceStatuses$supp, _serviceStatuses$supp2, _serviceStatuses$staf, _serviceStatuses$staf2;
	if (!onOpenSupportTickets && !onOpenStaffAttendance) return null;
	const isBn = lang === "bn";
	const isTicketsRestricted = (user === null || user === void 0 ? void 0 : user.role) === "staff" || (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && !hasSubAdminPermission(user, "supportTickets");
	const isAttendanceRestricted = (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && !hasSubAdminPermission(user, "staffAttendance");
	const isTicketsLocked = isTicketsRestricted || ((_serviceStatuses$supp = serviceStatuses.supportTickets) === null || _serviceStatuses$supp === void 0 ? void 0 : _serviceStatuses$supp.isActive) === false || String((_serviceStatuses$supp2 = serviceStatuses.supportTickets) === null || _serviceStatuses$supp2 === void 0 ? void 0 : _serviceStatuses$supp2.isActive) === "false";
	const isAttendanceLocked = isAttendanceRestricted || ((_serviceStatuses$staf = serviceStatuses.staffAttendance) === null || _serviceStatuses$staf === void 0 ? void 0 : _serviceStatuses$staf.isActive) === false || String((_serviceStatuses$staf2 = serviceStatuses.staffAttendance) === null || _serviceStatuses$staf2 === void 0 ? void 0 : _serviceStatuses$staf2.isActive) === "false";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 pt-1 pb-3 select-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2.5 sm:gap-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					sounds.playTap();
					onOpenSupportTickets === null || onOpenSupportTickets === void 0 || onOpenSupportTickets();
				},
				className: `group text-left p-3 rounded-2xl border shadow-xs active:scale-[0.98] transition-all flex flex-col justify-between min-h-[88px] cursor-pointer ${isTicketsLocked ? "bg-slate-100/90 dark:bg-slate-900/60 border-slate-300/80 dark:border-slate-800 grayscale opacity-75" : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-4 h-4 stroke-[2.2]" })
					}), isTicketsLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
						children: isTicketsRestricted ? isBn ? "সীমিত" : "Locked" : isBn ? "বন্ধ" : "Off"
					}) : openTicketsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 tabular-nums",
						children: isBn ? toBengaliNumber(openTicketsCount) : openTicketsCount
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate",
						children: isBn ? "সাপোর্ট টিকেট" : "Support Tickets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5",
						children: isTicketsLocked ? isTicketsRestricted ? isBn ? "শুধুমাত্র অনুমোদিতদের জন্য" : "Permission required" : isBn ? "সাময়িকভাবে বন্ধ" : "Temporarily off" : openTicketsCount > 0 ? isBn ? `${toBengaliNumber(openTicketsCount)}টি খোলা` : `${openTicketsCount} open` : isBn ? "কমপ্লেইন ট্র্যাকার" : "Live tracker"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					sounds.playTap();
					onOpenStaffAttendance === null || onOpenStaffAttendance === void 0 || onOpenStaffAttendance();
				},
				className: `group text-left p-3 rounded-2xl border shadow-xs active:scale-[0.98] transition-all flex flex-col justify-between min-h-[88px] cursor-pointer ${isAttendanceLocked ? "bg-slate-100/90 dark:bg-slate-900/60 border-slate-300/80 dark:border-slate-800 grayscale opacity-75" : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4 stroke-[2.2]" })
					}), isAttendanceLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
						children: isAttendanceRestricted ? isBn ? "সীমিত" : "Locked" : isBn ? "বন্ধ" : "Off"
					}) : totalStaffCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-black px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 tabular-nums",
						children: isBn ? `${toBengaliNumber(todayPresentCount)}/${toBengaliNumber(totalStaffCount)}` : `${todayPresentCount}/${totalStaffCount}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate",
						children: isBn ? "স্টাফ হাজিরা" : "Attendance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5",
						children: isAttendanceLocked ? isAttendanceRestricted ? isBn ? "অনুমতি সীমাবদ্ধ" : "Permission required" : isBn ? "সাময়িকভাবে বন্ধ" : "Temporarily off" : isBn ? "হাজিরা ও ছুটি" : "Daily & Leaves"
					})]
				})]
			})]
		})
	});
};
//#endregion
//#region src/components/PromoCarousel.tsx
var FALLBACK_BANNER_IMAGE = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80";
var PromoCarousel = ({ banners, lang, user, onExploreOffer, onOpenBannerManager }) => {
	const activeBanners = (0, import_react.useMemo)(() => {
		return (banners || []).filter((b) => b && b.isActive !== false);
	}, [banners]);
	const isSingle = activeBanners.length <= 1;
	const clonedList = (0, import_react.useMemo)(() => {
		if (isSingle) return activeBanners;
		const last = activeBanners[activeBanners.length - 1];
		const first = activeBanners[0];
		return [
			last,
			...activeBanners,
			first
		];
	}, [activeBanners, isSingle]);
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(isSingle ? 0 : 1);
	const [isTransitioning, setIsTransitioning] = (0, import_react.useState)(false);
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const [dragOffset, setDragOffset] = (0, import_react.useState)(0);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const dragStartXRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setCurrentIndex(isSingle ? 0 : 1);
		setIsTransitioning(false);
		setDragOffset(0);
	}, [activeBanners.length, isSingle]);
	(0, import_react.useEffect)(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) setIsPaused(true);
			else {
				setIsPaused(false);
				if (!isSingle) setCurrentIndex((prev) => {
					if (prev < 1 || prev > activeBanners.length) {
						setIsTransitioning(false);
						return 1;
					}
					return prev;
				});
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [activeBanners.length, isSingle]);
	(0, import_react.useEffect)(() => {
		if (isSingle) return;
		if (currentIndex === activeBanners.length + 1) {
			const timer = setTimeout(() => {
				setIsTransitioning(false);
				setCurrentIndex(1);
			}, 360);
			return () => clearTimeout(timer);
		}
		if (currentIndex === 0) {
			const timer = setTimeout(() => {
				setIsTransitioning(false);
				setCurrentIndex(activeBanners.length);
			}, 360);
			return () => clearTimeout(timer);
		}
		if (currentIndex > activeBanners.length + 1 || currentIndex < 0) {
			setIsTransitioning(false);
			setCurrentIndex(1);
		}
	}, [
		currentIndex,
		activeBanners.length,
		isSingle
	]);
	(0, import_react.useEffect)(() => {
		if (isSingle || isPaused || isDragging) return;
		const timer = setInterval(() => {
			setIsTransitioning(true);
			setCurrentIndex((prev) => {
				if (prev >= activeBanners.length + 1) return 2;
				return prev + 1;
			});
		}, 4500);
		return () => clearInterval(timer);
	}, [
		isSingle,
		isPaused,
		isDragging,
		activeBanners.length
	]);
	const handleTransitionEnd = (e) => {
		if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
		if (isSingle) return;
		if (currentIndex === 0) {
			setIsTransitioning(false);
			setCurrentIndex(activeBanners.length);
		} else if (currentIndex === activeBanners.length + 1) {
			setIsTransitioning(false);
			setCurrentIndex(1);
		}
	};
	const realSlideIndex = (0, import_react.useMemo)(() => {
		if (activeBanners.length === 0 || isSingle) return 0;
		if (currentIndex === 0) return activeBanners.length - 1;
		if (currentIndex === activeBanners.length + 1) return 0;
		const idx = currentIndex - 1;
		return idx >= 0 && idx < activeBanners.length ? idx : 0;
	}, [
		currentIndex,
		activeBanners.length,
		isSingle
	]);
	const handleDragStart = (clientX) => {
		dragStartXRef.current = clientX;
		setIsDragging(true);
		setIsPaused(true);
		setDragOffset(0);
	};
	const handleDragMove = (clientX) => {
		if (!isDragging || dragStartXRef.current === null) return;
		const offset = clientX - dragStartXRef.current;
		setDragOffset(offset);
	};
	const handleDragEnd = () => {
		if (!isDragging) return;
		setIsDragging(false);
		setIsPaused(false);
		if (Math.abs(dragOffset) > 20 && !isSingle) {
			sounds.playTap();
			setIsTransitioning(true);
			if (dragOffset < 0) setCurrentIndex((prev) => Math.min(prev + 1, activeBanners.length + 1));
			else setCurrentIndex((prev) => Math.max(prev - 1, 0));
		}
		setDragOffset(0);
		dragStartXRef.current = null;
	};
	if (activeBanners.length === 0) {
		if ((user === null || user === void 0 ? void 0 : user.role) === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-2 select-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 text-slate-400" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-300",
						children: lang === "bn" ? "ডাটাবেসে কোনো সক্রিয় বিজ্ঞাপন নেই" : "No active ads in database"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							onOpenBannerManager();
						},
						className: "text-xs font-bold text-white bg-[#E52E2E] hover:bg-rose-700 px-3.5 py-1.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer",
						children: lang === "bn" ? "+ নতুন বিজ্ঞাপন যোগ করুন" : "+ Add New Ad"
					})
				]
			})
		});
		return null;
	}
	const trackWidthPercent = isSingle ? 100 : clonedList.length * 100;
	const slideWidthPercent = isSingle ? 100 : 100 / clonedList.length;
	const translatePercent = isSingle ? 0 : currentIndex * 100 / clonedList.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-1.5 select-none relative w-full max-w-full mx-auto",
		children: [(user === null || user === void 0 ? void 0 : user.role) === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-1.5 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-[#E52E2E]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "মেইন পেইজ বিজ্ঞাপন" : "Homepage Featured Ads" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-[#E52E2E] dark:text-rose-400",
						children: [activeBanners.length, "টি"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						sounds.playTap();
						onOpenBannerManager();
					},
					className: "flex items-center gap-1 text-[10px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/60 px-2 py-0.5 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "বিজ্ঞাপন নিয়ন্ত্রণ" : "Manage Ads" })]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onMouseDown: (e) => handleDragStart(e.clientX),
			onMouseMove: (e) => handleDragMove(e.clientX),
			onMouseUp: handleDragEnd,
			onMouseLeave: handleDragEnd,
			onTouchStart: (e) => handleDragStart(e.touches[0].clientX),
			onTouchMove: (e) => handleDragMove(e.touches[0].clientX),
			onTouchEnd: handleDragEnd,
			className: `relative overflow-hidden rounded-2xl bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-800 touch-pan-y select-none h-28 sm:h-36 md:h-40 lg:h-44 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full",
				onTransitionEnd: handleTransitionEnd,
				style: {
					width: `${trackWidthPercent}%`,
					transform: `translateX(calc(-${translatePercent}% + ${dragOffset}px))`,
					transition: isDragging || !isTransitioning ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)"
				},
				children: clonedList.map((banner, index) => {
					const hasBannerLink = Boolean(banner.linkUrl && banner.linkUrl.trim() !== "" && banner.linkUrl.trim() !== "#" && banner.linkUrl.trim() !== "none");
					const hasText = Boolean(banner.titleBn && banner.titleBn.trim() || banner.titleEn && banner.titleEn.trim() || banner.badgeBn && banner.badgeBn.trim() || banner.badgeEn && banner.badgeEn.trim() || banner.subtitleBn && banner.subtitleBn.trim() || banner.subtitleEn && banner.subtitleEn.trim());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							if (!isDragging && hasBannerLink) {
								sounds.playTap();
								onExploreOffer(banner);
							}
						},
						style: { width: `${slideWidthPercent}%` },
						className: `relative h-full shrink-0 overflow-hidden bg-slate-900 ${hasBannerLink ? "cursor-pointer" : "cursor-grab"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: banner.imageUrl || FALLBACK_BANNER_IMAGE,
								alt: banner.titleBn || "বিজ্ঞাপন",
								referrerPolicy: "no-referrer",
								draggable: false,
								onError: (e) => {
									const target = e.currentTarget;
									if (target.src !== FALLBACK_BANNER_IMAGE) target.src = FALLBACK_BANNER_IMAGE;
								},
								className: "w-full h-full object-cover object-center pointer-events-none select-none"
							}),
							(Boolean(banner.badgeBn && banner.badgeBn.trim()) || Boolean(banner.badgeEn && banner.badgeEn.trim())) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-2.5 left-2.5 z-10 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-[#ff5722] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs",
									children: banner.badgeBn || banner.badgeEn
								})
							}),
							hasBannerLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-2.5 right-2.5 z-10 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-0.5 bg-white/25 hover:bg-white/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/40 shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "বিস্তারিত" : "Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3 stroke-[2.5]" })]
								})
							}),
							hasText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center justify-start px-3.5 py-2.5 text-white pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-[70%] mt-3",
									children: [(banner.titleBn || banner.titleEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs sm:text-sm font-black text-white leading-tight line-clamp-1 drop-shadow-sm",
										children: lang === "bn" ? banner.titleBn : banner.titleEn
									}), (banner.subtitleBn || banner.subtitleEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-200 line-clamp-1 opacity-90 mt-0.5",
										children: lang === "bn" ? banner.subtitleBn : banner.subtitleEn
									})]
								})
							})
						]
					}, `${banner.id}-${index}`);
				})
			}), activeBanners.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-1.5 left-0 right-0 z-20 flex justify-center items-center gap-1 pointer-events-none",
				children: activeBanners.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.stopPropagation();
						sounds.playTap();
						setIsTransitioning(true);
						setCurrentIndex(idx + 1);
					},
					className: `transition-all duration-300 pointer-events-auto cursor-pointer ${realSlideIndex === idx ? "w-4 h-1.5 rounded-full bg-white shadow-xs" : "w-1.5 h-1.5 rounded-full bg-white/60 hover:bg-white"}`,
					"aria-label": `Slide ${idx + 1}`
				}, idx))
			})]
		})]
	});
};
//#endregion
//#region src/components/SmartChannelIcon.tsx
var SmartChannelIcon = ({ method, imageUrl, className = "w-5 h-5" }) => {
	const [imgError, setImgError] = import_react.useState(false);
	import_react.useEffect(() => {
		setImgError(false);
	}, [imageUrl]);
	const norm = (method || "").trim();
	const lower = norm.toLowerCase();
	const autoLogos = {
		"বিকাশ": "https://imagepaste.org/i/nr5kcshj.png",
		"রকেট": "https://imagepaste.org/i/y9dgzfpq.png",
		"নগদ": "https://imagepaste.org/i/t4dassfe.png",
		"ক্যাশ": "https://imagepaste.org/i/ejqxwxby.png"
	};
	const finalImageUrl = imageUrl || autoLogos[norm] || (lower.includes("bkash") ? autoLogos["বিকাশ"] : lower.includes("rocket") ? autoLogos["রকেট"] : lower.includes("nagad") ? autoLogos["নগদ"] : lower.includes("cash") ? autoLogos["ক্যাশ"] : void 0);
	if (finalImageUrl && !imgError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: finalImageUrl,
		alt: method,
		referrerPolicy: "no-referrer",
		className: "w-full h-full object-cover rounded-xl shadow-xs",
		onError: () => setImgError(true)
	});
	if (norm === "বিকাশ" || lower.includes("bkash") || lower.includes("বিকাশ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full h-full rounded-xl bg-[#E2136E] text-white flex flex-col items-center justify-center p-1 shadow-sm relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-black text-[10px] tracking-tighter leading-none text-white",
			children: "bKash"
		})
	});
	if (norm === "নগদ" || lower.includes("nagad") || lower.includes("নগদ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full h-full rounded-xl bg-[#F47920] text-white flex flex-col items-center justify-center p-1 shadow-sm relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-black text-[9px] tracking-tighter leading-none text-white",
			children: "নগদ"
		})
	});
	if (norm === "রকেট" || lower.includes("rocket") || lower.includes("রকেট")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full h-full rounded-xl bg-[#8A2BE2] text-white flex flex-col items-center justify-center p-1 shadow-sm relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-black text-[9px] tracking-tighter leading-none text-white",
			children: "Rocket"
		})
	});
	if (norm === "ব্যাংক" || lower.includes("bank") || lower.includes("ব্যাংক")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		stroke: "currentColor",
		strokeWidth: "1.9",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M3 9.5L12 3L21 9.5V11H3V9.5Z",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 11V18M9 11V18M15 11V18M19 11V18",
				strokeWidth: "2.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M2 18H22V21H2V18Z",
				fill: "currentColor",
				fillOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "7.5",
				r: "1.2",
				fill: "white"
			})
		]
	});
	if (norm === "ক্যাশ" || lower.includes("cash") || lower.includes("ক্যাশ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		stroke: "currentColor",
		strokeWidth: "1.9",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "4",
				width: "16",
				height: "11",
				rx: "2",
				strokeOpacity: "0.4",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "2",
				y: "8",
				width: "17",
				height: "12",
				rx: "2.5",
				fill: "currentColor",
				fillOpacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "10.5",
				cy: "14",
				r: "2.5",
				stroke: "white",
				strokeWidth: "1.6",
				fill: "white",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 11H6.5M14.5 17H16",
				stroke: "white",
				strokeWidth: "1.6"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletCards, {
		className,
		strokeWidth: 2
	});
};
function getChannelGradient(method) {
	const norm = (method || "").trim().toLowerCase();
	if (norm.includes("নগদ")) return "bg-gradient-to-tr from-orange-500 via-[#F47920] to-rose-600 text-white shadow-md shadow-orange-500/25";
	if (norm.includes("বিকাশ")) return "bg-gradient-to-tr from-[#E91E63] via-[#E2136E] to-[#AD1457] text-white shadow-md shadow-pink-500/25";
	if (norm.includes("রকেট")) return "bg-gradient-to-tr from-[#9C27B0] via-[#8A2BE2] to-[#4A148C] text-white shadow-md shadow-purple-500/25";
	if (norm.includes("ব্যাংক")) return "bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30";
	if (norm.includes("ক্যাশ")) return "bg-gradient-to-tr from-[#15803D] via-[#16A34A] to-[#22C55E] text-white shadow-md shadow-emerald-500/25";
	return "bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-md shadow-slate-900/25";
}
//#endregion
//#region src/components/QuickChannels.tsx
var QuickChannels = ({ transactions, channels, staffAccounts = [], lang, user, onSelectMethod, onOpenChannelManager, onOpenIncome, onOpenExpense, onOpenLedger, onOpenStaffManager, serviceStatuses, currentMonthIndex, currentYear }) => {
	var _serviceStatuses$tran, _serviceStatuses$tran2, _serviceStatuses$staf, _serviceStatuses$staf2, _serviceStatuses$ledg, _serviceStatuses$ledg2;
	const isBn = lang === "bn";
	const canAddTrx = canAddTransactions(user);
	const isTrxRestricted = (user === null || user === void 0 ? void 0 : user.role) === "staff" || (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && !hasSubAdminPermission(user, "transactions");
	const isStaffManagerRestricted = (user === null || user === void 0 ? void 0 : user.role) === "staff" || (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && !hasSubAdminPermission(user, "staffManager");
	const isTrxLocked = isTrxRestricted || ((_serviceStatuses$tran = serviceStatuses.transactions) === null || _serviceStatuses$tran === void 0 ? void 0 : _serviceStatuses$tran.isActive) === false || String((_serviceStatuses$tran2 = serviceStatuses.transactions) === null || _serviceStatuses$tran2 === void 0 ? void 0 : _serviceStatuses$tran2.isActive) === "false";
	const isStaffLocked = isStaffManagerRestricted || ((_serviceStatuses$staf = serviceStatuses.staffManager) === null || _serviceStatuses$staf === void 0 ? void 0 : _serviceStatuses$staf.isActive) === false || String((_serviceStatuses$staf2 = serviceStatuses.staffManager) === null || _serviceStatuses$staf2 === void 0 ? void 0 : _serviceStatuses$staf2.isActive) === "false";
	((_serviceStatuses$ledg = serviceStatuses.ledger) === null || _serviceStatuses$ledg === void 0 ? void 0 : _serviceStatuses$ledg.isActive) === false || String((_serviceStatuses$ledg2 = serviceStatuses.ledger) === null || _serviceStatuses$ledg2 === void 0 ? void 0 : _serviceStatuses$ledg2.isActive);
	const normalizeMethodName = (rawMethod) => {
		if (!rawMethod) return "";
		const m = String(rawMethod).trim().toLowerCase();
		if (m.includes("bkash") || m.includes("বিকাশ")) return "বিকাশ";
		if (m.includes("rocket") || m.includes("রকেট")) return "রকেট";
		if (m.includes("cash") || m.includes("ক্যাশ")) return "ক্যাশ";
		if (m.includes("nagad") || m.includes("নগদ")) return "নগদ";
		if (m.includes("bank") || m.includes("ব্যাংক") || m.includes("চেক") || m.includes("check")) return "ব্যাংক";
		return String(rawMethod).trim();
	};
	const filteredTransactions = transactions.filter((t) => {
		if (!t || t.isDeleted === true || t.isDeleted === "true") return false;
		const rawDate = t.date || t.createdAt || t.created;
		if (!rawDate) return true;
		if (typeof rawDate === "string" && rawDate.includes("-")) {
			const parts = rawDate.split("T")[0].split("-");
			if (parts.length >= 2) {
				const year = parseInt(parts[0], 10);
				return parseInt(parts[1], 10) - 1 === currentMonthIndex && year === currentYear;
			}
		}
		const d = new Date(rawDate);
		if (!isNaN(d.getTime())) return d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear;
		return true;
	});
	const balances = {};
	channels.forEach((ch) => {
		balances[ch.name] = 0;
	});
	filteredTransactions.forEach((trx) => {
		const rawMethod = trx.method || trx.paymentMethod;
		const targetChannel = normalizeMethodName(rawMethod);
		const amt = Number(trx.amount) || 0;
		const isIncome = trx.type === "income" || trx.categoryType === "income";
		if (balances[targetChannel] !== void 0) {
			if (isIncome) balances[targetChannel] += amt;
			else balances[targetChannel] -= amt;
		} else if (rawMethod && balances[rawMethod] !== void 0) {
			if (isIncome) balances[rawMethod] += amt;
			else balances[rawMethod] -= amt;
		}
	});
	const bankChannel = channels.find((c) => c.name === "ব্যাংক");
	const bankBalance = balances["ব্যাংক"] || 0;
	const nonBankChannels = channels.filter((c) => c.name !== "ব্যাংক");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-3 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletCards, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পেমেন্ট চ্যানেল ও ব্যালেন্স হিসাব" : "Payment Channels & Balance" })]
				}), canAddTrx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onOpenIncome();
							},
							className: "flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "টাকা জমা" : "+ Deposit" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onOpenExpense();
							},
							className: "flex items-center gap-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "টাকা খরচ" : "- Expense" })]
						}),
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onOpenChannelManager();
							},
							className: "flex items-center gap-1 text-[11px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/60 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "w-3.5 h-3.5 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ম্যানেজ" : "Manage" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [bankChannel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => {
					sounds.playTap();
					onSelectMethod("ব্যাংক");
				},
				className: `mb-3 p-3.5 rounded-3xl border shadow-xs cursor-pointer hover:shadow-md active:scale-[0.985] transition-all flex items-center justify-between group ${isTrxLocked ? "bg-slate-200 dark:bg-slate-800 grayscale border-slate-300 dark:border-slate-700 opacity-70" : "bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border-blue-200/80 dark:border-blue-900/50"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-12 h-12 rounded-2xl flex items-center justify-center ${getChannelGradient("ব্যাংক")} group-hover:scale-105 transition-transform`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartChannelIcon, {
							method: "ব্যাংক",
							className: "w-6 h-6 text-white"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-bold text-slate-900 dark:text-white",
							children: isBn ? "ব্যাংক লেনদেন (সকল ব্যাংক)" : "Bank Accounts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 uppercase tracking-wider",
							children: isBn ? "ব্যাংক" : "Bank"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
						children: isBn ? "ব্র্যাক, ইসলামী ব্যাংক, ডাচ-বাংলা ইত্যাদি" : "BRAC, IBBL, DBBL & other banks"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-base font-extrabold text-blue-700 dark:text-blue-400 tabular-nums",
						children: formatCurrency(bankBalance, lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-end gap-0.5 mt-0.5 group-hover:text-blue-600 transition-colors",
						children: [isBn ? "স্টেটমেন্ট" : "Details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" })]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3",
				children: nonBankChannels.map((ch) => {
					const bal = balances[ch.name] || 0;
					const iconGradient = getChannelGradient(ch.name);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							sounds.playTap();
							onSelectMethod(ch.name);
						},
						className: `p-3.5 rounded-3xl border shadow-2xs cursor-pointer hover:shadow-md active:scale-98 transition-all flex flex-col justify-between group ${isTrxLocked ? "bg-slate-200 dark:bg-slate-800 grayscale border-slate-300 dark:border-slate-700 opacity-70" : `${ch.bg} border-${ch.border.split(" ")[0].replace("border-", "")}`} ${!isTrxLocked && ch.border}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-10 h-10 rounded-2xl flex items-center justify-center ${iconGradient} group-hover:scale-105 transition-transform overflow-hidden`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartChannelIcon, {
									method: ch.name,
									imageUrl: ch.imageUrl,
									className: "w-5 h-5 text-white"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate",
							children: isBn ? ch.labelBn : ch.labelEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: `text-base font-extrabold ${ch.color} tabular-nums leading-tight`,
								children: formatCurrency(bal, lang)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [canAddTrx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										sounds.playTap();
										onOpenIncome(ch.name);
									},
									className: "w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-all",
									title: isBn ? "টাকা জমা" : "Add Money",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 stroke-[3]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-6 h-6 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100 shadow-2xs transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" })
								})]
							})]
						})] })]
					}, ch.id || ch.name);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => {
						sounds.playTap();
						if (onOpenStaffManager) onOpenStaffManager();
					},
					className: `p-4 rounded-3xl text-white border shadow-md cursor-pointer hover:shadow-lg active:scale-[0.985] transition-all flex items-center justify-between group ${isStaffLocked ? "bg-slate-700 grayscale border-slate-600 opacity-80" : "bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-rose-500/30"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6 stroke-[2.2]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-black text-white",
								children: isBn ? "কালেকশন ও কোম্পানি পাওনা" : "Collection & Company Dues"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 uppercase tracking-wider",
								children: isBn ? "ব্যক্তি হিসাব" : "Due Ledger"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-300 mt-0.5",
							children: isBn ? "স্টাফ, মালিক ও সদস্যদের পাওনা, কালেকশন ও পিডিএফ রিপোর্ট" : "Staff, Owner & Member Dues, Collections & PDF"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right pl-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হিসাব খাতা" : "Manage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
						})
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/components/TransactionList.tsx
var TransactionList = ({ transactions, lang, user, onSelectTransaction, onEdit, onDelete, selectedMethodFilter, onClearMethodFilter, currentMonthIndex, currentYear, onPrevMonth, onNextMonth }) => {
	const t = translations[lang];
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const isSubAdmin$1 = isSubAdmin(user);
	const [nowMs, setNowMs] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (!isSubAdmin$1) return;
		setNowMs(Date.now());
		const timer = setInterval(() => setNowMs(Date.now()), 15e3);
		return () => clearInterval(timer);
	}, [isSubAdmin$1]);
	const monthsBn = [
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
	const monthsEn = [
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
	const handlePrevMonth = () => {
		sounds.playTap();
		onPrevMonth();
	};
	const handleNextMonth = () => {
		sounds.playTap();
		onNextMonth();
	};
	const displayList = [...transactions.filter((trx) => {
		if (trx.isDeleted) return false;
		if (filterType !== "all" && trx.type !== filterType) return false;
		if (selectedMethodFilter && trx.method !== selectedMethodFilter) return false;
		if (searchQuery.trim()) {
			var _trx$person, _trx$phone, _trx$trxId, _trx$note, _trx$category, _trx$method;
			const q = searchQuery.toLowerCase().trim();
			const matchPerson = (_trx$person = trx.person) === null || _trx$person === void 0 ? void 0 : _trx$person.toLowerCase().includes(q);
			const matchPhone = (_trx$phone = trx.phone) === null || _trx$phone === void 0 ? void 0 : _trx$phone.includes(q);
			const matchTrxId = (_trx$trxId = trx.trxId) === null || _trx$trxId === void 0 ? void 0 : _trx$trxId.toLowerCase().includes(q);
			const matchNote = (_trx$note = trx.note) === null || _trx$note === void 0 ? void 0 : _trx$note.toLowerCase().includes(q);
			const matchCategory = (_trx$category = trx.category) === null || _trx$category === void 0 ? void 0 : _trx$category.toLowerCase().includes(q);
			const matchMethod = (_trx$method = trx.method) === null || _trx$method === void 0 ? void 0 : _trx$method.toLowerCase().includes(q);
			if (!matchPerson && !matchPhone && !matchTrxId && !matchNote && !matchCategory && !matchMethod) return false;
		}
		const parts = (trx.date || "").split("-");
		if (parts.length >= 2) {
			const y = parseInt(parts[0], 10);
			const m = parseInt(parts[1], 10) - 1;
			if (!searchQuery.trim() && (y !== currentYear || m !== currentMonthIndex)) return false;
		}
		return true;
	})].sort((a, b) => {
		if (a.created && b.created) return a.created - b.created;
		return 0;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-2 select-none",
		children: [
			isSubAdmin$1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2.5 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between gap-2 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "সাব-এডমিন: এখানে কেবল আপনার নিজ এন্ট্রিকৃত লেনদেন দেখানো হচ্ছে" : "Sub-Admin: Showing only transactions added by you" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0",
					children: lang === "bn" ? "৩০ মিঃ এডিট/ডিলিট" : "30m Edit"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between py-2 mb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handlePrevMonth,
						className: "w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
						"aria-label": "Previous month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-bold text-slate-900 dark:text-white tracking-wide",
						children: lang === "bn" ? `${monthsBn[currentMonthIndex]} ${toBengaliNumber(currentYear)}` : `${monthsEn[currentMonthIndex]} ${currentYear}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleNextMonth,
						className: "w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
						"aria-label": "Next month",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 stroke-[2.2]" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							setFilterType("all");
						},
						className: `py-2 rounded-xl text-xs font-bold transition-all duration-150 ${filterType === "all" ? "bg-[#E52E2E] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: lang === "bn" ? "সব (All)" : "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							setFilterType("income");
						},
						className: `py-2 rounded-xl text-xs font-bold transition-all duration-150 ${filterType === "income" ? "bg-[#E52E2E] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: lang === "bn" ? "ইন (In)" : "In"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							setFilterType("expense");
						},
						className: `py-2 rounded-xl text-xs font-bold transition-all duration-150 ${filterType === "expense" ? "bg-[#E52E2E] text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: lang === "bn" ? "আউট (Out)" : "Out"
					})
				]
			}),
			selectedMethodFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[#E52E2E] dark:text-rose-400 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "ফিল্টার:" : "Filter:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "underline",
						children: selectedMethodFilter
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						sounds.playTap();
						onClearMethodFilter === null || onClearMethodFilter === void 0 || onClearMethodFilter();
					},
					className: "flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#E52E2E]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "মুছে ফেলুন" : "Clear" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: lang === "bn" ? "নাম, মোবাইল বা ট্রানজেকশন আইডি খুঁজুন..." : "Search name, mobile or Trx ID...",
						className: "w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
					}),
					searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearchQuery(""),
						className: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600",
						children: "✕"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-slate-100 dark:divide-slate-800/80",
				children: displayList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-slate-400 dark:text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t.no_data
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs mt-1",
						children: lang === "bn" ? "অন্য কোনো মাস নির্বাচন করুন অথবা ফিল্টার রিসেট করুন" : "Select another month or reset filters"
					})]
				}) : displayList.map((trx) => {
					const isIncome = trx.type === "income";
					const modCheck = canModifyTransaction(trx, user, nowMs);
					const minsLeft = modCheck.allowed && Number.isFinite(modCheck.remainingMs) ? Math.max(1, Math.ceil(modCheck.remainingMs / 6e4)) : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							sounds.playTap();
							onSelectTransaction(trx);
						},
						className: "py-3.5 px-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-2xl transition-all active:scale-[0.99] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] dark:text-rose-400"}`,
								children: isIncome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5 stroke-[2.2]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug truncate",
										children: trx.category || (isIncome ? lang === "bn" ? "বিল কালেকশন" : "Received Money" : lang === "bn" ? "অফিস খরচ" : "Expense")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0",
										children: trx.method
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 mt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400 truncate",
											children: trx.person || `#${trx.trxId}`
										}),
										isSubAdmin$1 && modCheck.allowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded-md border border-amber-200/70 dark:border-amber-900/50 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? `${toBengaliNumber(minsLeft)} মিঃ` : `${minsLeft}m` })]
										}),
										isSubAdmin$1 && modCheck.expired && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 dark:text-slate-500 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "লক" : "Locked" })]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-sm font-extrabold tabular-nums leading-snug ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-[#E52E2E] dark:text-rose-400"}`,
									children: [
										isIncome ? "+" : "-",
										" ",
										formatCurrency(trx.amount, lang)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400 dark:text-slate-500 mt-0.5",
									children: formatTransactionDate(trx.date, trx.time, lang)
								})]
							}), modCheck.allowed && onEdit && onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 pl-1 border-l border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										sounds.playTap();
										onEdit(trx);
									},
									className: "w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors",
									title: "এডিট",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										sounds.playTap();
										onDelete(trx);
									},
									className: "w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-[#E52E2E] flex items-center justify-center transition-colors",
									title: "মুছুন",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
								})]
							})]
						})]
					}, trx.id);
				})
			})
		]
	});
};
//#endregion
//#region src/components/BottomNav.tsx
var BottomNav = ({ activeTab, lang, onTabChange }) => {
	const isBn = lang === "bn";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-0 left-0 right-0 z-50 w-full select-none pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-2 sm:px-6 lg:px-8 pb-safe pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 items-center h-14 max-w-4xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onTabChange("home");
						},
						className: `flex flex-col items-center justify-center py-1 transition-all ${activeTab === "home" ? "text-[#E52E2E] dark:text-rose-500 scale-105 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold mt-1 tracking-tight truncate",
							children: isBn ? "হোম" : "Home"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onTabChange("transactions");
						},
						className: `flex flex-col items-center justify-center py-1 transition-all ${activeTab === "transactions" ? "text-[#E52E2E] dark:text-rose-500 scale-105 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-5 h-5 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold mt-1 tracking-tight truncate",
							children: isBn ? "লেনদেন" : "History"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onTabChange("ledger");
						},
						className: `flex flex-col items-center justify-center py-1 transition-all ${activeTab === "ledger" ? "text-[#E52E2E] dark:text-rose-500 scale-105 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold mt-1 tracking-tight truncate",
							children: isBn ? "হিসাব খাতা" : "Ledger"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onTabChange("profile");
						},
						className: `flex flex-col items-center justify-center py-1 transition-all ${activeTab === "profile" ? "text-[#E52E2E] dark:text-rose-500 scale-105 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold mt-1 tracking-tight truncate",
							children: isBn ? "মেনু" : "Menu"
						})]
					})
				]
			})
		})
	});
};
//#endregion
//#region src/utils/userStorage.ts
var LOCAL_USERS_KEY = "protyasha_app_users";
/**
* Retrieve all app users from local persistent cache (falling back to default initial users)
*/
function getStoredUsers() {
	if (typeof window === "undefined") return initialAppUsers;
	try {
		const raw = safeStorage.getItem(LOCAL_USERS_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch (e) {
		console.warn("[UserStorage] Error reading local users:", e);
	}
	try {
		safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialAppUsers));
	} catch {}
	return initialAppUsers;
}
/**
* Find a user by phone number locally
*/
function findStoredUserByPhone(phone) {
	const clean = phone.trim();
	if (!clean) return null;
	return getStoredUsers().find((u) => u.phone === clean) || null;
}
/**
* Save or update a user in local persistent storage
*/
function saveStoredUser(user) {
	if (!user || !user.id || !user.phone) return;
	try {
		const users = getStoredUsers();
		const existingIdx = users.findIndex((u) => u.id === user.id || u.phone === user.phone);
		let updatedUsers;
		if (existingIdx >= 0) {
			updatedUsers = [...users];
			updatedUsers[existingIdx] = {
				...updatedUsers[existingIdx],
				...user
			};
		} else updatedUsers = [user, ...users];
		safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));
		if (user.avatarUrl && user.avatarUrl.startsWith("data:image/")) savePersistentImage(`avatar_user_${user.id}`, user.avatarUrl);
	} catch (e) {
		console.warn("[UserStorage] Error saving stored user:", e);
	}
}
/**
* Delete a user from local persistent storage
*/
function deleteStoredUser(id) {
	if (!id) return;
	try {
		const updated = getStoredUsers().filter((u) => u.id !== id);
		safeStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
	} catch (e) {
		console.warn("[UserStorage] Error deleting user:", e);
	}
}
//#endregion
//#region src/utils/ownerDueSync.ts
var isOwnerRoleAccount = (acc) => {
	if (!acc || acc.isActive === false) return false;
	const roleText = `${acc.role || ""} ${acc.designation || ""}`.toLowerCase();
	return roleText.includes("মালিক") || roleText.includes("অংশীদার") || roleText.includes("owner") || roleText.includes("partner");
};
var isNonStaffRoleAccount = (acc) => {
	if (!acc) return false;
	const roleText = `${acc.role || ""} ${acc.designation || ""}`.toLowerCase();
	const trimmed = roleText.trim();
	return roleText.includes("মালিক") || roleText.includes("অংশীদার") || roleText.includes("owner") || roleText.includes("partner") || roleText.includes("সদস্য") || roleText.includes("গ্রাহক") || roleText.includes("customer") || roleText.includes("member") || roleText.includes("স্টাফ নয়") || trimmed === "অন্যান্য" || trimmed === "other";
};
var isActualStaffAccount = (acc) => {
	if (!acc || acc.isActive === false) return false;
	return !isNonStaffRoleAccount(acc);
};
var normalizePersonName = (raw, stripParens = true) => {
	if (!raw) return "";
	let text = String(raw).trim().toLowerCase();
	if (stripParens) text = text.replace(/\([^)]*\)/g, " ");
	text = text.replace(/^(মোঃ|মো:|মো\.|md\.|md)\s*/gi, "মো ").replace(/[.:ঃ,\-_/|]+/g, " ").replace(/\s+/g, " ").trim();
	return text;
};
var doesOwnerMatchAccount = (owner, acc) => {
	if (!owner || !acc) return false;
	const ownerPhone = normalizePhoneNumber(toEnglishNumber(owner.phone || ""));
	const accPhone = normalizePhoneNumber(toEnglishNumber(acc.phone || ""));
	if (ownerPhone.length >= 6 && accPhone.length >= 6 && ownerPhone === accPhone) return true;
	const ownerNameBase = normalizePersonName(owner.name, true);
	const accNameBase = normalizePersonName(acc.name, true);
	if (ownerNameBase.length >= 2 && accNameBase.length >= 2 && ownerNameBase === accNameBase) return true;
	const ownerNameFull = normalizePersonName(owner.name, false);
	const accNameFull = normalizePersonName(acc.name, false);
	if (ownerNameFull.length >= 2 && accNameFull.length >= 2 && ownerNameFull === accNameFull) return true;
	return false;
};
function computeOwnersDividendLedger(owners, staffAccounts, netProfit) {
	const safeOwners = Array.isArray(owners) ? owners : [];
	const totalShareUnits = safeOwners.reduce((sum, o) => sum + (Number(o.shareUnits) || 0), 0) || 12.5;
	const ownerRoleAccounts = (staffAccounts || []).filter(isOwnerRoleAccount);
	const remainingDuePool = /* @__PURE__ */ new Map();
	ownerRoleAccounts.forEach((acc) => {
		const computedRemaining = acc.remainingDue !== void 0 ? Number(acc.remainingDue) || 0 : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
		remainingDuePool.set(String(acc.id), Math.max(0, computedRemaining));
	});
	const byOwnerId = {};
	const countedAccountIds = /* @__PURE__ */ new Set();
	let totalGrossDividend = 0;
	let totalCompanyDueAllOwners = 0;
	let totalDeductedFromDividend = 0;
	let totalNetPayableAfterDeduction = 0;
	let ownersWithDueCount = 0;
	safeOwners.forEach((owner) => {
		const shareUnits = Number(owner.shareUnits) || 0;
		const isHalf = Boolean(owner.isHalf || shareUnits === .5);
		const sharePercentage = totalShareUnits > 0 ? shareUnits / totalShareUnits * 100 : 0;
		const grossShare = netProfit > 0 ? netProfit * shareUnits / totalShareUnits : 0;
		const matchedAccounts = ownerRoleAccounts.filter((acc) => doesOwnerMatchAccount(owner, acc));
		const totalDue = matchedAccounts.reduce((sum, acc) => sum + (Number(acc.totalDue) || 0), 0);
		const totalCollected = matchedAccounts.reduce((sum, acc) => sum + (Number(acc.totalCollected) || 0), 0);
		const accountRemainingDue = matchedAccounts.reduce((sum, acc) => {
			const rem = acc.remainingDue !== void 0 ? Number(acc.remainingDue) || 0 : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
			return sum + Math.max(0, rem);
		}, 0);
		let applicableCompanyDue = 0;
		matchedAccounts.forEach((acc) => {
			applicableCompanyDue += remainingDuePool.get(String(acc.id)) || 0;
		});
		const deductedAmount = Math.min(grossShare, Math.max(0, applicableCompanyDue));
		const netPayable = Math.max(0, grossShare - deductedAmount);
		const unpaidDueAfterDividend = Math.max(0, applicableCompanyDue - deductedAmount);
		let leftToAllocate = deductedAmount;
		matchedAccounts.forEach((acc) => {
			const id = String(acc.id);
			if (!countedAccountIds.has(id)) {
				countedAccountIds.add(id);
				const rem = remainingDuePool.get(id) || 0;
				totalCompanyDueAllOwners += rem;
			}
			if (leftToAllocate <= 0) return;
			const available = remainingDuePool.get(id) || 0;
			const take = Math.min(available, leftToAllocate);
			remainingDuePool.set(id, available - take);
			leftToAllocate -= take;
		});
		if (applicableCompanyDue > 0) ownersWithDueCount += 1;
		const mergedTransactions = matchedAccounts.flatMap((acc) => acc.transactions || []).sort((a, b) => {
			return (a.created || new Date(a.date).getTime() || 0) - (b.created || new Date(b.date).getTime() || 0);
		});
		totalGrossDividend += grossShare;
		totalDeductedFromDividend += deductedAmount;
		totalNetPayableAfterDeduction += netPayable;
		byOwnerId[String(owner.id)] = {
			owner,
			shareUnits,
			sharePercentage,
			isHalf,
			grossShare,
			matchedAccounts,
			totalDue,
			totalCollected,
			accountRemainingDue,
			applicableCompanyDue,
			deductedAmount,
			netPayable,
			unpaidDueAfterDividend,
			transactions: mergedTransactions
		};
	});
	return {
		totalShareUnits,
		byOwnerId,
		totalGrossDividend,
		totalCompanyDueAllOwners,
		totalDeductedFromDividend,
		totalNetPayableAfterDeduction,
		ownersWithDueCount
	};
}
async function recordOwnerDividendDeduction({ staffAccounts, matchedAccounts, amountToDeduct, selectedMonth, monthLabel, ownerName, user, onSaveStaffAccounts }) {
	let remainingToApply = Math.round(amountToDeduct * 100) / 100;
	if (remainingToApply <= 0 || matchedAccounts.length === 0) return {
		updatedList: staffAccounts,
		settledAmount: 0
	};
	const now = /* @__PURE__ */ new Date();
	const todayStr = now.toISOString().split("T")[0];
	const timeFormatted = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
	const matchedIds = new Set(matchedAccounts.map((m) => String(m.id)));
	let workingList = [...staffAccounts];
	let settledAmount = 0;
	for (const acc of workingList) {
		if (!matchedIds.has(String(acc.id)) || remainingToApply <= 0) continue;
		const accRem = acc.remainingDue !== void 0 ? Number(acc.remainingDue) || 0 : (Number(acc.totalDue) || 0) - (Number(acc.totalCollected) || 0);
		if (accRem <= 0) continue;
		const applyAmt = Math.min(accRem, remainingToApply);
		if (applyAmt <= 0) continue;
		const newTx = {
			id: `stx-div-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
			staffId: acc.id,
			type: "collection",
			amount: Math.round(applyAmt),
			date: todayStr,
			time: timeFormatted,
			userName: acc.userCode || "",
			customerName: ownerName,
			customerAddress: acc.address || "",
			reference: `লভ্যাংশ সমন্বয় (${selectedMonth})`,
			note: `লভ্যাংশ থেকে কর্তন (${monthLabel})`,
			recordedBy: (user === null || user === void 0 ? void 0 : user.name) || "অ্যাডমিন",
			created: Date.now()
		};
		const nextTxs = [...acc.transactions || [], newTx];
		const newTotalDue = nextTxs.filter((t) => t.type === "due").reduce((s, t) => s + (Number(t.amount) || 0), 0);
		const newTotalCollected = nextTxs.filter((t) => t.type === "collection").reduce((s, t) => s + (Number(t.amount) || 0), 0);
		const newRemaining = newTotalDue - newTotalCollected;
		workingList = (await upsertSingleStaffToCloud({
			...acc,
			totalDue: newTotalDue,
			totalCollected: newTotalCollected,
			remainingDue: newRemaining,
			transactions: nextTxs
		}, workingList)).updatedList;
		remainingToApply -= applyAmt;
		settledAmount += Math.round(applyAmt);
	}
	if (settledAmount > 0) {
		broadcastStaffAccounts(workingList);
		onSaveStaffAccounts === null || onSaveStaffAccounts === void 0 || onSaveStaffAccounts(workingList);
	}
	return {
		updatedList: workingList,
		settledAmount
	};
}
//#endregion
//#region src/utils/staffSync.ts
var toSafeNumber = (val, fallback = 0) => {
	const n = Number(val);
	return Number.isFinite(n) ? n : fallback;
};
function sanitizeStaffId(rawId) {
	return String(rawId || "").trim().replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128) || `staff-${Date.now()}`;
}
/**
* Guarantees every staff document written from any part of the app conforms strictly
* to the Firestore `isValidStaff` security rule schema and avoids silent write failures.
*/
function sanitizeStaffForFirestore(input) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const id = sanitizeStaffId(input.id);
	const name = String(input.name || "স্টাফ").trim().slice(0, 150) || "স্টাফ";
	const phone = String(input.phone || "").trim().slice(0, 32);
	const role = String(input.role || input.designation || "লাইন টেকনিশিয়ান").trim().slice(0, 150);
	const totalDue = toSafeNumber(input.totalDue, 0);
	const totalCollected = toSafeNumber(input.totalCollected, 0);
	const remainingDue = input.remainingDue !== void 0 ? toSafeNumber(input.remainingDue, 0) : totalDue - totalCollected;
	const transactions = Array.isArray(input.transactions) ? input.transactions.slice(0, 500) : [];
	const sanitized = {
		id,
		name,
		phone,
		role,
		userCode: String(input.userCode || "").trim().slice(0, 64),
		address: String(input.address || "").trim().slice(0, 300),
		reference: String(input.reference || "").trim().slice(0, 200),
		avatarUrl: typeof input.avatarUrl === "string" && input.avatarUrl.length <= 9e5 ? input.avatarUrl : "",
		totalDue,
		totalCollected,
		remainingDue,
		notes: String(input.notes || "").trim().slice(0, 2e3),
		createdAt: String(input.createdAt || nowIso).slice(0, 64),
		updatedAt: String(input.updatedAt || nowIso).slice(0, 64),
		baseSalary: toSafeNumber(input.baseSalary, 0),
		isActive: input.isActive !== false,
		recordedBy: input.recordedBy ? String(input.recordedBy).slice(0, 128) : "",
		transactions
	};
	if (input.designation && typeof input.designation === "string") sanitized.designation = input.designation.trim().slice(0, 150);
	return sanitized;
}
function readCachedStaffAccounts() {
	try {
		const raw = safeStorage.getItem("protyasha_staff");
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch {}
	return [];
}
function broadcastStaffAccounts(list) {
	try {
		safeStorage.setItem("protyasha_staff", JSON.stringify(list));
	} catch {}
	try {
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("staff-data-changed", { detail: list }));
	} catch {}
}
/**
* Deduplicates and merges a single staff account into the unified directory,
* writes it to Firestore `staff/{id}`, and broadcasts immediately across the whole app.
*/
async function upsertSingleStaffToCloud(staffInput, currentList) {
	const sanitized = sanitizeStaffForFirestore(staffInput);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await safeSetDoc(doc(staffDb, "staff", sanitized.id), sanitized).catch((err) => {
		handleFirestoreError(err, OperationType.WRITE, `staff/${sanitized.id}`);
	});
	await safeSetDoc(doc(db, "settings", "staff_meta"), {
		initialized: true,
		updatedAt: nowIso
	}).catch(() => {});
	const baseList = Array.isArray(currentList) ? currentList : readCachedStaffAccounts();
	const existsIdx = baseList.findIndex((s) => String(s.id) === String(sanitized.id));
	const updatedList = existsIdx !== -1 ? baseList.map((s, idx) => idx === existsIdx ? sanitized : s) : [sanitized, ...baseList];
	broadcastStaffAccounts(updatedList);
	return {
		staff: sanitized,
		updatedList
	};
}
async function deleteSingleStaffFromCloud(staffId, currentList) {
	const cleanId = String(staffId);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	await safeDeleteDoc(doc(staffDb, "staff", cleanId)).catch((err) => {
		handleFirestoreError(err, OperationType.DELETE, `staff/${cleanId}`);
	});
	await safeSetDoc(doc(db, "settings", "staff_meta"), {
		initialized: true,
		updatedAt: nowIso
	}).catch(() => {});
	const updatedList = (Array.isArray(currentList) ? currentList : readCachedStaffAccounts()).filter((s) => String(s.id) !== cleanId);
	broadcastStaffAccounts(updatedList);
	return updatedList;
}
/**
* Automatically mirrors a `sub-admin` or `staff` account created/updated in User Management
* into the unified Firestore `staff` directory so it appears immediately across Staff Accounts,
* Staff Attendance, Support Tickets, and Ay-Byay Payroll without duplicates.
*/
async function syncStaffOrSubAdminUserToDirectory(appUser) {
	if (!appUser || appUser.role !== "sub-admin" && appUser.role !== "staff") return;
	let existingStaffList = readCachedStaffAccounts();
	try {
		const snap = await getDocs(collection(staffDb, "staff"));
		const cloudRows = [];
		snap.forEach((docSnap) => {
			const data = docSnap.data();
			if (data && (data.id || docSnap.id) && data.name) cloudRows.push({
				...data,
				id: String(data.id || docSnap.id)
			});
		});
		if (cloudRows.length > 0) existingStaffList = cloudRows;
	} catch {}
	const userPhoneNorm = normalizePhoneNumber(appUser.phone);
	const existingMatch = existingStaffList.find((s) => {
		if (String(s.id) === String(appUser.id)) return true;
		const sPhoneNorm = normalizePhoneNumber(s.phone);
		return userPhoneNorm.length >= 6 && sPhoneNorm === userPhoneNorm;
	});
	if (existingMatch) await upsertSingleStaffToCloud({
		...existingMatch,
		name: appUser.name || existingMatch.name,
		phone: appUser.phone || existingMatch.phone,
		avatarUrl: appUser.avatarUrl || existingMatch.avatarUrl || "",
		isActive: appUser.status !== "suspended",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, existingStaffList);
	else await upsertSingleStaffToCloud({
		id: sanitizeStaffId(appUser.id),
		name: appUser.name,
		phone: appUser.phone || "",
		role: appUser.role === "staff" ? "স্টাফ" : "সাব-এডমিন / স্টাফ",
		avatarUrl: appUser.avatarUrl || "",
		baseSalary: 0,
		totalDue: 0,
		totalCollected: 0,
		remainingDue: 0,
		isActive: appUser.status !== "suspended",
		recordedBy: appUser.recordedBy || "admin",
		createdAt: appUser.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
		transactions: []
	}, existingStaffList);
}
/**
* Matches a main-page logged-in `staff` or `sub-admin` session against the unified active Staff Directory.
* Strictly ignores regular `user` and `visitor` accounts so regular users can never auto-match staff privileges.
*/
function findMatchedStaffForUser(user, staffAccounts) {
	if (!user || user.role !== "staff" && user.role !== "sub-admin") return null;
	const activeStaff = (staffAccounts || []).filter(isActualStaffAccount);
	if (activeStaff.length === 0) return null;
	const uId = String(user.id || "").trim();
	const uPhoneNorm = normalizePhoneNumber(user.phone);
	const uRawPhone = String(user.phone || "").trim().toLowerCase();
	const uName = String(user.name || "").trim().toLowerCase();
	return (uId ? activeStaff.find((s) => String(s.id) === uId) : void 0) || (uPhoneNorm.length >= 6 ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === uPhoneNorm) : void 0) || (uRawPhone ? activeStaff.find((s) => String(s.userCode || "").trim().toLowerCase() === uRawPhone || String(s.phone || "").trim().toLowerCase() === uRawPhone) : void 0) || (uName ? activeStaff.find((s) => String(s.name || "").trim().toLowerCase() === uName) : void 0) || null;
}
/**
* Keeps `protyasha_support_staff_session` synchronized with `staff` / `sub-admin` main-page logins
* and clears it for `admin`, `user`, and `visitor` accounts.
*/
function syncMainLoginStaffSession(user, staffAccounts) {
	try {
		if (!user || user.role === "visitor" || user.role === "admin" || user.role === "user") {
			sessionStorage.removeItem("protyasha_support_staff_session");
			return;
		}
		const matched = findMatchedStaffForUser(user, staffAccounts);
		if (matched) {
			const sessionObj = {
				staffId: matched.id,
				name: matched.name,
				phone: matched.phone || user.phone || "",
				roleTitle: matched.role || "স্টাফ",
				loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(sessionObj));
		} else if (user.role === "sub-admin" || user.role === "staff") {
			const sessionObj = {
				staffId: user.id || user.phone || user.role,
				name: user.name || "স্টাফ",
				phone: user.phone || "",
				roleTitle: user.role === "staff" ? "স্টাফ" : "সাব-এডমিন / স্টাফ",
				loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(sessionObj));
		}
	} catch {}
}
/**
* Synchronizes a staff member's PIN across both `settings/staff_support_auth.staffPins`
* and matching `users` documents (`role === 'staff'`) so Staff Attendance PINs and
* Main Login credentials stay 100% unified.
*/
async function syncStaffPinEverywhere(params) {
	const cleanPin = String(params.newPin || "").trim();
	if (!/^\d{4,8}$/.test(cleanPin)) throw new Error("পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে");
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const targetId = String(params.staffId || "").trim();
	const targetPhoneNorm = normalizePhoneNumber(params.phone);
	try {
		const authRef = doc(db, "settings", "staff_support_auth");
		const authSnap = await getDoc(authRef);
		const authData = authSnap.exists() ? authSnap.data() : {};
		const existingGlobalPin = String(authData.globalPin || "1234").trim() || "1234";
		const nextPins = { ...authData.staffPins || {} };
		if (targetId) nextPins[targetId] = cleanPin;
		await safeSetDoc(authRef, {
			globalPin: existingGlobalPin,
			staffPins: nextPins,
			updatedAt: nowIso
		});
	} catch (err) {
		handleFirestoreError(err, OperationType.WRITE, "settings/staff_support_auth");
	}
	try {
		const usersSnap = await getDocs(collection(db, "users"));
		const updates = [];
		usersSnap.forEach((docSnap) => {
			const u = docSnap.data();
			if (!u || u.role !== "staff") return;
			const uId = String(u.id || docSnap.id).trim();
			const uPhoneNorm = normalizePhoneNumber(u.phone);
			const idMatch = Boolean(targetId && (uId === targetId || docSnap.id === targetId));
			const phoneMatch = Boolean(targetPhoneNorm.length >= 6 && uPhoneNorm === targetPhoneNorm);
			if (idMatch || phoneMatch) {
				const nextDoc = {
					...u,
					id: u.id || docSnap.id,
					pin: cleanPin,
					updatedAt: nowIso
				};
				updates.push(safeSetDoc(doc(db, "users", docSnap.id), nextDoc).catch((err) => {
					handleFirestoreError(err, OperationType.WRITE, `users/${docSnap.id}`);
				}));
			}
		});
		if (updates.length > 0) await Promise.all(updates);
	} catch {}
	try {
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("staff-pin-updated", { detail: {
			staffId: targetId,
			phone: params.phone
		} }));
	} catch {}
}
//#endregion
//#region src/utils/deviceSession.ts
var DEVICE_ID_KEY = "protyasha_device_id";
var SESSION_TOKEN_KEY = "protyasha_session_token";
var VERIFIED_ACCOUNT_KEY = "protyasha_verified_session_key";
var PENDING_VERIFY_KEY = "protyasha_pending_session_verify";
var STALE_SESSION_MS = 18e4;
/**
* Persistent unique ID per browser/device installation.
* Same browser shares this ID across tabs; any other phone/browser/incognito gets a different ID.
*/
function getDeviceId() {
	if (typeof window === "undefined") return "server-device";
	let existing = safeStorage.getItem(DEVICE_ID_KEY);
	if (!existing) try {
		var _window$localStorage;
		existing = ((_window$localStorage = window.localStorage) === null || _window$localStorage === void 0 ? void 0 : _window$localStorage.getItem(DEVICE_ID_KEY)) || null;
	} catch {}
	if (existing && /^[a-zA-Z0-9_\-]+$/.test(existing)) return existing;
	const created = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
	safeStorage.setItem(DEVICE_ID_KEY, created);
	return created;
}
/**
* Human-readable short device & browser label for lock conflict messages and admin view.
*/
function getDeviceLabel() {
	if (typeof navigator === "undefined") return "Unknown Device";
	const ua = navigator.userAgent || "";
	let os = "Device";
	if (/Android/i.test(ua)) os = "Android";
	else if (/iPhone/i.test(ua)) os = "iPhone";
	else if (/iPad/i.test(ua)) os = "iPad";
	else if (/Windows/i.test(ua)) os = "Windows PC";
	else if (/Macintosh|Mac OS X/i.test(ua)) os = "Mac";
	else if (/Linux/i.test(ua)) os = "Linux";
	let browser = "Browser";
	if (/Edg\//i.test(ua)) browser = "Edge";
	else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
	else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Browser";
	else if (/Chrome|CriOS/i.test(ua)) browser = "Chrome";
	else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
	else if (/Safari/i.test(ua)) browser = "Safari";
	return `${os} • ${browser}`;
}
function getSessionAccountKey(params) {
	const rawPhone = (params.phone || "").trim().replace(/[^0-9a-zA-Z]/g, "");
	if (rawPhone) return `phone_${rawPhone}`;
	return `id_${(params.id || "unknown").trim().replace(/[^a-zA-Z0-9_\-]/g, "_") || "unknown"}`;
}
function getSessionDocId(accountKey) {
	return `active_session_${accountKey.replace(/[^a-zA-Z0-9_\-]/g, "_").slice(0, 96)}`;
}
function generateSessionToken() {
	return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
}
function isOfflineNetworkError(err) {
	const msg = err instanceof Error ? err.message.toLowerCase() : String(err || "").toLowerCase();
	return (err === null || err === void 0 ? void 0 : err.code) === "unavailable" || msg.includes("offline") || msg.includes("network") || msg.includes("failed to get document") || msg.includes("client is offline");
}
/**
* Atomically claims the single-device session lock for an account.
* Rejects login if another device already holds an active session for the same account.
*/
async function claimDeviceSession(params) {
	if (params.role === "visitor") return { allowed: true };
	const myDeviceId = getDeviceId();
	const deviceLabel = getDeviceLabel();
	const accountKey = getSessionAccountKey(params);
	const docId = getSessionDocId(accountKey);
	const sessionRef = doc(db, "settings", docId);
	const sessionToken = generateSessionToken();
	if (typeof navigator === "undefined" || navigator.onLine !== false) try {
		await enableNetwork(db);
	} catch {}
	try {
		const txResult = await runTransaction(db, async (tx) => {
			const snap = await tx.get(sessionRef);
			const nowMs = Date.now();
			const nowIso = new Date(nowMs).toISOString();
			if (snap.exists() && !params.forceTakeover) {
				const existing = snap.data();
				const lastSeenMs = Number(existing.lastActiveAt || existing.loginAt || 0);
				const isStillAlive = lastSeenMs > 0 && nowMs - lastSeenMs <= STALE_SESSION_MS;
				if (existing.isActive === true && existing.deviceId && existing.deviceId !== myDeviceId && isStillAlive) return {
					allowed: false,
					activeDeviceLabel: existing.deviceLabel || "অন্য ডিভাইস",
					loginAt: existing.loginAt
				};
			}
			const payload = {
				accountKey,
				userId: params.id || accountKey,
				phone: params.phone,
				role: params.role,
				name: params.name || "",
				deviceId: myDeviceId,
				deviceLabel,
				sessionToken,
				isActive: true,
				forcedLogout: false,
				loginAt: nowMs,
				lastActiveAt: nowMs,
				updatedAt: nowIso
			};
			tx.set(sessionRef, payload);
			return { allowed: true };
		});
		if (!txResult.allowed) {
			const devName = txResult.activeDeviceLabel || "অন্য ডিভাইস";
			const canForce = params.role === "admin";
			return {
				allowed: false,
				reason: "already_active_other_device",
				activeDeviceLabel: devName,
				loginAt: txResult.loginAt,
				canForceTakeover: canForce,
				messageBn: canForce ? `এই অ্যাডমিন আইডি অন্য একটি ডিভাইসে (${devName}) এই মুহূর্তে চালু আছে। নিচের বাটনে চাপ দিয়ে আগের ডিভাইস লগআউট করে এখানে লগইন করতে পারবেন।` : `এই লগইন আইডি ইতিমধ্যে অন্য একটি ডিভাইসে (${devName}) চালু আছে। একসাথে শুধুমাত্র ১টি ডিভাইসে লগইন করা যাবে। আগের ডিভাইস থেকে লগআউট করে আবার চেষ্টা করুন।`,
				messageEn: canForce ? `This admin account is currently active on another device (${devName}). Tap below to sign out that device and log in here.` : `This account is already logged in on another device (${devName}). Only 1 device is allowed at a time. Please log out from the previous device first.`
			};
		}
		safeStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
		safeStorage.setItem(VERIFIED_ACCOUNT_KEY, accountKey);
		safeStorage.removeItem(PENDING_VERIFY_KEY);
		return {
			allowed: true,
			sessionToken,
			accountKey
		};
	} catch (err) {
		console.warn("[DeviceSession] Transaction claim failed:", err);
		if (isOfflineNetworkError(err)) {
			const isOfflineModeOn = safeStorage.getItem("protyasha_offline_mode") === "true";
			const lastVerifiedKey = safeStorage.getItem(VERIFIED_ACCOUNT_KEY);
			if (isOfflineModeOn && lastVerifiedKey === accountKey) {
				safeStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
				safeStorage.setItem(PENDING_VERIFY_KEY, "true");
				return {
					allowed: true,
					sessionToken,
					accountKey
				};
			}
			return {
				allowed: false,
				reason: "offline_unverified",
				messageBn: "এক-ডিভাইস লগইন যাচাইয়ের জন্য ইন্টারনেট সংযোগ প্রয়োজন। দয়া করে ইন্টারনেট চালু করে চেষ্টা করুন।",
				messageEn: "Internet connection is required to verify single-device login. Please connect and retry."
			};
		}
		return {
			allowed: false,
			reason: "error",
			messageBn: "ডিভাইস সেশন যাচাই করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
			messageEn: "Could not verify device session. Please try again."
		};
	}
}
/**
* Releases the active device lock ONLY if the current device owns it.
*/
async function releaseDeviceSession(user) {
	if (!user || user.role === "visitor") return;
	const myDeviceId = getDeviceId();
	const accountKey = getSessionAccountKey({
		id: user.id,
		phone: user.phone,
		role: user.role
	});
	const docId = getSessionDocId(accountKey);
	const sessionRef = doc(db, "settings", docId);
	safeStorage.removeItem(SESSION_TOKEN_KEY);
	safeStorage.removeItem(VERIFIED_ACCOUNT_KEY);
	safeStorage.removeItem(PENDING_VERIFY_KEY);
	try {
		await runTransaction(db, async (tx) => {
			const snap = await tx.get(sessionRef);
			if (!snap.exists()) return;
			const existing = snap.data();
			if (existing.deviceId === myDeviceId || !existing.deviceId) tx.set(sessionRef, {
				accountKey,
				userId: user.id || accountKey,
				phone: user.phone || "",
				role: user.role,
				name: user.name || "",
				deviceId: "",
				deviceLabel: "",
				sessionToken: "",
				isActive: false,
				forcedLogout: false,
				loginAt: existing.loginAt || Date.now(),
				lastActiveAt: Date.now(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		});
	} catch (err) {
		console.warn("[DeviceSession] Release notice:", err);
	}
}
/**
* Admin action: remotely unlocks/forces logout of a user's active device session.
*/
async function adminForceReleaseSession(params) {
	const accountKey = getSessionAccountKey(params);
	const docId = getSessionDocId(accountKey);
	const sessionRef = doc(db, "settings", docId);
	const nowMs = Date.now();
	await setDoc(sessionRef, {
		accountKey,
		userId: params.id || accountKey,
		phone: params.phone || "",
		role: params.role || "user",
		name: params.name || "",
		deviceId: "",
		deviceLabel: "",
		sessionToken: "",
		isActive: false,
		forcedLogout: true,
		loginAt: nowMs,
		lastActiveAt: nowMs,
		updatedAt: new Date(nowMs).toISOString()
	});
}
/**
* Updates heartbeat timestamp if this device owns the session.
*/
async function sendSessionHeartbeat(user) {
	if (!user || user.role === "visitor") return;
	if (typeof navigator !== "undefined" && navigator.onLine === false) return;
	if (safeStorage.getItem("protyasha_offline_mode") === "true") return;
	const myDeviceId = getDeviceId();
	const docId = getSessionDocId(getSessionAccountKey({
		id: user.id,
		phone: user.phone,
		role: user.role
	}));
	const sessionRef = doc(db, "settings", docId);
	try {
		await runTransaction(db, async (tx) => {
			const snap = await tx.get(sessionRef);
			if (!snap.exists()) return;
			const existing = snap.data();
			if (existing.isActive === true && existing.deviceId === myDeviceId) {
				const nowMs = Date.now();
				tx.set(sessionRef, {
					lastActiveAt: nowMs,
					deviceLabel: getDeviceLabel(),
					updatedAt: new Date(nowMs).toISOString()
				}, { merge: true });
			}
		});
	} catch {}
}
/**
* Verifies or claims active session on app boot / reconnect, and watches real-time
* lock changes so a device is immediately signed out if unlocked or owned by another device.
*/
function startDeviceSessionGuard(user, onInvalidated) {
	if (!user || user.role === "visitor") return () => {};
	const myDeviceId = getDeviceId();
	const accountKey = getSessionAccountKey({
		id: user.id,
		phone: user.phone,
		role: user.role
	});
	const docId = getSessionDocId(accountKey);
	const sessionRef = doc(db, "settings", docId);
	let unsubscribed = false;
	let invalidated = false;
	const triggerInvalidate = (reason, otherLabel) => {
		if (unsubscribed || invalidated) return;
		invalidated = true;
		safeStorage.removeItem(SESSION_TOKEN_KEY);
		safeStorage.removeItem(VERIFIED_ACCOUNT_KEY);
		safeStorage.removeItem(PENDING_VERIFY_KEY);
		onInvalidated(reason, otherLabel);
	};
	const verifyOnServer = async () => {
		if (safeStorage.getItem("protyasha_offline_mode") === "true") return;
		if (typeof navigator !== "undefined" && navigator.onLine === false) return;
		try {
			const serverSnap = await getDocFromServer(sessionRef);
			if (unsubscribed || invalidated) return;
			if (!serverSnap.exists()) {
				const claimed = await claimDeviceSession({
					id: user.id,
					phone: user.phone,
					role: user.role,
					name: user.name
				});
				if (!claimed.allowed && claimed.reason === "already_active_other_device") triggerInvalidate("other_device", claimed.activeDeviceLabel);
				return;
			}
			const data = serverSnap.data();
			if (data.isActive === true && data.deviceId && data.deviceId !== myDeviceId) {
				triggerInvalidate("other_device", data.deviceLabel);
				return;
			}
			if (data.isActive === false && data.forcedLogout === true) {
				triggerInvalidate("forced_logout");
				return;
			}
			if (data.isActive === false) {
				if (safeStorage.getItem(PENDING_VERIFY_KEY) === "true") {
					const claimed = await claimDeviceSession({
						id: user.id,
						phone: user.phone,
						role: user.role,
						name: user.name
					});
					if (!claimed.allowed && claimed.reason === "already_active_other_device") triggerInvalidate("other_device", claimed.activeDeviceLabel);
				} else triggerInvalidate("forced_logout");
			} else if (data.isActive === true && data.deviceId === myDeviceId) {
				safeStorage.setItem(VERIFIED_ACCOUNT_KEY, accountKey);
				safeStorage.removeItem(PENDING_VERIFY_KEY);
			}
		} catch {}
	};
	verifyOnServer();
	const unsubSnapshot = onSnapshot(sessionRef, (snap) => {
		if (unsubscribed || invalidated) return;
		if (!snap.exists()) return;
		if (snap.metadata.fromCache && safeStorage.getItem("protyasha_offline_mode") === "true") return;
		const data = snap.data();
		if (data.isActive === true && data.deviceId && data.deviceId !== myDeviceId) triggerInvalidate("other_device", data.deviceLabel);
		else if (data.isActive === false && data.forcedLogout === true) triggerInvalidate("forced_logout");
	}, (err) => {
		console.warn("[DeviceSession] Listener warning:", err);
	});
	const handleOnline = () => {
		verifyOnServer();
	};
	const handleVisibility = () => {
		if (typeof document !== "undefined" && document.visibilityState === "visible") sendSessionHeartbeat(user);
	};
	if (typeof window !== "undefined") window.addEventListener("online", handleOnline);
	if (typeof document !== "undefined") document.addEventListener("visibilitychange", handleVisibility);
	const heartbeatInterval = setInterval(() => {
		if (typeof document === "undefined" || document.visibilityState === "visible") sendSessionHeartbeat(user);
	}, 6e4);
	return () => {
		unsubscribed = true;
		unsubSnapshot();
		clearInterval(heartbeatInterval);
		if (typeof window !== "undefined") window.removeEventListener("online", handleOnline);
		if (typeof document !== "undefined") document.removeEventListener("visibilitychange", handleVisibility);
	};
}
/**
* Subscribe to all currently active device sessions (used in Admin UserManagementModal).
*/
function subscribeActiveDeviceSessions(onUpdate) {
	const q = query(collection(db, "settings"), where("isActive", "==", true));
	return onSnapshot(q, (snap) => {
		const map = {};
		snap.forEach((docSnap) => {
			if (!docSnap.id.startsWith("active_session_")) return;
			const data = docSnap.data();
			if (data && data.accountKey && data.isActive) map[data.accountKey] = data;
		});
		onUpdate(map);
	}, (err) => {
		console.warn("[DeviceSession] Admin active sessions listener notice:", err);
	});
}
//#endregion
//#region src/App.tsx
var LoginView = import_react.lazy(() => __vitePreload(() => import("./chunk-LoginView.js").then((m) => ({ default: m.LoginView })), __vite__mapDeps([4,1,5,6,7,2,3,8,9]), import.meta.url));
var triggerConfetti = (opts) => {
	__vitePreload(() => import("./chunk-confetti.module.js").then((mod) => {
		const fn = mod.default || mod;
		if (typeof fn === "function") fn(opts);
	}), [], import.meta.url).catch(() => {});
};
var TransactionDetailPage = import_react.lazy(() => __vitePreload(() => import("./chunk-TransactionDetailPage.js").then((m) => ({ default: m.TransactionDetailPage })), __vite__mapDeps([10,1,5,6,3]), import.meta.url));
var ReceiptModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ReceiptModal.js").then((m) => ({ default: m.ReceiptModal })), __vite__mapDeps([11,1,5,6,3]), import.meta.url));
var EntryModal = import_react.lazy(() => __vitePreload(() => import("./chunk-EntryModal.js").then((m) => ({ default: m.EntryModal })), __vite__mapDeps([12,1,5,6,3]), import.meta.url));
var NotificationsModal = import_react.lazy(() => __vitePreload(() => import("./chunk-NotificationsModal.js").then((m) => ({ default: m.NotificationsModal })), __vite__mapDeps([13,1,5,6,3]), import.meta.url));
var NotificationDetailModal = import_react.lazy(() => __vitePreload(() => import("./chunk-NotificationDetailModal.js").then((m) => ({ default: m.NotificationDetailModal })), __vite__mapDeps([14,1,5,6,3,0,2,15]), import.meta.url));
var ServiceNoticeModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ServiceNoticeModal.js").then((m) => ({ default: m.ServiceNoticeModal })), __vite__mapDeps([16,1,5,6]), import.meta.url));
var ProfileView = import_react.lazy(() => __vitePreload(() => import("./chunk-ProfileView.js").then((m) => ({ default: m.ProfileView })), __vite__mapDeps([17,1,5,6,7,2,3,18,8,9,19,15,0,20,21]), import.meta.url));
var RecycleBinModal = import_react.lazy(() => __vitePreload(() => import("./chunk-RecycleBinModal.js").then((m) => ({ default: m.RecycleBinModal })), __vite__mapDeps([22,1,5,6,3]), import.meta.url));
var AuditLogModal = import_react.lazy(() => __vitePreload(() => import("./chunk-AuditLogModal.js").then((m) => ({ default: m.AuditLogModal })), __vite__mapDeps([23,1,5,6,3]), import.meta.url));
var FooterSettingsModal = import_react.lazy(() => __vitePreload(() => import("./chunk-FooterSettingsModal.js").then((m) => ({ default: m.FooterSettingsModal })), __vite__mapDeps([24,1,5,6,9]), import.meta.url));
var ChangePinModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ChangePinModal.js").then((m) => ({ default: m.ChangePinModal })), __vite__mapDeps([25,1,5,6]), import.meta.url));
var ReportModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ReportModal.js").then((m) => ({ default: m.ReportModal })), __vite__mapDeps([26,1,5,6,3,27,7]), import.meta.url));
var BannerManagerModal = import_react.lazy(() => __vitePreload(() => import("./chunk-BannerManagerModal.js").then((m) => ({ default: m.BannerManagerModal })), __vite__mapDeps([28,1,5,6,8,9]), import.meta.url));
var ChannelManagerModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ChannelManagerModal.js").then((m) => ({ default: m.ChannelManagerModal })), __vite__mapDeps([29,1,5,6,9]), import.meta.url));
var UserManagementModal = import_react.lazy(() => __vitePreload(() => import("./chunk-UserManagementModal.js").then((m) => ({ default: m.UserManagementModal })), __vite__mapDeps([30,1,5,6,7,2,8,9,20]), import.meta.url));
var WeatherModal = import_react.lazy(() => __vitePreload(() => import("./chunk-WeatherModal.js").then((m) => ({ default: m.WeatherModal })), __vite__mapDeps([31,1,5,6,3,8,0,2,32]), import.meta.url));
var PrayerTimesModal = import_react.lazy(() => __vitePreload(() => import("./chunk-PrayerTimesModal.js").then((m) => ({ default: m.PrayerTimesModal })), __vite__mapDeps([33,1,5,6,3,0,2,15]), import.meta.url));
var StaffManagerModal = import_react.lazy(() => __vitePreload(() => import("./chunk-StaffManagerModal.js").then((m) => ({ default: m.StaffManagerModal })), __vite__mapDeps([34,1,5,6,3,8,9]), import.meta.url));
var ServiceManagerModal = import_react.lazy(() => __vitePreload(() => import("./chunk-ServiceManagerModal.js").then((m) => ({ default: m.ServiceManagerModal })), __vite__mapDeps([35,1,5,6]), import.meta.url));
var QuickHisabModal = import_react.lazy(() => __vitePreload(() => import("./chunk-QuickHisabModal.js").then((m) => ({ default: m.QuickHisabModal })), __vite__mapDeps([36,1,5,6,7,2,3,18,8,37]), import.meta.url));
var DriveBackupModal = import_react.lazy(() => __vitePreload(() => import("./chunk-DriveBackupModal.js").then((m) => ({ default: m.DriveBackupModal })), __vite__mapDeps([38,1,5,6,7,2,8,19,39,40]), import.meta.url));
var SupportTicketModal = import_react.lazy(() => __vitePreload(() => import("./chunk-SupportTicketModal.js").then((m) => ({ default: m.SupportTicketModal })), __vite__mapDeps([41,1,5,6,7,3,27]), import.meta.url));
var PublicTicketTracker$1 = import_react.lazy(() => __vitePreload(() => import("./chunk-PublicTicketTracker.js").then((m) => ({ default: m.PublicTicketTracker })), __vite__mapDeps([42,1,5,6,7,2]), import.meta.url));
var StaffAttendanceModal = import_react.lazy(() => __vitePreload(() => import("./chunk-StaffAttendanceModal.js").then((m) => ({ default: m.StaffAttendanceModal })), __vite__mapDeps([43,1,5,6,7,3]), import.meta.url));
var AdminPopupNoticeModal = import_react.lazy(() => __vitePreload(() => import("./chunk-AdminPopupNoticeModal.js").then((m) => ({ default: m.AdminPopupNoticeModal })), __vite__mapDeps([44,1,5,6,3,8]), import.meta.url));
var UserPopupNoticeModal = import_react.lazy(() => __vitePreload(() => import("./chunk-UserPopupNoticeModal.js").then((m) => ({ default: m.UserPopupNoticeModal })), __vite__mapDeps([45,1,5,6,3]), import.meta.url));
var AyByayPortal = import_react.lazy(() => __vitePreload(() => import("./chunk-App.js").then((m) => ({ default: m.AyByayPortal })), __vite__mapDeps([46,1,5,6,7,2,37,47]), import.meta.url));
var BillManagerPortal = import_react.lazy(() => __vitePreload(() => import("./chunk-BillManagerPortal.js").then((m) => ({ default: m.BillManagerPortal })), __vite__mapDeps([48,1,5,6,7,2,47]), import.meta.url));
var DEFAULT_BOOT_DISTRICT = {
	nameBn: "জামালপুর",
	nameEn: "Jamalpur",
	divisionBn: "ময়মনসিংহ",
	lat: 24.9375,
	lon: 89.9377
};
var isLocalAutoNotification = (n) => {
	if (!n) return false;
	if (n.isGlobal) return false;
	const id = String(n.id || "");
	return Boolean(n.isFastingAlert || n.isPrayerAlert || n.isWeatherAlert || id.startsWith("fasting_") || id.startsWith("prayer_") || id.startsWith("weather-") || id.startsWith("app-update-") || id.startsWith("app-features-"));
};
var mergeCloudAndLocalNotifications = (cloudList, existingList) => {
	const localOnly = existingList.filter(isLocalAutoNotification);
	const cloudBroadcasts = cloudList.filter((n) => n && !isLocalAutoNotification(n));
	const seen = /* @__PURE__ */ new Set();
	const merged = [];
	for (const item of [...localOnly, ...cloudBroadcasts]) {
		if (!item || !item.id || seen.has(item.id)) continue;
		seen.add(item.id);
		merged.push(item);
	}
	return merged;
};
var getStablePopupAckUserKey = (u) => {
	if (u && u.role !== "visitor") {
		const cleaned = String(u.id || u.phone || u.role || "member").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
		if (cleaned) return cleaned;
	}
	try {
		const existing = safeStorage.getItem("protyasha_device_ack_id");
		if (existing && /^[a-zA-Z0-9_-]+$/.test(existing)) return existing;
		const generated = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		safeStorage.setItem("protyasha_device_ack_id", generated);
		return generated;
	} catch {
		return "guest_device";
	}
};
function App() {
	var _serviceStatuses$visi, _serviceStatuses$visi2, _serviceStatuses$visi3, _serviceStatuses$visi4, _serviceStatuses$ayBy4, _serviceStatuses$bill4;
	const [lang, setLang] = (0, import_react.useState)(() => {
		return safeStorage.getItem("protyasha_lang") || "bn";
	});
	const [theme, setTheme] = (0, import_react.useState)(() => {
		return safeStorage.getItem("protyasha_theme") || "light";
	});
	const [activeTab, setActiveTab] = (0, import_react.useState)("home");
	const [currentMonthIndex, setCurrentMonthIndex] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getMonth());
	const [currentYear, setCurrentYear] = (0, import_react.useState)((/* @__PURE__ */ new Date()).getFullYear());
	const [user, setUser] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_user");
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (isLoggedInSession(parsed)) return parsed;
		} catch {
			return null;
		}
		return null;
	});
	const userRef = (0, import_react.useRef)(user);
	(0, import_react.useEffect)(() => {
		userRef.current = user;
	}, [user]);
	(0, import_react.useEffect)(() => {
		document.body.classList.add("app-ready");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let active = true;
		let unsubDriveAuth = null;
		let unsubArchive = null;
		const timer = setTimeout(() => {
			Promise.all([__vitePreload(() => import("./chunk-googleDrive.js"), __vite__mapDeps([19,7]), import.meta.url), __vitePreload(() => import("./chunk-cloudArchiveSync.js"), __vite__mapDeps([40,7,2,19,39]), import.meta.url)]).then(([{ initDriveAuth }, { initSilentCloudArchiveListener, scheduleSilentCloudArchiveSync }]) => {
				if (!active) return;
				unsubDriveAuth = initDriveAuth(() => {
					scheduleSilentCloudArchiveSync(500);
				});
				unsubArchive = initSilentCloudArchiveListener(() => userRef.current);
			}).catch(() => {});
		}, 1200);
		return () => {
			active = false;
			clearTimeout(timer);
			if (unsubDriveAuth) unsubDriveAuth();
			if (unsubArchive) unsubArchive();
		};
	}, [Boolean(user)]);
	const [isLoginOpen, setIsLoginOpen] = (0, import_react.useState)(() => {
		const savedUser = safeStorage.getItem("protyasha_user");
		if (savedUser) try {
			if (isLoggedInSession(JSON.parse(savedUser))) return false;
		} catch {}
		return true;
	});
	const [sessionNotice, setSessionNotice] = (0, import_react.useState)("");
	const [publicTrackTicketId, setPublicTrackTicketId] = (0, import_react.useState)(() => extractTrackTicketIdFromLocation());
	const isPublicPreviewOverlayRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!user && !isLoginOpen) setIsLoginOpen(true);
	}, [user, isLoginOpen]);
	const [serviceStatuses, setServiceStatuses] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_service_statuses");
		if (saved) try {
			var _parsed$ayByay, _parsed$billManager;
			const parsed = JSON.parse(saved);
			if (!((_parsed$ayByay = parsed.ayByay) === null || _parsed$ayByay === void 0 ? void 0 : _parsed$ayByay.logoUrl)) parsed.ayByay = {
				...parsed.ayByay,
				logoUrl: "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png"
			};
			if (!((_parsed$billManager = parsed.billManager) === null || _parsed$billManager === void 0 ? void 0 : _parsed$billManager.logoUrl)) parsed.billManager = {
				...parsed.billManager,
				logoUrl: "https://bill-manager.ai.studio/logo.jpg"
			};
			return parsed;
		} catch {}
		return {
			visitorMode: { isActive: true },
			billManager: {
				isActive: true,
				logoUrl: "https://bill-manager.ai.studio/logo.jpg"
			},
			ayByay: {
				isActive: true,
				logoUrl: "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png"
			},
			quickHisab: { isActive: true },
			staffManager: { isActive: true },
			supportTickets: { isActive: true },
			staffAttendance: { isActive: true },
			transactions: { isActive: true },
			ledger: { isActive: true }
		};
	});
	const isVisitorModeEnabled = ((_serviceStatuses$visi = serviceStatuses.visitorMode) === null || _serviceStatuses$visi === void 0 ? void 0 : _serviceStatuses$visi.isActive) !== false && String((_serviceStatuses$visi2 = serviceStatuses.visitorMode) === null || _serviceStatuses$visi2 === void 0 ? void 0 : _serviceStatuses$visi2.isActive) !== "false";
	(0, import_react.useEffect)(() => {
		if ((user === null || user === void 0 ? void 0 : user.role) === "visitor" && !isVisitorModeEnabled) {
			safeStorage.removeItem("protyasha_user");
			sessionStorage.removeItem("protyasha_session_active");
			setUser(null);
			setActivePortal(null);
			setActiveTab("home");
			setIsProfileOpen(false);
			setSelectedTransaction(null);
			setIsLoginOpen(true);
			setSessionNotice(lang === "bn" ? "অ্যাডমিন সরাসরি ভিজিটর মোড বন্ধ করেছেন। অনুগ্রহ করে নতুন একাউন্ট খুলুন অথবা লগইন করুন।" : "Admin has turned off Direct Visitor Mode. Please create an account or sign in.");
		}
	}, [
		user === null || user === void 0 ? void 0 : user.role,
		isVisitorModeEnabled,
		lang
	]);
	const [isServiceManagerOpen, setIsServiceManagerOpen] = (0, import_react.useState)(false);
	const [activeServiceNotice, setActiveServiceNotice] = (0, import_react.useState)(null);
	const [serverTotals, setServerTotals] = (0, import_react.useState)(null);
	const [hasMoreTransactions, setHasMoreTransactions] = (0, import_react.useState)(false);
	const [isUserManagementOpen, setIsUserManagementOpen] = (0, import_react.useState)(false);
	const [isDriveBackupOpen, setIsDriveBackupOpen] = (0, import_react.useState)(false);
	const [channels, setChannels] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_channels");
		if (saved) try {
			const parsed = JSON.parse(saved);
			return cleanChannelLogos(parsed);
		} catch {
			return initialPaymentChannels;
		}
		return initialPaymentChannels;
	});
	const [staffAccounts, setStaffAccounts] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_staff");
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed)) return parsed;
			return initialStaffAccounts;
		} catch {
			return initialStaffAccounts;
		}
		return initialStaffAccounts;
	});
	const [quickHisabOwners, setQuickHisabOwners] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_quick_hisab_owners");
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		} catch {}
		return initialQuickHisabOwners;
	});
	const [transactions, setTransactions] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("protyasha_transactions") || safeStorage.getItem("isp_cache_txns");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed.filter((t) => t && t.id && !String(t.id).startsWith("txn-init-") && t.source !== "ay-byay");
			}
		} catch {}
		return [];
	});
	const [banners, setBanners] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("protyasha_banners");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter((b) => b && b.id);
			}
		} catch {}
		return initialBanners;
	});
	const [supportTickets, setSupportTickets] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("protyasha_support_tickets");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed.filter((t) => t && t.id);
			}
		} catch {}
		return [];
	});
	const [attendanceRecords, setAttendanceRecords] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("protyasha_staff_attendance");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed.filter((r) => r && r.id);
			}
		} catch {}
		return [];
	});
	const [popupNotices, setPopupNotices] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("protyasha_popup_notices");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed.filter((n) => n && n.id && n.title);
			}
		} catch {}
		return [];
	});
	const popupAckUserKey = (0, import_react.useMemo)(() => getStablePopupAckUserKey(user), [user]);
	const [acknowledgedPopupIds, setAcknowledgedPopupIds] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem(`protyasha_popup_acks_${getStablePopupAckUserKey(user)}`);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	const [popupAcksByNotice, setPopupAcksByNotice] = (0, import_react.useState)({});
	const [isPopupNoticeManagerOpen, setIsPopupNoticeManagerOpen] = (0, import_react.useState)(false);
	const [previewPopupNotice, setPreviewPopupNotice] = (0, import_react.useState)(null);
	const [isSubmittingPopupAck, setIsSubmittingPopupAck] = (0, import_react.useState)(false);
	const cleanDemoNotifications = (list) => {
		if (!Array.isArray(list)) return [];
		const sanitizeBodyBn = (text) => typeof text === "string" ? text.replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, "$1") : text;
		return list.filter((n) => {
			const id = n.id || "";
			const titleBn = n.titleBn || "";
			const titleEn = n.titleEn || "";
			if (id === "notif-1" || id === "notif-2" || id === "notif-3" || id.startsWith("demo-")) return false;
			if (titleBn.includes("স্বাগতম") || titleEn.toLowerCase().includes("welcome")) return false;
			if (titleBn.includes("ক্যাশব্যাক ৫০") || titleBn.includes("ডেমো")) return false;
			return true;
		}).map((n) => ({
			...n,
			bodyBn: sanitizeBodyBn(n.bodyBn) || "",
			...n.messageBn !== void 0 ? { messageBn: sanitizeBodyBn(n.messageBn) } : {}
		}));
	};
	const cleanChannelLogos = (list) => {
		if (!Array.isArray(list)) return initialPaymentChannels;
		return list.map((ch) => {
			var _ch$imageUrl;
			if ((_ch$imageUrl = ch.imageUrl) === null || _ch$imageUrl === void 0 ? void 0 : _ch$imageUrl.startsWith("data:image/")) return ch;
			const norm = (ch.name || "").trim();
			const lower = norm.toLowerCase();
			if (norm === "বিকাশ" || lower.includes("bkash")) return {
				...ch,
				imageUrl: "https://imagepaste.org/i/nr5kcshj.png"
			};
			if (norm === "রকেট" || lower.includes("rocket")) return {
				...ch,
				imageUrl: "https://imagepaste.org/i/y9dgzfpq.png"
			};
			if (norm === "নগদ" || lower.includes("nagad")) return {
				...ch,
				imageUrl: "https://imagepaste.org/i/t4dassfe.png"
			};
			if (norm === "ক্যাশ" || lower.includes("cash")) return {
				...ch,
				imageUrl: "https://imagepaste.org/i/ejqxwxby.png"
			};
			return ch;
		});
	};
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const userKey = user ? user.id || user.phone || user.role : "visitor";
	const [readNotifIds, setReadNotifIds] = (0, import_react.useState)(() => {
		try {
			const key = `protyasha_read_notifs_${user ? user.id || user.phone || user.role : "visitor"}`;
			const saved = safeStorage.getItem(key);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	(0, import_react.useEffect)(() => {
		const key = `protyasha_read_notifs_${userKey}`;
		try {
			const saved = safeStorage.getItem(key);
			setReadNotifIds(saved ? JSON.parse(saved) : []);
		} catch {
			setReadNotifIds([]);
		}
		if (user === null || user === void 0 ? void 0 : user.id) {
			const unsub = onSnapshot(doc(db, "users", user.id), (docSnap) => {
				if (docSnap.exists()) {
					const data = docSnap.data();
					if ((data === null || data === void 0 ? void 0 : data.status) === "suspended" && user.id !== "admin-master") {
						setSessionNotice(lang === "bn" ? "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।" : "Your account has been suspended. Please contact admin.");
						safeStorage.removeItem("protyasha_user");
						sessionStorage.removeItem("protyasha_session_active");
						setUser(null);
						setIsLoginOpen(true);
						return;
					}
					if (Array.isArray(data.readNotifications)) setReadNotifIds((prev) => {
						const combined = Array.from(/* @__PURE__ */ new Set([...prev, ...data.readNotifications]));
						try {
							safeStorage.setItem(key, JSON.stringify(combined));
						} catch {}
						return combined;
					});
					const remoteAvatar = typeof data.avatarUrl === "string" && data.avatarUrl && !data.avatarUrl.startsWith("/uploads/") ? data.avatarUrl : "";
					if (remoteAvatar) {
						savePersistentImage(`avatar_user_${user.id}`, remoteAvatar);
						if (user.role === "admin") setAdminAvatar((prev) => prev || remoteAvatar);
					}
					setUser((prev) => {
						if (!prev || prev.id !== user.id) return prev;
						const nextName = data.name || prev.name;
						const nextPhone = data.phone || prev.phone;
						const nextAvatar = remoteAvatar || prev.avatarUrl;
						const nextGmail = data.gmail !== void 0 ? data.gmail || void 0 : prev.gmail;
						const nextBound = Array.isArray(data.boundMethods) ? data.boundMethods : prev.boundMethods;
						const nextRole = data.role || prev.role;
						const nextPermissions = nextRole === "sub-admin" ? data.permissions && typeof data.permissions === "object" ? data.permissions : prev.permissions : void 0;
						if (nextName === prev.name && nextPhone === prev.phone && nextAvatar === prev.avatarUrl && nextGmail === prev.gmail && nextRole === prev.role && JSON.stringify(nextPermissions || null) === JSON.stringify(prev.permissions || null) && JSON.stringify(nextBound || []) === JSON.stringify(prev.boundMethods || [])) return prev;
						const nextSession = {
							...prev,
							name: nextName,
							phone: nextPhone,
							avatarUrl: nextAvatar,
							gmail: nextGmail,
							boundMethods: nextBound,
							role: nextRole,
							permissions: nextPermissions
						};
						try {
							safeStorage.setItem("protyasha_user", JSON.stringify(nextSession));
						} catch {}
						return nextSession;
					});
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, `users/${user.id}`);
			});
			return () => unsub();
		}
	}, [
		user === null || user === void 0 ? void 0 : user.id,
		userKey,
		lang
	]);
	(0, import_react.useEffect)(() => {
		if (!user || user.role === "visitor") return;
		const stopGuard = startDeviceSessionGuard(user, (reason, otherDeviceLabel) => {
			const notice = reason === "other_device" ? lang === "bn" ? `এই অ্যাকাউন্টটি ইতিমধ্যে অন্য একটি ডিভাইসে (${otherDeviceLabel || "অন্য ডিভাইস"}) সক্রিয় থাকায় আপনার সেশন স্বয়ংক্রিয়ভাবে লগআউট হয়েছে। প্রতিটি আইডি একসাথে শুধুমাত্র ১টি ডিভাইসে ব্যবহার করা যাবে।` : `This account is active on another device (${otherDeviceLabel || "other device"}), so this session was signed out. Only 1 device is allowed per account.` : lang === "bn" ? "অ্যাডমিন বা অন্য সেশন থেকে আপনার ডিভাইস লগআউট করা হয়েছে। পুনরায় লগইন করুন।" : "Your device session was logged out remotely. Please sign in again.";
			setSessionNotice(notice);
			safeStorage.removeItem("protyasha_user");
			sessionStorage.removeItem("protyasha_session_active");
			setUser(null);
			setActiveTab("home");
			setIsProfileOpen(false);
			setSelectedTransaction(null);
			setActivePortal(null);
			setIsNotificationsOpen(false);
			setIsAuditLogOpen(false);
			setIsUserManagementOpen(false);
			setIsBannerManagerOpen(false);
			setIsChannelManagerOpen(false);
			setIsRecycleBinOpen(false);
			setIsChangePinOpen(false);
			setIsFooterSettingsOpen(false);
			setIsEntryModalOpen(false);
			setReceiptTransaction(null);
			setSelectedNotificationDetail(null);
			setIsPopupNoticeManagerOpen(false);
			setPreviewPopupNotice(null);
			setIsLoginOpen(true);
			if (!stateRef.current.publicTrackTicketId) window.history.pushState({ screen: "login" }, "", window.location.pathname);
		});
		return () => stopGuard();
	}, [
		user === null || user === void 0 ? void 0 : user.id,
		user === null || user === void 0 ? void 0 : user.phone,
		user === null || user === void 0 ? void 0 : user.role,
		lang
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubscribe = null;
		const timer = setTimeout(() => {
			try {
				unsubscribe = onSnapshot(collection(staffDb, "staff"), async (snapshot) => {
					if (snapshot.empty) {
						try {
							var _metaSnap$data;
							const metaSnap = await getDoc(doc(db, "settings", "staff_meta"));
							if (metaSnap.exists() && ((_metaSnap$data = metaSnap.data()) === null || _metaSnap$data === void 0 ? void 0 : _metaSnap$data.initialized)) {
								setStaffAccounts([]);
								broadcastStaffAccounts([]);
							}
						} catch {}
						return;
					}
					const cloudStaff = [];
					snapshot.forEach((docSnap) => {
						const data = docSnap.data();
						if (data && (data.id || docSnap.id) && data.name) cloudStaff.push({
							...data,
							id: String(data.id || docSnap.id),
							phone: data.phone || "",
							role: data.role || "লাইন টেকনিশিয়ান",
							isActive: data.isActive !== false,
							transactions: Array.isArray(data.transactions) ? data.transactions : []
						});
					});
					setStaffAccounts(cloudStaff);
					broadcastStaffAccounts(cloudStaff);
				}, (err) => {
					handleFirestoreError(err, OperationType.LIST, "staff");
				});
			} catch (e) {
				console.warn("Staff Firestore listener setup notice:", e);
			}
		}, 500);
		return () => {
			clearTimeout(timer);
			if (unsubscribe) unsubscribe();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		let unsubColl = null;
		try {
			unsubColl = onSnapshot(collection(db, "banners"), async (snapshot) => {
				if (snapshot.empty) {
					try {
						var _metaSnap$data2;
						const metaSnap = await getDoc(doc(db, "settings", "banners_meta"));
						if (metaSnap.exists() && ((_metaSnap$data2 = metaSnap.data()) === null || _metaSnap$data2 === void 0 ? void 0 : _metaSnap$data2.initialized)) {
							setBanners([]);
							safeStorage.setItem("protyasha_banners", JSON.stringify([]));
						}
					} catch {}
					return;
				}
				const cloudBanners = [];
				snapshot.forEach((docSnap) => {
					const b = docSnap.data();
					if (b && (b.id || docSnap.id) && b.imageUrl) cloudBanners.push({
						...b,
						id: String(b.id || docSnap.id),
						isActive: b.isActive !== false
					});
				});
				cloudBanners.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
				setBanners(cloudBanners);
				try {
					safeStorage.setItem("protyasha_banners", JSON.stringify(cloudBanners));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "banners");
			});
		} catch (e) {
			console.warn("Banners Firestore listener setup notice:", e);
		}
		return () => {
			if (unsubColl) unsubColl();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubColl = null;
		try {
			unsubColl = onSnapshot(collection(db, "channels"), async (snapshot) => {
				if (snapshot.empty) {
					try {
						var _metaSnap$data3;
						const metaSnap = await getDoc(doc(db, "settings", "channels_meta"));
						if (metaSnap.exists() && ((_metaSnap$data3 = metaSnap.data()) === null || _metaSnap$data3 === void 0 ? void 0 : _metaSnap$data3.initialized)) {
							setChannels([]);
							safeStorage.setItem("protyasha_channels", JSON.stringify([]));
						}
					} catch {}
					return;
				}
				const cloudChannels = [];
				snapshot.forEach((docSnap) => {
					const ch = docSnap.data();
					if (ch && (ch.id || docSnap.id) && ch.name) cloudChannels.push({
						...ch,
						id: String(ch.id || docSnap.id)
					});
				});
				cloudChannels.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
				const cleaned = cleanChannelLogos(cloudChannels);
				setChannels(cleaned);
				try {
					safeStorage.setItem("protyasha_channels", JSON.stringify(cleaned));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "channels");
			});
		} catch (e) {
			console.warn("Channels Firestore listener setup notice:", e);
		}
		return () => {
			if (unsubColl) unsubColl();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubColl = null;
		const timer = setTimeout(() => {
			try {
				unsubColl = onSnapshot(collection(db, "quick_hisab_owners"), async (snapshot) => {
					if (snapshot.empty) {
						try {
							var _metaSnap$data4;
							const metaSnap = await getDoc(doc(db, "settings", "owners_meta"));
							if (metaSnap.exists() && ((_metaSnap$data4 = metaSnap.data()) === null || _metaSnap$data4 === void 0 ? void 0 : _metaSnap$data4.initialized)) {
								setQuickHisabOwners([]);
								safeStorage.setItem("protyasha_quick_hisab_owners", JSON.stringify([]));
							}
						} catch {}
						return;
					}
					const cloudOwners = [];
					snapshot.forEach((dSnap) => {
						const o = dSnap.data();
						if (o && o.name) cloudOwners.push({
							...o,
							id: String(o.id || dSnap.id)
						});
					});
					setQuickHisabOwners(cloudOwners);
					try {
						safeStorage.setItem("protyasha_quick_hisab_owners", JSON.stringify(cloudOwners));
					} catch {}
				}, (err) => {
					handleFirestoreError(err, OperationType.LIST, "quick_hisab_owners");
				});
			} catch (e) {
				console.warn("Quick Hisab Owners listener setup notice:", e);
			}
		}, 650);
		return () => {
			clearTimeout(timer);
			if (unsubColl) unsubColl();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubTickets = null;
		const timer = setTimeout(() => {
			try {
				unsubTickets = onSnapshot(collection(db, "support_tickets"), (snapshot) => {
					const list = [];
					snapshot.forEach((dSnap) => {
						const item = dSnap.data();
						if (item && (item.id || dSnap.id) && item.customerName) list.push({
							...item,
							id: String(item.id || dSnap.id)
						});
					});
					setSupportTickets(list);
					try {
						safeStorage.setItem("protyasha_support_tickets", JSON.stringify(list));
					} catch {}
				}, (err) => {
					handleFirestoreError(err, OperationType.LIST, "support_tickets");
				});
			} catch (e) {
				console.warn("Support tickets Firestore listener notice:", e);
			}
		}, 750);
		return () => {
			clearTimeout(timer);
			if (unsubTickets) unsubTickets();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubAttendance = null;
		const timer = setTimeout(() => {
			try {
				unsubAttendance = onSnapshot(collection(db, "staff_attendance"), (snapshot) => {
					const list = [];
					snapshot.forEach((dSnap) => {
						const item = dSnap.data();
						if (item && (item.id || dSnap.id) && item.staffId && item.date) list.push({
							...item,
							id: String(item.id || dSnap.id)
						});
					});
					setAttendanceRecords(list);
					try {
						safeStorage.setItem("protyasha_staff_attendance", JSON.stringify(list));
					} catch {}
				}, (err) => {
					handleFirestoreError(err, OperationType.LIST, "staff_attendance");
				});
			} catch (e) {
				console.warn("Staff attendance Firestore listener notice:", e);
			}
		}, 850);
		return () => {
			clearTimeout(timer);
			if (unsubAttendance) unsubAttendance();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubPopupNotices = null;
		try {
			unsubPopupNotices = onSnapshot(collection(db, "popup_notices"), (snapshot) => {
				const list = [];
				snapshot.forEach((dSnap) => {
					const item = dSnap.data();
					if (item && (item.id || dSnap.id) && item.title && item.message) list.push({
						...item,
						id: String(item.id || dSnap.id)
					});
				});
				list.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
				setPopupNotices(list);
				try {
					safeStorage.setItem("protyasha_popup_notices", JSON.stringify(list));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "popup_notices");
			});
		} catch (e) {
			console.warn("Popup notices Firestore listener notice:", e);
		}
		return () => {
			if (unsubPopupNotices) unsubPopupNotices();
		};
	}, [Boolean(user)]);
	(0, import_react.useEffect)(() => {
		const storageKey = `protyasha_popup_acks_${popupAckUserKey}`;
		try {
			const saved = safeStorage.getItem(storageKey);
			setAcknowledgedPopupIds(saved ? JSON.parse(saved) : []);
		} catch {
			setAcknowledgedPopupIds([]);
		}
		if (!user || popupNotices.length === 0) return;
		let cancelled = false;
		const activeIds = popupNotices.filter((n) => n.isActive).map((n) => n.id);
		if (activeIds.length === 0) return;
		Promise.all(activeIds.map(async (noticeId) => {
			try {
				return (await getDoc(doc(db, "popup_notices", noticeId, "acknowledgements", popupAckUserKey))).exists() ? noticeId : null;
			} catch {
				return null;
			}
		})).then((confirmedIds) => {
			if (cancelled) return;
			const validIds = confirmedIds.filter((id) => Boolean(id));
			if (validIds.length > 0) setAcknowledgedPopupIds((prev) => {
				const merged = Array.from(/* @__PURE__ */ new Set([...prev, ...validIds]));
				if (merged.length !== prev.length) try {
					safeStorage.setItem(storageKey, JSON.stringify(merged));
				} catch {}
				return merged;
			});
		});
		return () => {
			cancelled = true;
		};
	}, [
		Boolean(user),
		popupAckUserKey,
		popupNotices
	]);
	(0, import_react.useEffect)(() => {
		if ((user === null || user === void 0 ? void 0 : user.role) !== "admin" || !isPopupNoticeManagerOpen || popupNotices.length === 0) return;
		const unsubs = [];
		popupNotices.forEach((notice) => {
			try {
				const unsub = onSnapshot(collection(db, "popup_notices", notice.id, "acknowledgements"), (snap) => {
					const list = [];
					snap.forEach((d) => {
						const ack = d.data();
						if (ack && ack.userName) list.push({
							...ack,
							id: String(ack.id || d.id)
						});
					});
					list.sort((a, b) => String(b.acknowledgedAt || "").localeCompare(String(a.acknowledgedAt || "")));
					setPopupAcksByNotice((prev) => ({
						...prev,
						[notice.id]: list
					}));
				}, () => {});
				unsubs.push(unsub);
			} catch {}
		});
		return () => {
			unsubs.forEach((u) => u());
		};
	}, [
		user === null || user === void 0 ? void 0 : user.role,
		isPopupNoticeManagerOpen,
		popupNotices
	]);
	const isNotifReadForUser = (0, import_react.useCallback)((notif) => {
		if (readNotifIds.includes(notif.id)) return true;
		if (userKey && Array.isArray(notif.readBy) && notif.readBy.includes(userKey)) return true;
		return false;
	}, [readNotifIds, userKey]);
	const [selectedNotificationDetail, setSelectedNotificationDetail] = (0, import_react.useState)(null);
	const [footerConfig, setFooterConfig] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_footer");
		if (saved) try {
			return JSON.parse(saved);
		} catch {
			return initialFooterConfig;
		}
		return initialFooterConfig;
	});
	const [auditLogs, setAuditLogs] = (0, import_react.useState)(() => {
		const saved = safeStorage.getItem("protyasha_audit");
		if (saved) try {
			return JSON.parse(saved);
		} catch {
			return [];
		}
		return [{
			id: "log-1",
			action: "System Initialized",
			actionBn: "সিস্টেম চালু হয়েছে",
			user: "System",
			details: "প্রত্যাশা ক্যাবল নেটওয়ার্ক হিসাব খাতা প্রস্তুত",
			time: Date.now() - 36e5
		}];
	});
	const [adminAvatar, setAdminAvatar] = (0, import_react.useState)(() => {
		const syncImg = getSyncPersistentImage("avatar_admin", "protyasha_admin_avatar");
		if (syncImg && !syncImg.startsWith("/uploads/")) return syncImg;
		const legacy = safeStorage.getItem("protyasha_admin_avatar") || "";
		return legacy && !legacy.startsWith("/uploads/") ? legacy : "";
	});
	(0, import_react.useEffect)(() => {
		getPersistentImage("avatar_admin").then((savedImg) => {
			if (savedImg && savedImg.startsWith("data:image/")) setAdminAvatar((prev) => prev || savedImg);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const serviceIds = [
			"billManager",
			"ayByay",
			"staffManager",
			"transactions",
			"ledger"
		];
		const restoreLogos = async () => {
			const updates = {};
			for (const id of serviceIds) {
				const img = await getPersistentImage(`service_logo_${id}`);
				if (img && img.startsWith("data:image/")) updates[id] = img;
			}
			if (Object.keys(updates).length > 0) setServiceStatuses((prev) => {
				const next = { ...prev };
				Object.keys(updates).forEach((id) => {
					if (next[id] && !next[id].logoUrl) next[id] = {
						...next[id],
						logoUrl: updates[id]
					};
				});
				return next;
			});
		};
		restoreLogos();
	}, []);
	(0, import_react.useEffect)(() => {
		if (adminAvatar && !adminAvatar.startsWith("/uploads/")) {
			if (adminAvatar.startsWith("data:image/")) savePersistentImage("avatar_admin", adminAvatar);
			try {
				safeStorage.setItem("protyasha_admin_avatar", adminAvatar);
			} catch (e) {
				console.warn("LocalStorage limit reached for admin avatar:", e);
			}
		}
	}, [adminAvatar]);
	(0, import_react.useEffect)(() => {
		const checkScheduledBackup = async () => {
			try {
				if (!(safeStorage.getItem("protyasha_scheduled_backup_enabled") === "true")) return;
				const scheduledTime = safeStorage.getItem("protyasha_scheduled_backup_time") || "23:00";
				const now = /* @__PURE__ */ new Date();
				const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
				const todayStr = now.toISOString().split("T")[0];
				const lastBackupDate = safeStorage.getItem("protyasha_last_auto_backup_date");
				if (currentTimeStr >= scheduledTime && lastBackupDate !== todayStr) {
					const [{ getDriveAccessToken, uploadBackupToGoogleDrive }, { collectMasterBackupData }, { syncMasterDataToCloudArchive }] = await Promise.all([
						__vitePreload(() => import("./chunk-googleDrive.js"), __vite__mapDeps([19,7]), import.meta.url),
						__vitePreload(() => import("./chunk-backupCollector.js"), __vite__mapDeps([39,7]), import.meta.url),
						__vitePreload(() => import("./chunk-cloudArchiveSync.js"), __vite__mapDeps([40,7,2,19,39]), import.meta.url)
					]);
					if (getDriveAccessToken()) {
						const masterData = await collectMasterBackupData(user);
						await uploadBackupToGoogleDrive(masterData);
						syncMasterDataToCloudArchive(masterData).catch(() => {});
						safeStorage.setItem("protyasha_last_auto_backup_date", todayStr);
						console.log("[AutoBackup] Daily scheduled Google Drive backup completed successfully at", currentTimeStr);
					}
				}
			} catch (e) {
				console.warn("[AutoBackup] Scheduled backup check notice:", e);
			}
		};
		const interval = setInterval(checkScheduledBackup, 6e4);
		return () => clearInterval(interval);
	}, [user]);
	(0, import_react.useEffect)(() => {
		document.body.classList.add("app-ready");
		if (safeStorage.getItem("protyasha_db_seeded_v1") === "1") return;
		const timer = setTimeout(() => {
			const bootstrapNewDatabase = async () => {
				const nowIso = (/* @__PURE__ */ new Date()).toISOString();
				try {
					const ensureCollectionSeeded = async (metaDocId, colName, targetDb, items, normalize) => {
						try {
							var _metaSnap$data5;
							const metaRef = doc(db, "settings", metaDocId);
							const metaSnap = await getDoc(metaRef);
							if (metaSnap.exists() && ((_metaSnap$data5 = metaSnap.data()) === null || _metaSnap$data5 === void 0 ? void 0 : _metaSnap$data5.initialized)) return true;
							if ((await getDocs(collection(targetDb, colName))).empty && items.length > 0) await Promise.all(items.map((item, idx) => safeSetDoc(doc(targetDb, colName, String(item.id)), normalize(item, idx)).catch(() => {})));
							await safeSetDoc(metaRef, {
								initialized: true,
								updatedAt: nowIso
							}).catch(() => {});
							return true;
						} catch (e) {
							console.warn(`Seed check notice for ${colName}:`, e);
							return false;
						}
					};
					if ((await Promise.all([
						ensureCollectionSeeded("banners_meta", "banners", db, initialBanners, (b, idx) => ({
							...b,
							id: String(b.id),
							isActive: b.isActive !== false,
							priority: b.priority ?? idx + 1,
							updatedAt: nowIso
						})),
						ensureCollectionSeeded("channels_meta", "channels", db, initialPaymentChannels, (ch, idx) => ({
							...ch,
							id: String(ch.id),
							order: idx + 1,
							updatedAt: nowIso
						})),
						ensureCollectionSeeded("staff_meta", "staff", staffDb, initialStaffAccounts, (stf) => ({
							...stf,
							id: String(stf.id),
							phone: stf.phone || ""
						})),
						ensureCollectionSeeded("owners_meta", "quick_hisab_owners", db, initialQuickHisabOwners, (owner) => ({
							...owner,
							id: String(owner.id)
						})),
						ensureCollectionSeeded("users_meta", "users", db, initialAppUsers, (u) => ({
							...u,
							id: String(u.id),
							role: u.role || "user",
							status: u.status || "active"
						}))
					])).every(Boolean)) safeStorage.setItem("protyasha_db_seeded_v1", "1");
				} catch (err) {
					console.warn("Initial database bootstrap error:", err);
				}
			};
			bootstrapNewDatabase();
		}, 1500);
		return () => clearTimeout(timer);
	}, []);
	const refreshAllData = (0, import_react.useCallback)(async () => {
		try {
			var _notifSnap$data, _serviceSnap$data, _footerSnap$data, _auditSnap$data;
			const [txSnap, staffSnap, channelSnap, bannerSnap, ownerSnap, notifSnap, serviceSnap, footerSnap, adminSnap, auditSnap, ticketsSnap, attendanceSnap] = await Promise.all([
				getDocs(collection(db, "transactions")),
				getDocs(collection(staffDb, "staff")),
				getDocs(collection(db, "channels")),
				getDocs(collection(db, "banners")),
				getDocs(collection(db, "quick_hisab_owners")),
				getDoc(doc(db, "settings", "broadcast_notifications")),
				getDoc(doc(db, "settings", "service_control")),
				getDoc(doc(db, "settings", "footer_config")),
				getDoc(doc(db, "settings", "admin_profile")),
				getDoc(doc(db, "settings", "audit_logs")),
				getDocs(collection(db, "support_tickets")),
				getDocs(collection(db, "staff_attendance"))
			]);
			const mainTxs = [];
			txSnap.forEach((d) => {
				const data = d.data();
				if (data && (data.id || d.id) && !String(data.id || d.id).startsWith("txn-init-") && data.source !== "ay-byay") mainTxs.push({
					...data,
					id: data.id || d.id
				});
			});
			setTransactions(mainTxs);
			if (!staffSnap.empty) {
				const rows = [];
				staffSnap.forEach((d) => {
					const item = d.data();
					if (item && item.name) rows.push({
						...item,
						id: item.id || d.id
					});
				});
				setStaffAccounts(rows);
			}
			if (!channelSnap.empty) {
				const rows = [];
				channelSnap.forEach((d) => {
					const item = d.data();
					if (item && item.name) rows.push({
						...item,
						id: String(item.id || d.id)
					});
				});
				rows.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
				setChannels(cleanChannelLogos(rows));
			}
			if (!bannerSnap.empty) {
				const rows = [];
				bannerSnap.forEach((d) => {
					const item = d.data();
					if (item && item.imageUrl) rows.push({
						...item,
						id: String(item.id || d.id),
						isActive: item.isActive !== false
					});
				});
				rows.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
				setBanners(rows);
			}
			if (!ownerSnap.empty) {
				const rows = [];
				ownerSnap.forEach((d) => {
					const item = d.data();
					if (item && item.name) rows.push({
						...item,
						id: String(item.id || d.id)
					});
				});
				setQuickHisabOwners(rows);
			}
			const ticketRows = [];
			ticketsSnap.forEach((d) => {
				const item = d.data();
				if (item && item.customerName) ticketRows.push({
					...item,
					id: String(item.id || d.id)
				});
			});
			setSupportTickets(ticketRows);
			const attendanceRows = [];
			attendanceSnap.forEach((d) => {
				const item = d.data();
				if (item && item.staffId && item.date) attendanceRows.push({
					...item,
					id: String(item.id || d.id)
				});
			});
			setAttendanceRecords(attendanceRows);
			if (notifSnap.exists() && Array.isArray((_notifSnap$data = notifSnap.data()) === null || _notifSnap$data === void 0 ? void 0 : _notifSnap$data.list)) {
				const cleanedCloud = cleanDemoNotifications(notifSnap.data().list);
				setNotifications((prev) => mergeCloudAndLocalNotifications(cleanedCloud, prev));
			}
			if (serviceSnap.exists() && ((_serviceSnap$data = serviceSnap.data()) === null || _serviceSnap$data === void 0 ? void 0 : _serviceSnap$data.statuses)) setServiceStatuses((prev) => ({
				...prev,
				...serviceSnap.data().statuses
			}));
			if (footerSnap.exists() && ((_footerSnap$data = footerSnap.data()) === null || _footerSnap$data === void 0 ? void 0 : _footerSnap$data.config)) setFooterConfig(footerSnap.data().config);
			if (adminSnap.exists()) {
				const ap = adminSnap.data();
				const serverAvatar = typeof ap.avatarUrl === "string" && ap.avatarUrl && !ap.avatarUrl.startsWith("/uploads/") ? ap.avatarUrl : "";
				if (serverAvatar) setAdminAvatar(serverAvatar);
				if (ap.name || serverAvatar) setUser((prev) => {
					if (!prev || prev.role !== "admin") return prev;
					return {
						...prev,
						name: ap.name || prev.name,
						phone: ap.phone || prev.phone,
						avatarUrl: serverAvatar || prev.avatarUrl
					};
				});
			}
			if (auditSnap.exists() && Array.isArray((_auditSnap$data = auditSnap.data()) === null || _auditSnap$data === void 0 ? void 0 : _auditSnap$data.logs)) setAuditLogs(auditSnap.data().logs);
		} catch {}
	}, []);
	const handleUpdateAdminProfile = async (name, avatarUrl) => {
		const cleanAvatar = avatarUrl && !avatarUrl.startsWith("/uploads/") ? avatarUrl : "";
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setAdminAvatar(cleanAvatar);
		if (cleanAvatar) {
			if (cleanAvatar.startsWith("data:image/")) savePersistentImage("avatar_admin", cleanAvatar);
			safeStorage.setItem("protyasha_admin_avatar", cleanAvatar);
			safeStorage.setItem("protyasha_last_avatar", cleanAvatar);
		}
		if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
			const updatedUser = {
				...user,
				name,
				avatarUrl: cleanAvatar
			};
			setUser(updatedUser);
			safeStorage.setItem("protyasha_user", JSON.stringify(updatedUser));
		}
		const adminProfilePayload = {
			name,
			phone: (user === null || user === void 0 ? void 0 : user.phone) || "01777877207",
			avatarUrl: cleanAvatar,
			updatedAt: nowIso
		};
		await safeSetDoc(doc(db, "settings", "admin_profile"), adminProfilePayload, { merge: true }).catch(() => {});
		if (user === null || user === void 0 ? void 0 : user.id) await safeSetDoc(doc(db, "users", user.id), {
			id: user.id,
			name,
			phone: user.phone || "01777877207",
			...cleanAvatar ? { avatarUrl: cleanAvatar } : {},
			role: "admin",
			status: "active",
			updatedAt: nowIso
		}, { merge: true }).catch(() => {});
	};
	const handleUpdateUserProfile = async (updatedData) => {
		if (!user) return {
			success: false,
			message: "অনুগ্রহ করে প্রথমে লগইন করুন"
		};
		try {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const targetId = user.id || (user.role === "admin" ? "admin-master" : "usr_" + Date.now());
			const resolvedAvatar = updatedData.avatarUrl !== void 0 ? updatedData.avatarUrl : user.avatarUrl || (user.role === "admin" ? adminAvatar : "") || "";
			const cleanAvatar = resolvedAvatar && !resolvedAvatar.startsWith("/uploads/") ? resolvedAvatar : "";
			const userData = {
				id: targetId,
				name: updatedData.name,
				phone: updatedData.phone,
				...updatedData.pin ? { pin: updatedData.pin } : {},
				...cleanAvatar ? { avatarUrl: cleanAvatar } : {},
				...user.role === "sub-admin" && user.permissions ? { permissions: user.permissions } : {},
				role: user.role,
				status: "active",
				updatedAt: nowIso
			};
			await safeSetDoc(doc(db, "users", targetId), userData, { merge: true });
			if (user.role === "staff" && updatedData.pin) {
				const matchedStaff = findMatchedStaffForUser(user, staffAccounts);
				await syncStaffPinEverywhere({
					staffId: (matchedStaff === null || matchedStaff === void 0 ? void 0 : matchedStaff.id) || targetId,
					phone: updatedData.phone || user.phone || "",
					newPin: updatedData.pin
				}).catch(() => {});
			}
			if (user.role === "admin") await safeSetDoc(doc(db, "settings", "admin_profile"), {
				name: updatedData.name,
				phone: updatedData.phone || "01777877207",
				avatarUrl: cleanAvatar,
				updatedAt: nowIso
			}, { merge: true });
			saveStoredUser(userData);
			if (updatedData.phone && updatedData.phone !== user.phone) {
				await releaseDeviceSession(user).catch(() => {});
				await claimDeviceSession({
					id: targetId,
					phone: updatedData.phone,
					role: user.role,
					name: updatedData.name
				}).catch(() => {});
			}
			const updatedSession = {
				...user,
				id: targetId,
				name: updatedData.name,
				phone: updatedData.phone,
				avatarUrl: cleanAvatar || user.avatarUrl,
				...user.role === "sub-admin" && user.permissions ? { permissions: user.permissions } : {}
			};
			setUser(updatedSession);
			safeStorage.setItem("protyasha_user", JSON.stringify(updatedSession));
			safeStorage.setItem("protyasha_last_phone", updatedData.phone);
			if (cleanAvatar) {
				safeStorage.setItem("protyasha_last_avatar", cleanAvatar);
				if (user.role === "admin") {
					setAdminAvatar(cleanAvatar);
					if (cleanAvatar.startsWith("data:image/")) savePersistentImage("avatar_admin", cleanAvatar);
					safeStorage.setItem("protyasha_admin_avatar", cleanAvatar);
				} else if (cleanAvatar.startsWith("data:image/")) savePersistentImage(`avatar_user_${targetId}`, cleanAvatar);
			}
			logAction("Updated Profile", "প্রোফাইল ও পাসওয়ার্ড পরিবর্তন", `${updatedData.name} (${updatedData.phone})`);
			return { success: true };
		} catch (err) {
			console.error("Profile update error:", err);
			return {
				success: false,
				message: err.message || "সার্ভারে সংরক্ষণ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।"
			};
		}
	};
	const handleBindMethods = async (data) => {
		if (!user) return {
			success: false,
			message: "লগইন প্রয়োজন"
		};
		try {
			const targetId = user.id || (user.role === "admin" ? "admin-primary" : "usr_" + Date.now());
			const boundMethods = Array.from(/* @__PURE__ */ new Set([
				...user.boundMethods || [],
				...data.phone ? ["phone"] : [],
				...data.gmail ? ["gmail"] : []
			]));
			const updates = {
				id: targetId,
				name: user.name || "",
				role: user.role || "user",
				status: "active",
				...data,
				boundMethods,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await safeSetDoc(doc(db, "users", targetId), updates, { merge: true });
			const updatedSession = {
				...user,
				...updates
			};
			setUser(updatedSession);
			safeStorage.setItem("protyasha_user", JSON.stringify(updatedSession));
			return { success: true };
		} catch (e) {
			return {
				success: false,
				message: e.message
			};
		}
	};
	const [selectedTransaction, setSelectedTransaction] = (0, import_react.useState)(null);
	const [receiptTransaction, setReceiptTransaction] = (0, import_react.useState)(null);
	const [isEntryModalOpen, setIsEntryModalOpen] = (0, import_react.useState)(false);
	const [entryType, setEntryType] = (0, import_react.useState)("income");
	const [initialEntryMethod, setInitialEntryMethod] = (0, import_react.useState)("নগদ");
	const [editingTransaction, setEditingTransaction] = (0, import_react.useState)(null);
	const [editingNotification, setEditingNotification] = (0, import_react.useState)(null);
	const [isNotificationsOpen, setIsNotificationsOpen] = (0, import_react.useState)(false);
	const [isProfileOpen, setIsProfileOpen] = (0, import_react.useState)(false);
	const [isRecycleBinOpen, setIsRecycleBinOpen] = (0, import_react.useState)(false);
	const [isAuditLogOpen, setIsAuditLogOpen] = (0, import_react.useState)(false);
	const [isFooterSettingsOpen, setIsFooterSettingsOpen] = (0, import_react.useState)(false);
	const [isChangePinOpen, setIsChangePinOpen] = (0, import_react.useState)(false);
	const [isBannerManagerOpen, setIsBannerManagerOpen] = (0, import_react.useState)(false);
	const [isChannelManagerOpen, setIsChannelManagerOpen] = (0, import_react.useState)(false);
	const [isStaffManagerOpen, setIsStaffManagerOpen] = (0, import_react.useState)(false);
	const [isWeatherOpen, setIsWeatherOpen] = (0, import_react.useState)(false);
	const [isPrayerTimesOpen, setIsPrayerTimesOpen] = (0, import_react.useState)(false);
	const [prayerInitialView, setPrayerInitialView] = (0, import_react.useState)("daily");
	const [isQuickHisabOpen, setIsQuickHisabOpen] = (0, import_react.useState)(false);
	const [isSupportTicketsOpen, setIsSupportTicketsOpen] = (0, import_react.useState)(false);
	const [isStaffAttendanceOpen, setIsStaffAttendanceOpen] = (0, import_react.useState)(false);
	const [isLaunchingAyByay, setIsLaunchingAyByay] = (0, import_react.useState)(false);
	const [isLaunchingBillManager, setIsLaunchingBillManager] = (0, import_react.useState)(false);
	const [activePortal, setActivePortal] = (0, import_react.useState)(null);
	const [currentDistrict, setCurrentDistrict] = (0, import_react.useState)(() => {
		try {
			const savedName = safeStorage.getItem("protyasha_weather_district_bn");
			if (savedName && savedName !== DEFAULT_BOOT_DISTRICT.nameBn) return {
				...DEFAULT_BOOT_DISTRICT,
				nameBn: savedName
			};
		} catch {}
		return DEFAULT_BOOT_DISTRICT;
	});
	const [weatherData, setWeatherData] = (0, import_react.useState)(null);
	const [selectedMethodFilter, setSelectedMethodFilter] = (0, import_react.useState)(null);
	const [deleteTrx, setDeleteTrx] = (0, import_react.useState)(null);
	const liveTimingsCacheRef = (0, import_react.useRef)(null);
	const [appToast, setAppToast] = (0, import_react.useState)(null);
	const showAppToast = (0, import_react.useCallback)((title, body, tone = "emerald", durationMs = 6e3) => {
		setAppToast({
			title,
			body,
			tone
		});
		setTimeout(() => {
			setAppToast((prev) => (prev === null || prev === void 0 ? void 0 : prev.title) === title ? null : prev);
		}, durationMs);
	}, []);
	const handlePushLocalNotification = (0, import_react.useCallback)((notif) => {
		setNotifications((prev) => {
			const next = [notif, ...prev.filter((n) => n.id !== notif.id)].slice(0, 80);
			try {
				safeStorage.setItem("protyasha_notifications", JSON.stringify(next));
			} catch {}
			return next;
		});
		sounds.playSuccess();
		const firstLine = (notif.bodyBn || "").split("\n")[0] || notif.titleBn;
		showAppToast(notif.titleBn, firstLine, "emerald", 8e3);
	}, [showAppToast]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let isSubscribed = true;
		const runAutomatedMonitoring = async () => {
			try {
				var _liveTimingsCacheRef$;
				const [{ fetchLiveWeather, detectPreciseLocation, getUserPreferredDistrict }, { checkAndGenerateWeatherNotifications }, prayerMod] = await Promise.all([
					__vitePreload(() => import("./chunk-weatherService.js").then((n) => n.l), __vite__mapDeps([0,1,2,3]), import.meta.url),
					__vitePreload(() => import("./chunk-weatherNotificationService.js"), __vite__mapDeps([32,2,3]), import.meta.url),
					__vitePreload(() => import("./chunk-prayerTimeService.js"), __vite__mapDeps([15,2,3,0,1]), import.meta.url)
				]);
				if (!isSubscribed) return;
				const preferred = getUserPreferredDistrict();
				let activeDistrict = preferred || currentDistrict;
				if (!preferred) {
					const { district } = await detectPreciseLocation(false);
					if (district && isSubscribed) {
						if (district.nameEn !== currentDistrict.nameEn) setCurrentDistrict(district);
						activeDistrict = district;
					}
				}
				const todayKey = `${activeDistrict.nameEn}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
				let liveTimings = ((_liveTimingsCacheRef$ = liveTimingsCacheRef.current) === null || _liveTimingsCacheRef$ === void 0 ? void 0 : _liveTimingsCacheRef$.key) === todayKey ? liveTimingsCacheRef.current.timings : void 0;
				const [w, fetchedTimings] = await Promise.all([fetchLiveWeather().catch(() => null), liveTimings ? Promise.resolve(liveTimings) : prayerMod.fetchLivePrayerTimes(activeDistrict).catch(() => null)]);
				if (fetchedTimings) {
					liveTimings = fetchedTimings;
					liveTimingsCacheRef.current = {
						key: todayKey,
						timings: fetchedTimings
					};
				}
				if (!isSubscribed) return;
				if (w) setWeatherData(w);
				let toastToTrigger = null;
				setNotifications((prevNotifications) => {
					let working = prevNotifications;
					let newlyAdded = null;
					if (w) {
						const weatherRes = checkAndGenerateWeatherNotifications(w, working);
						working = weatherRes.updatedNotifications;
						if (weatherRes.newlyAdded) newlyAdded = weatherRes.newlyAdded;
					}
					const prayerRes = prayerMod.checkAndGeneratePrayerNotifications(activeDistrict, working);
					working = prayerRes.updatedNotifications;
					if (prayerRes.newlyAdded) newlyAdded = prayerRes.newlyAdded;
					const fastingEnabled = prayerMod.isFastingReminderEnabled();
					const fastingRes = prayerMod.checkAndGenerateFastingReminders(activeDistrict, working, fastingEnabled, liveTimings);
					working = fastingRes.updatedNotifications;
					if (fastingRes.newlyAdded) {
						newlyAdded = fastingRes.newlyAdded;
						toastToTrigger = fastingRes.newlyAdded;
					}
					if (newlyAdded) {
						const trimmed = working.slice(0, 80);
						try {
							safeStorage.setItem("protyasha_notifications", JSON.stringify(trimmed));
						} catch (e) {
							console.warn("LocalStorage limit reached for notifications:", e);
						}
						if (newlyAdded.type === "alert") sounds.playSuccess();
						return trimmed;
					}
					return prevNotifications;
				});
				if (toastToTrigger) {
					const item = toastToTrigger;
					const summaryLine = item.sehriIftarData ? `সেহরি শেষ: ${item.sehriIftarData.sehriEndBn} · ইফতার: ${item.sehriIftarData.iftarBn}` : (item.bodyBn || "").split("\n")[0];
					showAppToast(item.titleBn, summaryLine, "emerald", 8e3);
				}
			} catch (err) {
				console.warn("Automated monitoring background error:", err);
			}
		};
		const initialTimer = setTimeout(runAutomatedMonitoring, 2600);
		const interval = setInterval(runAutomatedMonitoring, 3e5);
		return () => {
			isSubscribed = false;
			clearTimeout(initialTimer);
			clearInterval(interval);
		};
	}, [
		Boolean(user),
		currentDistrict.nameEn,
		showAppToast
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const checkFastingReminder = async () => {
			var _liveTimingsCacheRef$2;
			const [{ getUserPreferredDistrict }, prayerMod] = await Promise.all([__vitePreload(() => import("./chunk-weatherService.js").then((n) => n.l), __vite__mapDeps([0,1,2,3]), import.meta.url), __vitePreload(() => import("./chunk-prayerTimeService.js"), __vite__mapDeps([15,2,3,0,1]), import.meta.url)]);
			const enabled = prayerMod.isFastingReminderEnabled();
			if (!enabled) return;
			const activeDistrict = getUserPreferredDistrict() || currentDistrict;
			const todayKey = `${activeDistrict.nameEn}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
			let liveTimings = ((_liveTimingsCacheRef$2 = liveTimingsCacheRef.current) === null || _liveTimingsCacheRef$2 === void 0 ? void 0 : _liveTimingsCacheRef$2.key) === todayKey ? liveTimingsCacheRef.current.timings : void 0;
			if (!liveTimings) try {
				const fetched = await prayerMod.fetchLivePrayerTimes(activeDistrict);
				if (fetched) {
					liveTimings = fetched;
					liveTimingsCacheRef.current = {
						key: todayKey,
						timings: fetched
					};
				}
			} catch {}
			setNotifications((prev) => {
				const { updatedNotifications, newlyAdded } = prayerMod.checkAndGenerateFastingReminders(activeDistrict, prev, enabled, liveTimings);
				if (newlyAdded) {
					const trimmed = updatedNotifications.slice(0, 80);
					try {
						safeStorage.setItem("protyasha_notifications", JSON.stringify(trimmed));
					} catch {}
					sounds.playSuccess();
					const summaryLine = newlyAdded.sehriIftarData ? `সেহরি শেষ: ${newlyAdded.sehriIftarData.sehriEndBn} · ইফতার: ${newlyAdded.sehriIftarData.iftarBn}` : newlyAdded.bodyBn.split("\n")[0];
					showAppToast(newlyAdded.titleBn, summaryLine, "emerald", 1e4);
					return trimmed;
				}
				return prev;
			});
		};
		const initialCheck = setTimeout(() => {
			checkFastingReminder();
		}, 3200);
		const interval = setInterval(() => {
			checkFastingReminder();
		}, 3e4);
		const handleSettingChange = (e) => {
			var _custom$detail;
			if ((_custom$detail = e.detail) === null || _custom$detail === void 0 ? void 0 : _custom$detail.enabled) checkFastingReminder();
		};
		window.addEventListener("fasting-reminder-setting-changed", handleSettingChange);
		return () => {
			clearTimeout(initialCheck);
			clearInterval(interval);
			window.removeEventListener("fasting-reminder-setting-changed", handleSettingChange);
		};
	}, [
		Boolean(user),
		currentDistrict,
		showAppToast
	]);
	const handleUpdateCheckResult = (0, import_react.useCallback)(async (res, isBackgroundCheck = false) => {
		if (res.status === "update_available" || res.hasNewFeatures) {
			const { buildUpdateNotificationItem, markVersionFeaturesAcknowledged } = await __vitePreload(async () => {
				const { buildUpdateNotificationItem, markVersionFeaturesAcknowledged } = await import("./chunk-appVersion.js");
				return {
					buildUpdateNotificationItem,
					markVersionFeaturesAcknowledged
				};
			}, __vite__mapDeps([21,7,2]), import.meta.url);
			const updateNotif = buildUpdateNotificationItem(res);
			setNotifications((prev) => {
				if (prev.some((n) => n.id === updateNotif.id)) return prev;
				const next = [updateNotif, ...prev];
				try {
					safeStorage.setItem("protyasha_notifications", JSON.stringify(next));
				} catch {}
				return next;
			});
			const firstFeature = lang === "bn" ? res.releaseInfo.featuresBn[0] || res.releaseInfo.titleBn : res.releaseInfo.featuresEn[0] || res.releaseInfo.titleEn;
			if (res.status === "update_available") showAppToast(lang === "bn" ? `নতুন অ্যাপ আপডেট পাওয়া গেছে (v${res.latestVersion})` : `New App Update Available (v${res.latestVersion})`, firstFeature, "amber", 8e3);
			else {
				showAppToast(lang === "bn" ? `নতুন ফিচার যুক্ত হয়েছে (v${res.latestVersion})` : `New Features Added (v${res.latestVersion})`, firstFeature, "emerald", 7e3);
				markVersionFeaturesAcknowledged(res.releaseInfo);
			}
			if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && res.status === "update_available") try {
				new Notification(updateNotif.titleBn, { body: firstFeature });
			} catch {}
		} else if (!isBackgroundCheck && res.status === "up_to_date") showAppToast(lang === "bn" ? `আপনার অ্যাপটি সর্বশেষ ভার্সনে (v${res.currentVersion}) রয়েছে` : `App is on the latest version (v${res.currentVersion})`, lang === "bn" ? "সকল নতুন ফিচার সক্রিয় রয়েছে।" : "All latest features are active.", "emerald", 4500);
	}, [lang, showAppToast]);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(async () => {
			try {
				const { checkForAppUpdates } = await __vitePreload(async () => {
					const { checkForAppUpdates } = await import("./chunk-appVersion.js");
					return { checkForAppUpdates };
				}, __vite__mapDeps([21,7,2]), import.meta.url);
				const res = await checkForAppUpdates();
				if (res.status === "update_available" || res.hasNewFeatures) handleUpdateCheckResult(res, true);
			} catch {}
		}, 3500);
		return () => clearTimeout(timer);
	}, [handleUpdateCheckResult]);
	(0, import_react.useEffect)(() => {
		const handlePortalMessage = (event) => {
			var _event$data;
			if (((_event$data = event.data) === null || _event$data === void 0 ? void 0 : _event$data.action) === "close_portal") setActivePortal(null);
		};
		window.addEventListener("message", handlePortalMessage);
		return () => window.removeEventListener("message", handlePortalMessage);
	}, []);
	(0, import_react.useEffect)(() => {
		const handleStaffChanged = (event) => {
			if (event.detail && Array.isArray(event.detail)) {
				setStaffAccounts(event.detail);
				try {
					safeStorage.setItem("protyasha_staff", JSON.stringify(event.detail));
				} catch {}
			}
		};
		window.addEventListener("staff-data-changed", handleStaffChanged);
		return () => window.removeEventListener("staff-data-changed", handleStaffChanged);
	}, []);
	(0, import_react.useEffect)(() => {
		const isDeactivated = (svcId) => {
			const s = serviceStatuses[svcId];
			if (!s) return false;
			return s.isActive === false || String(s.isActive) === "false";
		};
		if (activePortal === "bill-manager" && isDeactivated("billManager")) {
			var _serviceStatuses$bill, _serviceStatuses$bill2, _serviceStatuses$bill3;
			setActivePortal(null);
			setActiveServiceNotice({
				name: "বিল ম্যানেজমেন্ট প্রো",
				title: (_serviceStatuses$bill = serviceStatuses.billManager) === null || _serviceStatuses$bill === void 0 ? void 0 : _serviceStatuses$bill.title,
				message: (_serviceStatuses$bill2 = serviceStatuses.billManager) === null || _serviceStatuses$bill2 === void 0 ? void 0 : _serviceStatuses$bill2.customMessage,
				logoUrl: (_serviceStatuses$bill3 = serviceStatuses.billManager) === null || _serviceStatuses$bill3 === void 0 ? void 0 : _serviceStatuses$bill3.logoUrl
			});
		}
		if (activePortal === "ay-byay" && isDeactivated("ayByay")) {
			var _serviceStatuses$ayBy, _serviceStatuses$ayBy2, _serviceStatuses$ayBy3;
			setActivePortal(null);
			setActiveServiceNotice({
				name: "আয়-ব্যয় হিসাব",
				title: (_serviceStatuses$ayBy = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy === void 0 ? void 0 : _serviceStatuses$ayBy.title,
				message: (_serviceStatuses$ayBy2 = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy2 === void 0 ? void 0 : _serviceStatuses$ayBy2.customMessage,
				logoUrl: (_serviceStatuses$ayBy3 = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy3 === void 0 ? void 0 : _serviceStatuses$ayBy3.logoUrl
			});
		}
		if (activeTab === "transactions" && isDeactivated("transactions")) {
			var _serviceStatuses$tran, _serviceStatuses$tran2, _serviceStatuses$tran3;
			setActiveTab("home");
			setActiveServiceNotice({
				name: "সকল লেনদেন ও স্টেটমেন্ট",
				title: (_serviceStatuses$tran = serviceStatuses.transactions) === null || _serviceStatuses$tran === void 0 ? void 0 : _serviceStatuses$tran.title,
				message: (_serviceStatuses$tran2 = serviceStatuses.transactions) === null || _serviceStatuses$tran2 === void 0 ? void 0 : _serviceStatuses$tran2.customMessage,
				logoUrl: (_serviceStatuses$tran3 = serviceStatuses.transactions) === null || _serviceStatuses$tran3 === void 0 ? void 0 : _serviceStatuses$tran3.logoUrl
			});
		}
		if (activeTab === "ledger" && isDeactivated("ledger")) {
			var _serviceStatuses$ledg, _serviceStatuses$ledg2, _serviceStatuses$ledg3;
			setActiveTab("home");
			setActiveServiceNotice({
				name: "অডিট ও রিপোর্ট খাতা",
				title: (_serviceStatuses$ledg = serviceStatuses.ledger) === null || _serviceStatuses$ledg === void 0 ? void 0 : _serviceStatuses$ledg.title,
				message: (_serviceStatuses$ledg2 = serviceStatuses.ledger) === null || _serviceStatuses$ledg2 === void 0 ? void 0 : _serviceStatuses$ledg2.customMessage,
				logoUrl: (_serviceStatuses$ledg3 = serviceStatuses.ledger) === null || _serviceStatuses$ledg3 === void 0 ? void 0 : _serviceStatuses$ledg3.logoUrl
			});
		}
		if (isStaffManagerOpen && isDeactivated("staffManager")) {
			var _serviceStatuses$staf, _serviceStatuses$staf2, _serviceStatuses$staf3;
			setIsStaffManagerOpen(false);
			setActiveServiceNotice({
				name: "স্টাফ কালেকশন ও কোম্পানি পাওনা",
				title: (_serviceStatuses$staf = serviceStatuses.staffManager) === null || _serviceStatuses$staf === void 0 ? void 0 : _serviceStatuses$staf.title,
				message: (_serviceStatuses$staf2 = serviceStatuses.staffManager) === null || _serviceStatuses$staf2 === void 0 ? void 0 : _serviceStatuses$staf2.customMessage,
				logoUrl: (_serviceStatuses$staf3 = serviceStatuses.staffManager) === null || _serviceStatuses$staf3 === void 0 ? void 0 : _serviceStatuses$staf3.logoUrl
			});
		}
		if (isQuickHisabOpen && isDeactivated("quickHisab")) {
			var _serviceStatuses$quic, _serviceStatuses$quic2, _serviceStatuses$quic3;
			setIsQuickHisabOpen(false);
			setActiveServiceNotice({
				name: "কুইক হিসাব ও লভ্যাংশ বণ্টন",
				title: (_serviceStatuses$quic = serviceStatuses.quickHisab) === null || _serviceStatuses$quic === void 0 ? void 0 : _serviceStatuses$quic.title,
				message: (_serviceStatuses$quic2 = serviceStatuses.quickHisab) === null || _serviceStatuses$quic2 === void 0 ? void 0 : _serviceStatuses$quic2.customMessage,
				logoUrl: (_serviceStatuses$quic3 = serviceStatuses.quickHisab) === null || _serviceStatuses$quic3 === void 0 ? void 0 : _serviceStatuses$quic3.logoUrl
			});
		}
		if (isSupportTicketsOpen && isDeactivated("supportTickets")) {
			var _serviceStatuses$supp, _serviceStatuses$supp2, _serviceStatuses$supp3;
			setIsSupportTicketsOpen(false);
			setActiveServiceNotice({
				name: "সাপোর্ট টিকেট ও কমপ্লেইন",
				title: (_serviceStatuses$supp = serviceStatuses.supportTickets) === null || _serviceStatuses$supp === void 0 ? void 0 : _serviceStatuses$supp.title,
				message: (_serviceStatuses$supp2 = serviceStatuses.supportTickets) === null || _serviceStatuses$supp2 === void 0 ? void 0 : _serviceStatuses$supp2.customMessage,
				logoUrl: (_serviceStatuses$supp3 = serviceStatuses.supportTickets) === null || _serviceStatuses$supp3 === void 0 ? void 0 : _serviceStatuses$supp3.logoUrl
			});
		}
		if (isStaffAttendanceOpen && isDeactivated("staffAttendance")) {
			var _serviceStatuses$staf4, _serviceStatuses$staf5, _serviceStatuses$staf6;
			setIsStaffAttendanceOpen(false);
			setActiveServiceNotice({
				name: "স্টাফ হাজিরা ও ছুটি",
				title: (_serviceStatuses$staf4 = serviceStatuses.staffAttendance) === null || _serviceStatuses$staf4 === void 0 ? void 0 : _serviceStatuses$staf4.title,
				message: (_serviceStatuses$staf5 = serviceStatuses.staffAttendance) === null || _serviceStatuses$staf5 === void 0 ? void 0 : _serviceStatuses$staf5.customMessage,
				logoUrl: (_serviceStatuses$staf6 = serviceStatuses.staffAttendance) === null || _serviceStatuses$staf6 === void 0 ? void 0 : _serviceStatuses$staf6.logoUrl
			});
		}
	}, [
		serviceStatuses,
		activePortal,
		activeTab,
		isStaffManagerOpen,
		isQuickHisabOpen,
		isSupportTicketsOpen,
		isStaffAttendanceOpen
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		if (!canAddTransactions(user) && isEntryModalOpen) {
			setIsEntryModalOpen(false);
			setEditingTransaction(null);
		}
		if (user.role === "staff") {
			if (activePortal) setActivePortal(null);
			if (activeTab === "transactions" || activeTab === "ledger") setActiveTab("home");
			if (isStaffManagerOpen) setIsStaffManagerOpen(false);
			if (isQuickHisabOpen) setIsQuickHisabOpen(false);
			if (isSupportTicketsOpen) setIsSupportTicketsOpen(false);
			if (isRecycleBinOpen) setIsRecycleBinOpen(false);
			if (isUserManagementOpen) setIsUserManagementOpen(false);
			if (isBannerManagerOpen) setIsBannerManagerOpen(false);
			if (isChannelManagerOpen) setIsChannelManagerOpen(false);
			if (isFooterSettingsOpen) setIsFooterSettingsOpen(false);
			if (isServiceManagerOpen) setIsServiceManagerOpen(false);
			if (isPopupNoticeManagerOpen) setIsPopupNoticeManagerOpen(false);
			if (isDriveBackupOpen) setIsDriveBackupOpen(false);
			if (isChangePinOpen) setIsChangePinOpen(false);
		} else if (user.role === "sub-admin") {
			if (activeTab === "transactions" && !hasSubAdminPermission(user, "transactions")) setActiveTab("home");
			if (activeTab === "ledger" && !hasSubAdminPermission(user, "ledger")) setActiveTab("home");
			if (activePortal === "ay-byay" && !hasSubAdminPermission(user, "ayByay")) setActivePortal(null);
			if (activePortal === "bill-manager" && !hasSubAdminPermission(user, "billManager")) setActivePortal(null);
			if (isQuickHisabOpen && !hasSubAdminPermission(user, "quickHisab")) setIsQuickHisabOpen(false);
			if (isStaffManagerOpen && !hasSubAdminPermission(user, "staffManager")) setIsStaffManagerOpen(false);
			if (isSupportTicketsOpen && !hasSubAdminPermission(user, "supportTickets")) setIsSupportTicketsOpen(false);
			if (isStaffAttendanceOpen && !hasSubAdminPermission(user, "staffAttendance")) setIsStaffAttendanceOpen(false);
		}
	}, [
		user,
		activePortal,
		activeTab,
		isStaffManagerOpen,
		isQuickHisabOpen,
		isSupportTicketsOpen,
		isEntryModalOpen,
		isStaffAttendanceOpen,
		isUserManagementOpen,
		isRecycleBinOpen,
		isServiceManagerOpen,
		isPopupNoticeManagerOpen,
		isBannerManagerOpen,
		isChannelManagerOpen,
		isFooterSettingsOpen,
		isDriveBackupOpen,
		isChangePinOpen
	]);
	(0, import_react.useEffect)(() => {
		syncMainLoginStaffSession(user, staffAccounts);
	}, [user, staffAccounts]);
	const isNavigatingBackRef = (0, import_react.useRef)(false);
	const isPrayerSubViewActiveRef = (0, import_react.useRef)(false);
	const isSupportSubViewActiveRef = (0, import_react.useRef)(false);
	const isAttendanceSubViewActiveRef = (0, import_react.useRef)(false);
	const isStaffManagerSubViewActiveRef = (0, import_react.useRef)(false);
	const isUserMgmtSubViewActiveRef = (0, import_react.useRef)(false);
	const isQuickHisabSubViewActiveRef = (0, import_react.useRef)(false);
	const isProfileSubViewActiveRef = (0, import_react.useRef)(false);
	const isWeatherSubViewActiveRef = (0, import_react.useRef)(false);
	const isDriveBackupSubViewActiveRef = (0, import_react.useRef)(false);
	const isBannerSubViewActiveRef = (0, import_react.useRef)(false);
	const isLoginSubViewActiveRef = (0, import_react.useRef)(false);
	const isPopupManagerSubViewActiveRef = (0, import_react.useRef)(false);
	const pushHistoryStep = (0, import_react.useCallback)(() => {
		if (!isNavigatingBackRef.current) try {
			window.history.pushState({
				appOverlay: true,
				time: Date.now()
			}, "");
		} catch {}
	}, []);
	const closeOverlayViaBack = (0, import_react.useCallback)((fallbackClose) => {
		if (!isNavigatingBackRef.current) try {
			var _window$history$state, _window$history$state2, _window$history$state3, _window$history$state4;
			if (((_window$history$state = window.history.state) === null || _window$history$state === void 0 ? void 0 : _window$history$state.appOverlay) || ((_window$history$state2 = window.history.state) === null || _window$history$state2 === void 0 ? void 0 : _window$history$state2.appSubView) || ((_window$history$state3 = window.history.state) === null || _window$history$state3 === void 0 ? void 0 : _window$history$state3.ayByayPortal) || ((_window$history$state4 = window.history.state) === null || _window$history$state4 === void 0 ? void 0 : _window$history$state4.billManagerPortal)) {
				window.history.back();
				return;
			}
		} catch {}
		fallbackClose();
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			window.history.replaceState({ appRoot: true }, "");
		} catch {}
	}, []);
	const stateRef = (0, import_react.useRef)({
		publicTrackTicketId,
		deleteTrx,
		user,
		activePortal,
		isUserManagementOpen,
		selectedNotificationDetail,
		receiptTransaction,
		isEntryModalOpen,
		isBannerManagerOpen,
		isChannelManagerOpen,
		isStaffManagerOpen,
		isRecycleBinOpen,
		isAuditLogOpen,
		isChangePinOpen,
		isFooterSettingsOpen,
		isWeatherOpen,
		isPrayerTimesOpen,
		isNotificationsOpen,
		isProfileOpen,
		selectedTransaction,
		isLoginOpen,
		activeTab,
		activeServiceNotice,
		isQuickHisabOpen,
		isServiceManagerOpen,
		isDriveBackupOpen,
		isSupportTicketsOpen,
		isStaffAttendanceOpen,
		isPopupNoticeManagerOpen,
		previewPopupNotice
	});
	stateRef.current = {
		publicTrackTicketId,
		deleteTrx,
		user,
		activePortal,
		isUserManagementOpen,
		selectedNotificationDetail,
		receiptTransaction,
		isEntryModalOpen,
		isBannerManagerOpen,
		isChannelManagerOpen,
		isStaffManagerOpen,
		isRecycleBinOpen,
		isAuditLogOpen,
		isChangePinOpen,
		isFooterSettingsOpen,
		isWeatherOpen,
		isPrayerTimesOpen,
		isNotificationsOpen,
		isProfileOpen,
		selectedTransaction,
		isLoginOpen,
		activeTab,
		activeServiceNotice,
		isQuickHisabOpen,
		isServiceManagerOpen,
		isDriveBackupOpen,
		isSupportTicketsOpen,
		isStaffAttendanceOpen,
		isPopupNoticeManagerOpen,
		previewPopupNotice
	};
	(0, import_react.useEffect)(() => {
		const releaseBackLock = () => {
			setTimeout(() => {
				isNavigatingBackRef.current = false;
			}, 50);
		};
		const handlePopState = () => {
			isNavigatingBackRef.current = true;
			const s = stateRef.current;
			const hState = window.history.state || {};
			if (s.publicTrackTicketId) {
				isPublicPreviewOverlayRef.current = false;
				setPublicTrackTicketId(null);
			} else if (s.previewPopupNotice) setPreviewPopupNotice(null);
			else if (s.deleteTrx) setDeleteTrx(null);
			else if (s.activeServiceNotice) setActiveServiceNotice(null);
			else if (s.activePortal) {
				if (s.activePortal === "ay-byay" && hState && hState.ayByayPortal) {
					releaseBackLock();
					return;
				}
				if (s.activePortal === "bill-manager" && hState && hState.billManagerPortal) {
					releaseBackLock();
					return;
				}
				setActivePortal(null);
			} else if (s.isUserManagementOpen) {
				if (isUserMgmtSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsUserManagementOpen(false);
			} else if (s.isDriveBackupOpen) {
				if (isDriveBackupSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsDriveBackupOpen(false);
			} else if (s.selectedNotificationDetail) setSelectedNotificationDetail(null);
			else if (s.receiptTransaction) setReceiptTransaction(null);
			else if (s.isEntryModalOpen) {
				setIsEntryModalOpen(false);
				setEditingTransaction(null);
			} else if (s.isBannerManagerOpen) {
				if (isBannerSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsBannerManagerOpen(false);
			} else if (s.isChannelManagerOpen) setIsChannelManagerOpen(false);
			else if (s.isStaffManagerOpen) {
				if (isStaffManagerSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsStaffManagerOpen(false);
			} else if (s.isServiceManagerOpen) setIsServiceManagerOpen(false);
			else if (s.isPopupNoticeManagerOpen) {
				if (isPopupManagerSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsPopupNoticeManagerOpen(false);
			} else if (s.isRecycleBinOpen) setIsRecycleBinOpen(false);
			else if (s.isAuditLogOpen) setIsAuditLogOpen(false);
			else if (s.isChangePinOpen) setIsChangePinOpen(false);
			else if (s.isFooterSettingsOpen) setIsFooterSettingsOpen(false);
			else if (s.isWeatherOpen) {
				if (isWeatherSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsWeatherOpen(false);
			} else if (s.isQuickHisabOpen) {
				if (isQuickHisabSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsQuickHisabOpen(false);
			} else if (s.isSupportTicketsOpen) {
				if (isSupportSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsSupportTicketsOpen(false);
			} else if (s.isStaffAttendanceOpen) {
				if (isAttendanceSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsStaffAttendanceOpen(false);
			} else if (s.isPrayerTimesOpen) {
				if (isPrayerSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsPrayerTimesOpen(false);
			} else if (s.isNotificationsOpen) {
				setIsNotificationsOpen(false);
				setEditingNotification(null);
			} else if (s.isProfileOpen) {
				if (isProfileSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setIsProfileOpen(false);
			} else if (s.selectedTransaction) setSelectedTransaction(null);
			else if (s.isLoginOpen) {
				if (isLoginSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				if (isLoggedInSession(s.user)) setIsLoginOpen(false);
				else try {
					window.history.pushState({ screen: "login" }, "", window.location.pathname);
				} catch {}
			} else if (s.activeTab !== "home") {
				if (s.activeTab === "profile" && isProfileSubViewActiveRef.current) {
					releaseBackLock();
					return;
				}
				setActiveTab("home");
			}
			releaseBackLock();
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);
	(0, import_react.useEffect)(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, [
		activeTab,
		selectedTransaction,
		activePortal,
		isPrayerTimesOpen,
		isWeatherOpen,
		isNotificationsOpen,
		isProfileOpen,
		publicTrackTicketId
	]);
	(0, import_react.useEffect)(() => {
		if (theme === "dark") document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
		safeStorage.setItem("protyasha_theme", theme);
	}, [theme]);
	(0, import_react.useEffect)(() => {
		document.body.setAttribute("data-lang", lang);
		safeStorage.setItem("protyasha_lang", lang);
	}, [lang]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubscribeTransactions = null;
		try {
			const q = collection(db, "transactions");
			unsubscribeTransactions = onSnapshot(q, (snapshot) => {
				const cloudTxs = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					const docId = (data === null || data === void 0 ? void 0 : data.id) || docSnap.id;
					if (data && docId && !String(docId).startsWith("txn-init-")) cloudTxs.push({
						...data,
						id: String(docId)
					});
				});
				const mainTxs = cloudTxs.filter((t) => t.source !== "ay-byay");
				const activeMainTxs = mainTxs.filter((t) => !t.isDeleted && t.isDeleted !== "true");
				setTransactions(mainTxs);
				const income = activeMainTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
				const expense = activeMainTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
				setServerTotals({
					income,
					expense,
					balance: income - expense,
					totalCount: activeMainTxs.length
				});
				setHasMoreTransactions(activeMainTxs.length > 50);
				try {
					safeStorage.setItem("protyasha_transactions", JSON.stringify(mainTxs));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "transactions");
			});
		} catch (e) {
			console.warn("Transaction collection listener error:", e);
		}
		return () => {
			if (unsubscribeTransactions) unsubscribeTransactions();
		};
	}, [Boolean(user), userKey]);
	(0, import_react.useEffect)(() => {
		let unsubServices = null;
		try {
			unsubServices = onSnapshot(doc(db, "settings", "service_control"), (snapshot) => {
				if (!snapshot.exists()) return;
				const data = snapshot.data();
				if (data && typeof data.statuses === "object" && Object.keys(data.statuses).length > 0) setServiceStatuses((prev) => {
					const merged = { ...prev };
					Object.keys(data.statuses).forEach((key) => {
						var _merged$key;
						const incoming = data.statuses[key];
						const fallbackLogo = key === "ayByay" ? "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png" : key === "billManager" ? "https://bill-manager.ai.studio/logo.jpg" : "";
						merged[key] = {
							...merged[key],
							...incoming,
							logoUrl: (incoming === null || incoming === void 0 ? void 0 : incoming.logoUrl) || ((_merged$key = merged[key]) === null || _merged$key === void 0 ? void 0 : _merged$key.logoUrl) || fallbackLogo
						};
					});
					try {
						safeStorage.setItem("protyasha_service_statuses", JSON.stringify(merged));
					} catch {}
					return merged;
				});
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, "settings/service_control");
			});
		} catch {}
		let unsubFooter = null;
		try {
			unsubFooter = onSnapshot(doc(db, "settings", "footer_config"), (snapshot) => {
				if (!snapshot.exists()) return;
				const data = snapshot.data();
				if (data && data.config && Object.keys(data.config).length > 0) {
					setFooterConfig(data.config);
					try {
						safeStorage.setItem("protyasha_footer", JSON.stringify(data.config));
					} catch {}
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, "settings/footer_config");
			});
		} catch {}
		let unsubAdminProfile = null;
		try {
			unsubAdminProfile = onSnapshot(doc(db, "settings", "admin_profile"), (snapshot) => {
				if (!snapshot.exists()) return;
				const ap = snapshot.data();
				const serverAvatar = typeof ap.avatarUrl === "string" && ap.avatarUrl && !ap.avatarUrl.startsWith("/uploads/") ? ap.avatarUrl : "";
				if (serverAvatar) {
					setAdminAvatar(serverAvatar);
					safeStorage.setItem("protyasha_admin_avatar", serverAvatar);
					if (serverAvatar.startsWith("data:image/")) savePersistentImage("avatar_admin", serverAvatar);
				}
				setUser((prev) => {
					if (!prev || prev.role !== "admin") return prev;
					const nextName = ap.name || prev.name;
					const nextPhone = ap.phone || prev.phone;
					const nextAvatar = serverAvatar || prev.avatarUrl;
					if (nextName === prev.name && nextPhone === prev.phone && nextAvatar === prev.avatarUrl) return prev;
					return {
						...prev,
						name: nextName,
						phone: nextPhone,
						avatarUrl: nextAvatar
					};
				});
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, "settings/admin_profile");
			});
		} catch {}
		return () => {
			if (unsubServices) unsubServices();
			if (unsubFooter) unsubFooter();
			if (unsubAdminProfile) unsubAdminProfile();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let unsubNotifs = null;
		let unsubAudit = null;
		const timer = setTimeout(() => {
			try {
				unsubNotifs = onSnapshot(doc(db, "settings", "broadcast_notifications"), (snapshot) => {
					if (!snapshot.exists()) return;
					const data = snapshot.data();
					if (Array.isArray(data.list)) {
						const sorted = [...data.list].sort((a, b) => {
							const timeA = typeof a.id === "string" && a.id.includes("-") ? parseInt(a.id.split("-").pop() || "0", 10) : 0;
							return (typeof b.id === "string" && b.id.includes("-") ? parseInt(b.id.split("-").pop() || "0", 10) : 0) - timeA;
						});
						const cleaned = cleanDemoNotifications(sorted);
						setNotifications((prev) => {
							const merged = mergeCloudAndLocalNotifications(cleaned, prev);
							try {
								safeStorage.setItem("protyasha_notifications", JSON.stringify(merged));
							} catch {}
							return merged;
						});
					}
				}, (err) => {
					handleFirestoreError(err, OperationType.GET, "settings/broadcast_notifications");
				});
			} catch (e) {
				console.warn("Broadcast notification listener error:", e);
			}
			try {
				unsubAudit = onSnapshot(doc(db, "settings", "audit_logs"), (snapshot) => {
					if (!snapshot.exists()) return;
					const data = snapshot.data();
					if (data && Array.isArray(data.logs)) {
						setAuditLogs(data.logs);
						try {
							safeStorage.setItem("protyasha_audit", JSON.stringify(data.logs));
						} catch {}
					}
				}, (err) => {
					handleFirestoreError(err, OperationType.GET, "settings/audit_logs");
				});
			} catch {}
		}, 450);
		return () => {
			clearTimeout(timer);
			if (unsubNotifs) unsubNotifs();
			if (unsubAudit) unsubAudit();
		};
	}, [Boolean(user)]);
	const isStorageSyncMountedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_transactions", JSON.stringify(transactions));
		} catch (e) {
			console.warn("LocalStorage limit reached for transactions:", e);
		}
	}, [transactions]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_staff", JSON.stringify(staffAccounts));
		} catch (e) {
			console.warn("LocalStorage limit reached for staffAccounts:", e);
		}
	}, [staffAccounts]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_channels", JSON.stringify(channels));
		} catch (e) {
			console.warn("LocalStorage limit reached for channels:", e);
		}
	}, [channels]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_banners", JSON.stringify(banners));
		} catch (e) {
			console.warn("LocalStorage limit reached for banners:", e);
		}
	}, [banners]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_notifications", JSON.stringify(notifications));
		} catch (e) {
			console.warn("LocalStorage limit reached for notifications:", e);
		}
	}, [notifications]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_footer", JSON.stringify(footerConfig));
		} catch (e) {
			console.warn("LocalStorage limit reached for footer:", e);
		}
	}, [footerConfig]);
	(0, import_react.useEffect)(() => {
		if (!isStorageSyncMountedRef.current) return;
		try {
			safeStorage.setItem("protyasha_audit", JSON.stringify(auditLogs));
		} catch (e) {
			console.warn("LocalStorage limit reached for audit logs:", e);
		}
	}, [auditLogs]);
	(0, import_react.useEffect)(() => {
		isStorageSyncMountedRef.current = true;
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) try {
			safeStorage.setItem("protyasha_user", JSON.stringify(user));
		} catch (e) {
			console.warn("LocalStorage limit reached for user session:", e);
		}
		else safeStorage.removeItem("protyasha_user");
	}, [user]);
	const totalBalance = (0, import_react.useMemo)(() => {
		return transactions.filter((t) => !t.isDeleted && t.isDeleted !== "true").reduce((acc, curr) => {
			const amt = Number(curr.amount) || 0;
			return curr.type === "income" || curr.categoryType === "income" ? acc + amt : acc - amt;
		}, 0);
	}, [transactions]);
	const transactionsForList = (0, import_react.useMemo)(() => {
		if ((user === null || user === void 0 ? void 0 : user.role) === "sub-admin") return transactions.filter((t) => isTransactionOwner(t, user));
		return transactions;
	}, [transactions, user]);
	const userDistrictSlug = ((currentDistrict === null || currentDistrict === void 0 ? void 0 : currentDistrict.nameEn) || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "");
	const userDistrictUnderscoreSlug = ((currentDistrict === null || currentDistrict === void 0 ? void 0 : currentDistrict.nameEn) || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "_");
	const userNotifications = notifications.filter((n) => {
		if (n.isFastingAlert || n.isPrayerAlert || n.isWeatherAlert || n.id.startsWith("fasting_") || n.id.startsWith("prayer_") || n.id.startsWith("weather-") || n.type === "weather") {
			var _n$sehriIftarData, _n$sehriIftarData2;
			if (n.isGlobal) return true;
			const targetEn = n.districtEn || ((_n$sehriIftarData = n.sehriIftarData) === null || _n$sehriIftarData === void 0 ? void 0 : _n$sehriIftarData.districtEn);
			if (targetEn) return targetEn.toLowerCase().replace(/[^a-z0-9]/g, "") === userDistrictSlug;
			const targetBn = n.districtBn || ((_n$sehriIftarData2 = n.sehriIftarData) === null || _n$sehriIftarData2 === void 0 ? void 0 : _n$sehriIftarData2.districtBn);
			if (targetBn) return targetBn === (currentDistrict === null || currentDistrict === void 0 ? void 0 : currentDistrict.nameBn);
			const cleanId = n.id.toLowerCase();
			return cleanId.includes(`_${userDistrictSlug}_`) || cleanId.includes(`_${userDistrictUnderscoreSlug}_`) || cleanId.includes(`-${userDistrictSlug}-`);
		}
		return true;
	}).map((n) => ({
		...n,
		isRead: isNotifReadForUser(n)
	}));
	const unreadNotificationsCount = userNotifications.filter((n) => !n.isRead).length;
	const existingCustomers = Array.from(new Set(transactions.filter((t) => !t.isDeleted).map((t) => t.person).filter(Boolean)));
	const logAction = (action, actionBn, details) => {
		const updatedLogs = [{
			id: `log-${Date.now()}`,
			action,
			actionBn,
			user: (user === null || user === void 0 ? void 0 : user.name) || "Admin",
			details,
			time: Date.now()
		}, ...auditLogs].slice(0, 100);
		setAuditLogs(updatedLogs);
		safeSetDoc(doc(db, "settings", "audit_logs"), {
			logs: updatedLogs,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch(() => {});
	};
	const handleSaveServiceStatuses = (updated) => {
		setServiceStatuses(updated);
		try {
			safeStorage.setItem("protyasha_service_statuses", JSON.stringify(updated));
		} catch {}
		Object.keys(updated).forEach((svcId) => {
			var _updated$svcId;
			if ((_updated$svcId = updated[svcId]) === null || _updated$svcId === void 0 ? void 0 : _updated$svcId.logoUrl) savePersistentImage(`service_logo_${svcId}`, updated[svcId].logoUrl);
		});
		safeSetDoc(doc(db, "settings", "service_control"), {
			id: "service_control",
			statuses: updated,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch((err) => console.error("Service control sync error:", err));
	};
	const checkServiceAccess = (serviceId, displayName) => {
		if ((user === null || user === void 0 ? void 0 : user.role) === "staff" && serviceId !== "staffAttendance") {
			sounds.playTap();
			showAppToast(lang === "bn" ? "স্টাফ অ্যাকাউন্ট সীমাবদ্ধ" : "Staff Account Restricted", lang === "bn" ? "স্টাফ লগইন দিয়ে শুধুমাত্র \"স্টাফ হাজিরা ও ছুটি\" অপশন ব্যবহার করা যাবে।" : "Staff accounts can only access the Staff Attendance module.", "amber", 5e3);
			return false;
		}
		if ((user === null || user === void 0 ? void 0 : user.role) === "sub-admin") {
			const permKey = {
				transactions: "transactions",
				ledger: "ledger",
				billManager: "billManager",
				ayByay: "ayByay",
				quickHisab: "quickHisab",
				staffManager: "staffManager",
				staffAttendance: "staffAttendance",
				supportTickets: "supportTickets"
			}[serviceId];
			if (permKey && !hasSubAdminPermission(user, permKey)) {
				sounds.playTap();
				showAppToast(lang === "bn" ? "অনুমতি সীমাবদ্ধ" : "Access Restricted", lang === "bn" ? `মেইন এডমিন আপনার সাব-এডমিন অ্যাকাউন্টে "${displayName}" সেবার অনুমতি চালু করেননি।` : `Main Admin has not enabled "${displayName}" permission for this Sub-Admin account.`, "amber", 5e3);
				return false;
			}
		}
		const status = serviceStatuses[serviceId];
		if (status && (status.isActive === false || String(status.isActive) === "false")) {
			setActiveServiceNotice({
				name: displayName,
				title: status.title,
				message: status.customMessage,
				logoUrl: status.logoUrl
			});
			pushHistoryStep();
			return false;
		}
		return true;
	};
	const handleLaunchAyByay = () => {
		if (!checkServiceAccess("ayByay", "আয়-ব্যয় হিসাব")) return;
		sounds.playTap();
		setIsLaunchingAyByay(true);
		setTimeout(() => {
			setActivePortal("ay-byay");
			pushHistoryStep();
			setIsLaunchingAyByay(false);
		}, 950);
	};
	const handleLaunchBillManager = () => {
		if (!checkServiceAccess("billManager", "বিল ম্যানেজমেন্ট প্রো")) return;
		sounds.playTap();
		setIsLaunchingBillManager(true);
		setTimeout(() => {
			try {
				window.history.pushState({
					appOverlay: true,
					billManagerPortal: true,
					appStep: "bm-root",
					view: "dashboard",
					time: Date.now()
				}, "");
			} catch {}
			setActivePortal("bill-manager");
			setIsLaunchingBillManager(false);
		}, 950);
	};
	const saveNotificationsToCloud = (list) => {
		const cloudBroadcasts = list.filter((n) => n && !isLocalAutoNotification(n)).slice(0, 50);
		safeSetDoc(doc(db, "settings", "broadcast_notifications"), {
			list: cloudBroadcasts,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch(() => {});
	};
	const handleSendNotification = (data) => {
		const newNotif = {
			...data,
			id: `notif-${Date.now()}`,
			isRead: false,
			readBy: []
		};
		const updatedNotifications = [newNotif, ...notifications];
		setNotifications(updatedNotifications);
		logAction("Sent Notification", "নোটিফিকেশন পাঠানো হয়েছে", `${newNotif.titleBn}`);
		sounds.playSuccess();
		saveNotificationsToCloud(updatedNotifications);
		triggerConfetti({
			particleCount: 30,
			spread: 60,
			origin: { y: .3 }
		});
	};
	const handleMarkNotificationAsRead = (id) => {
		const key = `protyasha_read_notifs_${userKey}`;
		const newRead = Array.from(/* @__PURE__ */ new Set([...readNotifIds, id]));
		setReadNotifIds(newRead);
		try {
			safeStorage.setItem(key, JSON.stringify(newRead));
		} catch {}
		if (user === null || user === void 0 ? void 0 : user.id) safeSetDoc(doc(db, "users", user.id), {
			id: user.id,
			role: user.role || "user",
			status: "active",
			readNotifications: newRead.slice(-450)
		}, { merge: true }).catch(() => {});
		const updatedNotifications = notifications.map((n) => {
			if (n.id === id) {
				const existingReadBy = Array.isArray(n.readBy) ? n.readBy : [];
				if (!existingReadBy.includes(userKey)) return {
					...n,
					readBy: [...existingReadBy, userKey]
				};
			}
			return n;
		});
		setNotifications(updatedNotifications);
		saveNotificationsToCloud(updatedNotifications);
	};
	const handleMarkAllAsRead = () => {
		const allIds = notifications.map((n) => n.id);
		const key = `protyasha_read_notifs_${userKey}`;
		const newRead = Array.from(/* @__PURE__ */ new Set([...readNotifIds, ...allIds]));
		setReadNotifIds(newRead);
		try {
			safeStorage.setItem(key, JSON.stringify(newRead));
		} catch {}
		if (user === null || user === void 0 ? void 0 : user.id) safeSetDoc(doc(db, "users", user.id), {
			id: user.id,
			role: user.role || "user",
			status: "active",
			readNotifications: newRead.slice(-450)
		}, { merge: true }).catch(() => {});
		const updatedNotifications = notifications.map((n) => {
			const existingReadBy = Array.isArray(n.readBy) ? n.readBy : [];
			if (!existingReadBy.includes(userKey)) return {
				...n,
				readBy: [...existingReadBy, userKey]
			};
			return n;
		});
		setNotifications(updatedNotifications);
		saveNotificationsToCloud(updatedNotifications);
	};
	const handleDeleteNotification = (id) => {
		sounds.playTap();
		const updatedNotifications = notifications.filter((n) => n.id !== id);
		setNotifications(updatedNotifications);
		logAction("Deleted Notification", "নোটিফিকেশন মুছে ফেলা হয়েছে", `ID: ${id}`);
		saveNotificationsToCloud(updatedNotifications);
	};
	const handleSaveEntry = (entryData) => {
		if (entryData.id) {
			const existing = transactions.find((t) => t.id === entryData.id);
			if (existing) {
				const perm = canModifyTransaction(existing, user);
				if (!perm.allowed) {
					sounds.playTap();
					showAppToast(lang === "bn" ? "এডিট করার সময়সীমা বা অনুমতি নেই" : "Edit Permission Denied", perm.expired ? lang === "bn" ? "সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত এডিট করতে পারবেন।" : "Sub-admin can only edit within 30 minutes." : lang === "bn" ? "আপনি অন্য কারো এন্ট্রি এডিট করতে পারবেন না।" : "You can only edit your own entries.", "amber");
					return;
				}
			}
		} else if (!canAddTransactions(user)) {
			sounds.playTap();
			if (isLoggedInSession(user)) showAppToast(lang === "bn" ? "রিড-অনলি মোড / অনুমতি নেই" : "Read-Only / Permission Denied", lang === "bn" ? "আপনার অ্যাকাউন্ট দিয়ে নতুন ডেটা যোগ বা পরিবর্তন করা যাবে না।" : "Your account does not have permission to add or modify records.", "amber", 5e3);
			else openLoginView();
			return;
		}
		sounds.playSuccess();
		triggerConfetti({
			particleCount: 35,
			spread: 60,
			origin: { y: .6 }
		});
		let updatedTransactions;
		let savedTrx;
		if (entryData.id) {
			const existing = transactions.find((t) => t.id === entryData.id);
			const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
			const prefix = entryData.method === "ব্যাংক" ? "765B" : "765M";
			savedTrx = {
				...existing || {},
				...entryData,
				id: entryData.id,
				trxId: (existing === null || existing === void 0 ? void 0 : existing.trxId) || `${prefix}${randomHex}`,
				recordedBy: (existing === null || existing === void 0 ? void 0 : existing.recordedBy) || (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.phone) || "admin-master",
				recordedByGmail: (existing === null || existing === void 0 ? void 0 : existing.recordedByGmail) || (user === null || user === void 0 ? void 0 : user.gmail) || void 0,
				source: "main",
				isDeleted: (existing === null || existing === void 0 ? void 0 : existing.isDeleted) ?? false,
				created: (existing === null || existing === void 0 ? void 0 : existing.created) || Date.now()
			};
			updatedTransactions = existing ? transactions.map((t) => t.id === entryData.id ? savedTrx : t) : [...transactions, savedTrx];
			if ((selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === entryData.id) setSelectedTransaction(savedTrx);
			logAction("Updated Transaction", "এন্ট্রি হালনাগাদ", `${entryData.person} (${entryData.method}) - ${entryData.amount} টাকা`);
		} else {
			const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
			const prefix = entryData.method === "ব্যাংক" ? "765B" : "765M";
			savedTrx = {
				...entryData,
				id: `trx-${Date.now()}`,
				trxId: `${prefix}${randomHex}`,
				recordedBy: (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.phone) || "admin-master",
				recordedByGmail: (user === null || user === void 0 ? void 0 : user.gmail) || void 0,
				source: "main",
				isDeleted: false,
				created: Date.now()
			};
			updatedTransactions = [...transactions, savedTrx];
			logAction("Created Transaction", "নতুন লেনদেন এন্ট্রি", `${savedTrx.type === "income" ? "জমা" : "খরচ"} [${savedTrx.method}]: ${savedTrx.person} - ${savedTrx.amount} টাকা`);
		}
		setTransactions(updatedTransactions);
		safeSetDoc(doc(db, "transactions", savedTrx.id), savedTrx).catch((e) => {
			console.warn("Firestore transaction save error:", e);
		});
		setIsEntryModalOpen(false);
		setEditingTransaction(null);
		if (entryData.method) {
			setSelectedMethodFilter(entryData.method);
			setActiveTab("transactions");
		}
	};
	const handleDeleteTransaction = (trx) => {
		const perm = canModifyTransaction(trx, user);
		if (!perm.allowed) {
			sounds.playTap();
			showAppToast(lang === "bn" ? "ডিলিট করার সময়সীমা বা অনুমতি নেই" : "Delete Permission Denied", perm.expired ? lang === "bn" ? "সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত ডিলিট করতে পারবেন।" : "Sub-admin can only delete within 30 minutes." : lang === "bn" ? "আপনি কেবল আপনার নিজের এন্ট্রি ডিলিট করতে পারবেন।" : "You can only delete your own entries.", "amber");
			return;
		}
		sounds.playTap();
		setDeleteTrx(trx);
		pushHistoryStep();
	};
	const confirmDelete = () => {
		if (!deleteTrx) return;
		if (!canModifyTransaction(deleteTrx, user).allowed) {
			setDeleteTrx(null);
			return;
		}
		const softDeletedTrx = {
			...deleteTrx,
			isDeleted: true
		};
		const updatedTransactions = transactions.map((t) => t.id === deleteTrx.id ? softDeletedTrx : t);
		setTransactions(updatedTransactions);
		try {
			safeStorage.setItem("protyasha_transactions", JSON.stringify(updatedTransactions));
		} catch {}
		if ((selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === deleteTrx.id) setSelectedTransaction(null);
		logAction("Deleted Transaction", "লেনদেন রিসাইকেল বিনে পাঠানো হয়েছে", `${deleteTrx.person} - #${deleteTrx.trxId}`);
		safeSetDoc(doc(db, "transactions", deleteTrx.id), softDeletedTrx).catch(() => {});
		setDeleteTrx(null);
	};
	const handleStartEdit = (trx) => {
		const perm = canModifyTransaction(trx, user);
		if (!perm.allowed) {
			sounds.playTap();
			showAppToast(lang === "bn" ? "এডিট করার সময়সীমা বা অনুমতি নেই" : "Edit Permission Denied", perm.expired ? lang === "bn" ? "সাব-এডমিন কেবল এন্ট্রির ৩০ মিনিট পর্যন্ত এডিট করতে পারবেন।" : "Sub-admin can only edit within 30 minutes." : lang === "bn" ? "আপনি কেবল আপনার নিজের এন্ট্রি এডিট করতে পারবেন।" : "You can only edit your own entries.", "amber");
			return;
		}
		sounds.playTap();
		setEditingTransaction(trx);
		setEntryType(trx.type);
		setIsEntryModalOpen(true);
		pushHistoryStep();
	};
	const handleRestore = (id) => {
		sounds.playSuccess();
		const targetTrx = transactions.find((t) => t.id === id);
		const updatedTransactions = transactions.map((t) => t.id === id ? {
			...t,
			isDeleted: false
		} : t);
		setTransactions(updatedTransactions);
		if (targetTrx) safeSetDoc(doc(db, "transactions", id), {
			...targetTrx,
			isDeleted: false
		}).catch(() => {});
		logAction("Restored Transaction", "লেনদেন পুনরুদ্ধার", `ID: ${id}`);
	};
	const handlePermanentDelete = async (id) => {
		sounds.playTap();
		if (await showConfirm(lang === "bn" ? "এই লেনদেনটি স্থায়ীভাবে মুছে ফেলতে চান?" : "Delete permanently?", {
			title: lang === "bn" ? "স্থায়ীভাবে মুছুন" : "Permanent Delete",
			confirmLabel: lang === "bn" ? "মুছে ফেলুন" : "Delete",
			cancelLabel: lang === "bn" ? "বাতিল" : "Cancel",
			destructive: true
		})) {
			const updatedTransactions = transactions.filter((t) => t.id !== id);
			setTransactions(updatedTransactions);
			try {
				safeStorage.setItem("protyasha_transactions", JSON.stringify(updatedTransactions));
			} catch {}
			safeDeleteDoc(doc(db, "transactions", id)).catch(() => {});
			if ((selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === id) setSelectedTransaction(null);
			logAction("Permanent Delete", "স্থায়ীভাবে মুছে ফেলা", `ID: ${id}`);
		}
	};
	const handleEmptyTrash = () => {
		sounds.playTap();
		const deletedItems = transactions.filter((t) => t.isDeleted);
		const updatedTransactions = transactions.filter((t) => !t.isDeleted);
		setTransactions(updatedTransactions);
		try {
			safeStorage.setItem("protyasha_transactions", JSON.stringify(updatedTransactions));
		} catch {}
		deletedItems.forEach((t) => {
			safeDeleteDoc(doc(db, "transactions", t.id)).catch(() => {});
		});
		logAction("Emptied Trash", "রিসাইকেল বিন সম্পূর্ণ খালি", "All trash cleared");
	};
	const handleLoginSuccess = (loggedInUser) => {
		setSessionNotice("");
		setUser(loggedInUser);
		safeStorage.setItem("protyasha_user", JSON.stringify(loggedInUser));
		if (loggedInUser.role !== "visitor") sessionStorage.setItem("protyasha_session_active", "true");
		else sessionStorage.setItem("protyasha_session_active", "false");
		if (loggedInUser.avatarUrl) safeStorage.setItem("protyasha_last_avatar", loggedInUser.avatarUrl);
		else safeStorage.removeItem("protyasha_last_avatar");
		setIsLoginOpen(false);
		setIsProfileOpen(false);
		setActiveTab("home");
		logAction("User Login", loggedInUser.role === "admin" ? "এডমিন লগইন" : loggedInUser.role === "sub-admin" ? "সাব-এডমিন লগইন" : loggedInUser.role === "staff" ? "স্টাফ লগইন (হাজিরা)" : loggedInUser.role === "user" ? "ইউজার লগইন" : "ভিজিটর মোড", `${loggedInUser.name} (${loggedInUser.phone || "N/A"})`);
	};
	const handleLogout = async () => {
		sounds.playTap();
		const currentSessionUser = userRef.current;
		if ((currentSessionUser === null || currentSessionUser === void 0 ? void 0 : currentSessionUser.avatarUrl) && currentSessionUser.role !== "visitor") safeStorage.setItem("protyasha_last_avatar", currentSessionUser.avatarUrl);
		if (currentSessionUser && currentSessionUser.role !== "visitor") await Promise.race([releaseDeviceSession(currentSessionUser), new Promise((resolve) => setTimeout(resolve, 1500))]).catch(() => {});
		setSessionNotice("");
		safeStorage.removeItem("protyasha_user");
		sessionStorage.removeItem("protyasha_session_active");
		try {
			sessionStorage.removeItem("protyasha_support_staff_session");
		} catch {}
		setUser(null);
		setActiveTab("home");
		setIsProfileOpen(false);
		setSelectedTransaction(null);
		setActivePortal(null);
		setIsNotificationsOpen(false);
		setIsAuditLogOpen(false);
		setIsUserManagementOpen(false);
		setIsBannerManagerOpen(false);
		setIsChannelManagerOpen(false);
		setIsRecycleBinOpen(false);
		setIsChangePinOpen(false);
		setIsFooterSettingsOpen(false);
		setIsEntryModalOpen(false);
		setReceiptTransaction(null);
		setSelectedNotificationDetail(null);
		setIsPopupNoticeManagerOpen(false);
		setPreviewPopupNotice(null);
		setIsLoginOpen(true);
		window.history.pushState({ screen: "login" }, "", window.location.pathname);
		logAction("Logout", "লগআউট", "সেশন সমাপ্ত ও সরাসরি লগইন পেইজে স্থানান্তর");
	};
	const openLoginView = () => {
		sounds.playTap();
		setIsLoginOpen(true);
		setIsProfileOpen(false);
		pushHistoryStep();
	};
	const handleAyByayAdminLogin = () => {
		setActivePortal(null);
		openLoginView();
	};
	const handleAyByayAdminLogout = () => {
		handleLogout();
	};
	const handleSaveQuickHisabOwners = (updatedOwners) => {
		const normalizedOwners = updatedOwners.map((o) => ({
			...o,
			id: String(o.id)
		}));
		const nextIds = new Set(normalizedOwners.map((o) => String(o.id)));
		const removedIds = quickHisabOwners.map((o) => String(o.id)).filter((id) => !nextIds.has(id));
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setQuickHisabOwners(normalizedOwners);
		try {
			safeStorage.setItem("protyasha_quick_hisab_owners", JSON.stringify(normalizedOwners));
		} catch {}
		normalizedOwners.forEach((o) => {
			safeSetDoc(doc(db, "quick_hisab_owners", String(o.id)), o).catch(() => {});
		});
		removedIds.forEach((id) => {
			safeDeleteDoc(doc(db, "quick_hisab_owners", id)).catch(() => {});
		});
		safeSetDoc(doc(db, "settings", "owners_meta"), {
			initialized: true,
			updatedAt: nowIso
		}).catch(() => {});
		logAction("Updated Owners", "মালিকানা তালিকা হালনাগাদ", `মোট অংশীদার: ${normalizedOwners.length}`);
	};
	const handleSaveBanners = (updated) => {
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const cleanBanners = updated.filter((b) => b && b.id && b.imageUrl).map((b, idx) => ({
			...b,
			id: String(b.id),
			isActive: b.isActive !== false,
			priority: b.priority ?? idx + 1,
			updatedAt: nowIso
		}));
		const nextIds = new Set(cleanBanners.map((b) => b.id));
		const removedIds = banners.map((b) => String(b.id)).filter((id) => !nextIds.has(id));
		setBanners(cleanBanners);
		try {
			safeStorage.setItem("protyasha_banners", JSON.stringify(cleanBanners));
		} catch (e) {
			console.error("safeStorage.setItem error:", e);
		}
		cleanBanners.forEach((b) => {
			safeSetDoc(doc(db, "banners", b.id), b).catch((e) => console.error("Firestore banner update error:", b.id, e));
		});
		removedIds.forEach((id) => {
			safeDeleteDoc(doc(db, "banners", id)).catch(() => {});
		});
		safeSetDoc(doc(db, "settings", "banners_meta"), {
			initialized: true,
			updatedAt: nowIso
		}).catch(() => {});
		logAction("Updated Banners", "বিজ্ঞাপন ব্যানার পরিবর্তন", `মোট বিজ্ঞাপন: ${cleanBanners.length}`);
	};
	const handleDeleteBanner = (bannerId) => {
		const targetId = String(bannerId);
		const updated = banners.filter((b) => String(b.id) !== targetId);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setBanners(updated);
		try {
			safeStorage.setItem("protyasha_banners", JSON.stringify(updated));
		} catch {}
		safeDeleteDoc(doc(db, "banners", targetId)).catch(() => {});
		safeSetDoc(doc(db, "settings", "banners_meta"), {
			initialized: true,
			updatedAt: nowIso
		}).catch(() => {});
		logAction("Deleted Banner", "বিজ্ঞাপন ব্যানার মুছে ফেলা হয়েছে", `ব্যানার আইডি: ${bannerId}`);
	};
	const handleSaveStaffAccounts = (updated) => {
		const cleanUpdated = JSON.parse(JSON.stringify(updated)).map((s) => sanitizeStaffForFirestore(s));
		const nextIds = new Set(cleanUpdated.map((s) => String(s.id)));
		const removedIds = staffAccounts.map((s) => String(s.id)).filter((id) => !nextIds.has(id));
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setStaffAccounts(cleanUpdated);
		broadcastStaffAccounts(cleanUpdated);
		cleanUpdated.forEach((staff) => {
			safeSetDoc(doc(staffDb, "staff", String(staff.id)), staff).catch((err) => {
				handleFirestoreError(err, OperationType.WRITE, `staff/${staff.id}`);
			});
		});
		removedIds.forEach((id) => {
			safeDeleteDoc(doc(staffDb, "staff", id)).catch((err) => {
				handleFirestoreError(err, OperationType.DELETE, `staff/${id}`);
			});
		});
		safeSetDoc(doc(db, "settings", "staff_meta"), {
			initialized: true,
			updatedAt: nowIso
		}).catch(() => {});
		logAction("Updated Staff Accounts", "স্টাফ হিসাব হালনাগাদ", `মোট স্টাফ: ${cleanUpdated.length}`);
	};
	const handleDeleteStaffAccount = (staffId) => {
		const remaining = staffAccounts.filter((s) => String(s.id) !== String(staffId));
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setStaffAccounts(remaining);
		broadcastStaffAccounts(remaining);
		safeDeleteDoc(doc(staffDb, "staff", String(staffId))).catch((err) => {
			handleFirestoreError(err, OperationType.DELETE, `staff/${staffId}`);
		});
		safeSetDoc(doc(db, "settings", "staff_meta"), {
			initialized: true,
			updatedAt: nowIso
		}).catch(() => {});
		logAction("Deleted Staff Account", "স্টাফ অ্যাকাউন্ট মোছা হয়েছে", `স্টাফ আইডি: ${staffId}`);
	};
	const handleSaveSupportTicket = async (ticket) => {
		setSupportTickets((prev) => {
			const next = prev.some((t) => t.id === ticket.id) ? prev.map((t) => t.id === ticket.id ? ticket : t) : [ticket, ...prev];
			try {
				safeStorage.setItem("protyasha_support_tickets", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeSetDoc(doc(db, "support_tickets", String(ticket.id)), ticket).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `support_tickets/${ticket.id}`);
			throw err;
		});
		logAction("Support Ticket Updated", "সাপোর্ট টিকেট হালনাগাদ", `#${ticket.ticketNumber} • ${ticket.customerName} (${ticket.status})`);
	};
	const handleDeleteSupportTicket = async (ticketId) => {
		setSupportTickets((prev) => {
			const next = prev.filter((t) => t.id !== ticketId);
			try {
				safeStorage.setItem("protyasha_support_tickets", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeDeleteDoc(doc(db, "support_tickets", String(ticketId))).catch((err) => {
			handleFirestoreError(err, OperationType.DELETE, `support_tickets/${ticketId}`);
		});
		logAction("Deleted Support Ticket", "সাপোর্ট টিকেট মোছা হয়েছে", `টিকেট আইডি: ${ticketId}`);
	};
	const handleSaveAttendance = async (record) => {
		setAttendanceRecords((prev) => {
			const next = prev.some((r) => r.id === record.id) ? prev.map((r) => r.id === record.id ? record : r) : [record, ...prev];
			try {
				safeStorage.setItem("protyasha_staff_attendance", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeSetDoc(doc(db, "staff_attendance", String(record.id)), record).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `staff_attendance/${record.id}`);
			throw err;
		});
		logAction("Staff Attendance Marked", "স্টাফ হাজিরা আপডেট", `${record.staffName} • ${record.date} (${record.status})`);
	};
	const handleSaveBulkAttendance = async (records) => {
		if (!records.length) return;
		setAttendanceRecords((prev) => {
			const map = new Map(prev.map((r) => [r.id, r]));
			records.forEach((r) => map.set(r.id, r));
			const next = Array.from(map.values());
			try {
				safeStorage.setItem("protyasha_staff_attendance", JSON.stringify(next));
			} catch {}
			return next;
		});
		await Promise.all(records.map((rec) => safeSetDoc(doc(db, "staff_attendance", String(rec.id)), rec).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `staff_attendance/${rec.id}`);
		})));
		logAction("Bulk Attendance Updated", "স্টাফ হাজিরা/ছুটি সংরক্ষণ", `${records.length}টি এন্ট্রি আপডেট করা হয়েছে`);
	};
	const handleDeleteAttendance = async (recordId) => {
		setAttendanceRecords((prev) => {
			const next = prev.filter((r) => r.id !== recordId);
			try {
				safeStorage.setItem("protyasha_staff_attendance", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeDeleteDoc(doc(db, "staff_attendance", String(recordId))).catch((err) => {
			handleFirestoreError(err, OperationType.DELETE, `staff_attendance/${recordId}`);
		});
		logAction("Deleted Attendance Record", "হাজিরা/ছুটি রেকর্ড মোছা হয়েছে", `আইডি: ${recordId}`);
	};
	const pendingUserPopupNotices = (0, import_react.useMemo)(() => {
		if (!user || isLoginOpen || user.role === "admin") return [];
		const uPhone = normalizePhoneNumber(user.phone);
		const uName = (user.name || "").trim().toLowerCase();
		const isMatchedStaffUser = user.role === "sub-admin" || user.role === "staff" || staffAccounts.some((s) => {
			if (s.isActive === false) return false;
			if (user.id && s.id === user.id) return true;
			if (uPhone.length >= 6 && normalizePhoneNumber(s.phone) === uPhone) return true;
			if (uName && (s.name || "").trim().toLowerCase() === uName) return true;
			return false;
		});
		return popupNotices.filter((n) => {
			if (!n.isActive) return false;
			if (acknowledgedPopupIds.includes(n.id)) return false;
			if (n.audience === "all") return true;
			if (n.audience === "users") return user.role === "user" || user.role === "sub-admin";
			if (n.audience === "staff") return isMatchedStaffUser;
			return false;
		});
	}, [
		user,
		isLoginOpen,
		popupNotices,
		acknowledgedPopupIds,
		staffAccounts
	]);
	const handleSavePopupNotice = async (notice, alsoSendToNotifCenter) => {
		const cleanId = String(notice.id || `popup_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 128) || `popup_${Date.now()}`;
		const cleanNotice = {
			...notice,
			id: cleanId,
			title: String(notice.title || "").trim().slice(0, 200),
			message: String(notice.message || "").trim().slice(0, 3e3),
			consentLabel: String(notice.consentLabel || "আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।").trim().slice(0, 300),
			requiresConsent: notice.requiresConsent !== false,
			isActive: notice.isActive !== false,
			createdBy: String(notice.createdBy || (user === null || user === void 0 ? void 0 : user.name) || "Admin").slice(0, 128),
			createdAt: notice.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setPopupNotices((prev) => {
			const next = prev.some((n) => n.id === cleanNotice.id) ? prev.map((n) => n.id === cleanNotice.id ? cleanNotice : n) : [cleanNotice, ...prev];
			try {
				safeStorage.setItem("protyasha_popup_notices", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeSetDoc(doc(db, "popup_notices", cleanId), cleanNotice).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `popup_notices/${cleanId}`);
			throw err;
		});
		if (alsoSendToNotifCenter) {
			const now = /* @__PURE__ */ new Date();
			const monthsBnMap = {
				Jan: "জানুয়ারি",
				Feb: "ফেব্রুয়ারি",
				Mar: "মার্চ",
				Apr: "এপ্রিল",
				May: "মে",
				Jun: "জুন",
				Jul: "জুলাই",
				Aug: "আগস্ট",
				Sep: "সেপ্টেম্বর",
				Oct: "অক্টোবর",
				Nov: "নভেম্বর",
				Dec: "ডিসেম্বর"
			};
			const monthEn = now.toLocaleString("en-US", { month: "short" });
			const timeStr = now.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true
			});
			handleSendNotification({
				titleBn: cleanNotice.title,
				titleEn: cleanNotice.title,
				bodyBn: cleanNotice.message,
				bodyEn: cleanNotice.message,
				timeBn: `${now.getDate()} ${monthsBnMap[monthEn] || monthEn}, ${timeStr}`,
				timeEn: `${monthEn} ${now.getDate()}, ${timeStr}`,
				type: cleanNotice.priority === "urgent" ? "alert" : "info",
				image: cleanNotice.imageUrl
			});
		}
		logAction("Popup Notice Published", "পপ-আপ নোটিশ প্রকাশ", cleanNotice.title);
	};
	const handleTogglePopupNoticeActive = async (notice) => {
		const updated = {
			...notice,
			isActive: !notice.isActive,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setPopupNotices((prev) => {
			const next = prev.map((n) => n.id === updated.id ? updated : n);
			try {
				safeStorage.setItem("protyasha_popup_notices", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeSetDoc(doc(db, "popup_notices", updated.id), updated).catch((err) => {
			handleFirestoreError(err, OperationType.WRITE, `popup_notices/${updated.id}`);
		});
		logAction("Popup Notice Toggled", updated.isActive ? "পপ-আপ নোটিশ সক্রিয়" : "পপ-আপ নোটিশ বিরতি", updated.title);
	};
	const handleDeletePopupNotice = async (noticeId) => {
		setPopupNotices((prev) => {
			const next = prev.filter((n) => n.id !== noticeId);
			try {
				safeStorage.setItem("protyasha_popup_notices", JSON.stringify(next));
			} catch {}
			return next;
		});
		await safeDeleteDoc(doc(db, "popup_notices", noticeId)).catch((err) => {
			handleFirestoreError(err, OperationType.DELETE, `popup_notices/${noticeId}`);
		});
		logAction("Deleted Popup Notice", "পপ-আপ নোটিশ মুছে ফেলা হয়েছে", `ID: ${noticeId}`);
	};
	const handleAcknowledgePopupNotice = async (notice) => {
		if (previewPopupNotice) {
			setPreviewPopupNotice(null);
			return;
		}
		setIsSubmittingPopupAck(true);
		try {
			const ackId = popupAckUserKey;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const ackPayload = {
				id: ackId,
				noticeId: notice.id,
				userKey: ackId,
				userName: String((user === null || user === void 0 ? void 0 : user.name) || (lang === "bn" ? "অতিথি / ভিজিটর" : "Visitor")).slice(0, 150),
				userPhone: String((user === null || user === void 0 ? void 0 : user.phone) || "").slice(0, 32),
				userRole: String((user === null || user === void 0 ? void 0 : user.role) || "visitor").slice(0, 32),
				consentText: String(notice.consentLabel || "সম্মতি দেওয়া হয়েছে").slice(0, 300),
				deviceLabel: String(getDeviceLabel() || "").slice(0, 150),
				acknowledgedAt: nowIso
			};
			const storageKey = `protyasha_popup_acks_${ackId}`;
			setAcknowledgedPopupIds((prev) => {
				const next = Array.from(/* @__PURE__ */ new Set([...prev, notice.id]));
				try {
					safeStorage.setItem(storageKey, JSON.stringify(next));
				} catch {}
				return next;
			});
			await safeSetDoc(doc(db, "popup_notices", notice.id, "acknowledgements", ackId), ackPayload).catch((err) => {
				handleFirestoreError(err, OperationType.WRITE, `popup_notices/${notice.id}/acknowledgements/${ackId}`);
			});
			sounds.playSuccess();
			showAppToast(lang === "bn" ? "সম্মতি নিশ্চিত হয়েছে" : "Consent Confirmed", notice.title, "emerald", 3500);
		} finally {
			setIsSubmittingPopupAck(false);
		}
	};
	const handlePublishQuickPopupFromNotifModal = async (data) => {
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const newNotice = {
			id: `popup_${Date.now()}`,
			title: data.title,
			message: data.message,
			priority: data.priority,
			audience: "all",
			consentLabel: "আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।",
			requiresConsent: true,
			isActive: true,
			createdBy: (user === null || user === void 0 ? void 0 : user.name) || "Admin",
			createdAt: nowIso,
			updatedAt: nowIso
		};
		await handleSavePopupNotice(newNotice, false);
	};
	const handleDeleteStaffTransaction = (staffId, txId) => {
		setStaffAccounts((prev) => {
			const updated = prev.map((staff) => {
				if (staff.id === staffId) {
					const updatedTxs = (staff.transactions || []).filter((t) => {
						const tid = String(t.id || "").trim();
						const targetId = String(txId || "").trim();
						if (tid && targetId && tid === targetId) return false;
						if (!tid && String(t.created) === targetId) return false;
						return true;
					});
					const newTotalDue = updatedTxs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
					const newTotalCollected = updatedTxs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
					const newRemaining = newTotalDue - newTotalCollected;
					const updatedStaff = {
						...staff,
						phone: staff.phone || "",
						totalDue: newTotalDue,
						totalCollected: newTotalCollected,
						remainingDue: newRemaining,
						transactions: updatedTxs
					};
					safeSetDoc(doc(staffDb, "staff", String(staffId)), updatedStaff).catch(() => {});
					return updatedStaff;
				}
				return staff;
			});
			try {
				safeStorage.setItem("protyasha_staff", JSON.stringify(updated));
			} catch {}
			return updated;
		});
	};
	const handleExitPublicTracker = () => {
		var _window$history$state5;
		if (isPublicPreviewOverlayRef.current && ((_window$history$state5 = window.history.state) === null || _window$history$state5 === void 0 ? void 0 : _window$history$state5.appOverlay)) {
			window.history.back();
			return;
		}
		isPublicPreviewOverlayRef.current = false;
		clearTrackFromCurrentUrl();
		setPublicTrackTicketId(null);
	};
	if (publicTrackTicketId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-bold text-slate-600 dark:text-slate-300",
				children: "ট্র্যাকিং তথ্য লোড হচ্ছে..."
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicTicketTracker$1, {
			ticketId: publicTrackTicketId,
			lang,
			onExitToApp: handleExitPublicTracker
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-white dark:bg-slate-900 flex flex-col w-full selection:bg-rose-500 selection:text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full bg-white dark:bg-slate-900 min-h-screen flex flex-col transition-all",
			children: [
				isLoginOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-screen flex items-center justify-center bg-white dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-9 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" })
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {
						lang,
						footerConfig,
						banners,
						adminAvatar,
						sessionNotice,
						isVisitorModeEnabled,
						visitorDisabledTitle: (_serviceStatuses$visi3 = serviceStatuses.visitorMode) === null || _serviceStatuses$visi3 === void 0 ? void 0 : _serviceStatuses$visi3.title,
						visitorDisabledMessage: (_serviceStatuses$visi4 = serviceStatuses.visitorMode) === null || _serviceStatuses$visi4 === void 0 ? void 0 : _serviceStatuses$visi4.customMessage,
						onClearSessionNotice: () => setSessionNotice(""),
						onLanguageChange: setLang,
						onLoginSuccess: handleLoginSuccess,
						onSubViewChange: (isSubView) => {
							isLoginSubViewActiveRef.current = isSubView;
						},
						onClose: () => {
							if (isLoggedInSession(user)) {
								sessionStorage.setItem("protyasha_session_active", "true");
								closeOverlayViaBack(() => setIsLoginOpen(false));
							}
						}
					})
				}) : selectedTransaction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-screen flex items-center justify-center bg-white dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-9 rounded-full border-4 border-rose-500/25 border-t-[#E52E2E] animate-spin" })
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionDetailPage, {
						transaction: selectedTransaction,
						lang,
						user,
						onBack: () => closeOverlayViaBack(() => setSelectedTransaction(null)),
						onEdit: handleStartEdit,
						onDelete: handleDeleteTransaction,
						onViewReceipt: (trx) => {
							setReceiptTransaction(trx);
							pushHistoryStep();
						},
						onOpenLogin: openLoginView
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					activeTab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 pb-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
								lang,
								user,
								adminAvatar,
								unreadCount: unreadNotificationsCount,
								weatherData,
								onOpenWeather: () => {
									sounds.playTap();
									setIsWeatherOpen(true);
									pushHistoryStep();
								},
								onOpenPrayerTimes: () => {
									sounds.playTap();
									setIsPrayerTimesOpen(true);
									pushHistoryStep();
								},
								onOpenNotifications: () => {
									sounds.playTap();
									setIsNotificationsOpen(true);
									pushHistoryStep();
								},
								onOpenProfile: () => {
									sounds.playTap();
									setActiveTab("profile");
									pushHistoryStep();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCard, {
								balance: totalBalance,
								lang
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryFeatureCards, {
								lang,
								user,
								serviceStatuses,
								onOpenBillManager: handleLaunchBillManager,
								onOpenAyByay: handleLaunchAyByay,
								onOpenQuickHisab: () => {
									if (!checkServiceAccess("quickHisab", "কুইক হিসাব ও লভ্যাংশ বণ্টন")) return;
									sounds.playTap();
									setIsQuickHisabOpen(true);
									pushHistoryStep();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoCarousel, {
								banners,
								lang,
								user,
								onExploreOffer: (banner) => {
									if (!banner) return;
									sounds.playTap();
									const link = (banner.linkUrl || "").trim();
									if (link === "#weather" || link === "action:weather") setIsWeatherOpen(true);
									else if (link === "#notifications" || link === "action:notifications") setIsNotificationsOpen(true);
									else if (link === "#home" || link === "tab:home") {
										setActiveTab("home");
										setActivePortal(null);
									} else if (link === "#transactions" || link === "tab:transactions") {
										if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
										setActiveTab("transactions");
										setActivePortal(null);
									} else if (link === "#ledger" || link === "tab:ledger") {
										if (!checkServiceAccess("ledger", "অডিট ও রিপোর্ট খাতা")) return;
										setActiveTab("ledger");
										setActivePortal(null);
									} else if (link === "#profile" || link === "tab:profile") {
										setActiveTab("profile");
										setActivePortal(null);
									} else if (link.startsWith("#portal:") || link.startsWith("portal:")) {
										const portal = link.replace(/^#?portal:/, "");
										if (portal === "bill-manager") {
											handleLaunchBillManager();
											return;
										}
										if (portal === "ay-byay") {
											handleLaunchAyByay();
											return;
										}
										if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
										setActivePortal(portal);
									} else if (link.startsWith("#category:") || link.startsWith("category:")) {
										if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
										const cat = link.replace(/^#?category:/, "");
										setSelectedMethodFilter(cat === "all" ? "" : cat);
										setActiveTab("transactions");
										setActivePortal(null);
									} else if (link === "#offer" || link === "#store" || link === "#help" || link.startsWith("action:")) {
										if ((user === null || user === void 0 ? void 0 : user.role) === "admin") setIsFooterSettingsOpen(true);
										else setIsNotificationsOpen(true);
									} else if (link.startsWith("tel:")) window.location.href = link;
									else if (link.startsWith("http")) window.open(link, "_blank");
									else {
										if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
										setActiveTab("transactions");
									}
									pushHistoryStep();
								},
								onOpenBannerManager: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsBannerManagerOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onSaveBanners: handleSaveBanners
							}),
							(user === null || user === void 0 ? void 0 : user.role) === "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-4 mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-teal-200 dark:border-teal-800/70 bg-gradient-to-r from-teal-50 via-emerald-50 to-white dark:from-teal-950/60 dark:via-emerald-950/30 dark:to-slate-900 p-3.5 shadow-sm flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-teal-800 dark:text-teal-200",
											children: lang === "bn" ? "স্টাফ হাজিরা মোড সক্রিয়" : "Staff Attendance Mode Active"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-teal-700/90 dark:text-teal-300/90 leading-snug mt-0.5",
											children: lang === "bn" ? "আপনি শুধুমাত্র স্টাফ হাজিরা ও ছুটি অপশনে প্রবেশ করে নিজের হাজিরা ও পিন পরিচালনা করতে পারবেন।" : "Your staff login grants access strictly to Staff Attendance & your own PIN settings."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											if (!checkServiceAccess("staffAttendance", "স্টাফ হাজিরা ও ছুটি")) return;
											sounds.playTap();
											setIsStaffAttendanceOpen(true);
											pushHistoryStep();
										},
										className: "shrink-0 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer",
										children: lang === "bn" ? "হাজিরা দিন" : "Attendance"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperationsHubCards, {
								lang,
								user,
								serviceStatuses,
								openTicketsCount: supportTickets.filter((t) => {
									if (t.status === "resolved") return false;
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin" || (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && hasSubAdminPermission(user, "supportTickets")) return true;
									return isSupportTicketOwner(t, user);
								}).length,
								todayPresentCount: (() => {
									const d = /* @__PURE__ */ new Date();
									const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
									return attendanceRecords.filter((r) => r.date === todayKey && (r.status === "present" || r.status === "late" || r.status === "half_day")).length;
								})(),
								totalStaffCount: staffAccounts.filter(isActualStaffAccount).length,
								onOpenSupportTickets: () => {
									if (!checkServiceAccess("supportTickets", "সাপোর্ট টিকেট ও কমপ্লেইন")) return;
									sounds.playTap();
									setIsSupportTicketsOpen(true);
									pushHistoryStep();
								},
								onOpenStaffAttendance: () => {
									if (!checkServiceAccess("staffAttendance", "স্টাফ হাজিরা ও ছুটি")) return;
									sounds.playTap();
									setIsStaffAttendanceOpen(true);
									pushHistoryStep();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickChannels, {
								transactions,
								channels,
								staffAccounts,
								lang,
								user,
								serviceStatuses,
								currentMonthIndex,
								currentYear,
								onSelectMethod: (m) => {
									if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
									setSelectedMethodFilter(m);
									setActiveTab("transactions");
									pushHistoryStep();
								},
								onOpenChannelManager: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsChannelManagerOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenIncome: (selectedMethod) => {
									if (canAddTransactions(user)) {
										if (!checkServiceAccess("ayByay", "আয়-ব্যয় হিসাব")) return;
										setEntryType("income");
										setEditingTransaction(null);
										setInitialEntryMethod(selectedMethod || "নগদ");
										setIsEntryModalOpen(true);
										pushHistoryStep();
									} else if (isLoggedInSession(user)) {
										sounds.playTap();
										showAppToast(lang === "bn" ? "রিড-অনলি মোড / অনুমতি নেই" : "Read-Only / Permission Denied", lang === "bn" ? "আপনার অ্যাকাউন্ট দিয়ে নতুন জমা বা লেনদেন যোগ করা যাবে না।" : "Your account cannot add or modify transactions.", "amber", 5e3);
									} else openLoginView();
								},
								onOpenExpense: (selectedMethod) => {
									if (canAddTransactions(user)) {
										if (!checkServiceAccess("ayByay", "আয়-ব্যয় হিসাব")) return;
										setEntryType("expense");
										setEditingTransaction(null);
										setInitialEntryMethod(selectedMethod || "নগদ");
										setIsEntryModalOpen(true);
										pushHistoryStep();
									} else if (isLoggedInSession(user)) {
										sounds.playTap();
										showAppToast(lang === "bn" ? "রিড-অনলি মোড / অনুমতি নেই" : "Read-Only / Permission Denied", lang === "bn" ? "আপনার অ্যাকাউন্ট দিয়ে নতুন খরচ বা লেনদেন যোগ করা যাবে না।" : "Your account cannot add or modify transactions.", "amber", 5e3);
									} else openLoginView();
								},
								onOpenLedger: () => {
									if (!checkServiceAccess("ledger", "অডিট ও রিপোর্ট খাতা")) return;
									setActiveTab("ledger");
									pushHistoryStep();
								},
								onOpenStaffManager: () => {
									if (!checkServiceAccess("staffManager", "স্টাফ কালেকশন ও কোম্পানি পাওনা")) return;
									setIsStaffManagerOpen(true);
									pushHistoryStep();
								}
							})
						]
					}),
					activeTab === "transactions" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 pb-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-2xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base font-bold text-slate-900 dark:text-white mx-auto",
								children: (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" ? lang === "bn" ? "আমার লেনদেন তালিকা ও স্টেটমেন্ট" : "My Transactions & Statements" : lang === "bn" ? "সকল লেনদেন ও চ্যানেল স্টেটমেন্ট" : "All Transactions & Statements"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionList, {
							transactions: transactionsForList,
							lang,
							user,
							onSelectTransaction: (trx) => {
								setSelectedTransaction(trx);
								pushHistoryStep();
							},
							onEdit: handleStartEdit,
							onDelete: handleDeleteTransaction,
							selectedMethodFilter,
							onClearMethodFilter: () => setSelectedMethodFilter(null),
							currentMonthIndex,
							currentYear,
							onPrevMonth: () => {
								if (currentMonthIndex === 0) {
									setCurrentMonthIndex(11);
									setCurrentYear((y) => y - 1);
								} else setCurrentMonthIndex((m) => m - 1);
							},
							onNextMonth: () => {
								if (currentMonthIndex === 11) {
									setCurrentMonthIndex(0);
									setCurrentYear((y) => y + 1);
								} else setCurrentMonthIndex((m) => m + 1);
							}
						})]
					}),
					activeTab === "ledger" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 w-full pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-20 flex flex-col items-center justify-center gap-2 text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-full border-3 border-rose-500/25 border-t-[#E52E2E] animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold",
									children: lang === "bn" ? "হিসাব খাতা লোড হচ্ছে..." : "Loading ledger..."
								})]
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportModal, {
								isOpen: true,
								transactions,
								channels,
								lang,
								user,
								isTabMode: true,
								currentMonthIndex,
								currentYear,
								onPrevMonth: () => {
									if (currentMonthIndex === 0) {
										setCurrentMonthIndex(11);
										setCurrentYear((y) => y - 1);
									} else setCurrentMonthIndex((m) => m - 1);
								},
								onNextMonth: () => {
									if (currentMonthIndex === 11) {
										setCurrentMonthIndex(0);
										setCurrentYear((y) => y + 1);
									} else setCurrentMonthIndex((m) => m + 1);
								},
								onClose: () => setActiveTab("home")
							})
						})
					}),
					activeTab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 w-full pb-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-20 flex flex-col items-center justify-center gap-2 text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 rounded-full border-3 border-rose-500/25 border-t-[#E52E2E] animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold",
									children: lang === "bn" ? "মেনু লোড হচ্ছে..." : "Loading menu..."
								})]
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
								user,
								lang,
								theme,
								adminAvatar,
								isTabMode: true,
								onToggleTheme: () => setTheme((prev) => prev === "light" ? "dark" : "light"),
								onLanguageChange: setLang,
								onUpdateAdminProfile: handleUpdateAdminProfile,
								onUpdateUserProfile: handleUpdateUserProfile,
								onBindMethods: handleBindMethods,
								onOpenFooterSettings: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsFooterSettingsOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenLogin: openLoginView,
								onOpenChangePin: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsChangePinOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenRecycleBin: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsRecycleBinOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenAuditLog: () => {
									setIsAuditLogOpen(true);
									pushHistoryStep();
								},
								onOpenServiceManager: () => {
									setIsServiceManagerOpen(true);
									pushHistoryStep();
								},
								onOpenPopupNoticeManager: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsPopupNoticeManagerOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenBannerManager: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsBannerManagerOpen(true);
										pushHistoryStep();
									} else {
										showToast(lang === "bn" ? "বিজ্ঞাপন নিয়ন্ত্রণ শুধুমাত্র অ্যাডমিনের জন্য" : "Admin only access", "warning");
										openLoginView();
									}
								},
								onOpenNotifications: () => {
									setIsNotificationsOpen(true);
									pushHistoryStep();
								},
								onOpenUserManagement: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsUserManagementOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onOpenDriveBackup: () => {
									if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
										setIsDriveBackupOpen(true);
										pushHistoryStep();
									} else openLoginView();
								},
								onUpdateChecked: (res) => handleUpdateCheckResult(res, false),
								onSubViewChange: (isSubView) => {
									isProfileSubViewActiveRef.current = isSubView;
								},
								onLogout: handleLogout,
								onClose: () => closeOverlayViaBack(() => setActiveTab("home"))
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
						activeTab,
						lang,
						onTabChange: (tab) => {
							if (tab === "transactions") {
								if (!checkServiceAccess("transactions", "সকল লেনদেন ও স্টেটমেন্ট")) return;
								setSelectedMethodFilter(null);
							} else if (tab === "ledger") {
								if (!checkServiceAccess("ledger", "অডিট ও রিপোর্ট খাতা")) return;
							}
							setActiveTab(tab);
							pushHistoryStep();
						}
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: null,
					children: [
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && isUserManagementOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserManagementModal, {
							isOpen: isUserManagementOpen,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsUserManagementOpen(false)),
							onSubViewChange: (isSubView) => {
								isUserMgmtSubViewActiveRef.current = isSubView;
							},
							onUserUpdated: (updatedUser) => {
								if (updatedUser.role === "admin") {
									if (updatedUser.avatarUrl) setAdminAvatar(updatedUser.avatarUrl);
									safeSetDoc(doc(db, "settings", "admin_profile"), {
										name: updatedUser.name,
										phone: updatedUser.phone,
										...updatedUser.avatarUrl ? { avatarUrl: updatedUser.avatarUrl } : {},
										updatedAt: (/* @__PURE__ */ new Date()).toISOString()
									}, { merge: true }).catch(() => {});
								}
								if (user && (user.id === updatedUser.id || user.phone === updatedUser.phone || updatedUser.role === "admin" && user.role === "admin")) setUser((prev) => {
									if (!prev) return null;
									const nextSession = {
										...prev,
										name: updatedUser.name,
										phone: updatedUser.phone,
										avatarUrl: updatedUser.avatarUrl || prev.avatarUrl,
										role: updatedUser.role,
										permissions: updatedUser.role === "sub-admin" ? updatedUser.permissions : void 0
									};
									try {
										safeStorage.setItem("protyasha_user", JSON.stringify(nextSession));
									} catch {}
									return nextSession;
								});
							}
						}),
						isDriveBackupOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriveBackupModal, {
							isOpen: isDriveBackupOpen,
							onClose: () => closeOverlayViaBack(() => setIsDriveBackupOpen(false)),
							onSubViewChange: (isSubView) => {
								isDriveBackupSubViewActiveRef.current = isSubView;
							},
							lang,
							currentUser: user,
							adminAvatar,
							onLogAction: logAction,
							onDataRestored: refreshAllData
						}),
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && isBannerManagerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerManagerModal, {
							isOpen: isBannerManagerOpen,
							banners,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsBannerManagerOpen(false)),
							onSubViewChange: (isSubView) => {
								isBannerSubViewActiveRef.current = isSubView;
							},
							onSaveBanners: handleSaveBanners,
							onDeleteBanner: handleDeleteBanner
						}),
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && isChannelManagerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelManagerModal, {
							isOpen: isChannelManagerOpen,
							channels,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsChannelManagerOpen(false)),
							onSaveChannels: (updated) => {
								const nowIso = (/* @__PURE__ */ new Date()).toISOString();
								const normalized = updated.map((ch, idx) => ({
									...ch,
									id: String(ch.id),
									order: idx + 1,
									updatedAt: nowIso
								}));
								const nextIds = new Set(normalized.map((ch) => ch.id));
								const removedIds = channels.map((ch) => String(ch.id)).filter((id) => !nextIds.has(id));
								setChannels(normalized);
								try {
									safeStorage.setItem("protyasha_channels", JSON.stringify(normalized));
								} catch (e) {
									console.warn("LocalStorage limit reached for channels:", e);
								}
								normalized.forEach((ch) => {
									safeSetDoc(doc(db, "channels", ch.id), ch).catch((err) => {
										handleFirestoreError(err, OperationType.WRITE, `channels/${ch.id}`);
									});
								});
								removedIds.forEach((id) => {
									safeDeleteDoc(doc(db, "channels", id)).catch(() => {});
								});
								safeSetDoc(doc(db, "settings", "channels_meta"), {
									initialized: true,
									updatedAt: nowIso
								}).catch(() => {});
								logAction("Updated Channels", "পেমেন্ট চ্যানেল হালনাগাদ", `মোট চ্যানেল সংখ্যা: ${normalized.length}`);
							}
						}),
						activeServiceNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceNoticeModal, {
							isOpen: !!activeServiceNotice,
							serviceName: activeServiceNotice.name,
							customTitle: activeServiceNotice.title,
							customMessage: activeServiceNotice.message,
							logoUrl: activeServiceNotice.logoUrl,
							lang,
							onClose: () => closeOverlayViaBack(() => setActiveServiceNotice(null))
						}),
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && isServiceManagerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceManagerModal, {
							isOpen: isServiceManagerOpen,
							serviceStatuses,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsServiceManagerOpen(false)),
							onSaveServiceStatuses: (updated) => {
								handleSaveServiceStatuses(updated);
								logAction("Updated Services", "সেবা স্ট্যাটাস পরিবর্তন", "সেবা সক্রিয়/নিষ্ক্রিয় ও নোটিশ আপডেট");
							}
						}),
						isStaffManagerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffManagerModal, {
							isOpen: isStaffManagerOpen,
							staffAccounts,
							quickHisabOwners,
							lang,
							user,
							onClose: () => closeOverlayViaBack(() => setIsStaffManagerOpen(false)),
							onSubViewChange: (isSubView) => {
								isStaffManagerSubViewActiveRef.current = isSubView;
							},
							onSaveStaffAccounts: handleSaveStaffAccounts,
							onDeleteStaffAccount: handleDeleteStaffAccount,
							onDeleteStaffTransaction: handleDeleteStaffTransaction,
							onLogAction: logAction
						}),
						isSupportTicketsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportTicketModal, {
							isOpen: isSupportTicketsOpen,
							tickets: supportTickets,
							staffAccounts,
							lang,
							user,
							onClose: () => closeOverlayViaBack(() => setIsSupportTicketsOpen(false)),
							onSubViewChange: (isSubView) => {
								isSupportSubViewActiveRef.current = isSubView;
							},
							onSaveTicket: handleSaveSupportTicket,
							onDeleteTicket: handleDeleteSupportTicket,
							onLogAction: logAction,
							onPreviewPublicLink: (ticketId) => {
								isPublicPreviewOverlayRef.current = true;
								setPublicTrackTicketId(ticketId);
								pushHistoryStep();
							}
						}),
						isStaffAttendanceOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffAttendanceModal, {
							isOpen: isStaffAttendanceOpen,
							staffAccounts,
							attendanceRecords,
							lang,
							user,
							onClose: () => closeOverlayViaBack(() => setIsStaffAttendanceOpen(false)),
							onSubViewChange: (isSubView) => {
								isAttendanceSubViewActiveRef.current = isSubView;
							},
							onSaveAttendance: handleSaveAttendance,
							onSaveBulkAttendance: handleSaveBulkAttendance,
							onDeleteAttendance: handleDeleteAttendance,
							onLogAction: logAction
						}),
						receiptTransaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
							transaction: receiptTransaction,
							lang,
							onClose: () => closeOverlayViaBack(() => setReceiptTransaction(null))
						}),
						isEntryModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryModal, {
							isOpen: isEntryModalOpen,
							type: entryType,
							initialMethod: initialEntryMethod,
							editingTransaction,
							existingCustomers,
							channels,
							lang,
							onClose: () => closeOverlayViaBack(() => {
								setIsEntryModalOpen(false);
								setEditingTransaction(null);
							}),
							onSave: handleSaveEntry
						}),
						isNotificationsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsModal, {
							isOpen: isNotificationsOpen,
							notifications: userNotifications,
							lang,
							user,
							onClose: () => closeOverlayViaBack(() => {
								setIsNotificationsOpen(false);
								setEditingNotification(null);
							}),
							onSelectNotification: (notif) => {
								handleMarkNotificationAsRead(notif.id);
								setSelectedNotificationDetail(notif);
								pushHistoryStep();
							},
							onMarkAllAsRead: handleMarkAllAsRead,
							onSendNotification: handleSendNotification,
							onEditNotification: (notif) => {
								const updatedNotifications = notifications.map((n) => n.id === notif.id ? notif : n);
								setNotifications(updatedNotifications);
								saveNotificationsToCloud(updatedNotifications);
								setEditingNotification(null);
							},
							onPublishPopupNotice: (user === null || user === void 0 ? void 0 : user.role) === "admin" ? handlePublishQuickPopupFromNotifModal : void 0,
							initialEditingNotif: editingNotification
						}),
						selectedNotificationDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationDetailModal, {
							notification: selectedNotificationDetail,
							lang,
							user,
							onClose: () => closeOverlayViaBack(() => setSelectedNotificationDetail(null)),
							onDelete: handleDeleteNotification,
							onMarkAsRead: handleMarkNotificationAsRead,
							onOpenWeather: () => {
								sounds.playTap();
								setIsWeatherOpen(true);
								pushHistoryStep();
							},
							onOpenPrayerTimes: () => {
								sounds.playTap();
								setPrayerInitialView("daily");
								setIsPrayerTimesOpen(true);
								pushHistoryStep();
							},
							onOpenRamadanSchedule: () => {
								sounds.playTap();
								setPrayerInitialView("ramadan");
								setIsPrayerTimesOpen(true);
								pushHistoryStep();
							},
							onEdit: (notif) => {
								setSelectedNotificationDetail(null);
								setEditingNotification(notif);
								setIsNotificationsOpen(true);
								pushHistoryStep();
							}
						}),
						isProfileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileView, {
							user,
							lang,
							theme,
							adminAvatar,
							onToggleTheme: () => setTheme((prev) => prev === "light" ? "dark" : "light"),
							onLanguageChange: setLang,
							onUpdateAdminProfile: handleUpdateAdminProfile,
							onUpdateUserProfile: handleUpdateUserProfile,
							onBindMethods: handleBindMethods,
							onOpenLogin: openLoginView,
							onOpenChangePin: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsChangePinOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onOpenRecycleBin: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsRecycleBinOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onOpenAuditLog: () => {
								setIsAuditLogOpen(true);
								pushHistoryStep();
							},
							onOpenBannerManager: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsBannerManagerOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onOpenFooterSettings: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsFooterSettingsOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onOpenNotifications: () => {
								setIsNotificationsOpen(true);
								pushHistoryStep();
							},
							onOpenUserManagement: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsUserManagementOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onOpenServiceManager: () => {
								setIsServiceManagerOpen(true);
								pushHistoryStep();
							},
							onOpenPopupNoticeManager: () => {
								if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
									setIsPopupNoticeManagerOpen(true);
									pushHistoryStep();
								} else openLoginView();
							},
							onUpdateChecked: (res) => handleUpdateCheckResult(res, false),
							onSubViewChange: (isSubView) => {
								isProfileSubViewActiveRef.current = isSubView;
							},
							onLogout: handleLogout,
							onClose: () => closeOverlayViaBack(() => setIsProfileOpen(false))
						}),
						isRecycleBinOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecycleBinModal, {
							isOpen: isRecycleBinOpen,
							transactions,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsRecycleBinOpen(false)),
							onRestore: handleRestore,
							onPermanentDelete: handlePermanentDelete,
							onEmptyTrash: handleEmptyTrash
						}),
						isAuditLogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditLogModal, {
							isOpen: isAuditLogOpen,
							logs: auditLogs,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsAuditLogOpen(false))
						}),
						isFooterSettingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterSettingsModal, {
							isOpen: isFooterSettingsOpen,
							config: footerConfig,
							banners,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsFooterSettingsOpen(false)),
							onSave: (newCfg) => {
								setFooterConfig(newCfg);
								safeStorage.setItem("protyasha_footer", JSON.stringify(newCfg));
								safeSetDoc(doc(db, "settings", "footer_config"), {
									config: newCfg,
									updatedAt: (/* @__PURE__ */ new Date()).toISOString()
								}).catch(() => {});
							},
							onSaveBanners: (newBanners) => {
								handleSaveBanners(newBanners);
							}
						}),
						isChangePinOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePinModal, {
							isOpen: isChangePinOpen,
							lang,
							onClose: () => closeOverlayViaBack(() => setIsChangePinOpen(false)),
							onPinChanged: (newPin) => {
								safeStorage.setItem("protyasha_admin_pin", newPin);
								safeSetDoc(doc(db, "settings", "admin_security"), {
									pin: newPin,
									updatedAt: (/* @__PURE__ */ new Date()).toISOString()
								}).catch(() => {});
								logAction("Changed PIN", "পিন পরিবর্তন", "Security PIN successfully updated");
							}
						}),
						isWeatherOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherModal, {
							isOpen: isWeatherOpen,
							lang,
							isAdmin: (user === null || user === void 0 ? void 0 : user.role) === "admin",
							onClose: () => closeOverlayViaBack(() => setIsWeatherOpen(false)),
							onSubViewChange: (isSubView) => {
								isWeatherSubViewActiveRef.current = isSubView;
							},
							onSendWeatherNotification: (notif) => {
								handleSendNotification(notif);
							},
							onLocationChanged: () => {
								__vitePreload(async () => {
									const { getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation } = await import("./chunk-weatherService.js").then((n) => n.l);
									return {
										getUserPreferredDistrict,
										fetchLiveWeather,
										detectPreciseLocation
									};
								}, __vite__mapDeps([0,1,2,3]), import.meta.url).then(({ getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation }) => {
									const preferred = getUserPreferredDistrict();
									if (preferred) {
										setCurrentDistrict(preferred);
										fetchLiveWeather(true).then((w) => {
											if (w) setWeatherData(w);
										});
									} else detectPreciseLocation().then(({ district }) => {
										if (district) setCurrentDistrict(district);
										fetchLiveWeather(true).then((w) => {
											if (w) setWeatherData(w);
										});
									});
								}).catch(() => {});
							}
						}),
						isPrayerTimesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerTimesModal, {
							isOpen: isPrayerTimesOpen,
							lang,
							isAdmin: (user === null || user === void 0 ? void 0 : user.role) === "admin",
							initialViewMode: prayerInitialView,
							onClose: () => closeOverlayViaBack(() => {
								setIsPrayerTimesOpen(false);
								setPrayerInitialView("daily");
							}),
							onSendNotification: (notif) => {
								handleSendNotification(notif);
							},
							onPushLocalNotification: handlePushLocalNotification,
							onLocationChanged: () => {
								__vitePreload(async () => {
									const { getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation } = await import("./chunk-weatherService.js").then((n) => n.l);
									return {
										getUserPreferredDistrict,
										fetchLiveWeather,
										detectPreciseLocation
									};
								}, __vite__mapDeps([0,1,2,3]), import.meta.url).then(({ getUserPreferredDistrict, fetchLiveWeather, detectPreciseLocation }) => {
									const preferred = getUserPreferredDistrict();
									if (preferred) {
										setCurrentDistrict(preferred);
										fetchLiveWeather(true).then((w) => {
											if (w) setWeatherData(w);
										});
									} else detectPreciseLocation().then(({ district }) => {
										if (district) setCurrentDistrict(district);
										fetchLiveWeather(true).then((w) => {
											if (w) setWeatherData(w);
										});
									});
								}).catch(() => {});
							},
							onSubViewActiveChange: (isSubView) => {
								isPrayerSubViewActiveRef.current = isSubView;
							}
						}),
						isQuickHisabOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickHisabModal, {
							isOpen: isQuickHisabOpen,
							lang,
							user,
							staffAccounts,
							onSaveStaffAccounts: handleSaveStaffAccounts,
							quickHisabOwners,
							onSaveOwners: handleSaveQuickHisabOwners,
							onClose: () => closeOverlayViaBack(() => setIsQuickHisabOpen(false)),
							onSubViewChange: (isSubView) => {
								isQuickHisabSubViewActiveRef.current = isSubView;
							}
						}),
						(user === null || user === void 0 ? void 0 : user.role) === "admin" && isPopupNoticeManagerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPopupNoticeModal, {
							isOpen: isPopupNoticeManagerOpen,
							notices: popupNotices,
							acknowledgementsByNotice: popupAcksByNotice,
							lang,
							currentAdminName: (user === null || user === void 0 ? void 0 : user.name) || "Admin",
							onClose: () => closeOverlayViaBack(() => setIsPopupNoticeManagerOpen(false)),
							onSaveNotice: handleSavePopupNotice,
							onToggleNoticeActive: handleTogglePopupNoticeActive,
							onDeleteNotice: handleDeletePopupNotice,
							onPreviewNotice: (notice) => {
								setPreviewPopupNotice(notice);
								pushHistoryStep();
							},
							onSubViewChange: (hasSubView) => {
								isPopupManagerSubViewActiveRef.current = hasSubView;
							}
						}),
						!isLoginOpen && (previewPopupNotice || pendingUserPopupNotices.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPopupNoticeModal, {
							notice: previewPopupNotice || pendingUserPopupNotices[0],
							queueIndex: 1,
							queueTotal: previewPopupNotice ? 1 : pendingUserPopupNotices.length,
							isPreviewMode: Boolean(previewPopupNotice),
							isSubmitting: isSubmittingPopupAck,
							lang,
							onAcknowledge: handleAcknowledgePopupNotice,
							onClosePreview: () => closeOverlayViaBack(() => setPreviewPopupNotice(null))
						})
					]
				}),
				isLaunchingAyByay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-[150] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 select-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center text-center max-w-xs animate-in zoom-in-90 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mb-5 flex items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-36 h-36 rounded-3xl bg-gradient-to-tr from-emerald-500/40 via-teal-500/30 to-indigo-500/40 blur-2xl animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-28 h-28 rounded-3xl border-2 border-emerald-400/50 animate-ping opacity-60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative w-24 h-24 rounded-3xl bg-white shadow-2xl p-2.5 border-2 border-emerald-400 flex items-center justify-center overflow-hidden transform animate-bounce",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ((_serviceStatuses$ayBy4 = serviceStatuses.ayByay) === null || _serviceStatuses$ayBy4 === void 0 ? void 0 : _serviceStatuses$ayBy4.logoUrl) || "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png",
											alt: "আয়-ব্যয় লোগো",
											className: "w-full h-full object-contain"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-2xl font-black tracking-tight text-white mb-1 drop-shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "আয়"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-300",
										children: "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-400",
										children: "ব্যয়"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white ml-2 text-lg font-bold",
										children: "হিসাব খাতা"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300 font-medium mb-4",
								children: "স্মার্ট ব্যবস্থাপনা ও দৈনন্দিন খতিয়ান"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-48 h-2 rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full animate-pulse w-full" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-emerald-400 font-semibold mt-2.5 animate-pulse flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." })]
							})
						]
					})
				}),
				isLaunchingBillManager && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 select-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center text-center max-w-xs animate-in zoom-in-90 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mb-5 flex items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-36 h-36 rounded-3xl bg-gradient-to-tr from-orange-500/40 via-amber-500/30 to-rose-500/40 blur-2xl animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-28 h-28 rounded-3xl border-2 border-orange-400/50 animate-ping opacity-60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative w-24 h-24 rounded-3xl bg-white shadow-2xl p-2.5 border-2 border-orange-400 flex items-center justify-center overflow-hidden transform animate-bounce",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: ((_serviceStatuses$bill4 = serviceStatuses.billManager) === null || _serviceStatuses$bill4 === void 0 ? void 0 : _serviceStatuses$bill4.logoUrl) && !serviceStatuses.billManager.logoUrl.includes("bill-manager.ai.studio") ? serviceStatuses.billManager.logoUrl : window.__PCN_ASSET_BASE__ ? `${window.__PCN_ASSET_BASE__}bill-manager-logo.jpg` : "./bill-manager-logo.jpg",
											alt: "বিল ম্যানেজার প্রো লগো",
											className: "w-full h-full object-contain rounded-2xl"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-2xl font-black tracking-tight text-white mb-1 drop-shadow-md flex items-center gap-2 justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-orange-400",
									children: "বিল ম্যানেজমেন্ট"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase",
									children: "প্রো"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300 font-medium mb-4",
								children: "স্মার্ট বিলিং ও কাস্টমার ড্যাশবোর্ড"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-48 h-2 rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 rounded-full animate-pulse w-full" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-orange-400 font-semibold mt-2.5 animate-pulse flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ড্যাশবোর্ড লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." })]
							})
						]
					})
				}),
				activePortal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-[60] bg-[#f0f4fa] dark:bg-slate-950 overflow-y-auto select-none animate-in fade-in duration-150",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-slate-600 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full border-4 border-rose-500/30 border-t-rose-600 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold",
								children: "পোর্টাল লোড হচ্ছে..."
							})]
						}),
						children: activePortal === "ay-byay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AyByayPortal, {
							onExit: () => closeOverlayViaBack(() => setActivePortal(null)),
							staffAccounts,
							onSaveStaffAccounts: handleSaveStaffAccounts,
							quickHisabOwners,
							onOpenDriveBackup: () => {
								setIsDriveBackupOpen(true);
								pushHistoryStep();
							},
							currentUser: user,
							onAdminLogin: handleAyByayAdminLogin,
							onAdminLogout: handleAyByayAdminLogout
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillManagerPortal, { onExit: () => closeOverlayViaBack(() => setActivePortal(null)) })
					})
				}),
				deleteTrx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-8 h-8 text-rose-600" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
								children: lang === "bn" ? "মুছে ফেলতে চান?" : "Confirm Delete?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-slate-600 dark:text-slate-400 mb-6",
								children: lang === "bn" ? "এই লেনদেনটি রিসাইকেল বিনে স্থানান্তর করা হবে।" : "This transaction will be moved to the recycle bin."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => closeOverlayViaBack(() => setDeleteTrx(null)),
									className: "flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold",
									children: lang === "bn" ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: confirmDelete,
									className: "flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold",
									children: lang === "bn" ? "ঠিক আছে" : "OK"
								})]
							})
						]
					})
				}),
				appToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `fixed top-16 left-1/2 -translate-x-1/2 z-[160] w-[92%] max-w-md rounded-2xl p-3.5 shadow-2xl border flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 ${appToast.tone === "amber" ? "bg-amber-950/95 border-amber-500/60 text-amber-50" : "bg-emerald-950/95 border-emerald-500/60 text-emerald-50"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-black leading-snug",
							children: appToast.title
						}), appToast.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] opacity-90 leading-snug line-clamp-2",
							children: appToast.body
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setAppToast(null),
						className: "text-xs font-bold px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 shrink-0 cursor-pointer",
						children: "✕"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/main.tsx
var loadPublicTicketTracker = () => __vitePreload(() => import("./chunk-PublicTicketTracker.js").then((m) => ({ default: m.PublicTicketTracker })), __vite__mapDeps([42,1,5,6,7,2]), import.meta.url);
var PublicTicketTracker = import_react.lazy(loadPublicTicketTracker);
if (typeof window !== "undefined") window.addEventListener("vite:preloadError", (event) => {
	try {
		const retryKey = "protyasha_chunk_reload_at";
		const last = Number(sessionStorage.getItem(retryKey) || "0");
		if (Date.now() - last > 15e3) {
			sessionStorage.setItem(retryKey, String(Date.now()));
			event.preventDefault();
			window.location.reload();
		}
	} catch {}
});
var ErrorBoundary = class extends import_react.Component {
	constructor(..._args) {
		super(..._args);
		this.state = {
			hasError: false,
			error: null
		};
		this.handleReset = () => {
			try {
				localStorage.clear();
				sessionStorage.clear();
			} catch {}
			window.location.reload();
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("[React ErrorBoundary Caught Error]:", error, errorInfo);
		document.body.classList.add("app-ready");
	}
	render() {
		if (this.state.hasError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#f8fafc",
				padding: "24px",
				fontFamily: "system-ui, -apple-system, sans-serif"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					backgroundColor: "#ffffff",
					borderRadius: "24px",
					padding: "32px",
					maxWidth: "480px",
					width: "100%",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
					border: "1px solid #e2e8f0",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: "64px",
							height: "64px",
							backgroundColor: "#fee2e2",
							borderRadius: "20px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 20px auto",
							color: "#dc2626",
							fontSize: "28px"
						},
						children: "⚠️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: "20px",
							fontWeight: "bold",
							color: "#0f172a",
							marginBottom: "12px"
						},
						children: "সিস্টেম চালু করতে সমস্যা হয়েছে"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							fontSize: "14px",
							color: "#64748b",
							lineHeight: "1.6",
							marginBottom: "20px"
						},
						children: "অ্যাপটি লোড করার সময় সাময়িক একটি ত্রুটি ঘটেছে। নিচের বোতামে ক্লিক করে আবার চেষ্টা করুন।"
					}),
					this.state.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							backgroundColor: "#f1f5f9",
							borderRadius: "12px",
							padding: "12px",
							fontSize: "12px",
							color: "#334155",
							textAlign: "left",
							marginBottom: "24px",
							overflowX: "auto",
							fontFamily: "monospace"
						},
						children: this.state.error.message || String(this.state.error)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "12px",
							justifyContent: "center"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => window.location.reload(),
							style: {
								backgroundColor: "#e52e2e",
								color: "#ffffff",
								border: "none",
								padding: "12px 24px",
								borderRadius: "14px",
								fontWeight: "bold",
								fontSize: "14px",
								cursor: "pointer"
							},
							children: "পুনরায় চেষ্টা করুন"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: this.handleReset,
							style: {
								backgroundColor: "#f1f5f9",
								color: "#475569",
								border: "1px solid #cbd5e1",
								padding: "12px 20px",
								borderRadius: "14px",
								fontWeight: "bold",
								fontSize: "14px",
								cursor: "pointer"
							},
							children: "ক্যাশ রিমুভ ও রিলোড"
						})]
					})
				]
			})
		});
		return this.props.children;
	}
};
var RootRouter = () => {
	const [standaloneTrackId, setStandaloneTrackId] = (0, import_react.useState)(() => extractTrackTicketIdFromLocation());
	(0, import_react.useEffect)(() => {
		const syncFromUrl = () => {
			const nextId = extractTrackTicketIdFromLocation();
			if (nextId) setStandaloneTrackId(nextId);
		};
		window.addEventListener("hashchange", syncFromUrl);
		window.addEventListener("popstate", syncFromUrl);
		return () => {
			window.removeEventListener("hashchange", syncFromUrl);
			window.removeEventListener("popstate", syncFromUrl);
		};
	}, []);
	if (standaloneTrackId) {
		const savedLang = safeStorage.getItem("protyasha_lang") || "bn";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicTicketTracker, {
				ticketId: standaloneTrackId,
				lang: savedLang,
				onExitToApp: () => {
					clearTrackFromCurrentUrl();
					setStandaloneTrackId(null);
				}
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {})
	});
};
var container = document.getElementById("root");
if (container) (0, import_client.createRoot)(container).render(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ErrorBoundary, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootRouter, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalFeedbackHost, {})] }));
//#endregion
export { getTicketRoleLabel as $, formatRemainingCountdown as A, savePersistentImage as B, getStoredUsers as C, SUPPORT_TICKET_EDIT_WINDOW_MS as D, getChannelGradient as E, normalizePhoneNumber as F, CATEGORY_LABELS as G, initialTransactions as H, __vitePreload as I, TicketActivityTimeline as J, PublicTrackingShareCard as K, compressImageFile as L, isSubAdmin as M, isSupportTicketOwner as N, canModifySupportTicket as O, isTransactionOwner as P, formatTicketDateTime as Q, deletePersistentImage as R, findStoredUserByPhone as S, SmartChannelIcon as T, showConfirm as U, initialQuickHisabOwners as V, showToast as W, buildPublicTrackingUrl as X, TicketProgressStepper as Y, copyTextSafely as Z, isNonStaffRoleAccount as _, subscribeActiveDeviceSessions as a, handleFirestoreError as at, recordOwnerDividendDeduction as b, findMatchedStaffForUser as c, staffDb as ct, syncStaffOrSubAdminUserToDirectory as d, getTicketStatusLabel as et, syncStaffPinEverywhere as f, isActualStaffAccount as g, doesOwnerMatchAccount as h, getSessionAccountKey as i, db as it, hasSubAdminPermission as j, canModifyTransaction as k, readCachedStaffAccounts as l, computeOwnersDividendLedger as m, claimDeviceSession as n, OperationType as nt, broadcastStaffAccounts as o, safeDeleteDoc as ot, upsertSingleStaffToCloud as p, TICKET_STAGES as q, getDeviceLabel as r, auth as rt, deleteSingleStaffFromCloud as s, safeSetDoc as st, adminForceReleaseSession as t, sounds as tt, sanitizeStaffForFirestore as u, isOwnerRoleAccount as v, saveStoredUser as w, deleteStoredUser as x, normalizePersonName as y, getPersistentImage as z };
