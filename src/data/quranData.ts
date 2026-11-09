export interface SurahMeta {
  number: number;
  nameAr: string;
  nameBn: string;
  nameEn: string;
  meaningBn: string;
  versesCount: number;
  revelationType: 'মক্কী' | 'মাদানী';
}

export interface Ayah {
  numberInSurah: number;
  textAr: string;
  textBnTranslit?: string;
  textBn: string;
  audioUrl?: string;
}

export interface SurahDetail extends SurahMeta {
  bismillah?: boolean;
  ayahs: Ayah[];
}

export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, nameAr: 'الفاتحة', nameBn: 'আল-ফাতিহা', nameEn: 'Al-Fatihah', meaningBn: 'সূচনা', versesCount: 7, revelationType: 'মক্কী' },
  { number: 2, nameAr: 'البقرة', nameBn: 'আল-বাকারা', nameEn: 'Al-Baqarah', meaningBn: 'বকনা-বাছুর', versesCount: 286, revelationType: 'মাদানী' },
  { number: 3, nameAr: 'آل عمران', nameBn: 'আলে ইমরান', nameEn: 'Ali \'Imran', meaningBn: 'ইমরানের পরিবার', versesCount: 200, revelationType: 'মাদানী' },
  { number: 4, nameAr: 'النساء', nameBn: 'আন-নিসা', nameEn: 'An-Nisa', meaningBn: 'নারী', versesCount: 176, revelationType: 'মাদানী' },
  { number: 5, nameAr: 'المائدة', nameBn: 'আল-মায়েদা', nameEn: 'Al-Ma\'idah', meaningBn: 'খাদ্য পরিবেশিত টেবিল', versesCount: 120, revelationType: 'মাদানী' },
  { number: 6, nameAr: 'الأنعام', nameBn: 'আল-আনআম', nameEn: 'Al-An\'am', meaningBn: 'গৃহপালিত পশু', versesCount: 165, revelationType: 'মক্কী' },
  { number: 7, nameAr: 'الأعراف', nameBn: 'আল-আরাফ', nameEn: 'Al-A\'raf', meaningBn: 'উঁচু স্থানসমূহ', versesCount: 206, revelationType: 'মক্কী' },
  { number: 8, nameAr: 'الأنفال', nameBn: 'আল-আনফাল', nameEn: 'Al-Anfal', meaningBn: 'যুদ্ধলব্ধ সম্পদ', versesCount: 75, revelationType: 'মাদানী' },
  { number: 9, nameAr: 'التوبة', nameBn: 'আত-তাওবাহ', nameEn: 'At-Tawbah', meaningBn: 'অনুশোচনা', versesCount: 129, revelationType: 'মাদানী' },
  { number: 10, nameAr: 'يونس', nameBn: 'ইউনুস', nameEn: 'Yunus', meaningBn: 'ইউনুস (আঃ)', versesCount: 109, revelationType: 'মক্কী' },
  { number: 11, nameAr: 'هود', nameBn: 'হুদ', nameEn: 'Hud', meaningBn: 'হুদ (আঃ)', versesCount: 123, revelationType: 'মক্কী' },
  { number: 12, nameAr: 'يوسف', nameBn: 'ইউসুফ', nameEn: 'Yusuf', meaningBn: 'ইউসুফ (আঃ)', versesCount: 111, revelationType: 'মক্কী' },
  { number: 13, nameAr: 'الرعد', nameBn: 'আর-রাদ', nameEn: 'Ar-Ra\'d', meaningBn: 'বজ্রপাত', versesCount: 43, revelationType: 'মাদানী' },
  { number: 14, nameAr: 'إبراهيم', nameBn: 'ইব্রাহিম', nameEn: 'Ibrahim', meaningBn: 'ইব্রাহিম (আঃ)', versesCount: 52, revelationType: 'মক্কী' },
  { number: 15, nameAr: 'الحجر', nameBn: 'আল-হিজর', nameEn: 'Al-Hijr', meaningBn: 'পাথুরে পাহাড়', versesCount: 99, revelationType: 'মক্কী' },
  { number: 16, nameAr: 'النحل', nameBn: 'আন-নাহল', nameEn: 'An-Nahl', meaningBn: 'মৌমাছি', versesCount: 128, revelationType: 'মক্কী' },
  { number: 17, nameAr: 'الإسراء', nameBn: 'আল-ইসরা', nameEn: 'Al-Isra', meaningBn: 'নৈশ ভ্রমণ', versesCount: 111, revelationType: 'মক্কী' },
  { number: 18, nameAr: 'الكهف', nameBn: 'আল-কাহফ', nameEn: 'Al-Kahf', meaningBn: 'গুহা', versesCount: 110, revelationType: 'মক্কী' },
  { number: 19, nameAr: 'مريم', nameBn: 'মারইয়াম', nameEn: 'Maryam', meaningBn: 'মারইয়াম (আঃ)', versesCount: 98, revelationType: 'মক্কী' },
  { number: 20, nameAr: 'طه', nameBn: 'ত্বা-হা', nameEn: 'Ta-Ha', meaningBn: 'ত্বা-হা', versesCount: 135, revelationType: 'মক্কী' },
  { number: 21, nameAr: 'الأنبياء', nameBn: 'আল-আম্বিয়া', nameEn: 'Al-Anbiya', meaningBn: 'নবীগণ', versesCount: 112, revelationType: 'মক্কী' },
  { number: 22, nameAr: 'الحج', nameBn: 'আল-হাজ্জ', nameEn: 'Al-Hajj', meaningBn: 'হজ', versesCount: 78, revelationType: 'মাদানী' },
  { number: 23, nameAr: 'المؤمنون', nameBn: 'আল-মুমিনুন', nameEn: 'Al-Mu\'minun', meaningBn: 'মুমিনগণ', versesCount: 118, revelationType: 'মক্কী' },
  { number: 24, nameAr: 'النور', nameBn: 'আন-নূর', nameEn: 'An-Nur', meaningBn: 'আলো', versesCount: 64, revelationType: 'মাদানী' },
  { number: 25, nameAr: 'الفرقان', nameBn: 'আল-ফুরকান', nameEn: 'Al-Furqan', meaningBn: 'সত্য-মিথ্যার পার্থক্যকারী', versesCount: 77, revelationType: 'মক্কী' },
  { number: 26, nameAr: 'الشعراء', nameBn: 'আশ-শুআরা', nameEn: 'Ash-Shu\'ara', meaningBn: 'কবিগণ', versesCount: 227, revelationType: 'মক্কী' },
  { number: 27, nameAr: 'النمل', nameBn: 'আন-নামল', nameEn: 'An-Naml', meaningBn: 'পিপীলিকা', versesCount: 93, revelationType: 'মক্কী' },
  { number: 28, nameAr: 'القصص', nameBn: 'আল-কাসাস', nameEn: 'Al-Qasas', meaningBn: 'কাহিনী', versesCount: 88, revelationType: 'মক্কী' },
  { number: 29, nameAr: 'العنكبوت', nameBn: 'আল-আনকাবুত', nameEn: 'Al-\'Ankabut', meaningBn: 'মাকড়সা', versesCount: 69, revelationType: 'মক্কী' },
  { number: 30, nameAr: 'الروم', nameBn: 'আর-রূম', nameEn: 'Ar-Rum', meaningBn: 'রোমান জাতি', versesCount: 60, revelationType: 'মক্কী' },
  { number: 31, nameAr: 'لقمان', nameBn: 'লুকমান', nameEn: 'Luqman', meaningBn: 'লুকমান (আঃ)', versesCount: 34, revelationType: 'মক্কী' },
  { number: 32, nameAr: 'السجدة', nameBn: 'আস-সাজদাহ', nameEn: 'As-Sajdah', meaningBn: 'সিজদা', versesCount: 30, revelationType: 'মক্কী' },
  { number: 33, nameAr: 'الأحزاب', nameBn: 'আল-আহযাব', nameEn: 'Al-Ahzab', meaningBn: 'জোটবদ্ধ দলসমূহ', versesCount: 73, revelationType: 'মাদানী' },
  { number: 34, nameAr: 'سبأ', nameBn: 'সাবা', nameEn: 'Saba', meaningBn: 'সাবা জাতি', versesCount: 54, revelationType: 'মক্কী' },
  { number: 35, nameAr: 'فاطر', nameBn: 'ফাতির', nameEn: 'Fatir', meaningBn: 'সৃষ্টিকর্তা', versesCount: 45, revelationType: 'মক্কী' },
  { number: 36, nameAr: 'يس', nameBn: 'ইয়াসীন', nameEn: 'Ya-Sin', meaningBn: 'ইয়াসীন (কোরআনের হৃৎপিণ্ড)', versesCount: 83, revelationType: 'মক্কী' },
  { number: 37, nameAr: 'الصافات', nameBn: 'আস-সাফফাত', nameEn: 'As-Saffat', meaningBn: 'সারিবদ্ধ দলসমূহ', versesCount: 182, revelationType: 'মক্কী' },
  { number: 38, nameAr: 'ص', nameBn: 'সোয়াদ', nameEn: 'Sad', meaningBn: 'সোয়াদ', versesCount: 88, revelationType: 'মক্কী' },
  { number: 39, nameAr: 'الزمر', nameBn: 'আজ-জুমার', nameEn: 'Az-Zumar', meaningBn: 'দলসমূহ', versesCount: 75, revelationType: 'মক্কী' },
  { number: 40, nameAr: 'غافر', nameBn: 'গাফির', nameEn: 'Ghafir', meaningBn: 'ক্ষমাশীল', versesCount: 85, revelationType: 'মক্কী' },
  { number: 41, nameAr: 'فصلت', nameBn: 'ফুসসিলাত', nameEn: 'Fussilat', meaningBn: 'সুস্পষ্ট ব্যাখ্যা', versesCount: 54, revelationType: 'মক্কী' },
  { number: 42, nameAr: 'الشورى', nameBn: 'আশ-শুরা', nameEn: 'Ash-Shura', meaningBn: 'পরামর্শ', versesCount: 53, revelationType: 'মক্কী' },
  { number: 43, nameAr: 'الزخرف', nameBn: 'আজ-জুখরুফ', nameEn: 'Az-Zukhruf', meaningBn: 'স্বর্ণালংকার', versesCount: 89, revelationType: 'মক্কী' },
  { number: 44, nameAr: 'الدخان', nameBn: 'আদ-দুখান', nameEn: 'Ad-Dukhan', meaningBn: 'ধোঁয়া', versesCount: 59, revelationType: 'মক্কী' },
  { number: 45, nameAr: 'الجاثية', nameBn: 'আল-জাসিয়াহ', nameEn: 'Al-Jathiyah', meaningBn: 'নতজানু', versesCount: 37, revelationType: 'মক্কী' },
  { number: 46, nameAr: 'الأحقاف', nameBn: 'আল-আহকাফ', nameEn: 'Al-Ahqaf', meaningBn: 'বালিয়াড়ি', versesCount: 35, revelationType: 'মক্কী' },
  { number: 47, nameAr: 'محمد', nameBn: 'মুহাম্মদ', nameEn: 'Muhammad', meaningBn: 'মুহাম্মদ (সাঃ)', versesCount: 38, revelationType: 'মাদানী' },
  { number: 48, nameAr: 'الفتح', nameBn: 'আল-ফাতহ', nameEn: 'Al-Fath', meaningBn: 'বিজয়', versesCount: 29, revelationType: 'মাদানী' },
  { number: 49, nameAr: 'الحجرات', nameBn: 'আল-হুজুরাত', nameEn: 'Al-Hujurat', meaningBn: 'কক্ষসমূহ', versesCount: 18, revelationType: 'মাদানী' },
  { number: 50, nameAr: 'ق', nameBn: 'কাফ', nameEn: 'Qaf', meaningBn: 'কাফ', versesCount: 45, revelationType: 'মক্কী' },
  { number: 51, nameAr: 'الذاريات', nameBn: 'আজ-যারিয়াত', nameEn: 'Adh-Dhariyat', meaningBn: 'বিক্ষিপ্তকারী বাতাস', versesCount: 60, revelationType: 'মক্কী' },
  { number: 52, nameAr: 'الطور', nameBn: 'আত-তুর', nameEn: 'At-Tur', meaningBn: 'তূর পর্বত', versesCount: 49, revelationType: 'মক্কী' },
  { number: 53, nameAr: 'النجم', nameBn: 'আন-নাজম', nameEn: 'An-Najm', meaningBn: 'নক্ষত্র', versesCount: 62, revelationType: 'মক্কী' },
  { number: 54, nameAr: 'القمر', nameBn: 'আল-কামার', nameEn: 'Al-Qamar', meaningBn: 'চন্দ্র', versesCount: 55, revelationType: 'মক্কী' },
  { number: 55, nameAr: 'الرحمن', nameBn: 'আর-রহমান', nameEn: 'Ar-Rahman', meaningBn: 'পরম করুণাময়', versesCount: 78, revelationType: 'মাদানী' },
  { number: 56, nameAr: 'الواقعة', nameBn: 'আল-ওয়াকিয়া', nameEn: 'Al-Waqi\'ah', meaningBn: 'অবশ্যম্ভাবী ঘটনা', versesCount: 96, revelationType: 'মক্কী' },
  { number: 57, nameAr: 'الحديد', nameBn: 'আল-হাদীদ', nameEn: 'Al-Hadid', meaningBn: 'লোহা', versesCount: 29, revelationType: 'মাদানী' },
  { number: 58, nameAr: 'المجادلة', nameBn: 'আল-মুজাদালাহ', nameEn: 'Al-Mujadila', meaningBn: 'বিতর্ককারিণী', versesCount: 22, revelationType: 'মাদানী' },
  { number: 59, nameAr: 'الحشر', nameBn: 'আল-হাশর', nameEn: 'Al-Hashr', meaningBn: 'সমাবেশ', versesCount: 24, revelationType: 'মাদানী' },
  { number: 60, nameAr: 'الممتحنة', nameBn: 'আল-মুমতাহিনা', nameEn: 'Al-Mumtahanah', meaningBn: 'পরীক্ষিতা নারী', versesCount: 13, revelationType: 'মাদানী' },
  { number: 61, nameAr: 'الصف', nameBn: 'আস-সফ', nameEn: 'As-Saf', meaningBn: 'সারিবদ্ধ সৈন্যদল', versesCount: 14, revelationType: 'মাদানী' },
  { number: 62, nameAr: 'الجمعة', nameBn: 'আল-জুমুআ', nameEn: 'Al-Jumu\'ah', meaningBn: 'শুক্রবার / জুমুআ', versesCount: 11, revelationType: 'মাদানী' },
  { number: 63, nameAr: 'المنافقون', nameBn: 'আল-মুনাফিকুন', nameEn: 'Al-Munafiqun', meaningBn: 'কপট বিশ্বাসীগণ', versesCount: 11, revelationType: 'মাদানী' },
  { number: 64, nameAr: 'التغابن', nameBn: 'আত-তাগাবুন', nameEn: 'At-Taghabun', meaningBn: 'ক্ষতি-লাভের দিন', versesCount: 18, revelationType: 'মাদানী' },
  { number: 65, nameAr: 'الطلاق', nameBn: 'আত-তালাক', nameEn: 'At-Talaq', meaningBn: 'তালাক / বিবাহ বিচ্ছেদ', versesCount: 12, revelationType: 'মাদানী' },
  { number: 66, nameAr: 'التحريم', nameBn: 'আত-তাহরীম', nameEn: 'At-Tahrim', meaningBn: 'নিষিদ্ধকরণ', versesCount: 12, revelationType: 'মাদানী' },
  { number: 67, nameAr: 'الملك', nameBn: 'আল-মুলক', nameEn: 'Al-Mulk', meaningBn: 'সার্বভৌম কর্তৃত্ব / কবরের নিরাপত্তা', versesCount: 30, revelationType: 'মক্কী' },
  { number: 68, nameAr: 'القلم', nameBn: 'আল-কলম', nameEn: 'Al-Qalam', meaningBn: 'কলম', versesCount: 52, revelationType: 'মক্কী' },
  { number: 69, nameAr: 'الحاقة', nameBn: 'আল-হাক্কাহ', nameEn: 'Al-Haqqah', meaningBn: 'অকাট্য সত্য', versesCount: 52, revelationType: 'মক্কী' },
  { number: 70, nameAr: 'المعارج', nameBn: 'আল-মাআরিজ', nameEn: 'Al-Ma\'arij', meaningBn: 'আরোহণের পথ', versesCount: 44, revelationType: 'মক্কী' },
  { number: 71, nameAr: 'نوح', nameBn: 'নূহ', nameEn: 'Nuh', meaningBn: 'নূহ (আঃ)', versesCount: 28, revelationType: 'মক্কী' },
  { number: 72, nameAr: 'الجن', nameBn: 'আল-জিন', nameEn: 'Al-Jinn', meaningBn: 'জিন জাতি', versesCount: 28, revelationType: 'মক্কী' },
  { number: 73, nameAr: 'المزمل', nameBn: 'আল-মুজ্জাম্মিল', nameEn: 'Al-Muzzammil', meaningBn: 'বস্ত্রাবৃত', versesCount: 20, revelationType: 'মক্কী' },
  { number: 74, nameAr: 'المدثر', nameBn: 'আল-মুদ্দাসসির', nameEn: 'Al-Muddaththir', meaningBn: 'চাদরাবৃত', versesCount: 56, revelationType: 'মক্কী' },
  { number: 75, nameAr: 'القيامة', nameBn: 'আল-কিয়ামাহ', nameEn: 'Al-Qiyamah', meaningBn: 'পুনরুত্থান দিবস', versesCount: 40, revelationType: 'মক্কী' },
  { number: 76, nameAr: 'الإنسان', nameBn: 'আল-ইনসান', nameEn: 'Al-Insan', meaningBn: 'মানবজাতি', versesCount: 31, revelationType: 'মাদানী' },
  { number: 77, nameAr: 'المرسلات', nameBn: 'আল-মুরসালাত', nameEn: 'Al-Mursalat', meaningBn: 'প্রেরিত বাতাস', versesCount: 50, revelationType: 'মক্কী' },
  { number: 78, nameAr: 'النبأ', nameBn: 'আন-নাবা', nameEn: 'An-Naba', meaningBn: 'মহাসংবাদ', versesCount: 40, revelationType: 'মক্কী' },
  { number: 79, nameAr: 'النازعات', nameBn: 'আন-নাযিয়াত', nameEn: 'An-Nazi\'at', meaningBn: 'উৎপাটনকারী ফেরেশতাগণ', versesCount: 46, revelationType: 'মক্কী' },
  { number: 80, nameAr: 'عبس', nameBn: 'আবাসা', nameEn: '\'Abasa', meaningBn: 'ভ্রুকুটি করল', versesCount: 42, revelationType: 'মক্কী' },
  { number: 81, nameAr: 'التكوير', nameBn: 'আত-তাকবীর', nameEn: 'At-Takwir', meaningBn: 'সূর্য গুটিয়ে ফেলা', versesCount: 29, revelationType: 'মক্কী' },
  { number: 82, nameAr: 'الانفطار', nameBn: 'আল-ইনফিতার', nameEn: 'Al-Infitar', meaningBn: 'আকাশ ফেটে যাওয়া', versesCount: 19, revelationType: 'মক্কী' },
  { number: 83, nameAr: 'المطففين', nameBn: 'আল-মুতাফফিফীন', nameEn: 'Al-Mutaffifin', meaningBn: 'মাপে কম দানকারী', versesCount: 36, revelationType: 'মক্কী' },
  { number: 84, nameAr: 'الانشقاق', nameBn: 'আল-ইনশিকাক', nameEn: 'Al-Inshiqaq', meaningBn: 'আকাশ বিদীর্ণ হওয়া', versesCount: 25, revelationType: 'মক্কী' },
  { number: 85, nameAr: 'البروج', nameBn: 'আল-বুরুজ', nameEn: 'Al-Buruj', meaningBn: 'নক্ষত্রপুঞ্জ', versesCount: 22, revelationType: 'মক্কী' },
  { number: 86, nameAr: 'الطارق', nameBn: 'আত-তারিক', nameEn: 'At-Tariq', meaningBn: 'রাতের আগমনকারী', versesCount: 17, revelationType: 'মক্কী' },
  { number: 87, nameAr: 'الأعلى', nameBn: 'আল-আলা', nameEn: 'Al-A\'la', meaningBn: 'সর্বোচ্চ', versesCount: 19, revelationType: 'মক্কী' },
  { number: 88, nameAr: 'الغاشية', nameBn: 'আল-গাশিয়াহ', nameEn: 'Al-Ghashiyah', meaningBn: 'আচ্ছন্নকারী কেয়ামত', versesCount: 26, revelationType: 'মক্কী' },
  { number: 89, nameAr: 'الفجر', nameBn: 'আল-ফজর', nameEn: 'Al-Fajr', meaningBn: 'ভোরবেলা', versesCount: 30, revelationType: 'মক্কী' },
  { number: 90, nameAr: 'البلد', nameBn: 'আল-বালাদ', nameEn: 'Al-Balad', meaningBn: 'নগরী (মক্কা)', versesCount: 20, revelationType: 'মক্কী' },
  { number: 91, nameAr: 'الشمس', nameBn: 'আশ-শামস', nameEn: 'Ash-Shams', meaningBn: 'সূর্য', versesCount: 15, revelationType: 'মক্কী' },
  { number: 92, nameAr: 'الليل', nameBn: 'আল-লাইল', nameEn: 'Al-Layl', meaningBn: 'রাত', versesCount: 21, revelationType: 'মক্কী' },
  { number: 93, nameAr: 'الضحى', nameBn: 'আদ-দুহা', nameEn: 'Ad-Duha', meaningBn: 'পূর্বাহ্ণ / সকালের রোদ', versesCount: 11, revelationType: 'মক্কী' },
  { number: 94, nameAr: 'الشرح', nameBn: 'আল-ইনশিরাহ', nameEn: 'Ash-Sharh', meaningBn: 'বক্ষ প্রশস্তকরণ', versesCount: 8, revelationType: 'মক্কী' },
  { number: 95, nameAr: 'التين', nameBn: 'আত-তীন', nameEn: 'At-Tin', meaningBn: 'ডুমুর / আঞ্জির', versesCount: 8, revelationType: 'মক্কী' },
  { number: 96, nameAr: 'العلق', nameBn: 'আল-আলাক', nameEn: 'Al-\'Alaq', meaningBn: 'রক্তপিণ্ড / প্রথম ওহী', versesCount: 19, revelationType: 'মক্কী' },
  { number: 97, nameAr: 'القدر', nameBn: 'আল-কদর', nameEn: 'Al-Qadr', meaningBn: 'মহিমান্বিত রজনী / শবে কদর', versesCount: 5, revelationType: 'মক্কী' },
  { number: 98, nameAr: 'البينة', nameBn: 'আল-বাইয়্যিনাহ', nameEn: 'Al-Bayyinah', meaningBn: 'সুস্পষ্ট প্রমাণ', versesCount: 8, revelationType: 'মাদানী' },
  { number: 99, nameAr: 'الزلزلة', nameBn: 'আজ-যালযালাহ', nameEn: 'Az-Zalzalah', meaningBn: 'ভূমিকম্প', versesCount: 8, revelationType: 'মাদানী' },
  { number: 100, nameAr: 'العاديات', nameBn: 'আল-আদিয়াত', nameEn: 'Al-\'Adiyat', meaningBn: 'অভিযানকারী অশ্ব', versesCount: 11, revelationType: 'মক্কী' },
  { number: 101, nameAr: 'القارعة', nameBn: 'আল-কারিয়াহ', nameEn: 'Al-Qari\'ah', meaningBn: 'মহাবিপদ', versesCount: 11, revelationType: 'মক্কী' },
  { number: 102, nameAr: 'التكاثر', nameBn: 'আত-তাকাসুর', nameEn: 'At-Takathur', meaningBn: 'প্রাচুর্যের প্রতিযোগিতা', versesCount: 8, revelationType: 'মক্কী' },
  { number: 103, nameAr: 'العصر', nameBn: 'আল-আসর', nameEn: 'Al-\'Asr', meaningBn: 'মহাকাল / সময়', versesCount: 3, revelationType: 'মক্কী' },
  { number: 104, nameAr: 'الهمزة', nameBn: 'আল-হুমাযাহ', nameEn: 'Al-Humazah', meaningBn: 'পরনিন্দাকারী', versesCount: 9, revelationType: 'মক্কী' },
  { number: 105, nameAr: 'الفيل', nameBn: 'আল-ফিল', nameEn: 'Al-Fil', meaningBn: 'হাতি', versesCount: 5, revelationType: 'মক্কী' },
  { number: 106, nameAr: 'قريش', nameBn: 'কুরাইশ', nameEn: 'Quraysh', meaningBn: 'কুরাইশ গোত্র', versesCount: 4, revelationType: 'মক্কী' },
  { number: 107, nameAr: 'الماعون', nameBn: 'আল-মাউন', nameEn: 'Al-Ma\'un', meaningBn: 'নিত্যব্যবহার্য জিনিস', versesCount: 7, revelationType: 'মক্কী' },
  { number: 108, nameAr: 'الكوثر', nameBn: 'আল-কাউসার', nameEn: 'Al-Kawthar', meaningBn: 'প্রচুর প্রাচুর্য / হাউজে কাউসার', versesCount: 3, revelationType: 'মক্কী' },
  { number: 109, nameAr: 'الكافرون', nameBn: 'আল-কাফিরুন', nameEn: 'Al-Kafirun', meaningBn: 'অবিশ্বাসিগণ', versesCount: 6, revelationType: 'মক্কী' },
  { number: 110, nameAr: 'النصر', nameBn: 'আন-নাসর', nameEn: 'An-Nasr', meaningBn: 'সাহায্য ও বিজয়', versesCount: 3, revelationType: 'মাদানী' },
  { number: 111, nameAr: 'المسد', nameBn: 'আল-লাহাব / আল-মাসাদ', nameEn: 'Al-Masad', meaningBn: 'খেজুর গাছের ছাল / অগ্নিকুণ্ড', versesCount: 5, revelationType: 'মক্কী' },
  { number: 112, nameAr: 'الإخلاص', nameBn: 'আল-ইখলাস', nameEn: 'Al-Ikhlas', meaningBn: 'একত্ববাদ', versesCount: 4, revelationType: 'মক্কী' },
  { number: 113, nameAr: 'الفلق', nameBn: 'আল-ফালাক', nameEn: 'Al-Falaq', meaningBn: 'ঊষা / প্রভাত', versesCount: 5, revelationType: 'মক্কী' },
  { number: 114, nameAr: 'الناس', nameBn: 'আন-নাস', nameEn: 'An-Nas', meaningBn: 'মানবজাতি', versesCount: 6, revelationType: 'মক্কী' }
];

