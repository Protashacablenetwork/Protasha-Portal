import { toBengaliNumber } from './formatters';
import { safeStorage } from './safeStorage';
export { toBengaliNumber };

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayNameBn: string;
  dayNameEn: string;
  weatherCode: number;
  conditionBn: string;
  conditionEn: string;
  conditionType: 'sun' | 'rain' | 'cloud' | 'thunder';
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  precipitationSum: number;
  sunrise?: string;
  sunset?: string;
}

export interface WeatherData {
  cityBn: string;
  cityEn: string;
  divisionBn?: string;
  currentTemp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  conditionBn: string;
  conditionEn: string;
  conditionType: 'sun' | 'rain' | 'cloud' | 'thunder';
  isDay: boolean;
  rainProbability: number;
  daily: DailyForecast[];
  lastUpdated: number;
  isAutoDetected?: boolean;
}

export interface DistrictInfo {
  nameBn: string;
  nameEn: string;
  divisionBn: string;
  lat: number;
  lon: number;
}

// All 64 Districts of Bangladesh with exact coordinates & divisions
export const ALL_BANGLADESH_DISTRICTS: DistrictInfo[] = [
  // Dhaka Division
  { nameBn: 'ঢাকা', nameEn: 'Dhaka', divisionBn: 'ঢাকা', lat: 23.8103, lon: 90.4125 },
  { nameBn: 'গাজীপুর', nameEn: 'Gazipur', divisionBn: 'ঢাকা', lat: 23.9999, lon: 90.4203 },
  { nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', divisionBn: 'ঢাকা', lat: 23.6238, lon: 90.5000 },
  { nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', divisionBn: 'ঢাকা', lat: 24.2513, lon: 89.9167 },
  { nameBn: 'নরসিংদী', nameEn: 'Narsingdi', divisionBn: 'ঢাকা', lat: 23.9193, lon: 90.7202 },
  { nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', divisionBn: 'ঢাকা', lat: 23.5422, lon: 90.5305 },
  { nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', divisionBn: 'ঢাকা', lat: 23.8617, lon: 90.0003 },
  { nameBn: 'ফরিদপুর', nameEn: 'Faridpur', divisionBn: 'ঢাকা', lat: 23.6070, lon: 89.8429 },
  { nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', divisionBn: 'ঢাকা', lat: 23.0051, lon: 89.8266 },
  { nameBn: 'মাদারীপুর', nameEn: 'Madaripur', divisionBn: 'ঢাকা', lat: 23.1641, lon: 90.1897 },
  { nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', divisionBn: 'ঢাকা', lat: 23.7574, lon: 89.6445 },
  { nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', divisionBn: 'ঢাকা', lat: 23.2423, lon: 90.4348 },
  { nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', divisionBn: 'ঢাকা', lat: 24.4449, lon: 90.7766 },

  // Chattogram Division
  { nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', lat: 22.3569, lon: 91.7832 },
  { nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', divisionBn: 'চট্টগ্রাম', lat: 21.4272, lon: 92.0058 },
  { nameBn: 'কুমিল্লা', nameEn: 'Cumilla', divisionBn: 'চট্টগ্রাম', lat: 23.4682, lon: 91.1788 },
  { nameBn: 'ফেনী', nameEn: 'Feni', divisionBn: 'চট্টগ্রাম', lat: 23.0186, lon: 91.3966 },
  { nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', divisionBn: 'চট্টগ্রাম', lat: 23.9571, lon: 91.1115 },
  { nameBn: 'নোয়াখালী', nameEn: 'Noakhali', divisionBn: 'চট্টগ্রাম', lat: 22.8696, lon: 91.0998 },
  { nameBn: 'চাঁদপুর', nameEn: 'Chandpur', divisionBn: 'চট্টগ্রাম', lat: 23.2333, lon: 90.6667 },
  { nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', divisionBn: 'চট্টগ্রাম', lat: 22.9425, lon: 90.8412 },
  { nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', divisionBn: 'চট্টগ্রাম', lat: 22.6533, lon: 92.1753 },
  { nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', divisionBn: 'চট্টগ্রাম', lat: 23.1193, lon: 91.9847 },
  { nameBn: 'বান্দরবান', nameEn: 'Bandarban', divisionBn: 'চট্টগ্রাম', lat: 22.1953, lon: 92.2184 },

  // Rajshahi Division
  { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', divisionBn: 'রাজশাহী', lat: 24.3745, lon: 88.6042 },
  { nameBn: 'বগুড়া', nameEn: 'Bogura', divisionBn: 'রাজশাহী', lat: 24.8465, lon: 89.3777 },
  { nameBn: 'পাবনা', nameEn: 'Pabna', divisionBn: 'রাজশাহী', lat: 24.0064, lon: 89.2372 },
  { nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', divisionBn: 'রাজশাহী', lat: 24.4534, lon: 89.7008 },
  { nameBn: 'নওগাঁ', nameEn: 'Naogaon', divisionBn: 'রাজশাহী', lat: 24.7936, lon: 88.9318 },
  { nameBn: 'নাটোর', nameEn: 'Natore', divisionBn: 'রাজশাহী', lat: 24.4206, lon: 89.0003 },
  { nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', divisionBn: 'রাজশাহী', lat: 24.5965, lon: 88.2776 },
  { nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', divisionBn: 'রাজশাহী', lat: 25.1011, lon: 89.0267 },

  // Khulna Division
  { nameBn: 'খুলনা', nameEn: 'Khulna', divisionBn: 'খুলনা', lat: 22.8456, lon: 89.5403 },
  { nameBn: 'যশোর', nameEn: 'Jashore', divisionBn: 'খুলনা', lat: 23.1664, lon: 89.2081 },
  { nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', divisionBn: 'খুলনা', lat: 22.7185, lon: 89.0705 },
  { nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', divisionBn: 'খুলনা', lat: 23.5450, lon: 89.1526 },
  { nameBn: 'মাগুরা', nameEn: 'Magura', divisionBn: 'খুলনা', lat: 23.4873, lon: 89.4199 },
  { nameBn: 'নড়াইল', nameEn: 'Narail', divisionBn: 'খুলনা', lat: 23.1725, lon: 89.5127 },
  { nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', divisionBn: 'খুলনা', lat: 22.6516, lon: 89.7859 },
  { nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', divisionBn: 'খুলনা', lat: 23.9013, lon: 89.1205 },
  { nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', divisionBn: 'খুলনা', lat: 23.6402, lon: 88.8418 },
  { nameBn: 'মেহেরপুর', nameEn: 'Meherpur', divisionBn: 'খুলনা', lat: 23.7622, lon: 88.6318 },

  // Barishal Division
  { nameBn: 'বরিশাল', nameEn: 'Barishal', divisionBn: 'বরিশাল', lat: 22.7010, lon: 90.3535 },
  { nameBn: 'ভোলা', nameEn: 'Bhola', divisionBn: 'বরিশাল', lat: 22.6859, lon: 90.6481 },
  { nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', divisionBn: 'বরিশাল', lat: 22.3596, lon: 90.3299 },
  { nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', divisionBn: 'বরিশাল', lat: 22.5841, lon: 89.9720 },
  { nameBn: 'বরগুনা', nameEn: 'Barguna', divisionBn: 'বরিশাল', lat: 22.0953, lon: 90.0770 },
  { nameBn: 'ঝালকাঠি', nameEn: 'Jhalokathi', divisionBn: 'বরিশাল', lat: 22.6406, lon: 90.1987 },

  // Sylhet Division
  { nameBn: 'সিলেট', nameEn: 'Sylhet', divisionBn: 'সিলেট', lat: 24.8949, lon: 91.8687 },
  { nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', divisionBn: 'সিলেট', lat: 24.4829, lon: 91.7774 },
  { nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', divisionBn: 'সিলেট', lat: 24.3749, lon: 91.4155 },
  { nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', divisionBn: 'সিলেট', lat: 25.0658, lon: 91.4073 },

  // Rangpur Division
  { nameBn: 'রংপুর', nameEn: 'Rangpur', divisionBn: 'রংপুর', lat: 25.7439, lon: 89.2752 },
  { nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', divisionBn: 'রংপুর', lat: 25.6217, lon: 88.6355 },
  { nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', divisionBn: 'রংপুর', lat: 25.3288, lon: 89.5408 },
  { nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', divisionBn: 'রংপুর', lat: 25.8054, lon: 89.6362 },
  { nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', divisionBn: 'রংপুর', lat: 25.9923, lon: 89.2847 },
  { nameBn: 'নীলফামারী', nameEn: 'Nilphamari', divisionBn: 'রংপুর', lat: 25.9318, lon: 88.8560 },
  { nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', divisionBn: 'রংপুর', lat: 26.3411, lon: 88.5542 },
  { nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', divisionBn: 'রংপুর', lat: 26.0337, lon: 88.4617 },

  // Mymensingh Division
  { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', lat: 24.7471, lon: 90.4203 },
  { nameBn: 'জামালপুর', nameEn: 'Jamalpur', divisionBn: 'ময়মনসিংহ', lat: 24.9375, lon: 89.9378 },
  { nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', divisionBn: 'ময়মনসিংহ', lat: 24.8709, lon: 90.7279 },
  { nameBn: 'শেরপুর', nameEn: 'Sherpur', divisionBn: 'ময়মনসিংহ', lat: 25.0205, lon: 90.0153 }
];

// Dynamically derived unique division names for 100% exact filter matching
export const BANGLADESH_DIVISIONS = ['সব', ...Array.from(new Set(ALL_BANGLADESH_DISTRICTS.map(d => d.divisionBn)))];

export function format12hBnTime(dateObj: Date): string {
  const h = dateObj.getHours();
  const m = dateObj.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const hStr = h12 < 10 ? `0${h12}` : `${h12}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  return `${toBengaliNumber(hStr)}:${toBengaliNumber(mStr)} ${ampm}`;
}

export function findNearestDistrict(lat: number, lon: number): DistrictInfo {
  let nearest = ALL_BANGLADESH_DISTRICTS[0];
  let minDistance = Number.MAX_VALUE;

  for (const d of ALL_BANGLADESH_DISTRICTS) {
    const dist = Math.sqrt(Math.pow(lat - d.lat, 2) + Math.pow(lon - d.lon, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearest = d;
    }
  }
  return nearest;
}

export function interpretWeatherCode(code: number, isDay = true): {
  conditionBn: string;
  conditionEn: string;
  conditionType: 'sun' | 'rain' | 'cloud' | 'thunder';
} {
  switch (code) {
    case 0:
      return { 
        conditionBn: isDay ? 'রোদ ঝলমলে পরিষ্কার আকাশ' : 'মেঘমুক্ত পরিষ্কার রাতের আকাশ', 
        conditionEn: isDay ? 'Clear Sky' : 'Clear Night Sky', 
        conditionType: 'sun' 
      };
    case 1:
      return { 
        conditionBn: isDay ? 'বেশিরভাগ সময় রোদ' : 'অধিকাংশ সময় পরিষ্কার রাতের আকাশ', 
        conditionEn: isDay ? 'Mainly Clear' : 'Mainly Clear Night', 
        conditionType: 'sun' 
      };
    case 2:
      return { 
        conditionBn: isDay ? 'আংশিক মেঘলা আকাশ' : 'আংশিক মেঘলা রাতের আকাশ', 
        conditionEn: 'Partly Cloudy', 
        conditionType: 'cloud' 
      };
    case 3:
      return { conditionBn: 'মেঘলা ও গুমোট আকাশ', conditionEn: 'Overcast', conditionType: 'cloud' };
    case 45:
    case 48:
      return { conditionBn: 'কুয়াশাচ্ছন্ন পরিবেশ', conditionEn: 'Foggy', conditionType: 'cloud' };
    case 51:
    case 53:
    case 55:
      return { conditionBn: 'গুঁড়ি গুঁড়ি বৃষ্টি', conditionEn: 'Drizzle', conditionType: 'rain' };
    case 61:
      return { conditionBn: 'হালকা বৃষ্টিপাত', conditionEn: 'Slight Rain', conditionType: 'rain' };
    case 63:
      return { conditionBn: 'মাঝারি বৃষ্টিপাত', conditionEn: 'Moderate Rain', conditionType: 'rain' };
    case 65:
      return { conditionBn: 'ভারী বৃষ্টিপাত ও দমকা হাওয়া', conditionEn: 'Heavy Rain', conditionType: 'rain' };
    case 80:
    case 81:
    case 82:
      return { conditionBn: 'বৃষ্টির ঝাপটা ও মেঘলা', conditionEn: 'Rain Showers', conditionType: 'rain' };
    case 95:
      return { conditionBn: 'বজ্রসহ তীব্র বৃষ্টিপাত', conditionEn: 'Thunderstorm', conditionType: 'thunder' };
    case 96:
    case 99:
      return { conditionBn: 'বজ্রঝড় ও শিলাবৃষ্টির সতর্কতা', conditionEn: 'Severe Thunderstorm & Hail', conditionType: 'thunder' };
    default:
      if (code >= 70 && code <= 77) {
        return { conditionBn: 'হালকা বৃষ্টি ও শীতল আবহাওয়া', conditionEn: 'Cold Rain / Sleet', conditionType: 'rain' };
      }
      return { 
        conditionBn: isDay ? 'রোদ ও মেঘের খেলা' : 'আংশিক মেঘলা রাতের আকাশ', 
        conditionEn: 'Fair Weather', 
        conditionType: 'cloud' 
      };
  }
}

const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Primary Headquarters of Protyasha Cable Network (Islampur, Jamalpur)
export const DEFAULT_HEADQUARTERS_DISTRICT: DistrictInfo = 
  ALL_BANGLADESH_DISTRICTS.find(d => d.nameEn === 'Jamalpur') || ALL_BANGLADESH_DISTRICTS[0];

// Storage Keys
const PREFERRED_DISTRICT_KEY = 'protyasha_user_weather_district';
const DEVICE_GPS_DISTRICT_KEY = 'protyasha_device_gps_district';
const STABLE_IP_DISTRICT_KEY = 'protyasha_stable_ip_district';
const CACHE_KEY = 'protyasha_live_weather_v2';
const CACHE_TIME_KEY = 'protyasha_live_weather_ts_v2';

export function getUserPreferredDistrict(): DistrictInfo | null {
  try {
    const raw = safeStorage.getItem(PREFERRED_DISTRICT_KEY);
    if (raw) {
      const match = ALL_BANGLADESH_DISTRICTS.find(d => d.nameBn === raw || d.nameEn.toLowerCase() === raw.toLowerCase());
      if (match) return match;
    }
    const gpsRaw = safeStorage.getItem(DEVICE_GPS_DISTRICT_KEY);
    if (gpsRaw) {
      const match = ALL_BANGLADESH_DISTRICTS.find(d => d.nameBn === gpsRaw || d.nameEn.toLowerCase() === gpsRaw.toLowerCase());
      if (match) return match;
    }
  } catch {}
  return null;
}

export type LocationSourceType = 'gps' | 'manual' | 'ip' | 'default';
const LOCATION_SOURCE_KEY = 'protyasha_location_source_type';

export function getLocationSourceType(): LocationSourceType {
  try {
    const val = safeStorage.getItem(LOCATION_SOURCE_KEY) as LocationSourceType | null;
    if (val === 'gps' || val === 'manual' || val === 'ip' || val === 'default') return val;
    if (safeStorage.getItem(DEVICE_GPS_DISTRICT_KEY)) return 'gps';
    if (safeStorage.getItem(PREFERRED_DISTRICT_KEY)) return 'manual';
    if (sessionStorage.getItem(STABLE_IP_DISTRICT_KEY) || safeStorage.getItem(STABLE_IP_DISTRICT_KEY)) return 'ip';
  } catch {}
  return 'default';
}

export function setUserPreferredDistrict(nameBn: string, source: LocationSourceType = 'manual') {
  try {
    safeStorage.setItem(PREFERRED_DISTRICT_KEY, nameBn);
    safeStorage.setItem(LOCATION_SOURCE_KEY, source);
    safeStorage.removeItem(CACHE_KEY); // clear cache to fetch new location immediately
  } catch {}
}

export function clearUserPreferredDistrict() {
  try {
    safeStorage.removeItem(PREFERRED_DISTRICT_KEY);
    safeStorage.removeItem(LOCATION_SOURCE_KEY);
    safeStorage.removeItem(CACHE_KEY);
  } catch {}
}

/**
 * Lightweight Bangladesh IP Geolocation fallback for users who haven't enabled GPS yet.
 * Maps real lat/lon within Bangladesh bounds to the nearest of the 64 districts.
 */
const IP_GEO_COOLDOWN_KEY = 'pcn_ip_geo_cooldown_until';

async function detectIpDistrictFallback(): Promise<DistrictInfo | null> {
  if (typeof window === 'undefined') return null;

  try {
    const cooldownUntil = Number(sessionStorage.getItem(IP_GEO_COOLDOWN_KEY) || '0');
    if (cooldownUntil > Date.now()) {
      return null;
    }
  } catch {}

  const tryParseCoords = (lat: unknown, lon: unknown): DistrictInfo | null => {
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
    // Check if coordinates fall inside Bangladesh geographic bounds
    if (latNum >= 20.3 && latNum <= 26.8 && lonNum >= 87.9 && lonNum <= 92.8) {
      return findNearestDistrict(latNum, lonNum);
    }
    return null;
  };

  const tryMatchCityName = (city: unknown, region: unknown): DistrictInfo | null => {
    const candidates = [String(city || ''), String(region || '')]
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    for (const c of candidates) {
      const match = ALL_BANGLADESH_DISTRICTS.find(
        d => d.nameEn.toLowerCase() === c || c.includes(d.nameEn.toLowerCase())
      );
      if (match) return match;
    }
    return null;
  };

  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(2200) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        const byCoords = tryParseCoords(data.latitude, data.longitude);
        const byCity = tryMatchCityName(data.city, data.region);
        const matched = byCoords || byCity;
        if (matched) {
          try {
            sessionStorage.setItem(STABLE_IP_DISTRICT_KEY, matched.nameBn);
            safeStorage.setItem(STABLE_IP_DISTRICT_KEY, matched.nameBn);
            safeStorage.setItem(LOCATION_SOURCE_KEY, 'ip');
          } catch {}
          return matched;
        }
      }
    }
  } catch {}

  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(2200) });
    if (res.ok) {
      const data = await res.json();
      const byCoords = tryParseCoords(data?.latitude, data?.longitude);
      const byCity = tryMatchCityName(data?.city, data?.region);
      const matched = byCoords || byCity;
      if (matched) {
        try {
          sessionStorage.setItem(STABLE_IP_DISTRICT_KEY, matched.nameBn);
          safeStorage.setItem(STABLE_IP_DISTRICT_KEY, matched.nameBn);
          safeStorage.setItem(LOCATION_SOURCE_KEY, 'ip');
        } catch {}
        return matched;
      }
    }
  } catch {}

  try {
    sessionStorage.setItem(IP_GEO_COOLDOWN_KEY, String(Date.now() + 10 * 60 * 1000));
  } catch {}

  return null;
}

/**
 * Request real physical device GPS from browser.
 * Tries high accuracy first, then low accuracy network triangulation with snappy timeouts.
 */
export async function getRealDeviceGPS(): Promise<DistrictInfo | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  const queryGPS = (enableHighAccuracy: boolean, timeout: number, maxAge: number) => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy,
        timeout,
        maximumAge: maxAge
      });
    });
  };

  try {
    // Attempt 1: Fast High Accuracy GPS (Satellite, 3.5s max)
    const pos = await queryGPS(true, 3500, 60000);
    if (pos.coords && pos.coords.latitude && pos.coords.longitude) {
      const nearest = findNearestDistrict(pos.coords.latitude, pos.coords.longitude);
      try {
        safeStorage.setItem(DEVICE_GPS_DISTRICT_KEY, nearest.nameBn);
        safeStorage.setItem(PREFERRED_DISTRICT_KEY, nearest.nameBn);
        safeStorage.setItem(LOCATION_SOURCE_KEY, 'gps');
      } catch {}
      return nearest;
    }
  } catch {
    // Attempt 2: Cell-tower / WiFi Triangulation (Fast 2.5s fallback)
    try {
      const pos = await queryGPS(false, 2500, 300000);
      if (pos.coords && pos.coords.latitude && pos.coords.longitude) {
        const nearest = findNearestDistrict(pos.coords.latitude, pos.coords.longitude);
        try {
          safeStorage.setItem(DEVICE_GPS_DISTRICT_KEY, nearest.nameBn);
          safeStorage.setItem(PREFERRED_DISTRICT_KEY, nearest.nameBn);
          safeStorage.setItem(LOCATION_SOURCE_KEY, 'gps');
        } catch {}
        return nearest;
      }
    } catch {}
  }

  return null;
}

/**
 * Robust Multi-User Location Detector:
 * 1. If forceRealGPS is true, queries live device GPS first.
 * 2. If user already saved/pinned a district manually, respects it instantly.
 * 3. If geolocation permission is already 'granted', silently refreshes real GPS so users moving across districts get live times.
 * 4. Otherwise checks cached GPS / IP district, and performs lightweight Bangladesh IP geolocation for new devices in any of the 64 districts.
 * 5. Falls back safely to Jamalpur HQ if offline or outside Bangladesh.
 */
export async function detectPreciseLocation(forceRealGPS = false): Promise<{
  district: DistrictInfo;
  isAutoDetected: boolean;
  isGPS: boolean;
  source: LocationSourceType;
}> {
  // 1. Explicit live GPS refresh (when user clicks "লাইভ GPS")
  if (forceRealGPS) {
    const realGPSDistrict = await getRealDeviceGPS();
    if (realGPSDistrict) {
      return { district: realGPSDistrict, isAutoDetected: true, isGPS: true, source: 'gps' };
    }
    const ipFallback = await detectIpDistrictFallback();
    if (ipFallback) {
      return { district: ipFallback, isAutoDetected: true, isGPS: false, source: 'ip' };
    }
    const preferred = getUserPreferredDistrict();
    if (preferred) {
      return { district: preferred, isAutoDetected: false, isGPS: false, source: getLocationSourceType() };
    }
    return { district: DEFAULT_HEADQUARTERS_DISTRICT, isAutoDetected: false, isGPS: false, source: 'default' };
  }

  // 2. Check if user manually pinned a district
  const savedSource = getLocationSourceType();
  const preferred = getUserPreferredDistrict();
  if (preferred && savedSource === 'manual') {
    return { district: preferred, isAutoDetected: false, isGPS: false, source: 'manual' };
  }

  // 3. Silently refresh GPS if browser permission is already granted (no popup!)
  try {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      if (perm.state === 'granted') {
        const gpsDist = await getRealDeviceGPS();
        if (gpsDist) {
          return { district: gpsDist, isAutoDetected: true, isGPS: true, source: 'gps' };
        }
      }
    }
  } catch {}

  // 4. Use previously saved GPS or preferred district
  if (preferred) {
    return {
      district: preferred,
      isAutoDetected: savedSource === 'gps' || savedSource === 'ip',
      isGPS: savedSource === 'gps',
      source: savedSource
    };
  }

  try {
    const lastGps = safeStorage.getItem(DEVICE_GPS_DISTRICT_KEY);
    if (lastGps) {
      const match = ALL_BANGLADESH_DISTRICTS.find(d => d.nameBn === lastGps || d.nameEn.toLowerCase() === lastGps.toLowerCase());
      if (match) {
        return { district: match, isAutoDetected: true, isGPS: true, source: 'gps' };
      }
    }
  } catch {}

  // 5. Check cached IP district
  try {
    const stableIp = sessionStorage.getItem(STABLE_IP_DISTRICT_KEY) || safeStorage.getItem(STABLE_IP_DISTRICT_KEY);
    if (stableIp) {
      const match = ALL_BANGLADESH_DISTRICTS.find(d => d.nameBn === stableIp || d.nameEn.toLowerCase() === stableIp.toLowerCase());
      if (match) {
        return { district: match, isAutoDetected: true, isGPS: false, source: 'ip' };
      }
    }
  } catch {}

  // 6. Auto-detect district via lightweight Bangladesh IP geolocation for multi-district users
  const ipDetected = await detectIpDistrictFallback();
  if (ipDetected) {
    return { district: ipDetected, isAutoDetected: true, isGPS: false, source: 'ip' };
  }

  // 7. Offline / fallback default to Jamalpur HQ
  return { district: DEFAULT_HEADQUARTERS_DISTRICT, isAutoDetected: false, isGPS: false, source: 'default' };
}

/**
 * Fetch real-time weather using Open-Meteo free API
 */
export async function fetchLiveWeather(forceRefresh = false, ignorePreferred = false): Promise<WeatherData> {
  // Detect location first
  const { district, isAutoDetected } = await detectPreciseLocation(ignorePreferred);
  const lat = district.lat;
  const lon = district.lon;

  // Check memory/local cache (valid for 10 minutes AND must match current district!)
  if (!forceRefresh) {
    try {
      const cached = safeStorage.getItem(CACHE_KEY);
      const cachedTs = safeStorage.getItem(CACHE_TIME_KEY);
      if (cached && cachedTs) {
        const age = Date.now() - parseInt(cachedTs, 10);
        if (age < 10 * 60 * 1000) {
          const parsed: WeatherData = JSON.parse(cached);
          if (parsed && (parsed.cityBn === district.nameBn || parsed.cityEn?.toLowerCase() === district.nameEn.toLowerCase())) {
            return parsed;
          }
        }
      }
    } catch {}
  }

  try {
    // Public free Open-Meteo API endpoint
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset&timezone=Asia%2FDhaka`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Open-Meteo weather API error');
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};

    const nowHour = new Date().getHours();
    const isDay = current.is_day !== undefined ? Boolean(current.is_day) : (nowHour >= 6 && nowHour < 18);
    const currentWeatherCode = current.weather_code ?? 1;
    const { conditionBn, conditionEn, conditionType } = interpretWeatherCode(currentWeatherCode, isDay);

    const dailyForecasts: DailyForecast[] = [];
    const timeArr = daily.time || [];
    const codeArr = daily.weather_code || [];
    const maxTempArr = daily.temperature_2m_max || [];
    const minTempArr = daily.temperature_2m_min || [];
    const precipProbArr = daily.precipitation_probability_max || [];
    const precipSumArr = daily.precipitation_sum || [];
    const sunriseArr = daily.sunrise || [];
    const sunsetArr = daily.sunset || [];

    for (let i = 0; i < Math.min(timeArr.length, 7); i++) {
      const dateStr = timeArr[i];
      const d = new Date(dateStr + 'T00:00:00');
      let dayNameBn = daysBn[d.getDay()];
      let dayNameEn = daysEn[d.getDay()];

      if (i === 0) {
        dayNameBn = 'আজ';
        dayNameEn = 'Today';
      } else if (i === 1) {
        dayNameBn = 'আগামীকাল';
        dayNameEn = 'Tomorrow';
      }

      const wCode = codeArr[i] ?? 1;
      const inter = interpretWeatherCode(wCode, true);

      let sunriseFormatted = '০৫:৫৬ AM';
      let sunsetFormatted = '০৫:২৩ PM';
      if (sunriseArr[i]) {
        try {
          const srTime = new Date(sunriseArr[i]);
          sunriseFormatted = format12hBnTime(srTime);
        } catch {}
      }
      if (sunsetArr[i]) {
        try {
          const ssTime = new Date(sunsetArr[i]);
          sunsetFormatted = format12hBnTime(ssTime);
        } catch {}
      }

      dailyForecasts.push({
        date: dateStr,
        dayNameBn,
        dayNameEn,
        weatherCode: wCode,
        conditionBn: inter.conditionBn,
        conditionEn: inter.conditionEn,
        conditionType: inter.conditionType,
        tempMax: Math.round(maxTempArr[i] ?? 32),
        tempMin: Math.round(minTempArr[i] ?? 23),
        precipitationProb: Math.round(precipProbArr[i] ?? 10),
        precipitationSum: Number((precipSumArr[i] ?? 0).toFixed(1)),
        sunrise: sunriseFormatted,
        sunset: sunsetFormatted
      });
    }

    const weatherResult: WeatherData = {
      cityBn: district.nameBn,
      cityEn: district.nameEn,
      divisionBn: district.divisionBn,
      currentTemp: Math.round(current.temperature_2m ?? 29),
      apparentTemp: Math.round(current.apparent_temperature ?? 31),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      windSpeed: Math.round(current.wind_speed_10m ?? 10),
      weatherCode: currentWeatherCode,
      conditionBn,
      conditionEn,
      conditionType,
      isDay,
      rainProbability: dailyForecasts[0]?.precipitationProb ?? 15,
      daily: dailyForecasts,
      lastUpdated: Date.now(),
      isAutoDetected
    };

    try {
      safeStorage.setItem(CACHE_KEY, JSON.stringify(weatherResult));
      safeStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch {}

    return weatherResult;
  } catch (err) {
    console.warn('Weather API failed, using district defaults:', err);
    const nowH = new Date().getHours();
    const isDayFallback = nowH >= 6 && nowH < 18;
    return {
      cityBn: district.nameBn,
      cityEn: district.nameEn,
      divisionBn: district.divisionBn,
      currentTemp: 29,
      apparentTemp: 32,
      humidity: 68,
      windSpeed: 12,
      weatherCode: 1,
      conditionBn: isDayFallback ? 'রোদ ঝলমলে আকাশ' : 'পরিষ্কার রাতের আকাশ',
      conditionEn: isDayFallback ? 'Mainly Clear' : 'Mainly Clear Night',
      conditionType: 'sun',
      isDay: isDayFallback,
      rainProbability: 10,
      daily: [
        {
          date: new Date().toISOString().split('T')[0],
          dayNameBn: 'আজ',
          dayNameEn: 'Today',
          weatherCode: 1,
          conditionBn: 'রোদ ঝলমলে আকাশ',
          conditionEn: 'Mainly Clear',
          conditionType: 'sun',
          tempMax: 33,
          tempMin: 23,
          precipitationProb: 15,
          precipitationSum: 0.1,
          sunrise: '০৫:৫৬ AM',
          sunset: '০৫:২৩ PM'
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          dayNameBn: 'আগামীকাল',
          dayNameEn: 'Tomorrow',
          weatherCode: 2,
          conditionBn: 'আংশিক মেঘলা',
          conditionEn: 'Partly Cloudy',
          conditionType: 'cloud',
          tempMax: 32,
          tempMin: 24,
          precipitationProb: 25,
          precipitationSum: 0.5,
          sunrise: '০৫:৫৬ AM',
          sunset: '০৫:২৩ PM'
        }
      ],
      lastUpdated: Date.now(),
      isAutoDetected
    };
  }
}

