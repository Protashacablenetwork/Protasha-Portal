import "./chunk-rolldown-runtime.js";
import { En as require_react } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var AY_BYAY_DEFAULT_LOGO = "https://i.ibb.co/0jZfwH1s/file-0000000079b4821185e81949d65e68d5.png";
var BILL_MANAGER_DEFAULT_LOGO = "https://bill-manager.ai.studio/logo.jpg";
function getServiceFallbackLogo(serviceName = "", logoUrl) {
	if (logoUrl && typeof logoUrl === "string" && logoUrl.trim() !== "") return logoUrl;
	const s = serviceName.toLowerCase();
	if (s.includes("আয়") || s.includes("ব্যয়") || s.includes("aybyay") || s.includes("income")) return AY_BYAY_DEFAULT_LOGO;
	if (s.includes("বিল") || s.includes("bill")) return BILL_MANAGER_DEFAULT_LOGO;
	return AY_BYAY_DEFAULT_LOGO;
}
var ServiceNoticeModal = ({ isOpen, serviceName, customTitle, customMessage, logoUrl, lang, onClose }) => {
	if (!isOpen) return null;
	const isBn = lang === "bn";
	const title = customTitle || serviceName;
	const effectiveLogo = getServiceFallbackLogo(serviceName, logoUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[200] bg-[#050b14] flex flex-col text-white overflow-hidden select-none animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-grid pointer-events-none",
				style: {
					backgroundImage: "linear-gradient(rgba(77, 184, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 184, 255, 0.03) 1px, transparent 1px)",
					backgroundSize: "50px 50px",
					zIndex: 0
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[150px] -left-[150px] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,107,255,0.15)_0%,_transparent_70%)] rounded-full pointer-events-none z-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[120px] -right-[120px] w-[350px] h-[350px] bg-[radial-gradient(circle,_rgba(129,140,248,0.12)_0%,_transparent_70%)] rounded-full pointer-events-none z-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-1 pointer-events-none overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[3px] h-[3px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "10%",
							animationDelay: "0s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[2px] h-[2px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "25%",
							animationDelay: "1.5s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[3px] h-[3px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "40%",
							animationDelay: "3s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[4px] h-[4px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "55%",
							animationDelay: "4.5s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[3px] h-[3px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "70%",
							animationDelay: "6s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute w-[2px] h-[2px] bg-[#4db8ff] rounded-full opacity-80 shadow-[0_0_8px_#4db8ff] animate-[particleFloat_12s_infinite]",
						style: {
							left: "85%",
							animationDelay: "7.5s"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-6 py-4 border-b border-[#4db8ff]/10 bg-[#050b14]/70 backdrop-blur-xl relative z-10 flex items-center justify-between shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-[#4db8ff] font-bold text-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#4db8ff]/15 to-[#818cf8]/10 border border-[#4db8ff]/25 flex items-center justify-center text-[#fbbf24] text-lg overflow-hidden bg-white/10 p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: effectiveLogo,
							alt: "Logo",
							className: "w-full h-full object-cover rounded-lg",
							onError: (e) => {
								e.target.src = AY_BYAY_DEFAULT_LOGO;
							}
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onClose,
					className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all active:scale-95",
					title: "বন্ধ করুন",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-arrow-left" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: isBn ? "ফেরত" : "Back"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center p-4 relative z-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md sm:max-w-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-[#4db8ff]/20 rounded-[32px] p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] font-semibold text-xs mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" }), isBn ? "অপেক্ষা করুন · সেবা সাময়িকভাবে স্থগিত বা আপগ্রেড চলছে" : "Please wait · Service Upgrade in Progress"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative w-32 h-32 mx-auto mb-5 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-24 h-24 rounded-2xl bg-white p-1.5 shadow-[0_0_25px_rgba(77,184,255,0.35)] border-2 border-[#4db8ff]/40 flex items-center justify-center overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: effectiveLogo,
									alt: "Service",
									className: "w-full h-full object-contain rounded-xl",
									onError: (e) => {
										e.target.src = AY_BYAY_DEFAULT_LOGO;
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3",
							children: [
								title,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-transparent bg-clip-text bg-gradient-to-r from-[#4db8ff] via-[#818cf8] to-[#4db8ff]",
									children: "আপগ্রেড চলছে"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm sm:text-base text-[#b8c9e6] leading-relaxed mb-6 max-w-sm mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-bolt text-[#fbbf24] mr-1.5" }),
								customMessage || (isBn ? "আমাদের এই সেবাটিকে আরও উন্নত ও গতিশীল করার লক্ষ্যে রক্ষণাবেক্ষণ কাজ চলছে। খুব শীঘ্রই আমরা নতুন ফিচার নিয়ে ফিরে আসছি।" : "System maintenance and upgrades are underway to deliver a better experience."),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-rocket text-[#4db8ff] ml-1.5" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-1.5 bg-white/10 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-gradient-to-r from-[#4db8ff] via-[#818cf8] to-[#4db8ff] rounded-full animate-[progressAnim_3s_ease-in-out_infinite]",
									style: { width: "75%" }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between mt-2 text-xs text-[#8aa3c9] font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-database mr-1" }),
									" ",
									isBn ? "ডেটা মাইগ্রেশন" : "Data Migration"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "প্রক্রিয়াধীন..." : "Processing..." })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-center items-center gap-2 mb-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#4db8ff] animate-[ping_1.6s_infinite]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#4db8ff] animate-[ping_1.6s_infinite_0.2s]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#4db8ff] animate-[ping_1.6s_infinite_0.4s]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-[#8aa3c9] font-medium ml-2 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-sync-alt animate-spin text-[#fbbf24]" }),
										" ",
										isBn ? "সিস্টেম স্ট্যাটাস: নিষ্ক্রিয় / আপডেট হচ্ছে" : "Status: Maintenance"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 pt-4 border-t border-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onClose,
								className: "w-full h-11 rounded-2xl bg-gradient-to-r from-[#4db8ff] to-[#6366f1] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all",
								children: isBn ? "ফিরে যান" : "Go Back"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "py-4 text-center border-t border-[#4db8ff]/10 bg-[#050b14]/70 backdrop-blur-xl relative z-10 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-[#5a7a9e] flex items-center justify-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "far fa-copyright" }),
						" সর্বস্বত্ব সংরক্ষিত | COPY © 2026 প্রতাশা ক্যাবল নেটওয়ার্ক",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "fas fa-heart text-rose-400" })
					]
				})
			})
		]
	});
};
//#endregion
export { ServiceNoticeModal };
