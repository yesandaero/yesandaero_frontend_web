# 프로젝트 메모

> 2026-07-14 기준. Notion 공개 페이지(`flying-dugong-b09.notion.site`, 페이지명 "API 명세서")를 직접 읽어 최신 상태로 다시 정리함. 예전에 붙여넣었던 표(전부 "시작 전")보다 이 내용이 더 최신 상태를 반영한다.

## 담당 API 항목 (도후 안) — 총 10개

| 도메인 | Method | 기능 | Endpoint | 백엔드 | 프론트엔드 |
|---|---|---|---|---|---|
| auth | POST | 회원가입 | `/auth/signup` | 완료 | 시작 전 |
| auth | POST | 로그인 | `/auth/login` | 완료 | 시작 전 |
| auth | POST | 로그아웃 | `/auth/logout` | 완료 | 시작 전 |
| auth | POST | 토큰 재발급 | `/auth/refresh` | 완료 | 시작 전 |
| coupon | POST | 쿠폰 발급 (QR 생성) | `/coupons/issue` | 진행 중 | 시작 전 |
| coupon | GET | 내 쿠폰 템플릿 목록 | `/coupon-templates` | 진행 중 | 시작 전 |
| partnership | PATCH | 제휴 거절 | `/partnerships/{partnershipId}/reject` | 시작 전 | 시작 전 |
| partnership | GET | 제휴 목록 조회 | `/partnerships` | 시작 전 | 시작 전 |
| statistics | GET | 가게 발급/사용 통계 | `/stores/{storeId}/statistics` | 시작 전 | 시작 전 |
| store | PATCH | 가게 정보 수정 | `/stores/{storeId}` | 시작 전 | 시작 전 |

**auth 4건 전부 백엔드 "완료"** — 실제 서버가 떠 있을 가능성이 있음. 나머지는 coupon만 "진행 중", partnership·statistics·store는 아직 "시작 전".

## 전체 API 명세서 현황

### auth (4)
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| POST | 회원가입 | `/auth/signup` | 완료 | 시작 전 | 시작 전 | 김시흔, 도후 안, h2ymb5 |
| POST | 로그인 | `/auth/login` | 완료 | 시작 전 | 시작 전 | 김시흔, 도후 안, h2ymb5 |
| POST | 로그아웃 | `/auth/logout` | 완료 | 시작 전 | 시작 전 | 김시흔, 도후 안, h2ymb5 |
| POST | 토큰 재발급 | `/auth/refresh` | 완료 | 시작 전 | 시작 전 | 김시흔, 도후 안, h2ymb5 |

### coupon (6)
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| POST | 쿠폰 사용 | `/coupons/{couponId}/use` | 진행 중 | 해당 없음 | 시작 전 | 김시흔, h2ymb5 |
| POST | 쿠폰 발급 (QR 생성) | `/coupons/issue` | 진행 중 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |
| PATCH | 쿠폰 템플릿 수정/비활성화 | `/coupon-templates/{templateId}` | 진행 중 | 시작 전 | 해당 없음 | 김시흔, h2ymb5 |
| GET | 내 쿠폰 템플릿 목록 | `/coupon-templates` | 진행 중 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |
| POST | 쿠폰 등록 (QR 스캔) | `/coupons/register` | 진행 중 | 해당 없음 | 시작 전 | 김시흔, h2ymb5 |
| GET | 내 쿠폰함 조회 | `/coupons/me` | 진행 중 | 해당 없음 | 시작 전 | 김시흔, h2ymb5 |

### partnership (2)
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| PATCH | 제휴 거절 | `/partnerships/{partnershipId}/reject` | 시작 전 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |
| GET | 제휴 목록 조회 | `/partnerships` | 시작 전 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |

### recommendation (1) — ⚠️ [폐기] 표시됨
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| GET | 가게 추천 [페기] | `/recommendations/stores` | 시작 전 | 해당 없음 | 시작 전 | 김시흔, h2ymb5 |

