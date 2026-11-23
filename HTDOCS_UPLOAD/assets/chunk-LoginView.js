import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { Ct as Headphones, E as Store, En as require_react, Ft as EyeOff, M as ShieldCheck, Pt as Eye, S as Tag, Y as Phone, Yt as Clock, Zt as CircleCheck, d as Users, dt as Lock, f as User, k as Smartphone, kt as Fingerprint, ln as Camera, n as X, p as UserPlus, st as MapPin, ut as LogIn } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, g as where, o as getDoc, p as query, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { o as translations } from "./chunk-formatters.js";
import { F as normalizePhoneNumber, S as findStoredUserByPhone, ct as staffDb, it as db, l as readCachedStaffAccounts, n as claimDeviceSession, st as safeSetDoc, tt as sounds, w as saveStoredUser } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
//#region src/utils/biometricAuth.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var BIOMETRIC_STORE_KEY = "protyasha_biometric_creds_v1";
function normalizeAccountKey(rawId) {
	const clean = String(rawId || "").trim().toLowerCase();
	if (clean === "admin" || clean === "admin-master" || clean === "admin-primary" || clean === "01777877207") return "01777877207";
	return clean.replace(/[^0-9a-z]/g, "");
}
function bytesToBase64Url(bytes) {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlToBytes(b64url) {
	const padded = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
function sealSecret(plain, keyMaterial) {
	const secretBytes = new TextEncoder().encode(plain);
	const keyBytes = new TextEncoder().encode(keyMaterial || "pcn_bio_key");
	const out = new Uint8Array(secretBytes.length);
	for (let i = 0; i < secretBytes.length; i++) out[i] = secretBytes[i] ^ keyBytes[i % keyBytes.length] ^ i * 31 + 73 & 255;
	return bytesToBase64Url(out);
}
function unsealSecret(sealed, keyMaterial) {
	const sealedBytes = base64UrlToBytes(sealed);
	const keyBytes = new TextEncoder().encode(keyMaterial || "pcn_bio_key");
	const out = new Uint8Array(sealedBytes.length);
	for (let i = 0; i < sealedBytes.length; i++) out[i] = sealedBytes[i] ^ keyBytes[i % keyBytes.length] ^ i * 31 + 73 & 255;
	return new TextDecoder().decode(out);
}
function readAllStored() {
	try {
		const raw = safeStorage.getItem(BIOMETRIC_STORE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function writeAllStored(map) {
	try {
		safeStorage.setItem(BIOMETRIC_STORE_KEY, JSON.stringify(map));
	} catch {}
}
function randomBytes(length) {
	const arr = new Uint8Array(length);
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") crypto.getRandomValues(arr);
	else for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 256);
	return arr;
}
/**
* Safely checks whether WebAuthn platform biometric authentication (Fingerprint / Face ID)
* is supported on the current device and origin without ever throwing.
*/
async function checkBiometricCapability() {
	try {
		if (typeof window === "undefined" || typeof navigator === "undefined") return {
			available: false,
			reason: "unsupported"
		};
		if (!window.isSecureContext) return {
			available: false,
			reason: "insecure_http"
		};
		if (typeof window.PublicKeyCredential === "undefined" || !navigator.credentials || typeof navigator.credentials.create !== "function" || typeof navigator.credentials.get !== "function") return {
			available: false,
			reason: "unsupported"
		};
		if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
			if (!await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) return {
				available: false,
				reason: "no_sensor"
			};
		}
		return { available: true };
	} catch {
		return {
			available: false,
			reason: "unsupported"
		};
	}
}
/**
* Finds an enrolled biometric credential matching the typed accountId (or the most recently enrolled account).
*/
function getEnrolledBiometricAccount(preferredAccountId) {
	const all = readAllStored();
	const keys = Object.keys(all);
	if (keys.length === 0) return null;
	if (preferredAccountId && preferredAccountId.trim()) {
		const norm = normalizeAccountKey(preferredAccountId);
		if (all[norm]) return all[norm];
	}
	let latest = null;
	for (const k of keys) {
		const item = all[k];
		if (!item || !item.credentialId || !item.sealedPin) continue;
		if (!latest || (item.enrolledAt || 0) > (latest.enrolledAt || 0)) latest = item;
	}
	return latest;
}
function removeBiometricAccount(accountId) {
	const all = readAllStored();
	if (!accountId) {
		writeAllStored({});
		return;
	}
	const norm = normalizeAccountKey(accountId);
	if (all[norm]) {
		delete all[norm];
		writeAllStored(all);
	}
}
function classifyBiometricError(err) {
	const name = (err === null || err === void 0 ? void 0 : err.name) || "";
	const msg = String((err === null || err === void 0 ? void 0 : err.message) || err || "").toLowerCase();
	if (name === "NotAllowedError" || name === "AbortError" || msg.includes("cancel") || msg.includes("abort") || msg.includes("not allowed") || msg.includes("timed out")) return {
		cancelled: true,
		messageBn: "ফিঙ্গারপ্রিন্ট বাতিল হয়েছে। কোনো সমস্যা নেই — পিন নম্বর দিয়ে সহজেই লগইন করুন।",
		messageEn: "Fingerprint cancelled. No worries — you can sign in with your PIN."
	};
	if (name === "SecurityError" || msg.includes("publickey") || msg.includes("iframe") || msg.includes("origin")) return {
		cancelled: false,
		messageBn: "এই ব্রাউজার বা ওয়েবভিউতে ফিঙ্গারপ্রিন্ট অনুমোদিত নয়। পিন নম্বর দিয়ে লগইন করুন।",
		messageEn: "Fingerprint is not permitted in this browser context. Please sign in with PIN."
	};
	return {
		cancelled: false,
		messageBn: "ফিঙ্গারপ্রিন্ট যাচাই সম্পন্ন হয়নি। পিন নম্বর দিয়ে লগইন করুন।",
		messageEn: "Fingerprint verification did not succeed. Please sign in with your PIN."
	};
}
/**
* Enrolls device Fingerprint / Biometric (WebAuthn platform authenticator) for a verified account.
*/
async function enrollFingerprintAccount(params) {
	const cap = await checkBiometricCapability();
	if (!cap.available) {
		if (cap.reason === "insecure_http") return {
			success: false,
			messageBn: "ফিঙ্গারপ্রিন্ট চালু করতে HTTPS লিংক প্রয়োজন। আপাতত পিন নম্বর দিয়ে লগইন করুন।",
			messageEn: "HTTPS is required for fingerprint login. Please use your PIN."
		};
		return {
			success: false,
			messageBn: "এই ডিভাইস বা ব্রাউজারে ফিঙ্গারপ্রিন্ট সাপোর্ট নেই। পিন নম্বর দিয়ে লগইন করুন।",
			messageEn: "Fingerprint is not supported on this device or browser. Please use your PIN."
		};
	}
	try {
		const accountKey = normalizeAccountKey(params.accountId);
		const challenge = randomBytes(32);
		const userIdBytes = new TextEncoder().encode(accountKey || "user");
		const hostname = window.location.hostname;
		const publicKey = {
			challenge,
			rp: {
				name: "প্রত্যাশা ক্যাবল নেটওয়ার্ক",
				...hostname && hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) ? { id: hostname } : {}
			},
			user: {
				id: userIdBytes,
				name: params.accountId,
				displayName: params.name || params.accountId
			},
			pubKeyCredParams: [{
				alg: -7,
				type: "public-key"
			}, {
				alg: -257,
				type: "public-key"
			}],
			authenticatorSelection: {
				authenticatorAttachment: "platform",
				userVerification: "required",
				residentKey: "preferred"
			},
			timeout: 45e3,
			attestation: "none"
		};
		const credential = await navigator.credentials.create({ publicKey });
		if (!credential || !credential.rawId) return {
			success: false,
			cancelled: true,
			messageBn: "ফিঙ্গারপ্রিন্ট সেটআপ বাতিল হয়েছে। পিন নম্বর দিয়েই চালিয়ে যেতে পারবেন।",
			messageEn: "Fingerprint setup was cancelled. You can continue using your PIN."
		};
		const credentialId = bytesToBase64Url(new Uint8Array(credential.rawId));
		const sealedPin = sealSecret(params.pin, `${credentialId}:${accountKey}`);
		const all = readAllStored();
		all[accountKey] = {
			accountKey,
			accountId: params.accountId,
			name: params.name || params.accountId,
			role: params.role || "user",
			credentialId,
			sealedPin,
			enrolledAt: Date.now()
		};
		writeAllStored(all);
		return {
			success: true,
			accountId: params.accountId,
			messageBn: "ফিঙ্গারপ্রিন্ট লগইন সফলভাবে চালু হয়েছে!",
			messageEn: "Fingerprint login enabled successfully!"
		};
	} catch (err) {
		const info = classifyBiometricError(err);
		return {
			success: false,
			cancelled: info.cancelled,
			messageBn: info.messageBn,
			messageEn: info.messageEn
		};
	}
}
/**
* Verifies the user via native Fingerprint / Face ID prompt and returns stored credentials
* so LoginView can run live Firestore verification and single-device session lock.
*/
async function authenticateWithFingerprint(preferredAccountId) {
	const cap = await checkBiometricCapability();
	if (!cap.available) {
		if (cap.reason === "insecure_http") return {
			success: false,
			messageBn: "ফিঙ্গারপ্রিন্ট লগইনের জন্য নিরাপদ HTTPS লিংক প্রয়োজন। অনুগ্রহ করে পিন নম্বর দিয়ে লগইন করুন।",
			messageEn: "Secure HTTPS connection is required for fingerprint login. Please sign in with your PIN."
		};
		return {
			success: false,
			messageBn: "এই ডিভাইস বা ব্রাউজারে ফিঙ্গারপ্রিন্ট পাওয়া যায়নি। পিন নম্বর দিয়ে লগইন করুন।",
			messageEn: "Fingerprint sensor is unavailable in this browser. Please sign in with your PIN."
		};
	}
	const stored = getEnrolledBiometricAccount(preferredAccountId);
	if (!stored) return {
		success: false,
		messageBn: "ফিঙ্গারপ্রিন্ট এখনো চালু করা হয়নি। প্রথমে একবার পিন নম্বর দিয়ে লগইন করে ফিঙ্গারপ্রিন্ট চালু করুন।",
		messageEn: "Fingerprint is not set up yet. Sign in with your PIN once to enable fingerprint login."
	};
	try {
		const challenge = randomBytes(32);
		const credIdBytes = base64UrlToBytes(stored.credentialId);
		const hostname = window.location.hostname;
		const publicKey = {
			challenge,
			...hostname && hostname !== "localhost" && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) ? { rpId: hostname } : {},
			allowCredentials: [{
				id: credIdBytes,
				type: "public-key",
				transports: ["internal"]
			}],
			userVerification: "required",
			timeout: 45e3
		};
		const assertion = await navigator.credentials.get({ publicKey });
		if (!assertion || !assertion.rawId) return {
			success: false,
			cancelled: true,
			messageBn: "ফিঙ্গারপ্রিন্ট বাতিল হয়েছে। পিন নম্বর দিয়ে লগইন করুন।",
			messageEn: "Fingerprint cancelled. Please sign in with your PIN."
		};
		const pin = unsealSecret(stored.sealedPin, `${stored.credentialId}:${stored.accountKey}`);
		if (!pin || pin.length < 4) {
			removeBiometricAccount(stored.accountId);
			return {
				success: false,
				messageBn: "ফিঙ্গারপ্রিন্ট ডেটা পুরনো হয়ে গেছে। একবার পিন নম্বর দিয়ে লগইন করুন।",
				messageEn: "Saved fingerprint data expired. Please sign in with your PIN once."
			};
		}
		return {
			success: true,
			accountId: stored.accountId,
			pin
		};
	} catch (err) {
		const info = classifyBiometricError(err);
		return {
			success: false,
			cancelled: info.cancelled,
			messageBn: info.messageBn,
			messageEn: info.messageEn
		};
	}
}
//#endregion
//#region src/components/LoginView.tsx
var import_jsx_runtime = require_jsx_runtime();
var LoginView = ({ lang, footerConfig, banners = [], adminAvatar, onLanguageChange, onLoginSuccess, onClose, onOpenStoreModal, onOpenOfferModal, onOpenHelpModal, sessionNotice, onClearSessionNotice, onSubViewChange, isVisitorModeEnabled = true, visitorDisabledTitle, visitorDisabledMessage }) => {
	const isBn = lang === "bn";
	translations[lang];
	const [authMode, setAuthMode] = (0, import_react.useState)("login");
	const [accountNumber, setAccountNumber] = (0, import_react.useState)(() => {
		return safeStorage.getItem("protyasha_last_phone") || "";
	});
	const [pin, setPin] = (0, import_react.useState)("");
	const [showPin, setShowPin] = (0, import_react.useState)(false);
	const [activeModal, setActiveModal] = (0, import_react.useState)(null);
	useSubViewBack(true, activeModal ? 1 : 0, () => setActiveModal(null), onSubViewChange, "loginModal");
	const [regName, setRegName] = (0, import_react.useState)("");
	const [regPhone, setRegPhone] = (0, import_react.useState)("");
	const [regAvatar, setRegAvatar] = (0, import_react.useState)("");
	const [regPin, setRegPin] = (0, import_react.useState)("");
	const [regConfirmPin, setRegConfirmPin] = (0, import_react.useState)("");
	const [showRegPin, setShowRegPin] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const [bioNotice, setBioNotice] = (0, import_react.useState)("");
	const [canForceAdminLogin, setCanForceAdminLogin] = (0, import_react.useState)(false);
	const pinInputRef = (0, import_react.useRef)(null);
	const [isBiometricBusy, setIsBiometricBusy] = (0, import_react.useState)(false);
	const [biometricSupported, setBiometricSupported] = (0, import_react.useState)(false);
	const [enableFingerprintOnLogin, setEnableFingerprintOnLogin] = (0, import_react.useState)(false);
	const [enrolledBioAccount, setEnrolledBioAccount] = (0, import_react.useState)(() => getEnrolledBiometricAccount(safeStorage.getItem("protyasha_last_phone") || ""));
	(0, import_react.useEffect)(() => {
		let active = true;
		checkBiometricCapability().then((cap) => {
			if (active) setBiometricSupported(cap.available);
		}).catch(() => {
			if (active) setBiometricSupported(false);
		});
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setEnrolledBioAccount(getEnrolledBiometricAccount(accountNumber));
	}, [accountNumber]);
	const focusPinFallback = () => {
		setTimeout(() => {
			try {
				var _pinInputRef$current;
				(_pinInputRef$current = pinInputRef.current) === null || _pinInputRef$current === void 0 || _pinInputRef$current.focus();
			} catch {}
		}, 60);
	};
	const handleImageUpload = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		try {
			const compressedDataUrl = await compressImage(file, 400, 400, .85);
			setRegAvatar(compressedDataUrl);
			sounds.playSuccess();
		} catch (err) {
			console.error("Error compressing avatar in registration:", err);
		}
	};
	const performLogin = async (forceAdminTakeover = false, overrideCredentials) => {
		const rawId = (overrideCredentials ? overrideCredentials.accountId : accountNumber).trim();
		const cleanId = rawId.toLowerCase();
		const cleanPin = (overrideCredentials ? overrideCredentials.pin : pin).trim();
		if (!cleanId || cleanPin.length < 4) {
			setErrorMsg(isBn ? "সঠিক মোবাইল নাম্বার ও কমপক্ষে ৪ ডিজিটের পিন দিন" : "Enter valid phone and at least 4-digit PIN");
			return;
		}
		sounds.playTap();
		setIsLoading(true);
		setErrorMsg("");
		setSuccessMsg("");
		setBioNotice("");
		setCanForceAdminLogin(false);
		if (onClearSessionNotice) onClearSessionNotice();
		const maybeEnrollFingerprint = async (session) => {
			const shouldEnroll = Boolean(overrideCredentials === null || overrideCredentials === void 0 ? void 0 : overrideCredentials.forceEnroll) || enableFingerprintOnLogin;
			if ((overrideCredentials === null || overrideCredentials === void 0 ? void 0 : overrideCredentials.skipEnroll) || !shouldEnroll) return;
			try {
				if ((await enrollFingerprintAccount({
					accountId: rawId || session.phone,
					pin: cleanPin,
					name: session.name,
					role: session.role
				})).success) setEnrolledBioAccount(getEnrolledBiometricAccount(rawId || session.phone));
			} catch {}
		};
		try {
			const isMasterAdminId = cleanId === "admin" || cleanId === "01777877207" || cleanId === "admin-master" || cleanId === "admin-primary";
			let effectiveAdminPin = safeStorage.getItem("protyasha_admin_pin") || "12588";
			if (isMasterAdminId && cleanPin !== effectiveAdminPin) try {
				var _secSnap$data;
				const secSnap = await getDoc(doc(db, "settings", "admin_security"));
				if (secSnap.exists() && ((_secSnap$data = secSnap.data()) === null || _secSnap$data === void 0 ? void 0 : _secSnap$data.pin)) {
					effectiveAdminPin = String(secSnap.data().pin);
					safeStorage.setItem("protyasha_admin_pin", effectiveAdminPin);
				}
			} catch {}
			if (isMasterAdminId && cleanPin === effectiveAdminPin) {
				let serverAdminName = isBn ? "প্রত্যাশা অ্যাডমিন" : "Protyasha Admin";
				let serverAdminPhone = "01777877207";
				let serverAdminAvatar = adminAvatar || safeStorage.getItem("protyasha_admin_avatar") || "";
				try {
					const [adminProfileSnap, adminUserSnap] = await Promise.all([getDoc(doc(db, "settings", "admin_profile")).catch(() => null), getDoc(doc(db, "users", "admin-master")).catch(() => null)]);
					const apData = (adminProfileSnap === null || adminProfileSnap === void 0 ? void 0 : adminProfileSnap.exists()) ? adminProfileSnap.data() : null;
					const auData = (adminUserSnap === null || adminUserSnap === void 0 ? void 0 : adminUserSnap.exists()) ? adminUserSnap.data() : null;
					if ((apData === null || apData === void 0 ? void 0 : apData.name) || (auData === null || auData === void 0 ? void 0 : auData.name)) serverAdminName = (apData === null || apData === void 0 ? void 0 : apData.name) || (auData === null || auData === void 0 ? void 0 : auData.name) || serverAdminName;
					if ((apData === null || apData === void 0 ? void 0 : apData.phone) || (auData === null || auData === void 0 ? void 0 : auData.phone)) serverAdminPhone = (apData === null || apData === void 0 ? void 0 : apData.phone) || (auData === null || auData === void 0 ? void 0 : auData.phone) || serverAdminPhone;
					const fetchedAvatar = ((apData === null || apData === void 0 ? void 0 : apData.avatarUrl) && !String(apData.avatarUrl).startsWith("/uploads/") ? String(apData.avatarUrl) : "") || ((auData === null || auData === void 0 ? void 0 : auData.avatarUrl) && !String(auData.avatarUrl).startsWith("/uploads/") ? String(auData.avatarUrl) : "");
					if (fetchedAvatar) {
						serverAdminAvatar = fetchedAvatar;
						safeStorage.setItem("protyasha_admin_avatar", fetchedAvatar);
						safeStorage.setItem("protyasha_last_avatar", fetchedAvatar);
					}
				} catch {}
				const lockResult = await claimDeviceSession({
					id: "admin-master",
					phone: serverAdminPhone,
					role: "admin",
					name: serverAdminName,
					forceTakeover: forceAdminTakeover
				});
				if (!lockResult.allowed) {
					setIsLoading(false);
					sounds.playTap();
					setCanForceAdminLogin(Boolean(lockResult.canForceTakeover));
					setErrorMsg(isBn ? lockResult.messageBn || "অন্য ডিভাইসে লগইন করা আছে" : lockResult.messageEn || "Already logged in on another device");
					return;
				}
				safeStorage.setItem("protyasha_last_phone", rawId);
				const adminSession = {
					id: "admin-master",
					email: "admin@protyasha.com",
					role: "admin",
					name: serverAdminName,
					phone: serverAdminPhone,
					avatarUrl: serverAdminAvatar || "",
					virtualCardNumber: "9856 0000 2932 9162",
					accountType: "general",
					profitPreference: false
				};
				await maybeEnrollFingerprint(adminSession);
				setIsLoading(false);
				sounds.playSuccess();
				onLoginSuccess(adminSession);
				return;
			}
			let userData = null;
			let userId = "";
			try {
				const usersRef = collection(db, "users");
				const lookupPhone = cleanId === "admin" ? "01777877207" : rawId;
				const q = query(usersRef, where("phone", "==", lookupPhone));
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
					const matchedDoc = querySnapshot.docs.find((d) => {
						var _d$data, _d$data2;
						return ((_d$data = d.data()) === null || _d$data === void 0 ? void 0 : _d$data.pin) === cleanPin && ((_d$data2 = d.data()) === null || _d$data2 === void 0 ? void 0 : _d$data2.avatarUrl);
					}) || querySnapshot.docs.find((d) => {
						var _d$data3;
						return ((_d$data3 = d.data()) === null || _d$data3 === void 0 ? void 0 : _d$data3.pin) === cleanPin;
					}) || querySnapshot.docs.find((d) => {
						var _d$data4;
						return (_d$data4 = d.data()) === null || _d$data4 === void 0 ? void 0 : _d$data4.avatarUrl;
					}) || querySnapshot.docs[0];
					userData = matchedDoc.data();
					userId = matchedDoc.id;
					saveStoredUser({
						...userData,
						id: userId
					});
				} else {
					const normInput = normalizePhoneNumber(lookupPhone);
					if (normInput.length >= 6) {
						const normMatches = (await getDocs(usersRef)).docs.filter((d) => {
							var _d$data5;
							return normalizePhoneNumber((_d$data5 = d.data()) === null || _d$data5 === void 0 ? void 0 : _d$data5.phone) === normInput;
						});
						if (normMatches.length > 0) {
							const matchedDoc = normMatches.find((d) => {
								var _d$data6, _d$data7;
								return ((_d$data6 = d.data()) === null || _d$data6 === void 0 ? void 0 : _d$data6.pin) === cleanPin && ((_d$data7 = d.data()) === null || _d$data7 === void 0 ? void 0 : _d$data7.avatarUrl);
							}) || normMatches.find((d) => {
								var _d$data8;
								return ((_d$data8 = d.data()) === null || _d$data8 === void 0 ? void 0 : _d$data8.pin) === cleanPin;
							}) || normMatches[0];
							userData = matchedDoc.data();
							userId = matchedDoc.id;
							saveStoredUser({
								...userData,
								id: userId
							});
						}
					}
				}
			} catch (err) {
				console.warn("Firestore login check skipped, using local store:", err);
			}
			if (!userData) {
				const localUser = findStoredUserByPhone(cleanId === "admin" ? "01777877207" : rawId);
				if (localUser) {
					userData = localUser;
					userId = localUser.id;
				}
			}
			let cachedStaffAuthData = null;
			const getStaffAuthConfig = async () => {
				if (cachedStaffAuthData) return cachedStaffAuthData;
				try {
					const pinSnap = await getDoc(doc(db, "settings", "staff_support_auth"));
					if (pinSnap.exists()) {
						cachedStaffAuthData = pinSnap.data();
						return cachedStaffAuthData;
					}
				} catch {}
				cachedStaffAuthData = {
					globalPin: "1234",
					staffPins: {}
				};
				return cachedStaffAuthData;
			};
			if (userData) {
				let pinMatchesUser = String(userData.pin || "") === cleanPin;
				if (!pinMatchesUser && userData.role === "staff") {
					var _staffCfg$staffPins;
					const staffCfg = await getStaffAuthConfig();
					const staffSpecificPin = staffCfg === null || staffCfg === void 0 || (_staffCfg$staffPins = staffCfg.staffPins) === null || _staffCfg$staffPins === void 0 ? void 0 : _staffCfg$staffPins[userId];
					if (staffSpecificPin && String(staffSpecificPin).trim() === cleanPin) pinMatchesUser = true;
				}
				if (pinMatchesUser) {
					if (userData.status === "suspended") {
						setIsLoading(false);
						setErrorMsg(isBn ? "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।" : "Your account has been suspended. Contact admin.");
						return;
					}
					const resolvedRole = userData.role || "user";
					const resolvedId = userId || "usr_" + Date.now();
					const lockResult = await claimDeviceSession({
						id: resolvedId,
						phone: userData.phone,
						role: resolvedRole,
						name: userData.name || ""
					});
					if (!lockResult.allowed) {
						setIsLoading(false);
						sounds.playTap();
						setErrorMsg(isBn ? lockResult.messageBn || "অন্য ডিভাইসে লগইন করা আছে" : lockResult.messageEn || "Already logged in on another device");
						return;
					}
					const userSession = {
						id: resolvedId,
						email: `${userData.phone}@protyasha.com`,
						role: resolvedRole,
						permissions: resolvedRole === "sub-admin" ? userData.permissions : void 0,
						name: userData.name,
						phone: userData.phone,
						gmail: userData.gmail || void 0,
						boundMethods: userData.boundMethods || void 0,
						avatarUrl: userData.avatarUrl,
						virtualCardNumber: userData.virtualCardNumber || "9856 " + String(userData.phone || "").slice(-4).padStart(4, "0") + " 2932 9162",
						accountType: "general",
						profitPreference: false
					};
					safeStorage.setItem("protyasha_last_phone", userData.phone || rawId);
					safeStorage.setItem("protyasha_user_phone", userData.phone || rawId);
					if (userData.avatarUrl) safeStorage.setItem("protyasha_last_avatar", userData.avatarUrl);
					await maybeEnrollFingerprint(userSession);
					setIsLoading(false);
					sounds.playSuccess();
					onLoginSuccess(userSession);
					return;
				}
			}
			let staffList = readCachedStaffAccounts();
			try {
				const staffSnap = await getDocs(collection(staffDb, "staff"));
				const cloudStaff = [];
				staffSnap.forEach((docSnap) => {
					const sData = docSnap.data();
					if (sData && (sData.id || docSnap.id) && sData.name) cloudStaff.push({
						...sData,
						id: String(sData.id || docSnap.id),
						isActive: sData.isActive !== false
					});
				});
				if (cloudStaff.length > 0) staffList = cloudStaff;
			} catch {}
			const inputNormPhone = normalizePhoneNumber(rawId);
			const matchedStaff = staffList.find((s) => {
				if (s.isActive === false) return false;
				const sNormPhone = normalizePhoneNumber(s.phone);
				if (inputNormPhone.length >= 6 && sNormPhone === inputNormPhone) return true;
				if (s.userCode && s.userCode.trim().toLowerCase() === cleanId) return true;
				if (String(s.id).trim().toLowerCase() === cleanId) return true;
				return false;
			});
			if (matchedStaff) {
				if (userData && userData.status === "suspended") {
					setIsLoading(false);
					setErrorMsg(isBn ? "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।" : "Your account has been suspended. Contact admin.");
					return;
				}
				const staffAuthCfg = await getStaffAuthConfig();
				const globalStaffPin = String((staffAuthCfg === null || staffAuthCfg === void 0 ? void 0 : staffAuthCfg.globalPin) || "1234").trim() || "1234";
				const staffPins = (staffAuthCfg === null || staffAuthCfg === void 0 ? void 0 : staffAuthCfg.staffPins) && typeof staffAuthCfg.staffPins === "object" ? staffAuthCfg.staffPins : {};
				if (cleanPin === String(staffPins[matchedStaff.id] || globalStaffPin || "1234").trim() || userData && userData.role === "staff" && String(userData.pin || "") === cleanPin) {
					const staffPhone = matchedStaff.phone || rawId;
					const lockResult = await claimDeviceSession({
						id: matchedStaff.id,
						phone: staffPhone,
						role: "staff",
						name: matchedStaff.name
					});
					if (!lockResult.allowed) {
						setIsLoading(false);
						sounds.playTap();
						setErrorMsg(isBn ? lockResult.messageBn || "অন্য ডিভাইসে লগইন করা আছে" : lockResult.messageEn || "Already logged in on another device");
						return;
					}
					try {
						const staffSessionObj = {
							staffId: matchedStaff.id,
							name: matchedStaff.name,
							phone: staffPhone,
							roleTitle: matchedStaff.role || "স্টাফ",
							loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
						};
						sessionStorage.setItem("protyasha_support_staff_session", JSON.stringify(staffSessionObj));
					} catch {}
					const staffUserSession = {
						id: matchedStaff.id,
						email: `${staffPhone}@protyasha.com`,
						role: "staff",
						name: matchedStaff.name,
						phone: staffPhone,
						avatarUrl: matchedStaff.avatarUrl || "",
						virtualCardNumber: "9856 " + String(staffPhone).slice(-4).padStart(4, "0") + " 2932 9162",
						accountType: "general",
						profitPreference: false
					};
					safeStorage.setItem("protyasha_last_phone", staffPhone);
					safeStorage.setItem("protyasha_user_phone", staffPhone);
					if (matchedStaff.avatarUrl) safeStorage.setItem("protyasha_last_avatar", matchedStaff.avatarUrl);
					await maybeEnrollFingerprint(staffUserSession);
					setIsLoading(false);
					sounds.playSuccess();
					onLoginSuccess(staffUserSession);
					return;
				}
				setIsLoading(false);
				sounds.playTap();
				setErrorMsg(isBn ? "ভুল পিন নম্বর! পুনরায় চেষ্টা করুন।" : "Invalid PIN! Please try again.");
				return;
			}
			if (userData) {
				setIsLoading(false);
				sounds.playTap();
				setErrorMsg(isBn ? "ভুল পিন নম্বর! পুনরায় চেষ্টা করুন।" : "Invalid PIN! Please try again.");
			} else {
				setIsLoading(false);
				sounds.playTap();
				setErrorMsg(isBn ? "এই মোবাইল নাম্বারে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" : "No account found with this phone number.");
			}
		} catch (err) {
			setIsLoading(false);
			console.error("Login error:", err);
			setErrorMsg(isBn ? "লগইন প্রক্রিয়ায় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" : "Login failed. Please retry.");
		}
	};
	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		await performLogin(false);
	};
	const handleFingerprintLogin = async () => {
		if (isLoading || isBiometricBusy) return;
		sounds.playTap();
		setErrorMsg("");
		setSuccessMsg("");
		setBioNotice("");
		setCanForceAdminLogin(false);
		if (!getEnrolledBiometricAccount(accountNumber)) {
			if (accountNumber.trim() && pin.trim().length >= 4) {
				setEnableFingerprintOnLogin(true);
				await performLogin(false, {
					accountId: accountNumber,
					pin,
					forceEnroll: true
				});
				return;
			}
			if (biometricSupported) {
				setEnableFingerprintOnLogin(true);
				setBioNotice(isBn ? "ফিঙ্গারপ্রিন্ট চালু করতে একবার পিন নম্বর দিয়ে লগইন করুন — এরপর থেকে এক স্পর্শেই লগইন হবে।" : "Enter your PIN once to enable Fingerprint login — next time you can sign in with 1 tap.");
			} else setBioNotice(isBn ? "এই ব্রাউজার/সংযোগে ফিঙ্গারপ্রিন্ট পাওয়া যায়নি। পিন নম্বর দিয়ে সহজেই লগইন করুন।" : "Fingerprint is unavailable in this browser/connection. Please sign in with your PIN.");
			focusPinFallback();
			return;
		}
		setIsBiometricBusy(true);
		try {
			const result = await authenticateWithFingerprint(accountNumber);
			setIsBiometricBusy(false);
			if (!result.success || !result.accountId || !result.pin) {
				setBioNotice(isBn ? result.messageBn || "ফিঙ্গারপ্রিন্ট বাতিল হয়েছে। পিন নম্বর দিয়ে লগইন করুন।" : result.messageEn || "Fingerprint cancelled. Please sign in with your PIN.");
				focusPinFallback();
				return;
			}
			setAccountNumber(result.accountId);
			await performLogin(false, {
				accountId: result.accountId,
				pin: result.pin,
				skipEnroll: true
			});
		} catch {
			setIsBiometricBusy(false);
			setBioNotice(isBn ? "ফিঙ্গারপ্রিন্ট কাজ করেনি। কোনো সমস্যা নেই — পিন নম্বর দিয়ে লগইন করুন।" : "Fingerprint failed. No worries — please sign in with your PIN.");
			focusPinFallback();
		}
	};
	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		if (!regName.trim()) {
			setErrorMsg(isBn ? "অনুগ্রহ করে আপনার নাম লিখুন" : "Please enter your name");
			return;
		}
		if (!regPhone.trim() || regPhone.trim().length < 10) {
			setErrorMsg(isBn ? "সঠিক ১১-সংখ্যার মোবাইল নাম্বার লিখুন" : "Please enter valid phone number");
			return;
		}
		if (!regPin.trim() || regPin.trim().length < 4) {
			setErrorMsg(isBn ? "কমপক্ষে ৪ সংখ্যার গোপনীয় পিন সেট করুন" : "PIN must be at least 4 digits");
			return;
		}
		if (regPin !== regConfirmPin) {
			setErrorMsg(isBn ? "উভয় পিন নম্বর মিলছে না! পুনরায় চেক করুন।" : "PINs do not match!");
			return;
		}
		sounds.playTap();
		setIsLoading(true);
		setErrorMsg("");
		try {
			const cleanPhone = regPhone.trim();
			if (findStoredUserByPhone(cleanPhone)) {
				setIsLoading(false);
				setErrorMsg(isBn ? "এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে" : "An account already exists with this phone number");
				return;
			}
			try {
				const usersRef = collection(db, "users");
				const q = query(usersRef, where("phone", "==", cleanPhone));
				if (!(await getDocs(q)).empty) {
					setIsLoading(false);
					setErrorMsg(isBn ? "এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে" : "An account already exists with this phone number");
					return;
				}
			} catch (e) {
				console.warn("Firestore phone duplicate check skipped:", e);
			}
			const newId = "usr_" + Date.now();
			const newUser = {
				id: newId,
				name: regName.trim(),
				phone: cleanPhone,
				avatarUrl: regAvatar || "",
				pin: regPin.trim(),
				role: "user",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				status: "active"
			};
			saveStoredUser(newUser);
			await safeSetDoc(doc(db, "users", newId), newUser).catch(() => {});
			await claimDeviceSession({
				id: newUser.id,
				phone: newUser.phone,
				role: "user",
				name: newUser.name
			}).catch(() => {});
			setIsLoading(false);
			sounds.playSuccess();
			setSuccessMsg(isBn ? "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" : "Account created successfully!");
			safeStorage.setItem("protyasha_user_phone", cleanPhone);
			safeStorage.setItem("protyasha_last_phone", cleanPhone);
			if (regAvatar) safeStorage.setItem("protyasha_last_avatar", regAvatar);
			setTimeout(() => {
				onLoginSuccess({
					id: newUser.id,
					email: `${newUser.phone}@protyasha.com`,
					role: "user",
					name: newUser.name,
					phone: newUser.phone,
					avatarUrl: newUser.avatarUrl,
					virtualCardNumber: "9856 " + newUser.phone.slice(-4).padStart(4, "0") + " 2932 9162",
					accountType: "general",
					profitPreference: false
				});
			}, 300);
		} catch (err) {
			setIsLoading(false);
			console.error("Registration error:", err);
			setErrorMsg(isBn ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।" : "Registration failed! Please retry.");
		}
	};
	const handleVisitorLogin = () => {
		sounds.playTap();
		if (!isVisitorModeEnabled) {
			setActiveModal("visitor_blocked");
			return;
		}
		sounds.playSuccess();
		onLoginSuccess({
			email: "visitor@protashacablenetwork.com",
			role: "visitor",
			name: isBn ? "সম্মানিত ভিজিটর" : "Guest Visitor",
			phone: "01777877207",
			virtualCardNumber: "9856 0000 2932 9162",
			accountType: "general",
			profitPreference: false
		});
	};
	const displayAvatar = safeStorage.getItem("protyasha_last_avatar") || adminAvatar;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md overflow-y-auto overflow-x-hidden select-none flex flex-col md:items-center md:justify-center p-0 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full md:max-w-4xl lg:max-w-5xl bg-gradient-to-br from-[#FCEAE5] via-[#FFF8F5] to-[#FDE6E0] dark:from-slate-950 dark:via-slate-900 dark:to-stone-950 md:rounded-3xl shadow-2xl flex flex-col md:flex-row md:overflow-hidden min-h-[100dvh] md:min-h-[600px] md:my-auto border-0 md:border border-slate-200/60 dark:border-slate-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:flex md:w-5/12 bg-gradient-to-br from-[#D32F2F] via-[#E52E2E] to-[#B71C1C] p-8 text-white flex-col justify-between relative overflow-hidden shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-6 h-6 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold tracking-wider uppercase text-amber-200",
									children: isBn ? "ডিজিটাল সেবার স্মার্ট মাধ্যম" : "Smart Digital Portal"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl lg:text-3xl font-black leading-tight mb-3 tracking-tight",
								children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-rose-100/90 leading-relaxed mb-6",
								children: isBn ? "হাই-স্পিড অপটিক্যাল ফাইবার ব্রডব্যান্ড ইন্টারনেট ও ডিজিটাল ডিস নেটওয়ার্ক ব্যবস্থাপনা" : "High-speed optical fiber internet & digital dish network ledger portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-4.5 h-4.5 text-amber-300 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "২৪/৭ অটোমেটেড ক্যাবল বিল বুকিং" : "24/7 Automated Cable Billing" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-4.5 h-4.5 text-amber-300 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্মার্ট ও বাফারিংহীন ইন্টারনেট প্যাকেজ" : "Smart Bufferless Internet Packs" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 pt-6 border-t border-white/20 text-[11px] text-rose-200 font-semibold",
						children: isBn ? "© ২০২৬ প্রত্যাশা ডিজিটাল পোর্টাল" : "© 2026 Protasha Digital Portal"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 sm:px-5 pt-3 sm:pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টাল" : "Protasha Portal" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex p-0.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200/80 dark:border-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									sounds.playTap();
									onLanguageChange("bn");
								},
								className: `px-3 py-0.5 rounded-full text-xs font-bold transition-all ${lang === "bn" ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
								children: "বাংলা"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									sounds.playTap();
									onLanguageChange("en");
								},
								className: `px-3 py-0.5 rounded-full text-xs font-bold transition-all ${lang === "en" ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
								children: "ENG"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `px-4 sm:px-5 ${authMode === "register" ? "py-2.5 sm:py-3.5" : "py-3.5 sm:py-4"} flex-1 flex flex-col justify-between`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-center gap-3 ${authMode === "register" ? "mb-2.5" : "mb-3.5"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `${authMode === "register" ? "w-11 h-11" : "w-13 h-13"} rounded-full bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-1 shadow-lg shadow-rose-500/30 flex items-center justify-center overflow-hidden shrink-0 transition-all`,
									children: displayAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: displayAvatar,
										alt: "Logo",
										className: "w-full h-full object-cover rounded-full"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#E52E2E] font-black text-xl",
											children: isBn ? "প্র" : "P"
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: `${authMode === "register" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"} font-black tracking-tight text-[#E52E2E] leading-tight truncate`,
										children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5",
										children: isBn ? "স্মার্ট নেটওয়ার্ক ও হিসাব খাতা" : "Smart Network & Ledger"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `grid grid-cols-2 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 ${authMode === "register" ? "mb-2.5" : "mb-3.5"} border border-slate-300/50 dark:border-slate-700`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										setAuthMode("login");
										setErrorMsg("");
										setCanForceAdminLogin(false);
									},
									className: `flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${authMode === "login" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লগইন করুন" : "Sign In" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										setAuthMode("register");
										setErrorMsg("");
										setCanForceAdminLogin(false);
									},
									className: `flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${authMode === "register" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন একাউন্ট খুলুন" : "Create Account" })]
								})]
							}),
							sessionNotice && !errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2.5 p-2.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-center",
								children: sessionNotice
							}),
							errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 p-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-center animate-shake",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: errorMsg }), canForceAdminLogin && authMode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: isLoading,
									onClick: () => performLogin(true),
									className: "mt-2 w-full py-2 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-sm active:scale-[0.98] transition-all cursor-pointer",
									children: isLoading ? isBn ? "লগইন হচ্ছে..." : "Signing in..." : isBn ? "আগের ডিভাইস লগআউট করে এখানে লগইন করুন" : "Sign out other device & Log in here"
								})]
							}),
							bioNotice && !errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 border border-rose-200 dark:border-slate-700 text-center flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "w-4 h-4 text-[#E52E2E] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bioNotice })]
							}),
							successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 p-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-center flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
							}),
							authMode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleLoginSubmit,
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "মোবাইল নাম্বার বা এডমিন আইডি" : "Mobile Number or Admin ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4 text-slate-400" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											autoComplete: "off",
											autoCorrect: "off",
											autoCapitalize: "off",
											spellCheck: false,
											"data-lpignore": "true",
											"data-1password-type": "off",
											value: accountNumber,
											onChange: (e) => {
												setAccountNumber(e.target.value);
												if (onClearSessionNotice) onClearSessionNotice();
											},
											placeholder: isBn ? "০১XXXXXXXXX অথবা admin" : "01XXXXXXXXX or admin",
											required: true,
											className: "w-full h-12 pl-10 pr-4 text-sm font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: isBn ? "গোপনীয় পিন নম্বর" : "Security PIN"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: pinInputRef,
												type: showPin ? "text" : "password",
												inputMode: "numeric",
												pattern: "[0-9]*",
												maxLength: 8,
												autoComplete: "new-password",
												autoCorrect: "off",
												autoCapitalize: "off",
												spellCheck: false,
												"data-lpignore": "true",
												"data-1password-type": "off",
												value: pin,
												onChange: (e) => {
													const val = e.target.value.replace(/[^0-9]/g, "");
													setPin(val);
													if (bioNotice) setBioNotice("");
												},
												placeholder: "•••••",
												required: true,
												className: "w-full h-12 pl-10 pr-11 text-center tracking-[0.3em] text-lg font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E] transition-all"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPin(!showPin),
												className: "absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600",
												children: showPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-stretch gap-2.5 mt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: isLoading || isBiometricBusy,
											className: "flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-[#D32F2F] to-[#E52E2E] text-white shadow-md shadow-rose-600/30 hover:opacity-95 active:scale-[0.98] disabled:opacity-60 cursor-pointer",
											children: isLoading ? isBn ? "যাচাই করা হচ্ছে..." : "Verifying..." : isBn ? "লগইন করুন" : "Log In"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: isLoading || isBiometricBusy,
											onClick: handleFingerprintLogin,
											"aria-label": isBn ? "ফিঙ্গারপ্রিন্ট দিয়ে লগইন" : "Login with Fingerprint",
											title: isBn ? "ফিঙ্গারপ্রিন্ট দিয়ে লগইন" : "Login with Fingerprint",
											className: "w-12 h-12 shrink-0 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 flex items-center justify-center active:scale-95 transition-all disabled:opacity-60 cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: `w-6 h-6 ${isBiometricBusy ? "animate-pulse" : ""}` })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between gap-2 pt-0.5",
										children: enrolledBioAccount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isLoading || isBiometricBusy,
											onClick: handleFingerprintLogin,
											className: "inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E52E2E] hover:underline active:opacity-80 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fingerprint, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBiometricBusy ? isBn ? "ফিঙ্গারপ্রিন্ট যাচাই হচ্ছে..." : "Verifying fingerprint..." : isBn ? "ফিঙ্গারপ্রিন্ট দিয়ে লগইন (Login with Fingerprint)" : "Login with Fingerprint" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												removeBiometricAccount(enrolledBioAccount.accountId);
												setEnrolledBioAccount(null);
												setBioNotice(isBn ? "ফিঙ্গারপ্রিন্ট সরানো হয়েছে। পিন দিয়ে লগইন করুন।" : "Fingerprint removed. Sign in with PIN.");
											},
											className: "text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer",
											children: isBn ? "বন্ধ করুন" : "Remove"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: enableFingerprintOnLogin,
												onChange: (e) => setEnableFingerprintOnLogin(e.target.checked),
												className: "w-3.5 h-3.5 rounded accent-[#E52E2E] cursor-pointer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লগইনের পর ফিঙ্গারপ্রিন্ট চালু করুন (Login with Fingerprint)" : "Enable Login with Fingerprint after PIN sign in" })]
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleRegisterSubmit,
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 p-1.5 px-2.5 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-rose-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs",
											children: [regAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: regAvatar,
												alt: "Profile",
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-5 h-5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center cursor-pointer transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5 text-white drop-shadow-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/*",
													onChange: handleImageUpload,
													className: "hidden"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight",
												children: isBn ? "প্রোফাইল ছবি" : "Profile Photo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 truncate",
												children: regAvatar ? isBn ? "✓ ছবি সিলেক্ট হয়েছে" : "✓ Photo selected" : isBn ? "ক্যামেরা বা গ্যালারি থেকে ছবি দিন" : "Upload photo from device"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5",
										children: [isBn ? "আপনার পূর্ণ নাম" : "Full Name", " *"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										autoComplete: "off",
										autoCorrect: "off",
										autoCapitalize: "off",
										spellCheck: false,
										value: regName,
										onChange: (e) => setRegName(e.target.value),
										placeholder: isBn ? "যেমন: মো: সুমন হোসেন" : "e.g. John Doe",
										required: true,
										className: "w-full h-10 px-3 text-xs font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5",
										children: [isBn ? "মোবাইল নাম্বার" : "Mobile Number", " *"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										inputMode: "numeric",
										pattern: "[0-9]*",
										autoComplete: "off",
										autoCorrect: "off",
										autoCapitalize: "off",
										spellCheck: false,
										"data-lpignore": "true",
										"data-1password-type": "off",
										value: regPhone,
										onChange: (e) => setRegPhone(e.target.value),
										placeholder: "01XXXXXXXXX",
										required: true,
										className: "w-full h-10 px-3 text-xs font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5",
											children: [isBn ? "গোপন পিন" : "Set PIN", " *"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showRegPin ? "text" : "password",
												inputMode: "numeric",
												pattern: "[0-9]*",
												maxLength: 6,
												autoComplete: "new-password",
												autoCorrect: "off",
												autoCapitalize: "off",
												spellCheck: false,
												"data-lpignore": "true",
												"data-1password-type": "off",
												value: regPin,
												onChange: (e) => {
													const val = e.target.value.replace(/[^0-9]/g, "");
													setRegPin(val);
												},
												placeholder: "••••",
												required: true,
												className: "w-full h-10 pl-3 pr-8 text-center tracking-widest text-sm font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowRegPin(!showRegPin),
												className: "absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400",
												children: showRegPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" })
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5",
											children: [isBn ? "পিন নিশ্চিত করুন" : "Confirm PIN", " *"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: showRegPin ? "text" : "password",
											inputMode: "numeric",
											pattern: "[0-9]*",
											maxLength: 6,
											autoComplete: "new-password",
											autoCorrect: "off",
											autoCapitalize: "off",
											spellCheck: false,
											"data-lpignore": "true",
											"data-1password-type": "off",
											value: regConfirmPin,
											onChange: (e) => {
												const val = e.target.value.replace(/[^0-9]/g, "");
												setRegConfirmPin(val);
											},
											placeholder: "••••",
											required: true,
											className: "w-full h-10 px-3 text-center tracking-widest text-sm font-bold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: isLoading,
										className: "w-full h-11 rounded-2xl font-bold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 hover:opacity-95 active:scale-[0.98] mt-1.5",
										children: isLoading ? isBn ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating..." : isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${authMode === "register" ? "mt-2.5 pt-2" : "mt-3.5 pt-3"} border-t border-slate-200 dark:border-slate-800`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleVisitorLogin,
								className: `w-full py-2.5 px-3 rounded-2xl border shadow-2xs flex items-center justify-center gap-2 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer ${isVisitorModeEnabled ? "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700" : "bg-rose-50/70 dark:bg-slate-800/80 hover:bg-rose-100/70 text-slate-700 dark:text-slate-200 border-rose-200 dark:border-rose-900/60"}`,
								children: [
									isVisitorModeEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-[#E52E2E] shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-[#E52E2E] shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সরাসরি ভিজিটর হিসেবে দেখুন (লগইন ছাড়া)" : "Browse as Guest Visitor (No login needed)" }),
									!isVisitorModeEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#E52E2E] text-white shrink-0",
										children: isBn ? "বন্ধ" : "OFF"
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `px-4 sm:px-5 ${authMode === "register" ? "py-2" : "py-2.5"} flex items-center justify-around border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs shrink-0`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									const url = footerConfig.store.url || "#store";
									if (url.startsWith("tel:")) window.location.href = url;
									else if (url.startsWith("http")) window.open(url, "_blank");
									else if (url === "#store" || url === "#offer" || url === "#help") setActiveModal(url.replace("#", ""));
									else handleVisitorLogin();
								},
								className: "flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform",
									children: footerConfig.store.icon || "📍"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-700 dark:text-slate-300",
									children: lang === "bn" ? footerConfig.store.bn : footerConfig.store.en
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									const url = footerConfig.offer.url || "#offer";
									if (url.startsWith("tel:")) window.location.href = url;
									else if (url.startsWith("http")) window.open(url, "_blank");
									else if (url === "#offer" || url === "#store" || url === "#help") setActiveModal(url.replace("#", ""));
									else handleVisitorLogin();
								},
								className: "flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform",
									children: footerConfig.offer.icon || "🏷️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-700 dark:text-slate-300",
									children: lang === "bn" ? footerConfig.offer.bn : footerConfig.offer.en
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									const url = footerConfig.help.url || "#help";
									if (url.startsWith("tel:")) window.location.href = url;
									else if (url.startsWith("http")) window.open(url, "_blank");
									else if (url === "#help" || url === "#store" || url === "#offer") setActiveModal(url.replace("#", ""));
									else handleVisitorLogin();
								},
								className: "flex flex-col items-center gap-1 group active:scale-95 transition-transform cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-full border-2 border-[#E52E2E] text-[#E52E2E] flex items-center justify-center text-base bg-white/80 dark:bg-slate-800/80 shadow-xs group-hover:scale-105 transition-transform",
									children: footerConfig.help.icon || "❓"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-700 dark:text-slate-300",
									children: lang === "bn" ? footerConfig.help.bn : footerConfig.help.en
								})]
							})
						]
					}),
					activeModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `w-10 h-10 rounded-2xl flex items-center justify-center ${activeModal === "store" ? "bg-rose-50 dark:bg-rose-950/50 text-[#E52E2E]" : activeModal === "offer" ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600" : activeModal === "visitor_blocked" ? "bg-rose-50 dark:bg-rose-950/50 text-[#E52E2E]" : "bg-blue-50 dark:bg-blue-950/50 text-blue-600"}`,
											children: [
												activeModal === "store" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-5 h-5" }),
												activeModal === "offer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-5 h-5" }),
												activeModal === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-5 h-5" }),
												activeModal === "visitor_blocked" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-5 h-5" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
											children: [
												activeModal === "store" && (isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"),
												activeModal === "offer" && (isBn ? "চলমান স্পেশাল অফার" : "Special Offers"),
												activeModal === "help" && (isBn ? "কাস্টমার সাপোর্ট ও সাহায্য" : "Customer Support & Help"),
												activeModal === "visitor_blocked" && ((visitorDisabledTitle === null || visitorDisabledTitle === void 0 ? void 0 : visitorDisabledTitle.trim()) || (isBn ? "নতুন একাউন্ট তৈরি করুন" : "Create an Account"))
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400",
											children: [
												activeModal === "store" && (isBn ? "প্রধান শাখা ও কাস্টমার পয়েন্ট" : "Head Office & Customer Point"),
												activeModal === "offer" && (isBn ? "বর্তমান ডিসকাউন্ট প্যাকেজ" : "Active Discounts"),
												activeModal === "help" && (isBn ? "২৪/৭ সার্বক্ষণিক হেল্পলাইন" : "24/7 Dedicated Support"),
												activeModal === "visitor_blocked" && (isBn ? "সরাসরি ভিজিটর মোড বর্তমানে বন্ধ রয়েছে" : "Direct Visitor Mode is currently disabled")
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setActiveModal(null);
										},
										className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300",
									children: [
										activeModal === "store" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রধান অফিসের ঠিকানা" : "Head Office Address" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-700 dark:text-slate-200 pl-5 font-medium leading-relaxed",
														children: isBn ? "দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), হাজী আবেদ আলী মার্কেট, ইসলামপুর, জামালপুর" : "Duttapara Ananda Bazar (Tana Bridge), Haji Abed Ali Market, Islampur, Jamalpur"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "খোলা থাকার সময়সূচি" : "Operating Hours" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-600 dark:text-slate-300 pl-5",
														children: isBn ? "প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টা (শুক্রবার ও ছুটির দিনসহ খোলা)।" : "Everyday 9:00 AM - 9:00 PM (Open 7 days a week)."
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সরাসরি যোগাযোগ" : "Direct Contact" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-800 dark:text-slate-100 pl-5 font-bold text-sm tabular-nums",
														children: "01777877207"
													})]
												})
											]
										}),
										activeModal === "offer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2.5",
											children: banners && banners.filter((b) => b.isActive).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-3 max-h-72 overflow-y-auto pr-1",
												children: banners.filter((b) => b.isActive).map((banner) => {
													var _banner$linkUrl;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-2xl bg-white dark:bg-slate-800 border border-rose-200/80 dark:border-slate-700 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow",
														children: [banner.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "w-full h-28 relative overflow-hidden bg-slate-100 dark:bg-slate-700",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: banner.imageUrl,
																alt: banner.titleBn || "Banner",
																className: "w-full h-full object-cover"
															}), (banner.badgeBn || banner.badgeEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "absolute top-2 left-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E52E2E] text-white shadow-xs",
																	children: isBn ? banner.badgeBn : banner.badgeEn || banner.badgeBn
																})
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "p-3",
															children: [
																!banner.imageUrl && (banner.badgeBn || banner.badgeEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "flex items-center justify-between mb-1",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E52E2E] text-white",
																		children: isBn ? banner.badgeBn : banner.badgeEn || banner.badgeBn
																	})
																}),
																(banner.titleBn || banner.titleEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
																	className: "font-bold text-slate-900 dark:text-white text-sm",
																	children: isBn ? banner.titleBn : banner.titleEn
																}),
																(banner.subtitleBn || banner.subtitleEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed",
																	children: isBn ? banner.subtitleBn : banner.subtitleEn
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
																	href: ((_banner$linkUrl = banner.linkUrl) === null || _banner$linkUrl === void 0 ? void 0 : _banner$linkUrl.startsWith("tel:")) ? banner.linkUrl : "tel:01777877207",
																	className: "mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-[#E52E2E] dark:text-rose-300 text-xs font-bold transition-colors",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অফারটি নিতে যোগাযোগ করুন (01777877207)" : "Call to Claim (01777877207)" })]
																})
															]
														})]
													}, banner.id);
												})
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "py-6 text-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center mb-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-6 h-6" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "font-bold text-slate-800 dark:text-slate-200 text-sm mb-1",
														children: isBn ? "বর্তমানে কোনো নতুন স্পেশাল অফার নেই" : "No Active Offers Right Now"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-slate-500 dark:text-slate-400",
														children: isBn ? "নতুন ডিসকাউন্ট প্যাকেজ ও উৎসবের স্পেশাল অফার দ্রুতই এখানে আপডেট করা হবে।" : "New promotional offers and discounts will be available soon."
													})
												]
											})
										}),
										activeModal === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কাস্টমার কেয়ার হেল্পলাইন (২৪/৭)" : "Customer Helpline (24/7)" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-800 dark:text-slate-100 pl-5 font-bold text-sm tabular-nums",
														children: "01777877207"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হোয়াটসঅ্যাপ ও টেকনিক্যাল সাপোর্ট" : "WhatsApp & Technical Support" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-600 dark:text-slate-300 pl-5",
														children: isBn ? "ইন্টারনেট বা ক্যাবল সংযোগের যে কোনো সমস্যায় আমাদের টেকনিক্যাল টিম ২৪ ঘণ্টা প্রস্তুত রয়েছে।" : "Our technical support team is ready 24/7 for internet or cable issues."
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-base",
															children: "✉️"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অফিসিয়াল ইমেইল সাপোর্ট" : "Official Email Support" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-700 dark:text-slate-200 pl-5 font-semibold text-xs",
														children: "protashacablenetwork@gmail.com"
													})]
												})
											]
										}),
										activeModal === "visitor_blocked" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-slate-700 dark:text-slate-200",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold leading-relaxed text-xs sm:text-[13px]",
													children: (visitorDisabledMessage === null || visitorDisabledMessage === void 0 ? void 0 : visitorDisabledMessage.trim()) || (isBn ? "অ্যাডমিন বর্তমানে সরাসরি ভিজিটর মোড বন্ধ রেখেছেন। অ্যাপের তথ্য দেখতে ও সেবা ব্যবহার করতে অনুগ্রহ করে আপনার মোবাইল নাম্বার দিয়ে একটি নতুন একাউন্ট খুলুন অথবা লগইন করুন।" : "Direct Visitor Mode is currently turned off by the admin. Please create a new account with your mobile number or sign in to access the app.")
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/50 flex items-start gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-medium text-emerald-900 dark:text-emerald-200 leading-relaxed",
													children: isBn ? "নতুন একাউন্ট খুলতে মাত্র ৩০ সেকেন্ড সময় লাগবে — নাম, মোবাইল নাম্বার ও পিন দিলেই সরাসরি প্রবেশ করতে পারবেন।" : "Creating an account takes only 30 seconds — just enter your name, mobile number, and a PIN."
												})]
											})]
										})
									]
								}),
								activeModal === "visitor_blocked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setActiveModal(null);
											setAuthMode("register");
											setErrorMsg("");
											setSuccessMsg("");
											setCanForceAdminLogin(false);
										},
										className: "w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন একাউন্ট খুলুন" : "Create New Account" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setActiveModal(null);
											setAuthMode("login");
											setErrorMsg("");
										},
										className: "w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "আগে থেকেই একাউন্ট আছে? লগইন করুন" : "Already have an account? Sign In" })]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setActiveModal(null);
									},
									className: "w-full mt-4 py-3 rounded-2xl bg-[#E52E2E] hover:bg-[#D32F2F] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer",
									children: isBn ? "ঠিক আছে" : "OK"
								})
							]
						})
					})
				]
			})]
		})
	});
};
//#endregion
export { LoginView };
