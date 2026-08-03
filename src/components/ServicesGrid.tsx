import React from 'react';
import { Service } from '../types';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface ServicesGridProps {
  services: Service[];
  onRequestTransaction: (type: string) => void;
  onOpenAllServices: () => void;
}

export function ServicesGrid({ services, onRequestTransaction, onOpenAllServices }: ServicesGridProps) {
  // Get top 7 services + 1 'More' item
  const topServices = services.filter(s => s.isFavourite && s.name !== 'More').slice(0, 7);
  const moreService = services.find(s => s.name === 'More') || {
    id: '8',
    name: 'More',
    category: 'lifestyle',
    icon: 'Grid',
    color: 'bg-slate-100 text-slate-700',
    isFavourite: true,
  };

  const displayGrid = [...topServices, moreService];

  return (
    <div className="px-4 mb-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-medium text-gray-900 tracking-wider uppercase">Quick Services</h3>
        <button 
          onClick={onOpenAllServices}
          className="text-xs font-medium text-blue-600 flex items-center gap-0.5 hover:underline"
        >
          All Services <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-y-4 gap-x-2">
        {displayGrid.map((service) => {
          const isMore = service.name === 'More';
          // @ts-ignore
          const IconComponent = Icons[service.icon] || Icons.Grid;
          
          return (
            <button
              key={service.id}
              onClick={() => {
                if (isMore) {
                  onOpenAllServices();
                } else {
                  onRequestTransaction(service.name);
                }
              }}
              className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl hover:bg-gray-100/80 active:scale-95 transition-all text-center group"
            >
              <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center ${service.color} transition-transform group-hover:scale-105`}>
                <IconComponent size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-medium text-gray-800 leading-tight line-clamp-1">
                {service.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

