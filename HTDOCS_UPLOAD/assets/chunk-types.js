//#region src/types.ts
var SUB_ADMIN_PERMISSION_ITEMS = [
	{
		key: "transactions",
		labelBn: "লেনদেন তালিকা দেখা",
		labelEn: "View Transactions",
		descBn: "লেনদেন ট্যাব ও বিস্তারিত দেখার অনুমতি",
		descEn: "Allow viewing transactions tab & details"
	},
	{
		key: "addTransactions",
		labelBn: "আয় / ব্যয় এন্ট্রি ও সম্পাদনা",
		labelEn: "Add & Edit Income/Expense",
		descBn: "নতুন লেনদেন যোগ ও নিজের এন্ট্রি ৩০ মিনিটে সম্পাদনা",
		descEn: "Add transactions and edit own entries within 30 mins"
	},
	{
		key: "ledger",
		labelBn: "হিসাব খাতা (লেজার)",
		labelEn: "Ledger / Accounts Book",
		descBn: "হিসাব খাতা ট্যাব ও রিপোর্ট দেখার অনুমতি",
		descEn: "Allow viewing ledger tab & reports"
	},
	{
		key: "billManager",
		labelBn: "বিল ম্যানেজার প্রো",
		labelEn: "Bill Manager Pro",
		descBn: "গ্রাহক বিল ম্যানেজমেন্ট ও ডকুমেন্ট সেবা",
		descEn: "Customer billing portal access"
	},
	{
		key: "ayByay",
		labelBn: "দৈনিক আয়-ব্যয় পোর্টাল",
		labelEn: "Daily Ay-Byay Portal",
		descBn: "ইনকাম/খরচ/ইনভেন্টরি পোর্টাল ব্যবহার ও এন্ট্রি",
		descEn: "Daily Ay-Byay portal viewing & entries"
	},
	{
		key: "quickHisab",
		labelBn: "কুইক হিসাব ও লভ্যাংশ",
		labelEn: "Quick Hisab & Shares",
		descBn: "মালিক ও লভ্যাংশ ড্যাশবোর্ড দেখার অনুমতি",
		descEn: "Quick Hisab & ownership share dashboard access"
	},
	{
		key: "staffManager",
		labelBn: "স্টাফ কালেকশন ও কোম্পানি পাওনা",
		labelEn: "Staff Dues & Collection",
		descBn: "স্টাফ/মালিকদের কোম্পানি পাওনা ও জমা ব্যবস্থাপনা",
		descEn: "Manage staff & owner company dues"
	},
	{
		key: "staffAttendance",
		labelBn: "স্টাফ হাজিরা ও ছুটি",
		labelEn: "Staff Attendance & Leave",
		descBn: "হাজিরা শীট দেখা ও হাজিরা/ছুটি পরিচালনা",
		descEn: "Staff attendance & leave management"
	},
	{
		key: "supportTickets",
		labelBn: "গ্রাহক অভিযোগ ও সাপোর্ট",
		labelEn: "Support Tickets",
		descBn: "অভিযোগ টিকেট দেখা, আপডেট ও লাইভ চ্যাট",
		descEn: "Support ticket tracking & chat"
	}
];
var DEFAULT_SUB_ADMIN_PERMISSIONS = {
	transactions: true,
	addTransactions: true,
	ledger: true,
	billManager: true,
	ayByay: true,
	quickHisab: true,
	staffManager: true,
	staffAttendance: true,
	supportTickets: true
};
//#endregion
export { SUB_ADMIN_PERMISSION_ITEMS as n, DEFAULT_SUB_ADMIN_PERMISSIONS as t };
