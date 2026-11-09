import React from 'react';
import { ArrowLeft, RotateCcw, Trash, AlertCircle } from 'lucide-react';
import { Language, Transaction } from '../types';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface RecycleBinModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  lang: Language;
  onClose: () => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
  isOpen,
  transactions,
  lang,
  onClose,
  onRestore,
  onPermanentDelete,
  onEmptyTrash
}) => {
  if (!isOpen) return null;
  const deleted = transactions.filter(t => t.isDeleted);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200">
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'bn' ? 'রিসাইকেল বিন' : 'Recycle Bin'}
          </h2>
        </div>

        {deleted.length > 0 && (
          <button
            onClick={() => {
              if (confirm(lang === 'bn' ? 'সব মুছে ফেলতে চান?' : 'Empty all deleted items?')) {
                sounds.playTap();
                onEmptyTrash();
              }
            }}
            className="text-xs font-bold text-[#E52E2E] hover:underline"
          >
            {lang === 'bn' ? 'সব খালি করুন' : 'Empty All'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {deleted.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">
              {lang === 'bn' ? 'রিসাইকেল বিনে কোনো তথ্য নেই' : 'Recycle bin is empty'}
            </p>
          </div>
        ) : (
          deleted.map((trx) => (
            <div
              key={trx.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {trx.person}
                </h4>
                <p className="text-xs text-slate-500">
                  {trx.method} • {formatTransactionDate(trx.date, trx.time, lang)}
                </p>
                <span className="text-xs font-bold text-[#E52E2E] mt-0.5 block tabular-nums">
                  {formatCurrency(trx.amount, lang)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playTap();
                    onRestore(trx.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    onPermanentDelete(trx.id);
                  }}
                  className="w-8 h-8 rounded-xl bg-rose-50 text-[#E52E2E] flex items-center justify-center"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
