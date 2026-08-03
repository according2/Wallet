import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, ArrowUpRight, ArrowDownLeft, X, FileText, CheckCircle2, Calendar, Filter, Copy, Share2, Download, RefreshCw } from 'lucide-react';

interface HistoryViewProps {
  transactions: Transaction[];
}

export function HistoryView({ transactions }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date Range Filter State
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Type Filter State
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Selected Transaction for Detailed Receipt Modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  // Available Transaction Types
  const availableTypes = [
    'all',
    'Send Money',
    'Cash In',
    'Cash Out',
    'Bill Payment',
    'Merchant Pay',
    'Mobile TopUp',
  ];

  // Helper date logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredTx = transactions.filter((tx) => {
    // 1. Search filter
    const matchesSearch =
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.recipient && tx.recipient.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.referenceNo && tx.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Type filter
    if (typeFilter !== 'all') {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const txTypeNorm = normalize(tx.type);
      const filterNorm = normalize(typeFilter);
      if (!txTypeNorm.includes(filterNorm) && !filterNorm.includes(txTypeNorm)) {
        return false;
      }
    }

    // 3. Date Range filter
    const txDateStr = tx.date.split(' ')[0] || tx.date;
    const txDateObj = new Date(txDateStr);

    if (dateRange === 'today') {
      return txDateStr === todayStr;
    } else if (dateRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return txDateObj >= oneWeekAgo;
    } else if (dateRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(now.getDate() - 30);
      return txDateObj >= oneMonthAgo;
    } else if (dateRange === 'custom') {
      if (customStartDate && new Date(txDateStr) < new Date(customStartDate)) return false;
      if (customEndDate && new Date(txDateStr) > new Date(customEndDate)) return false;
    }

    return true;
  });

  const handleCopyRef = (refNo: string) => {
    navigator.clipboard.writeText(refNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-28 pt-6 px-4 min-h-screen bg-slate-50 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Transaction History</h1>
          <span className="text-xs text-slate-500 font-medium bg-slate-200/80 px-2.5 py-1 rounded-full">
            {filteredTx.length} Entries
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Complete log of deposits, payouts, transfers, and bill payments</p>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, reference no, or payment type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 shadow-xs"
          />
        </div>

        {/* FILTER CONTROL BAR: DATE RANGE & TRANSACTION TYPE */}
        <div className="space-y-2.5 bg-white p-3.5 rounded-3xl border border-slate-100 shadow-xs">
          {/* Date Range Selector Pills */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar size={13} className="text-amber-600" />
              <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                Date Range Filter
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDateRange(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    dateRange === item.id
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs if Custom is selected */}
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-medium text-slate-500 uppercase">From Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-500 uppercase">To Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full mt-0.5 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Transaction Type Selector Pills */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Filter size={13} className="text-blue-600" />
              <span className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                Transaction Type
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {availableTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    typeFilter === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'all' ? 'All Types' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS LIST */}
      <div>
        {filteredTx.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <FileText size={40} className="mx-auto text-slate-300 mb-2" />
            <h3 className="font-medium text-sm text-slate-700">No Transactions Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your date range or transaction type filter.</p>
            <button
              onClick={() => {
                setDateRange('all');
                setTypeFilter('all');
                setSearchTerm('');
              }}
              className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-100 shadow-xs">
            {filteredTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-medium ${
                      isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {isPositive ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-medium text-xs text-slate-900">{tx.type}</h3>
                        <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {tx.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                        {tx.merchant || tx.recipient || tx.subType || 'Wallet Transaction'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{tx.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold text-xs ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isPositive ? '+' : '-'}MMK {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.referenceNo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-slate-100 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                {selectedTx.status.toUpperCase()} • TIER 2 VERIFIED
              </span>
              <h2 className="text-2xl font-semibold text-slate-900 mt-2">
                {selectedTx.amount > 0 ? '+' : '-'}MMK {Math.abs(selectedTx.amount).toLocaleString()}
              </h2>
              <p className="text-xs font-medium text-blue-600 mt-0.5">{selectedTx.type}</p>
            </div>

            {/* Receipt Breakdown Details */}
            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-2.5 mb-5 border border-slate-100">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Reference No</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-medium text-slate-900">{selectedTx.referenceNo}</span>
                  <button
                    onClick={() => handleCopyRef(selectedTx.referenceNo)}
                    className="text-blue-600 hover:text-blue-800 p-0.5"
                    title="Copy Reference"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Recipient / Merchant</span>
                <span className="font-medium text-slate-900">
                  {selectedTx.merchant || selectedTx.recipient || 'Main Wallet'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Date & Timestamp</span>
                <span className="font-semibold text-slate-800">{selectedTx.date}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Transaction Fee</span>
                <span className="font-medium text-emerald-600">
                  {selectedTx.fee ? `MMK ${selectedTx.fee}` : '0 MMK (Free)'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Payment Status</span>
                <span className="font-medium text-emerald-600 uppercase">{selectedTx.status}</span>
              </div>
            </div>

            {copied && (
              <p className="text-center text-xs font-medium text-emerald-600 mb-3 animate-pulse">
                Reference number copied to clipboard!
              </p>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => alert('Receipt image saved to gallery!')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                <span>Save Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Share receipt via Viber / Telegram / Messenger')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-2xl text-xs uppercase"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
