import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, Ft as EyeOff, H as RefreshCw, J as Plus, O as Sparkles, Pt as Eye, Q as PenLine, Qt as CircleAlert, Sn as ArrowLeft, h as Upload, n as X, rn as Check, x as Trash2, yt as Image } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { tt as sounds } from "./app.js";
import { t as useSubViewBack } from "./chunk-useSubViewBack.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
//#region src/components/BannerManagerModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MAX_BANNERS = 10;
var BannerManagerModal = ({ isOpen, banners, lang, onClose, onSaveBanners, onDeleteBanner, onSubViewChange }) => {
	const [bannerList, setBannerList] = (0, import_react.useState)(banners || []);
	const [editingBanner, setEditingBanner] = (0, import_react.useState)(null);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [uploadedFileName, setUploadedFileName] = (0, import_react.useState)("");
	const [imageInputMethod, setImageInputMethod] = (0, import_react.useState)("upload");
	const [inputImageUrl, setInputImageUrl] = (0, import_react.useState)("");
	const [badgeBn, setBadgeBn] = (0, import_react.useState)("");
	const [badgeEn, setBadgeEn] = (0, import_react.useState)("");
	const [titleBn, setTitleBn] = (0, import_react.useState)("");
	const [titleEn, setTitleEn] = (0, import_react.useState)("");
	const [subtitleBn, setSubtitleBn] = (0, import_react.useState)("");
	const [subtitleEn, setSubtitleEn] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [linkUrl, setLinkUrl] = (0, import_react.useState)("");
	const [selectedLinkType, setSelectedLinkType] = (0, import_react.useState)("none");
	const [isFormActive, setIsFormActive] = (0, import_react.useState)(true);
	const [deleteConfirmId, setDeleteConfirmId] = (0, import_react.useState)(null);
	const [validationError, setValidationError] = (0, import_react.useState)(null);
	useSubViewBack(isOpen, (editingBanner || isCreating ? 1 : 0) + (deleteConfirmId ? 1 : 0) + (validationError ? 1 : 0), () => {
		if (validationError) setValidationError(null);
		else if (deleteConfirmId) setDeleteConfirmId(null);
		else if (editingBanner || isCreating) {
			setEditingBanner(null);
			setIsCreating(false);
		}
	}, onSubViewChange, "bannerManager");
	import_react.useEffect(() => {
		if (Array.isArray(banners)) setBannerList(banners);
	}, [banners, isOpen]);
	if (!isOpen) return null;
	const internalLinks = [
		{
			id: "#home",
			bn: "🏠 হোম (ড্যাশবোর্ড)",
			en: "🏠 Home Dashboard"
		},
		{
			id: "#weather",
			bn: "🌦️ ৭ দিনের লাইভ আবহাওয়া",
			en: "🌦️ 7-Day Weather"
		},
		{
			id: "#transactions",
			bn: "📊 লেনদেন তালিকা ও চ্যানেল",
			en: "📊 All Transactions"
		},
		{
			id: "#ledger",
			bn: "🧾 হিসাব খাতা (রিপোর্ট)",
			en: "🧾 Accounts Ledger"
		},
		{
			id: "#profile",
			bn: "👤 প্রোফাইল ও সেটিংস",
			en: "👤 User Profile"
		},
		{
			id: "#category:bill",
			bn: "📡 ইন্টারনেট বিল কালেকশন",
			en: "📡 Internet Bill Collection"
		},
		{
			id: "#category:bKash",
			bn: "📱 বিকাশ লেনদেন",
			en: "📱 bKash Trx"
		},
		{
			id: "#category:Nagad",
			bn: "💵 নগদ লেনদেন",
			en: "💵 Nagad Trx"
		},
		{
			id: "#portal:bill-manager",
			bn: "⚡ বিল ম্যানেজমেন্ট প্রো",
			en: "⚡ Bill Management Pro"
		},
		{
			id: "#portal:ay-byay",
			bn: "💰 আয়-ব্যয় হিসাব খাতা",
			en: "💰 Income-Expense accounts"
		},
		{
			id: "#notifications",
			bn: "🔔 নোটিফিকেশন সেন্টার",
			en: "🔔 Notifications"
		},
		{
			id: "#offer",
			bn: "🏷️ অফার পেইজ",
			en: "🏷️ Current Offers"
		},
		{
			id: "#store",
			bn: "📍 স্টোর লোকেশন",
			en: "📍 Branch/Store"
		},
		{
			id: "#help",
			bn: "❓ হেল্পলাইন ও সাপোর্ট",
			en: "❓ Help & Support"
		},
		{
			id: "tel:01777877207",
			bn: "📞 হেল্পলাইন কল (01777877207)",
			en: "📞 Call 01777877207"
		}
	];
	const quickBadges = [
		{
			bn: "ধামাকা অফার",
			en: "Mega Offer"
		},
		{
			bn: "ক্যাশব্যাক বোনাস",
			en: "Cashback"
		},
		{
			bn: "উইকেন্ড স্পেশাল",
			en: "Weekend Deal"
		},
		{
			bn: "ফাইবার কম্বো",
			en: "Fiber Combo"
		},
		{
			bn: "জরুরি সেবা",
			en: "Helpline"
		}
	];
	const handleDeviceFileUpload = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		setUploadedFileName(file.name);
		try {
			const compressedDataUrl = await compressImage(file, 900, 500, .85);
			setImageUrl(compressedDataUrl);
			setInputImageUrl("");
			sounds.playSuccess();
		} catch (err) {
			console.error("Error uploading banner image:", err);
		}
	};
	const handleStartEdit = (b) => {
		sounds.playTap();
		setEditingBanner(b);
		setIsCreating(false);
		setBadgeBn(b.badgeBn || "");
		setBadgeEn(b.badgeEn || "");
		setTitleBn(b.titleBn || "");
		setTitleEn(b.titleEn || "");
		setSubtitleBn(b.subtitleBn || "");
		setSubtitleEn(b.subtitleEn || "");
		const currentImg = b.imageUrl || "";
		setImageUrl(currentImg);
		if (currentImg.startsWith("data:")) {
			setImageInputMethod("upload");
			setUploadedFileName("ডিভাইসের ছবি");
			setInputImageUrl("");
		} else if (currentImg) {
			setImageInputMethod("url");
			setInputImageUrl(currentImg);
			setUploadedFileName("");
		} else {
			setImageInputMethod("upload");
			setInputImageUrl("");
			setUploadedFileName("");
		}
		const currentLink = (b.linkUrl || "").trim();
		setLinkUrl(currentLink);
		setIsFormActive(b.isActive !== false);
		if (!currentLink || currentLink === "#" || currentLink === "none") setSelectedLinkType("none");
		else if (internalLinks.some((l) => l.id === currentLink)) setSelectedLinkType("internal");
		else setSelectedLinkType("custom");
	};
	const handleStartCreate = () => {
		if (bannerList.length >= MAX_BANNERS) {
			setValidationError(lang === "bn" ? `বর্তমানে সর্বোচ্চ ${MAX_BANNERS}টি বিজ্ঞাপন রাখা যাবে!` : `Maximum limit of ${MAX_BANNERS} ads reached!`);
			return;
		}
		sounds.playTap();
		setEditingBanner(null);
		setIsCreating(true);
		setBadgeBn("");
		setBadgeEn("");
		setTitleBn("");
		setTitleEn("");
		setSubtitleBn("");
		setSubtitleEn("");
		setImageUrl("");
		setInputImageUrl("");
		setImageInputMethod("upload");
		setLinkUrl("");
		setSelectedLinkType("none");
		setUploadedFileName("");
		setIsFormActive(true);
	};
	const handleToggleActive = (id) => {
		sounds.playTap();
		const updated = bannerList.map((b) => b.id === id ? {
			...b,
			isActive: !b.isActive
		} : b);
		setBannerList(updated);
		onSaveBanners(updated);
	};
	const handleDelete = (id) => {
		sounds.playTap();
		setDeleteConfirmId(id);
	};
	const confirmDelete = () => {
		if (!deleteConfirmId) return;
		const targetId = deleteConfirmId;
		const updated = bannerList.filter((b) => b.id !== targetId);
		setBannerList(updated);
		if (onDeleteBanner) onDeleteBanner(targetId);
		onSaveBanners(updated);
		setDeleteConfirmId(null);
		sounds.playSuccess();
	};
	const handleSaveForm = (e) => {
		e.preventDefault();
		const finalImageUrl = (imageInputMethod === "url" ? inputImageUrl : imageUrl).trim();
		if (!finalImageUrl) {
			setValidationError(lang === "bn" ? "অনুগ্রহ করে ডিভাইস থেকে ছবি আপলোড করুন অথবা একটি ছবির লিংক দিন" : "Please upload an image from your device or enter an image URL");
			return;
		}
		sounds.playSuccess();
		const finalBadgeBn = badgeBn.trim();
		const finalBadgeEn = badgeEn.trim();
		const finalTitleBn = titleBn.trim();
		const finalTitleEn = titleEn.trim();
		const finalSubtitleBn = subtitleBn.trim();
		const finalSubtitleEn = subtitleEn.trim();
		const finalLinkUrl = selectedLinkType === "none" ? "#" : linkUrl.trim() || "#";
		if (editingBanner) {
			const updated = bannerList.map((b) => {
				if (b.id === editingBanner.id) return {
					...b,
					badgeBn: finalBadgeBn,
					badgeEn: finalBadgeEn,
					titleBn: finalTitleBn,
					titleEn: finalTitleEn,
					subtitleBn: finalSubtitleBn,
					subtitleEn: finalSubtitleEn,
					imageUrl: finalImageUrl,
					linkUrl: finalLinkUrl,
					isActive: isFormActive
				};
				return b;
			});
			setBannerList(updated);
			onSaveBanners(updated);
		} else {
			const updated = [{
				id: `banner-${Date.now()}`,
				badgeBn: finalBadgeBn,
				badgeEn: finalBadgeEn,
				titleBn: finalTitleBn,
				titleEn: finalTitleEn,
				subtitleBn: finalSubtitleBn,
				subtitleEn: finalSubtitleEn,
				imageUrl: finalImageUrl,
				linkUrl: finalLinkUrl,
				isActive: isFormActive,
				priority: bannerList.length + 1
			}, ...bannerList];
			setBannerList(updated);
			onSaveBanners(updated);
		}
		setEditingBanner(null);
		setIsCreating(false);
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
						className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "বিজ্ঞাপন নিয়ন্ত্রণ (অ্যাডমিন প্যানেল)" : "Ads Control (Admin Only)" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-slate-500 dark:text-slate-400 font-medium",
						children: lang === "bn" ? `বিজ্ঞাপন স্লট: ${bannerList.length}/${MAX_BANNERS} টি (৫-৭ টি রাখা যাবে)` : `Slots: ${bannerList.length}/${MAX_BANNERS} (5-7 recommended)`
					})] })]
				}), !isCreating && !editingBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleStartCreate,
					disabled: bannerList.length >= MAX_BANNERS,
					className: `h-9 px-3 rounded-xl text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all ${bannerList.length >= MAX_BANNERS ? "bg-slate-400 cursor-not-allowed opacity-60" : "bg-[#E52E2E] hover:bg-rose-700"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "নতুন বিজ্ঞাপন" : "Add Ad" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#E52E2E] animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-[11px]",
							children: lang === "bn" ? "মেইন পেইজে বিজ্ঞাপন স্লাইডার স্বয়ংক্রিয়ভাবে প্রদর্শন হবে। এডমিন যেকোনো সময় এডিট বা ডিলিট করতে পারবেন।" : "Homepage ads slider displays automatically. Admin can edit or delete anytime."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 font-extrabold text-[#E52E2E] text-xs shadow-2xs",
						children: [
							bannerList.length,
							" / ",
							MAX_BANNERS
						]
					})]
				}), isCreating || editingBanner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveForm,
					className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingBanner ? lang === "bn" ? "বিজ্ঞাপন সম্পাদনা" : "Edit Banner Ad" : lang === "bn" ? "নতুন বিজ্ঞাপন ব্যানার যোগ" : "Add New Banner Ad" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setEditingBanner(null);
									setIsCreating(false);
								},
								className: "text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
								children: lang === "bn" ? "বাতিল" : "Cancel"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
								children: lang === "bn" ? "লাইভ প্রিভিউ (মেইন পেইজে যেভাবে দেখাবে)" : "Live Preview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
								children: badgeBn.trim() || titleBn.trim() || subtitleBn.trim() ? lang === "bn" ? "টেক্সট + ছবি মোড" : "Text + Image Mode" : lang === "bn" ? "✨ শুধু ছবি মোড (ক্লিন)" : "✨ Pure Image Mode"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-26 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-900 shadow-sm",
							children: [imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageUrl,
								alt: "Preview",
								referrerPolicy: "no-referrer",
								className: "w-full h-full object-cover object-center"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full h-full flex flex-col items-center justify-center bg-slate-800/80 text-slate-400 p-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-8 h-8 mb-1.5 opacity-40 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold",
									children: lang === "bn" ? "নিচে থেকে ডিভাইস ছবি আপলোড করুন" : "Upload banner image from device"
								})]
							}), badgeBn.trim() || titleBn.trim() || subtitleBn.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15 flex items-center justify-between px-3.5 py-2.5 text-white pointer-events-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 pr-2",
									children: [
										badgeBn.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#E52E2E] text-white uppercase shadow-2xs",
												children: badgeBn.trim()
											})
										}),
										titleBn.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold leading-tight line-clamp-1 drop-shadow-sm text-white",
											children: titleBn.trim()
										}),
										subtitleBn.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-200 line-clamp-1 mt-0.5 opacity-90",
											children: subtitleBn.trim()
										})
									]
								}), selectedLinkType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/25",
									children: lang === "bn" ? "বিস্তারিত >" : "Details >"
								})]
							}) : imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white/90 font-medium pointer-events-none border border-white/10",
								children: lang === "bn" ? "শুধু ছবি প্রদর্শন • কোনো লেখা নেই" : "Clean Image (No Overlay Text)"
							}) : null]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-700 dark:text-slate-300",
								children: lang === "bn" ? "দ্রুত অফার ব্যাজ পছন্দ করুন (সিলেক্ট / আনসিলেক্ট করতে ট্যাপ করুন):" : "Quick Badges (Tap to select/unselect):"
							}), badgeBn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setBadgeBn("");
									setBadgeEn("");
								},
								className: "text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "ব্যাজ মুছুন" : "Clear" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [quickBadges.map((qb, i) => {
								const isSelected = badgeBn === qb.bn;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										sounds.playTap();
										if (isSelected) {
											setBadgeBn("");
											setBadgeEn("");
										} else {
											setBadgeBn(qb.bn);
											setBadgeEn(qb.en);
										}
									},
									className: `px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${isSelected ? "bg-[#E52E2E] text-white shadow-sm ring-2 ring-rose-400/40" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
									children: [isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: qb.bn })]
								}, i);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setBadgeBn("");
									setBadgeEn("");
								},
								className: `px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${!badgeBn ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200" : "border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`,
								children: lang === "bn" ? "কোনো ব্যাজ নয়" : "No Badge"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-slate-300",
									children: lang === "bn" ? "বিজ্ঞাপনের ছবি যুক্ত করুন (ডিভাইস অথবা লিংক):" : "Add Banner Image (Device or Link):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setImageInputMethod("upload");
										},
										className: `py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${imageInputMethod === "upload" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "📁 ডিভাইস আপলোড" : "📁 Upload File" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setImageInputMethod("url");
										},
										className: `py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${imageInputMethod === "url" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-xs" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "🔗 ছবির লিংক (URL)" : "🔗 Image Link (URL)" })]
									})]
								}),
								imageInputMethod === "upload" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileInputRef,
										type: "file",
										accept: "image/*",
										onChange: handleDeviceFileUpload,
										className: "hidden"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											var _fileInputRef$current;
											return (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
										},
										className: "w-full h-14 px-4 rounded-2xl border-2 border-dashed border-[#E52E2E] bg-rose-50/70 dark:bg-rose-950/20 text-[#E52E2E] dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-rose-100 active:scale-98 transition-all shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-5 h-5 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "📁 ডিভাইস থেকে ছবি সিলেক্ট করুন (Phone / PC)" : "📁 Choose Image from Device" })]
									}),
									uploadedFileName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-emerald-800 dark:text-emerald-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold truncate max-w-[220px]",
												children: uploadedFileName
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setUploadedFileName("");
												setImageUrl("");
											},
											className: "text-slate-400 hover:text-rose-600",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
										})]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "url",
											value: inputImageUrl,
											onChange: (e) => {
												const val = e.target.value;
												setInputImageUrl(val);
												setImageUrl(val.trim());
											},
											placeholder: lang === "bn" ? "ছবির লিংক পেস্ট করুন (যেমন: https://.../image.jpg)" : "Paste Image URL (https://...)",
											className: "flex-1 h-11 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
										}), inputImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setInputImageUrl("");
												setImageUrl("");
											},
											className: "w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-600 shrink-0",
											title: "মুছুন",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: lang === "bn" ? "অনলাইন বা ইন্টারনেটের যেকোনো ব্যানার ইমেজের সরাসরি ওয়েব লিংক (URL) এখানে পেস্ট করুন।" : "Paste any direct web link (URL) of an image here."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: lang === "bn" ? "ব্যাজ (বাংলা - ঐচ্ছিক)" : "Badge (Bangla)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: badgeBn,
								onChange: (e) => setBadgeBn(e.target.value),
								placeholder: "খালি রাখতে পারেন",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
								children: lang === "bn" ? "Badge (English - Optional)" : "Badge (English)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: badgeEn,
								onChange: (e) => setBadgeEn(e.target.value),
								placeholder: "Optional",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: lang === "bn" ? "বিজ্ঞাপনের মূল শিরোনাম (ঐচ্ছিক - শুধু ছবি দিলে খালি রাখুন)" : "Ad Title (Optional - leave blank for image only)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: titleBn,
							onChange: (e) => setTitleBn(e.target.value),
							placeholder: "যেমন: ক্যাবল ও ইন্টারনেট বিল পরিশোধে ক্যাশব্যাক (খালি রাখা যাবে)",
							className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: lang === "bn" ? "Ad Title (English - Optional)" : "Ad Title (English)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: titleEn,
							onChange: (e) => setTitleEn(e.target.value),
							placeholder: "Optional",
							className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: lang === "bn" ? "বিবরণ / সাবটাইটেল (বাংলা - ঐচ্ছিক)" : "Subtitle (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: subtitleBn,
							onChange: (e) => setSubtitleBn(e.target.value),
							placeholder: "ঐচ্ছিক - খালি রাখতে পারেন",
							className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
								children: lang === "bn" ? "অ্যাকশন লিংক বা গন্তব্য পেইজ (ঐচ্ছিক)" : "Action Link or Destination Page (Optional)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-2 border border-slate-200 dark:border-slate-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedLinkType("none");
											setLinkUrl("");
										},
										className: `py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${selectedLinkType === "none" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm" : "text-slate-500 dark:text-slate-400"}`,
										children: lang === "bn" ? "কোনো লিংক নয়" : "No Link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedLinkType("internal");
											setLinkUrl(internalLinks[0].id);
										},
										className: `py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${selectedLinkType === "internal" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm" : "text-slate-500 dark:text-slate-400"}`,
										children: lang === "bn" ? "অ্যাপ পেইজ" : "App Pages"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setSelectedLinkType("custom");
											setLinkUrl("#");
										},
										className: `py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${selectedLinkType === "custom" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-sm" : "text-slate-500 dark:text-slate-400"}`,
										children: lang === "bn" ? "কাস্টম লিংক" : "Custom URL"
									})
								]
							}),
							selectedLinkType === "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "ছবিতে ক্লিক করলে কোনো পেজ বা রিডাইরেক্ট হবে না, শুধু সুন্দরভাবে প্রদর্শিত থাকবে।" : "Ad will display purely as a visual banner with no click action." })]
							}) : selectedLinkType === "internal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: linkUrl,
									onChange: (e) => setLinkUrl(e.target.value),
									className: "w-full h-11 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-[#E52E2E]",
									children: internalLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: link.id,
										children: lang === "bn" ? link.bn : link.en
									}, link.id))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: linkUrl,
								onChange: (e) => setLinkUrl(e.target.value),
								placeholder: lang === "bn" ? "লিংক লিখুন (https://...)" : "Enter link (https://...)",
								className: "w-full h-11 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#E52E2E]"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5",
								children: [isFormActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "বিজ্ঞাপনের স্ট্যাটাস" : "Ad Visibility Status" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
								children: isFormActive ? lang === "bn" ? "হোমপেজে সক্রিয় ও স্লাইডারে দৃশ্যমান থাকবে" : "Active and visible in homepage slider" : lang === "bn" ? "লুকানো (Inactive) থাকবে, হোমপেজে স্বয়ংক্রিয়ভাবে চালু হবে না" : "Hidden/Inactive, will not display on homepage"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									sounds.playTap();
									setIsFormActive((prev) => !prev);
								},
								className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isFormActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFormActive ? "translate-x-5" : "translate-x-0"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "w-full h-12 rounded-2xl bg-gradient-to-r from-[#D32F2F] to-[#E52E2E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-98 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isFormActive ? lang === "bn" ? "সংরক্ষণ করুন ও হোমপেজে সক্রিয় রাখুন" : "Save & Set Active" : lang === "bn" ? "সংরক্ষণ করুন (লুকানো/নিষ্ক্রিয় রাখুন)" : "Save as Hidden/Inactive" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: bannerList.map((banner, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: banner.imageUrl,
									alt: banner.titleBn || "Banner",
									referrerPolicy: "no-referrer",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-black/70 text-white text-[9px] font-bold",
									children: ["#", index + 1]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 mb-1",
										children: [banner.badgeBn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E52E2E] dark:bg-rose-950/40",
											children: lang === "bn" ? banner.badgeBn : banner.badgeEn
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
											children: lang === "bn" ? "🖼️ শুধু ছবি" : "🖼️ Image only"
										}), banner.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-bold text-emerald-600",
											children: "● সক্রিয় (Live)"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] font-semibold text-slate-400",
											children: "○ নিষ্ক্রিয়"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold text-slate-900 dark:text-white line-clamp-1",
										children: banner.titleBn || (lang === "bn" ? "(কোনো লেখা ছাড়া শুধু ছবি)" : "(Pure Image Banner)")
									}),
									banner.subtitleBn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5",
										children: lang === "bn" ? banner.subtitleBn : banner.subtitleEn
									}) : null
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleToggleActive(banner.id),
								className: `flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${banner.isActive ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40" : "text-slate-500 bg-slate-100 dark:bg-slate-800"}`,
								children: [banner.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: banner.isActive ? lang === "bn" ? "হোমপেজে দৃশ্যমান" : "Live" : lang === "bn" ? "লুকানো" : "Hidden" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleStartEdit(banner),
									className: "px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "এডিট" : "Edit" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDelete(banner.id),
									className: "w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] hover:bg-rose-100 flex items-center justify-center transition-colors",
									title: "মুছুন",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
								})]
							})]
						})]
					}, banner.id))
				})]
			}),
			deleteConfirmId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-8 h-8 text-rose-600" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
							children: lang === "bn" ? "বিজ্ঞাপনটি মুছে ফেলতে চান?" : "Confirm Delete?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500 dark:text-slate-400 mb-6",
							children: lang === "bn" ? "এই বিজ্ঞাপন ব্যানারটি হোমপেজ স্লাইডার থেকে স্থায়ীভাবে সরিয়ে ফেলা হবে।" : "This banner will be permanently removed from the homepage slider."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleteConfirmId(null),
								className: "flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm active:scale-95 transition-all",
								children: lang === "bn" ? "বাতিল" : "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: confirmDelete,
								className: "flex-1 py-3 rounded-xl bg-[#E52E2E] text-white font-bold text-sm shadow-md shadow-rose-600/20 active:scale-95 transition-all",
								children: lang === "bn" ? "ঠিক আছে" : "Delete"
							})]
						})
					]
				})
			}),
			validationError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center mx-auto mb-4 border border-orange-100 dark:border-orange-900/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-8 h-8 text-orange-600" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
							children: lang === "bn" ? "সতর্কতা" : "Attention"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-slate-500 dark:text-slate-400 mb-6",
							children: validationError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setValidationError(null),
							className: "w-full py-3 rounded-xl bg-[#E52E2E] text-white font-bold text-sm shadow-md shadow-rose-600/20 active:scale-95 transition-all",
							children: lang === "bn" ? "ঠিক আছে" : "OK"
						})
					]
				})
			})
		]
	});
};
//#endregion
export { BannerManagerModal };