### statistics (1)
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| GET | 가게 발급/사용 통계 | `/stores/{storeId}/statistics` | 시작 전 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |

### store (2)
| Method | 기능 | Endpoint | 백엔드 | 프론트엔드 | 어플 | 개발자 |
|---|---|---|---|---|---|---|
| PATCH | 가게 정보 수정 | `/stores/{storeId}` | 시작 전 | 시작 전 | 해당 없음 | 김시흔, 도후 안 |
| GET | 가게 상세 조회 | `/stores/{storeId}` | 시작 전 | 해당 없음 | 시작 전 | 김시흔, h2ymb5 |

## 에러 코드 참조

명세서의 "예외 상황" 문구가 각각 하위 페이지로 연결되어 있고, 그 안에 실제 에러 코드 체계(`code` / `enum` / `http status` / `type`)가 정의돼 있음. 백엔드가 이 형태로 에러 응답을 내려줄 가능성이 높음 (프론트 에러 파싱 로직에 참고).

| type | code | enum | http status | 메시지 |
|---|---|---|---|---|
| GlobalErrorCode | GLB_400 | INVALID_REQUEST | 400 | 요청 값이 올바르지 않습니다 |
| UserErrorCode | USR_401 | LOGIN_FAILED | 401 | 이메일 또는 비밀번호가 일치하지 않습니다 |
| UserErrorCode | USR_403 | ROLE_NOT_ALLOWED | 403 | 해당 역할로는 수행할 수 없는 요청입니다 |
| UserErrorCode | USR_409 | DUPLICATE_EMAIL | 409 | 이미 가입된 이메일입니다 |
| JwtErrorCode | JWT_400 | MALFORMED_TOKEN | 400 | 토큰 형식이 올바르지 않습니다 |
| JwtErrorCode | JWT_401 | EXPIRED_OR_INVALID_TOKEN | 401 | 토큰이 만료되었거나 유효하지 않습니다 |
| CouponErrorCode | CPN_401 | INVALID_COUPON_TOKEN | 401 | 쿠폰 토큰이 만료되었거나 유효하지 않습니다 |
| CouponErrorCode | CPN_403_01 | ISSUE_NOT_ALLOWED | 403 | 쿠폰 발급 권한이 없습니다 |
| CouponErrorCode | CPN_403_02 | NOT_COUPON_OWNER | 403 | 본인의 쿠폰이 아닙니다 |
| CouponErrorCode | CPN_404_01 | TEMPLATE_NOT_FOUND | 404 | 존재하지 않는 쿠폰 템플릿입니다 |
| CouponErrorCode | CPN_404_02 | COUPON_NOT_FOUND | 404 | 존재하지 않는 쿠폰입니다 |
| CouponErrorCode | CPN_409_01 | COUPON_ALREADY_REGISTERED | 409 | 이미 등록된 쿠폰입니다 |
| CouponErrorCode | CPN_409_02 | INVALID_COUPON_STATUS | 409 | 사용할 수 없는 상태의 쿠폰입니다 |
| StoreErrorCode | STR_403 | NOT_STORE_OWNER | 403 | 본인 소유의 가게가 아닙니다 |
| StoreErrorCode | STR_404 | STORE_NOT_FOUND | 404 | 존재하지 않는 가게입니다 |
| PartnershipErrorCode | PTN_403 | NOT_PARTNERSHIP_PARTY | 403 | 해당 제휴의 당사자가 아닙니다 |
| PartnershipErrorCode | PTN_404 | PARTNERSHIP_NOT_FOUND | 404 | 존재하지 않는 제휴입니다 |
| PartnershipErrorCode | PTN_409_02 | INVALID_PARTNERSHIP_STATUS | 409 | 현재 상태에서 처리할 수 없는 요청입니다 |

## ⚠️ 프론트(이미 구현됨) vs 최신 API 표 — 확인 필요한 불일치

