import React, { useState } from 'react';
import { User, BankAccount } from '../types';
import { Shield, Award, Building2, ChevronRight, Bell, Lock, HelpCircle, LogOut, CheckCircle2, QrCode, Key, Info, RefreshCw, X, Eye, EyeOff } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  bankAccounts: BankAccount[];
  onOpenBanks: () => void;
  onOpenScan: () => void;
}

export function ProfileView({ user, bankAccounts, onOpenBanks, onOpenScan }: ProfileViewProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bioEnabled, setBioEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Modals state
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [show2FaModal, setShow2FaModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Change Password Form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const tiers: { name: 'Silver' | 'Gold' | 'Platinum' | 'Diamond'; reqPoints: string; perk: string }[] = [
    { name: 'Silver', reqPoints: '0 pts', perk: 'Standard Wallet Access' },
    { name: 'Gold', reqPoints: '5,000 pts', perk: '5% Point Cashback' },
    { name: 'Platinum', reqPoints: '20,000 pts', perk: 'Free Agent Cash Out' },
    { name: 'Diamond', reqPoints: '40,000 pts', perk: 'Zero Fee Shwe Bank Transfers' },
  ];

  const linkedCount = bankAccounts.filter(b => b.isLinked).length;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setShowChangePassModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Password updated successfully!');
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="pb-28 pt-6 px-4 min-h-screen bg-slate-50 max-w-2xl mx-auto relative">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 mb-4 shadow-xs">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-slate-900">{user.name}</h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                {user.tier} Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{user.phone}</p>
            <p className="text-[11px] text-slate-400 font-medium">NRC: {user.nrc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Wallet Balance</span>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">MMK {user.balance.toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Loyalty Points</span>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">{user.points.toLocaleString()} pts</p>
          </div>
        </div>
      </div>

      {/* Tier Progress Dashboard */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 mb-4 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-slate-900 uppercase tracking-wide">Loyalty Tiers & Benefits</span>
          <span className="text-xs text-blue-600 font-medium">{user.points.toLocaleString()} Points</span>
        </div>

        <div className="space-y-2">
          {tiers.map((t) => {
            const isCurrent = user.tier === t.name;
            return (
              <div 
                key={t.name}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  isCurrent ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/60 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-medium text-xs ${
                    isCurrent ? 'bg-amber-500 text-slate-900' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-medium text-slate-900">{t.name} Tier</h4>
                      {isCurrent && <CheckCircle2 size={13} className="text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{t.perk}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{t.reqPoints}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banking & Wallet QR */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-4 divide-y divide-slate-100 shadow-xs">
        <button 
          onClick={onOpenBanks}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Building2 size={20} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">
                {linkedCount > 0 ? bankAccounts.find(b => b.isLinked)?.bankName || 'Linked Bank' : 'Link Bank Account'}
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">
                {linkedCount > 0 ? `Acc No: ${bankAccounts.find(b => b.isLinked)?.accountNumber || '****'}` : 'Connect for 0% fee transfer'}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>

        <button 
          onClick={onOpenScan}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <QrCode size={20} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">My Wallet QR Code</h4>
              <p className="text-[11px] text-slate-500">View personal receive QR code</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </button>
      </div>

      {/* SECURITY & SETTINGS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-4 divide-y divide-slate-100 shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-100">
          <h3 className="text-xs font-medium text-slate-900 uppercase tracking-wider">Account Security & Settings</h3>
        </div>

        {/* Change Password */}
        <button 
          onClick={() => setShowChangePassModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Key size={18} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">Change Wallet Password</h4>
              <p className="text-[11px] text-slate-500">Update login password & PIN</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        {/* 2FA Toggle & Setup */}
        <button 
          onClick={() => setShow2FaModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Shield size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-xs text-slate-900">Two-Factor Authentication (2FA)</h4>
                <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {twoFactorEnabled ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">SMS OTP & Authenticator App</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        {/* Push Notifications Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">Push Notifications</h4>
              <p className="text-[11px] text-slate-500">Instant transfer & offer alerts</p>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={pushEnabled} 
            onChange={(e) => setPushEnabled(e.target.checked)} 
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Biometric Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">Biometric / FaceID Lock</h4>
              <p className="text-[11px] text-slate-500">Unlock app with fingerprint or FaceID</p>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={bioEnabled} 
            onChange={(e) => setBioEnabled(e.target.checked)} 
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Check Version */}
        <button 
          onClick={() => setShowVersionModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Info size={18} />
            </div>
            <div>
              <h4 className="font-medium text-xs text-slate-900">Check App Version</h4>
              <p className="text-[11px] text-slate-500 font-semibold">v3.4.2 (Build 2026.08)</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded-lg">
            Up to Date
          </span>
        </button>
      </div>

      {/* Help & Logout */}
      <div className="space-y-2.5">
        <button className="w-full bg-white p-4 rounded-3xl border border-slate-100 text-xs font-medium text-slate-700 flex items-center justify-between hover:bg-slate-50 shadow-xs">
          <div className="flex items-center gap-3">
            <HelpCircle size={18} className="text-blue-600" />
            <span>Help Center & 24/7 Hotline Support</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        <button className="w-full bg-rose-50 p-4 rounded-3xl border border-rose-100 text-xs font-medium text-rose-600 flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors">
          <LogOut size={16} /> Logout Wallet Session
        </button>
      </div>

      {/* MODAL: CHANGE PASSWORD */}
      {showChangePassModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setShowChangePassModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-amber-100">
                <Key size={24} />
              </div>
              <h3 className="font-semibold text-base text-slate-900">Change Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">Secure your MoMoney wallet account</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPass ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold outline-none focus:border-amber-500"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">New Password</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-blue-600 text-white font-medium rounded-xl"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 2FA CONFIGURATION */}
      {show2FaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center animate-fade-in">
            <button 
              onClick={() => setShow2FaModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <Shield size={24} />
            </div>

            <h3 className="font-semibold text-base text-slate-900">Two-Factor Security</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Two-factor authentication adds an extra layer of protection to your high-value transfers.
            </p>

            <div className="my-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-800">SMS OTP Verification</span>
                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Active (+959791***567)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-800">Authenticator App (Google/Authy)</span>
                <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">Linked</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                setShow2FaModal(false);
                triggerToast(twoFactorEnabled ? '2FA Protection Disabled' : '2FA Protection Enabled!');
              }}
              className={`w-full py-3 rounded-xl text-xs font-medium ${
                twoFactorEnabled ? 'bg-slate-100 text-slate-700' : 'bg-emerald-600 text-white'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA Security' : 'Enable 2FA Security'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CHECK VERSION */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center animate-fade-in">
            <button 
              onClick={() => setShowVersionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <RefreshCw size={24} />
            </div>

            <h3 className="font-semibold text-base text-slate-900">MoMoney App Version</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Version v3.4.2 (Build 20260802)</p>

            <div className="my-4 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 text-emerald-800 text-xs font-medium">
              <CheckCircle2 size={16} />
              <span>You are using the latest version!</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              All banking protocols, security ciphers, and geolocation maps are fully updated.
            </p>

            <button
              onClick={() => setShowVersionModal(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-medium"
            >
              Close Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
