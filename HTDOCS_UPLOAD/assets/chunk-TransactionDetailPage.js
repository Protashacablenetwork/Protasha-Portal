import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, M as ShieldCheck, Q as PenLine, Sn as ArrowLeft, Tn as ArrowDownLeft, U as Receipt, Ut as Copy, Y as Phone, Yt as Clock, Zt as CircleCheck, bn as ArrowUpRight, dt as Lock, rn as Check, rt as MessageSquare, x as Trash2 } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { i as toBengaliNumber, n as formatTransactionDate, o as translations, t as formatCurrency } from "./chunk-formatters.js";
import { M as isSubAdmin, W as showToast, k as canModifyTransaction, tt as sounds } from "./app.js";
//#region src/components/TransactionDetailPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var TransactionDetailPage = ({ transaction, lang, user, onBack, onEdit, onDelete, onViewReceipt, onOpenLogin }) => {
	const [copiedId, setCopiedId] = import_react.useState(false);
	const [copiedPhone, setCopiedPhone] = import_react.useState(false);
	const [nowMs, setNowMs] = import_react.useState(() => Date.now());
	import_react.useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, []);
	const t = translations[lang];
	const isIncome = transaction.type === "income";
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const isSubAdmin$1 = isSubAdmin(user);
	import_react.useEffect(() => {
		if (!isSubAdmin$1) return;
		setNowMs(Date.now());
		const timer = setInterval(() => setNowMs(Date.now()), 15e3);
		return () => clearInterval(timer);
	}, [isSubAdmin$1]);
	const modCheck = canModifyTransaction(transaction, user, nowMs);
	const minsRemaining = modCheck.allowed && Number.isFinite(modCheck.remainingMs) ? Math.max(1, Math.ceil(modCheck.remainingMs / 6e4)) : 0;
	const handleCopyTrxId = () => {
		var _navigator$clipboard;
		sounds.playTap();
		(_navigator$clipboard = navigator.clipboard) === null || _navigator$clipboard === void 0 || _navigator$clipboard.writeText(transaction.trxId);
		setCopiedId(true);
		setTimeout(() => setCopiedId(false), 2e3);
	};
	const handleCopyPhone = () => {
		var _navigator$clipboard2;
		if (!transaction.phone) return;
		sounds.playTap();
		(_navigator$clipboard2 = navigator.clipboard) === null || _navigator$clipboard2 === void 0 || _navigator$clipboard2.writeText(transaction.phone);
		setCopiedPhone(true);
		setTimeout(() => setCopiedPhone(false), 2e3);
	};
	const handleCall = () => {
		sounds.playTap();
		if (transaction.phone) window.location.href = `tel:${transaction.phone}`;
		else showToast(lang === "bn" ? "ফোন নম্বর সংযুক্ত নেই" : "No phone number linked", "warning");
	};
	const handleSms = () => {
		sounds.playTap();
		const message = encodeURIComponent(`প্রত্যাশা ক্যাবল নেটওয়ার্ক: আপনার ট্রানজেকশন #${transaction.trxId}, পরিমাণ ${formatCurrency(transaction.amount, lang)} সংরক্ষিত রয়েছে। ধন্যবাদ!`);
		if (transaction.phone) window.location.href = `sms:${transaction.phone}?body=${message}`;
		else {
			var _navigator$clipboard3;
			(_navigator$clipboard3 = navigator.clipboard) === null || _navigator$clipboard3 === void 0 || _navigator$clipboard3.writeText(decodeURIComponent(message));
			showToast(lang === "bn" ? "এসএমএস টেক্সট ক্লিপবোর্ডে কপি হয়েছে" : "SMS text copied", "success");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in fade-in duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						sounds.playTap();
						onBack();
					},
					className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all",
					"aria-label": "Back",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-sm font-bold text-slate-900 dark:text-white",
					children: lang === "bn" ? "লেনদেন বিবরণ ও রশিদ" : "Transaction Details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						sounds.playTap();
						onViewReceipt(transaction);
					},
					className: "w-9 h-9 rounded-full flex items-center justify-center text-[#E52E2E] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all",
					title: lang === "bn" ? "ডিজিটাল রশিদ" : "Receipt",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-5 h-5 stroke-[2]" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 pb-28 w-full max-w-5xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-5 rounded-3xl border shadow-md relative overflow-hidden ${isIncome ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200 dark:border-emerald-900/60" : "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-200 dark:border-rose-900/60"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-10 h-10 rounded-2xl flex items-center justify-center ${isIncome ? "bg-emerald-600 text-white" : "bg-[#E52E2E] text-white"}`,
									children: isIncome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-5 h-5 stroke-[2.5]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-5 h-5 stroke-[2.5]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-bold uppercase tracking-wide ${isIncome ? "text-emerald-700 dark:text-emerald-400" : "text-[#E52E2E] dark:text-rose-400"}`,
									children: isIncome ? lang === "bn" ? "জমা এন্ট্রি" : "Income Entry" : lang === "bn" ? "খরচ এন্ট্রি" : "Expense Entry"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-slate-800 dark:text-slate-200",
									children: transaction.category || (isIncome ? "বিল কালেকশন" : "অফিস খরচ")
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "সফল" : "Success" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center my-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-slate-500 dark:text-slate-400 block mb-0.5",
								children: lang === "bn" ? "মোট লেনদেনের পরিমাণ" : "Total Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: `text-3xl font-extrabold tracking-tight tabular-nums ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-[#E52E2E] dark:text-rose-500"}`,
								children: [
									isIncome ? "+" : "-",
									" ",
									formatCurrency(transaction.amount, lang)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মাধ্যম:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#E52E2E] dark:text-rose-400 font-extrabold",
									children: [transaction.method, transaction.bankName ? ` (${transaction.bankName})` : ""]
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1",
								children: t.account_no
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-slate-900 dark:text-white tabular-nums truncate",
									children: transaction.phone || (lang === "bn" ? "ক্যাবল সংযোগ" : "Cable Account")
								}), transaction.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleCopyPhone,
									className: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
									title: "কপি করুন",
									children: copiedPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1",
								children: t.amount
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm font-extrabold tabular-nums ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-[#E52E2E] dark:text-rose-400"}`,
								children: formatCurrency(transaction.amount, lang)
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1",
								children: t.trx_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate font-mono",
									children: transaction.trxId
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleCopyTrxId,
									className: "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1",
									title: "কপি করুন",
									children: copiedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1",
								children: t.date_time
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight",
								children: formatTransactionDate(transaction.date, transaction.time, lang)
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800",
							children: lang === "bn" ? "বিস্তারিত তথ্য" : "Information"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400",
								children: lang === "bn" ? "গ্রাহক / প্রেরক / প্রাপক:" : "Person / Customer:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white",
								children: transaction.person || "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400",
								children: lang === "bn" ? "লেনদেনের মাধ্যম:" : "Payment Channel:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white",
								children: transaction.method
							})]
						}),
						transaction.bankName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400",
								children: lang === "bn" ? "ব্যাংকের নাম:" : "Bank Name:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-blue-600 dark:text-blue-400",
								children: transaction.bankName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400",
								children: lang === "bn" ? "ক্যাটাগরি:" : "Category:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-white",
								children: transaction.category
							})]
						}),
						transaction.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1",
								children: lang === "bn" ? "রেফারেন্স / নোট:" : "Remarks / Note:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800",
								children: transaction.note
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleCall,
						className: "h-12 rounded-2xl border-2 border-slate-900 dark:border-slate-200 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.call_btn, " (ফোন করুন)"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSms,
						className: "h-12 rounded-2xl border-2 border-slate-900 dark:border-slate-200 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.sms_btn, " (এসএমএস)"] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						sounds.playTap();
						onViewReceipt(transaction);
					},
					className: "w-full h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#E52E2E] text-[#E52E2E] dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-98 transition-all shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-4 h-4 stroke-[2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "🧾 ডিজিটাল ক্যাশমেমো / থার্মাল রশিদ প্রিন্ট" : "View POS Receipt Slip" })]
				}),
				modCheck.allowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-950 shadow-md space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs font-bold text-[#E52E2E]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAdmin ? lang === "bn" ? "অ্যাডমিন ক্ষমতা (এডিট ও ডিলিট)" : "Admin Controls" : lang === "bn" ? "সাব-অ্যাডমিন ক্ষমতা (এডিট ও ডিলিট)" : "Sub-Admin Controls" })]
						}), isSubAdmin$1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? `${toBengaliNumber(minsRemaining)} মিনিট বাকি` : `${minsRemaining} min left` })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onEdit(transaction);
							},
							className: "h-12 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "✏️ এন্ট্রি এডিট করুন" : "Edit Entry" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								sounds.playTap();
								onDelete(transaction);
							},
							className: "h-12 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "🗑️ ডিলিট করুন" : "Delete Entry" })]
						})]
					})]
				}) : isSubAdmin$1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: modCheck.isOwner && modCheck.expired ? lang === "bn" ? "৩০ মিনিট সময়সীমা শেষ — এখন শুধুমাত্র মেইন অ্যাডমিন এই লেনদেন এডিট বা ডিলিট করতে পারবেন।" : "30-minute window expired — only Main Admin can edit or delete this entry now." : lang === "bn" ? "সাব-অ্যাডমিন কেবল নিজের এন্ট্রিকৃত লেনদেন (৩০ মিনিট পর্যন্ত) এডিট বা ডিলিট করতে পারবেন।" : "Sub-Admin can only edit or delete their own entries within 30 minutes." })]
				}) : (user === null || user === void 0 ? void 0 : user.role) === "user" || (user === null || user === void 0 ? void 0 : user.role) === "staff" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "শুধুমাত্র দেখার অনুমতি (Read-Only) — সাধারণ ইউজার ও স্টাফ কোনো লেনদেন এডিট বা ডিলিট করতে পারবেন না।" : "Read-only access — Regular users and attendance staff cannot edit or delete transactions." })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-amber-900 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "এন্ট্রি এডিট বা ডিলিট করতে অ্যাডমিন লগইন প্রয়োজন" : "Admin login required to edit/delete" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							onOpenLogin();
						},
						className: "px-3 py-1 rounded-xl bg-[#E52E2E] text-white font-bold text-[11px] shrink-0 hover:bg-rose-700 shadow-2xs",
						children: lang === "bn" ? "লগইন" : "Login"
					})]
				})
			]
		})]
	});
};
//#endregion
export { TransactionDetailPage };
