import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { C as Sunset, En as require_react, S as Tag, Sn as ArrowLeft, Wt as Compass, Yt as Clock, rn as Check, st as MapPin, tt as Moon, un as Calendar, x as Trash2 } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { t as formatCurrency } from "./chunk-formatters.js";
import { tt as sounds } from "./app.js";
import { r as DEFAULT_HEADQUARTERS_DISTRICT, t as ALL_BANGLADESH_DISTRICTS } from "./chunk-weatherService.js";
import { calculateLocalPrayerTimes, getActiveFastingCardData } from "./chunk-prayerTimeService.js";
//#region src/components/NotificationDetailModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var NotificationDetailModal = ({ notification, lang, user, onClose, onDelete, onMarkAsRead, onEdit, onOpenWeather, onOpenPrayerTimes, onOpenRamadanSchedule }) => {
	const [showDeleteConfirm, setShowDeleteConfirm] = (0, import_react.useState)(false);
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const isFasting = Boolean((notification === null || notification === void 0 ? void 0 : notification.sehriIftarData) || (notification === null || notification === void 0 ? void 0 : notification.isFastingAlert));
	(0, import_react.useEffect)(() => {
		if (!notification || !isFasting) return;
		setNow(/* @__PURE__ */ new Date());
		const timer = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(timer);
	}, [notification, isFasting]);
	const liveFastingSnapshot = (0, import_react.useMemo)(() => {
		var _notification$sehriIf, _notification$sehriIf2;
		if (!notification || !isFasting) return null;
		const targetEn = ((_notification$sehriIf = notification.sehriIftarData) === null || _notification$sehriIf === void 0 ? void 0 : _notification$sehriIf.districtEn) || notification.districtEn;
		const targetBn = ((_notification$sehriIf2 = notification.sehriIftarData) === null || _notification$sehriIf2 === void 0 ? void 0 : _notification$sehriIf2.districtBn) || notification.districtBn;
		const matchedDistrict = ALL_BANGLADESH_DISTRICTS.find((d) => targetEn && d.nameEn.toLowerCase() === targetEn.toLowerCase() || targetBn && d.nameBn === targetBn) || DEFAULT_HEADQUARTERS_DISTRICT;
		const timings = calculateLocalPrayerTimes(matchedDistrict, now);
		return {
			district: matchedDistrict,
			timings,
			card: getActiveFastingCardData(timings, now)
		};
	}, [
		notification,
		isFasting,
		now
	]);
	if (!notification) return null;
	const isBn = lang === "bn";
	const isAdmin = (user === null || user === void 0 ? void 0 : user.role) === "admin";
	const sData = notification.sehriIftarData;
	const locationSourceLabel = (src) => {
		if (src === "gps") return isBn ? "লাইভ GPS" : "Live GPS";
		if (src === "ip") return isBn ? "অটো লোকেশন" : "Auto Location";
		if (src === "manual") return isBn ? "নির্বাচিত জেলা" : "Selected District";
		return isBn ? "লোকেশন ভিত্তিক" : "Location Based";
	};
	const getTypeLabel = (type) => {
		if (isFasting) return isBn ? "সেহরি ও ইফতার সময়সূচী" : "Sehri & Iftar Schedule";
		switch (type) {
			case "alert": return isBn ? "জরুরি সতর্কবার্তা" : "Severe Alert";
			case "weather": return isBn ? "আবহাওয়া বুলেটিন" : "Weather Bulletin";
			case "offer": return isBn ? "বিশেষ অফার" : "Special Offer";
			case "cashback": return isBn ? "ক্যাশব্যাক বোনাস" : "Cashback Reward";
			case "trx": return isBn ? "লেনদেন বার্তা" : "Transaction Alert";
			default: return isBn ? "সিস্টেম ঘোষণা" : "System Notice";
		}
	};
	const getTypeColor = (type) => {
		if (isFasting) return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
		switch (type) {
			case "alert": return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300";
			case "weather": return "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300";
			case "offer": return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200";
			case "cashback": return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200";
			case "trx": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200";
			default: return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200";
		}
	};
	const showWeatherCta = (notification.type === "weather" || notification.type === "alert" && !isFasting && !notification.isPrayerAlert) && Boolean(onOpenWeather);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center select-none animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sounds.playTap();
								onClose();
							},
							className: "w-11 h-11 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer",
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-slate-900 dark:text-white",
							children: isFasting ? isBn ? "সেহরি ও ইফতার সময়সূচী" : "Sehri & Iftar Schedule" : isBn ? "নোটিফিকেশন বিস্তারিত" : "Notification Details"
						}),
						isAdmin && onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sounds.playTap();
								setShowDeleteConfirm(true);
							},
							className: "w-11 h-11 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center active:scale-95 transition-all cursor-pointer",
							title: isBn ? "মুছে ফেলুন" : "Delete",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [isFasting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getTypeLabel(notification.type) })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getTypeColor(notification.type)}`,
								children: getTypeLabel(notification.type)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? notification.timeBn : notification.timeEn })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-black text-slate-950 dark:text-white leading-tight",
							children: isBn ? notification.titleBn : notification.titleEn
						}),
						isFasting && liveFastingSnapshot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-gradient-to-br from-[#003d32] via-[#002f26] to-[#001a15] border border-emerald-500/35 text-white shadow-xl overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 sm:p-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 font-black text-amber-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(sData === null || sData === void 0 ? void 0 : sData.districtBn) || liveFastingSnapshot.district.nameBn, (sData === null || sData === void 0 ? void 0 : sData.divisionBn) || liveFastingSnapshot.district.divisionBn ? ` (${(sData === null || sData === void 0 ? void 0 : sData.divisionBn) || liveFastingSnapshot.district.divisionBn} বিভাগ)` : ""] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-emerald-200/85",
											children: locationSourceLabel(sData === null || sData === void 0 ? void 0 : sData.locationSource)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-bold text-emerald-200/80 flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (sData === null || sData === void 0 ? void 0 : sData.hijriDateBn) || liveFastingSnapshot.card.hijriFormattedBn }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: (sData === null || sData === void 0 ? void 0 : sData.dateStrBn) || liveFastingSnapshot.timings.dateStr })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl bg-[#001f19]/90 border border-emerald-600/30 p-3.5 space-y-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-black text-emerald-300",
													children: liveFastingSnapshot.card.phaseTitleBn
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] font-bold text-emerald-100/75 mt-0.5 truncate",
													children: liveFastingSnapshot.card.countdownLabelBn
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-2xl sm:text-3xl font-black text-amber-300 font-mono tabular-nums tracking-tight shrink-0",
												children: liveFastingSnapshot.card.countdownTimeBn
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 bg-[#00130f] rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-700",
												style: { width: `${Math.max(4, liveFastingSnapshot.card.progressPercent)}%` }
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl bg-[#0b382f]/90 border border-emerald-500/30 p-3.5 text-center space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-200/85",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-3.5 h-3.5 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সেহরির শেষ সময়" : "Sehri End" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xl sm:text-2xl font-black text-amber-300 tabular-nums",
												children: (sData === null || sData === void 0 ? void 0 : sData.sehriEndBn) || liveFastingSnapshot.card.sehriEndBn
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl bg-[#0b382f]/90 border border-amber-400/30 p-3.5 text-center space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-200/85",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sunset, { className: "w-3.5 h-3.5 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "আজকের ইফতার" : "Today Iftar" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xl sm:text-2xl font-black text-amber-300 tabular-nums",
												children: (sData === null || sData === void 0 ? void 0 : sData.iftarBn) || liveFastingSnapshot.card.iftarBn
											})]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 divide-x divide-emerald-800/45 border-t border-emerald-800/45 bg-[#001e18] text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-3 px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-emerald-200/70",
											children: isBn ? "ফজর শুরু" : "Fajr"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm font-black text-white tabular-nums mt-0.5",
											children: (sData === null || sData === void 0 ? void 0 : sData.fajrBn) || liveFastingSnapshot.card.fajrBn
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-3 px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-emerald-200/70",
											children: isBn ? "সূর্যোদয়" : "Sunrise"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm font-black text-white tabular-nums mt-0.5",
											children: (sData === null || sData === void 0 ? void 0 : sData.sunriseBn) || liveFastingSnapshot.timings.sunrise
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-3 px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] font-bold text-emerald-200/70",
											children: isBn ? "রোজার ব্যাপ্তি" : "Duration"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] sm:text-xs font-black text-emerald-300 tabular-nums mt-1",
											children: (sData === null || sData === void 0 ? void 0 : sData.fastDurationBn) || liveFastingSnapshot.card.fastDurationBn
										})]
									})
								]
							})]
						}),
						notification.amount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/30 border border-rose-200/60 dark:border-rose-900/40 shadow-inner flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-4 h-4 text-[#E52E2E]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সংযুক্ত পরিমাণ / বোনাস:" : "Attached Amount:" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-black text-[#E52E2E] dark:text-rose-400 tabular-nums tracking-tighter",
								children: formatCurrency(notification.amount, lang)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4",
							children: [
								notification.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: notification.image,
									alt: "Notification",
									className: "w-full h-auto rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-700",
									onError: (e) => e.currentTarget.style.display = "none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[14.5px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium",
									children: isBn ? (notification.bodyBn || notification.messageBn || "").replace(/পরামর্শ:\s*(পরামর্শ:|সতর্কবার্তা:|সতর্কতা:|সুসংবাদ:|বার্তা:)/g, "$1") : notification.bodyEn || notification.messageEn || ""
								}),
								isFasting && (onOpenRamadanSchedule || onOpenPrayerTimes) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 space-y-2.5",
									children: [onOpenRamadanSchedule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											onClose();
											onOpenRamadanSchedule();
										},
										className: "w-full min-h-[46px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-[0.98] transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-amber-300 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সম্পূর্ণ সেহরি ও ইফতার ক্যালেন্ডার দেখুন" : "View Full Sehri & Iftar Calendar" })]
									}), onOpenPrayerTimes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											onClose();
											onOpenPrayerTimes();
										},
										className: "w-full min-h-[44px] py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-[0.98] transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নামাজের সময়সূচী ও জেলা পরিবর্তন করুন" : "Prayer Times & Change District" })]
									})]
								}),
								showWeatherCta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											sounds.playTap();
											onClose();
											onOpenWeather();
										},
										className: "w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-98 transition-all cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🌤️ ", isBn ? "সম্পূর্ণ ৭ দিনের আবহাওয়া ও অ্যানিমেশন দেখুন" : "View Full 7-Day Weather & Animations"] })
									})
								}),
								!isFasting && (notification.isPrayerAlert || notification.titleBn.includes("🕌") || notification.titleBn.includes("সালাত") || notification.bodyBn.includes("নামাজ")) && onOpenPrayerTimes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											sounds.playTap();
											onClose();
											onOpenPrayerTimes();
										},
										className: "w-full min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🕌 ", isBn ? "সম্পূর্ণ জেলার নামাজের সময়সূচি ও সূর্যোদয় দেখুন" : "View Full Prayer & Sun Schedule"] })
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রেরক: প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "From: Protyasha Cable Network" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] opacity-70",
								children: ["#", notification.id.slice(-6).toUpperCase()]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							if (onMarkAsRead) onMarkAsRead(notification.id);
							onClose();
						},
						className: "flex-1 h-12 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পড়েছি / সম্পন্ন" : "Mark as Read & Close" })]
					}), isAdmin && !isFasting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							if (onEdit) onEdit(notification);
						},
						className: "h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center cursor-pointer",
						children: "✎"
					})]
				})
			]
		})
	}), showDeleteConfirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-8 h-8 text-rose-600" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
					children: isBn ? "মুছে ফেলতে চান?" : "Confirm Delete?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-slate-600 dark:text-slate-400 mb-6",
					children: isBn ? "এই নোটিফিকেশনটি স্থায়ীভাবে মুছে ফেলা হবে।" : "This notification will be permanently deleted."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowDeleteConfirm(false),
						className: "flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer",
						children: isBn ? "বাতিল" : "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (onDelete) onDelete(notification.id);
							onClose();
						},
						className: "flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold cursor-pointer",
						children: isBn ? "ঠিক আছে" : "OK"
					})]
				})
			]
		})
	})] });
};
//#endregion
export { NotificationDetailModal };
