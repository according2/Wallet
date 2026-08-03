import React, { useState } from 'react';
import { TabType, BankAccount, Transaction, Beneficiary, ActiveScreen } from './types';
import { BottomNav } from './components/BottomNav';
import { TransactionFlow } from './components/TransactionFlow';

// Views
import { HomeView } from './views/HomeView';
import { HistoryView } from './views/HistoryView';
import { ScanView } from './views/ScanView';
import { ServicesView } from './views/ServicesView';
import { NearbyView } from './views/NearbyView';
import { ProfileView } from './views/ProfileView';
import { BankView } from './views/BankView';
import { BeneficiariesView } from './views/BeneficiariesView';
import { TransactionView } from './views/TransactionView';
import { NotificationsView } from './views/NotificationsView';

// Data
import { 
  currentUser as initialUser, 
  servicesData, 
  historyData as initialHistory, 
  notificationsData, 
  bankAccountsData as initialBanks,
  initialBeneficiariesData 
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [user, setUser] = useState(initialUser);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBanks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialHistory);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiariesData);
  
  // Selected beneficiary for direct transfer view
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Active Quick Transaction Modal State
  const [activeTxType, setActiveTxType] = useState<string | null>(null);

  const handleRequestTransaction = (type: string) => {
    setActiveTxType(type);
  };

  const handleCloseTx = () => {
    setActiveTxType(null);
  };

  const handleCompleteTransaction = ({ type, amount, recipient, merchant }: { type: string; amount: number; recipient?: string; merchant?: string }) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      amount: -amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'completed',
      recipient,
      merchant,
      referenceNo: `MMK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      fee: 0,
    };

    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
  };

  const handleLinkBank = (bankName: string, accountNo: string) => {
    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName,
      bankCode: bankName.substring(0, 3).toUpperCase(),
      accountName: user.name,
      accountNumber: accountNo,
      balance: Math.floor(1000000 + Math.random() * 5000000),
      isLinked: true,
      logoColor: 'bg-blue-600 text-white',
    };
    setBankAccounts([...bankAccounts, newBank]);
  };

  const handleUnlinkBank = (id: string) => {
    setBankAccounts(bankAccounts.map(b => b.id === id ? { ...b, isLinked: false } : b));
  };

  // Beneficiary Management Handlers
  const handleAddBeneficiary = (b: Omit<Beneficiary, 'id'>) => {
    const newB: Beneficiary = {
      ...b,
      id: `ben-${Date.now()}`
    };
    setBeneficiaries([newB, ...beneficiaries]);
  };

  const handleEditBeneficiary = (b: Beneficiary) => {
    setBeneficiaries(beneficiaries.map(item => item.id === b.id ? b : item));
  };

  const handleDeleteBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(item => item.id !== id));
  };

  const handleSelectBeneficiaryForTransfer = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setActiveScreen('transaction');
  };

  return (
    <div className="min-h-screen bg-slate-100 w-full overflow-x-hidden font-sans antialiased text-slate-900 flex justify-center">
      {/* Container - Modern Mobile Wallet Layout */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm relative border-x border-slate-200/60">
        
        {/* Full Page Views Router */}
        {activeScreen === 'bank' ? (
          <BankView 
            bankAccounts={bankAccounts}
            onBack={() => setActiveScreen('dashboard')}
            onLinkBank={handleLinkBank}
            onUnlinkBank={handleUnlinkBank}
            onOpenManageBeneficiaries={() => setActiveScreen('beneficiaries')}
          />
        ) : activeScreen === 'beneficiaries' ? (
          <BeneficiariesView
            beneficiaries={beneficiaries}
            onBack={() => setActiveScreen('dashboard')}
            onAddBeneficiary={handleAddBeneficiary}
            onEditBeneficiary={handleEditBeneficiary}
            onDeleteBeneficiary={handleDeleteBeneficiary}
            onSelectBeneficiaryForTransfer={handleSelectBeneficiaryForTransfer}
          />
        ) : activeScreen === 'notifications' ? (
          <NotificationsView
            notifications={notificationsData}
            onBack={() => setActiveScreen('dashboard')}
          />
        ) : activeScreen === 'transaction' ? (
          <TransactionView
            user={user}
            beneficiaries={beneficiaries}
            recentTransactions={transactions}
            onBack={() => {
              setSelectedBeneficiary(null);
              setActiveScreen('dashboard');
            }}
            onCompleteTransaction={(amount, recipientName, recipientPhone, type) => {
              handleCompleteTransaction({ type, amount, recipient: `${recipientName} (${recipientPhone})` });
              setSelectedBeneficiary(null);
              setActiveScreen('dashboard');
            }}
            onOpenManageBeneficiaries={() => setActiveScreen('beneficiaries')}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView 
                user={user}
                services={servicesData}
                notifications={notificationsData}
                bankAccounts={bankAccounts}
                beneficiaries={beneficiaries}
                onRequestTransaction={handleRequestTransaction}
                onOpenAllServices={() => setActiveTab('services')}
                onOpenBanks={() => setActiveScreen('bank')}
                onOpenProfile={() => setActiveTab('profile')}
                onOpenNotifications={() => setActiveScreen('notifications')}
                onOpenManageBeneficiaries={() => setActiveScreen('beneficiaries')}
                onSelectBeneficiaryForTransfer={handleSelectBeneficiaryForTransfer}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView transactions={transactions} />
            )}

            {activeTab === 'scan' && (
              <ScanView user={user} />
            )}

            {activeTab === 'nearby' && (
              <NearbyView onRequestTransaction={handleRequestTransaction} />
            )}

            {activeTab === 'services' && (
              <ServicesView 
                services={servicesData}
                onRequestTransaction={handleRequestTransaction}
                onOpenBanks={() => setActiveScreen('bank')}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView 
                user={user}
                bankAccounts={bankAccounts}
                onOpenBanks={() => setActiveScreen('bank')}
                onOpenScan={() => setActiveTab('scan')}
              />
            )}
          </>
        )}

        {/* Bottom Nav Bar (visible on primary tabs) */}
        {activeScreen === 'dashboard' && (
          <BottomNav 
            activeTab={activeTab} 
            onChange={(tab) => {
              setActiveScreen('dashboard');
              setActiveTab(tab);
            }} 
          />
        )}

        {/* Global Quick Action Modal */}
        {activeTxType && (
          <TransactionFlow 
            actionType={activeTxType}
            user={user}
            bankAccounts={bankAccounts}
            onClose={handleCloseTx}
            onCompleteTransaction={handleCompleteTransaction}
          />
        )}
      </div>
    </div>
  );
}

