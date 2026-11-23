import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, J as Plus, Sn as ArrowLeft, h as Upload, rn as Check, s as Wallet, x as Trash2, yt as Image } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { E as getChannelGradient, T as SmartChannelIcon, U as showConfirm, tt as sounds } from "./app.js";
import { t as compressImage } from "./chunk-imageCompressor.js";
//#region src/components/ChannelManagerModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ChannelManagerModal = ({ isOpen, channels, lang, onClose, onSaveChannels }) => {
	const [channelList, setChannelList] = (0, import_react.useState)(channels);
	const [isAdding, setIsAdding] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [labelBn, setLabelBn] = (0, import_react.useState)("");
	const [labelEn, setLabelEn] = (0, import_react.useState)("");
	const [colorTheme, setColorTheme] = (0, import_react.useState)("cyan");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [editingChannelId, setEditingChannelId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) setChannelList(channels);
	}, [isOpen, channels]);
	if (!isOpen) return null;
	const colorOptions = [
		{
			name: "cyan",
			text: "text-cyan-600",
			bg: "bg-cyan-50 dark:bg-cyan-950/30",
			border: "border-cyan-200 dark:border-cyan-900/40"
		},
		{
			name: "emerald",
			text: "text-emerald-600",
			bg: "bg-emerald-50 dark:bg-emerald-950/30",
			border: "border-emerald-200 dark:border-emerald-900/40"
		},
		{
			name: "purple",
			text: "text-purple-600",
			bg: "bg-purple-50 dark:bg-purple-950/30",
			border: "border-purple-200 dark:border-purple-900/40"
		},
		{
			name: "rose",
			text: "text-rose-600",
			bg: "bg-rose-50 dark:bg-rose-950/30",
			border: "border-rose-200 dark:border-rose-900/40"
		},
		{
			name: "amber",
			text: "text-amber-600",
			bg: "bg-amber-50 dark:bg-amber-950/30",
			border: "border-amber-200 dark:border-amber-900/40"
		},
		{
			name: "blue",
			text: "text-blue-600",
			bg: "bg-blue-50 dark:bg-blue-950/30",
			border: "border-blue-200 dark:border-blue-900/40"
		}
	];
	const handleImageUpload = async (e, channelId) => {
		var _e$target$files;
		const file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
		if (file) try {
			const compressed = await compressImage(file, 256, 256, .85);
			sounds.playSuccess();
			if (channelId) {
				const updated = channelList.map((c) => c.id === channelId ? {
					...c,
					imageUrl: compressed
				} : c);
				setChannelList(updated);
				onSaveChannels(updated);
			} else setImageUrl(compressed);
		} catch (err) {
			console.error("Image compression failed:", err);
		}
	};
	const handleAddChannel = (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		sounds.playSuccess();
		const selectedColor = colorOptions.find((c) => c.name === colorTheme) || colorOptions[0];
		const newChannel = {
			id: `ch-${Date.now()}`,
			name: name.trim(),
			labelBn: labelBn.trim() || `${name.trim()} ওয়ালেট`,
			labelEn: labelEn.trim() || `${name.trim()} Account`,
			icon: "smart",
			imageUrl: imageUrl || void 0,
			color: selectedColor.text,
			bg: selectedColor.bg,
			border: selectedColor.border,
			isDefault: false
		};
		const updated = [...channelList, newChannel];
		setChannelList(updated);
		onSaveChannels(updated);
		setIsAdding(false);
		setName("");
		setLabelBn("");
		setLabelEn("");
		setImageUrl("");
	};
	const handleDeleteChannel = async (id) => {
		sounds.playTap();
		if (await showConfirm({
			message: lang === "bn" ? "এই পেমেন্ট চ্যানেলটি মুছে ফেলতে চান?" : "Delete this channel?",
			confirmLabel: lang === "bn" ? "মুছে ফেলুন" : "Delete",
			cancelLabel: lang === "bn" ? "বাতিল" : "Cancel",
			danger: true
		})) {
			const updated = channelList.filter((c) => c.id !== id);
			setChannelList(updated);
			onSaveChannels(updated);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						sounds.playTap();
						onClose();
					},
					className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "পেমেন্ট চ্যানেল ও আইকন ব্যবস্থাপনা" : "Channel & Icon Manager" })]
				})]
			}), !isAdding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					sounds.playTap();
					setIsAdding(true);
				},
				className: "h-9 px-3 rounded-xl bg-[#E52E2E] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "নতুন চ্যানেল" : "Add Channel" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28",
			children: [isAdding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddChannel,
				className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-slate-900 dark:text-white",
							children: lang === "bn" ? "নতুন পেমেন্ট চ্যানেল ও ছবি আইকন যোগ করুন" : "Add New Channel with Custom Image Icon"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsAdding(false),
							className: "text-xs font-semibold text-slate-500 hover:text-slate-800",
							children: lang === "bn" ? "বাতিল" : "Cancel"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
						children: "চ্যানেলের নাম (যেমন: বিকাশ, নগদ, রকেট, উপায়) *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "যেমন: বিকাশ",
						className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "বাংলা লেবেল"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: labelBn,
							onChange: (e) => setLabelBn(e.target.value),
							placeholder: "যেমন: বিকাশ একাউন্ট",
							className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1",
							children: "English Label"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: labelEn,
							onChange: (e) => setLabelEn(e.target.value),
							placeholder: "e.g. bKash Account",
							className: "w-full h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: lang === "bn" ? "আইকন ছবি আপলোড (ডিভাইস থেকে)" : "Upload Icon Image from Device"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0",
							children: imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageUrl,
								alt: "Icon Preview",
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-6 h-6 text-slate-400" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex-1 h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-slate-700",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-[#E52E2E]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: imageUrl ? lang === "bn" ? "ছবি পরিবর্তন করুন" : "Change Image" : lang === "bn" ? "ছবি সিলেক্ট করুন" : "Choose Image" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: (e) => handleImageUpload(e),
									className: "hidden"
								})
							]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: lang === "bn" ? "আইকন প্রিভিউ" : "Icon Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-11 h-11 rounded-2xl flex items-center justify-center ${getChannelGradient(name || "custom")} overflow-hidden`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartChannelIcon, {
								method: name || "custom",
								imageUrl,
								className: "w-5 h-5 text-white"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-slate-900 dark:text-white",
								children: name || "নতুন চ্যানেল"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-500 text-[11px]",
								children: labelBn || "কাস্টম আইকন"
							})]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5",
						children: "কালার থিম"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: colorOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setColorTheme(c.name);
							},
							className: `w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${c.bg} ${colorTheme === c.name ? "border-[#E52E2E] scale-110" : "border-transparent"}`,
							children: colorTheme === c.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-slate-800 dark:text-white" })
						}, c.name))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "w-full h-11 rounded-xl bg-[#E52E2E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "চ্যানেল ও আইকন সেভ করুন" : "Save Channel & Icon" })]
					})
				]
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-5 h-5 text-[#E52E2E] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium",
						children: lang === "bn" ? "আপনি বিকাশ, নগদ, রকেট বা যেকোনো চ্যানেলে ক্লিক করে আপনার ডিভাইস থেকে ছবি আপلود করে সরাসরি আইকন হিসেবে সেট করতে পারেন।" : "Upload custom device images as icons for bKash, Nagad, Rocket or any channel below."
					})]
				}), channelList.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-3.5 rounded-2xl ${ch.bg} border ${ch.border} flex items-center justify-between shadow-2xs`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-12 h-12 rounded-2xl flex items-center justify-center ${getChannelGradient(ch.name)} overflow-hidden shadow-sm shrink-0`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartChannelIcon, {
								method: ch.name,
								imageUrl: ch.imageUrl,
								className: "w-6 h-6 text-white"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold text-slate-900 dark:text-white",
								children: ch.name
							}), ch.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
								children: lang === "bn" ? "কাস্টম ছবি আইকন" : "Custom Image"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
								children: lang === "bn" ? "স্মার্ট আইকন" : "Smart Icon"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
							children: lang === "bn" ? ch.labelBn : ch.labelEn
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "h-8 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all",
							title: lang === "bn" ? "আইকন ছবি পরিবর্তন করুন" : "Change Icon Image",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5 text-[#E52E2E]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: lang === "bn" ? "ছবি আইকন" : "Icon"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: (e) => handleImageUpload(e, ch.id),
									className: "hidden"
								})
							]
						}), !ch.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleDeleteChannel(ch.id),
							className: "w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-900/80 text-[#E52E2E] flex items-center justify-center hover:bg-rose-100 shadow-2xs",
							title: "মুছে ফেলুন",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})]
					})]
				}, ch.id))]
			})]
		})]
	});
};
//#endregion
export { ChannelManagerModal };
