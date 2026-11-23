import "./chunk-rolldown-runtime.js";
import { En as require_react, K as Printer, Zt as CircleCheck, n as X, zt as Download } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { n as formatTransactionDate, t as formatCurrency } from "./chunk-formatters.js";
import { W as showToast, tt as sounds } from "./app.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var ReceiptModal = ({ transaction, lang, onClose }) => {
	if (!transaction) return null;
	const isIncome = transaction.type === "income";
	const handlePrint = () => {
		sounds.playTap();
		window.print();
	};
	const handleCopyMemo = () => {
		var _navigator$clipboard;
		sounds.playTap();
		const memo = `
=================================
  ${lang === "bn" ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"}
     ডিজিটাল ক্যাশ মেমো ও রশিদ
=================================
ঠিকানা: দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), হাজী আবেদ আলী মার্কেট, ইসলামপুর, জামালপুর
ট্রানজেকশন আইডি: #${transaction.trxId}
তারিখ: ${formatTransactionDate(transaction.date, transaction.time, lang)}
গ্রাহক: ${transaction.person}
মোবাইল: ${transaction.phone || "N/A"}
ধরন: ${isIncome ? "জমা / বিল কালেকশন" : "খরচ / পেমেন্ট"}
মাধ্যম: ${transaction.method}
মোট পরিশোধ: ${formatCurrency(transaction.amount, lang)}
বিবরণ: ${transaction.note || "মাসিক ক্যাবল ফি পরিশোধ"}
অবস্থা: পরিশোধিত (PAID)
=================================
হেল্পলাইন: 01777877207 | ইমেইল: protashacablenetwork@gmail.com
ধন্যবাদ আমাদের সাথে থাকার জন্য!
`;
		(_navigator$clipboard = navigator.clipboard) === null || _navigator$clipboard === void 0 || _navigator$clipboard.writeText(memo);
		showToast(lang === "bn" ? "সম্পূর্ণ মেমো ক্লিপবোর্ডে কপি করা হয়েছে!" : "Full receipt memo copied to clipboard!", "success");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm bg-white text-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "printable-receipt",
					className: "font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center pb-3 border-b-2 border-dashed border-slate-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 mx-auto rounded-full bg-[#E52E2E] text-white flex items-center justify-center text-xl font-bold font-sans mb-1 shadow-sm",
									children: "প্র"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold tracking-tight text-slate-900 font-sans",
									children: lang === "bn" ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-500 tracking-wider mt-0.5",
									children: "দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), ইসলামপুর, জামালপুর"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-600 font-bold mt-0.5",
									children: "হেল্পলাইন: 01777877207"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-1.5 my-3 text-emerald-600 bg-emerald-50 py-1 rounded-md border border-emerald-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-xs uppercase tracking-wider",
								children: isIncome ? "পরিশোধিত / PAID" : "নিষ্পন্ন / COMPLETED"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "ট্রানজেকশন নং:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-900",
										children: ["#", transaction.trxId]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "তারিখ ও সময়:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-800",
										children: formatTransactionDate(transaction.date, transaction.time, lang)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "গ্রাহক / ব্যক্তি:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-900 truncate max-w-[170px]",
										children: transaction.person
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "মোবাইল:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-slate-800",
										children: transaction.phone || "N/A"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-500",
										children: "পেমেন্ট মাধ্যম:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-slate-900",
										children: [transaction.method, transaction.bankName ? ` (${transaction.bankName})` : ""]
									})]
								}),
								transaction.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-1 text-[11px] text-slate-600 italic border-t border-slate-100",
									children: [
										"“",
										transaction.note,
										"”"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 pb-2 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-sm font-bold font-sans",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-slate-700",
								children: "মোট টাকা:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-base font-extrabold ${isIncome ? "text-emerald-600" : "text-[#E52E2E]"}`,
								children: formatCurrency(transaction.amount, lang)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-48 mx-auto bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_8px,#000_8px,#000_11px,#fff_11px,#fff_14px)] opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[9px] tracking-widest text-slate-400 mt-1 uppercase",
								children: [
									"*",
									transaction.trxId,
									"*"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[10px] text-slate-400",
							children: "প্রত্যাশা স্মার্ট অ্যাকাউন্টিং সিস্টেম দ্বারা তৈরি"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePrint,
						className: "h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "প্রিন্ট করুন" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleCopyMemo,
						className: "h-10 rounded-xl bg-rose-50 text-[#E52E2E] border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-95 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "কপি মেমো" })]
					})]
				})
			]
		})
	});
};
//#endregion
export { ReceiptModal };
