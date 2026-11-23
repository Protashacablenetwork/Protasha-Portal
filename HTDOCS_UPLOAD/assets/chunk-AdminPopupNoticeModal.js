import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { $t as ChevronUp, En as require_react, J as Plus, L as Send, M as ShieldCheck, Pt as Eye, Q as PenLine, Sn as ArrowLeft, Zt as CircleCheck, d as Users, nn as ChevronDown, ot as Megaphone, q as Power, rn as Check, vn as BellRing, x as Trash2 } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { i as toBengaliNumber } from "./chunk-formatters.js";
import { tt as sounds } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
//#region src/components/AdminPopupNoticeModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_CONSENT_BN = "আমি এই নোটিশটি সম্পূর্ণ পড়েছি এবং এতে সম্মতি জানাচ্ছি।";
var DEFAULT_CONSENT_EN = "I have read this notice carefully and acknowledge it.";
var PRESET_TEMPLATES_BN = [
	{
		label: "মাসিক বিল নির্দেশনা",
		title: "মাসিক বিল পরিশোধ সংক্রান্ত জরুরি বিজ্ঞপ্তি",
		message: "সম্মানিত গ্রাহক ও সদস্যবৃন্দ, নির্ধারিত সময়ের মধ্যে আপনার মাসিক ক্যাবল ও ইন্টারনেট বিল পরিশোধ করে নিরবচ্ছিন্ন সংযোগ নিশ্চিত করুন। কোনো সমস্যা হলে সাপোর্ট টিকেট ওপেন করুন।",
		priority: "important"
	},
	{
		label: "সার্ভিস মেইনটেন্যান্স",
		title: "সিস্টেম ও লাইন রক্ষণাবেক্ষণ নোটিশ",
		message: "নেটওয়ার্কের গতি ও স্থায়িত্ব বৃদ্ধির জন্য আমাদের এলাকায় জরুরি রক্ষণাবেক্ষণ কাজ চলছে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।",
		priority: "urgent"
	},
	{
		label: "নতুন নীতিমালা ও সম্মতি",
		title: "নতুন অ্যাপ ব্যবহার ও সেবা নীতিমালা",
		message: "অ্যাপ ব্যবহারের নিরাপত্তা ও সেবার মান বজায় রাখতে নতুন নির্দেশনা কার্যকর করা হয়েছে। অনুগ্রহ করে নিয়মাবলি মেনে সেবা গ্রহণ করুন।",
		priority: "policy"
	}
];
var AdminPopupNoticeModal = ({ isOpen, notices, acknowledgementsByNotice, lang, currentAdminName, onClose, onSaveNotice, onToggleNoticeActive, onDeleteNotice, onPreviewNotice, onSubViewChange }) => {
	const isBn = lang === "bn";
	const [isFormOpen, setIsFormOpen] = (0, import_react.useState)(false);
	const [editingNotice, setEditingNotice] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("important");
	const [audience, setAudience] = (0, import_react.useState)("all");
	const [consentLabel, setConsentLabel] = (0, import_react.useState)(isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN);
	const [requiresConsent, setRequiresConsent] = (0, import_react.useState)(true);
	const [isActive, setIsActive] = (0, import_react.useState)(true);
	const [alsoBroadcastNotif, setAlsoBroadcastNotif] = (0, import_react.useState)(true);
	const [formError, setFormError] = (0, import_react.useState)("");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [expandedAckNoticeId, setExpandedAckNoticeId] = (0, import_react.useState)(null);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	useSubViewBack(isOpen, isFormOpen ? 1 : 0, () => {
		setIsFormOpen(false);
		setEditingNotice(null);
	}, onSubViewChange, "adminPopupNotice");
	const sortedNotices = (0, import_react.useMemo)(() => {
		return [...notices].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
	}, [notices]);
	if (!isOpen) return null;
	const showToast = (txt) => {
		setToast(txt);
		setTimeout(() => setToast(null), 2800);
	};
	const resetForm = () => {
		setEditingNotice(null);
		setTitle("");
		setMessage("");
		setPriority("important");
		setAudience("all");
		setConsentLabel(isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN);
		setRequiresConsent(true);
		setIsActive(true);
		setAlsoBroadcastNotif(true);
		setFormError("");
	};
	const openCreateForm = () => {
		sounds.playTap();
		resetForm();
		setIsFormOpen(true);
	};
	const openEditForm = (notice) => {
		sounds.playTap();
		setEditingNotice(notice);
		setTitle(notice.title);
		setMessage(notice.message);
		setPriority(notice.priority);
		setAudience(notice.audience);
		setConsentLabel(notice.consentLabel || (isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN));
		setRequiresConsent(notice.requiresConsent !== false);
		setIsActive(notice.isActive);
		setAlsoBroadcastNotif(false);
		setFormError("");
		setIsFormOpen(true);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const cleanTitle = title.trim();
		const cleanMsg = message.trim();
		if (!cleanTitle) {
			setFormError(isBn ? "অনুগ্রহ করে নোটিশের শিরোনাম লিখুন" : "Please enter notice title");
			return;
		}
		if (!cleanMsg) {
			setFormError(isBn ? "অনুগ্রহ করে নোটিশের বিস্তারিত বার্তা লিখুন" : "Please enter notice message");
			return;
		}
		setIsSaving(true);
		setFormError("");
		try {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			await onSaveNotice({
				id: (editingNotice === null || editingNotice === void 0 ? void 0 : editingNotice.id) || `pnotice_${Date.now()}`,
				title: cleanTitle.slice(0, 200),
				message: cleanMsg.slice(0, 3e3),
				priority,
				audience,
				consentLabel: (consentLabel.trim() || (isBn ? DEFAULT_CONSENT_BN : DEFAULT_CONSENT_EN)).slice(0, 300),
				requiresConsent,
				isActive,
				createdBy: (editingNotice === null || editingNotice === void 0 ? void 0 : editingNotice.createdBy) || currentAdminName || "Admin",
				createdAt: (editingNotice === null || editingNotice === void 0 ? void 0 : editingNotice.createdAt) || nowIso,
				updatedAt: nowIso
			}, !editingNotice && alsoBroadcastNotif);
			sounds.playSuccess();
			setIsFormOpen(false);
			setEditingNotice(null);
			showToast(editingNotice ? isBn ? "পপ-আপ নোটিশ আপডেট করা হয়েছে!" : "Popup notice updated!" : isBn ? "পপ-আপ নোটিশ প্রকাশিত হয়েছে! ইউজাররা অ্যাপে দেখতে পাবেন।" : "Popup notice published!");
		} finally {
			setIsSaving(false);
		}
	};
	const getPriorityBadge = (p) => {
		switch (p) {
			case "urgent": return {
				bn: "জরুরি",
				en: "Urgent",
				cls: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
			};
			case "important": return {
				bn: "গুরুত্বপূর্ণ",
				en: "Important",
				cls: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
			};
			case "policy": return {
				bn: "নীতিমালা",
				en: "Policy",
				cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
			};
			default: return {
				bn: "সাধারণ",
				en: "Info",
				cls: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
			};
		}
	};
	const getAudienceLabel = (aud) => {
		if (aud === "users") return isBn ? "লগইনকৃত ইউজার ও স্টাফ" : "Registered Users & Staff";
		if (aud === "staff") return isBn ? "শুধুমাত্র স্টাফ / সাব-এডমিন" : "Staff / Sub-Admin Only";
		return isBn ? "সকল ইউজার (ভিজিটরসহ)" : "All Users (incl. Visitors)";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							if (isFormOpen) {
								setIsFormOpen(false);
								setEditingNotice(null);
							} else onClose();
						},
						className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#E52E2E] flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-4.5 h-4.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate",
							children: isFormOpen ? editingNotice ? isBn ? "পপ-আপ নোটিশ সম্পাদনা" : "Edit Popup Notice" : isBn ? "নতুন পপ-আপ নোটিশ তৈরি" : "Create Popup Notice" : isBn ? "পপ-আপ নোটিশ ও ইউজার সম্মতি" : "Popup Notices & User Consent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
							children: isBn ? "অ্যাপ ওপেন করলেই ইউজারদের পপ-আপ বক্সে দেখানো ও সম্মতি নেওয়া" : "Show consent popup boxes to users inside the app"
						})]
					})
				]
			}), !isFormOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateForm,
				className: "h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-95 transition-all shrink-0 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন নোটিশ" : "New Notice" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 space-y-4 pb-24 max-w-3xl mx-auto w-full",
			children: [toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg animate-in fade-in duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: toast })]
			}), isFormOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4",
				children: [
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300",
						children: formError
					}),
					!editingNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5",
						children: isBn ? "দ্রুত টেমপ্লেট বাছাই করুন:" : "Quick Templates:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: PRESET_TEMPLATES_BN.map((tpl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setTitle(tpl.title);
								setMessage(tpl.message);
								setPriority(tpl.priority);
							},
							className: "px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer",
							children: ["+ ", tpl.label]
						}, idx))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: isBn ? "নোটিশের ধরন" : "Notice Priority"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-1.5",
						children: [
							{
								id: "info",
								bn: "সাধারণ নোটিশ",
								en: "General"
							},
							{
								id: "important",
								bn: "গুরুত্বপূর্ণ",
								en: "Important"
							},
							{
								id: "urgent",
								bn: "জরুরি সতর্কতা",
								en: "Urgent"
							},
							{
								id: "policy",
								bn: "নীতিমালা / সম্মতি",
								en: "Policy"
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setPriority(item.id);
							},
							className: `h-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${priority === item.id ? "bg-[#E52E2E] text-white border-[#E52E2E] shadow-xs" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`,
							children: isBn ? item.bn : item.en
						}, item.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: isBn ? "কাদের অ্যাপে দেখাবে?" : "Target Audience"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: audience,
						onChange: (e) => setAudience(e.target.value),
						className: "w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: isBn ? "সকল ইউজার (রেজিস্টার্ড ইউজার, স্টাফ ও ভিজিটর)" : "All Users (incl. Visitors)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "users",
								children: isBn ? "শুধুমাত্র লগইনকৃত ইউজার ও স্টাফ" : "Logged-in Users & Staff Only"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "staff",
								children: isBn ? "শুধুমাত্র স্টাফ ও সাব-এডমিন" : "Staff & Sub-Admins Only"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
						children: isBn ? "নোটিশের শিরোনাম" : "Notice Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						maxLength: 200,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: isBn ? "যেমন: জরুরি নেটওয়ার্ক আপগ্রেড নোটিশ" : "Enter notice title...",
						className: "w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
						children: isBn ? "বিস্তারিত নোটিশ বার্তা" : "Detailed Notice Message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						required: true,
						maxLength: 3e3,
						value: message,
						onChange: (e) => setMessage(e.target.value),
						placeholder: isBn ? "ইউজারদের পপ-আপ বক্সে যে সম্পূর্ণ নোটিশটি দেখাবে তা এখানে লিখুন..." : "Write complete notice message to display in popup box...",
						className: "w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white resize-y"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-extrabold text-slate-900 dark:text-white",
									children: isBn ? "ইউজারের সম্মতি (Checkbox Acknowledgement) বাধ্যতামূলক করুন" : "Require User Consent Checkbox"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-500 dark:text-slate-400",
									children: isBn ? "চালু থাকলে ইউজার টিক দিয়ে সম্মতি না দেওয়া পর্যন্ত পপ-আপ কনফার্ম হবে না" : "Users must tick the consent checkbox before confirming"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: requiresConsent,
									onChange: (e) => setRequiresConsent(e.target.checked),
									className: "w-4.5 h-4.5 rounded text-emerald-600 cursor-pointer"
								})]
							}),
							requiresConsent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1",
								children: isBn ? "সম্মতি চেকবক্সের লেখা" : "Consent Checkbox Label"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								maxLength: 300,
								value: consentLabel,
								onChange: (e) => setConsentLabel(e.target.value),
								className: "w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 cursor-pointer pt-1 border-t border-slate-200/80 dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-800 dark:text-slate-200",
									children: isBn ? "প্রকাশ করার সাথে সাথেই সক্রিয় (Active) রাখুন" : "Keep notice active immediately"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isActive,
									onChange: (e) => setIsActive(e.target.checked),
									className: "w-4.5 h-4.5 rounded text-emerald-600 cursor-pointer"
								})]
							}),
							!editingNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between gap-3 cursor-pointer pt-1 border-t border-slate-200/80 dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-800 dark:text-slate-200",
									children: isBn ? "নোটিফিকেশন বেল সেন্টারেও একসাথে পাঠান" : "Also send copy to Notification Bell center"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: alsoBroadcastNotif,
									onChange: (e) => setAlsoBroadcastNotif(e.target.checked),
									className: "w-4.5 h-4.5 rounded text-rose-600 cursor-pointer"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setIsFormOpen(false);
								setEditingNotice(null);
							},
							className: "flex-1 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold cursor-pointer",
							children: isBn ? "বাতিল" : "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSaving,
							className: "flex-2 h-11 px-5 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSaving ? isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." : editingNotice ? isBn ? "নোটিশ আপডেট করুন" : "Update Notice" : isBn ? "পপ-আপ নোটিশ প্রকাশ করুন" : "Publish Popup Notice" })]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-3xl bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs sm:text-sm font-black flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ইন-অ্যাপ পপ-আপ নোটিশ ও সম্মতি সিস্টেম" : "In-App Notice & Consent System" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-rose-100 leading-snug",
						children: isBn ? "এখান থেকে দেওয়া প্রতিটি সক্রিয় নোটিশ ইউজারদের অ্যাপের ভেতরে পপ-আপ হিসেবে দেখাবে ও সম্মতি রেকর্ড করবে।" : "Active notices appear as an interactive consent popup inside users’ apps."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: openCreateForm,
					className: "h-9 px-3 rounded-xl bg-white text-rose-700 text-xs font-black shrink-0 shadow-sm active:scale-95 cursor-pointer",
					children: isBn ? "+ নতুন দিন" : "+ Create"
				})]
			}), sortedNotices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-10 h-10 mx-auto text-slate-400 stroke-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-extrabold text-slate-700 dark:text-slate-200",
						children: isBn ? "এখনো কোনো পপ-আপ নোটিশ তৈরি করা হয়নি" : "No popup notices created yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: isBn ? "উপরের \"নতুন নোটিশ\" বাটনে চাপ দিয়ে ইউজারদের জন্য পপ-আপ নোটিশ পাঠান।" : "Tap \"New Notice\" above to send a consent popup to your users."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: sortedNotices.map((notice) => {
					const acks = acknowledgementsByNotice[notice.id] || [];
					const pMeta = getPriorityBadge(notice.priority);
					const isAckExpanded = expandedAckNoticeId === notice.id;
					const isConfirmDelete = confirmDeleteId === notice.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 ${notice.isActive ? "border-emerald-300/80 dark:border-emerald-800/70" : "border-slate-200 dark:border-slate-800 opacity-85"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2 py-0.5 rounded-full text-[10px] font-extrabold ${notice.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`,
											children: notice.isActive ? isBn ? "সক্রিয়" : "Active" : isBn ? "বন্ধ" : "Paused"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2 py-0.5 rounded-full text-[10px] font-extrabold ${pMeta.cls}`,
											children: isBn ? pMeta.bn : pMeta.en
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold",
											children: getAudienceLabel(notice.audience)
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-slate-400",
									children: new Date(notice.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
										day: "numeric",
										month: "short",
										year: "numeric"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-black text-slate-900 dark:text-white",
									children: notice.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-3",
									children: notice.message
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										setExpandedAckNoticeId(isAckExpanded ? null : notice.id);
									},
									className: "h-8 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer active:scale-95",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `সম্মতি দিয়েছে: ${toBengaliNumber(acks.length)} জন` : `Acknowledged: ${acks.length}` }),
										isAckExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												onPreviewNotice(notice);
											},
											className: "h-8 px-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-900/60 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রিভিউ" : "Preview" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												onToggleNoticeActive(notice);
											},
											className: `h-8 px-2.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${notice.isActive ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80" : "bg-emerald-600 text-white"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notice.isActive ? isBn ? "বন্ধ করুন" : "Pause" : isBn ? "চালু করুন" : "Activate" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => openEditForm(notice),
											className: "h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer",
											title: isBn ? "এডিট" : "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												sounds.playTap();
												setConfirmDeleteId(isConfirmDelete ? null : notice.id);
											},
											className: "h-8 w-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer",
											title: isBn ? "মুছুন" : "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})
									]
								})]
							}),
							isConfirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-rose-700 dark:text-rose-300",
									children: isBn ? "এই পপ-আপ নোটিশটি স্থায়ীভাবে মুছবেন?" : "Delete this popup notice?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setConfirmDeleteId(null),
										className: "h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer",
										children: isBn ? "না" : "No"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											await onDeleteNotice(notice.id);
											setConfirmDeleteId(null);
											showToast(isBn ? "নোটিশ মুছে ফেলা হয়েছে" : "Notice deleted");
										},
										className: "h-7 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer",
										children: isBn ? "হ্যাঁ, মুছুন" : "Delete"
									})]
								})]
							}),
							isAckExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2 animate-in fade-in duration-150",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), isBn ? "সম্মতি প্রদানকারী ইউজার তালিকা" : "Acknowledged Users Log"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: isBn ? `${toBengaliNumber(acks.length)} জন` : `${acks.length} total`
									})]
								}), acks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 py-2 text-center",
									children: isBn ? "এখনো কোনো ইউজার সম্মতি দেয়নি।" : "No acknowledgements recorded yet."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5 max-h-56 overflow-y-auto pr-1",
									children: acks.map((ack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: ack.userName
													}),
													ack.userRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase",
														children: ack.userRole
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-slate-500 dark:text-slate-400 truncate",
												children: [ack.userPhone || ack.userKey, ack.deviceLabel ? ` • ${ack.deviceLabel}` : ""]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 text-right",
											children: new Date(ack.acknowledgedAt).toLocaleString(isBn ? "bn-BD" : "en-US", {
												day: "numeric",
												month: "short",
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									}, ack.id))
								})]
							})
						]
					}, notice.id);
				})
			})] })]
		})]
	});
};
//#endregion
export { AdminPopupNoticeModal };
