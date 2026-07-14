import { apiFetch } from './client';
import type { StoreStatistics } from './types';

export function getStoreStatistics(storeId: number, from: string, to: string): Promise<StoreStatistics> {
  return apiFetch<StoreStatistics>(`/stores/${storeId}/statistics`, { query: { from, to } });
}
