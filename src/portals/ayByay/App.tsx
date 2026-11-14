/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Transaction, 
  AppConfig, 
  Staff, 
  SalaryPayment, 
  DashboardCardType,
  InventoryItem,
  InventoryLog,
  AppNavTab
} from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DashboardOverview } from './components/DashboardOverview';
import { CardDetailModal } from './components/CardDetailModal';
import { CardDetailPage } from './components/CardDetailPage';
import { StaffSalaryManager } from './components/StaffSalaryManager';
import { SalarySlipModal } from './components/SalarySlipModal';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { DetailModal } from './components/DetailModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLoginModal } from './components/AdminLoginModal';
import { InventoryManager } from './components/InventoryManager';
import { InventoryReportPage } from './components/InventoryReportPage';
import { VisualAnalytics } from './components/VisualAnalytics';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { NewMonthModal } from './components/NewMonthModal';
import { 
  getMonthBengaliName, 
  parseNumber, 
  isIncomeTransaction, 
  isExpenseTransaction,
  getTransactionMonth
} from './data/categories';
import { ArrowDownToLine, CheckCircle2, AlertCircle, ArrowLeft, Boxes, BarChart3, Sparkles, PlusCircle, FileSpreadsheet } from 'lucide-react';
import { StaffAccount, QuickHisabOwner, UserSession } from '../../types';
import { initialTransactions } from '../../data/initialData';
import { staffDb, safeSetDoc, safeDeleteDoc, handleFirestoreError, OperationType } from '../../utils/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { safeStorage } from '../../utils/safeStorage';

interface AyByayPortalProps {
  onExit?: () => void;
  staffAccounts?: StaffAccount[];
  onSaveStaffAccounts?: (accounts: StaffAccount[]) => void;
  quickHisabOwners?: QuickHisabOwner[];
  onOpenDriveBackup?: () => void;
  currentUser?: UserSession | null;
  onAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export function AyByayPortal({ 
  onExit,
  staffAccounts: propStaffAccounts,
  onSaveStaffAccounts: propOnSaveStaffAccounts,
  quickHisabOwners,
  onOpenDriveBackup,
  currentUser,
  onAdminLogin,
  onAdminLogout
}: AyByayPortalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = safeStorage.getItem('isp_cache_txns') || safeStorage.getItem('protyasha_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialTransactions;
  });
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [salaries, setSalaries] = useState<SalaryPayment[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);

  // User Role State derived from currentUser session
  const userRole = currentUser?.role || 'visitor';
  const isAdmin = userRole === 'admin';
  const isSubAdmin = userRole === 'sub-admin';
  const isVisitor = userRole === 'visitor';
  const canEdit = isAdmin || isSubAdmin;


