import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Language, Transaction } from '../types';
import { formatCurrency, formatTransactionDate, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface ReceiptModalProps {
  transaction: Transaction | null;
  lang: Language;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, lang, onClose }) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  const handlePrint = () => {
    sounds.playTap();
    window.print();
  };

  const handleCopyMemo = () => {
    sounds.playTap();
    const memo = `
=================================
  ${lang === 'bn' ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
     ডিজিটাল ক্যাশ মেমো ও রশিদ
=================================
ঠিকানা: দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), হাজী আবেদ আলী মার্কেট, ইসলামপুর, জামালপুর
ট্রানজেকশন আইডি: #${transaction.trxId}
তারিখ: ${formatTransactionDate(transaction.date, transaction.time, lang)}
গ্রাহক: ${transaction.person}
মোবাইল: ${transaction.phone || 'N/A'}
ধরন: ${isIncome ? 'জমা / বিল কালেকশন' : 'খরচ / পেমেন্ট'}
মাধ্যম: ${transaction.method}
মোট পরিশোধ: ${formatCurrency(transaction.amount, lang)}
বিবরণ: ${transaction.note || 'মাসিক ক্যাবল ফি পরিশোধ'}
অবস্থা: পরিশোধিত (PAID)
=================================
হেল্পলাইন: 01777877207 | ইমেইল: protashacablenetwork@gmail.com
ধন্যবাদ আমাদের সাথে থাকার জন্য!
`;
    navigator.clipboard?.writeText(memo);
    alert(lang === 'bn' ? 'সম্পূর্ণ মেমো ক্লিপবোর্ডে কপি করা হয়েছে!' : 'Full receipt memo copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white text-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Area */}
        <div id="printable-receipt" className="font-mono text-xs">
          {/* Company Brand */}
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E52E2E] text-white flex items-center justify-center text-xl font-bold font-sans mb-1 shadow-sm">
              প্র
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 font-sans">
              {lang === 'bn' ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক' : 'Protasha Cable Network'}
            </h2>
            <p className="text-[10px] text-slate-500 tracking-wider mt-0.5">
              দত্তপাড়া আনন্দ বাজার (টানা ব্রীজ), ইসলামপুর, জামালপুর
            </p>
            <p className="text-[10px] text-slate-600 font-bold mt-0.5">
              হেল্পলাইন: 01777877207
            </p>
          </div>

          {/* Paid Stamp */}
          <div className="flex items-center justify-center gap-1.5 my-3 text-emerald-600 bg-emerald-50 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">
              {isIncome ? 'পরিশোধিত / PAID' : 'নিষ্পন্ন / COMPLETED'}
            </span>
          </div>

          {/* Receipt Rows */}
          <div className="space-y-2 py-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">ট্রানজেকশন নং:</span>
              <span className="font-bold text-slate-900">#{transaction.trxId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">তারিখ ও সময়:</span>
              <span className="font-medium text-slate-800">
                {formatTransactionDate(transaction.date, transaction.time, lang)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">গ্রাহক / ব্যক্তি:</span>
              <span className="font-bold text-slate-900 truncate max-w-[170px]">
                {transaction.person}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">মোবাইল:</span>
              <span className="font-medium text-slate-800">{transaction.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-slate-900">
                {transaction.method}{transaction.bankName ? ` (${transaction.bankName})` : ''}
              </span>
            </div>
            {transaction.note && (
              <div className="pt-1 text-[11px] text-slate-600 italic border-t border-slate-100">
                &ldquo;{transaction.note}&rdquo;
              </div>
            )}
          </div>

          {/* Total Amount Box */}
          <div className="pt-3 pb-2 border-t-2 border-dashed border-slate-300 flex items-center justify-between text-sm font-bold font-sans">
            <span className="text-slate-700">মোট টাকা:</span>
            <span className={`text-base font-extrabold ${isIncome ? 'text-emerald-600' : 'text-[#E52E2E]'}`}>
              {formatCurrency(transaction.amount, lang)}
            </span>
          </div>

          {/* Simulated Barcode */}
          <div className="py-3 text-center">
            <div className="h-9 w-48 mx-auto bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_8px,#000_8px,#000_11px,#fff_11px,#fff_14px)] opacity-75" />
            <p className="text-[9px] tracking-widest text-slate-400 mt-1 uppercase">
              *{transaction.trxId}*
            </p>
          </div>

          <p className="text-center text-[10px] text-slate-400">
            প্রত্যাশা স্মার্ট অ্যাকাউন্টিং সিস্টেম দ্বারা তৈরি
          </p>
        </div>

        {/* Buttons for Print & Copy */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
          <button
            onClick={handleCopyMemo}
            className="h-10 rounded-xl bg-rose-50 text-[#E52E2E] border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>কপি মেমো</span>
          </button>
        </div>
      </div>
    </div>
  );
};
