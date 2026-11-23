import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, En as require_react, J as Plus, R as Search, Tn as ArrowDownLeft, Y as Phone, Z as Pen, Zt as CircleCheck, _ as TriangleAlert, d as Users, h as Upload, n as X, rn as Check, x as Trash2, yt as Image } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { a as toEnglishNumber, i as toBengaliNumber, t as formatCurrency } from "./chunk-formatters.js";
import { F as normalizePhoneNumber, V as initialQuickHisabOwners, _ as isNonStaffRoleAccount, g as isActualStaffAccount, h as doesOwnerMatchAccount, j as hasSubAdminPermission, tt as sounds, v as isOwnerRoleAccount, y as normalizePersonName } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
//#region src/components/StaffManagerModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var StaffManagerModal = ({ isOpen, staffAccounts, quickHisabOwners, lang, user, onClose, onSaveStaffAccounts, onDeleteStaffAccount, onDeleteStaffTransaction, onLogAction, onSubViewChange }) => {
	const isBn = lang === "bn";
	const [accounts, setAccounts] = (0, import_react.useState)(staffAccounts);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isAddStaffOpen, setIsAddStaffOpen] = (0, import_react.useState)(false);
	const [editingStaff, setEditingStaff] = (0, import_react.useState)(null);
	const [selectedStaff, setSelectedStaff] = (0, import_react.useState)(null);
	const [deletingStaff, setDeletingStaff] = (0, import_react.useState)(null);
	const [deletingTx, setDeletingTx] = (0, import_react.useState)(null);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3500);
	};
	const [entryStaff, setEntryStaff] = (0, import_react.useState)(null);
	const [editingTx, setEditingTx] = (0, import_react.useState)(null);
	const [entryType, setEntryType] = (0, import_react.useState)("due");
	const [entryAmount, setEntryAmount] = (0, import_react.useState)("");
	const [entryUserName, setEntryUserName] = (0, import_react.useState)("");
	const [entryCustomerName, setEntryCustomerName] = (0, import_react.useState)("");
	const [entryAddress, setEntryAddress] = (0, import_react.useState)("");
	const [entryReference, setEntryReference] = (0, import_react.useState)("");
	const [entryNote, setEntryNote] = (0, import_react.useState)("");
	const [entryDate, setEntryDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	});
	const [staffName, setStaffName] = (0, import_react.useState)("");
	const [staffPhone, setStaffPhone] = (0, import_react.useState)("");
	const [staffRole, setStaffRole] = (0, import_react.useState)("লাইন টেকনিশিয়ান");
	const [staffAddress, setStaffAddress] = (0, import_react.useState)("");
	const [staffReference, setStaffReference] = (0, import_react.useState)("");
	const [staffAvatar, setStaffAvatar] = (0, import_react.useState)("");
	const [staffNotes, setStaffNotes] = (0, import_react.useState)("");
	const [initialDue, setInitialDue] = (0, import_react.useState)("");
	const [dueViewMode, setDueViewMode] = (0, import_react.useState)("due");
	const [accountSourceMode, setAccountSourceMode] = (0, import_react.useState)("staff");
	const [selectedStaffOptionId, setSelectedStaffOptionId] = (0, import_react.useState)("");
	const [selectedOwnerOptionId, setSelectedOwnerOptionId] = (0, import_react.useState)("");
	const staffRoster = import_react.useMemo(() => {
		return (accounts || []).filter(isActualStaffAccount);
	}, [accounts]);
	const uniqueOwners = import_react.useMemo(() => {
		const source = quickHisabOwners && quickHisabOwners.length > 0 ? quickHisabOwners : initialQuickHisabOwners;
		const seen = /* @__PURE__ */ new Set();
		return (source || []).filter((o) => {
			if (!o || !o.name) return false;
			const phoneKey = normalizePhoneNumber(toEnglishNumber(o.phone || ""));
			const nameKey = normalizePersonName(o.name, true);
			const key = phoneKey.length >= 6 ? `p:${phoneKey}` : `n:${nameKey}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [quickHisabOwners]);
	const [isPrintingReport, setIsPrintingReport] = (0, import_react.useState)(false);
	const [printingStaff, setPrintingStaff] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setAccounts(staffAccounts);
	}, [staffAccounts]);
	(0, import_react.useEffect)(() => {
		if (selectedStaff) {
			const updated = accounts.find((a) => a.id === selectedStaff.id);
			if (updated) setSelectedStaff(updated);
		}
	}, [accounts]);
	const getSortedTransactions = (txs = []) => {
		return [...txs].sort((a, b) => {
			return (a.created || new Date(a.date).getTime()) - (b.created || new Date(b.date).getTime());
		});
	};
	useSubViewBack(isOpen, (selectedStaff ? 1 : 0) + (isPrintingReport ? 1 : 0) + (isAddStaffOpen ? 1 : 0) + (entryStaff || editingTx ? 1 : 0) + (deletingStaff ? 1 : 0) + (deletingTx ? 1 : 0), () => {
		if (deletingStaff) setDeletingStaff(null);
		else if (deletingTx) setDeletingTx(null);
		else if (isPrintingReport) {
			setIsPrintingReport(false);
			setPrintingStaff(null);
		} else if (isAddStaffOpen) {
			setIsAddStaffOpen(false);
			setEditingStaff(null);
		} else if (entryStaff || editingTx) {
			setEntryStaff(null);
			setEditingTx(null);
		} else if (selectedStaff) setSelectedStaff(null);
	}, onSubViewChange, "staffManager");
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				if (deletingStaff) setDeletingStaff(null);
				else if (deletingTx) setDeletingTx(null);
				else if (isPrintingReport) {
					setIsPrintingReport(false);
					setPrintingStaff(null);
				} else if (isAddStaffOpen) {
					setIsAddStaffOpen(false);
					setEditingStaff(null);
				} else if (entryStaff || editingTx) {
					setEntryStaff(null);
					setEditingTx(null);
				} else if (selectedStaff) setSelectedStaff(null);
				else onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		isOpen,
		isAddStaffOpen,
		entryStaff,
		editingTx,
		selectedStaff,
		isPrintingReport,
		deletingStaff,
		deletingTx,
		onClose
	]);
	const accountsWithDue = import_react.useMemo(() => accounts.filter((a) => (a.remainingDue || 0) > 0), [accounts]);
	const settledAccounts = import_react.useMemo(() => accounts.filter((a) => (a.remainingDue || 0) <= 0 && ((a.totalDue || 0) > 0 || (a.totalCollected || 0) > 0 || a.transactions && a.transactions.length > 0)), [accounts]);
	const reportAccounts = import_react.useMemo(() => accounts.filter((a) => (a.remainingDue || 0) > 0 || (a.totalDue || 0) > 0 || (a.totalCollected || 0) > 0 || a.transactions && a.transactions.length > 0), [accounts]);
	if (!isOpen) return null;
	const totalDues = accounts.reduce((sum, a) => sum + (a.totalDue || 0), 0);
	const totalCollected = accounts.reduce((sum, a) => sum + (a.totalCollected || 0), 0);
	const netRemainingDue = accounts.reduce((sum, a) => sum + (a.remainingDue || 0), 0);
	const filteredAccounts = (dueViewMode === "settled" ? settledAccounts : accountsWithDue).filter((a) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		return (a.name || "").toLowerCase().includes(q) || (a.phone || "").toLowerCase().includes(q) || (a.role || "").toLowerCase().includes(q);
	});
	const handleAvatarUpload = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (file) try {
			const compressedDataUrl = await compressImage(file, 400, 400, .85);
			setStaffAvatar(compressedDataUrl);
			sounds.playSuccess();
		} catch (err) {
			console.error("Error compressing staff photo:", err);
		}
	};
	const canManageDues = (user === null || user === void 0 ? void 0 : user.role) === "admin" || (user === null || user === void 0 ? void 0 : user.role) === "sub-admin" && hasSubAdminPermission(user, "staffManager");
	const handleSaveStaffForm = (e) => {
		e.preventDefault();
		if (!canManageDues) {
			showToast(isBn ? "দুঃখিত, শুধুমাত্র অ্যাডমিন বা অনুমোদিত সাব-অ্যাডমিন হিসাব পরিবর্তন করতে পারবেন" : "Sorry, only admin or permitted sub-admin can modify accounts");
			return;
		}
		if (!staffName.trim()) {
			showToast(isBn ? "অনুগ্রহ করে নাম লিখুন" : "Please enter name");
			return;
		}
		const initDueVal = parseFloat(toEnglishNumber(initialDue).replace(/,/g, "")) || 0;
		let updatedList = [];
		if (editingStaff) {
			sounds.playSuccess();
			updatedList = accounts.map((a) => {
				if (a.id === editingStaff.id) return {
					...a,
					name: staffName.trim(),
					phone: staffPhone.trim(),
					role: staffRole.trim(),
					userCode: a.userCode || "",
					address: staffAddress.trim() || "",
					reference: staffReference.trim() || "",
					avatarUrl: staffAvatar || a.avatarUrl || "",
					notes: staffNotes.trim() || "",
					isActive: a.isActive !== false
				};
				return a;
			});
			if (onLogAction) onLogAction("Updated Account", "হিসাব তথ্য পরিবর্তন", `${staffName.trim()} (${staffPhone.trim()})`);
			showToast(`"${staffName.trim()}" এর তথ্য আপডেট করা হয়েছে!`);
		} else {
			const existingTargetAcc = (accountSourceMode === "staff" && selectedStaffOptionId ? accounts.find((a) => String(a.id) === String(selectedStaffOptionId)) : void 0) || (accountSourceMode === "owner" && selectedOwnerOptionId ? (() => {
				const ownerObj = uniqueOwners.find((o) => String(o.id) === String(selectedOwnerOptionId));
				return ownerObj ? accounts.find((a) => isOwnerRoleAccount(a) && doesOwnerMatchAccount(ownerObj, a)) : void 0;
			})() : void 0);
			if (initDueVal <= 0) {
				showToast(isBn ? "কোম্পানি পাওনা তালিকায় যুক্ত করতে পাওনার পরিমাণ (৳) লিখুন" : "Please enter a valid company due amount");
				return;
			}
			sounds.playSuccess();
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const todayStr = nowIso.split("T")[0];
			const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true
			});
			if (existingTargetAcc) {
				const dueTx = {
					id: `stx-${Date.now()}`,
					staffId: existingTargetAcc.id,
					type: "due",
					amount: initDueVal,
					date: todayStr,
					time: timeStr,
					userName: existingTargetAcc.userCode || "",
					customerName: staffName.trim() || existingTargetAcc.name,
					customerAddress: staffAddress.trim() || existingTargetAcc.address || "",
					reference: staffReference.trim() || existingTargetAcc.reference || "",
					note: staffNotes.trim() || "কোম্পানি পাওনা যোগ",
					recordedBy: (user === null || user === void 0 ? void 0 : user.name) || "অ্যাডমিন",
					created: Date.now()
				};
				updatedList = accounts.map((a) => {
					if (a.id !== existingTargetAcc.id) return a;
					const nextTxs = [...a.transactions || [], dueTx];
					const newTotalDue = nextTxs.filter((t) => t.type === "due").reduce((s, t) => s + (t.amount || 0), 0);
					const newTotalCollected = nextTxs.filter((t) => t.type === "collection").reduce((s, t) => s + (t.amount || 0), 0);
					return {
						...a,
						address: staffAddress.trim() || a.address || "",
						reference: staffReference.trim() || a.reference || "",
						avatarUrl: staffAvatar || a.avatarUrl || "",
						notes: staffNotes.trim() || a.notes || "",
						totalDue: newTotalDue,
						totalCollected: newTotalCollected,
						remainingDue: newTotalDue - newTotalCollected,
						transactions: nextTxs
					};
				});
				if (onLogAction) onLogAction("Added Company Due", "কোম্পানি পাওনা যোগ", `${existingTargetAcc.name}: ৳${initDueVal}`);
				showToast(`"${existingTargetAcc.name}" এর খাতায় ${formatCurrency(initDueVal, lang)} কোম্পানি পাওনা যোগ হয়েছে!`);
			} else {
				const newAccountId = `staff-${Date.now()}`;
				const initialTx = [{
					id: `stx-${Date.now()}`,
					staffId: newAccountId,
					type: "due",
					amount: initDueVal,
					date: todayStr,
					time: timeStr,
					userName: "",
					customerName: staffName.trim() || "",
					customerAddress: staffAddress.trim() || "",
					reference: staffReference.trim() || "",
					note: staffNotes.trim() || "কোম্পানি পাওনা বিল",
					recordedBy: (user === null || user === void 0 ? void 0 : user.name) || "অ্যাডমিন",
					created: Date.now()
				}];
				updatedList = [{
					id: newAccountId,
					name: staffName.trim(),
					phone: staffPhone.trim() || "01700000000",
					role: staffRole.trim() || "সাধারণ সদস্য / গ্রাহক",
					userCode: "",
					address: staffAddress.trim() || "",
					reference: staffReference.trim() || "",
					avatarUrl: staffAvatar || "",
					totalDue: initDueVal,
					totalCollected: 0,
					remainingDue: initDueVal,
					notes: staffNotes.trim() || "",
					isActive: true,
					baseSalary: 0,
					recordedBy: (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.name) || "admin",
					createdAt: nowIso,
					transactions: initialTx
				}, ...accounts];
				if (onLogAction) onLogAction("Added Company Due Account", "নতুন কোম্পানি পাওনা হিসাব যোগ", `${staffName.trim()} (${staffRole.trim()}): ৳${initDueVal}`);
				showToast(`"${staffName.trim()}" এর কোম্পানি পাওনা হিসাব তৈরি হয়েছে!`);
			}
		}
		const sanitizedList = JSON.parse(JSON.stringify(updatedList));
		setAccounts(sanitizedList);
		onSaveStaffAccounts(sanitizedList);
		setDueViewMode("due");
		setIsAddStaffOpen(false);
		setEditingStaff(null);
		setSelectedStaffOptionId("");
		setSelectedOwnerOptionId("");
		setStaffName("");
		setStaffPhone("");
		setStaffRole("লাইন টেকনিশিয়ান");
		setStaffAddress("");
		setStaffReference("");
		setStaffAvatar("");
		setStaffNotes("");
		setInitialDue("");
	};
	const handleSelectStaffForAccount = (staffId) => {
		setSelectedStaffOptionId(staffId);
		if (!staffId) return;
		const picked = staffRoster.find((s) => String(s.id) === String(staffId));
		if (!picked) return;
		sounds.playTap();
		setStaffRole(picked.role || "লাইন টেকনিশিয়ান");
		setStaffName(picked.name.trim());
		setStaffPhone((picked.phone || "").trim());
		setStaffAddress((picked.address || "").trim());
		setStaffReference((picked.reference || "").trim());
		setStaffAvatar(picked.avatarUrl || "");
		if (picked.notes) setStaffNotes(picked.notes.trim());
	};
	const handleSelectOwnerForAccount = (ownerId) => {
		setSelectedOwnerOptionId(ownerId);
		if (!ownerId) return;
		const owner = uniqueOwners.find((o) => String(o.id) === String(ownerId));
		if (!owner) return;
		sounds.playTap();
		setStaffRole("মালিক / অংশীদার");
		setStaffName(owner.name.trim());
		setStaffPhone((owner.phone || "").trim());
		setStaffAddress((owner.address || "").trim());
		if (owner.avatarUrl) setStaffAvatar(owner.avatarUrl);
		if (owner.notes && !staffNotes.trim()) setStaffNotes(owner.notes.trim());
	};
	const handleOpenEditStaff = (staff) => {
		if (!canManageDues) {
			showToast(isBn ? "হিসাব পরিবর্তন করার অনুমতি নেই" : "Permission denied");
			return;
		}
		sounds.playTap();
		setEditingStaff(staff);
		const matchedOwner = uniqueOwners.find((o) => doesOwnerMatchAccount(o, staff));
		setSelectedOwnerOptionId(matchedOwner ? String(matchedOwner.id) : "");
		setSelectedStaffOptionId(isActualStaffAccount(staff) ? String(staff.id) : "");
		setStaffName(staff.name);
		setStaffPhone(staff.phone);
		setStaffRole(staff.role);
		setStaffAddress(staff.address || "");
		setStaffReference(staff.reference || "");
		setStaffAvatar(staff.avatarUrl || "");
		setStaffNotes(staff.notes || "");
		setInitialDue("");
		setIsAddStaffOpen(true);
		window.history.pushState({ staffModal: "edit" }, "");
	};
	const handleRequestDeleteStaff = (staff) => {
		if (!canManageDues) {
			showToast(isBn ? "ডিলিট করার অনুমতি নেই" : "Permission denied");
			return;
		}
		sounds.playTap();
		setDeletingStaff(staff);
		window.history.pushState({ staffModal: "deleteStaff" }, "");
	};
	const handleConfirmDeleteStaff = () => {
		if (!deletingStaff || !canManageDues) return;
		sounds.playSuccess();
		const staffId = deletingStaff.id;
		const staffName = deletingStaff.name;
		const updated = accounts.filter((a) => a.id !== staffId);
		setAccounts(updated);
		onSaveStaffAccounts(updated);
		if (onDeleteStaffAccount) onDeleteStaffAccount(staffId);
		if ((selectedStaff === null || selectedStaff === void 0 ? void 0 : selectedStaff.id) === staffId) setSelectedStaff(null);
		if (onLogAction) onLogAction("Deleted Staff", "স্টাফ অ্যাকাউন্ট বাতিল", `Name: ${staffName}`);
		setDeletingStaff(null);
		showToast(`"${staffName}" স্টাফ অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!`);
	};
	const handleCloseEntry = () => {
		setEntryStaff(null);
		setEditingTx(null);
		setEntryAmount("");
		setEntryUserName("");
		setEntryCustomerName("");
		setEntryAddress("");
		setEntryReference("");
		setEntryNote("");
	};
	const handleOpenEntry = (staff, type) => {
		if (!canManageDues) {
			showToast(isBn ? "হিসাব পরিবর্তন করার অনুমতি নেই" : "Permission denied");
			return;
		}
		sounds.playTap();
		setEditingTx(null);
		setEntryStaff(staff);
		setEntryType(type);
		setEntryAmount("");
		setEntryUserName(staff.userCode || "");
		setEntryCustomerName(isOwnerRoleAccount(staff) ? staff.name : "");
		setEntryAddress(staff.address || "");
		setEntryReference(staff.reference || "");
		setEntryNote("");
		setEntryDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		window.history.pushState({ staffModal: "entry" }, "");
	};
	const handleOpenEditTx = (staff, tx) => {
		if (!canManageDues) {
			showToast(isBn ? "লেনদেন পরিবর্তন করার অনুমতি নেই" : "Permission denied");
			return;
		}
		sounds.playTap();
		setEditingTx(tx);
		setEntryStaff(staff);
		setEntryType(tx.type);
		setEntryAmount(tx.amount.toString());
		setEntryUserName(tx.userName || "");
		setEntryCustomerName(tx.customerName || "");
		setEntryAddress(tx.customerAddress || "");
		setEntryReference(tx.reference || "");
		setEntryNote(tx.note || "");
		setEntryDate(tx.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		window.history.pushState({ staffModal: "entry" }, "");
	};
	const handleSaveEntry = (e) => {
		e.preventDefault();
		if (!canManageDues) {
			showToast(isBn ? "হিসাব পরিবর্তন করার অনুমতি নেই" : "Permission denied");
			return;
		}
		if (!entryStaff) return;
		const amt = parseFloat(toEnglishNumber(entryAmount).replace(/,/g, ""));
		if (isNaN(amt) || amt <= 0) {
			showToast(isBn ? "দয়া করে সঠিক টাকার পরিমাণ দিন" : "Please enter a valid amount");
			return;
		}
		sounds.playSuccess();
		if (editingTx) {
			const updatedTx = {
				...editingTx,
				type: entryType,
				amount: amt,
				date: entryDate,
				userName: entryUserName.trim() || "",
				customerName: entryCustomerName.trim() || "",
				customerAddress: entryAddress.trim() || "",
				reference: entryReference.trim() || "",
				note: entryNote.trim() || (entryCustomerName.trim() ? entryCustomerName.trim() : entryType === "due" ? "কোম্পানি পাওনা বিল" : "স্টাফ কালেকশন ক্যাশ জমা"),
				recordedBy: (user === null || user === void 0 ? void 0 : user.name) || editingTx.recordedBy || "অ্যাডমিন"
			};
			const updatedList = accounts.map((a) => {
				if (a.id === entryStaff.id) {
					const txs = (a.transactions || []).map((t) => t.id === editingTx.id ? updatedTx : t);
					const newTotalDue = txs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
					const newTotalCollected = txs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
					const newRemaining = newTotalDue - newTotalCollected;
					const updatedAccount = {
						...a,
						totalDue: newTotalDue,
						totalCollected: newTotalCollected,
						remainingDue: newRemaining,
						transactions: txs
					};
					if (selectedStaff && selectedStaff.id === a.id) setSelectedStaff(updatedAccount);
					return updatedAccount;
				}
				return a;
			});
			const sanitizedList = JSON.parse(JSON.stringify(updatedList));
			setAccounts(sanitizedList);
			onSaveStaffAccounts(sanitizedList);
			if (onLogAction) onLogAction("Staff Transaction Edited", "স্টাফ লেনদেন পরিবর্তন", `${entryStaff.name} [${entryUserName.trim() || "সাধারণ"}]: ৳${amt}`);
			handleCloseEntry();
			showToast("লেনদেন রেকর্ড সফলভাবে পরিবর্তন করা হয়েছে!");
			return;
		}
		const timeFormatted = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
		const newTx = {
			id: `stx-${Date.now()}`,
			staffId: entryStaff.id,
			type: entryType,
			amount: amt,
			date: entryDate,
			time: timeFormatted,
			userName: entryUserName.trim() || "",
			customerName: entryCustomerName.trim() || "",
			customerAddress: entryAddress.trim() || "",
			reference: entryReference.trim() || "",
			note: entryNote.trim() || (entryCustomerName.trim() ? entryCustomerName.trim() : entryType === "due" ? "কোম্পানি পাওনা বিল" : "স্টাফ কালেকশন ক্যাশ জমা"),
			recordedBy: (user === null || user === void 0 ? void 0 : user.name) || "অ্যাডমিন",
			created: Date.now()
		};
		const updatedList = accounts.map((a) => {
			if (a.id === entryStaff.id) {
				const txs = [...a.transactions || [], newTx];
				const newTotalDue = txs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
				const newTotalCollected = txs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
				const newRemaining = newTotalDue - newTotalCollected;
				const updatedAccount = {
					...a,
					totalDue: newTotalDue,
					totalCollected: newTotalCollected,
					remainingDue: newRemaining,
					transactions: txs
				};
				if (selectedStaff && selectedStaff.id === a.id) setSelectedStaff(updatedAccount);
				return updatedAccount;
			}
			return a;
		});
		const sanitizedList = JSON.parse(JSON.stringify(updatedList));
		setAccounts(sanitizedList);
		onSaveStaffAccounts(sanitizedList);
		if (onLogAction) onLogAction(entryType === "due" ? "Staff Due Added" : "Staff Collection Recorded", entryType === "due" ? "স্টাফ পাওনা যোগ" : "স্টাফ কালেকশন জমা", `${entryStaff.name} [${entryUserName.trim() || "সাধারণ"}]: ৳${amt}`);
		handleCloseEntry();
		showToast(`${entryType === "due" ? "পাওনা এন্ট্রি" : "কালেকশন জমা"} সফলভাবে সংরক্ষিত হয়েছে!`);
	};
	const handleRequestDeleteTx = (staffId, tx) => {
		if (!canManageDues) {
			showToast(isBn ? "ডিলিট করার অনুমতি নেই" : "Permission denied");
			return;
		}
		sounds.playTap();
		setDeletingTx({
			staffId,
			txId: tx.id,
			note: tx.note || (tx.type === "due" ? "কোম্পানি পাওনা" : "স্টাফ কালেকশন জমা"),
			amount: tx.amount
		});
		window.history.pushState({ staffModal: "deleteTx" }, "");
	};
	const handleConfirmDeleteTx = () => {
		if (!deletingTx || !canManageDues) return;
		sounds.playSuccess();
		const { staffId, txId } = deletingTx;
		let targetUpdatedStaff = null;
		const updatedList = accounts.map((a) => {
			if (a.id === staffId) {
				const updatedTxs = (a.transactions || []).filter((t) => {
					const tid = String(t.id || "").trim();
					const targetId = String(txId || "").trim();
					if (tid && targetId && tid === targetId) return false;
					if (!tid && t.amount === deletingTx.amount && t.note === deletingTx.note) return false;
					return true;
				});
				const newTotalDue = updatedTxs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
				const newTotalCollected = updatedTxs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
				const newRemaining = newTotalDue - newTotalCollected;
				const updatedStaff = {
					...a,
					totalDue: newTotalDue,
					totalCollected: newTotalCollected,
					remainingDue: newRemaining,
					transactions: updatedTxs
				};
				targetUpdatedStaff = updatedStaff;
				return updatedStaff;
			}
			return a;
		});
		const sanitizedList = JSON.parse(JSON.stringify(updatedList));
		setAccounts(sanitizedList);
		if (targetUpdatedStaff && selectedStaff && selectedStaff.id === staffId) setSelectedStaff(targetUpdatedStaff);
		setDeletingTx(null);
		onSaveStaffAccounts(sanitizedList);
		if (onDeleteStaffTransaction) onDeleteStaffTransaction(staffId, txId);
		if (onLogAction) onLogAction("Staff Transaction Deleted", "স্টাফ লেনদেন এন্ট্রি বাতিল", `Staff: ${staffId}, Entry: ${txId}`);
		showToast("লেনদেন রেকর্ড সফলভাবে মুছে ফেলা হয়েছে এবং ক্লাউডে সংরক্ষিত হয়েছে!");
	};
	const handlePrintPDF = (staffArg) => {
		try {
			sounds.playSuccess();
			const validStaff = staffArg && typeof staffArg === "object" && "id" in staffArg && "name" in staffArg && !("nativeEvent" in staffArg) ? staffArg : null;
			setPrintingStaff(validStaff);
			setIsPrintingReport(true);
			window.history.pushState({ staffModal: "print" }, "");
			setTimeout(() => {
				try {
					window.print();
				} catch {}
			}, 350);
		} catch (e) {
			console.error("Error initiating print report:", e);
			setIsPrintingReport(false);
			setPrintingStaff(null);
			showToast(isBn ? "রিপোর্ট তৈরিতে সমস্যা হয়েছে" : "Failed to generate report");
		}
	};
	const handleDownloadDirectFile = () => {
		sounds.playSuccess();
		const docTitle = printingStaff ? `${printingStaff.name}_স্টাফ_হিসাব_রিপোর্ট` : "স্টাফ_কালেকশন_ও_কোম্পানি_পাওনা_রিপোর্ট";
		const filename = `${docTitle}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.html`;
		const currentMonth = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(/* @__PURE__ */ new Date());
		const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Hind Siliguri', sans-serif; background-color: #ffffff; color: #000; margin: 0; padding: 24px; }
    .report-wrapper { max-width: 820px; margin: 0 auto; }
    
    .ledger-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; font-weight: bold; font-size: 16px; }
    .staff-title { font-size: 18px; font-weight: 700; text-decoration: none; text-align: center; flex: 1; }
    .month-title { font-size: 15px; font-weight: 700; white-space: nowrap; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background-color: #cbd5e1; border: 1.5px solid #000; padding: 7px 4px; text-align: center; font-weight: 700; color: #000; }
    td { border: 1.5px solid #000; padding: 6px 6px; text-align: center; color: #000; height: 26px; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }

    .sig-section { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 40px; }
    .sig-box { border-top: 1.5px solid #000; width: 160px; text-align: center; font-size: 13px; font-weight: bold; padding-top: 6px; }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-wrapper">
    ${printingStaff ? `
      <div class="ledger-top">
        <div style="width: 100px;"></div>
        <div class="staff-title">${printingStaff.name} হিসাব</div>
        <div class="month-title">মাস ঃ ${currentMonth}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 7%;">ক্রমিক</th>
            <th style="width: 13%;">তারিখ</th>
            <th style="width: 12%;">ইউজার</th>
            <th style="width: 26%;">নাম</th>
            <th style="width: 18%;">ঠিকানা</th>
            <th style="width: 10%;">টাকা</th>
            <th style="width: 8%;">রেফারেন্স</th>
            <th style="width: 6%;">স্টাটাস</th>
          </tr>
        </thead>
        <tbody>
          ${getSortedTransactions(printingStaff.transactions || []).map((tx, idx) => `
            <tr>
              <td>${toBengaliNumber(idx + 1)}</td>
              <td>${tx.date || "-"}</td>
              <td>${tx.userName || "-"}</td>
              <td class="text-left font-bold">${tx.customerName || tx.note || "-"}</td>
              <td class="text-left">${tx.customerAddress || "-"}</td>
              <td class="text-right font-bold">${toBengaliNumber(tx.amount)}</td>
              <td>${tx.reference || "-"}</td>
              <td class="font-bold">${tx.type === "due" ? "পাওনা" : "জমা"}</td>
            </tr>
          `).join("")}
          ${Array.from({ length: Math.max(0, 16 - (printingStaff.transactions || []).length) }).map(() => `
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `).join("")}
          <tr class="font-bold">
            <td colspan="5" class="text-right" style="padding-right: 15px;">মোট</td>
            <td class="text-right font-bold">${toBengaliNumber(printingStaff.totalDue || 0)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    ` : `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px;">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h2>
        <p style="margin: 4px 0; font-size: 13px;">কালেকশন ও কোম্পানি পাওনা সার্বিক অডিট রিপোর্ট</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>নাম ও পরিচয় / পদবী</th>
            <th>ফোন নম্বর</th>
            <th>মোট পাওনা</th>
            <th>কালেকশন জমা</th>
            <th>অবশিষ্ট পাওনা</th>
          </tr>
        </thead>
        <tbody>
          ${reportAccounts.map((st, idx) => `
            <tr>
              <td>${toBengaliNumber(idx + 1)}</td>
              <td class="text-left font-bold">${st.name} (${st.role})</td>
              <td>${st.phone}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.totalDue)}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.totalCollected)}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.remainingDue)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}

    <div class="sig-section">
      <div class="sig-box">হিসাবরক্ষক স্বাক্ষর</div>
      <div class="sig-box">অ্যাডমিন অনুমোদন</div>
    </div>
  </div>
</body>
</html>`;
		const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, 250);
		showToast("রিপোর্ট ফাইলটি সরাসরি আপনার ডিভাইসে সেভ হয়েছে!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-bottom duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `print:block ${isPrintingReport ? "block" : "hidden"} fixed inset-0 z-[100] bg-white text-slate-900 p-4 sm:p-8 overflow-y-auto`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "printable-staff-report",
					className: "max-w-3xl mx-auto space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b-2 border-slate-900 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-black uppercase text-slate-900 tracking-tight",
									children: "প্রত্যাশা ক্যাবল নেটওয়ার্ক"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-600 mt-1",
									children: printingStaff ? `ব্যক্তিগত হিসাব খাতা অডিট রিপোর্ট - ${printingStaff.name}` : "কালেকশন ও কোম্পানি পাওনা খাতা অডিট রিপোর্ট"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500",
									children: "হেড অফিস: ইসলামপুর ও জামালপুর অঞ্চল | হেল্পলাইন: ০১৭৭৭-৮৭৭২০৭"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-md inline-block",
										children: "অফিসিয়াল রিপোর্ট"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] font-bold text-slate-600 mt-2",
										children: ["তারিখ: ", (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-slate-500",
										children: ["প্রিন্ট সময়: ", (/* @__PURE__ */ new Date()).toLocaleTimeString("bn-BD", {
											hour: "2-digit",
											minute: "2-digit",
											hour12: true
										})]
									})
								]
							})]
						}),
						printingStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300",
									children: [printingStaff.avatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: printingStaff.avatarUrl,
										alt: printingStaff.name,
										className: "w-14 h-14 rounded-xl object-cover border border-slate-300"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "text-lg font-black text-slate-900",
												children: printingStaff.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-slate-600 font-bold",
												children: [
													printingStaff.role,
													" • ফোন: ",
													printingStaff.phone
												]
											}),
											printingStaff.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-slate-500 mt-0.5",
												children: ["নোট: ", printingStaff.notes]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 uppercase",
											children: "মোট কোম্পানি পাওনা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-rose-700",
											children: formatCurrency(printingStaff.totalDue, lang)
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-x border-slate-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-bold text-slate-500 uppercase",
												children: "মোট কালেকশন জমা"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-lg font-black text-emerald-700",
												children: formatCurrency(printingStaff.totalCollected, lang)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 uppercase",
											children: "নীট অবশিষ্ট পাওনা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-slate-900",
											children: formatCurrency(printingStaff.remainingDue, lang)
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center border-b-2 border-black pb-2 text-sm font-bold text-slate-900",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-base font-black",
											children: [printingStaff.name, " হিসাব"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["মাস : ", new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(/* @__PURE__ */ new Date())] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full border-collapse border border-black text-xs text-slate-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "bg-slate-200 text-slate-900 font-bold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-center w-12",
														children: "ক্রমিক"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-center w-24",
														children: "তারিখ"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-center w-20",
														children: "ইউজার"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-left",
														children: "নাম"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-left",
														children: "ঠিকানা"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-right w-20",
														children: "টাকা"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-center w-20",
														children: "রেফারেন্স"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "border border-black p-2 text-center w-16",
														children: "স্টাটাস"
													})
												]
											}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
												getSortedTransactions(printingStaff.transactions || []).map((tx, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-slate-50",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-center font-bold",
															children: toBengaliNumber(idx + 1)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-center",
															children: tx.date || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-center",
															children: tx.userName || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-left font-medium",
															children: tx.customerName || tx.note || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-left",
															children: tx.customerAddress || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-right font-black",
															children: toBengaliNumber(tx.amount)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-center",
															children: tx.reference || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-center font-bold text-rose-600",
															children: tx.type === "due" ? "পাওনা" : "জমা"
														})
													]
												}, tx.id || idx)),
												Array.from({ length: Math.max(0, 10 - (printingStaff.transactions || []).length) }).map((_, emptyIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 h-7 text-center" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-left" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-left" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-right" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" })
												] }, `empty-${emptyIdx}`)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "font-bold bg-slate-100 text-slate-900",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															colSpan: 5,
															className: "border border-black p-2 text-right pr-4 font-black",
															children: "মোট"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "border border-black p-2 text-right font-black",
															children: toBengaliNumber(printingStaff.totalDue || 0)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black p-2 text-center" })
													]
												})
											] })]
										})
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 uppercase",
											children: "মোট কোম্পানি পাওনা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-rose-700",
											children: formatCurrency(totalDues, lang)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center border-x border-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 uppercase",
											children: "মোট সংগৃহীত / জমা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-emerald-700",
											children: formatCurrency(totalCollected, lang)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-500 uppercase",
											children: "নীট অবশিষ্ট পাওনা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-lg font-black text-indigo-900",
											children: formatCurrency(netRemainingDue, lang)
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold uppercase text-slate-700 mb-2",
								children: [
									"কোম্পানি পাওনা হিসাব বিবরণী টেবিল (মোট ",
									reportAccounts.length,
									" জন)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse border border-slate-300 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-slate-200 text-slate-800 font-bold border-b border-slate-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300",
											children: "ক্রমিক"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300",
											children: "নাম ও পরিচয় / পদবী"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300",
											children: "ফোন নম্বর"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300 text-right",
											children: "মোট পাওনা"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300 text-right",
											children: "কালেকশন জমা"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-300 text-right",
											children: "অবশিষ্ট পাওনা"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reportAccounts.map((st, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-300 font-bold",
											children: toBengaliNumber(idx + 1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-2 border border-slate-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-slate-900",
												children: st.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-500",
												children: st.role
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-300 font-medium",
											children: st.phone
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-300 text-right font-bold text-rose-700",
											children: formatCurrency(st.totalDue, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-300 text-right font-bold text-emerald-700",
											children: formatCurrency(st.totalCollected, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-300 text-right font-bold text-slate-900",
											children: formatCurrency(st.remainingDue, lang)
										})
									]
								}, st.id)) })]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-12 flex items-center justify-between text-xs font-bold text-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center border-t border-slate-400 pt-2 w-40",
								children: "হিসাবরক্ষক স্বাক্ষর"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center border-t border-slate-400 pt-2 w-40",
								children: "অ্যাডমিন অনুমোদন"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "print:hidden flex flex-col gap-3 pt-6 border-t border-slate-200 mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleDownloadDirectFile,
									className: "h-14 rounded-2xl bg-[#00A86B] hover:bg-[#008f5a] text-white font-black text-xs flex items-center justify-center shadow-md active:scale-95 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ডিভাইসে সরাসরি ফাইল সেভ" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => window.print(),
									className: "h-14 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center shadow-md active:scale-95 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রিন্ট / PDF সেভ করুন" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setIsPrintingReport(false);
									setPrintingStaff(null);
								},
								className: "w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-all active:scale-95 border border-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বন্ধ করুন (পিছনে যান)" })
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-[#E52E2E]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-slate-900 dark:text-white leading-none",
							children: isBn ? "কালেকশন ও কোম্পানি পাওনা" : "Collection & Company Dues"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium",
							children: isBn ? "স্টাফ, মালিক ও সদস্যদের পাওনা হিসাব খাতা" : "Individual Dues & Collection Ledger"
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ক্লাউড সিঙ্ক সক্রিয়" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handlePrintPDF(),
							className: "h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all",
							title: isBn ? "পিডিএফ রিপোর্ট ডাউনলোড" : "Download PDF Report",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: isBn ? "পিডিএফ রিপোর্ট" : "PDF Report"
							})]
						}),
						canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								setEditingStaff(null);
								setAccountSourceMode("staff");
								setSelectedStaffOptionId("");
								setSelectedOwnerOptionId("");
								setStaffName("");
								setStaffPhone("");
								setStaffRole("লাইন টেকনিশিয়ান");
								setStaffAddress("");
								setStaffReference("");
								setStaffAvatar("");
								setStaffNotes("");
								setInitialDue("");
								setIsAddStaffOpen(true);
								window.history.pushState({ staffModal: "add" }, "");
							},
							className: "h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পাওনা যোগ" : "Add Due" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2.5 sm:gap-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200 dark:border-rose-900/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block",
										children: isBn ? "কোম্পানি পাওনা" : "Total Dues"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums",
										children: formatCurrency(totalDues, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 mt-0.5",
										children: isBn ? "মোট কোম্পানি পাওনা" : "Total Outstanding"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block",
										children: isBn ? "মোট কালেকশন" : "Total Collected"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums",
										children: formatCurrency(totalCollected, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 mt-0.5",
										children: isBn ? "মোট জমা হয়েছে" : "Total Received"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200 dark:border-blue-900/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block",
										children: isBn ? "অবশিষ্ট পাওনা" : "Net Due"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums",
										children: formatCurrency(netRemainingDue, lang)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 mt-0.5",
										children: isBn ? "পাওনা বাকি রয়েছে" : "Balance Due"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: isBn ? "নাম, ফোন নম্বর বা পরিচয়/পদবী দিয়ে খুঁজুন..." : "Search by name, phone or role...",
								className: "w-full h-11 pl-10 pr-4 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs"
							}),
							searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})
						]
					}),
					settledAccounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDueViewMode("due"),
							className: `h-9 rounded-xl text-xs font-bold transition-all ${dueViewMode === "due" ? "bg-[#E52E2E] text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
							children: isBn ? `বকেয়া পাওনা (${accountsWithDue.length} জন)` : `With Due (${accountsWithDue.length})`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDueViewMode("settled"),
							className: `h-9 rounded-xl text-xs font-bold transition-all ${dueViewMode === "settled" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
							children: isBn ? `পরিশোধিত (${settledAccounts.length} জন)` : `Settled (${settledAccounts.length})`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dueViewMode === "settled" ? isBn ? `পরিশোধিত তালিকা (${filteredAccounts.length} জন)` : `Settled Accounts (${filteredAccounts.length})` : isBn ? `কোম্পানি পাওনা তালিকা (${filteredAccounts.length} জন)` : `Company Due List (${filteredAccounts.length})` })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: isBn ? "কার্ডে ট্যাপ করে বিস্তারিত দেখুন" : "Tap card for full ledger"
							})]
						}), filteredAccounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-slate-600 dark:text-slate-400",
								children: dueViewMode === "settled" ? isBn ? "কোনো পরিশোধিত হিসাব পাওয়া যায়নি" : "No settled accounts found" : isBn ? "বর্তমানে কারো কাছে কোনো কোম্পানি পাওনা নেই" : "No active company dues found"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-3",
							children: filteredAccounts.map((staff) => {
								const duePercent = staff.totalDue > 0 ? Math.min(100, Math.round(staff.totalCollected / staff.totalDue * 100)) : 100;
								const isOwnerAcc = isOwnerRoleAccount(staff);
								const isNonStaffAcc = isNonStaffRoleAccount(staff);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => {
													sounds.playTap();
													setSelectedStaff(staff);
													window.history.pushState({ staffModal: "detail" }, "");
												},
												className: "flex items-center gap-3 cursor-pointer group flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 shadow-xs group-hover:scale-105 transition-transform",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-full h-full rounded-[14px] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center",
														children: staff.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: staff.avatarUrl,
															alt: staff.name,
															className: "w-full h-full object-cover"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-lg font-black text-rose-500",
															children: staff.name.substring(0, 1)
														})
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
														className: "text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors",
														children: staff.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOwnerAcc ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800" : isNonStaffAcc ? "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`,
														children: staff.role
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: staff.phone })]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: (e) => {
														e.stopPropagation();
														handlePrintPDF(staff);
													},
													className: "w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center justify-center active:scale-95",
													title: isBn ? "পিডিএফ রিপোর্ট ডাউনলোড" : "PDF Report",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" })
												}), canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleOpenEditStaff(staff),
													className: "w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95",
													title: "তথ্য পরিবর্তন",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleRequestDeleteStaff(staff),
													className: "w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95",
													title: "মুছে ফেলুন",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2 my-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] font-medium text-slate-400",
													children: isBn ? "কোম্পানি পাওনা" : "Due"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums",
													children: formatCurrency(staff.totalDue, lang)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border-x border-slate-200 dark:border-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] font-medium text-slate-400",
														children: isBn ? "কালেকশন জমা" : "Collected"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums",
														children: formatCurrency(staff.totalCollected, lang)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] font-medium text-slate-400",
													children: isBn ? "অবশিষ্ট পাওনা" : "Remaining"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-slate-900 dark:text-white tabular-nums",
													children: formatCurrency(staff.remainingDue, lang)
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-[10px] font-bold text-slate-500",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কালেকশন রিকভারি অগ্রগতি" : "Collection Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [toBengaliNumber(duePercent), "%"] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300",
													style: { width: `${duePercent}%` }
												})
											})]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800",
										children: [canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleOpenEntry(staff, "due"),
											className: "flex-1 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পাওনা যোগ" : "+ Add Due" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => handleOpenEntry(staff, "collection"),
											className: "flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-3.5 h-3.5 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কালেকশন জমা" : "+ Collection" })]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												sounds.playTap();
												setSelectedStaff(staff);
												window.history.pushState({ staffModal: "detail" }, "");
											},
											className: `${canManageDues ? "px-3" : "flex-1"} h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center active:scale-95`,
											children: isBn ? "খাতা" : "Ledger"
										})]
									})]
								}, staff.id);
							})
						})]
					})
				]
			}),
			selectedStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-base overflow-hidden",
									children: selectedStaff.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: selectedStaff.avatarUrl,
										alt: selectedStaff.name,
										className: "w-full h-full object-cover"
									}) : selectedStaff.name.substring(0, 1)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: selectedStaff.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500 font-medium",
									children: [
										selectedStaff.role,
										" • ",
										selectedStaff.phone
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ক্লাউড সিঙ্ক" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handlePrintPDF(selectedStaff),
										className: "px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 border border-rose-200/60 dark:border-rose-900/40 active:scale-95 transition-all",
										title: isBn ? "এই স্টাফের পিডিএফ রিপোর্ট ডাউনলোড" : "Download PDF Report",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পিডিএফ" : "PDF" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSelectedStaff(null),
										className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-400 font-bold",
									children: isBn ? "মোট পাওনা" : "Total Due"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-black text-rose-600 dark:text-rose-400 tabular-nums",
									children: formatCurrency(selectedStaff.totalDue, lang)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-x border-slate-200 dark:border-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 font-bold",
										children: isBn ? "কালেকশন জমা" : "Collected"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums",
										children: formatCurrency(selectedStaff.totalCollected, lang)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-400 font-bold",
									children: isBn ? "অবশিষ্ট পাওনা" : "Remaining"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-black text-slate-900 dark:text-white tabular-nums",
									children: formatCurrency(selectedStaff.remainingDue, lang)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লেনদেন ইতিহাস খাতা" : "Ledger Transactions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400",
								children: [toBengaliNumber((selectedStaff.transactions || []).length), " টি এন্ট্রি"]
							})]
						}), (selectedStaff.transactions || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 py-4 text-center",
							children: isBn ? "কোনো লেনদেন রেকর্ড পাওয়া যায়নি" : "No transactions recorded yet"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto max-h-60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left border-collapse text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "ক্রমিক"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "তারিখ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "ইউজার"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "নাম"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "ঠিকানা"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "টাকা"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "রেফারেন্স"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: "স্টাটাস"
										}),
										canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 border border-slate-200 dark:border-slate-700 text-center",
											children: "অ্যাকশন"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: getSortedTransactions(selectedStaff.transactions).map((tx, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 font-bold",
											children: toBengaliNumber(idx + 1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 whitespace-nowrap",
											children: tx.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 font-medium",
											children: tx.userName || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 font-medium",
											children: tx.customerName || tx.note || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: tx.customerAddress || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap",
											children: formatCurrency(tx.amount, lang)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700",
											children: tx.reference || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-1.5 py-0.5 rounded text-[9px] font-bold ${tx.type === "due" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"}`,
												children: tx.type === "due" ? "পাওনা" : "জমা"
											})
										}),
										canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 border border-slate-200 dark:border-slate-700 text-center whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														handleOpenEditTx(selectedStaff, tx);
													},
													className: "h-7 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold text-[11px] transition-all active:scale-95 shadow-2xs",
													title: "লেনদেন এডিট করুন",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডিট" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														handleRequestDeleteTx(selectedStaff.id, tx);
													},
													className: "h-7 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold text-[11px] transition-all active:scale-95 shadow-2xs",
													title: "লেনদেন ডিলিট করুন",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ডিলিট" })]
												})]
											})
										})
									]
								}, tx.id)) })]
							})
						})] }),
						canManageDues && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleOpenEntry(selectedStaff, "due"),
								className: "flex-1 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold active:scale-95 transition-all",
								children: "+ পাওনা যোগ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleOpenEntry(selectedStaff, "collection"),
								className: "flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold active:scale-95 transition-all",
								children: "+ কালেকশন জমা"
							})]
						})
					]
				})
			}),
			entryStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveEntry,
					className: "bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white",
								children: editingTx ? "লেনদেন এডিট ও সংশোধন করুন" : entryType === "due" ? "কোম্পানি পাওনা যোগ করুন" : "কালেকশন জমা নিন"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-500",
								children: [
									"হিসাব: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800 dark:text-slate-200",
										children: entryStaff.name
									}),
									" (",
									entryStaff.role,
									")",
									editingTx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
										children: "এডিট মোড"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCloseEntry,
								className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEntryType("due"),
								className: `py-2 rounded-xl text-xs font-bold transition-all ${entryType === "due" ? "bg-rose-500 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
								children: "কোম্পানি পাওনা (Due)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEntryType("collection"),
								className: `py-2 rounded-xl text-xs font-bold transition-all ${entryType === "collection" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
								children: "কালেকশন জমা (Collect)"
							})]
						}),
						(uniqueOwners.length > 0 || staffRoster.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-indigo-800 dark:text-indigo-300 mb-1",
								children: "মালিক বা স্টাফ তালিকা থেকে নাম সিলেক্ট করুন (অটো-ফিল)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: "",
								onChange: (e) => {
									const val = e.target.value;
									if (!val) return;
									if (val.startsWith("owner:")) {
										const oid = val.slice(6);
										const owner = uniqueOwners.find((o) => String(o.id) === oid);
										if (owner) {
											sounds.playTap();
											setEntryCustomerName(owner.name.trim());
											if (owner.address) setEntryAddress(owner.address.trim());
										}
									} else if (val.startsWith("staff:")) {
										const sid = val.slice(6);
										const st = staffRoster.find((s) => String(s.id) === sid);
										if (st) {
											sounds.playTap();
											setEntryCustomerName(st.name.trim());
											if (st.address) setEntryAddress(st.address.trim());
										}
									}
								},
								className: "w-full h-9 px-2.5 text-xs font-semibold rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "-- মালিক বা স্টাফ সিলেক্ট করলে নাম ও ঠিকানা অটো বসবে --"
									}),
									uniqueOwners.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "মালিক / অংশীদার তালিকা",
										children: uniqueOwners.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: `owner:${o.id}`,
											children: [o.name, o.phone ? ` (${o.phone})` : ""]
										}, `owner-${o.id}`))
									}),
									staffRoster.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "স্টাফ তালিকা",
										children: staffRoster.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: `staff:${s.id}`,
											children: [
												s.name,
												" — ",
												s.role,
												s.phone ? ` (${s.phone})` : ""
											]
										}, `staff-${s.id}`))
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "ইউজার (User ID)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: entryUserName,
								onChange: (e) => setEntryUserName(e.target.value),
								placeholder: "যেমন: pcn42",
								className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "নাম (মালিক / গ্রাহক)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: entryCustomerName,
								onChange: (e) => setEntryCustomerName(e.target.value),
								placeholder: "যেমন: মোঃ কাজল আলী",
								className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "ঠিকানা"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: entryAddress,
								onChange: (e) => setEntryAddress(e.target.value),
								placeholder: "যেমন: চর শিমুল চূড়া",
								className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "রেফারেন্স"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: entryReference,
								onChange: (e) => setEntryReference(e.target.value),
								placeholder: "যেমন: গতমাসের বিল বকেয়া",
								className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "টাকার পরিমাণ (৳) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: entryAmount,
								onChange: (e) => setEntryAmount(e.target.value),
								placeholder: "যেমন: ৬০০",
								className: "w-full h-10 px-3 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: "তারিখ *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								required: true,
								value: entryDate,
								onChange: (e) => setEntryDate(e.target.value),
								className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "বিবরণ / নোট"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: entryNote,
							onChange: (e) => setEntryNote(e.target.value),
							placeholder: "অতিরিক্ত মন্তব্য বা বিবরণ...",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: `w-full h-11 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${entryType === "due" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingTx ? "পরিবর্তন সংরক্ষণ করুন" : entryType === "due" ? "পাওনা রেকর্ড সংরক্ষণ করুন" : "কালেকশন জমা সংরক্ষণ করুন" })]
						})
					]
				})
			}),
			isAddStaffOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveStaffForm,
					className: "bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white",
								children: editingStaff ? "হিসাবের তথ্য পরিবর্তন করুন" : "নতুন কোম্পানি পাওনা যোগ করুন"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIsAddStaffOpen(false);
									setEditingStaff(null);
								},
								className: "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						!editingStaff && (() => {
							const selectedStaffObj = selectedStaffOptionId ? staffRoster.find((s) => String(s.id) === String(selectedStaffOptionId)) : void 0;
							const selectedOwnerObj = selectedOwnerOptionId ? uniqueOwners.find((o) => String(o.id) === String(selectedOwnerOptionId)) : void 0;
							const existingMatchedOwnerAcc = selectedOwnerObj ? accounts.find((a) => isOwnerRoleAccount(a) && doesOwnerMatchAccount(selectedOwnerObj, a)) : void 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setAccountSourceMode("staff");
													setSelectedOwnerOptionId("");
												},
												className: `py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${accountSourceMode === "staff" ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
												children: "স্টাফ সিলেক্ট"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setAccountSourceMode("owner");
													setSelectedStaffOptionId("");
													setStaffRole("মালিক / অংশীদার");
												},
												className: `py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${accountSourceMode === "owner" ? "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
												children: "মালিক সিলেক্ট"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setAccountSourceMode("custom");
													setSelectedStaffOptionId("");
													setSelectedOwnerOptionId("");
													setStaffName("");
													setStaffPhone("");
													setStaffAddress("");
													setStaffAvatar("");
													setStaffRole("সাধারণ সদস্য / গ্রাহক");
												},
												className: `py-1.5 px-2 rounded-lg text-[11px] font-bold transition ${accountSourceMode === "custom" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
												children: "সদস্য / অন্যান্য"
											})
										]
									}),
									accountSourceMode === "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-slate-700 dark:text-slate-200",
												children: "স্টাফ নির্বাচন করুন (সিলেক্ট করলে তথ্য অটো বসবে)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: selectedStaffOptionId,
												onChange: (e) => handleSelectStaffForAccount(e.target.value),
												className: "w-full h-10 px-3 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "-- তালিকা থেকে স্টাফ সিলেক্ট করুন --"
												}), staffRoster.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: String(s.id),
													children: [
														s.name,
														" (",
														s.role,
														")",
														s.remainingDue > 0 ? ` — বকেয়া ৳${s.remainingDue}` : ""
													]
												}, s.id))]
											}),
											selectedStaffObj && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] font-bold text-slate-700 dark:text-slate-200",
													children: [
														"\"",
														selectedStaffObj.name,
														"\" — বর্তমান বকেয়া: ",
														formatCurrency(selectedStaffObj.remainingDue, lang)
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setIsAddStaffOpen(false);
														setEditingStaff(null);
														setSelectedStaffOptionId("");
														handleOpenEntry(selectedStaffObj, "due");
													},
													className: "shrink-0 px-2.5 py-1.5 rounded-lg bg-[#E52E2E] text-white text-[10px] font-bold active:scale-95 transition",
													children: "+ পাওনা যোগ"
												})]
											})
										]
									}),
									accountSourceMode === "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-amber-900 dark:text-amber-200",
												children: "মালিক / অংশীদার নির্বাচন করুন (লভ্যাংশ থেকে কর্তনযোগ্য)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: selectedOwnerOptionId,
												onChange: (e) => handleSelectOwnerForAccount(e.target.value),
												className: "w-full h-10 px-3 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "-- কুইক হিসাব থেকে মালিক সিলেক্ট করুন --"
												}), uniqueOwners.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: String(o.id),
													children: [o.name, o.phone ? ` — ${o.phone}` : ""]
												}, o.id))]
											}),
											existingMatchedOwnerAcc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-700 flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] font-bold text-slate-700 dark:text-slate-200",
													children: [
														"\"",
														existingMatchedOwnerAcc.name,
														"\" এর হিসাব আছে (বকেয়া: ",
														formatCurrency(existingMatchedOwnerAcc.remainingDue, lang),
														")"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setIsAddStaffOpen(false);
														setEditingStaff(null);
														setSelectedOwnerOptionId("");
														handleOpenEntry(existingMatchedOwnerAcc, "due");
													},
													className: "shrink-0 px-2.5 py-1.5 rounded-lg bg-[#E52E2E] text-white text-[10px] font-bold active:scale-95 transition",
													children: "+ পাওনা যোগ"
												})]
											})
										]
									}),
									accountSourceMode === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-indigo-700 dark:text-indigo-300",
										children: "স্টাফ বা মালিকের বাইরে যেকোনো সাধারণ সদস্য, গ্রাহক বা ব্যক্তির কোম্পানি পাওনা নিচে লিখুন।"
									})
								]
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "ব্যক্তির নাম (স্টাফ / মালিক / সদস্য) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: staffName,
							onChange: (e) => setStaffName(e.target.value),
							placeholder: "যেমন: মোঃ আরিফুল ইসলাম / কাজী রাজু",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "মোবাইল নম্বর *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: staffPhone,
							onChange: (e) => setStaffPhone(e.target.value),
							placeholder: "যেমন: 01777877207",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "পরিচয় / পদবি *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							required: true,
							value: staffRole,
							onChange: (e) => setStaffRole(e.target.value),
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "লাইন টেকনিশিয়ান",
									children: "লাইন টেকনিশিয়ান (Line Technician)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "সিনিয়র লাইন টেকনিশিয়ান ও স্প্লাইসার",
									children: "সিনিয়র লাইন টেকনিশিয়ান ও স্প্লাইসার (Senior Tech & Splicer)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ম্যানেজার / কালেক্টর",
									children: "ম্যানেজার / কালেক্টর (Manager / Collector)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "বিল সংগ্রাহক",
									children: "বিল সংগ্রাহক (Bill Collector)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "মালিক / অংশীদার",
									children: "মালিক / অংশীদার (Owner / Partner - লভ্যাংশ থেকে কর্তন)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "সাধারণ সদস্য / গ্রাহক",
									children: "সাধারণ সদস্য / গ্রাহক (General Member / Customer - স্টাফ নয়)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "অন্যান্য",
									children: "অন্যান্য (Other - স্টাফ নয়)"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "ঠিকানা"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: staffAddress,
							onChange: (e) => setStaffAddress(e.target.value),
							placeholder: "যেমন: চর শিমুল চূড়া",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "রেফারেন্স"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: staffReference,
							onChange: (e) => setStaffReference(e.target.value),
							placeholder: "যেমন: রসিদ নং / ফিল্ড রেফারেন্স",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
							children: "ছবি (ডিভাইস থেকে আপলোড)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0",
								children: staffAvatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: staffAvatar,
									alt: "Account Preview",
									className: "w-full h-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-6 h-6 text-slate-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex-1 h-10 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-slate-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-[#E52E2E]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: staffAvatar ? "ছবি পরিবর্তন" : "ছবি সিলেক্ট করুন" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										onChange: handleAvatarUpload,
										className: "hidden"
									})
								]
							})]
						})] }),
						!editingStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "কোম্পানি পাওনার পরিমাণ (৳) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: initialDue,
							onChange: (e) => setInitialDue(e.target.value),
							placeholder: "যেমন: ১০০০",
							className: "w-full h-10 px-3 text-xs font-bold rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "নোট / বিবরণ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: staffNotes,
							onChange: (e) => setStaffNotes(e.target.value),
							placeholder: "যেমন: বকেয়া বিল বা মালামালের বিবরণ",
							className: "w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "w-full h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingStaff ? "তথ্য আপডেট করুন" : "পাওনা ও হিসাব সংরক্ষণ করুন" })]
						})
					]
				})
			}),
			toastMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed top-16 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4.5 h-4.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold",
					children: toastMessage
				})]
			}),
			deletingStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[110] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-7 h-7 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold text-slate-900 dark:text-white",
							children: "হিসাব অ্যাকাউন্ট মুছে ফেলার সম্মতি"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed",
							children: [
								"আপনি কি ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-rose-600 dark:text-rose-400",
									children: [
										"\"",
										deletingStaff.name,
										"\""
									]
								}),
								" (",
								deletingStaff.role,
								") এর সকল পাওনা ও লেনদেন খাতা স্থায়ীভাবে মুছে ফেলতে চান?"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300 font-bold text-left flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সতর্কতা: এটি স্থায়ীভাবে মুছে যাবে এবং সার্ভার থেকে কোনো ডেটা রিকভার করা সম্ভব নয়।" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingStaff(null),
								className: "flex-1 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all active:scale-95",
								children: "বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleConfirmDeleteStaff,
								className: "flex-1 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "হ্যাঁ, ডিলিট করুন" })]
							})]
						})
					]
				})
			}),
			deletingTx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[110] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-6 h-6 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold text-slate-900 dark:text-white",
							children: "লেনদেন রসিদ মুছে ফেলা"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium",
							children: [
								"আপনি কি ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 dark:text-white",
									children: [
										"\"",
										deletingTx.note,
										"\""
									]
								}),
								" (৳",
								deletingTx.amount,
								") এন্ট্রিটি মুছে ফেলতে চান?"
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeletingTx(null),
								className: "flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all",
								children: "বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleConfirmDeleteTx,
								className: "flex-1 h-10 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মুছে ফেলুন" })]
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { StaffManagerModal };
