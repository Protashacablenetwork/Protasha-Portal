import React, { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw, Trash, AlertCircle, Clock, Lock } from 'lucide-react';
import { Language, Transaction, UserSession } from '../types';
import { formatCurrency, formatTransactionDate, toBengaliNumber } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { showConfirm } from '../utils/uiFeedback';
import { canModifyTransaction, isSubAdmin as checkIsSubAdmin } from '../utils/permissions';

interface RecycleBinModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  lang: Language;
  user?: UserSession | null;
  onClose: () => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyTrash: () => void;
}

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
  isOpen,
  transactions,
  lang,
  user,
  onClose,
  onRestore,
  onPermanentDelete,
  onEmptyTrash
}) => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const isAdmin = user?.role === 'admin';
  const isSubAdmin = checkIsSubAdmin(user);

  useEffect(() => {
    if (!isOpen || !isSubAdmin) return;
    setNowMs(Date.now());
    const timer = setInterval(() => setNowMs(Date.now()), 15000);
    return () => clearInterval(timer);
  }, [isOpen, isSubAdmin]);

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
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'bn' ? 'রিসাইকেল বিন' : 'Recycle Bin'}
          </h2>
        </div>

        {isAdmin && deleted.length > 0 && (
          <button
            onClick={async () => {
              const confirmed = await showConfirm({
                message: lang === 'bn' ? 'সব মুছে ফেলতে চান?' : 'Empty all deleted items?',
                confirmLabel: lang === 'bn' ? 'সব মুছুন' : 'Empty All',
                cancelLabel: lang === 'bn' ? 'বাতিল' : 'Cancel',
                danger: true
              });
              if (confirmed) {
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
          deleted.map((trx) => {
            const modCheck = canModifyTransaction(trx, user, nowMs);
            const minsLeft = modCheck.allowed && Number.isFinite(modCheck.remainingMs)
              ? Math.max(1, Math.ceil(modCheck.remainingMs / 60000))
              : 0;

            return (
              <div
                key={trx.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {trx.person}
                    </h4>
                    {isSubAdmin && modCheck.allowed && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md border border-amber-200/70">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{lang === 'bn' ? `${toBengaliNumber(minsLeft)} মিঃ` : `${minsLeft}m`}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {trx.method} • {formatTransactionDate(trx.date, trx.time, lang)}
                  </p>
                  <span className="text-xs font-bold text-[#E52E2E] mt-0.5 block tabular-nums">
                    {formatCurrency(trx.amount, lang)}
                  </span>
                </div>

                {modCheck.allowed ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onRestore(trx.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'পুনরুদ্ধার' : 'Restore'}</span>
                    </button>
                    <button
                      onClick={async () => {
                        const confirmed = await showConfirm({
                          message:
                            lang === 'bn'
                              ? 'এই এন্ট্রিটি স্থায়ীভাবে মুছে ফেলতে চান?'
                              : 'Permanently delete this item?',
                          confirmLabel: lang === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Delete Permanently',
                          cancelLabel: lang === 'bn' ? 'বাতিল' : 'Cancel',
                          danger: true
                        });
                        if (confirmed) {
                          sounds.playTap();
                          onPermanentDelete(trx.id);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] flex items-center justify-center"
                      title={lang === 'bn' ? 'স্থায়ীভাবে মুছুন' : 'Delete Permanently'}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <Lock className="w-3 h-3" />
                    <span>
                      {modCheck.isOwner && modCheck.expired
                        ? lang === 'bn' ? 'সময় শেষ' : 'Expired'
                        : lang === 'bn' ? 'সংরক্ষিত' : 'Read-Only'}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
