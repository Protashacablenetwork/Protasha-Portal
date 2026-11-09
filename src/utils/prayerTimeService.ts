import { DistrictInfo, detectPreciseLocation, ALL_BANGLADESH_DISTRICTS } from './weatherService';
import { toBengaliNumber } from './formatters';
import { NotificationItem } from '../types';

export interface PrayerTimings {
  dateStr: string;
  cityBn: string;
  cityEn: string;
  tahajjud: string;   // তাহাজ্জুদ ও সাহরীর শেষ সময়
  fajr: string;       // ফজর
  sunrise: string;    // সূর্যোদয়
  ishraq: string;     // ইশরাক
  chasht: string;     // চাশত / দুহা
  dhuhr: string;      // যোহর
  asr: string;        // আসর
  sunset: string;     // সূর্যাস্ত
  maghrib: string;    // মাগরিব
  awwabin: string;    // আউয়াবীন
  isha: string;       // ইশা
  nextPrayerNameBn: string;
  nextPrayerTimeBn: string;
  timeRemainingBn: string;
  raw: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    sunset: Date;
    maghrib: Date;
    isha: Date;
  };
}

// Convert 24h string e.g. "05:12" to 12h Bengali string e.g. "০৫:১২ AM" or "০৫:১২"
function format12hBn(timeStr24: string): string {
  if (!timeStr24) return '';
  const [hStr, mStr] = timeStr24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ? parseInt(mStr, 10) : 0;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hFormatted = h < 10 ? `0${h}` : `${h}`;
  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  return `${toBengaliNumber(hFormatted)}:${toBengaliNumber(mFormatted)} ${ampm}`;
}

/**
 * Astronomical formula approximation for Bangladesh Prayer Times (Karachi / ISNA method)
 */
// Helper to parse "HH:MM" string into a Date on a given base date
function parseTimeToDate(timeStr: string, baseDate: Date): Date {
  const d = new Date(baseDate);
  d.setSeconds(0, 0);
  if (!timeStr) return d;
  const cleanStr = timeStr.split(' ')[0];
  const [hStr, mStr] = cleanStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (!isNaN(h) && !isNaN(m)) {
    d.setHours(h, m, 0, 0);
  }
  return d;
}

/**
 * Astronomical formula approximation for Bangladesh Prayer Times (Karachi / ISNA method)
 */
