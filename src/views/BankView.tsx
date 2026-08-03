import React, { useState } from 'react';
import { BankAccount } from '../types';
import { ArrowLeft, Building2, Plus, Trash2, CheckCircle2, ShieldCheck, Lock, RefreshCw, Eye, EyeOff, Users, Sparkles } from 'lucide-react';

interface BankViewProps {
  bankAccounts: BankAccount[];
  onBack: () => void;
  onLinkBank: (bankName: string, accountNo: string) => void;
  onUnlinkBank: (id: string) => void;
  onOpenManageBeneficiaries?: () => void;
}

export function BankView({
  bankAccounts,
  onBack,
  onLinkBank,
  onUnlinkBank,
  onOpenManageBeneficiaries,
}: BankViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedBank, setSelectedBank] = useState('Shwe Bank');
  const [accountNo, setAccountNo] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');

  const linkedAccounts = bankAccounts.filter((b) => b.isLinked);
  const availableBanks = ['Shwe Bank'];

  const handleStartLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNo) return;
    setStep('otp');
  };

  const handleConfirmOtp = () => {
    onLinkBank(selectedBank, accountNo);
    setStep('success');
  };

  const handleFinish = () => {
    setShowAddModal(false);
    setStep('input');
    setAccountNo('');
  };

  return (
    <div className="pb-28 pt-6 px-4 min-h-screen bg-slate-50 max-w-2xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-widest">
                Partner Integration
              </span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Shwe Bank Linking</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenManageBeneficiaries && (
            <button
              onClick={onOpenManageBeneficiaries}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-2xl flex items-center gap-1.5 transition-all"
            >
              <Users size={16} />
              <span>Beneficiaries</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-xs rounded-2xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Link Account</span>
          </button>
        </div>
      </div>

      {/* Official Shwe Bank Integration Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 mb-5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-semibold text-xs shadow-sm">
              SHWE
            </div>
            <div>
              <h3 className="font-medium text-sm text-white leading-tight">Shwe Rural & Urban Development Bank</h3>
              <p className="text-[10px] text-amber-300 font-medium">Exclusive Direct Banking Partner</p>
            </div>
          </div>

          <button
            onClick={() => setShowBalances(!showBalances)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            {showBalances ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        <div className="my-3 pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">
            Total Shwe Bank Connected Balance
          </span>
          <h2 className="text-3xl font-semibold text-amber-400 my-0.5">
            MMK{' '}
            {showBalances
              ? linkedAccounts.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()
              : '••••••••'}
          </h2>
          <p className="text-[11px] text-slate-400">Directly accessible for instant 24/7 wallet top-up & payouts</p>
        </div>
      </div>

      {/* Linked Accounts List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-slate-800 uppercase tracking-wider">
            Connected Shwe Bank Accounts ({linkedAccounts.length})
          </span>
          <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Shwe Direct Link: Active
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {linkedAccounts.map((account) => (
            <div key={account.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-xs bg-amber-500 text-slate-900 shadow-xs border border-amber-300">
                  SHWE
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 text-sm">{account.bankName}</h3>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                      Direct Verified
                    </span>
                    {account.isDefault && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-300">
                        Primary Account
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Account No: {account.accountNumber}
                  </p>
                  <p className="text-xs font-medium text-blue-600 mt-0.5">
                    Balance: MMK {showBalances ? account.balance.toLocaleString() : '••••••••'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onUnlinkBank(account.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Unlink Account"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Form / Card View for Linking New Account */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="font-medium text-slate-900 text-sm uppercase tracking-wide">Link Shwe Bank Account</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Connect your official Shwe Rural & Urban Development Bank account for instant 0% fee cash deposits and withdrawals.
        </p>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-slate-900 text-amber-400 font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition-all text-xs uppercase tracking-wider"
        >
          <Plus size={18} /> Direct Link Shwe Bank Account
        </button>
      </div>

      {/* Link Shwe Bank Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-fade-in">
            {step === 'input' && (
              <form onSubmit={handleStartLink}>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 font-semibold text-xs flex items-center justify-center">
                      SHWE
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base">Link Shwe Bank Account</h3>
                  </div>
                  <button type="button" onClick={handleFinish} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 uppercase">Partner Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-amber-500"
                    >
                      {availableBanks.map(b => (
                        <option key={b} value={b}>{b} (Shwe Rural & Urban Development Bank)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 uppercase">Shwe Bank Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 2001 8812 0092 1082"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex gap-2">
                    <Lock size={16} className="shrink-0 text-amber-600 mt-0.5" />
                    <span>Instant authorization via Shwe Bank CBS encrypted API gateway.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-3.5 rounded-xl shadow-md active:scale-95 transition-all text-xs uppercase tracking-wider"
                >
                  Verify Shwe Bank Account
                </button>
              </form>
            )}

            {step === 'otp' && (
              <div>
                <div className="text-center mb-6">
                  <RefreshCw size={36} className="mx-auto text-amber-500 animate-spin mb-2" />
                  <h3 className="font-medium text-slate-900 text-base">Security OTP Verification</h3>
                  <p className="text-xs text-slate-500 mt-1">Enter 6-digit code sent to registered mobile number</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {[1,2,3,4,5,6].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i < 4 ? '8' : ''}
                      className="w-10 h-12 text-center text-lg font-medium border border-slate-300 rounded-xl bg-slate-50 focus:border-amber-500 outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handleConfirmOtp}
                  className="w-full bg-amber-500 text-slate-900 font-semibold py-3.5 rounded-xl shadow-md active:scale-95 transition-all text-xs uppercase"
                >
                  Confirm & Link Shwe Bank
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">Shwe Bank Linked!</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">Direct transfers & payouts now enabled with Shwe Bank.</p>
                <button
                  onClick={handleFinish}
                  className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-xl text-xs uppercase"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
