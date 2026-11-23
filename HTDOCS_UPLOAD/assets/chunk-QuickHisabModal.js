import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, Bt as DollarSign, En as require_react, H as RefreshCw, J as Plus, K as Printer, M as ShieldCheck, O as Sparkles, R as Search, Sn as ArrowLeft, Tn as ArrowDownLeft, V as RotateCcw, Y as Phone, Z as Pen, Zt as CircleCheck, _ as TriangleAlert, an as ChartPie, bn as ArrowUpRight, d as Users, en as ChevronRight, fn as Calculator, j as Shield, ln as Camera, n as X, s as Wallet, st as MapPin, un as Calendar, v as TrendingUp, x as Trash2, y as TrendingDown } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, l as onSnapshot, o as getDoc, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { i as toBengaliNumber, t as formatCurrency } from "./chunk-formatters.js";
import { L as compressImageFile, U as showConfirm, V as initialQuickHisabOwners, at as handleFirestoreError, b as recordOwnerDividendDeduction, ct as staffDb, it as db, m as computeOwnersDividendLedger, nt as OperationType, ot as safeDeleteDoc, st as safeSetDoc, tt as sounds } from "./app.js";
import confetti_module_default from "./chunk-confetti.module.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { c as getTransactionMonth, d as parseNumber, s as getMonthBengaliName, u as isIncomeTransaction } from "./chunk-categories.js";
//#region src/components/OwnerDetailView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var OwnerDetailView = ({ breakdown, ownerIndex, totalShareUnits, netProfit, selectedMonth, lang, isAdmin, user, staffAccounts, onSaveStaffAccounts, onEditOwner, onBack }) => {
	const isBn = lang === "bn";
	const { owner, shareUnits, sharePercentage, isHalf, grossShare, matchedAccounts, totalDue, totalCollected, applicableCompanyDue, deductedAmount, netPayable, unpaidDueAfterDividend, transactions } = breakdown;
	const [isConfirmingSettle, setIsConfirmingSettle] = (0, import_react.useState)(false);
	const [isSettling, setIsSettling] = (0, import_react.useState)(false);
	const [settleMessage, setSettleMessage] = (0, import_react.useState)(null);
	const monthLabel = isBn ? getMonthBengaliName(selectedMonth) : selectedMonth;
	const hasDue = applicableCompanyDue > 0;
	const hasDeduction = deductedAmount > 0;
	const alreadySettledThisMonth = transactions.some((t) => {
		var _t$reference, _t$note, _t$date;
		return t.type === "collection" && (((_t$reference = t.reference) === null || _t$reference === void 0 ? void 0 : _t$reference.includes(selectedMonth)) || ((_t$note = t.note) === null || _t$note === void 0 ? void 0 : _t$note.includes("লভ্যাংশ থেকে কর্তন")) && ((_t$date = t.date) === null || _t$date === void 0 ? void 0 : _t$date.startsWith(selectedMonth)));
	});
	const renderAmount = (amount) => formatCurrency(amount, lang);
	const handleConfirmSettle = async () => {
		if (!isAdmin || isSettling || deductedAmount <= 0) return;
		setIsSettling(true);
		try {
			const { settledAmount } = await recordOwnerDividendDeduction({
				staffAccounts,
				matchedAccounts,
				amountToDeduct: deductedAmount,
				selectedMonth,
				monthLabel,
				ownerName: owner.name,
				user,
				onSaveStaffAccounts
			});
			if (settledAmount > 0) {
				sounds.playSuccess();
				setSettleMessage(isBn ? `${renderAmount(settledAmount)} কোম্পানি পাওনা থেকে সফলভাবে কর্তন ও সমন্বয় করা হয়েছে।` : `${renderAmount(settledAmount)} deducted and settled against company due.`);
			}
			setIsConfirmingSettle(false);
		} catch (err) {
			console.error("Owner dividend deduction settlement failed:", err);
			setSettleMessage(isBn ? "পাওনা সমন্বয় সংরক্ষণ করা যায়নি, আবার চেষ্টা করুন।" : "Could not save deduction.");
		} finally {
			setIsSettling(false);
		}
	};
	const handlePrint = () => {
		sounds.playTap();
		try {
			window.print();
		} catch {}
	};
	let runningBalance = 0;
	const ledgerRows = transactions.map((tx) => {
		const amt = Number(tx.amount) || 0;
		if (tx.type === "due") runningBalance += amt;
		else runningBalance -= amt;
		return {
			tx,
			balanceAfter: runningBalance
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[55] bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 h-14 flex items-center justify-between gap-2 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						sounds.playTap();
						onBack();
					},
					"aria-label": isBn ? "ফিরে যান" : "Go Back",
					className: "min-w-[44px] min-h-[44px] -ml-1 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate leading-tight",
						children: owner.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-slate-500 dark:text-slate-400 truncate",
						children: isBn ? "মালিকের বিস্তারিত ও লভ্যাংশ বিবরণী" : "Owner Details & Dividend Statement"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handlePrint,
					className: "min-h-[40px] px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: isBn ? "প্রিন্ট / PDF" : "Print / PDF"
					})]
				}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						sounds.playTap();
						onEditOwner();
					},
					className: "min-h-[40px] px-3 py-2 rounded-xl bg-[#E52E2E]/10 hover:bg-[#E52E2E]/20 text-[#E52E2E] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "এডিট" : "Edit" })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto px-4 py-4 pb-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "printable-owner-statement",
				className: "max-w-3xl mx-auto space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [owner.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: owner.avatarUrl,
								alt: owner.name,
								referrerPolicy: "no-referrer",
								className: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${isHalf ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white" : "bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white"}`,
								children: isBn ? toBengaliNumber(ownerIndex + 1) : ownerIndex + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug",
										children: owner.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-bold ${isHalf ? "text-amber-700 dark:text-amber-400" : "text-indigo-700 dark:text-indigo-400"}`,
												children: isHalf ? isBn ? "অর্ধেক মালিক (০.৫ অংশ)" : "Half Owner (0.5 Share)" : isBn ? `পূর্ণ মালিক (${toBengaliNumber(shareUnits)} অংশ)` : `Full Owner (${shareUnits} Share)`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "text-slate-400",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold tabular-nums",
												children: [
													sharePercentage.toFixed(2),
													"% ",
													isBn ? "অংশীদারিত্ব" : "Ownership"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "text-slate-400",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-slate-500 dark:text-slate-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }), monthLabel]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300",
										children: [
											owner.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `tel:${owner.phone}`,
												className: "inline-flex items-center gap-1.5 hover:text-[#E52E2E] font-semibold transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: owner.phone
												})]
											}),
											owner.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: owner.address })]
											}),
											owner.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: owner.notes })]
											})
										]
									})
								]
							})]
						})
					}),
					settleMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: settleMessage })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-5 bg-gradient-to-br from-[#E52E2E] via-rose-600 to-rose-700 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold text-rose-100",
											children: hasDeduction ? isBn ? "কোম্পানি পাওনা কর্তনের পর চূড়ান্ত প্রাপ্য লভ্যাংশ" : "Final Net Dividend After Due Deduction" : isBn ? "মালিকের প্রাপ্য নিট লভ্যাংশ" : "Owner Net Payable Dividend"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-3xl font-black tabular-nums tracking-tight mt-1",
											children: renderAmount(netPayable)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-rose-100/90 mt-1.5",
											children: hasDeduction ? isBn ? `মোট শেয়ার ${renderAmount(grossShare)} থেকে ${renderAmount(deductedAmount)} কোম্পানি পাওনা কর্তন করা হয়েছে` : `${renderAmount(deductedAmount)} company due deducted from ${renderAmount(grossShare)} gross dividend` : hasDue ? isBn ? `বকেয়া কোম্পানি পাওনা ${renderAmount(applicableCompanyDue)} (এই মাসের লভ্যাংশ শূন্য হওয়ায় কর্তন হয়নি)` : `Pending company due ${renderAmount(applicableCompanyDue)}` : isBn ? `${monthLabel} মাসের কোম্পানির মোট নিট লাভ থেকে প্রাপ্ত অংশ` : `Calculated from company net profit for ${monthLabel}`
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-5 h-5" })
									})]
								})
							}),
							(hasDue || hasDeduction) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 sm:p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "মোট লভ্যাংশ" : "Gross Share"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums mt-0.5",
											children: renderAmount(grossShare)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 sm:p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "পাওনা কর্তন" : "Deduction"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 tabular-nums mt-0.5",
											children: ["-", renderAmount(deductedAmount)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 sm:p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-slate-500 dark:text-slate-400",
											children: isBn ? "নিট প্রাপ্য" : "Net Payable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5",
											children: renderAmount(netPayable)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-600 dark:text-slate-400 font-medium",
											children: isBn ? `কোম্পানির মোট নিট লাভ (${monthLabel})` : `Company Total Net Profit (${monthLabel})`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 dark:text-white tabular-nums",
											children: renderAmount(netProfit)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-600 dark:text-slate-400 font-medium",
											children: isBn ? `মালিকের শেয়ার অংশ (${toBengaliNumber(shareUnits)} / ${toBengaliNumber(totalShareUnits)})` : `Owner Share Ratio (${shareUnits} / ${totalShareUnits})`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-slate-900 dark:text-white tabular-nums",
											children: [sharePercentage.toFixed(2), "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-700 dark:text-slate-200 font-bold",
											children: isBn ? "মোট প্রাপ্য লভ্যাংশ (কর্তনের পূর্বে)" : "Gross Share Dividend"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-indigo-600 dark:text-indigo-400 tabular-nums",
											children: renderAmount(grossShare)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-rose-50/50 dark:bg-rose-950/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-800 dark:text-slate-200 font-bold",
											children: isBn ? "মালিকের নিকট কোম্পানি পাওনা (বকেয়া)" : "Outstanding Company Due"
										}), matchedAccounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums",
											children: isBn ? `মোট পাওনা: ${renderAmount(totalDue)} · পূর্বে জমা/সমন্বয়: ${renderAmount(totalCollected)}` : `Total Due: ${renderAmount(totalDue)} · Collected: ${renderAmount(totalCollected)}`
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-black tabular-nums ${hasDue ? "text-rose-600 dark:text-rose-400" : "text-slate-500"}`,
											children: renderAmount(applicableCompanyDue)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-amber-50/50 dark:bg-amber-950/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-900 dark:text-amber-300 font-bold",
											children: isBn ? "লভ্যাংশ থেকে পাওনা কর্তন" : "Deducted From Dividend"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-amber-700 dark:text-amber-400 tabular-nums",
											children: hasDeduction ? `- ${renderAmount(deductedAmount)}` : renderAmount(0)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 bg-emerald-50/70 dark:bg-emerald-950/25",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-950 dark:text-emerald-200 font-black",
											children: isBn ? "চূড়ান্ত প্রাপ্য নিট লভ্যাংশ" : "Final Net Dividend Payable"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums",
											children: renderAmount(netPayable)
										})]
									}),
									unpaidDueAfterDividend > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-rose-50 dark:bg-rose-950/35",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লভ্যাংশ কর্তনের পরও অবশিষ্ট কোম্পানি পাওনা" : "Remaining Company Due After Deduction" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-rose-700 dark:text-rose-300 tabular-nums",
											children: renderAmount(unpaidDueAfterDividend)
										})]
									})
								]
							})
						]
					}),
					isAdmin && hasDeduction && matchedAccounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-start justify-between gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
								children: isBn ? "লভ্যাংশ থেকে কোম্পানি পাওনা স্থায়ী সমন্বয় (এডমিন)" : "Permanent Dividend Deduction Settlement (Admin)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed",
								children: alreadySettledThisMonth ? isBn ? `${monthLabel} মাসের লভ্যাংশ থেকে ইতিপূর্বে পাওনা সমন্বয় এন্ট্রি করা হয়েছে। আরও কোনো বকেয়া থাকলে পুনরায় সমন্বয় করতে পারেন।` : `A deduction entry for ${monthLabel} has already been recorded. You can still settle remaining dues if needed.` : isBn ? `এখানে নিশ্চিত করলে মালিকের কোম্পানি পাওনা খাতায় ${renderAmount(deductedAmount)} "লভ্যাংশ থেকে কর্তন" হিসেবে জমা রেকর্ড হবে এবং মোট বকেয়া পাওনা কমে যাবে।` : `Confirming records ${renderAmount(deductedAmount)} as settled in the owner's company due ledger.`
							})] })
						}), !isConfirmingSettle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setIsConfirmingSettle(true);
							},
							className: "w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? `${renderAmount(deductedAmount)} পাওনা কর্তন খাতায় সংরক্ষণ করুন` : `Record ${renderAmount(deductedAmount)} Deduction` })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-amber-900 dark:text-amber-200",
								children: isBn ? `আপনি কি নিশ্চিত যে ${owner.name}-এর ${monthLabel} মাসের লভ্যাংশ থেকে ${renderAmount(deductedAmount)} কেটে কোম্পানি পাওনা হিসেবে জমা রেকর্ড করবেন?` : `Confirm recording ${renderAmount(deductedAmount)} deduction from ${owner.name}'s dividend?`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsConfirmingSettle(false),
									disabled: isSettling,
									className: "flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold",
									children: isBn ? "বাতিল" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleConfirmSettle,
									disabled: isSettling,
									className: "flex-1 min-h-[40px] py-2 px-3 rounded-xl bg-[#E52E2E] text-white text-xs font-bold disabled:opacity-50",
									children: isSettling ? isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." : isBn ? "হ্যাঁ, নিশ্চিত করুন" : "Yes, Confirm"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
								children: isBn ? "কোম্পানি পাওনা ও সমন্বয়ের লেনদেন খাতা" : "Company Due & Settlement Ledger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: matchedAccounts.length > 0 ? isBn ? `মোট ${toBengaliNumber(transactions.length)}টি লেনদেন রেকর্ড` : `${transactions.length} ledger entries` : isBn ? "স্টাফ কালেকশন ও কোম্পানি পাওনা খাতার সাথে যুক্ত" : "Synced with Company Due Ledger"
							})] }), matchedAccounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums",
								children: [isBn ? "বকেয়া: " : "Due: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: hasDue ? "text-rose-600 dark:text-rose-400" : "text-emerald-600",
									children: renderAmount(applicableCompanyDue)
								})]
							})]
						}), ledgerRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 text-center space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-slate-600 dark:text-slate-300",
								children: isBn ? "এই মালিকের নামে কোনো কোম্পানি পাওনা বা লেনদেন রেকর্ড নেই" : "No company due records linked to this owner"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto",
								children: isBn ? "\"স্টাফ কালেকশন ও কোম্পানি পাওনা\" পেইজে পদবি \"মালিক / অংশীদার\" দিয়ে একই নাম বা মোবাইল নম্বরে পাওনা যোগ করলে এখানে স্বয়ংক্রিয়ভাবে হিসাব ও লভ্যাংশ কর্তন দেখাবে।" : "Dues added in Staff Collection & Company Due under the Owner/Partner role with matching name or phone appear here automatically."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-slate-100 dark:divide-slate-800",
							children: ledgerRows.map(({ tx, balanceAfter }) => {
								const isDueTx = tx.type === "due";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "px-4 sm:px-5 py-3 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isDueTx ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"}`,
											children: isDueTx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-slate-900 dark:text-white truncate",
												children: tx.note || (isDueTx ? isBn ? "কোম্পানি পাওনা যোগ" : "Company Due Added" : isBn ? "পাওনা জমা / সমন্বয়" : "Collected / Settled")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx.date }),
													tx.time ? ` · ${tx.time}` : "",
													tx.reference ? ` · ${tx.reference}` : ""
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-xs sm:text-sm font-black tabular-nums ${isDueTx ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`,
											children: [
												isDueTx ? "+" : "-",
												" ",
												renderAmount(Number(tx.amount) || 0)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-slate-500 dark:text-slate-400 tabular-nums",
											children: [isBn ? "জের: " : "Bal: ", renderAmount(balanceAfter)]
										})]
									})]
								}, tx.id);
							})
						})]
					})
				]
			})
		})]
	});
};
//#endregion
//#region src/components/QuickHisabModal.tsx
var DEFAULT_SUMMARY = {
	totalIncome: 0,
	totalExpense: 0,
	staffSalary: 0,
	otherExpense: 0,
	netProfit: 0,
	incomeCount: 0,
	expenseCount: 0,
	source: "ayByay"
};
var QuickHisabModal = ({ isOpen, lang, user, staffAccounts, onSaveStaffAccounts, quickHisabOwners: propOwners, onSaveOwners, onClose, onSubViewChange }) => {
	const isBn = lang === "bn";
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const currentMonthKey = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(currentMonthKey);
	const [isLiveAyByaySynced, setIsLiveAyByaySynced] = (0, import_react.useState)(true);
	const [ayByayTxns, setAyByayTxns] = (0, import_react.useState)(() => {
		try {
			const raw = safeStorage.getItem("isp_cache_txns");
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	});
	const [ayByaySalaries, setAyByaySalaries] = (0, import_react.useState)(() => {
		try {
			const raw = safeStorage.getItem("isp_cache_salaries");
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	});
	const [manualMonthlyRecords, setManualMonthlyRecords] = (0, import_react.useState)({});
	const calculateMonthStats = (0, import_react.useCallback)((monthKey, txList, salList, manualMap) => {
		let inc = 0;
		let nonSalExp = 0;
		let salExpInTx = 0;
		let incCount = 0;
		let expCount = 0;
		let hasTxn = false;
		const isSalaryTx = (t) => t.id && String(t.id).startsWith("tx-sal-") || t.category === "বেতন (Salary)" || typeof t.description === "string" && (t.description.includes("স্টাফ বেতন") || t.description.includes("বেতন"));
		(txList || []).forEach((t) => {
			if (!t || t.isDeleted) return;
			const d = t.date || t.createdAt;
			if (!d || typeof d !== "string") return;
			if (getTransactionMonth(d) === monthKey) {
				hasTxn = true;
				const amt = parseNumber(t.amount);
				if (isIncomeTransaction(t)) {
					inc += amt;
					incCount++;
				} else {
					if (isSalaryTx(t)) salExpInTx += amt;
					else nonSalExp += amt;
					expCount++;
				}
			}
		});
		const salFromList = (Array.isArray(salList) ? salList : []).filter((s) => s && s.month === monthKey && s.paymentStatus === "paid").reduce((acc, s) => acc + (Number(s.netSalary) || 0), 0);
		const effectiveSalary = Math.max(salExpInTx, salFromList);
		const totalExp = nonSalExp + effectiveSalary;
		const net = inc - totalExp;
		if (hasTxn || salFromList > 0 || salExpInTx > 0) return {
			totalIncome: inc,
			totalExpense: totalExp,
			staffSalary: effectiveSalary,
			otherExpense: nonSalExp,
			netProfit: net,
			incomeCount: incCount,
			expenseCount: expCount,
			source: "ayByay"
		};
		if (manualMap && manualMap[monthKey]) return {
			...manualMap[monthKey],
			source: "manual"
		};
		try {
			const saved = safeStorage.getItem("protyasha_cached_summary");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && typeof parsed.totalIncome === "number" && monthKey === currentMonthKey) return parsed;
			}
		} catch {}
		return DEFAULT_SUMMARY;
	}, [currentMonthKey]);
	const [summary, setSummary] = (0, import_react.useState)(() => {
		try {
			const rawTxns = safeStorage.getItem("isp_cache_txns");
			const rawSal = safeStorage.getItem("isp_cache_salaries");
			const tx = rawTxns ? JSON.parse(rawTxns) : [];
			const sa = rawSal ? JSON.parse(rawSal) : [];
			return calculateMonthStats(currentMonthKey, tx, sa);
		} catch {
			return DEFAULT_SUMMARY;
		}
	});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [owners, setOwners] = (0, import_react.useState)(() => {
		if (propOwners && Array.isArray(propOwners) && propOwners.length > 0) return propOwners;
		const saved = safeStorage.getItem("protyasha_quick_hisab_owners");
		if (saved) try {
			const parsed = JSON.parse(saved);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		} catch {}
		return initialQuickHisabOwners;
	});
	(0, import_react.useEffect)(() => {
		if (propOwners && Array.isArray(propOwners) && propOwners.length > 0) setOwners(propOwners);
	}, [propOwners]);
	const [isEditorOpen, setIsEditorOpen] = (0, import_react.useState)(false);
	const [editingOwner, setEditingOwner] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formPhone, setFormPhone] = (0, import_react.useState)("");
	const [formAddress, setFormAddress] = (0, import_react.useState)("");
	const [formNotes, setFormNotes] = (0, import_react.useState)("");
	const [formShareUnits, setFormShareUnits] = (0, import_react.useState)(1);
	const [formAvatarUrl, setFormAvatarUrl] = (0, import_react.useState)("");
	const [isUploadingPhoto, setIsUploadingPhoto] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [quickUploadOwnerId, setQuickUploadOwnerId] = (0, import_react.useState)(null);
	const quickFileInputRef = (0, import_react.useRef)(null);
	const [isFinEditorOpen, setIsFinEditorOpen] = (0, import_react.useState)(false);
	const [editIncome, setEditIncome] = (0, import_react.useState)(String(summary.totalIncome));
	const [editExpense, setEditExpense] = (0, import_react.useState)(String(summary.totalExpense));
	const [editStaffSalary, setEditStaffSalary] = (0, import_react.useState)(String(summary.staffSalary));
	const [isSavingFin, setIsSavingFin] = (0, import_react.useState)(false);
	const [selectedOwnerId, setSelectedOwnerId] = (0, import_react.useState)(null);
	useSubViewBack(isOpen, (isEditorOpen ? 1 : 0) + (isFinEditorOpen ? 1 : 0) + (selectedOwnerId ? 1 : 0), () => {
		if (isFinEditorOpen) setIsFinEditorOpen(false);
		else if (isEditorOpen) {
			setIsEditorOpen(false);
			setEditingOwner(null);
		} else if (selectedOwnerId) setSelectedOwnerId(null);
	}, onSubViewChange, "quickHisab");
	const handleOpenFinEditor = () => {
		if (!isAdmin) return;
		sounds.playTap();
		setEditIncome(String(summary.totalIncome));
		setEditExpense(String(summary.totalExpense));
		setEditStaffSalary(String(summary.staffSalary));
		setIsFinEditorOpen(true);
	};
	const handleSaveFinSummary = async () => {
		if (!isAdmin) return;
		setIsSavingFin(true);
		const inc = Number(editIncome) || 0;
		const exp = Number(editExpense) || 0;
		const sal = Number(editStaffSalary) || 0;
		const updatedSummary = {
			totalIncome: inc,
			totalExpense: exp,
			staffSalary: sal,
			otherExpense: Math.max(0, exp - sal),
			netProfit: inc - exp,
			source: "manual",
			lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
		};
		setSummary(updatedSummary);
		setManualMonthlyRecords((prev) => ({
			...prev,
			[selectedMonth]: updatedSummary
		}));
		try {
			safeStorage.setItem("protyasha_cached_summary", JSON.stringify(updatedSummary));
		} catch {}
		try {
			const docRef = doc(db, "settings", "quick_hisab_summary");
			const snap = await getDoc(docRef);
			const existingData = snap.exists() ? snap.data() : {};
			const monthlyRecords = {
				...existingData.monthlyRecords || {},
				[selectedMonth]: updatedSummary
			};
			await safeSetDoc(docRef, {
				monthlyRecords,
				quickHisabSummary: selectedMonth === currentMonthKey ? updatedSummary : existingData.quickHisabSummary || updatedSummary,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (e) {
			console.warn("Could not save summary to Firestore:", e);
		} finally {
			setIsSavingFin(false);
			setIsFinEditorOpen(false);
			sounds.playSuccess();
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		let unsubTxns = null;
		let unsubSals = null;
		let unsubSummary = null;
		try {
			const qTxns = collection(staffDb, "ay_byay_transactions");
			unsubTxns = onSnapshot(qTxns, (snapshot) => {
				const cloudTx = [];
				snapshot.forEach((docSnap) => {
					const t = docSnap.data();
					if (t && (t.id || docSnap.id) && !t.isDeleted) cloudTx.push({
						...t,
						id: t.id || docSnap.id
					});
				});
				setAyByayTxns(cloudTx);
				try {
					safeStorage.setItem("isp_cache_txns", JSON.stringify(cloudTx));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_transactions");
			});
		} catch (e) {
			console.warn("Realtime transactions subscription error:", e);
		}
		try {
			const qSals = collection(staffDb, "ay_byay_salaries");
			unsubSals = onSnapshot(qSals, (snapshot) => {
				const cloudSals = [];
				snapshot.forEach((docSnap) => {
					const s = docSnap.data();
					if (s) cloudSals.push(s);
				});
				setAyByaySalaries(cloudSals);
				try {
					safeStorage.setItem("isp_cache_salaries", JSON.stringify(cloudSals));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_salaries");
			});
		} catch (e) {
			console.warn("Realtime ay_byay_salaries subscription error:", e);
		}
		try {
			unsubSummary = onSnapshot(doc(db, "settings", "quick_hisab_summary"), (snap) => {
				if (snap.exists()) {
					const data = snap.data();
					if ((data === null || data === void 0 ? void 0 : data.monthlyRecords) && typeof data.monthlyRecords === "object") setManualMonthlyRecords(data.monthlyRecords);
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, "settings/quick_hisab_summary");
			});
		} catch (e) {
			console.warn("Realtime quick_hisab_summary subscription error:", e);
		}
		return () => {
			if (unsubTxns) unsubTxns();
			if (unsubSals) unsubSals();
			if (unsubSummary) unsubSummary();
		};
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		let unsub = null;
		try {
			const q = collection(db, "quick_hisab_owners");
			unsub = onSnapshot(q, (snapshot) => {
				const cloudOwners = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && data.name) cloudOwners.push({
						...data,
						id: String(data.id || docSnap.id)
					});
				});
				if (!snapshot.empty || owners.length === 0) {
					setOwners(cloudOwners);
					try {
						safeStorage.setItem("protyasha_quick_hisab_owners", JSON.stringify(cloudOwners));
					} catch {}
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "quick_hisab_owners");
			});
		} catch (e) {
			console.warn("Realtime quick_hisab_owners subscription error:", e);
		}
		return () => {
			if (unsub) unsub();
		};
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		const updated = calculateMonthStats(selectedMonth, ayByayTxns, ayByaySalaries, manualMonthlyRecords);
		setSummary(updated);
		setIsLiveAyByaySynced(true);
		if (selectedMonth === currentMonthKey) try {
			safeStorage.setItem("protyasha_cached_summary", JSON.stringify(updated));
		} catch {}
	}, [
		selectedMonth,
		ayByayTxns,
		ayByaySalaries,
		manualMonthlyRecords,
		calculateMonthStats,
		currentMonthKey
	]);
	(0, import_react.useEffect)(() => {
		const handleAyByayDataChanged = () => {
			try {
				const rawTxns = safeStorage.getItem("isp_cache_txns");
				const rawSals = safeStorage.getItem("isp_cache_salaries");
				const txns = rawTxns ? JSON.parse(rawTxns) : [];
				const sals = rawSals ? JSON.parse(rawSals) : [];
				if (Array.isArray(txns) && txns.length > 0) setAyByayTxns(txns);
				if (Array.isArray(sals)) setAyByaySalaries(sals);
			} catch {}
		};
		window.addEventListener("aybyay-data-changed", handleAyByayDataChanged);
		window.addEventListener("storage", handleAyByayDataChanged);
		return () => {
			window.removeEventListener("aybyay-data-changed", handleAyByayDataChanged);
			window.removeEventListener("storage", handleAyByayDataChanged);
		};
	}, []);
	const fetchSummary = async (monthKey = selectedMonth) => {
		setLoading(true);
		try {
			const qTxns = collection(staffDb, "ay_byay_transactions");
			const snapTxns = await getDocs(qTxns);
			const cloudTx = [];
			snapTxns.forEach((docSnap) => {
				const t = docSnap.data();
				if (t && (t.id || docSnap.id) && !t.isDeleted) cloudTx.push({
					...t,
					id: t.id || docSnap.id
				});
			});
			if (cloudTx.length > 0) {
				setAyByayTxns(cloudTx);
				try {
					safeStorage.setItem("isp_cache_txns", JSON.stringify(cloudTx));
				} catch {}
			}
			const qSals = collection(staffDb, "ay_byay_salaries");
			const snapSals = await getDocs(qSals);
			const cloudSals = [];
			snapSals.forEach((docSnap) => {
				const s = docSnap.data();
				if (s) cloudSals.push(s);
			});
			if (cloudSals.length > 0) {
				setAyByaySalaries(cloudSals);
				try {
					safeStorage.setItem("isp_cache_salaries", JSON.stringify(cloudSals));
				} catch {}
			}
			const freshTxns = cloudTx.length > 0 ? cloudTx : ayByayTxns;
			const freshSals = cloudSals.length > 0 ? cloudSals : ayByaySalaries;
			const computed = calculateMonthStats(monthKey, freshTxns, freshSals);
			setSummary(computed);
			setIsLiveAyByaySynced(true);
			sounds.playSuccess();
		} catch (error) {
			console.warn("Manual refresh warning:", error);
		} finally {
			setLoading(false);
		}
	};
	const saveUpdatedOwners = (newOwners) => {
		const prevIds = new Set(owners.map((o) => String(o.id)));
		const nextIds = new Set(newOwners.map((o) => String(o.id)));
		setOwners(newOwners);
		try {
			safeStorage.setItem("protyasha_quick_hisab_owners", JSON.stringify(newOwners));
		} catch {}
		newOwners.forEach((o) => {
			safeSetDoc(doc(db, "quick_hisab_owners", String(o.id)), {
				...o,
				id: String(o.id)
			}).catch(() => {});
		});
		prevIds.forEach((id) => {
			if (!nextIds.has(id)) safeDeleteDoc(doc(db, "quick_hisab_owners", id)).catch(() => {});
		});
		safeSetDoc(doc(db, "settings", "owners_meta"), {
			initialized: true,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch(() => {});
		if (onSaveOwners) onSaveOwners(newOwners);
	};
	const handleOpenAddOwner = () => {
		if (!isAdmin) return;
		sounds.playTap();
		setEditingOwner(null);
		setFormName(isBn ? `মালিক ${owners.length + 1}` : `Owner ${owners.length + 1}`);
		setFormPhone("");
		setFormAddress("");
		setFormNotes("");
		setFormShareUnits(1);
		setFormAvatarUrl("");
		setIsEditorOpen(true);
	};
	const handleOpenEditOwner = (owner) => {
		if (!isAdmin) return;
		sounds.playTap();
		setEditingOwner(owner);
		setFormName(owner.name);
		setFormPhone(owner.phone || "");
		setFormAddress(owner.address || "");
		setFormNotes(owner.notes || "");
		setFormShareUnits(owner.shareUnits);
		setFormAvatarUrl(owner.avatarUrl || "");
		setIsEditorOpen(true);
	};
	const handleSaveOwnerForm = () => {
		if (!isAdmin) return;
		const cleanName = formName.trim();
		if (!cleanName) return;
		sounds.playSuccess();
		let updated;
		if (editingOwner) updated = owners.map((o) => {
			if (o.id === editingOwner.id) return {
				...o,
				name: cleanName,
				phone: formPhone.trim(),
				address: formAddress.trim(),
				notes: formNotes.trim(),
				shareUnits: formShareUnits,
				avatarUrl: formAvatarUrl,
				isHalf: formShareUnits === .5,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			return o;
		});
		else {
			const newOwner = {
				id: `owner-${Date.now()}`,
				name: cleanName,
				phone: formPhone.trim(),
				address: formAddress.trim(),
				notes: formNotes.trim(),
				shareUnits: formShareUnits,
				avatarUrl: formAvatarUrl,
				isHalf: formShareUnits === .5,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			updated = [...owners, newOwner];
		}
		saveUpdatedOwners(updated);
		setIsEditorOpen(false);
	};
	const handleDeleteOwner = async (id) => {
		if (!isAdmin) return;
		sounds.playTap();
		if (await showConfirm({
			message: isBn ? "এই মালিককে তালিকা থেকে মুছে ফেলতে চান?" : "Delete this owner from the list?",
			confirmLabel: isBn ? "মুছে ফেলুন" : "Delete",
			cancelLabel: isBn ? "বাতিল" : "Cancel",
			danger: true
		})) {
			const updated = owners.filter((o) => o.id !== id);
			saveUpdatedOwners(updated);
			safeDeleteDoc(doc(db, "quick_hisab_owners", String(id))).catch(() => {});
			setIsEditorOpen(false);
		}
	};
	const handlePhotoSelect = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		try {
			setIsUploadingPhoto(true);
			const compressedDataUrl = await compressImageFile(file, 260, .85);
			if (compressedDataUrl) setFormAvatarUrl(compressedDataUrl);
		} catch (err) {
			console.error("Error compressing owner photo:", err);
		} finally {
			setIsUploadingPhoto(false);
			if (e.target) e.target.value = "";
		}
	};
	const handleQuickPhotoUpload = async (e) => {
		var _e$target$files2;
		if (!quickUploadOwnerId || !isAdmin) return;
		const file = (_e$target$files2 = e.target.files) === null || _e$target$files2 === void 0 ? void 0 : _e$target$files2[0];
		if (!file) return;
		try {
			const compressed = await compressImageFile(file, 260, .85);
			if (compressed) {
				const updated = owners.map((o) => o.id === quickUploadOwnerId ? {
					...o,
					avatarUrl: compressed
				} : o);
				saveUpdatedOwners(updated);
				sounds.playSuccess();
			}
		} catch (err) {
			console.error("Quick photo upload error:", err);
		} finally {
			setQuickUploadOwnerId(null);
			if (e.target) e.target.value = "";
		}
	};
	const handleResetToDefault = async () => {
		if (!isAdmin) return;
		sounds.playTap();
		if (await showConfirm({
			message: isBn ? "মালিকানা তালিকা ডিফল্ট ১৩ জনে (১২ পূর্ণ + ১ অর্ধেক) রিসেট করতে চান?" : "Reset to default 13 owners?",
			confirmLabel: isBn ? "রিসেট করুন" : "Reset",
			cancelLabel: isBn ? "বাতিল" : "Cancel",
			danger: true
		})) saveUpdatedOwners(initialQuickHisabOwners);
	};
	const handleConfirmDistribution = () => {
		sounds.playSuccess();
		try {
			confetti_module_default({
				particleCount: 60,
				spread: 80,
				origin: { y: .6 }
			});
		} catch {}
	};
	if (!isOpen) return null;
	const netProfit = summary.netProfit || 0;
	const { totalShareUnits, byOwnerId, totalCompanyDueAllOwners, totalDeductedFromDividend, totalNetPayableAfterDeduction, ownersWithDueCount } = computeOwnersDividendLedger(owners, staffAccounts, netProfit);
	const fullOwnersCount = owners.filter((o) => o.shareUnits === 1).length;
	const halfOwnersCount = owners.filter((o) => o.shareUnits === .5).length;
	const fullShareAmount = netProfit > 0 ? netProfit * 1 / totalShareUnits : 0;
	const halfShareAmount = netProfit > 0 ? netProfit * .5 / totalShareUnits : 0;
	const selectedOwnerBreakdown = selectedOwnerId ? byOwnerId[String(selectedOwnerId)] || null : null;
	const selectedOwnerIndex = selectedOwnerId ? Math.max(0, owners.findIndex((o) => String(o.id) === String(selectedOwnerId))) : 0;
	const filteredOwners = owners.filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(o.id).includes(searchQuery) || String(o.phone || "").includes(searchQuery));
	const renderAmount = (amount) => {
		return formatCurrency(amount, lang);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-bottom duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				ref: quickFileInputRef,
				onChange: handleQuickPhotoUpload,
				accept: "image/*",
				className: "hidden"
			}),
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate",
								children: isBn ? "কুইক হিসাব ও লভ্যাংশ ড্যাশবোর্ড" : "Quick Hisab & Profit Dashboard"
							}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3 h-3 shrink-0" }), isBn ? "এডমিন" : "Admin"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-slate-500 dark:text-slate-400",
							children: isBn ? `মোট ${owners.length} জন মালিক (${totalShareUnits} অংশ বণ্টন)` : `${owners.length} Owners (${totalShareUnits} Parts)`
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => fetchSummary(selectedMonth),
						disabled: loading,
						title: isBn ? "তথ্য রিফ্রেশ করুন" : "Refresh Data",
						className: "w-9 h-9 rounded-full flex items-center justify-center text-[#E52E2E] hover:bg-rose-50 dark:hover:bg-rose-950/30 active:rotate-180 transition-all duration-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-5 h-5 ${loading ? "animate-spin" : ""}` })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-[#E52E2E]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: isBn ? "হিসাবের মাস নির্বাচন করুন" : "Select Accounting Month"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-slate-500 dark:text-slate-400",
								children: selectedMonth === currentMonthKey ? isBn ? "বর্তমান (কারেন্ট) মাস" : "Current Month" : isBn ? "পুরোনো মাসের সংরক্ষিত হিসাব" : "Archived Month"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "month",
								value: selectedMonth,
								onChange: (e) => {
									if (e.target.value) {
										setSelectedMonth(e.target.value);
										sounds.playTap();
									}
								},
								className: "px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
							}), selectedMonth !== currentMonthKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setSelectedMonth(currentMonthKey);
									sounds.playTap();
								},
								className: "px-2.5 py-1.5 rounded-xl bg-[#E52E2E]/10 text-[#E52E2E] text-[11px] font-bold hover:bg-[#E52E2E]/20 transition-colors",
								children: isBn ? "বর্তমান" : "Current"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-3 w-3 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "আয়-ব্যয় অপশনের ড্যাশবোর্ড ডেটার সাথে সরাসরি যুক্ত" : "Directly synced with Ay-Byay Dashboard" }), summary.source === "ayByay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-black",
										children: isBn ? "লাইভ" : "LIVE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-emerald-700/90 dark:text-emerald-400/90 truncate mt-0.5",
									children: [isBn ? `${getMonthBengaliName(selectedMonth)} মাসের আয়-ব্যয় হিসাবের ভিত্তিতে নিট লাভ ও শেয়ার বণ্টন হচ্ছে` : `Net profit & shares are live calculated from ${selectedMonth} transactions`, summary.incomeCount !== void 0 && summary.expenseCount !== void 0 ? ` (${summary.incomeCount + summary.expenseCount}টি লেনদেন)` : ""]
								})]
							})]
						})
					}),
					summary.totalIncome === 0 && summary.totalExpense === 0 && selectedMonth !== currentMonthKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 dark:bg-amber-950/30 dark:border-amber-900/40 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-amber-900 dark:text-amber-200",
							children: isBn ? "এই মাসের কোনো হিসাব বা ডেটা সংরক্ষিত নেই" : "No records found for this month"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-0.5",
							children: isBn ? "নিচে সকল হিসাব শূন্য (০) দেখানো হচ্ছে। এডমিন প্যানেল থেকে এই মাসের হিসাব যোগ করতে পারেন।" : "Showing zero balance. Admin can add records for this month."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 sm:gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 mb-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5",
									children: isBn ? "কোম্পানি মোট আয়" : "Total Income"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg sm:text-xl font-black text-emerald-600 tabular-nums",
									children: renderAmount(summary.totalIncome)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 mb-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5",
									children: isBn ? "কোম্পানি মোট ব্যয়" : "Total Expense"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg sm:text-xl font-black text-rose-600 tabular-nums",
									children: renderAmount(summary.totalExpense)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#E52E2E] via-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/20 relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-[-8%] bottom-[-20%] opacity-10 pointer-events-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-36 h-36 stroke-[1]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wide uppercase mb-1.5 backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3" }), isBn ? "অবশিষ্ট টাকা (মালিকদের নিট লাভ)" : "Net Profit For Owners"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl sm:text-3xl font-black tabular-nums tracking-tight",
									children: renderAmount(netProfit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-rose-100 mt-1 font-medium",
									children: isBn ? `সর্বমোট ${totalShareUnits} অংশের অনুপাতে স্বয়ংক্রিয়ভাবে মালিকদের মাঝে বণ্টনযোগ্য` : `Divided among owners across ${totalShareUnits} share units`
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-7 h-7" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100/50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-indigo-900/20 border-2 border-indigo-200/80 dark:border-indigo-800/50 shadow-xs relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-indigo-900 dark:text-indigo-200",
										children: isBn ? `পূর্ণ মালিক (${fullOwnersCount} জন)` : `Full Owners (${fullOwnersCount})`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs",
										children: [(1 / totalShareUnits * 100).toFixed(2), "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums",
									children: renderAmount(fullShareAmount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-indigo-700/80 dark:text-indigo-300/80 mt-1 font-medium",
									children: isBn ? "প্রতি পূর্ণ মালিক পাবেন (১ অংশ)" : "Per full owner (1 share)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20 border-2 border-amber-200/80 dark:border-amber-800/50 shadow-xs relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-amber-900 dark:text-amber-200",
										children: isBn ? `অর্ধেক মালিক (${halfOwnersCount} জন)` : `Half Owners (${halfOwnersCount})`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs",
										children: [(.5 / totalShareUnits * 100).toFixed(2), "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums",
									children: renderAmount(halfShareAmount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1 font-medium",
									children: isBn ? "প্রতি অর্ধেক মালিক পাবেন (০.৫ অংশ)" : "Per half owner (0.5 share)"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
								children: isBn ? "কোম্পানি ব্যয়ের বিস্তারিত খাতসমূহ" : "Expense Breakdown"
							}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleOpenFinEditor,
								className: "text-[11px] font-bold text-[#E52E2E] hover:underline flex items-center gap-1 active:scale-95 transition-transform",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "হিসাব পরিবর্তন" : "Edit Figures" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 sm:p-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
										children: isBn ? "স্টাফ বেতন ও মজুরি" : "Staff Salary & Wages"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-500 dark:text-slate-400",
										children: isBn ? "সকল লাইন টেকনিশিয়ানের বেতন" : "Technicians & linemen expenses"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-black text-slate-900 dark:text-white tabular-nums",
									children: renderAmount(summary.staffSalary)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 sm:p-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white",
										children: isBn ? "অন্যান্য অফিস ও লাইন রক্ষণাবেক্ষণ খরচ" : "Office & Maintenance Expenses"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-500 dark:text-slate-400",
										children: isBn ? "ফাইবার তার, স্প্লিটার, বিদ্যুৎ ইত্যাদি" : "Fiber cables, utilities & admin"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-black text-slate-900 dark:text-white tabular-nums",
									children: renderAmount(summary.otherExpense)
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
									children: isBn ? `মালিকদের লভ্যাংশ বণ্টন তালিকা (${owners.length} জন)` : `Owner Share Distribution (${owners.length})`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-500 dark:text-slate-400",
									children: isBn ? `সর্বমোট ${totalShareUnits} অংশ (${fullOwnersCount} জন পূর্ণ + ${halfOwnersCount} জন অর্ধেক)` : `Total ${totalShareUnits} Shares (${fullOwnersCount} Full + ${halfOwnersCount} Half)`
								})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleOpenAddOwner,
										className: "px-2.5 py-1.5 rounded-xl bg-[#E52E2E] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন মালিক" : "Add" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleResetToDefault,
										title: isBn ? "ডিফল্ট তালিকায় রিসেট" : "Reset to Default",
										className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: isBn ? "মালিকের নাম দিয়ে খুঁজুন..." : "Search owner name...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									className: "w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#E52E2E]"
								})]
							}),
							totalCompanyDueAllOwners > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-rose-900 dark:text-rose-200",
										children: isBn ? `মালিকদের নিকট কোম্পানি পাওনা সমন্বয় (${toBengaliNumber(ownersWithDueCount)} জন)` : `Owner Company Due Adjustment (${ownersWithDueCount})`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-black text-rose-600 dark:text-rose-400 tabular-nums",
										children: renderAmount(totalCompanyDueAllOwners)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-1.5 border-t border-rose-200/70 dark:border-rose-900/40 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-600 dark:text-slate-400",
										children: [isBn ? "লভ্যাংশ থেকে কর্তন:" : "Deducted:", " "]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-amber-700 dark:text-amber-400 tabular-nums",
										children: ["-", renderAmount(totalDeductedFromDividend)]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-600 dark:text-slate-400",
											children: [isBn ? "কর্তন পর মোট প্রদেয়:" : "Net Payable:", " "]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-emerald-700 dark:text-emerald-400 tabular-nums",
											children: renderAmount(totalNetPayableAfterDeduction)
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1.5",
								children: filteredOwners.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-6 text-center text-xs text-slate-400",
									children: isBn ? "কোনো মালিক পাওয়া যায়নি" : "No owners found"
								}) : filteredOwners.map((owner, idx) => {
									const breakdown = byOwnerId[String(owner.id)];
									const shareUnits = breakdown ? breakdown.shareUnits : Number(owner.shareUnits) || 0;
									const isHalf = breakdown ? breakdown.isHalf : Boolean(owner.isHalf || shareUnits === .5);
									const sharePercentage = breakdown ? breakdown.sharePercentage : shareUnits / totalShareUnits * 100;
									const grossShare = breakdown ? breakdown.grossShare : netProfit > 0 ? netProfit * shareUnits / totalShareUnits : 0;
									const companyDue = breakdown ? breakdown.applicableCompanyDue : 0;
									const deductedAmount = breakdown ? breakdown.deductedAmount : 0;
									const netPayable = breakdown ? breakdown.netPayable : grossShare;
									const unpaidDueAfter = breakdown ? breakdown.unpaidDueAfterDividend : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										role: "button",
										tabIndex: 0,
										onClick: () => {
											sounds.playTap();
											setSelectedOwnerId(String(owner.id));
										},
										onKeyDown: (e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												sounds.playTap();
												setSelectedOwnerId(String(owner.id));
											}
										},
										className: `p-3 sm:p-3.5 rounded-2xl transition-all border cursor-pointer active:scale-[0.99] space-y-2 ${companyDue > 0 ? "bg-rose-50/40 border-rose-200/80 dark:bg-rose-950/15 dark:border-rose-900/50 hover:border-rose-300 dark:hover:border-rose-700" : isHalf ? "bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/25 dark:border-amber-900/40 hover:border-amber-500/60" : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-3 flex-1 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative shrink-0 mt-0.5",
													children: [owner.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: owner.avatarUrl,
														alt: owner.name,
														referrerPolicy: "no-referrer",
														className: "w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-xs"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-11 h-11 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${isHalf ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white" : "bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white"}`,
														children: isBn ? toBengaliNumber(idx + 1) : idx + 1
													}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: (e) => {
															var _quickFileInputRef$cu;
															e.stopPropagation();
															setQuickUploadOwnerId(owner.id);
															(_quickFileInputRef$cu = quickFileInputRef.current) === null || _quickFileInputRef$cu === void 0 || _quickFileInputRef$cu.click();
														},
														title: isBn ? "ছবি পরিবর্তন করুন" : "Change photo",
														className: "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 active:scale-95 transition-transform",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-2.5 h-2.5" })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1 min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[13px] sm:text-sm font-black text-slate-900 dark:text-white leading-snug break-words",
															children: owner.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 mt-1 flex-wrap",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isHalf ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"}`,
																children: isHalf ? isBn ? "অর্ধেক মালিক (০.৫ অংশ)" : "0.5 Half Share" : isBn ? `পূর্ণ মালিক (${shareUnits} অংশ)` : `${shareUnits} Share`
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[10px] font-semibold text-slate-400 tabular-nums",
																children: [
																	"• ",
																	sharePercentage.toFixed(2),
																	"%"
																]
															})]
														}),
														(owner.phone || owner.address) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "mt-1.5 flex flex-col gap-0.5 text-[10.5px] text-slate-500 dark:text-slate-400",
															children: [owner.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
																href: `tel:${owner.phone}`,
																onClick: (e) => e.stopPropagation(),
																className: "inline-flex items-center gap-1 hover:text-[#E52E2E] transition-colors w-fit",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-2.5 h-2.5 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold tabular-nums",
																	children: owner.phone
																})]
															}), owner.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "inline-flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-2.5 h-2.5 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "truncate max-w-[165px] sm:max-w-[240px]",
																	children: owner.address
																})]
															})]
														})
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right shrink-0 flex flex-col items-end justify-between",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: `text-sm sm:text-base font-black tabular-nums ${deductedAmount > 0 ? "text-emerald-600 dark:text-emerald-400" : isHalf ? "text-amber-600 dark:text-amber-400" : "text-[#E52E2E]"}`,
															children: renderAmount(netPayable)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9.5px] font-bold text-slate-400 tracking-tight",
														children: deductedAmount > 0 ? isBn ? "কর্তনের পর প্রাপ্য" : "Net Payable" : isBn ? "প্রাপ্য লভ্যাংশ" : "Payable"
													}),
													isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1 mt-2",
														onClick: (e) => e.stopPropagation(),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleOpenEditOwner(owner),
															className: "p-1.5 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors",
															title: isBn ? "সম্পাদনা করুন" : "Edit owner",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleDeleteOwner(owner.id),
															className: "p-1.5 rounded-lg bg-white/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 hover:text-rose-600 transition-colors",
															title: isBn ? "মুছে ফেলুন" : "Delete owner",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
														})]
													})
												]
											})]
										}), companyDue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-2 border-t border-rose-200/70 dark:border-rose-900/40 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10.5px] font-bold tabular-nums",
											children: deductedAmount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600 dark:text-slate-400",
													children: isBn ? `মোট শেয়ার: ${renderAmount(grossShare)}` : `Gross: ${renderAmount(grossShare)}`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-600 dark:text-rose-400",
													children: isBn ? `কোম্পানি পাওনা কর্তন: -${renderAmount(deductedAmount)}` : `Due Deducted: -${renderAmount(deductedAmount)}`
												}),
												unpaidDueAfter > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-600 dark:text-amber-400",
													children: isBn ? `অবশিষ্ট পাওনা: ${renderAmount(unpaidDueAfter)}` : `Remaining Due: ${renderAmount(unpaidDueAfter)}`
												})
											] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-600 dark:text-rose-400",
												children: isBn ? `কোম্পানি পাওনা বকেয়া: ${renderAmount(companyDue)}` : `Company Due: ${renderAmount(companyDue)}`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 font-semibold",
												children: isBn ? "বিস্তারিত দেখুন ›" : "View details ›"
											})] })
										})]
									}, owner.id);
								})
							})
						]
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleConfirmDistribution,
						className: "w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:opacity-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "লভ্যাংশ বণ্টন চূড়ান্ত করুন" : "Confirm Distribution" })]
					})
				]
			}),
			isEditorOpen && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white",
								children: editingOwner ? isBn ? "মালিকের তথ্য পরিবর্তন" : "Edit Owner Details" : isBn ? "নতুন মালিক যোগ করুন" : "Add New Owner"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsEditorOpen(false),
								className: "w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center gap-2 py-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [formAvatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: formAvatarUrl,
										alt: "Preview",
										className: "w-20 h-20 rounded-full object-cover border-2 border-[#E52E2E] shadow-sm"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-8 h-8" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											var _fileInputRef$current;
											return (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
										},
										className: "absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#E52E2E] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all",
										title: isBn ? "ছবি নির্বাচন করুন" : "Upload photo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									ref: fileInputRef,
									onChange: handlePhotoSelect,
									accept: "image/*",
									className: "hidden"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											var _fileInputRef$current2;
											return (_fileInputRef$current2 = fileInputRef.current) === null || _fileInputRef$current2 === void 0 ? void 0 : _fileInputRef$current2.click();
										},
										className: "text-[11px] font-bold text-[#E52E2E] hover:underline",
										children: formAvatarUrl ? isBn ? "ছবি পরিবর্তন" : "Change Photo" : isBn ? "ছবি আপলোড করুন" : "Upload Photo"
									}), formAvatarUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFormAvatarUrl(""),
										className: "text-[11px] font-bold text-slate-400 hover:text-rose-600",
										children: isBn ? "ছবি মুছুন" : "Remove"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: isBn ? "মালিকের নাম" : "Owner Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: formName,
								onChange: (e) => setFormName(e.target.value),
								placeholder: isBn ? "উদা: মোঃ আব্দুর রহিম" : "e.g. John Doe",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মোবাইল নাম্বার" : "Mobile Number" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "tel",
								value: formPhone,
								onChange: (e) => setFormPhone(e.target.value),
								placeholder: isBn ? "উদা: ০১৭০০-০০০০০০" : "e.g. 01700-000000",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ঠিকানা" : "Address" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: formAddress,
								onChange: (e) => setFormAddress(e.target.value),
								placeholder: isBn ? "উদা: গ্রাম / বাজার, থানা, জেলা" : "e.g. Village, City",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3 h-3 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মন্তব্য / নোট (ঐচ্ছিক)" : "Notes (Optional)" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: formNotes,
								onChange: (e) => setFormNotes(e.target.value),
								placeholder: isBn ? "শেয়ার বা অন্যান্য বিবরণ..." : "Notes...",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: isBn ? "শেয়ারের ধরন" : "Share Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFormShareUnits(1),
									className: `p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${formShareUnits === 1 ? "border-[#E52E2E] bg-rose-50 dark:bg-rose-950/30 text-[#E52E2E]" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "leading-tight",
										children: isBn ? "পূর্ণ শেয়ার" : "Full Share"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] opacity-75 mt-0.5",
										children: isBn ? "১ অংশ (৮%)" : "1.0 Share (8%)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setFormShareUnits(.5),
									className: `p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${formShareUnits === .5 ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "leading-tight",
										children: isBn ? "অর্ধেক শেয়ার" : "Half Share"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] opacity-75 mt-0.5",
										children: isBn ? "০.৫ অংশ (৪%)" : "0.5 Share (4%)"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex gap-2",
							children: [
								editingOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleDeleteOwner(editingOwner.id),
									className: "px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold text-xs hover:bg-rose-100",
									children: isBn ? "মুছুন" : "Delete"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsEditorOpen(false),
									className: "flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs",
									children: isBn ? "বাতিল" : "Cancel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSaveOwnerForm,
									disabled: !formName.trim(),
									className: "flex-1 py-2.5 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50",
									children: isBn ? "সংরক্ষণ" : "Save"
								})
							]
						})
					]
				})
			}),
			isFinEditorOpen && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: isBn ? "কোম্পানি আয় ও ব্যয় হিসাব সম্পাদনা" : "Edit Company Accounts"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsFinEditorOpen(false),
								className: "w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কোম্পানি মোট আয় (৳)" : "Total Income (৳)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editIncome,
										onChange: (e) => setEditIncome(e.target.value),
										placeholder: "0",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "কোম্পানি মোট ব্যয় (৳)" : "Total Expense (৳)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editExpense,
										onChange: (e) => setEditExpense(e.target.value),
										placeholder: "0",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "স্টাফ বেতন ও মজুরি (৳)" : "Staff Salary & Wages (৳)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editStaffSalary,
										onChange: (e) => setEditStaffSalary(e.target.value),
										placeholder: "0",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-slate-600 dark:text-slate-300",
										children: [isBn ? "অবশিষ্ট নিট লাভ" : "Calculated Net Profit", ":"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-black text-[#E52E2E] tabular-nums",
										children: formatCurrency((Number(editIncome) || 0) - (Number(editExpense) || 0), lang)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										fetchSummary();
										setIsFinEditorOpen(false);
									},
									className: "px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 flex items-center gap-1",
									title: isBn ? "API থেকে রিলোড" : "Reload API",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "API সিঙ্ক" : "Sync" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsFinEditorOpen(false),
									className: "flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs",
									children: isBn ? "বাতিল" : "Cancel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSaveFinSummary,
									disabled: isSavingFin,
									className: "flex-1 py-2.5 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50",
									children: isSavingFin ? isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..." : isBn ? "সংরক্ষণ" : "Save"
								})
							]
						})
					]
				})
			}),
			selectedOwnerBreakdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerDetailView, {
				breakdown: selectedOwnerBreakdown,
				ownerIndex: selectedOwnerIndex,
				totalShareUnits,
				netProfit,
				selectedMonth,
				lang,
				isAdmin,
				user,
				staffAccounts,
				onSaveStaffAccounts,
				onEditOwner: () => handleOpenEditOwner(selectedOwnerBreakdown.owner),
				onBack: () => setSelectedOwnerId(null)
			})
		]
	});
};
//#endregion
export { QuickHisabModal };
