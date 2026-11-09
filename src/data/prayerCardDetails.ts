import { ALL_PRAYER_NIYATS, PrayerNiyatItem } from './prayerRulesData';

export interface PrayerCardDetail {
  id: string;
  nameBn: string;
  labelMatches: string[];
  icon: string;
  totalRakatsBn: string;
  timeNoteBn: string;
  rakatBreakdown: {
    label: string;
    rakats: string;
    type: 'farz' | 'sunnah' | 'wajib' | 'nafl';
  }[];
  hadithBn: {
    text: string;
    reference: string;
  };
  virtueBn: string;
  niyatIds: string[];
}

export const PRAYER_CARD_DETAILS: PrayerCardDetail[] = [
  {
    id: 'tahajjud',
    nameBn: 'তাহাজ্জুদ সালাত ও সাহরী',
    labelMatches: ['তাহাজ্জুদ'],
    icon: '🌙',
    totalRakatsBn: '২ রাকাত করে ৪, ৮ বা ১২ রাকাত (নফল)',
    timeNoteBn: 'রাতের শেষ তৃতীয়াংশে (ফজরের পূর্বে)',
    rakatBreakdown: [
      { label: 'তাহাজ্জুদ নফল সালাত', rakats: '২ রাকাত করে ৮ রাকাত', type: 'nafl' },
      { label: 'সাহরীর শেষ সময়', rakats: 'ফজরের আজানের পূর্বে', type: 'nafl' }
    ],
    hadithBn: {
      text: 'ফরজ সালাতের পর সর্বশ্রেষ্ঠ সালাত হলো রাতের সালাত বা তাহাজ্জুদ।',
      reference: 'সহীহ মুসলিম: ১১৬৩'
    },
    virtueBn: 'তাহাজ্জুদ সালাত বান্দাকে আল্লাহর সবচেয়ে নিকটবর্তী করে এবং এ সময় দোয়া শতভাগ কবুল হয়।',
    niyatIds: ['tahajjud']
  },
  {
    id: 'fajr',
    nameBn: 'ফজরের সালাত (Fajr Prayer)',
    labelMatches: ['ফজর'],
    icon: '🌌',
    totalRakatsBn: 'মোট ৪ রাকাত (২ সুন্নাত + ২ ফরজ)',
    timeNoteBn: 'সুবেহ সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত',
    rakatBreakdown: [
      { label: 'সুন্নতে মুয়াক্কাদা', rakats: '২ রাকাত (ফরজের পূর্বে)', type: 'sunnah' },
      { label: 'ফরজ সালাত', rakats: '২ রাকাত (জামাতে সশব্দে)', type: 'farz' }
    ],
    hadithBn: {
      text: 'ফজরের দুই রাকাত সুন্নাত দুনিয়া ও তার ভেতরের সমস্ত কিছুর চেয়ে উত্তম।',
      reference: 'সহীহ মুসলিম: ৭২৫'
    },
    virtueBn: 'যে ব্যক্তি ফজরের সালাত আদায় করে, সে সারাদিন আল্লাহর বিশেষ নিরাপত্তায় থাকে।',
    niyatIds: ['fajr_sunnah', 'fajr_farz']
  },
  {
    id: 'sunrise_ishraq',
    nameBn: 'সূর্যোদয় ও ইশরাক সালাত',
    labelMatches: ['সূর্যোদয়', 'ইশরাক'],
    icon: '🌅',
    totalRakatsBn: '২ বা ৪ রাকাত নফল',
    timeNoteBn: 'সূর্যোদয়ের ১৫-২০ মিনিট পর থেকে',
    rakatBreakdown: [
      { label: 'ইশরাক নফল সালাত', rakats: '২ বা ৪ রাকাত', type: 'nafl' }
    ],
    hadithBn: {
      text: 'যে ব্যক্তি ফজরের সালাত জামাতে পড়ে সূর্যোদয় পর্যন্ত জিকিরে বসে থেকে ২ রাকাত ইশরাক পড়ে, সে এক পূর্ণ হজ ও ওমরার সওয়াব পায়।',
      reference: 'জামে আত-তিরমিজি: ৫৮৬'
    },
    virtueBn: 'ইশরাক সালাত গুনাহ মাফ ও পূর্ণ হজের সওয়াব লাভের বিশেষ মাধ্যম।',
    niyatIds: ['ishraq']
  },
  {
    id: 'chasht',
    nameBn: 'চাশত (দুহা) সালাত',
    labelMatches: ['চাশত'],
    icon: '☀️',
    totalRakatsBn: '২, ৪ বা ৮ রাকাত নফল',
    timeNoteBn: 'পূর্বাহ্ণে (সকাল ৯টা থেকে ১১:৩০ পর্যন্ত)',
    rakatBreakdown: [
      { label: 'চাশত (দুহা) নফল', rakats: '২, ৪ বা ৮ রাকাত', type: 'nafl' }
    ],
    hadithBn: {
      text: 'মানুষের শরীরের ৩৬০টি জোড়ার জন্য প্রতিদিন সদকা দেওয়া আবশ্যক, আর চাশতের দুই রাকাত সালাত তার স্থলাভিষিক্ত হয়।',
      reference: 'সহীহ মুসলিম: ৭২০'
    },
    virtueBn: 'চাশত সালাত রিজিক বৃদ্ধি করে এবং শরীরের সমস্ত অঙ্গের সদকা হিসেবে গণ্য হয়।',
    niyatIds: ['chasht']
  },
  {
    id: 'dhuhr',
    nameBn: 'যুহর (যোহর) সালাত (Dhuhr Prayer)',
    labelMatches: ['যুহর', 'যোহর'],
    icon: '🕌',
    totalRakatsBn: 'মোট ১২ রাকাত (৪ সুন্নাত + ৪ ফরজ + ২ সুন্নাত + ২ নফল)',
    timeNoteBn: 'দুপুরে সূর্য ঢলে পড়ার পর থেকে আসরের পূর্বে',
    rakatBreakdown: [
      { label: 'ক্বাবলাল সুন্নাত (মুয়াক্কাদা)', rakats: '৪ রাকাত (ফরজের পূর্বে)', type: 'sunnah' },
      { label: 'ফরজ সালাত', rakats: '৪ রাকাত (নীরবে কিরাত)', type: 'farz' },
      { label: 'বা\'দাল সুন্নাত (মুয়াক্কাদা)', rakats: '২ রাকাত (ফরজের পর)', type: 'sunnah' },
      { label: 'নফল সালাত (ঐচ্ছিক)', rakats: '২ রাকাত', type: 'nafl' }
    ],
    hadithBn: {
      text: 'যে ব্যক্তি যোহরের পূর্বে ৪ রাকাত এবং পরে ৪ রাকাত সুন্নাত নিয়মিত পড়ে, আল্লাহ তার জন্য জাহান্নামের আগুন হারাম করে দেন।',
      reference: 'জামে আত-তিরমিজি: ৪২৭'
    },
    virtueBn: 'দুপুরের এই সময়ে আসমানের রহমতের দরজাগুলো খুলে দেওয়া হয়।',
    niyatIds: ['dhuhr_sunnah_kabla', 'dhuhr_farz', 'dhuhr_sunnah_baad']
  },
  {
    id: 'asr',
    nameBn: 'আসরের সালাত (Asr Prayer)',
    labelMatches: ['আসর'],
    icon: '🌤️',
    totalRakatsBn: 'মোট ৮ রাকাত (৪ সুন্নাত + ৪ ফরজ)',
    timeNoteBn: 'বিকেলে ছায়া দ্বিগুণ হওয়ার পর থেকে সূর্যাস্তের পূর্বে',
    rakatBreakdown: [
      { label: 'গায়রে মুয়াক্কাদা সুন্নাত', rakats: '৪ রাকাত (ফরজের পূর্বে)', type: 'sunnah' },
      { label: 'ফরজ সালাত', rakats: '৪ রাকাত', type: 'farz' }
    ],
    hadithBn: {
      text: 'আল্লাহ সেই ব্যক্তির ওপর রহম করুন, যে আসরের পূর্বে চার রাকাত সুন্নাত সালাত আদায় করে।',
      reference: 'জামে আত-তিরমিজি: ৪৩০'
    },
    virtueBn: 'আসরের সালাত (সালাতুল উস্তা) হেফাজত করার বিশেষ আদেশ পবিত্র কোরআনে এসেছে।',
    niyatIds: ['asr_sunnah', 'asr_farz']
  },
  {
    id: 'maghrib',
    nameBn: 'মাগরিবের সালাত (Maghrib Prayer)',
    labelMatches: ['মাগরিব'],
    icon: '🌇',
    totalRakatsBn: 'মোট ৭ (বা ১৩) রাকাত (৩ ফরজ + ২ সুন্নাত + ৬ আউয়াবীন)',
    timeNoteBn: 'সূর্যাস্তের পর থেকে পশ্চিমাকাশের লালিমা দূর হওয়ার পূর্ব পর্যন্ত',
    rakatBreakdown: [
      { label: 'ফরজ সালাত', rakats: '৩ রাকাত (১ম ২ রাকাতে সশব্দে)', type: 'farz' },
      { label: 'বা\'দাল সুন্নাত (মুয়াক্কাদা)', rakats: '২ রাকাত', type: 'sunnah' },
      { label: 'আউয়াবীন নফল (ঐচ্ছিক)', rakats: '৬ রাকাত (২ রাকাত করে)', type: 'nafl' }
    ],
    hadithBn: {
      text: 'মাগরিবের পর যে ব্যক্তি ৬ রাকাত আউয়াবীন সালাত আদায় করবে, তাকে বারো বছরের ইবাদতের সওয়াব দেওয়া হবে।',
      reference: 'জামে আত-তিরমিজি: ৪৩৫'
    },
    virtueBn: 'সূর্যাস্তের সময় ও মাগরিবের পর মুহূর্ত দোয়া কবুলের বিশেষ সময়।',
    niyatIds: ['maghrib_farz', 'maghrib_sunnah', 'awwabin']
  },
  {
    id: 'isha',
    nameBn: 'ইশার সালাত (Isha Prayer)',
    labelMatches: ['ইশা'],
    icon: '🌙',
    totalRakatsBn: 'মোট ১৭ রাকাত (৪ সুন্নাত + ৪ ফরজ + ২ সুন্নাত + ২ নফল + ৩ বিতর)',
    timeNoteBn: 'সন্ধ্যা রক্তিম আভা দূর হওয়ার পর থেকে সুবেহ সাদিকের পূর্ব পর্যন্ত',
    rakatBreakdown: [
      { label: 'ক্বাবলাল সুন্নাত', rakats: '৪ রাকাত', type: 'sunnah' },
      { label: 'ফরজ সালাত', rakats: '۴ রাকাত', type: 'farz' },
      { label: 'বা\'দাল সুন্নাত (মুয়াক্কাদা)', rakats: '২ রাকাত', type: 'sunnah' },
      { label: 'নফল সালাত', rakats: '২ রাকাত', type: 'nafl' },
      { label: 'বিতর (ওয়াজিব)', rakats: '৩ রাকাত (দোয়া কুনুত সহ)', type: 'wajib' }
    ],
    hadithBn: {
      text: 'যে ব্যক্তি ইশার সালাত জামাতে আদায় করল, সে যেন অর্ধেক রাত ইবাদতে কাটালো।',
      reference: 'সহীহ মুসলিম: ৬৫৬'
    },
    virtueBn: 'ইশার ফরজ ও বিতর সালাত আদায় করে ঘুমালে সারা রাত ফেরেশতারা পাহারা দেন।',
    niyatIds: ['isha_sunnah_kabla', 'isha_farz', 'isha_sunnah_baad', 'witr']
  }
];

export function getPrayerCardDetailByLabel(label: string): PrayerCardDetail | undefined {
  const clean = label.trim();
  return PRAYER_CARD_DETAILS.find(item => item.labelMatches.some(m => clean.includes(m)));
}
