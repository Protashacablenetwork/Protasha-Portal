import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { $ as Package, $t as ChevronUp, At as FileText, Bt as DollarSign, Cn as ArrowDownToLine, D as SquarePlus, En as require_react, G as Radio, Gt as Cloud, H as RefreshCw, Ht as CreditCard, It as ExternalLink, J as Plus, K as Printer, Lt as Ellipsis, M as ShieldCheck, O as Sparkles, P as Share2, Q as PenLine, Qt as CircleAlert, R as Search, S as Tag, Sn as ArrowLeft, T as Sun, Tn as ArrowDownLeft, V as RotateCcw, W as ReceiptText, Xt as CirclePlus, Yt as Clock, Z as Pen, Zt as CircleCheck, _ as TriangleAlert, a as Wifi, an as ChartPie, bn as ArrowUpRight, cn as ChartColumn, d as Users, dt as Lock, en as ChevronRight, gn as BookOpen, ht as Layers, jt as FileSpreadsheet, k as Smartphone, mn as Boxes, mt as LayoutDashboard, n as X, nn as ChevronDown, o as WifiOff, pn as Briefcase, r as Wrench, rn as Check, s as Wallet, sn as ChartNoAxesColumnIncreasing, t as Zap, tt as Moon, un as Calendar, ut as LogIn, v as TrendingUp, wn as ArrowDownRight, x as Trash2, xn as ArrowRight, xt as History, y as TrendingDown, z as Scale, zt as Download } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, l as onSnapshot, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { H as initialTransactions, W as showToast, at as handleFirestoreError, ct as staffDb, g as isActualStaffAccount, j as hasSubAdminPermission, nt as OperationType, o as broadcastStaffAccounts, ot as safeDeleteDoc, p as upsertSingleStaffToCloud, s as deleteSingleStaffFromCloud, st as safeSetDoc, u as sanitizeStaffForFirestore } from "./app.js";
import { a as formatCurrency, c as getTransactionMonth, d as parseNumber, i as STAFF_DESIGNATIONS, l as isExpenseTransaction, n as INCOME_CATEGORIES, o as formatEnglishCurrency, r as PAYMENT_METHODS, s as getMonthBengaliName, t as EXPENSE_CATEGORIES, u as isIncomeTransaction } from "./chunk-categories.js";
import { c as ALL_MONTHS, f as getActiveSheetLink, r as fetchSheetRecordsFast } from "./chunk-utils.js";
//#region src/portals/ayByay/hooks/usePWAInstall.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function usePWAInstall() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(false);
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const isStandalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
		setIsInstalled(Boolean(isStandalone));
		if (typeof window !== "undefined") {
			const userAgent = window.navigator.userAgent.toLowerCase();
			const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
			setIsIOS(isIOSDevice);
		}
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);
	const install = async () => {
		if (!deferredPrompt) return false;
		try {
			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === "accepted") {
				setIsInstalled(true);
				setDeferredPrompt(null);
				return true;
			}
		} catch (err) {
			console.warn("Install prompt error:", err);
		}
		return false;
	};
	return {
		isInstallable: !!deferredPrompt,
		isInstalled,
		isIOS,
		install
	};
}
//#endregion
//#region src/portals/ayByay/components/PWAInstallButton.tsx
var import_jsx_runtime = require_jsx_runtime();
var PWAInstallButton = ({ variant = "header" }) => {
	const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
	const [showIOSGuide, setShowIOSGuide] = (0, import_react.useState)(false);
	const [isDismissed, setIsDismissed] = (0, import_react.useState)(false);
	if (isInstalled || isDismissed) return null;
	if (!isInstallable && !isIOS) return null;
	const handleInstallClick = () => {
		if (isIOS) setShowIOSGuide(true);
		else install();
	};
	if (variant === "banner") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white px-4 py-2.5 rounded-2xl mb-4 flex items-center justify-between gap-3 shadow-lg border border-indigo-700/50 no-print",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-400/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5 text-emerald-400" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm font-bold text-slate-100",
				children: "মোবাইলে অ্যাপের মতো ইন্সটল করুন"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-slate-300",
				children: "হোম স্ক্রিনে যোগ করে সরাসরি নেটওয়ার্কের আয়-ব্যয় হিসাব রাখুন"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleInstallClick,
				className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-900/40 transition active:scale-95 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ইন্সটল" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIsDismissed(true),
				className: "p-1 rounded-lg text-slate-400 hover:text-white transition",
				title: "বন্ধ করুন",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
			})]
		})]
	}), showIOSGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							children: "iPhone / iPad এ ইন্সটল"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowIOSGuide(false),
						className: "p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "১"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"Safari ব্রাউজারের নিচে থাকা ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5 inline" }), " Share"]
								}),
								" বাটনে চাপ দিন।"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "২"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"নিচে স্ক্রল করে ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePlus, { className: "w-3.5 h-3.5 inline" }), " Add to Home Screen"]
								}),
								" অপশনটি বেছে নিন।"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "৩"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"উপরের ডান কোণায় ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 inline" }), " Add"]
								}),
								" বাটনে ট্যাপ করলেই অ্যাপ হোম স্ক্রিনে সেভ হয়ে যাবে।"
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowIOSGuide(false),
					className: "mt-5 w-full rounded-2xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition",
					children: "ঠিক আছে, বুঝতে পেরেছি"
				})
			]
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: handleInstallClick,
		title: "অ্যাপ হিসেবে মোবাইলে বা পিসিতে ইন্সটল করুন",
		className: "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer animate-pulse",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "whitespace-nowrap",
			children: "অ্যাপ ইন্সটল"
		})]
	}), showIOSGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold",
							children: "iPhone / iPad এ ইন্সটল"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowIOSGuide(false),
						className: "p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "১"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"Safari ব্রাউজারের নিচে থাকা ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5 inline" }), " Share"]
								}),
								" বাটনে চাপ দিন।"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "২"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"নিচে স্ক্রল করে ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePlus, { className: "w-3.5 h-3.5 inline" }), " Add to Home Screen"]
								}),
								" অপশনটি বেছে নিন।"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0",
								children: "৩"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								"উপরের ডান কোণায় ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 inline" }), " Add"]
								}),
								" বাটনে ট্যাপ করলেই অ্যাপ হোম স্ক্রিনে সেভ হয়ে যাবে।"
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowIOSGuide(false),
					className: "mt-5 w-full rounded-2xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition",
					children: "ঠিক আছে, বুঝতে পেরেছি"
				})
			]
		})
	})] });
};
//#endregion
//#region src/portals/ayByay/components/Header.tsx
var Header = ({ config, activeNav, onNavChange, onOpenReportModal, onExportCsv, isDarkMode, onToggleDarkMode, isAdminLoggedIn, onOpenAdminLogin, onAdminLogout, onOpenNewMonthModal, onExit, onOpenDriveBackup }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "app-header mb-1 sm:mb-2 pt-0.5 pb-1 px-3 sm:px-5 transition-all duration-200 no-print bg-transparent text-slate-900 dark:text-white max-w-full overflow-x-auto scrollbar-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-slate-200/80 dark:border-slate-800 min-w-[320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 shrink-0",
				children: [
					onExit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onExit,
						className: "hidden md:flex w-10 h-10 rounded-xl items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-90 transition-all mr-1",
						title: "অ্যাপ ড্যাশবোর্ডে ফিরে যান",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.5]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png",
						alt: "আয়-ব্যয় লোগো",
						className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shadow-emerald-100 dark:shadow-none shrink-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-lg sm:text-2xl font-black tracking-tight leading-tight",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-600 dark:text-emerald-400",
									children: "আয়"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-900 dark:text-white",
									children: "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-600 dark:text-rose-400",
									children: "ব্যয়"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] sm:text-xs text-slate-500 dark:!text-white font-medium tracking-wide",
						children: "স্মার্ট ব্যবস্থাপনা"
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2.5 h-2.5 rounded-full animate-pulse ${config.syncStatus === "connected" ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : config.syncStatus === "syncing" ? "bg-amber-500 shadow-xs shadow-amber-500/50" : "bg-rose-500 shadow-xs shadow-rose-500/50"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap",
							children: config.syncStatus === "connected" ? "ক্লাউড সিঙ্ক সক্রিয়" : config.syncStatus === "syncing" ? "সিঙ্ক হচ্ছে..." : "অফলাইন মোড"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallButton, { variant: "header" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						id: "btn-theme-toggle",
						onClick: onToggleDarkMode,
						title: isDarkMode ? "লাইট মোডে পরিবর্তন করুন" : "ডার্ক মোডে পরিবর্তন করুন",
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-[11px] sm:text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-2xs transition active:scale-95 shrink-0 cursor-pointer",
						children: isDarkMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap",
							children: "লাইট"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-indigo-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap",
							children: "ডার্ক"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: "btn-export-csv",
						onClick: onExportCsv,
						className: "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition shadow-2xs active:scale-95 shrink-0 cursor-pointer",
						title: "এক্সেল / CSV রিপোর্ট ডাউনলোড করুন",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এক্সেল এক্সপোর্ট (CSV)" })]
					}),
					onOpenDriveBackup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onOpenDriveBackup,
						title: "গুগল ড্রাইভ সেন্ট্রালাইজড ব্যাকআপ ও রিস্টোর",
						className: "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 text-[11px] sm:text-xs font-bold border border-blue-200 dark:border-blue-800 transition shadow-2xs active:scale-95 shrink-0 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "ড্রাইভ "
						}), "ব্যাকআপ"] })]
					}),
					isAdminLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: "btn-admin-logout",
						onClick: onAdminLogout,
						title: "এডমিন লগআউট করুন",
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "এডমিন "
							}), "লগআউট"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: "btn-admin-login",
						onClick: onOpenAdminLogin,
						title: "এডমিন প্যানেলে লগইন করুন",
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 shrink-0 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "এডমিন "
							}), "লগইন"]
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "hidden md:flex flex-wrap items-center gap-2 mt-3 pb-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("dashboard"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "dashboard" || activeNav === "card_detail" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "w-4 h-4 text-indigo-400 dark:text-indigo-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ড্যাশবোর্ড" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("inventory"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "inventory" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-4 h-4 text-emerald-500 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মালামাল স্টক (Inventory)" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("analytics"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "analytics" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-cyan-500 dark:text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "চার্ট ও গ্রাফ (Analytics)" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("staff"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "staff" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-blue-500 dark:text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টাফ ও বেতন" })]
				}),
				isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("new_entry"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "new_entry" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4 text-emerald-500 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন এন্ট্রি" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("transactions"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "transactions" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "w-4 h-4 text-purple-500 dark:text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "লেনদেন খতিয়ান" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavChange("report"),
					className: `inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${activeNav === "report" ? "bg-slate-900 text-white shadow-md dark:bg-indigo-600 dark:text-white" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, { className: "w-4 h-4 text-rose-500 dark:text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মাসিক রিপোর্ট" })]
				})
			]
		})]
	});
};
//#endregion
//#region src/portals/ayByay/components/StatsCards.tsx
var StatsCards = ({ totalIncome, totalExpense, netProfit, paidSalaries, totalBandwidthOps, incomeCount, expenseCount, staffCount, onCardClick, onNavigateToLedger, currencySymbol = "৳" }) => {
	const totalCount = incomeCount + expenseCount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stats-dashboard grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 no-print",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-income",
				onClick: () => onCardClick("income"),
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
					boxShadow: "0 6px 18px rgba(16, 185, 129, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "মোট আয়"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: formatCurrency(totalIncome, currencySymbol)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [incomeCount, " টি এন্ট্রি"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["দেখান ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-expense",
				onClick: () => onCardClick("expense"),
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #dc2626 0%, #f43f5e 100%)",
					boxShadow: "0 6px 18px rgba(239, 68, 68, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-rose-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "মোট ব্যয়"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: formatCurrency(totalExpense, currencySymbol)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-rose-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [expenseCount, " টি খাত"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["দেখান ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-profit",
				onClick: () => onCardClick("net_profit"),
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
					boxShadow: "0 6px 18px rgba(124, 58, 237, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-purple-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-purple-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "নিট ব্যালেন্স"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: formatCurrency(netProfit, currencySymbol)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-purple-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: netProfit >= 0 ? "উদ্বৃত্ত তহবিল" : "ঘাটতি" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["স্টেটমেন্ট ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-staff-salary",
				onClick: () => onCardClick("staff_salary"),
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
					boxShadow: "0 6px 18px rgba(37, 99, 235, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-blue-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "স্টাফ বেতন"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: formatCurrency(paidSalaries, currencySymbol)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-blue-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [staffCount, " জন স্টাফ"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["হিসাব ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-bandwidth",
				onClick: () => onCardClick("bandwidth_ops"),
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
					boxShadow: "0 6px 18px rgba(6, 182, 212, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-cyan-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-cyan-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "ব্যান্ডউইথ/অপস"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: formatCurrency(totalBandwidthOps, currencySymbol)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-cyan-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "আপস্ট্রিম ও ফাইবার" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["দেখান ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "card-stat-all-records",
				onClick: () => {
					if (onNavigateToLedger) onNavigateToLedger();
					else onCardClick("net_profit");
				},
				className: "group relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white cursor-pointer transition-all duration-200 active:scale-97 select-none shadow-sm",
				style: {
					background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
					boxShadow: "0 6px 18px rgba(79, 70, 229, 0.2)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] sm:text-[11px] font-bold tracking-wider text-indigo-100 uppercase flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-indigo-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "মোট এন্ট্রি"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-1 rounded-lg bg-white/20 text-white shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "w-3.5 h-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-base sm:text-xl md:text-2xl font-black mt-2 tracking-tight truncate",
						children: [totalCount, " টি"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[10px] sm:text-[11px] text-indigo-100 mt-2 pt-1.5 border-t border-white/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সর্বমোট রেকর্ড" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-0.5 font-medium",
							children: ["খতিয়ান ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3 h-3" })]
						})]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/DashboardOverview.tsx
var DashboardOverview = ({ transactions, salaries, staffList, selectedMonth, onMonthChange, onOpenCardDetail, onOpenNewTransaction, onNavigateToStaff, onNavigateToLedger, config, onOpenNewMonthModal, availableMonths = [], isAdminLoggedIn = false }) => {
	const monthTxns = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		return transactions.filter((t) => {
			if (!t || typeof t.date !== "string") return false;
			return getTransactionMonth(t.date) === selectedMonth;
		});
	}, [transactions, selectedMonth]);
	const incomeCategoryData = (0, import_react.useMemo)(() => {
		const incomes = monthTxns.filter((t) => isIncomeTransaction(t));
		const total = incomes.reduce((acc, t) => acc + parseNumber(t.amount), 0);
		const map = {};
		incomes.forEach((t) => {
			if (t) {
				const cat = String(t.category || "অন্যান্য");
				map[cat] = (map[cat] || 0) + parseNumber(t.amount);
			}
		});
		return {
			total,
			items: Object.entries(map).map(([category, amount]) => ({
				category,
				amount,
				percentage: total > 0 ? Math.min(100, Math.round(amount / total * 100)) : 0
			})).sort((a, b) => b.amount - a.amount)
		};
	}, [monthTxns]);
	const expenseCategoryData = (0, import_react.useMemo)(() => {
		const expenses = monthTxns.filter((t) => isExpenseTransaction(t));
		const total = expenses.reduce((acc, t) => acc + parseNumber(t.amount), 0);
		const map = {};
		expenses.forEach((t) => {
			if (t) {
				const cat = String(t.category || "অন্যান্য");
				map[cat] = (map[cat] || 0) + parseNumber(t.amount);
			}
		});
		return {
			total,
			items: Object.entries(map).map(([category, amount]) => ({
				category,
				amount,
				percentage: total > 0 ? Math.min(100, Math.round(amount / total * 100)) : 0
			})).sort((a, b) => b.amount - a.amount)
		};
	}, [monthTxns]);
	const monthSalaries = (0, import_react.useMemo)(() => {
		if (!Array.isArray(salaries)) return [];
		return salaries.filter((s) => s && s.month === selectedMonth);
	}, [salaries, selectedMonth]);
	const activeStaff = (staffList || []).filter((s) => s && s.status === "active");
	const paidCount = monthSalaries.filter((s) => s && s.paymentStatus === "paid").length;
	const pendingCount = Math.max(0, activeStaff.length - paidCount);
	const now = /* @__PURE__ */ new Date();
	const currentCalendarMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	const isCurrentMonth = selectedMonth === currentCalendarMonth;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap",
							children: "হিসাবের মাস:"
						}), availableMonths.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedMonth,
							onChange: (e) => onMonthChange(e.target.value),
							className: "px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20",
							children: availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m,
								children: [
									getMonthBengaliName(m),
									" ",
									m === currentCalendarMonth ? "(চলতি মাস)" : ""
								]
							}, m))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "month",
							value: selectedMonth,
							onChange: (e) => onMonthChange(e.target.value),
							className: "px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 flex-wrap shrink-0",
					children: !isCurrentMonth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onMonthChange(currentCalendarMonth),
						className: "px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 shrink-0 cursor-pointer",
						title: "চলতি মাসের ড্যাশবোর্ডে ফিরে যান",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "চলতি মাস" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:block bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/10 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-amber-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-base font-black tracking-tight text-white",
								children: [getMonthBengaliName(selectedMonth), " মাসের আর্থিক স্বাস্থ্য ও লাভ-ক্ষতি ওভারভিউ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-indigo-200/80 font-medium",
								children: "মোট আয় বনাম খরচের রিয়েল-টাইম ক্যালকুলেশন ও সারসংক্ষেপ"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-amber-300",
							children: "ডেস্কটপ ফিন্যান্সিয়াল উইজেট"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-emerald-300 font-semibold flex items-center gap-1 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), " মোট আয় (Total Income)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl lg:text-2xl font-black text-emerald-400",
									children: formatCurrency(incomeCategoryData.total, config.currencySymbol)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-rose-300 font-semibold flex items-center gap-1 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" }), " মোট খরচ (Total Expense)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl lg:text-2xl font-black text-rose-400",
									children: formatCurrency(expenseCategoryData.total, config.currencySymbol)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-cyan-300 font-semibold flex items-center gap-1 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), " নিট মুনাফা / উদ্বৃত্ত"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-xl lg:text-2xl font-black ${incomeCategoryData.total - expenseCategoryData.total >= 0 ? "text-cyan-400" : "text-rose-400"}`,
									children: formatCurrency(incomeCategoryData.total - expenseCategoryData.total, config.currencySymbol)
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-slate-900 dark:text-slate-100",
								children: "আয়ের প্রধান খাতসমূহ (ISP Revenue)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onOpenCardDetail("income"),
							className: "text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline inline-flex items-center gap-0.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সব দেখুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3 h-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3.5",
						children: incomeCategoryData.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-xs text-slate-400 dark:text-slate-500",
							children: "চলতি মাসে এখনো কোনো আয় এন্ট্রি করা হয়নি"
						}) : incomeCategoryData.items.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-700 dark:text-slate-300 truncate pr-2",
										children: item.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-slate-100 shrink-0",
										children: formatCurrency(item.amount, config.currencySymbol)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-emerald-500 h-2 rounded-full transition-all duration-300",
										style: { width: `${item.percentage}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between text-[10px] text-slate-400 dark:text-slate-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"মোট আয়ের ",
										item.percentage,
										"%"
									] })
								})
							]
						}, item.category))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500 dark:text-slate-400",
							children: "চলতি মাসের মোট আয়:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-emerald-700 dark:text-emerald-400 text-sm",
							children: formatCurrency(incomeCategoryData.total, config.currencySymbol)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-slate-900 dark:text-slate-100",
								children: "ব্যয় ও অপারেশন খাতসমূহ (ISP Expenses)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onOpenCardDetail("expense"),
							className: "text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:underline inline-flex items-center gap-0.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সব দেখুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3 h-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3.5",
						children: expenseCategoryData.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-xs text-slate-400 dark:text-slate-500",
							children: "চলতি মাসে এখনো কোনো ব্যয় এন্ট্রি করা হয়নি"
						}) : expenseCategoryData.items.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-700 dark:text-slate-300 truncate pr-2",
										children: item.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-slate-100 shrink-0",
										children: formatCurrency(item.amount, config.currencySymbol)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-rose-500 h-2 rounded-full transition-all duration-300",
										style: { width: `${item.percentage}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between text-[10px] text-slate-400 dark:text-slate-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"মোট ব্যয়ের ",
										item.percentage,
										"%"
									] })
								})
							]
						}, item.category))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-500 dark:text-slate-400",
							children: "চলতি মাসের মোট ব্যয়:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-black text-rose-700 dark:text-rose-400 text-sm",
							children: formatCurrency(expenseCategoryData.total, config.currencySymbol)
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-md flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টাফ বেতন অবস্থা" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-semibold",
							children: getMonthBengaliName(selectedMonth)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-300",
									children: "মোট সক্রিয় স্টাফ:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-white",
									children: [activeStaff.length, " জন"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন পরিশোধিত:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold",
									children: [paidCount, " জন"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-amber-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন বকেয়া:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: pendingCount > 0 ? `${pendingCount} জন` : "সব পরিশোধিত"
								})]
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onNavigateToStaff,
						className: "mt-5 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন হিসাব ও পে-রোলে যান" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-sm text-slate-900 dark:text-slate-100",
								children: [
									"সাম্প্রতিক লেনদেনসমূহ (",
									monthTxns.length,
									" টি)"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onNavigateToLedger,
							className: "text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সব লেনদেন খতিয়ান" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3 h-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3.5 divide-y divide-slate-100 dark:divide-slate-800/60",
						children: monthTxns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-xs text-slate-400 dark:text-slate-500",
							children: "এই মাসে এখনো কোনো লেনদেন পাওয়া যায়নি। \"+ এন্ট্রি ফরম খুলুন\" বাটনে ক্লিক করে নতুন লেনদেন যোগ করুন।"
						}) : monthTxns.slice(0, 10).map((t) => {
							const isInc = isIncomeTransaction(t);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 flex items-center justify-between gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `p-1.5 rounded-lg shrink-0 ${isInc ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400"}`,
										children: isInc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-800 dark:text-slate-200 truncate",
											children: t.description || t.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-slate-400 dark:text-slate-500",
											children: [
												t.date,
												" • ",
												t.category,
												" • ",
												t.paymentMethod || "নগদ"
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-black shrink-0 ${isInc ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
									children: [isInc ? "+" : "-", formatCurrency(parseNumber(t.amount), config.currencySymbol)]
								})]
							}, t.id);
						})
					})] }), monthTxns.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onNavigateToLedger,
							className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer",
							children: [
								"আরও ",
								monthTxns.length - 10,
								" টি লেনদেন দেখুন →"
							]
						})
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/CardDetailModal.tsx
var CardDetailModal = ({ type, isOpen, onClose, transactions = [], salaries = [], staffList = [], selectedMonth = "", onMonthChange, onSelectTransaction, onDeleteTransaction, onNavigateToStaff, onNavigateToLedger, onViewSalarySlip, onOpenNewTransaction, config, isAdminLoggedIn = false }) => {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [timeFilter, setTimeFilter] = (0, import_react.useState)("month");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const currencySymbol = (config === null || config === void 0 ? void 0 : config.currencySymbol) || "৳";
	const baseTxns = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		if (timeFilter === "all") return transactions.filter((t) => Boolean(t));
		return transactions.filter((t) => {
			if (!t || typeof t.date !== "string") return false;
			return getTransactionMonth(t.date) === selectedMonth;
		});
	}, [
		transactions,
		selectedMonth,
		timeFilter
	]);
	const incomeTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => isIncomeTransaction(t));
	}, [baseTxns]);
	const expenseTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => isExpenseTransaction(t));
	}, [baseTxns]);
	const totalIncome = (0, import_react.useMemo)(() => {
		return incomeTxns.reduce((acc, t) => acc + parseNumber(t === null || t === void 0 ? void 0 : t.amount), 0);
	}, [incomeTxns]);
	const totalExpense = (0, import_react.useMemo)(() => {
		return expenseTxns.reduce((acc, t) => acc + parseNumber(t === null || t === void 0 ? void 0 : t.amount), 0);
	}, [expenseTxns]);
	const bandwidthOpsCategories = [
		"ব্যান্ডউইথ/আপস্ট্রিম বিল",
		"বিদ্যুৎ বিল",
		"অফিস ভাড়া",
		"অপটিক্যাল ফাইবার ও কেবল",
		"ONU/OLT/Router ক্রয়",
		"স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ",
		"কেবল মেরামত ও রক্ষণাবেক্ষণ",
		"আপস্ট্রিম ব্যান্ডউইথ বিল (IIG/ITC/NTTN)",
		"ফাইবার অপটিক কেবল ও স্প্লিটার সামগ্রী",
		"রাউটার, ওএলটি (OLT) ও সুইচ যন্ত্রপাতি",
		"সার্ভার রুম ও পপ (POP) বিদ্যুৎ বিল",
		"সংযোগ মেরামত ও লাইন স্প্লাইসিং খরচ"
	];
	const bandwidthOpsTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => {
			if (!t || t.type !== "expense") return false;
			const cat = String(t.category || "");
			return bandwidthOpsCategories.includes(cat) || cat.includes("ব্যান্ডউইথ") || cat.includes("কেবল") || cat.includes("ফাইবার") || cat.includes("বিদ্যুৎ") || cat.includes("ONU");
		});
	}, [baseTxns]);
	const totalBandwidthOps = (0, import_react.useMemo)(() => {
		return bandwidthOpsTxns.reduce((acc, t) => acc + (Number(t === null || t === void 0 ? void 0 : t.amount) || 0), 0);
	}, [bandwidthOpsTxns]);
	const monthSalaries = (0, import_react.useMemo)(() => {
		if (!Array.isArray(salaries)) return [];
		if (timeFilter === "all") return salaries.filter((s) => Boolean(s));
		return salaries.filter((s) => s && String(s.month || "") === selectedMonth);
	}, [
		salaries,
		selectedMonth,
		timeFilter
	]);
	const paidSalariesTotal = (0, import_react.useMemo)(() => {
		return monthSalaries.filter((s) => s && s.paymentStatus === "paid").reduce((acc, s) => acc + (Number(s === null || s === void 0 ? void 0 : s.netSalary) || 0), 0);
	}, [monthSalaries]);
	const pendingSalariesTotal = (0, import_react.useMemo)(() => {
		return monthSalaries.filter((s) => s && s.paymentStatus === "pending").reduce((acc, s) => acc + (Number(s === null || s === void 0 ? void 0 : s.netSalary) || 0), 0);
	}, [monthSalaries]);
	const getCategoryBreakdown = (list, total) => {
		const map = {};
		(list || []).forEach((t) => {
			if (t) {
				const cat = String(t.category || "অন্যান্য");
				map[cat] = (map[cat] || 0) + (Number(t.amount) || 0);
			}
		});
		return Object.entries(map).map(([category, amount]) => ({
			category,
			amount,
			percentage: total > 0 ? Math.min(100, Math.round(amount / total * 100)) : 0
		})).sort((a, b) => b.amount - a.amount);
	};
	const { title, subtitle, mainAmount, headerBg, badgeColor, icon, activeTxnList, categoryList, targetLedgerFilter } = (0, import_react.useMemo)(() => {
		let t = "হিসাব ও আর্থিক বিবরণী";
		let sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth || "")} মাসের নির্দিষ্ট খতিয়ান` : "কোম্পানির সর্বমোট লেনদেন খতিয়ান";
		let amt = 0;
		let bg = "bg-gradient-to-r from-indigo-600 to-blue-700 text-white";
		let badge = "bg-indigo-500/20 text-indigo-100 border border-indigo-300/30";
		let ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6 text-white" });
		let list = [];
		let cats = [];
		let filter = "all";
		if (type === "income") {
			t = "ইন্টারনেট বিল ও মোট আয় বিবরণী";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের রাজস্ব ও আয়ের নির্দিষ্ট খতিয়ান` : "সর্বমোট গ্রাহক বিল ও আয়ের খতিয়ান";
			amt = totalIncome;
			bg = "bg-gradient-to-r from-emerald-600 to-teal-700 text-white";
			badge = "bg-emerald-500/20 text-emerald-100 border border-emerald-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-6 h-6 text-white" });
			list = incomeTxns;
			cats = getCategoryBreakdown(incomeTxns, totalIncome);
			filter = "income";
		} else if (type === "expense") {
			t = "কোম্পানি ব্যয় ও খরচ বিবরণী";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের আপস্ট্রিম, বেতন ও ব্যয়ের খতিয়ান` : "সর্বমোট অপারেশন ও কোম্পানি ব্যয়ের খতিয়ান";
			amt = totalExpense;
			bg = "bg-gradient-to-r from-rose-600 to-red-700 text-white";
			badge = "bg-rose-500/20 text-rose-100 border border-rose-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-6 h-6 text-white" });
			list = expenseTxns;
			cats = getCategoryBreakdown(expenseTxns, totalExpense);
			filter = "expense";
		} else if (type === "staff_salary") {
			t = "স্টাফ বেতন ও পে-রোল হিসাব সারাংশ";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের কর্মচারীদের বেতন ও পারিশ্রমিক তথ্য` : "সকল মাসের স্টাফ পে-রোল ও বেতন সারাংশ";
			amt = paidSalariesTotal;
			bg = "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";
			badge = "bg-blue-500/20 text-blue-100 border border-blue-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6 text-white" });
		} else if (type === "bandwidth_ops") {
			t = "আপস্ট্রিম ব্যান্ডউইথ ও নেটওয়ার্ক অপারেশন খরচ";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের IIG ব্যান্ডউইথ, ফাইবার ও বিদ্যুৎ খরচ` : "সর্বমোট নেটওয়ার্ক অবকাঠামো ও আপস্ট্রিম বিল";
			amt = totalBandwidthOps;
			bg = "bg-gradient-to-r from-cyan-600 to-blue-700 text-white";
			badge = "bg-cyan-500/20 text-cyan-100 border border-cyan-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "w-6 h-6 text-white" });
			list = bandwidthOpsTxns;
			cats = getCategoryBreakdown(bandwidthOpsTxns, totalBandwidthOps);
			filter = "expense";
		} else if (type === "net_profit") {
			const net = totalIncome - totalExpense;
			t = "চলতি নিট লাভ ও নগদ ব্যালেন্স স্টেটমেন্ট";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের আয় বনাম ব্যয়ের নিট উদ্বৃত্ত` : "সর্বমোট আয় বনাম মোট ব্যয়ের নিট ব্যালেন্স";
			amt = net;
			bg = "bg-gradient-to-r from-purple-600 to-violet-800 text-white";
			badge = "bg-purple-500/20 text-purple-100 border border-purple-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6 text-white" });
			list = baseTxns;
			cats = getCategoryBreakdown(baseTxns, totalIncome + totalExpense);
			filter = "all";
		}
		return {
			title: t,
			subtitle: sub,
			mainAmount: amt,
			headerBg: bg,
			badgeColor: badge,
			icon: ic,
			activeTxnList: list,
			categoryList: cats,
			targetLedgerFilter: filter
		};
	}, [
		type,
		selectedMonth,
		timeFilter,
		totalIncome,
		totalExpense,
		paidSalariesTotal,
		totalBandwidthOps,
		incomeTxns,
		expenseTxns,
		bandwidthOpsTxns,
		baseTxns
	]);
	const displayedTxns = (0, import_react.useMemo)(() => {
		if (!Array.isArray(activeTxnList)) return [];
		return [...activeTxnList.filter((t) => {
			if (!t) return false;
			const desc = String(t.description || "").toLowerCase();
			const cat = String(t.category || "").toLowerCase();
			const note = String(t.note || "").toLowerCase();
			const q = String(searchQuery || "").toLowerCase().trim();
			const matchesSearch = !q || desc.includes(q) || cat.includes(q) || note.includes(q);
			const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
			return matchesSearch && matchesCategory;
		})].sort((a, b) => {
			const dateA = new Date(a.date).getTime() || 0;
			const dateB = new Date(b.date).getTime() || 0;
			if (dateA !== dateB) return dateA - dateB;
			const timeA = new Date(a.createdAt || 0).getTime() || 0;
			const timeB = new Date(b.createdAt || 0).getTime() || 0;
			if (timeA !== timeB) return timeA - timeB;
			return String(a.id || "").localeCompare(String(b.id || ""));
		});
	}, [
		activeTxnList,
		searchQuery,
		categoryFilter
	]);
	const txnsWithRunningBalance = (0, import_react.useMemo)(() => {
		let currentBalance = 0;
		return displayedTxns.map((txn, index) => {
			const amt = parseNumber(txn.amount);
			if (txn.type === "income") currentBalance += amt;
			else currentBalance -= amt;
			return {
				txn,
				serialNo: index + 1,
				runningBalance: currentBalance
			};
		});
	}, [displayedTxns]);
	const handleDeleteItem = async (id, e) => {
		e.stopPropagation();
		if (!onDeleteTransaction) return;
		setDeletingId(id);
		try {
			await onDeleteTransaction(id);
		} catch (err) {
			console.error("Delete error:", err);
		} finally {
			setDeletingId(null);
		}
	};
	const handleOpenInLedger = () => {
		onClose();
		if (onNavigateToLedger) onNavigateToLedger(targetLedgerFilter);
	};
	if (!isOpen || !type) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0",
								children: icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5 text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setTimeFilter("month"),
										className: `px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${timeFilter === "month" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
										children: "চলতি মাস"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setTimeFilter("all"),
										className: `px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${timeFilter === "all" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
										children: "সব রেকর্ড"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
								children: ["মোট: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-900 dark:text-slate-100",
									children: formatCurrency(mainAmount, currencySymbol)
								})]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleOpenInLedger,
								className: "px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer",
								title: "পূর্ণাঙ্গ খতিয়ান পেজে খুলুন",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "খতিয়ানে দেখুন"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "p-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
								title: "বন্ধ করুন",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-slate-100 dark:bg-slate-800/60 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"মোট ভিউ: ",
							displayedTxns.length,
							" টি এন্ট্রি"
						] }), timeFilter === "month" && displayedTxns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-amber-700 dark:text-amber-400 text-[11px]",
							children: "(চলতি মাসে কোনো ডাটা না থাকলে \"সব রেকর্ড\" চাপুন)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleOpenInLedger,
						className: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পূর্ণাঙ্গ লেনদেন খতিয়ান পেজ খুলুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-6 overflow-y-auto flex-1 space-y-6",
					children: [type === "staff_salary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-700 block text-[11px] font-medium",
											children: "পরিশোধিত বেতন:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-black mt-1",
											children: formatCurrency(paidSalariesTotal, currencySymbol)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-emerald-600 mt-0.5 block",
											children: [monthSalaries.filter((s) => s && s.paymentStatus === "paid").length, " জন কর্মীর বেতন দেওয়া হয়েছে"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-700 block text-[11px] font-medium",
											children: "বকেয়া বেতন:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-black mt-1",
											children: formatCurrency(pendingSalariesTotal, currencySymbol)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-amber-600 mt-0.5 block",
											children: [monthSalaries.filter((s) => s && s.paymentStatus === "pending").length, " জন কর্মীর বেতন বকেয়া রয়েছে"]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-600",
									children: "কর্মীদের বিস্তারিত প্রোফাইল বা বেতন প্রদান করতে পে-রোলে যান:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										onClose();
										if (onNavigateToStaff) onNavigateToStaff();
									},
									className: "px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টাফ পে-রোল খুলুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100",
								children: monthSalaries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-8 text-center text-slate-400 text-xs",
									children: "চলতি মাসে কোনো কর্মীর বেতন শিট তৈরি করা হয়নি।"
								}) : monthSalaries.map((sal, idx) => {
									if (!sal) return null;
									const bonus = Number(sal.bonusOrAllowance) || 0;
									const deduction = Number(sal.deductionOrAdvance) || 0;
									const keyId = sal.id ? String(sal.id) : `sal-${idx}`;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-slate-900 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sal.staffName || "কর্মী" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium",
												children: sal.staffDesignation || "স্টাফ"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["মূল বেতন: ", formatCurrency(sal.baseSalary, currencySymbol)] }),
												bonus > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-emerald-600 font-medium",
													children: ["+ বোনাস: ", formatCurrency(bonus, currencySymbol)]
												}),
												deduction > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-rose-600 font-medium",
													children: ["- কর্তন: ", formatCurrency(deduction, currencySymbol)]
												})
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-black text-slate-900 text-sm",
													children: formatCurrency(sal.netSalary, currencySymbol)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sal.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`,
													children: sal.paymentStatus === "paid" ? "✓ পরিশোধিত" : "⏳ বকেয়া"
												})]
											}), sal.paymentStatus === "paid" && onViewSalarySlip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onViewSalarySlip(sal),
												className: "p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer",
												title: "বেতন স্লিপ দেখুন",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
											})]
										})]
									}, keyId);
								})
							})
						]
					}), type !== "staff_salary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold text-slate-700 uppercase tracking-wider",
								children: [
									"নির্দিষ্ট লেনদেন তালিকা (",
									displayedTxns.length,
									" টি)"
								]
							}), categoryFilter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCategoryFilter("all"),
								className: "text-[11px] text-indigo-600 hover:underline font-medium cursor-pointer",
								children: "(ফিল্টার মুছুন)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "বিবরণ বা খাতে সার্চ করুন...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								className: "w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100",
						children: txnsWithRunningBalance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-slate-500 text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "কোনো লেনদেন পাওয়া যায়নি।" }), timeFilter === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTimeFilter("all"),
								className: "px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition cursor-pointer",
								children: "সব সময়ের রেকর্ড দেখুন"
							})]
						}) : txnsWithRunningBalance.map(({ txn, serialNo, runningBalance }) => {
							const keyId = txn.id ? String(txn.id) : `txn-${serialNo}`;
							const isIncome = txn.type === "income";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => {
									if (onSelectTransaction) onSelectTransaction(txn);
								},
								className: "p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-black text-[11px] flex items-center justify-center shrink-0",
										children: serialNo.toLocaleString("bn-BD")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors",
												children: txn.description || "লেনদেন"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium",
												children: txn.category || "সাধারণ"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[11px] text-slate-400 mt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: txn.date || "" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: txn.paymentMethod || "নগদ" }),
												txn.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate max-w-[180px]",
													children: txn.note
												})] })
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 shrink-0 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `font-bold text-sm ${isIncome ? "text-emerald-700" : "text-rose-700"}`,
										children: [isIncome ? "+" : "-", formatCurrency(txn.amount, currencySymbol)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] font-bold block ${runningBalance >= 0 ? "text-slate-500" : "text-rose-600"}`,
										children: ["ব্যালেন্স: ", formatCurrency(runningBalance, currencySymbol)]
									})] }), isAdminLoggedIn && onDeleteTransaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: deletingId === txn.id,
										onClick: (e) => handleDeleteItem(txn.id, e),
										className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 group-hover:opacity-100 cursor-pointer disabled:opacity-30",
										title: "মুছে ফেলুন",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
									})]
								})]
							}, keyId);
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleOpenInLedger,
						className: "px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "কোম্পানির পূর্ণাঙ্গ লেনদেন খতিয়ান খুলুন" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onClose,
						className: "px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ml-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বন্ধ করুন ও ফিরে যান" })]
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/portals/ayByay/components/ConfirmModal.tsx
var ConfirmModal = ({ isOpen, title = "নিশ্চিতকরণ", message, confirmText = "হ্যাঁ, নিশ্চিত", cancelText = "বাতিল", type = "danger", onConfirm, onCancel }) => {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick: onCancel,
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4",
					children: type === "danger" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onCancel,
						className: "flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer",
						children: cancelText
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onConfirm();
						},
						className: `flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs transition shadow-md cursor-pointer ${type === "danger" ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"}`,
						children: confirmText
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/portals/ayByay/components/CardDetailPage.tsx
var CardDetailPage = ({ type, transactions = [], salaries = [], staffList = [], selectedMonth = "", onMonthChange, onSelectTransaction, onDeleteTransaction, onNavigateToStaff, onNavigateToLedger, onViewSalarySlip, onOpenNewTransaction, config, isAdminLoggedIn = false }) => {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [timeFilter, setTimeFilter] = (0, import_react.useState)("month");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [deleteTargetId, setDeleteTargetId] = (0, import_react.useState)(null);
	const currencySymbol = (config === null || config === void 0 ? void 0 : config.currencySymbol) || "৳";
	const baseTxns = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		if (timeFilter === "all") return transactions.filter((t) => Boolean(t));
		return transactions.filter((t) => {
			if (!t || typeof t.date !== "string") return false;
			return getTransactionMonth(t.date) === selectedMonth;
		});
	}, [
		transactions,
		selectedMonth,
		timeFilter
	]);
	const incomeTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => isIncomeTransaction(t));
	}, [baseTxns]);
	const expenseTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => isExpenseTransaction(t));
	}, [baseTxns]);
	const totalIncome = (0, import_react.useMemo)(() => {
		return incomeTxns.reduce((acc, t) => acc + parseNumber(t === null || t === void 0 ? void 0 : t.amount), 0);
	}, [incomeTxns]);
	const totalExpense = (0, import_react.useMemo)(() => {
		return expenseTxns.reduce((acc, t) => acc + parseNumber(t === null || t === void 0 ? void 0 : t.amount), 0);
	}, [expenseTxns]);
	const bandwidthOpsCategories = [
		"ব্যান্ডউইথ/আপস্ট্রিম বিল",
		"বিদ্যুৎ বিল",
		"অফিস ভাড়া",
		"অপটিক্যাল ফাইবার ও কেবল",
		"ONU/OLT/Router ক্রয়",
		"স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ",
		"কেবল মেরামত ও রক্ষণাবেক্ষণ",
		"আপস্ট্রিম ব্যান্ডউইথ বিল (IIG/ITC/NTTN)",
		"ফাইবার অপটিক কেবল ও স্প্লিটার সামগ্রী",
		"রাউটার, ওএলটি (OLT) ও সুইচ যন্ত্রপাতি",
		"সার্ভার রুম ও পপ (POP) বিদ্যুৎ বিল",
		"সংযোগ মেরামত ও লাইন স্প্লাইসিং খরচ"
	];
	const bandwidthOpsTxns = (0, import_react.useMemo)(() => {
		return baseTxns.filter((t) => {
			if (!t || t.type !== "expense") return false;
			const cat = String(t.category || "");
			return bandwidthOpsCategories.includes(cat) || cat.includes("ব্যান্ডউইথ") || cat.includes("কেবল") || cat.includes("ফাইবার") || cat.includes("বিদ্যুৎ") || cat.includes("ONU");
		});
	}, [baseTxns]);
	const totalBandwidthOps = (0, import_react.useMemo)(() => {
		return bandwidthOpsTxns.reduce((acc, t) => acc + (Number(t === null || t === void 0 ? void 0 : t.amount) || 0), 0);
	}, [bandwidthOpsTxns]);
	const monthSalaries = (0, import_react.useMemo)(() => {
		if (!Array.isArray(salaries)) return [];
		if (timeFilter === "all") return salaries.filter((s) => Boolean(s));
		return salaries.filter((s) => s && String(s.month || "") === selectedMonth);
	}, [
		salaries,
		selectedMonth,
		timeFilter
	]);
	const paidSalariesTotal = (0, import_react.useMemo)(() => {
		return monthSalaries.filter((s) => s && s.paymentStatus === "paid").reduce((acc, s) => acc + (Number(s === null || s === void 0 ? void 0 : s.netSalary) || 0), 0);
	}, [monthSalaries]);
	const pendingSalariesTotal = (0, import_react.useMemo)(() => {
		return monthSalaries.filter((s) => s && s.paymentStatus === "pending").reduce((acc, s) => acc + (Number(s === null || s === void 0 ? void 0 : s.netSalary) || 0), 0);
	}, [monthSalaries]);
	const getCategoryBreakdown = (list, total) => {
		const map = {};
		(list || []).forEach((t) => {
			if (t) {
				const cat = String(t.category || "অন্যান্য");
				map[cat] = (map[cat] || 0) + (Number(t.amount) || 0);
			}
		});
		return Object.entries(map).map(([category, amount]) => ({
			category,
			amount,
			percentage: total > 0 ? Math.min(100, Math.round(amount / total * 100)) : 0
		})).sort((a, b) => b.amount - a.amount);
	};
	const { title, subtitle, mainAmount, headerBg, badgeColor, icon, activeTxnList, categoryList, targetLedgerFilter } = (0, import_react.useMemo)(() => {
		let t = "হিসাব ও আর্থিক বিবরণী";
		let sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth || "")} মাসের নির্দিষ্ট খতিয়ান` : "কোম্পানির সর্বমোট লেনদেন খতিয়ান";
		let amt = 0;
		let bg = "bg-gradient-to-r from-indigo-600 to-blue-700 text-white";
		let badge = "bg-indigo-500/20 text-indigo-100 border border-indigo-300/30";
		let ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6 text-white" });
		let list = [];
		let cats = [];
		let filter = "all";
		if (type === "income") {
			t = "ইন্টারনেট বিল ও মোট আয় বিবরণী";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের রাজস্ব ও আয়ের নির্দিষ্ট খতিয়ান` : "সর্বমোট গ্রাহক বিল ও আয়ের খতিয়ান";
			amt = totalIncome;
			bg = "bg-gradient-to-r from-emerald-600 to-teal-700 text-white";
			badge = "bg-emerald-500/20 text-emerald-100 border border-emerald-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-6 h-6 text-white" });
			list = incomeTxns;
			cats = getCategoryBreakdown(incomeTxns, totalIncome);
			filter = "income";
		} else if (type === "expense") {
			t = "কোম্পানি ব্যয় ও খরচ বিবরণী";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের আপস্ট্রিম, বেতন ও ব্যয়ের খতিয়ান` : "সর্বমোট অপারেশন ও কোম্পানি ব্যয়ের খতিয়ান";
			amt = totalExpense;
			bg = "bg-gradient-to-r from-rose-600 to-red-700 text-white";
			badge = "bg-rose-500/20 text-rose-100 border border-rose-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-6 h-6 text-white" });
			list = expenseTxns;
			cats = getCategoryBreakdown(expenseTxns, totalExpense);
			filter = "expense";
		} else if (type === "staff_salary") {
			t = "স্টাফ বেতন ও পে-রোল হিসাব সারাংশ";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের কর্মচারীদের বেতন ও পারিশ্রমিক তথ্য` : "সকল মাসের স্টাফ পে-রোল ও বেতন সারাংশ";
			amt = paidSalariesTotal;
			bg = "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";
			badge = "bg-blue-500/20 text-blue-100 border border-blue-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6 text-white" });
		} else if (type === "bandwidth_ops") {
			t = "আপস্ট্রিম ব্যান্ডউইথ ও নেটওয়ার্ক অপারেশন খরচ";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের IIG ব্যান্ডউইথ, ফাইবার ও বিদ্যুৎ খরচ` : "সর্বমোট নেটওয়ার্ক অবকাঠামো ও আপস্ট্রিম বিল";
			amt = totalBandwidthOps;
			bg = "bg-gradient-to-r from-cyan-600 to-blue-700 text-white";
			badge = "bg-cyan-500/20 text-cyan-100 border border-cyan-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "w-6 h-6 text-white" });
			list = bandwidthOpsTxns;
			cats = getCategoryBreakdown(bandwidthOpsTxns, totalBandwidthOps);
			filter = "expense";
		} else if (type === "net_profit") {
			const net = totalIncome - totalExpense;
			t = "চলতি নিট লাভ ও নগদ ব্যালেন্স স্টেটমেন্ট";
			sub = timeFilter === "month" ? `${getMonthBengaliName(selectedMonth)} মাসের আয় বনাম ব্যয়ের নিট উদ্বৃত্ত` : "সর্বমোট আয় বনাম মোট ব্যয়ের নিট ব্যালেন্স";
			amt = net;
			bg = "bg-gradient-to-r from-purple-600 to-violet-800 text-white";
			badge = "bg-purple-500/20 text-purple-100 border border-purple-300/30";
			ic = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6 text-white" });
			list = baseTxns;
			cats = getCategoryBreakdown(baseTxns, totalIncome + totalExpense);
			filter = "all";
		}
		return {
			title: t,
			subtitle: sub,
			mainAmount: amt,
			headerBg: bg,
			badgeColor: badge,
			icon: ic,
			activeTxnList: list,
			categoryList: cats,
			targetLedgerFilter: filter
		};
	}, [
		type,
		selectedMonth,
		timeFilter,
		totalIncome,
		totalExpense,
		paidSalariesTotal,
		totalBandwidthOps,
		incomeTxns,
		expenseTxns,
		bandwidthOpsTxns,
		baseTxns
	]);
	const displayedTxns = (0, import_react.useMemo)(() => {
		if (!Array.isArray(activeTxnList)) return [];
		return [...activeTxnList.filter((t) => {
			if (!t) return false;
			const desc = String(t.description || "").toLowerCase();
			const cat = String(t.category || "").toLowerCase();
			const note = String(t.note || "").toLowerCase();
			const q = String(searchQuery || "").toLowerCase().trim();
			const matchesSearch = !q || desc.includes(q) || cat.includes(q) || note.includes(q);
			const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
			return matchesSearch && matchesCategory;
		})].sort((a, b) => {
			const dateA = new Date(a.date).getTime() || 0;
			const dateB = new Date(b.date).getTime() || 0;
			if (dateA !== dateB) return dateA - dateB;
			const timeA = new Date(a.createdAt || 0).getTime() || 0;
			const timeB = new Date(b.createdAt || 0).getTime() || 0;
			if (timeA !== timeB) return timeA - timeB;
			return String(a.id || "").localeCompare(String(b.id || ""));
		});
	}, [
		activeTxnList,
		searchQuery,
		categoryFilter
	]);
	const txnsWithRunningBalance = (0, import_react.useMemo)(() => {
		let currentBalance = 0;
		return displayedTxns.map((txn, index) => {
			const amt = parseNumber(txn.amount);
			if (txn.type === "income") currentBalance += amt;
			else currentBalance -= amt;
			return {
				txn,
				serialNo: index + 1,
				runningBalance: currentBalance
			};
		});
	}, [displayedTxns]);
	const handleDeleteItem = async (id, e) => {
		e.stopPropagation();
		if (!onDeleteTransaction) return;
		setDeleteTargetId(id);
	};
	const handleOpenInLedger = () => {
		if (onNavigateToLedger) onNavigateToLedger(targetLedgerFilter);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-in fade-in duration-200 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0",
						children: icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTimeFilter("month"),
								className: `px-2.5 py-0.5 rounded-lg font-bold transition cursor-pointer ${timeFilter === "month" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
								children: "চলতি মাস"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTimeFilter("all"),
								className: `px-2.5 py-0.5 rounded-lg font-bold transition cursor-pointer ${timeFilter === "all" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
								children: "সব রেকর্ড"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: [
							subtitle,
							" • ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-slate-200",
								children: ["মোট পরিমাণ: ", formatCurrency(mainAmount, currencySymbol)]
							})
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleOpenInLedger,
					className: "px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 border border-slate-200/80 dark:border-slate-700",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পূর্ণাঙ্গ খতিয়ানে দেখুন" })]
				})]
			}),
			type === "staff_salary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-slate-900 dark:text-slate-100",
						children: [getMonthBengaliName(selectedMonth), " মাসের স্টাফ বেতন ও পে-রোল বিবরণী"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: [
							"পরিশোধিত মোট: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-emerald-600 dark:text-emerald-400",
								children: formatCurrency(paidSalariesTotal, currencySymbol)
							}),
							" | বকেয়া: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-rose-600 dark:text-rose-400",
								children: formatCurrency(pendingSalariesTotal, currencySymbol)
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onNavigateToStaff,
						className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টাফ বেতন ম্যানেজমেন্টে যান" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
					children: (staffList || []).map((staff) => {
						const salaryRec = monthSalaries.find((s) => s && s.staffId === staff.id);
						const isPaid = (salaryRec === null || salaryRec === void 0 ? void 0 : salaryRec.paymentStatus) === "paid";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-slate-900 dark:text-slate-100",
									children: staff.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] px-2 py-0.5 rounded-full font-semibold ${isPaid ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"}`,
									children: isPaid ? "পরিশোধিত ✓" : "বকেয়া"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
								children: [
									staff.designation,
									" • ",
									staff.phone
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: ["মূল বেতন: ", formatCurrency(staff.baseSalary, currencySymbol)]
								}), salaryRec && onViewSalarySlip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onViewSalarySlip(salaryRec),
									className: "text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্লিপ" })]
								})]
							})]
						}, staff.id);
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"লেনদেন তালিকা (",
							displayedTxns.length,
							" টি)"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [
							isAdminLoggedIn && onOpenNewTransaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onOpenNewTransaction(type === "income" ? "income" : "expense"),
								className: "px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-xs",
								children: "+ নতুন এন্ট্রি"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "খুঁজুন...",
									className: "pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 w-36 sm:w-44"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: categoryFilter,
								onChange: (e) => setCategoryFilter(e.target.value),
								className: "px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
									children: "সকল ক্যাটাগরি"
								}), categoryList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.category,
									className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
									children: c.category
								}, c.category))]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800",
					children: txnsWithRunningBalance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "কোনো লেনদেন পাওয়া যায়নি।" }), timeFilter === "month" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTimeFilter("all"),
							className: "px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition cursor-pointer",
							children: "সব সময়ের রেকর্ড দেখুন"
						})]
					}) : txnsWithRunningBalance.map(({ txn, serialNo, runningBalance }) => {
						const isIncome = txn.type === "income";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => onSelectTransaction && onSelectTransaction(txn),
							className: "p-3.5 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition flex items-center justify-between gap-3 cursor-pointer group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[11px] flex items-center justify-center shrink-0",
										children: serialNo.toLocaleString("bn-BD")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"}`,
										children: isIncome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition",
											children: txn.description || txn.category
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5",
											children: [
												txn.category,
												" • ",
												txn.date,
												" ",
												txn.note ? `• ${txn.note}` : ""
											]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 shrink-0 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-xs sm:text-sm font-black block ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
									children: [isIncome ? "+" : "-", formatCurrency(txn.amount, currencySymbol)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-[10px] font-bold block ${runningBalance >= 0 ? "text-slate-500 dark:text-slate-400" : "text-rose-500 dark:text-rose-400"}`,
									children: ["ব্যালেন্স: ", formatCurrency(runningBalance, currencySymbol)]
								})] }), isAdminLoggedIn && onDeleteTransaction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: (e) => handleDeleteItem(txn.id, e),
									disabled: deletingId === txn.id,
									className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100 cursor-pointer",
									title: "মুছে ফেলুন",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})]
							})]
						}, txn.id || serialNo);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: !!deleteTargetId,
				title: "এন্ট্রি ডিলিট নিশ্চিতকরণ",
				message: "আপনি কি নিশ্চিতভাবে এই লেনদেনটি স্থায়ীভাবে মুছে ফেলতে চান?",
				confirmText: "হ্যাঁ, ডিলিট করুন",
				cancelText: "বাতিল",
				type: "danger",
				onConfirm: async () => {
					if (deleteTargetId && onDeleteTransaction) {
						const id = deleteTargetId;
						setDeleteTargetId(null);
						setDeletingId(id);
						try {
							await onDeleteTransaction(id);
						} catch (err) {
							console.error("Delete error:", err);
						} finally {
							setDeletingId(null);
						}
					}
				},
				onCancel: () => setDeleteTargetId(null)
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/StaffSalaryManager.tsx
var StaffSalaryManager = ({ staffList, salaries, selectedMonth, onMonthChange, onAddStaff, onUpdateStaff, onDeleteStaff, onDisburseSalary, onDeleteSalary, onViewSalarySlip, config, onBackToDashboard, isAdminLoggedIn = false, onRequireLogin, staffAccounts = [], onSaveStaffAccounts, quickHisabOwners = [] }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)("payroll");
	const [payrollFilter, setPayrollFilter] = (0, import_react.useState)("all");
	const [selectedStaffDetail, setSelectedStaffDetail] = (0, import_react.useState)(null);
	const [confirmState, setConfirmState] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: () => {}
	});
	const [isStaffModalOpen, setIsStaffModalOpen] = (0, import_react.useState)(false);
	const [editingStaff, setEditingStaff] = (0, import_react.useState)(null);
	const [staffFormData, setStaffFormData] = (0, import_react.useState)({
		name: "",
		designation: STAFF_DESIGNATIONS[0],
		phone: "",
		joinDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		baseSalary: "",
		status: "active",
		notes: ""
	});
	const [isPayModalOpen, setIsPayModalOpen] = (0, import_react.useState)(false);
	const [selectedStaffForPay, setSelectedStaffForPay] = (0, import_react.useState)(null);
	const [payFormData, setPayFormData] = (0, import_react.useState)({
		baseSalary: "",
		bonusOrAllowance: "",
		deductionOrAdvance: "",
		paymentDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		paymentMethod: "নগদ (Cash)",
		voucherNumber: "",
		note: ""
	});
	const currentMonthSalaries = salaries.filter((s) => s.month === selectedMonth);
	const salaryMap = /* @__PURE__ */ new Map();
	currentMonthSalaries.forEach((s) => salaryMap.set(s.staffId, s));
	const getMatchedStaffAccount = (staff) => {
		if (!staff || !staffAccounts || staffAccounts.length === 0) return void 0;
		if (staff.id) {
			const byId = staffAccounts.find((a) => a.id === staff.id);
			if (byId) return byId;
		}
		const clean = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");
		const cleanPhone = (p) => (p || "").replace(/[^0-9]/g, "");
		const sPhone = cleanPhone(staff.phone);
		const sName = clean(staff.name);
		if (sPhone && sPhone.length >= 10) {
			const byPhone = staffAccounts.find((a) => cleanPhone(a.phone) === sPhone);
			if (byPhone) return byPhone;
		}
		const byExactName = staffAccounts.find((a) => clean(a.name) === sName);
		if (byExactName) return byExactName;
		return staffAccounts.find((a) => {
			const aName = clean(a.name);
			return aName.includes(sName) || sName.includes(aName);
		});
	};
	const getStaffCompanyDue = (staff) => {
		const acc = getMatchedStaffAccount(staff);
		if (acc && (acc.remainingDue || 0) > 0) return acc.remainingDue;
		return 0;
	};
	const unifiedStaff = import_react.useMemo(() => {
		const list = [];
		const seenIds = /* @__PURE__ */ new Set();
		const seenPhones = /* @__PURE__ */ new Set();
		const cleanPhone = (p) => (p || "").replace(/[^0-9]/g, "");
		(staffList || []).forEach((s) => {
			if (s && s.id && !seenIds.has(s.id)) {
				list.push(s);
				seenIds.add(s.id);
				const p = cleanPhone(s.phone);
				if (p.length >= 10) seenPhones.add(p);
			}
		});
		(staffAccounts || []).forEach((acc) => {
			if (!acc || !acc.id || !isActualStaffAccount(acc)) return;
			const p = cleanPhone(acc.phone);
			if (seenIds.has(acc.id) || p.length >= 10 && seenPhones.has(p)) {
				const idx = list.findIndex((s) => s.id === acc.id || p.length >= 10 && cleanPhone(s.phone) === p);
				if (idx !== -1) list[idx] = {
					...list[idx],
					designation: list[idx].designation || acc.role || "লাইন টেকনিশিয়ান",
					baseSalary: list[idx].baseSalary || acc.baseSalary || 15e3,
					phone: list[idx].phone || acc.phone
				};
				return;
			}
			seenIds.add(acc.id);
			if (p.length >= 10) seenPhones.add(p);
			list.push({
				id: acc.id,
				name: acc.name,
				designation: acc.role || "লাইন টেকনিশিয়ান",
				phone: acc.phone,
				joinDate: acc.createdAt ? new Date(acc.createdAt).toISOString().split("T")[0] : "2026-01-01",
				baseSalary: acc.baseSalary || 15e3,
				status: acc.isActive !== false ? "active" : "inactive",
				notes: "",
				createdAt: acc.createdAt || (/* @__PURE__ */ new Date()).toISOString()
			});
		});
		return list;
	}, [staffList, staffAccounts]);
	const activeStaff = unifiedStaff.filter((s) => s.status === "active");
	const totalBasePay = activeStaff.reduce((acc, s) => acc + s.baseSalary, 0);
	const totalStaffCompanyDues = activeStaff.reduce((acc, s) => acc + getStaffCompanyDue(s), 0);
	let paidTotal = 0;
	let paidCount = 0;
	let pendingCount = 0;
	activeStaff.forEach((stf) => {
		const sal = salaryMap.get(stf.id);
		if (sal && sal.paymentStatus === "paid") {
			paidTotal += sal.netSalary;
			paidCount++;
		} else pendingCount++;
	});
	const pendingTotal = activeStaff.reduce((acc, stf) => {
		const sal = salaryMap.get(stf.id);
		if (sal && sal.paymentStatus === "paid") return acc;
		if (sal) return acc + sal.netSalary;
		const due = getStaffCompanyDue(stf);
		return acc + Math.max(0, stf.baseSalary - due);
	}, 0);
	const handleOpenAddStaff = () => {
		setEditingStaff(null);
		setStaffFormData({
			name: "",
			designation: STAFF_DESIGNATIONS[0],
			phone: "",
			joinDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			baseSalary: "",
			status: "active",
			notes: ""
		});
		setIsStaffModalOpen(true);
	};
	const handleOpenEditStaff = (stf) => {
		setEditingStaff(stf);
		setStaffFormData({
			name: stf.name,
			designation: stf.designation,
			phone: stf.phone,
			joinDate: stf.joinDate,
			baseSalary: stf.baseSalary,
			status: stf.status,
			notes: stf.notes || ""
		});
		setIsStaffModalOpen(true);
	};
	const handleStaffFormSubmit = async (e) => {
		e.preventDefault();
		if (!staffFormData.name.trim() || !staffFormData.phone.trim()) {
			showToast("অনুগ্রহ করে নাম এবং মোবাইল নম্বর দিন", "warning");
			return;
		}
		const payload = {
			...staffFormData,
			baseSalary: Number(staffFormData.baseSalary) || 0
		};
		if (editingStaff) await onUpdateStaff(editingStaff.id, payload);
		else await onAddStaff(payload);
		setIsStaffModalOpen(false);
	};
	const handleOpenPayModal = (staff) => {
		const existing = salaryMap.get(staff.id);
		const companyDue = getStaffCompanyDue(staff);
		setSelectedStaffForPay(staff);
		const defaultDeduction = existing && existing.deductionOrAdvance !== void 0 && existing.deductionOrAdvance !== null ? existing.deductionOrAdvance || "" : companyDue > 0 ? companyDue : "";
		const defaultNote = (existing === null || existing === void 0 ? void 0 : existing.note) || (companyDue > 0 ? `${getMonthBengaliName(selectedMonth)} মাসের বেতন (কোম্পানি পাওনা কর্তন: ৳${companyDue})` : `${getMonthBengaliName(selectedMonth)} মাসের বেতন`);
		setPayFormData({
			baseSalary: existing ? existing.baseSalary : staff.baseSalary || "",
			bonusOrAllowance: existing && existing.bonusOrAllowance ? existing.bonusOrAllowance : "",
			deductionOrAdvance: defaultDeduction,
			paymentDate: (existing === null || existing === void 0 ? void 0 : existing.paymentDate) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			paymentMethod: (existing === null || existing === void 0 ? void 0 : existing.paymentMethod) || "নগদ (Cash)",
			voucherNumber: (existing === null || existing === void 0 ? void 0 : existing.voucherNumber) || `VCH-SAL-${Date.now().toString().slice(-4)}`,
			note: defaultNote
		});
		setIsPayModalOpen(true);
	};
	const handlePaySalarySubmit = async (e) => {
		e.preventDefault();
		if (!selectedStaffForPay) return;
		const deductionAmount = Number(payFormData.deductionOrAdvance) || 0;
		const baseSalaryNum = Number(payFormData.baseSalary) || 0;
		const bonusNum = Number(payFormData.bonusOrAllowance) || 0;
		if (await onDisburseSalary({
			staffId: selectedStaffForPay.id,
			month: selectedMonth,
			baseSalary: baseSalaryNum,
			bonusOrAllowance: bonusNum,
			deductionOrAdvance: deductionAmount,
			paymentStatus: "paid",
			paymentDate: payFormData.paymentDate,
			paymentMethod: payFormData.paymentMethod,
			voucherNumber: payFormData.voucherNumber,
			note: payFormData.note
		})) setIsPayModalOpen(false);
	};
	const handleMarkPending = async (staff) => {
		const existing = salaryMap.get(staff.id);
		if (!existing) return;
		setConfirmState({
			isOpen: true,
			title: "বেতন বকেয়া চিহ্নিতকরণ",
			message: `আপনি কি ${staff.name} এর বেতন বকেয়া হিসেবে চিহ্নিত করতে চান? (কোম্পানি খরচের খতিয়ান থেকে লেনদেন মুছে যাবে)`,
			onConfirm: async () => {
				setConfirmState((prev) => ({
					...prev,
					isOpen: false
				}));
				await onDeleteSalary(existing.id);
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-6 h-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight",
							children: "স্টাফ ও কর্মচারীদের বেতন হিসাব (Payroll)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
							children: "ইন্টারনেট কোম্পানির ইঞ্জিনিয়ার, টেকনিশিয়ান ও কর্মচারীদের মাসিক বেতন ও পে-স্লিপ"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন মাস:" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "month",
									value: selectedMonth,
									onChange: (e) => onMonthChange(e.target.value),
									className: "bg-transparent font-bold text-slate-900 dark:text-slate-100 border-none outline-hidden cursor-pointer"
								})
							]
						}), isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleOpenAddStaff,
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন কর্মী যোগ" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("payroll"),
						className: `px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "payroll" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: [
							"💼 মাসিক পে-রোল ও বেতন শিট (",
							getMonthBengaliName(selectedMonth),
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("directory"),
						className: `px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "directory" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: [
							"👥 কর্মচারীদের তালিকা (",
							unifiedStaff.length,
							" জন)"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("directory");
							setPayrollFilter("all");
						},
						className: `text-left p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md active:scale-98 cursor-pointer ${activeTab === "directory" ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block",
									children: "মোট কর্মী"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-indigo-500 dark:text-indigo-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-black text-slate-800 dark:text-slate-100 mt-1",
								children: [activeStaff.length, " জন"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 block",
								children: "তালিকা দেখতে ক্লিক করুন →"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("payroll");
							setPayrollFilter("all");
						},
						className: `text-left p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md active:scale-98 cursor-pointer ${activeTab === "payroll" && payrollFilter === "all" ? "bg-slate-100/90 dark:bg-slate-800 border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block",
									children: "নির্ধারিত মূল বেতন"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-slate-600 dark:text-slate-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-slate-800 dark:text-slate-100 mt-1",
								children: formatCurrency(totalBasePay, config.currencySymbol)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block",
								children: [
									"সব কর্মী দেখুন (",
									activeStaff.length,
									" জন) →"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("payroll");
							setPayrollFilter("paid");
						},
						className: `text-left p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md active:scale-98 cursor-pointer ${activeTab === "payroll" && payrollFilter === "paid" ? "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30" : "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/80 hover:border-emerald-300"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block",
									children: "পরিশোধিত বেতন"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1",
								children: formatCurrency(paidTotal, config.currencySymbol)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5 block",
								children: [paidCount, " জন পরিশোধিত (ফিল্টার) →"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setActiveTab("payroll");
							setPayrollFilter("pending");
						},
						className: `text-left p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md active:scale-98 cursor-pointer ${activeTab === "payroll" && payrollFilter === "pending" ? "bg-amber-100 dark:bg-amber-950/80 border-amber-400 dark:border-amber-600 ring-2 ring-amber-500/30" : "bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/80 hover:border-amber-300"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider block",
									children: "বকেয়া বেতন"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-amber-600 dark:text-amber-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-amber-800 dark:text-amber-300 mt-1",
								children: formatCurrency(pendingTotal, config.currencySymbol)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5 block",
								children: [pendingCount, " জন বকেয়া (ফিল্টার) →"]
							})
						]
					})
				]
			}),
			activeTab === "payroll" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-slate-900",
							children: [getMonthBengaliName(selectedMonth), " মাসের বেতন হিসাব খতিয়ান"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "বেতন পরিশোধ করলে স্বয়ংক্রিয়ভাবে কোম্পানির খরচের খতিয়ান ও ব্যাকআপে রেকর্ড যোগ হয়"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPayrollFilter("all"),
									className: `px-2.5 py-1 rounded-lg text-xs font-bold transition ${payrollFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [
										"সব কর্মী (",
										activeStaff.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPayrollFilter("paid"),
									className: `px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${payrollFilter === "paid" ? "bg-emerald-600 text-white shadow-2xs" : "text-emerald-700 hover:bg-emerald-50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"পরিশোধিত (",
										paidCount,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPayrollFilter("pending"),
									className: `px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${payrollFilter === "pending" ? "bg-amber-600 text-white shadow-2xs" : "text-amber-700 hover:bg-amber-50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"বকেয়া (",
										pendingCount,
										")"
									] })]
								})
							]
						})]
					}),
					totalStaffCompanyDues > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-4 sm:mx-5 my-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start sm:items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-600" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold text-amber-950 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টাফ কালেকশন ও কোম্পানি পাওনা কর্তন সমন্বয় সক্রিয়" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black",
									children: "স্বয়ংক্রিয় কর্তন"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-amber-800/90 mt-0.5 leading-relaxed",
								children: [
									"মালিক বা কর্মীদের কাছে কোম্পানির সর্বমোট ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["৳", totalStaffCompanyDues.toLocaleString("bn-BD")] }),
									" পাওনা রয়েছে। বেতন তৈরি ও পরিশোধের সময় এই অর্থ স্বয়ংক্রিয়ভাবে কর্তন করে নিট প্রদেয় নির্ধারণ হচ্ছে এবং কালেকশন খাতা থেকে সমন্বয় হবে।"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-amber-700 block font-semibold",
								children: "মোট বকেয়া পাওনা"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-3 py-1 rounded-xl bg-amber-200 text-amber-950 font-black text-xs inline-block",
								children: ["৳", totalStaffCompanyDues.toLocaleString("bn-BD")]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "কর্মীর নাম ও পদবি"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "মূল বেতন"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "ভাতা/ওভারটাইম (+)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "অগ্রিম/কর্তন (-)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3 font-extrabold text-slate-800",
										children: "মোট নিট প্রদেয়"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "স্ট্যাটাস"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3 text-right",
										children: "পদক্ষেপ"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100",
								children: activeStaff.filter((staff) => {
									const sal = salaryMap.get(staff.id);
									const isPaid = sal && sal.paymentStatus === "paid";
									if (payrollFilter === "paid") return isPaid;
									if (payrollFilter === "pending") return !isPaid;
									return true;
								}).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "p-8 text-center text-slate-400",
									children: payrollFilter === "paid" ? "এই মাসে এখনো কোনো কর্মীর বেতন পরিশোধ করা হয়নি" : payrollFilter === "pending" ? "কোনো কর্মীর বেতন বকেয়া নেই (সবাই পরিশোধিত)" : "কোনো সক্রিয় কর্মচারী পাওয়া যায়নি। উপরে \"নতুন কর্মী যোগ\" বাটনে ক্লিক করুন।"
								}) }) : activeStaff.filter((staff) => {
									const sal = salaryMap.get(staff.id);
									const isPaid = sal && sal.paymentStatus === "paid";
									if (payrollFilter === "paid") return isPaid;
									if (payrollFilter === "pending") return !isPaid;
									return true;
								}).map((staff) => {
									const sal = salaryMap.get(staff.id);
									const isPaid = sal && sal.paymentStatus === "paid";
									const companyDue = getStaffCompanyDue(staff);
									const base = sal ? sal.baseSalary : staff.baseSalary;
									const bonus = sal ? sal.bonusOrAllowance : 0;
									const deduction = sal ? sal.deductionOrAdvance : companyDue > 0 ? companyDue : 0;
									const net = sal ? sal.netSalary : Math.max(0, base + bonus - deduction);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-slate-50/80 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-slate-900 text-sm",
														children: staff.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-slate-500 flex items-center gap-2 mt-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-semibold",
															children: staff.designation
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px]",
															children: staff.phone
														})]
													}),
													companyDue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																"কোম্পানি পাওনা: ৳",
																companyDue.toLocaleString("bn-BD"),
																" (বেতন থেকে কর্তনযোগ্য)"
															] })]
														})
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3.5 font-semibold text-slate-800",
												children: formatCurrency(base, config.currencySymbol)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3.5 text-emerald-600 font-medium",
												children: bonus > 0 ? `+${formatCurrency(bonus, config.currencySymbol)}` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3.5 text-rose-600 font-medium",
												children: sal ? sal.deductionOrAdvance > 0 ? `-${formatCurrency(sal.deductionOrAdvance, config.currencySymbol)}` : "—" : companyDue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-amber-700 font-bold block",
													children: [
														"-",
														formatCurrency(companyDue, config.currencySymbol),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[9px] text-amber-600 block",
															children: "(পাওনা কর্তন)"
														})
													]
												}) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-3.5 font-black text-sm text-slate-900",
												children: [formatCurrency(net, config.currencySymbol), !sal && companyDue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] text-amber-700 font-bold block",
													children: "(পাওনা কর্তন শেষে)"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-3.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isPaid ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`,
													children: isPaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পরিশোধিত" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বকেয়া" })] })
												}), isPaid && (sal === null || sal === void 0 ? void 0 : sal.paymentDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 mt-0.5",
													children: [
														sal.paymentDate,
														" • ",
														sal.paymentMethod || "নগদ"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3.5 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "inline-flex items-center gap-1.5",
													children: isPaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => onViewSalarySlip(sal),
														className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors",
														title: "বেতন স্লিপ প্রিন্ট করুন",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "রসিদ" })]
													}), isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => handleMarkPending(staff),
														className: "px-2 py-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors",
														title: "রোলব্যাক / বাতিল করুন",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
													})] }) : isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => handleOpenPayModal(staff),
														className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন প্রদান" })]
													})
												})
											})
										]
									}, staff.id);
								})
							})]
						})
					})
				]
			}),
			activeTab === "directory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-slate-900",
						children: "ইন্টারনেট কোম্পানির সকল কর্মচারীদের ডাটাবেজ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mt-0.5",
						children: "নেটওয়ার্ক ইঞ্জিনিয়ার, লাইন টেকনিশিয়ান ও বিল কালেকশন কর্মীদের তালিকা"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleOpenAddStaff,
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন কর্মী যোগ" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-5",
					children: unifiedStaff.map((staff) => {
						const currentSal = salaryMap.get(staff.id);
						const isPaid = currentSal && currentSal.paymentStatus === "paid";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setSelectedStaffDetail(staff),
							className: "p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between gap-3 cursor-pointer group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors",
										children: staff.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity",
										children: "বিস্তারিত তথ্য →"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200",
									children: staff.designation
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${staff.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`,
									children: staff.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "মোবাইল নম্বর:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-800",
										children: staff.phone
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "মূল মাসিক বেতন:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900",
										children: formatCurrency(staff.baseSalary, config.currencySymbol)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "যোগদানের তারিখ:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: staff.joinDate })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 block text-[10px]",
										children: [
											"চলতি মাস (",
											getMonthBengaliName(selectedMonth),
											"):"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`,
										children: isPaid ? "✓ পরিশোধিত" : "⏳ বকেয়া"
									})] }),
									staff.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-span-2 text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 mt-1",
										children: staff.notes
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 pt-2 border-t border-slate-200",
								onClick: (e) => e.stopPropagation(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedStaffDetail(staff),
									className: "inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বিস্তারিত তথ্য দেখুন" })
								}), isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleOpenEditStaff(staff),
										className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডিট" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setConfirmState({
												isOpen: true,
												title: "স্টাফ মুছে ফেলার নিশ্চিতকরণ",
												message: `আপনি কি নিশ্চিতভাবে ${staff.name} কে মুছে ফেলতে চান?`,
												onConfirm: async () => {
													setConfirmState((prev) => ({
														...prev,
														isOpen: false
													}));
													await onDeleteStaff(staff.id);
												}
											});
										},
										className: "p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors",
										title: "মুছুন",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})]
							})]
						}, staff.id);
					})
				})]
			}),
			isStaffModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setIsStaffModalOpen(false),
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "bg-white rounded-3xl shadow-2xl max-w-md w-full my-auto overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-5 bg-slate-50 border-b border-slate-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-900 text-base",
							children: editingStaff ? "কর্মীর তথ্য এডিট করুন" : "নতুন কর্মচারী যোগ করুন"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsStaffModalOpen(false),
							className: "p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleStaffFormSubmit,
						className: "p-5 space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 block mb-1",
								children: "কর্মীর নাম *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "যেমন: তানভীর আহমেদ",
								value: staffFormData.name,
								onChange: (e) => setStaffFormData({
									...staffFormData,
									name: e.target.value
								}),
								className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 block mb-1",
								children: "পদবি (Designation) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: staffFormData.designation,
								onChange: (e) => setStaffFormData({
									...staffFormData,
									designation: e.target.value
								}),
								className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
								children: STAFF_DESIGNATIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d,
									children: d
								}, d))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "মোবাইল নম্বর *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									required: true,
									placeholder: "017XX-XXXXXX",
									value: staffFormData.phone,
									onChange: (e) => setStaffFormData({
										...staffFormData,
										phone: e.target.value
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "মূল মাসিক বেতন (৳) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									required: true,
									min: 0,
									step: "any",
									placeholder: "যেমন: ১৫০০০",
									value: staffFormData.baseSalary === 0 ? "" : staffFormData.baseSalary,
									onChange: (e) => setStaffFormData({
										...staffFormData,
										baseSalary: e.target.value === "" ? "" : Number(e.target.value)
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "যোগদানের তারিখ"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: staffFormData.joinDate,
									onChange: (e) => setStaffFormData({
										...staffFormData,
										joinDate: e.target.value
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "কর্মীর অবস্থা"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: staffFormData.status,
									onChange: (e) => setStaffFormData({
										...staffFormData,
										status: e.target.value
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "সক্রিয় (Active)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "inactive",
										children: "নিষ্ক্রিয় (Inactive)"
									})]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 block mb-1",
								children: "কাজের বিবরণ / নোট (ঐচ্ছিক)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								placeholder: "যেমন: লাইন মেইনটেন্যান্স ও স্প্লাইসিং এর দায়িত্বে",
								value: staffFormData.notes,
								onChange: (e) => setStaffFormData({
									...staffFormData,
									notes: e.target.value
								}),
								className: "w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3 border-t border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsStaffModalOpen(false),
									className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold",
									children: "বাতিল"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs",
									children: editingStaff ? "আপডেট করুন" : "সংরক্ষণ করুন"
								})]
							})
						]
					})]
				})
			}),
			isPayModalOpen && selectedStaffForPay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setIsPayModalOpen(false),
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "bg-white rounded-3xl shadow-2xl max-w-md sm:max-w-lg w-full my-auto max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-emerald-100 uppercase font-semibold tracking-wider",
									children: "বেতন পরিশোধ ফরম"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-lg text-white mt-0.5",
									children: selectedStaffForPay.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-emerald-100",
									children: [
										selectedStaffForPay.designation,
										" • ",
										getMonthBengaliName(selectedMonth)
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsPayModalOpen(false),
								className: "p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handlePaySalarySubmit,
						className: "p-5 space-y-4 text-xs overflow-y-auto",
						children: [
							(() => {
								const companyDue = getStaffCompanyDue(selectedStaffForPay);
								if (companyDue <= 0) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl flex items-center justify-between gap-2 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-600" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-bold text-amber-950 dark:text-amber-200",
											children: ["কোম্পানি পাওনা: ৳", companyDue.toLocaleString("bn-BD")]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-amber-800 dark:text-amber-300 mt-0.5",
											children: "বেতন থেকে কর্তন করলে কালেকশন খাতা থেকে স্বয়ংক্রিয়ভাবে সমন্বয় হবে"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setPayFormData((prev) => ({
												...prev,
												deductionOrAdvance: companyDue,
												note: `${getMonthBengaliName(selectedMonth)} মাসের বেতন (কোম্পানি পাওনা কর্তন: ৳${companyDue})`
											}));
										},
										className: "px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 cursor-pointer shadow-2xs transition-colors",
										children: "পাওনা কর্তন করুন"
									})]
								});
							})(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-slate-600",
											children: "মূল বেতন (Base Salary):"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											required: true,
											value: payFormData.baseSalary,
											onChange: (e) => setPayFormData({
												...payFormData,
												baseSalary: e.target.value
											}),
											className: "w-32 text-right font-bold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
											placeholder: "0"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-emerald-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "(+) ভাতা / বোনাস / ওভারটাইম:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											value: payFormData.bonusOrAllowance,
											onChange: (e) => setPayFormData({
												...payFormData,
												bonusOrAllowance: e.target.value
											}),
											className: "w-32 text-right font-bold px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
											placeholder: "0"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-rose-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "(-) অগ্রিম / কোম্পানি পাওনা কর্তন:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											value: payFormData.deductionOrAdvance,
											onChange: (e) => setPayFormData({
												...payFormData,
												deductionOrAdvance: e.target.value
											}),
											className: "w-32 text-right font-bold px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-xs text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20",
											placeholder: "0"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm text-slate-900",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সর্বমোট প্রদেয় নিট বেতন:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-700 text-base",
											children: formatCurrency(Math.max(0, (Number(payFormData.baseSalary) || 0) + (Number(payFormData.bonusOrAllowance) || 0) - (Number(payFormData.deductionOrAdvance) || 0)), config.currencySymbol)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "পরিশোধের তারিখ *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									required: true,
									value: payFormData.paymentDate,
									onChange: (e) => setPayFormData({
										...payFormData,
										paymentDate: e.target.value
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-slate-700 block mb-1",
									children: "পরিশোধের মাধ্যম *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: payFormData.paymentMethod,
									onChange: (e) => setPayFormData({
										...payFormData,
										paymentMethod: e.target.value
									}),
									className: "w-full px-3 py-2 rounded-xl border border-slate-300",
									children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m,
										children: m
									}, m))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 block mb-1",
								children: "ভাউচার নম্বর"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "VCH-SAL-0901",
								value: payFormData.voucherNumber,
								onChange: (e) => setPayFormData({
									...payFormData,
									voucherNumber: e.target.value
								}),
								className: "w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-bold text-slate-700 block mb-1",
								children: "মন্তব্য (নোট)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "যেমন: সেপ্টেম্বর মাসের বেতন ও নাইট শিফট ভাতা",
								value: payFormData.note,
								onChange: (e) => setPayFormData({
									...payFormData,
									note: e.target.value
								}),
								className: "w-full px-3 py-2 rounded-xl border border-slate-300"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-indigo-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"বেতন পরিশোধ বাটন চাপলে এটি সরাসরি কোম্পানির খরচের খতিয়ানে ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "'স্টাফ বেতন ও টেকনিশিয়ান ভাতা'" }),
									" ক্যাটাগরিতে স্বয়ংক্রিয়ভাবে যুক্ত হবে।"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3 border-t border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsPayModalOpen(false),
									className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold",
									children: "বাতিল"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন নিশ্চিত ও পরিশোধ করুন" })]
								})]
							})
						]
					})]
				})
			}),
			selectedStaffDetail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setSelectedStaffDetail(null),
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: (e) => e.stopPropagation(),
					className: "bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] my-auto flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 bg-gradient-to-r from-indigo-600 to-blue-700 text-white flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl text-white",
									children: selectedStaffDetail.name.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-lg text-white",
									children: selectedStaffDetail.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold",
										children: selectedStaffDetail.designation
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedStaffDetail.status === "active" ? "bg-emerald-400 text-emerald-950" : "bg-slate-300 text-slate-800"}`,
										children: selectedStaffDetail.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"
									})]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedStaffDetail(null),
								className: "p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 overflow-y-auto space-y-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "মোবাইল নম্বর:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${selectedStaffDetail.phone}`,
										className: "font-bold text-indigo-600 hover:underline text-sm",
										children: selectedStaffDetail.phone
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "মূল মাসিক বেতন:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-slate-900 text-sm",
										children: formatCurrency(selectedStaffDetail.baseSalary, config.currencySymbol)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 block text-[10px]",
										children: "যোগদানের তারিখ:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-700",
										children: selectedStaffDetail.joinDate
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-slate-400 block text-[10px]",
										children: [
											"চলতি মাস (",
											getMonthBengaliName(selectedMonth),
											"):"
										]
									}), (() => {
										const currentSal = salaryMap.get(selectedStaffDetail.id);
										const isPaid = currentSal && currentSal.paymentStatus === "paid";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`,
											children: isPaid ? "✓ পরিশোধিত" : "⏳ বকেয়া"
										});
									})()] }),
									selectedStaffDetail.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2 pt-2 border-t border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[10px]",
											children: "মন্তব্য / ঠিকানা:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-700",
											children: selectedStaffDetail.notes
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5 text-indigo-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"বেতন প্রদানের ইতিহাস (",
									salaries.filter((s) => s.staffId === selectedStaffDetail.id).length,
									" টি রেকর্ড)"
								] })]
							}), salaries.filter((s) => s.staffId === selectedStaffDetail.id).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-400",
								children: "এখনও কোনো বেতন প্রদানের রেকর্ড পাওয়া যায়নি।"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 max-h-48 overflow-y-auto",
								children: salaries.filter((s) => s.staffId === selectedStaffDetail.id).map((sal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-bold text-slate-900 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getMonthBengaliName(sal.month) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold",
											children: sal.paymentStatus === "paid" ? "পরিশোধিত" : "বকেয়া"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-0.5",
										children: [
											"তারিখ: ",
											sal.paymentDate || "—",
											" • মাধ্যম: ",
											sal.paymentMethod || "নগদ"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-slate-900 text-sm",
											children: formatCurrency(sal.netSalary, config.currencySymbol)
										}), sal.paymentStatus === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setSelectedStaffDetail(null);
												onViewSalarySlip(sal);
											},
											className: "p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
											title: "বেতন স্লিপ দেখুন",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" })
										})]
									})]
								}, sal.id))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										const stf = selectedStaffDetail;
										setSelectedStaffDetail(null);
										handleOpenEditStaff(stf);
									},
									className: "px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডিট" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										const stf = selectedStaffDetail;
										setConfirmState({
											isOpen: true,
											title: "স্টাফ মুছে ফেলার নিশ্চিতকরণ",
											message: `আপনি কি নিশ্চিতভাবে ${stf.name} কে মুছে ফেলতে চান?`,
											onConfirm: async () => {
												setConfirmState((prev) => ({
													...prev,
													isOpen: false
												}));
												setSelectedStaffDetail(null);
												await onDeleteStaff(stf.id);
											}
										});
									},
									className: "px-3 py-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মুছুন" })]
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										const stf = selectedStaffDetail;
										setSelectedStaffDetail(null);
										handleOpenPayModal(stf);
									},
									className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বেতন প্রদান করুন" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedStaffDetail(null),
									className: "px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold",
									children: "বন্ধ করুন"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: confirmState.isOpen,
				title: confirmState.title,
				message: confirmState.message,
				confirmText: "হ্যাঁ, নিশ্চিত",
				cancelText: "বাতিল",
				type: "danger",
				onConfirm: confirmState.onConfirm,
				onCancel: () => setConfirmState((prev) => ({
					...prev,
					isOpen: false
				}))
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/SalarySlipModal.tsx
var SalarySlipModal = ({ salary, isOpen, onClose, config }) => {
	if (!isOpen || !salary) return null;
	const handlePrint = () => {
		window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 sm:px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 no-print",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "বেতন স্লিপ / ভাউচার"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handlePrint,
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রিন্ট" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 sm:p-8 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 print:p-0 print:bg-white print:text-slate-900 max-h-[75vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center pb-5 border-b-2 border-slate-800 dark:border-slate-700 print:border-slate-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-slate-900 tracking-tight",
									children: config.companyName || "আয়-ব্যয়"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-medium text-slate-600 dark:text-slate-300 print:text-slate-700 mt-1 space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ইন্টারনেট সার্ভিস প্রোভাইডার" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-800 dark:text-slate-200 print:text-slate-900",
										children: "মাসিক বেতন ও পারিশ্রমিক ভাউচার"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-block mt-2.5 px-3 py-0.5 bg-slate-100 dark:bg-slate-800 print:bg-slate-100 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 print:text-slate-800 border border-slate-300 dark:border-slate-700 print:border-slate-300",
									children: ["বেতন মাস: ", getMonthBengaliName(salary.month)]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "কর্মীর নাম:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 text-sm",
									children: salary.staffName
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "পদবি:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-800",
									children: salary.staffDesignation
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "ভাউচার নম্বর:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-medium text-slate-700",
									children: salary.voucherNumber || "VCH-N/A"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "পরিশোধের তারিখ:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-slate-700",
									children: salary.paymentDate || "বকেয়া"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "পরিশোধের মাধ্যম:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-slate-700",
									children: salary.paymentMethod || "নগদ"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 block",
									children: "স্ট্যাটাস:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center gap-1 font-bold ${salary.paymentStatus === "paid" ? "text-emerald-700" : "text-amber-700"}`,
									children: salary.paymentStatus === "paid" ? "✓ পরিশোধিত (PAID)" : "⏳ বকেয়া (PENDING)"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold text-slate-700 uppercase tracking-wider mb-2",
									children: "বেতনের বিস্তারিত হিসাব বিবরণী"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border border-slate-200 rounded-xl overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
										className: "w-full text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-slate-100 bg-slate-50/70",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-2.5 text-slate-600 font-medium",
													children: "মূল বেতন (Basic Salary)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-2.5 text-right font-bold text-slate-900",
													children: formatCurrency(salary.baseSalary, config.currencySymbol)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-slate-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-2.5 text-emerald-700 font-medium",
													children: "(+) ওভারটাইম / নাইট শিফট / বোনাস ভাতা"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-3.5 py-2.5 text-right font-semibold text-emerald-700",
													children: ["+", formatCurrency(salary.bonusOrAllowance, config.currencySymbol)]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-slate-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-2.5 text-rose-600 font-medium",
													children: "(-) কর্তন / অগ্রিম বাবদ বাদ"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-3.5 py-2.5 text-right font-semibold text-rose-600",
													children: ["-", formatCurrency(salary.deductionOrAdvance, config.currencySymbol)]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "bg-slate-900 text-white font-extrabold text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-3",
													children: "সর্বমোট প্রদেয় নীট বেতন (Net Payable)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-3.5 py-3 text-right text-emerald-300",
													children: formatCurrency(salary.netSalary, config.currencySymbol)
												})]
											})
										] })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-slate-500 mt-2 text-right italic",
									children: [
										"কথায়: ",
										formatEnglishCurrency(salary.netSalary),
										" টাকা মাত্র"
									]
								})
							]
						}),
						salary.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 mb-6 border border-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-slate-700",
								children: "মন্তব্য: "
							}), salary.note]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-dashed border-slate-300 text-center text-xs text-slate-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-slate-400 w-32 mx-auto pt-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "কর্মচারীর স্বাক্ষর" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-slate-400 w-32 mx-auto pt-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "কর্তৃপক্ষের স্বাক্ষর ও সিল" })] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end items-center no-print",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrint,
						className: "px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রিন্ট ভাউচার" })]
					})
				})
			]
		})
	});
};
//#endregion
//#region src/portals/ayByay/components/TransactionForm.tsx
var ANIMATED_PROMPTS = [
	"✨ নতুন আয় বা ব্যয়ের হিসাব এন্ট্রি করতে এখানে চাপ দিন ✍️",
	"📶 ইন্টারনেট বিল, ডিস বিল বা বকেয়া কালেকশন যোগ করুন ⚡",
	"🌐 ব্যান্ডউইথ বিল, বিদ্যুৎ, কেবল ও বিজ্ঞাপন প্রচার খরচ লিখুন 📑",
	"💰 ক্লিক করলেই এন্ট্রি ফর্ম চলে আসবে — কোনো ডেটা হারাবে না 🔒"
];
var DRAFT_STORAGE_KEY = "aay_byay_form_draft_v2";
var TransactionForm = ({ onAddTransaction, isSubmitting, selectedMonth, initialType = "income", initialCategory, isOpenInitially = false, onToggleOpen, isAdminLoggedIn = true, onRequireLogin }) => {
	const [isOpen, setIsOpen] = (0, import_react.useState)(isOpenInitially);
	const [promptIndex, setPromptIndex] = (0, import_react.useState)(0);
	const [type, setType] = (0, import_react.useState)(initialType);
	const [description, setDescription] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(initialCategory || (initialType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]));
	const [customCategory, setCustomCategory] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => {
		const now = /* @__PURE__ */ new Date();
		const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		if (selectedMonth && selectedMonth !== currentYM) return `${selectedMonth}-${String(now.getDate()).padStart(2, "0")}`;
		return now.toISOString().split("T")[0];
	});
	(0, import_react.useEffect)(() => {
		if (selectedMonth) {
			const now = /* @__PURE__ */ new Date();
			if (selectedMonth === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`) setDate(now.toISOString().split("T")[0]);
			else if (!date.startsWith(selectedMonth)) {
				const dayStr = String(now.getDate()).padStart(2, "0");
				setDate(`${selectedMonth}-${dayStr}`);
			}
		}
	}, [selectedMonth]);
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)(PAYMENT_METHODS[0]);
	const [note, setNote] = (0, import_react.useState)("");
	const [showMoreFields, setShowMoreFields] = (0, import_react.useState)(false);
	const [savedSuccess, setSavedSuccess] = (0, import_react.useState)(false);
	const [billGrandTotal, setBillGrandTotal] = (0, import_react.useState)("");
	const [billDeduction, setBillDeduction] = (0, import_react.useState)("");
	const [billDue, setBillDue] = (0, import_react.useState)("");
	const [isFetchingSummary, setIsFetchingSummary] = (0, import_react.useState)(false);
	const [fetchError, setFetchError] = (0, import_react.useState)(null);
	const [showJsonPaste, setShowJsonPaste] = (0, import_react.useState)(false);
	const [billSyncStatus, setBillSyncStatus] = (0, import_react.useState)(null);
	const fetchRequestIdRef = (0, import_react.useRef)(0);
	const lastAutoSyncKeyRef = (0, import_react.useRef)("");
	const activeMonthYM = (0, import_react.useMemo)(() => {
		if (date && /^\d{4}-\d{2}/.test(date)) return date.substring(0, 7);
		if (selectedMonth && /^\d{4}-\d{2}/.test(selectedMonth)) return selectedMonth.substring(0, 7);
		const now = /* @__PURE__ */ new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	}, [date, selectedMonth]);
	const activeBnMonth = (0, import_react.useMemo)(() => {
		const monthPart = parseInt(activeMonthYM.split("-")[1] || "", 10);
		return monthPart >= 1 && monthPart <= 12 ? ALL_MONTHS[monthPart - 1] : "";
	}, [activeMonthYM]);
	(0, import_react.useEffect)(() => {
		if (category === "মাসিক ইন্টারনেট বিল") {
			const gTotal = parseFloat(billGrandTotal) || 0;
			const deduct = parseFloat(billDeduction) || 0;
			const due = parseFloat(billDue) || 0;
			const net = gTotal - deduct - due;
			setAmount(String(net));
		}
	}, [
		category,
		billGrandTotal,
		billDeduction,
		billDue
	]);
	const fetchSummaryData = (0, import_react.useCallback)(async (targetYM = activeMonthYM, isManual = false) => {
		const reqId = ++fetchRequestIdRef.current;
		const monthPart = parseInt(targetYM.split("-")[1] || "", 10);
		const targetBnMonth = monthPart >= 1 && monthPart <= 12 ? ALL_MONTHS[monthPart - 1] : "";
		setIsFetchingSummary(true);
		setFetchError(null);
		const applyBillTotals = (grandTotal, totalDue, count, source, totalPay) => {
			const roundedGrand = Math.round(grandTotal);
			const roundedDue = Math.round(totalDue);
			const roundedPay = Math.round(totalPay ?? Math.max(0, roundedGrand - roundedDue));
			setBillGrandTotal(String(roundedGrand));
			setBillDue(String(roundedDue));
			setFetchError(null);
			setBillSyncStatus({
				month: targetBnMonth || targetYM,
				count,
				grandTotal: roundedGrand,
				totalDue: roundedDue,
				totalPay: roundedPay,
				source
			});
		};
		let hydratedFromCache = false;
		if (targetBnMonth) try {
			const cachedRaw = safeStorage.getItem(`bill_v4_নেট বিল_${targetBnMonth}`);
			if (cachedRaw) {
				const cachedRecs = JSON.parse(cachedRaw);
				if (Array.isArray(cachedRecs) && cachedRecs.length > 0) {
					const totalPay = cachedRecs.reduce((s, r) => s + (Number(r.pay) || 0), 0);
					const totalDue = cachedRecs.reduce((s, r) => s + (Number(r.due) || 0), 0);
					const grandTotal = totalPay + totalDue;
					if (reqId !== fetchRequestIdRef.current) return;
					applyBillTotals(grandTotal, totalDue, cachedRecs.length, "cache", totalPay);
					hydratedFromCache = true;
				}
			}
		} catch {}
		const sheetUrl = targetBnMonth ? getActiveSheetLink("নেট বিল", targetBnMonth) : "";
		try {
			if (sheetUrl) {
				const recs = await fetchSheetRecordsFast(sheetUrl, "নেট বিল", { forceFresh: isManual });
				if (reqId !== fetchRequestIdRef.current) return;
				if (recs && recs.length > 0) {
					const totalPay = recs.reduce((s, r) => s + (r.pay || 0), 0);
					const totalDue = recs.reduce((s, r) => s + (r.due || 0), 0);
					const grandTotal = totalPay + totalDue;
					safeStorage.setItem(`bill_v4_নেট বিল_${targetBnMonth}`, JSON.stringify(recs));
					try {
						const aggRaw = safeStorage.getItem("bill_monthly_aggregates");
						const parsedAgg = aggRaw ? JSON.parse(aggRaw) : {
							net: {},
							dis: {}
						};
						const nextAgg = {
							net: {
								...(parsedAgg === null || parsedAgg === void 0 ? void 0 : parsedAgg.net) || {},
								[targetBnMonth]: totalPay
							},
							dis: { ...(parsedAgg === null || parsedAgg === void 0 ? void 0 : parsedAgg.dis) || {} }
						};
						safeStorage.setItem("bill_monthly_aggregates", JSON.stringify(nextAgg));
					} catch {}
					applyBillTotals(grandTotal, totalDue, recs.length, "live", totalPay);
					if (isManual) showToast(`✅ ${targetBnMonth} মাসের নেট বিল (${recs.length} জন) অটো আপডেট হয়েছে`, "success");
					return;
				}
			}
			const proxyResponse = await fetch(`/api/ay-byay/external/summary?month=${encodeURIComponent(targetYM)}`, { headers: { "Accept": "application/json" } });
			if (reqId !== fetchRequestIdRef.current) return;
			const contentType = proxyResponse.headers.get("content-type") || "";
			if (proxyResponse.ok && contentType.includes("application/json")) {
				const proxyResult = await proxyResponse.json();
				const source = proxyResult.data || proxyResult;
				if (proxyResult.success !== false && (source.grandTotal !== void 0 || source.totalBill !== void 0 || source.totalDue !== void 0)) {
					applyBillTotals(Number(source.grandTotal ?? source.totalBill ?? source.total ?? source.totalPay ?? 0), Number(source.totalDue ?? source.due ?? source.dueBill ?? source.dueAmount ?? 0), Number(source.count || 0), "api");
					if (isManual) showToast(`✅ ${targetBnMonth || targetYM} মাসের বিল আপডেট হয়েছে`, "success");
					return;
				}
			}
			if (!hydratedFromCache) {
				setBillGrandTotal("");
				setBillDue("");
				setBillSyncStatus(null);
				setFetchError({ message: !sheetUrl ? `${targetBnMonth || targetYM} মাসের অনলাইন নেট বিল শিট লিংক নেই — অনুগ্রহ করে নিচে ম্যানুয়ালি লিখুন অথবা তারিখ থেকে সঠিক মাস বেছে নিন।` : `${targetBnMonth || targetYM} মাসের বিলিং ডেটা লোড করা যায়নি। নিচে ম্যানুয়ালি বিলের তথ্য দিন অথবা পুনরায় চেষ্টা করুন।` });
			}
		} catch {
			if (reqId !== fetchRequestIdRef.current) return;
			if (!hydratedFromCache) {
				setBillGrandTotal("");
				setBillDue("");
				setBillSyncStatus(null);
				setFetchError({ message: "অটো-লোড সার্ভার সংযোগ পাওয়া যায়নি। অনুগ্রহ করে ম্যানুয়ালি বিলের তথ্য দিন।" });
			}
		} finally {
			if (reqId === fetchRequestIdRef.current) setIsFetchingSummary(false);
		}
	}, [activeMonthYM]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			lastAutoSyncKeyRef.current = "";
			return;
		}
		if (type === "income" && category === "মাসিক ইন্টারনেট বিল") {
			const syncKey = `${activeMonthYM}:${category}`;
			if (lastAutoSyncKeyRef.current !== syncKey) {
				lastAutoSyncKeyRef.current = syncKey;
				fetchSummaryData(activeMonthYM, false);
			}
		}
	}, [
		isOpen,
		type,
		category,
		activeMonthYM,
		fetchSummaryData
	]);
	const handleJsonPaste = (jsonStr) => {
		try {
			const data = JSON.parse(jsonStr);
			const gTotal = data.grandTotal ?? data.totalBill ?? data.total ?? data.totalPay ?? 0;
			const tDue = data.totalDue ?? data.due ?? data.dueBill ?? data.dueAmount ?? 0;
			if (gTotal || tDue) {
				setBillGrandTotal(String(gTotal));
				setBillDue(String(tDue));
				setShowJsonPaste(false);
				setFetchError(null);
			}
		} catch (e) {}
	};
	(0, import_react.useEffect)(() => {
		try {
			const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
			if (savedDraft) {
				const parsed = JSON.parse(savedDraft);
				if (parsed.description) setDescription(parsed.description);
				if (parsed.amount) setAmount(parsed.amount);
				if (parsed.type) setType(parsed.type);
				if (parsed.category) setCategory(parsed.category);
				if (parsed.customCategory) setCustomCategory(parsed.customCategory);
				if (parsed.date) setDate(parsed.date);
				if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
				if (parsed.note) setNote(parsed.note);
			}
		} catch (e) {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const draft = {
				type,
				description,
				amount,
				category,
				customCategory,
				date,
				paymentMethod,
				note
			};
			sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
		} catch (e) {}
	}, [
		type,
		description,
		amount,
		category,
		customCategory,
		date,
		paymentMethod,
		note
	]);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setPromptIndex((prev) => (prev + 1) % ANIMATED_PROMPTS.length);
		}, 3500);
		return () => clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		if (initialType) {
			setType(initialType);
			if (initialCategory) {
				setCategory(initialCategory);
				setCustomCategory("");
				setIsOpen(true);
			} else setCategory(initialType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
		}
	}, [initialType, initialCategory]);
	const toggleFormOpen = () => {
		if (!isAdminLoggedIn && !isOpen) {
			if (onRequireLogin) onRequireLogin();
			return;
		}
		const nextState = !isOpen;
		setIsOpen(nextState);
		if (onToggleOpen) onToggleOpen(nextState);
	};
	const handleTypeChange = (newType) => {
		setType(newType);
		setCategory(newType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
		setCustomCategory("");
	};
	const isOtherCategory = category === "অন্যান্য আয়" || category === "অন্যান্য খরচ" || category.startsWith("অন্যান্য");
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isAdminLoggedIn) {
			if (onRequireLogin) onRequireLogin();
			return;
		}
		const numAmount = parseNumber(amount);
		if (numAmount <= 0) {
			showToast("সঠিক টাকার পরিমাণ দিন (যেমন: ১৩১৩ বা 1313)", "warning");
			return;
		}
		let finalCategory = category;
		if (isOtherCategory) {
			if (!customCategory.trim()) {
				showToast(type === "income" ? "অনুগ্রহ করে অন্যান্য আয়ের খাতের নাম লিখুন" : "অনুগ্রহ করে অন্যান্য খরচের খাতের নাম লিখুন", "warning");
				return;
			}
			finalCategory = customCategory.trim();
		}
		const finalDescription = description.trim() || `${finalCategory} বাবদ ${type === "income" ? "আয়" : "ব্যয়"}`;
		if (await onAddTransaction({
			type,
			description: finalDescription,
			category: finalCategory,
			amount: numAmount,
			date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			paymentMethod,
			note: note.trim()
		})) {
			setDescription("");
			setAmount("");
			setBillGrandTotal("");
			setBillDeduction("");
			setBillDue("");
			setBillSyncStatus(null);
			setCustomCategory("");
			setNote("");
			sessionStorage.removeItem(DRAFT_STORAGE_KEY);
			setSavedSuccess(true);
			setTimeout(() => {
				setSavedSuccess(false);
			}, 2500);
		}
	};
	const activeCategories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full mb-6 no-print",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: toggleFormOpen,
			id: "btn-toggle-entry-form",
			role: "button",
			tabIndex: 0,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") toggleFormOpen();
			},
			className: `group relative overflow-hidden rounded-3xl p-4 sm:p-5 cursor-pointer transition-all duration-300 shadow-sm border ${isOpen ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-indigo-500/40 shadow-md" : "bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 hover:from-emerald-100/90 hover:via-teal-100/90 hover:to-indigo-100 dark:hover:from-slate-800 text-slate-800 dark:text-slate-100 border-emerald-300/80 dark:border-emerald-800 shadow-xs hover:shadow-md"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isOpen ? "bg-indigo-600 text-white shadow-sm" : "bg-emerald-600 dark:bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none animate-pulse"}`,
						children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${isOpen ? "bg-indigo-800 text-indigo-200" : "bg-emerald-600 dark:bg-emerald-500 text-white"}`,
							children: isOpen ? "ফরম সক্রিয়" : "ক্লিক করুন"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-semibold ${isOpen ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`,
							children: "(ডেটা স্বয়ংক্রিয় সংরক্ষিত)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 min-h-[28px] flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-xs sm:text-sm md:text-base font-bold transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-1 leading-snug ${isOpen ? "text-indigo-100" : "text-slate-900 dark:text-emerald-300 group-hover:text-emerald-950 dark:group-hover:text-emerald-200"}`,
							children: isOpen ? "✍️ নিচে আপনার আয় বা ব্যয়ের তথ্য প্রদান করুন" : ANIMATED_PROMPTS[promptIndex]
						}, promptIndex)
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 self-end sm:self-auto shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${isOpen ? "bg-white/10 hover:bg-white/20 text-white border border-white/20" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`,
						children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ফরম লুকান" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-4 h-4" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ এন্ট্রি ফরম খুলুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4 animate-bounce" })] })
					})
				})]
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-3 duration-300",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-black text-slate-900 dark:text-slate-100",
						children: "নতুন লেনদেন সংযোজন"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "সঠিক খাত ও বিবরণ দিয়ে সেভ করুন, অনলাইন ক্লাউড ডেটাবেসে সাথে সাথে সংরক্ষিত হবে"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowMoreFields(!showMoreFields),
						className: `text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${showMoreFields ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"}`,
						title: showMoreFields ? "সংক্ষিপ্ত ভিউতে ফিরে যান" : "বাড়তি নোট ও রেফারেন্স ফিল্ড খুলুন",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showMoreFields ? "সংক্ষিপ্ত ভিউ" : "+ বাড়তি নোট" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsOpen(false),
						className: "text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer",
						title: "ফরম লুকান",
						children: "✕"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							id: "btn-type-income",
							onClick: () => handleTypeChange("income"),
							className: `py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${type === "income" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📥 আয় (Income)" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							id: "btn-type-expense",
							onClick: () => handleTypeChange("expense"),
							className: `py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${type === "expense" ? "bg-rose-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📤 ব্যয় (Expense)" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1",
						children: "লেনদেনের বিবরণ (ঐচ্ছিক - খালি রাখলে খাত অটো বসবে)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						id: "descInput",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: type === "income" ? "যেমন: সেপ্টেম্বর ইন্টারনেট বিল কালেকশন (খালি রাখলে খাতের নাম বসবে)" : "যেমন: আপস্ট্রিম ব্যান্ডউইথ সেপ্টেম্বর বিল",
						className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3.5 h-3.5 text-slate-500 dark:text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "হিসাবের খাত / বিভাগ *" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "categorySelect",
							value: category,
							onChange: (e) => {
								const newCategory = e.target.value;
								setCategory(newCategory);
								if (newCategory === "মাসিক ইন্টারনেট বিল") {
									lastAutoSyncKeyRef.current = `${activeMonthYM}:${newCategory}`;
									fetchSummaryData(activeMonthYM, false);
								}
							},
							className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition",
							children: activeCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: cat,
								className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
								children: cat
							}, cat))
						}),
						isOtherCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1 ml-1 flex items-center gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"✍️ ",
									type === "income" ? "অন্যান্য আয়ের নাম লিখুন" : "অন্যান্য খরচের নাম লিখুন",
									" *"
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								id: "customCategoryInput",
								value: customCategory,
								onChange: (e) => setCustomCategory(e.target.value),
								placeholder: type === "income" ? "যেমন: পুরোনো ক্যাবল/রাউটার বিক্রয়, অন্যান্য সার্ভিস" : "যেমন: অফিসের চা-নাস্তা, মেরামত ফি, অনুদান",
								className: "w-full px-4 py-2 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-amber-800/60 dark:placeholder:text-amber-300/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 transition",
								required: true
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: category === "মাসিক ইন্টারনেট বিল" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 ml-1",
									children: [
										"ইন্টারনেট বিল অটো-ক্যালকুলেটর (",
										activeBnMonth || activeMonthYM,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowJsonPaste(!showJsonPaste),
										className: "text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showJsonPaste ? "পেস্ট লুকান" : "ডেটা পেস্ট করুন" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fetchSummaryData(activeMonthYM, true),
										className: "text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3 h-3 ${isFetchingSummary ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অটো আপডেট" })]
									})]
								})]
							}),
							billSyncStatus && !fetchError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "bill-auto-sync-status",
								className: `p-2.5 rounded-xl border text-[11px] font-semibold flex flex-wrap items-center justify-between gap-2 tabular-nums ${billSyncStatus.source === "live" ? "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300" : "bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/70 text-indigo-800 dark:text-indigo-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"বিল ম্যানেজার প্রো (",
										billSyncStatus.month,
										" মাস):",
										" ",
										billSyncStatus.count > 0 ? `${billSyncStatus.count.toLocaleString("bn-BD")} জন গ্রাহক — ` : "",
										"মোট ৳",
										billSyncStatus.grandTotal.toLocaleString("bn-BD"),
										", বকেয়া ৳",
										billSyncStatus.totalDue.toLocaleString("bn-BD")
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/70 border border-current/15 shrink-0",
									children: billSyncStatus.source === "live" ? "লাইভ শিট সিঙ্ক" : billSyncStatus.source === "cache" ? "ক্যাশ থেকে লোড" : "সার্ভার সিঙ্ক"
								})]
							}),
							showJsonPaste && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl animate-in fade-in zoom-in-95 duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1.5",
									children: "লিঙ্ক থেকে পাওয়া JSON ডাটা এখানে পেস্ট করুন (অটো ফিল হবে)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									onChange: (e) => handleJsonPaste(e.target.value),
									placeholder: "{\"grandTotal\": 68825, \"totalDue\": 11000, ...}",
									className: "w-full px-3 py-2 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
								})]
							}),
							isFetchingSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse ml-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"বিল ম্যানেজার প্রো (",
									activeBnMonth || activeMonthYM,
									") থেকে লাইভ তথ্য আপডেট হচ্ছে..."
								] })]
							}),
							fetchError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-bold mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fetchError.message })]
								}), fetchError.needsAuth && fetchError.target && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] leading-relaxed",
										children: "বিলিং সার্ভারে সেশন সক্রিয় নেই। এটি ঠিক করতে নিচের বাটনে ক্লিক করে বিলিং পেজটি একবার ওপেন করুন এবং তারপর এখানে ফিরে এসে পুনরায় চেষ্টা করুন।"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: fetchError.target,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বিলিং সিস্টেম ওপেন করুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5 rotate-270" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => fetchSummaryData(activeMonthYM, true),
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পুনরায় চেষ্টা করুন" })]
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1.5 ml-1",
										children: "১. সর্বমোট বিল (৳)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: billGrandTotal,
										onChange: (e) => setBillGrandTotal(e.target.value),
										placeholder: "মোট বিল",
										step: "any",
										className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1.5 ml-1",
										children: "২. কোম্পানি কর্তন (-)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: billDeduction,
										onChange: (e) => setBillDeduction(e.target.value),
										placeholder: "কর্তন",
										step: "any",
										className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5 ml-1",
										children: "৩. বকেয়া বিল (-)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: billDue,
										onChange: (e) => setBillDue(e.target.value),
										placeholder: "বকেয়া",
										step: "any",
										className: "w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 ml-1",
										children: "৪. অবশিষ্ট বিল (মোট)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: amount,
										readOnly: true,
										placeholder: "০",
										className: "w-full px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-xl text-sm font-black text-emerald-700 dark:text-emerald-300 cursor-not-allowed"
									})] })
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1",
						children: "টাকার পরিমাণ (৳) *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						inputMode: "decimal",
						id: "amountInput",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						placeholder: "টাকার পরিমাণ (যেমন: ৫০০০ বা 5000)",
						className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition",
						required: true
					})] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-slate-500 dark:text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "তারিখ" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						id: "dateInput",
						value: date,
						onChange: (e) => setDate(e.target.value),
						className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-3.5 h-3.5 text-slate-500 dark:text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পেমেন্ট মাধ্যম" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "paymentMethodSelect",
							value: paymentMethod,
							onChange: (e) => setPaymentMethod(e.target.value),
							className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition",
							children: PAYMENT_METHODS.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: method,
								className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
								children: method
							}, method))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col justify-end",
							children: showMoreFields ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-in fade-in duration-150",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5 ml-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বাড়তি নোট / রেফারেন্স (ঐচ্ছিক)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowMoreFields(false),
										className: "text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
										children: "লুকান"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									id: "noteInput",
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "ইনভয়েস / রসিদ নং বা মন্তব্য",
									className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/20 transition"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-indigo-900 dark:text-indigo-200 font-medium truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-indigo-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: ["নোট: ", note]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowMoreFields(true),
									className: "text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer",
									children: "সম্পাদনা"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-transparent select-none mb-1.5 ml-1 hidden sm:block",
								children: "ঐচ্ছিক"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowMoreFields(true),
								className: "w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ বাড়তি নোট বা ভাউচার নং লিখুন" })]
							})] }) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অটো-ড্রাফট সক্রিয় — ভুলবশত পেজ রিলোড হলেও তথ্য হারাবে না" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsOpen(false),
								className: "w-1/3 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer",
								children: "বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								id: "btn-submit-transaction",
								disabled: isSubmitting,
								className: `w-2/3 sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"} disabled:opacity-50 active:scale-95`,
								children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সংরক্ষণ হচ্ছে..." })] }) : savedSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সফলভাবে যুক্ত হয়েছে!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: type === "income" ? "আয় সংরক্ষণ করুন" : "ব্যয় সংরক্ষণ করুন" })] })
							})]
						})]
					})
				]
			})]
		})]
	});
};
//#endregion
//#region src/portals/ayByay/components/TransactionList.tsx
var TransactionList = ({ transactions, activeTypeFilter, onTypeFilterChange, onSelectTransaction, onEditTransaction, onDeleteTransaction, currencySymbol = "৳", isAdminLoggedIn = false }) => {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("all");
	const [deleteConfirmTxn, setDeleteConfirmTxn] = (0, import_react.useState)(null);
	const filteredList = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const now = /* @__PURE__ */ new Date();
		const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split("T")[0];
		const currentYearMonth = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
		return transactions.filter((t) => {
			if (!t) return false;
			const tDate = String(t.date || "");
			if (activeTypeFilter !== "all" && t.type !== activeTypeFilter) return false;
			if (dateFilter === "today" && tDate !== today) return false;
			if (dateFilter === "week" && tDate < startOfWeek) return false;
			if (dateFilter === "month" && !tDate.startsWith(currentYearMonth)) return false;
			if (searchQuery.trim()) {
				const q = String(searchQuery).toLowerCase().trim();
				const matchDesc = String(t.description || "").toLowerCase().includes(q);
				const matchCat = String(t.category || "").toLowerCase().includes(q);
				const matchNote = String(t.note || "").toLowerCase().includes(q);
				const matchAmount = String(t.amount || "").includes(q);
				if (!matchDesc && !matchCat && !matchNote && !matchAmount) return false;
			}
			return true;
		});
	}, [
		transactions,
		activeTypeFilter,
		dateFilter,
		searchQuery
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white dark:bg-slate-900 rounded-[28px] p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800 no-print",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📋 লেনদেন তালিকা" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
						children: [filteredList.length, " টি"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-400 dark:text-slate-400 mt-0.5",
					children: "বিস্তারিত দেখতে যেকোনো লেনদেনে ক্লিক করুন"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs self-start sm:self-auto overflow-x-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDateFilter("all"),
							className: `px-3 py-1 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${dateFilter === "all" ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: "সব সময়"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDateFilter("today"),
							className: `px-3 py-1 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${dateFilter === "today" ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: "আজ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDateFilter("week"),
							className: `px-3 py-1 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${dateFilter === "week" ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: "এই সপ্তাহ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDateFilter("month"),
							className: `px-3 py-1 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${dateFilter === "month" ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`,
							children: "চলতি মাস"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-2.5 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "বিবরণ, খাত বা নোট দিয়ে খুঁজুন...",
							className: "w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs sm:text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearchQuery(""),
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer",
							children: "✕"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 self-start sm:self-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onTypeFilterChange("all"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${activeTypeFilter === "all" ? "bg-slate-800 dark:bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
							children: [
								"সব (",
								transactions.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onTypeFilterChange("income"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${activeTypeFilter === "income" ? "bg-emerald-600 text-white" : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"}`,
							children: "আয়"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onTypeFilterChange("expense"),
							className: `px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${activeTypeFilter === "expense" ? "bg-rose-600 text-white" : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60"}`,
							children: "ব্যয়"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2.5",
				children: filteredList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl mb-2",
							children: "📭"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-600 dark:text-slate-300 text-sm font-semibold",
							children: "কোনো লেনদেন পাওয়া যায়নি"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 dark:text-slate-400 text-xs mt-1",
							children: "উপরের ফর্মটি ব্যবহার করে নতুন আয় বা ব্যয়ের লেনদেন যোগ করুন"
						})
					]
				}) : [...filteredList].reverse().map((entry) => {
					const isIncome = entry.type === "income";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onSelectTransaction(entry),
						className: "group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 rounded-2xl transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99] gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isIncome ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"}`,
								children: isIncome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mb-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-md font-semibold text-[11px] ${isIncome ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50" : "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200/50"}`,
												children: entry.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-slate-500 dark:text-slate-400",
												children: entry.date
											}),
											entry.paymentMethod && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-500 dark:text-slate-400 font-medium",
												children: entry.paymentMethod
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug break-words",
										children: entry.description
									}),
									entry.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic break-words",
										children: ["নোট: ", entry.note]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-left sm:text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-sm sm:text-base font-extrabold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
									children: [isIncome ? "➕ " : "➖ ", formatCurrency(entry.amount, currencySymbol)]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 pl-1",
								children: [isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										onEditTransaction(entry);
									},
									title: "এডিট করুন",
									className: "p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										setDeleteConfirmTxn(entry);
									},
									title: "ডিলিট করুন",
									className: "p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-slate-300 group-hover:text-slate-500 transition" })]
							})]
						})]
					}, entry.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: !!deleteConfirmTxn,
				title: "এন্ট্রি মুছে ফেলার নিশ্চিতকরণ",
				message: `আপনি কি নিশ্চিত "${(deleteConfirmTxn === null || deleteConfirmTxn === void 0 ? void 0 : deleteConfirmTxn.description) || ""}" লেনদেনটি স্থায়ীভাবে মুছে ফেলতে চান?`,
				confirmText: "হ্যাঁ, ডিলিট করুন",
				cancelText: "বাতিল",
				type: "danger",
				onConfirm: () => {
					if (deleteConfirmTxn) {
						onDeleteTransaction(deleteConfirmTxn.id);
						setDeleteConfirmTxn(null);
					}
				},
				onCancel: () => setDeleteConfirmTxn(null)
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/DetailModal.tsx
var DetailModal = ({ transaction, isOpen, onClose, onUpdate, onDelete, currencySymbol = "৳", initialEditMode = false, isAdminLoggedIn = false }) => {
	const [isEditing, setIsEditing] = (0, import_react.useState)(initialEditMode);
	const [description, setDescription] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("income");
	const [category, setCategory] = (0, import_react.useState)("");
	const [customCategory, setCustomCategory] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (transaction) {
			setDescription(transaction.description);
			setAmount(String(transaction.amount));
			setType(transaction.type);
			if ((transaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).includes(transaction.category)) {
				setCategory(transaction.category);
				setCustomCategory("");
			} else {
				setCategory(transaction.type === "income" ? "অন্যান্য আয়" : "অন্যান্য খরচ");
				setCustomCategory(transaction.category);
			}
			setDate(transaction.date);
			setPaymentMethod(transaction.paymentMethod || PAYMENT_METHODS[0]);
			setNote(transaction.note || "");
			setIsEditing(initialEditMode);
		}
	}, [transaction, initialEditMode]);
	if (!isOpen || !transaction) return null;
	const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
	const handleSaveEdit = async () => {
		if (!description.trim()) {
			showToast("বিবরণ লিখুন", "warning");
			return;
		}
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0) {
			showToast("সঠিক পরিমাণ দিন (০ এর বেশি)", "warning");
			return;
		}
		setIsSaving(true);
		let finalCat = category;
		if (category === "অন্যান্য আয়" || category === "অন্যান্য খরচ" || category.startsWith("অন্যান্য")) finalCat = customCategory.trim() || category;
		const ok = await onUpdate(transaction.id, {
			description: description.trim(),
			amount: numAmount,
			type,
			category: finalCat,
			date,
			paymentMethod,
			note: note.trim()
		});
		setIsSaving(false);
		if (ok) setIsEditing(false);
	};
	const handleDelete = async () => {
		setShowDeleteConfirm(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "detailModalCenter",
		onClick: onClose,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "modalInnerContent",
			onClick: (e) => e.stopPropagation(),
			className: "bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isEditing ? "✏️ লেনদেন এডিট" : "📄 লেনদেনের বিস্তারিত" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setType("income");
								setCategory(INCOME_CATEGORIES[0]);
							},
							className: `py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${type === "income" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
							children: "আয় (ইনকাম)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setType("expense");
								setCategory(EXPENSE_CATEGORIES[0]);
							},
							className: `py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${type === "expense" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"}`,
							children: "ব্যয় (খরচ)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
						children: "বিবরণ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
							children: "বিভাগ / খাত"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => {
								setCategory(e.target.value);
								if (!e.target.value.startsWith("অন্যান্য")) setCustomCategory("");
							},
							className: "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500",
							children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
								children: c
							}, c))
						}),
						(category === "অন্যান্য আয়" || category === "অন্যান্য খরচ" || category.startsWith("অন্যান্য")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: customCategory,
							onChange: (e) => setCustomCategory(e.target.value),
							placeholder: "খাতের নির্দিষ্ট নাম লিখুন",
							className: "w-full mt-1.5 px-3 py-1.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-400",
							required: true
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
							children: "টাকার পরিমাণ (৳)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
							children: "তারিখ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: "w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
						children: "পেমেন্ট মাধ্যম"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: paymentMethod,
						onChange: (e) => setPaymentMethod(e.target.value),
						className: "w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500",
						children: PAYMENT_METHODS.map((pm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: pm,
							className: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
							children: pm
						}, pm))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1",
						children: "নোট / রেফারেন্স"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "অতিরিক্ত মন্তব্য",
						className: "w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleSaveEdit,
							disabled: isSaving,
							className: "flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsEditing(false),
							className: "py-2.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer",
							children: "বাতিল"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "বিবরণ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-800 dark:text-slate-100 text-right max-w-[220px]",
								children: transaction.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "পরিমাণ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-lg font-extrabold ${transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
								children: [transaction.type === "income" ? "➕ " : "➖ ", formatCurrency(transaction.amount, currencySymbol)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "ধরন"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2.5 py-0.5 rounded-full text-xs font-bold ${transaction.type === "income" ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300" : "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300"}`,
								children: transaction.type === "income" ? "আয়" : "ব্যয়"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "বিভাগ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-slate-700 dark:text-slate-200",
								children: transaction.category
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "তারিখ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-700 dark:text-slate-200 font-medium",
								children: transaction.date
							})]
						}),
						transaction.paymentMethod && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "পেমেন্ট মাধ্যম"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-700 dark:text-slate-200 font-medium",
								children: transaction.paymentMethod
							})]
						}),
						transaction.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-500 dark:text-slate-400 text-xs",
								children: "নোট"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-slate-700 dark:text-slate-200 text-xs text-right italic max-w-[200px]",
								children: [
									"\"",
									transaction.note,
									"\""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-400 dark:text-slate-500",
								children: "ট্র্যাকিং আইডি"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-slate-500 dark:text-slate-400 text-[11px]",
								children: transaction.id
							})]
						})
					]
				}), isAdminLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setIsEditing(true),
						className: "flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডিট" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleDelete,
						className: "flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ডিলিট" })]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-center text-xs font-semibold text-amber-800 dark:text-amber-300",
					children: "🔒 লেনদেন এডিট বা ডিলিট করার জন্য এডমিন লগইন প্রয়োজন।"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: showDeleteConfirm,
			title: "এন্ট্রি ডিলিট নিশ্চিতকরণ",
			message: `আপনি কি নিশ্চিত "${(transaction === null || transaction === void 0 ? void 0 : transaction.description) || ""}" লেনদেনটি স্থায়ীভাবে মুছে ফেলতে চান?`,
			confirmText: "হ্যাঁ, ডিলিট করুন",
			cancelText: "বাতিল",
			type: "danger",
			onConfirm: async () => {
				if (transaction) {
					setShowDeleteConfirm(false);
					await onDelete(transaction.id);
					onClose();
				}
			},
			onCancel: () => setShowDeleteConfirm(false)
		})]
	});
};
//#endregion
//#region src/portals/ayByay/components/MonthlyReportModal.tsx
var MonthlyReportModal = ({ isOpen, onClose, transactions, config, currencySymbol = "৳", isFullPage = false, availableMonths: propAvailableMonths = [], selectedMonth: initialSelectedMonth, onMonthChange }) => {
	const availableMonths = (0, import_react.useMemo)(() => {
		const set = new Set(propAvailableMonths);
		const currentYM = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
		set.add(currentYM);
		if (config === null || config === void 0 ? void 0 : config.activeMonth) set.add(config.activeMonth);
		if ((config === null || config === void 0 ? void 0 : config.managedMonths) && Array.isArray(config.managedMonths)) config.managedMonths.forEach((m) => {
			if (m) set.add(m);
		});
		(transactions || []).forEach((t) => {
			if (t && t.date && t.date.length >= 7) set.add(t.date.substring(0, 7));
		});
		return Array.from(set).sort().reverse();
	}, [
		propAvailableMonths,
		config,
		transactions
	]);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(() => initialSelectedMonth || (config === null || config === void 0 ? void 0 : config.activeMonth) || availableMonths[0] || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7));
	import_react.useEffect(() => {
		if (isOpen) setSelectedMonth(initialSelectedMonth || (config === null || config === void 0 ? void 0 : config.activeMonth) || availableMonths[0] || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7));
	}, [
		isOpen,
		initialSelectedMonth,
		config === null || config === void 0 ? void 0 : config.activeMonth
	]);
	const monthTransactions = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		return [...transactions.filter((t) => t && typeof t.date === "string" && getTransactionMonth(t.date) === selectedMonth)].sort((a, b) => {
			const dateA = new Date(a.date).getTime() || 0;
			const dateB = new Date(b.date).getTime() || 0;
			if (dateA !== dateB) return dateA - dateB;
			const timeA = new Date(a.createdAt || 0).getTime() || 0;
			const timeB = new Date(b.createdAt || 0).getTime() || 0;
			if (timeA !== timeB) return timeA - timeB;
			return String(a.id || "").localeCompare(String(b.id || ""));
		});
	}, [transactions, selectedMonth]);
	const stats = (0, import_react.useMemo)(() => {
		let totalIncome = 0;
		let totalExpense = 0;
		const expenseByCategory = {};
		const incomeByCategory = {};
		monthTransactions.forEach((t) => {
			if (!t) return;
			const amt = parseNumber(t.amount);
			const cat = String(t.category || "অন্যান্য");
			if (isIncomeTransaction(t)) {
				totalIncome += amt;
				incomeByCategory[cat] = (incomeByCategory[cat] || 0) + amt;
			} else {
				totalExpense += amt;
				expenseByCategory[cat] = (expenseByCategory[cat] || 0) + amt;
			}
		});
		const netBalance = totalIncome - totalExpense;
		const savingsRate = totalIncome > 0 ? Math.max(0, netBalance / totalIncome * 100) : 0;
		const sortedExpenseCats = Object.entries(expenseByCategory).map(([cat, amt]) => ({
			category: cat,
			amount: amt,
			percentage: totalExpense > 0 ? amt / totalExpense * 100 : 0
		})).sort((a, b) => b.amount - a.amount);
		const sortedIncomeCats = Object.entries(incomeByCategory).map(([cat, amt]) => ({
			category: cat,
			amount: amt,
			percentage: totalIncome > 0 ? amt / totalIncome * 100 : 0
		})).sort((a, b) => b.amount - a.amount);
		return {
			totalIncome,
			totalExpense,
			netBalance,
			savingsRate,
			topExpense: sortedExpenseCats[0] || null,
			sortedExpenseCats,
			sortedIncomeCats,
			count: monthTransactions.length
		};
	}, [monthTransactions]);
	if (!isOpen && !isFullPage) return null;
	const handlePrint = () => {
		window.print();
	};
	const handleExportMonthCsv = () => {
		let csv = "﻿আইডি,তারিখ,ধরন,বিবরণ,বিভাগ,পরিমাণ,পেমেন্ট মাধ্যম,নোট\r\n";
		monthTransactions.forEach((t) => {
			const row = [
				`"${t.id}"`,
				`"${t.date}"`,
				`"${t.type === "income" ? "আয়" : "ব্যয়"}"`,
				`"${(t.description || "").replace(/"/g, "\"\"")}"`,
				`"${(t.category || "").replace(/"/g, "\"\"")}"`,
				t.amount,
				`"${(t.paymentMethod || "").replace(/"/g, "\"\"")}"`,
				`"${(t.note || "").replace(/"/g, "\"\"")}"`
			];
			csv += row.join(",") + "\r\n";
		});
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `monthly-statement-${selectedMonth}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const monthLabel = getMonthBengaliName(selectedMonth);
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "monthlyReportContainer",
		onClick: (e) => e.stopPropagation(),
		className: `bg-white dark:bg-slate-900 w-full ${isFullPage ? "rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs" : "max-w-4xl mx-auto rounded-[32px] p-5 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 my-auto"} overflow-y-auto print-page text-slate-900 dark:text-slate-100`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight",
						children: "মাসিক আর্থিক রিপোর্ট ও স্টেটমেন্ট"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400",
						children: "কোম্পানির ব্যালেন্স শিট, আয়-ব্যয় সারসংক্ষেপ ও পিডিএফ ডাউনলোড"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-100 dark:border-slate-800 no-print",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-slate-600 dark:text-slate-400",
						children: "মাস নির্বাচন:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedMonth,
						onChange: (e) => {
							const val = e.target.value;
							setSelectedMonth(val);
							if (onMonthChange) onMonthChange(val);
						},
						className: "px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500",
						children: availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: m,
							children: [
								getMonthBengaliName(m),
								" ",
								m === (config === null || config === void 0 ? void 0 : config.activeMonth) ? "(সক্রিয় মাস)" : "(ইতিহাস)"
							]
						}, m))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrint,
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পিডিএফ ডাউনলোড / প্রিন্ট" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleExportMonthCsv,
						className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এক্সেল / CSV" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-4 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center pb-4 border-b border-slate-200 dark:border-slate-800 print:border-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-slate-900 tracking-tight text-center",
								children: config.companyName || "প্রত্যাশা ক্যাবল নেটওয়ার্ক"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-slate-700 dark:text-slate-300 print:text-slate-700 text-center mt-1",
								children: "ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mt-4 border-t border-b border-slate-300 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-slate-900",
										children: ["মাস : ", monthLabel]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-bold text-slate-900",
										children: "দৈনিক আয় - ব্যয় হিসাব"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-slate-900",
										children: ["তারিখ : ", monthTransactions.length > 0 ? `${monthTransactions[0].date.split("-")[2]}-${monthTransactions[monthTransactions.length - 1].date.split("-")[2]}/${monthTransactions[0].date.split("-")[1]}/${monthTransactions[0].date.split("-")[0]}` : ""]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5",
						children: "📑 বিস্তারিত লেনদেন তালিকা"
					}), monthTransactions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl",
						children: "এই মাসে কোনো লেনদেন পাওয়া যায়নি"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border border-slate-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "ক্রমিক"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "তারিখ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "বিবরণ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "রেফারেন্স"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "আয়"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1 border-r border-slate-300",
										children: "ব্যয়"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-1",
										children: "স্ট্যাটাস"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-slate-300 text-slate-900",
								children: [monthTransactions.map((t, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-slate-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300 text-center",
											children: index + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-1 border-r border-slate-300 whitespace-nowrap text-center",
											children: [
												t.date.split("-")[2],
												"/",
												t.date.split("-")[1],
												"/",
												t.date.split("-")[0].slice(-2)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300",
											children: t.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300",
											children: t.note || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300 text-center",
											children: isIncomeTransaction(t) ? t.amount : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300 text-center",
											children: isExpenseTransaction(t) ? t.amount : ""
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 text-center",
											children: isIncomeTransaction(t) ? "আয়" : "পরিশোধ"
										})
									]
								}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "font-bold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 4,
											className: "py-2 px-1 border-r border-slate-300 text-right",
											children: "মোট : "
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300 text-center",
											children: stats.totalIncome
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 border-r border-slate-300 text-center",
											children: stats.totalExpense
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-1 text-center",
											children: "টাকা"
										})
									]
								})]
							})]
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-64 border-t border-slate-300 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-between items-center text-sm font-bold text-slate-900 mb-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টোটাল মাসিক আয় - ব্যয়" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm mb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টোটাল আয় -" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "border border-slate-300 px-2 py-0.5 text-right w-20",
											children: stats.totalIncome
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm mb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টোটাল ব্যয় -" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "border border-slate-300 px-2 py-0.5 text-right w-20",
											children: stats.totalExpense
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center text-sm font-bold border-t border-slate-300 pt-1 mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মোট =" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-20 text-right",
											children: stats.totalIncome - stats.totalExpense
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-8 pb-4 flex justify-between items-end border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-slate-600 dark:text-slate-400",
							children: "কম্পিউটার জেনারেটেড রিপোর্ট"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-36 border-b border-slate-400 dark:border-slate-600 pb-1 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-slate-700 dark:text-slate-300",
								children: "কর্তৃপক্ষের স্বাক্ষর"
							})]
						})]
					})
				]
			})
		]
	});
	if (isFullPage) return content;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "monthlyReportModal",
		onClick: onClose,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto",
		children: content
	});
};
//#endregion
//#region src/portals/ayByay/components/MobileBottomNav.tsx
var MobileBottomNav = ({ activeNav, onNavChange, onOpenReportModal, selectedMonth = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7), onMonthChange, onOpenNewMonthModal, availableMonths = [], stats = {
	totalIncome: 0,
	totalExpense: 0,
	netProfit: 0
}, config, onAdminLogout, isAdminLoggedIn, isDarkMode, onToggleDarkMode, onOpenAdminLogin, isDrawerOpen, onToggleDrawer, onCloseDrawer }) => {
	const [internalDrawer, setInternalDrawer] = (0, import_react.useState)(false);
	const showDrawer = isDrawerOpen !== void 0 ? isDrawerOpen : internalDrawer;
	const handleCloseDrawer = () => {
		if (onCloseDrawer) onCloseDrawer();
		else setInternalDrawer(false);
	};
	const handleTriggerDrawerToggle = () => {
		if (onToggleDrawer) onToggleDrawer();
		else setInternalDrawer(!internalDrawer);
	};
	const handleNav = (nav) => {
		onNavChange(nav);
	};
	const currencySymbol = (config === null || config === void 0 ? void 0 : config.currencySymbol) || "৳";
	const now = /* @__PURE__ */ new Date();
	const currentCalendarMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	const isCurrentMonth = selectedMonth === currentCalendarMonth;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [showDrawer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 sm:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: handleCloseDrawer,
			className: "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "মোবাইল ড্রয়ার মেনু",
			onClick: (e) => e.stopPropagation(),
			className: "fixed inset-y-0 right-0 z-50 w-[310px] max-w-[85vw] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 backdrop-blur-md z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png",
							alt: "আয়-ব্যয় লোগো",
							className: "w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-black tracking-tight leading-tight",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-600 dark:text-emerald-400",
									children: "আয়"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-900 dark:text-white",
									children: "-"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-600 dark:text-rose-400",
									children: "ব্যয়"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-slate-500 dark:!text-white font-medium tracking-wide",
							children: "স্মার্ট ব্যবস্থাপনা"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCloseDrawer,
						className: "p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer",
						"aria-label": "ড্রয়ার বন্ধ করুন",
						title: "ড্রয়ার বন্ধ করুন",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5 stroke-[2.5]" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 space-y-4 flex-1 overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-100 dark:bg-zinc-800/90 rounded-2xl p-3.5 border border-slate-200 dark:border-zinc-700/80 space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getMonthBengaliName(selectedMonth) }),
										isCurrentMonth ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold",
											children: "চলতি মাস"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold",
											children: "ইতিহাস"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1.5 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মোট আয়" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-slate-900 dark:text-white mt-0.5 truncate",
											children: formatCurrency(stats.totalIncome, currencySymbol)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1 text-[10px] text-rose-600 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মোট ব্যয়" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-slate-900 dark:text-white mt-0.5 truncate",
											children: formatCurrency(stats.totalExpense, currencySymbol)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1 text-[10px] text-indigo-600 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ব্যালেন্স" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: `text-xs font-black mt-0.5 truncate ${stats.netProfit >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400"}`,
											children: formatCurrency(stats.netProfit, currencySymbol)
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["হিসাবের মাস ", isAdminLoggedIn ? "(সবার ড্যাশবোর্ড)" : ""] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: selectedMonth,
									onChange: (e) => onMonthChange && onMonthChange(e.target.value),
									className: "flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden",
									children: availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: m,
										children: [
											getMonthBengaliName(m),
											" ",
											m === currentCalendarMonth ? "(চলতি মাস)" : "(ইতিহাস)"
										]
									}, m))
								}), !isCurrentMonth && onMonthChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onMonthChange(currentCalendarMonth),
									className: "px-2.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shrink-0 transition",
									title: "চলতি মাসে ফিরে যান",
									children: "চলতি মাস"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1",
								children: "অ্যাপ্লিকেশন পেজ ও ফিচার"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("staff"),
										className: `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${activeNav === "staff" ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-tight",
											children: "স্টাফ ও বেতন"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-slate-400 font-normal",
											children: "পেরোল হিসাব"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("transactions"),
										className: `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${activeNav === "transactions" ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-tight",
											children: "লেনদেন খতিয়ান"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-slate-400 font-normal",
											children: "আয়-ব্যয় বিবরণী"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("inventory"),
										className: `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${activeNav === "inventory" ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-tight",
											children: "মালামাল স্টক"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-slate-400 font-normal",
											children: "ONU ও তার ট্র্যাকিং"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleNav("analytics"),
										className: `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${activeNav === "analytics" ? "bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-tight",
											children: "চার্ট ও গ্রাফ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-slate-400 font-normal",
											children: "লাভ-ক্ষতি এনালাইসিস"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											onOpenReportModal();
										},
										className: `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${activeNav === "report" ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800" : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-tight",
											children: "মাসিক রিপোর্ট"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[9px] text-slate-400 font-normal",
											children: "স্টেটমেন্ট প্রিন্ট"
										})] })]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-white/95 dark:bg-slate-900/95 sticky bottom-0",
					children: [onToggleDarkMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onToggleDarkMode,
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer",
						children: [isDarkMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDarkMode ? "লাইট মোড" : "ডার্ক মোড" })]
					}), isAdminLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (onAdminLogout) onAdminLogout();
							handleCloseDrawer();
						},
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডমিন লগআউট" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							handleCloseDrawer();
							if (onOpenAdminLogin) onOpenAdminLogin();
						},
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডমিন লগইন" })]
					})]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "মোবাইল বটম নেভিগেশন",
		className: "sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] no-print",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between max-w-md mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleNav("dashboard"),
					className: `flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] min-h-[44px] cursor-pointer ${activeNav === "dashboard" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: `w-5 h-5 ${activeNav === "dashboard" ? "stroke-[2.5]" : "stroke-[1.75]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] mt-0.5",
						children: "হোম"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleNav("inventory"),
					className: `flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] min-h-[44px] cursor-pointer ${activeNav === "inventory" ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: `w-5 h-5 ${activeNav === "inventory" ? "stroke-[2.5]" : "stroke-[1.75]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] mt-0.5",
						children: "স্টক"
					})]
				}),
				isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleNav("new_entry"),
					className: "flex flex-col items-center justify-center min-w-[52px] min-h-[44px] -mt-4 group cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-5 h-5 stroke-[2.5]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold text-emerald-800 dark:text-emerald-400 mt-0.5",
						children: "এন্ট্রি"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handleNav("analytics"),
					className: `flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] min-h-[44px] cursor-pointer ${activeNav === "analytics" ? "text-cyan-600 dark:text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: `w-5 h-5 ${activeNav === "analytics" ? "stroke-[2.5]" : "stroke-[1.75]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] mt-0.5",
						children: "চার্ট"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleTriggerDrawerToggle,
					className: `flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] min-h-[44px] cursor-pointer ${showDrawer || activeNav === "staff" || activeNav === "transactions" || activeNav === "report" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
					"aria-label": "আরও মেনু অপশনসমূহ খুলুন",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] mt-0.5",
						children: "আরও"
					})]
				})
			]
		})
	})] });
};
//#endregion
//#region src/portals/ayByay/components/AdminLoginModal.tsx
var AdminLoginModal = ({ isOpen, onClose, onOpenMainLogin }) => {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick: onClose,
		className: "fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: "অনুমতি সীমাবদ্ধ (Read-Only)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400",
							children: "অ্যাডমিন বা অনুমোদিত সাব-অ্যাডমিন প্রয়োজন"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "সাধারণ ইউজার বা স্টাফ অ্যাকাউন্ট থেকে আয়-ব্যয় ডেটা যোগ, এডিট বা পরিবর্তন করা যাবে না। নতুন এন্ট্রি করতে মেইন লগইন পেইজ থেকে অ্যাডমিন বা আয়-ব্যয় পার্মিশনপ্রাপ্ত সাব-অ্যাডমিন আইডি দিয়ে লগইন করুন।" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-1 flex items-center justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer",
						children: "বন্ধ করুন"
					}), onOpenMainLogin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onClose();
							onOpenMainLogin();
						},
						className: "px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মেইন লগইন পেইজে যান" })]
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/portals/ayByay/components/InventoryManager.tsx
var CATEGORY_MAP = {
	onu: {
		label: "ONU (অপটিক্যাল ইউনিট)",
		icon: "📡",
		color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
	},
	router: {
		label: "WiFi রাউটার",
		icon: "📶",
		color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
	},
	cable: {
		label: "ফাইবার ও ড্রপ ক্যাবল",
		icon: "🧵",
		color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
	},
	splitter: {
		label: "পিএলসি স্প্লিটার",
		icon: "🔀",
		color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
	},
	accessories: {
		label: "প্যাচকর্ড / কানেক্টর / ক্ল্যাম্প",
		icon: "🔧",
		color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
	},
	stb: {
		label: "সেট-টপ বক্স (Dish STB)",
		icon: "📺",
		color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
	},
	other: {
		label: "অন্যান্য মালামাল",
		icon: "📦",
		color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
	}
};
function formatCleanDate$1(dateStr) {
	if (!dateStr) return "";
	const str = String(dateStr).trim();
	if (str.includes("GMT") || str.includes("Standard Time") || str.length > 20) try {
		const d = new Date(str);
		if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {}
	return str.split("T")[0].split(" ")[0];
}
var InventoryManager = ({ items, logs, onAddItem, onDeleteItem, onDeleteLog, onLogMovement, currencySymbol = "৳", onRefresh, isAdminLoggedIn = true, onRequireLogin, config = {
	companyName: "স্মার্ট ব্যবস্থাপনা",
	currencySymbol: "৳",
	autoSync: true,
	lastSyncTime: null,
	syncStatus: "idle"
}, selectedMonth = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7), onMonthChange, availableMonths = [], onOpenReportPage }) => {
	var _CATEGORY_MAP$itemToD, _CATEGORY_MAP$itemToD2, _CATEGORY_MAP$itemToD3;
	const [activeTab, setActiveTab] = (0, import_react.useState)("inventory");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [filterLowStock, setFilterLowStock] = (0, import_react.useState)(false);
	const [showItemModal, setShowItemModal] = (0, import_react.useState)(false);
	const [editingItem, setEditingItem] = (0, import_react.useState)(null);
	const [showMovementModal, setShowMovementModal] = (0, import_react.useState)(false);
	const [movementType, setMovementType] = (0, import_react.useState)("in");
	const [selectedItemForMovement, setSelectedItemForMovement] = (0, import_react.useState)(null);
	const [showQuickAddItem, setShowQuickAddItem] = (0, import_react.useState)(false);
	const [quickItemName, setQuickItemName] = (0, import_react.useState)("");
	const [quickItemCategory, setQuickItemCategory] = (0, import_react.useState)("onu");
	const [quickItemUnit, setQuickItemUnit] = (0, import_react.useState)("পিস");
	const [quickItemStock, setQuickItemStock] = (0, import_react.useState)("");
	const [quickItemMinStock, setQuickItemMinStock] = (0, import_react.useState)("5");
	const [quickItemCost, setQuickItemCost] = (0, import_react.useState)("");
	const [quickItemSupplier, setQuickItemSupplier] = (0, import_react.useState)("");
	const [quickItemLocation, setQuickItemLocation] = (0, import_react.useState)("");
	const [itemName, setItemName] = (0, import_react.useState)("");
	const [itemCategory, setItemCategory] = (0, import_react.useState)("onu");
	const [itemUnit, setItemUnit] = (0, import_react.useState)("পিস");
	const [itemStock, setItemStock] = (0, import_react.useState)("");
	const [itemMinStock, setItemMinStock] = (0, import_react.useState)("5");
	const [itemCost, setItemCost] = (0, import_react.useState)("");
	const [itemSupplier, setItemSupplier] = (0, import_react.useState)("");
	const [itemLocation, setItemLocation] = (0, import_react.useState)("");
	const [itemNotes, setItemNotes] = (0, import_react.useState)("");
	const [moveQty, setMoveQty] = (0, import_react.useState)("1");
	const [moveDate, setMoveDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [moveRecipient, setMoveRecipient] = (0, import_react.useState)("");
	const [moveCost, setMoveCost] = (0, import_react.useState)("0");
	const [moveAddToExpense, setMoveAddToExpense] = (0, import_react.useState)(true);
	const [moveExpenseCategory, setMoveExpenseCategory] = (0, import_react.useState)("ONU/OLT/Router ক্রয়");
	const [customMoveExpenseCategory, setCustomMoveExpenseCategory] = (0, import_react.useState)("");
	const [movePaymentMethod, setMovePaymentMethod] = (0, import_react.useState)("নগদ (Cash)");
	const [moveNote, setMoveNote] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const totalItemTypes = items.length;
	const lowStockCount = items.filter((i) => i.currentStock <= i.minStockAlert).length;
	const totalInventoryValue = items.reduce((acc, curr) => acc + curr.currentStock * curr.unitCost, 0);
	const currentMonthPrefix = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
	const thisMonthOutQty = logs.filter((l) => l.type === "out" && l.date.startsWith(currentMonthPrefix)).reduce((acc, curr) => acc + curr.quantity, 0);
	const filteredItems = items.filter((item) => {
		const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) || item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
		const matchesLow = filterLowStock ? item.currentStock <= item.minStockAlert : true;
		return matchesSearch && matchesCat && matchesLow;
	});
	const ensureAdmin = () => {
		if (isAdminLoggedIn === false) {
			if (onRequireLogin) onRequireLogin();
			return false;
		}
		return true;
	};
	const openItemModal = (item) => {
		if (!ensureAdmin()) return;
		if (item) {
			setEditingItem(item);
			setItemName(item.name);
			setItemCategory(item.category);
			setItemUnit(item.unit);
			setItemStock(item.currentStock);
			setItemMinStock(item.minStockAlert);
			setItemCost(item.unitCost);
			setItemSupplier(item.supplier || "");
			setItemLocation(item.location || "");
			setItemNotes(item.notes || "");
		} else {
			setEditingItem(null);
			setItemName("");
			setItemCategory("onu");
			setItemUnit("পিস");
			setItemStock("");
			setItemMinStock("5");
			setItemCost("");
			setItemSupplier("");
			setItemLocation("");
			setItemNotes("");
		}
		setShowItemModal(true);
	};
	const handleSaveItem = async (e) => {
		e.preventDefault();
		if (!ensureAdmin()) return;
		if (!itemName.trim()) return;
		setIsSubmitting(true);
		try {
			await onAddItem({
				id: editingItem === null || editingItem === void 0 ? void 0 : editingItem.id,
				name: itemName.trim(),
				category: itemCategory,
				unit: itemUnit,
				currentStock: Number(itemStock),
				minStockAlert: Number(itemMinStock),
				unitCost: Number(itemCost),
				supplier: itemSupplier.trim() || void 0,
				location: itemLocation.trim() || void 0,
				notes: itemNotes.trim() || void 0
			});
			setShowItemModal(false);
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};
	const openMovementModal = (type, item) => {
		if (!ensureAdmin()) return;
		setMovementType(type);
		const target = item || items[0] || null;
		setSelectedItemForMovement(target);
		setMoveQty("1");
		setMoveDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setMoveRecipient("");
		setMoveCost(target && target.unitCost ? target.unitCost : "");
		setMoveAddToExpense(type === "in");
		setShowQuickAddItem(false);
		setCustomMoveExpenseCategory("");
		if ((target === null || target === void 0 ? void 0 : target.category) === "cable") setMoveExpenseCategory("অপটিক্যাল ফাইবার ও কেবল");
		else if ((target === null || target === void 0 ? void 0 : target.category) === "onu" || (target === null || target === void 0 ? void 0 : target.category) === "router") setMoveExpenseCategory("ONU/OLT/Router ক্রয়");
		else setMoveExpenseCategory("স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ");
		setMovePaymentMethod("নগদ (Cash)");
		setMoveNote("");
		setShowMovementModal(true);
	};
	const handleQuickSaveItem = async () => {
		if (!ensureAdmin()) return;
		if (!quickItemName.trim()) return;
		setIsSubmitting(true);
		try {
			await onAddItem({
				name: quickItemName.trim(),
				category: quickItemCategory,
				unit: quickItemUnit,
				currentStock: Number(quickItemStock) || 0,
				minStockAlert: Number(quickItemMinStock) || 5,
				unitCost: Number(quickItemCost) || 0,
				supplier: quickItemSupplier.trim() || void 0,
				location: quickItemLocation.trim() || void 0
			});
			const createdItem = {
				id: `INV-${Date.now()}`,
				name: quickItemName.trim(),
				category: quickItemCategory,
				unit: quickItemUnit,
				currentStock: Number(quickItemStock) || 0,
				minStockAlert: Number(quickItemMinStock) || 5,
				unitCost: Number(quickItemCost) || 0,
				supplier: quickItemSupplier.trim() || void 0,
				location: quickItemLocation.trim() || void 0,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setSelectedItemForMovement(createdItem);
			setMoveCost(Number(quickItemCost) || 0);
			if (createdItem.category === "cable") setMoveExpenseCategory("অপটিক্যাল ফাইবার ও কেবল");
			else if (createdItem.category === "onu" || createdItem.category === "router") setMoveExpenseCategory("ONU/OLT/Router ক্রয়");
			else setMoveExpenseCategory("স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ");
			setQuickItemName("");
			setQuickItemStock("");
			setQuickItemCost("");
			setQuickItemSupplier("");
			setQuickItemLocation("");
			setShowQuickAddItem(false);
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSaveMovement = async (e) => {
		e.preventDefault();
		if (!ensureAdmin()) return;
		const numericQty = Number(moveQty) || 0;
		if (!selectedItemForMovement || numericQty <= 0) return;
		setIsSubmitting(true);
		try {
			const finalExpenseCategory = movementType === "in" && moveAddToExpense ? moveExpenseCategory === "অন্যান্য" ? customMoveExpenseCategory.trim() || "অন্যান্য ব্যয়" : moveExpenseCategory : void 0;
			await onLogMovement({
				itemId: selectedItemForMovement.id,
				type: movementType,
				quantity: numericQty,
				date: moveDate,
				recipientOrSource: moveRecipient.trim(),
				costPerUnit: Number(moveCost) || 0,
				addToExpense: movementType === "in" ? moveAddToExpense : false,
				expenseCategory: finalExpenseCategory,
				paymentMethod: movePaymentMethod,
				note: moveNote.trim()
			});
			setShowMovementModal(false);
		} catch (err) {
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};
	const [itemToDelete, setItemToDelete] = (0, import_react.useState)(null);
	const [logToDelete, setLogToDelete] = (0, import_react.useState)(null);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const requestDeleteItem = (item) => {
		if (!ensureAdmin()) return;
		setItemToDelete(item);
	};
	const handleConfirmDeleteItem = async () => {
		if (!itemToDelete) return;
		setIsDeleting(true);
		try {
			await onDeleteItem(itemToDelete.id);
			setItemToDelete(null);
			if (showItemModal && (editingItem === null || editingItem === void 0 ? void 0 : editingItem.id) === itemToDelete.id) setShowItemModal(false);
		} catch (err) {
			console.error("Delete item error:", err);
		} finally {
			setIsDeleting(false);
		}
	};
	const requestDeleteLog = (log) => {
		if (!ensureAdmin()) return;
		setLogToDelete(log);
	};
	const handleConfirmDeleteLog = async () => {
		if (!logToDelete || !onDeleteLog) return;
		setIsDeleting(true);
		try {
			await onDeleteLog(logToDelete.id);
			setLogToDelete(null);
		} catch (err) {
			console.error("Delete log error:", err);
		} finally {
			setIsDeleting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 sm:space-y-6 pb-20 sm:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight",
							children: "মালামাল ও ইকুইপমেন্ট স্টক (Inventory)"
						}), isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
							children: "এডমিন কন্ট্রোল সক্রিয়"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "ক্যাবল, ONU, রাউটার, স্প্লিটার ও নেটওয়ার্ক সরঞ্জামের সঠিক হিসাব, ক্রয় ও বিতরণ"
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openItemModal(),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন আইটেম যোগ" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openMovementModal("in"),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টক ইন (ক্রয়)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openMovementModal("out"),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মালামাল বিতরণ" })]
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenReportPage("stock"),
						className: "bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition active:scale-95",
						title: "ক্লিক করে সম্পূর্ণ পেজে মজুদ তালিকার আর্থিক রিপোর্ট দেখুন",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: "মোট আইটেম ধরন"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1",
								children: [
									totalItemTypes,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-slate-400",
										children: "প্রকার"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 flex items-center gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পূর্ণাঙ্গ পেজে দেখুন ➔" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							setActiveTab("inventory");
							setFilterLowStock(true);
						},
						className: `p-3.5 sm:p-4 rounded-3xl border shadow-xs transition cursor-pointer hover:scale-[1.01] active:scale-95 ${lowStockCount > 0 ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800" : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"}`,
						title: "ক্লিক করে কম স্টকযুক্ত মালামাল ফিল্টার করুন",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-amber-700 dark:text-amber-400",
									children: "কম স্টক সতর্কতা"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-200 mt-1",
								children: [
									lowStockCount,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-amber-600",
										children: "আইটেম"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-amber-800 dark:text-amber-300 font-bold mt-0.5",
								children: lowStockCount > 0 ? "⚠️ ফিল্টার করতে ক্লিক করুন" : "সব মালামাল পর্যাপ্ত আছে"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenReportPage("stock"),
						className: "bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition active:scale-95",
						title: "ক্লিক করে সম্পূর্ণ পেজে মজুদ মালামালের আর্থিক মূল্যায়ণ স্টেটমেন্ট দেখুন",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: "মজুদ মালামালের মূল্য"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1",
								children: [
									currencySymbol,
									" ",
									totalInventoryValue.toLocaleString("bn-BD")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পূর্ণাঙ্গ পেজে দেখুন ➔" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenReportPage("issued"),
						className: "bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-rose-400 dark:hover:border-rose-600 transition active:scale-95",
						title: "ক্লিক করে সম্পূর্ণ পেজে চলতি মাসের বিতরণকৃত মালামালের আর্থিক স্টেটমেন্ট দেখুন",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: "চলতি মাসে বিতরণ"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1",
								children: [
									thisMonthOutQty,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-slate-400",
										children: "ইউনিট"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5 flex items-center gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "পূর্ণাঙ্গ পেজে দেখুন ➔" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("inventory"),
						className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${activeTab === "inventory" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"মালামালের তালিকা (",
							items.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("history"),
						className: `flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${activeTab === "history" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"স্টক মুভমেন্ট ও বিতরণ হিস্ট্রি (",
							logs.length,
							")"
						] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: activeTab === "inventory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpenReportPage("stock"),
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer",
					title: "মজুদ মালামালের তালিকা মূল্য সহ আর্থিক রিপোর্ট ও স্টেটমেন্ট (PDF/প্রিন্ট)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📦 মজুদ মালামালের আর্থিক রিপোর্ট ও স্টেটমেন্ট (PDF/প্রিন্ট)" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpenReportPage("issued"),
					className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer",
					title: "চলতি মাসে বিতরণকৃত মালামালের তালিকা মূল্য সহ আর্থিক রিপোর্ট ও স্টেটমেন্ট (PDF/প্রিন্ট)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📤 বিতরণকৃত মালামালের আর্থিক রিপোর্ট ও স্টেটমেন্ট (PDF/প্রিন্ট)" })]
				}) })]
			}),
			activeTab === "inventory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "মালামালের নাম, সাপ্লায়ার অথবা লোকেশন দিয়ে খুঁজুন...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								className: "w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
							}),
							searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchQuery(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterLowStock(!filterLowStock),
						className: `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${filterLowStock ? "bg-amber-500 text-white shadow-xs" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["কম স্টক ", lowStockCount > 0 ? `(${lowStockCount})` : ""] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelectedCategory("all"),
						className: `px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${selectedCategory === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
						children: "সকল ক্যাটাগরি"
					}), Object.keys(CATEGORY_MAP).map((cat) => {
						const count = items.filter((i) => i.category === cat).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedCategory(cat),
							className: `inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CATEGORY_MAP[cat].icon }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CATEGORY_MAP[cat].label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] opacity-75",
									children: [
										"(",
										count,
										")"
									]
								})
							]
						}, cat);
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden",
				children: filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-slate-700 dark:text-slate-300",
							children: "কোন মালামাল পাওয়া যায়নি"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 mt-1",
							children: "খোঁজার ফিল্টার পরিবর্তন করুন অথবা নতুন মালামাল যোগ করুন"
						}),
						isAdminLoggedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => openItemModal(),
							className: "mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "নতুন মালামাল এন্ট্রি" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs sm:text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "মালামালের নাম ও বিবরণ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "ক্যাটাগরি"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-center",
									children: "বর্তমান স্টক"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "ইউনিট মূল্য"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "মোট মান"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "লোকেশন / তাক"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-center",
									children: "অ্যাকশন"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100 dark:divide-slate-800/80",
							children: [...filteredItems].sort((a, b) => {
								return (new Date(a.createdAt || a.updatedAt || a.id || 0).getTime() || 0) - (new Date(b.createdAt || b.updatedAt || b.id || 0).getTime() || 0);
							}).map((item) => {
								const isLow = item.currentStock <= item.minStockAlert;
								const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.other;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${isLow ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg",
													children: catInfo.icon
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-slate-900 dark:text-white leading-tight",
													children: item.name
												}), item.supplier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-slate-400",
													children: ["সাপ্লায়ার: ", item.supplier]
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-block px-2.5 py-1 rounded-xl text-[11px] font-semibold ${catInfo.color}`,
												children: catInfo.label
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-center whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-base font-black ${item.currentStock === 0 ? "text-rose-600 dark:text-rose-400" : isLow ? "text-amber-600 dark:text-amber-400" : "text-slate-800 dark:text-slate-200"}`,
														children: item.currentStock
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-slate-500 dark:text-slate-400",
														children: item.unit
													}),
													isLow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														title: `স্টক শেষ পর্যায়ে (সতর্কতা লেভেল: ${item.minStockAlert})`,
														className: "p-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5" })
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3.5 text-right font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap",
											children: [
												currencySymbol,
												" ",
												item.unitCost.toLocaleString("bn-BD")
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap",
											children: [
												currencySymbol,
												" ",
												(item.currentStock * item.unitCost).toLocaleString("bn-BD")
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap",
											children: item.location || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-center whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-center gap-1",
												children: isAdminLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => openMovementModal("in", item),
														title: "দ্রুত স্টক ইন (ক্রয়)",
														className: "p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 transition cursor-pointer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-3.5 h-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => openMovementModal("out", item),
														title: "গ্রাহক বা টেকনিশিয়ানকে দিন",
														className: "p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 transition cursor-pointer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => openItemModal(item),
														title: "মালামালের তথ্য ও স্টক পরিবর্তন করুন",
														className: "p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => requestDeleteItem(item),
														title: "আইটেম বাদ দিন / মুছুন",
														className: "p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/50 transition cursor-pointer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
													})
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-400 italic",
													children: "শুধুমাত্র এডমিন"
												})
											})
										})
									]
								}, item.id);
							})
						})]
					})
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-slate-900 dark:text-white",
						children: "স্টক মুভমেন্ট ও বিতরণ লগ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "প্রতিটি ক্রয়, বিতরণ, গ্রাহক ফেরত এবং ড্যামেজের রেকর্ড"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => openMovementModal("in"),
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মুভমেন্ট রেকর্ড" })]
					})]
				}), logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center text-slate-400",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-10 h-10 mx-auto mb-2 opacity-40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold",
							children: "এখনো কোনো স্টক হিস্ট্রি নেই"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs mt-1",
							children: "মালামাল ক্রয় বা বিতরণের সময় স্বয়ংক্রিয়ভাবে এখানে লগ সংরক্ষিত হবে"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs sm:text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "তারিখ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "ধরন"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "মালামাল"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-center",
									children: "পরিমাণ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "প্রাপক / উৎস (গ্রাহক বা টেকনিশিয়ান)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "মূল্য (৳)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "নোট"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-center",
									children: "অ্যাকশন"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100 dark:divide-slate-800/80",
							children: [...logs].sort((a, b) => {
								const dA = new Date(a.date).getTime() || 0;
								const dB = new Date(b.date).getTime() || 0;
								if (dA !== dB) return dA - dB;
								return (new Date(a.createdAt || 0).getTime() || 0) - (new Date(b.createdAt || 0).getTime() || 0);
							}).map((log) => {
								let typeBadge = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-3 h-3" }), " স্টক ইন (ক্রয়)"]
								});
								if (log.type === "out") typeBadge = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3" }), " বিতরণ (আউট)"]
								});
								else if (log.type === "return") typeBadge = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-bold text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3" }), " গ্রাহক ফেরত"]
								});
								else if (log.type === "damaged") typeBadge = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3 h-3" }), " নষ্ট / ক্ষতি"]
								});
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium",
											children: formatCleanDate$1(log.date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 whitespace-nowrap",
											children: typeBadge
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 font-bold text-slate-900 dark:text-white",
											children: log.itemName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-center font-black text-slate-800 dark:text-slate-200",
											children: log.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-slate-700 dark:text-slate-300",
											children: log.recipientOrSource || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-right font-medium text-slate-900 dark:text-white whitespace-nowrap",
											children: log.totalCost && log.totalCost > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												currencySymbol,
												" ",
												log.totalCost.toLocaleString("bn-BD")
											] }), log.addedToExpense && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] text-emerald-600 dark:text-emerald-400",
												children: "✓ ব্যয় খতিয়ানে যুক্ত"
											})] }) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-slate-500 dark:text-slate-400 text-xs",
											children: log.note || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => requestDeleteLog(log),
												title: "লগ ডিলিট ও স্টক ব্যালেন্স সমন্বয়",
												className: "p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/50 transition cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})
										})
									]
								}, log.id);
							})
						})]
					})
				})]
			}),
			showItemModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold text-slate-900 dark:text-white leading-tight",
								children: editingItem ? "মালামালের তথ্য ও স্টক পরিবর্তন করুন" : "নতুন নেটওয়ার্ক মালামাল যোগ করুন"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400",
								children: editingItem ? "তথ্য আপডেট করুন অথবা প্রয়োজনে বর্তমান স্টক ব্যালেন্স সংশোধন করুন" : "নেটওয়ার্ক মালামালের বিবরণ ও প্রাথমিক স্টক সেট করুন"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowItemModal(false),
							className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveItem,
						className: "flex-1 flex flex-col min-h-0 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-4 overflow-y-auto space-y-4 flex-1 overscroll-contain",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "মালামালের নাম *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "যেমন: XPON Dual Band ONU, 2-Core ড্রপ ফাইবার ক্যাবল...",
									value: itemName,
									onChange: (e) => setItemName(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: "ক্যাটাগরি"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: itemCategory,
										onChange: (e) => setItemCategory(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none",
										children: Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: cat,
											children: CATEGORY_MAP[cat].label
										}, cat))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: "একক (Unit)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: itemUnit,
										onChange: (e) => setItemUnit(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "পিস",
												children: "পিস (Pieces)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "মিটার",
												children: "মিটার (Meter)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "কয়েল",
												children: "কয়েল (Coil/Drum)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "বক্স",
												children: "বক্স (Box)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "রোল",
												children: "রোল (Roll)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "সেট",
												children: "সেট (Set)"
											})
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: "বর্তমান স্টক"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											placeholder: "0",
											value: itemStock,
											onChange: (e) => setItemStock(e.target.value),
											className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: "কম স্টক সতর্কতা লেভেল"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											placeholder: "5",
											value: itemMinStock,
											onChange: (e) => setItemMinStock(e.target.value),
											className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: "ইউনিট ক্রয়মূল্য (৳)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											step: "any",
											placeholder: "0",
											value: itemCost,
											onChange: (e) => setItemCost(e.target.value),
											className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: "সাপ্লায়ার / দোকান"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "যেমন: স্টার নেটওয়ার্ক",
										value: itemSupplier,
										onChange: (e) => setItemSupplier(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: "রাখার স্থান (তাক/র‌্যাক)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "যেমন: তাক-২, বক্স-এ",
										value: itemLocation,
										onChange: (e) => setItemLocation(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "নোট / রিমার্কস"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									placeholder: "অন্যান্য প্রয়োজনীয় তথ্য...",
									value: itemNotes,
									onChange: (e) => setItemNotes(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 backdrop-blur-xs shrink-0 flex items-center justify-between gap-2.5",
							children: [editingItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => requestDeleteItem(editingItem),
								className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold transition active:scale-95 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "আইটেম মুছুন" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowItemModal(false),
									className: "px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer",
									children: "বাতিল"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting,
									className: "px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer",
									children: isSubmitting ? "সংরক্ষণ হচ্ছে..." : editingItem ? "আপডেট সম্পন্ন করুন" : "যোগ করুন"
								})]
							})]
						})]
					})]
				})
			}),
			showMovementModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [movementType === "in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-5 h-5" })
							}) : movementType === "out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-2 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-5 h-5" })
							}) : movementType === "return" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-2 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-5 h-5" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-bold leading-tight",
								children: movementType === "in" ? "নতুন মালামাল স্টক ইন (ক্রয়)" : movementType === "out" ? "মালামাল বিতরণ / স্টক আউট" : movementType === "return" ? "গ্রাহক বা টেকনিশিয়ান হতে মালামাল ফেরত" : "নষ্ট বা ড্যামেজ হিসেবে এন্ট্রি"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400",
								children: movementType === "in" ? "নতুন কেনা মালামাল স্টকে যুক্ত করুন ও চাইলে এক ক্লিকে ব্যয়ে যোগ করুন" : movementType === "out" ? "গ্রাহকের সংযোগ বা টেকনিশিয়ানকে মালামাল প্রদানের হিসাব" : movementType === "return" ? "কানেকশন বিচ্ছিন্ন বা ত্রুটিপূর্ণ রাউটার/ONU ফেরত" : "নষ্ট বা ক্ষতিগ্রস্ত মালামাল স্টক থেকে বাদ দিন"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowMovementModal(false),
							className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveMovement,
						className: "flex-1 flex flex-col min-h-0 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-4 overflow-y-auto space-y-4 flex-1 overscroll-contain",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setMovementType("in");
												setMoveAddToExpense(true);
											},
											className: `py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${movementType === "in" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
											children: "স্টক ইন"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setMovementType("out");
												setMoveAddToExpense(false);
											},
											className: `py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${movementType === "out" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
											children: "বিতরণ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setMovementType("return");
												setMoveAddToExpense(false);
											},
											className: `py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${movementType === "return" ? "bg-amber-500 text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
											children: "ফেরত"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setMovementType("damaged");
												setMoveAddToExpense(false);
											},
											className: `py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${movementType === "damaged" ? "bg-slate-700 text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
											children: "নষ্ট"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-bold text-slate-700 dark:text-slate-300",
												children: "মালামাল নির্বাচন করুন *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setShowQuickAddItem((prev) => !prev),
												className: "inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 transition active:scale-95 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showQuickAddItem ? "ফর্ম বন্ধ" : "+ নতুন মালামাল তৈরি করুন" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											required: true,
											value: (selectedItemForMovement === null || selectedItemForMovement === void 0 ? void 0 : selectedItemForMovement.id) || "",
											onChange: (e) => {
												if (e.target.value === "__NEW__") {
													setShowQuickAddItem(true);
													return;
												}
												const found = items.find((i) => i.id === e.target.value);
												setSelectedItemForMovement(found || null);
												if (found) {
													setMoveCost(found.unitCost);
													if (found.category === "cable") setMoveExpenseCategory("অপটিক্যাল ফাইবার ও কেবল");
													else if (found.category === "onu" || found.category === "router") setMoveExpenseCategory("ONU/OLT/Router ক্রয়");
													else setMoveExpenseCategory("স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ");
												}
											},
											className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none",
											children: [
												items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "-- কোনো মালামাল নেই, নতুন যোগ করুন --"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													disabled: true,
													children: "-- মালামাল নির্বাচন করুন --"
												}),
												items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: item.id,
													children: [
														item.name,
														" — বর্তমান মজুদ: ",
														item.currentStock,
														" ",
														item.unit,
														" (",
														currencySymbol,
														item.unitCost,
														")"
													]
												}, item.id)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "__NEW__",
													className: "font-bold text-indigo-600 dark:text-indigo-400",
													children: "➕ নতুন মালামাল তৈরি করুন..."
												})
											]
										}),
										showQuickAddItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), "এডমিন: নতুন মালামাল দ্রুত লিস্টে যোগ করুন"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setShowQuickAddItem(false),
														className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
													children: "মালামালের নাম *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													placeholder: "যেমন: 4-Port GPON ONU / ২-কোর ড্রপ ক্যাবল...",
													value: quickItemName,
													onChange: (e) => setQuickItemName(e.target.value),
													className: "w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "ক্যাটাগরি"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														value: quickItemCategory,
														onChange: (e) => setQuickItemCategory(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-900 dark:text-white outline-none",
														children: Object.keys(CATEGORY_MAP).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: cat,
															children: CATEGORY_MAP[cat].label
														}, cat))
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "একক (Unit)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: quickItemUnit,
														onChange: (e) => setQuickItemUnit(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-900 dark:text-white outline-none",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "পিস",
																children: "পিস (Pieces)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "মিটার",
																children: "মিটার (Meter)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "কয়েল",
																children: "কয়েল (Coil/Drum)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "বক্স",
																children: "বক্স (Box)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "রোল",
																children: "রোল (Roll)"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "সেট",
																children: "সেট (Set)"
															})
														]
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "ইউনিট ক্রয়মূল্য (৳)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: "0",
														step: "any",
														placeholder: "0",
														value: quickItemCost,
														onChange: (e) => setQuickItemCost(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "প্রারম্ভিক স্টক (ঐচ্ছিক)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: "0",
														step: "any",
														placeholder: "0",
														value: quickItemStock,
														onChange: (e) => setQuickItemStock(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "সাপ্লায়ার / দোকান"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "যেমন: স্টার নেটওয়ার্ক",
														value: quickItemSupplier,
														onChange: (e) => setQuickItemSupplier(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-900 dark:text-white outline-none"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
														children: "রাখার স্থান / তাক"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "যেমন: তাক-১, বক্স-বি",
														value: quickItemLocation,
														onChange: (e) => setQuickItemLocation(e.target.value),
														className: "w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-900 dark:text-white outline-none"
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-end gap-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/60",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setShowQuickAddItem(false),
														className: "px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
														children: "বাতিল"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: handleQuickSaveItem,
														disabled: !quickItemName.trim() || isSubmitting,
														className: "px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs disabled:opacity-50 active:scale-95",
														children: "সংরক্ষণ ও নির্বাচন করুন"
													})]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
											children: [
												"পরিমাণ (",
												(selectedItemForMovement === null || selectedItemForMovement === void 0 ? void 0 : selectedItemForMovement.unit) || "একক",
												") *"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0.01",
											step: "any",
											required: true,
											placeholder: "পরিমাণ টাইপ করুন",
											value: moveQty,
											onChange: (e) => setMoveQty(e.target.value),
											className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
										}),
										movementType === "out" && selectedItemForMovement && (Number(moveQty) || 0) > selectedItemForMovement.currentStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-rose-500 font-bold mt-1",
											children: [
												"⚠️ বর্তমান স্টক (",
												selectedItemForMovement.currentStock,
												" ",
												selectedItemForMovement.unit,
												") থেকে বেশি দেওয়া হচ্ছে!"
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
										children: "তারিখ"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										required: true,
										value: moveDate,
										onChange: (e) => setMoveDate(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: [movementType === "in" ? "সরবরাহকারী / দোকান (Supplier)" : movementType === "out" ? "প্রাপক: গ্রাহকের নাম / লাইনম্যান টেকনিশিয়ান" : movementType === "return" ? "কার নিকট হতে ফেরত (গ্রাহক বা টেকনিশিয়ান)" : "নষ্ট হওয়ার কারণ / বিবরণ", " *"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: movementType === "in" ? "যেমন: অপটিক্যাল টেক, ঢাকা" : movementType === "out" ? "যেমন: গ্রাহক: জাহিদ হাসান (লাইন-৪) অথবা লাইনম্যান: কালাম" : movementType === "return" ? "যেমন: লাইন কাটা গ্রাহক: রফিক আহমেদ" : "যেমন: বজ্রপাতে পোর্ট পুড়ে গেছে",
									value: moveRecipient,
									onChange: (e) => setMoveRecipient(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
								})] }),
								movementType === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 sm:p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1",
												children: "ইউনিট মূল্য (৳)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												step: "any",
												placeholder: "0",
												value: moveCost,
												onChange: (e) => setMoveCost(e.target.value),
												className: "w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-sm font-bold text-slate-900 dark:text-white outline-none"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-1",
												children: "মোট ক্রয়মূল্য"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-sm font-black text-indigo-950 dark:text-indigo-200",
												children: [
													currencySymbol,
													" ",
													((Number(moveCost) || 0) * (Number(moveQty) || 0)).toLocaleString("bn-BD")
												]
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-start gap-2 cursor-pointer pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: moveAddToExpense,
												onChange: (e) => setMoveAddToExpense(e.target.checked),
												className: "mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-indigo-950 dark:text-indigo-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: "সরাসরি কোম্পানির ব্যয় (Expense) ও ক্লাউড ব্যাকআপে যুক্ত করুন"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-indigo-700 dark:text-indigo-400",
													children: "আলাদা করে এন্ট্রি দিতে হবে না, স্বয়ংক্রিয়ভাবে লেনদেন খতিয়ানে এবং আপনার ক্লাউড ব্যাকআপে ব্যয় হিসেবে যুক্ত হবে"
												})]
											})]
										}),
										moveAddToExpense && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
													children: "ব্যয় ক্যাটাগরি"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: moveExpenseCategory,
													onChange: (e) => setMoveExpenseCategory(e.target.value),
													className: "w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ONU/OLT/Router ক্রয়",
															children: "ONU/OLT/Router ক্রয়"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "অপটিক্যাল ফাইবার ও কেবল",
															children: "অপটিক্যাল ফাইবার ও কেবল"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ",
															children: "স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "সার্ভার ও নেটওয়ার্ক রক্ষণাবেক্ষণ",
															children: "সার্ভার ও রক্ষণাবেক্ষণ"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ব্যান্ডউইথ / আপস্ট্রিম খরচ",
															children: "ব্যান্ডউইথ / আপস্ট্রিম খরচ"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "অন্যান্য",
															children: "অন্যান্য (কাস্টম টাইপ করুন)"
														})
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
													children: "পেমেন্ট মাধ্যম"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: movePaymentMethod,
													onChange: (e) => setMovePaymentMethod(e.target.value),
													className: "w-full px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "নগদ (Cash)",
															children: "নগদ (Cash)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "বিকাশ (bKash)",
															children: "বিকাশ (bKash)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "নগদ (Nagad)",
															children: "নগদ (Nagad)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ব্যাংক (Bank)",
															children: "ব্যাংক (Bank)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "বকেয়া (Due)",
															children: "বকেয়া (Due)"
														})
													]
												})] })]
											}), moveExpenseCategory === "অন্যান্য" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 animate-in fade-in slide-in-from-top-1 duration-150",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-1",
													children: "কাস্টম ব্যয়ের খাতের নাম লিখুন *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													placeholder: "যেমন: অপটিক্যাল ফিউশন স্লীভ, ড্রপ ওয়্যার ক্ল্যাম্প ইত্যাদি...",
													value: customMoveExpenseCategory,
													onChange: (e) => setCustomMoveExpenseCategory(e.target.value),
													className: "w-full px-3 py-1.5 rounded-lg bg-indigo-50/50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
									children: "নোট / ম্যাক অ্যাড্রেস / সিরিয়াল নম্বর"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "যেমন: MAC: E0:67:B3:... অথবা ক্যাবল ড্রাম নং বা ভাউচার",
									value: moveNote,
									onChange: (e) => setMoveNote(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 backdrop-blur-xs shrink-0 flex items-center justify-end gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowMovementModal(false),
								className: "px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition",
								children: "বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: `px-5 py-2.5 rounded-2xl text-white text-xs font-bold transition shadow-md active:scale-95 disabled:opacity-50 ${movementType === "in" ? "bg-emerald-600 hover:bg-emerald-700" : movementType === "out" ? "bg-rose-600 hover:bg-rose-700" : movementType === "return" ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-700 hover:bg-slate-800"}`,
								children: isSubmitting ? "প্রসেসিং..." : "কনফার্ম করুন"
							})]
						})]
					})]
				})
			}),
			itemToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200",
				onClick: () => !isDeleting && setItemToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl border border-rose-100 dark:border-rose-950/60 text-slate-900 dark:text-white p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-150",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => !isDeleting && setItemToDelete(null),
							className: "absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3.5 border border-rose-200/60 dark:border-rose-900/60 shadow-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-7 h-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-center text-slate-900 dark:text-white",
							children: "মালামাল তালিকা থেকে মুছে ফেলবেন?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-center text-slate-500 dark:text-slate-400 mt-1",
							children: "এই পদক্ষেপটি মালামাল ও তার বর্তমান মজুদ স্টক রেকর্ড সফটওয়্যার থেকে স্থায়ীভাবে মুছে ফেলবে।"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl",
										children: ((_CATEGORY_MAP$itemToD = CATEGORY_MAP[itemToDelete.category]) === null || _CATEGORY_MAP$itemToD === void 0 ? void 0 : _CATEGORY_MAP$itemToD.icon) || "📦"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-slate-900 dark:text-white text-sm leading-tight",
										children: itemToDelete.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-block px-2 py-0.5 mt-0.5 rounded-lg text-[10px] font-semibold ${((_CATEGORY_MAP$itemToD2 = CATEGORY_MAP[itemToDelete.category]) === null || _CATEGORY_MAP$itemToD2 === void 0 ? void 0 : _CATEGORY_MAP$itemToD2.color) || "bg-slate-100 text-slate-700"}`,
										children: ((_CATEGORY_MAP$itemToD3 = CATEGORY_MAP[itemToDelete.category]) === null || _CATEGORY_MAP$itemToD3 === void 0 ? void 0 : _CATEGORY_MAP$itemToD3.label) || "অন্যান্য"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px]",
											children: "বর্তমান স্টক"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-black text-rose-600 dark:text-rose-400 text-sm",
											children: [
												itemToDelete.currentStock,
												" ",
												itemToDelete.unit
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 block text-[11px]",
											children: "মজুদ মূল্য"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-black text-slate-900 dark:text-white text-sm",
											children: [
												currencySymbol,
												" ",
												(itemToDelete.currentStock * itemToDelete.unitCost).toLocaleString("bn-BD")
											]
										})]
									})]
								}),
								(itemToDelete.supplier || itemToDelete.location) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-slate-500 dark:text-slate-400 pt-0.5",
									children: [
										itemToDelete.supplier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["সাপ্লায়ার: ", itemToDelete.supplier] }),
										itemToDelete.supplier && itemToDelete.location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " • " }),
										itemToDelete.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["তাক/লোকেশন: ", itemToDelete.location] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-3 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 text-xs mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: "১টি ডেটাবেস নোটিশ:"
								}),
								" আপনার ক্লাউড ডেটাবেসটি সার্বিক ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "আয়-ব্যয় হিসাব" }),
								" রাখার জন্য সংরক্ষিত। এই মালামাল তালিকা মুছলেও আপনার ডেটাবেসের বিদ্যমান আয়-ব্যয় লেনদেন সম্পূর্ণ অক্ষত ও সুরক্ষিত থাকবে।"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setItemToDelete(null),
								disabled: isDeleting,
								className: "flex-1 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer",
								children: "না, বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleConfirmDeleteItem,
								disabled: isDeleting,
								className: "flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold transition shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50",
								children: isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মুছে ফেলা হচ্ছে..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "হ্যাঁ, মুছে ফেলুন" })] })
							})]
						})
					]
				})
			}),
			logToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200",
				onClick: () => !isDeleting && setLogToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl border border-amber-100 dark:border-amber-950/60 text-slate-900 dark:text-white p-5 sm:p-6 my-auto animate-in zoom-in-95 duration-150",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => !isDeleting && setLogToDelete(null),
							className: "absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3.5 border border-amber-200/60 dark:border-amber-900/60 shadow-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-7 h-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-center text-slate-900 dark:text-white",
							children: "স্টক মুভমেন্ট লগ মুছবেন?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-center text-slate-500 dark:text-slate-400 mt-1",
							children: "এই রেকর্ডটি মুছে ফেললে স্টক ব্যালেন্স স্বয়ংক্রিয়ভাবে সমন্বয় (Rollback) হবে।"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-700 dark:text-slate-300",
										children: "মালামালের নাম:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-slate-900 dark:text-white text-sm",
										children: logToDelete.itemName
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 dark:text-slate-400",
										children: "মুভমেন্টের ধরন:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: logToDelete.type === "in" ? "স্টক ইন (ক্রয়)" : logToDelete.type === "out" ? "বিতরণ (স্টক আউট)" : logToDelete.type === "return" ? "গ্রাহক ফেরত" : "নষ্ট / ক্ষতি"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 dark:text-slate-400",
										children: "পরিমাণ:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 dark:text-white",
										children: logToDelete.quantity
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 dark:text-slate-400",
										children: "তারিখ:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-800 dark:text-slate-200",
										children: logToDelete.date
									})]
								}),
								logToDelete.recipientOrSource && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500 dark:text-slate-400",
										children: "প্রাপক / উৎস:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-800 dark:text-slate-200",
										children: logToDelete.recipientOrSource
									})]
								}),
								logToDelete.totalCost && logToDelete.totalCost > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-1 text-emerald-600 dark:text-emerald-400 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মোট খরচ:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										currencySymbol,
										" ",
										logToDelete.totalCost.toLocaleString("bn-BD"),
										" ",
										logToDelete.addedToExpense ? "(ব্যয় খতিয়ানভুক্ত)" : ""
									] })]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 text-xs mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "মুছে ফেলার পর সংশ্লিষ্ট মালামালের স্টক পূর্বাবস্থায় সমন্বয় হবে। যদি এটি কোম্পানির ব্যয়ে যুক্ত হয়ে থাকে, তবে আয়-ব্যয় খতিয়ান থেকেও সেটি স্বয়ংক্রিয়ভাবে বাদ যাবে।" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLogToDelete(null),
								disabled: isDeleting,
								className: "flex-1 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer",
								children: "না, বাতিল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleConfirmDeleteLog,
								disabled: isDeleting,
								className: "flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold transition shadow-md shadow-amber-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50",
								children: isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মুছে ফেলা হচ্ছে..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "হ্যাঁ, লগ মুছুন" })] })
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/InventoryReportPage.tsx
function formatCleanDate(dateStr) {
	if (!dateStr) return "";
	const str = String(dateStr).trim();
	if (str.includes("GMT") || str.includes("Standard Time") || str.length > 20) try {
		const d = new Date(str);
		if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {}
	return str.split("T")[0].split(" ")[0];
}
var InventoryReportPage = ({ onBack, items = [], logs = [], config, selectedMonth, onMonthChange, currencySymbol = "৳", availableMonths = [], initialTab = "stock" }) => {
	const [activeTab, setActiveTab] = (0, import_react.useState)(initialTab);
	import_react.useEffect(() => {
		if (initialTab) setActiveTab(initialTab);
	}, [initialTab]);
	const monthIssuedLogs = (0, import_react.useMemo)(() => {
		return logs.filter((l) => l && l.type === "out" && typeof l.date === "string" && l.date.startsWith(selectedMonth));
	}, [logs, selectedMonth]);
	const totalStockQuantity = (0, import_react.useMemo)(() => {
		return items.reduce((acc, curr) => acc + (Number(curr.currentStock) || 0), 0);
	}, [items]);
	const totalStockValue = (0, import_react.useMemo)(() => {
		return items.reduce((acc, curr) => acc + (Number(curr.currentStock) || 0) * (Number(curr.unitCost) || 0), 0);
	}, [items]);
	const lowStockCount = (0, import_react.useMemo)(() => {
		return items.filter((i) => i.currentStock <= i.minStockAlert).length;
	}, [items]);
	const categoryStockBreakdown = (0, import_react.useMemo)(() => {
		const map = {};
		items.forEach((i) => {
			const cat = i.category || "other";
			if (!map[cat]) map[cat] = {
				count: 0,
				qty: 0,
				value: 0
			};
			map[cat].count += 1;
			map[cat].qty += Number(i.currentStock) || 0;
			map[cat].value += (Number(i.currentStock) || 0) * (Number(i.unitCost) || 0);
		});
		return map;
	}, [items]);
	const totalIssuedQty = (0, import_react.useMemo)(() => {
		return monthIssuedLogs.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
	}, [monthIssuedLogs]);
	const totalIssuedValue = (0, import_react.useMemo)(() => {
		return monthIssuedLogs.reduce((acc, curr) => acc + (Number(curr.totalCost) || (Number(curr.quantity) || 0) * (Number(curr.costPerUnit) || 0)), 0);
	}, [monthIssuedLogs]);
	const recipientIssuedBreakdown = (0, import_react.useMemo)(() => {
		const map = {};
		monthIssuedLogs.forEach((l) => {
			const rec = l.recipientOrSource || "সাধারণ বিতরণ";
			if (!map[rec]) map[rec] = {
				count: 0,
				qty: 0,
				value: 0
			};
			map[rec].count += 1;
			map[rec].qty += Number(l.quantity) || 0;
			map[rec].value += Number(l.totalCost) || (Number(l.quantity) || 0) * (Number(l.costPerUnit) || 0);
		});
		return map;
	}, [monthIssuedLogs]);
	const handlePrint = () => {
		window.print();
	};
	const getCategoryLabel = (cat) => {
		switch (cat) {
			case "onu": return "ONU (অপটিক্যাল ইউনিট)";
			case "router": return "WiFi রাউটার";
			case "cable": return "ফাইবার ও ড্রপ ক্যাবল";
			case "splitter": return "পিএলসি স্প্লিটার";
			case "accessories": return "প্যাচকর্ড / কানেক্টর";
			case "stb": return "সেট-টপ বক্স (STB)";
			default: return "অন্যান্য মালামাল";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-in fade-in duration-200 space-y-5 pb-12 print:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onBack,
						className: "p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "স্টকে ফিরে যান" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight",
							children: "মালামাল স্টক ও বিতরণ আর্থিক রিপোর্ট"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: "মজুদ মালামালের বর্তমান আর্থিক মূল্য এবং মাসিক বিতরণের বিস্তারিত স্টেটমেন্ট"
						})] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handlePrint,
					className: "px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "রিপোর্ট প্রিন্ট / PDF সংরক্ষণ" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveTab("stock"),
						className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "stock" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"১. বর্তমান মজুদ মালামাল (",
							items.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveTab("issued"),
						className: `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === "issued" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"২. মাসিক বিতরণকৃত মালামাল (",
							monthIssuedLogs.length,
							")"
						] })]
					})]
				}), activeTab === "issued" && onMonthChange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-slate-500 dark:text-slate-400",
						children: "বিতরণের মাস:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedMonth,
						onChange: (e) => onMonthChange(e.target.value),
						className: "px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 outline-none",
						children: availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m,
							children: getMonthBengaliName(m)
						}, m))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center border-b-2 border-slate-800 pb-5 mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900 dark:text-white print:text-black",
								children: config.companyName || "স্মার্ট ব্যবস্থাপনা"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 print:text-slate-800 mt-1",
								children: activeTab === "stock" ? "মজুদ মালামাল ও স্টকের আর্থিক মূল্যায়ন রিপোর্ট" : `${getMonthBengaliName(selectedMonth)} মাসের বিতরণকৃত মালামালের বিবরণী ও খরচের রিপোর্ট`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1",
								children: ["প্রস্তুতের তারিখ: ", (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD", {
									year: "numeric",
									month: "long",
									day: "numeric"
								})]
							})
						]
					}),
					activeTab === "stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-indigo-700 dark:text-indigo-400 print:text-slate-700 block",
											children: "মোট আইটেমের ধরন"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black",
											children: [items.length, " টি"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-950 dark:text-blue-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-blue-700 dark:text-blue-400 print:text-slate-700 block",
											children: "মোট মজুদ পরিমাণ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black",
											children: [totalStockQuantity.toLocaleString("bn-BD"), " একক"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-emerald-700 dark:text-emerald-400 print:text-slate-700 block",
											children: "মোট স্টক আর্থিক মূল্যায়ণ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl font-black text-emerald-600 dark:text-emerald-400 print:text-black",
											children: formatCurrency(totalStockValue, currencySymbol)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-amber-700 dark:text-amber-400 print:text-slate-700 block",
											children: "কম স্টক সতর্কতা"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black text-amber-600 dark:text-amber-400 print:text-black",
											children: [lowStockCount, " টি"]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-4 h-4 text-indigo-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মজুদ মালামালের বিস্তারিত তালিকা" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs sm:text-sm border-collapse",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 print:bg-slate-200 print:text-black font-bold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "ক্রম"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "মালামালের নাম"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "ক্যাটাগরি"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-center",
													children: "বর্তমান মজুদ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-right",
													children: "ইউনিট ক্রয়মূল্য"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-right",
													children: "মোট মজুদ মূল্য"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-center",
													children: "অবস্থা"
												})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-300",
											children: [...items].sort((a, b) => {
												return (new Date(a.createdAt || a.updatedAt || a.id || 0).getTime() || 0) - (new Date(b.createdAt || b.updatedAt || b.id || 0).getTime() || 0);
											}).map((item, index) => {
												const isLow = item.currentStock <= item.minStockAlert;
												const itemVal = item.currentStock * item.unitCost;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-slate-500 font-bold",
															children: index + 1
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-3 font-bold text-slate-900 dark:text-white print:text-black",
															children: [item.name, item.supplier && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "block text-[11px] text-slate-400",
																children: ["সাপ্লায়ার: ", item.supplier]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-slate-600 dark:text-slate-300",
															children: getCategoryLabel(item.category)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-3 text-center font-black text-slate-900 dark:text-white print:text-black",
															children: [
																item.currentStock,
																" ",
																item.unit
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-right font-medium",
															children: formatCurrency(item.unitCost, currencySymbol)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-right font-bold text-emerald-600 dark:text-emerald-400 print:text-black",
															children: formatCurrency(itemVal, currencySymbol)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-center",
															children: isLow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold",
																children: "কম মজুদ ⚠️"
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold",
																children: "পর্যাপ্ত ✓"
															})
														})
													]
												}, item.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
											className: "bg-slate-100/90 dark:bg-slate-800/90 font-black text-slate-900 dark:text-white print:bg-slate-200 print:text-black",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 3,
													className: "p-3 text-right",
													children: "সর্বমোট:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3 text-center",
													children: [totalStockQuantity, " একক"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right",
													children: "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right text-emerald-700 dark:text-emerald-300 print:text-black text-base",
													children: formatCurrency(totalStockValue, currencySymbol)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-center",
													children: "-"
												})
											] })
										})
									]
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-indigo-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ক্যাটাগরি ভিত্তিক মোট স্টক সামারি" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
								children: Object.keys(categoryStockBreakdown).map((cat) => {
									const data = categoryStockBreakdown[cat];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-slate-800 dark:text-slate-200 print:text-black block",
											children: getCategoryLabel(cat)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-slate-500 dark:text-slate-400",
											children: [
												data.count,
												" প্রকার • মোট ",
												data.qty,
												" একক"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-sm text-emerald-600 dark:text-emerald-400 print:text-black",
											children: formatCurrency(data.value, currencySymbol)
										})]
									}, cat);
								})
							})] })
						]
					}),
					activeTab === "issued" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-950 dark:text-rose-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-rose-700 dark:text-rose-400 print:text-slate-700 block",
											children: "মোট বিতরণ সংখ্যা (লগ)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black",
											children: [monthIssuedLogs.length, " বার"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-amber-700 dark:text-amber-400 print:text-slate-700 block",
											children: "মোট বিতরণকৃত পরিমাণ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xl font-black",
											children: [totalIssuedQty.toLocaleString("bn-BD"), " একক"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200 print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-indigo-700 dark:text-indigo-400 print:text-slate-700 block",
											children: "বিতরণকৃত মালামালের আর্থিক মূল্য"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl font-black text-rose-600 dark:text-rose-400 print:text-black",
											children: formatCurrency(totalIssuedValue, currencySymbol)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4 text-rose-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [getMonthBengaliName(selectedMonth), " মাসে বিতরণকৃত মালামালের বিবরণী"] })]
							}), monthIssuedLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center p-10 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium",
									children: "এই মাসে কোনো মালামাল বিতরণ করা হয়নি।"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 print:border-slate-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs sm:text-sm border-collapse",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 print:bg-slate-200 print:text-black font-bold",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "তারিখ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "মালামালের নাম"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-center",
													children: "পরিমাণ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-right",
													children: "ইউনিট মূল্য"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b text-right",
													children: "মোট আর্থিক মূল্য"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "প্রাপক / লাইনম্যান"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 border-b",
													children: "নোট"
												})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-300",
											children: [...monthIssuedLogs].sort((a, b) => {
												const dA = new Date(a.date).getTime() || 0;
												const dB = new Date(b.date).getTime() || 0;
												if (dA !== dB) return dA - dB;
												return (new Date(a.createdAt || 0).getTime() || 0) - (new Date(b.createdAt || 0).getTime() || 0);
											}).map((log) => {
												const val = log.totalCost || (Number(log.quantity) || 0) * (Number(log.costPerUnit) || 0);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap",
															children: formatCleanDate(log.date)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 font-bold text-slate-900 dark:text-white print:text-black",
															children: log.itemName
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-center font-black text-rose-600 dark:text-rose-400 print:text-black",
															children: log.quantity
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-right font-medium",
															children: formatCurrency(log.costPerUnit || 0, currencySymbol)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-right font-bold text-slate-900 dark:text-white print:text-black",
															children: formatCurrency(val, currencySymbol)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 font-bold text-indigo-700 dark:text-indigo-300 print:text-black",
															children: log.recipientOrSource || "সাধারণ বিতরণ"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-3 text-slate-500 dark:text-slate-400",
															children: log.note || "-"
														})
													]
												}, log.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
											className: "bg-slate-100/90 dark:bg-slate-800/90 font-black text-slate-900 dark:text-white print:bg-slate-200 print:text-black",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 2,
													className: "p-3 text-right",
													children: "সর্বমোট:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3 text-center text-rose-600 print:text-black",
													children: [totalIssuedQty, " একক"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right",
													children: "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right text-rose-700 dark:text-rose-400 print:text-black text-base",
													children: formatCurrency(totalIssuedValue, currencySymbol)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 2,
													className: "p-3"
												})
											] })
										})
									]
								})
							})] }),
							Object.keys(recipientIssuedBreakdown).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-indigo-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রাপক / লাইনম্যান ভিত্তিক বিতরণের সামারি" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
								children: Object.keys(recipientIssuedBreakdown).map((rec) => {
									const data = recipientIssuedBreakdown[rec];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center print:border-slate-300 print:bg-slate-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-xs text-slate-800 dark:text-slate-200 print:text-black block",
											children: rec
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-slate-500 dark:text-slate-400",
											children: [
												data.count,
												" বার বিতরণ • মোট ",
												data.qty,
												" একক"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-sm text-rose-600 dark:text-rose-400 print:text-black",
											children: formatCurrency(data.value, currencySymbol)
										})]
									}, rec);
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-16 mt-10 border-t-2 border-slate-300 flex justify-between items-end text-xs sm:text-sm font-bold text-slate-800 print:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center w-48",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b border-slate-400 pb-2 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রস্তুতকারীর স্বাক্ষর" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center w-48",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b border-slate-400 pb-2 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অনুমোদনকারীর স্বাক্ষর (এডমিন)" })]
						})]
					})
				]
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/VisualAnalytics.tsx
var VisualAnalytics = ({ transactions, currencySymbol = "৳", onOpenCardDetail }) => {
	const [timeRange, setTimeRange] = (0, import_react.useState)("6months");
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)("");
	const monthlyData = (0, import_react.useMemo)(() => {
		const map = {};
		transactions.forEach((t) => {
			if (!t.date) return;
			const monthKey = t.date.slice(0, 7);
			if (!map[monthKey]) map[monthKey] = {
				month: monthKey,
				income: 0,
				expense: 0,
				count: 0
			};
			const amt = parseNumber(t.amount);
			if (isIncomeTransaction(t)) map[monthKey].income += amt;
			else map[monthKey].expense += amt;
			map[monthKey].count += 1;
		});
		return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
	}, [transactions]);
	const displayedMonths = (0, import_react.useMemo)(() => {
		if (monthlyData.length === 0) return [];
		if (timeRange === "6months") return monthlyData.slice(-6);
		if (timeRange === "12months") return monthlyData.slice(-12);
		return monthlyData;
	}, [monthlyData, timeRange]);
	const activeMonthKey = selectedMonth || (monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].month : (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
	const activeMonthTxns = (0, import_react.useMemo)(() => {
		return transactions.filter((t) => t.date && t.date.startsWith(activeMonthKey));
	}, [transactions, activeMonthKey]);
	const activeMonthIncome = (0, import_react.useMemo)(() => {
		return activeMonthTxns.filter((t) => isIncomeTransaction(t)).reduce((acc, curr) => acc + parseNumber(curr.amount), 0);
	}, [activeMonthTxns]);
	const activeMonthExpense = (0, import_react.useMemo)(() => {
		return activeMonthTxns.filter((t) => isExpenseTransaction(t)).reduce((acc, curr) => acc + parseNumber(curr.amount), 0);
	}, [activeMonthTxns]);
	const activeMonthProfit = activeMonthIncome - activeMonthExpense;
	const activeMonthMargin = activeMonthIncome > 0 ? activeMonthProfit / activeMonthIncome * 100 : 0;
	const bandwidthCost = (0, import_react.useMemo)(() => {
		return activeMonthTxns.filter((t) => isExpenseTransaction(t) && (String(t.category || "").includes("ব্যান্ডউইথ") || String(t.category || "").includes("আপস্ট্রিম") || String(t.category || "").includes("Bandwidth"))).reduce((acc, curr) => acc + parseNumber(curr.amount), 0);
	}, [activeMonthTxns]);
	const bandwidthRatio = activeMonthIncome > 0 ? bandwidthCost / activeMonthIncome * 100 : 0;
	const expenseCategoryBreakdown = (0, import_react.useMemo)(() => {
		const map = {};
		activeMonthTxns.filter((t) => isExpenseTransaction(t)).forEach((t) => {
			const cat = t.category || "অন্যান্য";
			map[cat] = (map[cat] || 0) + parseNumber(t.amount);
		});
		const total = Object.values(map).reduce((a, b) => a + b, 0);
		return Object.entries(map).map(([category, amount]) => ({
			category,
			amount,
			percentage: total > 0 ? amount / total * 100 : 0
		})).sort((a, b) => b.amount - a.amount);
	}, [activeMonthTxns]);
	const incomeCategoryBreakdown = (0, import_react.useMemo)(() => {
		const map = {};
		activeMonthTxns.filter((t) => isIncomeTransaction(t)).forEach((t) => {
			const cat = t.category || "অন্যান্য";
			map[cat] = (map[cat] || 0) + parseNumber(t.amount);
		});
		const total = Object.values(map).reduce((a, b) => a + b, 0);
		return Object.entries(map).map(([category, amount]) => ({
			category,
			amount,
			percentage: total > 0 ? amount / total * 100 : 0
		})).sort((a, b) => b.amount - a.amount);
	}, [activeMonthTxns]);
	const maxBarValue = (0, import_react.useMemo)(() => {
		let max = 1e3;
		displayedMonths.forEach((m) => {
			if (m.income > max) max = m.income;
			if (m.expense > max) max = m.expense;
		});
		return max * 1.15;
	}, [displayedMonths]);
	const formatMonthBengali = (ym) => {
		if (!ym) return "";
		const [year, month] = ym.split("-");
		return `${[
			"জানুয়ারি",
			"ফেব্রুয়ারি",
			"মার্চ",
			"এপ্রিল",
			"মে",
			"জুন",
			"জুলাই",
			"আগস্ট",
			"সেপ্টেম্বর",
			"অক্টোবর",
			"নভেম্বর",
			"ডিসেম্বর"
		][parseInt(month, 10) - 1] || month} '${year.slice(2)}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 sm:space-y-6 pb-20 sm:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight",
						children: "ভিজ্যুয়াল অ্যানালিটিক্স ও লাভ-লোকসান চার্ট"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "ইন্টারনেট ও ক্যাবল নেটওয়ার্কের আয়, ব্যয়, মার্জিন ও ব্যয়ের বিশ্লেষণ"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTimeRange("6months"),
								className: `px-3 py-1.5 rounded-xl transition cursor-pointer ${timeRange === "6months" ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
								children: "৬ মাস"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTimeRange("12months"),
								className: `px-3 py-1.5 rounded-xl transition cursor-pointer ${timeRange === "12months" ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
								children: "১ বছর"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTimeRange("all"),
								className: `px-3 py-1.5 rounded-xl transition cursor-pointer ${timeRange === "all" ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"}`,
								children: "সব সময়"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => window.print(),
						className: "p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition no-print cursor-pointer",
						title: "রিপোর্ট প্রিন্ট করুন",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenCardDetail && onOpenCardDetail("income"),
						className: "bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-emerald-300 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: [formatMonthBengali(activeMonthKey), " আয়"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2",
								children: [
									currencySymbol,
									" ",
									activeMonthIncome.toLocaleString("bn-BD")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400 mt-1",
								children: "বিল কালেকশন ও অন্যান্য"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenCardDetail && onOpenCardDetail("expense"),
						className: "bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-rose-300 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: [formatMonthBengali(activeMonthKey), " মোট ব্যয়"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-2",
								children: [
									currencySymbol,
									" ",
									activeMonthExpense.toLocaleString("bn-BD")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400 mt-1",
								children: "ব্যান্ডউইথ, বেতন ও অপারেশন"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenCardDetail && onOpenCardDetail("net_profit"),
						className: "bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-indigo-300 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: "নিট লাভ / প্রফিট"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-8 h-8 rounded-xl flex items-center justify-center ${activeMonthProfit >= 0 ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400" : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `text-xl sm:text-2xl font-black mt-2 ${activeMonthProfit >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400"}`,
								children: [
									currencySymbol,
									" ",
									activeMonthProfit.toLocaleString("bn-BD")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeMonthProfit >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"}`,
									children: [activeMonthMargin.toFixed(1), "% মার্জিন"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-slate-400",
									children: activeMonthProfit >= 0 ? "মুনাফাজনক" : "ঘাটতি"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => onOpenCardDetail && onOpenCardDetail("bandwidth_ops"),
						className: "bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-cyan-300 transition",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-500 dark:text-slate-400",
									children: "ব্যান্ডউইথ অনুপাত"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl sm:text-2xl font-black text-cyan-700 dark:text-cyan-400 mt-2",
								children: [bandwidthRatio.toFixed(1), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-slate-400 mt-1",
								children: [
									"আয়ের অনুপাতে আপস্ট্রিম খরচ (",
									currencySymbol,
									bandwidthCost.toLocaleString("bn-BD"),
									")"
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মাসিক আয় বনাম ব্যয় তুলনামূলক বার চার্ট" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "মাসে ক্লিক করে বিস্তারিত ক্যাটাগরি বিশ্লেষণ দেখতে পারেন"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "আয় (Income)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "ব্যয় (Expense)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: "নিট লাভ (Net)"
								})]
							})
						]
					})]
				}), displayedMonths.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 flex items-center justify-center text-slate-400 text-sm",
					children: "চার্ট দেখানোর জন্য পর্যাপ্ত লেনদেন ডাটা নেই"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-6 gap-3 items-end h-64 sm:h-72 border-b border-slate-200 dark:border-slate-700 pb-2",
						children: displayedMonths.map((m) => {
							const incomeHeightPct = Math.min(100, Math.max(8, m.income / maxBarValue * 100));
							const expenseHeightPct = Math.min(100, Math.max(8, m.expense / maxBarValue * 100));
							const netProfit = m.income - m.expense;
							const isSelected = m.month === activeMonthKey;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setSelectedMonth(m.month),
								className: `flex flex-col items-center justify-end h-full p-2 rounded-2xl transition cursor-pointer ${isSelected ? "bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-500" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold text-center mb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `px-1.5 py-0.5 rounded-md ${netProfit >= 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`,
											children: [
												netProfit >= 0 ? "+" : "",
												currencySymbol,
												Math.round(netProfit / 1e3),
												"k"
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-end gap-1.5 w-full justify-center h-44 sm:h-52",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-5 sm:w-7 flex flex-col items-center justify-end h-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: `${incomeHeightPct}%` },
												className: "w-full rounded-t-xl bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm transition-all duration-500 hover:brightness-110 relative group",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-bold shadow-lg",
													children: [
														"আয়: ",
														currencySymbol,
														m.income.toLocaleString("bn-BD")
													]
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-5 sm:w-7 flex flex-col items-center justify-end h-full",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: { height: `${expenseHeightPct}%` },
												className: "w-full rounded-t-xl bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm transition-all duration-500 hover:brightness-110 relative group",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-bold shadow-lg",
													children: [
														"ব্যয়: ",
														currencySymbol,
														m.expense.toLocaleString("bn-BD")
													]
												})
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `text-xs font-bold mt-2 text-center ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`,
										children: formatMonthBengali(m.month)
									})
								]
							}, m.month);
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"ব্যয়ের খাতওয়ারী বিশ্লেষণ (",
								formatMonthBengali(activeMonthKey),
								")"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "কোন খাতে সবচেয়ে বেশি খরচ হচ্ছে"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-black text-rose-600 dark:text-rose-400",
							children: [
								currencySymbol,
								" ",
								activeMonthExpense.toLocaleString("bn-BD")
							]
						})]
					}), expenseCategoryBreakdown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 py-6 text-center",
						children: "এই মাসে কোনো খরচের রেকর্ড নেই"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: expenseCategoryBreakdown.map((item, idx) => {
							const colors = [
								"bg-rose-500",
								"bg-indigo-500",
								"bg-amber-500",
								"bg-cyan-500",
								"bg-purple-500",
								"bg-emerald-500",
								"bg-slate-500"
							];
							const barColor = colors[idx % colors.length];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-700 dark:text-slate-300 truncate max-w-[200px]",
										children: item.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-500 dark:text-slate-400 font-medium",
											children: [currencySymbol, item.amount.toLocaleString("bn-BD")]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "w-12 text-right text-slate-800 dark:text-slate-200",
											children: [item.percentage.toFixed(1), "%"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { width: `${item.percentage}%` },
										className: `h-full rounded-full ${barColor}`
									})
								})]
							}, item.category);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"আয়ের উৎস বিশ্লেষণ (",
								formatMonthBengali(activeMonthKey),
								")"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "ইন্টারনেট, ডিস ও সংযোগ বিল"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-black text-emerald-600 dark:text-emerald-400",
							children: [
								currencySymbol,
								" ",
								activeMonthIncome.toLocaleString("bn-BD")
							]
						})]
					}), incomeCategoryBreakdown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 py-6 text-center",
						children: "এই মাসে কোনো আয়ের রেকর্ড নেই"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: incomeCategoryBreakdown.map((item, idx) => {
							const colors = [
								"bg-emerald-500",
								"bg-teal-500",
								"bg-blue-500",
								"bg-indigo-500",
								"bg-violet-500",
								"bg-amber-500",
								"bg-slate-500"
							];
							const barColor = colors[idx % colors.length];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-700 dark:text-slate-300 truncate max-w-[200px]",
										children: item.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-slate-500 dark:text-slate-400 font-medium",
											children: [currencySymbol, item.amount.toLocaleString("bn-BD")]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "w-12 text-right text-slate-800 dark:text-slate-200",
											children: [item.percentage.toFixed(1), "%"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: { width: `${item.percentage}%` },
										className: `h-full rounded-full ${barColor}`
									})
								})]
							}, item.category);
						})
					})]
				})]
			})
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/OfflineIndicator.tsx
var OfflineIndicator = () => {
	const [isOnline, setIsOnline] = (0, import_react.useState)(typeof navigator !== "undefined" ? navigator.onLine : true);
	(0, import_react.useEffect)(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);
	if (isOnline) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-500/95 text-white px-4 py-2 text-xs font-bold shadow-xl backdrop-blur-xs animate-in slide-in-from-top-4 duration-300 no-print border border-amber-400",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-white animate-ping" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-4 h-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ইন্টারনেট সংযোগ নেই — ক্যাশড ডাটা প্রদর্শিত হচ্ছে" })
		]
	});
};
//#endregion
//#region src/portals/ayByay/components/NewMonthModal.tsx
var NewMonthModal = ({ isOpen, onClose, onConfirmMonth, currentSelectedMonth, existingMonths, isAdminLoggedIn = false, onRequireLogin }) => {
	const getDefaultTargetMonth = () => {
		try {
			const [year, month] = currentSelectedMonth.split("-").map(Number);
			const nextDate = new Date(year, month, 1);
			return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
		} catch {
			const now = /* @__PURE__ */ new Date();
			return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		}
	};
	const [targetMonth, setTargetMonth] = (0, import_react.useState)(getDefaultTargetMonth);
	if (!isOpen) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isAdminLoggedIn) {
			onRequireLogin === null || onRequireLogin === void 0 || onRequireLogin();
			return;
		}
		if (!targetMonth) return;
		onConfirmMonth(targetMonth);
		onClose();
	};
	const now = /* @__PURE__ */ new Date();
	const currentCalendarMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick: onClose,
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-slate-900 dark:text-white leading-tight",
							children: "নতুন মাসের হিসাব যোগ করুন"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold",
							children: "🛡️ এডমিন"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: "নতুন হিসাব চক্র শুরু ও ডেটা ব্যাকআপ সংযোগ"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), !isAdminLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 sm:p-8 text-center space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-7 h-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: "এডমিন অনুমোদন প্রয়োজন"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed",
							children: "নতুন মাসের হিসাব যোগ করা বা আলাদা ডেটা ব্যাকআপ লিংক যুক্ত করার সুবিধা শুধুমাত্র অনুমোদিত এডমিনের জন্য সংরক্ষিত।"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition",
							children: "বাতিল"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onClose();
								onRequireLogin === null || onRequireLogin === void 0 || onRequireLogin();
							},
							className: "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "এডমিন লগইন করুন" })]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-4 sm:p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
							children: "যে মাসের হিসাব শুরু করতে চান (বছর ও মাস নির্বাচন করুন):"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "month",
								value: targetMonth,
								onChange: (e) => setTargetMonth(e.target.value),
								required: true,
								className: "w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["নির্বাচিত মাস: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: getMonthBengaliName(targetMonth) })] })]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-slate-400",
								children: "দ্রুত বাছুন:"
							}),
							targetMonth !== currentCalendarMonth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTargetMonth(currentCalendarMonth),
								className: "px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition",
								children: [
									"চলতি মাস (",
									getMonthBengaliName(currentCalendarMonth),
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const [y, m] = (targetMonth || currentSelectedMonth).split("-").map(Number);
									const nextDate = new Date(y, m, 1);
									setTargetMonth(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`);
								},
								className: "px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold transition border border-emerald-200/60 dark:border-emerald-800/60",
								children: "+ পরবর্তী মাস"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 space-y-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-slate-700 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-slate-900 dark:text-white",
								children: "ড্যাশবোর্ড ০ থেকে ফ্রেশ শুরু হবে:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-600 dark:text-slate-400 mt-0.5",
								children: "নতুন মাসে আপনার লেনদেন ও আয়-ব্যয় ০ থাকবে যতক্ষণ না আপনি নতুন এন্ট্রি দেন।"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 text-slate-700 dark:text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-slate-900 dark:text-white",
								children: "কোনো পূর্বের তথ্য মুছবে না:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-600 dark:text-slate-400 mt-0.5",
								children: "বিগত সকল মাসের তথ্য ও হিসাব সুরক্ষিত থাকবে এবং ইতিহাস হিসেবে যেকোনো সময় দেখা যাবে।"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition",
							children: "বাতিল"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "হিসাব শুরু করুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
						})]
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/portals/ayByay/App.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function AyByayPortal({ onExit, staffAccounts: propStaffAccounts, onSaveStaffAccounts: propOnSaveStaffAccounts, quickHisabOwners, onOpenDriveBackup, currentUser, onAdminLogin, onAdminLogout }) {
	const [transactions, setTransactions] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("isp_cache_txns") || safeStorage.getItem("protyasha_transactions");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch {}
		return initialTransactions;
	});
	const [staffList, setStaffList] = (0, import_react.useState)([]);
	const [salaries, setSalaries] = (0, import_react.useState)([]);
	const [inventoryItems, setInventoryItems] = (0, import_react.useState)([]);
	const [inventoryLogs, setInventoryLogs] = (0, import_react.useState)([]);
	const userRole = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) || "visitor";
	const isAdmin = userRole === "admin";
	const isSubAdmin = userRole === "sub-admin";
	const [staffAccounts, setStaffAccounts] = (0, import_react.useState)(() => {
		if (propStaffAccounts && propStaffAccounts.length > 0) return propStaffAccounts;
		try {
			const saved = safeStorage.getItem("protyasha_staff");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch {}
		return [];
	});
	(0, import_react.useEffect)(() => {
		if (Array.isArray(propStaffAccounts)) setStaffAccounts(propStaffAccounts);
	}, [propStaffAccounts]);
	const canEdit = isAdmin || isSubAdmin && hasSubAdminPermission(currentUser, "ayByay");
	(0, import_react.useEffect)(() => {
		const handleStaffChange = (e) => {
			if (e.detail && Array.isArray(e.detail)) setStaffAccounts(e.detail);
			else try {
				const saved = safeStorage.getItem("protyasha_staff");
				if (saved) setStaffAccounts(JSON.parse(saved));
			} catch {}
		};
		window.addEventListener("staff-data-changed", handleStaffChange);
		return () => window.removeEventListener("staff-data-changed", handleStaffChange);
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const q = collection(staffDb, "staff");
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const cloudStaff = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && (data.id || docSnap.id) && data.name) cloudStaff.push({
						...data,
						id: String(data.id || docSnap.id),
						phone: data.phone || "",
						role: data.role || "লাইন টেকনিশিয়ান",
						isActive: data.isActive !== false,
						transactions: Array.isArray(data.transactions) ? data.transactions : []
					});
				});
				setStaffAccounts(cloudStaff);
				safeStorage.setItem("protyasha_staff", JSON.stringify(cloudStaff));
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "staff");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("AyByay staff listener error:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const q = collection(staffDb, "ay_byay_salaries");
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const cloudSalaries = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && data.id && data.staffId) cloudSalaries.push(data);
				});
				setSalaries(cloudSalaries);
				safeStorage.setItem("isp_cache_salaries", JSON.stringify(cloudSalaries));
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					type: "salaries",
					data: cloudSalaries
				} }));
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_salaries");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("Salaries listener error:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const q = collection(staffDb, "ay_byay_transactions");
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const cloudTx = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && (data.id || docSnap.id) && !data.isDeleted && (!data.source || data.source === "ay-byay")) cloudTx.push({
						...data,
						id: data.id || docSnap.id
					});
				});
				const sorted = cloudTx.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
				setTransactions(sorted);
				safeStorage.setItem("isp_cache_txns", JSON.stringify(sorted));
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					type: "transactions",
					data: sorted
				} }));
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_transactions");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("Transactions listener error:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const q = collection(staffDb, "ay_byay_inventory");
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const items = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && (data.id || docSnap.id)) items.push({
						...data,
						id: data.id || docSnap.id
					});
				});
				items.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
				setInventoryItems(items);
				try {
					safeStorage.setItem("isp_cache_inventory", JSON.stringify(items));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_inventory");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("Inventory items listener error:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const q = collection(staffDb, "ay_byay_inventory_logs");
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const logs = [];
				snapshot.forEach((docSnap) => {
					const data = docSnap.data();
					if (data && (data.id || docSnap.id)) logs.push({
						...data,
						id: data.id || docSnap.id
					});
				});
				logs.sort((a, b) => (b.createdAt || b.date || "").localeCompare(a.createdAt || a.date || ""));
				setInventoryLogs(logs);
				try {
					safeStorage.setItem("isp_cache_inventory_logs", JSON.stringify(logs));
				} catch {}
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, "ay_byay_inventory_logs");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("Inventory logs listener error:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			const cfgRef = doc(staffDb, "ay_byay_config", "main");
			const unsubscribe = onSnapshot(cfgRef, (snap) => {
				if (snap.exists()) {
					const cloudCfg = snap.data();
					setConfig((prev) => {
						const merged = {
							...prev,
							...cloudCfg
						};
						try {
							safeStorage.setItem("isp_admin_saved_config", JSON.stringify(merged));
						} catch {}
						return merged;
					});
					if (Array.isArray(cloudCfg.managedMonths) && cloudCfg.managedMonths.length > 0) setManagedMonths((prev) => {
						const mergedMonths = Array.from(/* @__PURE__ */ new Set([...cloudCfg.managedMonths || [], ...prev]));
						try {
							safeStorage.setItem("isp_managed_months", JSON.stringify(mergedMonths));
						} catch {}
						return mergedMonths;
					});
				}
			}, (err) => {
				handleFirestoreError(err, OperationType.GET, "ay_byay_config/main");
			});
			return () => unsubscribe();
		} catch (e) {
			console.warn("AyByay config listener error:", e);
		}
	}, []);
	const handleSaveStaffAccounts = (updated) => {
		if (!canEdit) return;
		const sanitized = updated.map((s) => sanitizeStaffForFirestore(s));
		setStaffAccounts(sanitized);
		if (propOnSaveStaffAccounts) propOnSaveStaffAccounts(sanitized);
		else {
			broadcastStaffAccounts(sanitized);
			sanitized.forEach((staff) => {
				safeSetDoc(doc(staffDb, "staff", String(staff.id)), staff).catch(() => {});
			});
		}
	};
	const effectiveStaffList = (0, import_react.useMemo)(() => {
		const list = [];
		const seenIds = /* @__PURE__ */ new Set();
		(staffAccounts || []).forEach((acc) => {
			if (!acc || !acc.id || seenIds.has(String(acc.id))) return;
			if (!isActualStaffAccount(acc)) return;
			seenIds.add(String(acc.id));
			let joinDate = "2026-01-01";
			if (acc.createdAt) {
				const parsed = new Date(acc.createdAt);
				if (!isNaN(parsed.getTime())) joinDate = parsed.toISOString().split("T")[0];
			}
			list.push({
				id: String(acc.id),
				name: acc.name,
				designation: acc.role || "লাইন টেকনিশিয়ান",
				phone: acc.phone || "",
				joinDate,
				baseSalary: Number(acc.baseSalary) || 0,
				status: acc.isActive !== false ? "active" : "inactive",
				notes: acc.notes || "",
				createdAt: acc.createdAt || (/* @__PURE__ */ new Date()).toISOString()
			});
		});
		(staffList || []).forEach((s) => {
			if (s && s.id && !seenIds.has(String(s.id))) {
				seenIds.add(String(s.id));
				list.push(s);
			}
		});
		return list;
	}, [staffAccounts, staffList]);
	const [config, setConfig] = (0, import_react.useState)(() => {
		let localSaved = null;
		try {
			const raw = safeStorage.getItem("isp_admin_saved_config");
			if (raw) localSaved = JSON.parse(raw);
		} catch {}
		return {
			autoSync: false,
			lastSyncTime: null,
			syncStatus: "connected",
			syncMessage: "অনলাইন ক্লাউড ডেটাবেস সক্রিয় (১২ মাসের ডেটা ও হিস্টরি চিরতরে সুরক্ষিত)",
			companyName: (localSaved === null || localSaved === void 0 ? void 0 : localSaved.companyName) || "স্মার্ট ব্যবস্থাপনা",
			currencySymbol: "৳",
			activeMonth: (localSaved === null || localSaved === void 0 ? void 0 : localSaved.activeMonth) || (/* @__PURE__ */ new Date()).toISOString().substring(0, 7),
			managedMonths: (localSaved === null || localSaved === void 0 ? void 0 : localSaved.managedMonths) || [(/* @__PURE__ */ new Date()).toISOString().substring(0, 7)]
		};
	});
	const [syncToast, setSyncToast] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (syncToast) {
			const timer = setTimeout(() => {
				setSyncToast(null);
			}, 3500);
			return () => clearTimeout(timer);
		}
	}, [syncToast]);
	const [isDarkMode, setIsDarkMode] = (0, import_react.useState)(() => {
		try {
			return safeStorage.getItem("isp_dark_mode") === "true";
		} catch {
			return false;
		}
	});
	(0, import_react.useEffect)(() => {
		try {
			safeStorage.setItem("isp_dark_mode", String(isDarkMode));
			if (isDarkMode) document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
		} catch {}
	}, [isDarkMode]);
	const isAdminLoggedIn = canEdit;
	const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = (0, import_react.useState)(false);
	const [activeNav, setActiveNav] = (0, import_react.useState)("dashboard");
	const [inventoryReportInitialTab, setInventoryReportInitialTab] = (0, import_react.useState)("stock");
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(() => {
		const now = /* @__PURE__ */ new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	});
	const [managedMonths, setManagedMonths] = (0, import_react.useState)(() => {
		try {
			const saved = safeStorage.getItem("isp_managed_months");
			if (saved) return JSON.parse(saved);
		} catch {}
		const now = /* @__PURE__ */ new Date();
		return [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`];
	});
	const [isNewMonthModalOpen, setIsNewMonthModalOpen] = (0, import_react.useState)(false);
	const availableMonths = (0, import_react.useMemo)(() => {
		const set = new Set(managedMonths);
		const now = /* @__PURE__ */ new Date();
		const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		set.add(currentYM);
		(transactions || []).forEach((t) => {
			if (t && t.date && t.date.length >= 7) set.add(t.date.substring(0, 7));
		});
		return Array.from(set).sort().reverse();
	}, [managedMonths, transactions]);
	const lastServerActiveMonthRef = (0, import_react.useRef)(null);
	const hasUserSetMonthRef = (0, import_react.useRef)(false);
	const handleMonthChange = (newMonth) => {
		hasUserSetMonthRef.current = true;
		setSelectedMonth(newMonth);
		const updated = Array.from(/* @__PURE__ */ new Set([newMonth, ...managedMonths]));
		setManagedMonths(updated);
		safeStorage.setItem("isp_managed_months", JSON.stringify(updated));
		setSyncToast({
			message: `📅 ${getMonthBengaliName(newMonth)} মাসের তথ্য দেখানো হচ্ছে`,
			type: "success"
		});
	};
	const handleAddNewMonth = (monthKey) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			return;
		}
		const updated = Array.from(/* @__PURE__ */ new Set([monthKey, ...managedMonths]));
		setManagedMonths(updated);
		safeStorage.setItem("isp_managed_months", JSON.stringify(updated));
		hasUserSetMonthRef.current = true;
		setSelectedMonth(monthKey);
		lastServerActiveMonthRef.current = monthKey;
		handleSaveConfig({
			activeMonth: monthKey,
			managedMonths: updated
		});
		setSyncToast({
			message: `🎉 ${getMonthBengaliName(monthKey)} মাসের নতুন হিসাব সফলভাবে শুরু করা হয়েছে! ড্যাশবোর্ড ০ থেকে শুরু হয়েছে।`,
			type: "success"
		});
	};
	const [activeCardDetail, setActiveCardDetail] = (0, import_react.useState)(null);
	const [isCardModalOpen, setIsCardModalOpen] = (0, import_react.useState)(false);
	const [selectedSalarySlip, setSelectedSalarySlip] = (0, import_react.useState)(null);
	const [isSalarySlipOpen, setIsSalarySlipOpen] = (0, import_react.useState)(false);
	const [selectedTransaction, setSelectedTransaction] = (0, import_react.useState)(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = (0, import_react.useState)(false);
	const [initialEditInModal, setInitialEditInModal] = (0, import_react.useState)(false);
	const [activeTypeFilter, setActiveTypeFilter] = (0, import_react.useState)("all");
	const [formInitialType, setFormInitialType] = (0, import_react.useState)("income");
	const [formInitialCategory, setFormInitialCategory] = (0, import_react.useState)(void 0);
	const [isReportModalOpen, setIsReportModalOpen] = (0, import_react.useState)(false);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [isSyncing, setIsSyncing] = (0, import_react.useState)(false);
	const stateRef = (0, import_react.useRef)({
		activeNav,
		isCardModalOpen,
		isSalarySlipOpen,
		isDetailModalOpen,
		isReportModalOpen,
		isNewMonthModalOpen,
		isMobileDrawerOpen,
		isAdminLoginModalOpen
	});
	(0, import_react.useEffect)(() => {
		stateRef.current = {
			activeNav,
			isCardModalOpen,
			isSalarySlipOpen,
			isDetailModalOpen,
			isReportModalOpen,
			isNewMonthModalOpen,
			isMobileDrawerOpen,
			isAdminLoginModalOpen
		};
	}, [
		activeNav,
		isCardModalOpen,
		isSalarySlipOpen,
		isDetailModalOpen,
		isReportModalOpen,
		isNewMonthModalOpen,
		isMobileDrawerOpen,
		isAdminLoginModalOpen
	]);
	const pushHistoryStep = (0, import_react.useCallback)((stepName, targetNav, extraState) => {
		try {
			const navTag = targetNav || (stepName.startsWith("nav-") ? stepName.replace("nav-", "") : void 0);
			window.history.pushState({
				appStep: stepName,
				ayByayPortal: true,
				targetNav: navTag,
				timestamp: Date.now(),
				...extraState || {}
			}, "");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			if (!window.history.state || !window.history.state.ayByayPortal) window.history.replaceState({
				appStep: "portal-root",
				ayByayPortal: true,
				targetNav: "dashboard"
			}, "");
		} catch {}
		const handlePopState = (e) => {
			const s = stateRef.current;
			const hState = e.state || window.history.state || {};
			if (s.isAdminLoginModalOpen) {
				setIsAdminLoginModalOpen(false);
				return;
			}
			if (s.isNewMonthModalOpen) {
				setIsNewMonthModalOpen(false);
				return;
			}
			if (s.isSalarySlipOpen) {
				setIsSalarySlipOpen(false);
				setSelectedSalarySlip(null);
				return;
			}
			if (s.isDetailModalOpen) {
				setIsDetailModalOpen(false);
				setSelectedTransaction(null);
				return;
			}
			if (s.isCardModalOpen) {
				setIsCardModalOpen(false);
				setActiveCardDetail(null);
				return;
			}
			if (s.isReportModalOpen) {
				setIsReportModalOpen(false);
				return;
			}
			if (hState && (hState.isDrawerOpen || hState.appStep === "mobile_drawer")) {
				setIsMobileDrawerOpen(true);
				if (hState.targetNav) setActiveNav(hState.targetNav);
				return;
			}
			if (s.isMobileDrawerOpen) {
				setIsMobileDrawerOpen(false);
				if (hState && hState.targetNav) setActiveNav(hState.targetNav);
				else setActiveNav("dashboard");
				return;
			}
			if (hState && hState.ayByayPortal) {
				const nextTargetNav = hState.targetNav || "dashboard";
				if (s.activeNav !== nextTargetNav) {
					setActiveNav(nextTargetNav);
					return;
				}
			}
			if (s.activeNav === "dashboard" && (!hState || !hState.ayByayPortal)) {
				if (onExit) onExit();
			}
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [onExit]);
	const handleNavChange = (0, import_react.useCallback)((newNav) => {
		setIsMobileDrawerOpen(false);
		if (newNav === "new_entry" && !canEdit) {
			setIsAdminLoginModalOpen(true);
			pushHistoryStep("admin-login");
			setSyncToast({
				message: "নতুন এন্ট্রি করার জন্য প্রথমে এডমিন লগইন করুন",
				type: "error"
			});
			return;
		}
		if (newNav !== activeNav) {
			pushHistoryStep(`nav-${newNav}`, newNav);
			setActiveNav(newNav);
			if (newNav !== "card_detail") setActiveCardDetail(null);
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
	}, [
		activeNav,
		canEdit,
		pushHistoryStep
	]);
	const handleGoBack = (0, import_react.useCallback)(() => {
		try {
			if (window.history.state && window.history.state.ayByayPortal && window.history.state.appStep !== "portal-root") {
				window.history.back();
				return;
			}
		} catch {}
		const s = stateRef.current;
		if (s.isMobileDrawerOpen) {
			setIsMobileDrawerOpen(false);
			return;
		}
		if (s.isAdminLoginModalOpen) {
			setIsAdminLoginModalOpen(false);
			return;
		}
		if (s.isNewMonthModalOpen) {
			setIsNewMonthModalOpen(false);
			return;
		}
		if (s.isSalarySlipOpen) {
			setIsSalarySlipOpen(false);
			setSelectedSalarySlip(null);
			return;
		}
		if (s.isDetailModalOpen) {
			setIsDetailModalOpen(false);
			setSelectedTransaction(null);
			return;
		}
		if (s.isCardModalOpen) {
			setIsCardModalOpen(false);
			setActiveCardDetail(null);
			return;
		}
		if (s.isReportModalOpen) {
			setIsReportModalOpen(false);
			return;
		}
		if (s.activeNav !== "dashboard") {
			setActiveNav("dashboard");
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			return;
		}
		if (onExit) onExit();
	}, [onExit]);
	const fetchDataSilent = (0, import_react.useCallback)(async () => {
		console.log("[AyByay] Firestore listeners active for all collections");
	}, []);
	const handleAddInventoryItem = async (item) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "মালামাল পরিবর্তন করতে অ্যাডমিন বা অনুমোদিত সাব-অ্যাডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return;
		}
		try {
			const id = item.id || `INV-${Date.now()}`;
			const payload = {
				id,
				name: item.name || "মালামাল",
				category: item.category || "other",
				unit: item.unit || "পিস",
				currentStock: Number(item.currentStock) || 0,
				minStockAlert: Number(item.minStockAlert) || 0,
				unitCost: Number(item.unitCost) || 0,
				supplier: item.supplier,
				location: item.location,
				notes: item.notes,
				recordedBy: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || "admin-primary",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await safeSetDoc(doc(staffDb, "ay_byay_inventory", id), payload);
			setSyncToast({
				message: "মালামাল সফলভাবে সংরক্ষিত হয়েছে",
				type: "success"
			});
		} catch (err) {
			console.error("Inventory save failed", err);
			setSyncToast({
				message: "মালামাল সংরক্ষণ ব্যর্থ হয়েছে",
				type: "error"
			});
		}
	};
	const handleDeleteInventoryItem = async (id) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "মালামাল ডিলিট করতে অ্যাডমিন বা অনুমোদিত সাব-অ্যাডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return;
		}
		try {
			await safeDeleteDoc(doc(staffDb, "ay_byay_inventory", id));
			setSyncToast({
				message: "মালামাল সফলভাবে মুছে ফেলা হয়েছে",
				type: "success"
			});
		} catch (err) {
			console.error("Inventory delete failed", err);
		}
	};
	const handleDeleteInventoryLog = async (id) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			return;
		}
		try {
			const log = inventoryLogs.find((l) => l.id === id);
			if (!log) return;
			const item = inventoryItems.find((i) => i.id === log.itemId);
			if (item) {
				const newStock = log.type === "in" || log.type === "return" ? Math.max(0, item.currentStock - log.quantity) : item.currentStock + log.quantity;
				await safeSetDoc(doc(staffDb, "ay_byay_inventory", item.id), {
					...item,
					currentStock: newStock
				});
			}
			await safeDeleteDoc(doc(staffDb, "ay_byay_inventory_logs", id));
			setSyncToast({
				message: "মুভমেন্ট লগ সফলভাবে মুছে ফেলা হয়েছে",
				type: "success"
			});
		} catch (err) {
			console.error("Delete log failed", err);
		}
	};
	const handleLogMovement = async (logData) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "স্টক মুভমেন্ট রেকর্ড করতে অ্যাডমিন বা অনুমোদিত সাব-অ্যাডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return;
		}
		try {
			const item = inventoryItems.find((i) => i.id === logData.itemId);
			if (!item) return;
			const logId = `LOG-${Date.now()}`;
			const newLog = {
				...logData,
				id: logId,
				itemName: item.name,
				totalCost: (logData.costPerUnit || item.unitCost) * logData.quantity,
				recordedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const newStock = logData.type === "in" || logData.type === "return" ? item.currentStock + logData.quantity : Math.max(0, item.currentStock - logData.quantity);
			await safeSetDoc(doc(staffDb, "ay_byay_inventory", item.id), {
				...item,
				currentStock: newStock
			});
			await safeSetDoc(doc(staffDb, "ay_byay_inventory_logs", logId), newLog);
			setSyncToast({
				message: "স্টক রেকর্ড সফলভাবে সংরক্ষিত হয়েছে",
				type: "success"
			});
		} catch (err) {
			console.error("Movement log error", err);
			setSyncToast({
				message: "স্টক মুভমেন্ট রেকর্ড করতে সমস্যা হয়েছে",
				type: "error"
			});
		}
	};
	const fetchData = (0, import_react.useCallback)(async () => {
		try {
			setIsLoading(true);
			await fetchDataSilent();
		} catch (err) {
			console.warn("Initial load notice:", err);
		} finally {
			setIsLoading(false);
		}
	}, [fetchDataSilent, config.activeMonth]);
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [fetchData]);
	const monthTransactions = (0, import_react.useMemo)(() => {
		if (!Array.isArray(transactions)) return [];
		return transactions.filter((t) => {
			if (!t || typeof t.date !== "string") return false;
			return getTransactionMonth(t.date) === selectedMonth;
		});
	}, [transactions, selectedMonth]);
	const stats = (0, import_react.useMemo)(() => {
		let totalIncome = 0;
		let totalExpense = 0;
		let incomeCount = 0;
		let expenseCount = 0;
		monthTransactions.forEach((t) => {
			if (!t) return;
			const amt = parseNumber(t.amount);
			if (isIncomeTransaction(t)) {
				totalIncome += amt;
				incomeCount++;
			} else {
				totalExpense += amt;
				expenseCount++;
			}
		});
		const netProfit = totalIncome - totalExpense;
		const paidSalaries = (salaries || []).filter((s) => s && s.month === selectedMonth && s.paymentStatus === "paid").reduce((acc, s) => acc + (Number(s === null || s === void 0 ? void 0 : s.netSalary) || 0), 0);
		const bandwidthCategories = [
			"ব্যান্ডউইথ/আপস্ট্রিম বিল",
			"বিদ্যুৎ বিল",
			"অফিস ভাড়া",
			"অপটিক্যাল ফাইবার ও কেবল",
			"ONU/OLT/Router ক্রয়",
			"স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ",
			"কেবল মেরামত ও রক্ষণাবেক্ষণ"
		];
		const totalBandwidthOps = monthTransactions.filter((t) => {
			if (!t || !isExpenseTransaction(t)) return false;
			const cat = String(t.category || "");
			return bandwidthCategories.includes(cat) || cat.includes("ব্যান্ডউইথ") || cat.includes("বিদ্যুৎ") || cat.includes("কেবল") || cat.includes("ফাইবার");
		}).reduce((acc, t) => acc + parseNumber(t.amount), 0);
		const activeStaffCount = (effectiveStaffList || []).filter((s) => s && s.status === "active").length;
		return {
			totalIncome,
			totalExpense,
			netProfit,
			paidSalaries,
			totalBandwidthOps,
			incomeCount,
			expenseCount,
			staffCount: activeStaffCount
		};
	}, [
		monthTransactions,
		salaries,
		effectiveStaffList,
		selectedMonth
	]);
	const handleCardClick = (type) => {
		setActiveCardDetail(type);
		handleNavChange("card_detail");
		pushHistoryStep(`card-${type}`);
	};
	const handleOpenNewTransaction = (type, category) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "নতুন এন্ট্রি করার জন্য প্রথমে এডমিন লগইন করুন",
				type: "error"
			});
			return;
		}
		setFormInitialType(type || "income");
		setFormInitialCategory(category);
		handleNavChange("new_entry");
	};
	const handleViewSalarySlip = (sal) => {
		setSelectedSalarySlip(sal);
		setIsSalarySlipOpen(true);
		pushHistoryStep("salary-slip");
	};
	const handleOpenReportModal = () => {
		setIsMobileDrawerOpen(false);
		handleNavChange("report");
	};
	const handleAddTransaction = async (data) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "নতুন লেনদেন সংযোজন করতে প্রথমে এডমিন লগইন করুন",
				type: "error"
			});
			return false;
		}
		setIsSubmitting(true);
		try {
			const newId = `TXN-${Date.now()}`;
			const payload = {
				...data,
				id: newId,
				recordedBy: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || "admin-primary",
				recordedByGmail: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.gmail) || void 0,
				source: "ay-byay",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await safeSetDoc(doc(staffDb, "ay_byay_transactions", newId), payload);
			try {
				const currentList = JSON.parse(safeStorage.getItem("isp_cache_txns") || "[]");
				const updated = [payload, ...Array.isArray(currentList) ? currentList : []];
				safeStorage.setItem("isp_cache_txns", JSON.stringify(updated));
				safeStorage.setItem("protyasha_transactions", JSON.stringify(updated));
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					action: "add",
					transaction: payload
				} }));
			} catch {}
			setSyncToast({
				message: "✅ নতুন লেনদেনটি সফলভাবে অন্তর্ভুক্ত হয়েছে!",
				type: "success"
			});
			handleNavChange("dashboard");
			return true;
		} catch (err) {
			console.error("Error adding transaction:", err);
			setSyncToast({
				message: "❌ ব্যর্থ হয়েছে! আবার চেষ্টা করুন",
				type: "error"
			});
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleUpdateTransaction = async (id, updatedData) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "লেনদেন এডিট করার জন্য এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const existing = transactions.find((t) => t.id === id);
			if (!existing) return false;
			const updated = {
				...existing,
				...updatedData
			};
			await safeSetDoc(doc(staffDb, "ay_byay_transactions", id), updated);
			try {
				const currentList = JSON.parse(safeStorage.getItem("isp_cache_txns") || "[]");
				const updatedList = Array.isArray(currentList) ? currentList.map((t) => t.id === id ? {
					...t,
					...updatedData
				} : t) : [];
				safeStorage.setItem("isp_cache_txns", JSON.stringify(updatedList));
				safeStorage.setItem("protyasha_transactions", JSON.stringify(updatedList));
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					action: "update",
					transaction: updated
				} }));
			} catch {}
			setSyncToast({
				message: "✅ লেনদেনের তথ্য সফলভাবে আপডেট হয়েছে!",
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error updating transaction:", err);
			setSyncToast({
				message: "❌ এডিটে ত্রুটি হয়েছে",
				type: "error"
			});
			return false;
		}
	};
	const handleDeleteTransaction = async (id) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "লেনদেন ডিলিট করার জন্য এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			await safeDeleteDoc(doc(staffDb, "ay_byay_transactions", id));
			try {
				const currentList = JSON.parse(safeStorage.getItem("isp_cache_txns") || "[]");
				const updatedList = Array.isArray(currentList) ? currentList.filter((t) => t.id !== id) : [];
				setTransactions(updatedList);
				safeStorage.setItem("isp_cache_txns", JSON.stringify(updatedList));
				safeStorage.setItem("protyasha_transactions", JSON.stringify(updatedList));
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					action: "delete",
					id
				} }));
			} catch (err) {
				console.warn("AyByay local sync error during delete:", err);
			}
			if ((selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === id) {
				setIsDetailModalOpen(false);
				setSelectedTransaction(null);
			}
			setSyncToast({
				message: "🗑️ লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে!",
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error deleting transaction:", err);
			setSyncToast({
				message: "❌ ডিলিট করার সময় ত্রুটি ঘটেছে",
				type: "error"
			});
			return false;
		}
	};
	const handleAddStaff = async (data) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "নতুন স্টাফ যোগ করতে এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const newStaffId = `stf-${Date.now()}`;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const { updatedList } = await upsertSingleStaffToCloud({
				id: newStaffId,
				name: data.name,
				phone: data.phone || "",
				role: data.designation || "লাইন টেকনিশিয়ান",
				baseSalary: Number(data.baseSalary) || 0,
				notes: data.notes || "",
				totalDue: 0,
				totalCollected: 0,
				remainingDue: 0,
				transactions: [],
				createdAt: nowIso,
				updatedAt: nowIso,
				isActive: data.status !== "inactive",
				recordedBy: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.name) || "admin"
			}, staffAccounts);
			setStaffAccounts(updatedList);
			setSyncToast({
				message: `কর্মী "${data.name}" ক্লাউডে সফলভাবে সংরক্ষিত হয়েছে`,
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error adding staff:", err);
			return false;
		}
	};
	const handleUpdateStaff = async (id, data) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "স্টাফ তথ্য পরিবর্তন করতে এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const existingAcc = staffAccounts.find((a) => String(a.id) === String(id));
			const { updatedList } = await upsertSingleStaffToCloud({
				...existingAcc || {
					id,
					totalDue: 0,
					totalCollected: 0,
					remainingDue: 0,
					transactions: [],
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				id,
				name: data.name !== void 0 ? data.name : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.name) || "স্টাফ",
				phone: data.phone !== void 0 ? data.phone : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.phone) || "",
				role: data.designation !== void 0 ? data.designation : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.role) || "লাইন টেকনিশিয়ান",
				baseSalary: data.baseSalary !== void 0 ? Number(data.baseSalary) || 0 : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.baseSalary) || 0,
				notes: data.notes !== void 0 ? data.notes : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.notes) || "",
				isActive: data.status !== void 0 ? data.status === "active" : (existingAcc === null || existingAcc === void 0 ? void 0 : existingAcc.isActive) !== false,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, staffAccounts);
			setStaffAccounts(updatedList);
			setStaffList((prev) => prev.filter((s) => String(s.id) !== String(id)));
			setSyncToast({
				message: "স্টাফ তথ্য ক্লাউডে সফলভাবে আপডেট হয়েছে",
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error updating staff:", err);
			return false;
		}
	};
	const handleDeleteStaff = async (id) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "স্টাফ ডিলিট করতে এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const updatedList = await deleteSingleStaffFromCloud(id, staffAccounts);
			setStaffAccounts(updatedList);
			setStaffList((prev) => prev.filter((s) => String(s.id) !== String(id)));
			setSyncToast({
				message: "স্টাফ ক্লাউড ডাটাবেজ থেকে মুছে ফেলা হয়েছে",
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error deleting staff:", err);
			return false;
		}
	};
	const handleDisburseSalary = async (data) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "বেতন প্রদান করতে এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const staffMember = effectiveStaffList.find((s) => s.id === data.staffId);
			const grossSalary = data.baseSalary + (data.bonusOrAllowance || 0);
			const netSalary = Math.max(0, grossSalary - (data.deductionOrAdvance || 0));
			const recordId = `sal-${data.staffId}-${data.month}`;
			const payDate = data.paymentDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const voucher = data.voucherNumber || `VCH-SAL-${Date.now().toString().slice(-4)}`;
			const record = {
				id: recordId,
				staffId: data.staffId,
				staffName: (staffMember === null || staffMember === void 0 ? void 0 : staffMember.name) || "স্টাফ",
				staffDesignation: (staffMember === null || staffMember === void 0 ? void 0 : staffMember.designation) || "কর্মচারী",
				month: data.month,
				baseSalary: data.baseSalary,
				bonusOrAllowance: data.bonusOrAllowance,
				deductionOrAdvance: data.deductionOrAdvance,
				netSalary,
				paymentStatus: data.paymentStatus,
				paymentDate: payDate,
				paymentMethod: data.paymentMethod || "নগদ (Cash)",
				voucherNumber: voucher,
				note: data.note || "",
				recordedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
				recordedByGmail: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.gmail) || void 0,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await safeSetDoc(doc(staffDb, "staff_salaries", record.id), record).catch((err) => {
				handleFirestoreError(err, OperationType.WRITE, `staff_salaries/${record.id}`);
			});
			setSalaries((prev) => {
				const idx = prev.findIndex((s) => s.staffId === data.staffId && s.month === data.month);
				if (idx !== -1) {
					const copy = [...prev];
					copy[idx] = record;
					return copy;
				}
				return [record, ...prev];
			});
			try {
				const updated = [...salaries.filter((s) => !(s.staffId === data.staffId && s.month === data.month)), record];
				safeStorage.setItem("isp_cache_salaries", JSON.stringify(updated));
			} catch {}
			if (data.deductionOrAdvance > 0) {
				const cleanPhone = (p) => (p || "").replace(/[^0-9]/g, "");
				const targetPhone = cleanPhone((staffMember === null || staffMember === void 0 ? void 0 : staffMember.phone) || "");
				const matchedAcc = staffAccounts.find((a) => a.id === data.staffId || targetPhone.length >= 10 && cleanPhone(a.phone) === targetPhone || a.name && (staffMember === null || staffMember === void 0 ? void 0 : staffMember.name) && a.name.trim().toLowerCase() === staffMember.name.trim().toLowerCase());
				if (matchedAcc && (matchedAcc.remainingDue || 0) > 0) {
					const settleAmount = Math.min(data.deductionOrAdvance, matchedAcc.remainingDue);
					if (settleAmount > 0) {
						const collectionTx = {
							id: `stx-sal-${Date.now()}`,
							staffId: matchedAcc.id,
							type: "collection",
							amount: settleAmount,
							date: payDate,
							time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							}),
							customerName: `${record.staffName} (${record.staffDesignation})`,
							note: `বেতন থেকে কোম্পানি পাওনা কর্তন (${getMonthBengaliName(data.month)}) - ভাউচার: ${voucher}`,
							recordedBy: "পে-রোল সিস্টেম",
							created: Date.now()
						};
						const newTxs = [...matchedAcc.transactions || [], collectionTx];
						const newTotalDue = newTxs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
						const newTotalCollected = newTxs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
						const newRemaining = Math.max(0, newTotalDue - newTotalCollected);
						const updatedAccount = {
							...matchedAcc,
							totalDue: newTotalDue,
							totalCollected: newTotalCollected,
							remainingDue: newRemaining,
							transactions: newTxs
						};
						safeSetDoc(doc(staffDb, "staff", matchedAcc.id), updatedAccount).catch(() => {});
						const updatedAccounts = staffAccounts.map((a) => a.id === matchedAcc.id ? updatedAccount : a);
						handleSaveStaffAccounts(updatedAccounts);
					}
				}
			}
			await safeSetDoc(doc(staffDb, "ay_byay_salaries", record.id), record);
			if (data.paymentStatus === "paid") {
				const txnId = `tx-sal-${record.id}`;
				const salaryExpenseTx = {
					id: txnId,
					type: "expense",
					description: `স্টাফ বেতন: ${record.staffName} (${record.staffDesignation})`,
					category: "বেতন (Salary)",
					amount: record.netSalary,
					date: payDate,
					paymentMethod: record.paymentMethod,
					note: `${getMonthBengaliName(data.month)} মাসের বেতন। মূল: ৳${data.baseSalary}, বোনাস: ৳${data.bonusOrAllowance || 0}, কর্তন: ৳${data.deductionOrAdvance || 0}। ভাউচার: ${voucher}`,
					source: "ay-byay",
					createdAt: record.createdAt,
					recordedBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
				};
				await safeSetDoc(doc(staffDb, "ay_byay_transactions", txnId), salaryExpenseTx);
				setTransactions((prev) => {
					const filtered = prev.filter((t) => t.id !== txnId);
					const updated = [salaryExpenseTx, ...filtered];
					safeStorage.setItem("isp_cache_txns", JSON.stringify(updated));
					return updated;
				});
			}
			try {
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					action: "salary_disbursed",
					record
				} }));
			} catch {}
			setSyncToast({
				message: `✓ ${record.staffName} এর বেতন ক্লাউড ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে`,
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error disbursing salary:", err);
			setSyncToast({
				message: "বেতন সংরক্ষণে সমস্যা হয়েছে",
				type: "error"
			});
			return false;
		}
	};
	const handleDeleteSalary = async (id) => {
		if (!canEdit) {
			setIsAdminLoginModalOpen(true);
			setSyncToast({
				message: "বেতন রেকর্ড ডিলিট করতে এডমিন লগইন প্রয়োজন",
				type: "error"
			});
			return false;
		}
		try {
			const salRecord = salaries.find((s) => s.id === id);
			await safeDeleteDoc(doc(staffDb, "ay_byay_salaries", id)).catch((err) => {
				handleFirestoreError(err, OperationType.DELETE, `ay_byay_salaries/${id}`);
			});
			safeDeleteDoc(doc(staffDb, "staff_salaries", id)).catch(() => {});
			const linkedTxId = `tx-sal-${id}`;
			await safeDeleteDoc(doc(staffDb, "ay_byay_transactions", linkedTxId));
			if (salRecord && (salRecord.deductionOrAdvance || 0) > 0) {
				const cleanPhone = (p) => (p || "").replace(/[^0-9]/g, "");
				const staffObj = effectiveStaffList.find((s) => s.id === salRecord.staffId);
				const targetPhone = cleanPhone((staffObj === null || staffObj === void 0 ? void 0 : staffObj.phone) || "");
				const matchedAcc = staffAccounts.find((a) => a.id === salRecord.staffId || targetPhone.length >= 10 && cleanPhone(a.phone) === targetPhone || a.name && salRecord.staffName && a.name.trim().toLowerCase() === salRecord.staffName.trim().toLowerCase());
				if (matchedAcc && matchedAcc.transactions) {
					const revertTarget = matchedAcc.transactions.find((t) => {
						var _t$note, _t$note2;
						return t.type === "collection" && ((_t$note = t.note) === null || _t$note === void 0 ? void 0 : _t$note.includes(getMonthBengaliName(salRecord.month))) && ((_t$note2 = t.note) === null || _t$note2 === void 0 ? void 0 : _t$note2.includes("বেতন থেকে কোম্পানি পাওনা কর্তন"));
					});
					if (revertTarget) {
						const filteredTxs = matchedAcc.transactions.filter((t) => t.id !== revertTarget.id);
						const newTotalDue = filteredTxs.filter((t) => t.type === "due").reduce((sum, t) => sum + (t.amount || 0), 0);
						const newTotalCollected = filteredTxs.filter((t) => t.type === "collection").reduce((sum, t) => sum + (t.amount || 0), 0);
						const newRemaining = Math.max(0, newTotalDue - newTotalCollected);
						const updatedAccount = {
							...matchedAcc,
							totalDue: newTotalDue,
							totalCollected: newTotalCollected,
							remainingDue: newRemaining,
							transactions: filteredTxs
						};
						safeSetDoc(doc(staffDb, "staff", matchedAcc.id), updatedAccount).catch(() => {});
						const updatedAccounts = staffAccounts.map((a) => a.id === matchedAcc.id ? updatedAccount : a);
						handleSaveStaffAccounts(updatedAccounts);
					}
				}
			}
			setSalaries((prev) => {
				const updated = prev.filter((s) => s.id !== id);
				safeStorage.setItem("isp_cache_salaries", JSON.stringify(updated));
				return updated;
			});
			setTransactions((prev) => {
				const updated = prev.filter((t) => t.id !== linkedTxId);
				safeStorage.setItem("isp_cache_txns", JSON.stringify(updated));
				return updated;
			});
			try {
				window.dispatchEvent(new CustomEvent("aybyay-data-changed", { detail: {
					action: "salary_deleted",
					id
				} }));
			} catch {}
			setSyncToast({
				message: "বেতন রেকর্ড ক্লাউড ডাটাবেজ থেকে মুছে ফেলা হয়েছে",
				type: "success"
			});
			return true;
		} catch (err) {
			console.error("Error deleting salary record:", err);
			setSyncToast({
				message: "ডিলিট করতে সমস্যা হয়েছে",
				type: "error"
			});
			return false;
		}
	};
	const handleSaveConfig = async (newConfig) => {
		try {
			const merged = {
				...config,
				...newConfig
			};
			safeStorage.setItem("isp_admin_saved_config", JSON.stringify(merged));
			await safeSetDoc(doc(staffDb, "ay_byay_config", "main"), merged);
			setConfig(merged);
			return true;
		} catch (err) {
			console.error("Error saving config:", err);
			return false;
		}
	};
	const handleExportCsv = () => {
		try {
			const activeTxns = transactions.filter((t) => getTransactionMonth(t.date || "") === selectedMonth);
			if (activeTxns.length === 0) {
				setSyncToast({
					message: "এই মাসে কোনো লেনদেন নেই!",
					type: "error"
				});
				return;
			}
			const headers = [
				"Date",
				"Description",
				"Category",
				"Type",
				"Amount",
				"Method",
				"Note"
			];
			const rows = activeTxns.map((t) => [
				t.date || "",
				t.description || "",
				t.category || "",
				t.type === "income" ? "Income" : "Expense",
				t.amount || 0,
				t.paymentMethod || "Cash",
				t.note || ""
			]);
			const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
			const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `AyByay_Report_${selectedMonth}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (e) {
			console.error("CSV Export error:", e);
			setSyncToast({
				message: "এক্সপোর্ট করতে সমস্যা হয়েছে",
				type: "error"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `min-h-screen w-full ${isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-[#f0f4fa] text-slate-900"} py-3 sm:py-5 px-3 sm:px-6 lg:px-8 font-sans pb-28 sm:pb-12 transition-colors`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {}),
			syncToast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: () => setSyncToast(null),
				className: "fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300 cursor-pointer",
				title: "ক্লিক করে হাইড করুন",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border ${syncToast.type === "success" ? "bg-emerald-900 text-white border-emerald-700" : "bg-rose-900 text-white border-rose-700"}`,
					children: [syncToast.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: syncToast.message })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				config,
				activeNav,
				onNavChange: handleNavChange,
				onOpenReportModal: handleOpenReportModal,
				onExportCsv: handleExportCsv,
				isDarkMode,
				onToggleDarkMode: () => setIsDarkMode(!isDarkMode),
				isAdminLoggedIn,
				onOpenAdminLogin: () => {
					setIsAdminLoginModalOpen(true);
					pushHistoryStep("admin-login");
				},
				onAdminLogout: () => {
					if (onAdminLogout) onAdminLogout();
					setSyncToast({
						message: "এডমিন লগআউট সফল হয়েছে",
						type: "success"
					});
				},
				onOpenNewMonthModal: () => {
					setIsNewMonthModalOpen(true);
					pushHistoryStep("new-month");
				},
				onExit,
				onOpenDriveBackup
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoginModal, {
				isOpen: isAdminLoginModalOpen,
				onClose: () => setIsAdminLoginModalOpen(false),
				onOpenMainLogin: () => {
					if (onAdminLogin) onAdminLogin();
				}
			}),
			activeNav === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 sm:space-y-5 animate-in fade-in duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-indigo-950/40 border border-emerald-300/80 dark:border-emerald-800/80 rounded-2xl p-3 sm:px-4 flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-slate-700 dark:text-slate-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex h-2.5 w-2.5 relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-emerald-950 dark:text-emerald-300 font-bold",
								children: "অনলাইন ক্লাউড ডেটাবেস সক্রিয়:"
							}), " আপনার আয়-ব্যয় ও মালামাল স্টকের সমস্ত ডেটা রিয়েল-টাইম নিরাপদ ও সংরক্ষণ করা হচ্ছে।"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => fetchDataSilent(),
							title: "তথ্য রিফ্রেশ করুন",
							className: "shrink-0 px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-1.5 transition shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ডেটা রিফ্রেশ" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsCards, {
						totalIncome: stats.totalIncome,
						totalExpense: stats.totalExpense,
						netProfit: stats.netProfit,
						paidSalaries: stats.paidSalaries,
						totalBandwidthOps: stats.totalBandwidthOps,
						incomeCount: stats.incomeCount,
						expenseCount: stats.expenseCount,
						staffCount: stats.staffCount,
						onCardClick: handleCardClick,
						onNavigateToLedger: () => handleNavChange("transactions"),
						currencySymbol: config.currencySymbol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionForm, {
						onAddTransaction: handleAddTransaction,
						isSubmitting,
						selectedMonth,
						initialType: formInitialType,
						initialCategory: formInitialCategory,
						isOpenInitially: false,
						isAdminLoggedIn,
						onRequireLogin: () => setIsAdminLoginModalOpen(true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardOverview, {
						transactions,
						salaries,
						staffList: effectiveStaffList,
						selectedMonth,
						onMonthChange: handleMonthChange,
						onOpenCardDetail: handleCardClick,
						onOpenNewTransaction: handleOpenNewTransaction,
						onNavigateToStaff: () => handleNavChange("staff"),
						onNavigateToLedger: () => handleNavChange("transactions"),
						config,
						availableMonths,
						isAdminLoggedIn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => handleNavChange("inventory"),
							className: "bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer flex items-center justify-between group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "w-6 h-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
										children: "ক্যাবল ও মালামাল স্টক (Inventory)"
									}), inventoryItems.some((i) => i.currentStock <= i.minStockAlert) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-amber-500 animate-ping" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
									children: [inventoryItems.length, " টি আইটেম • ড্রপ ক্যাবল, ONU, রাউটার ও স্প্লিটার ট্র্যাকিং"]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 shrink-0",
								children: "স্টক দেখুন →"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => handleNavChange("analytics"),
							className: "bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-cyan-300 dark:hover:border-cyan-700 transition cursor-pointer flex items-center justify-between group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-6 h-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
									children: "চার্ট ও গ্রাফিক্যাল রিপোর্ট (Analytics)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
									children: "মাসিক আয়-ব্যয় তুলনা, লাভ-মার্জিন ও ব্যান্ডউইথ খরচের অনুপাত"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-cyan-600 dark:text-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 shrink-0",
								children: "চার্ট দেখুন →"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PWAInstallButton, { variant: "banner" })
				]
			}),
			activeNav === "staff" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffSalaryManager, {
				staffList: effectiveStaffList,
				salaries,
				selectedMonth,
				onMonthChange: handleMonthChange,
				onAddStaff: handleAddStaff,
				onUpdateStaff: handleUpdateStaff,
				onDeleteStaff: handleDeleteStaff,
				onDisburseSalary: handleDisburseSalary,
				onDeleteSalary: handleDeleteSalary,
				onViewSalarySlip: handleViewSalarySlip,
				config,
				onBackToDashboard: () => handleNavChange("dashboard"),
				isAdminLoggedIn,
				onRequireLogin: () => setIsAdminLoginModalOpen(true),
				staffAccounts,
				onSaveStaffAccounts: handleSaveStaffAccounts,
				quickHisabOwners
			}),
			activeNav === "new_entry" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-2xl mx-auto animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionForm, {
					onAddTransaction: handleAddTransaction,
					isSubmitting,
					selectedMonth,
					initialType: formInitialType,
					initialCategory: formInitialCategory,
					isOpenInitially: true,
					isAdminLoggedIn,
					onRequireLogin: () => setIsAdminLoginModalOpen(true)
				})
			}),
			activeNav === "transactions" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs animate-in fade-in duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-bold text-slate-900",
						children: "কোম্পানির পূর্ণাঙ্গ লেনদেন খতিয়ান (Transaction Ledger)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 mt-0.5",
						children: [
							"সর্বমোট ",
							transactions.length,
							" টি আয় ও ব্যয়ের বিস্তারিত রেকর্ড ও অনুসন্ধান"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleOpenNewTransaction(),
						className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ নতুন এন্ট্রি" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionList, {
					transactions,
					activeTypeFilter,
					onTypeFilterChange: setActiveTypeFilter,
					onSelectTransaction: (txn) => {
						setSelectedTransaction(txn);
						setInitialEditInModal(false);
						setIsDetailModalOpen(true);
						pushHistoryStep("txn-detail");
					},
					onEditTransaction: (txn) => {
						if (!isAdminLoggedIn) {
							setIsAdminLoginModalOpen(true);
							return;
						}
						setSelectedTransaction(txn);
						setInitialEditInModal(true);
						setIsDetailModalOpen(true);
						pushHistoryStep("txn-edit");
					},
					onDeleteTransaction: handleDeleteTransaction,
					currencySymbol: config.currencySymbol,
					isAdminLoggedIn
				})]
			}),
			activeNav === "card_detail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDetailPage, {
				type: activeCardDetail,
				transactions,
				salaries,
				staffList: effectiveStaffList,
				config,
				selectedMonth,
				onMonthChange: handleMonthChange,
				onOpenNewTransaction: handleOpenNewTransaction,
				onNavigateToStaff: () => handleNavChange("staff"),
				onNavigateToLedger: (filterType) => {
					if (filterType) setActiveTypeFilter(filterType);
					handleNavChange("transactions");
				},
				onSelectTransaction: (txn) => {
					setSelectedTransaction(txn);
					setInitialEditInModal(false);
					setIsDetailModalOpen(true);
					pushHistoryStep("txn-detail");
				},
				onDeleteTransaction: handleDeleteTransaction,
				onViewSalarySlip: handleViewSalarySlip,
				isAdminLoggedIn
			}),
			activeNav === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryManager, {
					items: inventoryItems,
					logs: inventoryLogs,
					onAddItem: handleAddInventoryItem,
					onDeleteItem: handleDeleteInventoryItem,
					onDeleteLog: handleDeleteInventoryLog,
					onLogMovement: handleLogMovement,
					currencySymbol: config.currencySymbol,
					onRefresh: fetchDataSilent,
					isAdminLoggedIn,
					onRequireLogin: () => setIsAdminLoginModalOpen(true),
					onOpenReportPage: (tab) => {
						setInventoryReportInitialTab(tab);
						handleNavChange("inventory_report");
					}
				})
			}),
			activeNav === "inventory_report" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryReportPage, {
					items: inventoryItems,
					logs: inventoryLogs,
					config,
					selectedMonth,
					onMonthChange: handleMonthChange,
					currencySymbol: config.currencySymbol,
					availableMonths,
					initialTab: inventoryReportInitialTab,
					onBack: () => handleNavChange("inventory")
				})
			}),
			activeNav === "report" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthlyReportModal, {
					isOpen: true,
					isFullPage: true,
					onClose: handleGoBack,
					transactions,
					config,
					currencySymbol: config.currencySymbol,
					availableMonths,
					selectedMonth,
					onMonthChange: handleMonthChange
				})
			}),
			activeNav === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisualAnalytics, {
					transactions,
					currencySymbol: config.currencySymbol,
					onOpenCardDetail: handleCardClick
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "text-center py-6 text-xs text-slate-500 no-print",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-200/70 border border-slate-300/40 text-slate-600 font-medium",
					children: "💡 ড্যাশবোর্ডের যেকোনো রঙিন কার্ডে ক্লিক করে নির্দিষ্ট তথ্য ও লেনদেন দেখুন | ডিভাইসের ব্যাক বাটন কাজ করবে"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBottomNav, {
				activeNav: activeNav === "card_detail" ? "dashboard" : activeNav,
				onNavChange: handleNavChange,
				onOpenReportModal: handleOpenReportModal,
				selectedMonth,
				onMonthChange: handleMonthChange,
				onOpenNewMonthModal: () => {
					setIsNewMonthModalOpen(true);
					pushHistoryStep("new-month");
				},
				availableMonths,
				stats,
				config,
				isDarkMode,
				onToggleDarkMode: () => setIsDarkMode(!isDarkMode),
				isAdminLoggedIn,
				onOpenAdminLogin: () => {
					setIsAdminLoginModalOpen(true);
					pushHistoryStep("admin-login");
				},
				onAdminLogout: () => {
					if (onAdminLogout) onAdminLogout();
					setSyncToast({
						message: "এডমিন লগআউট সফল হয়েছে",
						type: "success"
					});
				},
				isDrawerOpen: isMobileDrawerOpen,
				onToggleDrawer: () => {
					if (!isMobileDrawerOpen) {
						pushHistoryStep("mobile_drawer", activeNav, { isDrawerOpen: true });
						setIsMobileDrawerOpen(true);
					} else {
						try {
							if (window.history.state && (window.history.state.isDrawerOpen || window.history.state.appStep === "mobile_drawer")) {
								window.history.back();
								return;
							}
						} catch {}
						setIsMobileDrawerOpen(false);
					}
				},
				onCloseDrawer: () => {
					try {
						if (window.history.state && (window.history.state.isDrawerOpen || window.history.state.appStep === "mobile_drawer")) {
							window.history.back();
							return;
						}
					} catch {}
					setIsMobileDrawerOpen(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDetailModal, {
				type: activeCardDetail,
				isOpen: isCardModalOpen,
				onClose: () => {
					setIsCardModalOpen(false);
					setActiveCardDetail(null);
				},
				transactions,
				salaries,
				staffList: effectiveStaffList,
				config,
				selectedMonth,
				onMonthChange: handleMonthChange,
				onOpenNewTransaction: handleOpenNewTransaction,
				onNavigateToStaff: () => handleNavChange("staff"),
				onNavigateToLedger: (filterType) => {
					if (filterType) setActiveTypeFilter(filterType);
					setIsCardModalOpen(false);
					setActiveCardDetail(null);
					handleNavChange("transactions");
				},
				onSelectTransaction: (txn) => {
					setSelectedTransaction(txn);
					setInitialEditInModal(false);
					setIsDetailModalOpen(true);
					pushHistoryStep("txn-detail");
				},
				onDeleteTransaction: handleDeleteTransaction,
				onViewSalarySlip: handleViewSalarySlip,
				isAdminLoggedIn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalarySlipModal, {
				salary: selectedSalarySlip,
				isOpen: isSalarySlipOpen,
				onClose: () => {
					setIsSalarySlipOpen(false);
					setSelectedSalarySlip(null);
				},
				config
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailModal, {
				transaction: selectedTransaction,
				isOpen: isDetailModalOpen,
				onClose: () => {
					setIsDetailModalOpen(false);
					setSelectedTransaction(null);
				},
				onUpdate: handleUpdateTransaction,
				onDelete: handleDeleteTransaction,
				currencySymbol: config.currencySymbol,
				initialEditMode: initialEditInModal,
				isAdminLoggedIn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewMonthModal, {
				isOpen: isNewMonthModalOpen,
				onClose: () => setIsNewMonthModalOpen(false),
				onConfirmMonth: handleAddNewMonth,
				currentSelectedMonth: selectedMonth,
				existingMonths: availableMonths,
				isAdminLoggedIn
			})
		]
	});
}
//#endregion
export { AyByayPortal };
