import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react, _t as KeyRound, n as X } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { W as showToast, tt as sounds } from "./app.js";
//#region src/components/ChangePinModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ChangePinModal = ({ isOpen, lang, onClose, onPinChanged }) => {
	const [currentPin, setCurrentPin] = (0, import_react.useState)("");
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [confirmPin, setConfirmPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	if (!isOpen) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		if (newPin.length < 4) {
			setError(lang === "bn" ? "পিন কমপক্ষে ৪ সংখ্যার হতে হবে" : "PIN must be at least 4 digits");
			return;
		}
		if (newPin !== confirmPin) {
			setError(lang === "bn" ? "নতুন পিন ও নিশ্চিত পিন মিলেনি" : "PINs do not match");
			return;
		}
		sounds.playSuccess();
		onPinChanged(newPin);
		showToast(lang === "bn" ? "পিন সফলভাবে পরিবর্তিত হয়েছে!" : "PIN changed successfully!", "success");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] mx-auto flex items-center justify-center mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white",
							children: lang === "bn" ? "পিন পরিবর্তন করুন" : "Change Security PIN"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: lang === "bn" ? "নতুন ৪ থেকে ৬ সংখ্যার গোপন পিন দিন" : "Enter new 4-6 digit secret PIN"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1",
							children: lang === "bn" ? "বর্তমান পিন" : "Current PIN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							inputMode: "numeric",
							pattern: "[0-9]*",
							autoComplete: "off",
							autoCorrect: "off",
							autoCapitalize: "off",
							spellCheck: false,
							"data-lpignore": "true",
							"data-1password-type": "off",
							style: { WebkitTextSecurity: "disc" },
							maxLength: 6,
							value: currentPin,
							onChange: (e) => setCurrentPin(e.target.value),
							placeholder: "••••",
							required: true,
							className: "w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1",
							children: lang === "bn" ? "নতুন পিন" : "New PIN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							inputMode: "numeric",
							pattern: "[0-9]*",
							autoComplete: "off",
							autoCorrect: "off",
							autoCapitalize: "off",
							spellCheck: false,
							"data-lpignore": "true",
							"data-1password-type": "off",
							style: { WebkitTextSecurity: "disc" },
							maxLength: 6,
							value: newPin,
							onChange: (e) => setNewPin(e.target.value),
							placeholder: "••••",
							required: true,
							className: "w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1",
							children: lang === "bn" ? "নতুন পিন নিশ্চিত করুন" : "Confirm New PIN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							inputMode: "numeric",
							pattern: "[0-9]*",
							autoComplete: "off",
							autoCorrect: "off",
							autoCapitalize: "off",
							spellCheck: false,
							"data-lpignore": "true",
							"data-1password-type": "off",
							style: { WebkitTextSecurity: "disc" },
							maxLength: 6,
							value: confirmPin,
							onChange: (e) => setConfirmPin(e.target.value),
							placeholder: "••••",
							required: true,
							className: "w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-rose-500 text-center",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-full h-11 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md shadow-rose-600/30 active:scale-95 transition-all mt-2",
							children: lang === "bn" ? "পিন আপডেট করুন" : "Update PIN"
						})
					]
				})
			]
		})
	});
};
//#endregion
export { ChangePinModal };
