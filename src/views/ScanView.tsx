import React, { useState } from 'react';
import { QrCode, Scan, Download, Copy, Check, Flashlight, Image, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface ScanViewProps {
  user: User;
  onPayMerchant?: (amount: number, merchant: string) => void;
}

export function ScanView({ user, onPayMerchant }: ScanViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'myqr' | 'merchant_qr'>('scan');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [merchantName, setMerchantName] = useState('Marketplace Store');

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between pb-28 pt-6 px-4 max-w-2xl mx-auto animate-fade-in">
      {/* Top Header & Subtabs */}
      <div>
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">QR Code Scanner & Generator</h1>
          <p className="text-xs text-slate-500">Scan merchant QRs or request payments directly</p>
        </div>

        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-5 shadow-inner">
          <button
            onClick={() => setActiveSubTab('scan')}
            className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-all ${activeSubTab === 'scan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveSubTab('myqr')}
            className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-all ${activeSubTab === 'myqr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            My Receive QR
          </button>
          <button
            onClick={() => setActiveSubTab('merchant_qr')}
            className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-all ${activeSubTab === 'merchant_qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Dynamic Merchant
          </button>
        </div>
      </div>

      {/* TAB 1: SCAN MERCHANT QR */}
      {activeSubTab === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 relative">
          <div className="relative w-72 h-72 border-2 border-blue-500/50 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />

            {/* Laser Line */}
            <motion.div 
              animate={{ top: ['5%', '95%', '5%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-3 right-3 h-0.5 bg-blue-400 shadow-[0_0_12px_2px_rgba(96,165,250,0.9)] z-10"
            />

            <Scan size={72} className="text-white/20" />
          </div>

          <p className="text-xs text-slate-600 font-medium mt-6 text-center max-w-xs">
            Point camera at KBZPay, WavePay, AYA Pay, or MPU Merchant QR
          </p>

          <div className="flex items-center gap-3 mt-6">
            <button className="flex items-center gap-2 bg-white hover:bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
              <Flashlight size={16} className="text-amber-500" /> Flashlight
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-100 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
              <Image size={16} className="text-blue-600" /> Gallery Image
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MY RECEIVE QR */}
      {activeSubTab === 'myqr' && (
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-md flex flex-col items-center border border-slate-200/80">
            <div className="flex items-center gap-3 mb-4 w-full">
              <img src={user.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover border border-slate-200" />
              <div>
                <h3 className="font-medium text-sm text-slate-900">{user.name}</h3>
                <p className="text-[11px] text-slate-500 font-semibold">{user.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 shadow-inner">
              <img src={user.qrCodeUrl} alt="My Wallet QR" className="w-48 h-48 object-contain rounded-lg" />
            </div>

            {customAmount && (
              <div className="text-center bg-blue-50 border border-blue-200 rounded-xl py-2 px-3 mb-4 w-full">
                <span className="text-[10px] text-blue-700 font-medium uppercase tracking-wider">Requested Amount</span>
                <p className="text-lg font-semibold text-blue-900">MMK {Number(customAmount).toLocaleString()}</p>
              </div>
            )}

            <div className="w-full space-y-3">
              <input 
                type="number" 
                placeholder="Optional MMK amount..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-center outline-none focus:border-blue-600 focus:bg-white"
              />

              <div className="flex gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Ref'}
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                  <Download size={14} /> Save QR Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC MERCHANT QR */}
      {activeSubTab === 'merchant_qr' && (
        <div className="flex-1 flex flex-col items-center justify-center py-4 px-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-md border border-slate-200/80">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <Store size={22} className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Dynamic Merchant Pay QR</h3>
                <p className="text-[10px] text-slate-500 font-medium">Generate custom bill payment QR</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">Merchant Store Name</label>
                <input 
                  type="text" 
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">Bill Amount (MMK)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 25000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {customAmount && Number(customAmount) > 0 && (
              <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 animate-fade-in">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MERCHANT_${merchantName.replace(/\s+/g, '_')}_MMK_${customAmount}`} 
                  alt="Dynamic Merchant QR" 
                  className="w-40 h-40 object-contain rounded-lg" 
                />
                <span className="text-xs font-semibold text-blue-900 mt-2.5">MMK {Number(customAmount).toLocaleString()}</span>
              </div>
            )}

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-xs shadow-sm active:scale-95 transition-transform">
              Generate Merchant QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
