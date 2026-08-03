import React, { useState } from 'react';
import { NearbyItem, NearbyNews } from '../types';
import { nearbyItemsData, nearbyNewsData } from '../data';
import { 
  Search, MapPin, Star, Navigation, Phone, QrCode, Sparkles, Filter, Map, List, 
  ChevronRight, ArrowUpRight, CheckCircle2, Clock, ShieldCheck, X, Copy, MessageCircle, 
  Tag, ExternalLink, Share2, AlertCircle, Building2, Store, Banknote
} from 'lucide-react';

interface NearbyViewProps {
  items?: NearbyItem[];
  news?: NearbyNews[];
  onRequestTransaction: (actionKey: string) => void;
}

export function NearbyView({ 
  items = nearbyItemsData, 
  news = nearbyNewsData,
  onRequestTransaction 
}: NearbyViewProps) {
  const [activeCategory, setActiveCategory] = useState<'merchant' | 'agent'>('merchant');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters & Sorting
  const [filterSuperOnly, setFilterSuperOnly] = useState(false);
  const [filterPromoOnly, setFilterPromoOnly] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  // Modal states
  const [selectedItem, setSelectedItem] = useState<NearbyItem | null>(null);
  const [activeNews, setActiveNews] = useState<NearbyNews | null>(null);
  const [contactToast, setContactToast] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<NearbyItem | null>(null);
  const [mapSelectedPin, setMapSelectedPin] = useState<NearbyItem | null>(null);

  // Areas list
  const areaOptions = ['all', 'Kamayut Township', 'Kyauktada Township', 'Bahan Township', 'Yankin Township'];

  // Filtering Logic
  const filteredItems = items
    .filter((item) => item.type === activeCategory)
    .filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesArea = item.area.toLowerCase().includes(query);
        const matchesCategory = item.subCategory.toLowerCase().includes(query);
        if (!matchesName && !matchesArea && !matchesCategory) return false;
      }
      if (filterSuperOnly && !item.isSuper) return false;
      if (filterPromoOnly && !item.isPromo) return false;
      if (filterMinRating && item.rating < filterMinRating) return false;
      if (selectedArea !== 'all' && item.area !== selectedArea) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleCopyText = (text: string, msg: string) => {
    navigator.clipboard?.writeText(text);
    setContactToast(msg);
    setTimeout(() => setContactToast(null), 2500);
  };

  return (
    <div className="pb-28 pt-6 px-4 min-h-screen bg-slate-50 max-w-2xl mx-auto relative">
      {/* Toast Notification */}
      {contactToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{contactToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Geolocation Hub</span>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Near By Outlets</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <MapPin size={12} className="text-blue-600 animate-pulse" />
            <span>Yangon Downtown</span>
          </div>
        </div>

        {/* Category Switcher: Merchant vs Agent */}
        <div className="grid grid-cols-2 bg-slate-200/80 p-1 rounded-2xl mb-3">
          <button
            onClick={() => setActiveCategory('merchant')}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'merchant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store size={16} className={activeCategory === 'merchant' ? 'text-blue-600' : 'text-slate-500'} />
            <span>Merchant Outlets ({items.filter(i => i.type === 'merchant').length})</span>
          </button>
          
          <button
            onClick={() => setActiveCategory('agent')}
            className={`py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'agent'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Banknote size={16} className={activeCategory === 'agent' ? 'text-emerald-600' : 'text-slate-500'} />
            <span>Authorized Agents ({items.filter(i => i.type === 'agent').length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeCategory === 'merchant' ? 'Search merchants, stores, dining...' : 'Search agent locations, cash hubs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        {/* Filters & Sorting Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {/* Super Filter */}
          <button
            onClick={() => setFilterSuperOnly(!filterSuperOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-1 border ${
              filterSuperOnly
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={13} />
            <span>Super {activeCategory === 'agent' ? 'Agent' : 'Merchant'}</span>
          </button>

          {/* Promo Filter */}
          <button
            onClick={() => setFilterPromoOnly(!filterPromoOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-1 border ${
              filterPromoOnly
                ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Tag size={13} />
            <span>Promotions</span>
          </button>

          {/* Ratings Filter */}
          <button
            onClick={() => setFilterMinRating(filterMinRating === 4.8 ? null : 4.8)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-1 border ${
              filterMinRating === 4.8
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>4.8+ Stars</span>
          </button>

          {/* Area Filter Selector */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 bg-white border border-slate-200 text-slate-700 outline-none"
          >
            <option value="all">All Areas</option>
            {areaOptions.filter(a => a !== 'all').map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Sort By Toggle */}
          <button
            onClick={() => setSortBy(sortBy === 'distance' ? 'rating' : 'distance')}
            className="px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 bg-slate-200 text-slate-800 flex items-center gap-1"
          >
            <span>Sort: {sortBy === 'distance' ? 'Nearest' : 'Top Rated'}</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW MODE: LIST VS MAP */}
      {viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-3.5 mb-8">
          {filteredItems.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
              <AlertCircle size={36} className="mx-auto text-slate-300 mb-2" />
              <h3 className="font-medium text-sm text-slate-800">No outlets found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filters or search terms.</p>

              <button
                onClick={() => {
                  setFilterSuperOnly(false);
                  setFilterPromoOnly(false);
                  setFilterMinRating(null);
                  setSelectedArea('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row gap-4 relative overflow-hidden"
              >
                {/* Thumbnail Image */}
                <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isSuper && (
                      <span className="bg-amber-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                        <Sparkles size={10} /> SUPER
                      </span>
                    )}
                    {item.isNew && (
                      <span className="bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                          {item.subCategory}
                        </span>
                        <h3 
                          onClick={() => setSelectedItem(item)}
                          className="font-medium text-sm text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h3>
                      </div>

                      {/* Distance Badge */}
                      <span className="shrink-0 bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-lg border border-blue-100">
                        {item.distanceKm} km
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.address}</p>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.services.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {srv}
                        </span>
                      ))}
                      {item.discountBadge && (
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-medium px-2 py-0.5 rounded-md border border-rose-100">
                          🔥 {item.discountBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Stats & Quick Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                        <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                        <Clock size={11} /> Open
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowQrModal(item)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="Show QR Code"
                      >
                        <QrCode size={15} />
                      </button>

                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* MAP VIEW */
        <div className="bg-slate-900 rounded-3xl p-4 mb-8 text-white relative overflow-hidden h-[450px] flex flex-col justify-between border border-slate-800 shadow-xl">
          {/* Simulated Interactive Map Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Map Grid Roads Overlay Graphic */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" stroke="currentColor">
            <line x1="0" y1="120" x2="100%" y2="120" stroke="white" strokeWidth="3" />
            <line x1="0" y1="280" x2="100%" y2="280" stroke="white" strokeWidth="2" />
            <line x1="140" y1="0" x2="140" y2="100%" stroke="white" strokeWidth="3" />
            <line x1="320" y1="0" x2="320" y2="100%" stroke="white" strokeWidth="2" />
            <circle cx="140" cy="120" r="40" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Map Header Overlay */}
          <div className="relative z-10 flex justify-between items-center bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-400" />
              <span className="text-xs font-medium">Map Radar Mode ({filteredItems.length} locations)</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-md">
              GPS Active
            </span>
          </div>

          {/* Map Pins Container */}
          <div className="relative z-10 flex-1 my-4 relative">
            {filteredItems.map((item, index) => {
              // Calculate pin positions dynamically
              const posX = 15 + (index * 18) % 70;
              const posY = 15 + (index * 22) % 65;
              const isSelected = mapSelectedPin?.id === item.id;

              return (
                <div
                  key={item.id}
                  style={{ top: `${posY}%`, left: `${posX}%` }}
                  onClick={() => setMapSelectedPin(item)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className={`px-2.5 py-1 rounded-full font-medium text-[10px] flex items-center gap-1 shadow-lg border ${
                    item.isSuper 
                      ? 'bg-amber-500 text-slate-900 border-amber-300' 
                      : item.type === 'agent' 
                      ? 'bg-emerald-600 text-white border-emerald-400' 
                      : 'bg-blue-600 text-white border-blue-400'
                  }`}>
                    <MapPin size={11} />
                    <span className="truncate max-w-[80px]">{item.name.split(' ')[0]}</span>
                    <span className="bg-black/30 px-1 rounded font-mono text-[9px]">{item.distanceKm}km</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Selected Pin Preview Card */}
          {mapSelectedPin && (
            <div className="relative z-20 bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <img src={mapSelectedPin.image} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-medium text-xs text-white line-clamp-1">{mapSelectedPin.name}</h4>
                  <p className="text-[11px] text-slate-400">{mapSelectedPin.area} • {mapSelectedPin.distanceKm} km</p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                    <Star size={11} className="fill-amber-400" />
                    <span>{mapSelectedPin.rating} rating</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(mapSelectedPin)}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium shrink-0"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* FLOATING MAP / LIST TOGGLE BUTTON */}
      <button
        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        className="fixed bottom-20 right-6 z-40 bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 font-medium text-xs flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all"
      >
        {viewMode === 'list' ? (
          <>
            <Map size={18} className="text-blue-400" />
            <span>Map View</span>
          </>
        ) : (
          <>
            <List size={18} className="text-emerald-400" />
            <span>List View</span>
          </>
        )}
      </button>

      {/* NEWS & UPDATES SECTION BELOW MERCHANTS */}
      <div className="mt-8 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            <h2 className="font-semibold text-sm text-slate-900 tracking-tight">Merchant & Agent News</h2>
          </div>
          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Updated Daily</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {news.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveNews(item)}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all flex items-center gap-3"
            >
              <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{item.date}</span>
                </div>
                <h4 className="font-medium text-xs text-slate-900 line-clamp-1 leading-snug">{item.title}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-fade-in">
            {/* Header Image */}
            <div className="h-44 bg-slate-100 relative shrink-0">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-xs hover:bg-black/80"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {selectedItem.isSuper && (
                  <span className="bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Sparkles size={12} /> SUPER {selectedItem.type.toUpperCase()}
                  </span>
                )}
                {selectedItem.discountBadge && (
                  <span className="bg-rose-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-md">
                    🔥 {selectedItem.discountBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <span className="text-[11px] font-medium text-blue-600 uppercase tracking-widest">
                  {selectedItem.subCategory} • {selectedItem.area}
                </span>
                <h2 className="text-lg font-semibold text-slate-900 mt-0.5 leading-tight">{selectedItem.name}</h2>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{selectedItem.rating}</span>
                    <span className="text-slate-400">({selectedItem.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <Clock size={13} /> {selectedItem.openHours}
                  </span>
                </div>
              </div>

              {/* Info Rows */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Address</span>
                  <span className="font-medium text-slate-900 text-right max-w-[220px] truncate">{selectedItem.address}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Contact Phone</span>
                  <span className="font-mono font-medium text-blue-600">{selectedItem.phone}</span>
                </div>

                {selectedItem.cashLimitMMK && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Daily Cash Liquidity Pool</span>
                    <span className="font-mono font-semibold text-emerald-600">MMK {selectedItem.cashLimitMMK.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Distance from you</span>
                  <span className="font-mono font-medium text-slate-900">{selectedItem.distanceKm} km</span>
                </div>
              </div>

              {/* Available Services */}
              <div>
                <h4 className="text-xs font-medium text-slate-900 uppercase tracking-wide mb-2">Services & Operations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.services.map((srv, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-xl border border-blue-100 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-blue-600" />
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* QR Preview Mini Card */}
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <QrCode size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-xs">{selectedItem.type === 'merchant' ? 'Direct Merchant QR' : 'Agent Cash-In QR'}</h4>
                    <p className="text-[10px] text-slate-400">Scan to pay or complete transaction</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowQrModal(selectedItem)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-medium"
                >
                  Show QR
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCopyText(selectedItem.phone, `Calling ${selectedItem.phone}...`)}
                className="py-3 px-2 bg-white text-slate-800 rounded-2xl border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100"
              >
                <Phone size={15} className="text-blue-600" />
                <span>Contact</span>
              </button>

              <button
                onClick={() => handleCopyText(selectedItem.address, 'Address copied to clipboard!')}
                className="py-3 px-2 bg-white text-slate-800 rounded-2xl border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-100"
              >
                <Navigation size={15} className="text-emerald-600" />
                <span>Directions</span>
              </button>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  onRequestTransaction(selectedItem.type === 'merchant' ? 'Merchant Pay' : 'Agent Cash In');
                }}
                className="py-3 px-2 bg-blue-600 text-white rounded-2xl text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-blue-700 shadow-sm"
              >
                <Banknote size={15} />
                <span>{selectedItem.type === 'merchant' ? 'Pay Now' : 'Cash In'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowQrModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">
              {showQrModal.type === 'merchant' ? 'Official Merchant QR' : 'Authorized Agent QR'}
            </span>
            <h3 className="font-semibold text-base text-slate-900 mt-1">{showQrModal.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{showQrModal.address}</p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl inline-block border border-slate-200 shadow-inner">
              <img src={showQrModal.qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
            </div>

            <button
              onClick={() => handleCopyText(showQrModal.id, 'QR Code ID copied!')}
              className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Copy size={14} /> Copy QR Code Reference
            </button>
          </div>
        </div>
      )}

      {/* NEWS ANNOUNCEMENT MODAL */}
      {activeNews && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative p-5 animate-fade-in">
            <button
              onClick={() => setActiveNews(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <img src={activeNews.imageUrl} alt={activeNews.title} className="w-full h-40 object-cover rounded-2xl mb-4" />

            <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              {activeNews.category} • {activeNews.date}
            </span>

            <h3 className="font-semibold text-base text-slate-900 mt-2">{activeNews.title}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeNews.summary}</p>

            <button
              onClick={() => {
                setActiveNews(null);
                onRequestTransaction('Special Promo');
              }}
              className="w-full mt-5 bg-blue-600 text-white font-medium py-3 rounded-xl text-xs"
            >
              Claim Special Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
