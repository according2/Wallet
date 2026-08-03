import React, { useState } from 'react';
import { Star, Users, Zap, X, ChevronRight, Bookmark, Search, ArrowLeft, Send, Sparkles, Filter, Plus } from 'lucide-react';
import { Beneficiary, Service } from '../types';

interface FloatingFavoritesProps {
  beneficiaries: Beneficiary[];
  services: Service[];
  onSelectBeneficiary: (beneficiary: Beneficiary) => void;
  onSelectService: (serviceName: string) => void;
  onOpenManageBeneficiaries: () => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export function FloatingFavorites({
  beneficiaries,
  services,
  onSelectBeneficiary,
  onSelectService,
  onOpenManageBeneficiaries,
  isOpenExternal,
  onCloseExternal,
}: FloatingFavoritesProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'people'>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'payment' | 'financial' | 'bills' | 'lifestyle'>('all');

  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;

  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    } else {
      setInternalOpen(false);
    }
  };

  // Filter Services
  const filteredServices = services.filter((s) => {
    if (s.name === 'More') return false;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter Beneficiaries
  const filteredPeople = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <>
      {/* Floating Action Launch Pill */}
      {isOpenExternal === undefined && (
        <div className="fixed bottom-20 left-4 z-30">
          <button
            onClick={() => setInternalOpen(true)}
            className="h-12 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center gap-2 transition-all active:scale-95 border-2 border-white font-semibold text-xs"
            title="Open Full Screen Quick Features & Favorites"
          >
            <Zap size={18} className="fill-amber-300 text-amber-300" />
            <span>Quick Features & Favs</span>
          </button>
        </div>
      )}

      {/* FULL SCREEN MODAL / VIEW */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in overflow-hidden">
          {/* Full Screen Top Header Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Quick Features & Favorites</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                    Full Screen
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Instant access to payments, services, and saved contacts
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 shrink-0">
            <div className="relative max-w-2xl mx-auto">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search services, billers, or contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 outline-none focus:border-blue-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Segmented Control Tabs */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 shrink-0">
            <div className="max-w-2xl mx-auto flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap size={15} />
                <span>Quick Features ({services.length - 1})</span>
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'people'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={15} />
                <span>Saved Contacts ({beneficiaries.length})</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 max-w-2xl mx-auto w-full">
            {/* TAB 1: QUICK FEATURES & SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                {/* Category Pill Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {[
                    { id: 'all', label: 'All Services' },
                    { id: 'payment', label: 'Payments & Transfers' },
                    { id: 'financial', label: 'Financial & Loans' },
                    { id: 'bills', label: 'Utilities & Bills' },
                    { id: 'lifestyle', label: 'Lifestyle & Topups' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                        categoryFilter === cat.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Service Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        onSelectService(service.name);
                        handleClose();
                      }}
                      className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-95"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-11 h-11 rounded-2xl ${service.color || 'bg-blue-600 text-white'} flex items-center justify-center font-medium shadow-2xs group-hover:scale-105 transition-transform`}>
                          <Zap size={20} />
                        </div>
                        {service.isFavourite && (
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                          {service.category || 'Service'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-blue-600">
                        <span>Launch</span>
                        <ChevronRight size={12} />
                      </div>
                    </button>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                    <Zap size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-medium text-slate-700">No features found for "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting search query or filter tags</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAVED CONTACTS & BENEFICIARIES */}
            {activeTab === 'people' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">Saved Beneficiaries</h3>
                    <p className="text-[10px] text-slate-500">Fast 1-tap wallet transfers</p>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      onOpenManageBeneficiaries();
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1 shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>Manage List</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredPeople.map((person) => (
                    <div
                      key={person.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={person.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={person.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-slate-900">{person.name}</h4>
                            {person.bankName && (
                              <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                                {person.bankName}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{person.phone}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectBeneficiary(person);
                          handleClose();
                        }}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-2xs flex items-center gap-1 active:scale-95 transition-all shrink-0"
                      >
                        <Send size={13} />
                        <span>Send</span>
                      </button>
                    </div>
                  ))}

                  {filteredPeople.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                      <Users size={36} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-medium text-slate-700">No contacts found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
