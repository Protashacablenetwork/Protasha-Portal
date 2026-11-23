import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, Ft as EyeOff, Pt as Eye, Qt as CircleAlert, R as Search, Z as Pen, d as Users, dt as Lock, f as User, ft as LoaderCircle, k as Smartphone, ln as Camera, lt as LogOut, n as X, nt as MonitorSmartphone, p as UserPlus, rn as Check, x as Trash2 } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, g as where, l as onSnapshot, p as query, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { B as savePersistentImage, C as getStoredUsers, S as findStoredUserByPhone, U as showConfirm, a as subscribeActiveDeviceSessions, at as handleFirestoreError, d as syncStaffOrSubAdminUserToDirectory, f as syncStaffPinEverywhere, i as getSessionAccountKey, it as db, nt as OperationType, ot as safeDeleteDoc, st as safeSetDoc, t as adminForceReleaseSession, tt as sounds, w as saveStoredUser, x as deleteStoredUser, z as getPersistentImage } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
import { n as SUB_ADMIN_PERMISSION_ITEMS, t as DEFAULT_SUB_ADMIN_PERMISSIONS } from "./chunk-types.js";
//#region src/components/UserManagementModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var UserManagementModal = ({ isOpen, lang, onClose, onUserUpdated, onSubViewChange }) => {
	const isBn = lang === "bn";
	const [users, setUsers] = (0, import_react.useState)([]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const [activeSessions, setActiveSessions] = (0, import_react.useState)({});
	const [unlockingUserId, setUnlockingUserId] = (0, import_react.useState)(null);
	const [editingUser, setEditingUser] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	const [editPin, setEditPin] = (0, import_react.useState)("");
	const [editAvatar, setEditAvatar] = (0, import_react.useState)("");
	const [editStatus, setEditStatus] = (0, import_react.useState)("active");
	const [editRole, setEditRole] = (0, import_react.useState)("user");
	const [editPermissions, setEditPermissions] = (0, import_react.useState)({ ...DEFAULT_SUB_ADMIN_PERMISSIONS });
	const [showEditPin, setShowEditPin] = (0, import_react.useState)(false);
	const [isAddingNew, setIsAddingNew] = (0, import_react.useState)(false);
	useSubViewBack(isOpen, editingUser || isAddingNew ? 1 : 0, () => {
		setEditingUser(null);
		setIsAddingNew(false);
	}, onSubViewChange, "userMgmt");
	const loadUsers = async () => {
		setIsLoading(true);
		try {
			const stored = getStoredUsers();
			let fetchedUsers = [...stored];
			try {
				const querySnapshot = await getDocs(collection(db, "users"));
				if (!querySnapshot.empty) {
					const cloudUsers = [];
					querySnapshot.forEach((docSnap) => {
						const u = docSnap.data();
						if (u && u.id && u.name) cloudUsers.push(u);
					});
					if (cloudUsers.length > 0) {
						const mergedMap = /* @__PURE__ */ new Map();
						stored.forEach((u) => mergedMap.set(u.id, u));
						cloudUsers.forEach((u) => mergedMap.set(u.id, u));
						fetchedUsers = Array.from(mergedMap.values());
					}
				}
			} catch (e) {
				console.warn("Cloud user fetch skipped, using local store:", e);
			}
			const enhanced = await Promise.all(fetchedUsers.map(async (u) => {
				if (!u.avatarUrl || u.avatarUrl.startsWith("/uploads/")) {
					const cached = await getPersistentImage(`avatar_user_${u.id}`);
					if (cached) return {
						...u,
						avatarUrl: cached
					};
					if (u.role === "admin" || u.id === "admin-primary") {
						const adminCached = await getPersistentImage("avatar_admin");
						if (adminCached) return {
							...u,
							avatarUrl: adminCached
						};
					}
				}
				return u;
			}));
			setUsers(enhanced);
		} catch (e) {
			console.error(e);
			setErrorMsg(isBn ? "ইউজার তালিকা লোড করা যায়নি" : "Failed to load user list");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		loadUsers();
		setErrorMsg("");
		setSuccessMsg("");
		let unsub = null;
		try {
			unsub = onSnapshot(collection(db, "users"), (snap) => {
				const cloudUsers = [];
				snap.forEach((docSnap) => {
					const u = docSnap.data();
					if (u && (u.id || docSnap.id) && u.name) cloudUsers.push({
						...u,
						id: u.id || docSnap.id
					});
				});
				if (cloudUsers.length > 0) {
					cloudUsers.forEach((u) => saveStoredUser(u));
					setUsers(cloudUsers);
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "users");
			});
		} catch {}
		let unsubSessions = null;
		try {
			unsubSessions = subscribeActiveDeviceSessions((sessionsMap) => {
				setActiveSessions(sessionsMap);
			});
		} catch {}
		return () => {
			if (unsub) unsub();
			if (unsubSessions) unsubSessions();
		};
	}, [isOpen]);
	if (!isOpen) return null;
	const filteredUsers = users.filter((u) => {
		const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery);
		const matchesRole = roleFilter === "all" || u.role === roleFilter;
		return matchesSearch && matchesRole;
	});
	const handleStartEdit = async (user) => {
		sounds.playTap();
		setEditingUser(user);
		setEditName(user.name);
		setEditPhone(user.phone);
		setEditPin(user.pin);
		let initialAvatar = user.avatarUrl && !user.avatarUrl.startsWith("/uploads/") ? user.avatarUrl : "";
		setEditAvatar(initialAvatar);
		if (!initialAvatar) {
			const cached = await getPersistentImage(`avatar_user_${user.id}`);
			if (cached) setEditAvatar(cached);
		}
		setEditStatus(user.status);
		setEditRole(user.role);
		setEditPermissions(user.permissions && Object.keys(user.permissions).length > 0 ? {
			...DEFAULT_SUB_ADMIN_PERMISSIONS,
			...user.permissions
		} : { ...DEFAULT_SUB_ADMIN_PERMISSIONS });
		setIsAddingNew(false);
		setErrorMsg("");
	};
	const handleStartAdd = () => {
		sounds.playTap();
		setIsAddingNew(true);
		setEditingUser(null);
		setEditName("");
		setEditPhone("");
		setEditPin("1234");
		setEditAvatar("");
		setEditStatus("active");
		setEditRole("user");
		setEditPermissions({ ...DEFAULT_SUB_ADMIN_PERMISSIONS });
		setErrorMsg("");
	};
	const toggleSubAdminPermission = (key) => {
		sounds.playTap();
		setEditPermissions((prev) => ({
			...prev,
			[key]: !prev[key]
		}));
	};
	const buildSanitizedPermissions = () => {
		const clean = {};
		SUB_ADMIN_PERMISSION_ITEMS.forEach((item) => {
			clean[item.key] = Boolean(editPermissions[item.key]);
		});
		return clean;
	};
	const handleSaveEdit = async (e) => {
		if (e) e.preventDefault();
		if (!editingUser) return;
		if (!editName.trim()) {
			setErrorMsg(isBn ? "ব্যবহারকারীর নাম আবশ্যক" : "Name is required");
			sounds.playTap();
			return;
		}
		if (!editPhone.trim()) {
			setErrorMsg(isBn ? "মোবাইল নাম্বার আবশ্যক" : "Mobile number is required");
			sounds.playTap();
			return;
		}
		if (!/^\d{4,8}$/.test(editPin.trim())) {
			setErrorMsg(isBn ? "লগইন পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে" : "PIN must be 4 to 8 digits");
			sounds.playTap();
			return;
		}
		setIsSaving(true);
		setErrorMsg("");
		sounds.playTap();
		try {
			const cleanAvatar = editAvatar && !editAvatar.startsWith("/uploads/") ? editAvatar : "";
			const resolvedPermissions = editRole === "sub-admin" ? buildSanitizedPermissions() : void 0;
			const updatedUser = {
				...editingUser,
				name: editName.trim(),
				phone: editPhone.trim(),
				pin: editPin.trim(),
				avatarUrl: cleanAvatar,
				status: editStatus,
				role: editRole,
				...resolvedPermissions ? { permissions: resolvedPermissions } : { permissions: {} },
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const rawUser = editingUser;
			const firestorePayload = {
				id: updatedUser.id,
				name: updatedUser.name,
				phone: updatedUser.phone,
				pin: updatedUser.pin,
				avatarUrl: cleanAvatar,
				role: updatedUser.role,
				permissions: resolvedPermissions || {},
				status: updatedUser.status,
				updatedAt: updatedUser.updatedAt,
				...updatedUser.createdAt ? { createdAt: updatedUser.createdAt } : {},
				...rawUser.gmail !== void 0 ? { gmail: rawUser.gmail } : {},
				...rawUser.boundMethods !== void 0 ? { boundMethods: rawUser.boundMethods } : {},
				...rawUser.readNotifications !== void 0 ? { readNotifications: rawUser.readNotifications } : {},
				...rawUser.virtualCardNumber !== void 0 ? { virtualCardNumber: rawUser.virtualCardNumber } : {},
				...rawUser.recordedBy !== void 0 ? { recordedBy: rawUser.recordedBy } : {}
			};
			saveStoredUser(updatedUser);
			await safeSetDoc(doc(db, "users", editingUser.id), firestorePayload, { merge: true });
			if (updatedUser.role === "sub-admin" || updatedUser.role === "staff") await syncStaffOrSubAdminUserToDirectory(updatedUser).catch(() => {});
			if (updatedUser.role === "staff") await syncStaffPinEverywhere({
				staffId: updatedUser.id,
				phone: updatedUser.phone,
				newPin: updatedUser.pin
			}).catch(() => {});
			if (editStatus === "suspended") await adminForceReleaseSession({
				id: editingUser.id,
				phone: editPhone.trim(),
				role: editRole,
				name: editName.trim()
			}).catch(() => {});
			sounds.playSuccess();
			setSuccessMsg(isBn ? "ব্যবহারকারীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!" : "User updated successfully!");
			setUsers((prev) => prev.map((u) => u.id === editingUser.id ? updatedUser : u));
			const saved = safeStorage.getItem("protyasha_user");
			if (saved) try {
				const cur = JSON.parse(saved);
				if (cur.id === editingUser.id || cur.phone === editingUser.phone || cur.phone === editPhone.trim()) {
					const updatedSession = {
						...cur,
						name: editName.trim(),
						phone: editPhone.trim(),
						avatarUrl: editAvatar || cur.avatarUrl,
						role: editRole,
						...resolvedPermissions ? { permissions: resolvedPermissions } : { permissions: void 0 }
					};
					safeStorage.setItem("protyasha_user", JSON.stringify(updatedSession));
					safeStorage.setItem("protyasha_admin_name", editName.trim());
					safeStorage.setItem("protyasha_admin_phone", editPhone.trim());
					if (editAvatar) safeStorage.setItem("protyasha_admin_avatar", editAvatar);
				}
			} catch {}
			if (editAvatar && editAvatar.startsWith("data:image/")) {
				savePersistentImage(`avatar_user_${editingUser.id}`, editAvatar);
				if (editingUser.id === "admin-primary" || editRole === "admin") savePersistentImage("avatar_admin", editAvatar);
			}
			if (onUserUpdated) onUserUpdated(updatedUser);
			setTimeout(() => {
				setEditingUser(null);
				setSuccessMsg("");
			}, 900);
		} catch (err) {
			console.error("Update user error:", err);
			setErrorMsg(isBn ? "আপডেট ব্যর্থ হয়েছে" : "Update failed");
		} finally {
			setIsSaving(false);
		}
	};
	const handleSaveNew = async (e) => {
		if (e) e.preventDefault();
		if (!editName.trim()) {
			setErrorMsg(isBn ? "ব্যবহারকারীর নাম আবশ্যক" : "Name is required");
			sounds.playTap();
			return;
		}
		if (!editPhone.trim()) {
			setErrorMsg(isBn ? "মোবাইল নাম্বার আবশ্যক" : "Mobile number is required");
			sounds.playTap();
			return;
		}
		if (!/^\d{4,8}$/.test(editPin.trim())) {
			setErrorMsg(isBn ? "লগইন পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে" : "PIN must be 4 to 8 digits");
			sounds.playTap();
			return;
		}
		setIsSaving(true);
		setErrorMsg("");
		sounds.playTap();
		try {
			const cleanPhone = editPhone.trim();
			if (findStoredUserByPhone(cleanPhone)) {
				setErrorMsg(isBn ? "এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে" : "Phone already exists");
				setIsSaving(false);
				return;
			}
			try {
				const q = query(collection(db, "users"), where("phone", "==", cleanPhone));
				if (!(await getDocs(q)).empty) {
					setErrorMsg(isBn ? "এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে" : "Phone already exists");
					setIsSaving(false);
					return;
				}
			} catch (e) {
				console.warn("Firestore phone duplicate check skipped:", e);
			}
			const newId = "usr_" + Date.now();
			const resolvedPermissions = editRole === "sub-admin" ? buildSanitizedPermissions() : void 0;
			const newUser = {
				id: newId,
				name: editName.trim(),
				phone: cleanPhone,
				avatarUrl: editAvatar || "",
				pin: editPin.trim(),
				role: editRole,
				...resolvedPermissions ? { permissions: resolvedPermissions } : { permissions: {} },
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				status: editStatus
			};
			saveStoredUser(newUser);
			await safeSetDoc(doc(db, "users", newId), newUser);
			if (newUser.role === "sub-admin" || newUser.role === "staff") await syncStaffOrSubAdminUserToDirectory(newUser).catch(() => {});
			if (newUser.role === "staff") await syncStaffPinEverywhere({
				staffId: newUser.id,
				phone: newUser.phone,
				newPin: newUser.pin
			}).catch(() => {});
			sounds.playSuccess();
			setSuccessMsg(isBn ? "নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে!" : "User created successfully!");
			setUsers((prev) => [newUser, ...prev]);
			setTimeout(() => {
				setIsAddingNew(false);
				setSuccessMsg("");
			}, 900);
		} catch (err) {
			console.error("Create user error:", err);
			setErrorMsg(isBn ? "তৈরি করা যায়নি" : "Creation failed");
		} finally {
			setIsSaving(false);
		}
	};
	const handleDeleteUser = async (id, name) => {
		if (!await showConfirm({
			message: isBn ? `আপনি কি নিশ্চিত যে "${name}" ব্যবহারকারীকে স্থায়ীভাবে মুছে ফেলতে চান?` : `Are you sure you want to delete user "${name}"?`,
			confirmLabel: isBn ? "মুছে ফেলুন" : "Delete",
			cancelLabel: isBn ? "বাতিল" : "Cancel",
			danger: true
		})) return;
		const targetUser = users.find((u) => u.id === id);
		sounds.playTap();
		try {
			deleteStoredUser(id);
			await safeDeleteDoc(doc(db, "users", id));
			if (targetUser) await adminForceReleaseSession({
				id: targetUser.id,
				phone: targetUser.phone,
				role: targetUser.role,
				name: targetUser.name
			}).catch(() => {});
			sounds.playSuccess();
			setSuccessMsg(isBn ? "ব্যবহারকারী মুছে ফেলা হয়েছে!" : "User deleted successfully!");
			setUsers((prev) => prev.filter((u) => u.id !== id));
			setTimeout(() => setSuccessMsg(""), 3e3);
		} catch (err) {
			console.error("Delete user error:", err);
			setErrorMsg(isBn ? "ডিলিট করা যায়নি" : "Delete failed");
		}
	};
	const handleForceUnlockDevice = async (targetUser, deviceLabel) => {
		if (!await showConfirm({
			message: isBn ? `"${targetUser.name}"-এর বর্তমান ডিভাইস (${deviceLabel}) থেকে লগআউট করে ডিভাইস লক আনলক করতে চান?` : `Force logout "${targetUser.name}" from (${deviceLabel}) and unlock device?`,
			confirmLabel: isBn ? "আনলক করুন" : "Unlock",
			cancelLabel: isBn ? "বাতিল" : "Cancel",
			danger: true
		})) return;
		sounds.playTap();
		setUnlockingUserId(targetUser.id);
		setErrorMsg("");
		try {
			await adminForceReleaseSession({
				id: targetUser.id,
				phone: targetUser.phone,
				role: targetUser.role,
				name: targetUser.name
			});
			sounds.playSuccess();
			setSuccessMsg(isBn ? `"${targetUser.name}"-এর ডিভাইস লক আনলক করা হয়েছে। এখন নতুন ডিভাইস থেকে লগইন করা যাবে।` : `Device lock cleared for "${targetUser.name}". They can now log in on a new device.`);
			setTimeout(() => setSuccessMsg(""), 4e3);
		} catch (err) {
			console.error("Device unlock error:", err);
			setErrorMsg(isBn ? "ডিভাইস আনলক করা যায়নি" : "Failed to unlock device");
		} finally {
			setUnlockingUserId(null);
		}
	};
	const handleAvatarFile = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		try {
			setIsUploadingAvatar(true);
			sounds.playTap();
			const compressedDataUrl = await compressImage(file, 400, 400, .85);
			setEditAvatar(compressedDataUrl);
			sounds.playSuccess();
		} catch (err) {
			console.error("Error compressing user avatar:", err);
			setErrorMsg(isBn ? "ছবি প্রসেস করা সম্ভব হয়নি" : "Failed to process image");
		} finally {
			setIsUploadingAvatar(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 flex items-center justify-center text-[#E52E2E]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
							children: isBn ? "ব্যবহারকারী ও একাউন্ট নিয়ন্ত্রণ" : "User Account Control"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400",
							children: isBn ? `মোট নিবন্ধিত ব্যবহারকারী: ${users.length} জন` : `Total Registered: ${users.length} users`
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [!editingUser && !isAddingNew && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleStartAdd,
							className: "flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন যোগ" : "+ Add" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sounds.playTap();
								onClose();
							},
							className: "w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-300 active:scale-95 transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					})]
				}),
				errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-2 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 border-b border-rose-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
				}),
				successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border-b border-emerald-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-4",
					children: editingUser || isAddingNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: editingUser ? handleSaveEdit : handleSaveNew,
						className: "space-y-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-800 dark:text-slate-200",
									children: editingUser ? isBn ? "ব্যবহারকারীর তথ্য পরিবর্তন করুন" : "Edit User Profile" : isBn ? "নতুন ব্যবহারকারী যোগ করুন" : "Add New User"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setEditingUser(null);
										setIsAddingNew(false);
									},
									className: "text-xs text-slate-500 hover:text-slate-800 underline",
									children: isBn ? "তালিকায় ফিরুন" : "Back to list"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-rose-400 shrink-0 shadow-xs",
									children: [isUploadingAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 text-rose-500 animate-spin" }) : editAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: editAvatar,
										alt: "User",
										className: "w-full h-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-7 h-7 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center cursor-pointer transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4 text-white drop-shadow-xs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											onChange: handleAvatarFile,
											className: "hidden"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-slate-800 dark:text-slate-200 block",
										children: isBn ? "ব্যবহারকারীর ছবি" : "User Photo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400",
										children: isUploadingAvatar ? isBn ? "ছবি কমপ্রেস ও আপলোড হচ্ছে..." : "Uploading photo..." : isBn ? "ছবি পরিবর্তন করতে উপরে ট্যাপ করুন" : "Tap photo to upload image"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: [isBn ? "নাম" : "Name", " *"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: editName,
								onChange: (e) => setEditName(e.target.value),
								required: true,
								className: "w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
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
								value: editPhone,
								onChange: (e) => setEditPhone(e.target.value),
								required: true,
								className: "w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: [isBn ? "লগইন পিন (PIN)" : "Login PIN", " *"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									inputMode: "numeric",
									pattern: "[0-9]*",
									autoComplete: "off",
									autoCorrect: "off",
									autoCapitalize: "off",
									spellCheck: false,
									"data-lpignore": "true",
									"data-1password-type": "off",
									style: { WebkitTextSecurity: showEditPin ? "none" : "disc" },
									value: editPin,
									onChange: (e) => setEditPin(e.target.value),
									required: true,
									className: "w-full h-11 pl-3.5 pr-10 text-xs font-bold tracking-widest bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowEditPin(!showEditPin),
									className: "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400",
									children: showEditPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "স্ট্যাটাস" : "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editStatus,
									onChange: (e) => setEditStatus(e.target.value),
									className: "w-full h-11 px-3 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: isBn ? "সক্রিয় (Active)" : "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "suspended",
										children: isBn ? "স্থগিত (Suspended)" : "Suspended"
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: isBn ? "রোল" : "Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editRole,
									onChange: (e) => setEditRole(e.target.value),
									className: "w-full h-11 px-3 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "user",
											children: isBn ? "সাধারণ ইউজার (শুধু দেখা)" : "Regular User (Read-Only)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "staff",
											children: isBn ? "স্টাফ (শুধু হাজিরা)" : "Staff (Attendance Only)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sub-admin",
											children: isBn ? "সাব-অ্যাডমিন (নির্ধারিত সেবা)" : "Sub-Admin (Custom Access)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "admin",
											children: isBn ? "অ্যাডমিন" : "Admin"
										})
									]
								})] })]
							}),
							editRole === "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 text-[11px] text-teal-900 dark:text-teal-200 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: isBn ? "স্টাফ অ্যাকাউন্ট সীমাবদ্ধতা:" : "Staff Account Access:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isBn ? "• এই নাম্বার ও পিন দিয়ে মূল অ্যাপে লগইন করে শুধুমাত্র \"স্টাফ হাজিরা ও ছুটি\" অপশনে নিজের হাজিরা দিতে পারবেন ও নিজের পিন পরিবর্তন করতে পারবেন। অন্য কোনো হিসাব বা ডেটা পরিবর্তন করতে পারবেন না।" : "• Logs in with phone & PIN exclusively for Staff Attendance (self check-in & own PIN change). Cannot access or modify other sections." })]
							}),
							editRole === "user" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: isBn ? "সাধারণ ইউজার (রিড-অনলি):" : "Regular User (Read-Only):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isBn ? "• মোবাইল নাম্বার ও পিন দিয়ে লগইন করতে ও তথ্য দেখতে পারবেন, তবে অ্যাপের কোনো ডেটা যোগ, এডিট বা ডিলিট করতে পারবেন না।" : "• Can sign in and view permitted pages, but cannot add, edit, or delete any records." })]
							}),
							editRole === "sub-admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-extrabold text-amber-950 dark:text-amber-200",
										children: isBn ? "সাব-অ্যাডমিন নির্দিষ্ট সেবা ও পেইজ পারমিশন" : "Sub-Admin Service & Page Permissions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-amber-800/80 dark:text-amber-300/80",
										children: isBn ? "যেসব অপশন চালু রাখবেন শুধু সেগুলোই ব্যবহার করতে পারবেন" : "Only enabled sections below will be accessible"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												setEditPermissions({ ...DEFAULT_SUB_ADMIN_PERMISSIONS });
											},
											className: "px-2 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold cursor-pointer",
											children: isBn ? "সব চালু" : "All On"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												const allOff = {};
												SUB_ADMIN_PERMISSION_ITEMS.forEach((it) => {
													allOff[it.key] = false;
												});
												setEditPermissions(allOff);
											},
											className: "px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold cursor-pointer",
											children: isBn ? "সব বন্ধ" : "All Off"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
									children: SUB_ADMIN_PERMISSION_ITEMS.map((item) => {
										const enabled = Boolean(editPermissions[item.key]);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => toggleSubAdminPermission(item.key),
											className: `p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${enabled ? "bg-white dark:bg-slate-900 border-emerald-400 dark:border-emerald-700 shadow-2xs" : "bg-slate-100/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-extrabold text-slate-900 dark:text-white truncate",
													children: isBn ? item.labelBn : item.labelEn
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1",
													children: isBn ? item.descBn : item.descEn
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${enabled ? "bg-emerald-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-4 rounded-full bg-white shadow-xs" })
											})]
										}, item.key);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setEditingUser(null);
										setIsAddingNew(false);
									},
									className: "flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold active:scale-95 transition-all",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSaving,
									onClick: editingUser ? (e) => handleSaveEdit(e) : (e) => handleSaveNew(e),
									className: "flex-1 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer",
									children: isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সংরক্ষণ করুন" : "Save Changes" })
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: isBn ? "নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন..." : "Search by name or mobile...",
									className: "w-full h-10 pl-9 pr-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#E52E2E]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800",
								children: [
									{
										id: "all",
										bn: "সব",
										en: "All"
									},
									{
										id: "sub-admin",
										bn: "সাব-অ্যাডমিন",
										en: "Sub-Admin"
									},
									{
										id: "staff",
										bn: "স্টাফ",
										en: "Staff"
									},
									{
										id: "user",
										bn: "ইউজার",
										en: "User"
									},
									{
										id: "admin",
										bn: "অ্যাডমিন",
										en: "Admin"
									}
								].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setRoleFilter(tab.id);
									},
									className: `py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer truncate px-1 ${roleFilter === tab.id ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700"}`,
									children: isBn ? tab.bn : tab.en
								}, tab.id))
							}),
							isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-slate-400",
								children: isBn ? "লোড হচ্ছে..." : "Loading users..."
							}) : filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-slate-400",
								children: isBn ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "No users found"
							}) : filteredUsers.map((u) => {
								const isAdmin = u.role === "admin";
								const isSuspended = u.status === "suspended";
								const sessionKey = getSessionAccountKey({
									id: u.id,
									phone: u.phone,
									role: u.role
								});
								const activeSession = activeSessions[sessionKey];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0",
											children: u.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: u.avatarUrl,
												alt: u.name,
												className: "w-full h-full object-cover",
												onError: (e) => {
													e.target.style.display = "none";
												}
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full h-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm",
												children: u.name.charAt(0) || "U"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "text-xs font-bold text-slate-900 dark:text-white truncate",
															children: u.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${isAdmin ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300" : u.role === "sub-admin" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : u.role === "staff" ? "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"}`,
															children: isAdmin ? isBn ? "অ্যাডমিন" : "Admin" : u.role === "sub-admin" ? isBn ? "সাব-অ্যাডমিন" : "Sub-Admin" : u.role === "staff" ? isBn ? "স্টাফ" : "Staff" : isBn ? "ইউজার" : "User"
														}),
														isSuspended && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700",
															children: isBn ? "স্থগিত" : "Suspended"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1 font-mono",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3 h-3 text-slate-400" }), u.phone]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1 font-mono text-slate-600 dark:text-slate-300 font-bold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3 text-slate-400" }), u.pin]
													})]
												}),
												activeSession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 mt-1 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/50",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorSmartphone, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `লগইন: ${activeSession.deviceLabel}` : `Active: ${activeSession.deviceLabel}` })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														disabled: unlockingUserId === u.id,
														onClick: () => handleForceUnlockDevice(u, activeSession.deviceLabel),
														className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 transition-colors cursor-pointer disabled:opacity-50",
														title: isBn ? "ডিভাইস থেকে লগআউট ও আনলক করুন" : "Force logout & unlock device",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: unlockingUserId === u.id ? isBn ? "আনলক হচ্ছে..." : "Unlocking..." : isBn ? "ডিভাইস আনলক" : "Unlock Device" })]
													})]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleStartEdit(u),
											className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors",
											title: isBn ? "এডিট করুন" : "Edit User",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" })
										}), u.id !== "admin-primary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteUser(u.id, u.name),
											className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors",
											title: isBn ? "ডিলিট করুন" : "Delete User",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})]
									})]
								}, u.id);
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							onClose();
						},
						className: "px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all",
						children: isBn ? "বন্ধ করুন" : "Close"
					})
				})
			]
		})
	});
};
//#endregion
export { UserManagementModal };
