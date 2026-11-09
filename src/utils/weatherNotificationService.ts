import { NotificationItem, Language } from '../types';
import { WeatherData } from './weatherService';
import { toBengaliNumber } from './formatters';

/**
 * 6 Time slots for daily scheduled weather broadcasts
 */
export interface WeatherSlotConfig {
  id: 'late_night' | 'morning_dawn' | 'mid_morning' | 'noon' | 'afternoon' | 'evening' | 'night';
  startHour: number;
  endHour: number;
  nameBn: string;
  nameEn: string;
  badgeBn: string;
  badgeEn: string;
}

export const WEATHER_DAILY_SLOTS: WeatherSlotConfig[] = [
  {
    id: 'late_night',
    startHour: 0,
    endHour: 5,
    nameBn: 'রাতের আবহাওয়া ও শেষরাতের বুলেটিন',
    nameEn: 'Late Night Weather Bulletin',
    badgeBn: 'রাতের বার্তা',
    badgeEn: 'Night'
  },
  {
    id: 'morning_dawn',
    startHour: 5,
    endHour: 8,
    nameBn: 'ভোরের আবহাওয়া বার্তা',
    nameEn: 'Dawn Weather Bulletin',
    badgeBn: 'সকাল বার্তা',
    badgeEn: 'Morning'
  },
  {
    id: 'mid_morning',
    startHour: 8,
    endHour: 12,
    nameBn: 'সকালের আবহাওয়া আপডেট',
    nameEn: 'Mid-Morning Weather Update',
    badgeBn: 'সকাল আপডেট',
    badgeEn: 'Update'
  },
  {
    id: 'noon',
    startHour: 12,
    endHour: 15,
    nameBn: 'দুপুরের আবহাওয়া ও তাপদাহ বুলেটিন',
    nameEn: 'Noon Weather & Heat Bulletin',
    badgeBn: 'দুপুর বুলেটিন',
    badgeEn: 'Noon'
  },
  {
    id: 'afternoon',
    startHour: 15,
    endHour: 18,
    nameBn: 'বিকালের আবহাওয়া আপডেট',
    nameEn: 'Afternoon Weather Update',
    badgeBn: 'বিকাল বুলেটিন',
    badgeEn: 'Afternoon'
  },
  {
    id: 'evening',
    startHour: 18,
    endHour: 21,
    nameBn: 'সন্ধ্যার আবহাওয়া বুলেটিন',
    nameEn: 'Evening Weather Bulletin',
    badgeBn: 'সন্ধ্যা বুলেটিন',
    badgeEn: 'Evening'
  },
  {
    id: 'night',
    startHour: 21,
    endHour: 24,
    nameBn: 'রাতের আবহাওয়া ও আগামীকালের পূর্বাভাস',
    nameEn: 'Night Weather & Tomorrow Preview',
    badgeBn: 'রাতের বার্তা',
    badgeEn: 'Night'
  }
];

export function getCurrentSlot(hour: number): WeatherSlotConfig {
  const slot = WEATHER_DAILY_SLOTS.find(s => hour >= s.startHour && hour < s.endHour);
  return slot || WEATHER_DAILY_SLOTS[0];
}

/**
 * Generate beautifully formatted Bengali weather notifications
 */
