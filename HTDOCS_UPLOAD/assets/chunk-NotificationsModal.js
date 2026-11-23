import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, J as Plus, Jt as CloudLightning, L as Send, O as Sparkles, Qt as CircleAlert, Sn as ArrowLeft, T as Sun, Tt as Handshake, _n as Bell, en as ChevronRight, in as CheckCheck, n as X, ot as Megaphone, st as MapPin, tt as Moon } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { i as toBengaliNumber, o as translations, t as formatCurrency } from "./chunk-formatters.js";
import { tt as sounds } from "./app.js";
//#region src/components/NotificationsModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var NotificationsModal = ({ isOpen, notifications, lang, user, onClose, onSelectNotification, onMarkAllAsRead, onSendNotification, onEditNotification, onPublishPopupNotice, initialEditingNotif }) => {
	const [filterTab, setFilterTab] = (0, import_react.useState)("all");
	const [isComposing, setIsComposing] = (0, import_react.useState)(false);
	const [editingNotif, setEditingNotif] = (0, import_react.useState)(null);
	const [notifTitle, setNotifTitle] = (0, import_react.useState)("");
	const [notifBody, setNotifBody] = (0, import_react.useState)("");
	const [notifType, setNotifType] = (0, import_react.useState)("offer");
	const [notifAmount, setNotifAmount] = (0, import_react.useState)("");
	const [notifImage, setNotifImage] = (0, import_react.useState)("");
	const [alsoShowAsPopup, setAlsoShowAsPopup] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)("");
	const isBn = lang === "bn";
	import_react.useEffect(() => {
		if (initialEditingNotif) {
			var _initialEditingNotif$;
			setEditingNotif(initialEditingNotif);
			setNotifTitle(isBn ? initialEditingNotif.titleBn : initialEditingNotif.titleEn);
			setNotifBody((isBn ? initialEditingNotif.bodyBn : initialEditingNotif.bodyEn).replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, "$1"));
			setNotifType(initialEditingNotif.type);
			setNotifAmount(((_initialEditingNotif$ = initialEditingNotif.amount) === null || _initialEditingNotif$ === void 0 ? void 0 : _initialEditingNotif$.toString()) || "");
			setNotifImage(initialEditingNotif.image || "");
			setIsComposing(true);
		}
	}, [initialEditingNotif, isBn]);
	if (!isOpen) return null;
	const t = translations[lang];
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const unreadCount = (notifications || []).filter((n) => n && !n.isRead).length;
	const readCount = (notifications || []).filter((n) => n && n.isRead).length;
	const filteredNotifications = (notifications || []).filter((n) => {
		if (!n) return false;
		if (filterTab === "unread") return !n.isRead;
		if (filterTab === "read") return n.isRead;
		return true;
	});
	const handleSend = (e) => {
		e.preventDefault();
		if (!notifTitle.trim()) {
			setFormError(isBn ? "শিরোনাম পূরণ করুন" : "Please enter title");
			return;
		}
		if (!notifBody.trim()) {
			setFormError(isBn ? "বার্তা বিবরণ লিখুন" : "Please enter message details");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const day = now.getDate();
		const month = now.toLocaleString("en-US", { month: "short" });
		const timeStr = now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
		const monthBn = {
			"Jan": "জানুয়ারি",
			"Feb": "ফেব্রুয়ারি",
			"Mar": "মার্চ",
			"Apr": "এপ্রিল",
			"May": "মে",
			"Jun": "জুন",
			"Jul": "জুলৈ",
			"Aug": "আগস্ট",
			"Sep": "সেপ্টেম্বর",
			"Oct": "অক্টোবর",
			"Nov": "নভেম্বর",
			"Dec": "ডিসেম্বর"
		}[month] || month;
		const timeFormattedBn = `${toBengaliNumber(day)} ${monthBn}, ${toBengaliNumber(timeStr)}`;
		const timeFormattedEn = `${month} ${day}, ${timeStr}`;
		if (editingNotif && onEditNotification) onEditNotification({
			...editingNotif,
			titleBn: notifTitle.trim(),
			titleEn: notifTitle.trim(),
			bodyBn: notifBody.trim(),
			bodyEn: notifBody.trim(),
			type: notifType,
			amount: notifAmount ? parseFloat(notifAmount) : void 0,
			image: notifImage.trim() || void 0
		});
		else {
			onSendNotification({
				titleBn: notifTitle.trim(),
				titleEn: notifTitle.trim(),
				bodyBn: notifBody.trim(),
				bodyEn: notifBody.trim(),
				timeBn: timeFormattedBn,
				timeEn: timeFormattedEn,
				type: notifType,
				amount: notifAmount ? parseFloat(notifAmount) : void 0,
				image: notifImage.trim() || void 0
			});
			if (alsoShowAsPopup && onPublishPopupNotice) onPublishPopupNotice({
				title: notifTitle.trim(),
				message: notifBody.trim(),
				priority: notifType === "alert" ? "urgent" : notifType === "info" ? "info" : "important"
			});
		}
		sounds.playSuccess();
		setNotifTitle("");
		setNotifBody("");
		setNotifAmount("");
		setAlsoShowAsPopup(false);
		setFormError("");
		setIsComposing(false);
		setEditingNotif(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: t.notifications
						}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60",
							children: "এডমিন প্যানেল"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onMarkAllAsRead();
						},
						className: "text-xs font-bold text-[#E52E2E] hover:underline flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200/80 active:scale-95 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সব অপঠিত পঠিত করুন" : "Mark all read" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setFilterTab("all");
						},
						className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterTab === "all" ? "bg-[#E52E2E] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সব বার্তা" : "All Messages" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-1.5 py-0.2 rounded-full text-[10px] ${filterTab === "all" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`,
							children: toBengaliNumber(notifications.length)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setFilterTab("unread");
						},
						className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterTab === "unread" ? "bg-[#E52E2E] text-white shadow-xs" : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অপঠিত (নতুন)" : "Unread" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-black animate-pulse",
							children: toBengaliNumber(unreadCount)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setFilterTab("read");
						},
						className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${filterTab === "read" ? "bg-[#E52E2E] text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পঠিত" : "Read" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-1.5 py-0.2 rounded-full text-[10px] ${filterTab === "read" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`,
							children: toBengaliNumber(readCount)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24",
				children: [
					isAdmin && !isComposing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							setIsComposing(true);
						},
						className: "w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-rose-600/20 active:scale-98 transition-all hover:brightness-105",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-5 h-5 text-white stroke-[2.5]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold",
									children: isBn ? "নতুন নোটিফিকেশন পাঠান" : "Broadcast New Notification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-normal text-rose-100",
									children: isBn ? "সকল গ্রাহক ও ভিজিটরদের কাছে বার্তা পৌঁছান" : "Send announcements or offer alerts"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4 text-white" })]
					}),
					isAdmin && isComposing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#E52E2E] shadow-xl animate-in zoom-in-95 duration-200 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-[#E52E2E]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-bold text-slate-900 dark:text-white",
										children: isBn ? "এডমিন নোটিফিকেশন তৈরি করুন" : "Compose Notification"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setIsComposing(false),
									className: "w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}),
							formError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-rose-50 text-[#E52E2E] text-xs font-semibold flex items-center gap-2 border border-rose-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formError })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSend,
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "নোটিফিকেশন ক্যাটাগরি" : "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-5 gap-1",
										children: [
											{
												id: "offer",
												label: isBn ? "অফার" : "Offer"
											},
											{
												id: "cashback",
												label: isBn ? "ক্যাশব্যাক" : "Cashback"
											},
											{
												id: "info",
												label: isBn ? "নোটিশ" : "Notice"
											},
											{
												id: "weather",
												label: isBn ? "আবহাওয়া" : "Weather"
											},
											{
												id: "alert",
												label: isBn ? "সতর্কতা" : "Alert"
											}
										].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setNotifType(cat.id),
											className: `py-1.5 px-1 rounded-xl text-[11px] font-bold border transition-all text-center ${notifType === cat.id ? "bg-[#E52E2E] text-white border-[#E52E2E] shadow-xs" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"}`,
											children: cat.label
										}, cat.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "শিরোনাম" : "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: isBn ? "যেমন: বিশেষ ক্যাবল টিভি ছাড় ও রিওয়ার্ড" : "e.g. Special Cable TV Discount",
										value: notifTitle,
										onChange: (e) => setNotifTitle(e.target.value),
										className: "w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "বিস্তারিত বার্তা" : "Message Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										placeholder: isBn ? "গ্রাহকদের জন্য সম্পূর্ণ বার্তা লিখুন..." : "Write complete notification body...",
										value: notifBody,
										onChange: (e) => setNotifBody(e.target.value),
										className: "w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E] resize-none"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "টাকার পরিমাণ (ঐচ্ছিক, বোনাস বা ক্যাশব্যাক)" : "Amount (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										placeholder: "যেমন: ৫০",
										value: notifAmount,
										onChange: (e) => setNotifAmount(e.target.value),
										className: "w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "পেইজ বা ক্যাটাগরি সিলেক্ট করুন" : "Select Page/Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: notifType,
										onChange: (e) => setNotifType(e.target.value),
										className: "w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "offer",
												children: isBn ? "অফার পেইজ" : "Offer Page"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cashback",
												children: isBn ? "ক্যাশব্যাক পেইজ" : "Cashback Page"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "trx",
												children: isBn ? "লেনদেন পেইজ" : "Transactions Page"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "info",
												children: isBn ? "তথ্য/নোটিশ পেইজ" : "Info/Notice Page"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1",
										children: isBn ? "অফার লিংক (ঐচ্ছিক)" : "Offer Link (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "https://...",
										value: notifImage,
										onChange: (e) => setNotifImage(e.target.value),
										className: "w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
									})] }),
									!editingNotif && onPublishPopupNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: alsoShowAsPopup,
											onChange: (e) => setAlsoShowAsPopup(e.target.checked),
											className: "mt-0.5 w-4 h-4 accent-[#E52E2E] rounded cursor-pointer shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug",
											children: isBn ? "অ্যাপ ওপেন করলেই ইউজারদের পপ-আপ বক্সে দেখান ও সম্মতি (Acknowledgement) নিন" : "Also display as an in-app popup box and collect user acknowledgement"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setIsComposing(false);
												setAlsoShowAsPopup(false);
											},
											className: "flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold",
											children: isBn ? "বাতিল" : "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											className: "flex-1 py-2 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নোটিফিকেশন পাঠান" : "Broadcast Now" })]
										})]
									})
								]
							})
						]
					}),
					filteredNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-12 text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-10 h-10 mx-auto mb-2 stroke-1 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold",
							children: filterTab === "unread" ? isBn ? "কোনো অপঠিত বার্তা নেই" : "No unread notifications" : filterTab === "read" ? isBn ? "কোনো পঠিত বার্তা নেই" : "No read notifications" : isBn ? "কোনো নোটিফিকেশন নেই" : "No notifications yet"
						})]
					}) : filteredNotifications.map((item) => {
						const isCashback = item.type === "cashback";
						const isFasting = Boolean(item.isFastingAlert || item.sehriIftarData);
						const isUnread = !item.isRead;
						if (isFasting) {
							const sData = item.sehriIftarData;
							const slotLabel = (sData === null || sData === void 0 ? void 0 : sData.slotType) === "sehri_reminder" ? isBn ? "সেহরি রিমাইন্ডার" : "Sehri Alert" : (sData === null || sData === void 0 ? void 0 : sData.slotType) === "iftar_reminder" ? isBn ? "ইফতার রিমাইন্ডার" : "Iftar Alert" : (sData === null || sData === void 0 ? void 0 : sData.slotType) === "iftar_time" ? isBn ? "ইফতারের সময়" : "Iftar Time" : isBn ? "সেহরি ও ইফতার সময়সূচী" : "Sehri & Iftar";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => {
									sounds.playTap();
									onSelectNotification(item);
								},
								className: `relative rounded-2xl border overflow-hidden transition-all cursor-pointer group ${isUnread ? "bg-gradient-to-br from-[#04362c] via-[#062b24] to-[#031f1a] border-emerald-500/45 text-white shadow-lg shadow-emerald-950/20" : "bg-white dark:bg-slate-900 border-emerald-200/80 dark:border-emerald-900/50 text-slate-900 dark:text-white hover:border-emerald-400/60"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 text-[11px] font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex items-center gap-1.5 min-w-0 truncate ${isUnread ? "text-amber-300" : "text-emerald-700 dark:text-emerald-400"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-3.5 h-3.5 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: slotLabel
													}),
													((sData === null || sData === void 0 ? void 0 : sData.districtBn) || item.districtBn) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1 truncate",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3 shrink-0" }), isBn ? (sData === null || sData === void 0 ? void 0 : sData.districtBn) || item.districtBn : (sData === null || sData === void 0 ? void 0 : sData.districtEn) || item.districtEn]
													})] })
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-semibold ${isUnread ? "text-emerald-200/75" : "text-slate-400"}`,
													children: isBn ? item.timeBn : item.timeEn
												}), isUnread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-black text-amber-300",
													children: isBn ? "নতুন" : "NEW"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: `text-[15px] leading-snug tracking-tight ${isUnread ? "font-black text-white" : "font-bold text-slate-900 dark:text-white"}`,
											children: isBn ? item.titleBn : item.titleEn
										}),
										sData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `grid grid-cols-3 divide-x rounded-xl border ${isUnread ? "bg-[#001f19]/80 border-emerald-500/25 divide-emerald-700/40" : "bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200/70 dark:border-emerald-900/60 divide-emerald-200/70 dark:divide-emerald-900/60"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-2.5 px-2 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-[10px] font-bold ${isUnread ? "text-emerald-200/75" : "text-slate-500 dark:text-slate-400"}`,
														children: isBn ? "সেহরি শেষ" : "Sehri End"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-xs sm:text-sm font-black tabular-nums mt-0.5 ${isUnread ? "text-amber-300" : "text-emerald-800 dark:text-amber-300"}`,
														children: sData.sehriEndBn
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-2.5 px-2 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-[10px] font-bold ${isUnread ? "text-emerald-200/75" : "text-slate-500 dark:text-slate-400"}`,
														children: isBn ? "ফজর শুরু" : "Fajr"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-xs sm:text-sm font-black tabular-nums mt-0.5 ${isUnread ? "text-white" : "text-slate-800 dark:text-slate-100"}`,
														children: sData.fajrBn
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-2.5 px-2 text-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-[10px] font-bold ${isUnread ? "text-emerald-200/75" : "text-slate-500 dark:text-slate-400"}`,
														children: isBn ? "আজকের ইফতার" : "Iftar"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `text-xs sm:text-sm font-black tabular-nums mt-0.5 ${isUnread ? "text-amber-300" : "text-amber-700 dark:text-amber-300"}`,
														children: sData.iftarBn
													})]
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs leading-relaxed line-clamp-2 whitespace-pre-line ${isUnread ? "text-emerald-100/90 font-medium" : "text-slate-600 dark:text-slate-300"}`,
											children: isBn ? item.bodyBn || item.messageBn || "" : item.bodyEn || item.messageEn || ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pt-0.5 text-[11px] font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: isUnread ? "text-emerald-200/75" : "text-slate-500 dark:text-slate-400",
												children: (sData === null || sData === void 0 ? void 0 : sData.hijriDateBn) || (isBn ? "আপনার লোকেশনের রিয়েল সময়সূচী" : "Live location schedule")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ${isUnread ? "text-amber-300" : "text-emerald-700 dark:text-emerald-400"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লাইভ সময়সূচী দেখুন" : "View Live Timetable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
											})]
										})
									]
								})
							}, item.id);
						}
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								sounds.playTap();
								onSelectNotification(item);
							},
							className: `relative p-3.5 rounded-2xl border transition-all cursor-pointer group ${isUnread ? "bg-gradient-to-r from-rose-50/90 via-[#FFF8F6] to-amber-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900/90 border-l-4 border-l-[#E52E2E] border-rose-300/80 dark:border-rose-900/70 shadow-md shadow-rose-500/5 hover:shadow-lg" : "bg-white/90 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 shadow-2xs opacity-80 hover:opacity-100 hover:border-slate-300"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										item.type === "alert" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0 shadow-xs",
											children: isBn ? "🚨 সতর্কতা" : "🚨 Alert"
										}),
										item.type === "weather" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-600 text-white shrink-0 shadow-xs",
											children: isBn ? "🌤️ আবহাওয়া" : "🌤️ Weather"
										}),
										item.type === "offer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shrink-0 shadow-xs",
											children: isBn ? "🎁 বিশেষ অফার" : "🎁 Offer"
										}),
										item.type === "cashback" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0 shadow-xs",
											children: isBn ? "💰 ক্যাশব্যাক" : "💰 Cashback"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-medium",
											children: isBn ? item.timeBn : item.timeEn
										})
									]
								}), isUnread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E52E2E] text-white text-[10px] font-extrabold shadow-xs animate-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন বার্তা" : "NEW" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold border border-slate-200/80 dark:border-slate-700/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পঠিত" : "Read" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${item.type === "alert" ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900/50" : item.type === "weather" ? "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-900/50" : isCashback || item.type === "offer" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30" : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30"}`,
									children: item.type === "alert" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudLightning, { className: "w-5 h-5 stroke-[2]" }) : item.type === "weather" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-5 h-5 stroke-[2]" }) : isCashback || item.type === "offer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "w-5 h-5 stroke-[1.8]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "w-5 h-5 stroke-[1.8]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: `text-sm tracking-tight truncate ${isUnread ? "font-black text-slate-950 dark:text-white" : "font-bold text-slate-700 dark:text-slate-300"}`,
												children: isBn ? item.titleBn : item.titleEn
											}), item.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-black text-[#E52E2E] dark:text-rose-400 shrink-0",
												children: formatCurrency(item.amount, lang)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs leading-relaxed line-clamp-2 whitespace-pre-line ${isUnread ? "font-semibold text-slate-800 dark:text-slate-100" : "font-normal text-slate-500 dark:text-slate-400"}`,
											children: isBn ? (item.bodyBn || item.messageBn || "").replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, "$1") : item.bodyEn || item.messageEn || ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-end mt-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] font-bold text-[#E52E2E] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বিস্তারিত বার্তা পড়ুন" : "Read Full Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
											})
										})
									]
								})]
							})]
						}, item.id);
					})
				]
			})
		]
	});
};
//#endregion
export { NotificationsModal };
