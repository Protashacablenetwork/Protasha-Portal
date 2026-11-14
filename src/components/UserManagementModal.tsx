import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Lock, 
  Smartphone, 
  User, 
  Camera, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { db, safeSetDoc, safeDeleteDoc, handleFirestoreError, OperationType } from '../utils/firebase';
import { collection, getDocs, onSnapshot, doc, query, where } from 'firebase/firestore';
import { Language, AppUser, UserRole } from '../types';
import { sounds } from '../utils/audio';
import { safeStorage } from '../utils/safeStorage';
import { compressImage } from '../utils/imageCompressor';
import { savePersistentImage, getPersistentImage } from '../utils/imageStorage';
import { getStoredUsers, saveStoredUser, deleteStoredUser, findStoredUserByPhone } from '../utils/userStorage';

interface UserManagementModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onUserUpdated?: (user: AppUser) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  lang,
  onClose,
  onUserUpdated
}) => {
  const isBn = lang === 'bn';

  const [users, setUsers] = useState<AppUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'sub-admin' | 'user' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing User State
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPin, setEditPin] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [showEditPin, setShowEditPin] = useState(false);

  // New User State
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch users from server and merge with persistent image storage
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const stored = getStoredUsers();
      let fetchedUsers: AppUser[] = [...stored];

      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        if (!querySnapshot.empty) {
          const cloudUsers: AppUser[] = [];
          querySnapshot.forEach((docSnap) => {
            const u = docSnap.data() as AppUser;
            if (u && u.id && u.name) cloudUsers.push(u);
          });
          if (cloudUsers.length > 0) {
            const mergedMap = new Map<string, AppUser>();
            stored.forEach(u => mergedMap.set(u.id, u));
            cloudUsers.forEach(u => mergedMap.set(u.id, u));
            fetchedUsers = Array.from(mergedMap.values());
          }
        }
      } catch (e) {
        console.warn('Cloud user fetch skipped, using local store:', e);
      }

      // Check for cached avatars
      const enhanced = await Promise.all(
        fetchedUsers.map(async (u: AppUser) => {
          if (!u.avatarUrl || u.avatarUrl.startsWith('/uploads/')) {
            const cached = await getPersistentImage(`avatar_user_${u.id}`);
            if (cached) return { ...u, avatarUrl: cached };
            if (u.role === 'admin' || u.id === 'admin-primary') {
              const adminCached = await getPersistentImage('avatar_admin');
              if (adminCached) return { ...u, avatarUrl: adminCached };
            }
          }
          return u;
        })
      );
      setUsers(enhanced);
    } catch (e) {
      console.error(e);
      setErrorMsg(isBn ? 'ইউজার তালিকা লোড করা যায়নি' : 'Failed to load user list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadUsers();
    setErrorMsg('');
    setSuccessMsg('');

    let unsub: (() => void) | null = null;
    try {
      unsub = onSnapshot(collection(db, 'users'), (snap) => {
        const cloudUsers: AppUser[] = [];
        snap.forEach((docSnap) => {
          const u = docSnap.data() as AppUser;
          if (u && (u.id || docSnap.id) && u.name) {
            cloudUsers.push({ ...u, id: u.id || docSnap.id });
          }
        });
        if (cloudUsers.length > 0) {
          cloudUsers.forEach(u => saveStoredUser(u));
          setUsers(cloudUsers);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'users');
      });
    } catch {}

    return () => {
      if (unsub) unsub();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Open Edit Form
  const handleStartEdit = async (user: AppUser) => {
    sounds.playTap();
    setEditingUser(user);
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditPin(user.pin);
    
    // Check cached avatar if user.avatarUrl is missing or /uploads/
    let initialAvatar = user.avatarUrl && !user.avatarUrl.startsWith('/uploads/') ? user.avatarUrl : '';
    setEditAvatar(initialAvatar);
    if (!initialAvatar) {
      const cached = await getPersistentImage(`avatar_user_${user.id}`);
      if (cached) setEditAvatar(cached);
    }

    setEditStatus(user.status);
    setEditRole(user.role);
    setIsAddingNew(false);
    setErrorMsg('');
  };

  // Open Add Form
  const handleStartAdd = () => {
    sounds.playTap();
    setIsAddingNew(true);
    setEditingUser(null);
    setEditName('');
    setEditPhone('');
    setEditPin('1234');
    setEditAvatar('');
    setEditStatus('active');
    setEditRole('user');
    setErrorMsg('');
  };

  // Save Edit to Server
  const handleSaveEdit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim()) {
      setErrorMsg(isBn ? 'ব্যবহারকারীর নাম আবশ্যক' : 'Name is required');
      sounds.playTap();
      return;
    }
    if (!editPhone.trim()) {
      setErrorMsg(isBn ? 'মোবাইল নাম্বার আবশ্যক' : 'Mobile number is required');
      sounds.playTap();
      return;
    }
    if (!editPin.trim()) {
      setErrorMsg(isBn ? 'লগইন পিন আবশ্যক' : 'PIN is required');
      sounds.playTap();
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    sounds.playTap();

    try {
      const updatedUser: AppUser = {
        ...editingUser,
        name: editName.trim(),
        phone: editPhone.trim(),
        pin: editPin.trim(),
        avatarUrl: editAvatar,
        status: editStatus,
        role: editRole,
        updatedAt: new Date().toISOString()
      };

      saveStoredUser(updatedUser);
      await safeSetDoc(doc(db, 'users', editingUser.id), updatedUser, { merge: true });

      sounds.playSuccess();
      setSuccessMsg(isBn ? 'ব্যবহারকারীর তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'User updated successfully!');
      
      // Update local users array immediately
      setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));

      // Sync local storage if active session matches
      const saved = safeStorage.getItem('protyasha_user');
      if (saved) {
        try {
          const cur = JSON.parse(saved);
          if (cur.id === editingUser.id || cur.phone === editingUser.phone || cur.phone === editPhone.trim()) {
            const updatedSession = {
              ...cur,
              name: editName.trim(),
              phone: editPhone.trim(),
              avatarUrl: editAvatar || cur.avatarUrl,
              role: editRole
            };
            safeStorage.setItem('protyasha_user', JSON.stringify(updatedSession));
            safeStorage.setItem('protyasha_admin_name', editName.trim());
            safeStorage.setItem('protyasha_admin_phone', editPhone.trim());
            if (editAvatar) {
              safeStorage.setItem('protyasha_admin_avatar', editAvatar);
            }
          }
        } catch {}
      }

      // Save avatar permanently in IndexedDB
      if (editAvatar && editAvatar.startsWith('data:image/')) {
        savePersistentImage(`avatar_user_${editingUser.id}`, editAvatar);
        if (editingUser.id === 'admin-primary' || editRole === 'admin') {
          savePersistentImage('avatar_admin', editAvatar);
        }
      }

      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      setTimeout(() => {
        setEditingUser(null);
        setSuccessMsg('');
      }, 900);
    } catch (err) {
      console.error('Update user error:', err);
      setErrorMsg(isBn ? 'আপডেট ব্যর্থ হয়েছে' : 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Create User on Server
  const handleSaveNew = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!editName.trim()) {
      setErrorMsg(isBn ? 'ব্যবহারকারীর নাম আবশ্যক' : 'Name is required');
      sounds.playTap();
      return;
    }
    if (!editPhone.trim()) {
      setErrorMsg(isBn ? 'মোবাইল নাম্বার আবশ্যক' : 'Mobile number is required');
      sounds.playTap();
      return;
    }
    if (!editPin.trim()) {
      setErrorMsg(isBn ? 'লগইন পিন আবশ্যক' : 'PIN is required');
      sounds.playTap();
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    sounds.playTap();

    try {
      const cleanPhone = editPhone.trim();
      
      // Check duplicate locally first
      const existingLocal = findStoredUserByPhone(cleanPhone);
      if (existingLocal) {
        setErrorMsg(isBn ? 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' : 'Phone already exists');
        setIsSaving(false);
        return;
      }

      // Check duplicate in Firestore
      try {
        const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          setErrorMsg(isBn ? 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' : 'Phone already exists');
          setIsSaving(false);
          return;
        }
      } catch (e) {
        console.warn('Firestore phone duplicate check skipped:', e);
      }

      const newId = 'usr_' + Date.now();
      const newUser: AppUser = {
        id: newId,
        name: editName.trim(),
        phone: cleanPhone,
        avatarUrl: editAvatar || '',
        pin: editPin.trim(),
        role: editRole,
        createdAt: new Date().toISOString(),
        status: editStatus
      };

      // 1. Save locally
      saveStoredUser(newUser);

      // 2. Save in Firestore
      await safeSetDoc(doc(db, 'users', newId), newUser);

      sounds.playSuccess();
      setSuccessMsg(isBn ? 'নতুন ব্যবহারকারী সফলভাবে তৈরি হয়েছে!' : 'User created successfully!');
      setUsers(prev => [newUser, ...prev]);

      setTimeout(() => {
        setIsAddingNew(false);
        setSuccessMsg('');
      }, 900);
    } catch (err) {
      console.error('Create user error:', err);
      setErrorMsg(isBn ? 'তৈরি করা যায়নি' : 'Creation failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete User from Server
  const handleDeleteUser = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      isBn 
        ? `আপনি কি নিশ্চিত যে "${name}" ব্যবহারকারীকে স্থায়ীভাবে মুছে ফেলতে চান?` 
        : `Are you sure you want to delete user "${name}"?`
    );
    if (!confirmDelete) return;

    sounds.playTap();
    try {
      deleteStoredUser(id);
      await safeDeleteDoc(doc(db, 'users', id));
      sounds.playSuccess();
      setSuccessMsg(isBn ? 'ব্যবহারকারী মুছে ফেলা হয়েছে!' : 'User deleted successfully!');
      setUsers(prev => prev.filter(u => u.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete user error:', err);
      setErrorMsg(isBn ? 'ডিলিট করা যায়নি' : 'Delete failed');
    }
  };

  // Avatar Upload Handler with Automatic Compression & Server Disk Storage
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      sounds.playTap();
      // Compress to crisp 400x400 JPEG (~40KB)
      const compressedDataUrl = await compressImage(file, 400, 400, 0.85);
      // Keep the self-contained dataUrl permanently
      setEditAvatar(compressedDataUrl);
      sounds.playSuccess();
    } catch (err) {
      console.error('Error compressing user avatar:', err);
      setErrorMsg(isBn ? 'ছবি প্রসেস করা সম্ভব হয়নি' : 'Failed to process image');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 flex items-center justify-center text-[#E52E2E]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {isBn ? 'ব্যবহারকারী ও একাউন্ট নিয়ন্ত্রণ' : 'User Account Control'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? `মোট নিবন্ধিত ব্যবহারকারী: ${users.length} জন` : `Total Registered: ${users.length} users`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingUser && !isAddingNew && (
              <button
                onClick={handleStartAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isBn ? 'নতুন যোগ' : '+ Add'}</span>
              </button>
            )}
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="px-5 py-2 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 border-b border-rose-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border-b border-emerald-100">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {editingUser || isAddingNew ? (
            /* ================= EDIT / ADD FORM ================= */
            <form onSubmit={editingUser ? handleSaveEdit : handleSaveNew} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {editingUser ? (isBn ? 'ব্যবহারকারীর তথ্য পরিবর্তন করুন' : 'Edit User Profile') : (isBn ? 'নতুন ব্যবহারকারী যোগ করুন' : 'Add New User')}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setIsAddingNew(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  {isBn ? 'তালিকায় ফিরুন' : 'Back to list'}
                </button>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="relative w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-rose-400 shrink-0 shadow-xs">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                  ) : editAvatar ? (
                    <img src={editAvatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-slate-400" />
                  )}
                  <label className="absolute inset-0 bg-black/30 hover:bg-black/40 flex items-center justify-center cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-white drop-shadow-xs" />
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {isBn ? 'ব্যবহারকারীর ছবি' : 'User Photo'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isUploadingAvatar 
                      ? (isBn ? 'ছবি কমপ্রেস ও আপলোড হচ্ছে...' : 'Uploading photo...')
                      : (isBn ? 'ছবি পরিবর্তন করতে উপরে ট্যাপ করুন' : 'Tap photo to upload image')}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'নাম' : 'Name'} *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'মোবাইল নাম্বার' : 'Mobile Number'} *
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1password-type="off"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
                />
              </div>

              {/* PIN with reveal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'লগইন পিন (PIN)' : 'Login PIN'} *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1password-type="off"
                    style={{ WebkitTextSecurity: showEditPin ? 'none' : 'disc' } as any}
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    required
                    className="w-full h-11 pl-3.5 pr-10 text-xs font-bold tracking-widest bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:border-[#E52E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPin(!showEditPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    {showEditPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Status & Role Selectors */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'স্ট্যাটাস' : 'Status'}
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-11 px-3 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <option value="active">{isBn ? 'সক্রিয় (Active)' : 'Active'}</option>
                    <option value="suspended">{isBn ? 'স্থগিত (Suspended)' : 'Suspended'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'রোল' : 'Role'}
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full h-11 px-3 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <option value="user">{isBn ? 'সাধারণ ইউজার' : 'Regular User'}</option>
                    <option value="sub-admin">{isBn ? 'সাব-অ্যাডমিন' : 'Sub-Admin'}</option>
                    <option value="admin">{isBn ? 'অ্যাডমিন' : 'Admin'}</option>
                  </select>
                </div>
              </div>

              {editRole === 'sub-admin' && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-bold">
                    {isBn ? 'সাব-অ্যাডমিন নিয়ন্ত্রণ ক্ষমতা:' : 'Sub-Admin Permissions:'}
                  </p>
                  <p>
                    {isBn
                      ? '• নিজের লেনদেন যোগ, ৩০ মিনিট পর্যন্ত এডিট ও ডিলিট করতে পারবেন। • লেনদেন তালিকায় শুধু নিজের এন্ট্রি দেখবেন এবং ড্যাশবোর্ডে পুরো হিসাব দেখাবে। • PDF রিপোর্টে নিজের বা পুরো হিসাব সিলেক্ট করে ডাউনলোড করতে পারবেন।'
                      : '• Can add transactions, edit/delete own entries up to 30 mins. • Sees own entries in transaction list while full balance remains on dashboard. • Can select Own or Full PDF report.'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setEditingUser(null);
                    setIsAddingNew(false);
                  }}
                  className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold active:scale-95 transition-all"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  onClick={editingUser ? (e) => handleSaveEdit(e) : (e) => handleSaveNew(e)}
                  className="flex-1 h-11 rounded-xl bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= USERS LIST ================= */
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBn ? 'নাম বা মোবাইল নাম্বার দিয়ে খুঁজুন...' : 'Search by name or mobile...'}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#E52E2E]"
                />
              </div>

              {/* Role Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {[
                  { id: 'all', bn: 'সব', en: 'All' },
                  { id: 'sub-admin', bn: 'সাব-অ্যাডমিন', en: 'Sub-Admin' },
                  { id: 'user', bn: 'ইউজার', en: 'User' },
                  { id: 'admin', bn: 'অ্যাডমিন', en: 'Admin' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setRoleFilter(tab.id as any);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      roleFilter === tab.id
                        ? 'bg-[#E52E2E] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isBn ? tab.bn : tab.en}
                  </button>
                ))}
              </div>

              {/* Users Cards */}
              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {isBn ? 'লোড হচ্ছে...' : 'Loading users...'}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {isBn ? 'কোনো ব্যবহারকারী পাওয়া যায়নি' : 'No users found'}
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isSuspended = u.status === 'suspended';

                  return (
                    <div
                      key={u.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                    >
                      {/* Left: Avatar & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                              {u.name.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {u.name}
                            </h4>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                              isAdmin 
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' 
                                : u.role === 'sub-admin'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}>
                              {isAdmin ? (isBn ? 'অ্যাডমিন' : 'Admin') : (u.role === 'sub-admin' ? (isBn ? 'সাব-অ্যাডমিন' : 'Sub-Admin') : (isBn ? 'ইউজার' : 'User'))}
                            </span>
                            {isSuspended && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-700">
                                {isBn ? 'স্থগিত' : 'Suspended'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1 font-mono">
                              <Smartphone className="w-3 h-3 text-slate-400" />
                              {u.phone}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-slate-600 dark:text-slate-300 font-bold">
                              <Lock className="w-3 h-3 text-slate-400" />
                              {u.pin}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Edit & Delete) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                          title={isBn ? 'এডিট করুন' : 'Edit User'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        {u.id !== 'admin-primary' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                            title={isBn ? 'ডিলিট করুন' : 'Delete User'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-right">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
