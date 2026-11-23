import "./chunk-rolldown-runtime.js";
import { En as require_react, M as ShieldCheck, Sn as ArrowLeft, Yt as Clock } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { n as formatTransactionDate } from "./chunk-formatters.js";
import { tt as sounds } from "./app.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var AuditLogModal = ({ isOpen, logs, lang, onClose }) => {
	if (!isOpen) return null;
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
					className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "bn" ? "অডিট লগ ও সিস্টেম রেকর্ড" : "Audit Logs" })]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24",
			children: logs.map((log) => {
				const d = new Date(log.time);
				const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
				const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: lang === "bn" ? log.actionBn : log.action
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), formatTransactionDate(dateStr, timeStr, lang)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 dark:text-slate-400",
							children: log.details
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-[10px] font-semibold text-slate-400",
							children: lang === "bn" ? `কর্তৃপক্ষ: ${log.user}` : `User: ${log.user}`
						})
					]
				}, log.id);
			})
		})]
	});
};
//#endregion
export { AuditLogModal };
