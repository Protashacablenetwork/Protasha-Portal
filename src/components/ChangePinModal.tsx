import React, { useState } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';

interface ChangePinModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onPinChanged: (newPin: string) => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  lang,
  onClose,
  onPinChanged
}) => {
  if (!isOpen) return null;

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setError(lang === 'bn' ? 'পিন কমপক্ষে ৪ সংখ্যার হতে হবে' : 'PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError(lang === 'bn' ? 'নতুন পিন ও নিশ্চিত পিন মিলেনি' : 'PINs do not match');
      return;
    }

    sounds.playSuccess();
    onPinChanged(newPin);
    alert(lang === 'bn' ? 'পিন সফলভাবে পরিবর্তিত হয়েছে!' : 'PIN changed successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#E52E2E] mx-auto flex items-center justify-center mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'bn' ? 'পিন পরিবর্তন করুন' : 'Change Security PIN'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'bn' ? 'নতুন ৪ থেকে ৬ সংখ্যার গোপন পিন দিন' : 'Enter new 4-6 digit secret PIN'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {lang === 'bn' ? 'বর্তমান পিন' : 'Current PIN'}
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
              style={{ WebkitTextSecurity: 'disc' } as any}
              maxLength={6}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="••••"
              required
              className="w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {lang === 'bn' ? 'নতুন পিন' : 'New PIN'}
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
              style={{ WebkitTextSecurity: 'disc' } as any}
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="••••"
              required
              className="w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {lang === 'bn' ? 'নতুন পিন নিশ্চিত করুন' : 'Confirm New PIN'}
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
              style={{ WebkitTextSecurity: 'disc' } as any}
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="••••"
              required
              className="w-full h-11 px-3 text-center tracking-widest text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#E52E2E] text-white font-bold text-xs shadow-md shadow-rose-600/30 active:scale-95 transition-all mt-2"
          >
            {lang === 'bn' ? 'পিন আপডেট করুন' : 'Update PIN'}
          </button>
        </form>
      </div>
    </div>
  );
};
