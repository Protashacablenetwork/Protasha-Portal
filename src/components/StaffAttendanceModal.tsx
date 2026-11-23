import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  UserCheck,
  Clock,
  CalendarOff,
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  MessageSquare,
  Users,
  Wallet,
  RotateCcw,
  Lock,
  KeyRound,
  LogOut,
  ShieldCheck,
  X,
  FileText,
  Printer,
  Eye,
  EyeOff
} from 'lucide-react';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db, safeSetDoc } from '../utils/firebase';
import {
  AttendanceStatus,
  Language,
  LeaveType,
  StaffAccount,
  StaffAttendanceRecord,
  StaffSupportSession,
  UserSession
} from '../types';
import { toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import {
  formatRemainingCountdown,
  getStaffAttendanceLockState,
  normalizePhoneNumber
} from '../utils/permissions';
import { StaffAttendanceDetailView } from './StaffAttendanceDetailView';
import { StaffMonthlyPrintPreviewModal } from './StaffMonthlyPrintPreviewModal';
import { findMatchedStaffForUser, syncStaffPinEverywhere } from '../utils/staffSync';
import { isActualStaffAccount } from '../utils/ownerDueSync';

interface StaffAttendanceModalProps {
  isOpen: boolean;
  staffAccounts: StaffAccount[];
  attendanceRecords: StaffAttendanceRecord[];
  lang: Language;
  user: UserSession | null;
  onClose: () => void;
  onSaveAttendance: (record: StaffAttendanceRecord) => Promise<void>;
  onSaveBulkAttendance: (records: StaffAttendanceRecord[]) => Promise<void>;
  onDeleteAttendance: (id: string) => Promise<void>;
  onSubViewChange?: (isSubView: boolean) => void;
  onLogAction?: (action: string, actionBn: string, details: string) => void;
}

const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STATUS_META: {
  id: AttendanceStatus;
  bn: string;
  en: string;
  activeClass: string;
}[] = [
  { id: 'present', bn: 'উপস্থিত', en: 'Present', activeClass: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'late', bn: 'লেট', en: 'Late', activeClass: 'bg-amber-500 text-white border-amber-500' },
  { id: 'half_day', bn: 'অর্ধ-দিন', en: 'Half', activeClass: 'bg-sky-600 text-white border-sky-600' },
  { id: 'leave', bn: 'ছুটি', en: 'Leave', activeClass: 'bg-indigo-600 text-white border-indigo-600' },
  { id: 'absent', bn: 'অনুপস্থিত', en: 'Absent', activeClass: 'bg-rose-600 text-white border-rose-600' }
];

const LEAVE_TYPES: { id: Exclude<LeaveType, 'none'>; bn: string; en: string }[] = [
  { id: 'casual', bn: 'নৈমিত্তিক ছুটি', en: 'Casual Leave' },
  { id: 'sick', bn: 'অসুস্থতার ছুটি', en: 'Sick Leave' },
  { id: 'emergency', bn: 'জরুরি ছুটি', en: 'Emergency Leave' },
  { id: 'unpaid', bn: 'বিনা বেতনে ছুটি', en: 'Unpaid Leave' }
];

const getLocalTodayIso = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getCurrentTimeLabel = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const sanitizeRecordId = (staffId: string, date: string) => {
  const safeStaff = (staffId || 'staff').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'staff';
  const safeDate = (date || '').replace(/[^0-9-]/g, '').slice(0, 16);
  return `${safeStaff}_${safeDate}`;
};

const shiftDateByDays = (dateStr: string, delta: number) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, (d || 1) + delta);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
};

const printHtmlViaIframe = (htmlContent: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  }, 350);
};

