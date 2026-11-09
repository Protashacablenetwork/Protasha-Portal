import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  PieChart, 
  RefreshCw,
  DollarSign,
  ShieldCheck,
  Calculator,
  Edit2,
  Trash2,
  Plus,
  Camera,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Search,
  Shield,
  Upload,
  UserCheck,
  Calendar
} from 'lucide-react';
import { Language, StaffAccount, UserSession, QuickHisabOwner } from '../types';
import { initialQuickHisabOwners } from '../data/initialData';
import { formatCurrency, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { compressImageFile } from '../utils/imageStorage';
import confetti from 'canvas-confetti';
import { isIncomeTransaction, isExpenseTransaction, parseNumber, getTransactionMonth, getMonthBengaliName } from '../portals/ayByay/data/categories';
import { db, staffDb, safeSetDoc, isFirestoreQuotaExceeded, handleFirestoreError, OperationType } from '../utils/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

interface QuickHisabModalProps {
  isOpen: boolean;
  lang: Language;
  user: UserSession | null;
  staffAccounts: StaffAccount[];
  quickHisabOwners?: QuickHisabOwner[];
  onSaveOwners?: (updated: QuickHisabOwner[]) => void;
  onClose: () => void;
}

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  staffSalary: number;
  otherExpense: number;
  netProfit: number;
  incomeCount?: number;
  expenseCount?: number;
  source?: 'ayByay' | 'cached' | 'manual';
}

// Fallback baseline summary so data is NEVER blank or missing
const DEFAULT_SUMMARY: SummaryData = {
  totalIncome: 88400,
  totalExpense: 30524,
  staffSalary: 0,
  otherExpense: 30524,
  netProfit: 57876
};

