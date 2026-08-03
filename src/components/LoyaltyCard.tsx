import React from 'react';
import { User, BankAccount } from '../types';
import { Award, Building2, ChevronRight, Eye, EyeOff, CreditCard } from 'lucide-react';

interface LoyaltyCardProps {
  user: User;
  linkedBanks: BankAccount[];
  onOpenBanks?: () => void;
  onOpenLoyalty?: () => void;
}

export function LoyaltyCard({ user, linkedBanks, onOpenBanks, onOpenLoyalty }: LoyaltyCardProps) {
  const [showBalance, setShowBalance] = React.useState(true);
  const activeLinkedBanks = linkedBanks.filter(b => b.isLinked);

  return (
    <div className="px-4 py-3 bg-white">
      {/* Primary Wallet Balance Card - Apple Pay Flat White Style */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all">
        {/* Ambient Subtle Accent Gradient Glow */}
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-slate-50 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row: Title on Left, Loyalty Pill Badge on Right */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <button 
            onClick={onOpenLoyalty}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-full px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold transition-all shadow-none shrink-0 active:scale-95"
          >
            <Award size={13} className="text-slate-600" />
            <span>{user.tier} • {user.points.toLocaleString()} pts</span>
            <ChevronRight size={13} className="text-slate-400" />
          </button>
          
          <button 
            onClick={() => setShowBalance(!showBalance)} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            title="Toggle Balance Visibility"
          >
            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Main Wallet Balance Display */}
        <div className="mb-4 relative z-10">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
            Wallet Available Balance
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[32px] leading-tight font-semibold tracking-tight text-slate-900">
              {showBalance ? `${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••••'}
            </h2>
            <span className="text-sm font-semibold text-slate-500 uppercase">MMK</span>
          </div>
        </div>

      </div>
    </div>
  );
}

