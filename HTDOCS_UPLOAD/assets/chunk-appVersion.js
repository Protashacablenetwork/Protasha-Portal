import { s as getDocFromServer, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { it as db } from "./app.js";
//#region src/utils/appVersion.ts
var CURRENT_APP_VERSION = "2.6.4";
var LAST_ACK_VERSION_KEY = "protyasha_last_ack_app_version";
var LAST_CHECKED_AT_KEY = "protyasha_last_update_checked_at";
var CURRENT_RELEASE_INFO = {
	version: CURRENT_APP_VERSION,
	buildNumber: 264,
	releaseDate: "2026-11-21",
	titleBn: "নেটিভ বিল ম্যানেজার প্রো ও স্মার্ট ব্যাক-বাটন আপডেট",
	titleEn: "Native Bill Manager Pro & Hardware Back-Button Update",
	featuresBn: [
		"মূল অ্যাপের ভেতরেই সম্পূর্ণ নেটিভ বিল ম্যানেজার প্রো পোর্টাল সংযুক্ত (কোনো এক্সটার্নাল আইফ্রেম ছাড়াই)",
		"ডিভাইসের অরজিনাল ব্যাক বাটন দিয়ে মডাল, মেনু ও টেবিল থেকে ধাপে ধাপে হোমে ফেরার সুবিধা",
		"অফলাইন ক্যাশ, এরিয়া ফিল্টার, ডুপ্লিকেট চেক, তাগাদা এসএমএস ও সিঙ্গেল-পেজ মানি রসিদ প্রিন্ট",
		"স্টাফ ও মালিক পদবি ভিত্তিক হিসাব সংরক্ষণ এবং এডমিন ইন-অ্যাপ আপডেট সিস্টেম"
	],
	featuresEn: [
		"Native in-app Bill Manager Pro dashboard integrated directly without external iframe delays",
		"Full device hardware & browser Back button LIFO navigation across modals, drawers, and views",
		"Offline caching, area filters, duplicate entry detector, due SMS & single-page receipt print",
		"Staff role dropdown separation and admin in-app version broadcast tools"
	]
};
/**
* Compares two semver strings (e.g. "2.5.1" vs "2.5.0").
* Returns 1 if a > b, -1 if a < b, 0 if equal.
*/
function compareSemver(a, b) {
	const pa = String(a || "0.0.0").replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
	const pb = String(b || "0.0.0").replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
	const len = Math.max(pa.length, pb.length, 3);
	for (let i = 0; i < len; i++) {
		const na = pa[i] || 0;
		const nb = pb[i] || 0;
		if (na > nb) return 1;
		if (na < nb) return -1;
	}
	return 0;
}
function normalizeVersionInfo(raw) {
	if (!raw || typeof raw !== "object") return null;
	const version = typeof raw.version === "string" && raw.version.trim() ? raw.version.trim() : "";
	if (!version) return null;
	return {
		version,
		buildNumber: Number(raw.buildNumber) || 0,
		releaseDate: typeof raw.releaseDate === "string" ? raw.releaseDate : CURRENT_RELEASE_INFO.releaseDate,
		titleBn: typeof raw.titleBn === "string" && raw.titleBn ? raw.titleBn : CURRENT_RELEASE_INFO.titleBn,
		titleEn: typeof raw.titleEn === "string" && raw.titleEn ? raw.titleEn : CURRENT_RELEASE_INFO.titleEn,
		featuresBn: Array.isArray(raw.featuresBn) ? raw.featuresBn.filter((x) => typeof x === "string") : [],
		featuresEn: Array.isArray(raw.featuresEn) ? raw.featuresEn.filter((x) => typeof x === "string") : []
	};
}
async function fetchServerManifest() {
	const ts = Date.now();
	const assetBase = typeof window !== "undefined" ? window.__PCN_ASSET_BASE__ : "";
	const candidates = [
		...assetBase ? [`${assetBase}version.json?t=${ts}`] : [],
		`./version.json?t=${ts}`,
		`./public/version.json?t=${ts}`,
		`./HTDOCS_UPLOAD/version.json?t=${ts}`,
		`/version.json?t=${ts}`,
		`/api/app-version?t=${ts}`
	];
	for (const url of candidates) try {
		const res = await fetch(url, {
			method: "GET",
			cache: "no-store",
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache"
			}
		});
		if (!res.ok) continue;
		if (!(res.headers.get("content-type") || "").includes("application/json")) continue;
		const normalized = normalizeVersionInfo(await res.json());
		if (normalized) return normalized;
	} catch {}
	return null;
}
async function fetchCloudReleaseInfo() {
	if (typeof navigator !== "undefined" && navigator.onLine === false) return null;
	if (safeStorage.getItem("protyasha_offline_mode") === "true") return null;
	try {
		const snap = await getDocFromServer(doc(db, "settings", "app_version"));
		if (snap.exists()) return normalizeVersionInfo(snap.data());
	} catch {}
	return null;
}
async function checkServiceWorkerUpdate() {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
	try {
		const regs = await navigator.serviceWorker.getRegistrations();
		for (const reg of regs) {
			await reg.update().catch(() => {});
			if (reg.waiting || reg.installing) return true;
		}
	} catch {}
	return false;
}
/**
* Checks whether the client is running the latest version and inspects new features
* from both the server manifest (/api/app-version, /version.json) and Cloud Firestore.
*/
async function checkForAppUpdates() {
	const checkedAt = Date.now();
	if (typeof navigator !== "undefined" && navigator.onLine === false || safeStorage.getItem("protyasha_offline_mode") === "true") return {
		status: "offline",
		currentVersion: CURRENT_APP_VERSION,
		latestVersion: CURRENT_APP_VERSION,
		currentBuildNumber: 264,
		latestBuildNumber: 264,
		hasNewFeatures: false,
		releaseInfo: CURRENT_RELEASE_INFO,
		checkedAt
	};
	const [serverInfo, cloudInfo, swUpdateReady] = await Promise.all([
		fetchServerManifest(),
		fetchCloudReleaseInfo(),
		checkServiceWorkerUpdate()
	]);
	let bestInfo = CURRENT_RELEASE_INFO;
	for (const candidate of [serverInfo, cloudInfo]) {
		if (!candidate) continue;
		const cmp = compareSemver(candidate.version, bestInfo.version);
		if (cmp > 0 || cmp === 0 && candidate.buildNumber > bestInfo.buildNumber) bestInfo = {
			...bestInfo,
			...candidate,
			featuresBn: candidate.featuresBn.length > 0 ? candidate.featuresBn : bestInfo.featuresBn,
			featuresEn: candidate.featuresEn.length > 0 ? candidate.featuresEn : bestInfo.featuresEn
		};
		else if (cmp === 0 && candidate.featuresBn.length > bestInfo.featuresBn.length) bestInfo = {
			...bestInfo,
			featuresBn: candidate.featuresBn,
			featuresEn: candidate.featuresEn.length > 0 ? candidate.featuresEn : bestInfo.featuresEn
		};
	}
	const semverNewer = compareSemver(bestInfo.version, CURRENT_APP_VERSION) > 0;
	const buildNewer = compareSemver(bestInfo.version, "2.6.4") === 0 && bestInfo.buildNumber > 264;
	const isUpdateAvailable = semverNewer || buildNewer || swUpdateReady;
	const lastAck = safeStorage.getItem(LAST_ACK_VERSION_KEY);
	const hasUnseenFeatures = isUpdateAvailable || bestInfo.featuresBn.length > 0 && lastAck !== `${bestInfo.version}_${bestInfo.buildNumber}`;
	safeStorage.setItem(LAST_CHECKED_AT_KEY, String(checkedAt));
	return {
		status: isUpdateAvailable ? "update_available" : "up_to_date",
		currentVersion: CURRENT_APP_VERSION,
		latestVersion: bestInfo.version,
		currentBuildNumber: 264,
		latestBuildNumber: bestInfo.buildNumber,
		hasNewFeatures: hasUnseenFeatures,
		releaseInfo: bestInfo,
		checkedAt,
		swUpdateReady
	};
}
function markVersionFeaturesAcknowledged(info) {
	safeStorage.setItem(LAST_ACK_VERSION_KEY, `${info.version}_${info.buildNumber}`);
}
function buildUpdateNotificationItem(result) {
	const { releaseInfo, status, latestVersion } = result;
	const now = /* @__PURE__ */ new Date();
	const timeBn = now.toLocaleTimeString("bn-BD", {
		hour: "2-digit",
		minute: "2-digit"
	});
	const timeEn = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit"
	});
	const featuresListBn = (releaseInfo.featuresBn.length > 0 ? releaseInfo.featuresBn : CURRENT_RELEASE_INFO.featuresBn).map((f, idx) => `${idx + 1}. ${f}`).join("\n");
	const featuresListEn = (releaseInfo.featuresEn.length > 0 ? releaseInfo.featuresEn : CURRENT_RELEASE_INFO.featuresEn).map((f, idx) => `${idx + 1}. ${f}`).join("\n");
	const isNew = status === "update_available";
	return {
		id: `notif_app_update_v${latestVersion}_b${result.latestBuildNumber}`,
		titleBn: isNew ? `নতুন অ্যাপ আপডেট পাওয়া গেছে (v${latestVersion})` : `নতুন ফিচার যুক্ত হয়েছে (v${latestVersion})`,
		titleEn: isNew ? `New App Update Available (v${latestVersion})` : `New Features Added (v${latestVersion})`,
		bodyBn: `${releaseInfo.titleBn}\n${featuresListBn}`,
		bodyEn: `${releaseInfo.titleEn}\n${featuresListEn}`,
		date: now.toISOString().split("T")[0],
		timeBn,
		timeEn,
		type: "info",
		isGlobal: true
	};
}
async function applyAppUpdateAndReload() {
	try {
		if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
			const regs = await navigator.serviceWorker.getRegistrations();
			for (const reg of regs) {
				if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
				await reg.unregister().catch(() => {});
			}
		}
		if (typeof window !== "undefined" && "caches" in window) {
			const keys = await window.caches.keys();
			await Promise.all(keys.map((k) => window.caches.delete(k).catch(() => {})));
		}
	} catch {}
	if (typeof window !== "undefined") window.location.reload();
}
//#endregion
export { CURRENT_APP_VERSION, applyAppUpdateAndReload, buildUpdateNotificationItem, checkForAppUpdates, markVersionFeaturesAcknowledged };
