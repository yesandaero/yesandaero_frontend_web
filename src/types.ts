import type { StoreCategory } from './api/types';

export interface StoreInfo {
  storeId: number;
  name: string;
  category: StoreCategory;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  avgPrice: number;
  description: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  soldOut: boolean;
}

export interface ConfirmDeleteTarget {
  type: 'menu' | 'partnership' | 'coupon-template';
  id: number;
  label: string;
}

export type TabKey =  'store' | 'menu' | 'coupon' | 'partnership' | 'statistics';
export type AuthMode = 'login' | 'signup';