프론트는 예전에 pasted된 더 큰 표(아래 "기능 상세" 참고)를 기준으로 이미 만들어졌는데, 이번에 다시 읽은 최신 표에는 다음이 다르다. 팀에 실제로 맞는지 확인 필요:

- **"쿠폰 템플릿 생성"(POST `/coupon-templates`)이 최신 표에 없음** — GET(목록 조회)만 있음. 프론트의 "템플릿 등록" 기능이 대응하는 API가 있는지 불확실.
- **"쿠폰 사용 코드 생성"(POST `/coupons/{couponId}/use-token`)이 없어지고, 대신 "쿠폰 사용"(POST `/coupons/{couponId}/use`)이 새로 생김** — 이름과 목적이 비슷하지만 담당자가 다름(도후 안 아님, 김시흔·h2ymb5). 요청/응답 스펙 미확인.
- **제휴 수락(`/accept`), 제휴 요청(`/partnerships` POST), 제휴 해지(`DELETE /partnerships/{id}`)가 최신 표에 없음** — 거절/목록조회 2개만 있음. 프론트에 이미 수락·요청·해지 UI가 있음 (제거해야 하는지, 아니면 표가 아직 안 채워진 건지 불확실).
- **가게 등록(POST `/stores`), 내 가게 조회(GET `/stores/me`)가 최신 표에 없음** — 정보 수정/상세조회 2개만 있음. 프론트의 "가게 등록 온보딩" 화면이 대응 API가 있는지 불확실.
- **recommendation의 "가게 추천"이 [페기](deprecated) 표시됨.**

## 개발 계획 (Plan)

1. **팀에 확인**: 위 불일치 목록 먼저 확인 — 특히 쿠폰 템플릿 생성/제휴 수락·요청·해지/가게 등록이 정말 없어진 건지, 표가 아직 안 채워진 것뿐인지.
2. **auth 실환경 연동 시도**: 백엔드 "완료" 상태이므로, 실제 서버 주소를 알면 `.env`의 `VITE_API_BASE_URL`을 맞추고 목업(`VITE_USE_MOCK_API`) 끄고 로그인/회원가입/로그아웃/재발급부터 실제 연동 테스트.
3. **에러 처리 개선**: `src/api/client.ts`의 에러 파싱을 위 에러 코드 표(`code`/`enum` 필드 기준)에 맞춰 다시 확인 — 지금은 `detail`/`title`/`message` 필드를 추측하고 있어서 실제 응답과 다를 수 있음.
4. **coupon 우선 개발**: 백엔드가 "진행 중"인 유일한 도메인이므로 다음 순번으로 유력. 단, 위 불일치(템플릿 생성/사용 엔드포인트 이름) 확인 후 진행.
5. **partnership/statistics/store**: 아직 백엔드 "시작 전" — 위 불일치 확인 후 범위 재조정.

## 기능 상세 (예전 자료 — 요청/응답 JSON 예시 포함, 위 최신 표와 어긋나는 항목 있음)

### 로그아웃

## 개요

Redis에 저장된 refreshToken을 삭제한다.

## Request

Header: Authorization: Bearer {accessToken}

## Response 204

Body 없음

### 토큰 재발급

개요
refreshToken으로 accessToken을 재발급한다. Redis의 refresh:{userId} 값과 대조한다.
Request

```json
{ "refreshToken": "eyJ..." }

```

Response 200

```json
{ "accessToken": "eyJ...", "refreshToken": "eyJ..." }

```

에러

* 401: 토큰 만료 또는 위조

### 회원가입

개요
사용자(앱)와 사장님(웹) 공용 회원가입. role 값으로 구분한다.

* OWNER/CUSTOMER
Request

```json
{
  "username": "kimsiheun",
  "email": "user@example.com",
  "password": "P@ssw0rd!",
  "role": "CUSTOMER"
}

```

