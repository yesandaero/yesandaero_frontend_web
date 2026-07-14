import type { AuthTokens, RefreshRequest } from './types';
import { ERROR_CODES, messageForCode } from './errorCodes';

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const ACCESS_TOKEN_KEY = 'bap_access_token';
const REFRESH_TOKEN_KEY = 'bap_refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  /** 백엔드 에러 코드 (예: "CPN_404_01"). 있으면 UI에서 코드별 분기 가능. */
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** 에러 코드로 ApiError를 만든다. 목업/클라이언트 공용. 미등록 코드면 400으로 처리. */
export function apiErrorFromCode(code: string): ApiError {
  const info = ERROR_CODES[code];
  return new ApiError(info?.status ?? 400, info?.message ?? '요청에 실패했어요', code);
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | undefined>;
}

let refreshInFlight: Promise<AuthTokens> | null = null;

async function rawRefresh(refreshToken: string): Promise<AuthTokens> {
  const body: RefreshRequest = { refreshToken };
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new ApiError(res.status, '토큰 재발급 실패');
  }
  return (await res.json()) as AuthTokens;
}

async function refreshAccessToken(): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError(401, '리프레시 토큰 없음');
  if (!refreshInFlight) {
    refreshInFlight = rawRefresh(refreshToken).finally(() => {
      refreshInFlight = null;
    });
  }
  const tokens = await refreshInFlight;
  setTokens(tokens);
  return tokens;
}

function buildUrl(path: string, query?: Record<string, string | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

/** 에러 응답에서 코드와 사용자 메시지를 뽑는다. code가 카탈로그에 있으면 그 메시지를 우선한다. */
async function parseApiError(res: Response): Promise<{ code?: string; message?: string }> {
  try {
    const data = await res.clone().json();
    const code: string | undefined = data?.code;
    const message = messageForCode(code) || data?.message || data?.detail || data?.title;
    return { code, message };
  } catch {
    return {};
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, query } = options;
  const url = buildUrl(path, query);

  async function doFetch(): Promise<Response> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      const token = getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  let res = await doFetch();

  if (res.status === 401 && auth && path !== '/auth/refresh') {
    try {
      await refreshAccessToken();
      res = await doFetch();
    } catch {
      clearTokens();
      throw new ApiError(401, '인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  if (!res.ok) {
    const { code, message } = await parseApiError(res);
    throw new ApiError(res.status, message || `요청에 실패했어요 (${res.status})`, code);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
