import React, { useState } from 'react';
import { Beneficiary } from '../types';
import { ArrowLeft, Plus, Edit2, Trash2, Search, AlertTriangle, UserCheck, Star } from 'lucide-react';

interface BeneficiariesViewProps {
  beneficiaries: Beneficiary[];
  onBack: () => void;
  onAddBeneficiary: (beneficiary: Omit<Beneficiary, 'id'>) => void;
  onEditBeneficiary: (beneficiary: Beneficiary) => void;
  onDeleteBeneficiary: (id: string) => void;
  onSelectBeneficiaryForTransfer?: (beneficiary: Beneficiary) => void;
}

export function BeneficiariesView({
  beneficiaries,
  onBack,
  onAddBeneficiary,
  onEditBeneficiary,
  onDeleteBeneficiary,
  onSelectBeneficiaryForTransfer,
}: BeneficiariesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'wallet' | 'bank'>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bankName: 'Shwe Bank',
    accountNo: '',
    nrc: '',
    category: 'wallet' as 'wallet' | 'bank' | 'non_wallet',
    isFavorite: true,
  });

  const filtered = beneficiaries.filter((b) => {
    const matchesTab = activeTab === 'all' || b.category === activeTab;
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      (b.accountNo && b.accountNo.includes(searchTerm));
    return matchesTab && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingBeneficiary(null);
    setFormData({
      name: '',
      phone: '',
      bankName: 'Shwe Bank',
      accountNo: '',
      nrc: '',
      category: 'wallet',
      isFavorite: true,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (b: Beneficiary) => {
    setEditingBeneficiary(b);
    setFormData({
      name: b.name,
      phone: b.phone,
      bankName: b.bankName || 'Shwe Bank',
      accountNo: b.accountNo || '',
      nrc: b.nrc || '',
      category: b.category,
      isFavorite: b.isFavorite || false,
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingBeneficiary) {
      onEditBeneficiary({
        ...editingBeneficiary,
        ...formData,
      });
    } else {
      onAddBeneficiary({
        ...formData,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=100`,
      });
    }
    setShowAddModal(false);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteBeneficiary(deletingId);
      setDeletingId(null);
    }
  };

  const deletingTarget = beneficiaries.find((b) => b.id === deletingId);

  return (
    <div className="min-h-screen bg-slate-50 max-w-2xl mx-auto pb-28 pt-6 px-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Beneficiaries</h1>
            <p className="text-xs text-slate-500">Manage saved wallet contacts and bank recipients</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>Add New</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, phone or account number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl mb-4">
        {(['all', 'wallet', 'bank'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl capitalize transition-all ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {tab === 'all' ? 'All Saved' : tab === 'wallet' ? 'Wallet Users' : 'Bank Accounts'}
          </button>
        ))}
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xs">
            <UserCheck size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-500">No beneficiaries found</p>
            <p className="text-[11px] text-slate-400 mt-1">Add a recipient to quickly send money in one tap.</p>
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-3.5 border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-colors shadow-xs"
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => onSelectBeneficiaryForTransfer && onSelectBeneficiaryForTransfer(b)}
              >
                <div className="relative">
                  <img
                    src={b.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={b.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-100"
                  />
                  {b.isFavorite && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-[10px] shadow-xs">
                      <Star size={10} className="fill-slate-900" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-medium text-slate-900">{b.name}</h3>
                    <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.2 rounded-full uppercase border border-blue-100">
                      {b.category}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{b.phone}</p>
                  {b.bankName && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      {b.bankName} • {b.accountNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Edit Beneficiary"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeletingId(b.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Beneficiary"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in">
            <h2 className="text-sm font-medium text-slate-900 mb-1">
              {editingBeneficiary ? 'Edit Beneficiary' : 'Add New Beneficiary'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">Save recipient details for quick transfers.</p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-700 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as 'wallet' | 'bank' | 'non_wallet' })
                  }
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="wallet">Wallet Account (MMK Wallet)</option>
                  <option value="bank">Shwe Bank Account Transfer</option>
                  <option value="non_wallet">Non-Wallet Cash Remittance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Su Su Hlaing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 uppercase">Mobile Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09782119922"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>

              {formData.category === 'bank' && (
                <>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 uppercase">Bank Name</label>
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option value="Shwe Bank">Shwe Bank</option>
                      <option value="KBZ Bank">KBZ Bank</option>
                      <option value="AYA Bank">AYA Bank</option>
                      <option value="CB Bank">CB Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 uppercase">Account Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 2001 1002 9981"
                      value={formData.accountNo}
                      onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-medium rounded-xl shadow-xs hover:bg-blue-700"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MISTAKE DELETE PREVENT CONFIRMATION DIALOG */}
      {deletingId && deletingTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-medium text-sm text-slate-900 mb-1">Remove Beneficiary?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to remove <span className="font-medium text-slate-900">{deletingTarget.name}</span> ({deletingTarget.phone}) from your saved beneficiaries list?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
              >
                Keep Saved
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-2xl transition-colors shadow-xs"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