  // Internal staff accounts for company dues deduction
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    if (propStaffAccounts && propStaffAccounts.length > 0) return propStaffAccounts;
    try {
      const saved = safeStorage.getItem('protyasha_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    if (propStaffAccounts && propStaffAccounts.length > 0) {
      setStaffAccounts(propStaffAccounts);
    }
  }, [propStaffAccounts]);

  useEffect(() => {
    const handleStaffChange = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setStaffAccounts(e.detail);
      } else {
        try {
          const saved = safeStorage.getItem('protyasha_staff');
          if (saved) setStaffAccounts(JSON.parse(saved));
        } catch {}
      }
    };
    window.addEventListener('staff-data-changed', handleStaffChange);
    return () => window.removeEventListener('staff-data-changed', handleStaffChange);
  }, []);

  // Real-time synchronization with Google Cloud Firestore for Staff Accounts
  useEffect(() => {
    try {
      const q = collection(staffDb, 'staff');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudStaff: StaffAccount[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as StaffAccount;
          if (data && data.id && data.name) {
            cloudStaff.push(data);
          }
        });
        setStaffAccounts(cloudStaff);
        safeStorage.setItem('protyasha_staff', JSON.stringify(cloudStaff));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'staff');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('AyByay staff listener error:', e);
    }
  }, []);

  // Real-time synchronization with Google Cloud Firestore for Staff Salaries
  useEffect(() => {
    try {
      const q = collection(staffDb, 'ay_byay_salaries');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudSalaries: SalaryPayment[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as SalaryPayment;
          if (data && data.id && data.staffId) {
            cloudSalaries.push(data);
          }
        });
        setSalaries(cloudSalaries);
        safeStorage.setItem('isp_cache_salaries', JSON.stringify(cloudSalaries));
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { type: 'salaries', data: cloudSalaries } }));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_salaries');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Salaries listener error:', e);
    }
  }, []);

  // Real-time synchronization for Ay-Byay Transactions
  useEffect(() => {
    try {
      const q = collection(staffDb, 'ay_byay_transactions');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudTx: Transaction[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as any;
          if (data && (data.id || docSnap.id) && !data.isDeleted && (!data.source || data.source === 'ay-byay')) {
            cloudTx.push({ ...data, id: data.id || docSnap.id });
          }
        });

        const sorted = cloudTx.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setTransactions(sorted);
        safeStorage.setItem('isp_cache_txns', JSON.stringify(sorted));
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { type: 'transactions', data: sorted } }));
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_transactions');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Transactions listener error:', e);
    }
  }, []);

  // Real-time synchronization for Inventory Items
  useEffect(() => {
    try {
      const q = collection(staffDb, 'ay_byay_inventory');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: InventoryItem[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as InventoryItem;
          if (data && (data.id || docSnap.id)) {
            items.push({ ...data, id: data.id || docSnap.id });
          }
        });
        items.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        setInventoryItems(items);
        try { safeStorage.setItem('isp_cache_inventory', JSON.stringify(items)); } catch {}
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_inventory');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Inventory items listener error:', e);
    }
  }, []);

  // Real-time synchronization for Inventory Movement Logs
  useEffect(() => {
    try {
      const q = collection(staffDb, 'ay_byay_inventory_logs');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs: InventoryLog[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as InventoryLog;
          if (data && (data.id || docSnap.id)) {
            logs.push({ ...data, id: data.id || docSnap.id });
          }
        });
        logs.sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || ''));
        setInventoryLogs(logs);
        try { safeStorage.setItem('isp_cache_inventory_logs', JSON.stringify(logs)); } catch {}
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_inventory_logs');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Inventory logs listener error:', e);
    }
  }, []);

  // Real-time synchronization for Ay-Byay Config & Managed Months
  useEffect(() => {
    try {
      const cfgRef = doc(staffDb, 'ay_byay_config', 'main');
      const unsubscribe = onSnapshot(cfgRef, (snap) => {
        if (snap.exists()) {
          const cloudCfg = snap.data() as Partial<AppConfig>;
          setConfig(prev => {
            const merged = { ...prev, ...cloudCfg };
            try { safeStorage.setItem('isp_admin_saved_config', JSON.stringify(merged)); } catch {}
            return merged;
          });
          if (Array.isArray(cloudCfg.managedMonths) && cloudCfg.managedMonths.length > 0) {
            setManagedMonths(prev => {
              const mergedMonths = Array.from(new Set([...(cloudCfg.managedMonths || []), ...prev]));
              try { safeStorage.setItem('isp_managed_months', JSON.stringify(mergedMonths)); } catch {}
              return mergedMonths;
            });
          }
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'ay_byay_config/main');
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('AyByay config listener error:', e);
    }
  }, []);

  const handleSaveStaffAccounts = (updated: StaffAccount[]) => {
    setStaffAccounts(updated);
    if (propOnSaveStaffAccounts) {
      propOnSaveStaffAccounts(updated);
    } else {
      safeStorage.setItem('protyasha_staff', JSON.stringify(updated));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('staff-data-changed', { detail: updated }));
      }, 0);
      updated.forEach(staff => {
        safeSetDoc(doc(staffDb, 'staff', String(staff.id)), {
          ...staff,
          phone: staff.phone || ''
        }).catch(() => {});
      });
    }
  };

  // Unified staff roster combining staffList and staffAccounts so neither is ever lost or missing across reloads/upgrades
  const effectiveStaffList = useMemo<Staff[]>(() => {
    const list: Staff[] = [];
    const seenIds = new Set<string>();
    const seenPhones = new Set<string>();
    const cleanPhone = (p: string) => (p || '').replace(/[^0-9]/g, '');

    (staffList || []).forEach(s => {
      if (s && s.id && !seenIds.has(s.id)) {
        list.push(s);
        seenIds.add(s.id);
        const p = cleanPhone(s.phone);
        if (p.length >= 10) seenPhones.add(p);
      }
    });

    (staffAccounts || []).forEach(acc => {
      if (!acc || !acc.id) return;
      const p = cleanPhone(acc.phone);
      if (seenIds.has(acc.id) || (p.length >= 10 && seenPhones.has(p))) {
        const idx = list.findIndex(s => s.id === acc.id || (p.length >= 10 && cleanPhone(s.phone) === p));
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            designation: list[idx].designation || acc.role || 'লাইন টেকনিশিয়ান',
            baseSalary: list[idx].baseSalary || acc.baseSalary || 15000,
            phone: list[idx].phone || acc.phone
          };
        }
        return;
      }
      seenIds.add(acc.id);
      if (p.length >= 10) seenPhones.add(p);
      list.push({
        id: acc.id,
        name: acc.name,
        designation: acc.role || 'লাইন টেকনিশিয়ান',
        phone: acc.phone,
        joinDate: acc.createdAt ? new Date(acc.createdAt).toISOString().split('T')[0] : '2026-01-01',
        baseSalary: acc.baseSalary || 15000,
        status: acc.isActive !== false ? 'active' : 'inactive',
        notes: '',
        createdAt: acc.createdAt || new Date().toISOString()
      });
    });

    return list;
  }, [staffList, staffAccounts]);

  const [config, setConfig] = useState<AppConfig>(() => {
    let localSaved: any = null;
    try {
      const raw = safeStorage.getItem('isp_admin_saved_config');
      if (raw) localSaved = JSON.parse(raw);
    } catch {}

    return {
      autoSync: false,
      lastSyncTime: null,
      syncStatus: 'connected',
      syncMessage: 'অনলাইন ক্লাউড ডেটাবেস সক্রিয় (১২ মাসের ডেটা ও হিস্টরি চিরতরে সুরক্ষিত)',
      companyName: localSaved?.companyName || 'স্মার্ট ব্যবস্থাপনা',
      currencySymbol: '৳',
      activeMonth: localSaved?.activeMonth || new Date().toISOString().substring(0, 7),
      managedMonths: localSaved?.managedMonths || [new Date().toISOString().substring(0, 7)]
    };
  });

  // User notification toast
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto hide notification after 3.5 seconds
  useEffect(() => {
    if (syncToast) {
      const timer = setTimeout(() => {
        setSyncToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [syncToast]);

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return safeStorage.getItem('isp_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      safeStorage.setItem('isp_dark_mode', String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, [isDarkMode]);

  // Admin Login State for New Entry - Derived from session
  const isAdminLoggedIn = canEdit;
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Current Navigation Tab
  const [activeNav, setActiveNav] = useState<AppNavTab>('dashboard');
  const [inventoryReportInitialTab, setInventoryReportInitialTab] = useState<'stock' | 'issued'>('stock');

  // Month selection for accounts & payroll (always defaults to current running month)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // User created / managed months
  const [managedMonths, setManagedMonths] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('isp_managed_months');
      if (saved) return JSON.parse(saved);
    } catch {}
    const now = new Date();
    return [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`];
  });

  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);


  // Available months extracted from managedMonths + transaction dates
  const availableMonths = useMemo(() => {
    const set = new Set<string>(managedMonths);
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    set.add(currentYM);

    (transactions || []).forEach(t => {
      if (t && t.date && t.date.length >= 7) {
        set.add(t.date.substring(0, 7));
      }
    });

    return Array.from(set).sort().reverse();
  }, [managedMonths, transactions]);

  const lastServerActiveMonthRef = useRef<string | null>(null);
  const hasUserSetMonthRef = useRef<boolean>(false);

  // Month change handler: Changes month locally for the current user's view
  const handleMonthChange = (newMonth: string) => {
    hasUserSetMonthRef.current = true;
    setSelectedMonth(newMonth);

    const updated = Array.from(new Set([newMonth, ...managedMonths]));
    setManagedMonths(updated);
    safeStorage.setItem('isp_managed_months', JSON.stringify(updated));

    setSyncToast({
      message: `📅 ${getMonthBengaliName(newMonth)} মাসের তথ্য দেখানো হচ্ছে`,
      type: 'success'
    });
  };

  const handleAddNewMonth = (monthKey: string) => {
    const updated = Array.from(new Set([monthKey, ...managedMonths]));
    setManagedMonths(updated);
    safeStorage.setItem('isp_managed_months', JSON.stringify(updated));
    hasUserSetMonthRef.current = true;
    setSelectedMonth(monthKey);
    lastServerActiveMonthRef.current = monthKey;

    handleSaveConfig({ activeMonth: monthKey, managedMonths: updated });
    setSyncToast({
      message: `🎉 ${getMonthBengaliName(monthKey)} মাসের নতুন হিসাব সফলভাবে শুরু করা হয়েছে! ড্যাশবোর্ড ০ থেকে শুরু হয়েছে।`,
      type: 'success'
    });
  };

  // Interactive Card Detail Modal
  const [activeCardDetail, setActiveCardDetail] = useState<DashboardCardType | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Salary Slip Modal
  const [selectedSalarySlip, setSelectedSalarySlip] = useState<SalaryPayment | null>(null);
  const [isSalarySlipOpen, setIsSalarySlipOpen] = useState(false);

  // Transaction Modals
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [initialEditInModal, setInitialEditInModal] = useState(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  // New Transaction Form Preset
  const [formInitialType, setFormInitialType] = useState<'income' | 'expense'>('income');
  const [formInitialCategory, setFormInitialCategory] = useState<string | undefined>(undefined);

  // Monthly Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const stateRef = useRef({
    activeNav,
    isCardModalOpen,
    isSalarySlipOpen,
    isDetailModalOpen,
    isReportModalOpen,
    isNewMonthModalOpen,
    isMobileDrawerOpen,
    isAdminLoginModalOpen
  });

  useEffect(() => {
    stateRef.current = {
      activeNav,
      isCardModalOpen,
      isSalarySlipOpen,
      isDetailModalOpen,
      isReportModalOpen,
      isNewMonthModalOpen,
      isMobileDrawerOpen,
      isAdminLoginModalOpen
    };
  }, [
    activeNav, 
    isCardModalOpen, 
    isSalarySlipOpen, 
    isDetailModalOpen, 
    isReportModalOpen, 
    isNewMonthModalOpen, 
    isMobileDrawerOpen,
    isAdminLoginModalOpen
  ]);

  // Push history step when navigation or modal changes so physical back button works
  const pushHistoryStep = useCallback((stepName: string, targetNav?: AppNavTab, extraState?: Record<string, any>) => {
    try {
      const navTag = targetNav || (stepName.startsWith('nav-') ? (stepName.replace('nav-', '') as AppNavTab) : undefined);
      window.history.pushState({ 
        appStep: stepName, 
        ayByayPortal: true, 
        targetNav: navTag,
        timestamp: Date.now(),
        ...(extraState || {})
      }, '');
    } catch {
      // safe fallback in iframe environments
    }
  }, []);

  // Device back button (popstate listener)
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.ayByayPortal) {
        window.history.replaceState({ appStep: 'portal-root', ayByayPortal: true, targetNav: 'dashboard' }, '');
      }
    } catch {
      // ignore
    }

    const handlePopState = (e: PopStateEvent) => {
      const s = stateRef.current;
      const hState = e.state || window.history.state || {};

      // 1. Close open top modals (LIFO order, except drawer)
      if (s.isAdminLoginModalOpen) {
        setIsAdminLoginModalOpen(false);
        return;
      }

      if (s.isNewMonthModalOpen) {
        setIsNewMonthModalOpen(false);
        return;
      }
      if (s.isSalarySlipOpen) {
        setIsSalarySlipOpen(false);
        setSelectedSalarySlip(null);
        return;
      }
      if (s.isDetailModalOpen) {
        setIsDetailModalOpen(false);
        setSelectedTransaction(null);
        return;
      }
      if (s.isCardModalOpen) {
        setIsCardModalOpen(false);
        setActiveCardDetail(null);
        return;
      }
      if (s.isReportModalOpen) {
        setIsReportModalOpen(false);
        return;
      }


      // 2. Check if popped target history state is the Mobile Drawer
      if (hState && (hState.isDrawerOpen || hState.appStep === 'mobile_drawer')) {
        setIsMobileDrawerOpen(true);
        if (hState.targetNav) setActiveNav(hState.targetNav);
        return;
      }

      // 3. If currently the Mobile Drawer is open and we pop past it
      if (s.isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
        if (hState && hState.targetNav) {
          setActiveNav(hState.targetNav);
        } else {
          setActiveNav('dashboard');
        }
        return;
      }

      // 4. Sub-page navigation unwinding step by step
      if (hState && hState.ayByayPortal) {
        const nextTargetNav = (hState.targetNav as AppNavTab) || 'dashboard';
        if (s.activeNav !== nextTargetNav) {
          setActiveNav(nextTargetNav);
          return;
        }
      }

      // 5. If no modals or subpages open and history popped past portal-root
      if (s.activeNav === 'dashboard' && (!hState || !hState.ayByayPortal)) {
        if (onExit) onExit();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onExit]);

  // Navigation changer with history push
  const handleNavChange = useCallback((newNav: AppNavTab) => {
    setIsMobileDrawerOpen(false);
    if (newNav === 'new_entry' && !canEdit) {
      setIsAdminLoginModalOpen(true);
      pushHistoryStep('admin-login');
      setSyncToast({ message: 'নতুন এন্ট্রি করার জন্য প্রথমে এডমিন লগইন করুন', type: 'error' });
      return;
    }
    if (newNav !== activeNav) {
      pushHistoryStep(`nav-${newNav}`, newNav);
      setActiveNav(newNav);
      if (newNav !== 'card_detail') {
        setActiveCardDetail(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeNav, canEdit, pushHistoryStep]);

  // Global manual Go Back function
  const handleGoBack = useCallback(() => {
    try {
      if (window.history.state && window.history.state.ayByayPortal && window.history.state.appStep !== 'portal-root') {
        window.history.back();
        return;
      }
    } catch {}

    const s = stateRef.current;
    if (s.isMobileDrawerOpen) {
      setIsMobileDrawerOpen(false);
      return;
    }
    if (s.isAdminLoginModalOpen) {
      setIsAdminLoginModalOpen(false);
      return;
    }

    if (s.isNewMonthModalOpen) {
      setIsNewMonthModalOpen(false);
      return;
    }
    if (s.isSalarySlipOpen) {
      setIsSalarySlipOpen(false);
      setSelectedSalarySlip(null);
      return;
    }
    if (s.isDetailModalOpen) {
      setIsDetailModalOpen(false);
      setSelectedTransaction(null);
      return;
    }
    if (s.isCardModalOpen) {
      setIsCardModalOpen(false);
      setActiveCardDetail(null);
      return;
    }
    if (s.isReportModalOpen) {
      setIsReportModalOpen(false);
      return;
    }

    if (s.activeNav !== 'dashboard') {
      setActiveNav('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If at dashboard (base of portal), close portal
    if (onExit) onExit();
  }, [onExit]);

  // Fetch data silently from Firestore
  const fetchDataSilent = useCallback(async () => {
    // Handled by onSnapshot listeners for real-time reactivity
    console.log('[AyByay] Firestore listeners active for all collections');
  }, []);

  // Inventory Management Handlers
  const handleAddInventoryItem = async (item: Partial<InventoryItem>) => {
    try {
      const id = item.id || `INV-${Date.now()}`;
      const payload = {
        id,
        name: item.name || 'মালামাল',
        category: item.category || 'other',
        unit: item.unit || 'পিস',
        currentStock: Number(item.currentStock) || 0,
        minStockAlert: Number(item.minStockAlert) || 0,
        unitCost: Number(item.unitCost) || 0,
        supplier: item.supplier,
        location: item.location,
        notes: item.notes,
        recordedBy: currentUser?.id || 'admin-primary',
        updatedAt: new Date().toISOString()
      };
      await safeSetDoc(doc(staffDb, 'ay_byay_inventory', id), payload);
      setSyncToast({ message: 'মালামাল সফলভাবে সংরক্ষিত হয়েছে', type: 'success' });
    } catch (err) {
      console.error('Inventory save failed', err);
      setSyncToast({ message: 'মালামাল সংরক্ষণ ব্যর্থ হয়েছে', type: 'error' });
    }
  };

  const handleDeleteInventoryItem = async (id: string) => {
    try {
      await safeDeleteDoc(doc(staffDb, 'ay_byay_inventory', id));
      setSyncToast({ message: 'মালামাল সফলভাবে মুছে ফেলা হয়েছে', type: 'success' });
    } catch (err) {
      console.error('Inventory delete failed', err);
    }
  };

  const handleDeleteInventoryLog = async (id: string) => {
    try {
      const log = inventoryLogs.find(l => l.id === id);
      if (!log) return;
      
      // Revert stock
      const item = inventoryItems.find(i => i.id === log.itemId);
      if (item) {
        const newStock = (log.type === 'in' || log.type === 'return') 
          ? Math.max(0, item.currentStock - log.quantity) 
          : item.currentStock + log.quantity;
        await safeSetDoc(doc(staffDb, 'ay_byay_inventory', item.id), { ...item, currentStock: newStock });
      }

      await safeDeleteDoc(doc(staffDb, 'ay_byay_inventory_logs', id));
      setSyncToast({ message: 'মুভমেন্ট লগ সফলভাবে মুছে ফেলা হয়েছে', type: 'success' });
    } catch (err) {
      console.error('Delete log failed', err);
    }
  };

  const handleLogMovement = async (logData: {
    itemId: string;
    type: 'in' | 'out' | 'return' | 'damaged';
    quantity: number;
    date: string;
    recipientOrSource: string;
    costPerUnit?: number;
    addToExpense?: boolean;
    expenseCategory?: string;
    paymentMethod?: string;
    note?: string;
  }) => {
    try {
      const item = inventoryItems.find(i => i.id === logData.itemId);
      if (!item) return;

      const logId = `LOG-${Date.now()}`;
      const newLog: InventoryLog = {
        ...logData,
        id: logId,
        itemName: item.name,
        totalCost: (logData.costPerUnit || item.unitCost) * logData.quantity,
        recordedBy: currentUser?.id,
        createdAt: new Date().toISOString()
      };

      // Adjust item stock
      const newStock = (logData.type === 'in' || logData.type === 'return')
        ? item.currentStock + logData.quantity
        : Math.max(0, item.currentStock - logData.quantity);
      
      await safeSetDoc(doc(staffDb, 'ay_byay_inventory', item.id), { ...item, currentStock: newStock });
      await safeSetDoc(doc(staffDb, 'ay_byay_inventory_logs', logId), newLog);

      setSyncToast({ message: 'স্টক রেকর্ড সফলভাবে সংরক্ষিত হয়েছে', type: 'success' });
    } catch (err) {
      console.error('Movement log error', err);
      setSyncToast({ message: 'স্টক মুভমেন্ট রেকর্ড করতে সমস্যা হয়েছে', type: 'error' });
    }
  };

  // Fetch initial data: transactions, config, staff, salaries
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Load local database FIRST so app UI populates instantly on mobile!
      await fetchDataSilent();

      // Background sync pull removed
    } catch (err) {
      console.warn('Initial load notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDataSilent, config.activeMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter transactions by selected month for month-specific metrics safely
  const monthTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => {
      if (!t || typeof t.date !== 'string') return false;
      return getTransactionMonth(t.date) === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  // Compute live dashboard metrics for selected month
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    monthTransactions.forEach((t) => {
      if (!t) return;
      const amt = parseNumber(t.amount);
      if (isIncomeTransaction(t)) {
        totalIncome += amt;
        incomeCount++;
      } else {
        totalExpense += amt;
        expenseCount++;
      }
    });

    const netProfit = totalIncome - totalExpense;

    // Staff paid salaries for this month
    const monthSal = (salaries || []).filter(s => s && s.month === selectedMonth && s.paymentStatus === 'paid');
    const paidSalaries = monthSal.reduce((acc, s) => acc + (Number(s?.netSalary) || 0), 0);

    // Bandwidth & Operations expenses
    const bandwidthCategories = [
      'ব্যান্ডউইথ/আপস্ট্রিম বিল',
      'বিদ্যুৎ বিল',
      'অফিস ভাড়া',
      'অপটিক্যাল ফাইবার ও কেবল',
      'ONU/OLT/Router ক্রয়',
      'স্প্লিটার, জয়েন্ট বক্স ও অন্যান্য যন্ত্রাংশ',
      'কেবল মেরামত ও রক্ষণাবেক্ষণ'
    ];

    const totalBandwidthOps = monthTransactions
      .filter(t => {
        if (!t || !isExpenseTransaction(t)) return false;
        const cat = String(t.category || '');
        return (
          bandwidthCategories.includes(cat) ||
          cat.includes('ব্যান্ডউইথ') ||
          cat.includes('বিদ্যুৎ') ||
          cat.includes('কেবল') ||
          cat.includes('ফাইবার')
        );
      })
      .reduce((acc, t) => acc + parseNumber(t.amount), 0);

    const activeStaffCount = (staffList || []).filter(s => s && s.status === 'active').length;

    return {
      totalIncome,
      totalExpense,
      netProfit,
      paidSalaries,
      totalBandwidthOps,
      incomeCount,
      expenseCount,
      staffCount: activeStaffCount
    };
  }, [monthTransactions, salaries, staffList, selectedMonth]);

  // Interactive Card Click Handler (Opens Full Page Card Detail View)
  const handleCardClick = (type: DashboardCardType) => {
    setActiveCardDetail(type);
    handleNavChange('card_detail');
    pushHistoryStep(`card-${type}`);
  };

  // Open New Transaction Form from anywhere
  const handleOpenNewTransaction = (type?: 'income' | 'expense', category?: string) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'নতুন এন্ট্রি করার জন্য প্রথমে এডমিন লগইন করুন', type: 'error' });
      return;
    }
    setFormInitialType(type || 'income');
    setFormInitialCategory(category);
    handleNavChange('new_entry');
  };

  // Open Salary Slip Modal
  const handleViewSalarySlip = (sal: SalaryPayment) => {
    setSelectedSalarySlip(sal);
    setIsSalarySlipOpen(true);
    pushHistoryStep('salary-slip');
  };

  // Open Report Modal / Page
  const handleOpenReportModal = () => {
    setIsMobileDrawerOpen(false);
    handleNavChange('report');
  };



  // Add new transaction
  const handleAddTransaction = async (data: {
    type: 'income' | 'expense';
    description: string;
    category: string;
    amount: number;
    date: string;
    paymentMethod: string;
    note?: string;
  }) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'নতুন লেনদেন সংযোজন করতে প্রথমে এডমিন লগইন করুন', type: 'error' });
      return false;
    }
    setIsSubmitting(true);
    try {
      const newId = `TXN-${Date.now()}`;
      const payload: Transaction = {
        ...data,
        id: newId,
        recordedBy: currentUser?.id || 'admin-primary',
        recordedByGmail: currentUser?.gmail || undefined,
        source: 'ay-byay',
        createdAt: new Date().toISOString()
      };
      await safeSetDoc(doc(staffDb, 'ay_byay_transactions', newId), payload);
      try {
        const currentList = JSON.parse(safeStorage.getItem('isp_cache_txns') || '[]');
        const updated = [payload, ...(Array.isArray(currentList) ? currentList : [])];
        safeStorage.setItem('isp_cache_txns', JSON.stringify(updated));
        safeStorage.setItem('protyasha_transactions', JSON.stringify(updated));
        
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { action: 'add', transaction: payload } }));
      } catch {}
      setSyncToast({ message: '✅ নতুন লেনদেনটি সফলভাবে অন্তর্ভুক্ত হয়েছে!', type: 'success' });
      handleNavChange('dashboard');
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setSyncToast({ message: '❌ ব্যর্থ হয়েছে! আবার চেষ্টা করুন', type: 'error' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing transaction
  const handleUpdateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'লেনদেন এডিট করার জন্য এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }

    try {
      const existing = transactions.find(t => t.id === id);
      if (!existing) return false;
      const updated = { ...existing, ...updatedData };
      await safeSetDoc(doc(staffDb, 'ay_byay_transactions', id), updated);
      try {
        const currentList = JSON.parse(safeStorage.getItem('isp_cache_txns') || '[]');
        const updatedList = Array.isArray(currentList) ? currentList.map((t: any) => t.id === id ? { ...t, ...updatedData } : t) : [];
        safeStorage.setItem('isp_cache_txns', JSON.stringify(updatedList));
        safeStorage.setItem('protyasha_transactions', JSON.stringify(updatedList));
        
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { action: 'update', transaction: updated } }));
      } catch {}
      setSyncToast({ message: '✅ লেনদেনের তথ্য সফলভাবে আপডেট হয়েছে!', type: 'success' });
      return true;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setSyncToast({ message: '❌ এডিটে ত্রুটি হয়েছে', type: 'error' });
      return false;
    }
  };

  // Delete transaction (Soft Delete for Recycle Bin compatibility)
  const handleDeleteTransaction = async (id: string) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'লেনদেন ডিলিট করার জন্য এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      // 1. Delete document directly from Firestore so it doesn't auto-return
      await safeDeleteDoc(doc(staffDb, 'ay_byay_transactions', id));
      
      try {
        // 2. Update local state and safeStorage immediately
        const currentList = JSON.parse(safeStorage.getItem('isp_cache_txns') || '[]');
        const updatedList = Array.isArray(currentList) ? currentList.filter((t: any) => t.id !== id) : [];
        setTransactions(updatedList);
        safeStorage.setItem('isp_cache_txns', JSON.stringify(updatedList));
        safeStorage.setItem('protyasha_transactions', JSON.stringify(updatedList));
        
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { action: 'delete', id } }));
      } catch (err) {
        console.warn('AyByay local sync error during delete:', err);
      }

      if (selectedTransaction?.id === id) {
        setIsDetailModalOpen(false);
        setSelectedTransaction(null);
      }
      setSyncToast({ message: '🗑️ লেনদেনটি সফলভাবে মুছে ফেলা হয়েছে!', type: 'success' });
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setSyncToast({ message: '❌ ডিলিট করার সময় ত্রুটি ঘটেছে', type: 'error' });
      return false;
    }
  };

  // STAFF MANAGEMENT HANDLERS (Firestore staff-collection-db + API sync)
  const handleAddStaff = async (data: Omit<Staff, 'id' | 'createdAt'>) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'নতুন স্টাফ যোগ করতে এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      const newStaffId = `stf-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const newStaff: Staff = {
        ...data,
        id: newStaffId,
        createdAt: nowIso
      };

      // 1. Save directly to Google Cloud Firestore staffDb collection 'staff'
      const newStaffAccount: StaffAccount = {
        id: newStaffId,
        name: newStaff.name,
        phone: newStaff.phone,
        role: newStaff.designation,
        baseSalary: newStaff.baseSalary,
        totalDue: 0,
        totalCollected: 0,
        remainingDue: 0,
        transactions: [],
        createdAt: nowIso,
        isActive: newStaff.status === 'active',
        recordedBy: currentUser?.id
      };
      await safeSetDoc(doc(staffDb, 'staff', newStaffId), newStaffAccount).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `staff/${newStaffId}`);
      });

      // 2. Update state and local caches
      setStaffList(prev => [...prev, newStaff]);
      const updatedAccounts = [...staffAccounts, newStaffAccount];
      handleSaveStaffAccounts(updatedAccounts);

      setSyncToast({ message: `কর্মী "${newStaff.name}" ক্লাউডে সফলভাবে সংরক্ষিত হয়েছে`, type: 'success' });
      return true;
    } catch (err) {
      console.error('Error adding staff:', err);
      return false;
    }
  };

  const handleUpdateStaff = async (id: string, data: Partial<Staff>) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'স্টাফ তথ্য পরিবর্তন করতে এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      // 1. Update Firestore staffDb document
      const existingAcc = staffAccounts.find(a => a.id === id);
      if (existingAcc) {
        const updatedAcc: StaffAccount = {
          ...existingAcc,
          name: data.name !== undefined ? data.name : existingAcc.name,
          phone: data.phone !== undefined ? data.phone : existingAcc.phone,
          role: data.designation !== undefined ? data.designation : existingAcc.role,
          baseSalary: data.baseSalary !== undefined ? data.baseSalary : existingAcc.baseSalary,
          isActive: data.status !== undefined ? (data.status === 'active') : existingAcc.isActive
        };
        await safeSetDoc(doc(staffDb, 'staff', id), updatedAcc).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `staff/${id}`);
        });
        const updatedAccounts = staffAccounts.map(a => a.id === id ? updatedAcc : a);
        handleSaveStaffAccounts(updatedAccounts);
      }

      // 2. Update local staffList state
      setStaffList(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));

      setSyncToast({ message: 'স্টাফ তথ্য ক্লাউডে সফলভাবে আপডেট হয়েছে', type: 'success' });
      return true;
    } catch (err) {
      console.error('Error updating staff:', err);
      return false;
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'স্টাফ ডিলিট করতে এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      // 1. Delete from Google Cloud Firestore staffDb
      await safeDeleteDoc(doc(staffDb, 'staff', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `staff/${id}`);
      });

      // 2. Update state and local caches
      setStaffList(prev => prev.filter(s => s.id !== id));
      const updatedAccounts = staffAccounts.filter(a => a.id !== id);
      handleSaveStaffAccounts(updatedAccounts);

      setSyncToast({ message: 'স্টাফ ক্লাউড ডাটাবেজ থেকে মুছে ফেলা হয়েছে', type: 'success' });
      return true;
    } catch (err) {
      console.error('Error deleting staff:', err);
      return false;
    }
  };

  // SALARY DISBURSAL HANDLER (Google Cloud Firestore staff-collection-db + Company Dues auto-settlement)
  const handleDisburseSalary = async (data: {
    staffId: string;
    month: string;
    baseSalary: number;
    bonusOrAllowance: number;
    deductionOrAdvance: number;
    paymentStatus: 'paid' | 'pending';
    paymentDate?: string;
    paymentMethod?: string;
    voucherNumber?: string;
    note?: string;
  }) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'বেতন প্রদান করতে এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      const staffMember = effectiveStaffList.find(s => s.id === data.staffId);
      const grossSalary = data.baseSalary + (data.bonusOrAllowance || 0);
      const netSalary = Math.max(0, grossSalary - (data.deductionOrAdvance || 0));
      const recordId = `sal-${data.staffId}-${data.month}`;
      const payDate = data.paymentDate || new Date().toISOString().split('T')[0];
      const voucher = data.voucherNumber || `VCH-SAL-${Date.now().toString().slice(-4)}`;

      const record: SalaryPayment = {
        id: recordId,
        staffId: data.staffId,
        staffName: staffMember?.name || 'স্টাফ',
        staffDesignation: staffMember?.designation || 'কর্মচারী',
        month: data.month,
        baseSalary: data.baseSalary,
        bonusOrAllowance: data.bonusOrAllowance,
        deductionOrAdvance: data.deductionOrAdvance,
        netSalary,
        paymentStatus: data.paymentStatus,
        paymentDate: payDate,
        paymentMethod: data.paymentMethod || 'নগদ (Cash)',
        voucherNumber: voucher,
        note: data.note || '',
        recordedBy: currentUser?.id,
        recordedByGmail: currentUser?.gmail || undefined,
        createdAt: new Date().toISOString()
      };


      // 1. Permanently save salary record to Google Cloud Firestore staffDb collection 'staff_salaries'
      await safeSetDoc(doc(staffDb, 'staff_salaries', record.id), record).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `staff_salaries/${record.id}`);
      });

      // 2. Update local salaries state and localStorage cache
      setSalaries(prev => {
        const idx = prev.findIndex(s => s.staffId === data.staffId && s.month === data.month);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = record;
          return copy;
        }
        return [record, ...prev];
      });
      try {
        const updated = [...salaries.filter(s => !(s.staffId === data.staffId && s.month === data.month)), record];
        safeStorage.setItem('isp_cache_salaries', JSON.stringify(updated));
      } catch {}

      // 3. Deduct from company dues in "স্টাফ কালেকশন ও কোম্পানি পাওনা" if deduction was applied and staff owes dues
      if (data.deductionOrAdvance > 0) {
        const cleanPhone = (p: string) => (p || '').replace(/[^0-9]/g, '');
        const targetPhone = cleanPhone(staffMember?.phone || '');
        const matchedAcc = staffAccounts.find(a => 
          a.id === data.staffId || 
          (targetPhone.length >= 10 && cleanPhone(a.phone) === targetPhone) ||
          (a.name && staffMember?.name && a.name.trim().toLowerCase() === staffMember.name.trim().toLowerCase())
        );

        if (matchedAcc && (matchedAcc.remainingDue || 0) > 0) {
          const settleAmount = Math.min(data.deductionOrAdvance, matchedAcc.remainingDue);
          if (settleAmount > 0) {
            const collectionTx = {
              id: `stx-sal-${Date.now()}`,
              staffId: matchedAcc.id,
              type: 'collection' as const,
              amount: settleAmount,
              date: payDate,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              customerName: `${record.staffName} (${record.staffDesignation})`,
              note: `বেতন থেকে কোম্পানি পাওনা কর্তন (${getMonthBengaliName(data.month)}) - ভাউচার: ${voucher}`,
              recordedBy: 'পে-রোল সিস্টেম',
              created: Date.now()
            };

            const oldTxs = matchedAcc.transactions || [];
            const newTxs = [...oldTxs, collectionTx];
            const newTotalDue = newTxs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
            const newTotalCollected = newTxs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
            const newRemaining = Math.max(0, newTotalDue - newTotalCollected);

            const updatedAccount: StaffAccount = {
              ...matchedAcc,
              totalDue: newTotalDue,
              totalCollected: newTotalCollected,
              remainingDue: newRemaining,
              transactions: newTxs
            };

            // Save updated account directly to Firestore staffDb collection 'staff'
            safeSetDoc(doc(staffDb, 'staff', matchedAcc.id), updatedAccount).catch(() => {});
            const updatedAccounts = staffAccounts.map(a => a.id === matchedAcc.id ? updatedAccount : a);
            handleSaveStaffAccounts(updatedAccounts);
          }
        }
      }

      // 4. Save directly to Firestore ay_byay_salaries
      await safeSetDoc(doc(staffDb, 'ay_byay_salaries', record.id), record);

      // 5. Create/update corresponding Expense transaction in Ay-Byay Firestore
      if (data.paymentStatus === 'paid') {
        const txnId = `tx-sal-${record.id}`;
        const salaryExpenseTx: Transaction = {
          id: txnId,
          type: 'expense',
          description: `স্টাফ বেতন: ${record.staffName} (${record.staffDesignation})`,
          category: 'বেতন (Salary)',
          amount: record.netSalary,
          date: payDate,
          paymentMethod: record.paymentMethod,
          note: `${getMonthBengaliName(data.month)} মাসের বেতন। মূল: ৳${data.baseSalary}, বোনাস: ৳${data.bonusOrAllowance || 0}, কর্তন: ৳${data.deductionOrAdvance || 0}। ভাউচার: ${voucher}`,
          source: 'ay-byay',
          createdAt: record.createdAt,
          recordedBy: currentUser?.id
        };
        await safeSetDoc(doc(staffDb, 'ay_byay_transactions', txnId), salaryExpenseTx);

        // Update local transactions state & cache immediately
        setTransactions(prev => {
          const filtered = prev.filter(t => t.id !== txnId);
          const updated = [salaryExpenseTx, ...filtered];
          safeStorage.setItem('isp_cache_txns', JSON.stringify(updated));
          return updated;
        });
      }

      try {
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { action: 'salary_disbursed', record } }));
      } catch {}

      setSyncToast({ message: `✓ ${record.staffName} এর বেতন ক্লাউড ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে`, type: 'success' });
      return true;
    } catch (err) {
      console.error('Error disbursing salary:', err);
      setSyncToast({ message: 'বেতন সংরক্ষণে সমস্যা হয়েছে', type: 'error' });
      return false;
    }
  };

  const handleDeleteSalary = async (id: string) => {
    if (!canEdit) {
      setIsAdminLoginModalOpen(true);
      setSyncToast({ message: 'বেতন রেকর্ড ডিলিট করতে এডমিন লগইন প্রয়োজন', type: 'error' });
      return false;
    }
    try {
      const salRecord = salaries.find(s => s.id === id);

      // 1. Delete directly from Google Cloud Firestore staffDb collections
      await safeDeleteDoc(doc(staffDb, 'ay_byay_salaries', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `ay_byay_salaries/${id}`);
      });
      safeDeleteDoc(doc(staffDb, 'staff_salaries', id)).catch(() => {});

      // 2. Remove linked expense transaction from Ay-Byay Firestore
      const linkedTxId = `tx-sal-${id}`;
      await safeDeleteDoc(doc(staffDb, 'ay_byay_transactions', linkedTxId));

      // 3. Revert company due collection in "স্টাফ কালেকশন ও কোম্পানি পাওনা" if deduction was applied
      if (salRecord && (salRecord.deductionOrAdvance || 0) > 0) {
        const cleanPhone = (p: string) => (p || '').replace(/[^0-9]/g, '');
        const staffObj = effectiveStaffList.find(s => s.id === salRecord.staffId);
        const targetPhone = cleanPhone(staffObj?.phone || '');
        const matchedAcc = staffAccounts.find(a => 
          a.id === salRecord.staffId || 
          (targetPhone.length >= 10 && cleanPhone(a.phone) === targetPhone) ||
          (a.name && salRecord.staffName && a.name.trim().toLowerCase() === salRecord.staffName.trim().toLowerCase())
        );

        if (matchedAcc && matchedAcc.transactions) {
          const revertTarget = matchedAcc.transactions.find(t => 
            t.type === 'collection' && 
            t.note?.includes(getMonthBengaliName(salRecord.month)) &&
            t.note?.includes('বেতন থেকে কোম্পানি পাওনা কর্তন')
          );
          if (revertTarget) {
            const filteredTxs = matchedAcc.transactions.filter(t => t.id !== revertTarget.id);
            const newTotalDue = filteredTxs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
            const newTotalCollected = filteredTxs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
            const newRemaining = Math.max(0, newTotalDue - newTotalCollected);

            const updatedAccount: StaffAccount = {
              ...matchedAcc,
              totalDue: newTotalDue,
              totalCollected: newTotalCollected,
              remainingDue: newRemaining,
              transactions: filteredTxs
            };

            safeSetDoc(doc(staffDb, 'staff', matchedAcc.id), updatedAccount).catch(() => {});
            const updatedAccounts = staffAccounts.map(a => a.id === matchedAcc.id ? updatedAccount : a);
            handleSaveStaffAccounts(updatedAccounts);
          }
        }
      }

      // Update local state and caches immediately
      setSalaries(prev => {
        const updated = prev.filter(s => s.id !== id);
        safeStorage.setItem('isp_cache_salaries', JSON.stringify(updated));
        return updated;
      });

      setTransactions(prev => {
        const updated = prev.filter(t => t.id !== linkedTxId);
        safeStorage.setItem('isp_cache_txns', JSON.stringify(updated));
        return updated;
      });

      try {
        window.dispatchEvent(new CustomEvent('aybyay-data-changed', { detail: { action: 'salary_deleted', id } }));
      } catch {}

      setSyncToast({ message: 'বেতন রেকর্ড ক্লাউড ডাটাবেজ থেকে মুছে ফেলা হয়েছে', type: 'success' });
      return true;
    } catch (err) {
      console.error('Error deleting salary record:', err);
      setSyncToast({ message: 'ডিলিট করতে সমস্যা হয়েছে', type: 'error' });
      return false;
    }
  };

  // Save Config to Firestore
  const handleSaveConfig = async (newConfig: Partial<AppConfig>) => {
    try {
      const merged = { ...config, ...newConfig };
      safeStorage.setItem('isp_admin_saved_config', JSON.stringify(merged));
      
      // Save to Firestore staffDb
      await safeSetDoc(doc(staffDb, 'ay_byay_config', 'main'), merged);
      
      setConfig(merged);
      return true;
    } catch (err) {
      console.error('Error saving config:', err);
      return false;
    }
  };

  // Force push removed


  // Auto-sync removed


  // Force pull removed
  const handleForcePull = async () => {
    fetchDataSilent();
    return { success: true, message: 'রিফ্রেশ সম্পন্ন হয়েছে' };
  };

  // Export CSV (Browser-side implementation)
  const handleExportCsv = () => {
    try {
      const activeTxns = transactions.filter(t => getTransactionMonth(t.date || '') === selectedMonth);
      if (activeTxns.length === 0) {
        setSyncToast({ message: 'এই মাসে কোনো লেনদেন নেই!', type: 'error' });
        return;
      }

      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Method', 'Note'];
      const rows = activeTxns.map(t => [
        t.date || '',
        t.description || '',
        t.category || '',
        t.type === 'income' ? 'Income' : 'Expense',
        t.amount || 0,
        t.paymentMethod || 'Cash',
        t.note || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `AyByay_Report_${selectedMonth}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('CSV Export error:', e);
      setSyncToast({ message: 'এক্সপোর্ট করতে সমস্যা হয়েছে', type: 'error' });
    }
  };

  return (
    <main className={`min-h-screen w-full ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#f0f4fa] text-slate-900'} py-3 sm:py-5 px-3 sm:px-6 max-w-7xl mx-auto font-sans pb-28 sm:pb-12 transition-colors`}>
      {/* Offline Status Indicator for PWA */}
      <OfflineIndicator />

      {/* Top Toast Notification */}
      {syncToast && (
        <div 
          onClick={() => setSyncToast(null)}
          className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300 cursor-pointer"
          title="ক্লিক করে হাইড করুন"
        >
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border ${
            syncToast.type === 'success' 
              ? 'bg-emerald-900 text-white border-emerald-700' 
              : 'bg-rose-900 text-white border-rose-700'
          }`}>
            {syncToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{syncToast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header with Branding & Navigation Tabs */}
      <Header
        config={config}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onOpenReportModal={handleOpenReportModal}
        onExportCsv={handleExportCsv}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => {
          setIsAdminLoginModalOpen(true);
          pushHistoryStep('admin-login');
        }}
        onAdminLogout={() => {
          if (onAdminLogout) onAdminLogout();
          setSyncToast({ message: 'এডমিন লগআউট সফল হয়েছে', type: 'success' });
        }}
        onOpenNewMonthModal={() => {
          setIsNewMonthModalOpen(true);
          pushHistoryStep('new-month');
        }}
        onExit={onExit}
        onOpenDriveBackup={onOpenDriveBackup}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => {
          if (onAdminLogin) onAdminLogin();
          setSyncToast({ message: 'এডমিন লগইন সফল হয়েছে! এখন নতুন এন্ট্রি করতে পারবেন।', type: 'success' });
          handleNavChange('new_entry');
        }}
      />

      {/* VIEW 1: DASHBOARD VIEW (NO TRANSACTION LIST AT BOTTOM!) */}
      {activeNav === 'dashboard' && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
          {/* Online Cloud Database Status Banner */}
          <div className="hidden md:flex bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-indigo-950/40 border border-emerald-300/80 dark:border-emerald-800/80 rounded-2xl p-3 sm:px-4 flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>
                <strong className="text-emerald-950 dark:text-emerald-300 font-bold">অনলাইন ক্লাউড ডেটাবেস সক্রিয়:</strong> আপনার আয়-ব্যয় ও মালামাল স্টকের সমস্ত ডেটা রিয়েল-টাইম নিরাপদ ও সংরক্ষণ করা হচ্ছে।
              </span>
            </div>
            <button
              onClick={() => fetchDataSilent()}
              title="তথ্য রিফ্রেশ করুন"
              className="shrink-0 px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-1.5 transition shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>ডেটা রিফ্রেশ</span>
            </button>
          </div>

          {/* 5 Interactive Colorful KPI Cards (2 per line on mobile: grid-cols-2 lg:grid-cols-4) */}
          <StatsCards
            totalIncome={stats.totalIncome}
            totalExpense={stats.totalExpense}
            netProfit={stats.netProfit}
            paidSalaries={stats.paidSalaries}
            totalBandwidthOps={stats.totalBandwidthOps}
            incomeCount={stats.incomeCount}
            expenseCount={stats.expenseCount}
            staffCount={stats.staffCount}
            onCardClick={handleCardClick}
            onNavigateToLedger={() => handleNavChange('transactions')}
            currencySymbol={config.currencySymbol}
          />

          {/* 
            ANIMATED ENTRY FORM TRIGGER ON DASHBOARD:
            "নতুন লেনদেন এন্ট্রি ফরম দেখাবে না লেখা এনিমেশন হবে চাপ দিলে ফর্ম আসবে , ডেটা হারাবে না"
          */}
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            isSubmitting={isSubmitting}
            selectedMonth={selectedMonth}
            initialType={formInitialType}
            initialCategory={formInitialCategory}
            isOpenInitially={false}
            isAdminLoggedIn={isAdminLoggedIn}
            onRequireLogin={() => setIsAdminLoginModalOpen(true)}
          />

          {/* ISP Revenue/Expense Stream Analysis & Quick Actions (NO TRANSACTION LIST!) */}
          <DashboardOverview
            transactions={transactions}
            salaries={salaries}
            staffList={staffList}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            onOpenCardDetail={handleCardClick}
            onOpenNewTransaction={handleOpenNewTransaction}
            onNavigateToStaff={() => handleNavChange('staff')}
            onNavigateToLedger={() => handleNavChange('transactions')}
            config={config}
            availableMonths={availableMonths}
            isAdminLoggedIn={isAdminLoggedIn}
          />

          {/* Dedicated Internet & Cable Network Business Shortcuts & PWA Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
            {/* 1. Inventory & Equipment Hub Card */}
            <div 
              onClick={() => handleNavChange('inventory')}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Boxes className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      ক্যাবল ও মালামাল স্টক (Inventory)
                    </h3>
                    {inventoryItems.some(i => i.currentStock <= i.minStockAlert) && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {inventoryItems.length} টি আইটেম • ড্রপ ক্যাবল, ONU, রাউটার ও স্প্লিটার ট্র্যাকিং
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 shrink-0">
                স্টক দেখুন →
              </span>
            </div>

            {/* 2. Visual Analytics Hub Card */}
            <div 
              onClick={() => handleNavChange('analytics')}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-cyan-300 dark:hover:border-cyan-700 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    চার্ট ও গ্রাফিক্যাল রিপোর্ট (Analytics)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    মাসিক আয়-ব্যয় তুলনা, লাভ-মার্জিন ও ব্যান্ডউইথ খরচের অনুপাত
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 shrink-0">
                চার্ট দেখুন →
              </span>
            </div>
          </div>

          {/* PWA In-App Install Banner */}
          <PWAInstallButton variant="banner" />
        </div>
      )}

      {/* VIEW 2: STAFF & SALARY MANAGEMENT (পে-রোল ও স্টাফ বেতন হিসাব) */}
      {activeNav === 'staff' && (
        <StaffSalaryManager
          staffList={effectiveStaffList}
          salaries={salaries}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          onAddStaff={handleAddStaff}
          onUpdateStaff={handleUpdateStaff}
          onDeleteStaff={handleDeleteStaff}
          onDisburseSalary={handleDisburseSalary}
          onDeleteSalary={handleDeleteSalary}
          onViewSalarySlip={handleViewSalarySlip}
          config={config}
          onBackToDashboard={() => handleNavChange('dashboard')}
          isAdminLoggedIn={isAdminLoggedIn}
          onRequireLogin={() => setIsAdminLoginModalOpen(true)}
          staffAccounts={staffAccounts}
          onSaveStaffAccounts={handleSaveStaffAccounts}
          quickHisabOwners={quickHisabOwners}
        />
      )}

      {/* VIEW 3: NEW TRANSACTION ENTRY */}
      {activeNav === 'new_entry' && (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-200">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            isSubmitting={isSubmitting}
            initialType={formInitialType}
            initialCategory={formInitialCategory}
            isOpenInitially={true}
            isAdminLoggedIn={isAdminLoggedIn}
            onRequireLogin={() => setIsAdminLoginModalOpen(true)}
          />
        </div>
      )}

      {/* VIEW 4: COMPLETE TRANSACTION LEDGER (পৃথক লেনদেন খতিয়ান) */}
      {activeNav === 'transactions' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                কোম্পানির পূর্ণাঙ্গ লেনদেন খতিয়ান (Transaction Ledger)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                সর্বমোট {transactions.length} টি আয় ও ব্যয়ের বিস্তারিত রেকর্ড ও অনুসন্ধান
              </p>
            </div>
            <button
              onClick={() => handleOpenNewTransaction()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>+ নতুন এন্ট্রি</span>
            </button>
          </div>

          <TransactionList
            transactions={transactions}
            activeTypeFilter={activeTypeFilter}
            onTypeFilterChange={setActiveTypeFilter}
            onSelectTransaction={(txn) => {
              setSelectedTransaction(txn);
              setInitialEditInModal(false);
              setIsDetailModalOpen(true);
              pushHistoryStep('txn-detail');
            }}
            onEditTransaction={(txn) => {
              if (!isAdminLoggedIn) {
                setIsAdminLoginModalOpen(true);
                return;
              }
              setSelectedTransaction(txn);
              setInitialEditInModal(true);
              setIsDetailModalOpen(true);
              pushHistoryStep('txn-edit');
            }}
            onDeleteTransaction={handleDeleteTransaction}
            currencySymbol={config.currencySymbol}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        </div>
      )}

      {/* VIEW 5: FULL PAGE CARD DETAIL */}
      {activeNav === 'card_detail' && (
        <CardDetailPage
          type={activeCardDetail}
          transactions={transactions}
          salaries={salaries}
          staffList={staffList}
          config={config}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          onOpenNewTransaction={handleOpenNewTransaction}
          onNavigateToStaff={() => handleNavChange('staff')}
          onNavigateToLedger={(filterType) => {
            if (filterType) {
              setActiveTypeFilter(filterType);
            }
            handleNavChange('transactions');
          }}
          onSelectTransaction={(txn) => {
            setSelectedTransaction(txn);
            setInitialEditInModal(false);
            setIsDetailModalOpen(true);
            pushHistoryStep('txn-detail');
          }}
          onDeleteTransaction={handleDeleteTransaction}
          onViewSalarySlip={handleViewSalarySlip}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* VIEW: INVENTORY & EQUIPMENT TRACKING (ক্যাবল ও নেটওয়ার্ক মালামাল স্টক) */}
      {activeNav === 'inventory' && (
        <div className="animate-in fade-in duration-200">
          <InventoryManager
            items={inventoryItems}
            logs={inventoryLogs}
            onAddItem={handleAddInventoryItem}
            onDeleteItem={handleDeleteInventoryItem}
            onDeleteLog={handleDeleteInventoryLog}
            onLogMovement={handleLogMovement}
            currencySymbol={config.currencySymbol}
            onRefresh={fetchDataSilent}
            isAdminLoggedIn={isAdminLoggedIn}
            onRequireLogin={() => setIsAdminLoginModalOpen(true)}
            onOpenReportPage={(tab) => {
              setInventoryReportInitialTab(tab);
              handleNavChange('inventory_report');
            }}
          />
        </div>
      )}

      {/* VIEW: FULL PAGE INVENTORY REPORT */}
      {activeNav === 'inventory_report' && (
        <div className="animate-in fade-in duration-200">
          <InventoryReportPage
            items={inventoryItems}
            logs={inventoryLogs}
            config={config}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            currencySymbol={config.currencySymbol}
            availableMonths={availableMonths}
            initialTab={inventoryReportInitialTab}
            onBack={() => handleNavChange('inventory')}
          />
        </div>
      )}

      {/* VIEW: FULL PAGE MONTHLY REPORT */}
      {activeNav === 'report' && (
        <div className="animate-in fade-in duration-200">
          <MonthlyReportModal
            isOpen={true}
            isFullPage={true}
            onClose={handleGoBack}
            transactions={transactions}
            config={config}
            currencySymbol={config.currencySymbol}
            availableMonths={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}


      {/* VIEW: VISUAL ANALYTICS & PROFIT-LOSS CHARTS (চার্ট ও গ্রাফিক্যাল রিপোর্ট) */}
      {activeNav === 'analytics' && (
        <div className="animate-in fade-in duration-200">
          <VisualAnalytics
            transactions={transactions}
            currencySymbol={config.currencySymbol}
            onOpenCardDetail={handleCardClick}
          />
        </div>
      )}



      {/* Bottom Information Tip */}
      <footer className="text-center py-6 text-xs text-slate-500 no-print">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-200/70 border border-slate-300/40 text-slate-600 font-medium">
          💡 ড্যাশবোর্ডের যেকোনো রঙিন কার্ডে ক্লিক করে নির্দিষ্ট তথ্য ও লেনদেন দেখুন | ডিভাইসের ব্যাক বাটন কাজ করবে
        </span>
      </footer>

      {/* Modern Mobile Bottom Navigation Bar with Side Drawer Menu */}
      <MobileBottomNav
        activeNav={activeNav === 'card_detail' ? 'dashboard' : activeNav}
        onNavChange={handleNavChange}
        onOpenReportModal={handleOpenReportModal}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onOpenNewMonthModal={() => {
          setIsNewMonthModalOpen(true);
          pushHistoryStep('new-month');
        }}
        availableMonths={availableMonths}
        stats={stats}
        config={config}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => {
          setIsAdminLoginModalOpen(true);
          pushHistoryStep('admin-login');
        }}
        onAdminLogout={() => {
          if (onAdminLogout) onAdminLogout();
          setSyncToast({ message: 'এডমিন লগআউট সফল হয়েছে', type: 'success' });
        }}
        isDrawerOpen={isMobileDrawerOpen}
        onToggleDrawer={() => {
          if (!isMobileDrawerOpen) {
            pushHistoryStep('mobile_drawer', activeNav, { isDrawerOpen: true });
            setIsMobileDrawerOpen(true);
          } else {
            try {
              if (window.history.state && (window.history.state.isDrawerOpen || window.history.state.appStep === 'mobile_drawer')) {
                window.history.back();
                return;
              }
            } catch {}
            setIsMobileDrawerOpen(false);
          }
        }}
        onCloseDrawer={() => {
          try {
            if (window.history.state && (window.history.state.isDrawerOpen || window.history.state.appStep === 'mobile_drawer')) {
              window.history.back();
              return;
            }
          } catch {}
          setIsMobileDrawerOpen(false);
        }}
      />

      {/* MODAL 1: CARD DETAIL MODAL (Opens when clicking any Dashboard Card!) */}
      <CardDetailModal
        type={activeCardDetail}
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setActiveCardDetail(null);
        }}
        transactions={transactions}
        salaries={salaries}
        staffList={staffList}
        config={config}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onOpenNewTransaction={handleOpenNewTransaction}
        onNavigateToStaff={() => handleNavChange('staff')}
        onNavigateToLedger={(filterType) => {
          if (filterType) {
            setActiveTypeFilter(filterType);
          }
          setIsCardModalOpen(false);
          setActiveCardDetail(null);
          handleNavChange('transactions');
        }}
        onSelectTransaction={(txn) => {
          setSelectedTransaction(txn);
          setInitialEditInModal(false);
          setIsDetailModalOpen(true);
          pushHistoryStep('txn-detail');
        }}
        onDeleteTransaction={handleDeleteTransaction}
        onViewSalarySlip={handleViewSalarySlip}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* MODAL 2: PRINTABLE SALARY SLIP / VOUCHER MODAL */}
      <SalarySlipModal
        salary={selectedSalarySlip}
        isOpen={isSalarySlipOpen}
        onClose={() => {
          setIsSalarySlipOpen(false);
          setSelectedSalarySlip(null);
        }}
        config={config}
      />

      {/* MODAL 3: TRANSACTION DETAIL & EDIT MODAL */}
      <DetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
        currencySymbol={config.currencySymbol}
        initialEditMode={initialEditInModal}
        isAdminLoggedIn={isAdminLoggedIn}
      />



      {/* MODAL 6: NEW MONTH MODAL (Admin Only for Zero Start Dashboard) */}
      <NewMonthModal
        isOpen={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        onConfirmMonth={handleAddNewMonth}
        currentSelectedMonth={selectedMonth}
        existingMonths={availableMonths}
        isAdminLoggedIn={isAdminLoggedIn}
      />
    </main>
  );
}