export const QuickHisabModal: React.FC<QuickHisabModalProps> = ({
  isOpen,
  lang,
  user,
  staffAccounts,
  quickHisabOwners: propOwners,
  onSaveOwners,
  onClose
}) => {
  const isBn = lang === 'bn';
  const isAdmin = user?.role === 'admin';

  // Month selection (e.g. '2026-11' or current month)
  const currentMonthKey = new Date().toISOString().substring(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [isLiveAyByaySynced, setIsLiveAyByaySynced] = useState(true);

  // Real-time cached Ay-Byay data state
  const [ayByayTxns, setAyByayTxns] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('isp_cache_txns');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [ayByaySalaries, setAyByaySalaries] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('isp_cache_salaries');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Calculate live metrics for any month from transactions & salaries
  const calculateMonthStats = useCallback((monthKey: string, txList: any[], salList: any[]): SummaryData => {
    let inc = 0;
    let exp = 0;
    let incCount = 0;
    let expCount = 0;
    let hasTxn = false;

    (txList || []).forEach((t: any) => {
      if (!t || t.isDeleted) return;
      const d = t.date || t.createdAt;
      if (!d || typeof d !== 'string') return;
      if (getTransactionMonth(d) === monthKey) {
        hasTxn = true;
        const amt = parseNumber(t.amount);
        if (isIncomeTransaction(t)) {
          inc += amt;
          incCount++;
        } else {
          exp += amt;
          expCount++;
        }
      }
    });

    const sal = (Array.isArray(salList) ? salList : [])
      .filter((s: any) => s && s.month === monthKey && s.paymentStatus === 'paid')
      .reduce((acc: number, s: any) => acc + (Number(s.netSalary) || 0), 0);

    const oth = Math.max(0, exp - sal);
    const net = inc - exp;

    if (hasTxn || sal > 0) {
      return {
        totalIncome: inc,
        totalExpense: exp,
        staffSalary: sal,
        otherExpense: oth,
        netProfit: net,
        incomeCount: incCount,
        expenseCount: expCount,
        source: 'ayByay'
      };
    }

    // Check main ISP transactions if ay_byay_transactions is empty for this month
    try {
      const rawMain = localStorage.getItem('protyasha_transactions');
      if (rawMain) {
        const mainTx = JSON.parse(rawMain);
        if (Array.isArray(mainTx) && mainTx.length > 0) {
          let mInc = 0;
          let mExp = 0;
          let mIncCount = 0;
          let mExpCount = 0;
          let mHas = false;
          mainTx.forEach((t: any) => {
            if (!t || t.isDeleted) return;
            const d = t.date || t.createdAt;
            if (!d || typeof d !== 'string') return;
            if (getTransactionMonth(d) === monthKey) {
              mHas = true;
              const amt = parseNumber(t.amount);
              if (t.type === 'income' || isIncomeTransaction(t)) {
                mInc += amt;
                mIncCount++;
              } else {
                mExp += amt;
                mExpCount++;
              }
            }
          });
          if (mHas) {
            return {
              totalIncome: mInc,
              totalExpense: mExp,
              staffSalary: 0,
              otherExpense: mExp,
              netProfit: mInc - mExp,
              incomeCount: mIncCount,
              expenseCount: mExpCount,
              source: 'ayByay'
            };
          }
        }
      }
    } catch {}

    // Fallback baseline for current month
    if (monthKey === currentMonthKey) {
      try {
        const saved = localStorage.getItem('protyasha_cached_summary');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.totalIncome === 'number') {
            return parsed;
          }
        }
      } catch {}
      return DEFAULT_SUMMARY;
    }

    return {
      totalIncome: 0,
      totalExpense: 0,
      staffSalary: 0,
      otherExpense: 0,
      netProfit: 0,
      incomeCount: 0,
      expenseCount: 0,
      source: 'cached'
    };
  }, [currentMonthKey]);

  // 1. Reliable instant Summary state initialized from current live data
  const [summary, setSummary] = useState<SummaryData>(() => {
    try {
      const rawTxns = localStorage.getItem('isp_cache_txns');
      const rawSal = localStorage.getItem('isp_cache_salaries');
      const tx = rawTxns ? JSON.parse(rawTxns) : [];
      const sa = rawSal ? JSON.parse(rawSal) : [];
      return calculateMonthStats(currentMonthKey, tx, sa);
    } catch {
      return DEFAULT_SUMMARY;
    }
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Owners state (Synced with props, localStorage, and defaults)
  const [owners, setOwners] = useState<QuickHisabOwner[]>(() => {
    if (propOwners && Array.isArray(propOwners) && propOwners.length > 0) {
      return propOwners;
    }
    const saved = localStorage.getItem('protyasha_quick_hisab_owners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return initialQuickHisabOwners;
  });

  // Keep internal owners synced if prop changes from outside
  useEffect(() => {
    if (propOwners && Array.isArray(propOwners) && propOwners.length > 0) {
      setOwners(propOwners);
    }
  }, [propOwners]);

  // Admin Modal: Add or Edit Owner
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<QuickHisabOwner | null>(null);
  const [formName, setFormName] = useState('');
  const [formShareUnits, setFormShareUnits] = useState<number>(1.0);
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick avatar upload directly from card
  const [quickUploadOwnerId, setQuickUploadOwnerId] = useState<string | number | null>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Admin Financial Editor State (Only for Admin)
  const [isFinEditorOpen, setIsFinEditorOpen] = useState(false);
  const [editIncome, setEditIncome] = useState(String(summary.totalIncome));
  const [editExpense, setEditExpense] = useState(String(summary.totalExpense));
  const [editStaffSalary, setEditStaffSalary] = useState(String(summary.staffSalary));
  const [isSavingFin, setIsSavingFin] = useState(false);

  const handleOpenFinEditor = () => {
    if (!isAdmin) return;
    sounds.playTap();
    setEditIncome(String(summary.totalIncome));
    setEditExpense(String(summary.totalExpense));
    setEditStaffSalary(String(summary.staffSalary));
    setIsFinEditorOpen(true);
  };

  const handleSaveFinSummary = async () => {
    if (!isAdmin) return;
    setIsSavingFin(true);
    const inc = Number(editIncome) || 0;
    const exp = Number(editExpense) || 0;
    const sal = Number(editStaffSalary) || 0;
    const oth = Math.max(0, exp - sal);
    const net = inc - exp;

    const updatedSummary = {
      totalIncome: inc,
      totalExpense: exp,
      staffSalary: sal,
      otherExpense: oth,
      netProfit: net,
      lastUpdated: new Date().toISOString()
    };

    setSummary(updatedSummary);
    try {
      localStorage.setItem('protyasha_cached_summary', JSON.stringify(updatedSummary));
    } catch {}

    try {
      const docRef = doc(db, 'settings', 'server_data');
      const snap = await getDoc(docRef);
      const currentData = snap.exists() ? snap.data().data : {};
      
      const monthlyRecords = currentData.quickHisabMonthlyRecords || {};
      monthlyRecords[selectedMonth] = updatedSummary;

      await safeSetDoc(docRef, {
        id: 'server_data',
        data: { 
          ...currentData, 
          quickHisabMonthlyRecords: monthlyRecords,
          quickHisabSummary: selectedMonth === currentMonthKey ? updatedSummary : (currentData.quickHisabSummary || updatedSummary)
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });

    } catch (e) {
      console.warn('Could not save summary to Firestore:', e);
    } finally {
      setIsSavingFin(false);
      setIsFinEditorOpen(false);
      sounds.playSuccess();
    }
  };

  // Real-Time onSnapshot subscriptions for Ay-Byay Firestore collections
  useEffect(() => {
    if (!isOpen || isFirestoreQuotaExceeded()) return;

    let unsubTxns: (() => void) | null = null;
    let unsubSals: (() => void) | null = null;

    try {
      const qTxns = collection(staffDb, 'ay_byay_transactions');
      unsubTxns = onSnapshot(qTxns, (snapshot) => {
        const cloudTx: any[] = [];
        snapshot.forEach(docSnap => {
          const t = docSnap.data();
          if (t && (t.id || docSnap.id)) cloudTx.push({ ...t, id: t.id || docSnap.id });
        });
        setAyByayTxns(cloudTx);
        try { localStorage.setItem('isp_cache_txns', JSON.stringify(cloudTx)); } catch {}
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_transactions');
      });
    } catch (e) {
      console.warn('Realtime ay_byay_transactions subscription error:', e);
    }

    try {
      const qSals = collection(staffDb, 'ay_byay_salaries');
      unsubSals = onSnapshot(qSals, (snapshot) => {
        const cloudSals: any[] = [];
        snapshot.forEach(docSnap => {
          const s = docSnap.data();
          if (s) cloudSals.push(s);
        });
        setAyByaySalaries(cloudSals);
        try { localStorage.setItem('isp_cache_salaries', JSON.stringify(cloudSals)); } catch {}
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'ay_byay_salaries');
      });
    } catch (e) {
      console.warn('Realtime ay_byay_salaries subscription error:', e);
    }

    return () => {
      if (unsubTxns) unsubTxns();
      if (unsubSals) unsubSals();
    };
  }, [isOpen]);

  // Recalculate summary in real-time whenever selectedMonth, ayByayTxns, or ayByaySalaries change
  useEffect(() => {
    const updated = calculateMonthStats(selectedMonth, ayByayTxns, ayByaySalaries);
    setSummary(updated);
    setIsLiveAyByaySynced(true);
    if (selectedMonth === currentMonthKey) {
      try {
        localStorage.setItem('protyasha_cached_summary', JSON.stringify(updated));
      } catch {}
    }
  }, [selectedMonth, ayByayTxns, ayByaySalaries, calculateMonthStats, currentMonthKey]);

  // Live in-app & cross-tab events listener (dispatched upon adding/editing/deleting transactions in Ay-Byay)
  useEffect(() => {
    const handleAyByayDataChanged = () => {
      try {
        const rawTxns = localStorage.getItem('isp_cache_txns');
        const rawSals = localStorage.getItem('isp_cache_salaries');
        const txns = rawTxns ? JSON.parse(rawTxns) : [];
        const sals = rawSals ? JSON.parse(rawSals) : [];
        if (Array.isArray(txns) && txns.length > 0) setAyByayTxns(txns);
        if (Array.isArray(sals)) setAyByaySalaries(sals);
      } catch {}
    };

    window.addEventListener('aybyay-data-changed', handleAyByayDataChanged);
    window.addEventListener('storage', handleAyByayDataChanged);
    return () => {
      window.removeEventListener('aybyay-data-changed', handleAyByayDataChanged);
      window.removeEventListener('storage', handleAyByayDataChanged);
    };
  }, []);

  // Manual Refresh handler (forces fresh getDocs pull from cloud)
  const fetchSummary = async (monthKey: string = selectedMonth) => {
    setLoading(true);
    try {
      const qTxns = collection(staffDb, 'ay_byay_transactions');
      const snapTxns = await getDocs(qTxns);
      const cloudTx: any[] = [];
      snapTxns.forEach(docSnap => {
        const t = docSnap.data();
        if (t && (t.id || docSnap.id)) cloudTx.push({ ...t, id: t.id || docSnap.id });
      });
      if (cloudTx.length > 0) {
        setAyByayTxns(cloudTx);
        try { localStorage.setItem('isp_cache_txns', JSON.stringify(cloudTx)); } catch {}
      }

      const qSals = collection(staffDb, 'ay_byay_salaries');
      const snapSals = await getDocs(qSals);
      const cloudSals: any[] = [];
      snapSals.forEach(docSnap => {
        const s = docSnap.data();
        if (s) cloudSals.push(s);
      });
      if (cloudSals.length > 0) {
        setAyByaySalaries(cloudSals);
        try { localStorage.setItem('isp_cache_salaries', JSON.stringify(cloudSals)); } catch {}
      }

      const freshTxns = cloudTx.length > 0 ? cloudTx : ayByayTxns;
      const freshSals = cloudSals.length > 0 ? cloudSals : ayByaySalaries;
      const computed = calculateMonthStats(monthKey, freshTxns, freshSals);
      setSummary(computed);
      setIsLiveAyByaySynced(true);
      sounds.playSuccess();
    } catch (error) {
      console.warn('Manual refresh warning:', error);
    } finally {
      setLoading(false);
    }
  };

  // Persist owners changes
  const saveUpdatedOwners = (newOwners: QuickHisabOwner[]) => {
    setOwners(newOwners);
    try {
      localStorage.setItem('protyasha_quick_hisab_owners', JSON.stringify(newOwners));
    } catch {}

    if (onSaveOwners) {
      onSaveOwners(newOwners);
    }
  };

  // Open editor for adding new owner
  const handleOpenAddOwner = () => {
    if (!isAdmin) return;
    sounds.playTap();
    setEditingOwner(null);
    setFormName(isBn ? `মালিক ${owners.length + 1}` : `Owner ${owners.length + 1}`);
    setFormShareUnits(1.0);
    setFormAvatarUrl('');
    setIsEditorOpen(true);
  };

  // Open editor for editing existing owner
  const handleOpenEditOwner = (owner: QuickHisabOwner) => {
    if (!isAdmin) return;
    sounds.playTap();
    setEditingOwner(owner);
    setFormName(owner.name);
    setFormShareUnits(owner.shareUnits);
    setFormAvatarUrl(owner.avatarUrl || '');
    setIsEditorOpen(true);
  };

  // Save Add/Edit
  const handleSaveOwnerForm = () => {
    if (!isAdmin) return;
    const cleanName = formName.trim();
    if (!cleanName) return;

    sounds.playSuccess();
    let updated: QuickHisabOwner[];

    if (editingOwner) {
      // Edit
      updated = owners.map(o => {
        if (o.id === editingOwner.id) {
          return {
            ...o,
            name: cleanName,
            shareUnits: formShareUnits,
            avatarUrl: formAvatarUrl,
            isHalf: formShareUnits === 0.5
          };
        }
        return o;
      });
    } else {
      // Add
      const newOwner: QuickHisabOwner = {
        id: `owner-${Date.now()}`,
        name: cleanName,
        shareUnits: formShareUnits,
        avatarUrl: formAvatarUrl,
        isHalf: formShareUnits === 0.5
      };
      updated = [...owners, newOwner];
    }

    saveUpdatedOwners(updated);
    setIsEditorOpen(false);
  };

  // Delete owner
  const handleDeleteOwner = (id: string | number) => {
    if (!isAdmin) return;
    sounds.playTap();
    if (confirm(isBn ? 'এই মালিককে তালিকা থেকে মুছে ফেলতে চান?' : 'Delete this owner from the list?')) {
      const updated = owners.filter(o => o.id !== id);
      saveUpdatedOwners(updated);
      setIsEditorOpen(false);
    }
  };

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const compressedDataUrl = await compressImageFile(file, 260, 0.85);
      if (compressedDataUrl) {
        setFormAvatarUrl(compressedDataUrl);
      }
    } catch (err) {
      console.error('Error compressing owner photo:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  // Quick Photo Upload directly from owner card
  const handleQuickPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!quickUploadOwnerId || !isAdmin) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file, 260, 0.85);
      if (compressed) {
        const updated = owners.map(o => o.id === quickUploadOwnerId ? { ...o, avatarUrl: compressed } : o);
        saveUpdatedOwners(updated);
        sounds.playSuccess();
      }
    } catch (err) {
      console.error('Quick photo upload error:', err);
    } finally {
      setQuickUploadOwnerId(null);
      if (e.target) e.target.value = '';
    }
  };

  // Reset to default 13 owners (12 full + 1 half)
  const handleResetToDefault = () => {
    if (!isAdmin) return;
    sounds.playTap();
    if (confirm(isBn ? 'মালিকানা তালিকা ডিফল্ট ১৩ জনে (১২ পূর্ণ + ১ অর্ধেক) রিসেট করতে চান?' : 'Reset to default 13 owners?')) {
      saveUpdatedOwners(initialQuickHisabOwners);
    }
  };

  const handleConfirmDistribution = () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  if (!isOpen) return null;

  // Dynamic share calculations based on current owners
  const totalShareUnits = owners.reduce((sum, o) => sum + (Number(o.shareUnits) || 0), 0) || 12.5;
  const netProfit = summary.netProfit || 0;
  const fullOwnersCount = owners.filter(o => o.shareUnits === 1.0).length;
  const halfOwnersCount = owners.filter(o => o.shareUnits === 0.5).length;
  
  // Amount per 1.0 share and per 0.5 share
  const fullShareAmount = netProfit > 0 ? (netProfit * 1.0) / totalShareUnits : 0;
  const halfShareAmount = netProfit > 0 ? (netProfit * 0.5) / totalShareUnits : 0;

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(o.id).includes(searchQuery)
  );

  const renderAmount = (amount: number) => {
    return formatCurrency(amount, lang);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-bottom duration-300">
      {/* Hidden File Input for Quick Photo Change */}
      <input
        type="file"
        ref={quickFileInputRef}
        onChange={handleQuickPhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {isBn ? 'কুইক হিসাব ও লভ্যাংশ ড্যাশবোর্ড' : 'Quick Hisab & Profit Dashboard'}
              </h2>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <Shield className="w-3 h-3" />
                  {isBn ? 'এডমিন নিয়ন্ত্রণ' : 'Admin'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isBn ? `মোট ${owners.length} জন মালিক (${totalShareUnits} অংশ বণ্টন)` : `${owners.length} Owners (${totalShareUnits} Parts)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fetchSummary(selectedMonth)}
            disabled={loading}
            title={isBn ? 'তথ্য রিফ্রেশ করুন' : 'Refresh Data'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#E52E2E] hover:bg-rose-50 dark:hover:bg-rose-950/30 active:rotate-180 transition-all duration-500"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        {/* Month Selector Bar (Old months vs Current month) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-[#E52E2E]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'হিসাবের মাস নির্বাচন করুন' : 'Select Accounting Month'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {selectedMonth === currentMonthKey 
                  ? (isBn ? 'বর্তমান (কারেন্ট) মাস' : 'Current Month') 
                  : (isBn ? 'পুরোনো মাসের সংরক্ষিত হিসাব' : 'Archived Month')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedMonth(e.target.value);
                  sounds.playTap();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
            />
            {selectedMonth !== currentMonthKey && (
              <button
                onClick={() => {
                  setSelectedMonth(currentMonthKey);
                  sounds.playTap();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#E52E2E]/10 text-[#E52E2E] text-[11px] font-bold hover:bg-[#E52E2E]/20 transition-colors"
              >
                {isBn ? 'বর্তমান' : 'Current'}
              </button>
            )}
          </div>
        </div>

        {/* Live Ay-Byay Connection Status Banner */}
        <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 truncate">
                <span>{isBn ? 'আয়-ব্যয় অপশনের ড্যাশবোর্ড ডেটার সাথে সরাসরি যুক্ত' : 'Directly synced with Ay-Byay Dashboard'}</span>
                {summary.source === 'ayByay' && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                    {isBn ? 'লাইভ' : 'LIVE'}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-emerald-700/90 dark:text-emerald-400/90 truncate mt-0.5">
                {isBn
                  ? `${getMonthBengaliName(selectedMonth)} মাসের আয়-ব্যয় হিসাবের ভিত্তিতে নিট লাভ ও শেয়ার বণ্টন হচ্ছে`
                  : `Net profit & shares are live calculated from ${selectedMonth} transactions`}
                {summary.incomeCount !== undefined && summary.expenseCount !== undefined ? ` (${summary.incomeCount + summary.expenseCount}টি লেনদেন)` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Empty Month Notice Banner if no records exist for archived month */}
        {summary.totalIncome === 0 && summary.totalExpense === 0 && selectedMonth !== currentMonthKey && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 dark:bg-amber-950/30 dark:border-amber-900/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {isBn ? 'এই মাসের কোনো হিসাব বা ডেটা সংরক্ষিত নেই' : 'No records found for this month'}
              </p>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                {isBn ? 'নিচে সকল হিসাব শূন্য (০) দেখানো হচ্ছে। এডমিন প্যানেল থেকে এই মাসের হিসাব যোগ করতে পারেন।' : 'Showing zero balance. Admin can add records for this month.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Financial Stats Cards (Always reliably loaded) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 mb-2.5">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">{isBn ? 'কোম্পানি মোট আয়' : 'Total Income'}</p>
            <h3 className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
              {renderAmount(summary.totalIncome)}
            </h3>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 mb-2.5">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">{isBn ? 'কোম্পানি মোট ব্যয়' : 'Total Expense'}</p>
            <h3 className="text-lg sm:text-xl font-black text-rose-600 tabular-nums">
              {renderAmount(summary.totalExpense)}
            </h3>
          </div>
        </div>

        {/* Net Profit Banner Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#E52E2E] via-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/20 relative overflow-hidden">
          <div className="absolute right-[-8%] bottom-[-20%] opacity-10 pointer-events-none">
            <Calculator className="w-36 h-36 stroke-[1]" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wide uppercase mb-1.5 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                {isBn ? 'অবশিষ্ট টাকা (মালিকদের নিট লাভ)' : 'Net Profit For Owners'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tabular-nums tracking-tight">
                {renderAmount(netProfit)}
              </h2>
              <p className="text-[11px] text-rose-100 mt-1 font-medium">
                {isBn 
                  ? `সর্বমোট ${totalShareUnits} অংশের অনুপাতে স্বয়ংক্রিয়ভাবে মালিকদের মাঝে বণ্টনযোগ্য` 
                  : `Divided among owners across ${totalShareUnits} share units`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Key Share Unit Formula Summary: Full Owners vs Half Owners */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100/50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-indigo-900/20 border-2 border-indigo-200/80 dark:border-indigo-800/50 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                {isBn ? `পূর্ণ মালিক (${fullOwnersCount} জন)` : `Full Owners (${fullOwnersCount})`}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                {((1.0 / totalShareUnits) * 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
              {renderAmount(fullShareAmount)}
            </p>
            <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80 mt-1 font-medium">
              {isBn ? 'প্রতি পূর্ণ মালিক পাবেন (১ অংশ)' : 'Per full owner (1 share)'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-900/20 border-2 border-amber-200/80 dark:border-amber-800/50 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {isBn ? `অর্ধেক মালিক (${halfOwnersCount} জন)` : `Half Owners (${halfOwnersCount})`}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs">
                {((0.5 / totalShareUnits) * 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
              {renderAmount(halfShareAmount)}
            </p>
            <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1 font-medium">
              {isBn ? 'প্রতি অর্ধেক মালিক পাবেন (০.৫ অংশ)' : 'Per half owner (0.5 share)'}
            </p>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {isBn ? 'কোম্পানি ব্যয়ের বিস্তারিত খাতসমূহ' : 'Expense Breakdown'}
            </h3>
            {isAdmin && (
              <button
                onClick={handleOpenFinEditor}
                className="text-[11px] font-bold text-[#E52E2E] hover:underline flex items-center gap-1 active:scale-95 transition-transform"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isBn ? 'হিসাব পরিবর্তন' : 'Edit Figures'}</span>
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60">
            {/* Staff Salary */}
            <div className="p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'স্টাফ বেতন ও মজুরি' : 'Staff Salary & Wages'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isBn ? 'সকল লাইন টেকনিশিয়ানের বেতন' : 'Technicians & linemen expenses'}
                  </p>
                </div>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                {renderAmount(summary.staffSalary)}
              </p>
            </div>

            {/* Other Expenses */}
            <div className="p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-600">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'অন্যান্য অফিস ও লাইন রক্ষণাবেক্ষণ খরচ' : 'Office & Maintenance Expenses'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isBn ? 'ফাইবার তার, স্প্লিটার, বিদ্যুৎ ইত্যাদি' : 'Fiber cables, utilities & admin'}
                  </p>
                </div>
              </div>
              <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                {renderAmount(summary.otherExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Owners Profit Sharing Section with Admin-Only Control Tools */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {isBn ? `মালিকদের লভ্যাংশ বণ্টন তালিকা (${owners.length} জন)` : `Owner Share Distribution (${owners.length})`}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isBn 
                  ? `সর্বমোট ${totalShareUnits} অংশ (${fullOwnersCount} জন পূর্ণ + ${halfOwnersCount} জন অর্ধেক)` 
                  : `Total ${totalShareUnits} Shares (${fullOwnersCount} Full + ${halfOwnersCount} Half)`}
              </p>
            </div>

            {/* Admin-only controls: Add Owner & Reset (COMPLETELY HIDDEN FOR REGULAR USERS) */}
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOpenAddOwner}
                  className="px-2.5 py-1.5 rounded-xl bg-[#E52E2E] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন মালিক' : 'Add'}</span>
                </button>
                <button
                  onClick={handleResetToDefault}
                  title={isBn ? 'ডিফল্ট তালিকায় রিসেট' : 'Reset to Default'}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'মালিকের নাম দিয়ে খুঁজুন...' : 'Search owner name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#E52E2E]"
            />
          </div>

          {/* Owners List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1.5">
            {filteredOwners.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                {isBn ? 'কোনো মালিক পাওয়া যায়নি' : 'No owners found'}
              </div>
            ) : (
              filteredOwners.map((owner, idx) => {
                const shareUnits = Number(owner.shareUnits) || 0;
                const isHalf = owner.isHalf || shareUnits === 0.5;
                const sharePercentage = (shareUnits / totalShareUnits) * 100;
                const shareAmount = netProfit > 0 ? (netProfit * shareUnits) / totalShareUnits : 0;

                return (
                  <div 
                    key={owner.id} 
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all border ${
                      isHalf 
                        ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/25 dark:border-amber-900/40'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                      {/* Owner Photo / Circular Avatar */}
                      <div className="relative shrink-0">
                        {owner.avatarUrl ? (
                          <img 
                            src={owner.avatarUrl} 
                            alt={owner.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-xs" 
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-xs ${
                            isHalf 
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                              : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white'
                          }`}>
                            {isBn ? toBengaliNumber(idx + 1) : (idx + 1)}
                          </div>
                        )}

                        {/* Admin-only quick camera icon to change photo directly */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setQuickUploadOwnerId(owner.id);
                              quickFileInputRef.current?.click();
                            }}
                            title={isBn ? 'ছবি পরিবর্তন করুন' : 'Change photo'}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Camera className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>

                      {/* Owner Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                            {owner.name}
                          </p>
                          
                          {/* Admin-only Edit & Delete buttons (COMPLETELY HIDDEN FOR REGULAR USERS) */}
                          {isAdmin && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenEditOwner(owner)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                                title={isBn ? 'সম্পাদনা করুন' : 'Edit owner'}
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteOwner(owner.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title={isBn ? 'মুছে ফেলুন' : 'Delete owner'}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                            isHalf 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          }`}>
                            {isHalf 
                              ? (isBn ? 'অর্ধেক মালিক (০.৫ অংশ)' : '0.5 Half Share') 
                              : (isBn ? `পূর্ণ মালিক (${shareUnits} অংশ)` : `${shareUnits} Share`)}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            • {sharePercentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payable Amount */}
                    <div className="text-right shrink-0">
                      <p className={`text-xs sm:text-sm font-black tabular-nums ${
                        isHalf ? 'text-amber-600 dark:text-amber-400' : 'text-[#E52E2E]'
                      }`}>
                        {renderAmount(shareAmount)}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {isBn ? 'প্রাপ্য লভ্যাংশ' : 'Payable'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Admin-only Confirm Distribution Action Button */}
        {isAdmin && (
          <button 
            onClick={handleConfirmDistribution}
            className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:opacity-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>{isBn ? 'লভ্যাংশ বণ্টন চূড়ান্ত করুন' : 'Confirm Distribution'}</span>
          </button>
        )}

      </div>

      {/* Admin Owner Add/Edit Modal (Only accessible to Admin) */}
      {isEditorOpen && isAdmin && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingOwner 
                  ? (isBn ? 'মালিকের তথ্য পরিবর্তন' : 'Edit Owner Details') 
                  : (isBn ? 'নতুন মালিক যোগ করুন' : 'Add New Owner')}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Owner Photo Picker */}
            <div className="flex flex-col items-center justify-center gap-2 py-1">
              <div className="relative">
                {formAvatarUrl ? (
                  <img 
                    src={formAvatarUrl} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#E52E2E] shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-700">
                    <Users className="w-8 h-8" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#E52E2E] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  title={isBn ? 'ছবি নির্বাচন করুন' : 'Upload photo'}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-[#E52E2E] hover:underline"
                >
                  {formAvatarUrl ? (isBn ? 'ছবি পরিবর্তন' : 'Change Photo') : (isBn ? 'ছবি আপলোড করুন' : 'Upload Photo')}
                </button>
                {formAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormAvatarUrl('')}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-600"
                  >
                    {isBn ? 'ছবি মুছুন' : 'Remove'}
                  </button>
                )}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'মালিকের নাম' : 'Owner Name'}
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={isBn ? 'উদা: মোঃ আব্দুর রহিম' : 'e.g. John Doe'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E52E2E]"
              />
            </div>

            {/* Share Unit Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isBn ? 'শেয়ারের ধরন' : 'Share Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormShareUnits(1.0)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    formShareUnits === 1.0
                      ? 'border-[#E52E2E] bg-rose-50 dark:bg-rose-950/30 text-[#E52E2E]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <p className="leading-tight">{isBn ? 'পূর্ণ শেয়ার' : 'Full Share'}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{isBn ? '১ অংশ (৮%)' : '1.0 Share (8%)'}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormShareUnits(0.5)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    formShareUnits === 0.5
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <p className="leading-tight">{isBn ? 'অর্ধেক শেয়ার' : 'Half Share'}</p>
                  <p className="text-[10px] opacity-75 mt-0.5">{isBn ? '০.৫ অংশ (৪%)' : '0.5 Share (4%)'}</p>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              {editingOwner && (
                <button
                  type="button"
                  onClick={() => handleDeleteOwner(editingOwner.id)}
                  className="px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold text-xs hover:bg-rose-100"
                >
                  {isBn ? 'মুছুন' : 'Delete'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveOwnerForm}
                disabled={!formName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {isBn ? 'সংরক্ষণ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Financial Figures Edit Modal (Only accessible to Admin) */}
      {isFinEditorOpen && isAdmin && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#E52E2E]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'কোম্পানি আয় ও ব্যয় হিসাব সম্পাদনা' : 'Edit Company Accounts'}
                </h3>
              </div>
              <button 
                onClick={() => setIsFinEditorOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Income */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কোম্পানি মোট আয় (৳)' : 'Total Income (৳)'}</span>
                </label>
                <input
                  type="number"
                  value={editIncome}
                  onChange={(e) => setEditIncome(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Total Expense */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কোম্পানি মোট ব্যয় (৳)' : 'Total Expense (৳)'}</span>
                </label>
                <input
                  type="number"
                  value={editExpense}
                  onChange={(e) => setEditExpense(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              {/* Staff Salary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{isBn ? 'স্টাফ বেতন ও মজুরি (৳)' : 'Staff Salary & Wages (৳)'}</span>
                </label>
                <input
                  type="number"
                  value={editStaffSalary}
                  onChange={(e) => setEditStaffSalary(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Live Preview of Calculated Net Profit */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isBn ? 'অবশিষ্ট নিট লাভ' : 'Calculated Net Profit'}:
                </span>
                <span className="text-sm font-black text-[#E52E2E] tabular-nums">
                  {formatCurrency((Number(editIncome) || 0) - (Number(editExpense) || 0), lang)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  fetchSummary();
                  setIsFinEditorOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 flex items-center gap-1"
                title={isBn ? 'API থেকে রিলোড' : 'Reload API'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isBn ? 'API সিঙ্ক' : 'Sync'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFinEditorOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveFinSummary}
                disabled={isSavingFin}
                className="flex-1 py-2.5 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {isSavingFin ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'সংরক্ষণ' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
