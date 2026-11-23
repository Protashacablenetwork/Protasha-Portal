import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { B as Save, En as require_react, Ft as EyeOff, J as Plus, O as Sparkles, Pt as Eye, S as Tag, Sn as ArrowLeft, Wt as Compass, ft as LoaderCircle, h as Upload, n as X, rn as Check, x as Trash2, yt as Image } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { U as showConfirm, tt as sounds } from "./app.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
//#region src/components/FooterSettingsModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PAGE_AND_CATEGORY_PRESETS = [
	{
		groupBn: "মূল পেজসমূহ (Pages)",
		groupEn: "Main Site Pages",
		items: [
			{
				id: "#home",
				labelBn: "🏠 হোম পেজ (ড্যাশবোর্ড)",
				labelEn: "🏠 Home Dashboard",
				shortBn: "হোম"
			},
			{
				id: "#transactions",
				labelBn: "📊 লেনদেন ও স্টেটমেন্ট তালিকা",
				labelEn: "📊 All Transactions",
				shortBn: "লেনদেন"
			},
			{
				id: "#ledger",
				labelBn: "🧾 হিসাব খাতা ও রিপোর্ট",
				labelEn: "🧾 Accounts Ledger",
				shortBn: "হিসাব খাতা"
			},
			{
				id: "#profile",
				labelBn: "👤 মেনু ও প্রোফাইল",
				labelEn: "👤 Menu & Profile",
				shortBn: "প্রোফাইল"
			},
			{
				id: "#weather",
				labelBn: "🌦️ ৭ দিনের লাইভ আবহাওয়া",
				labelEn: "🌦️ 7-Day Weather",
				shortBn: "আবহাওয়া"
			},
			{
				id: "#notifications",
				labelBn: "🔔 নোটিফিকেশন সেন্টার",
				labelEn: "🔔 Notifications",
				shortBn: "নোটিফিকেশন"
			},
			{
				id: "#portal:bill-manager",
				labelBn: "⚡ বিল ম্যানেজমেন্ট প্রো",
				labelEn: "⚡ Bill Manager Pro",
				shortBn: "বিল প্রো"
			},
			{
				id: "#portal:ay-byay",
				labelBn: "💰 আয়-ব্যয় স্মার্ট খাতা",
				labelEn: "💰 Income-Expense",
				shortBn: "আয়-ব্যয়"
			}
		]
	},
	{
		groupBn: "লেনদেন ক্যাটাগরি (Categories)",
		groupEn: "Transaction Categories",
		items: [
			{
				id: "#category:all",
				labelBn: "🌐 সকল ক্যাটাগরি ফিল্টার",
				labelEn: "🌐 All Categories",
				shortBn: "সব ক্যাটাগরি"
			},
			{
				id: "#category:bKash",
				labelBn: "📱 বিকাশ লেনদেন (bKash)",
				labelEn: "📱 bKash Trx",
				shortBn: "বিকাশ"
			},
			{
				id: "#category:Nagad",
				labelBn: "💵 নগদ লেনদেন (Nagad)",
				labelEn: "💵 Nagad Trx",
				shortBn: "নগদ"
			},
			{
				id: "#category:Rocket",
				labelBn: "🚀 রকেট লেনদেন (Rocket)",
				labelEn: "🚀 Rocket Trx",
				shortBn: "রকেট"
			},
			{
				id: "#category:Bank",
				labelBn: "🏦 ব্যাংক একাউন্ট (Bank)",
				labelEn: "🏦 Bank Trx",
				shortBn: "ব্যাংক"
			},
			{
				id: "#category:Cash",
				labelBn: "💰 ক্যাশ ইন ও ক্যাশ আউট",
				labelEn: "💰 Cash In / Out",
				shortBn: "ক্যাশ"
			},
			{
				id: "#category:bill",
				labelBn: "📡 ইন্টারনেট বিল কালেকশন",
				labelEn: "📡 Internet Bill",
				shortBn: "ইন্টারনেট বিল"
			},
			{
				id: "#category:expense",
				labelBn: "🧾 অফিস খরচ ও ব্যয়",
				labelEn: "🧾 Office Expense",
				shortBn: "খরচ"
			}
		]
	},
	{
		groupBn: "ফুটার পপআপ ও অ্যাকশন (Popups & Actions)",
		groupEn: "Popups & Direct Actions",
		items: [
			{
				id: "#offer",
				labelBn: "🏷️ অফার উইন্ডো (Special Offers)",
				labelEn: "🏷️ Offers Window",
				shortBn: "অফার"
			},
			{
				id: "#store",
				labelBn: "📍 প্রধান শাখা ও স্টোর তথ্য",
				labelEn: "📍 Head Office & Store",
				shortBn: "স্টোর"
			},
			{
				id: "#help",
				labelBn: "❓ কাস্টমার সাপোর্ট ও হেল্পলাইন",
				labelEn: "❓ Customer Helpline",
				shortBn: "সাহায্য"
			},
			{
				id: "tel:01777877207",
				labelBn: "📞 সরাসরি ফোন কল (01777877207)",
				labelEn: "📞 Call 01777877207",
				shortBn: "কল করুন"
			}
		]
	}
];
var FooterSettingsModal = ({ isOpen, config, banners = [], lang, onClose, onSave, onSaveBanners }) => {
	var _config$store, _config$store2, _config$store3, _config$offer, _config$offer2, _config$offer3, _config$help, _config$help2, _config$help3;
	const isBn = lang === "bn";
	const [storeBn, setStoreBn] = (0, import_react.useState)((config === null || config === void 0 || (_config$store = config.store) === null || _config$store === void 0 ? void 0 : _config$store.bn) || "");
	const [storeEn, setStoreEn] = (0, import_react.useState)((config === null || config === void 0 || (_config$store2 = config.store) === null || _config$store2 === void 0 ? void 0 : _config$store2.en) || "");
	const [storeUrl, setStoreUrl] = (0, import_react.useState)((config === null || config === void 0 || (_config$store3 = config.store) === null || _config$store3 === void 0 ? void 0 : _config$store3.url) || "#store");
	const [offerBn, setOfferBn] = (0, import_react.useState)((config === null || config === void 0 || (_config$offer = config.offer) === null || _config$offer === void 0 ? void 0 : _config$offer.bn) || "");
	const [offerEn, setOfferEn] = (0, import_react.useState)((config === null || config === void 0 || (_config$offer2 = config.offer) === null || _config$offer2 === void 0 ? void 0 : _config$offer2.en) || "");
	const [offerUrl, setOfferUrl] = (0, import_react.useState)((config === null || config === void 0 || (_config$offer3 = config.offer) === null || _config$offer3 === void 0 ? void 0 : _config$offer3.url) || "#offer");
	const [helpBn, setHelpBn] = (0, import_react.useState)((config === null || config === void 0 || (_config$help = config.help) === null || _config$help === void 0 ? void 0 : _config$help.bn) || "");
	const [helpEn, setHelpEn] = (0, import_react.useState)((config === null || config === void 0 || (_config$help2 = config.help) === null || _config$help2 === void 0 ? void 0 : _config$help2.en) || "");
	const [helpUrl, setHelpUrl] = (0, import_react.useState)((config === null || config === void 0 || (_config$help3 = config.help) === null || _config$help3 === void 0 ? void 0 : _config$help3.url) || "#help");
	const [offerList, setOfferList] = (0, import_react.useState)(banners || []);
	const [isAddingOffer, setIsAddingOffer] = (0, import_react.useState)(false);
	const [newTitleBn, setNewTitleBn] = (0, import_react.useState)("");
	const [newTitleEn, setNewTitleEn] = (0, import_react.useState)("");
	const [newSubtitleBn, setNewSubtitleBn] = (0, import_react.useState)("");
	const [newSubtitleEn, setNewSubtitleEn] = (0, import_react.useState)("");
	const [newBadgeBn, setNewBadgeBn] = (0, import_react.useState)("৫০% ছাড়");
	const [newBadgeEn, setNewBadgeEn] = (0, import_react.useState)("50% OFF");
	const [newImageUrl, setNewImageUrl] = (0, import_react.useState)("");
	const [newLinkUrl, setNewLinkUrl] = (0, import_react.useState)("#offer");
	const [isUploadingImage, setIsUploadingImage] = (0, import_react.useState)(false);
	const [offerFormError, setOfferFormError] = (0, import_react.useState)("");
	const fileInputRef = (0, import_react.useRef)(null);
	if (!isOpen) return null;
	const quickPresets = [
		{
			label: "ফাইবার অপটিক কেবল",
			url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"
		},
		{
			label: "গিগাবিট রাউটার অফার",
			url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
		},
		{
			label: "আল্ট্রা হাই-স্পিড নেটওয়ার্ক",
			url: "https://images.unsplash.com/photo-1520869562399-e772f142f422?auto=format&fit=crop&w=800&q=80"
		},
		{
			label: "অনলাইন বিল পরিশোধ",
			url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80"
		}
	];
	const getLinkName = (url) => {
		for (const group of PAGE_AND_CATEGORY_PRESETS) {
			const found = group.items.find((i) => i.id === url);
			if (found) return isBn ? found.labelBn : found.labelEn;
		}
		return "";
	};
	const renderLinkSelector = (value, onChange, fieldLabel) => {
		const isPreset = PAGE_AND_CATEGORY_PRESETS.some((g) => g.items.some((i) => i.id === value));
		const matchedName = getLinkName(value);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5 pt-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3 h-3 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fieldLabel })]
					}), matchedName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md truncate max-w-[150px]",
						children: matchedName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: isPreset ? value : "custom",
						onChange: (e) => {
							sounds.playTap();
							if (e.target.value !== "custom") onChange(e.target.value);
						},
						className: "w-full h-10 pl-3 pr-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#E52E2E] cursor-pointer shadow-2xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								disabled: true,
								children: isBn ? "-- সাইটের পেজ বা ক্যাটাগরি বেছে নিন --" : "-- Choose Page or Category --"
							}),
							PAGE_AND_CATEGORY_PRESETS.map((group, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
								label: isBn ? group.groupBn : group.groupEn,
								children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.id,
									children: isBn ? item.labelBn : item.labelEn
								}, item.id))
							}, idx)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "custom",
								children: isBn ? "✏️ কাস্টম লিংক টাইপ করুন (Custom Link)" : "✏️ Type Custom URL"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 overflow-x-auto py-1 no-scrollbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-slate-400 shrink-0 font-medium mr-0.5",
						children: isBn ? "কুইক সিলেক্ট:" : "Quick:"
					}), [
						{
							id: "#home",
							label: "হোম"
						},
						{
							id: "#weather",
							label: "আবহাওয়া"
						},
						{
							id: "#transactions",
							label: "লেনদেন"
						},
						{
							id: "#ledger",
							label: "হিসাব খাতা"
						},
						{
							id: "#profile",
							label: "প্রোফাইল"
						},
						{
							id: "#category:bKash",
							label: "বিকাশ"
						},
						{
							id: "#category:Nagad",
							label: "নগদ"
						},
						{
							id: "#category:bill",
							label: "বিল"
						},
						{
							id: "#offer",
							label: "অফার"
						},
						{
							id: "#help",
							label: "সাহায্য"
						}
					].map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							onChange(chip.id);
						},
						className: `px-2 py-0.8 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer ${value === chip.id ? "bg-[#E52E2E] text-white shadow-2xs" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400"}`,
						children: chip.label
					}, chip.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value,
						onChange: (e) => onChange(e.target.value),
						placeholder: isBn ? "যেমন: #offer, #weather, #category:bKash" : "e.g. #offer, #weather",
						className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
					})
				})
			]
		});
	};
	const handleOfferImageUpload = async (e) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (!file) return;
		try {
			setIsUploadingImage(true);
			sounds.playTap();
			const compressedDataUrl = await compressImage(file, 800, 400, .82);
			setNewImageUrl(compressedDataUrl);
			sounds.playSuccess();
		} catch (err) {
			console.error("Image upload failed:", err);
			setOfferFormError(isBn ? "ছবি প্রসেস করা সম্ভব হয়নি" : "Failed to process image");
		} finally {
			setIsUploadingImage(false);
		}
	};
	const handleCreateOffer = () => {
		if (!newTitleBn.trim() && !newTitleEn.trim()) {
			setOfferFormError(isBn ? "অফারের নাম বা শিরোনাম আবশ্যক" : "Offer title is required");
			sounds.playTap();
			return;
		}
		sounds.playSuccess();
		const updated = [{
			id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			titleBn: newTitleBn.trim() || newTitleEn.trim(),
			titleEn: newTitleEn.trim() || newTitleBn.trim(),
			subtitleBn: newSubtitleBn.trim() || "প্রত্যাশা ক্যাবল নেটওয়ার্কের সুপারফাস্ট ব্রডব্যান্ড অফার",
			subtitleEn: newSubtitleEn.trim() || "Superfast broadband internet offer by Protyasha Cable Network",
			badgeBn: newBadgeBn.trim() || "অফার",
			badgeEn: newBadgeEn.trim() || "Offer",
			imageUrl: newImageUrl || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
			linkUrl: newLinkUrl.trim() || "#offer",
			isActive: true,
			priority: offerList.length + 1
		}, ...offerList];
		setOfferList(updated);
		if (onSaveBanners) onSaveBanners(updated);
		setNewTitleBn("");
		setNewTitleEn("");
		setNewSubtitleBn("");
		setNewSubtitleEn("");
		setNewBadgeBn("৫০% ছাড়");
		setNewBadgeEn("50% OFF");
		setNewImageUrl("");
		setNewLinkUrl("#offer");
		setIsAddingOffer(false);
		setOfferFormError("");
	};
	const handleToggleOfferActive = (id) => {
		sounds.playTap();
		const updated = offerList.map((b) => b.id === id ? {
			...b,
			isActive: !b.isActive
		} : b);
		setOfferList(updated);
		if (onSaveBanners) onSaveBanners(updated);
	};
	const handleDeleteOffer = async (id) => {
		sounds.playTap();
		if (await showConfirm({
			message: isBn ? "অফারটি মুছে ফেলতে চান?" : "Delete this offer?",
			confirmLabel: isBn ? "মুছে ফেলুন" : "Delete",
			cancelLabel: isBn ? "বাতিল" : "Cancel",
			danger: true
		})) {
			const updated = offerList.filter((b) => b.id !== id);
			setOfferList(updated);
			if (onSaveBanners) onSaveBanners(updated);
		}
	};
	const handleSave = (e) => {
		e.preventDefault();
		sounds.playSuccess();
		onSave({
			store: {
				...config.store,
				bn: storeBn,
				en: storeEn,
				url: storeUrl
			},
			offer: {
				...config.offer,
				bn: offerBn,
				en: offerEn,
				url: offerUrl
			},
			help: {
				...config.help,
				bn: helpBn,
				en: helpEn,
				url: helpUrl
			}
		});
		if (onSaveBanners) onSaveBanners(offerList);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						sounds.playTap();
						onClose();
					},
					className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: isBn ? "লগইন ফুটার ও অফার কাস্টমাইজ" : "Customize Login Footer & Offers"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSave,
			className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium",
					children: isBn ? "💡 আপনি প্রতিটি বাটনে সাইটের যেকোনো পেজ (হোম, লেনদেন, আবহাওয়া, প্রোফাইল) অথবা ক্যাটাগরি (বিকাশ, নগদ, ক্যাশ, বিল) সরাসরি সিলেক্ট করে লিংক করতে পারবেন।" : "Configure each button to directly target any page (Home, Weather, Trx, Profile) or category (bKash, Nagad, Bill)."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📍" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. স্টোর / Store" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: storeBn,
								onChange: (e) => setStoreBn(e.target.value),
								placeholder: "বাংলা নাম (যেমন: স্টোর)",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: storeEn,
								onChange: (e) => setStoreEn(e.target.value),
								placeholder: "English Name (e.g. Store)",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							}),
							renderLinkSelector(storeUrl, setStoreUrl, isBn ? "স্টোর অ্যাকশন লিংক / পেজ / ক্যাটাগরি" : "Store Action Link / Target")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-950/80 space-y-3.5 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base",
									children: "🏷️"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-rose-600 dark:text-rose-400 font-extrabold",
									children: "2. অফার / Offer (এডমিন অফার কন্ট্রোল)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
								children: [
									offerList.length,
									" ",
									isBn ? "টি অফার" : "Offers"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-800 dark:text-slate-200 block",
									children: isBn ? "ফুটার বাটন সেটিংস (নাম ও পেজ / ক্যাটাগরি লিংক):" : "Footer Button Settings:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: offerBn,
									onChange: (e) => setOfferBn(e.target.value),
									placeholder: "বাংলা নাম (যেমন: অফার)",
									className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: offerEn,
									onChange: (e) => setOfferEn(e.target.value),
									placeholder: "English Name (e.g. Offer)",
									className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
								}),
								renderLinkSelector(offerUrl, setOfferUrl, isBn ? "অফার অ্যাকশন লিংক ও সাইট পেজ / ক্যাটাগরি" : "Offer Action Link / Target")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "চলমান অফারসমূহ ও নতুন অফার যোগ:" : "Active Offers & Add New:" })]
									}), !isAddingOffer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											sounds.playTap();
											setIsAddingOffer(true);
										},
										className: "px-3 py-1.5 rounded-full bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "+ নতুন অফার যোগ করুন" : "+ Add New Offer" })]
									})]
								}),
								isAddingOffer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3 mb-3 animate-in fade-in duration-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pb-1 border-b border-rose-200/60 dark:border-rose-900/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3.5 h-3.5 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "নতুন অফারের বিবরণ লিখুন" : "New Offer Details" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setIsAddingOffer(false);
													setOfferFormError("");
												},
												className: "w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
											})]
										}),
										offerFormError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-rose-700 dark:text-rose-300 font-bold bg-white dark:bg-slate-900 p-2 rounded-lg border border-rose-300",
											children: offerFormError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 block",
													children: isBn ? "অফারের নাম / শিরোনাম *" : "Offer Title *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newTitleBn,
													onChange: (e) => setNewTitleBn(e.target.value),
													placeholder: "বাংলা শিরোনাম (যেমন: নতুন সংযোগে ফ্রি রাউটার!)",
													className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newTitleEn,
													onChange: (e) => setNewTitleEn(e.target.value),
													placeholder: "English Title (e.g. Free Router on New Connection!)",
													className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 block",
													children: isBn ? "অফারের বিস্তারিত বিবরণ / প্যাকেজ" : "Offer Details / Subtitle"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newSubtitleBn,
													onChange: (e) => setNewSubtitleBn(e.target.value),
													placeholder: "বাংলা বিবরণ (যেমন: সুপারফাস্ট ফাইবার অপটিক ইন্টারনেট সংযোগ)",
													className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newSubtitleEn,
													onChange: (e) => setNewSubtitleEn(e.target.value),
													placeholder: "English Details (e.g. Superfast fiber broadband connection)",
													className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 block",
												children: isBn ? "অফার রিবন / ব্যাজ (Badge)" : "Offer Badge / Ribbon"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newBadgeBn,
													onChange: (e) => setNewBadgeBn(e.target.value),
													placeholder: "বাংলা ব্যাজ (৫০% ছাড়)",
													className: "w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: newBadgeEn,
													onChange: (e) => setNewBadgeEn(e.target.value),
													placeholder: "English Badge (50% OFF)",
													className: "w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-[11px] font-bold text-slate-700 dark:text-slate-300 block",
													children: isBn ? "অফারের ব্যানার ছবি আপলোড করুন" : "Offer Banner Photo"
												}),
												newImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative w-full h-28 rounded-xl overflow-hidden border border-rose-300 shadow-2xs group",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: newImageUrl,
														alt: "Offer Preview",
														className: "w-full h-full object-cover"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "absolute top-2 right-2 flex gap-1",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setNewImageUrl(""),
															className: "px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold hover:bg-black cursor-pointer",
															children: isBn ? "ছবি মুছুন" : "Remove"
														})
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													onClick: () => {
														var _fileInputRef$current;
														return (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
													},
													className: "w-full h-20 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white dark:bg-slate-800 flex flex-col items-center justify-center cursor-pointer transition-colors",
													children: [isUploadingImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-xs font-bold text-rose-600",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "ছবি কমপ্রেস ও আপলোড হচ্ছে..." : "Uploading photo..." })]
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "গ্যালারি বা ক্যামেরা থেকে ছবি আপলোড করুন" : "Upload Banner Photo" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														ref: fileInputRef,
														accept: "image/*",
														onChange: handleOfferImageUpload,
														className: "hidden"
													})]
												}),
												!newImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-500 shrink-0 font-medium",
														children: isBn ? "বা রেডি ছবি:" : "Or preset:"
													}), quickPresets.map((preset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => {
															sounds.playTap();
															setNewImageUrl(preset.url);
														},
														className: "text-[10px] font-semibold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 shrink-0 transition-colors cursor-pointer",
														children: preset.label
													}, idx))]
												})
											]
										}),
										renderLinkSelector(newLinkUrl, setNewLinkUrl, isBn ? "অফার অ্যাকশন লিংক / পেজ / ক্যাটাগরি" : "Action Link Target"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													sounds.playTap();
													setIsAddingOffer(false);
													setOfferFormError("");
												},
												className: "flex-1 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer",
												children: isBn ? "বাতিল" : "Cancel"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleCreateOffer,
												className: "flex-1 h-9 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "অফার যুক্ত করুন" : "Add Offer" })]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 max-h-60 overflow-y-auto pr-0.5",
									children: offerList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "py-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800",
										children: isBn ? "কোনো সক্রিয় অফার নেই। উপরে \"+ নতুন অফার যোগ করুন\" বাটনে ট্যাপ করুন।" : "No offers added. Tap \"+ Add New Offer\" above."
									}) : offerList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5 group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-14 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0",
												children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: item.imageUrl,
													alt: item.titleBn,
													className: "w-full h-full object-cover"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-full h-full flex items-center justify-center text-slate-400",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-5 h-5" })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 mb-0.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-600 text-white truncate max-w-[90px]",
																children: isBn ? item.badgeBn : item.badgeEn
															}),
															!item.isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-300 text-slate-700",
																children: isBn ? "নিষ্ক্রিয়" : "Inactive"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[9px] font-mono text-slate-400 truncate max-w-[100px]",
																children: item.linkUrl
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
														className: "text-xs font-bold text-slate-900 dark:text-white truncate",
														children: isBn ? item.titleBn : item.titleEn
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-slate-500 truncate",
														children: isBn ? item.subtitleBn : item.subtitleEn
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleToggleOfferActive(item.id),
													className: `w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${item.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-200 text-slate-500 hover:bg-slate-300"}`,
													title: item.isActive ? isBn ? "নিষ্ক্রিয় করুন" : "Disable" : isBn ? "সক্রিয় করুন" : "Enable",
													children: item.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-3.5 h-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleDeleteOffer(item.id),
													className: "w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors cursor-pointer",
													title: isBn ? "মুছুন" : "Delete",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
												})]
											})
										]
									}, item.id))
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "❓" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. সাহায্য / Help" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: helpBn,
								onChange: (e) => setHelpBn(e.target.value),
								placeholder: "বাংলা নাম (যেমন: সাহায্য)",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: helpEn,
								onChange: (e) => setHelpEn(e.target.value),
								placeholder: "English Name (e.g. Help)",
								className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
							}),
							renderLinkSelector(helpUrl, setHelpUrl, isBn ? "সাহায্য অ্যাকশন লিংক / পেজ / ক্যাটাগরি" : "Help Action Link / Target")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "w-full h-12 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-98 transition-all cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সেটিংস ও অফারসমূহ সংরক্ষণ করুন" : "Save Settings & Offers" })]
				})
			]
		})]
	});
};
//#endregion
export { FooterSettingsModal };