export function buildWeatherNotification(
  weather: WeatherData,
  slot: WeatherSlotConfig,
  isAlert = false,
  isGlobal = false
): NotificationItem {
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateFormatted = `${toBengaliNumber(now.getDate())} ${now.toLocaleString('bn-BD', { month: 'short' })}`;

  const tempBn = `${toBengaliNumber(weather.currentTemp)}°C`;
  const highBn = `${toBengaliNumber(weather.daily[0]?.tempMax ?? weather.currentTemp + 3)}°C`;
  const lowBn = `${toBengaliNumber(weather.daily[0]?.tempMin ?? weather.currentTemp - 4)}°C`;
  const humidityBn = `${toBengaliNumber(weather.humidity)}%`;
  const windBn = `${toBengaliNumber(weather.windSpeed)} কিমি/ঘণ্টা`;
  const rainProbBn = `${toBengaliNumber(weather.rainProbability)}%`;

  if (isAlert) {
    const isThunder = weather.conditionType === 'thunder';
    const alertBodyBn = `【ব্রডব্যান্ড ও ওয়াই-ফাই ইন্টারনেট জরুরি সতর্কতা】
• এলাকা: ${weather.cityBn} (${weather.conditionBn})
• তাপমাত্রা: ${tempBn} | বাতাস: ${windBn} | বৃষ্টির সম্ভাবনা: ${rainProbBn}

দুর্যোগকালীন সতর্কতা নির্দেশিকা:
১. বজ্রপাত ও তীব্র ঝড়ের সময় আপনার ওয়াই-ফাই রাউটার ও ONU-এর পাওয়ার এডাপ্টার বিদ্যুৎ সকেট থেকে নিরাপদে খুলে রাখুন।
২. প্রাকৃতিক দুর্যোগে ওভারহেড অপটিক্যাল ফাইবার নেটওয়ার্ক সচল ও সুরক্ষিত রাখতে আমাদের কারিগরি টিম সতর্ক রয়েছে।
৩. ঝড় থেমে যাওয়ার পর সংযোগ সংক্রান্ত যেকোনো প্রয়োজনে আমাদের ২৪/৭ হেল্পলাইনে যোগাযোগ করুন।`;

    const alertBodyEn = `【Broadband & Wi-Fi Internet Severe Weather Alert】
Location: ${weather.cityEn} (${weather.conditionEn}) | Temp: ${weather.currentTemp}°C | Wind: ${weather.windSpeed} km/h | Rain Probability: ${weather.rainProbability}%.
Safety Guidelines:
1. Disconnect Wi-Fi router & ONU power cords during thunder & storms to prevent lightning damage.
2. Our optical fiber response team is on standby to keep connectivity resilient.
3. Contact 24/7 helpline for emergency broadband support.`;

    return {
      id: `weather-alert-${Date.now()}`,
      titleBn: isThunder 
        ? `⚡ ব্রডব্যান্ড ও ওয়াই-ফাই সতর্কতা: ${weather.cityBn}-তে বজ্রঝড়ের সম্ভাবনা!`
        : `🌧️ ব্রডব্যান্ড ও ওয়াই-ফাই সতর্কতা: ${weather.cityBn}-তে ঝড়-বৃষ্টি ও দুর্যোগের পূর্বাভাস!`,
      titleEn: isThunder 
        ? `⚡ Broadband & Wi-Fi Alert: Thunderstorm expected in ${weather.cityEn}!`
        : `🌧️ Broadband & Wi-Fi Alert: Severe storm & rain expected in ${weather.cityEn}!`,
      bodyBn: alertBodyBn,
      bodyEn: alertBodyEn,
      messageBn: alertBodyBn,
      messageEn: alertBodyEn,
      date: dateFormatted,
      timeBn: `${dateFormatted}, ${toBengaliNumber(timeFormatted)}`,
      timeEn: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      type: 'alert',
      isRead: false,
      districtBn: isGlobal ? undefined : weather.cityBn,
      districtEn: isGlobal ? undefined : weather.cityEn,
      isWeatherAlert: true,
      isGlobal: isGlobal
    };
  }

  // Regular scheduled daily broadcast
  const isNightSlot = slot.id === 'late_night' || slot.id === 'night' || slot.id === 'evening' || !weather.isDay;
  const slotIcon = isNightSlot ? '🌙' : '🌤️';

  let adviceBn = '';

  const isSevereStorm = weather.conditionType === 'thunder' || (weather.conditionType === 'rain' && weather.rainProbability >= 70) || weather.windSpeed >= 30;
  const isRainy = weather.conditionType === 'rain';
  const isWindy = weather.windSpeed >= 20;
  const isExtremeHeat = weather.currentTemp >= 34;
  const isCloudy = weather.conditionType === 'cloud';

  if (weather.conditionType === 'thunder') {
    adviceBn = 'সতর্কবার্তা: বজ্রপাতের সম্ভাবনা থাকলে লাইন মেরামতের কাজ সাময়িকভাবে বন্ধ রাখুন।';
  } else if (isSevereStorm) {
    adviceBn = 'সতর্কবার্তা: ভারী বৃষ্টি ও ঝড়ের সময় জরুরি প্রয়োজন ছাড়া বাইরে লাইন মেরামত করবেন না।';
  } else if (isRainy) {
    adviceBn = 'সতর্কতা: বৃষ্টি বা ঝড়ের সময় লাইন মেরামতের কাজ এড়িয়ে চলুন।';
  } else if (isWindy) {
    adviceBn = 'সতর্কতা: তীব্র বাতাসের সময় খুঁটি বা উঁচু স্থানে কাজ করার ক্ষেত্রে অতিরিক্ত সতর্ক থাকুন।';
  } else if (isExtremeHeat) {
    adviceBn = 'পরামর্শ: কর্মীদের নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দিয়ে আবহাওয়া অনুযায়ী কাজের সময় নির্ধারণ করুন।';
  } else if (isCloudy) {
    adviceBn = 'পরামর্শ: প্রতিকূল আবহাওয়ায় কাজ করার সময় প্রয়োজনীয় নিরাপত্তা ব্যবস্থা নিশ্চিত করুন।';
  } else if (isNightSlot) {
    adviceBn = 'পরামর্শ: কাজ শুরু করার আগে আবহাওয়ার পূর্বাভাস দেখে পরিকল্পনা করুন।';
  } else {
    // 5 variants for good weather advice provided by the user
    const goodWeatherAdvices = [
      'পরামর্শ: আবহাওয়া অনুকূলে থাকায় প্রয়োজনীয় লাইন মেরামত ও রক্ষণাবেক্ষণের কাজ সম্পন্ন করুন।',
      'সুসংবাদ: আজকের আবহাওয়া ভালো। নিরাপদভাবে পরিকল্পিত লাইন মেরামতের কাজ করতে পারেন।',
      'পরামর্শ: অনুকূল আবহাওয়ার সুযোগ নিয়ে প্রয়োজনীয় সংযোগ ও মেরামতের কাজ সম্পন্ন করুন।',
      'বার্তা: আবহাওয়া ভালো থাকায় মাঠপর্যায়ের লাইন রক্ষণাবেক্ষণ কাজের জন্য উপযুক্ত সময়।',
      'পরামর্শ: সুন্দর আবহাওয়ায় নিরাপত্তা নিশ্চিত করে লাইন মেরামত ও সংযোগের কাজ এগিয়ে নিন।'
    ];
    
    // Pick based on slot ID to ensure variety throughout the day
    const slotMap: Record<string, number> = {
      'morning_dawn': 0,
      'mid_morning': 1,
      'noon': 2,
      'afternoon': 3,
      'evening': 4,
      'night': 0,
      'late_night': 1
    };
    const adviceIndex = slotMap[slot.id] ?? 0;
    adviceBn = goodWeatherAdvices[adviceIndex];
  }

  const broadcastBodyBn = `【${weather.cityBn} আবহাওয়া বুলেটিন】\n• আকাশ: ${weather.conditionBn}\n• বর্তমান তাপমাত্রা: ${tempBn} (সর্বোচ্চ: ${highBn} / সর্বনিম্ন: ${lowBn})\n• বাতাসের বেগ: ${windBn} | আর্দ্রতা: ${humidityBn}\n• বৃষ্টির সম্ভাবনা: ${rainProbBn}\n\nপরামর্শ: ${adviceBn}`;
  const broadcastBodyEn = `【${weather.cityEn} Weather Bulletin】\nCondition: ${weather.conditionEn} | Temp: ${weather.currentTemp}°C (H: ${weather.daily[0]?.tempMax}°C / L: ${weather.daily[0]?.tempMin}°C) | Wind: ${weather.windSpeed} km/h | Humidity: ${weather.humidity}%.`;

  return {
    id: `weather-slot-${slot.id}-${now.toISOString().split('T')[0]}`,
    titleBn: `${slotIcon} ${slot.nameBn}: ${weather.cityBn} (${tempBn})`,
    titleEn: `${slotIcon} ${slot.nameEn}: ${weather.cityEn} (${weather.currentTemp}°C)`,
    bodyBn: broadcastBodyBn,
    bodyEn: broadcastBodyEn,
    messageBn: broadcastBodyBn,
    messageEn: broadcastBodyEn,
    date: dateFormatted,
    timeBn: `${dateFormatted}, ${toBengaliNumber(timeFormatted)}`,
    timeEn: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    type: 'weather',
    isRead: false,
    districtBn: isGlobal ? undefined : weather.cityBn,
    districtEn: isGlobal ? undefined : weather.cityEn,
    isWeatherAlert: true,
    isGlobal: isGlobal
  };
}

