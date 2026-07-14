# 예산대로 — 사장님 가게 관리 콘솔 (개발 문서)

가게 사장님(OWNER)이 웹에서 가게 정보·메뉴·쿠폰·제휴·통계를 관리하는 콘솔.
API 명세서 기반으로 프론트엔드를 구현하며, 백엔드가 아직 완성 전이라 **목업(mock) 모드**로도 전체 화면을 확인할 수 있게 되어 있다.

관련 문서: 담당 API 항목·기능 상세·에러 코드 표는 저장소 루트의 [`CLAUDE.md`](../CLAUDE.md)에 정리되어 있다.

---

## 1. 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 빌드/번들러 | Vite 8 |
| 프레임워크 | React 19 (함수형 컴포넌트 + Hooks) |
| 언어 | TypeScript (strict, `noUnusedLocals`/`noUnusedParameters` on) |
| 상태 관리 | React Context (외부 상태 라이브러리 없음) |
| 스타일 | 단일 전역 CSS (`src/index.css`), CSS 변수 기반 디자인 토큰 (팔레트 원본: `src/theme/colors.ts`) |
| 폰트 | Pretendard(본문) + IBM Plex Mono(숫자/코드) — `index.html`에서 CDN 로드 |
| 린트 | oxlint |
| HTTP | 브라우저 내장 `fetch` (별도 라이브러리 없음) |

---

## 2. 실행 방법

```bash
npm install
npm run dev        # 개발 서버 (기본 5173, 사용 중이면 자동으로 다음 포트)
npm run build      # tsc -b && vite build
npm run lint       # oxlint
npm run preview    # 빌드 결과 미리보기
```

### 환경 변수 (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080/api   # 백엔드 주소
VITE_USE_MOCK_API=true                         # 목업 모드 on/off
```

- `VITE_USE_MOCK_API=true` — 백엔드 없이 가짜 데이터로 전체 화면 확인 (현재 기본값).
- 실제 백엔드 연동 시 → `false`로 바꾸거나 줄 삭제 + `VITE_API_BASE_URL`을 실제 주소로.

---

## 3. 폴더 구조

```
src/
├─ main.tsx                # 진입점, index.css 로드
├─ App.tsx                 # 인증 게이트 + 온보딩 게이트 + 탭 셸(Shell)
├─ index.css               # 전역 스타일 / 디자인 토큰
├─ types.ts                # UI 레이어 공용 타입 (StoreInfo, MenuItem, TabKey 등)
│
├─ api/                    # ── 통신 레이어 ──
│  ├─ client.ts            # fetch 래퍼, 토큰 관리, 401 자동 재발급, 에러 파싱, USE_MOCK 스위치
│  ├─ errorCodes.ts        # 백엔드 에러 코드 카탈로그(18종) + 메시지 매핑
│  ├─ types.ts             # API 요청/응답 DTO 타입 (명세서 그대로)
│  ├─ auth.ts              # /auth/*  (login, signup, logout)
│  ├─ store.ts             # /stores/*  (getMyStore, registerStore, updateStore)
│  ├─ coupons.ts           # /coupon-templates, /coupons/*
│  ├─ partnerships.ts      # /partnerships/*
│  ├─ statistics.ts        # /stores/{id}/statistics
│  └─ mock/                # 목업 구현 (USE_MOCK=true일 때 사용)
│     ├─ data.ts           #   인메모리 DB(mockDb) + delay 헬퍼
│     ├─ auth.ts / store.ts / coupons.ts / partnerships.ts / statistics.ts
│
├─ state/                  # ── 상태 레이어 ──
│  ├─ context.ts           # AppContext 정의 + useApp() 훅 + 타입
│  └─ AppContext.tsx       # AppProvider: 전역 상태 + 모든 액션(비동기 API 호출 포함)
│
├─ pages/                  # ── 화면(탭) 레이어 ──
│  ├─ AuthPage.tsx         # 로그인 / 회원가입
│  ├─ StoreOnboardingPage.tsx  # 가게 미등록 시 최초 등록 폼
│  ├─ StorePage.tsx        # 가게 정보 조회/수정
│  ├─ MenuPage.tsx         # 메뉴 관리 (※ 로컬 전용, 백엔드 API 없음)
│  ├─ CouponPage.tsx       # 쿠폰 템플릿 목록/생성/삭제 + 발급(QR)
│  ├─ PartnershipPage.tsx  # 제휴 요청/수락/거절/해지
│  └─ StatisticsPage.tsx   # 기간별 발급·사용 통계
│
├─ theme/
│  └─ colors.ts            # 색상 팔레트 원본(primary=앰버, neutral=쿨그레이, 시맨틱)
│
├─ components/             # ── 공용 UI ──
│  ├─ Sidebar.tsx          # 좌측 네비게이션
│  ├─ TopBar.tsx           # 상단 제목/날짜
│  ├─ Toast.tsx            # 우측 상단 토스트 알림
│  ├─ ConfirmModal.tsx     # 삭제/해지 확인 모달
│  └─ icons/               # Icon.tsx + paths.ts (인라인 SVG 아이콘 세트, 이모지 미사용)
│
├─ data/
│  └─ constants.ts         # 카테고리, 네비 목록(NAV), 탭 메타(TAB_META)
└─ utils/
   └─ format.ts            # 숫자 포맷(fmt)
