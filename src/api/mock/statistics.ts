import { delay } from './data';
import type { StoreStatistics } from '../types';

export function getStoreStatistics(_storeId: number, from: string, to: string): Promise<StoreStatistics> {
  return delay({
    period: { from, to },
    issued: { total: 120, registered: 80, used: 45 },
    redeemedAtMyStore: {
      total: 30,
      byIssuerStore: [
        { storeId: 12, name: '흔카페', count: 18 },
        { storeId: 15, name: '유성분식', count: 12 },
      ],
    },
  });
}