/**
 * Check and generate automated daily weather notifications without spamming
 */
export function checkAndGenerateWeatherNotifications(
  weather: WeatherData,
  currentNotifications: NotificationItem[]
): { updatedNotifications: NotificationItem[]; newlyAdded: NotificationItem | null } {
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().split('T')[0];
  const slot = getCurrentSlot(currentHour);
  const citySlug = (weather.cityEn || 'dhaka').toLowerCase().replace(/[^a-z0-9]/g, '_');

  const slotKey = `notif_slot_${slot.id}_${citySlug}_${todayStr}`;
  const alertKey = `notif_alert_${citySlug}_${todayStr}_${Math.floor(currentHour / 3)}`; // max 1 alert per 3 hours per city

  // 1. Check if severe storm/rain alert is needed
  const isSevereWeather = weather.conditionType === 'thunder' || 
    (weather.conditionType === 'rain' && weather.rainProbability >= 50) ||
    (weather.windSpeed >= 25);

  const alreadySentAlert = localStorage.getItem(alertKey);

  if (isSevereWeather && !alreadySentAlert) {
    const alertNotif = buildWeatherNotification(weather, slot, true, false);
    localStorage.setItem(alertKey, '1');
    return {
      updatedNotifications: [alertNotif, ...currentNotifications],
      newlyAdded: alertNotif
    };
  }

  // 2. Check regular daily slot notifications per city
  const alreadySentSlot = localStorage.getItem(slotKey);
  const expectedId = `weather-slot-${slot.id}-${citySlug}-${todayStr}`;
  const existsInList = currentNotifications.some(n => n.id === expectedId);

  if (!alreadySentSlot && !existsInList) {
    const slotNotif = buildWeatherNotification(weather, slot, false, false);
    // Ensure the ID contains the citySlug
    slotNotif.id = expectedId;
    localStorage.setItem(slotKey, '1');
    return {
      updatedNotifications: [slotNotif, ...currentNotifications],
      newlyAdded: slotNotif
    };
  }

  return {
    updatedNotifications: currentNotifications,
    newlyAdded: null
  };
}
