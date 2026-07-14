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
  menuId: number;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
}

export interface ConfirmDeleteTarget {
  type: 'partnership' | 'coupon-template';
  id: number;
  label: string;
}

export type TabKey =  'store' | 'menu' | 'coupon' | 'partnership' | 'statistics';
