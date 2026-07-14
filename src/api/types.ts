export type StoreCategory = 'KOREAN' | 'CHINESE' | 'JAPANESE' | 'WESTERN' | 'SNACK' | 'CAFE';
export type DiscountType = 'AMOUNT' | 'RATE';
export type PartnershipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'TERMINATED';
export type PartnershipDirection = 'SENT' | 'RECEIVED';
export type UserRole = 'OWNER' | 'CUSTOMER';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  role: UserRole;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupResponse {
  userId: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface StoreDetail {
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

export interface RegisterStoreRequest {
  name: string;
  category: StoreCategory;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  avgPrice: number;
  description: string;
}

export interface RegisterStoreResponse {
  storeId: number;
}

export type UpdateStoreRequest = Partial<Omit<RegisterStoreRequest, 'latitude' | 'longitude'>>;

export interface CouponTemplateStoreRef {
  storeId: number;
  name: string;
}

export interface CouponTemplate {
  templateId: number;
  store: CouponTemplateStoreRef;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  validDays: number;
  isMine: boolean;
}

export interface CouponTemplateListResponse {
  templates: CouponTemplate[];
}

export interface CreateCouponTemplateRequest {
  name: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  validDays: number;
}

/**
 * PATCH /coupon-templates/{templateId} (수정/비활성화) 요청 바디.
 * 담당(h2ymb5, 김시흔) 쪽 상세 스펙이 아직 전달되지 않아 비활성화 용도로만 최소 형태를 추정함.
 */
export interface DeactivateCouponTemplateRequest {
  active: false;
}

export interface CreateCouponTemplateResponse {
  templateId: number;
}

export interface IssueCouponRequest {
  templateId: number;
}

export interface IssueCouponResponse {
  couponId: number;
  qrPayload: string;
  expiresIn: number;
}

export interface UseTokenResponse {
  qrPayload: string;
  displayCode: string;
  expiresIn: number;
}

export interface PartnershipCounterStore {
  storeId: number;
  name: string;
}

export interface Partnership {
  partnershipId: number;
  status: PartnershipStatus;
  direction: PartnershipDirection;
  counterStore: PartnershipCounterStore;
  createdAt: string;
  acceptedAt?: string | null;
}

/** GET /partnerships 응답 스키마는 명세서에 없어 추정한 형태 (배열 래핑 방식은 쿠폰 템플릿 목록과 동일하게 맞춤). */
export interface PartnershipListResponse {
  partnerships: Partnership[];
}

export interface RequestPartnershipRequest {
  receiverStoreId: number;
}

export interface RequestPartnershipResponse {
  partnershipId: number;
  status: PartnershipStatus;
}

export interface AcceptPartnershipResponse {
  partnershipId: number;
  status: PartnershipStatus;
  acceptedAt: string;
}

export interface RejectPartnershipResponse {
  partnershipId: number;
  status: PartnershipStatus;
}

export interface StoreStatistics {
  period: { from: string; to: string };
  issued: { total: number; registered: number; used: number };
  redeemedAtMyStore: {
    total: number;
    byIssuerStore: { storeId: number; name: string; count: number }[];
  };
}
