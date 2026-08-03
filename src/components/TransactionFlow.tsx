import React, { useState } from 'react';
import { BankAccount, User } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck, Building2, CreditCard, Wallet, Smartphone, Send, ArrowDownToLine, ArrowUpFromLine, Copy, Lock, Sparkles, Download, Share2 } from 'lucide-react';
import { PinBottomSheet } from './PinBottomSheet';

interface TransactionFlowProps {
  actionType: string;
  user: User;
  bankAccounts: BankAccount[];
  onClose: () => void;
  onCompleteTransaction: (tx: { type: string; amount: number; recipient?: string; merchant?: string }) => void;
}

export function TransactionFlow({
  actionType,
  user,
  bankAccounts,
  onClose,
  onCompleteTransaction,
}: TransactionFlowProps) {
  const [step, setStep] = useState<'form' | 'confirm' | 'receipt'>('form');
  
  // Specific sub-category modes
  const [sendSubMode, setSendSubMode] = useState<'wallet' | 'non_wallet' | 'link_bank' | 'other_bank'>('wallet');
  const [cashInSubMode, setCashInSubMode] = useState<'agent' | 'mpu' | 'visa' | 'wallet_p2p'>('mpu');
  const [cashOutSubMode, setCashOutSubMode] = useState<'agent' | 'link_bank' | 'unlink_bank'>('agent');

  // Form Fields
  const [recipient, setRecipient] = useState('');
  const [nrc, setNrc] = useState('');
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts.find(b => b.isLinked)?.id || 'wallet');
  const [otherBankName, setOtherBankName] = useState('KBZ Bank');
  const [amount, setAmount] = useState('25000');
  const [note, setNote] = useState('');
  const [refNo, setRefNo] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  // Check recipient validity for Wallet mode
  const isRecipientValid = recipient.trim().replace(/\D/g, '').length >= 8 || sendSubMode !== 'wallet';

  const noteShortcuts = [
    '🍕 Dinner Share',
    '💡 Utility Bills',
    '🎁 Birthday Gift',
    '🏠 Monthly Rent',
    '☕ Coffee & Snacks',
    '🤝 Loan Repayment',
    '🛒 Supermarket'
  ];

  const handleAddNoteShortcut = (shortcut: string) => {
    if (!note) {
      setNote(shortcut);
    } else {
      setNote(`${note} - ${shortcut}`);
    }
  };

  const linkedBanks = bankAccounts.filter(b => b.isLinked);
  const selectedBank = bankAccounts.find(b => b.id === selectedBankId);

  // Determine Title based on actionType
  const getHeaderTitle = () => {
    if (actionType.includes('transfer') || actionType.includes('Send')) return 'Send Money';
    if (actionType.includes('cash_in') || actionType.includes('Cash In')) return 'Cash In / Top Up';
    if (actionType.includes('cash_out') || actionType.includes('Cash Out')) return 'Cash Out / Withdraw';
    return actionType;
  };

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setStep('confirm');
  };

  const handleConfirmAndPay = () => {
    const generatedRef = `MMK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setRefNo(generatedRef);
    
    onCompleteTransaction({
      type: getHeaderTitle(),
      amount: Number(amount),
      recipient: recipient || (sendSubMode === 'non_wallet' ? `NRC ${nrc}` : 'Wallet Beneficiary'),
      merchant: actionType.includes('Bill') || actionType.includes('Utility') ? actionType : undefined,
    });

    setStep('receipt');
  };

  const handleCopyRef = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white border-b border-blue-700">
          <div className="flex items-center gap-2">
            {step === 'confirm' && (
              <button onClick={() => setStep('form')} className="p-1 bg-white/10 rounded-lg hover:bg-white/20">
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="font-medium text-sm">{getHeaderTitle()}</h2>
          </div>
          <button onClick={onClose} className="p-1 bg-white/10 rounded-lg hover:bg-white/20 text-xs">
            ✕
          </button>
        </div>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleNextToConfirm} className="p-4 overflow-y-auto space-y-4 text-gray-900">
            
            {/* Sub-mode selector tabs for Send Money */}
            {(actionType.includes('transfer') || actionType.includes('Send')) && (
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setSendSubMode('wallet')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${sendSubMode === 'wallet' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Wallet User
                </button>
                <button
                  type="button"
                  onClick={() => setSendSubMode('non_wallet')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${sendSubMode === 'non_wallet' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Non-Wallet (NRC)
                </button>
                <button
                  type="button"
                  onClick={() => setSendSubMode('link_bank')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${sendSubMode === 'link_bank' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Linked Bank
                </button>
                <button
                  type="button"
                  onClick={() => setSendSubMode('other_bank')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${sendSubMode === 'other_bank' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Other Banks
                </button>
              </div>
            )}

            {/* Sub-mode selector tabs for Cash In */}
            {(actionType.includes('cash_in') || actionType.includes('Cash In')) && (
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setCashInSubMode('agent')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashInSubMode === 'agent' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Agent Cash In
                </button>
                <button
                  type="button"
                  onClick={() => setCashInSubMode('mpu')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashInSubMode === 'mpu' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  MPU Card
                </button>
                <button
                  type="button"
                  onClick={() => setCashInSubMode('visa')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashInSubMode === 'visa' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Visa / Master
                </button>
              </div>
            )}

            {/* Sub-mode selector tabs for Cash Out */}
            {(actionType.includes('cash_out') || actionType.includes('Cash Out')) && (
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setCashOutSubMode('agent')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashOutSubMode === 'agent' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Agent Cash Out
                </button>
                <button
                  type="button"
                  onClick={() => setCashOutSubMode('link_bank')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashOutSubMode === 'link_bank' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Linked Bank
                </button>
                <button
                  type="button"
                  onClick={() => setCashOutSubMode('unlink_bank')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${cashOutSubMode === 'unlink_bank' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600'}`}
                >
                  Unlinked / Counter
                </button>
              </div>
            )}

            {/* Dynamic Recipient / Account Inputs */}
            {sendSubMode === 'wallet' && (actionType.includes('transfer') || actionType.includes('Send')) && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-700">Recipient Phone / Wallet ID</label>
                  {isRecipientValid && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Valid Phone
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. 09 791 234 567" 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
                  required
                />

                {!isRecipientValid && (
                  <div className="mt-2 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 font-medium">
                    💡 Enter a valid phone number (at least 8 digits) to reveal verified recipient name & amount.
                  </div>
                )}

                {isRecipientValid && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 animate-fade-in">
                    <span className="text-xs font-medium">Aung Kyaw (Verified Tier 2 Wallet User)</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">Verified</span>
                  </div>
                )}
              </div>
            )}

            {sendSubMode === 'non_wallet' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Receiver Mobile Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 09 250 112 334" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Receiver NRC Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12/DAGANA(N)098212" 
                    value={nrc}
                    onChange={(e) => setNrc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>
            )}

            {sendSubMode === 'other_bank' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Destination Bank</label>
                  <select 
                    value={otherBankName}
                    onChange={(e) => setOtherBankName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-blue-600"
                  >
                    <option value="KBZ Bank">KBZ Bank</option>
                    <option value="AYA Bank">AYA Bank</option>
                    <option value="CB Bank">CB Bank</option>
                    <option value="Yoma Bank">Yoma Bank</option>
                    <option value="AGD Bank">AGD Bank</option>
                    <option value="Apex Bank">Apex Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destination Account Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0012 8821 9921" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>
            )}

            {/* PROGRESSIVE DISCLOSURE: Show Payment Source, Amount & Note ONLY when Recipient is Valid */}
            {isRecipientValid && (
              <div className="space-y-4 animate-fade-in">
                {/* Payment Source Selection with Linked Bank Balances */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source Account / Payment Method</label>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    <div 
                      onClick={() => setSelectedBankId('wallet')}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${selectedBankId === 'wallet' ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Wallet size={18} className="text-blue-600" />
                        <div>
                          <h4 className="font-medium text-xs">Main Wallet Balance</h4>
                          <p className="text-[10px] text-gray-500 font-mono">MMK {user.balance.toLocaleString()}</p>
                        </div>
                      </div>
                      <input type="radio" checked={selectedBankId === 'wallet'} readOnly className="accent-blue-600" />
                    </div>

                    {linkedBanks.map((bank) => (
                      <div 
                        key={bank.id}
                        onClick={() => setSelectedBankId(bank.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer ${selectedBankId === bank.id ? 'bg-blue-50 border-blue-600' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 size={18} className="text-blue-600" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-medium text-xs">{bank.bankName}</h4>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-medium px-1 rounded">Linked</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono">{bank.accountNumber} • MMK {bank.balance.toLocaleString()}</p>
                          </div>
                        </div>
                        <input type="radio" checked={selectedBankId === bank.id} readOnly className="accent-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transfer Amount (MMK)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-medium text-gray-400">MMK</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-14 pr-4 py-2.5 text-base font-semibold text-blue-900 outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    {['10000', '50000', '100000', '500000'].map((amt) => (
                      <button 
                        key={amt} 
                        type="button" 
                        onClick={() => setAmount(amt)}
                        className="flex-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 py-1.5 rounded-lg text-[10px] font-medium text-gray-700 border border-gray-200 active:scale-95 transition-all"
                      >
                        +{Number(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note / Remark with FOCUS SHORTCUTS */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">Note / Remark (Optional)</label>
                    {isNoteFocused && <span className="text-[10px] font-medium text-blue-600">Select shortcut below</span>}
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. Dinner share, rent payment..." 
                    value={note}
                    onFocus={() => setIsNoteFocused(true)}
                    onBlur={() => setTimeout(() => setIsNoteFocused(false), 200)}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />

                  {/* FOCUS SHORTCUTS UNDER REMARK INPUT */}
                  {(isNoteFocused || note.length > 0) && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-xl border border-gray-200 animate-fade-in">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 px-1">Quick Remark Shortcuts</p>
                      <div className="flex flex-wrap gap-1">
                        {noteShortcuts.map((sc) => (
                          <button
                            key={sc}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleAddNoteShortcut(sc);
                            }}
                            className="px-2 py-1 bg-white hover:bg-blue-50 text-gray-800 hover:text-blue-700 font-medium text-[10px] rounded-lg border border-gray-200 shadow-2xs active:scale-95"
                          >
                            {sc}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl text-xs shadow-md active:scale-95 transition-transform mt-2"
                >
                  Continue to Confirmation
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: CONFIRMATION BREAKDOWN */}
        {step === 'confirm' && (
          <div className="p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <span className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Total Payment Amount</span>
              <h2 className="text-3xl font-semibold text-blue-900 mt-1">MMK {Number(amount).toLocaleString()}</h2>
              <span className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                <ShieldCheck size={14} /> Zero Processing Fee
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-900">{getHeaderTitle()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Source Account</span>
                <span className="font-medium text-blue-700">
                  {selectedBank ? `${selectedBank.bankName} (MMK ${selectedBank.balance.toLocaleString()})` : 'Main Wallet Balance'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Beneficiary / Info</span>
                <span className="font-medium text-gray-900">{recipient || 'Wallet Account'}</span>
              </div>

              {note && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Remark</span>
                  <span className="font-semibold text-gray-800">{note}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <Lock size={16} className="shrink-0 text-amber-600" />
              <span>Biometric / PIN required to authenticate this MMK transaction.</span>
            </div>

            <button 
              onClick={() => setIsPinOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Confirm & Enter 6-Digit PIN
            </button>
          </div>
        )}

        {/* STEP 3: RECEIPT */}
        {step === 'receipt' && (
          <div className="p-5 text-center space-y-4">
            <CheckCircle2 size={52} className="mx-auto text-emerald-600" />
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Transaction Successful</span>
              <h2 className="text-2xl font-semibold text-gray-900 mt-1">MMK {Number(amount).toLocaleString()}</h2>
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Reference No</span>
                <div className="flex items-center gap-1 font-mono font-medium text-blue-700">
                  <span>{refNo}</span>
                  <button onClick={handleCopyRef} className="text-blue-600"><Copy size={12} /></button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span className="text-gray-500">Paid Via</span>
                <span className="font-medium text-gray-800">{selectedBank ? selectedBank.bankName : 'Main Wallet'}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-emerald-600 uppercase">Completed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => alert('Receipt saved to device gallery!')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Download size={14} />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Share receipt via Viber / Telegram')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl text-xs shadow-xs"
            >
              Back to Wallet Dashboard
            </button>
          </div>
        )}

      </div>

      <PinBottomSheet
        isOpen={isPinOpen}
        amount={Number(amount) || 0}
        recipientName={recipient || 'Beneficiary'}
        onClose={() => setIsPinOpen(false)}
        onSuccess={() => {
          setIsPinOpen(false);
          handleConfirmAndPay();
        }}
      />
    </div>
  );
}
