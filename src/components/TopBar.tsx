import React from 'react';
import { Bell, Search } from 'lucide-react';
import { User, NotificationMsg } from '../types';

interface TopBarProps {
  user: User;
  notifications: NotificationMsg[];
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
}

export function TopBar({ user, notifications, onOpenProfile, onOpenNotifications }: TopBarProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="flex items-center justify-between px-4 pt-4 pb-3 bg-white text-slate-900 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenProfile}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200" 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-slate-900 leading-tight tracking-tight">{user.name}</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.2 rounded border border-amber-200">
                {user.tier}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{user.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95">
            <Search size={18} />
          </button>
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-colors active:scale-95"
            onClick={onOpenNotifications}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>
    </>
  );
}

