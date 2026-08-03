import React from 'react';
import { Send, QrCode, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface QuickActionsProps {
  onRequestTransaction: (type: string) => void;
}

export function QuickActions({ onRequestTransaction }: QuickActionsProps) {
  const actions = [
    { id: 'transfer_send', label: 'Send Money', icon: Send },
    { id: 'qr_receive', label: 'Receive / QR', icon: QrCode },
    { id: 'cash_in', label: 'Cash In', icon: ArrowDownToLine },
    { id: 'cash_out', label: 'Cash Out', icon: ArrowUpFromLine },
  ];

  return (
    <div className="px-4 mb-6 relative z-20">
      <div className="flex justify-between items-start gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button 
              key={action.id}
              onClick={() => onRequestTransaction(action.id)}
              className="flex flex-col items-center gap-2 flex-1 group active:scale-95 transition-all"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-slate-50 border border-slate-200/80 text-slate-800 flex items-center justify-center transition-all group-hover:bg-slate-100 shadow-none">
                <Icon size={24} strokeWidth={2} className="text-slate-700" />
              </div>
              <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