```

---

## 3.5 디자인 토큰 (색상)

팔레트 원본은 [`src/theme/colors.ts`](../src/theme/colors.ts), CSS 변수는 `index.css`의 `:root`에 1:1로 정의되어 있고 컴포넌트는 **시맨틱 토큰**만 참조한다.

| 계열 | 값 | 용도 |
|---|---|---|
| primary (앰버) | `#F9C74F`(500) 중심, 100~900 | 브랜드/버튼/활성 탭/강조 뱃지 |
| neutral (쿨그레이) | `#FFFFFF`~`#212529` | 배경·카드·테두리·본문·사이드바 |
| success | `#2E7D52` | 제휴중 등 긍정 상태 |
| error | `#DC2626` | 삭제/위험 |
| warning | `#F59E0B` | 경고 |

핵심 규칙:
- **앰버는 밝아서** 버튼·활성칩 위 텍스트는 어둡게(`--on-brand` = neutral900).
- 큰 숫자/가격 등 **본문성 강조 텍스트는 앰버 대신 다크**(neutral900) 또는 대비 확보용 `--brand-ink`(primary900 `#B87400`) 사용.
- 사이드바는 다크 뉴트럴(neutral900→800) 배경 + 앰버 활성 강조.

---

## 4. 아키텍처

### 4.1 레이어 구조

```
 화면(pages/components)
        │  useApp()
        ▼
 상태(state/AppContext)  ──── 전역 상태 보관 + 액션에서 API 호출
        │  api 함수 호출
        ▼
 통신(api/*.ts)  ──── USE_MOCK 분기
        ├─ false → client.apiFetch() → 실제 백엔드
        └─ true  → api/mock/* → 인메모리 목업
```

- **화면은 API를 직접 모른다.** 오직 `useApp()`으로 상태와 액션만 사용한다.
- **API 소스 전환은 한 곳(`USE_MOCK`)에서만.** 각 `api/*.ts` 함수가 `if (USE_MOCK) return mock.xxx()` 형태로 분기하므로, 화면·상태 코드는 목업이든 실서버든 동일하게 동작한다.

### 4.2 데이터 흐름 예시 (쿠폰 발급)

1. `CouponPage`에서 발급 버튼 클릭 → `useApp().issueCoupon(templateId)`
2. `AppContext.issueCoupon` → `couponsApi.issueCoupon()` 호출
3. `USE_MOCK`에 따라 실제 `POST /coupons/issue` 또는 목업 응답
4. 성공 시 `issuedCoupon` 상태 갱신 → `CouponPage`가 QR 모달 렌더
5. 실패 시 `ApiError` 메시지를 토스트로 표시

---

## 5. 상태 관리 (`AppContext`)

전역 상태와 그 상태를 바꾸는 모든 액션을 `AppProvider` 하나가 보관한다. 화면은 `useApp()`으로 접근.

주요 상태:

| 상태 | 설명 |
|---|---|
| `authed` / `authLoading` / `authMode` | 로그인 여부, 로딩, 로그인/회원가입 탭 |
| `store` / `storeStatus` | 내 가게 정보, 로드 상태(`idle`/`loading`/`needs-store`/`ready`/`error`) |
| `menu` | 메뉴 목록 (로컬 전용) |
| `couponTemplates` / `issuedCoupon` | 쿠폰 템플릿 목록, 방금 발급한 쿠폰(QR) |
| `partnerships` | 제휴 목록 |
| `statistics` | 통계 결과 |
| `confirmDelete` | 삭제/해지 확인 모달 대상 |
| `toastMsg` | 토스트 메시지 |

