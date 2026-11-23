import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, En as require_react, F as Settings, Gt as Cloud, H as RefreshCw, It as ExternalLink, Kt as CloudUpload, M as ShieldCheck, Qt as CircleAlert, Vt as Database, Yt as Clock, Zt as CircleCheck, _ as TriangleAlert, ct as Mail, dt as Lock, en as ChevronRight, lt as LogOut, n as X, nn as ChevronDown, wt as HardDrive, x as Trash2, zt as Download } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { ct as staffDb, it as db, st as safeSetDoc, tt as sounds } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { deleteGoogleDriveBackup, disconnectGoogleDrive, downloadGoogleDriveBackup, getConnectedGoogleUser, getDriveAccessToken, listGoogleDriveBackups, signInWithGoogleDrive, uploadBackupToGoogleDrive } from "./chunk-googleDrive.js";
import { collectMasterBackupData } from "./chunk-backupCollector.js";
import { syncMasterDataToCloudArchive } from "./chunk-cloudArchiveSync.js";
//#region src/components/DriveBackupModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DriveBackupModal = ({ isOpen, onClose, lang, currentUser, adminAvatar, onLogAction, onDataRestored, onSubViewChange }) => {
	const isBn = lang === "bn";
	const [isConnected, setIsConnected] = (0, import_react.useState)(false);
	const [googleUser, setGoogleUser] = (0, import_react.useState)(null);
	const [isAuthLoading, setIsAuthLoading] = (0, import_react.useState)(false);
	const [isAccountOptionsOpen, setIsAccountOptionsOpen] = (0, import_react.useState)(false);
	const [isBackingUp, setIsBackingUp] = (0, import_react.useState)(false);
	const [isLoadingBackups, setIsLoadingBackups] = (0, import_react.useState)(false);
	const [driveBackups, setDriveBackups] = (0, import_react.useState)([]);
	const [statusMessage, setStatusMessage] = (0, import_react.useState)(null);
	const [confirmDialog, setConfirmDialog] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		message: "",
		actionType: "restore"
	});
	useSubViewBack(isOpen, (confirmDialog.isOpen ? 1 : 0) + (isAccountOptionsOpen ? 1 : 0), () => {
		if (confirmDialog.isOpen) setConfirmDialog((prev) => ({
			...prev,
			isOpen: false
		}));
		else if (isAccountOptionsOpen) setIsAccountOptionsOpen(false);
	}, onSubViewChange, "driveBackup");
	const [isRestoring, setIsRestoring] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("drive");
	const [autoBackupEnabled, setAutoBackupEnabled] = (0, import_react.useState)(() => {
		try {
			return safeStorage.getItem("protyasha_auto_backup_enabled") === "true";
		} catch {
			return true;
		}
	});
	const [scheduledBackupEnabled, setScheduledBackupEnabled] = (0, import_react.useState)(() => {
		try {
			return safeStorage.getItem("protyasha_scheduled_backup_enabled") === "true";
		} catch {
			return false;
		}
	});
	const [scheduledBackupTime, setScheduledBackupTime] = (0, import_react.useState)(() => {
		try {
			return safeStorage.getItem("protyasha_scheduled_backup_time") || "23:00";
		} catch {
			return "23:00";
		}
	});
	const handleToggleScheduledBackup = (enabled) => {
		setScheduledBackupEnabled(enabled);
		try {
			safeStorage.setItem("protyasha_scheduled_backup_enabled", enabled ? "true" : "false");
		} catch {}
		setStatusMessage({
			type: "info",
			text: enabled ? isBn ? `✓ প্রতিদিন ${scheduledBackupTime} টায় স্বয়ংক্রিয় ব্যাকআপ শিডিউল সক্রিয় করা হয়েছে` : `Auto backup scheduled for ${scheduledBackupTime} daily` : isBn ? "স্বয়ংক্রিয় ব্যাকআপ শিডিউল নিষ্ক্রিয় করা হয়েছে" : "Automated backup schedule disabled"
		});
	};
	const handleTimeChange = (timeStr) => {
		setScheduledBackupTime(timeStr);
		try {
			safeStorage.setItem("protyasha_scheduled_backup_time", timeStr);
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			const token = getDriveAccessToken();
			const user = getConnectedGoogleUser();
			if (token && user) {
				setIsConnected(true);
				setGoogleUser(user);
				loadBackupList();
			} else {
				setIsConnected(false);
				setGoogleUser(null);
			}
		}
	}, [isOpen]);
	const loadBackupList = async () => {
		setIsLoadingBackups(true);
		try {
			const files = await listGoogleDriveBackups();
			setDriveBackups(files);
		} catch (err) {
			console.warn("Failed to load drive backups:", err);
		} finally {
			setIsLoadingBackups(false);
		}
	};
	const handleConnectDrive = async () => {
		setIsAuthLoading(true);
		setStatusMessage(null);
		try {
			const { user } = await signInWithGoogleDrive();
			setIsConnected(true);
			setGoogleUser(user);
			setStatusMessage({
				type: "success",
				text: isBn ? `✓ প্রত্যাশা ক্যাবল নেটওয়ার্কের সাথে গুগল ড্রাইভ সফলভাবে সংযুক্ত হয়েছে (${user.email || "সক্রিয়"})` : `✓ Successfully connected to Google Drive for Protasha Cable Network (${user.email || "Active"})`
			});
			await loadBackupList();
		} catch (err) {
			console.error("Drive connection failed:", err);
			let errMsg = err.message || "অনুমতি পাওয়া যায়নি";
			if (errMsg.includes("popup-closed-by-user") || errMsg.includes("popup_closed_by_user")) errMsg = isBn ? "ব্রাউজার পপআপ ব্লক করা হয়েছে। দয়া করে ব্রাউজার সেটিংস থেকে পপআপ এলাউ করুন অথবা তাৎক্ষণিক ব্যাকআপের জন্য \"লোকাল JSON ব্যাকআপ\" ট্যাব ব্যবহার করুন।" : "Popup blocked. Please allow popups or use Local JSON Backup tab.";
			else if (errMsg.includes("unauthorized-domain")) errMsg = isBn ? "এই ডোমেইনটি ফায়ারবেসে অনুমোদিত নয়। দয়া করে \"লোকাল JSON ব্যাকআপ\" অপশন ব্যবহার করুন যা ১০০% কাজ করে।" : "Domain not authorized. Please use Local JSON Backup tab.";
			setStatusMessage({
				type: "error",
				text: isBn ? `গুগল ড্রাইভ সংযোগ ব্যর্থ: ${errMsg}` : `Drive connection failed: ${errMsg}`
			});
		} finally {
			setIsAuthLoading(false);
		}
	};
	const handleDisconnectDrive = async () => {
		try {
			await disconnectGoogleDrive();
			setIsConnected(false);
			setGoogleUser(null);
			setDriveBackups([]);
			setStatusMessage({
				type: "info",
				text: isBn ? "গুগল ড্রাইভ সংযোগ বিচ্ছিন্ন করা হয়েছে" : "Google Drive disconnected"
			});
		} catch (e) {
			console.error("Disconnect error:", e);
		}
	};
	const handleBackupToDrive = async () => {
		if (!isConnected) {
			setStatusMessage({
				type: "error",
				text: isBn ? "অনুগ্রহ করে প্রথমে গুগল একাউন্ট দিয়ে ড্রাইভ কানেক্ট করুন" : "Please connect Google Drive first"
			});
			return;
		}
		setIsBackingUp(true);
		setStatusMessage(null);
		try {
			const masterData = await collectMasterBackupData(currentUser);
			const uploadedFile = await uploadBackupToGoogleDrive(masterData);
			syncMasterDataToCloudArchive(masterData).catch(() => {});
			setStatusMessage({
				type: "success",
				text: isBn ? `✓ মাস্টার ব্যাকআপ সফলভাবে গুগল ড্রাইভে সেভ হয়েছে! (ফাইল: ${uploadedFile.name})` : `✓ Master backup saved to Google Drive successfully! (${uploadedFile.name})`
			});
			if (onLogAction) onLogAction("Google Drive Backup", "গুগল ড্রাইভে ব্যাকআপ", `ফাইল: ${uploadedFile.name} আপলোড সম্পন্ন (${uploadedFile.id})`);
			await loadBackupList();
		} catch (err) {
			console.error("Backup to drive failed:", err);
			setStatusMessage({
				type: "error",
				text: isBn ? `ব্যাকআপ ব্যর্থ হয়েছে: ${err.message}` : `Backup failed: ${err.message}`
			});
		} finally {
			setIsBackingUp(false);
		}
	};
	const handlePromptRestoreFromDrive = (file) => {
		setConfirmDialog({
			isOpen: true,
			title: isBn ? "গুগল ড্রাইভ থেকে রিস্টোর নিশ্চিতকরণ" : "Confirm Restore from Google Drive",
			message: isBn ? `আপনি কি নিশ্চিত যে "${file.name}" ফাইলটি থেকে সম্পূর্ণ ডেটাবেস রিস্টোর করতে চান? এটি বর্তমান ফায়ারবেস ক্লাউড ও সিস্টেমে সংরক্ষিত সকল তথ্য ব্যাকআপ ডেটা দিয়ে আপডেট ও সমন্বয় করবে।` : `Are you sure you want to restore the entire database from "${file.name}"? This will update and sync your current Firebase Cloud data with the backup records.`,
			actionType: "restore",
			targetFile: file
		});
	};
	const handlePromptDeleteDriveFile = (file) => {
		setConfirmDialog({
			isOpen: true,
			title: isBn ? "ড্রাইভ থেকে ব্যাকআপ মুছে ফেলা" : "Delete Backup from Google Drive",
			message: isBn ? `আপনি কি নিশ্চিত যে গুগল ড্রাইভ থেকে "${file.name}" ব্যাকআপ ফাইলটি চিরতরে মুছে ফেলতে চান?` : `Are you sure you want to permanently delete "${file.name}" from Google Drive?`,
			actionType: "delete",
			targetFile: file
		});
	};
	const executeRestore = async (backupJson, sourceName) => {
		setIsRestoring(true);
		setStatusMessage(null);
		try {
			const fs = (backupJson === null || backupJson === void 0 ? void 0 : backupJson.firestore) || {};
			const legacyServer = (backupJson === null || backupJson === void 0 ? void 0 : backupJson.serverData) || {};
			const legacyAy = (backupJson === null || backupJson === void 0 ? void 0 : backupJson.ayByayData) || {};
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const staffList = fs.staff || legacyAy.staff || legacyServer.staffAccounts || [];
			if (Array.isArray(staffList) && staffList.length > 0) {
				for (const stf of staffList) if (stf && stf.id) await safeSetDoc(doc(staffDb, "staff", String(stf.id)), {
					...stf,
					id: String(stf.id),
					phone: stf.phone || ""
				});
				await safeSetDoc(doc(db, "settings", "staff_meta"), {
					initialized: true,
					updatedAt: nowIso
				});
			}
			const salariesList = fs.ay_byay_salaries || fs.staff_salaries || legacyAy.salaries || [];
			if (Array.isArray(salariesList)) {
				for (const sal of salariesList) if (sal && sal.id) await safeSetDoc(doc(staffDb, "ay_byay_salaries", String(sal.id)), sal);
			}
			const isV3 = Number((backupJson === null || backupJson === void 0 ? void 0 : backupJson.backupVersion) || 0) >= 3;
			const ayTransactions = isV3 ? fs.ay_byay_transactions || legacyAy.transactions || [] : fs.ay_byay_transactions || fs.transactions || legacyAy.transactions || [];
			if (Array.isArray(ayTransactions)) {
				for (const tx of ayTransactions) if (tx && tx.id) await safeSetDoc(doc(staffDb, "ay_byay_transactions", String(tx.id)), {
					...tx,
					id: String(tx.id),
					source: tx.source || "ay-byay"
				});
			}
			const mainTransactions = isV3 ? fs.transactions || [] : legacyServer.transactions || [];
			if (Array.isArray(mainTransactions)) {
				for (const tx of mainTransactions) if (tx && tx.id) await safeSetDoc(doc(db, "transactions", String(tx.id)), {
					...tx,
					id: String(tx.id)
				});
			}
			const bannersList = fs.banners || legacyServer.banners || [];
			if (Array.isArray(bannersList) && bannersList.length > 0) {
				for (const b of bannersList) if (b && b.id) await safeSetDoc(doc(db, "banners", String(b.id)), {
					...b,
					id: String(b.id),
					isActive: b.isActive !== false
				});
				await safeSetDoc(doc(db, "settings", "banners_meta"), {
					initialized: true,
					updatedAt: nowIso
				});
			}
			const channelsList = fs.channels || legacyServer.channels || [];
			if (Array.isArray(channelsList) && channelsList.length > 0) {
				for (const ch of channelsList) if (ch && ch.id) await safeSetDoc(doc(db, "channels", String(ch.id)), {
					...ch,
					id: String(ch.id)
				});
				await safeSetDoc(doc(db, "settings", "channels_meta"), {
					initialized: true,
					updatedAt: nowIso
				});
			}
			const ownersList = fs.quick_hisab_owners || legacyServer.quickHisabOwners || [];
			if (Array.isArray(ownersList) && ownersList.length > 0) {
				for (const owner of ownersList) if (owner && owner.id) await safeSetDoc(doc(db, "quick_hisab_owners", String(owner.id)), {
					...owner,
					id: String(owner.id)
				});
				await safeSetDoc(doc(db, "settings", "owners_meta"), {
					initialized: true,
					updatedAt: nowIso
				});
			}
			const usersList = fs.users || legacyServer.users || [];
			if (Array.isArray(usersList) && usersList.length > 0) {
				for (const u of usersList) if (u && u.id) await safeSetDoc(doc(db, "users", String(u.id)), {
					...u,
					id: String(u.id),
					role: u.role || "user",
					status: u.status || "active"
				});
				await safeSetDoc(doc(db, "settings", "users_meta"), {
					initialized: true,
					updatedAt: nowIso
				});
			}
			const invItems = fs.ay_byay_inventory || legacyAy.inventory || [];
			if (Array.isArray(invItems)) {
				for (const item of invItems) if (item && item.id) await safeSetDoc(doc(staffDb, "ay_byay_inventory", String(item.id)), item);
			}
			const invLogs = fs.ay_byay_inventory_logs || legacyAy.inventoryLogs || [];
			if (Array.isArray(invLogs)) {
				for (const logItem of invLogs) if (logItem && logItem.id) await safeSetDoc(doc(staffDb, "ay_byay_inventory_logs", String(logItem.id)), logItem);
			}
			const ayConfig = fs.ay_byay_config || legacyAy.config;
			if (ayConfig && ayConfig.companyName && ayConfig.currencySymbol) await safeSetDoc(doc(staffDb, "ay_byay_config", "main"), ayConfig);
			const settingsObj = (backupJson === null || backupJson === void 0 ? void 0 : backupJson.settings) || {};
			if (settingsObj.service_control) await safeSetDoc(doc(db, "settings", "service_control"), settingsObj.service_control);
			else if (legacyServer.serviceStatuses) await safeSetDoc(doc(db, "settings", "service_control"), {
				id: "service_control",
				statuses: legacyServer.serviceStatuses,
				updatedAt: nowIso
			});
			if (settingsObj.broadcast_notifications) await safeSetDoc(doc(db, "settings", "broadcast_notifications"), settingsObj.broadcast_notifications);
			else if (Array.isArray(legacyServer.notifications)) await safeSetDoc(doc(db, "settings", "broadcast_notifications"), {
				list: legacyServer.notifications.slice(0, 50),
				updatedAt: nowIso
			});
			if (settingsObj.footer_config) await safeSetDoc(doc(db, "settings", "footer_config"), settingsObj.footer_config);
			else if (legacyServer.footerConfig) await safeSetDoc(doc(db, "settings", "footer_config"), {
				config: legacyServer.footerConfig,
				updatedAt: nowIso
			});
			if (settingsObj.admin_profile) await safeSetDoc(doc(db, "settings", "admin_profile"), settingsObj.admin_profile);
			else if (legacyServer.adminProfile) await safeSetDoc(doc(db, "settings", "admin_profile"), {
				...legacyServer.adminProfile,
				updatedAt: nowIso
			});
			if (settingsObj.audit_logs) await safeSetDoc(doc(db, "settings", "audit_logs"), settingsObj.audit_logs);
			else if (Array.isArray(legacyServer.auditLogs)) await safeSetDoc(doc(db, "settings", "audit_logs"), {
				logs: legacyServer.auditLogs.slice(0, 100),
				updatedAt: nowIso
			});
			if (settingsObj.quick_hisab_summary) await safeSetDoc(doc(db, "settings", "quick_hisab_summary"), settingsObj.quick_hisab_summary);
			else if (legacyServer.quickHisabMonthlyRecords || legacyServer.quickHisabSummary) await safeSetDoc(doc(db, "settings", "quick_hisab_summary"), {
				monthlyRecords: legacyServer.quickHisabMonthlyRecords || {},
				quickHisabSummary: legacyServer.quickHisabSummary || null,
				updatedAt: nowIso
			});
			if (Array.isArray(staffList) && staffList.length > 0) {
				try {
					safeStorage.setItem("protyasha_staff", JSON.stringify(staffList));
				} catch {}
				window.dispatchEvent(new CustomEvent("staff-data-changed", { detail: staffList }));
			}
			if (Array.isArray(salariesList)) try {
				safeStorage.setItem("isp_cache_salaries", JSON.stringify(salariesList));
			} catch {}
			if (Array.isArray(ayTransactions)) try {
				safeStorage.setItem("isp_cache_txns", JSON.stringify(ayTransactions));
			} catch {}
			setStatusMessage({
				type: "success",
				text: isBn ? `✓ রিস্টোর সফল! ${staffList.length} জন কর্মী, ${salariesList.length} টি বেতন রেকর্ড ও সমস্ত লেনদেন সফলভাবে পুনরুদ্ধার হয়েছে।` : `✓ Restore successful! ${staffList.length} staff, ${salariesList.length} salary records & all transactions restored.`
			});
			if (onLogAction) onLogAction("Database Restored", "ডেটাবেস রিস্টোর সম্পন্ন", `উৎস: ${sourceName} (${staffList.length} কর্মী, ${salariesList.length} বেতন রেকর্ড)`);
			if (onDataRestored) onDataRestored();
		} catch (err) {
			console.error("Restore error:", err);
			setStatusMessage({
				type: "error",
				text: isBn ? `রিস্টোর ব্যর্থ হয়েছে: ${err.message}` : `Restore failed: ${err.message}`
			});
		} finally {
			setIsRestoring(false);
			setConfirmDialog((prev) => ({
				...prev,
				isOpen: false
			}));
		}
	};
	const handleConfirmAction = async () => {
		if (confirmDialog.actionType === "restore") {
			if (confirmDialog.targetFile) {
				setIsRestoring(true);
				try {
					const fileData = await downloadGoogleDriveBackup(confirmDialog.targetFile.id);
					await executeRestore(fileData, confirmDialog.targetFile.name);
				} catch (err) {
					setStatusMessage({
						type: "error",
						text: isBn ? `ফাইল ডাউনলোড ও রিস্টোর ব্যর্থ: ${err.message}` : `Failed: ${err.message}`
					});
					setIsRestoring(false);
					setConfirmDialog((prev) => ({
						...prev,
						isOpen: false
					}));
				}
			} else if (confirmDialog.targetJsonData) await executeRestore(confirmDialog.targetJsonData, "লোকাল ফাইল");
		} else if (confirmDialog.actionType === "delete" && confirmDialog.targetFile) try {
			await deleteGoogleDriveBackup(confirmDialog.targetFile.id);
			setStatusMessage({
				type: "success",
				text: isBn ? "ব্যাকআপ ফাইলটি গুগল ড্রাইভ থেকে মুছে ফেলা হয়েছে" : "Backup deleted from Drive"
			});
			setDriveBackups((prev) => prev.filter((f) => {
				var _confirmDialog$target;
				return f.id !== ((_confirmDialog$target = confirmDialog.targetFile) === null || _confirmDialog$target === void 0 ? void 0 : _confirmDialog$target.id);
			}));
		} catch (err) {
			setStatusMessage({
				type: "error",
				text: isBn ? `ফাইল মুছতে সমস্যা হয়েছে: ${err.message}` : `Failed to delete: ${err.message}`
			});
		} finally {
			setConfirmDialog((prev) => ({
				...prev,
				isOpen: false
			}));
		}
	};
	const handleDownloadLocalJson = async () => {
		setIsBackingUp(true);
		try {
			const masterData = await collectMasterBackupData(currentUser);
			const jsonStr = JSON.stringify(masterData, null, 2);
			const blob = new Blob([jsonStr], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			a.href = url;
			a.download = `Protyasha_Local_Backup_${dateStr}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			setStatusMessage({
				type: "success",
				text: isBn ? "✓ লোকাল ব্যাকআপ JSON ফাইল ডাউনলোড সম্পন্ন হয়েছে" : "✓ Local backup JSON downloaded"
			});
		} catch (e) {
			setStatusMessage({
				type: "error",
				text: isBn ? `ডাউনলোড ব্যর্থ: ${e.message}` : `Download failed: ${e.message}`
			});
		} finally {
			setIsBackingUp(false);
		}
	};
	const handleLocalFileUpload = (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				var _event$target;
				const parsed = JSON.parse((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
				if (!parsed || typeof parsed !== "object") throw new Error("অকার্যকর ফাইল ফরম্যাট");
				setConfirmDialog({
					isOpen: true,
					title: isBn ? "লোকাল ফাইল থেকে রিস্টোর" : "Restore from Local File",
					message: isBn ? `আপনি লোকাল ফাইল "${file.name}" নির্বাচন করেছেন। আপনি কি এই ফাইল থেকে সম্পূর্ণ ফায়ারবেস ডেটাবেস ও সিস্টেম রিস্টোর করতে চান?` : `You selected "${file.name}". Do you want to restore the database from this file?`,
					actionType: "restore",
					targetJsonData: parsed
				});
			} catch (err) {
				setStatusMessage({
					type: "error",
					text: isBn ? `ফাইল পড়তে সমস্যা হয়েছে: ${err.message}` : `Error parsing JSON: ${err.message}`
				});
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const toggleAutoBackup = (enabled) => {
		setAutoBackupEnabled(enabled);
		try {
			safeStorage.setItem("protyasha_auto_backup_enabled", enabled ? "true" : "false");
		} catch {}
		setStatusMessage({
			type: "info",
			text: enabled ? isBn ? "স্বয়ংক্রিয় ব্যাকআপ রিমাইন্ডার সক্রিয় করা হয়েছে" : "Auto backup reminder enabled" : isBn ? "স্বয়ংক্রিয় ব্যাকআপ রিমাইন্ডার নিষ্ক্রিয় করা হয়েছে" : "Auto backup reminder disabled"
		});
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: (e) => e.stopPropagation(),
				className: "bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full my-auto max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 bg-gradient-to-r from-[#D32F2F] via-[#E52E2E] to-rose-700 text-white flex items-center justify-between shrink-0 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-5 h-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-base sm:text-lg text-white",
									children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক - ক্লাউড ব্যাকআপ ও রিস্টোর" : "Protasha Cable Network - Cloud Backup & Restore"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-extrabold uppercase tracking-wider",
									children: "2-Layer"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-100 mt-0.5",
								children: isBn ? "ফায়ারবেস ক্লাউড ডেটাবেস + গুগল ড্রাইভ মাস্টার ব্যাকআপ" : "Firebase Cloud Database + Google Drive Master Backup"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("drive"),
								className: `flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "drive" ? "bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "গুগল ড্রাইভ ব্যাকআপ" : "Google Drive Backup" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("local"),
								className: `flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "local" ? "bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লোকাল JSON ব্যাকআপ" : "Local JSON Backup" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("security"),
								className: `flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "security" ? "bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "২-লেয়ার সিকিউরিটি" : "2-Layer Security" })]
							})
						]
					}),
					statusMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mx-4 mt-3 p-3 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200 ${statusMessage.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : statusMessage.type === "error" ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800" : "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [statusMessage.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }) : statusMessage.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-rose-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-4 h-4 text-blue-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: statusMessage.text
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStatusMessage(null),
							className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 overflow-y-auto space-y-4 text-xs",
						children: [
							activeTab === "drive" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 sm:p-5 bg-gradient-to-br from-rose-50/70 via-white to-slate-50 dark:from-slate-800/80 dark:via-slate-850 dark:to-slate-900 rounded-3xl border-2 border-rose-200 dark:border-rose-950/60 shadow-sm space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100 dark:border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-0.5 shadow-md shadow-rose-500/25 flex items-center justify-center overflow-hidden shrink-0",
													children: [adminAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: adminAvatar,
														alt: "Logo",
														className: "w-full h-full object-cover rounded-2xl"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#E52E2E] font-black text-xl leading-none",
															children: "প্র"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-3 h-3 text-blue-600" })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "font-black text-base text-slate-900 dark:text-white leading-tight",
														children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টাল" : "Protyasha Digital Portal"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => {
															sounds.playTap();
															setIsAccountOptionsOpen(true);
														},
														className: `px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${isConnected ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800" : "bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-900"}`,
														title: isBn ? "জিমেইল একাউন্ট অপশন ও সেটিংস দেখতে চাপ দিন" : "Click to view Gmail account options",
														children: isConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✓ জিমেইল কানেক্টেড" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3 h-3 text-emerald-700" })
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5 text-rose-600" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "জিমেইল কানেক্ট করা হয়নি" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3 text-rose-700" })
														] })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-600 dark:text-slate-400 text-xs font-semibold mt-0.5",
													children: isBn ? "গুগল ড্রাইভ সেন্ট্রালাইজড ক্লাউড ব্যাকআপ সিস্টেম" : "Google Drive Centralized Cloud Backup System"
												})] })]
											}), isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 self-start sm:self-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														sounds.playTap();
														setIsAccountOptionsOpen(true);
													},
													className: "px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 active:scale-95",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "একাউন্ট অপশন" : "Options" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: handleDisconnectDrive,
													className: "px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors active:scale-95",
													children: isBn ? "ডিসকানেক্ট" : "Disconnect"
												})]
											})]
										}), !isConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-0.5 max-w-md",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed",
														children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্কের সকল গ্রাহক খতিয়ান, দৈনিক আয়-ব্যয় ও মাসিক বেতন ডাটাবেস ক্লাউডে সুরক্ষিত রাখতে আপনার গুগল জিমেইল একাউন্ট যুক্ত করুন।" : "Connect your Google Gmail account to keep all customer ledgers, daily accounts and salaries safe in Google Drive."
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-slate-400",
														children: isBn ? "• গুগল ড্রাইভের \"Admin_Backups\" ফোল্ডারে সম্পূর্ণ স্বয়ংক্রিয় ব্যাকআপ থাকবে" : "• Stored safely in your Drive Admin_Backups folder"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: handleConnectDrive,
													disabled: isAuthLoading,
													className: "gsi-material-button w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-rose-300 hover:border-[#E52E2E] dark:border-slate-700 font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50 shrink-0 group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "gsi-material-button-icon w-4.5 h-4.5 shrink-0 flex items-center justify-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
															viewBox: "0 0 48 48",
															className: "w-4.5 h-4.5",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	fill: "#EA4335",
																	d: "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	fill: "#4285F4",
																	d: "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	fill: "#FBBC05",
																	d: "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
																	fill: "#34A853",
																	d: "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
																})
															]
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-slate-800 dark:text-slate-100 group-hover:text-[#E52E2E] transition-colors",
														children: isAuthLoading ? isBn ? "কানেক্ট হচ্ছে..." : "Connecting..." : isBn ? "গুগল দিয়ে জিমেইল কানেক্ট করুন" : "Sign in with Google"
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2.5 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ড্রাইভ পপআপে সমস্যা হলে তাৎক্ষণিক ব্যাকআপ ব্যবহার করুন:" : "Having popup issues? Use instant backup:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setActiveTab("local"),
													className: "font-bold text-[#E52E2E] hover:underline cursor-pointer inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লোকাল JSON ব্যাকআপ (১০০% সচল)" : "Local JSON Backup" })]
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												sounds.playTap();
												setIsAccountOptionsOpen(true);
											},
											className: "flex items-center gap-3 p-3 bg-white hover:bg-emerald-50/40 dark:bg-slate-800/80 dark:hover:bg-slate-800/90 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-2xs cursor-pointer transition-all group",
											title: isBn ? "একাউন্ট অপশন ও বিস্তারিত দেখতে ক্লিক করুন" : "Click to view account options",
											children: [
												(googleUser === null || googleUser === void 0 ? void 0 : googleUser.photoURL) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: googleUser.photoURL,
													alt: "Google avatar",
													className: "w-10 h-10 rounded-full border-2 border-emerald-500 shadow-xs shrink-0"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0",
													children: (googleUser === null || googleUser === void 0 ? void 0 : googleUser.email) ? googleUser.email.charAt(0).toUpperCase() : "G"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-slate-900 dark:text-white text-xs truncate",
																children: (googleUser === null || googleUser === void 0 ? void 0 : googleUser.displayName) || "অ্যাডমিন গুগল একাউন্ট"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800",
																children: isBn ? "সক্রিয়" : "Active"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-slate-600 dark:text-slate-300 truncate font-mono",
															children: googleUser === null || googleUser === void 0 ? void 0 : googleUser.email
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ব্র্যান্ডিং নাম:" : "Branding:" }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-extrabold text-emerald-800 dark:text-emerald-300",
																	children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টাল" : "Protyasha Digital Portal"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• ", isBn ? "অপশন দেখতে চাপুন" : "Click for options"] })
															]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform shrink-0" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্কের সম্পূর্ণ ক্লাউড ব্যাকআপ" : "Protasha Cable Network Master Cloud Backup" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed",
											children: isBn ? "স্টাফ হিসাব, বকেয়া কালেকশন, মাসিক বেতন, আয়-ব্যয় লেনদেন ও ইউজার অ্যাকাউন্টের একটি মাস্টার কপি আপনার গুগল ড্রাইভে তৈরি হবে।" : "Create a full master JSON snapshot of staff payroll, accounting transactions and settings into Google Drive."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleBackupToDrive,
											disabled: !isConnected || isBackingUp,
											className: "px-4 py-2.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0",
											children: isBackingUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ব্যাকআপ তৈরি হচ্ছে..." : "Backing up..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "গুগল ড্রাইভে ব্যাকআপ তুলুন" : "Backup to Google Drive" })] })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 rounded-2xl border border-sky-200 dark:border-sky-900/50 space-y-3 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-bold text-xs sm:text-sm text-slate-900 dark:text-white",
													children: isBn ? "প্রতিদিন নির্দিষ্ট সময়ে স্বয়ংক্রিয় ব্যাকআপ শিডিউল" : "Automated Daily Backup Schedule"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-600 dark:text-slate-300",
													children: isBn ? "নির্দিষ্ট সময়ে অ্যাপ চালু থাকলেই গুগল ড্রাইভে ব্যাকআপ হবে" : "Automatically backup at specified time daily"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "relative inline-flex items-center cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: scheduledBackupEnabled,
													onChange: (e) => handleToggleScheduledBackup(e.target.checked),
													className: "sr-only peer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#E52E2E]" })]
											})]
										}), scheduledBackupEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-700 dark:text-slate-300",
												children: isBn ? "ব্যাকআপ নেওয়ার সময় নির্ধারণ করুন:" : "Select Backup Time:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "time",
												value: scheduledBackupTime,
												onChange: (e) => handleTimeChange(e.target.value),
												className: "px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												className: "font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্কের সংরক্ষিত ড্রাইভ ব্যাকআপসমূহ" : "Saved Backups in Google Drive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-bold",
													children: [driveBackups.length, " টি ফাইল"]
												})]
											}), isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: loadBackupList,
												disabled: isLoadingBackups,
												className: "p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer",
												title: isBn ? "রিফ্রেশ করুন" : "Refresh list",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoadingBackups ? "animate-spin" : ""}` })
											})]
										}), !isConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-8 h-8 text-slate-400 mx-auto stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-500 font-medium",
												children: isBn ? "ড্রাইভের পূর্ববর্তী ব্যাকআপ তালিকা দেখতে উপরে \"গুগল দিয়ে জিমেইল কানেক্ট করুন\"।" : "Sign in with Google to view your drive backup files."
											})]
										}) : isLoadingBackups ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 text-center text-slate-400 flex items-center justify-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "গুগল ড্রাইভ স্ক্যান করা হচ্ছে..." : "Scanning Google Drive..." })]
										}) : driveBackups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-600 dark:text-slate-300 font-bold",
												children: isBn ? "এখনো কোনো ব্যাকআপ ফাইল পাওয়া যায়নি" : "No backups found yet in Google Drive"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-400 text-[11px]",
												children: isBn ? "উপরে \"Backup to Drive\" বাটনে চাপ দিয়ে প্রথম মাস্টার ব্যাকআপ নিন।" : "Click \"Backup to Google Drive\" above to create your first backup."
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-2xs",
											children: driveBackups.map((file) => {
												const createdDate = file.createdTime ? new Date(file.createdTime).toLocaleString("bn-BD", {
													year: "numeric",
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit"
												}) : "—";
												const sizeKb = file.size ? `${(Number(file.size) / 1024).toFixed(1)} KB` : "—";
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start gap-2.5 min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
																className: "font-bold text-slate-900 dark:text-white truncate text-xs",
																title: file.name,
																children: file.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "flex items-center gap-1",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: createdDate })]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sizeKb })
																]
															})]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 shrink-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																onClick: () => handlePromptRestoreFromDrive(file),
																disabled: isRestoring,
																className: "px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer",
																title: isBn ? "এই ফাইল থেকে রিস্টোর করুন" : "Restore from this backup",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3 h-3 ${isRestoring ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "রিস্টোর" : "Restore" })]
															}),
															file.webViewLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
																href: file.webViewLink,
																target: "_blank",
																rel: "noreferrer",
																className: "p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
																title: isBn ? "গুগল ড্রাইভে দেখুন" : "View in Google Drive",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																onClick: () => handlePromptDeleteDriveFile(file),
																className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer",
																title: isBn ? "মুছে ফেলুন" : "Delete file",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
															})
														]
													})]
												}, file.id);
											})
										})]
									})
								]
							}),
							activeTab === "local" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white",
											children: isBn ? "অফলাইন JSON ফাইল ডাউনলোড" : "Download Offline JSON File"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-500 dark:text-slate-400 text-xs mt-0.5",
											children: isBn ? "গুগল ড্রাইভ ছাড়াও সরাসরি কম্পিউটার বা মোবাইলে একটি অফলাইন ব্যাকআপ ফাইল সেভ করে রাখুন।" : "Download a complete JSON copy directly to your computer or mobile storage."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleDownloadLocalJson,
										disabled: isBackingUp,
										className: "w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কম্পিউটার/ফোনে ব্যাকআপ ডাউনলোড করুন" : "Download Backup File (.json)" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-5 h-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white",
											children: isBn ? "ফাইল আপলোড করে রিস্টোর (File Upload & Restore)" : "Upload File & Restore"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-500 dark:text-slate-400 text-xs mt-0.5",
											children: isBn ? "পূর্বে ডাউনলোড করা কোনো JSON ব্যাকআপ ফাইল নির্বাচন করে মুহূর্তেই পুরো সিস্টেম ফিরিয়ে আনুন।" : "Select a previously saved JSON backup file to restore the database."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "w-full py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-amber-600" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "JSON ব্যাকআপ ফাইল নির্বাচন করুন" : "Choose JSON Backup File" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: ".json",
												onChange: handleLocalFileUpload,
												className: "hidden"
											})
										]
									})]
								})]
							}),
							activeTab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold",
											children: "১"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "লেয়ার ১: ফায়ারবেস ক্লাউড ডাটাবেস (Firebase Cloud Database)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold",
												children: "রিয়েল-টাইম"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed",
											children: [
												"ইউজার বা সাব-অ্যাডমিন অ্যাপে কোনো এন্ট্রি বা পরিবর্তন করলেই তা সরাসরি সেন্ট্রাল ফায়ারবেস (Firestore ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-blue-600 font-mono",
													children: "staff-collection-db"
												}),
												") ডাটাবেসে তাৎক্ষণিক সংরক্ষিত হয়। অ্যাপ আনইনস্টল বা কোড আপডেট করলেও এই ডেটা চিরতরে ক্লাউডে সুরক্ষিত থাকে।"
											]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold",
											children: "২"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "লেয়ার ২: গুগল ড্রাইভ ব্যাকআপ (Google Drive Backup)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold",
												children: "মাস্টার কপি"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed",
											children: [
												"সার্ভার ক্র্যাশ বা অনাকাঙ্ক্ষিত দুর্যোগ থেকে ১০০% সুরক্ষার জন্য অ্যাডমিনের নিজস্ব গুগল ড্রাইভের ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-emerald-600 font-mono",
													children: "Admin_Backups"
												}),
												" ফোল্ডারে মাস্টার JSON ফাইল সেভ থাকে। যেকোনো নতুন ডিভাইসে গুগল একাউন্ট দিয়ে এক ক্লিকেই পুরো ডেটাবেস রিস্টোর করা যায়।"
											]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "গুগল ড্রাইভ পার্মিশন ও প্রাইভেসির নিশ্চয়তা" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed",
											children: [
												"এই অ্যাপে শুধুমাত্র ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-mono text-[10px]",
													children: "drive.file"
												}),
												" স্কোপ ব্যবহার করা হয়েছে। এর মাধ্যমে অ্যাপ শুধুমাত্র তার নিজের তৈরি করা ব্যাকআপ ফাইলে হাত দিতে পারবে; আপনার গুগল ড্রাইভের ব্যক্তিগত অন্য কোনো ফাইল বা তথ্যে অ্যাপের কোনো অ্যাক্সেস নেই।"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "font-bold text-indigo-950 dark:text-indigo-200",
											children: "দৈনিক অটো-ব্যাকআপ নোটিশ ও রিমাইন্ডার"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-indigo-800/80 dark:text-indigo-300/80",
											children: "প্রতিদিন অ্যাডমিন প্যানেলে স্বয়ংক্রিয় ব্যাকআপের অনুস্মারক দেখতে এটি চালু রাখুন"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: autoBackupEnabled,
											onChange: (e) => toggleAutoBackup(e.target.checked),
											className: "w-5 h-5 accent-indigo-600 rounded cursor-pointer shrink-0"
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-slate-500 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ক্লাউড ডেটা ১০০% এনক্রিপ্টেড ও সুরক্ষিত" : "100% Encrypted & Safe" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition-colors",
							children: isBn ? "বন্ধ করুন" : "Close"
						})]
					})
				]
			}),
			confirmDialog.isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-150",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${confirmDialog.actionType === "restore" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60" : "bg-rose-100 text-rose-600 dark:bg-rose-950/60"}`,
							children: confirmDialog.actionType === "restore" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-7 h-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-7 h-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: confirmDialog.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed",
							children: confirmDialog.message
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmDialog((prev) => ({
									...prev,
									isOpen: false
								})),
								disabled: isRestoring,
								className: "flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer",
								children: isBn ? "বাতিল" : "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleConfirmAction,
								disabled: isRestoring,
								className: `flex-1 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${confirmDialog.actionType === "restore" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`,
								children: isRestoring ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রক্রিয়াধীন..." : "Processing..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: confirmDialog.actionType === "restore" ? isBn ? "হ্যাঁ, রিস্টোর করুন" : "Confirm Restore" : isBn ? "হ্যাঁ, মুছে ফেলুন" : "Confirm Delete" })
							})]
						})
					]
				})
			}),
			isAccountOptionsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
									children: isBn ? "জিমেইল একাউন্ট অপশন" : "Gmail Account Options"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-extrabold text-[#E52E2E]",
										children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টাল" : "Protyasha Digital Portal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400",
										children: "• ক্লাউড ব্যাকআপ"
									})]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsAccountOptionsOpen(false),
								className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						isConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [(googleUser === null || googleUser === void 0 ? void 0 : googleUser.photoURL) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: googleUser.photoURL,
									alt: "Google avatar",
									className: "w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm",
									children: (googleUser === null || googleUser === void 0 ? void 0 : googleUser.email) ? googleUser.email.charAt(0).toUpperCase() : "G"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-extrabold text-slate-900 dark:text-white text-sm truncate",
												children: (googleUser === null || googleUser === void 0 ? void 0 : googleUser.displayName) || "অ্যাডমিন গুগল একাউন্ট"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300",
												children: isBn ? "সক্রিয় সংযোগ" : "Active"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-600 dark:text-slate-300 truncate mt-0.5",
											children: googleUser === null || googleUser === void 0 ? void 0 : googleUser.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-500 dark:text-slate-400 mt-0.5",
											children: isBn ? "গুগল ড্রাইভ ও স্প্রেডশীট সম্পূর্ণ অথরাইজড" : "Google Drive & Sheets authorized"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-slate-600 dark:text-slate-300 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ক্লাউড ফোল্ডার:" : "Cloud Folder:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-emerald-700 dark:text-emerald-400",
										children: "Admin_Backups"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ব্র্যান্ড অথেন্টিকেশন:" : "Brand Authentication:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টাল" : "Protyasha Digital Portal"
									})]
								})]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-center space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center mx-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-slate-900 dark:text-white",
									children: isBn ? "কোনো জিমেইল সংযুক্ত করা হয়নি" : "No Gmail Account Linked"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-600 dark:text-slate-400 mt-1",
									children: isBn ? "প্রত্যাশা ডিজিটাল পোর্টালের সকল খতিয়ান ও হিসাব নিরাপদে গুগলে রাখতে জিমেইল কানেক্ট করুন।" : "Connect Gmail to safely backup all your records to Google."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										setIsAccountOptionsOpen(false);
										await handleConnectDrive();
									},
									disabled: isAuthLoading,
									className: "w-full py-2.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "গুগল দিয়ে জিমেইল কানেক্ট করুন" : "Sign in with Google" })]
								})
							]
						}),
						isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1",
									children: isBn ? "উপলব্ধ অপশনসমূহ" : "Available Options"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										setIsAccountOptionsOpen(false);
										await handleConnectDrive();
									},
									disabled: isAuthLoading,
									className: "w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left cursor-pointer transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: isBn ? "অন্য জিমেইল একাউন্ট পরিবর্তন করুন" : "Switch Google Account"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400",
											children: isBn ? "অন্য জিমেইল নির্বাচন করে নতুন করে কানেক্ট করুন" : "Pick a different Gmail account to connect"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										setIsAccountOptionsOpen(false);
										await handleBackupToDrive();
									},
									disabled: isBackingUp,
									className: "w-full p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-left cursor-pointer transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-emerald-900 dark:text-emerald-300",
											children: isBn ? "এখনই ড্রাইভ ব্যাকআপ নিন" : "Take Drive Backup Now"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-emerald-700/80 dark:text-emerald-400/80",
											children: isBn ? "বর্তমান সকল ডেটাবেসের মাস্টার কপি ড্রাইভে সেভ করুন" : "Save master copy of current data into Drive"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-emerald-500" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										setIsAccountOptionsOpen(false);
										await loadBackupList();
									},
									className: "w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left cursor-pointer transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: isBn ? "ড্রাইভ ব্যাকআপ তালিকা রিফ্রেশ করুন" : "Refresh Drive Backups"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400",
											children: isBn ? "সংরক্ষিত ব্যাকআপ ফাইলসমূহ পুনরায় স্ক্যান করুন" : "Scan for existing backups in Google Drive"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-400" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: async () => {
										setIsAccountOptionsOpen(false);
										await handleDisconnectDrive();
									},
									className: "w-full p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/60 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-left cursor-pointer transition-all active:scale-98",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-rose-900 dark:text-rose-300",
											children: isBn ? "জিমেইল সংযোগ বিচ্ছিন্ন করুন" : "Disconnect Gmail"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-rose-600/80 dark:text-rose-400/80",
											children: isBn ? "অ্যাপ থেকে গুগল ড্রাইভ সংযোগ সরিয়ে ফেলুন" : "Remove Google Drive connection from app"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-rose-400" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsAccountOptionsOpen(false),
								className: "w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors",
								children: isBn ? "বন্ধ করুন" : "Close"
							})
						})
					]
				})
			})
		]
	});
};
//#endregion
export { DriveBackupModal };
