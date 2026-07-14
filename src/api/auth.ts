import { apiFetch, USE_MOCK } from './client';
import * as mock from './mock/auth';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './types';

export function login(body: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) return mock.login(body);
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body, auth: false });
}

export function signup(body: SignupRequest): Promise<SignupResponse> {
  if (USE_MOCK) return mock.signup(body);
  return apiFetch<SignupResponse>('/auth/signup', { method: 'POST', body, auth: false });
}

export function logout(): Promise<void> {
  if (USE_MOCK) return mock.logout();
  return apiFetch<void>('/auth/logout', { method: 'POST' });
}
