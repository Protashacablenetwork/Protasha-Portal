import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Users, 
  Phone, 
  MapPin, 
  DollarSign, 
  Trash2, 
  X, 
  Filter, 
  Check, 
  Send,
  FileSpreadsheet
} from 'lucide-react';
import { safeStorage } from '../../utils/safeStorage';
import { sounds } from '../../utils/audio';

export interface CustomerBill {
  id: string;
  customerName: string;
  phone: string;
  zone: string;
  billType: string;
  amount: number;
  month: string;
  dueDate: string;
  status: 'paid' | 'unpaid';
  createdAt: string;
  paidAt?: string;
}

interface BillManagerPortalProps {
  onExit: () => void;
}

const INITIAL_BILLS: CustomerBill[] = [
  {
    id: 'bill-101',
    customerName: 'কামাল হোসেন',
    phone: '01711223344',
    zone: 'উত্তরা জোন (ব্লক-এ)',
    billType: 'মাসিক ইন্টারনেট বিল',
    amount: 1000,
    month: 'নভেম্বর ২০২৬',
    dueDate: '২০২৬-১১-১০',
    status: 'paid',
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString()
  },
  {
    id: 'bill-102',
    customerName: 'মাসুদ রানা',
    phone: '01819876543',
    zone: 'মিরপুর ১০ জোন',
    billType: 'মাসিক ইন্টারনেট বিল',
    amount: 1200,
    month: 'নভেম্বর ২০২৬',
    dueDate: '২০২৬-১১-১৫',
    status: 'unpaid',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bill-103',
    customerName: 'শাহীন আলম',
    phone: '01912345678',
    zone: 'ধানমন্ডি জোন',
    billType: 'ডিশ ও ক্যাবল টিভি বিল',
    amount: 350,
    month: 'নভেম্বর ২০২৬',
    dueDate: '২০২৬-১১-০5',
    status: 'unpaid',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bill-104',
    customerName: 'সাদিয়া সুলতানা',
    phone: '01611002233',
    zone: 'গুলশান জোন',
    billType: 'কর্পোরেট ফাইবার বিল',
    amount: 3500,
    month: 'নভেম্বর ২০২৬',
    dueDate: '২০২৬-১১-১২',
    status: 'paid',
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString()
  }
];