// Offline built-in details for popular Surahs
export const OFFLINE_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    nameAr: 'الفاتحة',
    nameBn: 'আল-ফাতিহা',
    nameEn: 'Al-Fatihah',
    meaningBn: 'সূচনা / উম্মুল কোরআন',
    versesCount: 7,
    revelationType: 'মক্কী',
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        textBnTranslit: 'বিসমিল্লাহির রাহমানির রাহীম',
        textBn: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।'
      },
      {
        numberInSurah: 2,
        textAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        textBnTranslit: 'আলহামদু লিল্লাহি রাব্বিল আলামীন',
        textBn: 'সকল প্রশংসা একমাত্র আল্লাহর জন্য, যিনি বিশ্বজগতের পালনকর্তা।'
      },
      {
        numberInSurah: 3,
        textAr: 'الرَّحْمَٰنِ الرَّحِيمِ',
        textBnTranslit: 'আর-রাহমানির রাহীম',
        textBn: 'যিনি পরম করুণাময় ও অসীম দয়ালু।'
      },
      {
        numberInSurah: 4,
        textAr: 'مَالِكِ يَوْمِ الدِّينِ',
        textBnTranslit: 'মালিকি ইয়াওমিদ্দীন',
        textBn: 'যিনি বিচার দিবসের অধিপতি ও বিচারক।'
      },
      {
        numberInSurah: 5,
        textAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        textBnTranslit: 'ইয়্যাক্কা না\'বুদু ওয়া ইয়্যাক্কা নাসতা\'ঈন',
        textBn: 'আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য প্রার্থনা করি।'
      },
      {
        numberInSurah: 6,
        textAr: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        textBnTranslit: 'ইহদিনাস সিরাতাল মুস্তাকীম',
        textBn: 'আমাদেরকে সরল-সঠিক পথ প্রদর্শন করো।'
      },
      {
        numberInSurah: 7,
        textAr: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        textBnTranslit: 'সিরাতাল্লাযীনা আনআমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়ালাদ্দাল্লীন',
        textBn: 'তাদের পথ, যাদের ওপর তুমি অনুগ্রহ বর্ষণ করেছ; তাদের পথ নয়, যারা অভিশপ্ত এবং পথভ্রষ্ট হয়েছে। আমীন।'
      }
    ]
  },
  108: {
    number: 108,
    nameAr: 'الكوثر',
    nameBn: 'আল-কাউসার',
    nameEn: 'Al-Kawthar',
    meaningBn: 'প্রচুর প্রাচুর্য',
    versesCount: 3,
    revelationType: 'মক্কী',
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        textBnTranslit: 'ইন্না আ\'তাইনা কাল কাউসার',
        textBn: 'নিশ্চয়ই আমি আপনাকে (হে নবী) কাউসার (অশেষ কল্যাণ ও জান্নাতের প্রস্রবণ) দান করেছি।'
      },
      {
        numberInSurah: 2,
        textAr: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        textBnTranslit: 'ফাসাল্লি লিরাব্বিকা ওয়ানহার',
        textBn: 'অতএব আপনি আপনার পালনকর্তার উদ্দেশ্যে সালাত আদায় করুন এবং কোরবানি করুন।'
      },
      {
        numberInSurah: 3,
        textAr: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        textBnTranslit: 'ইন্না শানিআকা হুয়াল আবতার',
        textBn: 'নিশ্চয়ই আপনার নিন্দুক ও শত্রুই তো নির্বংশ এবং শিকড়হীন।'
      }
    ]
  },
  112: {
    number: 112,
    nameAr: 'الإخلاص',
    nameBn: 'আল-ইখলাস',
    nameEn: 'Al-Ikhlas',
    meaningBn: 'একত্ববাদ',
    versesCount: 4,
    revelationType: 'মক্কী',
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        textBnTranslit: 'কুল হুওয়াল্লাহু আহাদ',
        textBn: 'বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।'
      },
      {
        numberInSurah: 2,
        textAr: 'اللَّهُ الصَّمَدُ',
        textBnTranslit: 'আল্লাহুস সামাদ',
        textBn: 'আল্লাহ অমুখাপেক্ষী, সবাই তাঁর মুখাপেক্ষী।'
      },
      {
        numberInSurah: 3,
        textAr: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        textBnTranslit: 'লাম ইয়ালিদ ওয়া লাম ইউলাদ',
        textBn: 'তিনি কাউকে জন্ম দেননি এবং তিনিও কারো থেকে জন্ম নেননি।'
      },
      {
        numberInSurah: 4,
        textAr: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        textBnTranslit: 'ওয়া লাম ইয়াকুল লাহু কুফুওয়ান আহাদ',
        textBn: 'এবং তাঁর সমকক্ষ কেউই নেই।'
      }
    ]
  },
  113: {
    number: 113,
    nameAr: 'الفلق',
    nameBn: 'আল-ফালাক',
    nameEn: 'Al-Falaq',
    meaningBn: 'ঊষা / প্রভাত',
    versesCount: 5,
    revelationType: 'মক্কী',
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        textBnTranslit: 'কুল আ\'উযু বিরাব্বিল ফালাক',
        textBn: 'বলুন, আমি আশ্রয় প্রার্থনা করছি প্রভাতের পালনকর্তার কাছে,'
      },
      {
        numberInSurah: 2,
        textAr: 'مِن شَرِّ مَا خَلَقَ',
        textBnTranslit: 'মিন শাররি মা খালাক',
        textBn: 'তিনি যা সৃষ্টি করেছেন তার অনিষ্ট হতে,'
      },
      {
        numberInSurah: 3,
        textAr: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        textBnTranslit: 'ওয়া মিন শাররি গাসিকিন ইযা ওয়াকাব',
        textBn: 'এবং অন্ধকার রাতের অনিষ্ট হতে যখন তা নিবিড় হয়,'
      },
      {
        numberInSurah: 4,
        textAr: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        textBnTranslit: 'ওয়া মিন শাররিন নাফ্ফাসাতি ফিল \'উকাদ',
        textBn: 'এবং গ্রন্থিতে ফুৎকার দিয়ে জাদুকারিনীদের অনিষ্ট হতে,'
      },
      {
        numberInSurah: 5,
        textAr: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        textBnTranslit: 'ওয়া মিন শাররি হাসিদিন ইযা হাসাদ',
        textBn: 'এবং হিংসুকের অনিষ্ট হতে যখন সে হিংসা করে।'
      }
    ]
  },
  114: {
    number: 114,
    nameAr: 'الناس',
    nameBn: 'আন-নাস',
    nameEn: 'An-Nas',
    meaningBn: 'মানবজাতি',
    versesCount: 6,
    revelationType: 'মক্কী',
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        textBnTranslit: 'কুল আ\'উযু বিরাব্বিন নাস',
        textBn: 'বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের পালনকর্তার কাছে,'
      },
      {
        numberInSurah: 2,
        textAr: 'مَلِكِ النَّاسِ',
        textBnTranslit: 'মালিকিন নাস',
        textBn: 'মানুষের অধিপতির কাছে,'
      },
      {
        numberInSurah: 3,
        textAr: 'إِلَٰهِ النَّاسِ',
        textBnTranslit: 'ইলাহিন নাস',
        textBn: 'মানুষের প্রকৃত উপাস্যের কাছে,'
      },
      {
        numberInSurah: 4,
        textAr: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        textBnTranslit: 'মিন শাররিল ওয়াসওয়াসিল খান্নাস',
        textBn: 'আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট হতে,'
      },
      {
        numberInSurah: 5,
        textAr: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        textBnTranslit: 'আল্লাযী ইউওয়াসউইসু ফী সুদূরিন নাস',
        textBn: 'যে মানুষের অন্তরে কুমন্ত্রণা দেয়,'
      },
      {
        numberInSurah: 6,
        textAr: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        textBnTranslit: 'মিনাল জিন্নাতি ওয়ান নাস',
        textBn: 'জিনদের মধ্য হতে এবং মানুষদের মধ্য হতে।'
      }
    ]
  }
};

