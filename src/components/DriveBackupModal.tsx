import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Clock, 
  HardDrive, 
  Lock, 
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  signInWithGoogleDrive, 
  disconnectGoogleDrive, 
  getDriveAccessToken, 
  getConnectedGoogleUser,
  uploadBackupToGoogleDrive, 
  listGoogleDriveBackups, 
  downloadGoogleDriveBackup, 
  deleteGoogleDriveBackup,
  DriveBackupFile 
} from '../utils/googleDrive';
import { 
  staffDb, 
  db, 
  safeSetDoc, 
  handleFirestoreError, 
  OperationType 
} from '../utils/firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { StaffAccount, AppUser, UserSession } from '../types';

interface DriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  currentUser?: UserSession | AppUser | null;
  adminAvatar?: string;
  onLogAction?: (action: string, actionBn: string, details: string) => void;
  onDataRestored?: () => void;
}

export const DriveBackupModal: React.FC<DriveBackupModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentUser,
  adminAvatar,
  onLogAction,
  onDataRestored
}) => {
  const isBn = lang === 'bn';

  // Auth state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Backup & Restore states
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState<boolean>(false);
  const [driveBackups, setDriveBackups] = useState<DriveBackupFile[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Confirmation Modal state for destructive operations
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: 'restore' | 'delete';
    targetFile?: DriveBackupFile;
    targetJsonData?: any;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionType: 'restore'
  });

  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'drive' | 'local' | 'security'>('drive');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('protyasha_auto_backup_enabled') === 'true';
    } catch {
      return true;
    }
  });

  // Check initial connection
  useEffect(() => {
    if (isOpen) {
      const token = getDriveAccessToken();
      const user = getConnectedGoogleUser();
      if (token && user) {
        setIsConnected(true);
        setGoogleUser(user);
        loadBackupList();
      } else {
        setIsConnected(false);
        setGoogleUser(null);
      }
    }
  }, [isOpen]);

  const loadBackupList = async () => {
    setIsLoadingBackups(true);
    try {
      const files = await listGoogleDriveBackups();
      setDriveBackups(files);
    } catch (err: any) {
      console.warn('Failed to load drive backups:', err);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  // Google Sign-In with Drive Permission
  const handleConnectDrive = async () => {
    setIsAuthLoading(true);
    setStatusMessage(null);
    try {
      const { user } = await signInWithGoogleDrive();
      setIsConnected(true);
      setGoogleUser(user);
      setStatusMessage({
        type: 'success',
        text: isBn 
          ? `✓ প্রত্যাশা ক্যাবল নেটওয়ার্কের সাথে গুগল ড্রাইভ সফলভাবে সংযুক্ত হয়েছে (${user.email || 'সক্রিয়'})` 
          : `✓ Successfully connected to Google Drive for Protasha Cable Network (${user.email || 'Active'})`
      });
      await loadBackupList();
    } catch (err: any) {
      console.error('Drive connection failed:', err);
      let errMsg = err.message || 'অনুমতি পাওয়া যায়নি';
      if (errMsg.includes('popup-closed-by-user') || errMsg.includes('popup_closed_by_user')) {
        errMsg = isBn 
          ? 'ব্রাউজার পপআপ ব্লক করা হয়েছে। দয়া করে ব্রাউজার সেটিংস থেকে পপআপ এলাউ করুন অথবা তাৎক্ষণিক ব্যাকআপের জন্য "লোকাল JSON ব্যাকআপ" ট্যাব ব্যবহার করুন।' 
          : 'Popup blocked. Please allow popups or use Local JSON Backup tab.';
      } else if (errMsg.includes('unauthorized-domain')) {
        errMsg = isBn 
          ? 'এই ডোমেইনটি ফায়ারবেসে অনুমোদিত নয়। দয়া করে "লোকাল JSON ব্যাকআপ" অপশন ব্যবহার করুন যা ১০০% কাজ করে।' 
          : 'Domain not authorized. Please use Local JSON Backup tab.';
      }
      setStatusMessage({
        type: 'error',
        text: isBn 
          ? `গুগল ড্রাইভ সংযোগ ব্যর্থ: ${errMsg}` 
          : `Drive connection failed: ${errMsg}`
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Disconnect Drive
  const handleDisconnectDrive = async () => {
    try {
      await disconnectGoogleDrive();
      setIsConnected(false);
      setGoogleUser(null);
      setDriveBackups([]);
      setStatusMessage({
        type: 'info',
        text: isBn ? 'গুগল ড্রাইভ সংযোগ বিচ্ছিন্ন করা হয়েছে' : 'Google Drive disconnected'
      });
    } catch (e: any) {
      console.error('Disconnect error:', e);
    }
  };

  // Collect All Master Data from Firestore
  const collectMasterBackupData = async () => {
    // 1. Fetch server_data snapshot from Firestore
    let serverSnapshot: any = {};
    try {
      const snap = await getDoc(doc(db, 'settings', 'server_data'));
      if (snap.exists()) {
        serverSnapshot = snap.data().data || {};
      }
    } catch (e) {
      console.warn('Firestore server_data read notice:', e);
    }

    // 2. Fetch live Firestore staff collection
    const cloudStaff: StaffAccount[] = [];
    try {
      const staffSnap = await getDocs(collection(staffDb, 'staff'));
      staffSnap.forEach(d => {
        const item = d.data() as StaffAccount;
        if (item && item.id) cloudStaff.push(item);
      });
    } catch (e) {
      console.warn('Firestore staff read notice:', e);
    }

    // 3. Fetch live Firestore staff_salaries collection
    const cloudSalaries: any[] = [];
    try {
      const salSnap = await getDocs(collection(staffDb, 'staff_salaries'));
      salSnap.forEach(d => {
        const item = d.data();
        if (item && item.id) cloudSalaries.push(item);
      });
    } catch (e) {
      console.warn('Firestore salaries read notice:', e);
    }

    // 4. Fetch AyByay transactions
    const ayTransactions: any[] = [];
    try {
      const txSnap = await getDocs(collection(staffDb, 'ay_byay_transactions'));
      txSnap.forEach(d => {
        const item = d.data();
        if (item && item.id) ayTransactions.push(item);
      });
    } catch (e) {
      console.warn('Firestore ay_transactions read notice:', e);
    }

    // Construct Master Backup Package
    const isSubAdmin = currentUser?.role === 'sub-admin';
    const currentUserId = currentUser?.id || '';

    // Filter logic...
    const filteredStaff = isSubAdmin 
      ? cloudStaff.filter((s: any) => s.recordedBy === currentUserId)
      : cloudStaff;

    const filteredSalaries = isSubAdmin
      ? cloudSalaries.filter((s: any) => s.recordedBy === currentUserId)
      : cloudSalaries;

    const filteredTransactions = isSubAdmin
      ? ayTransactions.filter((t: any) => t.recordedBy === currentUserId)
      : ayTransactions;

    const masterPackage = {
      appName: 'প্রত্যাশা ক্যাবল নেটওয়ার্ক - ক্লাউড মাস্টার ব্যাকআপ',
      backupVersion: '2.0',
      exportedAt: new Date().toISOString(),
      exportedBy: googleUser?.email || currentUser?.phone || 'admin',
      isPartial: isSubAdmin,
      stats: {
        staffCount: filteredStaff.length,
        salariesCount: filteredSalaries.length,
        transactionsCount: filteredTransactions.length,
        usersCount: isSubAdmin ? 0 : (serverSnapshot.users || []).length
      },
      firestore: {
        staff: filteredStaff,
        staff_salaries: filteredSalaries,
        ay_byay_transactions: filteredTransactions
      },
      serverData: serverSnapshot,
      ayByayData: {
        transactions: filteredTransactions,
        salaries: filteredSalaries,
        staff: filteredStaff
      }
    };

    return masterPackage;
  };

  // Perform Backup to Google Drive
  const handleBackupToDrive = async () => {
    if (!isConnected) {
      setStatusMessage({
        type: 'error',
        text: isBn ? 'অনুগ্রহ করে প্রথমে গুগল একাউন্ট দিয়ে ড্রাইভ কানেক্ট করুন' : 'Please connect Google Drive first'
      });
      return;
    }

    setIsBackingUp(true);
    setStatusMessage(null);
    try {
      const masterData = await collectMasterBackupData();
      const uploadedFile = await uploadBackupToGoogleDrive(masterData);

      setStatusMessage({
        type: 'success',
        text: isBn 
          ? `✓ মাস্টার ব্যাকআপ সফলভাবে গুগল ড্রাইভে সেভ হয়েছে! (ফাইল: ${uploadedFile.name})` 
          : `✓ Master backup saved to Google Drive successfully! (${uploadedFile.name})`
      });

      if (onLogAction) {
        onLogAction(
          'Google Drive Backup',
          'গুগল ড্রাইভে ব্যাকআপ',
          `ফাইল: ${uploadedFile.name} আপলোড সম্পন্ন (${uploadedFile.id})`
        );
      }

      // Reload drive list
      await loadBackupList();
    } catch (err: any) {
      console.error('Backup to drive failed:', err);
      setStatusMessage({
        type: 'error',
        text: isBn ? `ব্যাকআপ ব্যর্থ হয়েছে: ${err.message}` : `Backup failed: ${err.message}`
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Prompt Restore Confirmation from Drive File
  const handlePromptRestoreFromDrive = (file: DriveBackupFile) => {
    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'গুগল ড্রাইভ থেকে রিস্টোর নিশ্চিতকরণ' : 'Confirm Restore from Google Drive',
      message: isBn 
        ? `আপনি কি নিশ্চিত যে "${file.name}" ফাইলটি থেকে সম্পূর্ণ ডেটাবেস রিস্টোর করতে চান? এটি বর্তমান ফায়ারবেস ক্লাউড ও সিস্টেমে সংরক্ষিত সকল তথ্য ব্যাকআপ ডেটা দিয়ে আপডেট ও সমন্বয় করবে।`
        : `Are you sure you want to restore the entire database from "${file.name}"? This will update and sync your current Firebase Cloud data with the backup records.`,
      actionType: 'restore',
      targetFile: file
    });
  };

  // Prompt Delete Confirmation for Drive File
  const handlePromptDeleteDriveFile = (file: DriveBackupFile) => {
    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'ড্রাইভ থেকে ব্যাকআপ মুছে ফেলা' : 'Delete Backup from Google Drive',
      message: isBn
        ? `আপনি কি নিশ্চিত যে গুগল ড্রাইভ থেকে "${file.name}" ব্যাকআপ ফাইলটি চিরতরে মুছে ফেলতে চান?`
        : `Are you sure you want to permanently delete "${file.name}" from Google Drive?`,
      actionType: 'delete',
      targetFile: file
    });
  };

  // Execute Confirmed Restore
  const executeRestore = async (backupJson: any, sourceName: string) => {
    setIsRestoring(true);
    setStatusMessage(null);
    try {
      // 1. Restore Firestore staffDb collections
      const staffList = backupJson?.firestore?.staff || backupJson?.ayByayData?.staff || [];
      if (Array.isArray(staffList)) {
        for (const stf of staffList) {
          if (stf && stf.id) {
            await safeSetDoc(doc(staffDb, 'staff', stf.id), stf);
          }
        }
      }

      const salariesList = backupJson?.firestore?.staff_salaries || backupJson?.ayByayData?.salaries || [];
      if (Array.isArray(salariesList)) {
        for (const sal of salariesList) {
          if (sal && sal.id) {
            await safeSetDoc(doc(staffDb, 'staff_salaries', sal.id), sal);
          }
        }
      }

      const ayTransactions = backupJson?.firestore?.ay_byay_transactions || backupJson?.ayByayData?.transactions || [];
      if (Array.isArray(ayTransactions)) {
        for (const tx of ayTransactions) {
          if (tx && tx.id) {
            await safeSetDoc(doc(staffDb, 'ay_byay_transactions', tx.id), tx);
          }
        }
      }

      // 2. Restore Server Data (Firestore snapshots)
      if (backupJson.serverData) {
        await safeSetDoc(doc(db, 'settings', 'server_data'), {
          id: 'server_data',
          data: backupJson.serverData,
          updatedAt: new Date().toISOString()
        });
      }

      // 3. Update localStorage caches
      if (Array.isArray(staffList)) {
        try { localStorage.setItem('protyasha_staff', JSON.stringify(staffList)); } catch {}
        window.dispatchEvent(new CustomEvent('staff-data-changed', { detail: staffList }));
      }
      if (Array.isArray(salariesList)) {
        try { localStorage.setItem('isp_cache_salaries', JSON.stringify(salariesList)); } catch {}
      }

      setStatusMessage({
        type: 'success',
        text: isBn
          ? `✓ রিস্টোর সফল! ${staffList.length} জন কর্মী, ${salariesList.length} টি বেতন রেকর্ড ও সমস্ত লেনদেন সফলভাবে পুনরুদ্ধার হয়েছে।`
          : `✓ Restore successful! ${staffList.length} staff, ${salariesList.length} salary records & all transactions restored.`
      });

      if (onLogAction) {
        onLogAction(
          'Database Restored',
          'ডেটাবেস রিস্টোর সম্পন্ন',
          `উৎস: ${sourceName} (${staffList.length} কর্মী, ${salariesList.length} বেতন রেকর্ড)`
        );
      }

      if (onDataRestored) {
        onDataRestored();
      }
    } catch (err: any) {
      console.error('Restore error:', err);
      setStatusMessage({
        type: 'error',
        text: isBn ? `রিস্টোর ব্যর্থ হয়েছে: ${err.message}` : `Restore failed: ${err.message}`
      });
    } finally {
      setIsRestoring(false);
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    }
  };

  // Confirm Dialog Action Handler
  const handleConfirmAction = async () => {
    if (confirmDialog.actionType === 'restore') {
      if (confirmDialog.targetFile) {
        setIsRestoring(true);
        try {
          const fileData = await downloadGoogleDriveBackup(confirmDialog.targetFile.id);
          await executeRestore(fileData, confirmDialog.targetFile.name);
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: isBn ? `ফাইল ডাউনলোড ও রিস্টোর ব্যর্থ: ${err.message}` : `Failed: ${err.message}`
          });
          setIsRestoring(false);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      } else if (confirmDialog.targetJsonData) {
        await executeRestore(confirmDialog.targetJsonData, 'লোকাল ফাইল');
      }
    } else if (confirmDialog.actionType === 'delete' && confirmDialog.targetFile) {
      try {
        await deleteGoogleDriveBackup(confirmDialog.targetFile.id);
        setStatusMessage({
          type: 'success',
          text: isBn ? 'ব্যাকআপ ফাইলটি গুগল ড্রাইভ থেকে মুছে ফেলা হয়েছে' : 'Backup deleted from Drive'
        });
        setDriveBackups(prev => prev.filter(f => f.id !== confirmDialog.targetFile?.id));
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: isBn ? `ফাইল মুছতে সমস্যা হয়েছে: ${err.message}` : `Failed to delete: ${err.message}`
        });
      } finally {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    }
  };

  // Local JSON Download
  const handleDownloadLocalJson = async () => {
    setIsBackingUp(true);
    try {
      const masterData = await collectMasterBackupData();
      const jsonStr = JSON.stringify(masterData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      a.href = url;
      a.download = `Protyasha_Local_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: isBn ? '✓ লোকাল ব্যাকআপ JSON ফাইল ডাউনলোড সম্পন্ন হয়েছে' : '✓ Local backup JSON downloaded'
      });
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: isBn ? `ডাউনলোড ব্যর্থ: ${e.message}` : `Download failed: ${e.message}`
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Local JSON File Upload & Restore
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('অকার্যকর ফাইল ফরম্যাট');
        }

        setConfirmDialog({
          isOpen: true,
          title: isBn ? 'লোকাল ফাইল থেকে রিস্টোর' : 'Restore from Local File',
          message: isBn
            ? `আপনি লোকাল ফাইল "${file.name}" নির্বাচন করেছেন। আপনি কি এই ফাইল থেকে সম্পূর্ণ ফায়ারবেস ডেটাবেস ও সিস্টেম রিস্টোর করতে চান?`
            : `You selected "${file.name}". Do you want to restore the database from this file?`,
          actionType: 'restore',
          targetJsonData: parsed
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: isBn ? `ফাইল পড়তে সমস্যা হয়েছে: ${err.message}` : `Error parsing JSON: ${err.message}`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const toggleAutoBackup = (enabled: boolean) => {
    setAutoBackupEnabled(enabled);
    try {
      localStorage.setItem('protyasha_auto_backup_enabled', enabled ? 'true' : 'false');
    } catch {}
    setStatusMessage({
      type: 'info',
      text: enabled 
        ? (isBn ? 'স্বয়ংক্রিয় ব্যাকআপ রিমাইন্ডার সক্রিয় করা হয়েছে' : 'Auto backup reminder enabled')
        : (isBn ? 'স্বয়ংক্রিয় ব্যাকআপ রিমাইন্ডার নিষ্ক্রিয় করা হয়েছে' : 'Auto backup reminder disabled')
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full my-auto max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#D32F2F] via-[#E52E2E] to-rose-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-xs">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক - ক্লাউড ব্যাকআপ ও রিস্টোর' : 'Protasha Cable Network - Cloud Backup & Restore'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  2-Layer
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                {isBn ? 'ফায়ারবেস ক্লাউড ডেটাবেস + গুগল ড্রাইভ মাস্টার ব্যাকআপ' : 'Firebase Cloud Database + Google Drive Master Backup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'drive'
                ? 'bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isBn ? 'গুগল ড্রাইভ ব্যাকআপ' : 'Google Drive Backup'}</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'local'
                ? 'bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>{isBn ? 'লোকাল JSON ব্যাকআপ' : 'Local JSON Backup'}</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-800 text-[#E52E2E] dark:text-rose-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? '২-লেয়ার সিকিউরিটি' : '2-Layer Security'}</span>
          </button>
        </div>

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className={`mx-4 mt-3 p-3 rounded-2xl text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Cloud className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: GOOGLE DRIVE BACKUP & RESTORE */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              {/* Google Drive Connection Card with Prominent App Branding */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50/70 via-white to-slate-50 dark:from-slate-800/80 dark:via-slate-850 dark:to-slate-900 rounded-3xl border-2 border-rose-200 dark:border-rose-950/60 shadow-sm space-y-3">
                {/* Top: App Brand Lockup & Connection Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {/* App Logo or Admin Avatar with Red Glow */}
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D32F2F] via-[#E52E2E] to-[#FF9800] p-0.5 shadow-md shadow-rose-500/25 flex items-center justify-center overflow-hidden shrink-0">
                      {adminAvatar ? (
                        <img 
                          src={adminAvatar} 
                          alt="Logo" 
                          className="w-full h-full object-cover rounded-2xl" 
                        />
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
                          <span className="text-[#E52E2E] font-black text-xl leading-none">
                            প্র
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs">
                        <Cloud className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                          {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          isConnected 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-900'
                        }`}>
                          {isConnected ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>✓ জিমেইল কানেক্টেড</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>জিমেইল কানেক্ট করা হয়নি</span>
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold mt-0.5">
                        {isBn ? 'গুগল ড্রাইভ সেন্ট্রালাইজড ক্লাউড ব্যাকআপ সিস্টেম' : 'Google Drive Centralized Cloud Backup System'}
                      </p>
                    </div>
                  </div>

                  {isConnected && (
                    <button
                      onClick={handleDisconnectDrive}
                      className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                    >
                      {isBn ? 'ডিসকানেক্ট' : 'Disconnect'}
                    </button>
                  )}
                </div>

                {/* Bottom: Connection details / Sign In CTA */}
                {!isConnected ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 max-w-md">
                        <p className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed">
                          {isBn 
                            ? 'প্রত্যাশা ক্যাবল নেটওয়ার্কের সকল গ্রাহক খতিয়ান, দৈনিক আয়-ব্যয় ও মাসিক বেতন ডাটাবেস ক্লাউডে সুরক্ষিত রাখতে আপনার গুগল জিমেইল একাউন্ট যুক্ত করুন।' 
                            : 'Connect your Google Gmail account to keep all customer ledgers, daily accounts and salaries safe in Google Drive.'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {isBn ? '• গুগল ড্রাইভের "Admin_Backups" ফোল্ডারে সম্পূর্ণ স্বয়ংক্রিয় ব্যাকআপ থাকবে' : '• Stored safely in your Drive Admin_Backups folder'}
                        </p>
                      </div>

                      <button
                        onClick={handleConnectDrive}
                        disabled={isAuthLoading}
                        className="gsi-material-button w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-rose-300 hover:border-[#E52E2E] dark:border-slate-700 font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50 shrink-0 group"
                      >
                        <div className="gsi-material-button-icon w-4.5 h-4.5 shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 48 48" className="w-4.5 h-4.5">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                          </svg>
                        </div>
                        <span className="text-slate-800 dark:text-slate-100 group-hover:text-[#E52E2E] transition-colors">
                          {isAuthLoading ? (isBn ? 'কানেক্ট হচ্ছে...' : 'Connecting...') : (isBn ? 'গুগল দিয়ে জিমেইল কানেক্ট করুন' : 'Sign in with Google')}
                        </span>
                      </button>
                    </div>
                    <div className="pt-2.5 border-t border-rose-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{isBn ? 'ড্রাইভ পপআপে সমস্যা হলে তাৎক্ষণিক ব্যাকআপ ব্যবহার করুন:' : 'Having popup issues? Use instant backup:'}</span>
                      <button
                        onClick={() => setActiveTab('local')}
                        className="font-bold text-[#E52E2E] hover:underline cursor-pointer inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>{isBn ? 'লোকাল JSON ব্যাকআপ (১০০% সচল)' : 'Local JSON Backup'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 shadow-2xs">
                    {googleUser?.photoURL ? (
                      <img 
                        src={googleUser.photoURL} 
                        alt="Google avatar" 
                        className="w-10 h-10 rounded-full border-2 border-emerald-500 shadow-xs shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                        {googleUser?.email ? googleUser.email.charAt(0).toUpperCase() : 'G'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {googleUser?.displayName || 'অ্যাডমিন গুগল একাউন্ট'}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                          সক্রিয়
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                        {googleUser?.email}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {isBn ? 'ফোল্ডার: Admin_Backups • প্রত্যাশা ক্যাবল নেটওয়ার্কের ক্লাউড ব্যাকআপ প্রস্তুত' : 'Folder: Admin_Backups • Ready for backup'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* One-Click Backup Action Banner */}
              <div className="p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#E52E2E]" />
                    <span>{isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্কের সম্পূর্ণ ক্লাউড ব্যাকআপ' : 'Protasha Cable Network Master Cloud Backup'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {isBn 
                      ? 'স্টাফ হিসাব, বকেয়া কালেকশন, মাসিক বেতন, আয়-ব্যয় লেনদেন ও ইউজার অ্যাকাউন্টের একটি মাস্টার কপি আপনার গুগল ড্রাইভে তৈরি হবে।'
                      : 'Create a full master JSON snapshot of staff payroll, accounting transactions and settings into Google Drive.'}
                  </p>
                </div>
                <button
                  onClick={handleBackupToDrive}
                  disabled={!isConnected || isBackingUp}
                  className="px-4 py-2.5 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shrink-0"
                >
                  {isBackingUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isBn ? 'ব্যাকআপ তৈরি হচ্ছে...' : 'Backing up...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>{isBn ? 'গুগল ড্রাইভে ব্যাকআপ তুলুন' : 'Backup to Google Drive'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Google Drive Saved Backups List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pt-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span>{isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্কের সংরক্ষিত ড্রাইভ ব্যাকআপসমূহ' : 'Saved Backups in Google Drive'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                      {driveBackups.length} টি ফাইল
                    </span>
                  </h4>
                  {isConnected && (
                    <button
                      onClick={loadBackupList}
                      disabled={isLoadingBackups}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title={isBn ? 'রিফ্রেশ করুন' : 'Refresh list'}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>

                {!isConnected ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                    <Cloud className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
                    <p className="text-slate-500 font-medium">
                      {isBn ? 'ড্রাইভের পূর্ববর্তী ব্যাকআপ তালিকা দেখতে উপরে "গুগল দিয়ে জিমেইল কানেক্ট করুন"।' : 'Sign in with Google to view your drive backup files.'}
                    </p>
                  </div>
                ) : isLoadingBackups ? (
                  <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span>{isBn ? 'গুগল ড্রাইভ স্ক্যান করা হচ্ছে...' : 'Scanning Google Drive...'}</span>
                  </div>
                ) : driveBackups.length === 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1">
                    <p className="text-slate-600 dark:text-slate-300 font-bold">
                      {isBn ? 'এখনো কোনো ব্যাকআপ ফাইল পাওয়া যায়নি' : 'No backups found yet in Google Drive'}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {isBn ? 'উপরে "Backup to Drive" বাটনে চাপ দিয়ে প্রথম মাস্টার ব্যাকআপ নিন।' : 'Click "Backup to Google Drive" above to create your first backup.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                    {driveBackups.map(file => {
                      const createdDate = file.createdTime ? new Date(file.createdTime).toLocaleString('bn-BD', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '—';

                      const sizeKb = file.size ? `${(Number(file.size) / 1024).toFixed(1)} KB` : '—';

                      return (
                        <div key={file.id} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate text-xs" title={file.name}>
                                {file.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{createdDate}</span>
                                </span>
                                <span>•</span>
                                <span>{sizeKb}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Restore Button */}
                            <button
                              onClick={() => handlePromptRestoreFromDrive(file)}
                              disabled={isRestoring}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title={isBn ? 'এই ফাইল থেকে রিস্টোর করুন' : 'Restore from this backup'}
                            >
                              <RefreshCw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
                              <span>{isBn ? 'রিস্টোর' : 'Restore'}</span>
                            </button>

                            {/* View in Drive */}
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={isBn ? 'গুগল ড্রাইভে দেখুন' : 'View in Google Drive'}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Delete File */}
                            <button
                              onClick={() => handlePromptDeleteDriveFile(file)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title={isBn ? 'মুছে ফেলুন' : 'Delete file'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL OFFLINE JSON BACKUP & RESTORE */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isBn ? 'অফলাইন JSON ফাইল ডাউনলোড' : 'Download Offline JSON File'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      {isBn 
                        ? 'গুগল ড্রাইভ ছাড়াও সরাসরি কম্পিউটার বা মোবাইলে একটি অফলাইন ব্যাকআপ ফাইল সেভ করে রাখুন।'
                        : 'Download a complete JSON copy directly to your computer or mobile storage.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadLocalJson}
                  disabled={isBackingUp}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isBn ? 'কম্পিউটার/ফোনে ব্যাকআপ ডাউনলোড করুন' : 'Download Backup File (.json)'}</span>
                </button>
              </div>

              {/* Local File Upload & Restore */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isBn ? 'ফাইল আপলোড করে রিস্টোর (File Upload & Restore)' : 'Upload File & Restore'}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      {isBn 
                        ? 'পূর্বে ডাউনলোড করা কোনো JSON ব্যাকআপ ফাইল নির্বাচন করে মুহূর্তেই পুরো সিস্টেম ফিরিয়ে আনুন।'
                        : 'Select a previously saved JSON backup file to restore the database.'}
                    </p>
                  </div>
                </div>

                <label className="w-full py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{isBn ? 'JSON ব্যাকআপ ফাইল নির্বাচন করুন' : 'Choose JSON Backup File'}</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: 2-LAYER SECURITY ARCHITECTURE */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              {/* Layer 1 Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                  ১
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>লেয়ার ১: ফায়ারবেস ক্লাউড ডাটাবেস (Firebase Cloud Database)</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                      রিয়েল-টাইম
                    </span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                    ইউজার বা সাব-অ্যাডমিন অ্যাপে কোনো এন্ট্রি বা পরিবর্তন করলেই তা সরাসরি সেন্ট্রাল ফায়ারবেস (Firestore <code className="text-blue-600 font-mono">staff-collection-db</code>) ডাটাবেসে তাৎক্ষণিক সংরক্ষিত হয়। অ্যাপ আনইনস্টল বা কোড আপডেট করলেও এই ডেটা চিরতরে ক্লাউডে সুরক্ষিত থাকে।
                  </p>
                </div>
              </div>

              {/* Layer 2 Info */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                  ২
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>লেয়ার ২: গুগল ড্রাইভ ব্যাকআপ (Google Drive Backup)</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                      মাস্টার কপি
                    </span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                    সার্ভার ক্র্যাশ বা অনাকাঙ্ক্ষিত দুর্যোগ থেকে ১০০% সুরক্ষার জন্য অ্যাডমিনের নিজস্ব গুগল ড্রাইভের <code className="text-emerald-600 font-mono">Admin_Backups</code> ফোল্ডারে মাস্টার JSON ফাইল সেভ থাকে। যেকোনো নতুন ডিভাইসে গুগল একাউন্ট দিয়ে এক ক্লিকেই পুরো ডেটাবেস রিস্টোর করা যায়।
                  </p>
                </div>
              </div>

              {/* Scope & Privacy Guarantee */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>গুগল ড্রাইভ পার্মিশন ও প্রাইভেসির নিশ্চয়তা</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  এই অ্যাপে শুধুমাত্র <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-800 dark:text-slate-200 font-mono text-[10px]">drive.file</code> স্কোপ ব্যবহার করা হয়েছে। এর মাধ্যমে অ্যাপ শুধুমাত্র তার নিজের তৈরি করা ব্যাকআপ ফাইলে হাত দিতে পারবে; আপনার গুগল ড্রাইভের ব্যক্তিগত অন্য কোনো ফাইল বা তথ্যে অ্যাপের কোনো অ্যাক্সেস নেই।
                </p>
              </div>

              {/* Auto Backup Reminder Toggle */}
              <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-indigo-950 dark:text-indigo-200">
                    দৈনিক অটো-ব্যাকআপ নোটিশ ও রিমাইন্ডার
                  </h5>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                    প্রতিদিন অ্যাডমিন প্যানেলে স্বয়ংক্রিয় ব্যাকআপের অনুস্মারক দেখতে এটি চালু রাখুন
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackupEnabled}
                  onChange={e => toggleAutoBackup(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer shrink-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isBn ? 'ক্লাউড ডেটা ১০০% এনক্রিপ্টেড ও সুরক্ষিত' : '100% Encrypted & Safe'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>

      {/* MANDATORY CONFIRMATION DIALOG FOR RESTORE / DELETE */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              confirmDialog.actionType === 'restore' 
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60' 
                : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60'
            }`}>
              {confirmDialog.actionType === 'restore' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <Trash2 className="w-7 h-7" />
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {confirmDialog.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {confirmDialog.message}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                disabled={isRestoring}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isRestoring}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  confirmDialog.actionType === 'restore'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isBn ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
                  </>
                ) : (
                  <span>{confirmDialog.actionType === 'restore' ? (isBn ? 'হ্যাঁ, রিস্টোর করুন' : 'Confirm Restore') : (isBn ? 'হ্যাঁ, মুছে ফেলুন' : 'Confirm Delete')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