export const StaffAttendanceModal: React.FC<StaffAttendanceModalProps> = ({
  isOpen,
  staffAccounts,
  attendanceRecords,
  lang,
  user,
  onClose,
  onSaveAttendance,
  onSaveBulkAttendance,
  onDeleteAttendance,
  onSubViewChange
}) => {
  const isBn = lang === 'bn';
  const todayIso = getLocalTodayIso();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'leaves'>('daily');
  const [selectedDetailStaffId, setSelectedDetailStaffId] = useState<string | null>(null);
  const [printPreviewStaffId, setPrintPreviewStaffId] = useState<string | null>(null);
  const [confirmDeleteDailyStaffId, setConfirmDeleteDailyStaffId] = useState<string | null>(null);
  const [isDeletingDailyId, setIsDeletingDailyId] = useState<string | null>(null);
  const [dailyFeedback, setDailyFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Shared Staff Session (works across Support Tickets & Staff Attendance)
  const [staffSession, setStaffSession] = useState<StaffSupportSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('protyasha_support_staff_session');
      if (saved) return JSON.parse(saved) as StaffSupportSession;
    } catch {}
    return null;
  });
  const [staffAuthConfig, setStaffAuthConfig] = useState<{
    globalPin: string;
    staffPins: Record<string, string>;
  }>({ globalPin: '1234', staffPins: {} });
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [staffLoginIdentifier, setStaffLoginIdentifier] = useState('');
  const [staffLoginPin, setStaffLoginPin] = useState('');
  const [staffLoginError, setStaffLoginError] = useState('');
  const [isVerifyingStaff, setIsVerifyingStaff] = useState(false);

  // Admin PIN Control modal states
  const [isPinControlOpen, setIsPinControlOpen] = useState(false);
  const [draftGlobalPin, setDraftGlobalPin] = useState('1234');
  const [draftStaffPins, setDraftStaffPins] = useState<Record<string, string>>({});
  const [pinSearchQuery, setPinSearchQuery] = useState('');
  const [showPinControlChars, setShowPinControlChars] = useState(false);
  const [isSavingPins, setIsSavingPins] = useState(false);
  const [pinControlFeedback, setPinControlFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Staff Self PIN Change modal states
  const [isChangeOwnPinOpen, setIsChangeOwnPinOpen] = useState(false);
  const [ownCurrentPin, setOwnCurrentPin] = useState('');
  const [ownNewPin, setOwnNewPin] = useState('');
  const [ownConfirmPin, setOwnConfirmPin] = useState('');
  const [showOwnPinChars, setShowOwnPinChars] = useState(false);
  const [isSavingOwnPin, setIsSavingOwnPin] = useState(false);
  const [ownPinFeedback, setOwnPinFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const subViewHistoryDepthRef = useRef(0);
  const subViewRef = useRef({
    activeTab,
    selectedDetailStaffId,
    printPreviewStaffId,
    isStaffLoginOpen,
    isPinControlOpen,
    isChangeOwnPinOpen
  });
  subViewRef.current = {
    activeTab,
    selectedDetailStaffId,
    printPreviewStaffId,
    isStaffLoginOpen,
    isPinControlOpen,
    isChangeOwnPinOpen
  };

  const pushSubViewHistory = () => {
    subViewHistoryDepthRef.current += 1;
    window.history.pushState({ attendanceSubView: true, time: Date.now() }, '');
  };

  const closeSubViewViaBack = (fallbackClose: () => void) => {
    if (subViewHistoryDepthRef.current > 0 && window.history.state?.attendanceSubView) {
      window.history.back();
    } else {
      subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      fallbackClose();
    }
  };

  useEffect(() => {
    const isSub =
      isOpen &&
      (activeTab !== 'daily' ||
        Boolean(selectedDetailStaffId) ||
        Boolean(printPreviewStaffId) ||
        isStaffLoginOpen ||
        isPinControlOpen ||
        isChangeOwnPinOpen);
    onSubViewChange?.(isSub);
    return () => {
      onSubViewChange?.(false);
    };
  }, [
    isOpen,
    activeTab,
    selectedDetailStaffId,
    printPreviewStaffId,
    isStaffLoginOpen,
    isPinControlOpen,
    isChangeOwnPinOpen,
    onSubViewChange
  ]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('daily');
      setSelectedDetailStaffId(null);
      setPrintPreviewStaffId(null);
      setIsStaffLoginOpen(false);
      setIsPinControlOpen(false);
      setIsChangeOwnPinOpen(false);
      setConfirmDeleteDailyStaffId(null);
      setDailyFeedback(null);
      subViewHistoryDepthRef.current = 0;
      return;
    }
    // Refresh shared staff session on open
    try {
      const saved = sessionStorage.getItem('protyasha_support_staff_session');
      setStaffSession(saved ? (JSON.parse(saved) as StaffSupportSession) : null);
    } catch {}

    const handleSubViewPop = () => {
      const s = subViewRef.current;
      subViewHistoryDepthRef.current = Math.max(0, subViewHistoryDepthRef.current - 1);
      if (s.isChangeOwnPinOpen) {
        setIsChangeOwnPinOpen(false);
      } else if (s.isPinControlOpen) {
        setIsPinControlOpen(false);
      } else if (s.printPreviewStaffId) {
        setPrintPreviewStaffId(null);
      } else if (s.isStaffLoginOpen) {
        setIsStaffLoginOpen(false);
      } else if (s.selectedDetailStaffId) {
        setSelectedDetailStaffId(null);
      } else if (s.activeTab !== 'daily') {
        setActiveTab('daily');
      }
    };
    window.addEventListener('popstate', handleSubViewPop);
    return () => window.removeEventListener('popstate', handleSubViewPop);
  }, [isOpen]);

  // Listen to Firestore settings/staff_support_auth for Staff Login PIN configuration
  useEffect(() => {
    if (!isOpen) return;
    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(
        doc(db, 'settings', 'staff_support_auth'),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as { globalPin?: string; staffPins?: Record<string, string> };
            setStaffAuthConfig({
              globalPin: String(data.globalPin || '1234'),
              staffPins: data.staffPins && typeof data.staffPins === 'object' ? data.staffPins : {}
            });
          }
        },
        () => {}
      );
    } catch {}
    return () => {
      if (unsub) unsub();
    };
  }, [isOpen]);

  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Inline note editor per staff on daily view
  const [editingNoteStaffId, setEditingNoteStaffId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  // Leave form state
  const [leaveStaffId, setLeaveStaffId] = useState('');
  const [leaveFromDate, setLeaveFromDate] = useState(todayIso);
  const [leaveToDate, setLeaveToDate] = useState(todayIso);
  const [leaveType, setLeaveType] = useState<Exclude<LeaveType, 'none'>>('casual');
  const [leaveNote, setLeaveNote] = useState('');
  const [leaveFeedback, setLeaveFeedback] = useState('');
  const [isSavingLeave, setIsSavingLeave] = useState(false);
  const [confirmDeleteLeaveId, setConfirmDeleteLeaveId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const isVisitor = user?.role === 'visitor';
  const canBulkMark = isAdmin;

  // Live 1-second tick for 5-minute attendance auto-lock countdown (non-admins)
  useEffect(() => {
    if (!isOpen || isAdmin) return;
    setNowMs(Date.now());
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, isAdmin]);

  // Clear staff session automatically if Admin is logged in or user signs out
  useEffect(() => {
    if (isAdmin || !user) {
      if (staffSession) {
        setStaffSession(null);
        try {
          sessionStorage.removeItem('protyasha_support_staff_session');
        } catch {}
      }
    }
  }, [isAdmin, user, staffSession]);

  const activeStaff = useMemo(
    () => staffAccounts.filter(isActualStaffAccount),
    [staffAccounts]
  );

  // Resolve main-page logged-in staff match
  const matchedMainStaff = useMemo<StaffAccount | null>(
    () => (isAdmin ? null : findMatchedStaffForUser(user, activeStaff)),
    [isAdmin, user, activeStaff]
  );

  // Resolve the currently logged-in staff member (for non-admin self-only attendance)
  const matchedOwnStaff = useMemo<StaffAccount | null>(() => {
    if (isAdmin) return null;

    // 1. Main-page logged-in staff (zero extra PIN required)
    if (matchedMainStaff) return matchedMainStaff;

    // 2. Temporary Dedicated Staff Login session (if a non-staff account switched temporarily)
    if (staffSession) {
      const sessionPhone = normalizePhoneNumber(staffSession.phone);
      const sessionName = (staffSession.name || '').trim().toLowerCase();
      const bySession =
        activeStaff.find((s) => s.id === staffSession.staffId) ||
        (sessionPhone.length >= 6
          ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === sessionPhone)
          : undefined) ||
        (sessionName
          ? activeStaff.find((s) => (s.name || '').trim().toLowerCase() === sessionName)
          : undefined);
      if (bySession) return bySession;
    }

    // 3. Fallback: Match logged-in staff/sub-admin user account to Staff Directory (never regular 'user')
    if (user && (user.role === 'staff' || user.role === 'sub-admin')) {
      const uPhone = normalizePhoneNumber(user.phone);
      const uName = (user.name || '').trim().toLowerCase();
      const uRawPhone = (user.phone || '').trim().toLowerCase();
      const byUser =
        (user.id ? activeStaff.find((s) => s.id === user.id) : undefined) ||
        (uPhone.length >= 6
          ? activeStaff.find((s) => normalizePhoneNumber(s.phone) === uPhone)
          : undefined) ||
        (uRawPhone
          ? activeStaff.find((s) => (s.userCode || '').trim().toLowerCase() === uRawPhone)
          : undefined) ||
        (uName
          ? activeStaff.find((s) => (s.name || '').trim().toLowerCase() === uName)
          : undefined);
      if (byUser) return byUser;
    }

    return null;
  }, [isAdmin, matchedMainStaff, staffSession, user, activeStaff]);

  // Keep leaveStaffId locked to matchedOwnStaff for non-admins
  useEffect(() => {
    if (!isAdmin && matchedOwnStaff) {
      setLeaveStaffId(matchedOwnStaff.id);
    } else if (!isAdmin && !matchedOwnStaff) {
      setLeaveStaffId('');
    }
  }, [isAdmin, matchedOwnStaff]);

  // Auto-dismiss transient daily feedback banner
  useEffect(() => {
    if (!dailyFeedback) return;
    const t = setTimeout(() => setDailyFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [dailyFeedback]);

  // Pin own staff card to the top for non-admin staff convenience
  const orderedDailyStaff = useMemo(() => {
    if (isAdmin || !matchedOwnStaff) return activeStaff;
    return [
      matchedOwnStaff,
      ...activeStaff.filter((s) => s.id !== matchedOwnStaff.id)
    ];
  }, [activeStaff, isAdmin, matchedOwnStaff]);

  const selectedDetailStaff = useMemo(
    () =>
      selectedDetailStaffId
        ? staffAccounts.find((s) => s.id === selectedDetailStaffId) || null
        : null,
    [staffAccounts, selectedDetailStaffId]
  );

  const printPreviewStaff = useMemo(
    () =>
      printPreviewStaffId
        ? staffAccounts.find((s) => s.id === printPreviewStaffId) || null
        : null,
    [staffAccounts, printPreviewStaffId]
  );

  const getRecordForStaffOnDate = (staffId: string, dateStr: string): StaffAttendanceRecord | undefined => {
    return attendanceRecords.find((r) => r.staffId === staffId && r.date === dateStr);
  };

  const canModifyStaffOnDate = (staffId: string, dateStr: string): boolean => {
    if (isAdmin) return true;
    if (!matchedOwnStaff) return false;
    if (matchedOwnStaff.id !== staffId || dateStr !== todayIso) return false;
    const existing = getRecordForStaffOnDate(staffId, dateStr);
    if (!existing) return true;
    return !getStaffAttendanceLockState(existing, false, nowMs).locked;
  };

  const isOwnStaffId = (staffId: string): boolean => {
    return !isAdmin && Boolean(matchedOwnStaff && matchedOwnStaff.id === staffId);
  };

  const activeRecorderName = (
    staffSession?.name ||
    matchedOwnStaff?.name ||
    user?.name ||
    (isBn ? 'অ্যাডমিন' : 'Admin')
  ).slice(0, 128);

  const selectedMonthKey = `${selectedYear}-${String(selectedMonthIdx + 1).padStart(2, '0')}`;
  const daysInSelectedMonth = new Date(selectedYear, selectedMonthIdx + 1, 0).getDate();

  // Map staffId -> attendance record for selectedDate
  const dailyMap = useMemo(() => {
    const map = new Map<string, StaffAttendanceRecord>();
    attendanceRecords.forEach((rec) => {
      if (rec.date === selectedDate) {
        map.set(rec.staffId, rec);
      }
    });
    return map;
  }, [attendanceRecords, selectedDate]);

  const dailySummary = useMemo(() => {
    let present = 0;
    let late = 0;
    let halfDay = 0;
    let leave = 0;
    let absent = 0;
    activeStaff.forEach((s) => {
      const rec = dailyMap.get(s.id);
      if (!rec) return;
      if (rec.status === 'present') present++;
      else if (rec.status === 'late') late++;
      else if (rec.status === 'half_day') halfDay++;
      else if (rec.status === 'leave') leave++;
      else if (rec.status === 'absent') absent++;
    });
    return {
      total: activeStaff.length,
      present,
      late,
      halfDay,
      leave,
      absent,
      unmarked: Math.max(0, activeStaff.length - (present + late + halfDay + leave + absent))
    };
  }, [activeStaff, dailyMap]);

  // Monthly per-staff stats & salary deduction preview
  const monthlyStats = useMemo(() => {
    const monthRecords = attendanceRecords.filter((r) => r.month === selectedMonthKey);

    return activeStaff.map((staff) => {
      const recs = monthRecords.filter((r) => r.staffId === staff.id);
      let present = 0;
      let late = 0;
      let halfDay = 0;
      let paidLeave = 0;
      let unpaidLeave = 0;
      let absent = 0;

      recs.forEach((r) => {
        if (r.status === 'present') present++;
        else if (r.status === 'late') late++;
        else if (r.status === 'half_day') halfDay++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'leave') {
          if (r.leaveType === 'unpaid') unpaidLeave++;
          else paidLeave++;
        }
      });

      const totalLeave = paidLeave + unpaidLeave;
      const markedDays = present + late + halfDay + totalLeave + absent;
      const effectivePresent = present + late + halfDay * 0.5;
      const attendanceRate = markedDays > 0 ? Math.round((effectivePresent / markedDays) * 100) : 0;

      const baseSalary = Number(staff.baseSalary) || 0;
      const dailyRate = baseSalary > 0 ? baseSalary / daysInSelectedMonth : 0;
      const deductibleDays = absent + unpaidLeave + halfDay * 0.5;
      const deduction = Math.round(dailyRate * deductibleDays);
      const estimatedPayable = Math.max(0, baseSalary - deduction);

      return {
        staff,
        present,
        late,
        halfDay,
        paidLeave,
        unpaidLeave,
        totalLeave,
        absent,
        markedDays,
        attendanceRate,
        baseSalary,
        deduction,
        estimatedPayable
      };
    });
  }, [activeStaff, attendanceRecords, selectedMonthKey, daysInSelectedMonth]);

  const monthlyTotals = useMemo(() => {
    const totalPresent = monthlyStats.reduce((sum, s) => sum + s.present + s.late, 0);
    const totalLeaves = monthlyStats.reduce((sum, s) => sum + s.totalLeave, 0);
    const totalAbsent = monthlyStats.reduce((sum, s) => sum + s.absent, 0);
    const totalPayable = monthlyStats.reduce((sum, s) => sum + s.estimatedPayable, 0);
    const avgRate =
      monthlyStats.length > 0
        ? Math.round(monthlyStats.reduce((sum, s) => sum + s.attendanceRate, 0) / monthlyStats.length)
        : 0;
    return { totalPresent, totalLeaves, totalAbsent, totalPayable, avgRate };
  }, [monthlyStats]);

  // Leave records for selected month
  const monthlyLeaveRecords = useMemo(() => {
    return attendanceRecords
      .filter((r) => r.status === 'leave' && r.month === selectedMonthKey)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, selectedMonthKey]);

  if (!isOpen) return null;

  const formatNum = (n: number) => (isBn ? toBengaliNumber(n) : String(n));

  const getLeaveTypeLabel = (lt?: LeaveType) => {
    const found = LEAVE_TYPES.find((item) => item.id === lt);
    return found ? (isBn ? found.bn : found.en) : isBn ? 'নৈমিত্তিক ছুটি' : 'Casual Leave';
  };

  const openStaffDetail = (staffId: string) => {
    sounds.playTap();
    pushSubViewHistory();
    setSelectedDetailStaffId(staffId);
  };

  const openStaffPrintPreview = (staffId: string) => {
    sounds.playTap();
    pushSubViewHistory();
    setPrintPreviewStaffId(staffId);
  };

  const openStaffLoginModal = () => {
    sounds.playTap();
    setStaffLoginError('');
    setStaffLoginPin('');
    if (!staffLoginIdentifier && user?.phone) {
      setStaffLoginIdentifier(user.phone);
    }
    pushSubViewHistory();
    setIsStaffLoginOpen(true);
  };

  const handleStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawId = staffLoginIdentifier.trim();
    const cleanPin = staffLoginPin.trim();
    if (!rawId || cleanPin.length < 4) {
      setStaffLoginError(
        isBn
          ? 'স্টাফের মোবাইল নাম্বার/কোড এবং কমপক্ষে ৪ ডিজিটের পিন দিন'
          : 'Enter staff phone/code and at least 4-digit PIN'
      );
      return;
    }

    setIsVerifyingStaff(true);
    setStaffLoginError('');
    try {
      const normalizedInputPhone = normalizePhoneNumber(rawId);
      const loweredInput = rawId.toLowerCase();

      const matchedStaff = activeStaff.find((s) => {
        const sPhone = normalizePhoneNumber(s.phone);
        const sCode = (s.userCode || '').trim().toLowerCase();
        const sName = (s.name || '').trim().toLowerCase();
        return (
          s.id === rawId ||
          (sPhone && normalizedInputPhone && sPhone === normalizedInputPhone) ||
          (sCode && sCode === loweredInput) ||
          (sName && sName === loweredInput)
        );
      });

      if (matchedStaff) {
        const expectedPin =
          staffAuthConfig.staffPins[matchedStaff.id] || staffAuthConfig.globalPin || '1234';
        if (cleanPin === expectedPin) {
          const session: StaffSupportSession = {
            staffId: matchedStaff.id,
            name: matchedStaff.name,
            phone: matchedStaff.phone || '',
            roleTitle: matchedStaff.role || (isBn ? 'স্টাফ' : 'Staff'),
            loggedInAt: new Date().toISOString()
          };
          setStaffSession(session);
          try {
            sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(session));
          } catch {}
          sounds.playSuccess();
          setDailyFeedback({
            type: 'success',
            text: isBn
              ? `${matchedStaff.name} হিসেবে স্টাফ লগইন সফল হয়েছে। এখন নিজের হাজিরা দিতে পারবেন।`
              : `Logged in as ${matchedStaff.name}. You can now mark your attendance.`
          });
          closeSubViewViaBack(() => setIsStaffLoginOpen(false));
          return;
        }
      }

      // Also check 'staff' / 'sub-admin' accounts in Firestore 'users' whose phone matches an active staff member
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const matchedStaffUser = usersSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .find(
            (u) =>
              (u.role === 'staff' || u.role === 'sub-admin') &&
              u.status !== 'suspended' &&
              String(u.pin || '') === cleanPin &&
              ((u.phone && String(u.phone).trim() === rawId) ||
                (normalizedInputPhone.length >= 6 &&
                  normalizePhoneNumber(u.phone) === normalizedInputPhone))
          );

        if (matchedStaffUser) {
          const linkedStaff =
            activeStaff.find((s) => String(s.id) === String(matchedStaffUser.id)) ||
            activeStaff.find(
              (s) => normalizePhoneNumber(s.phone) === normalizePhoneNumber(matchedStaffUser.phone)
            ) ||
            activeStaff.find(
              (s) =>
                (s.name || '').trim().toLowerCase() ===
                String(matchedStaffUser.name || '').trim().toLowerCase()
            );

          if (linkedStaff) {
            const session: StaffSupportSession = {
              staffId: linkedStaff.id,
              name: linkedStaff.name,
              phone: linkedStaff.phone || matchedStaffUser.phone || rawId,
              roleTitle: linkedStaff.role || (isBn ? 'স্টাফ' : 'Staff'),
              loggedInAt: new Date().toISOString()
            };
            setStaffSession(session);
            try {
              sessionStorage.setItem('protyasha_support_staff_session', JSON.stringify(session));
            } catch {}
            sounds.playSuccess();
            setDailyFeedback({
              type: 'success',
              text: isBn
                ? `${linkedStaff.name} হিসেবে স্টাফ লগইন সফল হয়েছে।`
                : `Logged in as ${linkedStaff.name}.`
            });
            closeSubViewViaBack(() => setIsStaffLoginOpen(false));
            return;
          }
        }
      } catch {}

      setStaffLoginError(
        isBn
          ? 'স্টাফ তথ্য বা পিন সঠিক নয়। অ্যাডমিনের কাছ থেকে সঠিক স্টাফ পিন জেনে নিন।'
          : 'Invalid staff credentials or PIN. Please contact admin.'
      );
    } finally {
      setIsVerifyingStaff(false);
    }
  };

  const openPinControlModal = () => {
    if (!isAdmin) return;
    sounds.playTap();
    setDraftGlobalPin(staffAuthConfig.globalPin || '1234');
    setDraftStaffPins({ ...(staffAuthConfig.staffPins || {}) });
    setPinSearchQuery('');
    setPinControlFeedback(null);
    pushSubViewHistory();
    setIsPinControlOpen(true);
  };

  const handleSaveAdminPinControl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const cleanGlobal = draftGlobalPin.trim();
    if (!/^\d{4,8}$/.test(cleanGlobal)) {
      setPinControlFeedback({
        type: 'error',
        text: isBn ? 'ডিফল্ট গ্লোবাল পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।' : 'Default global PIN must be 4–8 digits.'
      });
      return;
    }

    const cleanedStaffPins: Record<string, string> = {};
    for (const [sid, rawVal] of Object.entries(draftStaffPins)) {
      const val = String(rawVal || '').trim();
      if (!val) continue;
      if (!/^\d{4,8}$/.test(val)) {
        const st = activeStaff.find((s) => s.id === sid);
        setPinControlFeedback({
          type: 'error',
          text: isBn
            ? `${st?.name || 'স্টাফ'}-এর পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।`
            : `PIN for ${st?.name || 'staff'} must be 4–8 digits.`
        });
        return;
      }
      cleanedStaffPins[sid] = val;
    }

    setIsSavingPins(true);
    setPinControlFeedback(null);
    try {
      await safeSetDoc(doc(db, 'settings', 'staff_support_auth'), {
        globalPin: cleanGlobal,
        staffPins: cleanedStaffPins,
        updatedAt: new Date().toISOString()
      });

      // Sync every modified per-staff PIN with any matching `role: 'staff'` login account
      const syncJobs = activeStaff
        .filter((s) => Boolean(cleanedStaffPins[s.id]))
        .map((s) =>
          syncStaffPinEverywhere({
            staffId: s.id,
            phone: s.phone,
            newPin: cleanedStaffPins[s.id]
          }).catch(() => {})
        );
      if (syncJobs.length > 0) {
        await Promise.all(syncJobs);
      }

      sounds.playSuccess();
      setPinControlFeedback({
        type: 'success',
        text: isBn
          ? 'সকল স্টাফের আলাদা পিন ও ডিফল্ট পিন সফলভাবে সংরক্ষিত ও মেইন লগইনের সাথে সিঙ্ক হয়েছে।'
          : 'Staff PINs saved and synced with Main Login.'
      });
    } catch {
      setPinControlFeedback({
        type: 'error',
        text: isBn ? 'পিন সংরক্ষণ ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' : 'Failed to save PIN settings.'
      });
    } finally {
      setIsSavingPins(false);
    }
  };

  const openChangeOwnPinModal = () => {
    if (!matchedOwnStaff || isAdmin) return;
    sounds.playTap();
    setOwnCurrentPin('');
    setOwnNewPin('');
    setOwnConfirmPin('');
    setOwnPinFeedback(null);
    pushSubViewHistory();
    setIsChangeOwnPinOpen(true);
  };

  const handleChangeOwnPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedOwnStaff) return;

    const current = ownCurrentPin.trim();
    const nextPin = ownNewPin.trim();
    const confirm = ownConfirmPin.trim();

    if (!current || !nextPin || !confirm) {
      setOwnPinFeedback({
        type: 'error',
        text: isBn ? 'বর্তমান ও নতুন পিনের সব ঘর পূরণ করুন।' : 'Please fill all PIN fields.'
      });
      return;
    }
    if (!/^\d{4,8}$/.test(nextPin)) {
      setOwnPinFeedback({
        type: 'error',
        text: isBn ? 'নতুন পিন অবশ্যই ৪ থেকে ৮ সংখ্যার হতে হবে।' : 'New PIN must be 4–8 digits.'
      });
      return;
    }
    if (nextPin !== confirm) {
      setOwnPinFeedback({
        type: 'error',
        text: isBn ? 'নতুন পিন ও নিশ্চিতকরণ পিন মিলছে না।' : 'New PIN and confirmation do not match.'
      });
      return;
    }

    setIsSavingOwnPin(true);
    setOwnPinFeedback(null);
    try {
      const expectedConfigPin = String(
        staffAuthConfig.staffPins[matchedOwnStaff.id] || staffAuthConfig.globalPin || '1234'
      ).trim();

      let currentMatched = current === expectedConfigPin;
      if (!currentMatched) {
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          const ownPhoneNorm = normalizePhoneNumber(matchedOwnStaff.phone);
          currentMatched = usersSnap.docs.some((d) => {
            const u = d.data() as any;
            if (!u || u.role !== 'staff') return false;
            const idOk = String(u.id || d.id) === String(matchedOwnStaff.id);
            const phoneOk = ownPhoneNorm.length >= 6 && normalizePhoneNumber(u.phone) === ownPhoneNorm;
            return (idOk || phoneOk) && String(u.pin || '').trim() === current;
          });
        } catch {}
      }

      if (!currentMatched) {
        setOwnPinFeedback({
          type: 'error',
          text: isBn ? 'বর্তমান পিনটি সঠিক নয়।' : 'Current PIN is incorrect.'
        });
        setIsSavingOwnPin(false);
        return;
      }

      await syncStaffPinEverywhere({
        staffId: matchedOwnStaff.id,
        phone: matchedOwnStaff.phone,
        newPin: nextPin
      });

      sounds.playSuccess();
      setDailyFeedback({
        type: 'success',
        text: isBn
          ? 'আপনার স্টাফ পিন সফলভাবে পরিবর্তন হয়েছে। এখন নতুন পিন দিয়ে মেইন ও হাজিরা লগইন করতে পারবেন।'
          : 'Your PIN has been updated for both Staff Attendance and Main Login.'
      });
      closeSubViewViaBack(() => setIsChangeOwnPinOpen(false));
    } catch {
      setOwnPinFeedback({
        type: 'error',
        text: isBn ? 'পিন পরিবর্তন করা যায়নি। পুনরায় চেষ্টা করুন।' : 'Failed to change PIN.'
      });
    } finally {
      setIsSavingOwnPin(false);
    }
  };

  const handleStaffLogout = () => {
    sounds.playTap();
    setStaffSession(null);
    setConfirmDeleteDailyStaffId(null);
    try {
      sessionStorage.removeItem('protyasha_support_staff_session');
    } catch {}
  };

  const handleMarkStatus = async (
    staff: StaffAccount,
    status: AttendanceStatus,
    leaveTypeOverride?: LeaveType,
    noteOverride?: string
  ) => {
    const existing = dailyMap.get(staff.id);
    const liveLockState = getStaffAttendanceLockState(existing, isAdmin, Date.now());

    // Strictly block non-admins from marking other staff, non-today dates, or expired (>5 min) records
    if (!canModifyStaffOnDate(staff.id, selectedDate) || (!isAdmin && existing && liveLockState.locked)) {
      sounds.playTap();
      setConfirmDeleteDailyStaffId(null);
      setEditingNoteStaffId(null);
      setDailyFeedback({
        type: 'error',
        text: !matchedOwnStaff && !isAdmin
          ? isBn
            ? 'নিজের হাজিরা দিতে প্রথমে স্টাফ লগইন করুন।'
            : 'Please sign in as staff first to mark your attendance.'
          : selectedDate !== todayIso && !isAdmin
            ? isBn
              ? 'স্টাফ শুধুমাত্র আজকের হাজিরা দিতে বা পরিবর্তন করতে পারবেন।'
              : 'Staff can only mark or change today’s attendance.'
            : !isAdmin && matchedOwnStaff?.id === staff.id && existing && liveLockState.locked
              ? isBn
                ? '৫ মিনিট সময় শেষ হওয়ায় আজকের হাজিরা লক হয়ে গেছে — এখন শুধুমাত্র দেখা যাবে।'
                : 'Attendance locked after 5 minutes — view only.'
              : isBn
                ? 'আপনি শুধুমাত্র নিজের হাজিরা দিতে পারবেন, অন্য স্টাফেরটা কাজ করবে না।'
                : 'You can only mark your own attendance.'
      });
      return;
    }

    // If clicking the exact same active status without changing leaveType/note, offer 1-tap Undo/Delete (within 5 min)!
    if (
      existing &&
      existing.status === status &&
      leaveTypeOverride === undefined &&
      noteOverride === undefined
    ) {
      sounds.playTap();
      setConfirmDeleteDailyStaffId(confirmDeleteDailyStaffId === staff.id ? null : staff.id);
      return;
    }

    sounds.playTap();
    setConfirmDeleteDailyStaffId(null);
    const monthStr = selectedDate.slice(0, 7);
    const nowIso = new Date().toISOString();
    const record: StaffAttendanceRecord = {
      id: sanitizeRecordId(staff.id, selectedDate),
      staffId: staff.id,
      staffName: staff.name.slice(0, 150),
      staffRole: (staff.role || '').slice(0, 150),
      date: selectedDate,
      month: monthStr,
      status,
      checkInTime:
        status === 'present' || status === 'late' || status === 'half_day'
          ? existing?.checkInTime || getCurrentTimeLabel()
          : '',
      leaveType:
        status === 'leave'
          ? leaveTypeOverride ||
            (existing?.leaveType && existing.leaveType !== 'none' ? existing.leaveType : 'casual')
          : 'none',
      note: noteOverride !== undefined ? noteOverride.trim().slice(0, 1000) : existing?.note || '',
      recordedBy: activeRecorderName,
      // Preserve initial submission timestamp so editing within 5 minutes never resets the lock countdown
      createdAt: existing?.createdAt || existing?.updatedAt || nowIso,
      updatedAt: nowIso
    };
    await onSaveAttendance(record);
  };

  const handleConfirmDeleteDailyAttendance = async (staff: StaffAccount, record: StaffAttendanceRecord) => {
    const liveLockState = getStaffAttendanceLockState(record, isAdmin, Date.now());
    if (!canModifyStaffOnDate(staff.id, record.date) || (!isAdmin && liveLockState.locked)) {
      sounds.playTap();
      setConfirmDeleteDailyStaffId(null);
      setEditingNoteStaffId(null);
      setDailyFeedback({
        type: 'error',
        text: isBn
          ? '৫ মিনিট সময় শেষ হওয়ায় আজকের হাজিরা আর মুছা যাবে না।'
          : '5-minute window expired. Attendance is now locked.'
      });
      return;
    }
    setIsDeletingDailyId(record.id);
    try {
      await onDeleteAttendance(record.id);
      sounds.playSuccess();
      setConfirmDeleteDailyStaffId(null);
      setEditingNoteStaffId((prev) => (prev === staff.id ? null : prev));
      setDailyFeedback({
        type: 'info',
        text: isBn
          ? `${staff.name}-এর ${record.date === todayIso ? 'আজকের' : record.date} হাজিরা মুছে ফেলা হয়েছে।`
          : `Cleared attendance for ${staff.name}.`
      });
    } finally {
      setIsDeletingDailyId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!canBulkMark || activeStaff.length === 0) return;
    setIsBulkSaving(true);
    try {
      const nowTime = getCurrentTimeLabel();
      const nowIso = new Date().toISOString();
      const monthStr = selectedDate.slice(0, 7);

      const recordsToWrite: StaffAttendanceRecord[] = activeStaff
        .filter((s) => !dailyMap.has(s.id))
        .map((staff) => ({
          id: sanitizeRecordId(staff.id, selectedDate),
          staffId: staff.id,
          staffName: staff.name.slice(0, 150),
          staffRole: (staff.role || '').slice(0, 150),
          date: selectedDate,
          month: monthStr,
          status: 'present',
          checkInTime: nowTime,
          leaveType: 'none',
          note: '',
          recordedBy: activeRecorderName,
          createdAt: nowIso,
          updatedAt: nowIso
        }));

      if (recordsToWrite.length > 0) {
        await onSaveBulkAttendance(recordsToWrite);
        sounds.playSuccess();
      }
    } finally {
      setIsBulkSaving(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const targetStaffId = leaveStaffId;
    if (!targetStaffId) {
      setLeaveFeedback(isBn ? 'অনুগ্রহ করে স্টাফ নির্বাচন করুন' : 'Please select a staff member');
      return;
    }
    const staff = activeStaff.find((s) => s.id === targetStaffId);
    if (!staff) {
      setLeaveFeedback(isBn ? 'অনুগ্রহ করে স্টাফ নির্বাচন করুন' : 'Please select a staff member');
      return;
    }
    if (!leaveFromDate || !leaveToDate || leaveFromDate > leaveToDate) {
      setLeaveFeedback(isBn ? 'সঠিক তারিখ নির্বাচন করুন' : 'Please select valid date range');
      return;
    }

    // Build date range (capped at 31 days)
    const dates: string[] = [];
    let cursor = leaveFromDate;
    while (cursor <= leaveToDate && dates.length < 31) {
      dates.push(cursor);
      cursor = shiftDateByDays(cursor, 1);
    }

    setIsSavingLeave(true);
    setLeaveFeedback('');
    try {
      const nowIso = new Date().toISOString();
      const records: StaffAttendanceRecord[] = dates.map((d) => ({
        id: sanitizeRecordId(staff.id, d),
        staffId: staff.id,
        staffName: staff.name.slice(0, 150),
        staffRole: (staff.role || '').slice(0, 150),
        date: d,
        month: d.slice(0, 7),
        status: 'leave',
        checkInTime: '',
        leaveType,
        note: leaveNote.trim().slice(0, 1000),
        recordedBy: activeRecorderName,
        createdAt: nowIso,
        updatedAt: nowIso
      }));

      await onSaveBulkAttendance(records);
      sounds.playSuccess();
      setLeaveNote('');
      setLeaveFeedback(
        isBn
          ? `${staff.name}-এর ${toBengaliNumber(dates.length)} দিনের ছুটি সেভ হয়েছে!`
          : `Saved ${dates.length} leave day(s) for ${staff.name}!`
      );
      // Sync monthly view to leave's month
      const [ly, lm] = leaveFromDate.split('-').map(Number);
      if (ly && lm) {
        setSelectedYear(ly);
        setSelectedMonthIdx(lm - 1);
      }
    } finally {
      setIsSavingLeave(false);
    }
  };

  const handlePrevMonth = () => {
    sounds.playTap();
    if (selectedMonthIdx === 0) {
      setSelectedMonthIdx(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonthIdx((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    sounds.playTap();
    if (selectedMonthIdx === 11) {
      setSelectedMonthIdx(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonthIdx((m) => m + 1);
    }
  };

  const handleExportMonthlyExcel = () => {
    sounds.playSuccess();
    const monthTitle = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
    const rows = monthlyStats
      .map(
        (s) => `
      <tr>
        <td>${s.staff.name}</td>
        <td>${s.staff.role || '-'}</td>
        <td>${s.present}</td>
        <td>${s.late}</td>
        <td>${s.halfDay}</td>
        <td>${s.paidLeave}</td>
        <td>${s.unpaidLeave}</td>
        <td>${s.absent}</td>
        <td>${s.attendanceRate}%</td>
        <td>${s.baseSalary}</td>
        <td>${s.deduction}</td>
        <td>${s.estimatedPayable}</td>
      </tr>`
      )
      .join('');

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table border="1">
          <tr><th colspan="12" style="font-size:16px;font-weight:bold;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — স্টাফ হাজিরা ও ছুটি শীট (${monthTitle})</th></tr>
          <tr style="background:#f1f5f9;font-weight:bold;">
            <th>স্টাফ নাম</th>
            <th>পদবী</th>
            <th>উপস্থিত</th>
            <th>লেট</th>
            <th>অর্ধ-দিন</th>
            <th>বেতনসহ ছুটি</th>
            <th>বিনা বেতন ছুটি</th>
            <th>অনুপস্থিত</th>
            <th>উপস্থিতি %</th>
            <th>মূল বেতন (৳)</th>
            <th>কর্তন (৳)</th>
            <th>সম্ভাব্য প্রদেয় (৳)</th>
          </tr>
          ${rows}
        </table>
      </body>
      </html>`;

    const blob = new Blob(['\uFEFF' + excelHtml], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protyasha_attendance_${MONTHS_EN[selectedMonthIdx]}_${selectedYear}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintMonthlyPdf = () => {
    sounds.playSuccess();
    const monthTitle = `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`;
    const rows = monthlyStats
      .map(
        (s) => `
      <tr>
        <td style="text-align:left;font-weight:700;">${s.staff.name}<div style="font-size:11px;color:#64748b;font-weight:500;">${s.staff.role || ''}</div></td>
        <td>${toBengaliNumber(s.present)}</td>
        <td>${toBengaliNumber(s.late)}</td>
        <td>${toBengaliNumber(s.halfDay)}</td>
        <td>${toBengaliNumber(s.totalLeave)}</td>
        <td style="color:#dc2626;font-weight:700;">${toBengaliNumber(s.absent)}</td>
        <td style="font-weight:700;">${toBengaliNumber(s.attendanceRate)}%</td>
        <td style="text-align:right;">৳${toBengaliNumber(s.baseSalary)}</td>
        <td style="text-align:right;color:#dc2626;">৳${toBengaliNumber(s.deduction)}</td>
        <td style="text-align:right;font-weight:800;color:#059669;">৳${toBengaliNumber(s.estimatedPayable)}</td>
      </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>স্টাফ হাজিরা ও বেতন রিপোর্ট - ${monthTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700;800&display=swap');
          body { font-family: 'Hind Siliguri', Arial, sans-serif; padding: 20px; color: #0f172a; }
          h1 { margin: 0; text-align: center; font-size: 24px; font-weight: 800; }
          .sub { text-align: center; color: #475569; font-size: 13px; margin: 4px 0 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
          th, td { border: 1px solid #94a3b8; padding: 7px 8px; text-align: center; }
          th { background: #f1f5f9; font-weight: 700; }
          .foot { margin-top: 48px; display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #475569; }
          .sig { border-top: 1px solid #475569; width: 160px; text-align: center; padding-top: 4px; }
        </style>
      </head>
      <body>
        <h1>প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
        <div class="sub">মাসিক স্টাফ হাজিরা, ছুটি ও বেতন সমন্বয় শীট — ${monthTitle}</div>
        <table>
          <thead>
            <tr>
              <th>স্টাফ</th>
              <th>উপস্থিত</th>
              <th>লেট</th>
              <th>অর্ধ-দিন</th>
              <th>ছুটি</th>
              <th>অনুপস্থিত</th>
              <th>হার</th>
              <th>মূল বেতন</th>
              <th>কর্তন</th>
              <th>সম্ভাব্য প্রদেয়</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="10">কোনো স্টাফ পাওয়া যায়নি</td></tr>'}
          </tbody>
        </table>
        <div class="foot">
          <div>কম্পিউটার জেনারেটেড হাজিরা রিপোর্ট</div>
          <div class="sig">কর্তৃপক্ষের স্বাক্ষর</div>
        </div>
      </body>
      </html>`;

    printHtmlViaIframe(html);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Sticky Glass Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 h-15 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {isBn ? 'স্টাফ হাজিরা ও ছুটি ম্যানেজমেন্ট' : 'Staff Attendance & Leaves'}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {isBn
                ? `মোট ${toBengaliNumber(activeStaff.length)} জন স্টাফ • রিয়েল টাইম সিঙ্ক`
                : `${activeStaff.length} Active Staff • Live Sync`}
            </p>
          </div>
        </div>

        {/* Header Controls: Admin PIN Control OR Staff Self PIN Change / Staff Login */}
        {isAdmin ? (
          <button
            type="button"
            onClick={openPinControlModal}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isBn ? 'অ্যাডমিন পিন কন্ট্রোল' : 'Admin PIN Control'}</span>
          </button>
        ) : !isVisitor ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {matchedOwnStaff && (
              <button
                type="button"
                onClick={openChangeOwnPinModal}
                className="h-9 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold inline-flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                title={isBn ? 'নিজের স্টাফ পিন পরিবর্তন করুন' : 'Change own staff PIN'}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBn ? 'পিন পরিবর্তন' : 'Change PIN'}</span>
              </button>
            )}
            {matchedMainStaff ? (
              <div className="h-9 px-2.5 sm:px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[110px] truncate">{matchedMainStaff.name}</span>
              </div>
            ) : staffSession ? (
              <button
                type="button"
                onClick={handleStaffLogout}
                title={isBn ? 'স্টাফ সেশন লগআউট' : 'Sign out staff session'}
                className="h-9 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[85px] truncate">{staffSession.name}</span>
                <LogOut className="w-3 h-3 text-rose-500 shrink-0" />
              </button>
            ) : !matchedOwnStaff ? (
              <button
                type="button"
                onClick={openStaffLoginModal}
                className="h-9 px-2.5 sm:px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isBn ? 'স্টাফ লগইন' : 'Staff Login'}</span>
              </button>
            ) : (
              <div className="h-9 px-2.5 sm:px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[110px] truncate">{matchedOwnStaff.name}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-4 space-y-4 pb-24 w-full">
        {/* 3-Tab Segmented Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          {(
            [
              { id: 'daily', bn: 'দৈনিক হাজিরা', en: 'Daily' },
              { id: 'monthly', bn: 'মাসিক ও বেতন', en: 'Monthly' },
              { id: 'leaves', bn: 'ছুটি ম্যানেজমেন্ট', en: 'Leaves' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                if (tab.id !== 'daily' && activeTab === 'daily') {
                  pushSubViewHistory();
                }
                setActiveTab(tab.id);
              }}
              className={`h-10 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? tab.bn : tab.en}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: DAILY ATTENDANCE                                       */}
        {/* ============================================================ */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {/* Date Picker Bar */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedDate((d) => shiftDateByDays(d, -1));
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                />
                {selectedDate !== todayIso && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setSelectedDate(todayIso);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold cursor-pointer"
                  >
                    {isBn ? 'আজ' : 'Today'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedDate((d) => shiftDateByDays(d, 1));
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Daily KPI Strip */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  {isBn ? 'উপস্থিত' : 'Present'}
                </p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatNum(dailySummary.present + dailySummary.halfDay)}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50">
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  {isBn ? 'লেট' : 'Late'}
                </p>
                <p className="text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
                  {formatNum(dailySummary.late)}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50">
                <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  {isBn ? 'ছুটি' : 'Leave'}
                </p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {formatNum(dailySummary.leave)}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50">
                <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                  {isBn ? 'অনুপস্থিত' : 'Absent'}
                </p>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums">
                  {formatNum(dailySummary.absent)}
                </p>
              </div>
            </div>

            {/* Self-Only Staff Attendance Notice Banner */}
            {!isAdmin && (
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 flex-wrap ${
                  matchedOwnStaff
                    ? 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/60'
                    : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  {matchedOwnStaff ? (
                    <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-extrabold ${
                        matchedOwnStaff
                          ? 'text-teal-800 dark:text-teal-200'
                          : 'text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {matchedOwnStaff
                        ? isBn
                          ? `নিজস্ব হাজিরা সক্রিয়: ${matchedOwnStaff.name}`
                          : `Self Attendance Active: ${matchedOwnStaff.name}`
                        : isBn
                          ? 'হাজিরা দিতে স্টাফ লগইন প্রয়োজন'
                          : 'Staff Login Required to Mark Attendance'}
                    </p>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        matchedOwnStaff
                          ? 'text-teal-700/90 dark:text-teal-300/90'
                          : 'text-amber-800/90 dark:text-amber-300/90'
                      }`}
                    >
                      {matchedOwnStaff
                        ? selectedDate === todayIso
                          ? isBn
                            ? 'আপনি শুধু নিজের আজকের হাজিরা দিতে পারবেন। হাজিরা দেওয়ার ৫ মিনিট পর তা লক হয়ে যাবে — পরে শুধুমাত্র দেখা যাবে।'
                            : 'You can mark your own attendance for today. It auto-locks 5 minutes after submission (view-only afterwards).'
                          : isBn
                            ? 'স্টাফ শুধুমাত্র আজকের হাজিরা দিতে পারবেন। আগের বা পরবর্তী তারিখ শুধু দেখার জন্য।'
                            : 'Staff can only mark today’s attendance. Other dates are view-only.'
                        : isBn
                          ? 'আপনার স্টাফ নাম্বার/কোড ও পিন দিয়ে লগইন করলে শুধু আপনার হাজিরা কার্ড আনলক হবে।'
                          : 'Log in with your staff phone/code and PIN to unlock your own attendance card.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {matchedOwnStaff && (
                    <button
                      type="button"
                      onClick={openChangeOwnPinModal}
                      className="h-8 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isBn ? 'পিন পরিবর্তন' : 'Change PIN'}</span>
                    </button>
                  )}

                  {!matchedOwnStaff && (
                    <button
                      type="button"
                      onClick={openStaffLoginModal}
                      className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isBn ? 'স্টাফ লগইন' : 'Staff Login'}</span>
                    </button>
                  )}

                  {matchedOwnStaff && selectedDate !== todayIso && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setSelectedDate(todayIso);
                      }}
                      className="h-8 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-extrabold shrink-0 cursor-pointer"
                    >
                      {isBn ? 'আজকের তারিখে যান' : 'Go to Today'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Inline Feedback Toast */}
            {dailyFeedback && (
              <div
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-150 ${
                  dailyFeedback.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    : dailyFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                }`}
              >
                <span>{dailyFeedback.text}</span>
                <button
                  type="button"
                  onClick={() => setDailyFeedback(null)}
                  className="p-0.5 rounded hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mark All Present CTA (Admin Only) */}
            {canBulkMark && activeStaff.length > 0 && dailySummary.unmarked > 0 && (
              <button
                type="button"
                disabled={isBulkSaving}
                onClick={handleMarkAllPresent}
                className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>
                  {isBulkSaving
                    ? isBn
                      ? 'সেভ হচ্ছে...'
                      : 'Saving...'
                    : isBn
                      ? `বাকি ${toBengaliNumber(dailySummary.unmarked)} জনকে এক ক্লিকে উপস্থিত দিন`
                      : `Mark ${dailySummary.unmarked} Unmarked Staff Present`}
                </span>
              </button>
            )}

            {/* Staff List */}
            {activeStaff.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'কোনো স্টাফ অ্যাকাউন্ট পাওয়া যায়নি' : 'No staff accounts found'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isBn
                    ? 'প্রথমে "স্টাফ হিসাব" থেকে স্টাফ যোগ করুন।'
                    : 'Add staff members first in Staff Management.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                {orderedDailyStaff.map((staff) => {
                  const rec = dailyMap.get(staff.id);
                  const isEditingNote = editingNoteStaffId === staff.id;
                  const canEditThisStaff = canModifyStaffOnDate(staff.id, selectedDate);
                  const isOwnCard = isOwnStaffId(staff.id);
                  const isLockedOtherStaff = !isAdmin && !isOwnCard;
                  const lockState = getStaffAttendanceLockState(rec, isAdmin, nowMs);
                  const isOwnCardLockedAfter5m = !isAdmin && isOwnCard && selectedDate === todayIso && Boolean(rec) && lockState.locked;
                  const isOwnCardCountdownActive = !isAdmin && isOwnCard && selectedDate === todayIso && Boolean(rec) && !lockState.locked;
                  const isConfirmingDelete = confirmDeleteDailyStaffId === staff.id;

                  return (
                    <div
                      key={staff.id}
                      className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs space-y-3 transition-all ${
                        isOwnCard
                          ? 'border-teal-400/90 dark:border-teal-600/80 ring-1 ring-teal-500/20'
                          : 'border-slate-200/90 dark:border-slate-800'
                      }`}
                    >
                      {/* Top Row: Clickable Staff Profile Header (opens Monthly Detail & PDF Report) */}
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openStaffDetail(staff.id)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-left group cursor-pointer rounded-xl -m-1 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          {staff.avatarUrl ? (
                            <img
                              src={staff.avatarUrl}
                              alt={staff.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-sm shrink-0">
                              {(staff.name || 'S').slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {staff.name}
                              </h4>
                              {isOwnCard && (
                                <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold shrink-0">
                                  {isBn ? 'আপনার কার্ড' : 'Your Card'}
                                </span>
                              )}
                              {isOwnCardCountdownActive && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-[10px] font-extrabold inline-flex items-center gap-0.5 tabular-nums shrink-0">
                                  <Clock className="w-2.5 h-2.5" />
                                  {isBn
                                    ? `লক বাকি: ${formatRemainingCountdown(lockState.remainingMs, true)}`
                                    : `Locks in ${formatRemainingCountdown(lockState.remainingMs, false)}`}
                                </span>
                              )}
                              {isOwnCardLockedAfter5m && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold inline-flex items-center gap-0.5 shrink-0">
                                  <Lock className="w-2.5 h-2.5" />
                                  {isBn ? 'লক (শুধু দেখা)' : 'Locked (View Only)'}
                                </span>
                              )}
                              {isLockedOtherStaff && (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold inline-flex items-center gap-0.5 shrink-0">
                                  <Lock className="w-2.5 h-2.5" />
                                  {isBn ? 'লক' : 'Locked'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {staff.role || (isBn ? 'স্টাফ' : 'Staff')}
                              {rec?.checkInTime && (
                                <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <Clock className="w-3 h-3" />
                                  {rec.checkInTime}
                                </span>
                              )}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {canEditThisStaff && (
                            <button
                              type="button"
                              onClick={() => {
                                sounds.playTap();
                                if (isEditingNote) {
                                  setEditingNoteStaffId(null);
                                } else {
                                  setEditingNoteStaffId(staff.id);
                                  setDraftNote(rec?.note || '');
                                }
                              }}
                              className={`h-8 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                                rec?.note
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{isBn ? 'নোট' : 'Note'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openStaffDetail(staff.id)}
                            title={isBn ? 'বিস্তারিত ও মাসিক PDF রিপোর্ট' : 'Details & Monthly PDF'}
                            className="h-8 px-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                          >
                            <span>{isBn ? 'বিস্তারিত' : 'Details'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 5 Status Buttons */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {STATUS_META.map((st) => {
                          const isActive = rec?.status === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              disabled={!canEditThisStaff}
                              onClick={() => handleMarkStatus(staff, st.id)}
                              className={`h-9 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all whitespace-nowrap ${
                                isActive
                                  ? `${st.activeClass} shadow-xs`
                                  : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              } ${
                                canEditThisStaff
                                  ? 'cursor-pointer hover:brightness-95 active:scale-95'
                                  : 'opacity-45 cursor-not-allowed'
                              }`}
                            >
                              {isBn ? st.bn : st.en}
                            </button>
                          );
                        })}
                      </div>

                      {/* Accidental Tap Undo / Clear Attendance Action Strip (within 5-min window for non-admin staff) */}
                      {rec && canEditThisStaff && !isConfirmingDelete && (
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {isAdmin
                              ? isBn
                                ? 'ভুলে চাপ পড়েছে? হাজিরা মুছতে পারবেন'
                                : 'Tapped by mistake? You can undo this attendance'
                              : isBn
                                ? `ভুলে চাপ পড়লে ${formatRemainingCountdown(lockState.remainingMs, true)} মিনিটের মধ্যে পরিবর্তন/মুছতে পারবেন`
                                : `Can change/undo for ${formatRemainingCountdown(lockState.remainingMs, false)}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setConfirmDeleteDailyStaffId(staff.id);
                            }}
                            className="h-7 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/70 text-[11px] font-extrabold inline-flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{isBn ? 'হাজিরা মুছুন' : 'Undo / Clear'}</span>
                          </button>
                        </div>
                      )}

                      {/* Locked View-Only Notice after 5-minute window expires */}
                      {isOwnCardLockedAfter5m && (
                        <div className="p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>
                            {isBn
                              ? 'হাজিরা দেওয়ার ৫ মিনিট পূর্ণ হওয়ায় অপশনটি লক হয়েছে। এখন শুধুমাত্র দেখতে পারবেন।'
                              : 'Attendance locked after 5 minutes. Now view-only.'}
                          </span>
                        </div>
                      )}

                      {/* Inline Undo / Delete Confirmation Bar */}
                      {rec && canEditThisStaff && isConfirmingDelete && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2 animate-in fade-in duration-150">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                            {isBn
                              ? `${selectedDate === todayIso ? 'আজকের' : selectedDate} হাজিরা মুছে ফেলবেন?`
                              : 'Clear this attendance entry?'}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteDailyStaffId(null)}
                              className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              {isBn ? 'না' : 'No'}
                            </button>
                            <button
                              type="button"
                              disabled={isDeletingDailyId === rec.id}
                              onClick={() => handleConfirmDeleteDailyAttendance(staff, rec)}
                              className="h-7 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-extrabold cursor-pointer"
                            >
                              {isDeletingDailyId === rec.id
                                ? isBn
                                  ? 'মুছছে...'
                                  : 'Clearing...'
                                : isBn
                                  ? 'হ্যাঁ, মুছুন'
                                  : 'Yes, Clear'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Quick Leave Type Selector when marked Leave */}
                      {rec?.status === 'leave' && canEditThisStaff && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mr-1">
                            {isBn ? 'ছুটির ধরন:' : 'Leave Type:'}
                          </span>
                          {LEAVE_TYPES.map((lt) => (
                            <button
                              key={lt.id}
                              type="button"
                              onClick={() => handleMarkStatus(staff, 'leave', lt.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                (rec.leaveType || 'casual') === lt.id
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                              }`}
                            >
                              {isBn ? lt.bn : lt.en}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Existing Note Display */}
                      {rec?.note && !isEditingNote && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl">
                          {rec.note}
                        </p>
                      )}

                      {/* Inline Note Editor */}
                      {isEditingNote && canEditThisStaff && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={draftNote}
                            onChange={(e) => setDraftNote(e.target.value)}
                            placeholder={isBn ? 'হাজিরা বা ছুটির মন্তব্য লিখুন...' : 'Add attendance note...'}
                            className="flex-1 h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              await handleMarkStatus(
                                staff,
                                rec?.status || 'present',
                                rec?.leaveType,
                                draftNote
                              );
                              setEditingNoteStaffId(null);
                            }}
                            className="h-9 px-3.5 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer"
                          >
                            {isBn ? 'সেভ' : 'Save'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MONTHLY SUMMARY & PAYROLL IMPACT                       */}
        {/* ============================================================ */}
        {activeTab === 'monthly' && (
          <div className="space-y-4">
            {/* Month Navigator */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {isBn
                    ? `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}`
                    : `${MONTHS_EN[selectedMonthIdx]} ${selectedYear}`}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePrintMonthlyPdf}
                className="h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'হাজিরা PDF প্রিন্ট' : 'Print PDF Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportMonthlyExcel}
                className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isBn ? 'Excel (.xls) ডাউনলোড' : 'Download Excel'}</span>
              </button>
            </div>

            {/* Team Monthly KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'গড় উপস্থিতি' : 'Avg Rate'}
                </p>
                <p className="text-lg font-black text-teal-600 dark:text-teal-400 tabular-nums mt-0.5">
                  {formatNum(monthlyTotals.avgRate)}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'মোট উপস্থিত দিন' : 'Present Days'}
                </p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                  {formatNum(monthlyTotals.totalPresent)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'মোট ছুটি / অনুপস্থিত' : 'Leave / Absent'}
                </p>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
                  {formatNum(monthlyTotals.totalLeaves)} / {formatNum(monthlyTotals.totalAbsent)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {isBn ? 'সম্ভাব্য মোট বেতন' : 'Est. Payroll'}
                </p>
                <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5">
                  ৳{formatNum(monthlyTotals.totalPayable)}
                </p>
              </div>
            </div>

            {/* Per-Staff Summary Cards (Click any card for full Monthly Detail or direct PDF / Print) */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
                {isBn
                  ? 'প্রতিটি স্টাফের মাসিক বিস্তারিত দেখতে কার্ডে ট্যাপ করুন অথবা সরাসরি PDF / প্রিন্ট বাটনে চাপ দিন'
                  : 'Tap any staff card for full monthly detail or press PDF / Print directly'}
              </p>
              {monthlyStats.map((item) => {
                const showSalaryForItem = isAdmin || isOwnStaffId(item.staff.id);
                return (
                  <div
                    key={item.staff.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openStaffDetail(item.staff.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openStaffDetail(item.staff.id);
                      }
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs space-y-3 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.staff.avatarUrl ? (
                          <img
                            src={item.staff.avatarUrl}
                            alt={item.staff.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-center font-extrabold text-xs shrink-0">
                            {(item.staff.name || 'S').slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {item.staff.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {item.staff.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-black tabular-nums">
                          {formatNum(item.attendanceRate)}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Mini Stat Breakdown */}
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30">
                        <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          {isBn ? 'উপস্থিত' : 'Pres'}
                        </p>
                        <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                          {formatNum(item.present)}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30">
                        <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                          {isBn ? 'লেট' : 'Late'}
                        </p>
                        <p className="text-sm font-black text-amber-700 dark:text-amber-300 tabular-nums">
                          {formatNum(item.late)}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-sky-50/70 dark:bg-sky-950/30">
                        <p className="text-[10px] font-bold text-sky-700 dark:text-sky-300">
                          {isBn ? 'অর্ধ-দিন' : 'Half'}
                        </p>
                        <p className="text-sm font-black text-sky-700 dark:text-sky-300 tabular-nums">
                          {formatNum(item.halfDay)}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30">
                        <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                          {isBn ? 'ছুটি' : 'Leave'}
                        </p>
                        <p className="text-sm font-black text-indigo-700 dark:text-indigo-300 tabular-nums">
                          {formatNum(item.totalLeave)}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30">
                        <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                          {isBn ? 'অনুপস্থিত' : 'Abs'}
                        </p>
                        <p className="text-sm font-black text-rose-700 dark:text-rose-300 tabular-nums">
                          {formatNum(item.absent)}
                        </p>
                      </div>
                    </div>

                    {/* Payroll Preview & Direct Print/PDF + Detail CTA Bar */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs gap-2 flex-wrap">
                      {showSalaryForItem ? (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Wallet className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {isBn ? 'প্রদেয়:' : 'Payable:'}{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                              ৳{formatNum(item.estimatedPayable)}
                            </strong>
                          </span>
                          {item.deduction > 0 && (
                            <span className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                              (-৳{formatNum(item.deduction)})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {isBn
                            ? `মোট চিহ্নিত: ${toBengaliNumber(item.markedDays)} দিন`
                            : `Marked: ${item.markedDays} days`}
                        </span>
                      )}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isBn ? 'বিস্তারিত' : 'Details'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openStaffPrintPreview(item.staff.id);
                          }}
                          className="px-2.5 h-8 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-[11px] font-extrabold inline-flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{isBn ? 'PDF / প্রিন্ট' : 'PDF / Print'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: LEAVE MANAGEMENT                                       */}
        {/* ============================================================ */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            {/* Multi-Day Leave Entry Form (Admin Only — Staff mark today's Leave from Daily Attendance within 5-min window) */}
            {isAdmin ? (
              <form
                onSubmit={handleApplyLeave}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <CalendarOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {isBn ? 'নতুন ছুটি এন্ট্রি করুন' : 'Record Staff Leave'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isBn
                        ? 'একদিন বা একাধিক দিনের ছুটি একসাথে যোগ করুন'
                        : 'Add single or multi-day leave'}
                    </p>
                  </div>
                </div>

                {leaveFeedback && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {leaveFeedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'স্টাফ নির্বাচন *' : 'Select Staff *'}
                    </label>
                    <select
                      required
                      value={leaveStaffId}
                      onChange={(e) => setLeaveStaffId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="">{isBn ? 'স্টাফ বাছাই করুন...' : 'Choose staff...'}</option>
                      {activeStaff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'ছুটির ধরন' : 'Leave Type'}
                    </label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value as Exclude<LeaveType, 'none'>)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                    >
                      {LEAVE_TYPES.map((lt) => (
                        <option key={lt.id} value={lt.id}>
                          {isBn ? lt.bn : lt.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'শুরুর তারিখ' : 'From Date'}
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveFromDate}
                      onChange={(e) => {
                        setLeaveFromDate(e.target.value);
                        if (e.target.value > leaveToDate) setLeaveToDate(e.target.value);
                      }}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isBn ? 'শেষ তারিখ' : 'To Date'}
                    </label>
                    <input
                      type="date"
                      required
                      min={leaveFromDate}
                      value={leaveToDate}
                      onChange={(e) => setLeaveToDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'ছুটির কারণ / মন্তব্য' : 'Reason / Note'}
                  </label>
                  <input
                    type="text"
                    value={leaveNote}
                    onChange={(e) => setLeaveNote(e.target.value)}
                    placeholder={isBn ? 'যেমন: পারিবারিক জরুরি কাজ / জ্বর' : 'e.g. Family emergency / fever'}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingLeave}
                  className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isSavingLeave
                      ? isBn
                        ? 'সেভ হচ্ছে...'
                        : 'Saving...'
                      : isBn
                        ? 'ছুটি অনুমোদন ও সেভ করুন'
                        : 'Approve & Save Leave'}
                  </span>
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  {isBn
                    ? 'ছুটির তালিকা শুধুমাত্র দেখার জন্য। স্টাফ আজকের "ছুটি" দৈনিক হাজিরা ট্যাব থেকে দিতে পারবেন (৫ মিনিট পর লক হবে); একাধিক দিনের ছুটি অ্যাডমিন এন্ট্রি করবেন।'
                    : 'Leave list is view-only. Staff can mark today’s leave from Daily Attendance (locks after 5 minutes); multi-day leaves are managed by Admin.'}
                </span>
              </div>
            )}

            {/* Leave Records for Selected Month */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  {isBn
                    ? `${MONTHS_BN[selectedMonthIdx]} ${toBengaliNumber(selectedYear)}-এর ছুটির তালিকা (${toBengaliNumber(monthlyLeaveRecords.length)})`
                    : `Leaves in ${MONTHS_EN[selectedMonthIdx]} ${selectedYear} (${monthlyLeaveRecords.length})`}
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {monthlyLeaveRecords.length === 0 ? (
                <div className="py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                  {isBn ? 'এই মাসে কোনো ছুটির রেকর্ড নেই।' : 'No leave records for this month.'}
                </div>
              ) : (
                monthlyLeaveRecords.map((rec) => {
                  const isConfirming = confirmDeleteLeaveId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {rec.staffName}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              {rec.date}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                rec.leaveType === 'unpaid'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                              }`}
                            >
                              {getLeaveTypeLabel(rec.leaveType)}
                            </span>
                          </div>
                        </div>

                        {(isAdmin || canModifyStaffOnDate(rec.staffId, rec.date)) && (
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setConfirmDeleteLeaveId(isConfirming ? null : rec.id);
                            }}
                            className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {rec.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl">
                          {rec.note}
                        </p>
                      )}

                      {isConfirming && (
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                            {isBn ? 'ছুটির এন্ট্রি মুছবেন?' : 'Delete this leave entry?'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteLeaveId(null)}
                              className="h-7 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              {isBn ? 'না' : 'No'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const liveLock = getStaffAttendanceLockState(rec, isAdmin, Date.now());
                                if (!canModifyStaffOnDate(rec.staffId, rec.date) || (!isAdmin && liveLock.locked)) {
                                  setConfirmDeleteLeaveId(null);
                                  return;
                                }
                                await onDeleteAttendance(rec.id);
                                setConfirmDeleteLeaveId(null);
                              }}
                              className="h-7 px-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                            >
                              {isBn ? 'হ্যাঁ' : 'Yes'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* INDIVIDUAL STAFF ATTENDANCE DETAIL VIEW + MONTHLY PDF REPORT */}
      {/* ============================================================ */}
      {selectedDetailStaff && (
        <StaffAttendanceDetailView
          staff={selectedDetailStaff}
          attendanceRecords={attendanceRecords}
          lang={lang}
          selectedMonthIdx={selectedMonthIdx}
          selectedYear={selectedYear}
          todayIso={todayIso}
          isOwnProfile={isOwnStaffId(selectedDetailStaff.id)}
          canViewSalary={isAdmin || isOwnStaffId(selectedDetailStaff.id)}
          canDeleteDate={(dateStr) => canModifyStaffOnDate(selectedDetailStaff.id, dateStr)}
          onChangeMonth={(mIdx, yr) => {
            setSelectedMonthIdx(mIdx);
            setSelectedYear(yr);
          }}
          onDeleteAttendance={async (recordId: string) => {
            const rec = attendanceRecords.find((r) => r.id === recordId);
            if (!isAdmin && rec) {
              const liveLock = getStaffAttendanceLockState(rec, false, Date.now());
              if (rec.date !== todayIso || rec.staffId !== matchedOwnStaff?.id || liveLock.locked) {
                return;
              }
            }
            await onDeleteAttendance(recordId);
          }}
          onOpenPrintPreview={() => openStaffPrintPreview(selectedDetailStaff.id)}
          onClose={() => closeSubViewViaBack(() => setSelectedDetailStaffId(null))}
        />
      )}

      {/* ============================================================ */}
      {/* PER-STAFF MONTHLY A4 HARDCOPY PRINT / PDF PREVIEW MODAL       */}
      {/* ============================================================ */}
      <StaffMonthlyPrintPreviewModal
        isOpen={Boolean(printPreviewStaff)}
        staff={printPreviewStaff}
        attendanceRecords={attendanceRecords}
        selectedMonthIdx={selectedMonthIdx}
        selectedYear={selectedYear}
        canViewSalary={Boolean(
          printPreviewStaff && (isAdmin || isOwnStaffId(printPreviewStaff.id))
        )}
        lang={lang}
        onClose={() => closeSubViewViaBack(() => setPrintPreviewStaffId(null))}
      />

      {/* ============================================================ */}
      {/* STAFF LOGIN MODAL (UNLOCKS ONLY OWN ATTENDANCE CARD)         */}
      {/* ============================================================ */}
      {isStaffLoginOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'স্টাফ হাজিরা লগইন' : 'Staff Attendance Login'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn ? 'নিজের হাজিরা দেওয়ার জন্য যাচাই করুন' : 'Verify to unlock your own attendance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsStaffLoginOpen(false))}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStaffLoginSubmit} className="p-5 space-y-3.5">
              {staffLoginError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                  {staffLoginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'স্টাফ মোবাইল নাম্বার / কোড / নাম' : 'Staff Phone / Code / Name'}
                </label>
                <input
                  type="text"
                  required
                  value={staffLoginIdentifier}
                  onChange={(e) => setStaffLoginIdentifier(e.target.value)}
                  placeholder={isBn ? 'যেমন: 017XXXXXXXX' : 'e.g. 017XXXXXXXX'}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'স্টাফ পিন (PIN)' : 'Staff PIN'}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  required
                  value={staffLoginPin}
                  onChange={(e) => setStaffLoginPin(e.target.value)}
                  placeholder="••••"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingStaff}
                className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm shadow-teal-600/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isVerifyingStaff
                  ? isBn
                    ? 'যাচাই হচ্ছে...'
                    : 'Verifying...'
                  : isBn
                    ? 'স্টাফ লগইন করুন'
                    : 'Sign In as Staff'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADMIN PIN CONTROL MODAL (GLOBAL & PER-STAFF ATTENDANCE PINS) */}
      {/* ============================================================ */}
      {isAdmin && isPinControlOpen && (
        <div className="fixed inset-0 z-[72] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {isBn ? 'অ্যাডমিন স্টাফ পিন কন্ট্রোল' : 'Admin Staff PIN Control'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {isBn ? 'প্রতিটি স্টাফের আলাদা হাজিরা ও মেইন লগইন পিন সেট করুন' : 'Set per-staff attendance & main login PINs'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsPinControlOpen(false))}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminPinControl} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {pinControlFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold ${
                    pinControlFeedback.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {pinControlFeedback.text}
                </div>
              )}

              {/* Global Default PIN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {isBn ? 'ডিফল্ট গ্লোবাল স্টাফ পিন (৪-৮ সংখ্যা)' : 'Default Global Staff PIN (4–8 digits)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPinControlChars((v) => !v)}
                    className="text-[11px] font-bold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {showPinControlChars ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPinControlChars ? (isBn ? 'লুকান' : 'Hide') : (isBn ? 'দেখুন' : 'Show')}</span>
                  </button>
                </div>
                <input
                  type={showPinControlChars ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  value={draftGlobalPin}
                  onChange={(e) => setDraftGlobalPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1234"
                  className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isBn
                    ? 'যে স্টাফের আলাদা পিন ফাঁকা রাখা হবে, তার জন্য এই ডিফল্ট পিন কাজ করবে।'
                    : 'Used as fallback for any staff without a custom per-staff PIN.'}
                </p>
              </div>

              {/* Per-Staff Individual PIN List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {isBn ? `আলাদা আলাদা স্টাফ পিন (${toBengaliNumber(activeStaff.length)} জন)` : `Individual Staff PINs (${activeStaff.length})`}
                  </h4>
                </div>

                <input
                  type="text"
                  value={pinSearchQuery}
                  onChange={(e) => setPinSearchQuery(e.target.value)}
                  placeholder={isBn ? 'স্টাফের নাম বা মোবাইল দিয়ে খুঁজুন...' : 'Search staff name or phone...'}
                  className="w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeStaff
                    .filter((s) => {
                      const q = pinSearchQuery.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (s.name || '').toLowerCase().includes(q) ||
                        (s.phone || '').toLowerCase().includes(q) ||
                        (s.userCode || '').toLowerCase().includes(q)
                      );
                    })
                    .map((s) => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                            {s.phone || s.userCode || s.role}
                          </p>
                        </div>
                        <input
                          type={showPinControlChars ? 'text' : 'password'}
                          inputMode="numeric"
                          maxLength={8}
                          value={draftStaffPins[s.id] ?? ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setDraftStaffPins((prev) => ({
                              ...prev,
                              [s.id]: val
                            }));
                          }}
                          placeholder={isBn ? `ডিফল্ট (${draftGlobalPin || '1234'})` : `Default (${draftGlobalPin || '1234'})`}
                          className="w-32 h-9 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold tracking-widest text-center text-slate-900 dark:text-white"
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => closeSubViewViaBack(() => setIsPinControlOpen(false))}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বন্ধ করুন' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSavingPins}
                  className="flex-1 h-11 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                >
                  {isSavingPins
                    ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...')
                    : (isBn ? 'পিন সেটিংস সেভ করুন' : 'Save PIN Settings')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAFF SELF PIN CHANGE MODAL                                  */}
      {/* ============================================================ */}
      {!isAdmin && matchedOwnStaff && isChangeOwnPinOpen && (
        <div className="fixed inset-0 z-[72] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isBn ? 'নিজের স্টাফ পিন পরিবর্তন' : 'Change Own Staff PIN'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                    {matchedOwnStaff.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => closeSubViewViaBack(() => setIsChangeOwnPinOpen(false))}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangeOwnPinSubmit} className="p-5 space-y-3">
              {ownPinFeedback && (
                <div
                  className={`p-2.5 rounded-xl border text-xs font-bold ${
                    ownPinFeedback.type === 'error'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {ownPinFeedback.text}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {isBn ? 'পিন ৪-৮ সংখ্যার হতে হবে (মেইন ও হাজিরা লগইন একই থাকবে)' : '4–8 digits (synced with Main Login)'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowOwnPinChars((v) => !v)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                >
                  {showOwnPinChars ? (isBn ? 'লুকান' : 'Hide') : (isBn ? 'দেখুন' : 'Show')}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'বর্তমান পিন *' : 'Current PIN *'}
                </label>
                <input
                  type={showOwnPinChars ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={ownCurrentPin}
                  onChange={(e) => setOwnCurrentPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'নতুন পিন (৪-৮ সংখ্যা) *' : 'New PIN (4–8 digits) *'}
                </label>
                <input
                  type={showOwnPinChars ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={ownNewPin}
                  onChange={(e) => setOwnNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'নতুন পিন পুনরায় লিখুন *' : 'Confirm New PIN *'}
                </label>
                <input
                  type={showOwnPinChars ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  required
                  value={ownConfirmPin}
                  onChange={(e) => setOwnConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingOwnPin}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                {isSavingOwnPin
                  ? (isBn ? 'পরিবর্তন হচ্ছে...' : 'Updating...')
                  : (isBn ? 'নতুন পিন সংরক্ষণ করুন' : 'Save New PIN')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
