import React from 'react';
import { TopBar } from '../components/TopBar';
import { LoyaltyCard } from '../components/LoyaltyCard';
import { QuickActions } from '../components/QuickActions';
import { ServicesGrid } from '../components/ServicesGrid';
import { FloatingFavorites } from '../components/FloatingFavorites';
import { User, Service, NotificationMsg, BankAccount, Beneficiary } from '../types';
import { Tag, ArrowRight, Building2, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  user: User;
  services: Service[];
  notifications: NotificationMsg[];
  bankAccounts: BankAccount[];
  beneficiaries: Beneficiary[];
  onRequestTransaction: (type: string) => void;
  onOpenAllServices: () => void;
  onOpenBanks: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenManageBeneficiaries: () => void;
  onSelectBeneficiaryForTransfer: (beneficiary: Beneficiary) => void;
}

export function HomeView({
  user,
  services,
  notifications,
  bankAccounts,
  beneficiaries,
  onRequestTransaction,
  onOpenAllServices,
  onOpenBanks,
  onOpenProfile,
  onOpenNotifications,
  onOpenManageBeneficiaries,
  onSelectBeneficiaryForTransfer,
}: HomeViewProps) {
  const linkedBanks = bankAccounts.filter((b) => b.isLinked);

  return (
    <div className="pb-24 bg-white min-h-screen relative">
      {/* Top Header & Loyalty Display */}
      <TopBar 
        user={user} 
        notifications={notifications} 
        onOpenProfile={onOpenProfile} 
        onOpenNotifications={onOpenNotifications}
      />
      <LoyaltyCard
        user={user}
        linkedBanks={bankAccounts}
        onOpenBanks={onOpenBanks}
        onOpenLoyalty={onOpenProfile}
      />

      {/* 4 Quick Features - Solid Blue Squircles (One UI style) */}
      <QuickActions onRequestTransaction={onRequestTransaction} />

      {/* Services Grid without Border Box */}
      <ServicesGrid
        services={services}
        onRequestTransaction={onRequestTransaction}
        onOpenAllServices={onOpenAllServices}
      />

      {/* Connected Bank Accounts Quick Access Card */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium text-slate-900 uppercase tracking-wider">Direct Bank Accounts</span>
          <button
            onClick={onOpenBanks}
            className="text-xs font-medium text-blue-600 flex items-center gap-0.5 hover:underline"
          >
            Manage Banks ({linkedBanks.length}) <ChevronRight size={14} />
          </button>
        </div>

        {linkedBanks.length > 0 ? (
          <div className="space-y-2">
            {linkedBanks.map((bank) => (
              <div
                key={bank.id}
                onClick={onOpenBanks}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-50 shadow-2xs transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-medium text-xs shadow-2xs shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-900">{bank.bankName}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-1.5 py-0.2 rounded-full border border-emerald-200">
                        Linked Direct
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono font-semibold mt-0.5">
                      Acc No: {bank.accountNumber}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Balance</span>
                  <span className="text-xs font-semibold text-slate-900 font-mono">
                    MMK {bank.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={onOpenBanks}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-medium text-xs border border-blue-100">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-900">Connect Bank Account</span>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Link your bank for 0-fee direct transfers</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
        )}
      </div>

      {/* Special Offer Banner */}
      <div className="px-4 mb-4">
        <div className="bg-slate-900 rounded-2xl p-4 text-white flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-1 text-amber-400 font-medium mb-1 text-[11px] uppercase tracking-wider">
              <Tag size={13} /> Special Offer
            </div>
            <h3 className="font-medium text-sm leading-tight mb-1">Zero Fee Instant Transfers</h3>
            <p className="text-[11px] text-slate-300 mb-2.5">Enjoy free transfers across all KBZ and AYA accounts this month</p>
            <button
              onClick={() => onRequestTransaction('Send Money')}
              className="text-xs font-medium text-slate-900 bg-white px-3.5 py-1.5 rounded-xl active:scale-95 transition-transform"
            >
              Transfer Now
            </button>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-white/10">
            💎
          </div>
        </div>
      </div>

      {/* Top Merchant Pay */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-xs font-medium text-slate-900 uppercase tracking-wider">Top Merchant Pay</span>
          <button
            onClick={() => onRequestTransaction('Merchant Pay')}
            className="text-xs font-medium text-blue-600 flex items-center gap-0.5 hover:underline"
          >
            See All <ArrowRight size={13} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x hide-scrollbar">
          {[
            { name: 'City Mart', discount: '5% Points', icon: '🛒' },
            { name: 'Starbucks', discount: '10% Back', icon: '☕️' },
            { name: 'Grab Food', discount: 'Free Ship', icon: '🍔' },
            { name: 'Ocean Super', discount: '2,000 MMK', icon: '🏬' },
          ].map((m, i) => (
            <button
              key={i}
              onClick={() => onRequestTransaction(`Merchant: ${m.name}`)}
              className="min-w-[115px] bg-white rounded-2xl p-3 border border-gray-100 snap-start text-left hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl mb-2 flex items-center justify-center text-base border border-slate-100">
                {m.icon}
              </div>
              <h4 className="font-medium text-slate-900 text-xs truncate">{m.name}</h4>
              <p className="text-[10px] font-medium text-blue-600 mt-0.5">{m.discount}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Favorites Action Drawer */}
      <FloatingFavorites
        beneficiaries={beneficiaries}
        services={services}
        onSelectBeneficiary={onSelectBeneficiaryForTransfer}
        onSelectService={(serviceName) => onRequestTransaction(serviceName)}
        onOpenManageBeneficiaries={onOpenManageBeneficiaries}
      />
    </div>
  );
}

