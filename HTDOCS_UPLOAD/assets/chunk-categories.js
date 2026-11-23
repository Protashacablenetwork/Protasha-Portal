//#region src/portals/ayByay/data/categories.ts
var INCOME_CATEGORIES = [
	"মাসিক ইন্টারনেট বিল",
	"ডিস বিল",
	"বকেয়া বিল",
	"নতুন সংযোগ ফি",
	"অন্যান্য আয়"
];
var EXPENSE_CATEGORIES = [
	"ব্যান্ডউইথ/আপস্ট্রিম বিল",
	"বিদ্যুৎ বিল",
	"অফিস ভাড়া",
	"কর্মচারীদের বেতন",
	"অপটিক্যাল ফাইবার ও কেবল",
	"ONU/OLT/Router ক্রয়",
	"স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ",
	"কেবল মেরামত ও রক্ষণাবেক্ষণ",
	"যাতায়াত ও পরিবহন খরচ",
	"মোবাইল/ইন্টারনেট/যোগাযোগ খরচ",
	"অফিস স্টেশনারি",
	"সফটওয়্যার/সিস্টেম/লাইসেন্স খরচ",
	"বিজ্ঞাপন ও প্রচারণা",
	"ব্যাংক/bKash/Nagad/পেমেন্ট গেটওয়ে চার্জ",
	"UPS/ব্যাটারি/জেনারেটর রক্ষণাবেক্ষণ",
	"উত্তলন",
	"অন্যান্য খরচ"
];
var STAFF_DESIGNATIONS = [
	"চিফ নেটওয়ার্ক ইঞ্জিনিয়ার",
	"সিনিয়র লাইন টেকনিশিয়ান ও স্প্লাইসার",
	"বিল কালেকশন ও এরিয়া ম্যানেজার",
	"হেল্পডেস্ক ও কাস্টমার সাপোর্ট",
	"আইটি ও সার্ভার অ্যাডমিন",
	"অফিস অ্যাসিস্ট্যান্ট / পিয়ন"
];
var PAYMENT_METHODS = [
	"নগদ (Cash)",
	"বিকাশ (bKash)",
	"নগদ (Nagad)",
	"রকেট (Rocket)",
	"ব্যাংক ট্রান্সফার",
	"চেক"
];
function parseNumber(val) {
	if (typeof val === "number") return isNaN(val) ? 0 : val;
	if (!val) return 0;
	const bengaliDigits = [
		"০",
		"১",
		"২",
		"৩",
		"৪",
		"৫",
		"৬",
		"৭",
		"৮",
		"৯"
	];
	let str = String(val).trim();
	bengaliDigits.forEach((b, i) => {
		str = str.split(b).join(String(i));
	});
	str = str.replace(/[^0-9.-]/g, "");
	const num = parseFloat(str);
	return isNaN(num) ? 0 : num;
}
function isIncomeTransaction(t) {
	if (!t) return false;
	const tp = String(t.type || "").trim().toLowerCase();
	if (tp === "income" || tp === "আয়" || tp === "আয়") return true;
	if (tp === "expense" || tp === "ব্যয়" || tp === "ব্যয়" || tp === "খরচ") return false;
	const cat = String(t.category || "").toLowerCase();
	if (cat.includes("আয়") || cat.includes("বিল কালেকশন") || cat.includes("income")) return true;
	return false;
}
function isExpenseTransaction(t) {
	if (!t) return false;
	return !isIncomeTransaction(t);
}
function formatCurrency(amount, symbol = "৳") {
	try {
		return `${symbol} ${parseNumber(amount).toLocaleString("bn-BD")}`;
	} catch {
		return `${symbol} ${parseNumber(amount).toLocaleString()}`;
	}
}
function formatEnglishCurrency(amount, symbol = "৳") {
	try {
		return `${symbol} ${parseNumber(amount).toLocaleString("en-US")}`;
	} catch {
		return `${symbol} ${parseNumber(amount).toLocaleString()}`;
	}
}
function getTransactionMonth(dateStr) {
	if (!dateStr || typeof dateStr !== "string") return "";
	const str = dateStr.trim();
	if (/^\d{4}-\d{2}/.test(str)) return str.substring(0, 7);
	const dmy = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/);
	if (dmy) {
		const p1 = parseInt(dmy[1], 10);
		const p2 = parseInt(dmy[2], 10);
		return `${dmy[3]}-${p2 > 12 ? String(p1).padStart(2, "0") : String(p2).padStart(2, "0")}`;
	}
	const ymd = str.match(/^(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})/);
	if (ymd) return `${ymd[1]}-${ymd[2].padStart(2, "0")}`;
	try {
		const d = new Date(str);
		if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	} catch {}
	return "";
}
function getMonthBengaliName(monthString) {
	if (!monthString || typeof monthString !== "string") return "";
	try {
		const parts = monthString.split("-");
		if (parts.length < 2) return monthString;
		const [year, month] = parts;
		return `${[
			"জানুয়ারি",
			"ফেব্রুয়ারি",
			"মার্চ",
			"এপ্রিল",
			"মে",
			"জুন",
			"জুলাই",
			"আগস্ট",
			"সেপ্টেম্বর",
			"অক্টোবর",
			"নভেম্বর",
			"ডিসেম্বর"
		][parseInt(month, 10) - 1] || month} ${year}`;
	} catch {
		return String(monthString);
	}
}
//#endregion
export { formatCurrency as a, getTransactionMonth as c, parseNumber as d, STAFF_DESIGNATIONS as i, isExpenseTransaction as l, INCOME_CATEGORIES as n, formatEnglishCurrency as o, PAYMENT_METHODS as r, getMonthBengaliName as s, EXPENSE_CATEGORIES as t, isIncomeTransaction as u };
