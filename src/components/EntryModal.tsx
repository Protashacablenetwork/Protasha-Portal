import React, { useState, useEffect } from 'react';
import { X, Check, Landmark } from 'lucide-react';
import { 
  Language, 
  PaymentMethod, 
  Transaction, 
  TransactionType 
} from '../types';
import { 
  toBengaliNumber, 
  toEnglishNumber, 
  translations 
} from '../utils/formatters';
import { sounds } from '../utils/audio';

interface EntryModalProps {
  isOpen: boolean;
  type: TransactionType;
  initialMethod?: string;
  editingTransaction?: Transaction | null;
  existingCustomers: string[];
  channels?: { name: string; icon?: string }[];
  lang: Language;
  onClose: () => void;
  onSave: (entry: Omit<Transaction, 'id' | 'trxId' | 'created'> & { id?: string }) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  type: initialType,
  initialMethod,
  editingTransaction,
  existingCustomers,
  channels = [
    { name: 'নগদ' },
    { name: 'বিকাশ' },
    { name: 'রকেট' },
    { name: 'ব্যাংক' },
    { name: 'ক্যাশ' }
  ],
  lang,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [type, setType] = useState<TransactionType>(initialType);
  const [method, setMethod] = useState<PaymentMethod>(editingTransaction?.method || initialMethod || 'নগদ');
  const [bankName, setBankName] = useState('ব্র্যাক ব্যাংক');
  const [amountStr, setAmountStr] = useState('');
  const [person, setPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [category, setCategory] = useState(initialType === 'income' ? 'বিল কালেকশন' : 'অফিস খরচ');

  const popularBanks = [
    'ব্র্যাক ব্যাংক (BRAC Bank)',
    'ইসলামী ব্যাংক বাংলাদেশ (IBBL)',
    'ডাচ-বাংলা ব্যাংক (DBBL)',
    'সিটি ব্যাংক (City Bank)',
    'সোনালী ব্যাংক (Sonali Bank)',
    'মিউচুয়াল ট্রাস্ট ব্যাংক (MTB)',
    'ইস্টার্ন ব্যাংক (EBL)'
  ];

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setMethod(editingTransaction.method);
      setBankName(editingTransaction.bankName || 'ব্র্যাক ব্যাংক');
      setAmountStr(String(editingTransaction.amount));
      setPerson(editingTransaction.person || '');
      setPhone(editingTransaction.phone || '');
      setNote(editingTransaction.note || '');
      setDate(editingTransaction.date || date);
      setCategory(editingTransaction.category || (editingTransaction.type === 'income' ? 'বিল কালেকশন' : 'অফিস খরচ'));
    } else {
      setType(initialType);
      setMethod(initialMethod || 'নগদ');
      setBankName('ব্র্যাক ব্যাংক');
      setAmountStr('');
      setPerson('');
      setPhone('');
      setNote('');
      setCategory(initialType === 'income' ? 'বিল কালেকশন' : 'অফিস খরচ');
    }
  }, [editingTransaction, initialType, initialMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseFloat(toEnglishNumber(amountStr).replace(/,/g, ''));
    if (isNaN(cleanNum) || cleanNum <= 0) {
      alert(lang === 'bn' ? 'দয়া করে সঠিক টাকার পরিমাণ দিন' : 'Please enter a valid amount');
      return;
    }

    if (!person.trim()) {
      alert(lang === 'bn' ? 'দয়া করে গ্রাহক বা ব্যক্তির নাম লিখুন' : 'Please enter customer or person name');
      return;
    }

    sounds.playSuccess();

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    const entryPayload: any = {
      type,
      method,
      amount: cleanNum,
      person: person.trim(),
      phone: phone.trim(),
      date,
      time: editingTransaction ? editingTransaction.time : timeFormatted,
      note: note.trim(),
      category: category.trim() || (type === 'income' ? 'বিল কালেকশন' : 'খরচ')
    };

    if (editingTransaction?.id) {
      entryPayload.id = editingTransaction.id;
    }
    if (method === 'ব্যাংক' && bankName) {
      entryPayload.bankName = bankName;
    }

    onSave(entryPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] px-6 pt-3 pb-8 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200 max-h-[92vh] overflow-y-auto">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mt-1 mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingTransaction
              ? (lang === 'bn' ? 'এন্ট্রি পরিবর্তন করুন' : 'Edit Transaction')
              : (type === 'income' ? t.new_income_title : t.new_expense_title)}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'bn' ? 'নগদ, বিকাশ, রকেট, ব্যাংক ও ক্যাশ হিসাব সংরক্ষণ' : 'Record MFS, Bank or Cash transaction'}
          </p>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setType('income');
              if (!editingTransaction) setCategory('বিল কালেকশন');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {lang === 'bn' ? 'জমা (Income)' : 'Income'}
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setType('expense');
              if (!editingTransaction) setCategory('অফিস খরচ');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'expense'
                ? 'bg-[#E52E2E] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {lang === 'bn' ? 'খরচ (Expense)' : 'Expense'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Method Selection with Dynamic Channels */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.method} (টাকা লেনদেনের মাধ্যম) *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {channels.map((ch) => (
                <button
                  type="button"
                  key={ch.name}
                  onClick={() => {
                    sounds.playTap();
                    setMethod(ch.name);
                  }}
                  className={`flex-1 min-w-[65px] py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center truncate ${
                    method === ch.name
                      ? 'border-[#E52E2E] bg-rose-50 text-[#E52E2E] dark:bg-rose-950/40 dark:text-rose-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {ch.name}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Bank Name Selector if 'ব্যাংক' is chosen */}
          {method === 'ব্যাংক' && (
            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1.5 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>ব্যাংকের নাম (Bank Name) *</span>
              </label>
              <input
                type="text"
                list="popular-banks"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="যেমন: ব্র্যাক ব্যাংক, ইসলামী ব্যাংক"
                required
                className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-blue-300 dark:border-blue-700 focus:outline-none"
              />
              <datalist id="popular-banks">
                {popularBanks.map((b, i) => (
                  <option key={i} value={b} />
                ))}
              </datalist>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.amount_tk} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-lg font-bold text-[#E52E2E]">
                ৳
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="যেমন: ৫০০০ বা 5000"
                required
                className="w-full h-12 pl-10 pr-4 text-base font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
              />
            </div>
          </div>

          {/* Person / Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.person_name} *
            </label>
            <input
              type="text"
              list="customer-suggestions"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder={lang === 'bn' ? 'গ্রাহক বা ব্যক্তির নাম লিখুন' : 'Enter name'}
              required
              className="w-full h-11 px-3.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
            />
            <datalist id="customer-suggestions">
              {existingCustomers.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.phone_label}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01996-335823"
              className="w-full h-11 px-3.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
            />
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.date} *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-11 px-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={type === 'income' ? 'বিল কালেকশন' : 'অফিস খরচ'}
                className="w-full h-11 px-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
              />
            </div>
          </div>

          {/* Note / Memo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.note}
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'bn' ? 'সংযোগ তথ্য বা ক্যাবল প্যাকেজ মন্তব্য' : 'Notes / Remarks'}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E52E2E]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#D32F2F] to-[#E52E2E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-98 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{t.save_btn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
