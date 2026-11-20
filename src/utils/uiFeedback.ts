export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface FeedbackToast {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface FeedbackConfirmRequest {
  id: string;
  message: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  resolve: (accepted: boolean) => void;
}

type ToastListener = (toast: FeedbackToast) => void;
type ConfirmListener = (req: FeedbackConfirmRequest) => void;

const feedbackBus: {
  toastListeners: Set<ToastListener>;
  confirmListeners: Set<ConfirmListener>;
} =
  (globalThis as any).__PCN_FEEDBACK_BUS__ ||
  ((globalThis as any).__PCN_FEEDBACK_BUS__ = {
    toastListeners: new Set<ToastListener>(),
    confirmListeners: new Set<ConfirmListener>(),
  });

const toastListeners = feedbackBus.toastListeners;
const confirmListeners = feedbackBus.confirmListeners;

export function subscribeFeedbackToasts(listener: ToastListener): () => void {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

export function subscribeFeedbackConfirms(listener: ConfirmListener): () => void {
  confirmListeners.add(listener);
  return () => {
    confirmListeners.delete(listener);
  };
}

function inferTone(message: string): ToastTone {
  const m = message.toLowerCase();
  if (
    message.includes('❌') ||
    message.includes('ত্রুটি') ||
    message.includes('ব্যর্থ') ||
    message.includes('শুধুমাত্র') ||
    message.includes('সঠিক') ||
    m.includes('error') ||
    m.includes('fail') ||
    m.includes('only') ||
    m.includes('valid')
  ) {
    return 'error';
  }
  if (
    message.includes('✅') ||
    message.includes('সফল') ||
    message.includes('কপি') ||
    m.includes('success') ||
    m.includes('copied')
  ) {
    return 'success';
  }
  if (message.includes('⚠️') || message.includes('নেই') || m.includes('warning')) {
    return 'warning';
  }
  return 'info';
}

export function showToast(message: string, tone?: ToastTone): void {
  const clean = String(message || '').trim();
  if (!clean) return;
  const item: FeedbackToast = {
    id: `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    message: clean,
    tone: tone || inferTone(clean),
  };
  toastListeners.forEach((fn) => {
    try {
      fn(item);
    } catch {}
  });
}

export interface ConfirmOptions {
  message?: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  danger?: boolean;
}

export function showConfirm(
  messageOrOptions: string | (ConfirmOptions & { message: string }),
  options?: ConfirmOptions
): Promise<boolean> {
  if (confirmListeners.size === 0) {
    return Promise.resolve(false);
  }
  const normalized =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions, ...options }
      : messageOrOptions;
  return new Promise<boolean>((resolve) => {
    const req: FeedbackConfirmRequest = {
      id: `cfm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      message: String(normalized.message || ''),
      title: normalized.title,
      confirmLabel: normalized.confirmLabel,
      cancelLabel: normalized.cancelLabel,
      destructive: normalized.destructive ?? normalized.danger ?? true,
      resolve,
    };
    confirmListeners.forEach((fn) => {
      try {
        fn(req);
      } catch {}
    });
  });
}
