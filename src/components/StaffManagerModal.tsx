import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  Users, 
  Phone, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  Printer, 
  Search, 
  X, 
  Upload, 
  Image as ImageIcon,
  Edit2,
  AlertTriangle,
  Download,
  CheckCircle2
} from 'lucide-react';
import { Language, StaffAccount, StaffTransaction, UserSession } from '../types';
import { formatCurrency, toBengaliNumber, toEnglishNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';
import { savePersistentImage } from '../utils/imageStorage';

interface StaffManagerModalProps {
  isOpen: boolean;
  staffAccounts: StaffAccount[];
  lang: Language;
  user: UserSession | null;
  onClose: () => void;
  onSaveStaffAccounts: (updated: StaffAccount[]) => void;
  onDeleteStaffAccount?: (staffId: string) => void;
  onDeleteStaffTransaction?: (staffId: string, txId: string) => void;
  onLogAction?: (action: string, actionBn: string, details: string) => void;
}

export const StaffManagerModal: React.FC<StaffManagerModalProps> = ({
  isOpen,
  staffAccounts,
  lang,
  user,
  onClose,
  onSaveStaffAccounts,
  onDeleteStaffAccount,
  onDeleteStaffTransaction,
  onLogAction
}) => {
  const isBn = lang === 'bn';

  const [accounts, setAccounts] = useState<StaffAccount[]>(staffAccounts);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals inside Staff Manager
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffAccount | null>(null);

  // Custom Confirmation & Toast States
  const [deletingStaff, setDeletingStaff] = useState<StaffAccount | null>(null);
  const [deletingTx, setDeletingTx] = useState<{ staffId: string; txId: string; note: string; amount: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Dues / Collection Entry State
  const [entryStaff, setEntryStaff] = useState<StaffAccount | null>(null);
  const [editingTx, setEditingTx] = useState<StaffTransaction | null>(null);
  const [entryType, setEntryType] = useState<'due' | 'collection'>('due');
  const [entryAmount, setEntryAmount] = useState('');
  const [entryUserName, setEntryUserName] = useState('');
  const [entryCustomerName, setEntryCustomerName] = useState('');
  const [entryAddress, setEntryAddress] = useState('');
  const [entryReference, setEntryReference] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [entryDate, setEntryDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState('লাইন টেকনিশিয়ান');
  const [staffAddress, setStaffAddress] = useState('');
  const [staffReference, setStaffReference] = useState('');
  const [staffAvatar, setStaffAvatar] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [initialDue, setInitialDue] = useState('');

  // Printable Report Mode State
  const [isPrintingReport, setIsPrintingReport] = useState(false);
  const [printingStaff, setPrintingStaff] = useState<StaffAccount | null>(null);

  // Synchronize with props
  useEffect(() => {
    setAccounts(staffAccounts);
  }, [staffAccounts]);

  // Keep selectedStaff up to date if accounts change
  useEffect(() => {
    if (selectedStaff) {
      const updated = accounts.find(a => a.id === selectedStaff.id);
      if (updated) setSelectedStaff(updated);
    }
  }, [accounts]);

  // Sort transactions chronologically: Oldest first (top), newest last (bottom)
  const getSortedTransactions = (txs: StaffTransaction[] = []) => {
    return [...txs].sort((a, b) => {
      const timeA = a.created || (new Date(a.date).getTime());
      const timeB = b.created || (new Date(b.date).getTime());
      return timeA - timeB; // Ascending: Earlier entries first (top), later entries last (bottom)
    });
  };

  // Handle hardware device/browser back button & Escape key inside StaffManagerModal
  useEffect(() => {
    if (!isOpen) return;

    const handleModalPopState = (e: PopStateEvent) => {
      if (deletingStaff) {
        e.stopImmediatePropagation();
        setDeletingStaff(null);
      } else if (deletingTx) {
        e.stopImmediatePropagation();
        setDeletingTx(null);
      } else if (isPrintingReport) {
        e.stopImmediatePropagation();
        setIsPrintingReport(false);
        setPrintingStaff(null);
      } else if (isAddStaffOpen) {
        e.stopImmediatePropagation();
        setIsAddStaffOpen(false);
        setEditingStaff(null);
      } else if (entryStaff || editingTx) {
        e.stopImmediatePropagation();
        setEntryStaff(null);
        setEditingTx(null);
      } else if (selectedStaff) {
        e.stopImmediatePropagation();
        setSelectedStaff(null);
      } else {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletingStaff) {
          setDeletingStaff(null);
        } else if (deletingTx) {
          setDeletingTx(null);
        } else if (isPrintingReport) {
          setIsPrintingReport(false);
          setPrintingStaff(null);
        } else if (isAddStaffOpen) {
          setIsAddStaffOpen(false);
          setEditingStaff(null);
        } else if (entryStaff || editingTx) {
          setEntryStaff(null);
          setEditingTx(null);
        } else if (selectedStaff) {
          setSelectedStaff(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('popstate', handleModalPopState, false);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleModalPopState, false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isAddStaffOpen, entryStaff, selectedStaff, isPrintingReport, deletingStaff, deletingTx, onClose]);

  if (!isOpen) return null;

  // Aggregate totals
  const totalDues = accounts.reduce((sum, a) => sum + (a.totalDue || 0), 0);
  const totalCollected = accounts.reduce((sum, a) => sum + (a.totalCollected || 0), 0);
  const netRemainingDue = accounts.reduce((sum, a) => sum + (a.remainingDue || 0), 0);

  // Filter staff
  const filteredAccounts = accounts.filter(a => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q)
    );
  });

  // Handle Staff Photo Upload with Automatic Image Compression (~30KB)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
        setStaffAvatar(compressedDataUrl);
        sounds.playSuccess();
      } catch (err) {
        console.error('Error compressing staff photo:', err);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  // Create or Update Staff Account
  const handleSaveStaffForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast(isBn ? 'দুঃখিত, শুধুমাত্র অ্যাডমিন স্টাফ পরিবর্তন করতে পারবেন' : 'Sorry, only admin can modify staff');
      return;
    }

    if (!staffName.trim()) {
      showToast(isBn ? 'অনুগ্রহ করে স্টাফের নাম লিখুন' : 'Please enter staff name');
      return;
    }

    sounds.playSuccess();
    const initDueVal = parseFloat(toEnglishNumber(initialDue).replace(/,/g, '')) || 0;

    let updatedList: StaffAccount[] = [];

    if (editingStaff) {
      // Edit existing staff
      updatedList = accounts.map(a => {
        if (a.id === editingStaff.id) {
          return {
            ...a,
            name: staffName.trim(),
            phone: staffPhone.trim(),
            role: staffRole.trim(),
            userCode: '',
            address: staffAddress.trim() || '',
            reference: staffReference.trim() || '',
            avatarUrl: staffAvatar || a.avatarUrl || '',
            notes: staffNotes.trim() || ''
          };
        }
        return a;
      });
      if (onLogAction) {
        onLogAction('Updated Staff', 'স্টাফ তথ্য পরিবর্তন', `${staffName.trim()} (${staffPhone.trim()})`);
      }
      showToast(`"${staffName.trim()}" স্টাফের তথ্য আপডেট করা হয়েছে!`);
    } else {
      // Create new staff
      const newStaffId = `staff-${Date.now()}`;
      const initialTx: StaffTransaction[] = initDueVal > 0 ? [
        {
          id: `stx-${Date.now()}`,
          staffId: newStaffId,
          type: 'due',
          amount: initDueVal,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          userName: '',
          customerName: staffName.trim() || '',
          customerAddress: staffAddress.trim() || '',
          reference: staffReference.trim() || '',
          note: 'প্রারম্ভিক কোম্পানি পাওনা',
          recordedBy: user?.name || 'অ্যাডমিন',
          created: Date.now()
        }
      ] : [];

      const newAccount: StaffAccount = {
        id: newStaffId,
        name: staffName.trim(),
        phone: staffPhone.trim() || '01700000000',
        role: staffRole.trim() || 'কালেকশন টেকনিশিয়ান',
        userCode: '',
        address: staffAddress.trim() || '',
        reference: staffReference.trim() || '',
        avatarUrl: staffAvatar || '',
        totalDue: initDueVal,
        totalCollected: 0,
        remainingDue: initDueVal,
        notes: staffNotes.trim() || '',
        createdAt: new Date().toISOString(),
        transactions: initialTx
      };

      updatedList = [newAccount, ...accounts];
      if (onLogAction) {
        onLogAction('Added Staff', 'নতুন স্টাফ যোগ', `${staffName.trim()} (${staffPhone.trim()})`);
      }
      showToast(`"${staffName.trim()}" স্টাফ অ্যাকাউন্ট তৈরি করা হয়েছে!`);
    }

    const sanitizedList: StaffAccount[] = JSON.parse(JSON.stringify(updatedList));
    setAccounts(sanitizedList);
    onSaveStaffAccounts(sanitizedList);

    // Reset form
    setIsAddStaffOpen(false);
    setEditingStaff(null);
    setStaffName('');
    setStaffPhone('');
    setStaffRole('লাইন টেকনিশিয়ান');
    setStaffAddress('');
    setStaffReference('');
    setStaffAvatar('');
    setStaffNotes('');
    setInitialDue('');
  };

  // Open Edit Staff Modal
  const handleOpenEditStaff = (staff: StaffAccount) => {
    sounds.playTap();
    setEditingStaff(staff);
    setStaffName(staff.name);
    setStaffPhone(staff.phone);
    setStaffRole(staff.role);
    setStaffAddress(staff.address || '');
    setStaffReference(staff.reference || '');
    setStaffAvatar(staff.avatarUrl || '');
    setStaffNotes(staff.notes || '');
    setInitialDue('');
    setIsAddStaffOpen(true);
    window.history.pushState({ staffModal: 'edit' }, '');
  };

  // Request Delete Staff Account (Open Custom Dialog)
  const handleRequestDeleteStaff = (staff: StaffAccount) => {
    sounds.playTap();
    setDeletingStaff(staff);
    window.history.pushState({ staffModal: 'deleteStaff' }, '');
  };

  // Confirm Delete Staff Account
  const handleConfirmDeleteStaff = () => {
    if (!deletingStaff) return;
    sounds.playSuccess();
    const staffId = deletingStaff.id;
    const staffName = deletingStaff.name;
    const updated = accounts.filter(a => a.id !== staffId);
    setAccounts(updated);
    onSaveStaffAccounts(updated);
    if (onDeleteStaffAccount) {
      onDeleteStaffAccount(staffId);
    }
    if (selectedStaff?.id === staffId) setSelectedStaff(null);
    if (onLogAction) {
      onLogAction('Deleted Staff', 'স্টাফ অ্যাকাউন্ট বাতিল', `Name: ${staffName}`);
    }
    setDeletingStaff(null);
    showToast(`"${staffName}" স্টাফ অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে!`);
  };

  // Close Dues / Collection / Edit Entry Modal
  const handleCloseEntry = () => {
    setEntryStaff(null);
    setEditingTx(null);
    setEntryAmount('');
    setEntryUserName('');
    setEntryCustomerName('');
    setEntryAddress('');
    setEntryReference('');
    setEntryNote('');
  };

  // Open Add Due or Record Collection Entry Modal
  const handleOpenEntry = (staff: StaffAccount, type: 'due' | 'collection') => {
    if (!isAdmin) {
      showToast(isBn ? 'শুধুমাত্র অ্যাডমিন হিসাব পরিবর্তন করতে পারবেন' : 'Only admin can record transactions');
      return;
    }
    sounds.playTap();
    setEditingTx(null);
    setEntryStaff(staff);
    setEntryType(type);
    setEntryAmount('');
    setEntryUserName(staff.userCode || '');
    setEntryCustomerName('');
    setEntryAddress(staff.address || '');
    setEntryReference(staff.reference || '');
    setEntryNote('');
    setEntryDate(new Date().toISOString().split('T')[0]);
    window.history.pushState({ staffModal: 'entry' }, '');
  };

  // Open Edit Staff Transaction Modal (Admin Only)
  const handleOpenEditTx = (staff: StaffAccount, tx: StaffTransaction) => {
    if (!isAdmin) {
      showToast(isBn ? 'শুধুমাত্র অ্যাডমিন লেনদেন পরিবর্তন করতে পারবেন' : 'Only admin can edit transactions');
      return;
    }
    sounds.playTap();
    setEditingTx(tx);
    setEntryStaff(staff);
    setEntryType(tx.type);
    setEntryAmount(tx.amount.toString());
    setEntryUserName(tx.userName || '');
    setEntryCustomerName(tx.customerName || '');
    setEntryAddress(tx.customerAddress || '');
    setEntryReference(tx.reference || '');
    setEntryNote(tx.note || '');
    setEntryDate(tx.date || new Date().toISOString().split('T')[0]);
    window.history.pushState({ staffModal: 'entry' }, '');
  };

  // Submit Dues / Collection Entry or Save Edited Transaction
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast(isBn ? 'শুধুমাত্র অ্যাডমিন হিসাব পরিবর্তন করতে পারবেন' : 'Only admin can record transactions');
      return;
    }
    if (!entryStaff) return;

    const amt = parseFloat(toEnglishNumber(entryAmount).replace(/,/g, ''));
    if (isNaN(amt) || amt <= 0) {
      showToast(isBn ? 'দয়া করে সঠিক টাকার পরিমাণ দিন' : 'Please enter a valid amount');
      return;
    }

    sounds.playSuccess();

    // If in editing mode for an existing transaction
    if (editingTx) {
      const updatedTx: StaffTransaction = {
        ...editingTx,
        type: entryType,
        amount: amt,
        date: entryDate,
        userName: entryUserName.trim() || '',
        customerName: entryCustomerName.trim() || '',
        customerAddress: entryAddress.trim() || '',
        reference: entryReference.trim() || '',
        note: entryNote.trim() || (entryCustomerName.trim() ? entryCustomerName.trim() : (entryType === 'due' ? 'কোম্পানি পাওনা বিল' : 'স্টাফ কালেকশন ক্যাশ জমা')),
        recordedBy: user?.name || editingTx.recordedBy || 'অ্যাডমিন',
      };

      const updatedList = accounts.map(a => {
        if (a.id === entryStaff.id) {
          const oldTxs = a.transactions || [];
          const txs = oldTxs.map(t => t.id === editingTx.id ? updatedTx : t);
          const newTotalDue = txs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
          const newTotalCollected = txs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
          const newRemaining = newTotalDue - newTotalCollected;

          const updatedAccount = {
            ...a,
            totalDue: newTotalDue,
            totalCollected: newTotalCollected,
            remainingDue: newRemaining,
            transactions: txs
          };
          if (selectedStaff && selectedStaff.id === a.id) {
            setSelectedStaff(updatedAccount);
          }
          return updatedAccount;
        }
        return a;
      });

      const sanitizedList: StaffAccount[] = JSON.parse(JSON.stringify(updatedList));
      setAccounts(sanitizedList);
      onSaveStaffAccounts(sanitizedList);

      if (onLogAction) {
        onLogAction(
          'Staff Transaction Edited',
          'স্টাফ লেনদেন পরিবর্তন',
          `${entryStaff.name} [${entryUserName.trim() || 'সাধারণ'}]: ৳${amt}`
        );
      }

      handleCloseEntry();
      showToast('লেনদেন রেকর্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      return;
    }

    // Creating a new transaction
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newTx: StaffTransaction = {
      id: `stx-${Date.now()}`,
      staffId: entryStaff.id,
      type: entryType,
      amount: amt,
      date: entryDate,
      time: timeFormatted,
      userName: entryUserName.trim() || '',
      customerName: entryCustomerName.trim() || '',
      customerAddress: entryAddress.trim() || '',
      reference: entryReference.trim() || '',
      note: entryNote.trim() || (entryCustomerName.trim() ? entryCustomerName.trim() : (entryType === 'due' ? 'কোম্পানি পাওনা বিল' : 'স্টাফ কালেকশন ক্যাশ জমা')),
      recordedBy: user?.name || 'অ্যাডমিন',
      created: Date.now()
    };

    const updatedList = accounts.map(a => {
      if (a.id === entryStaff.id) {
        const txs = [...(a.transactions || []), newTx];
        const newTotalDue = txs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
        const newTotalCollected = txs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
        const newRemaining = newTotalDue - newTotalCollected;

        const updatedAccount = {
          ...a,
          totalDue: newTotalDue,
          totalCollected: newTotalCollected,
          remainingDue: newRemaining,
          transactions: txs
        };
        if (selectedStaff && selectedStaff.id === a.id) {
          setSelectedStaff(updatedAccount);
        }
        return updatedAccount;
      }
      return a;
    });

    const sanitizedList: StaffAccount[] = JSON.parse(JSON.stringify(updatedList));
    setAccounts(sanitizedList);
    onSaveStaffAccounts(sanitizedList);

    if (onLogAction) {
      onLogAction(
        entryType === 'due' ? 'Staff Due Added' : 'Staff Collection Recorded',
        entryType === 'due' ? 'স্টাফ পাওনা যোগ' : 'স্টাফ কালেকশন জমা',
        `${entryStaff.name} [${entryUserName.trim() || 'সাধারণ'}]: ৳${amt}`
      );
    }

    handleCloseEntry();
    showToast(`${entryType === 'due' ? 'পাওনা এন্ট্রি' : 'কালেকশন জমা'} সফলভাবে সংরক্ষিত হয়েছে!`);
  };

  // Request Delete Individual Staff Transaction (Custom Dialog)
  const handleRequestDeleteTx = (staffId: string, tx: StaffTransaction) => {
    sounds.playTap();
    setDeletingTx({
      staffId,
      txId: tx.id,
      note: tx.note || (tx.type === 'due' ? 'কোম্পানি পাওনা' : 'স্টাফ কালেকশন জমা'),
      amount: tx.amount
    });
    window.history.pushState({ staffModal: 'deleteTx' }, '');
  };

  // Confirm Delete Individual Staff Transaction
  const handleConfirmDeleteTx = () => {
    if (!deletingTx) return;
    sounds.playSuccess();
    const { staffId, txId } = deletingTx;

    let targetUpdatedStaff: StaffAccount | null = null;
    const updatedList = accounts.map(a => {
      if (a.id === staffId) {
        const txs = a.transactions || [];
        const updatedTxs = txs.filter(t => {
          const tid = String(t.id || '').trim();
          const targetId = String(txId || '').trim();
          if (tid && targetId && tid === targetId) return false;
          if (!tid && t.amount === deletingTx.amount && t.note === deletingTx.note) return false;
          return true;
        });
        const newTotalDue = updatedTxs.filter(t => t.type === 'due').reduce((sum, t) => sum + (t.amount || 0), 0);
        const newTotalCollected = updatedTxs.filter(t => t.type === 'collection').reduce((sum, t) => sum + (t.amount || 0), 0);
        const newRemaining = newTotalDue - newTotalCollected;

        const updatedStaff: StaffAccount = {
          ...a,
          totalDue: newTotalDue,
          totalCollected: newTotalCollected,
          remainingDue: newRemaining,
          transactions: updatedTxs
        };
        targetUpdatedStaff = updatedStaff;
        return updatedStaff;
      }
      return a;
    });

    const sanitizedList: StaffAccount[] = JSON.parse(JSON.stringify(updatedList));
    setAccounts(sanitizedList);
    if (targetUpdatedStaff && selectedStaff && selectedStaff.id === staffId) {
      setSelectedStaff(targetUpdatedStaff);
    }
    setDeletingTx(null);

    // Synchronize to Cloud & Server
    onSaveStaffAccounts(sanitizedList);
    if (onDeleteStaffTransaction) {
      onDeleteStaffTransaction(staffId, txId);
    }
    if (onLogAction) {
      onLogAction('Staff Transaction Deleted', 'স্টাফ লেনদেন এন্ট্রি বাতিল', `Staff: ${staffId}, Entry: ${txId}`);
    }
    showToast('লেনদেন রেকর্ড সফলভাবে মুছে ফেলা হয়েছে এবং ক্লাউডে সংরক্ষিত হয়েছে!');
  };

  // Print & PDF Export Handler
  const handlePrintPDF = (staffArg?: StaffAccount | null | any) => {
    try {
      sounds.playSuccess();
      const validStaff = (staffArg && typeof staffArg === 'object' && 'id' in staffArg && 'name' in staffArg && !('nativeEvent' in staffArg)) ? staffArg : null;
      setPrintingStaff(validStaff);
      setIsPrintingReport(true);
      window.history.pushState({ staffModal: 'print' }, '');
      setTimeout(() => {
        try {
          window.print();
        } catch {}
      }, 350);
    } catch (e) {
      console.error('Error initiating print report:', e);
      setIsPrintingReport(false);
      setPrintingStaff(null);
      showToast(isBn ? 'রিপোর্ট তৈরিতে সমস্যা হয়েছে' : 'Failed to generate report');
    }
  };

  // Direct File Download Handler
  const handleDownloadDirectFile = () => {
    sounds.playSuccess();
    const docTitle = printingStaff ? `${printingStaff.name}_স্টাফ_হিসাব_রিপোর্ট` : 'স্টাফ_কালেকশন_ও_কোম্পানি_পাওনা_রিপোর্ট';
    const filename = `${docTitle}_${new Date().toISOString().split('T')[0]}.html`;
    const currentMonth = new Intl.DateTimeFormat('bn-BD', { month: 'long' }).format(new Date());

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Hind Siliguri', sans-serif; background-color: #ffffff; color: #000; margin: 0; padding: 24px; }
    .report-wrapper { max-width: 820px; margin: 0 auto; }
    
    .ledger-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; font-weight: bold; font-size: 16px; }
    .staff-title { font-size: 18px; font-weight: 700; text-decoration: none; text-align: center; flex: 1; }
    .month-title { font-size: 15px; font-weight: 700; white-space: nowrap; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background-color: #cbd5e1; border: 1.5px solid #000; padding: 7px 4px; text-align: center; font-weight: 700; color: #000; }
    td { border: 1.5px solid #000; padding: 6px 6px; text-align: center; color: #000; height: 26px; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }

    .sig-section { display: flex; justify-content: space-between; margin-top: 60px; padding: 0 40px; }
    .sig-box { border-top: 1.5px solid #000; width: 160px; text-align: center; font-size: 13px; font-weight: bold; padding-top: 6px; }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-wrapper">
    ${printingStaff ? `
      <div class="ledger-top">
        <div style="width: 100px;"></div>
        <div class="staff-title">${printingStaff.name} হিসাব</div>
        <div class="month-title">মাস ঃ ${currentMonth}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 7%;">ক্রমিক</th>
            <th style="width: 13%;">তারিখ</th>
            <th style="width: 12%;">ইউজার</th>
            <th style="width: 26%;">নাম</th>
            <th style="width: 18%;">ঠিকানা</th>
            <th style="width: 10%;">টাকা</th>
            <th style="width: 8%;">রেফারেন্স</th>
            <th style="width: 6%;">স্টাটাস</th>
          </tr>
        </thead>
        <tbody>
          ${getSortedTransactions(printingStaff.transactions || []).map((tx, idx) => `
            <tr>
              <td>${toBengaliNumber(idx + 1)}</td>
              <td>${tx.date || '-'}</td>
              <td>${tx.userName || '-'}</td>
              <td class="text-left font-bold">${tx.customerName || tx.note || '-'}</td>
              <td class="text-left">${tx.customerAddress || '-'}</td>
              <td class="text-right font-bold">${toBengaliNumber(tx.amount)}</td>
              <td>${tx.reference || '-'}</td>
              <td class="font-bold">${tx.type === 'due' ? 'পাওনা' : 'জমা'}</td>
            </tr>
          `).join('')}
          ${Array.from({ length: Math.max(0, 16 - (printingStaff.transactions || []).length) }).map(() => `
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `).join('')}
          <tr class="font-bold">
            <td colspan="5" class="text-right" style="padding-right: 15px;">মোট</td>
            <td class="text-right font-bold">${toBengaliNumber(printingStaff.totalDue || 0)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    ` : `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px;">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h2>
        <p style="margin: 4px 0; font-size: 13px;">স্টাফ কালেকশন ও কোম্পানি পাওনা সার্বিক অডিট রিপোর্ট</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>ক্রমিক</th>
            <th>স্টাফের নাম ও পদবী</th>
            <th>ফোন নম্বর</th>
            <th>মোট পাওনা</th>
            <th>কালেকশন জমা</th>
            <th>অবশিষ্ট পাওনা</th>
          </tr>
        </thead>
        <tbody>
          ${accounts.map((st, idx) => `
            <tr>
              <td>${toBengaliNumber(idx + 1)}</td>
              <td class="text-left font-bold">${st.name} (${st.role})</td>
              <td>${st.phone}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.totalDue)}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.totalCollected)}</td>
              <td class="text-right font-bold">${toBengaliNumber(st.remainingDue)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `}

    <div class="sig-section">
      <div class="sig-box">হিসাবরক্ষক স্বাক্ষর</div>
      <div class="sig-box">অ্যাডমিন অনুমোদন</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 250);
    showToast('রিপোর্ট ফাইলটি সরাসরি আপনার ডিভাইসে সেভ হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-bottom duration-200">
      
      {/* Printable Report View Sheet (Invisible during normal view, rendered during window.print()) */}
      <div className={`print:block ${isPrintingReport ? 'block' : 'hidden'} fixed inset-0 z-[100] bg-white text-slate-900 p-4 sm:p-8 overflow-y-auto`}>
        <div id="printable-staff-report" className="max-w-3xl mx-auto space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Company Printable Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
                প্রত্যাশা ক্যাবল নেটওয়ার্ক
              </h1>
              <p className="text-xs font-bold text-slate-600 mt-1">
                {printingStaff ? `স্টাফ ব্যক্তিগত হিসাব খাতা অডিট রিপোর্ট - ${printingStaff.name}` : 'স্টাফ কালেকশন ও কোম্পানি পাওনা খাতা অডিট রিপোর্ট'}
              </p>
              <p className="text-[11px] text-slate-500">
                হেড অফিস: ইসলামপুর ও জামালপুর অঞ্চল | হেল্পলাইন: ০১৭৭৭-৮৭৭২০৭
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-md inline-block">
                অফিসিয়াল রিপোর্ট
              </span>
              <p className="text-[11px] font-bold text-slate-600 mt-2">
                তারিখ: {new Date().toLocaleDateString('bn-BD')}
              </p>
              <p className="text-[10px] text-slate-500">
                প্রিন্ট সময়: {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>

          {printingStaff ? (
            /* INDIVIDUAL STAFF PDF REPORT SHEET */
            <div className="space-y-6">
              {/* Individual Profile Header */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300">
                {printingStaff.avatarUrl && (
                  <img src={printingStaff.avatarUrl} alt={printingStaff.name} className="w-14 h-14 rounded-xl object-cover border border-slate-300" />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-black text-slate-900">{printingStaff.name}</h2>
                  <p className="text-xs text-slate-600 font-bold">{printingStaff.role} • ফোন: {printingStaff.phone}</p>
                  {printingStaff.notes && <p className="text-xs text-slate-500 mt-0.5">নোট: {printingStaff.notes}</p>}
                </div>
              </div>

              {/* Individual Summary Box */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 text-center">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">মোট কোম্পানি পাওনা</p>
                  <p className="text-lg font-black text-rose-700">{formatCurrency(printingStaff.totalDue, lang)}</p>
                </div>
                <div className="border-x border-slate-300">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">মোট কালেকশন জমা</p>
                  <p className="text-lg font-black text-emerald-700">{formatCurrency(printingStaff.totalCollected, lang)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">নীট অবশিষ্ট পাওনা</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(printingStaff.remainingDue, lang)}</p>
                </div>
              </div>

              {/* Individual Transaction Ledger Table (Matching User's Reference Format) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b-2 border-black pb-2 text-sm font-bold text-slate-900">
                  <span className="text-base font-black">{printingStaff.name} হিসাব</span>
                  <span>মাস : {new Intl.DateTimeFormat('bn-BD', { month: 'long' }).format(new Date())}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-xs text-slate-900">
                    <thead>
                      <tr className="bg-slate-200 text-slate-900 font-bold">
                        <th className="border border-black p-2 text-center w-12">ক্রমিক</th>
                        <th className="border border-black p-2 text-center w-24">তারিখ</th>
                        <th className="border border-black p-2 text-center w-20">ইউজার</th>
                        <th className="border border-black p-2 text-left">নাম</th>
                        <th className="border border-black p-2 text-left">ঠিকানা</th>
                        <th className="border border-black p-2 text-right w-20">টাকা</th>
                        <th className="border border-black p-2 text-center w-20">রেফারেন্স</th>
                        <th className="border border-black p-2 text-center w-16">স্টাটাস</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedTransactions(printingStaff.transactions || []).map((tx, idx) => (
                        <tr key={tx.id || idx} className="hover:bg-slate-50">
                          <td className="border border-black p-2 text-center font-bold">{toBengaliNumber(idx + 1)}</td>
                          <td className="border border-black p-2 text-center">{tx.date || '-'}</td>
                          <td className="border border-black p-2 text-center">{tx.userName || '-'}</td>
                          <td className="border border-black p-2 text-left font-medium">{tx.customerName || tx.note || '-'}</td>
                          <td className="border border-black p-2 text-left">{tx.customerAddress || '-'}</td>
                          <td className="border border-black p-2 text-right font-black">{toBengaliNumber(tx.amount)}</td>
                          <td className="border border-black p-2 text-center">{tx.reference || '-'}</td>
                          <td className="border border-black p-2 text-center font-bold text-rose-600">
                            {tx.type === 'due' ? 'পাওনা' : 'জমা'}
                          </td>
                        </tr>
                      ))}

                      {/* Empty rows to complete ledger page look like notebook */}
                      {Array.from({ length: Math.max(0, 10 - (printingStaff.transactions || []).length) }).map((_, emptyIdx) => (
                        <tr key={`empty-${emptyIdx}`}>
                          <td className="border border-black p-2 h-7 text-center"></td>
                          <td className="border border-black p-2 text-center"></td>
                          <td className="border border-black p-2 text-center"></td>
                          <td className="border border-black p-2 text-left"></td>
                          <td className="border border-black p-2 text-left"></td>
                          <td className="border border-black p-2 text-right"></td>
                          <td className="border border-black p-2 text-center"></td>
                          <td className="border border-black p-2 text-center"></td>
                        </tr>
                      ))}

                      <tr className="font-bold bg-slate-100 text-slate-900">
                        <td colSpan={5} className="border border-black p-2 text-right pr-4 font-black">মোট</td>
                        <td className="border border-black p-2 text-right font-black">{toBengaliNumber(printingStaff.totalDue || 0)}</td>
                        <td className="border border-black p-2 text-center"></td>
                        <td className="border border-black p-2 text-center"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ALL STAFF OVERALL REPORT SHEET */
            <div className="space-y-6">
              {/* Report Summary Cards */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300">
                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">মোট কোম্পানি পাওনা</p>
                  <p className="text-lg font-black text-rose-700">{formatCurrency(totalDues, lang)}</p>
                </div>
                <div className="text-center border-x border-slate-300">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">মোট সংগৃহীত / জমা</p>
                  <p className="text-lg font-black text-emerald-700">{formatCurrency(totalCollected, lang)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">নীট অবশিষ্ট পাওনা</p>
                  <p className="text-lg font-black text-indigo-900">{formatCurrency(netRemainingDue, lang)}</p>
                </div>
              </div>

              {/* Printable Staff Table */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-700 mb-2">
                  স্টাফ হিসাব বিবরণী টেবিল (মোট {accounts.length} জন)
                </h3>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-2 border border-slate-300">ক্রমিক</th>
                      <th className="p-2 border border-slate-300">স্টাফের নাম ও পদবী</th>
                      <th className="p-2 border border-slate-300">ফোন নম্বর</th>
                      <th className="p-2 border border-slate-300 text-right">মোট পাওনা</th>
                      <th className="p-2 border border-slate-300 text-right">কালেকশন জমা</th>
                      <th className="p-2 border border-slate-300 text-right">অবশিষ্ট পাওনা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((st, idx) => (
                      <tr key={st.id} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-300 font-bold">{toBengaliNumber(idx + 1)}</td>
                        <td className="p-2 border border-slate-300">
                          <p className="font-bold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-500">{st.role}</p>
                        </td>
                        <td className="p-2 border border-slate-300 font-medium">{st.phone}</td>
                        <td className="p-2 border border-slate-300 text-right font-bold text-rose-700">{formatCurrency(st.totalDue, lang)}</td>
                        <td className="p-2 border border-slate-300 text-right font-bold text-emerald-700">{formatCurrency(st.totalCollected, lang)}</td>
                        <td className="p-2 border border-slate-300 text-right font-bold text-slate-900">{formatCurrency(st.remainingDue, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signature & Approval Block */}
          <div className="pt-12 flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="text-center border-t border-slate-400 pt-2 w-40">
              হিসাবরক্ষক স্বাক্ষর
            </div>
            <div className="text-center border-t border-slate-400 pt-2 w-40">
              অ্যাডমিন অনুমোদন
            </div>
          </div>

            {/* Action buttons for preview screen */}
            <div className="print:hidden flex flex-col gap-3 pt-6 border-t border-slate-200 mt-6">
              
              {/* Primary Download & Print Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadDirectFile}
                  className="h-14 rounded-2xl bg-[#00A86B] hover:bg-[#008f5a] text-white font-black text-xs flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  <span>ডিভাইসে সরাসরি ফাইল সেভ</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="h-14 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  <span>প্রিন্ট / PDF সেভ করুন</span>
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => {
                  setIsPrintingReport(false);
                  setPrintingStaff(null);
                }}
                className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center transition-all active:scale-95 border border-slate-200"
              >
                <span>বন্ধ করুন (পিছনে যান)</span>
              </button>
            </div>

        </div>
      </div>

      {/* Main Top Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-[#E52E2E]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {isBn ? 'স্টাফ কালেকশন ও কোম্পানি পাওনা' : 'Staff Collection & Company Dues'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {isBn ? 'ব্যক্তিভিত্তিক ফিল্ড কালেকশন ও হিসাব খাতা' : 'Individual Staff Ledger'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ক্লাউড সিঙ্ক সক্রিয়</span>
          </div>

          {/* PDF Report Download Button */}
          <button
            onClick={() => handlePrintPDF()}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
            title={isBn ? 'পিডিএফ রিপোর্ট ডাউনলোড' : 'Download PDF Report'}
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">{isBn ? 'পিডিএফ রিপোর্ট' : 'PDF Report'}</span>
          </button>

          {/* Admin Add Staff Button */}
          {isAdmin && (
            <button
              onClick={() => {
                sounds.playTap();
                setEditingStaff(null);
                setStaffName('');
                setStaffPhone('');
                setStaffRole('লাইন টেকনিশিয়ান');
                setStaffAvatar('');
                setStaffNotes('');
                setInitialDue('');
                setIsAddStaffOpen(true);
                window.history.pushState({ staffModal: 'add' }, '');
              }}
              className="h-9 px-3 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isBn ? 'স্টাফ যোগ' : 'Add Staff'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        
        {/* Total Summary Cards Banner */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          
          {/* 1. Total Dues */}
          <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200 dark:border-rose-900/40">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              {isBn ? 'কোম্পানি পাওনা' : 'Total Dues'}
            </span>
            <h3 className="text-base sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
              {formatCurrency(totalDues, lang)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'মোট ফিল্ড পাওনা' : 'Total Outstanding'}
            </p>
          </div>

          {/* 2. Total Collected */}
          <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              {isBn ? 'স্টাফ কালেকশন' : 'Total Collected'}
            </span>
            <h3 className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {formatCurrency(totalCollected, lang)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'মোট জমা হয়েছে' : 'Total Received'}
            </p>
          </div>

          {/* 3. Net Balance */}
          <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200 dark:border-blue-900/40">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              {isBn ? 'অবশিষ্ট পাওনা' : 'Net Due'}
            </span>
            <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatCurrency(netRemainingDue, lang)}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isBn ? 'পাওনা বাকি রয়েছে' : 'Balance Due'}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'স্টাফের নাম, ফোন নম্বর বা পদবী দিয়ে খুঁজুন...' : 'Search staff by name, phone or role...'}
            className="w-full h-11 pl-10 pr-4 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Staff Individual Accounts Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#E52E2E]" />
              <span>{isBn ? `স্টাফ তালিকা (${filteredAccounts.length} জন)` : `Staff List (${filteredAccounts.length})`}</span>
            </h3>
            <span className="text-[10px] text-slate-400">
              {isBn ? 'কার্ডে ট্যাপ করে বিস্তারিত দেখুন' : 'Tap card for full ledger'}
            </span>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isBn ? 'কোনো স্টাফের হিসাব পাওয়া যায়নি' : 'No staff accounts found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAccounts.map((staff) => {
                const duePercent = staff.totalDue > 0 ? Math.min(100, Math.round((staff.totalCollected / staff.totalDue) * 100)) : 100;

                return (
                  <div
                    key={staff.id}
                    className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Top Row: Photo + Info + Actions */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        {/* Clickable Staff Profile Info */}
                        <div 
                          onClick={() => {
                            sounds.playTap();
                            setSelectedStaff(staff);
                            window.history.pushState({ staffModal: 'detail' }, '');
                          }}
                          className="flex items-center gap-3 cursor-pointer group flex-1"
                        >
                          {/* Staff Photo Avatar */}
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-[14px] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                              {staff.avatarUrl ? (
                                <img src={staff.avatarUrl} alt={staff.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-black text-rose-500">
                                  {staff.name.substring(0, 1)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                {staff.name}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {staff.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{staff.phone}</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions (PDF Report, Edit, Delete) */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintPDF(staff);
                            }}
                            className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center justify-center active:scale-95"
                            title={isBn ? 'পিডিএফ রিপোর্ট ডাউনলোড' : 'PDF Report'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleOpenEditStaff(staff)}
                                className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95"
                                title="তথ্য পরিবর্তন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRequestDeleteStaff(staff)}
                                className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Amounts Bar */}
                      <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                        <div>
                          <p className="text-[10px] font-medium text-slate-400">{isBn ? 'কোম্পানি পাওনা' : 'Due'}</p>
                          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums">{formatCurrency(staff.totalDue, lang)}</p>
                        </div>
                        <div className="border-x border-slate-200 dark:border-slate-700">
                          <p className="text-[10px] font-medium text-slate-400">{isBn ? 'কালেকশন জমা' : 'Collected'}</p>
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCurrency(staff.totalCollected, lang)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-slate-400">{isBn ? 'অবশিষ্ট পাওনা' : 'Remaining'}</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{formatCurrency(staff.remainingDue, lang)}</p>
                        </div>
                      </div>

                      {/* Collection Progress Bar */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>{isBn ? 'কালেকশন রিকভারি অগ্রগতি' : 'Collection Progress'}</span>
                          <span>{toBengaliNumber(duePercent)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                            style={{ width: `${duePercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEntry(staff, 'due')}
                            className="flex-1 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isBn ? 'পাওনা যোগ' : '+ Add Due'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenEntry(staff, 'collection')}
                            className="flex-1 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-xs"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{isBn ? 'কালেকশন জমা' : '+ Collection'}</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          sounds.playTap();
                          setSelectedStaff(staff);
                          window.history.pushState({ staffModal: 'detail' }, '');
                        }}
                        className={`${isAdmin ? 'px-3' : 'flex-1'} h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center active:scale-95`}
                      >
                        {isBn ? 'খাতা' : 'Ledger'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Modal 1: Individual Staff Ledger History View */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-base overflow-hidden">
                  {selectedStaff.avatarUrl ? (
                    <img src={selectedStaff.avatarUrl} alt={selectedStaff.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedStaff.name.substring(0, 1)
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedStaff.role} • {selectedStaff.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ক্লাউড সিঙ্ক</span>
                </div>
                <button
                  onClick={() => handlePrintPDF(selectedStaff)}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 border border-rose-200/60 dark:border-rose-900/40 active:scale-95 transition-all"
                  title={isBn ? 'এই স্টাফের পিডিএফ রিপোর্ট ডাউনলোড' : 'Download PDF Report'}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পিডিএফ' : 'PDF'}</span>
                </button>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Individual Totals Banner */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold">{isBn ? 'মোট পাওনা' : 'Total Due'}</p>
                <p className="text-xs font-black text-rose-600 dark:text-rose-400 tabular-nums">{formatCurrency(selectedStaff.totalDue, lang)}</p>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 font-bold">{isBn ? 'কালেকশন জমা' : 'Collected'}</p>
                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCurrency(selectedStaff.totalCollected, lang)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold">{isBn ? 'অবশিষ্ট পাওনা' : 'Remaining'}</p>
                <p className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{formatCurrency(selectedStaff.remainingDue, lang)}</p>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                <span>{isBn ? 'লেনদেন ইতিহাস খাতা' : 'Ledger Transactions'}</span>
                <span className="text-[10px] text-slate-400">{toBengaliNumber((selectedStaff.transactions || []).length)} টি এন্ট্রি</span>
              </h4>

              {(selectedStaff.transactions || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  {isBn ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি' : 'No transactions recorded yet'}
                </p>
              ) : (
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <th className="p-2 border border-slate-200 dark:border-slate-700">ক্রমিক</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">তারিখ</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">ইউজার</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">নাম</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">ঠিকানা</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">টাকা</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">রেফারেন্স</th>
                        <th className="p-2 border border-slate-200 dark:border-slate-700">স্টাটাস</th>
                        {isAdmin && (
                          <th className="p-2 border border-slate-200 dark:border-slate-700 text-center">অ্যাকশন</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedTransactions(selectedStaff.transactions).map((tx, idx) => (
                        <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold">{toBengaliNumber(idx + 1)}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 whitespace-nowrap">{tx.date}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-medium">{tx.userName || '-'}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-medium">{tx.customerName || tx.note || '-'}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">{tx.customerAddress || '-'}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap">
                            {formatCurrency(tx.amount, lang)}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700">{tx.reference || '-'}</td>
                          <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold whitespace-nowrap">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              tx.type === 'due' 
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' 
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            }`}>
                              {tx.type === 'due' ? 'পাওনা' : 'জমা'}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="p-2 border border-slate-200 dark:border-slate-700 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditTx(selectedStaff, tx);
                                  }}
                                  className="h-7 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold text-[11px] transition-all active:scale-95 shadow-2xs"
                                  title="লেনদেন এডিট করুন"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>এডিট</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestDeleteTx(selectedStaff.id, tx);
                                  }}
                                  className="h-7 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold text-[11px] transition-all active:scale-95 shadow-2xs"
                                  title="লেনদেন ডিলিট করুন"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>ডিলিট</span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions (Admin Only) */}
            {isAdmin && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleOpenEntry(selectedStaff, 'due')}
                  className="flex-1 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold active:scale-95 transition-all"
                >
                  + পাওনা যোগ
                </button>
                <button
                  onClick={() => handleOpenEntry(selectedStaff, 'collection')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold active:scale-95 transition-all"
                >
                  + কালেকশন জমা
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modal 2: Add Due / Record Collection Entry */}
      {entryStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
          <form onSubmit={handleSaveEntry} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingTx ? 'লেনদেন এডিট ও সংশোধন করুন' : (entryType === 'due' ? 'কোম্পানি পাওনা যোগ করুন' : 'স্টাফ কালেকশন জমা নিন')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  স্টাফ: <span className="font-bold text-slate-800 dark:text-slate-200">{entryStaff.name}</span> ({entryStaff.role})
                  {editingTx && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                      এডিট মোড
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEntry}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type Selector Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setEntryType('due')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  entryType === 'due' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                কোম্পানি পাওনা (Due)
              </button>
              <button
                type="button"
                onClick={() => setEntryType('collection')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  entryType === 'collection' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                কালেকশন জমা (Collect)
              </button>
            </div>

            {/* User ID and Name row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইউজার (User ID)
                </label>
                <input
                  type="text"
                  value={entryUserName}
                  onChange={(e) => setEntryUserName(e.target.value)}
                  placeholder="যেমন: pcn42"
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নাম (গ্রাহক / কাস্টমার)
                </label>
                <input
                  type="text"
                  value={entryCustomerName}
                  onChange={(e) => setEntryCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ কাজল আলী"
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Address and Reference row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  value={entryAddress}
                  onChange={(e) => setEntryAddress(e.target.value)}
                  placeholder="যেমন: চর শিমুল চূড়া"
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রেফারেন্স
                </label>
                <input
                  type="text"
                  value={entryReference}
                  onChange={(e) => setEntryReference(e.target.value)}
                  placeholder="যেমন: গতমাসের বিল বকেয়া"
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Amount and Date row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  টাকার পরিমাণ (৳) *
                </label>
                <input
                  type="text"
                  required
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  placeholder="যেমন: ৬০০"
                  className="w-full h-10 px-3 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  তারিখ *
                </label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Note / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                বিবরণ / নোট
              </label>
              <input
                type="text"
                value={entryNote}
                onChange={(e) => setEntryNote(e.target.value)}
                placeholder="অতিরিক্ত মন্তব্য বা বিবরণ..."
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className={`w-full h-11 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                entryType === 'due' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {editingTx 
                  ? 'পরিবর্তন সংরক্ষণ করুন' 
                  : (entryType === 'due' ? 'পাওনা রেকর্ড সংরক্ষণ করুন' : 'কালেকশন জমা সংরক্ষণ করুন')}
              </span>
            </button>

          </form>
        </div>
      )}

      {/* Modal 3: Add / Edit Staff Account Form (Admin Only) */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
          <form onSubmit={handleSaveStaffForm} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingStaff ? 'স্টাফের তথ্য পরিবর্তন করুন' : 'নতুন স্টাফ অ্যাকাউন্ট যোগ করুন'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddStaffOpen(false);
                  setEditingStaff(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                স্টাফের পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="যেমন: কাজী রাজু আহমেদ"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর *
              </label>
              <input
                type="text"
                required
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                placeholder="যেমন: 01777877207"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পদবী / দায়িত্ব *
              </label>
              <input
                type="text"
                required
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                placeholder="যেমন: কালেকশন অফিসার, লাইন টেকনিশিয়ান"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ঠিকানা
              </label>
              <input
                type="text"
                value={staffAddress}
                onChange={(e) => setStaffAddress(e.target.value)}
                placeholder="যেমন: চর শিমুল চূড়া"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                রেফারেন্স
              </label>
              <input
                type="text"
                value={staffReference}
                onChange={(e) => setStaffReference(e.target.value)}
                placeholder="যেমন: রসিদ নং / ফিল্ড রেফারেন্স"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Avatar Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                স্টাফের ছবি (ডিভাইস থেকে আপলোড)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {staffAvatar ? (
                    <img src={staffAvatar} alt="Staff Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <label className="flex-1 h-10 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-slate-700">
                  <Upload className="w-4 h-4 text-[#E52E2E]" />
                  <span>{staffAvatar ? 'ছবি পরিবর্তন' : 'ছবি সিলেক্ট করুন'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Initial Due Amount (Only for New Staff) */}
            {!editingStaff && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রারম্ভিক কোম্পানি পাওনা (ঐচ্ছিক ৳)
                </label>
                <input
                  type="text"
                  value={initialDue}
                  onChange={(e) => setInitialDue(e.target.value)}
                  placeholder="যেমন: ১০০০"
                  className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                নোট / এলাকা বিস্তারিত
              </label>
              <input
                type="text"
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="যেমন: জোন-২ ক্যাবল নেটওয়ার্ক এলাকা"
                className="w-full h-10 px-3 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingStaff ? 'তথ্য আপডেট করুন' : 'স্টাফ সংরক্ষণ করুন'}</span>
            </button>

          </form>
        </div>
      )}

      {/* Floating Toast Notification Popup Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Modal 4: Custom Delete Staff Confirmation Popup (No native alert/confirm) */}
      {deletingStaff && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                স্টাফ অ্যাকাউন্ট মুছে ফেলার সম্মতি
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                আপনি কি <span className="font-bold text-rose-600 dark:text-rose-400">"{deletingStaff.name}"</span> ({deletingStaff.role}) স্টাফের সকল হিসাব ও লেনদেন খাতা স্থায়ীভাবে মুছে ফেলতে চান?
              </p>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300 font-bold text-left flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>সতর্কতা: এটি স্থায়ীভাবে মুছে যাবে এবং সার্ভার থেকে কোনো ডেটা রিকভার করা সম্ভব নয়।</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="flex-1 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all active:scale-95"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStaff}
                className="flex-1 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 5: Custom Delete Transaction Confirmation Popup */}
      {deletingTx && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                লেনদেন রসিদ মুছে ফেলা
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                আপনি কি <span className="font-bold text-slate-900 dark:text-white">"{deletingTx.note}"</span> (৳{deletingTx.amount}) এন্ট্রিটি মুছে ফেলতে চান?
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTx}
                className="flex-1 h-10 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছে ফেলুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