role: CUSTOMER | OWNER
Response 201

```json
{ "userId": 1 }

```

에러 (application/problem+json)

* 400: 입력값 형식 오류
* 409: 이메일 중복

### 로그인

개요
이메일/비밀번호 로그인. accessToken과 refreshToken을 발급한다.
Request

```json
{ "email": "user@example.com", "password": "P@ssw0rd!" }

```

Response 200

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "role": "CUSTOMER"
}

```

에러

* 401: 이메일 또는 비밀번호 불일치

### 쿠폰 발급 (QR 생성)

개요
결제 완료 후 사장님 웹에서 쿠폰을 발급한다. 쿠폰(ISSUED)을 생성하고 1회용 등록 토큰을 담은 QR을 반환한다. 토큰은 Redis에 coupon:issue:{token} 키로 TTL 600초 저장된다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)

```json
{ "templateId": 3 }

```

Response 201

```json
{
  "couponId": 101,
  "qrPayload": "couponapp://register?token=8f3a...",
  "expiresIn": 600
}

```

에러

* 403: 발급 권한 없음 (제휴 아님 또는 비활성 템플릿)
* 404: 템플릿 없음

### 쿠폰 템플릿 생성

개요
사장님이 본인 가게의 쿠폰 템플릿을 생성한다. 발급도 본인이 하며, 발급 시 사용처로 지정한 제휴(ACCEPTED) 가게에서 사용된다. 결제 손님에게 제휴 가게로 갈 소비 명분을 만들어주는 구조다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)

```json
{
  "name": "아메리카노 1000원 할인",
  "discountType": "AMOUNT",
  "discountValue": 1000,
  "minOrderAmount": 5000,
  "validDays": 14
}

```

discountType: AMOUNT | RATE
Response 201

```json
{ "templateId": 3 }

```

에러

* 400: 할인값 범위 오류 (RATE는 1~100)
* 403: OWNER 권한 아님

### 발급 가능 쿠폰 템플릿 목록

개요
내 가게가 발급할 수 있는 쿠폰 템플릿 목록을 조회한다. 자기 가게 템플릿과 제휴(ACCEPTED) 가게의 활성 템플릿을 함께 반환한다. 결제 후 발급 화면에서 사용한다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)
Response 200

```json
{
  "templates": [
    {
      "templateId": 3,
      "store": { "storeId": 12, "name": "흔카페" },
      "name": "아메리카노 1000원 할인",
      "discountType": "AMOUNT",
      "discountValue": 1000,
      "minOrderAmount": 5000,
      "validDays": 14,
      "isMine": false
    }
  ]
}

```

### 쿠폰 사용 코드 생성

개요
사용자가 매장에서 쿠폰을 쓰기 위해 사용용 QR/숫자 코드를 생성한다. Redis에 coupon:redeem:{token} 키로 TTL 180초 저장된다. REGISTERED 상태의 본인 쿠폰만 가능하다.
Request
Header: Authorization: Bearer {accessToken} (CUSTOMER)
Response 201

```json
{ "qrPayload": "couponapp://redeem?token=c2d1...", "displayCode": "483920", "expiresIn": 180 }

```

에러

* 403: 본인 쿠폰 아님
* 404: 쿠폰 없음
* 409: REGISTERED 상태 아님 (사용/만료됨)

### 제휴 수락

개요
받은 제휴 요청을 수락한다. PENDING 상태에서만 가능하다 (PENDING -> ACCEPTED).
Request
Header: Authorization: Bearer {accessToken} (OWNER, 수신 가게 소유주)
Response 200

```json
{ "partnershipId": 5, "status": "ACCEPTED", "acceptedAt": "2026-07-13T11:00:00" }

