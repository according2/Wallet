import React, { useState, useEffect } from 'react';
import { User, Beneficiary, Transaction } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck, UserCheck, ArrowRight, Download, Share2, Copy } from 'lucide-react';
import { PinBottomSheet } from '../components/PinBottomSheet';

interface TransactionViewProps {
  user: User;
  initialType?: string;
  beneficiaries: Beneficiary[];
  recentTransactions: Transaction[];
  onBack: () => void;
  onCompleteTransaction: (amount: number, recipientName: string, recipientPhone: string, type: string) => void;
  onOpenManageBeneficiaries?: () => void;
}

export function TransactionView({
  user,
  initialType = 'Send Money',
  beneficiaries,
  recentTransactions,
  onBack,
  onCompleteTransaction,
  onOpenManageBeneficiaries,
}: TransactionViewProps) {
  const [step, setStep] = useState<'input' | 'preview' | 'receipt'>('input');

  // Input states
  const [activeTab, setActiveTab] = useState<'recents' | 'saved'>('saved');
  const [walletNumber, setWalletNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // PIN Bottom Sheet state
  const [isPinOpen, setIsPinOpen] = useState(false);

  // Receipt data
  const [refNo, setRefNo] = useState('');
  const [copied, setCopied] = useState(false);

  // Focus states for conditional UI shortcuts
  const [isRemarkFocused, setIsRemarkFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  // Check phone validity (minimum 8 digits)
  const isPhoneValid = walletNumber.trim().replace(/\D/g, '').length >= 8 || isVerified;

  // Auto verify mock when typing phone
  useEffect(() => {
    if (walletNumber.length >= 8) {
      setVerificationLoading(true);
      const timer = setTimeout(() => {
        setVerificationLoading(false);
        const matched = beneficiaries.find(b => b.phone.includes(walletNumber) || walletNumber.includes(b.phone));
        if (matched) {
          setRecipientName(`${matched.name}`);
        } else {
          setRecipientName('Aung Kyaw');
        }
        setIsVerified(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVerified(false);
      setRecipientName('');
    }
  }, [walletNumber, beneficiaries]);

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setWalletNumber(b.phone);
    setRecipientName(b.name);
    setIsVerified(true);
  };

  const handleSelectRecent = (tx: Transaction) => {
    const phone = tx.recipient?.match(/\d+/)?.[0] || '09782119922';
    const name = tx.recipient?.split('(')[0]?.trim() || tx.merchant || 'Aung Kyaw';
    setWalletNumber(phone);
    setRecipientName(name);
    setIsVerified(true);
  };

  const remarkShortcuts = [
    '🍕 Dinner Share',
    '💡 Utility Bills',
    '🎁 Birthday Gift',
    '🏠 Monthly Rent',
    '☕ Coffee & Snacks',
    '🤝 Loan Repayment',
    '🛒 Supermarket',
    '💸 Pocket Money'
  ];

  const handleAddRemarkShortcut = (shortcut: string) => {
    if (!remark) {
      setRemark(shortcut);
    } else {
      setRemark(`${remark} - ${shortcut}`);
    }
  };

  const handleProceedToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletNumber || !amount || Number(amount) <= 0) return;
    setStep('preview');
  };

  // Called when user clicks "Confirm & Authorize with PIN" on Preview
  const handleOpenPin = () => {
    setIsPinOpen(true);
  };

  // Called when 6-digit PIN is verified in PinBottomSheet
  const handlePinSuccess = () => {
    setIsPinOpen(false);
    const numAmount = Number(amount);
    const generatedRef = `MMK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setRefNo(generatedRef);
    onCompleteTransaction(numAmount, recipientName || 'Recipient', walletNumber, initialType);
    setStep('receipt');
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(refNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-2xl mx-auto pb-28 pt-6 px-4 animate-fade-in">
      {/* Top Bar Header */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
        <button
          onClick={step === 'preview' ? () => setStep('input') : onBack}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{initialType}</h1>
          <p className="text-xs text-slate-500">Instant Wallet & Direct Bank Settlement</p>
        </div>
      </div>

      {/* STEP 1: INPUT FORM */}
      {step === 'input' && (
        <div className="space-y-4">
          {/* Quick Select Tabs: Recent & Saved Beneficiaries */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-900 uppercase tracking-wider">Quick Select Contact</span>
              {onOpenManageBeneficiaries && (
                <button
                  type="button"
                  onClick={onOpenManageBeneficiaries}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Manage List
                </button>
              )}
            </div>

            {/* Segmented control */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                  activeTab === 'saved' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Saved List ({beneficiaries.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recents')}
                className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                  activeTab === 'recents' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                Recent Transferred
              </button>
            </div>

            {/* List horizontal scroll */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
              {activeTab === 'saved' ? (
                beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="min-w-[105px] p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-2xl text-center active:scale-95 transition-all shrink-0"
                  >
                    <img
                      src={b.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={b.name}
                      className="w-10 h-10 rounded-full object-cover mx-auto mb-1 border border-slate-200"
                    />
                    <h4 className="text-xs font-medium text-slate-800 truncate">{b.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold truncate">{b.phone}</p>
                  </button>
                ))
              ) : (
                recentTransactions.slice(0, 5).map((tx) => (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => handleSelectRecent(tx)}
                    className="min-w-[115px] p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-2xl text-center active:scale-95 transition-all shrink-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-xs mx-auto mb-1">
                      {tx.type.charAt(0)}
                    </div>
                    <h4 className="text-xs font-medium text-slate-800 truncate">
                      {tx.recipient?.split('(')[0] || tx.merchant || 'Transfer'}
                    </h4>
                    <p className="text-[10px] text-emerald-600 font-medium">MMK {Math.abs(tx.amount).toLocaleString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Transfer Form */}
          <form onSubmit={handleProceedToPreview} className="bg-white rounded-3xl p-5 border border-slate-200/80 space-y-4 shadow-xs">
            {/* Wallet / Phone Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-800 uppercase tracking-wider block">
                  Recipient Wallet Phone Number
                </label>
                {isPhoneValid && (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Phone Valid
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Enter 09xxxxxxxxx phone number"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-blue-600 focus:bg-white"
              />

              {/* Helper note when phone is NOT valid yet */}
              {!isPhoneValid && (
                <div className="mt-2.5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-blue-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                  <p className="font-semibold text-[11px] leading-snug">
                    Enter a valid recipient phone number (8+ digits) or tap a contact above to unlock details & amount.
                  </p>
                </div>
              )}

              {/* Verified Name Badge (Shown ONLY when phone is valid) */}
              {isPhoneValid && verificationLoading && (
                <p className="text-xs text-blue-600 mt-2 animate-pulse font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  Verifying wallet user account...
                </p>
              )}
              {isPhoneValid && isVerified && !verificationLoading && (
                <div className="mt-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 animate-fade-in">
                  <UserCheck size={20} className="text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{recipientName}</p>
                      <span className="text-[9px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Tier 2 KYC Authenticated Wallet</p>
                  </div>
                </div>
              )}
            </div>

            {/* PROGRESSIVE DISCLOSURE: Show Amount, Remark, and Continue Button ONLY when Phone is Valid */}
            {isPhoneValid && (
              <div className="space-y-4 pt-1 animate-fade-in">
                {/* Amount Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-800 uppercase tracking-wider">
                      Amount (MMK)
                    </label>
                    <span className="text-xs text-slate-500 font-semibold">
                      Avail: MMK {user.balance.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1000}
                    placeholder="0.00 MMK"
                    value={amount}
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setTimeout(() => setIsAmountFocused(false), 200)}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-semibold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />

                  {/* Quick Amount Chips */}
                  <div className="flex gap-2 mt-2">
                    {[50000, 100000, 500000, 1000000].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setAmount(String(chip))}
                        className="flex-1 py-2 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-200/80 active:scale-95 transition-all"
                      >
                        +{(chip / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remark / Note Input with FOCUS SHORTCUTS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-800 uppercase tracking-wider block">
                      Remark / Reference Note (Optional)
                    </label>
                    {isRemarkFocused && (
                      <span className="text-[10px] text-blue-600 font-medium">Select shortcut below</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Dinner expense share"
                    value={remark}
                    onFocus={() => setIsRemarkFocused(true)}
                    onBlur={() => setTimeout(() => setIsRemarkFocused(false), 200)}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />

                  {/* FOCUS SHORTCUTS: Show right under Input Box when focused or when remark is filled */}
                  {(isRemarkFocused || remark.length > 0) && (
                    <div className="mt-2.5 p-2.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 animate-fade-in">
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2 px-1">
                        Quick Remarks Shortcuts (Tap to add)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {remarkShortcuts.map((shortcut) => (
                          <button
                            key={shortcut}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault(); // keep input focus
                              handleAddRemarkShortcut(shortcut);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-medium text-[11px] rounded-xl border border-slate-200/80 shadow-2xs active:scale-95 transition-all"
                          >
                            {shortcut}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!walletNumber || !amount || Number(amount) <= 0}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all mt-3"
                >
                  <span>Continue for Preview</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* STEP 2: PREVIEW SCREEN WITH ALL TXN DETAILS */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Transaction Preview Details
              </h2>
              <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full uppercase">
                {initialType}
              </span>
            </div>

            {/* Comprehensive Details Card */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Source Account</span>
                <span className="font-medium text-slate-900">{user.name} ({user.phone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Recipient Name</span>
                <span className="font-medium text-slate-900">{recipientName || 'Verified Wallet User'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Recipient Phone</span>
                <span className="font-medium text-slate-900">{walletNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Transfer Amount</span>
                <span className="font-semibold text-slate-900">MMK {Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Processing Fee</span>
                <span className="font-medium text-emerald-600">0 MMK (Free)</span>
              </div>
              {remark && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Remark Note</span>
                  <span className="font-semibold text-slate-800">{remark}</span>
                </div>
              )}
            </div>

            {/* Deduction Highlight Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase">Total Deduction</span>
                <h3 className="text-2xl font-semibold text-white mt-0.5">
                  MMK {Number(amount).toLocaleString()}
                </h3>
              </div>
              <ShieldCheck size={32} className="text-amber-400" />
            </div>

            {/* Confirm & Trigger PIN Bottom Sheet */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenPin}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ShieldCheck size={20} />
                <span>Confirm & Enter 6-Digit PIN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: FULL RECEIPTS SCREEN */}
      {step === 'receipt' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={38} />
          </div>

          <div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              Transaction Successful
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 mt-2">
              MMK {Number(amount).toLocaleString()}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Transferred to {recipientName}</p>
          </div>

          {/* Full Receipt Breakdown Details */}
          <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2.5 text-xs border border-slate-100">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Reference No:</span>
              <div className="flex items-center gap-1 font-mono font-medium text-slate-900">
                <span>{refNo}</span>
                <button onClick={handleCopyRef} className="text-blue-600" title="Copy">
                  <Copy size={13} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Recipient Phone:</span>
              <span className="font-medium text-slate-900">{walletNumber}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Source Account:</span>
              <span className="font-medium text-slate-900">Main Wallet Balance</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Service Type:</span>
              <span className="font-medium text-blue-600">{initialType}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Fee:</span>
              <span className="font-medium text-emerald-600">0 MMK (Free)</span>
            </div>
          </div>

          {copied && (
            <p className="text-center text-xs font-medium text-emerald-600 animate-pulse">
              Reference number copied!
            </p>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => alert('Receipt saved as image to device!')}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-2xl flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Save Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Share receipt via Viber or Messenger')}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-2xl flex items-center justify-center gap-1.5"
            >
              <Share2 size={14} />
              <span>Share Receipt</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-2xl shadow-xs"
          >
            Back to Wallet Dashboard
          </button>
        </div>
      )}

      {/* NUMBER PIN KEYBOARD BOTTOM SHEET */}
      <PinBottomSheet
        isOpen={isPinOpen}
        amount={Number(amount) || 0}
        recipientName={recipientName || walletNumber}
        onClose={() => setIsPinOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
}
