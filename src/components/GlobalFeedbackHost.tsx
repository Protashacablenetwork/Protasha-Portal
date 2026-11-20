import React, { useEffect, useState } from 'react';
import {
  FeedbackConfirmRequest,
  FeedbackToast,
  subscribeFeedbackConfirms,
  subscribeFeedbackToasts,
} from '../utils/uiFeedback';

export const GlobalFeedbackHost: React.FC = () => {
  const [toasts, setToasts] = useState<FeedbackToast[]>([]);
  const [confirmQueue, setConfirmQueue] = useState<FeedbackConfirmRequest[]>([]);

  useEffect(() => {
    const unsubToast = subscribeFeedbackToasts((toast) => {
      setToasts((prev) => [...prev.slice(-2), toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3600);
    });

    const unsubConfirm = subscribeFeedbackConfirms((req) => {
      setConfirmQueue((prev) => [...prev, req]);
    });

    return () => {
      unsubToast();
      unsubConfirm();
    };
  }, []);

  const activeConfirm = confirmQueue[0] || null;

  const handleResolveConfirm = (accepted: boolean) => {
    if (!activeConfirm) return;
    const current = activeConfirm;
    setConfirmQueue((prev) => prev.slice(1));
    current.resolve(accepted);
  };

  return (
    <>
      {/* Non-blocking modern floating toasts */}
      {toasts.length > 0 && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[260] w-[92%] max-w-sm space-y-2 pointer-events-none"
          aria-live="polite"
        >
          {toasts.map((toast) => {
            const toneStyles =
              toast.tone === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-50'
                : toast.tone === 'error'
                  ? 'bg-rose-950/95 border-rose-500/60 text-rose-50'
                  : toast.tone === 'warning'
                    ? 'bg-amber-950/95 border-amber-500/60 text-amber-50'
                    : 'bg-slate-900/95 border-slate-600/60 text-white';

            return (
              <div
                key={toast.id}
                className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${toneStyles}`}
              >
                <span className="leading-snug">{toast.message}</span>
                <button
                  type="button"
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="shrink-0 px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Iframe-safe accessible confirmation modal */}
      {activeConfirm && (
        <div className="fixed inset-0 z-[270] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              {activeConfirm.title || 'নিশ্চিতকরণ'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
              {activeConfirm.message}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleResolveConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {activeConfirm.cancelLabel || 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={() => handleResolveConfirm(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-sm transition-colors cursor-pointer ${
                  activeConfirm.destructive
                    ? 'bg-[#E52E2E] hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {activeConfirm.confirmLabel || 'নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