export function calculateLocalPrayerTimes(district: DistrictInfo, date: Date = new Date()): PrayerTimings {
  const lat = district.lat;
  const lon = district.lon;

  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Approximate Solar Declination
  const declination = -23.44 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));

  // Equation of Time in minutes
  const b = (2 * Math.PI / 365) * (dayOfYear - 81);
  const eqTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Longitude correction for Bangladesh (UTC+6, meridian 90° E)
  const timeOffsetMin = (90 - lon) * 4 - eqTime;

  // Solar noon in UTC+6 minutes from midnight
  const solarNoonMin = 12 * 60 + timeOffsetMin;

  // Latitude and Declination in radians
  const latRad = (lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  // Helper for Hour Angle
  const hourAngle = (angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosHA = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    const clampedCos = Math.max(-1, Math.min(1, cosHA));
    return (Math.acos(clampedCos) * 180) / Math.PI;
  };

  // Standard angles for Karachi method
  const fajrHA = hourAngle(-18.0); // 18 deg below horizon
  const sunriseHA = hourAngle(-0.833); // Sunrise
  const sunsetHA = hourAngle(-0.833); // Sunset

  // Asr (Hanafi shadow factor = 2 for Bangladesh Islamic Foundation standard)
  const shadowFactor = 2; 
  const acotVal = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))));
  const asrAngleDeg = (acotVal * 180) / Math.PI;
  const asrHA = hourAngle(asrAngleDeg);

  const ishaHA = hourAngle(-18.0);

  // Minutes from midnight
  const fajrMin = solarNoonMin - (fajrHA * 4);
  const sunriseMin = solarNoonMin - (sunriseHA * 4);
  const dhuhrMin = solarNoonMin + 2; // 2 min safety margin after solar noon
  const asrMin = solarNoonMin + (asrHA * 4);
  const sunsetMin = solarNoonMin + (sunsetHA * 4);
  const maghribMin = sunsetMin + 3; // 3 min after sunset
  const ishaMin = solarNoonMin + (ishaHA * 4);

  const minToDate = (min: number) => {
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

  const formatMin = (min: number) => {
    const h = Math.floor(min / 60) % 24;
    const m = Math.floor(min % 60);
    const hStr = h < 10 ? `0${h}` : `${h}`;
    const mStr = m < 10 ? `0${m}` : `${m}`;
    return format12hBn(`${hStr}:${mStr}`);
  };

  // Determine Next Prayer & Remaining Time
  const now = date.getTime();
  let nextPrayerNameBn = 'ফজর';
  let nextPrayerTimeBn = formatMin(fajrMin);
  let nextPrayerDate = minToDate(fajrMin + 24 * 60); // tomorrow Fajr

  if (now < fajrDate.getTime()) {
    nextPrayerNameBn = 'ফজর';
    nextPrayerTimeBn = formatMin(fajrMin);
    nextPrayerDate = fajrDate;
  } else if (now < dhuhrDate.getTime()) {
    nextPrayerNameBn = 'যোহর';
    nextPrayerTimeBn = formatMin(dhuhrMin);
    nextPrayerDate = dhuhrDate;
  } else if (now < asrDate.getTime()) {
    nextPrayerNameBn = 'আসর';
    nextPrayerTimeBn = formatMin(asrMin);
    nextPrayerDate = asrDate;
  } else if (now < maghribDate.getTime()) {
    nextPrayerNameBn = 'মাগরিব';
    nextPrayerTimeBn = formatMin(maghribMin);
    nextPrayerDate = maghribDate;
  } else if (now < ishaDate.getTime()) {
    nextPrayerNameBn = 'ইশা';
    nextPrayerTimeBn = formatMin(ishaMin);
    nextPrayerDate = ishaDate;
  }

  const diffMs = Math.max(0, nextPrayerDate.getTime() - now);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let remainingStr = '';
  if (diffHours > 0) {
    remainingStr += `${toBengaliNumber(diffHours)} ঘণ্টা `;
  }
  remainingStr += `${toBengaliNumber(diffMins)} মিনিট বাকি`;

  const tahajjudMin = Math.max(0, fajrMin - 25);
  const ishraqMin = sunriseMin + 15;
  const chashtMin = sunriseMin + 120;
  const awwabinMin = maghribMin + 15;

  const dateStr = date.toISOString().split('T')[0];

  return {
    dateStr,
    cityBn: district.nameBn,
    cityEn: district.nameEn,
    tahajjud: formatMin(tahajjudMin),
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
export async function fetchLivePrayerTimes(district: DistrictInfo, date: Date = new Date()): Promise<PrayerTimings> {
  try {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${district.lat.toFixed(4)}&longitude=${district.lon.toFixed(4)}&method=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });

    if (res.ok) {
      const data = await res.json();
      const t = data.data?.timings;
      if (t) {
        const localCalc = calculateLocalPrayerTimes(district, date);

        const rawFajr = parseTimeToDate(t.Fajr, date);
        const rawSunrise = parseTimeToDate(t.Sunrise, date);
        const rawDhuhr = parseTimeToDate(t.Dhuhr, date);
        const rawAsr = parseTimeToDate(t.Asr, date);
        const rawSunset = parseTimeToDate(t.Sunset, date);
        const rawMaghrib = parseTimeToDate(t.Maghrib, date);
        const rawIsha = parseTimeToDate(t.Isha, date);

        return {
          ...localCalc,
          fajr: format12hBn(t.Fajr),
          sunrise: format12hBn(t.Sunrise),
          dhuhr: format12hBn(t.Dhuhr),
          asr: format12hBn(t.Asr),
          sunset: format12hBn(t.Sunset),
          maghrib: format12hBn(t.Maghrib),
          isha: format12hBn(t.Isha),
          raw: {
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
    console.warn('Aladhan Prayer Times API error, fallback to calculation:', e);
  }

  return calculateLocalPrayerTimes(district, date);
}

/**
 * Generate location-based automated prayer time & sunrise/sunset notifications
 */
export function checkAndGeneratePrayerNotifications(
  district: DistrictInfo,
  currentNotifications: NotificationItem[]
): { updatedNotifications: NotificationItem[]; newlyAdded: NotificationItem | null } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const totalMinutes = currentHour * 60 + currentMin;
  const todayStr = now.toISOString().split('T')[0];
  const citySlug = (district.nameEn || 'dhaka').toLowerCase().replace(/[^a-z0-9]/g, '_');

  const prayerTimes = calculateLocalPrayerTimes(district, now);

  let targetSlot: {
    id: string;
    titleBn: string;
    titleEn: string;
    bodyBn: string;
    bodyEn: string;
  } | null = null;

  // 1. Tahajjud & Sehri End (03:00 - 05:00)
  if (totalMinutes >= 3 * 60 && totalMinutes < 5 * 60) {
    targetSlot = {
      id: `prayer_tahajjud_${citySlug}_${todayStr}`,
      titleBn: `🌙 তাহাজ্জুদ ও সাহরীর শেষ সময়: ${district.nameBn}`,
      titleEn: `🌙 Tahajjud & Sehri Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} সাহরী ও তাহাজ্জুদ সময়সূচি】\n• সাহরীর শেষ সময়: ${prayerTimes.tahajjud}\n• ফজরের ওয়াক্ত শুরু: ${prayerTimes.fajr}\n• ফজরের জামাত: ${prayerTimes.fajr} এর পর\n\nতাহাজ্জুদ সালাত ও সাহরীর বরকতপূর্ণ সময়। আল্লাহ আপনার দিনটি শান্তিময় ও কল্যাণময় করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nSehri End: ${prayerTimes.tahajjud} | Fajr starts: ${prayerTimes.fajr}`
    };
  }
  // 2. Fajr Prayer (05:00 - 06:15)
  else if (totalMinutes >= 5 * 60 && totalMinutes < 6 * 60 + 15) {
    targetSlot = {
      id: `prayer_fajr_${citySlug}_${todayStr}`,
      titleBn: `🕌 ফজরের সালাতের ওয়াক্ত: ${district.nameBn}`,
      titleEn: `🕌 Fajr Prayer Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} ফজরের সময়সূচি】\n• ফজরের ওয়াক্ত: ${prayerTimes.fajr}\n• সূর্যোদয়: ${prayerTimes.sunrise}\n\n'আস-সালাতু খাইরুম মিনান নাওম' — ঘুমের চেয়ে সালাত উত্তম। জামাতের সাথে ফজরের সালাত আদায় করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nFajr: ${prayerTimes.fajr} | Sunrise: ${prayerTimes.sunrise}`
    };
  }
  // 3. Sunrise & Ishraq (06:15 - 08:30)
  else if (totalMinutes >= 6 * 60 + 15 && totalMinutes < 8 * 60 + 30) {
    targetSlot = {
      id: `prayer_sunrise_${citySlug}_${todayStr}`,
      titleBn: `🌅 সূর্যোদয় ও ইশরাক সালাত: ${district.nameBn}`,
      titleEn: `🌅 Sunrise & Ishraq Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} সূর্যোদয় বার্তা】\n• সূর্যোদয়ের সময়: ${prayerTimes.sunrise}\n• ইশরাকের ওয়াক্ত: ${prayerTimes.ishraq}\n• আজকের সূর্যাস্ত: ${prayerTimes.sunset}\n\nসূর্যোদয়ের ১৫ মিনিট পর ইশরাকের সালাত আদায় করে এক পূর্ণ হজ ও ওমরার সওয়াব অর্জন করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nSunrise: ${prayerTimes.sunrise} | Ishraq: ${prayerTimes.ishraq} | Sunset: ${prayerTimes.sunset}`
    };
  }
  // 4. Chasht / Dhuha (08:30 - 11:45)
  else if (totalMinutes >= 8 * 60 + 30 && totalMinutes < 11 * 60 + 45) {
    targetSlot = {
      id: `prayer_chasht_${citySlug}_${todayStr}`,
      titleBn: `☀️ চাশত (দুহা) সালাত বার্তা: ${district.nameBn}`,
      titleEn: `☀️ Chasht / Dhuha Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} চাশতের সময়সূচি】\n• চাশত (দুহা) ওয়াক্ত: ${prayerTimes.chasht} থেকে যোহরের পূর্ব পর্যন্ত\n• যোহরের সম্ভাব্য সময়: ${prayerTimes.dhuhr}\n\nচাশতের সালাত শরীরের ৩৬০টি অঙ্গ-প্রত্যঙ্গের সদকা স্বরূপ। ব্যবসায় ও উপার্জনে বরকতের জন্য দোয়া করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nChasht / Dhuha: ${prayerTimes.chasht} | Dhuhr: ${prayerTimes.dhuhr}`
    };
  }
  // 5. Dhuhr Prayer (11:45 - 15:00)
  else if (totalMinutes >= 11 * 60 + 45 && totalMinutes < 15 * 60) {
    targetSlot = {
      id: `prayer_dhuhr_${citySlug}_${todayStr}`,
      titleBn: `🕌 যোহরের সালাতের ওয়াক্ত: ${district.nameBn}`,
      titleEn: `🕌 Dhuhr Prayer Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} যোহরের সময়সূচি】\n• যোহরের ওয়াক্ত: ${prayerTimes.dhuhr}\n• আসরের সম্ভাব্য সময়: ${prayerTimes.asr}\n\nদুপুরের কর্মব্যস্ততার মাঝে যোহরের সালাত জামাতে আদায় করুন। সালাতে রয়েছে অফুরন্ত শান্তি ও রিজিকের বরকত।`,
      bodyEn: `【${district.nameEn} Schedule】\nDhuhr: ${prayerTimes.dhuhr} | Asr: ${prayerTimes.asr}`
    };
  }
  // 6. Asr Prayer (15:00 - 17:15)
  else if (totalMinutes >= 15 * 60 && totalMinutes < 17 * 60 + 15) {
    targetSlot = {
      id: `prayer_asr_${citySlug}_${todayStr}`,
      titleBn: `🕌 আসরের সালাতের ওয়াক্ত: ${district.nameBn}`,
      titleEn: `🕌 Asr Prayer Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} আসরের সময়সূচি】\n• আসরের ওয়াক্ত: ${prayerTimes.asr}\n• সূর্যাস্ত: ${prayerTimes.sunset}\n\nআসরের সালাত (সালাতুল উস্তা) হেফাজত করুন। সূর্যাস্তের পূর্বে সময়মতো আসরের সালাত আদায় নিশ্চিত করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nAsr: ${prayerTimes.asr} | Sunset: ${prayerTimes.sunset}`
    };
  }
  // 7. Sunset & Maghrib (17:15 - 18:45)
  else if (totalMinutes >= 17 * 60 + 15 && totalMinutes < 18 * 60 + 45) {
    targetSlot = {
      id: `prayer_sunset_${citySlug}_${todayStr}`,
      titleBn: `🌇 সূর্যাস্ত ও মাগরিব সালাত: ${district.nameBn}`,
      titleEn: `🌇 Sunset & Maghrib Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} সূর্যাস্ত ও মাগরিব】\n• আজকের সূর্যাস্ত: ${prayerTimes.sunset}\n• মাগরিবের ওয়াক্ত: ${prayerTimes.maghrib}\n• ইশার সময়: ${prayerTimes.isha}\n\nসূর্যাস্তের মুহূর্ত দোয়া কবুলের শ্রেষ্ঠ সময়। বিলম্ব না করে অবিলম্বে মাগরিবের সালাত আদায় করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nSunset: ${prayerTimes.sunset} | Maghrib: ${prayerTimes.maghrib} | Isha: ${prayerTimes.isha}`
    };
  }
  // 8. Awwabin Prayer (18:45 - 19:45)
  else if (totalMinutes >= 18 * 60 + 45 && totalMinutes < 19 * 60 + 45) {
    targetSlot = {
      id: `prayer_awwabin_${citySlug}_${todayStr}`,
      titleBn: `🌙 আউয়াবীন সালাতের বার্তা: ${district.nameBn}`,
      titleEn: `🌙 Awwabin Prayer Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} আউয়াবীন ওয়াক্ত】\n• আউয়াবীন সালাত: ${prayerTimes.awwabin} (মাগরিবের পর ৬ রাকাত নফল)\n• ইশার সম্ভাব্য সময়: ${prayerTimes.isha}\n\nহাদিস শরীফে আউয়াবীন সালাতের বিশেষ মর্যাদা ও গুনাহ মাফের সুসংবাদ রয়েছে।`,
      bodyEn: `【${district.nameEn} Schedule】\nAwwabin: ${prayerTimes.awwabin} | Isha: ${prayerTimes.isha}`
    };
  }
  // 9. Isha & Witr (19:45 - 23:59 or 00:00 - 03:00)
  else {
    targetSlot = {
      id: `prayer_isha_${citySlug}_${todayStr}`,
      titleBn: `🕌 ইশা ও বিতর সালাতের ওয়াক্ত: ${district.nameBn}`,
      titleEn: `🕌 Isha & Witr Prayer Alert: ${district.nameEn}`,
      bodyBn: `【${district.nameBn} ইশার সময়সূচি】\n• ইশার ওয়াক্ত: ${prayerTimes.isha}\n• বিতর সালাতের সময়: ইশার পর ঘুমানোর পূর্বে\n\nদিনের শেষ ফরজ সালাত ইশা জামাতে আদায় করে শান্তিময় ঘুমে যান। আল্লাহ আপনার রাত বরকতময় করুন।`,
      bodyEn: `【${district.nameEn} Schedule】\nIsha: ${prayerTimes.isha}`
    };
  }

  if (!targetSlot) {
    return { updatedNotifications: currentNotifications, newlyAdded: null };
  }

  const localStorageKey = `notif_prayer_${targetSlot.id}`;
  const alreadySent = localStorage.getItem(localStorageKey);
  const existsInList = currentNotifications.some(n => n.id === targetSlot!.id);

  if (!alreadySent && !existsInList) {
    const formattedDate = `${toBengaliNumber(now.getDate())} ${now.toLocaleString('bn-BD', { month: 'short' })}`;
    const formattedTime = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });

    const notifItem: NotificationItem = {
      id: targetSlot.id,
      titleBn: targetSlot.titleBn,
      titleEn: targetSlot.titleEn,
      bodyBn: targetSlot.bodyBn,
      bodyEn: targetSlot.bodyEn,
      messageBn: targetSlot.bodyBn,
      messageEn: targetSlot.bodyEn,
      date: formattedDate,
      timeBn: `${formattedDate}, ${toBengaliNumber(formattedTime)}`,
      timeEn: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      type: 'info',
      isRead: false,
      districtBn: district.nameBn,
      districtEn: district.nameEn,
      isPrayerAlert: true
    };

    try {
      localStorage.setItem(localStorageKey, '1');
    } catch {}

    return {
      updatedNotifications: [notifItem, ...currentNotifications],
      newlyAdded: notifItem
    };
  }

  return { updatedNotifications: currentNotifications, newlyAdded: null };
}

export const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export const BENGALI_DAYS_SHORT = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export interface MonthlyPrayerDay {
  dayNumber: number;
  dateStrBn: string; // e.g. "০১ নভেম্বর"
  dayNameBn: string; // e.g. "রবিবার"
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  isToday: boolean;
}

/**
 * Calculates accurate month-long prayer calendar according to Islamic Foundation Bangladesh standards
 */
export function getMonthlyPrayerCalendar(
  district: DistrictInfo,
  year: number,
  monthIndex: number // 0-indexed (0 = Jan, 10 = Nov)
): MonthlyPrayerDay[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const todayDate = today.getDate();

  const days: MonthlyPrayerDay[] = [];
  const daysBnFull = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

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

export interface ActivePrayerCardData {
  activeKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'sunrise' | 'forbidden';
  activeNameBn: string;
  statusBadgeBn: string;
  rangeBn: string;
  nextNameBn: string;
  countdownTimeBn: string;
  countdownLabelBn: string;
  progressPercent: number;
  times5: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export function formatTimeHMOnlyBn(date: Date): string {
  let h = date.getHours();
  const m = date.getMinutes();
  h = h % 12 || 12;
  const hFormatted = h < 10 ? `0${h}` : `${h}`;
  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  return `${toBengaliNumber(hFormatted)}:${toBengaliNumber(mFormatted)}`;
}

export function formatCountdownHMSBn(diffSec: number): string {
  const safeSec = Math.max(0, Math.floor(diffSec));
  const h = Math.floor(safeSec / 3600);
  const m = Math.floor((safeSec % 3600) / 60);
  const s = safeSec % 60;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const sStr = s < 10 ? `0${s}` : `${s}`;
  return `${toBengaliNumber(hStr)}:${toBengaliNumber(mStr)}:${toBengaliNumber(sStr)}`;
}

export function getActivePrayerCardData(timings: PrayerTimings, now: Date = new Date()): ActivePrayerCardData {
  const raw = timings.raw;
  const nowMs = now.getTime();

  const fajrMs = raw.fajr.getTime();
  const sunriseMs = raw.sunrise.getTime();
  const dhuhrMs = raw.dhuhr.getTime();
  const asrMs = raw.asr.getTime();
  const sunsetMs = raw.sunset.getTime();
  const maghribMs = raw.maghrib.getTime();
  const ishaMs = raw.isha.getTime();

  const tomorrowFajr = new Date(raw.fajr);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  const tomorrowFajrMs = tomorrowFajr.getTime();

  const yesterdayIsha = new Date(raw.isha);
  yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
  const yesterdayIshaMs = yesterdayIsha.getTime();

  // Forbidden Times (Makruh / Makrooh prayer times):
  // 1. Sunrise forbidden time: Sunrise to Sunrise + 15 mins
  const sunriseEndMs = sunriseMs + 15 * 60 * 1000;
  // 2. Zenith / Zawal forbidden time: Exactly solar noon (approx dhuhrMs - 10 mins to dhuhrMs)
  const zawalStartMs = dhuhrMs - 12 * 60 * 1000;
  const zawalEndMs = dhuhrMs;
  // 3. Sunset forbidden time: Sunset (or maghribMs - 15 mins) to Maghrib
  const sunsetStartMs = maghribMs - 15 * 60 * 1000;

  const t5 = {
    fajr: formatTimeHMOnlyBn(raw.fajr),
    dhuhr: formatTimeHMOnlyBn(raw.dhuhr),
    asr: formatTimeHMOnlyBn(raw.asr),
    maghrib: formatTimeHMOnlyBn(raw.maghrib),
    isha: formatTimeHMOnlyBn(raw.isha)
  };

  let activeKey: ActivePrayerCardData['activeKey'] = 'dhuhr';
  let activeNameBn = 'যুহর';
  let statusBadgeBn = '• এখন চলছে';
  let rangeBn = `${t5.dhuhr} - ${t5.asr}`;
  let nextNameBn = 'আসর';
  let diffSec = 0;
  let countdownLabelBn = 'শেষ হতে বাকি >';
  let progressPercent = 50;

  if (nowMs >= fajrMs && nowMs < sunriseMs) {
    activeKey = 'fajr';
    activeNameBn = 'ফজর';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${t5.fajr} - ${formatTimeHMOnlyBn(raw.sunrise)}`;
    nextNameBn = 'সূর্যোদয় / নিষিদ্ধ সময়';
    diffSec = (sunriseMs - nowMs) / 1000;
    countdownLabelBn = 'ফজর শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - fajrMs) / (sunriseMs - fajrMs)) * 100));
  } else if (nowMs >= sunriseMs && nowMs < sunriseEndMs) {
    activeKey = 'forbidden';
    activeNameBn = 'নামাজের নিষিদ্ধ সময়';
    statusBadgeBn = '• সূর্যোদয়ের নিষিদ্ধ সময়';
    rangeBn = `${formatTimeHMOnlyBn(raw.sunrise)} - ${formatTimeHMOnlyBn(new Date(sunriseEndMs))}`;
    nextNameBn = 'যুহর';
    diffSec = (sunriseEndMs - nowMs) / 1000;
    countdownLabelBn = 'নিষিদ্ধ সময় শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - sunriseMs) / (sunriseEndMs - sunriseMs)) * 100));
  } else if (nowMs >= sunriseEndMs && nowMs < zawalStartMs) {
    activeKey = 'sunrise';
    activeNameBn = 'ইশরাক ও চাশত (সকাল)';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${formatTimeHMOnlyBn(new Date(sunriseEndMs))} - ${t5.dhuhr}`;
    nextNameBn = 'যুহর';
    diffSec = (dhuhrMs - nowMs) / 1000;
    countdownLabelBn = 'যুহর শুরু হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - sunriseEndMs) / (dhuhrMs - sunriseEndMs)) * 100));
  } else if (nowMs >= zawalStartMs && nowMs < zawalEndMs) {
    activeKey = 'forbidden';
    activeNameBn = 'নামাজের নিষিদ্ধ সময়';
    statusBadgeBn = '• দ্বিপ্রহর (যাওয়াল) নিষিদ্ধ সময়';
    rangeBn = `${formatTimeHMOnlyBn(new Date(zawalStartMs))} - ${t5.dhuhr}`;
    nextNameBn = 'যুহর';
    diffSec = (zawalEndMs - nowMs) / 1000;
    countdownLabelBn = 'নিষিদ্ধ সময় শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - zawalStartMs) / (zawalEndMs - zawalStartMs)) * 100));
  } else if (nowMs >= dhuhrMs && nowMs < asrMs) {
    activeKey = 'dhuhr';
    activeNameBn = 'যুহর';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${t5.dhuhr} - ${t5.asr}`;
    nextNameBn = 'আসর';
    diffSec = (asrMs - nowMs) / 1000;
    countdownLabelBn = 'যুহর শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - dhuhrMs) / (asrMs - dhuhrMs)) * 100));
  } else if (nowMs >= asrMs && nowMs < sunsetStartMs) {
    activeKey = 'asr';
    activeNameBn = 'আসর';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${t5.asr} - ${t5.maghrib}`;
    nextNameBn = 'সূর্যাস্তের নিষিদ্ধ সময়';
    diffSec = (sunsetStartMs - nowMs) / 1000;
    countdownLabelBn = 'আসর শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - asrMs) / (sunsetStartMs - asrMs)) * 100));
  } else if (nowMs >= sunsetStartMs && nowMs < maghribMs) {
    activeKey = 'forbidden';
    activeNameBn = 'নামাজের নিষিদ্ধ সময়';
    statusBadgeBn = '• সূর্যাস্তের নিষিদ্ধ সময়';
    rangeBn = `${formatTimeHMOnlyBn(new Date(sunsetStartMs))} - ${t5.maghrib}`;
    nextNameBn = 'মাগরিব';
    diffSec = (maghribMs - nowMs) / 1000;
    countdownLabelBn = 'নিষিদ্ধ সময় শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - sunsetStartMs) / (maghribMs - sunsetStartMs)) * 100));
  } else if (nowMs >= maghribMs && nowMs < ishaMs) {
    activeKey = 'maghrib';
    activeNameBn = 'মাগরিব';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${t5.maghrib} - ${t5.isha}`;
    nextNameBn = 'ইশা';
    diffSec = (ishaMs - nowMs) / 1000;
    countdownLabelBn = 'মাগরিব শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - maghribMs) / (ishaMs - maghribMs)) * 100));
  } else if (nowMs >= ishaMs && nowMs < tomorrowFajrMs) {
    activeKey = 'isha';
    activeNameBn = 'ইশা';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${t5.isha} - ${formatTimeHMOnlyBn(tomorrowFajr)}`;
    nextNameBn = 'ফজর';
    diffSec = (tomorrowFajrMs - nowMs) / 1000;
    countdownLabelBn = 'ইশা শেষ হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - ishaMs) / (tomorrowFajrMs - ishaMs)) * 100));
  } else {
    // Before Fajr (e.g. 12:00 AM to Fajr)
    activeKey = 'fajr';
    activeNameBn = 'তাহাজ্জুদ ও সাহরী';
    statusBadgeBn = '• এখন চলছে';
    rangeBn = `${formatTimeHMOnlyBn(raw.isha)} - ${t5.fajr}`;
    nextNameBn = 'ফজর';
    diffSec = (fajrMs - nowMs) / 1000;
    countdownLabelBn = 'ফজর শুরু হতে বাকি >';
    progressPercent = Math.min(100, Math.max(0, ((nowMs - yesterdayIshaMs) / (fajrMs - yesterdayIshaMs)) * 100));
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


