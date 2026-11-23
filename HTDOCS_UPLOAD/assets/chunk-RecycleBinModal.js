import "./chunk-rolldown-runtime.js";
import { En as require_react, Qt as CircleAlert, Sn as ArrowLeft, V as RotateCcw, b as Trash } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { n as formatTransactionDate, t as formatCurrency } from "./chunk-formatters.js";
import { U as showConfirm, tt as sounds } from "./app.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var RecycleBinModal = ({ isOpen, transactions, lang, onClose, onRestore, onPermanentDelete, onEmptyTrash }) => {
	if (!isOpen) return null;
	const deleted = transactions.filter((t) => t.isDeleted);
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: lang === "bn" ? "রিসাইকেল বিন" : "Recycle Bin"
				})]
			}), deleted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: async () => {
					if (await showConfirm({
						message: lang === "bn" ? "সব মুছে ফেলতে চান?" : "Empty all deleted items?",
						confirmLabel: lang === "bn" ? "সব মুছুন" : "Empty All",
						cancelLabel: lang === "bn" ? "বাতিল" : "Cancel",
						danger: true
					})) {
						sounds.playTap();
						onEmptyTrash();
					}
				},
				className: "text-xs font-bold text-[#E52E2E] hover:underline",
				children: lang === "bn" ? "সব খালি করুন" : "Empty All"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24",
			children: deleted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center text-slate-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: lang === "bn" ? "রিসাইকেল বিনে কোনো তথ্য নেই" : "Recycle bin is empty"
				})]
			}) : deleted.map((trx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold text-slate-900 dark:text-white",
						children: trx.person
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: [
							trx.method,
							" • ",
							formatTransactionDate(trx.date, trx.time, lang)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-[#E52E2E] mt-0.5 block tabular-nums",
						children: formatCurrency(trx.amount, lang)
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							sounds.playTap();
							onRestore(trx.id);
						},
						className: "px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "পুনরুদ্ধার" : "Restore" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							sounds.playTap();
							onPermanentDelete(trx.id);
						},
						className: "w-8 h-8 rounded-xl bg-rose-50 text-[#E52E2E] flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "w-4 h-4" })
					})]
				})]
			}, trx.id))
		})]
	});
};
//#endregion
export { RecycleBinModal };
