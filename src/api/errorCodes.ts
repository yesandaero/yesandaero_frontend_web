/**
 * 백엔드 에러 코드 카탈로그.
 * Notion API 명세서의 "예외 상황" 하위 페이지에서 확인한 code/enum/http status/type 그대로 옮김.
 * 백엔드는 에러 응답 바디에 최소 { code } 를 내려주는 것으로 보이며, code로 사용자용 메시지를 찾는다.
 */
export interface ErrorCodeInfo {
  /** 예: "CPN_404_01" */
  code: string;
  /** 예: "COUPON_NOT_FOUND" */
  name: string;
  /** HTTP status */
  status: number;
  /** 사용자에게 보여줄 한국어 메시지 */
  message: string;
  /** 예: "CouponErrorCode" */
  type: string;
}

export const ERROR_CODES: Record<string, ErrorCodeInfo> = {
  // Global
  GLB_400: { code: 'GLB_400', name: 'INVALID_REQUEST', status: 400, message: '요청 값이 올바르지 않습니다', type: 'GlobalErrorCode' },
  // User
  USR_401: { code: 'USR_401', name: 'LOGIN_FAILED', status: 401, message: '이메일 또는 비밀번호가 일치하지 않습니다', type: 'UserErrorCode' },
  USR_403: { code: 'USR_403', name: 'ROLE_NOT_ALLOWED', status: 403, message: '해당 역할로는 수행할 수 없는 요청입니다', type: 'UserErrorCode' },
  USR_409: { code: 'USR_409', name: 'DUPLICATE_EMAIL', status: 409, message: '이미 가입된 이메일입니다', type: 'UserErrorCode' },
  // Jwt
  JWT_400: { code: 'JWT_400', name: 'MALFORMED_TOKEN', status: 400, message: '토큰 형식이 올바르지 않습니다', type: 'JwtErrorCode' },
  JWT_401: { code: 'JWT_401', name: 'EXPIRED_OR_INVALID_TOKEN', status: 401, message: '토큰이 만료되었거나 유효하지 않습니다', type: 'JwtErrorCode' },
  // Coupon
  CPN_401: { code: 'CPN_401', name: 'INVALID_COUPON_TOKEN', status: 401, message: '쿠폰 토큰이 만료되었거나 유효하지 않습니다', type: 'CouponErrorCode' },
  CPN_403_01: { code: 'CPN_403_01', name: 'ISSUE_NOT_ALLOWED', status: 403, message: '쿠폰 발급 권한이 없습니다', type: 'CouponErrorCode' },
  CPN_403_02: { code: 'CPN_403_02', name: 'NOT_COUPON_OWNER', status: 403, message: '본인의 쿠폰이 아닙니다', type: 'CouponErrorCode' },
  CPN_404_01: { code: 'CPN_404_01', name: 'TEMPLATE_NOT_FOUND', status: 404, message: '존재하지 않는 쿠폰 템플릿입니다', type: 'CouponErrorCode' },
  CPN_404_02: { code: 'CPN_404_02', name: 'COUPON_NOT_FOUND', status: 404, message: '존재하지 않는 쿠폰입니다', type: 'CouponErrorCode' },
  CPN_409_01: { code: 'CPN_409_01', name: 'COUPON_ALREADY_REGISTERED', status: 409, message: '이미 등록된 쿠폰입니다', type: 'CouponErrorCode' },
  CPN_409_02: { code: 'CPN_409_02', name: 'INVALID_COUPON_STATUS', status: 409, message: '사용할 수 없는 상태의 쿠폰입니다', type: 'CouponErrorCode' },
  // Store
  STR_403: { code: 'STR_403', name: 'NOT_STORE_OWNER', status: 403, message: '본인 소유의 가게가 아닙니다', type: 'StoreErrorCode' },
  STR_404: { code: 'STR_404', name: 'STORE_NOT_FOUND', status: 404, message: '존재하지 않는 가게입니다', type: 'StoreErrorCode' },
  // Partnership
  PTN_403: { code: 'PTN_403', name: 'NOT_PARTNERSHIP_PARTY', status: 403, message: '해당 제휴의 당사자가 아닙니다', type: 'PartnershipErrorCode' },
  PTN_404: { code: 'PTN_404', name: 'PARTNERSHIP_NOT_FOUND', status: 404, message: '존재하지 않는 제휴입니다', type: 'PartnershipErrorCode' },
  PTN_409_02: { code: 'PTN_409_02', name: 'INVALID_PARTNERSHIP_STATUS', status: 409, message: '현재 상태에서 처리할 수 없는 요청입니다', type: 'PartnershipErrorCode' },
};

/** 에러 코드에 해당하는 사용자용 메시지. 미등록 코드면 undefined. */
export function messageForCode(code: string | undefined | null): string | undefined {
  if (!code) return undefined;
  return ERROR_CODES[code]?.message;
}
