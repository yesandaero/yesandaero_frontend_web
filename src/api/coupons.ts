import { apiFetch } from './client';
import type {
  CouponTemplateListResponse,
  CreateCouponTemplateRequest,
  CreateCouponTemplateResponse,
  IssueCouponRequest,
  IssueCouponResponse,
  UseTokenResponse,
} from './types';

export function listIssuableTemplates(): Promise<CouponTemplateListResponse> {
  return apiFetch<CouponTemplateListResponse>('/coupon-templates');
}

export function createTemplate(body: CreateCouponTemplateRequest): Promise<CreateCouponTemplateResponse> {
  return apiFetch<CreateCouponTemplateResponse>('/coupon-templates', { method: 'POST', body });
}

export function deactivateTemplate(templateId: number): Promise<void> {
  return apiFetch<void>(`/coupon-templates/${templateId}`, { method: 'PATCH', body: { active: false } });
}

export function issueCoupon(body: IssueCouponRequest): Promise<IssueCouponResponse> {
  return apiFetch<IssueCouponResponse>('/coupons/issue', { method: 'POST', body });
}

/** CUSTOMER 전용 (사용자 앱에서 쿠폰 사용 시 호출) — 사장님 콘솔에는 UI 없음, API 계층만 제공 */
export function createUseToken(couponId: number): Promise<UseTokenResponse> {
  return apiFetch<UseTokenResponse>(`/coupons/${couponId}/use-token`, { method: 'POST' });
}
