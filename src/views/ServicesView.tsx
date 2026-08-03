import React, { useState } from 'react';
import { Service } from '../types';
import * as Icons from 'lucide-react';
import { Search, ChevronRight } from 'lucide-react';

interface ServicesViewProps {
  services: Service[];
  onRequestTransaction: (type: string) => void;
  onOpenBanks?: () => void;
}

export function ServicesView({ services, onRequestTransaction, onOpenBanks }: ServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { id: 'transfer', name: 'Transfer & Remittance' },
    { id: 'bills', name: 'Bills & Utilities' },
    { id: 'topup', name: 'Mobile & Reload' },
    { id: 'finance', name: 'Cash & Finance' },
    { id: 'lifestyle', name: 'Lifestyle & Tickets' },
  ];

  return (
    <div className="pb-24 pt-10 px-4 min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Search Header */}
      <div className="mb-4">
        <h1 className="text-xl font-medium text-gray-900 tracking-tight mb-2">All Services & Features</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search service, biller, top-up..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2.5 rounded-2xl border border-gray-100 text-xs font-semibold outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Linked Banks Banner Shortcut */}
      <div 
        onClick={onOpenBanks}
        className="bg-blue-600 text-white rounded-2xl p-4 mb-4 flex items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-medium text-lg border border-white/10">
            🏦
          </div>
          <div>
            <h4 className="font-medium text-xs">Linked Bank Accounts</h4>
            <p className="text-[11px] text-blue-200">Manage KBZ, AYA, CB & MPU cards</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-blue-200" />
      </div>

      {/* Categorized List */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catServices = filteredServices.filter(s => s.category === cat.id && s.name !== 'More');
          if (catServices.length === 0) return null;

          return (
            <div key={cat.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3 px-0.5 border-b border-gray-100 pb-2">
                {cat.name}
              </h3>

              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {catServices.map((service) => {
                  // @ts-ignore
                  const IconComponent = Icons[service.icon] || Icons.Zap;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onRequestTransaction(service.name)}
                      className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-center"
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${service.color}`}>
                        <IconComponent size={20} strokeWidth={2} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 leading-tight line-clamp-2">
                        {service.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
