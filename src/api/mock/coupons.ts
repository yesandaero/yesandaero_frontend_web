import { delay, mockDb } from './data';
import type {
  CouponTemplateListResponse,
  CreateCouponTemplateRequest,
  CreateCouponTemplateResponse,
  IssueCouponRequest,
  IssueCouponResponse,
  UseTokenResponse,
} from '../types';

export function listIssuableTemplates(): Promise<CouponTemplateListResponse> {
  const acceptedPartnerStoreIds = new Set(
    mockDb.partnerships.filter((p) => p.status === 'ACCEPTED').map((p) => p.counterStore.storeId),
  );
  const visible = mockDb.couponTemplates.filter((t) => t.isMine || acceptedPartnerStoreIds.has(t.store.storeId));
  return delay({ templates: visible });
}

export function createTemplate(body: CreateCouponTemplateRequest): Promise<CreateCouponTemplateResponse> {
  const templateId = mockDb.nextTemplateId++;
  mockDb.couponTemplates.push({
    templateId,
    store: mockDb.store ? { storeId: mockDb.store.storeId, name: mockDb.store.name } : { storeId: 1, name: '내 가게' },
    ...body,
    isMine: true,
  });
  return delay({ templateId });
}

export function deactivateTemplate(templateId: number): Promise<void> {
  mockDb.couponTemplates = mockDb.couponTemplates.filter((t) => t.templateId !== templateId);
  return delay(undefined);
}

export function issueCoupon(_body: IssueCouponRequest): Promise<IssueCouponResponse> {
  const couponId = mockDb.nextCouponId++;
  return delay({ couponId, qrPayload: `couponapp://register?token=mock-${couponId}`, expiresIn: 600 });
}

export function createUseToken(couponId: number): Promise<UseTokenResponse> {
  return delay({ qrPayload: `couponapp://redeem?token=mock-${couponId}`, displayCode: String(100000 + couponId), expiresIn: 180 });
}
