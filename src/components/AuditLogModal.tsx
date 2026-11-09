import React from 'react';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { AuditLog, Language } from '../types';
import { formatTransactionDate } from '../utils/formatters';
import { sounds } from '../utils/audio';

interface AuditLogModalProps {
  isOpen: boolean;
  logs: AuditLog[];
  lang: Language;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  logs,
  lang,
  onClose
}) => {
  if (!isOpen) return null;

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
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>{lang === 'bn' ? 'অডিট লগ ও সিস্টেম রেকর্ড' : 'Audit Logs'}</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-24">
        {logs.map((log) => {
          const d = new Date(log.time);
          const timeStr = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

          return (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'bn' ? log.actionBn : log.action}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTransactionDate(dateStr, timeStr, lang)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {log.details}
              </p>
              <div className="mt-2 text-[10px] font-semibold text-slate-400">
                {lang === 'bn' ? `কর্তৃপক্ষ: ${log.user}` : `User: ${log.user}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
