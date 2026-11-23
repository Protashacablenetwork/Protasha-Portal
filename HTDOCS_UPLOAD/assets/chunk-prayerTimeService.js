import { t as safeStorage } from "./chunk-safeStorage.js";
import { i as toBengaliNumber } from "./chunk-formatters.js";
import { o as getLocationSourceType } from "./chunk-weatherService.js";
//#region src/utils/hijriDate.ts
var HIJRI_MONTHS_BN = [
	"মুহাররম",
	"সফর",
	"রবিউল আউয়াল",
	"রবিউস সানি",
	"জুমাদাল উলা",
	"জুমাদাল উখরা",
	"রজব",
	"শাবান",
	"রমাদান",
	"শাওয়াল",
	"জিলকদ",
	"জিলহজ"
];
/**
* Calculate accurate Hijri Date with optional lunar sight adjustment
*/
function getHijriDate(date = /* @__PURE__ */ new Date(), dayAdjustment = 0) {
	const adjusted = new Date(date);
	if (dayAdjustment !== 0) adjusted.setDate(adjusted.getDate() + dayAdjustment);
	let day = 1;
	let month = 1;
	let year = 1448;
	try {
		const parts = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
			day: "numeric",
			month: "numeric",
			year: "numeric"
		}).formatToParts(adjusted);
		for (const part of parts) {
			if (part.type === "day") day = parseInt(part.value, 10) || 1;
			if (part.type === "month") month = parseInt(part.value, 10) || 1;
			if (part.type === "year") year = parseInt(part.value, 10) || 1448;
		}
	} catch {
		let l = Math.floor(adjusted.getTime() / 864e5) + 2440587.5 - 1948440 + 10632;
		const n = Math.floor((l - 1) / 10631);
		l = l - 10631 * n + 354;
		const j = Math.floor((10985 - l) / 5316) * Math.floor(50 * l / 17719) + Math.floor(l / 5670) * Math.floor(43 * l / 15238);
		l = l - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
		month = Math.floor(24 * l / 709);
		day = l - Math.floor(709 * month / 24);
		year = 30 * n + j - 30;
	}
	const clampedMonth = Math.max(1, Math.min(12, month));
	const monthBn = HIJRI_MONTHS_BN[clampedMonth - 1] || "মুহাররম";
	const dayBn = toBengaliNumber(day);
	const yearBn = toBengaliNumber(year);
	return {
		day,
		month: clampedMonth,
		year,
		dayBn,
		monthBn,
		yearBn,
		formattedBn: `${dayBn} ${monthBn}, ${yearBn} হিজরি`,
		shortBn: `${dayBn} ${monthBn}`,
		isRamadan: clampedMonth === 9
	};
}
/**
* Find the primary Gregorian month (0-indexed) in a given year where Ramadan falls
*/
function findRamadanMonthInYear(year) {
	let bestMonth = 1;
	let bestCount = 0;
	let bestHijriYear = 1448;
	for (let m = 0; m < 12; m++) {
		const daysInMonth = new Date(year, m + 1, 0).getDate();
		let count = 0;
		let hy = 1448;
		for (let d = 1; d <= daysInMonth; d++) {
			const h = getHijriDate(new Date(year, m, d, 12, 0, 0));
			if (h.isRamadan) {
				count++;
				hy = h.year;
			}
		}
		if (count > bestCount) {
			bestCount = count;
			bestMonth = m;
			bestHijriYear = hy;
		}
	}
	return {
		monthIndex: bestMonth,
		hijriYear: bestHijriYear,
		daysMatched: bestCount
	};
}
/**
* Calculate days remaining until the next 1st of Ramadan from a reference date
*/
function getDaysUntilNextRamadan(fromDate = /* @__PURE__ */ new Date()) {
	if (getHijriDate(fromDate).isRamadan) return 0;
	const probe = new Date(fromDate);
	probe.setHours(12, 0, 0, 0);
	for (let i = 1; i <= 370; i++) {
		probe.setDate(probe.getDate() + 1);
		if (getHijriDate(probe).isRamadan) return i;
	}
	return 0;
}
//#endregion
//#region src/utils/prayerTimeService.ts
function format12hBn(timeStr24) {
	if (!timeStr24) return "";
	const [hStr, mStr] = timeStr24.split(":");
	let h = parseInt(hStr, 10);
	const m = mStr ? parseInt(mStr, 10) : 0;
	const ampm = h >= 12 ? "PM" : "AM";
	h = h % 12 || 12;
	const hFormatted = h < 10 ? `0${h}` : `${h}`;
	const mFormatted = m < 10 ? `0${m}` : `${m}`;
	return `${toBengaliNumber(hFormatted)}:${toBengaliNumber(mFormatted)} ${ampm}`;
}
/**
* Astronomical formula approximation for Bangladesh Prayer Times (Karachi / ISNA method)
*/
function parseTimeToDate(timeStr, baseDate) {
	const d = new Date(baseDate);
	d.setSeconds(0, 0);
	if (!timeStr) return d;
	const [hStr, mStr] = timeStr.split(" ")[0].split(":");
	const h = parseInt(hStr, 10);
	const m = parseInt(mStr, 10);
	if (!isNaN(h) && !isNaN(m)) d.setHours(h, m, 0, 0);
	return d;
}
/**
* Astronomical formula approximation for Bangladesh Prayer Times (Karachi / ISNA method)
*/
function calculateLocalPrayerTimes(district, date = /* @__PURE__ */ new Date()) {
	const lat = district.lat;
	const lon = district.lon;
	const start = new Date(date.getFullYear(), 0, 0);
	const diff = date.getTime() - start.getTime();
	const dayOfYear = Math.floor(diff / 864e5);
	const declination = -23.44 * Math.cos(2 * Math.PI / 365 * (dayOfYear + 10));
	const b = 2 * Math.PI / 365 * (dayOfYear - 81);
	const eqTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
	const solarNoonMin = 720 + ((90 - lon) * 4 - eqTime);
	const latRad = lat * Math.PI / 180;
	const decRad = declination * Math.PI / 180;
	const hourAngle = (angleDeg) => {
		const angleRad = angleDeg * Math.PI / 180;
		const cosHA = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
		return Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180 / Math.PI;
	};
	const fajrHA = hourAngle(-18);
	const sunriseHA = hourAngle(-.833);
	const sunsetHA = hourAngle(-.833);
	const asrHA = hourAngle(Math.atan(1 / (2 + Math.tan(Math.abs(latRad - decRad)))) * 180 / Math.PI);
	const ishaHA = hourAngle(-18);
	const fajrMin = solarNoonMin - fajrHA * 4;
	const sunriseMin = solarNoonMin - sunriseHA * 4;
	const dhuhrMin = solarNoonMin + 2;
	const asrMin = solarNoonMin + asrHA * 4;
	const sunsetMin = solarNoonMin + sunsetHA * 4;
	const maghribMin = sunsetMin + 3;
	const ishaMin = solarNoonMin + ishaHA * 4;
	const minToDate = (min) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		d.setMinutes(Math.round(min));
		return d;
	};
	const fajrDate = minToDate(fajrMin);
	const sunriseDate = minToDate(sunriseMin);
	const dhuhrDate = minToDate(dhuhrMin);
	const asrDate = minToDate(asrMin);
	const sunsetDate = minToDate(sunsetMin);
	const maghribDate = minToDate(maghribMin);
	const ishaDate = minToDate(ishaMin);
	const formatMin = (min) => {
		const h = Math.floor(min / 60) % 24;
		const m = Math.floor(min % 60);
		return format12hBn(`${h < 10 ? `0${h}` : `${h}`}:${m < 10 ? `0${m}` : `${m}`}`);
	};
	const now = date.getTime();
	let nextPrayerNameBn = "ফজর";
	let nextPrayerTimeBn = formatMin(fajrMin);
	let nextPrayerDate = minToDate(fajrMin + 1440);
	if (now < fajrDate.getTime()) {
		nextPrayerNameBn = "ফজর";
		nextPrayerTimeBn = formatMin(fajrMin);
		nextPrayerDate = fajrDate;
	} else if (now < dhuhrDate.getTime()) {
		nextPrayerNameBn = "যোহর";
		nextPrayerTimeBn = formatMin(dhuhrMin);
		nextPrayerDate = dhuhrDate;
	} else if (now < asrDate.getTime()) {
		nextPrayerNameBn = "আসর";
		nextPrayerTimeBn = formatMin(asrMin);
		nextPrayerDate = asrDate;
	} else if (now < maghribDate.getTime()) {
		nextPrayerNameBn = "মাগরিব";
		nextPrayerTimeBn = formatMin(maghribMin);
		nextPrayerDate = maghribDate;
	} else if (now < ishaDate.getTime()) {
		nextPrayerNameBn = "ইশা";
		nextPrayerTimeBn = formatMin(ishaMin);
		nextPrayerDate = ishaDate;
	}
	const diffMs = Math.max(0, nextPrayerDate.getTime() - now);
	const diffHours = Math.floor(diffMs / 36e5);
	const diffMins = Math.floor(diffMs % 36e5 / 6e4);
	let remainingStr = "";
	if (diffHours > 0) remainingStr += `${toBengaliNumber(diffHours)} ঘণ্টা `;
	remainingStr += `${toBengaliNumber(diffMins)} মিনিট বাকি`;
	const sehriEndMin = Math.max(0, fajrMin - 6);
	const tahajjudMin = Math.max(0, fajrMin - 25);
	const ishraqMin = sunriseMin + 15;
	const chashtMin = sunriseMin + 120;
	const awwabinMin = maghribMin + 15;
	const sehriEndDate = minToDate(sehriEndMin);
	return {
		dateStr: date.toISOString().split("T")[0],
		cityBn: district.nameBn,
		cityEn: district.nameEn,
		tahajjud: formatMin(tahajjudMin),
		sehriEnd: formatMin(sehriEndMin),
		fajr: formatMin(fajrMin),
		sunrise: formatMin(sunriseMin),
		ishraq: formatMin(ishraqMin),
		chasht: formatMin(chashtMin),
		dhuhr: formatMin(dhuhrMin),
		asr: formatMin(asrMin),
		sunset: formatMin(sunsetMin),
		maghrib: formatMin(maghribMin),
		awwabin: formatMin(awwabinMin),
		isha: formatMin(ishaMin),
		nextPrayerNameBn,
		nextPrayerTimeBn,
		timeRemainingBn: remainingStr,
		raw: {
			sehriEnd: sehriEndDate,
			fajr: fajrDate,
			sunrise: sunriseDate,
			dhuhr: dhuhrDate,
			asr: asrDate,
			sunset: sunsetDate,
			maghrib: maghribDate,
			isha: ishaDate
		}
	};
}
/**
* Fetch online prayer timings via Aladhan API with offline calculation fallback
*/
async function fetchLivePrayerTimes(district, date = /* @__PURE__ */ new Date()) {
	try {
		const url = `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${district.lat.toFixed(4)}&longitude=${district.lon.toFixed(4)}&method=1`;
		const res = await fetch(url, { signal: AbortSignal.timeout(3e3) });
		if (res.ok) {
			var _data$data;
			const t = (_data$data = (await res.json()).data) === null || _data$data === void 0 ? void 0 : _data$data.timings;
			if (t) {
				const localCalc = calculateLocalPrayerTimes(district, date);
				const rawFajr = parseTimeToDate(t.Fajr, date);
				const rawSehriEnd = /* @__PURE__ */ new Date(rawFajr.getTime() - 36e4);
				const rawSunrise = parseTimeToDate(t.Sunrise, date);
				const rawDhuhr = parseTimeToDate(t.Dhuhr, date);
				const rawAsr = parseTimeToDate(t.Asr, date);
				const rawSunset = parseTimeToDate(t.Sunset, date);
				const rawMaghrib = parseTimeToDate(t.Maghrib, date);
				const rawIsha = parseTimeToDate(t.Isha, date);
				const sehriHH = String(rawSehriEnd.getHours()).padStart(2, "0");
				const sehriMM = String(rawSehriEnd.getMinutes()).padStart(2, "0");
				return {
					...localCalc,
					sehriEnd: format12hBn(`${sehriHH}:${sehriMM}`),
					fajr: format12hBn(t.Fajr),
					sunrise: format12hBn(t.Sunrise),
					dhuhr: format12hBn(t.Dhuhr),
					asr: format12hBn(t.Asr),
					sunset: format12hBn(t.Sunset),
					maghrib: format12hBn(t.Maghrib),
					isha: format12hBn(t.Isha),
					raw: {
						sehriEnd: rawSehriEnd,
						fajr: rawFajr,
						sunrise: rawSunrise,
						dhuhr: rawDhuhr,
						asr: rawAsr,
						sunset: rawSunset,
						maghrib: rawMaghrib,
						isha: rawIsha
					}
				};
			}
		}
	} catch (e) {
		console.warn("Aladhan Prayer Times API error, fallback to calculation:", e);
	}
	return calculateLocalPrayerTimes(district, date);
}
/**
* Generate location-based automated prayer time & sunrise/sunset notifications
*/
function checkAndGeneratePrayerNotifications(district, currentNotifications) {
	const now = /* @__PURE__ */ new Date();
	const currentHour = now.getHours();
	const currentMin = now.getMinutes();
	const totalMinutes = currentHour * 60 + currentMin;
	const todayStr = now.toISOString().split("T")[0];
	const citySlug = (district.nameEn || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "_");
	const prayerTimes = calculateLocalPrayerTimes(district, now);
	let targetSlot = null;
	if (totalMinutes >= 180 && totalMinutes < 300) targetSlot = {
		id: `prayer_tahajjud_${citySlug}_${todayStr}`,
		titleBn: `🌙 তাহাজ্জুদ ও সাহরীর শেষ সময়: ${district.nameBn}`,
		titleEn: `🌙 Tahajjud & Sehri Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} সাহরী ও তাহাজ্জুদ সময়সূচি】\n• সাহরীর শেষ সময়: ${prayerTimes.sehriEnd}\n• ফজরের ওয়াক্ত শুরু: ${prayerTimes.fajr}\n• আজকের ইফতার: ${prayerTimes.maghrib}\n\nতাহাজ্জুদ সালাত ও সাহরীর বরকতপূর্ণ সময়। আল্লাহ আপনার দিনটি শান্তিময় ও কল্যাণময় করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nSehri End: ${prayerTimes.sehriEnd} | Fajr starts: ${prayerTimes.fajr} | Iftar: ${prayerTimes.maghrib}`
	};
	else if (totalMinutes >= 300 && totalMinutes < 375) targetSlot = {
		id: `prayer_fajr_${citySlug}_${todayStr}`,
		titleBn: `🕌 ফজরের সালাতের ওয়াক্ত: ${district.nameBn}`,
		titleEn: `🕌 Fajr Prayer Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} ফজরের সময়সূচি】\n• ফজরের ওয়াক্ত: ${prayerTimes.fajr}\n• সূর্যোদয়: ${prayerTimes.sunrise}\n\n'আস-সালাতু খাইরুম মিনান নাওম' — ঘুমের চেয়ে সালাত উত্তম। জামাতের সাথে ফজরের সালাত আদায় করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nFajr: ${prayerTimes.fajr} | Sunrise: ${prayerTimes.sunrise}`
	};
	else if (totalMinutes >= 375 && totalMinutes < 510) targetSlot = {
		id: `prayer_sunrise_${citySlug}_${todayStr}`,
		titleBn: `🌅 সূর্যোদয় ও ইশরাক সালাত: ${district.nameBn}`,
		titleEn: `🌅 Sunrise & Ishraq Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} সূর্যোদয় বার্তা】\n• সূর্যোদয়ের সময়: ${prayerTimes.sunrise}\n• ইশরাকের ওয়াক্ত: ${prayerTimes.ishraq}\n• আজকের সূর্যাস্ত: ${prayerTimes.sunset}\n\nসূর্যোদয়ের ১৫ মিনিট পর ইশরাকের সালাত আদায় করে এক পূর্ণ হজ ও ওমরার সওয়াব অর্জন করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nSunrise: ${prayerTimes.sunrise} | Ishraq: ${prayerTimes.ishraq} | Sunset: ${prayerTimes.sunset}`
	};
	else if (totalMinutes >= 510 && totalMinutes < 705) targetSlot = {
		id: `prayer_chasht_${citySlug}_${todayStr}`,
		titleBn: `☀️ চাশত (দুহা) সালাত বার্তা: ${district.nameBn}`,
		titleEn: `☀️ Chasht / Dhuha Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} চাশতের সময়সূচি】\n• চাশত (দুহা) ওয়াক্ত: ${prayerTimes.chasht} থেকে যোহরের পূর্ব পর্যন্ত\n• যোহরের সম্ভাব্য সময়: ${prayerTimes.dhuhr}\n\nচাশতের সালাত শরীরের ৩৬০টি অঙ্গ-প্রত্যঙ্গের সদকা স্বরূপ। ব্যবসায় ও উপার্জনে বরকতের জন্য দোয়া করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nChasht / Dhuha: ${prayerTimes.chasht} | Dhuhr: ${prayerTimes.dhuhr}`
	};
	else if (totalMinutes >= 705 && totalMinutes < 900) targetSlot = {
		id: `prayer_dhuhr_${citySlug}_${todayStr}`,
		titleBn: `🕌 যোহরের সালাতের ওয়াক্ত: ${district.nameBn}`,
		titleEn: `🕌 Dhuhr Prayer Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} যোহরের সময়সূচি】\n• যোহরের ওয়াক্ত: ${prayerTimes.dhuhr}\n• আসরের সম্ভাব্য সময়: ${prayerTimes.asr}\n\nদুপুরের কর্মব্যস্ততার মাঝে যোহরের সালাত জামাতে আদায় করুন। সালাতে রয়েছে অফুরন্ত শান্তি ও রিজিকের বরকত।`,
		bodyEn: `【${district.nameEn} Schedule】\nDhuhr: ${prayerTimes.dhuhr} | Asr: ${prayerTimes.asr}`
	};
	else if (totalMinutes >= 900 && totalMinutes < 1035) targetSlot = {
		id: `prayer_asr_${citySlug}_${todayStr}`,
		titleBn: `🕌 আসরের সালাতের ওয়াক্ত: ${district.nameBn}`,
		titleEn: `🕌 Asr Prayer Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} আসরের সময়সূচি】\n• আসরের ওয়াক্ত: ${prayerTimes.asr}\n• সূর্যাস্ত: ${prayerTimes.sunset}\n\nআসরের সালাত (সালাতুল উস্তা) হেফাজত করুন। সূর্যাস্তের পূর্বে সময়মতো আসরের সালাত আদায় নিশ্চিত করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nAsr: ${prayerTimes.asr} | Sunset: ${prayerTimes.sunset}`
	};
	else if (totalMinutes >= 1035 && totalMinutes < 1125) targetSlot = {
		id: `prayer_sunset_${citySlug}_${todayStr}`,
		titleBn: `🌇 সূর্যাস্ত ও মাগরিব সালাত: ${district.nameBn}`,
		titleEn: `🌇 Sunset & Maghrib Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} সূর্যাস্ত ও মাগরিব】\n• আজকের সূর্যাস্ত: ${prayerTimes.sunset}\n• মাগরিবের ওয়াক্ত: ${prayerTimes.maghrib}\n• ইশার সময়: ${prayerTimes.isha}\n\nসূর্যাস্তের মুহূর্ত দোয়া কবুলের শ্রেষ্ঠ সময়। বিলম্ব না করে অবিলম্বে মাগরিবের সালাত আদায় করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nSunset: ${prayerTimes.sunset} | Maghrib: ${prayerTimes.maghrib} | Isha: ${prayerTimes.isha}`
	};
	else if (totalMinutes >= 1125 && totalMinutes < 1185) targetSlot = {
		id: `prayer_awwabin_${citySlug}_${todayStr}`,
		titleBn: `🌙 আউয়াবীন সালাতের বার্তা: ${district.nameBn}`,
		titleEn: `🌙 Awwabin Prayer Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} আউয়াবীন ওয়াক্ত】\n• আউয়াবীন সালাত: ${prayerTimes.awwabin} (মাগরিবের পর ৬ রাকাত নফল)\n• ইশার সম্ভাব্য সময়: ${prayerTimes.isha}\n\nহাদিস শরীফে আউয়াবীন সালাতের বিশেষ মর্যাদা ও গুনাহ মাফের সুসংবাদ রয়েছে।`,
		bodyEn: `【${district.nameEn} Schedule】\nAwwabin: ${prayerTimes.awwabin} | Isha: ${prayerTimes.isha}`
	};
	else targetSlot = {
		id: `prayer_isha_${citySlug}_${todayStr}`,
		titleBn: `🕌 ইশা ও বিতর সালাতের ওয়াক্ত: ${district.nameBn}`,
		titleEn: `🕌 Isha & Witr Prayer Alert: ${district.nameEn}`,
		bodyBn: `【${district.nameBn} ইশার সময়সূচি】\n• ইশার ওয়াক্ত: ${prayerTimes.isha}\n• বিতর সালাতের সময়: ইশার পর ঘুমানোর পূর্বে\n\nদিনের শেষ ফরজ সালাত ইশা জামাতে আদায় করে শান্তিময় ঘুমে যান। আল্লাহ আপনার রাত বরকতময় করুন।`,
		bodyEn: `【${district.nameEn} Schedule】\nIsha: ${prayerTimes.isha}`
	};
	if (!targetSlot) return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
	const safeStorageKey = `notif_prayer_${targetSlot.id}`;
	const alreadySent = safeStorage.getItem(safeStorageKey);
	const existsInList = currentNotifications.some((n) => n.id === targetSlot.id);
	if (!alreadySent && !existsInList) {
		const formattedDate = `${toBengaliNumber(now.getDate())} ${now.toLocaleString("bn-BD", { month: "short" })}`;
		const formattedTime = now.toLocaleTimeString("bn-BD", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
		const notifItem = {
			id: targetSlot.id,
			titleBn: targetSlot.titleBn,
			titleEn: targetSlot.titleEn,
			bodyBn: targetSlot.bodyBn,
			bodyEn: targetSlot.bodyEn,
			messageBn: targetSlot.bodyBn,
			messageEn: targetSlot.bodyEn,
			date: formattedDate,
			timeBn: `${formattedDate}, ${toBengaliNumber(formattedTime)}`,
			timeEn: now.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true
			}),
			type: "info",
			isRead: false,
			districtBn: district.nameBn,
			districtEn: district.nameEn,
			isPrayerAlert: true
		};
		try {
			safeStorage.setItem(safeStorageKey, "1");
		} catch {}
		return {
			updatedNotifications: [notifItem, ...currentNotifications],
			newlyAdded: notifItem
		};
	}
	return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
}
var FASTING_REMINDER_STORAGE_KEY = "protyasha_fasting_reminder_enabled";
function isFastingReminderEnabled() {
	return safeStorage.getItem(FASTING_REMINDER_STORAGE_KEY) !== "false";
}
function setFastingReminderEnabled(enabled) {
	safeStorage.setItem(FASTING_REMINDER_STORAGE_KEY, enabled ? "true" : "false");
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("fasting-reminder-setting-changed", { detail: { enabled } }));
}
/**
* Helper to construct a richly structured Sehri & Iftar timetable NotificationItem
* strictly tailored to the user's real/selected district.
*/
function buildSehriIftarScheduleNotification(district, prayerTimes, slotType, options) {
	const now = (options === null || options === void 0 ? void 0 : options.now) || /* @__PURE__ */ new Date();
	const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const citySlug = (district.nameEn || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "_");
	const hijri = getHijriDate(now);
	const dateStrBn = `${[
		"রবিবার",
		"সোমবার",
		"মঙ্গলবার",
		"বুধবার",
		"বৃহস্পতিবার",
		"শুক্রবার",
		"শনিবার"
	][now.getDay()]}, ${toBengaliNumber(now.getDate())} ${BENGALI_MONTHS[now.getMonth()]} ${toBengaliNumber(now.getFullYear())}`;
	const durMins = Math.max(0, Math.round((prayerTimes.raw.maghrib.getTime() - prayerTimes.raw.sehriEnd.getTime()) / 6e4));
	const durH = Math.floor(durMins / 60);
	const durM = durMins % 60;
	const fastDurationBn = `${toBengaliNumber(durH)} ঘণ্টা ${toBengaliNumber(durM)} মিনিট`;
	const locSource = (options === null || options === void 0 ? void 0 : options.locationSource) || getLocationSourceType();
	let id = (options === null || options === void 0 ? void 0 : options.idOverride) || `fasting_${slotType}_${citySlug}_${todayStr}`;
	let titleBn = "";
	let titleEn = "";
	let bodyBn = "";
	let bodyEn = "";
	let type = "info";
	if (slotType === "sehri_reminder") {
		const mins = Math.max(1, (options === null || options === void 0 ? void 0 : options.minsLeft) || 10);
		type = "alert";
		titleBn = `সেহরির আর মাত্র ${toBengaliNumber(mins)} মিনিট বাকি — ${district.nameBn}`;
		titleEn = `Only ${mins} min left for Sehri — ${district.nameEn}`;
		bodyBn = `【${district.nameBn} জেলার সেহরি ও ইফতার সময়সূচী】\n• সেহরির শেষ সময়: ${prayerTimes.sehriEnd}\n• ফজর ওয়াক্ত শুরু: ${prayerTimes.fajr}\n• আজকের ইফতার (মাগরিব): ${prayerTimes.maghrib}\n\nআর মাত্র ${toBengaliNumber(mins)} মিনিট পর সেহরির সময় শেষ হবে। দ্রুত সেহরি সম্পন্ন করে রোজার নিয়ত করুন।`;
		bodyEn = `【${district.nameEn} Sehri & Iftar Schedule】\nSehri End: ${prayerTimes.sehriEnd} (${mins} min left) | Fajr: ${prayerTimes.fajr} | Iftar: ${prayerTimes.maghrib}`;
	} else if (slotType === "iftar_reminder") {
		const mins = Math.max(1, (options === null || options === void 0 ? void 0 : options.minsLeft) || 10);
		type = "alert";
		titleBn = `ইফতারের আর মাত্র ${toBengaliNumber(mins)} মিনিট বাকি — ${district.nameBn}`;
		titleEn = `Only ${mins} min left for Iftar — ${district.nameEn}`;
		bodyBn = `【${district.nameBn} জেলার ইফতার পূর্ব প্রস্তুতি বার্তা】\n• আজকের ইফতার (মাগরিব): ${prayerTimes.maghrib}\n• সূর্যাস্ত: ${prayerTimes.sunset}\n• সেহরির শেষ সময় ছিল: ${prayerTimes.sehriEnd}\n\nআর মাত্র ${toBengaliNumber(mins)} মিনিট পর ইফতারের সময় হবে। ইফতার সামনে নিয়ে বেশি বেশি দোয়া ও ইস্তিগফার করুন।`;
		bodyEn = `【${district.nameEn} Iftar Reminder】\nIftar is at ${prayerTimes.maghrib} (${mins} min left). Prepare for Iftar and make Dua.`;
	} else if (slotType === "iftar_time") {
		type = "alert";
		titleBn = `ইফতারের সময় হয়েছে (${prayerTimes.maghrib}) — ${district.nameBn}`;
		titleEn = `It's Iftar Time (${prayerTimes.maghrib}) — ${district.nameEn}`;
		bodyBn = `【${district.nameBn} জেলার ইফতার বার্তা】\n• ইফতার ও মাগরিব: ${prayerTimes.maghrib}\n• ইফতারের দোয়া: আল্লাহুম্মা লাকা সুমতু ওয়া আলা রিযকিকা আফতারতু।\n\nআল্লাহ আপনার আজকের রোজা ও ইবাদত কবুল করুন।`;
		bodyEn = `【${district.nameEn} Iftar Time】\nIftar & Maghrib starts at ${prayerTimes.maghrib}. May Allah accept your fast.`;
	} else {
		type = "info";
		titleBn = `আজকের সেহরি ও ইফতারের সময়সূচী — ${district.nameBn}`;
		titleEn = `Today's Sehri & Iftar Timetable — ${district.nameEn}`;
		bodyBn = `【${district.nameBn} (${district.divisionBn} বিভাগ) • ${hijri.formattedBn}】\n• সেহরির শেষ সময়: ${prayerTimes.sehriEnd}\n• ফজরের ওয়াক্ত শুরু: ${prayerTimes.fajr}\n• সূর্যোদয়: ${prayerTimes.sunrise}\n• আজকের ইফতার (মাগরিব): ${prayerTimes.maghrib}\n• রোজার ব্যাপ্তি: ${fastDurationBn}\n\nআপনার বর্তমান লোকেশন অনুযায়ী রিয়েল-টাইম সময়সূচী প্রদর্শিত হয়েছে।`;
		bodyEn = `【${district.nameEn} • ${hijri.formattedBn}】\nSehri End: ${prayerTimes.sehriEnd} | Fajr: ${prayerTimes.fajr} | Iftar: ${prayerTimes.maghrib}`;
	}
	const formattedDate = `${toBengaliNumber(now.getDate())} ${BENGALI_MONTHS[now.getMonth()]}`;
	const formattedTime = now.toLocaleTimeString("bn-BD", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
	return {
		id,
		titleBn,
		titleEn,
		bodyBn,
		bodyEn,
		messageBn: bodyBn,
		messageEn: bodyEn,
		date: formattedDate,
		timeBn: `${formattedDate}, ${toBengaliNumber(formattedTime)}`,
		timeEn: now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		}),
		type,
		isRead: false,
		districtBn: district.nameBn,
		districtEn: district.nameEn,
		isPrayerAlert: true,
		isFastingAlert: true,
		sehriIftarData: {
			districtBn: district.nameBn,
			districtEn: district.nameEn,
			divisionBn: district.divisionBn,
			dateStrBn,
			hijriDateBn: hijri.formattedBn,
			sehriEndBn: prayerTimes.sehriEnd,
			fajrBn: prayerTimes.fajr,
			sunriseBn: prayerTimes.sunrise,
			iftarBn: prayerTimes.maghrib,
			fastDurationBn,
			slotType,
			locationSource: locSource
		}
	};
}
/**
* Automatically generates today's location-specific Sehri & Iftar timetable notification
* for the user's own district (runs once per district per day).
*/
function checkAndGenerateDailySehriIftarNotification(district, currentNotifications, isEnabled = isFastingReminderEnabled(), timingsOverride) {
	if (!isEnabled) return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
	const now = /* @__PURE__ */ new Date();
	const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const dailyId = `fasting_daily_${(district.nameEn || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "_")}_${todayStr}`;
	const storageKey = `notif_fasting_daily_${dailyId}`;
	const alreadySent = safeStorage.getItem(storageKey);
	const existsInList = currentNotifications.some((n) => n.id === dailyId);
	if (alreadySent && existsInList) return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
	const prayerTimes = timingsOverride || calculateLocalPrayerTimes(district, now);
	const notifItem = buildSehriIftarScheduleNotification(district, prayerTimes, "daily_schedule", {
		idOverride: dailyId,
		now
	});
	try {
		safeStorage.setItem(storageKey, "1");
	} catch {}
	if (existsInList) return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
	if (!alreadySent && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") try {
		new Notification(notifItem.titleBn, {
			body: `সেহরি শেষ: ${prayerTimes.sehriEnd} · ইফতার: ${prayerTimes.maghrib} (${district.nameBn})`,
			tag: dailyId
		});
	} catch {}
	return {
		updatedNotifications: [notifItem, ...currentNotifications],
		newlyAdded: notifItem
	};
}
/**
* Checks if current time is in a Sehri or Iftar reminder window (30m before, 10m before, or exact Iftar time)
* OR generates the daily timetable notification, strictly tailored to the user's real district.
*/
function checkAndGenerateFastingReminders(district, currentNotifications, isEnabled = isFastingReminderEnabled(), timingsOverride) {
	if (!isEnabled) return {
		updatedNotifications: currentNotifications,
		newlyAdded: null
	};
	const now = /* @__PURE__ */ new Date();
	const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const citySlug = (district.nameEn || "dhaka").toLowerCase().replace(/[^a-z0-9]/g, "_");
	const prayerTimes = timingsOverride || calculateLocalPrayerTimes(district, now);
	const dailyResult = checkAndGenerateDailySehriIftarNotification(district, currentNotifications, isEnabled, prayerTimes);
	let workingList = dailyResult.updatedNotifications;
	let newest = dailyResult.newlyAdded;
	const THIRTY_MIN_MS = 18e5;
	const TEN_MIN_MS = 6e5;
	const sehriDiffMs = prayerTimes.raw.sehriEnd.getTime() - now.getTime();
	const iftarDiffMs = prayerTimes.raw.maghrib.getTime() - now.getTime();
	let slot = null;
	if (sehriDiffMs > 0 && sehriDiffMs <= TEN_MIN_MS) slot = {
		id: `fasting_sehri_10m_${citySlug}_${todayStr}`,
		slotType: "sehri_reminder",
		minsLeft: Math.max(1, Math.ceil(sehriDiffMs / 6e4))
	};
	else if (sehriDiffMs > TEN_MIN_MS && sehriDiffMs <= THIRTY_MIN_MS) slot = {
		id: `fasting_sehri_30m_${citySlug}_${todayStr}`,
		slotType: "sehri_reminder",
		minsLeft: Math.max(11, Math.ceil(sehriDiffMs / 6e4))
	};
	else if (iftarDiffMs > 0 && iftarDiffMs <= TEN_MIN_MS) slot = {
		id: `fasting_iftar_10m_${citySlug}_${todayStr}`,
		slotType: "iftar_reminder",
		minsLeft: Math.max(1, Math.ceil(iftarDiffMs / 6e4))
	};
	else if (iftarDiffMs > TEN_MIN_MS && iftarDiffMs <= THIRTY_MIN_MS) slot = {
		id: `fasting_iftar_30m_${citySlug}_${todayStr}`,
		slotType: "iftar_reminder",
		minsLeft: Math.max(11, Math.ceil(iftarDiffMs / 6e4))
	};
	else if (iftarDiffMs <= 0 && iftarDiffMs >= -3e5) slot = {
		id: `fasting_iftar_now_${citySlug}_${todayStr}`,
		slotType: "iftar_time"
	};
	if (slot) {
		const safeStorageKey = `notif_fasting_${slot.id}`;
		const alreadySent = safeStorage.getItem(safeStorageKey);
		const existsInList = workingList.some((n) => n.id === slot.id);
		if (!alreadySent && !existsInList) {
			const notifItem = buildSehriIftarScheduleNotification(district, prayerTimes, slot.slotType, {
				idOverride: slot.id,
				minsLeft: slot.minsLeft,
				now
			});
			try {
				safeStorage.setItem(safeStorageKey, "1");
			} catch {}
			if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") try {
				new Notification(notifItem.titleBn, {
					body: notifItem.bodyBn.replace(/\n+/g, " "),
					tag: slot.id
				});
			} catch {}
			workingList = [notifItem, ...workingList];
			newest = notifItem;
		}
	}
	return {
		updatedNotifications: workingList,
		newlyAdded: newest
	};
}
var BENGALI_MONTHS = [
	"জানুয়ারি",
	"ফেব্রুয়ারি",
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
];
var BENGALI_DAYS_SHORT = [
	"রবি",
	"সোম",
	"মঙ্গল",
	"বুধ",
	"বৃহঃ",
	"শুক্র",
	"শনি"
];
/**
* Calculates accurate month-long prayer calendar according to Islamic Foundation Bangladesh standards
*/
function getMonthlyPrayerCalendar(district, year, monthIndex) {
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const today = /* @__PURE__ */ new Date();
	const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
	const todayDate = today.getDate();
	const days = [];
	const daysBnFull = [
		"রবিবার",
		"সোমবার",
		"মঙ্গলবার",
		"বুধবার",
		"বৃহস্পতিবার",
		"শুক্রবার",
		"শনিবার"
	];
	for (let d = 1; d <= daysInMonth; d++) {
		const dateObj = new Date(year, monthIndex, d, 12, 0, 0);
		const timings = calculateLocalPrayerTimes(district, dateObj);
		const dayStr = d < 10 ? `0${d}` : `${d}`;
		const dateStrBn = `${toBengaliNumber(dayStr)} ${BENGALI_MONTHS[monthIndex]}`;
		const dayNameBn = daysBnFull[dateObj.getDay()];
		days.push({
			dayNumber: d,
			dateStrBn,
			dayNameBn,
			fajr: timings.fajr,
			sunrise: timings.sunrise,
			dhuhr: timings.dhuhr,
			asr: timings.asr,
			sunset: timings.sunset,
			maghrib: timings.maghrib,
			isha: timings.isha,
			isToday: isCurrentYearMonth && d === todayDate
		});
	}
	return days;
}
function formatTimeHMOnlyBn(date) {
	let h = date.getHours();
	const m = date.getMinutes();
	h = h % 12 || 12;
	const hFormatted = h < 10 ? `0${h}` : `${h}`;
	const mFormatted = m < 10 ? `0${m}` : `${m}`;
	return `${toBengaliNumber(hFormatted)}:${toBengaliNumber(mFormatted)}`;
}
function formatCountdownHMSBn(diffSec) {
	const safeSec = Math.max(0, Math.floor(diffSec));
	const h = Math.floor(safeSec / 3600);
	const m = Math.floor(safeSec % 3600 / 60);
	const s = safeSec % 60;
	const hStr = h < 10 ? `0${h}` : `${h}`;
	const mStr = m < 10 ? `0${m}` : `${m}`;
	const sStr = s < 10 ? `0${s}` : `${s}`;
	return `${toBengaliNumber(hStr)}:${toBengaliNumber(mStr)}:${toBengaliNumber(sStr)}`;
}
function getActivePrayerCardData(timings, now = /* @__PURE__ */ new Date()) {
	const raw = timings.raw;
	const nowMs = now.getTime();
	const fajrMs = raw.fajr.getTime();
	const sunriseMs = raw.sunrise.getTime();
	const dhuhrMs = raw.dhuhr.getTime();
	const asrMs = raw.asr.getTime();
	raw.sunset.getTime();
	const maghribMs = raw.maghrib.getTime();
	const ishaMs = raw.isha.getTime();
	const tomorrowFajr = new Date(raw.fajr);
	tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
	const tomorrowFajrMs = tomorrowFajr.getTime();
	const yesterdayIsha = new Date(raw.isha);
	yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
	const yesterdayIshaMs = yesterdayIsha.getTime();
	const sunriseEndMs = sunriseMs + 9e5;
	const zawalStartMs = dhuhrMs - 72e4;
	const zawalEndMs = dhuhrMs;
	const sunsetStartMs = maghribMs - 9e5;
	const t5 = {
		fajr: formatTimeHMOnlyBn(raw.fajr),
		dhuhr: formatTimeHMOnlyBn(raw.dhuhr),
		asr: formatTimeHMOnlyBn(raw.asr),
		maghrib: formatTimeHMOnlyBn(raw.maghrib),
		isha: formatTimeHMOnlyBn(raw.isha)
	};
	let activeKey = "dhuhr";
	let activeNameBn = "যুহর";
	let statusBadgeBn = "• এখন চলছে";
	let rangeBn = `${t5.dhuhr} - ${t5.asr}`;
	let nextNameBn = "আসর";
	let diffSec = 0;
	let countdownLabelBn = "শেষ হতে বাকি >";
	let progressPercent = 50;
	if (nowMs >= fajrMs && nowMs < sunriseMs) {
		activeKey = "fajr";
		activeNameBn = "ফজর";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${t5.fajr} - ${formatTimeHMOnlyBn(raw.sunrise)}`;
		nextNameBn = "সূর্যোদয় / নিষিদ্ধ সময়";
		diffSec = (sunriseMs - nowMs) / 1e3;
		countdownLabelBn = "ফজর শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - fajrMs) / (sunriseMs - fajrMs) * 100));
	} else if (nowMs >= sunriseMs && nowMs < sunriseEndMs) {
		activeKey = "forbidden";
		activeNameBn = "নামাজের নিষিদ্ধ সময়";
		statusBadgeBn = "• সূর্যোদয়ের নিষিদ্ধ সময়";
		rangeBn = `${formatTimeHMOnlyBn(raw.sunrise)} - ${formatTimeHMOnlyBn(new Date(sunriseEndMs))}`;
		nextNameBn = "যুহর";
		diffSec = (sunriseEndMs - nowMs) / 1e3;
		countdownLabelBn = "নিষিদ্ধ সময় শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - sunriseMs) / (sunriseEndMs - sunriseMs) * 100));
	} else if (nowMs >= sunriseEndMs && nowMs < zawalStartMs) {
		activeKey = "sunrise";
		activeNameBn = "ইশরাক ও চাশত (সকাল)";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${formatTimeHMOnlyBn(new Date(sunriseEndMs))} - ${t5.dhuhr}`;
		nextNameBn = "যুহর";
		diffSec = (dhuhrMs - nowMs) / 1e3;
		countdownLabelBn = "যুহর শুরু হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - sunriseEndMs) / (dhuhrMs - sunriseEndMs) * 100));
	} else if (nowMs >= zawalStartMs && nowMs < zawalEndMs) {
		activeKey = "forbidden";
		activeNameBn = "নামাজের নিষিদ্ধ সময়";
		statusBadgeBn = "• দ্বিপ্রহর (যাওয়াল) নিষিদ্ধ সময়";
		rangeBn = `${formatTimeHMOnlyBn(new Date(zawalStartMs))} - ${t5.dhuhr}`;
		nextNameBn = "যুহর";
		diffSec = (zawalEndMs - nowMs) / 1e3;
		countdownLabelBn = "নিষিদ্ধ সময় শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - zawalStartMs) / (zawalEndMs - zawalStartMs) * 100));
	} else if (nowMs >= dhuhrMs && nowMs < asrMs) {
		activeKey = "dhuhr";
		activeNameBn = "যুহর";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${t5.dhuhr} - ${t5.asr}`;
		nextNameBn = "আসর";
		diffSec = (asrMs - nowMs) / 1e3;
		countdownLabelBn = "যুহর শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - dhuhrMs) / (asrMs - dhuhrMs) * 100));
	} else if (nowMs >= asrMs && nowMs < sunsetStartMs) {
		activeKey = "asr";
		activeNameBn = "আসর";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${t5.asr} - ${t5.maghrib}`;
		nextNameBn = "সূর্যাস্তের নিষিদ্ধ সময়";
		diffSec = (sunsetStartMs - nowMs) / 1e3;
		countdownLabelBn = "আসর শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - asrMs) / (sunsetStartMs - asrMs) * 100));
	} else if (nowMs >= sunsetStartMs && nowMs < maghribMs) {
		activeKey = "forbidden";
		activeNameBn = "নামাজের নিষিদ্ধ সময়";
		statusBadgeBn = "• সূর্যাস্তের নিষিদ্ধ সময়";
		rangeBn = `${formatTimeHMOnlyBn(new Date(sunsetStartMs))} - ${t5.maghrib}`;
		nextNameBn = "মাগরিব";
		diffSec = (maghribMs - nowMs) / 1e3;
		countdownLabelBn = "নিষিদ্ধ সময় শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - sunsetStartMs) / (maghribMs - sunsetStartMs) * 100));
	} else if (nowMs >= maghribMs && nowMs < ishaMs) {
		activeKey = "maghrib";
		activeNameBn = "মাগরিব";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${t5.maghrib} - ${t5.isha}`;
		nextNameBn = "ইশা";
		diffSec = (ishaMs - nowMs) / 1e3;
		countdownLabelBn = "মাগরিব শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - maghribMs) / (ishaMs - maghribMs) * 100));
	} else if (nowMs >= ishaMs && nowMs < tomorrowFajrMs) {
		activeKey = "isha";
		activeNameBn = "ইশা";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${t5.isha} - ${formatTimeHMOnlyBn(tomorrowFajr)}`;
		nextNameBn = "ফজর";
		diffSec = (tomorrowFajrMs - nowMs) / 1e3;
		countdownLabelBn = "ইশা শেষ হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - ishaMs) / (tomorrowFajrMs - ishaMs) * 100));
	} else {
		activeKey = "fajr";
		activeNameBn = "তাহাজ্জুদ ও সাহরী";
		statusBadgeBn = "• এখন চলছে";
		rangeBn = `${formatTimeHMOnlyBn(raw.isha)} - ${t5.fajr}`;
		nextNameBn = "ফজর";
		diffSec = (fajrMs - nowMs) / 1e3;
		countdownLabelBn = "ফজর শুরু হতে বাকি >";
		progressPercent = Math.min(100, Math.max(0, (nowMs - yesterdayIshaMs) / (fajrMs - yesterdayIshaMs) * 100));
	}
	return {
		activeKey,
		activeNameBn,
		statusBadgeBn,
		rangeBn,
		nextNameBn,
		countdownTimeBn: formatCountdownHMSBn(diffSec),
		countdownLabelBn,
		progressPercent,
		times5: t5
	};
}
/**
* Generates year-round perpetual month-by-month Sehri & Iftar timetable for any Bangladesh district
*/
function getPerpetualFastingCalendar(district, year, monthIndex) {
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const today = /* @__PURE__ */ new Date();
	const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
	const todayDate = today.getDate();
	const days = [];
	for (let d = 1; d <= daysInMonth; d++) {
		const dateObj = new Date(year, monthIndex, d, 12, 0, 0);
		const timings = calculateLocalPrayerTimes(district, dateObj);
		const hijri = getHijriDate(dateObj);
		const dayStr = d < 10 ? `0${d}` : `${d}`;
		const dateStrBn = `${toBengaliNumber(dayStr)} ${BENGALI_MONTHS[monthIndex]}`;
		const dow = dateObj.getDay();
		const dayShortBn = BENGALI_DAYS_SHORT[dow];
		const diffMs = Math.max(0, timings.raw.maghrib.getTime() - timings.raw.sehriEnd.getTime());
		const totalMins = Math.round(diffMs / 6e4);
		const durH = Math.floor(totalMins / 60);
		const durM = totalMins % 60;
		const durationBn = `${toBengaliNumber(durH)} ঘঃ ${toBengaliNumber(durM)} মিঃ`;
		days.push({
			dayNumber: d,
			dateStrBn,
			dayShortBn,
			hijriShortBn: hijri.shortBn,
			hijriDay: hijri.day,
			hijriMonth: hijri.month,
			isRamadan: hijri.isRamadan,
			isAyyamAlBidh: hijri.day >= 13 && hijri.day <= 15,
			isSunnahWeekDay: dow === 1 || dow === 4,
			sehriEnd: timings.sehriEnd,
			fajr: timings.fajr,
			sunrise: timings.sunrise,
			iftar: timings.maghrib,
			durationBn,
			isToday: isCurrentYearMonth && d === todayDate
		});
	}
	return days;
}
/**
* Live countdown and daily Sehri/Iftar dashboard metrics for selected district
*/
function getActiveFastingCardData(timings, now = /* @__PURE__ */ new Date()) {
	const nowMs = now.getTime();
	const sehriMs = timings.raw.sehriEnd.getTime();
	const fajrMs = timings.raw.fajr.getTime();
	const iftarMs = timings.raw.maghrib.getTime();
	const tomorrowSehri = new Date(timings.raw.sehriEnd);
	tomorrowSehri.setDate(tomorrowSehri.getDate() + 1);
	const tomorrowSehriMs = tomorrowSehri.getTime();
	const yesterdayIftar = new Date(timings.raw.maghrib);
	yesterdayIftar.setDate(yesterdayIftar.getDate() - 1);
	const yesterdayIftarMs = yesterdayIftar.getTime();
	const hijri = getHijriDate(now);
	const daysToRamadan = getDaysUntilNextRamadan(now);
	const durMins = Math.max(0, Math.round((iftarMs - sehriMs) / 6e4));
	const durH = Math.floor(durMins / 60);
	const durM = durMins % 60;
	const fastDurationBn = `${toBengaliNumber(durH)} ঘণ্টা ${toBengaliNumber(durM)} মিনিট`;
	let phase = "fasting";
	let phaseTitleBn = "রোজার সময় চলছে";
	let phaseSubtitleBn = `সাহরী শেষ: ${timings.sehriEnd} · ইফতার: ${timings.maghrib}`;
	let diffSec = 0;
	let countdownLabelBn = "ইফতার হতে বাকি";
	let progressPercent = 50;
	if (nowMs < sehriMs) {
		phase = "sehri";
		phaseTitleBn = "সাহরীর সময় চলছে";
		phaseSubtitleBn = `ফজর শুরু: ${timings.fajr} · আজকের ইফতার: ${timings.maghrib}`;
		diffSec = (sehriMs - nowMs) / 1e3;
		countdownLabelBn = "সাহরী শেষ হতে বাকি";
		progressPercent = Math.min(100, Math.max(4, (nowMs - yesterdayIftarMs) / Math.max(1, sehriMs - yesterdayIftarMs) * 100));
	} else if (nowMs >= sehriMs && nowMs < iftarMs) {
		phase = "fasting";
		phaseTitleBn = nowMs < fajrMs ? "সতর্কতা বিরতি · ফজর আসন্ন" : "রোজার সময় চলছে";
		phaseSubtitleBn = `আজকের সাহরী: ${timings.sehriEnd} · ইফতার: ${timings.maghrib}`;
		diffSec = (iftarMs - nowMs) / 1e3;
		countdownLabelBn = "ইফতার হতে বাকি";
		progressPercent = Math.min(100, Math.max(4, (nowMs - sehriMs) / Math.max(1, iftarMs - sehriMs) * 100));
	} else {
		phase = "after_iftar";
		phaseTitleBn = "ইফতার সম্পন্ন হয়েছে";
		phaseSubtitleBn = `আজকের ইফতার: ${timings.maghrib} · পরবর্তী সাহরী প্রস্তুতি`;
		diffSec = (tomorrowSehriMs - nowMs) / 1e3;
		countdownLabelBn = "আগামী সাহরী শেষ হতে বাকি";
		progressPercent = Math.min(100, Math.max(4, (nowMs - iftarMs) / Math.max(1, tomorrowSehriMs - iftarMs) * 100));
	}
	const ramadanStatusBn = hijri.isRamadan ? `পবিত্র রমজান মাস · ${hijri.dayBn}তম রোজা` : `আসন্ন পবিত্র রমজান হতে প্রায় ${toBengaliNumber(daysToRamadan)} দিন বাকি`;
	return {
		phase,
		phaseTitleBn,
		phaseSubtitleBn,
		countdownTimeBn: formatCountdownHMSBn(diffSec),
		countdownLabelBn,
		progressPercent,
		sehriEndBn: timings.sehriEnd,
		fajrBn: timings.fajr,
		sunriseBn: timings.sunrise,
		iftarBn: timings.maghrib,
		fastDurationBn,
		hijriFormattedBn: hijri.formattedBn,
		ramadanStatusBn,
		isRamadanNow: hijri.isRamadan
	};
}
//#endregion
export { BENGALI_DAYS_SHORT, BENGALI_MONTHS, FASTING_REMINDER_STORAGE_KEY, buildSehriIftarScheduleNotification, calculateLocalPrayerTimes, checkAndGenerateDailySehriIftarNotification, checkAndGenerateFastingReminders, checkAndGeneratePrayerNotifications, fetchLivePrayerTimes, formatCountdownHMSBn, formatTimeHMOnlyBn, getActiveFastingCardData, getActivePrayerCardData, getMonthlyPrayerCalendar, getPerpetualFastingCalendar, isFastingReminderEnabled, getHijriDate as n, setFastingReminderEnabled, findRamadanMonthInYear as t };
