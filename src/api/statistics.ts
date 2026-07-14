import { apiFetch, USE_MOCK } from './client';
import * as mock from './mock/statistics';
import type { StoreStatistics } from './types';

export function getStoreStatistics(storeId: number, from: string, to: string): Promise<StoreStatistics> {
  if (USE_MOCK) return mock.getStoreStatistics(storeId, from, to);
  return apiFetch<StoreStatistics>(`/stores/${storeId}/statistics`, { query: { from, to } });
}
