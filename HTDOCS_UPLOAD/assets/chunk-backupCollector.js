import { _ as collection, c as getDocs, o as getDoc, y as doc } from "./chunk-vendor-firebase.js";
import { ct as staffDb, it as db } from "./app.js";
//#region src/utils/backupCollector.ts
async function collectMasterBackupData(currentUser) {
	const readCollection = async (colName) => {
		try {
			const snap = await getDocs(collection(db, colName));
			const rows = [];
			snap.forEach((d) => {
				const item = d.data();
				if (item) rows.push({
					...item,
					id: item.id || d.id
				});
			});
			return rows;
		} catch (e) {
			console.warn(`Firestore ${colName} read notice:`, e);
			return [];
		}
	};
	const readSettingsDoc = async (docId) => {
		try {
			const snap = await getDoc(doc(db, "settings", docId));
			return snap.exists() ? snap.data() : null;
		} catch (e) {
			console.warn(`Firestore settings/${docId} read notice:`, e);
			return null;
		}
	};
	const isSubAdmin = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === "sub-admin";
	const currentUserId = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || "";
	const [cloudStaff, cloudSalaries, cloudStaffSalaries, ayTransactions, mainTransactions, cloudBanners, cloudChannels, cloudOwners, cloudUsers, cloudInventory, cloudInventoryLogs, ayConfigSnap, serviceControl, broadcastNotifications, footerConfigDoc, adminProfile, auditLogsDoc, quickHisabSummary] = await Promise.all([
		readCollection("staff"),
		readCollection("ay_byay_salaries"),
		readCollection("staff_salaries"),
		readCollection("ay_byay_transactions"),
		readCollection("transactions"),
		readCollection("banners"),
		readCollection("channels"),
		readCollection("quick_hisab_owners"),
		isSubAdmin ? Promise.resolve([]) : readCollection("users"),
		readCollection("ay_byay_inventory"),
		readCollection("ay_byay_inventory_logs"),
		getDoc(doc(staffDb, "ay_byay_config", "main")).then((s) => s.exists() ? s.data() : null).catch(() => null),
		readSettingsDoc("service_control"),
		readSettingsDoc("broadcast_notifications"),
		readSettingsDoc("footer_config"),
		readSettingsDoc("admin_profile"),
		readSettingsDoc("audit_logs"),
		readSettingsDoc("quick_hisab_summary")
	]);
	const filteredStaff = isSubAdmin ? cloudStaff.filter((s) => s.recordedBy === currentUserId) : cloudStaff;
	const salaryMap = /* @__PURE__ */ new Map();
	[...cloudSalaries, ...cloudStaffSalaries].forEach((sal) => {
		if (sal && sal.id) {
			if (!isSubAdmin || sal.recordedBy === currentUserId) salaryMap.set(String(sal.id), sal);
		}
	});
	const filteredSalaries = Array.from(salaryMap.values());
	const filteredAyTxns = isSubAdmin ? ayTransactions.filter((t) => t.recordedBy === currentUserId) : ayTransactions;
	const filteredMainTxns = isSubAdmin ? mainTransactions.filter((t) => t.recordedBy === currentUserId) : mainTransactions;
	const filteredInventory = isSubAdmin ? cloudInventory.filter((i) => i.recordedBy === currentUserId) : cloudInventory;
	const filteredInventoryLogs = isSubAdmin ? cloudInventoryLogs.filter((l) => l.recordedBy === currentUserId) : cloudInventoryLogs;
	return {
		appName: "প্রত্যাশা ক্যাবল নেটওয়ার্ক - ক্লাউড মাস্টার ব্যাকআপ",
		backupVersion: "3.0",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		exportedBy: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.phone) || "admin",
		isPartial: isSubAdmin,
		stats: {
			staffCount: filteredStaff.length,
			salariesCount: filteredSalaries.length,
			transactionsCount: filteredMainTxns.length + filteredAyTxns.length,
			usersCount: isSubAdmin ? 0 : cloudUsers.length
		},
		firestore: {
			staff: filteredStaff,
			ay_byay_salaries: filteredSalaries,
			staff_salaries: cloudStaffSalaries,
			ay_byay_transactions: filteredAyTxns,
			transactions: filteredMainTxns,
			banners: cloudBanners,
			channels: cloudChannels,
			quick_hisab_owners: cloudOwners,
			users: cloudUsers,
			ay_byay_inventory: filteredInventory,
			ay_byay_inventory_logs: filteredInventoryLogs,
			ay_byay_config: ayConfigSnap
		},
		settings: {
			service_control: serviceControl,
			broadcast_notifications: broadcastNotifications,
			footer_config: footerConfigDoc,
			admin_profile: adminProfile,
			audit_logs: auditLogsDoc,
			quick_hisab_summary: quickHisabSummary
		},
		ayByayData: {
			transactions: filteredAyTxns,
			salaries: filteredSalaries,
			staff: filteredStaff,
			inventory: filteredInventory,
			inventoryLogs: filteredInventoryLogs,
			config: ayConfigSnap
		}
	};
}
//#endregion
export { collectMasterBackupData };