```

에러

* 403: 수신 가게 소유주 아님
* 404: 제휴 없음
* 409: PENDING 상태 아님 (상태 전이 위반)

### 제휴 거절

개요
받은 제휴 요청을 거절한다 (PENDING -> REJECTED).
Request
Header: Authorization: Bearer {accessToken} (OWNER, 수신 가게 소유주)
Response 200

```json
{ "partnershipId": 5, "status": "REJECTED" }

```

에러

* 403: 수신 가게 소유주 아님
* 404: 제휴 없음
* 409: PENDING 상태 아님

### 제휴 요청

개요
내 가게가 다른 가게에 제휴를 요청한다. 생성 시 상태는 PENDING이다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)

```json
{ "receiverStoreId": 12 }

```

Response 201

```json
{ "partnershipId": 5, "status": "PENDING" }

```

에러

* 404: 대상 가게 없음
* 409: 이미 진행 중이거나 체결된 제휴 존재 (UNIQUE 제약)

### 제휴 해지

## 개요

체결된 제휴를 해지한다 (ACCEPTED -> TERMINATED). 양쪽 가게 모두 해지할 수 있다. 이미 발급된 쿠폰은 유효기간까지 사용 가능하다.

## Request

Header: Authorization: Bearer {accessToken} (OWNER)

## Response 204

Body 없음

## 에러

- 403: 해당 제휴 당사자 아님
- 404: 제휴 없음
- 409: ACCEPTED 상태 아님

### 가게 발급/사용 통계

개요
사장님 웹 대시보드용 통계. 내 가게가 발급한 쿠폰과 내 가게에서 사용된 쿠폰을 제휴 가게별로 집계한다. 상부상조 효과(어느 가게가 손님을 보내줬는지)를 확인하는 용도이다.
Request
Header: Authorization: Bearer {accessToken} (OWNER, 본인 가게)
Query: from, to (ISO 8601 날짜)
Response 200

```json
{
  "period": { "from": "2026-07-01", "to": "2026-07-13" },
  "issued": { "total": 120, "registered": 80, "used": 45 },
  "redeemedAtMyStore": {
    "total": 30,
    "byIssuerStore": [
      { "storeId": 12, "name": "흔카페", "count": 18 },
      { "storeId": 15, "name": "유성분식", "count": 12 }
    ]
  }
}

```

에러

* 403: 본인 가게 아님
* 404: 가게 없음

### 가게 정보 수정

개요
가게 정보를 부분 수정한다. 본인 소유 가게만 가능하다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)

```json
{ "avgPrice": 10000, "description": "백반, 찌개 전문점" }

```

Response 200
수정된 가게 정보 전체 반환
에러

* 403: 본인 가게 아님
* 404: 존재하지 않는 가게

### 가게 등록

개요
사장님이 자신의 가게를 등록한다. 음식 카테고리와 1인 평균 가격은 필수값이며, 추천 필터의 기준 데이터가 된다. 위도/경도는 사용자 앱 지도 표시에 사용되므로 필수값이다. 주소 검색(지오코딩)은 사장님 웹 프론트에서 처리해 좌표를 함께 전송한다.
Request
Header: Authorization: Bearer {accessToken} (OWNER)

```json
{
  "name": "시흔식당",
  "category": "KOREAN",
  "address": "대전시 유성구 ...",
  "latitude": 36.3624,
  "longitude": 127.3568,
  "phone": "042-000-0000",
  "avgPrice": 9000,
  "description": "백반 전문점"
}

```

category: KOREAN | CHINESE | JAPANESE | WESTERN | SNACK | CAFE
Response 201

```json
{ "storeId": 10 }

```

에러

* 400: 입력값 형식 오류
* 403: OWNER 권한 아님
* 409: 이미 등록된 가게 존재

### 내 가게 조회

## 개요

로그인한 사장님의 가게 정보를 조회한다. 사장님 웹 대시보드 진입 시 사용한다.

## Request

Header: Authorization: Bearer {accessToken} (OWNER)

## Response 200

가게 상세 조회와 동일한 형식

## 에러

- 404: 등록된 가게 없음
