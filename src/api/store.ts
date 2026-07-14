import { apiFetch } from './client';
import type { RegisterStoreRequest, RegisterStoreResponse, StoreDetail, UpdateStoreRequest } from './types';

export function getMyStore(): Promise<StoreDetail> {
  return apiFetch<StoreDetail>('/stores/me');
}

export function getStoreDetail(storeId: number, lat?: number, lng?: number): Promise<StoreDetail> {
  return apiFetch<StoreDetail>(`/stores/${storeId}`, {
    query: {
      lat: lat === undefined ? undefined : String(lat),
      lng: lng === undefined ? undefined : String(lng),
    },
  });
}

export function registerStore(body: RegisterStoreRequest): Promise<RegisterStoreResponse> {
  return apiFetch<RegisterStoreResponse>('/stores', { method: 'POST', body });
}

export function updateStore(storeId: number, body: UpdateStoreRequest): Promise<StoreDetail> {
  return apiFetch<StoreDetail>(`/stores/${storeId}`, { method: 'PATCH', body });
}
