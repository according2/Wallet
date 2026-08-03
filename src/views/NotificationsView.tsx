import React, { useState } from 'react';
import { NotificationMsg } from '../types';
import { ArrowLeft, Bell, CheckCheck, Trash2, Tag, ShieldCheck, ArrowDownLeft, ArrowUpRight, Search, X, Info } from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationMsg[];
  onBack: () => void;
  onClearAll?: () => void;
}

export function NotificationsView({ notifications, onBack, onClearAll }: NotificationsViewProps) {
  const [activeGroup, setActiveGroup] = useState<'transaction' | 'others'>('transaction');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<NotificationMsg[]>(notifications);
  const [selectedNotif, setSelectedNotif] = useState<NotificationMsg | null>(null);

  const handleMarkAllRead = () => {
    setItems(items.map(n => ({ ...n, read: true })));
  };

  const handleRemoveNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter(n => n.id !== id));
  };

  const filtered = items.filter((n) => {
    // 2 Button Groups filter
    const matchesGroup = activeGroup === 'transaction' 
      ? n.type === 'transaction'
      : (n.type === 'offer' || n.type === 'system' || n.type !== 'transaction');
    
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGroup && matchesSearch;
  });

  const unreadTxCount = items.filter(n => !n.read && n.type === 'transaction').length;
  const unreadOthersCount = items.filter(n => !n.read && n.type !== 'transaction').length;

  return (
    <div className="min-h-screen bg-slate-50 max-w-2xl mx-auto pb-28 pt-6 px-4 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Notifications Center</h1>
            <p className="text-xs text-slate-500">Real-time wallet alerts & official announcements</p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-2xl flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck size={16} />
          <span className="hidden sm:inline">Mark All Read</span>
        </button>
      </div>

      {/* 2 BUTTON GROUPS: Transaction Alerts vs Others (System & Promo Updates) */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-4 shadow-inner">
        <button
          onClick={() => setActiveGroup('transaction')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeGroup === 'transaction'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell size={15} />
          <span>Transaction Alerts</span>
          {unreadTxCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-medium px-2 py-0.2 rounded-full">
              {unreadTxCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveGroup('others')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeGroup === 'others'
              ? 'bg-slate-900 text-amber-400 shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag size={15} />
          <span>Others (Promos & System)</span>
          {unreadOthersCount > 0 && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-medium px-2 py-0.2 rounded-full">
              {unreadOthersCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Field */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder={`Search in ${activeGroup === 'transaction' ? 'Transaction Alerts' : 'Others'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
            <Bell size={40} className="mx-auto text-slate-300 mb-2" />
            <h3 className="font-medium text-sm text-slate-700">No Notifications Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeGroup === 'transaction' 
                ? 'You have no recent transaction alerts.' 
                : 'No promo or system announcements right now.'}
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelectedNotif(n);
                setItems(items.map(item => item.id === n.id ? { ...item, read: true } : item));
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer relative shadow-xs flex items-start gap-3.5 ${
                !n.read 
                  ? 'bg-white border-blue-200 ring-2 ring-blue-500/10' 
                  : 'bg-white/80 border-slate-100 hover:bg-white'
              }`}
            >
              {/* Icon badge according to group */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-medium ${
                n.type === 'transaction'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : n.type === 'offer'
                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                  : 'bg-blue-50 text-blue-600 border border-blue-100'
              }`}>
                {n.type === 'transaction' ? (
                  <ArrowDownLeft size={20} />
                ) : n.type === 'offer' ? (
                  <Tag size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-xs font-medium ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400">{n.time}</span>
                    <button
                      onClick={(e) => handleRemoveNotif(n.id, e)}
                      className="text-slate-300 hover:text-rose-500 p-1"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>

                {!n.read && (
                  <span className="inline-block mt-2 text-[9px] font-medium bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    NEW UNREAD
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL NOTIFICATION DETAIL MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="text-center pb-4 border-b border-slate-100 mb-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Bell size={24} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                {selectedNotif.type.toUpperCase()} ALERT
              </span>
              <h2 className="text-base font-semibold text-slate-900 mt-1">{selectedNotif.title}</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{selectedNotif.time}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 leading-relaxed mb-6">
              {selectedNotif.message}
            </div>

            <button
              onClick={() => setSelectedNotif(null)}
              className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-2xl text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
