import { apiFetch, USE_MOCK } from './client';
import * as mock from './mock/store';
import type { RegisterStoreRequest, RegisterStoreResponse, StoreDetail, UpdateStoreRequest } from './types';

export function getMyStore(): Promise<StoreDetail> {
  if (USE_MOCK) return mock.getMyStore();
  return apiFetch<StoreDetail>('/stores/me');
}

export function registerStore(body: RegisterStoreRequest): Promise<RegisterStoreResponse> {
  if (USE_MOCK) return mock.registerStore(body);
  return apiFetch<RegisterStoreResponse>('/stores', { method: 'POST', body });
}

export function updateStore(storeId: number, body: UpdateStoreRequest): Promise<StoreDetail> {
  if (USE_MOCK) return mock.updateStore(storeId, body);
  return apiFetch<StoreDetail>(`/stores/${storeId}`, { method: 'PATCH', body });
}
