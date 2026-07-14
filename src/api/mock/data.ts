/** 임시 목업 데이터 저장소. 백엔드 연동 전 프론트 화면 확인용. */
import type { CouponTemplate, Partnership, StoreDetail } from '../types';

export function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export const mockDb: {
  store: StoreDetail | null;
  couponTemplates: CouponTemplate[];
  partnerships: Partnership[];
  nextTemplateId: number;
  nextPartnershipId: number;
  nextCouponId: number;
} = {
  store: {
    storeId: 1,
    name: '이모네 국밥',
    category: 'KOREAN',
    address: '대전 유성구 궁동 123-4',
    latitude: 36.3624,
    longitude: 127.3568,
    phone: '042-123-4567',
    avgPrice: 9000,
    description: '사골국물 전문점입니다. 30년 전통의 손맛으로 정성껏 끓입니다.',
  },
  couponTemplates: [
    {
      templateId: 1,
      store: { storeId: 1, name: '이모네 국밥' },
      name: '전체 메뉴 1000원 할인',
      discountType: 'AMOUNT',
      discountValue: 1000,
      minOrderAmount: 5000,
      validDays: 14,
      isMine: true,
    },
    {
      templateId: 2,
      store: { storeId: 15, name: '유성분식' },
      name: '떡볶이 10% 할인',
      discountType: 'RATE',
      discountValue: 10,
      minOrderAmount: 3000,
      validDays: 30,
      isMine: false,
    },
  ],
  partnerships: [
    {
      partnershipId: 1,
      partnerStore: { storeId: 12, name: '흔카페', category: 'CAFE' },
      direction: 'RECEIVED',
      status: 'PENDING',
      createdAt: '2026-07-10T09:00:00',
    },
    {
      partnershipId: 2,
      partnerStore: { storeId: 15, name: '유성분식', category: 'SNACK' },
      direction: 'SENT',
      status: 'ACCEPTED',
      createdAt: '2026-06-20T09:00:00',
    },
    {
      partnershipId: 3,
      partnerStore: { storeId: 20, name: '궁동돈까스', category: 'WESTERN' },
      direction: 'RECEIVED',
      status: 'TERMINATED',
      createdAt: '2026-05-01T09:00:00',
    },
  ],
  nextTemplateId: 3,
  nextPartnershipId: 4,
  nextCouponId: 101,
};