export const BillManagerPortal: React.FC<BillManagerPortalProps> = ({ onExit }) => {
  const [bills, setBills] = useState<CustomerBill[]>(() => {
    const stored = safeStorage.getItem('protyasha_bill_manager_bills');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse bill manager data:', e);
      }
    }
    return INITIAL_BILLS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Bill Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('উত্তরা জোন');
  const [billType, setBillType] = useState('মাসিক ইন্টারনেট বিল');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('নভেম্বর ২০২৬');

  useEffect(() => {
    safeStorage.setItem('protyasha_bill_manager_bills', JSON.stringify(bills));
  }, [bills]);

  // Derived Stats
  const totalBills = bills.length;
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + b.amount, 0);
  const paidCount = bills.filter(b => b.status === 'paid').length;
  const unpaidCount = bills.filter(b => b.status === 'unpaid').length;

  const zonesList = Array.from(new Set(bills.map(b => b.zone)));

  const filteredBills = bills.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.billType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesZone = selectedZone === 'all' || b.zone === selectedZone;

    return matchesSearch && matchesStatus && matchesZone;
  });

  const handleToggleStatus = (id: string) => {
    sounds.playSuccess();
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'paid' ? 'unpaid' : 'paid';
        return {
          ...b,
          status: nextStatus,
          paidAt: nextStatus === 'paid' ? new Date().toISOString() : undefined
        };
      }
      return b;
    }));
  };

  const handleDeleteBill = (id: string) => {
    if (window.confirm('আপনি কি এই গ্রাহকের বিল মুছে ফেলতে চান?')) {
      sounds.playTap();
      setBills(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) {
      alert('অনুগ্রহ করে গ্রাহকের নাম ও বিলের পরিমাণ প্রদান করুন');
      return;
    }

    const newBill: CustomerBill = {
      id: `bill-${Date.now()}`,
      customerName,
      phone: phone || '০১৭০০-০০০০০০',
      zone,
      billType,
      amount: parseFloat(amount) || 0,
      month,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      createdAt: new Date().toISOString()
    };

    sounds.playSuccess();
    setBills([newBill, ...bills]);
    setIsAddModalOpen(false);

    // Reset Form
    setCustomerName('');
    setPhone('');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-orange-500/30 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onExit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold transition-all border border-slate-700 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>মূল অ্যাপে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>বিল ম্যানেজমেন্ট প্রো</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">স্মার্ট কালেকশন ও ডিশ/ইন্টারনেট বিলিং</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন বিল যোগ</span>
        </button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-5">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">মোট বিল আদায়</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-emerald-400">৳{totalPaid.toLocaleString('bn-BD')}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{paidCount} টি বিল আদায় হয়েছে</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">মোট বকেয়া বিল</span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-rose-400">৳{totalUnpaid.toLocaleString('bn-BD')}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{unpaidCount} টি বিল বকেয়া</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">মোট গ্রাহক</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-blue-400">{totalBills} জন</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">নিবন্ধিত বিল ডাটাবেজ</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">আদায় পারসেন্ট</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-lg sm:text-xl font-black text-amber-400">
                {totalBills > 0 ? Math.round((paidCount / totalBills) * 100) : 0}%
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">আদায় দক্ষতা</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 space-y-3 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="গ্রাহকের নাম, মোবাইল নম্বর বা জোন খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-700/80 w-full sm:w-auto justify-center">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'all' 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                সব বিল ({bills.length})
              </button>
              <button
                onClick={() => setStatusFilter('unpaid')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'unpaid' 
                    ? 'bg-rose-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বকেয়া ({unpaidCount})
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === 'paid' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                পরিশোধিত ({paidCount})
              </button>
            </div>
          </div>

          {/* Zone Filter */}
          {zonesList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-orange-400" /> জোন:
              </span>
              <button
                onClick={() => setSelectedZone('all')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${
                  selectedZone === 'all' 
                    ? 'bg-slate-700 border-orange-500 text-white' 
                    : 'bg-slate-900/60 border-slate-700/80 text-slate-400'
                }`}
              >
                সকল জোন
              </button>
              {zonesList.map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${
                    selectedZone === z 
                      ? 'bg-slate-700 border-orange-500 text-white' 
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-400'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer Bills List */}
        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 text-center space-y-3">
              <Zap className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-bold">কোনো মিল থাকা বিল পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredBills.map((b) => (
              <div
                key={b.id}
                className={`bg-slate-800/90 border rounded-3xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md ${
                  b.status === 'paid' 
                    ? 'border-emerald-500/30 bg-slate-800/70' 
                    : 'border-rose-500/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-white">{b.customerName}</h4>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      b.status === 'paid' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {b.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া বিল'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                      {b.billType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-orange-400" />
                      {b.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {b.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      মাস: {b.month}
                    </span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/80">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">বিলের পরিমাণ</span>
                    <h3 className="text-xl font-black text-orange-400">৳{b.amount.toLocaleString('bn-BD')}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(b.id)}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-2xl text-xs font-black transition-all shadow-xs active:scale-95 ${
                        b.status === 'paid' 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                      }`}
                    >
                      {b.status === 'paid' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                          <span>আদায় সম্পন্ন</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 stroke-[3]" />
                          <span>টাকা আদায় করুন</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteBill(b.id)}
                      className="p-2 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 active:scale-95 transition-all"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add New Bill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span>নতুন বিল/গ্রাহক অন্তর্ভুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    placeholder="০১৭০০-০০০০০০"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">জোন / এলাকা</label>
                  <input
                    type="text"
                    placeholder="যেমন: উত্তরা জোন"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">বিলের ক্যাটাগরি</label>
                  <select
                    value={billType}
                    onChange={(e) => setBillType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="মাসিক ইন্টারনেট বিল">মাসিক ইন্টারনেট বিল</option>
                    <option value="ডিশ ও ক্যাবল টিভি বিল">ডিশ ও ক্যাবল টিভি বিল</option>
                    <option value="কর্পোরেট ফাইবার বিল">কর্পোরেট ফাইবার বিল</option>
                    <option value="সার্ভিস চার্জ">সার্ভিস চার্জ</option>
                    <option value="অন্যান্য বিল">অন্যান্য বিল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">বিলের পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="যেমন: ১০০০"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">বিলের মাস</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
