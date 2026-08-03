export type TabType = 'home' | 'history' | 'scan' | 'nearby' | 'profile' | 'services';

export type TransactionStatus = 'idle' | 'request' | 'confirm' | 'receipt';

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  isLinked: boolean;
  logoColor: string;
  isDefault?: boolean;
}

export interface User {
  name: string;
  phone: string;
  nrc: string;
  avatar: string;
  tier: 'Gold' | 'Silver' | 'Platinum' | 'Diamond';
  points: number;
  balance: number;
  qrCodeUrl: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'transfer' | 'bills' | 'topup' | 'lifestyle' | 'finance';
  icon: string;
  color: string;
  isFavourite: boolean;
  description?: string;
  actionKey?: string;
}

export interface Transaction {
  id: string;
  type: string;
  subType?: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  recipient?: string;
  accountNo?: string;
  referenceNo: string;
  fee: number;
}

export interface NotificationMsg {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'transaction' | 'offer' | 'system';
}

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  bankName?: string;
  accountNo?: string;
  nrc?: string;
  avatar?: string;
  category: 'wallet' | 'bank' | 'non_wallet';
  isFavorite?: boolean;
}

export type ActiveScreen = 'dashboard' | 'beneficiaries' | 'bank' | 'transaction' | 'notifications' | 'loyalty_detail' | 'nearby_detail';

export interface NearbyItem {
  id: string;
  name: string;
  type: 'merchant' | 'agent';
  subCategory: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  area: string;
  address: string;
  phone: string;
  openHours: string;
  isOpenNow: boolean;
  isSuper: boolean;
  isPromo: boolean;
  isNew: boolean;
  services: string[];
  cashLimitMMK?: number;
  discountBadge?: string;
  lat: number;
  lng: number;
  qrCodeUrl: string;
  image: string;
}

export interface NearbyNews {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: 'Promotion' | 'Agent Update' | 'Merchant Deal' | 'System';
  imageUrl: string;
  merchantName?: string;
}
