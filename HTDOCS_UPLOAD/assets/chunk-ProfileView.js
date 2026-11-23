import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { E as Store, En as require_react, Et as Globe, Ft as EyeOff, Gt as Cloud, H as RefreshCw, Kt as CloudUpload, M as ShieldCheck, O as Sparkles, Pt as Eye, Qt as CircleAlert, Sn as ArrowLeft, T as Sun, X as Pencil, Zt as CircleCheck, _n as Bell, _t as KeyRound, d as Users, dt as Lock, en as ChevronRight, f as User, ft as LoaderCircle, ht as Layers, j as Shield, k as Smartphone, ln as Camera, lt as LogOut, n as X, rn as Check, tt as Moon, ut as LogIn, vn as BellRing, x as Trash2, xt as History, zt as Download } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { b as enableNetwork, o as getDoc, v as disableNetwork, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { o as translations } from "./chunk-formatters.js";
import { it as db, j as hasSubAdminPermission, r as getDeviceLabel, st as safeSetDoc, tt as sounds } from "./app.js";
import confetti_module_default from "./chunk-confetti.module.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
import { signInWithGoogleDrive } from "./chunk-googleDrive.js";
import { isFastingReminderEnabled, setFastingReminderEnabled } from "./chunk-prayerTimeService.js";
import { n as SUB_ADMIN_PERMISSION_ITEMS } from "./chunk-types.js";
import { CURRENT_APP_VERSION, applyAppUpdateAndReload, checkForAppUpdates, markVersionFeaturesAcknowledged } from "./chunk-appVersion.js";
//#region src/components/ProfileView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ProfileView = ({ user, lang, theme, adminAvatar, onToggleTheme, onLanguageChange, onOpenChangePin, onOpenRecycleBin, onOpenAuditLog, onOpenBannerManager, onOpenNotifications, onOpenUserManagement, onOpenServiceManager, onOpenPopupNoticeManager, onOpenDriveBackup, onLogout, onClose, onUpdateAdminProfile, onUpdateUserProfile, onBindMethods, onOpenLogin, onOpenFooterSettings, onUpdateChecked, onSubViewChange, isTabMode = false }) => {
	const t = translations[lang];
	const isBn = lang === "bn";
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const isSubAdmin = (user === null || user === void 0 ? void 0 : user.role) === "sub-admin";
	const isStaff = (user === null || user === void 0 ? void 0 : user.role) === "staff";
	const isRegisteredUser = (user === null || user === void 0 ? void 0 : user.role) === "user" || isSubAdmin || isStaff;
	const isLoggedIn = !!user && (isAdmin || isRegisteredUser);
	const [userName, setUserName] = (0, import_react.useState)((user === null || user === void 0 ? void 0 : user.name) || (isAdmin ? isBn ? "প্রত্যাশা অ্যাডমিন" : "Protyasha Admin" : isBn ? "সম্মানিত সদস্য" : "Valued Member"));
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)(() => (user === null || user === void 0 ? void 0 : user.avatarUrl) || adminAvatar || (typeof window !== "undefined" ? safeStorage.getItem("protyasha_admin_avatar") || "" : ""));
	const [isEditModalOpen, setIsEditModalOpen] = (0, import_react.useState)(false);
	const [editTab, setEditTab] = (0, import_react.useState)("info");
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	const [editAvatar, setEditAvatar] = (0, import_react.useState)("");
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [confirmPin, setConfirmPin] = (0, import_react.useState)("");
	const [showNewPin, setShowNewPin] = (0, import_react.useState)(false);
	const [showConfirmPin, setShowConfirmPin] = (0, import_react.useState)(false);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [editError, setEditError] = (0, import_react.useState)("");
	const [modalSuccessMsg, setModalSuccessMsg] = (0, import_react.useState)("");
	const [showSuccessToast, setShowSuccessToast] = (0, import_react.useState)(false);
	const [successToastMessage, setSuccessToastMessage] = (0, import_react.useState)("");
	const [fastingReminderEnabled, setFastingReminderState] = (0, import_react.useState)(() => isFastingReminderEnabled());
	const handleToggleFastingReminder = async (enabled) => {
		sounds.playTap();
		setFastingReminderState(enabled);
		setFastingReminderEnabled(enabled);
		if (enabled && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") try {
			await Notification.requestPermission();
		} catch {}
		setSuccessToastMessage(enabled ? isBn ? "সেহরি ও ইফতারের ১০ মিনিট আগের অটো রিমাইন্ডার চালু হয়েছে।" : "10-minute Sehri & Iftar reminder enabled." : isBn ? "সেহরি ও ইফতারের অটো রিমাইন্ডার বন্ধ করা হয়েছে।" : "Sehri & Iftar reminder turned off.");
		setShowSuccessToast(true);
		setTimeout(() => setShowSuccessToast(false), 3500);
	};
	const [offlineMode, setOfflineMode] = (0, import_react.useState)(() => {
		return safeStorage.getItem("protyasha_offline_mode") === "true";
	});
	const [isSyncing, setIsSyncing] = (0, import_react.useState)(false);
	const [isCheckingUpdate, setIsCheckingUpdate] = (0, import_react.useState)(false);
	const [updateResult, setUpdateResult] = (0, import_react.useState)(null);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = (0, import_react.useState)(false);
	const [isApplyingUpdate, setIsApplyingUpdate] = (0, import_react.useState)(false);
	const [adminNewVersion, setAdminNewVersion] = (0, import_react.useState)("2.6.4");
	const [adminNewFeatures, setAdminNewFeatures] = (0, import_react.useState)("");
	const [isPublishingUpdate, setIsPublishingUpdate] = (0, import_react.useState)(false);
	useSubViewBack(true, (isEditModalOpen ? 1 : 0) + (isUpdateModalOpen ? 1 : 0), () => {
		if (isUpdateModalOpen) setIsUpdateModalOpen(false);
		else if (isEditModalOpen) setIsEditModalOpen(false);
	}, onSubViewChange, "profileView");
	const handleCheckForUpdate = async () => {
		sounds.playTap();
		setIsCheckingUpdate(true);
		try {
			const res = await checkForAppUpdates();
			setUpdateResult(res);
			setIsUpdateModalOpen(true);
			if (onUpdateChecked) onUpdateChecked(res);
			if (res.status === "update_available") sounds.playSuccess();
			else if (res.status === "up_to_date") {
				sounds.playSuccess();
				markVersionFeaturesAcknowledged(res.releaseInfo);
			}
		} catch (err) {
			console.error("Update check failed:", err);
		} finally {
			setIsCheckingUpdate(false);
		}
	};
	const handleToggleOfflineMode = async (val) => {
		sounds.playTap();
		setOfflineMode(val);
		safeStorage.setItem("protyasha_offline_mode", String(val));
		try {
			if (val) {
				await disableNetwork(db);
				setSuccessToastMessage(isBn ? "অফলাইন মোড চালু হয়েছে। অ্যাপ এখন লোকাল ক্যাশ থেকে চলবে।" : "Offline mode enabled. App running from local cache.");
			} else {
				await enableNetwork(db);
				setSuccessToastMessage(isBn ? "অনলাইন মোড চালু হয়েছে। রিয়েলটাইম সিংক সক্রিয়।" : "Online mode enabled. Real-time sync active.");
			}
			setShowSuccessToast(true);
			setTimeout(() => setShowSuccessToast(false), 4e3);
		} catch (err) {
			console.error("Error toggling offline mode:", err);
		}
	};
	const handleManualSyncNow = async () => {
		sounds.playTap();
		setIsSyncing(true);
		try {
			await enableNetwork(db);
			setOfflineMode(false);
			safeStorage.setItem("protyasha_offline_mode", "false");
			sounds.playSuccess();
			setSuccessToastMessage(isBn ? "রিয়েলটাইম ক্লাউড ডেটা সফলভাবে সিংক হয়েছে!" : "Cloud data successfully synchronized!");
			setShowSuccessToast(true);
			setTimeout(() => setShowSuccessToast(false), 4e3);
		} catch (err) {
			setSuccessToastMessage(isBn ? "সিংক করতে নেটওয়ার্ক কানেকশন প্রয়োজন" : "Network connection required to sync");
			setShowSuccessToast(true);
		} finally {
			setIsSyncing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (user === null || user === void 0 ? void 0 : user.name) setUserName(user.name);
		if (user === null || user === void 0 ? void 0 : user.avatarUrl) setAvatarUrl(user.avatarUrl);
		else if (adminAvatar) setAvatarUrl(adminAvatar);
	}, [
		user === null || user === void 0 ? void 0 : user.name,
		user === null || user === void 0 ? void 0 : user.avatarUrl,
		adminAvatar
	]);
	const handleOpenEditModal = (initialTab = "info") => {
		sounds.playTap();
		setEditTab(initialTab);
		setEditName((user === null || user === void 0 ? void 0 : user.name) || userName);
		setEditPhone((user === null || user === void 0 ? void 0 : user.phone) || "");
		setEditAvatar(avatarUrl);
		setNewPin("");
		setConfirmPin("");
		setShowNewPin(false);
		setShowConfirmPin(false);
		setEditError("");
		setModalSuccessMsg("");
		setIsEditModalOpen(true);
	};
	const handleImageUpload = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		e.target.value = "";
		if (!file) return;
		try {
			setEditError("");
			const compressedDataUrl = await compressImage(file, 400, 400, .85);
			if (!compressedDataUrl || !compressedDataUrl.startsWith("data:image/")) throw new Error("Invalid compressed image");
			setEditAvatar(compressedDataUrl);
			sounds.playSuccess();
		} catch (err) {
			console.error("Error uploading avatar:", err);
			setEditError(isBn ? "ছবি প্রক্রিয়াকরণ করা সম্ভব হয়নি" : "Failed to process image");
		}
	};
	const handleSavePersonalInfo = async (e) => {
		if (e) e.preventDefault();
		if (!editName.trim()) {
			sounds.playTap();
			setEditError(isBn ? "দয়া করে আপনার পূর্ণ নাম লিখুন" : "Please enter your full name");
			return;
		}
		if (!editPhone.trim() || editPhone.trim().length < 10) {
			sounds.playTap();
			setEditError(isBn ? "সঠিক মোবাইল নাম্বার দিন (কমপক্ষে ১১ ডিজিট)" : "Enter valid phone number (at least 11 digits)");
			return;
		}
		setIsSaving(true);
		setEditError("");
		setModalSuccessMsg("");
		sounds.playTap();
		try {
			if (onUpdateUserProfile) {
				const result = await onUpdateUserProfile({
					name: editName.trim(),
					phone: editPhone.trim(),
					avatarUrl: editAvatar
				});
				if (result && !result.success) {
					setEditError(result.message || (isBn ? "প্রোফাইল আপডেট ব্যর্থ হয়েছে" : "Profile update failed"));
					setIsSaving(false);
					return;
				}
			} else if (isAdmin && onUpdateAdminProfile) onUpdateAdminProfile(editName.trim(), editAvatar);
			setUserName(editName.trim());
			setAvatarUrl(editAvatar);
			setIsSaving(false);
			sounds.playSuccess();
			try {
				confetti_module_default({
					particleCount: 40,
					spread: 60,
					origin: { y: .5 }
				});
			} catch {}
			const successMsg = isBn ? "আপনার নাম, ছবি ও মোবাইল নাম্বার সফলভাবে সংরক্ষিত হয়েছে!" : "Name, photo and mobile number updated successfully!";
			setModalSuccessMsg(successMsg);
			setSuccessToastMessage(successMsg);
			setShowSuccessToast(true);
			setTimeout(() => {
				setIsEditModalOpen(false);
			}, 1400);
			setTimeout(() => setShowSuccessToast(false), 5e3);
		} catch (err) {
			console.error("Error saving profile info:", err);
			setIsSaving(false);
			setEditError(err.message || (isBn ? "সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to save changes"));
		}
	};
	const handleSaveSecurityPin = async (e) => {
		if (e) e.preventDefault();
		if (!newPin.trim()) {
			sounds.playTap();
			setEditError(isBn ? "দয়া করে নতুন পাসওয়ার্ড বা পিন লিখুন" : "Please enter your new PIN");
			return;
		}
		if (newPin.trim().length < 4) {
			sounds.playTap();
			setEditError(isBn ? "পাসওয়ার্ড বা পিন কমপক্ষে ৪ সংখ্যার হতে হবে" : "PIN must be at least 4 digits");
			return;
		}
		if (newPin.trim() !== confirmPin.trim()) {
			sounds.playTap();
			setEditError(isBn ? "নতুন পিন এবং নিশ্চিতকরণ পিন মিলছে না!" : "New PIN and confirm PIN do not match!");
			return;
		}
		setIsSaving(true);
		setEditError("");
		setModalSuccessMsg("");
		sounds.playTap();
		try {
			if (onUpdateUserProfile) {
				const result = await onUpdateUserProfile({
					name: userName,
					phone: (user === null || user === void 0 ? void 0 : user.phone) || editPhone.trim() || "01884542812",
					pin: newPin.trim(),
					avatarUrl
				});
				if (result && !result.success) {
					setEditError(result.message || (isBn ? "পিন পরিবর্তন ব্যর্থ হয়েছে" : "PIN update failed"));
					setIsSaving(false);
					return;
				}
			}
			setIsSaving(false);
			sounds.playSuccess();
			try {
				confetti_module_default({
					particleCount: 50,
					spread: 70,
					origin: { y: .5 }
				});
			} catch {}
			const successMsg = isBn ? "আপনার নতুন পাসওয়ার্ড / পিন সফলভাবে পরিবর্তন ও সংরক্ষিত হয়েছে!" : "Your login PIN has been updated successfully!";
			setModalSuccessMsg(successMsg);
			setSuccessToastMessage(successMsg);
			setShowSuccessToast(true);
			setNewPin("");
			setConfirmPin("");
			setTimeout(() => {
				setIsEditModalOpen(false);
			}, 1400);
			setTimeout(() => setShowSuccessToast(false), 5e3);
		} catch (err) {
			console.error("Error saving security pin:", err);
			setIsSaving(false);
			setEditError(err.message || (isBn ? "পিন সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to update PIN"));
		}
	};
	const displayAvatar = avatarUrl && !avatarUrl.startsWith("/uploads/") ? avatarUrl : avatarUrl.startsWith("data:image/") ? avatarUrl : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: isTabMode ? "w-full min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col select-none pb-24" : "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							onClose();
						},
						className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all",
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: isBn ? "মেনু ও প্রোফাইল" : "Menu & Profile"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						sounds.playTap();
						onToggleTheme();
					},
					className: "w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all",
					title: isBn ? "থিম পরিবর্তন" : "Toggle Theme",
					children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-slate-600" })
				})]
			}),
			showSuccessToast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold",
						children: isBn ? "প্রোফাইল আপডেট সফল!" : "Profile Updated Successfully!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-white/90 font-medium",
						children: successToastMessage
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowSuccessToast(false),
					className: "w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-white" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28",
				children: [
					isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-16 h-16 rounded-full p-0.5 shadow-md overflow-hidden flex items-center justify-center ${isAdmin ? "bg-gradient-to-tr from-[#D32F2F] to-[#FF9800] shadow-rose-500/20" : "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20"}`,
										children: displayAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: displayAvatar,
											alt: "Profile",
											className: "w-full h-full object-cover rounded-full"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-[#E52E2E]",
											children: userName.slice(0, 1) || (isAdmin ? isBn ? "প্র" : "P" : "U")
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOpenEditModal("info"),
										className: "absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E52E2E] text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 active:scale-90 transition-transform cursor-pointer",
										title: isBn ? "ছবি পরিবর্তন" : "Edit photo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-extrabold text-slate-900 dark:text-white truncate",
												children: userName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleOpenEditModal("info"),
												className: "p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#E52E2E] dark:hover:text-rose-400 active:scale-95 transition-all shrink-0 cursor-pointer",
												title: isBn ? "প্রোফাইল পরিবর্তন" : "Edit Profile",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5 flex items-center gap-1 font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (user === null || user === void 0 ? void 0 : user.phone) || "০১৭৭৭৮৭৭২০৭" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 mt-1.5 flex-wrap",
											children: [isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ভেরিফায়েড অ্যাডমিন" : "Verified Admin" })]
											}) : isSubAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ভেরিফায়েড সাব-অ্যাডমিন" : "Verified Sub-Admin" })]
											}) : isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200/60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ (শুধু হাজিরা)" : "Staff (Attendance Only)" })]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নিবন্ধিত সম্মানিত সদস্য (শুধু দেখা)" : "Registered Member (Read-Only)" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-2.5 h-2.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `১ ডিভাইস (${getDeviceLabel()})` : `1-Device (${getDeviceLabel()})` })]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "একাউন্ট বাইন্ডিং" : "Account Binding" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-2 rounded-xl border flex flex-col gap-1 ${(user === null || user === void 0 ? void 0 : user.phone) ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-900/10" : "bg-rose-50/30 border-rose-100 dark:bg-rose-900/10"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: `w-3 h-3 ${(user === null || user === void 0 ? void 0 : user.phone) ? "text-emerald-500" : "text-rose-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold text-slate-500",
												children: isBn ? "মোবাইল" : "Phone"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-black truncate",
												children: (user === null || user === void 0 ? void 0 : user.phone) || "..."
											}), (user === null || user === void 0 ? void 0 : user.phone) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3 h-3 text-rose-500" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-2 rounded-xl border flex flex-col gap-1 ${(user === null || user === void 0 ? void 0 : user.gmail) ? "bg-blue-50/30 border-blue-100 dark:bg-blue-900/10" : "bg-amber-50/30 border-amber-100 dark:bg-amber-900/10"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: `w-3 h-3 ${(user === null || user === void 0 ? void 0 : user.gmail) ? "text-blue-500" : "text-amber-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold text-slate-500",
												children: isBn ? "জিমেইল" : "Gmail"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-black truncate max-w-[60px]",
												children: (user === null || user === void 0 ? void 0 : user.gmail) || (isBn ? "সংযুক্ত নেই" : "None")
											}), (user === null || user === void 0 ? void 0 : user.gmail) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 text-blue-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setEditTab("binding");
													setIsEditModalOpen(true);
												},
												className: "px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-bold",
												children: "LINK"
											})]
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setEditTab("info");
										setIsEditModalOpen(true);
									},
									className: "w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-orange-500/20 text-[#E52E2E] dark:text-rose-400 border border-rose-200/70 dark:border-rose-900/50 text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রোফাইল তথ্য ও পিন পরিবর্তন করুন" : "Edit Profile Info & PIN" })]
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-rose-400 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl",
									children: "👤"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-slate-900 dark:text-white",
								children: isBn ? "সম্মানিত ভিজিটর" : "Visitor Mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400",
								children: isBn ? "সকল ফিচারের জন্য লগইন বা রেজিস্ট্রেশন করুন" : "Login or register for full features"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								if (onOpenLogin) onOpenLogin();
							},
							className: "px-3.5 py-2 rounded-xl bg-[#E52E2E] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লগইন" : "Login" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-5 h-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-slate-800 dark:text-slate-100",
										children: t.language
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: isBn ? "ভাষা পরিবর্তন করুন (বাংলা/English)" : "Switch app language"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											sounds.playTap();
											onLanguageChange("bn");
										},
										className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === "bn" ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
										children: "বাংলা"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											sounds.playTap();
											onLanguageChange("en");
										},
										className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === "en" ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
										children: "ENG"
									})]
								})]
							}),
							isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 bg-gradient-to-r from-teal-50/70 to-emerald-50/40 dark:from-teal-950/20 dark:to-emerald-950/10 space-y-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4.5 h-4.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-900 dark:text-white",
											children: isBn ? "স্টাফ হাজিরা অ্যাকাউন্ট" : "Staff Attendance Account"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-600 dark:text-slate-400",
											children: isBn ? "আপনি শুধুমাত্র স্টাফ হাজিরা অপশনে নিজের হাজিরা ও ছুটি দিতে এবং পিন পরিবর্তন করতে পারবেন।" : "You can mark your own attendance & leave and update your own PIN."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200 shrink-0",
										children: isBn ? "হাজিরা" : "Attendance"
									})]
								})
							}),
							isSubAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4.5 h-4.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-900 dark:text-white",
											children: isBn ? "সাব-অ্যাডমিন অনুমোদিত সেবাসমূহ" : "Sub-Admin Permitted Services"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-600 dark:text-slate-400",
											children: isBn ? "মেইন অ্যাডমিনের নির্ধারিত পেইজ ও সেবার অনুমতি" : "Services & pages enabled by Main Admin"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200",
										children: isBn ? "সক্রিয়" : "Active"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1",
									children: SUB_ADMIN_PERMISSION_ITEMS.map((item) => {
										const allowed = hasSubAdminPermission(user, item.key);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex items-center gap-1.5 ${allowed ? "text-slate-800 dark:text-slate-200 font-semibold" : "text-slate-400 dark:text-slate-500 line-through"}`,
											children: [allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? item.labelBn : item.labelEn })]
										}, item.key);
									})
								})]
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										if (onOpenDriveBackup) onOpenDriveBackup();
									},
									className: "hidden md:flex w-full p-4 items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-5 h-5 text-white" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সেন্ট্রালাইজড ব্যাকআপ ও রিস্টোর" : "Centralized Backup & Restore" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
												children: isBn ? "গুগল ড্রাইভ" : "Drive"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "ফায়ারবেস ডেটাবেসের মাস্টার কপি ড্রাইভে সেভ ও রিস্টোর" : "Save & restore master database snapshot to Google Drive"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										if (onOpenUserManagement) onOpenUserManagement();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ব্যবহারকারী ও একাউন্ট নিয়ন্ত্রণ" : "User & Account Management" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
												children: isBn ? "এডমিন" : "Admin"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "সকল নিবন্ধিত ইউজার দেখুন, এডিট ও নিয়ন্ত্রণ করুন" : "View, edit and manage registered users"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										onOpenNotifications();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "নোটিফিকেশন ও বার্তা নিয়ন্ত্রণ" : "Notifications & Broadcast"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "নতুন বার্তা পাঠান ও পরিচালনা" : "Send notifications to customers"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										onOpenPopupNoticeManager === null || onOpenPopupNoticeManager === void 0 || onOpenPopupNoticeManager();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পপ-আপ নোটিশ ও ইউজার সম্মতি" : "Popup Notice & User Consent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
												children: isBn ? "নতুন" : "New"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "ইউজারদের অ্যাপে পপ-আপ নোটিশ দিন ও সম্মতি (Acknowledgement) দেখুন" : "Publish popup notices and track user acknowledgements"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										onOpenBannerManager();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "বিজ্ঞাপন ব্যানার কন্ট্রোল (ব্রডব্যান্ড ইন্টারনেট ব্যানার)" : "Banner Ads Control"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "মেইন পেইজের অফার ব্যানার যোগ/পরিবর্তন" : "Manage promo carousel banners"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										if (onOpenFooterSettings) onOpenFooterSettings();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "স্টোর, অফার ও সাহায্য তথ্য সম্পাদনা (ফুটার)" : "Edit Store, Offer & Help Info"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "সাইটের পেজ, ক্যাটাগরি ও অ্যাকশন লিংক পরিবর্তন করুন" : "Customize login page store, offer & help info"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										onOpenRecycleBin();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "রিসাইকেল বিন" : "Recycle Bin"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "ডিলিট হওয়া এন্ট্রি পুনরুদ্ধার" : "Restore deleted transactions"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										if (onOpenServiceManager) onOpenServiceManager();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer border-b border-slate-100 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "অ্যাপ সেবা ও নোটিশ কন্ট্রোল" : "App Services & Notice Control"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "সেবা চালু/বন্ধ এবং কাস্টম নোটিশ পপ আপ সেট করুন" : "Enable/disable services and custom notices"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										sounds.playTap();
										onOpenAuditLog();
									},
									className: "w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100",
											children: isBn ? "অডিট লগ" : "Audit Log"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "সকল এডমিন কার্যক্রমের হিস্ট্রি" : "Track admin activity records"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400" })]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 flex items-center justify-between bg-gradient-to-r from-amber-50/40 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-10 h-10 rounded-2xl flex items-center justify-center ${offlineMode ? "bg-amber-500 text-white shadow-md" : "bg-emerald-500 text-white shadow-md"}`,
										children: offlineMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-5 h-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অফলাইন মোড ও অটো-সিংক" : "Offline Mode & Auto-Sync" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10px] font-extrabold px-2 py-0.5 rounded-full ${offlineMode ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"}`,
											children: offlineMode ? isBn ? "অফলাইন" : "Offline" : isBn ? "অনলাইন" : "Online"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: offlineMode ? isBn ? "লোকাল ক্যাশ থেকে চলছে (নেট সংযোগ ছাড়া কাজ করুন)" : "Running offline from local cache" : isBn ? "নেট সংযোগ পেলেই রিয়েল ডেটা সিংক হবে" : "Auto-syncing real data when connected"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [offlineMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleManualSyncNow,
										disabled: isSyncing,
										className: "px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold active:scale-95 transition-all flex items-center gap-1 shadow-sm",
										children: [isSyncing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সিংক" : "Sync" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleToggleOfflineMode(!offlineMode),
										className: `w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${offlineMode ? "bg-amber-500" : "bg-emerald-500"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-5 h-5 rounded-full bg-white shadow-md transition-transform ${offlineMode ? "translate-x-0" : "translate-x-5"}` })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/40 to-teal-50/30 dark:from-emerald-950/15 dark:to-teal-950/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${fastingReminderEnabled ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সেহরি ও ইফতার রিমাইন্ডার" : "Sehri & Iftar Reminder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-extrabold px-2 py-0.5 rounded-full ${fastingReminderEnabled ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`,
												children: fastingReminderEnabled ? isBn ? "চালু" : "ON" : isBn ? "বন্ধ" : "OFF"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isBn ? "সেহরি শেষ ও ইফতারের ১০ মিনিট আগে স্বয়ংক্রিয় নোটিফিকেশন পাঠাবে" : "Auto-notify 10 minutes before Sehri ends and Iftar"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleToggleFastingReminder(!fastingReminderEnabled),
									"aria-label": isBn ? "সেহরি ও ইফতার রিমাইন্ডার চালু বা বন্ধ করুন" : "Toggle Sehri & Iftar reminder",
									className: `w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${fastingReminderEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-5 h-5 rounded-full bg-white shadow-md transition-transform ${fastingReminderEnabled ? "translate-x-5" : "translate-x-0"}` })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleCheckForUpdate,
								disabled: isCheckingUpdate,
								className: "w-full p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer bg-gradient-to-r from-sky-50/40 to-indigo-50/30 dark:from-sky-950/15 dark:to-indigo-950/10 disabled:opacity-75",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-5 h-5 ${isCheckingUpdate ? "animate-spin" : ""}` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "চেক ফর আপডেট" : "Check for Update" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 font-mono",
													children: ["v", CURRENT_APP_VERSION]
												}),
												(updateResult === null || updateResult === void 0 ? void 0 : updateResult.status) === "update_available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
													children: isBn ? "নতুন আপডেট!" : "Update Ready"
												}),
												(updateResult === null || updateResult === void 0 ? void 0 : updateResult.status) === "up_to_date" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
													children: isBn ? "সর্বশেষ" : "Latest"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400",
											children: isCheckingUpdate ? isBn ? "সর্বশেষ ভার্সন যাচাই করা হচ্ছে..." : "Checking for latest version..." : isBn ? "অ্যাপের বর্তমান ভার্সন ও নতুন ফিচার যাচাই করুন" : "Verify latest version and view new features"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 text-slate-400 shrink-0" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onLogout();
							},
							className: "w-full py-3.5 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 hover:opacity-95 active:scale-98 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লগআউট" : "Logout" })]
						})
					})
				]
			}),
			isEditModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: isBn ? "প্রোফাইল সেটিংস ও সম্পাদনা" : "Profile Settings & Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400",
									children: isBn ? "নিচের ২ টি অপশন থেকে নির্বাচন করুন" : "Select one of the 2 options below"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsEditModalOpen(false),
								className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-5 pt-3 pb-2 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setEditTab("info");
											setEditError("");
											setModalSuccessMsg("");
										},
										className: `py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${editTab === "info" ? "bg-[#E52E2E] text-white shadow-md shadow-rose-600/30" : "text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isBn ? "১. প্রোফাইল" : "1. Profile"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setEditTab("security");
											setEditError("");
											setModalSuccessMsg("");
										},
										className: `py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${editTab === "security" ? "bg-[#E52E2E] text-white shadow-md shadow-rose-600/30" : "text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isBn ? "২. পিন" : "2. PIN"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setEditTab("binding");
											setEditError("");
											setModalSuccessMsg("");
										},
										className: `py-2 px-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${editTab === "binding" ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-600 dark:text-slate-300"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isBn ? "৩. বাইন্ডিং" : "3. Binding"
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 space-y-4 overflow-y-auto flex-1",
							children: [
								editError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in shake duration-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editError })]
								}),
								modalSuccessMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold animate-in zoom-in-95 duration-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: modalSuccessMsg })]
								}),
								editTab === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSavePersonalInfo,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center justify-center pb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative group",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 shadow-lg overflow-hidden flex items-center justify-center",
													children: editAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: editAvatar,
														alt: "Avatar preview",
														className: "w-full h-full object-cover rounded-full"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-[#E52E2E]",
														children: editName.slice(0, 1) || "👤"
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-6 h-6 mb-0.5" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold",
															children: isBn ? "ছবি পরিবর্তন" : "Change"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "file",
															accept: "image/*",
															onChange: handleImageUpload,
															className: "hidden"
														})
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "mt-2 text-xs font-bold text-[#E52E2E] dark:text-rose-400 flex items-center gap-1.5 cursor-pointer hover:underline",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন ছবি আপলোড করুন" : "Upload New Photo" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/*",
														onChange: handleImageUpload,
														className: "hidden"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
											children: isBn ? "পূর্ণ নাম (সদস্য বা এডমিন নাম)" : "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: editName,
												onChange: (e) => setEditName(e.target.value),
												placeholder: isBn ? "যেমন: মো: রিয়াদ মিয়া" : "e.g. John Doe",
												className: "w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-medium",
												required: true
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
												children: isBn ? "মোবাইল নাম্বার" : "Mobile Number"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "tel",
													inputMode: "numeric",
													pattern: "[0-9]*",
													autoComplete: "off",
													autoCorrect: "off",
													autoCapitalize: "off",
													spellCheck: false,
													"data-lpignore": "true",
													"data-1password-type": "off",
													value: editPhone,
													onChange: (e) => setEditPhone(e.target.value),
													placeholder: "01XXXXXXXXX",
													className: "w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono",
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-400 mt-1",
												children: isBn ? "লগইন করার জন্য আপনার এই মোবাইল নাম্বারটি ব্যবহার করা হবে" : "This phone number is used for logging into your account"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2.5 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setIsEditModalOpen(false),
												className: "flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer",
												children: isBn ? "বাতিল" : "Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												disabled: isSaving,
												className: "flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50",
												children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "তথ্য সংরক্ষণ করুন" : "Save Personal Info" })] })
											})]
										})
									]
								}),
								editTab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSaveSecurityPin,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-indigo-900 dark:text-indigo-200",
												children: isBn ? "লগইন সিকিউরিটি ও পিন কোড" : "Secure Login PIN"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5 leading-relaxed",
												children: isBn ? "একাউন্টের নিরাপত্তা নিশ্চিত করতে ৪ বা ততোধিক সংখ্যার নতুন পিন কোড লিখুন এবং নিশ্চিত করুন।" : "Set a new secure 4+ digit PIN to protect your account."
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-slate-600 dark:text-slate-400",
												children: isBn ? "যে একাউন্টের পিন পরিবর্তন হচ্ছে:" : "Account ID:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold font-mono text-slate-900 dark:text-white",
												children: (user === null || user === void 0 ? void 0 : user.phone) || "০১৭৭৭৮৭৭২০৭"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
												children: isBn ? "নতুন পাসওয়ার্ড বা পিন কোড *" : "New PIN Code *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "tel",
														inputMode: "numeric",
														pattern: "[0-9]*",
														autoComplete: "off",
														autoCorrect: "off",
														autoCapitalize: "off",
														spellCheck: false,
														"data-lpignore": "true",
														"data-1password-type": "off",
														style: { WebkitTextSecurity: showNewPin ? "none" : "disc" },
														value: newPin,
														onChange: (e) => setNewPin(e.target.value),
														placeholder: isBn ? "যেমন: 1234 বা 12588" : "e.g. 1234",
														className: "w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono tracking-widest",
														required: true,
														minLength: 4
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setShowNewPin(!showNewPin),
														className: "absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
														children: showNewPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-400 mt-1",
												children: isBn ? "কমপক্ষে ৪ সংখ্যার গোপনীয় পিন দিন" : "Minimum 4 digits required"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
												children: isBn ? "নতুন পিন পুনরায় লিখুন (নিশ্চিতকরণ) *" : "Confirm New PIN *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "tel",
														inputMode: "numeric",
														pattern: "[0-9]*",
														autoComplete: "off",
														autoCorrect: "off",
														autoCapitalize: "off",
														spellCheck: false,
														"data-lpignore": "true",
														"data-1password-type": "off",
														style: { WebkitTextSecurity: showConfirmPin ? "none" : "disc" },
														value: confirmPin,
														onChange: (e) => setConfirmPin(e.target.value),
														placeholder: isBn ? "পুনরায় নতুন পিনটি লিখুন" : "Re-type new PIN",
														className: "w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] font-mono tracking-widest",
														required: true,
														minLength: 4
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setShowConfirmPin(!showConfirmPin),
														className: "absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
														children: showConfirmPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
													})
												]
											}),
											newPin && confirmPin && newPin !== confirmPin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-rose-500 font-bold mt-1",
												children: isBn ? "পিন দুটি মিলছে না!" : "PINs do not match!"
											}),
											newPin && confirmPin && newPin === confirmPin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পিন মিলেছে" : "PIN matches" })]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2.5 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setIsEditModalOpen(false),
												className: "flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer",
												children: isBn ? "বাতিল" : "Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												disabled: isSaving,
												className: "flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50",
												children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সংরক্ষণ হচ্ছে..." : "Updating..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন পিন সংরক্ষণ করুন" : "Save New PIN" })] })
											})]
										})
									]
								}),
								editTab === "binding" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-blue-900 dark:text-blue-200",
												children: isBn ? "একাউন্ট বাইন্ডিং ও রিকভারি" : "Account Binding & Recovery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-1 leading-relaxed",
												children: isBn ? "আপনার একাউন্টের সাথে জিমেইল এবং মোবাইল নাম্বার বাইন্ড (সংযুক্ত) করে রাখুন। এতে মোবাইল হারালে বা অ্যাপ ডিলেট হলেও ডাটা রিকভারি সহজ হবে।" : "Bind your Gmail and Mobile number to your account for easy data recovery across devices."
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-9 h-9 rounded-xl flex items-center justify-center ${(user === null || user === void 0 ? void 0 : user.phone) ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-slate-900 dark:text-white",
														children: isBn ? "মোবাইল নাম্বার" : "Mobile Phone"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-slate-500 dark:text-slate-400 font-mono",
														children: (user === null || user === void 0 ? void 0 : user.phone) || (isBn ? "সংযুক্ত নেই" : "Not Linked")
													})] })]
												}), (user === null || user === void 0 ? void 0 : user.phone) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-400",
														children: isBn ? "সংযুক্ত" : "Bound"
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold active:scale-95 transition-all",
													children: isBn ? "সংযুক্ত করুন" : "Bind Phone"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-9 h-9 rounded-xl flex items-center justify-center ${(user === null || user === void 0 ? void 0 : user.gmail) ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-5 h-5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-slate-900 dark:text-white",
														children: isBn ? "গুগল (জিমেইল)" : "Google (Gmail)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[120px]",
														children: (user === null || user === void 0 ? void 0 : user.gmail) || (isBn ? "সংযুক্ত নেই" : "Not Linked")
													})] })]
												}), (user === null || user === void 0 ? void 0 : user.gmail) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col items-end gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: async () => {
															try {
																setIsSaving(true);
																const result = await signInWithGoogleDrive();
																if (result.user.email && onBindMethods) {
																	await onBindMethods({ gmail: result.user.email });
																	setModalSuccessMsg(isBn ? `জিমেইল সফলভাবে পরিবর্তন করা হয়েছে (${result.user.email})` : `Gmail changed to ${result.user.email}`);
																	sounds.playSuccess();
																}
															} catch (err) {
																setEditError(err.message || (isBn ? "জিমেইল সংযোগ ব্যর্থ হয়েছে" : "Gmail linking failed"));
															} finally {
																setIsSaving(false);
															}
														},
														className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900/60 cursor-pointer active:scale-95 transition-all text-left shadow-2xs",
														title: isBn ? "অন্য জিমেইল পরিবর্তন করতে ক্লিক করুন" : "Click to change Gmail account",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] font-bold text-emerald-700 dark:text-emerald-400",
																children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টালে সংযুক্ত" : "Linked to Protyasha Digital Portal"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-2.5 h-2.5 text-emerald-600" })
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[9px] text-slate-500 font-mono truncate max-w-[150px]",
														children: user.gmail
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: async () => {
														try {
															setIsSaving(true);
															const result = await signInWithGoogleDrive();
															if (result.user.email && onBindMethods) {
																await onBindMethods({ gmail: result.user.email });
																setModalSuccessMsg(isBn ? "জিমেইল সফলভাবে সংযুক্ত হয়েছে!" : "Gmail linked successfully!");
																sounds.playSuccess();
															}
														} catch (err) {
															setEditError(err.message || (isBn ? "জিমেইল সংযোগ ব্যর্থ হয়েছে" : "Gmail linking failed"));
														} finally {
															setIsSaving(false);
														}
													},
													disabled: isSaving,
													className: "px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50",
													children: [isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কানেক্ট জিমেইল" : "Connect Gmail" })]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setIsEditModalOpen(false),
												className: "w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors",
												children: isBn ? "বন্ধ করুন" : "Close Settings"
											})
										})
									]
								})
							]
						})
					]
				})
			}),
			isUpdateModalOpen && updateResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${updateResult.status === "update_available" ? "bg-gradient-to-tr from-rose-500 to-amber-500" : updateResult.status === "offline" ? "bg-amber-500" : "bg-gradient-to-tr from-emerald-500 to-teal-600"}`,
									children: updateResult.status === "update_available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-5 h-5" }) : updateResult.status === "offline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-extrabold text-slate-900 dark:text-white",
									children: isBn ? "অ্যাপ আপডেট ও ভার্সন তথ্য" : "App Update & Version Info"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400 font-mono",
									children: [isBn ? `বর্তমান ভার্সন: v${updateResult.currentVersion}` : `Current: v${updateResult.currentVersion}`, updateResult.latestVersion !== updateResult.currentVersion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" → v", updateResult.latestVersion] })]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									markVersionFeaturesAcknowledged(updateResult.releaseInfo);
									setIsUpdateModalOpen(false);
								},
								className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 space-y-3.5 overflow-y-auto",
							children: [
								isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/65 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-extrabold text-amber-900 dark:text-amber-200",
												children: isBn ? "অ্যাডমিন ইন-অ্যাপ আপডেট প্রকাশ প্যানেল" : "Admin In-App Update Publishing Panel"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: isBn ? "নতুন ভার্সন নম্বর (যেমন: 2.6.4)" : "New Version (e.g. 2.6.4)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: adminNewVersion,
											onChange: (e) => setAdminNewVersion(e.target.value),
											placeholder: "2.6.4",
											className: "w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: isBn ? "আপডেটের বিবরণ / ফিচারসমূহ (প্রতি লাইনে একটি)" : "Release Features (one per line)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 2,
											value: adminNewFeatures,
											onChange: (e) => setAdminNewFeatures(e.target.value),
											placeholder: isBn ? "নতুন ফিচার, স্পিড অপ্টিমাইজেশন ও বাগ ফিক্স..." : "New features, speed optimizations & bug fixes...",
											className: "w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: isBn ? "আপডেট জিপ ফাইল বা কোড প্যাকেজ (ঐচ্ছিক .zip)" : "Update ZIP File or Code Package (optional .zip)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: ".zip,.json",
											onChange: (e) => {
												var _e$target$files2;
												const file = (_e$target$files2 = e.target.files) === null || _e$target$files2 === void 0 ? void 0 : _e$target$files2[0];
												if (file) {
													setSuccessToastMessage(isBn ? `জিপ ফাইল সিলেক্ট হয়েছে: ${file.name}` : `ZIP file selected: ${file.name}`);
													setShowSuccessToast(true);
												}
											},
											className: "w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 dark:file:bg-amber-900 dark:file:text-amber-200 cursor-pointer"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isPublishingUpdate,
											onClick: async () => {
												if (!adminNewVersion.trim()) {
													setSuccessToastMessage(isBn ? "দয়া করে নতুন ভার্সন নম্বর লিখুন" : "Please enter new version number");
													setShowSuccessToast(true);
													return;
												}
												setIsPublishingUpdate(true);
												sounds.playTap();
												try {
													var _bSnap$data;
													const newBuild = ((updateResult === null || updateResult === void 0 ? void 0 : updateResult.latestBuildNumber) || 263) + 1;
													const releaseData = {
														version: adminNewVersion.trim(),
														buildNumber: newBuild,
														releaseDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
														titleBn: isBn ? "নতুন ইন-অ্যাপ আপডেট ও ফিচারসমূহ" : "New In-App Update & Features",
														titleEn: "New In-App Update & Features",
														featuresBn: adminNewFeatures.trim() ? adminNewFeatures.split("\n").filter(Boolean) : ["সকল ইউজার ও এডমিন প্যানেলের জন্য নতুন আপডেট ও সিকিউরিটি প্যাচ।"],
														featuresEn: ["New update & security patch for all users and admin panels."],
														updatedAt: (/* @__PURE__ */ new Date()).toISOString()
													};
													await safeSetDoc(doc(db, "settings", "app_version"), releaseData);
													const broadcastRef = doc(db, "settings", "broadcast_notifications");
													const bSnap = await getDoc(broadcastRef);
													const existingList = bSnap.exists() && Array.isArray((_bSnap$data = bSnap.data()) === null || _bSnap$data === void 0 ? void 0 : _bSnap$data.list) ? bSnap.data().list : [];
													const newNotif = {
														id: `notif_update_${Date.now()}`,
														titleBn: `নতুন অ্যাপ আপডেট প্রকাশিত হয়েছে (v${adminNewVersion.trim()})`,
														titleEn: `New App Update Published (v${adminNewVersion.trim()})`,
														bodyBn: adminNewFeatures.trim() || "নতুন সংস্করণ এবং উন্নত ফিচারসমূহ ইনস্টল করতে আপডেট করুন।",
														bodyEn: releaseData.titleEn,
														date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
														timeBn: (/* @__PURE__ */ new Date()).toLocaleTimeString("bn-BD", {
															hour: "2-digit",
															minute: "2-digit"
														}),
														timeEn: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
															hour: "2-digit",
															minute: "2-digit"
														}),
														type: "info",
														isGlobal: true
													};
													await safeSetDoc(broadcastRef, {
														list: [newNotif, ...existingList].slice(0, 50),
														updatedAt: (/* @__PURE__ */ new Date()).toISOString()
													}, { merge: true });
													setSuccessToastMessage(isBn ? "নতুন আপডেট সফলভাবে প্রকাশিত হয়েছে! সকল ইউজার ও এডমিন প্যানেল আপডেট নোটিফিকেশন পাবে।" : "New update successfully published! All users and admin panel will receive the update notification.");
													setShowSuccessToast(true);
													setIsUpdateModalOpen(false);
													sounds.playSuccess();
												} catch (err) {
													console.error("Publish update error:", err);
													setSuccessToastMessage(isBn ? "আপডেট প্রকাশ ব্যর্থ হয়েছে" : "Failed to publish update");
													setShowSuccessToast(true);
												} finally {
													setIsPublishingUpdate(false);
												}
											},
											className: "w-full py-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-amber-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60",
											children: [isPublishingUpdate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন আপডেট ক্লাউডে প্রকাশ করুন (ইন-অ্যাপ আপডেট)" : "Publish Update to Cloud (In-App Update)" })]
										})
									]
								}),
								updateResult.status === "update_available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-rose-800 dark:text-rose-200",
										children: isBn ? `নতুন আপডেট (v${updateResult.latestVersion}) পাওয়া গেছে!` : `New update (v${updateResult.latestVersion}) is available!`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-rose-700/90 dark:text-rose-300 mt-1",
										children: isBn ? "নতুন ফিচার ও উন্নতি পেতে নিচের বাটনে ট্যাপ করে অ্যাপটি আপডেট করুন।" : "Tap the update button below to load the latest version and new features."
									})]
								}) : updateResult.status === "offline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-amber-800 dark:text-amber-200",
										children: isBn ? "আপনি এখন অফলাইন মোডে আছেন" : "You are currently offline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-amber-700/90 dark:text-amber-300 mt-1",
										children: isBn ? "নতুন আপডেট যাচাই করতে ইন্টারনেট সংযোগ ও অনলাইন মোড চালু করুন।" : "Connect to the internet and turn off offline mode to check for updates."
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-emerald-800 dark:text-emerald-200",
										children: isBn ? `অ্যাপটি সর্বশেষ ভার্সনে (v${updateResult.currentVersion}) রয়েছে!` : `Your app is on the latest version (v${updateResult.currentVersion})!`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-emerald-700/90 dark:text-emerald-300 mt-1",
										children: isBn ? "সব নতুন ফিচার ও নিরাপত্তা আপডেট সঠিকভাবে চালু আছে।" : "All new features and security updates are active."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												className: "text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `নতুন ফিচারসমূহ (v${updateResult.releaseInfo.version})` : `New Features (v${updateResult.releaseInfo.version})` })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono text-slate-400",
												children: updateResult.releaseInfo.releaseDate
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-600 dark:text-slate-300",
											children: isBn ? updateResult.releaseInfo.titleBn : updateResult.releaseInfo.titleEn
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-1.5 pt-1",
											children: (isBn ? updateResult.releaseInfo.featuresBn : updateResult.releaseInfo.featuresEn).map((feat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
											}, i))
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2",
							children: updateResult.status === "update_available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									markVersionFeaturesAcknowledged(updateResult.releaseInfo);
									setIsUpdateModalOpen(false);
								},
								className: "flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer",
								children: isBn ? "পরে করব" : "Later"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: isApplyingUpdate,
								onClick: async () => {
									sounds.playTap();
									setIsApplyingUpdate(true);
									markVersionFeaturesAcknowledged(updateResult.releaseInfo);
									await applyAppUpdateAndReload();
								},
								className: "flex-1 py-2.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60",
								children: [isApplyingUpdate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "এখনই আপডেট করুন" : "Update Now" })]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleCheckForUpdate,
								disabled: isCheckingUpdate,
								className: "flex-1 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isCheckingUpdate ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পুনরায় যাচাই" : "Re-check" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									markVersionFeaturesAcknowledged(updateResult.releaseInfo);
									setIsUpdateModalOpen(false);
								},
								className: "flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer",
								children: isBn ? "ঠিক আছে" : "Got it"
							})] })
						})
					]
				})
			})
		]
	});
};
//#endregion
export { ProfileView };