`storeStatus`가 인증 후 화면 분기를 결정한다 (아래 App 게이트 참고).

---

## 6. 화면 진입 흐름 (`App.tsx`)

```
authed == false                    → AuthPage (로그인/회원가입)
authed == true
  ├─ storeStatus == loading/idle   → "불러오는 중"
  ├─ storeStatus == needs-store    → StoreOnboardingPage (가게 최초 등록)
  ├─ storeStatus == error          → 에러 안내
  └─ storeStatus == ready          → Shell (사이드바 + 탭 화면)
```

- 로그인 성공 → `GET /stores/me` 시도 → 404(`STR_404`)면 `needs-store`로 온보딩, 성공하면 `ready`.
- 탭 구성은 `data/constants.ts`의 `NAV`에서 관리: **가게 정보 · 메뉴 관리 · 쿠폰 관리 · 제휴 관리 · 통계**.

---

## 7. 통신 레이어 상세

### 7.1 `client.ts` (실서버 경로)

- **토큰 관리**: `accessToken`/`refreshToken`을 `localStorage`에 보관 (`bap_access_token`, `bap_refresh_token`).
- **인증 헤더**: `auth !== false`인 요청에 `Authorization: Bearer {accessToken}` 자동 첨부.
- **401 자동 재발급**: 응답이 401이면 `POST /auth/refresh`로 토큰 재발급 후 원요청 1회 재시도. 재발급도 실패하면 토큰 폐기 + 재로그인 유도. (동시 401 다발 시 재발급은 1회만 — `refreshInFlight`로 중복 방지)
- **에러 파싱**: 실패 응답에서 `code`를 읽어 에러 카탈로그의 한국어 메시지로 변환. 없으면 `message`/`detail`/`title` → 상태코드 순 폴백.

### 7.2 에러 코드 시스템 (`errorCodes.ts`)

명세서 "예외 상황" 하위 페이지에서 확인한 18종을 카탈로그로 보관. 백엔드는 에러 응답에 최소 `code`를 내려주며, 프론트는 그 `code`로 사용자 메시지를 찾는다.

```ts
ERROR_CODES['CPN_404_01'] = {
  code: 'CPN_404_01', name: 'TEMPLATE_NOT_FOUND',
  status: 404, message: '존재하지 않는 쿠폰 템플릿입니다', type: 'CouponErrorCode'
}
messageForCode('CPN_404_01') // → '존재하지 않는 쿠폰 템플릿입니다'
apiErrorFromCode('STR_403')  // → ApiError(403, '본인 소유의 가게가 아닙니다', 'STR_403')
```

카탈로그 도메인: `GlobalErrorCode` / `UserErrorCode` / `JwtErrorCode` / `CouponErrorCode` / `StoreErrorCode` / `PartnershipErrorCode`.
`ApiError`는 `status`·`message`·`code`를 가지므로, 필요하면 UI에서 `code`별 분기도 가능.

### 7.3 목업 모드 (`api/mock/*`)

- `mockDb`(인메모리) 위에서 CRUD를 흉내낸다. **새로고침하면 초기 시드 데이터로 리셋**.
- 목업도 실패 시 `apiErrorFromCode('STR_404')`처럼 **실제와 같은 코드 형식**으로 던져서, 에러 처리 경로를 목업에서도 검증할 수 있다.
- 상태 연동 반영 예: 쿠폰 템플릿 목록 조회는 `mockDb.partnerships`에서 **ACCEPTED 상태 가게의 템플릿만** 노출한다 → 제휴를 해지하면 그 가게 쿠폰이 목록에서 사라진다.

---

## 8. 도메인별 기능 ↔ API 매핑

