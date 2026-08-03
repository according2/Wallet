import React, { useState, useEffect } from 'react';
import { Lock, X, Delete, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PinBottomSheetProps {
  isOpen: boolean;
  amount: number;
  recipientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PinBottomSheet({
  isOpen,
  amount,
  recipientName,
  onClose,
  onSuccess,
}: PinBottomSheetProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (verifying) return;
    setError('');

    if (pin.length < 6) {
      const updated = pin + digit;
      setPin(updated);
      if (updated.length === 6) {
        verifyPin(updated);
      }
    }
  };

  const handleClear = () => {
    if (verifying) return;
    setError('');
    setPin(prev => prev.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    setVerifying(true);
    // Simulate biometric / PIN check
    setTimeout(() => {
      setVerifying(false);
      onSuccess();
    }, 600);
  };

  const handleConfirmClick = () => {
    if (pin.length < 6) {
      setError('Please enter all 6 digits of your PIN');
      return;
    }
    verifyPin(pin);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center p-0 animate-fade-in">
      {/* Sliding Bottom Sheet Container */}
      <div className="bg-slate-900 text-white w-full max-w-lg rounded-t-3xl p-6 shadow-2xl relative border-t border-slate-800 animate-slide-up">
        
        {/* Header Close & Lock Icon */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Wallet Authorization PIN</h3>
              <p className="text-[10px] text-slate-400">Security PIN required to confirm transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Transaction Summary Badge inside Sheet */}
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-center mb-5">
          <span className="text-[10px] uppercase font-medium text-slate-400 tracking-wider">
            Confirm Transfer Amount
          </span>
          <h2 className="text-2xl font-semibold text-amber-400 my-0.5">
            MMK {amount.toLocaleString()}
          </h2>
          <p className="text-xs text-slate-300 font-medium">To: {recipientName}</p>
        </div>

        {/* 6 PIN Indicator Dots */}
        <div className="flex justify-center gap-3.5 mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all border-2 ${
                  isFilled
                    ? 'bg-amber-400 border-amber-300 scale-110 shadow-sm'
                    : 'bg-slate-800 border-slate-600'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-center text-xs font-medium text-rose-400 mb-3 animate-bounce">
            {error}
          </p>
        )}

        {verifying && (
          <div className="text-center text-xs font-medium text-amber-400 mb-4 animate-pulse flex items-center justify-center gap-2">
            <ShieldCheck size={18} />
            <span>Verifying Security Cipher...</span>
          </div>
        )}

        {/* 3x4 Number PIN Keyboard */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-900 text-xl font-medium text-white transition-all shadow-xs active:scale-95 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {/* Row 4: Clear, 0, Confirm Checkmark */}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 active:scale-95 transition-all flex items-center justify-center font-medium text-xs uppercase"
            title="Clear / Backspace"
          >
            <Delete size={20} />
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-900 text-xl font-medium text-white transition-all shadow-xs active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={pin.length < 6}
            className={`h-14 rounded-2xl font-medium transition-all shadow-md active:scale-95 flex items-center justify-center ${
              pin.length === 6
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                : 'bg-slate-800 text-slate-600 opacity-60'
            }`}
            title="Confirm PIN"
          >
            <CheckCircle2 size={24} />
          </button>
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-3">
          Protected by Tier 2 Encrypted Biometric PIN System
        </p>
      </div>
    </div>
  );
}
