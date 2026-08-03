import React from 'react';
import { Home, Clock, QrCode, MapPin, User as UserIcon } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'scan', label: 'Scan & QR', icon: QrCode },
    { id: 'nearby', label: 'Near By', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-40 max-w-2xl mx-auto">
      <div className="flex justify-between items-center h-16 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isScan = tab.id === 'scan';

          if (isScan) {
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white ring-4 ring-gray-50 transition-transform active:scale-95",
                  isActive ? "bg-indigo-700" : "bg-indigo-600"
                )}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <span className={cn("text-[10px] font-semibold mt-1", isActive ? "text-indigo-600" : "text-gray-500")}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors",
                isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              <span className={cn("text-[10px] mt-1 tracking-tight", isActive ? "font-medium text-indigo-600" : "font-medium text-gray-500")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