/**
 * Fetch complete Surah Arabic and Bengali text from Islamic Network Al-Quran API
 */
export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const meta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];

  // Return fast offline version if available
  if (OFFLINE_SURAHS[surahNumber]) {
    return OFFLINE_SURAHS[surahNumber];
  }

  try {
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,bn.bengali`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      const arabicEd = data.data?.[0];
      const bengaliEd = data.data?.[1];

      if (arabicEd?.ayahs && bengaliEd?.ayahs) {
        const ayahs: Ayah[] = arabicEd.ayahs.map((ar: any, idx: number) => {
          const bn = bengaliEd.ayahs[idx];
          return {
            numberInSurah: ar.numberInSurah,
            textAr: ar.text,
            textBn: bn?.text || '',
            audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ar.number}.mp3`
          };
        });

        return {
          ...meta,
          bismillah: surahNumber !== 9,
          ayahs
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch live Quran for Surah ${surahNumber}:`, err);
  }

  // Graceful fallback with placeholder ayahs if network fails
  return {
    ...meta,
    bismillah: surahNumber !== 9,
    ayahs: [
      {
        numberInSurah: 1,
        textAr: meta.nameAr,
        textBn: `${meta.nameBn} - ${meta.meaningBn} (${meta.versesCount} আয়াত, ${meta.revelationType})। ইন্টারনেট সংযোগ থাকলে সম্পূর্ণ আয়াত লোড হবে।`
      }
    ]
  };
}
