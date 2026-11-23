import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, Ct as Headphones, En as require_react, H as RefreshCw, K as Printer, L as Send, N as ShieldAlert, Sn as ArrowLeft, Ut as Copy, Y as Phone, Yt as Clock, Zt as CircleCheck, f as User, m as UserCheck, r as Wrench, rn as Check, rt as MessageSquare, st as MapPin } from "./chunk-vendor-icons.js";
import { t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { _ as collection, c as getDocs, g as where, l as onSnapshot, o as getDoc, p as query, u as orderBy, y as doc } from "./chunk-vendor-firebase.js";
import { t as safeStorage } from "./chunk-safeStorage.js";
import { $ as getTicketRoleLabel, G as CATEGORY_LABELS, J as TicketActivityTimeline, Q as formatTicketDateTime, X as buildPublicTrackingUrl, Y as TicketProgressStepper, Z as copyTextSafely, at as handleFirestoreError, et as getTicketStatusLabel, it as db, nt as OperationType, st as safeSetDoc, tt as sounds } from "./app.js";
//#region src/components/PublicTicketTracker.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PublicTicketTracker = ({ ticketId, lang, onExitToApp }) => {
	const isBn = lang === "bn";
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [resolvedDocId, setResolvedDocId] = (0, import_react.useState)(ticketId);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	const [networkError, setNetworkError] = (0, import_react.useState)(false);
	const [retryCounter, setRetryCounter] = (0, import_react.useState)(0);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [senderName, setSenderName] = (0, import_react.useState)("");
	const [chatText, setChatText] = (0, import_react.useState)("");
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	const chatEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			if (safeStorage.getItem("protyasha_theme") === "dark") document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
			document.body.classList.add("app-ready");
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ticketId) {
			setNotFound(true);
			setLoading(false);
			return;
		}
		let cancelled = false;
		let unsubTicket = null;
		let unsubMessages = null;
		setLoading(true);
		setNotFound(false);
		setNetworkError(false);
		let localFallback = null;
		try {
			const cachedRaw = safeStorage.getItem("protyasha_support_tickets");
			if (cachedRaw) {
				const cachedList = JSON.parse(cachedRaw);
				if (Array.isArray(cachedList)) {
					const found = cachedList.find((t) => String(t.id) === String(ticketId) || String(t.ticketNumber || "").toLowerCase() === String(ticketId).toLowerCase());
					if (found) {
						localFallback = found;
						setTicket(found);
						setResolvedDocId(String(found.id));
						setSenderName((prev) => prev || found.customerName || "");
						setLoading(false);
					}
				}
			}
		} catch {}
		const subscribeToDocId = (docId) => {
			if (cancelled) return;
			setResolvedDocId(docId);
			unsubTicket = onSnapshot(doc(db, "support_tickets", docId), async (snap) => {
				if (cancelled) return;
				if (!snap.exists()) {
					if (docId === ticketId) try {
						const byNumberSnap = await getDocs(query(collection(db, "support_tickets"), where("ticketNumber", "==", ticketId)));
						if (!cancelled && !byNumberSnap.empty) {
							const matchedDoc = byNumberSnap.docs[0];
							if (unsubTicket) unsubTicket();
							if (unsubMessages) unsubMessages();
							subscribeToDocId(matchedDoc.id);
							return;
						}
					} catch {}
					if (!localFallback) {
						setTicket(null);
						setNotFound(true);
					}
					setLoading(false);
					return;
				}
				const data = snap.data();
				const resolvedTicket = {
					...data,
					id: String(data.id || snap.id)
				};
				setTicket(resolvedTicket);
				setSenderName((prev) => prev || resolvedTicket.customerName || "");
				setNotFound(false);
				setNetworkError(false);
				setLoading(false);
			}, async (err) => {
				if (cancelled) return;
				try {
					const directSnap = await getDoc(doc(db, "support_tickets", docId));
					if (!cancelled && directSnap.exists()) {
						const data = directSnap.data();
						const resolvedTicket = {
							...data,
							id: String(data.id || directSnap.id)
						};
						setTicket(resolvedTicket);
						setSenderName((prev) => prev || resolvedTicket.customerName || "");
						setNotFound(false);
						setNetworkError(false);
						setLoading(false);
						return;
					}
				} catch {}
				setLoading(false);
				if (!localFallback) setNetworkError(true);
				handleFirestoreError(err, OperationType.GET, `support_tickets/${docId}`);
			});
			const msgQuery = query(collection(db, "support_tickets", docId, "messages"), orderBy("createdAt", "asc"));
			unsubMessages = onSnapshot(msgQuery, (snap) => {
				if (cancelled) return;
				const list = [];
				snap.forEach((d) => {
					const m = d.data();
					if (m && m.text) list.push({
						...m,
						id: String(m.id || d.id)
					});
				});
				setMessages(list);
			}, (err) => {
				handleFirestoreError(err, OperationType.LIST, `support_tickets/${docId}/messages`);
			});
		};
		const initTracker = async () => {
			let targetDocId = ticketId;
			try {
				const directSnap = await getDoc(doc(db, "support_tickets", ticketId));
				if (!cancelled && directSnap.exists()) targetDocId = ticketId;
				else {
					const qNum = query(collection(db, "support_tickets"), where("ticketNumber", "==", ticketId));
					const qNumSnap = await getDocs(qNum);
					if (!cancelled && !qNumSnap.empty) targetDocId = qNumSnap.docs[0].id;
					else {
						const qId = query(collection(db, "support_tickets"), where("id", "==", ticketId));
						const qIdSnap = await getDocs(qId);
						if (!cancelled && !qIdSnap.empty) targetDocId = qIdSnap.docs[0].id;
					}
				}
			} catch {}
			if (cancelled) return;
			subscribeToDocId((localFallback === null || localFallback === void 0 ? void 0 : localFallback.id) || targetDocId);
		};
		initTracker();
		return () => {
			cancelled = true;
			if (unsubTicket) unsubTicket();
			if (unsubMessages) unsubMessages();
		};
	}, [ticketId, retryCounter]);
	(0, import_react.useEffect)(() => {
		if (messages.length > 0) {
			var _chatEndRef$current;
			(_chatEndRef$current = chatEndRef.current) === null || _chatEndRef$current === void 0 || _chatEndRef$current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages.length]);
	const handleCopyUrl = async () => {
		sounds.playSuccess();
		if (await copyTextSafely(buildPublicTrackingUrl(resolvedDocId || ticketId))) {
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2e3);
		}
	};
	const handleSendPublicMessage = async (e) => {
		e.preventDefault();
		if (!ticket || ticket.isPublicTrackingEnabled === false || isSending) return;
		const text = chatText.trim();
		if (!text) return;
		const displayName = (senderName.trim() || ticket.customerName || (isBn ? "গ্রাহক" : "Customer")).slice(0, 150);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
		const payload = {
			id: msgId,
			ticketId: ticket.id,
			senderId: "public_customer",
			senderName: displayName,
			senderRole: "visitor",
			text: text.slice(0, 2e3),
			type: "message",
			createdAt: nowIso
		};
		setIsSending(true);
		setChatText("");
		setMessages((prev) => prev.some((m) => m.id === msgId) ? prev : [...prev, payload]);
		try {
			await safeSetDoc(doc(db, "support_tickets", ticket.id, "messages", msgId), payload);
			await safeSetDoc(doc(db, "support_tickets", ticket.id), {
				messageCount: Math.max((ticket.messageCount || 0) + 1, messages.length + 1),
				lastMessageText: text.slice(0, 300),
				lastMessageBy: displayName,
				lastMessageAt: nowIso,
				updatedAt: nowIso
			}, { merge: true }).catch(() => {});
			sounds.playTap();
		} catch (err) {
			console.error("Public ticket chat send error:", err);
			setChatText(text);
		} finally {
			setIsSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-xl bg-[#E52E2E] text-white flex items-center justify-center shrink-0 shadow-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate",
						children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক" : "Protasha Cable Network"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate",
						children: isBn ? "অনলাইন লাইভ অভিযোগ ট্র্যাকিং" : "Live Online Complaint Tracking"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playSuccess();
							window.print();
						},
						className: "h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "PDF ডাউনলোড" : "Download PDF" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleCopyUrl,
						className: "h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer",
						children: [copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: copiedLink ? isBn ? "কপি হয়েছে" : "Copied" : isBn ? "লিংক কপি" : "Copy"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							onExitToApp();
						},
						className: "h-9 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold inline-flex items-center gap-1 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মূল অ্যাপ" : "Main App" })]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 space-y-4 pb-16",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full border-3 border-rose-500 border-t-transparent animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-slate-500 dark:text-slate-400",
					children: isBn ? "লাইভ অভিযোগের তথ্য লোড হচ্ছে..." : "Loading live ticket updates..."
				})]
			}) : networkError && !ticket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-7 h-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-extrabold text-slate-900 dark:text-white",
						children: isBn ? "সার্ভারের সাথে সংযোগে সাময়িক সমস্যা" : "Temporary Connection Issue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
						children: isBn ? "ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।" : "Please check your internet connection and try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setRetryCounter((c) => c + 1),
						className: "h-10 px-5 rounded-xl bg-[#E52E2E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পুনরায় চেষ্টা করুন" : "Retry" })]
					})
				]
			}) : notFound || !ticket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-7 h-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-extrabold text-slate-900 dark:text-white",
						children: isBn ? "অভিযোগ টিকেটটি পাওয়া যায়নি" : "Support Ticket Not Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
						children: isBn ? "লিংকটি ভুল হতে পারে অথবা টিকেটটি মুছে ফেলা হয়েছে। সঠিক ট্র্যাকিং লিংকের জন্য অফিসে যোগাযোগ করুন।" : "The tracking link may be invalid or this ticket was removed."
					})
				]
			}) : ticket.isPublicTrackingEnabled === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-7 h-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-extrabold text-slate-900 dark:text-white",
						children: isBn ? "পাবলিক ট্র্যাকিং সাময়িকভাবে বন্ধ রয়েছে" : "Public Tracking Paused"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 dark:text-slate-400",
						children: isBn ? "কর্তৃপক্ষ এই অভিযোগের পাবলিক লিংকটি বর্তমানে বন্ধ রেখেছেন।" : "Public visibility is currently disabled for this ticket."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "printable-ticket-report",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center flex-wrap gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
										children: ["#", ticket.ticketNumber]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60",
										children: CATEGORY_LABELS[ticket.category] ? isBn ? CATEGORY_LABELS[ticket.category].bn : CATEGORY_LABELS[ticket.category].en : ticket.category
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2",
									children: [ticket.customerName, ticket.customerCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400",
										children: [
											"(",
											ticket.customerCode,
											")"
										]
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 ${ticket.status === "resolved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300" : ticket.status === "in_progress" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300" : ticket.status === "reviewing" ? "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300"}`,
									children: getTicketStatusLabel(ticket.status, isBn)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300",
								children: [
									ticket.area && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }), ticket.area]
									}),
									ticket.assignedStaffName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 font-semibold text-indigo-700 dark:text-indigo-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "w-3.5 h-3.5" }),
											isBn ? "টেকনিশিয়ান:" : "Technician:",
											" ",
											ticket.assignedStaffName
										]
									}),
									ticket.customerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 font-semibold tabular-nums",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-slate-400" }), ticket.customerPhone]
									})
								]
							}),
							ticket.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 leading-relaxed",
								children: ticket.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 text-rose-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-500 dark:text-slate-400",
												children: isBn ? "অভিযোগ দাখিল:" : "Filed by:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-extrabold",
												children: ticket.createdBy || (isBn ? "অ্যাডমিন" : "Admin")
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 tabular-nums text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }), formatTicketDateTime(ticket.createdAt, isBn)]
									})]
								}), ticket.status === "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-emerald-700 dark:text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "সমাধানকারী:" : "Resolved by:" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-extrabold",
												children: ticket.resolvedBy || ticket.assignedStaffName || (isBn ? "অ্যাডমিন" : "Admin")
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 tabular-nums text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), formatTicketDateTime(ticket.resolvedAt || ticket.updatedAt, isBn)]
									})]
								})]
							}),
							ticket.resolutionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isBn ? "সমাধান নোট: " : "Resolution Note: " }), ticket.resolutionNote] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketProgressStepper, {
						status: ticket.status,
						lang
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketActivityTimeline, {
						ticket,
						lang
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white",
									children: isBn ? "লাইভ মেসেজ ও আপডেট" : "Live Conversation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-500 dark:text-slate-400",
									children: isBn ? "এখান থেকেই সাপোর্ট টিমের সাথে রিয়েল-টাইম কথা বলুন" : "Chat with our support team in real time"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-3 max-h-[360px] overflow-y-auto bg-slate-50/60 dark:bg-slate-950/40",
								children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-xs text-slate-500 dark:text-slate-400 py-8",
									children: isBn ? "এখনো কোনো মেসেজ নেই। নিচে লিখে বার্তা পাঠান।" : "No messages yet."
								}) : messages.map((msg) => {
									if (msg.type === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center",
											children: [
												msg.text,
												" • ",
												formatTicketDateTime(msg.createdAt, isBn)
											]
										})
									}, msg.id);
									const isCustomerSide = msg.senderId === "public_customer" || msg.senderRole === "visitor";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex flex-col ${isCustomerSide ? "items-end" : "items-start"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 px-1 mb-0.5 text-[10px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-extrabold text-slate-600 dark:text-slate-400",
												children: msg.senderName
											}), msg.senderRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold",
												children: getTicketRoleLabel(msg.senderRole, isBn)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `max-w-[84%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${isCustomerSide ? "bg-[#E52E2E] text-white rounded-br-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-bl-sm"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "whitespace-pre-wrap break-words font-medium",
												children: msg.text
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `text-[10px] mt-1 text-right ${isCustomerSide ? "text-white/80" : "text-slate-400"}`,
												children: formatTicketDateTime(msg.createdAt, isBn)
											})]
										})]
									}, msg.id);
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: chatEndRef })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSendPublicMessage,
								className: "p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: senderName,
									onChange: (e) => setSenderName(e.target.value),
									placeholder: isBn ? "আপনার নাম" : "Your name",
									className: "w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: chatText,
										onChange: (e) => setChatText(e.target.value),
										placeholder: isBn ? "মেসেজ লিখুন..." : "Write a message...",
										className: "flex-1 h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: isSending || !chatText.trim(),
										className: "w-11 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4.5 h-4.5" })
									})]
								})]
							})
						]
					})
				]
			})
		})]
	});
};
//#endregion
export { PublicTicketTracker };
