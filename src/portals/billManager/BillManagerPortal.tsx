/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ALL_MONTHS,
  AREAS,
  getActiveSheetLink,
  I18N
} from './constants';
import {
  AreaFilter,
  BillLang,
  BillRecord,
  BillServiceType,
  BillView,
  ColorTheme,
  DuplicateEntry,
  MonthlyAggregates,
  TableFilter,
  ToastState
} from './types';
import {
  exportRecordsToExcel,
  fetchWithCorsFallback,
  getBillManagerLogoUrl,
  normalizeBengali,
  parseDateForSort,
  parseWorkbookBuffer
} from './utils';
import { PromoCarousel } from './PromoCarousel';
import { BillCharts } from './BillCharts';
import { safeStorage } from '../../utils/safeStorage';

interface BillManagerPortalProps {
  onExit: () => void;
}

const DEFAULT_AGGREGATES: MonthlyAggregates = {
  net: ALL_MONTHS.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m]: 0 }), {}),
  dis: ALL_MONTHS.reduce<Record<string, number>>((acc, m) => ({ ...acc, [m]: 0 }), {})
};

export const BillManagerPortal: React.FC<BillManagerPortalProps> = ({ onExit }) => {
  const realMonthIndex = new Date().getMonth();
  const initialMonth =
    safeStorage.getItem('selected_month') || ALL_MONTHS[realMonthIndex] || 'অক্টোবর';
  const initialNet =
    (safeStorage.getItem('selected_net') as BillServiceType) || 'নেট বিল';

  const [allRecords, setAllRecords] = useState<BillRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    message: string;
    tone: 'warning' | 'error';
  } | null>(null);

  const [currentNet, setCurrentNet] = useState<BillServiceType>(initialNet);
  const [currentMonth, setCurrentMonth] = useState<string>(initialMonth);
  const [currentView, setCurrentView] = useState<BillView>('dashboard');
  const [tableFilter, setTableFilter] = useState<TableFilter>('all');
  const [currentArea, setCurrentArea] = useState<AreaFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => safeStorage.getItem('bill_theme') === 'dark');
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (safeStorage.getItem('bill_color') as ColorTheme) || 'orange'
  );
  const [lang, setLang] = useState<BillLang>(
    () => (safeStorage.getItem('bill_lang') as BillLang) || 'bn'
  );

  const [monthlyAggregates, setMonthlyAggregates] = useState<MonthlyAggregates>(() => {
    try {
      const saved = safeStorage.getItem('bill_monthly_aggregates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.net && parsed.dis) return parsed;
      }
    } catch {}
    return DEFAULT_AGGREGATES;
  });

  const [selectedRecord, setSelectedRecord] = useState<BillRecord | null>(null);
  const [printRecord, setPrintRecord] = useState<BillRecord | null>(null);
  const [receiptNo, setReceiptNo] = useState('BM-10000');
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateEntry[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const trendSectionRef = useRef<HTMLDivElement | null>(null);
  const tableSectionRef = useRef<HTMLElement | null>(null);
  const portalLogoUrl = useMemo(() => getBillManagerLogoUrl(), []);
  const dict = I18N[lang];
  const isDisBill = currentNet === 'ডিস বিল';

  const showToast = useCallback(
    (message: string, type: ToastState['type'] = 'info') => {
      setToast({ id: Date.now(), message, type });
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setToast(null), 2800);
    },
    []
  );

  // Live state ref for hardware/browser Back button popstate handling
  const backStateRef = useRef({
    selectedRecord,
    isDuplicateModalOpen,
    isSidebarOpen,
    currentView
  });
  backStateRef.current = {
    selectedRecord,
    isDuplicateModalOpen,
    isSidebarOpen,
    currentView
  };

  // Initialize Bill Manager root history entry & wire LIFO device Back button
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.billManagerPortal) {
        window.history.replaceState(
          { appStep: 'bm-root', billManagerPortal: true, view: 'dashboard' },
          ''
        );
      }
    } catch {}

    const handlePopState = (e: PopStateEvent) => {
      const s = backStateRef.current;
      const hState = e.state || window.history.state || {};

      // Layer 1: Customer Details Modal
      if (s.selectedRecord) {
        setSelectedRecord(null);
        return;
      }
      // Layer 2: Duplicate Check Modal
      if (s.isDuplicateModalOpen) {
        setIsDuplicateModalOpen(false);
        return;
      }
      // Layer 3: Mobile Sidebar Drawer
      if (s.isSidebarOpen) {
        setIsSidebarOpen(false);
        return;
      }
      // Layer 4: Unwind sub-view (table tabs back to dashboard)
      if (hState && hState.billManagerPortal) {
        const targetView: BillView = hState.view || 'dashboard';
        setCurrentView(targetView);
        if (targetView !== 'dashboard') {
          setTableFilter(targetView);
        }
        return;
      }
      // Layer 5: Popped past bm-root -> App.tsx closes activePortal, or call onExit fallback
      onExit();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onExit]);

  const navigateTo = useCallback(
    (view: BillView) => {
      const wasSidebarOpen = isSidebarOpen;
      setIsSidebarOpen(false);

      if (view !== currentView) {
        try {
          if (wasSidebarOpen && window.history.state?.appStep === 'bm-overlay') {
            window.history.replaceState(
              { appStep: `bm-view-${view}`, billManagerPortal: true, view },
              ''
            );
          } else {
            window.history.pushState(
              { appStep: `bm-view-${view}`, billManagerPortal: true, view },
              ''
            );
          }
        } catch {}
      } else if (wasSidebarOpen && window.history.state?.appStep === 'bm-overlay') {
        try {
          window.history.back();
        } catch {}
      }

      setCurrentView(view);
      if (view !== 'dashboard') {
        setTableFilter(view);
      }
    },
    [currentView, isSidebarOpen]
  );

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
    try {
      if (window.history.state?.appStep !== 'bm-overlay') {
        window.history.pushState(
          {
            appStep: 'bm-overlay',
            overlayType: 'sidebar',
            billManagerPortal: true,
            view: backStateRef.current.currentView
          },
          ''
        );
      }
    } catch {}
  }, []);

  const closeSidebar = useCallback(() => {
    if (window.history.state?.appStep === 'bm-overlay' && window.history.state?.overlayType === 'sidebar') {
      try {
        window.history.back();
        return;
      } catch {}
    }
    setIsSidebarOpen(false);
  }, []);

  const openCustomerDetail = useCallback((rec: BillRecord) => {
    setSelectedRecord(rec);
    try {
      if (window.history.state?.appStep !== 'bm-overlay') {
        window.history.pushState(
          {
            appStep: 'bm-overlay',
            overlayType: 'customer',
            billManagerPortal: true,
            view: backStateRef.current.currentView
          },
          ''
        );
      }
    } catch {}
  }, []);

  const closeCustomerModal = useCallback(() => {
    if (window.history.state?.appStep === 'bm-overlay' && window.history.state?.overlayType === 'customer') {
      try {
        window.history.back();
        return;
      } catch {}
    }
    setSelectedRecord(null);
  }, []);

  const closeDuplicateModal = useCallback(() => {
    if (window.history.state?.appStep === 'bm-overlay' && window.history.state?.overlayType === 'duplicate') {
      try {
        window.history.back();
        return;
      } catch {}
    }
    setIsDuplicateModalOpen(false);
  }, []);

  // Load current sheet data
  const loadData = useCallback(
    async (netType: BillServiceType, month: string, notifySuccess = true) => {
      const url = getActiveSheetLink(netType, month);
      const cacheKey = `bill_v4_${netType}_${month}`;
      const isOnline = typeof navigator.onLine === 'boolean' ? navigator.onLine : true;

      if (!url) {
        setStatusNotice({
          tone: 'warning',
          message: `⚠️ ${netType} - ${month} মাসের জন্য কোনো অনলাইন শিট লিংক নেই।`
        });
        setAllRecords([]);
        setIsLoading(false);
        return;
      }

      if (!isOnline) {
        const cached = safeStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as BillRecord[];
            setAllRecords(parsed);
            setStatusNotice(null);
            setIsLoading(false);
            return;
          } catch {}
        }
        setStatusNotice({
          tone: 'error',
          message: '⚠️ ইন্টারনেট সংযোগ নেই এবং সংরক্ষিত ডেটা পাওয়া যায়নি।'
        });
        setAllRecords([]);
        setIsLoading(false);
        return;
      }

      setAllRecords([]);
      setIsLoading(true);
      setStatusNotice(null);

      try {
        const buffer = await fetchWithCorsFallback(url);
        if (!buffer) {
          throw new Error('Empty data received');
        }
        const recs = parseWorkbookBuffer(buffer, netType);
        safeStorage.setItem(cacheKey, JSON.stringify(recs));
        setAllRecords(recs);
        setStatusNotice(null);

        const sumPay = recs.reduce((s, r) => s + (r.pay || 0), 0);
        if (netType === 'নেট বিল' || netType === 'ডিস বিল') {
          setMonthlyAggregates((prev) => {
            const next: MonthlyAggregates = {
              net: { ...prev.net },
              dis: { ...prev.dis }
            };
            if (netType === 'নেট বিল') next.net[month] = sumPay;
            else next.dis[month] = sumPay;
            safeStorage.setItem('bill_monthly_aggregates', JSON.stringify(next));
            return next;
          });
        }

        if (notifySuccess) {
          showToast(`✅ ${netType} (${month}) এর ${recs.length} টি তথ্য লোড হয়েছে`, 'success');
        }
      } catch (err) {
        console.warn('[BillManager] Live fetch failed, trying cache:', err);
        const cached = safeStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as BillRecord[];
            setAllRecords(parsed);
            setStatusNotice({
              tone: 'warning',
              message: `⚠️ লাইভ সার্ভার সংযোগ পেতে সমস্যা হয়েছে — সংরক্ষিত ক্যাশ ডেটা দেখানো হচ্ছে (${parsed.length} টি বিল)।`
            });
            setIsLoading(false);
            return;
          } catch {}
        }
        setStatusNotice({
          tone: 'error',
          message: `❌ ${netType} (${month}) এর ডেটা লোড করা সম্ভব হয়নি। ইন্টারনেট সংযোগ বা শিট লিংক পরীক্ষা করুন।`
        });
        setAllRecords([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  // Fetch current view whenever service or month changes
  useEffect(() => {
    void loadData(currentNet, currentMonth, true);
  }, [currentNet, currentMonth, loadData]);

  // Background preloader for annual monthly revenue bar chart
  useEffect(() => {
    let cancelled = false;
    const preload = async () => {
      const monthsToFetch = [
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর'
      ];
      const nextAgg: MonthlyAggregates = {
        net: { ...monthlyAggregates.net },
        dis: { ...monthlyAggregates.dis }
      };
      let changed = false;

      for (const m of monthsToFetch) {
        if (cancelled) return;
        const netUrl = getActiveSheetLink('নেট বিল', m);
        if (netUrl && !nextAgg.net[m]) {
          try {
            const buffer = await fetchWithCorsFallback(netUrl);
            if (buffer && !cancelled) {
              const recs = parseWorkbookBuffer(buffer, 'নেট বিল');
              nextAgg.net[m] = recs.reduce((s, r) => s + (r.pay || 0), 0);
              safeStorage.setItem(`bill_v4_নেট বিল_${m}`, JSON.stringify(recs));
              changed = true;
            }
          } catch {}
        }
        const disUrl = getActiveSheetLink('ডিস বিল', m);
        if (disUrl && !nextAgg.dis[m]) {
          try {
            const buffer = await fetchWithCorsFallback(disUrl);
            if (buffer && !cancelled) {
              const recs = parseWorkbookBuffer(buffer, 'ডিস বিল');
              nextAgg.dis[m] = recs.reduce((s, r) => s + (r.pay || 0), 0);
              safeStorage.setItem(`bill_v4_ডিস বিল_${m}`, JSON.stringify(recs));
              changed = true;
            }
          } catch {}
        }
      }

      if (changed && !cancelled) {
        safeStorage.setItem('bill_monthly_aggregates', JSON.stringify(nextAgg));
        setMonthlyAggregates(nextAgg);
      }
    };

    void preload();
    return () => {
      cancelled = true;
    };
    // Run once on portal launch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Online / Offline listeners
  useEffect(() => {
    const onOnline = () => {
      showToast('🟢 ইন্টারনেট সংযোগ সক্রিয় হয়েছে — লাইভ ডেটা লোড হচ্ছে', 'info');
      void loadData(currentNet, currentMonth, false);
    };
    const onOffline = () => {
      showToast('🔴 ইন্টারনেট সংযোগ বিচ্ছিন্ন হয়েছে — অফলাইন মোড চালু', 'warning');
      void loadData(currentNet, currentMonth, false);
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [currentMonth, currentNet, loadData, showToast]);

  // Derived stats
  const stats = useMemo(() => {
    const count = allRecords.length;
    const totalPay = allRecords.reduce((s, r) => s + (r.pay || 0), 0);
    const totalDue = allRecords.reduce((s, r) => s + (r.due || 0), 0);
    const grandTotal = totalPay + totalDue;
    const paidRate = count > 0 ? Math.round((totalPay / (grandTotal || 1)) * 100) : 0;
    const dueRate = count > 0 ? Math.round((totalDue / (grandTotal || 1)) * 100) : 0;
    return { count, totalPay, totalDue, grandTotal, paidRate, dueRate };
  }, [allRecords]);

  // Recent Activity (top 6 paid newest-first)
  const { recentList, recentTotalCount } = useMemo(() => {
    const paidList = allRecords.filter((r) => (r.pay || 0) > 0);
    paidList.sort((a, b) => {
      const da = parseDateForSort(a.date);
      const db = parseDateForSort(b.date);
      if (da && db) return db.getTime() - da.getTime();
      return 0;
    });
    const list = paidList.length > 0 ? paidList.slice(0, 6) : allRecords.slice(0, 6);
    const totalCount = paidList.length > 0 ? paidList.length : allRecords.length;
    return { recentList: list, recentTotalCount: totalCount };
  }, [allRecords]);

  // Filtered table rows
  const filteredRecords = useMemo(() => {
    let list = allRecords.slice();
    if (tableFilter === 'paid') list = list.filter((r) => r.due === 0);
    else if (tableFilter === 'due') list = list.filter((r) => r.due > 0);

    if (currentArea !== 'all') {
      const villages = AREAS[currentArea].map((v) => normalizeBengali(v));
      list = list.filter((r) => {
        if (!r.address) return false;
        const normalizedAddr = normalizeBengali(r.address);
        return villages.some((v) => normalizedAddr.includes(v));
      });
    }

    if (searchQuery.trim()) {
      const q = normalizeBengali(searchQuery);
      const rawQ = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          (r.name && normalizeBengali(r.name).includes(q)) ||
          (r.mob && r.mob.includes(searchQuery.trim())) ||
          (!isDisBill && r.id && r.id.toLowerCase().includes(rawQ)) ||
          (r.address && normalizeBengali(r.address).includes(q))
      );
    }

    return list;
  }, [allRecords, currentArea, isDisBill, searchQuery, tableFilter]);

  const handleNetChange = (nextNet: BillServiceType) => {
    safeStorage.setItem('selected_net', nextNet);
    setSearchQuery('');
    setCurrentNet(nextNet);
  };

  const handleMonthChange = (nextMonth: string) => {
    safeStorage.setItem('selected_month', nextMonth);
    setSearchQuery('');
    setCurrentMonth(nextMonth);
  };

  const handleToggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    safeStorage.setItem('bill_theme', next ? 'dark' : 'light');
  };

  const handleColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    safeStorage.setItem('bill_color', theme);
  };

  const handleToggleLang = () => {
    const next: BillLang = lang === 'bn' ? 'en' : 'bn';
    setLang(next);
    safeStorage.setItem('bill_lang', next);
    showToast(
      next === 'bn' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language set to English',
      'info'
    );
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    showToast(
      lang === 'bn' ? '🔄 ডেটা রিফ্রেশ করা হচ্ছে...' : '🔄 Refreshing data...',
      'info'
    );
    await loadData(currentNet, currentMonth, true);
    window.setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExport = () => {
    if (!allRecords.length) {
      showToast('এক্সপোর্ট করার মতো কোনো ডেটা নেই', 'warning');
      return;
    }
    exportRecordsToExcel(allRecords, currentNet, currentMonth);
    showToast('📥 এক্সেল ফাইল ডাউনলোড সম্পন্ন হয়েছে', 'success');
  };

  const handleCheckDuplicates = () => {
    if (!allRecords.length) {
      showToast('⚠️ চেক করার জন্য কোনো তথ্য নেই', 'warning');
      return;
    }
    const found: DuplicateEntry[] = [];
    const mobileMap = new Map<string, BillRecord>();
    const nameIdMap = new Map<string, BillRecord>();

    allRecords.forEach((rec) => {
      if (rec.mob && rec.mob !== '---' && rec.mob.length > 5) {
        const existing = mobileMap.get(rec.mob);
        if (existing) {
          found.push({ type: 'MOBILE', record: rec, original: existing });
        } else {
          mobileMap.set(rec.mob, rec);
        }
      }
      const nameIdKey = `${normalizeBengali(rec.name)}_${normalizeBengali(rec.id || '')}`;
      if (rec.name && rec.name !== 'নাম নেই') {
        const existing = nameIdMap.get(nameIdKey);
        if (existing) {
          found.push({ type: 'NAME_ID', record: rec, original: existing });
        } else {
          nameIdMap.set(nameIdKey, rec);
        }
      }
    });

    setDuplicates(found);
    setIsDuplicateModalOpen(true);
    try {
      if (window.history.state?.appStep !== 'bm-overlay') {
        window.history.pushState(
          {
            appStep: 'bm-overlay',
            overlayType: 'duplicate',
            billManagerPortal: true,
            view: currentView
          },
          ''
        );
      }
    } catch {}
  };

  const handleCopyText = (txt: string) => {
    try {
      void navigator.clipboard.writeText(txt);
    } catch {}
    showToast('📋 ক্লিপবোর্ডে কপি হয়েছে', 'success');
  };

  const handleSendDueSms = () => {
    if (!selectedRecord) return;
    const r = selectedRecord;
    const cleanPhone = (r.mob || '').replace(/[^0-9+]/g, '');
    const smsText = `প্রিয় গ্রাহক ${r.name}, আপনার ${currentNet} বাবদ বকেয়া ${r.due.toLocaleString()} টাকা দ্রুত পরিশোধ করার জন্য বিনীত অনুরোধ করা হচ্ছে। ধন্যবাদ - বিল ম্যানেজার।`;
    try {
      void navigator.clipboard.writeText(smsText);
    } catch {}
    if (cleanPhone && cleanPhone.length >= 8) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const separator = isIOS ? '&' : '?';
      window.location.href = `sms:${cleanPhone}${separator}body=${encodeURIComponent(smsText)}`;
      showToast('📱 এসএমএস সফটওয়্যার ওপেন হয়েছে ও টেক্সট কপি হয়েছে', 'success');
    } else {
      showToast('📋 এসএমএস টেক্সট কপি হয়েছে (সঠিক মোবাইল নম্বর নেই)', 'warning');
    }
  };

  const handlePrintReceipt = () => {
    const r = selectedRecord || (allRecords.length > 0 ? allRecords[0] : null);
    if (!r) {
      showToast('প্রিন্ট করার মতো গ্রাহকের তথ্য নেই', 'warning');
      return;
    }
    setReceiptNo('BM-' + Math.floor(10000 + Math.random() * 90000));
    setPrintRecord(r);
    window.setTimeout(() => {
      window.print();
    }, 60);
  };

  const handlePromoAction = (action: 'due' | 'all' | 'trend') => {
    if (action === 'due') {
      navigateTo('due');
      window.setTimeout(() => {
        tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      showToast('📋 বকেয়া বিল তালিকা ফিল্টার করা হয়েছে', 'info');
    } else if (action === 'all') {
      navigateTo('all');
      window.setTimeout(() => {
        tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      showToast('📊 সকল গ্রাহকের বিল তালিকা প্রদর্শিত হচ্ছে', 'info');
    } else {
      navigateTo('dashboard');
      window.setTimeout(() => {
        trendSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
      showToast('📈 কালেকশন ট্রেন্ড অ্যানালাইসিস', 'info');
    }
  };

  const portalClass = [
    'bill-manager-portal',
    isDark ? 'dark' : '',
    colorTheme !== 'orange' ? `theme-${colorTheme}` : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={portalClass}>
      {/* Sidebar Overlay */}
      <div
        className={`bm-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`bm-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="bm-sidebar-top-bar">
          <div
            className="bm-sidebar-logo"
            onClick={() => navigateTo('dashboard')}
            title="বিল ম্যানেজার হোম"
          >
            <div className="bm-sidebar-logo-icon">
              <img
                src={portalLogoUrl}
                alt="Logo"
                style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div className="bm-sidebar-logo-text">
              <strong>বিল ম্যানেজার</strong>
              <span>PRO SYSTEM</span>
            </div>
          </div>
          <button
            type="button"
            className="bm-sidebar-close-btn"
            onClick={closeSidebar}
            title="বন্ধ করুন"
          >
            ✕
          </button>
        </div>

        <div className="bm-sidebar-divider" />

        <nav className="bm-sidebar-nav">
          <button
            type="button"
            className={`bm-sidebar-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect width="7" height="9" x="3" y="3" rx="1.5" />
              <rect width="7" height="5" x="14" y="3" rx="1.5" />
              <rect width="7" height="9" x="14" y="12" rx="1.5" />
              <rect width="7" height="5" x="3" y="16" rx="1.5" />
            </svg>
            <span className="bm-side-label">{dict.dashboard}</span>
          </button>

          <button
            type="button"
            className={`bm-sidebar-item ${currentView === 'all' ? 'active' : ''}`}
            onClick={() => navigateTo('all')}
          >
            <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
              <path d="M8 7h8" />
              <path d="M8 11h8" />
              <path d="M8 15h5" />
            </svg>
            <span className="bm-side-label">{dict.allBills}</span>
          </button>

          <button
            type="button"
            className={`bm-sidebar-item ${currentView === 'paid' ? 'active' : ''}`}
            onClick={() => navigateTo('paid')}
          >
            <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="bm-side-label">{dict.paidBills}</span>
          </button>

          <button
            type="button"
            className={`bm-sidebar-item ${currentView === 'due' ? 'active' : ''}`}
            onClick={() => navigateTo('due')}
          >
            <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <span className="bm-side-label">{dict.dueBills}</span>
          </button>
        </nav>

        <div className="bm-sidebar-bottom">
          <div className="bm-theme-selector">
            {(['orange', 'blue', 'green', 'purple', 'pink', 'teal'] as ColorTheme[]).map((t) => (
              <span
                key={t}
                className={`bm-theme-dot ${t} ${colorTheme === t ? 'active' : ''}`}
                onClick={() => handleColorTheme(t)}
                title={t}
              />
            ))}
          </div>
          <div className="bm-sidebar-developer">
            Dev: <strong>Md Riad Mia</strong>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bm-main-content">
        {/* Top Sticky Header */}
        <header className="bm-top-header">
          <div className="bm-header-top-row">
            <div className="bm-header-left">
              <button
                type="button"
                className="bm-mobile-toggle"
                onClick={openSidebar}
                aria-label="Menu"
              >
                ☰
              </button>
              <div className="bm-header-title">
                <h1>
                  <span>{dict.headerTitle}</span>
                  <span className="bm-badge-new">PRO</span>
                </h1>
                <p>{dict.headerSubtitle}</p>
              </div>
            </div>

            <div className="bm-header-top-right">
              <button
                type="button"
                className="bm-header-btn"
                onClick={handleToggleLang}
                title="ভাষা পরিবর্তন"
              >
                <svg
                  style={{ width: 14, height: 14 }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" x2="22" y1="12" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{dict.langToggle}</span>
              </button>
              <button
                type="button"
                className="bm-header-btn"
                onClick={handleToggleDark}
                title="ডার্ক / লাইট মোড"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          <div className="bm-header-controls-row">
            <div className="bm-header-btn bm-header-select-net">
              <svg
                style={{ width: 14, height: 14, flexShrink: 0 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <select
                value={currentNet}
                onChange={(e) => handleNetChange(e.target.value as BillServiceType)}
                aria-label="Select Bill Service"
              >
                <option value="নেট বিল">নেট বিল (Net Bill)</option>
                <option value="ডিস বিল">ডিস বিল (Dis Bill)</option>
                <option value="নেট সংযোগ">নেট সংযোগ (Connection)</option>
                <option value="বকেয়া বিল">বকেয়া বিল (Due Bill)</option>
              </select>
            </div>

            <div className="bm-header-btn bm-header-select-month">
              <svg
                style={{ width: 14, height: 14, flexShrink: 0 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <select
                value={currentMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                aria-label="Select Month"
              >
                {ALL_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="bm-header-btn bm-header-btn-export bm-desktop-only-btn"
              onClick={handleExport}
              title="এক্সেল ডাউনলোড"
            >
              <svg
                style={{ width: 14, height: 14, flexShrink: 0 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>{dict.export}</span>
            </button>

            <button
              type="button"
              className="bm-header-btn bm-desktop-only-btn"
              onClick={handleCheckDuplicates}
              title="ডুপ্লিকেট এন্ট্রি চেক"
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                borderColor: '#fca5a5'
              }}
            >
              <svg
                style={{ width: 14, height: 14 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              <span style={{ fontWeight: 700 }}>ডুপ্লিকেট চেক</span>
            </button>

            <button
              type="button"
              className="bm-header-btn bm-header-btn-refresh bm-mobile-only-btn"
              onClick={handleManualRefresh}
              title="রিফ্রেশ করুন"
            >
              <svg
                style={{
                  width: 14,
                  height: 14,
                  flexShrink: 0,
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)'
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>{dict.refresh}</span>
            </button>
          </div>
        </header>

        {/* Notice Ticker */}
        <div className="bm-notice-ticker">
          <div className="bm-notice-badge">{dict.noticeBadge}</div>
          <div className="bm-notice-scroll">
            <div className="bm-notice-marquee-track">
              {[0, 1].map((dupIdx) => (
                <div key={dupIdx} className="bm-notice-marquee">
                  ⚡ <strong>বকেয়া বিল আদায় করুন</strong> ➤ সম্মানিত সকলের অবগতির জন্য
                  জানানো যাচ্ছে যে, নিয়মিত বিলের তথ্য আপডেট করা হয়। বিল জমা দেওয়ার পরে চেক
                  করুন, আপনার জমা দেওয়া বিল এন্ট্রি সঠিকভাবে হয়েছে কিনা কিংবা কোনো ভুল বা
                  এন্ট্রি না হলে দ্রুত আমাদের অবহিত করুন। যোগাযোগ: 📞 01777-877207{' '}
                  <span className="bm-highlight">🔴 আমাদের সাথে থাকার জন্য ধন্যবাদ।</span>{' '}
                  &nbsp;|&nbsp; 📌 সতর্কতা: সময়মতো আদায়কৃত বিল জমা দিন
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Notice Box */}
        {statusNotice && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 14,
              fontSize: 12,
              fontWeight: 600,
              background: statusNotice.tone === 'error' ? '#fee2e2' : '#fef3c7',
              color: statusNotice.tone === 'error' ? '#991b1b' : '#92400e'
            }}
          >
            {statusNotice.message}
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <section>
            <div className="bm-stats-grid">
              <div className="bm-stat-card" onClick={() => navigateTo('all')}>
                <div className="bm-stat-icon-wrap orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                    <path d="M8 7h8" />
                    <path d="M8 11h8" />
                  </svg>
                </div>
                <div className="bm-stat-label">{dict.allBills}</div>
                <div className="bm-stat-value">{stats.count}</div>
                <div className="bm-stat-sub">{currentMonth} মাস</div>
              </div>

              <div className="bm-stat-card" onClick={() => navigateTo('paid')}>
                <div className="bm-stat-icon-wrap green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="bm-stat-label">{dict.paidAmount}</div>
                <div className="bm-stat-value">{stats.totalPay.toLocaleString()} ৳</div>
                <div className="bm-stat-sub">{stats.paidRate}% আদায়</div>
              </div>

              <div className="bm-stat-card" onClick={() => navigateTo('due')}>
                <div className="bm-stat-icon-wrap red">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" x2="12" y1="9" y2="13" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                  </svg>
                </div>
                <div className="bm-stat-label">{dict.dueAmount}</div>
                <div className="bm-stat-value">{stats.totalDue.toLocaleString()} ৳</div>
                <div className="bm-stat-sub">{stats.dueRate}% বাকি</div>
              </div>

              <div className="bm-stat-card" onClick={() => navigateTo('all')}>
                <div className="bm-stat-icon-wrap blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 6v12" />
                  </svg>
                </div>
                <div className="bm-stat-label">{dict.totalBills}</div>
                <div className="bm-stat-value">{stats.grandTotal.toLocaleString()} ৳</div>
                <div className="bm-stat-sub">{stats.count} টি বিল</div>
              </div>
            </div>

            <PromoCarousel onSelectAction={handlePromoAction} />

            <div ref={trendSectionRef}>
              <BillCharts
                allRecords={allRecords}
                monthlyAggregates={monthlyAggregates}
                lang={lang}
                colorTheme={colorTheme}
                isDark={isDark}
              />
            </div>

            {/* Recent Activity */}
            <div className="bm-chart-card">
              <div className="bm-chart-header">
                <div>
                  <div className="bm-chart-title">{dict.recentTx}</div>
                  <div className="bm-chart-sub">{dict.recentTxSub}</div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    background: 'var(--bm-bg-input)',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontWeight: 700
                  }}
                >
                  {recentTotalCount} {dict.records}
                </span>
              </div>

              {recentList.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 20,
                    color: 'var(--bm-text-muted)'
                  }}
                >
                  {isLoading
                    ? `⏳ ${currentNet} (${currentMonth}) এর ডেটা লোড হচ্ছে...`
                    : 'কোনো লেনদেন রেকর্ড নেই'}
                </div>
              ) : (
                <div>
                  {recentList.map((r, idx) => {
                    const isPaid = r.due === 0;
                    const statusClass = isPaid ? 'paid' : r.pay > 0 ? 'partial' : 'due';
                    const statusText =
                      r.status || (isPaid ? 'পরিশোধিত' : r.pay > 0 ? 'আংশিক' : 'বকেয়া');

                    return (
                      <div
                        key={`${r.id || r.name}-${idx}`}
                        onClick={() => openCustomerDetail(r)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 8px',
                          borderBottom: '1px solid var(--bm-border-color)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: 'var(--bm-primary-soft)',
                              color: 'var(--bm-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 13,
                              flexShrink: 0
                            }}
                          >
                            {r.name ? r.name.charAt(0) : '?'}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: 'var(--bm-text-primary)'
                              }}
                            >
                              {r.name}
                              {!isDisBill && r.id && r.id !== '-----' && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: 'var(--bm-text-muted)',
                                    fontWeight: 'normal',
                                    marginLeft: 4
                                  }}
                                >
                                  ({r.id})
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--bm-text-muted)' }}>
                              {r.mob || '---'} •{' '}
                              {r.date && r.date !== '-' ? r.date : currentMonth}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#10b981' }}>
                            +{(r.pay || 0).toLocaleString()} ৳
                          </div>
                          {r.due > 0 ? (
                            <div
                              style={{
                                fontSize: 11,
                                color: '#ef4444',
                                fontWeight: 600,
                                marginTop: 2
                              }}
                            >
                              বকেয়া: {r.due.toLocaleString()} ৳
                            </div>
                          ) : (
                            <div
                              style={{
                                fontSize: 11,
                                color: '#10b981',
                                fontWeight: 600,
                                marginTop: 2
                              }}
                            >
                              বকেয়া নেই
                            </div>
                          )}
                          <span
                            className={`bm-badge-status ${statusClass}`}
                            style={{ marginTop: 2 }}
                          >
                            {statusText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VIEW: TABLE & SEARCH */}
        {currentView !== 'dashboard' && (
          <section ref={tableSectionRef}>
            <div className="bm-search-container">
              <div className="bm-search-input-wrap">
                <svg
                  className="bm-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="bm-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.searchPlaceholder}
                />
              </div>

              <div className="bm-filter-action-row">
                <div className="bm-filter-tabs">
                  <button
                    type="button"
                    className={`bm-filter-tab ${tableFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setTableFilter('all')}
                  >
                    {dict.tabAll}
                  </button>
                  <button
                    type="button"
                    className={`bm-filter-tab ${tableFilter === 'paid' ? 'active' : ''}`}
                    onClick={() => setTableFilter('paid')}
                  >
                    {dict.tabPaid}
                  </button>
                  <button
                    type="button"
                    className={`bm-filter-tab ${tableFilter === 'due' ? 'active' : ''}`}
                    onClick={() => setTableFilter('due')}
                  >
                    {dict.tabDue}
                  </button>
                </div>

                <select
                  className="bm-area-filter-select"
                  value={currentArea}
                  onChange={(e) => setCurrentArea(e.target.value as AreaFilter)}
                  aria-label="Filter Area"
                >
                  <option value="all">সকল এরিয়া</option>
                  <option value="area1">এরিয়া ১</option>
                  <option value="area2">এরিয়া ২</option>
                </select>
              </div>
            </div>

            <div className="bm-table-wrapper">
              <table className="bm-bill-table">
                <thead>
                  <tr>
                    <th>{dict.thSl}</th>
                    {!isDisBill && <th>{dict.thId}</th>}
                    <th>{dict.thName}</th>
                    <th>{dict.thPaid}</th>
                    <th>{dict.thDue}</th>
                    <th>{dict.thTotal}</th>
                    <th>{dict.thMobile}</th>
                    <th>{dict.thDate}</th>
                    <th>{dict.thAddress}</th>
                    <th>{dict.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={isDisBill ? 9 : 10} style={{ padding: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '36px 16px',
                            gap: 12
                          }}
                        >
                          <div className="bm-loading-spinner" />
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: 'var(--bm-text-primary)'
                            }}
                          >
                            ⏳ {currentNet} ({currentMonth}) এর লাইভ ডেটা লোড হচ্ছে...
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isDisBill ? 9 : 10}
                        style={{
                          padding: 28,
                          textAlign: 'center',
                          color: 'var(--bm-text-muted)'
                        }}
                      >
                        কোনো বিলের তথ্য পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r, idx) => {
                      const isPaid = r.due === 0;
                      const statusClass = isPaid ? 'paid' : r.pay > 0 ? 'partial' : 'due';
                      const statusText =
                        r.status || (isPaid ? 'পরিশোধিত' : r.pay > 0 ? 'আংশিক' : 'বকেয়া');

                      return (
                        <tr
                          key={`${r.id || r.name}-${idx}`}
                          onClick={() => openCustomerDetail(r)}
                        >
                          <td>{idx + 1}</td>
                          {!isDisBill && <td>{r.id || '---'}</td>}
                          <td className="name-cell">{r.name}</td>
                          <td className="amount-paid">{r.pay.toLocaleString()} ৳</td>
                          <td className={r.due > 0 ? 'amount-due' : 'amount-zero'}>
                            {r.due > 0 ? `${r.due.toLocaleString()} ৳` : '0 ৳'}
                          </td>
                          <td className={`amount-total ${r.due > 0 ? 'has-due' : ''}`}>
                            {(r.pay + r.due).toLocaleString()} ৳
                          </td>
                          <td>{r.mob}</td>
                          <td>{r.date}</td>
                          <td>{r.address.substring(0, 30)}</td>
                          <td>
                            <span className={`bm-badge-status ${statusClass}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="bm-bottom-nav">
        <button
          type="button"
          className={`bm-nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          <span>{dict.dashboard}</span>
        </button>

        <button
          type="button"
          className={`bm-nav-btn ${currentView !== 'dashboard' && tableFilter === 'all' ? 'active' : ''}`}
          onClick={() => navigateTo('all')}
        >
          <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
          </svg>
          <span>{dict.tabAll}</span>
        </button>

        <button
          type="button"
          className={`bm-nav-btn ${currentView !== 'dashboard' && tableFilter === 'paid' ? 'active' : ''}`}
          onClick={() => navigateTo('paid')}
        >
          <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{dict.tabPaid}</span>
        </button>

        <button
          type="button"
          className={`bm-nav-btn ${currentView !== 'dashboard' && tableFilter === 'due' ? 'active' : ''}`}
          onClick={() => navigateTo('due')}
        >
          <svg className="bm-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          </svg>
          <span>{dict.tabDue}</span>
        </button>
      </nav>

      {/* Customer Details Modal */}
      {selectedRecord && (
        <div
          className="bm-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCustomerModal();
          }}
        >
          <div className="bm-modal-content">
            <div className="bm-modal-header">
              <span>{dict.modalHeader}</span>
              <button
                type="button"
                onClick={closeCustomerModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  cursor: 'pointer',
                  color: 'var(--bm-text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">গ্রাহকের নাম:</div>
                <div className="bm-detail-value">
                  <strong>{selectedRecord.name}</strong>
                </div>
              </div>
              {selectedRecord.id && (
                <div className="bm-detail-row">
                  <div className="bm-detail-label">আইডি:</div>
                  <div className="bm-detail-value">
                    <span>{selectedRecord.id}</span>
                    <button
                      type="button"
                      className="bm-copy-pill"
                      onClick={() => handleCopyText(selectedRecord.id || '')}
                    >
                      কপি
                    </button>
                  </div>
                </div>
              )}
              <div className="bm-detail-row">
                <div className="bm-detail-label">মোবাইল:</div>
                <div className="bm-detail-value">
                  <span>{selectedRecord.mob}</span>
                  <button
                    type="button"
                    className="bm-copy-pill"
                    onClick={() => handleCopyText(selectedRecord.mob)}
                  >
                    কপি
                  </button>
                </div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">পরিশোধিত:</div>
                <div className="bm-detail-value">
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    {selectedRecord.pay.toLocaleString()} ৳
                  </span>
                </div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">বকেয়া টাকা:</div>
                <div className="bm-detail-value">
                  {selectedRecord.due > 0 ? (
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>
                      {selectedRecord.due.toLocaleString()} ৳
                    </span>
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>
                      ০ ৳ (কোনো বকেয়া নেই)
                    </span>
                  )}
                </div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">সর্বমোট:</div>
                <div className="bm-detail-value">
                  <span
                    style={{
                      color:
                        selectedRecord.due > 0 ? '#ef4444' : 'var(--bm-primary)',
                      fontWeight: 700
                    }}
                  >
                    {(selectedRecord.pay + selectedRecord.due).toLocaleString()} ৳
                  </span>
                </div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">তারিখ:</div>
                <div className="bm-detail-value">{selectedRecord.date}</div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">ঠিকানা:</div>
                <div className="bm-detail-value">{selectedRecord.address}</div>
              </div>
              <div className="bm-detail-row">
                <div className="bm-detail-label">স্ট্যাটাস:</div>
                <div className="bm-detail-value">
                  <span
                    className={`bm-badge-status ${
                      selectedRecord.due === 0
                        ? 'paid'
                        : selectedRecord.pay > 0
                        ? 'partial'
                        : 'due'
                    }`}
                  >
                    {selectedRecord.status ||
                      (selectedRecord.due === 0
                        ? 'পরিশোধিত'
                        : selectedRecord.pay > 0
                        ? 'আংশিক'
                        : 'বকেয়া')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bm-modal-btn-row">
              <button
                type="button"
                className="bm-modal-btn secondary"
                onClick={handlePrintReceipt}
              >
                {dict.btnPrint}
              </button>
              <button
                type="button"
                className="bm-modal-btn primary"
                onClick={closeCustomerModal}
              >
                {dict.btnClose}
              </button>
              <button
                type="button"
                className="bm-modal-btn whatsapp"
                onClick={handleSendDueSms}
              >
                {dict.btnSms}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Entry Check Modal */}
      {isDuplicateModalOpen && (
        <div
          className="bm-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDuplicateModal();
          }}
        >
          <div className="bm-modal-content" style={{ maxWidth: 500 }}>
            <div className="bm-modal-header">
              <span>🔍 ডুপ্লিকেট এন্ট্রি চেক</span>
              <button
                type="button"
                onClick={closeDuplicateModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  cursor: 'pointer',
                  color: 'var(--bm-text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 5 }}>
              {duplicates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: 40, marginBottom: 15 }}>✅</div>
                  <div style={{ fontWeight: 700, color: 'var(--bm-text-primary)' }}>
                    অভিনন্দন! কোনো ডুপ্লিকেট এন্ট্রি পাওয়া যায়নি।
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--bm-text-muted)',
                      marginTop: 5
                    }}
                  >
                    আপনার সকল ডেটা ইউনিক বা একক।
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      marginBottom: 15,
                      fontSize: 12,
                      color: 'var(--bm-text-muted)'
                    }}
                  >
                    মোট <b>{duplicates.length}</b>টি সম্ভাব্য ডুপ্লিকেট পাওয়া গেছে:
                  </div>
                  {duplicates.map((dup, i) => (
                    <div key={i} className="bm-duplicate-item">
                      <div className="bm-duplicate-item-header">
                        <span>{dup.record.name}</span>
                        <span className="bm-duplicate-tag">
                          {dup.type === 'MOBILE' ? 'একই মোবাইল' : 'একই নাম/আইডি'}
                        </span>
                      </div>
                      <div className="bm-duplicate-item-sub">
                        <div>📱 মোবাইল: {dup.record.mob}</div>
                        <div>📍 ঠিকানা: {dup.record.address}</div>
                        <div
                          style={{
                            marginTop: 4,
                            paddingTop: 4,
                            borderTop: '1px dashed rgba(0,0,0,0.1)'
                          }}
                        >
                          <b>ম্যাচিং রেকর্ড:</b> {dup.original.name} (
                          {dup.original.address})
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="bm-modal-btn-row">
              <button
                type="button"
                className="bm-modal-btn primary"
                onClick={closeDuplicateModal}
                style={{ gridColumn: 'span 2' }}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <div className={`bm-toast ${toast.type}`}>{toast.message}</div>}

      {/* Hidden Single-Page A4 Receipt Print Area */}
      <div id="bm-receipt-print-area" className="hidden print:block">
        {printRecord && (
          <div className="bm-print-receipt-container">
            <div className="bm-print-header">
              <img
                src={portalLogoUrl}
                alt="Logo"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h2>বিল ম্যানেজার (Money Receipt)</h2>
                <p>স্মার্ট বিলিং ও কালেকশন সিস্টেম • মানি রসিদ (গ্রাহক কপি)</p>
              </div>
            </div>

            <div className="bm-print-info-grid">
              <div className="bm-print-info-item">
                <strong>রসিদ নং:</strong> <span>{receiptNo}</span>
              </div>
              <div className="bm-print-info-item">
                <strong>তারিখ:</strong>{' '}
                <span>
                  {printRecord.date && printRecord.date !== '-'
                    ? printRecord.date
                    : new Date().toLocaleDateString('bn-BD')}
                </span>
              </div>
              <div className="bm-print-info-item">
                <strong>গ্রাহকের নাম:</strong>{' '}
                <span>
                  <strong>{printRecord.name}</strong>
                </span>
              </div>
              {!isDisBill && printRecord.id && (
                <div className="bm-print-info-item">
                  <strong>গ্রাহক আইডি:</strong> <span>{printRecord.id}</span>
                </div>
              )}
              <div className="bm-print-info-item">
                <strong>মোবাইল:</strong> <span>{printRecord.mob || '---'}</span>
              </div>
              <div className="bm-print-info-item">
                <strong>সেবার ধরন:</strong>{' '}
                <span>
                  {currentNet} ({currentMonth} মাস)
                </span>
              </div>
              <div
                className="bm-print-info-item"
                style={{ gridColumn: 'span 2' }}
              >
                <strong>ঠিকানা:</strong> <span>{printRecord.address || '---'}</span>
              </div>
            </div>

            <table className="bm-print-table">
              <thead>
                <tr>
                  <th>বিবরণ (Description)</th>
                  <th>বিলের মাস</th>
                  <th style={{ textAlign: 'right' }}>পরিমাণ (Amount)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{currentNet} সেবা ফি বাবদ</td>
                  <td>{currentMonth}</td>
                  <td style={{ textAlign: 'right' }}>
                    {(printRecord.pay + printRecord.due).toLocaleString()} ৳
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="bm-print-summary">
              <div className="bm-print-summary-row" style={{ color: '#15803d' }}>
                <span>পরিশোধিত টাকা (Paid):</span>
                <span style={{ fontWeight: 700 }}>
                  {printRecord.pay.toLocaleString()} ৳
                </span>
              </div>
              {printRecord.due > 0 ? (
                <div className="bm-print-summary-row" style={{ color: '#b91c1c' }}>
                  <span>বকেয়া টাকা (Due):</span>
                  <span style={{ fontWeight: 700 }}>
                    {printRecord.due.toLocaleString()} ৳
                  </span>
                </div>
              ) : (
                <div className="bm-print-summary-row" style={{ color: '#15803d' }}>
                  <span>বকেয়া টাকা (Due):</span>
                  <span style={{ fontWeight: 700 }}>০ ৳ (কোনো বকেয়া নেই)</span>
                </div>
              )}
              <div className="bm-print-summary-row total">
                <span>সর্বমোট বিল (Total):</span>
                <span>{(printRecord.pay + printRecord.due).toLocaleString()} ৳</span>
              </div>
            </div>

            <div className="bm-print-signatures">
              <div className="bm-print-sign-box">গ্রাহকের স্বাক্ষর</div>
              <div className="bm-print-sign-box">আদায়কারীর স্বাক্ষর</div>
            </div>

            <div className="bm-print-footer">
              আমাদের সেবা গ্রহণ করার জন্য আপনাকে ধন্যবাদ! • বিল ম্যানেজার সিস্টেম
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