| 탭/화면 | 기능 | HTTP | Endpoint | 비고 |
|---|---|---|---|---|
| 인증 | 회원가입 | POST | `/auth/signup` | role=OWNER 고정 |
| 인증 | 로그인 | POST | `/auth/login` | access/refresh + role 반환 |
| 인증 | 로그아웃 | POST | `/auth/logout` | |
| (내부) | 토큰 재발급 | POST | `/auth/refresh` | 401 시 자동 |
| 온보딩 | 가게 등록 | POST | `/stores` | 위경도·카테고리·평균가 필수 |
| 가게 정보 | 내 가게 조회 | GET | `/stores/me` | 404면 온보딩 |
| 가게 정보 | 가게 정보 수정 | PATCH | `/stores/{storeId}` | 부분 수정 |
| 쿠폰 관리 | 템플릿 목록 | GET | `/coupon-templates` | 내 것 + 제휴 가게 것(`isMine`) |
| 쿠폰 관리 | 템플릿 생성 | POST | `/coupon-templates` | 내 가게 것만 |
| 쿠폰 관리 | 템플릿 삭제/비활성화 | PATCH | `/coupon-templates/{templateId}` | 내 것만, 발급된 쿠폰은 유효기간까지 유지 |
| 쿠폰 관리 | 쿠폰 발급(QR) | POST | `/coupons/issue` | QR payload + 만료초 반환 |
| 제휴 관리 | 제휴 목록 | GET | `/partnerships` | `status`(선택) 필터. 받은/보낸/활성/이력 분류 |
| 제휴 관리 | 제휴 요청 | POST | `/partnerships` | receiverStoreId |
| 제휴 관리 | 제휴 수락 | PATCH | `/partnerships/{id}/accept` | 받은 PENDING만 |
| 제휴 관리 | 제휴 거절 | PATCH | `/partnerships/{id}/reject` | 받은 PENDING만 |
| 제휴 관리 | 제휴 해지 | DELETE | `/partnerships/{id}` | ACCEPTED만 |
| 통계 | 발급/사용 통계 | GET | `/stores/{storeId}/statistics` | from/to 기간 |

> **메뉴 관리**는 API 명세서에 해당 도메인이 없어 **프론트 로컬 상태로만** 동작한다(발급/판매와 무관한 사장님 편의 기능).

---

## 9. 핵심 도메인 규칙 (쿠폰 × 제휴)

1. 쿠폰 **템플릿은 본인 가게 것만 생성**할 수 있다.
2. 다른 가게와 **제휴(요청 → 수락, ACCEPTED)** 를 맺으면, 상대 가게의 템플릿이 내 쿠폰 목록에도 보인다.
3. 발급은 내 템플릿·제휴 가게 템플릿 **둘 다 가능**(QR 생성). 발급한 쿠폰은 결제 손님이 **제휴 가게에서 사용**한다(상부상조 리퍼럴 구조).
4. **삭제(비활성화)는 내 템플릿만.** 삭제해도 이미 발급된 쿠폰은 유효기간까지 사용 가능.
5. 제휴 상태: `PENDING → ACCEPTED → TERMINATED` / `PENDING → REJECTED`. 수락·거절은 **받은 쪽(RECEIVED)** 만, 해지는 ACCEPTED에서 양쪽 다 가능.

---

## 10. 명세서와의 차이 / 보류 항목

최신 API 표(Notion)와 현재 프론트 구현 사이에 아직 확인이 필요한 불일치가 있어, **임의로 제거하지 않고 유지**한 항목:

- **쿠폰 템플릿 생성(POST `/coupon-templates`)** — 최신 표엔 GET만 있음. 생성 UI 유지 중.
- **제휴 수락/요청/해지** — 최신 표엔 거절·목록조회 2개만. 수락·요청·해지 UI 유지 중.
- **가게 등록(POST `/stores`) / 내 가게 조회(GET `/stores/me`)** — 최신 표엔 수정·상세조회만. 온보딩·조회 유지 중.
- **쿠폰 사용 코드(`/coupons/{id}/use-token`)** vs 최신 표의 **쿠폰 사용(`/coupons/{id}/use`)** — 이름/담당 상이. 콘솔 UI엔 미사용(고객 앱 영역).

→ 표가 아직 안 채워진 것인지 실제 범위 축소인지 **팀 확인 후** 유지/제거 결정.

---

## 11. TODO / 다음 작업

- [ ] 위 §10 불일치 팀 확인 → 범위 확정
- [ ] auth 백엔드 "완료" 상태 → 실서버 주소로 `VITE_USE_MOCK_API=false` 실연동 테스트
- [ ] 제휴 대상 가게 검색(`/stores/search`) 연동 시 "가게 ID 직접 입력"을 검색 UI로 교체
- [x] ~~`GET /partnerships` 실제 응답 스키마 확인 후 `api/types.ts`의 `Partnership` 정합~~ → 명세서 확인 완료. `partnerStore{storeId,name,category}` / `direction` / `status` / `createdAt`로 정합 완료, `status` 쿼리(선택) 지원 추가
- [ ] 백엔드 연동 완료 후 `api/mock/*` 및 각 `api/*.ts`의 `USE_MOCK` 분기 제거
