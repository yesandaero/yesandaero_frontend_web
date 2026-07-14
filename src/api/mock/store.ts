import { delay, mockDb } from './data';
import { apiErrorFromCode } from '../client';
import type { RegisterStoreRequest, RegisterStoreResponse, StoreDetail, UpdateStoreRequest } from '../types';

export async function getMyStore(): Promise<StoreDetail> {
  // 404 = 아직 가게 미등록 → 온보딩 화면 신호 (AppContext에서 status===404로 분기)
  if (!mockDb.store) throw apiErrorFromCode('STR_404');
  return delay(mockDb.store);
}

export function registerStore(body: RegisterStoreRequest): Promise<RegisterStoreResponse> {
  mockDb.store = { storeId: 1, ...body };
  return delay({ storeId: 1 });
}

export async function updateStore(_storeId: number, body: UpdateStoreRequest): Promise<StoreDetail> {
  if (!mockDb.store) throw apiErrorFromCode('STR_404');
  mockDb.store = { ...mockDb.store, ...body };
  return delay(mockDb.store);
}
